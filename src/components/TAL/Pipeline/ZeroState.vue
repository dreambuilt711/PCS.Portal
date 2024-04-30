<template>
  <v-col>
    <v-col class="text-center pt-16 pb-16" cols="12" lg="12">
      <v-col class="text-h5">
        <h4>This is your sales prospect pipeline</h4>
      </v-col>
      <v-col class="pt-6">
        <h4>As you grow your book of business this pipeline will keep track your</h4>
        <h4>progress from your first call to signed account applications</h4>
      </v-col>
      <v-col v-if="fromPage === 'employerSponsoredPage'" class="pt-8 pb-4">
        <h4>Create a prospect to get started</h4>
      </v-col>
      <v-col v-if="fromPage === 'participantsPage'" class="pt-8 pb-4">
        <h4>Create an account to get started</h4>
      </v-col>
      <v-col v-if="fromPage === 'employerSponsoredPage'" class="pt-4 pb-8">
        <v-row no-gutters>
          <v-col cols="12" xs="12" class="d-flex justify-center">
            <v-btn
              v-if="showEmployerSponsored || showSchool || showIndividuals"
              class="text-capitalize"
              :color="theme.dark ? '' : 'accent'"
              @click="createAccount()"
            >
              Create Startup
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="fromPage === 'participantsPage'" class="pt-4 pb-8">
        <v-row no-gutters>
          <v-col cols="12" xs="12" class="d-flex justify-center">
            <v-btn
              v-if="showEmployerSponsored || showSchool || showIndividuals"
              class="text-capitalize"
              :color="theme.dark ? '' : 'accent'"
              @click="openAccount()"
            >
              Open Account
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <OpenAccount v-model="filterDialog" from-page="OpenFlow" />
  </v-col>
</template>
<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'

export default {
  components: {
    OpenAccount
  },
  props: ['fromPage'],
  setup() {
    const theme = useTheme()
    const router = useRouter()
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const filterDialog = ref(false)
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
    const createAccount = () => {
      router.push('/TAL/StartupPlan').catch(() => {})
    }
    const openAccount = () => {
      store.state.openAccountDetail = {}
      filterDialog.value = true
    }
    return {
      theme,
      showEmployerSponsored,
      showSchool,
      showIndividuals,
      createAccount,
      openAccount,
      showMunicipalities,
      filterDialog
    }
  }
}
</script>
