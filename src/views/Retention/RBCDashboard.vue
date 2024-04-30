<template>
  <v-col class="pa-0">
    <v-col v-if="displayGlobalFilter" id="globalFilter" cols="12" class="fixedFilter pa-0">
      <GlobalFilter @openFilter="openFilter" />
    </v-col>
    <v-container fluid>
      <v-col
        cols="12"
        class="pa-0"
        :class="displayGlobalFilter ? (showFilter ? (isXsOnly ? 'margin_top_290' : 'margin_top_110') : 'margin_top_30') : ''"
      >
        <ClientsOverview
          :userRole="$authz.userRole()"
          @empSponsorCheck="empSponsorCheck"
          @schoolCheck="schoolCheck"
          @muncipaltiesCheck="muncipaltiesCheck"
          @individualsCheck="individualsCheck"
        />
      </v-col>
      <v-row v-resize="onResize">
        <v-col xl="12" lg="12" md="12" cols="12" sm="12" class="pa-2">
          <v-card class="elevation-6" :class="[isXsOnly ? '' : 'chart_height']">
            <v-col v-if="showBusinessLoader" cols="12" lg12 class="ma-0 pa-0">
              <v-progress-linear v-if="showBusinessLoader" indeterminate color="accent" height="4" class="ma-0" />
            </v-col>
            <v-row class="pl-4 pr-4 pt-3 pb-3">
              <v-col cols="12" sm="6" class="pa-0">
                <h2 class="font-weight-medium">Business Matrix</h2>
              </v-col>
              <v-col cols="12" sm="6" class="text-right pa-0 d-flex justify-end">
                <v-col align-self="end" class="pa-0" xl="3" sm="5" cols="8">
                  <v-select
                    v-model="businessMatrixType"
                    :items="businessType"
                    :menu-props="{ zIndex: '1' }"
                    hide-details
                    @update:model-value="loadBusinessMatrix()"
                  />
                </v-col>
              </v-col>
            </v-row>
            <v-col cols="12" sm="12" xl="12" lg="12" md="12" class="pa-0">
              <v-row>
                <v-col
                  v-if="(!showBusinessLoader && businessMatrixList.length === 0) || !isEmpSponsorCheck"
                  cols="12"
                  class="shortcutflex pa-0 mb-6"
                >
                  <v-col class="imageflex mt-10 pl-3 pr-3">
                    <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                  </v-col>
                  <v-col cols="12" class="text-center mt-2 pt-0">
                    <h2 class="font-weight-medium">No Data Available</h2>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" v-if="isEmpSponsorCheck" :class="isXsOnly ? 'pb-3 pt-0 pl-0 pr-0' : 'pa-0'">
              <v-row>
                <v-col
                  v-if="!showBusinessLoader && businessMatrixList.length > 0"
                  xl="3"
                  lg="3"
                  md="4"
                  sm="4"
                  cols="12"
                  :class="isXsOnly ? 'text-center pa-0' : 'pa-0'"
                >
                  <BusinessMatrixWidget
                    :key="componentKey"
                    :liveWidth="mywidth"
                    :businessMatrix="businessMatrixList"
                    :businessMatrixType="businessMatrixType"
                  />
                </v-col>
                <v-col
                  v-if="!showBusinessLoader && businessMatrixList.length > 0"
                  xl="7"
                  lg="7"
                  md="8"
                  sm="8"
                  cols="12"
                  :class="smAndDown ? 'mb-4 pa-0' : 'pa-0'"
                >
                  <v-data-table-virtual
                    class="elevation-0 changeTableColor hideBorder"
                    :headers="businessMatrixHeader"
                    :items="businessMatrixList"
                    :disable-pagination="true"
                    item-key="FundId"
                    hide-default-footer
                    density="compact"
                    :fixed-header="true"
                    height="330"
                  >
                    <template #item="props">
                      <tr>
                        <td>
                          {{ businessMatrixType === 0 ? props.item.PlanType : props.item.BusinessType }}
                        </td>
                        <td class="text-right">
                          {{ props.item.NumberofAccounts }}
                        </td>
                        <td class="text-right" v-if="!isXsOnly">
                          {{ props.item.PercentageAssets != null ? props.item.PercentageAssets : 0 }}%
                        </td>
                        <td class="text-right">
                          {{ formatPrice(props.item.AssetsManaged, 2) }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table-virtual>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
        <v-col xl="6" lg="6" sm="12" md="12" cols="12" class="pa-2">
          <v-card
            class="elevation-6"
            :class="[
              isXsOnly ? '' : 'chart_height',
              isXsOnly && participant.length === 0 && showLoader ? 'chart_height' : '',
              fontSize >= 14 && !isXsOnly && !isXlOnly ? 'chart_height_largeFont' : ''
            ]"
          >
            <v-col v-if="showLoader" cols="12" lg="12" class="ma-0 pa-0">
              <v-progress-linear indeterminate color="accent" class="ma-0 pa-0" height="4" />
            </v-col>
            <v-row class="pl-4 pr-4 pt-3 pb-3">
              <v-col cols="12" xl="8" lg="7" md="8" sm="8" class="pa-0">
                <h2 class="font-weight-medium">Participation Rate</h2>
              </v-col>
              <v-col cols="12" xl="4" lg="5" md="4" sm="4" class="text-right pa-0 d-flex justify-end">
                <v-col align-self="end" class="pa-0" xl="10" lg="12" md="12" sm="12" cols="8">
                  <v-select
                    v-model="participantType"
                    :items="partcipantListType"
                    :menu-props="{ zIndex: '1' }"
                    hide-details
                    @update:model-value="getParticipantData()"
                  />
                </v-col>
              </v-col>
            </v-row>
            <v-col cols="12" class="pa-0">
              <v-row>
                <v-col
                  v-if="(!showLoader && participant.length === 0) || !isEmpSponsorCheck"
                  cols="12"
                  class="shortcutflex pa-0 mb-6"
                >
                  <v-col class="imageflex mt-5 pl-3 pr-3 pt-0 pb-0">
                    <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                  </v-col>
                  <v-col cols="12" class="text-center mt-2 pa-0">
                    <h2 class="font-weight-medium">No Data Available</h2>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-row>
                <v-col
                  xl="6"
                  lg="7"
                  md="7"
                  sm="7"
                  cols="12"
                  :class="isXsOnly ? 'text-center pt-2 pb-0 pl-0 pr-0' : 'pt-2 pb-0 pl-0 pr-0'"
                >
                  <v-col v-if="!showLoader && participant.length > 0 && isEmpSponsorCheck" class="pa-0">
                    <Participant
                      v-if="participant.length > 0"
                      :key="componentKey"
                      :liveWidth="mywidth"
                      :participant="participant"
                    />
                  </v-col>
                </v-col>
                <v-col
                  v-if="!showLoader && participant.length > 0 && isEmpSponsorCheck"
                  xl="6"
                  lg="5"
                  md="5"
                  sm="5"
                  cols="12"
                  :class="isXsOnly ? 'text-center pt-2 pb-0 pl-0 pr-0' : 'pt-2 pb-0 pl-0 pr-0'"
                >
                  <v-col :class="[fontSize > 14 && isXlOnlyOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-2 pb-0 pl-0 pr-0']">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <h4 v-bind="props" class="text-accent font-weight-medium">Total Participants w/ Balances</h4>
                      </template>
                      <span
                        >This includes participants with an account balance
                        <br />
                        and termed participants with an account balance.</span
                      >
                    </v-tooltip>
                    <h2 class="font-weight-medium">
                      {{ formatNumber(participant[1] ? participant[1].Number : 0, 'decimal', 0) }}
                    </h2>
                  </v-col>
                  <v-col :class="[fontSize > 14 && isXlOnlyOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-2 pb-0 pl-0 pr-0']">
                    <h4 class="text-accent font-weight-medium">Termed Participants w/ Balances</h4>
                    <h2 class="font-weight-medium">
                      {{ formatNumber(participant[2] ? participant[2].Number : 0, 'decimal', 0) }}
                    </h2>
                  </v-col>
                  <v-col
                    :class="[
                      fontSize > 14 && isXlOnlyOnly ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-2 pb-0 pl-0 pr-0',
                      smAndDown ? 'mb-4' : ''
                    ]"
                  >
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <h4 v-bind="props" class="text-accent font-weight-medium">Total Active Participants</h4>
                      </template>
                      <span
                        >This is the total eligible participants in the plan
                        <br />
                        with and without a balance.</span
                      >
                    </v-tooltip>
                    <h2 class="font-weight-medium">
                      {{ formatNumber(participant[3] ? participant[3].Number : 0, 'decimal', 0) }}
                    </h2>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
        <v-col xl="6" lg="6" sm="12" md="12" cols="12" class="pa-2">
          <v-card
            class="elevation-6"
            :class="[
              isXsOnly ? '' : 'chart_height',
              isXsOnly && cashFlowSum.length === 0 && showCashflowLoader ? 'chart_height' : '',
              fontSize >= 14 && !isXsOnly && !isXlOnly ? 'chart_height_largeFont' : ''
            ]"
          >
            <v-col v-if="showCashflowLoader" cols="12" lg="12" class="ma-0 pa-0">
              <v-progress-linear v-if="showCashflowLoader" indeterminate color="accent" height="4" class="ma-0" />
            </v-col>
            <v-row class="pl-4 pr-4 pt-3 pb-3">
              <v-col cols="12" class="pa-0 mb-4">
                <h2 class="font-weight-medium">Cash Flow - YTD</h2>
              </v-col>
            </v-row>
            <v-col
              v-if="(!showCashflowLoader && cashFlowSum.length === 0) || !isEmpSponsorCheck"
              cols="12"
              class="shortcutflex mb-6"
              :class="mdAndUp ? 'pa-0' : 'pl-3 pr-3 pb-3 pt-0'"
            >
              <v-col class="imageflex mt-5 pl-3 pr-3 pt-0 pb-0">
                <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
              </v-col>
              <v-col cols="12" :class="mdAndUp ? 'mt-2 text-center pa-0' : 'mb-4 text-center pa-0'">
                <h2 class="font-weight-medium">No Data Available</h2>
              </v-col>
            </v-col>
            <v-col v-if="!showCashflowLoader && cashFlowSum.length > 0 && isEmpSponsorCheck" class="pa-0">
              <v-row>
                <v-col xl="6" lg="7" md="7" sm="7" cols="12" :class="isXsOnly ? 'text-center pt-2 pb-0 pl-0 pr-0' : 'pa-0'">
                  <Cashflow v-if="cashFlowSum.length > 0" :key="componentKey" :liveWidth="mywidth" :cashFlow="cashFlowSum" />
                </v-col>
                <v-col xl="6" lg="5" md="5" sm="5" cols="12" :class="isXsOnly ? 'text-center pt-2 pb-0 pl-0 pr-0' : 'pa-0'">
                  <v-col class="pt-3 pb-0 pl-0 pr-0">
                    <h4 class="text-accent font-weight-medium">Contributions</h4>
                    <h2 class="font-weight-medium">
                      {{ formatPrice(cashFlowSum[0].Amount ? cashFlowSum[0].Amount : 0, 2) }}
                    </h2>
                  </v-col>
                  <v-col class="pt-3 pb-0 pl-0 pr-0">
                    <h4 class="text-accent font-weight-medium">Rollovers</h4>
                    <h2 class="font-weight-medium">
                      {{
                        (cashFlowSum[1].Amount ? cashFlowSum[1].Amount : 0) > 0
                          ? formatPrice(cashFlowSum[1].Amount ? cashFlowSum[1].Amount : 0, 2)
                          : formatPrice(0, 2)
                      }}
                    </h2>
                  </v-col>
                  <v-col class="pt-3 pb-0 pl-0 pr-0">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <h4 v-bind="props" class="text-accent font-weight-medium">Distributions</h4>
                      </template>
                      <span>Loans are included in distribution calculations.</span>
                    </v-tooltip>
                    <h2 class="font-weight-medium">-{{ formatPrice(cashFlowSum[2].Amount ? cashFlowSum[2].Amount : 0, 2) }}</h2>
                  </v-col>
                  <v-col class="pt-3 pb-0 pl-0 pr-0" :class="mdAndUp ? '' : 'mb-4'">
                    <h4 class="text-accent font-weight-medium">Net</h4>
                    <h2 class="font-weight-medium">
                      {{
                        formatPrice(
                          (isNaN(cashFlowSum[0].Amount + cashFlowSum[1].Amount - cashFlowSum[2].Amount)
                            ? 0
                            : cashFlowSum[0].Amount + cashFlowSum[1].Amount - cashFlowSum[2].Amount
                          ).toFixed(2),
                          2
                        )
                      }}
                    </h2>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
        <v-col xl="6" lg="6" sm="12" md="12" cols="12" class="pa-2">
          <Investment
            :isEmpSponsorCheck="isEmpSponsorCheck"
            :isSchoolCheck="isSchoolCheck"
            :isMunicipalitiesCheck="isMunicipalitiesCheck"
            :isIndividualFinderCheck="isIndividualFinderCheck"
            @reloadInvestment="loadClientInvestments"
          />
        </v-col>
        <v-col v-if="showHoldingOverviewWidget" xl="6" lg="6" md="12" sm="12" cols="12" class="pa-2">
          <v-card
            class="elevation-6"
            :class="[
              isXsOnly ? '' : 'rbcchart_height',
              isXsOnly && assetCategoryList.length === 0 && showHoldingLoader ? 'chart_height' : ''
            ]"
          >
            <v-col v-if="showHoldingLoader" cols="12" lg12 class="ma-0 pa-0">
              <v-progress-linear v-if="showHoldingLoader" indeterminate color="accent" height="4" class="ma-0" />
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-row class="pt-2">
                <h2 class="font-weight-medium ml-3">Holdings Overviews</h2>
                <v-col
                  v-if="!showHoldingLoader && assetCategoryList.length > 0 && isEmpSponsorCheck"
                  class="align-self text-right pa-0"
                  :class="isXsOnly ? 'mt-2' : ''"
                >
                  <a
                    v-if="$authz.hasPermission($authz.permissionSet.Clients_Export_Option__c, $authz.permission.Full)"
                    class="text-uppercase text-decoration-none pr-1 font_14 mr-2 text-hyperlink pa-0"
                    @click="exportToExcel()"
                    >Export</a
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-col
              v-if="(!showHoldingLoader && assetCategoryList.length === 0) || !isEmpSponsorCheck"
              cols="12"
              class="shortcutflex pa-0 mb-6"
            >
              <v-col class="imageflex mt-5 pl-3 pr-3 pt-0 pb-0">
                <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
              </v-col>
              <v-col cols="12" class="text-center mt-4 pa-0">
                <h2 class="font-weight-medium">No Data Available</h2>
              </v-col>
            </v-col>
            <v-col v-if="assetCategoryList.length > 0 && isEmpSponsorCheck && !showHoldingLoader" class="pa-0">
              <v-row>
                <v-col
                  xl="4"
                  lg="4"
                  md="5"
                  sm="5"
                  cols="12"
                  :class="isXsOnly ? 'text-center pt-2 pb-0 pl-0 pr-0' : 'pt-2 pb-0 pl-0 pr-0'"
                >
                  <ClientHoldingOverview
                    v-if="assetCategoryList.length > 0"
                    :key="componentKey"
                    :liveWidth="mywidth"
                    :holdingOverview="assetCategoryList"
                  />
                </v-col>
                <v-col
                  xl="7"
                  lg="8"
                  md="7"
                  sm="7"
                  cols="12"
                  class="pt-2 pb-3 pr-0"
                  :class="[isXsOnly ? 'ml-0' : 'pl-2', isXlOnly ? 'ml-4' : '', isLgOnly ? 'ml-0' : '']"
                >
                  <v-col cols="12" class="pb-2 pt-0 pl-0 pr-0">
                    <v-row>
                      <v-col xl="6" lg="6" md="5" sm="6" xs="6" class="pa-0">
                        <h4
                          class="font-weight-medium"
                          :class="[
                            isXsOnly ? 'ml-3' : '',
                            isLgOnly ? 'ml-4' : '',
                            isMdOnly ? 'ml-4' : '',
                            isSmOnly ? 'ml-n2' : '',
                            isXlOnly ? 'ml-4' : ''
                          ]"
                        >
                          Asset Category
                        </h4>
                      </v-col>
                      <v-col xl="3" lg="3" md="3" sm="3" xs="3" class="pa-0">
                        <h4
                          class="text-right pr-2 font-weight-medium"
                          :class="[
                            isLgOnly ? 'ml-2' : 'pl-0',
                            isXsOnly ? 'ml-n3' : 'pl-0',
                            isMdOnly ? 'mr-3' : 'pl-0',
                            isXlOnly ? 'mr-4' : 'pl-0'
                          ]"
                        >
                          <span v-if="fontSize > 13 && isXsOnly">$ Amt</span>
                          <span v-else>$ Amount</span>
                        </h4>
                      </v-col>
                      <v-col xl="3" lg="3" md="3" sm="3" cols="3" class="pa-0">
                        <h4
                          class="text-right font-weight-medium"
                          :class="[
                            isSmOnly ? 'mr-3' : 'pl-0',
                            isLgOnly ? 'mr-3' : 'pl-0',
                            isXsOnly ? 'mr-3' : 'pl-0',
                            isMdOnly ? 'mr-3' : 'pl-0',
                            isXlOnly ? 'text-right mr-3' : 'pl-0'
                          ]"
                        >
                          <span v-if="fontSize > 13 && isXsOnly">% Amt</span>
                          <span v-else>% Amount</span>
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider />
                  <v-col
                    style="height: 340px !important; overflow-y: auto !important ; padding-right: 5px"
                    class="pt-0 pb-0 pl-0"
                  >
                    <v-col
                      v-for="(item, index) in assetCategoryList"
                      :key="index"
                      :class="index === 0 ? 'pt-1 pb-0 pl-0 pr-0' : 'pt-2 pb-0 pl-0 pr-0'"
                    >
                      <v-row>
                        <v-col xl="6" lg="6" m="6" sm="5" cols="5" class="pa-0">
                          <v-col class="pa-0" cols="12">
                            <v-row>
                              <v-col
                                xl="8"
                                lg="12"
                                md="10"
                                sm="11"
                                cols="12"
                                :class="[
                                  isMdOnly ? 'ml-4 pa-0' : '',
                                  isSmOnly ? 'pl-0 pa-0' : '',
                                  isLgOnly ? 'ml-4 pa-0' : '',
                                  isXsOnly ? 'ml-3 pa-0' : '',
                                  isXlOnly ? 'pl-3 pt-0 pb-0 pr-0' : ''
                                ]"
                              >
                                <v-row>
                                  <v-col cols="2" class="flex_none pa-0">
                                    <div class="circle mt-1" :style="'background-color:' + item.legendColor" />
                                  </v-col>
                                  <v-col cols="10" class="pa-0">
                                    <h4
                                      :class="[
                                        isLgOnly ? 'pl-0' : '',
                                        isXsOnly ? 'ml-0' : 'pl-1',
                                        isXlOnly ? 'pl-2 ' : 'pl-1',
                                        isMdOnly ? 'ml-1' : 'pl-1',
                                        isSmOnly ? 'pl-1' : 'pl-1'
                                      ]"
                                      class="text-left"
                                    >
                                      {{ item.AssetCatagory }}
                                    </h4>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                        <v-col xl="3" lg="3" md="3" sm="4" xs="4" class="text-right pa-0">
                          <h4
                            :class="[
                              isLgOnly ? 'text-right' : 'pl-0',
                              isMdOnly ? 'mr-3' : 'pl-0',
                              isSmOnly ? 'text-right' : 'pl-0',
                              isXlOnly ? 'mr-4' : 'pl-0'
                            ]"
                            class="text-right"
                          >
                            {{ item.Amount ? formatPrice(item.Amount, 2) : 0 }}
                          </h4>
                        </v-col>
                        <v-col xl="3" lg="3" md="3" sm="3" cols="3" class="text-right pa-0">
                          <h4
                            :class="[
                              isLgOnly ? 'ml-4' : 'pl-0',
                              isXlOnly ? 'text-right mr-2' : 'pr-0',
                              isXsOnly ? 'text-right ml-1' : '',
                              isSmOnly ? 'text-right' : '',
                              isMdOnly ? 'text-right pr-1' : '',
                              isSmOnly ? 'mr-1' : ''
                            ]"
                          >
                            {{ item.PercentageAmount ? item.PercentageAmount.toFixed(2) : 0 }}%
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>
<script>
import Cashflow from '@/components/Retention/Cashflow'
import ClientHoldingOverview from '@/components/Retention/ClientHoldingOverview'
import Participant from '@/components/Retention/Participant'
import ClientsOverview from '@/components/Retention/ClientsOverview'
import GlobalFilter from '@/components/GlobalFilter'
import Investment from '@/components/Retention/InvestmentWidget'
import BusinessMatrixWidget from '@/components/Retention/BusinessMatrixWidget'
import qs from 'qs'
import * as XLSX from 'xlsx'
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, inject, watchEffect, computed, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  components: {
    ClientHoldingOverview,
    Participant,
    Cashflow,
    Investment,
    ClientsOverview,
    GlobalFilter,
    BusinessMatrixWidget
  },
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedBrand = inject('selectedBrand')
    const router = useRouter()
    const showFilter = ref(false)
    const showLoader = ref(true)
    const comingSoonImage = ref(require('@/assets/images/win.svg'))
    const businessMatrixHeader = ref([
      {
        title: 'Plan Type',
        value: 'PlanType',
        sortable: false,
        width: '30%',
        align: 'start'
      },
      {
        title: '# of Accounts',
        value: 'noAccounts',
        align: 'end',
        sortable: false,
        width: '20%'
      },
      {
        title: 'Percentage',
        value: 'Percentage',
        align: 'end d-none d-sm-table-cell',
        sortable: false,
        width: '10%'
      },
      {
        title: 'Assets Managed',
        value: 'Participants',
        align: 'end',
        sortable: false,
        width: '10%'
      }
    ])
    const assetCategoryList = ref([])
    const yearValue = ref(0)
    const mywidth = ref(500)
    const participant = ref([])
    const cashFlowSum = ref([])
    const modelsList = ref([])
    const assetCount = ref(0)
    const partcipantListType = ref([
      { title: 'Current', value: 0 },
      { title: 'Last Month', value: 1 },
      { title: '3 Months Ago', value: 2 },
      { title: '6 Months Ago', value: 3 },
      { title: '12 Months Ago', value: 4 }
    ])
    const businessType = ref([
      { title: 'Plan Type', value: 0 },
      { title: 'Business Type', value: 1 }
    ])
    const businessMatrixType = ref(0)
    const participantType = ref(0)
    const assetList = ref([])
    const modelLoader = ref(true)
    const componentKey = ref(0)
    const hideTooltip = ref([])
    const businessMatrix = ref([])
    const showBusinessLoader = ref(false)
    const isEmpSponsorCheck = ref(true)
    const isSchoolCheck = ref(true)
    const isMunicipalitiesCheck = ref(true)
    const isIndividualFinderCheck = ref(true)
    const showHoldingLoader = ref(false)
    const showCashflowLoader = ref(false)
    const businessMatrixList = ref([])
    const showAccountBalanceLoader = ref(true)
    const showHoldingOverviewWidget = ref(false)
    const isXsOnly = ref(false)
    const isXlOnly = ref(false)
    const isLgOnly = ref(false)
    const isMdOnly = ref(false)
    const isSmOnly = ref(false)
    const mdAndUp = ref(false)
    const clientInvestments = ref({})
    const businessMatrixData = ref([])

    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })
    const displayGlobalFilter = computed(() => {
      if (
        $authz.hasRole($authz.roles.SiteAdmin) ||
        $authz.hasRole($authz.roles.ProgramAdmin) ||
        $authz.hasRole($authz.roles.InternalAdmin) ||
        $authz.hasRole($authz.roles.FirmAdmin)
      ) {
        return $store.state.user.selectedProgram.accounts.length > 0
      }
      return false
    })
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
      isXlOnly.value = display.xl.value
      isLgOnly.value = display.lg.value
      isMdOnly.value = display.md.value
      isSmOnly.value = display.sm.value
      mdAndUp.value = display.mdAndUp.value
    })

    //mounted
    onMounted(() => {
      $store.dispatch('getAccountList')
      eventBus.on('filterGlobalData', () => {
        callWidgetApi()
      })
      if (Object.keys($store.state.globalFilter).length === 0) {
        ///Investment
        modelLoader.value = true
        eventBus.emit('modelLoader', modelLoader)
        if ($store.state.user.reliusLoginId) {
          $store
            .dispatch('getClientInvestments')
            .then(() => {
              modelLoader.value = false
              eventBus.emit('modelLoader', modelLoader)
            })
            .catch(() => {
              modelLoader.value = false
              $store.state.clientInvestments = {}
              eventBus.emit('modelLoader', modelLoader)
            })
        } else {
          modelLoader.value = false
          clientInvestments.value = {}
        }

        //HoldingOverview Widget
        if (showHoldingOverviewWidget.value) {
          showHoldingLoader.value = true
          if ($store.state.user.reliusLoginId) {
            $store
              .dispatch('getHoldingsOverview')
              .then(() => {
                var category = $store.state.holdingoverviewChange.length > 0 ? $store.state.holdingoverviewChange : []
                assetCategoryList.value = category
                var holding = assetCategoryList.value.filter((a) => a.PercentageAmount > 0)
                if (holding.length === 0) assetCategoryList.value = []
                showHoldingLoader.value = false
              })
              .catch(() => {
                showHoldingLoader.value = false
                assetCategoryList.value = []
              })
          } else {
            showHoldingLoader.value = false
            assetCategoryList.value = []
          }
        }

        ///Cashflow Widget
        showCashflowLoader.value = true
        if ($store.state.user.reliusLoginId) {
          $store
            .dispatch('getCashFlowData')
            .then(() => {
              cashFlowSum.value = $store.state.cashFlowChange.length > 0 ? $store.state.cashFlowChange : []
              showCashflowLoader.value = false
              var cash = cashFlowSum.value.filter((a) => a.Amount > 0)
              if (cash.length === 0) cashFlowSum.value = []
            })
            .catch(() => {
              showCashflowLoader.value = false
              cashFlowSum.value = []
            })
        } else {
          showCashflowLoader.value = false
          cashFlowSum.value = []
        }
        ///Participant Widget
        showLoader.value = true
        if ($store.state.user.reliusLoginId) {
          $store
            .dispatch('getParticipantsData')
            .then(() => {
              participant.value = $store.state.participantChange
              showLoader.value = false
              var participantVal = participant.value.filter((a) => a.PARTICRATE > 0)
              if (participantVal.length === 0) participant.value = []
            })
            .catch(() => {
              showLoader.value = false
              participant.value = []
            })
        } else {
          showLoader.value = false
          participant.value = []
        }

        ///Business matrix
        showBusinessLoader.value = true
        if ($store.state.user.reliusLoginId) {
          $store
            .dispatch('getBusinessMatrix')
            .then(() => {
              businessMatrixData.value = $store.state.businessMatrix ? $store.state.businessMatrix : []
              businessMatrixList.value =
                businessMatrixType.value === 0
                  ? businessMatrixData.value.planTypeData.length > 0
                    ? businessMatrixData.value.planTypeData
                    : []
                  : businessMatrixData.value.businessTypeData.length > 0
                    ? businessMatrixData.value.businessTypeData
                    : []
              businessMatrixHeader.value[0].title = businessMatrixType.value === 0 ? 'Plan Type' : 'Business Type'
              showBusinessLoader.value = false
            })
            .catch(() => {
              showBusinessLoader.value = false
              businessMatrixData.value = []
            })
        } else {
          showBusinessLoader.value = false
          businessMatrixData.value = []
        }
      } else {
        callWidgetApi()
      }
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('filterGlobalData')
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', scrollHandler)
    })
    window.addEventListener('scroll', scrollHandler)
    //methods
    function callWidgetApi() {
      loadClientInvestments()
      getParticipantData()
      loadCashFlowData()
      if (showHoldingOverviewWidget.value) {
        holdingOverviewData()
      }
      loadBusinessMatrix()
    }
    function exportToExcel() {
      var xlHeaders = []
      var planResult = []

      xlHeaders = ExportPlan(assetCategoryList)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'HoldingOverview')
      for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
        currencyConvert(wb, 'B', Xrow)

        percentConvert(wb, 'C', Xrow)
      }
      XLSX.writeFile(wb, 'HoldingOverview.xlsx')
    }
    function currencyConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['HoldingOverview'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    function percentConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['HoldingOverview'][xlColRef + xlRowNum], '0.0000%')
    }
    function ExportPlan(plans) {
      var xlHeaders = plans.map((rec) => {
        return {
          'Asset Category': rec.AssetCatagory,
          'Amount ($)': rec.Amount,
          'Amount (%)': rec.PercentageAmount / 100
        }
      })
      return xlHeaders
    }
    function holdingOverviewData() {
      showHoldingLoader.value = true
      var accountId = []
      var contactId = []
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
          .get(`/api/v1/rbc/holdingoverview`, {
            params: {
              accountId: accountId,
              advisorContactId: contactId
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' })
            }
          })
          .then((success) => {
            var category = success.data.d
            //var j = 0
            // for (var i = 0; i < category.length; i++) {
            //   category[i].legendColor = holdingColor[j]
            //   if (holdingColor.length - 1 === j) j = 0
            //   else j++
            // }
            assetCategoryList.value = category
            var holding = assetCategoryList.value.filter((a) => a.PercentageAmount > 0)
            if (holding.length === 0) assetCategoryList.value = []
            showHoldingLoader.value = false
          })
          .catch(() => {
            showHoldingLoader.value = false
            assetCategoryList.value = []
          })
      } else {
        showHoldingLoader.value = false
        assetCategoryList.value = []
      }
    }
    function openFilter(val) {
      showFilter.value = val
    }
    async function getParticipantData() {
      var rbcParticipantData = []
      var tsmParticipantData = []
      var promises = []
      showLoader.value = true
      var accountId = []
      var contactId = []
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
        promises.push(
          $axios
            .get(`/api/v1/retention/rbc/participation/${participantType.value}`, {
              params: {
                accountId: accountId,
                advisorContactId: contactId
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              }
            })
            .then((success) => {
              if (success.data.d !== null && success.data.d.length > 0) {
                rbcParticipantData = success.data.d
              }
            })
        )
      }
      if ($store.state.user.tsmLoginId !== null && $store.state.user.tsmLoginId !== '') {
        promises.push(
          $axios.get(`/api/v1/retention/tsm/participation/${participantType.value}`).then((success) => {
            if (success.data.d !== null && success.data.d.length > 0) {
              tsmParticipantData = success.data.d
            }
          })
        )
      }

      const result = await Promise.allSettled(promises)
      var successParticipantCount = result.filter((x) => x.status === 'fulfilled')
      if (successParticipantCount.length === 0) {
        showLoader.value = false
        participant.value = []
      } else {
        if (rbcParticipantData.length > 0 && tsmParticipantData.length > 0) {
          rbcParticipantData.forEach((element, index) => {
            element.Number = element.Number + tsmParticipantData[index].Number
          })
          participant.value = rbcParticipantData
        } else if (rbcParticipantData.length === 0 && tsmParticipantData.length > 0) {
          participant.value = tsmParticipantData
        } else {
          participant.value = rbcParticipantData
        }
        showLoader.value = false
        var participantVal = participant.value.filter((a) => a.PARTICRATE > 0)
        if (participantVal.length === 0) participant.value = []
      }
    }
    function redirect(val) {
      if (val) {
        router.push(val)
      }
    }
    function onResize() {
      let bodyWidth = document.getElementsByTagName('body')
      if (bodyWidth && bodyWidth.length > 0) {
        if (document.getElementsByTagName('body')[0].offsetWidth)
          mywidth.value = document.getElementsByTagName('body')[0].offsetWidth
      }
    }
    function scrollHandler() {
      if (window.scrollY > 0) {
        componentKey.value += 1
        hideTooltip.value = []
      }
    }
    function loadClientInvestments() {
      modelLoader.value = true
      var accountId = []
      var contactId = []
      eventBus.emit('modelLoader', modelLoader)
      $store.state.clientInvestments = {}
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
          .get(`/api/v1/rbc/clientinvestments`, {
            params: {
              accountId: accountId,
              advisorContactId: contactId
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: 'repeat' })
            }
          })
          .then((success) => {
            $store.state.clientInvestments = success.data
            modelLoader.value = false
            eventBus.emit('modelLoader', modelLoader)
          })
          .catch(() => {
            $store.state.clientInvestments = {}
            modelLoader.value = false
            eventBus.emit('modelLoader', modelLoader)
          })
      } else {
        modelLoader.value = false
        clientInvestments.value = {}
        $store.state.clientInvestments = {}
      }
    }
    async function loadBusinessMatrix() {
      showBusinessLoader.value = true
      var accountId = []
      var contactId = []
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
              businessMatrixData.value = success.data.d
              businessMatrixList.value =
                businessMatrixType.value === 0
                  ? businessMatrixData.value.planTypeData.length > 0
                    ? businessMatrixData.value.planTypeData
                    : []
                  : businessMatrixData.value.businessTypeData.length > 0
                    ? businessMatrixData.value.businessTypeData
                    : []
              businessMatrixHeader.value[0].title = businessMatrixType.value === 0 ? 'Plan Type' : 'Business Type'
              componentKey.value += 1
              showBusinessLoader.value = false
            }
          })
          .catch(() => {
            businessMatrixData.value = []
            showBusinessLoader.value = false
          })
      } else {
        showBusinessLoader.value = false
        businessMatrixData.value = []
      }
    }
    async function loadCashFlowData() {
      var rbcDashboardData = []
      var tsmDashboardData = []
      var promises = []
      var accountId = []
      var contactId = []
      showCashflowLoader.value = true
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
        promises.push(
          $axios
            .get(`/api/v1/retention/rbc/cashflowsum/0`, {
              params: {
                accountId: accountId,
                advisorContactId: contactId
              },
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              }
            })
            .then((success) => {
              rbcDashboardData = success.data.d !== null && success.data.d.length > 0 ? success.data.d : []
            })
        )
      }
      if ($store.state.user.tsmLoginId) {
        promises.push(
          $axios.get(`/api/v1/retention/tsm/cashflowsum/0`).then((success) => {
            tsmDashboardData = success.data.d !== null && success.data.d.length > 0 ? success.data.d : []
          })
        )
      }

      const result = await Promise.allSettled(promises)
      var successCashflowCount = result.filter((x) => x.status === 'fulfilled')
      if (successCashflowCount.length === 0) {
        showCashflowLoader.value = false
        cashFlowSum.value = []
      } else {
        if (rbcDashboardData.length > 0 && tsmDashboardData.length > 0) {
          rbcDashboardData.forEach((element, index) => {
            element.Amount = element.Amount + tsmDashboardData[index].Amount
          })
          cashFlowSum.value = rbcDashboardData
        } else if (rbcDashboardData.length === 0 && tsmDashboardData.length > 0) {
          cashFlowSum.value = tsmDashboardData
        } else {
          cashFlowSum.value = rbcDashboardData
        }
        showCashflowLoader.value = false
        var cash = cashFlowSum.value.filter((a) => a.Amount > 0)
        if (cash.length === 0) cashFlowSum.value = []
      }
    }
    function currencyFormat(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
        : Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
          : Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : labelValue
    }
    function empSponsorCheck(val) {
      isEmpSponsorCheck.value = val
    }
    function schoolCheck(val) {
      isSchoolCheck.value = val
    }
    function muncipaltiesCheck(val) {
      isMunicipalitiesCheck.value = val
    }
    function individualsCheck(val) {
      isIndividualFinderCheck.value = val
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
    function formatNumber(value, type, decimal) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: type,
        currency: 'USD',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      })
      return formatter.format(value)
    }

    return {
      showFilter,
      comingSoonImage,
      showLoader,
      businessMatrixHeader,
      assetCategoryList,
      yearValue,
      mywidth,
      participant,
      modelsList,
      cashFlowSum,
      assetCount,
      partcipantListType,
      businessType,
      businessMatrixType,
      participantType,
      assetList,
      modelLoader,
      componentKey,
      hideTooltip,
      businessMatrix,
      showBusinessLoader,
      isEmpSponsorCheck,
      isSchoolCheck,
      isMunicipalitiesCheck,
      isIndividualFinderCheck,
      showHoldingLoader,
      showCashflowLoader,
      businessMatrixList,
      showAccountBalanceLoader,
      showHoldingOverviewWidget,
      fontSize,
      displayGlobalFilter,
      isXsOnly,
      isXlOnly,
      isLgOnly,
      isMdOnly,
      isSmOnly,
      mdAndUp,
      clientInvestments,
      businessMatrixData,
      individualsCheck,
      muncipaltiesCheck,
      schoolCheck,
      empSponsorCheck,
      currencyFormat,
      loadCashFlowData,
      loadBusinessMatrix,
      loadClientInvestments,
      scrollHandler,
      onResize,
      redirect,
      getParticipantData,
      openFilter,
      holdingOverviewData,
      ExportPlan,
      percentConvert,
      currencyConvert,
      exportToExcel,
      callWidgetApi,
      formatPrice,
      formatNumber
    }
  }
}
</script>
<style scoped>
.chart_height {
  height: 440px !important;
}
.retirement_chart_height {
  height: 480px !important;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}
.circle {
  height: 10px;
  width: 10px;
  border-radius: 50%;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}
.chart_height_largeFont {
  height: 33em !important;
}

.legend_circle {
  height: 10px;
  width: 10px;
  border-radius: 50%;
}
</style>
