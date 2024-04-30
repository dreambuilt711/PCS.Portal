<template>
  <v-col>
    <v-card
      class="mb-1 mt-1 elevation-6"
      :height="$vuetify?.breakpoint?.xs ? 'auto' : '560px'"
      :class="$vuetify?.breakpoint?.smAndDown ? 'ml-1 mr-1' : 'ml-6 mr-6'"
    >
      <v-col xs12>
        <v-row justify="center">
          <v-col xs12 class="justify-center">
            <v-row justify="center">
              <v-col xs11 lg8 class="text-center mb-2 mt-6">
                <v-row justify="center">
                  <h1 class="welcomeFont mb-2">Here are your recommended investments</h1>
                  <h4>
                    Your advisor has recommended the following funds and allocations for your retirement portfolio. Select the
                    fund(s) you want to include in your portfolio and enter the allocation for each fund. Selected fund
                    allocations must equal 100%.
                  </h4>
                </v-row>
              </v-col>
            </v-row>
            <v-col xs12 class="ma-6">
              <v-data-table
                :headers="headers"
                density="compact"
                item-key="Symbol"
                :items="investmentsList"
                class="elevation-1 fixFooter"
                mobile-breakpoint="0"
                :hide-default-footer="true"
                :fixed-header="!$vuetify?.breakpoint?.xs"
                :disable-pagination="true"
                :hide-default-header="$vuetify?.breakpoint?.xs"
                style="backface-visibility: hidden"
                :loading="loadingFund"
                loader-height="2"
                :height="investmentsList.length > 5 ? '340px' : ''"
              >
                <template #item="{ item }">
                  <tr v-if="!$vuetify?.breakpoint?.xs">
                    <td v-if="item.Type === 'Fund'">
                      <a target="_blank" class="cursor-pointer" @click="getFundDetail(item.Symbol)">
                        <span :class="!$vuetify?.theme.dark ? 'text-hyperlink cursor-pointer' : 'text-white cursor-pointer'">
                          {{ item.Symbol ? item.Symbol : '' }}</span
                        >
                        <v-icon
                          v-if="item.Symbol"
                          size="18"
                          class="icon-modal-light cursor-pointer"
                          :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                        />
                      </a>
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
                    <td class="text-right">{{ formatPercent(item.OneYearYeild) }}%</td>
                    <td class="text-right">{{ formatPercent(item.ThreeYearYeild) }}%</td>
                    <td class="text-right">{{ formatPercent(item.FiveYearYeild) }}%</td>
                    <td class="text-right">{{ formatPercent(item.Total) }}%</td>
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
                  </tr>
                  <tr v-else>
                    <td class="pr-3 pl-3">
                      <v-row>
                        <v-col xs12 class="pb-1">
                          <h5 class="pt-1">
                            <span class="text-grey">Symbol/ID</span>
                          </h5>
                          <h4 v-if="item.Type === 'Fund'" class="text-capitalize">
                            <a target="_blank" class="cursor-pointer" @click="getFundDetail(item.Symbol)">
                              <span
                                :class="!$vuetify?.theme.dark ? 'text-hyperlink cursor-pointer' : 'text-white cursor-pointer'"
                              >
                                {{ item.Symbol ? item.Symbol : '' }}</span
                              >
                              <v-icon
                                v-if="item.Symbol"
                                size="18"
                                class="icon-modal-light cursor-pointer"
                                :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                              />
                            </a>
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
                            {{ item.Name }}
                          </h4>
                        </v-col>
                        <v-col xs6 class="pb-1">
                          <h5 class="pt-1">
                            <span class="text-grey">1yr Yield</span>
                          </h5>
                          <h4>{{ formatPercent(item.OneYearYeild) }}%</h4>
                        </v-col>
                        <v-col xs6 class="pb-1">
                          <h5 class="pt-1">
                            <span class="text-grey">3yr Yield</span>
                          </h5>
                          <h4>{{ formatPercent(item.ThreeYearYeild) }}%</h4>
                        </v-col>
                        <v-col xs6 class="pb-1">
                          <h5 class="pt-1">
                            <span class="text-grey">5yr Yield</span>
                          </h5>
                          <h4>{{ formatPercent(item.FiveYearYeild) }}%</h4>
                        </v-col>
                        <v-col xs6 class="pb-1">
                          <h5 class="pt-1">
                            <span class="text-grey">Exp Ratio</span>
                          </h5>
                          <h4>{{ formatPercent(item.Total) }}%</h4>
                        </v-col>
                        <v-col xs8 class="pb-2">
                          <h5 class="pt-1">
                            <span class="text-grey">Allocation</span>
                          </h5>
                          <v-col>
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
                          </v-col>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </template>
                <template v-if="investmentsList.length > 0 && !$vuetify?.breakpoint?.xs" #footer>
                  <div class="v-data-table__wrapper" :class="$vuetify?.theme.dark ? '' : ' grey lighten-3'">
                    <table>
                      <tfoot>
                        <tr>
                          <td class="text-left" style="width: 44%">
                            <strong>Total Funds: {{ investmentsList.length }}</strong>
                          </td>
                          <td class="text-right" style="width: 10%">
                            <strong v-if="investmentsList.length > 0">{{ totalOneYear }}%</strong>
                          </td>
                          <td class="text-right" style="width: 10%">
                            <strong v-if="investmentsList.length > 0">{{ totalThreeYear }}%</strong>
                          </td>
                          <td class="text-right" style="width: 10%">
                            <strong v-if="investmentsList.length > 0">{{ totalFiveYear }}%</strong>
                          </td>
                          <td class="text-right" style="width: 10%">
                            <strong v-if="investmentsList.length > 0">{{ totalExpRatio }}%</strong>
                          </td>
                          <td class="text-left" style="width: 15%">
                            <strong v-if="investmentsList.length > 0">{{ totalElectionPercentage }}%</strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
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
                                  <span class="text-grey">Total Funds</span>
                                </h5>
                                <h4 class="text-uppercase">
                                  {{ investmentsList.length }}
                                </h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <v-row>
                              <v-col xs12>
                                <h5 class="pt-1">
                                  <span class="text-grey">Total 1yr Yield</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalOneYear }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <v-row>
                              <v-col xs12>
                                <h5 class="pt-1">
                                  <span class="text-grey">Total 3yr Yield</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalThreeYear }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <v-row>
                              <v-col xs12>
                                <h5 class="pt-1">
                                  <span class="text-grey">Total 5yr Yield</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalFiveYear }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <v-row>
                              <v-col xs12>
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Exp Ratio</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalExpRatio }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
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
                      Automatically Rebalance Investments
                      <v-tooltip offset="120" color="white" location="bottom">
                        <template #activator="{ props }">
                          <v-icon v-bind="props" size="16" class="icon-information searchDoc pr-1 pl-2" />
                        </template>
                        <span class="toolTipStyle elevation-5" style="color: black"
                          >This feature automatically rebalances your account to maintain the asset allocation percentages that
                          you elect.</span
                        >
                      </v-tooltip>
                    </template>
                  </v-checkbox>
                  <v-col v-if="rebalanceInvestmentSelected" pt-2 pl-2 xs12 sm4 md2>
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
                </v-row>
              </v-col>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <v-col :class="$vuetify?.breakpoint?.smAndDown ? '' : 'ml-4 mr-4'">
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
            :disabled="nextButton"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="saveSelectedInvestments()"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      investmentsList: [],
      rebalanceItems: 'Annual',
      rebalanceInvestmentSelected: false,
      loadingFund: false,
      headers: [
        {
          text: 'Symbol/ID',
          align: 'start',
          sortable: false,
          value: 'Symbol',
          width: '15%'
        },
        {
          text: 'Name',
          value: 'Name',
          align: 'center',
          width: '30%',
          sortable: false
        },
        {
          text: '1yr Yield',
          value: 'OneYearYeild',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: '3yr Yield',
          value: 'ThreeYearYeild',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: '5yr Yield',
          value: 'FiveYearYeild',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: 'Exp Ratio',
          value: 'Total',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: 'Allocation',
          value: 'ElectionPercentage',
          align: 'center',
          sortable: false,
          width: '15%'
        }
      ],
      items: [
        { text: 'Annual', value: 'Annual' },
        { text: 'Quarterly', value: 'Quarterly' },
        { text: 'Semi-Annual', value: 'Semi-Annual' }
      ],
      totalOneYear: 0,
      totalThreeYear: 0,
      totalFiveYear: 0,
      totalExpRatio: 0,
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
  created() {
    this.getSelectedInvestment()
  },
  methods: {
    getFundDetail(ticker) {
      if (ticker) {
        this.$axios.get(`/api/v1/fund/${ticker}/morningstarurl`).then((success) => {
          if (success.data.d) {
            this.onPopUpEvent(success.data.d)
          }
        })
      }
    },
    goBack() {
      this.$emit('goBack')
    },
    getSelectedInvestment() {
      if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
        this.loadingFund = true
        this.$axios
          .get(
            `/api/v1/user/clientproductinvestment/${this.$store.state.openAccountDetail.ClientProduct}/opportunityfunds/${this.$store.state.openAccountDetail.OpportunityId}/getall`
          )
          .then((success) => {
            this.investmentsList = success.data.d && success.data.d.length > 0 ? success.data.d : []
            this.investmentsList.sort(function (a, b) {
              let left = a.Type
              let right = b.Type
              return left === right ? 0 : left === 'Model' ? 1 : -1
            })
            this.investmentsList.forEach((element) => {
              element.Total = element.Total * 100
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
      this.totalOneYear = 0
      this.totalThreeYear = 0
      this.totalFiveYear = 0
      this.totalExpRatio = 0
      this.totalElectionPercentage = 0
      if (this.investmentsList.length > 0) {
        var sumOneYear = 0
        var sumThreeYear = 0
        var sumFiveYear = 0
        var sumTotalFees = 0
        var sumElectionPercentage = 0
        if (this.investmentsList.length > 0) {
          for (var i = 0; i < this.investmentsList.length; i++) {
            sumOneYear += this.investmentsList[i].OneYearYeild ? Number(this.investmentsList[i].OneYearYeild) : Number(0)
            sumThreeYear += this.investmentsList[i].ThreeYearYeild ? Number(this.investmentsList[i].ThreeYearYeild) : Number(0)
            sumFiveYear += this.investmentsList[i].FiveYearYeild ? Number(this.investmentsList[i].FiveYearYeild) : Number(0)
            sumTotalFees += !(this.investmentsList[i].Total === -999) ? Number(this.investmentsList[i].Total) : Number(0)
            sumElectionPercentage += !(this.investmentsList[i].ElectionPercentage === -999)
              ? Number(this.investmentsList[i].ElectionPercentage)
              : Number(0)
          }
          this.totalOneYear = parseFloat(Number(sumOneYear) / this.investmentsList.length).toFixed(2)
          this.totalThreeYear = parseFloat(Number(sumThreeYear) / this.investmentsList.length).toFixed(2)
          this.totalFiveYear = parseFloat(Number(sumFiveYear) / this.investmentsList.length).toFixed(2)
          this.totalExpRatio = parseFloat(Number(sumTotalFees) / this.investmentsList.length).toFixed(2)
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
            ElectionPercentage: x.ElectionPercentage
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
        RegistrationId: this.$store.state.openAccountDetail.RegistrationId,
        AutoRebalance: this.rebalanceInvestmentSelected === true ? 'Yes' : 'No',
        RebalanceFrequency: this.rebalanceInvestmentSelected === true ? this.rebalanceItems : ''
      }
      this.$axios.post(`/api/v1/sfdc/Registration/autorebalance`, registrationObject)
      this.$emit('goToNextWindow')
    },
    deleteRow(item) {
      if (item && item.FundId) {
        const index = this.investmentsList.indexOf(item)
        if (index > -1) {
          this.investmentsList.splice(index, 1)
          this.deleteInvestment.push(item.OpportunityFundId)
          this.updateAssetTotal()
        }
      }
    }
  }
}
</script>
<style scoped></style>
