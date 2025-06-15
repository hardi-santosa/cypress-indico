describe('Registration Form Automation Test', () => {
  const BASE_URL = 'https://demo.automationtesting.in/Register.html';
  // Use beforeEach to visit the page before each test case
  beforeEach(() => {
    // --- IMPORTANT: Handle uncaught exceptions ---
    // The demo site often throws "angular is not defined" or "Script error"
    // due to its internal JavaScript setup or cross-origin scripts.
    // This handler prevents Cypress from failing the test prematurely on these known issues.
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Check if the error message contains the expected Angular error or a generic Script error
      if (err.message.includes('angular is not defined') || err.message.includes('Script error.')) {
        // Log a warning to the console, but prevent the test from failing
        console.warn('Cypress caught an expected uncaught exception:', err.message);
        return false; // Return false to prevent Cypress from failing the test
      }
      // If it's a different, unexpected error, let Cypress fail the test
      return true;
    });
    
    cy.intercept('GET', 'https://restcountries.eu/rest/v1/all', {
      statusCode: 200,
      body: [
        // Provide a minimal set of mock country data that the dropdown expects
        // The actual site expects objects with a 'name' property.
        { "name": "United States of America", "capital": "Washington D.C." },
        { "name": "Canada", "capital": "Ottawa" },
        { "name": "Mexico", "capital": "Mexico City" },
        { "name": "India", "capital": "New Delhi" },
        { "name": "Australia", "capital": "Canberra" },
        { "name": "France", "capital": "Paris" },
        { "name": "Germany", "capital": "Berlin" },
        { "name": "Japan", "capital": "Tokyo" },
        // Add more countries if your tests require them to be selectable
      ],
      // Add 'Access-Control-Allow-Origin' header to the mock response
      // This is crucial for Cypress to treat it as a valid response
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    }).as('getCountries'); // Alias the intercept for potential waiting later if needed
   
    cy.intercept('GET', 'https://api.mlab.com/api/1/databases/userdetails/collections/newtable?apiKey=*', {
        statusCode: 200,
        body: {
          message: 'User registered successfully!',
          // Add any other data the frontend might expect in a successful response
          // e.g., userId: '12345'
        }
    }).as('registerUser'); // Give it an alias for waiting later

    // Visit the registration page
    cy.visit(BASE_URL);
    cy.url().should('include', '/Register.html'); // Assert that we are on the correct page
  });

  it('should successfully fill out all fields on the registration form', () => {
    // 1. Fill in Personal Details
    cy.get('input[ng-model="FirstName"]')
      .should('be.visible')
      .type('seleksi', { delay: 50 })
      .should('have.value', 'seleksi'); // Verify input

    cy.get('input[ng-model="LastName"]')
      .should('be.visible')
      .type('indico', { delay: 50 }) // Type last name
      .should('have.value', 'indico');

    cy.get('textarea[ng-model="Adress"]')
      .should('be.visible')
      .type('Permata hijau blok H 11, kebayoran lama', { delay: 10 }) // Type address

    cy.get('input[ng-model="EmailAdress"]')
      .should('be.visible')
      .type('seleksi.indico@mail.com', { delay: 50 }) // Type email
      .should('have.value', 'seleksi.indico@mail.com');

    cy.get('input[ng-model="Phone"]')
      .should('be.visible')
      .type('0123456789', { delay: 50 }) // Type phone number
      .should('have.value', '0123456789');

    // 2. Select Gender
    cy.get('input[value="Male"]')
      .should('be.visible')
      .check() // Select Male radio button
      .should('be.checked'); // Assert it's checked

    // 3. Select Hobbies (you can select multiple)
    cy.get('#checkbox1') // Cricket
      .should('be.visible')
      .check()
      .should('be.checked');

    cy.get('#checkbox2') // Movies
      .should('be.visible')
      .check()
      .should('be.checked');

    // Leave checkbox3 (Hockey) unchecked for variety

    // // 4. Select Languages (Multi-select dropdown)
    cy.get('#msdd')
      .should('be.visible')
      .click({ force: true }); // Click to open the language dropdown

    // Select specific languages by clicking on their text within the dropdown list
    cy.get('.ui-corner-all').contains('English').click();
    cy.get('.ui-corner-all').contains('French').click();
    cy.get('.ui-corner-all').contains('Japanese').click();

    // After selecting, click outside the dropdown to close it
    // Clicking the body at a specific coordinate can help ensure it closes reliably.
    cy.get('body').click(0,0); // Click on the top-left corner of the body

    // Assert that the selected languages are displayed in the #msdd field
    // Note: The display format might vary, so checking for inclusion of text is safer.
    cy.get('#msdd').should('contain', 'English').and('contain', 'French').and('contain', 'Japanese');

    // 5. Select Skills (Single select dropdown)
    cy.get('#Skills')
      .should('be.visible')
      .select('Software') // Select "Software" from the dropdown by its text or value
      .should('have.value', 'Software'); // Assert the selected value

    // 6. Select Country (Single select dropdown - dynamic, requires typing and selecting from results)
    // The #Countries dropdown here is special, it's not a standard <select> but a custom one.
    // It requires typing and then selecting from suggestions.
    cy.get('#countries')
      .should('be.visible')
      .select('United States of America')
      .should('have.value', 'United States of America');

    cy.get('span[role="combobox"]').click(); // Click the custom select box to activate it
    cy.get('input.select2-search__field')
        .type('United States of America', { delay: 50 }); // Type the country name
    cy.get('.select2-results__option')
        .contains('United States of America')
        .click(); // Click the suggested option

    cy.get('span[role="combobox"]').should('contain', 'United States of America'); // Assert selection


    // 7. Select Date of Birth
    cy.get('#yearbox')
      .should('be.visible')
      .select('2005') // Select year
      .should('have.value', '2005');

    cy.get('select[ng-model="monthbox"]')
      .should('be.visible')
      .select('June') // Select month
      .should('have.value', 'June');

    cy.get('#daybox')
      .should('be.visible')
      .select('15') // Select day
      .should('have.value', '15');

    // 8. Enter Passwords
    cy.get('#firstpassword')
      .should('be.visible')
      .type('INDicoP@ssw0rd!') // Type password
      .should('have.value', 'INDicoP@ssw0rd!');

    cy.get('#secondpassword')
      .should('be.visible')
      .type('INDicoP@ssw0rd!')
      .should('have.value', 'INDicoP@ssw0rd!');

    // 9. Assert Submit and Refresh buttons are visible then click submit
    cy.get('#Button1')
      .should('be.visible')

    cy.get('#submitbtn')
      .should('be.visible')
      .click()

    // // 10. Assert success submited 
    // // with response page reloaded and url changed included radiooptions and sign up
    // cy.url().should('include', '?radiooptions=Male&signup=sign+up');

    // // after reloaded all field form empty
    // cy.get('input[ng-model="FirstName"]')
    //   .should('be.visible')
    //   .should('have.value', ''); // Verify empty

    // cy.get('input[ng-model="LastName"]')
    //   .should('be.visible')
    //   .should('have.value', ''); // Verify empty

    // cy.get('#firstpassword')
    //   .should('be.visible')
    //   .should('have.value', ''); // Verify empty

    // cy.get('#secondpassword')
    //   .should('be.visible')
    //   .should('have.value', ''); // Verify empty

    // cy.get('input[ng-model="EmailAdress"]')
    //   .should('be.visible')
    //   .should('have.value', ''); // Verify empty

    // cy.get('input[ng-model="Phone"]')
    //   .should('be.visible')
    //   .should('have.value', ''); // Verify empty
  });
});