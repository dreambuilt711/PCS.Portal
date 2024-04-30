<template>
  <v-col class="pa-0">
    <v-col cols="12" md="12" sm="12" xs="12" lg="12" xl="12" class="pa-0">
      <v-card class="elevation-3 pa-5" height="100%" min-height="600px">
        <Loader :loading-text="`Loading favorite..`" :loading="favoriteLoading" />
        <v-col class="pb-4 pa-0">
          <v-row>
            <v-col cols="12" class="pa-0">
              <v-row align="center" justify="center">
                <h2 class="font_24">Favorite Leads</h2>
                <v-spacer />
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="favoriteList && favoriteList.length === 0 && !favoriteLoading" cols="12" xs="12" class="mt-15">
          <v-row class="fill-height justify-center">
            <v-card class="elevation-0 pa-5">
              <v-card-text class="justify-center text-center">
                <v-row justify="center" align="center" class="mt-8 mb-8">
                  <v-col cols="12" xs="12" class="pa-0">
                    <h2 class="mb-4">You have no favorites selected</h2>
                  </v-col>
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-icon size="32" class="cursor-pointer icon-bookmark" color="#119944" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
        <v-col v-else cols="12" xs="12">
          <v-col cols="12" xs="12">
            <v-data-table
              v-model:expanded="expanded"
              :headers="headerList"
              :items="favoriteList"
              item-key="Id"
              :single-expand="true"
              class="elevation-0"
              :disable-pagination="true"
              mobile-breakpoint="0"
              hide-default-footer
              style="backface-visibility: hidden"
              :fixed-header="true"
              :height="'440px'"
            >
              <template #item="{ item, isExpanded, expand }">
                <tr v-if="item.customerType === 'Schools'">
                  <td class="pa-0">
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row class="align-self">
                        <v-col
                          v-if="item.latitude && item.longitude"
                          cols="1"
                          xs="1"
                          lg="1"
                          md="1"
                          sm="1"
                          xl="1"
                          class="text-center"
                        >
                          <v-icon size="16" class="icon-graduation schoolIcon" />
                        </v-col>
                        <v-col cols="1" xs="1" lg="1" md="1" sm="1" xl="1" class="pa-0">
                          <v-icon :ripple="false" size="12" class="schoolIcon removeOpacity" @click="expand(!isExpanded)">
                            isExpanded ? 'fas fa-caret-up' : 'fas fa-caret-down'
                          </v-icon>
                        </v-col>
                        <v-col cols="9" xs="9" xl="9" lg="9" md="9" sm="9" class="pa-0">
                          <v-hover v-slot="{ hover }">
                            <h4 class="pt-1">
                              <a
                                :class="[
                                  !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                                  hover ? 'text-decoration-underline' : 'text-decoration-none'
                                ]"
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
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row>
                        <v-col class="flex_none mr-1 text-lowercase pa-0">
                          {{ `${item.numberofSchools} schools / ${item.employees} individuals /` }}
                        </v-col>
                        <v-col v-if="item.payrollSlot !== 'Approved'" class="pa-0">
                          <v-row>
                            <v-icon size="16" class="icon-warning pr-1" :color="!$vuetify?.theme.dark ? '#ffbb11' : ''" />
                            <span>{{ item.payrollSlot }}</span>
                          </v-row>
                        </v-col>
                        <v-col v-else class="pa-0">
                          {{ item.payrollSlot }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </td>
                  <td class="text-center pa-1">
                    <v-row class="justify-center">
                      <v-col cols="12" xs="12" class="flex_none pa-0">
                        <v-btn
                          :color="!$vuetify?.theme.dark ? 'hyperlink' : ''"
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
                          <v-col cols="12" xs="12" class="text-left pa-0">
                            <v-row>
                              <v-col cols="11" xs="11" class="text-left pa-0">
                                <h3>Actions</h3>
                              </v-col>
                              <v-col cols="1" xs="1" class="text-right align-self pa-0">
                                <v-icon
                                  class="cursor-pointer"
                                  :class="$vuetify?.theme.dark ? '' : 'text-accent'"
                                  @click="closeSchoolDistrictPopUp[item.id] = false"
                                >
                                  close
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
                                :color="!$vuetify?.theme.dark ? 'hyperlink text-white' : ''"
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
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row class="align-self">
                        <v-col cols="1" xs="1" xl="1" lg="1" md="1" sm="1" class="text-center">
                          <v-icon
                            v-if="item.PlANADDRESSLATITUDE && item.PLANADDRESSLONGITUDE"
                            size="16"
                            class="icon-for-profit forProfitIcon"
                          />
                        </v-col>
                        <v-col
                          cols="1"
                          xs="1"
                          xl="1"
                          lg="1"
                          md="1"
                          sm="1"
                          class="text-center pa-0"
                          :style="`width:${item.PlANADDRESSLATITUDE && item.PLANADDRESSLONGITUDE ? '6px' : '23px'}`"
                        />
                        <v-col cols="9" xs="9" sm="9" xl="9" class="pa-0">
                          <v-hover v-slot="{ hover }">
                            <h4 class="pt-1">
                              <a
                                v-if="item.InBookOfBusiness === 0"
                                :class="[
                                  !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                                  hover ? 'text-decoration-underline' : 'text-decoration-none'
                                ]"
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
                                  :class="[!$vuetify?.theme.dark ? 'text-black' : 'text-white']"
                                  class="text-capitalize cursor-auto text-decoration-none"
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
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row>
                        <v-col class="flex_none mr-1 text-lowercase pa-0">
                          {{ `${formatPrice(item.TOTASSETS, 2)} total assets / ${item.ACTPARTIC} active individuals` }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </td>
                  <td class="text-center pa-1">
                    <v-row class="justify-center">
                      <v-col cols="12" xs="12" class="flex_none pa-0">
                        <v-btn
                          v-if="item.selectreport && item.selectreport.length > 0"
                          icon
                          :color="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
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
                          <v-col cols="12" xs="12" class="text-left pa-0">
                            <v-row>
                              <v-col cols="12" xs="12" class="text-right pa-0">
                                <v-icon
                                  class="cursor-pointer"
                                  :class="$vuetify?.theme.dark ? '' : 'text-hyperlink'"
                                  @click="closeReportPopUp[item.SEINPNO] = false"
                                >
                                  close
                                </v-icon>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-col cols="12" xs="12" class="pa-0">
                            <v-row>
                              <v-col cols="12" xs="12" class="text-left pa-0">
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
                      <v-card>
                        <v-card-title class="mt-2 mb-2 pt-2 pb-2">
                          <v-col cols="12" xs="12" class="text-left pa-0">
                            <v-row>
                              <v-col cols="11" xs="11" class="text-left pa-0">
                                <h3>Actions</h3>
                              </v-col>
                              <v-col cols="1" xs="1" class="text-right pa-0">
                                <v-icon
                                  class="cursor-pointer"
                                  :class="$vuetify?.theme.dark ? '' : 'text-hyperlink'"
                                  @click="closeReportPopUp[item.SEINPNO] = false"
                                >
                                  close
                                </v-icon>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-title>
                        <v-card-text class="pt-4">
                          <v-col cols="12" xs="12" class="pa-0">
                            <v-row>
                              <v-hover v-for="(item, index) in item.selectreport" v-slot="{ hover }" :key="index">
                                <v-col
                                  v-show="item.show === true"
                                  :key="index"
                                  :class="[
                                    hover ? 'accent' : '',
                                    item.selectreport && item.selectreport.length === 4 ? 'xs3' : 'xs12'
                                  ]"
                                  class="pb-2 pt-2 cursor-pointer flexclass pb-4 pt-4 text-center report_btn_border"
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
                                  <h4
                                    class="textBold"
                                    :class="
                                      hover || $vuetify?.theme.dark ? 'text-white font_size_13 ' : 'text-accent font_size_13 '
                                    "
                                  >
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
                  <v-col v-if="item.customerType === 'Schools'" class="pa-0">
                    <v-data-table
                      :headers="nestedSchoolTableHeader"
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
                            <v-col cols="12" xs="12" class="pt-2 ml-2 pb-5 pa-0">
                              {{ item.employees }}
                            </v-col>
                            <v-col cols="12" xs="12" class="mt-2 pa-0">
                              <v-btn
                                :color="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
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
                                  <v-col cols="12" xs="12" class="text-left">
                                    <v-row>
                                      <v-col cols="11" xs="11" class="text-left">
                                        <h3>Actions</h3>
                                      </v-col>
                                      <v-col cols="1" xs="1" class="text-right align-self">
                                        <v-icon
                                          class="cursor-pointer"
                                          :class="$vuetify?.theme.dark ? '' : 'text-accent'"
                                          @click="closeSchoolPopUp[item.id] = false"
                                        >
                                          close
                                        </v-icon>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-card-title>
                                <v-card-text class="pt-4">
                                  <v-col cols="12" xs="12">
                                    <v-row>
                                      <v-btn
                                        block
                                        class="ml-0"
                                        :disabled="item.payrollSlot !== 'Approved'"
                                        size="x-large"
                                        :color="!$vuetify?.theme.dark ? 'hyperlink text-white' : ''"
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
                                  :color="!$vuetify?.theme.dark ? 'hyperlink' : ''"
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
                                  <v-col cols="12" xs="12" class="text-left">
                                    <v-row>
                                      <v-col cols="11" xs="11" class="text-left">
                                        <h3>Actions</h3>
                                      </v-col>
                                      <v-col cols="1" xs="1" class="text-right align-self">
                                        <v-icon
                                          class="cursor-pointer"
                                          :class="$vuetify?.theme.dark ? '' : 'text-accent'"
                                          @click="closeSchoolPopUp[item.id] = false"
                                        >
                                          close
                                        </v-icon>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-card-title>
                                <v-card-text class="pt-4">
                                  <v-col cols="12" xs="12">
                                    <v-row>
                                      <v-btn
                                        block
                                        class="ml-0"
                                        :disabled="item.payrollSlot !== 'Approved'"
                                        size="x-large"
                                        :color="!$vuetify?.theme.dark ? 'hyperlink text-white' : ''"
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
        </v-col>
        <v-col v-if="favoriteList && favoriteList.length > 0" cols="12" xs="12">
          <v-row>
            <v-col class="justify-start" :class="display.xs.value ? 'mt-5' : 'widgetLeftButtonPosition'">
              <v-btn class="ml-0 text-capitalize" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="redirectToLeads()">
                Show All Favorites
              </v-btn>
            </v-col>
          </v-row>
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
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import planfinderlist from '@/assets/planfinder.json'
import CustomIcon from '@/components/CustomIcon'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
import BusinessActionPopUp from '@/components/Home/Acquisition/BusinessActionPopUp'
import Loader from '@/components/NewLoader'
export default {
  components: {
    OpenAccount,
    CustomIcon,
    BusinessActionPopUp,
    Loader
  },
  setup() {
    const instance = getCurrentInstance()
    const display = useDisplay()
    const router = useRouter()
    const route = useRoute()
    const OpenAccount = ref(null)
    const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const toast = instance.appContext.config.globalProperties.$toast
    const $authz = instance.appContext.config.globalProperties.$authz
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const actionType = ref('business')
    const planName = ref('')
    const showBusinessDialog = ref(false)
    const headerList = ref([
      {
        title: 'Name',
        value: 'Name',
        key: 'name',
        width: display.md.value ? '45%' : '40%',
        align: 'start',
        sortable: true
      },
      {
        title: 'Description',
        value: 'Description',
        key: 'description',
        width: display.md.value ? '40%' : '45%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Actions',
        value: 'Actions',
        key: 'actions',
        width: '15%',
        align: 'center',
        sortable: false
      }
    ])
    const favoriteList = ref([])
    const planReportList = ref(planfinderlist.planReports)
    const favoriteLoading = ref(false)
    const filterDialog = ref(false)
    const nestedSchoolTableHeader = ref([
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
    const closeReportPopUp = ref({})
    const closeSchoolPopUp = ref({})
    const closeSchoolDistrictPopUp = ref({})
    const expanded = ref([])
    const planReports = ref([])
    const closeBusinessAction = () => {
      showBusinessDialog.value = false
    }
    const performSchoolAction = (id, val, type) => {
      if (val) {
        var schoolDistrictValue = {}
        if (type === 'school') {
          var parentValue = favoriteList.value.filter((a) => a.favoriteId === id)
          schoolDistrictValue = parentValue && parentValue.length > 0 ? parentValue[0] : {}
        } else {
          schoolDistrictValue = val
        }
        var schoolNameVal = type === 'school' ? val.name : ''
        if (OpenAccount.value) OpenAccount.value.openTeacherAccount(schoolDistrictValue, schoolNameVal)
        $store.state.openAccountDetail = {}
        filterDialog.value = true
      }
    }
    const onPopUpEvent = (url, data) => {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    const getReport = (planSingleObject, reportType) => {
      if (reportType !== undefined && reportType !== '') {
        if (reportType !== 'Express Diagnostic') return
        //enable express diagnostics loader at index 0
        planSingleObject.selectreport[0].loader = true
        var reportRequest = {
          seinPNumber: planSingleObject.SEINPNO,
          preparedby: $store.state.user.name,
          isExpress: true,
          planName: planSingleObject.PNAME
        }

        $axios('/api/v1/tal/report/diagnostic', {
          method: 'POST',
          data: reportRequest
        }).then((response) => {
          onPopUpEvent(
            `/api/v1/tal/report/diagnostic/download?reportName=${encodeURIComponent(response.data.reportName)}`,
            response.data.reportName
          )
          planSingleObject.selectreport[0].loader = false
        })
      }
    }
    const checkReportOptions = (seinpNO, plan, val, event) => {
      if (showEmployerSponsored.value) {
        if (display.smAndDown.value) {
          if (event) {
            if (event.target.classList[2] === 'disabled') return
          }
        }
        if (val === 'Express Diagnostic') {
          getReport(plan, val)
        } else {
          $store.state.finderList.prospectValue = 5
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
    const schoolInfo = (schoolDistrictId) => {
      if (showSchool.value) {
        $store.state.finderList.prospectValue = 5
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
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }
    const planInfo = (item) => {
      if (showEmployerSponsored.value) {
        if (item.SEINPNO) {
          $store.state.finderList.prospectValue = 5
          router.push({
            name: 'TALPlan',
            params: { id: item.SEINPNO, planType: item.DCPTYPE }
          })
        }
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }
    const redirectToLeads = () => {
      if (showEmployerSponsored.value || showSchool.value) {
        $store.state.finderList.prospectValue = 5
        $store.state.finderList.showMap = true
        router
          .push({
            name: 'TALFinderResult',
            query: {
              showStarred: true
            }
          })
          .catch(() => {})
      } else {
        actionType.value = 'business'
        showBusinessDialog.value = true
      }
    }
    ///Starred Code Start
    const getStarredValue = async () => {
      favoriteLoading.value = true
      favoriteList.value = []
      var starredPromise = []
      if (showEmployerSponsored.value) {
        var starredPlans = $store.state.starredPlansSearchRequest.planSearchRequest
          ? $store.state.starredPlansSearchRequest.planSearchRequest.einList
          : []
        starredPlans = starredPlans.filter((n) => n)
        var planResult = []
        var schoolValue = []
        var municipalValue = []
        var churchValue = []
        var taxExemptValue = []
        if (starredPlans && starredPlans.length > 0) {
          var searchRequest = $store.state.starredPlansSearchRequest.planSearchRequest
          searchRequest.retrieveResultCountOnly = false
          starredPromise.push(
            $axios.post(`/api/v1/tal/plan/search`, searchRequest).then((success) => {
              planResult =
                success.data.d && success.data.d.results && success.data.d.results.length > 0 ? success.data.d.results : []
              if (planResult && planResult.length > 0) {
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
                planResult.map((element) => {
                  if (
                    element.DCPTYPE === $authz.planType.Defined_Contribution_Plan ||
                    element.DCPTYPE === $authz.planType.ERISA_403_b
                  ) {
                    element['selectreport'] = planReports.value && planReports.value.length > 0 ? planReports.value.slice(0) : []
                  } else {
                    element['selectreport'] = reportValue && reportValue.length > 0 ? reportValue.slice(0) : []
                  }
                })
                planResult.map((element, index) => {
                  element['isMarker'] = true
                  element['markerIndex'] = index
                })
                planResult.forEach((element) => {
                  element.customerType = 'Employer Sponsored'
                  element.favoriteId = element.SEINPNO
                })
              }
            })
          )
        }
      }
      if (showSchool.value) {
        var starredSchoolPlans = $store.state.starredPlansSearchRequest.planSearchRequest
          ? $store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList
          : []
        starredSchoolPlans = starredSchoolPlans.filter((n) => n)
        if (starredSchoolPlans && starredSchoolPlans.length > 0) {
          starredPromise.push(
            $axios.post(`/api/v1/school/starredprospects`, starredSchoolPlans).then((success) => {
              schoolValue =
                success.data.d && success.data.d.schooldistrictData && success.data.d.schooldistrictData.length > 0
                  ? success.data.d.schooldistrictData
                  : []
              if (schoolValue && schoolValue.length > 0) {
                schoolValue.forEach((element) => {
                  element.customerType = 'Schools'
                  element.favoriteId = element.id
                })
                for (var i = 0; i < schoolValue.length; i++) {
                  if (schoolValue[i].schools && schoolValue[i].schools.length > 0) {
                    for (var j = 0; j < schoolValue[i].schools.length; j++) {
                      schoolValue[i].schools[j].payrollSlot = schoolValue[i].payrollSlot
                    }
                  }
                }
              }
            })
          )
        }
      }
      if (showMunicipalities.value) {
        var starredMunicipalPlans = $store.state.starredPlansSearchRequest.planSearchRequest
          ? $store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList
          : []
        starredMunicipalPlans = starredMunicipalPlans.filter((n) => n)
        if (starredMunicipalPlans && starredMunicipalPlans.length > 0) {
          starredPromise.push(
            $axios.post(`/api/v1/municipal/starredprospects`, starredMunicipalPlans).then((success) => {
              municipalValue = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d : []
              if (municipalValue.length > 0) {
                municipalValue.forEach((element) => {
                  element.customerType = 'Municipalities'
                  element.favoriteId = element.DepartmentId
                })
              }
            })
          )
        }
        var starredChurchPlans = $store.state.starredPlansSearchRequest.planSearchRequest
          ? $store.state.starredPlansSearchRequest.planSearchRequest.churchIdList
          : []
        starredChurchPlans = starredChurchPlans.filter((n) => n)
        if (starredChurchPlans && starredChurchPlans.length > 0) {
          starredPromise.push(
            $axios.post(`/api/v1/church/starredprospects`, starredChurchPlans).then((success) => {
              churchValue =
                success.data.d && success.data.d.churchData && success.data.d.churchData.length > 0
                  ? success.data.d.churchData
                  : []
              if (churchValue.length > 0) {
                churchValue.forEach((element) => {
                  element.customerType = 'Churches'
                  element.favoriteId = element.Id
                })
              }
            })
          )
        }
        var starredTaxExemptPlans = $store.state.starredPlansSearchRequest.planSearchRequest
          ? $store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList
          : []
        starredTaxExemptPlans = starredTaxExemptPlans.filter((n) => n)
        if (starredTaxExemptPlans && starredTaxExemptPlans.length > 0) {
          starredPromise.push(
            $axios.post(`/api/v1/taxexempt/starredprospects`, starredTaxExemptPlans).then((success) => {
              taxExemptValue = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d : []
              if (taxExemptValue.length > 0) {
                taxExemptValue.forEach((element) => {
                  element.customerType = 'TaxExempt'
                  element.favoriteId = element.EIN
                })
              }
            })
          )
        }
      }
      await Promise.allSettled(starredPromise)
      let favoriteLists = planResult ? planResult : []
      if (schoolValue && schoolValue.length > 0) Array.prototype.push.apply(favoriteLists, schoolValue)
      if (municipalValue && municipalValue.length > 0) Array.prototype.push.apply(favoriteLists, municipalValue)
      if (churchValue && churchValue.length > 0) Array.prototype.push.apply(favoriteLists, churchValue)
      if (taxExemptValue && taxExemptValue.length > 0) Array.prototype.push.apply(favoriteLists, taxExemptValue)
      if (favoriteLists && favoriteLists.length > 0) {
        let latestFavorite =
          $store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList &&
          $store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList.length > 0
            ? $store.state.starredPlansSearchRequest.planSearchRequest.favoriteIdList
            : []
        latestFavorite = latestFavorite.slice(-10)
        if (latestFavorite && latestFavorite.length > 0) {
          var resArr = []
          favoriteLists.filter(function (item) {
            var i = latestFavorite.findIndex((x) => x === item.favoriteId)
            if (i > -1) {
              resArr.push(item)
            }
            return null
          })
          var resArr1 = []
          favoriteLists.filter(function (item) {
            var i = latestFavorite.findIndex((x) => x !== item.favoriteId)
            if (i > -1) {
              resArr1.push(item)
            }
            return null
          })
          Array.prototype.push.apply(resArr, resArr1)
          resArr = resArr.slice(0)
          var resArr3 = []
          resArr.filter(function (item) {
            var i = resArr3.findIndex((x) => x.favoriteId === item.favoriteId)
            if (i <= -1) {
              resArr3.push(item)
            }
            return null
          })
          favoriteList.value = resArr3.slice(0, 10)
        } else {
          favoriteList.value = favoriteLists && favoriteLists.length > 0 ? favoriteLists.slice(-10) : []
        }
      } else {
        favoriteList.value = []
      }
      favoriteLoading.value = false
    }
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
    const formatPrice = (labelValue) => {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
        : // Six Zeroes for Millions
          Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
          : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : Math.abs(Number(labelValue))
    }
    const performAction = (item, val) => {
      if (val === 'EmailReminder') {
        if (item.individualAccounts && item.individualAccounts.length > 0) {
          if (item.individualAccounts[0].accountContact) {
            window.location.href = `mailto:${item.individualAccounts[0].accountContact}`
          } else {
            window.location.href = 'mailto:'
          }
        } else {
          window.location.href = 'mailto:'
        }
      }
    }
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
    watch(
      () => planReportList.value,
      () => {
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
      { immediate: true, deep: true }
    )
    onMounted(() => {
      favoriteLoading.value = true
      $store.dispatch('getStarredPlans').then(() => {
        getStarredValue()
      })
    })
    return {
      $vuetify,
      display,
      favoriteLoading,
      favoriteList,
      expanded,
      headerList,
      showSchool,
      showBusinessDialog,
      closeSchoolDistrictPopUp,
      showEmployerSponsored,
      closeReportPopUp,
      nestedSchoolTableHeader,
      performAction,
      closeSchoolPopUp,
      filterDialog,
      actionType,
      planName,
      OpenAccount,
      formatPrice,
      checkReportOptions,
      schoolInfo,
      performSchoolAction,
      planInfo,
      redirectToLeads,
      closeBusinessAction
    }
  }
}
</script>
