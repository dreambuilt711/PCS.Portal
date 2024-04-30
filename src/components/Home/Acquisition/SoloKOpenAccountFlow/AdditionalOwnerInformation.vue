<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Additional Owner information</h1>
        </v-flex>
        <v-flex xs12 class="pb-1 pt-2">
          <v-row>
            <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
              <div class="text-h6 pb-1">Owner name</div>
              <v-text-field
                density="compact"
                placeholder="Name"
                v-model="ownerName1"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
              <div class="text-h6 pb-1">Percent owned</div>
              <v-text-field
                density="compact"
                placeholder="1-100%"
                v-model="percentOwned1"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
          </v-row>
          <v-row v-if="addOwnerInfo2">
            <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
              <div class="text-h6 pb-1">Owner name</div>
              <v-text-field
                density="compact"
                placeholder="Name"
                v-model="ownerName2"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
              <div class="text-h6 pb-1">Percent owned</div>
              <v-text-field
                density="compact"
                placeholder="1-100%"
                v-model="percentOwned2"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
          </v-row>
          <v-row v-if="addOwnerInfo3">
            <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
              <div class="text-h6 pb-1">Owner name</div>
              <v-text-field
                density="compact"
                placeholder="Name"
                v-model="ownerName3"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
              <div class="text-h6 pb-1">Percent owned</div>
              <v-text-field
                density="compact"
                placeholder="1-100%"
                v-model="percentOwned3"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
          </v-row>
          <v-row v-if="addOwnerInfo4">
            <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
              <div class="text-h6 pb-1">Owner name</div>
              <v-text-field
                density="compact"
                placeholder="Name"
                v-model="ownerName4"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
              <div class="text-h6 pb-1">Percent owned</div>
              <v-text-field
                density="compact"
                placeholder="1-100%"
                v-model="percentOwned4"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-flex>
          </v-row>
          <v-flex xl1 lg1>
            <v-btn :color="$vuetify.theme.dark ? '' : 'accent'" size="small" @click="addOwner(clickData)">+ Add owner</v-btn>
          </v-flex>
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
      ownerName1: '',
      percentOwned1: '',
      ownerName2: '',
      percentOwned2: '',
      ownerName3: '',
      percentOwned3: '',
      ownerName4: '',
      percentOwned4: '',
      addOwnerInfo2: false,
      addOwnerInfo3: false,
      addOwnerInfo4: false,
      clickData: 1
    }
  },
  methods: {
    nextSlide() {
      this.$emit('nextSlide')
    },
    addOwner(val) {
      if (val > 0 && val < 4) {
        if (val === 1) {
          this.addOwnerInfo2 = true
        }
        if (val === 2) {
          this.addOwnerInfo3 = true
        }
        if (val === 3) {
          this.addOwnerInfo4 = true
        }
        this.clickData++
      }
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
