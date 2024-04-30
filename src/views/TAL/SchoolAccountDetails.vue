<template>
  <v-container :class="[display.smAndDown.value ? 'pl-1 pr-1' : 'v-container--fluid', theme.dark ? 'dark_bg' : '']">
    <v-container class="pt-1" :class="display.smAndDown.value ? 'pl-0 pr-0' : 'v-container--fluid'">
      <v-col cols="12" xs="12" class="pt-2 pb-2 pa-0">
        <v-row>
          <v-col class="pt-2" :class="display.smAndDown.value ? 'pl-2 pb-1' : 'pb-1'">
            <router-link
              :to="prevRoute.fullPath !== '/' ? (prevRoute.fullPath ? prevRoute.fullPath : '/') : lastPath"
              class="text-decoration-none"
            >
              <span :class="theme.dark ? 'text-white handcursor' : 'text-hyperlink handcursor'">
                <v-icon size="small" :class="theme.dark ? 'text-white pb-1' : 'text-hyperlink pb-1'">mdi-chevron-left</v-icon>
                <span
                  :class="theme.dark ? 'text-white pl-2 text-uppercase font_14' : 'text-hyperlink pl-2 text-uppercase font_14'"
                >
                  Back
                </span>
              </span>
            </router-link>
          </v-col>
          <v-col
            v-if="$authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full)"
            class="text-right align-self"
            :class="display.smAndDown.value ? 'pt-2 pb-1' : ''"
          >
            <a
              href="#"
              class="text-uppercase text-decoration-none pr-1 font_14"
              :class="!theme.dark ? 'text-hyperlink' : 'text-white'"
              style="padding-right: 5px !important"
              @click="exportToExcel()"
              >Export</a
            >
            <span>|</span>
          </v-col>
          <div style="padding-left: 5px !important" class="pt-1">
            <PlanStar :school-district-id="schooldistrictId" from="TAL" type="SchoolDistrict" />
          </div>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" class="pa-0">
        <v-card class="elevation-4">
          <SchoolStepperDetails :selected-school="selectedSchool ? selectedSchool : []" />
        </v-card>
      </v-col>
      <!-- tabs start here -->
      <v-col v-if="display.smAndDown.value ? (createReport ? true : false) : true" class="pt-1 pa-0">
        <v-row>
          <v-col class="mt-2 pa-0" :xs="display.smAndDown.value ? '11' : '12'" :sm="display.smAndDown.value ? '11' : '12'">
            <v-card>
              <v-tabs
                v-model="schoolDistrictTab"
                :bg-color="theme.dark ? '' : 'accent'"
                class="plantabs"
                align-tabs="center"
                center-active
                show-arrows
                slider-color="white"
              >
                <v-tab v-for="(item, index) in schoolDistricts" :key="index">
                  {{ item.text }}
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
          <v-col
            v-if="display.smAndDown.value"
            :class="[display.smAndDown.value ? 'elevation-1 text-center' : '', theme.dark ? 'darkmode_background' : 'accent']"
            cols="12"
            xs="1"
            sm="1"
            style="height: 45px !important"
            class="mt-2"
            @click="createReport = !createReport"
          >
            <v-icon class="text-secondary mt-2 pt-1 handcursor"> remove_circle </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        v-if="display.smAndDown.value"
        v-show="!createReport"
        cols="12"
        xs="12"
        sm="12"
        class="pt-2 pb-2 pl-2 pr-1 text-secondary border_radius_2 mt-2 pa-0"
        :class="theme.dark ? 'darkmode_background' : 'accent'"
        @click="createReport = !createReport"
      >
        <v-row>
          <v-col cols="11" xs="11" sm="11" class="pt-1"> Select Type </v-col>
          <v-col cols="1" xs="1" sm="1" class="text-center handcursor">
            <v-icon class="text-secondary"> add_circle </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <!-- school tab -->
      <v-col v-if="display.smAndDown.value ? (createReport ? true : false) : true" class="pa-0">
        <v-col v-if="schoolDistrictTab === 0" class="mt-4 pa-0">
          <SchoolInfo :selected-school="selectedSchool ? selectedSchool : []" />
        </v-col>
      </v-col>
      <!-- Activity tab -->
      <v-col v-if="display.smAndDown.value ? (createReport ? true : false) : true" class="pa-0">
        <v-col v-if="schoolDistrictTab === 1" cols="12" xl="12" lg="12" md="12" class="mt-4 pa-0">
          <v-card>
            <h2 class="pt-3 pb-3 font-weight-medium" :class="display.xs.value ? 'pl-2' : 'pl-4'">Activity</h2>
            <v-col class="pa-0">
              <SchoolActivity :selected-school="selectedSchool ? selectedSchool : []" />
            </v-col>
          </v-card>
        </v-col>
      </v-col>
    </v-container>
  </v-container>
</template>
<script>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import SchoolStepperDetails from '@/components/TAL/SchoolStepperDetails'
import SchoolInfo from '@/components/TAL/SchoolInformation'
import SchoolActivity from '@/components/TAL/SchoolActivity'
import PlanStar from '@/components/TAL/PlanStar'
import * as XLSX from 'xlsx'
export default {
  components: {
    SchoolStepperDetails,
    SchoolInfo,
    SchoolActivity,
    PlanStar
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  setup() {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $route = useRoute()
    const createReport = ref(false)
    const schoolState = ref('')
    const schoolDistrictTab = ref(0)
    const schoolDistricts = ref([
      { text: 'Schools', value: 'school' },
      { text: 'Activity', value: 'activity' }
    ])
    const valid = ref(true)
    const InnerFormValid = ref(false)
    const lastPath = ref($route.params.lastRoute)
    const prevRoute = ref('')
    const zipcode = ref(null)
    const radius = ref(0)
    const selectedSchool = ref([])
    const formSrc = ref('')
    const searchText = ref('')
    const schoolInformationLoading = ref(true)
    const schooldistrictId = ref('')
    const type = ref('')
    const formTitanSchoolDistId = ref('')
    const tpaAccountId = ref('')
    const encodeQueryData = (data) => {
      const ret = []
      for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
      return ret.join('&')
    }
    const getSchoolInformationDetail = async () => {
      if ($route.query.schoolDistId) schooldistrictId.value = $route.query.schoolDistId
      if ($route.query.zipcode) zipcode.value = $route.query.zipcode
      if ($route.query.radius) radius.value = $route.query.radius
      if ($route.query.type) type.value = $route.query.type
      if (zipcode.value > 0 && radius.value > 0) {
        var promises = []
        var url = '/api/v1/tal/schooldistricts'
        let urlObj = {}
        if (zipcode.value) {
          urlObj['zipcode'] = zipcode.value
          url = `/api/v1/tal/schooldistricts?${encodeQueryData(urlObj)}`
        }
        if (radius.value) {
          urlObj['radius'] = radius.value
          url = `/api/v1/tal/schooldistricts?${encodeQueryData(urlObj)}`
        }
        if (searchText.value) {
          urlObj['searchCriteria'] = searchText.value
          url = `/api/v1/tal/schooldistricts?${encodeQueryData(urlObj)}`
        }

        promises.push(
          $axios.get(`${url}`).then((success) => {
            if (success.data.d && success.data.d.schooldistrictData.length > 0) {
              var schoolValue = success.data.d.schooldistrictData
              if (schoolValue && schoolValue.length > 0) {
                for (var i = 0; i < schoolValue.length; i++) {
                  if (schoolValue[i].schools && schoolValue[i].schools.length > 0) {
                    for (var j = 0; j < schoolValue[i].schools.length; j++) {
                      schoolValue[i].schools[j].payrollSlot = schoolValue[i].payrollSlot
                    }
                  }
                }
              }

              if (type.value === 'School') {
                selectedSchool.value = schoolValue.filter((a) => {
                  let schoolArray = a.schools.filter((b) => {
                    return b.id === schooldistrictId.value
                  })
                  if (schoolArray.length > 0) return true
                  else return false
                })
              } else {
                selectedSchool.value = schoolValue.filter((d) => d.id === schooldistrictId.value)
              }
              schoolInformationLoading.value = false
              formTitanSchoolDistId.value =
                selectedSchool.value && selectedSchool.value.length > 0 ? selectedSchool.value[0].id : ''
              tpaAccountId.value =
                selectedSchool.value && selectedSchool.value.length > 0 ? selectedSchool.value[0].tpaAccountId : ''
            } else {
              selectedSchool.value = []
              schoolInformationLoading.value = false
            }
          })
        )
        await Promise.allSettled(promises)
      } else {
        if ($route.query.schoolDistName) {
          let schoolDisName = $route.query.schoolDistName
          $axios.get(`/api/v1/tal/schooldistricts?searchCriteria=${schoolDisName}`).then((success) => {
            if (success.data.d && success.data.d.schooldistrictData.length > 0) {
              var schoolDistValue = success.data.d.schooldistrictData
              if (schoolDistValue && schoolDistValue.length > 0) {
                for (var i = 0; i < schoolDistValue.length; i++) {
                  if (schoolDistValue[i].schools && schoolDistValue[i].schools.length > 0) {
                    for (var j = 0; j < schoolDistValue[i].schools.length; j++) {
                      schoolDistValue[i].schools[j].payrollSlot = schoolDistValue[i].payrollSlot
                    }
                  }
                }
              }
              selectedSchool.value = schoolDistValue.filter((d) => d.name === schoolDisName)
              schoolInformationLoading.value = false
              formTitanSchoolDistId.value =
                selectedSchool.value && selectedSchool.value.length > 0 ? selectedSchool.value[0].id : ''
              tpaAccountId.value =
                selectedSchool.value && selectedSchool.value.length > 0 ? selectedSchool.value[0].tpaAccountId : ''
            } else {
              selectedSchool.value = []
              schoolInformationLoading.value = false
            }
          })
        } else if ($store.state.finderList.schoolData) {
          if (type.value === 'School') {
            selectedSchool.value = $store.state.finderList.schoolData.filter((a) => {
              let schoolArray = a.schools.filter((b) => {
                return b.id === schooldistrictId.value
              })
              if (schoolArray.length > 0) return true
              else return false
            })
          } else {
            selectedSchool.value = $store.state.finderList.schoolData.filter((d) => d.id === schooldistrictId.value)
          }
          schoolInformationLoading.value = false
          formTitanSchoolDistId.value = selectedSchool.value && selectedSchool.value.length > 0 ? selectedSchool.value[0].id : ''
          tpaAccountId.value = selectedSchool.value && selectedSchool.value.length > 0 ? selectedSchool.value[0].tpaAccountId : ''
        }
      }
    }
    const ExportSchool = (selectedSchool) => {
      var xlHeaders = selectedSchool.map((rec) => {
        return {
          'School District Account Id': rec.accountId,
          'School District Id': rec.id,
          'School District Name': rec.name,
          'School District Address': rec.address,
          'School District County': rec.country,
          'Number of Schools': rec.numberofSchools,
          'Payroll Slot': rec.payrollSlot,
          Employees: rec.employees,
          'Total Salaries': rec.totalSalaries,
          'Contact Name': rec.contactName ? rec.contactName : null
        }
      })
      return xlHeaders
    }
    const exportToExcel = () => {
      var xlHeaders = []
      var schoolResult = []
      var selected = []
      selected.push(selectedSchool.value)
      xlHeaders = ExportSchool(selected[0])
      schoolResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, schoolResult, 'Schools')
      for (var XSchoolrow = 2; XSchoolrow !== xlHeaders.length + 2; ++XSchoolrow) {
        currencyConvert(wb, 'I', XSchoolrow, 'Schools')
      }
      XLSX.writeFile(wb, 'Schools.xlsx')
    }
    const currencyConvert = (xlWb, xlColRef, xlRowNum, sheetName) => {
      XLSX.utils.cell_set_number_format(xlWb.Sheets[sheetName][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    const formTitanUrl = computed(() => {
      var schoolDistrictId = formTitanSchoolDistId.value
      var advisorContactId = $store.state.advisorContactId
      var advisorWebsiteCredentialId = $store.state.advisorWebsiteCredentialId
      var relationshipId = $store.state.user.selectedProgram.selectedRelationship.relationshipId
      var programId = $store.state.user.selectedProgram.selectedRelationship.programId
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      formSrc.value = `${
        window.__env.formTitanBaseUri
      }403benrollment/?fld453=${schoolDistrictId}&fld456=${advisorContactId.trim()}&fld491=${programId.trim()}&fld460=${relationshipId.trim()}&fld714=${advisorWebsiteCredentialId.trim()}&fld717=${tpaAccountId.value.trim()}`
      return formSrc.value
    })
    const approvalRequiredformTitanUrl = computed(() => {
      var schoolDistrictId = formTitanSchoolDistId.value
      var advisorContactId = $store.state.advisorContactId
      var programPayrollSetup = 'payrollslotsetup'
      var program = $store.state.user.selectedProgram.programName
      if ($authz.program.Axos === program) programPayrollSetup = 'payrollslotsetup-axos'

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      formSrc.value = `${
        window.__env.formTitanBaseUri
      }${programPayrollSetup}/?fld372=${advisorContactId.trim()}&fld435=${schoolDistrictId.trim()}`
      return formSrc.value
    })
    onMounted(() => {
      window.onbeforeunload = function () {
        if (prevRoute.value.fullPath !== '/') localStorage.setItem('schoolPlanLastRoute', prevRoute.value.fullPath)
      }
      if (localStorage.lastRoute && localStorage.lastRoute !== '/') lastPath.value = localStorage.schoolPlanLastRoute
      getSchoolInformationDetail()
      if ($route.query.reportOption) {
        schoolDistrictTab.value = 2
      }
      if (display.smAndDown.value) {
        createReport.value = true
      }
    })
    return {
      theme,
      display,
      lastPath,
      prevRoute,
      $authz,
      schooldistrictId,
      createReport,
      schoolDistrictTab,
      schoolDistricts,
      schoolState,
      valid,
      InnerFormValid,
      formTitanUrl,
      approvalRequiredformTitanUrl,
      exportToExcel
    }
  }
}
</script>
<style scoped>
.label {
  color: red;
}

.darkmode_background {
  background: #424242 !important;
}

.border_radius_2 {
  border-radius: 2px !important;
}
</style>
