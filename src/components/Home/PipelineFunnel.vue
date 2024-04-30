<template>
  <v-container :class="$vuetify?.breakpoint?.lg ? 'pl-1 pr-1 pt-0 pb-0' : 'pt-1 pb-0 pr-1 pl-1'">
    <v-col v-if="type === 'companies'">
      <v-col v-if="!showPlanLoader && showEmployerSponsored" xs12>
        <v-col>
          <v-row
            class="pt-1"
            :class="[
              $vuetify?.breakpoint?.width < 1400 && $vuetify?.breakpoint?.width > 1250
                ? 'justify-end'
                : $vuetify?.breakpoint?.lgAndUp || $vuetify?.breakpoint?.md
                  ? 'justify-end widgetSwitchPosition'
                  : 'justify-end'
            ]"
          >
            <v-switch
              v-model="showWeighted"
              :color="$vuetify?.theme.dark ? '' : 'accent'"
              label="Weighted"
              class="mt-0 pt-0 pb-2"
              :class="$vuetify?.breakpoint?.xs ? 'pr-2' : ''"
              hide-details
              @update:model-value="showWeightedUnweightedData()"
            />
          </v-row>
        </v-col>
      </v-col>
      <!-- this flex is for funnel -->
      <v-col
        xs12
        :class="[
          $vuetify?.breakpoint?.width < 1400 && $vuetify?.breakpoint?.width > 1250
            ? ''
            : $vuetify?.breakpoint?.lgAndUp || $vuetify?.breakpoint?.md
              ? 'pt-9'
              : ''
        ]"
      >
        <v-row>
          <v-col v-for="item in FunnelData" :key="item.text" xs12>
            <v-row>
              <v-col v-if="item.state" xs5>
                <v-row>
                  <v-col xs7 lg7 mt-0 :class="$vuetify?.breakpoint?.smAndDown ? 'pl-2' : 'pl-3'">
                    <p :class="$vuetify?.theme.dark ? 'text-white' : ''" class="mb-0 funnel_fnt">Plans</p>
                  </v-col>
                  <v-col xs5 lg5 mt-0 class="text-left pr-1">
                    <h4 class="funnel_fnt">
                      {{ item.plans }}
                    </h4>
                  </v-col>
                  <v-col xs7 lg7 :class="$vuetify?.breakpoint?.smAndDown ? 'pl-2' : 'pl-3'">
                    <p :class="$vuetify?.theme.dark ? 'text-white' : ''" class="mb-0 funnel_fnt">Participants</p>
                  </v-col>
                  <v-col xs5 lg5 class="text-left pr-1">
                    <h4 class="funnel_fnt">
                      {{ item.participants }}
                    </h4>
                  </v-col>

                  <v-col xs7 lg7 :class="$vuetify?.breakpoint?.smAndDown ? 'pl-2' : 'pl-3'">
                    <p :class="$vuetify?.theme.dark ? 'text-white' : ''" class="mb-0 funnel_fnt">Assets</p>
                  </v-col>
                  <v-col v-if="radioRevenue === 'unweightedValue'" xs5 lg5 class="text-left pr-1">
                    <h4 class="funnel_fnt">
                      {{ currencyConvert(item.assets) }}
                    </h4>
                  </v-col>
                  <v-col v-if="radioRevenue === 'weightedValue'" xs5 lg5 class="text-left pr-1">
                    <h4 class="funnel_fnt">
                      {{ currencyConvert(item.weightedAssets) }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="!item.state" xs5>
                <v-row>
                  <v-col xs7 lg9 xl8 mt-3 :class="$vuetify?.breakpoint?.smAndDown ? 'pl-2' : 'pl-1'">
                    <p
                      class="cursor-pointer"
                      :class="$vuetify?.theme.dark ? 'text-white mb-0' : 'PipeText mb-0 pb-0'"
                      @click="viewDetailsWithStatus(item.text)"
                    >
                      {{ item.text }}
                    </p>
                  </v-col>
                  <v-col xs5 lg3 xl4 mt-3 class="text-center">
                    <h4>
                      <b>{{ item.planCount }}</b>
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs7>
                <v-col
                  class="cursor-pointer"
                  :class="`pa-2 ${item.class} ${item.width} ${item.background}`"
                  @click="item.state = !item.state"
                >
                  <v-col v-if="radioRevenue === 'weightedValue'">
                    <v-col xs12>
                      {{ item.weightedPercent }}
                    </v-col>
                    <v-col xs12>
                      {{ currencyConvert(item.weightedAmt) }}
                    </v-col>
                  </v-col>
                  <v-col v-else class="mb-0">
                    {{ currencyConvert(item.unWeightedAmt) }}
                  </v-col>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="totalPlansCount > 0" pl-1 pt-2>
        <v-row>
          <v-col xs5 class="font-weight-medium"> Projected Pipeline AUM: </v-col>
          <v-col v-if="radioRevenue === 'weightedValue'" class="font-weight-medium">
            currencyConvert(totalWeightedAmt ? totalWeightedAmt : 0) }}
          </v-col>
          <v-col v-else class="font-weight-medium">
            {{ currencyConvert(totalUnWeightedAmt ? totalUnWeightedAmt : 0) }}
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else pl-1 pt-2>
        <v-col xs12 class="font-weight-medium"> There are no prospects in the pipeline yet </v-col>
      </v-col>
      <v-col xs12 :class="$vuetify?.breakpoint?.smAndUp ? ' widgetButtonPosition' : 'pt-2'">
        <v-col text-right>
          <v-btn
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            :disabled="!displayFunnelDetails"
            :class="$vuetify?.breakpoint?.xs ? 'mb-0 mr-0' : ''"
            @click="viewDetails('plans')"
          >
            View Details
          </v-btn>
        </v-col>
      </v-col>
    </v-col>
    <v-col v-if="type === 'Individual'">
      <v-col v-if="!showLoader" xs12 mt-3 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2 pr-2'">
        <v-card class="elevation-0 progressbackground theme--light">
          <v-layout class="c_position">
            <hr class="c_hr" />
            <v-col xs6 class="c_flex">
              <h3 :class="$vuetify?.theme.dark ? '' : 'text-accent'" class="font-weight-bold">School District</h3>
              <h2 class="mb-0 font-weight-bold">
                {{ formatNumber(myProspectIndividual.SchoolDistrict ? myProspectIndividual.SchoolDistrict : 0, 'decimal', 0) }}
              </h2>
            </v-col>
            <v-col xs6 class="c_flex">
              <h3 :class="$vuetify?.theme.dark ? '' : 'text-accent'" class="font-weight-bold">
                Est. Total
                <br />Transfer Assets
              </h3>
              <h2 class="mb-0 font-weight-bold">
                {{
                  formatNumber(
                    myProspectIndividual.EstTotalTransferAssets ? myProspectIndividual.EstTotalTransferAssets : 0,
                    'currency',
                    0
                  )
                }}
              </h2>
            </v-col>
          </v-layout>
        </v-card>
        <v-row class="c_flex_layout c_position mt-4">
          <v-col xl6 lg6 md6 sm6 xs12>
            <v-col v-if="myProspectIndividual.Prospects > 0" xs12>
              <PipelineIndividualDonut
                :key="componentKey"
                :live-width="liveWidth"
                :pipeline-values="myProspectIndividualFilteredList"
                :total-plan="myProspectIndividual.Prospects ? myProspectIndividual.Prospects : 0"
              />
            </v-col>
            <v-col v-else xs12>
              <NoDataWidget
                :live-width="liveWidth"
                :total-plan="myProspectIndividual.Prospects ? myProspectIndividual.Prospects : 0"
                :display-text="'Prospects'"
                :percent-value-required="0"
                :type="typeDetails"
              />
            </v-col>
          </v-col>
          <v-col xl6 lg6 md6 sm6 xs12>
            <v-col xs12 class="fill-height">
              <PipelineIndividualDonutLegend
                :key="componentKey"
                class="fill-height"
                :live-width="liveWidth"
                :pipeline-values="myProspectIndividualFilteredList"
                :total-plan="myProspectIndividual.Prospects ? myProspectIndividual.Prospects : 0"
              />
            </v-col>
          </v-col>
        </v-row>
        <v-col
          xs12
          mt-1
          :class="[
            $vuetify?.breakpoint?.lgOnly ? 'pt-3' : '',
            $vuetify?.breakpoint?.smOnly ? 'pt-4' : '',
            $vuetify?.breakpoint?.mdOnly ? 'pt-3' : ''
          ]"
        >
          <v-col text-right :class="$vuetify?.breakpoint?.smAndUp ? ' widgetButtonPosition' : 'pt-2'">
            <v-btn
              :class="$vuetify?.breakpoint?.xs ? 'mb-0 mr-0' : ''"
              :disabled="myProspectIndividual.Prospects === 0"
              :color="$vuetify?.theme.dark ? '' : 'accent'"
              @click="viewDetails('individual')"
            >
              View Details
            </v-btn>
          </v-col>
        </v-col>
      </v-col>
    </v-col>
  </v-container>
</template>
<script>
import qs from 'qs'
import { eventBus } from '@/main'
import PipelineIndividualDonut from '@/components/Home/PipelineIndividualDonut'
import PipelineIndividualDonutLegend from '@/components/Home/PipelineIndividualDonutLegend'
import NoDataWidget from '@/components/Home/NoDataWidget'

export default {
  components: {
    PipelineIndividualDonut,
    PipelineIndividualDonutLegend,
    NoDataWidget
  },
  props: ['type', 'liveWidth'],
  data() {
    return {
      componentKey: 0,
      FunnelData: [
        {
          text: 'Diagnostic',
          plans: 0,
          participants: 0,
          assets: 0,
          class: 'funnelAll',
          background: 'diagnosticBackground',
          width: 'xs12',
          planCount: 0,
          state: false,
          weightedAmt: 0,
          weightedPercent: '10%',
          unWeightedAmt: 0,
          weightedAssets: 0
        },
        {
          text: 'Comparison',
          plans: 0,
          participants: 0,
          assets: 0,
          class: 'funnelAll',
          background: 'comparisonBackground',
          width: 'xs10',
          planCount: 0,
          state: false,
          weightedAmt: 0,
          weightedPercent: '30%',
          unWeightedAmt: 0,
          weightedAssets: 0
        },
        {
          text: 'Proposal',
          plans: 0,
          participants: 0,
          assets: 0,
          class: 'funnelAll',
          background: 'proposalBackground',
          width: 'xs8',
          planCount: 0,
          state: false,
          weightedAmt: 0,
          weightedPercent: '50%',
          unWeightedAmt: 0,
          weightedAssets: 0
        },
        {
          text: 'Agrmt. Sent',
          plans: 0,
          participants: 0,
          assets: 0,
          class: 'funnelAll',
          background: 'agrntsentBackground',
          width: 'xs6',
          planCount: 0,
          state: false,
          weightedAmt: 0,
          weightedPercent: '75%',
          unWeightedAmt: 0,
          weightedAssets: 0
        },
        {
          text: 'Agrmt. Received',
          plans: 0,
          participants: 0,
          assets: 0,
          class: 'funnelAll',
          background: 'agrmntrcvdBackground',
          width: 'xs4',
          planCount: 0,
          state: false,
          weightedAmt: 0,
          weightedPercent: '100%',
          unWeightedAmt: 0,
          weightedAssets: 0
        }
      ],
      myProspectIndividual: [],
      myProspectIndividualFilteredList: [],
      tabName: 'Plans',
      menu: false,
      searchLoading: false,
      showLoader: false,
      showPlanLoader: false,
      plancount: 0,
      toggleWidget: [0, 1],
      iconClicked: 0,
      pipelineValues: {},
      radioRevenue: 'weightedValue',
      comingSoonImage: require('@/assets/images/win.svg'),
      displayFunnelDetails: false,
      showWeighted: true,
      totalWeightedAmt: 0,
      totalUnWeightedAmt: 0,
      totalPlansCount: 0,
      totalIndividualCount: 0,
      typeDetails: 'Others'
    }
  },
  computed: {
    showIndividual() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          )
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          (this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Individuals
            )) ||
          (this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Municipalities
            )) ||
          (this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Schools
            ))
        )
      } else return true
    },
    showEmployerSponsored() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    }
  },
  beforeUnmount() {
    eventBus.off('filterGlobalData')
  },
  mounted() {
    this.toggleWidget = 0
    if (this.showEmployerSponsored) this.getDetails('reload')
    if (this.showIndividual) this.getProspectIndivualData('reload')
    // eslint-disable-next-line no-unused-vars
    eventBus.on('filterGlobalData', (data) => {
      if (this.showIndividual) this.getProspectIndivualData('reload')
      if (this.showEmployerSponsored) this.getDetails('reload')
    })
  },
  methods: {
    viewDetails(type) {
      if (type === 'plans') this.$router.push('/TAL/Plans').catch(() => {})
      else
        this.$router
          .push({
            name: 'TALProspectPlans',
            query: { Individuals: 'individuals' }
          })
          .catch(() => {})
    },
    viewDetailsWithStatus(statusType) {
      this.$router
        .push({
          name: 'TALProspectPlans',
          query: { statusType: statusType }
        })
        .catch(() => {})
    },
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
    },
    getDetails(val) {
      this.showPlanLoader = val === 'reload' ? true : false
      eventBus.$emit('loader', this.showPlanLoader)
      var accountId = []
      var contactId = []
      if (Object.keys(this.$store.state.globalFilter).length > 0) {
        if (this.$store.state.globalFilter.firm && this.$store.state.globalFilter.firm.length > 0) {
          accountId = this.$store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if (this.$store.state.globalFilter.advisor && this.$store.state.globalFilter.advisor.length > 0) {
          contactId = this.$store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      this.$axios
        .get(`/api/v1/advisor/prospects`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          if (success.data.d != null && success.data.d.length > 0) {
            this.FunnelData[0].weightedPercent = success.data.d[0].WeightedPercentage + '%'
            this.FunnelData[1].weightedPercent = success.data.d[1].WeightedPercentage + '%'
            this.FunnelData[2].weightedPercent = success.data.d[2].WeightedPercentage + '%'
            this.FunnelData[3].weightedPercent = success.data.d[3].WeightedPercentage + '%'
            this.FunnelData[4].weightedPercent = success.data.d[4].WeightedPercentage + '%'
            this.FunnelData[0].assets = success.data.d[0].Assets
            this.FunnelData[1].assets = success.data.d[1].Assets
            this.FunnelData[2].assets = success.data.d[2].Assets
            this.FunnelData[3].assets = success.data.d[3].Assets
            this.FunnelData[4].assets = success.data.d[4].Assets
            this.FunnelData[0].plans = success.data.d[0].Plans
            this.FunnelData[1].plans = success.data.d[1].Plans
            this.FunnelData[2].plans = success.data.d[2].Plans
            this.FunnelData[3].plans = success.data.d[3].Plans
            this.FunnelData[4].plans = success.data.d[4].Plans
            this.FunnelData[0].participants = success.data.d[0].Participants
            this.FunnelData[1].participants = success.data.d[1].Participants
            this.FunnelData[2].participants = success.data.d[2].Participants
            this.FunnelData[3].participants = success.data.d[3].Participants
            this.FunnelData[4].participants = success.data.d[4].Participants
            this.FunnelData[0].unWeightedAmt = success.data.d[0].ProjectedRevenue
            this.FunnelData[1].unWeightedAmt = success.data.d[1].ProjectedRevenue
            this.FunnelData[2].unWeightedAmt = success.data.d[2].ProjectedRevenue
            this.FunnelData[3].unWeightedAmt = success.data.d[3].ProjectedRevenue
            this.FunnelData[4].unWeightedAmt = success.data.d[4].ProjectedRevenue
            this.FunnelData[0].weightedAmt = success.data.d[0].WeightedProjectedRevenue
            this.FunnelData[1].weightedAmt = success.data.d[1].WeightedProjectedRevenue
            this.FunnelData[2].weightedAmt = success.data.d[2].WeightedProjectedRevenue
            this.FunnelData[3].weightedAmt = success.data.d[3].WeightedProjectedRevenue
            this.FunnelData[4].weightedAmt = success.data.d[4].WeightedProjectedRevenue
            this.FunnelData[0].planCount = success.data.d[0].Plans
            this.FunnelData[1].planCount = success.data.d[1].Plans
            this.FunnelData[2].planCount = success.data.d[2].Plans
            this.FunnelData[3].planCount = success.data.d[3].Plans
            this.FunnelData[4].planCount = success.data.d[4].Plans
            this.FunnelData[0].weightedAssets = success.data.d[0].WeightedAssets
            this.FunnelData[1].weightedAssets = success.data.d[1].WeightedAssets
            this.FunnelData[2].weightedAssets = success.data.d[2].WeightedAssets
            this.FunnelData[3].weightedAssets = success.data.d[3].WeightedAssets
            this.FunnelData[4].weightedAssets = success.data.d[4].WeightedAssets

            this.totalWeightedAmt =
              this.FunnelData[0].weightedAmt +
              this.FunnelData[1].weightedAmt +
              this.FunnelData[2].weightedAmt +
              this.FunnelData[3].weightedAmt +
              this.FunnelData[4].weightedAmt

            this.totalUnWeightedAmt =
              this.FunnelData[0].unWeightedAmt +
              this.FunnelData[1].unWeightedAmt +
              this.FunnelData[2].unWeightedAmt +
              this.FunnelData[3].unWeightedAmt +
              this.FunnelData[4].unWeightedAmt

            this.totalPlansCount =
              success.data.d[0].Plans +
              success.data.d[1].Plans +
              success.data.d[2].Plans +
              success.data.d[3].Plans +
              success.data.d[4].Plans

            if (
              this.FunnelData[0].planCount === 0 &&
              this.FunnelData[1].planCount === 0 &&
              this.FunnelData[2].planCount === 0 &&
              this.FunnelData[3].planCount === 0 &&
              this.FunnelData[4].planCount === 0
            ) {
              this.displayFunnelDetails = false
              this.showPlanLoader = false
            } else {
              this.displayFunnelDetails = true
              this.showPlanLoader = false
            }
            eventBus.$emit('loader', this.showPlanLoader)
            eventBus.$emit('totalPlansCount', this.totalPlansCount)
          }
        })
    },
    getProspectIndivualData(val) {
      this.showLoader = val === 'reload' ? true : false
      eventBus.$emit('loader', this.showLoader)
      var accountId = []
      var contactId = []
      if (Object.keys(this.$store.state.globalFilter).length > 0) {
        if (this.$store.state.globalFilter.firm && this.$store.state.globalFilter.firm.length > 0) {
          accountId = this.$store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if (this.$store.state.globalFilter.advisor && this.$store.state.globalFilter.advisor.length > 0) {
          contactId = this.$store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      this.$axios
        .get(`/api/v1/advisor/prospects`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId,
            individual: true
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          this.myProspectIndividual = success.data.d.length > 0 ? success.data.d[0] : []
          this.myProspectIndividualFilteredList = this.myProspectIndividual

          let myProspectIndividualObj = []
          for (const key in this.myProspectIndividualFilteredList) {
            const element = this.myProspectIndividualFilteredList[key]
            if (key !== 'SchoolDistrict' && key !== 'EstTotalTransferAssets' && key !== 'Prospects') {
              myProspectIndividualObj.push({ Status: key, Count: element })
            }
          }
          this.myProspectIndividualFilteredList = myProspectIndividualObj
          this.showLoader = false
          this.totalIndividualCount = this.myProspectIndividual.Prospects ? this.myProspectIndividual.Prospects : 0

          eventBus.$emit('loader', this.showLoader)
          eventBus.$emit('individualDataCount', this.totalIndividualCount)
        })
        .catch(() => {
          this.showLoader = false
          eventBus.$emit('loader', this.showLoader)
        })
    },
    trigger(value) {
      if (value === 'unweightedValue') {
        this.FunnelData.map((element) => {
          if (element.state === true) element.state = false
        })
      }
    },
    showWeightedUnweightedData() {
      this.showWeighted === true ? true : false
      if (this.showWeighted === false) {
        this.radioRevenue = 'unweightedValue'
        this.trigger(this.radioRevenue)
      } else {
        this.radioRevenue = 'weightedValue'
      }
    }
  }
}
</script>
<style scoped>
.c_flex_auto {
  flex: unset !important;
}
.c_circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.c_position {
  position: relative;
}
.c_hr {
  position: absolute;
  height: 61%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #707070;
}
.c_flex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 10px;
}

.funnelAll {
  height: 57px !important;
  border-radius: 0px 30px 30px 0px !important;
  margin-right: 10px !important;
  color: rgb(var(--v-theme-secondary)) !important;
}
.diagnosticBackground {
  background-color: rgb(var(--v-theme-accent-lighten4)) !important;
}
.comparisonBackground {
  background-color: rgb(var(--v-theme-accent-lighten3)) !important;
}
.proposalBackground {
  background-color: rgb(var(--v-theme-accent-lighten2))) !important;
}
.agrntsentBackground {
  background-color: rgb(var(--v-theme-accent-lighten1)) !important;
}
.agrmntrcvdBackground {
  background-color: rgb(var(--v-theme-accent)) !important;
}
.PipeText {
  text-align: left;
  letter-spacing: 0.01px;
  color: rgb(var(--v-theme-accent));
  opacity: 1;
}
.centered {
  position: absolute !important;
  top: 24% !important;
  left: 60% !important;
  width: 100% !important;
  transform: translate(-50%, -50%) !important;
  height: 45px !important;
}
.milesselect {
  width: 120px !important;
}

.small_font {
  font-size: 11px !important;
}
.btn_size .v-input {
  font-size: 13px !important;
}
.btn_size .v-radio {
  margin-right: 16px !important;
}

@media (max-width: 600px) {
  .c_flex_layout {
    flex-direction: column !important;
  }
}
.widgetSwitchPosition {
  right: 18px;
  top: 55px;
  position: absolute;
}
.widgetSwitchPositionForMDPI {
  right: 2px;
  top: 95px;
  position: absolute;
}
</style>
