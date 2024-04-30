<template>
  <v-col class="pa-0">
    <loader v-if="showLoader" :loading="showLoader" />
    <v-col cols="12" xs="12" class="mb-2 pa-0">
      <v-row>
        <v-col cols="12" xs="12">
          <h2>{{ dialogHeader }} ({{ formatNumber(totalCount) }})</h2>
        </v-col>
      </v-row>
    </v-col>
    <v-card :class="[$vuetify?.breakpoint?.xs ? 'elevation-0' : 'elevation-6 mb-3 mt-4']">
      <v-col>
        <v-data-table
          :headers="planHeaders"
          :items="PlanResult"
          class="elevation-0 changeTableColor fixTableHeader"
          item-key="SEINPNO"
          :hide-default-header="$vuetify?.breakpoint?.smAndDown"
          :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
          :options="options"
          :fixed-header="true"
          style="backface-visibility: hidden"
        >
          <template #item="{ item, isExpanded, expand }">
            <tr v-if="!$vuetify?.breakpoint?.smAndDown">
              <td>
                <v-hover v-slot="{ hover }">
                  <a
                    :class="[
                      !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                      hover ? 'text-decoration-underline' : 'text-decoration-none'
                    ]"
                    class="text-capitalize"
                    @click="planInfo(item, $event)"
                    >{{ item.PNAME.toLowerCase() }}</a
                  >
                </v-hover>
              </td>
              <td class="text-right">
                {{ formatPrice(item.TOTASSETS, 2) }}
              </td>
              <td class="text-right">
                {{ item.ACTPARTIC }}
              </td>
              <td v-if="WidgetName === 'lowReturn'" class="text-right">
                {{ parseFloat(item.PlanReturn.toFixed(4)).toFixed(2) }}%
              </td>
              <td v-else-if="WidgetName === 'participationRates'" class="text-right">
                {{ parseFloat(item.ParticipationRate.toFixed(4) * 100).toFixed(2) }}%
              </td>
              <td v-else-if="WidgetName === 'benchmark'" class="text-right">
                {{ parseFloat(item.PlanFees.toFixed(4)).toFixed(2) }}%
              </td>
              <td v-else class="text-right">
                {{ item.IssueCount }}
              </td>
              <td v-if="WidgetName === 'lowReturn'" class="text-right">
                {{ item.PlanReturnVsPeerGroup ? parseFloat(item.PlanReturnVsPeerGroup.toFixed(4) * 100).toFixed(2) : 0 }}%
              </td>
              <td v-if="WidgetName === 'lowReturn'" class="text-right">
                {{ item.PlanReturnVsIndustryGroup ? parseFloat(item.PlanReturnVsIndustryGroup.toFixed(4) * 100).toFixed(2) : 0 }}%
              </td>
              <td v-if="WidgetName === 'participationRates'" class="text-right">
                {{
                  item.PeerGroupParticipationRate ? parseFloat(item.PeerGroupParticipationRate.toFixed(4) * 100).toFixed(2) : 0
                }}%
              </td>
              <td v-if="WidgetName === 'participationRates'" class="text-right">
                {{
                  item.IndustryGroupParticipationRate
                    ? parseFloat(item.IndustryGroupParticipationRate.toFixed(4) * 100).toFixed(2)
                    : 0
                }}%
              </td>
              <td v-if="WidgetName === 'benchmark'" class="text-right">
                {{
                  item.PeerGroupFees
                    ? new Intl.NumberFormat().format(parseFloat(item.PeerGroupFees.toFixed(4) * 100).toFixed(2))
                    : 0
                }}%
              </td>
              <td v-if="WidgetName === 'benchmark'" class="text-right">
                {{ item.IndustryGroupFees ? parseFloat(item.IndustryGroupFees.toFixed(4) * 100).toFixed(2) : 0 }}%
              </td>
              <td v-if="WidgetName === 'compliance'" class="text-left">
                {{ item.ComplainceIssue }}
              </td>
              <td class="text-center">
                <v-row no-gutters>
                  <v-col>
                    <v-menu ref="menuRef" open-on-hover z-index="204" :close-on-content-click="false">
                      <template #activator="{ props }">
                        <v-btn
                          v-if="item.selectreport && item.selectreport.length > 0"
                          v-bind="props"
                          class="mt-0 mb-0"
                          icon
                          variant="text"
                          size="small"
                          :color="!$vuetify?.theme.dark ? 'hyperlink' : ''"
                          @click.stop=";[(optionsSeinpNO = item.SEINPNO), (optionsItem = item)]"
                        >
                          <v-icon size="small"> fas fa-ellipsis-v </v-icon>
                        </v-btn>
                      </template>
                      <v-list density="compact">
                        <v-list-item
                          v-for="(itemreports, index) in item.selectreport"
                          :key="index"
                          @click="checkReportOptions(item.SEINPNO, item, itemreports.val, $event)"
                        >
                          <v-list-item-action class="mr-1">
                            <CustomIcon :type="itemreports.icon" />
                          </v-list-item-action>
                          <v-list-item-title>{{ itemreports.text }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-btn icon variant="text" class="mt-0 mb-0" size="small" :color="!$vuetify?.theme.dark ? 'accent' : ''">
                      <PlanStar style="line-height: 0.5" :seinpno="item.SEINPNO" from="TAL" />
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
            </tr>
            <tr v-else :class="[item.selectedRow == true ? 'selected_row_color' : '', isExpanded ? 'border_bottom_none' : '']">
              <td class="pr-3 pl-3">
                <v-col>
                  <v-row>
                    <v-col cols="10" xs="10">
                      <v-row>
                        <v-col cols="12" xs="12">
                          <h5 class="pt-1">
                            <span>
                              <span>Company Plan Name</span>
                              <br />
                              <h4>
                                <a
                                  :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                                  class="text-capitalize text-decoration-none"
                                  @click="planInfo(item, $event)"
                                  >{{ item.PNAME.toLowerCase() }}</a
                                >
                              </h4>
                            </span>
                          </h5>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="2" xs="2" class="text-right cursor-pointer">
                      <v-btn icon variant="text" @click="expand(!isExpanded)">
                        <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" xs="12" pt-1 pb-1>
                      <v-row>
                        <v-col cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5>Total Plan Assets</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4>{{ formatPrice(item.TOTASSETS, 2) }}</h4>
                          </v-col>
                        </v-col>
                        <v-col cols="5" xs="5">
                          <v-col cols="12" xs="12">
                            <h5>Active Participants</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4>{{ item.ACTPARTIC }}</h4>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </td>
            </tr>
          </template>
          <template v-if="$vuetify?.breakpoint?.smAndDown" #expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-card flat :class="$vuetify?.theme.dark ? '' : 'expandable_background'">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" xs="12">
                      <v-row>
                        <v-col cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5 v-if="WidgetName === 'lowReturn'" class="pl-0 pb-0">Plan Return</h5>
                            <h5 v-else-if="WidgetName === 'benchmark'" class="pl-0 pb-0">Plan Fees</h5>
                            <h5 v-else-if="WidgetName === 'participationRates'">Participation Rate</h5>
                            <h5 v-else class="pl-0 pb-0">Issue Count</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4 v-if="WidgetName === 'lowReturn'">{{ parseFloat(item.PlanReturn.toFixed(4)).toFixed(2) }}%</h4>
                            <h4 v-else-if="WidgetName === 'benchmark'">{{ parseFloat(item.PlanFees.toFixed(4)).toFixed(2) }}%</h4>
                            <h4 v-else-if="WidgetName === 'participationRates'">${{ formatPrice(item.ParticipationRate, 2) }}</h4>
                            <h4 v-else>
                              {{ item.IssueCount }}
                            </h4>
                          </v-col>
                        </v-col>
                        <v-col v-if="WidgetName !== 'compliance'" cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5 v-if="WidgetName !== 'compliance'" class="pl-0 pb-0">vs.Peer Group</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4 v-if="WidgetName === 'lowReturn'">
                              {{
                                item.PlanReturnVsPeerGroup
                                  ? parseFloat(item.PlanReturnVsPeerGroup.toFixed(4) * 100).toFixed(2)
                                  : 0
                              }}%
                            </h4>
                            <h4 v-if="WidgetName === 'participationRates'">
                              {{
                                item.PeerGroupParticipationRate
                                  ? parseFloat(item.PeerGroupParticipationRate.toFixed(4) * 100).toFixed(2)
                                  : 0
                              }}%
                            </h4>
                            <h4 v-if="WidgetName === 'benchmark'">
                              ${{
                                item.PeerGroupFees ? new Intl.NumberFormat().format(parseFloat(item.PeerGroupFees).toFixed(2)) : 0
                              }}
                            </h4>
                          </v-col>
                        </v-col>
                        <v-col v-if="WidgetName !== 'compliance'" cols="6" xs="6">
                          <v-col cols="12" xs="12">
                            <h5 v-if="WidgetName !== 'compliance'" class="pl-0 pb-0">vs.Industury Group</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4 v-if="WidgetName === 'lowReturn'">
                              {{
                                item.PlanReturnVsIndustryGroup
                                  ? parseFloat(item.PlanReturnVsIndustryGroup.toFixed(4) * 100).toFixed(2)
                                  : 0
                              }}%
                            </h4>
                            <h4 v-if="WidgetName === 'participationRates'">
                              {{
                                item.IndustryGroupParticipationRate
                                  ? parseFloat(item.IndustryGroupParticipationRate.toFixed(4) * 100).toFixed(2)
                                  : 0
                              }}%
                            </h4>
                            <h4 v-if="WidgetName === 'benchmark'">
                              ${{ item.IndustryGroupFees ? parseFloat(item.IndustryGroupFees.toFixed(4) * 100).toFixed(0) : 0 }}
                            </h4>
                          </v-col>
                        </v-col>
                        <v-col v-if="WidgetName === 'compliance'" cols="6" xs="6" pt-1>
                          <v-col cols="12" xs="12">
                            <h5 v-if="WidgetName === 'compliance'" class="pl-0 pb-0">Compliance Issue</h5>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <h4 v-if="WidgetName === 'compliance'">
                              {{ item.ComplainceIssue }}
                            </h4>
                          </v-col>
                        </v-col>
                        <v-col cols="6" xs="6" class="pt-2">
                          <v-row no-gutters>
                            <v-col>
                              <v-menu ref="menuRef" z-index="204" :close-on-content-click="false">
                                <template #activator="{ props }">
                                  <v-btn
                                    v-if="item.selectreport && item.selectreport.length > 0"
                                    v-bind="props"
                                    class="ma-0"
                                    icon
                                    variant="text"
                                    size="small"
                                    :color="!$vuetify?.theme.dark ? 'hyperlink' : ''"
                                    @click.stop=";[(optionsSeinpNO = item.SEINPNO), (optionsItem = item)]"
                                  >
                                    <v-icon size="small"> fas fa-ellipsis-v </v-icon>
                                  </v-btn>
                                </template>
                                <v-list density="compact">
                                  <v-list-item
                                    v-for="(itemreports, index) in item.selectreport"
                                    :key="index"
                                    @click="checkReportOptions(item.SEINPNO, item, itemreports.val, $event)"
                                  >
                                    <v-list-item-action class="mr-1">
                                      <CustomIcon :type="itemreports.icon" />
                                    </v-list-item-action>
                                    <v-list-item-title>{{ itemreports.text }}</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                              <v-btn
                                icon
                                variant="text"
                                class="mt-0 mb-0"
                                size="small"
                                :color="!$vuetify?.theme.dark ? 'accent' : ''"
                              >
                                <PlanStar style="line-height: 0.5" :seinpno="item.SEINPNO" from="TAL" />
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </v-col>
</template>
<script>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PlanStar from '@/components/TAL/PlanStar'
import CustomIcon from '@/components/CustomIcon'
import Loader from '@/components/Loader'
import * as XLSX from 'xlsx'
export default {
  components: {
    PlanStar,
    CustomIcon,
    Loader
  },
  props: ['WidgetName', 'PlanResult', 'totalCount', 'showLoader'],
  setup(props) {
    const router = useRouter()
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const toast = instance.appContext.config.globalProperties.$toast
    const $refs = instance.appContext.config.globalProperties.$refs
    const $axios = instance.appContext.config.globalProperties.$axios
    const componentKey = ref(0)
    const menu = ref(true)
    const showAction = ref(false)
    const loading = ref(false)
    const offsetposition = ref(0)
    const reportRequest = ref({})
    const ProspectResult = ref([])
    const options = ref({
      itemsPerPage: 10
    })
    const headers = ref([
      {
        title: 'Plan Name',
        value: 'PNAME',
        width: '21%',
        hide: false,
        align: 'start',
        sortable: true,
        showTooltip: false,
        toolTipText: ''
      },
      {
        title: 'Total Plan Assets',
        value: 'TOTASSETS',
        width: '10%',
        hide: false,
        align: 'end',
        sortable: true,
        showTooltip: false,
        toolTipText: ''
      },
      {
        title: 'Eligible Participants',
        value: 'ACTPARTIC',
        width: '8%',
        hide: false,
        align: 'end',
        sortable: true,
        showTooltip: true,
        toolTipText: 'This reflects the total number of employees eligible to participate in the plan'
      },
      {
        title: 'Plan Growth',
        value: 'PlanReturn',
        width: '10%',
        hide: !(props.WidgetName === 'lowReturn'),
        align: 'end',
        sortable: true,
        showTooltip: true,
        toolTipText: 'This percentage represents growth of plan assets including contributions and distributions'
      },
      {
        title: 'Plan Fees',
        value: 'PlanFees',
        width: '10%',
        hide: !(props.WidgetName === 'benchmark'),
        align: 'end',
        sortable: true,
        showTooltip: true,
        toolTipText:
          'Fees reported on the plan’s form 5500 as a percent of total plan assets, please note that not all fees are always reported by the plan administrator'
      },
      {
        title: 'Participation Rate',
        value: 'ParticipationRate',
        width: '13%',
        hide: !(props.WidgetName === 'participationRates'),
        align: 'end',
        sortable: true,
        showTooltip: true,
        toolTipText:
          'Participation is calculated by dividing participants with an account balance over the total participants within a plan'
      },
      {
        title: 'Issue Count',
        value: 'IssueCount',
        width: '10%',
        hide: !(props.WidgetName === 'compliance'),
        align: 'end',
        sortable: true,
        showTooltip: false,
        toolTipText: ''
      },
      {
        title: 'Compliance Issue',
        value: 'ComplainceIssue',
        width: '10%',
        hide: !(props.WidgetName === 'compliance'),
        align: 'left',
        sortable: true,
        showTooltip: false,
        toolTipText: ''
      },
      {
        title: 'vs.Peer Group',
        value: 'GROWTH',
        width: '15%',
        align: 'end',
        hide: props.WidgetName === 'compliance' ? true : false,
        sortable: true,
        showTooltip: true,
        toolTipText:
          'This percentage represents the average growth of all plan assets by peer group including contributions and distributions'
      },
      {
        title: 'vs.Industry Group',
        value: 'GROWTH',
        width: '15%',
        align: 'end',
        hide: props.WidgetName === 'compliance' ? true : false,
        sortable: true,
        showTooltip: true,
        toolTipText:
          'This percentage represents the average growth of all plan assets by industry group including contributions and distributions'
      },
      // {
      //   text: 'Industry Group',
      //   value: 'BUSCODE',
      //   width: '20%',
      //   hide: props.WidgetName === 'compliance',
      //   align: 'start',
      //   sortable: true,
      //   showTooltip: false,
      //   toolTipText: ''
      // },
      {
        title: 'Action',
        value: '',
        width: '12%',
        align: 'center',
        sortable: false,
        showTooltip: false,
        toolTipText: ''
      }
    ])
    const planHeaders = computed(() => {
      return headers.value.filter((h) => !h.hide)
    })
    const dialogHeader = computed(() => {
      if (props.WidgetName === 'compliance') return 'Plans with Compliance Issues'
      else if (props.WidgetName === 'participationRates') return 'Plans with Low Participation Rates'
      else if (props.WidgetName === 'benchmark') return 'Plans with Fees Above Benchmark'
      else if (props.WidgetName === 'lowReturn') return 'Plans with Low Returns'
      else return 'No Plans Available'
    })
    const numberFormat = (value) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    }
    const showPlanResult = () => {
      if (props.WidgetName === 'lowReturn' || props.WidgetName === 'participationRates') {
        filterData()
      } else if (props.WidgetName === 'benchmark') {
        filterBenchmarkData()
      } else {
        ProspectResult.value = props.PlanResult
      }
    }
    const formatPrice = (labelValue) => {
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
    const onPopUpEvent = (url, data) => {
      if (store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          store.state.reportUri = url
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
    const checkReportOptions = (seinpNO, plan, val) => {
      if (val === 'Express Diagnostic') {
        getReport(plan, val)
      } else {
        store.state.marketInsight.dialogName = props.WidgetName
        store.state.marketInsight.plandata =
          props.WidgetName === 'lowReturn' || props.WidgetName === 'participationRates' ? props.PlanResult : ProspectResult.value
        router.push({
          name: 'TALPlan',
          params: {
            id: seinpNO,
            planType: plan.DCPTYPE
          },
          query: { reportOption: val }
        })
      }
    }
    const getReport = (planSingleObject, reportType) => {
      if (reportType !== undefined && reportType !== '') {
        if (reportType !== 'Express Diagnostic') return

        loading.value = true
        reportRequest.value = {
          seinPNumber: planSingleObject.SEINPNO,
          preparedby: store.state.user.name,
          isExpress: true,
          planName: planSingleObject.PNAME
        }

        $axios('/api/v1/tal/report/diagnostic', {
          method: 'POST',
          data: reportRequest.value
        })
          .then((response) => {
            onPopUpEvent(
              `/api/v1/tal/report/diagnostic/download?reportName=${encodeURIComponent(response.data.reportName)}`,
              response.data.reportName
            )
            loading.value = false
          })
          .catch(() => {
            loading.value = false
          })
      }
    }
    const exportToExcel = () => {
      var xlHeaders = []
      var planResults = []

      xlHeaders = ExportPlan(ProspectResult.value)
      planResults = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResults, 'Market Insight')
      for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
        currencyConvert(wb, 'O', Xrow)
        currencyConvert(wb, 'Q', Xrow)
        currencyConvert(wb, 'R', Xrow)
        currencyConvert(wb, 'S', Xrow)
        currencyConvert(wb, 'T', Xrow)
        currencyConvert(wb, 'U', Xrow)
        percentConvert(wb, 'V', Xrow)
        percentConvert(wb, 'W', Xrow)
        currencyConvert(wb, 'X', Xrow)
        currencyConvert(wb, 'Y', Xrow)
        percentConvert(wb, 'Z', Xrow)
        currencyConvert(wb, 'AB', Xrow)
        currencyConvert(wb, 'AC', Xrow)
        currencyConvert(wb, 'AD', Xrow)
        currencyConvert(wb, 'AE', Xrow)
        currencyConvert(wb, 'AF', Xrow)
        percentConvert(wb, 'AG', Xrow)
        percentConvert(wb, 'AK', Xrow)
        percentConvert(wb, 'AL', Xrow)
        percentConvert(wb, 'AR', Xrow)
      }
      XLSX.writeFile(wb, 'Market Insight.xlsx')
    }
    const formatNumber = (value, type, decimal) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: type,
        currency: 'USD',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      })
      return formatter.format(value)
    }
    const ExportPlan = (plans) => {
      var xlHeaders = plans.map((rec) => {
        return {
          'Plan Name': rec.PNAME,
          'EIN#': rec.sp_fedid,
          Company: rec.SNAME,
          Street: rec.SSTREET,
          City: rec.SCITY,
          State: rec.SSTATE,
          Zip: rec.ZIPCODE,
          Phone: rec.SPHONE,
          'Admin First Name': rec.AFIRSTNAME,
          'Admin Last Name': rec.ALASTNAME,
          'First Name': rec.FIRSTNAME,
          'Last Name': rec.LASTNAME,
          'Type of Plan': rec.DCPTYPE,
          'Plan is Collectively Bargained': rec.BARGAINED,
          'Total Plan Assets': rec.TOTASSETS,
          'Active Participants': rec.ACTPARTIC,
          'Average Account Balance': rec.AVEACCTBAL,
          'Average Participant Account Balance': parseFloat(rec.AVEPARTICBAL.toFixed(0)),
          'Total Contributions': rec.TOTCONTRIB,
          'Average Participant Contribution': parseFloat(rec.PARTAVG.toFixed(0)),
          'Average Employer Contribution': parseInt(rec.EMPLYRAVG.toFixed(0)),
          'Asset Growth': parseFloat(rec.GROWTH.toFixed(4)),
          'Return On Investment': rec.RETURN
            ? parseFloat(rec.RETURN.toFixed(4))
            : rec.PlanReturn
              ? parseFloat(rec.PlanReturn.toFixed(4))
              : rec.RETURN,
          'Broker Commissions': parseFloat(rec.COMMISS.toFixed(0)),
          'Broker Fees': parseFloat(rec.FEES.toFixed(0)),
          'Broker %': parseFloat(rec.BROKERPCT.toFixed(4)),
          'Admin Expense': rec.EXPADMIN,
          'Other Expense': rec.EXPOTHER,
          'Professional Expense': rec.EXPPROFFEE,
          'Advisor Expense': rec.EXPINVADV,
          'Total Plan Expense': rec.EXPTOTPLN,
          'Total Admin Expense': rec.EXPTOTADM,
          'Total Admin Expense %': parseFloat(rec.EXPTOTADMPCT.toFixed(4)),
          'Plan Year End': rec.YEAREND,
          'Final Report': rec.FINAL === 0 ? true : false,
          'Loans as % of Plan Assets': parseFloat(rec.PARTLOANS.toFixed(4)),
          'Certain Deemed and/or Corrective Distributions': parseFloat(rec.DISTRB.toFixed(4)),
          'Audit Reported': rec.OPINIONTYP,
          'Failed to Transmit Participant Contributions': rec.TRANSMIT,
          'Plan Not Covered by Fidelity Bond': rec.FDLTYBDIND,
          'Plan Had Nonexempt Transactions': rec.NONEXEMPT,
          'Loss Due to Fraud/Dishonesty': rec.LOSS,
          'Revenue Share as % of Plan Assets': parseFloat(rec.REVENUE.toFixed(4)),
          Broker: rec.BROKER,
          'Service Provider': rec.PROVIDER,
          'Insurance Carrier': rec.INSCARRIER
        }
      })
      return xlHeaders
    }
    const currencyConvert = (xlWb, xlColRef, xlRowNum) => {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Market Insight'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    const scrollEvent = () => {
      const parentMenu = $refs.menuRef
      parentMenu.isActive = false
    }
    const planInfo = (item) => {
      if (item.SEINPNO) {
        store.state.marketInsight.dialogName = props.WidgetName
        store.state.marketInsight.plandata =
          props.WidgetName === 'lowReturn' || props.WidgetName === 'participationRates' ? props.PlanResult : ProspectResult.value
        store.state.marketInsight.openMarketInsights = true
        router.push({
          name: 'TALPlan',
          params: { id: item.SEINPNO, planType: item.DCPTYPE }
        })
      }
    }
    const percentConvert = (xlWb, xlColRef, xlRowNum) => {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Market Insight'][xlColRef + xlRowNum], '0.00%')
    }
    const filterBenchmarkData = () => {
      ProspectResult.value = props.PlanResult
    }
    const filterData = () => {
      var planResults = []
      planResults = props.PlanResult ? props.PlanResult : []
      ProspectResult.value = []
      ProspectResult.value = planResults
    }
    onMounted(() => {
      showPlanResult()
    })
    return {
      componentKey,
      ProspectResult,
      menu,
      showAction,
      offsetposition,
      options,
      planHeaders,
      dialogHeader,
      planInfo,
      numberFormat,
      checkReportOptions,
      exportToExcel,
      scrollEvent,
      formatNumber,
      formatPrice,
      reportRequest,
      store,
      $vuetify,
      router
    }
  }
}
</script>
<style scoped>
.fixTableHeader .v-data-table__wrapper {
  max-height: 550px !important;
}
.tooltipClass {
  z-index: 9999;
}
.fixHeightForLoader {
  height: 500px !important;
}
</style>
