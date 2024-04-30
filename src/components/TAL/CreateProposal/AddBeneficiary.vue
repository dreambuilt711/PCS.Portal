<template>
  <v-col v-if="addBeneficiaryDialog" cols="12" lg="12" xs="12" class="justify-center pt-16 pb-12">
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
          <v-col cols="12" xs="12">
            <v-col class="text-right">
              <v-icon color="accent" @click="closeAddBeneficiaryDialog()"> mdi-close </v-icon>
            </v-col>
          </v-col>
        </v-card-title>
        <v-card-text :class="display.xs.value ? 'pa-2' : 'px-2 py-0'">
          <v-row class="justify-center">
            <v-col cols="12" xs="12" lg="9" class="justify-center">
              <v-col cols="12" xs="12" class="text-center">
                <h1>{{ addOrEditText }} Beneficiary</h1>
              </v-col>
              <v-col cols="12" xs="12" class="text-center pb-2 pt-2">
                <h3>{{ addOrEditText }} details of the Beneficiary to include in the proposal</h3>
              </v-col>
              <div v-if="loader" class="container pa-0">
                <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                  <Loader :loading-text="`Loading..`" :loading="loader" />
                </v-card>
              </div>
              <v-form v-if="!loader" ref="form" v-model="valid">
                <v-col class="py-1">
                  <v-row>
                    <div class="text-h6 pb-1">Beneficiary Details</div>
                    <v-row>
                      <v-col cols="12" xs="12" sm="4" :class="display.xs.value ? '' : 'pr-2'">
                        <v-select
                          v-model="beneficiaryType"
                          density="compact"
                          placeholder="Beneficiary Type *"
                          :items="beneficiaryItems"
                          variant="outlined"
                          hide-details
                          required
                          :rules="[(v) => !!v || 'Beneficiary Type is required']"
                        />
                      </v-col>
                      <v-col cols="12" xs="12" sm="5" :class="display.xs.value ? 'pt-2' : 'pr-2'">
                        <v-select
                          v-model="relationshipType"
                          density="compact"
                          placeholder="Select Relationship Type *"
                          :items="relationshipTypeItems"
                          variant="outlined"
                          hide-details
                          required
                          :rules="[(v) => !!v || 'Relationship Type is required']"
                        />
                      </v-col>
                      <v-col cols="12" xs="12" sm="3" :class="display.xs.value ? 'pt-2' : ''">
                        <v-text-field
                          v-model="allocation"
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
                          placeholder="Allocation *"
                          :rules="[(v) => !!v || 'Allocation is required']"
                          variant="outlined"
                          suffix="%"
                          density="compact"
                          single-line
                          hide-details
                          required
                        />
                      </v-col>
                    </v-row>
                    <v-row class="pt-2">
                      <v-col cols="12" xs="12" sm="4" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
                        />
                      </v-col>
                      <v-col cols="12" xs="12" sm="2" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
                      <v-col cols="12" xs="12" sm="4" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
                        />
                      </v-col>
                      <v-col cols="12" xs="12" sm="2" :class="display.xs.value ? 'pt-2' : ''">
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
                  </v-row>
                  <v-row>
                    <v-col cols="12" xs="12" sm="5" class="pr-2">
                      <v-row>
                        <div class="text-h6 pb-1 pt-2">Date of Birth *</div>
                        <v-col cols="12" xs="12">
                          <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                            <template #activator="{ props }">
                              <v-text-field
                                v-model="birthDate"
                                density="compact"
                                :error-messages="checkBirthDateErrorMsg"
                                :error="checkBirthDateError"
                                :hide-details="!checkBirthDateError"
                                variant="outlined"
                                v-input-mask="{
                                  alias: 'datetime',
                                  inputFormat: 'mm/dd/yyyy',
                                  max: maxBirthDate
                                }"
                                required
                                :rules="[(v) => !!v || 'Date of Birth is required']"
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
                    <v-col cols="12" xs="12" sm="7">
                      <div class="text-h6 pb-1 pt-2 align-self">
                        Social Security Number *<v-icon class="icon-secure ml-1" size="18" color="#0077CC" />
                      </div>
                      <v-col cols="12" xs="12">
                        <v-row>
                          <v-col cols="12" xs="12" class="pr-1">
                            <v-text-field
                              v-model="ssnFirstDigit"
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
                              hide-details
                              maxlength="15"
                              required
                              :rules="[(v) => (v != '' ? ssnRegex.test(v) || 'Invalid SSN' : !v)]"
                              :error="ssnError"
                              :error-messages="ssnErrorMsg"
                              @keyup="checkSSN()"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                  <v-row class="pt-2">
                    <v-col cols="12" xs="12" sm="5" :class="display.xs.value ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        v-model="email"
                        placeholder="Email Address"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                        :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                      />
                    </v-col>
                    <v-col cols="12" xs="12" sm="4" :class="display.xs.value ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        v-model="phoneNumber"
                        v-input-mask="{
                          mask: '(999)[ 999][-9999]',
                          showMaskOnHover: false,
                          rightAlign: false,
                          placeholder: '',
                          allowMinus: false,
                          allowPlus: true,
                          autoUnmask: true
                        }"
                        placeholder="(123) 456-7890"
                        variant="outlined"
                        maxlength="15"
                        density="compact"
                        single-line
                        hide-details
                        :error="phoneError"
                        :error-messages="phoneErrorMsg"
                        @keyup="checkPhoneNumber()"
                      />
                    </v-col>
                    <v-col cols="12" xs="12" sm="3" :class="display.xs.value ? 'pt-2' : ''">
                      <v-select
                        v-model="phoneType"
                        density="compact"
                        :items="phoneTypeList"
                        variant="outlined"
                        hide-details
                        append-icon="icon-chevron-down"
                      />
                    </v-col>
                    <v-col cols="12" xs="12" class="pt-2 pb-2">
                      <v-text-field
                        v-model="streetAddress"
                        placeholder="Street Address"
                        single-line
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" xs="12" sm="4" :class="display.xs.value ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        v-model="zipcode"
                        v-input-mask="{
                          mask: '99999',
                          rightAlign: false,
                          placeholder: '',
                          allowMinus: false
                        }"
                        placeholder="Zip Code"
                        single-line
                        maxlength="5"
                        density="compact"
                        :error="zipcodeError"
                        variant="outlined"
                        :error-messages="zipcodeErrorMsg"
                        @change="getAddress()"
                      />
                    </v-col>
                    <v-col cols="12" xs="12" sm="5" :class="display.xs.value ? 'pt-2' : 'pr-2'">
                      <v-text-field
                        v-model="city"
                        density="compact"
                        placeholder="City"
                        single-line
                        variant="outlined"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" xs="12" sm="3" :class="display.xs.value ? 'pt-2' : ''">
                      <v-select
                        v-model="stateValue"
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
                <v-row
                  justify="center"
                  :class="
                    !$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant'
                      ? ''
                      : 'mb-5'
                  "
                >
                  <v-col class="flex_none mr-3">
                    <v-btn
                      class="text-capitalize pl-11 pr-11"
                      size="x-large"
                      :color="theme.dark ? '' : 'accent'"
                      :disabled="!valid"
                      @click="addBeneficiaryDetails()"
                    >
                      {{ addOrEditText === 'Edit' ? 'Save Changes' : addOrEditText + ' Beneficiary' }}
                    </v-btn>
                  </v-col>
                  <v-col class="align-self ml-3 flex_none">
                    <a
                      :class="[!theme.dark ? 'text-hyperlink' : 'text-white', 'font_14']"
                      @click="closeAddBeneficiaryDialog()"
                    >
                      <b>Cancel</b>
                    </a>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { ref, computed, onMounted, watch, getCurrentInstance, inject } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import planfinderlist from '@/assets/planfinder.json'
import Loader from '@/components/NewLoader'
export default {
  components: {
    Loader
  },
  props: ['value', 'addOrEditText', 'registrationId'],
  setup(props) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const valid = ref(false)
    const beneficiaryType = ref('')
    const relationshipType = ref('')
    const allocation = ref('')
    const firstName = ref('')
    const middleName = ref('')
    const lastName = ref('')
    const suffix = ref('')
    const dateOfBirth = ref('')
    const ssn = ref('')
    const email = ref('')
    const emailRegex = ref(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    )
    const phoneNumber = ref('')
    const phoneType = ref('Home')
    const streetAddress = ref('')
    const zipcode = ref('')
    const city = ref('')
    const stateValue = ref('')
    const beneficiaryItems = ref([
      { text: 'Primary', value: 'Primary' },
      { text: 'Contingent', value: 'Contingent' }
    ])
    const relationshipTypeItems = ref([
      { text: 'Child', value: 'Child' },
      { text: 'Spouse', value: 'Spouse' },
      { text: 'Non-spouse', value: 'Non-spouse' },
      { text: 'Entity', value: 'Entity' }
    ])
    const beneficiaryAdd = ref(false)
    const openTranferBalanceDialog = ref(false)
    const name = ref('')
    const benefitype = ref('')
    const relationType = ref('')
    const allocType = ref('')
    const emailAdd = ref('')
    const phno = ref('')
    const phoneTypeList = ref([
      { text: 'Home', value: 'Home' },
      { text: 'Mobile', value: 'Mobile' }
    ])
    const checkBirthDateError = ref(false)
    const checkBirthDateErrorMsg = ref('')
    const stateList = ref(planfinderlist.states)
    const ssnFirstDigit = ref('')
    const dateBirth = ref(null)
    const menu1 = ref(false)
    const birthDate = ref('')
    const isBirthDate = ref(false)
    const beneficiaryID = ref('')
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    const loader = ref(false)
    const phoneError = ref(false)
    const phoneErrorMsg = ref('')
    const ssnError = ref(false)
    const ssnErrorMsg = ref('')
    const ssnRegex = ref(
      /^((?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\d{2})\d{3} (?!00)\d{2} (?!0{4})\d{4})|((?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4})$/
    )
    const addBeneficiaryDialog = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const dialogWidth = computed(() => {
      if (display.xl.value) return '55%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    const maxDate = computed(() => {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    })
    const maxBirthDate = computed(() => {
      var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
      const [year, month, day] = today.split('-')
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    })
    const dialogPositionNew = computed(() => {
      if (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant') {
        if (display.xl.value) {
          return `dialogBigScreen`
        } else if (display.lg.value) {
          return `dialoglgScreen`
        } else if (display.md.value) return `dialogMdScreen`
        else if (display.sm.value) return `dialogSmScreen`
        else return `dialoglgScreen`
      } else return 'auto'
    })
    watch(
      () => dateBirth.value,
      () => {
        if (!isBirthDate.value) birthDate.value = formatDate(dateBirth.value)
        isBirthDate.value = false
      },
      { immediate: true, deep: true }
    )
    watch(
      () => menu1.value,
      (val) => {
        checkBirthDate(birthDate.value)
      }
    )
    onMounted(() => {
      eventBus.on('beneficiaryData', (data) => {
        getBeneficiaryDetails(data)
        beneficiaryID.value = data
      })
      eventBus.on('resetData', () => {
        resetDetails()
      })
    })
    function closeAddBeneficiaryDialog() {
      addBeneficiaryDialog.value = false
      emit('closeAddBeneficiaryDialog')
    }
    function addBeneficiaryDetails() {
      if (ssnFirstDigit.value) {
        var ssnNumber = ssnFirstDigit.value
      }
      var beneficiaryFormDetails = {
        FirstName: firstName.value ? firstName.value : '',
        MiddleInitials: middleName.value ? middleName.value : '',
        LastName: lastName.value ? lastName.value : '',
        Suffix: suffix.value ? suffix.value : '',
        SSN: ssnNumber ? ssnNumber : '',
        DateOfBirth: birthDate.value ? birthDate.value : '',
        Email: email.value ? email.value : '',
        HomePhone: phoneType.value === 'Home' ? phoneNumber.value : '',
        MobilePhone: phoneType.value === 'Mobile' ? phoneNumber.value : '',
        BeneficiaryRelationship: relationshipType.value ? relationshipType.value : '',
        BeneficiaryPercent: allocation.value ? parseFloat(allocation.value) : 0,
        BeneficiaryType: beneficiaryType.value ? beneficiaryType.value : '',
        SteetAddress: streetAddress.value ? streetAddress.value : '',
        Zipcode: zipcode.value ? zipcode.value : '',
        City: city.value ? city.value : '',
        State: stateValue.value ? stateValue.value : '',
        Country: '',
        RegistrationId: props.registrationId ? props.registrationId : '',
        Plan: '',
        ID: props.addOrEditText === 'Edit' ? beneficiaryID.value : ''
      }
      emit('addBeneficiaryDetails', beneficiaryFormDetails)
    }
    function parseBirthDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        isBirthDate.value = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    function formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    function checkBirthDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          birthDate.value = ''
          checkBirthDateErrorMsg.value = 'Invalid date'
          checkBirthDateError.value = true
        } else {
          var birth = new Date(val)
          var today = new Date()
          var age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000))
          if (age > 100) {
            birthDate.value = ''
            checkBirthDateErrorMsg.value = 'Enter valid date'
            checkBirthDateError.value = true
            return
          } else {
            checkBirthDateError.value = false
            checkBirthDateErrorMsg.value = ''
          }
        }
      }
    }
    function getBeneficiaryDetails(data) {
      loader.value = true
      $axios.get(`/api/v1/sfdc/beneficiary/${data}`).then((success) => {
        var beneficiariesDetails = success.data.d
        if (beneficiariesDetails != null) {
          var firstName = beneficiariesDetails.Name.split(' ')
          firstName.value = firstName[0] ? firstName[0] : ''
          middleName.value = firstName[1] ? firstName[1] : ''
          lastName.value = firstName[2] ? firstName[2] : ''
          suffix.value = firstName[3] ? firstName[3] : ''
          ssnFirstDigit.value = beneficiariesDetails.SSN ? beneficiariesDetails.SSN : ''
          relationshipType.value = beneficiariesDetails.BeneficiaryRelationship ? beneficiariesDetails.BeneficiaryRelationship : ''
          beneficiaryType.value = beneficiariesDetails.BeneficiaryType ? beneficiariesDetails.BeneficiaryType : ''
          allocation.value = beneficiariesDetails.BeneficiaryPercent ? beneficiariesDetails.BeneficiaryPercent : ''
          streetAddress.value = beneficiariesDetails.SteetAddress ? beneficiariesDetails.SteetAddress : ''
          zipcode.value = beneficiariesDetails.Zipcode ? beneficiariesDetails.Zipcode : ''
          city.value = beneficiariesDetails.City ? beneficiariesDetails.City : ''
          stateValue.value = beneficiariesDetails.State ? beneficiariesDetails.State : ''
          phoneNumber.value = beneficiariesDetails.HomePhone ? beneficiariesDetails.HomePhone : beneficiariesDetails.MobilePhone
          email.value = beneficiariesDetails.Email ? beneficiariesDetails.Email : ''
          birthDate.value = beneficiariesDetails.DateOfBirth ? beneficiariesDetails.DateOfBirth : ''
          loader.value = false
        }
      })
    }
    function resetDetails() {
      firstName.value = ''
      middleName.value = ''
      lastName.value = ''
      suffix.value = ''
      ssnFirstDigit.value = ''
      relationshipType.value = ''
      beneficiaryType.value = ''
      allocation.value = ''
      streetAddress.value = ''
      zipcode.value = ''
      city.value = ''
      stateValue.value = ''
      phoneNumber.value = ''
      email.value = ''
      birthDate.value = ''
    }
    function getAddress() {
      if (zipcode.value) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode.value}` }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              var address = results[0].formatted_address.split(',')
              city.value = address[0].length > 0 ? address[0].trim() : ''
              var stateCode = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              var stateName = ''
              if (stateCode) {
                stateName = stateList.value.filter((a) => a.value === stateCode)
              }
              stateValue.value = stateName && stateName.length > 0 ? stateName[0] : ''
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
            } else {
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
            }
          } else {
            city.value = ''
            stateValue.value = ''
            zipcodeError.value = true
            zipcodeErrorMsg.value = 'Invalid Zip Code'
          }
        })
      } else {
        city.value = ''
        stateValue.value = ''
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
      }
    }
    function checkPhoneNumber() {
      if (phoneNumber.value) {
        var phoneNumberData = phoneNumber.value.replace(/[^0-9/\\.]/g, '')
        if (phoneNumberData.length < 10) {
          phoneError.value = true
          phoneErrorMsg.value = 'Invalid Phone Number'
          return
        } else {
          phoneError.value = false
          phoneErrorMsg.value = ''
        }
      } else {
        phoneError.value = false
        phoneErrorMsg.value = ''
      }
    }
    function checkSSN() {
      if (ssnFirstDigit.value) {
        var ssnData = ssnFirstDigit.value.replace(/[^0-9/\\.]/g, '')
        if (ssnData.length < 9) {
          ssnError.value = true
          ssnErrorMsg.value = 'Invalid SSN'
          return
        } else {
          ssnError.value = false
          ssnErrorMsg.value = ''
        }
      } else {
        ssnError.value = false
        ssnErrorMsg.value = ''
      }
    }
    return {
      theme,
      display,
      $store,
      addBeneficiaryDialog,
      dialogPositionNew,
      dialogWidth,
      addOrEditText,
      loader,
      valid,
      beneficiaryType,
      beneficiaryItems,
      relationshipType,
      relationshipTypeItems,
      allocation,
      firstName,
      middleName,
      lastName,
      suffix,
      menu1,
      birthDate,
      checkBirthDateErrorMsg,
      checkBirthDateError,
      dateBirth,
      ssnFirstDigit,
      ssnErrorMsg,
      emailRegex,
      phoneNumber,
      phoneError,
      phoneErrorMsg,
      phoneType,
      phoneTypeList,
      streetAddress,
      zipcode,
      zipcodeError,
      zipcodeErrorMsg,
      city,
      stateValue,
      stateList,
      getAddress,
      addBeneficiaryDetails,
      closeAddBeneficiaryDialog,
      parseBirthDate,
      checkBirthDate,
      checkSSN,
      checkPhoneNumber
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
