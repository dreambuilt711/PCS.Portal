<template>
  <v-col cols="12" class="pa-0">
    <v-col v-if="favorites && favorites.length === 0 && !loading" class="pa-0">
      <v-card :class="smAndDown ? 'elevation-0 pa-5' : 'elevation-6 pa-5'">
        <v-card-text class="justify-center text-center">
          <v-row justify="center" align="center" class="mt-8 mb-8">
            <v-col cols="12" class="pa-0">
              <h2 class="mb-4">You have no favorites selected</h2>
            </v-col>
            <v-col cols="12" class="pa-0">
              <h3 class="mb-3 font_14">Go ahead and favorite plans you want to follow up with.</h3>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-icon size="32" class="cursor-pointer icon-bookmark" color="#119944" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-else cols="12" class="pa-0">
      <v-data-table
        :headers="headerList"
        :items="favorites"
        item-key="favoriteId"
        :single-expand="true"
        :class="[smAndDown ? 'elevation-0 mb-3' : 'elevation-6 mb-3', 'hideMap']"
        :options="pagination"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
        mobile-breakpoint="0"
      >
        <template #item="{ item, isExpanded, expand }">
          <tr v-if="item.PlanBusinessType === 'Individuals'">
            <td>
              <v-col cols="12" class="pa-0">
                <v-row class="align-self">
                  <v-col cols="1" class="text-center d-flex flex_none mr-2 pa-0">
                    <v-icon size="18" class="icon-individual participantIcon width_10 pr-2 pl-1" />
                    <v-icon
                      v-if="item.individualcount.length > 0 && item.individualcount[0].householdcount > 1"
                      :class="isExpanded ? 'rotate_icon_plus_180' : ''"
                      size="small"
                      class="font-size-14 participantIcon"
                      @click="expand(!isExpanded)"
                    >
                      fa-solid fa-caret-down
                    </v-icon>
                  </v-col>
                  <v-col class="d-flex pa-0" cols="9" sm="10">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          >{{ item.name ? item.name.toLowerCase() : '' }}
                          {{
                            item.individualcount[0].householdcount > 1 ? '(' + item.individualcount[0].householdcount + ')' : ''
                          }}</a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td v-if="mdAndUp">
              <v-col cols="12" class="pa-0">
                <v-row>
                  <v-col class="flex_none text-lowercase pa-0">
                    `${formatPrice(item.balance, 2)} account balance/ ${item.planStatus}` }}
                  </v-col>
                  <v-col v-if="item.plan" class="flex_none mr-1 text-accent pa-0">
                    {{ `/ ${item.plan}` }}
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-center">
              <v-row class="justify-center">
                <v-col cols="4" class="align-self pa-0">
                  <v-btn
                    icon
                    size="small"
                    :color="!$vuetify?.theme.dark ? 'accent' : ''"
                    variant="text"
                    :disabled="item.Source"
                    @click.stop="$set(closeReportPopUp, item.ssn, true)"
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                  <v-dialog
                    :key="item.ssn"
                    v-model="closeReportPopUp[item.ssn]"
                    :scrollable="false"
                    :max-width="totalReport === 1 ? '300' : '400'"
                    content-class="elevation-3"
                  >
                    <RBCReport
                      :plan-i-d="item.planID"
                      :ssn="item.ssn"
                      from-page="Participants"
                      :plan-name="item.name"
                      :target-object="item"
                      :email="item.internetAddr"
                      @close-report="$set(closeReportPopUp, item.ssn, false)"
                      @report-list="reportList"
                    />
                  </v-dialog>
                </v-col>
                <v-col cols="4" class="align-self pa-0">
                  <PlanStar :seinpno="item.householdID" from="RBC" :type="item.PlanBusinessType" prospect-tab="4" />
                </v-col>
                <v-col v-if="false" cols="4" class="align-self pa-0">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    :color="!$vuetify?.theme.dark ? 'accent' : ''"
                    @click="individualSSOToRelius(item.planID, item.ssn)"
                  >
                    <v-icon size="small"> fas fa-external-link-alt </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-dialog
                :key="item.ssn"
                v-model="closeReportPopUp[item.ssn]"
                :scrollable="false"
                :max-width="totalReport === 1 ? '300' : '400'"
                content-class="elevation-3"
              >
                <RBCReport
                  :plan-i-d="item.planID"
                  :ssn="item.ssn"
                  from-page="Participants"
                  :plan-name="item.name"
                  :target-object="item"
                  :email="item.internetAddr"
                  @close-report="$set(closeReportPopUp, item.ssn, false)"
                  @report-list="reportList"
                />
              </v-dialog>
            </td>
          </tr>
          <tr v-else>
            <td>
              <v-col cols="12" class="pa-0">
                <v-row class="align-self">
                  <v-col class="text-center d-flex flex_none mr-2 pa-0" cols="1">
                    <v-icon
                      size="16"
                      :class="
                        item.PlanBusinessType === 'Employer Sponsored'
                          ? 'icon-for-profit forProfitIcon'
                          : item.PlanBusinessType === 'School'
                            ? 'icon-graduation schoolIcon'
                            : item.PlanBusinessType === 'Municipality'
                              ? 'icon-government municipalitiesIcon'
                              : ''
                      "
                    />
                  </v-col>
                  <v-col class="d-flex pa-0" cols="9" sm="10">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="planInfo(item.NAME, item.PLANID, item.Source, item.PlanBusinessType)"
                          >{{ item.NAME ? item.NAME.toLowerCase() : '' }}</a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td v-if="mdAndUp">
              <v-col cols="12" class="pa-0">
                <v-row>
                  <v-col class="flex_none mr-1 text-lowercase pa-0">
                    {{ `${formatPrice(item.ASSETS, 2)} total assets / ${item.PlanType} / ${item.PlanStatus}` }}
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-center">
              <v-row class="justify-center">
                <v-col cols="4" class="align-self pa-0">
                  <v-btn
                    icon
                    color="hyperlink"
                    variant="text"
                    :disabled="item.Source"
                    @click.stop=";[$set(closeReportPopUp, item.PLANID, true)]"
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                  <v-dialog
                    :key="item.PLANID"
                    v-model="closeReportPopUp[item.PLANID]"
                    :scrollable="false"
                    :max-width="totalReport === 1 ? '300' : totalReport === 2 ? '400' : totalReport === 3 ? '500' : '50%'"
                    content-class="elevation-3"
                  >
                    <RBCReport
                      :plan-i-d="item.PLANID"
                      from-page="LivePlans"
                      :plan-name="item.NAME"
                      :target-object="item"
                      @close-report="$set(closeReportPopUp, item.PLANID, false)"
                      @report-list="reportList"
                    />
                  </v-dialog>
                </v-col>
                <v-col cols="4" class="align-self pa-0">
                  <PlanStar :seinpno="item.PLANID" from="RBC" :type="item.PlanBusinessType" prospect-tab="4" />
                </v-col>
                <v-col v-if="false" cols="4" class="align-self pa-0">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="accent"
                    @click="initiateManagePlanSSOLogin(item.PLANID, item.Source)"
                  >
                    <v-icon size="small"> fas fa-external-link-alt </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card flat class="expandable_background">
              <v-card-text>
                <div class="position-class c_background">
                  <v-col cols="12" class="ml-4 pa-0">
                    <v-col cols="12" class="pa-0">
                      <v-row>
                        <v-col cols="12" class="pa-0 mt-1">
                          <v-row>
                            <v-col cols="2" class="font-weight-medium pa-0 text-accent"> Accounts </v-col>
                            <v-col cols="3" class="font-weight-medium ml-4 pa-0 text-accent"> Account Type </v-col>
                            <v-col cols="2" class="font-weight-medium pa-0 text-accent"> Email </v-col>
                            <v-col cols="2" class="font-weight-medium text-right pa-0 text-accent"> Total Value </v-col>
                            <v-col cols="2" class="font-weight-medium text-right pa-0 text-accent"> Account # </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                          <v-row>
                            <v-col
                              v-for="(individual, index) in item.individualAccount"
                              :key="index"
                              cols="12"
                              class="pb-3 pt-0 pl-0 pr-0"
                            >
                              <v-row>
                                <v-col cols="2" class="text-accent pa-0">
                                  {{ individual.accountName }}
                                </v-col>
                                <v-col cols="3" class="ml-4 pa-0">
                                  {{ individual.accountType }}
                                </v-col>
                                <v-col cols="2" class="word_break pa-0">
                                  individual.accountContact ? individual.accountContact : '-' }}
                                </v-col>
                                <v-col cols="2" class="text-right pa-0">
                                  {{ formatPrice(individual.totalValue, 2) }}
                                </v-col>
                                <v-col cols="2" class="text-right pa-0">
                                  {{ individual.account }}
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </div>
              </v-card-text>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-col>
  </v-col>
</template>
<script>
import PlanStar from '@/components/TAL/PlanStar'
import RBCReport from '@/components/Retention/RBCReport'
import { ref, getCurrentInstance, inject, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter, useRoute } from 'vue-router'
export default {
  components: {
    PlanStar,
    RBCReport
  },
  props: ['favoriteList', 'searchLoading'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const toast = inject('toast')
    const router = useRouter()
    const route = useRoute()
    const headerList = ref([
      {
        text: 'Name',
        value: 'Name',
        width: '40%',
        align: 'start',
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Description',
        value: 'Description',
        width: '40%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        text: 'Actions',
        value: 'action',
        width: '200px',
        align: 'center',
        sortable: false,
        class: 'sticky-header'
      }
    ])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 50
    })
    const item = ref([])
    const closeReportPopUp = ref({})
    const totalReport = ref(8)
    const smAndDown = ref(false)
    const mdAndUp = ref(false)
    const favorites = ref(props.favoriteList)
    const loading = ref(props.searchLoading)
    //watch
    watchEffect(() => {
      smAndDown.value = display.smAndDown.value
      mdAndUp.value = display.mdAndUp.value
    })
    //methods
    function reportList(val) {
      totalReport.value = val.length
    }
    function individualSSOToRelius(planID, key) {
      if ($store.state.isImpersonating) {
        toast.warning('Plan Portal SSO is unavailable when impersonating another user.', { autoClose: 5000 })
        return
      }
      onPopUpEvent(`/api/v1/retention/pcs401k/individual/sso/initiate?planId=${planID}&key=${key}`, '_AccountLink')
    }
    function initiateManagePlanSSOLogin(planID, source) {
      if (!source) {
        if ($store.state.isImpersonating) {
          toast.warning('Plan Portal SSO is unavailable when impersonating another user.', { autoClose: 5000 })

          return
        }
        onPopUpEvent(`/api/v1/retention/pcs401k/sso/initiate?key=${planID}&target=plan`, '_AccountLink')
      } else onPopUpEvent(`/api/v1/retention/tsm/sso/initiate?planId=${planID}`, `_${source}`)
    }
    function getReport(planSingleObject, reportType) {
      if (reportType !== undefined && reportType !== '') {
        if (reportType !== 'Express Diagnostic') return

        loading.value = true
        let reportRequest = {
          seinPNumber: planSingleObject.SEINPNO,
          preparedby: $store.state.user.name,
          isExpress: true,
          planName: planSingleObject.PNAME
        }

        $axios('/api/v1/tal/report/diagnostic', {
          method: 'POST',
          data: reportRequest
        })
          .then((response) => {
            onPopUpEvent(
              `/api/v1/tal/report/diagnostic/download?reportName=${encodeURIComponent(response.data.reportName)}`,
              response.data.reportName
            )
            loading.value = false
            //dialog = false
          })
          .catch(() => {
            loading.value = false
            //dialog = false
          })
      }
    }
    function performAction(householdId, item, val) {
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
    function householdInfo(householdId, householdName) {
      $store.state.finderList.prospectValue = 5
      router.push({
        query: {
          householdId: householdId,
          householdName: householdName
        },
        name: 'TALHouseholdResult',
        params: {
          lastRoute: route.path
        }
      })
    }
    function schoolInfo(schoolDistrictId) {
      $store.state.clientPlan.prospectValue = 5
      let zipcode = $store.state.clientPlan.zipcode
      let radius = 10
      router.push({
        query: {
          schoolDistId: schoolDistrictId,
          zipcode: zipcode,
          radius: radius
        },
        name: 'SchoolAccountDetails',
        params: {
          lastRoute: route.path
        }
      })
    }
    function planInfo(planName, planID, source, type) {
      if (planID) {
        let query = ''
        $store.state.clientPlan.prospectValue = 4
        if (type === 'School') {
          if (source) {
            query = `?s=${encodeURIComponent(btoa(source))}&type=School`
          } else {
            query = `?type=School`
          }
        } else if (type === 'Municipality') {
          if (source) {
            query = `?s=${encodeURIComponent(btoa(source))}&type=Municipalitiesx`
          } else {
            query = `?type=Municipalities`
          }
        } else {
          if (source) {
            query = `?s=${encodeURIComponent(btoa(source))}&type=Employee`
          } else {
            query = `?type=Employee`
          }
        }
        router.push(`/Retention/Plan/${planID}${query}`)
      } else {
        toast.info('Plan Information not found', { autoClose: 5000 })
      }
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          //$FModal.show({ component: PdfViewer, maxHeight: '98%', width: '98%', clickToClose: false }, { pdfUrl: url })
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
    return {
      headerList,
      pagination,
      item,
      closeReportPopUp,
      totalReport,
      smAndDown,
      mdAndUp,
      favorites,
      loading,
      planInfo,
      schoolInfo,
      householdInfo,
      performAction,
      getReport,
      initiateManagePlanSSOLogin,
      individualSSOToRelius,
      reportList,
      onPopUpEvent
    }
  }
}
</script>
<style scoped>
.v-data-table.hideMap :deep(.sticky-header) {
  position: sticky;
  top: var(--toolbarHeight) !important;
  z-index: 2;
}

.v-data-table :deep(.v-data-table__wrapper) {
  overflow: unset;
}
</style>
