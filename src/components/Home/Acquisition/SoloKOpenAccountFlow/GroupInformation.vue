<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Controlled or Affiliated Service Group Status</h1>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader" class="pt-5">
          <v-flex class="py-3">
            <div class="text-h6 pb-1">Select one</div>
            <v-select
              density="compact"
              variant="outlined"
              placeholder="Select group"
              v-model="groupMode"
              :items="groupModeList"
              append-icon="icon-chevron-down"
              hide-details
              return-object
              :rules="[(v) => Boolean(Object.keys(v || {})[0]) || 'Group is required']"
            ></v-select>
            <v-flex xs12 pt-2
              ><h3>
                <a
                  target="_blank"
                  :href="`https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/6cdea2fcb12a47048e3cf00f170d76fe?v=426d5dda`"
                  :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
                  class="cursor-pointer"
                  >What is a controlled group or affiliated service group?
                  <v-icon class="pl-1" size="x-small" :color="$vuetify.theme.dark ? '' : 'accent'"
                    >fas fa-external-link-alt</v-icon
                  >
                </a>
              </h3>
            </v-flex>
          </v-flex>
          <v-flex class="pt-3" v-if="groupMode.value !== 0">
            <v-flex>
              <div class="text-h6 pb-1">Group Details</div>
              <v-text-field
                v-model="legalName"
                placeholder="Legal name"
                required
                variant="outlined"
                maxlength="140"
                density="compact"
                single-line
                hide-details
              ></v-text-field>
              <v-flex xs12 sm12 py-2>
                <v-text-field
                  v-model="legalStreetAddress"
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
                  <div class="text-h6 pb-1">Federal tax ID</div>
                  <v-text-field
                    density="compact"
                    placeholder="Tax ID #"
                    v-model="taxID"
                    single-line
                    variant="outlined"
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                  <div class="text-h6 pb-1">Fiscal year-end</div>
                  <v-text-field
                    density="compact"
                    placeholder="mm/dd"
                    v-model="fiscalYearend"
                    single-line
                    variant="outlined"
                    hide-details
                    v-input-mask="{
                      alias: 'datetime',
                      inputFormat: 'mm/dd'
                    }"
                  ></v-text-field>
                </v-flex>
              </v-row>
            </v-flex>
          </v-flex>
          <v-flex pt-6>
            <v-flex class="text-center">
              <v-col class="pa-0">
                <v-btn
                  class="text-capitalize"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  @click="nextSlide()"
                  :disabled="!valid"
                  >Next</v-btn
                >
              </v-col>
              <v-col class="pl-0 pr-0 pt-2">
                <v-btn
                  class="text-capitalize"
                  variant="outlined"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  @click="prevSlide()"
                  >Go Back</v-btn
                >
              </v-col>
            </v-flex>
          </v-flex>
        </v-form>
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
      groupMode: '',
      legalName: '',
      legalStreetAddress: '',
      city: '',
      state: '',
      stateList: planfinderlist.states,
      zipcodeError: false,
      zipcodeErrorMsg: '',
      zipCode: '',
      fiscalYearend: '',
      taxID: '',
      groupModeList: [
        {
          text: 'No controlled or affiliated service group exists',
          value: 0
        },
        {
          text: 'Controlled group exists',
          value: 1
        },
        {
          text: 'Affiliated service group exists',
          value: 2
        }
      ]
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      if (this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.NoControlledOrAffiliatedService) {
        var newData = this.groupModeList.filter((a) => a.text === this.groupModeList[0].text)
        this.groupMode = newData && newData.length > 0 ? newData[0] : ''
      } else if (this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.ControlledGroupExists) {
        var newData1 = this.groupModeList.filter((a) => a.text === this.groupModeList[1].text)
        this.groupMode = newData1 && newData1.length > 0 ? newData1[0] : ''
      } else if (this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.AffiliatedServiceGroupExists) {
        var newData2 = this.groupModeList.filter((a) => a.text === this.groupModeList[2].text)
        this.groupMode = newData2 && newData2.length > 0 ? newData2[0] : ''
      } else {
        this.groupMode = ''
      }
      this.legalName =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LegalName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LegalName
          : ''
      this.legalStreetAddress =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.StreetAddress
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.StreetAddress
          : ''
      this.city =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.City
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.City
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.State
      ) {
        var stateName = this.stateList.filter(
          (a) =>
            a.text.split('-')[1].trim() === this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.State.toUpperCase()
        )
        this.state = stateName && stateName.length > 0 ? stateName[0] : ''
      } else this.state = ''
      this.zipCode =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.ZipCode
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.ZipCode
          : ''
      this.fiscalYearend =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FiscalYearEnd
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FiscalYearEnd
          : ''
      this.taxID =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FedaralTaxId
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FedaralTaxId
          : ''
    }
  },
  methods: {
    nextSlide() {
      if (Object.keys(this.$store.state.soloKOpenAccountDetail.AccountHolderInformation).length > 0) {
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.NoControlledOrAffiliatedService = this.groupMode
          ? this.groupMode.text === 'No controlled or affiliated service group exists'
            ? true
            : false
          : false
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.ControlledGroupExists = this.groupMode
          ? this.groupMode.text === 'Controlled group exists'
            ? true
            : false
          : false
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.AffiliatedServiceGroupExists = this.groupMode
          ? this.groupMode.text === 'Affiliated service group exists'
            ? true
            : false
          : false
        this.$store.state.soloKOpenAccountDetail.GroupMode = this.groupMode ? this.groupMode.text : ''
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LegalName = this.legalName ? this.legalName : ''
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.StreetAddress = this.legalStreetAddress
          ? this.legalStreetAddress
          : ''
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.City = this.city ? this.city : ''
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.State = this.state
          ? this.state.text.split('-')[1].trim()
          : ''
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.ZipCode = this.zipCode ? this.zipCode : ''
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FiscalYearEnd = this.fiscalYearend
          ? this.fiscalYearend
          : ''
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FedaralTaxId = this.taxID ? this.taxID : ''
      }
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
