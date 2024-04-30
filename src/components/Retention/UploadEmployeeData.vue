<template>
  <v-dialog v-model="filterDialog" persistent class="elevation-3" scrollable :eager="true" :max-width="dialogWidth">
    <v-card>
      <v-card-title
        v-if="!showErrorScreen && !showSuccessScreen && !showWarningScreen"
        mt-2
        mb-2
        class="pt-2 pb-2"
        :class="$vuetify?.theme.dark ? '' : 'accent'"
      >
        <v-col xs12>
          <v-row v-if="!showErrorScreen && !showSuccessScreen && !showWarningScreen">
            <v-col xs11 class="text-secondary text-left">
              <h3>Upload Employee Data</h3>
            </v-col>
            <v-col class="text-right xs1">
              <v-icon class="cursor-pointer text-white" @click="closeDialog()"> close </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-card-title>
      <v-card-text class="justify-center align-center">
        <div class="container pa-0">
          <v-col v-if="!showErrorScreen && !showSuccessScreen && !showWarningScreen" xs12 class="justify-center">
            <v-col>
              <v-col class="text-center font-weight-medium" pt-8 pb-3 @click="displayMoreDetails()">
                <h2>Use the <b>employee data.csv</b> file to upload and add</h2>
                <h2>
                  multiple eployees to your prospect pipeline.
                  <v-icon color="hyperlink" :class="!showMoreDetails ? 'rotate_icon_plus_180' : 'rotate_icon_plus_0'">
                    icon-chevron-up
                  </v-icon>
                </h2>
              </v-col>
              <v-col v-if="showMoreDetails">
                <v-row class="justify-center">
                  <ol>
                    <li class="text-subtitle-2">
                      <v-col xs12 pt-2 pb-2>
                        <h2>
                          <a
                            :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                            class="text-capitalize"
                            @click="downloadForm()"
                            >Download the employee data.csv</a
                          >
                        </h2>
                      </v-col>
                    </li>
                    <li class="text-subtitle-2">
                      <v-col xs12 pt-2 pb-2>
                        <h2>Fill in employee information</h2>
                        <h2>(columns cannot be empty)</h2>
                      </v-col>
                    </li>
                    <li class="text-subtitle-2">
                      <v-col xs12 pt-2 pb-2>
                        <h2>Upload the updated .csv file</h2>
                      </v-col>
                    </li>
                  </ol>
                </v-row>
              </v-col>
              <v-col xs12 sm12 md12 xl12 lg12 pt-5 :class="$vuetify?.breakpoint?.mdAndUp ? 'mt-3' : 'align-self'">
                <v-card
                  height="100"
                  :class="{ dragging: isDragging }"
                  class="border elevation-3"
                  @dragenter="onDragEnter($event)"
                  @dragleave="onDragLeave($event)"
                  @dragover.prevent
                  @drop="onDrop($event)"
                >
                  <v-col>
                    <v-col class="dragdrop" :class="$vuetify?.theme.dark ? '' : 'border-color'">
                      <v-row class="justify-center">
                        <v-col v-if="fileDetails.length === 0" xs12 class="align-self text-center mt-5">
                          <v-col>
                            <h2>Drag and drop file here or</h2>
                          </v-col>
                          <v-col class="align-self text-center mt-2">
                            <a
                              class="font_14"
                              :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                              @click="pickFile"
                              ><b><u>Select files from your computer</u></b></a
                            >
                            <input
                              id="csvapplication"
                              type="file"
                              style="display: none"
                              accept="text/csv"
                              @change="onFileSelected"
                            />
                          </v-col>
                        </v-col>
                        <v-col v-if="fileDetails.length === 1" class="align-self text-center">
                          <v-text-field
                            v-model="fileName"
                            clearable
                            clear-icon="mdi-close-circle"
                            class="text-center fileNameClass"
                            @click:clear="clearMessage"
                          />
                          <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="pickFile"
                            ><b><u>Select a different file from your computer</u></b></a
                          >
                          <input
                            id="csvapplication"
                            type="file"
                            style="display: none"
                            accept="text/csv"
                            @change="onFileSelected"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-card>
              </v-col>
              <v-col xs12 pt-8 class="text-center">
                <v-btn
                  class="text-capitalize"
                  :disabled="fileDetails.length === 0"
                  :color="$vuetify?.theme.dark ? '' : 'accent'"
                  @click="onUploadSelectedFileClick()"
                >
                  Upload
                </v-btn>
              </v-col>
              <v-col xs12 class="text-center" py-4>
                <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeDialog()"
                  ><b>Cancel, close window</b></a
                >
              </v-col>
            </v-col>
          </v-col>
          <Loader :loading-text="`Uploading ..`" :loading="uploadLoader" />
          <v-col v-if="showErrorScreen" xs12 class="justify-center">
            <v-col>
              <v-col class="text-center" pt-8 pb-3>
                <h1 class="font-weight-medium">Something went wrong.</h1>
              </v-col>
              <v-col class="text-center" pt-5 pb-3>
                <h2 class="font-weight-medium">We were unable to upload the employee data.</h2>
              </v-col>
              <v-col>
                <v-row class="justify-center">
                  <ul>
                    <li>
                      <v-col xs12 pt-2 pb-2>
                        <h2 class="font-weight-medium">Check the employee data.csv file</h2>
                      </v-col>
                    </li>
                    <li>
                      <v-col xs12 pt-2 pb-2>
                        <h2 class="font-weight-medium">Make sure all columns are filled in</h2>
                      </v-col>
                    </li>
                    <li>
                      <v-col xs12 pt-2 pb-2>
                        <h2 class="font-weight-medium">Try uploading again</h2>
                      </v-col>
                    </li>
                  </ul>
                </v-row>
              </v-col>
              <v-col xs12 pt-8 class="text-center">
                <v-btn class="text-capitalize" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="tryAgain()">
                  Try Again
                </v-btn>
              </v-col>
              <v-col xs12 class="text-center" pt-4 pb-8>
                <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeDialog()"
                  ><b>Close, I'll do this later</b></a
                >
              </v-col>
            </v-col>
          </v-col>
          <v-col v-if="showSuccessScreen" xs12 class="justify-center">
            <v-row no-gutters class="justify-center">
              <v-col lg9>
                <v-col class="text-center" pt-8 pb-3>
                  <h1 class="font-weight-medium">All set!</h1>
                </v-col>
                <v-col class="text-center" pt-5 pb-3>
                  <h2 class="font-weight-medium">Your employee data was successfully</h2>
                  <h2 class="font-weight-medium">uploaded.</h2>
                </v-col>
                <v-col class="text-center" pt-3 pb-3>
                  <h2 class="font-weight-medium" style="color: green">
                    {{ fileUploadedDetails.length }} new prospects have been added to your prospect pipeline.
                  </h2>
                </v-col>
                <v-col xs12 pt-8 class="text-center">
                  <v-btn
                    class="text-capitalize"
                    :color="$vuetify?.theme.dark ? '' : 'accent'"
                    @click="goToPipeline('Participants')"
                  >
                    Go to pipeline
                  </v-btn>
                </v-col>
                <v-col xs12 class="text-center" pt-4 pb-8>
                  <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeDialog()"
                    ><b>Close, I'll do this later</b></a
                  >
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="showWarningScreen" xs12 class="justify-center">
            <v-col>
              <v-col class="text-center" pt-8>
                <h1 class="font-weight-medium">Something went wrong.</h1>
              </v-col>
              <v-col class="text-center" pt-4 pb-6>
                <h3 class="font-weight-medium">We were unable to create a record due to the following</h3>
                <h3 class="font-weight-medium">missing or incorrect data.</h3>
              </v-col>
              <v-col>
                <v-row class="justify-center">
                  <v-col xl6 lg8 md9 sm10 xs12>
                    <ul>
                      <li v-for="(item, index) in warningErrorMessage" :key="index - 1">
                        <v-col xs12 pt-2 pb-2>
                          <h3 class="font-weight-medium" style="color: red">
                            {{ item }}
                          </h3>
                        </v-col>
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs12 pt-8 class="text-center">
                <v-btn class="text-capitalize" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="tryAgain()">
                  Re-upload file
                </v-btn>
              </v-col>
              <v-col xs12 class="text-center" pt-4 pb-8>
                <a class="font_14" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeDialog()"
                  ><b>Close</b></a
                >
              </v-col>
            </v-col>
          </v-col>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Loader from '@/components/NewLoader'
export default {
  components: {
    Loader
  },
  props: ['value', 'sfplanid', 'plantypename'],
  data() {
    return {
      showMoreDetails: true,
      showErrorScreen: false,
      showSuccessScreen: false,
      rules: [(value) => !value || value.size > 50000000 || 'file size should be less than 50 MBS!'],
      fileDetails: '',
      recordTypeDetails: [],
      fileName: '',
      url: '',
      fileObject: null,
      cardResult: '',
      name: '',
      size: '',
      type: '',
      lastModifiedDate: '',
      uploadLoader: false,
      fileUploadedDetails: [],
      isDragging: false,
      showWarningScreen: false,
      warningErrorMessage: ''
    }
  },
  computed: {
    filterDialog: {
      get() {
        if (this.value) {
          this.getRecordTypeId()
        }
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    dialogWidth() {
      if (this.$vuetify?.breakpoint?.xlOnly) return '40%'
      else if (this.$vuetify?.breakpoint?.lgOnly) return '35%'
      else if (this.$vuetify?.breakpoint?.xs) return '90%'
      else return '50%'
    }
  },
  methods: {
    displayMoreDetails() {
      this.showMoreDetails = !this.showMoreDetails
    },
    closeDialog() {
      this.filterDialog = false
    },
    pickFile() {
      document.getElementById('csvapplication').click()
    },
    getRecordTypeId() {
      this.$axios.get(`/api/v1/sfdc/opportunity/opportunityrecordtypes`).then((success) => {
        if (success.data != null) {
          this.recordTypeDetails = success.data
        }
      })
    },
    clearMessage() {
      this.fileDetails = []
    },
    async onFileSelected(e) {
      const files = e.target.files
      if (files.length > 0) {
        if (files[0] !== undefined) {
          var extension = files[0].name.split('.').pop()
          if (extension === 'csv') {
            this.fileDetails = e.target.files
            this.fileName = files[0].name

            // Check validity of file
            if (this.fileName.lastIndexOf('.') <= 0) {
              return
            }
            // If valid, continue
            const fr = new FileReader()
            fr.readAsDataURL(files[0])
            fr.addEventListener('load', () => {
              this.url = fr.result
              this.fileObject = files[0] // this is an file that can be sent to server...
            })
          } else {
            this.fileObject = null
            this.url = ''
            this.$toast?.destroy()
            this.$toast.error(
              `${files[0].name}` + ' has an invalid extension. Only csv files can be uploaded.',
              '',
              this.notificationSystem.options.error
            )
          }
        }
      }
    },
    tryAgain() {
      this.showErrorScreen = false
      this.showSuccessScreen = false
      this.showWarningScreen = false
      this.fileDetails = []
    },
    goToPipeline(type) {
      this.$router
        .push({
          name: 'TALProspectPlans',
          params: { Type: type }
        })
        .catch(() => {})
    },
    downloadForm() {
      let csv = '\ufeff' + 'firstname,lastname,email,phone,streetaddress,city,state,zipcode,birthday,ssn,hiredate\n'
      var blob = new Blob([csv], { type: 'csv/plain' })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'uploadtemplate.csv'
      link.click()
    },
    onPickFile() {
      this.$refs.fileInput.click()
    },
    onUploadSelectedFileClick() {
      //console.log(this.planid)
      // console.log(this.plantypename)
      this.uploadLoader = true
      //console.log(this.fileObject)
      var typeData = this.recordTypeDetails.filter((a) => a.OpportunityRecordsType === 'Application and agreement')
      // A file is not chosen!
      if (!this.fileObject) {
        this.$toast?.destroy()
        this.$toast.info('No file Selected', '', this.notificationSystem.options.info)
        return
      }
      // DO YOUR JOB HERE with fileObjectToUpload
      var formData = new FormData()
      formData.append('content', this.fileObject)
      this.$axios
        .post(
          `/api/v1/sfdc/individual/census/${typeData[0].RecordTypeId}/${typeData[0].OpportunityRecordsType}/${this.sfplanid}/${this.plantypename}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then((success) => {
          if (success.data.d) {
            this.fileUploadedDetails = success.data.d.data
            this.uploadLoader = false
            if (success.data.d.errorMessage) {
              this.showWarningScreen = true
              var errorMessageDetails = success.data.d.errorMessage ? success.data.d.errorMessage.split('\r\n') : []
              this.warningErrorMessage = errorMessageDetails
            } else {
              this.showSuccessScreen = true
              this.showWarningScreen = false
              this.showErrorScreen = false
            }
            // DO YOUR JOB HERE with fileObjectToUpload
          } else {
            this.showErrorScreen = true
            this.showSuccessScreen = false
            this.showWarningScreen = false
            this.uploadLoader = false
            if (success.data.d.errorMessage) {
              this.$toast?.destroy()
              this.$toast.error(`${success.data.d.errorMessage}`, '', this.notificationSystem.options.error)
            }
          }
        })
        .catch(() => {
          this.uploadLoader = false
          this.showErrorScreen = true
          this.showSuccessScreen = false
          this.showWarningScreen = false
        })
    },
    onDragEnter($event) {
      $event.preventDefault()
      this.isDragging = true
    },
    onDragLeave($event) {
      $event.preventDefault()
      this.isDragging = false
    },
    onDrop($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.isDragging = false
      const files = $event.dataTransfer.files
      if (files.length > 0) if (!this.validateFileType(files[0].type)) return
      Array.from(files).forEach((file) => this.addCSVFile(file))
    },
    validateFileType(type) {
      if (type !== 'text/csv') {
        this.$toast?.destroy()
        this.$toast.error('File type is not supported', '', this.notificationSystem.options.error)
        return false
      }
      return true
    },
    async addCSVFile(file) {
      if (file !== undefined) {
        this.files = []
        this.files.push(file)
        this.Filetype = this.files[0].type
        if (!this.validateFileType(this.Filetype)) {
          this.fileData = ''
          return
        }

        this.fileDetails = this.files
        this.fileName = this.files[0].name

        // Check validity of file
        if (this.fileName.lastIndexOf('.') <= 0) {
          return
        }
        // If valid, continue
        const fr = new FileReader()
        fr.readAsDataURL(this.files[0])
        fr.addEventListener('load', () => {
          this.url = fr.result
          this.fileObject = this.files[0] // this is an file that can be sent to server...
        })
      }
    }
  }
}
</script>
<style scoped>
.dragdrop {
  border: solid 2px !important;
  border-radius: 5px;
  border-color: #0077cc !important;
  height: 100px !important;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
<style>
.fileNameClass .v-icon {
  color: #cc0000 !important;
  /* padding-right: 50px !important; */
}
.fileNameClass .v-text-field__slot {
  padding-left: 150px !important;
}
</style>
