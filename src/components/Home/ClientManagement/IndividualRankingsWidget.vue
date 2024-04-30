<template>
  <v-col>
    <v-card class="elevation-6" :class="[$vuetify?.breakpoint?.mdAndDown ? '' : 'chart_height']">
      <v-col v-if="showTopInvestmentLoader" xs12 lg12 class="ma-0 pa-0">
        <v-progress-linear v-if="showTopInvestmentLoader" indeterminate color="accent" height="4" class="ma-0" />
      </v-col>
      <v-col v-else xs12>
        <v-col v-if="!showTopInvestmentLoader && investmentByAssetValue && investmentByAssetValue.length > 0" xs12>
          <h2 class="font-weight-medium pa-4">Top Investments</h2>
          <v-row no-gutters>
            <v-col xs12 xl6 lg6 />
            <v-col xs12 xl6 lg6 />
          </v-row>
        </v-col>
        <v-col v-else xs12>
          <v-row class="pt-12">
            <v-col xs12 class="shortcutflex">
              <v-col class="imageflex mt-5" pl-3 pr-3>
                <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
              </v-col>
              <v-col xs12 text-center mt-2>
                <h2 class="font-weight-medium">No Data Available</h2>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-card>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      comingSoonImage: require('@/assets/images/win.svg'),
      showTopInvestmentLoader: false,
      investmentByAssetValue: []
    }
  }
}
</script>
