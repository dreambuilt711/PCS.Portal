<template>
  <v-container class="pt-1" fill-height :class="$vuetify?.breakpoint?.xs ? 'pl-3 pr-3' : ''">
    <v-col xs12>
      <v-card-text class="justify-center align-center pt-1">
        <v-col xs12 class="justify-center align-center d-flex pa-0">
          <div v-if="loading" class="container">
            <v-col class="justify-center">
              <v-card :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                <Loader :loading-text="`Loading..`" :loading="loading" />
              </v-card>
            </v-col>
          </div>
          <v-container v-if="!loading" :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0' : ''">
            <v-row no-gutters class="justify-center">
              <v-col v-if="presenterInfoFlow === 0" xl8 xs12>
                <v-row no-gutters class="justify-center">
                  <v-col xl12 lg12 pa-2>
                    <v-card class="elevation-6">
                      <v-row class="justify-center pb-6 pt-6" :class="$vuetify?.breakpoint?.xs ? 'pl-2 pr-2' : ''">
                        <v-col lg6 class="text-center">
                          <v-row no-gutters class="justify-center">
                            <v-col lg6 xl6 class="shortcutflex">
                              <v-col class="logoflex">
                                <v-img :src="contentURL" :eager="true" max-width="100%" max-height="100%" />
                              </v-col>
                            </v-col>
                          </v-row>
                          <v-col py-4 mt-6>
                            <h1 class="welcomeFont">Welcome {{ firstName }} to your NEW retirement account!</h1>
                          </v-col>
                          <v-col>
                            <h3>Enrollment is easy and takes roughly 10 minutes to complete.</h3>
                            <h3>Before you start, have your Social Security Number and at least</h3>
                            <h3>one of the following documents handy:</h3>
                          </v-col>
                          <v-col mt-6>
                            <v-row no-gutters justify="center">
                              <v-col sm8 lg10>
                                <v-row no-gutters justify="center">
                                  <v-col class="lg3">
                                    <v-row>
                                      <v-col class="text-left">
                                        <v-row no-gutters justify="center">
                                          <v-icon
                                            size="18"
                                            aria-hidden="true"
                                            :class="!$vuetify?.theme.dark ? 'text-accent' : ''"
                                          >
                                            far fa-address-card
                                          </v-icon>
                                          <h4 class="ml-1">Driver's License</h4>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col class="lg2">
                                    <h4 class="text-grey">- OR -</h4>
                                  </v-col>
                                  <v-col class="lg2">
                                    <v-row>
                                      <v-col class="text-left">
                                        <v-row no-gutters justify="center">
                                          <v-icon
                                            size="18"
                                            aria-hidden="true"
                                            :class="!$vuetify?.theme.dark ? 'text-accent' : ''"
                                          >
                                            far fa-id-badge
                                          </v-icon>
                                          <h4 class="ml-1">State ID</h4>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col class="lg2">
                                    <h4 class="text-grey">- OR -</h4>
                                  </v-col>
                                  <v-col class="lg3">
                                    <v-row>
                                      <v-col class="text-left">
                                        <v-row no-gutters justify="center">
                                          <v-icon
                                            size="18"
                                            aria-hidden="true"
                                            :class="!$vuetify?.theme.dark ? 'text-accent' : ''"
                                          >
                                            fas fa-passport
                                          </v-icon>
                                          <h4 class="ml-1">Passport</h4>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col py-8>
                            <v-btn
                              class="text-capitalize"
                              :color="$vuetify?.theme.dark ? '' : 'accent'"
                              @click="startEnrollment()"
                            >
                              Start Account Application
                            </v-btn>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col sm6 xl6 lg6 pa-2>
                    <v-card
                      class="elevation-6 py-6 heightClassForCard"
                      :class="$vuetify?.breakpoint?.smAndDown ? 'px-6' : 'px-12'"
                    >
                      <v-row no-gutters class="justify-center">
                        <v-col xs1 class="mr-2 flex_none pt-1">
                          <div class="contentlegend_circle">
                            <span class="align-self-center">1</span>
                          </div>
                        </v-col>
                        <v-col xs11>
                          <h4 class="font-weight-bold">Have questions?</h4>
                          <h4 class="pt-1">If you have any questions, you can reach out to your financial advisor:</h4>
                          <h4 class="pt-4 font-weight-bold">
                            {{ presenterName }}
                          </h4>
                          <h4 class="pt-1">
                            {{ presenterEmail }}
                          </h4>
                          <h4>{{ presenterPhone }}</h4>
                        </v-col>
                      </v-row>
                      <v-row v-if="false" no-gutters class="justify-center pt-6">
                        <v-col xs1 class="mr-2 flex_none pt-1">
                          <div class="contentlegend_circle">
                            <span class="align-self-center">1</span>
                          </div>
                        </v-col>
                        <v-col xs11>
                          <h4 class="font-weight-bold">What are the benefits of opening a retirement account?</h4>
                          <h4 class="pt-1">
                            Your financial advisor started process for you. If you have any questions, you can reach out to them
                            with the following contact information:
                          </h4>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col sm6 xl6 lg6 pa-2>
                    <v-card
                      class="elevation-6 py-6 heightClassForCard"
                      :class="$vuetify?.breakpoint?.smAndDown ? 'px-6' : 'px-12'"
                    >
                      <v-row no-gutters class="justify-center">
                        <v-col xs1 class="mr-2 flex_none pt-1">
                          <div class="contentlegend_circle">
                            <span class="align-self-center">1</span>
                          </div>
                        </v-col>
                        <v-col xs11>
                          <h4 class="font-weight-bold">What happens after I open my account?</h4>
                          <h4 class="pt-1">
                            We will review your application to make sure everything is in good order. Once we have reviewed your
                            account, we will setup your account and reach out to you once it’s completed, with instructions on to
                            access your account.
                          </h4>
                          <!-- <h4 class="pt-4 font-weight-bold">{{ presenterName }}</h4>
                          <h4 class="pt-1">{{ presenterEmail }}</h4>
                          <h4>{{ presenterPhone }}</h4> -->
                        </v-col>
                      </v-row>
                      <v-row v-if="false" no-gutters class="justify-center pt-6">
                        <v-col xs1 class="mr-2 flex_none pt-1">
                          <div class="contentlegend_circle">
                            <span class="align-self-center">2</span>
                          </div>
                        </v-col>
                        <v-col xs11>
                          <h4 class="font-weight-bold">What are the benefits of opening a retirement account?</h4>
                          <h4 class="pt-1">
                            Your financial advisor started process for you. If you have any questions, you can reach out to them
                            with the following contact information:
                          </h4>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-if="presenterInfoFlow !== 0 && presenterInfoFlow !== 8"
                class="stepperMainDiv xl8"
                :class="$vuetify?.breakpoint?.xs ? 'smallScreenStepper' : ''"
              >
                <v-stepper v-model="stepper" alt-labels class="elevation-0 background_transparent no-transition">
                  <v-stepper-header>
                    <v-stepper-step
                      id="step1"
                      v-ripple="false"
                      step="1"
                      :class="presenterInfoFlow > 1 ? 'activeStepper' : ''"
                      color="accent"
                    >
                      Personal Info
                    </v-stepper-step>
                    <v-divider :class="presenterInfoFlow > 1 ? 'activeDivider' : ''" />
                    <v-stepper-step
                      id="step2"
                      v-ripple="false"
                      step="2"
                      :class="presenterInfoFlow > 2 ? 'activeStepper' : ''"
                      color="accent"
                    >
                      Employer Info
                    </v-stepper-step>
                    <v-divider :class="presenterInfoFlow > 2 ? 'activeDivider' : ''" />
                    <v-stepper-step
                      id="step3"
                      v-ripple="false"
                      step="3"
                      :class="presenterInfoFlow > 3 ? 'activeStepper' : ''"
                      color="accent"
                    >
                      Investments
                    </v-stepper-step>
                    <v-divider :class="presenterInfoFlow > 3 ? 'activeDivider' : ''" />
                    <v-stepper-step
                      id="step4"
                      v-ripple="false"
                      step="4"
                      :class="presenterInfoFlow > 4 ? 'activeStepper' : ''"
                      color="accent"
                    >
                      Beneficiaries
                    </v-stepper-step>
                    <v-divider :class="presenterInfoFlow > 4 ? 'activeDivider' : ''" />
                    <!-- <v-stepper-step
                      step="5"
                      :class="presenterInfoFlow > 5 ? 'activeStepper' : ''"
                      color="accent"
                      v-ripple="false"
                      id="step5"
                    >
                      Transfer</v-stepper-step
                    >
                    <v-divider :class="presenterInfoFlow > 5 ? 'activeDivider' : ''"></v-divider> -->
                    <v-stepper-step
                      id="step5"
                      v-ripple="false"
                      step="5"
                      :class="presenterInfoFlow > 5 ? 'activeStepper' : ''"
                      color="accent"
                    >
                      Agreements
                    </v-stepper-step>
                    <!-- <v-divider :class="presenterInfoFlow > 5 ? 'activeDivider' : ''"></v-divider>
                    <v-stepper-step
                      step="6"
                      :class="presenterInfoFlow > 6 ? 'activeStepper' : ''"
                      color="accent"
                      v-ripple="false"
                      id="step6"
                    >
                      Agreements</v-stepper-step
                    > -->
                  </v-stepper-header>
                  <v-stepper-items>
                    <v-stepper-content step="1" class="pt-0" :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0' : ''">
                      <PersonalInformation @go-to-next-window="goToEmployerInformation" />
                    </v-stepper-content>
                    <v-stepper-content step="2" class="pt-0" :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0' : ''">
                      <EmployerInformation
                        :key="employerComponent"
                        @go-to-next-window="goToInvestmentSummary"
                        @go-back="goBackToPreviousPage(2)"
                      />
                    </v-stepper-content>
                    <v-stepper-content step="3" class="pt-0" :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0' : ''">
                      <InvestmentSummary
                        :key="investmentComponent"
                        @go-to-next-window="goToBeneficiaries"
                        @go-back="goBackToPreviousPage(3)"
                      />
                    </v-stepper-content>
                    <v-stepper-content step="4" class="pt-0" :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0' : ''">
                      <Beneficiaries
                        :key="beneficiaryComponent"
                        @go-to-next-window="goToTransferBalance"
                        @go-back="goBackToPreviousPage(4)"
                      />
                    </v-stepper-content>
                    <!-- <v-stepper-content step="8" class="pt-0" :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0' : ''">
                      <TransferBalances
                        @goToNextWindow="gotoParticipantReview"
                        :key="transferComponent"
                        @goBack="goBackToPreviousPage(5)"
                      />
                    </v-stepper-content> -->
                    <v-stepper-content step="5" class="pt-0" :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0' : ''">
                      <ParticipantReview
                        v-if="showReview"
                        :key="participantReviewComponent"
                        @go-to-next-window="goToParticipantAgreement"
                        @go-to-flow-edit-screen="goBackToPreviousPage"
                        @go-back="goBackToPreviousPage(5)"
                      />
                      <ParticipantAgreement
                        v-if="showAgreement"
                        :key="participantAgreementComponent"
                        :limited-authority-trading="limitedAuthorityTrading"
                        @go-to-next-window="goToCompletedAccount"
                        @go-back="goBackToPreviousPage(7)"
                      />
                    </v-stepper-content>
                  </v-stepper-items>
                </v-stepper>
              </v-col>
              <v-col v-if="presenterInfoFlow === 8" class="xl8">
                <CompletedAccountSetUp :key="completedComponent" :content-u-r-l="contentURL" />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-card-text>
    </v-col>
  </v-container>
</template>
<script>
import PersonalInformation from '@/components/TAL/ParticipantMPAA/PersonalInformationMPAA'
import EmployerInformation from '@/components/TAL/ParticipantMPAA/EmployerInformationMPAA'
import InvestmentSummary from '@/components/TAL/ParticipantMPAA/InvestmentSummary'
import Beneficiaries from '@/components/TAL/ParticipantMPAA/BeneficiariesMPAA'
// import TransferBalances from '@/components/TAL/ParticipantMPAA/TransferBalanceMPAA'
import ParticipantReview from '@/components/TAL/ParticipantMPAA/ParticipantReview'
import ParticipantAgreement from '@/components/TAL/ParticipantMPAA/ParticipantAgreement'
import CompletedAccountSetUp from '@/components/TAL/ParticipantMPAA/CompletedAccount'
import Loader from '@/components/NewLoader'
export default {
  components: {
    PersonalInformation,
    EmployerInformation,
    InvestmentSummary,
    Beneficiaries,
    // TransferBalances,
    ParticipantReview,
    ParticipantAgreement,
    CompletedAccountSetUp,
    Loader
  },
  data() {
    return {
      presenterInfoFlow: 0,
      opportunityId: '',
      registrationId: '',
      loading: false,
      firstName: '',
      presenterName: '',
      presenterPhone: '',
      presenterEmail: '',
      employerComponent: 0,
      investmentComponent: 0,
      beneficiaryComponent: 0,
      transferComponent: 0,
      participantReviewComponent: 0,
      participantAgreementComponent: 0,
      completedComponent: 0,
      showReview: false,
      showAgreement: false,
      stepper: 0,
      contentURL: '',
      limitedAuthorityTrading: ''
    }
  },
  created() {
    this.getOpportunity()
  },
  methods: {
    startEnrollment() {
      this.stepper = 1
      this.presenterInfoFlow = 1
    },
    getOpportunity() {
      const Id = this.$route.params.id ? this.$route.params.id : ''
      if (Id) {
        this.loading = true
        this.$axios
          .get(`/api/v1/sfdc/opportunity/${Id}`)
          .then((success) => {
            if (success.data.d) {
              this.opportunityId = success.data.d.Id
              this.registrationId = success.data.d.RegistrationId ? success.data.d.RegistrationId : ''
              var schoolDistrictAccountId = success.data.d.AccountId ? success.data.d.AccountId : ''
              var contactId = success.data.d.AdvisorPrimarySales ? success.data.d.AdvisorPrimarySales : ''
              this.$store.state.openAccountDetail = success.data.d
              this.$store.state.openAccountDetail.OpportunityId = this.opportunityId
              this.getSchoolName(schoolDistrictAccountId)
              this.getRegistrationDetail()
              this.GetParticpantOpportunityDetails()
              if (contactId) {
                this.$axios.get(`/api/v1/sfdc/${contactId}/contact`).then((success) => {
                  if (success.data.d) {
                    this.presenterName = success.data.d.FirstName + ' ' + success.data.d.LastName
                    this.presenterPhone = success.data.d.Phone ? success.data.d.Phone : ''
                    this.presenterEmail = success.data.d.Email ? success.data.d.Email : ''
                    this.$store.state.openAccountDetail.FirmName = success.data.d.AccountName
                    this.$store.state.openAccountDetail.PresenterName = this.presenterName ? this.presenterName : ''
                    this.$store.state.openAccountDetail.PresenterPhone = this.presenterPhone
                  }
                })
              }
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    goBackToPreviousPage(val) {
      switch (val) {
        case 2:
          this.stepper = 1
          this.presenterInfoFlow = 1
          break
        case 3:
          this.stepper = 2
          this.presenterInfoFlow = 2
          break
        case 4:
          this.stepper = 3
          this.presenterInfoFlow = 3
          break
        case 5:
          this.stepper = 4
          this.presenterInfoFlow = 4
          break
        case 6:
          this.stepper = 5
          this.presenterInfoFlow = 5
          break
        case 7:
          this.stepper = 5
          this.presenterInfoFlow = 5
          this.showReview = true
          this.showAgreement = false
          break
        case 8:
          this.stepper = 6
          this.presenterInfoFlow = 7
          this.showReview = false
          this.showAgreement = true
          break
        case 9:
          this.stepper = 0
          this.presenterInfoFlow = 8
          break
        default:
          this.stepper = 1
          this.presenterInfoFlow = 1
          break
      }
    },
    getRegistrationDetail() {
      this.$axios
        .get(`/api/v1/sfdc/Registration/${this.registrationId}`)
        .then((success) => {
          var registrationObject = success.data.d ? success.data.d : {}
          if (Object.keys(this.$store.state.openAccountDetail).length === 0) {
            this.$store.state.openAccountDetail = registrationObject
            this.$store.state.openAccountDetail.RegistrationId = this.registrationId
            this.$store.state.openAccountDetail.OpportunityId = this.opportunityId
          } else {
            Object.assign(this.$store.state.openAccountDetail, registrationObject)
          }
          this.firstName =
            this.$store.state.openAccountDetail && this.$store.state.openAccountDetail.FirstName
              ? this.$store.state.openAccountDetail.FirstName
              : ''
          this.stepper = 0
          this.presenterInfoFlow = 0
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getSchoolName(schoolDistrictAccountId) {
      if (schoolDistrictAccountId) {
        this.$axios.get(`/api/v1/${schoolDistrictAccountId}/schooldistrictsbyId`).then((success) => {
          if (success.data.d && success.data.d.schooldistrictData.length > 0) {
            if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
              this.$store.state.openAccountDetail.schoolDistrictList = success.data.d.schooldistrictData
              this.$store.state.openAccountDetail.schoolList =
                success.data.d.schooldistrictData[0].schools && success.data.d.schooldistrictData[0].schools.length > 0
                  ? success.data.d.schooldistrictData[0].schools
                  : []
            }
          }
        })
      }
    },
    goToEmployerInformation() {
      this.employerComponent += 1
      this.stepper = 2
      this.presenterInfoFlow = 2
    },
    goToInvestmentSummary() {
      this.investmentComponent += 1
      this.stepper = 3
      this.presenterInfoFlow = 3
    },
    goToBeneficiaries() {
      this.beneficiaryComponent += 1
      this.stepper = 4
      this.presenterInfoFlow = 4
    },
    goToTransferBalance() {
      // this.transferComponent += 1
      // this.stepper = 5
      // this.presenterInfoFlow = 5
      this.participantReviewComponent += 1
      this.showReview = true
      this.showAgreement = false
      this.stepper = 5
      this.presenterInfoFlow = 5
    },
    gotoParticipantReview() {
      this.participantReviewComponent += 1
      this.showReview = true
      this.showAgreement = false
      this.stepper = 6
      this.presenterInfoFlow = 6
    },
    goToParticipantAgreement() {
      this.participantAgreementComponent += 1
      this.presenterInfoFlow = 7
      this.stepper = 5
      this.showReview = false
      this.showAgreement = true
    },
    goToCompletedAccount() {
      this.completedComponent += 1
      this.stepper = 0
      this.presenterInfoFlow = 8
    },
    GetParticpantOpportunityDetails() {
      this.$axios
        .get(`/api/v1/sfdc/${this.opportunityId}/participant`)
        .then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            var participantURLandLTADetails = success.data.d ? success.data.d[0] : {}
            this.contentURL = participantURLandLTADetails.Web_Logo__c
            this.limitedAuthorityTrading = participantURLandLTADetails.Limited_Authority_Trading__c === 'No' ? false : true
            if (Object.keys(this.$store.state.openAccountDetail).length === 0) {
              this.$store.state.openAccountDetail.LimitedAuthorityTrading =
                participantURLandLTADetails.Limited_Authority_Trading__c
            }
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
.container {
  display: flex;
  overflow-x: auto;
}

.shortcutflex .logoflex {
  height: auto;
  width: 250px;
  display: flex;
  align-items: center;
}
.contentlegend_circle {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: rgb(255, 187, 17) !important;
  font-size: 0.75em;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
}
.contentlegend_circle span {
  margin-top: 2px;
}
.v-stepper__header {
  box-shadow: none !important;
}
.heightClassForCard {
  height: 160px !important;
}
</style>
