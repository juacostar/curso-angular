const { createYield } = require("typescript")


// primer test
describe('ventana principal', () => {
    it('tiene encabezado correcto y español por defecto', () => {
        cy.visit('http://localhost:4200');
        cy.contains('angular whishlist');
        cy.get('h1 b').should('contain', 'HOLA es');

    })
})


// segundo test
describe('ventana principal', () => {
    it('tiene la etiqueta fecha bien', () => {
        cy.visit('http://localhost:4200');
        cy.contains('angular whishlist');
        cy.get('hr').should('contain', 'Fecha');

    })
})

// tercer test
describe('ventana principal', () => {
    it('link home corrrecto', () => {
        cy.visit('http://localhost:4200');
        cy.contains('angular whishlist');
        cy.get('a').should('contain', 'Home');

    })
})