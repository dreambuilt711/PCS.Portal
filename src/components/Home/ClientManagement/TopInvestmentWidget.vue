<template>
  <v-col>
    <v-card
      class="elevation-6 pa-2"
      :class="[
        $vuetify?.breakpoint?.mdAndDown ? '' : $vuetify?.breakpoint?.width <= 1368 ? 'chart_height_widget' : 'chart_height'
      ]"
    >
      <v-col v-if="showTopInvestmentLoader" xs12 lg12 class="ma-0 pa-0">
        <v-progress-linear v-if="showTopInvestmentLoader" indeterminate color="accent" height="4" class="ma-0" />
      </v-col>
      <v-col v-else xs12>
        <v-col v-if="!showTopInvestmentLoader" xs12>
          <h2 class="font-weight-medium pa-4">Top Investments</h2>
          <v-row no-gutters>
            <v-col xs12 xl6 lg6 class="py-4 px-12">
              <v-col>
                <h3 class="font-weight-medium">By Asset Value</h3>
              </v-col>
              <v-col xs12 class="pt-5">
                <v-row>
                  <v-col v-for="(item, index) in assetValueData" :key="`${item.text}_${index}`" xs12 class="mb-5">
                    <v-row>
                      <v-col xs7 class="investmentBarClass">
                        <v-col xs12 :class="$vuetify?.breakpoint?.smAndDown ? 'mt-2 pl-2' : 'mt-2 pl-4'">
                          <p class="cursor-pointer" :class="$vuetify?.theme.dark ? 'text-white mb-0' : 'mb-0 pb-0'">
                            {{ item.text }}
                          </p>
                        </v-col>
                      </v-col>
                      <v-col xs5>
                        <v-col
                          class="cursor-pointer investmentNumberClass"
                          :class="[
                            `padding-top-10 text-right ${item.class} ${item.width} ${item.background}`,
                            $vuetify?.breakpoint?.xs ? 'pr-1 ' : 'pr-2 '
                          ]"
                        >
                          <v-col>
                            {{ currencyConvert(item.weightedAmt) }}
                          </v-col>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col xs12 xl6 lg6 class="py-4 px-12">
              <v-col>
                <h3 class="font-weight-medium">By Age Group</h3>
              </v-col>
              <v-col xs12 class="pt-5">
                <v-row>
                  <v-col v-for="(item, index) in assetValueData" :key="`${item.text}_${index}`" xs12 class="mb-5">
                    <v-row>
                      <v-col xs7 class="investmentBarClass">
                        <v-col xs12 :class="$vuetify?.breakpoint?.smAndDown ? 'mt-2 pl-2' : 'mt-2 pl-4'">
                          <p class="cursor-pointer" :class="$vuetify?.theme.dark ? 'text-white mb-0' : 'mb-0 pb-0'">
                            {{ item.text }}
                          </p>
                        </v-col>
                      </v-col>
                      <v-col xs5>
                        <v-col
                          class="cursor-pointer investmentNumberClass"
                          :class="[
                            `padding-top-10 text-right ${item.class} ${item.width} ${item.background}`,
                            $vuetify?.breakpoint?.xs ? 'pr-1 ' : 'pr-2 '
                          ]"
                        >
                          <v-col>
                            {{ currencyConvert(item.weightedAmt) }}
                          </v-col>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
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
      investmentByAssetValue: [],
      assetValueData: [
        {
          text: 'American Fund Trgt Date Rtx 2018',
          class: 'funnelAll',
          background: 'agrmntrcvdBackground',
          width: 'xs12',
          weightedAmt: 326500000
        },
        {
          text: 'Vangourd Fund Name 2017',
          class: 'funnelAll',
          background: 'agrmntrcvdBackground',
          width: 'xs10',
          weightedAmt: 216500000
        },
        {
          text: 'Another fund name here..',
          class: 'funnelAll',
          background: 'agrmntrcvdBackground',
          width: 'xs8',
          weightedAmt: 965000000
        },
        {
          text: 'Another fund name here..',
          class: 'funnelAll',
          background: 'agrmntrcvdBackground',
          width: 'xs6',
          weightedAmt: 665000
        },
        {
          text: 'Another fund name here..',
          class: 'funnelAll',
          background: 'agrmntrcvdBackground',
          width: 'xs4',
          weightedAmt: 56500
        },
        {
          text: 'Another fund name here..',
          class: 'funnelAll',
          background: 'agrmntrcvdBackground',
          width: 'xs3',
          weightedAmt: 56500
        }
      ]
    }
  },
  methods: {
    currencyConvert(labelValue) {
      Math.round(labelValue)
      if (labelValue === 0 || labelValue === '') {
        return 0
      }
      if (Math.abs(Number(labelValue)) >= 1.0e9) {
        let round = Math.round(Number(labelValue)) / 1.0e9
        return '$' + round.toFixed(0) + 'B'
      } else if (Math.abs(Number(labelValue)) >= 1.0e6) {
        let round = Math.round(Number(labelValue)) / 1.0e6
        return '$' + round.toFixed(0) + 'M'
      } else if (Math.abs(Number(labelValue)) >= 1.0e3) {
        let round = Math.round(Number(labelValue)) / 1.0e3
        return '$' + round.toFixed(0) + 'K'
      }
    }
  }
}
</script>
<style scoped>
.investmentBarClass {
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-color: rgb(var(--v-theme-accent)) !important;
  max-height: 40px;
  border-radius: 8px 0px 0px 8px !important;
}
.investmentNumberClass {
  max-height: 40px;
  border-radius: 0px 8px 8px 0px !important;
}
.funnelAll {
  height: 57px !important;
  color: rgb(var(--v-theme-secondary)) !important;
}
.agrmntrcvdBackground {
  background-color: rgb(var(--v-theme-accent)) !important;
}
</style>
