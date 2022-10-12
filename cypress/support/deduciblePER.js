import { isEmpty } from "lodash";
require('cypress-xpath');
const time = 2500;
/*
Cypress.Commands.add('visitUrl', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  });
  cy.visit("/");
  cy.wait(time);
});
*/
//acceder a la página de liquidaciones
Cypress.Commands.add('pLiquidations', () => {
  cy.xpath("//*[@class='has-arrow']/span[1][contains(.,'Liquidaciones')]").should("be.visible").click();
  cy.wait(time);
  cy.xpath("//a[@href='#/liquidacion/list' ] ").click();
  cy.wait(time);
});


//ingresar un contrato
Cypress.Commands.add('typeContract', (numberContract) => {
  expect(numberContract).to.not.be.empty;
  cy.get("#numeroContrato").should("be.visible").click({force: true}).type(numberContract);
  //cy.get("#numeroContrato").should("be.visible").type(numberContract);
  cy.get("button.btn").click({force: true});
  cy.wait(time);
});

Cypress.Commands.add('beneficiariesList', () => {
  cy.get("td.centerMiddle").should("be.visible").click({force:true});
  cy.wait(time);
});

//Seleccionar beneficiaro
Cypress.Commands.add('selectBeneficiarie', () => {
  //cy.xpath("//td[contains(.,'58280631')]").click();
  cy.xpath("//td[contains(.,'TITULAR')]").click();
  //cy.get("#beneficiarioLiqId > tbody > tr:nth-child(3) > td:nth-child(2)").click();
  cy.wait(time);
});

//Nueva Liquidación
Cypress.Commands.add('clickNewLiquidation', () => {
  cy.get("#btnNuevo").should("be.visible").click();
  cy.wait(time);
});

//Seleccionar oficina de liquidación
Cypress.Commands.add('liquidationOfice', () => {
  //cy.get("#slcOficina").select('Reembolso Online UIO').should("be.visible").should('have.value', '17')  
  cy.get('#slcOficina').select('Reembolso Online UIO', {force:true}).should('have.value', '17')
  
});

//Ingresar el RUC del prestador
Cypress.Commands.add('lendersRUC', (numberRUC) => {
  cy.get('#rucPrestadorIdPrincipal').type(numberRUC)
})

//Ingresar el Código del diagnóstico
Cypress.Commands.add('diagnostic', (diagnosticCode) => {
  cy.get('#incialDiagnosticoC').should("be.visible").clear().type(diagnosticCode);
  cy.xpath("//a[@class='lupita']").click();
  cy.get('#tipoEnfermedadId').select('Cronica', {force:true}).should('have.value', 'Cronica')
  cy.wait(time);
});

//Ingresar la fecha de incurrencia
Cypress.Commands.add('dateIncurrence', (date) => {
  cy.get('#fechaIncurrencia').should("be.visible").clear().type(date);
  cy.wait(time);
});

//Seleccionar el lugar de atención
Cypress.Commands.add('placeAttention', (numberRequest) => {
  cy.get('#lugarAtencionId').select('Consulta Externa', {force:true}).should('have.value', 'Consulta Externa');
  cy.get("#numSobreCualquiera").should("be.visible").clear().type(numberRequest);
  cy.get('#idDeducible').select('INCAPACIDAD BAJO EDAD', {force:true}).should('have.value', 'INC01');
  cy.wait(time);
});

//Guardar y continuar la liquidación
Cypress.Commands.add('saveContinue', () => {
  cy.xpath("//button[contains(.,'Guardar y Continuar')]").click();
  cy.wait(time);
});

//Ingresar un nueva factura
Cypress.Commands.add('newInvoice', () => {
  cy.xpath("//button[contains(.,'Ingresar Factura')]").should("be.visible").click();
  cy.wait(time);
});

//Ingresar fecha de emisión y RUC del prestador
Cypress.Commands.add('issueAndRUC', (issueDate,RUC) => {
  cy.xpath("//input[@id='fechaEmisionId']").type(issueDate, {force:true});
  cy.xpath("//facturaliquidacion/*//td[contains(.,'67404')]").click({force:true});
  //cy.xpath("//input[@id='rucPrestadorId']").type(RUC, {force:true});
  cy.wait(time);
});

Cypress.Commands.add('invoiceNumber', (establishment, facToEmi, secuence) => {
  cy.xpath("//input[@id='establecimeintoId']").type(establishment, {force:true});
  cy.get('#numFacPtoEmi').type(facToEmi, {force:true});
  cy.get('#secuencialId').type(secuence, {force:true});
  cy.wait(time);
});

Cypress.Commands.add('dateInitEndAmortization', (dateInit, dateEnd, amortizationNum) => {
  cy.get('#slcFechaInicioAutorizacion').type(dateInit, {force:true});
  cy.get('#slcFechaFinAutorizacion').type(dateEnd, {force:true});
  cy.xpath("//input[@id='numeroAutorizacionId']").type(amortizationNum, {force:true});
  cy.wait(time);
});

Cypress.Commands.add('totalAndSaveInvoice', (tInvoice) => {
  cy.xpath("//input[@id='totalFacturaId']").click({force:true}).clear({force:true}).type(tInvoice, {force:true});
  cy.xpath("//input[@id='totalFacturaId']").click({force:true}).clear({force:true}).type(tInvoice, {force:true});
  //cy.xpath("//input[@id='valorCopagoId']").click({force:true});
  //cy.xpath("//facturaliquidacion/div/div[2]/form/div/div[18]/button[contains(.,'Guardar')]").should("be.visible").click();
  cy.xpath("//facturaliquidacion/*//button[contains(.,'Guardar')]").click();
  cy.wait(time);
});

Cypress.Commands.add('invoiceDetails', (procedure, quantity, presented) => {
  cy.get("#codigoProcedimiento2").type(procedure, {force:true});
  cy.get("#codigoProcedimiento2").type('{enter}', {force:true});
  cy.get("#cantidadDetalle").click({force:true}).clear({force:true}).type(quantity, {force:true});
  cy.get("#ValorPresentado").type(presented, {force:true});
  cy.xpath("//detalle-factura/*//input[@id='Observacion']").type('{enter}',{force:true});
  cy.xpath("//detalle-factura/*//button[contains(.,'Guardar')]").click();
  cy.xpath("//button[contains(.,'OK')]").click({force:true});
  cy.xpath("//button[contains(.,'Liquidar')]").click();
  cy.xpath("//button[contains(.,'Finalizar')]").click({force:true});
  cy.wait(time);
});
