<template>
  <div>
    <v-row>
      <v-col cols="12" class="pa-0">
        <h2 v-if="productInvestmentList.length > 0" class="text-accent">Product Information</h2>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-col v-if="productInvestmentList.length > 0" cols="12" xl="4" lg="4" md="6" sm="6" class="pr-2 pa-0">
          <v-col :cols="display.xs.value ? '12' : '11'">
            <v-select v-model="planOptionForm.productInvestment" :items="productInvestmentList" label="Investment Product" />
          </v-col>
        </v-col>
      </v-col>
      <v-col cols="12" xl="4" lg="4" md="6" sm="6" class="pr-2 pa-0">
        <v-col :cols="display.xs.value ? '12' : '11'" class="pa-0">
          <v-select v-model="planOptionForm.custodian" :items="custodiansList" item-title="text" label="Trustee/Custodian" />
        </v-col>
      </v-col>
      <v-col cols="12" xl="4" lg="4" md="6" sm="6" class="pa-0">
        <v-select
          v-if="showSubCustodian"
          v-model="planOptionForm.subCustodian"
          :items="subCustodiansList"
          item-title="text"
          label="Sub Custodian"
        />
      </v-col>
      <v-col cols="12" class="pa-0">
        <h2 class="text-accent">Administrator</h2>
        <!-- changes as per heather feedback -->
      </v-col>
      <v-col cols="12" xl="6" lg="6" md="6" sm="6" class="pa-0">
        <v-radio-group v-model="planOptionForm.professionalCapitalService" inline class :disabled="disableAdministration">
          <v-radio
            :label="
              store.state.user.selectedProgram && store.state.user.selectedProgram.company_Short_Name__c
                ? store.state.user.selectedProgram.company_Short_Name__c
                : 'PCS Retirement'
            "
            value="ProfessionalCapital"
            color="accent"
          />
          <v-radio color="accent" label="Other" value="Other" />
        </v-radio-group>
      </v-col>
      <v-col class="pa-0" cols="12" v-if="otherInfo">
        <v-col cols="8" lg="8" xl="8" class="tpaCheck pa-0">
          <v-checkbox
            v-model="planOptionForm.aboutTPA"
            :ripple="false"
            label="I would like to include information about the TPA firm in the 'About TPA' section of the proposal.
                  If you select this option, please enter information about the TPA firm below. (2300 characters max)"
            class="text-black"
            color="accent"
            @update:model-value="onChecked()"
          />
        </v-col>
        <v-col cols="6" xl="6" lg="6" class="pa-0">
          <v-text-field
            v-model="planOptionForm.tpaName"
            label="TPA Name"
            :error="tpaNameError"
            :error-messages="tpaNameErrorMessage"
            @blur="onTPANameChecked(planOptionForm.tpaName)"
          />
        </v-col>
        <v-col cols="6" xl="6" lg="6" class="pa-0">
          <v-textarea
            v-model="planOptionForm.tpaDescription"
            counter="2300"
            maxlength="2300"
            rows="1"
            auto-grow
            label="TPA Description"
            :error="tpaDescriptionError"
            :error-messages="tpaDescriptionErrorMessage"
            @blur="onTPADescriptionChecked(planOptionForm.tpaDescription)"
          />
        </v-col>
      </v-col>
      <v-col cols="12" class="pa-0">
        <h2 class="text-accent">Select Plan Features</h2>
      </v-col>
      <v-layout :class="store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager ? 'v-row' : ''">
        <v-col
          :xl="store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager ? '6' : '12'"
          :lg="store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager ? '6' : '12'"
          :sm="store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager ? '6' : '12'"
          :md="store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager ? '6' : '12'"
          :cols="store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager ? '6' : '12'"
          class="pa-0"
        >
          <div v-show="false">
            <v-switch
              v-model="planOptionForm.fiduciaryServices"
              :label="`Fiduciary 3(38) Services Program`"
              class="offsetSwitch"
              hide-details
              color="accent"
            />
          </div>
          <div v-if="!isPEP && !hideAdminFiduciary">
            <div v-show="selectedPlan.DCPTYPE === 'Defined Contribution Plan' || selectedPlan.DCPTYPE === 'ERISA 403(b)'">
              <div v-show="planOptionForm.professionalCapitalService === 'ProfessionalCapital'">
                <v-switch
                  v-model="planOptionForm.administrativeFiduciary"
                  :label="`Administrative Fiduciary 3(16) Services Program`"
                  class="offsetSwitch"
                  hide-details
                  color="accent"
                />
              </div>
            </div>
          </div>
          <v-col v-show="false" cols="12" lg="12" sm="12" md="12" class="pa-0">
            <v-switch
              v-model="planOptionForm.safeHarbor"
              left
              :label="`Safe Harbor`"
              class="offsetSwitch"
              hide-details
              color="accent"
            />
          </v-col>
          <v-col v-show="!hideOutsideAsset" cols="12" lg="12" sm="12" md="12" class="pa-0">
            <v-switch
              v-model="planOptionForm.outsideAssets"
              :label="`Outside Assets`"
              class="offsetSwitch"
              hide-details
              color="accent"
            />
          </v-col>
          <v-col v-if="planOptionForm.outsideAssets" cols="6" xl="6" lg="8" class="mt-3 pa-0">
            <v-select v-model="planOptionForm.assets" label="Types of Assets" :items="assetList" item-title="text" />
            <v-text-field
              v-model="planOptionForm.outsideAmount"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0'
              }"
              label="(Non-mutual fund) Asset Amount"
              prefix="$"
              @blur="checkNumericValue(planOptionForm.outsideAmount, 'outsideAmount')"
              @focus="$event.target.select()"
            />
            <p>
              Please note: This amount will be subtracted from the Plan's total asset amount in calculating the first year's fees,
              represented on the "Your Estimated Fee Summary" page of the Proposal.
            </p>
          </v-col>
          <v-col v-show="!hideCompanyStock" cols="12" lg="12" sm="12" md="12" class="pa-0">
            <v-switch
              v-model="planOptionForm.companyStock"
              :label="`Company Stock`"
              class="offsetSwitch"
              hide-details
              color="accent"
            />
          </v-col>
          <v-col v-if="planOptionForm.companyStock" cols="6" xl="6" lg="8" class="mt-3 pa-0">
            <v-text-field
              v-model="planOptionForm.stockAmount"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0'
              }"
              label="Asset Amount"
              prefix="$"
              @blur="checkNumericValue(planOptionForm.stockAmount, 'companyStock')"
              @focus="$event.target.select()"
            />
            <p>
              Please note: This amount will be subtracted from the Plan's total asset amount in calculating the first year's fees,
              represented on the "Your Estimated Fee Summary" page of the Proposal.
            </p>
          </v-col>
          <v-col v-show="!hideSelfDirectedBrokerage" cols="12" lg="12" sm="12" md="12" class="pa-0">
            <v-switch
              v-model="planOptionForm.selfDirectedBrokerage"
              :label="`Self Directed Brokerage`"
              class="offsetSwitch"
              hide-details
              color="accent"
            />
            <v-col v-if="planOptionForm.selfDirectedBrokerage" cols="6" xl="6" lg="8" class="mt-4 pa-0">
              <p>Please note: Adding self directed brokerage will include an ancillary fee for the service.</p>
            </v-col>
          </v-col>
        </v-col>
        <div v-show="store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager">
          <v-switch
            v-model="planOptionForm.mmlInvestor"
            left
            :label="`MML Investor Services`"
            class="offsetSwitch"
            hide-details
            color="accent"
          />
        </div>
      </v-layout>
    </v-row>
  </div>
</template>

<script>
import { ref, inject, getCurrentInstance, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  props: ['proposalPlanList', 'selectedPlan', 'espType', 'report'],
  setup(props) {
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const display = useDisplay()
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const custodiansList = ref([])
    const subCustodiansList = ref([])
    const capabilitiesList = ref([])
    const productInvestmentList = ref([])
    const tpaNameError = ref(false)
    const tpaNameErrorMessage = ref('')
    const tpaDescriptionError = ref(false)
    const tpaDescriptionErrorMessage = ref('')
    const otherInfo = ref(false)
    const assetList = ref([
      { text: 'Select One...', value: 0 },
      { text: 'GIC', value: 1 },
      { text: 'Insurance', value: 2 },
      { text: 'Annuity', value: 3 },
      { text: 'Limited Partnership', value: 4 },
      { text: 'Other', value: 5 }
    ])
    const planOptionForm = ref({
      custodian: '',
      subCustodian: '',
      professionalCapitalService: 'ProfessionalCapital',
      aboutTPA: false,
      tpaName: '',
      tpaDescription: '',
      fiduciaryServices: false,
      administrativeFiduciary: false,
      safeHarbor: false,
      outsideAssets: false,
      assets: 0,
      outsideAmount: 0,
      companyStock: false,
      stockAmount: 0,
      selfDirectedBrokerage: false,
      exchangeTradedFunds: false,
      mmlInvestor: false,
      productInvestment: ''
    })
    const oldPlanOptionForm = ref({
      custodian: '',
      subCustodian: '',
      professionalCapitalService: 'ProfessionalCapital',
      aboutTPA: false,
      tpaName: '',
      tpaDescription: '',
      fiduciaryServices: false,
      administrativeFiduciary: false,
      safeHarbor: false,
      outsideAssets: false,
      assets: 0,
      outsideAmount: 0,
      companyStock: false,
      stockAmount: 0,
      selfDirectedBrokerage: false,
      exchangeTradedFunds: false,
      mmlInvestor: false,
      productInvestment: ''
    })
    const brinkerManager = ref(false)
    const hideSelfDirectedBrokerage = ref(false)
    const hideCompanyStock = ref(false)
    const hideOutsideAsset = ref(false)
    const hideFiduciaryService = ref(false)
    const hideAdminFiduciary = ref(false)
    const hideMMLServicesProgram = ref(false)
    const isPEP = ref(false)
    const disableAdministration = ref(false)
    const showSubCustodian = computed(() => {
      return planOptionForm.value.custodian === 'AdvisorTrust' ? true : false
    })
    const abondonPlanOptions = () => {
      Object.assign(planOptionForm.value, oldPlanOptionForm.value)
    }
    const checkNumericValue = (val, from) => {
      var checkValue = parseInt(val)
      switch (from) {
        case 'outsideAmount':
          if (isNaN(checkValue)) planOptionForm.value.outsideAmount = 0
          break
        case 'companyStock':
          if (isNaN(checkValue)) planOptionForm.value.stockAmount = 0
          break
        default:
          break
      }
    }
    const showHideAdmin = () => {
      if (store.state.user.selectedProgram) {
        if (store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
          if (props.espType) {
            if (props.espType === $authz.firmRelationship.Pooled_Employer_Plan) {
              isPEP.value = true
            } else isPEP.value = false
          } else isPEP.value = false
        } else isPEP.value = false
      } else isPEP.value = false
    }
    const onChecked = () => {
      if (planOptionForm.value.aboutTPA === true) {
        if (!planOptionForm.value.tpaName) {
          tpaNameError.value = true
          tpaNameErrorMessage.value = 'TPA Name is required'
        } else {
          tpaNameError.value = false
          tpaNameErrorMessage.value = ''
        }
        if (!planOptionForm.value.tpaDescription) {
          tpaDescriptionError.value = true
          tpaDescriptionErrorMessage.value = 'TPA Description is required'
        } else {
          tpaDescriptionError.value = false
          tpaDescriptionErrorMessage.value = ''
        }
      } else {
        tpaNameError.value = false
        tpaNameErrorMessage.value = ''
        tpaDescriptionError.value = false
        tpaDescriptionErrorMessage.value = ''
      }
    }
    const onTPANameChecked = (tpaName) => {
      if (!tpaName && planOptionForm.value.aboutTPA === true) {
        tpaNameError.value = true
        tpaNameErrorMessage.value = 'TPA Name is required'
      } else {
        tpaNameError.value = false
        tpaNameErrorMessage.value = ''
      }
    }
    const onTPADescriptionChecked = (tpaDescription) => {
      if (!tpaDescription && planOptionForm.value.aboutTPA === true) {
        tpaDescriptionError.value = true
        tpaDescriptionErrorMessage.value = 'TPA Description is required'
      } else {
        tpaDescriptionError.value = false
        tpaDescriptionErrorMessage.value = ''
      }
    }
    const getCustodians = () => {
      $axios.get(`/api/v1/tal/advisor/custodians`).then((success) => {
        custodiansList.value = success.data.d === null ? [] : success.data.d
        if (props.proposalPlanList.TPA === '' && custodiansList.value.length > 0) {
          planOptionForm.value.custodian = custodiansList.value[0]
        } else {
          planOptionForm.value.custodian = props.proposalPlanList.TPA
        }
        oldPlanOptionForm.value.custodian = planOptionForm.value.custodian
        getSubCustodians()
      })
    }
    const getSubCustodians = () => {
      $axios.get(`/api/v1/tal/advisor/subcustodians`).then((success) => {
        subCustodiansList.value = success.data.d === null ? [] : success.data.d
        if (
          props.proposalPlanList.SUB === '' &&
          subCustodiansList.value.length > 0 &&
          planOptionForm.value.custodian === 'AdvisorTrust'
        ) {
          planOptionForm.value.subCustodian = subCustodiansList.value[0]
        } else {
          planOptionForm.value.subCustodian = props.proposalPlanList.SUB !== '' ? props.proposalPlanList.SUB : ''
        }
        oldPlanOptionForm.value.subCustodian = planOptionForm.value.subCustodian
      })
    }
    const SetPlanOptionsValue = () => {
      return {
        ServiceType: planOptionForm.value.professionalCapitalService === 'ProfessionalCapital' ? 0 : 1,
        AboutTPA: planOptionForm.value.aboutTPA,
        AboutTPAName: planOptionForm.value.tpaName,
        AboutTPADescription: planOptionForm.value.tpaDescription,
        TPA: planOptionForm.value.custodian,
        SUB: showSubCustodian.value === true ? planOptionForm.value.subCustodian : '',
        TPAName: planOptionForm.value.professionalCapitalService !== 'ProfessionalCapital' ? planOptionForm.value.tpaName : '',
        AdminFiduciary: planOptionForm.value.administrativeFiduciary ? 1 : 0,
        ETF: planOptionForm.value.exchangeTradedFunds ? 1 : 0,
        OutsideAmount: planOptionForm.value.outsideAssets ? planOptionForm.value.outsideAmount : 0,
        OutsideType: planOptionForm.value.outsideAssets ? planOptionForm.value.assets : 0,
        StockAmount: planOptionForm.value.stockAmount,
        Outside: planOptionForm.value.outsideAssets ? 1 : 0,
        Stock: planOptionForm.value.companyStock ? 1 : 0,
        Broker: planOptionForm.value.selfDirectedBrokerage ? 1 : 0,
        SafeHarbor: planOptionForm.value.safeHarbor ? 1 : 0,
        MML: planOptionForm.value.mmlInvestor ? 1 : 0
      }
    }
    const loadPlanOptions = () => {
      planOptionForm.value.professionalCapitalService = props.proposalPlanList.ServiceType === 0 ? 'ProfessionalCapital' : 'Other'
      if (props.proposalPlanList.ESPType === $authz.firmRelationship.Pooled_Employer_Plan) {
        planOptionForm.value.professionalCapitalService = 'ProfessionalCapital'
      }
      planOptionForm.value.aboutTPA = props.proposalPlanList.AboutTPA
      planOptionForm.value.tpaName = props.proposalPlanList.AboutTPAName
      planOptionForm.value.tpaDescription = props.proposalPlanList.AboutTPADescription
      planOptionForm.value.custodian = props.proposalPlanList.TPA
      planOptionForm.value.subCustodian = props.proposalPlanList.SUB
      planOptionForm.value.administrativeFiduciary = props.proposalPlanList.AdminFiduciary === 1 ? true : false
      planOptionForm.value.outsideAmount = props.proposalPlanList.OutsideAmount
      planOptionForm.value.assets = props.proposalPlanList.OutsideType
      planOptionForm.value.stockAmount = props.proposalPlanList.StockAmount
      planOptionForm.value.outsideAssets = props.proposalPlanList.Outside === 1 ? true : false
      planOptionForm.value.companyStock = props.proposalPlanList.Stock === 1 ? true : false
      planOptionForm.value.selfDirectedBrokerage = props.proposalPlanList.Broker === 1 ? true : false
      planOptionForm.value.safeHarbor = props.proposalPlanList.SafeHarbor === 1 ? true : false
      planOptionForm.value.mmlInvestor = props.proposalPlanList.MML === 1 ? true : false
      //updated old object onload
      oldPlanOptionForm.value.professionalCapitalService = planOptionForm.value.professionalCapitalService
      oldPlanOptionForm.value.aboutTPA = planOptionForm.value.aboutTPA
      oldPlanOptionForm.value.tpaName = planOptionForm.value.tpaName
      oldPlanOptionForm.value.tpaDescription = planOptionForm.value.tpaDescription
      oldPlanOptionForm.value.custodian = planOptionForm.value.custodian
      oldPlanOptionForm.value.subCustodian = planOptionForm.value.subCustodian
      oldPlanOptionForm.value.administrativeFiduciary = planOptionForm.value.administrativeFiduciary
      //oldPlanOptionForm.value.exchangeTradedFunds = planOptionForm.value.exchangeTradedFunds
      oldPlanOptionForm.value.outsideAmount = planOptionForm.value.outsideAmount
      oldPlanOptionForm.value.stockAmount = planOptionForm.value.stockAmount
      oldPlanOptionForm.value.outsideAssets = planOptionForm.value.outsideAssets
      oldPlanOptionForm.value.companyStock = planOptionForm.value.companyStock
      oldPlanOptionForm.value.assets = planOptionForm.value.assets
      oldPlanOptionForm.value.selfDirectedBrokerage = planOptionForm.value.selfDirectedBrokerage
      oldPlanOptionForm.value.safeHarbor = planOptionForm.value.safeHarbor
      oldPlanOptionForm.value.mmlInvestor = planOptionForm.value.mmlInvestor
      getCustodians()
    }
    const checkDecimal = (model, $event) => {
      if (!Number.isNaN(planOptionForm.value[model])) {
        if (
          (event.which < 48 || event.which > 57) &&
          (event.which !== 46 || planOptionForm.value[model].indexOf('.') !== -1) &&
          event.which !== 13
        ) {
          $event.preventDefault()
        }
        if (
          planOptionForm.value[model] != null &&
          planOptionForm.value[model].indexOf('.') > -1 &&
          planOptionForm.value[model].split('.')[1].length > 1
        ) {
          $event.preventDefault()
        }
      }
    }
    const planOptionCompare = () => {
      if (!Object.compare(planOptionForm.value, oldPlanOptionForm.value)) return true
      else return false
    }
    const showPlanOptions = (val) => {
      if (val && val.length > 0) {
        var proposalPermission = val[0]
        hideAdminFiduciary.value =
          proposalPermission.Hide_Admin_Fiduciary_Services_Program__c !== null
            ? proposalPermission.Hide_Admin_Fiduciary_Services_Program__c === 'false'
              ? false
              : true
            : false
        hideFiduciaryService.value =
          proposalPermission.Hide_Fiduciary_Services_Program__c !== null
            ? proposalPermission.Hide_Fiduciary_Services_Program__c === 'false'
              ? false
              : true
            : false
        hideOutsideAsset.value =
          proposalPermission.Hide_Outside_Assets__c !== null
            ? proposalPermission.Hide_Outside_Assets__c === 'false'
              ? false
              : true
            : false
        hideCompanyStock.value =
          proposalPermission.Hide_Company_Stock__c !== null
            ? proposalPermission.Hide_Company_Stock__c === 'false'
              ? false
              : true
            : false
        hideSelfDirectedBrokerage.value =
          proposalPermission.Hide_Self_Directed_Brokerage__c !== null
            ? proposalPermission.Hide_Self_Directed_Brokerage__c === 'false'
              ? false
              : true
            : false
        hideMMLServicesProgram.value =
          proposalPermission.Hide_MML_Services_Program__c !== null
            ? proposalPermission.Hide_MML_Services_Program__c === 'false'
              ? false
              : true
            : false
      }
    }
    watch(
      () => planOptionForm.value.professionalCapitalService,
      (val) => {
        if (val === 'ProfessionalCapital') {
          otherInfo.value = false
          tpaDescriptionError.value = false
          tpaDescriptionErrorMessage.value = ''
          tpaNameError.value = false
          tpaNameErrorMessage.value = ''
          planOptionForm.value.aboutTPA = false
        } else {
          otherInfo.value = true
        }
      }
    )
    watch(
      () => props.proposalPlanList,
      (newVal, oldval) => {
        if (newVal !== oldval) {
          loadPlanOptions()
          showPlanOptions()
        }
      }
    )
    watch(
      () => props.espType,
      (val) => {
        showHideAdmin()
        if (val === $authz.firmRelationship.Pooled_Employer_Plan) {
          planOptionForm.value.professionalCapitalService = 'ProfessionalCapital'
          disableAdministration.value = true
        } else disableAdministration.value = false
      },
      { immediate: true, deep: true }
    )
    onMounted(() => {
      oldPlanOptionForm.value = Object.assign({}, planOptionForm.value)
      eventBus.on('brinkerManagerValue', (data) => {
        brinkerManager.value = data
      })
      eventBus.on('proposalPermission', (proposalPermission) => {
        showPlanOptions(proposalPermission)
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('proposalPermission')
      eventBus.off('brinkerManagerValue')
    })
    return {
      display,
      store,
      productInvestmentList,
      planOptionForm,
      custodiansList,
      showSubCustodian,
      subCustodiansList,
      disableAdministration,
      capabilitiesList,
      otherInfo,
      onChecked,
      tpaNameError,
      tpaNameErrorMessage,
      onTPANameChecked,
      tpaDescriptionError,
      tpaDescriptionErrorMessage,
      onTPADescriptionChecked,
      abondonPlanOptions,
      SetPlanOptionsValue,
      checkDecimal,
      planOptionCompare,
      brinkerManager,
      isPEP,
      hideAdminFiduciary,
      assetList,
      checkNumericValue,
      hideCompanyStock
    }
  }
}
</script>

<style>
.tpaCheck .v-input__control .v-input__slot .v-label.v-label.theme--light {
  color: rgba(0, 0, 0, 0.87) !important;
}
.tpaCheck .v-input--selection-controls__input {
  align-self: flex-start !important;
}
</style>
