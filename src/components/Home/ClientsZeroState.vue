<template>
  <v-col>
    <v-col class="text-center" lg12 pt-16 pb-16>
      <v-card class="mx-auto" max-width="800" elevation="2">
        <v-col pt-6>
          <h2>You have no clients in your book of business at the moment.</h2>
          <h2>Find new leads and create proposals to add new clients</h2>
        </v-col>
        <v-col pt-4 pb-8>
          <v-row no-gutters>
            <v-col xs12 class="d-flex justify-center">
              <v-btn
                v-if="showEmployerSponsored || showSchool || showIndividuals"
                class="text-capitalize"
                color="accent"
                @click="redirect()"
              >
                Find new leads
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-col>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      filterDialog: false
    }
  },
  computed: {
    showEmployerSponsored() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    },
    showSchool() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.Schools
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.Schools
          )
        )
      } else return true
    },
    showIndividuals() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.Individuals
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          )
        )
      } else return true
    },
    showMunicipalities() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.Municipalities
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          )
        )
      } else return true
    }
  },
  methods: {
    redirect() {
      this.$emit('openAcquistionScreen')
    }
  }
}
</script>
