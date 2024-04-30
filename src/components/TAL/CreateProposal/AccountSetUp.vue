<template>
  <v-col class="v-container pa-2">
    <v-row no-gutters class="justify-center">
      <v-col cols="12" xs="12" lg="7">
        <v-col cols="12" xs="12" class="text-center pt-8">
          <h1>{{ `${individualName}'s` }} account is almost set up!</h1>
        </v-col>
        <v-col class="text-center py-6">
          <h2>We’ll need {{ `${individualName}'s` }} personal information to complete the account opening process.</h2>
        </v-col>
        <v-col class="text-center">
          <h2>You can download the application to complete it offline or you can fill out information online on their behalf.</h2>
        </v-col>
        <v-col cols="12" xs="12" class="text-center pt-10">
          <v-row v-if="!display.xs.value" justify="center">
            <v-col cols="8" class="pa-0">
              <v-btn class="text-none ma-1" block size="large" :color="theme.dark ? '' : 'accent'" @click="f_completeDetails()">
                Complete application for {{ individualName }}
              </v-btn>
            </v-col>
            <v-col cols="8" class="pa-0">
              <v-btn
                class="text-none ma-1"
                size="large"
                block
                variant="outlined"
                :color="theme.dark ? '' : 'accent'"
                @click="downloadDetails()"
              >
                Download application for {{ individualName }}
              </v-btn>
            </v-col>
            <v-col cols="8" class="pa-0">
              <v-tooltip location="bottom">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-btn
                      class="text-none ma-1"
                      size="large"
                      block
                      variant="outlined"
                      :loading="loading"
                      :color="theme.dark ? '' : 'accent'"
                      @click="sendToParticipant()"
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
            </v-col>
          </v-row>
          <v-col v-if="display.xs.value" cols="12" xs="12">
            <v-btn class="text-none mt-2" block size="large" :color="theme.dark ? '' : 'accent'" @click="f_completeDetails()">
              Complete application for {{ individualName }}
            </v-btn>
            <v-btn
              class="text-none mt-2"
              size="large"
              block
              variant="outlined"
              :color="theme.dark ? '' : 'accent'"
              @click="downloadDetails()"
            >
              Download application for {{ individualName }}
            </v-btn>
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <div v-bind="props">
                  <v-btn
                    class="text-none mt-2"
                    size="large"
                    block
                    variant="outlined"
                    :loading="loading"
                    :color="theme.dark ? '' : 'accent'"
                    @click="sendToParticipant()"
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
          </v-col>
        </v-col>
        <v-col cols="12" xs="12" class="text-center py-7">
          <a
            class="font_14 cursor-pointer"
            :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
            @click="f_saveAndCloseAllWindows()"
          >
            <b>Save and close, I'll do this later</b>
          </a>
        </v-col>
      </v-col>
    </v-row>
    <v-dialog v-model="closeDialog" persistent class="elevation-3" scrollable :eager="true" max-width="400px">
      <v-card>
        <v-card-text class="pt-5">
          <v-col cols="12" xs="12">
            <v-col class="text-center mb-4 mt-3">
              <h2>An email has been sent to this participant with a link to complete the application.</h2>
            </v-col>
            <v-col cols="12" xs="12" class="text-right">
              <a
                class="font_14 cursor-pointer"
                :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                @click="closeDialog = false"
              >
                <b>Close</b>
              </a>
            </v-col>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'

export default {
  props: ['saveAndCloseAllWindows', 'completeDetails'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const $toast = instance.appContext.config.globalProperties.$toast
    const individualName = ref('')
    const investmentsList = ref([])
    const opportunityId = ref('')
    const loading = ref(false)
    const closeDialog = ref(false)
    function f_saveAndCloseAllWindows() {
      if (props.saveAndCloseAllWindows) {
        props.saveAndCloseAllWindows()
      } else {
        emit('saveAndCloseAllWindows')
      }
    }
    function f_completeDetails() {
      emit('completeDetails')
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          $toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    function downloadDetails() {
      if (opportunityId.value) {
        $axios.post(`/api/v1/sfdc/opportunity/${opportunityId.value}/Agreement Sent`)
        $axios.post(`/api/v1/sfdc/opportunity/${opportunityId.value}/participant/Advisor downloaded enrollment form`)
        onPopUpEvent(`/api/v1/sfdc/opportunity/${opportunityId.value}/download`)
      }
    }
    function sendToParticipant() {
      loading.value = true
      $axios.post(`/api/v1/sfdc/opportunity/${opportunityId.value}/Agreement Sent`)
      $axios.post(`/api/v1/sfdc/opportunity/${opportunityId.value}/participant/Email enrollment link`).finally(() => {
        closeDialog.value = true
        loading.value = false
      })
    }
    onMounted(() => {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        individualName.value = $store.state.openAccountDetail.Name
        opportunityId.value = $store.state.openAccountDetail.OpportunityId
        $axios
          .get(
            `/api/v1/user/clientproductinvestment/${$store.state.openAccountDetail.ClientProduct}/opportunityfunds/${$store.state.openAccountDetail.OpportunityId}/getall`
          )
          .then((success) => {
            investmentsList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
          })
      }
    })
    return {
      theme,
      display,
      individualName,
      loading,
      closeDialog,
      f_completeDetails,
      downloadDetails,
      sendToParticipant,
      f_saveAndCloseAllWindows
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 300px;
}
</style>
