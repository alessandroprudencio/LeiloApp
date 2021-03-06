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

function fakeLocation(latitude, longitude) {
  return {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition', (cb, err) => {
        if (latitude && longitude) {
          // eslint-disable-next-line standard/no-callback-literal
          return cb({ coords: { latitude, longitude } })
        }
        throw err({ code: 1 })
      })
    },
  }
}

describe('Form', () => {
  it('Verifica se existe os campos do formulario', () => {
    cy.visit('/address/create')
    cy.get('[data-cy=cep]').should('exist')
    cy.get('[data-cy=address]').should('exist')
    cy.get('[data-cy=number]').should('exist')
    cy.get('[data-cy=complement]').should('exist')
    cy.get('[data-cy=state]').should('exist')
    cy.get('[data-cy=city]').should('exist')
  })

  it('Valida botão `NÃO SEI MEU CEP` ', () => {
    cy.visit('/address/create', fakeLocation(-20.4210148, -54.5812235))
    cy.get('[data-cy=btnNotknowCEP]').type(cepInvalid, { force: true }).click()
    cy.get('[data-cy=cep]').should('have.value', '')
  })

  it('Valida retorno de endereço inválido ', () => {
    cy.visit('/address/create').then(() => {
      cy.get('[data-cy=cep]').invoke('val', '')
      cy.get('[data-cy=cep]').type(cepInvalid, { force: true }).type('{enter}')

      cy.server()

      cy.route('GET', `https://cors-anywhere.herokuapp.com/https://viacep.com.br/ws/${cepInvalid.replace(/[^\d]+/g, '')}/json`).as(
        'returnCEPInvalid'
      )
      cy.wait('@returnCEPInvalid').then((xhr) => {
        expect(xhr.response.body.erro).to.eq(true)
      })
    })
  })

  it('Salva endereço', () => {
    cy.visit('/address/create').then(() => {
      cy.server()

      cy.get('[data-cy=cep]').type(cepValid, { force: true }).type('{enter}')

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000)

      cy.get('[data-cy=number]').type(addressData.number)
      cy.get('[data-cy=complement]').type(addressData.complement)
      cy.get('[data-cy=btnSave]').click()

      cy.clearLocalStorage(/prop1|2/).should((ls) => {
        expect(ls.length).to.be.greaterThan(0)
      })
    })
  })
})
