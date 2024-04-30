<template>
  <v-dialog
    v-model="openAllFundsDialog"
    persistent
    class="elevation-3"
    :class="dialogPositionNew"
    :content-class="dialogPositionNew"
    scrollable
    :eager="true"
    transition="dialog-bottom-transition"
    :max-width="dialogWidth"
  >
    <v-card>
      <v-card-title>
        <div>
          <div class="text-right">
            <v-icon color="accent" @click="closeContactInfoDialog()"> close </v-icon>
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <div>
          <h1 class="text-center pb-2">
            {{ dialogHeader }}
          </h1>
        </div>
        <div>
          <h3 class="text-center">Look up funds using fund name or symbol to add to the proposal</h3>
        </div>
        <v-row>
          <v-col cols="6" sm="6" md="4" class="pt-2 pb-2 pa-0">
            <v-text-field v-model="search" placeholder="Search by symbol or fund name" single-line hide-details clearable />
          </v-col>
          <v-col class="d-flex flex-row-reverse pa-0">
            <v-btn v-if="showViewOnlySelected" variant="text" color="accent" @click="viewAll()"> View All </v-btn>
            <v-btn
              v-if="checkedFunds.length > 0 && !showViewOnlySelected"
              class="ma-2"
              variant="text"
              color="accent"
              @click="viewOnlySelectedFunds()"
            >
              View Selected Funds
            </v-btn>
          </v-col>
        </v-row>
        <div>
          <v-card width="100%">
            <v-data-table
              v-model="checkedFunds"
              density="compact"
              :search="search"
              :headers="headers"
              :items="fundsData"
              :height="display.xs.value ? '380px' : display.sm.value ? '400px' : '255px'"
              item-key="Symbol"
              class="elevation-1 fundTable"
              mobile-breakpoint="0"
              :loading="loadingFund"
              loader-height="2"
              :fixed-header="!display.xs.value"
              show-select
              style="backface-visibility: hidden"
              :hide-default-header="display.xs.value"
              :options="pagination"
              :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
            >
              <template #item="{ item, select, isSelected }">
                <tr v-if="!display.xs.value">
                  <td width="2%">
                    <v-checkbox-btn color="accent" :value="isSelected" @input="select($event)" />
                  </td>
                  <td>
                    <span class="text-hyperlink"> {{ item.Symbol }}</span>
                    <v-icon size="18" class="icon-modal-light" color="hyperlink" />
                  </td>
                  <td style="width: 40%">
                    <v-tooltip location="bottom">
                      <template #activator="{ props }">
                        <span :class="!theme.dark ? '' : 'text-white'" v-bind="props">{{ item.Name }}</span>
                      </template>
                      <span>{{ item.Name }}</span>
                    </v-tooltip>
                  </td>
                  <td>{{ formatPercent(item.mgmt) }}%</td>
                  <td>{{ formatPercent(item.tload) }}%</td>
                  <td>{{ formatPercent(item.SubTA) }}%</td>
                  <td>{{ formatPercent(item.Total) }}%</td>
                </tr>
                <tr v-else>
                  <td class="pr-3 pl-3">
                    <v-row>
                      <v-col cols="2" xs="2" class="pb-1 pa-0">
                        <h5 class="pt-1">
                          <span class="text-grey" />
                        </h5>
                        <h4 class="text-capitalize pt-2">
                          <v-checkbox-btn color="accent" :value="isSelected" @input="select($event)" />
                        </h4>
                      </v-col>
                      <v-col cols="10" xs="10" class="pb-1 pa-0">
                        <h5 class="pt-1">
                          <span class="text-grey">Symbol/ID</span>
                        </h5>
                        <h4 class="text-capitalize">
                          <span class="text-hyperlink"> {{ item.Symbol }}</span>
                          <v-icon size="18" class="icon-modal-light" color="hyperlink" />
                        </h4>
                      </v-col>
                      <v-col cols="12" xs="12" class="pb-1 pa-0">
                        <h5 class="pt-1">
                          <span class="text-grey">Name</span>
                        </h5>
                        <h4 class="text-uppercase">
                          {{ item.Name }}
                        </h4>
                      </v-col>
                      <v-col cols="6" xs="6" class="pb-1 pa-0">
                        <h5 class="pt-1">
                          <span class="text-grey">Mgmt</span>
                        </h5>
                        <h4>{{ formatPercent(item.mgmt) }}%</h4>
                      </v-col>
                      <v-col cols="6" xs="6" class="pb-1 pa-0">
                        <h5 class="pt-1">
                          <span class="text-grey">12b-1</span>
                        </h5>
                        <h4>{{ formatPercent(item.tload) }}%</h4>
                      </v-col>
                      <v-col cols="6" xs="6" class="pb-1 pa-0">
                        <h5 class="pt-1">
                          <span class="text-grey">SubTA</span>
                        </h5>
                        <h4>{{ formatPercent(item.SubTA) }}%</h4>
                      </v-col>
                      <v-col cols="6" xs="6" class="pb-1 pa-0">
                        <h5 class="pt-1">
                          <span class="text-grey">Total Fees</span>
                        </h5>
                        <h4>{{ formatPercent(item.Total) }}%</h4>
                      </v-col>
                    </v-row>
                  </td>
                </tr>
              </template>
              <template v-if="checkedFunds.length > 0 && !display.xs.value" #footer>
                <div class="v-data-table__wrapper" :class="theme.dark ? '' : ' grey lighten-3'">
                  <table>
                    <tfoot>
                      <tr>
                        <td class="text-left" style="width: 61%">
                          <strong>Total Selected Funds: {{ checkedFunds.length }}</strong>
                        </td>
                        <td class="text-left px-0" style="width: 9%">
                          <strong v-if="checkedFunds.length > 0">{{ totalNewMgmt }}%</strong>
                        </td>
                        <td class="text-left px-0" style="width: 10%">
                          <strong v-if="checkedFunds.length > 0">{{ totalNewLoad }}%</strong>
                        </td>
                        <td class="text-left px-0" style="width: 9%">
                          <strong v-if="checkedFunds.length > 0">{{ totalNewSubta }}%</strong>
                        </td>
                        <td class="text-left px-0">
                          <strong v-if="checkedFunds.length > 0">{{ totalNewFees }}%</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </template>
              <template v-if="display.xs.value && checkedFunds.length > 0" v-slot:body.append>
                <tr>
                  <td class="pl-3 pr-3 pb-2">
                    <div>
                      <v-row>
                        <v-col cols="6" xs="6" class="pb-1 pa-0">
                          <v-row>
                            <div>
                              <h5 class="pt-1">
                                <span class="text-grey">Total Funds</span>
                              </h5>
                              <h4 class="text-uppercase">
                                {{ checkedFunds.length }}
                              </h4>
                            </div>
                          </v-row>
                        </v-col>
                        <v-col cols="6" xs="6" class="pb-1 pa-0">
                          <v-row>
                            <div>
                              <h5 class="pt-1">
                                <span class="text-grey">Total Mgmt</span>
                              </h5>
                              <h4 class="text-uppercase">{{ totalNewMgmt }}%</h4>
                            </div>
                          </v-row>
                        </v-col>
                        <v-col cols="6" xs="6" class="pb-1 pa-0">
                          <v-row>
                            <div>
                              <h5 class="pt-1">
                                <span class="text-grey">Total 12b-1</span>
                              </h5>
                              <h4 class="text-uppercase">{{ totalNewLoad }}%</h4>
                            </div>
                          </v-row>
                        </v-col>
                        <v-col cols="6" xs="6" class="pb-1 pa-0">
                          <v-row>
                            <div>
                              <h5 class="pt-1">
                                <span class="text-grey">Total SubTA</span>
                              </h5>
                              <h4 class="text-uppercase">{{ totalNewSubta }}%</h4>
                            </div>
                          </v-row>
                        </v-col>
                        <v-col cols="6" xs="6" class="pb-1 pa-0">
                          <v-row>
                            <div>
                              <h5 class="pt-1">
                                <span class="text-grey">Total Fees</span>
                              </h5>
                              <h4 class="text-uppercase">{{ totalNewFees }}%</h4>
                            </div>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </div>
        <v-row justify="center">
          <v-col class="text-center pa-0" cols="3" sm="3">
            <div>
              <v-btn
                class="text-capitalize"
                block
                size="x-large"
                color="accent"
                :disabled="disableButton"
                @click="addSelectedFunds()"
              >
                Next
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, inject, watch, onMounted, onBeforeUnmount, getCurrentInstance, computed } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
export default {
  props: ['value', 'selectedButton', 'opportunityId', 'fundsList', 'loadingFund'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const checkedFunds = ref([])
    const showViewOnlySelected = ref(false)
    const totalNewMgmt = ref(0)
    const totalNewLoad = ref(0)
    const totalNewSubta = ref(0)
    const totalNewFees = ref(0)
    const totalElectionPercentage = ref(0)
    const search = ref('')
    const headers = ref([
      {
        title: 'Symbol',
        align: 'start',
        value: 'Symbol'
      },
      {
        title: 'Name',
        value: 'Name',
        align: 'start'
      },
      {
        title: 'Mgmt.',
        value: 'mgmt',
        align: 'start',
        filterable: false
      },
      {
        title: '12b-1',
        value: 'tload',
        align: 'start',
        filterable: false
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        align: 'start',
        filterable: false
      },
      {
        title: 'Total Fees',
        value: 'Total',
        align: 'start',
        filterable: false
      }
    ])
    const disableButton = ref(false)
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 50
    })
    function viewOnlySelectedFunds() {
      showViewOnlySelected.value = true
    }
    function updateAssetTotal() {
      totalNewFees.value = 0
      totalNewMgmt.value = 0
      totalNewLoad.value = 0
      totalNewSubta.value = 0
      totalElectionPercentage.value = 0
      if (checkedFunds.value.length > 0) {
        var sumMgmt = 0
        var sumTload = 0
        var sumSubta = 0
        var sumTotalFees = 0
        if (checkedFunds.value.length > 0) {
          for (var i = 0; i < checkedFunds.value.length; i++) {
            sumMgmt += !(checkedFunds.value[i].mgmt === -999) ? Number(checkedFunds.value[i].mgmt) : Number(0)
            sumTload += !(checkedFunds.value[i].tload === -999) ? Number(checkedFunds.value[i].tload) : Number(0)
            sumSubta += !(checkedFunds.value[i].SubTA === -999) ? Number(checkedFunds.value[i].SubTA) : Number(0)
            sumTotalFees += !(checkedFunds.value[i].Total === -999) ? Number(checkedFunds.value[i].Total) : Number(0)
          }
          totalNewMgmt.value = parseFloat(Number(sumMgmt) / checkedFunds.value.length).toFixed(2)
          totalNewLoad.value = parseFloat(Number(sumTload) / checkedFunds.value.length).toFixed(2)
          totalNewSubta.value = parseFloat(Number(sumSubta) / checkedFunds.value.length).toFixed(2)
          totalNewFees.value = parseFloat(Number(sumTotalFees) / checkedFunds.value.length).toFixed(2)
        }
      }
    }
    function viewAll() {
      showViewOnlySelected.value = false
    }
    function formatPercent(val) {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    }
    function closeContactInfoDialog() {
      openAllFundsDialog.value = false
    }
    function addSelectedFunds() {
      emit('selectedFunds', checkedFunds.value, props.selectedButton)
      openAllFundsDialog.value = false
    }

    function displaySelectedFund() {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        var selectedFunds = []
        checkedFunds.value = []
        if ($store.state.openAccountDetail.InternationalEquity && $store.state.openAccountDetail.InternationalEquity.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.InternationalEquity)
        }
        if ($store.state.openAccountDetail.USEquity && $store.state.openAccountDetail.USEquity.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.USEquity)
        }
        if ($store.state.openAccountDetail.Commodities && $store.state.openAccountDetail.Commodities.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.Commodities)
        }
        if ($store.state.openAccountDetail.Bonds && $store.state.openAccountDetail.Bonds.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.Bonds)
        }
        if ($store.state.openAccountDetail.SectorEquity && $store.state.openAccountDetail.SectorEquity.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.SectorEquity)
        }
        if ($store.state.openAccountDetail.Allocation && $store.state.openAccountDetail.Allocation.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.Allocation)
        }
        if ($store.state.openAccountDetail.Alternative && $store.state.openAccountDetail.Alternative.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.Alternative)
        }
        if ($store.state.openAccountDetail.MoneyMarket && $store.state.openAccountDetail.MoneyMarket.length > 0) {
          Array.prototype.push.apply(selectedFunds, $store.state.openAccountDetail.MoneyMarket)
        }

        if (selectedFunds && selectedFunds.length > 0) {
          for (var i = 0; i < selectedFunds.length; ++i) {
            for (var j = 0; j < fundsData.value.length; ++j) {
              if (selectedFunds[i].Symbol === fundsData.value[j].Symbol) {
                selectedFunds[i].isSelected = true
                checkedFunds.value.push(fundsData.value[j])
              }
            }
          }
        }
      }
    }
    function selectTotalFund() {
      emit('selectedFunds', checkedFunds.value, props.selectedButton)
    }
    const fundsData = computed(() => {
      if (showViewOnlySelected.value) {
        return checkedFunds.value
      } else {
        if (props.selectedButton && props.selectedButton !== 'View All Funds') {
          if (props.selectedButton === 'Bonds') {
            return props.fundsList.filter((a) => a.clsname !== null && a.clsname.includes('Bond'))
          } else {
            return props.fundsList.filter((a) => a.clsname === props.selectedButton)
          }
        }
        return props.fundsList
      }
    })
    const openAllFundsDialog = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const dialogWidth = computed(() => {
      if (display.xl.value) return '55%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    const dialogHeader = computed(() => {
      if (showViewOnlySelected.value) {
        if (props.selectedButton === 'View All Funds') return 'Selected Available Funds'
        else if (props.selectedButton === 'Allocation') return 'Selected Allocation'
        else if (props.selectedButton === 'Bonds') return 'Selected Bonds'
        else if (props.selectedButton === 'U.S. Equity') return 'Selected US Equity'
        else if (props.selectedButton === 'International Equity') return 'Selected International Equity'
        else if (props.selectedButton === 'Commodities') return 'Selected Commodities'
        else if (props.selectedButton === 'Sector Equity') return 'Selected Sector Equity'
        else if (props.selectedButton === 'Alternative') return 'Selected Alternative'
        else if (props.selectedButton === 'Money Market') return 'Selected Money Market'
        else return 'Selected Available Funds'
      } else {
        if (props.selectedButton === 'View All Funds') return 'All Available Funds'
        else if (props.selectedButton === 'Allocation') return 'Allocation'
        else if (props.selectedButton === 'Bonds') return 'Bonds'
        else if (props.selectedButton === 'U.S. Equity') return 'US Equity'
        else if (props.selectedButton === 'International Equity') return 'International Equity'
        else if (props.selectedButton === 'Commodities') return 'Commodities'
        else if (props.selectedButton === 'Sector Equity') return 'Sector Equity'
        else if (props.selectedButton === 'Alternative') return 'Alternative'
        else if (props.selectedButton === 'Money Market') return 'Money Market'
        else return 'Available Funds'
      }
    })
    const dialogHeaderDetail = computed(() => {
      if (props.selectedButton === 'View All Funds') return 'Look up funds using fund name or symbol to add to the proposal'
      else if (props.selectedButton === 'Allocation') return 'Select Allocation funds to add to the funds list in the proposal'
      else if (props.selectedButton === 'Bonds') return 'Select Bonds to add to the funds list in the proposal'
      else if (props.selectedButton === 'U.S. Equity') return 'Select US Equity to add to the funds list in the proposal'
      else if (props.selectedButton === 'International Equity')
        return 'Select International Equity to add to the funds list in the proposal'
      else if (props.selectedButton === 'Commodities') return 'Select Commodities to add to the funds list in the proposal'
      else if (props.selectedButton === 'Sector Equity') return 'Select Sector Equity to add to the funds list in the proposal'
      else if (props.selectedButton === 'Alternative') return 'Select Alternative to add to the funds list in the proposal'
      else if (props.selectedButton === 'Money Market') return 'Select Money Market to add to the funds list in the proposal'
      else return 'Available Funds'
    })
    const dialogPositionNew = computed(() => {
      if (display.xl.value) {
        return `dialogBigScreen`
      } else if (display.lg.value) {
        return `dialoglgScreen`
      } else if (display.md.value) return `dialogMdScreen`
      else if (display.sm.value) return `dialogSmScreen`
      else return `dialoglgScreen`
    })
    const dialogHeight = computed(() => {
      if (display.xl.value) return `calc(100vh - 200px)`
      else if (display.lg.value) return `calc(100vh - 100px)`
      else if (display.md.value) return `calc(100vh - 200px)`
      else if (display.sm.value) return `calc(100vh - 200px)`
      else return `calc(100vh - 100px)`
    })
    watch(
      () => props.selectedButton,
      () => {
        displaySelectedFund()
      },
      { deep: true, immediate: true }
    )
    watch(
      () => checkedFunds.value,
      () => {
        if (checkedFunds.value.length > 0) {
          updateAssetTotal()
        }
        selectTotalFund()
      }
    )
    onMounted(() => {
      eventBus.on('disableNextButton', (data) => {
        disableButton.value = data
      })
      updateAssetTotal()
    })
    onBeforeUnmount(() => {
      eventBus.off('disableNextButton')
    })
    return {
      theme,
      display,
      openAllFundsDialog,
      dialogPositionNew,
      dialogWidth,
      dialogHeader,
      showViewOnlySelected,
      checkedFunds,
      search,
      headers,
      fundsData,
      pagination,
      totalNewMgmt,
      totalNewLoad,
      totalNewSubta,
      totalNewFees,
      disableButton,
      dialogHeaderDetail,
      dialogHeight,
      closeContactInfoDialog,
      viewAll,
      viewOnlySelectedFunds,
      formatPercent,
      addSelectedFunds
    }
  }
}
</script>
<style scoped>
.footerStyle {
  background-color: #f5f5f5;
}
</style>
