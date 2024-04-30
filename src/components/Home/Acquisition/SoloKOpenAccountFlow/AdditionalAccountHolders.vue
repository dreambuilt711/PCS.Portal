<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg6 md8 sm8>
        <v-flex class="text-center">
          <h1>Additional Account Holders</h1>
        </v-flex>
        <v-flex class="py-3 text-center">
          <h3>Are there any additional account holders for this account?.</h3>
        </v-flex>
        <v-flex class="text-center">
          <v-row class="justify-center">
            <v-radio-group v-model="addAccountHolderMode" inline class="mt-0 pt-0">
              <v-radio color="accent" label="Yes" value="Yes"></v-radio>
              <v-radio color="accent" label="No" value="No"></v-radio>
            </v-radio-group>
          </v-row>
        </v-flex>
        <v-flex class="py-3 text-center">
          <h3>If there are more than 3 additional account holders, please inform your sales contact.</h3>
        </v-flex>
        <v-flex pt-16>
          <v-flex class="text-center">
            <v-col class="pa-0">
              <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="nextSlide()">Next</v-btn>
            </v-col>
            <v-col class="pl-0 pr-0 pt-2">
              <v-btn class="text-capitalize" variant="outlined" :color="$vuetify.theme.dark ? '' : 'accent'" @click="prevSlide()"
                >Go Back</v-btn
              >
            </v-col>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-row>
  </v-flex>
</template>
<script>
export default {
  data() {
    return {
      addAccountHolderMode: 'No'
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.addAccountHolderMode = this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag
        ? this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag
        : 'No'
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag = this.addAccountHolderMode
      this.$emit('showAdditionalAccountForm', this.addAccountHolderMode)
      //this.$emit('nextSlide')
    },
    prevSlide() {
      this.$emit('prevSlide')
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
