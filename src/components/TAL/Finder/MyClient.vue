<template>
  <v-col cols="12" xs="12" class="pa-0">
    <v-col v-if="clientList && clientList.length === 0 && !searchLoading" class="pa-0">
      <v-card :class="$vuetify?.breakpoint?.smAndDown ? 'elevation-0 pa-5' : 'elevation-6 pa-5'">
        <v-card-text class="justify-center text-center">
          <v-row justify="center" align="center" class="mt-8 mb-8">
            <v-col cols="12" xs="12" class="pa-0">
              <h2 class="mb-4">There are no client record</h2>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-else cols="12" xs="12" class="pa-0">
      <v-data-table-server
        v-model:expanded="expanded"
        :headers="headerList"
        :items="clientList"
        item-key="clientId"
        :single-expand="true"
        :class="[$vuetify?.breakpoint?.smAndDown ? 'elevation-0 mb-0' : 'elevation-6 mb-0', showMap ? 'showMap' : 'hideMap']"
        :options="pagination"
        mobile-breakpoint="0"
        :hide-default-footer="true"
        :items-length="totalClientPlans"
      >
        <template #item="{ item, isExpanded, expand }">
          <tr v-if="item.customerType === 'Schools'">
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row class="align-self">
                  <v-col
                    cols="1"
                    xs="1"
                    v-if="item.latitude && item.longitude"
                    class="text-center d-flex flex_none mr-2"
                    :class="showMap ? 'cursor-pointer' : ''"
                    @click="showMap ? mapHighlightForSchoolDistrict(item.id) : ''"
                  >
                    <v-icon size="16" class="icon-graduation schoolIcon" />
                  </v-col>
                  <v-col cols="1" xs="1" class="d-flex flex_none mr-2">
                    <v-icon :ripple="false" size="12" class="schoolIcon removeOpacity" @click="expand(!isExpanded)">
                      {{ isExpanded ? 'fas fa-caret-up' : 'fas fa-caret-down' }}
                    </v-icon>
                  </v-col>
                  <v-col cols="9" xs="9" sm="9" class="d-flex">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="schoolInfo(item.id)"
                          >{{ item.name ? item.name.toLowerCase() : '' }}</a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td v-if="$vuetify?.breakpoint?.mdAndUp">
              <v-col cols="12" xs="12" class="pa-0">
                <v-row>
                  <v-col class="flex_none mr-1 text-lowercase">
                    {{ `${item.numberofSchools} schools / ${item.employees} individuals /` }}
                  </v-col>
                  <v-col v-if="item.payrollSlot !== 'Approved'">
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
                <v-col cols="12" xs="6" class="flex_none">
                  <v-btn icon :color="!theme.dark ? 'hyperlink' : ''" variant="text" @click="schoolInfo(item.id)">
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="6" class="flex_none">
                  <PlanStar
                    style="line-height: 0.5"
                    :school-district-id="item.id"
                    from="TAL"
                    type="SchoolDistrict"
                    prospect-tab="5"
                  />
                </v-col>
              </v-row>
            </td>
          </tr>
          <tr v-if="item.customerType === 'Individuals'">
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row class="align-self">
                  <v-col
                    cols="1"
                    xs="1"
                    v-if="
                      item.individualAccounts.length > 0 &&
                      item.individualAccounts[0].latitude &&
                      item.individualAccounts[0].longitude
                    "
                    class="text-center d-flex flex_none mr-2"
                    :class="showMap ? 'cursor-pointer' : ''"
                    @click="showMap ? mapHighlightForHousehold(item.individualAccounts[0].accountId) : ''"
                  >
                    <v-icon size="16" class="icon-individual participantIcon" />
                  </v-col>
                  <v-col v-else cols="1" xs="1" class="text-center d-flex flex_none mr-2" style="width: 16px" />
                  <v-col cols="1" xs="1" class="d-flex flex_none mr-2">
                    <v-icon :ripple="false" size="12" class="participantIcon removeOpacity" @click="expand(!isExpanded)">
                      {{ isExpanded ? 'fas fa-caret-up' : 'fas fa-caret-down' }}
                    </v-icon>
                  </v-col>
                  <v-col cols="9" xs="9" sm="10" class="d-flex">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="householdInfo(item.householdId, item.householdName)"
                          >{{ item.householdName ? item.householdName.toLowerCase() : '' }}</a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td v-if="$vuetify?.breakpoint?.mdAndUp">
              <v-col cols="12" xs="12" class="pa-0">
                <v-row>
                  <v-col class="flex_none text-lowercase">
                    {{ `${formatPrice(item.totalValue, 2)} / ${item.accounts} accounts` }}
                  </v-col>
                  <v-col v-if="item.contact" class="flex_none mr-1 accent-text">
                    {{ `/ ${item.contact}` }}
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-center pa-1">
              <v-row class="justify-center">
                <v-col cols="12" xs="6" class="flex_none">
                  <v-btn
                    icon
                    :color="!theme.dark ? 'hyperlink' : ''"
                    variant="text"
                    @click.stop="
                      ;[
                        $set(closeIndividualReportPopUp, item.householdId, true),
                        (optionsHouseholdID = item.householdId),
                        (optionsHouseholdItem = item)
                      ]
                    "
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="6" class="flex_none">
                  <PlanStar
                    style="line-height: 0.5"
                    :household-id="item.householdId"
                    from="TAL"
                    type="Individual"
                    prospect-tab="5"
                  />
                </v-col>
              </v-row>
              <v-dialog
                :key="item.householdId"
                v-model="closeIndividualReportPopUp[item.householdId]"
                :scrollable="false"
                :max-width="400"
                content-class="elevation-3"
              >
                <v-card>
                  <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                    <v-col cols="12" xs="12" class="text-left">
                      <v-row>
                        <v-col cols="11" xs="11" class="text-left">
                          <h3>Actions</h3>
                        </v-col>
                        <v-col cols="1" xs="1" class="text-right">
                          <v-icon
                            class="cursor-pointer"
                            :class="theme.dark ? '' : 'text-accent'"
                            @click="$set(closeIndividualReportPopUp, item.householdId, false)"
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
                        <template v-for="(item, index) in item.actionList" :key="`${index}_${item.value}`">
                          <v-col cols="12" sm="6">
                            <v-btn
                              block
                              class="ml-0"
                              size="x-large"
                              :color="!theme.dark ? 'hyperlink text-white' : ''"
                              @click="performAction(closeIndividualReportPopUp, optionsHouseholdItem, item.value, $event)"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </template>
                      </v-row>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </td>
          </tr>
          <tr v-if="item.customerType === 'Employer Sponsored'">
            <td class="pl-2 pr-2">
              <v-col cols="12" xs="12" class="pa-0">
                <v-row class="align-self" no-gutters>
                  <v-col cols="2" xs="2" sm="2" lg="2" xl="2" md="4" class="text-center align-self height_48">
                    <div class="d-flex flex-column">
                      <v-icon size="21" class="icon-my-clients mr-1 width_10" :color="!theme.dark ? 'hyperlink' : ''" />
                    </div>
                    <div
                      :class="[showMap ? 'cursor-pointer' : '', 'd-flex flex-column mt-n1']"
                      @click="showMap ? clientMapHighlight(item.PLANID) : ''"
                    >
                      <v-icon
                        v-if="item.PlanSponsorLatitude && item.PlanSponsorLongitude"
                        size="16"
                        class="icon-for-profit forProfitIcon"
                      />
                    </div>
                  </v-col>
                  <v-col cols="10" xs="10" sm="10" md="8" lg="10" xl="10" class="align-self">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="planInfo(item.PLANNAME, item.PLANID, $event)"
                          >{{ item.PLANNAME ? item.PLANNAME.toLowerCase() : '' }}</a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td v-if="$vuetify?.breakpoint?.mdAndUp">
              <v-col cols="12" xs="12" class="pa-0">
                <v-row>
                  <v-col class="flex_none mr-1 text-lowercase">
                    `${formatPrice(item.TOTASSETS, 2)} total assets / ${item.ACTPARTIC} active individuals` }}
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-center pa-1">
              <v-row class="justify-center">
                <v-col cols="12" xs="6" class="flex_none">
                  <v-btn
                    icon
                    :color="!theme.dark ? 'hyperlink' : ''"
                    variant="text"
                    @click.stop="
                      ;[$set(closeReportPopUp, item.PLANID, true), (optionsSeinpNO = item.PLANID), (optionsItem = item)]
                    "
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="6" class="flex_none">
                  <PlanStar :seinpno="item.PLANID" from="RBC" type="Employee Sponsored" prospect-tab="6" />
                </v-col>
              </v-row>
              <v-dialog
                :key="item.PLANID"
                v-model="closeReportPopUp[item.PLANID]"
                :scrollable="false"
                :max-width="
                  $vuetify?.breakpoint?.xs
                    ? '100%'
                    : totalReport === 1
                      ? '300'
                      : totalReport === 2
                        ? '400'
                        : totalReport === 3
                          ? '500'
                          : '80%'
                "
                content-class="elevation-3"
              >
                <RBCReport
                  :plan-i-d="item.PLANID"
                  from-page="LivePlans"
                  :plan-name="item.PLANNAME"
                  @close-report="$set(closeReportPopUp, item.PLANID, false)"
                  @report-list="reportList"
                />
              </v-dialog>
            </td>
          </tr>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-col v-if="item.customerType === 'Schools'">
              <v-data-table
                :headers="nestedSchoolTableHeader"
                :items="item.schools ? item.schools : []"
                item-key="id"
                hide-default-footer
                :disable-pagination="true"
                class="nestedTable"
                mobile-breakpoint="0"
              >
                <template #item="props">
                  <tr>
                    <td></td>
                    <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-capitalize">
                      {{ props.item.name ? props.item.name.toLowerCase() : '' }}
                    </td>
                    <td v-if="$vuetify?.breakpoint?.smAndDown">
                      <v-col cols="12" xs="12" class="text-capitalize mt-2">
                        {{ props.item.name ? props.item.name.toLowerCase() : '' }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-2 mb-2">
                        {{ props.item.address }}
                      </v-col>
                    </td>
                    <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-right">
                      {{ props.item.id }}
                    </td>
                    <td v-if="$vuetify?.breakpoint?.mdAndUp">
                      {{ props.item.type }}
                    </td>
                    <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-right">
                      {{ props.item.employees }}
                    </td>
                    <td v-if="$vuetify?.breakpoint?.smAndDown">
                      <v-col cols="12" xs="12" class="height_100_per pt-2">
                        {{ props.item.employees }}
                      </v-col>
                    </td>
                    <td v-if="$vuetify?.breakpoint?.mdAndUp">
                      {{ props.item.address }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
            <v-col v-if="item.customerType === 'Individuals'">
              <v-data-table
                :headers="nestedIndividualTableHeader"
                :items="item.individualAccounts ? item.individualAccounts : []"
                item-key="accountId"
                hide-default-footer
                :disable-pagination="true"
                class="nestedTable"
                mobile-breakpoint="0"
              >
                <template #item="props">
                  <tr v-if="$vuetify?.breakpoint?.mdAndUp">
                    <td></td>
                    <td class="text-capitalize">
                      {{ props.item.accountName ? props.item.accountName.toLowerCase() : '' }}
                    </td>
                    <td>{{ props.item.accountType }}</td>
                    <td>{{ props.item.account }}</td>
                    <td class="text-right">
                      {{ formatPrice(props.item.totalValue, 2) }}
                    </td>
                    <td :class="!theme.dark ? 'text-hyperlink breakWord' : 'breakWord'">
                      {{ props.item.accountContact ? props.item.accountContact : '-' }}
                    </td>
                  </tr>
                  <tr v-else>
                    <td></td>
                    <td>
                      <v-col cols="12" xs="12" class="text-capitalize mb-1 mt-2">
                        {{ props.item.accountName ? props.item.accountName.toLowerCase() : '' }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-1">
                        {{ props.item.accountType }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-1">
                        {{ props.item.account }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-1">
                        {{ formatPrice(props.item.totalValue, 2) }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-2" :class="!theme.dark ? 'text-hyperlink' : ''">
                        {{ props.item.accountContact ? props.item.accountContact : '-' }}
                      </v-col>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </td>
        </template>
      </v-data-table-server>
      <Observer @intersect="intersected" />
    </v-col>
  </v-col>
</template>
<script>
import { ref, inject, computed, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import PlanStar from '@/components/TAL/PlanStar'
import RBCReport from '@/components/Retention/RBCReport'
import Observer from '@/components/Observer'
export default {
  components: {
    PlanStar,
    RBCReport,
    Observer
  },
  props: ['showMap', 'clientList', 'mapFinderInfo', 'searchLoading'],
  setup(props) {
    const eventBus = inject('eventBus')
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const theme = useTheme()
    const store = instance.appContext.config.globalProperties.$store
    const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const toast = instance.appContext.config.globalProperties.$toast
    const totalReport = ref(8)
    const headerList = ref([
      {
        title: 'Name',
        value: 'Name',
        width: $vuetify?.breakpoint?.mdOnly ? '45%' : '40%',
        align: 'start',
        sortable: false,
        class: 'sticky-header'
      },
      {
        title: 'Description',
        value: 'Description',
        width: $vuetify?.breakpoint?.mdOnly ? '40%' : '45%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        title: 'Actions',
        value: '',
        width: '15%',
        align: 'center',
        sortable: false,
        class: 'sticky-header'
      }
    ])
    const expanded = ref([])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 50
    })
    const nestedSchoolTableHeader = ref([
      {
        title: '',
        value: '',
        align: $vuetify?.breakpoint?.xs ? 'center pr-6' : 'center',
        width: $vuetify?.breakpoint?.smOnly ? '1%' : '5%',
        sortable: false
      },
      {
        title: 'School Name',
        value: 'schoolName',
        align: 'start',
        width: $vuetify?.breakpoint?.lgOnly || $vuetify?.breakpoint?.mdOnly ? '21%' : '25%',
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
        align: $vuetify?.breakpoint?.mdAndUp ? 'end' : 'start',
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
      }
    ])
    const nestedIndividualTableHeader = ref([
      {
        title: '',
        value: '',
        align: $vuetify?.breakpoint?.smAndDown ? 'center pr-7' : 'center',
        width: '5%',
        sortable: false
      },
      {
        title: 'Accounts',
        value: 'accountName',
        width: $vuetify?.breakpoint?.smAndDown ? '95%' : '15%',
        align: 'start',
        sortable: false
      },
      {
        title: 'Account Type',
        value: 'accountType',
        width: '15%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Account #',
        value: 'account',
        width: '15%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Total Value',
        value: 'totalValue',
        width: '15%',
        align: 'end',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Contact',
        value: 'accountContact',
        width: '35%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      }
    ])
    const item = ref([])
    const closeReportPopUp = ref({})
    const closeIndividualReportPopUp = ref({})
    const zipcode = ref(store.state.finderList.zipcode)
    const radius = ref(store.state.finderList.searchRadius)

    const totalClientPlans = computed(() => {
      return props.clientList && props.clientList.length > 0 ? props.clientList.length : -1
    })

    const intersected = async () => {
      eventBus.emit('callClientApi')
    }
    const updateFinderModel = () => {
      store.state.finderList = {
        zipcode: zipcode.value,
        searchRadius: radius.value ? radius.value : 5,
        showMap: true,
        showStarred: false
      }
    }
    const schoolInfo = (schoolDistrictId) => {
      if (props.showSchool) {
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
      }
    }
    const householdInfo = (householdId, householdName) => {
      store.state.finderList.prospectValue = 5
      router
        .push({
          name: 'TALHouseholdResult',
          query: {
            householdId: householdId,
            householdName: householdName
          },
          params: {
            lastRoute: route.path
          }
        })
        .catch(() => {})
    }
    const reportList = (val) => {
      totalReport.value = val.length
    }
    const performAction = (householdId, item, val) => {
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
    const mapHighlightForHousehold = (accountId) => {
      props.mapFinderInfo.highlightIndividualMarker(accountId)
    }
    const mapHighlightForSchoolDistrict = (schoolDistId) => {
      props.mapFinderInfo.highlightSchoolDistrictMarker(schoolDistId)
    }
    const clientMapHighlight = (planID) => {
      props.mapFinderInfo.highlightClientMarker(planID)
    }
    const planInfo = (planName, planId) => {
      if (planId) {
        let query = `?type=Employee`
        store.state.finderList.prospectValue = 6
        router.push(`/Retention/Plan/${planId}${query}`)
      } else {
        toast.info('Plan Information not found', '')
      }
    }
    return {
      headerList,
      expanded,
      pagination,
      nestedSchoolTableHeader,
      nestedIndividualTableHeader,
      item,
      closeReportPopUp,
      closeIndividualReportPopUp,
      zipcode,
      radius,
      totalClientPlans,
      intersected,
      reportList,
      performAction,
      mapHighlightForHousehold,
      mapHighlightForSchoolDistrict,
      clientMapHighlight,
      planInfo,
      store,
      $vuetify,
      theme,
      router,
      schoolInfo,
      householdInfo,
      formatPrice
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

.v-data-table :deep(.v-data-table__wrapper) {
  overflow: unset;
}
</style>
