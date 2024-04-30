<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Fund Contributions</h1>
        </v-flex>
        <v-flex class="pt-3 text-center">
          <h3>
            By completing the following information, Client has authorized PCS Retirement and Franklin Templeton Investments, or
            their authorized agent to initiate contributions or deposits to the Client's Plan Account.
          </h3>
        </v-flex>
        <v-flex class="pt-4">
          <h3><b>How will contributions be funded to the plan?</b></h3>
          <v-radio-group v-model="payMode" class="mt-0 pt-2">
            <v-radio color="accent" label="Check - Check sent by participant" value="checkSentByParticipant"></v-radio>
            <v-radio color="accent" label="ACH transfer - initiated by PCS Retirement" value="ACHtransfer"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex class="pt-2" v-if="payMode === 'checkSentByParticipant'">
          <h3><b>Deposit instructions for check</b></h3>
          <h3>
            Please note that if a check is not made payable in the above manner, Matrix Trust Company cannot guarantee the bank
            will accept the check for deposit.
          </h3>
          <h3 class="py-3">Rollover forms and investment instruction should be communicated to the TPA/Recordkeeper.</h3>
          <h3><b>Plan Contribution Checks</b></h3>
          <h3>Make checks payable to: Matrix Trust Company FBO Enter Plan name</h3>
          <h3 class="pt-3"><b>Rollover Contribution Checks</b></h3>
          <h3>Make checks payable to: Matrix Trust Company FBO Enter Plan name FAO (participant name)</h3>
          <h3 class="pt-3"><b>Reference Line For All Checks</b></h3>
          <h3>Enter Matrix Plan Account Number</h3>
        </v-flex>
        <v-flex class="pt-4" v-if="payMode === 'checkSentByParticipant'">
          <h3><b>Contribution check mailing instructions - Matrix Phoenix Lockbox</b></h3>
          <h3><b>standard mail:</b></h3>
          <h3>Matrix Trust (Phx)</h3>
          <h3>P.O. Box 21196</h3>
          <h3>New York, NY 10087-1196</h3>
          <h3 class="pt-3"><b>Overnight mail: (must be received by 12pm ET for same-day credit)</b></h3>
          <h3>JPMorgan Chase - Lockbox Processing</h3>
          <h3>Attn: Matrix Trust (Phx) - Lockbox 21196</h3>
          <h3>4 Chase Metrotech Center, 7th Floor East</h3>
          <h3>Brooklyn, NY 11245</h3>
        </v-flex>
        <v-flex class="pt-3" v-if="payMode === 'ACHtransfer'">
          <h3><b>Financial Institution</b></h3>
          <h3>
            Includes credit unions from which debits are to be made. Mutual fund accounts and brokerage accounts are not eligible
            financial institutions. The bank routing number is a nine-digit number which you must obtain from your financial
            institution.
          </h3>
          <v-form ref="form" v-model="valid" v-if="!loader" class="pt-5">
            <v-flex>
              <div class="text-h6 pb-1">Financial Institution Information</div>
              <v-text-field
                v-model="finantialInstitutionName"
                placeholder="Financial institution name"
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
                    placeholder="Select state"
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
              <v-flex class="pt-2">
                <v-text-field
                  v-model="accountNumber"
                  placeholder="Bank Account Number"
                  variant="outlined"
                  density="compact"
                  single-line
                  hide-details
                  required
                  :rules="[(v) => !!v || 'Account Number is required']"
                  maxlength="20"
                ></v-text-field>
              </v-flex>
              <v-flex class="pt-2">
                <v-text-field
                  v-model="routingNumber"
                  placeholder="Bank Routing Number"
                  variant="outlined"
                  density="compact"
                  single-line
                  hide-details
                  required
                  :rules="[(v) => !!v || 'Account Number is required']"
                  maxlength="20"
                ></v-text-field>
              </v-flex>
              <v-flex class="pt-3">
                <h3><b>Type of Account</b></h3>
                <v-radio-group v-model="typeOfAccount" inline class="mt-0 pt-2">
                  <v-radio color="accent" label="Checking" value="Checking"></v-radio>
                  <v-radio color="accent" label="Savings" value="Savings"></v-radio>
                </v-radio-group>
              </v-flex>
            </v-flex>
          </v-form>
        </v-flex>
        <v-flex class="pt-4">
          <h3><b>Contributions</b></h3>
          <h3>You will be able to contribute frequently as you would like, once you are provided access to your account.</h3>
        </v-flex>
        <v-flex class="pt-2">
          <h3><b>Would you like to setup a freqeuncy for your contributions?</b></h3>
          <v-radio-group v-model="freqeuncyMode" inline class="mt-0 pt-2">
            <v-radio color="accent" label="Yes" value="Yes"></v-radio>
            <v-radio color="accent" label="No" value="No"></v-radio>
          </v-radio-group>
          <v-flex class="pt-3" v-if="freqeuncyMode === 'Yes'">
            <h3><b>Frequency of Contributions</b></h3>
            <v-radio-group v-model="contributionMode" class="mt-0 pt-3">
              <v-radio color="accent" label="4 contributions per month - Provide dates (ex: dd)" value="4Contributions"></v-radio>
              <v-radio color="accent" label="2 contributions per month - Provide dates (ex: dd)" value="2Contributions"></v-radio>
              <v-radio color="accent" label="1 contribution per month - Provide dates (ex: dd)" value="1Contributions"></v-radio>
              <v-radio
                color="accent"
                label="1 contribution per quarter - Provide dates (ex: dd/mm)"
                value="1ContributionsPerQuarter"
              ></v-radio>
              <v-radio
                color="accent"
                label="1 contribution per year - Provide dates (ex: dd/mm)"
                value="1ContributionsPerYear"
              ></v-radio>
            </v-radio-group>
            <v-flex class="pt-2">
              <v-row>
                <v-flex xs6 sm3 class="pr-2" v-if="displayFirstFrequency">
                  <v-text-field
                    density="compact"
                    placeholder="dd/mm"
                    v-model="frequencyDate1"
                    single-line
                    variant="outlined"
                    hide-details
                    v-input-mask="{
                      alias: 'datetime',
                      inputFormat: 'dd/mm'
                    }"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 sm3 v-if="displaySecondFrequency" :class="$vuetify.breakpoint.xsOnly ? '' : 'pr-2'">
                  <v-text-field
                    density="compact"
                    placeholder="dd/mm"
                    v-model="frequencyDate2"
                    single-line
                    variant="outlined"
                    hide-details
                    v-input-mask="{
                      alias: 'datetime',
                      inputFormat: 'dd/mm'
                    }"
                  ></v-text-field>
                </v-flex>
                <v-flex
                  xs6
                  sm3
                  class="pr-2"
                  v-if="contributionMode === '4Contributions'"
                  :class="$vuetify.breakpoint.xsOnly ? 'pt-2' : ''"
                >
                  <v-text-field
                    density="compact"
                    placeholder="dd/mm"
                    v-model="frequencyDate3"
                    single-line
                    variant="outlined"
                    hide-details
                    v-input-mask="{
                      alias: 'datetime',
                      inputFormat: 'dd/mm'
                    }"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 sm3 v-if="contributionMode === '4Contributions'" :class="$vuetify.breakpoint.xsOnly ? 'pt-2' : ''">
                  <v-text-field
                    density="compact"
                    placeholder="dd/mm"
                    v-model="frequencyDate4"
                    single-line
                    variant="outlined"
                    hide-details
                    v-input-mask="{
                      alias: 'datetime',
                      inputFormat: 'dd/mm'
                    }"
                  ></v-text-field>
                </v-flex>
              </v-row>
            </v-flex>
            <v-flex class="pt-3">
              <h3><b>Provide the amount that needs to be processed based on the frequency selected</b></h3>
              <v-flex class="pt-2">
                <v-row class="pt-2">
                  <v-flex xs5 sm3 class="pt-2">Roth Post Tax:</v-flex>
                  <v-flex xs5 sm4
                    ><v-text-field
                      v-model="rothPostTax"
                      placeholder="$ Dollers"
                      single-line
                      variant="outlined"
                      density="compact"
                      hide-details
                      @change="calcContribution()"
                    ></v-text-field
                  ></v-flex>
                </v-row>
                <v-row class="pt-2">
                  <v-flex xs5 sm3 class="pt-2">Traditional Pre Tax:</v-flex>
                  <v-flex xs5 sm4
                    ><v-text-field
                      v-model="traditionalPreTax"
                      placeholder="$ Dollers"
                      single-line
                      variant="outlined"
                      density="compact"
                      hide-details
                      @change="calcContribution()"
                    ></v-text-field
                  ></v-flex>
                </v-row>
                <v-row class="pt-2">
                  <v-flex xs5 sm3 class="pt-2">Employer Match:</v-flex>
                  <v-flex xs5 sm4
                    ><v-text-field
                      v-model="employerMatch"
                      placeholder="$ Dollers"
                      single-line
                      variant="outlined"
                      density="compact"
                      hide-details
                      @change="calcContribution()"
                    ></v-text-field
                  ></v-flex>
                </v-row>
                <v-row class="pt-2">
                  <v-flex xs5 sm3 class="pt-2">Profit Sharing:</v-flex>
                  <v-flex xs5 sm4
                    ><v-text-field
                      v-model="profitSharing"
                      placeholder="$ Dollers"
                      single-line
                      variant="outlined"
                      density="compact"
                      hide-details
                      @change="calcContribution()"
                    ></v-text-field
                  ></v-flex>
                </v-row>
                <v-row class="pt-2">
                  <v-flex xs5 sm3 class="pt-2">
                    <h2>
                      <b>Total Contribution:</b>
                    </h2>
                  </v-flex>
                  <v-flex xs5 sm4 pt-2 pl-2>
                    <b>${{ totalContribution }}</b>
                  </v-flex>
                </v-row>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>
        <v-flex pt-4>
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
      payMode: 'checkSentByParticipant',
      freqeuncyMode: 'Yes',
      contributionMode: '4Contributions',
      frequencyDate1: '',
      frequencyDate2: '',
      frequencyDate3: '',
      frequencyDate4: '',
      rothPostTax: 0,
      traditionalPreTax: 0,
      employerMatch: 0,
      profitSharing: 0,
      totalContribution: 0,
      finantialInstitutionName: '',
      streetAddress: '',
      city: '',
      state: '',
      stateList: planfinderlist.states,
      zipcodeError: false,
      zipcodeErrorMsg: '',
      zipCode: '',
      accountNumber: '',
      routingNumber: '',
      typeOfAccount: 'Checking',
      valid: false,
      loader: false
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.payMode =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.CheckSentByParticipant
          ? 'checkSentByParticipant'
          : 'ACHtransfer'
      this.finantialInstitutionName =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FinancialInstitutionName
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.FinancialInstitutionName
          : ''
      this.streetAddress =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.StreetAddress
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.StreetAddress
          : ''
      this.city =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.City
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.City
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.State
      ) {
        var stateName = this.stateList.filter(
          (a) => a.text.split('-')[1].trim() === this.$store.state.soloKOpenAccountDetail.FundContributions.State.toUpperCase()
        )
        this.state = stateName && stateName.length > 0 ? stateName[0] : ''
      } else this.state = ''
      this.zipCode =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.ZipCode
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.ZipCode
          : ''
      this.accountNumber =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.BankAccountNumber
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.BankAccountNumber
          : ''
      this.routingNumber =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.BankRoutingNumber
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.BankRoutingNumber
          : ''
      this.typeOfAccount =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.Checking
          ? 'Checking'
          : 'Savings'
      this.freqeuncyMode =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencySetupContributions
          ? 'Yes'
          : 'No'
      if (
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FourContributionsPerMonth
      ) {
        this.contributionMode = '4Contributions'
      } else if (
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.TwoContributionsPerMonth
      ) {
        this.contributionMode = '2Contributions'
      } else if (
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.OneContributionsPerMonth
      ) {
        this.contributionMode = '1Contributions'
      } else if (
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.OneContributionsPerQuarter
      ) {
        this.contributionMode = '1ContributionsPerQuarter'
      } else if (
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FourContributionsPerYear
      ) {
        this.contributionMode = '1ContributionsPerYear'
      } else {
        this.contributionMode = '4Contributions'
      }
      this.frequencyDate1 =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate1
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate1
          : ''
      this.frequencyDate2 =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate2
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate2
          : ''
      this.frequencyDate3 =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate3
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate3
          : ''
      this.frequencyDate4 =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate4
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate4
          : ''

      this.rothPostTax =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.RothPostTax
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.RothPostTax
          : 0
      this.traditionalPreTax =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.TraditionalPreTax
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.TraditionalPreTax
          : 0
      this.employerMatch =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.EmployerMatch
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.EmployerMatch
          : 0
      this.profitSharing =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.ProfitSharing
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.ProfitSharing
          : 0
      this.totalContribution =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.TotalContribution
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.TotalContribution
          : 0
    }
  },
  computed: {
    displayFirstFrequency() {
      if (
        this.contributionMode === '1ContributionsPerYear' ||
        this.contributionMode === '1ContributionsPerQuarter' ||
        this.contributionMode === '1Contributions' ||
        this.contributionMode === '2Contributions' ||
        this.contributionMode === '4Contributions'
      ) {
        return true
      } else {
        return false
      }
    },
    displaySecondFrequency() {
      if (this.contributionMode === '2Contributions' || this.contributionMode === '4Contributions') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.FundContributions = {}
      this.$store.state.soloKOpenAccountDetail.FundContributions.CheckSentByParticipant = this.payMode
        ? this.payMode === 'checkSentByParticipant'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.ACHTransferByPCSRetirement = this.payMode
        ? this.payMode === 'ACHtransfer'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.FinancialInstitutionName = this.finantialInstitutionName
        ? this.finantialInstitutionName
        : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.StreetAddress = this.streetAddress ? this.streetAddress : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.City = this.city ? this.city : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.State = this.state ? this.state.text.split('-')[1].trim() : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.ZipCode = this.zipCode ? this.zipCode : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.BankAccountNumber = this.accountNumber ? this.accountNumber : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.BankRoutingNumber = this.routingNumber ? this.routingNumber : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.Checking = this.typeOfAccount
        ? this.typeOfAccount === 'Checking'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.Savings = this.typeOfAccount
        ? this.typeOfAccount === 'Savings'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencySetupContributions = this.freqeuncyMode
        ? this.freqeuncyMode === 'Yes'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.FourContributionsPerMonth = this.contributionMode
        ? this.contributionMode === '4Contributions'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.TwoContributionsPerMonth = this.contributionMode
        ? this.contributionMode === '2Contributions'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.OneContributionsPerMonth = this.contributionMode
        ? this.contributionMode === '1Contributions'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.OneContributionsPerQuarter = this.contributionMode
        ? this.contributionMode === '1ContributionsPerQuarter'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.FourContributionsPerYear = this.contributionMode
        ? this.contributionMode === '1ContributionsPerYear'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate1 = this.frequencyDate1 ? this.frequencyDate1 : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate2 = this.frequencyDate2 ? this.frequencyDate2 : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate3 = this.frequencyDate3 ? this.frequencyDate3 : ''
      this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencyDate4 = this.frequencyDate4 ? this.frequencyDate4 : ''

      this.$store.state.soloKOpenAccountDetail.FundContributions.RothPostTax = this.rothPostTax ? this.rothPostTax : 0
      this.$store.state.soloKOpenAccountDetail.FundContributions.TraditionalPreTax = this.traditionalPreTax
        ? this.traditionalPreTax
        : 0
      this.$store.state.soloKOpenAccountDetail.FundContributions.EmployerMatch = this.employerMatch ? this.employerMatch : 0
      this.$store.state.soloKOpenAccountDetail.FundContributions.ProfitSharing = this.profitSharing ? this.profitSharing : 0
      this.$store.state.soloKOpenAccountDetail.FundContributions.TotalContribution = this.totalContribution
        ? this.totalContribution
        : 0

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
    calcContribution() {
      var sumContribution = 0
      sumContribution =
        Number(this.rothPostTax) + Number(this.traditionalPreTax) + Number(this.employerMatch) + Number(this.profitSharing)
      this.totalContribution = parseFloat(Number(sumContribution)).toFixed(2)
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
