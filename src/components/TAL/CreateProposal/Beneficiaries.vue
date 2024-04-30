<template>
  <v-col>
    <v-row justify="center">
      <v-col cols="12" xs="12" class="pt-2 justify-center">
        <v-col cols="12" xs="12" class="text-center">
          <v-col>
            <h1>Beneficiaries</h1>
          </v-col>
          <div v-if="loader" class="container pa-0">
            <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
              <Loader :loading-text="`Loading..`" :loading="loader" />
            </v-card>
          </div>
          <v-col v-if="beneficiariesData.length === 0 && !loader">
            <v-row justify="center">
              <v-col class="pt-16" cols="11" xs="11" lg="8">
                <v-card class="nonSelectedBackground" :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']">
                  <v-col class="pt-6 pb-6">
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
                <v-col cols="12" xs="12" class="text-center pt-5">
                  <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="addBeneficiary()">
                    <b>Add Beneficiary</b>
                  </a>
                </v-col>
              </v-col>
            </v-row>
            <v-col class="pt-16">
              <v-col class="text-center">
                <v-btn
                  class="text-capitalize"
                  :color="theme.dark ? '' : 'accent'"
                  :disabled="disableNextButton"
                  @click="goToNextPage()"
                >
                  Next
                </v-btn>
              </v-col>
              <v-col cols="12" xs="12" class="text-center py-5">
                <a
                  class="font_14 cursor-pointer"
                  :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                  @click="goToNextPage()"
                >
                  <b>Skip, I'll do this later</b>
                </a>
              </v-col>
            </v-col>
          </v-col>
          <v-col v-if="beneficiariesData.length >= 1 && !loader">
            <v-container v-dragscroll="true" class="beneficiaryContainer justify-center">
              <v-col
                v-for="(item, index) in beneficiariesData"
                :key="index"
                cols="11"
                xl="4"
                lg="4"
                md="4"
                sm="5"
                xs="11"
                class="ma-3"
              >
                <v-card class="elevation-6" height="100%">
                  <v-row>
                    <v-col cols="11" xs="11" lg="11" class="pt-2 pb-2" />
                    <v-col v-if="beneficiariesData.length > 0" cols="1" xs="1" lg="1" class="deleteIconPosition">
                      <v-btn
                        icon
                        variant="text"
                        :color="!theme.dark ? 'error' : ''"
                        @click.stop="deletePopUpBeneficiary[item.Id] = true"
                      >
                        <v-icon size="small"> mdi-delete </v-icon>
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
                          @cancel-action="deletePopUpBeneficiary[item.Id] = false"
                        />
                      </v-dialog>
                    </v-col>
                  </v-row>
                  <v-col class="fixFlexHeight" :class="[display.xs.value ? '' : 'px-2 pt-4 pb-4']">
                    <v-col class="text-center">
                      <v-col class="text-capitalize" :class="display.xs.value ? 'text-center pt-2' : 'text-center'">
                        <h2>{{ item.Name }}</h2>
                      </v-col>
                      <v-col class="text-capitalize py-2" :class="display.xs.value ? 'text-center' : 'text-center'">
                        <h3>
                          <b>{{ item.BeneficiaryType + ' Beneficiary, ' + item.BeneficiaryPercent + '% share' }}</b>
                        </h3>
                      </v-col>
                      <v-col :class="display.xs.value ? 'text-center' : 'text-center'">
                        <h3>{{ item.BeneficiaryRelationship }}</h3>
                      </v-col>
                      <v-col :class="display.xs.value ? 'text-center' : 'text-center'" class="pt-2">
                        <h3>{{ item.Email ? item.Email + ' ' : '' }}{{ item.HomePhone ? item.HomePhone : item.MobilePhone }}</h3>
                      </v-col>
                      <v-col :class="display.xs.value ? 'text-center' : 'text-center'" class="pt-2">
                        <h3>
                          {{ item.SteetAddress ? item.SteetAddress : '' }}
                        </h3>
                      </v-col>
                      <v-col :class="display.xs.value ? 'text-center' : 'text-center'" class="py-2">
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
                    <v-col cols="12" lg="12">
                      <v-row>
                        <v-col class="pt-4 pb-4">
                          <a
                            class="font_14"
                            :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                            @click="editBeneficiaryDetails(item.Id)"
                          >
                            <b>Edit Info</b>
                          </a>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-card>
              </v-col>
            </v-container>
            <v-col cols="12" xs="12" class="text-center pt-5">
              <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="addOtherBeneficiary()">
                <b>Add Beneficiary</b>
              </a>
            </v-col>
            <v-col class="pt-5">
              <v-col class="text-center">
                <v-col class="errorMessage">{{ showBeneficiaryMessage }}</v-col>
              </v-col>
              <v-col class="text-center">
                <v-btn
                  class="text-capitalize"
                  :color="theme.dark ? '' : 'accent'"
                  :disabled="disableNextButton"
                  @click="goToNextPage()"
                >
                  Next
                </v-btn>
              </v-col>
              <v-col cols="12" xs="12" class="text-center py-5">
                <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="goToNextPage()">
                  <b>Skip, I'll do this later</b>
                </a>
              </v-col>
            </v-col>
          </v-col>
        </v-col>
      </v-col>
    </v-row>
    <AddBeneficiary
      :key="componentKey"
      v-model="addBeneficiaryDialog"
      :add-or-edit-text="addOrEditText"
      :registration-id="registrationId"
      @add-beneficiary-details="addBeneficiaryDetails"
      @close-add-beneficiary-dialog="closeAddBeneficiaryDialog"
    />
  </v-col>
</template>
<script>
import { ref, inject, onMounted, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import AddBeneficiary from '@/components/TAL/CreateProposal/AddBeneficiary'
import ActionPopUp from '@/components/ActionPopUp'
import Loader from '@/components/NewLoader'
export default {
  components: {
    AddBeneficiary,
    ActionPopUp,
    Loader
  },
  props: ['registrationId'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const $axios = instance.appContext.config.globalProperties.$axios
    const beneficiaryType = ref('')
    const relationshipType = ref('')
    const allocation = ref('')
    const firstName = ref('')
    const middleName = ref('')
    const lastName = ref('')
    const suffix = ref('')
    const dateOfBirth = ref('')
    const ssn1 = ref('')
    const ssn2 = ref('')
    const dialogDelete = ref(false)
    const ssn3 = ref('')
    const email = ref('')
    const phoneNumber = ref('')
    const phoneType = ref('')
    const streetAddress = ref('')
    const zipCode = ref('')
    const city = ref('')
    const state = ref('')
    const beneficiaryItems = ref([
      { text: 'Primary', value: 'Primary' },
      { text: 'Contingent', value: 'Contingent' }
    ])
    const relationshipTypeItems = ref([
      { text: 'Child', value: 'Child' },
      { text: 'Spouse', value: 'Spouse' },
      { text: 'Non-spouse', value: 'Non-spouse' },
      { text: 'Entity', value: 'Entity' }
    ])
    const beneficiaryAdd = ref(false)
    const openTranferBalanceDialog = ref(false)
    const addBeneficiaryDialog = ref(false)
    const name = ref('')
    const benefitype = ref('')
    const relationType = ref('')
    const allocType = ref('')
    const emailAdd = ref('')
    const phno = ref('')
    const showDetails = ref(false)
    const beneficiariesData = ref([])
    const addOtherBeneficiaryFlag = ref(false)
    const deletePopUpBeneficiary = ref({})
    const loader = ref(false)
    const addOrEditText = ref('')
    const beneficiaryFormList = ref([])
    const beneficiaryID = ref('')
    const componentKey = ref(0)
    const showBeneficiaryMessage = ref('')
    const disableNextButton = ref(false)
    function addBeneficiary() {
      addBeneficiaryDialog.value = true
      addOrEditText.value = 'Add'
      eventBus.emit('resetData')
    }
    function editBeneficiaryDetails(val) {
      addBeneficiaryDialog.value = true
      addOrEditText.value = 'Edit'
      eventBus.emit('beneficiaryData', val)
    }
    function goToNextPage() {
      emit('goToNextWindow')
    }
    function checkBeneficiaryAllocation() {
      let totalPrimaryBeneficiaryValue = 0
      let totalContingentBeneficiaryValue = 0
      var showPrimaryMessage
      var showContingentMessage
      var showPrimaryNextButton
      var showContingentNextButton
      if (beneficiariesData.value && beneficiariesData.value.length > 0) {
        var newPrimaryFilteredData = beneficiariesData.value.filter((x) => x.BeneficiaryType === 'Primary')
        if (newPrimaryFilteredData && newPrimaryFilteredData.length > 0) {
          newPrimaryFilteredData.forEach((element) => {
            totalPrimaryBeneficiaryValue += parseFloat(element.BeneficiaryPercent)
          })
          showPrimaryMessage =
            totalPrimaryBeneficiaryValue !== 100 ? '* All Primary Beneficiary allocations must add up to 100.' : ''
          showPrimaryNextButton = totalPrimaryBeneficiaryValue !== 100 ? true : false
        }

        var newContingentFilteredData = beneficiariesData.value.filter((x) => x.BeneficiaryType === 'Contingent')
        if (newContingentFilteredData && newContingentFilteredData.length > 0) {
          newContingentFilteredData.forEach((element) => {
            totalContingentBeneficiaryValue += parseFloat(element.BeneficiaryPercent)
          })
          showContingentMessage =
            totalContingentBeneficiaryValue !== 100 ? '* All Contingent Beneficiary allocations must add up to 100.' : ''
          showContingentNextButton = totalContingentBeneficiaryValue !== 100 ? true : false
        }
      }
      showBeneficiaryMessage.value =
        showPrimaryMessage && showContingentMessage
          ? showPrimaryMessage + '\n' + showContingentMessage
          : showPrimaryMessage
            ? showPrimaryMessage
            : showContingentMessage
              ? showContingentMessage
              : ''
      disableNextButton.value = !showPrimaryNextButton && !showContingentNextButton ? false : true
    }
    function closeAddBeneficiaryDialog() {
      addBeneficiaryDialog.value = false
      addOtherBeneficiaryFlag.value = false
    }
    function addOtherBeneficiary() {
      addBeneficiaryDialog.value = true
      addOtherBeneficiaryFlag.value = true
      addOrEditText.value = 'Add'
      eventBus.emit('resetData')
    }
    function addBeneficiaryDetails(val) {
      showDetails.value = true
      addBeneficiaryDialog.value = false
      saveBeneficiaryData(val)
    }
    function getBeneficiary() {
      loader.value = true
      $axios
        .get(`/api/v1/sfdc/beneficiary/${props.registrationId}/GetAll`)
        .then((success) => {
          beneficiariesData.value = success.data.d.records ? success.data.d.records : []
          loader.value = false
          if (beneficiariesData.value.length > 0) {
            checkBeneficiaryAllocation()
          } else {
            disableNextButton.value = true
          }
        })
        .catch(() => {
          loader.value = false
        })
    }
    function saveBeneficiaryData(val) {
      loader.value = true
      $axios
        .post(`/api/v1/sfdc/beneficiary`, val)
        .then(() => {
          loader.value = false
          getBeneficiary()
        })
        .catch(() => {
          loader.value = false
        })
    }
    function deleteBeneficiary(ID) {
      $axios
        .delete(`/api/v1/sfdc/beneficiarydelete/${ID}`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          let deletePosition = beneficiariesData.value.findIndex((a) => a.ID === ID)
          if (deletePosition > -1) beneficiariesData.value.splice(deletePosition, 1)
          getBeneficiary()
          dialogDelete.value = false
        })
    }
    onMounted(() => {
      getBeneficiary()
    })
    return {
      theme,
      display,
      loader,
      beneficiariesData,
      disableNextButton,
      deletePopUpBeneficiary,
      showBeneficiaryMessage,
      addBeneficiaryDialog,
      addOrEditText,
      beneficiaryType,
      relationshipType,
      allocation,
      firstName,
      middleName,
      lastName,
      suffix,
      dateOfBirth,
      ssn1,
      ssn2,
      ssn3,
      email,
      phoneNumber,
      phoneType,
      streetAddress,
      zipCode,
      city,
      state,
      beneficiaryItems,
      relationshipTypeItems,
      beneficiaryAdd,
      openTranferBalanceDialog,
      name,
      benefitype,
      relationType,
      allocType,
      emailAdd,
      phno,
      beneficiaryFormList,
      beneficiaryID,
      componentKey,
      addBeneficiary,
      goToNextPage,
      deleteBeneficiary,
      editBeneficiaryDetails,
      addOtherBeneficiary,
      addBeneficiaryDetails,
      closeAddBeneficiaryDialog
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
