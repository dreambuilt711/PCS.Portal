<template>
  <v-container>
    <v-col xl12 lg12 md12 sm12 xs12>
      <v-row class="justify-center">
        <v-col class="pt-4" xl8 lg8>
          <h2 :class="!$vuetify?.theme.dark ? 'text-accent header_font_size' : 'header_font_size'">
            <b>AccountLink</b>
          </h2>
          <v-divider />
        </v-col>
        <v-col xl8 lg8 sm12 class="elevation-4" pa-3>
          <v-col xs12 sm12 md12 lg12 xl12>
            <v-col class="text-left">
              <h3 v-if="loading">Validating your account...</h3>
              <h3 v-if="!loading && ssoEnabled">Click on login to access your AccountLink account.</h3>
              <h3 v-if="!loading && !ssoEnabled && isReliusUser">
                Your login is currently not synchronized with AccountLink.
                <br />Please contact
                <a href="mailto:info@theadvisorlab.com">info@theadvisorlab.com</a>
                to have your login properly synchronized.
              </h3>
              <h3 v-if="!loading && !ssoEnabled && !isReliusUser">
                AccountLink is not enabled for your login.
                <br />Please contact
                <a href="mailto:info@theadvisorlab.com">info@theadvisorlab.com</a>
                to enable this feature.
              </h3>
            </v-col>
          </v-col>
          <v-col xs12 sm12 md12 lg12 xl12 class="text-right">
            <v-btn v-if="!loading && ssoEnabled" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="initiateSSOLogin()">
              Login
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      ssoEnabled: false,
      isReliusUser: false,
      loading: true
    }
  },
  mounted() {
    this.$axios
      .get(`/api/v1/retention/pcs401k/sso/check`)
      .then((response) => {
        this.isReliusUser = response.data.contactId != null
        this.ssoEnabled = response.data.ssoEnabled
        this.loading = false
      })
      .catch(() => {
        this.ssoEnabled = false
        this.loading = false
      })
  },
  methods: {
    initiateSSOLogin() {
      if (this.$store.state.isImpersonating) {
        this.$toast.warning(
          'Plan Portal SSO is unavailable when impersonating another user.',
          '',
          this.notificationSystem.options.warning
        )

        return
      }
      if (this.ssoEnabled) {
        this.onPopUpEvent(`/api/v1/retention/pcs401k/sso/initiate`, '_AccountLink')
      }
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
