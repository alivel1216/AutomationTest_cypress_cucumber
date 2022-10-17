import {
  Given,
  When,
  And,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

Given("Un usuario se loguea en Armonix {string} {string} {string}", (username, password, title) => {
  cy.visitUrl();
  cy.getTokenService(username,password);
  cy.log(username);
  cy.log(password);
  cy.typeUsername(username);
  cy.typePassword(password);
  cy.clickLogin();
  cy.validateTitle(title);
});
//Liquidaciones e ingresar contrato
When("Un usuario accede en Liquidaciones e ingresa el contrato {string}", (numContract) => {
  cy.pLiquidations();
  cy.typeContract(numContract);
});

//Listar y seleccionar beneficiarios
Then("Un usuario accede al listado de benficiarios", () => {
  cy.beneficiariesList();
});

//Seleccionar el benificiario y dar click
And("Un usuario selecciona un beneficiario", () => {
  cy.selectBeneficiarie();
});

//Nueva liquidación
When("Un usuario da click en el botón de Nueva Liquidación", () => {
  cy.clickNewLiquidation();
})

//Seleccionar oficina de liquidación
Then("Un usuario selecciona la oficina de liquidación", () => {
  cy.liquidationOfice();
});

//Ingresar el RUc del prestador
And("Un usario ingresa el RUC del prestador {string}", (numberRUC) => {
  cy.lendersRUC(numberRUC);
});

//Ingresar el Código del diagnóstico
And("Un usuario ingresa el diagnóstico {string}", (diagnosticCode) => {
  cy.diagnostic(diagnosticCode);
});

//Ingresar la fecha de incurrencia
When("Un usuario ingresa la fecha de incurrencia {string}", (date) => {
  cy.dateIncurrence(date);
});

//Seleccionar el lugar de atención y número de solicitud
And("Un usuario selecciona el lugar de atención y número de solicitud {string}", (numberRequest) => {
  cy.placeAttention(numberRequest);
});

//Guardar y continuar la liquidación
Then("Un usuario guarda y continua la liquidación", () => {
  cy.saveContinue();
});

//Ingresar un nueva factura
When("Un usario ingresa un nueva factura", () => {
  cy.newInvoice();
});

//Ingresar fecha de emisión y RUC del prestador
Then("Un usuario ingresa la fecha de emisión y ruc del prestador {string} {string}", (issueDate, RUC) => {
  cy.issueAndRUC(issueDate, RUC);
});
//Ingresa numero de factura
And("Un usuario ingresa el número de factura {string} {string} {string}", (establishment, facToEmi, secuence) => {
  cy.invoiceNumber(establishment, facToEmi, secuence);
});

And("Un usuario ingresa la fecha de inicio y fin de la autorización y la autorización {string} {string} {string}", (dateInit, dateEnd, amortizationNum) => {
  cy.dateInitEndAmortization(dateInit, dateEnd, amortizationNum);
});

And("Un usuario ingresa el total de la factura {string}", (tInvoice) => {
  cy.totalAndSaveInvoice(tInvoice);
});

When("Un usuario ingresa el detalle de la factura {string} {string} {string}", (procedure, quantity, presented) => {
  cy.invoiceDetails(procedure, quantity, presented);
});