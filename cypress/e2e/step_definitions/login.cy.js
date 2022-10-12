import {
  Given,
  When,
  And,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

/*Given("Un usuario abre la página web", () => {
  cy.visitUrl();
});*/

When("Un usuario se loguea en el sistema de Armonix {string} {string} {string}", (username, password, title) => {
  cy.visitUrl();
  cy.getTokenService(username,password);
  cy.log(username);
  cy.log(password);
  cy.typeUsername(username);
  cy.typePassword(password);
  cy.clickLogin();
  cy.validateTitle(title);
});

/*When("Un usuario proporciona credenciales incorrectas {string}{string}", (username, password) => {
  cy.log(username);
  cy.log(password);
  cy.typeUsername(username);
  cy.typePassword(password);
});

And("Un usuario ingresa la contraseña {string}", (password) => {
  cy.typePassword(password);
});

And("Un usuario hace click en el botón de inicio de sesión", () => {
  cy.clickLogin();
});

Then("El título de la página contendrá {string}", (title) => {
  cy.validateTitle(title);
});
Then("Se muestra el mensaje de error {string}", (errorMessage) => {
  cy.errorMessage(errorMessage);
});*/