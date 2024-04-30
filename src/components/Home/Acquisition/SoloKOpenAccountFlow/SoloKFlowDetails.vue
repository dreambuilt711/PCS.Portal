<template>
  <v-flex>
    <v-flex>
      <v-flex v-if="selectedCarosal === 0">
        <AdvisorInformation @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 1">
        <PlanInformationSoloK @nextSlide="nextSlide" @displayNextSlide="displayNextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 2">
        <ProviderInformation @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 3">
        <CurrentTPAInformation @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 4">
        <AccountHolderInformation @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 5">
        <GroupInformation @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 6">
        <CompanyInformationSoloK @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 7">
        <OtherRetirementPlans @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 8">
        <ClientProductSoloK @nextSlide="nextSlide" @displayFeeSchedule="displayFeeSchedule" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 9">
        <EditFeeScheduleSoloK @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 10">
        <AddNewInvestments @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 11">
        <SelectedInvestmentsSoloK @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 12">
        <FundContributions @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 13">
        <AdditionalAccountHolders @showAdditionalAccountForm="showAdditionalAccountForm" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 14">
        <AdditionalAccountHolderInformation @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 15">
        <AdditionalAccountHolders1 @showAdditionalAccountForm1="showAdditionalAccountForm1" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 16">
        <AdditionalAccountHolderInformation1 @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 17">
        <AdditionalAccountHolders2 @showAdditionalAccountForm2="showAdditionalAccountForm2" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 18">
        <AdditionalAccountHolderInformation2 @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <!-- <v-flex v-if="selectedCarosal === 17">
        <AdditionalOwners @showAdditionalOwnerForm="showAdditionalOwnerForm" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 18">
        <AdditionalOwnerInformation @nextSlide="nextSlide" />
      </v-flex> -->
      <v-flex v-if="selectedCarosal === 19">
        <PlanContact @nextSlide="nextSlide" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 20">
        <StatementsAndAgreements @closeSoloKDialog="closeSoloKDialog" @prevSlide="prevSlide" />
      </v-flex>
      <v-flex v-if="selectedCarosal === 21">
        <CompletedAccountSetup @closeAllDialog="closeAllDialog" />
      </v-flex>
    </v-flex>
  </v-flex>
</template>
<script>
import AdvisorInformation from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdvisorInformation'
import PlanInformationSoloK from '@/components/Home/Acquisition/SoloKOpenAccountFlow/PlanInformationSoloK'
import ProviderInformation from '@/components/Home/Acquisition/SoloKOpenAccountFlow/ProviderInformation'
import CurrentTPAInformation from '@/components/Home/Acquisition/SoloKOpenAccountFlow/CurrentTPAInformation'
import AccountHolderInformation from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AccountHolderInformation'
import GroupInformation from '@/components/Home/Acquisition/SoloKOpenAccountFlow/GroupInformation'
import CompanyInformationSoloK from '@/components/Home/Acquisition/SoloKOpenAccountFlow/CompanyInformationSoloK'
import OtherRetirementPlans from '@/components/Home/Acquisition/SoloKOpenAccountFlow/OtherRetirementPlans'
import ClientProductSoloK from '@/components/Home/Acquisition/SoloKOpenAccountFlow/ClientProductSoloK'
import AddNewInvestments from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AddNewInvestments'
import SelectedInvestmentsSoloK from '@/components/Home/Acquisition/SoloKOpenAccountFlow/SelectedInvestmentsSoloK'
import EditFeeScheduleSoloK from '@/components/Home/Acquisition/SoloKOpenAccountFlow/EditFeeScheduleSoloK'
import AdditionalAccountHolders from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalAccountHolders'
import AdditionalAccountHolders1 from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalAccountHolders1'
import AdditionalAccountHolders2 from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalAccountHolders2'
import AdditionalAccountHolderInformation from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalAccountHolderInformation'
import AdditionalAccountHolderInformation1 from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalAccountHolderInformation1'
import AdditionalAccountHolderInformation2 from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalAccountHolderInformation2'
// import AdditionalOwners from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalOwners'
// import AdditionalOwnerInformation from '@/components/Home/Acquisition/SoloKOpenAccountFlow/AdditionalOwnerInformation'
import StatementsAndAgreements from '@/components/Home/Acquisition/SoloKOpenAccountFlow/StatementsAndAgreements'
import FundContributions from '@/components/Home/Acquisition/SoloKOpenAccountFlow/FundContributions'
import PlanContact from '@/components/Home/Acquisition/SoloKOpenAccountFlow/PlanContact'
import CompletedAccountSetup from '@/components/Home/Acquisition/SoloKOpenAccountFlow/CompletedAccountSetup'
export default {
  data() {
    return {
      selectedCarosal: 0,
      slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth']
    }
  },
  components: {
    AdvisorInformation,
    PlanInformationSoloK,
    ProviderInformation,
    CurrentTPAInformation,
    AccountHolderInformation,
    GroupInformation,
    CompanyInformationSoloK,
    OtherRetirementPlans,
    ClientProductSoloK,
    EditFeeScheduleSoloK,
    AddNewInvestments,
    SelectedInvestmentsSoloK,
    AdditionalAccountHolders,
    AdditionalAccountHolders1,
    AdditionalAccountHolders2,
    AdditionalAccountHolderInformation,
    AdditionalAccountHolderInformation1,
    AdditionalAccountHolderInformation2,
    // AdditionalOwners,
    // AdditionalOwnerInformation,
    StatementsAndAgreements,
    FundContributions,
    PlanContact,
    CompletedAccountSetup
  },
  computed: {
    modelHeight() {
      var fontSize = this.$root.$children[0].fontsize
      if (!this.$vuetify.breakpoint.xsOnly && Number(fontSize) >= 14) return 'auto'
      if (this.$vuetify.breakpoint.xsOnly) {
        if (Number(fontSize) >= 14) return 'auto'
        else return '510px'
      } else if (this.$vuetify.breakpoint.smOnly) return '500px'
      else if (this.$vuetify.breakpoint.width === 1280) return '400px'
      else return '500px'
    }
  },
  methods: {
    prevSlide() {
      var val = Number(this.selectedCarosal)
      if (val > 0) {
        // if (val === 19 && this.$store.state.soloKOpenAccountDetail.AddOwnerFlag === 'No') {
        //   this.selectedCarosal = 17
        // } else
        if (val === 10 && this.$store.state.soloKOpenAccountDetail.FeeTypeDetail === 'Commission Based') {
          this.selectedCarosal = 8
        } else if (val === 15 && this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag === 'No') {
          this.selectedCarosal = 13
        } else if (val === 19 && this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag === 'No') {
          this.selectedCarosal = 13
        } else if (val === 19 && this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag1 === 'No') {
          this.selectedCarosal = 15
        } else if (val === 19 && this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag2 === 'No') {
          this.selectedCarosal = 17
        } else if (val === 4 && this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up') {
          this.selectedCarosal = 1
        } else {
          this.selectedCarosal = Number(val - 1)
        }
      }
      if (val === 0) {
        var pageValue = 2
        this.$emit('selectedPageValue', pageValue)
      }
    },
    showSlide(val) {
      this.selectedCarosal = val
    },
    nextSlide() {
      var val = Number(this.selectedCarosal)
      if (val < 20) this.selectedCarosal = Number(val + 1)
    },
    showAdditionalAccountForm(val) {
      if (val === 'Yes') {
        this.selectedCarosal = 14
      } else {
        this.selectedCarosal = 19
      }
    },
    showAdditionalAccountForm1(val) {
      if (val === 'Yes') {
        this.selectedCarosal = 16
      } else {
        this.selectedCarosal = 19
      }
    },
    showAdditionalAccountForm2(val) {
      if (val === 'Yes') {
        this.selectedCarosal = 18
      } else {
        this.selectedCarosal = 19
      }
    },
    // showAdditionalOwnerForm(val) {
    //   if (val === 'Yes') {
    //     this.selectedCarosal = 18
    //   } else {
    //     this.selectedCarosal = 19
    //   }
    // },
    closeAllDialog() {
      this.$emit('closeSoloKMainDialog')
    },
    closeSoloKDialog() {
      this.selectedCarosal = 21
    },
    displayNextSlide(val) {
      if (val === 'Conversion') {
        this.selectedCarosal = 2
      } else {
        this.selectedCarosal = 4
      }
    },
    displayFeeSchedule(val) {
      if (val === 'Commission Based') {
        this.selectedCarosal = 10
      } else {
        this.selectedCarosal = 9
      }
    }
  }
}
</script>
