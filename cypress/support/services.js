/// <reference types="Cypress" />

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

Cypress.Commands.add('filterForTransactionsService', (numContract) => {
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
      "filterByEmpresa": false,
      "filterByLiquidacion": false,
      "filterByAutorizacion": false,
      "filterByNumeroSobre": false,
      "filterEstadoContrato": false
    }
  }).then(function (response) {
    expect(response.status).to.eq(200);
    expect(response.body.data[0].NumeroContrato).to.eq(parseInt(numContract));
    return cy.wrap(response.body);
  })
});

Cypress.Commands.add('getDefaulterDetailsService', (numContract) => {
  cy.filterForTransactionsService(numContract).then(value => {
    const url = `https://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/cotizacion/ObtenerDetallesMora/`
      + value.data[0].CodigoRegion + '/' + value.data[0].CodigoProducto + '/' + value.data[0].NumeroContrato
    cy.request({
      method: 'GET',
      url: url,
      headers: {
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
      cy.wrap(response.body);
    })
  })
});

Cypress.Commands.add('getMovementsService', (numContract) => {
  cy.filterForTransactionsService(numContract).then(value => {
    const url = `https://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/movimiento/filter`
    cy.request({
      method: 'POST',
      url: url,
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
        "CodigoContrato": value.data[0].CodigoContrato,
        "CodigoRegion": value.data[0].CodigoRegion,
        "CodigoProducto": value.data[0].CodigoProducto,
        "ContratoNumero": value.data[0].ContratoNumero
      }
    }).then(function (response) {
      expect(response.status).to.eq(200);
      cy.getCurrentDate().then(date => {
        cy.wrap(date).as('date');
      })
      cy.get('@date').then(date => {
        expect(response.body.data[0].FechaMovimiento).to.eq(date);
      })
      let changePrice = response.body.data[1].Transaccion;
      expect(response.body.data[0].NumeroContrato).to.eq(parseInt(numContract));
      expect(response.body.data[0].EstadoMovimiento).to.eql("Activo");
      cy.get('@price').then(price => {
        if ('CAMBIO PRECIO' == changePrice) {
          expect(changePrice).to.eql("CAMBIO PRECIO");
          let priceService = (response.body.data[1].DatoAnterior).split(' ');
          expect(priceService[0]).to.include(price.toString().trim());
        } else {
          expect(response.body.data[0].Transaccion).to.eql("CAMBIO PRECIO");
          let priceService = (response.body.data[0].DatoAnterior).split(' ');
          expect(priceService[0]).to.include(price.toString().trim());
        }
      });
    })
  })
});

Cypress.Commands.add('filterPaymentService', (numContract) => {
  cy.filterForTransactionsService(numContract).then(value => {
    const url = `https://pruebas.servicios.saludsa.com.ec/ServicioArmonix/api/cobranza/filter`
    cy.request({
      method: 'POST',
      url: url,
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
        "CodigoContrato": value.data[0].CodigoContrato
      }
    }).then(function (response) {
      expect(response.status).to.eq(200);
      cy.wrap(response.body);
    })
  })
});