import {
    Given,
    When,
    And,
    Then,
  } from "@badeball/cypress-cucumber-preprocessor";
  
  Given("El usuario se loggea en Armonix {string}{string}", (username, password) => {
    cy.session('Login', () => {
      cy.visitUrl();
      cy.log(username);
      cy.log(password);
      cy.typeUsername(username);
      cy.typePassword(password);
      cy.clickLogin();
      cy.getTokenService(username,password);
      
    });

  });
  
  //Liquidaciones e ingresar contrato
  When("Un usuario accede Liquidaciones e ingresa el contrato {string}", (numContract) => {    
    cy.pLiquidations();
    cy.typeContract(numContract);
  });
  
  //Listar y seleccionar beneficiarios
  Then("El usuario selecciona al benficiario y procede a la liquidación {string}{string}{string}{string}{string}{string}{string}{string}", (numContract,numRUC,
    diagnosticCode, numRequest, tInvoice, procedure, quantity,presented) => {
    cy.selectContract();
    cy.validateContract(numContract,numRUC,diagnosticCode, numRequest, tInvoice, procedure, quantity, presented);
  });
/*
  And("El usuario ingresa los datos de la factura {string}{string}{string}{string}", (tInvoice,procedure, quantity, presented) =>{
    cy.newInvoice(tInvoice);
    cy.invoiceDetails(procedure, quantity, presented);
  })
*/