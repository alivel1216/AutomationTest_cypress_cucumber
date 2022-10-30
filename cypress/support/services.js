/// <reference types="Cypress" />

//obtener las credenciales del usuario(Dianita)
Cypress.Commands.add('getTokenService', (username, password) => {
  const url = `https://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/seguridad/loginArmonix`
  cy.request({
    method: 'POST',
    url: url,
    form: true,
    headers: {
      "Connection": "keep-alive",
      'DireccionIP': '200.125.230.97',
      'Content-Type': 'application/json; charset=utf-8',
      'DispositivoNavegador': 'Chrome'
    },
    body: {
      "grant_type": "password",
      "client_id": "8a3e4d10b2b24d6b9c55c88a95fdc324",
      "username": username,
      "password": password
    }
  }).then(function (response) {
    expect(response.status).to.eq(200);
    expect(response.body.user_data).to.include(username.toUpperCase().toString());
    window.localStorage.setItem("tokenType", response.body.token_type);
    window.localStorage.setItem("accessToken", response.body.access_token);
  })
});

//Obtener datos del contrato 
Cypress.Commands.add('filterForAuthorizationService', (numContract) => {
  const url = `https://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/contratos/filterForTransacciones`
  cy.request({
    method: 'POST',
    url: url,
    form: true,
    headers: {
      "Connection": "keep-alive",
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Authorization': window.localStorage.getItem("tokenType") + " " + window.localStorage.getItem("accessToken"),
      'Host': 'pruebas.servicios.saludsa.com.ec',
      'Origin': 'https://pruebas.redsaludsa.com',
      'Referer': 'https://pruebas.redsaludsa.com/',
      'Content-Type': 'application/json; charset=utf-8',
      'DispositivoNavegador': 'Chrome'
    },
    body: {
      "NumeroContrato": numContract,
      "filterByAutorizacion": false,
      "filterByEmpresa": false,
      "filterByLiquidacion": false,
      "filterByNumeroSobre": false,
      "filterEstadoContrato": false
    }
  }).then(function (response) {
    expect(response.status).to.eq(200);
    expect(response.body.data[0].NumeroContrato).to.eq(parseInt(numContract));
    return cy.wrap(response.body);
  })
});

//Obtener las cuotas de mora 
Cypress.Commands.add('getDefaulterDetailsService', (numContract) => {
  cy.filterForAuthorizationService(numContract).then(value => {
    const url = `https://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/cotizacion/ObtenerDetallesMora/`
      + value.data[0].CodigoRegion + '/' + value.data[0].CodigoProducto + '/' + value.data[0].NumeroContrato
    cy.request({
      method: 'GET',
      url: url,
      headers: {
        'CodigoAplicacion': 28,
        'CodigoPlataforma': 7,
        'Authorization': window.localStorage.getItem("tokenType") + " " + window.localStorage.getItem("accessToken"),
        'DireccionIP': '186.47.182.97',
        'DispositivoNavegador': 'Chrome',
        'SistemaOperativo': 'Windows',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(function (response) {
      expect(response.status).to.eq(200);
      return cy.wrap(response.body);
    })
  });
});

Cypress.Commands.add('getDeductibleInformationService', (numContract) => {
  cy.filterForAuthorizationService(numContract).then(value => {
    const url = `http://pruebas.servicios.saludsa.com.ec/ServicioContratos/api/contrato/ObtenerContratoPorDocumento?tipoDocumento=C&numeroDocumento=`
      + value.data[0].Cedula + '&filtrarCorporativoAntiguo=+false'
    cy.request({
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json',
        'CodigoAplicacion': 28,
        'CodigoPlataforma': 7,
        'Authorization': window.localStorage.getItem("tokenType") + " " + window.localStorage.getItem("accessToken"),
        'DireccionIP': '157.100.200.43',
        'DispositivoNavegador': 'Chrome',
        'SistemaOperativo': 'Windows',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(function (response) {
      expect(response.status).to.eq(200);
      return cy.wrap(response.body);
    })
  });
});

Cypress.Commands.add('getClaimService', (numContract) => {
  cy.filterForAuthorizationService(numContract).then(value => {
    const url = `https://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/liquidaciones/GetReclamo`
    cy.request({
      method: 'POST',
      url: url,
      form: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': window.localStorage.getItem("tokenType") + " " + window.localStorage.getItem("accessToken"),
        'CodigoAplicacion': 28,
        'CodigoPlataforma': 7,
        'SistemaOperativo': 'Windows',
        'DispositivoNavegador': 'Chrome',
        'DireccionIP': '186.47.183.106',
        'X-Page-Number': '1',
        'X-Page-Size': '10'
      },
      body: {
        "CodigoProducto": value.data[0].CodigoProducto,
        "ContratoNumero": numContract,
        "PersonaNumero": value.data[0].NumeroPersona,
        "Region": value.data[0].CodigoRegion
      }
    }).then(function (response) {
      expect(response.status).to.eq(200);
      return cy.wrap(response.body);
    });
  });
});


Cypress.Commands.add('coveragePercentageService', (numContract) => {
  cy.filterForAuthorizationService(numContract).then(value => {
    const url = `http://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/liquidaciones/liquidarReclamo`
    cy.all([
      () => cy.get('@establishment'), 
      () => cy.get('@facToEmi'),
      () => cy.get('@secuence'),
      () => cy.get('@numClaim'),
      () => cy.get('@numAlc'),
      () => cy.get('@numConv'),
    ]).then(([$code1, $code2, $code3, $numClaim, $numAlc, $numConv]) =>{
      cy.request({
        method: 'POST',
        url: url,
        form: true,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Authorization': window.localStorage.getItem("tokenType") + " " + window.localStorage.getItem("accessToken"),
          'CodigoAplicacion': 28,
          'CodigoPlataforma': 7,
          'SistemaOperativo': 'Windows',
          'DispositivoNavegador': 'Chrome',
          'DireccionIP': '200.125.230.97',
          'X-Page-Number': 1,
          'X-Page-Size': '10'
        },

        body: {
          "Reclamo": {
            "NumeroReclamo": $numClaim,
            "NumeroAlcance": $numAlc
          },
          "ListaFacturas": [
            {
              "NumeroReclamo": $numClaim,
              "NumeroAlcance": $numAlc,
              "Codigo1": $code1,
              "Codigo2": $code2,
              "Codigo3": $code3,
              "NumeroConvenio": $numConv,
              "TipoEmision": "O"
            }
          ]
        }


      }).then(function (response) {
        expect(response.status).to.eq(200);
        //cy.log(JSON.stringify(response.body));
        return cy.wrap(response.body);
      });
    });
/*
    cy.get('@establishment').then(code1 => {
      cy.get('@facToEmi').then(code2 => {
        cy.get('@secuence').then(code3 => {
          cy.get('@numClaim').then(numClaim => {
            cy.get('@numAlc').then(numAlc => {
              cy.get('@numConv').then(numConv => {

                cy.request({
                  method: 'POST',
                  url: url,
                  form: true,
                  headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.getItem("tokenType") + " " + window.localStorage.getItem("accessToken"),
                    'CodigoAplicacion': 28,
                    'CodigoPlataforma': 7,
                    'SistemaOperativo': 'Windows',
                    'DispositivoNavegador': 'Chrome',
                    'DireccionIP': '200.125.230.97',
                    'X-Page-Number': 1,
                    'X-Page-Size': '10'
                  },

                  body: {
                    "Reclamo": {
                      "NumeroReclamo": numClaim,
                      "NumeroAlcance": numAlc
                    },
                    "ListaFacturas": [
                      {
                        "NumeroReclamo": 0,
                        "NumeroAlcance": 0,
                        "Codigo1": code1,
                        "Codigo2": code2,
                        "Codigo3": code3,
                        "NumeroConvenio": numConv,
                        "TipoEmision": "O"
                      }
                    ]
                  }


                }).then(function (response) {
                  expect(response.status).to.eq(200);
                  //cy.log(JSON.stringify(response.body));
                  return cy.wrap(response.body);
                });
              });
            });
          });
        });
      });
    });
    */
  });
});