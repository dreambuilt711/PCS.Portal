<template>
  <v-col v-if="editFlag" xs12 lg12 pt-16 pb-12 class="justify-center">
    <v-dialog
      v-model="editFlag"
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
              <v-icon color="accent" @click="closeEditAdvisorDialog()"> close </v-icon>
            </v-col>
          </v-col>
        </v-card-title>
        <v-card-text :class="$vuetify?.breakpoint?.xs ? 'pa-2' : 'pa-0'">
          <v-row class="justify-center">
            <v-col lg12 class="text-center mt-2">
              <h1>{{ titleName }}</h1>
            </v-col>
            <v-col lg12 class="text-center text-h5" :class="addNewAdvisor === 1 ? 'py-4' : 'pt-2'">
              <h5 class="pb-2">
                {{ displayMessage }}
              </h5>
              <v-divider class="divider" />
            </v-col>
            <div v-if="loader" class="container pa-0">
              <v-card :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="350" width="100%">
                <Loader :loading-text="`Loading..`" :loading="loader" />
              </v-card>
            </div>
            <div
              v-if="!loader"
              class="container"
              :class="[addNewAdvisor === 1 ? 'pa-0' : 'px-6 py-0', $vuetify?.breakpoint?.xs ? 'pa-2' : '']"
            >
              <v-col v-if="editFlag">
                <v-form ref="form" v-model="valid">
                  <v-col class="text-h5" py-2>
                    <h5>Advisor Details</h5>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <v-col lg6 :class="!$vuetify?.breakpoint?.xs ? 'pr-2' : ''">
                        <v-text-field v-model="name" label="Advisor Name" variant="outlined" maxlength="140" density="compact" />
                      </v-col>
                      <v-col lg6 :class="!$vuetify?.breakpoint?.xs ? 'pl-2' : ''">
                        <v-text-field v-model="firm" label="Firm" variant="outlined" maxlength="140" density="compact" />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <v-col lg6 :class="!$vuetify?.breakpoint?.xs ? 'pr-2' : ''">
                        <v-text-field v-model="address1" label="Address 1" variant="outlined" maxlength="140" density="compact" />
                      </v-col>
                      <v-col lg6 :class="!$vuetify?.breakpoint?.xs ? 'pl-2' : ''">
                        <v-text-field v-model="address2" label="Address 2" variant="outlined" maxlength="140" density="compact" />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <v-col lg4 :class="!$vuetify?.breakpoint?.xs ? 'pr-2' : ''">
                        <v-text-field
                          v-model="zipcode"
                          density="compact"
                          placeholder="Zip Code"
                          single-line
                          variant="outlined"
                          maxlength="5"
                          hide-details
                          :error="zipcodeError"
                          :error-messages="zipcodeErrorMsg"
                          @keypress="onlyNumber"
                          @change="getAddress()"
                        />
                      </v-col>
                      <v-col lg4 :class="!$vuetify?.breakpoint?.xs ? 'pl-2 pr-2' : ''">
                        <v-text-field v-model="city" placeholder="City" variant="outlined" maxlength="140" density="compact" />
                      </v-col>
                      <v-col lg4 :class="!$vuetify?.breakpoint?.xs ? 'pl-2' : ''">
                        <v-select
                          v-model="state"
                          density="compact"
                          variant="outlined"
                          placeholder="State"
                          :items="stateList"
                          append-icon="icon-chevron-down"
                          hide-details
                          return-object
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <v-col lg6 :class="!$vuetify?.breakpoint?.xs ? 'pr-2' : ''">
                        <v-text-field
                          v-model="phone"
                          v-input-mask="{
                            mask: '(999)[ 999][-9999]',
                            showMaskOnHover: false,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false,
                            allowPlus: true,
                            autoUnmask: true
                          }"
                          placeholder="Contact Number"
                          variant="outlined"
                          density="compact"
                          single-line
                          :error="phoneError"
                          :error-messages="phoneErrorMsg"
                          @keyup="checkPhoneNumber()"
                        />
                      </v-col>
                      <v-col lg6 :class="!$vuetify?.breakpoint?.xs ? 'pl-2' : ''">
                        <v-text-field
                          v-model="email"
                          label="Email"
                          variant="outlined"
                          maxlength="140"
                          density="compact"
                          :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="text-center changeCheckboxColor" pb-2>
                    <v-checkbox
                      v-model="grantAuthorityValue"
                      hide-details
                      :ripple="false"
                      label="Grant limited trading authority"
                      class="mt-0"
                      color="accent"
                    />
                  </v-col>
                  <v-row class="justify-center pt-2">
                    <v-col xl2 lg4 md3 sm4 pt-1 class="text-center">
                      <v-btn
                        class="text-capitalize"
                        :color="$vuetify?.theme.dark ? '' : 'accent'"
                        :disabled="!valid"
                        @click="saveAndAddAdvisor()"
                      >
                        Save Changes
                      </v-btn>
                    </v-col>
                    <v-col class="text-center sm4 align-self-center">
                      <a class="font_16" :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']" @click="goBack()"
                        ><b>Cancel, go back</b>
                      </a>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import Loader from '@/components/NewLoader'
import planfinderlist from '@/assets/planfinder.json'
export default {
  components: {
    Loader
  },
  props: ['value', 'titleName', 'displayMessage', 'addNewAdvisor', 'contactDetails', 'contactId', 'grantAuthority'],
  data() {
    return {
      loader: false,
      stateList: planfinderlist.states,
      zipcode: '',
      zipcodeError: false,
      zipcodeErrorMsg: '',
      city: '',
      state: '',
      address1: '',
      address2: '',
      phone: '',
      email: '',
      name: '',
      firm: '',
      firmCRD: '',
      recordTypeId: '',
      presenter: '',
      phoneError: false,
      phoneErrorMsg: '',
      valid: true,
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    }
  },
  computed: {
    editFlag: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    dialogWidth() {
      if (this.$vuetify?.breakpoint?.xlOnly) return '55%'
      else if (this.$vuetify?.breakpoint?.lgOnly) return '70%'
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
    },
    grantAuthorityValue: {
      get() {
        return this.grantAuthority
      },
      set(value) {
        this.$emit('getGrantAuthority', value)
      }
    }
  },
  mounted() {
    this.editAdvisorContactInfo()
  },
  methods: {
    closeEditAdvisorDialog() {
      this.editFlag = false
      this.$emit('goBack')
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
              var stateCode = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              var stateName = ''
              if (stateCode) {
                stateName = that.stateList.filter((a) => a.value === stateCode)
              }
              that.state = stateName && stateName.length > 0 ? stateName[0].value : ''
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
    },
    checkPhoneNumber() {
      if (this.phone) {
        if (this.phone.length < 14) {
          this.phoneError = true
          this.phoneErrorMsg = 'Invalid Phone Number'
          return
        } else {
          this.phoneError = false
          this.phoneErrorMsg = ''
        }
      } else {
        this.phoneError = false
        this.phoneErrorMsg = ''
      }
    },
    goBack() {
      this.$emit('goBack')
    },
    editAdvisorContactInfo() {
      this.name = this.contactDetails.FirstName + ' ' + this.contactDetails.LastName
      this.firm = this.contactDetails.AccountName
      this.address1 = this.contactDetails.MailingStreet
      this.state = this.contactDetails.MailingState
      this.city = this.contactDetails.MailingCity
      this.zipcode = this.contactDetails.MailingPostalCode
      this.phone = this.contactDetails.Phone
      this.email = this.contactDetails.Email
    },
    saveAndAddAdvisor() {
      var firstName = this.name.split(' ')
      var saveLoggedInUserRequest = {
        FirstName: firstName[0],
        LastName: firstName[1],
        Address1: this.address1,
        Address2: this.address2,
        City: this.city,
        State: this.state,
        Zip: this.zipcode,
        Phone: this.phone,
        Email: this.email,
        contactId: this.contactId,
        AccountName: this.firm
      }
      this.$emit('saveAndAddAdvisor', saveLoggedInUserRequest)
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
