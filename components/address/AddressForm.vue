<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="6" md="6">
          <v-text-field
            v-model="address.cep"
            v-mask="'##.###-###'"
            data-cy="cep"
            :rules="[(v) => !!v || 'O CEP é obrigatório', (v) => (v && v.length > 8) || 'O CEP deve conter 8 digitos']"
            label="CEP"
            required
            @change="searchCEP"
          ></v-text-field>
        </v-col>

        <v-col cols="2" md="2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" large color="blue-grey" class="ma-2 white--text" v-on="on" @click="actionGetLocation">
                <v-icon left dark> mdi mdi-map-marker </v-icon>
                Não sei meu cep
              </v-btn>
            </template>
            <span>Não sabe seu CEP ? Clique aqui, que iremos buscar seu cep, baseado na sua localização atual.</span>
          </v-tooltip>
        </v-col>

        <v-col cols="12" md="12">
          <v-text-field
            v-model="address.address"
            :rules="[(v) => !!v || 'O logradouro é obrigatório']"
            label="Logradouro"
            data-cy="address"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="12">
          <v-text-field
            v-model="address.number"
            :rules="[(v) => !!v || 'O número é obrigatório']"
            label="Número"
            required
            data-cy="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-model="address.complement" data-cy="complement" label="Complemento"></v-text-field>
        </v-col>

        <v-col cols="12" md="12">
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
        </v-col>

        <v-col cols="12" md="12">
          <v-select
            v-model="address.city"
            :items="cities"
            :rules="[(v) => !!v || 'A cidade é obrigatoria']"
            data-cy="city"
            label="Cidade"
            no-data-text="Selecione um estado"
            item-text="nome"
            item-value="nome"
            required
          ></v-select>
        </v-col>

        <v-col cols="12" md="12">
          <v-btn color="error" class="mr-4" @click="reset"> Cancelar </v-btn>
          <v-btn :disabled="!valid" color="success" class="mr-4" data-cy="btnSave" @click="save">
            {{ $route.params.id ? 'Editar ' : 'Cadastrar' }}
          </v-btn>
        </v-col>
      </v-row>
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
      'actionGetAddressByLocation',
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
    actionGetLocation() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.address = await this.actionGetAddressByLocation({ lng: position.coords.longitude, lat: position.coords.latitude })
      })
    },
    async save() {
      if (!this.$refs.form.validate()) return

      try {
        if (this.isEdit) {
          await this.actionEditAddress(this.address)
          this.$router.push('/')
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
