<template>
  <v-col>
    <v-card
      class="mb-1 mt-1 elevation-6"
      :height="$vuetify?.breakpoint?.xs ? 'auto' : '560px'"
      :class="$vuetify?.breakpoint?.xs ? 'ml-1 mr-1' : 'ml-6 mr-6'"
    >
      <v-col xs12>
        <v-row justify="center">
          <v-col xs11 lg11 class="justify-center">
            <v-col xs12 class="text-center mb-2 mt-6">
              <h1 class="welcomeFont mb-2">Tell us who will inherit your account</h1>
              <h3>Verify and complete filling out details regarding your beneficiary</h3>
            </v-col>
            <div v-if="loader" class="container pa-0">
              <v-card :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                <Loader :loading-text="`Loading..`" :loading="loader" />
              </v-card>
            </div>
            <v-col v-if="beneficiariesData.length === 0 && !loader">
              <v-row justify="center">
                <v-col pt-16 lg8 xs11>
                  <v-card
                    class="nonSelectedBackground"
                    :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']"
                  >
                    <v-col pt-6 pb-6>
                      <v-card-text>
                        <h3 v-if="beneficiariesData.length === 0">
                          There are currently no beneficiaries assigned to this proposal.
                        </h3>
                        <h3>
                          You may add or change your beneficiary designations at any time by completing a beneficiary change form
                          after you enroll.
                        </h3>
                        <h3>Details of assigned beneficiaries will appear here.</h3>
                      </v-card-text>
                    </v-col>
                  </v-card>
                  <v-col xs12 class="text-center" pt-5>
                    <a
                      class="font_14"
                      :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                      @click="addBeneficiary()"
                      ><b>Add Beneficiary</b></a
                    >
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="beneficiariesData.length >= 1 && !loader" mt-5>
              <v-container v-dragscroll="true" class="beneficiaryContainer justify-center">
                <v-col v-for="(item, index) in beneficiariesData" :key="index" class="xl4 md5 sm6 xs11 lg4 ma-3">
                  <v-card class="elevation-6" height="100%">
                    <v-row>
                      <v-col xs11 lg11 pt-2 pb-2 />
                      <v-col v-if="beneficiariesData.length > 0" xs1 lg1 class="deleteIconPosition">
                        <v-btn
                          icon
                          variant="text"
                          :color="!$vuetify?.theme.dark ? 'error' : ''"
                          @click.stop="$set(deletePopUpBeneficiary, item.Id, true)"
                        >
                          <v-icon size="small"> fas fa-trash </v-icon>
                        </v-btn>
                        <v-dialog
                          :key="item.Id"
                          v-model="deletePopUpBeneficiary[item.Id]"
                          :scrollable="false"
                          max-width="350"
                          content-class="elevation-3"
                        >
                          <ActionPopUp
                            confirm-action-text="Delete"
                            cancel-action-text="Cancel"
                            action-text="Delete Beneficiary"
                            :action-message="`Are you sure you want to delete <b>${item.Name}</b> account ?`"
                            @confirm-action="deleteBeneficiary(item.Id)"
                            @cancel-action="$set(deletePopUpBeneficiary, item.Id, false)"
                          />
                        </v-dialog>
                      </v-col>
                    </v-row>
                    <v-col class="fixFlexHeight" :class="[$vuetify?.breakpoint?.xs ? '' : 'px-2 pt-4 pb-4']">
                      <v-col class="text-center">
                        <v-col class="text-capitalize" :class="$vuetify?.breakpoint?.xs ? 'text-center pt-2' : 'text-center'">
                          <h2>{{ item.Name }}</h2>
                        </v-col>
                        <v-col class="text-capitalize" :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'text-center'" py-2>
                          <h3>
                            <b>{{ item.BeneficiaryType + ' Beneficiary, ' + item.BeneficiaryPercent + '% share' }}</b>
                          </h3>
                        </v-col>
                        <v-col :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'text-center'">
                          <h3>{{ item.BeneficiaryRelationship }}</h3>
                        </v-col>
                        <v-col :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'text-center'" pt-2>
                          <h3>
                            {{ item.Email ? item.Email + ' ' : '' }}{{ item.HomePhone ? item.HomePhone : item.MobilePhone }}
                          </h3>
                        </v-col>
                        <v-col :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'text-center'" pt-2>
                          <h3>
                            {{ item.SteetAddress ? item.SteetAddress : '' }}
                          </h3>
                        </v-col>
                        <v-col :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'text-center'" py-2>
                          <h3>
                            {{
                              (item.City ? ' ' + item.City + ',' : '') +
                              ' ' +
                              (item.State ? item.State : '') +
                              ' ' +
                              (item.Zipcode ? item.Zipcode.split('.')[0] : '')
                            }}
                          </h3>
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col>
                      <v-divider class="divider" />
                      <v-col lg12>
                        <v-row>
                          <v-col pt-4 pb-4 class="text-center">
                            <a
                              class="font_14"
                              :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                              @click="editBeneficiaryDetails(item.Id)"
                              ><b>Edit Info</b></a
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-card>
                </v-col>
              </v-container>
              <v-col xs12 class="text-center" pt-5>
                <a
                  class="font_14"
                  :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                  @click="addOtherBeneficiary()"
                  ><b>Add Beneficiary</b></a
                >
              </v-col>
              <v-col pt-5>
                <v-col class="text-center">
                  <v-col class="errorMessage">
                    {{ showBeneficiaryMessage }}
                  </v-col>
                </v-col>
              </v-col>
            </v-col>
            <AddBeneficiary
              :key="componentKey"
              v-model="addBeneficiaryDialog"
              :add-or-edit-text="addOrEditText"
              :registration-id="registrationId"
              @add-beneficiary-details="addBeneficiaryDetails"
              @close-add-beneficiary-dialog="closeAddBeneficiaryDialog"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <v-col :class="$vuetify?.breakpoint?.xs ? '' : 'ml-4 mr-4'">
      <v-row>
        <v-col sm="3">
          <v-btn
            class="text-capitalize ml-0"
            block
            variant="outlined"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="goBack()"
          >
            Go Back
          </v-btn>
        </v-col>
        <v-spacer />
        <v-col sm="3" :class="$vuetify?.breakpoint?.xs ? '' : 'mr-2'">
          <v-btn
            class="text-capitalize"
            block
            :disabled="disableNextButton"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="saveBeneficiary()"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
import AddBeneficiary from '@/components/TAL/CreateProposal/AddBeneficiary'
import ActionPopUp from '@/components/ActionPopUp'
import Loader from '@/components/NewLoader'
import { eventBus } from '@/main'
export default {
  components: {
    AddBeneficiary,
    ActionPopUp,
    Loader
  },
  data() {
    return {
      shareList: [
        { text: '100%', value: 100 },
        { text: '90%', value: 90 },
        { text: '80%', value: 80 },
        { text: '70%', value: 70 },
        { text: '60%', value: 60 },
        { text: '50%', value: 50 },
        { text: '40%', value: 40 },
        { text: '30%', value: 30 },
        { text: '20%', value: 20 },
        { text: '10%', value: 10 },
        { text: 'Other', value: 0 }
      ],
      beneficiaryType: '',
      relationshipType: '',
      allocation: '',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      dateOfBirth: '',
      ssn1: '',
      ssn2: '',
      ssn3: '',
      email: '',
      phoneNumber: '',
      phoneType: '',
      streetAddress: '',
      zipCode: '',
      city: '',
      state: '',
      beneficiaryItems: [
        { text: 'Primary', value: 'Primary' },
        { text: 'Contingent', value: 'Contingent' }
      ],
      relationshipTypeItems: [
        { text: 'Child', value: 'Child' },
        { text: 'Spouse', value: 'Spouse' },
        { text: 'Non-spouse', value: 'Non-spouse' },
        { text: 'Entity', value: 'Entity' }
      ],
      beneficiaryAdd: false,
      openTranferBalanceDialog: false,
      addBeneficiaryDialog: false,
      name: '',
      benefitype: '',
      relationType: '',
      allocType: '',
      emailAdd: '',
      phno: '',
      showDetails: false,
      beneficiariesData: [],
      addOtherBeneficiaryFlag: false,
      deletePopUpBeneficiary: {},
      loader: false,
      addOrEditText: '',
      beneficiaryFormList: [],
      beneficiaryID: '',
      componentKey: 0,
      showBeneficiaryMessage: '',
      disableNextButton: true,
      registrationId: ''
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.registrationId = this.$store.state.openAccountDetail.RegistrationId
        ? this.$store.state.openAccountDetail.RegistrationId
        : ''
      this.getBeneficiary()
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    saveBeneficiary() {
      this.$emit('goToNextWindow')
    },
    addBeneficiary() {
      this.addBeneficiaryDialog = true
      this.addOrEditText = 'Add'
      eventBus.$emit('resetData')
    },
    editBeneficiaryDetails(val) {
      this.addBeneficiaryDialog = true
      this.addOrEditText = 'Edit'
      eventBus.$emit('beneficiaryData', val)
    },
    checkBeneficiaryAllocation() {
      let totalPrimaryBeneficiaryValue = 0
      let totalContingentBeneficiaryValue = 0
      var showPrimaryMessage
      var showContingentMessage
      var showPrimaryNextButton
      var showContingentNextButton
      if (this.beneficiariesData && this.beneficiariesData.length > 0) {
        var newPrimaryFilteredData = this.beneficiariesData.filter((x) => x.BeneficiaryType === 'Primary')
        if (newPrimaryFilteredData && newPrimaryFilteredData.length > 0) {
          newPrimaryFilteredData.forEach((element) => {
            totalPrimaryBeneficiaryValue += parseFloat(element.BeneficiaryPercent)
          })
          showPrimaryMessage =
            totalPrimaryBeneficiaryValue !== 100 ? '* All Primary Beneficiary allocations must add up to 100.' : ''
          showPrimaryNextButton = totalPrimaryBeneficiaryValue !== 100 ? true : false
        }

        var newContingentFilteredData = this.beneficiariesData.filter((x) => x.BeneficiaryType === 'Contingent')
        if (newContingentFilteredData && newContingentFilteredData.length > 0) {
          newContingentFilteredData.forEach((element) => {
            totalContingentBeneficiaryValue += parseFloat(element.BeneficiaryPercent)
          })
          showContingentMessage =
            totalContingentBeneficiaryValue !== 100 ? '* All Contingent Beneficiary allocations must add up to 100.' : ''
          showContingentNextButton = totalContingentBeneficiaryValue !== 100 ? true : false
        }
      }
      this.showBeneficiaryMessage =
        showPrimaryMessage && showContingentMessage
          ? showPrimaryMessage + '\n' + showContingentMessage
          : showPrimaryMessage
            ? showPrimaryMessage
            : showContingentMessage
              ? showContingentMessage
              : ''
      this.disableNextButton = !showPrimaryNextButton && !showContingentNextButton ? false : true
    },
    closeAddBeneficiaryDialog() {
      this.addBeneficiaryDialog = false
      this.addOtherBeneficiaryFlag = false
    },
    addOtherBeneficiary() {
      this.addBeneficiaryDialog = true
      this.addOtherBeneficiaryFlag = true
      this.addOrEditText = 'Add'
      eventBus.$emit('resetData')
    },
    addBeneficiaryDetails(val) {
      this.showDetails = true
      this.addBeneficiaryDialog = false
      this.saveBeneficiaryData(val)
    },
    getBeneficiary() {
      this.loader = true
      this.$axios
        .get(`/api/v1/sfdc/beneficiary/${this.registrationId}/GetAll`)
        .then((success) => {
          this.beneficiariesData = success.data.d.records ? success.data.d.records : []
          this.loader = false
          if (this.beneficiariesData.length > 0) {
            this.checkBeneficiaryAllocation()
          }
        })
        .catch(() => {
          this.loader = false
        })
    },
    saveBeneficiaryData(val) {
      this.loader = true
      this.$axios
        .post(`/api/v1/sfdc/beneficiary`, val)
        .then(() => {
          this.loader = false
          this.getBeneficiary()
        })
        .catch(() => {
          this.loader = false
        })
    },
    deleteBeneficiary(ID) {
      this.$axios
        .delete(`/api/v1/sfdc/beneficiarydelete/${ID}`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          let deletePosition = this.beneficiariesData.findIndex((a) => a.ID === ID)
          if (deletePosition > -1) this.beneficiariesData.splice(deletePosition, 1)
          this.getBeneficiary()
          this.dialogDelete = false
        })
    }
  }
}
</script>
<style scoped>
.nonSelectedBackground {
  background-color: #dddddd !important;
}
.fixFlexHeight {
  height: 190px !important;
}
.beneficiaryContainer {
  display: -webkit-box !important;
  overflow-x: hidden;
}
</style>
