<template>
  <v-flex>
    <v-flex class="text-center">
      <h1><b style="color: #0077cc">Investment selection</b></h1>
    </v-flex>
    <v-flex class="py-3">
      <h3>Enter your total election percentage for each fund selected. Your total election must total 100%.</h3>
      <v-flex xs12 class="pb-1 pt-2">
        <v-row>
          <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
            <div class="text-h6 pb-1">Fund name</div>
            <v-select
              density="compact"
              variant="outlined"
              placeholder="Select type of entity"
              v-model="fundName"
              :items="fundNameList"
              append-icon="icon-chevron-down"
              hide-details
              return-object
            ></v-select>
            <v-btn :color="$vuetify.theme.dark ? '' : 'accent'" @click="addFund()">+ Add Fund</v-btn>
          </v-flex>
          <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
            <div class="text-h6 pb-1">Percent</div>
            <v-text-field
              density="compact"
              placeholder="1-100%"
              v-model="percent"
              single-line
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-flex>
        </v-row>
      </v-flex>
      <v-flex xs12 class="pb-1 pt-2">
        <v-row>
          <v-flex xs12 sm8 md8><a>View Franklin Templeton Solo(k) Investment Options</a></v-flex>
          <v-flex xs12 sm4 md4
            ><h2><b style="color: #0077cc">Total election: 0%</b></h2></v-flex
          >
        </v-row>
      </v-flex>
    </v-flex>
    <v-flex xs12 class="text-center">
      <v-btn :color="$vuetify.theme.dark ? '' : 'accent'" size="large" @click="nextSlide()">Continue</v-btn>
    </v-flex>
  </v-flex>
</template>
<script>
export default {
  data() {
    return {
      fundName: '',
      fundNameList: [{}],
      percent: ''
    }
  },
  methods: {
    nextSlide() {
      this.$emit('nextSlide')
    },
    addFund() {}
  }
}
</script>
