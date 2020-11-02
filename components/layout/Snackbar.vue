<template>
  <v-snackbar
    v-model="snackbar.show"
    top
    data-ci="alert"
    right
    timeout="2000"
    transition="slide-y-transition"
    :color="snackbar.type"
    @change="actionSetSnackbar({ show: false })"
  >
    {{ snackbar.text }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="actionSetSnackbar({ show: false })"> Fechar </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Snackbar',
  methods: {
    ...mapActions('address', ['actionSetSnackbar']),
  },
  computed: {
    ...mapState('address', ['snackbar']),
  },
}
</script>
