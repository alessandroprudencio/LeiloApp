<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col class="pb-0" cols="6" md="6">
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

        <v-col class="pb-0" cols="2" md="2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                data-cy="btnNotknowCEP"
                v-bind="attrs"
                large
                color="blue-grey"
                class="ma-2 white--text"
                v-on="on"
                @click="actionGetLocation"
              >
                <v-icon left dark> mdi mdi-map-marker </v-icon>
                Não sei meu cep
              </v-btn>
            </template>
            <span>Não sabe seu CEP ? Clique aqui, que iremos buscar seu cep, baseado na sua localização atual.</span>
          </v-tooltip>
        </v-col>

        <v-col class="pt-0 pb-0" cols="12" md="12">
          <v-text-field
            v-model="address.address"
            :rules="[(v) => !!v || 'O logradouro é obrigatório']"
            label="Logradouro"
            data-cy="address"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="12" class="pt-0 pb-0">
          <v-text-field
            v-model="address.number"
            :rules="[(v) => !!v || 'O número é obrigatório']"
            label="Número"
            required
            data-cy="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="pt-0 pb-0">
          <v-text-field v-model="address.complement" data-cy="complement" label="Complemento"></v-text-field>
        </v-col>

        <v-col cols="12" md="12" class="pt-0 pb-0">
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

        <v-col cols="12" md="12" class="pt-0 pb-0">
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

        <v-col cols="12" md="12" class="pt-0 pb-0">
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
import AddressForm from './AddressForm.js'

export default {
  setup(props, { root: { $store, $route, $router }, refs }) {
    const { actionGetLocation, reset, address, isEdit, save, searchCEP, valid, cep, states, cities, progress } = AddressForm(
      $store,
      $route,
      refs,
      $router
    )
    return {
      actionGetLocation,
      reset,
      isEdit,
      address,
      save,
      searchCEP,
      valid,
      cep,
      states,
      cities,
      progress,
    }
  },
}
</script>
