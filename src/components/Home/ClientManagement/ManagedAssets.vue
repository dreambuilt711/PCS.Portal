<template>
  <v-card
    class="elevation-3"
    :height="
      fontSize > 12
        ? isXsOnly
          ? ''
          : '38.462em'
        : fontSize > 10
          ? isXsOnly
            ? ''
            : '44em'
          : fontSize > 8
            ? isXsOnly
              ? ''
              : '53em'
            : fontSize === 8 && isXsOnly
              ? ''
              : '58.500em'
    "
  >
    <v-progress-linear v-if="showLoader" indeterminate color="accent" height="4" class="ma-0" />
    <v-col cols="12" class="pa-5">
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" class="pa-0">
              <h6 class="text-h6 font_20 iconColor">Managed Assets</h6>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="!showLoader && !showError" class="pa-0">
          <v-col class="pt-2 pb-0 pl-0 pr-0">
            <v-row no-gutters>
              <v-col class="pa-0">
                <v-col cols="12" class="pa-0">
                  <span><h3 class="font-weight-medium">Total AUM</h3></span>
                </v-col>
              </v-col>
              <v-col>
                <v-col cols="12" class="pa-0 text-right">
                  <span
                    ><h3 class="font-weight-medium">
                      {{ formatPrice(totalAUM ? totalAUM : 0, 0) }}
                    </h3></span
                  >
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pt-2 pb-0 pl-0 pr-0">
            <v-card cols="12" class="elevation-2">
              <v-col class="pa-2" cols="12">
                <v-col cols="12" sm="5" class="text-right pa-0" :class="!isXsOnly ? 'selectPosition' : ''">
                  <v-select v-model="overflowType" :items="overflowListType" hide-details @update:model-value="getCashFlow()" />
                </v-col>
                <v-col v-if="cashFlowSumData.length > 0" cols="12" :class="!isXsOnly ? 'mt-12 pa-0' : 'pt-4 pb-0 pl-0 pr-0'">
                  <v-col cols="12" class="text-center pa-0">
                    <ClientBarChartWithNoData :key="componentKey" :anualizeData="cashFlowSumData" :liveWidth="screenResize" />
                  </v-col>
                </v-col>
                <v-col v-else cols="12" :class="!isXsOnly ? 'mt-12 pa-0' : 'pt-4 pb-0 pl-0 pr-0'">
                  <v-col cols="12" class="text-center pa-0">
                    <ClientsBarChart :key="componentKey" :anualizeData="cashFlowSum" :liveWidth="screenResize" />
                  </v-col>
                </v-col>
                <v-col v-for="(item, index) in cashFlowSum" :key="index" class="pa-0">
                  <v-row>
                    <v-col lg="7" class="pb-0 pr-2 pl-2 pt-2">
                      <v-col class="text-left pa-0">
                        <span class="legendCircle" :style="`background-color:${$store.state.theme.accentColors[index]}`" />
                        <span class="pl-1 iconColor">{{ item.Series }}</span>
                      </v-col>
                    </v-col>
                    <v-col lg="5" class="pb-0 pl-2 pr-2 pt-2">
                      <v-col class="font-weight-medium text-right pa-0">
                        {{ formatPrice(item.Amount, 0) }}
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
            </v-card>
          </v-col>
          <v-col
            class="text-right"
            :class="[isSmOnly ? 'pt-6 pb-1 pl-0 pr-0' : smAndUp ? 'widgetButtonPosition pr-1' : 'pt-6 pb-1 pl-0 pr-0']"
          >
            <v-btn
              class="mr-0"
              :disabled="!setButtonVisiblity"
              :class="isXsOnly ? 'mb-0 mr-0' : 'mr-0'"
              color="accent"
              @click="navigateToPage('/Retention/Dashboard')"
            >
              View Client Dashboard
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>
<script>
import ClientsBarChart from '@/components/Home/ClientsBarChart'
import ClientBarChartWithNoData from '@/components/Home/ClientBarChartWithNoData'
import qs from 'qs'
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, inject, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  components: {
    ClientsBarChart,
    ClientBarChartWithNoData
  },
  props: ['liveWidth'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const overflowType = ref(3)
    const overflowListType = ref([
      { title: 'Last Month', value: 4 },
      { title: '3 Months', value: 1 },
      { title: '6 Months', value: 2 },
      { title: '12 Months', value: 3 }
    ])
    const componentKey = ref(0)
    const showLoader = ref(false)
    const showError = ref(true)
    const cashFlowSum = ref([])
    const showCashFlow = ref(true)
    const showCashFlowError = ref(false)
    const totalAUM = ref(0)
    const cashFlowSumWithNoData = ref([
      { Series: 'Contributions (Incl Rollovers)', Amount: 0.0 },
      { Series: 'Distributions', Amount: 0.0 },
      { Series: 'Net Cash Flow', Amount: 0.0 }
    ])
    const setButtonVisiblity = ref(true)
    const cashFlowSumData = ref([])
    const isXsOnly = ref(false)
    const isSmOnly = ref(false)
    const smAndUp = ref(false)
    const router = useRouter()
    const screenResize = ref(props.liveWidth)
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      isSmOnly.value = display.sm.value
      smAndUp.value = display.smAndUp.value
      screenResize.value = props.liveWidth
    })
    //mounted
    onMounted(() => {
      loadClient()
      getClientOverViewValue()
      eventBus.on('filterGlobalData', () => {
        getClient()
      })
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })
    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })

    function navigateToPage(value) {
      if (value) {
        router.push(value).catch(() => {})
      }
    }
    async function getCashFlow() {
      var rbcDashboardData = []
      var tsmDashboardData = []
      var promises = []
      var rbcCharges = 0
      var tsmCharges = 0
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
      if ($store.state.user.reliusLoginId) {
        promises.push(
          $axios
            .get(`/api/v1/retention/rbc/cashflowsum/${overflowType.value}`, {
              params: {
                accountId: accountId,
                advisorContactId: contactId
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              }
            })
            .then((success) => {
              rbcDashboardData = success.data.d !== null && success.data.d.length > 0 ? success.data.d : []
            })
        )
      }
      if ($store.state.user.tsmLoginId !== null && $store.state.user.tsmLoginId !== '') {
        promises.push(
          $axios.get(`/api/v1/retention/tsm/cashflowsum/${overflowType.value}`).then((success) => {
            tsmDashboardData = success.data.d !== null && success.data.d.length > 0 ? success.data.d : []
          })
        )
      }
      if ($store.state.user.reliusLoginId) {
        promises.push(
          $axios
            .get(`/api/v1/retention/rbc/assets/${overflowType.value}`, {
              params: {
                accountId: accountId,
                advisorContactId: contactId
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              }
            })
            .then((success) => {
              if (success.data.d !== null && success.data.d.length > 0) {
                var amount = success.data.d
                amount.forEach((element) => {
                  rbcCharges = rbcCharges + element.DollarAmount
                })
              }
            })
        )
      }
      if ($store.state.user.tsmLoginId !== null && $store.state.user.tsmLoginId !== '') {
        promises.push(
          $axios.get(`/api/v1/retention/tsm/assets/${overflowType.value}`).then((success) => {
            if (success.data.d !== null && success.data.d.length > 0) {
              var tsmAmount = success.data.d
              tsmAmount.forEach((element) => {
                tsmCharges = tsmCharges + element.DollarAmount
              })
            }
          })
        )
      }

      var result = await Promise.allSettled(promises)
      $store.state.clientNetCharges = rbcCharges + tsmCharges

      if (rbcDashboardData.length > 0 && tsmDashboardData.length > 0) {
        rbcDashboardData.forEach((element, index) => {
          element.Amount = element.Amount + tsmDashboardData[index].Amount
        })
        cashFlowSum.value = rbcDashboardData
      } else if (tsmDashboardData.length > 0 && rbcDashboardData.length === 0) {
        cashFlowSum.value = tsmDashboardData
      } else {
        cashFlowSum.value = rbcDashboardData
      }
      $store.state.clientCashFlow = cashFlowSum
      if (cashFlowSum.value !== null && cashFlowSum.value.length > 0) {
        var contributionIndex = cashFlowSum.value.findIndex((a) => a.Series === 'Contributions')
        var rolloverIndex = cashFlowSum.value.findIndex((a) => a.Series === 'Rollovers')
        var sumAmount = parseFloat(cashFlowSum.value[contributionIndex].Amount + cashFlowSum.value[rolloverIndex].Amount).toFixed(
          2
        )

        cashFlowSum.value[contributionIndex].Amount = parseFloat(sumAmount)
        cashFlowSum.value[contributionIndex].Series = 'Contributions (Incl Rollovers)'
        cashFlowSum.value.splice(rolloverIndex, 1)

        var distributionIndex = cashFlowSum.value.findIndex((a) => a.Series === 'Distributions')
        var netCashFlowAmount = parseFloat(
          cashFlowSum.value[contributionIndex].Amount - cashFlowSum.value[distributionIndex].Amount
        ).toFixed(2)

        cashFlowSum.value.push({
          Series: 'Net Cash Flow',
          Amount: parseFloat(netCashFlowAmount)
        })
        cashFlowSum.value[distributionIndex].Amount = parseFloat(cashFlowSum.value[distributionIndex].Amount * -1)
        var cash = cashFlowSum.value.filter((a) => a.Amount > 0)
        showCashFlow.value = cash.length === 0 ? false : true
      } else {
        showCashFlow.value = false
      }
      if (cashFlowSum.value.length === 0) {
        setButtonVisiblity.value = false
        cashFlowSum.value = cashFlowSumWithNoData.value
        cashFlowSumData.value.push({
          Series: 'Contributions (Incl Rollovers)',
          Amount: -25000
        })
        cashFlowSumData.value.push({
          Series: 'Contributions',
          Amount: 0
        })
        cashFlowSumData.value.push({
          Series: 'Rollovers',
          Amount: 25000
        })
      }
      showLoader.value = false
      componentKey.value += 1
      var successCashflowCount = result.filter((x) => x.status === 'fulfilled')
      showCashFlowError.value = successCashflowCount.length === 0 ? true : false
    }
    function loadClient() {
      showLoader.value = true
      showError.value = false
      if ($store.state.clientCashFlow.length === 0) {
        getCashFlow()
      } else {
        if ($store.state.clientCashFlow && $store.state.clientCashFlow.length > 0) {
          var cashFlowWidgetValue = $store.state.clientCashFlow
          var contributionAndRollover = cashFlowWidgetValue.findIndex((a) => a.Series === 'Contributions (Incl Rollovers)')
          if (contributionAndRollover < 0) {
            var contributionIndex = cashFlowWidgetValue.findIndex((a) => a.Series === 'Contributions')
            var rolloverIndex = cashFlowWidgetValue.findIndex((a) => a.Series === 'Rollovers')
            var sumAmount = parseFloat(
              cashFlowWidgetValue[contributionIndex].Amount + cashFlowWidgetValue[rolloverIndex].Amount
            ).toFixed(2)

            cashFlowWidgetValue[contributionIndex].Amount = parseFloat(sumAmount)
            cashFlowWidgetValue[contributionIndex].Series = 'Contributions (Incl Rollovers)'
            cashFlowWidgetValue.splice(rolloverIndex, 1)

            var distributionIndex = cashFlowWidgetValue.findIndex((a) => a.Series === 'Distributions')
            var netCashFlowAmount = parseFloat(
              cashFlowWidgetValue[contributionIndex].Amount - cashFlowWidgetValue[distributionIndex].Amount
            ).toFixed(2)

            cashFlowWidgetValue.push({
              Series: 'Net Cash Flow',
              Amount: parseFloat(netCashFlowAmount)
            })
            cashFlowWidgetValue[distributionIndex].Amount = parseFloat(cashFlowWidgetValue[distributionIndex].Amount * -1)
          }
          cashFlowSum.value = cashFlowWidgetValue
          var cash = cashFlowSum.value.filter((a) => a.Amount > 0)
          showCashFlow.value = cash.length === 0 ? false : true
          showError.value = false
        }
        if (cashFlowSum.value.length === 0) {
          setButtonVisiblity.value = false
          cashFlowSum.value = cashFlowSumWithNoData
          cashFlowSumData.value.push({
            Series: 'Contributions (Incl Rollovers)',
            Amount: -25000
          })
          cashFlowSumData.value.push({
            Series: 'Contributions',
            Amount: 0
          })
          cashFlowSumData.value.push({
            Series: 'Rollovers',
            Amount: 25000
          })
        }
        showLoader.value = false
        componentKey.value += 1
      }
    }
    function getClient() {
      showLoader.value = true
      showError.value = false
      getCashFlow()
    }
    function getClientOverViewValue() {
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
      if ($store.state.user.reliusLoginId) {
        $axios
          .get(`/api/v1/rbc/clientoverview`, {
            params: {
              accountId: accountId,
              advisorContactId: contactId
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' })
            }
          })
          .then((success) => {
            totalAUM.value = success.data.d && success.data.d.length > 0 ? success.data.d[0].TotalAssets : 0
          })
      }
    }

    function formatPrice(value, digitValue) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digitValue,
        maximumFractionDigits: digitValue
      })
      return formatter.format(value)
    }

    return {
      overflowType,
      overflowListType,
      componentKey,
      showLoader,
      showError,
      cashFlowSum,
      showCashFlow,
      showCashFlowError,
      totalAUM,
      cashFlowSumWithNoData,
      setButtonVisiblity,
      cashFlowSumData,
      isXsOnly,
      fontSize,
      smAndUp,
      navigateToPage,
      getCashFlow,
      loadClient,
      getClient,
      getClientOverViewValue,
      formatPrice,
      screenResize,
      isSmOnly
    }
  }
}
</script>
<style scoped>
.selectPosition {
  right: 12px;
  top: 12px;
  position: absolute;
}
.legendCircle {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  padding-right: 3px;
}
</style>
