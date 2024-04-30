<template>
  <div>
    <v-container :fluid="!display.xl.value" :class="display.xs.value ? 'pl-0 pr-0' : ''">
      <v-row class="justify-center">
        <v-col cols="12" :class="display.xs.value ? 'pa-1 pl-3' : 'pa-0'">
          <span
            v-if="breadCrumb.parentName"
            class="text-capitalize font_12 cursor-pointer"
            :class="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
            @click="router.push('/Home/Acquisition').catch(() => {})"
            >{{ breadCrumb.parentName }}</span
          >
          <v-icon size="12" :color="!$vuetify?.theme.dark ? 'hyperlink' : ''" class="icon-chevron-right ml-1 mr-1" />
          <span
            v-if="breadCrumb.parentName"
            class="text-capitalize font_12"
            :class="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
          >
            {{ breadCrumb.pageName }}
          </span>
        </v-col>
        <v-col cols="12" sm="12" lg="12" xl="12" class="pa-0">
          <v-col :class="display.xs.value ? 'pa-2' : 'pa-3'">
            <v-col class="pa-0">
              <v-row no-gutters>
                <v-col xs="12" cols="12">
                  <h1 class="text-h6 font_20" :class="$vuetify?.theme.dark ? '' : 'text-black'">Market Opportunities</h1>
                </v-col>
                <v-col cols="12" xs="12" lg="12" xl="12" md="12" sm="12">
                  <h3 class="p1-0 my-4">Show plans with...</h3>
                  <v-col xs="12" cols="12" class="pa-0">
                    <v-row>
                      <v-col
                        v-if="!showSearch"
                        xl="2"
                        md="5"
                        sm="8"
                        :lg="display.width.value < 1400 && display.width.value > 1250 ? '2' : '3'"
                        :xs="display.smAndDown.value ? '8' : '6'"
                        class="ml-2 mr-2 pa-0"
                      >
                        <v-select
                          v-model="searchRadius"
                          :menu-props="{ zIndex: '9999' }"
                          :items="radiusList"
                          placeholder="Radius"
                          hide-details
                          variant="outlined"
                          item-title="text"
                          item-value="value"
                          density="compact"
                          @update:model-value="checkCurrentLocation('search')"
                        ></v-select>
                      </v-col>
                      <v-col v-if="!showSearch" cols="12" xl="1" lg="2" md="3" sm="4" xs="12" class="ml-2 mr-2 d-flex pa-0">
                        <v-text-field
                          v-show="showZipCodeText"
                          v-model="zipcode"
                          :class="[zipcode === 'Current Location' && !$vuetify?.theme.dark ? '' : '', 'text-hyperlink']"
                          clearable
                          variant="outlined"
                          maxlength="5"
                          density="compact"
                          :error="zipcodeError"
                          @keypress="onlyNumber"
                          :error-messages="zipcodeErrorMsg"
                          @click:clear="clearReset()"
                          @keydown="maskAllow($event)"
                          @keyup.enter="loadMarketInsightPlans"
                          @update:model-value="checkFields('location')"
                          @blur="checkCurrentLocation('search')"
                          @click:append-inner="getCurrentLocation()"
                          append-inner-icon="mdi-crosshairs-gps"
                        ></v-text-field>
                        <v-text-field
                          v-show="!showZipCodeText"
                          v-model="zipcode"
                          maxlength="5"
                          variant="outlined"
                          clearable
                          density="compact"
                          :error="zipcodeError"
                          :error-messages="zipcodeErrorMsg"
                          @blur="checkCurrentLocation('search')"
                          :autofocus="showZipCodeText === false ? true : false"
                          @keypress="onlyNumber"
                          :class="[zipcode === 'Current Location' && !$vuetify?.theme.dark ? '' : '', 'text-hyperlink']"
                          @keydown="maskAllow($event)"
                          @click:clear="clearReset()"
                          @keyup.enter="loadMarketInsightPlans"
                          @click:append-inner="getCurrentLocation()"
                          append-inner-icon="mdi-crosshairs-gps"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" xl="2" lg="2" md="3" sm="4" xs="12" class="ml-2 mr-2 d-flex pa-0">
                        <v-select
                          v-model="prospectTab"
                          density="compact"
                          variant="outlined"
                          :menu-props="{ zIndex: '9999' }"
                          :items="sponsorList"
                          item-title="text"
                          item-value="value"
                          item-props.disabled="disabled"
                          :class="display.xs.value ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                          @update:model-value="getCustomerType"
                        ></v-select>
                      </v-col>
                      <v-col v-if="prospectTab === 0" cols="12" xl="2" lg="3" md="3" sm="4" xs="12" class="ml-2 mr-2 d-flex pa-0">
                        <v-select
                          v-model="profitEntityType"
                          density="compact"
                          variant="outlined"
                          :items="profitEntityTypeList"
                          item-title="text"
                          item-value="value"
                          style="z-index: 9999"
                          item-props.disabled="disabled"
                          :class="display.xs.value ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                          @update:model-value="getProfitEntityType"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
                <v-col cols="12" lg="12" xl="12" md="12" sm="12" xs="12" class="pa-0">
                  <ProspectResultAddColumns
                    :key="componentRefresh"
                    :PlanResult="finalPlanResultData"
                    :WidgetName="WidgetName"
                    :total-count="totalCount"
                    :show-loader="showLoader"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { ref, onMounted, computed, getCurrentInstance, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import ProspectResultAddColumns from '@/components/TAL/Finder/MarketInsights/ProspectResultAddColumns'
export default {
  components: {
    ProspectResultAddColumns
  },
  setup() {
    const display = useDisplay()
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const showSearch = ref(false)
    const radiusList = ref([
      { text: 'within 5 miles of ', value: 5 },
      { text: 'within 10 miles of', value: 10 },
      { text: 'within 25 miles of', value: 25 },
      { text: 'within 50 miles of', value: 50 },
      { text: 'within 100 miles of', value: 100 }
    ])
    const searchRadius = ref(5)
    const searchText = ref('')
    const zipcode = ref(19103)
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    const radius = ref(5)
    const showZipCodeText = ref(true)
    const type = ref('')
    const lowReturnValue = ref([])
    const showError = ref(false)
    const plan = ref('')
    const EIN = ref('')
    const PlanResult = ref([])
    const filterPlans = ref([])
    const filterSchools = ref([])
    const filterIndividual = ref([])
    const filterMunicipalties = ref([])
    const filterChurches = ref([])
    const filterTaxExempt = ref([])
    const WidgetName = ref('')
    const finalPlanResultData = ref([])
    const lowestReturnPlans = ref([])
    const componentRefresh = ref(0)
    const selectreports = ref([])
    const lowReturnsResult = ref([])
    const lowestParticipationPlans = ref([])
    const LowParticipationResult = ref([])
    const prospectResult = ref([])
    const prospectPlanResult = ref([])
    const benchmarkPlans = ref([])
    const benchmarkPlanResult = ref([])
    const sponsorList = ref([])
    const prospectTab = ref(0)
    const businessType = ref([
      {
        text: 'For Profit',
        value: 0,
        icon: 'icon-for-profit',
        color: 'forProfitIcon',
        show: true,
        disabled: false
      }
      // {
      //   text: 'Schools',
      //   value: 1,
      //   icon: 'icon-graduation',
      //   color: 'schoolIcon',
      //   show: false,
      //   disabled: false
      // },
      // {
      //   divider: true,
      //   show: true
      // },
      // {
      //   text: 'Municipalities',
      //   value: 2,
      //   icon: 'icon-government',
      //   color: 'municipalitiesIcon',
      //   show: false,
      //   disabled: false
      // },
      // {
      //   text: 'Churches',
      //   value: 3,
      //   icon: 'fas fa-church',
      //   color: 'nonProfitIcon',
      //   show: false,
      //   disabled: false
      // },
      // {
      //   text: 'Tax-Exempt',
      //   value: 7,
      //   icon: 'icon-tax-exempt',
      //   color: 'taxExemptIcon',
      //   show: false,
      //   disabled: false
      // }
    ])
    const profitEntityType = ref(0)
    const profitEntityTypeList = ref([
      {
        text: 'Low Participation Rates',
        value: 0
      },
      {
        text: 'Compliance issues',
        value: 1
      },
      {
        text: 'Low Returns',
        value: 2
      },
      {
        text: 'Fees Above Benchmark',
        value: 3
      }
    ])
    const totalCount = ref(0)
    const showLoader = ref(false)
    const lowReturnsData = ref([])
    const lowParticipationData = ref([])
    const benchmarkPlanData = ref([])
    const prospectPlanData = ref([])
    const breadCrumb = computed(() => {
      return route.meta
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
    const showSchool = computed(() => {
      // if ($authz.hasRole($authz.roles.FirmAdmin)) {
      //   return $authz.allowedByProgram(
      //     $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
      //     $authz.typeOfBusiness.Schools
      //   )
      // } else if (
      //   $authz.hasRole($authz.roles.Advisor) ||
      //   $authz.hasRole($authz.roles.Strategist) ||
      //   $authz.hasRole($authz.roles.Fiduciary338)
      // ) {
      //   return (
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Schools
      //     ) &&
      //     $authz.allowedByAccount(
      //       $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
      //       $authz.typeOfBusiness.Schools
      //     )
      //   )
      // } else
      return true
    })
    const showIndividual = computed(() => {
      // if ($authz.hasRole($authz.roles.FirmAdmin)) {
      //   return (
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     ) ||
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Municipalities
      //     ) ||
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Schools
      //     )
      //   )
      // } else if (
      //   $authz.hasRole($authz.roles.Advisor) ||
      //   $authz.hasRole($authz.roles.Strategist) ||
      //   $authz.hasRole($authz.roles.Fiduciary338)
      // ) {
      //   return (
      //     ($authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     ) &&
      //       $authz.allowedByAccount(
      //         $authz.accountPermissionSet
      //           .Type_of_Business_Advisors_allowed__c,
      //         $authz.typeOfBusiness.Individuals
      //       )) ||
      //     ($authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Municipalities
      //     ) &&
      //       $authz.allowedByAccount(
      //         $authz.accountPermissionSet
      //           .Type_of_Business_Advisors_allowed__c,
      //         $authz.typeOfBusiness.Municipalities
      //       )) ||
      //     ($authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Schools
      //     ) &&
      //       $authz.allowedByAccount(
      //         $authz.accountPermissionSet
      //           .Type_of_Business_Advisors_allowed__c,
      //         $authz.typeOfBusiness.Schools
      //       ))
      //   )
      // } else return true
      return false
    })
    const showMunicipalities = computed(() => {
      // if ($authz.hasRole($authz.roles.FirmAdmin)) {
      //   return $authz.allowedByProgram(
      //     $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
      //     $authz.typeOfBusiness.Municipalities
      //   )
      // } else if (
      //   $authz.hasRole($authz.roles.Advisor) ||
      //   $authz.hasRole($authz.roles.Strategist) ||
      //   $authz.hasRole($authz.roles.Fiduciary338)
      // ) {
      //   return (
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Municipalities
      //     ) &&
      //     $authz.allowedByAccount(
      //       $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
      //       $authz.typeOfBusiness.Municipalities
      //     )
      //   )
      // } else
      return false
    })
    const getAddress = async (zipcode) => {
      var request = new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode}` }, (results, status) => {
          if (status === 'OK') {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.exec(zipcode)) {
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
              resolve(true)
            } else {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Invalid Zip Code'
              reject(false)
            }
          } else {
            // eslint-disable-next-line no-undef
            if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
              resolve(true)
            } else {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Invalid Zip Code'
              reject(false)
            }
          }
        })
      })
      var result = request
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err
        })
      return result
    }
    const checkCurrentLocation = async (from) => {
      if (from === 'search') {
        if (!zipcode.value && !searchText.value) {
          zipcodeError.value = true
          zipcodeErrorMsg.value = 'Zip code is a required'
          return
        } else if (!searchRadius.value) {
          searchRadius.value = 5
        } else {
          zipcodeError.value = false
          zipcodeErrorMsg.value = ''
        }
      }
      if (zipcode.value && zipcode.value !== 'Current Location') {
        var isValidZip = await getAddress(zipcode.value)
        if (!isValidZip) return
      }
      if (zipcode.value === 'Current Location') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              getZipcode(position, from)
            },
            // eslint-disable-next-line no-unused-vars
            (error) => {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Location could not be determined'
            }
          )
        }
      } else {
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
        if (from === 'search') {
          loadMarketInsightPlans('search')
        }
      }
    }
    const getZipcode = (position, from) => {
      zipcodeError.value = false
      zipcodeErrorMsg.value = ''
      $axios
        .get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'jsonv2',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
        })
        .then((success) => {
          if (from === 'current_location') {
            zipcode.value =
              success.data && success.data.address != null && success.data.address.postcode
                ? success.data.address.postcode
                : store.state.user.zipCode
          } else {
            if (Object.keys(store.state.marketInsight).length > 0) {
              zipcode.value = store.state.marketInsight.zipcode
                ? store.state.marketInsight.zipcode
                : success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : store.state.user.zipCode
            } else {
              zipcode.value =
                success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : store.state.user.zipCode
            }
          }
          loadMarketInsightPlans('search')
        })
    }
    const clearReset = () => {
      zipcode.value = ''
      zipcodeError.value = false
      zipcodeErrorMsg.value = ''
      searchRadius.value = ''
    }
    const maskAllow = ($event) => {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode === 8 || keyCode === 46) {
        if (zipcode.value === 'Current Location') zipcode.value = null
      }
    }
    const loadMarketInsightPlans = () => {
      getEntityType()
    }
    const getLowReturnPlan = () => {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/LowestReturns/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              lowReturnValue.value = []
              lowestReturnPlans.value = []
              showError.value = true
              return
            }
            if (success.data.d !== null) {
              lowestReturnPlans.value = success.data.d
            }
            showLoader.value = false
            showError.value = false
            showLowestReturnPlan()
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            showLoader.value = false
            lowReturnValue.value = []
            lowestReturnPlans.value = []
            showError.value = true
          })
      }
    }
    const showLowestReturnPlan = () => {
      lowReturnsResult.value = lowestReturnPlans.value
      if (Object.keys(lowReturnsResult.value).length) {
        let proposalReport = selectreports.value.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        lowReturnsResult.value.map((element) => {
          if (element.DCPTYPE === $authz.planType.Defined_Contribution_Plan || element.DCPTYPE === $authz.planType.ERISA_403_b) {
            element['selectreport'] = selectreports.value && selectreports.value.length > 0 ? selectreports.value : []
          } else {
            element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
          }
        })
      }
      // selectedGroup.value = store.state.marketInsight.selectedGroup
      //   ? store.state.marketInsight.selectedGroup
      //   : 'vs.Peer Group'
      store.state.marketInsight.TotalCount = lowReturnsResult.value ? lowReturnsResult.value.length : 0
      PlanResult.value = lowReturnsResult.value
      store.state.marketInsight.PlanResult = lowReturnsResult.value
      store.state.marketInsight.WidgetName = 'lowReturn'
      store.state.marketInsight.lowReturnsResult = lowReturnsResult.value
      lowReturnsData.value = lowReturnsResult.value
      getProfitEntityType()
    }
    const getLowParticipation = () => {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/LowestParticipation/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              lowestParticipationPlans.value = []
              showError.value = true
              return
            }
            if (success.data.d !== null) {
              lowestParticipationPlans.value = success.data.d
            }
            showLoader.value = false
            showError.value = false
            showLowestParticipationPlans()
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            showLoader.value = false
            lowestParticipationPlans.value = []
            showError.value = true
          })
      }
    }
    const showLowestParticipationPlans = () => {
      LowParticipationResult.value = lowestParticipationPlans.value
      if (Object.keys(LowParticipationResult.value).length) {
        let proposalReport = selectreports.value.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        LowParticipationResult.value.map((element) => {
          if (element.DCPTYPE === $authz.planType.Defined_Contribution_Plan || element.DCPTYPE === $authz.planType.ERISA_403_b) {
            element['selectreport'] = selectreports.value && selectreports.value.length > 0 ? selectreports.value : []
          } else {
            element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
          }
        })
      }
      // selectedGroup.value = store.state.marketInsight.selectedGroup
      //   ? store.state.marketInsight.selectedGroup
      //   : 'vs.Peer Group'
      store.state.marketInsight.TotalCount = LowParticipationResult.value ? LowParticipationResult.value.length : 0
      PlanResult.value = LowParticipationResult.value
      store.state.marketInsight.PlanResult = LowParticipationResult.value
      store.state.marketInsight.WidgetName = 'participationRates'
      store.state.marketInsight.LowParticipationResult = LowParticipationResult.value
      lowParticipationData.value = LowParticipationResult.value
      getProfitEntityType()
    }
    const GetProspectResultCompliance = () => {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/ComplianceAlerts/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              prospectResult.value = []
              showError.value = true
              return
            }
            if (success.data.d != null) {
              if (Object.keys(success.data.d).length > 0) {
                prospectResult.value = success.data.d
              }
              showLoader.value = false
              showError.value = false
              showProspectPlanCompliance()
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            showLoader.value = false
            prospectResult.value = []
            showError.value = true
          })
      }
    }
    const showProspectPlanCompliance = () => {
      prospectPlanResult.value = prospectResult.value
      if (prospectPlanResult.value && prospectPlanResult.value.length > 0) {
        let proposalReport = selectreports.value.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        prospectPlanResult.value.map((element) => {
          if (element.DCPTYPE === $authz.planType.Defined_Contribution_Plan || element.DCPTYPE === $authz.planType.ERISA_403_b) {
            element['selectreport'] = selectreports.value && selectreports.value.length > 0 ? selectreports.value : []
          } else {
            element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
          }
        })
      }
      store.state.marketInsight.TotalCount = prospectPlanResult.value ? prospectPlanResult.value.length : 0
      PlanResult.value = prospectPlanResult.value
      store.state.marketInsight.PlanResult = prospectPlanResult.value
      store.state.marketInsight.WidgetName = 'compliance'
      store.state.marketInsight.prospectPlanResult = prospectPlanResult.value
      prospectPlanData.value = prospectPlanResult.value
      getProfitEntityType()
    }
    const getBenchmark = () => {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/PlanFeeAboveBenchmark/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              benchmarkPlans.value = []
              showError.value = true
              return
            }
            if (success.data.d != null) {
              benchmarkPlans.value = success.data.d.length > 0 ? success.data.d : []
            }
            showLoader.value = false
            showError.value = false
            showBenchmarkPlans()
          })
          .catch(() => {
            showLoader.value = false
            benchmarkPlans.value = []
            showError.value = true
          })
      }
    }
    const showBenchmarkPlans = () => {
      benchmarkPlanResult.value = benchmarkPlans.value
      if (benchmarkPlanResult.value && benchmarkPlanResult.value.length > 0) {
        let proposalReport = selectreports.value.slice()
        if (proposalReport && proposalReport.length > 0) {
          let expressDiagnosticPosition = proposalReport.findIndex((a) => a.val === 'Express Diagnostic')
          if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
          let diagnosticPosition = proposalReport.findIndex((a) => a.val === 'Diagnostic')
          if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
          let rpeaPosition = proposalReport.findIndex((a) => a.val === 'RPEA')
          if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
        }
        benchmarkPlanResult.value.map((element) => {
          if (element.DCPTYPE === $authz.planType.Defined_Contribution_Plan || element.DCPTYPE === $authz.planType.ERISA_403_b) {
            element['selectreport'] = selectreports.value && selectreports.value.length > 0 ? selectreports.value : []
          } else {
            element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
          }
        })
      }
      // selectedGroup.value = store.state.marketInsight.selectedGroup
      //   ? store.state.marketInsight.selectedGroup
      //   : 'vs.Peer Group'
      store.state.marketInsight.TotalCount = benchmarkPlanResult.value ? benchmarkPlanResult.value.length : 0
      PlanResult.value = benchmarkPlanResult.value
      store.state.marketInsight.PlanResult = benchmarkPlanResult.value
      store.state.marketInsight.WidgetName = 'benchmark'
      store.state.marketInsight.benchmarkPlanResult = benchmarkPlanResult.value
      benchmarkPlanData.value = benchmarkPlanResult.value
      getProfitEntityType()
    }
    const getCurrentLocation = () => {
      zipcode.value = 'Current Location'
      checkCurrentLocation('current_location')
    }
    const checkFields = (val) => {
      switch (val) {
        case 'location':
          plan.value = ''
          EIN.value = ''
          searchText.value = ''
          filterPlans.value = []
          filterSchools.value = []
          filterIndividual.value = []
          filterMunicipalties.value = []
          filterChurches.value = []
          filterTaxExempt.value = []
          break
        case 'radius':
          plan.value = ''
          EIN.value = ''
          if (zipcode.value === 'Current Location') {
            getCurrentLocation()
          } else {
            zipcodeError.value = true
            zipcodeErrorMsg.value = 'Location could not be determined'
          }
          break
        default:
          break
      }
    }
    const getTypeWiseData = (val) => {
      if (val === 'participationRates') {
        profitEntityType.value = 0
      } else if (val === 'compliance') {
        profitEntityType.value = 1
      } else if (val === 'lowReturn') {
        profitEntityType.value = 2
      } else {
        profitEntityType.value = 3
      }
    }
    const getEntityType = () => {
      getLowParticipation()
      GetProspectResultCompliance()
      getLowReturnPlan()
      getBenchmark()
      componentRefresh.value += 1
    }
    const getCustomerType = () => {
      if (prospectTab.value !== 0) {
        PlanResult.value = []
        store.state.marketInsight.PlanResult = []
        store.state.marketInsight.WidgetName = ''
        store.state.marketInsight.TotalCount = 0
        componentRefresh.value += 1
      } else {
        getProfitEntityType()
      }
    }
    const getProfitEntityType = () => {
      if (profitEntityType.value === 0) {
        PlanResult.value = lowParticipationData.value
        store.state.marketInsight.TotalCount = lowParticipationData.value ? lowParticipationData.value.length : 0
        store.state.marketInsight.PlanResult = lowParticipationData.value
        store.state.marketInsight.WidgetName = 'participationRates'
      } else if (profitEntityType.value === 1) {
        PlanResult.value = prospectPlanData.value
        store.state.marketInsight.TotalCount = prospectPlanData.value ? prospectPlanData.value.length : 0
        store.state.marketInsight.PlanResult = prospectPlanData.value
        store.state.marketInsight.WidgetName = 'compliance'
      } else if (profitEntityType.value === 2) {
        PlanResult.value = lowReturnsData.value
        store.state.marketInsight.TotalCount = lowReturnsData.value ? lowReturnsData.value.length : 0
        store.state.marketInsight.PlanResult = lowReturnsData.value
        store.state.marketInsight.WidgetName = 'lowReturn'
      } else {
        PlanResult.value = benchmarkPlanData.value
        store.state.marketInsight.TotalCount = benchmarkPlanData.value ? benchmarkPlanData.value.length : 0
        store.state.marketInsight.PlanResult = benchmarkPlanData.value
        store.state.marketInsight.WidgetName = 'benchmark'
      }
    }
    watch(
      () => PlanResult.value,
      () => {
        finalPlanResultData.value = store.state.marketInsight.PlanResult
        totalCount.value = store.state.marketInsight.TotalCount
        WidgetName.value = store.state.marketInsight.WidgetName
        componentRefresh.value += 1
      },
      { immediate: true }
    )
    watch(
      () => businessType.value,
      () => {
        if (!showEmployerSponsored.value) {
          var hideEmployeeSponsored = businessType.value.findIndex((a) => a.value === 1)
          if (hideEmployeeSponsored > -1) businessType.value.splice(hideEmployeeSponsored, 1)
        }
        if (!showSchool.value) {
          var hideSchool = businessType.value.findIndex((a) => a.value === 2)
          if (hideSchool > -1) businessType.value.splice(hideSchool, 1)
        }
        if (!showMunicipalities.value) {
          var hideMunicipalities = businessType.value.findIndex((a) => a.value === 3)
          if (hideMunicipalities > -1) businessType.value.splice(hideMunicipalities, 1)
          var hideChurch = businessType.value.findIndex((a) => a.value === 4)
          if (hideChurch > -1) businessType.value.splice(hideChurch, 1)
          var hideTaxExempt = businessType.value.findIndex((a) => a.value === 5)
          if (hideTaxExempt > -1) businessType.value.splice(hideTaxExempt, 1)
        }
        sponsorList.value = businessType.value.slice(0)
      },
      { deep: true, immediate: true }
    )
    onMounted(() => {
      if (Object.keys(route.params).length > 0) {
        type.value = route.params.type ? route.params.type : ''
        WidgetName.value = route.params.WidgetName ? route.params.Widge : ''
      }
      if (Object.keys(store.state.marketInsight).length > 0) {
        zipcode.value = store.state.marketInsight.zipcode
        searchRadius.value = store.state.marketInsight.searchRadius
        PlanResult.value = store.state.marketInsight.PlanResult ? store.state.marketInsight.PlanResult : []
        lowReturnsData.value = store.state.marketInsight.lowReturnsResult ? store.state.marketInsight.lowReturnsResult : []
        lowParticipationData.value = store.state.marketInsight.LowParticipationResult
          ? store.state.marketInsight.LowParticipationResult
          : []
        benchmarkPlanData.value = store.state.marketInsight.benchmarkPlanResult
          ? store.state.marketInsight.benchmarkPlanResult
          : []
        prospectPlanData.value = store.state.marketInsight.prospectPlanResult ? store.state.marketInsight.prospectPlanResult : []
      }
      //PlanResult.value = store.state.marketInsight.PlanResult
      getTypeWiseData(WidgetName.value)
      checkCurrentLocation('search')
    })
    return {
      showSearch,
      radiusList,
      radius,
      zipcode,
      zipcodeError,
      zipcodeErrorMsg,
      showZipCodeText,
      profitEntityType,
      profitEntityTypeList,
      breadCrumb,
      searchRadius,
      prospectTab,
      WidgetName,
      totalCount,
      sponsorList,
      showLoader,
      checkCurrentLocation,
      PlanResult,
      clearReset,
      maskAllow,
      checkFields,
      getCustomerType,
      loadMarketInsightPlans,
      getCurrentLocation,
      getProfitEntityType,
      showEmployerSponsored,
      showSchool,
      finalPlanResultData,
      showIndividual,
      lowestReturnPlans,
      LowParticipationResult,
      store,
      $vuetify,
      router,
      display
    }
  }
}
</script>
<style scoped>
.font_20 {
  font-size: 2.125rem !important;
}
</style>
