<template>
  <v-card class="elevation-3" height="100%" min-height="600px">
    <Loader :loading-text="`Loading results..`" :loading="showPlanLoader" />
    <v-col class="pa-5">
      <v-col class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="6" sm="6" lg="6" xl="6" xs="12" class="pa-0">
            <h3 class="font_24" :class="theme.dark ? '' : 'text-black'">Prospect Pipeline</h3>
          </v-col>
          <v-col v-if="showEmployerSponsored && showIndividuals" cols="12" md="6" sm="6" lg="6" xl="6" xs="12" class="pa-0">
            <v-tabs
              v-if="!display.xs.value"
              v-model="tab"
              align-tabs="end"
              class="notificationMenu"
              slider-color="completedBackground"
            >
              <v-tab v-for="item in items" :key="item.text" :class="theme.dark ? 'text-white' : 'text-hyperlink'">
                {{ item.text }}
              </v-tab>
            </v-tabs>
            <v-tabs v-if="display.xs.value" v-model="tab" center class="notificationMenu" slider-color="completedBackground">
              <v-tab v-for="item in items" :key="item.text" :class="theme.dark ? 'text-white' : 'text-hyperlink'">
                {{ item.text }}
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="tab == 0 && showEmployerSponsored && !showPlanLoader" class="pa-0">
        <ViewPlans
          :for-profit-data="forProfitData"
          :total-a-u-m-for-plans="totalAUMForPlans"
          :show-plan-loader="showPlanLoader"
        />
      </v-col>
      <v-col v-if="tab == 1 && showIndividuals && !showPlanLoader" class="pa-0">
        <ViewParticipants
          :participant-data="participantData"
          :total-a-u-m-for-individuals="totalAUMForIndividuals"
          :show-plan-loader="showPlanLoader"
        />
      </v-col>
    </v-col>
  </v-card>
</template>
<script>
import qs from 'qs'
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import ViewPlans from '@/components/Home/Acquisition/ProspectPipeline/ViewPlans'
import ViewParticipants from '@/components/Home/Acquisition/ProspectPipeline/ViewParticipants'
import Loader from '@/components/NewLoader'
// import { eventBus } from '@/main'
export default {
  components: {
    ViewPlans,
    ViewParticipants,
    Loader
  },
  setup() {
    const instance = getCurrentInstance()
    const display = useDisplay()
    const theme = useTheme()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const showPlanLoader = ref(false)
    const tab = ref(0)
    const items = ref([
      {
        text: 'View Plans',
        value: 'View Plans',
        disable: true,
        show: true
      },
      {
        text: 'View Participants',
        value: 'View Participants',
        disable: true,
        show: true
      }
    ])
    const forProfitData = ref([])
    const participantData = ref([])
    const totalAUMForPlans = ref(0)
    const totalAUMForIndividuals = ref(0)
    const totalFinalAUM = ref(0)
    const forProfitDataList = ref([])
    const participantDataList = ref([])
    const getDetails = () => {
      showPlanLoader.value = true
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
      $axios
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
          if (success.data.d && success.data.d.length > 0) {
            forProfitData.value = success.data.d
            forProfitData.value.forEach((element) => {
              totalAUMForPlans.value = totalAUMForPlans.value + element.Assets
            })
            $store.state.pipelineList.forProfitData = success.data.d
            //totalAUM.value = totalAUMForPlans.value
            showPlanLoader.value = false
          }
        })
        .catch(() => {
          showPlanLoader.value = false
        })
    }
    const getProspectIndivualData = () => {
      showPlanLoader.value = true
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
      $axios
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
          participantData.value = success.data.d.length > 0 ? success.data.d : []
          participantData.value.forEach((element) => {
            totalAUMForIndividuals.value = totalAUMForIndividuals.value + element.Assets
          })
          $store.state.pipelineList.participantData = success.data.d.length > 0 ? success.data.d : []
          //totalAUM.value = totalAUMForIndividuals.value
          showPlanLoader.value = false
        })
        .catch(() => {
          showPlanLoader.value = false
        })
    }
    const callCardDisplay = () => {
      if (
        forProfitDataList.value &&
        forProfitDataList.value.length === 0 &&
        participantDataList.value &&
        participantDataList.value.length === 0
      ) {
        instance.emit('callPipelineCardDisplay', false)
      } else {
        instance.emit('callPipelineCardDisplay', true)
      }
    }
    const fontSize = computed(() => {
      // return root.$children[0].fontsize
      return 8
    })
    const cardHeightWithFontSize = computed(() => {
      // var fontSize = root.$children[0].fontsize
      var fontSize = 8
      if (Number(fontSize) === 8) {
        if (display.xs.value) {
          return '70.5em'
        } else {
          return '58.5em'
        }
      }
      if (Number(fontSize) === 9) {
        if (display.xs.value) {
          return '64.5em'
        } else {
          return '53.5em'
        }
      }
      if (Number(fontSize) === 10) {
        if (display.xs.value) {
          return '60.5em'
        } else {
          return '50.5em'
        }
      }
      if (Number(fontSize) === 11) {
        if (display.xs.value) {
          return '58em'
        } else {
          return '48em'
        }
      }
      if (Number(fontSize) === 12) {
        if (display.xs.value) {
          return '55.5em'
        } else {
          return '46em'
        }
      }
      if (Number(fontSize) === 13) {
        if (display.xs.value) {
          return '53.5em'
        } else {
          return '44.5em'
        }
      }
      if (Number(fontSize) === 14) {
        if (display.xs.value) {
          return '51.5em'
        } else {
          return '42.5em'
        }
      }
      if (Number(fontSize) === 15) {
        if (display.xs.value) {
          return '50em'
        } else {
          return '40.5em'
        }
      }
      if (Number(fontSize) === 16) {
        if (display.xs.value) {
          return '49em'
        } else {
          return '40.5em'
        }
      } else return '44.5em'
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
    const showMunicipalities = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Municipalities
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Municipalities
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Municipalities
          )
        )
      } else return true
    })
    watch(
      () => $store.state.pipelineList.forProfitData,
      () => {
        forProfitDataList.value = $store.state.pipelineList.forProfitData
        callCardDisplay()
      },
      { immediate: true, deep: true }
    )
    watch(
      () => $store.state.pipelineList.participantData,
      () => {
        participantDataList.value = $store.state.pipelineList.participantData
        callCardDisplay()
      },
      { immediate: true, deep: true }
    )
    onMounted(() => {
      getDetails()
      getProspectIndivualData()
      //mobileStepperDisplay()
      if (showEmployerSponsored.value && showIndividuals.value) {
        tab.value = 0
      } else if (showEmployerSponsored.value && !showIndividuals.value) {
        tab.value = 0
      } else if (!showEmployerSponsored.value && showIndividuals.value) {
        tab.value = 1
      } else {
        tab.value = 0
      }
    })
    return {
      theme,
      display,
      $authz,
      showPlanLoader,
      showEmployerSponsored,
      items,
      tab,
      forProfitData,
      totalAUMForPlans,
      showIndividuals,
      participantData,
      totalAUMForIndividuals,
      totalFinalAUM,
      fontSize,
      cardHeightWithFontSize,
      showSchool,
      showMunicipalities
    }
  }
}
</script>
<style scoped>
.completedBackground {
  background-color: rgb(var(--v-theme-accent)) !important;
}
</style>
