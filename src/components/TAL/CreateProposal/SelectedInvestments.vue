<template>
  <v-row justify="center">
    <v-col xs12 sm11 lg11 xl11 class="justify-center">
      <v-col xs12 class="text-center">
        <h2>{{ investmentsList.length }} Funds Selected</h2>
      </v-col>
      <v-col>
        <h3 class="text-center">Set your fund allocation or skip for now.</h3>
      </v-col>
      <v-col :class="!$vuetify?.breakpoint?.xs ? 'tablePosition' : ''">
        <v-data-table
          :headers="headers"
          density="compact"
          item-key="Symbol"
          :items="investmentsList"
          class="elevation-1"
          mobile-breakpoint="0"
          :hide-default-footer="true"
          :fixed-header="!$vuetify?.breakpoint?.xs"
          :disable-pagination="true"
          style="backface-visibility: hidden"
          :loading="loadingFund"
          loader-height="2"
          :hide-default-header="$vuetify?.breakpoint?.xs"
          :height="investmentsList.length > 5 ? '340px' : ''"
        >
          <template #item="{ item }">
            <tr v-if="!$vuetify?.breakpoint?.xs">
              <td>
                <v-icon :color="$vuetify?.theme.dark ? '' : 'error'" @click="deleteRow(item)"> mdi-close-circle </v-icon>
              </td>
              <td v-if="item.Type === 'Fund'">
                <span :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">
                  {{ item.Symbol ? item.Symbol : '' }}</span
                >
              </td>
              <td v-else>
                <span :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">
                  {{ item.ModelFundsListID ? item.ModelFundsListID : '' }}</span
                >
              </td>
              <td>
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <span :class="!$vuetify?.theme.dark ? '' : 'text-white'" v-bind="props">{{ item.Name }}</span>
                  </template>
                  <span>{{ item.Name }}</span>
                </v-tooltip>
              </td>
              <td>
                <v-text-field
                  v-model="item.ElectionPercentage"
                  v-input-mask="{
                    alias: 'numeric',
                    digits: '2',
                    digitsOptional: true,
                    rightAlign: false,
                    allowMinus: false,
                    placeholder: '',
                    autoUnmask: true,
                    max: '100'
                  }"
                  variant="outlined"
                  suffix="%"
                  :hide-details="true"
                  density="compact"
                  single-line
                  @update:model-value="updateAssetTotal()"
                />
              </td>
              <td v-if="item.Type === 'Fund'">
                <v-checkbox-btn v-model="item.LoadWaived" :disabled="item.DisableLoadWaived" color="accent" align="center" />
              </td>
              <td v-else />
              <td>{{ formatPercent(item.mgmt) }}%</td>
              <td>{{ formatPercent(item.tload) }}%</td>
              <td>{{ formatPercent(item.SubTA) }}%</td>
              <td>{{ formatPercent(item.Total) }}%</td>
            </tr>
            <tr v-else>
              <td class="pr-3 pl-3">
                <v-row>
                  <v-col xs2 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey" />
                    </h5>
                    <h4 class="text-capitalize pt-2">
                      <v-icon :color="$vuetify?.theme.dark ? '' : 'error'" @click="deleteRow(item)"> mdi-close-circle </v-icon>
                    </h4>
                  </v-col>
                  <v-col xs10 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Symbol/ID</span>
                    </h5>
                    <h4 v-if="item.Type === 'Fund'" class="text-capitalize">
                      <span :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">
                        {{ item.Symbol ? item.Symbol : '' }}</span
                      >
                    </h4>
                    <h4 v-else class="text-capitalize">
                      <span :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">
                        {{ item.ModelFundsListID ? item.ModelFundsListID : '' }}</span
                      >
                    </h4>
                  </v-col>
                  <v-col xs12 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Name</span>
                    </h5>
                    <h4 class="text-uppercase">
                      <v-tooltip location="bottom">
                        <template #activator="{ props }">
                          <span :class="!$vuetify?.theme.dark ? '' : 'text-white'" v-bind="props">{{ item.Name }}</span>
                        </template>
                        <span>{{ item.Name }}</span>
                      </v-tooltip>
                    </h4>
                  </v-col>
                  <v-col xs12 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Allocation</span>
                    </h5>
                    <h4 class="text-uppercase">
                      <v-text-field
                        v-model="item.ElectionPercentage"
                        v-input-mask="{
                          alias: 'numeric',
                          digits: '2',
                          digitsOptional: true,
                          rightAlign: false,
                          allowMinus: false,
                          placeholder: '',
                          autoUnmask: true,
                          max: '100'
                        }"
                        variant="outlined"
                        suffix="%"
                        :hide-details="true"
                        density="compact"
                        single-line
                        @update:model-value="updateAssetTotal()"
                      />
                    </h4>
                  </v-col>
                  <v-col v-if="item.Type === 'Fund'" xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Load Waive</span>
                    </h5>
                    <h4>
                      <v-checkbox-btn v-model="item.LoadWaived" :disabled="item.DisableLoadWaived" color="accent" />
                    </h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Mgmt</span>
                    </h5>
                    <h4>{{ formatPercent(item.mgmt) }}%</h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">12b-1</span>
                    </h5>
                    <h4>{{ formatPercent(item.tload) }}%</h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">SubTA</span>
                    </h5>
                    <h4>{{ formatPercent(item.SubTA) }}%</h4>
                  </v-col>
                  <v-col xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Total Fees</span>
                    </h5>
                    <h4>{{ formatPercent(item.Total) }}%</h4>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </template>
          <template v-if="$vuetify?.breakpoint?.xs && investmentsList.length > 0" v-slot:body.append>
            <tr>
              <td class="pl-3 pr-3 pb-2">
                <v-col xs12>
                  <v-row>
                    <v-col xs6 class="pb-1">
                      <v-row>
                        <v-col xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total Allocation</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalElectionPercentage }}%</h4>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs6 class="pb-1">
                      <v-row>
                        <v-col xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total Mgmt</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewMgmt }}%</h4>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs6 class="pb-1">
                      <v-row>
                        <v-col xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total 12b-1</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewLoad }}%</h4>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs6 class="pb-1">
                      <v-row>
                        <v-col xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total SubTA</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewSubta }}%</h4>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs6 class="pb-1">
                      <v-row>
                        <v-col xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total Fees</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewFees }}%</h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-col>
          <v-row>
            <v-checkbox v-model="rebalanceInvestmentSelected" class="changeCheckboxColor">
              <template #label>
                Automatically rebalance
                <v-tooltip offset="120" color="white" location="bottom">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" size="16" class="icon-information searchDoc pr-1 pl-2" />
                  </template>
                  <span class="toolTipStyle" style="color: black"
                    >This feature automatically rebalances your account to maintain the asset allocation percentages that you
                    elect.</span
                  >
                </v-tooltip>
              </template>
            </v-checkbox>
            <v-col v-if="rebalanceInvestmentSelected" pt-2 pl-2 sm2>
              <v-select
                v-model="rebalanceItems"
                class="rebalanceDropdown"
                hide-details
                color="accent"
                :items="items"
                density="compact"
                variant="outlined"
              >
                <template #selection="{ item }">
                  <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ item.text }}</span>
                </template>
                <template #item="slotProps">
                  <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ slotProps.item.text }}</span>
                </template>
                <template #append>
                  <v-icon color="hyperlink"> icon-chevron-down </v-icon>
                </template>
              </v-select>
            </v-col>
            <v-col v-if="investmentsList.length > 0 && !$vuetify?.breakpoint?.xs" class="d-flex flex-row-reverse pr-7 pt-2">
              <tr class="justify-space-between">
                <th class="text-h6 pr-10">
                  {{ totalElectionPercentage }}%
                  <h6 v-if="nextButton">(must = 100%)</h6>
                </th>
                <th class="text-h6 pl-9 pr-10" />
                <th class="text-h6 pr-7">{{ totalNewMgmt }}%</th>
                <th class="text-h6 pr-7">{{ totalNewLoad }}%</th>
                <th class="text-h6 pr-7">{{ totalNewSubta }}%</th>
                <th class="text-h6 pr-2">{{ totalNewFees }}%</th>
                <th class="text-h6" />
              </tr>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
      <v-col :class="$vuetify?.breakpoint?.xs ? 'pt-5' : 'pt-14'">
        <v-row justify="center">
          <v-col class="text-center" lg4>
            <v-col>
              <v-btn
                class="text-capitalize"
                size="x-large"
                block
                :location="true && 'bottom'"
                :color="$vuetify?.theme.dark ? '' : 'accent'"
                :disabled="nextButton"
                @click="saveSelectedInvestments()"
              >
                Next
              </v-btn>
            </v-col>
            <v-col v-if="false" pt-2 class="align-self">
              <a :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white', 'font_14']" @click="goToNextWindow()"
                ><b>Skip, I'll do this later</b></a
              >
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ['loadWaived'],
  data() {
    return {
      investmentsList: [],
      rebalanceItems: 'Annual',
      rebalanceInvestmentSelected: false,
      loadingFund: false,
      headers: [
        {
          text: '',
          align: 'start',
          sortable: false,
          width: '25px',
          value: ''
        },
        {
          text: 'Symbol/ID',
          align: 'start',
          sortable: false,
          value: 'Symbol'
        },
        {
          text: 'Name',
          value: 'Name',
          align: 'start',
          width: '320px',
          sortable: false
        },
        {
          text: 'Allocation',
          value: 'ElectionPercentage',
          sortable: false,
          width: '120px'
        },
        {
          text: 'Load Waive',
          value: 'LoadWaived',
          align: 'center',
          width: '10px',
          sortable: false
        },
        { text: 'Mgmt.', value: 'mgmt', align: 'start', sortable: false },
        { text: '12b-1', value: 'tload', sortable: false },
        { text: 'SubTA', value: 'SubTA', sortable: false },
        { text: 'Total Fees', value: 'Total', sortable: false }
      ],
      clientProductId: '',
      opportunityId: '',
      registrationId: '',
      items: [
        { text: 'Annual', value: 'Annual' },
        { text: 'Quarterly', value: 'Quarterly' },
        { text: 'Semi-Annual', value: 'Semi-Annual' }
      ],
      totalNewMgmt: 0,
      totalNewLoad: 0,
      totalNewSubta: 0,
      totalNewFees: 0,
      totalElectionPercentage: 0,
      deleteInvestment: []
    }
  },
  computed: {
    nextButton() {
      if (this.totalElectionPercentage !== '100.00') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    loadWaived: {
      handler(val) {
        if (val) {
          this.getSelectedInvestment()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getSelectedInvestment()
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.clientProductId = this.$store.state.openAccountDetail.ClientProduct
      this.opportunityId = this.$store.state.openAccountDetail.OpportunityId
      this.registrationId = this.$store.state.openAccountDetail.RegistrationId
    }
  },
  methods: {
    saveInStore(val) {
      let selectedFund = val && val.length > 0 ? val : []
      if (selectedFund && selectedFund.length > 0) {
        let selectedInternationalEquityFunds = selectedFund.filter((a) => a.clsname === 'International Equity')
        let selectedUSEquityFunds = selectedFund.filter((a) => a.clsname === 'U.S. Equity')
        let selectedCommodities = selectedFund.filter((a) => a.clsname === 'Commodities')
        let selectedBonds = selectedFund.filter((a) => a.clsname !== null && a.clsname.includes('Bond'))
        let selectedSectorEquityFunds = selectedFund.filter((a) => a.clsname === 'Sector Equity')
        let selectedAllocationFunds = selectedFund.filter((a) => a.clsname === 'Allocation')
        let selectedAlternative = selectedFund.filter((a) => a.clsname === 'Alternative')
        let selectedMoneyMarket = selectedFund.filter((a) => a.clsname === 'Money Market')

        if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
          this.$store.state.openAccountDetail.InternationalEquity =
            selectedInternationalEquityFunds && selectedInternationalEquityFunds.length > 0
              ? selectedInternationalEquityFunds
              : []
          this.$store.state.openAccountDetail.USEquity =
            selectedUSEquityFunds && selectedUSEquityFunds.length > 0 ? selectedUSEquityFunds : []
          this.$store.state.openAccountDetail.Commodities =
            selectedCommodities && selectedCommodities.length > 0 ? selectedCommodities : []
          this.$store.state.openAccountDetail.Bonds = selectedBonds && selectedBonds.length > 0 ? selectedBonds : []
          this.$store.state.openAccountDetail.SectorEquity =
            selectedSectorEquityFunds && selectedSectorEquityFunds.length > 0 ? selectedSectorEquityFunds : []
          this.$store.state.openAccountDetail.Allocation =
            selectedAllocationFunds && selectedAllocationFunds.length > 0 ? selectedAllocationFunds : []
          this.$store.state.openAccountDetail.Alternative =
            selectedAlternative && selectedAlternative.length > 0 ? selectedAlternative : []
          this.$store.state.openAccountDetail.MoneyMarket =
            selectedMoneyMarket && selectedMoneyMarket.length > 0 ? selectedMoneyMarket : []
        }
      }
    },
    getSelectedInvestment() {
      if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
        const loadWaivedOptions = this.loadWaived ? this.loadWaived : 'Optional'
        this.loadingFund = true
        this.$axios
          .get(
            `/api/v1/user/clientproductinvestment/${this.$store.state.openAccountDetail.ClientProduct}/opportunityfunds/${this.$store.state.openAccountDetail.OpportunityId}/getall`
          )
          .then((success) => {
            var fundsSelected = success.data.d.filter((a) => a.Type === 'Fund')
            if (fundsSelected && fundsSelected.length > 0) {
              fundsSelected = fundsSelected.filter((a) => a.clsname)
              this.saveInStore(fundsSelected)
            }
            this.investmentsList = success.data.d && success.data.d.length > 0 ? success.data.d : []
            this.investmentsList.sort(function (a, b) {
              let left = a.Type
              let right = b.Type
              return left === right ? 0 : left === 'Model' ? 1 : -1
            })
            this.investmentsList.forEach((element) => {
              element.mgmt = element.mgmt * 100
              element.tload = element.tload * 100
              element.SubTA = element.SubTA * 100
              element.Total = element.Total * 100
              element.DisableLoadWaived = loadWaivedOptions !== 'Optional' ? true : false
              if (loadWaivedOptions !== 'Optional') {
                element.LoadWaived = loadWaivedOptions === 'Load Waived' ? true : false
              } else {
                element.LoadWaived = element.LoadWaived ? true : false
              }
            })
            this.updateAssetTotal()
          })
          .finally(() => {
            this.loadingFund = false
          })
        this.$axios
          .get(`/api/v1/sfdc/Registration/${this.$store.state.openAccountDetail.RegistrationId}/autorebalance`)
          .then((success) => {
            this.rebalanceItems = success.data.d.RebalanceFrequency ? success.data.d.RebalanceFrequency : 'Annual'
            this.rebalanceInvestmentSelected = success.data.d.AutoRebalance === 'Yes' ? true : false
          })
      }
    },
    updateAssetTotal() {
      this.totalNewFees = 0
      this.totalNewMgmt = 0
      this.totalNewLoad = 0
      this.totalNewSubta = 0
      this.totalElectionPercentage = 0
      if (this.investmentsList.length > 0) {
        var sumMgmt = 0
        var sumTload = 0
        var sumSubta = 0
        var sumTotalFees = 0
        var sumElectionPercentage = 0
        if (this.investmentsList.length > 0) {
          for (var i = 0; i < this.investmentsList.length; i++) {
            sumMgmt += !(this.investmentsList[i].mgmt === -999) ? Number(this.investmentsList[i].mgmt) : Number(0)
            sumTload += !(this.investmentsList[i].tload === -999) ? Number(this.investmentsList[i].tload) : Number(0)
            sumSubta += !(this.investmentsList[i].SubTA === -999) ? Number(this.investmentsList[i].SubTA) : Number(0)
            sumTotalFees += !(this.investmentsList[i].Total === -999) ? Number(this.investmentsList[i].Total) : Number(0)
            sumElectionPercentage += !(this.investmentsList[i].ElectionPercentage === -999)
              ? Number(this.investmentsList[i].ElectionPercentage)
              : Number(0)
          }
          this.totalNewMgmt = parseFloat(Number(sumMgmt) / this.investmentsList.length).toFixed(2)
          this.totalNewLoad = parseFloat(Number(sumTload) / this.investmentsList.length).toFixed(2)
          this.totalNewSubta = parseFloat(Number(sumSubta) / this.investmentsList.length).toFixed(2)
          this.totalNewFees = parseFloat(Number(sumTotalFees) / this.investmentsList.length).toFixed(2)
          this.totalElectionPercentage = parseFloat(Number(sumElectionPercentage)).toFixed(2)
        }
      }
    },
    formatPercent(val) {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    },
    goToNextWindow() {
      this.$emit('goToNextWindow')
    },
    saveSelectedInvestments() {
      this.selectedInvestmentsArray = []
      if (this.investmentsList.length > 0) {
        this.investmentsList.map((x) => {
          var selectedInvestmentsObject = {
            OpportunityFundId: x.OpportunityFundId,
            ElectionPercentage: x.ElectionPercentage,
            LoadWaived: x.LoadWaived
          }
          this.selectedInvestmentsArray.push(selectedInvestmentsObject)
        })
        if (this.deleteInvestment && this.deleteInvestment.length > 0) {
          this.$axios.delete(`/api/v1/sfdc/opportunityfund/delete/multiple`, {
            data: this.deleteInvestment
          })
        }
        if (this.selectedInvestmentsArray && this.selectedInvestmentsArray.length > 0) {
          this.$axios.post(`/api/v1/sfdc/opportunityfund/saveall`, this.selectedInvestmentsArray)
        }
      }

      var registrationObject = {
        RegistrationId: this.registrationId,
        AutoRebalance: this.rebalanceInvestmentSelected === true ? 'Yes' : 'No',
        RebalanceFrequency: this.rebalanceInvestmentSelected === true ? this.rebalanceItems : ''
      }
      this.$axios.post(`/api/v1/sfdc/Registration/autorebalance`, registrationObject)
      this.$emit('goToNextWindow')
    },
    removeSelectedFund(val) {
      if (val && val.clsname) {
        if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
          if (val.clsname === 'International Equity') {
            if (this.$store.state.openAccountDetail.InternationalEquity) {
              const index = this.$store.state.openAccountDetail.InternationalEquity.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.InternationalEquity.splice(index, 1)
              }
            }
          } else if (val.clsname === 'U.S. Equity') {
            if (this.$store.state.openAccountDetail.USEquity) {
              const index = this.$store.state.openAccountDetail.USEquity.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.USEquity.splice(index, 1)
              }
            }
          } else if (val.clsname === 'Commodities') {
            if (this.$store.state.openAccountDetail.Commodities) {
              const index = this.$store.state.openAccountDetail.Commodities.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.Commodities.splice(index, 1)
              }
            }
          } else if (val.clsname === 'Bond') {
            if (this.$store.state.openAccountDetail.Bonds) {
              const index = this.$store.state.openAccountDetail.Bonds.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.Bonds.splice(index, 1)
              }
            }
          } else if (val.clsname === 'Sector Equity') {
            if (this.$store.state.openAccountDetail.SectorEquity) {
              const index = this.$store.state.openAccountDetail.SectorEquity.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.SectorEquity.splice(index, 1)
              }
            }
          } else if (val.clsname === 'Allocation') {
            if (this.$store.state.openAccountDetail.Allocation) {
              const index = this.$store.state.openAccountDetail.Allocation.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.Allocation.splice(index, 1)
              }
            }
          } else if (val.clsname === 'Alternative') {
            if (this.$store.state.openAccountDetail.Alternative) {
              const index = this.$store.state.openAccountDetail.Alternative.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.Alternative.splice(index, 1)
              }
            }
          } else if (val.clsname === 'Money Market') {
            if (this.$store.state.openAccountDetail.MoneyMarket) {
              const index = this.$store.state.openAccountDetail.MoneyMarket.indexOf(val)
              if (index > -1) {
                this.$store.state.openAccountDetail.MoneyMarket.splice(index, 1)
              }
            }
          }
        }
      }
    },
    deleteRow(item) {
      if (item && item.FundId) {
        const index = this.investmentsList.indexOf(item)
        if (index > -1) {
          this.investmentsList.splice(index, 1)
          this.removeSelectedFund(item)
          this.deleteInvestment.push(item.OpportunityFundId)
          this.updateAssetTotal()
        }
      }
    }
  }
}
</script>

<style>
.rebalanceDropdown {
  width: 180px;
  height: 30px;
}
.footerSpacing {
  padding-top: 8px;
  padding-left: 208px;
}
.tablePosition {
  height: 320px;
}
.toolTipStyle {
  box-shadow: 20px 20px 50px grey;
}
</style>
