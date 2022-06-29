describe('empty spec', () => {
  it('iNat', () => {
    // cy.origin('https://dev.inat.techotom.com', ()=> {
    //       // Visit iNat login page
    // cy.visit('/users/sign_in')
    // // Provide login credentials 
    // cy.get('#user_email').type('toktest')
    // cy.get('#user_password').type('junkjunk')
    // // Log in Button
    // cy.get('[name="commit"]').click()
    // })
    // cy.origin('localhost:8080', ()=> {
    //   cy.visit('/')
    // })
    // Cypress.Commands.add('login', (username, password) => {
    //   const args = { username, password }
    //   cy.session(
    //     // Username & password can be used as the cache key too
    //     args,
    //     () => {
    //       cy.origin('https://dev.inat.techotom.com', { args }, ({ username, password }) => {
    //         cy.visit('/users/sign_in')
    //         cy.contains('Username').find('input').type(username)
    //         cy.contains('Password').find('input').type(password)
    //         cy.get('button').contains('Login').click()
    //       })
    //       cy.url().should('contain', '/home')
    //     },
    //     {
    //       validate() {
    //         cy.request('/api/user').its('status').should('eq', 200)
    //       },
    //     }
    //   )
    // })
    // cy.visit('/')
  //   const username = 'toktest'
  //   const password = 'junkjunk'
  //   cy.session([username, password], () => {
  //     cy.request({
  //       method: 'POST',
  //       url: 'dev.inat.techotom.com/users/sign_in',
  //       body: {
  //         username,
  //         password
  //       },
  //     }).then(({
  //       response
  //     }) => {
  //       console.log('body')
  //       console.log(response.body)
  //       window.localStorage.setItem('authToken', response)
  //     })
  //   })
  //   console.log(window.localStorage)
  //   cy.visit('/oauth-callback?code=')
  // })
  })
})