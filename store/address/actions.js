import axios from 'axios'

const actions = {
  actionGetCEP({ commit, state }, cep) {},

  async actionGetStates({ commit }) {},

  async actionGetCitiesByState({ commit }, uf) {},

  async actionRegisterAddress({}, payload) {},

  actionGetAdresses({ commit }) {},

  actionGetAddressById({}, id) {},

  actionEditAddress({}, address) {},
  actionSetSnackbar({ commit }, payload) {},
  actionDeleteAddress({ commit }, payload) {},
}

export default actions
