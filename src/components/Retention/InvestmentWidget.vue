<template>
  <v-col cols="12" class="pa-0">
    <loader v-model="loading" :loading="loading" />
    <v-progress-linear v-if="showLoader" indeterminate color="accent" height="4" class="ma-0" />
    <v-card
      class="elevation-6 pl-4 pb-3 pr-4 pt-3"
      :class="[
        fontSize > 14 && !isXsOnly ? 'chart_height_largeFont' : '',
        !isXsOnly && fontSize <= 14 ? 'investment_chart_height' : '',
        isXsOnly && (modelList.length === 0 || fundList.length === 0) && showLoader ? 'rbcchart_height' : ''
      ]"
    >
      <v-col cols="12" class="pa-0">
        <v-row>
          <v-col
            v-if="!showLoader && (modelList.length > 0 || fundList.length > 0) && isEmpSponsorCheck"
            class="pa-0"
            cols="9"
            sm="8"
          >
            <v-row>
              <h2 class="font-weight-medium mr-4">Investments</h2>
              <v-btn-toggle v-model="toggleWidget" mandatory rounded="xl" density="compact" class="toggleCSS elevation-0">
                <v-btn variant="text" value="Models" :ripple="false"> Models </v-btn>
                <v-btn variant="text" value="Funds" :ripple="false"> Funds </v-btn>
              </v-btn-toggle>
            </v-row>
          </v-col>
          <v-col
            v-if="!showLoader && (modelList.length > 0 || fundList.length > 0) && isEmpSponsorCheck"
            class="align-self text-right pa-0"
            :class="isXsOnly ? 'mt-2' : ''"
            cols="3"
            sm="4"
          >
            <a
              v-if="$authz.hasPermission($authz.permissionSet.Clients_Export_Option__c, $authz.permission.Full)"
              class="text-uppercase text-decoration-none pr-1 font_14 cursor-pointer text-hyperlink"
              @click="exportToExcel()"
              >Export</a
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-row v-show="toggleWidget === 'Models'">
          <v-col cols="12" v-if="(!showLoader && modelList.length === 0) || !isEmpSponsorCheck" class="shortcutflex pa-0">
            <v-col class="imageflex mt-10 pl-3 pr-3" cols="12">
              <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
            </v-col>
            <v-col cols="12" class="text-center mt-4 pt-0">
              <h2 class="font-weight-medium">No Data Available</h2>
            </v-col>
          </v-col>
          <v-col v-show="modelList.length > 0 && isEmpSponsorCheck" cols="12" class="pa-0">
            <v-data-table-virtual
              class="elevation-0 changeTableColor hideBorder"
              :headers="modelHeaders"
              :items="modelList"
              :disable-pagination="true"
              item-key="ModelId"
              :hide-default-footer="true"
              density="compact"
              :fixed-header="true"
              height="400"
              style="backface-visibility: hidden"
            >
              <template #item="props">
                <tr>
                  <td @click="showFund(props.item)">
                    <a class="text-capitalize cursor-pointer text-decoration-none text-hyperlink">{{ props.item.ModelName }}</a>
                  </td>
                  <td class="text-right">
                    {{ formatPrice(props.item.Assets, 2) }}
                  </td>
                </tr>
              </template>
            </v-data-table-virtual>
            <v-dialog v-model="showModelFundDialog" :scrollable="false" max-width="820" content-class="elevation-3">
              <v-card>
                <v-card-title class="pt-3 pb-2 bg-accent">
                  <v-row>
                    <v-col xl="11" lg="11" sm="11" md="11" cols="11" class="pa-0">
                      <h4 class="text-secondary text-uppercase">
                        {{ editModelName }}
                      </h4>
                    </v-col>
                    <v-col xl="1" lg="1" sm="1" md="1" cols="1" class="text-right pa-0">
                      <v-icon color="secondary" @click.stop="closeModelFundDialog" icon="mdi:mdi-window-close"></v-icon>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-col v-if="modelFundList.length > 0" cols="12" class="pa-0">
                    <v-btn
                      variant="text"
                      size="small"
                      class="ma-0 pl-1 pr-1 text-accent"
                      @click="
                        $authz.hasPermission($authz.permissionSet.Model_Fact_Sheets__c, $authz.permission.None)
                          ? ''
                          : downloadProspect('ModelFactSheets', 'Investment', editModelId)
                      "
                    >
                      <v-icon size="small" class="mr-2 iconColor" icon="fa:far fa-file"></v-icon>
                      Download the Model FactSheet
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="pa-0 mt-2 mb-4">
                    <v-data-table-virtual
                      class="elevation-0 changeTableColor fixHeader"
                      :headers="modelFundListHeader"
                      :items="modelFundList"
                      :disable-pagination="true"
                      item-key="assetname"
                      hide-default-footer="true"
                      density="compact"
                      :fixed-header="true"
                      style="backface-visibility: hidden"
                    >
                      <template #item="props">
                        <tr>
                          <td
                            @click="
                              $authz.hasPermission($authz.permissionSet.Fund_Fact_Sheets__c, $authz.permission.None)
                                ? ''
                                : downloadProspect('FundFactSheets', 'Investment', props.item.FundId)
                            "
                          >
                            <a class="text-capitalize text-decoration-none cursor-pointer text-hyperlink"
                              >{{ props.item.FundId }} - {{ props.item.FundName }}</a
                            >
                          </td>
                          <td class="text-right">{{ props.item.Allocation }}%</td>
                          <td class="text-right">
                            {{ formatPrice(props.item.AssetDollar, 2) }}
                          </td>
                          <td class="text-right">{{ props.item.AssetPercent }}%</td>
                        </tr>
                      </template>
                    </v-data-table-virtual>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row v-show="toggleWidget === 'Funds'">
          <v-col cols="12" v-if="(!showLoader && fundList.length === 0) || !isEmpSponsorCheck" class="shortcutflex pa-0">
            <v-col class="imageflex mt-10 pl-3 pr-3">
              <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
            </v-col>
            <v-col cols="12" class="text-center mt-4 pt-0">
              <h2 class="font-weight-medium">No Data Available</h2>
            </v-col>
          </v-col>
          <v-col cols="12" v-show="fundList.length > 0 && isEmpSponsorCheck" class="pa-0">
            <v-data-table-virtual
              class="elevation-0 changeTableColor hideBorder"
              :headers="fundHeaders"
              :items="fundList"
              :disable-pagination="true"
              item-key="FundId"
              :hide-default-footer="true"
              density="compact"
              :fixed-header="true"
              height="400"
              style="backface-visibility: hidden"
            >
              <template #item="props">
                <tr>
                  <td
                    @click="
                      $authz.hasPermission($authz.permissionSet.Fund_Fact_Sheets__c, $authz.permission.None)
                        ? ''
                        : downloadProspect('FundFactSheets', 'Investment', props.item.FundId)
                    "
                  >
                    <a class="text-capitalize text-decoration-none cursor-pointer text-hyperlink"
                      >{{ props.item.FundId }} - {{ props.item.FundName }}</a
                    >
                  </td>
                  <td class="text-right">
                    {{ formatPrice(props.item.Assets, 2) }}
                  </td>
                </tr>
              </template>
            </v-data-table-virtual>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-col>
</template>
<script>
import * as XLSX from 'xlsx'
import Loader from '@/components/Loader'
import { ref, onMounted, getCurrentInstance, inject, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  components: {
    Loader
  },
  props: ['isEmpSponsorCheck', 'isSchoolCheck', 'isMunicipalitiesCheck', 'isIndividualFinderCheck'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const toggleWidget = ref('Models')
    const showModelFundDialog = ref(false)
    const editModelName = ref(null)
    const editModelId = ref(null)
    const modelHeaders = ref([
      {
        title: 'Model Name',
        key: 'ModelName',
        sortable: false,
        width: '60%',
        align: 'start'
      },
      {
        title: 'Assets',
        key: 'Assets',
        sortable: false,
        width: '40%',
        align: 'end'
      }
    ])
    const fundHeaders = ref([
      {
        title: 'Fund Name',
        key: 'FundName',
        align: 'start',
        sortable: false,
        width: '60%'
      },
      {
        title: 'Assets',
        key: 'Assets',
        align: 'end',
        sortable: false,
        width: '40%'
      }
    ])
    const comingSoonImage = ref(require('@/assets/images/win.svg'))
    const fundWithinModel = ref({})
    const modelFundListHeader = ref([
      {
        title: 'Fund Name',
        key: 'FundName',
        align: 'start',
        sortable: false,
        width: '60%'
      },
      {
        title: 'Allocation',
        key: 'Allocation',
        align: 'end',
        sortable: false,
        width: '15%'
      },
      {
        title: 'Asset $',
        key: 'AssetDollar',
        align: 'end',
        sortable: false,
        width: '15%'
      },
      {
        title: 'Asset %',
        key: 'AssetPercent',
        align: 'end',
        sortable: false,
        width: '10%'
      }
    ])
    const loading = ref(false)
    const modelFundList = ref([])
    const showLoader = ref(false)
    const isXsOnly = ref(false)
    const toast = inject('toast')

    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })
    const modelList = computed(() => {
      var modelData = []
      if (Object.keys($store.state.clientInvestments).length > 0) {
        if ($store.state.clientInvestments.d !== null && $store.state.clientInvestments.d.clientsModelsData.length > 0) {
          modelData = $store.state.clientInvestments.d.clientsModelsData
        }
      }
      return modelData
    })
    const fundList = computed(() => {
      var fundData = []
      if (Object.keys($store.state.clientInvestments).length > 0) {
        if ($store.state.clientInvestments.d !== null && $store.state.clientInvestments.d.clientsFunds.length > 0) {
          fundData = $store.state.clientInvestments.d.clientsFunds
        }
      }
      return fundData
    })
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
    })

    //mounted
    onMounted(() => {
      if ($store.state.user.reliusLoginID) {
        eventBus.on('modelLoader', (modelLoader) => {
          showLoader.value = modelLoader
        })
      } else {
        showLoader.value = false
      }
    })
    function exportToExcel() {
      var xlModelHeaders = []
      var xlFundHeaders = []
      var modelResult = []
      var fundResult = []
      var wb = XLSX.utils.book_new()
      if (modelList.value.length > 0) {
        xlModelHeaders = exportData(modelList, 'Models')
        modelResult = XLSX.utils.json_to_sheet(xlModelHeaders)
        XLSX.utils.book_append_sheet(wb, modelResult, 'Models')
      }
      if (fundList.value.length > 0) {
        xlFundHeaders = exportData(fundList, 'Funds')
        fundResult = XLSX.utils.json_to_sheet(xlFundHeaders)
        XLSX.utils.book_append_sheet(wb, fundResult, 'Funds')
      }

      for (var Xrow = 2; Xrow !== xlModelHeaders.length + 2; ++Xrow) {
        /*  currencyConvert(wb, 'D', Xrow, 'Models') */
        currencyConvert(wb, 'C', Xrow, 'Models')
      }
      for (var Yrow = 2; Yrow !== xlFundHeaders.length + 2; ++Yrow) {
        currencyConvert(wb, 'C', Yrow, 'Funds')
      }
      XLSX.writeFile(wb, 'Investments.xlsx')
    }
    function currencyConvert(xlWb, xlColRef, xlRowNum, sheetName) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets[sheetName][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    function percentConvert(xlWb, xlColRef, xlRowNum, sheetName) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets[sheetName][xlColRef + xlRowNum], '0.00%')
    }
    function exportData(assets, type) {
      if (type === 'Models') {
        var xlModelHeaders = assets.value.map((rec) => {
          return {
            'Model ID': rec.ModelId,
            'Model Name': rec.ModelName,
            Assets: parseFloat(rec.Assets)
          }
        })
        return xlModelHeaders
      } else if (type === 'Funds') {
        var xlFundHeaders = assets.value.map((rec) => {
          return {
            'Fund ID': rec.FundId,
            'Fund Name': rec.FundName,
            Assets: parseFloat(rec.Assets)
          }
        })
        return xlFundHeaders
      }
    }
    function showFund(item) {
      if ($store.state.user.reliusLoginId) {
        editModelName.value = item.ModelName
        editModelId.value = item.ModelId
        modelFundList.value = []
        $axios.get(`/api/v1/rbc/clientsmodelinvestments?modelId=${item.ModelId}`).then((success) => {
          if (success.data.d !== null) {
            var fund = success.data.d
            if (fund.length > 0) modelFundList.value = fund
            showModelFundDialog.value = true
          }
        })
      }
    }
    function closeModelFundDialog() {
      showModelFundDialog.value = false
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
            toast.clearAll()
            toast.error('Report download failed', { autoClose: 5000 })
          })
          .finally(() => {
            loading.value = false
          })
      }
    }
    function reloadInvestment() {
      emit('reloadInvestment', true)
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          //$FModal.show({ component: PdfViewer, maxHeight: '98%', width: '98%', clickToClose: false }, { pdfUrl: url })
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    function formatPrice(value, digitValue) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digitValue,
        maximumFractionDigits: digitValue
      })
      return formatter.format(value)
    }

    return {
      toggleWidget,
      modelHeaders,
      fundHeaders,
      comingSoonImage,
      fundWithinModel,
      modelFundListHeader,
      loading,
      modelFundList,
      showLoader,
      fontSize,
      modelList,
      fundList,
      isXsOnly,
      reloadInvestment,
      downloadProspect,
      showFund,
      exportData,
      percentConvert,
      currencyConvert,
      exportToExcel,
      formatPrice,
      showModelFundDialog,
      editModelName,
      closeModelFundDialog,
      editModelId
    }
  }
}
</script>
<style scoped>
.investment_chart_height {
  height: 480px !important;
}
.chart_height_largeFont {
  height: 33em !important;
}
</style>
