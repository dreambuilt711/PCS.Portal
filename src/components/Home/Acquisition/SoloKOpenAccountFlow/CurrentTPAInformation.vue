<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Current TPA Information</h1>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader" class="pt-6">
          <v-flex>
            <div class="text-h6 pb-1 pt-2">Is there an outside TPA on the existing Solo(k) plan?</div>
            <v-radio-group v-model="outsideTPAMode" inline class="mt-0 pt-0">
              <v-radio color="accent" label="Yes" value="Yes"></v-radio>
              <v-radio color="accent" label="No" value="No"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex v-if="outsideTPAMode === 'Yes'">
            <v-flex class="pt-3" v-if="false">
              <div class="text-h6 pb-1 pt-2">Current TPA name</div>
              <v-select
                density="compact"
                variant="outlined"
                placeholder="TPA name"
                v-model="tpaName"
                :items="tpaNameList"
                append-icon="icon-chevron-down"
                hide-details
                return-object
                :rules="[(v) => !!v || 'TPA name is required']"
                class="shortcutdropdown"
              >
              </v-select>
            </v-flex>
            <v-flex class="pt-5">
              <div class="text-h6 pb-1">Company Information</div>
              <v-text-field
                v-model="company"
                placeholder="Company"
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
          </v-flex>
          <v-flex pt-10>
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
      outsideTPAMode: 'Yes',
      company: '',
      streetAddress: '',
      city: '',
      state: '',
      stateList: planfinderlist.states,
      zipcodeError: false,
      zipcodeErrorMsg: '',
      zipCode: '',
      tpaName: '',
      tpaNameList: [
        { text: 'Provider A', value: 0 },
        {
          text: 'Provider B',
          value: 1
        },
        {
          text: 'Provider C',
          value: 2
        }
      ]
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.outsideTPAMode = this.$store.state.soloKOpenAccountDetail.OutSideTPA
        ? this.$store.state.soloKOpenAccountDetail.OutSideTPA
        : 'Yes'
      this.tpaName =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.TPAName
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.TPAName
          : ''
      this.company =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA &&
        this.$store.state.soloKOpenAccountDetail.CurrentTPA.CompanyInformation
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.CompanyInformation
          : ''
      this.streetAddress =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.StreetAddress
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.StreetAddress
          : ''
      this.city =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.City
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.City
          : ''
      if (this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.State) {
        var stateName = this.stateList.filter(
          (a) => a.text.split('-')[1].trim() === this.$store.state.soloKOpenAccountDetail.CurrentTPA.State.toUpperCase()
        )
        this.state = stateName && stateName.length > 0 ? stateName[0] : ''
      } else this.state = ''
      this.zipCode =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.ZipCode
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.ZipCode
          : ''
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.CurrentTPA = {}
      this.$store.state.soloKOpenAccountDetail.OutSideTPA = this.outsideTPAMode ? this.outsideTPAMode : 'Yes'
      this.$store.state.soloKOpenAccountDetail.CurrentTPA.TPAName = this.tpaName ? this.tpaName.text : ''
      this.$store.state.soloKOpenAccountDetail.CurrentTPA.CompanyInformation = this.company ? this.company : ''
      this.$store.state.soloKOpenAccountDetail.CurrentTPA.StreetAddress = this.streetAddress ? this.streetAddress : ''
      this.$store.state.soloKOpenAccountDetail.CurrentTPA.City = this.city ? this.city : ''
      this.$store.state.soloKOpenAccountDetail.CurrentTPA.State = this.state ? this.state.text.split('-')[1].trim() : ''
      this.$store.state.soloKOpenAccountDetail.CurrentTPA.ZipCode = this.zipCode ? this.zipCode : ''
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
