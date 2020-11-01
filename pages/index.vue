<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="10">
      <div class="text-center">
        <TitlePage name="Lista de Endereços" />
        <AddressList />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import TitlePage from '~/components/layout/TitlePage.vue'
import AddressList from '~/components/address/AddressList.vue'

export default {
  components: {
    TitlePage,
    AddressList,
  },
}
</script>
