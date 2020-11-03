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
import ModalDelete from '../layout/ModalDelete'
import AddressList from './AddressList'

export default {
  components: { ModalDelete },
  setup(props, { root: { $store } }) {
    const { deleteAddress, adresses, dialogDelete, itemDelete, search, showDelete, page, pageCount, itemsPerPage, headers } = AddressList(
      $store
    )
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
