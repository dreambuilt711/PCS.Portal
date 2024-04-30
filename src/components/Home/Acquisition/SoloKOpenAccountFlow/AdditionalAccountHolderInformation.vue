<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm9>
        <v-flex class="text-center">
          <h1>Additional Account Holder Information</h1>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader">
          <v-flex class="pt-3">
            <div class="text-h6 pb-1">Name and email</div>
            <v-row class="pb-2">
              <v-flex sm6 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                <v-text-field
                  v-model="firstName"
                  placeholder="First"
                  required
                  variant="outlined"
                  maxlength="140"
                  density="compact"
                  single-line
                  :rules="[(v) => !!v || 'First Name is required']"
                  hide-details
                ></v-text-field>
              </v-flex>
              <v-flex sm6 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : ''">
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
                ></v-text-field>
              </v-flex>
            </v-row>
            <v-text-field
              v-model="email"
              placeholder="Email"
              single-line
              variant="outlined"
              density="compact"
              hide-details
              :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2">
            <v-row>
              <v-flex xs12 sm6 md6 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <v-row>
                  <div class="text-h6 pb-1">Date of birth</div>
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
                          :rules="[(v) => !!v || 'Birth Date is required']"
                          v-input-mask="{
                            alias: 'datetime',
                            inputFormat: 'mm/dd/yyyy',
                            max: maxBirthDate
                          }"
                        >
                          <v-icon v-bind="props" slot="append">event</v-icon>
                        </v-text-field>
                      </template>
                      <v-date-picker v-model="dateBirth" @input="menu1 = false" color="accent" :max="maxDate"></v-date-picker>
                    </v-menu> -->
                  </v-flex>
                </v-row>
              </v-flex>
              <v-flex xs12 sm6 md6 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                <div class="text-h6 pb-1">Social Security Number</div>
                <v-flex xs12>
                  <v-row>
                    <v-flex xs12>
                      <v-text-field
                        v-model="ssn"
                        single-line
                        variant="outlined"
                        density="compact"
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
                        hide-details
                      ></v-text-field>
                    </v-flex>
                  </v-row>
                </v-flex>
              </v-flex>
            </v-row>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2">
            <v-row>
              <v-flex xs12 sm6 md6 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <v-row>
                  <div class="text-h6 pb-1">Date of hire</div>
                  <v-flex xs12>
                    <!-- <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      allow-overflow
                      transition="scale-transition"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          density="compact"
                          v-model="hireDate"
                          @update:model-value="dateHire = parseHireDate(hireDate)"
                          
                          @blur="checkHireDate(hireDate)"
                          :error-messages="checkHireDateErrorMsg"
                          :error="checkHireDateError"
                          :hide-details="!checkHireDateError"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Hire Date is required']"
                          v-input-mask="{
                            alias: 'datetime',
                            inputFormat: 'mm/dd/yyyy',
                            max: maxBirthDate
                          }"
                        >
                          <v-icon v-bind="props" slot="append">event</v-icon>
                        </v-text-field>
                      </template>
                      <v-date-picker v-model="dateHire" @input="menu2 = false" color="accent" :max="maxDate"></v-date-picker>
                    </v-menu> -->
                  </v-flex>
                </v-row>
              </v-flex>
              <v-flex xs12 sm6 md6 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                <v-row>
                  <div class="text-h6 pb-1">Phone</div>
                  <v-flex xs12>
                    <v-text-field
                      density="compact"
                      placeholder="Phone"
                      v-model="phone"
                      single-line
                      variant="outlined"
                      v-input-mask="{
                        mask: '(999)[ 999][-9999]',
                        showMaskOnHover: false,
                        rightAlign: false,
                        placeholder: '',
                        allowMinus: false,
                        allowPlus: true,
                        autoUnmask: true
                      }"
                      hide-details
                    ></v-text-field>
                  </v-flex>
                </v-row>
              </v-flex>
            </v-row>
          </v-flex>
          <v-flex>
            <v-flex class="py-3">
              <h3><b>Does the other account holder want to elect different investments than the primary account holder?</b></h3>
            </v-flex>
            <v-radio-group v-model="otherInvestmentMode" inline class="mt-0 pt-0">
              <v-radio color="accent" label="Yes" value="Yes"></v-radio>
              <v-radio color="accent" label="No" value="No"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2" v-if="otherInvestmentMode === 'Yes'">
            <v-flex v-for="(item, index) in fundListDetails" :key="index">
              <v-row v-show="item.show">
                <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                  <div class="text-h6 pb-1">Fund name</div>
                  <v-select
                    variant="outlined"
                    placeholder="Select fund"
                    v-model="item['fundName']"
                    :items="fundNameList"
                    append-icon="icon-chevron-down"
                    hide-details
                    return-object
                    item-title="Name"
                    item-value="FundId"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm3 md3 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                  <div class="text-h6 pb-1">Percent (%)</div>
                  <v-text-field
                    density="compact"
                    placeholder="1-100%"
                    v-model="item['percent']"
                    single-line
                    variant="outlined"
                    hide-details
                    @change="calcPercentage()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 sm1 md1 class="pt-7" v-if="index > 0">
                  <v-btn :color="$vuetify.theme.dark ? '' : 'accent'" size="small" @click="removeFund(index)">
                    + Remove Fund
                  </v-btn>
                </v-flex>
              </v-row>
            </v-flex>
            <v-row>
              <v-flex xs12 sm8 md8>
                <v-btn
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  size="small"
                  @click="addFund(counter)"
                  :disabled="disableButtonAddFund"
                  class="mx-0"
                >
                  + Add Fund
                </v-btn>
              </v-flex>
              <v-flex xs12 sm4 md4 pt-2
                ><h3>
                  <b style="color: #0077cc">Total election: {{ totalFundPercentage }}%</b>
                  <h6 v-if="disableButton">(must = 100%)</h6>
                </h3></v-flex
              >
            </v-row>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2" v-if="otherInvestmentMode === 'Yes'">
            <v-row>
              <v-flex xs12 sm8 md8>
                <h3 class="pt-1">
                  <a
                    target="_blank"
                    :href="openPdf($store.state.soloKOpenAccountDetail.FeeTypeDetail)"
                    :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
                    class="cursor-pointer"
                    >View Cambridge Solo(K) Investment Options<v-icon
                      class="pl-1"
                      size="x-small"
                      :color="$vuetify.theme.dark ? '' : 'accent'"
                      >fas fa-external-link-alt</v-icon
                    ></a
                  >
                </h3>
              </v-flex>
              <!-- <v-flex xs12 sm4 md4
                ><h2>
                  <b style="color: #0077cc">Total election: {{ totalFundPercentage }}%</b>
                  <h6 v-if="disableButton">(must = 100%)</h6>
                </h2></v-flex
              > -->
            </v-row>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2">
            <v-row>
              <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <div class="text-h6 pb-1">Is this account holder also the owner?</div>
                <v-select
                  variant="outlined"
                  placeholder="account holder owner"
                  v-model="isOwner"
                  :items="isOwnerList"
                  append-icon="icon-chevron-down"
                  hide-details
                  @update:model-value="selectOwner()"
                  :rules="[(v) => !!v || 'account holder owner is required']"
                  class="shortcutdropdown"
                >
                </v-select>
              </v-flex>
              <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                <div class="text-h6 pb-1">Percentage owned</div>
                <v-text-field
                  placeholder="1-100%"
                  v-model="percentageOwned"
                  :disabled="disablePercentage"
                  variant="outlined"
                  v-input-mask="{
                    alias: 'numeric',
                    digits: '2',
                    digitsOptional: true,
                    rightAlign: false,
                    allowMinus: false,
                    placeholder: '',
                    autoUnmask: true,
                    max: '100'
                  }"
                  suffix="%"
                  :hide-details="true"
                  density="compact"
                  single-line
                ></v-text-field>
              </v-flex>
            </v-row>
          </v-flex>
          <v-btn v-if="false" :color="$vuetify.theme.dark ? '' : 'accent'" @click="addParticipant()">+ Add participant</v-btn>
        </v-form>
        <v-flex pt-8>
          <v-flex class="text-center">
            <v-col class="pa-0">
              <v-btn
                class="text-capitalize"
                :color="$vuetify.theme.dark ? '' : 'accent'"
                :disabled="disableButton && otherInvestmentMode === 'Yes'"
                @click="nextSlide()"
                >Next
              </v-btn>
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
export default {
  data() {
    return {
      valid: false,
      loader: false,
      firstName: '',
      lastName: '',
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      email: '',
      birthDate: '',
      isBirthDate: false,
      dateBirth: null,
      checkBirthDateErrorMsg: '',
      checkBirthDateError: false,
      menu1: false,
      ssn: '',
      ssnRegex:
        /^((?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\d{2})\d{3} (?!00)\d{2} (?!0{4})\d{4})|((?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4})$/,
      hireDate: '',
      isHireDate: false,
      dateHire: null,
      checkHireDateErrorMsg: '',
      checkHireDateError: false,
      menu2: false,
      phone: '',
      fundName: '',
      fundNameList: [],
      percent: '',
      otherInvestmentMode: 'No',
      percentageOwned: 0,
      isOwner: 'Yes',
      isOwnerList: [
        {
          text: 'Yes'
        },
        {
          text: 'No'
        }
      ],
      fundListDetails: [
        {
          Id: 1,
          show: true,
          fundName: '',
          percent: 0
        },
        {
          Id: 2,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 3,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 4,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 5,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 6,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 7,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 8,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 9,
          show: false,
          fundName: '',
          percent: 0
        },
        {
          Id: 10,
          show: false,
          fundName: '',
          percent: 0
        }
      ],
      counter: 0,
      totalFundPercentage: 0,
      fundInfo: [],
      disableButtonAddFund: false,
      disablePercentage: false
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
    },
    dateHire: {
      handler() {
        if (!this.isHireDate) this.hireDate = this.formatDate(this.dateHire)
        this.isHireDate = false
      },
      immediate: true,
      deep: true
    },
    menu2: {
      handler(val) {
        if (!val) {
          this.checkHireDate(this.hireDate)
        }
      }
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
    fundListDetailsData() {
      return this.fundListDetails
    },
    disableButton() {
      if (this.totalFundPercentage !== '100.00') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.fundNameList = this.$store.state.soloKOpenAccountDetail.fundNameList
        ? this.$store.state.soloKOpenAccountDetail.fundNameList
        : []
      this.firstName =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.FirstName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.FirstName
          : ''
      this.lastName =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.LastName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.LastName
          : ''
      this.email =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.Email
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.Email
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.DateOfBirth
      ) {
        this.birthDate = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.DateOfBirth
        this.dateBirth = this.parseBirthDate(this.birthDate)
      }
      this.ssn =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SocialSecurityNumber
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SocialSecurityNumber
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.DateOfhire
      ) {
        this.hireDate = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.DateOfhire
        this.dateHire = this.parseHireDate(this.hireDate)
      }
      this.phone =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.Phone
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.Phone
          : ''
      this.otherInvestmentMode =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.AccountHolderElectDifferentInvestments
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.AccountHolderElectDifferentInvestments === 1
            ? 'Yes'
            : 'No'
          : 'No'
      this.isOwner =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.AccountHolderIsOwner === false
          ? 'No'
          : 'Yes'
      this.percentageOwned =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.PercentageOwned
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.PercentageOwned
          : ''
      if (this.isOwner && this.isOwner === 'No') {
        this.disablePercentage = true
        this.percentageOwned = 0
      } else {
        this.disablePercentage = false
      }
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SelectedFundList.length > 0
      ) {
        this.fundListDetails =
          this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SelectedFundList &&
          this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SelectedFundList.length > 0
            ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SelectedFundList
            : []
        var fundNumber = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SelectedFundList.filter(
          (a) => a.show === true
        )
        this.counter = fundNumber.length - 1
      }
      this.totalFundPercentage =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.TotalFundPercentage
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.TotalFundPercentage
          : 0
      this.calcPercentage()
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1 = {}
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.FirstName = this.firstName ? this.firstName : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.LastName = this.lastName ? this.lastName : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.Email = this.email ? this.email : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.DateOfBirth = this.birthDate ? this.birthDate : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SocialSecurityNumber = this.ssn ? this.ssn : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.DateOfhire = this.hireDate ? this.hireDate : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.Phone = this.phone ? this.phone : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.AccountHolderElectDifferentInvestments = this
        .otherInvestmentMode
        ? this.otherInvestmentMode === 'Yes'
          ? 1
          : 0
        : 0
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.AccountHolderIsOwner =
        this.isOwner && this.isOwner === 'Yes' ? true : false
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.PercentageOwned = this.percentageOwned
        ? parseFloat(this.percentageOwned)
        : 0
      this.fundInfo = []
      let fundListDetailsData = this.fundListDetailsData.filter((a) => a.show === true)
      for (var j = 0; j < fundListDetailsData.length; j++) {
        this.fundInfo.push({
          FundTicker:
            fundListDetailsData[j].fundName && fundListDetailsData[j].fundName.Symbol
              ? fundListDetailsData[j].fundName.Symbol
              : '',
          FundName:
            fundListDetailsData[j].fundName && fundListDetailsData[j].fundName.Name ? fundListDetailsData[j].fundName.Name : '',
          Percent: fundListDetailsData[j].percent ? parseFloat(fundListDetailsData[j].percent) : 0
        })
      }
      var fundingData = this.fundListDetailsData
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.InvestmentSelections = this.fundInfo
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.SelectedFundList = fundingData
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1.TotalFundPercentage = this.totalFundPercentage
      this.$emit('nextSlide')
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
    checkHireDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          this.hireDate = ''
          this.checkDateErrorMsg = 'Invalid date'
          this.checkDateError = true
        } else {
          this.checkDateError = false
          this.checkDateErrorMsg = ''
        }
      }
    },
    parseHireDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        this.isHireDate = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    addFund(index) {
      if (index < 9) {
        var i = index + 1
        this.counter = i
        this.fundListDetailsData.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.show = true
            element.fundName = ''
            element.percent = 0
          }
        })
        this.disableButtonAddFund = this.totalFundPercentage === '100.00' || this.counter === 9 ? true : false
      } else {
        this.disableButtonAddFund = true
      }
    },
    removeFund(i) {
      var check = this.fundListDetailsData.filter((a) => a.show === true)
      if (check.length === 1) return
      this.fundListDetailsData.forEach((element, index) => {
        if (i === index) {
          element.show = false
          this.fundListDetails.splice(i, 1)
          this.fundListDetails.push({
            fundName: '',
            show: false,
            percent: 0
          })
        }
      })
      let totalFund = this.fundListDetailsData.filter((a) => a.show === true)
      this.counter = totalFund && totalFund.length > 0 ? totalFund.length - 1 : 0
      this.calcPercentage()
    },
    calcPercentage() {
      var sumElectionPercentage = 0
      if (this.fundListDetailsData.length > 0) {
        for (var i = 0; i < this.fundListDetailsData.length; i++) {
          sumElectionPercentage += !(this.fundListDetailsData[i].percent === -999)
            ? Number(this.fundListDetailsData[i].percent)
            : Number(0)
        }
        this.totalFundPercentage = parseFloat(Number(sumElectionPercentage)).toFixed(2)
        this.disableButtonAddFund = this.totalFundPercentage === '100.00' || this.counter === 9 ? true : false
      }
    },
    openPdf(val) {
      if (val === 'Commission Based') {
        return 'https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/5fb505274fa748a5841c2de9eb775983?v=862d1012'
      } else {
        return 'https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/8d42b2f7abef4346a62d4ad32e71fdfd?v=071cb6b1'
      }
    },
    prevSlide() {
      this.$emit('prevSlide')
    },
    selectOwner() {
      if (this.isOwner && this.isOwner === 'No') {
        this.percentageOwned = '0'
        this.disablePercentage = true
      } else {
        this.disablePercentage = false
        this.percentageOwned = ''
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
