import { isEmpty, random, wrap } from "lodash";
import dayjs from 'dayjs';
require('cypress-xpath');
const time = 2500;

//acceder a la página de liquidaciones
Cypress.Commands.add('pLiquidations', () => {
  cy.visitUrl('https://pruebas.redsaludsa.com/aplicaciones/consultas360/#/mainView').then(() => {
    cy.wait(time);
    cy.url().should('eq', 'https://pruebas.redsaludsa.com/aplicaciones/consultas360/#/mainView');
    cy.xpath("//*[@class='has-arrow']/span[1][contains(.,'Liquidaciones')]").should("be.visible").click();
    cy.wait(time);
    cy.xpath("//a[@href='#/liquidacion/list' ] ").click();
    cy.wait(time);
  });
});


//ingresar un contrato
Cypress.Commands.add('typeContract', (numberContract) => {
  cy.getDeductibleInformationService(numberContract).then(s => {
    cy.wrap(s.Datos.Entidades[0].Deducibles[0].Codigo).as('codeDeductible');//obtengo el tipo de deducible
  });
  cy.url().should('eq', 'https://pruebas.redsaludsa.com/aplicaciones/consultas360/#/liquidacion/list')
  expect(numberContract).to.not.be.empty;
  //cy.get("#numeroContrato").should("be.visible").click({force: true}).type(numContract);
  cy.get("#numeroContrato").should("be.visible").type(numberContract + '{enter}');
  //cy.get("button.btn").click({ force: true });
  cy.wait(time);
  cy.get('@codeDeductible').then(code => {
    cy.log('El tipo de deducible del contrato ' + numberContract + ' es ' + code);
  });
});
//Muestra la lista de beneficiarios
Cypress.Commands.add('selectContract', () => {
  cy.get("td.centerMiddle").should("be.visible").click({ force: true });
  cy.wait(time);
});

//validar el contrato
Cypress.Commands.add('validateContract', (numContract,numRUC,diagnosticCode, numRequest, tInvoice, procedure, quantity, presented) => {

  cy.filterForAuthorizationService(numContract).then(s => {
    cy.wrap(s.data[0].EstadoContrato).as('status');//obetengo el estado del contrato
    cy.wrap(s.data[0].NumeroPersona).as('numPerson');//obetengo el # depersona(del beneficiario)
  });
  
  cy.getDefaulterDetailsService(numContract).then(s => {
    cy.wrap(s.Datos.NumeroCuotasMora).as('amountOfFees')//obtengo el # de cuotas en mora
  });

  cy.get('@status').then(status => {//obtengo el estatus
    cy.log('El contrato se encuentra: ' + status)
    if (status == 'Activo') {//verifico si esta activo el contrato
      cy.get('@amountOfFees').then(amountOfFees => {
        cy.log('El contrato tiene ' + amountOfFees + ' cuotas en mora.')
        if (amountOfFees < 4) {//verifico si la mora es menor que 4
          cy.selectBeneficiarie(numContract, numRUC, diagnosticCode, numRequest, tInvoice, procedure,quantity, presented);
          cy.wait(time);
        } else {
          cy.isDefaulter();
        }
      })
    } else {
      cy.isNotActive()
    }
  })
});

Cypress.Commands.add('isNotActive', () => {
  cy.get('h3').should("contain.text", "Contrato no está activo, no se procede al cambio.")
  cy.wait(time);
  cy.get('.confirm').click();
});

Cypress.Commands.add('isDefaulter', () => {
  cy.get('h3').should("contain.text", "Contrato con mas de 3 cuotas en mora, no procede al cambio.")
  cy.wait(time);
  cy.get('.confirm').click();
});

//Seleccionar beneficiaro y validar si tiene deducible disponible
Cypress.Commands.add('selectBeneficiarie', (numContract,numRUC,diagnosticCode, numRequest, tInvoice, procedure, quantity, presented) => {
  cy.get("#beneficiarioLiqId > tbody > tr:nth-child(1) > td:nth-child(4)").click();
  //cy.xpath("//td[contains(.,'TITULAR')]").click();
  //cy.xpath("//input[@id='establecimeintoId']").type(establishment, { force: true });
  cy.wait(time);
  cy.get("#btnNuevo").should("be.visible").click();//click en btn nueva liquidación
  cy.wait(time);
  cy.liquidationData(numRUC, diagnosticCode, numRequest, numContract,presented);
  cy.newInvoice(tInvoice);
  cy.invoiceDetails(procedure, quantity, presented);
});



//Ingresar los datos de la liquidación
Cypress.Commands.add('liquidationData', (numRUC, diagnosticCode, numRequest, numContract, presented) => {
  cy.get("#btnNuevo").should("be.visible").click();//click en btn nueva liquidación
  cy.wait(time);
  cy.get('#slcOficina').select('Reembolso Online UIO', { force: true }).should('have.value', '17');//oficina de liquidación
  cy.wait(time);
  cy.get('#rucPrestadorIdPrincipal').type(numRUC);//RUC prestador
  cy.wait(time);
  cy.get('#incialDiagnosticoC').should("be.visible").clear().type(diagnosticCode + '{enter}');//Codigo del diagnostico REVISAR!!!!
  cy.wait(time);
  //cy.get('#incialDiagnosticoC').should("be.visible").clear().type(diagnosticCode);//Codigo del diagnostico
  //cy.xpath("//a[@class='lupita']").click();
  cy.get('#tipoEnfermedadId').select('Cronica', { force: true }).should('have.value', 'Cronica')
  cy.wait(time);
  cy.getCurrentDate().then(date => {
    cy.wrap(date).as('date');
  });
  cy.get('@date').then(date => {
    cy.get('#fechaIncurrencia').should("be.visible").clear().type(date);
  });
  cy.wait(time);
  cy.get('#lugarAtencionId').select('Consulta Externa', { force: true }).should('have.value', 'Consulta Externa');
  cy.get('#lugarAtencionId').find(':selected').then(coverage => {
    let coverages = coverage.text();
    cy.wrap(coverages).as('tipeCoverage');
  });

  cy.isDeductibleCoveragePercentage(numContract, presented).then(val => {
    if (val == true) {
      cy.log('No calcula COPAGO');
    } else {
      cy.log('SI calcula COPAGO1');
      //cy.calculateCoveragePercentage()
      cy.get('@copago').then(copago => {
        cy.log('El copago debería ser: ' + copago);
      });
    } 
  });


  cy.wait(time);
  cy.get("#numSobreCualquiera").should("be.visible").clear().type(numRequest);
  cy.wait(time);
  cy.get('#idDeducible').select('INCAPACIDAD BAJO EDAD', { force: true }).should('have.value', 'INC01');
  cy.wait(time);
  cy.xpath("//button[contains(.,'Guardar y Continuar')]").click();
  cy.wait(time);
  //Obtener el numero del reclamo
  cy.get('#numeroReclamo').invoke('text').then(text =>{
    cy.log('El numero de reclamo es: '+text);
  });
  cy.getClaimService(numContract).then(s => {
    cy.wrap(s.Datos.data[0].NumeroReclamo).as('numClaim');
  });

});


//Ingresar un nueva factura
Cypress.Commands.add('newInvoice', (tInvoice) => {
  cy.xpath("//button[contains(.,'Ingresar Factura')]").should("be.visible").click();
  cy.wait(time);
  cy.getCurrentDate().then(date => {
    cy.wrap(date).as('date');
  });
  cy.get('@date').then(date => {
    cy.xpath("//input[@id='fechaEmisionId']").type(date, { force: true });
  });
  cy.xpath("//facturaliquidacion/*//td[contains(.,'ACTIVO')]").click({ force: true });
  cy.wait(time);
  //ingresa el num de factura
  cy.randomNumbers(100, 999).then(establishment => {
    cy.wrap(establishment).as('establishment');
  });
  cy.get('@establishment').then(establishment => {
    cy.xpath("//input[@id='establecimeintoId']").type(establishment, { force: true });
    cy.wait(time);
  });
  cy.randomNumbers(100, 999).then(facToEmi => {
    cy.wrap(facToEmi).as('facToEmi');
  });
  cy.get('@facToEmi').then(facToEmi => {
    cy.get('#numFacPtoEmi').type(facToEmi, { force: true });
    cy.wait(time);
  });
  cy.randomNumbers(10000, 99999).then(secuence => {
    cy.wrap(secuence).as('secuence');
  });
  cy.get('@secuence').then(secuence => {
    cy.get('#secuencialId').type(secuence, { force: true });
    cy.wait(time);
  });
  cy.wait(time);
  //Fecha Autorizacion Inicio y Fin
  cy.get('#slcFechaInicioAutorizacion').type('01/01/2022', { force: true });
  cy.get('#slcFechaFinAutorizacion').type('01/01/2023', { force: true });
  cy.wait(time);
  //Numero de autorizacion
  cy.randomNumbers(1000000000, 9999900000).then(amortizationNum => {
    cy.wrap(amortizationNum).as('amortizationNum');
  });
  cy.get('@amortizationNum').then(amortizationNum => {
    cy.xpath("//input[@id='numeroAutorizacionId']").type(amortizationNum + '{enter}', { force: true });
    cy.wait(time);
  });
  //total factura
  //cy.xpath("//input[@id='totalFacturaId']").click({ force: true }).clear({ force: true }).type(tInvoice, { force: true });
  cy.xpath("//input[@id='totalFacturaId']").click({ force: true }).type(tInvoice, { force: true });
  cy.wait(time);
  cy.xpath("//facturaliquidacion/*//button[contains(.,'Guardar')]").click({ force: true });
  cy.wait(time);
});

//Ingresar el detalle de la factura
Cypress.Commands.add('invoiceDetails', (procedure, quantity, presented) => {
  //cy.get("#codigoProcedimiento2").type(procedure + '{enter}', { force: true });
  //cy.wait(time);
  //cy.get("#cantidadDetalle").click({ force: true }).clear({ force: true }).type(quantity, { force: true });
  //cy.get("#cantidadDetalle").click({ force: true }).type(quantity, { force: true });

  cy.get("#codigoProcedimiento2").type(procedure, { force: true });
  cy.get("#codigoProcedimiento2").type('{enter}', { force: true });
  cy.wait(time);
  cy.wait(time);
  cy.get("#cantidadDetalle").click({ force: true }).clear({ force: true }).type(quantity, { force: true });

  cy.wait(time);
  cy.get("#ValorPresentado").type(presented, { force: true });
  cy.wait(time);
  cy.xpath("//detalle-factura/*//input[@id='Observacion']").type('{enter}', { force: true });
  cy.wait(time);
  cy.xpath("//detalle-factura/*//button[contains(.,'Guardar')]").click({ force: true });
  cy.wait(time);
  cy.xpath("//button[contains(.,'OK')]").click({ force: true });
  cy.wait(time);
  cy.xpath("//button[contains(.,'Liquidar')]").click({ force: true });
  cy.wait(time);
  cy.xpath("//button[contains(.,'Finalizar')]").click({ force: true });
  cy.wait(time);
});

Cypress.Commands.add('getCurrentDate', () => {
  const date = dayjs().date();
  const month = dayjs().month() + 1;
  const year = dayjs().year();
  let dateString;
  let monthString;
  if (date < 10) {
    dateString = '0' + date;
  } else {
    dateString = date;
  }

  if (month < 10) {
    monthString = '0' + month;
  } else {
    monthString = month;
  }
  const concatenatedDate = dateString + "/" + monthString + "/" + year;
  return (concatenatedDate);
});

Cypress.Commands.add('randomNumbers', (minG, maxG) => {
  var minO = minG;
  var maxO = maxG;
  var numRandom = Math.floor(Math.random() * (maxO - minO + 1) + minO);
  return (numRandom);
});
/*
Cypress.Commands.add('getCoveragePercentage', () => {
  cy.get('@tipeCoverage').then(valueC => {
    cy.getDeductibleInformationService(numContract).then(s => {
      if (valueC != 'Hospital' && valueC != 'Hospital del Día') {
        cy.wrap(s.Datos.Entidades[0].Coberturas[0].Valor).as('coverPercentage');//obtengo el porcentaje de cobertura ambulatorio
      } else {
        cy.wrap(s.Datos.Entidades[0].Coberturas[1].Valor).as('coverPercentage');//obtengo el porcentaje de cobertura hospitalario
      }
    });
  });
});*/
//Funcion para verificar si el deducible esta disponible
Cypress.Commands.add('isDeductibleCoveragePercentage', (numContract, presented) => {
  var cDeductible, dAvailable, bonus, coverVal, copago;
  cy.getDeductibleInformationService(numContract).then(s => {
    cy.wrap(s.Datos.Entidades[0].DeducibleTotal).as('totalDeductible')//obtengo el deducible total
    cy.wrap(s.Datos.Entidades[0].Beneficiarios[0].DeducibleCubierto).as('coverDeductible')//obetengo el deducible cubierto
    cy.wrap(s.Datos.Entidades[0].Deducibles[0].Codigo).as('codeDeductible');//obtengo el tipo de deducible
    //cy.wrap(s.Datos.Entidades[0].Coberturas[0].Valor).as('coverPercentage');//obtengo el porcentaje de cobertura 
    cy.get('@tipeCoverage').then(valueC => {
      if (valueC != 'Hospital' && valueC != 'Hospital del Día') {
        cy.wrap(s.Datos.Entidades[0].Coberturas[0].Valor).as('coverPercentage');//obtengo el porcentaje de cobertura ambulatorio
      } else {
        cy.wrap(s.Datos.Entidades[0].Coberturas[1].Valor).as('coverPercentage');//obtengo el porcentaje de cobertura hospitalario
      };
    });
  });

  cy.get('@totalDeductible').then(totalDeductible => {
    cy.get('@coverDeductible').then(coverDeductible => {
      cy.get('@coverPercentage').then(coverPercentage => {
        dAvailable = totalDeductible - coverDeductible;
        cy.log('Deducible total= ' + totalDeductible + '\nDeducible cubierto= '+coverDeductible+'\nDeducible disponible= '+dAvailable);  
        let cPer = Number(coverPercentage.split("%").join(''));
        //let cPerT = cPer.split("%").join('');
        //let cPerN = Number(cPerT);
        coverVal = cPer / 100;
        if (dAvailable >= presented) {
          //No se calcula COPAGO
          return cy.wrap(true);
        } else {
          //Si se calcula COPAGO

          //cDeductible = dAvailable;
          valorRestante = presented - dAvailable
          bonus = valorRestante * coverVal;
          copago = valorRestante - bonus;
          cy.wrap(copago).as('copago');
          return cy.wrap(false);
        }
      });
    });
  });
});


