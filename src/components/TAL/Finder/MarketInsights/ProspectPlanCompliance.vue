<template>
  <v-col>
    <v-col v-if="!showLoader && totalCount === 0 && !showError" pl-13>
      <v-col class="d-flex justify-center mb-3 pt-16">
        <img :src="noLeadsFoundImage" />
      </v-col>
      <v-col class="d-flex justify-center mt-0">
        <div>
          <h5>No plans with compliance issues found.</h5>
        </div>
      </v-col>
      <v-col class="d-flex justify-center mb-16 mt-0">
        <div>
          <h5>Try adjusting the zipcode and radius.</h5>
        </div>
      </v-col>
    </v-col>
    <v-col>
      <Loader :loading-text="`Loading plans with compliance issues`" :loading="prospectLoader" />
    </v-col>
    <v-col v-if="!showLoader && totalCount > 0 && !showError">
      <v-row>
        <v-col class="text-center justify-left" sm6 xs10>
          <ProspectPlanComplianceDonut ref="prospectResult" :live-width="liveWidth" :prospect-values="prospectResult" />
        </v-col>
        <v-col class="flex_none sm5 justify-center align-self-center ml-auto">
          <v-col pb-2>
            <v-row>
              <div class="legend_circle align-self" :style="'background:' + peerGroupColor + ' !important'" />
              <h4 class="font-weight-medium pl-2">{{ oneComplianceIssueCount }} plans have 1 compliance issue</h4>
            </v-row>
          </v-col>
          <v-col pb-2>
            <v-row>
              <div class="legend_circle align-self" :style="'background:' + IndustryGroupColor + ' !important'" />
              <h4 class="font-weight-medium pl-2">{{ twoComplianceIssuesCount }} plans have 2 compliance issues</h4>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <div class="legend_circle align-self" :style="'background:' + threePlusGroupColor + ' !important'" />
              <h4 class="font-weight-medium pl-2">{{ threePlusComplianceIssuesCount }} plans have 3+ compliance issues</h4>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
      <v-col xs12 text-right class="d-flex justify-end">
        <v-btn
          :color="$vuetify?.theme.dark ? '' : 'hyperlink'"
          variant="text"
          size="small"
          class="mb-0"
          @click="showProspectPlanCompliance()"
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
import ProspectPlanComplianceDonut from '@/components/TAL/Finder/MarketInsights/ProspectPlanComplianceDonut'
import { eventBus } from '@/main'
import Loader from '@/components/NewLoader'
export default {
  components: {
    ProspectPlanComplianceDonut,
    Loader
  },
  props: ['liveWidth', 'prospectLoader'],
  data() {
    return {
      prospectResult: [
        {
          label: 'Have 1 Compliance Issue',
          value: 0
        },
        {
          label: 'Have 2 Compliance Issue',
          value: 0
        },
        {
          label: 'Have 3+ Compliance Issue',
          value: 0
        }
      ],
      showLoader: true,
      tabName: 'Individuals',
      comingSoonImage: require('@/assets/images/win.svg'),
      showError: false,
      totalCount: 0,
      oneComplianceIssueCount: 0,
      twoComplianceIssuesCount: 0,
      threePlusComplianceIssuesCount: 0,
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
    },
    threePlusGroupColor() {
      return this.$store.state.theme.accentColors[3] === '#FFFFFF' ? '#cccccc' : this.$store.state.theme.accentColors[3]
    }
  },
  watch: {
    prospectLoader: {
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
      this.GetProspectResultCompliance()
    })
  },
  methods: {
    GetProspectResultCompliance() {
      if (this.zipcode) {
        this.$emit('loader', true)
        this.showLoader = true

        if (Object.keys(this.$store.state.planProspect).length <= 0) {
          this.$axios
            .post(`/api/v1/tal/plan/ComplianceAlerts/${this.zipcode}/${this.searchRadius}`, this.marketInsightFilter)
            .then((success) => {
              if (success.data.message) {
                this.showLoader = false
                this.prospectResult = []
                this.showError = true
                this.$emit('loader', false)
                return
              }
              if (success.data.d != null) {
                if (Object.keys(success.data.d).length > 0) {
                  this.prospectResult = success.data.d
                  this.totalCount = this.prospectResult.marketInsightsData[0].TotalPlans
                  this.oneComplianceIssueCount = this.prospectResult.marketInsightsData[0].HaveOneComplianceIssue
                  this.twoComplianceIssuesCount = this.prospectResult.marketInsightsData[0].HaveTwoComplianceIssues
                  this.threePlusComplianceIssuesCount = this.prospectResult.marketInsightsData[0].HaveThreePlusComplianceIssues
                }
                this.$store.state.planProspect = this.prospectResult
                this.showLoader = false
                this.showError = false
                this.$emit('loader', false)
              }
            })
            // eslint-disable-next-line no-unused-vars
            .catch((error) => {
              this.showLoader = false
              this.prospectResult = []
              this.showError = true
              this.$emit('loader', false)
            })
        } else {
          this.prospectResult = this.$store.state.planProspect
          this.totalCount = this.prospectResult.marketInsightsData[0].TotalPlans
          this.showLoader = false
          this.showError = false
          this.$emit('loader', false)
        }
      }
    },
    showProspectPlanCompliance() {
      var plans = this.prospectResult.marketInsightsPlans
      this.$emit('showProspectPlanCompliance', plans)
    }
  }
}
</script>
<style scoped>
.toggleButton .v-btn:before {
  opacity: 0 !important;
}

.v-text-field.v-text-field--solo .v-input__control {
  min-height: 36px !important;
}

.legend_circle {
  height: 10px;
  width: 10px;
}
</style>
