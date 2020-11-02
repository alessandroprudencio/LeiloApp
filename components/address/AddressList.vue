<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="adresses"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      no-data-text="Nenhum endereço cadastrado"
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <v-toolbar flat color="transparent">
          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" to="create"> <v-icon>mdi mdi-plus</v-icon> Cadastrar </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="blue" class="mr-2" @click="$router.push(`/${item.id}`)"> mdi-pencil </v-icon>
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
import { mapActions, mapState } from 'vuex'
import ModalDelete from '../layout/ModalDelete'

export default {
  components: { ModalDelete },
  async fetch() {
    await this.actionGetAdresses()
  },
  data() {
    return {
      dialogDelete: false,
      itemDelete: {},
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        { text: 'CEP', align: 'left', value: 'cep' },
        { align: 'left', text: 'Logradouro', value: 'address' },
        { align: 'left', text: 'Número', value: 'number' },
        { align: 'left', text: 'Complemento', value: 'complement' },
        { align: 'left', text: 'Cidade', value: 'city' },
        { align: 'left', text: 'Estado', value: 'state' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapState('address', ['adresses']),
  },
  methods: {
    ...mapActions('address', ['actionGetAdresses', 'actionDeleteAddress', 'actionSetSnackbar']),
    async deleteAddress(item) {
      this.dialogDelete = !this.dialogDelete
      await this.actionDeleteAddress(item.id)
      await this.actionGetAdresses()
      this.actionSetSnackbar({ show: true, text: 'Endereço excluido com sucesso.', type: 'success' })
    },
    showDelete(item) {
      this.dialogDelete = !this.dialogDelete
      this.itemDelete = item
    },
  },
}
</script>
