<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="adresses"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      no-data-text="Nenhum endereço cadastrado"
      no-results-text="Nenhum endereço encontrado"
      class="elevation-1"
      :search="search"
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <v-toolbar flat color="transparent">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar Endereço" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" to="/address/create"> <v-icon>mdi mdi-plus</v-icon> Cadastrar </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="blue" class="mr-2" @click="$router.push(`/address/${item.id}`)"> mdi-pencil </v-icon>
        <v-icon color="red" @click="showDelete(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <div v-if="adresses.length > itemsPerPage" class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
    <ModalDelete :item="itemDelete" :dialog="dialogDelete" @confirm-delete="deleteAddress" @close-modal="dialogDelete = false" />
  </div>
</template>

<script>
import { reqRef, onMounted, computed } from '@nuxtjs/composition-api'
import ModalDelete from '../layout/ModalDelete'

export default {
  components: { ModalDelete },
  setup(props, { root: { $store } }) {
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
  },
}
</script>
