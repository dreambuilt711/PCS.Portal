<template>
  <v-col>
    <v-col v-if="!showLoader && lowReturnValue.length === 0 && !showError">
      <v-col class="d-flex justify-center mb-3 pt-16">
        <img :src="noLeadsFoundImage" />
      </v-col>
      <v-col class="d-flex justify-center mt-0">
        <div>
          <h5>No plans with low participation rates found.</h5>
        </div>
      </v-col>
      <v-col class="d-flex justify-center mb-16 mt-0">
        <div>
          <h5>Try adjusting the zipcode and radius.</h5>
        </div>
      </v-col>
    </v-col>
    <v-col>
      <Loader :loading-text="`Loading plans with Low participation`" :loading="participationLoader" />
    </v-col>
    <v-col v-if="!showLoader && lowReturnValue.length > 0" && !showError>
      <v-col>
        <v-col class="text-center pl-3 pr-3" xs12>
          <GroupBarchart :key="componentKey" ref="lowreturnChart" :group-chart="lowReturnValue" :live-width="mywidth" />
          <v-col xs12 :class="$vuetify?.breakpoint?.xs ? 'mb-3' : ''">
            <v-row class="justify-center" pt-0>
              <v-col class="flex_none pr-3">
                <v-row>
                  <div class="legend_circle align-self" :style="'background:' + peerGroupColor + ' !important'" />
                  <h4 class="font-weight-medium pl-2">vs. Peer Group</h4>
                </v-row>
              </v-col>
              <v-col class="flex_none">
                <v-row>
                  <div class="legend_circle align-self" :style="'background:' + IndustryGroupColor + ' !important'" />
                  <h4 class="font-weight-medium pl-2">vs. Industry Group</h4>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-col>
      <v-col pt-5 xs12 text-right class="d-flex justify-end">
        <v-btn
          :color="$vuetify?.theme.dark ? '' : 'hyperlink'"
          variant="text"
          size="small"
          class="mb-0"
          @click="showLowestParticipationPlans()"
        >
          View Plans
          <v-col ml-1>
            <v-icon size="14"> icon-arrow-thin-right </v-icon>
          </v-col>
        </v-btn>
      </v-col>
    </v-col>
  </v-col>
</template>
<script>
import GroupBarchart from '@/components/TAL/Finder/MarketInsights/GroupBarchart'
import { eventBus } from '@/main'
import Loader from '@/components/NewLoader'
export default {
  components: {
    GroupBarchart,
    Loader
  },
  props: ['participationLoader'],
  data() {
    return {
      lowReturnValue: [],
      componentKey: 0,
      mywidth: '500',
      lowestParticipationPlans: [],
      showLoader: false,
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
    },
    peerGroupColor() {
      return this.$store.state.theme.accentColors[0]
    },
    IndustryGroupColor() {
      return this.$store.state.theme.accentColors[2]
    }
  },
  watch: {
    participationLoader: {
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
      this.getLowParticipation()
    })
  },
  methods: {
    getLowParticipation() {
      if (this.zipcode) {
        this.$emit('loader', true)
        this.showLoader = true
        if (Object.keys(this.$store.state.planLowParticipate).length <= 0) {
          this.$axios
            .post(`/api/v1/tal/plan/LowestParticipation/${this.zipcode}/${this.searchRadius}`, this.marketInsightFilter)
            .then((success) => {
              if (success.data.message) {
                this.showLoader = false
                this.lowReturnValue = []
                this.lowestParticipationPlans = []
                this.showError = true
                this.$emit('loader', false)
                return
              }
              if (success.data.d !== null) {
                if (success.data.d.marketInsightsData.length > 0) {
                  this.lowReturnValue = [
                    {
                      name: 'Under $1M',
                      'vs. Peer Group': success.data.d.marketInsightsData[0].UnderOneMillionVsPeerGroup,
                      'vs. Industry Group': success.data.d.marketInsightsData[0].UnderOneMillionVsIndustryGroup
                    },
                    {
                      name: '$1M-$3M',
                      'vs. Peer Group': success.data.d.marketInsightsData[0].OneToThreeMillionVsPeerGroup,
                      'vs. Industry Group': success.data.d.marketInsightsData[0].OneToThreeMillionVsIndustryGroup
                    },
                    {
                      name: '$3M-$5M',
                      'vs. Peer Group': success.data.d.marketInsightsData[0].ThreeToFiveMillionVsPeerGroup,
                      'vs. Industry Group': success.data.d.marketInsightsData[0].ThreeToFiveMillionVsIndustryGroup
                    },
                    {
                      name: '$5M-$10M',
                      'vs. Peer Group': success.data.d.marketInsightsData[0].FiveToTenMillionVsPeerGroup,
                      'vs. Industry Group': success.data.d.marketInsightsData[0].FiveToTenMillionVsIndustryGroup
                    },
                    {
                      name: 'Over $10M',
                      'vs. Peer Group': success.data.d.marketInsightsData[0].OverTenMillionVsPeerGroup,
                      'vs. Industry Group': success.data.d.marketInsightsData[0].OverTenMillionVsIndustryGroup
                    }
                  ]
                  if (
                    success.data.d.marketInsightsData[0].UnderOneMillionVsPeerGroup === 0 &&
                    success.data.d.marketInsightsData[0].UnderOneMillionVsIndustryGroup === 0
                  ) {
                    this.lowReturnValue.splice(
                      this.lowReturnValue.findIndex((a) => a.name === 'Under $1M'),
                      1
                    )
                  }
                  if (
                    success.data.d.marketInsightsData[0].OneToThreeMillionVsPeerGroup === 0 &&
                    success.data.d.marketInsightsData[0].OneToThreeMillionVsIndustryGroup === 0
                  ) {
                    this.lowReturnValue.splice(
                      this.lowReturnValue.findIndex((a) => a.name === '$1M-$3M'),
                      1
                    )
                  }
                  if (
                    success.data.d.marketInsightsData[0].ThreeToFiveMillionVsPeerGroup === 0 &&
                    success.data.d.marketInsightsData[0].ThreeToFiveMillionVsIndustryGroup === 0
                  ) {
                    this.lowReturnValue.splice(
                      this.lowReturnValue.findIndex((a) => a.name === '$3M-$5M'),
                      1
                    )
                  }
                  if (
                    success.data.d.marketInsightsData[0].FiveToTenMillionVsPeerGroup === 0 &&
                    success.data.d.marketInsightsData[0].FiveToTenMillionVsIndustryGroup === 0
                  ) {
                    this.lowReturnValue.splice(
                      this.lowReturnValue.findIndex((a) => a.name === '$5M-$10M'),
                      1
                    )
                  }
                  if (
                    success.data.d.marketInsightsData[0].OverTenMillionVsPeerGroup === 0 &&
                    success.data.d.marketInsightsData[0].OverTenMillionVsIndustryGroup === 0
                  ) {
                    this.lowReturnValue.splice(
                      this.lowReturnValue.findIndex((a) => a.name === 'Over $10M'),
                      1
                    )
                  }
                }
                this.lowestParticipationPlans = success.data.d
              }
              this.$store.state.planLowParticipate = this.lowReturnValue
              this.$store.state.planLowParticipate.viewAll = this.lowestParticipationPlans
              this.showLoader = false
              this.showError = false
              this.$emit('loader', false)
              this.componentKey += 1
            })
            // eslint-disable-next-line no-unused-vars
            .catch((error) => {
              this.showLoader = false
              this.lowReturnValue = []
              this.lowestParticipationPlans = []
              this.showError = true
              this.$emit('loader', false)
            })
        } else {
          this.lowReturnValue = this.$store.state.planLowParticipate
          this.lowestParticipationPlans = this.$store.state.planLowParticipate.viewAll
          this.showLoader = false
          this.showError = false
          this.$emit('loader', false)
        }
      }
    },
    showLowestParticipationPlans() {
      this.$emit('showLowestParticipationPlans', this.lowestParticipationPlans)
    }
  }
}
</script>
<style scoped>
.legend_circle {
  height: 10px;
  width: 10px;
}
</style>
