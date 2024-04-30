<template>
  <v-row class="justify-end">
    <v-layout>
      <v-col v-show="!fundDialog">
        <loader v-model="loading" :loading="loading" />
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-col cols="12" xs="12">
            <v-row>
              <v-col cols="12" xs="12" sm="6" class="mb-2">
                <v-col cols="12" xs="12">
                  <h2>Available Strategist (you must choose a Strategist)</h2>
                </v-col>
                <h4>Select a strategist to include in this proposal</h4>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="mb-3">
                <v-data-table
                  v-model:expanded="expanded"
                  class="elevation-0 mb-3"
                  :single-expand="true"
                  :hide-default-header="display.mdAndDown.value"
                  show-expand
                  :headers="headersList"
                  :items="strategistsList"
                  item-key="GroupId"
                  hide-default-footer
                  default-sort-by
                  :disable-pagination="true"
                >
                  <template #header="props">
                    <th
                      v-for="header in props.headers"
                      :key="header.text ? header.text : header.value"
                      :width="header.width"
                      :align="header.align"
                    >
                      {{ header.text }}
                    </th>
                  </template>
                  <template #item="{ item, isExpanded, expand }">
                    <tr
                      v-if="!display.mdAndDown.value"
                      :class="isExpanded ? (theme.dark ? 'expandedrow_colordark' : 'expandedrow_color') : ''"
                    >
                      <td>
                        <v-radio-group v-model="selectedGroupId" hide-details class="ma-0">
                          <v-radio color="accent" :value="item.GroupId" :ripple="false" class="ma-0" />
                        </v-radio-group>
                      </td>
                      <td class="text-left">
                        <a
                          class="cursor-pointer text-decoration"
                          target="_blank"
                          :href="`/api/v1/cms/document?path=resources/StrategistsDocs/${item.StrategistSummary}`"
                          >{{ item.Strategist }}</a
                        >
                      </td>
                      <td class="text-left">
                        {{ item.UnderlyingHoldings }}
                      </td>
                      <td class="text-right">{{ item.AverageExpRatio ? item.AverageExpRatio.toFixed(2) : 0 }}%</td>
                      <td class="text-right">
                        {{ item.ModelCount }}
                      </td>
                      <td class="text-center">
                        <v-icon
                          :ripple="false"
                          :class="isExpanded ? 'rotate_icon_plus_90' : ''"
                          size="small"
                          @click="expand(!isExpanded), getStrategistsModels(item, isExpanded)"
                        >
                          fas fa-chevron-right
                        </v-icon>
                      </td>
                    </tr>
                    <tr v-if="display.mdAndDown.value" :class="[isExpanded ? 'border_bottom_none' : '']">
                      <td v-show="strategistsList.length > 0" class="pr-3 pl-3">
                        <v-col cols="12" xs="12">
                          <v-row>
                            <v-col cols="12" xs="12" class="pb-2" />
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" xs="9" class="mobile_marker_badge pt-2 mr-1 cursor-pointer">
                                  <v-col cols="12" xs="12">
                                    <v-row>
                                      <v-col class="flex_none pr-1 align-self">
                                        <v-radio-group v-model="selectedGroupId" hide-details>
                                          <v-radio :value="item.GroupId" :ripple="false" class="ma-0" color="accent" />
                                        </v-radio-group>
                                      </v-col>
                                      <v-col class="flex_none pr-1">
                                        <h5 class="pt-1">
                                          <span class="text-grey">Strategist</span>
                                        </h5>
                                        <h4 class="text-uppercase">
                                          <a
                                            class="cursor-pointer text-decoration"
                                            target="_blank"
                                            :href="`/api/v1/cms/document?path=resources/StrategistsDocs/${item.StrategistSummary}`"
                                            >{{ item.Strategist }}</a
                                          >
                                        </h4>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-col>
                                <v-col cols="12" xs="2" class="text-right cursor-pointer align-self mt-2">
                                  <v-btn icon variant="text" @click="expand(!isExpanded), getStrategistsModels(item, isExpanded)">
                                    <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                              <v-col class="pb-2" />
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="6" xs="6">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pt-1">
                                      <span class="text-grey">Underlying Holdings</span>
                                    </h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <h4>{{ item.UnderlyingHoldings }}</h4>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" xs="6">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pt-1">
                                      <span class="text-grey">Average Expense Ratio</span>
                                    </h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <h4>{{ item.AverageExpRatio ? item.AverageExpRatio.toFixed(2) : 0 }}%</h4>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" xs="12" class="pb-2" />
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="6" xs="6">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pt-1">
                                      <span class="text-grey"># of Models</span>
                                    </h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <h4>{{ item.ModelCount }}</h4>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" xs="12" class="pb-2" />
                          </v-row>
                        </v-col>
                      </td>
                    </tr>
                  </template>
                  <template #expanded-item="{ headers }">
                    <td :colspan="headers.length">
                      <v-data-table
                        :headers="innerHeaderLists"
                        :items="strategistModelList ? strategistModelList : []"
                        item-key="ID"
                        hide-default-footer
                        :disable-pagination="true"
                        class="individual"
                        :hide-default-header="display.mdAndDown.value"
                        :loading="loader"
                        loader-height="2"
                      >
                        <template #header="props">
                          <th v-for="header in props.headers" :key="header.text" :width="header.width" :align="header.align">
                            {{ header.text }}
                          </th>
                        </template>
                        <template #item="props">
                          <tr v-if="!display.mdAndDown.value" :style="theme.dark ? 'color:white' : ''">
                            <td class="text-left">
                              <h4>
                                <a
                                  class="text-decoration cursor-pointer"
                                  @click="downloadProspect('ModelFactSheets', 'Investment', props.item.ModelId)"
                                  >{{ props.item.ModelName }}</a
                                >
                              </h4>
                            </td>
                            <td class="text-left">
                              {{ props.item.Risk }}
                            </td>
                            <td class="text-right">
                              {{ props.item.RiskRating }}
                            </td>
                            <td class="text-right">{{ props.item.ExpenseRatio ? props.item.ExpenseRatio.toFixed(2) : 0 }}%</td>
                          </tr>
                          <tr
                            v-if="display.mdAndDown.value"
                            :class="[isExpanded ? (theme.dark ? 'expandedrow_colordark' : 'expandedrow_color') : '']"
                          >
                            <td class="pr-3 pl-3">
                              <v-col cols="12" xs="12">
                                <v-row>
                                  <v-col cols="12" xs="12" class="text-left">
                                    <h5 class="pt-1">
                                      <span class="text-grey">Models</span>
                                    </h5>
                                    <h4>
                                      <a
                                        class="text-decoration cursor-pointer"
                                        href="javascript:void(0)"
                                        @click="downloadProspect('ModelFactSheets', 'Investment', props.item.ModelId)"
                                        >{{ props.item.ModelName }}</a
                                      >
                                    </h4>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="pb-2" />
                                  <v-col cols="12" xs="12">
                                    <v-row>
                                      <v-col cols="12" xs="8">
                                        <v-col cols="12" xs="12">
                                          <h5 class="pt-1">
                                            <span class="text-grey">Risk</span>
                                          </h5>
                                        </v-col>
                                        <v-col cols="12" xs="12">
                                          <h4>{{ props.item.Risk }}</h4>
                                        </v-col>
                                      </v-col>
                                      <v-col cols="12" xs="4">
                                        <v-col cols="12" xs="12">
                                          <h5 class="pt-1">
                                            <span class="text-grey">Risk Rating</span>
                                          </h5>
                                        </v-col>
                                        <v-col cols="12" xs="12">
                                          <h4>{{ props.item.RiskRating }}</h4>
                                        </v-col>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="pb-2" />
                                  <v-col cols="12" xs="12">
                                    <v-row>
                                      <v-col cols="6" xs="6">
                                        <v-col cols="12" xs="12">
                                          <h5 class="pt-1">
                                            <span class="text-grey">Expense Ratio</span>
                                          </h5>
                                        </v-col>
                                        <v-col cols="12" xs="12">
                                          <h4>{{ props.item.ExpenseRatio ? props.item.ExpenseRatio.toFixed(2) : 0 }}%</h4>
                                        </v-col>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="pb-2" />
                                </v-row>
                              </v-col>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </td>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-col
              v-if="
                !(
                  (planType === $authz.planType.Defined_Benefit_Plan || planType === $authz.planType.Cash_Balance_Plan) &&
                  $store.state.user.selectedProgram.programName === $authz.managedPlan.PA
                ) && planType.trim() !== $authz.planType.Simple_IRA_Plan_Proposal
              "
            >
              <v-row>
                <v-col cols="12" xs="12" sm="9" class="mb-3">
                  <v-col cols="12" xs="12">
                    <h2>Investment Lineup (you must include a lineup)</h2>
                  </v-col>
                  <h4>Select a pre-built investment lineup or build your own investment lineup to include in the proposal</h4>
                </v-col>
              </v-row>
              <v-row class="flex-grow-1 justify-space-between">
                <v-col cols="12" xl="3" lg="3" md="3" sm="12" xs="12" class="text-left align-self mb-3">
                  <v-select
                    v-model="fundListModel"
                    :items="fundList"
                    append-icon="icon-chevron-down"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="searchRadiusSelect"
                    label="Pre-Built Fund List"
                    clearable
                    return-object
                    item-title="Name"
                    item-value="ListID"
                    @update:model-value="addLoadInvestmentFromFund(fundListModel.ListID)"
                  />
                </v-col>
                <v-col cols="12" xl="9" lg="9" md="9" sm="12" xs="12" class="text-right mb-3">
                  <v-btn v-if="showFund" :class="[!theme.dark ? 'accent' : '']" @click="createNewFund()">
                    New Investment Lineup
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="mb-3">
                  <v-data-table
                    v-model="selectedFund"
                    :headers="investmentLineUpTableHeader"
                    :items="investmentLineups"
                    item-key="Ticker"
                    :disable-pagination="true"
                    hide-default-footer
                    :hide-default-headers="display.mdAndDown.value"
                    class="elevation-0 fixHeader"
                    :fixed-header="true"
                    style="backface-visibility: hidden"
                  >
                    <template #header="props">
                      <th v-for="header in props.headers" :key="header.text" :width="header.width" :align="header.align">
                        {{ header.text }}
                      </th>
                    </template>
                    <template #item="props">
                      <tr v-if="!display.mdAndDown.value">
                        <td class="text-left">
                          {{ props.item.Type }}
                        </td>
                        <td class="text-left">
                          {{ props.item.Ticker }}
                        </td>
                        <td class="text-left">
                          {{ props.item.Name }}
                        </td>
                        <td class="text-right">{{ formatPercent(props.item.mgmt) }}%</td>
                        <td class="text-right">{{ formatPercent(props.item.tload) }}%</td>
                        <td class="text-right">{{ formatPercent(props.item.SubTA) }}%</td>
                        <td class="text-right">{{ formatPercent(props.item.expratio) }}%</td>
                      </tr>
                      <tr v-else>
                        <td class="pr-3 pl-3">
                          <v-col cols="12" xs="12">
                            <v-row>
                              <v-col cols="12" xs="12" class="pb-2" />
                              <v-col cols="12" xs="12">
                                <v-row>
                                  <v-col cols="6" xs="6">
                                    <v-col cols="12" xs="12">
                                      <h5 class="pt-1">
                                        <span class="text-grey">Type</span>
                                      </h5>
                                    </v-col>
                                    <v-col cols="12" xs="12">
                                      <h4>{{ props.item.Type }}</h4>
                                    </v-col>
                                  </v-col>
                                  <v-col cols="12" xs="5">
                                    <v-col cols="12" xs="12">
                                      <h5 class="pt-1">
                                        <span class="text-grey">Symbol</span>
                                      </h5>
                                    </v-col>
                                    <v-col cols="12" xs="12">
                                      <h4>{{ props.item.Ticker }}</h4>
                                    </v-col>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="12" xs="12" class="pb-2" />
                              <v-col cols="12" xs="12">
                                <v-row>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="12" xs="12">
                                      <h5 class="pt-1">
                                        <span class="text-grey">Name</span>
                                      </h5>
                                    </v-col>
                                    <v-col cols="12" xs="12">
                                      <h4>{{ props.item.Name }}</h4>
                                    </v-col>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="12" xs="12" class="pb-2" />
                              <v-col cols="12" xs="12">
                                <v-row>
                                  <v-col cols="6" xs="6">
                                    <v-col cols="12" xs="12">
                                      <h5 class="pt-1">
                                        <span class="text-grey">Mgmt</span>
                                      </h5>
                                    </v-col>
                                    <v-col cols="12" xs="12">
                                      <h4>{{ formatPercent(props.item.mgmt) }}%</h4>
                                    </v-col>
                                  </v-col>
                                  <v-col cols="12" xs="5">
                                    <v-col cols="12" xs="12">
                                      <h5 class="pt-1">
                                        <span class="text-grey">12b-1</span>
                                      </h5>
                                    </v-col>
                                    <v-col cols="12" xs="12">
                                      <h4>{{ formatPercent(props.item.tload) }}%</h4>
                                    </v-col>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="12" xs="12" class="pb-2" />
                              <v-col cols="12" xs="12">
                                <v-row>
                                  <v-col cols="6" xs="6">
                                    <v-col cols="12" xs="12">
                                      <h5 class="pt-1">
                                        <span class="text-grey">SubTA</span>
                                      </h5>
                                    </v-col>
                                    <v-col cols="12" xs="12">
                                      <h4>{{ formatPercent(props.item.SubTA) }}%</h4>
                                    </v-col>
                                  </v-col>
                                  <v-col cols="12" xs="5">
                                    <v-col cols="12" xs="12">
                                      <h5 class="pt-1">
                                        <span class="text-grey">Total Fees</span>
                                      </h5>
                                    </v-col>
                                    <v-col cols="12" xs="12">
                                      <h4>{{ formatPercent(props.item.expratio) }}%</h4>
                                    </v-col>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="12" xs="12" class="pb-2" />
                            </v-row>
                          </v-col>
                        </td>
                      </tr>
                    </template>
                    <template v-slot:body.append>
                      <tr v-if="!display.smAndDown.value">
                        <td></td>
                        <td colspan="6" class="text-left pa-1">
                          <strong>Total Funds: {{ investmentLineups.length }}</strong>
                        </td>
                      </tr>
                      <tr v-if="display.smAndDown.value">
                        <td class="pr-3 pl-3">
                          <v-col cols="12" xs="12">
                            <v-row>
                              <v-col cols="12" xs="12">
                                <v-row>
                                  <v-col cols="12" xs="12">
                                    <h5 class="pt-1">
                                      <span class="text-grey">Total Funds</span>
                                    </h5>
                                    <h4 class="text-uppercase">
                                      {{ investmentLineups.length }}
                                    </h4>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-form>
      </v-col>
      <v-col v-show="fundDialog" id="fundModel" cols="12" xs="12">
        <MMLInvestment ref="proposedFund" />
        <v-col cols="12" xs="12" class="mt-5">
          <v-btn :color="theme.dark ? '' : 'accent'" class="elevation-0 ml-0" @click="saveFundInvestment()">
            Save Investment
          </v-btn>
        </v-col>
      </v-col>
    </v-layout>
  </v-row>
</template>
<script>
import { ref, watch, onMounted, onBeforeUnmount, getCurrentInstance, inject } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import MMLInvestment from '@/components/TAL/MMLInvestment'
import loader from '@/components/Loader'
export default {
  components: {
    MMLInvestment,
    loader
  },
  props: ['planID', 'seinpno', 'proposalData', 'getModelId', 'reports', 'planType', 'strategist'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const $route = useRoute()
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const proposalPlanId = ref(0)
    const $toast = instance.appContext.config.globalProperties.$toast
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const $store = instance.appContext.config.globalProperties.$store
    const expanded = ref([])
    const valid = ref(false)
    const fundDialog = ref(false)
    const strategistsList = ref([])
    const strategistModelList = ref([])
    const modelFund = ref(null)
    const proposedFund = ref(null)
    const fundList = ref([])
    const investmentLineups = ref([])
    const fundListModel = ref('')
    const planProposalID = ref(0)
    const selectedFund = ref([])
    const oldSelectedFund = ref([])
    const successLoad = ref(false)
    const oldSelected = ref('')
    const selectedGroupId = ref('')
    const successConfirm = ref(false)
    const expand = ref(false)
    const modelFundObject = ref([])
    const headersList = ref([
      {
        text: 'Strategist',
        value: 'Strategist',
        align: 'start',
        width: '25%',
        sortable: true
      },
      {
        text: 'Underlying Holdings',
        value: 'UnderlyingHoldings',
        align: 'start',
        width: '25%',
        sortable: true
      },
      {
        text: 'Average Expense Ratio',
        value: 'AverageExpRatio',
        align: 'end',
        width: '20%',
        sortable: true
      },
      {
        text: '# of Models',
        value: 'ModelCount',
        align: 'end',
        width: '20%',
        sortable: true
      },
      {
        text: '',
        value: 'actions',
        align: 'center',
        width: '10%',
        sortable: false
      }
    ])
    const innerHeaderLists = ref([
      {
        Id: 1,
        text: 'Models',
        value: 'ModelName',
        align: 'start',
        width: '11%',
        sortable: false
      },
      {
        Id: 2,
        text: 'Risk',
        value: 'Risk',
        align: 'start',
        width: '3%',
        sortable: false
      },
      {
        Id: 3,
        text: 'Risk Rating',
        value: 'RiskRating',
        align: 'end',
        width: '4%',
        sortable: false
      },
      {
        Id: 4,
        text: 'Expense Ratio',
        value: 'ExpenseRatio',
        align: 'end',
        width: '12%',
        sortable: false
      }
    ])
    const investmentLineUpTableHeader = ref([
      {
        hId: 1,
        text: 'Type',
        value: 'Type',
        align: 'start',
        width: '10%',
        sortable: true
      },
      {
        hId: 2,
        text: 'Symbol',
        value: 'Ticker',
        align: 'start',
        width: '10%',
        sortable: true
      },
      {
        hId: 3,
        text: 'Name',
        value: 'Name',
        align: 'start',
        width: '40%',
        sortable: true
      },
      {
        hId: 4,
        text: 'Mgmt.',
        value: 'mgmt',
        align: 'end',
        width: '10%',
        sortable: true
      },
      {
        hId: 5,
        text: '12b-1',
        value: 'tload',
        align: 'end',
        width: '10%',
        sortable: true
      },
      {
        hId: 6,
        text: 'SubTA',
        value: 'SubTA',
        align: 'end',
        width: '10%',
        sortable: true
      },
      {
        hId: 7,
        text: 'Total Fees',
        value: 'expratio',
        align: 'end',
        width: '10%',
        sortable: true
      }
    ])
    const mmlError = ref(false)
    const loader = ref(false)
    const loading = ref(false)
    function callProposalMethod() {
      getProposalID('load')
      getStrategistList()
    }
    function abondonInvestment() {
      selectedGroupId.value = oldSelected.value
      if (modelFund.value) {
        modelFund.value.clearFilter('blur')
        modelFund.value.asset = ''
        modelFund.value.asseterror = false
        modelFund.value.assetMsg = ''
      }
    }
    const onPopUpEvent = (url, data) => {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          $toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    function downloadProspect(reportType, reportTarget, id) {
      loading.value = true
      var uri = `/api/v1/rbc/report/${reportType}/${reportTarget}/${id}`
      if ($store.state.user.reliusLoginId) {
        $axios
          .get(uri)
          .then((response) => {
            onPopUpEvent(
              `/api/v1/rbc/report/download?reportName=${encodeURIComponent(response.data.reportName)}`,
              `${reportType}_${id}`
            )
          })
          .catch(() => {
            $toast?.destroy()
            $toast.error('Report download failed', '')
          })
          .finally(() => {
            loading.value = false
          })
      }
    }
    function saveFundInvestment() {
      if (proposedFund.value) {
        valid.value = proposedFund.value.valid
      }
      eventBus.emit('saveInvestment', true)
    }
    function resetFund() {
      eventBus.emit('resetInvestment', true)
      fundDialog.value = false
    }
    const getStrategistList = async () => {
      if (props.planType) {
        var feePromises = []
        var managedPlanType =
          $store.state.user.selectedProgram.programName === $authz.managedPlan.PA ? $authz.managedPlan.PA : $authz.managedPlan.MML
        feePromises.push(
          $axios.get(`/api/v1/managedplan/strategists?planType=${props.planType}`).then((success) => {
            strategistsList.value = success.data.d !== null ? success.data.d : []
            if (strategistsList.value.length > 0) {
              strategistsList.value.forEach((element) => {
                element.AverageExpRatio = element.AverageExpRatio * 100
              })
              if (
                (props.planType === $authz.planType.Defined_Benefit_Plan ||
                  props.planType === $authz.planType.Cash_Balance_Plan) &&
                managedPlanType === $authz.managedPlan.PA
              ) {
                selectedGroupId.value = strategistsList.value[0].GroupId
                $axios
                  .put(
                    `/api/v1/managedplan/plan/${props.planID}/proposed/strategist/${planProposalID.value}/${selectedGroupId.value}`
                  )
                  .finally(() => {
                    getProposedSilList(true)
                  })
              } else if (props.planType === $authz.planType.Simple_IRA_Plan_Proposal) {
                var strategistData = strategistsList.value.filter((a) => a.Strategist === props.strategist)
                selectedGroupId.value = strategistData && strategistData.length > 0 ? strategistData[0].GroupId : ''
                successLoad.value = true
                oldSelected.value = selectedGroupId.value
              }
            }
          })
        )
        if (props.planType && props.planType !== $authz.planType.Simple_IRA_Plan_Proposal) {
          feePromises.push(getFundsList())
        }
        await Promise.all(feePromises)
      }
    }
    const getProposalPlanID = async () => {
      if (planProposalID.value !== 0 && (proposalPlanId.value === undefined || proposalPlanId.value === 0)) {
        $axios.get(`/api/v1/tal/proposal/id?seinpno=${planProposalID.value}`).then((success) => {
          if (success.data.d !== null) {
            proposalPlanId.value = success.data.d
            var options = {
              proposalPlanID: proposalPlanId.value,
              proposalID: planProposalID.value
            }
            emit('includeOptionSelected', options)
          }
        })
      }
    }
    function getStrategistsModels(props, status) {
      if (status) return
      loader.value = true
      strategistModelList.value = []
      let id = props.GroupId
      $axios
        .get(`/api/v1/managedplan/strategist/${id}/models`)
        .then((success) => {
          if (success.data.d !== null) {
            strategistModelList.value = success.data.d !== null ? success.data.d : []
            if (strategistModelList.value.length > 0) {
              strategistModelList.value.forEach((element) => {
                element.ExpenseRatio = element.ExpenseRatio * 100
              })
            }
          }
        })
        .finally(() => {
          loader.value = false
        })
    }
    function getProposedSilList(isStepper) {
      if (props.planID && props.planID !== 0) {
        $axios
          .get(`/api/v1/managedplan/plan/${props.planID}/proposed/sil`)
          .then((success) => {
            let data = success.data.d !== null && success.data.d.length > 0 ? success.data.d : []
            if (data && data.length > 0) {
              selectedGroupId.value = data[0].GroupId
              if (isStepper) {
                successLoad.value = true
                oldSelected.value = selectedGroupId.value
              }
            } else selectedGroupId.value = ''
          })
          .catch(() => {
            successLoad.value = true
          })
      }
    }
    function getFundsList() {
      $axios.get(`/api/v1/tal/proposal/${props.planID}/funds?forProposal=${true}`).then((success) => {
        if (success.data.d !== null) {
          fundList.value = success.data.d
        }
      })
    }
    function addLoadInvestmentFromFund(listId) {
      $axios
        .put(`/api/v1/managedplan/plan/${props.planID}/proposed/investments/${planProposalID.value}/${listId}`)
        .then((success) => {
          if (success.data.message === null) {
            getProposalPlanInvestments(false)
            $toast?.destroy()
            $toast.success('Fund Investment added and loaded successfully', '')
          }
        })
    }
    const saveProposalHoldings = async () => {
      if (planProposalID.value !== 0) {
        if (selectedGroupId.value !== '' && selectedGroupId.value !== undefined) {
          var strategist = strategistsList.value.filter((a) => a.GroupId === selectedGroupId.value)
          modelFundObject.value.strategistObject = strategist
          modelFundObject.value.investmentObject = investmentLineups.value

          await $axios.put(
            `/api/v1/managedplan/plan/${props.planID}/proposed/strategist/${planProposalID.value}/${selectedGroupId.value}`
          )
        }
        var success = await $axios.put(`/api/v1/tal/proposal/${planProposalID.value}/proposedplanid`)
        if (success.data.d != null) {
          proposalPlanId.value = success.data.d.proposedPlanId
        }
        var options = {
          proposalPlanID: proposalPlanId.value,
          proposalID: planProposalID.value
        }
        emit('includeOptionSelected', options)
        successConfirm.value = true
        oldSelected.value = selectedGroupId.value
        oldSelectedFund.value = investmentLineups.value.slice(0)
      }
    }
    function validateModelFundList() {
      if (props.planType.trim() === $authz.planType.Simple_IRA_Plan_Proposal) return true
      else if (
        (props.planType === $authz.planType.Defined_Benefit_Plan || props.planType === $authz.planType.Cash_Balance_Plan) &&
        $store.state.user.selectedProgram.programName === $authz.managedPlan.PA
      ) {
        if (selectedGroupId.value === null || selectedGroupId.value === '') {
          $toast?.destroy()
          $toast.error('Strategist are required', '')
          return false
        } else return true
      } else if (investmentLineups.value.length === 0 || selectedGroupId.value === null || selectedGroupId.value === '') {
        $toast?.destroy()
        $toast.error('Both Strategist and Investment Line up are required', '')
        return false
      } else return true
    }
    function getProposalPlanInvestments(isStepper) {
      if (props.planID && props.planID !== 0) {
        $axios
          .get(`/api/v1/tal/proposal/${props.planID}/investments`)
          .then((success) => {
            if (success.data.d !== null) {
              investmentLineups.value = success.data.d.length > 0 ? success.data.d : []
              if (investmentLineups.value.length > 0) {
                investmentLineups.value.forEach((element) => {
                  element.mgmt = element.mgmt * 100
                  element.tload = element.tload * 100
                  element.SubTA = element.SubTA * 100
                  element.expratio = element.expratio * 100
                })
                emit('selectedFundList', investmentLineups.value)
              }
            }
            if (isStepper) {
              successLoad.value = true
              oldSelectedFund.value = investmentLineups.value.slice(0)
            }
          })
          .catch(() => {
            successLoad.value = true
          })
      }
    }
    const formatPercent = (val) => {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    }
    function createNewFund() {
      eventBus.emit('resetInvestment', true)
      fundDialog.value = true
      document.getElementById('fundModel').scrollTop = 0
    }
    function getProposalID() {
      var tmp_seinpno = ''
      if (props.reports === 'RPEA' && !props.seinpno) {
        tmp_seinpno = $route.params.id
      } else tmp_seinpno = props.seinpno
      if (!planProposalID.value) {
        $axios.post(`/api/v1/tal/proposal/generateid?seinpno=${tmp_seinpno}`).then((success) => {
          if (success.data.d !== null) {
            planProposalID.value = success.data.d
            getProposalPlanID()
          }
        })
      }
    }
    function compareProposalInvestment() {
      if (
        !Object.is(selectedGroupId.value, oldSelected.value) ||
        !Object.compare(investmentLineups.value, oldSelectedFund.value)
      ) {
        return true
      } else return false
    }
    function showFund() {
      if ($authz.hasRole($authz.roles.SiteAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)) {
        return $authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full)
      } else if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full)
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return $authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full)
      }
    }
    watch(
      () => planProposalID.value,
      async () => {
        if (planProposalID.value !== undefined && planProposalID.value !== 0) {
          getProposalPlanID()
          getProposedSilList(true)
          getProposalPlanInvestments(true)
        }
      }
    )
    watch(
      () => props.planID,
      async () => {
        if (props.planID !== undefined && props.planID !== 0) {
          getProposedSilList(true)
          getProposalPlanInvestments(true)
        }
      }
    )
    watch(
      () => successConfirm.value,
      (val) => {
        if (val) {
          successConfirm.value = false
          emit('modelfundDetails', modelFundObject.value, 'Save')
        }
      }
    )
    watch(
      () => successLoad.value,
      (val) => {
        if (val) {
          var strategist = strategistsList.value.filter((a) => a.GroupId === selectedGroupId.value)
          modelFundObject.value.strategistObject = strategist
          modelFundObject.value.investmentObject = investmentLineups.value
          successLoad.value = false
          emit('modelfundDetails', modelFundObject.value, 'load')
        }
      }
    )
    watch(
      () => props.seinpno,
      () => {
        if (props.reports === 'RPEA') {
          planProposalID.value = 0
          getProposalID('load')
          getStrategistList()
        }
      }
    )
    watch(
      () => props.planType,
      () => {
        if (props.planType && props.planType === $authz.planType.Simple_IRA_Plan_Proposal) {
          getStrategistList()
        }
      }
    )
    watch(
      () => selectedGroupId.value,
      (val) => {
        emit('selectedModelList', val)
      }
    )
    onBeforeUnmount(() => {
      eventBus.off('getFundsList')
    })
    onMounted(() => {
      if (props.reports === 'RPEA' && props.seinpno) {
        planProposalID.value = 0
        getProposalID('load')
        getStrategistList()
      }
      // eslint-disable-next-line no-unused-vars
      eventBus.on('getFundsList', (data) => {
        fundDialog.value = false
        document.getElementById('fundModel').scrollTop = 0
        getFundsList()
      })
      eventBus.on('closeDialog', (data) => {
        fundDialog.value = data
      })
      oldSelected.value = JSON.parse(JSON.stringify(selectedGroupId.value))
    })
    return {
      theme,
      display,
      $authz,
      $store,
      modelFund,
      proposedFund,
      fundDialog,
      loading,
      valid,
      expand,
      mmlError,
      expanded,
      headersList,
      strategistsList,
      selectedGroupId,
      innerHeaderLists,
      strategistModelList,
      proposalPlanId,
      loader,
      fundListModel,
      fundList,
      selectedFund,
      investmentLineUpTableHeader,
      investmentLineups,
      validateModelFundList,
      compareProposalInvestment,
      saveProposalHoldings,
      callProposalMethod,
      abondonInvestment,
      resetFund,
      getStrategistsModels,
      downloadProspect,
      addLoadInvestmentFromFund,
      showFund,
      createNewFund,
      formatPercent,
      saveFundInvestment
    }
  }
}
</script>
