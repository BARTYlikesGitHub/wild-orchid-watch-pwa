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

  context('Use redirectTo and a session cookie to logdin', function () {

    it('is 403 unauthorized without a session cookie', function () {
      cy.visit('/')

      cy.url().should('include', '8080')
    })

    it('can authenticate with cy.request', function () {

      cy.getCookie('cypress-session-cookie').should('not.exist')

      cy.loginBySingleSignOn().then((resp) => {

        expect(resp.status).to.eq(200)
        //   expect(resp.body).to.include('<h1>Welcome to the Dashboard!</h1>')
        // })

        // cy.get('h1').should('contain', 'Welcome to the Dashboard')
      })
      // cy.getCookie('auth').should('exist')
      cy.visit('http://localhost:8080')
    })

    it('can authenticate with cy.request', function () {
      // before we start, there should be no session cookie
      cy.getCookie('cookie').should('not.exist')

      // this automatically gets + sets cookies on the browser
      // and follows all of the redirects that ultimately get
      // us to /dashboard.html
      cy.loginBySingleSignOn().then((resp) => {
        // yup this should all be good
        expect(resp.status).to.eq(200)
        console.log(resp)
        console.log(resp.headers["set-cookie"][0])
        let respC = resp.headers["set-cookie"][0]
        let cookie = respC.substring(17, 49) 
        console.log(cookie)
        cy.setCookie("cookie", cookie,{httpOnly: true})
        // we're at http://localhost:7074/dashboard contents
        //expect(resp.body).to.include('<h1>Welcome to the Dashboard!</h1>')
        // cy.setCookie('cyp', '65656391b8092fb7cf3c6262380a8ff8')
      })

      // the redirected page hits the server, and the server middleware
      // parses the authentication token and returns the dashboard view
      // with our cookie 'cypress-session-cookie' set
      cy.getCookie('cookie').should('exist')

      // you don't need to do this next part but
      // just to prove we can also visit the page in our app
      cy.visit('/')

     // cy.get('h1').should('contain', 'Welcome to the Dashboard')
    })
  })
})