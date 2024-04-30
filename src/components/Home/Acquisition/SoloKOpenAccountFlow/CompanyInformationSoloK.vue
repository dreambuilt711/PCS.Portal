<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Company Information</h1>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader" class="pt-5">
          <v-flex>
            <div class="text-h6 pb-1">Business information</div>
            <v-text-field
              v-model="companyName"
              placeholder="Company name"
              required
              variant="outlined"
              maxlength="140"
              density="compact"
              single-line
              hide-details
            ></v-text-field>
            <v-flex xs12 sm12 py-2>
              <v-text-field
                v-model="streetAddress"
                placeholder="Street Address"
                single-line
                variant="outlined"
                density="compact"
                hide-details
                :rules="[(v) => !!v || 'Street address is required']"
              ></v-text-field>
            </v-flex>
            <v-row>
              <v-flex xs12 sm5 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <v-text-field
                  density="compact"
                  placeholder="City"
                  v-model="city"
                  single-line
                  variant="outlined"
                  hide-details
                  :rules="[(v) => !!v || 'City is required']"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <v-select
                  variant="outlined"
                  placeholder="Select State"
                  v-model="state"
                  :items="stateList"
                  append-icon="icon-chevron-down"
                  hide-details
                  return-object
                  :rules="[(v) => Boolean(Object.keys(v || {})[0]) || 'State is required']"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm3 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                <v-text-field
                  density="compact"
                  placeholder="Zip Code"
                  v-model="zipCode"
                  single-line
                  variant="outlined"
                  @keypress="onlyNumber"
                  maxlength="5"
                  hide-details
                  @change="getAddress()"
                  :error="zipcodeError"
                  :error-messages="zipcodeErrorMsg"
                  :rules="[(v) => !!v || 'Zip Code is required']"
                ></v-text-field>
              </v-flex>
            </v-row>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2">
            <v-row>
              <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <div class="text-h6 pb-1">Employer identification number (EIN)</div>
                <v-text-field
                  density="compact"
                  placeholder="EIN"
                  v-model="einNumber"
                  single-line
                  variant="outlined"
                  hide-details
                ></v-text-field>
                <a
                  target="_blank"
                  :href="`https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers`"
                  :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
                  class="cursor-pointer"
                  >Don't have an EIN? Apply for one today<v-icon
                    class="pl-1"
                    size="x-small"
                    :color="$vuetify.theme.dark ? '' : 'accent'"
                    >fas fa-external-link-alt</v-icon
                  ></a
                >
              </v-flex>
              <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                <div class="text-h6 pb-1">Fiscal year-end</div>
                <v-select
                  density="compact"
                  variant="outlined"
                  placeholder="Select"
                  v-model="fiscalYearend"
                  :items="fiscalYearendList"
                  append-icon="icon-chevron-down"
                  hide-details
                  return-object
                ></v-select>
              </v-flex>
            </v-row>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2">
            <v-row>
              <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <div class="text-h6 pb-1">Type of entity</div>
                <v-select
                  density="compact"
                  variant="outlined"
                  placeholder="Select type of entity"
                  v-model="typeOfEntity"
                  :items="typeOfEntityList"
                  append-icon="icon-chevron-down"
                  hide-details
                  return-object
                ></v-select>
              </v-flex>
              <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                <div class="text-h6 pb-1">Business code</div>
                <v-text-field
                  density="compact"
                  placeholder="Code"
                  v-model="businessCode"
                  single-line
                  variant="outlined"
                  hide-details
                ></v-text-field>
                <a
                  target="_blank"
                  :href="`https://www.irs.gov/pub/irs-pdf/i5500ez.pdf`"
                  :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
                  class="cursor-pointer"
                  >Don't know your business code?
                  <v-icon class="pl-1" size="x-small" :color="$vuetify.theme.dark ? '' : 'accent'"
                    >fas fa-external-link-alt</v-icon
                  >
                </a>
              </v-flex>
            </v-row>
          </v-flex>
        </v-form>
        <v-flex pt-6>
          <v-flex class="text-center">
            <v-col class="pa-0">
              <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="nextSlide()">Next</v-btn>
            </v-col>
            <v-col class="pl-0 pr-0 pt-2">
              <v-btn class="text-capitalize" variant="outlined" :color="$vuetify.theme.dark ? '' : 'accent'" @click="prevSlide()"
                >Go Back</v-btn
              >
            </v-col>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-row>
  </v-flex>
</template>
<script>
import planfinderlist from '@/assets/planfinder.json'
export default {
  data() {
    return {
      valid: false,
      loader: false,
      companyName: '',
      streetAddress: '',
      city: '',
      state: '',
      stateList: planfinderlist.states,
      zipcodeError: false,
      zipcodeErrorMsg: '',
      zipCode: '',
      einNumber: '',
      fiscalYearend: '',
      fiscalYearendList: [
        {
          text: '01/31'
        },
        {
          text: '02/28'
        },
        {
          text: '03/31'
        },
        {
          text: '04/30'
        },
        {
          text: '05/31'
        },
        {
          text: '06/30'
        },
        {
          text: '07/31'
        },
        {
          text: '08/31'
        },
        {
          text: '09/30'
        },
        {
          text: '10/31'
        },
        {
          text: '11/30'
        },
        {
          text: '12/31'
        }
      ],
      typeOfEntity: '',
      typeOfEntityList: [
        {
          text: 'Sole Proprietorship',
          value: 0
        },
        {
          text: 'C Corporation (CO.)',
          value: 1
        },
        {
          text: 'Limited Liability Company (LLC)',
          value: 2
        },
        {
          text: 'Limited Partnership (LP)',
          value: 3
        },
        {
          text: 'Professional Corporation (PC)',
          value: 4
        },
        {
          text: 'Professional Service Corporation (PSC)',
          value: 5
        },
        {
          text: 'S Corporation',
          value: 6
        },
        {
          text: 'Partnership',
          value: 7
        },
        {
          text: 'Limited Liability Partnership (LLP)',
          value: 8
        }
      ],
      businessCode: '',
      mailingStreetAddress: '',
      mailingCity: '',
      mailingState: '',
      mailingZipCode: ''
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.companyName =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessInformationName
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessInformationName
          : ''
      this.streetAddress =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessStreetAddress
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessStreetAddress
          : ''
      this.city =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCity
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCity
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessState
      ) {
        var stateName = this.stateList.filter(
          (a) =>
            a.text.split('-')[1].trim() ===
            this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessState.toUpperCase()
        )
        this.state = stateName && stateName.length > 0 ? stateName[0] : ''
      } else this.state = ''
      this.zipCode =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessZipCode
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessZipCode
          : ''
      this.mailingStreetAddress =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingStreetAddress
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingStreetAddress
          : ''
      this.mailingCity =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingCity
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingCity
          : ''
      this.mailingState =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingState
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingState
          : ''
      this.mailingZipCode =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingZipCode
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingZipCode
          : ''
      this.einNumber =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.EmployerIdentificationNumber
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.EmployerIdentificationNumber
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.FiscalYearEnd
      ) {
        var fisyearendData = this.fiscalYearendList.filter(
          (a) => a.text.trim() === this.$store.state.soloKOpenAccountDetail.CompanyInformation.FiscalYearEnd
        )
        this.fiscalYearend = fisyearendData && fisyearendData.length > 0 ? fisyearendData[0].text : ''
      } else this.fiscalYearend = ''
      if (
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.TypeOfEntity
      ) {
        var entityTypeName = this.typeOfEntityList.filter(
          (a) => a.text === this.$store.state.soloKOpenAccountDetail.CompanyInformation.TypeOfEntity
        )
        this.typeOfEntity = entityTypeName && entityTypeName.length > 0 ? entityTypeName[0] : ''
      } else this.typeOfEntity = ''
      this.businessCode =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCode
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCode
          : ''
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.CompanyInformation = {}
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessInformationName = this.companyName
        ? this.companyName
        : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessStreetAddress = this.streetAddress
        ? this.streetAddress
        : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCity = this.city ? this.city : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessState = this.state
        ? this.state.text.split('-')[1].trim()
        : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessZipCode = this.zipCode ? this.zipCode : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingStreetAddress = this.mailingStreetAddress
        ? this.mailingStreetAddress
        : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingCity = this.mailingCity ? this.mailingCity : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingState = this.mailingState ? this.mailingState : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.MailingZipCode = this.mailingZipCode ? this.mailingZipCode : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.EmployerIdentificationNumber = this.einNumber
        ? this.einNumber
        : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.FiscalYearEnd = this.fiscalYearend
        ? this.fiscalYearend.text
        : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.TypeOfEntity = this.typeOfEntity ? this.typeOfEntity.text : ''
      this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCode = this.businessCode ? this.businessCode : ''
      this.$emit('nextSlide')
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
    },
    prevSlide() {
      this.$emit('prevSlide')
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
