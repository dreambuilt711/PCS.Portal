<template>
  <v-flex>
    <v-flex class="text-center" pb-4 pt-2>
      <h1>Selected Investments</h1>
    </v-flex>
    <v-flex>
      <v-card width="100%">
        <v-data-table
          :headers="headers"
          density="compact"
          item-key="Symbol"
          :items="selectedFundDetails"
          class="elevation-3"
          mobile-breakpoint="0"
          :hide-default-footer="true"
          :fixed-header="!$vuetify.breakpoint.xsOnly"
          :disable-pagination="true"
          style="backface-visibility: hidden"
          :loading="loadingFund"
          loader-height="2"
          :hide-default-header="$vuetify.breakpoint.xsOnly"
          :height="selectedFundDetails.length > 5 ? '340px' : ''"
        >
          <template v-slot:item="{ item }">
            <tr v-if="!$vuetify.breakpoint.xsOnly">
              <td>
                <v-icon :color="$vuetify.theme.dark ? '' : 'error'" @click="deleteRow(item)">mdi-close-circle</v-icon>
              </td>
              <td>
                <span :class="!$vuetify.theme.dark ? 'hyperlink--text' : 'white--text'">
                  {{ item.Symbol ? item.Symbol : '' }}</span
                >
              </td>
              <td>
                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <span :class="!$vuetify.theme.dark ? '' : 'text-white'" v-bind="props">{{ item.Name }}</span>
                  </template>
                  <span>{{ item.Name }}</span>
                </v-tooltip>
              </td>
              <td class="pt-1 pb-1">
                <v-text-field
                  v-model="item.ElectionPercentage"
                  variant="outlined"
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
                  suffix="%"
                  :hide-details="true"
                  density="compact"
                  single-line
                  @update:model-value="updateAssetTotal()"
                >
                </v-text-field>
              </td>
              <td>{{ formatPercent(item.mgmt) }}%</td>
              <td>{{ formatPercent(item.tload) }}%</td>
              <td>{{ formatPercent(item.SubTA) }}%</td>
              <td>{{ formatPercent(item.Total) }}%</td>
            </tr>
            <tr v-else>
              <td class="pr-3 pl-3">
                <v-row>
                  <v-flex xs2 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey"></span>
                    </h5>
                    <h4 class="text-capitalize pt-2">
                      <v-icon :color="$vuetify.theme.dark ? '' : 'error'" @click="deleteRow(item)">mdi-close-circle</v-icon>
                    </h4>
                  </v-flex>
                  <v-flex xs10 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Symbol/ID</span>
                    </h5>
                    <h4 class="text-capitalize" v-if="item.Type === 'Fund'">
                      <span :class="!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white'">
                        {{ item.Symbol ? item.Symbol : '' }}</span
                      >
                    </h4>
                    <h4 class="text-capitalize" v-else>
                      <span :class="!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white'">
                        {{ item.ModelFundsListID ? item.ModelFundsListID : '' }}</span
                      >
                    </h4>
                  </v-flex>
                  <v-flex xs12 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Name</span>
                    </h5>
                    <h4 class="text-uppercase">
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <span :class="!$vuetify.theme.dark ? '' : 'text-white'" v-bind="props">{{ item.Name }}</span>
                        </template>
                        <span>{{ item.Name }}</span>
                      </v-tooltip>
                    </h4>
                  </v-flex>
                  <v-flex xs12 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Allocation</span>
                    </h5>
                    <h4 class="text-uppercase">
                      <v-text-field
                        v-model="item.ElectionPercentage"
                        variant="outlined"
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
                        suffix="%"
                        :hide-details="true"
                        density="compact"
                        single-line
                        @update:model-value="updateAssetTotal()"
                      >
                      </v-text-field>
                    </h4>
                  </v-flex>
                  <v-flex xs6 class="pb-1" v-if="item.Type === 'Fund'">
                    <h5 class="pt-1">
                      <span class="text-grey">Load Waive</span>
                    </h5>
                    <h4>
                      <v-checkbox-btn
                        v-model="item.LoadWaived"
                        :disabled="item.DisableLoadWaived"
                        color="accent"
                      ></v-checkbox-btn>
                    </h4>
                  </v-flex>
                  <v-flex xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Mgmt</span>
                    </h5>
                    <h4>{{ formatPercent(item.mgmt) }}%</h4>
                  </v-flex>
                  <v-flex xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">12b-1</span>
                    </h5>
                    <h4>{{ formatPercent(item.tload) }}%</h4>
                  </v-flex>
                  <v-flex xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">SubTA</span>
                    </h5>
                    <h4>{{ formatPercent(item.SubTA) }}%</h4>
                  </v-flex>
                  <v-flex xs6 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Total Fees</span>
                    </h5>
                    <h4>{{ formatPercent(item.Total) }}%</h4>
                  </v-flex>
                </v-row>
              </td>
            </tr>
          </template>
          <template v-slot:body.append v-if="$vuetify.breakpoint.xsOnly && selectedFundDetails && selectedFundDetails.length > 0">
            <tr>
              <td class="pl-3 pr-3 pb-2">
                <v-flex xs12>
                  <v-row>
                    <v-flex xs6 class="pb-1">
                      <v-row>
                        <v-flex xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total Allocation</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalElectionPercentage }}%</h4>
                        </v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xs6 class="pb-1">
                      <v-row>
                        <v-flex xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total Mgmt</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewMgmt }}%</h4>
                        </v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xs6 class="pb-1">
                      <v-row>
                        <v-flex xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total 12b-1</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewLoad }}%</h4>
                        </v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xs6 class="pb-1">
                      <v-row>
                        <v-flex xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total SubTA</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewSubta }}%</h4>
                        </v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xs6 class="pb-1">
                      <v-row>
                        <v-flex xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total Fees</span>
                          </h5>
                          <h4 class="text-uppercase">{{ totalNewFees }}%</h4>
                        </v-flex>
                      </v-row>
                    </v-flex>
                  </v-row>
                </v-flex>
              </td>
            </tr>
          </template>
          <template #footer v-if="selectedFundDetails.length > 0 && !$vuetify.breakpoint.xsOnly">
            <div class="v-data-table__wrapper" :class="$vuetify.theme.dark ? '' : ' grey lighten-3'">
              <table>
                <tfoot>
                  <tr>
                    <td style="width: 25px"></td>
                    <td style="width: 130px" class="pl-10"><strong v-if="selectedFundDetails.length > 0">Total</strong></td>
                    <td style="width: 320px"></td>
                    <td class="text-left" style="width: 120px">
                      <strong>{{ totalElectionPercentage }}%</strong>
                      <h5 v-if="nextButton"><b>(must = 100%)</b></h5>
                    </td>
                    <td class="text-left px-0">
                      <strong v-if="selectedFundDetails.length > 0">{{ totalNewMgmt }}%</strong>
                    </td>
                    <td class="text-left px-0">
                      <strong v-if="selectedFundDetails.length > 0">{{ totalNewLoad }}%</strong>
                    </td>
                    <td class="text-left px-0">
                      <strong v-if="selectedFundDetails.length > 0">{{ totalNewSubta }}%</strong>
                    </td>
                    <td class="text-left px-0">
                      <strong v-if="selectedFundDetails.length > 0">{{ totalNewFees }}%</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-flex pt-5>
      <v-flex class="text-center">
        <v-col class="pa-0">
          <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="nextSlide()" :disabled="nextButton"
            >Next
          </v-btn>
        </v-col>
        <v-col class="pl-0 pr-0 pt-2">
          <v-btn class="text-capitalize" variant="outlined" :color="$vuetify.theme.dark ? '' : 'accent'" @click="prevSlide()"
            >Go Back</v-btn
          >
        </v-col>
      </v-flex>
    </v-flex>
  </v-flex>
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
          text: '',
          align: 'start',
          sortable: false,
          width: '25px',
          value: ''
        },
        {
          text: 'Symbol/ID',
          align: 'start',
          width: '80px',
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
        // {
        //   text: 'Load Waive',
        //   value: 'LoadWaived',
        //   align: 'center',
        //   width: '10px',
        //   sortable: false
        // },
        { text: 'Mgmt.', value: 'mgmt', align: 'start', sortable: false },
        { text: '12b-1', value: 'tload', sortable: false },
        { text: 'SubTA', value: 'SubTA', sortable: false },
        { text: 'Total Fees', value: 'Total', sortable: false }
      ],
      clientProductId: '',
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
      selectedFundDetails: []
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
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.clientProductId = this.$store.state.soloKOpenAccountDetail.ClientProduct
      this.totalElectionPercentage = this.$store.state.soloKOpenAccountDetail.TotalElectionPercentage
      this.selectedFundDetails =
        this.$store.state.soloKOpenAccountDetail.selectedFunds &&
        this.$store.state.soloKOpenAccountDetail.selectedFunds.length > 0
          ? this.$store.state.soloKOpenAccountDetail.selectedFunds
          : []
      this.updateAssetTotal()
    }
  },
  methods: {
    nextSlide() {
      var fundDetails = []
      for (var i = 0; i < this.selectedFundDetails.length; i++) {
        fundDetails.push({
          FundTicker: this.selectedFundDetails[i].Symbol,
          FundName: this.selectedFundDetails[i].Name,
          Percent: this.selectedFundDetails[i].ElectionPercentage
        })
      }
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.InvestmentSelections = fundDetails
      this.$store.state.soloKOpenAccountDetail.selectedFunds =
        this.selectedFundDetails && this.selectedFundDetails.length > 0 ? this.selectedFundDetails : []
      this.$emit('nextSlide')
    },
    updateAssetTotal() {
      this.totalNewFees = 0
      this.totalNewMgmt = 0
      this.totalNewLoad = 0
      this.totalNewSubta = 0
      this.totalNewMgmt = this.$store.state.soloKOpenAccountDetail.TotalNewMgmt
        ? this.$store.state.soloKOpenAccountDetail.TotalNewMgmt
        : 0
      this.totalNewLoad = this.$store.state.soloKOpenAccountDetail.TotalNewLoad
        ? this.$store.state.soloKOpenAccountDetail.TotalNewLoad
        : 0
      this.totalNewSubta = this.$store.state.soloKOpenAccountDetail.TotalNewSubta
        ? this.$store.state.soloKOpenAccountDetail.TotalNewSubta
        : 0
      this.totalNewFees = this.$store.state.soloKOpenAccountDetail.TotalNewFees
        ? this.$store.state.soloKOpenAccountDetail.TotalNewFees
        : 0
      this.totalElectionPercentage = 0
      if (this.selectedFundDetails && this.selectedFundDetails.length > 0) {
        var sumMgmt = 0
        var sumTload = 0
        var sumSubta = 0
        var sumTotalFees = 0
        var sumElectionPercentage = 0
        for (var i = 0; i < this.selectedFundDetails.length; i++) {
          sumMgmt += !(this.selectedFundDetails[i].mgmt === -999) ? Number(this.selectedFundDetails[i].mgmt) : Number(0)
          sumTload += !(this.selectedFundDetails[i].tload === -999) ? Number(this.selectedFundDetails[i].tload) : Number(0)
          sumSubta += !(this.selectedFundDetails[i].SubTA === -999) ? Number(this.selectedFundDetails[i].SubTA) : Number(0)
          sumTotalFees += !(this.selectedFundDetails[i].Total === -999) ? Number(this.selectedFundDetails[i].Total) : Number(0)
          sumElectionPercentage +=
            this.selectedFundDetails[i].ElectionPercentage && !(this.selectedFundDetails[i].ElectionPercentage === -999)
              ? Number(this.selectedFundDetails[i].ElectionPercentage)
              : Number(0)
        }
        this.totalNewMgmt = parseFloat(Number(sumMgmt) / this.selectedFundDetails.length).toFixed(2)
        this.totalNewLoad = parseFloat(Number(sumTload) / this.selectedFundDetails.length).toFixed(2)
        this.totalNewSubta = parseFloat(Number(sumSubta) / this.selectedFundDetails.length).toFixed(2)
        this.totalNewFees = parseFloat(Number(sumTotalFees) / this.selectedFundDetails.length).toFixed(2)
        this.totalElectionPercentage = parseFloat(Number(sumElectionPercentage)).toFixed(2)
        this.$store.state.soloKOpenAccountDetail.TotalElectionPercentage = this.totalElectionPercentage
      }
    },
    formatPercent(val) {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    },
    deleteRow(item) {
      if (item && item.FundId) {
        const index = this.selectedFundDetails.indexOf(item)
        var newData = this.selectedFundDetails
        if (index > -1) {
          newData.splice(index, 1)
          this.updateAssetTotal()
        }
      }
    },
    prevSlide() {
      this.$emit('prevSlide')
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
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
