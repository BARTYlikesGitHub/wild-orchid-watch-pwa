describe('Create New Observation - Speed Run, No EXIF', () => {
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

    // TODO: should be witin a seperate it(), however needs to re-Auth or alt solution -
    // TODO: current work around if just do tests in same it() as login
    // Click Add Observation 
    cy.get('[icon=md-plus]').click()
    // Add Whole Plant Photo
    cy.get('#whole-plant-add.photo-button').selectFile('public/img/help/photo-flower.jpg')
    // Add Habitat Photo
    cy.get('#habitat-add.photo-button').selectFile('public/img/help/photo-habitat.jpg')
    // Add Micro-Habitat Photo
    cy.get('#micro-habitat-add.photo-button').selectFile('public/img/help/photo-micro-habitat.jpg')
    // Type Species Name
    cy.get('input.search-input').type("Cypress Test Field Name")
    // Select radio, to use current devices geolocation 
    cy.get('label').contains('Use geolocation of this device, right now.').click()
    // Accept Alert
    cy.get('ons-alert-dialog-button').contains('OK').click()
    // Select radio, to use current devices date/time
    cy.get('label').contains('Use date/time of this device, right now.').click()
    // Select dropdown for orchid type (uses first - BAD)
    cy.get('select.select-input').first().select('Terrestrial')
    // Press Save
    cy.get('ons-button.button').contains('Save').click()
    // Wait 40 seconds
    cy.wait(40000)
    // Navigate back to 'My Observations'
    cy.get('ons-toolbar-button.toolbar-button--quiet.toolbar-button').contains('Home').click()
  })
})