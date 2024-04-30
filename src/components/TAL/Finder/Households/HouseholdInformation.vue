<template>
  <v-col class="information_review">
    <v-container
      :class="[
        $vuetify?.breakpoint?.smAndDown ? 'pr-2 pl-2' : 'container--fluid',
        individualInformationLoading ? 'pt-0 pr-0 pl-0' : 'pb-2 pt-0'
      ]"
    >
      <v-progress-linear v-if="individualInformationLoading" indeterminate color="accent" height="4" />
      <v-col pa-2 xl12 lg12 md12 sm12 xs12 pl-3 pr-2>
        <v-row>
          <v-col
            :class="
              $vuetify?.breakpoint?.xl
                ? 'pa-3 mb-5 mt-4 xl4 lg4 md4 sm6 xs12'
                : $vuetify?.breakpoint?.mdAndUp
                  ? 'pa-2 mb-5 mt-4 xl4 lg4 md4 sm6 xs12'
                  : 'pr-1 pl-1 mb-2 mt-2'
            "
            class="text-left elevation-3"
          >
            <v-col xs12 lg12 xl12>
              <v-card v-if="!individualInformationLoading" class="elevation-1">
                <v-col
                  v-for="(item, index) in selectedIndividualData[0].individualAccounts"
                  :key="index"
                  :class="$vuetify?.theme.dark ? 'cardbackground dark' : 'flex_backgroudcolor'"
                  xs12
                  mb-1
                  @click="displayOverviewTabData(index)"
                >
                  <v-col :class="item.displayOverview ? 'flex_backgroudcolor_selected' : ''">
                    <v-col xs12 pa-1>
                      <v-row>
                        <v-col xs6 lg6 xl7 md6>
                          <h4>
                            <b>{{ item.accountName }}-{{ item.accountType }}</b>
                          </h4>
                        </v-col>
                        <v-col xs2 lg3 xl2 md2>
                          <h4>
                            {{
                              item.totalValue / selectedIndividualData[0].totalValue
                                ? parseFloat((item.totalValue / selectedIndividualData[0].totalValue) * 100).toFixed(2)
                                : 0.0
                            }}%
                          </h4>
                        </v-col>
                        <v-col xs4 lg3 xl3 md4 class="text-right">
                          <h4>
                            <b>{{ formatPrice(item.totalValue, 2) }}</b>
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs12 pl-2 pb-1 pr-2>
                      <h5>Acct.# : {{ item.account }}</h5>
                    </v-col>
                  </v-col>
                </v-col>
                <v-col :class="'flex_backgroudcolor_selected'">
                  <v-col xs12 pa-2>
                    <v-row>
                      <v-col xs6 lg7>
                        <h4>
                          <b>{{
                            selectedIndividualData && selectedIndividualData.length > 0
                              ? selectedIndividualData[0].householdName
                              : ''
                          }}</b>
                        </h4>
                      </v-col>
                      <v-col xs2 lg2>
                        <h4 />
                      </v-col>
                      <v-col xs4 lg3 class="text-right">
                        <h4>
                          <b>{{
                            selectedIndividualData && selectedIndividualData.length > 0
                              ? formatPrice(selectedIndividualData[0].totalValue, 2)
                              : formatPrice(0.0, 2)
                          }}</b>
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-show="false" xs12 pl-2 pb-1 pr-2>
                    <h5>
                      Acct.# :
                      {{
                        selectedIndividualData && selectedIndividualData.length > 0
                          ? selectedIndividualData[0].individualAccounts &&
                            selectedIndividualData[0].individualAccounts.length > 0
                            ? selectedIndividualData[0].individualAccounts[0].account
                            : ''
                          : ''
                      }}
                    </h5>
                  </v-col>
                </v-col>
              </v-card>
            </v-col>
          </v-col>
          <v-col
            xl8
            lg8
            md8
            sm12
            xs12
            :class="$vuetify?.breakpoint?.smOnly ? 'mt-2' : $vuetify?.breakpoint?.mdAndDown ? 'mt-2' : 'pl-4'"
          >
            <v-row class="text-left">
              <v-col v-if="!$vuetify?.breakpoint?.mdAndDown" xs12 pb-4 />
              <v-row v-if="!individualInformationLoading" />

              <v-col v-if="!individualInformationLoading">
                <v-row>
                  <v-col
                    xs12
                    class="text-left"
                    :class="[
                      $vuetify?.breakpoint?.smAndDown ? 'sm12 pb-2 pt-2 pl-2' : '',
                      $vuetify?.breakpoint?.mdAndUp ? 'pl-3' : ''
                    ]"
                  >
                    <h2 class="font-weight-medium text-capitalize">
                      {{
                        selectedIndividualData && selectedIndividualData.length > 0
                          ? selectedIndividualData[0].householdName.toLowerCase()
                          : ''
                      }}
                    </h2>
                  </v-col>
                  <v-col xl2 xs5 lg3 md3 sm5 pb-3 pl-3>
                    <v-col>Account Status</v-col>
                    <v-col class="pt-1">
                      <b>{{
                        selectedIndividualData && selectedIndividualData.length > 0
                          ? selectedIndividualData[0].individualAccounts &&
                            selectedIndividualData[0].individualAccounts.length > 0
                            ? selectedIndividualData[0].individualAccounts[0].planStatus
                            : ''
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col xl2 xs6 lg2 md3 sm6 pb-3 pl-3>
                    <v-col># of Accounts</v-col>
                    <v-col class="pt-1">
                      <b>{{
                        selectedIndividualData && selectedIndividualData.length > 0 ? selectedIndividualData[0].accounts : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.smAndDown" inset vertical dark class="hr_border" />
                  <v-col xl2 xs5 lg3 md3 sm5 pb-3 pl-3>
                    <v-col>Total Individuals</v-col>
                    <v-col class="pt-1">
                      <b>{{ selectedIndividualData ? selectedIndividualData.length : '' }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.mdOnly" inset vertical dark class="hr_border" />
                  <v-col xl3 xs6 lg3 md3 sm6 pb-3 pl-3 pr-3>
                    <v-col>Mailing Address</v-col>
                    <v-col class="pt-1">
                      <b :style="$vuetify?.breakpoint?.mdAndDown ? 'word-wrap: break-word;' : ''">{{
                        selectedIndividualData && selectedIndividualData.length > 0
                          ? selectedIndividualData[0].individualAccounts &&
                            selectedIndividualData[0].individualAccounts.length > 0
                            ? selectedIndividualData[0].individualAccounts[0].accountAddress
                            : ''
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider
                    v-if="$vuetify?.breakpoint?.mdOnly || $vuetify?.breakpoint?.xlOnly"
                    inset
                    vertical
                    dark
                    class="hr_border"
                  />
                  <v-col xl2 xs6 md5 lg4 sm6 pb-3 pl-3>
                    <v-col>As Of Date</v-col>
                    <v-col :class="$vuetify?.breakpoint?.xs ? 'pr-2 pt-1' : 'pt-1'">
                      <b>{{
                        selectedIndividualData && selectedIndividualData.length > 0
                          ? selectedIndividualData[0].individualAccounts &&
                            selectedIndividualData[0].individualAccounts.length > 0
                            ? selectedIndividualData[0].individualAccounts[0].asOfDate
                              ? selectedIndividualData[0].individualAccounts[0].asOfDate
                              : ' - '
                            : ' - '
                          : ' - '
                      }}</b>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </v-col>
</template>
<script>
export default {
  props: ['value', 'selectedIndividualData'],
  data() {
    return {
      seinpno: '123123132',
      name: 'Glen and Darlene Greenly Household',
      accountStatus: 'Active',
      noofAccounts: '2',
      noofIndividual: '3',
      recentContribution: '$5051.00',
      sname: '454 New Holland Avenue',
      sstreet: 'Lancaster PA 17602',
      sphone: '717 581 6500',
      asofDate: '01/05/2020',
      listaccount: 1,
      yeartodate: 0.08,
      fistMonth: 0.08,
      thirdMonth: 0.08,
      sixMonth: 0.08,
      tweleveMonth: 0.2,
      sincestart: 0.21,
      listAccount: [
        { text: 'Glen and Greenl-IRA Rollover', Id: 1 },
        { text: 'Glen Greenly-IRA Rollover', Id: 2 },
        { text: 'Glen Greenly-Joint', Id: 3 },
        { text: 'Darlene Greenly 401K', Id: 4 },
        { text: 'Household', Id: 5 }
      ],
      houseHoldList: [
        {
          text: 'Glen Greenly -Joint',
          percent: '32.49%',
          amount: 58545.45,
          account: 'Acct.#:2323265545465',
          displayOverview: false,
          color: '#e9e9e9'
        },
        {
          text: 'Darlene Greenly -IRA Rollover',
          percent: '19.49%',
          amount: 58545.45,
          account: 'Acct.#:2323265545465',
          displayOverview: false,
          color: '#e9e9e9'
        },
        {
          text: 'Green Greenly -IRA Rollover',
          percent: '25.49%',
          amount: 158545.45,
          account: 'Acct.#:2323265545465',
          displayOverview: false,
          color: '#e9e9e9'
        },
        {
          text: 'Darlene Greenly 401K',
          percent: '19.49%',
          amount: 58545.45,
          account: 'Acct.#:2323265545465',
          displayOverview: false,
          color: '#e9e9e9'
        },
        {
          text: 'HouseHold',
          percent: '',
          amount: 36545.45,
          account: 'Acct.#:2323265545465',
          displayOverview: true,
          color: '#e9e9e9'
        }
      ],
      displayOverview: false,
      displayId: '',
      individualInformationLoading: true,
      Marketpricetotal: 0
    }
  },
  watch: {
    selectedIndividualData: {
      handler() {
        this.individualInformationLoading = false
      },
      deep: true
    }
  },
  methods: {
    goBack() {
      this.$router.push(this.prevRoute.fullPath)
    },
    displayOverviewTabData(val) {
      var overviewObject = {
        displayOverview: false,
        Id: 0
      }
      overviewObject.Id = val
      overviewObject.displayOverview = true
      this.displayId = val
      this.houseHoldList.forEach((element, index) => {
        if (val === index) {
          this.houseHoldList[index].displayOverview = true
        } else {
          this.houseHoldList[index].displayOverview = false
        }
      })

      this.$emit('overviewTabDisplay', overviewObject)
    },
    getMarketTotal(val) {
      this.Marketpricetotal += val
      return this.Marketpricetotal
    }
  }
}
</script>
<style scoped>
.hr_border {
  border: solid 1px lightgray !important;
  height: 40px;
}
.border_solid {
  border: solid 1px grey;
}
.information_review .v-subheader {
  height: 28px !important;
}
.flex_backgroudcolor {
  background-color: #e9e9e9;
}
.flex_backgroudcolor_selected {
  background-color: #0969b0 !important;
  color: white !important;
}
.flex_backgroudcolor_dark {
  background-color: #7999ab !important;
}
.cardbackground.light {
  background: #f6f6f6 !important;
}
.cardbackground.dark {
  background: rgba(246, 246, 246, 0.1) !important;
}
</style>
