<template>
  <v-flex>
    <v-row class="justify-center">
      <v-flex>
        <v-row class="justify-center">
          <v-flex lg7>
            <v-flex class="text-center" pb-5 pt-2>
              <h1>Balance Transfer</h1>
            </v-flex>
            <v-flex class="text-center" pb-5 pt-2>
              <h3>
                Add details of the accounts you wish to transfer balance from. Information collected here is for record purposes
                only and will not initiate a transfer of balances.
              </h3>
            </v-flex>
          </v-flex>
        </v-row>
        <div class="container" v-if="loader">
          <v-card :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
            <Loader :loadingText="`Loading..`" :loading="loader" />
          </v-card>
        </div>
        <v-flex v-if="transferBalanceData.length === 0 && !loader">
          <v-flex>
            <v-row justify="center">
              <v-flex pt-5 lg7 xs11>
                <v-card class="nonSelectedBackground" :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']">
                  <v-flex pt-4 px-8>
                    <v-card-text class="text-center">
                      <h3>There are currently no accounts linked to the</h3>
                      <h3>individual for balance transfer.</h3>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs12 class="text-center" pb-4>
                    <a class="font_14" :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']" @click="addAccount()"
                      ><b>Add Account</b></a
                    >
                  </v-flex>
                </v-card>
              </v-flex>
              <!--          <v-flex xs11 class="text-center">
                <v-row justify="center">
                  <v-checkbox
                    class="mt-0 changeCheckboxColor"
                    label = "The participant does not wish to transfer balance from another account"
                    v-model="transferBalanceFlag"
                    hide-details
                    @change="checkTransferBalance()">
                  </v-checkbox>
                </v-row>
              </v-flex> -->
            </v-row>
          </v-flex>
        </v-flex>
        <v-flex v-if="transferBalanceData.length >= 1 && !loader" pt-2>
          <v-flex>
            <v-container class="beneficiaryContainer justify-center" v-dragscroll="true" v-if="!loader">
              <v-flex v-for="(item, index) in transferBalanceData" :key="index" class="xl3 md4 sm5 xs11 lg4 ma-3">
                <v-card class="elevation-6" height="100%">
                  <v-row>
                    <v-flex lg11 xs11 pt-2 pb-2> </v-flex>
                    <v-flex lg1 xs1 class="deleteIconPosition">
                      <v-btn
                        icon
                        variant="text"
                        :color="!$vuetify.theme.dark ? 'error' : ''"
                        @click.stop="$set(deletePopUpTransferBalance, item.OppBalanceId, true)"
                      >
                        <v-icon size="small">fas fa-trash</v-icon>
                      </v-btn>
                      <v-dialog
                        :scrollable="false"
                        v-model="deletePopUpTransferBalance[item.OppBalanceId]"
                        max-width="350"
                        content-class="elevation-3"
                        :key="item.OppBalanceId"
                      >
                        <ActionPopUp
                          @confirmAction="deleteAccount(item.OppBalanceId)"
                          @cancelAction="$set(deletePopUpTransferBalance, item.OppBalanceId, false)"
                          confirmActionText="Delete"
                          cancelActionText="Cancel"
                          actionText="Remove Account"
                          :actionMessage="`Are you sure you want to remove <b>${
                            item.AccountProvider
                          } (${item.AccountNumber.substring(item.AccountNumber.length - 4)})</b> from balance transfer ?`"
                        />
                      </v-dialog>
                    </v-flex>
                  </v-row>
                  <v-flex :class="[$vuetify.breakpoint.xs ? '' : 'px-2 pt-6 pb-4']">
                    <v-flex class="text-center">
                      <v-flex class="text-capitalize" :class="$vuetify.breakpoint.xs ? 'text-center pt-2' : 'text-center'">
                        <h2>{{ item.AccountProvider }}</h2>
                      </v-flex>
                      <v-flex class="text-capitalize" :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-center'" py-2>
                        <v-row justify="center">
                          <h3><b>Account Number : </b></h3>
                          <h3 class="pl-1">
                            <b>{{ item.AccountNumber }}</b>
                          </h3>
                        </v-row>
                      </v-flex>
                      <v-flex :class="$vuetify.breakpoint.xs ? 'text-center' : 'text-center'">
                        <v-row justify="center">
                          <h3>Account Balance :</h3>
                          <h3 class="pl-1">${{ formatNumber(item.AccountBalance) }}</h3>
                        </v-row>
                      </v-flex>
                    </v-flex>
                  </v-flex>
                  <v-flex>
                    <v-divider class="divider"></v-divider>
                    <v-flex lg12>
                      <v-row>
                        <v-flex pt-4 pb-4 class="text-center">
                          <a
                            class="font_14"
                            :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']"
                            @click="editAccountDetails(item.OppBalanceId)"
                            ><b>Edit Account Info</b></a
                          >
                        </v-flex>
                      </v-row>
                    </v-flex>
                  </v-flex>
                </v-card>
              </v-flex>
            </v-container>
            <v-flex xs12 class="text-center" pt-5>
              <a class="font_14" :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']" @click="addOtherAccount()"
                ><b>Add Account</b></a
              >
            </v-flex>
          </v-flex>
        </v-flex>
        <v-flex pt-2>
          <v-flex class="text-center">
            <v-btn
              class="text-capitalize"
              :color="$vuetify.theme.dark ? '' : 'accent'"
              :disabled="disableNextButton"
              @click="nextSlide()"
              >Next</v-btn
            >
          </v-flex>
          <v-flex pt-4>
            <a class="font_14" :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']" @click="nextSlide()"
              ><b>Skip, I'll do this later</b></a
            >
          </v-flex>
        </v-flex>
      </v-flex>
    </v-row>
    <v-flex v-if="addAccountFlag" xs12 lg12 pt-16 pb-12 class="justify-center">
      <v-dialog
        v-model="addAccountFlag"
        persistent
        class="elevation-3"
        :class="dialogPositionNew"
        :content-class="dialogPositionNew"
        scrollable
        :eager="true"
        :max-width="dialogWidth"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-card-title>
            <v-flex xs12>
              <v-flex class="text-right">
                <v-icon color="accent" @click="closeAddAccountDialog()">close</v-icon>
              </v-flex>
            </v-flex>
          </v-card-title>
          <v-card-text :class="$vuetify.breakpoint.xs ? 'pa-4' : 'pa-0'">
            <v-row class="justify-center">
              <v-flex xs12 lg8 pt-2 class="justify-center">
                <v-flex xs12 class="text-center" pb-2>
                  <h1>{{ addOrEditText }} Account</h1>
                </v-flex>
                <v-flex xs12 class="text-center" pb-2>
                  <h3>{{ addOrEditText }} details of the account you wish to transfer balance from</h3>
                </v-flex>
                <v-form ref="form" v-model="valid">
                  <v-flex py-4>
                    <v-flex lg12>
                      <v-flex class="justify-center" :class="$vuetify.breakpoint.xs ? '' : 'ml-16'">
                        <v-row no-gutters>
                          <v-flex xl6 lg6 md6 sm6 xs12 :class="$vuetify.breakpoint.xs ? 'px-3' : 'pl-6'">
                            <v-flex class="text-h6 text-left">Account Provider</v-flex>
                            <v-text-field
                              v-model="accountProvider"
                              placeholder="Account Provider"
                              variant="outlined"
                              density="compact"
                              single-line
                              hide-details
                              required
                              :rules="[(v) => !!v || 'Account Provider is required']"
                              maxlength="100"
                            ></v-text-field>
                          </v-flex>
                        </v-row>
                        <v-row no-gutters>
                          <v-flex xl6 lg6 md6 sm6 xs12 :class="$vuetify.breakpoint.xs ? 'px-3' : 'pl-6'" pt-2>
                            <v-flex class="justify-center">
                              <v-flex class="text-h6 text-left">Account Number</v-flex>
                            </v-flex>
                            <v-text-field
                              v-model="accountNumber"
                              placeholder="Account Number"
                              variant="outlined"
                              density="compact"
                              single-line
                              hide-details
                              required
                              :rules="[(v) => !!v || 'Account Number is required']"
                              maxlength="20"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xl4 lg4 md4 sm4 xs12 :class="$vuetify.breakpoint.xs ? 'px-3' : 'pl-6'" pt-2>
                            <v-flex class="justify-center">
                              <v-flex class="text-h6 text-left">Account Balance</v-flex>
                            </v-flex>
                            <v-text-field
                              v-model="accountBalance"
                              placeholder="Balance"
                              v-input-mask="{
                                alias: 'currency',
                                rightAlign: false,
                                autoUnmask: true,
                                allowMinus: false,
                                digitsOptional: true,
                                placeholder: '0'
                              }"
                              variant="outlined"
                              density="compact"
                              single-line
                              hide-details
                              required
                              :rules="[(v) => !!v || 'Account Balance is required']"
                              maxlength="15"
                            ></v-text-field>
                          </v-flex>
                        </v-row>
                      </v-flex>
                    </v-flex>
                  </v-flex>
                  <v-row class="justify-center">
                    <v-flex sm5 pt-3 :class="$vuetify.breakpoint.xs ? 'pl-6' : ''">
                      <v-btn
                        class="text-capitalize"
                        :color="$vuetify.theme.dark ? '' : 'accent'"
                        :disabled="!valid"
                        @click="saveAccount()"
                        >{{ addOrEditText === 'Edit' ? 'Save Changes' : 'Add Account' }}</v-btn
                      >
                    </v-flex>
                  </v-row>
                </v-form>
              </v-flex>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-flex>
</template>

<script>
import ActionPopUp from '@/components/ActionPopUp'
import Loader from '@/components/NewLoader'
export default {
  data() {
    return {
      addAccountFlag: false,
      transferBalanceFlag: false,
      valid: false,
      showDetails: false,
      loader: false,
      transferBalanceData: [],
      deletePopUpTransferBalance: {},
      addanotherAccount: false,
      addOrEditText: '',
      disableNextButton: true,
      accountProvider: '',
      accountNumber: '',
      accountBalance: 0,
      oppBalanceId: '',
      lastDigits: ''
    }
  },
  computed: {
    dialogWidth() {
      if (this.$vuetify.breakpoint.xlOnly) return '55%'
      else if (this.$vuetify.breakpoint.lgOnly) return '70%'
      else return '90%'
    },
    dialogPositionNew() {
      if (this.$vuetify.breakpoint.xlOnly) {
        return `dialogBigScreen`
      } else if (this.$vuetify.breakpoint.lgOnly) {
        return `dialoglgScreen`
      } else if (this.$vuetify.breakpoint.mdOnly) return `dialogMdScreen`
      else if (this.$vuetify.breakpoint.smOnly) return `dialogSmScreen`
      else return `dialoglgScreen`
    }
  },
  props: ['opportunityId'],
  components: {
    ActionPopUp,
    Loader
  },
  mounted() {
    this.getAllTransferAccounts()
  },
  methods: {
    goToNextWindow() {
      this.$emit('goToNextWindow')
      //this.saveAllTransferAccounts()
    },
    nextSlide() {
      this.$emit('nextSlide')
    },
    addAccount() {
      this.addAccountFlag = true
      this.addOrEditText = 'Add'
    },
    closeAddAccountDialog() {
      this.addAccountFlag = false
    },
    saveAccount() {
      this.showDetails = true
      this.addAccountFlag = false
      this.disableNextButton = false
      this.transferBalanceData = []
      let transferAccountFormDetails = {
        AccountProvider: this.accountProvider ? this.accountProvider : '',
        AccountNumber: this.accountNumber ? this.accountNumber : '',
        AccountBalance: this.accountBalance ? parseFloat(this.accountBalance) : 0,
        OpportunityId: this.opportunityId ? this.opportunityId : '',
        OppBalanceId: this.addOrEditText === 'Edit' ? this.oppBalanceId : 0
      }
      this.transferBalanceData.push(transferAccountFormDetails)
      this.saveAllTransferAccounts()
    },
    saveAllTransferAccounts() {
      this.loader = true
      var transferAccountFormDetails = []
      this.transferBalanceData.forEach((element) => {
        var transferAccountForm = {
          OpportunityId: element.OpportunityId,
          AccountProvider: element.AccountProvider,
          AccountBalance: element.AccountBalance,
          AccountNumber: element.AccountNumber,
          OppBalanceId: element.OppBalanceId
        }
        transferAccountFormDetails.push(transferAccountForm)
      })
      this.$axios
        .post(`/api/v1/tal/opportunity/${this.opportunityId}/balancetransfer`, transferAccountFormDetails)
        .then((success) => {
          if (success.data.d != null) {
            this.loader = false
            this.getAllTransferAccounts()
          }
        })
        .catch(() => {
          this.loader = false
        })
    },
    getAllTransferAccounts() {
      this.loader = true
      this.$axios
        .get(`/api/v1/tal/opportunity/${this.opportunityId}/balancetransfer/getall`)
        .then((success) => {
          this.transferBalanceData = success.data.d ? success.data.d : []
          if (this.transferBalanceData.length >= 1) {
            this.disableNextButton = false
          } else {
            this.disableNextButton = true
          }
          this.loader = false
        })
        .catch(() => {
          this.loader = false
        })
    },
    addOtherAccount() {
      this.addAccountFlag = true
      this.addanotherAccount = true
      this.addOrEditText = 'Add'
      this.resetData()
    },
    editAccountDetails(val) {
      this.addAccountFlag = true
      this.addOrEditText = 'Edit'
      this.oppBalanceId = val
      var newFilteredData = this.transferBalanceData.filter((x) => x.OppBalanceId === val)
      this.accountProvider = newFilteredData[0].AccountProvider
      this.accountNumber = newFilteredData[0].AccountNumber
      this.accountBalance = newFilteredData[0].AccountBalance
    },
    /*     checkTransferBalance() {
      this.disableNextButton = !this.disableNextButton
    }, */
    deleteAccount(OppBalanceId) {
      this.$axios
        .delete(`/api/v1/tal/opportunity/${OppBalanceId}/balancetransfer/delete`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          let deletePosition = this.transferBalanceData.findIndex((a) => a.OppBalanceId === OppBalanceId)
          if (deletePosition > -1) this.transferBalanceData.splice(deletePosition, 1)
          this.getAllTransferAccounts()
          this.dialogDelete = false
        })
    },
    resetData() {
      this.accountProvider = ''
      this.accountNumber = ''
      this.accountBalance = 0
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
.beneficiaryContainer {
  display: -webkit-box !important;
  overflow-x: hidden;
}
</style>
