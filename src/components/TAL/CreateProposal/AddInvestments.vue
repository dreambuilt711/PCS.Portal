<template>
  <div class="pt-4 dialogHeight justify-center">
    <v-row justify="center">
      <v-col cols="12" xs="12" lg="8" class="justify-center pa-0">
        <div class="text-center pb-4">
          <h1>Add Investments</h1>
        </div>
        <v-tabs v-model="tab" align-tabs="center">
          <v-tab v-for="item in items" :key="item.tab" color="accent">
            {{ item.tab }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item v-for="item in items" :key="item.tab">
            <v-card flat>
              <v-card-text>
                <div v-if="item.tab === 'FUNDS'">
                  <h3 class="text-alignment">
                    Select up to 32 funds from the fund categories below to build {{ individualName }}'s portfolio
                  </h3>
                </div>
                <div v-else>
                  <h3 class="text-alignment">
                    {{ item.content }}
                  </h3>
                </div>
              </v-card-text>
              <div v-if="item.tab == 'FUNDS'">
                <div v-show="loadingFund">
                  <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                    <Loader :loading-text="`Loading..`" :loading="loadingFund" />
                  </v-card>
                </div>
                <div v-show="!loadingFund" class="text-center">
                  <v-row justify="center">
                    <v-col cols="10" lg="10" sm="10" md="10" xl="10" class="pa-0">
                      <v-row align="center" justify="space-around">
                        <v-btn
                          v-if="internationalEquityData && internationalEquityData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          max-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('International Equity')"
                        >
                          International Equity
                          <span
                            v-if="selectedInternationalEquityFunds && selectedInternationalEquityFunds.length > 0"
                            class="margin_left_1"
                            >({{ selectedInternationalEquityFunds.length }})</span
                          >
                        </v-btn>
                        <v-btn
                          v-if="usEquityData && usEquityData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          min-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('U.S. Equity')"
                        >
                          US Equity
                          <span v-if="selectedUSEquityFunds && selectedUSEquityFunds.length > 0" class="margin_left_1"
                            >({{ selectedUSEquityFunds.length }})</span
                          >
                        </v-btn>
                        <v-btn
                          v-if="commoditiesData && commoditiesData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          min-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('Commodities')"
                        >
                          Commodities
                          <span v-if="selectedCommodities && selectedCommodities.length > 0" class="margin_left_1"
                            >({{ selectedCommodities.length }})</span
                          >
                        </v-btn>
                        <v-btn
                          v-if="bondData && bondData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          min-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('Bonds')"
                        >
                          Bonds
                          <span v-if="selectedBonds && selectedBonds.length > 0" class="margin_left_1"
                            >({{ selectedBonds.length }})</span
                          >
                        </v-btn>
                        <v-btn
                          v-if="sectorEquityData && sectorEquityData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          min-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('Sector Equity')"
                        >
                          Sector Equity
                          <span v-if="selectedSectorEquityFunds && selectedSectorEquityFunds.length > 0" class="margin_left_1"
                            >({{ selectedSectorEquityFunds.length }})</span
                          >
                        </v-btn>
                        <v-btn
                          v-if="allocationData && allocationData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          min-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('Allocation')"
                        >
                          Allocation
                          <span v-if="selectedAllocationFunds && selectedAllocationFunds.length > 0" class="margin_left_1"
                            >({{ selectedAllocationFunds.length }})</span
                          >
                        </v-btn>
                        <v-btn
                          v-if="alternativeData && alternativeData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          min-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('Alternative')"
                        >
                          Alternative
                          <span v-if="selectedAlternative && selectedAlternative.length > 0" class="margin_left_1"
                            >({{ selectedAlternative.length }})</span
                          >
                        </v-btn>
                        <v-btn
                          v-if="moneyMarketData && moneyMarketData.length > 0"
                          color="#E3F2FD"
                          variant="flat"
                          min-width="150"
                          size="x-large"
                          class="font-weight-regular text-accent ma-1"
                          @click="viewFunds('Money Market')"
                        >
                          Money Market
                          <span v-if="selectedMoneyMarket && selectedMoneyMarket.length > 0" class="margin_left_1"
                            >({{ selectedMoneyMarket.length }})</span
                          >
                        </v-btn>
                        <v-btn size="x-large" min-width="150" variant="text" color="accent" @click="viewFunds('View All Funds')">
                          View all funds
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <div v-if="item.tab == 'Models'">
                <div>
                  <v-data-table
                    v-model="checkedModels"
                    :headers="headers"
                    height="240"
                    :items="modelsList"
                    :single-select="singleSelect"
                    item-key="ModelFundsListID"
                    class="elevation-1 fundTable"
                    mobile-breakpoint="0"
                    :hide-default-footer="true"
                    :loading="loadingModel"
                    loader-height="2"
                    :fixed-header="true"
                    :disable-pagination="true"
                    show-select
                    style="backface-visibility: hidden"
                  >
                    <template #item="{ item, select, isSelected }">
                      <tr v-if="!display.smAndDown.value">
                        <td width="2%">
                          <v-checkbox-btn color="accent" :value="isSelected" @input="select($event)" />
                        </td>
                        <td>
                          {{ item.Name }}
                        </td>
                        <td>
                          {{ item.ModelFundsListID }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </div>
              </div>
            </v-card>
          </v-window-item>
        </v-window>
        <v-row justify="center" class="mt-10">
          <v-col class="text-center pa-0" cols="12" lg="6">
            <div>
              <v-btn
                class="text-capitalize"
                block
                size="x-large"
                :loading="loading"
                color="accent"
                :disabled="nextButton || disableNextButton"
                @click="saveInvestment()"
              >
                Next
                <template #loading>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
              </v-btn>
            </div>
            <div v-if="false" class="align-self pt-2">
              <a :class="['text-hyperlink font_14']" @click="f_goToNextWindow()"><b>Skip, I'll do this later</b></a>
            </div>
          </v-col>
        </v-row>
        <div v-if="openAllFundsDialog" class="dialogHeight justify-center">
          <FundsAvailable
            v-model="openAllFundsDialog"
            :selected-button="selectedButton"
            :opportunity-id="opportunityId"
            :funds-list="fundsList"
            :loading-fund="loadingFund"
            @selected-funds="selectedFunds"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { ref, getCurrentInstance, computed, inject, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import FundsAvailable from '@/components/TAL/CreateProposal/FundsAvailable'
import Loader from '@/components/NewLoader'
export default {
  components: {
    FundsAvailable,
    Loader
  },
  props: ['goToNextWindow'],
  setup(props, { emit }) {
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $toast = instance.appContext.config.globalProperties.$toast
    const $axios = instance.appContext.config.globalProperties.$axios
    const openAllFundsDialog = ref(false)
    const selectedInternationalEquityFunds = ref([])
    const selectedSectorEquityFunds = ref([])
    const selectedBonds = ref([])
    const selectedAllocationFunds = ref([])
    const individualName = ref('')
    const selectedUSEquityFunds = ref([])
    const selectedAlternative = ref([])
    const selectedCommodities = ref([])
    const selectedMoneyMarket = ref([])
    const singleSelect = ref(true)
    const selectedButton = ref('')
    const checkedModels = ref([])
    const headers = ref([
      {
        title: 'Name',
        align: 'start',
        sortable: false,
        value: 'Name'
      },
      {
        title: 'Description',
        value: 'ModelFundsListID',
        align: 'start',
        sortable: false
      }
    ])
    const tab = ref('FUNDS')
    const fundsList = ref([])
    const modelsList = ref([])
    const items = ref([
      {
        tab: 'FUNDS',
        content: ''
      },
      {
        tab: 'MODELS',
        content: 'Add Investment Models from the Client Product to your proposal'
      }
    ])
    const clientProductId = ref('')
    const opportunityId = ref('')
    const loadingFund = ref(false)
    const loadingModel = ref(false)
    const selectedFund = ref([])
    const loading = ref(false)
    const totalFundsSelected = ref(0)
    const disableNextButton = ref(false)
    const disableButton = ref(false)
    const internationalEquityData = ref([])
    const usEquityData = ref([])
    const commoditiesData = ref([])
    const bondData = ref([])
    const sectorEquityData = ref([])
    const allocationData = ref([])
    const alternativeData = ref([])
    const moneyMarketData = ref([])
    function saveinStore() {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        individualName.value = $store.state.openAccountDetail.Name
        $store.state.openAccountDetail.InternationalEquity =
          selectedInternationalEquityFunds.value && selectedInternationalEquityFunds.value.length > 0
            ? selectedInternationalEquityFunds.value
            : []
        $store.state.openAccountDetail.USEquity =
          selectedUSEquityFunds.value && selectedUSEquityFunds.value.length > 0 ? selectedUSEquityFunds.value : []
        $store.state.openAccountDetail.Commodities =
          selectedCommodities.value && selectedCommodities.value.length > 0 ? selectedCommodities.value : []
        $store.state.openAccountDetail.Bonds = selectedBonds.value && selectedBonds.value.length > 0 ? selectedBonds.value : []
        $store.state.openAccountDetail.SectorEquity =
          selectedSectorEquityFunds.value && selectedSectorEquityFunds.value.length > 0 ? selectedSectorEquityFunds.value : []
        $store.state.openAccountDetail.Allocation =
          selectedAllocationFunds.value && selectedAllocationFunds.value.length > 0 ? selectedAllocationFunds.value : []
        $store.state.openAccountDetail.Alternative =
          selectedAlternative.value && selectedAlternative.value.length > 0 ? selectedAlternative.value : []
        $store.state.openAccountDetail.MoneyMarket =
          selectedMoneyMarket.value && selectedMoneyMarket.value.length > 0 ? selectedMoneyMarket.value : []
      }
    }
    function selectedFunds(val, type) {
      selectedFund.value = val && val.length > 0 ? val : []
      if (type === 'View All Funds') {
        selectedInternationalEquityFunds.value = selectedFund.value.filter((a) => a.clsname === 'International Equity')
        selectedUSEquityFunds.value = selectedFund.value.filter((a) => a.clsname === 'U.S. Equity')
        selectedCommodities.value = selectedFund.value.filter((a) => a.clsname === 'Commodities')
        selectedBonds.value = selectedFund.value.filter((a) => a.clsname !== null && a.clsname.includes('Bond'))
        selectedSectorEquityFunds.value = selectedFund.value.filter((a) => a.clsname === 'Sector Equity')
        selectedAllocationFunds.value = selectedFund.value.filter((a) => a.clsname === 'Allocation')
        selectedAlternative.value = selectedFund.value.filter((a) => a.clsname === 'Alternative')
        selectedMoneyMarket.value = selectedFund.value.filter((a) => a.clsname === 'Money Market')
      } else if (type === 'International Equity') {
        selectedInternationalEquityFunds.value = selectedFund.value.filter((a) => a.clsname === 'International Equity')
      } else if (type === 'U.S. Equity') {
        selectedUSEquityFunds.value = selectedFund.value.filter((a) => a.clsname === 'U.S. Equity')
      } else if (type === 'Commodities') {
        selectedCommodities.value = selectedFund.value.filter((a) => a.clsname === 'Commodities')
      } else if (type === 'Bonds') {
        selectedBonds.value = selectedFund.value.filter((a) => a.clsname !== null && a.clsname.includes('Bond'))
      } else if (type === 'Sector Equity') {
        selectedSectorEquityFunds.value = selectedFund.value.filter((a) => a.clsname === 'Sector Equity')
      } else if (type === 'Allocation') {
        selectedAllocationFunds.value = selectedFund.value.filter((a) => a.clsname === 'Allocation')
      } else if (type === 'Alternative') {
        selectedAlternative.value = selectedFund.value.filter((a) => a.clsname === 'Alternative')
      } else if (type === 'Money Market') {
        selectedMoneyMarket.value = selectedFund.value.filter((a) => a.clsname === 'Money Market')
      }
      disableNextButton.value = false
      var saveFunds = []
      Array.prototype.push.apply(saveFunds, selectedInternationalEquityFunds.value)
      Array.prototype.push.apply(saveFunds, selectedUSEquityFunds.value)
      Array.prototype.push.apply(saveFunds, selectedCommodities.value)
      Array.prototype.push.apply(saveFunds, selectedBonds.value)
      Array.prototype.push.apply(saveFunds, selectedSectorEquityFunds.value)
      Array.prototype.push.apply(saveFunds, selectedAllocationFunds.value)
      Array.prototype.push.apply(saveFunds, selectedAlternative.value)
      Array.prototype.push.apply(saveFunds, selectedMoneyMarket.value)
      if (saveFunds && saveFunds.length > 0) {
        if (saveFunds.length > 32) {
          disableButton.value = true
          $toast.clearAll()
          $toast.warning('Select max funds up to 32', '')
        } else {
          disableButton.value = false
        }
        eventBus.emit('disableNextButton', disableButton.value)
      }
      saveinStore()
    }
    async function saveInvestment() {
      loading.value = true
      saveinStore()
      var saveFunds = []
      Array.prototype.push.apply(saveFunds, selectedInternationalEquityFunds.value)
      Array.prototype.push.apply(saveFunds, selectedUSEquityFunds.value)
      Array.prototype.push.apply(saveFunds, selectedCommodities.value)
      Array.prototype.push.apply(saveFunds, selectedBonds.value)
      Array.prototype.push.apply(saveFunds, selectedSectorEquityFunds.value)
      Array.prototype.push.apply(saveFunds, selectedAllocationFunds.value)
      Array.prototype.push.apply(saveFunds, selectedAlternative.value)
      Array.prototype.push.apply(saveFunds, selectedMoneyMarket.value)
      var promise = []
      if (saveFunds && saveFunds.length > 0) {
        if (saveFunds.length > 32) {
          $toast.clearAll()
          $toast.warning('Select max funds up to 32', '')
        } else {
          var selectedFundID = []
          selectedFundID = saveFunds.map((a) => a.FundId)
          if (selectedFundID && selectedFundID.length > 0) {
            promise.push(
              $axios.post(`/api/v1/user/clientproductinvestment/opportunityfunds/${opportunityId.value}/savefund`, selectedFundID)
            )
          }
        }
      }
      if (checkedModels.value && checkedModels.value.length > 0) {
        var saveModels = []
        saveModels = checkedModels.value.map((a) => a.FundId)
        if (saveModels && saveModels.length > 0) {
          promise.push(
            $axios.post(`/api/v1/user/clientproductinvestment/opportunityfunds/${opportunityId.value}/savemodel`, saveModels)
          )
        }
      }
      await Promise.allSettled(promise)
      loading.value = false
      if (saveFunds && saveFunds.length > 32) {
        disableNextButton.value = true
      } else {
        if (props.goToNextWindow) {
          props.goToNextWindow()
        } else {
          emit('goToNextWindow')
        }
      }
    }
    function viewFunds(val) {
      openAllFundsDialog.value = true
      selectedButton.value = val
    }
    function f_goToNextWindow() {
      if (!$store.state.openAccountDetail.investmentsList) {
        $store.state.openAccountDetail.InternationalEquity = []
        $store.state.openAccountDetail.USEquity = []
        $store.state.openAccountDetail.Commodities = []
        $store.state.openAccountDetail.Bonds = []
        $store.state.openAccountDetail.SectorEquity = []
        $store.state.openAccountDetail.Allocation = []
        $store.state.openAccountDetail.Alternative = []
        $store.state.openAccountDetail.MoneyMarket = []
      }
      emit('goToNextWindow')
    }
    const nextButton = computed(() => {
      if (
        selectedAlternative.value.length === 0 &&
        selectedUSEquityFunds.value.length === 0 &&
        selectedCommodities.value.length === 0 &&
        selectedAllocationFunds.value.length === 0 &&
        selectedMoneyMarket.value.length === 0 &&
        selectedInternationalEquityFunds.value.length === 0 &&
        selectedSectorEquityFunds.value.length === 0 &&
        selectedBonds.value.length === 0 &&
        checkedModels.value.length === 0
      ) {
        return true
      } else {
        return false
      }
    })
    onMounted(() => {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        loadingFund.value = true
        loadingModel.value = true
        $axios
          .get(
            `/api/v1/user/clientproductinvestment/${$store.state.openAccountDetail.ClientProduct}/opportunityfunds/${$store.state.openAccountDetail.OpportunityId}`
          )
          .then((success) => {
            fundsList.value = success.data.d ? success.data.d : []
            fundsList.value.forEach((element) => {
              element.mgmt = element.mgmt * 100
              element.tload = element.tload * 100
              element.SubTA = element.SubTA * 100
              element.Total = element.Total * 100
            })
            if (fundsList.value && fundsList.value.length === 0) {
              items.value.splice(0, 1)
            }
            if (fundsList.value && fundsList.value.length > 0) {
              internationalEquityData.value = fundsList.value.filter((a) => a.clsname === 'International Equity')
              usEquityData.value = fundsList.value.filter((a) => a.clsname === 'U.S. Equity')
              commoditiesData.value = fundsList.value.filter((a) => a.clsname === 'Commodities')
              bondData.value = fundsList.value.filter((a) => a.clsname !== null && a.clsname.includes('Bond'))
              sectorEquityData.value = fundsList.value.filter((a) => a.clsname === 'Sector Equity')
              allocationData.value = fundsList.value.filter((a) => a.clsname === 'Allocation')
              alternativeData.value = fundsList.value.filter((a) => a.clsname === 'Alternative')
              moneyMarketData.value = fundsList.value.filter((a) => a.clsname === 'Money Market')
            }
          })
          .finally(() => {
            loadingFund.value = false
          })

        $axios
          .get(
            `/api/v1/user/clientproductinvestmentmodels/${$store.state.openAccountDetail.ClientProduct}/opportunitymodels/${$store.state.openAccountDetail.OpportunityId}`
          )
          .then((success) => {
            modelsList.value = success.data.d ? success.data.d : []
            if (modelsList.value && modelsList.value.length === 0) {
              items.value.splice(1, 1)
            }
          })
          .finally(() => {
            loadingModel.value = false
          })
        $axios
          .get(
            `/api/v1/user/clientproductinvestment/${$store.state.openAccountDetail.ClientProduct}/opportunityfunds/${$store.state.openAccountDetail.OpportunityId}/getall`
          )
          .then((success) => {
            if (success.data.d && success.data.d.length > 0) {
              var fundsSelected = success.data.d.filter((a) => a.Type === 'Fund')
              if (fundsSelected && fundsSelected.length > 0) {
                fundsSelected = fundsSelected.filter((a) => a.clsname)
                selectedFunds.value(fundsSelected, 'View All Funds')
              }
              var modelsSelected = success.data.d.filter((a) => a.Type === 'Model')
              if (modelsSelected && modelsSelected.length > 0) {
                modelsSelected.forEach((element) => {
                  element.isSelected = true
                })
                if (modelsList.value && modelsList.value.length > 0) {
                  for (var i = 0; i < modelsList.value.length; ++i) {
                    for (var j = 0; j < modelsSelected.length; ++j) {
                      if (modelsList.value[i].ModelFundsListID === modelsSelected[j].ModelFundsListID) {
                        modelsList.value[i].isSelected = true
                        checkedModels.value.push(modelsList.value[i])
                      }
                    }
                  }
                }
              }
            } else {
              checkedModels.value = []
              selectedFund.value = []
              selectedInternationalEquityFunds.value = []
              selectedSectorEquityFunds.value = []
              selectedBonds.value = []
              selectedAllocationFunds.value = []
              selectedUSEquityFunds.value = []
              selectedAlternative.value = []
              selectedCommodities.value = []
              selectedMoneyMarket.value = []
              $store.state.openAccountDetail.InternationalEquity = []
              $store.state.openAccountDetail.USEquity = []
              $store.state.openAccountDetail.Commodities = []
              $store.state.openAccountDetail.Bonds = []
              $store.state.openAccountDetail.SectorEquity = []
              $store.state.openAccountDetail.Allocation = []
              $store.state.openAccountDetail.Alternative = []
              $store.state.openAccountDetail.MoneyMarket = []
            }
            $store.state.openAccountDetail.investmentsList = success.data.d && success.data.d.length > 0 ? success.data.d : []
          })
      }
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        clientProductId.value = $store.state.openAccountDetail.ClientProduct
        opportunityId.value = $store.state.openAccountDetail.OpportunityId
        individualName.value = $store.state.openAccountDetail.Name
        selectedInternationalEquityFunds.value = $store.state.openAccountDetail.InternationalEquity
          ? $store.state.openAccountDetail.InternationalEquity
          : []
        selectedUSEquityFunds.value = $store.state.openAccountDetail.USEquity ? $store.state.openAccountDetail.USEquity : []
        selectedCommodities.value = $store.state.openAccountDetail.Commodities ? $store.state.openAccountDetail.Commodities : []
        selectedBonds.value = $store.state.openAccountDetail.Bonds ? $store.state.openAccountDetail.Bonds : []
        selectedSectorEquityFunds.value = $store.state.openAccountDetail.SectorEquity
          ? $store.state.openAccountDetail.SectorEquity
          : []
        selectedAllocationFunds.value = $store.state.openAccountDetail.Allocation ? $store.state.openAccountDetail.Allocation : []
        selectedAlternative.value = $store.state.openAccountDetail.Alternative ? $store.state.openAccountDetail.Alternative : []
        selectedMoneyMarket.value = $store.state.openAccountDetail.MoneyMarket ? $store.state.openAccountDetail.MoneyMarket : []
        totalFundsSelected.value =
          selectedAllocationFunds.value.length +
          selectedBonds.value.length +
          selectedUSEquityFunds.value.length +
          selectedInternationalEquityFunds.value.length +
          selectedCommodities.value.length +
          selectedSectorEquityFunds.value.length +
          selectedAlternative.value.length +
          selectedMoneyMarket.value.length
      }
    })
    return {
      display,
      tab,
      items,
      loadingFund,
      internationalEquityData,
      selectedInternationalEquityFunds,
      usEquityData,
      commoditiesData,
      selectedCommodities,
      bondData,
      selectedBonds,
      sectorEquityData,
      allocationData,
      selectedAllocationFunds,
      alternativeData,
      selectedAlternative,
      moneyMarketData,
      selectedMoneyMarket,
      checkedModels,
      headers,
      modelsList,
      singleSelect,
      loadingModel,
      nextButton,
      disableNextButton,
      openAllFundsDialog,
      selectedButton,
      opportunityId,
      fundsList,
      viewFunds,
      saveInvestment,
      f_goToNextWindow,
      selectedFunds
    }
  }
}
</script>

<style scoped>
.text-alignment {
  text-align: center;
}
</style>
