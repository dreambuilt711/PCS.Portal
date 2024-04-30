<template>
  <v-container>
    <div v-if="hasRBC" class="iframe-container">
      <iframe :src="iframe.src" />
    </div>
    <v-col v-if="!hasRBC" xl12 lg12 md12 sm12 xs12>
      <v-row class="justify-center">
        <v-col class="pt-4" xl8 lg8>
          <h1>Reporting &amp; Benchmarking Center</h1>
          <v-divider />
        </v-col>
        <v-col xl8 lg8 sm12 class="elevation-4">
          <v-col xs12 sm12 md12 lg12 xl12 pa-1>
            <v-col class="text-left" pl-3 pt-3>
              <h3 v-if="loading">Validating your account...</h3>
              <h3 v-if="!loading && !hasRBC">
                RBC is not enabled for your login.
                <br />Please contact
                <a href="mailto:info@theadvisorlab.com">info@theadvisorlab.com</a>
                to enable this feature.
              </h3>
              <br />
            </v-col>
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
      hasRBC: false,
      loading: true,
      iframe: {
        src: '/api/v1/retention/rbc/redirect'
      }
    }
  },
  mounted() {
    if (this.$store.state.user.reliusLoginId) {
      this.$axios
        .get(`/api/v1/retention/rbc/check`)
        .then((response) => {
          this.hasRBC = response.data === true
          this.loading = false
        })
        .catch(() => {
          this.hasRBC = false
          this.loading = false
        })
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
.iframe-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 30px);
  flex-direction: column;
  overflow: hidden;
}
.iframe-container iframe {
  flex-grow: 1;
  border: none;
  margin: 0;
  padding: 0;
}
</style>
