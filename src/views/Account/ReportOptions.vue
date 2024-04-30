<template>
  <v-container fluid>
    <v-col class="mb-4">
      <h1 class="font-weight-medium pt-2">Report Options</h1>
    </v-col>
    <ReportsPresenter />
    <v-col v-if="isShowProposal()">
      <v-divider class="my-3" />
      <v-col lg12 xl12 md12 sm12 xs12 class="mt-3">
        <h2>PCS Proposal Options</h2>
      </v-col>
      <v-row class="mt-3">
        <v-col xs2 xl1 flex_none>
          <v-checkbox v-model="includeDelegation" color="accent" />
        </v-col>
        <v-col xs10 xl5 mt-3>
          <h3>Our firm acts as a 3(38) investment fiduciary for our proposed Plans.</h3>
          <h5>Note: Checking this option will add the "Fiduciary Delegation" page to proposals you generate.</h5>
        </v-col>
      </v-row>
      <v-row class="mt-1">
        <v-col xs2 xl1 flex_none>
          <v-checkbox v-model="includeAboutUs" color="accent" />
        </v-col>
        <v-col xs10 xl5 mt-3>
          <h3>I would like to include information about my firm in the "About Us" section of the proposal.</h3>
          <h5>Note: If you select this option, please enter information about your firm below (2000 characters max).</h5>
        </v-col>
      </v-row>
      <v-col xs12 mt-3>
        <v-textarea v-model="about" label="About" variant="outlined" />
      </v-col>
      <v-col xs12 class="text-right">
        <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" @click="saveReportOptions()"> Save </v-btn>
      </v-col>
    </v-col>
  </v-container>
</template>
<script>
import ReportsPresenter from '@/components/Account/ReportsPresenter'
export default {
  components: {
    ReportsPresenter
  },
  data() {
    return {
      activeTab: 0,
      image1: {},
      snackbarText: '',
      error: false,
      messageText: '',
      snackbar: false,
      dialog: false,
      includeDelegation: false,
      includeAboutUs: false,
      about: ''
    }
  },
  watch: {
    loader: function () {
      if (this.loader !== null) {
        const l = this.loader
        this[l] = !this[l]
        setTimeout(() => (this[l] = false), 8000)
        this.loader = null
      }
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    saveReportOptions() {
      var saveReportOptions = {
        includeDelegation: this.includeDelegation,
        includeAboutUs: this.includeAboutUs,
        aboutInfo: this.about
      }
      this.$axios
        .put(`/api/v1/tal/reportoptions`, saveReportOptions)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          this.$toast?.destroy()
          this.$toast.success('Information saved successfully', '', this.notificationSystem.options.success)
        })
    },
    getOptions() {
      var isProposalOption = this.isShowProposal()
      if (isProposalOption) {
        this.$axios.get(`/api/v1/tal/reportoptions`).then((success) => {
          if (success.data.d != null && success.data.d.length > 0) {
            this.includeDelegation = success.data.d[0].Delegation
            this.includeAboutUs = success.data.d[0].AboutUs
            this.about = success.data.d[0].AboutInfo
          }
        })
      }
    },
    isShowProposal() {
      if (
        this.$authz.hasRole(this.$authz.roles.SiteAdmin) ||
        this.$authz.hasRole(this.$authz.roles.ProgramAdmin) ||
        this.$authz.hasRole(this.$authz.roles.FirmAdmin)
      ) {
        return this.$authz.allowedByProgram(this.$authz.programPermissionSet.PcS_Proposal_Options__c, this.$authz.permission.Full)
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(this.$authz.programPermissionSet.PcS_Proposal_Options__c, this.$authz.permission.Full) &&
          this.$authz.allowedByAccount(this.$authz.accountPermissionSet.PcS_Proposal_Options__c, this.$authz.permission.Full)
        )
      }
    }
  }
}
</script>
<style scoped>
.border-color {
  border-color: rgb(var(--v-theme-accent)) !important;
}

.border {
  padding: 8px !important;
}
</style>
