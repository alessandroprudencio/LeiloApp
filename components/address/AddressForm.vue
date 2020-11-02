<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="address.cep"
        v-mask="'##.###-###'"
        data-cy="cep"
        :rules="[(v) => !!v || 'O CEP é obrigatório', (v) => (v && v.length > 8) || 'O CEP deve conter 8 digitos']"
        label="CEP"
        required
        @change="searchCEP"
      ></v-text-field>

      <v-text-field
        v-model="address.address"
        :rules="[(v) => !!v || 'O logradouro é obrigatório']"
        label="Logradouro"
        data-cy="address"
        required
      ></v-text-field>

      <v-text-field
        v-model="address.number"
        :rules="[(v) => !!v || 'O número é obrigatório']"
        label="Número"
        required
        data-cy="number"
      ></v-text-field>

      <v-text-field v-model="address.complement" data-cy="complement" label="Complemento"></v-text-field>

      <v-select
        v-model="address.state"
        :items="states"
        :rules="[(v) => !!v || 'O UF é obrigatorio']"
        label="Estado"
        data-cy="state"
        item-text="nome"
        item-value="sigla"
        required
      ></v-select>

      <v-select
        v-model="address.city"
        :items="cities"
        :rules="[(v) => !!v || 'A cidade é obrigatoria']"
        data-cy="city"
        label="Cidade"
        item-text="nome"
        item-value="nome"
        required
      ></v-select>
      <v-btn color="error" class="mr-4" @click="reset"> Cancelar </v-btn>
      <v-btn :disabled="!valid" color="success" class="mr-4" data-cy="btnSave" @click="save">
        {{ $route.params.id ? 'Editar ' : 'Cadastrar' }}
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    address: { address: '' },
    valid: true,
  }),
  computed: {
    ...mapState('address', ['cep', 'states', 'cities', 'progress']),
    isEdit() {
      return this.$route.params.id
    },
  },
  watch: {
    async 'address.state'() {
      await this.actionGetCitiesByState(this.address.state)
    },
  },
  async created() {
    await this.actionGetStates()
    if (this.isEdit) this.address = await this.actionGetAddressById(this.isEdit)
  },
  methods: {
    ...mapActions('address', [
      'actionGetCEP',
      'actionGetStates',
      'actionGetCitiesByState',
      'actionRegisterAddress',
      'actionGetAddressById',
      'actionEditAddress',
      'actionSetSnackbar',
    ]),
    async searchCEP() {
      try {
        await this.actionGetCEP(this.address.cep)
        const { logradouro, uf, localidade, complemento } = this.cep
        this.address.address = logradouro
        this.address.state = uf
        this.address.city = localidade
        this.address.complement = complemento
      } catch (error) {
        this.actionSetSnackbar({ show: true, text: error, type: 'error' })
        this.valid = false
      }
    },
    async save() {
      if (!this.$refs.form.validate()) return

      try {
        if (this.isEdit) {
          await this.actionEditAddress(this.address)
          // this.$router.push("/");
        } else {
          await this.actionRegisterAddress(this.address)
          this.$refs.form.reset()
        }
        this.actionSetSnackbar({ show: true, text: `Endereço ${this.isEdit ? 'editado' : 'cadastrado'} com sucesso!`, type: 'success' })
      } catch (error) {
        this.actionSetSnackbar({
          show: true,
          text: 'Erro ao cadastrar endereço',
          type: 'warn',
        })
      }
    },
    reset() {
      this.$refs.form.reset()
      this.address = {}
    },
  },
}
</script>
