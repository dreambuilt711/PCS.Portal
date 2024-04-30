<template>
  <v-col cols="12" xs="12" class="pa-0">
    <v-card class="elevation-6 mb-0 pa-2" width="100%">
      <!-- new added here       -->
      <v-col class="py-3 pa-0" cols="12" xs="12">
        <v-row no-gutters>
          <v-col cols="12" lg="12" md="12" sm="12" class="pa-0">
            <v-btn
              v-if="exportPermissionForAdvisor"
              variant="text"
              class="font-weight-regular"
              :class="display.xs.value ? 'ml-0 mr-0' : ''"
              :color="theme.dark ? '' : 'hyperlink'"
              size="x-small"
              @click="exportToExcel()"
            >
              Export
            </v-btn>
            <v-col v-if="!exportPermissionForAdvisor" class="align-self-center font_size_span pt-3 font-weight-medium">
              <span>
                To export a copy of the lead search results, please get in touch with a sales rep
                <a target="_blank" href="https://www.pcsretirement.com/about-us/sales-team#team=employer">here</a>.
              </span>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
      <!-- end here -->
      <v-data-table
        :headers="headerList"
        :items="schoolDataList"
        item-key="id"
        :class="[display.smAndDown.value ? 'elevation-0 mb-3' : 'elevation-6 mb-3', isShowMapSwitch ? 'showMap' : 'hideMap']"
        :single-expand="true"
        :options="pagination"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
        mobile-breakpoint="0"
      >
        <template #item="{ item, isExpanded, expand }">
          <tr :class="mapSelectedSchool == item.id ? rowcolor : ''">
            <td :class="mapSelectedSchool == item.id ? selectedRowPadding : ''">
              <v-col cols="12" xs="12" class="pa-0">
                <v-row class="align-self">
                  <v-col
                    v-if="item.latitude && item.longitude"
                    cols="1"
                    xs="1"
                    md="1"
                    sm="1"
                    lg="1"
                    class="text-center d-flex flex_none mr-2 pa-0"
                    :class="isShowMapSwitch ? 'cursor-pointer' : ''"
                    @click="isShowMapSwitch ? mapHighlightForSchoolDistrict(item.id) : ''"
                  >
                    <v-icon size="16" class="icon-graduation schoolIcon" />
                  </v-col>
                  <v-col cols="1" xs="1" lg="1" sm="1" md="1" class="d-flex flex_none mr-3 pa-0">
                    <v-icon :ripple="false" size="12" class="schoolIcon removeOpacity" @click="expand(!isExpanded)">
                      {{ isExpanded ? 'mdi-menu-up' : 'mdi-menu-down' }}
                    </v-icon>
                  </v-col>
                  <v-col cols="9" xs="9" sm="9" lg="9" md="9" class="d-flex pa-0">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="schoolInfo(item.id)"
                          >{{ item.name ? item.name.toLowerCase() : ''
                          }}<span class="ml-1 text-lowercase">{{ `(${item.numberofSchools} schools)` }}</span></a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-right">
              {{ item.employees }}
            </td>
            <td class="text-left">
              {{ item.payrollslotName }}
            </td>
            <td class="text-left">
              <v-col v-if="item.payrollSlot !== 'Approved'" class="pa-0">
                <v-row>
                  <v-icon size="16" class="icon-warning pr-1" :color="!theme.dark ? '#ffbb11' : ''" />
                  <span>{{ item.payrollSlot }}</span>
                </v-row>
              </v-col>
              <v-col v-else class="pa-0">
                {{ item.payrollSlot }}
              </v-col>
            </td>
            <td class="text-center pa-1">
              <v-row class="justify-center">
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <v-btn
                    :color="!theme.dark ? 'hyperlink' : ''"
                    variant="text"
                    icon
                    class="text-none"
                    @click.stop=";[(closeReportPopUp[item.id] = true), (optionsSeinpNO = item.id), (optionsItem = item)]"
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <PlanStar
                    :key="componentBookmarkKey"
                    style="line-height: 0.5"
                    :school-district-id="item.id"
                    from="TAL"
                    type="SchoolDistrict"
                  />
                </v-col>
              </v-row>
              <v-dialog
                :key="item.id"
                v-model="closeReportPopUp[item.id]"
                :scrollable="false"
                max-width="max-content"
                content-class="elevation-3"
              >
                <v-card>
                  <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                    <v-col cols="12" xs="12" class="text-left pa-0">
                      <v-row>
                        <v-col cols="11" xs="11" class="text-left pa-0">
                          <h3>Actions</h3>
                        </v-col>
                        <v-col cols="1" xs="1" class="text-right align-self pa-0">
                          <v-icon
                            class="cursor-pointer"
                            :class="theme.dark ? '' : 'text-accent'"
                            @click="closeReportPopUp[item.id] = false"
                          >
                            mdi-close
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card-title>
                  <v-card-text class="pt-4">
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row>
                        <v-btn
                          block
                          class="ml-0"
                          :disabled="item.payrollSlot !== 'Approved'"
                          size="x-large"
                          :color="!theme.dark ? 'hyperlink text-white' : ''"
                          @click="
                            performAction(optionsSeinpNO, optionsItem, 'schoolDistrict', $event),
                              (closeReportPopUp[item.id] = false)
                          "
                        >
                          {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </td>
          </tr>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="nestedTableHeader"
              :items="item.schools ? item.schools : []"
              item-key="id"
              hide-default-footer
              :disable-pagination="true"
              class="nestedTable"
              mobile-breakpoint="0"
            >
              <template #item="{ item }">
                <tr>
                  <td></td>
                  <td v-if="display.mdAndUp.value" class="text-capitalize">
                    {{ item.name ? item.name.toLowerCase() : '' }}
                  </td>
                  <td v-if="display.smAndDown.value">
                    <v-col cols="12" xs="12" class="text-capitalize mt-2">
                      {{ item.name ? item.name.toLowerCase() : '' }}
                    </v-col>
                    <v-col cols="12" xs="12" class="mt-2 mb-2">
                      {{ item.address }}
                    </v-col>
                  </td>
                  <td v-if="display.mdAndUp.value" class="text-right">
                    {{ item.id }}
                  </td>
                  <td v-if="display.mdAndUp.value">
                    {{ item.type }}
                  </td>
                  <td v-if="display.mdAndUp.value" class="text-right">
                    {{ item.employees }}
                  </td>
                  <td v-if="display.smAndDown.value">
                    <v-col cols="12" xs="12" class="pt-2 ml-2 pb-5">
                      {{ item.employees }}
                    </v-col>
                    <v-col cols="12" xs="12" class="mt-2">
                      <v-btn
                        :color="!theme.dark ? 'hyperlink' : ''"
                        variant="text"
                        icon
                        class="text-none ma-0 pa-0"
                        @click.stop="
                          ;[(closeSchoolPopUp[item.id] = true), (optionsSchool = item.districtId), (optionSchoolItem = item)]
                        "
                      >
                        <v-icon size="21" class="icon-action" />
                      </v-btn>
                    </v-col>
                    <v-dialog
                      :key="item.id"
                      v-model="closeSchoolPopUp[item.id]"
                      :scrollable="false"
                      max-width="max-content"
                      content-class="elevation-3"
                    >
                      <v-card>
                        <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                          <v-col cols="12" xs="12" class="text-left pa-0">
                            <v-row>
                              <v-col cols="11" xs="11" class="text-left pa-0">
                                <h3>Actions</h3>
                              </v-col>
                              <v-col cols="1" xs="1" class="text-right align-self pa-0">
                                <v-icon class="cursor-pointer" color="text-hyperlink" @click="closeSchoolPopUp[item.id] = false">
                                  mdi-close
                                </v-icon>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-col cols="12" xs="12" class="pa-0">
                            <v-row>
                              <v-btn
                                block
                                class="ml-0"
                                :disabled="item.payrollSlot !== 'Approved'"
                                size="x-large"
                                :color="!theme.dark ? 'hyperlink text-white' : ''"
                                @click="
                                  performAction(optionsSchool, optionSchoolItem, 'school', $event),
                                    (closeSchoolPopUp[item.id] = false)
                                "
                              >
                                {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                              </v-btn>
                            </v-row>
                          </v-col>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </td>
                  <td v-if="display.mdAndUp.value">
                    {{ item.address }}
                  </td>
                  <td v-if="display.mdAndUp.value" class="text-center">
                    <v-row class="justify-center">
                      <v-col cols="12" xs="12" class="flex_none">
                        <v-btn
                          :color="!theme.dark ? 'hyperlink' : ''"
                          variant="text"
                          icon
                          class="text-none"
                          @click.stop="
                            ;[(closeSchoolPopUp[item.id] = true), (optionsSchool = item.districtId), (optionSchoolItem = item)]
                          "
                        >
                          <v-icon size="21" class="icon-action" />
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-dialog
                      :key="item.id"
                      v-model="closeSchoolPopUp[item.id]"
                      :scrollable="false"
                      max-width="max-content"
                      content-class="elevation-3"
                    >
                      <v-card>
                        <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                          <v-col cols="12" xs="12" class="text-left pa-0">
                            <v-row>
                              <v-col cols="11" xs="11" class="text-left pa-0">
                                <h3>Actions</h3>
                              </v-col>
                              <v-col cols="1" xs="1" class="text-right align-self pa-0">
                                <v-icon
                                  class="cursor-pointer"
                                  :class="theme.dark ? '' : 'text-accent'"
                                  @click="closeSchoolPopUp[item.id] = false"
                                >
                                  mdi-close
                                </v-icon>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-col cols="12" xs="12" class="pa-0">
                            <v-row>
                              <v-btn
                                block
                                class="ml-0"
                                :disabled="item.payrollSlot !== 'Approved'"
                                size="x-large"
                                :color="!theme.dark ? 'hyperlink text-white' : ''"
                                @click="
                                  performAction(optionsSchool, optionSchoolItem, 'school', $event),
                                    (closeSchoolPopUp[item.id] = false)
                                "
                              >
                                {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                              </v-btn>
                            </v-row>
                          </v-col>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="School" />
  </v-col>
</template>
<script>
import { ref, inject, onMounted, computed, getCurrentInstance, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme, useDisplay } from 'vuetify'
import PlanStar from '@/components/TAL/PlanStar'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
import _ from 'lodash'
import * as XLSX from 'xlsx'
export default {
  components: {
    PlanStar,
    OpenAccount
  },
  props: ['isShowStarred', 'mapFinderInfo', 'isShowMapSwitch'],
  setup(props) {
    const eventBus = inject('eventBus')
    const route = useRoute()
    const router = useRouter()
    const instance = getCurrentInstance()
    const theme = useTheme()
    const display = useDisplay()
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const closeReportPopUp = ref({})
    const closeSchoolPopUp = ref({})
    const filterDialog = ref(false)
    const expanded = ref([])
    const formDataList = ref([])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 50
    })
    const headerList = ref([
      {
        title: 'School District',
        value: 'name',
        align: 'start',
        width: '40%',
        class: 'sticky-header'
      },
      {
        title: '# Employees',
        value: 'employees',
        align: 'end',
        width: '14%',
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        title: 'Payroll Slot Owner',
        value: 'payrollslotName',
        align: 'start',
        width: '18%',
        class: 'd-none sticky-header'
      },
      {
        title: 'Payroll Slot',
        value: 'payrollSlot',
        align: 'start',
        width: '18%',
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        title: 'Actions',
        value: '',
        width: display.xs.value ? '20%' : '10%',
        align: 'center',
        sortable: false,
        class: 'pa-1 sticky-header'
      }
    ])
    const nestedTableHeader = ref([
      {
        title: '',
        value: '',
        align: display.xs.value ? 'center pr-6' : 'center',
        width: display.sm.value ? '1%' : '5%',
        sortable: false
      },
      {
        title: 'School Name',
        value: 'schoolName',
        align: 'start',
        width: display.lg.value || display.md.value ? '21%' : '25%',
        sortable: false
      },
      {
        title: 'School ID',
        value: 'schoolID',
        align: 'start',
        width: '10%',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'School Type',
        value: 'schoolType',
        align: 'start',
        width: '10%',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: '# Employees',
        value: 'Employees',
        align: display.mdAndUp.value ? 'end' : 'start',
        width: '15%',
        sortable: false
      },
      {
        title: 'Address',
        value: 'address',
        align: 'start',
        width: '35%',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Actions',
        value: '',
        width: '3%',
        align: 'center',
        sortable: false,
        class: 'hidden-sm-and-down'
      }
    ])
    const zipcode = ref(store.state.finderList.zipcode)
    const radius = ref(store.state.finderList.searchRadius)
    const schoolDataList = ref([])
    const employees = ref({})
    const payroll = ref('')
    const schoolType = ref('')
    const tpa = ref('')
    const mapSelectedSchool = ref('')
    const selectedRowPadding = ref('')
    const rowcolor = ref('')
    const componentBookmarkKey = ref(0)
    const payrollOwner = ref('')
    const exportPermissionForAdvisor = computed(() => {
      if (
        $authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full) ||
        store.state.advisorExportPermission === $authz.permission.FullAccess
      ) {
        return true
      } else {
        return false
      }
    })
    const applySchoolFilter = () => {
      var filterArray = store.state.finderList.schoolData ? store.state.finderList.schoolData : []

      if (schoolType.value) {
        let filterBySchool = []
        var accountFilter = filterArray.filter((a) => {
          let innerarray = a.schools.filter((b) => {
            return b.type === schoolType.value
          })
          if (innerarray.length > 0) return true
          else return false
        })
        if (filterBySchool.length > 0) {
          accountFilter.forEach((element) => {
            filterBySchool.push(element)
          })
        } else filterBySchool = accountFilter
        filterArray = _.uniqBy(filterBySchool)
      }
      if (Object.keys(employees.value).length > 0) {
        if (Number(employees.value.item1) >= 0 && Number(employees.value.item2) > 0) {
          filterArray = filterArray.filter(
            (a) => a.employees >= Number(employees.value.item1) && a.employees <= Number(employees.value.item2)
          )
        }
      }
      if (tpa.value) {
        let filterByTpa = []
        let schoolTPAFilter = filterArray.filter((a) => a.tpa === tpa.value)
        if (filterByTpa.length > 0) {
          schoolTPAFilter.forEach((element) => {
            filterByTpa.push(element)
          })
        } else filterByTpa = schoolTPAFilter
        filterArray = _.uniqBy(filterByTpa)
      }
      if (payroll.value) {
        let filterByPayroll = []
        let schoolPayRollFilter = filterArray.filter((a) => a.payrollSlot === payroll.value)
        if (filterByPayroll.length > 0) {
          schoolPayRollFilter.forEach((element) => {
            filterByPayroll.push(element)
          })
        } else filterByPayroll = schoolPayRollFilter
        filterArray = _.uniqBy(filterByPayroll)
      }
      if (payrollOwner.value) {
        let filterByPayrollOwner = []
        let schoolPayRollOwnerFilter = filterArray.filter((a) => a.payrollslotName === payrollOwner.value)
        if (filterByPayrollOwner.length > 0) {
          schoolPayRollOwnerFilter.forEach((element) => {
            filterByPayrollOwner.push(element)
          })
        } else filterByPayrollOwner = schoolPayRollOwnerFilter
        filterArray = _.uniqBy(filterByPayrollOwner)
      }
      schoolDataList.value = filterArray
      store.state.finderList.schoolSearchResult = schoolDataList.value
      eventBus.emit('applySchoolFilteredData', filterArray)
    }
    const getSchoolsData = () => {
      if (store.state.finderList.schoolData) {
        schoolDataList.value = store.state.finderList.schoolData
        applySchoolFilter()
      } else {
        $axios
          .get(
            `/api/v1/tal/schooldistricts?zipcode=${zipcode.value ? zipcode.value : null}&radius=${radius.value ? radius.value : 0}`
          )
          .then((success) => {
            schoolDataList.value =
              success.data.d && success.data.d.schooldistrictData && success.data.d.schooldistrictData.length > 0
                ? success.data.d.schooldistrictData
                : []
            if (schoolDataList.value && schoolDataList.value.length > 0) {
              for (var i = 0; i < schoolDataList.value.length; i++) {
                if (schoolDataList.value[i].schools && schoolDataList.value[i].schools.length > 0) {
                  for (var j = 0; j < schoolDataList.value[i].schools.length; j++) {
                    schoolDataList.value[i].schools[j].payrollSlot = schoolDataList.value[i].payrollSlot
                  }
                }
              }
            }
            store.state.finderList.schoolDataCount =
              success.data.d && success.data.d.schooldistrictData ? success.data.d.schooldistrictData.length : 0
            applySchoolFilter()
          })
      }
    }
    const updateModels = () => {
      if (store.state.finderList.advanceFilter) {
        if (
          Object.keys(store.state.finderList).length > 0 &&
          Object.keys(store.state.finderList.advanceFilter.schoolFilterChip).length > 0
        ) {
          var schoolChipList = store.state.finderList.advanceFilter
          schoolType.value = schoolChipList.schoolType ? schoolChipList.schoolType : ''
          tpa.value = schoolChipList.tpa ? schoolChipList.tpa : ''
          payroll.value = schoolChipList.payroll ? schoolChipList.payroll : ''
          payrollOwner.value = schoolChipList.payrollOwner ? schoolChipList.payrollOwner : ''
          employees.value = schoolChipList.employee ? schoolChipList.employee : {}
          getSchoolsData()
        } else getSchoolsData()
      }
    }
    const getFormTitanData = () => {
      $axios.get(`/api/v1/tal/advisor/schools/contactandaccount`).then((success) => {
        if (success.data.d) {
          formDataList.value = success.data.d
          store.state.advisorContactId = formDataList.value[0].AdvisorContactId
          store.state.advisorAccountId = formDataList.value[0].AdvisorAccountId
          store.state.advisorWebsiteCredentialId = formDataList.value[0].AdvisorWebsiteCredentialId
        }
      })
    }
    const performAction = (id, val, type) => {
      if (val) {
        var schoolDistrictValue = {}
        if (type === 'school') {
          var parentValue = schoolDataList.value.filter((a) => a.id === id)
          schoolDistrictValue = parentValue && parentValue.length > 0 ? parentValue[0] : {}
        } else {
          schoolDistrictValue = val
        }
        var schoolNameVal = type === 'school' ? val.name : ''
        if (OpenAccount) OpenAccount.openTeacherAccount(schoolDistrictValue, schoolNameVal)
        store.state.openAccountDetail = {}
        filterDialog.value = true
      }
    }
    const schoolInfo = (schoolDistrictId) => {
      store.state.finderList.prospectValue = 1
      router.push({
        query: {
          schoolDistId: schoolDistrictId,
          zipcode: zipcode.value,
          radius: radius.value
        },
        name: 'SchoolAccountDetails',
        params: {
          lastRoute: route.path
        }
      })
    }
    const mapHighlightForSchoolDistrict = (schoolDistId) => {
      if (props.mapFinderInfo) props.mapFinderInfo.highlightSchoolDistrictMarker(schoolDistId)
    }
    const exportToExcel = () => {
      var xlHeaders = []
      var schoolResult = []
      var updatedSchoolResult = []
      updatedSchoolResult = getSchoolExportData(schoolDataList.value)
      xlHeaders = ExportSchool(updatedSchoolResult)
      schoolResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, schoolResult, 'Schools')
      XLSX.writeFile(wb, 'Schools.xlsx')
    }
    const currencyConvert = (xlWb, xlColRef, xlRowNum) => {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Schools'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    const percentConvert = (xlWb, xlColRef, xlRowNum) => {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Schools'][xlColRef + xlRowNum], '0.00%')
    }
    const ExportSchool = (schools) => {
      var xlHeaders = schools.map((rec) => {
        return {
          'Payroll Slot': rec.PayrollSlot,
          'School District Name': rec.DistrictName,
          'School Name': rec.SchoolName,
          'School Type': rec.SchoolType,
          'Number Of Employees': rec.Employees,
          'Student Teacher Ratio': rec.StudentTeachersRatio,
          'School Address': rec.Address,
          'School ZipCode': rec.ZipCode,
          'School Country': rec.Country
        }
      })
      return xlHeaders
    }
    const getSchoolExportData = (schoolDataList) => {
      var final = []
      schoolDataList.forEach((element) => {
        element.schools.forEach((element1) => {
          var testData = []
          testData.PayrollSlot = element.payrollSlot
          testData.DistrictName = element.name
          testData.SchoolName = element1.name
          testData.SchoolType = element1.type
          testData.Employees = element1.employees
          testData.StudentTeachersRatio = element1.studentTeachersRatio
          testData.Address = element1.address
          testData.ZipCode = element1.zipCode
          testData.Country = element.country
          final.push(testData)
        })
      })
      return final
    }
    watch(
      () => store.state.finderList.schoolData,
      () => {
        schoolDataList.value = store.state.finderList.schoolData
        zipcode.value = store.state.finderList.zipcode
        radius.value = store.state.finderList.searchRadius
      },
      { deep: true, immediate: true }
    )
    onMounted(() => {
      updateModels()
      getFormTitanData()
      eventBus.on('applySchoolFilter', (data) => {
        employees.value = data.employee ? data.employee : {}
        payroll.value = data.payroll ? data.payroll : ''
        payrollOwner.value = data.payrollOwner ? data.payrollOwner : ''
        schoolType.value = data.schoolType ? data.schoolType : ''
        tpa.value = data.tpa ? data.tpa : ''
        getSchoolsData()
      })
      eventBus.on('refreshBookMark', () => {
        componentBookmarkKey.value += 1
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('applySchoolFilter')
      eventBus.off('refreshBookMark')
    })
    return {
      closeReportPopUp,
      closeSchoolPopUp,
      filterDialog,
      expanded,
      nestedTableHeader,
      mapSelectedSchool,
      rowcolor,
      formDataList,
      exportPermissionForAdvisor,
      selectedRowPadding,
      pagination,
      headerList,
      performAction,
      schoolInfo,
      mapHighlightForSchoolDistrict,
      exportToExcel,
      currencyConvert,
      percentConvert,
      store,
      display,
      theme,
      router,
      schoolDataList,
      componentBookmarkKey
    }
  }
}
</script>
<style scoped>
.v-data-table.showMap :deep(.sticky-header) {
  position: sticky;
  top: -15px !important;
  z-index: 2;
}

.v-data-table.hideMap :deep(.sticky-header) {
  position: sticky;
  top: var(--toolbarHeight) !important;
  z-index: 2;
}

.v-data-table.showMap :deep(.v-data-table__wrapper),
.v-data-table.hideMap :deep(.v-data-table__wrapper) {
  overflow: unset;
}
</style>
