describe('Create New Observation - Speed Run, No EXIF', () => {
  it('visit root, and completes onboarding', () => {
    // Start at site root
    cy.visit('/')
    //Click through Onboarder
    cy.get('[class=dot]').click({
      multiple: true,
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
    // Enable `Detailed Mode`
    cy.get('ons-switch.switch').click()

    /**
     *  Radio group is selected
     */
    // Select a Manual Entry Text Field
    cy.get('#manual-lat.text-input').click()
    // Should auto select the attached radio button
    // TODO: not working
    // cy.get('label')
    //   .contains(
    //     'Manually enter decimal GPS coordinates. Useful for when you have a standalone GPS.',
    //   )
    //   .should('be.checked')

    /**
     *  Not a Number Input
     */
    // Enter Numbers into Lat
    cy.get('#manual-lat.text-input').type('123')
    // Enter Letters int Lon
    cy.get('#manual-lon.text-input').type('abc')
    //  expected: a warning is shown to indicate invalid input
    cy.get('div.warning-alert').should(
      'contain',
      'Invalid value(s). Please only enter numbers.',
    )

    // Clear Text Fields
    cy.get('#manual-lat.text-input').clear()
    cy.get('#manual-lon.text-input').clear()

    /**
     *  Valid Decimals in Australia (Given coords - Adeliade)
     */
    // Enter Numbers into Lat
    cy.get('#manual-lat.text-input').type('-33.123')
    // Enter Letters int Lon
    cy.get('#manual-lon.text-input').type('150.456')
    //  expected: the values are valid
    // TODO: ` .`  counting as `not a number`
    // cy.get('div.warning-alert').should(
    //   'contain',
    //   'Invalid value(s). Please only enter numbers.',
    // )

    // Clear Text Fields
    cy.get('#manual-lat.text-input').clear()
    cy.get('#manual-lon.text-input').clear()

    /**
     * Valid Decimals Outside Australia
     */
    // Enter Numbers into Lat (Less then -55)
    cy.get('#manual-lat.text-input').type('-55')
    // Enter Letters int Lon (Less then 168)
    cy.get('#manual-lon.text-input').type('168')
    //  expected: you get a warning saying the values are outside of Australia
    cy.get('div.warning-alert').should(
      'contain',
      "Your coordinates (-55,168) look like they're outside Australia. This app is only for observations made in Australia, sorry.",
    )

    // Clear Text Fields
    cy.get('#manual-lat.text-input').clear()
    cy.get('#manual-lon.text-input').clear()

    // Enter Numbers into Lat (More then -10)
    cy.get('#manual-lat.text-input').type('-10')
    // Enter Letters int Lon (Less then 168)
    cy.get('#manual-lon.text-input').type('105')
    //  expected: you get a warning saying the values are outside of Australia
    cy.get('div.warning-alert').should(
      'contain',
      "Your coordinates (-10,105) look like they're outside Australia. This app is only for observations made in Australia, sorry.",
    )

    // Clear Text Fields
    cy.get('#manual-lat.text-input').clear()
    cy.get('#manual-lon.text-input').clear()

    /**
     *  Valid Intergers
     */
    // Enter Numbers into Lat
    cy.get('#manual-lat.text-input').type('-33')
    // Enter Letters int Lon
    cy.get('#manual-lon.text-input').type('150')
    //expected: the values are valid
    cy.get('div.success-alert').should('contain', 'Success')
  })
})
