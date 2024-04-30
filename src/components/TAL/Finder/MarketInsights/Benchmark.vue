<template>
  <v-col>
    <v-col v-if="!showLoader && benchmarkData.length === 0 && showError" pl-8>
      <v-col class="d-flex justify-center mb-3 pt-16">
        <img :src="noLeadsFoundImage" />
      </v-col>
      <v-col class="d-flex justify-center mt-0">
        <div>
          <h5>No plans with fees above benchmarks found.</h5>
        </div>
      </v-col>
      <v-col class="d-flex justify-center mb-16 mt-0">
        <div>
          <h5>Try adjusting the zipcode and radius.</h5>
        </div>
      </v-col>
    </v-col>
    <v-col class="d-flex justify-center">
      <Loader :loading-text="`Loading plans with Fees above benchmark`" :loading="benchmarkLoader" />
    </v-col>
    <v-col v-if="!showLoader && benchmarkData.length > 0 && !showError" xs12>
      <BenchmarkBarChart :key="componentKey" :live-width="mywidth" :benchmark-data="benchmarkData" />
    </v-col>
    <!-- <v-col
      mt-3
      pl-8
      v-if="!showLoader && benchmarkData.length > 0 && !showError"
    >
      <v-row class="justify-center">
        <v-col class="flex_none pt-1 pb-1 text-center">
          <h3>{{ numberFormat(avgCommissionFees) }}</h3>
          <h4
            :class="
              $vuetify?.theme.dark ? 'font-weight-medium' : 'font-weight-medium'
            "
          >
            Avg. Peer Group Fees
          </h4>
        </v-col>
        <v-col class="flex_none pl-2 pt-1 pb-1 text-center">
          <h3>{{ numberFormat(avgPeerGroupFees) }}</h3>
          <h4
            :class="
              $vuetify?.theme.dark ? 'font-weight-medium' : 'font-weight-medium'
            "
          >
            Avg. Commission Fees
          </h4>
        </v-col>
      </v-row>
    </v-col> -->
    <v-col v-if="!showLoader && benchmarkData.length > 0 && !showError" xs12 text-right class="d-flex justify-end">
      <v-btn
        :color="$vuetify?.theme.dark ? '' : 'hyperlink'"
        variant="text"
        size="small"
        class="mb-0"
        @click=";[showBenchmarkPlans(), vsPeerGroup(), vsIndustryGroup()]"
      >
        View Plans
        <v-col ml-1>
          <v-icon size="14"> icon-arrow-thin-right </v-icon>
        </v-col>
      </v-btn>
    </v-col>
  </v-col>
</template>
<script>
import BenchmarkBarChart from '@/components/TAL/Finder/MarketInsights/BenchmarkBarChart'
import { eventBus } from '@/main'
import Loader from '@/components/NewLoader'
export default {
  components: {
    BenchmarkBarChart,
    Loader
  },
  props: ['liveWidth', 'benchmarkLoader'],
  data() {
    return {
      benchmarkValue: [],
      avgPeerGroupFees: 0,
      avgCommissionFees: 0,
      industryGroup: 0,
      peerGroup: 0,
      benchmarkData: [],
      componentKey: 0,
      mywidth: '500',
      showLoader: false,
      benchmarkPlans: [],
      comingSoonImage: require('@/assets/images/win.svg'),
      noLeadsFoundImage: require('@/assets/images/no-records.svg'),
      showError: false,
      marketInsightFilter: {}
    }
  },
  computed: {
    zipcode() {
      return this.$store.state.marketInsight.zipcode
    },
    searchRadius() {
      return this.$store.state.marketInsight.searchRadius
    }
  },
  watch: {
    benchmarkLoader: {
      handler(val) {
        if (val) {
          this.showLoader = val
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    eventBus.on('loadWidget', (data) => {
      this.marketInsightFilter = data
      this.getBenchmark()
    })
  },
  methods: {
    numberFormat(value) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    },
    getBenchmark() {
      if (this.zipcode) {
        this.$emit('loader', true)
        this.showLoader = true

        if (Object.keys(this.$store.state.benchmarks).length <= 0) {
          this.$axios
            .post(`/api/v1/tal/plan/PlanFeeAboveBenchmark/${this.zipcode}/${this.searchRadius}`, this.marketInsightFilter)
            .then((success) => {
              if (success.data.message) {
                this.showLoader = false
                this.benchmarkData = []
                this.benchmarkPlans = []
                this.showError = true
                this.$emit('loader', false)
                return
              }
              if (success.data.d != null) {
                if (success.data.d.marketInsightsData.length > 0) {
                  this.peerGroup = success.data.d.marketInsightsData[0].VsPeerGroup
                  this.industryGroup = success.data.d.marketInsightsData[0].VsIndustryGroup
                  this.avgCommissionFees = success.data.d.marketInsightsData[0].AvgCommissionFees
                  this.avgPeerGroupFees = success.data.d.marketInsightsData[0].AvgPeerGroupFees
                  this.benchmarkData = [
                    {
                      name: `Peer Group: ${this.peerGroup}`,
                      yAxis: success.data.d.marketInsightsData[0].VsPeerGroup,
                      xAxis: 0,
                      color: this.$store.state.theme.accentColors[0]
                    },
                    {
                      name: `Industry Group: ${this.industryGroup}`,
                      yAxis: success.data.d.marketInsightsData[0].VsIndustryGroup,
                      xAxis: 0,
                      color: this.$store.state.theme.accentColors[2]
                    }
                  ]

                  var Total =
                    success.data.d.marketInsightsData[0].VsPeerGroup + success.data.d.marketInsightsData[0].VsIndustryGroup
                  var peerGroupxAxis = (success.data.d.marketInsightsData[0].VsPeerGroup / Total) * 100
                  var industryGroupxAxis = (success.data.d.marketInsightsData[0].VsIndustryGroup / Total) * 100

                  this.benchmarkData[0].xAxis = peerGroupxAxis
                  this.benchmarkData[0].yAxis = this.currencyFormat(success.data.d.marketInsightsData[0].VsPeerGroup)
                  this.benchmarkData[1].yAxis = this.currencyFormat(success.data.d.marketInsightsData[0].VsIndustryGroup)
                  this.benchmarkData[1].xAxis = industryGroupxAxis
                  this.benchmarkPlans = success.data.d.marketInsightsPlans.length > 0 ? success.data.d.marketInsightsPlans : []
                  if (success.data.d.marketInsightsPlans.length === 0) this.benchmarkData = []
                }
              }
              this.$store.state.benchmarks = this.benchmarkData
              this.$store.state.benchmarks.vsPeerGroup = this.peerGroup
              this.$store.state.benchmarks.vsIndustryGroup = this.industryGroup
              this.$store.state.benchmarks.viewAll = this.benchmarkPlans
              this.showLoader = false
              this.$emit('loader', false)
              this.showError = false
              this.componentKey += 1
            })
            .catch(() => {
              this.showLoader = false
              this.benchmarkData = []
              this.benchmarkPlans = []
              this.showError = true
              this.$emit('loader', false)
            })
        } else {
          this.benchmarkData = this.$store.state.benchmarks
          this.peerGroup = this.$store.state.benchmarks.vsPeerGroup
          this.industryGroup = this.$store.state.benchmarks.vsIndustryGroup
          this.benchmarkPlans = this.$store.state.benchmarks.viewAll
          this.showLoader = false
          this.showError = false
          this.$emit('loader', false)
        }
      }
    },
    currencyFormat(val) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      return formatter.format(val)
    },
    showBenchmarkPlans() {
      this.$emit('showBenchmarkPlans', this.benchmarkPlans)
    },
    vsPeerGroup() {
      var vsPeerGroup = this.peerGroup
      this.$emit('vsPeerGroup', vsPeerGroup)
    },
    vsIndustryGroup() {
      var vsIndustryGroup = this.industryGroup
      this.$emit('vsIndustryGroup', vsIndustryGroup)
    }
  }
}
</script>
<style scoped>
.legend_circle {
  height: 15px;
  width: 15px;
  border-radius: 7px;
}
.Peerboxeffect {
  border: 1px solid #707070;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.Industryboxeffect {
  border: 1px solid #707070;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
</style>
