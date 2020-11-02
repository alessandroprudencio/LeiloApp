<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-dialog v-model="progress" hide-overlay persistent width="400">
      <v-card color="primary" dark>
        <v-card-text>
          Por favor aguarde, estamos buscando seu CEP...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Snackbar from '~/components/layout/Snackbar'
export default {
  name: 'Default',
  components: { Snackbar },

  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-clipboard-list-outline',
          title: 'Endereços',
          to: '/',
        },
        {
          icon: 'mdi-plus',
          title: 'Cadastrar',
          to: '/create',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'LeiloApp',
    }
  },
  computed: {
    ...mapState('address', ['progress', 'snackbar']),
  },
}
</script>
