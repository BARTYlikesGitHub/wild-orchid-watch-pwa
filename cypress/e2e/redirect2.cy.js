const _ = Cypress._

// require node's url module
const url = require('url')

describe('Logging In - Single Sign on', function () {
  Cypress.Commands.add('loginBySingleSignOn', (overrides = {}) => {
    Cypress.log({
      name: 'loginBySingleSignOn',
    })
    const options = {
      method: 'POST',
      url: 'dev.inat.techotom.com/users/sign_in',
      qs: {
        // use qs to set query string to the url that creates
        // http://auth.corp.com:8080?redirectTo=http://localhost:7074/set_token
        redirectTo: 'http://localhost:8080/oauth-callback?code_challenge=',
      },
      form: true, // we are submitting a regular form body
      body: {
        username: 'toktest',
        password: 'junkjunk',
      },
    }

    // allow us to override defaults with passed in overrides
    _.extend(options, overrides)

    cy.request(options)
  })

  describe('Log in once for speed', () => {
    // in this example we follow SPA workflow, get the auth token once
    // and then set it in window.localStorage before each test
    // and voilá - we are logged in very quickly

    before(function () {
      // before any tests execute, get the token once
      // as save it in the test context - thus the callback
      // is using "function () { ... }" form and NOT arrow function
      cy.loginBySingleSignOn({
          followRedirect: false
        })
        .then(responseToToken)
        .as('token') // saves under "this.token"
    })

    beforeEach(function () {
      // before every test we need to grab "this.token"
      // and set it in the local storage,
      // so the application sends with and the user is authenticated
      cy.on('window:before:load', (win) => {
        win.localStorage.setItem('id_token', this.token)
      })
    })

    it('opens page as logged in user', () => {
      cy.visit('/')
      cy.contains('"loggedIn":true')
    })

    it('config returns logged in: true', function () {
      // note again this test uses "function () { ... }" callback
      // in order to get access to the test context "this.token" saved above

      cy.server()
      // observe the "GET /config" call from the application
      cy.route('/config').as('getConfig')

      cy.visit('/')

      cy.wait('@getConfig').then((xhr) => {
        // inspect sent and received information
        expect(
          xhr.request.headers,
          'request includes token header'
        ).to.have.property('x-session-token', this.token)

        expect(xhr.response.body, 'response body').to.deep.equal({
          foo: 'bar',
          loggedIn: true,
          some: 'config',
        })
      })
    })
  })
})