<template>
  <v-card :class="[display.xs.value ? 'elevation-0' : 'elevation-6 mb-3 mt-4', planLoader ? 'fixHeightForLoader' : '']">
    <Loader :loading-text="`Loading results..`" :loading="planLoader" />
    <v-data-table
      v-if="!planLoader && forProfitDataList ? forProfitDataList.length > 0 : ''"
      :headers="profitHeaderList"
      :items="forProfitDataList"
      item-key="PlanLeadId"
      :class="display.xs.value ? 'elevation-0' : 'elevation-6 mb-3'"
      :options="pagination"
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
      :mobile="false"
      :mobile-breakpoint="0"
    >
      <template #headers="{ headers }">
        <tr>
          <th
            v-for="header in headers[0]"
            :key="header.title"
            class="text-left"
            :class="[!display.mdAndUp.value ? 'pa-1' : '', header.class]"
          >
            <v-row>
              <v-col>
                <span>{{ header.title }}</span>
              </v-col>
            </v-row>
          </th>
        </tr>
      </template>
      <template #item="{ item }">
        <tr>
          <td class="text-left" :class="!display.mdAndUp.value ? 'pa-1' : ''">
            <v-col cols="12" class="pa-0">
              <v-row>
                <v-col cols="2" sm="2" lg="2" xl="2" md="4" class="text-center align-self">
                  <div>
                    <v-icon size="18" class="icon-for-profit forProfitIcon" :class="display.xs.value ? 'pr-1' : 'pr-3'" />
                  </div>
                </v-col>
                <v-col cols="10" sm="10" lg="10" md="8" xl="10">
                  <v-hover v-slot="{ hover }">
                    <a
                      class="cursor-pointer text-capitalize text-hyperlink"
                      :class="[hover ? 'text-decoration-underline' : 'text-decoration-none']"
                      @click="viewPlan(item.SEINPNO, item.Stage, item.ProposalId, item.PlanType, item.PlanLeadId)"
                    >
                      {{ item.PlanName ? item.PlanName.toLowerCase() : '' }}</a
                    >
                  </v-hover>
                </v-col>
              </v-row>
            </v-col>
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.PlanType }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : ' -- ' }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.TPA }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ formatPrice(item.TotalAssets, 2) }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.Participants }}
          </td>
          <td class="text-left" :class="display.xs.value ? 'pa-0' : 'pa-1'">
            <div
              :class="[
                item.ProposalStatus === 'Active' || item.ProposalStatus === 'Draft'
                  ? 'openStatus'
                  : item.ProposalStatus === 'Delayed'
                    ? 'delayedStatus'
                    : item.ProposalStatus === 'Expired'
                      ? 'expiredStatus'
                      : item.ProposalStatus === 'Won'
                        ? 'wonStatus'
                        : item.ProposalStatus === 'Presented'
                          ? 'presentedStatus'
                          : item.ProposalStatus === 'Negotiation'
                            ? 'negotiateStatus'
                            : item.ProposalStatus === 'Lost'
                              ? 'lostStatus'
                              : ''
              ]"
            >
              <span class="text-capitalize">{{ item.ProposalStatus }}</span>
            </div>
          </td>
          <td class="text-center" :class="display.xs.value ? 'pa-0' : ''">
            <v-icon
              v-if="item.PlanType ? item.PlanType.trim() !== $authz.planType.Simple_IRA_Plan_Proposal : true"
              size="18"
              color="#0077cc"
              class="icon-action"
              @click="openActionDialog(item)"
            />
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-col v-if="!planLoader && forProfitDataList ? forProfitDataList.length === 0 : ''">
      <ZeroState :from-page="fromPage" />
    </v-col>
    <ActionPopup
      v-model="actionDialog"
      :filter-object="filterObject"
      :current-report="currentReport"
      :edit-activity="editActivity"
      type="employee"
    />
  </v-card>
</template>
<script>
import { ref, getCurrentInstance, watch } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import ActionPopup from '@/components/TAL/Pipeline/ActionPopup'
import Loader from '@/components/NewLoader'
import ZeroState from '@/components/TAL/Pipeline/ZeroState'
export default {
  components: {
    ActionPopup,
    Loader,
    ZeroState
  },
  props: ['pipelinePlans', 'prospecting', 'evaluating', 'proposing', 'finalizing', 'completed', 'planLoader'],
  setup(props) {
    const display = useDisplay()
    const theme = useTheme()
    const router = useRouter()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const profitHeaderList = ref([
      {
        title: 'Plan Name',
        value: 'PlanName',
        align: 'start',
        width: display.xs.value ? '30%' : '30%',
        sortable: true,
        class: !display.mdAndUp.value ? 'pa-2' : ''
      },
      {
        title: 'Plan Type',
        value: 'PlanType',
        align: 'start',
        width: '18%',
        sortable: true,
        class: 'pa-1 hidden-sm-and-down'
      },
      {
        title: 'Activity Date',
        value: 'ActivityDate',
        align: 'start',
        width: '10%',
        sortable: true,
        class: 'pa-1 hidden-sm-and-down'
      },
      {
        title: 'TPA',
        value: 'TPA',
        align: 'start',
        width: '8%',
        sortable: true,
        class: 'pa-1 hidden-sm-and-down'
      },
      {
        title: 'Assets',
        value: 'TotalAssets',
        align: 'start',
        width: '10%',
        sortable: true,
        class: 'pa-1 hidden-sm-and-down'
      },
      {
        title: 'Individuals',
        value: 'Participants',
        align: 'start',
        width: '10%',
        sortable: true,
        class: 'pa-1 hidden-sm-and-down'
      },
      {
        title: 'Status',
        value: 'ProposalStatus',
        align: 'start',
        width: display.xs.value ? '1%' : '5%',
        sortable: false,
        class: display.xs.value ? 'pa-0' : 'pa-1'
      },
      {
        title: 'Actions',
        value: 'Actions',
        align: 'center',
        width: display.xs.value ? '1%' : '10%',
        sortable: false,
        class: display.xs.value ? 'pa-0' : ''
      }
    ])
    const loaderImage = ref(require('@/assets/images/bars.svg'))
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 20
    })
    const actionDialog = ref(false)
    const currentReport = ref(false)
    const editActivity = ref(false)
    const filterObject = ref([])
    const forProfitDataList = ref([])
    const stageName = ref('')
    const fromPage = ref('employerSponsoredPage')
    watch(
      () => props.pipelinePlans,
      () => {
        if (props.prospecting && !props.evaluating && !props.proposing && !props.finalizing && !props.completed) {
          forProfitDataList.value = store.state.pipelineList.prospectingList
          stageName.value = 'Prospecting'
        } else if (!props.prospecting && props.evaluating && !props.proposing && !props.finalizing && !props.completed) {
          forProfitDataList.value = store.state.pipelineList.evaluatingList
          stageName.value = 'Evaluating'
        } else if (!props.prospecting && !props.evaluating && props.proposing && !props.finalizing && !props.completed) {
          forProfitDataList.value = store.state.pipelineList.proposingList
          stageName.value = 'Proposing'
        } else if (!props.prospecting && !props.evaluating && !props.proposing && props.finalizing && !props.completed) {
          forProfitDataList.value = store.state.pipelineList.finalizingList
          stageName.value = 'Finalizing'
        } else if (!props.prospecting && !props.evaluating && !props.proposing && !props.finalizing && props.completed) {
          forProfitDataList.value = store.state.pipelineList.completedList
          stageName.value = 'Completed'
        } else {
          forProfitDataList.value = store.state.pipelineList.pipelinePlans
          stageName.value = 'All'
        }
      },
      { immediate: true }
    )
    const openActionDialog = (planData) => {
      actionDialog.value = true
      filterObject.value = planData
      let stageName = planData && planData.Stage ? planData.Stage : ''
      if (stageName) {
        if (stageName === 'Proposal') {
          if ($authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.Full)) {
            currentReport.value = true
          } else {
            currentReport.value = false
          }
        } else if (stageName === 'Comparison') {
          if ($authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.Full)) {
            currentReport.value = true
          } else {
            currentReport.value = false
          }
        } else if (stageName === 'Diagnostic') {
          if ($authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.Full)) {
            currentReport.value = true
          } else {
            currentReport.value = false
          }
        }
      }
      editActivity.value = true
    }
    const viewPlan = (seinpno, stage, proposalId, planType, planLeadId) => {
      if (proposalId >= 0) {
        var planSearchRequest = {
          retrieveResultCountOnly: false,
          ein: seinpno
        }
        $axios.post(`/api/v1/tal/plan/search`, planSearchRequest).then((success) => {
          if (success.data.d) {
            planType = success.data.d.results && success.data.d.results.length > 0 ? success.data.d.results[0].DCPTYPE : ''
          }
          redirectToPlan(stage, seinpno, planType, proposalId, planLeadId)
        })
      } else {
        redirectToPlan(stage, seinpno, planType, proposalId, planLeadId)
      }
    }
    const formatPrice = (value, digitValue) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digitValue,
        maximumFractionDigits: digitValue
      })
      return formatter.format(value)
    }
    const redirectToPlan = (stage, SEINPNO, planType, proposalId, planLeadId) => {
      switch (stage) {
        case 'Diagnostic':
          router.push({
            name: 'TALPlan',
            params: { id: SEINPNO, planType: planType },
            query: { reportOption: 'Diagnostic', stageName: stageName.value }
          })
          break
        case 'Comparison':
          router.push({
            name: 'TALPlan',
            params: { id: SEINPNO, planType: planType },
            query: { reportOption: 'RPEA', stageName: stageName.value }
          })
          break
        case 'Proposal':
          if (proposalId < 0) {
            planType = planType ? planType.trim() : ''
            if (planType === $authz.planType.Simple_IRA_Plan_Proposal) {
              router.push({
                path: `/TAL/SimpleIRAPlan/${SEINPNO}`,
                query: {
                  reportOption: 'Proposal',
                  planId: proposalId,
                  planLeadId: planLeadId,
                  stageName: stageName.value
                }
              })
            } else {
              router.push({
                name: 'TALPlan',
                params: { id: SEINPNO, planType: planType },
                query: {
                  reportOption: 'Proposal',
                  planId: proposalId,
                  planLeadId: planLeadId,
                  stageName: stageName.value
                }
              })
            }
          } else {
            router.push({
              name: 'TALPlan',
              params: { id: SEINPNO, planType: planType },
              query: {
                reportOption: 'Proposal',
                planId: proposalId,
                stageName: stageName.value
              }
            })
          }
          break
        default:
          break
      }
    }
    const formatStatus = (value) => {
      if (value === null) return
      if (value === 'Envelope Created') return 'Env. Created'
      else if (value === 'Agreement Opened') return 'Agrmt. Open'
      else if (value === 'Participant Demographics Completed') return 'P.D.Completed'
      else if (value === 'Beneficiary Updated') return 'Benif. Updated'
      else if (value === 'Agreement Received, in Quality Check') return 'Agrmt.Recv.'
      else if (value === 'Account Setup') return 'Acct.Setup'
      else if (value === 'Account Funded') return 'Acc.Funded'
      else if (value === 'Assets Transferred') return 'Asst.Transferred'
      else if (value === 'Account Live') return 'Acc.Live'
      return value
    }
    return {
      theme,
      $authz,
      display,
      forProfitDataList,
      profitHeaderList,
      pagination,
      viewPlan,
      openActionDialog,
      formatPrice,
      loaderImage,
      fromPage,
      actionDialog,
      filterObject,
      currentReport,
      editActivity,
      formatStatus
    }
  }
}
</script>
<style scoped>
.font_20 {
  font-size: 2.125rem !important;
}
.fixHeightForLoader {
  height: 500px !important;
}
</style>
