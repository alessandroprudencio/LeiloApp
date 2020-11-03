import { reqRef, onMounted, computed } from '@nuxtjs/composition-api'

export default function AddressList($store) {
  const dialogDelete = reqRef(false)
  const itemDelete = reqRef({})
  const search = reqRef('')
  const page = reqRef(1)
  const pageCount = reqRef(0)
  const itemsPerPage = reqRef(10)
  const headers = [
    { align: 'left', text: 'CEP', value: 'cep' },
    { align: 'left', text: 'Logradouro', value: 'address' },
    { align: 'left', text: 'Número', value: 'number' },
    { align: 'left', text: 'Complemento', value: 'complement' },
    { align: 'left', text: 'Cidade', value: 'city' },
    { align: 'left', text: 'Estado', value: 'state' },
    { align: 'left', text: 'Ações', value: 'actions', sortable: false },
  ]

  const adresses = computed(() => $store.state.address.adresses)

  onMounted(async () => {
    await $store.dispatch('address/actionGetAdresses')
  })

  async function deleteAddress(item) {
    this.dialogDelete = !this.dialogDelete
    await $store.dispatch('address/actionDeleteAddress', item.id)
    await $store.dispatch('address/actionSetSnackbar', { show: true, text: 'Endereço excluido com sucesso.', type: 'success' })
  }

  function showDelete(item) {
    this.dialogDelete = !this.dialogDelete
    this.itemDelete = item
  }

  return {
    deleteAddress,
    adresses,
    dialogDelete,
    itemDelete,
    search,
    showDelete,
    page,
    pageCount,
    itemsPerPage,
    headers,
  }
}
