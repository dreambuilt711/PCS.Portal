<template>
  <v-col>
    <v-row no-gutters class="justify-center">
      <v-col xs12 lg6>
        <v-col xs12 class="text-center pt-8">
          <h1>{{ `${individualName}'s` }} account is almost set up</h1>
        </v-col>
        <v-col class="text-center pb-6 pt-10">
          <h2>
            {{ individualName }} needs to review, accept and sign the account agreements and disclosures in order to open the
            account.
          </h2>
        </v-col>
        <v-col class="text-center pb-6">
          <h2>Email {{ individualName }} the agreements and disclosures for signature.</h2>
        </v-col>
        <v-col class="text-center">
          <h2>Choose download application to finish the process offline.</h2>
        </v-col>
        <v-col xs12 pt-4 class="text-center">
          <v-row justify="center">
            <v-col cols="8" class="pa-0">
              <v-btn
                class="text-none"
                block
                size="large"
                :color="$vuetify?.theme.dark ? '' : 'accent'"
                @click="downloadDetails()"
              >
                Download Application
              </v-btn>
            </v-col>
            <!--   <v-col cols="8" class="pa-0">
              <v-btn
                class="text-none"
                block
                large
                :color="$vuetify?.theme.dark ? '' : 'accent'"
                @click="uploadApplication()"
                outlined
                >Upload Application & Supporting Documents</v-btn
              >
              <input
                type="file"
                style="display: none"
                id="pdfapplication"
                accept="application/pdf"
                @change="onFileSelected"
              />
            </v-col> -->
            <v-col cols="8" class="pa-0">
              <v-tooltip location="bottom">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-btn
                      class="text-none"
                      size="large"
                      block
                      variant="outlined"
                      :loading="loading"
                      :color="$vuetify?.theme.dark ? '' : 'accent'"
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
        </v-col>
        <v-col xs12 class="text-center" pt-6 pb-12>
          <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="saveAndCloseAllWindows()"
            ><b>Save and close, I'll do this later</b></a
          >
        </v-col>
      </v-col>
    </v-row>
    <v-dialog v-model="closeDialog" persistent class="elevation-3" scrollable :eager="true" max-width="400px">
      <v-card>
        <v-card-text class="pt-5">
          <v-col xs12>
            <v-col class="text-center mb-4 mt-3">
              <h2>An email has been sent to this participant with a link to complete the application.</h2>
            </v-col>
            <v-col xs12 class="text-right">
              <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeDialog = false"
                ><b>Close</b>
              </a>
            </v-col>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      individualName: '',
      closeDialog: false,
      opportunityId: '',
      loading: false
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.individualName = this.$store.state.openAccountDetail.FirstName + ' ' + this.$store.state.openAccountDetail.LastName
      this.opportunityId = this.$store.state.openAccountDetail.OpportunityId
    }
  },
  methods: {
    async onFileSelected(e) {
      const files = e.target.files
      if (files.length > 0) {
        if (files[0] !== undefined) {
          var extension = files[0].name.split('.').pop()
          if (extension === 'pdf') {
            var formData = new FormData()
            formData.append('content', files[0])
            this.$axios.post(`/api/v1/sfdc/opportunity/${this.opportunityId}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            this.opportunityId = ''
            this.$toast?.destroy()
            this.$toast.success('Upload Application successfully', '', this.notificationSystem.options.success)
          } else {
            this.opportunityId = ''
            this.$toast?.destroy()
            this.$toast.error(
              `${files[0].name}` + ' has an invalid extension. Only pdf files can be uploaded.',
              '',
              this.notificationSystem.options.error
            )
          }
        }
      }
    },
    uploadApplication() {
      if (this.opportunityId) {
        this.$axios.post(`/api/v1/sfdc/opportunity/${this.opportunityId}/Agreement Received`)
        document.getElementById('pdfapplication').click()
      }
    },
    sendToParticipant() {
      this.loading = true
      this.$axios.post(`/api/v1/sfdc/opportunity/${this.opportunityId}/Agreement Sent`)
      this.$axios.post(`/api/v1/sfdc/opportunity/${this.opportunityId}/participant/Email enrollment link`).finally(() => {
        this.closeDialog = true
        this.loading = false
      })
    },
    saveAndCloseAllWindows() {
      this.$emit('saveAndCloseAllWindows')
    },
    downloadDetails() {
      if (this.opportunityId) {
        this.$axios.post(`/api/v1/sfdc/opportunity/${this.opportunityId}/Agreement Sent`)
        this.$axios.post(`/api/v1/sfdc/opportunity/${this.opportunityId}/participant/Advisor downloaded enrollment form`)
        this.onPopUpEvent(`/api/v1/sfdc/opportunity/${this.opportunityId}/download`)
      }
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
