
describe('Petstore API Automation Tests', () => {
  // Define the base URL for the Petstore API
  const BASE_URL = 'https://petstore.swagger.io/v2';

  // Test Case 1: Automate add new pet test case and verify the response
  it('1. Should successfully add a new pet and verify the response', () => {
    // Define the new pet data
    const newPet = {
      id: Math.floor(Math.random() * 100000), // Generate a random ID for uniqueness
      category: {
        id: 1,
        name: 'Dogs'
      },
      name: 'John',
      photoUrls: [
        'https://example.com/john.jpg'
      ],
      tags: [{
        id: 1,
        name: 'friendly'
      }],
      status: 'available'
    };

    cy.log('Adding a new pet:', JSON.stringify(newPet, null, 2));

    // Make a POST request to add the new pet
    cy.request({
      method: 'POST',
      url: `${BASE_URL}/pet`,
      body: newPet,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      cy.log('Response from adding pet:', JSON.stringify(response.body, null, 2));

      // Verify the response status code is 200 (OK)
      expect(response.status).to.eq(200);

      // Verify the response body matches the sent pet data
      expect(response.body).to.have.property('id', newPet.id);
      expect(response.body).to.have.property('name', newPet.name);
      expect(response.body).to.have.property('status', newPet.status);
      expect(response.body.category).to.deep.include(newPet.category); // Use deep.include for nested objects
      expect(response.body.photoUrls).to.deep.equal(newPet.photoUrls);
      expect(response.body.tags[0]).to.deep.include(newPet.tags[0]);
    });
  });

  // Test Case 2: Automate find pet by status test case for "available" status
  it('2. Should find pets with "available" status and verify all responses have correct status', () => {
    const status = 'available';

    cy.log(`Finding pets with status: "${status}"`);

    // Make a GET request to find pets by status
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/pet/findByStatus?status=${status}`,
      failOnStatusCode: false // Allow Cypress to not fail on non-2xx status codes
    }).then((response) => {
      cy.log(`Response from finding pets (${status}):`, JSON.stringify(response.body, null, 2));

      // Verify the response status code is 200 (OK)
      expect(response.status).to.eq(200);

      // Verify the response body is an array
      expect(response.body).to.be.an('array');

      // Verify that the response array is not empty (assuming there should be available pets)
      expect(response.body).to.have.length.greaterThan(0);

      // Verify that every pet in the response has the status "available"
      response.body.forEach(pet => {
        expect(pet).to.have.property('status', status);
      });
    });
  });

  // Test Case 3: Automate find pet by status test case for "pending" status
  it('3. Should find pets with "pending" status and verify all responses have correct status', () => {
    const status = 'pending';

    cy.log(`Finding pets with status: "${status}"`);

    // Make a GET request to find pets by status
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/pet/findByStatus?status=${status}`,
      failOnStatusCode: false // Allow Cypress to not fail on non-2xx status codes
    }).then((response) => {
      cy.log(`Response from finding pets (${status}):`, JSON.stringify(response.body, null, 2));

      // Verify the response status code is 200 (OK)
      expect(response.status).to.eq(200);

      // Verify the response body is an array
      expect(response.body).to.be.an('array');

      // Verify that the response array is not empty (assuming there should be pending pets)
      expect(response.body).to.have.length.greaterThan(0);

      // Verify that every pet in the response has the status "pending"
      response.body.forEach(pet => {
        expect(pet).to.have.property('status', status);
      });
    });
  });
});
