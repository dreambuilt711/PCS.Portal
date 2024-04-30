<template>
  <v-dialog
    v-modal="value"
    persistent
    class="elevation-3"
    content-class="elevation-3"
    scrollable
    :max-width="type === 'employee' ? '600px' : '1100px'"
  >
    <v-card>
      <v-card-title class="pt-2 pb-2 mt-2 mb-2">
        <v-col cols="12" xs="12" class="text-left pa-0">
          <v-row>
            <v-col cols="11" xs="11" class="text-left pa-0">
              <h3>Actions</h3>
            </v-col>
            <v-col cols="1" xs="1" class="text-right pa-0">
              <v-icon class="cursor-pointer" :class="theme.dark ? '' : 'text-accent'" @click="actionDialog = false">
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-col class="d-flex justify-center">
          <v-row class="justify-center">
            <v-btn
              v-if="!currentReport"
              class="text-capitalize"
              size="large"
              :color="theme.dark ? '' : 'accent'"
              @click="openApplication(filterObject)"
            >
              Complete Online Application
            </v-btn>

            <v-btn
              v-if="editActivity && type != 'school'"
              class="text-capitalize"
              size="large"
              :color="theme.dark ? '' : 'accent'"
              :disabled="showPopupOption ? true : false"
              @click="performAction('View/Edit Activity', filterObject)"
            >
              View Activity
            </v-btn>

            <v-divider v-if="!display.smAndDown.value" vertical class="mx-2" />
            <v-tooltip
              location="top"
              :disabled="
                showPopupOption ? true : filterObject.ClientProduct && filterObject.InvestmentSelection > 0 ? true : false
              "
            >
              <template #activator="{ props }">
                <div v-bind="props" style="margin-right: 10px">
                  <v-btn
                    v-if="!currentReport"
                    class="text-capitalize"
                    size="large"
                    :color="theme.dark ? '' : 'accent'"
                    :disabled="
                      showPopupOption ? true : filterObject.ClientProduct && filterObject.InvestmentSelection > 0 ? false : true
                    "
                    @click="downloadApplication(filterObject)"
                  >
                    Download Application
                  </v-btn>
                </div>
              </template>
              <span>Investments must be selected and allocated before application can be downloaded</span>
            </v-tooltip>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div v-bind="props" style="margin-right: 10px">
                  <v-btn
                    v-if="!currentReport"
                    class="text-capitalize"
                    size="large"
                    :color="theme.dark ? '' : 'accent'"
                    :loading="loading"
                    :disabled="
                      showPopupOption ? true : filterObject.ClientProduct && filterObject.InvestmentSelection > 0 ? false : true
                    "
                    @click="sendToParticipant(filterObject)"
                  >
                    Send to Participant
                    <template #loading>
                      <span class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </div>
              </template>
              <span>Send an email to the applicant with a link and instructions to complete the application process</span>
            </v-tooltip>
            <v-btn
              v-if="currentReport"
              class="text-capitalize"
              size="large"
              :color="theme.dark ? '' : 'accent'"
              :disabled="showPopupOption ? true : false"
              @click="performAction('Current Report', filterObject)"
            >
              Download Current Report
            </v-btn>
            <v-btn
              v-if="!currentReport"
              class="text-capitalize"
              size="large"
              :color="theme.dark ? '' : 'accent'"
              :disabled="
                showPopupOption
                  ? true
                  : filterObject.StageName === 'Completed' ||
                      filterObject.StageName === 'Finalizing' ||
                      filterObject.ParticipantEnrollmentMethod === 'Advisor downloaded enrollment form'
                    ? false
                    : true
              "
              @click="uploadapplication(filterObject)"
            >
              Upload Application & Supporting Documents
            </v-btn>
            <input
              id="pdfapplication"
              ref="opportunitydocsupload"
              type="file"
              style="display: none"
              accept="application/pdf"
              @change="onFileSelected"
            />
          </v-row>
        </v-col>
      </v-card-text>
    </v-card>
    <v-dialog v-model="closeDialog" persistent class="elevation-3" scrollable :eager="true" max-width="400px">
      <v-card>
        <v-card-text class="pt-5">
          <v-col cols="12" xs="12">
            <v-col class="text-center mb-4 mt-3">
              <h2>An email has been sent to this participant with a link to complete the application.</h2>
            </v-col>
            <v-col cols="12" xs="12" class="text-right">
              <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeDialog = false"
                ><b>Close</b>
              </a>
            </v-col>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
<script>
import { ref, inject, computed, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'

export default {
  props: {
    value: Boolean,
    filterObject: Object,
    currentReport: Boolean,
    editActivity: Boolean,
    type: String
  },
  setup(props, { emit }) {
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const display = useDisplay()
    const router = useRouter()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const toast = instance.appContext.config.globalProperties.$toast
    const store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const opportunityId = ref('')
    const opportunitydocsupload = ref(null)
    const closeDialog = ref(false)
    const loading = ref(false)
    const actionDialog = computed({
      get: () => {
        return props.value
      },
      set: (value) => {
        emit('update:modelValue', value)
      }
    })
    const showPopupOption = computed(() => {
      if (props.filterObject.PlanType === $authz.planType.Individual_457_f_TaxExempt_Plan) {
        return true
      } else {
        return false
      }
    })
    const sendToParticipant = (planObject) => {
      loading.value = true
      $axios.post(`/api/v1/sfdc/opportunity/${planObject.OpportunityId}/Agreement Sent`)
      $axios.post(`/api/v1/sfdc/opportunity/${planObject.OpportunityId}/participant/Email enrollment link`).finally(() => {
        closeDialog.value = true
        loading.value = false
      })
    }
    const uploadapplication = (planObject) => {
      opportunityId.value = planObject.OpportunityId
      if (opportunityId.value) {
        $axios.post(`/api/v1/sfdc/opportunity/${opportunityId.value}/Agreement Received`)
        document.getElementById('pdfapplication').click()
      }
    }
    const onPopUpEvent = (url, data) => {
      if (store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          store.state.reportUri = url
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
    const downloadApplication = (planObject) => {
      if (planObject.OpportunityId) {
        $axios.post(`/api/v1/sfdc/opportunity/${planObject.OpportunityId}/Agreement Sent`)
        $axios.post(`/api/v1/sfdc/opportunity/${planObject.OpportunityId}/participant/Advisor downloaded enrollment form`)
        onPopUpEvent(`/api/v1/sfdc/opportunity/${planObject.OpportunityId}/download`)
        setTimeout(() => {
          eventBus.emit('getPiplineIndividualData')
        }, 30000)
      }
    }
    const onFileSelected = async (e) => {
      const files = e.target.files
      if (files.length > 0) {
        if (files[0] !== undefined) {
          var extension = files[0].name.split('.').pop()
          if (extension === 'pdf') {
            var formData = new FormData()
            formData.append('content', files[0])
            $axios.post(`/api/v1/sfdc/opportunity/${opportunityId.value}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            opportunityId.value = ''
            opportunitydocsupload.value = ''
            toast?.destroy()
            toast.success('Upload Application successfully', '')
          } else {
            opportunityId.value = ''
            toast?.destroy()
            toast.error(`${files[0].name}` + ' has an invalid extension. Only pdf files can be uploaded.', '')
          }
        }
      }
    }
    const performAction = (val, planObject) => {
      if (props.type === 'school') {
        if (planObject.SchoolDistrict && planObject.SchoolDistrictId) {
          if (val === 'View/Edit Activity') {
            router.push({
              path: `/TAL/School`,
              query: {
                schoolDistName: planObject.SchoolDistrict,
                schoolDistId: planObject.SchoolDistrictId,
                reportOption: 'Activity'
              }
            })
          }
        }
      } else {
        if (val === 'View/Edit Activity') {
          router.push({
            name: 'TALPlan',
            params: { id: planObject.SEINPNO, planType: planObject.PlanType },
            query: { reportOption: 'Activity', planId: planObject.ProposalId }
          })
        } else if (val === 'Current Report') {
          var report = planObject.Stage
          if (report === 'Proposal') {
            if (!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.Full)) {
              toast.info('You do not have access to download this report.', '')
              return
            }
          } else if (report === 'Comparison') {
            if (!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.Full)) {
              toast.info('You do not have access to download this report.', '')
              return
            }
          } else if (report === 'Diagnostic') {
            if (!$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.Full)) {
              toast.info('You do not have access to download this report.', '')
              return
            }
          }
          $axios
            .get(`/api/v1/tal/report/${report}/${planObject.SyncReferenceID}/exists`)
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
              report = report === 'Comparison' ? 'rpea' : report
              onPopUpEvent(
                `/api/v1/tal/report/${report}/download?reportName=${planObject.SyncReferenceID}&inline=false`,
                planObject.SyncReferenceID
              )
            })
            .catch((error) => {
              var msg = 'A current report is not available. Please generate a new report for this opportunity.'
              if (error.response && error.response.status !== 404) {
                msg = 'Report download failed. Please try again.'
              }
              toast.info(msg, '')
            })
        }
      }
    }
    const openApplication = (val) => {
      emit('editOpenAccount', val)
    }
    return {
      theme,
      display,
      actionDialog,
      showPopupOption,
      closeDialog,
      opportunitydocsupload,
      openApplication,
      performAction,
      downloadApplication,
      sendToParticipant,
      uploadapplication,
      onFileSelected
    }
  }
}
</script>
