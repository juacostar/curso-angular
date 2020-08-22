const { createYield } = require("typescript")

describe('ventana principal', () => {
    it('tiene encabezado correcto y español por defecto', () => {
        cy.visit('http://localhost:4200');
        cy.contains('angular whishlist');
        cy.get('h1 b').should('contain', 'HOLA es');

    })
})