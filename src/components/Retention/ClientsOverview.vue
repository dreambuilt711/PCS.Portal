<template>
  <v-col class="pa-2">
    <v-col class="pa-0">
      <h1 class="font-weight-medium">Client - Dashboard</h1>
    </v-col>
    <v-col class="planButton mt-3 pa-0" cols="12" md="6" sm="7" lg="5">
      <v-row>
        <v-col
          v-if="showEmployerSponsored"
          cols="3"
          class="pa-0"
          :class="['divFinderOptions border_right_2_light', isEmpSponsorCheck ? 'border_bottom_accent' : '']"
        >
          <v-row>
            <v-col cols="12" class="pa-0">
              <v-row>
                <v-checkbox
                  v-model="isEmpSponsorCheck"
                  color="accent"
                  size="small"
                  hide-details
                  class="ma-0 pa-0 flex_none"
                  :ripple="false"
                />
                <v-col
                  class="mt-2"
                  :class="[
                    isEmpSponsorCheck ? '' : 'disableButtonDiv',
                    isXlOnly ? 'pl-4 ml-4 pb-0 pt-0 pr-0' : !smAndDown ? 'pl-1 ml-3 pb-0 pt-0 pr-0' : 'ml-2 pa-0'
                  ]"
                >
                  <customicon type="employeeSponsor" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" :class="[isEmpSponsorCheck ? '' : 'disableButtonDiv', 'text-center pa-0']">
              <h5 v-if="isXsOnly" class="font-weight-medium pb-1 text-accent">Employer Sponsor</h5>
              <h4 v-else class="font-weight-medium font_12 pb-1 text-accent">Employer Sponsor</h4>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="showSchool"
          cols="3"
          :class="['divFinderOptions border_right_2_light', isSchoolCheck ? 'border_bottom_accent' : '', 'pa-0']"
        >
          <v-row>
            <v-col cols="12" class="pa-0">
              <v-row>
                <v-checkbox
                  v-model="isSchoolCheck"
                  color="accent"
                  size="small"
                  hide-details
                  class="ma-0 pa-0 flex_none"
                  :ripple="false"
                />
                <v-col
                  class="mt-2"
                  :class="[
                    isSchoolCheck ? '' : 'disableButtonDiv',
                    isXlOnly ? 'pl-4 ml-4 pb-0 pt-0 pr-0' : !smAndDown ? 'pl-1 ml-3 pb-0 pt-0 pr-0' : 'ml-2 pa-0'
                  ]"
                >
                  <customicon type="schoolIcon" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" :class="[isSchoolCheck ? '' : 'disableButtonDiv', 'text-center pa-0']">
              <h5 v-if="isXsOnly" class="font-weight-medium pb-1 text-accent">Schools</h5>
              <h4 v-else class="font-weight-medium font_12 pb-1 text-accent">Schools</h4>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="showMunicipalities"
          cols="3"
          :class="['divFinderOptions border_right_2_light', isMunicipalitiesCheck ? 'border_bottom_accent' : '', 'pa-0']"
        >
          <v-row>
            <v-col cols="12" class="pa-0">
              <v-row>
                <v-checkbox
                  v-model="isMunicipalitiesCheck"
                  color="accent"
                  hide-details
                  size="small"
                  class="ma-0 pa-0 flex_none"
                  :ripple="false"
                />
                <v-col
                  class="mt-2"
                  :class="[
                    isMunicipalitiesCheck ? '' : 'disableButtonDiv',
                    isXlOnly ? 'pl-4 ml-4 pt-0 pb-0 pr-0' : !smAndDown ? 'pl-1 ml-3  pt-0 pb-0 pr-0' : 'ml-2 pa-0'
                  ]"
                >
                  <customicon type="adminIcon" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" :class="[isMunicipalitiesCheck ? '' : 'disableButtonDiv', 'text-center pa-0']">
              <h5 v-if="isXsOnly" class="font-weight-medium pb-1 text-accent">Municipalities</h5>
              <h4 v-else class="font-weight-medium font_12 pb-1 text-accent">Municipalities</h4>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="pl-1 pt-3 pb-0 pr-0">
      <h2 class="font-weight-medium">Overview</h2>
    </v-col>
    <v-col class="mt-2 pa-0">
      <v-row>
        <v-col
          v-for="(item, index) in totalClientList"
          :key="index"
          class="mt-2 pa-0"
          :cols="isXsOnly ? '6' : ''"
          :sm="isSmOnly ? '3' : ''"
          :md="isMdOnly ? '3' : ''"
          :class="[
            isXsOnly ? (index % 2 === 0 ? 'pr-2' : '') : '',
            isSmOnly ? ((index + 1) % 4 === 0 ? '' : 'pr-2') : '',
            isMdOnly ? ((index + 1) % 4 === 0 ? '' : 'pr-2') : '',
            lgAndUp ? (index !== 0 ? 'pl-2 classForLarge' : 'classForLarge') : ''
          ]"
        >
          <v-card height="100" class="elevation-6">
            <v-col cols="12" class="fixHeightFlex pa-2">
              <span>
                <h3 class="font-weight-medium">{{ item.text }}</h3>
              </span>
            </v-col>
            <v-col cols="12" class="ml-3 pb-1 pt-0 pl-0 pr-0">
              <v-row>
                <v-col class="flex_none pa-0">
                  <h2 class="font-weight-medium">
                    {{ item.count }}
                  </h2>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>

<script>
import customicon from '@/components/CustomIcon'
import qs from 'qs'
import { ref, onMounted, getCurrentInstance, inject, watchEffect, computed, watch, onBeforeUnmount } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  components: {
    customicon
  },
  props: ['userRole'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const participant = ref([])
    const assets = ref([])
    const isIndividualFinderCheck = ref(false)
    const isMunicipalitiesCheck = ref(false)
    const isSchoolCheck = ref(false)
    const isEmpSponsorCheck = ref(false)
    const isXsOnly = ref(false)
    const isSmOnly = ref(false)
    const isMdOnly = ref(false)
    const lgAndUp = ref(false)
    const isXlOnly = ref(false)
    const smAndDown = ref(false)
    const planCount = ref(0)
    const userRoleValue = ref(props.userRole)
    const totalClientsData = ref([
      {
        text: 'Total Firms',
        count: 0,
        value: 'TotalFirms',
        show: true
      },
      {
        text: 'Total Advisor',
        count: 0,
        value: 'TotalAdvisors',
        show: true
      },
      {
        text: 'Total Assets Managed',
        count: 0,
        value: 'TotalAssets',
        show: true
      },
      {
        text: 'Total Employer Sponsor Plans',
        count: 0,
        value: 'TotalPlans',
        show: true
      },
      {
        text: 'Total Revenue',
        count: 0,
        value: 'TotalRevenue',
        show: true
      },
      {
        text: 'Total Plan Participants',
        count: 0,
        value: 'TotalPPTs',
        show: true
      },
      {
        text: 'Total School Districts',
        count: 0,
        value: 'TotalSchool',
        show: true
      },
      {
        text: 'Total Individual Accounts',
        count: 0,
        value: 'TotalIndividual',
        show: true
      }
    ])

    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
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
        return $authz.allowedByAccount(
          $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
          $authz.typeOfBusiness.Schools
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
        return $authz.allowedByAccount(
          $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        )
      } else return true
    })
    const showIndividuals = computed(() => {
      return false
    })
    const totalClientList = computed(() => {
      return totalClientsData.value.filter((d) => d.show === true)
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
        return $authz.allowedByAccount(
          $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
          $authz.typeOfBusiness.Municipalities
        )
      } else return true
    })

    //method
    function currencyConvert(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
        : // Six Zeroes for Millions
          Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
          : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : Math.abs(Number(labelValue))
    }
    function getClientOverViewValue() {
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
        $axios
          .get(`/api/v1/rbc/clientoverview`, {
            params: {
              accountId: accountId,
              advisorContactId: contactId
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' })
            }
          })
          .then((success) => {
            $store.state.clientOverview = success.data.d
          })
      }
    }
    //mounted
    onMounted(() => {
      if ($store.state.user.reliusLoginId) {
        $store.dispatch('getParticipantsData')
      }
      $store.dispatch('getRbcTotalAssetsAndModels')
      isEmpSponsorCheck.value = showEmployerSponsored.value ? $store.state.isEmpSponsorCheck : false
      isSchoolCheck.value = showSchool.value ? $store.state.isSchoolCheck : false
      isMunicipalitiesCheck.value = showMunicipalities.value ? $store.state.isMunicipalitiesCheck : false
      isIndividualFinderCheck.value = showIndividuals.value ? $store.state.isIndividualFinderCheck : false

      $store.dispatch('getClientOverview')
      // eslint-disable-next-line no-unused-vars
      eventBus.on('filterGlobalData', (data) => {
        getClientOverViewValue()
      })
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      isSmOnly.value = display.sm.value
      isMdOnly.value = display.md.value
      lgAndUp.value = display.lgAndUp.value
      isXlOnly.value = display.xl.value
      smAndDown.value = display.smAndDown.value
    })
    watch(
      $store.state.clientOverview,
      () => {
        if ($store.state.clientOverview.length > 0) {
          var list = ['TotalFirms', 'TotalAdvisors', 'TotalProduct', 'TotalAssets', 'TotalPlans', 'TotalPPTs']
          for (var i = 0; i < list.length; i++) {
            var index = totalClientsData.value.findIndex((a) => a.value === list[i])
            if (index > -1) {
              if (list[i] === 'TotalAssets') {
                totalClientsData.value[index].count = $store.state.clientOverview[0][list[i]]
                  ? `$${currencyConvert($store.state.clientOverview[0][list[i]])}` //added double dollar first for showing dollar sign and second is for concatenation
                  : 0
              } else {
                totalClientsData.value[index].count = $store.state.clientOverview[0][list[i]]
                  ? new Intl.NumberFormat().format($store.state.clientOverview[0][list[i]])
                  : 0
              }
            }
          }
        }
      },
      { immediate: true },
      { deep: true }
    )
    watch(
      userRoleValue,
      () => {
        if (
          $authz.hasRole($authz.roles.Advisor) ||
          $authz.hasRole($authz.roles.Strategist) ||
          $authz.hasRole($authz.roles.Fiduciary338)
        ) {
          totalClientsData.value[0].show = false
          totalClientsData.value[1].show = false
        } else if ($authz.hasRole($authz.roles.FirmAdmin)) {
          totalClientsData.value[0].show = false
        }
      },
      { immediate: true }
    )
    watch(showEmployerSponsored, (val) => {
      isEmpSponsorCheck.value = val
    })
    watch(showIndividuals, (val) => {
      isIndividualFinderCheck.value = val
    })
    watch(showMunicipalities, (val) => {
      isMunicipalitiesCheck.value = val
    })
    watch(showSchool, (val) => {
      isSchoolCheck.value = val
    })
    watch(
      isEmpSponsorCheck,
      (val) => {
        var index = totalClientsData.value.findIndex((a) => a.value === 'TotalPlans')
        var revenue = totalClientsData.value.findIndex((a) => a.value === 'TotalRevenue')
        if (index > -1) {
          totalClientsData.value[index].show = val ? true : false
        }
        if (revenue > -1) {
          totalClientsData.value[revenue].show = val && totalClientsData.value[revenue].count > 0 ? true : false
        }
        emit('empSponsorCheck', val)
      },
      { immediate: true },
      { deep: true }
    )
    watch(
      isSchoolCheck,
      (val) => {
        var index = totalClientsData.value.findIndex((a) => a.value === 'TotalSchool')
        if (index > -1) {
          totalClientsData.value[index].show = val && totalClientsData.value[index].count > 0 ? true : false
        }
        emit('schoolCheck', val)
      },
      { immediate: true },
      { deep: true }
    )
    watch(
      isMunicipalitiesCheck,
      (val) => {
        emit('muncipaltiesCheck', val)
      },
      { immediate: true },
      { deep: true }
    )
    watch(
      isIndividualFinderCheck,
      (val) => {
        var index = totalClientsData.value.findIndex((a) => a.value === 'TotalIndividual')
        if (index > -1) {
          totalClientsData.value[index].show = val && totalClientsData.value[index].count > 0 ? true : false
        }
        emit('individualsCheck', val)
      },
      { immediate: true },
      { deep: true }
    )

    return {
      totalClientsData,
      participant,
      planCount,
      assets,
      isIndividualFinderCheck,
      isMunicipalitiesCheck,
      isSchoolCheck,
      isEmpSponsorCheck,
      isXsOnly,
      isSmOnly,
      isMdOnly,
      lgAndUp,
      isXlOnly,
      smAndDown,
      fontSize,
      showSchool,
      showEmployerSponsored,
      showIndividuals,
      showMunicipalities,
      totalClientList,
      getClientOverViewValue,
      currencyConvert,
      userRoleValue
    }
  }
}
</script>
<style scoped>
.border_right_2_light {
  border-right: 2px solid #f3f3f3 !important;
}
.border_right_2_dark {
  border-right: 2px solid #303030 !important;
}
.border_bottom_accent {
  border-bottom-color: rgb(var(--v-theme-accent)) !important;
}
.border_bottom_dark {
  border-bottom-color: #ffffff !important;
}
.divFinderOptions {
  text-transform: uppercase !important;
  background-color: white;
  border-bottom-width: 4px;
  border-bottom-style: solid;
  border-bottom-color: #ffffff;
}
.divFinderOptionsForDark {
  text-transform: uppercase !important;
  background-color: #424242;
  border-bottom-width: 4px;
  border-bottom-style: solid;
  border-bottom-color: #424242;
}
.theme--dark.v-divider {
  border-color: rgba(255, 255, 255, 1);
}
.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0.42);
}
.classForLarge {
  width: 130px !important;
}
.fixHeightFlex {
  height: 60% !important;
}
</style>
