<template>
  <v-container fluid>
    <loader v-model="loading" :loading="loading" />
    <v-col lg12 xl12 md12 sm12 xs12 class="text-left pt-2">
      <h1 class="font-weight-medium">Market Opportunity Snapshot</h1>
    </v-col>
    <v-card class="mt-3">
      <v-container fluid>
        <v-col xl12 lg12 md12 sm12 xs12>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.xs ? 'xs12' : 'xs11'">
                  <v-text-field v-model="companyName" variant="outlined" label="Company Name" />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.mdAndDown ? 'xs12' : 'xs11'">
                  <v-text-field v-model="advisorName" label="Advisor Name" variant="outlined" />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.xs ? 'xs12' : 'xs11'">
                  <v-text-field v-model="mailingAddress" label="Mailing Address" variant="outlined" />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.mdAndDown ? 'xs12' : 'xs11'">
                  <v-text-field
                    v-model="zipcode"
                    v-input-mask="{
                      mask: '99999',
                      showMaskOnHover: false,
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    label="Zip Code"
                    maxlength="5"
                    :error="zipcodeError"
                    :error-messages="zipcodeErrorMsg"
                    required
                    :rules="[(v) => !!v || 'Zip Code is required']"
                    variant="outlined"
                    @change="getAddress()"
                  />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.xs ? 'xs12' : 'xs11'">
                  <v-text-field v-model="city" label="City" variant="outlined" />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.mdAndDown ? 'xs12' : 'xs11'">
                  <v-text-field v-model="state" label="State" variant="outlined" />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.xs ? 'xs12' : 'xs11'">
                  <v-text-field
                    v-model="phone"
                    v-input-mask="{
                      mask: '(999) 999-9999',
                      showMaskOnHover: false,
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false,
                      allowPlus: true
                    }"
                    label="Phone"
                    maxlength="15"
                    variant="outlined"
                  />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.mdAndDown ? 'xs12' : 'xs11'">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                    variant="outlined"
                  />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.xs ? 'xs12' : 'xs11'">
                  <v-text-field
                    v-model="advisors"
                    v-input-mask="{
                      alias: 'numeric',
                      digits: '0',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    label="# of Advisors"
                    required
                    :rules="[(v) => !!v || '# of Advisors is required']"
                    variant="outlined"
                  />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.mdAndDown ? 'xs12' : 'xs11'">
                  <v-text-field
                    v-model="averageFee"
                    v-input-mask="{
                      alias: 'numeric',
                      digits: '0',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    label="Average Fee"
                    hint="Basis Points"
                    persistent-hint
                    required
                    :rules="[(v) => !!v || 'Average Fee is required']"
                    variant="outlined"
                  />
                </v-col>
              </v-col>
              <v-col xl3 xs12 lg4 md6 sm6>
                <v-col :class="$vuetify?.breakpoint?.xs ? 'xs12' : 'xs11'">
                  <v-text-field
                    v-model="radius"
                    v-input-mask="{
                      alias: 'numeric',
                      digits: '0',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    label="Radius"
                    hint="Leave Blank or Zero for Automatic Radius (Minimum 1,500 Plans)"
                    persistent-hint
                    variant="outlined"
                  />
                </v-col>
              </v-col>
              <v-col class="text-right" xs12 pt-2>
                <v-btn variant="outlined" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="resetForm()"> Reset </v-btn>
                <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" :disabled="!valid" @click="saveSnapshot()">
                  Generate Report
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import Loader from '@/components/Loader'
export default {
  components: {
    Loader
  },
  data() {
    return {
      valid: true,
      companyName: '',
      advisorName: '',
      mailingAddress: '',
      city: '',
      state: '',
      zipcode: this.$store.state.user.zipCode,
      zipcodeError: false,
      zipcodeErrorMsg: '',
      phone: '',
      email: '',
      advisors: 1,
      averageFee: 5,
      radius: 0,
      loading: false,
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    }
  },
  mounted() {
    this.resetForm()
  },
  methods: {
    resetForm() {
      this.valid = true
      this.companyName = ''
      this.advisorName = ''
      this.mailingAddress = ''
      this.city = ''
      this.state = ''
      this.zipcode = this.$store.state.user.zipCode
      this.zipcodeError = false
      this.zipcodeErrorMsg = ''
      this.phone = ''
      this.email = ''
      this.advisors = 1
      this.averageFee = 5
      this.radius = 0
      this.loading = false
      this.$refs.form.resetValidation()
    },
    saveSnapshot() {
      if (this.$refs.form.validate()) {
        this.loading = true
        var reportRequest = {
          Zipcode: this.zipcode,
          Radius: this.radius,
          Advisors: this.advisors,
          AverageFee: this.averageFee,
          Company: this.companyName,
          AdvisorName: this.advisorName,
          Address: this.mailingAddress,
          City: this.city,
          State: this.state,
          Phone: this.phone,
          EmailAddress: this.email
        }
        this.$axios(`/api/v1/tal/report/marketopportunity`, {
          method: 'POST',
          data: reportRequest
        })
          // eslint-disable-next-line no-unused-vars
          .then((response) => {
            this.onPopUpEvent(
              `/api/v1/tal/report/marketopportunity/download?reportName=${encodeURIComponent(response.data.reportName)}`,
              response.data.reportName
            )
            this.loading = false
            this.resetForm()
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            this.loading = false
            this.resetForm()
          })
      }
    },
    getAddress() {
      var that = this
      if (this.zipcode) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${this.zipcode}` }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              var address = results[0].formatted_address.split(',')
              that.city = address[0].length > 0 ? address[0].trim() : ''
              that.state = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              that.zipcodeError = false
              that.zipcodeErrorMsg = ''
            } else {
              that.zipcodeError = false
              that.zipcodeErrorMsg = ''
            }
          } else {
            that.city = ''
            that.state = ''
            that.zipcodeError = true
            that.zipcodeErrorMsg = 'Invalid Zip Code'
          }
        })
      } else {
        that.city = ''
        that.state = ''
        that.zipcodeError = false
        that.zipcodeErrorMsg = ''
      }
    }
  }
}
</script>
