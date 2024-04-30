<template>
  <v-container fluid>
    <v-col>
      <v-col class="pt-2 pb-3">
        <h1 class="font-weight-medium">Market Insight</h1>
      </v-col>
      <!-- zipcode and radius and button -->
      <v-col>
        <v-row>
          <v-col xl2 lg2 md3 sm4>
            <v-text-field
              v-model="zipcode"
              label="Zip Code"
              hint="ex.90001"
              maxlength="5"
              :class="zipcode === 'Current Location' && !$vuetify?.theme.dark ? 'textColor' : ''"
              :error="zipcodeError"
              :error-messages="zipcodeErrorMsg"
              clearable
              variant="outlined"
              @keypress="onlyNumber"
              @keydown="maskAllow($event)"
              @blur="checkCurrentLocation()"
              @click:clear="clearZip"
              @click:append-inner="getCurrentLocation()"
              append-inner-icon="icon-geo-locate"
            >
              <!-- <v-icon
                slot="append"
                :color="zipcode === 'Current Location' && !$vuetify?.theme.dark ? 'primary' : ''"
                @click="getCurrentLocation()"
              >
                my_location
              </v-icon> -->
            </v-text-field>
          </v-col>
          <v-col xl1 lg2 md2 sm3 xs7 :class="$vuetify?.breakpoint?.smAndUp ? 'ml-3' : ''">
            <v-select
              v-model="searchRadius"
              variant="outlined"
              append-icon="icon-chevron-down"
              :menu-props="{ zIndex: '1' }"
              :items="radiusList"
              clearable
              label="Radius"
            />
          </v-col>
          <v-col xl2 lg2 md2 sm2 :class="$vuetify?.breakpoint?.mdAndUp ? 'ml-3 pb-2' : 'ml-3 pb-3'">
            <v-btn
              :color="$vuetify?.theme.dark ? '' : 'accent'"
              :disabled="searchLoading"
              :loading="searchLoading"
              :class="$vuetify?.breakpoint?.smAndUp ? 'mt-3' : 'mt-3 ml-3'"
              @click="checkCurrentLocation('search')"
            >
              Search
              <template #searchLoading>
                <span class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col style="background: rgba(0, 0, 0, 0.06)" mb-4 xs12>
        <MarketInsightsFilter ref="quickFilter" class="pa-2" @call-apply-filter="callApplyFilter" />
        <v-col v-if="marketInsightFilterChips.length > 0" pt-2 ml-4 class="filterChips">
          Filters
          <span class="bg-red text-white ml-1 mr-2 filter_count">{{ marketInsightFilterChips.length }}</span>
          |
          <template v-for="(item, index) in marketInsightFilterChips" :key="index">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-chip
                  closable
                  class="elevation-0 mr-2 mb-1"
                  :class="$vuetify?.theme.dark ? '' : 'text-black'"
                  v-bind="props"
                  color="#00000017"
                  size="small"
                  @click:close="removeMarketInsightQuickFilter(item.text, item.title, item.from)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </template>
          <v-btn
            v-if="!$vuetify?.breakpoint?.xs"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            variant="text"
            size="small"
            class="text-capitalize"
            @click="clearMarketInsightFilter()"
          >
            <v-icon size="small"> close </v-icon>Clear Filter
          </v-btn>
        </v-col>
      </v-col>
      <v-col pb-2>
        <v-row class="align-center justify-space-between fill-height">
          <v-col xs4 :class="$vuetify?.breakpoint?.xs ? 'pr-2' : 'pr-4'">
            <v-card height="120px" class="elevation-6 pa-4">
              <v-col v-if="isTotalAssetLoading" xs12 class="text-center align-self">
                <v-progress-circular indeterminate :size="$vuetify?.breakpoint?.xs ? 60 : 80" :width="5" color="accent" />
              </v-col>
              <v-col v-else>
                <h4 v-if="$vuetify?.breakpoint?.xs" class="text-center pb-2">
                  <b>Total Assets</b>
                </h4>
                <h3 v-else class="text-center pb-2">
                  <b>Total Assets</b>
                </h3>
                <v-col class="text-center" :class="$vuetify?.breakpoint?.xs ? 'headline' : 'display-1'">
                  numberFormat(totalAsset) }}
                </v-col>
              </v-col>
            </v-card>
          </v-col>
          <v-col xs4 :class="$vuetify?.breakpoint?.xs ? 'pl-1 pr-1' : 'pl-3 pr-3'">
            <v-card height="120px" class="elevation-6 pa-4">
              <v-col v-if="isTotalPlanLoading" xs12 class="text-center align-self">
                <v-progress-circular indeterminate :size="$vuetify?.breakpoint?.xs ? 60 : 80" :width="5" color="accent" />
              </v-col>
              <v-col v-else>
                <h4 v-if="$vuetify?.breakpoint?.xs" class="text-center pb-2">
                  <b>Total Plans</b>
                </h4>
                <h3 v-else class="text-center pb-2">
                  <b>Total Plans</b>
                </h3>
                <v-col class="text-center" :class="$vuetify?.breakpoint?.xs ? 'headline' : 'display-1'">
                  new Intl.NumberFormat().format(totalPlans) }}
                </v-col>
              </v-col>
            </v-card>
          </v-col>
          <v-col xs4 :class="$vuetify?.breakpoint?.xs ? 'pl-1' : 'pl-4'">
            <v-card height="120px" class="elevation-6 pa-4">
              <v-col v-if="isTotalParticipantLoading" xs12 class="text-center align-self">
                <v-progress-circular indeterminate :size="$vuetify?.breakpoint?.xs ? 60 : 80" :width="5" color="accent" />
              </v-col>
              <v-col v-else>
                <h4 v-if="$vuetify?.breakpoint?.xs" class="text-center pb-2">
                  <b>Total Participants</b>
                </h4>
                <h3 v-else class="text-center pb-2">
                  <b>Total Participants</b>
                </h3>
                <v-col class="text-center" :class="$vuetify?.breakpoint?.xs ? 'headline' : 'display-1'">
                  new Intl.NumberFormat().format(totalParticipant) }}
                </v-col>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col xs12 mt-3 pb-4>
        <v-row>
          <v-col xs12 sm6 :class="$vuetify?.breakpoint?.xs ? '' : 'pr-3'">
            <v-card
              class="elevation-6"
              :height="$vuetify?.breakpoint?.width < 1600 && $vuetify?.breakpoint?.width > 1250 && menuOpened ? '450' : '400'"
            >
              <v-col v-if="lowReturnLoader" xs12 class="text-center align-self" mt-1>
                <v-progress-linear indeterminate color="accent" height="4" class="ma-0" />
              </v-col>
              <h3
                v-if="($vuetify?.breakpoint?.width > 600 && $vuetify?.breakpoint?.width < 700) || $vuetify?.breakpoint?.mdOnly"
                class="mb-1 font-weight-medium pl-3 pr-3 pt-3"
              >
                Plans with Low Returns
              </h3>
              <h2 v-else class="mb-1 font-weight-medium pl-3 pr-3 pt-3">Plans with Low Returns</h2>
              <v-col xs12>
                <LowReturnPlan
                  :key="componentKey"
                  :menu-opened="menuOpened"
                  :low-return-loader="lowReturnLoader"
                  @loader="lowReturnShowLoader"
                  @show-lowest-return="showLowestReturn"
                />
              </v-col>
            </v-card>
          </v-col>
          <v-col xs12 sm6 :class="$vuetify?.breakpoint?.xs ? 'pt-3' : ''">
            <v-card
              class="elevation-6"
              :height="$vuetify?.breakpoint?.width < 1600 && $vuetify?.breakpoint?.width > 1250 && menuOpened ? '450' : '400'"
            >
              <v-col v-if="benchmarkLoader" xs12 class="text-center align-self" mt-1>
                <v-progress-linear indeterminate color="accent" height="4" class="ma-0" />
              </v-col>
              <h3
                v-if="($vuetify?.breakpoint?.width > 600 && $vuetify?.breakpoint?.width < 700) || $vuetify?.breakpoint?.mdOnly"
                class="mb-1 font-weight-medium pl-3 pr-3 pt-3"
              >
                Plans with Fees Above Benchmark
              </h3>
              <h2 v-else class="mb-1 font-weight-medium pl-3 pr-3 pt-3">Plans with Fees Above Benchmark</h2>
              <v-col xs12>
                <Benchmark
                  :key="componentKey"
                  :menu-opened="menuOpened"
                  :benchmark-loader="benchmarkLoader"
                  @show-benchmark-plans="showBenchmarkPlans"
                  @vs-peer-group="vsPeerGroup"
                  @vs-industry-group="vsIndustryGroup"
                  @loader="benchmarkShowLoader"
                />
              </v-col>
            </v-card>
          </v-col>
          <v-col xs12 sm6 :class="$vuetify?.breakpoint?.xs ? 'pt-3' : 'pr-3 pt-3'">
            <v-card
              class="elevation-6"
              :height="$vuetify?.breakpoint?.width < 1600 && $vuetify?.breakpoint?.width > 1250 && menuOpened ? '450' : '400'"
            >
              <v-col v-if="participationLoader" xs12 class="text-center align-self" mt-1>
                <v-progress-linear indeterminate color="accent" height="4" class="ma-0" />
              </v-col>
              <h3
                v-if="($vuetify?.breakpoint?.width > 600 && $vuetify?.breakpoint?.width < 700) || $vuetify?.breakpoint?.mdOnly"
                class="mb-1 font-weight-medium pl-3 pr-3 pt-3"
              >
                Plans with Low Participation Rates
              </h3>
              <h2 v-else class="mb-1 font-weight-medium pl-3 pr-3 pt-3">Plans with Low Participation Rates</h2>
              <v-col xs12>
                <PlanWithLowParticipantRate
                  :key="componentKey"
                  :menu-opened="menuOpened"
                  :participation-loader="participationLoader"
                  @show-lowest-participation-plans="showLowestParticipationPlans"
                  @loader="participationShowLoader"
                />
              </v-col>
            </v-card>
          </v-col>
          <v-col xs12 sm6 pt-3>
            <v-card
              :height="$vuetify?.breakpoint?.width < 1600 && $vuetify?.breakpoint?.width > 1250 && menuOpened ? '450' : '400'"
              class="elevation-6"
            >
              <v-col v-if="prospectLoader" xs12 class="text-center align-self" mt-1>
                <v-progress-linear indeterminate color="accent" height="4" class="ma-0" />
              </v-col>
              <h3
                v-if="($vuetify?.breakpoint?.width > 600 && $vuetify?.breakpoint?.width < 700) || $vuetify?.breakpoint?.mdOnly"
                class="mb-1 font-weight-medium pl-3 pr-3 pt-3"
              >
                Plans with Compliance Issues
              </h3>
              <h2 v-else class="mb-1 font-weight-medium pl-3 pr-3 pt-3">Plans with Compliance Issues</h2>
              <v-col xs12>
                <ProspectPlanCompliance
                  :key="componentKey"
                  :menu-opened="menuOpened"
                  :prospect-loader="prospectLoader"
                  @show-prospect-plan-compliance="showProspectPlanCompliance"
                  @loader="prospectShowLoader"
                />
              </v-col>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog v-model="boolDialog" persistent scrollable max-width="997px">
          <ProspectResultAddColumns
            :key="componentKeyResult"
            :vspeer-group="vspeerGroup"
            :vsindustry-group="vsindustryGroup"
            :PlanResult="PlanResult"
            :WidgetName="WidgetName"
            :selected-group="selectedGroup"
            :selected-plan="selectedPlan"
            @close-plan-dialog="closePlanDialog"
          />
        </v-dialog>
      </v-col>
    </v-col>
  </v-container>
</template>

<script>
import ProspectPlanCompliance from '@/components/TAL/Finder/MarketInsights/ProspectPlanCompliance'
import LowReturnPlan from '@/components/TAL/Finder/MarketInsights/LowReturnPlan'
import PlanWithLowParticipantRate from '@/components/TAL/Finder/MarketInsights/PlanWithLowParticipantRate'
import Benchmark from '@/components/TAL/Finder/MarketInsights/Benchmark'
import ProspectResultAddColumns from '@/components/TAL/Finder/MarketInsights/ProspectResultAddColumns'
import MarketInsightsFilter from '@/components/TAL/Finder/MarketInsights/MarketInsightsFilter'
import { eventBus } from '@/main'
import planfinderlist from '@/assets/planfinder.json'
export default {
  components: {
    LowReturnPlan,
    ProspectPlanCompliance,
    PlanWithLowParticipantRate,
    Benchmark,
    ProspectResultAddColumns,
    MarketInsightsFilter
  },
  props: ['searchResult', 'menuOpened'],
  data() {
    return {
      componentKey: 0,
      componentKeyResult: 0,
      boolDialog: false,
      selected: [],
      PlanResult: [],
      WidgetName: '',
      dialog: false,
      pagination: {
        sortBy: '',
        rowsPerPage: 10,
        rowsPerPageItems: [10, 50, 100]
      },
      headers: [
        {
          text: 'Plan Name',
          value: 'PNAME',
          width: '25%'
        },
        { text: 'Total Plan Assets', value: 'TOTASSETS', width: '10%' },
        { text: 'Active Participants', value: 'ACTPARTIC', width: '10%' },
        { text: 'Plan Return', value: 'ACTPARTIC', width: '10%' },
        { text: 'Avg Participant Contr.', value: 'CONTRPART', width: '10%' },
        { text: 'Assets Growth', value: 'GROWTH', width: '10%' },
        { text: 'Action', value: '', width: this.menuOpened ? '20%' : '15%' }
      ],
      lowReturnLoader: true,
      benchmarkLoader: true,
      participationLoader: true,
      prospectLoader: true,
      totalParticipant: 0,
      totalAsset: 0,
      isTotalParticipantLoading: false,
      isTotalAssetLoading: false,
      selectedGroup: 'vs.Peer Group',
      selectedPlan: 1,
      vsindustryGroup: 0,
      vspeerGroup: 0,
      radiusList: [
        { text: '5 Miles', value: 5 },
        {
          text: '10 Miles',
          value: 10
        },
        {
          text: '25 Miles',
          value: 25
        }
      ],
      isTotalPlanLoading: false,
      zipcodeError: false,
      totalPlans: 0,
      zipcodeErrorMsg: '',
      zipcode: 'Current Location',
      searchRadius: 0,
      searchLoading: false,
      planSearchRequest: {},
      employedSponsorTab: 0,
      marketInsightFilterChips: [],
      quickFilter: false,
      clearValue: planfinderlist.clearValue,
      showOption: false,
      selectreports: [],
      planReportList: [
        {
          text: 'Exp Diagnostic',
          icon: 'Exp Diagnostic',
          id: 1,
          val: 'Express Diagnostic'
        },
        {
          text: 'Diagnostic',
          icon: 'Diagnosticsmall',
          id: 2,
          val: 'Diagnostic'
        },
        { text: 'Comparison', icon: 'Comparison', id: 3, val: 'RPEA' },
        { text: 'Proposal', icon: 'Proposalsmall', id: 4, val: 'Proposal' }
      ]
    }
  },
  watch: {
    planReportList: {
      handler() {
        if (!this.$authz.hasPermission(this.$authz.permissionSet.Express_Diagnostic__c, this.$authz.permission.Full)) {
          var showExpressDiagnostic = this.planReportList.findIndex((a) => a.val === 'Express Diagnostic')
          if (showExpressDiagnostic > -1) this.planReportList.splice(showExpressDiagnostic, 1)
        }
        if (this.$authz.hasPermission(this.$authz.permissionSet.Diagnostic__c, this.$authz.permission.None)) {
          var showDiagnostic = this.planReportList.findIndex((a) => a.val === 'Diagnostic')
          if (showDiagnostic > -1) this.planReportList.splice(showDiagnostic, 1)
        }
        if (this.$authz.hasPermission(this.$authz.permissionSet.Comparison__c, this.$authz.permission.None)) {
          var showComparison = this.planReportList.findIndex((a) => a.val === 'RPEA')
          if (showComparison > -1) this.planReportList.splice(showComparison, 1)
        }
        if (this.$authz.hasPermission(this.$authz.permissionSet.Proposal__c, this.$authz.permission.None)) {
          var showProposal = this.planReportList.findIndex((a) => a.val === 'Proposal')
          if (showProposal > -1) this.planReportList.splice(showProposal, 1)
        }
        this.selectreports = this.planReportList
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.marketInsight).length > 0) {
      this.zipcode = this.$store.state.marketInsight.zipcode
      this.searchRadius = this.$store.state.marketInsight.searchRadius
      var data = this.$store.state.marketInsight.plandata
      if (this.$store.state.marketInsight.dialogName === 'lowReturn') this.showLowestReturn(data)
      if (this.$store.state.marketInsight.dialogName === 'participationRates') this.showLowestParticipationPlans(data)
      if (this.$store.state.marketInsight.dialogName === 'benchmark') this.showBenchmarkPlans(data)
      if (this.$store.state.marketInsight.dialogName === 'compliance') this.showProspectPlanCompliance(data)
      if (!this.vspeerGroup) this.vspeerGroup = this.$store.state.marketInsight.peerGroup
      if (!this.vsindustryGroup) this.vsindustryGroup = this.$store.state.marketInsight.industryGroup
      if (this.$store.state.marketInsight.marketInsightChip) {
        var marketInsightFilter = this.$store.state.marketInsight.marketInsightChip
        this.$refs.quickFilter.industry = marketInsightFilter.industry
        var assetSelection = marketInsightFilter.asset.filter((a) => a.type === 'asset')
        var assetCustom = marketInsightFilter.asset.filter((a) => a.type === 'custom')

        if (assetSelection.length > 0) {
          var assetValue = marketInsightFilter.asset.map((a) => a.text)
          this.$refs.quickFilter.filterButton[2].assetsList.forEach((a) => (a.model = false))

          for (var b = 0; b < assetValue.length; b++) {
            var assetPosition = this.$refs.quickFilter.filterButton[2].assetsList.findIndex((a) => a.text === assetValue[b])
            if (assetPosition > -1) {
              this.$refs.quickFilter.filterButton[2].assetsList[assetPosition].model = true
            }
          }

          this.$refs.quickFilter.minAssets = ''
          this.$refs.quickFilter.maxAssets = ''
        } else if (assetCustom.length > 0) {
          this.$refs.quickFilter.filterButton[2].assetsList.forEach((a) => (a.model = false))
          this.$refs.quickFilter.minAssets = assetCustom[0].item1 ? assetCustom[0].item1 : ''
          this.$refs.quickFilter.maxAssets = assetCustom[0].item2 ? assetCustom[0].item2 : ''
        } else {
          this.$refs.quickFilter.filterButton[2].assetsList.forEach((a) => {
            a.model = false
          })
          this.$refs.quickFilter.minAssets = ''
          this.$refs.quickFilter.maxAssets = ''
        }
        if (marketInsightFilter.planTypeId.length > 0) {
          this.$refs.quickFilter.filterButton[1].selectPlanType.forEach((a) => (a.model = false))

          for (var i = 0; i < marketInsightFilter.planTypeId.length; i++) {
            var planTypePosition = this.$refs.quickFilter.filterButton[1].selectPlanType.findIndex(
              (a) => a.id === marketInsightFilter.planTypeId[i]
            )
            if (planTypePosition > -1) {
              this.$refs.quickFilter.filterButton[1].selectPlanType[planTypePosition].selected = true
            }
          }
        }
      }
      this.applyFilter()
      this.getFilterChips()
    } else {
      if (this.zipcode && this.zipcode !== 'Current Location') {
        this.applyFilter()
      } else if (!this.zipcode || this.zipcode === 'Current Location') {
        this.$store.dispatch('getUser').then(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getZipcode, this.showCurrentError)
          }
        })
      }
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
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
    showProspectPlanCompliance(ProspectPlanCompliance) {
      this.PlanResult = ProspectPlanCompliance
      if (this.PlanResult && this.PlanResult.length > 0) {
        let proposalReport = this.selectreports.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        this.PlanResult.map((element) => {
          if (
            element.DCPTYPE === this.$authz.planType.Defined_Contribution_Plan ||
            element.DCPTYPE === this.$authz.planType.ERISA_403_b
          ) {
            element['selectreport'] = this.selectreports && this.selectreports.length > 0 ? this.selectreports : []
          } else {
            element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
          }
        })
      }
      this.WidgetName = 'compliance'
      this.componentKeyResult += 1
      this.boolDialog = true
    },
    showBenchmarkPlans(BenchmarkPlans) {
      this.PlanResult = BenchmarkPlans
      if (this.PlanResult && this.PlanResult.length > 0) {
        let proposalReport = this.selectreports.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        this.PlanResult.map((element) => {
          if (
            element.DCPTYPE === this.$authz.planType.Defined_Contribution_Plan ||
            element.DCPTYPE === this.$authz.planType.ERISA_403_b
          ) {
            element['selectreport'] = this.selectreports && this.selectreports.length > 0 ? this.selectreports : []
          } else {
            element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
          }
        })
      }
      this.WidgetName = 'benchmark'
      this.componentKeyResult += 1
      this.boolDialog = true
      this.selectedGroup = this.$store.state.marketInsight.selectedGroup
        ? this.$store.state.marketInsight.selectedGroup
        : 'vs.Peer Group'
    },
    showLowestReturn(LowestreturnPlans) {
      this.PlanResult = LowestreturnPlans
      if (Object.keys(this.PlanResult).length) {
        let proposalReport = this.selectreports.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        if (this.PlanResult.marketInsightsPeerGroupPlans && this.PlanResult.marketInsightsPeerGroupPlans.length > 0) {
          this.PlanResult.marketInsightsPeerGroupPlans.map((element) => {
            if (
              element.DCPTYPE === this.$authz.planType.Defined_Contribution_Plan ||
              element.DCPTYPE === this.$authz.planType.ERISA_403_b
            ) {
              element['selectreport'] = this.selectreports && this.selectreports.length > 0 ? this.selectreports : []
            } else {
              element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
            }
          })
        }
        if (this.PlanResult.marketInsightsIndustryroupPlans && this.PlanResult.marketInsightsIndustryroupPlans.length > 0) {
          this.PlanResult.marketInsightsIndustryroupPlans.map((element) => {
            if (
              element.DCPTYPE === this.$authz.planType.Defined_Contribution_Plan ||
              element.DCPTYPE === this.$authz.planType.ERISA_403_b
            ) {
              element['selectreport'] = this.selectreports && this.selectreports.length > 0 ? this.selectreports : []
            } else {
              element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
            }
          })
        }
      }
      this.WidgetName = 'lowReturn'
      this.componentKeyResult += 1
      this.boolDialog = true
      this.selectedGroup = this.$store.state.marketInsight.selectedGroup
        ? this.$store.state.marketInsight.selectedGroup
        : 'vs.Peer Group'
      this.selectedPlan = this.$store.state.marketInsight.selectedPlanoption
        ? this.$store.state.marketInsight.selectedPlanoption
        : 1
    },
    showLowestParticipationPlans(LowestParticipationPlans) {
      this.PlanResult = LowestParticipationPlans
      if (Object.keys(this.PlanResult).length) {
        let proposalReport = this.selectreports.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        if (this.PlanResult.marketInsightsPeerGroupPlans && this.PlanResult.marketInsightsPeerGroupPlans.length > 0) {
          this.PlanResult.marketInsightsPeerGroupPlans.map((element) => {
            if (
              element.DCPTYPE === this.$authz.planType.Defined_Contribution_Plan ||
              element.DCPTYPE === this.$authz.planType.ERISA_403_b
            ) {
              element['selectreport'] = this.selectreports && this.selectreports.length > 0 ? this.selectreports : []
            } else {
              element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
            }
          })
        }
        if (this.PlanResult.marketInsightsIndustryroupPlans && this.PlanResult.marketInsightsIndustryroupPlans.length > 0) {
          this.PlanResult.marketInsightsIndustryroupPlans.map((element) => {
            if (
              element.DCPTYPE === this.$authz.planType.Defined_Contribution_Plan ||
              element.DCPTYPE === this.$authz.planType.ERISA_403_b
            ) {
              element['selectreport'] = this.selectreports && this.selectreports.length > 0 ? this.selectreports : []
            } else {
              element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
            }
          })
        }
      }
      this.WidgetName = 'participationRates'
      this.componentKeyResult += 1
      this.boolDialog = true
      this.selectedGroup = this.$store.state.marketInsight.selectedGroup
        ? this.$store.state.marketInsight.selectedGroup
        : 'vs.Peer Group'
      this.selectedPlan = this.$store.state.marketInsight.selectedPlanoption
        ? this.$store.state.marketInsight.selectedPlanoption
        : 1
    },
    vsPeerGroup(vsPeerGroup) {
      this.vspeerGroup = vsPeerGroup
    },
    vsIndustryGroup(vsIndustryGroup) {
      this.vsindustryGroup = vsIndustryGroup
    },
    lowReturnShowLoader(val) {
      this.lowReturnLoader = val
    },
    benchmarkShowLoader(val) {
      this.benchmarkLoader = val
    },
    participationShowLoader(val) {
      this.participationLoader = val
    },
    prospectShowLoader(val) {
      this.prospectLoader = val
    },
    closePlanDialog() {
      this.boolDialog = false
    },
    maskAllow($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode === 8 || keyCode === 46) {
        if (this.zipcode === 'Current Location') this.zipcode = null
      }
    },
    getCurrentLocation() {
      this.zipcode = 'Current Location'
      this.checkCurrentLocation()
    },
    async checkCurrentLocation(from) {
      var that = this
      if (from === 'search') {
        if (!this.zipcode) {
          this.zipcodeError = true
          this.zipcodeErrorMsg = 'Zip code is a required field'
          return
        } else if (!this.searchRadius) {
          this.searchRadius = 0
        } else {
          this.zipcodeError = false
          this.zipcodeErrorMsg = ''
        }
      }
      if (this.zipcode && this.zipcode !== 'Current Location') {
        var isValidZip = await this.getAddress(this.zipcode)
        if (!isValidZip) return
      }
      if (this.zipcode === 'Current Location') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              that.getZipcode(position, from)
            },
            // eslint-disable-next-line no-unused-vars
            (error) => {
              that.zipcodeError = true
              that.zipcodeErrorMsg = 'Location could not be determined'
              that.loading = false
            }
          )
        }
      } else {
        this.zipcodeError = false
        this.zipcodeErrorMsg = ''
        if (from === 'search') {
          this.$store.state.lowReturnPlans = {}
          this.$store.state.planLowParticipate = {}
          this.$store.state.planProspect = {}
          this.$store.state.benchmarks = {}
          this.applyFilter()
        }
      }
    },
    clearZip() {
      this.zipcode === ''
      this.zipcodeError = false
      this.zipcodeErrorMsg = ''
      this.searchRadius = ''
    },
    getZipcode(position, from) {
      this.zipcodeError = false
      this.zipcodeErrorMsg = ''
      this.$axios
        .get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'jsonv2',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
        })
        .then((success) => {
          if (from === 'current_location') {
            this.zipcode =
              success.data && success.data.address != null && success.data.address.postcode
                ? success.data.address.postcode
                : this.$store.state.user.zipCode
          } else {
            if (Object.keys(this.$store.state.marketInsight).length > 0) {
              this.zipcode = this.$store.state.marketInsight.zipcode
                ? this.$store.state.marketInsight.zipcode
                : success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : this.$store.state.user.zipCode
            } else {
              this.zipcode =
                success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : this.$store.state.user.zipCode
            }
          }
          this.applyFilter()
        })
    },
    async getAddress(zipcode) {
      var that = this
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode}` }, (results, status) => {
          if (status === 'OK') {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.exec(that.zipcode)) {
              that.zipcodeError = false
              that.zipcodeErrorMsg = ''
              resolve(true)
            } else {
              that.zipcodeError = true
              that.zipcodeErrorMsg = 'Invalid Zip Code'
              reject(false)
            }
          } else {
            // eslint-disable-next-line no-undef
            if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
              resolve(true)
            } else {
              that.zipcodeError = true
              that.zipcodeErrorMsg = 'Invalid Zip Code'
              reject(false)
            }
          }
        })
      })
    },
    showCurrentError() {
      this.zipcode = this.$store.state.user.zipCode
      this.$store.state.marketInsight.zipcode = this.zipcode
      this.$store.state.marketInsight.searchRadius = this.searchRadius
      this.applyFilter()
    },
    callApplyFilter() {
      this.$store.state.lowReturnPlans = {}
      this.$store.state.planLowParticipate = {}
      this.$store.state.planProspect = {}
      this.$store.state.benchmarks = {}
      this.getFilterChips()
      this.applyFilter()
    },
    applyFilter() {
      this.searchLoading = true
      /*   var filterAssets = [] */
      /*   var planType = this.$refs.quickFilter.filterButton[1].selectPlanType.filter(
        a => a.model === true
      )
      var industry = this.$refs.quickFilter.industry
      filterAssets = this.$refs.quickFilter.filterButton[2].assetsList.filter(
        a => a.model === true
      )
      let item1 = this.$refs.quickFilter.minAssets
        ? parseFloat(this.$refs.quickFilter.minAssets)
        : 0
      let item2 = this.$refs.quickFilter.maxAssets
        ? parseFloat(this.$refs.quickFilter.maxAssets)
        : 0

      var asset = {}
      if (item1 >= 0 && item2 > 0 && filterAssets.length === 0) {
        asset.item1 = item1
        asset.item2 = item2
      } else if (filterAssets.length > 0) {
        asset.item1 = filterAssets[0].item1
        asset.item2 = filterAssets[0].item2
      } else asset = this.clearValue */

      var marketInsightObject = {
        PlanTypeId: null,
        Industry: null,
        Asset: this.clearValue,
        zipcode: this.zipcode,
        searchRadius: this.searchRadius,
        MaxCount: 5
      }

      ///Participant
      this.isTotalParticipantLoading = true
      this.$axios
        .post(`/api/v1/tal/plans/analyze?analysisType=AggregatedPlanParticipantsInArea`, marketInsightObject)
        .then((success) => {
          this.totalParticipant = success.data.d != null ? success.data.d : 0
          this.$store.state.marketInsight.totalParticipant = this.totalParticipant
        })
        .finally(() => {
          this.isTotalParticipantLoading = false
        })

      //Asset
      this.isTotalAssetLoading = true
      this.$axios
        .post(`/api/v1/tal/plans/analyze?analysisType=AggregatedPlanAssetsInArea`, marketInsightObject)
        .then((success) => {
          this.totalAsset = success.data.d != null ? success.data.d : 0
          this.$store.state.marketInsight.totalAsset = this.totalAsset
        })
        .finally(() => {
          this.isTotalAssetLoading = false
        })

      //PlanCount
      this.isTotalPlanLoading = true
      var planSearchRequest = {
        retrieveResultCountOnly: true,
        zipCode: this.zipcode,
        searchRadius: this.searchRadius ? this.searchRadius : 0,
        industry: null,
        planAssets: this.clearValue,
        planTypeList: null
      }

      this.$axios
        .post(`/api/v1/tal/plan/search`, planSearchRequest)
        .then((success) => {
          this.totalPlans = success.data.d != null ? success.data.d : 0
          this.$store.state.marketInsight.totalPlans = this.totalPlans
        })
        .finally(() => {
          this.isTotalPlanLoading = false
        })

      this.$store.state.marketInsight = marketInsightObject
      eventBus.$emit('loadWidget', marketInsightObject)
      this.searchLoading = false
    },
    currencyFormat(value) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    },
    getFilterChips() {
      this.marketInsightFilterChips = []
      var planTypeSelected = []
      var filterAssets = []
      this.$store.state.marketInsight.marketInsightChip = {
        planTypeId: [],
        asset: [],
        industry: null
      }

      var industryValue = this.$refs.quickFilter.industry

      if (industryValue) {
        const found = this.marketInsightFilterChips.some((el) => el.text === industryValue)
        if (!found) {
          this.marketInsightFilterChips.push({
            title: 'Industry',
            text: industryValue,
            modelName: 'industry',
            defaultValue: null
          })
          this.$store.state.marketInsight.marketInsightChip.industry = industryValue
        } else this.$store.state.marketInsight.marketInsightChip.industry = null
      } else this.$store.state.marketInsight.marketInsightChip.industry = null

      planTypeSelected = this.$refs.quickFilter.filterButton[1].selectPlanType.filter((a) => a.model === true)
      if (planTypeSelected && planTypeSelected.length > 0) {
        planTypeSelected.forEach((a) => {
          this.marketInsightFilterChips.push({
            title: 'Plan Type',
            text: a.text,
            modelName: 'planType',
            defaultValue: null
          })
        })
        this.$store.state.marketInsight.marketInsightChip.planTypeId = planTypeSelected
      } else this.$store.state.marketInsight.marketInsightChip.planTypeId = []

      filterAssets = this.$refs.quickFilter.filterButton[2].assetsList.filter((a) => a.model === true)

      let item1 = this.$refs.quickFilter.minAssets ? parseFloat(this.$refs.quickFilter.minAssets) : 0
      let item2 = this.$refs.quickFilter.maxAssets ? parseFloat(this.$refs.quickFilter.maxAssets) : 0

      if (item1 >= 0 && item2 > 0 && filterAssets.length === 0) {
        this.$refs.quickFilter.filterButton[2].assetsList.forEach((a) => (a.model = false))
        this.marketInsightFilterChips.push({
          title: 'Asset Value',
          text: `${this.currencyFormat(item1)} - ${this.currencyFormat(item2)}`,
          from: 'custom'
        })

        this.$store.state.marketInsight.marketInsightChip.asset.push({
          item1: item1,
          item2: item2,
          text: `${item1}-${item2}`,
          type: 'custom'
        })
      } else if (filterAssets.length > 0) {
        filterAssets.forEach((a) => {
          this.marketInsightFilterChips.push({
            title: 'Asset Value',
            text: a.text,
            from: 'asset'
          })
        })
        filterAssets.forEach((a) => {
          this.$store.state.marketInsight.marketInsightChip.asset.push({
            item1: a.item1,
            item2: a.item2,
            text: a.text,
            type: 'asset'
          })
        })
      } else {
        this.$refs.quickFilter.minAssets = ''
        this.$refs.quickFilter.maxAssets = ''
        this.$store.state.marketInsight.marketInsightChip.asset.push({
          item1: 0,
          item2: 0,
          text: '',
          type: ''
        })
      }
    },
    removeMarketInsightQuickFilter(text, title, from) {
      if (title === 'Asset Value') {
        if (from === 'custom') {
          this.$refs.quickFilter.minAssets = ''
          this.$refs.quickFilter.maxAssets = ''
        } else {
          this.$refs.quickFilter.filterButton[2].assetsList.forEach((a) => {
            if (a.text === text) a.model = false
          })
        }
      } else if (title === 'Industry') {
        this.$refs.quickFilter.industry = null
      } else if (title === 'Plan Type') {
        this.$refs.quickFilter.filterButton[1].selectPlanType.forEach((a) => {
          if (a.text === text) a.model = false
        })
      }
      this.callApplyFilter()
    },
    clearMarketInsightFilter() {
      this.$refs.quickFilter.filterButton[2].assetsList.forEach((a) => (a.model = false))
      this.$refs.quickFilter.minAssets = ''
      this.$refs.quickFilter.maxAssets = ''

      this.$refs.quickFilter.filterButton[1].selectPlanType.forEach((a) => (a.model = false))
      this.$refs.quickFilter.industry = null
      this.callApplyFilter()
    },
    handleScroll() {
      this.showOption = false
      this.hideAllMenu()
    },
    hideAllMenu() {
      if (this.$refs.quickFilter) {
        this.$refs.quickFilter.filterButton[0].selectButton.forEach((a) => {
          a.model = false
        })
      }
    }
  }
}
</script>
<style scoped>
.wraptext {
  white-space: pre-wrap;
}
</style>
