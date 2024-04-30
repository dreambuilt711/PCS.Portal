<template>
  <v-flex v-if="addBeneficiaryDialog" xs12 lg12 pt-16 pb-12 class="justify-center">
    <v-dialog
      v-model="addBeneficiaryDialog"
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
          <v-flex xs12>
            <v-flex class="text-right">
              <v-icon color="accent" @click="closeAddBeneficiaryDialog()">close</v-icon>
            </v-flex>
          </v-flex>
        </v-card-title>
        <v-card-text :class="$vuetify.breakpoint.xs ? 'pa-2' : 'px-2 py-0'">
          <v-row class="justify-center">
            <v-flex xs12 lg9 class="justify-center">
              <v-flex xs12 class="text-center">
                <h1>{{ addOrEditText }} Beneficiary</h1>
              </v-flex>
              <v-flex xs12 class="text-center" pb-2 pt-2>
                <h3>{{ addOrEditText }} details of the Beneficiary to include in the proposal</h3>
              </v-flex>
              <div class="container pa-0" v-if="loader">
                <v-card :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                  <Loader :loadingText="`Loading..`" :loading="loader" />
                </v-card>
              </div>
              <v-form ref="form" v-model="valid" v-if="!loader">
                <v-flex py-1>
                  <v-row>
                    <div class="text-h6 pb-1">Beneficiary Details</div>
                    <v-row>
                      <v-flex sm4 xs12 :class="$vuetify.breakpoint.xs ? '' : 'pr-2'">
                        <v-select
                          density="compact"
                          v-model="beneficiaryType"
                          placeholder="Beneficiary Type *"
                          :items="beneficiaryItems"
                          variant="outlined"
                          hide-details
                          required
                          :rules="[(v) => !!v || 'Beneficiary Type is required']"
                        ></v-select>
                      </v-flex>
                      <v-flex sm5 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                        <v-select
                          density="compact"
                          v-model="relationshipType"
                          placeholder="Select Relationship Type *"
                          :items="relationshipTypeItems"
                          variant="outlined"
                          hide-details
                          required
                          :rules="[(v) => !!v || 'Relationship Type is required']"
                        ></v-select>
                      </v-flex>
                      <v-flex sm3 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : ''">
                        <v-text-field
                          v-model="allocation"
                          placeholder="Allocation *"
                          :rules="[(v) => !!v || 'Allocation is required']"
                          variant="outlined"
                          suffix="%"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '0',
                            max: '100',
                            min: '0',
                            rightAlign: false,
                            allowMinus: false,
                            placeholder: '0',
                            autoUnmask: true
                          }"
                          density="compact"
                          single-line
                          hide-details
                          required
                        ></v-text-field>
                      </v-flex>
                    </v-row>
                    <v-row class="pt-2">
                      <v-flex sm4 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                        <v-text-field
                          v-model="firstName"
                          placeholder="First Name *"
                          required
                          variant="outlined"
                          maxlength="140"
                          density="compact"
                          single-line
                          :rules="[(v) => !!v || 'First Name is required']"
                          hide-details
                        ></v-text-field>
                      </v-flex>
                      <v-flex sm2 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                        <v-text-field
                          v-model="middleName"
                          placeholder="M.i."
                          variant="outlined"
                          maxlength="140"
                          density="compact"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-flex>
                      <v-flex sm4 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                        <v-text-field
                          v-model="lastName"
                          placeholder="Last Name *"
                          required
                          variant="outlined"
                          maxlength="140"
                          density="compact"
                          single-line
                          :rules="[(v) => !!v || 'Last Name is required']"
                          hide-details
                        ></v-text-field>
                      </v-flex>
                      <v-flex sm2 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : ''">
                        <v-text-field
                          v-model="suffix"
                          placeholder="Suffix"
                          required
                          variant="outlined"
                          maxlength="140"
                          density="compact"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-flex>
                    </v-row>
                  </v-row>
                  <v-row>
                    <v-flex xs12 sm5 pr-2>
                      <v-row>
                        <div class="text-h6 pb-1 pt-2">Date of Birth *</div>
                        <v-flex xs12>
                          <!-- <v-menu
                            v-model="menu1"
                            :close-on-content-click="false"
                            allow-overflow
                            transition="scale-transition"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                density="compact"
                                v-model="birthDate"
                                @update:model-value="dateBirth = parseBirthDate(birthDate)"
                                
                                @blur="checkBirthDate(birthDate)"
                                :error-messages="checkBirthDateErrorMsg"
                                :error="checkBirthDateError"
                                :hide-details="!checkBirthDateError"
                                variant="outlined"
                                required
                                :rules="[(v) => !!v || 'Date of Birth is required']"
                                v-input-mask="{
                                  alias: 'datetime',
                                  inputFormat: 'mm/dd/yyyy',
                                  max: maxBirthDate
                                }"
                              >
                                <v-icon v-bind="props" slot="append">event</v-icon>
                              </v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dateBirth"
                              @input="menu1 = false"
                              color="accent"
                              :max="maxDate"
                            ></v-date-picker>
                          </v-menu> -->
                        </v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xs12 sm7>
                      <div class="text-h6 pb-1 pt-2 align-self">
                        Social Security Number *<v-icon class="icon-secure ml-1" size="18" color="#0077CC"></v-icon>
                      </div>
                      <v-flex xs12>
                        <v-row>
                          <v-flex xs12 class="pr-1">
                            <v-text-field
                              v-model="ssnFirstDigit"
                              single-line
                              variant="outlined"
                              density="compact"
                              hide-details
                              maxlength="15"
                              required
                              :rules="[(v) => (v != '' ? ssnRegex.test(v) || 'Invalid SSN' : !v)]"
                              v-input-mask="{
                                mask: '999-99-9999',
                                showMaskOnHover: false,
                                rightAlign: false,
                                placeholder: '',
                                allowMinus: false,
                                allowPlus: false,
                                autoUnmask: true
                              }"
                              :error="ssnError"
                              :error-messages="ssnErrorMsg"
                              @keyup="checkSSN()"
                            ></v-text-field>
                          </v-flex>
                        </v-row>
                      </v-flex>
                    </v-flex>
                  </v-row>
                  <v-row class="pt-2">
                    <v-flex sm5 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        v-model="email"
                        placeholder="Email Address"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                        :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                      ></v-text-field>
                    </v-flex>
                    <v-flex sm4 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        v-model="phoneNumber"
                        placeholder="(123) 456-7890"
                        variant="outlined"
                        maxlength="15"
                        density="compact"
                        single-line
                        hide-details
                        v-input-mask="{
                          mask: '(999)[ 999][-9999]',
                          showMaskOnHover: false,
                          rightAlign: false,
                          placeholder: '',
                          allowMinus: false,
                          allowPlus: true,
                          autoUnmask: true
                        }"
                        :error="phoneError"
                        :error-messages="phoneErrorMsg"
                        @keyup="checkPhoneNumber()"
                      ></v-text-field>
                    </v-flex>
                    <v-flex sm3 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : ''">
                      <v-select
                        density="compact"
                        v-model="phoneType"
                        :items="phoneTypeList"
                        variant="outlined"
                        hide-details
                        append-icon="icon-chevron-down"
                      ></v-select>
                    </v-flex>
                    <v-flex sm12 xs12 pb-2 class="pt-2">
                      <v-text-field
                        v-model="streetAddress"
                        placeholder="Street Address"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex sm4 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        v-model="zipcode"
                        placeholder="Zip Code"
                        single-line
                        maxlength="5"
                        density="compact"
                        @change="getAddress()"
                        v-input-mask="{
                          mask: '99999',
                          rightAlign: false,
                          placeholder: '',
                          allowMinus: false
                        }"
                        :error="zipcodeError"
                        variant="outlined"
                        :error-messages="zipcodeErrorMsg"
                      ></v-text-field>
                    </v-flex>
                    <v-flex sm5 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        density="compact"
                        placeholder="City"
                        v-model="city"
                        single-line
                        variant="outlined"
                        hide-details
                      ></v-text-field>
                    </v-flex>
                    <v-flex sm3 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : ''">
                      <v-select
                        density="compact"
                        variant="outlined"
                        placeholder="State"
                        v-model="stateValue"
                        :items="stateList"
                        append-icon="icon-chevron-down"
                        hide-details
                        return-object
                      ></v-select>
                    </v-flex>
                  </v-row>
                </v-flex>
                <v-row
                  justify="center"
                  :class="
                    !$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant'
                      ? ''
                      : 'mb-5'
                  "
                >
                  <v-flex class="flex_none mr-3">
                    <v-btn
                      class="text-capitalize pl-11 pr-11"
                      size="x-large"
                      :color="$vuetify.theme.dark ? '' : 'accent'"
                      @click="addBeneficiaryDetails()"
                      :disabled="!valid"
                      >{{ addOrEditText === 'Edit' ? 'Save Changes' : addOrEditText + ' Beneficiary' }}</v-btn
                    >
                  </v-flex>
                  <v-flex class="align-self ml-3 flex_none">
                    <a
                      :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white', 'font_14']"
                      @click="closeAddBeneficiaryDialog()"
                      ><b>Cancel</b></a
                    >
                  </v-flex>
                </v-row>
              </v-form>
            </v-flex>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-flex>
</template>
<script>
import planfinderlist from '@/assets/planfinder.json'
import Loader from '@/components/NewLoader'
import { eventBus } from '@/main'
export default {
  data() {
    return {
      valid: false,
      beneficiaryType: '',
      relationshipType: '',
      allocation: '',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      dateOfBirth: '',
      ssn: '',
      email: '',
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      phoneNumber: '',
      phoneType: 'Home',
      streetAddress: '',
      zipcode: '',
      city: '',
      stateValue: '',
      beneficiaryItems: [
        { text: 'Primary', value: 'Primary' },
        { text: 'Contingent', value: 'Contingent' }
      ],
      relationshipTypeItems: [
        { text: 'Child', value: 'Child' },
        { text: 'Spouse', value: 'Spouse' },
        { text: 'Non-spouse', value: 'Non-spouse' },
        { text: 'Entity', value: 'Entity' }
      ],
      beneficiaryAdd: false,
      openTranferBalanceDialog: false,
      name: '',
      benefitype: '',
      relationType: '',
      allocType: '',
      emailAdd: '',
      phno: '',
      phoneTypeList: [
        { text: 'Home', value: 'Home' },
        { text: 'Mobile', value: 'Mobile' }
      ],
      checkBirthDateError: false,
      checkBirthDateErrorMsg: '',
      stateList: planfinderlist.states,
      ssnFirstDigit: '',
      dateBirth: null,
      menu1: false,
      birthDate: '',
      isBirthDate: false,
      beneficiaryID: '',
      zipcodeError: false,
      zipcodeErrorMsg: '',
      loader: false,
      phoneError: false,
      phoneErrorMsg: '',
      ssnError: false,
      ssnErrorMsg: '',
      ssnRegex:
        /^((?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\d{2})\d{3} (?!00)\d{2} (?!0{4})\d{4})|((?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4})$/
    }
  },
  components: {
    Loader
  },
  props: ['value', 'addOrEditText', 'registrationId'],
  computed: {
    addBeneficiaryDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    dialogWidth() {
      if (this.$vuetify.breakpoint.xlOnly) return '55%'
      else if (this.$vuetify.breakpoint.lgOnly) return '70%'
      else return '90%'
    },
    maxDate() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    },
    maxBirthDate() {
      var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
      const [year, month, day] = today.split('-')
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    },
    dialogPositionNew() {
      if (!this.$store.state.user.temporarySessionType || this.$store.state.user.temporarySessionType !== 'Participant') {
        if (this.$vuetify.breakpoint.xlOnly) {
          return `dialogBigScreen`
        } else if (this.$vuetify.breakpoint.lgOnly) {
          return `dialoglgScreen`
        } else if (this.$vuetify.breakpoint.mdOnly) return `dialogMdScreen`
        else if (this.$vuetify.breakpoint.smOnly) return `dialogSmScreen`
        else return `dialoglgScreen`
      } else return 'auto'
    }
  },
  watch: {
    dateBirth: {
      handler() {
        if (!this.isBirthDate) this.birthDate = this.formatDate(this.dateBirth)
        this.isBirthDate = false
      },
      immediate: true,
      deep: true
    },
    menu1: {
      handler(val) {
        if (!val) {
          this.checkBirthDate(this.birthDate)
        }
      }
    }
  },
  mounted() {
    eventBus.$on('beneficiaryData', (data) => {
      this.getBeneficiaryDetails(data)
      this.beneficiaryID = data
    })
    eventBus.$on('resetData', () => {
      this.resetDetails()
    })
  },
  methods: {
    closeAddBeneficiaryDialog() {
      this.addBeneficiaryDialog = false
      this.$emit('closeAddBeneficiaryDialog')
    },
    addBeneficiaryDetails() {
      if (this.ssnFirstDigit) {
        var ssnNumber = this.ssnFirstDigit
      }
      var beneficiaryFormDetails = {
        FirstName: this.firstName ? this.firstName : '',
        MiddleInitials: this.middleName ? this.middleName : '',
        LastName: this.lastName ? this.lastName : '',
        Suffix: this.suffix ? this.suffix : '',
        SSN: ssnNumber ? ssnNumber : '',
        DateOfBirth: this.birthDate ? this.birthDate : '',
        Email: this.email ? this.email : '',
        HomePhone: this.phoneType === 'Home' ? this.phoneNumber : '',
        MobilePhone: this.phoneType === 'Mobile' ? this.phoneNumber : '',
        BeneficiaryRelationship: this.relationshipType ? this.relationshipType : '',
        BeneficiaryPercent: this.allocation ? parseFloat(this.allocation) : 0,
        BeneficiaryType: this.beneficiaryType ? this.beneficiaryType : '',
        SteetAddress: this.streetAddress ? this.streetAddress : '',
        Zipcode: this.zipcode ? this.zipcode : '',
        City: this.city ? this.city : '',
        State: this.stateValue.value ? this.stateValue.value : this.stateValue ? this.stateValue : '',
        Country: '',
        RegistrationId: this.registrationId ? this.registrationId : '',
        Plan: '',
        ID: this.addOrEditText === 'Edit' ? this.beneficiaryID : ''
      }
      this.$emit('addBeneficiaryDetails', beneficiaryFormDetails)
    },
    parseBirthDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        this.isBirthDate = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    checkBirthDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          this.birthDate = ''
          this.checkBirthDateErrorMsg = 'Invalid date'
          this.checkBirthDateError = true
        } else {
          var birth = new Date(val)
          var today = new Date()
          var age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000))
          if (age > 100) {
            this.birthDate = ''
            this.checkBirthDateErrorMsg = 'Enter valid date'
            this.checkBirthDateError = true
            return
          } else {
            this.checkBirthDateError = false
            this.checkBirthDateErrorMsg = ''
          }
        }
      }
    },
    getBeneficiaryDetails(data) {
      this.loader = true
      this.$axios.get(`/api/v1/sfdc/beneficiary/${data}`).then((success) => {
        var beneficiariesDetails = success.data.d
        if (beneficiariesDetails != null) {
          var firstName = beneficiariesDetails.Name.split(' ')
          this.firstName = firstName[0] ? firstName[0] : ''
          this.middleName = firstName[1] ? firstName[1] : ''
          this.lastName = firstName[2] ? firstName[2] : ''
          this.suffix = firstName[3] ? firstName[3] : ''
          this.ssnFirstDigit = beneficiariesDetails.SSN ? beneficiariesDetails.SSN : ''
          this.relationshipType = beneficiariesDetails.BeneficiaryRelationship ? beneficiariesDetails.BeneficiaryRelationship : ''
          this.beneficiaryType = beneficiariesDetails.BeneficiaryType ? beneficiariesDetails.BeneficiaryType : ''
          this.allocation = beneficiariesDetails.BeneficiaryPercent ? beneficiariesDetails.BeneficiaryPercent : ''
          this.streetAddress = beneficiariesDetails.SteetAddress ? beneficiariesDetails.SteetAddress : ''
          this.zipcode = beneficiariesDetails.Zipcode ? beneficiariesDetails.Zipcode : ''
          this.city = beneficiariesDetails.City ? beneficiariesDetails.City : ''
          this.stateValue = beneficiariesDetails.State ? beneficiariesDetails.State : ''
          this.phoneNumber = beneficiariesDetails.HomePhone ? beneficiariesDetails.HomePhone : beneficiariesDetails.MobilePhone
          this.email = beneficiariesDetails.Email ? beneficiariesDetails.Email : ''
          this.birthDate = beneficiariesDetails.DateOfBirth ? beneficiariesDetails.DateOfBirth : ''
          this.loader = false
        }
      })
    },
    resetDetails() {
      this.firstName = ''
      this.middleName = ''
      this.lastName = ''
      this.suffix = ''
      this.ssnFirstDigit = ''
      this.relationshipType = ''
      this.beneficiaryType = ''
      this.allocation = ''
      this.streetAddress = ''
      this.zipcode = ''
      this.city = ''
      this.stateValue = ''
      this.phoneNumber = ''
      this.email = ''
      this.birthDate = ''
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
              that.stateValue = stateName && stateName.length > 0 ? stateName[0] : ''
              that.zipcodeError = false
              that.zipcodeErrorMsg = ''
            } else {
              that.zipcodeError = false
              that.zipcodeErrorMsg = ''
            }
          } else {
            that.city = ''
            that.stateValue = ''
            that.zipcodeError = true
            that.zipcodeErrorMsg = 'Invalid Zip Code'
          }
        })
      } else {
        that.city = ''
        that.stateValue = ''
        that.zipcodeError = false
        that.zipcodeErrorMsg = ''
      }
    },
    checkPhoneNumber() {
      if (this.phoneNumber) {
        var phoneNumberData = this.phoneNumber.replace(/[^0-9/\\.]/g, '')
        if (phoneNumberData.length < 10) {
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
    checkSSN() {
      if (this.ssnFirstDigit) {
        var ssnData = this.ssnFirstDigit.replace(/[^0-9/\\.]/g, '')
        if (ssnData.length < 9) {
          this.ssnError = true
          this.ssnErrorMsg = 'Invalid SSN'
          return
        } else {
          this.ssnError = false
          this.ssnErrorMsg = ''
        }
      } else {
        this.ssnError = false
        this.ssnErrorMsg = ''
      }
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
