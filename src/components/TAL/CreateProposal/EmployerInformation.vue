<template>
  <v-row justify="center">
    <v-col cols="12" xs="12" lg="8" class="justify-center">
      <v-col cols="12" xs="12" class="text-center pb-4">
        <h1>Employment Information</h1>
      </v-col>
      <v-form ref="form" v-model="valid">
        <v-col class="pt-4 pb-14">
          <div class="text-h6 pb-1">Employer</div>
          <v-row v-if="!showPlanName">
            <v-col cols="12" sm="12" class="pb-2 pa-0">
              <h2 class="mb-1 mt-1">
                {{ schoolDistrict }}
              </h2>
            </v-col>
            <v-col cols="12" sm="12" class="pa-0">
              <v-select
                v-model="school"
                density="compact"
                :items="schoolList"
                variant="outlined"
                hide-details
                placeholder="Select School"
                item-title="name"
                item-value="name"
                :disabled="disabledSchool"
              />
            </v-col>
          </v-row>
          <v-col v-if="showPlanName" cols="12" sm="12" class="pb-2">
            <h2 class="mb-1 mt-1">
              {{ planName && planName.length > 0 ? planName[0].PlanSponsor : '' }}
            </h2>
          </v-col>
          <div class="text-h6 pb-1 pt-2">Occupation Details</div>
          <v-row>
            <v-col cols="12" sm="6" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-2'">
              <v-text-field
                v-model="occupation"
                placeholder="Occupation"
                single-line
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="6" sm="6" />
          </v-row>
          <div class="text-h6 pb-1 pt-2">Date of Hire</div>
          <v-row>
            <v-col cols="6" sm="6" class="pb-2 pa-0" :class="display.xs.value ? '' : 'pr-2'">
              <v-text-field
                v-model="hireDate"
                density="compact"
                v-input-mask="{
                  alias: 'datetime',
                  inputFormat: 'mm/dd/yyyy',
                  max: maxHireDate
                }"
                :error-messages="checkDateErrorMsg"
                :error="checkDateError"
                variant="outlined"
                :rules="[(v) => !!v || 'Date of Hire is required']"
                @update:model-value="dateHire = parseDate(hireDate)"
                @blur="checkDate(hireDate)"
              >
                <template #append-inner>
                  <v-btn icon variant="flat" style="height: 36px; width: 36px">
                    <v-icon> mdi-calendar </v-icon>
                    <v-menu v-model="menu2" activator="parent" :close-on-content-click="false" transition="scale-transition">
                      <v-date-picker
                        v-model="dateHire"
                        color="accent"
                        :max="maxDate"
                        @update:model-value="menu2 = false"
                        width="368px"
                      />
                    </v-menu>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-row justify="center" class="mt-3">
          <v-col class="text-center pa-0" cols="12" lg="6">
            <v-col class="pa-0">
              <v-btn
                class="text-capitalize"
                block
                size="x-large"
                :color="theme.dark ? '' : 'accent'"
                :disabled="!valid"
                @click="saveEmployerInformation()"
              >
                Next
              </v-btn>
            </v-col>
            <v-col class="align-self pt-2 cursor-pointer">
              <a :class="[!theme.dark ? 'text-hyperlink' : 'text-white', 'font_14']" @click="f_goToNextWindow()">
                <b>Skip, I'll do this later</b>
              </a>
            </v-col>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
import { ref, getCurrentInstance, computed, watch, onMounted } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
export default {
  props: ['goToNextWindow'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const schoolDistrict = ref('')
    const schoolDistrictList = ref([])
    const school = ref('')
    const schoolList = ref([])
    const valid = ref(true)
    const occupation = ref('')
    const position = ref('')
    const menu2 = ref(false)
    const checkDateErrorMsg = ref('')
    const checkDateError = ref(false)
    const hireDate = ref('')
    const isHireDate = ref(false)
    const dateHire = ref(null)
    const disabledSchool = ref(false)
    const planId = ref('')
    const planList = ref([])
    const planName = ref('')
    const planTypeName = ref('')
    function f_goToNextWindow() {
      if (props.goToNextWindow) {
        props.goToNextWindow()
      } else {
        emit('goToNextWindow')
      }
    }
    function parseDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        isHireDate.value = true
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
    function checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          hireDate.value = ''
          checkDateErrorMsg.value = 'Invalid date'
          checkDateError.value = true
        } else {
          checkDateError.value = false
          checkDateErrorMsg.value = ''
        }
      }
    }
    function saveEmployerInformation() {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        $store.state.openAccountDetail.DateofHire = dateHire.value ? dateHire.value : ''
        $store.state.openAccountDetail.Occupation = occupation.value ? occupation.value : ''
        $store.state.openAccountDetail.Position = position.value ? position.value : ''
        $store.state.openAccountDetail.SchoolName = school.value ? school.value : ''
        $axios.post(`/api/v1/sfdc/Registration`, $store.state.openAccountDetail)
        if (school.value && $store.state.openAccountDetail.OpportunityId) {
          $axios.post(`/api/v1/sfdc/opportunity/${$store.state.openAccountDetail.OpportunityId}/schooolname/${school.value}`)
        }
      }
      emit('goToNextWindow')
    }
    const maxDate = computed(() => {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    })
    const maxHireDate = computed(() => {
      var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
      const [year, month, day] = today.split('-')
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    })
    const showPlanName = computed(() => {
      if (planTypeName.value === $authz.planType.Individual_Simple_IRA) {
        return true
      } else if (planTypeName.value === $authz.planType.Individual_457_b_Governmental_Plan) {
        return true
      } else {
        return false
      }
    })
    watch(
      () => dateHire.value,
      () => {
        if (!isHireDate.value) hireDate.value = formatDate(dateHire.value)
        isHireDate.value = false
      },
      { immediate: true, deep: true }
    )
    watch(
      () => menu2.value,
      (val) => {
        if (!val) {
          checkDate(hireDate.value)
        }
      }
    )
    onMounted(() => {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        schoolDistrictList.value = $store.state.openAccountDetail.schoolDistrictList
          ? $store.state.openAccountDetail.schoolDistrictList
          : []
        schoolList.value = $store.state.openAccountDetail.schoolList ? $store.state.openAccountDetail.schoolList : []
        if ($store.state.openAccountDetail.DateofHire) {
          hireDate.value = formatDate($store.state.openAccountDetail.DateofHire)
          dateHire.value = parseDate(hireDate.value)
        }
        occupation.value = $store.state.openAccountDetail.Occupation ? $store.state.openAccountDetail.Occupation : ''
        position.value = $store.state.openAccountDetail.Position ? $store.state.openAccountDetail.Position : ''
        planTypeName.value = $store.state.openAccountDetail.PlanTypeName ? $store.state.openAccountDetail.PlanTypeName : ''
        if (!showPlanName.value) {
          schoolDistrict.value = $store.state.openAccountDetail.schoolDistrictList[0].name
            ? $store.state.openAccountDetail.schoolDistrictList[0].name
            : ''
          school.value = $store.state.openAccountDetail.SchoolName ? $store.state.openAccountDetail.SchoolName : ''
        }
        disabledSchool.value = $store.state.openAccountDetail.fromPage
          ? $store.state.openAccountDetail.fromPage === 'School'
            ? true
            : false
          : false
        planId.value = $store.state.openAccountDetail.PlanId ? $store.state.openAccountDetail.PlanId : ''
        if ($store.state.openAccountDetail.planList && $store.state.openAccountDetail.planList.length > 0) {
          planName.value = $store.state.openAccountDetail.planList.filter((a) => a.Id === $store.state.openAccountDetail.PlanId)
        } else {
          planName.value = ''
        }
      }
    })
    return {
      theme,
      display,
      valid,
      showPlanName,
      schoolDistrict,
      school,
      schoolList,
      disabledSchool,
      occupation,
      menu2,
      hireDate,
      checkDateErrorMsg,
      checkDateError,
      dateHire,
      maxDate,
      planList,
      maxHireDate,
      checkDate,
      parseDate,
      saveEmployerInformation,
      f_goToNextWindow
    }
  }
}
</script>
