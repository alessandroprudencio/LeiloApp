/// <reference types="cypress" />

const cepValid = '79.033-550'
const cepInvalid = '86.812-999'

const addressData = {
  address: 'Rua João Jorge Chacha',
  cep: '79.033-550',
  city: 'Campo Grande',
  complement: 'casa',
  number: '398',
  state: 'MS',
}

describe('Form', () => {
  it('Verifica se existe os campos do formulario', () => {
    cy.visit('/create')
    cy.get('[data-cy=cep]').should('exist')
    cy.get('[data-cy=address]').should('exist')
    cy.get('[data-cy=number]').should('exist')
    cy.get('[data-cy=complement]').should('exist')
    cy.get('[data-cy=state]').should('exist')
    cy.get('[data-cy=city]').should('exist')
  })

  it('Valida retorno de endereço inválido ', () => {
    cy.visit('/create').then(() => {
      cy.get('[data-cy=cep]').invoke('val', '')
      cy.get('[data-cy=cep]').type(cepInvalid, { force: true }).type('{enter}')

      cy.get('[data-cy=alert-success]').should('exist')
    })
  })

  it('Salva endereço', () => {
    cy.visit('/create').then(() => {
      cy.server()

      cy.route('GET', `${process.env.CORS}https://viacep.com.br/ws/${addressData.cep.replace(/[^\d]+/g, '')}/json`).as('returnCEPValid')

      cy.route('GET', `${process.env.CORS}https://servicodados.ibge.gov.br/api/v1/localidades/estados`).as('returnStates')

      cy.route('GET', `${process.env.CORS}https://servicodados.ibge.gov.br/api/v1/localidades/estados/${addressData.state}/distritos`).as(
        'returnCities'
      )

      cy.wait('@returnStates').its('status').should('be', 200)

      cy.get('[data-cy=cep]').type(cepValid, { force: true }).type('{enter}')

      cy.wait('@returnCities').its('status').should('be', 200)

      cy.wait('@returnCEPValid').its('status').should('be', 200)

      cy.get('[data-cy=number]').type(addressData.number)
      cy.get('[data-cy=complement]').type(addressData.complement)
      cy.get('[data-cy=btnSave]').click()

      cy.clearLocalStorage(/prop1|2/).should((ls) => {
        expect(ls.length).to.be.greaterThan(0)
        expect(JSON.parse(ls.adresses)[0]).to.deep.equal(addressData)
      })
    })
  })
})
