/// <reference types="cypress" />

const addressData = {
  address: 'Rua João Jorge Chacha',
  cep: '79.033-550',
  city: 'Campo Grande',
  complement: 'casa',
  number: '398',
  state: 'MS',
}

describe('List', () => {
  it('Verifica se existe a tabela', () => {
    cy.visit(`address/`)
    cy.get('table').should('exist')
  })

  it('Verifica se os dados no localStorage são exibidos na tabela', () => {
    cy.clearLocalStorage(/prop1|2/).should((ls) => {
      ls.setItem('adresses', JSON.stringify([addressData, addressData, addressData]))
      cy.visit(`address/`).then(() => {
        cy.get('table > tbody').find('tr').should('have.length', 3)
      })
    })
  })
})
