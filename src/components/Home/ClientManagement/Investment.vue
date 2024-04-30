<template>
  <v-col class="pa-0" cols="12">
    <v-col md="12" sm="12" cols="12" lg="12" xl="12" class="pa-0">
      <v-card class="elevation-3" height="100%" :min-height="xsOnly ? '580px' : '600px'" :class="showLoader ? 'pa-0' : ' pa-5'">
        <v-col v-if="showLoader" cols="12" lg="12" class="ma-0 pa-0">
          <v-progress-linear v-if="showLoader" indeterminate color="accent" height="4" class="ma-0" />
        </v-col>
        <v-col v-if="!showLoader" cols="12" class="pa-0">
          <v-col class="pb-4 pt-0 pl-0 pr-0">
            <v-row>
              <v-col cols="12" class="pa-0">
                <v-row align="center">
                  <h2 class="font_24">Investments</h2>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-tabs v-model="activeTab" class="notificationMenu" color="accent" height="30px" slider-size="3">
              <v-tab v-for="item in investmentTab" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
              <v-window-item transition="fade-in">
                <v-col cols="12" class="pt-5 pb-0 pl-0 pr-0">
                  <v-row v-if="fundList && fundList.length > 0" class="investHeight">
                    <v-col v-for="(item, index) in fundList" :key="`${item.text}_${index}`" cols="12" class="mb-5 pa-0">
                      <v-row>
                        <v-col cols="7" class="investmentBarClass pa-0">
                          <v-col cols="12" :class="smAndDown ? 'mt-2 pl-2 pb-0 pr-0 pt-0' : 'mt-2 pl-4 pb-0 pr-0 pt-0'">
                            <p class="overflowText mb-0 pb-0">
                              {{ item.Investment }}
                            </p>
                          </v-col>
                        </v-col>
                        <v-col cols="5" class="pa-0">
                          <v-col
                            :cols="
                              index === 0
                                ? 12
                                : index === 1
                                  ? xsOnly
                                    ? 11
                                    : 10
                                  : index === 2
                                    ? xsOnly
                                      ? 10
                                      : 8
                                    : index === 3
                                      ? xsOnly
                                        ? 9
                                        : 7
                                      : index === 4
                                        ? xsOnly
                                          ? 8
                                          : 6
                                        : xsOnly
                                          ? 7
                                          : 5
                            "
                            class="cursor-pointer investmentNumberClass padding-top-10 text-right funnelAll bg-accent"
                            :class="[xsOnly ? 'pr-1 pb-0 pl-0' : 'pr-2 pb-0 pl-0']"
                          >
                            <v-col class="pa-0"> ${{ item.DollarAmount ? formatPrice(item.DollarAmount) : 0 }} </v-col>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row v-else class="pt-15">
                    <v-col cols="12" class="shortcutflex pa-0">
                      <v-col class="imageflex mt-5 pl-3 pr-3 pt-0 pb-0">
                        <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                      </v-col>
                      <v-col cols="12" class="text-center mt-2 mb-4">
                        <h2 class="font-weight-medium">No Data Available</h2>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-window-item>
              <v-window-item transition="fade-in">
                <v-col cols="12" class="pt-5 pb-0 pl-0 pr-0">
                  <v-row v-if="modelList && modelList.length > 0" class="investHeight">
                    <v-col v-for="(item, index) in modelList" :key="`${item.text}_${index}`" cols="12" class="mb-5 pa-0">
                      <v-row>
                        <v-col cols="7" class="investmentBarClass pa-0">
                          <v-col cols="12" :class="smAndDown ? 'mt-2 pl-2 pr-0 pt-0 pb-0' : 'mt-2 pl-4 pr-0 pt-0 pb-0'">
                            <p class="overflowText mb-0 pb-0">
                              {{ item.Investment }}
                            </p>
                          </v-col>
                        </v-col>
                        <v-col cols="5" class="pa-0">
                          <v-col
                            :cols="
                              index === 0
                                ? 12
                                : index === 1
                                  ? $vuetify?.breakpoint?.xs
                                    ? 11
                                    : 10
                                  : index === 2
                                    ? $vuetify?.breakpoint?.xs
                                      ? 10
                                      : 8
                                    : index === 3
                                      ? $vuetify?.breakpoint?.xs
                                        ? 9
                                        : 7
                                      : index === 4
                                        ? $vuetify?.breakpoint?.xs
                                          ? 8
                                          : 6
                                        : $vuetify?.breakpoint?.xs
                                          ? 7
                                          : 5
                            "
                            class="cursor-pointer investmentNumberClass padding-top-10 text-right funnelAll bg-accent"
                            :class="[xsOnly ? 'pr-1 pl-0 pb-0' : 'pr-2 pl-0 pb-0']"
                          >
                            <v-col class="pa-0"> ${{ item.DollarAmount ? formatPrice(item.DollarAmount) : 0 }} </v-col>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row v-else class="pt-15">
                    <v-col cols="12" class="shortcutflex pa-0">
                      <v-col class="imageflex mt-5 pl-3 pr-3 pt-0 pb-0">
                        <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                      </v-col>
                      <v-col cols="12" class="text-center mt-2 mb-4">
                        <h2 class="font-weight-medium">No Data Available</h2>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-window-item>
              <v-window-item transition="fade-in">
                <v-col cols="12" class="pt-5 pb-0 pl-0 pr-0">
                  <v-row v-if="assetList && assetList.length > 0" class="investHeight">
                    <v-col v-for="(item, index) in assetList" :key="`${item.text}_${index}`" cols="12" class="mb-5 pa-0">
                      <v-row>
                        <v-col cols="7" class="investmentBarClass pa-0">
                          <v-col cols="12" :class="smAndDown ? 'mt-2 pl-2 pb-0 pr-0 pt-0' : 'mt-2 pl-4 pb-0 pr-0 pt-0'">
                            <p class="overflowText mb-0 pb-0">
                              {{ item.Investment }}
                            </p>
                          </v-col>
                        </v-col>
                        <v-col cols="5" class="pa-0">
                          <v-col
                            :cols="
                              index === 0
                                ? 12
                                : index === 1
                                  ? $vuetify?.breakpoint?.xs
                                    ? 11
                                    : 10
                                  : index === 2
                                    ? $vuetify?.breakpoint?.xs
                                      ? 10
                                      : 8
                                    : index === 3
                                      ? $vuetify?.breakpoint?.xs
                                        ? 9
                                        : 7
                                      : index === 4
                                        ? $vuetify?.breakpoint?.xs
                                          ? 8
                                          : 6
                                        : $vuetify?.breakpoint?.xs
                                          ? 7
                                          : 5
                            "
                            class="cursor-pointer investmentNumberClass padding-top-10 text-right funnelAll bg-accent"
                            :class="[xsOnly ? 'pr-1 pb-0 pl-0' : 'pr-2 pb-0 pl-0']"
                          >
                            <v-col class="pa-0"> ${{ item.DollarAmount ? formatPrice(item.DollarAmount) : 0 }} </v-col>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row v-else class="pt-15">
                    <v-col cols="12" class="shortcutflex pa-0">
                      <v-col class="imageflex mt-5 pl-3 pr-3 pt-0 pb-0">
                        <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                      </v-col>
                      <v-col cols="12" class="text-center mt-2 mb-4">
                        <h2 class="font-weight-medium">No Data Available</h2>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-window-item>
            </v-window>
          </v-col>
          <v-col v-if="false" cols="12">
            <v-row no-gutters>
              <v-col class="justify-start widgetLeftButtonPosition pa-0">
                <v-btn class="ml-0 text-capitalize" color="accent" @click="navigateToPage('/Retention/Investments')">
                  View Investments
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-card>
    </v-col>
  </v-col>
</template>
<script>
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, inject, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import qs from 'qs'
export default {
  props: ['liveWidth'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const showLoader = ref(false)
    const activeTab = ref(0)
    const fundList = ref([])
    const modelList = ref([])
    const assetList = ref([])
    const comingSoonImage = ref(require('@/assets/images/win.svg'))
    const investmentTab = ref(['Funds', 'Models', 'Assets'])
    const xsOnly = ref(false)
    const smAndDown = ref(false)
    const screenResize = ref(props.liveWidth)
    const router = useRouter()
    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })
    //watch
    watchEffect(() => {
      xsOnly.value = display.xs.value
      smAndDown.value = display.smAndDown.value
      screenResize.value = props.liveWidth
    })
    //mounted
    onMounted(() => {
      loadInvestmentData()
      eventBus.on('filterGlobalData', () => {
        getInvestmentData('reload')
      })
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })
    //method
    function navigateToPage(value) {
      if (value) {
        router.push(value).catch(() => {})
      }
    }
    async function loadInvestmentData() {
      showLoader.value = true
      let promise = []
      if ($store.state.user.reliusLoginId) {
        promise.push(
          $store.dispatch('getInvestmentFundData').then(() => {
            fundList.value = $store.state.fund && $store.state.fund.length > 0 ? $store.state.fund : []
          })
        )
        promise.push(
          $store.dispatch('getInvestmentModelData').then(() => {
            modelList.value = $store.state.model && $store.state.model.length > 0 ? $store.state.model : []
          })
        )
        await Promise.allSettled(promise)
        let investmentData = fundList.value.concat(modelList.value)
        investmentData.sort(function (a, b) {
          return b.DollarAmount - a.DollarAmount
        })
        assetList.value = investmentData && investmentData.length > 0 ? investmentData.slice(0, 6) : []
        showLoader.value = false
      } else {
        showLoader.value = false
        fundList.value = []
        modelList.value = []
        assetList.value = []
      }
    }
    async function getInvestmentData(val) {
      showLoader.value = val === 'reload' ? true : false
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
        let promise = []
        promise.push(
          $axios
            .get(`/api/v1/rbc/participant/Fund/investment`, {
              params: {
                accountId: accountId,
                advisorContactId: contactId
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              }
            })
            .then((success) => {
              fundList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
            })
        )
        promise.push(
          $axios
            .get(`/api/v1/rbc/participant/Model/investment`, {
              params: {
                accountId: accountId,
                advisorContactId: contactId
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              }
            })
            .then((success) => {
              modelList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
            })
        )
        await Promise.allSettled(promise)
        let investmentData = fundList.value.concat(modelList)
        investmentData.sort(function (a, b) {
          return b.DollarAmount - a.DollarAmount
        })
        assetList.value = investmentData && investmentData.length > 0 ? investmentData.slice(0, 6) : []
        showLoader.value = false
      } else {
        showLoader.value = false
        fundList.value = []
        modelList.value = []
        assetList.value = []
      }
    }
    function formatPrice(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
        : // Six Zeroes for Millions
          Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
          : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : Math.abs(Number(labelValue))
    }
    return {
      showLoader,
      activeTab,
      investmentTab,
      fundList,
      modelList,
      assetList,
      comingSoonImage,
      fontSize,
      screenResize,
      loadInvestmentData,
      getInvestmentData,
      navigateToPage,
      formatPrice
    }
  }
}
</script>
<style scoped>
.funnelAll {
  height: 57px !important;
  color: rgb(var(--v-theme-secondary)) !important;
}
.investmentBarClass {
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-color: rgb(var(--v-theme-accent)) !important;
  max-height: 40px;
  border-radius: 8px 0px 0px 8px !important;
}
.investmentNumberClass {
  max-height: 40px;
  border-radius: 0px 8px 8px 0px !important;
}
.investHeight {
  height: 400px !important;
  overflow: scroll;
}
</style>
