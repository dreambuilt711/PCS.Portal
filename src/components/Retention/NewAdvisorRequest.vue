<template>
  <v-col v-if="newAdvisorRequestDialog" xs12 lg12 pt-16 pb-12 class="justify-center">
    <v-dialog
      v-model="newAdvisorRequestDialog"
      persistent
      class="elevation-3"
      :class="dialogPositionNew"
      :content-class="dialogPositionNew"
      scrollable
      :eager="true"
      :max-width="dialogWidth"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <v-col xs12>
            <v-col class="text-right">
              <v-icon color="accent" @click="closeNewAdvisorRequestDialog(0)"> close </v-icon>
            </v-col>
          </v-col>
        </v-card-title>
        <v-card-text :class="$vuetify?.breakpoint?.xs ? 'pa-2' : 'px-2 py-0'">
          <v-row class="justify-center">
            <v-col v-if="displayPage === 0" xs12 lg11 class="justify-center">
              <v-col xs12 class="text-center">
                <h1>New Advisor Request</h1>
              </v-col>
              <v-col xs12 class="text-center" pb-2 pt-2>
                <h3>Please review and update the following</h3>
                <h3>information before submitting your request.</h3>
              </v-col>
              <div v-if="loader" class="container pa-0">
                <v-card :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                  <Loader :loading-text="`Loading..`" :loading="loader" />
                </v-card>
              </div>
              <v-form v-if="!loader" ref="form" v-model="valid">
                <v-col py-3>
                  <v-row class="pt-2">
                    <v-col sm6 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pr-2'">
                      <div class="text-h6 pb-1">First Name</div>
                      <v-text-field
                        v-model="firstName"
                        placeholder="First Name"
                        required
                        variant="outlined"
                        maxlength="140"
                        density="compact"
                        single-line
                        :rules="[(v) => !!v || 'First Name is required']"
                        hide-details
                      />
                    </v-col>
                    <v-col sm6 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pr-2'">
                      <div class="text-h6 pb-1">Last Name</div>
                      <v-text-field
                        v-model="lastName"
                        placeholder="Last Name"
                        required
                        variant="outlined"
                        maxlength="140"
                        density="compact"
                        single-line
                        :rules="[(v) => !!v || 'Last Name is required']"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-row class="pt-2">
                    <v-col sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pr-2'">
                      <div class="text-h6 pb-1">CRD#</div>
                      <v-text-field
                        v-model="crdNumber"
                        placeholder="CRD#"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                    <v-col sm8 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pr-2'">
                      <div class="text-h6 pb-1">Email</div>
                      <v-text-field
                        v-model="email"
                        placeholder="Email Address"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                        :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="pt-2">
                    <v-col sm12 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pr-2'">
                      <div class="text-h6 pb-1">Plan Name</div>
                      <v-text-field
                        v-model="planName"
                        placeholder="Plan Name"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-row justify="center" :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pt-8'">
                  <v-col class="flex_none mr-3">
                    <v-btn
                      class="text-capitalize pl-11 pr-11"
                      size="x-large"
                      :color="$vuetify?.theme.dark ? '' : 'accent'"
                      :disabled="!valid"
                      @click="SaveAdvisorRequest()"
                    >
                      Submit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-col v-if="displayPage === 1" xs12 lg6 class="justify-center">
              <v-col xs12 class="text-center pt-12 mt-10">
                <h1 class="font-weight-bold">Request submitted!</h1>
              </v-col>
              <v-col xs12 class="text-center" pb-1 pt-12>
                <h3 class="font-weight-bold">Thank you for your interest!</h3>
              </v-col>
              <v-col xs12 class="text-center" pb-12 pt-1>
                <h3 class="font-weight-bold">A sales team member should reach out to you shortly.</h3>
              </v-col>
              <v-row justify="center">
                <v-col class="flex_none mr-3">
                  <v-btn
                    class="text-capitalize pl-11 pr-11"
                    size="x-large"
                    :color="$vuetify?.theme.dark ? '' : 'accent'"
                    @click="closeNewAdvisorRequestDialog(displayPage)"
                  >
                    Close
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import Loader from '@/components/NewLoader'
export default {
  components: {
    Loader
  },
  props: ['value', 'planNameDetails'],
  data() {
    return {
      valid: false,
      firstName: '',
      lastName: '',
      crdNumber: '',
      email: '',
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      planName: '',
      displayPage: 0,
      loader: false,
      contactId: '',
      contactDetails: [],
      seinno: ''
    }
  },
  computed: {
    newAdvisorRequestDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    dialogWidth() {
      if (this.$vuetify?.breakpoint?.xlOnly) return '55%'
      else if (this.$vuetify?.breakpoint?.lgOnly) return '35%'
      else return '90%'
    },
    dialogPositionNew() {
      if (this.$vuetify?.breakpoint?.xlOnly) {
        return `dialogBigScreen`
      } else if (this.$vuetify?.breakpoint?.lgOnly) {
        return `dialoglgScreen`
      } else if (this.$vuetify?.breakpoint?.mdOnly) return `dialogMdScreen`
      else if (this.$vuetify?.breakpoint?.smOnly) return `dialogSmScreen`
      else return `dialoglgScreen`
    }
  },
  watch: {
    planNameDetails: {
      handler(val) {
        this.planName = val.PNAME
        this.seinno = val.SEINPNO
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getContactInfo()
  },
  methods: {
    closeNewAdvisorRequestDialog(val) {
      if (val === 1) {
        this.displayPage = 0
      }
      this.newAdvisorRequestDialog = false
    },
    SaveAdvisorRequest() {
      this.displayPage = 1
      this.loader = true
      if (this.$refs.form.validate()) {
        var LivePlanObj = {
          AdvisorName: this.contactDetails ? this.contactDetails.FirstName + ' ' + this.contactDetails.LastName : '',
          AdvisorEmail: this.email,
          AdvisorCrd: this.crdNumber,
          Seinpno: this.seinno
        }
        this.$axios.post(`/api/v1/tal/liveplan/report`, LivePlanObj).then((success) => {
          this.loader = false
          if (success.data.d != null) {
            this.$toast.success('Saved Successfully', '', this.notificationSystem.options.success)
          }
        })
      }
    },
    getContactInfo() {
      this.loader = true
      this.contactId = this.$store.state.user.contactId
      this.$axios
        .get(`/api/v1/sfdc/${this.contactId}/contact`)
        .then((success) => {
          if (success.data.d) {
            this.contactDetails = success.data.d
            this.firstName = this.contactDetails ? this.contactDetails.FirstName : ''
            this.lastName = this.contactDetails ? this.contactDetails.LastName : ''
            this.email = this.contactDetails ? this.contactDetails.Email : ''
            this.crdNumber = this.contactDetails ? this.contactDetails.crd : ''
            this.loader = false
          } else {
            this.loader = false
          }
        })
        .catch(() => {
          this.loader = false
        })
    }
  }
}
</script>
<style scoped></style>
