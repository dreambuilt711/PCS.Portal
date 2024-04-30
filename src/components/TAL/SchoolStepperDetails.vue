<template>
  <v-col class="information_review">
    <v-container :fluid="true" :class="[schoolInformationLoading ? 'pt-0' : 'pb-2 pt-3']">
      <v-progress-linear v-if="schoolInformationLoading" indeterminate color="accent" height="4" />
      <v-col cols="12" xl="12" lg="12" md="12" xs="12">
        <v-row>
          <v-col
            ref="staticMap"
            v-resize="onResize"
            cols="4"
            xl="4"
            lg="4"
            md="4"
            sm="12"
            xs="12"
            :class="display.mdAndUp.value ? 'pr-3 pl-3' : 'pr-1'"
            class="text-center"
          >
            <v-card class="elevation-0" style="background-color: lightgrey">
              <v-icon
                v-if="!googleMarkerimg"
                class="fas fa-map-marked-alt fa-7x icon_font"
                :class="display.smAndDown.value ? 'pb-3 pt-2' : 'pt-3 pb-3'"
              />
            </v-card>
            <img
              v-if="googleMarkerimg"
              :src="googleMarkerimg"
              draggable="false"
              style="border: 0px"
              width="100%"
              :height="display.md.value ? '250px' : '200px'"
              class="map_image_border img_slection_none"
            />
          </v-col>
          <v-col v-if="!schoolInformationLoading" cols="12" xl="8" lg="8" md="8" sm="12" xs="12">
            <v-row class="text-left">
              <v-col
                class="text-left"
                cols="12"
                md="8"
                xs="12"
                :class="[display.smAndDown.value ? 'pb-2 pt-2' : '', display.mdAndUp.value ? 'pl-3' : '']"
              >
                <h2 class="text-capitalize">
                  {{
                    selectedSchool && selectedSchool.length > 0
                      ? selectedSchool[0].name
                        ? selectedSchool[0].name.toLowerCase()
                        : 'Not available'
                      : ''
                  }}
                </h2>
              </v-col>
              <v-col class="mt-2" cols="12" xs="12">
                <v-row>
                  <v-col cols="12" xl="2" lg="3" md="3" sm="5" xs="6" class="pb-3 pl-3">
                    <v-col>District ID</v-col>
                    <v-col>
                      <b>{{
                        selectedSchool && selectedSchool.length > 0 ? (selectedSchool[0].id ? selectedSchool[0].id : 0) : 0
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="3" md="3" sm="6" class="pb-3 pl-3">
                    <v-col>Employees</v-col>
                    <v-col>
                      <b>{{
                        selectedSchool && selectedSchool.length > 0
                          ? selectedSchool[0].employees
                            ? selectedSchool[0].employees
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!display.smAndDown.value" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="6" lg="3" md="3" sm="5" class="pb-3 pl-3">
                    <v-col>Total Salaries</v-col>
                    <v-col>
                      <b>{{
                        selectedSchool && selectedSchool.length > 0
                          ? selectedSchool[0].totalSalaries
                            ? formatPrice(selectedSchool[0].totalSalaries, 2)
                            : '$0'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!display.md.value" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="2" md="3" sm="6" class="pb-3 pl-3">
                    <v-col>Contact Name</v-col>
                    <v-col>
                      <b>{{
                        selectedSchool && selectedSchool.length > 0
                          ? selectedSchool[0].contactName
                            ? selectedSchool[0].contactName
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="display.md.value || display.xl.value" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="6" md="3" lg="3" sm="5" class="pb-3 pl-3">
                    <v-col>Address</v-col>
                    <v-col :class="display.xs.value ? 'pr-2' : ''">
                      <b>
                        <span>
                          {{
                            selectedSchool && selectedSchool.length > 0
                              ? selectedSchool[0].address
                                ? selectedSchool[0].address
                                : ''
                              : ''
                          }}
                          <br />{{
                            selectedSchool && selectedSchool.length > 0
                              ? selectedSchool[0].country
                                ? selectedSchool[0].country
                                : ''
                              : ''
                          }}
                          {{
                            selectedSchool && selectedSchool.length > 0
                              ? selectedSchool[0].zipCode
                                ? selectedSchool[0].zipCode
                                : ''
                              : ''
                          }}
                        </span>
                      </b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="3" md="3" sm="5" class="pb-3 pl-3">
                    <v-col>County</v-col>
                    <v-col>
                      <b>{{
                        selectedSchool && selectedSchool.length > 0
                          ? selectedSchool[0].country
                            ? selectedSchool[0].country
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="display.lg.value" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="6" lg="3" md="3" sm="5" class="pb-3 pl-3">
                    <v-col>Payroll Slot</v-col>
                    <v-col>
                      <b>{{
                        selectedSchool && selectedSchool.length > 0
                          ? selectedSchool[0].payrollSlot
                            ? selectedSchool[0].payrollSlot
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="2" md="3" sm="5" class="pb-3 pl-3">
                    <v-col>TPA</v-col>
                    <v-col>
                      <b>{{
                        selectedSchool && selectedSchool.length > 0
                          ? selectedSchool[0].tpa
                            ? selectedSchool[0].tpa
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="!schoolInformationLoading" cols="12" xs="12">
            <v-row class="justify-end">
              <v-col sm6 class="text-end">
                <v-btn
                  :disabled="
                    selectedSchool && selectedSchool.length > 0
                      ? selectedSchool[0].payrollSlot
                        ? selectedSchool[0].payrollSlot !== 'Approved'
                        : true
                      : true
                  "
                  :color="!theme.dark ? 'hyperlink text-white' : ''"
                  @click="performAction(selectedSchool[0])"
                >
                  {{
                    `Open Account ( ${
                      selectedSchool && selectedSchool.length > 0
                        ? selectedSchool[0].name
                          ? selectedSchool[0].name.toLowerCase()
                          : ''
                        : ''
                    } )`
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="School" />
    </v-container>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance, watch, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
export default {
  components: {
    OpenAccount
  },
  props: ['selectedSchool'],
  setup(props) {
    const display = useDisplay()
    const theme = useTheme()
    const $route = useRoute()
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const reviewPanel = ref(true)
    const asOfDate = ref(new Date())
    const OpenAccount = ref(null)
    const staticMap = ref(null)
    const schoolInformationLoading = ref(true)
    const progress = ref(-1)
    const dateCreated = ref('')
    const currentStatus = ref('Active')
    const diagnosticComplete = ref(false)
    const rpeaComplete = ref(false)
    const proposalComplete = ref(false)
    const agrmtSentComplete = ref(false)
    const agrmtReceivedComplete = ref(false)
    const dialog = ref(false)
    const planId = ref(1)
    const googleMarkerimg = ref('')
    const school = ref('')
    const filterDialog = ref(false)
    const performAction = (val) => {
      if (val) {
        if (OpenAccount.value) OpenAccount.value.openTeacherAccount(val, '')
        $store.state.openAccountDetail = {}
        filterDialog.value = true
      }
    }
    const onResize = () => {
      GetMap()
    }
    const GetMap = () => {
      var address = props.selectedSchool.length > 0 && props.selectedSchool[0].address ? props.selectedSchool[0].address : ''
      // eslint-disable-next-line no-undef
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode(
        {
          address: address
        },
        function (results, status) {
          // eslint-disable-next-line no-undef
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            callMap(address)
          } else {
            address = ''
            callMap(address)
          }
        }
      )
    }
    const callMap = (address) => {
      var height = display.md.value ? '250' : '200'
      var width = staticMap.value !== undefined ? staticMap.value.$vuetify.display.width : 363
      var queryString = `locs=${address}`
      queryString += '&size=' + width + 'x' + height + '&scale=2'

      var apiUrl = `/api/v1/tal/plan/map?${queryString}`

      $axios(apiUrl, {
        method: 'GET',
        responseType: 'blob'
      }).then((success) => {
        googleMarkerimg.value = ''
        var file = new Blob([success.data], { type: 'image/png' })
        var url = URL.createObjectURL(file)
        googleMarkerimg.value = url
      })
    }
    watch(
      () => props.selectedSchool,
      () => {
        GetMap()
        schoolInformationLoading.value = false
      }
    )
    onMounted(() => {
      GetMap()
      school.value = $route.query.schoolName ? $route.query.schoolName : 'School'
    })
    return {
      theme,
      display,
      schoolInformationLoading,
      staticMap,
      googleMarkerimg,
      OpenAccount,
      filterDialog,
      reviewPanel,
      asOfDate,
      progress,
      dateCreated,
      currentStatus,
      diagnosticComplete,
      rpeaComplete,
      proposalComplete,
      agrmtReceivedComplete,
      agrmtSentComplete,
      dialog,
      planId,
      onResize,
      performAction
    }
  }
}
</script>
<style scoped>
.information_review .v-subheader {
  height: 28px !important;
}

.hr_border {
  border: solid 1px lightgray !important;
  height: 30px;
}
.v-label {
  font-size: 0.93em !important;
  color: grey !important;
}

.map_image_border {
  border: solid 1px lightgrey;
}
.img_slection_none {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>
<style scoped>
.v-stepper__header .v-divider {
  margin: 0 0px !important;
}
.disableStepper:hover {
  cursor: not-allowed;
}

.iconSize {
  font-size: 1em !important;
}

.v-btn:before {
  opacity: 0 !important;
  width: 62px !important;
  height: 26px !important;
}

table.v-table tbody td,
table.v-table tfoot td {
  font-size: 0.82em !important;
}
.statusBack {
  background: #147ac2 0% 0% no-repeat padding-box;
  border-radius: 5px;
  opacity: 0.16;
  width: 82px !important;
  color: #0969b0;
}

.rotate_icon_180 {
  transform: rotate(90deg) !important;
  -webkit-transform: rotate(90deg) !important;
}

.flexborder {
  border: 1px solid #707070 !important;
}

.overflow_x_hidden {
  overflow-x: hidden !important;
}
</style>
