<template>
  <v-col class="pa-0">
    <v-col cols="12" md="12" sm="12" lg="12" xl="12" class="pa-0">
      <v-card class="elevation-3 pa-5" height="100%" :min-height="display.xs.value ? '700px' : '600px'">
        <v-col class="pb-4 pa-0">
          <v-row no-gutters>
            <v-col cols="12" class="pa-0">
              <v-row align="center" justify="center">
                <h2 class="font_24">Search Leads</h2>
                <v-spacer />
                <a class="pr-4 font_14" @click="changeView()">
                  <span class="text-hyperlink">{{ showMapView ? 'Recent Searches' : 'Map View' }}</span>
                </a>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" sm="3" :class="display.xs.value ? 'mb-2' : ''">
              <v-col class="pa-0">
                <v-select
                  v-model="prospectTab"
                  :items="sponsorList"
                  item-key="value"
                  item-title="text"
                  class="text-hyperlink"
                  @update:modelValue="getCustomerType"
                >
                  <template #selection="{ item }">
                    <v-list-item :title="item.raw.text" class="pa-0">
                      <template #prepend>
                        <v-icon size="16" :class="[item.raw.icon, item.raw.color, 'mr-1']" />
                      </template>
                    </v-list-item>
                  </template>
                  <template #item="{ props, item }">
                    <v-list-item :title="item.text" v-bind="props">
                      <template #prepend>
                        <v-icon size="16" :class="[item.raw.icon, item.raw.color, 'mr-1']" />
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-col>
            <v-col cols="12" sm="7" :class="display.xs.value ? 'mb-2' : 'pl-3'">
              <v-col
                cols="12"
                class="pa-0"
                :class="[display.mdAndUp.value ? 'mr-auto' : '', !display.sm.value && display.xs.value ? 'pr-3' : '']"
              >
                <v-text-field
                  ref="wildCardSearch"
                  v-model="searchText"
                  clearable
                  placeholder="Search for...."
                  :hide-details="display.xs.value"
                  @blur=";/-00[0-9]/.exec(searchText) ? searchBlur(true) : searchBlur(false)"
                />
              </v-col>
            </v-col>
            <v-col cols="12" sm="2" :class="display.xs.value ? 'mb-3' : ''">
              <v-col class="justify-end text-end pa-0">
                <v-btn
                  color="accent"
                  :disabled="searchLoading"
                  :loading="searchLoading"
                  class="mt-0 mb-0 elevation-1"
                  :class="!display.sm.value && display.xs.value ? 'pl-8 pr-8' : ''"
                  @click="getRecentSearch()"
                >
                  Search
                  <template #searchLoading>
                    <span class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </template>
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-show="showMapView" cols="12" class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" class="pad_right_2px">
              <v-progress-linear v-if="loading" indeterminate color="accent" height="4" />
            </v-col>
            <v-col cols="12">
              <FinderMap
                ref="mapFinder"
                :show-map="true"
                map-type="web"
                :plan-info="redirectPlanInfo"
                :last-map="''"
                :prospect-tab="prospectTab"
                from-page="searchLead"
                :search-zipcode="searchZipcode"
                :school-detail-page="schoolDetailPage"
              />
            </v-col>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col class="justify-start widgetLeftButtonPosition">
                  <v-btn class="ml-0 text-capitalize" color="accent" @click="redirectToLeads()"> Search All Leads </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-show="!showMapView" cols="12" class="pa-0">
          <v-col cols="12" class="pa-0">
            <v-data-table
              v-model:expanded="expanded"
              :headers="headerList"
              :items="searchList"
              item-key="Id"
              class="elevation-0"
              :hide-default-footer="true"
              :disable-pagination="true"
              mobile-breakpoint="0"
              style="backface-visibility: hidden"
              :fixed-header="true"
              :loading="searchLoading"
              :height="'380px'"
            >
              <template #item="{ item, isExpanded, expand }">
                <tr v-if="item.customerType === 'Schools'">
                  <td class="pa-0">
                    <v-col cols="12" class="pa-0">
                      <v-row class="align-self">
                        <v-col
                          v-if="item.latitude && item.longitude"
                          cols="1"
                          sm="1"
                          md="1"
                          lg="1"
                          xl="1"
                          class="text-center pa-0"
                        >
                          <v-icon size="16" class="icon-graduation schoolIcon" />
                        </v-col>
                        <v-col cols="1" sm="1" md="1" lg="1" xl="1" class="pa-0">
                          <v-icon :ripple="false" size="12" class="schoolIcon removeOpacity" @click="expand(!isExpanded)">
                            {{ isExpanded ? 'fas fa-caret-up' : 'fas fa-caret-down' }}
                          </v-icon>
                        </v-col>
                        <v-col cols="9" xl="9" lg="9" md="9" sm="9" class="pa-0">
                          <v-hover v-slot="{ hover }">
                            <h4 class="pt-1">
                              <a
                                :class="['text-hyperlink', hover ? 'text-decoration-underline' : 'text-decoration-none']"
                                class="text-capitalize"
                                @click="schoolInfo(item)"
                                >{{ item.name ? item.name.toLowerCase() : '' }}</a
                              >
                            </h4>
                          </v-hover>
                        </v-col>
                      </v-row>
                    </v-col>
                  </td>
                  <td v-if="display.mdAndUp.value">
                    <v-col cols="12" class="pa-0">
                      <v-row>
                        <v-col v-if="item.payrollSlot !== 'Approved'" class="pa-0">
                          <v-row>
                            <v-icon size="16" class="icon-warning pr-1" :color="!theme.dark ? '#ffbb11' : ''" />
                            <span>{{ item.payrollSlot }}</span>
                          </v-row>
                        </v-col>
                        <v-col v-else>
                          {{ item.payrollSlot }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </td>
                  <td class="text-center pa-1">
                    <v-row class="justify-center">
                      <v-col cols="12" class="flex_none pa-0">
                        <v-btn
                          color="hyperlink"
                          variant="text"
                          icon
                          class="text-none"
                          @click.stop="
                            !showSchool
                              ? (showBusinessDialog = true)
                              : [(closeSchoolDistrictPopUp[item.id] = true), (optionsSeinpNO = item.id), (optionsItem = item)]
                          "
                        >
                          <v-icon size="21" class="icon-action" />
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-dialog
                      :key="item.id"
                      v-model="closeSchoolDistrictPopUp[item.id]"
                      :scrollable="false"
                      max-width="max-content"
                      content-class="elevation-3"
                    >
                      <v-card>
                        <v-card-title class="mt-2 mb-2 pt-2 pb-2">
                          <v-col cols="12" class="text-left">
                            <v-row>
                              <v-col cols="11" class="text-left">
                                <h3>Actions</h3>
                              </v-col>
                              <v-col cols="1" class="text-right pa-0 align-self">
                                <v-btn variant="text" size="small" @click="closeSchoolDistrictPopUp[item.id] = false">
                                  <v-icon color="accent" icon="mdi:mdi-window-close"></v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-col cols="12">
                            <v-row>
                              <v-btn
                                block
                                class="ml-0"
                                :disabled="item.payrollSlot !== 'Approved'"
                                size="x-large"
                                color="hyperlink"
                                @click="
                                  performSchoolAction(optionsSeinpNO, optionsItem, 'schoolDistrict', $event),
                                    (closeSchoolDistrictPopUp[item.id] = false)
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
                <tr v-if="item.customerType === 'Employer Sponsored'">
                  <td class="pa-0">
                    <v-col cols="12" class="pa-0">
                      <v-row class="align-self">
                        <v-col cols="1" sm="1" md="1" lg="1" xl="1" class="text-center">
                          <v-icon
                            v-if="item.PlANADDRESSLATITUDE && item.PLANADDRESSLONGITUDE"
                            size="16"
                            class="icon-for-profit forProfitIcon"
                          />
                        </v-col>
                        <v-col
                          cols="1"
                          sm="1"
                          md="1"
                          lg="1"
                          xl="1"
                          class="text-center"
                          :style="`width:${item.PlANADDRESSLATITUDE && item.PLANADDRESSLONGITUDE ? '6px' : '23px'}`"
                        />
                        <v-col cols="9" sm="9" xl="9" lg="9" md="9" class="pa-0">
                          <v-hover v-slot="{ hover }">
                            <h4 class="pt-1">
                              <a
                                v-if="item.InBookOfBusiness === 0"
                                :class="['text-hyperlink', hover ? 'text-decoration-underline' : 'text-decoration-none']"
                                class="text-capitalize"
                                @click="planInfo(item, $event)"
                                >{{ item.PNAME ? item.PNAME.toLowerCase() : '' }}</a
                              >
                            </h4>
                          </v-hover>
                          <v-tooltip location="top">
                            <template #activator="{ props }">
                              <h4>
                                <a
                                  v-if="item.InBookOfBusiness === 1"
                                  v-bind="props"
                                  class="text-capitalize cursorPointer text-decoration-none iconColor"
                                >
                                  {{ item.PNAME ? item.PNAME.toLowerCase() : '' }}
                                </a>
                              </h4>
                            </template>
                            <span>
                              This Plan is already on the PCS Platform. Please contact <br />your regional sales team for more
                              information.</span
                            >
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </td>
                  <td v-if="display.mdAndUp.value">
                    <v-col cols="12" class="pa-0">
                      <v-row>
                        <v-col class="flex_none mr-1 text-capitalize">
                          {{ item.DCPTYPE }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </td>
                  <td class="text-center pa-1">
                    <v-row class="justify-center">
                      <v-col cols="12" class="flex_none pa-0">
                        <v-btn
                          v-if="item.selectreport && item.selectreport.length > 0"
                          icon
                          color="hyperlink"
                          variant="text"
                          @click.stop="
                            !showEmployerSponsored
                              ? (showBusinessDialog = true)
                              : [(closeReportPopUp[item.SEINPNO] = true), (optionsSeinpNO = item.SEINPNO), (optionsItem = item)]
                          "
                        >
                          <v-icon size="21" class="icon-action" />
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-dialog
                      v-if="item.InBookOfBusiness === 1"
                      :key="item.SEINPNO"
                      v-model="closeReportPopUp[item.SEINPNO]"
                      :scrollable="false"
                      :max-width="display.xs.value ? '100%' : '600'"
                      content-class="elevation-3"
                    >
                      <v-card>
                        <v-card-title class="mt-2 mb-2 pt-2 pb-2">
                          <v-col cols="12" class="text-left">
                            <v-row>
                              <v-col cols="12" class="text-right">
                                <v-icon class="cursor-pointer" color="hyperlink" @click="closeReportPopUp[item.SEINPNO] = false">
                                  close
                                </v-icon>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="text-left">
                                <h3 class="font_16">
                                  This Plan is already on the PCS Platform. Please contact your regional sales team for more
                                  information.
                                </h3>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      v-if="item.InBookOfBusiness === 0"
                      :key="item.SEINPNO"
                      v-model="closeReportPopUp[item.SEINPNO]"
                      :scrollable="false"
                      :max-width="
                        display.xs.value
                          ? '100%'
                          : item.selectreport
                            ? item.selectreport.length === 1
                              ? '300'
                              : item.selectreport.length === 2
                                ? '400'
                                : item.selectreport.length === 3
                                  ? '500'
                                  : '50%'
                            : '50%'
                      "
                      content-class="elevation-3"
                    >
                      <v-card class="elevation-3 pa-5">
                        <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                          <v-col cols="12" class="pa-0">
                            <v-row>
                              <v-col cols="11" class="pa-0">
                                <h3>Actions</h3>
                              </v-col>
                              <v-col cols="1" class="text-right pa-0 align-self">
                                <v-btn variant="text" size="small" @click="closeReportPopUp[item.SEINPNO] = false">
                                  <v-icon color="accent" icon="mdi:mdi-window-close"></v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-col cols="12">
                            <v-row>
                              <v-hover v-for="(item, index) in item.selectreport" v-slot="{ hover }" :key="index">
                                <v-col
                                  v-show="item.show === true"
                                  :cols="item.selectreport && item.selectreport.length === 4 ? '3' : '12'"
                                  :key="index"
                                  :class="hover ? 'accent' : ''"
                                  class="cursor-pointer flexclass pb-4 pt-4 text-center report_btn_border"
                                  @click="
                                    !item.disabled && !item.loader
                                      ? checkReportOptions(optionsSeinpNO, optionsItem, item.value, $event)
                                      : null
                                  "
                                >
                                  <v-progress-circular
                                    v-if="item.loader"
                                    :size="26"
                                    :color="hover ? 'white' : 'accent'"
                                    indeterminate
                                  />
                                  <CustomIcon
                                    v-if="!item.loader"
                                    :hover="hover"
                                    :disabled="item.disabled"
                                    :type="item.text === 'Comparison' ? 'RPEA' : item.text"
                                  />
                                  <br />
                                  <h4 class="textBold text-accent font_size_13">
                                    {{ item.text }}
                                  </h4>
                                </v-col>
                              </v-hover>
                            </v-row>
                          </v-col>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </td>
                </tr>
              </template>
              <template #bottom></template>
              <template #expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-col v-if="item.customerType === 'Schools'">
                    <v-data-table
                      :headers="nestedSchoolTableHeader"
                      :items="item.schools ? item.schools : []"
                      item-key="id"
                      :hide-default-footer="true"
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
                            <v-col cols="12" class="text-capitalize mt-2">
                              {{ item.name ? item.name.toLowerCase() : '' }}
                            </v-col>
                            <v-col cols="12" class="mt-2 mb-2">
                              {{ item.address }}
                            </v-col>
                          </td>
                          <td v-if="display.mdAndUp.value" class="text-right">
                            {{ item.id }}
                          </td>
                          <td v-if="display.mdAndUp.value" class="text-right">
                            {{ item.employees }}
                          </td>
                          <td v-if="display.smAndDown.value">
                            <v-col cols="12" class="pt-2 ml-2 pb-5">
                              {{ item.employees }}
                            </v-col>
                            <v-col cols="12" class="mt-2">
                              <v-btn
                                color="hyperlink"
                                variant="text"
                                icon
                                class="text-none ma-0 pa-0"
                                @click.stop="
                                  !showSchool
                                    ? (showBusinessDialog = true)
                                    : [
                                        (closeSchoolPopUp[item.id] = true),
                                        (optionsSchool = item.districtId),
                                        (optionSchoolItem = item)
                                      ]
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
                                <v-card-title class="mt-2 mb-2 pt-2 pb-2">
                                  <v-col cols="12" class="text-left">
                                    <v-row>
                                      <v-col cols="11" class="text-left">
                                        <h3>Actions</h3>
                                      </v-col>
                                      <v-col cols="1" class="text-right pa-0 align-self">
                                        <v-btn variant="text" size="small" @click="closeSchoolPopUp[item.id] = false">
                                          <v-icon color="accent" icon="mdi:mdi-window-close"></v-icon>
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-card-title>
                                <v-card-text class="pt-4">
                                  <v-col cols="12">
                                    <v-row>
                                      <v-btn
                                        block
                                        class="ml-0"
                                        :disabled="item.payrollSlot !== 'Approved'"
                                        size="x-large"
                                        color="hyperlink"
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
                              <v-col cols="12" class="flex_none">
                                <v-btn
                                  color="hyperlink"
                                  variant="text"
                                  icon
                                  class="text-none"
                                  @click.stop="
                                    !showSchool
                                      ? (showBusinessDialog = true)
                                      : [
                                          (closeSchoolPopUp[item.id] = true),
                                          (optionsSchool = item.districtId),
                                          (optionSchoolItem = item)
                                        ]
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
                                <v-card-title class="mt-2 mb-2 pt-2 pb-2">
                                  <v-col cols="12" class="text-left">
                                    <v-row>
                                      <v-col cols="11" class="text-left">
                                        <h3>Actions</h3>
                                      </v-col>
                                      <v-col cols="1" class="text-right align-self">
                                        <v-icon class="cursor-pointer" color="accent" @click="closeSchoolPopUp[item.id] = false">
                                          close
                                        </v-icon>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-card-title>
                                <v-card-text class="pt-4">
                                  <v-col cols="12">
                                    <v-row>
                                      <v-btn
                                        block
                                        class="ml-0"
                                        :disabled="item.payrollSlot !== 'Approved'"
                                        size="x-large"
                                        color="hyperlink"
                                        @click="
                                          performSchoolAction(optionsSchool, optionSchoolItem, 'school', $event),
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
                  </v-col>
                </td>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col class="justify-start widgetLeftButtonPosition">
                <v-btn class="ml-0 text-capitalize" :disabled="searchLoading" color="accent" @click="redirectToLeads()">
                  Search All Leads
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-card>
    </v-col>
    <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="School" />
    <v-dialog v-model="showBusinessDialog" :scrollable="false" max-width="550" content-class="elevation-3">
      <BusinessActionPopUp :type="actionType" :plan-name="planName" @cancel-action="closeBusinessAction()" />
    </v-dialog>
  </v-col>
</template>
<script>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import FinderMap from '@/components/TAL/Finder/FinderMap'
import planfinderlist from '@/assets/planfinder.json'
import CustomIcon from '@/components/CustomIcon'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
import BusinessActionPopUp from '@/components/Home/Acquisition/BusinessActionPopUp'

export default {
  components: {
    FinderMap,
    OpenAccount,
    CustomIcon,
    BusinessActionPopUp
  },
  setup() {
    const instance = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    const display = useDisplay()
    const store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const planName = ref('')
    const theme = useTheme()
    const showBusinessDialog = ref(false)
    const closeReportPopUp = ref({})
    const closeSchoolPopUp = ref({})
    const closeSchoolDistrictPopUp = ref({})
    const expanded = ref([])
    const prospectTab = ref(8)
    const businessType = ref([
      {
        text: 'For Profit',
        value: 0,
        icon: 'icon-for-profit',
        color: 'forProfitIcon',
        show: true,
        disabled: false
      },
      {
        text: 'Schools',
        value: 1,
        icon: 'icon-graduation',
        color: 'schoolIcon',
        show: true,
        disabled: false
      }
      // {
      //   text: 'Municipalities',
      //   value: 2,
      //   icon: 'icon-government',
      //   color: 'municipalitiesIcon',
      //   show: true,
      //   disabled: false
      // },
      // {
      //   text: 'Churches',
      //   value: 3,
      //   icon: 'fas fa-church',
      //   color: 'nonProfitIcon',
      //   show: true,
      //   disabled: false
      // },
      // {
      //   text: 'Tax-Exempt',
      //   value: 7,
      //   icon: 'icon-tax-exempt',
      //   color: 'taxExemptIcon',
      //   show: true,
      //   disabled: false
      // }
      // {
      //   text: 'Individuals',
      //   value: 4,
      //   icon: 'icon-individual',
      //   color: 'participantIcon',
      //   show: true,
      //   disabled: false
      // },
    ])
    const sponsorList = ref([
      {
        text: 'View All',
        value: 8,
        icon: '',
        color: '',
        show: true,
        disabled: false
      },
      {
        text: 'For Profit',
        value: 0,
        icon: 'icon-for-profit',
        color: 'forProfitIcon',
        show: true,
        disabled: false
      },
      {
        text: 'Schools',
        value: 1,
        icon: 'icon-graduation',
        color: 'schoolIcon',
        show: true,
        disabled: false
      }
    ])
    const searchRadius = ref(5)
    let zipcode = ref('Current Location')
    let loading = ref(true)
    let planList = ref([])
    let schoolList = ref([])
    const individualList = ref([])
    const municipalList = ref([])
    const churchList = ref([])
    const taxExemptList = ref([])
    let searchText = ref('')
    let EIN = ref(null)
    let plan = ref('')
    let showMapView = ref(true)
    const headerList = ref([
      {
        title: 'Name',
        value: 'Name',
        width: !display.lgAndUp.value && !display.smAndDown.value ? '45%' : '40%',
        align: 'start',
        sortable: false
      },
      {
        title: 'Description',
        value: 'Description',
        width: !display.lgAndUp.value && !display.smAndDown.value ? '40%' : '45%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Actions',
        value: '',
        width: '15%',
        align: 'center',
        sortable: false
      }
    ])
    let searchList = ref([])
    const planReportList = ref(planfinderlist.planReports)
    let planReports = ref([])
    let searchLoading = ref(false)
    let filterDialog = ref(false)
    const mapFinder = ref(null)
    const nestedSchoolTableHeader = ref([
      {
        title: '',
        value: '',
        align: display.xs.value ? 'center pr-6' : 'center',
        width: !display.lg.value && display.md.value ? '1%' : '5%',
        sortable: false
      },
      {
        title: 'School Name',
        value: 'schoolName',
        align: 'start',
        width: !display.xlAndUp.value && !display.smAndDown.value ? '21%' : '25%',
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
        width: '45%',
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
    let actionType = ref('business')

    const showSchool = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Schools
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c, $authz.typeOfBusiness.Schools)
        )
      } else return true
    })

    const showEmployerSponsored = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    })

    const showIndividuals = computed(() => {
      // if ($authz.hasRole($authz.roles.FirmAdmin)) {
      //   return $authz.allowedByProgram(
      //     $authz.programPermissionSet
      //       .Type_of_Business_Advisors_Firms_allowed__c,
      //     $authz.typeOfBusiness.Individuals
      //   )
      // } else if (
      //   $authz.hasRole($authz.roles.Advisor) ||
      //   $authz.hasRole($authz.roles.Strategist) ||
      //   $authz.hasRole($authz.roles.Fiduciary338)
      // ) {
      //   return (
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     ) &&
      //     $authz.allowedByAccount(
      //       $authz.accountPermissionSet
      //         .Type_of_Business_Advisors_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     )
      //   )
      // } else return true
      return false
    })

    const showMunicipalities = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Municipalities
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Municipalities
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Municipalities
          )
        )
      } else return true
    })

    // Other computed properties...

    watch(
      () => theme.global.name.value,
      () => {
        mapFinder.value.GoogleMap()
        getGoogleMap()
      }
    )

    watch(
      () => searchText.value,
      (newValue) => {
        if (newValue === '' || newValue === undefined) {
          plan.value = ''
          EIN.value = ''
        }
      }
    )

    watch(
      businessType.value,
      (newValue) => {
        sponsorList.value = newValue.slice(0)
        sponsorList.value.unshift({
          text: 'View All',
          value: 8,
          icon: '',
          color: '',
          show: true,
          disabled: false
        })
      },
      {
        deep: true,
        immediate: true
      }
    )

    watch(
      planReportList.value,
      () => {
        // Example conditional logic based on permissions
        if (!$authz.hasPermission($authz.permissionSet.Express_Diagnostic__c, $authz.permission.Full)) {
          var showExpressDiagnostic = planReportList.value.findIndex((a) => a.value === 'Express Diagnostic')
          if (showExpressDiagnostic > -1) planReportList.value.splice(showExpressDiagnostic, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)) {
          var showDiagnostic = planReportList.value.findIndex((a) => a.value === 'Diagnostic')
          if (showDiagnostic > -1) planReportList.value.splice(showDiagnostic, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)) {
          var showComparison = planReportList.value.findIndex((a) => a.value === 'RPEA')
          if (showComparison > -1) planReportList.value.splice(showComparison, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)) {
          var showProposal = planReportList.value.findIndex((a) => a.value === 'Proposal')
          if (showProposal > -1) planReportList.value.splice(showProposal, 1)
        }
        planReports.value = planReportList.value
      },
      {
        deep: true,
        immediate: true
      }
    )

    // Other watchers...

    onMounted(() => {
      if (store?.state) {
        if (Object.keys(store?.state?.leadSearch).length > 0) {
          zipcode.value = store.state.leadSearch.zipcode ? store.state.leadSearch.zipcode : null
          showMapView.value = store.state.leadSearch.showMapView
          searchList.value =
            store.state.leadSearch.recentSearches && store.state.leadSearch.recentSearches.length > 0
              ? store.state.leadSearch.recentSearches
              : []
          if (store?.state?.leadSearch?.prospectTab >= 0) {
            prospectTab.value = store.state.leadSearch.prospectTab
          } else {
            var tabValue = sponsorList.value.filter((a) => a.show === true)
            if (tabValue && tabValue.length > 0) {
              var selectedTab = sponsorList.value.filter((a) => a.text === tabValue[0].text)
              if (selectedTab && selectedTab.length > 0) prospectTab.value = selectedTab[0].value
            }
          }
        }
      }
      if (zipcode && !searchText.value && zipcode.value !== 'Current Location') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
        }
      } else if ((!zipcode.value || zipcode.value === 'Current Location') && !searchText.value) {
        store.dispatch('getUser').then(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
          }
        })
      }
    })

    const closeBusinessAction = () => {
      showBusinessDialog.value = false
    }

    const changeView = () => {
      searchText.value = ''
      plan.value = ''
      EIN.value = ''
      showMapView.value = !showMapView.value
      getCustomerType()
      updateRecentSearchModel()
    }

    const getCustomerType = () => {
      if (searchText.value) {
        searchText.value = ''
        plan.value = ''
        EIN.value = ''
      }
      if (showMapView.value) {
        if (mapFinder.value) {
          resetMarker()
          getGoogleMap()
        }
      }
    }

    async function getLeadPinsDetails() {
      var promises = []

      promises.push(
        //
        $axios.get(`/api/v1/plan/searchleads?zipcode=${zipcode.value}&radius=${searchRadius.value}`).then((success) => {
          planList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
        })
      )

      promises.push(
        $axios.get(`/api/v1/school/searchleads?zipcode=${zipcode.value}&radius=${searchRadius.value}`).then((success) => {
          let schoolMapList = []
          if (success.data.d && success.data.d.length > 0) {
            schoolMapList = success.data.d
            schoolMapList.forEach((a) => {
              a.id = a.Id
              a.name = a.Name
              a.latitude = a.Latitude
              a.longitude = a.Longitude
              a.address = a.Address
              a.country = a.Country
              a.zipCode = a.ZipCode
            })
          }
          schoolList.value = schoolMapList
        })
      )

      if (promises.length > 0) await Promise.allSettled(promises)
      loading.value = false
      store.state.finderList = {
        zipcode: zipcode.value,
        searchRadius: searchRadius.value
      }
      getGoogleMap()
    }

    function resetMarker() {
      if (mapFinder.value) {
        mapFinder.value.resetProspectMarker()
        mapFinder.value.resetSchoolMarker()
        mapFinder.value.resetIndividualHouseholdMarker()
        mapFinder.value.resetMunicipalMarker()
        mapFinder.value.resetChurchMarker()
        mapFinder.value.resetTaxExemptMarker()
      }
    }

    function getGoogleMap() {
      if (mapFinder.value) mapFinder.value.setCenterPin(zipcode.value)
      resetMarker()
      getForProfitMapIcon()
      getSchoolMapIcon()
      if (showMunicipalities.value) {
        getMunicipalMapIcon()
        getChurchMapIcon()
        getTaxExemptMapIcon()
      }
    }

    function getForProfitMapIcon() {
      if (prospectTab.value === 8 || prospectTab.value === 0) {
        if (planList && planList.value.length > 0) {
          if (mapFinder.value) mapFinder.value.setProspectMarker(planList.value, 'Employer Sponsored')
        }
      }
    }

    function getSchoolMapIcon() {
      if (prospectTab.value === 8 || prospectTab.value === 1) {
        if (schoolList && schoolList.value.length > 0) {
          if (mapFinder.value) mapFinder.value.setSchoolDistrictMarker(schoolList.value, 'Schools')
        }
      }
    }

    function getMunicipalMapIcon() {
      if (showMunicipalities.value && (prospectTab.value === 8 || prospectTab.value === 2)) {
        if (municipalList.value && municipalList.value.length > 0) {
          if (mapFinder.value) mapFinder.value.setMunicipalMarker(municipalList.value, 'Municipalities')
        }
      }
    }

    function getChurchMapIcon() {
      if (showMunicipalities.value && (prospectTab.value === 8 || prospectTab.value === 3)) {
        if (churchList.value && churchList.value.length > 0) {
          if (mapFinder.value) mapFinder.value.setChurchMarker(churchList.value, 'Church')
        }
      }
    }

    function getTaxExemptMapIcon() {
      if (showMunicipalities.value && (prospectTab.value === 8 || prospectTab.value === 7)) {
        if (taxExemptList.value && taxExemptList.value.length > 0) {
          if (mapFinder.value) mapFinder.value.setTaxExemptMarker(taxExemptList.value, 'TaxExempt')
        }
      }
    }

    function mapFinderInfo() {
      var mapReference = mapFinder.value
      return mapReference
    }

    function updateFinderModel() {
      updateRecentSearchModel()
      store.state.finderList = {
        zipcode: zipcode.value,
        searchRadius: searchRadius.value ? searchRadius.value : 5,
        plan: searchText.value ? plan.value : '',
        EIN: searchText.value ? EIN.value : '',
        showMap: true,
        prospectValue: prospectTab.value === 8 ? 0 : prospectTab.value,
        showStarred: false
      }
      if (prospectTab.value === 0 && showEmployerSponsored.value) {
        store.state.finderList.prospectValue = 0
      } else if (prospectTab.value === 1 && showSchool.value) {
        store.state.finderList.prospectValue = 1
      } else {
        if (showEmployerSponsored.value) {
          store.state.finderList.prospectValue = 0
        } else if (showSchool.value) {
          store.state.finderList.prospectValue = 1
        }
      }
    }

    function redirectToLeads() {
      if (showEmployerSponsored.value || showSchool.value) {
        updateFinderModel()
        router
          .push({
            name: 'TALFinderResult'
          })
          .catch(() => {})
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }

    function planInfo(item) {
      if (showEmployerSponsored.value) {
        if (item.SEINPNO) {
          redirectPlanInfo(item.SEINPNO, item.DCPTYPE, item.InBookOfBusiness)
        }
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }
    function schoolDetailPage(schoolDistrictId, zipcode) {
      if (showSchool.value) {
        updateFinderModel()
        store.state.finderList.prospectValue = 1
        router.push({
          query: {
            schoolDistId: schoolDistrictId,
            zipcode: zipcode ? zipcode : zipcode,
            radius: 50,
            type: 'SchoolDistrict'
          },
          name: 'SchoolAccountDetails',
          params: {
            lastRoute: route.path
          }
        })
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }

    function schoolInfo(schoolDistrictId) {
      if (showSchool.value) {
        if (schoolDistrictId.id) {
          updateFinderModel()
          store.state.finderList.prospectValue = 1
          router
            .push({
              name: 'SchoolAccountDetails',
              query: {
                schoolDistId: schoolDistrictId.id,
                zipcode: schoolDistrictId.zipCode,
                radius: 50
              },
              params: {
                lastRoute: route.path
              }
            })
            .catch(() => {})
        }
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }

    function redirectPlanInfo(seinpno, planType, bookOfBusiness) {
      if (showEmployerSponsored.value) {
        if (parseInt(bookOfBusiness) === 0) {
          if (seinpno) {
            updateFinderModel()
            store.state.finderList.prospectValue = 0
            router.push({
              name: 'TALPlan',
              params: { id: seinpno, planType: planType }
            })
          }
        }
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }

    async function getAddress(zipcode) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode}` }, (results, status) => {
          if (status === 'OK') {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.exec(zipcode)) {
              resolve(true)
            } else {
              reject(false)
            }
          } else {
            // eslint-disable-next-line no-undef
            if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
              resolve(true)
            } else {
              reject(false)
            }
          }
        })
      })
    }

    async function checkCurrentLocation() {
      if (zipcode && zipcode.value !== 'Current Location') {
        var isValidZip = await getAddress(zipcode.value)
        if (!isValidZip) return
      }
      if (zipcode.value === 'Current Location') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              getZipcode(position)
            },
            // eslint-disable-next-line no-unused-vars
            (error) => {
              loading.value = false
            }
          )
        }
      } else {
        getLeadPinsDetails()
      }
    }

    function showCurrentError() {
      zipcode.value = store.state.user.zipCode
      if (mapFinder.value) mapFinder.value.GoogleMap()
      getLeadPinsDetails()
    }

    function getZipcode(position) {
      $axios
        .get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'jsonv2',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
        })
        .then((success) => {
          zipcode.value =
            success.data && success.data.address != null && success.data.address.postcode
              ? success.data.address.postcode
              : store.state.user.zipCode
          if (mapFinder.value) mapFinder.value.GoogleMap()
          getLeadPinsDetails()
        })
    }

    function searchZipcode(lat, lng) {
      loading.value = true
      $axios
        .get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'jsonv2',
            lat: lat,
            lon: lng
          }
        })
        .then((success) => {
          zipcode.value =
            success.data && success.data.address != null && success.data.address.postcode
              ? success.data.address.postcode
              : store.state.user.zipCode
          getLeadPinsDetails()
        })
    }

    function searchBlur(val) {
      if (val) {
        EIN.value = searchText.value
        plan.value = ''
      } else {
        EIN.value = ''
        plan.value = searchText.value
      }
    }

    async function getRecentSearch() {
      showMapView.value = false
      if (searchText.value) {
        searchLoading.value = true
        var searchPromise = []
        var sponsorResult = []
        var schoolResult = []
        if (prospectTab.value === 0 || prospectTab.value === 8) {
          var planSearchRequestCount = {
            zipCode: !zipcode.value ? null : zipcode.value,
            searchRadius: searchRadius.value ? searchRadius.value : 0,
            ein: !EIN.value ? null : EIN.value,
            plan: !plan.value ? null : plan.value,
            page: 1,
            size: 20,
            retrieveResultCountOnly: false
          }
          searchPromise.push(
            $axios.post(`/api/v1/tal/plan/search`, planSearchRequestCount).then((success) => {
              sponsorResult =
                success.data.d && success.data.d.results && success.data.d.results.length > 0 ? success.data.d.results : []
              if (sponsorResult.length > 0) {
                planReports.value.forEach((a) => {
                  a.loader = false
                })
                let reportValue = planReports.value.slice()
                if (reportValue && reportValue.length > 0) {
                  let expressDiagnosticPosition = reportValue.findIndex((a) => a.value === 'Express Diagnostic')
                  if (expressDiagnosticPosition > -1) reportValue.splice(expressDiagnosticPosition, 1)
                  let diagnosticPosition = reportValue.findIndex((a) => a.value === 'Diagnostic')
                  if (diagnosticPosition > -1) reportValue.splice(diagnosticPosition, 1)
                  let rpeaPosition = reportValue.findIndex((a) => a.value === 'RPEA')
                  if (rpeaPosition > -1) reportValue.splice(rpeaPosition, 1)
                }
                sponsorResult.map((element) => {
                  if (
                    element.DCPTYPE === $authz.planType.Defined_Contribution_Plan ||
                    element.DCPTYPE === $authz.planType.ERISA_403_b
                  ) {
                    element['selectreport'] = planReports && planReports.value.length > 0 ? planReports.value.slice(0) : []
                  } else {
                    element['selectreport'] = reportValue && reportValue.length > 0 ? reportValue.slice(0) : []
                  }
                })
                sponsorResult.map((element, index) => {
                  element['isMarker'] = true
                  element['markerIndex'] = index
                })
                sponsorResult.forEach((element) => {
                  element.customerType = 'Employer Sponsored'
                  element.Id = element.SEINPNO
                })
              }
            })
          )
        }
        if (prospectTab.value === 1 || prospectTab.value === 8) {
          searchPromise.push(
            $axios
              .get(`/api/v1/tal/schooldistricts?zipcode=${null}&searchCriteria=${searchText.value ? searchText.value : ''}`)
              .then((success) => {
                schoolResult =
                  success.data.d && success.data.d.schooldistrictData && success.data.d.schooldistrictData.length > 0
                    ? success.data.d.schooldistrictData
                    : []
                if (schoolResult && schoolResult.length > 0) {
                  schoolResult.forEach((element) => {
                    element.customerType = 'Schools'
                    element.Id = element.id
                  })
                  for (var i = 0; i < schoolResult.length; i++) {
                    if (schoolResult[i].schools && schoolResult[i].schools.length > 0) {
                      for (var j = 0; j < schoolResult[i].schools.length; j++) {
                        schoolResult[i].schools[j].payrollSlot = schoolResult[i].payrollSlot
                      }
                    }
                  }
                }
              })
              .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err)
              })
          )
        }
        await Promise.allSettled(searchPromise)
        let recentSearch = sponsorResult ? sponsorResult : []
        if (schoolResult && schoolResult.length > 0) Array.prototype.push.apply(recentSearch, schoolResult)
        if (searchList && searchList.value.length > 0) {
          let recentSearchList = searchList.value
          let newArray = recentSearch.concat(recentSearchList)
          var resArr = []
          newArray.filter(function (item) {
            var i = resArr.findIndex((x) => x.Id === item.Id)
            if (i <= -1) {
              resArr.push(item)
            }
            return null
          })
          searchList.value = resArr.slice(0, 10)
        } else searchList.value = recentSearch.slice(0, 10)
        searchLoading.value = false
      }
    }

    function performSchoolAction(id, val, type) {
      if (showSchool.value) {
        if (val) {
          var schoolDistrictValue = {}
          if (type === 'school') {
            var parentValue = searchList.value.filter((a) => a.Id === id)
            schoolDistrictValue = parentValue && parentValue.length > 0 ? parentValue[0] : {}
          } else {
            schoolDistrictValue = val
          }
          var schoolNameVal = type === 'school' ? val.name : ''
          if (OpenAccount) OpenAccount.value.openTeacherAccount(schoolDistrictValue, schoolNameVal)
          store.state.openAccountDetail = {}
          filterDialog.value = true
          updateRecentSearchModel()
        }
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }

    function getReport(planSingleObject, reportType) {
      if (reportType !== undefined && reportType !== '') {
        if (reportType !== 'Express Diagnostic') return
        //enable express diagnostics loader at index 0
        planSingleObject.selectreport[0].loader = true
        var reportRequest = {
          seinPNumber: planSingleObject.SEINPNO,
          preparedby: store.state.user.name,
          isExpress: true,
          planName: planSingleObject.PNAME
        }

        $axios('/api/v1/tal/report/diagnostic', {
          method: 'POST',
          data: reportRequest
        }).then((response) => {
          onPopUp(response)
          planSingleObject.selectreport[0].loader = false
        })
      }
    }

    function onPopUp(response) {
      ;`/api/v1/tal/report/diagnostic/download?reportName=${encodeURIComponent(response.data.reportName)}`,
        response.data.reportName
    }

    function checkReportOptions(seinpNO, plan, val, event) {
      if (showEmployerSponsored.value) {
        if (display.smAndDown.value) {
          if (event) {
            if (event.target.classList[2] === 'disabled') return
          }
        }
        if (val === 'Express Diagnostic') {
          getReport(plan, val)
        } else {
          updateFinderModel()
          store.state.finderList.prospectValue = 1
          router.push({
            name: 'TALPlan',
            params: { id: seinpNO, planType: plan.DCPTYPE },
            query: { reportOption: val }
          })
        }
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }

    function updateRecentSearchModel() {
      store.state.leadSearch.showMapView = showMapView.value
      store.state.leadSearch.prospectTab = prospectTab.value
      store.state.leadSearch.recentSearches = searchList.value && searchList.value.length > 0 ? searchList.value : []
      store.state.leadSearch.zipcode = zipcode.value
    }

    // Other methods...

    return {
      planName,
      onPopUp,
      showBusinessDialog,
      closeReportPopUp,
      closeSchoolPopUp,
      closeSchoolDistrictPopUp,
      expanded,
      prospectTab,
      businessType,
      sponsorList,
      searchRadius,
      zipcode,
      loading,
      planList,
      schoolList,
      individualList,
      municipalList,
      churchList,
      taxExemptList,
      searchText,
      actionType,
      EIN,
      plan,
      showMapView,
      headerList,
      searchList,
      planReportList,
      planReports,
      searchLoading,
      filterDialog,
      nestedSchoolTableHeader,
      showSchool,
      showEmployerSponsored,
      showIndividuals,
      showMunicipalities,
      closeBusinessAction,
      changeView,
      getCustomerType,
      getLeadPinsDetails,
      resetMarker,
      getGoogleMap,
      getForProfitMapIcon,
      getSchoolMapIcon,
      getMunicipalMapIcon,
      getChurchMapIcon,
      getTaxExemptMapIcon,
      mapFinderInfo,
      mapFinder,
      updateFinderModel,
      redirectToLeads,
      planInfo,
      schoolDetailPage,
      schoolInfo,
      redirectPlanInfo,
      getAddress,
      checkCurrentLocation,
      showCurrentError,
      getZipcode,
      searchZipcode,
      searchBlur,
      getRecentSearch,
      performSchoolAction,
      getReport,
      checkReportOptions,
      updateRecentSearchModel,
      store,
      theme,
      display
    }
  }
}
</script>

<style>
@media screen and (max-width: 599px) {
  #myLeadMap.searchLead {
    height: 55%;
    width: 88%;
  }
}
@media (min-width: 600px) {
  #myLeadMap.searchLead {
    height: 64%;
    width: 95%;
  }
}
</style>
