<template>
  <v-col class="pa-0">
    <v-col v-if="displayGlobalFilter" id="globalFilter" cols="12" class="fixedFilter pa-0">
      <GlobalFilter @openFilter="openFilter" />
    </v-col>
    <v-container :fluid="!isXlOnly" :class="isXsOnly ? 'pl-0 pr-0' : ''">
      <!-- <v-col cols="12" :class="displayGlobalFilter ? (showFilter ? (isXsOnly ? 'margin_top_290' : 'mt-13') : '') : ''" /> -->
      <v-col cols="12" :class="isXlOnly ? 'mt-5' : ''">
        <v-row v-resize="onResize" class="justify-center">
          <v-col v-if="isAcquisitionCards" cols="12" class="mt-10 pa-0">
            <v-row class="justify-center">
              <v-col md="12" sm="12" cols="12" lg="12" xl="12" class="padding">
                <Overview @show-loader="showLoader" />
              </v-col>
              <v-col md="12" sm="12" cols="12" lg="6" xl="6" :class="isXsOnly ? '' : 'dashboardflex'">
                <SearchLead />
              </v-col>
              <v-col md="12" sm="12" cols="12" lg="6" xl="6" :class="isXsOnly ? '' : 'dashboardflex'">
                <MarketOpportunities />
              </v-col>
              <v-col v-if="displayPipelineCard" md="12" sm="12" cols="12" lg="7" xl="7" :class="isXsOnly ? '' : 'dashboardflex'">
                <ProspectPipeline @callPipelineCardDisplay="callPipelineCardDisplay" />
              </v-col>
              <v-col md="12" sm="12" cols="12" lg="5" xl="5" :class="isXsOnly ? '' : 'dashboardflex'">
                <FavoriteLead />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="isOnBoarding" cols="12" class="mt-10 pa-0"> <Onboarding /></v-col>
          <v-col v-if="isAdvisorSetupCards" cols="12" class="mt-10 pa-0">
            <AdvisorSetup />
          </v-col>
          <v-col v-if="isClientManagementCards" cols="12" class="mt-10 pa-0">
            <v-row v-if="showOldClientPage" class="justify-center">
              <v-col md="6" sm="6" cols="12" lg="4" xl="3" :class="isXsOnly ? '' : 'dashboardflex'">
                <ManagedAssets :liveWidth="liveWidth" />
              </v-col>
              <v-col md="6" sm="6" cols="12" lg="4" xl="3" :class="isXsOnly ? '' : 'dashboardflex'">
                <CompanyInformation :liveWidth="liveWidth" />
              </v-col>
              <v-col md="6" sm="6" cols="12" lg="4" xl="3" :class="isXsOnly ? '' : 'dashboardflex'">
                <IndividualClientInformation :liveWidth="liveWidth" />
              </v-col>
            </v-row>
            <v-row v-if="!showOldClientPage" class="justify-center">
              <v-col md="12" sm="12" cols="12" lg="12" xl="12">
                <Overview @show-loader="showLoader" />
              </v-col>
              <v-col md="6" sm="12" cols="12" :lg="width > 1400 ? '4' : '6'" xl="4" :class="isXsOnly ? '' : 'dashboardflex'">
                <Investment :liveWidth="liveWidth" />
              </v-col>
              <v-col md="6" sm="12" cols="12" :lg="width > 1400 ? '4' : '6'" xl="4" :class="isXsOnly ? '' : 'dashboardflex'">
                <PlanInformation :liveWidth="liveWidth" />
              </v-col>
              <v-col md="6" sm="12" cols="12" :lg="width > 1400 ? '4' : '6'" xl="4" :class="isXsOnly ? '' : 'dashboardflex'">
                <ParticipantInformation :liveWidth="liveWidth" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <Loader v-model="loading" :loading="loading" />
      <NotificationBanner :eager="true" from-page="Home" />
      <FirstTimeUX :eager="true" />
    </v-container>
  </v-col>
</template>
<script>
import { ref, computed, onMounted, watchEffect, watch, getCurrentInstance, inject } from 'vue'
import { useDisplay } from 'vuetify' // Import useDisplay from Vuetify
import GlobalFilter from '@/components/GlobalFilter'
import AdvisorSetup from '@/components/Home/AdvisorSetup'
import ProspectPipeline from '@/components/Home/Acquisition/ProspectPipeline/ProspectPipeline'
import Onboarding from '@/components/Home/Onboarding'
import ManagedAssets from '@/components/Home/ClientManagement/ManagedAssets'
import CompanyInformation from '@/components/Home/ClientManagement/CompanyInformation'
import IndividualClientInformation from '@/components/Home/ClientManagement/IndividualClientInformation'
import FirstTimeUX from '@/components/Home/FirstTimeUX'
import NotificationBanner from '@/components/Home/NotificationBanner'
import Overview from '@/components/Home/Acquisition/Overview'
import SearchLead from '@/components/Home/Acquisition/SearchLead'
import MarketOpportunities from '@/components/Home/Acquisition/MarketOpportunities'
import Loader from '@/components/Loader'
import FavoriteLead from '@/components/Home/Acquisition/FavoriteLeadWidget'
import PlanInformation from '@/components/Home/ClientManagement/PlansWidget'
import ParticipantInformation from '@/components/Home/ClientManagement/ParticipantInformation'
import Investment from '@/components/Home/ClientManagement/Investment'
import { useRoute } from 'vue-router'

export default {
  components: {
    GlobalFilter,
    AdvisorSetup,
    ProspectPipeline,
    Onboarding,
    ManagedAssets,
    CompanyInformation,
    IndividualClientInformation,
    FirstTimeUX,
    NotificationBanner,
    Overview,
    SearchLead,
    MarketOpportunities,
    Loader,
    FavoriteLead,
    PlanInformation,
    ParticipantInformation,
    Investment
  },
  setup() {
    const instance = getCurrentInstance()

    if (!instance) {
      throw new Error('Vue instance is not available')
    }

    const { $authz, $store } = instance.appContext.config.globalProperties
    const route = useRoute()
    const eventBus = inject('eventBus')
    const liveWidth = ref('500')
    const showFilter = ref(false)
    const isAcquisitionCards = ref(true)
    const isOnBoarding = ref(false)
    const isClientManagementCards = ref(false)
    const isAdvisorSetupCards = ref(false)
    const loading = ref(false)
    const displayPipelineCard = ref(true)
    const showOldClientPage = ref(true)
    const isXlOnly = ref(false)
    const isXsOnly = ref(false)
    const width = ref(0)
    // Use the imported useDisplay function from Vuetify
    const display = useDisplay()
    const displayGlobalFilter = computed(() => {
      if (
        $authz.hasRole($authz.roles.SiteAdmin) ||
        $authz.hasRole($authz.roles.ProgramAdmin) ||
        $authz.hasRole($authz.roles.InternalAdmin) ||
        $authz.hasRole($authz.roles.FirmAdmin)
      ) {
        if ($store.state.user.selectedProgram) {
          return $store.state.user.selectedProgram.accounts.length > 0
        }
        return false
      }
      return false
    })
    const openAcquisitionCards = () => {
      isAcquisitionCards.value = true
      isOnBoarding.value = false
      isClientManagementCards.value = false
      isAdvisorSetupCards.value = false
    }

    const openOnBoardingCards = () => {
      isAcquisitionCards.value = false
      isOnBoarding.value = true
      isClientManagementCards.value = false
      isAdvisorSetupCards.value = false
    }

    const openClientManagementCards = () => {
      isAcquisitionCards.value = false
      isOnBoarding.value = false
      isClientManagementCards.value = true
      isAdvisorSetupCards.value = false
    }

    const openAdvisorSetupCards = () => {
      isAcquisitionCards.value = false
      isOnBoarding.value = false
      isClientManagementCards.value = false
      isAdvisorSetupCards.value = true
    }

    const callPipelineCardDisplay = (data) => {
      displayPipelineCard.value = data
    }

    const showLoader = () => {
      loading.value = true
    }

    function onResize() {
      let bodyWidth = document.getElementsByTagName('body')
      if (bodyWidth && bodyWidth.length > 0) {
        if (document.getElementsByTagName('body')[0].offsetWidth)
          liveWidth.value = document.getElementsByTagName('body')[0].offsetWidth
      }
    }
    //methods
    function openFilter(val) {
      showFilter.value = val
    }
    // Fetch data on component creation
    onMounted(() => {
      $store.dispatch('getStarredPlans')
      if (route.meta.parentName === 'Onboarding') {
        openOnBoardingCards()
      } else if (route.meta.parentName === 'Clients') {
        openClientManagementCards()
      } else if (route.meta.parentName === 'Setup') {
        openAdvisorSetupCards()
      } else {
        openAcquisitionCards()
      }
      if (!$authz.hasRole($authz.roles.Advisor)) {
        if ($store.state.user.selectedProgram) {
          $store.dispatch('getAccountList')
        }
      }
      if (route.meta.parentName === 'Onboarding') {
        eventBus.$emit('callOnboarding')
      }
    })
    // Watch for route changes
    watch(
      route,
      () => {
        if (route.meta.parentName === 'Onboarding') {
          openOnBoardingCards()
        } else if (route.meta.parentName === 'Clients') {
          openClientManagementCards()
        } else if (route.meta.parentName === 'Setup') {
          openAdvisorSetupCards()
        } else {
          openAcquisitionCards()
        }
      },
      { deep: true }
    )
    watchEffect(() => {
      // Update isXlOnly and isXsOnly based on Vuetify's display properties
      isXlOnly.value = display.xl.value
      isXsOnly.value = display.xs.value
      width.value = display.width.value
    })
    //created
    if ($store.state.user.reliusSSO && !$store.state.hidePendingReview) {
      eventBus.emit('callAnnualReviewNotification')
    }

    return {
      liveWidth,
      showFilter,
      isAcquisitionCards,
      isOnBoarding,
      isClientManagementCards,
      isAdvisorSetupCards,
      loading,
      displayPipelineCard,
      showOldClientPage,
      isXlOnly,
      isXsOnly,
      width,
      displayGlobalFilter,
      openFilter,
      openAcquisitionCards,
      openOnBoardingCards,
      openClientManagementCards,
      openAdvisorSetupCards,
      callPipelineCardDisplay,
      showLoader,
      onResize,
      display
    }
  }
}
</script>

<style scoped>
.theme--light.selectedButton {
  background-color: rgb(var(--v-theme-accent-lighten1)) !important;
  color: white !important;
}
.theme--dark.selectedButton {
  background-color: black !important;
  color: white !important;
}
.activeBtn_result {
  background: #ffff;
  color: #000;
  text-align: center;
}
.theme--light .inActiveBtn_result {
  background: rgb(var(--v-theme-accent-lighten1));
  color: #ffff;
  text-align: center;
}
.homeButtonCss {
  letter-spacing: 0.02em !important;
}
.inActiveBtn_result {
  background: #a9a5a5;
}
</style>
