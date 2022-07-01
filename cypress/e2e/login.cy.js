describe('Logging into WOW through onboarder', () => {
  it('visit root, and completes onboarding', () => {
    // Start at site root
    cy.visit('/')
    //Click through Onboarder
    cy.get("[class=dot]").click({
      multiple: true
    })
    cy.get('ons-button').click()
    // Check we hit the iNat sign in page
    cy.url().should('include', '/users/sign_in').and('include', 'inat')
    // Provide login credentials 
    cy.get('#user_email').type('toktest')
    cy.get('#user_password').type('junkjunk')
    // Log in Button
    cy.get('[name="commit"]').click()
    // Check if we have returned to the base site
    // cy.url().should('include', '/users/sign_in').and('include', 'inat')
    // Check if we are on the 'My Observations' page
    cy.get('div').should('contain', 'My Observations')
  })
})