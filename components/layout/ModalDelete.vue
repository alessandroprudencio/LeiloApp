<template>
  <v-dialog v-model="dialog" width="500" @mouseleave="$emit('close-modal')">
    <v-card>
      <v-card-title class="headline black--text grey lighten-3"> Excluir endereço </v-card-title>
      <v-card-text class="mt-2">
        Tem certeza que deseja excluir este endereço com cep <i>{{ item.cep }} </i> ? Esta ação não podera ser desfeita.
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="$emit('confirm-delete', item)"> Confirmar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>
