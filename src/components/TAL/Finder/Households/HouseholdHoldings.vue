<template>
  <v-card class="elevation-6" :class="$vuetify?.breakpoint?.mdAndDown ? 'pa-2' : 'pa-2'">
    <v-col xs12>
      <v-row>
        <!-- class="$vuetify?.breakpoint?.mdAndDown?'md12':'xs6 xl6 md6 pt-3'" -->
        <v-col xs12>
          <v-row>
            <v-col
              xs12
              lg9
              md6
              sm6
              :class="[$vuetify?.breakpoint?.mdAndDown ? 'pt-2 pl-2' : 'pl-4', $vuetify?.breakpoint?.mdOnly ? 'pl-3' : '']"
            >
              <h2 v-if="$vuetify?.breakpoint?.mdAndUp" class="font-weight-medium">Account Holdings</h2>
              <h3 v-if="$vuetify?.breakpoint?.smAndDown" class="font-weight-medium">Account Holdings</h3>
            </v-col>
            <v-col xs12 lg2 md4 sm4>
              <v-select
                v-model="accountType"
                variant="outlined"
                append-icon="icon-chevron-down"
                :items="accountTypeList"
                density="compact"
                hide-details
                :menu-props="{ zIndex: '1' }"
                @update:model-value="changeParticipants()"
              />
            </v-col>
            <!--  -->
            <v-col xs12 lg1 md2 sm2 pl-2 class="flex-grow-1 align-self" :class="$vuetify?.breakpoint?.mdAndDown ? 'pt-2' : ''">
              <v-col
                v-if="$authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full)"
                :class="$vuetify?.breakpoint?.smAndDown ? 'text-right' : 'text-center'"
              >
                <a
                  class="text-uppercase text-decoration-none pa-1 font_14"
                  :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                  @click="exportData()"
                  >Export</a
                >
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col>
      <v-row>
        <v-col
          xs12
          :class="$vuetify?.breakpoint?.smOnly ? 'text-center pa-2' : $vuetify?.breakpoint?.md ? 'text-center pa-2' : ''"
        >
          <v-row no-gutters>
            <v-col cols="3" xl="4" lg="5" md="4" sm="4" class="align-self text-right">
              <h4>View By:</h4>
            </v-col>
            <v-col cols="5" xl="1" lg="2" md="2" sm="3" class="align-self" :class="$vuetify?.breakpoint?.xlOnly ? 'mr-3' : ''">
              <v-btn
                class="elevation-0"
                :rounded="true"
                :class="assetCategoryPanel ? 'accent secondary--text' : 'grey lighten-2 '"
                :size="$vuetify?.breakpoint?.xs && 'small'"
                @click="openAssetCategory()"
              >
                Asset Category
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              xl="1"
              lg="2"
              md="2"
              sm="3"
              class="align-self"
              :class="[$vuetify?.breakpoint?.xs ? 'text-center' : '', $vuetify?.breakpoint?.xlOnly ? 'ml-2' : '']"
            >
              <v-btn
                class="elevation-0"
                :rounded="true"
                :class="assetClassPanel ? 'accent secondary--text' : 'grey lighten-2'"
                :size="$vuetify?.breakpoint?.xs && 'small'"
                @click="openAssetClass()"
              >
                Asset Class
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col xs12>
          <v-row>
            <v-col xs12 pb-2 />
            <v-col
              v-show="assetCategoryPanel"
              xl3
              lg3
              md12
              sm12
              xs12
              text-center
              :class="[$vuetify?.breakpoint?.lg ? 'mr-4' : '']"
            >
              <AssetCategory v-show="groups.length > 0" :key="componentKey" :assets-category="groups" :live-width="mywidth" />
            </v-col>
            <v-col v-show="assetClassPanel" xl3 lg3 md12 sm12 xs12 text-center :class="[$vuetify?.breakpoint?.lg ? 'mr-4' : '']">
              <AssetClass v-show="groupsClass.length > 0" :key="componentKey" :assets-class="groupsClass" :live-width="mywidth" />
            </v-col>
            <v-col v-if="!showDataError" xl7 lg8 md12 sm12 xs12 pb-2>
              <v-row v-if="assetCategoryPanel">
                <v-col xs12 :class="$vuetify?.breakpoint?.xs ? 'pr-2' : 'ml-4 pr-4'">
                  <v-col v-if="!$vuetify?.breakpoint?.mdAndDown" xs12 :class="!$vuetify?.breakpoint?.xs ? 'pl-2' : ''">
                    <v-row class="margin_left_1">
                      <v-col xs12 mt-1 ml-4>
                        <v-row>
                          <v-col xs4>
                            <h3 class="font-weight-medium">
                              <b>Holding</b>
                            </h3>
                          </v-col>
                          <v-col xs3>
                            <h3 class="font-weight-medium text-right">
                              <b>Market Value</b>
                            </h3>
                          </v-col>
                          <v-col xs3>
                            <h3 class="font-weight-medium text-right">
                              <b>Units</b>
                            </h3>
                          </v-col>
                          <v-col xs2>
                            <h3 class="font-weight-medium text-right pl-3">
                              <b>Price</b>
                            </h3>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-for="(groupnames, index) in groups" :key="index" xs12>
                        <v-col xs12>
                          <v-col xs12 class="text-left mb-1">
                            <v-row>
                              <v-col xs4>
                                <span class="cursor-pointer mr-2">
                                  <span data-html2canvas-ignore="true">
                                    <v-icon
                                      size="small"
                                      :class="groupnames.equityPanel ? 'rotateactivityicon' : ''"
                                      :color="$vuetify?.theme.dark ? '' : 'black'"
                                      @click="groupnames.equityPanel = !groupnames.equityPanel"
                                      >fas fa-angle-right</v-icon
                                    >
                                  </span>
                                </span>
                                <span class="legendSquare" :style="`background-color:${groupnames.GroupColor}`" />
                                <span class="font-weight-medium ml-1">
                                  <b>{{ groupnames.GroupName }}</b>
                                </span>
                              </v-col>
                              <v-col xs3 pl-3 text-right>
                                <span class="font-weight-medium">
                                  <b>{{ formatPrice(groupnames.GroupTotal, 2) }}</b>
                                </span>
                              </v-col>
                              <v-col xs3 pl-3 text-right>
                                <span class="font-weight-medium" />
                              </v-col>
                              <v-col xs2 pl-4 text-right>
                                <span class="font-weight-medium" />
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-if="groupnames.equityPanel" ml-4>
                            <v-col v-for="(item, i) in assetsCategoryGroupList[groupnames.GroupName]" :key="i" mb-2 xs12>
                              <v-row>
                                <v-col xs4 class="text-left">
                                  {{ item.value.Holding }}
                                </v-col>
                                <v-col xs3 class="text-right pr-2">
                                  {{ formatPrice(item.value.MarketValue, 2) }}
                                </v-col>
                                <v-col xs3 class="text-right">
                                  {{ item.value.Units }}
                                </v-col>
                                <v-col xs2 class="text-right">
                                  {{ formatPrice(item.value.Price, 2) }}
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-col>
                        </v-col>
                      </v-col>
                      <v-divider inset dark class="hr_border" />
                      <v-col xs12>
                        <v-row>
                          <v-col xs7 ml-1 text-right>
                            <span class="font-weight-medium">{{ formatPrice(Marketpricetotal, 2) }}</span>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="$vuetify?.breakpoint?.mdAndDown" xs12>
                    <v-row>
                      <v-divider inset dark class="hr_border" />
                      <v-col v-for="(groupnames, index) in groups" :key="index" xs12 pt-2>
                        <v-row class="pb-2">
                          <v-col xs12>
                            <v-row>
                              <v-col xs1 text-center>
                                <span class="cursor-pointer mr-2">
                                  <span data-html2canvas-ignore="true">
                                    <v-icon
                                      size="small"
                                      :class="groupnames.equityPanel ? 'rotateactivityicon' : ''"
                                      :color="$vuetify?.theme.dark ? '' : 'black'"
                                      style="font-size: 10px"
                                      @click="groupnames.equityPanel = !groupnames.equityPanel"
                                      >fas fa-angle-right</v-icon
                                    >
                                  </span>
                                </span>
                              </v-col>
                              <v-col xs10>
                                <span class="legendSquare" :style="`background-color:${groupnames.GroupColor}`" />
                                <span class="font-weight-medium ml-1">
                                  <b>{{ groupnames.GroupName }}</b>
                                </span>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-if="groupnames.equityPanel" xs12 pl-4 pt-2>
                            <v-col v-for="(item, i) in assetsCategoryGroupList[groupnames.GroupName]" :key="i">
                              <v-col xs12 pl-3>
                                <h5 class="font-weight-medium">
                                  <span>
                                    <b>Holdings</b>
                                  </span>
                                </h5>
                                <h4>
                                  <b>{{ item.value.Holding }}</b>
                                </h4>
                              </v-col>
                              <v-row>
                                <v-col xs4 pl-3>
                                  <h5 class="font-weight-medium">
                                    <span>Market Value</span>
                                  </h5>
                                  <h4>
                                    {{ formatPrice(item.value.MarketValue, 2) }}
                                  </h4>
                                </v-col>
                                <v-col xs4 pl-3>
                                  <h5 class="font-weight-medium">
                                    <span>Units</span>
                                  </h5>
                                  <h4>{{ item.value.Units }}</h4>
                                </v-col>
                                <v-col xs4 pl-3>
                                  <h5 class="font-weight-medium">
                                    <span>Price</span>
                                  </h5>
                                  <h4>
                                    {{ formatPrice(item.value.Price, 2) }}
                                  </h4>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-col>
                        </v-row>
                        <v-divider v-if="index !== assetsCategoryGroupList[groupnames.GroupName].length - 1" />
                      </v-col>
                      <v-col xs12>
                        <v-row>
                          <v-col xs4 pl-4 ml-3 text-left>
                            <h5 class="font-weight-medium">
                              <span>Total Market Value</span>
                            </h5>
                            <h4>{{ formatPrice(Marketpricetotal, 2) }}</h4>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
              <v-row v-if="assetClassPanel">
                <v-col xs12>
                  <v-col v-if="!$vuetify?.breakpoint?.mdAndDown" xs12 :class="!$vuetify?.breakpoint?.xs ? 'pl-2' : ''">
                    <v-row class="margin_left_1">
                      <v-col xs12 mt-1 ml-4>
                        <v-row>
                          <v-col xs4>
                            <h3 class="font-weight-medium">
                              <b>Holding</b>
                            </h3>
                          </v-col>
                          <v-col xs2>
                            <h3 class="font-weight-medium text-right">
                              <b>Market Value</b>
                            </h3>
                          </v-col>
                          <v-col xs2>
                            <h3 class="font-weight-medium text-right">
                              <b>Units</b>
                            </h3>
                          </v-col>
                          <v-col xs2>
                            <h3 class="font-weight-medium text-right">
                              <b>Price</b>
                            </h3>
                          </v-col>
                          <v-col xs2>
                            <h3 class="font-weight-medium text-right">
                              <b>Percent</b>
                            </h3>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-for="(groupnames, index) in groupsClass" :key="index" xs12>
                        <v-col xs12 class="text-left mb-1">
                          <v-row>
                            <v-col xs4>
                              <span class="cursor-pointer mr-2">
                                <span data-html2canvas-ignore="true">
                                  <v-icon
                                    size="small"
                                    :class="groupnames.equityPanel ? 'rotateactivityicon' : ''"
                                    :color="$vuetify?.theme.dark ? '' : 'black'"
                                    @click="groupnames.equityPanel = !groupnames.equityPanel"
                                    >fas fa-angle-right</v-icon
                                  >
                                </span>
                              </span>
                              <span class="legendSquare" :style="`background-color:${groupnames.GroupColor}`" />
                              <span class="font-weight-medium ml-1">
                                <b>{{ groupnames.GroupName }}</b>
                              </span>
                            </v-col>
                            <v-col xs2 pl-3 text-right>
                              <span class="font-weight-medium">
                                <b>{{ formatPrice(groupnames.GroupTotal, 2) }}</b>
                              </span>
                            </v-col>
                            <v-col xs2 pl-3 text-right>
                              <span class="font-weight-medium" />
                            </v-col>
                            <v-col xs2 pl-3 text-right>
                              <span class="font-weight-medium" />
                            </v-col>
                            <v-col xs2 pl-4 text-right>
                              <span class="font-weight-medium">
                                <b>{{ parseFloat((groupnames.GroupTotal / Marketpricetotal) * 100).toFixed(2) }}%</b>
                              </span>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col v-if="groupnames.equityPanel" ml-4>
                          <v-col v-for="(item, index) in assetsClassGroupList[groupnames.GroupName]" :key="index" mb-2 xs12>
                            <v-row v-if="!$vuetify?.breakpoint?.mdAndDown">
                              <v-col xs4 class="text-left">
                                {{ item.value.Holding }}
                              </v-col>
                              <v-col xs2 class="text-right pr-3">
                                {{ formatPrice(item.value.MarketValue, 2) }}
                              </v-col>
                              <v-col xs2 class="text-right">
                                {{ item.value.Units }}
                              </v-col>
                              <v-col xs2 class="text-right">
                                {{ formatPrice(item.value.Price, 2) }}
                              </v-col>
                              <v-col xs2 class="text-right">
                                {{ parseFloat((item.value.MarketValue / Marketpricetotal) * 100).toFixed(2) }}%
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-col>
                      <v-divider inset dark class="hr_border" />
                      <v-col xs12>
                        <v-row>
                          <v-col xs6 text-right>
                            <span class="font-weight-medium">{{ formatPrice(Marketpricetotal, 2) }}</span>
                          </v-col>
                          <v-col xs6 text-right>
                            <span class="font-weight-medium">100%</span>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="$vuetify?.breakpoint?.mdAndDown" xs12>
                    <v-row>
                      <v-divider inset dark class="hr_border" />
                      <v-col v-for="(groupnames, i) in groupsClass" :key="i" xs12 pt-2>
                        <v-row class="pb-2">
                          <v-col xs12>
                            <v-row>
                              <v-col xs1 text-center>
                                <span class="cursor-pointer mr-2">
                                  <span data-html2canvas-ignore="true">
                                    <v-icon
                                      size="small"
                                      :class="groupnames.equityPanel ? 'rotateactivityicon' : ''"
                                      :color="$vuetify?.theme.dark ? '' : 'black'"
                                      style="font-size: 10px"
                                      @click="groupnames.equityPanel = !groupnames.equityPanel"
                                      >fas fa-angle-right</v-icon
                                    >
                                  </span>
                                </span>
                              </v-col>
                              <v-col xs10>
                                <span class="legendSquare" :style="`background-color:${groupnames.color}`" />
                                <span class="font-weight-medium ml-1">{{ groupnames.GroupName }}</span>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-if="groupnames.equityPanel" xs12 pl-4 pt-2>
                            <v-col v-for="(item, i) in assetsClassGroupList[groupnames.GroupName]" :key="i">
                              <v-row>
                                <v-col xs12 pl-3>
                                  <h5 class="font-weight-medium">
                                    <span>Holding</span>
                                  </h5>
                                  <h4>{{ item.value.Holding }}</h4>
                                </v-col>
                                <v-col xs6 pl-3>
                                  <h5 class="font-weight-medium">
                                    <span>Market Value</span>
                                  </h5>
                                  <h4>
                                    {{ formatPrice(item.value.MarketValue, 2) }}
                                  </h4>
                                </v-col>
                                <v-col xs6>
                                  <h5 class="font-weight-medium">
                                    <span>Units</span>
                                  </h5>
                                  <h4>{{ item.value.Units }}</h4>
                                </v-col>
                                <v-col xs6 pl-3>
                                  <h5 class="font-weight-medium">
                                    <span>Price</span>
                                  </h5>
                                  <h4>
                                    {{ formatPrice(item.value.Price, 2) }}
                                  </h4>
                                </v-col>
                                <v-col xs6>
                                  <h5 class="font-weight-medium">
                                    <span>Percent</span>
                                  </h5>
                                  <h4>{{ parseFloat((item.value.MarketValue / Marketpricetotal) * 100).toFixed(2) }}%</h4>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-col>
                        </v-row>
                        <v-divider v-if="index !== assetsClassList.length - 1" />
                      </v-col>
                      <v-col xs12 pt-2>
                        <v-row>
                          <v-col xs9 md9 pl-4 ml-3 text-left>
                            <h5 class="font-weight-medium">
                              <span>Total Market Value</span>
                            </h5>
                            <span class="font-weight-medium">{{ parseFloat(Marketpricetotal).toFixed(2) }}</span>
                          </v-col>
                          <v-col xs2 text-left>
                            <h5 class="font-weight-medium">
                              <span>Total Percent</span>
                            </h5>
                            <span class="font-weight-medium">100%</span>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="showDataError" xs12>
              <v-col xs12 class="shortcutflex">
                <v-col class="cashFlowimageflex mt-5" pl-4 pr-4>
                  <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                </v-col>
                <h3 class="font-weight-medium text-center mt-2 mb-4">No Data Available</h3>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>
<script>
import AssetCategory from '@/components/TAL/Finder/Households/AssetCategory'
import AssetClass from '@/components/TAL/Finder/Households/AssetClass'
import * as XLSX from 'xlsx'
export default {
  components: {
    AssetCategory,
    AssetClass
  },
  props: ['selectedIndividualData'],
  data() {
    return {
      componentKey: 0,
      mywidth: 0,
      holdingsType: 0,
      equityPanel: false,
      holdingPanel: false,
      assetCategoryPanel: true,
      assetClassPanel: false,
      assetsCategoryDonutList: [
        { Series: 'Equity', Amount: 119325.4 },
        { Series: 'Bond', Amount: 140157.63 },
        { Series: 'Money Market', Amount: 11728 }
      ],
      assetsClassDonutList: [
        { AssetName: 'Intermediate-Term Bond', Amount: 0.3241869811082275 },
        {
          AssetName: 'Short Government',
          Amount: 0.19358759866090378
        },
        { AssetName: 'Short-Term Bond', Amount: 0.1019048380529652 },
        {
          AssetName: 'Foreign Small/Mid Value',
          Amount: 0.08332385297454797
        },
        {
          AssetName: 'Small Blend',
          Amount: 0.07269422534911603
        },
        {
          AssetName: 'Large Value',
          Amount: 0.05831620472950569
        },
        { AssetName: 'Foreign Large Value', Amount: 0.04222297590130038 },
        { AssetName: 'Small Value', Amount: 0.03388320709640558 },
        {
          AssetName: 'Money Market',
          Amount: 0.03308802277540021
        },
        {
          AssetName: 'Diversified Emerging Mkts',
          Amount: 0.01120466684302886
        },
        {
          AssetName: 'Large Blend',
          Amount: 0.00882222272525065
        },
        {
          AssetName: 'Foreign Large Blend',
          Amount: 0.00812312115237898
        },
        {
          AssetName: 'Foreign Small/Mid Blend',
          Amount: 0.00785906360998526
        }
      ],
      assetsCategoryList: [],
      assetsClassList: [],
      assetsCategoryGroupList: [],
      assetsClassGroupList: [],
      groups: [],
      groupsClass: [],
      a: 0,
      holdingsList: [],
      currentList: [],
      Marketpricetotal: 0,
      looplessMarketpricetotal: 0,
      accountTypeList: [],
      accountType: '',
      comingSoonImage: require('@/assets/images/win.svg'),
      showDataError: false
    }
  },
  watch: {
    selectedIndividualData: {
      handler(val) {
        this.individualInformationLoading = false
        if (val.length > 0 && val[0].householdName) {
          val[0].individualAccounts.map((res) => {
            this.accountTypeList.push({
              text: res.account,
              value: res.account
            })
          })

          this.accountType = this.accountTypeList.length > 0 ? this.accountTypeList[0] : ''

          this.getHoldingData()
        }
      },
      deep: true
    }
  },
  methods: {
    getMarketTotal(val) {
      this.Marketpricetotal += val
      return this.Marketpricetotal
    },
    openAssetCategory() {
      this.assetClassPanel = false
      this.assetCategoryPanel = true
    },
    openAssetClass() {
      this.assetCategoryPanel = false
      this.assetClassPanel = true
    },
    async getHoldingData() {
      this.holdingsList = []
      this.householdId = this.$route.query.householdId
      var accountid = this.accountType.text ? this.accountType.text : this.accountType

      this.$axios
        .get(`/api/v1/tal/individual/holdings/${accountid}/0`)
        .then((success) => {
          if (success.data.d.length > 0) {
            this.holdingsList = success.data.d
            this.totalRevenue()
            this.groupResult()
            this.showDataError = false
          } else {
            this.holdingsList = []
            this.showDataError = true
          }
        })
        .catch(() => {
          this.showDataError = true
        })
    },
    totalRevenue() {
      this.Marketpricetotal = this.holdingsList.reduce(function (a, b) {
        return a + b.MarketValue
      }, 0)
    },
    groupResult() {
      this.assetsCategoryGroupList = []
      this.groups = []
      this.assetsClassGroupList = []
      this.groupsClass = []

      this.assetsCategoryGroupList = this.holdingsList.reduce(function (r, a) {
        r[a.AssetCategory] = r[a.AssetCategory] || []
        r[a.AssetCategory].push({
          value: {
            AssetClass: a.AssetClass,
            AssetCategory: a.AssetCategory,
            Holding: a.Holding,
            MarketValue: a.MarketValue,
            Units: a.Units,
            Price: a.Price,
            equityPanel: true
          }
        })
        return r
      }, Object.create(null))

      var groupName = Object.keys(this.assetsCategoryGroupList)

      for (var a = 0; a < groupName.length; a++) {
        var grouptotal = 0
        for (var b = 0; b < this.assetsCategoryGroupList[groupName[a]].length; b++) {
          grouptotal += this.assetsCategoryGroupList[groupName[a]][b].value.MarketValue
        }
        if (this.a > 3) this.a = 0
        this.groups.push({
          GroupName: groupName[a],
          equityPanel: true,
          GroupTotal: grouptotal,
          GroupColor: this.$store.state.theme.accentColors[this.a]
        })
        this.a++
      }
      this.assetsClassGroupList = this.holdingsList.reduce(function (r, a) {
        r[a.AssetClass] = r[a.AssetClass] || []
        r[a.AssetClass].push({
          value: {
            AssetClass: a.AssetClass,
            AssetCategory: a.AssetCategory,
            Holding: a.Holding,
            MarketValue: a.MarketValue,
            Units: a.Units,
            Price: a.Price,
            equityPanel: true
          }
        })
        return r
      }, Object.create(null))

      var groupNameClass = Object.keys(this.assetsClassGroupList)

      for (var aa = 0; aa < groupNameClass.length; aa++) {
        var groupTotalClass = 0
        for (var bb = 0; bb < this.assetsClassGroupList[groupNameClass[aa]].length; bb++) {
          groupTotalClass += this.assetsClassGroupList[groupNameClass[aa]][bb].value.MarketValue
        }
        if (this.a > 3) this.a = 0
        this.groupsClass.push({
          GroupName: groupNameClass[aa],
          equityPanel: true,
          GroupTotal: groupTotalClass,
          GroupColor: this.$store.state.theme.accentColors[this.a]
        })
        this.a++
      }
      this.componentKey += 1
    },
    exportAssetClass(val) {
      var xlHeaders
      var final = []
      var names = Object.keys(val)
      for (var i = 0; i < names.length; i++) {
        xlHeaders = val[names[i]].map((rec) => {
          return {
            'Asset Class': rec.value.AssetClass,
            'Asset Category': rec.value.AssetCategory,
            Holding: rec.value.Holding,
            'Market Value': rec.value.MarketValue,
            Units: rec.value.Units,
            Price: rec.value.Price
          }
        })
        final = final.concat(xlHeaders)
      }

      return final
    },
    exportAssetCategory(val) {
      var xlHeaders
      var final = []
      var names = Object.keys(val)
      for (var i = 0; i < names.length; i++) {
        xlHeaders = val[names[i]].map((rec) => {
          return {
            Holding: rec.value.Holding,
            'Market Value': rec.value.MarketValue,
            Units: rec.value.Units,
            Price: rec.value.Price,
            'Asset Category': rec.value.AssetCategory
          }
        })
        final = final.concat(xlHeaders)
      }

      return final
    },
    exportData() {
      var assetCategoryHeaders = []
      var assetCategoryResult = []
      var assetClassHeaders = []
      var assetClassResults = []

      var wb = XLSX.utils.book_new()

      if (this.assetsCategoryGroupList) {
        assetCategoryHeaders = this.exportAssetCategory(this.assetsCategoryGroupList, 'Asset Category')
        assetCategoryResult = XLSX.utils.json_to_sheet(assetCategoryHeaders)
        XLSX.utils.book_append_sheet(wb, assetCategoryResult, 'Asset Category')
        for (var Xrow = 2; Xrow !== assetCategoryHeaders.length + 2; ++Xrow) {
          this.currencyConvert(wb, 'B', Xrow, 'Asset Category')
          this.currencyConvert(wb, 'D', Xrow, 'Asset Category')
        }
      }
      if (this.assetsClassGroupList) {
        assetClassHeaders = this.exportAssetClass(this.assetsClassGroupList, 'Asset Class')
        assetClassResults = XLSX.utils.json_to_sheet(assetClassHeaders)
        XLSX.utils.book_append_sheet(wb, assetClassResults, 'Asset Class')
        for (var XSchoolrow = 2; XSchoolrow !== assetClassHeaders.length + 2; ++XSchoolrow) {
          this.currencyConvert(wb, 'D', XSchoolrow, 'Asset Class')
          this.currencyConvert(wb, 'F', XSchoolrow, 'Asset Class')
        }
      }
      XLSX.writeFile(wb, 'Account Holdings.xlsx')
    },
    currencyConvert(xlWb, xlColRef, xlRowNum, sheetName) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets[sheetName][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    },
    percentConvert(xlWb, xlColRef, xlRowNum, sheetName) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets[sheetName][xlColRef + xlRowNum], '0.00%')
    },
    changeParticipants() {
      this.getHoldingData()
    }
  }
}
</script>
<style scoped>
.legendSquare {
  height: 15px;
  width: 15px;
  display: inline-block;
  padding-right: 3px;
}

.rotateactivityicon {
  transform: rotate(90deg);
}
.rotate_icon {
  transform: rotate(-90deg);
}
.hr_border {
  border: solid 1px lightgray !important;
}
.v-divider--inset:not(.v-divider--vertical) {
  margin-left: 0px;
  max-width: calc(100% - 0px);
}
</style>
