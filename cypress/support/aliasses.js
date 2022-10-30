/**
 * @param cypressCommandFns An array of functions that return Cypress commands
 * @returns A Cypress chainable whose `.then()` passes an array of jQuery-wrapped DOM nodes
 */
 Cypress.Commands.add('all', (cypressCommandsFns) =>
 cypressCommandsFns.reduce(
   (results, command) =>
     results.then((bucket) => command().then((res) => [...bucket, res])),
   cy.wrap([])
 )
)