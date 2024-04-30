<template>
  <v-card
    class="elevation-3"
    :height="
      fontSize > 12
        ? isXsOnly
          ? ''
          : '38.462em'
        : fontSize > 10
          ? isXsOnly
            ? ''
            : '44em'
          : fontSize > 8
            ? isXsOnly
              ? ''
              : '53em'
            : fontSize === 8 && isXsOnly
              ? ''
              : '58.500em'
    "
  >
    <v-col v-if="showCompanyInfoLoader" cols="12" lg12 class="ma-0 pa-0">
      <v-progress-linear v-if="showCompanyInfoLoader" indeterminate color="accent" height="4" class="ma-0" />
    </v-col>
    <v-col cols="12" class="pa-5">
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" class="pa-0">
              <h6 class="text-h6 font_20 iconColor">Company Information</h6>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="pa-0" v-if="!showCompanyInfoLoader && !showBusinessMatrixError">
          <v-col v-if="companyInfoList.length > 0" class="pa-0">
            <CompanyInfoWidget :key="componentKey" :companyInfo="companyInfoList" :liveWidth="screenResize" />
          </v-col>
          <v-col v-else class="pa-0">
            <NoDataWidget
              :totalPlan="companyInfoList.length ? companyInfoList.length : 0"
              :displayText="'Companies'"
              :percentValueRequired="0"
              :type="typeDetails"
              :liveWidth="screenResize"
              divId="companyNoDataWidget"
            />
          </v-col>
          <v-col class="pa-0">
            <v-col v-if="companyInfoList.length > 0" class="pb-2 pt-0 pl-0 pr-0">
              <v-col class="pa-0">
                <v-row>
                  <v-col lg="5" class="pr-0 pb-0 pl-0">
                    <v-col class="font-weight-medium text-left pa-0">
                      <b>Plan Type</b>
                    </v-col>
                  </v-col>
                  <v-col lg="3" class="pl-0 pr-0 pb-0">
                    <v-col class="font-weight-medium text-center pa-0">
                      <b># of Accounts</b>
                    </v-col>
                  </v-col>
                  <v-col lg="4" class="pl-0 pb-0 pr-0">
                    <v-col class="font-weight-medium text-right pa-0">
                      <b>Assets</b>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                class="pa-0"
                :class="
                  fontSize > 15
                    ? 'planTypeFlexHeightLargeFonts'
                    : width < 1400 && width > 1250
                      ? 'planTypeFlexHeightMdpi'
                      : fontSize === 10 || fontSize === 15
                        ? 'planTypeFlexFontHeight'
                        : 'planTypeFlexHeight'
                "
              >
                <v-col v-for="(item, i) in companyInformationData" :key="i" class="pa-0">
                  <v-row>
                    <v-col lg="5" class="pb-0 pr-0 pl-0">
                      <v-col class="text-left pa-0">
                        <span class="legendCircle" :style="`background-color:${item.Color}`" />
                        <span class="pl-1 text-hyperlink">{{ item.PlanType }}</span>
                      </v-col>
                    </v-col>
                    <v-col lg="3" class="pb-0 pl-0 pr-0">
                      <v-col class="font-weight-medium text-center pa-0">
                        {{ item.NumberofAccounts ? item.NumberofAccounts : 0 }}
                      </v-col>
                    </v-col>
                    <v-col lg="4" class="pb-0 pl-0 pr-0">
                      <v-col class="font-weight-medium text-right pa-0">
                        {{ formatPrice(item.AssetsManaged ? item.AssetsManaged : 0, 0) }}
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col class="pt-1 pl-0 pr-0 pb-0">
                <v-row>
                  <v-col :class="fontSize > 12 ? 'lg7' : 'lg8'" class="pa-0">
                    <v-col class="font-weight-medium text-left text-hyperlink pa-0">
                      <b>Total</b>
                    </v-col>
                  </v-col>
                  <v-col :class="fontSize > 12 ? 'lg5' : 'lg4'" class="pa-0">
                    <v-col class="font-weight-medium text-right pa-0">
                      <b>{{ formatPrice(totalCompanyAssets ? totalCompanyAssets : 0, 0) }}</b>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-else class="text-center font-weight-medium pt-12 pb-12 mt-4 mb-4 pl-8 pr-8">
              You do not have any plans/accounts. Use lead search to acquire new business.
            </v-col>

            <v-col
              v-if="companyInfoList.length > 0"
              class="text-right"
              :class="[smAndUp ? 'widgetButtonPosition pr-1' : 'pt-4', smOnly ? 'pt-3' : '']"
            >
              <v-btn
                class="mr-0"
                :disabled="companyInfoList ? companyInfoList.length === 0 : ''"
                :class="isXsOnly ? 'mb-0 mr-0' : 'mr-0'"
                color="accent"
                @click="navigateToPage('/Retention/Plans')"
              >
                View Companies
              </v-btn>
            </v-col>
            <v-col
              v-else
              class="text-right"
              :class="[smOnly ? 'pt-6 pb-1 pl-0 pr-0' : smAndUp ? 'widgetButtonPosition pr-1' : 'pt-6 pb-1 pl-0 pr-0']"
            >
              <v-btn class="mr-0" :class="isXsOnly ? 'mb-0 mr-0' : 'mr-0'" color="accent" @click="redirect()">
                Lead Search
              </v-btn>
            </v-col>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>
<script>
import CompanyInfoWidget from '@/components/Home/ClientManagement/CompanyInfoWidget'
import NoDataWidget from '@/components/Home/NoDataWidget'
import qs from 'qs'
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, watchEffect, computed, inject } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  components: {
    CompanyInfoWidget,
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
    const componentKey = ref(0)
    const businessMatrixType = ref(0)
    const companyInfoData = ref([])
    const showCompanyInfoLoader = ref(false)
    const companyInfoError = ref(false)
    const totalCompanyAssets = ref(0)
    const companyInformationData = ref([])
    const number = ref(0)
    const companyInfoList = ref([])
    const typeDetails = ref('Others')
    const isXsOnly = ref(false)
    const smAndUp = ref(false)
    const smOnly = ref(false)
    const width = ref(0)
    const showBusinessMatrixError = ref(false)
    const screenResize = ref(props.liveWidth)
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      smOnly.value = display.sm.value
      smAndUp.value = display.smAndUp.value
      width.value = display.width.value
      screenResize.value = props.liveWidth
    })
    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })
    //mounted
    onMounted(() => {
      loadCompanyData()
      eventBus.on('filterGlobalData', () => {
        loadCompanyInformationData('reload')
      })
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })

    function navigateToPage(value) {
      if (value) {
        router.push(value).catch(() => {})
      }
    }
    function redirect() {
      $store.state.finderList = {}
      router.push('/TAL/Finder/Result').catch(() => {})
    }
    function loadCompanyData() {
      showCompanyInfoLoader.value = true
      companyInfoError.value = false
      if ($store.state.user.reliusLoginId) {
        $store
          .dispatch('getBusinessMatrix')
          .then(() => {
            companyInfoData.value = $store.state.businessMatrix ? $store.state.businessMatrix : []
            companyInfoList.value =
              businessMatrixType.value === 0
                ? companyInfoData.value.planTypeData.length > 0
                  ? companyInfoData.value.planTypeData
                  : []
                : companyInfoData.value.businessTypeData.length > 0
                  ? companyInfoData.value.businessTypeData
                  : []

            companyInfoList.value.forEach((element) => {
              totalCompanyAssets.value = element.AssetsManaged + totalCompanyAssets.value
            })
            for (var a = 0; a < companyInfoList.value.length; a++) {
              if (number.value > 3) number.value = 0
              companyInformationData.value.push({
                PlanType: companyInfoList.value[a].PlanType,
                NumberofAccounts: companyInfoList.value[a].NumberofAccounts,
                AssetsManaged: companyInfoList.value[a].AssetsManaged,
                Color: $store.state.theme.accentColors[number.value]
              })
              number.value++
            }
            showCompanyInfoLoader.value = false
            companyInfoError.value = false
          })
          .catch(() => {
            companyInfoError.value = true
            showCompanyInfoLoader.value = false
            companyInfoData.value = []
          })
      } else {
        companyInfoError.value = false
        showCompanyInfoLoader.value = false
        companyInfoData.value = []
      }
    }
    async function loadCompanyInformationData(val) {
      showCompanyInfoLoader.value = val === 'reload' ? true : false
      showBusinessMatrixError.value = val === 'reload' ? true : false
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
          .get(`/api/v1/rbc/businessMatrix`, {
            params: {
              accountId: accountId,
              advisorContactId: contactId
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' })
            }
          })
          .then((success) => {
            if (success.data.d) {
              companyInfoData.value = success.data.d
              companyInfoList.value =
                businessMatrixType.value === 0
                  ? companyInfoData.value.planTypeData.length > 0
                    ? companyInfoData.value.planTypeData
                    : []
                  : companyInfoData.value.businessTypeData.length > 0
                    ? companyInfoData.value.businessTypeData
                    : []
              companyInfoList.value.forEach((element) => {
                totalCompanyAssets.value = element.AssetsManaged + totalCompanyAssets.value
              })
              for (var a = 0; a < companyInfoList.value.length; a++) {
                if (number.value > 3) number.value = 0
                companyInformationData.value.push({
                  PlanType: companyInfoList.value[a].PlanType,
                  NumberofAccounts: companyInfoList.value[a].NumberofAccounts,
                  AssetsManaged: companyInfoList.value[a].AssetsManaged,
                  Color: $store.state.theme.accentColors[number.value]
                })
                number.value++
              }

              componentKey.value += 1
              showCompanyInfoLoader.value = false
              showBusinessMatrixError.value = false
            }
          })
          .catch(() => {
            companyInfoError.value = true
            companyInfoData.value = []
            showCompanyInfoLoader.value = false
            showBusinessMatrixError.value = false
          })
      } else {
        companyInfoError.value = false
        companyInfoData.value = []
        showCompanyInfoLoader.value = false
        showBusinessMatrixError.value = false
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
      componentKey,
      businessMatrixType,
      companyInfoData,
      showCompanyInfoLoader,
      companyInfoError,
      totalCompanyAssets,
      companyInformationData,
      companyInfoList,
      typeDetails,
      fontSize,
      number,
      isXsOnly,
      width,
      smAndUp,
      smOnly,
      showBusinessMatrixError,
      screenResize,
      navigateToPage,
      redirect,
      loadCompanyInformationData,
      loadCompanyData,
      formatPrice
    }
  }
}
</script>
<style scoped>
.legendCircle {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  padding-right: 3px;
}
.planTypeFlexHeight {
  height: 127px;
  overflow-y: auto;
}
.planTypeFlexFontHeight {
  height: 157px;
  overflow-y: auto;
}
.planTypeFlexHeightMdpi {
  height: 120px;
  overflow-y: auto;
}
.planTypeFlexHeightLargeFonts {
  height: 199px;
  overflow-y: auto;
}
</style>
