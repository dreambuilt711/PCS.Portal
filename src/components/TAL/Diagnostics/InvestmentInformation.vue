<template>
  <v-layout>
    <v-col :class="display.smAndDown.value ? '' : 'mb-2'">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-col>
          <v-col v-show="availableInvestment">
            <v-col v-show="!showInvestmentLineup">
              <v-data-table
                v-model="selected"
                :headers="currentInvestmentHeaders"
                :items="currentInvestmentList"
                item-key="ID"
                hide-default-footer
                class="elevation-0"
                :fixed-header="true"
                loader-height="2"
                :loading="currentLoader"
                :disable-pagination="true"
                :hide-default-header="display.smAndDown.value"
                show-select
                style="backface-visibility: hidden"
                @toggle-select-all="selectAllToggle"
              >
                <template #header="props">
                  <th
                    v-for="header in props.headers"
                    v-show="header.text"
                    :key="header.text"
                    :align="header.align"
                    :width="header.width"
                  >
                    {{ header.text }}
                  </th>
                </template>
                <template #item="{ item, isExpanded, expand, isSelected, select }">
                  <tr v-if="!display.smAndDown.value">
                    <td>
                      <v-checkbox-btn
                        :color="theme.dark ? '' : 'accent'"
                        :value="isSelected"
                        :disabled="item.isAlreadySelected"
                        @input="select($event)"
                      />
                    </td>
                    <td class="text-left">
                      {{ item.Ticker }}
                    </td>
                    <td class="text-left">
                      {{ item.Name }}
                    </td>
                    <td class="text-right">{{ parseFloat(item.mgmt).toFixed(2) }}%</td>
                    <td class="text-right">{{ parseFloat(item.tload).toFixed(2) }}%</td>
                    <td class="text-right">{{ parseFloat(item.SubTA).toFixed(2) }}%</td>
                    <td class="text-right">{{ parseFloat(item.expratio).toFixed(2) }}%</td>
                    <template v-if="currentInvestmentEditFees == false">
                      <td class="text-right">{{ formatDecimal(item.AMC) }}%</td>
                      <td class="text-right">{{ formatDecimal(item.SSF) }}%</td>
                    </template>
                    <template v-else>
                      <td class="pr-2 pl-2 pt-1 pb-1">
                        <v-text-field
                          v-model.lazy="item.AMC"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          suffix="%"
                          class="pa-0 text-right"
                          hide-details
                          variant="outlined"
                          density="compact"
                          @change="formatAMCFees(item)"
                        />
                      </td>
                      <td class="pr-2 pl-2 pt-1 pb-1">
                        <v-text-field
                          v-model.lazy="item.SSF"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          suffix="%"
                          class="pa-0 text-right"
                          hide-details
                          variant="outlined"
                          density="compact"
                          @change="formatSSFFees(item)"
                        />
                      </td>
                    </template>
                    <td class="text-right">{{ parseFloat(item.Total).toFixed(2) }}%</td>
                  </tr>
                  <tr
                    v-else
                    :class="[item.selectedRow == true ? 'selected_row_color' : '', isExpanded ? 'border_bottom_none' : '']"
                    @click="longtap ? longTapFunction(event, item) : ''"
                  >
                    <td class="pr-3 pl-3">
                      <v-touch
                        cols="12"
                        xs="12"
                        @press="
                          (event) => {
                            longTapFunction(event, item)
                          }
                        "
                      >
                        <v-col>
                          <v-row>
                            <v-col cols="10" xs="10">
                              <h5 class="pt-1">
                                <span class="text-grey">Name</span>
                              </h5>
                              <h4 class="text-uppercase">
                                {{ item.Name }}
                              </h4>
                            </v-col>
                            <v-col cols="2" xs="2" class="text-right cursor-pointer">
                              <v-btn v-if="selected.length == 0" icon variant="text" @click="expand(!isExpanded)">
                                <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                              </v-btn>
                              <v-icon v-if="selected.length && item.selectedRow" class="pt-3" color="accent">
                                check_circle
                              </v-icon>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12">
                          <v-row>
                            <v-col cols="10" xs="10">
                              <v-col cols="12" xs="12">
                                <h5 class="text-grey">Symbol</h5>
                              </v-col>
                              <v-col cols="12" xs="12">
                                <h4>{{ item.Ticker }}</h4>
                              </v-col>
                            </v-col>
                            <v-col v-if="item.displayedit" cols="2" xs="2" class="text-right cursor-pointer">
                              <v-btn icon variant="text" @click=";[(item.edit = !item.edit), (props.expanded = true)]">
                                <v-icon v-show="item.edit" size="small" :color="!theme.dark ? 'accent' : ''"> edit </v-icon>
                                <v-icon v-show="!item.edit" size="small" :color="!theme.dark ? 'accent' : ''"> save </v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-touch>
                    </td>
                  </tr>
                </template>
                <template v-if="display.smAndDown.value" #expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-card flat :class="theme.dark ? '' : 'expandable_background'">
                      <v-card-text>
                        <v-row>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12">
                              <h5 class="pl-0 pb-0 text-grey">Mgmt</h5>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <h4>{{ parseFloat(item.mgmt).toFixed(2) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12">
                              <h5 class="pl-0 pb-0 text-grey">12b-1</h5>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <h4>{{ parseFloat(item.tload).toFixed(2) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12">
                              <h5 class="pl-0 pb-0 text-grey">SubTA</h5>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <h4>{{ parseFloat(item.SubTA).toFixed(2) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12">
                              <h5 class="pl-0 pb-0 text-grey">FER</h5>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <h4>{{ parseFloat(item.expratio).toFixed(2) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6" class="pt-1">
                            <v-col cols="12" xs="12">
                              <h5 class="pl-0 pb-0 text-grey">Platform</h5>
                            </v-col>
                            <v-col v-show="item.edit" cols="12" xs="12">
                              <h4>{{ formatDecimal(item.AMC) }}%</h4>
                            </v-col>
                            <v-col v-show="!item.edit" cols="12" xs="12" class="mb-1">
                              <v-col cols="11" xs="11">
                                <v-text-field
                                  v-model.lazy="item.AMC"
                                  v-input-mask="{
                                    alias: 'numeric',
                                    digits: '2',
                                    digitsOptional: true,
                                    rightAlign: false,
                                    placeholder: '',
                                    allowMinus: false
                                  }"
                                  suffix="%"
                                  class="pa-0 text-right"
                                  hide-details
                                  variant="outlined"
                                  density="compact"
                                  @change="formatAMCFees(item)"
                                />
                              </v-col>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6" class="pt-1">
                            <v-col cols="12" xs="12">
                              <h5 class="pl-0 pb-0 text-grey">Advisor</h5>
                            </v-col>
                            <v-col v-show="item.edit" cols="12" xs="12">
                              <h4>{{ formatDecimal(item.SSF) }}%</h4>
                            </v-col>
                            <v-col v-show="!item.edit" cols="12" xs="12" class="mb-1">
                              <v-col cols="11" xs="11">
                                <v-text-field
                                  v-model.lazy="item.SSF"
                                  v-input-mask="{
                                    alias: 'numeric',
                                    digits: '2',
                                    digitsOptional: true,
                                    rightAlign: false,
                                    placeholder: '',
                                    allowMinus: false
                                  }"
                                  suffix="%"
                                  class="pa-0 text-right"
                                  hide-details
                                  variant="outlined"
                                  density="compact"
                                  @change="formatSSFFees(item)"
                                />
                              </v-col>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12">
                              <h5 class="pl-0 pb-0 text-grey">Total</h5>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <h4>{{ parseFloat(item.Total).toFixed(2) }}%</h4>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </td>
                </template>
              </v-data-table>
            </v-col>
          </v-col>
        </v-col>
        <v-col v-show="showInvestmentLineup" :class="display.smAndDown.value ? 'mr-2' : ''">
          <AddInvestment
            ref="investment"
            :reports="reports"
            :investment-list="investmentlist"
            :plan-id="planId"
            :reset-form="false"
            :additional-investment="additionalInvestment"
            :available-investment="availableInvestment"
            :model-i-d="0"
            @get-investment-list="getInvestmentList"
            @update-investment="updateInvestmentCount"
          />
        </v-col>
        <v-col v-show="showInvestmentLineup" cols="12" xs="12" class="mt-3">
          <v-col v-if="reports === 'Diagnostic'">
            <v-col cols="12" xs="12">
              <h2>Diagnostic Report Options</h2>
            </v-col>
            <v-row>
              <v-col cols="6" xs="6">
                <v-switch
                  v-model="implicitCost"
                  color="accent"
                  label="Exclude estimated implicit costs from the Diagnostic"
                  class="offsetSwitch"
                  hide-details
                  :ripple="false"
                />
              </v-col>
              <v-col cols="6" xs="6">
                <v-switch
                  v-model="finra"
                  color="accent"
                  label="Include FINRA response letter at end of Report"
                  class="offsetSwitch"
                  hide-details
                  :ripple="false"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-form>
    </v-col>
  </v-layout>
</template>
<script>
import { ref, getCurrentInstance, watch } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import AddInvestment from '@/components/TAL/AddInvestment'
export default {
  components: {
    AddInvestment
  },
  props: ['planId', 'reports', 'investmentDetails', 'availableInvestment', 'provider'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $toast = instance.appContext.config.globalProperties.$toast
    const $store = instance.appContext.config.globalProperties.$store
    const asset = ref('')
    const assetlist = ref([])
    const investmentlist = ref([])
    const currentInvestmentDisableSort = ref(true)
    const headers = ref([
      {
        title: '',
        value: 'ID',
        sortable: false,
        align: 'center',
        width: '10px'
      },
      {
        title: 'Symbol',
        value: 'Ticker',
        sortable: true,
        align: 'left',
        width: '60px'
      },
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'left',
        width: '150px'
      },
      {
        title: 'Mgmt',
        value: 'mgmt',
        sortable: true,
        width: '65px',
        align: 'right'
      },
      {
        title: '12b-1',
        value: 'tload',
        sortable: true,
        width: '65px',
        align: 'right'
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        sortable: true,
        width: '65px',
        align: 'right'
      },
      {
        title: 'FER',
        value: 'expratio',
        sortable: true,
        width: '65px',
        align: 'right'
      },
      {
        title: 'Platform',
        value: 'AMC',
        sortable: true,
        width: '65px',
        align: 'right'
      },
      {
        title: 'Offset',
        value: 'amcOffset',
        sortable: false,
        width: '25px',
        align: 'center'
      },
      {
        title: 'Advisor',
        value: 'SSF',
        sortable: true,
        width: '65px',
        align: 'right'
      },
      {
        title: 'Offset',
        value: 'ssfOffset',
        sortable: false,
        width: '25px',
        align: 'center'
      },
      {
        title: 'Total Fees',
        value: 'Total',
        sortable: true,
        width: '65px',
        align: 'right'
      }
    ])
    const selected = ref([])
    const disableSort = ref(true)
    const editFees = ref(false)
    const currentInvestment = ref(false)
    const additionalInvestment = ref(true)
    const currentInvestmentList = ref([])
    const currentInvestmentEditFees = ref(false)
    const currentInvestmentHeaders = ref([
      {
        title: 'Symbol',
        value: 'Ticker',
        sortable: true,
        align: 'start',
        width: '60px'
      },
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '200px'
      },
      {
        title: 'Mgmt',
        value: 'mgmt',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: '12b-1',
        value: 'tload',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'FER',
        value: 'expratio',
        sortable: true,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Platform',
        value: 'AMC',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Advisor',
        value: 'SSF',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Total Fees',
        value: 'Total',
        sortable: true,
        width: '65px',
        align: 'end'
      }
    ])
    const currentLoader = ref(true)
    const investmentType = ref('Asset')
    const valid = ref(false)
    const longtap = ref(false)
    const totalCurrentMgmt = ref(0)
    const totalCurrentLoad = ref(0)
    const totalCurrentSubta = ref(0)
    const totalCurrentExpratio = ref(0)
    const totalCurrentAMC = ref(0)
    const totalCurrentSSF = ref(0)
    const totalCurrentFees = ref(0)
    const totalNewMgmt = ref(0)
    const totalNewLoad = ref(0)
    const totalNewSubta = ref(0)
    const totalNewExpratio = ref(0)
    const totalNewAMC = ref(0)
    const totalNewSSF = ref(0)
    const totalNewFees = ref(0)
    const status = ref('load')
    const oldivestmentList = ref([])
    const implicitCost = ref(false)
    const finra = ref(false)
    const advisorplan = ref({})
    const oldSelectedInvestmentList = ref([])
    const selectVal = ref('Select All')
    const providerName = ref('')
    const platformFee = ref('')
    const advisorFee = ref('')
    const amcOffSet = ref('')
    const ssfOffSet = ref('')
    const showInvestmentLineup = ref(true)
    const investment = ref(null)
    function updateInvestmentCount() {
      emit('selectedInvestmentList', investmentlist.value)
    }
    const formatDecimal = (num) => {
      if (num !== undefined) {
        return parseFloat(num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
      }
    }
    const formatPercent = (val) => {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    }
    const formatAMCFees = (investment) => {
      if (isNaN(Number(investment.AMC.replace(/[^0-9/\\.]/g, '')))) investment.AMC = 0
      if (Number(investment.AMC.replace(/[^0-9/\\.]/g, '')) > 100) {
        $toast?.destroy()
        $toast.error('Value cannot be greater then 100 %', '')
        investment.AMC = 0
        return
      }
      var AMCfee
      if (investment.AMC.toString().indexOf('.') !== -1) {
        AMCfee = parseFloat(Number(investment.AMC)).toFixed(2)
      } else {
        AMCfee = parseFloat(Math.round(Number(investment.AMC)) / 100).toFixed(2)
      }
      investment.AMC = Number(investment.AMC.replace(/[^0-9/\\.]/g, ''))
      investment.AMC = formatDecimal(AMCfee)
      investment.Total = parseFloat(Number(investment.expratio) + Number(investment.AMC) + Number(investment.SSF)).toFixed(2)
      return investment
    }
    const formatSSFFees = (investment) => {
      if (isNaN(Number(investment.SSF.replace(/[^0-9/\\.]/g, '')))) investment.SSF = 0
      if (Number(investment.SSF.replace(/[^0-9/\\.]/g, '')) > 100) {
        $toast?.destroy()
        $toast.error('Value cannot be greater then 100 %', '')
        investment.SSF = 0
        return
      }
      var SSFfee
      if (investment.SSF.toString().indexOf('.') !== -1) {
        SSFfee = parseFloat(Number(investment.SSF)).toFixed(2)
      } else {
        SSFfee = parseFloat(Math.round(Number(investment.SSF)) / 100).toFixed(2)
      }
      investment.SSF = Number(investment.SSF.replace(/[^0-9/\\.]/g, ''))
      investment.SSF = formatDecimal(SSFfee)
      investment.Total = parseFloat(Number(investment.expratio) + Number(investment.AMC) + Number(investment.SSF)).toFixed(2)
      return investment
    }
    const getCurrentInvestmentList = (val) => {
      if (props.planId !== 0) {
        currentInvestmentList.value = []
        var platformList = []
        var strType = ''
        currentLoader.value = true
        $axios
          .get(`/api/v1/plan/${props.planId}`)
          .then((success) => {
            if (success.data.d != null) {
              advisorplan.value = success.data.d
              if (advisorplan.value.platformName) {
                currentLoader.value = true
                $axios
                  .get(
                    `/api/v1/diagnostic/${
                      providerName.value === '' ? advisorplan.value.platformName : providerName.value
                    }/investments`
                  )
                  .then((success) => {
                    if (success.data.d.length > 0) {
                      currentLoader.value = true
                      platformList = success.data.d
                      for (var i = 0; i < success.data.d.length; i++) {
                        strType = platformList[i].Type
                        switch (strType) {
                          case 'Mutual Fund':
                            platformList[i].Type = 'Open'
                            break
                          case 'Annuity':
                            platformList[i].Type = 'VA'
                            break
                          default:
                            break
                        }
                        platformList[i].mgmt = platformList[i].mgmt * 100
                        platformList[i].tload = platformList[i].tload * 100
                        platformList[i].SubTA = platformList[i].SubTA * 100
                        platformList[i].expratio = platformList[i].expratio * 100
                        var amcVal = advisorplan.value.amcFee
                        var ssfVal = advisorplan.value.ssfFee
                        if (amcVal > 0) {
                          if (advisorplan.value.amcOffset === true) {
                            amcVal = Number(amcVal) - Number(platformList[i].tload) - Number(platformList[i].SubTA)
                            if (amcVal < 0) amcVal = 0
                          }
                          platformList[i].AMC = formatDecimal(amcVal)
                        }
                        if (ssfVal > 0) {
                          if (advisorplan.value.ssfOffset === true) {
                            ssfVal = Number(ssfVal) - Number(platformList[i].tload) - Number(platformList[i].SubTA)
                            if (ssfVal < 0) ssfVal = 0
                          }
                          platformList[i].SSF = formatDecimal(ssfVal)
                        }
                        platformList[i].Total = parseFloat(
                          Number(platformList[i].expratio) + Number(platformList[i].AMC) + Number(platformList[i].SSF)
                        ).toFixed(2)
                        platformList[i].oldAMC = platformList[i].AMC
                        platformList[i].oldSSF = platformList[i].SSF
                        platformList[i].edit = true
                        platformList[i].displayedit = true
                        platformList[i].Code = platformList[i].code
                        platformList[i].Taxable = false
                      }
                      currentInvestmentList.value = platformList
                      currentInvestment.value = true
                      currentLoader.value = false
                      if (val === 'load') {
                        oldSelectedInvestmentList.value = selected.value.slice(0)
                      }
                    } else currentLoader.value = false
                  })
                  .catch(() => {
                    currentLoader.value = false
                  })
              } else currentLoader.value = false
            }
          })
          .catch(() => {
            currentLoader.value = false
          })
      }
    }
    const getInvestmentList = (val) => {
      if (props.planId !== 0) {
        currentInvestment.value = false
        var savedInvestmentList = []
        investmentlist.value = []
        var selectedInvestment = []
        var strType = ''
        var sumMgmt = 0
        var sumTload = 0
        var sumSubta = 0
        var sumExpratio = 0
        var sumAMC = 0
        var sumSSF = 0
        var sumTotalFees = 0

        $axios.get(`/api/v1/diagnostic/plan/${props.planId}/investments`).then((success) => {
          if (success.data.d != null) {
            savedInvestmentList = success.data.d.length > 0 ? success.data.d : []
            selectedInvestment = savedInvestmentList
            if (savedInvestmentList.length > 0) {
              for (var i = 0; i < savedInvestmentList.length; i++) {
                savedInvestmentList[i].index = i + 1
                strType = savedInvestmentList[i].Type
                switch (strType) {
                  case 'Mutual Fund':
                    savedInvestmentList[i].Type = 'Open'
                    break
                  case 'Annuity':
                    savedInvestmentList[i].Type = 'VA'
                    break
                  default:
                    break
                }
                savedInvestmentList[i].edit = true
                savedInvestmentList[i].displayedit = false
                savedInvestmentList[i].mgmt = savedInvestmentList[i].mgmt * 100
                savedInvestmentList[i].tload = savedInvestmentList[i].tload * 100
                savedInvestmentList[i].SubTA = savedInvestmentList[i].SubTA * 100
                savedInvestmentList[i].expratio = savedInvestmentList[i].expratio * 100
                savedInvestmentList[i].AMC = savedInvestmentList[i].AMC * 100
                savedInvestmentList[i].oldAMC = savedInvestmentList[i].AMC
                savedInvestmentList[i].amcOffset = false
                savedInvestmentList[i].disableAMCOffset = false
                savedInvestmentList[i].ssfOffset = false
                savedInvestmentList[i].disableSSFOffset = false
                savedInvestmentList[i].SSF = savedInvestmentList[i].SSF * 100
                savedInvestmentList[i].oldSSF = savedInvestmentList[i].SSF
                savedInvestmentList[i].Total = parseFloat(
                  Number(savedInvestmentList[i].expratio) +
                    Number(savedInvestmentList[i].AMC) +
                    Number(savedInvestmentList[i].SSF)
                ).toFixed(2)
                sumMgmt += !(savedInvestmentList[i].mgmt === -999) ? Number(savedInvestmentList[i].mgmt) : Number(0)
                sumTload += !(savedInvestmentList[i].tload === -999) ? Number(savedInvestmentList[i].tload) : Number(0)
                sumSubta += !(savedInvestmentList[i].SubTA === -999) ? Number(savedInvestmentList[i].SubTA) : Number(0)
                sumExpratio += !(savedInvestmentList[i].expratio === -999) ? Number(savedInvestmentList[i].expratio) : Number(0)
                sumAMC += !(savedInvestmentList[i].AMC === -999) ? Number(savedInvestmentList[i].AMC) : Number(0)
                sumSSF += !(savedInvestmentList[i].SSF === -999) ? Number(savedInvestmentList[i].SSF) : Number(0)
                sumTotalFees += !(savedInvestmentList[i].Total === -999) ? Number(savedInvestmentList[i].Total) : Number(0)
              }
              investmentlist.value = savedInvestmentList
              totalNewMgmt.value = parseFloat(Number(sumMgmt) / investmentlist.value.length).toFixed(2)
              totalNewLoad.value = parseFloat(Number(sumTload) / investmentlist.value.length).toFixed(2)
              totalNewSubta.value = parseFloat(Number(sumSubta) / investmentlist.value.length).toFixed(2)
              totalNewExpratio.value = parseFloat(Number(sumExpratio) / investmentlist.value.length).toFixed(2)
              totalNewAMC.value = parseFloat(Number(sumAMC) / investmentlist.value.length).toFixed(2)
              totalNewSSF.value = parseFloat(Number(sumSSF) / investmentlist.value.length).toFixed(2)
              totalNewFees.value = parseFloat(Number(sumTotalFees) / investmentlist.value.length).toFixed(2)
              emit('selectedInvestmentList', savedInvestmentList)
              if (val === 'load') {
                oldivestmentList.value = savedInvestmentList.slice(0)
              }
            }
            if (val === 'load') {
              //slice(0) creates new array identical
              oldivestmentList.value = selectedInvestment.slice(0)
              if (props.investmentDetails !== undefined) {
                props.investmentDetails(selectedInvestment, val)
              } else {
                emit('investmentDetails', selectedInvestment, val)
              }
            }
          } else {
            if (val === 'load') oldivestmentList.value = selectedInvestment.slice(0)
            emit('investmentDetails', selectedInvestment, val)
          }
        })
      }
    }
    function mobileViewSelectAll() {
      selected.value = []
      selected.value = currentInvestmentList.value.slice()
      selected.value.forEach((element) => {
        element['selectedRow'] = true
      })
      selectVal.value = 'Unselect All'
    }
    function mobileViewUnSelectAll() {
      selected.value.forEach((element) => {
        element['selectedRow'] = false
      })
      selected.value = []
      selectVal.value = 'Select All'
    }
    function selectAllToggle() {
      if (selected.value.length !== currentInvestmentList.value.length) {
        selected.value = []
        selected.value = currentInvestmentList.value.slice()
        selected.value.forEach((element) => {
          element['selectedRow'] = true
        })
      } else selected.value = []
    }
    const saveInvestment = async () => {
      if (investmentlist.value.length > 0) {
        oldivestmentList.value = investmentlist.value.slice(0)
        emit('investmentDetails', investmentlist.value, 'Save')
      } else {
        oldivestmentList.value = investmentlist.value.slice(0)
        emit('investmentDetails', investmentlist.value, 'Save')
      }
      if (props.reports === 'Diagnostic') {
        let advisorDetail = {}
        advisorDetail.PlanID = props.planId
        advisorDetail.AdvisorID = $store.state.user.id
        advisorDetail.implicit = implicitCost.value
        advisorDetail.includeCurrent = advisorplan.value.includeCurrent
        await $axios.put(`/api/v1/diagnostic/advisor/modelfund`, advisorDetail)
        var option = {
          implicitCost: implicitCost.value,
          finra: finra.value
        }
        emit('diagnosticImplictCost', option)
      }
    }
    // this function is basically used for select row in mobile view on long tap
    const longTapFunction = (event, data) => {
      longtap.value = true
      var checkSelect = selected.value.find((a) => a.ID === data.ID)
      if (checkSelect == null) {
        data['selectedRow'] = true
        selected.value.push(data)
      } else {
        data['selectedRow'] = false
        selected.value.forEach((element, index) => {
          if (element.ID === data.ID) selected.value.splice(index, 1)
        })
      }
      if (selected.value.length === 0) longtap.value = false
    }
    function compareInvestment() {
      //compare old new object before saving
      if (investmentlist.value.length !== oldivestmentList.value.length) {
        return true
      } else return false
    }
    function removeError() {
      if (investment.value) {
        investment.value.clearFilter('blur')
        investment.value.asset = ''
        investment.value.asseterror = false
        investment.value.assetMsg = ''
      }
    }
    function callInvestmentMode() {
      emit('investmentDetails', investmentlist.value, 'Save')
    }
    function disableAlreadySelectedInvestments() {
      selected.value = []
      currentInvestmentList.value.map((element) => {
        element['isAlreadySelected'] = false
      })
      investmentlist.value.forEach((element) => {
        currentInvestmentList.value.map((item) => {
          if (item.Name.trim() === element.Name.trim()) {
            item['isAlreadySelected'] = true
            selected.value.push(item)
          }
          return item
        })
      })
    }
    function abondonInvestment() {
      if (props.reports === 'Diagnostic') {
        implicitCost.value = advisorplan.value.implicit
        finra.value = false
        if (investment.value) {
          investment.value.clearFilter('blur')
          investment.value.asset = ''
          investment.value.asseterror = false
          investment.value.assetMsg = ''
        }
      }
      if (investmentlist.value.length > 0) {
        oldivestmentList.value = investmentlist.value.slice(0)
        emit('investmentDetails', investmentlist.value, 'Save')
        if (investment.value) {
          investment.value.clearFilter('blur')
          investment.value.asset = ''
          investment.value.asseterror = false
          investment.value.assetMsg = ''
        }
      } else {
        oldivestmentList.value = investmentlist.value.slice(0)
        emit('investmentDetails', investmentlist.value, 'Save')
        if (investment.value) {
          investment.value.clearFilter('blur')
          investment.value.asset = ''
          investment.value.asseterror = false
          investment.value.assetMsg = ''
        }
      }
    }
    watch(
      () => props.planId,
      (val) => {
        if (val) {
          getInvestmentList(status.value)
          getCurrentInvestmentList('load')
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.provider,
      (val) => {
        providerName.value = val
      },
      { immediate: true, deep: true }
    )
    watch(
      () => providerName.value,
      () => {
        showInvestmentLineup.value = false
        getCurrentInvestmentList()
      }
    )
    watch(
      () => additionalInvestment.value,
      (val) => {
        emit('resetValidation', val)
      }
    )
    watch(
      () => props.availableInvestment,
      (val) => {
        if (val) {
          showInvestmentLineup.value = false
          additionalInvestment.value = false
        } else {
          showInvestmentLineup.value = true
          additionalInvestment.value = true
        }
      },
      { deep: true, immediate: true }
    )
    watch(
      () => investmentlist.value,
      () => {
        disableAlreadySelectedInvestments()
      },
      { deep: true, immediate: true }
    )
    watch(
      () => currentInvestmentList.value,
      () => {
        disableAlreadySelectedInvestments()
      },
      { deep: true, immediate: true }
    )
    watch(
      () => selected.value,
      (val) => {
        emit('selectedCurrentInvestment', val)
      }
    )
    return {
      theme,
      display,
      investment,
      valid,
      showInvestmentLineup,
      selected,
      currentInvestmentHeaders,
      currentInvestmentList,
      currentLoader,
      longtap,
      headers,
      investmentlist,
      additionalInvestment,
      implicitCost,
      finra,
      asset,
      assetlist,
      currentInvestmentDisableSort,
      disableSort,
      editFees,
      currentInvestmentEditFees,
      totalCurrentMgmt,
      totalCurrentLoad,
      totalCurrentSubta,
      totalCurrentExpratio,
      totalCurrentAMC,
      totalCurrentSSF,
      totalCurrentFees,
      platformFee,
      advisorFee,
      amcOffSet,
      ssfOffSet,
      investmentType,
      saveInvestment,
      compareInvestment,
      removeError,
      callInvestmentMode,
      abondonInvestment,
      formatPercent,
      mobileViewSelectAll,
      mobileViewUnSelectAll,
      selectAllToggle,
      parseFloat,
      formatDecimal,
      formatAMCFees,
      formatSSFFees,
      longTapFunction,
      getInvestmentList,
      updateInvestmentCount,
      getCurrentInvestmentList
    }
  }
}
</script>
