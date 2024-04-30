<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Account Holder Information</h1>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader">
          <v-flex class="pt-6">
            <div class="text-h6 pb-1">Name and email</div>
            <v-row class="pb-2">
              <v-flex sm6 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
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
              :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !!v || 'Email Address is required')]"
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
                      :rules="[(v) => !!v || 'Phone is required']"
                    ></v-text-field>
                  </v-flex>
                </v-row>
              </v-flex>
            </v-row>
          </v-flex>
          <v-flex xs12 class="pb-1 pt-2">
            <v-row>
              <v-flex xs12 sm8 md8 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                <div class="text-h6 pb-1">Is this account holder also the owner?</div>
                <v-select
                  density="compact"
                  variant="outlined"
                  placeholder="account holder owner"
                  v-model="isOwner"
                  :items="isOwnerList"
                  append-icon="icon-chevron-down"
                  hide-details
                  :rules="[(v) => !!v || 'account holder owner is required']"
                  class="shortcutdropdown"
                  @update:model-value="selectOwner()"
                >
                </v-select>
              </v-flex>
              <v-flex xs12 sm4 md4 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''">
                <div class="text-h6 pb-1">Percentage owned</div>
                <v-text-field
                  placeholder="1-100%"
                  v-model="percentageOwned"
                  variant="outlined"
                  :disabled="disablePercentage"
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
                  :rules="[(v) => !!v || 'Percentage is required']"
                ></v-text-field>
              </v-flex>
            </v-row>
          </v-flex>
          <v-flex pt-8>
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
      percentageOwned: '',
      isOwner: 'Yes',
      isOwnerList: [
        {
          text: 'Yes'
        },
        {
          text: 'No'
        }
      ],
      backButtonCount: 0,
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
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.firstName =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FirstName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FirstName
          : ''
      this.lastName =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LastName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LastName
          : ''
      this.email =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Email
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Email
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfBirth
      ) {
        this.birthDate = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfBirth
        this.dateBirth = this.parseBirthDate(this.birthDate)
      }
      this.ssn =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.SocialSecurityNumber
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.SocialSecurityNumber
          : ''
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfhire
      ) {
        this.hireDate = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfhire
        this.dateHire = this.parseHireDate(this.hireDate)
      }
      this.phone =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Phone
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Phone
          : ''
      this.isOwner =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.AccountHolderIsOwner === false
          ? 'No'
          : 'Yes'
      this.percentageOwned =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.PercentageOwned
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.PercentageOwned
          : ''
      if (this.isOwner && this.isOwner === 'No') {
        this.disablePercentage = true
        this.percentageOwned = '0'
      } else {
        this.disablePercentage = false
      }
      this.backButtonCount =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.BackButtonCount
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.BackButtonCount
          : 0
    }
  },
  methods: {
    nextSlide() {
      if (this.backButtonCount === 0) {
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation = {}
      }
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FirstName = this.firstName ? this.firstName : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LastName = this.lastName ? this.lastName : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Email = this.email ? this.email : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfBirth = this.birthDate ? this.birthDate : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.SocialSecurityNumber = this.ssn ? this.ssn : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfhire = this.hireDate ? this.hireDate : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Phone = this.phone ? this.phone : ''
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.AccountHolderIsOwner =
        this.isOwner && this.isOwner === 'Yes' ? true : false
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.PercentageOwned = this.percentageOwned
        ? parseFloat(this.percentageOwned)
        : 0
      this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.BackButtonCount = 1
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
