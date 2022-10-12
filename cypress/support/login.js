import { isEmpty } from "lodash";

const time = 2500;

Cypress.Commands.add('visitUrl', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  });
  cy.visit("/");
  cy.wait(time);
});

Cypress.Commands.add('typeUsername', (username) => {
  cy.get("#userName").should("be.visible").clear().type(username);
  cy.wait(time);
});

Cypress.Commands.add('typePassword', (password) => {
  cy.get("#password").should("be.visible").clear().type(password);
  cy.wait(time);
});

Cypress.Commands.add('clickLogin', () => {
  cy.get("button[type='submit']").click();
  cy.wait(time);
});

Cypress.Commands.add('errorMessage', (errorMessage) => {
  cy.get('.alert.alert-danger').should("have.text", errorMessage);
  cy.wait(time);
});

Cypress.Commands.add('validateTitle', (title) => {
  cy.title().should("equal", title);
  cy.wait(time);
});
