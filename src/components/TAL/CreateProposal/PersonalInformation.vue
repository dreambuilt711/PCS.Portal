<template>
  <v-row justify="center">
    <v-col cols="12" xs="12" lg="8" class="justify-center">
      <v-col cols="12" xs="12" class="text-center">
        <h1>Personal Information</h1>
      </v-col>
      <v-form ref="form" v-model="valid">
        <v-col :class="display.xs.value ? 'pt-2' : 'pt-4 pb-14'">
          <v-row>
            <v-col cols="12" xl="5" lg="5" md="5" sm="5" xs="12" :class="display.xs.value ? '' : 'pr-2'">
              <v-row>
                <div class="text-h6 pb-1 pt-2">Date of Birth</div>
                <v-col cols="12" xs="12" class="pa-0">
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
                  >
                    <template #append-inner>
                      <v-btn icon variant="flat" style="height: 36px; width: 36px">
                        <v-icon> mdi-calendar </v-icon>
                        <v-menu v-model="menu1" activator="parent" :close-on-content-click="false" transition="scale-transition">
                          <v-date-picker
                            v-model="dateBirth"
                            color="accent"
                            :max="maxDate"
                            width="368px"
                            @update:model-value="menu1 = false"
                          />
                        </v-menu>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" xl="7" lg="7" md="7" sm="7" xs="12">
              <div class="text-h6 pb-1 pt-2 align-self">
                Social Security Number
                <v-icon class="icon-secure ml-1" size="18" color="#0077CC" />
              </div>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row>
                  <v-col cols="12" xs="12" class="pa-0">
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
          <v-row>
            <v-col cols="12" xl="8" lg="8" md="8" sm="8" xs="12" :class="display.xs.value ? '' : 'pr-2'">
              <v-row>
                <div class="text-h6 pb-1 pt-2">Identification Document</div>
                <v-col cols="12" xs="12" class="pa-0">
                  <v-select
                    v-model="driverLicense"
                    density="compact"
                    :items="licenseList"
                    variant="outlined"
                    hide-details
                    :rules="[(v) => !!v || 'License is required']"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" xl="4" lg="4" md="4" sm="4" xs="12">
              <div class="text-h6 pb-1 pt-2">Expiration Date</div>
              <v-col cols="12" xs="12" class="pa-0">
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
                >
                  <template #append-inner>
                    <v-btn icon variant="flat" style="height: 36px; width: 36px">
                      <v-icon> mdi-calendar </v-icon>
                      <v-menu v-model="menu2" activator="parent" :close-on-content-click="false" transition="scale-transition">
                        <v-date-picker
                          v-model="dateExpiration"
                          color="accent"
                          :min="maxDate"
                          width="368px"
                          @update:model-value="menu2 = false"
                        />
                      </v-menu>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" xs="12" class="pb-2 pt-2">
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
            <v-col cols="12" sm="12" xs="12" class="pb-2">
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
            <v-col cols="6" sm="6" :class="display.xs.value ? '' : 'pr-2'">
              <v-select
                v-model="residency"
                density="compact"
                variant="outlined"
                :items="countryList"
                item-title="text"
                placeholder="Country of Residency"
                single-line
                hide-details
                :rules="[(v) => !!v || 'Country of Residency is required']"
              />
            </v-col>
            <v-col cols="6" sm="6" :class="display.xs.value ? 'pt-2' : ''">
              <v-select
                v-model="citizenship"
                density="compact"
                variant="outlined"
                :items="countryList"
                item-title="text"
                placeholder="Country of Citizenship"
                single-line
                hide-details
                :rules="[(v) => !!v || 'Country of Citizenship is required']"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-row justify="center" class="mt-5">
          <v-col class="text-center" cols="6" xl="6" lg="6" md="6" sm="6" xs="6">
            <v-col>
              <v-btn
                class="text-capitalize"
                block
                size="x-large"
                :color="theme.dark ? '' : 'accent'"
                :disabled="!valid"
                @click="savePersonalInformation()"
              >
                Next
              </v-btn>
            </v-col>
            <v-col class="align-self pt-2 cursor-pointer">
              <a :class="[!theme.dark ? 'text-hyperlink' : 'text-white', 'font_14']" @click="f_goToNextWindow()"
                ><b>Skip, I'll do this later</b></a
              >
            </v-col>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
import { ref, onMounted, watch, getCurrentInstance, computed } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import planfinderlist from '@/assets/planfinder.json'
export default {
  props: ['goToNextWindow'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const valid = ref(true)
    const document = ref('')
    const placeOfIssuance = ref('')
    const residency = ref('')
    const citizenship = ref('')
    const driverLicense = ref("Driver's License")
    const licenseList = ref(["Driver's License", 'State ID', 'Passport'])
    const expirationDate = ref('')
    const isExpirationDate = ref(false)
    const dateExpiration = ref(null)
    const checkDateErrorMsg = ref('')
    const checkDateError = ref(false)
    const menu2 = ref(false)
    const birthDate = ref('')
    const isBirthDate = ref(false)
    const dateBirth = ref(null)
    const checkBirthDateErrorMsg = ref('')
    const checkBirthDateError = ref(false)
    const menu1 = ref(false)
    const ssn = ref('')
    const countryList = ref(planfinderlist.country)
    const ssnRegex = ref(
      /^((?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\d{2})\d{3} (?!00)\d{2} (?!0{4})\d{4})|((?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4})$/
    )
    function f_goToNextWindow() {
      emit('goToNextWindow')
    }
    function parseDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        isExpirationDate.value = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    function parseBirthDate(date) {
      // eslint-disable-next-line no-debugger
      console.log(date)
      if (!date) return null
      if (!Date.parse(date)) {
        isBirthDate.value = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    const formatDate = (date) => {
      if (!date) return null
      console.log(date)
      var tmp_date = date
      if (typeof date === 'string') {
        tmp_date = new Date(date)
      }
      return `${tmp_date.getMonth() + 1}/${tmp_date.getDate()}/${tmp_date.getFullYear()}`
    }
    function checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          expirationDate.value = ''
          checkDateErrorMsg.value = 'Invalid date'
          checkDateError.value = true
        } else {
          var expireDate = new Date(val)
          var pastdate = new Date(new Date().setDate(new Date().getDate() - 1))
          if (expireDate < pastdate) {
            expirationDate.value = ''
            checkDateErrorMsg.value = 'Enter valid date'
            checkDateError.value = true
            return
          } else {
            checkDateError.value = false
            checkDateErrorMsg.value = ''
          }
        }
      }
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
          if (age < 18) {
            birthDate.value = ''
            checkBirthDateErrorMsg.value = 'Minimum age required is 18'
            checkBirthDateError.value = true
            return
          } else if (age > 100) {
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
    function savePersonalInformation() {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        $store.state.openAccountDetail.Birthdate = dateBirth.value ? dateBirth.value : ''
        $store.state.openAccountDetail.SSN = ssn.value ? ssn.value : ''
        $store.state.openAccountDetail.IDType = driverLicense.value ? driverLicense.value : ''
        $store.state.openAccountDetail.IDNumber = document.value ? document.value : ''
        $store.state.openAccountDetail.PlaceofIssuance = placeOfIssuance.value ? placeOfIssuance.value : ''
        $store.state.openAccountDetail.CountryofLegalResidence = residency.value ? residency.value : ''
        $store.state.openAccountDetail.CountryofCitizenship = citizenship.value ? citizenship.value : ''
        $store.state.openAccountDetail.ExpirationDate = dateExpiration.value ? dateExpiration.value : ''
        $axios.post(`/api/v1/sfdc/Registration`, $store.state.openAccountDetail)
      }
      emit('goToNextWindow')
    }
    const maxDate = computed(() => {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    })
    const maxBirthDate = computed(() => {
      var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
      const [year, month, day] = today.split('-')
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    })
    watch(
      () => dateExpiration.value,
      () => {
        if (!isExpirationDate.value) expirationDate.value = formatDate(dateExpiration.value)
        isExpirationDate.value = false
      },
      { immediate: true, deep: true }
    )
    watch(
      () => dateBirth.value,
      () => {
        if (!isBirthDate.value) birthDate.value = formatDate(dateBirth.value)
        isBirthDate.value = false
      },
      { immediate: true, deep: true }
    )
    watch(
      () => menu2.value,
      (val) => {
        if (!val) {
          checkDate(expirationDate.value)
        }
      }
    )
    watch(
      () => menu1.value,
      (val) => {
        if (!val) {
          checkBirthDate(birthDate.value)
        }
      }
    )
    onMounted(() => {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        if ($store.state.openAccountDetail.Birthdate) {
          birthDate.value = formatDate($store.state.openAccountDetail.Birthdate)
          dateBirth.value = parseBirthDate(birthDate.value)
        }
        ssn.value = $store.state.openAccountDetail.SSN ? $store.state.openAccountDetail.SSN : ''
        driverLicense.value = $store.state.openAccountDetail.IDType ? $store.state.openAccountDetail.IDType : "Driver's License"
        document.value = $store.state.openAccountDetail.IDNumber ? $store.state.openAccountDetail.IDNumber : ''
        placeOfIssuance.value = $store.state.openAccountDetail.PlaceofIssuance
          ? $store.state.openAccountDetail.PlaceofIssuance
          : ''
        residency.value = $store.state.openAccountDetail.CountryofLegalResidence
          ? $store.state.openAccountDetail.CountryofLegalResidence
          : ''
        citizenship.value = $store.state.openAccountDetail.CountryofCitizenship
          ? $store.state.openAccountDetail.CountryofCitizenship
          : ''
        if ($store.state.openAccountDetail.ExpirationDate) {
          expirationDate.value = formatDate($store.state.openAccountDetail.ExpirationDate)
          dateExpiration.value = parseDate(expirationDate.value)
        }
      }
    })
    return {
      display,
      theme,
      valid,
      menu1,
      birthDate,
      checkBirthDateErrorMsg,
      checkBirthDateError,
      dateBirth,
      maxDate,
      ssn,
      ssnRegex,
      driverLicense,
      licenseList,
      expirationDate,
      checkDateErrorMsg,
      checkDateError,
      dateExpiration,
      menu2,
      document,
      placeOfIssuance,
      residency,
      countryList,
      citizenship,
      maxBirthDate,
      parseBirthDate,
      checkBirthDate,
      parseDate,
      checkDate,
      savePersonalInformation,
      f_goToNextWindow
    }
  }
}
</script>
<style scoped>
.theme--light.v-divider.dividerBold {
  border-color: rgba(0, 0, 0, 0.42);
}
</style>
