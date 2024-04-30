<template>
  <v-container>
    <v-col xl12 lg12 md12 sm12 xs12>
      <v-row class="justify-center">
        <v-col class="pt-4" xl8 lg8>
          <h2 :class="!$vuetify?.theme.dark ? 'text-accent header_font_size' : 'header_font_size'">
            <b>Apprise Labs</b>
          </h2>
          <v-divider />
        </v-col>
        <v-col xl8 lg8 sm12 class="elevation-4" pa-3>
          <v-col xs12 sm12 md12 lg12 xl12>
            <v-col class="text-left">
              <h3>Click on login to access Apprise Labs.</h3>
            </v-col>
          </v-col>
          <v-col xs12 sm12 md12 lg12 xl12 class="text-right">
            <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" @click="initiateSSOLogin()"> Login </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
export default {
  methods: {
    initiateSSOLogin() {
      this.onPopUpEvent(`/api/v1/retention/apprise/sso/initiate`, '_Apprise')
    }
  }
}
</script>
<style scoped>
.line_height .v-list-item__title {
  line-height: 16px !important;
}
.v-list-item .v-list-item__content .v-list-item__title {
  line-height: 16px !important;
}
</style>
