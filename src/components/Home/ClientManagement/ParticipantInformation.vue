<template>
  <v-col class="pa-0">
    <v-col md="12" sm="12" cols="12" lg="12" xl="12" class="pa-0">
      <v-card class="elevation-3" height="100%" :min-height="xsOnly ? '870px' : '600px'" :class="showLoader ? 'pa-0' : ' pa-5'">
        <v-col v-if="showLoader" cols="12" lg="12" class="ma-0 pa-0">
          <v-progress-linear v-if="showLoader" indeterminate color="accent" height="4" class="ma-0" />
        </v-col>
        <v-col v-if="!showLoader" cols="12" class="pa-0">
          <v-col :class="width > 1399 ? 'pb-4 pt-0 pl-0 pr-0' : 'pa-0'">
            <v-row>
              <v-col cols="12" class="pa-0">
                <v-row :align="center">
                  <h2 class="font_24">Participants</h2>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-row>
              <v-col
                v-if="contributionOverviewData.length > 0 && enrollmentOverview.length > 0"
                xl="5"
                lg="6"
                md="6"
                sm="6"
                cols="12"
                class="pa-0"
              >
                <v-row>
                  <IndividualContributionOverviewWidget
                    :key="componentKey"
                    :liveWidth="screenResize"
                    :individualClientDetails="contributionOverviewData"
                    :donutCenterCountData="enrollmentOverview"
                  />
                </v-row>
              </v-col>
              <v-col v-else xl="5" lg="6" md="6" sm="6" cols="12" class="pa-0">
                <NoDataWidget
                  :liveWidth="screenResize"
                  :totalPlan="contributionOverviewData.length ? contributionOverviewData.length : 0"
                  :displayText="''"
                  :percentValueRequired="1"
                  :type="typeDetails"
                  divId="contributionOverviewNoDataWidget"
                />
              </v-col>
              <v-col xl="7" lg="6" md="6" sm="6" cols="12" class="pa-0">
                <v-col :class="width > 1399 ? 'pt-2  pl-0 pr-0 pb-0' : xsOnly ? 'pa-0' : 'pt-4 pl-0 pr-0 pb-0'">
                  <h3 class="font-weight-medium">Participant Contribution Overview</h3>
                </v-col>
                <v-col v-for="(item, i) in participantOverview" :key="i" class="flex_none mr-3 align-self-center pa-0">
                  <v-row v-if="item.section === 'Contribution'" class="align-self-center pt-4" no-gutters>
                    <template v-if="item.icon === 'progress'">
                      <v-progress-circular :model-value="item.count" :color="item.color" :width="10" :rotate="-90" />
                      <h3 class="font-weight-bold ml-2 mr-2 align-self-center">{{ parseFloat(item.count).toFixed(2) }}%</h3>
                      <h3 class="mr-2 align-self-center">
                        {{ item.name }}
                      </h3>
                    </template>
                    <template v-else>
                      <v-icon size="14" :color="item.color" class="mr-2 outlineIcon" :icon="item.icon"> </v-icon>
                      <v-col class="text-left zoomInEffect pl-3 pb-0 pr-0 pt-0">
                        <v-hover v-slot="{ hover }">
                          <h3>
                            <a
                              class="pl-2 text-hyperlink"
                              :class="[hover ? 'text-decoration-underline' : 'text-decoration-none']"
                              @click="viewDetailsWithFilter(item.name, item.section)"
                              >{{ item.name }} {{ ` (${formatNumber(item.count, 'decimal', 0)})` }}</a
                            >
                          </h3>
                        </v-hover>
                      </v-col>
                    </template>
                  </v-row>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="false" cols="12" class="pa-0">
            <v-row>
              <v-col
                v-if="enrollmentOverview.length > 0 && donutCenterCountData.length > 0"
                xl="5"
                lg="6"
                md="6"
                sm="6"
                cols="12"
                :class="width > 1399 ? 'pt-3 pb-0 pl-0 pr-0' : 'pa-0'"
              >
                <IndividualEnrollmentOverviewWidget
                  :key="componentKey"
                  :liveWidth="liveWidth"
                  :individualClientDetails="enrollmentOverview"
                  :donutCenterCountData="donutCenterCountData"
                />
              </v-col>
              <v-col v-else xl="5" lg="6" md="6" sm="6" cols="12" :class="width > 1399 ? 'pt-3 pb-0 pl-0 pr-0' : 'pa-0'">
                <NoDataWidget
                  :liveWidth="liveWidth"
                  :totalPlan="enrollmentOverview.length ? enrollmentOverview.length : 0"
                  :displayText="''"
                  :percentValueRequired="1"
                  :type="typeDetails"
                  divId="enrollmentOverviewNoDataWidget"
                />
              </v-col>
              <v-col xl="7" lg="6" md="6" sm="6" cols="12" :class="width > 1399 ? 'pt-3 pb-0 pl-0 pr-0' : 'pa-0'">
                <v-col :class="width > 1399 ? 'pt-4 pb-0 pl-0 pr-0' : xsOnly ? 'pa-0' : 'pt-6 pb-0 pl-0 pr-0'">
                  <h3 class="font-weight-medium">Participant Enrollment Overview</h3>
                </v-col>
                <v-col v-for="(item, i) in participantOverview" :key="i" class="flex_none mr-3 align-self-center pa-0">
                  <v-row v-if="item.section === 'Enrollment'" class="align-self-center pt-4" no-gutters>
                    <template v-if="item.icon === 'progress'">
                      <v-progress-circular :model-value="item.count" :color="item.color" :width="10" :rotate="-90" />
                      <h3 class="font-weight-bold ml-2 mr-2 align-self-center">{{ parseFloat(item.count).toFixed(2) }}%</h3>
                      <h3 class="mr-2 align-self-center">
                        {{ item.name }}
                      </h3>
                    </template>
                    <template v-else>
                      <v-icon size="14" :color="item.color" class="mr-2 outlineIcon" :icon="item.icon"> </v-icon>
                      <v-col class="text-left zoomInEffect pl-3 pt-0 pb-0 pr-0">
                        <v-hover v-slot="{ hover }">
                          <h3>
                            <a
                              class="pl-2 text-hyperlink"
                              :class="[hover ? 'text-decoration-underline' : 'text-decoration-none']"
                              @click="viewDetailsWithFilter(item.name, item.section)"
                              >{{ item.name }} {{ ` (${formatNumber(item.count, 'decimal', 0)})` }}</a
                            >
                          </h3>
                        </v-hover>
                      </v-col>
                    </template>
                  </v-row>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col :class="xsOnly ? 'text-center pt-6 pb-0 pl-0 pr-0' : 'pt-3 pb-0 pl-0 pr-0'">
            <v-col :class="[fontSize > 14 && xlOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pa-0']">
              <v-row>
                <v-col class="pa-0 text-left" cols="8">
                  <v-row class="pl-3">
                    <h3 class="text-hyperlink">
                      Total Participants
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" size="12" class="icon-information searchDoc" />
                        </template>
                        <span>
                          Total participant count includes eligible,<br />
                          ineligible, and termed participants with a balance</span
                        >
                      </v-tooltip>
                    </h3>
                  </v-row>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <h3 class="text-right">
                    {{ totalParticipant ? formatNumber(totalParticipant, 'decimal', 0) : 0 }}
                  </h3>
                </v-col>
              </v-row>
            </v-col>
            <v-col :class="[fontSize > 14 && xlOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-3 pb-0 pl-0 pr-0']">
              <v-row>
                <v-col class="pa-0 text-left" cols="8">
                  <v-row class="pl-3">
                    <h3 class="text-hyperlink">
                      Eligible Participants
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" size="12" class="icon-information searchDoc" />
                        </template>
                        <span>Total Active Participant count</span>
                      </v-tooltip>
                    </h3>
                  </v-row>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <h3 class="text-right">
                    {{ eligibleParticipant ? formatNumber(eligibleParticipant, 'decimal', 0) : 0 }}
                  </h3>
                </v-col>
              </v-row>
            </v-col>
            <v-col :class="[fontSize > 14 && xlOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-3 pb-0 pl-0 pr-0']">
              <v-row>
                <v-col class="pa-0 text-left" cols="8">
                  <v-row class="pl-3">
                    <h3 class="text-hyperlink">
                      Ineligible Participants
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" size="12" class="icon-information searchDoc" />
                        </template>
                        <span>Participants that are not eligible to <br />participate in retirement account</span>
                      </v-tooltip>
                    </h3>
                  </v-row>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <h3 class="text-right">
                    {{ ineligibleParticipant ? formatNumber(ineligibleParticipant, 'decimal', 0) : 0 }}
                  </h3>
                </v-col>
              </v-row>
            </v-col>
            <v-col :class="[fontSize > 14 && xlOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-3 pb-0 pl-0 pr-0']">
              <v-row>
                <v-col class="pa-0 text-left" cols="8">
                  <v-row class="pl-3">
                    <h3 class="text-hyperlink">
                      Termed Participants with a balance
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" size="12" class="icon-information searchDoc" />
                        </template>
                        <span
                          >Terminated Participant count<br />
                          with a balance</span
                        >
                      </v-tooltip>
                    </h3>
                  </v-row>
                </v-col>
                <v-col class="pa-0" cols="4">
                  <h3 class="text-right">
                    {{ termedParticipant ? formatNumber(termedParticipant, 'decimal', 0) : 0 }}
                  </h3>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col class="justify-start widgetLeftButtonPosition pa-0">
                <v-btn class="ml-0 text-capitalize" color="accent" @click="navigateToPage('/Retention/Participants')">
                  View Participants Overview
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-card>
    </v-col>
  </v-col>
</template>
<script>
import IndividualContributionOverviewWidget from '@/components/Home/ClientManagement/IndividualContributionOverviewWidget'
import IndividualEnrollmentOverviewWidget from '@/components/Home/ClientManagement/IndividualEnrollmentOverviewWidget'
import NoDataWidget from '@/components/Home/NoDataWidget'
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, inject, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  components: {
    IndividualContributionOverviewWidget,
    IndividualEnrollmentOverviewWidget,
    NoDataWidget
  },
  props: ['liveWidth'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const componentKey = ref(0)
    const contributionOverviewData = ref([])
    const enrollmentOverview = ref([])
    const showLoader = ref(false)
    const showParticipantError = ref(false)
    const participantOverview = ref([])
    const typeDetails = ref('ClientsParticipant')
    const donutCenterCountData = ref([])
    const totalParticipant = ref(0)
    const eligibleParticipant = ref(0)
    const ineligibleParticipant = ref(0)
    const termedParticipant = ref(0)
    const router = useRouter()
    const screenResize = ref(props.liveWidth)
    const xsOnly = ref(false)
    const xlOnly = ref(false)
    const width = ref(0)
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
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })
    //watch
    watchEffect(() => {
      width.value = display.width.value
      xsOnly.value = display.xs.value
      xlOnly.value = display.xl.value
      screenResize.value = props.liveWidth
    })
    //mounted
    onMounted(() => {
      loadParticipantInformation()
    })
    //method
    function navigateToPage(value) {
      if (value) {
        $store.state.clientPlan.prospectValue = 3
        router.push(value).catch(() => {})
      }
    }
    async function loadParticipantInformation() {
      participantOverview.value = [
        {
          name: 'Eligible, Contributing',
          color: '#119944',
          icon: 'fa:fa fa-thumbs-up',
          section: 'Contribution',
          count: 0,
          value: 0,
          type: 'EnrolledContributing'
        },
        {
          name: 'Eligible, Not Contributing',
          color: '#8f9faf',
          icon: 'fa:fa fa-thumbs-up rotateIcon',
          section: 'Contribution',
          count: 0,
          value: 0,
          type: 'EnrolledNotContributing'
        },
        {
          name: 'Contribution Rate',
          color: '#faa74a',
          icon: 'progress',
          section: 'Contribution',
          count: 0,
          value: 0,
          type: 'ContributionRate'
        },
        {
          name: 'Eligible, Enrolled',
          value: 0,
          color: '#119944',
          icon: 'fa:fa fa-thumbs-up',
          count: 0,
          section: 'Enrollment',
          type: 'EligibleEnrolled'
        },
        {
          name: 'Eligible, Not Enrolled',
          color: '#8f9faf',
          icon: 'fa:fa fa-thumbs-up rotateIcon',
          section: 'Enrollment',
          count: 0,
          value: 0,
          type: 'EnrolledNotEnrolled'
        },
        {
          name: 'Participation Rate',
          color: '#faa74a',
          icon: 'progress',
          section: 'Enrollment',
          count: 0,
          value: 0,
          type: 'ParticipationRate'
        }
      ]
      getContributionData()
      getEnrollmentData()
    }
    function viewDetailsWithFilter(val, val1) {
      var value1 = val.split(',')
      $store.state.clientPlan = {}
      $store.state.clientPlan.prospectValue = 0
      $store.state.clientPlan.filter = {
        partPlanStatus: [value1[0].length > 0 ? value1[0].trim() : ''],
        partContribution:
          val1 === 'Contribution' ? [value1[1].length > 0 ? (value1[1].trim() === 'Contributing' ? 'Yes' : 'No') : ''] : '',
        partEnrolled: val1 === 'Enrollment' ? [value1[1].length > 0 ? (value1[1].trim() === 'Enrolled' ? 'Yes' : 'No') : ''] : ''
      }
      router.push('/Retention/Plans').catch(() => {})
    }
    function getContributionData() {
      showLoader.value = true
      $store
        .dispatch('getParticipantsContributionData')
        .then(() => {
          if ($store.state.participantsContribution.message) {
            showLoader.value = false
            contributionOverviewData.value = []
          } else {
            contributionOverviewData.value = $store.state.participantsContribution
            showLoader.value = false
            var contributionOverview = contributionOverviewData.value.filter((a) => a.Count > 0)
            if (contributionOverview.length === 0) contributionOverviewData.value = []
            if (contributionOverviewData.value && contributionOverviewData.value.length > 0) {
              contributionOverviewData.value.forEach((a) => {
                participantOverview.value.forEach((element) => {
                  if (element.type && element.section === 'Contribution') {
                    if (element.type === a.Overview) {
                      element.count = a.Count ? a.Count : 0
                    }
                  }
                })
              })
            }
          }
        })
        .catch(() => {
          showLoader.value = false
          contributionOverviewData.value = []
        })
    }
    function getEnrollmentData() {
      showLoader.value = true
      $store
        .dispatch('getParticipantsEnrollmentData')
        .then(() => {
          if ($store.state.participantsEnrollment.message) {
            showLoader.value = false
            enrollmentOverview.value = []
          } else {
            enrollmentOverview.value = $store.state.participantsEnrollment
            showLoader.value = false
            var enrollmentOverviewData = enrollmentOverview.value.filter((a) => a.Count > 0)
            if (enrollmentOverviewData.length === 0) {
              enrollmentOverview.value = []
            } else {
              let totalPart = enrollmentOverviewData.filter((a) => a.Overview === 'Individuals')
              let eligible = enrollmentOverviewData.filter((a) => a.Overview === 'EligibleParticipants')
              let ineligible = enrollmentOverviewData.filter((a) => a.Overview === 'InEligibleParticipants')
              let termedPart = enrollmentOverviewData.filter((a) => a.Overview === 'TermedParticipants')
              totalParticipant.value = totalPart && totalPart.length > 0 ? totalPart[0]?.Count : 0
              eligibleParticipant.value = eligible && eligible.length > 0 ? eligible[0]?.Count : 0
              ineligibleParticipant.value = ineligible && ineligible.length > 0 ? ineligible[0]?.Count : 0
              termedParticipant.value = termedPart && termedPart.length > 0 ? termedPart[0]?.Count : 0
            }
          }
        })
        .catch(() => {
          showLoader.value = false
          enrollmentOverview.value = []
        })
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
      contributionOverviewData,
      enrollmentOverview,
      showLoader,
      showParticipantError,
      participantOverview,
      typeDetails,
      donutCenterCountData,
      totalParticipant,
      eligibleParticipant,
      ineligibleParticipant,
      termedParticipant,
      fontSize,
      showEmployerSponsored,
      showSchool,
      showIndividual,
      screenResize,
      width,
      xsOnly,
      xlOnly,
      navigateToPage,
      loadParticipantInformation,
      viewDetailsWithFilter,
      getContributionData,
      getEnrollmentData,
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
.zoomInEffect h3 {
  transition: transform 0.3s ease-in-out;
}
.zoomInEffect h3:hover {
  transform: scale(1.1);
}
</style>
