<template>
  <v-flex>
    <v-row no-gutters class="justify-center">
      <v-flex xs12 lg6>
        <v-flex xs12 class="text-center pt-4">
          <v-icon size="70" :color="$vuetify.theme.dark ? '' : 'accent'">mdi-check-circle-outline</v-icon>
        </v-flex>
        <v-flex xs12 class="text-center pt-6">
          <h1>Application submitted!</h1>
        </v-flex>
        <v-flex class="text-center pb-6 pt-10">
          <h2>Thank you for your submission. A confirmation will be sent to the email on file with a copy of your request.</h2>
        </v-flex>
        <v-flex class="text-center pb-6">
          <h2>If you have any questions, please reach out to Sales by calling</h2>
          <h2>1 (866) 634-5873.</h2>
        </v-flex>
        <v-flex xs12 pt-4 class="text-center">
          <v-row justify="center">
            <v-col :cols="$vuetify.breakpoint.xs ? '' : '8'" class="pa-0">
              <v-btn
                class="text-none btnStyle"
                size="large"
                :color="$vuetify.theme.dark ? '' : 'accent'"
                @click="closeAllDialog()"
                >Close</v-btn
              >
            </v-col>
          </v-row>
        </v-flex>
      </v-flex>
    </v-row>
  </v-flex>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    closeAllDialog() {
      this.$emit('closeAllDialog')
    }
  }
}
</script>
<style scoped>
.btnStyle {
  height: 46px !important;
  width: 250px !important;
}
</style>
