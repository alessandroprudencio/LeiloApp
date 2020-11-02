import axios from 'axios'
import generateUuid from '../../helpers/generateUuid'
import maskCEP from '../../helpers//maskCEP'

const actions = {
  actionGetCEP({ commit, state }, cep) {
    return new Promise((resolve, reject) => {
      commit('SET_PROGRESS', !state.progress)
      const cepFormatted = cep.replace(/[^\d]+/g, '')
      setTimeout(async () => {
        try {
          const resp = (await axios.get(`${process.env.CORS}https://viacep.com.br/ws/${cepFormatted}/json`)).data
          if (resp.erro) reject(new Error(`O número do CEP é inválido, verifique se o número está preenchido corretamente.`))
          commit('SET_CEP', resp)
          resolve()
        } catch (error) {
          reject(new Error(`O número do CEP é inválido, verifique se o número está preenchido corretamente.`))
        }
        commit('SET_PROGRESS', !state.progress)
      }, 800)
    })
  },

  async actionGetStates({ commit }) {
    const resp = (await axios.get(`${process.env.CORS}https://servicodados.ibge.gov.br/api/v1/localidades/estados`)).data
    commit('SET_STATES', resp)
  },

  async actionGetCitiesByState({ commit }, uf) {
    const resp = (await axios.get(`${process.env.CORS}https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`)).data
    commit('SET_CITIES', resp)
  },

  actionRegisterAddress(a = {}, payload) {
    const addressStorage = localStorage.adresses

    Object.assign(payload, { id: generateUuid() })

    if (addressStorage) {
      const adresses = JSON.parse(addressStorage)
      localStorage.setItem('adresses', JSON.stringify(adresses.push(payload)))
    } else {
      localStorage.setItem('adresses', JSON.stringify([payload]))
    }
  },

  actionGetAdresses({ commit }) {
    const addressStorage = localStorage.adresses
    if (addressStorage) commit('SET_ADRESSES', JSON.parse(addressStorage))
  },

  actionGetAddressById(a = {}, id) {
    const addressStorage = JSON.parse(localStorage.adresses)
    return addressStorage.find((item) => item.id === id)
  },

  actionEditAddress(a = {}, address) {
    const addressStorage = JSON.parse(localStorage.adresses)
    const obj = addressStorage.find((item) => item.id === address.id)
    Object.assign(obj, address)
    localStorage.setItem('adresses', JSON.stringify(addressStorage))
  },

  actionSetSnackbar({ commit }, payload) {
    commit('SET_SNACKBAR', payload)
    setTimeout(() => {
      commit('SET_SNACKBAR', { show: false })
    }, 2000)
  },

  actionDeleteAddress({ commit }, payload) {
    const addressStorage = JSON.parse(localStorage.adresses)

    addressStorage.splice(
      addressStorage.findIndex((item) => item.id === payload),
      1
    )
    localStorage.setItem('adresses', JSON.stringify(addressStorage))
    commit('SET_ADRESSES', addressStorage)
  },

  async actionGetAddressByLocation({ state }, { lat, lng }) {
    const resp = await axios.get(
      `https://eu1.locationiq.com/v1/reverse.php?key=${process.env.locationiqkEY}&lat=${lat}&lon=${lng}&format=json`
    )
    const { address } = resp.data
    return {
      cep: maskCEP(address.postcode),
      state: state.states.find((item) => item.nome === address.state).sigla,
      city: address.city,
      address: address.road,
    }
  },
}

export default actions
