<template>
  <v-card
    class="elevation-3"
    :height="
      fontSize > 12
        ? isXsOnly
          ? ''
          : '38.462em'
        : fontSize > 10
          ? isXsOnly
            ? ''
            : '44em'
          : fontSize > 8
            ? isXsOnly
              ? ''
              : '53em'
            : fontSize === 8 && isXsOnly
              ? ''
              : '58.500em'
    "
  >
    <v-col v-if="showLoader" cols="12" lg="12" class="ma-0 pa-0">
      <v-progress-linear indeterminate color="accent" class="ma-0 pa-0" height="4" />
    </v-col>
    <v-col cols="12" class="pa-5">
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" class="pa-0"> <h6 class="text-h6 font_20 iconColor">Participant Information</h6> </v-col>
          </v-row>
        </v-col>
        <v-col class="pa-0" v-if="!showLoader && !showParticipantError">
          <v-col v-if="clientInformationData.length > 0" cols="12" class="pa-0">
            <IndividualClientInfoWidget
              :key="componentKey"
              :individualClientDetails="clientInformationData"
              :liveWidth="screenResize"
            />
          </v-col>
          <v-col v-else cols="12" class="pa-0">
            <NoDataWidget
              :totalPlan="clientInformationData.length ? clientInformationData.length : 0"
              :displayText="''"
              :percentValueRequired="1"
              :type="typeDetails"
              :liveWidth="screenResize"
              divId="individualNoDataWidget"
            />
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-card class="elevation-0 progressbackground theme--light">
              <v-layout class="c_position">
                <v-col cols="6" class="c_flex text-center pa-0">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <h3 v-bind="props" class="font-weight-bold text-accent">Total Participants</h3>
                    </template>
                    <span
                      >This includes eligible and ineligible participants,<br />
                      termed participants and participants with <br />
                      and without an account balance.</span
                    >
                  </v-tooltip>
                  <h2 class="mb-0 font-weight-bold">
                    {{ formatNumber(clientInformationData[0] ? clientInformationData[0].Number : 0, 'decimal', 0) }}
                  </h2>
                </v-col>
                <v-col cols="6" class="c_flex text-center pa-0">
                  <h3 class="font-weight-bold text-accent">Auto Enrolled Plans</h3>
                  <h2 class="mb-0 font-weight-bold">
                    {{ formatNumber(clientInformationData[0] ? clientInformationData[0].PLANS_AEY : 0, 'decimal', 0) }}
                  </h2>
                </v-col>
              </v-layout>
            </v-card>
          </v-col>
          <v-col :class="isXsOnly ? 'text-center' : ''" class="pa-0">
            <v-col :class="[fontSize > 14 && xlOnly ? 'pt-1 pl-0 pr-0 pb-0' : 'pt-3 pl-0 pr-0 pb-0']">
              <v-row>
                <v-col class="pa-0 text-left" cols="8">
                  <h4 class="font-weight-medium iconColor">
                    <b>Total Active Participants</b>
                  </h4>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <h4 class="font-weight-medium text-right">
                    <b>{{ formatNumber(clientInformationData[3] ? clientInformationData[3].Number : 0, 'decimal', 0) }}</b>
                  </h4>
                </v-col>
              </v-row>
            </v-col>
            <v-col :class="[fontSize > 14 && xlOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-3 pb-0 pl-0 pr-0']">
              <v-row>
                <v-col class="pa-0 text-left" cols="8">
                  <h4 class="font-weight-medium iconColor">
                    <b>Total Participants w/ Balances</b>
                  </h4>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <h4 class="font-weight-medium text-right">
                    <b>{{ formatNumber(clientInformationData[1] ? clientInformationData[1].Number : 0, 'decimal', 0) }}</b>
                  </h4>
                </v-col>
              </v-row>
            </v-col>
            <v-col :class="[fontSize > 14 && xlOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-3 pb-0 pl-0 pr-0']">
              <v-row>
                <v-col class="pa-0 text-left" cols="8">
                  <h4 class="font-weight-medium iconColor">
                    <b>Termed Participants w/ Balances</b>
                  </h4>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <h4 class="font-weight-medium text-right">
                    <b>{{ formatNumber(clientInformationData[2] ? clientInformationData[2].Number : 0, 'decimal', 0) }}</b>
                  </h4>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col
            xs12
            class="text-right"
            :class="[isSmOnly ? 'pt-6 pb-1 pl-0 pr-0' : smAndUp ? 'widgetButtonPosition pr-1' : 'pt-6 pb-1 pl-0 pr-0']"
          >
            <v-btn
              class="mr-0"
              :disabled="clientInformationData ? clientInformationData.length === 0 : ''"
              :class="isXsOnly ? 'mb-0' : ''"
              color="accent"
              @click="navigateToPage('/Retention/Plans')"
            >
              View Individuals
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>
<script>
import IndividualClientInfoWidget from '@/components/Home/ClientManagement/IndividualClientInfoWidget'
import NoDataWidget from '@/components/Home/NoDataWidget'
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, inject, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import qs from 'qs'
export default {
  components: {
    IndividualClientInfoWidget,
    NoDataWidget
  },
  props: ['liveWidth'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const componentKey = ref(0)
    const clientInformationData = ref([])
    const showLoader = ref(false)
    const showParticipantError = ref(false)
    const typeDetails = ref('Others')
    const isXsOnly = ref(false)
    const xlOnly = ref(false)
    const isSmOnly = ref(false)
    const smAndUp = ref(false)
    const router = useRouter()
    const screenResize = ref(props.liveWidth)

    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      xlOnly.value = display.xl.value
      isSmOnly.value = display.sm.value
      smAndUp.value = display.smAndUp.value
      screenResize.value = props.liveWidth
    })
    //mounted
    onMounted(() => {
      if (Object.keys($store.state.globalFilter).length === 0) {
        showLoader.value = true
        showParticipantError.value = false
        if ($store.state.user.reliusLoginId) {
          $store
            .dispatch('getParticipantsData')
            .then(() => {
              if ($store.state.participantChange.message) {
                showLoader.value = false
                showParticipantError.value = true
                clientInformationData.value = []
              } else {
                clientInformationData.value = $store.state.participantChange
                showLoader.value = false
                showParticipantError.value = false
                let clientInformationList = clientInformationData.value.filter((a) => a.PARTICRATE > 0)
                if (clientInformationList.length === 0) clientInformationData.value = []
              }
            })
            .catch(() => {
              showParticipantError.value = false
              showLoader.value = false
              clientInformationData.value = []
            })
        } else {
          showParticipantError.value = false
          showLoader.value = false
          clientInformationData.value = []
        }
      } else {
        getIndividualsData()
      }

      eventBus.on('filterGlobalData', () => {
        getIndividualsData()
      })
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })
    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
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
    const showIndividual = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Individuals
          ) ||
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Municipalities
          ) ||
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          )
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          ($authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Individuals
          ) &&
            $authz.allowedByAccount(
              $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              $authz.typeOfBusiness.Individuals
            )) ||
          ($authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Municipalities
          ) &&
            $authz.allowedByAccount(
              $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              $authz.typeOfBusiness.Municipalities
            )) ||
          ($authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
            $authz.allowedByAccount(
              $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              $authz.typeOfBusiness.Schools
            ))
        )
      } else return true
    })

    function navigateToPage(value) {
      if (value) {
        $store.state.clientPlan.prospectValue = 3
        router.push(value).catch(() => {})
      }
    }
    async function getIndividualsData() {
      var rbcParticipantData = []
      var tsmParticipantData = []
      var promises = []
      showLoader.value = true
      showParticipantError.value = false
      var accountId = []
      var contactId = []
      if (Object.keys($store.state.globalFilter).length > 0) {
        if ($store.state.globalFilter.firm && $store.state.globalFilter.firm.length > 0) {
          accountId = $store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if ($store.state.globalFilter.advisor && $store.state.globalFilter.advisor.length > 0) {
          contactId = $store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      if ($store.state.user.reliusLoginId) {
        promises.push(
          $axios
            .get(`/api/v1/retention/rbc/participation/0`, {
              params: {
                accountId: accountId,
                advisorContactId: contactId
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              }
            })
            .then((success) => {
              if (success.data.d !== null && success.data.d.length > 0) {
                rbcParticipantData = success.data.d
              }
            })
        )
      }
      if ($store.state.user.tsmLoginId !== null && $store.state.user.tsmLoginId !== '') {
        promises.push(
          $axios.get(`/api/v1/retention/tsm/participation/0`).then((success) => {
            if (success.data.d !== null && success.data.d.length > 0) {
              tsmParticipantData = success.data.d
            }
          })
        )
      }

      const result = await Promise.allSettled(promises)
      var successParticipantCount = result.filter((x) => x.status === 'fulfilled')
      if (successParticipantCount.length === 0) {
        showLoader.value = false
        showParticipantError.value = true
        clientInformationData.value = []
      } else {
        if (rbcParticipantData.length > 0 && tsmParticipantData.length > 0) {
          rbcParticipantData.forEach((element, index) => {
            element.Number = element.Number + tsmParticipantData[index].Number
          })
          clientInformationData.value = rbcParticipantData
        } else if (rbcParticipantData.length === 0 && tsmParticipantData.length > 0) {
          clientInformationData.value = tsmParticipantData
        } else {
          clientInformationData.value = rbcParticipantData
        }
        showLoader.value = false
        showParticipantError.value = false
        let clientInformationList = clientInformationData.value.filter((a) => a.PARTICRATE > 0)
        if (clientInformationList.length === 0) clientInformationData.value = []
      }
    }
    function formatNumber(value, type, decimal) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: type,
        currency: 'USD',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      })
      return formatter.format(value)
    }

    return {
      componentKey,
      clientInformationData,
      showLoader,
      showParticipantError,
      typeDetails,
      fontSize,
      isXsOnly,
      xlOnly,
      isSmOnly,
      smAndUp,
      showEmployerSponsored,
      showSchool,
      showIndividual,
      screenResize,
      getIndividualsData,
      navigateToPage,
      formatNumber
    }
  }
}
</script>
<style scoped>
.c_flex_auto {
  flex: unset !important;
}
.c_flex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 10px;
}
</style>
