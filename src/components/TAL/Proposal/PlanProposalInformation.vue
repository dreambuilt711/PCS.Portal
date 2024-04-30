<template>
  <div>
    <v-row>
      <v-col cols="12" xl="8" lg="9" class="pr-2 pa-0">
        <v-text-field v-model="proposalPlanInfoForm.companyName" label="Company Name" />
      </v-col>
      <v-col cols="12" xl="8" lg="9" class="pr-2 pa-0">
        <v-text-field
          v-model="proposalPlanInfoForm.planName"
          label="Plan Name"
          :error="planNameError"
          :error-messages="planNameErrorMsg"
          @blur="checkPlanName()"
        />
      </v-col>
      <v-col cols="5" xl="5" lg="5" class="pr-2 pa-0">
        <v-select
          v-model="proposalPlanInfoForm.PlanType"
          label="Plan Type"
          :items="planTypes"
          item-title="text"
          :disabled="planId > 0 ? true : false"
          required
          :rules="[(v) => !!v || 'Plan Type is required']"
        />
      </v-col>
      <v-col cols="12" xl="3" lg="4" class="pr-2 pa-0">
        <v-text-field
          v-model="proposalPlanInfoForm.federalId"
          v-input-mask="{
            mask: '9999999999[-99]',
            rightAlign: false,
            placeholder: '',
            allowMinus: false
          }"
          label="Federal ID#"
          :disabled="planId > 0 ? true : false"
          maxlength="13"
        />
      </v-col>
      <v-col cols="5" xl="5" lg="5" class="pr-2 pa-0">
        <v-text-field v-model="proposalPlanInfoForm.address" label="Address" />
      </v-col>
      <v-col cols="12" xl="3" lg="4" class="pr-2 pa-0">
        <v-text-field v-model="proposalPlanInfoForm.cityStateZip" label="City, State and Zip" />
      </v-col>
      <v-col v-if="planId > 0" cols="5" xl="5" lg="5" class="pr-2 pa-0">
        <v-text-field
          v-model="proposalPlanInfoForm.totalAssets"
          v-input-mask="{
            alias: 'currency',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: '0'
          }"
          label="Total Assets"
          prefix="$"
          maxlength="21"
          @blur="checkNumericValue(proposalPlanInfoForm.totalAssets, 'totalAssets')"
        />
      </v-col>
      <v-col v-else cols="5" xl="5" lg="5" class="pr-2 pa-0">
        <v-text-field
          v-model="proposalPlanInfoForm.estimatedAnnualContributions"
          v-input-mask="{
            alias: 'currency',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: '0'
          }"
          label="Estimated 1st Year Contribution"
          prefix="$"
          maxlength="21"
          @blur="checkNumericValue(proposalPlanInfoForm.estimatedAnnualContributions)"
        />
      </v-col>
      <v-col cols="12" xl="3" lg="4" class="pr-2 pa-0">
        <v-menu
          v-model="assetAsOfDateMenu"
          :close-on-content-click="false"
          :offset="40"
          transition="scale-transition"
          min-width="290px"
          z-index="99999"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="proposalPlanInfoForm.totalAssetAsOfDate"
              v-input-mask="{
                alias: 'datetime',
                inputFormat: 'mm/dd/yyyy',
                showMaskOnHover: false
              }"
              label="As of Date"
              persistent-hint
              @update:model-value="dateAsset = parseDate(proposalPlanInfoForm.totalAssetAsOfDate)"
              @blur="checkDate(proposalPlanInfoForm.totalAssetAsOfDate)"
              append-inner-icon="event"
              v-bind="props"
            >
              <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
            </v-text-field>
          </template>
          <v-date-picker v-model="dateAsset" color="accent" @input="assetAsOfDateMenu = false" />
        </v-menu>
      </v-col>
      <v-col cols="5" xl="5" lg="5" class="pr-2 pa-0">
        <v-text-field
          v-model="proposalPlanInfoForm.participantBalance"
          v-input-mask="{
            alias: 'numeric',
            digits: '0',
            rightAlign: false,
            placeholder: '',
            allowMinus: false
          }"
          label="Participants with a Balance"
          @blur="checkNumericValue(proposalPlanInfoForm.participantBalance, 'participantWithBalance')"
        />
      </v-col>
      <v-col v-if="planId > 0" cols="12" xl="3" lg="4" class="pr-2 pa-0">
        <v-text-field
          v-model="proposalPlanInfoForm.estimatedAnnualContributions"
          v-input-mask="{
            alias: 'currency',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: '0'
          }"
          label="Estimated 1st Year Contribution"
          prefix="$"
          maxlength="21"
          @blur="checkNumericValue(proposalPlanInfoForm.estimatedAnnualContributions, 'estimetedContributionYear')"
        />
      </v-col>
      <v-col
        v-if="proposalPlanInfoForm.PlanType.trim() !== $authz.planType.Simple_IRA_Plan_Proposal"
        class="pr-2 pa-0"
        cols="12"
        :xl="planId > 0 ? '5' : '3'"
        :lg="planId > 0 ? '5' : '4'"
      >
        <v-text-field
          v-model="proposalPlanInfoForm.outsideAsset"
          v-input-mask="{
            alias: 'currency',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: '0'
          }"
          label="Outside Assets"
          prefix="$"
          maxlength="21"
          @blur="checkNumericValue(proposalPlanInfoForm.outsideAsset, 'outsideAsset')"
        />
      </v-col>
      <v-col
        v-if="proposalPlanInfoForm.PlanType.trim() !== $authz.planType.Simple_IRA_Plan_Proposal"
        class="pr-2 pa-0"
        cols="12"
        :xl="planId > 0 ? '3' : '5'"
        :lg="planId > 0 ? '3' : '5'"
      >
        <v-text-field
          v-model="proposalPlanInfoForm.companyStock"
          v-input-mask="{
            alias: 'currency',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: '0'
          }"
          label="Company Stock"
          maxlength="21"
          prefix="$"
          @blur="checkNumericValue(proposalPlanInfoForm.companyStock, 'companyStock')"
        />
      </v-col>
      <v-col
        v-if="proposalPlanInfoForm.PlanType.trim() !== $authz.planType.Simple_IRA_Plan_Proposal"
        class="pr-2 pa-0"
        cols="12"
        :xl="planId > 0 ? '5' : '3'"
        :lg="planId > 0 ? '5' : '4'"
      >
        <v-text-field
          v-model="proposalPlanInfoForm.selfDirectedBrokrage"
          v-input-mask="{
            alias: 'currency',
            rightAlign: false,
            autoUnmask: true,
            allowMinus: false,
            digitsOptional: true,
            placeholder: '0'
          }"
          label="Self Directed Brokerage"
          prefix="$"
          maxlength="21"
          @blur="checkNumericValue(proposalPlanInfoForm.selfDirectedBrokrage, 'selfDirectedBrokrage')"
        />
      </v-col>
      <v-col cols="12" :xl="planId > 0 ? '3' : '5'" :lg="planId > 0 ? '4' : '5'" class="pr-2 pa-0">
        <v-select
          v-model="proposalPlanInfoForm.planYearEnd"
          label="Plan Year End"
          :items="planYearEndList"
          item-title="text"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  props: ['savePlanInfoMethod', 'proposalPlanInfo', 'selectedPlan', 'planId'],
  setup(props, { emit }) {
    const $route = useRoute()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const planTypes = ref([])
    const proposalPlanInfoForm = ref({
      seipNO: '',
      companyName: '',
      planName: '',
      PlanType: '',
      federalId: '',
      address: '',
      cityStateZip: '',
      totalAssets: '',
      participantBalance: '',
      totalAssetAsOfDate: formatDate(new Date().toISOString().substr(0, 10)),
      planYearEnd: formatDate(new Date().toISOString().substr(0, 10)),
      estimatedAnnualContributions: 0,
      outsideAsset: 0,
      companyStock: 0,
      selfDirectedBrokrage: 0
    })
    const oldproposalPlanInfoForm = ref({
      seipNO: '',
      companyName: '',
      planName: '',
      PlanType: '',
      federalId: '',
      address: '',
      cityStateZip: '',
      totalAssets: '',
      participantBalance: '',
      totalAssetAsOfDate: formatDate(new Date().toISOString().substr(0, 10)),
      planYearEnd: formatDate(new Date().toISOString().substr(0, 10)),
      estimatedAnnualContributions: 0,
      outsideAsset: 0,
      companyStock: 0,
      selfDirectedBrokrage: 0
    })
    const assetAsOfDateMenu = ref(false)
    const participantAsOfDateMenu = ref(false)
    const dateParticipant = ref(new Date().toISOString().substr(0, 10))
    const dateAsset = ref(new Date().toISOString().substr(0, 10))
    const valid = ref(true)
    const loaded = ref(false)
    const isTotalAssetAsOfDate = ref(false)
    const planType = ref('')
    const planNameError = ref(false)
    const errorStartDateMsg = ref('')
    const errorStartDate = ref(false)
    const planNameErrorMsg = ref('')
    const planYearEndList = ref([
      { text: '01/31', value: '01/31' },
      { text: '02/28', value: '02/28' },
      { text: '03/31', value: '03/31' },
      { text: '04/30', value: '04/30' },
      { text: '05/31', value: '05/31' },
      { text: '06/30', value: '06/30' },
      { text: '07/31', value: '07/31' },
      { text: '08/31', value: '08/31' },
      { text: '09/30', value: '09/30' },
      { text: '10/31', value: '10/31' },
      { text: '11/30', value: '11/30' },
      { text: '12/31', value: '12/31' }
    ])
    function abondonProposalPlanInfo() {
      Object.assign(proposalPlanInfoForm.value, oldproposalPlanInfoForm.value)
    }
    function assignPlanInfo(val) {
      var planInformation = {
        PNAME: '',
        SNAME: '',
        federalId: '',
        planType: '',
        cityStateZip: '',
        address: '',
        totalAssets: 0,
        assetasOfDate: '',
        planYearEnd: '',
        participantWithBalance: 0,
        partAsOfDate: '',
        estimatedAnnualContributions: 0,
        outsideAsset: 0,
        companyStock: 0,
        selfDirectedBrokrage: 0,
        show: false,
        val: '2',
        message: 'Saved Successfully'
      }
      if (val === 'Clear') {
        planInformation.Name = ''
        planInformation.show = false
        planInformation.message = ''
      } else if (val === 'Save' || val === 'load') {
        if (
          (proposalPlanInfoForm.value.companyName === '' || proposalPlanInfoForm.value.companyName === undefined) &&
          val !== 'load'
        ) {
          planInformation.Name = 'N/A'
        } else {
          planInformation.PNAME = proposalPlanInfoForm.value.planName
          planInformation.SNAME = proposalPlanInfoForm.value.companyName
          planInformation.federalId = proposalPlanInfoForm.value.federalId
          planInformation.planType = proposalPlanInfoForm.value.PlanType
          planInformation.cityStateZip = proposalPlanInfoForm.value.cityStateZip
          planInformation.address = proposalPlanInfoForm.value.address
          planInformation.totalAssets = proposalPlanInfoForm.value.totalAssets
          planInformation.assetasOfDate = proposalPlanInfoForm.value.totalAssetAsOfDate
          planInformation.planYearEnd = proposalPlanInfoForm.value.planYearEnd
          planInformation.estimatedAnnualContributions = proposalPlanInfoForm.value.estimatedAnnualContributions
          planInformation.outsideAsset = proposalPlanInfoForm.value.outsideAsset
          planInformation.companyStock = proposalPlanInfoForm.value.companyStock
          planInformation.selfDirectedBrokrage = proposalPlanInfoForm.value.selfDirectedBrokrage
          planInformation.participantWithBalance = parseInt(proposalPlanInfoForm.value.participantBalance, 10)
        }
      }
      emit('proposalPlanInfoEdit', planInformation, val)
    }
    function loadProposalPlanInfo() {
      proposalPlanInfoForm.value.companyName = props.proposalPlanInfo.SNAME
      proposalPlanInfoForm.value.planName = props.proposalPlanInfo.PNAME
      proposalPlanInfoForm.value.PlanType = props.proposalPlanInfo.DCPTYPE
      proposalPlanInfoForm.value.federalId = props.proposalPlanInfo.SEINPNO
      proposalPlanInfoForm.value.address = props.proposalPlanInfo.SSTREET
      proposalPlanInfoForm.value.totalAssetAsOfDate = props.proposalPlanInfo.AsofDate
        ? formatDate(props.proposalPlanInfo.AsofDate.substring(0, 10))
        : ''
      var currentYearEndData = props.proposalPlanInfo.YEAREND ? formatDate(props.proposalPlanInfo.YEAREND.substring(0, 10)) : ''
      // eslint-disable-next-line no-unused-vars
      const [month, day, year] = currentYearEndData.split('/')
      var yearEndData = month + '/' + day
      proposalPlanInfoForm.value.planYearEnd = props.proposalPlanInfo.YEAREND ? yearEndData : '12/31'
      proposalPlanInfoForm.value.totalAssets = props.planId < 0 ? 0 : props.proposalPlanInfo.TOTASSETS
      proposalPlanInfoForm.value.estimatedAnnualContributions =
        props.planId < 0 ? props.proposalPlanInfo.TOTASSETS : props.proposalPlanInfo.EstimatedFirstYearContributions
      proposalPlanInfoForm.value.participantBalance = props.proposalPlanInfo.PARTIC
      proposalPlanInfoForm.value.cityStateZip = props.proposalPlanInfo.CityStateZip
      proposalPlanInfoForm.value.outsideAsset = props.proposalPlanInfo.OutsideAmount
      proposalPlanInfoForm.value.companyStock = props.proposalPlanInfo.StockAmount
      proposalPlanInfoForm.value.selfDirectedBrokrage = 0
      oldproposalPlanInfoForm.value.companyName = proposalPlanInfoForm.value.companyName
      oldproposalPlanInfoForm.value.planName = proposalPlanInfoForm.value.planName
      oldproposalPlanInfoForm.value.PlanType = proposalPlanInfoForm.value.PlanType
      if (props.planId < 0) {
        oldproposalPlanInfoForm.value.federalId = proposalPlanInfoForm.value.seipNO
      } else {
        oldproposalPlanInfoForm.value.federalId = proposalPlanInfoForm.value.federalId
      }

      oldproposalPlanInfoForm.value.address = proposalPlanInfoForm.value.address
      oldproposalPlanInfoForm.value.totalAssetAsOfDate = proposalPlanInfoForm.value.totalAssetAsOfDate
      oldproposalPlanInfoForm.value.planYearEnd = proposalPlanInfoForm.value.planYearEnd
      oldproposalPlanInfoForm.value.totalAssets = proposalPlanInfoForm.value.totalAssets
      oldproposalPlanInfoForm.value.estimatedAnnualContributions = proposalPlanInfoForm.value.estimatedAnnualContributions
      oldproposalPlanInfoForm.value.participantBalance = proposalPlanInfoForm.value.participantBalance
      oldproposalPlanInfoForm.value.cityStateZip = proposalPlanInfoForm.value.cityStateZip
      oldproposalPlanInfoForm.value.outsideAsset = proposalPlanInfoForm.value.outsideAsset
      oldproposalPlanInfoForm.value.companyStock = proposalPlanInfoForm.value.companyStock
      if (loaded.value === false) loaded.value = true
      checkPlanName()
    }
    const saveInformation = async (callPlan) => {
      var proposalPlan = {}
      proposalPlan.SNAME = proposalPlanInfoForm.value.companyName
      proposalPlan.PNAME = proposalPlanInfoForm.value.planName
      proposalPlan.DCPTYPE = proposalPlanInfoForm.value.PlanType
      proposalPlan.SEINPNO = proposalPlanInfoForm.value.federalId
      proposalPlan.SSTREET = proposalPlanInfoForm.value.address
      var currentdate = new Date()
      var year = currentdate.getFullYear()
      var planYearEndDate = proposalPlanInfoForm.value.planYearEnd ? proposalPlanInfoForm.value.planYearEnd + '/' + year : ''
      proposalPlan.YEAREND = planYearEndDate
      proposalPlan.asOfDate = proposalPlanInfoForm.value.totalAssetAsOfDate
      proposalPlan.TOTASSETS =
        props.planId < 0
          ? parseFloat(proposalPlanInfoForm.value.estimatedAnnualContributions)
          : proposalPlanInfoForm.value.totalAssets
      proposalPlan.EstimatedFirstYearContributions =
        props.planId < 0 ? 0 : parseFloat(proposalPlanInfoForm.value.estimatedAnnualContributions)
      proposalPlan.PARTIC = proposalPlanInfoForm.value.participantBalance
      proposalPlan.CityStateZip = proposalPlanInfoForm.value.cityStateZip
      proposalPlan.OutsideAmount = proposalPlanInfoForm.value.outsideAsset
      proposalPlan.StockAmount = proposalPlanInfoForm.value.companyStock
      proposalPlan.PlanID = props.planId
      await $axios.put('/api/v1/tal/proposal/planinfo', proposalPlan)
      props.savePlanInfoMethod(callPlan, proposalPlan)
      assignPlanInfo('Save')
    }
    function formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    function parseDate(date) {
      if (!date) return null
      if (!Date.parse(date)) {
        isTotalAssetAsOfDate.value = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    function planInfoProposalCompare() {
      if (!Object.compare(proposalPlanInfoForm.value, oldproposalPlanInfoForm.value)) return true
      else return false
    }
    function checkNumericValue(val, from) {
      var checkValue = parseInt(val)
      switch (from) {
        case 'participantWithBalance':
          if (isNaN(checkValue)) proposalPlanInfoForm.value.participantBalance = 0
          break
        case 'estimetedContributionYear':
          if (isNaN(checkValue)) proposalPlanInfoForm.value.estimatedAnnualContributions = 0
          break
        case 'outsideAsset':
          if (isNaN(checkValue)) proposalPlanInfoForm.value.outsideAsset = 0
          break
        case 'companyStock':
          if (isNaN(checkValue)) proposalPlanInfoForm.value.companyStock = 0
          break
        case 'selfDirectedBrokrage':
          if (isNaN(checkValue)) proposalPlanInfoForm.value.selfDirectedBrokrage = 0
          break
        case 'totalAssets':
          if (isNaN(checkValue)) proposalPlanInfoForm.value.totalAssets = 0
          break
        default:
          break
      }
    }
    function checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          proposalPlanInfoForm.value.totalAssetAsOfDate = ''
          dateAsset.value = new Date().toISOString().substr(0, 10)
          isTotalAssetAsOfDate.value = true
        } else {
          errorStartDate.value = false
          errorStartDateMsg.value = ''
        }
      }
    }
    function getPlanTypes() {
      $store
        .dispatch('getPlanTypes')
        .then(() => {
          planTypes.value = $store.state.planTypes.length > 0 ? $store.state.planTypes : []
        })
        .catch(() => {
          planTypes.value = []
        })
    }
    function checkPlanName() {
      if (proposalPlanInfoForm.value.planName === '') {
        planNameErrorMsg.value = 'You cannot have a blank startup plan name.'
        planNameError.value = true
      } else {
        planNameErrorMsg.value = ''
        planNameError.value = false
      }
    }
    function validatePlanInformation() {
      if (!planNameError.value) {
        planNameErrorMsg.value = ''
        planNameError.value = false
        return true
      } else {
        planNameErrorMsg.value = 'You cannot have a blank startup plan name.'
        planNameError.value = true
        return false
      }
    }
    watch(
      () => props.proposalPlanInfo,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          loadProposalPlanInfo()
        }
      }
    )
    watch(
      () => dateAsset.value,
      () => {
        if (!isTotalAssetAsOfDate.value) {
          proposalPlanInfoForm.value.totalAssetAsOfDate = formatDate(dateAsset.value)
        }
        isTotalAssetAsOfDate.value = false
      }
    )
    watch(
      () => assetAsOfDateMenu.value,
      (val) => {
        if (!val) {
          parseDate(proposalPlanInfoForm.value.totalAssetAsOfDate)
        }
      }
    )
    watch(
      () => loaded.value,
      (val) => {
        if (val === true) assignPlanInfo('load')
      },
      { immediate: true }
    )
    watch(
      () => $route,
      () => {
        loaded.value = false
      }
    )
    onMounted(() => {
      oldproposalPlanInfoForm.value = Object.assign({}, proposalPlanInfoForm.value)
      getPlanTypes()
    })
    return {
      proposalPlanInfoForm,
      $authz,
      planNameError,
      planNameErrorMsg,
      planTypes,
      assetAsOfDateMenu,
      dateAsset,
      planYearEndList,
      participantAsOfDateMenu,
      dateParticipant,
      valid,
      planType,
      errorStartDate,
      abondonProposalPlanInfo,
      saveInformation,
      planInfoProposalCompare,
      validatePlanInformation,
      checkPlanName,
      checkNumericValue,
      checkDate,
      parseDate
    }
  }
}
</script>
