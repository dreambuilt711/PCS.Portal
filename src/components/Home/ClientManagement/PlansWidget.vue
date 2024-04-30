<template>
  <v-col class="pa-0">
    <v-col md="12" sm="12" cols="12" lg="12" xl="12" class="pa-0">
      <v-card
        class="elevation-3"
        height="100%"
        :min-height="isXsOnly ? '780px' : '600px'"
        :class="showCompanyInfoLoader ? 'pa-0' : ' pa-5'"
      >
        <v-col v-if="showCompanyInfoLoader" cols="12" lg="12" class="ma-0 pa-0">
          <v-progress-linear v-if="showCompanyInfoLoader" indeterminate color="accent" height="4" class="ma-0" />
        </v-col>
        <v-col v-if="!showCompanyInfoLoader" class="pa-0">
          <v-col class="pb-4 pt-0 pl-0 pr-0">
            <v-row>
              <v-col cols="12" class="pa-0">
                <v-row align="center">
                  <h2 class="font_24">Plans</h2>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="pa-0">
            <v-row>
              <v-col v-if="companyInfoList.length > 0" class="pa-0" cols="12">
                <v-row>
                  <PlanInfoWidget
                    :key="componentKey"
                    :liveWidth="screenResize"
                    :companyInfo="companyInfoList"
                    :totalCompanyAssets="totalCompanyAssets"
                  />
                  <v-col class="pa-0" cols="12" sm="6">
                    <v-col v-for="(item, i) in assetList" :key="i" class="pa-0">
                      <v-row>
                        <v-col col="12" class="pb-0 pr-0 pl-0">
                          <v-col class="text-left pa-0">
                            <v-row>
                              <span class="legendCircle" :style="`background-color:${item.color}`" />
                              <h3 :class="['text-hyperlink', 'text-decoration-none']">
                                {{ `${item.label} (${new Intl.NumberFormat().format(item.count)})` }}
                              </h3>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-else cols="12" class="pa-0">
                <NoDataWidget
                  :liveWidth="screenResize"
                  :totalPlan="companyInfoList.length ? companyInfoList.length : 0"
                  :displayText="'Companies'"
                  :percentValueRequired="0"
                  :type="typeDetails"
                  divId="planInfoNoDataWidget"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="companyInfoList.length > 0" cols="12" class="pb-2 pt-0 pl-0 pr-0">
            <v-col class="pa-0">
              <v-row>
                <v-col lg="6" class="pr-0 pb-0 pl-0">
                  <v-col class="text-left pl-3 pt-0 pr-0 pb-0">
                    <h3 class="font-weight-medium overflowText">Plan Type</h3>
                  </v-col>
                </v-col>
                <v-col lg="4" class="pl-0 pb-0 pr-0">
                  <v-col class="text-left pa-0">
                    <h3 class="font-weight-medium overflowText">
                      <v-icon
                        size="14"
                        color="hyperlink"
                        class="pr-1 cursor-pointer"
                        @click="sortAsset()"
                        :icon="sortDesc ? 'fa:fa fa-arrow-down' : 'fa:fa fa-arrow-up'"
                      >
                      </v-icon
                      >Assets
                    </h3>
                  </v-col>
                </v-col>
                <v-col lg="2" class="pl-0 pr-0 pb-0">
                  <v-col class="text-left pa-0">
                    <h3 class="font-weight-medium overflowText">Participants</h3>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="planTypeFlexHeight pa-0">
              <v-col v-for="(item, i) in companyInformationData" :key="i" class="pa-0">
                <v-row>
                  <v-col lg="6" class="pb-0 pr-0 pl-0">
                    <v-col class="text-left zoomInEffect pl-3 pt-0 pr-0 pb-0">
                      <v-hover v-slot="{ hover }">
                        <h3
                          :class="[
                            'cursor-pointer',
                            'text-hyperlink',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          @click="navigateToCompany(item.PlanType)"
                        >
                          {{ item.PlanType }}
                        </h3>
                      </v-hover>
                    </v-col>
                  </v-col>
                  <v-col lg="4" class="pb-0 pl-0 pr-0">
                    <v-col class="text-left pa-0">
                      <h3 class="text-decoration-none">
                        {{ formatPrice(item.AssetsManaged ? item.AssetsManaged : 0, 0) }}
                      </h3>
                    </v-col>
                  </v-col>
                  <v-col lg="2" class="pb-0 pl-0 pr-0">
                    <v-col class="text-left padding_left_6 pr-0 pt-0 pb-0">
                      <h3 class="text-decoration-none">
                        {{ item.NumberofAccounts ? new Intl.NumberFormat().format(item.NumberofAccounts) : 0 }}
                      </h3>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-col>
          <v-col v-else cols="12" class="text-center font-weight-medium pt-12 pb-12 mt-4 mb-4 pl-8 pr-8">
            You do not have any plans/accounts. Use lead search to acquire new business.
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-row no-gutters>
              <v-col class="justify-start widgetLeftButtonPosition">
                <v-btn
                  v-if="companyInfoList.length > 0"
                  class="ml-0 text-capitalize"
                  :disabled="companyInfoList ? companyInfoList.length === 0 : ''"
                  color="accent"
                  @click="redirect('plan')"
                >
                  View All Plans
                </v-btn>
                <v-btn v-else class="ml-0 text-capitalize" color="accent" @click="redirect('lead')"> Lead Search </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-card>
    </v-col>
  </v-col>
</template>
<script>
import PlanInfoWidget from '@/components/Home/ClientManagement/PlanInfoWidget'
import NoDataWidget from '@/components/Home/NoDataWidget'
import qs from 'qs'
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, watchEffect, computed, inject } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  components: {
    PlanInfoWidget,
    NoDataWidget
  },
  props: ['liveWidth'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const router = useRouter()
    const screenResize = ref(props.liveWidth)
    const sortDesc = ref(true)
    const componentKey = ref(0)
    const businessMatrixType = ref(0)
    const companyInfoData = ref({})
    const showCompanyInfoLoader = ref(false)
    const totalCompanyAssets = ref(0)
    const companyInformationData = ref([])
    const a = ref(0)
    const isXsOnly = ref(false)
    const companyInfoList = ref([])
    const assetList = ref([
      {
        label: '< $500,000',
        count: 0,
        color: $store.state.theme.accentColors[0],
        asset: {
          item1: 0,
          item2: 499999,
          text: ''
        }
      },
      {
        label: '$500,000 - $1M',
        count: 0,
        color: $store.state.theme.accentColors[1],
        asset: {
          item1: 500000,
          item2: 1000000,
          text: ''
        }
      },
      {
        label: '$1M - $3M',
        count: 0,
        color: $store.state.theme.accentColors[2],
        asset: {
          item1: 1000000,
          item2: 3000000,
          text: ''
        }
      },
      {
        label: '$3M - $5M',
        count: 0,
        color: $store.state.theme.accentColors[3],
        asset: {
          item1: 3000000,
          item2: 5000000,
          text: ''
        }
      },
      {
        label: '> $5M',
        count: 0,
        color: '#06425b',
        asset: {
          item1: 5000000,
          item2: 999999999999999,
          text: ''
        }
      }
    ])
    const typeDetails = ref('Others')
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      screenResize.value = props.liveWidth
    })
    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })
    //mounted
    onMounted(() => {
      $store.dispatch('getClientFilterValue')
      loadCompanyData()
      eventBus.on('filterGlobalData', () => {
        loadCompanyInformationData('reload')
      })
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })
    //methods
    function sortAsset() {
      sortDesc.value = !sortDesc.value
      if (sortDesc.value === true) {
        if (companyInformationData.value && companyInformationData.value.length > 0) {
          companyInformationData.value.sort((a, b) => parseFloat(b.AssetsManaged) - parseFloat(a.AssetsManaged))
        }
      } else {
        if (companyInformationData.value && companyInformationData.value.length > 0) {
          companyInformationData.value.sort((a, b) => parseFloat(a.AssetsManaged) - parseFloat(b.AssetsManaged))
        }
      }
    }
    function navigateToCompany(val) {
      if (val) {
        let planObject = [
          {
            PlanType: val,
            selected: true
          }
        ]
        $store.state.clientPlan.filter = {
          empAccountType: planObject
        }
        $store.state.clientPlan.prospectValue = 1
        router.push('/Retention/Plans').catch(() => {})
      }
    }
    function redirect(val) {
      if (val === 'plan') {
        $store.state.clientPlan = {}
        $store.state.clientPlan.prospectValue = 1
        router.push('/Retention/Plans').catch(() => {})
      } else {
        $store.state.finderList = {}
        router.push('/TAL/Finder/Result').catch(() => {})
      }
    }
    function assignCompanyData(val) {
      if (val) {
        companyInfoData.value = val
        companyInfoList.value =
          companyInfoData.value && companyInfoData.value.plansTypeAssets && companyInfoData.value.plansTypeAssets.length > 0
            ? companyInfoData.value.plansTypeAssets
            : []
        totalCompanyAssets.value =
          companyInfoData.value && companyInfoData.value.allPlans && companyInfoData.value.allPlans.length > 0
            ? companyInfoData.value.allPlans[0].AllPlans
            : 0
        if (companyInfoData.value && companyInfoData.value.assetRange && companyInfoData.value.assetRange.length > 0) {
          assetList.value[0].count = companyInfoData.value.assetRange.find((a) => a.AssetRange === '<$500,000').Count
            ? companyInfoData.value.assetRange.find((a) => a.AssetRange === '<$500,000').Count
            : 0
          assetList.value[1].count = companyInfoData.value.assetRange.find((a) => a.AssetRange === '$500,000-$1M').Count
            ? companyInfoData.value.assetRange.find((a) => a.AssetRange === '$500,000-$1M').Count
            : 0
          assetList.value[2].count = companyInfoData.value.assetRange.find((a) => a.AssetRange === '$1M-$3M').Count
            ? companyInfoData.value.assetRange.find((a) => a.AssetRange === '$1M-$3M').Count
            : 0
          assetList.value[3].count = companyInfoData.value.assetRange.find((a) => a.AssetRange === '$3M-$5M').Count
            ? companyInfoData.value.assetRange.find((a) => a.AssetRange === '$3M-$5M').Count
            : 0
          assetList.value[4].count = companyInfoData.value.assetRange.find((a) => a.AssetRange === '>$5M').Count
            ? companyInfoData.value.assetRange.find((a) => a.AssetRange === '>$5M').Count
            : 0
        }
        for (var b = 0; b < companyInfoList.value.length; b++) {
          if (a.value > 3) a.value = 0
          companyInformationData.value.push({
            PlanType: companyInfoList.value[b].PlanType,
            NumberofAccounts: companyInfoList.value[b].Participants ? companyInfoList.value[b].Participants : 0,
            AssetsManaged: companyInfoList.value[b].Assets ? companyInfoList.value[b].Assets : 0,
            Color: $store.state.theme.accentColors[a.value]
          })
          a.value++
        }
        if (companyInformationData.value && companyInformationData.value.length > 0) {
          companyInformationData.value.sort((a, b) => parseFloat(b.AssetsManaged) - parseFloat(a.AssetsManaged))
          sortDesc.value = true
        }
        componentKey.value += 1
      } else {
        showCompanyInfoLoader.value = false
        companyInfoData.value = {}
        companyInfoList.value = []
        companyInformationData.value = []
      }
    }
    function loadCompanyData() {
      showCompanyInfoLoader.value = true
      if ($store.state.user.reliusLoginId) {
        $store
          .dispatch('getPlanWidget')
          .then(() => {
            assignCompanyData($store.state.planWidget)
            showCompanyInfoLoader.value = false
          })
          .catch(() => {
            showCompanyInfoLoader.value = false
            companyInfoList.value = []
            companyInfoData.value = {}
            companyInformationData.value = []
          })
      } else {
        showCompanyInfoLoader.value = false
        companyInfoData.value = {}
        companyInfoList.value = []
        companyInformationData.value = []
      }
    }
    async function loadCompanyInformationData(val) {
      showCompanyInfoLoader.value = val === 'reload' ? true : false
      var contactId = []
      var accountId = []
      if (Object.keys($store.state.globalFilter).length > 0) {
        if ($store.state.globalFilter.firm && $store.state.globalFilter.firm.length > 0) {
          accountId = $store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if ($store.state.globalFilter.advisor && $store.state.globalFilter.advisor.length > 0) {
          contactId = $store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      if ($store.state.user.reliusLoginId) {
        $axios
          .get(`/api/v1/rbc/plan/overview`, {
            params: {
              accountId: accountId,
              advisorContactId: contactId
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' })
            }
          })
          .then((success) => {
            assignCompanyData(success.data.d)
            showCompanyInfoLoader.value = false
          })
          .catch(() => {
            showCompanyInfoLoader.value = false
            companyInfoData.value = {}
            companyInfoList.value = []
            companyInformationData.value = []
          })
      } else {
        showCompanyInfoLoader.value = false
        companyInfoData.value = {}
        companyInfoList.value = []
        companyInformationData.value = []
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
      fontSize,
      isXsOnly,
      sortDesc,
      componentKey,
      businessMatrixType,
      companyInfoData,
      showCompanyInfoLoader,
      totalCompanyAssets,
      companyInformationData,
      a,
      companyInfoList,
      assetList,
      typeDetails,
      screenResize,
      sortAsset,
      navigateToCompany,
      redirect,
      assignCompanyData,
      loadCompanyData,
      loadCompanyInformationData,
      formatPrice
    }
  }
}
</script>
<style scoped>
.widgetSwitchPosition {
  right: 2px;
  top: 50px;
  position: absolute;
}
.planTypeFlexHeight {
  height: 210px;
  overflow-y: auto;
  overflow-x: hidden;
}
.padding_left_6 {
  padding-left: 6px;
}
.zoomInEffect h3 {
  transition: transform 0.3s ease-in-out;
}
.zoomInEffect h3:hover {
  transform: scale(1.1);
}
.legendCircle {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
  padding-right: 3px;
  margin-top: 5px;
  margin-right: 10px;
}
</style>
