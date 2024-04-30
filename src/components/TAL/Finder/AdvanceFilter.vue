<template>
  <v-col cols="12" xs="12">
    <v-col v-show="prospectTab === 0">
      <v-col cols="12" xs="12">
        <v-row>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="4">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Plan Type</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="planType"
                  density="compact"
                  variant="outlined"
                  :items="planTypeList"
                  item-title="PlanType"
                  item-value="DCPTYPE"
                  append-icon="icon-chevron-down"
                  clearable
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Plan Assets</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-row>
                  <v-col
                    :lg="planAssets.text === 'Custom' ? '5' : '6'"
                    :xs="planAssets.text === 'Custom' ? '6' : '12'"
                    :sm="planAssets.text === 'Custom' ? '5' : '11'"
                  >
                    <v-select
                      v-model="planAssets"
                      variant="outlined"
                      density="compact"
                      :items="assetList"
                      :return-object="true"
                      clearable
                      :menu-props="{ overflowY: true }"
                      append-icon="icon-chevron-down"
                      @click:clear="clearCustom('planasset')"
                    />
                  </v-col>
                  <v-col lg="6" xs="5" md="6">
                    <v-row>
                      <CustomMinMax
                        v-show="planAssets.text === 'Custom'"
                        field-type="currency"
                        :field-prefix="'$'"
                        :return-number-object="planAssets"
                        :reset-custom="resetCustom"
                        page-name=""
                        @return-call-function="assignNumberObject"
                      />
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Industry</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-autocomplete
                  v-model="industry"
                  :items="industries"
                  persistent-hint
                  clearable
                  hide-no-data
                  hide-details
                  :menu-props="{ overflowY: true }"
                  variant="outlined"
                  multiple
                  density="compact"
                  :append-icon="industries.length > 0 ? 'icon-chevron-down' : ''"
                  @update:model-value="getIndustriesList(), getPlanByIndustry(industry)"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <v-col v-show="prospectTab === 1">
      <v-col cols="12" xs="12">
        <v-row>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">School Type</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="schoolType"
                  density="compact"
                  variant="outlined"
                  :items="schoolTypeList"
                  item-title="SchoolType"
                  item-value="SchoolType"
                  append-icon="icon-chevron-down"
                  clearable
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium"># of Employees</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-row>
                  <v-col
                    :lg="employee.text === 'Custom' ? '5' : '6'"
                    :xs="employee.text === 'Custom' ? '6' : '12'"
                    :sm="employee.text === 'Custom' ? '5' : '11'"
                  >
                    <v-select
                      v-model="employee"
                      variant="outlined"
                      density="compact"
                      :items="employeeList"
                      :return-object="true"
                      clearable
                      :menu-props="{ overflowY: true }"
                      append-icon="icon-chevron-down"
                      @click:clear="clearCustom('employee')"
                    />
                  </v-col>
                  <v-col lg="6" xs="5" md="6">
                    <v-row>
                      <CustomMinMax
                        v-show="employee.text === 'Custom'"
                        :field-suffix="'%'"
                        :field-decimal="2"
                        :field-prefix="'$'"
                        field-type="Decimal"
                        :return-number-object="employee"
                        page-name=""
                        :reset-custom="resetCustom"
                        @return-call-function="assignNumberObject"
                      />
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">TPA</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="tpa"
                  variant="outlined"
                  density="compact"
                  :items="tpaList"
                  clearable
                  item-title="TPA"
                  item-value="TPA"
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Payroll Slot Owner</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="payrollOwner"
                  variant="outlined"
                  density="compact"
                  :items="payrollSlotNamesList"
                  clearable
                  item-title="PayrollslotName"
                  item-value="PayrollslotName"
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Payroll Slot</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="payroll"
                  variant="outlined"
                  density="compact"
                  :items="payrollList"
                  clearable
                  item-title="PayrollSlot"
                  item-value="PayrollSlot"
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <v-col v-show="prospectTab === 4">
      <v-col cols="12" xs="12">
        <v-row>
          <!-- <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
                <v-row>
                  <v-col cols="12" xs="12">
                    <h3 class="pb-2 font-weight-medium">Individual Status</h3>
                  </v-col>
                  <v-col cols="12" xs="12" sm="11">
                    <v-select
                      outlined
                      density="compact"
                      :items="individualStatusList"
                      v-model="individualStatus"
                      clearable
                      
                      :menu-props="{ overflowY: true }"
                      append-icon="icon-chevron-down"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col> -->
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Participant Age</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="participantValue"
                  variant="outlined"
                  density="compact"
                  :items="participantList"
                  clearable
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                  return-object
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Contribution Rate</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="contributionRate"
                  variant="outlined"
                  density="compact"
                  :items="contributionRateList"
                  clearable
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                  return-object
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Account Balance</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="accountBalance"
                  variant="outlined"
                  density="compact"
                  :items="accountBalanceList"
                  clearable
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                  return-object
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Employment Status</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="employmentStatus"
                  variant="outlined"
                  density="compact"
                  :items="employmentList"
                  item-title="employmentStatus"
                  item-value="employmentStatus"
                  clearable
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Equity Allocation</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="equityAllocation"
                  variant="outlined"
                  density="compact"
                  :items="allocationList"
                  clearable
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" sm="4" lg="4" xl="3">
            <v-row>
              <v-col cols="12" xs="12">
                <h3 class="pb-2 font-weight-medium">Has a Loan?</h3>
              </v-col>
              <v-col cols="12" xs="12" sm="11">
                <v-select
                  v-model="hasLoan"
                  variant="outlined"
                  density="compact"
                  :items="loanList"
                  clearable
                  :menu-props="{ overflowY: true }"
                  append-icon="icon-chevron-down"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-col>
</template>
<script>
import { ref, inject, onMounted, computed, getCurrentInstance, watch } from 'vue'
import planfinderlist from '@/assets/planfinder.json'
import CustomMinMax from '@/components/TAL/Finder/CustomMinMax'

export default {
  components: {
    CustomMinMax
  },
  props: ['prospectTab'],
  setup() {
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const $nextTick = instance.appContext.config.globalProperties.$nextTick
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const cities = ref([])
    const plan = ref('')
    const EIN = ref('')
    const zipcode1 = ref('')
    const zipcode = ref('')
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    const plancity = ref(undefined)
    const businesscode = ref(undefined)
    const businesscodeitems = ref(planfinderlist.businesscodes)
    const mostrecentplanyears = ref(undefined)
    const state = ref(undefined)
    const states = ref(planfinderlist.states)
    const stateSync = ref(null)
    const planYearSync = ref(null)
    const buisnessCodeSync = ref(null)
    const failedtotransmitparticipantcontribution = ref(false)
    const plancollectivebargain = ref(false)
    const plannotcoverfidelity = ref(false)
    const multiemployerplan = ref(false)
    const plannonexempttransaction = ref(false)
    const auditreport = ref(false)
    const planlossfrauddishonesty = ref(false)
    const contributions = ref(planfinderlist.totalcontributions)
    const contribution = ref('')
    const averageaccountbalanceitems = ref(planfinderlist.averageaccountbalance)
    const averageaccountbalance = ref('')
    const averageparticipantcontributionitems = ref(planfinderlist.averageparticipantcontribution)
    const averageparticipantcontribution = ref('')
    const averageparticipantaccountbalanceitems = ref(planfinderlist.averageparticipantaccountbalance)
    const averageparticipantaccountbalance = ref('')
    const averageemployercontributionitems = ref(planfinderlist.averageemployercontribution)
    const averageemployercontribution = ref('')
    const assetsgrowthitems = ref(planfinderlist.assetgrowth)
    const assetsgrowth = ref('')
    const utilizationitems = ref(planfinderlist.utilizationpct)
    const utilization = ref('')
    const returninvestmentitems = ref(planfinderlist.returnoninvestment)
    const returninvestment = ref('')
    const planageitems = ref(planfinderlist.planage)
    const planage = ref('')
    const participantitems = ref(planfinderlist.totalparticipants)
    const participant = ref('')
    const participationitems = ref(planfinderlist.participationpct)
    const participation = ref('')
    const correctivedistribution = ref(false)
    const sponsor = ref(false)
    const insurancecarrier = ref('')
    const serviceprovider = ref('')
    const broker = ref('')
    const feesform5500items = ref(planfinderlist.totalpctfeesperform5500)
    const feesform5500 = ref('')
    const revenueshareitems = ref(planfinderlist.revenuesharepctplanassets)
    const revenueshare = ref('')
    const commissionitems = ref(planfinderlist.commissionspcttotalassets)
    const commission = ref('')
    const indirectfeesitems = ref(planfinderlist.indirectfeespcttotalassets)
    const indirectfees = ref('')
    const natureofserviceitems = ref(planfinderlist.services)
    const natureofservice = ref(null)
    const natureofcompensationitems = ref(planfinderlist.compensations)
    const natureofcompensation = ref(null)
    const receivedindirectcomp = ref(false)
    const eligibleindirectcompinclude = ref(false)
    const compensationformulaprovided = ref(false)
    const resetCustom = ref(false)
    const clearValue = ref(planfinderlist.clearValue)
    const lastPlanSearchRequest = ref([])
    const loanplanassetsitems = ref(planfinderlist.loanspctofplanassets)
    const loanplanassets = ref('')
    const activeparticipantitems = ref(planfinderlist.activeparticipants)
    const activeparticipant = ref('')
    //set default value to filter
    const filterList = ref({
      planTypeList: {
        text: '',
        tooltip: 'Plan Type',
        modelName: 'planType',
        defaultValue: '',
        type: 'array'
      },
      planAssets: {
        text: '',
        tooltip: 'Plan Assets',
        modelName: 'planAssets',
        defaultValue: '',
        type: 'currency'
      },
      industry: {
        text: '',
        tooltip: 'Industry',
        modelName: 'industry',
        defaultValue: '',
        type: 'array'
      },
      city: {
        text: '',
        tooltip: 'City',
        modelName: 'plancity',
        defaultValue: undefined
      },
      businessCode: {
        text: '',
        tooltip: 'Buisness Code',
        modelName: 'businesscode',
        defaultValue: undefined
      },
      yearEnd: {
        text: '',
        tooltip: 'Most Recent Plan Yr Available',
        modelName: 'mostrecentplanyears',
        defaultValue: undefined
      },
      state: {
        text: '',
        tooltip: 'State',
        modelName: 'state',
        defaultValue: undefined
      },
      collectiveBargain: {
        text: 'Plan is Collectively Bargained',
        tooltip: 'Plan is Collectively Bargained',
        modelName: 'plancollectivebargain',
        defaultValue: false
      },
      multipleEmployerPlan: {
        text: 'Multiple Employer Plan',
        tooltip: 'Multiple Employer Plan',
        modelName: 'multiemployerplan',
        defaultValue: false
      },
      auditReportAttached: {
        text: 'Audit Report Attached to Form 5500',
        tooltip: 'Audit Report Attached to Form 5500',
        modelName: 'auditreport',
        defaultValue: false
      },
      failedTransmit: {
        text: 'Failed to transmit participant contributions',
        tooltip: 'Failed to transmit participant contributions',
        modelName: 'failedtotransmitparticipantcontribution',
        defaultValue: false
      },
      planNotFidelity: {
        text: 'Plan not covered by a fidelity bond',
        tooltip: 'Plan not covered by a fidelity bond',
        modelName: 'plannotcoverfidelity',
        defaultValue: false
      },
      nonExemptTransaction: {
        text: 'Plan had nonexempt transactions',
        tooltip: 'Plan had nonexempt transactions',
        modelName: 'plannonexempttransaction',
        defaultValue: false
      },
      fraudLossDishonesty: {
        text: 'Plan had loss due to fraud or dishonesty',
        tooltip: 'Plan had loss due to fraud or dishonesty',
        modelName: 'planlossfrauddishonesty',
        defaultValue: false
      },
      deemedCorrective: {
        text: 'Certain Deemed and/or Corrective Distribution',
        tooltip: 'Certain Deemed and/or Corrective Distribution',
        modelName: 'correctivedistribution',
        defaultValue: false
      },
      sponsorsMultiRetirePlan: {
        text: 'Sponsors Multiple Retirement Plans',
        tooltip: 'Sponsors Multiple Retirement Plans',
        modelName: 'sponsor',
        defaultValue: false
      },
      averageAccountBalance: {
        text: '',
        tooltip: 'Average Account Balance',
        modelName: 'averageaccountbalance',
        defaultValue: '',
        type: 'currency'
      },
      averageParticipantAccountBalance: {
        text: '',
        tooltip: 'Average Participant Account Balance',
        modelName: 'averageparticipantaccountbalance',
        defaultValue: '',
        type: 'currency'
      },
      assetGrowthPct: {
        text: '',
        tooltip: 'Assets Growth %',
        modelName: 'assetsgrowth',
        defaultValue: '',
        type: 'percent'
      },
      returnOnInvestment: {
        text: '',
        tooltip: 'Return On Investment %',
        modelName: 'returninvestment',
        defaultValue: '',
        type: 'percent'
      },
      participantCount: {
        text: '',
        tooltip: 'Total Participants',
        modelName: 'participant',
        defaultValue: '',
        type: ''
      },
      activeParticipants: {
        text: '',
        tooltip: 'Active Participant',
        modelName: 'activeparticipant',
        defaultValue: '',
        type: ''
      },
      participationPct: {
        text: '',
        tooltip: 'Participation %',
        modelName: 'participation',
        defaultValue: '',
        type: 'percent'
      },
      totalContribution: {
        text: '',
        tooltip: 'Total Contribution',
        modelName: 'contribution',
        defaultValue: '',
        type: 'currency'
      },
      averageParticipantContribution: {
        text: '',
        tooltip: 'Average Participant Contribution',
        modelName: 'averageparticipantcontribution',
        defaultValue: '',
        type: 'currency'
      },
      averageEmployerContribution: {
        text: '',
        tooltip: 'Average Employer Contribution',
        modelName: 'averageemployercontribution',
        defaultValue: '',
        type: 'currency'
      },
      utilizationPct: {
        text: '',
        tooltip: 'Utilization %',
        modelName: 'utilization',
        defaultValue: '',
        type: 'percent'
      },
      planAge: {
        text: '',
        tooltip: 'Age Of Plan',
        modelName: 'planage',
        defaultValue: '',
        type: 'year'
      },
      planLoanPct: {
        text: '',
        tooltip: 'Loan as % of Plan Assets',
        modelName: 'loanplanassets',
        defaultValue: '',
        type: 'percent'
      },
      insuranceCarrier: {
        text: '',
        tooltip: 'Insurance Carrier',
        modelName: 'insurancecarrier',
        defaultValue: ''
      },
      serviceProvider: {
        text: '',
        tooltip: 'Service Provider',
        modelName: 'serviceprovider',
        defaultValue: ''
      },
      broker: {
        text: '',
        tooltip: 'Broker',
        modelName: 'broker',
        defaultValue: ''
      },
      receivedIndirectComp: {
        text: 'Recieved Indirect Comp',
        tooltip: 'Recieved Indirect Comp',
        modelName: 'receivedindirectcomp',
        defaultValue: false
      },
      indirectCompIncluded: {
        text: 'Eligible Indirect Comp Included',
        tooltip: 'Eligible Indirect Comp Included',
        modelName: 'eligibleindirectcompinclude',
        defaultValue: false
      },
      compensationFormulaProvided: {
        text: 'Compensation Formula Provided',
        tooltip: 'Compensation Formula Provided',
        modelName: 'compensationFormulaProvided',
        defaultValue: false
      },
      totalFeesPct: {
        text: '',
        tooltip: 'Total % Fees Per Form 5500',
        modelName: 'feesform5500',
        defaultValue: '',
        type: 'percent'
      },
      revenueSharePct: {
        text: '',
        tooltip: 'Revenue share as % of Plan Assets',
        modelName: 'revenueshare',
        defaultValue: '',
        type: 'percent'
      },
      commissionCostPct: {
        text: '',
        tooltip: 'Commissions as % of Total Assets',
        modelName: 'commission',
        defaultValue: '',
        type: 'percent'
      },
      indirectFeesPct: {
        text: '',
        tooltip: 'Indirect Fees as % of Total Assets',
        modelName: 'indirectfees',
        defaultValue: '',
        type: 'percent'
      },
      serviceCode: {
        text: '',
        tooltip: 'Nature of service',
        modelName: 'natureofservice',
        defaultValue: ''
      },
      compensationCode: {
        text: '',
        tooltip: 'Nature of Compensation',
        modelName: 'natureofcompensation',
        defaultValue: ''
      },
      schoolType: {
        text: '',
        tooltip: 'School Type',
        modelName: 'schoolType',
        defaultValue: ''
      },
      employee: {
        text: '',
        tooltip: '# of Employees',
        modelName: 'employee',
        defaultValue: '',
        type: ''
      },
      tpa: {
        text: '',
        tooltip: 'TPA',
        modelName: 'tpa',
        defaultValue: ''
      },
      payroll: {
        text: '',
        tooltip: 'Payroll Slot',
        modelName: 'payroll',
        defaultValue: ''
      },
      participantValue: {
        text: '',
        tooltip: 'Participant Age',
        modelName: 'participantValue',
        defaultValue: '',
        type: ''
      },
      contributionRate: {
        text: '',
        tooltip: 'Contribution Rate',
        modelName: 'contributionRate',
        defaultValue: '',
        type: 'percent'
      },
      accountBalance: {
        text: '',
        tooltip: 'Account Balance',
        modelName: 'accountBalance',
        defaultValue: '',
        type: 'currency'
      },
      employmentStatus: {
        text: '',
        tooltip: 'Employment Status',
        modelName: 'employmentStatus',
        defaultValue: ''
      },
      planStatus: {
        text: '',
        tooltip: 'Plan Status',
        modelName: 'planStatus',
        defaultValue: ''
      },
      equityAllocation: {
        text: '',
        tooltip: 'Equity Allocation',
        modelName: 'equityAllocation',
        defaultValue: '',
        type: 'percent'
      },
      hasLoan: {
        text: '',
        tooltip: 'Has a Loan',
        modelName: 'hasLoan',
        defaultValue: ''
      },
      individualStatus: {
        text: '',
        tooltip: 'Individual Status',
        modelName: 'individualStatus',
        defaultValue: '',
        type: ''
      },
      payrollOwner: {
        text: '',
        tooltip: 'Payroll Slot Owner',
        modelName: 'payrollOwner',
        defaultValue: ''
      }
    })
    const filterChips = ref([])
    const schoolChips = ref([])
    const municipalChips = ref([])
    const churchChips = ref([])
    const taxExemptChips = ref([])
    const individualChips = ref([])
    const planAssets = ref('')
    const assetList = ref(planfinderlist.planAsset)
    const planType = ref('')
    const industry = ref('')
    const industries = ref([])
    const schoolType = ref('')
    const employeeList = ref(planfinderlist.employeeList)
    const employee = ref('')
    const tpa = ref('')
    const payroll = ref('')
    const loanList = ref([
      { text: 'Has a Loan', value: 'Has a Loan' },
      { text: 'Does not have a Loan', value: 'Does not have a Loan' }
    ])
    const hasLoan = ref('')
    const employmentStatus = ref('')
    const planStatus = ref('')
    const allocationList = ref([
      { text: '10%', value: 10 },
      { text: '20%', value: 20 },
      { text: '30%', value: 30 },
      { text: '40%', value: 40 },
      { text: '50%', value: 50 },
      { text: '60%', value: 60 },
      { text: '70%', value: 70 },
      { text: '80%', value: 80 },
      { text: '90%', value: 90 },
      { text: '100%', value: 100 }
    ])
    const equityAllocation = ref('')
    const individualStatus = ref('')
    const individualStatusList = ref([
      {
        text: 'Upcoming Eligibility (< 3 months away)',
        value: 'Upcoming Eligibility (< 3 months away)'
      },
      { text: 'Eligible Not Enrolled', value: 'Eligible Not Enrolled' },
      {
        text: 'Eligible Enrolled Not Contributing',
        value: 'Eligible Enrolled Not Contributing'
      },
      {
        text: 'Eligible Enrolled Contributing',
        value: 'Eligible Enrolled Contributing'
      },
      {
        text: 'Ineligible not making mandatory contributions',
        value: 'Ineligible not making mandatory contributions'
      },
      { text: 'Elects out of plan', value: 'Elects out of plan' },
      {
        text: 'Ineligible employment status',
        value: 'Ineligible employment status'
      },
      { text: 'Ineligible division', value: 'Ineligible division' },
      { text: 'Ineligible employee type', value: 'Ineligible employee type' },
      { text: 'Ineligible, hours', value: 'Ineligible, hours' },
      {
        text: 'Ineligible, service requirement',
        value: 'Ineligible, service requirement'
      },
      {
        text: 'Ineligible, in another plan',
        value: 'Ineligible, in another plan'
      },
      { text: 'Ineligible age', value: 'Ineligible age' }
    ])
    const participantValue = ref('')
    const participantList = ref([
      {
        item1: 0,
        item2: 19,
        text: '< 20 years old',
        type: 'participantValue'
      },
      {
        item1: 20,
        item2: 30,
        text: '20 - 30 years old',
        type: 'participantValue'
      },
      {
        item1: 30,
        item2: 40,
        text: '30 - 40 years old',
        type: 'participantValue'
      },
      {
        item1: 40,
        item2: 50,
        text: '40 - 50 years old',
        type: 'participantValue'
      },
      {
        item1: 51,
        item2: 99999,
        text: '> 50 years old',
        type: 'participantValue'
      }
    ])
    const contributionRate = ref('')
    const contributionRateList = ref([
      {
        item1: 0,
        item2: 1,
        text: '1%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 2,
        text: '2%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 3,
        text: '3%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 4,
        text: '4%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 5,
        text: '5%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 6,
        text: '6%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 7,
        text: '7%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 8,
        text: '8%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 9,
        text: '9%',
        type: 'contributionValue'
      },
      {
        item1: 0,
        item2: 10,
        text: '10%',
        type: 'contributionValue'
      },
      {
        item1: 10,
        item2: 999,
        text: '> 10%',
        type: 'contributionValue'
      }
    ])
    const accountBalance = ref('')
    const accountBalanceList = ref([
      {
        item1: 0,
        item2: 24999,
        text: '< $25,000',
        type: 'accountBalance'
      },
      {
        item1: 25000,
        item2: 50000,
        text: '$25,000 - $50,000',
        type: 'accountBalance'
      },
      {
        item1: 50000,
        item2: 100000,
        text: '$50,000 - $100,000',
        type: 'accountBalance'
      },
      {
        item1: 100000,
        item2: 200000,
        text: '$100,000 - $200,000',
        type: 'accountBalance'
      },
      {
        item1: 200000,
        item2: 500000,
        text: '$200,000 - $500,000',
        type: 'accountBalance'
      },
      {
        item1: 500000,
        item2: 1000000,
        text: '$500,000 - $1,000,000',
        type: 'accountBalance'
      },
      {
        item1: 1000000,
        item2: 3000000,
        text: '$1,000,000 - $3,000,000',
        type: 'accountBalance'
      },
      {
        item1: 3000000,
        item2: 999999999999999,
        text: '> $3,000,000',
        type: 'accountBalance'
      }
    ])
    const payrollOwner = ref('')
    const mostrecentplanyearitems = computed(() => {
      var yearList = []
      for (var i = 1; i < 6; i++) yearList.push(new Date().getFullYear() - i)
      return yearList
    })
    const showSchool = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Schools
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c, $authz.typeOfBusiness.Schools)
        )
      } else return true
    })
    const showEmployerSponsored = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    })
    const showIndividuals = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Individuals
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Individuals
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Individuals
          )
        )
      } else return true
    })
    const planTypeList = computed(() => {
      return store.state.finderPlanType
    })
    const schoolTypeList = computed(() => {
      if (Object.keys(store.state.finderSchoolFilter).length > 0) {
        return store.state.finderSchoolFilter.schoolTypeList ? store.state.finderSchoolFilter.schoolTypeList : []
      }
      return []
    })
    const tpaList = computed(() => {
      if (Object.keys(store.state.finderSchoolFilter).length > 0) {
        return store.state.finderSchoolFilter.tpaList ? store.state.finderSchoolFilter.tpaList : []
      }
      return []
    })
    const payrollList = computed(() => {
      if (Object.keys(store.state.finderSchoolFilter).length > 0) {
        return store.state.finderSchoolFilter.payrollList ? store.state.finderSchoolFilter.payrollList : []
      }
      return []
    })
    const planStatusList = computed(() => {
      return store.state.finderPlanStatus
    })
    const employmentList = computed(() => {
      return store.state.finderEmploymentStatus
    })
    const payrollSlotNamesList = computed(() => {
      if (Object.keys(store.state.finderSchoolFilter).length > 0) {
        return store.state.finderSchoolFilter.payrollSlotNamesList ? store.state.finderSchoolFilter.payrollSlotNamesList : []
      }
      return []
    })
    const getCitiesList = () => {
      $axios.get(`/api/v1/tal/plan/autocomplete/city/${event.target.value}`).then((success) => {
        cities.value = success.data.d
      })
    }
    const getIndustriesList = () => {
      $axios.get(`/api/v1/tal/plan/autocomplete/industry/${event.target.value}`).then((success) => {
        industries.value = success.data.d
      })
    }
    const assignNumberObject = (customValue) => {
      if (customValue !== null) {
        switch (customValue.type) {
          case 'planasset':
            planAssets.value = customValue
            break
          case 'contribution':
            contribution.value = customValue
            break
          case 'averageaccountbalance':
            averageaccountbalance.value = customValue
            break
          case 'averageparticipantcontribution':
            averageparticipantcontribution.value = customValue
            break
          case 'averageparticipantaccountbalance':
            averageparticipantaccountbalance.value = customValue
            break
          case 'averageemployercontribution':
            averageemployercontribution.value = customValue
            break
          case 'assetsgrowth':
            assetsgrowth.value = customValue
            break
          case 'utilization':
            utilization.value = customValue
            break
          case 'returninvestment':
            returninvestment.value = customValue
            break
          case 'planage':
            planage.value = customValue
            break
          case 'participant':
            participant.value = customValue
            break
          case 'loanplanassets':
            loanplanassets.value = customValue
            break
          case 'activeparticipant':
            activeparticipant.value = customValue
            break
          case 'participation':
            participation.value = customValue
            break
          case 'feesform5500':
            feesform5500.value = customValue
            break
          case 'revenueshare':
            revenueshare.value = customValue
            break
          case 'commission':
            commission.value = customValue
            break
          case 'indirectfees':
            indirectfees.value = customValue
            break
          case 'employee':
            employee.value = customValue
            break
        }
      }
    }
    const checkFields = (val) => {
      if (val === 'city') {
        plan.value = ''
        EIN.value = ''
        zipcode1.value = ''
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
      } else if (val === 'state') {
        plan.value = ''
        EIN.value = ''
        zipcode1.value = ''
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
      }
    }
    const resetVariables = () => {
      plan.value = undefined
      zipcode.value = ''
      EIN.value = null
      industries.value = []
      mostrecentplanyears.value = undefined
      industry.value = ''
      plancity.value = undefined
      cities.value = []
      businesscode.value = undefined
      states.value = planfinderlist.states
      state.value = undefined
      failedtotransmitparticipantcontribution.value = false
      plancollectivebargain.value = false
      plannotcoverfidelity.value = false
      multiemployerplan.value = false
      plannonexempttransaction.value = false
      auditreport.value = false
      averageaccountbalance.value = ''
      planlossfrauddishonesty.value = false
      businesscodeitems.value = planfinderlist.businesscodes
      contributions.value = planfinderlist.totalcontributions
      contribution.value = ''
      averageaccountbalanceitems.value = planfinderlist.averageaccountbalance
      averageparticipantcontributionitems.value = planfinderlist.averageparticipantcontribution
      averageparticipantcontribution.value = ''
      averageparticipantaccountbalanceitems.value = planfinderlist.averageparticipantaccountbalance
      averageparticipantaccountbalance.value = ''
      averageemployercontributionitems.value = planfinderlist.averageemployercontribution
      averageemployercontribution.value = ''
      assetsgrowthitems.value = planfinderlist.assetgrowth
      assetsgrowth.value = ''
      utilizationitems.value = planfinderlist.utilizationpct
      utilization.value = ''
      returninvestmentitems.value = planfinderlist.returnoninvestment
      returninvestment.value = ''
      planageitems.value = planfinderlist.planage
      planage.value = ''
      participantitems.value = planfinderlist.totalparticipants
      participant.value = ''
      loanplanassetsitems.value = planfinderlist.loanspctofplanassets
      loanplanassets.value = ''
      activeparticipantitems.value = planfinderlist.activeparticipants
      activeparticipant.value = ''
      participationitems.value = planfinderlist.participationpct
      participation.value = ''
      correctivedistribution.value = false
      sponsor.value = false
      insurancecarrier.value = ''
      serviceprovider.value = ''
      broker.value = ''
      feesform5500items.value = planfinderlist.totalpctfeesperform5500
      feesform5500.value = ''
      revenueshareitems.value = planfinderlist.revenuesharepctplanassets
      revenueshare.value = ''
      commissionitems.value = planfinderlist.commissionspcttotalassets
      commission.value = ''
      indirectfeesitems.value = planfinderlist.indirectfeespcttotalassets
      indirectfees.value = ''
      natureofserviceitems.value = planfinderlist.services
      natureofservice.value = ''
      natureofcompensationitems.value = planfinderlist.compensations
      natureofcompensation.value = ''
      receivedindirectcomp.value = false
      eligibleindirectcompinclude.value = false
      compensationformulaprovided.value = false
      zipcode1.value = 'Current Location'
      planAssets.value = ''
      planType.value = ''
      industries.value = []
    }
    const resetSchoolFilter = () => {
      schoolType.value = ''
      employee.value = ''
      tpa.value = ''
      payroll.value = ''
      payrollOwner.value = ''
    }
    const resetIndividualFilter = () => {
      hasLoan.value = ''
      employmentStatus.value = ''
      planStatus.value = ''
      equityAllocation.value = ''
      accountBalance.value = ''
      contributionRate.value = ''
      participantValue.value = ''
    }
    const clearCustom = (propType) => {
      $nextTick(() => {
        if (propType === 'planasset') planAssets.value = clearValue.value
        else if (propType === 'contribution') contribution.value = clearValue.value
        else if (propType === 'feesform5500') feesform5500.value = clearValue.value
        else if (propType === 'averageaccountbalance') averageaccountbalance.value = clearValue.value
        else if (propType === 'averageparticipantcontribution') averageparticipantcontribution.value = clearValue.value
        else if (propType === 'averageparticipantaccountbalance') averageparticipantaccountbalance.value = clearValue.value
        else if (propType === 'averageemployercontribution') averageemployercontribution.value = clearValue.value
        else if (propType === 'assetsgrowth') assetsgrowth.value = clearValue.value
        else if (propType === 'utilization') utilization.value = clearValue.value
        else if (propType === 'returninvestment') returninvestment.value = clearValue.value
        else if (propType === 'planage') planage.value = clearValue.value
        else if (propType === 'participant') participant.value = clearValue.value
        else if (propType === 'loanplanassets') loanplanassets.value = clearValue.value
        else if (propType === 'activeparticipant') activeparticipant.value = clearValue.value
        else if (propType === 'participation') participation.value = clearValue.value
        else if (propType === 'revenueshare') revenueshare.value = clearValue.value
        else if (propType === 'commission') commission.value = clearValue.value
        else if (propType === 'indirectfees') indirectfees.value = clearValue.value
        else if (propType === 'industry') industry.value = ''
        else if (propType === 'natureofservice') natureofservice.value = ''
        else if (propType === 'natureofcompensation') natureofcompensation.value = ''
        else if (propType === 'plancity') plancity.value = 0
        else if (propType === 'businesscode') businesscode.value = ''
        else if (propType === 'mostrecentplanyears') mostrecentplanyears.value = 0
        else if (propType === 'state') state.value = 0
        else if (propType === 'employee') employee.value = clearValue.value
        resetCustom.value = true
      })
    }
    const getFilterChips = () => {
      filterChips.value = []
      var planSearchRequest = getPlanSearchRequest()
      var customDefault = planfinderlist.clearValue
      var customClearValue = { item1: 0, item2: 0 }
      for (let [key, value] of Object.entries(planSearchRequest)) {
        //here deletes empty undefined null values
        if (!value) delete planSearchRequest[key]
        //here deletes integer if value is zero
        else if (Number.isInteger(value) && value === 0) delete planSearchRequest[key]
        //here deletes objects when default value
        else if (
          typeof value === 'object' ? Object.compare(value, customDefault) || Object.compare(value, customClearValue) : false
        ) {
          delete planSearchRequest[key]
        }
        // here pushing valid filter data
        else {
          if (typeof value === 'object') {
            var filterdObject = filterList.value[key]
            //custom check
            if (filterdObject.type === 'array') {
              if (value && value.length > 0) {
                value.forEach((el) => {
                  filterChips.value.push({
                    tooltip: filterdObject.tooltip,
                    text:
                      filterdObject.modelName === 'planType'
                        ? `${planTypeList.value.filter((a) => a.DCPTYPE === el)[0].PlanType} ${filterdObject.tooltip}`
                        : `${el} ${filterdObject.tooltip}`,
                    modelName: filterdObject.modelName,
                    defaultValue: filterdObject.defaultValue,
                    type: filterdObject.type ? filterdObject.type : ''
                  })
                })
              }
            }
            if (this[filterdObject.modelName].text === 'Custom') {
              if (filterdObject.type === 'percent')
                filterdObject.text = `${value.item1}% - ${value.item2}% ${filterdObject.tooltip}`
              else if (filterdObject.type === 'currency')
                filterdObject.text = `${currencyFormat(value.item1)} - ${currencyFormat(value.item2)} ${filterdObject.tooltip}`
              else if (filterdObject.type === 'year') {
                filterdObject.text = `${value.item1} - ${value.item2} years`
              } else filterdObject.text = `${value.item1} - ${value.item2} ${filterdObject.tooltip}`
            } else {
              filterdObject.text = `${this[filterdObject.modelName].text} ${filterdObject.tooltip}`
            }
            if (filterdObject.type !== 'array') {
              filterChips.value.push(filterdObject)
            }
          } else if (typeof value === 'boolean') {
            var filteredBool = filterList.value[key]
            filterChips.value.push(filteredBool)
          } else {
            var filteredValue = filterList.value[key]
            if (filteredValue) {
              if (key === 'businessCode') filteredValue.text = `${buisnessCodeSync.value} ${filteredValue.tooltip}`
              else filteredValue.text = `${value} ${filteredValue.tooltip}`
              filterChips.value.push(filteredValue)
            }
          }
        }
      }
      store.state.finderList.filteredList = filterChips.value
    }
    const getSchoolFilterChips = () => {
      schoolChips.value = []
      var schoolSearchRequest = getSchoolSearchRequest()
      var customDefault = planfinderlist.clearValue
      var customClearValue = { item1: 0, item2: 0 }
      for (let [key, value] of Object.entries(schoolSearchRequest)) {
        //here deletes empty undefined null values
        if (!value) delete schoolSearchRequest[key]
        //here deletes integer if value is zero
        else if (Number.isInteger(value) && value === 0) delete schoolSearchRequest[key]
        //here deletes objects when default value
        else if (
          typeof value === 'object' ? Object.compare(value, customDefault) || Object.compare(value, customClearValue) : false
        ) {
          delete schoolSearchRequest[key]
        }
        // here pushing valid filter data
        else {
          if (typeof value === 'object') {
            var schoolFilterdObject = filterList.value[key]
            //custom check
            if (schoolFilterdObject.type === 'array') {
              if (value && value.length > 0) {
                value.forEach((el) => {
                  schoolChips.value.push({
                    tooltip: schoolFilterdObject.tooltip,
                    text: `${el} ${schoolFilterdObject.tooltip}`,
                    modelName: schoolFilterdObject.modelName,
                    defaultValue: schoolFilterdObject.defaultValue,
                    type: schoolFilterdObject.type ? schoolFilterdObject.type : ''
                  })
                })
              }
            }
            if (this[schoolFilterdObject.modelName].text === 'Custom') {
              schoolFilterdObject.text = `${value.item1}-${value.item2} ${schoolFilterdObject.tooltip}`
            } else {
              schoolFilterdObject.text = `${this[schoolFilterdObject.modelName].text} ${schoolFilterdObject.tooltip}`
            }
            if (schoolFilterdObject.type !== 'array') {
              schoolChips.value.push(schoolFilterdObject)
            }
          } else {
            var schoolFilteredValue = filterList.value[key]
            if (schoolFilteredValue) {
              schoolFilteredValue.text = `${value} ${schoolFilteredValue.tooltip}`
              schoolChips.value.push(schoolFilteredValue)
            }
          }
        }
      }
      if (Object.keys(store.state.finderList).length > 0) {
        if (store.state.finderList.advanceFilter && Object.keys(store.state.finderList.advanceFilter).length > 0) {
          store.state.finderList.advanceFilter.schoolFilterChip = schoolChips.value
        } else {
          store.state.finderList.advanceFilter = {
            schoolFilterChip: schoolChips.value
          }
        }
      }
      eventBus.emit('applySchoolFilter', schoolSearchRequest)
    }
    const getPlanByIndustry = (selectedIndustry) => {
      if (selectedIndustry) {
        eventBus.emit('callApplyFilter')
      }
    }
    const getIndividualFilterChips = () => {
      individualChips.value = []
      var individualSearchRequest = getIndividualSearchRequest()
      var customDefault = planfinderlist.clearValue
      var customClearValue = { item1: 0, item2: 0 }
      for (let [key, value] of Object.entries(individualSearchRequest)) {
        //here deletes empty undefined null values
        if (!value) delete individualSearchRequest[key]
        //here deletes integer if value is zero
        else if (Number.isInteger(value) && value === 0) delete individualSearchRequest[key]
        //here deletes objects when default value
        else if (
          typeof value === 'object' ? Object.compare(value, customDefault) || Object.compare(value, customClearValue) : false
        ) {
          delete individualSearchRequest[key]
        }
        // here pushing valid filter data
        else {
          if (typeof value === 'object') {
            var individualFilterdObject = filterList.value[key]
            //custom check
            if (individualFilterdObject.type === 'array') {
              if (value && value.length > 0) {
                value.forEach((el) => {
                  individualChips.value.push({
                    tooltip: individualFilterdObject.tooltip,
                    text: `${el} ${individualFilterdObject.tooltip}`,
                    modelName: individualFilterdObject.modelName,
                    defaultValue: individualFilterdObject.defaultValue,
                    type: individualFilterdObject.type ? individualFilterdObject.type : ''
                  })
                })
              }
            } else {
              individualFilterdObject.text = `${this[individualFilterdObject.modelName].text} ${individualFilterdObject.tooltip}`
            }
            if (individualFilterdObject.type !== 'array') {
              individualChips.value.push(individualFilterdObject)
            }
          } else {
            var individualFilteredValue = filterList.value[key]
            if (individualFilteredValue) {
              individualFilteredValue.text =
                individualFilteredValue.modelName === 'hasLoan'
                  ? value
                  : individualFilteredValue.modelName === 'equityAllocation'
                    ? `<= ${value}% ${individualFilteredValue.tooltip}`
                    : `${value} ${individualFilteredValue.tooltip}`
              individualChips.value.push(individualFilteredValue)
            }
          }
        }
      }
      if (Object.keys(store.state.finderList).length > 0) {
        if (store.state.finderList.advanceFilter && Object.keys(store.state.finderList.advanceFilter).length > 0) {
          store.state.finderList.advanceFilter.individualFilterChip = individualChips.value
        } else {
          store.state.finderList.advanceFilter = {
            individualFilterChip: individualChips.value
          }
        }
      }
      eventBus.emit('applyIndividualFilter', individualSearchRequest)
    }
    const currencyFormat = (value) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    }
    const getPlanSearchRequest = (resultType) => {
      return {
        retrieveResultCountOnly: resultType,
        planTypeList: planType.value ? planType.value.split() : null,
        planAssets:
          planAssets.value !== undefined && planAssets.value !== ''
            ? {
                item1: planAssets.value.item1,
                item2: planAssets.value.item2
              }
            : clearValue.value,
        industry: industry.value === '' ? null : industry.value,
        plan: !plan.value ? null : plan.value,
        ein: EIN.value === '' ? null : EIN.value,
        zipCode1:
          zipcode1.value === '' || zipcode1.value === undefined || zipcode1.value === null ? 'Current Location' : zipcode1.value,
        zipCode: zipcode.value === '' || zipcode.value === undefined ? null : zipcode.value,
        searchRadius: 0,
        city: plancity.value === '' ? null : plancity.value,
        businessCode: businesscode.value === '' ? null : businesscode.value,
        yearEnd: parseInt(mostrecentplanyears.value !== undefined ? mostrecentplanyears.value : 0),
        state: state.value === '' ? null : state.value,
        multipleEmployerPlan: multiemployerplan.value,
        nonExemptTransaction: plannonexempttransaction.value,
        collectiveBargain: plancollectivebargain.value,
        planNotFidelity: plannotcoverfidelity.value,
        auditReportAttached: auditreport.value,
        fraudLossDishonesty: planlossfrauddishonesty.value,
        failedTransmit: failedtotransmitparticipantcontribution.value,
        totalContribution:
          contribution.value !== undefined && contribution.value !== ''
            ? {
                item1: contribution.value.item1,
                item2: contribution.value.item2
              }
            : clearValue.value,
        averageAccountBalance:
          averageaccountbalance.value !== undefined && averageaccountbalance.value !== ''
            ? {
                item1: averageaccountbalance.value.item1,
                item2: averageaccountbalance.value.item2
              }
            : clearValue.value,
        averageParticipantContribution:
          averageparticipantcontribution.value !== undefined && averageparticipantcontribution.value !== ''
            ? {
                item1: averageparticipantcontribution.value.item1,
                item2: averageparticipantcontribution.value.item2
              }
            : clearValue.value,
        averageParticipantAccountBalance:
          averageparticipantaccountbalance.value !== undefined && averageparticipantaccountbalance.value !== ''
            ? {
                item1: averageparticipantaccountbalance.value.item1,
                item2: averageparticipantaccountbalance.value.item2
              }
            : clearValue.value,
        averageEmployerContribution:
          averageemployercontribution.value !== undefined && averageemployercontribution.value !== ''
            ? {
                item1: averageemployercontribution.value.item1,
                item2: averageemployercontribution.value.item2
              }
            : clearValue.value,
        assetGrowthPct:
          assetsgrowth.value !== undefined && assetsgrowth.value !== ''
            ? {
                item1: assetsgrowth.value.item1,
                item2: assetsgrowth.value.item2
              }
            : clearValue.value,
        utilizationPct:
          utilization.value !== undefined && utilization.value !== ''
            ? {
                item1: utilization.value.item1,
                item2: utilization.value.item2
              }
            : clearValue.value,
        returnOnInvestment:
          returninvestment.value !== undefined && returninvestment.value !== ''
            ? {
                item1: returninvestment.value.item1,
                item2: returninvestment.value.item2
              }
            : clearValue.value,
        planAge:
          planage.value !== undefined && planage.value !== ''
            ? {
                item1: planage.value.item1,
                item2: planage.value.item2
              }
            : clearValue.value,
        participantCount:
          participant.value !== undefined && participant.value !== ''
            ? {
                item1: participant.value.item1,
                item2: participant.value.item2
              }
            : clearValue.value,
        planLoanPct:
          loanplanassets.value !== undefined && loanplanassets.value !== ''
            ? {
                item1: loanplanassets.value.item1,
                item2: loanplanassets.value.item2
              }
            : clearValue.value,
        activeParticipants:
          activeparticipant.value !== undefined && activeparticipant.value !== ''
            ? {
                item1: activeparticipant.value.item1,
                item2: activeparticipant.value.item2
              }
            : clearValue.value,
        participationPct:
          assetsgrowth.value !== undefined && participation.value !== ''
            ? {
                item1: participation.value.item1,
                item2: participation.value.item2
              }
            : clearValue.value,
        deemedCorrective: correctivedistribution.value,
        sponsorsMultiRetirePlan: sponsor.value,
        //Provider
        insuranceCarrier: insurancecarrier.value,
        serviceProvider: serviceprovider.value,
        broker: broker.value,
        totalFeesPct:
          feesform5500.value !== undefined && feesform5500.value !== ''
            ? {
                item1: feesform5500.value.item1,
                item2: feesform5500.value.item2
              }
            : clearValue.value,
        revenueSharePct:
          revenueshare.value !== undefined && revenueshare.value !== ''
            ? {
                item1: revenueshare.value.item1,
                item2: revenueshare.value.item2
              }
            : clearValue.value,
        commissionCostPct:
          commission.value !== undefined && commission.value !== ''
            ? {
                item1: commission.value.item1,
                item2: commission.value.item2
              }
            : clearValue.value,
        indirectFeesPct:
          indirectfees.value !== undefined && indirectfees.value !== ''
            ? {
                item1: indirectfees.value.item1,
                item2: indirectfees.value.item2
              }
            : clearValue.value,
        serviceCode:
          natureofservice.value === '' || natureofservice.value === null || natureofservice.value === undefined
            ? 0
            : natureofservice.value.text === '' || natureofservice.value.text === null || natureofservice.value.text === undefined
              ? 0
              : parseInt(natureofservice.value.value),
        compensationCode:
          natureofcompensation.value === '' || natureofcompensation.value === null || natureofcompensation.value === undefined
            ? 0
            : natureofcompensation.value.text === '' ||
                natureofcompensation.value.text === null ||
                natureofcompensation.value.text === undefined
              ? 0
              : parseInt(natureofcompensation.value.value),
        receivedIndirectComp: receivedindirectcomp.value,
        indirectCompIncluded: eligibleindirectcompinclude.value,
        compensationFormulaProvided: compensationformulaprovided.value,
        finalReport: false
      }
    }
    const getSchoolSearchRequest = () => {
      return {
        schoolType: schoolType.value ? schoolType.value : '',
        employee: employee.value
          ? {
              item1: employee.value.item1,
              item2: employee.value.item2,
              text: employee.value.text
            }
          : clearValue.value,
        tpa: tpa.value ? tpa.value : '',
        payroll: payroll.value ? payroll.value : '',
        payrollOwner: payrollOwner.value ? payrollOwner.value : ''
      }
    }
    const getIndividualSearchRequest = () => {
      return {
        //individualStatus: individualStatus.value ? individualStatus.value : '',
        participantValue: participantValue.value ? participantValue.value : '',
        contributionRate: contributionRate.value ? contributionRate.value : '',
        accountBalance: accountBalance.value ? accountBalance.value : '',
        employmentStatus: employmentStatus.value ? employmentStatus.value : '',
        planStatus: planStatus.value ? planStatus.value : '',
        equityAllocation: equityAllocation.value ? equityAllocation.value : '',
        hasLoan: hasLoan.value ? hasLoan.value : ''
      }
    }
    const setStoreValues = () => {
      store.state.finderList.advanceFilter = {
        planTypeList: planType.value ? planType.value.split() : '',
        planAssets: planAssets.value,
        industry: industry.value,
        //Additional Info
        city: plancity.value,
        businessCode: businesscode.value,
        yearEnd: mostrecentplanyears.value,
        state: state.value,
        multipleEmployerPlan: multiemployerplan.value,
        nonExemptTransaction: plannonexempttransaction.value,
        collectiveBargain: plancollectivebargain.value,
        planNotFidelity: plannotcoverfidelity.value,
        auditReportAttached: auditreport.value,
        fraudLossDishonesty: planlossfrauddishonesty.value,
        failedTransmit: failedtotransmitparticipantcontribution.value,
        //Demographics
        totalContribution: contribution.value,
        averageAccountBalance: averageaccountbalance.value,
        averageParticipantContribution: averageparticipantcontribution.value,
        averageParticipantAccountBalance: averageparticipantaccountbalance.value,
        averageEmployerContribution: averageemployercontribution.value,
        assetGrowthPct: assetsgrowth.value,
        utilizationPct: utilization.value,
        returnOnInvestment: returninvestment.value,
        planAge: planage.value,
        participantCount: participant.value,
        planLoanPct: loanplanassets.value,
        activeParticipants: activeparticipant.value,
        participationPct: participation.value,
        deemedCorrective: correctivedistribution.value,
        sponsorsMultiRetirePlan: sponsor.value,
        ///Provider Search
        insuranceCarrier: insurancecarrier.value,
        serviceProvider: serviceprovider.value,
        broker: broker.value,
        totalFeesPct: feesform5500.value,
        revenueSharePct: revenueshare.value,
        commissionCostPct: commission.value,
        indirectFeesPct: indirectfees.value,
        serviceCode: natureofservice.value,
        compensationCode: natureofcompensation.value,
        receivedIndirectComp: receivedindirectcomp.value,
        indirectCompIncluded: eligibleindirectcompinclude.value,
        compensationFormulaProvided: compensationformulaprovided.value,
        filterList: filterChips.value,
        ///Schools
        schoolFilterChip: schoolChips.value,
        schoolType: schoolType.value,
        employee: employee.value,
        tpa: tpa.value,
        payroll: payroll.value,
        payrollOwner: payrollOwner.value,
        ///Individual
        individualFilterChip: individualChips.value,
        hasLoan: hasLoan.value,
        employmentStatus: employmentStatus.value,
        planStatus: planStatus.value,
        equityAllocation: equityAllocation.value,
        //individualStatus: individualStatus.value,
        participantValue: participantValue.value,
        contributionRate: contributionRate.value,
        accountBalance: accountBalance.value,
        municipalFilterChip: municipalChips.value,
        churchFilterChip: churchChips.value,
        taxExemptFilterChip: taxExemptChips.value
      }
    }
    const updateModels = () => {
      if (Object.keys(store.state.finderList).length > 0) {
        if (store.state.finderList.advanceFilter && Object.keys(store.state.finderList.advanceFilter).length > 0) {
          var finderList = store.state.finderList.advanceFilter
          ///Employee Sponsored
          if (finderList.planTypeList && finderList.planTypeList.length > 0) {
            var savedPlanTypePosition = planTypeList.value.filter((m) => m.DCPTYPE === finderList.planTypeList[0])
            if (savedPlanTypePosition && savedPlanTypePosition.length > 0) {
              planType.value = savedPlanTypePosition[0].DCPTYPE
            } else planType.value = ''
          } else planType.value = ''

          if (finderList.planAssets.item1 >= 0 && finderList.planAssets.item2 > 0) {
            var planAssetVal = assetList.value.find(
              (f) => f.item1 === finderList.planAssets.item1 && f.item2 === finderList.planAssets.item2
            )
            if (planAssetVal === undefined) {
              planAssets.value = {
                item1: finderList.planAssets.item1,
                item2: finderList.planAssets.item2,
                text: 'Custom'
              }
            } else planAssets.value = planAssetVal
          } else planAssets.value = clearValue.value

          if (finderList.industry) {
            industries.value = []
            industries.value.push(finderList.industry)
            industry.value = finderList.industry ? finderList.industry : ''
          } else industry.value = ''
          //Additional Plan
          if (finderList.city) {
            cities.value = []
            cities.value.push(finderList.city)
            plancity.value = finderList.city
          } else plancity.value = ''
          businesscode.value = finderList.businessCode
          mostrecentplanyears.value = finderList.yearEnd
          state.value = finderList.state
          multiemployerplan.value = finderList.multipleEmployerPlan
          plannonexempttransaction.value = finderList.nonExemptTransaction
          plancollectivebargain.value = finderList.collectiveBargain
          plannotcoverfidelity.value = finderList.planNotFidelity
          auditreport.value = finderList.auditReportAttached
          planlossfrauddishonesty.value = finderList.fraudLossDishonesty
          failedtotransmitparticipantcontribution.value = finderList.failedTransmit
          //Demographics
          if (finderList.totalContribution.item1 > 0) {
            var contributionVal = contributions.value.find(
              (f) => f.item1 === finderList.totalContribution.item1 && f.item2 === finderList.totalContribution.item2
            )
            if (contributionVal === undefined) {
              contribution.value = {
                item1: finderList.totalContribution.item1,
                item2: finderList.totalContribution.item2,
                text: 'Custom'
              }
            } else contribution.value = contributionVal
          } else contribution.value = clearValue.value

          if (finderList.averageAccountBalance.item1 > 0) {
            var averageAccountBal = averageaccountbalanceitems.value.find(
              (f) => f.item1 === finderList.averageAccountBalance.item1 && f.item2 === finderList.averageAccountBalance.item2
            )
            if (averageAccountBal === undefined) {
              averageaccountbalance.value = {
                item1: finderList.averageAccountBalance.item1,
                item2: finderList.averageAccountBalance.item2,
                text: 'Custom'
              }
            } else averageaccountbalance.value = averageAccountBal
          } else averageaccountbalance.value = clearValue.value

          if (finderList.averageParticipantContribution.item1 > 0) {
            var averagepartcont = averageparticipantcontributionitems.value.find(
              (f) =>
                f.item1 === finderList.averageParticipantContribution.item1 &&
                f.item2 === finderList.averageParticipantContribution.item2
            )
            if (averagepartcont === undefined) {
              averageparticipantcontribution.value = {
                item1: finderList.averageParticipantContribution.item1,
                item2: finderList.averageParticipantContribution.item2,
                text: 'Custom'
              }
            } else averageparticipantcontribution.value = averagepartcont
          } else averageparticipantcontribution.value = clearValue.value

          if (finderList.averageParticipantAccountBalance.item1 > 0) {
            var averagePartAccountBal = averageparticipantaccountbalanceitems.value.find(
              (f) =>
                f.item1 === finderList.averageParticipantAccountBalance.item1 &&
                f.item2 === finderList.averageParticipantAccountBalance.item2
            )
            if (averagePartAccountBal === undefined) {
              averageparticipantaccountbalance.value = {
                item1: finderList.averageParticipantAccountBalance.item1,
                item2: finderList.averageParticipantAccountBalance.item2,
                text: 'Custom'
              }
            } else averageparticipantaccountbalance.value = averagePartAccountBal
          } else averageparticipantaccountbalance.value = clearValue.value

          if (finderList.averageEmployerContribution.item1 > 0) {
            var averageEmpCont = averageemployercontributionitems.value.find(
              (f) =>
                f.item1 === finderList.averageEmployerContribution.item1 &&
                f.item2 === finderList.averageEmployerContribution.item2
            )
            if (averageEmpCont === undefined) {
              averageemployercontribution.value = {
                item1: finderList.averageEmployerContribution.item1,
                item2: finderList.averageEmployerContribution.item2,
                text: 'Custom'
              }
            } else averageemployercontribution.value = averageEmpCont
          } else averageemployercontribution.value = clearValue.value

          if (finderList.assetGrowthPct && finderList.assetGrowthPct.item2 !== 0) {
            var assetGrowth = assetsgrowthitems.value.find(
              (f) => f.item1 === finderList.assetGrowthPct.item1 && f.item2 === finderList.assetGrowthPct.item2
            )
            if (assetGrowth === undefined) {
              assetsgrowth.value = {
                item1: finderList.assetGrowthPct.item1,
                item2: finderList.assetGrowthPct.item2,
                text: 'Custom'
              }
            } else assetsgrowth.value = assetGrowth
          } else assetsgrowth.value = clearValue.value

          if (finderList.utilizationPct.item1 > 0) {
            var utilizationVal = utilizationitems.value.find(
              (f) => f.item1 === finderList.utilizationPct.item1 && f.item2 === finderList.utilizationPct.item2
            )
            if (utilizationVal === undefined) {
              utilization.value = {
                item1: finderList.utilizationPct.item1,
                item2: finderList.utilizationPct.item2,
                text: 'Custom'
              }
            } else utilization.value = utilizationVal
          } else utilization.value = clearValue.value

          if (finderList.returnOnInvestment.item1 > 0) {
            var ROI = returninvestmentitems.value.find(
              (f) => f.item1 === finderList.returnOnInvestment.item1 && f.item2 === finderList.returnOnInvestment.item2
            )
            if (ROI === undefined) {
              returninvestment.value = {
                item1: finderList.returnOnInvestment.item1,
                item2: finderList.returnOnInvestment.item2,
                text: 'Custom'
              }
            } else returninvestment.value = ROI
          } else returninvestment.value = clearValue.value

          if (finderList.planAge.item1 > 0) {
            var planAgeVal = planageitems.value.find(
              (f) => f.item1 === finderList.planAge.item1 && f.item2 === finderList.planAge.item2
            )
            if (planAgeVal === undefined) {
              planage.value = {
                item1: finderList.planAge.item1,
                item2: finderList.planAge.item2,
                text: 'Custom'
              }
            } else planage.value = planAgeVal
          } else planage.value = clearValue.value

          if (finderList.participantCount.item1 > 0) {
            var participantVal = participantitems.value.find(
              (f) => f.item1 === finderList.participantCount.item1 && f.item2 === finderList.participantCount.item2
            )
            if (participantVal === undefined) {
              participant.value = {
                item1: finderList.participantCount.item1,
                item2: finderList.participantCount.item2,
                text: 'Custom'
              }
            } else participant.value = participantVal
          } else participant.value = clearValue.value

          if (finderList.planLoanPct.item1 > 0) {
            var loanPlanAssetVal = loanplanassetsitems.value.find(
              (f) => f.item1 === finderList.planLoanPct.item1 && f.item2 === finderList.planLoanPct.item2
            )
            if (loanPlanAssetVal === undefined) {
              loanplanassets.value = {
                item1: finderList.planLoanPct.item1,
                item2: finderList.planLoanPct.item2,
                text: 'Custom'
              }
            } else loanplanassets.value = loanPlanAssetVal
          } else loanplanassets.value = clearValue.value

          if (finderList.activeParticipants.item1 > 0) {
            var activeparticipantVal = activeparticipantitems.value.find(
              (f) => f.item1 === finderList.activeParticipants.item1 && f.item2 === finderList.activeParticipants.item2
            )
            if (activeparticipantVal === undefined) {
              activeparticipant.value = {
                item1: finderList.activeParticipants.item1,
                item2: finderList.activeParticipants.item2,
                text: 'Custom'
              }
            } else activeparticipant.value = activeparticipantVal
          } else activeparticipant.value = clearValue.value

          if (finderList.participationPct.item1 > 0) {
            var participationVal = participationitems.value.find(
              (f) => f.item1 === finderList.participationPct.item1 && f.item2 === finderList.participationPct.item2
            )
            if (participationVal === undefined) {
              participation.value = {
                item1: finderList.participationPct.item1,
                item2: finderList.participationPct.item2,
                text: 'Custom'
              }
            } else participation.value = participationVal
          } else participation.value = clearValue.value

          correctivedistribution.value = finderList.deemedCorrective
          sponsor.value = finderList.sponsorsMultiRetirePlan
          ///Provider Search
          insurancecarrier.value = finderList.insuranceCarrier
          serviceprovider.value = finderList.serviceProvider.value
          broker.value = finderList.broker
          if (finderList.totalFeesPct.item1 > 0) {
            var feesPct = feesform5500items.value.find(
              (f) => f.item1 === finderList.totalFeesPct.item1 && f.item2 === finderList.totalFeesPct.item2
            )
            if (feesPct === undefined) {
              feesform5500.value = {
                item1: finderList.totalFeesPct.item1,
                item2: finderList.totalFeesPct.item2,
                text: 'Custom'
              }
            } else feesform5500.value = feesPct
          } else feesform5500.value = clearValue.value

          if (finderList.revenueSharePct.item1 > 0) {
            var revenueShareVal = revenueshareitems.value.find(
              (f) => f.item1 === finderList.revenueSharePct.item1 && f.item2 === finderList.revenueSharePct.item2
            )
            if (revenueShareVal === undefined) {
              revenueshare.value = {
                item1: finderList.revenueSharePct.item1,
                item2: finderList.revenueSharePct.item2,
                text: 'Custom'
              }
            } else revenueshare.value = revenueShareVal
          } else revenueshare.value = clearValue.value

          if (finderList.commissionCostPct.item1 > 0) {
            var commissionVal = commissionitems.value.find(
              (f) => f.item1 === finderList.commissionCostPct.item1 && f.item2 === finderList.commissionCostPct.item2
            )
            if (commissionVal === undefined) {
              commission.value = {
                item1: finderList.commissionCostPct.item1,
                item2: finderList.commissionCostPct.item2,
                text: 'Custom'
              }
            } else commission.value = commissionVal
          } else commission.value = clearValue.value

          if (finderList.indirectFeesPct.item1 > 0) {
            var indirectFeesVal = indirectfeesitems.value.find(
              (f) => f.item1 === finderList.indirectFeesPct.item1 && f.item2 === finderList.indirectFeesPct.item2
            )
            if (indirectFeesVal === undefined) {
              indirectfees.value = {
                item1: finderList.indirectFeesPct.item1,
                item2: finderList.indirectFeesPct.item2,
                text: 'Custom'
              }
            } else indirectfees.value = indirectFeesVal
          } else indirectfees.value = clearValue.value

          natureofservice.value = finderList.serviceCode
          natureofcompensation.value = finderList.compensationCode
          receivedindirectcomp.value = finderList.receivedIndirectComp
          eligibleindirectcompinclude.value = finderList.indirectCompIncluded
          compensationformulaprovided.value = finderList.compensationFormulaProvided
          filterChips.value = finderList.filterList ? finderList.filterList : []
          ///School
          schoolChips.value = finderList.schoolFilterChip ? finderList.schoolFilterChip : []
          schoolType.value = finderList.schoolType ? finderList.schoolType : ''
          employee.value = finderList.employee ? finderList.employee : clearValue.value
          tpa.value = finderList.tpa ? finderList.tpa : ''
          payroll.value = finderList.payroll ? finderList.payroll : ''
          payrollOwner.value = finderList.payrollOwner ? finderList.payrollOwner : ''
          ///Individual
          individualChips.value = finderList.individualFilterChip ? finderList.individualFilterChip : []
          hasLoan.value = finderList.hasLoan ? finderList.hasLoan : ''
          employmentStatus.value = finderList.employmentStatus ? finderList.employmentStatus : ''
          planStatus.value = finderList.planStatus ? finderList.planStatus : ''
          equityAllocation.value = finderList.equityAllocation ? finderList.equityAllocation : ''
          // individualStatus.value = finderList.individualStatus
          //   ? finderList.individualStatus
          //   : ''
          participantValue.value = finderList.participantValue ? finderList.participantValue : ''
          contributionRate.value = finderList.contributionRate ? finderList.contributionRate : ''
          accountBalance.value = finderList.accountBalance ? finderList.accountBalance : ''
          municipalChips.value = finderList.municipalFilterChip ? finderList.municipalFilterChip : []
          churchChips.value = finderList.churchFilterChip ? finderList.churchFilterChip : []
          taxExemptChips.value = finderList.taxExemptFilterChip ? finderList.taxExemptFilterChip : []
        }
      }
    }
    const getFinderFilterValue = () => {
      if (showSchool.value) {
        store.dispatch('getFinderSchoolFilter')
      }
      if (showEmployerSponsored.value) {
        store.dispatch('getFinderPlanType')
      }
      if (showIndividuals.value) {
        store.dispatch('getFinderEmploymentStatus')
        store.dispatch('getFinderPlanStatus')
      }
    }
    watch(
      () => buisnessCodeSync.value,
      (val) => {
        if (val === '') {
          businesscode.value = null
        }
      }
    )
    watch(
      () => planYearSync.value,
      (val) => {
        if (val === '') {
          mostrecentplanyears.value = 0
        }
      }
    )
    watch(
      () => stateSync.value,
      (val) => {
        if (val === '') {
          state.value = null
        }
      }
    )
    onMounted(() => {
      resetVariables()
      resetSchoolFilter()
      resetIndividualFilter()
      lastPlanSearchRequest.value = getPlanSearchRequest()
      getFinderFilterValue()
      updateModels()
    })
    return {
      planType,
      planTypeList,
      planAssets,
      assetList,
      clearCustom,
      assignNumberObject,
      industry,
      industries,
      getIndustriesList,
      getPlanByIndustry,
      plancity,
      cities,
      getCitiesList,
      checkFields,
      individualStatus,
      individualStatusList,
      businesscode,
      buisnessCodeSync,
      businesscodeitems,
      mostrecentplanyears,
      planYearSync,
      mostrecentplanyearitems,
      state,
      states,
      stateSync,
      multiemployerplan,
      plannonexempttransaction,
      plancollectivebargain,
      plannotcoverfidelity,
      auditreport,
      planlossfrauddishonesty,
      failedtotransmitparticipantcontribution,
      contribution,
      contributions,
      resetCustom,
      averageaccountbalance,
      averageaccountbalanceitems,
      averageparticipantcontribution,
      averageparticipantaccountbalance,
      averageemployercontribution,
      averageemployercontributionitems,
      assetsgrowth,
      assetsgrowthitems,
      utilization,
      utilizationitems,
      returninvestment,
      planage,
      planageitems,
      participant,
      participantitems,
      loanplanassets,
      loanplanassetsitems,
      activeparticipant,
      activeparticipantitems,
      participation,
      participationitems,
      filterChips,
      sponsor,
      insurancecarrier,
      serviceprovider,
      broker,
      feesform5500,
      feesform5500items,
      revenueshare,
      revenueshareitems,
      commission,
      commissionitems,
      indirectfees,
      indirectfeesitems,
      natureofservice,
      natureofserviceitems,
      natureofcompensation,
      natureofcompensationitems,
      receivedindirectcomp,
      eligibleindirectcompinclude,
      compensationformulaprovided,
      schoolType,
      schoolTypeList,
      employee,
      employeeList,
      tpa,
      tpaList,
      payrollOwner,
      payrollSlotNamesList,
      payroll,
      payrollList,
      participantValue,
      participantList,
      contributionRate,
      contributionRateList,
      accountBalance,
      accountBalanceList,
      employmentStatus,
      employmentList,
      equityAllocation,
      allocationList,
      hasLoan,
      loanList,
      lastPlanSearchRequest,
      store,
      $authz,
      planStatusList,
      schoolChips,
      municipalChips,
      churchChips,
      taxExemptChips,
      individualChips,
      getFilterChips,
      getSchoolFilterChips,
      getIndividualFilterChips,
      setStoreValues,
      getPlanSearchRequest,
      getSchoolSearchRequest,
      updateModels
    }
  }
}
</script>
