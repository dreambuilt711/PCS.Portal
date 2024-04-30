<template>
  <v-col>
    <v-card
      class="mb-1 mt-1 elevation-6"
      :height="$vuetify?.breakpoint?.xs ? 'auto' : '560px'"
      :class="$vuetify?.breakpoint?.xs ? 'ml-1 mr-1' : 'ml-6 mr-6'"
    >
      <v-col xs12>
        <v-row justify="center">
          <v-col xs11 lg8 class="justify-center">
            <v-col xs12 class="text-center mb-2 mt-6">
              <h1 class="welcomeFont">First, tell us about yourself</h1>
            </v-col>
            <v-form ref="form" v-model="valid">
              <v-col pt-4 pb-6>
                <div class="sub-title pb-1">
                  <span class="font-weight-medium">Personal Information</span> (all fields are required)
                </div>
                <v-row>
                  <v-col sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
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
                  <v-col sm2 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                    <v-text-field
                      v-model="middleName"
                      placeholder="M.i."
                      variant="outlined"
                      maxlength="140"
                      density="compact"
                      single-line
                      hide-details
                    />
                  </v-col>
                  <v-col sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
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
                  <v-col sm2 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : ''">
                    <v-text-field
                      v-model="suffix"
                      placeholder="Suffix"
                      required
                      variant="outlined"
                      maxlength="140"
                      density="compact"
                      single-line
                      hide-details
                    />
                  </v-col>
                </v-row>
                <div class="sub-title pb-1 pt-2 font-weight-medium">Contact Information</div>
                <v-row>
                  <v-col sm5 md6 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                    <v-text-field
                      v-model="email"
                      placeholder="Email Address"
                      single-line
                      variant="outlined"
                      density="compact"
                      required
                      :rules="[
                        (v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !!v || 'Email Address is required')
                      ]"
                      hide-details
                    />
                  </v-col>
                  <v-col sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
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
                      density="compact"
                      placeholder="Phone Number"
                      single-line
                      variant="outlined"
                      hide-details
                    />
                  </v-col>
                  <v-col sm3 md2 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : ''">
                    <v-select
                      v-model="typeForPhone"
                      density="compact"
                      :items="items"
                      variant="outlined"
                      hide-details
                      append-icon="icon-chevron-down"
                    />
                  </v-col>
                </v-row>
                <v-col xs12 class="pb-1 pt-2">
                  <v-row>
                    <v-col xs12 sm3 md3 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                      <div class="sub-title pb-1 pt-2 font-weight-medium">Marital Status</div>
                      <v-col>
                        <v-select
                          v-model="martialStatus"
                          density="compact"
                          variant="outlined"
                          placeholder="Status"
                          :items="martialStatusList"
                          append-icon="icon-chevron-down"
                          hide-details
                        />
                      </v-col>
                    </v-col>
                    <v-col xs12 sm4 md3 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                      <v-row>
                        <div class="sub-title pb-1 pt-2 font-weight-medium">Date of Birth</div>
                        <v-col xs12>
                          <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                            <template #activator="{ props }">
                              <v-text-field
                                v-model="birthDate"
                                density="compact"
                                :error-messages="checkBirthDateErrorMsg"
                                :error="checkBirthDateError"
                                v-input-mask="{
                                  alias: 'datetime',
                                  inputFormat: 'mm/dd/yyyy',
                                  max: maxBirthDate
                                }"
                                :hide-details="!checkBirthDateError"
                                variant="outlined"
                                :rules="[(v) => !!v || 'Birth Date is required']"
                                @update:model-value="dateBirth = parseBirthDate(birthDate)"
                                @blur="checkBirthDate(birthDate)"
                                append-inner-icon="event"
                                v-bind="props"
                              >
                                <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                              </v-text-field>
                            </template>
                            <v-date-picker v-model="dateBirth" color="accent" :max="maxDate" @input="menu1 = false" />
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs12 sm5 md6 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : ''">
                      <div class="sub-title pb-1 pt-2 align-self font-weight-medium">
                        Social Security Number
                        <v-icon class="icon-secure ml-1" size="18" color="#0077CC" />
                      </div>
                      <v-col xs12>
                        <v-row>
                          <v-col xs12>
                            <v-text-field
                              v-model="ssn"
                              v-input-mask="{
                                mask: '999-99-9999',
                                showMaskOnHover: false,
                                rightAlign: false,
                                placeholder: '',
                                allowMinus: false,
                                allowPlus: false,
                                autoUnmask: true
                              }"
                              single-line
                              variant="outlined"
                              density="compact"
                              :rules="[(v) => (v != '' ? ssnRegex.test(v) || 'Invalid SSN' : !v)]"
                              hide-details
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <div class="sub-title pb-1 pt-2 font-weight-medium">Legal Address</div>
                <v-row>
                  <v-col xs12 sm12 pb-2>
                    <v-text-field
                      v-model="streetAddress"
                      placeholder="Street Address"
                      single-line
                      variant="outlined"
                      density="compact"
                      hide-details
                      :rules="[(v) => !!v || 'Street Address is required']"
                    />
                  </v-col>
                  <v-col xs12 sm3 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                    <v-text-field
                      v-model="zipCode"
                      density="compact"
                      placeholder="Zip Code"
                      single-line
                      variant="outlined"
                      maxlength="5"
                      hide-details
                      :error="zipcodeError"
                      :error-messages="zipcodeErrorMsg"
                      :rules="[(v) => !!v || 'Zip Code is required']"
                      @keypress="onlyNumber"
                      @change="getAddress()"
                    />
                  </v-col>
                  <v-col xs12 sm5 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                    <v-text-field
                      v-model="city"
                      density="compact"
                      placeholder="City"
                      single-line
                      variant="outlined"
                      hide-details
                      :rules="[(v) => !!v || 'City is required']"
                    />
                  </v-col>
                  <v-col xs12 sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : ''">
                    <v-select
                      v-model="state"
                      density="compact"
                      variant="outlined"
                      placeholder="State"
                      :items="stateList"
                      append-icon="icon-chevron-down"
                      hide-details
                      return-object
                      :rules="[(v) => Boolean(Object.keys(v || {})[0]) || 'State is required']"
                    />
                  </v-col>
                </v-row>
                <v-col xs12 class="pb-1 pt-2">
                  <v-row>
                    <v-col xs12 sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                      <div class="sub-title pb-1 pt-2 font-weight-medium">Identification Document</div>
                      <v-col>
                        <v-select
                          v-model="driverLicense"
                          density="compact"
                          :items="licenseList"
                          variant="outlined"
                          hide-details
                          append-icon="icon-chevron-down"
                          :rules="[(v) => !!v || 'License is required']"
                        />
                      </v-col>
                    </v-col>
                    <v-col xs12 sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                      <div class="sub-title pb-1 pt-2 font-weight-medium">Expiration Date</div>
                      <v-col>
                        <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                          <template #activator="{ props }">
                            <v-text-field
                              v-model="expirationDate"
                              density="compact"
                              :error-messages="checkDateErrorMsg"
                              :error="checkDateError"
                              v-input-mask="{
                                alias: 'datetime',
                                inputFormat: 'mm/dd/yyyy'
                              }"
                              :hide-details="!checkDateError"
                              variant="outlined"
                              :rules="[(v) => !!v || 'Expiration Date is required']"
                              @update:model-value="dateExpiration = parseDate(expirationDate)"
                              @blur="checkDate(expirationDate)"
                              append-inner-icon="event"
                              v-bind="props"
                            >
                              <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                            </v-text-field>
                          </template>
                          <v-date-picker v-model="dateExpiration" color="accent" :min="maxDate" @input="menu2 = false" />
                        </v-menu>
                      </v-col>
                    </v-col>
                    <v-col xs12 sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : ''">
                      <div class="sub-title pb-1 pt-2 font-weight-medium">Document Number</div>
                      <v-text-field
                        v-model="document"
                        placeholder="Document #"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                        :rules="[(v) => !!v || 'Document # is required']"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col xs12 class="pb-1 pt-2">
                  <v-row>
                    <v-col xs12 sm6 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                      <v-text-field
                        v-model="placeOfIssuance"
                        v-input-mask="{
                          regex: '^[a-zA-Z ]+$',
                          showMaskOnHover: false,
                          rightAlign: false,
                          allowMinus: false,
                          allowPlus: false
                        }"
                        density="compact"
                        placeholder="Place of Issuance"
                        single-line
                        variant="outlined"
                        hide-details
                        :rules="[(v) => !!v || 'Place of Issuance is required']"
                      />
                    </v-col>
                    <v-col xs12 sm6 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : ''">
                      <v-select
                        v-model="residency"
                        density="compact"
                        variant="outlined"
                        :items="countryList"
                        append-icon="icon-chevron-down"
                        placeholder="Country of Residency"
                        single-line
                        hide-details
                        :rules="[(v) => !!v || 'Country of Residency is required']"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <v-col :class="$vuetify?.breakpoint?.xs ? '' : $vuetify?.breakpoint?.smOnly ? 'ml-2 mr-2' : 'ml-4 mr-4'">
      <v-row justify="end">
        <v-spacer />
        <v-col sm="3" :class="$vuetify?.breakpoint?.xs ? '' : 'mr-2'">
          <v-btn
            class="text-capitalize"
            :disabled="!valid"
            block
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="savePersonalInformation()"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
import planfinderlist from '@/assets/planfinder.json'
export default {
  data() {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      phone: '',
      email: '',
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      items: ['Mobile', 'Home'],
      typeForPhone: 'Home',
      streetAddress: '',
      zipCode: '',
      city: '',
      state: '',
      stateList: planfinderlist.states,
      martialStatus: 'Single',
      martialStatusList: ['Single', 'Married'],
      valid: false,
      zipcodeError: false,
      zipcodeErrorMsg: '',
      document: '',
      placeOfIssuance: '',
      residency: '',
      driverLicense: "Driver's License",
      licenseList: ["Driver's License", 'State ID', 'Passport'],
      expirationDate: '',
      isExpirationDate: false,
      dateExpiration: null,
      checkDateErrorMsg: '',
      checkDateError: false,
      menu2: false,
      birthDate: '',
      isBirthDate: false,
      dateBirth: null,
      checkBirthDateErrorMsg: '',
      checkBirthDateError: false,
      menu1: false,
      ssn: '',
      countryList: planfinderlist.country,
      ssnRegex:
        /^((?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\d{2})\d{3} (?!00)\d{2} (?!0{4})\d{4})|((?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4})$/
    }
  },
  computed: {
    maxDate() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    },
    maxBirthDate() {
      var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
      const [year, month, day] = today.split('-')
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    },
    cardHeight() {
      if (this.$vuetify?.breakpoint?.xlOnly) return `calc(100vh - 300px)`
      else if (this.$vuetify?.breakpoint?.lgOnly) {
        if (this.$vuetify?.breakpoint?.width < 1400 && this.$vuetify?.breakpoint?.width > 1300) return `calc(100vh - 100px)`
        else return `calc(100vh - 200px)`
      } else if (this.$vuetify?.breakpoint?.mdOnly) return `calc(100vh - 200px)`
      else if (this.$vuetify?.breakpoint?.smOnly) return `calc(100vh - 300px)`
      else return `calc(100vh - 100px)`
    }
  },
  watch: {
    dateExpiration: {
      handler() {
        if (!this.isExpirationDate) this.expirationDate = this.formatDate(this.dateExpiration)
        this.isExpirationDate = false
      },
      immediate: true,
      deep: true
    },
    dateBirth: {
      handler() {
        if (!this.isBirthDate) this.birthDate = this.formatDate(this.dateBirth)
        this.isBirthDate = false
      },
      immediate: true,
      deep: true
    },
    menu2: {
      handler(val) {
        if (!val) {
          this.checkDate(this.expirationDate)
        }
      }
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
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.firstName = this.$store.state.openAccountDetail.FirstName
      this.middleName = this.$store.state.openAccountDetail.MiddleInitial ? this.$store.state.openAccountDetail.MiddleInitial : ''
      this.lastName = this.$store.state.openAccountDetail.LastName
      this.suffix = this.$store.state.openAccountDetail.Suffix ? this.$store.state.openAccountDetail.Suffix : ''
      this.email = this.$store.state.openAccountDetail.Email
      this.streetAddress = this.$store.state.openAccountDetail.MailingStreetAddress
        ? this.$store.state.openAccountDetail.MailingStreetAddress
        : ''
      this.zipCode = this.$store.state.openAccountDetail.MailingZip ? this.$store.state.openAccountDetail.MailingZip : ''
      this.city = this.$store.state.openAccountDetail.MailingCity ? this.$store.state.openAccountDetail.MailingCity : ''
      if (this.$store.state.openAccountDetail.MailingState) {
        var stateName = this.stateList.filter(
          (a) => a.text.split('-')[1].trim() === this.$store.state.openAccountDetail.MailingState.toUpperCase()
        )
        this.state = stateName && stateName.length > 0 ? stateName[0] : ''
      } else this.state = ''
      this.martialStatus = this.$store.state.openAccountDetail.MaritalStatus
        ? this.$store.state.openAccountDetail.MaritalStatus
        : 'Single'
      if (this.$store.state.openAccountDetail.MobilePhone) {
        this.typeForPhone = 'Mobile'
        this.phone = this.$store.state.openAccountDetail.MobilePhone
      }
      if (this.$store.state.openAccountDetail.HomePhone) {
        this.typeForPhone = 'Home'
        this.phone = this.$store.state.openAccountDetail.HomePhone
      }
      if (this.$store.state.openAccountDetail.Birthdate) {
        this.birthDate = this.formatDate(this.$store.state.openAccountDetail.Birthdate)
        this.dateBirth = this.parseBirthDate(this.birthDate)
      }
      this.ssn = this.$store.state.openAccountDetail.SSN ? this.$store.state.openAccountDetail.SSN : ''
      this.driverLicense = this.$store.state.openAccountDetail.IDType
        ? this.$store.state.openAccountDetail.IDType
        : "Driver's License"
      this.document = this.$store.state.openAccountDetail.IDNumber ? this.$store.state.openAccountDetail.IDNumber : ''
      this.placeOfIssuance = this.$store.state.openAccountDetail.PlaceofIssuance
        ? this.$store.state.openAccountDetail.PlaceofIssuance
        : ''
      this.residency = this.$store.state.openAccountDetail.CountryofLegalResidence
        ? this.$store.state.openAccountDetail.CountryofLegalResidence
        : ''
      if (this.$store.state.openAccountDetail.ExpirationDate) {
        this.expirationDate = this.formatDate(this.$store.state.openAccountDetail.ExpirationDate)
        this.dateExpiration = this.parseDate(this.expirationDate)
      }
    }
  },
  methods: {
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
          if (age < 18) {
            this.birthDate = ''
            this.checkBirthDateErrorMsg = 'Minimum age required is 18'
            this.checkBirthDateError = true
            return
          } else if (age > 100) {
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
    parseDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        this.isExpirationDate = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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
    checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          this.expirationDate = ''
          this.checkDateErrorMsg = 'Invalid date'
          this.checkDateError = true
        } else {
          var expireDate = new Date(val)
          var pastdate = new Date(new Date().setDate(new Date().getDate() - 1))
          if (expireDate < pastdate) {
            this.expirationDate = ''
            this.checkDateErrorMsg = 'Enter valid date'
            this.checkDateError = true
            return
          } else {
            this.checkDateError = false
            this.checkDateErrorMsg = ''
          }
        }
      }
    },
    savePersonalInformation() {
      if (this.$refs.form.validate()) {
        if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
          this.$store.state.openAccountDetail.FirstName = this.firstName ? this.firstName : ''
          this.$store.state.openAccountDetail.MiddleInitial = this.middleName ? this.middleName : ''
          this.$store.state.openAccountDetail.LastName = this.lastName ? this.lastName : ''
          this.$store.state.openAccountDetail.Suffix = this.suffix ? this.suffix : ''
          this.$store.state.openAccountDetail.Email = this.email ? this.email : ''
          this.$store.state.openAccountDetail.MailingStreetAddress = this.streetAddress ? this.streetAddress : ''
          this.$store.state.openAccountDetail.MailingZip = this.zipCode ? this.zipCode : ''
          this.$store.state.openAccountDetail.MailingCity = this.city ? this.city : ''
          this.$store.state.openAccountDetail.MailingState = this.state ? this.state.text.split('-')[1].trim() : ''
          this.$store.state.openAccountDetail.MaritalStatus = this.martialStatus ? this.martialStatus : ''
          this.$store.state.openAccountDetail.HomePhone = this.typeForPhone === 'Home' ? (this.phone ? this.phone : '') : ''
          this.$store.state.openAccountDetail.MobilePhone = this.typeForPhone === 'Mobile' ? (this.phone ? this.phone : '') : ''
          this.$store.state.openAccountDetail.Birthdate = this.dateBirth ? this.dateBirth : ''
          this.$store.state.openAccountDetail.SSN = this.ssn ? this.ssn : ''
          this.$store.state.openAccountDetail.IDType = this.driverLicense ? this.driverLicense : ''
          this.$store.state.openAccountDetail.IDNumber = this.document ? this.document : ''
          this.$store.state.openAccountDetail.PlaceofIssuance = this.placeOfIssuance ? this.placeOfIssuance : ''
          this.$store.state.openAccountDetail.CountryofLegalResidence = this.residency ? this.residency : ''
          this.$store.state.openAccountDetail.ExpirationDate = this.dateExpiration ? this.dateExpiration : ''

          this.$axios.post(`/api/v1/sfdc/Registration`, this.$store.state.openAccountDetail)
        }
        this.$emit('goToNextWindow')
      }
    },
    getAddress() {
      var that = this
      if (this.zipCode) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${this.zipCode}` }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              var address = results[0].formatted_address.split(',')
              that.city = address[0].length > 0 ? address[0].trim() : ''
              var stateCode = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              var stateName = ''
              if (stateCode) {
                stateName = that.stateList.filter((a) => a.value === stateCode)
              }
              that.state = stateName && stateName.length > 0 ? stateName[0] : ''
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
