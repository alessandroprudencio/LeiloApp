import { reqRef, onMounted, computed, watch, reactive } from '@nuxtjs/composition-api'

export default function AddressForm($store, $route, $refs, $router) {
  let valid = reqRef(true)
  const address = reactive({
    address: '',
    state: '',
    city: '',
    cep: '',
    complement: '',
    number: '',
  })

  const cep = computed(() => $store.state.address.cep)
  const states = computed(() => $store.state.address.states)
  const cities = computed(() => $store.state.address.cities)
  const progress = computed(() => $store.state.address.progress)
  const isEdit = computed(() => ($route.params.id ? $route.params.id : null))

  watch(
    () => address.state,
    async (payload) => {
      if (payload) {
        await $store.dispatch('address/actionGetCitiesByState', payload)
      }
    }
  )

  onMounted(async () => {
    await $store.dispatch('address/actionGetStates')
    if (isEdit.value) {
      const newAddress = await $store.dispatch('address/actionGetAddressById', isEdit.value)
      Object.assign(address, newAddress)
    }
  })

  async function searchCEP() {
    try {
      await $store.dispatch('address/actionGetCEP', address.cep)
      const { logradouro, uf, localidade, complemento } = cep.value
      address.address = logradouro
      address.state = uf
      address.city = localidade
      address.complement = complemento
    } catch (error) {
      console.log(error)
      await $store.dispatch('address/actionSetSnackbar', { show: true, text: error, type: 'error' })
      valid = false
    }
  }
  function actionGetLocation() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const newAddress = await $store.dispatch('address/actionGetAddressByLocation', {
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      })
      Object.assign(address, newAddress)
      if (isEdit.value) address.id = $route.params.id
    })
  }
  async function save() {
    if (!$refs.form.validate()) return

    try {
      if (isEdit.value) {
        await $store.dispatch('address/actionEditAddress', address)
        $router.push('/')
      } else {
        await $store.dispatch('address/actionRegisterAddress', address)
        $refs.form.reset()
      }
      await $store.dispatch('address/actionSetSnackbar', {
        show: true,
        text: `Endereço ${isEdit.value ? 'editado' : 'cadastrado'} com sucesso!`,
        type: 'success',
      })
    } catch (error) {
      await $store.dispatch('address/actionSetSnackbar', {
        show: true,
        text: `Erro ao  ${isEdit.value ? 'editar' : 'salvar'} endereço.`,
        type: 'warn',
      })
    }
  }
  function reset() {
    if (isEdit.value) $router.push('/address')
    $refs.form.reset()
  }

  return {
    actionGetLocation,
    reset,
    isEdit,
    save,
    searchCEP,
    valid,
    cep,
    states,
    address,
    cities,
    progress,
  }
}
