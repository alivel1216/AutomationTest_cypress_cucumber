const loginPage = require("../pages/LoginPage")

describe('empty spec', () => {
  it('passes', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    });
    cy.visit("https://pruebas.redsaludsa.com/aplicaciones/consultas360/#/login");
    loginPage.typeUsername("EDPALADINES");
    loginPage.typePassword('aefdae464f3');
    loginPage.clickLogin();
    loginPage.elements.errorMessage();
  })
})