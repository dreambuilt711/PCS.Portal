<template>
  <v-card cols="12" class="elevation-2">
    <v-card-title v-if="pageType !== 'PlanDetail'" class="pt-2 pb-2">
      <v-col cols="12" class="pa-0">
        <v-row>
          <v-col cols="11" class="text-left pa-0">
            <h3>Actions</h3>
          </v-col>
          <v-col cols="1" class="text-right pa-0 align-self">
            <v-icon class="cursor-pointer text-accent" @click="closeReportPopUp()"> close </v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-card-title>
    <v-card-text class="pt-2">
      <v-col cols="12" class="pt-2 pb-0 pl-0 pr-0">
        <v-row>
          <template v-for="(item, index) in pageType === 'Participants' ? participantReports : planReports" :key="index">
            <v-hover v-slot="{ hover }" :disabled="item.disabled">
              <v-col
                :cols="pageType === 'Participants' ? 11 : pageType === 'LivePlans' ? (planReports.length < 4 ? 12 : 4) : 4"
                :md="pageType === 'Participants' ? 11 : pageType === 'LivePlans' ? (planReports.length < 4 ? 12 : 3) : 3"
                :class="[
                  hover ? 'accent' : '',
                  pageType !== 'Participants' && planReports.length > 4
                    ? xsOnly
                      ? 'mobileplanFlex'
                      : 'planFlex'
                    : 'participantFlex',
                  item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                ]"
                class="pb-4 pt-4 pl-0 pr-0 text-center report_btn_border newflexclass"
                @click="!item.disabled && !item.loader ? createReport(item.value, planIDVal) : null"
              >
                <v-progress-circular v-if="item.loader" :size="26" :color="hover ? 'white' : 'accent'" indeterminate />
                <CustomIcon v-if="!item.loader" :type="item.value" :hover="hover" :disabled="item.disabled" />
                <br />
                <h3 class="textBold text-center" :class="item.disabled ? 'grey--text' : hover ? 'text-white' : 'text-accent'">
                  {{ item.text }}
                </h3>
              </v-col>
            </v-hover>
          </template>
        </v-row>
        <v-row v-if="(pageType === 'Participants' ? participantReports : planReports).some((x) => x.hint)">
          <template v-for="(item, index) in pageType === 'Participants' ? participantReports : planReports" :key="index">
            <v-col
              :cols="pageType === 'Participants' ? 11 : pageType === 'LivePlans' ? (planReports.length < 4 ? 12 : 4) : 4"
              :md="pageType === 'Participants' ? 11 : pageType === 'LivePlans' ? (planReports.length < 4 ? 12 : 3) : 3"
              :class="[
                pageType !== 'Participants' && planReports.length > 4
                  ? $vuetify?.breakpoint?.xs
                    ? 'mobileplanFlex'
                    : 'planFlex'
                  : 'participantFlex'
              ]"
              class="pt-1 pb-0 pl-0 pr-0 text-center newflexclass"
            >
              <h3 text-center>
                {{ item.hint }}
              </h3>
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-card-text>
  </v-card>
</template>
<script>
import CustomIcon from '@/components/CustomIcon'
import { ref, getCurrentInstance, watchEffect, watch, inject, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  components: {
    CustomIcon
  },
  props: ['planID', 'ssn', 'fromPage', 'planName', 'targetObject', 'email'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const display = useDisplay()
    const toast = inject('toast')
    const loading = ref(false)
    const planReports = ref([])
    const planReportList = ref([
      {
        text: 'All-In-One Fee Report',
        value: 'AllInOneFeeReport',
        loader: false,
        disabled: false
      },
      {
        text: 'Annual Participant Disclosure',
        value: 'AnnualParticipantDisclosure',
        loader: false,
        disabled: false
      },

      {
        text: 'Enrollment Overview',
        value: 'EnrollmentOverview',
        loader: false,
        disabled: false
      },
      {
        text: 'Enrollment Guide',
        value: 'EnrollmentGuide',
        loader: false,
        disabled: false
      },
      {
        text: 'Model Fact Sheets',
        value: 'ModelFactSheets',
        loader: false,
        disabled: false
      },
      {
        text: 'Fund Fact Sheets',
        value: 'FundFactSheets',
        loader: false,
        disabled: false
      },
      {
        text: 'Annual Review',
        value: 'AnnualReview',
        loader: false,
        disabled: false
      },
      {
        text: 'View Previous Annual Review',
        value: 'View Previous Annual Review',
        loader: false,
        disabled: false
      }
    ])
    const participantReportList = ref([
      {
        text: 'Retirement Snapshot',
        value: 'RetirementSnapshot',
        loader: false,
        disabled: false,
        hint: null
      },
      {
        text: 'Email',
        value: 'Email',
        loader: false,
        disabled: false
      }
    ])
    const xsOnly = ref(false)
    const planIDVal = ref(props.planID)
    const ssnVal = ref(props.ssn)
    const pageType = ref(props.fromPage)
    const planNameVal = ref(props.planName)
    const targetObjectVal = ref(props.targetObject)
    const emailVal = ref(props.email)
    const participantReports = ref([])
    //watch
    watchEffect(() => {
      xsOnly.value = display.xs.value
    })
    watch(
      pageType,
      (val) => {
        if (val) {
          if (val === 'Participants') {
            var retirementIdx = participantReportList.value.findIndex((a) => a.value === 'RetirementSnapshot')

            if (targetObjectVal.value) {
              if (targetObjectVal.value.reliusPlanStatus !== 'Active') {
                participantReportList[retirementIdx].disabled = true
                participantReportList[retirementIdx].hint = 'Unavailable - Account Inactive'
              } else if (targetObjectVal.value.balance <= 0) {
                participantReportList[retirementIdx].disabled = true
                participantReportList[retirementIdx].hint = 'Unavailable - $0 balance'
              }
            }

            if ($authz.hasPermission($authz.permissionSet.Retirement_Snapshot_Participant__c, $authz.permission.None)) {
              if (retirementIdx > -1) participantReportList.value.splice(retirementIdx, 1)
            }
            participantReports.value = participantReportList
            emit('reportList', participantReports)
          }
          if (val !== 'Participants') {
            if ($authz.hasPermission($authz.permissionSet.All_In_One_Fee_Report__c, $authz.permission.None)) {
              var allinOne = planReportList.value.findIndex((a) => a.value === 'AllInOneFeeReport')
              if (allinOne > -1) planReportList.value.splice(allinOne, 1)
            }
            if ($authz.hasPermission($authz.permissionSet.Annual_Participant_Disclosure__c, $authz.permission.None)) {
              var annualParticipants = planReportList.value.findIndex((a) => a.value === 'AnnualParticipantDisclosure')
              if (annualParticipants > -1) planReportList.value.splice(annualParticipants, 1)
            }
            if ($authz.hasPermission($authz.permissionSet.Enrollment_Overview__c, $authz.permission.None)) {
              var enrollmentOverview = planReportList.value.findIndex((a) => a.value === 'EnrollmentOverview')
              if (enrollmentOverview > -1) planReportList.value.splice(enrollmentOverview, 1)
            }
            if ($authz.hasPermission($authz.permissionSet.Enrollment_Guide__c, $authz.permission.None)) {
              var enrollmentGuide = planReportList.value.findIndex((a) => a.value === 'EnrollmentGuide')
              if (enrollmentGuide > -1) planReportList.value.splice(enrollmentGuide, 1)
            }
            if ($authz.hasPermission($authz.permissionSet.Model_Fact_Sheets__c, $authz.permission.None)) {
              var modelFact = planReportList.value.findIndex((a) => a.value === 'ModelFactSheets')
              if (modelFact > -1) planReportList.value.splice(modelFact, 1)
            }
            if ($authz.hasPermission($authz.permissionSet.Fund_Fact_Sheets__c, $authz.permission.None)) {
              var fundFact = planReportList.value.findIndex((a) => a.value === 'FundFactSheets')
              if (fundFact > -1) planReportList.value.splice(fundFact, 1)
            }
            if ($authz.hasPermission($authz.permissionSet.Annual_Review__c, $authz.permission.None)) {
              var annualReview = planReportList.value.findIndex((a) => a.value === 'AnnualReview')
              if (annualReview > -1) planReportList.value.splice(annualReview, 1)
            }
            if (targetObjectVal.value) {
              if (targetObjectVal.value.PlanStatus === 'Implementation') {
                allinOne = planReportList.value.findIndex((a) => a.value === 'AllInOneFeeReport')
                annualReview = planReportList.value.findIndex((a) => a.value === 'AnnualReview')
                var prevannualReview = planReportList.value.findIndex((a) => a.value === 'View Previous Annual Review')
                planReportList[allinOne].disabled = true
                planReportList[annualReview].disabled = true
                planReportList[prevannualReview].disabled = true
              }
            }
            planReports.value = planReportList
            emit('reportList', planReports)
          }
        }
      },
      { immediate: true },
      { deep: true }
    )
    //mounted
    onMounted(() => {
      if (pageType.value !== 'Participants') validatePreviousReportExists()
    })
    //methods
    function createReport(rbctype) {
      if (rbctype === 'Email' || rbctype === 'Message') {
        if (emailVal.value != null) {
          window.location.href = `mailto:${emailVal.value}`
        } else {
          window.location.href = 'mailto:'
        }
      } else {
        var report =
          pageType.value === 'Participants'
            ? participantReports.value.find((x) => x.value === rbctype)
            : planReports.value.find((x) => x.value === rbctype)

        if (!report.loader) report.loader = true
        else return

        var uri = `/api/v1/rbc/report/${rbctype}/plan/${planIDVal.value}?planName=${planNameVal.value}`

        if (rbctype === 'AnnualReview') {
          uri = `/api/v1/rbc/report/annualreview/plan/${planIDVal.value}/redirect`
          onPopUpEvent(uri, 'AnnualReview')
          report.loader = false
          return
        } else if (rbctype === 'View Previous Annual Review') {
          try {
            onPopUpEvent(`/api/v1/rbc/plan/${planIDVal.value}/AnnualReview/download`, `AnnualReview_${planIDVal.value}.pdf`)
          } catch (error) {
            // eslint-disable-next-line no-console
            toast.clearAll()
            toast.error(
              error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Report download failed',
              { autoClose: 5000 }
            )
          } finally {
            report.loader = false
          }
        } else {
          getReport(uri, rbctype, report)
        }
      }
    }
    function validatePreviousReportExists() {
      var uri = `/api/v1/rbc/report/${planIDVal.value}/annualreview/exists`
      $axios.get(uri).then((response) => {
        var prevannualReview = planReportList.value.findIndex((a) => a.value === 'View Previous Annual Review')
        planReportList[prevannualReview].disabled = !response.data.d
      })
    }
    function closeReportPopUp() {
      emit('closeReport', false)
    }
    function getReport(uri, rbctype, report) {
      if (ssnVal.value && ssnVal.value !== '') uri += `&ssn=${ssnVal.value}&`
      if ($store.state.user.reliusLoginId) {
        $axios
          .get(uri)
          .then((response) => {
            onPopUpEvent(
              `/api/v1/rbc/report/download?reportName=${encodeURIComponent(response.data.reportName)}`,
              `${rbctype}_${planIDVal.value}`
            )
          })
          .catch((error) => {
            toast.clearAll()
            toast.error(
              error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Report download failed',
              { autoClose: 5000 }
            )
          })
          .finally(() => {
            report.loader = false
          })
      }
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          //this.$FModal.show({ component: PdfViewer, maxHeight: '98%', width: '98%', clickToClose: false }, { pdfUrl: url })
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

    return {
      loading,
      planReports,
      planReportList,
      participantReportList,
      xsOnly,
      planIDVal,
      ssnVal,
      pageType,
      planNameVal,
      targetObjectVal,
      emailVal,
      createReport,
      validatePreviousReportExists,
      closeReportPopUp,
      getReport,
      onPopUpEvent
    }
  }
}
</script>
<style scoped>
.newflexclass {
  border-radius: 2px !important;
  column-gap: 15px !important;
  margin: 2px !important;
  flex-wrap: wrap;
}
.participantFlex {
  flex: 1 0 !important;
}
.planFlex {
  flex-basis: 24% !important;
}
.mobileplanFlex {
  flex-basis: 31.5% !important;
}
</style>
