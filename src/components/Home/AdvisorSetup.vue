<template>
  <v-col cols="12" class="pa-0">
    <v-row class="justify-center">
      <v-col v-if="showModel" cols="12" sm="6" lg="4" xl="3">
        <v-card v-if="showModelLoader" class="pa-0 elevation-3" :height="fontSize > 12 ? '28.462em' : '32.5em'">
          <v-progress-linear indeterminate color="accent" height="4" class="ma-0" />
        </v-card>
        <v-card
          v-if="!showModelLoader"
          class="pa-5 elevation-3"
          :height="fontSize > 12 ? (isXsOnly ? '' : '28.462em') : isXsOnly ? '' : '32.5em'"
        >
          <v-col v-if="showModel" cols="12" class="pa-0">
            <v-col cols="12" class="pa-0">
              <h6 class="text-h6 font_20 pb-2">Models</h6>
            </v-col>
            <v-col v-if="showManageModel" class="pa-0">
              <v-col cols="12" class="pb-2 pt-2 pl-0 pr-0">
                <v-row>
                  <v-col cols="7" class="pa-0">
                    <h4 class="font_14 text-accent">Total Model Investments</h4>
                  </v-col>
                  <v-col cols="5" class="pa-0">
                    <h4 class="text-right font_14">
                      {{ totalModelInvestments }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-2 pt-2 pl-0 pr-0">
                <v-row>
                  <v-col cols="7" class="pa-0">
                    <h4 class="font_14 text-accent">Total Plans Assigned</h4>
                  </v-col>
                  <v-col cols="5" class="pa-0">
                    <h4 class="text-right font_14">
                      {{ totalPlansAssigned }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-2 pt-2 pl-0 pr-0">
                <v-row>
                  <v-col cols="7" class="pa-0">
                    <h4 class="font_14 text-accent">Total Individual Accounts</h4>
                  </v-col>
                  <v-col cols="5" class="pa-0">
                    <h4 class="text-right font_14">
                      {{ totalIndividualAccounts }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-2 pt-2 pl-0 pr-0">
                <v-row>
                  <v-col cols="7" class="pa-0">
                    <h4 class="font_14 text-accent">Total Balance</h4>
                  </v-col>
                  <v-col cols="5" class="pa-0">
                    <h4 class="text-right font_14">
                      {{ formatNumber(totalBalance, 'currency', 0) }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-else class="zeroflex pa-0">
              <v-col class="pa-10 text-center bg-grey-lighten-4">
                <h3>You have no models set up.</h3>
                <h3>Go ahead create some!</h3>
              </v-col>
            </v-col>
            <v-col
              cols="12"
              class="text-left"
              :class="[isXsOnly ? 'pt-5 pb-0 pl-0 pr-0' : 'pa-0', !isXsOnly ? 'advisorWidgetButtonPosition' : '']"
            >
              <v-btn class="ml-0 mb-1" color="accent" @click="navigateToPage('/Account/Models')">
                {{ showManageModel ? 'View Models' : 'New Model' }}
              </v-btn>
            </v-col>
          </v-col>
        </v-card>
      </v-col>
      <v-col v-if="showInvestment" cols="12" sm="6" lg="4" xl="3">
        <v-card v-if="showInvestmentLoader" class="pa-0 elevation-3" :height="fontSize > 12 ? '28.462em' : '32.5em'">
          <v-progress-linear indeterminate color="accent" height="4" class="ma-0" />
        </v-card>
        <v-card
          v-if="!showInvestmentLoader"
          class="pa-5 elevation-3"
          :height="fontSize > 12 ? (isXsOnly ? '' : '28.462em') : isXsOnly ? '' : '32.5em'"
        >
          <v-col v-if="showInvestment" cols="12" class="pa-0">
            <v-col cols="12" class="pa-0">
              <h6 class="text-h6 font_20 pb-2">Investments</h6>
            </v-col>
            <v-col v-if="showManageInvestment" class="pa-0">
              <v-col cols="12" class="pb-2 pt-2 pl-0 pr-0">
                <v-row>
                  <v-col cols="7" class="pa-0">
                    <h4 class="font_14 text-accent">Total Investment Lineups</h4>
                  </v-col>
                  <v-col cols="5" class="pa-0">
                    <h4 class="text-right font_14">
                      {{ totalInvestmentLineup }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-else class="zeroflex pa-0">
              <v-col class="pa-10 text-center bg-grey-lighten-4">
                <h3>You have no investment lineup set up.</h3>
                <h3>Go ahead create some!</h3>
              </v-col>
            </v-col>
            <v-col
              cols="12"
              class="text-left"
              :class="[isXsOnly ? 'pt-5 pb-0 pl-0 pr-0' : 'pa-0', !isXsOnly ? 'advisorWidgetButtonPosition' : '']"
            >
              <v-btn class="ml-0 mb-1" color="accent" @click="navigateToPage('/Account/Investments')">
                {{ showManageInvestment ? 'View Investment Lineups' : 'New Investment Lineup' }}
              </v-btn>
            </v-col>
          </v-col>
        </v-card>
      </v-col>
      <v-col v-if="showFeeSchedule" cols="12" sm="6" lg="4" xl="3">
        <v-card v-if="showLoader" class="pa-0 elevation-3" :height="fontSize > 12 ? '28.462em' : '32.5em'">
          <v-progress-linear indeterminate color="accent" height="4" class="ma-0" />
        </v-card>
        <v-card
          v-if="!showLoader"
          class="pa-5 elevation-3"
          :height="fontSize > 12 ? (isXsOnly ? '' : '28.462em') : isXsOnly ? '' : '32.5em'"
        >
          <v-col cols="12" pb-2 class="pa-0">
            <h6 class="text-h6 font_20 pb-2">Fee Schedule</h6>
          </v-col>
          <v-col v-if="showManageFee" class="pa-0">
            <v-col v-if="showAdvisory" cols="12" class="pb-2 pt-2 pl-0 pr-0">
              <v-row>
                <v-col cols="8" class="pa-0">
                  <h4 class="font_14 text-accent">Advisory Fees</h4>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <h4 class="text-right font_14">
                    {{ advisoryFee }}
                  </h4>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="showAdminstration" cols="12" class="pb-2 pt-2 pl-0 pr-0">
              <v-row>
                <v-col cols="8" class="pa-0">
                  <h4 class="font_14 text-accent">Administration Fee Schedules</h4>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <h4 class="text-right font_14">
                    {{ adminisitrationFee }}
                  </h4>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="showInvestmentManager" cols="12" class="pb-2 pt-2 pl-0 pr-0">
              <v-row>
                <v-col cols="8" class="pa-0">
                  <h4 class="font_14 text-accent">Investment Manager Fee Schedules</h4>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <h4 class="text-right font_14">
                    {{ investmentManagerFee }}
                  </h4>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="showCustodian" cols="12" class="pb-2 pt-2 pl-0 pr-0">
              <v-row>
                <v-col cols="8" class="pa-0">
                  <h4 class="font_14 text-accent">Custodian Fee Schedules</h4>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <h4 class="text-right font_14">
                    {{ custodianFee }}
                  </h4>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="showRecordKeeping" cols="12" class="pb-2 pt-2 pl-0 pr-0">
              <v-row>
                <v-col cols="8" class="pa-0">
                  <h4 class="font_14 text-accent">Recordkeeping Fee Schedules</h4>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <h4 class="text-right font_14">
                    {{ recordKeepingFee }}
                  </h4>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col v-else class="zeroflex pa-0">
            <v-col class="pa-10 text-center bg-grey-lighten-4">
              <h3>You have no fee schedule set up.</h3>
              <h3>Go ahead create some!</h3>
            </v-col>
          </v-col>
          <v-col
            cols="12"
            class="text-left"
            :class="[isXsOnly ? 'pt-5 pb-0 pl-0 pr-0' : 'pa-0', !isXsOnly ? 'advisorWidgetButtonPosition' : '']"
          >
            <v-btn class="ml-0 mb-1" color="accent" @click="navigateToPage('/Account/FeeEngine')">
              {{ showManageFee ? 'View Fee Schedules' : 'New Fee Schedule' }}
            </v-btn>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import qs from 'qs'
import { computed, ref, onMounted, onBeforeUnmount, getCurrentInstance, inject, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
export default {
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const route = useRouter()
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const showLoader = ref(false)
    const showModelLoader = ref(false)
    const showManageModel = ref(false)
    const showManageFee = ref(false)
    const showInvestmentLoader = ref(false)
    const showManageInvestment = ref(false)
    const recordKeepingFee = ref(0)
    const custodianFee = ref(0)
    const investmentManagerFee = ref(0)
    const adminisitrationFee = ref(0)
    const advisoryFee = ref(0)
    const totalBalance = ref(0)
    const totalIndividualAccounts = ref(0)
    const totalModelInvestments = ref(0)
    const totalPlansAssigned = ref(0)
    const totalInvestmentLineup = ref(0)
    const isXsOnly = ref(false)
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
    })
    //computed
    const fontSize = computed(() => {
      return '13'
    })
    const showFeeSchedule = computed(() => {
      if (
        $authz.hasRole($authz.roles.SiteAdmin) ||
        $authz.hasRole($authz.roles.InternalAdmin) ||
        $authz.hasRole($authz.roles.ProgramAdmin)
      ) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_create_Fee_Schedule__c, $authz.permission.Full) &&
          !$authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.None)
        )
      } else if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_create_Fee_Schedule__c, $authz.permission.Full) &&
          !$authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.None)
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_create_Fee_Schedule__c, $authz.permission.Full) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Advisors_Firms_to_create_Fee_Schedules__c,
            $authz.permission.Full
          ) &&
          !$authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.None)
        )
      } else return false
    })

    const showModel = computed(() => {
      if (
        $authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full) ||
        $authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.ViewOnly)
      ) {
        return true
      } else return false
    })
    const showInvestment = computed(() => {
      if (
        $authz.hasPermission($authz.permissionSet.Investment_Lineup__c, $authz.permission.Full) ||
        $authz.hasPermission($authz.permissionSet.Investment_Lineup__c, $authz.permission.ViewOnly)
      ) {
        return true
      } else return false
    })
    const showRecordKeeping = computed(() => {
      if ($authz.hasPermission($authz.permissionSet.Fee_Engine_Recordkeeping__c, $authz.permission.None)) {
        return false
      } else return true
    })
    const showCustodian = computed(() => {
      if ($authz.hasPermission($authz.permissionSet.Fee_Engine_Custodian__c, $authz.permission.None)) {
        return false
      } else return true
    })
    const showInvestmentManager = computed(() => {
      if ($authz.hasPermission($authz.permissionSet.Fee_Engine_Investment_Manager__c, $authz.permission.None)) {
        return false
      } else return true
    })
    const showAdvisory = computed(() => {
      if ($authz.hasPermission($authz.permissionSet.Fee_Engine_Advisory__c, $authz.permission.None)) {
        return false
      } else return true
    })
    const showAdminstration = computed(() => {
      if ($authz.hasPermission($authz.permissionSet.Fee_Engine_Administration__c, $authz.permission.None)) {
        return false
      } else return true
    })

    //methods
    function navigateToPage(value) {
      if (value) {
        route.push(value).catch(() => {})
      }
    }
    function getModel() {
      showModelLoader.value = true
      showManageModel.value = false
      var accountId = []
      var contactId = []
      if (Object.keys($store.state.globalFilter).length > 0) {
        if ($store.state.globalFilter.firm && $store.state.globalFilter.firm.length > 0) {
          accountId = $store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if ($store.state.globalFilter.advisor && $store.state.globalFilter.advisor.length > 0) {
          contactId = $store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      $axios
        .get(`/api/v1/advisor/setup/model`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          var models = success.data.d && success.data.d.length > 0 ? success.data.d : []
          if (models && models.length > 0) {
            totalBalance.value = models[0].TotalBalance ? models[0].TotalBalance : 0
            totalIndividualAccounts.value = models[0].TotalIndividualAccounts ? models[0].TotalIndividualAccounts : 0
            totalModelInvestments.value = models[0].TotalModelInvestments ? models[0].TotalModelInvestments : 0
            totalPlansAssigned.value = models[0].TotalPlansAssigned ? models[0].TotalPlansAssigned : 0

            if (
              totalBalance.value === 0 &&
              totalIndividualAccounts.value === 0 &&
              totalModelInvestments.value === 0 &&
              totalPlansAssigned.value === 0
            ) {
              showManageModel.value = false
            } else showManageModel.value = true
          } else {
            totalBalance.value = 0
            totalIndividualAccounts.value = 0
            totalModelInvestments.value = 0
            totalPlansAssigned.value = 0
            showManageModel.value = false
          }
          showModelLoader.value = false
        })
        .catch(() => {
          showModelLoader.value = false
          totalBalance.value = 0
          totalIndividualAccounts.value = 0
          totalModelInvestments.value = 0
          totalPlansAssigned.value = 0
          showManageModel.value = false
        })
    }
    function getInvestment() {
      showInvestmentLoader.value = true
      showManageInvestment.value = false
      var accountId = []
      var contactId = []
      if (Object.keys($store.state.globalFilter).length > 0) {
        if ($store.state.globalFilter.firm && $store.state.globalFilter.firm.length > 0) {
          accountId = $store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if ($store.state.globalFilter.advisor && $store.state.globalFilter.advisor.length > 0) {
          contactId = $store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      $axios
        .get(`/api/v1/tal/proposal/0/funds`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          totalInvestmentLineup.value = success.data.d && success.data.d.length > 0 ? success.data.d.length : 0
          showManageInvestment.value = totalInvestmentLineup.value === 0 ? false : true
          showInvestmentLoader.value = false
        })
        .catch(() => {
          showInvestmentLoader.value = false
          totalInvestmentLineup.value = 0
          showManageInvestment.value = false
        })
    }
    function getFeeSchedule() {
      showLoader.value = true
      showManageFee.value = false
      var accountId = []
      var contactId = []
      if (Object.keys($store.state.globalFilter).length > 0) {
        if ($store.state.globalFilter.firm && $store.state.globalFilter.firm.length > 0) {
          accountId = $store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if ($store.state.globalFilter.advisor && $store.state.globalFilter.advisor.length > 0) {
          contactId = $store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      $axios
        .get(`/api/v1/advisor/setup/feeschedules`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          var feeSchedule = success.data.d && success.data.d.length > 0 ? success.data.d : []
          if (feeSchedule && feeSchedule.length > 0) {
            advisoryFee.value = feeSchedule[0].Advisory ? feeSchedule[0].Advisory : 0
            adminisitrationFee.value = feeSchedule[0].Administration ? feeSchedule[0].Administration : 0
            investmentManagerFee.value = feeSchedule[0].InvestmentManager ? feeSchedule[0].InvestmentManager : 0
            custodianFee.value = feeSchedule[0].Custodian ? feeSchedule[0].Custodian : 0
            recordKeepingFee.value = feeSchedule[0].Recordkeeping ? feeSchedule[0].Recordkeeping : 0
            if (
              advisoryFee.value === 0 &&
              adminisitrationFee.value === 0 &&
              investmentManagerFee.value === 0 &&
              custodianFee.value === 0 &&
              recordKeepingFee.value === 0
            ) {
              showManageFee.value = false
            } else showManageFee.value = true
          } else {
            advisoryFee.value = 0
            adminisitrationFee.value = 0
            investmentManagerFee.value = 0
            custodianFee.value = 0
            recordKeepingFee.value = 0
            showManageFee.value = false
          }
          showLoader.value = false
        })
        .catch(() => {
          showLoader.value = false
          advisoryFee.value = 0
          adminisitrationFee.value = 0
          investmentManagerFee.value = 0
          custodianFee.value = 0
          recordKeepingFee.value = 0
          showManageFee.value = false
        })
    }
    function loadFeeSchedule() {
      showLoader.value = true
      showManageFee.value = false
      $store
        .dispatch('getFeeSchedule')
        .then(() => {
          var feeSchedule = $store.state.advisorSetFeeSchedule
          if (feeSchedule && feeSchedule.length > 0) {
            advisoryFee.value = feeSchedule[0].Advisory ? feeSchedule[0].Advisory : 0
            adminisitrationFee.value = feeSchedule[0].Administration ? feeSchedule[0].Administration : 0
            investmentManagerFee.value = feeSchedule[0].InvestmentManager ? feeSchedule[0].InvestmentManager : 0
            custodianFee.value = feeSchedule[0].Custodian ? feeSchedule[0].Custodian : 0
            recordKeepingFee.value = feeSchedule[0].Recordkeeping ? feeSchedule[0].Recordkeeping : 0
            if (
              advisoryFee.value === 0 &&
              adminisitrationFee.value === 0 &&
              investmentManagerFee.value === 0 &&
              custodianFee.value === 0 &&
              recordKeepingFee.value === 0
            ) {
              showManageFee.value = false
            } else showManageFee.value = true
          } else {
            advisoryFee.value = 0
            adminisitrationFee.value = 0
            investmentManagerFee.value = 0
            custodianFee.value = 0
            recordKeepingFee.value = 0
            showManageFee.value = false
          }
          showLoader.value = false
        })
        .catch(() => {
          advisoryFee.value = 0
          adminisitrationFee.value = 0
          investmentManagerFee.value = 0
          custodianFee.value = 0
          recordKeepingFee.value = 0
          showLoader.value = false
          showManageFee.value = false
        })
    }
    function loadModel() {
      showModelLoader.value = true
      showManageModel.value = false
      if ($store.state.user.reliusLoginId !== null && $store.state.user.reliusLoginId !== '') {
        $store
          .dispatch('getModel')
          .then(() => {
            var models = $store.state.advisorSetModel
            if (models && models.length > 0) {
              totalBalance.value = models[0].TotalBalance ? models[0].TotalBalance : 0
              totalIndividualAccounts.value = models[0].TotalIndividualAccounts ? models[0].TotalIndividualAccounts : 0
              totalModelInvestments.value = models[0].TotalModelInvestments ? models[0].TotalModelInvestments : 0
              totalPlansAssigned.value = models[0].TotalPlansAssigned ? models[0].TotalPlansAssigned : 0
              if (
                totalBalance.value === 0 &&
                totalIndividualAccounts.value === 0 &&
                totalModelInvestments.value === 0 &&
                totalPlansAssigned.value === 0
              ) {
                showManageModel.value = false
              } else showManageModel.value = true
            } else {
              totalBalance.value = 0
              totalIndividualAccounts.value = 0
              totalModelInvestments.value = 0
              totalPlansAssigned.value = 0
              showManageModel.value = false
            }
            showModelLoader.value = false
          })
          .catch(() => {
            totalBalance.value = 0
            totalIndividualAccounts.value = 0
            totalModelInvestments.value = 0
            totalPlansAssigned.value = 0
            showModelLoader.value = false
            showManageModel.value = false
          })
      } else {
        totalBalance.value = 0
        totalIndividualAccounts.value = 0
        totalModelInvestments.value = 0
        totalPlansAssigned.value = 0
        showModelLoader.value = false
        showManageModel.value = false
      }
    }
    function loadInvestment() {
      showInvestmentLoader.value = true
      showManageInvestment.value = false
      $store
        .dispatch('getInvestment')
        .then(() => {
          var investment = $store.state.advisorSetInvestment
          totalInvestmentLineup.value = investment && investment.length > 0 ? investment.length : 0
          showManageInvestment.value = totalInvestmentLineup.value === 0 ? false : true
          showInvestmentLoader.value = false
        })
        .catch(() => {
          totalInvestmentLineup.value = 0
          showInvestmentLoader.value = false
          showManageInvestment.value = false
        })
    }
    function formatNumber(value, type, decimal) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: type,
        currency: 'USD',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      })
      return formatter.format(value)
    }
    //mounted
    onMounted(() => {
      // eslint-disable-next-line no-unused-vars
      eventBus.on('filterGlobalData', (data) => {
        if (showFeeSchedule.value) getFeeSchedule()
        if (showModel.value) getModel()
        if (showInvestment.value) getInvestment()
      })
      if (showFeeSchedule.value) loadFeeSchedule()
      if (showModel.value) loadModel()
      if (showInvestment.value) loadInvestment()
    })

    //unmount
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })

    return {
      showLoader,
      recordKeepingFee,
      custodianFee,
      investmentManagerFee,
      adminisitrationFee,
      advisoryFee,
      showModelLoader,
      totalBalance,
      totalIndividualAccounts,
      totalModelInvestments,
      totalPlansAssigned,
      showManageModel,
      showManageFee,
      totalInvestmentLineup,
      showInvestmentLoader,
      showManageInvestment,
      showAdminstration,
      showAdvisory,
      showInvestmentManager,
      showCustodian,
      showRecordKeeping,
      showModel,
      showInvestment,
      display,
      fontSize,
      showFeeSchedule,
      isXsOnly,
      navigateToPage,
      getModel,
      getInvestment,
      getFeeSchedule,
      loadFeeSchedule,
      loadModel,
      loadInvestment,
      formatNumber
    }
  }
}
</script>
<style scoped>
.zeroflex {
  align-content: center;
  align-items: center;
  display: flex;
  height: 19em;
  justify-content: center;
}
</style>
