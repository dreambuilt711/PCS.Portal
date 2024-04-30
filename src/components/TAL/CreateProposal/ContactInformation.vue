<template>
  <v-row justify="center">
    <v-col cols="12" xs="12" lg="8" class="justify-center">
      <v-col cols="12" xs="12" class="text-center">
        <h1>Contact Information</h1>
      </v-col>
      <v-form ref="form" v-model="valid">
        <v-col class="pt-4 pb-6">
          <div class="text-h6 pb-1">Participant Name</div>
          <v-row>
            <v-col cols="4" sm="4" class="pa-0" :class="display.xs.value ? '' : 'pr-2'">
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
            <v-col cols="2" sm="2" class="pa-0" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
            <v-col cols="4" sm="4" class="pa-0" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
            <v-col cols="2" sm="2" class="pa-0" :class="display.xs.value ? 'pt-2' : ''">
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
          <div class="text-h6 pb-1 pt-2">Contact Info</div>
          <v-row>
            <v-col cols="5" sm="5" class="pa-0" :class="display.xs.value ? '' : 'pr-2'">
              <v-text-field
                v-model="email"
                placeholder="Email Address"
                single-line
                variant="outlined"
                density="compact"
                required
                :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !!v || 'Email Address is required')]"
                hide-details
              />
            </v-col>
            <v-col cols="4" sm="4" class="pa-0" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
            <v-col cols="3" sm="3" class="pa-0" :class="display.xs.value ? 'pt-2' : ''">
              <v-select v-model="typeForPhone" density="compact" :items="items" variant="outlined" hide-details />
            </v-col>
          </v-row>
          <div class="text-h6 pb-1 pt-2">Mailing Address</div>
          <v-row>
            <v-col cols="12" sm="12" class="pb-2 pa-0">
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
            <v-col cols="3" sm="3" class="pa-0" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
            <v-col cols="5" sm="5" class="pa-0" :class="display.xs.value ? 'pt-2' : 'pr-2'">
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
            <v-col cols="4" sm="4" class="pa-0" :class="display.xs.value ? 'pt-2' : ''">
              <v-select
                v-model="state"
                density="compact"
                variant="outlined"
                placeholder="State"
                :items="stateList"
                item-title="text"
                hide-details
                return-object
                :rules="[(v) => Boolean(Object.keys(v || {})[0]) || 'State is required']"
              />
            </v-col>
          </v-row>
          <div class="text-h6 pb-1 pt-2">Status</div>
          <v-row>
            <v-col cols="3" sm="3" class="pa-0">
              <v-select
                v-model="martialStatus"
                density="compact"
                variant="outlined"
                placeholder="Status"
                :items="martialStatusList"
                hide-details
              />
            </v-col>
          </v-row>
        </v-col>
        <v-row justify="center">
          <v-col class="text-center" cols="6" xl="6" lg="6" md="6" sm="6">
            <v-col class="pa-0">
              <v-btn
                class="text-capitalize"
                block
                size="x-large"
                :color="theme.dark ? '' : 'accent'"
                :disabled="!valid"
                @click="saveContactInformation()"
              >
                Next
              </v-btn>
            </v-col>
            <v-col class="align-self pt-2 pa-0 cursor-pointer">
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
import { ref, getCurrentInstance, onMounted } from 'vue'
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
    const firstName = ref('')
    const middleName = ref('')
    const lastName = ref('')
    const suffix = ref('')
    const phone = ref('')
    const email = ref('')
    const emailRegex = ref(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    )
    const items = ref(['Mobile', 'Home'])
    const typeForPhone = ref('Home')
    const streetAddress = ref('')
    const zipCode = ref('')
    const city = ref('')
    const state = ref('')
    const stateList = ref(planfinderlist.states)
    const martialStatus = ref('Single')
    const martialStatusList = ref(['Single', 'Married'])
    const valid = ref(false)
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    function f_goToNextWindow() {
      if (props.goToNextWindow) {
        props.goToNextWindow()
      } else {
        emit('goToNextWindow')
      }
    }
    function onlyNumber($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault()
      }
    }
    function saveContactInformation() {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        $store.state.openAccountDetail.FirstName = firstName.value ? firstName.value : ''
        $store.state.openAccountDetail.MiddleInitial = middleName.value ? middleName.value : ''
        $store.state.openAccountDetail.LastName = lastName.value ? lastName.value : ''
        $store.state.openAccountDetail.Suffix = suffix.value ? suffix.value : ''
        $store.state.openAccountDetail.Email = email.value ? email.value : ''
        $store.state.openAccountDetail.MailingStreetAddress = streetAddress.value ? streetAddress.value : ''
        $store.state.openAccountDetail.MailingZip = zipCode.value ? zipCode.value : ''
        $store.state.openAccountDetail.MailingCity = city.value ? city.value : ''
        $store.state.openAccountDetail.MailingState = state.value ? state.value.text.split('-')[1].trim() : ''
        $store.state.openAccountDetail.MaritalStatus = martialStatus.value ? martialStatus.value : ''
        $store.state.openAccountDetail.HomePhone = typeForPhone.value === 'Home' ? (phone.value ? phone.value : '') : ''
        $store.state.openAccountDetail.MobilePhone = typeForPhone.value === 'Mobile' ? (phone.value ? phone.value : '') : ''

        $axios.post(`/api/v1/sfdc/Registration`, $store.state.openAccountDetail)
      }
      emit('goToNextWindow')
    }
    function getAddress() {
      if (zipCode.value) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipCode.value}` }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              var address = results[0].formatted_address.split(',')
              city.value = address[0].length > 0 ? address[0].trim() : ''
              var stateCode = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              var stateName = ''
              if (stateCode) {
                stateName = stateList.value.filter((a) => a.value === stateCode)
              }
              state.value = stateName && stateName.length > 0 ? stateName[0] : ''
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
            } else {
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
            }
          } else {
            city.value = ''
            state.value = ''
            zipcodeError.value = true
            zipcodeErrorMsg.value = 'Invalid Zip Code'
          }
        })
      } else {
        city.value = ''
        state.value = ''
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
      }
    }
    onMounted(() => {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        firstName.value = $store.state.openAccountDetail.FirstName
        middleName.value = $store.state.openAccountDetail.MiddleInitial ? $store.state.openAccountDetail.MiddleInitial : ''
        lastName.value = $store.state.openAccountDetail.LastName
        suffix.value = $store.state.openAccountDetail.Suffix ? $store.state.openAccountDetail.Suffix : ''
        email.value = $store.state.openAccountDetail.Email
        streetAddress.value = $store.state.openAccountDetail.MailingStreetAddress
          ? $store.state.openAccountDetail.MailingStreetAddress
          : ''
        zipCode.value = $store.state.openAccountDetail.MailingZip ? $store.state.openAccountDetail.MailingZip : ''
        city.value = $store.state.openAccountDetail.MailingCity ? $store.state.openAccountDetail.MailingCity : ''
        if ($store.state.openAccountDetail.MailingState) {
          var stateName = stateList.value.filter(
            (a) => a.text.split('-')[1].trim() === $store.state.openAccountDetail.MailingState.toUpperCase()
          )
          state.value = stateName && stateName.length > 0 ? stateName[0] : ''
        } else state.value = ''
        martialStatus.value = $store.state.openAccountDetail.MaritalStatus
          ? $store.state.openAccountDetail.MaritalStatus
          : 'Single'
        if ($store.state.openAccountDetail.MobilePhone) {
          typeForPhone.value = 'Mobile'
          phone.value = $store.state.openAccountDetail.MobilePhone
        }
        if ($store.state.openAccountDetail.HomePhone) {
          typeForPhone.value = 'Home'
          phone.value = $store.state.openAccountDetail.HomePhone
        }
      }
    })
    return {
      theme,
      display,
      valid,
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      phone,
      typeForPhone,
      streetAddress,
      zipCode,
      zipcodeError,
      zipcodeErrorMsg,
      state,
      stateList,
      martialStatus,
      martialStatusList,
      emailRegex,
      items,
      city,
      onlyNumber,
      getAddress,
      saveContactInformation,
      f_goToNextWindow
    }
  }
}
</script>
