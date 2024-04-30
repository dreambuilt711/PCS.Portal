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
            <v-col xs12 class="text-center mb-2 mt-8">
              <h1 class="welcomeFont mb-2">Transferring a balance from another Account?</h1>
              <h3>Please provide account provider and balance of any account funds you would like</h3>
              <h3>to transfer to your new retirement account</h3>
            </v-col>
            <div v-if="loader" class="container">
              <v-card :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                <Loader :loading-text="`Loading..`" :loading="loader" />
              </v-card>
            </div>
            <v-col v-if="transferBalanceData.length === 0 && !loader" mb-5>
              <v-col>
                <v-row justify="center">
                  <v-col pt-5 lg7 xs11>
                    <v-card
                      class="nonSelectedBackground"
                      :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']"
                    >
                      <v-col pt-4 px-8>
                        <v-card-text class="text-center">
                          <h3>There are currently no accounts linked to the</h3>
                          <h3>individual for balance transfer.</h3>
                        </v-card-text>
                      </v-col>
                      <v-col xs12 class="text-center" pb-4>
                        <a
                          class="font_14"
                          :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                          @click="addAccount()"
                          ><b>Add Account</b></a
                        >
                      </v-col>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-if="transferBalanceData.length >= 1 && !loader" pt-2 mb-5>
              <v-col>
                <v-container v-if="!loader" v-dragscroll="true" class="beneficiaryContainer justify-center">
                  <v-col v-for="(item, index) in transferBalanceData" :key="index" class="xl3 md4 sm5 xs11 lg4 ma-3">
                    <v-card class="elevation-6" height="100%">
                      <v-row>
                        <v-col lg11 xs11 pt-2 pb-2 />
                        <v-col lg1 xs1 class="deleteIconPosition">
                          <v-btn
                            icon
                            variant="text"
                            :color="!$vuetify?.theme.dark ? 'error' : ''"
                            @click.stop="$set(deletePopUpTransferBalance, item.OppBalanceId, true)"
                          >
                            <v-icon size="small"> fas fa-trash </v-icon>
                          </v-btn>
                          <v-dialog
                            :key="item.OppBalanceId"
                            v-model="deletePopUpTransferBalance[item.OppBalanceId]"
                            :scrollable="false"
                            max-width="350"
                            content-class="elevation-3"
                          >
                            <ActionPopUp
                              confirm-action-text="Delete"
                              cancel-action-text="Cancel"
                              action-text="Remove Account"
                              :action-message="`Are you sure you want to remove <b>${item.AccountProvider} (${
                                item.AccountNumber ? item.AccountNumber.substring(item.AccountNumber.length - 4) : ''
                              })</b> from balance transfer ?`"
                              @confirm-action="deleteAccount(item.OppBalanceId)"
                              @cancel-action="$set(deletePopUpTransferBalance, item.OppBalanceId, false)"
                            />
                          </v-dialog>
                        </v-col>
                      </v-row>
                      <v-col :class="[$vuetify?.breakpoint?.xs ? '' : 'px-2 pt-6 pb-4']">
                        <v-col class="text-center">
                          <v-col class="text-capitalize" :class="$vuetify?.breakpoint?.xs ? 'text-center pt-2' : 'text-center'">
                            <h2>{{ item.AccountProvider }}</h2>
                          </v-col>
                          <v-col class="text-capitalize" :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'text-center'" py-2>
                            <v-row justify="center">
                              <h3><b>Account Number : </b></h3>
                              <h3 class="pl-1">
                                <b>{{ item.AccountNumber }}</b>
                              </h3>
                            </v-row>
                          </v-col>
                          <v-col :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'text-center'">
                            <v-row justify="center">
                              <h3>Account Balance :</h3>
                              <h3 class="pl-1">${{ formatNumber(item.AccountBalance) }}</h3>
                            </v-row>
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
                                @click="editAccountDetails(item.OppBalanceId)"
                                ><b>Edit Account Info</b></a
                              >
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-card>
                  </v-col>
                </v-container>
                <v-col xs12 class="text-center" pt-5>
                  <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="addOtherAccount()"
                    ><b>Add Account</b></a
                  >
                </v-col>
              </v-col>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <v-col v-if="addAccountFlag" xs12 lg10 pt-16 pb-12 class="justify-center">
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
            <v-col xs12>
              <v-col class="text-right">
                <v-icon color="accent" @click="closeAddAccountDialog()"> close </v-icon>
              </v-col>
            </v-col>
          </v-card-title>
          <v-card-text :class="$vuetify?.breakpoint?.xs ? 'pa-4' : 'pa-0'">
            <v-row class="justify-center">
              <v-col xs12 lg8 pt-2 class="justify-center">
                <v-col xs12 class="text-center" pb-2>
                  <h1>{{ addOrEditText }} Account</h1>
                </v-col>
                <v-col xs12 class="text-center" pb-2>
                  <h3>{{ addOrEditText }} details of the account you wish to transfer balance from</h3>
                </v-col>
                <v-form ref="form" v-model="valid">
                  <v-col py-4>
                    <v-col lg12>
                      <v-col class="justify-center" :class="$vuetify?.breakpoint?.xs ? '' : 'ml-16'">
                        <v-row no-gutters>
                          <v-col xl6 lg6 md6 sm6 xs12 :class="$vuetify?.breakpoint?.xs ? 'px-3' : 'pl-6'">
                            <v-col class="text-h6 text-left"> Account Provider </v-col>
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
                            />
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col xl6 lg6 md6 sm6 xs12 :class="$vuetify?.breakpoint?.xs ? 'px-3' : 'pl-6'" pt-2>
                            <v-col class="justify-center">
                              <v-col class="text-h6 text-left"> Account Number </v-col>
                            </v-col>
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
                            />
                          </v-col>
                          <v-col xl4 lg4 md4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'px-3' : 'pl-6'" pt-2>
                            <v-col class="justify-center">
                              <v-col class="text-h6 text-left"> Account Balance </v-col>
                            </v-col>
                            <v-text-field
                              v-model="accountBalance"
                              v-input-mask="{
                                alias: 'currency',
                                rightAlign: false,
                                autoUnmask: true,
                                allowMinus: false,
                                digitsOptional: true,
                                placeholder: '0'
                              }"
                              placeholder="Balance"
                              variant="outlined"
                              density="compact"
                              single-line
                              hide-details
                              required
                              :rules="[(v) => !!v || 'Account Balance is required']"
                              maxlength="15"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-col>
                  <v-row class="justify-center">
                    <v-col sm5 pt-3 class="text-center" :class="$vuetify?.breakpoint?.xs ? 'pl-6' : ''">
                      <v-btn
                        class="text-capitalize"
                        :color="$vuetify?.theme.dark ? '' : 'accent'"
                        :disabled="!valid"
                        @click="saveAccount()"
                      >
                        {{ addOrEditText === 'Edit' ? 'Save Changes' : 'Add Account' }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
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
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="saveTransferBalance()"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
import ActionPopUp from '@/components/ActionPopUp'
import Loader from '@/components/NewLoader'
export default {
  components: {
    ActionPopUp,
    Loader
  },
  data() {
    return {
      accountProvider: '',
      accountBalance: 0,
      valid: false,
      transferBalanceData: [],
      loader: false,
      addAccountFlag: false,
      transferBalanceFlag: false,
      showDetails: false,
      deletePopUpTransferBalance: {},
      addanotherAccount: false,
      addOrEditText: '',
      accountNumber: '',
      oppBalanceId: ''
    }
  },
  computed: {
    dialogWidth() {
      if (this.$vuetify?.breakpoint?.xlOnly) return '55%'
      else if (this.$vuetify?.breakpoint?.lgOnly) return '70%'
      else return '90%'
    },
    dialogPositionNew() {
      if (this.$vuetify?.breakpoint?.xlOnly) {
        return `dialogBigScreen`
      } else if (this.$vuetify?.breakpoint?.lgOnly) {
        return `dialoglgScreen`
      } else if (this.$vuetify?.breakpoint?.mdOnly) return `dialogMdScreen`
      else if (this.$vuetify?.breakpoint?.smOnly) return `dialogSmScreen`
      else return `dialoglgScreen`
    }
  },
  mounted() {
    this.getAllTransferAccounts()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    addAccount() {
      this.addAccountFlag = true
      this.addOrEditText = 'Add'
    },
    getAllTransferAccounts() {
      this.loader = true
      this.$axios
        .get(`/api/v1/tal/opportunity/${this.$store.state.openAccountDetail.OpportunityId}/balancetransfer/getall`)
        .then((success) => {
          this.transferBalanceData = success.data.d ? success.data.d : []
          this.loader = false
        })
        .catch(() => {
          this.loader = false
        })
    },
    closeAddAccountDialog() {
      this.addAccountFlag = false
    },
    saveAccount() {
      this.showDetails = true
      this.addAccountFlag = false
      this.transferBalanceData = []
      let transferAccountFormDetails = {
        AccountProvider: this.accountProvider ? this.accountProvider : '',
        AccountNumber: this.accountNumber ? this.accountNumber : '',
        AccountBalance: this.accountBalance ? parseFloat(this.accountBalance) : 0,
        OpportunityId: this.$store.state.openAccountDetail.OpportunityId ? this.$store.state.openAccountDetail.OpportunityId : '',
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
        .post(
          `/api/v1/tal/opportunity/${this.$store.state.openAccountDetail.OpportunityId}/balancetransfer`,
          transferAccountFormDetails
        )
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
    },
    saveTransferBalance() {
      this.$emit('goToNextWindow')
    }
  }
}
</script>
<style scoped>
.beneficiaryContainer {
  display: -webkit-box !important;
  overflow-x: hidden;
}
.nonSelectedBackground {
  background-color: #dddddd !important;
}
</style>
