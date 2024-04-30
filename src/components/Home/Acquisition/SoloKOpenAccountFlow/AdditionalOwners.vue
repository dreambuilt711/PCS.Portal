<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Additional owners</h1>
        </v-flex>
        <v-flex class="py-3 text-center">
          <h3>Are there any additional owners for this account?.</h3>
        </v-flex>
        <v-flex class="text-center">
          <v-row class="justify-center">
            <v-radio-group v-model="addOwnersMode" inline class="mt-0 pt-0">
              <v-radio color="accent" label="Yes" value="Yes"></v-radio>
              <v-radio color="accent" label="No" value="No"></v-radio>
            </v-radio-group>
          </v-row>
        </v-flex>
        <v-flex pt-16>
          <v-flex class="text-center">
            <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="nextSlide()">Next</v-btn>
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
      addOwnersMode: 'No'
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.addOwnersMode = this.$store.state.soloKOpenAccountDetail.AddOwnerFlag
        ? this.$store.state.soloKOpenAccountDetail.AddOwnerFlag
        : 'No'
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.AddOwnerFlag = this.addOwnersMode
      this.$emit('showAdditionalOwnerForm', this.addOwnersMode)
      //this.$emit('nextSlide')
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
