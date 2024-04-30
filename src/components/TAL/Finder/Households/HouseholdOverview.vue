<template>
  <v-col>
    <v-row>
      <v-col xs12 :class="$vuetify?.breakpoint?.lgAndUp ? 'pr-2' : 'pa-1'">
        <v-card
          class="elevation-6"
          :class="[
            $vuetify?.breakpoint?.lgAndUp ? 'chart_height_lg' : '',
            fontSize >= 14 && !$vuetify?.breakpoint?.xs && !$vuetify?.breakpoint?.xl ? 'chart_height_largeFont' : ''
          ]"
        >
          <v-progress-linear v-if="individualInformationLoading" indeterminate color="accent" height="4" />
          <v-col pa-2 :class="$vuetify?.breakpoint?.mdAndDown ? '' : 'pt-2 pb-4 pr-4'">
            <v-row>
              <v-col v-if="!$vuetify?.breakpoint?.smAndDown" xl6 pl-4 pt-2>
                <h2 class="font-weight-medium">Account Owners</h2>
              </v-col>
              <v-col v-else pb-2 pl-1>
                <h3 class="font-weight-medium">Account Owners</h3>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="!$vuetify?.breakpoint?.smAndDown && !individualInformationLoading" pa-2>
            <v-row>
              <v-col lg3 pl-4 :class="$vuetify?.breakpoint?.md ? 'xs2' : 'xs3'">
                <v-col>
                  <h3 class="font-weight-medium">Name(s)</h3>
                </v-col>
                <v-col pb-3 />
                <v-col>
                  <h3 class="font-weight-medium">Date of Birth</h3>
                </v-col>
                <v-col pb-3 />
                <v-col>
                  <h3 class="font-weight-medium">Email</h3>
                </v-col>
                <v-col pb-3 />
                <v-col>
                  <h3 class="font-weight-medium">Accounts</h3>
                </v-col>
              </v-col>
              <v-col v-if="displayOverview && Id === 4" xs9 lg9>
                <v-row>
                  <v-col
                    v-for="(item, index) in accountOwnersList"
                    :key="index"
                    :class="
                      $vuetify?.breakpoint?.md && index === 0 ? 'xs4' : $vuetify?.breakpoint?.md && index === 3 ? 'xs2' : 'xs3'
                    "
                  >
                    <v-col xs12>
                      <h4>
                        <b>{{ item.text }}</b>
                      </h4>
                    </v-col>
                    <v-col pb-3 />
                    <v-col xs12 mt-2>
                      <h4>{{ item.dateOfBirth }}</h4>
                    </v-col>
                    <v-col pb-3 />
                    <v-col xs12>
                      <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                        {{ item.eMail }}
                      </h4>
                    </v-col>
                    <v-col pb-3 />
                    <v-col v-for="(item, index) in item.accounts" :key="index" xs12>
                      <v-row>
                        <v-col xs12>
                          <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                            {{ item.name ? item.name : '' }}
                            <v-menu open-on-hover ripple>
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon
                                  size="small"
                                  :color="!$vuetify?.theme.dark ? 'accent' : ''"
                                  variant="text"
                                >
                                  <v-icon>{{ item.icon }}</v-icon>
                                </v-btn>
                              </template>
                              <v-list class="pa-1" density="compact" style="background-color: #e99200 !important">
                                <v-list-item-title>
                                  <span
                                    class="pl-1 pr-1"
                                    :style="$vuetify?.theme.dark ? 'color:white' : 'background-color:#E99200 !important'"
                                    >{{ item.hoverTextHeader }}</span
                                  >
                                </v-list-item-title>
                                <v-list-item-title>
                                  <span
                                    class="pl-1 pr-1"
                                    :style="$vuetify?.theme.dark ? 'color:white' : 'background-color:#E99200 !important'"
                                    >{{ item.hoverText }}</span
                                  >
                                </v-list-item-title>
                              </v-list>
                            </v-menu>
                          </h4>
                        </v-col>
                        <v-col xs12>
                          <h4>
                            <b>Balance:</b>
                            {{ formatPrice(item.balance, 2) }}
                          </h4>
                        </v-col>
                        <v-col pb-1 />
                        <v-col xs12>
                          <h4>
                            <b>Account ID:</b>
                            {{ item.account }}
                          </h4>
                        </v-col>
                        <v-col pb-5 />
                      </v-row>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="displayOverview && Id < 4" xs9 lg9 pl-5>
                <v-row>
                  <v-col xs12>
                    <v-col>
                      <v-col xs12>
                        <h4>
                          <b>{{
                            selectedIndividualData && selectedIndividualData.length > 0
                              ? selectedIndividualData[0].householdName
                              : ' - '
                          }}</b>
                        </h4>
                      </v-col>
                      <v-col pb-3 />
                      <v-col xs12>
                        <h4>{{ dateOfBirth ? dateOfBirth : ' - ' }}</h4>
                      </v-col>
                      <v-col pb-3 pt-2 />
                      <v-col xs12>
                        <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                          {{ accountContact ? accountContact : ' - ' }}
                        </h4>
                      </v-col>
                      <v-col pb-3 pt-1 />
                      <v-col
                        v-if="
                          selectedIndividualData &&
                          selectedIndividualData.length > 0 &&
                          selectedIndividualData[0].individualAccounts
                        "
                      >
                        <v-col v-for="(item, index) in selectedIndividualData[0].individualAccounts" :key="index" xs12>
                          <v-row>
                            <v-col xs12>
                              <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                                {{ item.accountName }}-{{ item.accountType }}
                              </h4>
                            </v-col>
                            <v-col xs12>
                              <h4>
                                <b>Balance:</b>
                                {{ formatPrice(item.totalValue, 2) }}
                              </h4>
                            </v-col>
                            <v-col pb-2 />
                            <v-col xs12>
                              <h4>
                                <b>Account ID:</b>
                                {{ item.account }}
                              </h4>
                            </v-col>
                            <v-col pb-5 />
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-if="Id === 2">
                      <v-col xs12>
                        <h4>
                          <b>{{ item.text }}</b>
                        </h4>
                      </v-col>
                      <v-col pb-3 />
                      <v-col xs12 mt-2>
                        <h4>{{ item.dateOfBirth }}</h4>
                      </v-col>
                      <v-col pb-3 />
                      <v-col xs12>
                        <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                          {{ item.eMail }}
                        </h4>
                      </v-col>
                      <v-col pb-3 />
                      <v-col v-for="(item, index) in item.accounts" :key="index" xs12 mt-1>
                        <v-row>
                          <v-col xs12>
                            <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                              {{ item.name ? item.name : '' }}
                              <v-menu open-on-hover ripple>
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    icon
                                    size="small"
                                    :color="!$vuetify?.theme.dark ? 'accent' : ''"
                                    variant="text"
                                  >
                                    <v-icon>{{ item.icon }}</v-icon>
                                  </v-btn>
                                </template>
                                <v-list density="compact" style="background-color: #e99200 !important">
                                  <v-list-item-title>
                                    <span
                                      class="pl-1 pr-1"
                                      :style="$vuetify?.theme.dark ? 'color:white' : 'background-color:#E99200 !important'"
                                      >{{ item.hoverTextHeader }}</span
                                    >
                                  </v-list-item-title>
                                  <v-list-item-title>
                                    <span
                                      class="pl-1 pr-1"
                                      :style="$vuetify?.theme.dark ? 'color:white' : 'background-color:#E99200 !important'"
                                      >{{ item.hoverText }}</span
                                    >
                                  </v-list-item-title>
                                </v-list>
                              </v-menu>
                            </h4>
                          </v-col>
                          <v-col pb-2 />
                          <v-col xs12>
                            <h4>
                              <b>Balance:</b>
                              {{ formatPrice(item.totalValue, 2) }}
                            </h4>
                          </v-col>
                          <v-col pb-2 />
                          <v-col xs12>
                            <h4>
                              <b>Account ID:</b>
                              {{ item.account }}
                            </h4>
                          </v-col>
                          <v-col pb-5 />
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="$vuetify?.breakpoint?.smAndDown && !individualInformationLoading" pa-2 xs12>
            <v-col v-if="displayOverview && Id === 4">
              <v-row v-for="(item, index) in accountOwnersList" :key="index">
                <v-col xs12 pr-2 pb-2 pl-1>
                  <v-row>
                    <v-col xs12>
                      <v-row>
                        <v-col xs6>
                          <h5 class="font-weight-medium">
                            <span>Name(s)</span>
                          </h5>
                          <h4>{{ item.text }}</h4>
                        </v-col>
                        <v-col xs6>
                          <h5 class="font-weight-medium">
                            <span>Date of Birth</span>
                          </h5>
                          <h4>{{ item.dateOfBirth }}</h4>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs12>
                      <v-row>
                        <v-col xs6>
                          <h5 class="font-weight-medium">
                            <span>Email</span>
                          </h5>
                          <h4 class="mr-1" style="word-break: break-all">
                            {{ item.eMail }}
                          </h4>
                        </v-col>
                        <v-col xs6>
                          <h5 class="font-weight-medium">
                            <span>Accounts</span>
                          </h5>
                          <h4>
                            <v-col v-for="(item, index) in item.accounts" :key="index" xs12>
                              <v-row>
                                <v-col xs12>
                                  <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                                    {{ item.name ? item.name : '' }}
                                    <v-menu open-on-hover ripple>
                                      <template #activator="{ props }">
                                        <v-btn
                                          v-bind="props"
                                          icon
                                          size="small"
                                          :color="!$vuetify?.theme.dark ? 'accent' : ''"
                                          variant="text"
                                        >
                                          <v-icon />
                                        </v-btn>
                                      </template>
                                      <v-list density="compact" style="background-color: #e99200 !important">
                                        <v-list-item-title>
                                          <span
                                            class="pl-1 pr-1"
                                            :style="$vuetify?.theme.dark ? 'color:white' : 'background-color:#E99200 !important'"
                                            >{{ item.hoverTextHeader }}</span
                                          >
                                        </v-list-item-title>
                                        <v-list-item-title>
                                          <span
                                            class="pl-1 pr-1"
                                            :style="$vuetify?.theme.dark ? 'color:white' : 'background-color:#E99200 !important'"
                                            >{{ item.hoverText }}</span
                                          >
                                        </v-list-item-title>
                                      </v-list>
                                    </v-menu>
                                  </h4>
                                </v-col>
                                <v-col xs12>
                                  <h4>
                                    <b>Balance:</b>
                                    {{ formatPrice(item.totalValue, 2) }}
                                  </h4>
                                </v-col>
                                <v-col pb-2 />
                                <v-col xs12>
                                  <h4>
                                    <b>Account ID:</b>
                                    {{ item.account }}
                                  </h4>
                                </v-col>
                                <v-col pb-2 />
                              </v-row>
                            </v-col>
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-col pb-2 />
                  <v-divider v-if="index !== accountOwnersList.length - 1" />
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="displayOverview && Id < 4">
              <v-col xs12 pr-2 pb-2 pl-1>
                <v-row>
                  <v-col xs12>
                    <v-row>
                      <v-col xs6>
                        <h3 :class="$vuetify?.breakpoint?.smOnly ? 'ml-1' : ''" class="font-weight-medium">
                          <span>Name(s)</span>
                        </h3>
                        <h4 :class="$vuetify?.breakpoint?.smOnly ? 'ml-1' : ''" class="font-weight-bold">
                          {{
                            selectedIndividualData && selectedIndividualData.length > 0
                              ? selectedIndividualData[0].householdName
                              : ''
                          }}
                        </h4>
                      </v-col>
                      <v-col xs6>
                        <h3 class="font-weight-medium">
                          <span>Date of Birth</span>
                        </h3>
                        <h4>{{ dateOfBirth ? dateOfBirth : ' - ' }}</h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col xs12>
                    <v-row>
                      <v-col xs6>
                        <h3 :class="$vuetify?.breakpoint?.smOnly ? 'ml-1' : ''" class="font-weight-medium">
                          <span>Email</span>
                        </h3>
                        <h4
                          :class="[
                            $vuetify?.breakpoint?.mdAndUp ? 'mb-4' : 'mr-1 pl-1',
                            $vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'
                          ]"
                          style="word-break: break-all"
                        >
                          {{ accountContact ? accountContact : ' - ' }}
                        </h4>
                      </v-col>
                      <v-col xs6>
                        <h3 class="font-weight-medium">
                          <span>Accounts</span>
                        </h3>
                        <h4>
                          <v-col
                            v-if="
                              selectedIndividualData &&
                              selectedIndividualData.length > 0 &&
                              selectedIndividualData[0].individualAccounts
                            "
                          >
                            <v-col v-for="(item, index) in selectedIndividualData[0].individualAccounts" :key="index" xs12>
                              <v-row>
                                <v-col xs12>
                                  <h4 :class="$vuetify?.theme.dark ? '' : 'text-accent font-weight-medium'">
                                    {{ item.accountName }}
                                  </h4>
                                </v-col>
                                <v-col xs12>
                                  <h4>
                                    <b>Balance:</b>
                                    {{ formatPrice(item.totalValue, 2) }}
                                  </h4>
                                </v-col>
                                <v-col pb-2 />
                                <v-col xs12>
                                  <h4>
                                    <b>Account ID:</b>
                                    {{ item.account }}
                                  </h4>
                                </v-col>
                                <v-col pb-2 />
                              </v-row>
                            </v-col>
                          </v-col>
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-col>
        </v-card>
      </v-col>
      <v-col v-if="false" xl6 lg6 :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-2' : 'pa-1'">
        <v-card
          class="elevation-6"
          :class="[
            $vuetify?.breakpoint?.lgAndUp ? 'chart_height_lg' : '',
            fontSize >= 14 && !$vuetify?.breakpoint?.xs && !$vuetify?.breakpoint?.xl ? 'chart_height_largeFont' : ''
          ]"
        >
          <v-col
            :class="[$vuetify?.breakpoint?.smAndDown ? 'pt-2 pl-2' : 'pt-2 pr-4', $vuetify?.breakpoint?.mdOnly ? 'pl-3' : '']"
          >
            <v-row>
              <v-col>
                <v-row>
                  <v-col v-if="!$vuetify?.breakpoint?.smAndDown" xl6 pl-3 pt-2>
                    <h2 class="font-weight-medium">Account Summary</h2>
                  </v-col>
                  <v-col v-else pb-2 pl-1>
                    <h3 class="font-weight-medium">Account Summary</h3>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-show="holdingsList.length > 1"
                xs6
                :class="$vuetify?.breakpoint?.mdAndDown ? 'xs6 md4 sm4' : 'xs4 xl3'"
                class="text-right"
              >
                <v-select
                  v-model="holdingsListSelected"
                  variant="outlined"
                  append-icon="icon-chevron-down"
                  :items="holdingsList"
                  density="compact"
                  hide-details
                  :menu-props="{ zIndex: '1' }"
                  @update:model-value="changeParticipants()"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col :class="$vuetify?.breakpoint?.mdAndDown ? 'pt-2' : ''">
            <v-col v-show="!showAccountSummaryError">
              <v-row>
                <v-col xl6 lg6 md6 sm6 xs12 class="text-center">
                  <AccountSummaryDonut
                    v-show="accountSummaryList.length > 0"
                    :key="componentKey"
                    :account-summary="accountSummaryList"
                    :live-width="mywidth"
                    :total-amount="totalAmount"
                  />
                </v-col>

                <v-col
                  pb-2
                  xl6
                  lg6
                  md6
                  sm6
                  sx12
                  :class="[
                    $vuetify?.breakpoint?.smAndUp ? 'mt-5 pt-5 pr-5' : 'pl-5 pr-5',
                    $vuetify?.breakpoint?.xs ? 'ml-2 pl-3' : ''
                  ]"
                >
                  <v-col xs12>
                    <h3 class="font-weight-medium">
                      <b>Market Value Over Time</b>
                    </h3>
                  </v-col>
                  <v-row>
                    <v-col v-for="(item, index) in summaryList" :key="index" xs12>
                      <v-row>
                        <v-col xs7 class="align-self">
                          <h4 v-if="$vuetify?.breakpoint?.smAndDown">
                            {{ item.text }}
                          </h4>
                          <h3 v-else>
                            {{ item.text }}
                          </h3>
                        </v-col>
                        <v-col xs5 class="text-right align-self">
                          <h4
                            v-if="$vuetify?.breakpoint?.smAndDown"
                            :class="index === 5 && !$vuetify?.theme.dark ? 'text-accent' : ''"
                          >
                            <b>{{ formatPrice(item.Amount, 2) }}</b>
                          </h4>
                          <h3 v-else :class="index === 5 && !$vuetify?.theme.dark ? 'text-accent' : ''">
                            <b>{{ formatPrice(item.Amount, 2) }}</b>
                          </h3>
                        </v-col>
                        <v-col pb-4 mb-2 />
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="showAccountSummaryError" xs12>
              <v-col xs12 class="shortcutflex">
                <v-col class="cashFlowimageflex" :class="$vuetify?.breakpoint?.lgAndUp ? 'mt-5 pl-4 pr-4 pt-5' : 'pl-4 pr-4'">
                  <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                </v-col>
                <h3
                  class="font-weight-medium text-center"
                  :class="$vuetify?.breakpoint?.mdAndUp ? 'mt-2 pt-3 pb-2' : 'mt-2 pl-2 pb-4'"
                >
                  No Data Available
                </h3>
              </v-col>
            </v-col>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import AccountSummaryDonut from '@/components/TAL/Finder/Households/AccountSummaryDonut'
export default {
  components: {
    AccountSummaryDonut
  },
  props: ['displayOverview', 'Id', 'selectedIndividualData'],
  data() {
    return {
      componentKey: 0,
      mywidth: 0,
      showloader: true,
      accountSummaryList: [],
      summaryList: [],
      accountOwnersList: [],
      holdingsList: [],
      holdingsListSelected: '',
      individualInformationLoading: false,
      currentListSelected: 0,
      currentList: [
        { text: 'Last 6 Months', value: 0 },
        { text: 'Last 3 Months', value: 1 },
        { text: 'Last Month', value: 2 }
      ],
      SelectedDuration: 2,
      totalAmount: [],
      showAccountSummaryError: false,
      comingSoonImage: require('@/assets/images/win.svg'),
      dateOfBirth: '',
      accountContact: ''
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    }
  },
  watch: {
    selectedIndividualData: {
      handler() {
        this.getSelectedIndividualAccount()
        this.individualInformationLoading = false
        this.getAccountSummaryData()
      },
      deep: true
    }
  },
  methods: {
    getAccountSummaryData() {
      this.summaryList = []
      this.totalAmount = []
      this.householdId = this.$route.query.householdId
      var selectedHoldings = this.holdingsListSelected.text ? this.holdingsListSelected.text : this.holdingsListSelected
      this.$axios
        .get(`/api/v1/tal/individual/accountsummary/${selectedHoldings}/0`)
        .then((success) => {
          if (success.data.d.length > 0) {
            for (const key in success.data.d) {
              // eslint-disable-next-line no-unused-vars
              const element = success.data.d[key]
              this.summaryList.push(
                {
                  text: 'Beginning Balance',
                  Amount: success.data.d[0]['Beginning Balance'] ? success.data.d[0]['Beginning Balance'] : 0
                },
                {
                  text: 'Rollover',
                  Amount: success.data.d[0]['Rollover'] ? success.data.d[0]['Rollover'] : 0
                },
                {
                  text: 'Contributions',
                  Amount: success.data.d[0]['Contributions'] ? success.data.d[0]['Contributions'] : 0
                },
                {
                  text: 'Distribution',
                  Amount: success.data.d[0]['Distribution'] ? success.data.d[0]['Distribution'] : 0
                },
                {
                  text: 'Current Balance',
                  Amount: success.data.d[0]['Current Balance'] ? success.data.d[0]['Current Balance'] : 0
                }
              )
            }
            this.accountSummaryList = this.summaryList.map((res) => ({
              text: res.text,
              Amount: res.Amount
            }))

            var temp = 0

            for (var i = 0; i < this.accountSummaryList.length; i++) {
              temp += parseFloat(this.accountSummaryList[i].Amount)
            }

            this.totalAmount = temp

            if (!this.totalAmount > 0) {
              this.showAccountSummaryError = true
            } else {
              this.showAccountSummaryError = false
            }
          } else {
            this.summaryList = []
            this.showAccountSummaryError = true
          }
        })
        .catch(() => {
          this.showAccountSummaryError = true
        })
    },
    changeParticipants() {
      this.getAccountSummaryData()
      this.getSelectedIndividualAccount()
    },
    getSelectedIndividualAccount() {
      if (this.selectedIndividualData.length > 0) {
        var individualAccounts = this.selectedIndividualData[0].individualAccounts.map(function (el) {
          return {
            text: el.account,
            value: el.account
          }
        })
        if (individualAccounts.length > 0) {
          individualAccounts = individualAccounts.filter((e) => e)
          var distinctValue = []
          individualAccounts.filter(function (item) {
            var i = distinctValue.findIndex((x) => x.text === item.text)
            if (i <= -1) {
              distinctValue.push({ text: item.text, value: item.value })
            }
            return null
          })
          this.holdingsList = distinctValue ? distinctValue : []
          this.holdingsListSelected = this.holdingsListSelected
            ? this.holdingsListSelected
            : this.holdingsList.length > 0
              ? this.holdingsList[0]
              : ''
          if (this.selectedIndividualData[0].individualAccounts && this.selectedIndividualData[0].individualAccounts.length > 0) {
            this.dateOfBirth = this.selectedIndividualData[0].individualAccounts[0].dateOfBirth
              ? this.selectedIndividualData[0].individualAccounts[0].dateOfBirth
              : ''
            this.accountContact = this.selectedIndividualData[0].individualAccounts[0].accountContact
              ? this.selectedIndividualData[0].individualAccounts[0].accountContact
              : ''
          }
        }
      }
      this.componentKey += 1
    }
  }
}
</script>
<style scoped>
.chart_height_lg {
  height: 450px !important;
}
.chart_height_largeFont {
  height: 32em !important;
}
</style>
