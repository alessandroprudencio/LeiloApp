<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="10">
      <div class="text-center">
        <TitlePage name="Cadastro de Endereço" />
        <AddressForm />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import TitlePage from '~/components/layout/TitlePage.vue'
import AddressForm from '~/components/address/AddressForm.vue'

export default {
  components: {
    TitlePage,
    AddressForm,
  },
}
</script>
