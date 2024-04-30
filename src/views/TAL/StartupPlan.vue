<template>
  <v-container fluid>
    <v-col>
      <h1 class="font-weight-medium pt-2">Create a Startup Plan</h1>
    </v-col>
    <v-col class="pt-3">
      <h3>
        If you have information for a company that does not currently have a retirement plan for their employees, enter the
        details below. Click Save and Run Proposal to generate a PDF report and add the company to your Prospect Pipeline.
      </h3>
    </v-col>
    <v-card class="elevation-2 mt-4">
      <v-form ref="form" v-model="valid">
        <v-col :class="display.xs.value ? 'pa-3' : 'pa-5'">
          <v-col class="pb-2 pa-0">
            <h3>
              <b>Plan Details</b>
            </h3>
          </v-col>
          <v-col cols="12" xs="12" class="pa-0">
            <v-row>
              <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                <v-row>
                  <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-text-field
                        v-model="companyName"
                        label="Company Name *"
                        autocomplete="autofill-off"
                        required
                        variant="outlined"
                        maxlength="140"
                        density="compact"
                        :rules="[(v) => !!v || 'Company Name is required']"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-text-field
                        v-model="einno"
                        v-input-mask="{
                          mask: '9999999999[-99]',
                          rightAlign: false,
                          placeholder: '',
                          allowMinus: false
                        }"
                        label="EIN#"
                        variant="outlined"
                        density="compact"
                        maxlength="13"
                        autocomplete="autofill-off"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-select
                        v-model="planType"
                        label="Plan Type *"
                        autocomplete="autofill-off"
                        :items="planOptionList"
                        item-title="text"
                        :clearable="!!planType"
                        variant="outlined"
                        density="compact"
                        return-object
                        auto-select-first
                        :rules="[(v) => !!v || 'Plan Type is required']"
                        @update:model-value="showESPValue"
                      />
                    </v-col>
                  </v-col>
                  <v-col v-if="showESP" cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-select
                        v-model="espType"
                        label="Proposal Type *"
                        autocomplete="autofill-off"
                        :items="ESPTypeList"
                        variant="outlined"
                        density="compact"
                        return-object
                        auto-select-first
                        append-icon="icon-chevron-down"
                        :rules="[(v) => !!v || 'ESP Type is required']"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-text-field
                        v-model="estContributions"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: ''
                        }"
                        label="Estimated 1st year Contribution"
                        maxlength="15"
                        autocomplete="autofill-off"
                        required
                        variant="outlined"
                        density="compact"
                        @focus="$event.target.select()"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="6" xl="4" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-text-field
                        v-model="totalParticipant"
                        v-input-mask="{
                          alias: 'numeric',
                          digits: '0',
                          rightAlign: false,
                          placeholder: '',
                          allowMinus: false
                        }"
                        required
                        density="compact"
                        maxlength="4"
                        label="Estimated Participants with a 1st year Balance *"
                        :rules="[(v) => !!v || 'Estimated Participants with a 1st year Balance is required']"
                        autocomplete="autofill-off"
                        variant="outlined"
                        @focus="$event.target.select()"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-text-field
                        v-model="asofDate"
                        density="compact"
                        label="As of Date *"
                        autocomplete="autofill-off"
                        :error-messages="checkDateErrorMsg"
                        v-input-mask="{
                          alias: 'datetime',
                          inputFormat: 'mm/dd/yyyy',
                          min: minDateMask,
                          max: maxDateMask,
                          showMaskOnHover: false
                        }"
                        :error="checkDateError"
                        required
                        variant="outlined"
                        :rules="[(v) => !!v || 'As of Date is required']"
                        @update:model-value="dateAsset = parseDate(asofDate)"
                        @blur="checkDate(asofDate)"
                      >
                        <template #append-inner>
                          <v-btn icon variant="flat" style="height: 36px; width: 36px">
                            <v-icon> mdi-calendar </v-icon>
                            <v-menu activator="parent">
                              <v-date-picker
                                v-model="dateAsset"
                                color="accent"
                                :min="minDate"
                                :max="maxDate"
                                width="368px"
                                @update:model-value="menu2 = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-col>
                  <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-select
                        v-model="planYearEnd"
                        label="Plan Year End"
                        autocomplete="autofill-off"
                        :items="planYearEndList"
                        item-title="text"
                        :clearable="!!planYearEnd"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                  </v-col>
                  <v-col
                    v-if="planType ? planType.text === 'Simple IRA Plan Proposal' : false"
                    cols="12"
                    xl="4"
                    xs="12"
                    lg="4"
                    md="6"
                    sm="6"
                  >
                    <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                      <v-select
                        v-model="strategist"
                        label="Strategist *"
                        autocomplete="autofill-off"
                        :items="strategistList"
                        clearable
                        variant="outlined"
                        density="compact"
                        return-object
                        auto-select-first
                        :rules="[(v) => !!v || 'Strategist is required']"
                      />
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="pb-2 pt-1 pa-0">
            <h3>
              <b>Plan Contact</b>
            </h3>
          </v-col>
          <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
            <v-row>
              <v-col
                v-if="planType ? planType.text !== 'Simple IRA Plan Proposal' : true"
                class="pa-0"
                cols="12"
                xl="4"
                xs="12"
                lg="4"
                md="6"
                sm="6"
              >
                <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                  <v-text-field
                    v-model="contactNo"
                    maxlength="255"
                    label="Contact Name"
                    autocomplete="autofill-off"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-col>
              <v-col
                v-if="planType ? planType.text === 'Simple IRA Plan Proposal' : false"
                class="pa-0"
                cols="12"
                xl="4"
                xs="12"
                lg="4"
                md="6"
                sm="6"
              >
                <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                  <v-text-field
                    v-model="firstName"
                    maxlength="255"
                    label="First Name"
                    autocomplete="autofill-off"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-col>
              <v-col
                v-if="planType ? planType.text === 'Simple IRA Plan Proposal' : false"
                class="pa-0"
                cols="12"
                xl="4"
                xs="12"
                lg="4"
                md="6"
                sm="6"
              >
                <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                  <v-text-field
                    v-model="lastName"
                    maxlength="255"
                    label="Last Name"
                    autocomplete="autofill-off"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-col>
              <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                  <v-text-field
                    v-model="companyAddress"
                    label="Address"
                    autocomplete="autofill-off"
                    maxlength="255"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
            <v-row>
              <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                  <v-text-field
                    v-model="zipcode"
                    v-input-mask="{
                      mask: '99999',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    label="Zip Code"
                    maxlength="5"
                    density="compact"
                    autocomplete="autofill-off"
                    :error="zipcodeError"
                    variant="outlined"
                    :error-messages="zipcodeErrorMsg"
                    @change="getAddress()"
                  />
                </v-col>
              </v-col>
              <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                  <v-text-field
                    v-model="city"
                    label="City"
                    disabled
                    variant="outlined"
                    density="compact"
                    autocomplete="autofill-off"
                  />
                </v-col>
              </v-col>
              <v-col cols="12" xl="4" xs="12" lg="4" md="6" sm="6" class="pa-0">
                <v-col :xs="display.xs.value ? '12' : '11'" class="pl-0 pr-10 pa-0">
                  <v-text-field
                    v-model="state"
                    label="State"
                    disabled
                    variant="outlined"
                    density="compact"
                    autocomplete="autofill-off"
                  />
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-if="$authz.hasPermission($authz.permissionSet.Create_Start_up_Plan__c, $authz.permission.Full)"
            pr-0
            class="text-right"
            cols="12"
            xs="12"
          >
            <v-row>
              <v-col offset-sm="12" class="pa-0">
                <v-btn class="ma-2" variant="outlined" :color="theme.dark ? '' : 'accent'" @click="ResetFormData()">
                  Clear
                </v-btn>
                <v-btn class="ma-2" :color="theme.dark ? '' : 'accent'" :disabled="!valid" @click="saveInformation()">
                  {{
                    planType
                      ? planType.text === 'Simple IRA Plan Proposal'
                        ? 'SAVE PROPOSAL'
                        : 'SAVE & RUN PROPOSAL'
                      : 'SAVE & RUN PROPOSAL'
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import moment from 'moment'
import { ref, getCurrentInstance, computed, watch, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  props: ['PlanProposal', 'planId', 'tokens'],
  setup() {
    const instance = getCurrentInstance()
    const theme = useTheme()
    const display = useDisplay()
    const router = useRouter()
    const store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const toast = instance.appContext.config.globalProperties.$toast
    const $authz = instance.appContext.config.globalProperties.$authz
    const $event = instance.appContext.config.globalProperties.$event
    const form = ref(null)
    const e1 = ref(-1)
    const planName = ref('')
    const planType = ref('')
    const einno = ref('')
    const industry = ref('')
    const totalAsset = ref('')
    const estContributions = ref('')
    const contactNo = ref('')
    const totalParticipant = ref('')
    const menu2 = ref(false)
    const asofDate = ref('')
    const companyName = ref('')
    const companyZip = ref('')
    const companyAddress = ref('')
    const dateAsset = ref(null)
    const saveMsg = ref('')
    const diagnosticSnackbar = ref(false)
    const planOptionList = ref([])
    const valid = ref(true)
    const city = ref('')
    const state = ref('')
    const zipcode = ref('')
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    const checkDateErrorMsg = ref('')
    const checkDateError = ref(false)
    const isAsOfDate = ref(false)
    const displayStrategist = ref(false)
    const strategist = ref('')
    const strategistList = ref([])
    const planIdNew = ref(0)
    const firstName = ref('')
    const lastName = ref('')
    const ESPTypeList = ref([
      { text: 'Single Employer Plan', value: 'Single Employer Plan' },
      {
        text: 'Pooled Employer Plan (PEP)',
        value: 'Pooled Employer Plan (PEP)'
      }
    ])
    const showESP = ref(false)
    const espType = ref('Single Employer Plan')
    const planYearEnd = ref('')
    const planYearEndList = ref([
      { text: '01/31', value: '01/31' },
      { text: '02/28', value: '02/28' },
      { text: '03/31', value: '03/31' },
      { text: '04/30', value: '04/30' },
      { text: '05/31', value: '05/31' },
      { text: '06/30', value: '06/30' },
      { text: '07/31', value: '07/31' },
      { text: '08/31', value: '08/31' },
      { text: '09/30', value: '09/30' },
      { text: '10/31', value: '10/31' },
      { text: '11/30', value: '11/30' },
      { text: '12/31', value: '12/31' }
    ])
    const minDate = computed(() => {
      const year = moment().subtract(12, 'months').format('YYYY')
      const currentdate = new Date()
      const month = ('0' + currentdate.getMonth()).slice(-2)
      const date = ('0' + currentdate.getDate()).slice(-2)
      const minAsofDate = year + '-' + month + '-' + date
      return minAsofDate
    })
    const maxDate = computed(() => {
      const year = moment().add(12, 'months').format('YYYY')
      const currentdate = new Date()
      const month = ('0' + currentdate.getMonth()).slice(-2)
      const date = ('0' + currentdate.getDate()).slice(-2)
      const maxAsofDate = year + '-' + month + '-' + date
      return maxAsofDate
    })
    const minDateMask = computed(() => {
      const year = moment().subtract(12, 'months').format('YYYY')
      const currentdate = new Date()
      const month = ('0' + currentdate.getMonth()).slice(-2)
      const date = ('0' + currentdate.getDate()).slice(-2)
      const minAsofDate = month + '/' + date + '/' + year
      return minAsofDate
    })
    const maxDateMask = computed(() => {
      const year = moment().add(12, 'months').format('YYYY')
      const currentdate = new Date()
      const month = ('0' + currentdate.getMonth()).slice(-2)
      const date = ('0' + currentdate.getDate()).slice(-2)
      const maxAsofDate = month + '/' + date + '/' + year
      return maxAsofDate
    })
    const showESPValue = () => {
      if (store.state.user.selectedProgram) {
        if (store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
          if (planType.value) {
            if (planType.value.value === $authz.planType.Defined_Contribution_Plan) {
              espType.value = ''
              showESP.value = true
            } else {
              espType.value = ''
              showESP.value = false
            }
          } else {
            espType.value = ''
            showESP.value = false
          }
        } else {
          espType.value = ''
          showESP.value = false
        }
      } else {
        espType.value = ''
        showESP.value = false
      }
    }
    const getPlanTypes = () => {
      store
        .dispatch('getPlanTypes')
        .then(() => {
          planOptionList.value = store.state.planTypes.length > 0 ? store.state.planTypes : []
        })
        .catch(() => {
          planOptionList.value = []
        })
    }
    const checkDate = (val) => {
      if (val) {
        if (!Date.parse(val)) {
          asofDate.value = ''
          checkDateErrorMsg.value = 'Invalid date'
          checkDateError.value = true
        } else {
          checkDateError.value = false
          checkDateErrorMsg.value = ''
        }
      }
    }
    const formatDate = (date) => {
      if (!date) return null
      var c_date = date
      if (typeof date === 'string') {
        c_date = new Date(date)
      }
      return `${c_date.getMonth() + 1}/${c_date.getDate()}/${c_date.getFullYear()}`
    }
    const ResetFormData = () => {
      estContributions.value = ''
      planYearEnd.value = ''
      checkDateError.value = false
      checkDateErrorMsg.value = ''
      form.value.reset()
      asofDate.value = ''
      contactNo.value = ''
      companyAddress.value = ''
      companyZip.value = ''
      einno.value = ''
      totalAsset.value = ''
      totalParticipant.value = ''
    }
    const parseDate = (date) => {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        isAsOfDate.value = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    const saveInformation = () => {
      var currentdate = new Date()
      var year = currentdate.getFullYear()
      var planYearEndDate = planYearEnd.value + '/' + year
      if (form.value.validate()) {
        var StartupPlanObj = {
          SNAME: companyName.value,
          PNAME: companyName.value,
          DCPTYPE: planType.value ? planType.value.text.trim() : '',
          SEINPNO: einno.value,
          INDUSTRY: industry.value,
          Contact: contactNo.value,
          SSTREET: companyAddress.value,
          CityStateZip: companyZip.value,
          TOTASSETS: estContributions.value ? estContributions.value : 0.0,
          EstimatedFirstYearContributions: 0.0,
          PARTIC: totalParticipant.value ? totalParticipant.value : 0,
          AsOfDate: asofDate.value,
          YEAREND: planYearEnd.value ? planYearEndDate : '',
          PlanID: 0,
          Strategist: strategist.value ? strategist.value.text : '',
          ESPType: showESP.value ? (espType.value ? espType.value.text : '') : ''
        }
        if (StartupPlanObj.DCPTYPE === 'Simple IRA Plan Proposal') {
          $axios.post(`/api/v1/plan/startup`, StartupPlanObj).then((success) => {
            if (success.data.d != null) {
              toast.success('Saved Successfully', '')
              StartupPlanObj.PlanID = success.data.d
              planIdNew.value = success.data.d
              savePlanLead()
              router.push({
                path: `/TAL/SimpleIRARequest`
              })
            }
          })
        } else {
          $axios.post(`/api/v1/plan/startup`, StartupPlanObj).then((success) => {
            if (success.data.d != null) {
              toast.success('Saved Successfully', '')
              StartupPlanObj.PlanID = success.data.d
              savePlanLeadDraft(success.data.d, StartupPlanObj.SEINPNO === '' ? 'startup' : StartupPlanObj.SEINPNO)
              router.push({
                path: `/TAL/Plan/${StartupPlanObj.SEINPNO === '' ? 'startup' : StartupPlanObj.SEINPNO}`,
                query: {
                  reportOption: 'Proposal',
                  planId: StartupPlanObj.PlanID,
                  type: 'NewPlan'
                }
              })
            }
          })
        }
      }
    }
    const getAddress = () => {
      if (zipcode.value) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode.value}` }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              var address = results[0].formatted_address.split(',')
              city.value = address[0].length > 0 ? address[0].trim() : ''
              state.value = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              companyZip.value = city.value + ', ' + state.value + ' ' + zipcode.value
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
        companyZip.value = ''
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
      }
    }
    const getStrategistList = () => {
      $axios.get(`/api/v1/managedplan/strategists`).then((success) => {
        if (success.data.d && success.data.d.length > 0) {
          var strategistListData = success.data.d.map(function (el) {
            if (el.Strategist) {
              return {
                text: el.Strategist,
                value: el.GroupId
              }
            }
          })
          strategistList.value = strategistListData
        } else {
          strategistList.value = []
        }
      })
    }
    const savePlanLead = () => {
      var simpleIRARequest = {
        SNAME: companyName.value,
        PNAME: companyName.value,
        DCPTYPE: planType.value ? planType.value.text.trim() : '',
        SEINPNO: einno.value,
        FirstName: firstName.value,
        LastName: lastName.value,
        SSTREET: companyAddress.value,
        ZipCode: zipcode.value,
        City: city.value,
        State: state.value,
        EstimatedFirstYearContributions: estContributions.value ? estContributions.value : 0.0,
        AsofDate: asofDate.value,
        PlanID: planIdNew.value,
        Strategist: strategist.value ? strategist.value.text.trim() : '',
        Employees: totalParticipant.value !== '' ? totalParticipant.value : 0,
        GroupId: strategist.value ? strategist.value.value : 0,
        PlanLeadId: ''
      }
      $axios.put(`/api/v1/plan/saveSimpleIRADetails`, simpleIRARequest)
    }
    const savePlanLeadDraft = (planId, seinpno) => {
      $axios.post(`/api/v1/tal/report/${seinpno}/${planId}/draft`)
    }
    watch(
      () => dateAsset.value,
      () => {
        if (!isAsOfDate.value) asofDate.value = formatDate(dateAsset.value)
        isAsOfDate.value = false
      },
      { immediate: true, deep: true }
    )
    watch(
      () => menu2.value,
      (val) => {
        if (!val) {
          checkDate(asofDate.value)
        }
      }
    )
    onMounted(() => {
      getPlanTypes()
      if (store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
        getStrategistList()
      }
    })
    return {
      theme,
      display,
      $authz,
      $event,
      valid,
      companyName,
      einno,
      planType,
      e1,
      form,
      planName,
      saveMsg,
      diagnosticSnackbar,
      displayStrategist,
      planOptionList,
      showESPValue,
      espType,
      ESPTypeList,
      estContributions,
      totalParticipant,
      asofDate,
      checkDateErrorMsg,
      checkDateError,
      parseDate,
      checkDate,
      dateAsset,
      minDate,
      minDateMask,
      maxDate,
      maxDateMask,
      menu2,
      planYearEnd,
      planYearEndList,
      strategist,
      strategistList,
      contactNo,
      firstName,
      lastName,
      companyAddress,
      zipcode,
      zipcodeError,
      zipcodeErrorMsg,
      getAddress,
      city,
      state,
      ResetFormData,
      saveInformation
    }
  }
}
</script>
<style scoped>
.stepers_div .v-stepper__label {
  width: 100% !important;
}

.my-input.v-input .v-input__slot {
  border-radius: 100px;
}
</style>
