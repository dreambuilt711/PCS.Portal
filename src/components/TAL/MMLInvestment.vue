<template>
  <v-col class="advanceFilter pa-0" cols="12" xs="12">
    <v-col class="pa-0">
      <h2 class="pr-2 pb-3 pa-0">Investment Details</h2>
    </v-col>
    <v-form ref="form" v-model="valid">
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" xs="12" class="pa-0">
          <v-row>
            <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
              <v-col class="pa-0">
                <v-text-field
                  v-model="investmentName"
                  label="Name"
                  autocomplete="autofill-off"
                  variant="outlined"
                  density="compact"
                  maxlength="140"
                  :error="modelfunderror"
                  :error-messages="modelMessage"
                  :disabled="investmentEditable"
                  @blur="checkModelName()"
                />
              </v-col>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
              <v-col class="pa-0">
                <v-text-field
                  v-model="description"
                  label="Description"
                  autocomplete="autofill-off"
                  variant="outlined"
                  density="compact"
                  maxlength="140"
                  :disabled="investmentEditable"
                />
              </v-col>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" xl="4" lg="4" md="4" />
      </v-row>
      <v-col>
        <h2 class="mb-3 d-inline-block">Fund List</h2>
        <a
          :class="theme.dark ? 'text-white' : 'text-hyperlink'"
          class="ml-4 text-capitalize text-decoration-none handcursor font_14"
          @click="downloadInvestmentList()"
        >
          <b>Download Complete Lists</b>
        </a>
      </v-col>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" xs="12" class="pa-0">
          <v-row>
            <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12" class="mb-4 pa-0">
              <v-col :xs="display.xs.value ? '12' : '11'">
                <v-select
                  v-model="coreCategoryModel"
                  :items="coreCategory"
                  variant="outlined"
                  density="compact"
                  hide-details
                  autocomplete="autofill-off"
                  class="searchRadiusSelect"
                  label="Core Category"
                  clearable
                  return-object
                  item-title="AssetClassCoreCategory"
                  :disabled="investmentEditable"
                  append-icon="icon-chevron-down"
                  @update:model-value="getData(coreCategoryModel, 1)"
                />
              </v-col>
            </v-col>
            <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12" class="mb-4 pa-0">
              <v-select
                v-model="assetSubClassListModel"
                :items="assetSubClassList"
                variant="outlined"
                density="compact"
                hide-details
                autocomplete="autofill-off"
                class="searchRadiusSelect"
                label="Asset Sub Class"
                clearable
                return-object
                item-title="ERSPeerGroupShortName"
                :disabled="investmentEditable"
                append-icon="icon-chevron-down"
                @update:model-value="getData(assetSubClassListModel, 2)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xl="8" lg="8" md="8" sm="12" xs="12" class="pa-0">
          <v-col class="pa-0">
            <v-select
              v-model="assetListModel"
              :items="assetList"
              variant="outlined"
              density="compact"
              hide-details
              autocomplete="autofill-off"
              class="searchRadiusSelect"
              label="Asset"
              clearable
              return-object
              multiple
              item-title="name"
              :disabled="investmentEditable"
              @update:model-value="getNewInvestmentList(assetListModel)"
            />
          </v-col>
        </v-col>
        <v-col v-if="!investmentEditable" cols="12" xl="4" lg="4" md="4">
          <v-btn :class="[!theme.dark ? 'accent' : '']" size="small" @click="addInvestment()"> Add </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row v-if="popupInvestmentLineups.length > 0" class="pt-3">
      <v-col
        v-if="selected.length > 0 && !investmentEditable"
        class="text-right handcursor"
        :class="theme.dark ? '' : 'text-accent'"
        cols="12"
        xs="12"
      >
        <div>
          <span
            v-if="selected.length && display.mdAndDown.value"
            :class="!theme.dark ? 'text-accent' : ''"
            class="text-decoration pl-1 text-body-1"
            @click="selectVal == 'Select All' ? mobileViewSelectAll() : mobileViewUnSelectAll()"
            >{{ selectVal }} |</span
          >
          <span :class="!display.mdAndDown.value ? 'pr-2 body-1' : 'pl-1 body-1'" @click="dialog = true">
            <b v-if="selected.length === popupInvestmentLineups.length">Delete All</b>
            <b v-else>Delete</b>
          </span>
        </div>
      </v-col>
      <v-col cols="12" lg="12" xl="12" md="12" sm="12" xs="12" class="mb-3">
        <v-data-table
          v-model="selected"
          :headers="investmentLineUpPopupTableHeader"
          :items="popupInvestmentLineups"
          item-key="Name"
          class="elevation-0 fixHeader removePadding"
          show-select
          :single-select="singleSelect"
          hide-default-footer
          :disable-pagination="true"
          :hide-default-header="display.mdAndDown.value"
          :fixed-header="true"
          style="backface-visibility: hidden"
        >
          <template #body="{ items }">
            <tbody v-if="!display.mdAndDown.value">
              <tr v-for="item in items" :key="item.Name">
                <td width="2%" class="pa-1">
                  <v-checkbox
                    v-if="!investmentEditable"
                    v-model="selected"
                    :ripple="false"
                    :value="item"
                    class="ma-0"
                    small
                    hide-details
                    color="accent"
                  />
                </td>
                <td class="text-left pa-1">
                  {{ item.Type }}
                </td>
                <td class="text-left pa-1">
                  {{ item.Ticker }}
                </td>
                <td class="text-left pa-1">
                  {{ item.Name }}
                </td>
                <td class="text-right pa-1">{{ formatPercent(item.mgmt) }}%</td>
                <td class="text-right pa-1">{{ formatPercent(item.tload) }}%</td>
                <td class="text-right pa-1">{{ formatPercent(item.SubTA) }}%</td>
                <td class="text-right pa-1">{{ formatPercent(item.expratio) }}%</td>
              </tr>
              <tr>
                <td />
                <td colspan="7" class="text-left pa-1">
                  <strong>Total Funds: {{ popupInvestmentLineups.length }}</strong>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr
                v-for="item in items"
                :key="item.Name"
                :class="[item.selectedRow == true ? 'selected_row_color' : '']"
                @click="longtap ? longTapFunc(event, item) : ''"
              >
                <td>
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
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="12" xs="12" class="pa-0">
                              <v-col cols="12" xs="12" class="pa-0">
                                <v-checkbox
                                  v-if="!investmentEditable"
                                  v-model="selected"
                                  :value="item"
                                  class="ma-0"
                                  small
                                  hide-details
                                  color="accent"
                                />
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0 pb-2" />
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="6" xs="6">
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5>Type</h5>
                              </v-col>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h4>{{ item.Type }}</h4>
                              </v-col>
                            </v-col>
                            <v-col cols="5" xs="5">
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5>Symbol</h5>
                              </v-col>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h4>{{ item.Ticker }}%</h4>
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0 pb-2" />
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="12" xs="12" class="pa-0">
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5>Name</h5>
                              </v-col>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h4>{{ item.Name }}</h4>
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0 pb-2" />
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="6" xs="6">
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5>Mgmt</h5>
                              </v-col>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h4>{{ formatPercent(item.mgmt) }}%</h4>
                              </v-col>
                            </v-col>
                            <v-col cols="5" xs="5">
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5>12b-1</h5>
                              </v-col>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h4>{{ formatPercent(item.tload) }}%</h4>
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0 pb-2" />
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="6" xs="6">
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5>SubTA</h5>
                              </v-col>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h4>{{ formatPercent(item.SubTA) }}%</h4>
                              </v-col>
                            </v-col>
                            <v-col cols="5" xs="5">
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5>Total Fees</h5>
                              </v-col>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h4>{{ formatPercent(item.expratio) }}%</h4>
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0 pb-2" />
                      </v-row>
                    </v-col>
                  </v-touch>
                </td>
              </tr>
              <tr>
                <td class="pr-3 pl-3">
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-row>
                      <v-col cols="12" xs="12" class="pa-0">
                        <v-row>
                          <v-col cols="12" xs="12" class="pa-0">
                            <h5 class="pt-1">
                              <span class="text-grey">Total Funds</span>
                            </h5>
                            <h4 class="text-uppercase">
                              {{ popupInvestmentLineups.length }}
                            </h4>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="350">
      <ActionPopUp
        confirm-action-text="Delete"
        cancel-action-text="Cancel"
        action-text="Delete Investment"
        :action-message="'Are you sure you want to delete the selected investments from Investment lineup?'"
        @confirm-action="deleteFund()"
        @cancel-action="dialog = false"
      />
    </v-dialog>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance, inject, onMounted, onBeforeUnmount } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import * as XLSX from 'xlsx'
import _ from 'lodash'
import ActionPopUp from '@/components/ActionPopUp'
export default {
  components: {
    ActionPopUp
  },
  setup() {
    const theme = useTheme()
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const $toast = inject('toast')
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const longtap = ref(false)
    const selectVal = ref('Select All')
    const investmentLineUpPopupTableHeader = ref([
      {
        hId: 2,
        text: 'Type',
        value: 'Type',
        align: 'start',
        width: '8%',
        sortable: true
      },
      {
        hId: 3,
        text: 'Symbol',
        value: 'Ticker',
        align: 'start',
        width: '10%',
        sortable: true
      },
      {
        hId: 4,
        text: 'Name',
        value: 'Name',
        align: 'start',
        width: '40%',
        sortable: true
      },
      {
        hId: 5,
        text: 'Mgmt.',
        value: 'mgmt',
        align: 'end',
        width: '10%',
        sortable: true
      },
      {
        hId: 6,
        text: '12b-1',
        value: 'tload',
        align: 'end',
        width: '10%',
        sortable: true
      },
      {
        hId: 7,
        text: 'SubTA',
        value: 'SubTA',
        align: 'end',
        width: '10%',
        sortable: true
      },
      {
        hId: 8,
        text: 'Total Fees',
        value: 'expratio',
        align: 'end',
        width: '10%',
        sortable: true
      }
    ])
    const addToTableTemp = ref({
      data: [],
      assetCategories: []
    })
    const modelfunderror = ref(false)
    const modelMessage = ref('')
    const selected = ref([])
    const coreCategoryModel = ref('')
    const assetSubClassListModel = ref('')
    const tempOtherData = ref({})
    const tempObj = ref({})
    const assetListModel = ref([])
    const investmentName = ref('')
    const description = ref('')
    const popupInvestmentLineups = ref([])
    const coreCategory = ref([])
    const assetSubClassList = ref([])
    const assetList = ref([])
    const valid = ref(false)
    const fundID = ref(0)
    const expand = ref(false)
    const dialog = ref(false)
    const deleteInvestmentIds = ref([])
    const investmentEditable = ref(false)
    const singleSelect = ref(false)
    const formatPercent = (val) => {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    }
    const toggleAll = () => {
      if (selected.value.length) selected.value = []
      else selected.value = popupInvestmentLineups.value.slice()
    }
    const checkModelName = () => {
      if (investmentName.value !== '') {
        modelfunderror.value = false
        modelMessage.value = ''
      } else {
        modelfunderror.value = true
        modelMessage.value = 'Name is required'
      }
    }
    const getCoreCatgoryList = () => {
      $axios.get(`/api/v1/managedplan/program/assetclass/corecategories`).then((success) => {
        coreCategory.value = success.data.d !== null ? success.data.d : []
      })
    }
    const mobileViewSelectAll = () => {
      selected.value = []
      selected.value = popupInvestmentLineups.value.slice()
      selected.value.forEach((element) => {
        element['selectedRow'] = true
      })
      selectVal.value = 'Unselect All'
    }
    const mobileViewUnSelectAll = () => {
      selected.value.forEach((element) => {
        element['selectedRow'] = false
      })
      selected.value = []
      selectVal.value = 'Select All'
    }
    const getAssetSubClass = (category) => {
      if (category) {
        $axios.get(`/api/v1/managedplan/program/assetclass/corecategory/${category}/peergroups`).then((success) => {
          assetSubClassList.value = success.data.d !== null ? success.data.d : []
        })
      }
    }
    const getAssetsList = () => {
      $axios
        .get(
          `/api/v1/managedplan/program/assetclass/corecategory/${tempObj.value.coreCategory}/peergroup/${tempObj.value.peerGrpShortName}`
        )
        .then((success) => {
          if (success.data.d !== null) {
            assetList.value = success.data.d
          }
        })
    }
    // eslint-disable-next-line no-unused-vars
    const getNewInvestmentList = (assets) => {
      tempOtherData.value['assetList'] = assetListModel.value
    }
    const downloadInvestmentList = () => {
      $axios.get(`/api/v1/managedplan/program/investments`).then((success) => {
        if (success.data.d !== null) {
          exportToExcel(success.data.d)
        }
      })
    }
    const getData = (data, val) => {
      if (data) {
        if (val === 1) {
          assetSubClassList.value = []
          tempObj.value['coreCategory'] = data.AssetClassCoreCategory
          getAssetSubClass(data.AssetClassCoreCategory)
        } else if (val === 2) {
          assetList.value = []
          tempObj.value['peerGrpShortName'] = data.ERSPeerGroupShortName
          tempOtherData.value = {}
          tempOtherData.value['assetSubCat'] = assetSubClassListModel.value
          getAssetsList()
        }
      }
    }
    const addInvestment = () => {
      if (coreCategoryModel.value && assetSubClassListModel.value && assetListModel.value.length > 0) {
        let indexC = _.findIndex(addToTableTemp.value.assetCategories, coreCategoryModel.value)
        if (indexC === -1) {
          addToTableTemp.value.assetCategories.push(coreCategoryModel.value)
        }
        addAsset()
      }
    }
    const addAsset = () => {
      let assetValue = assetListModel.value
      let coreType = coreCategoryModel.value.AssetClassCoreCategory ? coreCategoryModel.value.AssetClassCoreCategory : ''
      for (let i = 0; i < assetValue.length; i++) {
        let expratioPercent = assetValue[i].name.split('[').length > 3 ? assetValue[i].name.split('[')[4].replace(']', '') : 0.0
        let expratioVal = 0.0
        if (expratioPercent !== 0.0) {
          expratioVal = expratioPercent.includes('%') ? expratioPercent.replace('%', '') : 0.0
          expratioVal = Number(expratioVal) !== -999 ? expratioVal : 0
        }
        let tload = Number(assetValue[i].value.split('|')[3]) !== -999 ? assetValue[i].value.split('|')[3] : 0
        let subta = Number(assetValue[i].value.split('|')[4]) !== -999 ? assetValue[i].value.split('|')[4] : 0
        let mgmt = Number(expratioVal) - Number(tload) - Number(subta)
        let amcFee = 0.0
        let ssfFee = 0.0
        let isAssetExist = popupInvestmentLineups.value.find((a) => a.Name === assetValue[i].name.split('[')[0])
        if (!isAssetExist) {
          let investment = {
            ID: 0,
            Ticker: assetValue[i].value.split('|')[0],
            Name: assetValue[i].name.split('[')[0],
            mgmt: mgmt,
            tload: tload,
            SubTA: subta,
            expratio: expratioVal,
            AMC: amcFee,
            SSF: ssfFee,
            amcOffset: false,
            ssfOffset: false,
            Total: parseFloat(Number(expratioVal) + Number(0.0) + Number(0.0)).toFixed(2),
            Type: assetValue[i].value.split('|')[1],
            Code: assetValue[i].value.split('|')[2],
            edit: true,
            Amount: 1,
            CoreCategory: coreType
          }
          if (popupInvestmentLineups.value.length === 0) {
            popupInvestmentLineups.value.push(investment)
          } else popupInvestmentLineups.value.unshift(investment)
          popupInvestmentLineups.value.forEach((element, index) => {
            element.index = index + 1
          })
          tempOtherData.value = {}
          coreCategoryModel.value = ''
          assetSubClassListModel.value = ''
          assetListModel.value = ''
          assetSubClassList.value = []
          assetList.value = []
        } else {
          assetListModel.value = ''
        }
      }
    }
    const saveFundInvestment = () => {
      if (investmentName.value === '') {
        modelfunderror.value = true
        modelMessage.value = 'Name is required'
        return
      } else {
        modelfunderror.value = false
        modelMessage.value = ''
      }
      if (addToTableTemp.value.assetCategories.length !== coreCategory.value.length) {
        $toast?.destroy()
        $toast.error(
          'The Investment Lineup must include the assets from each Asset Category: Bond, International Equity, Supplemental, & US Equity',
          ''
        )
        return
      }
      if (fundID.value > 0 && deleteInvestmentIds.value.length > 0) {
        var investmentIdList = deleteInvestmentIds.value.map((a) => a.ID)
        $axios.delete(`/api/v1/tal/fund/${fundID.value}/investments`, {
          data: investmentIdList
        })
      }
      var investList = popupInvestmentLineups.value.map((rec) => {
        return {
          Id: rec.ID === undefined ? 0 : rec.ID,
          Type: rec.Type,
          Ticker: rec.Ticker,
          Name: rec.Name,
          Amount: 1,
          Code: rec.Code,
          Taxable: rec.Taxable === undefined ? false : rec.Taxable,
          CoreCategory: rec.CoreCategory
        }
      })
      var fundInvestment = {
        Id: fundID.value,
        Name: investmentName.value,
        Description: description.value,
        Investments: investList
      }
      $axios.put(`/api/v1/tal/fund`, fundInvestment).then((success) => {
        if (success.data.d != null) {
          resetFund()
          $toast?.destroy()
          $toast.success('Investments Saved Successfully', '')
          eventBus.emit('getFundsList', true)
        }
      })
    }
    const deleteFund = () => {
      deleteInvestmentIds.value = selected.value.filter((a) => a.ID > 0)
      dialog.value = false
      if (selected.value.length === popupInvestmentLineups.value.length) {
        popupInvestmentLineups.value = []
        addToTableTemp.value = {
          assetCategories: []
        }
        assetListModel.value = []
        selected.value = []
      } else {
        selected.value.forEach((selectedData) => {
          popupInvestmentLineups.value.forEach((storeData, index) => {
            if (selectedData.Name === storeData.Name) {
              popupInvestmentLineups.value.splice(index, 1)
            }
          })
        })
        if (addToTableTemp.value.assetCategories.length > 0) {
          var tmp_coreCategory = addToTableTemp.value.assetCategories
          for (var i = 0; i < tmp_coreCategory.length; i++) {
            var coreValue = popupInvestmentLineups.value.filter(
              (a) => a.CoreCategory === tmp_coreCategory[i].AssetClassCoreCategory
            )
            if (coreValue.length === 0) {
              var index = addToTableTemp.value.assetCategories.findIndex(
                (a) => a.AssetClassCoreCategory === addToTableTemp.value.assetCategories[i].AssetClassCoreCategory
              )
              if (index > -1) addToTableTemp.value.assetCategories.splice(index, 1)
            }
          }
        }
      }
    }
    const resetFund = () => {
      fundID.value = 0
      investmentName.value = ''
      description.value = ''
      modelfunderror.value = false
      modelMessage.value = ''
      coreCategoryModel.value = ''
      assetSubClassListModel.value = ''
      assetListModel.value = []
      popupInvestmentLineups.value = []
      assetList.value = []
      assetSubClassList.value = []
      addToTableTemp.value = {
        assetCategories: []
      }
      deleteInvestmentIds.value = []
    }
    const ExportPlan = (investment) => {
      var xlHeaders = investment.map((rec) => {
        return {
          Ticker: rec.ticker,
          SecurityName: rec.securityname,
          'Prospectus Exp Ratio': rec.expratio ? parseFloat(rec.expratio).toFixed(2) : 0,
          'Gross Exp Ratio': rec.grossexp ? parseFloat(rec.grossexp).toFixed(5) : 0,
          'Audited Exp Ratio': rec.expratio_old ? parseFloat(rec.expratio_old).toFixed(2) : 0,
          '12b-1 Fee': rec.tload ? parseFloat(rec.tload).toFixed(5) : 0,
          Alpha: rec.alpha ? parseFloat(rec.alpha).toFixed(2) : 0,
          Sharpe: rec.sharpratio ? parseFloat(rec.sharpratio).toFixed(2) : 0,
          'Standard Dev 5yr': rec.std5yr ? parseFloat(rec.std5yr).toFixed(2) : 0,
          'Manager Tenure': rec.tenure,
          Beta: rec.beta ? parseFloat(rec.beta).toFixed(2) : 0,
          'R Squared': rec.rsqr ? parseFloat(rec.rsqr).toFixed(2) : 0,
          Turnover: rec.turnover ? parseFloat(rec.turnover).toFixed(2) : 0,
          Assets: rec.asset
        }
      })
      return xlHeaders
    }
    const exportToExcel = (data) => {
      var xlHeaders = []
      var planResult = []
      xlHeaders = ExportPlan(data)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'Investment')
      XLSX.writeFile(wb, 'Investment.xlsx')
    }
    const editMMLFee = (fund) => {
      if (fund.ListID > 0) {
        resetFund()
        $axios.get(`/api/v1/tal/fund/${fund.ListID}`).then((success) => {
          if (success.data.d !== null) {
            popupInvestmentLineups.value = success.data.d
            if (popupInvestmentLineups.value.length > 0) {
              popupInvestmentLineups.value.forEach((element) => {
                element.mgmt = element.mgmt * 100
                element.tload = element.tload * 100
                element.SubTA = element.SubTA * 100
                element.expratio = element.expratio * 100
                element.Total = element.Total * 100
              })

              var assetCategory = success.data.d.map(function (el) {
                if (el.CoreCategory) {
                  return {
                    AssetClassCoreCategory: el.CoreCategory
                  }
                }
              })
              assetCategory = assetCategory.filter(function (el) {
                return el != null
              })
              var distinctCore = _.uniqBy(assetCategory, 'AssetClassCoreCategory')
              addToTableTemp.value.assetCategories = distinctCore.length > 0 ? distinctCore : []
            }
            investmentName.value = fund.Name
            description.value = fund.Description
            fundID.value = fund.ListID
            modelfunderror.value = false
            investmentEditable.value = fund.HideDelete === 0 ? false : true
            singleSelect.value = investmentEditable.value
          }
        })
      }
    }
    const closeFund = () => {
      resetFund()
      eventBus.emit('closeDialog', false)
    }
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
    onMounted(() => {
      eventBus.on('resetInvestment', () => {
        resetFund()
      })
      eventBus.on('editMMLFees', (fund) => {
        editMMLFee(fund)
      })
      // eslint-disable-next-line no-unused-vars
      eventBus.on('saveInvestment', () => {
        saveFundInvestment()
      })
      getCoreCatgoryList()
    })
    onBeforeUnmount(() => {
      eventBus.off('resetInvestment')
      eventBus.off('editMMLFees')
      eventBus.off('saveInvestment')
    })
    return {
      theme,
      display,
      valid,
      expand,
      investmentName,
      modelfunderror,
      modelMessage,
      investmentEditable,
      description,
      coreCategoryModel,
      coreCategory,
      assetSubClassListModel,
      assetSubClassList,
      assetListModel,
      assetList,
      popupInvestmentLineups,
      selected,
      selectVal,
      dialog,
      investmentLineUpPopupTableHeader,
      singleSelect,
      longtap,
      closeFund,
      toggleAll,
      checkModelName,
      downloadInvestmentList,
      getData,
      getNewInvestmentList,
      addInvestment,
      mobileViewSelectAll,
      mobileViewUnSelectAll,
      formatPercent,
      longTapFunction,
      deleteFund
    }
  }
}
</script>
