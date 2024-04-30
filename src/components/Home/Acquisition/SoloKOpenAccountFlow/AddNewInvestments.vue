<template>
  <v-flex>
    <v-flex class="text-center" pb-4 pt-2>
      <h1>Select Investment Funds(s)</h1>
    </v-flex>
    <v-row>
      <v-flex pt-2 pb-2 sm6 md4>
        <v-text-field
          v-model="search"
          variant="outlined"
          append-icon="icon-search"
          density="compact"
          placeholder="Search by symbol or fund name"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-flex>
    </v-row>
    <v-flex>
      <v-card width="100%">
        <v-data-table
          density="compact"
          :search="search"
          :headers="headers"
          v-model="checkedFunds"
          :items="fundsList"
          :height="$vuetify.breakpoint.xsOnly ? '380px' : $vuetify.breakpoint.smOnly ? '400px' : '255px'"
          item-key="Symbol"
          class="elevation-1 fundTable"
          mobile-breakpoint="0"
          :loading="loadingFund"
          loader-height="2"
          :fixed-header="!$vuetify.breakpoint.xsOnly"
          show-select
          style="backface-visibility: hidden"
          :hide-default-header="$vuetify.breakpoint.xsOnly"
          :options="pagination"
          :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
        >
          <template v-slot:item="{ item, select, isSelected }">
            <tr v-if="!$vuetify.breakpoint.xsOnly">
              <td width="2%">
                <v-checkbox-btn
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  :value="isSelected"
                  @input="select($event)"
                ></v-checkbox-btn>
              </td>
              <td>
                <span :class="!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white'"> {{ item.Symbol }}</span>
                <v-icon size="18" class="icon-modal-light" :class="!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white'">
                </v-icon>
              </td>
              <td style="width: 40%">
                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <span :class="!$vuetify.theme.dark ? '' : 'text-white'" v-bind="props">{{ item.Name }}</span>
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
                  <v-flex xs2 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey"></span>
                    </h5>
                    <h4 class="text-capitalize pt-2">
                      <v-checkbox-btn
                        :color="$vuetify.theme.dark ? '' : 'accent'"
                        :value="isSelected"
                        @input="select($event)"
                      ></v-checkbox-btn>
                    </h4>
                  </v-flex>
                  <v-flex xs10 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Symbol/ID</span>
                    </h5>
                    <h4 class="text-capitalize">
                      <span :class="!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white'"> {{ item.Symbol }}</span>
                      <v-icon size="18" class="icon-modal-light" :class="!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white'">
                      </v-icon>
                    </h4>
                  </v-flex>
                  <v-flex xs12 class="pb-1">
                    <h5 class="pt-1">
                      <span class="text-grey">Name</span>
                    </h5>
                    <h4 class="text-uppercase">{{ item.Name }}</h4>
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
          <template #footer v-if="checkedFunds.length > 0 && !$vuetify.breakpoint.xsOnly">
            <div class="v-data-table__wrapper" :class="$vuetify.theme.dark ? '' : ' grey lighten-3'">
              <table>
                <tfoot>
                  <tr>
                    <td class="text-left" style="width: 59%">
                      <strong>Total Selected Funds: {{ checkedFunds.length }}</strong>
                    </td>
                    <td class="text-left px-0" style="width: 10%">
                      <strong v-if="checkedFunds.length > 0">{{ totalNewMgmt }}%</strong>
                    </td>
                    <td class="text-left px-0" style="width: 10%">
                      <strong v-if="checkedFunds.length > 0">{{ totalNewLoad }}%</strong>
                    </td>
                    <td class="text-left px-0" style="width: 10%">
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
          <template v-slot:body.append v-if="$vuetify.breakpoint.xsOnly && checkedFunds.length > 0">
            <tr>
              <td class="pl-3 pr-3 pb-2">
                <v-flex xs12>
                  <v-row>
                    <v-flex xs6 class="pb-1">
                      <v-row>
                        <v-flex xs12>
                          <h5 class="pt-1">
                            <span class="text-grey">Total Funds</span>
                          </h5>
                          <h4 class="text-uppercase">
                            {{ checkedFunds.length }}
                          </h4>
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
        </v-data-table>
      </v-card>
      <v-flex class="py-2 text-left">
        <h3>If you plan to select more than 10 funds, please reach out to your sales contact.</h3>
      </v-flex>
      <v-flex xs12 sm12 md12 class="text-left">
        <h3>
          <a
            target="_blank"
            :href="openPdf($store.state.soloKOpenAccountDetail.FeeTypeDetail)"
            :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
            class="cursor-pointer"
            >View Cambridge Solo(K) Investment Options<v-icon
              class="pl-1"
              size="x-small"
              :color="$vuetify.theme.dark ? '' : 'accent'"
              >fas fa-external-link-alt</v-icon
            ></a
          >
        </h3>
      </v-flex>
    </v-flex>
    <v-flex pt-2>
      <v-flex class="text-center">
        <v-col class="pa-0">
          <v-btn
            class="text-capitalize"
            :color="$vuetify.theme.dark ? '' : 'accent'"
            @click="nextSlide()"
            :disabled="disableButton"
            >Next</v-btn
          >
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
      search: '',
      checkedFunds: [],
      headers: [
        {
          text: 'Symbol',
          align: 'start',
          value: 'Symbol'
        },
        {
          text: 'Name',
          value: 'Name',
          align: 'start'
        },
        {
          text: 'Mgmt.',
          value: 'mgmt',
          align: 'start',
          filterable: false
        },
        {
          text: '12b-1',
          value: 'tload',
          align: 'start',
          filterable: false
        },
        {
          text: 'SubTA',
          value: 'SubTA',
          align: 'start',
          filterable: false
        },
        {
          text: 'Total Fees',
          value: 'Total',
          align: 'start',
          filterable: false
        }
      ],
      pagination: {
        sortBy: [],
        itemsPerPage: 50
      },
      totalNewMgmt: 0,
      totalNewLoad: 0,
      totalNewSubta: 0,
      totalNewFees: 0,
      fundsList: [],
      loadingFund: false,
      disableButton: false
    }
  },
  watch: {
    checkedFunds: function () {
      if (this.checkedFunds.length > 0) {
        if (this.checkedFunds.length > 10) {
          this.disableButton = true
          this.$toast.destroy()
          this.$toast.warning('Select max funds up to 10', '', this.notificationSystem.options.warning)
        } else {
          this.disableButton = false
          this.updateAssetTotal()
        }
      }
    }
  },
  mounted() {
    this.getInvestments()
  },
  methods: {
    nextSlide() {
      if (
        this.$store.state.soloKOpenAccountDetail.selectedFunds &&
        this.$store.state.soloKOpenAccountDetail.selectedFunds.length > 0
      ) {
        let selectedFunds = this.$store.state.soloKOpenAccountDetail.selectedFunds.filter((a) =>
          this.checkedFunds.some((b) => b.FundId === a.FundId)
        )
        const fundIds = new Set(this.$store.state.soloKOpenAccountDetail.selectedFunds.map((a) => a.FundId))
        this.checkedFunds.forEach((e) => {
          if (!fundIds.has(e.FundId)) {
            selectedFunds.push(e)
          }
        })
        if (this.checkedFunds && this.checkedFunds.length > 10) {
          this.disableButton = true
          this.$toast.destroy()
          this.$toast.warning('Select max funds up to 10', '', this.notificationSystem.options.warning)
        } else {
          this.$store.state.soloKOpenAccountDetail.selectedFunds = selectedFunds && selectedFunds.length > 0 ? selectedFunds : []
          this.$emit('nextSlide')
        }
      } else {
        if (this.checkedFunds && this.checkedFunds.length > 10) {
          this.disableButton = true
          this.$toast.destroy()
          this.$toast.warning('Select max funds up to 10', '', this.notificationSystem.options.warning)
        } else {
          this.disableButton = false
          this.$store.state.soloKOpenAccountDetail.selectedFunds =
            this.checkedFunds && this.checkedFunds.length > 0 ? this.checkedFunds : []
          this.$emit('nextSlide')
        }
      }
    },
    updateAssetTotal() {
      this.totalNewFees = 0
      this.totalNewMgmt = 0
      this.totalNewLoad = 0
      this.totalNewSubta = 0
      this.totalElectionPercentage = 0
      if (this.checkedFunds.length > 0) {
        var sumMgmt = 0
        var sumTload = 0
        var sumSubta = 0
        var sumTotalFees = 0
        if (this.checkedFunds.length > 0) {
          for (var i = 0; i < this.checkedFunds.length; i++) {
            sumMgmt += !(this.checkedFunds[i].mgmt === -999) ? Number(this.checkedFunds[i].mgmt) : Number(0)
            sumTload += !(this.checkedFunds[i].tload === -999) ? Number(this.checkedFunds[i].tload) : Number(0)
            sumSubta += !(this.checkedFunds[i].SubTA === -999) ? Number(this.checkedFunds[i].SubTA) : Number(0)
            sumTotalFees += !(this.checkedFunds[i].Total === -999) ? Number(this.checkedFunds[i].Total) : Number(0)
          }
          this.totalNewMgmt = parseFloat(Number(sumMgmt) / this.checkedFunds.length).toFixed(2)
          this.totalNewLoad = parseFloat(Number(sumTload) / this.checkedFunds.length).toFixed(2)
          this.totalNewSubta = parseFloat(Number(sumSubta) / this.checkedFunds.length).toFixed(2)
          this.totalNewFees = parseFloat(Number(sumTotalFees) / this.checkedFunds.length).toFixed(2)
          this.$store.state.soloKOpenAccountDetail.TotalNewMgmt = this.totalNewMgmt
          this.$store.state.soloKOpenAccountDetail.TotalNewLoad = this.totalNewLoad
          this.$store.state.soloKOpenAccountDetail.TotalNewSubta = this.totalNewSubta
          this.$store.state.soloKOpenAccountDetail.TotalNewFees = this.totalNewFees
        }
      }
    },
    getInvestments() {
      if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
        this.loadingFund = true
        this.$axios
          .get(`/api/v1/user/clientproductinvestment/${this.$store.state.soloKOpenAccountDetail.ClientProduct}`)
          .then((success) => {
            this.fundsList = success.data ? success.data : []
            this.loadingFund = false
            this.fundsList.forEach((element) => {
              element.mgmt = element.mgmt * 100
              element.tload = element.tload * 100
              element.SubTA = element.SubTA * 100
              element.Total = element.Total * 100
            })
            this.$store.state.soloKOpenAccountDetail.fundNameList = this.fundsList
          })
          .finally(() => {
            this.loadingFund = false
            this.displaySelectedFund()
          })
      }
    },
    formatPercent(val) {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    },
    displaySelectedFund() {
      var selectedFunds = []
      this.checkedFunds = []
      if (this.fundsList && this.fundsList.length > 0) {
        Array.prototype.push.apply(selectedFunds, this.$store.state.soloKOpenAccountDetail.selectedFunds)
      }
      if (selectedFunds && selectedFunds.length > 0) {
        for (var i = 0; i < selectedFunds.length; ++i) {
          for (var j = 0; j < this.fundsList.length; ++j) {
            if (selectedFunds[i].Symbol === this.fundsList[j].Symbol) {
              selectedFunds[i].isSelected = true
              this.checkedFunds.push(this.fundsList[j])
            }
          }
        }
      }
    },
    openPdf(val) {
      if (val === 'Commission Based') {
        return 'https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/5fb505274fa748a5841c2de9eb775983?v=862d1012'
      } else {
        return 'https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/8d42b2f7abef4346a62d4ad32e71fdfd?v=071cb6b1'
      }
    },
    prevSlide() {
      this.$emit('prevSlide')
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
