<template>
  <v-col cols="12" class="pa-0">
    <v-col v-show="prospectTabValue === 0" class="pa-0">
      <v-col cols="12" class="pa-0">
        <v-row>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="employerPlanType"
                label="Plan Type"
                :items="employeePlanTypeList"
                item-title="PlanType"
                item-value="PlanType"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-row>
              <v-col
                class="pa-0"
                :lg="employerAsset && employerAsset.text === 'Custom' ? 5 : 11"
                :sm="employerAsset && employerAsset.text === 'Custom' ? 6 : 11"
                :cols="employerAsset && employerAsset.text === 'Custom' ? 6 : 12"
              >
                <v-select
                  v-model="employerAsset"
                  :items="employerAssetList"
                  :return-object="true"
                  label="Asset Value"
                  clearable
                  :menu-props="{ overflowY: true }"
                  @click:clear="clearCustom('employerAsset')"
                />
              </v-col>
              <v-col lg="6" cols="5" md="6" class="pa-0">
                <v-row>
                  <CustomMinMax
                    v-show="employerAsset && employerAsset.text === 'Custom'"
                    fieldType="currency"
                    :fieldPrefix="'$'"
                    :returnNumberObject="employerAsset"
                    :resetCustom="resetCustom"
                    pageName="LivePlans"
                    @returnCallFunction="assignNumberObject"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-row>
              <v-col
                class="pa-0"
                :md="employerParticipant && employerParticipant.text === 'Custom' ? 5 : 11"
                :cols="employerParticipant && employerParticipant.text === 'Custom' ? 6 : 12"
                :sm="employerParticipant && employerParticipant.text === 'Custom' ? 6 : 11"
              >
                <v-select
                  v-model="employerParticipant"
                  :items="participantsList"
                  :return-object="true"
                  label="Participants"
                  clearable
                  :menu-props="{ overflowY: true }"
                  @click:clear="clearCustom('employerParticipant')"
                />
              </v-col>
              <v-col lg="6" cols="5" md="6" class="pa-0">
                <v-row>
                  <CustomMinMax
                    v-show="employerParticipant && employerParticipant.text === 'Custom'"
                    fieldType="Number"
                    :returnNumberObject="employerParticipant"
                    :resetCustom="resetCustom"
                    pageName="LivePlans"
                    @returnCallFunction="assignNumberObject"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="employerTpa"
                label="TPA"
                :items="clientTpaList"
                item-title="TPA"
                item-value="TPA"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="employerRelationshipManager"
                label="Relationship Manager"
                :items="clientPlanRelationshipMangerList"
                item-title="RelationshipManager"
                item-value="RelationshipManager"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="employerPlanYear"
                label="Plan Year"
                :items="clientPlanYearList"
                item-title="PlanYear"
                item-value="PlanYear"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <v-col v-show="prospectTabValue === 3" class="pa-0">
      <v-col cols="12" class="pa-0">
        <v-row>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="planStatus"
                label="Plan Status"
                :items="planStatusList"
                item-title="PlanStatus"
                item-value="PlanStatus"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="employmentStatus"
                label="Employment Status"
                :items="employmentStatusList"
                item-title="EmploymentStatus"
                item-value="EmploymentStatus"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="hasLoan"
                label="Loan Status"
                :items="loanStatusList"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-row>
              <v-col
                class="pa-0"
                :md="age && age.text === 'Custom' ? 5 : 11"
                :cols="age && age.text === 'Custom' ? 6 : 12"
                :sm="age && age.text === 'Custom' ? 6 : 11"
              >
                <v-select
                  v-model="age"
                  :items="ageList"
                  :return-object="true"
                  label="Participant Age"
                  clearable
                  :menu-props="{ overflowY: true }"
                  @click:clear="clearCustom('participantage')"
                />
              </v-col>
              <v-col lg="6" cols="5" md="6" class="pa-0">
                <v-row>
                  <CustomMinMax
                    v-show="age && age.text === 'Custom'"
                    fieldType="Number"
                    :returnNumberObject="age"
                    :resetCustom="resetCustom"
                    pageName="LivePlans"
                    @returnCallFunction="assignNumberObject"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-row>
              <v-col
                class="pa-0"
                :md="asset && asset.text === 'Custom' ? 5 : 11"
                :cols="asset && asset.text === 'Custom' ? 6 : 12"
                :sm="asset && asset.text === 'Custom' ? 6 : 11"
              >
                <v-select
                  v-model="asset"
                  :items="assetList"
                  :return-object="true"
                  label="Asset Value"
                  clearable
                  :menu-props="{ overflowY: true }"
                  @click:clear="clearCustom('asset')"
                />
              </v-col>
              <v-col lg="6" cols="5" md="6" class="pa-0">
                <v-row>
                  <CustomMinMax
                    v-show="asset && asset.text === 'Custom'"
                    :fieldPrefix="'$'"
                    fieldType="currency"
                    :returnNumberObject="asset"
                    :resetCustom="resetCustom"
                    pageName="LivePlans"
                    @returnCallFunction="assignNumberObject"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="equityAllocation"
                label="Equity Allocation"
                :items="equityAllocationList"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="planName"
                label="Plan Name"
                :items="planNameList"
                item-title="PlanName"
                item-value="PlanId"
                clearable
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" lg="4" xl="4" class="pa-0">
            <v-col cols="12" sm="11" class="pa-0">
              <v-select
                v-model="accountType"
                label="Account Type"
                :items="accountTypeList"
                clearable
                item-title="AccountType"
                item-value="AccountType"
                :menu-props="{ overflowY: true }"
              />
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-col>
</template>
<script>
import planfinderlist from '@/assets/planfinder.json'
import CustomMinMax from '@/components/TAL/Finder/CustomMinMax'
import { ref, getCurrentInstance, watchEffect, computed, onMounted, nextTick } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  components: {
    CustomMinMax
  },
  props: ['prospectTab'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const resetCustom = ref(false)
    const clearValue = ref(planfinderlist.clearValue)
    const equityAllocationList = ref([
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
    const loanStatusList = ref([
      { text: 'Has a Loan', value: 'Has a Loan' },
      { text: 'Does not have a Loan', value: 'Does not have a Loan' }
    ])
    const hasLoan = ref(null)
    const ageList = ref([
      {
        item1: 0,
        item2: 0,
        text: 'Custom',
        type: 'participantage'
      },
      {
        item1: 0,
        item2: 19,
        text: '< 20 years old',
        type: 'participantage'
      },
      {
        item1: 20,
        item2: 30,
        text: '20 - 30 years old',
        type: 'participantage'
      },
      {
        item1: 30,
        item2: 40,
        text: '30 - 40 years old',
        type: 'participantage'
      },
      {
        item1: 40,
        item2: 50,
        text: '40 - 50 years old',
        type: 'participantage'
      },
      {
        item1: 51,
        item2: 9999999,
        text: '> 50 years old',
        type: 'participantage'
      }
    ])
    const age = ref(null)
    const assetList = ref([
      {
        item1: 0,
        item2: 0,
        text: 'Custom',
        type: 'asset'
      },
      {
        item1: 0,
        item2: 100000,
        text: '< $100k',
        type: 'asset'
      },
      {
        item1: 100000,
        item2: 500000,
        text: '$100K - $500K',
        type: 'asset'
      },
      {
        item1: 500000,
        item2: 1000000,
        text: '$500K - $1M',
        type: 'asset'
      },
      {
        item1: 1000000,
        item2: 5000000,
        text: '$1M - $5M',
        type: 'asset'
      },
      {
        item1: 5000000,
        item2: 10000000,
        text: '$5M - $10M',
        type: 'asset'
      },
      {
        item1: 10000000,
        item2: 999999999999999,
        text: '> $10M',
        type: 'asset'
      }
    ])
    const employerAssetList = ref([
      {
        item1: 0,
        item2: 0,
        text: 'Custom',
        type: 'employerasset'
      },
      {
        item1: 0,
        item2: 100000,
        text: '< $100k',
        type: 'employerasset'
      },
      {
        item1: 100000,
        item2: 500000,
        text: '$100K - $500K',
        type: 'employerasset'
      },
      {
        item1: 500000,
        item2: 1000000,
        text: '$500K - $1M',
        type: 'employerasset'
      },
      {
        item1: 1000000,
        item2: 5000000,
        text: '$1M - $5M',
        type: 'employerasset'
      },
      {
        item1: 5000000,
        item2: 10000000,
        text: '$5M - $10M',
        type: 'employerasset'
      },
      {
        item1: 10000000,
        item2: 999999999999999,
        text: '> $10M',
        type: 'employerasset'
      }
    ])
    const asset = ref(null)
    const accountType = ref(null)
    const employmentStatus = ref(null)
    const planStatus = ref(null)
    const planName = ref(null)
    const participantChips = ref([])
    const planChips = ref([])
    const employerPlanType = ref(null)
    const employerAsset = ref(null)
    const employerParticipant = ref(null)
    const participantsList = ref([
      {
        item1: 0,
        item2: 0,
        text: 'Custom',
        type: 'employerparticipant'
      },
      {
        item1: 0,
        item2: 24,
        text: '< 25',
        type: 'employerparticipant'
      },
      {
        item1: 25,
        item2: 50,
        text: '25 - 50',
        type: 'employerparticipant'
      },
      {
        item1: 51,
        item2: 100,
        text: '51 - 100',
        type: 'employerparticipant'
      },
      {
        item1: 101,
        item2: 250,
        text: '101 - 250',
        type: 'employerparticipant'
      },
      {
        item1: 251,
        item2: 500,
        text: '251 - 500',
        type: 'employerparticipant'
      },
      {
        item1: 501,
        item2: 999999999,
        text: '> 501',
        type: 'employerparticipant'
      }
    ])
    const employerTpa = ref(null)
    const employerRelationshipManager = ref(null)
    const employerPlanYear = ref(null)
    const equityAllocation = ref(null)
    const filterList = ref({
      Planstatus: {
        text: '',
        tooltip: 'Plan Status',
        modelName: 'planStatus',
        defaultValue: ''
      },
      Employmentstatus: {
        text: '',
        tooltip: 'Employment Status',
        modelName: 'employmentStatus',
        defaultValue: ''
      },
      Hasloan: {
        text: '',
        tooltip: 'Loan Status',
        modelName: 'hasLoan',
        defaultValue: ''
      },
      Age: {
        text: '',
        tooltip: 'Participant Age',
        modelName: 'age',
        defaultValue: '',
        type: ''
      },
      Assests: {
        text: '',
        tooltip: 'Asset Value',
        modelName: 'asset',
        defaultValue: '',
        type: 'currency'
      },
      EP: {
        text: '',
        tooltip: 'Equity Allocation',
        modelName: 'equityAllocation',
        defaultValue: '',
        type: 'percent'
      },
      PlanNames: {
        text: '',
        tooltip: 'Plan Name',
        modelName: 'planName',
        defaultValue: '',
        type: 'array'
      },
      AccountTypeList: {
        text: '',
        tooltip: 'Account Type',
        modelName: 'accountType',
        defaultValue: '',
        type: 'array'
      },
      employerPlanType: {
        text: '',
        tooltip: 'Plan Type',
        modelName: 'employerPlanType',
        defaultValue: '',
        type: ''
      },
      employerAsset: {
        text: '',
        tooltip: 'Asset Value',
        modelName: 'employerAsset',
        defaultValue: '',
        type: 'currency'
      },
      employerParticipant: {
        text: '',
        tooltip: 'Participant',
        modelName: 'employerParticipant',
        defaultValue: '',
        type: ''
      },
      employerTpa: {
        text: '',
        tooltip: 'TPA',
        modelName: 'employerTpa',
        defaultValue: '',
        type: ''
      },
      employerRelationshipManager: {
        text: '',
        tooltip: 'Relationship Manager',
        modelName: 'employerRelationshipManager',
        defaultValue: '',
        type: ''
      },
      employerPlanYear: {
        text: '',
        tooltip: 'Plan Year',
        modelName: 'employerPlanYear',
        defaultValue: '',
        type: ''
      }
    })
    const prospectTabValue = ref(props.prospectTab)
    const smAndDown = ref(false)
    const mdAndUp = ref(false)
    //watch
    watchEffect(() => {
      smAndDown.value = display.smAndDown.value
      mdAndUp.value = display.mdAndUp.value
    })
    //computed
    const accountTypeList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.accountTypeList ? $store.state.clientFilter.accountTypeList : []
      }
      return []
    })
    const employmentStatusList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.employmentStatusList ? $store.state.clientFilter.employmentStatusList : []
      }
      return []
    })
    const planNameList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.planNameList ? $store.state.clientFilter.planNameList : []
      }
      return []
    })
    const planStatusList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.planStatusList ? $store.state.clientFilter.planStatusList : []
      }
      return []
    })
    const clientPlanRelationshipMangerList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.relationshipManagerList ? $store.state.clientFilter.relationshipManagerList : []
      }
      return []
    })
    const clientPlanYearList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.planYearList ? $store.state.clientFilter.planYearList : []
      }
      return []
    })
    const clientTpaList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.tpaList ? $store.state.clientFilter.tpaList : []
      }
      return []
    })
    const employeePlanTypeList = computed(() => {
      if (Object.keys($store.state.clientFilter).length > 0) {
        return $store.state.clientFilter.employeePlanList ? $store.state.clientFilter.employeePlanList : []
      }
      return []
    })
    //mounted
    onMounted(() => {
      updateModels()
    })
    //methods
    function assignNumberObject(customValue) {
      if (customValue !== null) {
        switch (customValue.type) {
          case 'participantage':
            age.value = customValue
            break
          case 'asset':
            asset.value = customValue
            break
          case 'employerparticipant':
            employerParticipant.value = customValue
            break
          case 'employerasset':
            employerAsset.value = customValue
            break
        }
      }
    }
    function resetEmployerFilter() {
      employerPlanType.value = null
      employerAsset.value = null
      employerParticipant.value = null
      employerTpa.value = null
      employerRelationshipManager.value = null
      employerPlanYear.value = null
    }
    function resetIndividualFilter() {
      planStatus.value = null
      employmentStatus.value = null
      hasLoan.value = null
      age.value = null
      asset.value = null
      equityAllocation.value = null
      planName.value = null
      accountType.value = null
    }
    function clearCustom(propType) {
      nextTick(() => {
        if (propType === 'participantage') age.value = clearValue
        else if (propType === 'asset') asset.value = clearValue
        else if (propType === 'employerAsset') employerAsset.value = clearValue
        else if (propType === 'employerParticipant') employerParticipant.value = clearValue
        resetCustom.value = true
      })
    }
    function currencyFormat(value) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    }
    function getFilterChips() {
      planChips.value = []
      var planSearchRequest = getEmployerSearchRequest()
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
            var filterdObject = filterList[key]
            //custom check
            if (filterdObject.type === 'array') {
              if (value && value.length > 0) {
                value.forEach((el) => {
                  participantChips.value.push({
                    tooltip: filterdObject.tooltip,
                    text: `${filterdObject.tooltip}: ${el}`,
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
              else filterdObject.text = `${value.item1} - ${value.item2} ${filterdObject.tooltip}`
            } else {
              filterdObject.text = `${this[filterdObject.modelName].text} ${filterdObject.tooltip}`
            }
            if (filterdObject.type !== 'array') {
              planChips.value.push(filterdObject)
            }
          } else {
            var filteredValue = filterList[key]
            if (filteredValue) {
              filteredValue.text = `${value} ${filteredValue.tooltip}`
              planChips.value.push(filteredValue)
            }
          }
        }
      }
      if (Object.keys($store.state.clientPlan).length > 0) {
        if ($store.state.clientPlan.advanceFilter && Object.keys($store.state.clientPlan.advanceFilter).length > 0) {
          $store.state.clientPlan.advanceFilter.planFilterChip = planChips
        } else {
          $store.state.clientPlan.advanceFilter = {
            planFilterChip: planChips
          }
        }
      }
    }
    function getIndividualFilterChips() {
      participantChips.value = []
      var participantSearchRequest = getParticipantSearchRequest()
      var customDefault = planfinderlist.clearValue
      var customClearValue = { item1: 0, item2: 0 }
      for (let [key, value] of Object.entries(participantSearchRequest)) {
        //here deletes empty undefined null values
        if (!value) delete participantSearchRequest[key]
        //here deletes integer if value is zero
        else if (Number.isInteger(value) && value === 0) delete participantSearchRequest[key]
        //here deletes objects when default value
        else if (
          typeof value === 'object' ? Object.compare(value, customDefault) || Object.compare(value, customClearValue) : false
        ) {
          delete participantSearchRequest[key]
        }
        // here pushing valid filter data
        else {
          if (typeof value === 'object') {
            var individualFilterdObject = filterList[key]
            //custom check
            if (individualFilterdObject.type === 'array') {
              if (value && value.length > 0) {
                let planName = ''
                if (individualFilterdObject.modelName === 'planName') {
                  planName = planNameList.value.filter((a) => a.PlanId === value[0])[0].PlanName
                }
                value.forEach((el) => {
                  participantChips.value.push({
                    tooltip: individualFilterdObject.tooltip,
                    text: `${individualFilterdObject.tooltip}: ${
                      individualFilterdObject.modelName === 'planName' ? planName : el
                    }`,
                    modelName: individualFilterdObject.modelName,
                    defaultValue: individualFilterdObject.defaultValue,
                    type: individualFilterdObject.type ? individualFilterdObject.type : ''
                  })
                })
              }
            }
            if (this[individualFilterdObject.modelName].text === 'Custom') {
              if (individualFilterdObject.type === 'currency') {
                individualFilterdObject.text = `${individualFilterdObject.tooltip}: ${currencyFormat(
                  value.item1
                )} - ${currencyFormat(value.item2)} `
              } else {
                individualFilterdObject.text = `${individualFilterdObject.tooltip}: ${value.item1}-${value.item2} `
              }
            } else {
              individualFilterdObject.text = `${individualFilterdObject.tooltip}: ${
                this[individualFilterdObject.modelName].text
              } `
            }
            if (individualFilterdObject.type !== 'array') {
              participantChips.value.push(individualFilterdObject)
            }
          } else {
            var individualFilteredValue = filterList[key]
            if (individualFilteredValue) {
              {
                individualFilteredValue.text =
                  individualFilteredValue.modelName === 'equityAllocation'
                    ? `${individualFilteredValue.tooltip}: <= ${value}% `
                    : `${individualFilteredValue.tooltip}: ${value}`
                participantChips.value.push(individualFilteredValue)
              }
            }
          }
        }
      }
      if (Object.keys($store.state.clientPlan).length > 0) {
        if ($store.state.clientPlan.advanceFilter && Object.keys($store.state.clientPlan.advanceFilter).length > 0) {
          $store.state.clientPlan.advanceFilter.individualFilterChip = participantChips
        } else {
          $store.state.clientPlan.advanceFilter = {
            individualFilterChip: participantChips
          }
        }
      }
    }
    function getEmployerSearchRequest() {
      return {
        employerPlanType: employerPlanType.value ? employerPlanType : '',
        employerAsset: {
          item1: employerAsset.value ? employerAsset.value.item1 : 0,
          item2: employerAsset.value ? employerAsset.value.item2 : 0,
          text: employerAsset.value ? employerAsset.value.text : ''
        },
        employerParticipant: {
          item1: employerParticipant.value ? employerParticipant.value.item1 : 0,
          item2: employerParticipant.value ? employerParticipant.value.item2 : 0,
          text: employerParticipant.value ? employerParticipant.value.text : ''
        },
        employerTpa: employerTpa.value ? employerTpa : '',
        employerRelationshipManager: employerRelationshipManager.value ? employerRelationshipManager : '',
        employerPlanYear: employerPlanYear.value ? employerPlanYear : ''
      }
    }
    function getParticipantSearchRequest() {
      return {
        Planstatus: planStatus.value ? planStatus : null,
        Employmentstatus: employmentStatus.value ? employmentStatus : null,
        Hasloan: hasLoan.value ? hasLoan : '',
        Age: {
          item1: age.value ? age.value.item1 : 0,
          item2: age.value ? age.value.item2 : 0,
          text: age.value ? age.value.text : ''
        },
        Assests: {
          item1: asset.value ? asset.value.item1 : 0,
          item2: asset.value ? asset.value.item2 : 0,
          text: asset.value ? asset.value.text : ''
        },
        EP: equityAllocation.value ? equityAllocation : null,
        PlanNames: planName.value && planName.value.length > 0 ? planName.value.split() : [],
        AccountTypeList: accountType.value && accountType.value.length > 0 ? accountType.value.split() : []
      }
    }
    function setStoreValues() {
      $store.state.clientPlan.advanceFilter = {
        ///Employer
        planFilterChip: planChips,
        employerPlanType: employerPlanType.value ? employerPlanType : '',
        employerAsset: employerAsset,
        employerParticipant: employerParticipant,
        employerTpa: employerTpa,
        employerRelationshipManager: employerRelationshipManager,
        employerPlanYear: employerPlanYear,
        ///Individual
        individualFilterChip: participantChips,
        Planstatus: planStatus,
        Employmentstatus: employmentStatus,
        Hasloan: hasLoan,
        Age: age,
        Assests: asset,
        EP: equityAllocation,
        PlanNames: planName.value ? planName : [],
        AccountTypeList: accountType.value ? accountType : []
      }
    }
    function updateModels() {
      if (Object.keys($store.state.clientPlan).length > 0) {
        if ($store.state.clientPlan.advanceFilter && Object.keys($store.state.clientPlan.advanceFilter).length > 0) {
          var finderList = $store.state.clientPlan.advanceFilter
          ///Employee Sponsored
          planChips.value = finderList.planFilterChip ? finderList.planFilterChip : []
          employerPlanType.value = finderList.employerPlanType ? finderList.employerPlanType : ''
          if (finderList.employerAsset.item1 >= 0 && finderList.employerAsset.item2 > 0) {
            var employerAssetVal = employerAssetList.value.find(
              (f) => f.item1 === finderList.employerAsset.item1 && f.item2 === finderList.employerAsset.item2
            )
            if (employerAssetVal === undefined) {
              employerAsset.value = {
                item1: finderList.employerAsset.item1,
                item2: finderList.employerAsset.item2,
                text: 'Custom'
              }
            } else employerAsset.value = employerAssetVal
          } else employerAsset.value = clearValue

          if (finderList.employerParticipant.item1 >= 0 && finderList.employerParticipant.item2 > 0) {
            var employerParticipantVal = participantsList.value.find(
              (f) => f.item1 === finderList.employerParticipant.item1 && f.item2 === finderList.employerParticipant.item2
            )
            if (employerParticipantVal === undefined) {
              employerParticipant.value = {
                item1: finderList.employerParticipant.item1,
                item2: finderList.employerParticipant.item2,
                text: 'Custom'
              }
            } else employerParticipant.value = employerParticipantVal
          } else employerParticipant.value = clearValue

          employerTpa.value = finderList.employerTpa ? finderList.employerTpa : ''
          employerRelationshipManager.value = finderList.employerRelationshipManager ? finderList.employerRelationshipManager : ''
          employerPlanYear.value = finderList.employerPlanYear ? finderList.employerPlanYear : ''
          //Individual
          participantChips.value = finderList.individualFilterChip ? finderList.individualFilterChip : []
          planStatus.value = finderList.Planstatus ? finderList.Planstatus : ''
          employmentStatus.value = finderList.Employmentstatus ? finderList.Employmentstatus : ''
          hasLoan.value = finderList.Hasloan ? finderList.Hasloan : ''

          if (finderList.Age.item1 >= 0 && finderList.Age.item2 > 0) {
            var participantAgeVal = ageList.value.find(
              (f) => f.item1 === finderList.Age.item1 && f.item2 === finderList.Age.item2
            )
            if (participantAgeVal === undefined) {
              age.value = {
                item1: finderList.Age.item1,
                item2: finderList.Age.item2,
                text: 'Custom'
              }
            } else age.value = participantAgeVal
          } else age.value = clearValue

          if (finderList.Assests.item1 >= 0 && finderList.Assests.item2 > 0) {
            var participantAssetVal = assetList.value.find(
              (f) => f.item1 === finderList.Assests.item1 && f.item2 === finderList.Assests.item2
            )
            if (participantAssetVal === undefined) {
              asset.value = {
                item1: finderList.Assests.item1,
                item2: finderList.Assests.item2,
                text: 'Custom'
              }
            } else asset.value = participantAssetVal
          } else asset.value = clearValue

          equityAllocation.value = finderList.EP ? finderList.EP : ''
          planName.value = finderList.PlanNames ? finderList.PlanNames : ''
          accountType.value = finderList.AccountTypeList ? finderList.AccountTypeList : ''
        }
      }
    }

    //created
    resetEmployerFilter()
    resetIndividualFilter()
    return {
      resetCustom,
      clearValue,
      equityAllocationList,
      equityAllocation,
      loanStatusList,
      hasLoan,
      ageList,
      age,
      assetList,
      employerAssetList,
      asset,
      accountType,
      employmentStatus,
      planStatus,
      planName,
      participantChips,
      planChips,
      employerPlanType,
      employerAsset,
      employerParticipant,
      participantsList,
      employerTpa,
      employerRelationshipManager,
      employerPlanYear,
      filterList,
      updateModels,
      setStoreValues,
      getParticipantSearchRequest,
      getEmployerSearchRequest,
      getIndividualFilterChips,
      getFilterChips,
      currencyFormat,
      clearCustom,
      resetIndividualFilter,
      resetEmployerFilter,
      assignNumberObject,
      prospectTabValue,
      smAndDown,
      mdAndUp,
      accountTypeList,
      employmentStatusList,
      planNameList,
      planStatusList,
      clientPlanRelationshipMangerList,
      clientPlanYearList,
      clientTpaList,
      employeePlanTypeList
    }
  }
}
</script>
