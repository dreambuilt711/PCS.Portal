<template>
  <v-col>
    <v-col lg12 xl12 md12 sm12 xs12>
      <h2>PCS Presenters</h2>
    </v-col>
    <v-col xs12 xl6 text-left mt-1>
      <p class="font_size_12">
        Customize your Diagnostic,Retirement Plan Efficiency Analysis,and Proposal reports with the presenter information below.
      </p>
    </v-col>

    <v-card class="pl-3 pt-2 pb-2 pr-3">
      <v-dialog v-model="modelDialog" persistent class="elevation-3" content-class="elevation-3" scrollable max-width="1000px">
        <template #activator="{ props }">
          <v-col xs12 sm12 md12 lg12 xl12>
            <v-row>
              <v-col xs12 sm3 md4 lg3 xl4 class="text-left align-self">
                <h2>Presenter List</h2>
              </v-col>
              <v-col xs12 sm9 md7 lg9 xl8>
                <v-row :class="$vuetify?.breakpoint?.smAndUp ? 'justify-end' : 'align-self'">
                  <v-col xs12 sm6 md6 lg4 xl4 mr-1>
                    <v-text-field
                      v-model="searchText"
                      variant="outlined"
                      density="compact"
                      label="Search"
                      append-icon="search"
                      hide-details
                      @blur="change()"
                    />
                  </v-col>
                  <v-col
                    xs12
                    sm5
                    md3
                    lg5
                    xl4
                    :class="!$vuetify?.breakpoint?.smAndUp ? 'text-right mt-1' : 'flex_none align-self'"
                  >
                    <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" v-bind="props" @click="showModelDialog()">
                      Add New Presenter
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </template>
        <v-card>
          <v-card-title class="pa-3" fixed :class="$vuetify?.theme.dark ? '' : 'accent secondary--text'">
            <v-row>
              <v-col xl11 lg11 sm11 md11 xs11>
                <h3 v-if="!$vuetify?.breakpoint?.xs">New Presenter</h3>
                <h4 v-if="$vuetify?.breakpoint?.xs">New Presenter</h4>
              </v-col>
              <v-col xl1 lg1 sm1 md1 xs1 class="text-right">
                <v-icon :color="$vuetify?.theme.dark ? '' : 'secondary'" @click="resetPresenter()"> close </v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-col>
              <v-col xl12 lg12 md12 sm12 xs12 pb-3>
                <h2>Look Up Presenter</h2>
              </v-col>
              <v-row>
                <v-col xl8 lg6 md8 sm6 xs9 pr-2>
                  <v-text-field
                    ref="crd"
                    v-model="crdNo"
                    v-input-mask="{
                      alias: 'numeric',
                      digits: '0',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    variant="outlined"
                    density="compact"
                    label="Enter CRD#"
                    :error="error"
                    :error-messages="CrdMessage"
                    @blur="removeValidation()"
                  />
                </v-col>
                <v-col xl4 lg6 sm3 xs3 md4>
                  <v-btn
                    :color="$vuetify?.theme.dark ? '' : 'accent'"
                    class="ml-0 mt-0"
                    :disabled="!valid"
                    @click="getPresenter()"
                  >
                    <v-icon color="secondary--text"> arrow_forward_ios </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-col xs12>
                <h4>
                  Don't know the CRD#?
                  <a
                    href="https://brokercheck.finra.org/"
                    target="_blank"
                    :class="$vuetify?.theme.dark ? 'text-white' : 'text-accent'"
                    >Click here</a
                  >
                  to look it up.
                </h4>
              </v-col>

              <v-col xs12>
                <v-switch
                  v-model="manualAddPresenter"
                  label="Manually add a presenter"
                  class="offsetSwitch"
                  hide-details
                  color="accent"
                />
              </v-col>
              <v-col v-if="manualAddPresenter" xl6 lg12 md12 sm12 xs12 mt-3 pb-2>
                <h2>Presenter Information</h2>
              </v-col>
              <v-col v-if="manualAddPresenter" xl10 sm12 xs12 md12 lg12>
                <v-text-field v-model="presenterName" variant="outlined" density="compact" label="Name" @blur="change()" />
              </v-col>
              <v-col v-if="manualAddPresenter" xl6 lg12 md12 sm12 xs12 mt-3 pb-2>
                <h2>Firm Details</h2>
              </v-col>
              <v-col v-if="manualAddPresenter" xl10 sm12 xs12 md12 lg12>
                <v-text-field v-model="presenterFirmName" variant="outlined" density="compact" label="Firm" @blur="change()" />
              </v-col>
              <v-row v-if="manualAddPresenter">
                <v-col v-if="manualAddPresenter" xl5 lg5 md6 sm6 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pr-2'">
                  <v-text-field
                    v-if="manualAddPresenter"
                    v-model="presenterAddress1"
                    :class="$vuetify?.breakpoint?.xs ? 'pt-0 mt-0' : 'pt-0'"
                    label="Address 1"
                    variant="outlined"
                    density="compact"
                    @blur="change()"
                  />
                </v-col>
                <v-col
                  v-if="manualAddPresenter"
                  xl5
                  lg5
                  md6
                  sm6
                  xs12
                  :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-3' : 'align-self'"
                >
                  <v-text-field
                    v-if="manualAddPresenter"
                    v-model="presenterAddress2"
                    label="Address 2"
                    :class="$vuetify?.breakpoint?.xs ? '' : 'pt-0'"
                    variant="outlined"
                    density="compact"
                    @blur="change()"
                  />
                </v-col>

                <v-col v-if="manualAddPresenter" xl5 lg5 md6 sm6 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pr-2'">
                  <v-text-field
                    v-if="manualAddPresenter"
                    v-model="presenterCity"
                    :class="$vuetify?.breakpoint?.xs ? 'pt-0 mt-0' : 'pt-0'"
                    label="City"
                    variant="outlined"
                    density="compact"
                    @blur="change()"
                  />
                </v-col>
                <v-col
                  v-if="manualAddPresenter"
                  xl5
                  lg5
                  md6
                  sm6
                  xs12
                  :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-3' : 'align-self'"
                >
                  <v-text-field
                    v-if="manualAddPresenter"
                    v-model="presenterState"
                    label="State"
                    :class="$vuetify?.breakpoint?.xs ? '' : 'pt-0'"
                    variant="outlined"
                    density="compact"
                    @blur="change()"
                  />
                </v-col>
                <v-col v-if="manualAddPresenter" xl5 lg5 md6 sm6 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pr-2'">
                  <v-text-field
                    v-if="manualAddPresenter"
                    v-model="presenterZip"
                    v-input-mask="{
                      mask: '99999',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    :class="$vuetify?.breakpoint?.xs ? 'pt-0 mt-0' : 'pt-0'"
                    label="Zip"
                    variant="outlined"
                    density="compact"
                    @blur="change()"
                  />
                </v-col>
                <v-col
                  v-if="manualAddPresenter"
                  xl5
                  lg5
                  md6
                  sm6
                  xs12
                  :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-3' : 'align-self'"
                >
                  <v-text-field
                    v-if="manualAddPresenter"
                    v-model="presenterPhone"
                    v-input-mask="{
                      mask: '(999) 999-9999',
                      showMaskOnHover: false,
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false,
                      allowPlus: true
                    }"
                    label="Phone"
                    :class="$vuetify?.breakpoint?.xs ? '' : 'pt-0'"
                    variant="outlined"
                    density="compact"
                    @blur="change()"
                  />
                </v-col>
                <v-col xl5 lg5 md6 sm6 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pr-2'">
                  <v-text-field
                    v-if="manualAddPresenter"
                    v-model="presenterEmail"
                    label="Email"
                    :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                    :class="$vuetify?.breakpoint?.xs ? '' : 'pt-0'"
                    variant="outlined"
                    density="compact"
                    @blur="change()"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
          <v-divider class="bold" />
          <v-card-actions>
            <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" @click="savePresenter()"> Save And Close </v-btn>
            <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" variant="outlined" @click="resetPresenter()"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-col class="mt-3">
        <v-col
          v-show="selected.length >= 1"
          xs12
          :class="$vuetify?.theme.dark ? 'text-right cursor-pointer pt-2' : ' text-right cursor-pointer pt-2 text-accent'"
        >
          <span class="pr-3" @click="dialog = true">
            <b>Delete Selected</b>
          </span>
        </v-col>
        <v-data-table
          v-model="selected"
          :hide-default-header="$vuetify?.breakpoint?.smAndDown"
          class="elevation-0 changeTableColor"
          :headers="Headers"
          :items="presenterList"
          :search="searchText"
          item-key="ID"
          show-select
          @toggle-select-all="selectAllToggle"
        >
          <template #item="{ item, isExpanded, isSelected, select }">
            <tr v-if="!$vuetify?.breakpoint?.smAndDown">
              <td width="2%">
                <v-checkbox-btn :color="$vuetify?.theme.dark ? '' : 'accent'" :value="isSelected" @input="select($event)" />
              </td>
              <td>{{ item.Name }}</td>
              <td>{{ item.CRD }}</td>
              <td class="wraptext">
                <v-col xs12 class="text-center cursor-pointer">
                  <v-btn
                    icon
                    variant="text"
                    :color="!$vuetify?.theme.dark ? 'accent' : ''"
                    @click="editPresenter(item.ID, item.CRD)"
                  >
                    <v-icon size="small"> fas fa-edit </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    :color="!$vuetify?.theme.dark ? 'error' : ''"
                    @click.stop="$set(deletePopUpPresenter, item.ID, true)"
                  >
                    <v-icon size="small"> fas fa-trash </v-icon>
                  </v-btn>
                  <v-dialog
                    :key="item.ID"
                    v-model="deletePopUpPresenter[item.ID]"
                    :scrollable="false"
                    max-width="350"
                    content-class="elevation-3"
                  >
                    <ActionPopUp
                      confirm-action-text="Delete"
                      cancel-action-text="Cancel"
                      action-text="Delete Presenter"
                      :action-message="`Are you sure you want to delete <b>${item.Name}</b>  presenter ?`"
                      @confirm-action="deletePresenter(item)"
                      @cancel-action="$set(deletePopUpPresenter, item.ID, false)"
                    />
                  </v-dialog>
                </v-col>
              </td>
            </tr>
            <tr
              v-else
              :class="[item.selectedRow == true ? 'selected_row_color' : '', isExpanded ? 'border_bottom_none' : '']"
              @click="longtap ? longTapFunction(event, item) : ''"
            >
              <td class="pr-3 pl-3">
                <v-touch
                  class="xs12"
                  @press="
                    (event) => {
                      longTapFunction(event, item)
                    }
                  "
                >
                  <v-col xs12>
                    <v-row>
                      <v-col xs10>
                        <h5 class="pt-1">
                          <span class="text-grey">Name</span>
                        </h5>
                        <h4 class="text-uppercase">
                          {{ item.Name }}
                        </h4>
                      </v-col>
                      <v-col xs2>
                        <v-tooltip location="top">
                          <template #activator="{ props }">
                            <v-btn
                              icon
                              v-bind="props"
                              variant="text"
                              :color="!$vuetify?.theme.dark ? 'error' : ''"
                              class="text-center align-center"
                              @click.stop="$set(deletePopUpPresenter, item.ID, true)"
                            >
                              <v-icon size="small"> fas fa-trash </v-icon>
                            </v-btn>
                            <v-dialog
                              :key="item.ID"
                              v-model="deletePopUpPresenter[item.ID]"
                              :scrollable="false"
                              max-width="350"
                              content-class="elevation-3"
                            >
                              <ActionPopUp
                                confirm-action-text="Delete"
                                cancel-action-text="Cancel"
                                action-text="Delete Presenter"
                                :action-message="`Are you sure you want to delete <b>${item.Name}</b>  presenter ?`"
                                @confirm-action="deletePresenter(item)"
                                @cancel-action="$set(deletePopUpPresenter, item.ID, false)"
                              />
                            </v-dialog>
                          </template>
                          <span>Delete</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col xs12>
                    <v-row>
                      <v-col xs10>
                        <h5 class="pt-1">
                          <span class="text-grey">CRD</span>
                        </h5>
                        <h4 class="text-uppercase">
                          {{ item.CRD }}
                        </h4>
                      </v-col>
                      <v-col xs2>
                        <v-tooltip location="top">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              variant="text"
                              :color="!$vuetify?.theme.dark ? 'accent' : ''"
                              @click="editPresenter(item.ID, item.CRD)"
                            >
                              <v-icon size="small"> fas fa-edit </v-icon>
                            </v-btn>
                          </template>
                          <span>Edit</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-touch>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-dialog v-model="dialog" max-width="360" content-class="elevation-3" :scrollable="false">
          <ActionPopUp
            confirm-action-text="Delete"
            cancel-action-text="Cancel"
            action-text="Delete Presenter"
            :action-message="'Are you sure you want to delete the selected presenters?'"
            @confirm-action="deletePresenter()"
            @cancel-action="dialog = false"
          />
        </v-dialog>
      </v-col>
    </v-card>
  </v-col>
</template>
<script>
import ActionPopUp from '@/components/ActionPopUp'
export default {
  components: {
    ActionPopUp
  },
  data() {
    return {
      about: '',
      includeDelegation: false,
      includeAboutUs: false,
      investmentManagerOnly: false,
      investmentManagerTamp: false,
      longtap: false,
      dialog: false,
      CrdMessage: '',
      error: false,
      valid: true,
      discription: '',
      PresentedBy: '',
      presenterMessage: '',
      presenterName: '',
      AboutUs: '',
      PresenterID: 0,
      AboutInfo: '',
      presenterFirmName: '',
      presenterFirmCRD: 0,
      recordTypeId: '',
      presenterAddress1: '',
      presenterAddress2: '',
      presenterState: '',
      presenterCity: '',
      presenterZip: '',
      presenterPhone: '',
      presenterEmail: '',
      crdNo: '',
      singleSelect: false,
      selected: [],
      modelDialog: false,
      searchText: '',
      manualAddPresenter: false,
      deletePopUpPresenter: {},
      Headers: [
        {
          text: 'Name',
          value: 'Name',
          sortable: true,
          align: 'start',
          width: '30%'
        },
        {
          text: 'CRD',
          value: 'CRD',
          sortable: true,
          align: 'start',
          width: '30%'
        },
        {
          text: 'Action',
          value: '',
          sortable: false,
          width: '15%',
          align: 'center'
        }
      ],
      presenterList: [],
      pagination: {
        sortBy: 'name',
        rowsPerPage: 50,
        rowsPerPageItems: [50, 100, 150, 200]
      },
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    }
  },
  mounted() {
    this.getPresenterList()
    this.getProfile()
    this.getOptions()
  },
  methods: {
    getOptions() {
      this.loading = true
      this.$axios
        .get(`/api/v1/tal/reportoptions`)
        .then((success) => {
          if (success.data.d != null && success.data.d.length > 0) {
            this.includeDelegation = success.data.d[0].Delegation
            this.includeAboutUs = success.data.d[0].AboutUs
            this.about = success.data.d[0].AboutInfo
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    getProfile() {
      this.loading = true
      this.$axios
        .get(`/api/v1/tal/proposal/advisor`)
        .then((success) => {
          if (success.data.d !== null) {
            var advisorType = success.data.d.Type !== null && success.data.d.Type !== '' ? success.data.d.Type : 0
          }
          this.investmentManagerOnly = advisorType === 0 ? true : false
          this.investmentManagerTamp = advisorType === 1 ? true : false
        })
        .finally(() => {
          this.loading = false
        })
    },
    removeValidation() {
      this.error = false
      this.CrdMessage = ''
    },
    savePresenter() {
      var presentedBy = ''
      if (this.presenterName) presentedBy += this.presenterName + '\n'
      if (this.presenterFirmName) presentedBy += this.presenterFirmName + '\n'
      if (this.presenterAddress1) presentedBy += this.presenterAddress1 + '\n'
      if (this.presenterAddress2) presentedBy += this.presenterAddress2 + '\n'
      if (this.presenterCity) presentedBy += this.presenterCity ? this.presenterCity + ', ' : ''
      if (this.presenterState) presentedBy += this.presenterState + '\n'
      if (this.presenterZip) presentedBy += this.presenterZip + '\n'
      if (this.presenterPhone) presentedBy += this.presenterPhone + '\n'
      if (this.presenterEmail) presentedBy += this.presenterEmail
      var savePresenterDetails = {
        Name: this.presenterName,
        Firm: this.presenterFirmName,
        FirmCRD: this.presenterFirmCRD ? this.presenterFirmCRD : 0,
        recordTypeId: this.recordTypeId,
        Address1: this.presenterAddress1,
        Address2: this.presenterAddress2,
        State: this.presenterState,
        City: this.presenterCity,
        Zip: this.presenterZip,
        Phone: this.presenterPhone,
        Email: this.presenterEmail,
        CRDNumber: this.crdNo ? this.crdNo : 0,
        Description: this.presenterName,
        PresentedBy: presentedBy,
        AboutUs: '',
        AboutInfo: '',
        ID: this.PresenterID
      }
      this.$axios.put(`/api/v1/tal/diagnostic/presenter`, savePresenterDetails).then((success) => {
        if (success.data.d != null) {
          if (this.crdNo > 0) this.$axios.post(`/api/v1/sfdc/contact`, savePresenterDetails)
          this.presenterMessage = 'Saved Successfully'
          this.modelDialog = false
          this.resetPresenter()
          this.getPresenterList()
        } else {
          this.presenterMessage = success.data.message
        }
      })
    },
    getPresenter() {
      if (this.crdNo) {
        this.$axios.get(`/api/v1/tal/diagnostic/Presenter/${this.crdNo}`).then((success) => {
          var presenterData = success.data.d
          if (presenterData != null) {
            this.manualAddPresenter = true
            this.presenterName = presenterData.Name ? presenterData.Name : ''
            this.presenterFirmName = presenterData.Firm ? presenterData.Firm : ''
            this.presenterFirmCRD = presenterData.FirmCRD ? presenterData.FirmCRD : 0
            this.recordTypeId = presenterData.RecordTypeId ? presenterData.RecordTypeId : ''
            this.presenterAddress1 = presenterData.Address1 ? presenterData.Address1 : ''
            this.presenterAddress2 = presenterData.Address2 ? presenterData.Address2 : ''
            this.presenterCity = presenterData.City ? presenterData.City : ''
            this.presenterState = presenterData.State ? presenterData.State : ''
            this.presenterZip = presenterData.Zip ? presenterData.Zip : ''
            this.presenterPhone = presenterData.Phone ? presenterData.Phone : ''
            this.presenterEmail = presenterData.Email ? presenterData.Email : ''
          } else {
            this.error = false
            this.CrdMessage = 'You must enter a valid CRD# to continue.'
            this.crdNo = ''
            this.$refs.crd.focus()
          }
        })
      } else {
        this.error = false
        this.CrdMessage = 'You must enter a valid CRD# to continue.'
        this.crdNo = ''
        this.$refs.crd.focus()
      }
    },
    getPresenterList() {
      this.$axios.get(`/api/v1/tal/diagnostic/presenters`).then((success) => {
        this.presenterList = success.data.d.length > 0 ? success.data.d : []
        this.presenterListLoading = false
      })
    },
    change() {
      this.discription =
        this.name +
        '\n ' +
        this.firm +
        '\n ' +
        this.address1 +
        '\n ' +
        this.address2 +
        '\n ' +
        this.city +
        ', ' +
        this.state +
        ' ' +
        this.zip +
        '\n ' +
        this.phone +
        '\n ' +
        this.email
    },
    showModelDialog() {
      this.PresenterID = 0
      this.crdNo = ''
      this.modelDialog = true
      this.manualAddPresenter = false
    },
    resetPresenter() {
      this.modelDialog = false
      this.presenterName = ''
      this.presenterFirmName = ''
      this.presenterAddress1 = ''
      this.presenterAddress2 = ''
      this.presenterCity = ''
      this.presenterState = ''
      this.presenterZip = ''
      this.presenterPhone = ''
      this.presenterEmail = ''
      this.crdNo = ''
      this.presenterFirmCRD = 0
    },
    deletePresenter(presenter) {
      var presenterId = []
      if (presenter) {
        presenterId.push(presenter.ID)
      } else {
        presenterId = this.selected.map((a) => a.ID)
      }
      if (presenterId.length > 0) {
        this.$axios
          .delete(`/api/v1/reportoptions/presenter`, {
            data: presenterId
          })
          // eslint-disable-next-line no-unused-vars
          .then((success) => {
            this.dialog = false
            this.getPresenterList()
          })
      }
    },
    editPresenter(presentedById, crdNo) {
      this.PresenterID = presentedById
      this.$axios.get(`/api/v1/reportoptions/presenter/${presentedById}`).then((success) => {
        if (success.data.d != null && success.data.d.length > 0) {
          this.modelDialog = true
          this.manualAddPresenter = true
          var presenter = success.data.d[0]
          this.crdNo = crdNo.trim() === '' ? 0 : crdNo
          this.presenterName = presenter.Name ? presenter.Name : ''
          this.presenterFirmName = presenter.Firm ? presenter.Firm : ''
          this.presenterAddress1 = presenter.Address1 ? presenter.Address1 : ''
          this.presenterAddress2 = presenter.Address2 ? presenter.Address2 : ''
          this.presenterState = presenter.State ? presenter.State : ''
          this.presenterCity = presenter.City ? presenter.City : ''
          this.presenterZip = presenter.Zip ? presenter.Zip : ''
          this.presenterPhone = presenter.Phone ? presenter.Phone : ''
          this.presenterEmail = presenter.Email ? presenter.Email : ''
        }
      })
    },
    longTapFunction: function (event, data) {
      this.longtap = true
      var checkSelect = this.selected.find((a) => a.ID === data.ID)
      if (checkSelect == null) {
        data['selectedRow'] = true
        this.selected.push(data)
      } else {
        data['selectedRow'] = false
        this.selected.forEach((element, index) => {
          if (element.ID === data.ID) this.selected.splice(index, 1)
        })
      }
      if (this.selected.length === 0) this.longtap = false
    },
    selectAllToggle() {
      if (this.selected.length !== this.presenterList.length) {
        this.selected = []
        this.selected = this.presenterList.slice()
        this.selected.forEach((element) => {
          element['selectedRow'] = true
        })
      } else this.selected = []
    }
  }
}
</script>
