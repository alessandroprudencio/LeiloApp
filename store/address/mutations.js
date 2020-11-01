const mutations = {
  SET_CITIES(state, payload) {
    state.cities = payload
  },
  SET_STATES(state, payload) {
    state.states = payload
  },
  SET_CEP(state, payload) {
    state.cep = payload
  },
  SET_PROGRESS(state, payload) {
    state.progress = payload
  },
  SET_ADRESSES(state, payload) {
    state.adresses = payload
  },
  SET_SNACKBAR(state, payload) {
    state.snackbar = payload
  },
}

export default mutations
