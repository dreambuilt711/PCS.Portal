<template>
  <v-flex>
    <v-row justify="center">
      <v-flex xs12 pt-2 class="justify-center">
        <v-flex xs12 class="text-center">
          <v-flex>
            <h1>Beneficiaries</h1>
          </v-flex>
          <div class="container pa-0" v-if="loader">
            <v-card :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
              <Loader :loadingText="`Loading..`" :loading="loader" />
            </v-card>
          </div>
          <v-flex v-if="beneficiariesData.length === 0 && !loader">
            <v-row justify="center">
              <v-flex pt-16 lg8 xs11>
                <v-card class="nonSelectedBackground" :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']">
                  <v-flex pt-6 pb-6>
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
                  </v-flex>
                </v-card>
                <v-flex xs12 class="text-center" pt-5>
                  <a class="font_14" :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']" @click="addBeneficiary()"
                    ><b>Add Beneficiary</b></a
                  >
                </v-flex>
              </v-flex>
            </v-row>
            <v-flex pt-16>
              <v-flex class="text-center">
                <v-btn
                  class="text-capitalize"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  :disabled="disableNextButton"
                  @click="nextSlide()"
                  >Next</v-btn
                >
              </v-flex>
              <v-flex xs12 class="text-center" py-5>
                <a class="font_14" :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']" @click="nextSlide()"
                  ><b>Skip, I'll do this later</b></a
                >
              </v-flex>
            </v-flex>
          </v-flex>
          <v-flex v-if="beneficiariesData.length >= 1 && !loader">
            <v-container class="beneficiaryContainer justify-center" v-dragscroll="true">
              <v-flex v-for="(item, index) in beneficiariesData" :key="index" class="xl4 md4 sm5 xs11 lg4 ma-3">
                <v-card class="elevation-6" height="100%">
                  <v-row>
                    <v-flex xs11 lg11 pt-2 pb-2> </v-flex>
                    <v-flex xs1 lg1 class="deleteIconPosition" v-if="beneficiariesData.length > 0">
                      <v-btn
                        icon
                        variant="text"
                        :color="!$vuetify.theme.dark ? 'error' : ''"
                        @click.stop="$set(deletePopUpBeneficiary, item.Id, true)"
                      >
                        <v-icon size="small">fas fa-trash</v-icon>
                      </v-btn>
                      <v-dialog
                        :scrollable="false"
                        v-model="deletePopUpBeneficiary[item.Id]"
                        max-width="350"
                        content-class="elevation-3"
                        :key="item.Id"
                      >
                        <ActionPopUp
                          @confirmAction="deleteBeneficiary(item.Id)"
                          @cancelAction="$set(deletePopUpBeneficiary, item.Id, false)"
                          confirmActionText="Delete"
                          cancelActionText="Cancel"
                          actionText="Delete Beneficiary"
                          :actionMessage="`Are you sure you want to delete <b>${item.Name}</b> account ?`"
                        />
                      </v-dialog>
                    </v-flex>
                  </v-row>
                  <v-flex class="fixFlexHeight" :class="[$vuetify.breakpoint.xs ? '' : 'px-2 pt-4 pb-4']">
                    <v-flex class="text-center">
                      <v-flex class="text-capitalize" :class="$vuetify.breakpoint.xs ? 'text-center pt-2' : 'text-center'">
                        <h2>{{ item.Name }}</h2>
                      </v-flex>
                      <v-flex class="text-capitalize" :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-center'" py-2>
                        <h3>
                          <b>{{ item.BeneficiaryType + ' Beneficiary, ' + item.BeneficiaryPercent + '% share' }}</b>
                        </h3>
                      </v-flex>
                      <v-flex :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-center'">
                        <h3>{{ item.BeneficiaryRelationship }}</h3>
                      </v-flex>
                      <v-flex :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-center'" pt-2>
                        <h3>{{ item.Email ? item.Email + ' ' : '' }}{{ item.HomePhone ? item.HomePhone : item.MobilePhone }}</h3>
                      </v-flex>
                      <v-flex :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-center'" pt-2>
                        <h3>
                          {{ item.SteetAddress ? item.SteetAddress : '' }}
                        </h3>
                      </v-flex>
                      <v-flex :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-center'" py-2>
                        <h3>
                          {{
                            (item.City ? ' ' + item.City + ',' : '') +
                            ' ' +
                            (item.State ? item.State : '') +
                            ' ' +
                            (item.Zipcode ? item.Zipcode.split('.')[0] : '')
                          }}
                        </h3>
                      </v-flex>
                    </v-flex>
                  </v-flex>
                  <v-flex>
                    <v-divider class="divider"></v-divider>
                    <v-flex lg12>
                      <v-row>
                        <v-flex pt-4 pb-4>
                          <a
                            class="font_14"
                            :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']"
                            @click="editBeneficiaryDetails(item.Id)"
                            ><b>Edit Info</b></a
                          >
                        </v-flex>
                      </v-row>
                    </v-flex>
                  </v-flex>
                </v-card>
              </v-flex>
            </v-container>
            <v-flex xs12 class="text-center" pt-5>
              <a class="font_14" :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']" @click="addOtherBeneficiary()"
                ><b>Add Beneficiary</b></a
              >
            </v-flex>
            <v-flex pt-5>
              <v-flex class="text-center">
                <v-flex class="errorMessage">{{ showBeneficiaryMessage }}</v-flex>
              </v-flex>
              <v-flex class="text-center">
                <v-btn
                  class="text-capitalize"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  :disabled="disableNextButton"
                  @click="nextSlide()"
                  >Next</v-btn
                >
              </v-flex>
              <v-flex xs12 class="text-center" py-5>
                <a class="font_14" :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']" @click="nextSlide()"
                  ><b>Skip, I'll do this later</b></a
                >
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-row>
    <AddBeneficiary
      v-model="addBeneficiaryDialog"
      @addBeneficiaryDetails="addBeneficiaryDetails"
      :addOrEditText="addOrEditText"
      @closeAddBeneficiaryDialog="closeAddBeneficiaryDialog"
      :registrationId="registrationId"
      :key="componentKey"
    />
  </v-flex>
</template>
<script>
import AddBeneficiary from '@/components/TAL/CreateProposal/AddBeneficiary'
import ActionPopUp from '@/components/ActionPopUp'
import Loader from '@/components/NewLoader'
import { eventBus } from '@/main'
export default {
  data() {
    return {
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
      disableNextButton: false
    }
  },
  props: ['registrationId'],
  components: {
    AddBeneficiary,
    ActionPopUp,
    Loader
  },
  mounted() {
    //this.getBeneficiary()
  },
  methods: {
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
    goToNextPage() {
      this.$emit('goToNextWindow')
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
          } else {
            this.disableNextButton = true
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
    },
    nextSlide() {
      this.$emit('nextSlide')
    }
  }
}
</script>

<style scoped>
.nonSelectedBackground {
  background-color: #dddddd !important;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
.fixFlexHeight {
  height: 190px !important;
}
.beneficiaryContainer {
  display: -webkit-box !important;
  overflow-x: hidden;
}
</style>
