<template>
  <v-card :class="display.xs.value ? 'elevation-0' : 'elevation-6 mb-3 mt-4'">
    <v-data-table
      :headers="viewPlansHeaderList"
      :items="viewPlansDataList"
      item-key="name"
      :class="display.xs.value ? 'elevation-0' : 'elevation-6 mb-3'"
      :options="pagination"
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
      :mobile="false"
      :mobile-breakpoint="0"
    >
      <template #item="{ item }">
        <tr v-if="item.customerType === 'PlansType'">
          <td class="text-left" :class="!display.mdAndUp.value ? 'pa-1' : ''">
            <v-col cols="12" xs="12">
              <v-row>
                <v-col cols="2" xs="2" sm="2" lg="2" xl="2" md="4" class="text-center align-self">
                  <div>
                    <v-icon size="18" class="icon-for-profit forProfitIcon" :class="display.xs.value ? 'pr-1' : 'pr-3'" />
                  </div>
                </v-col>
                <v-col cols="10" xs="10" sm="10" lg="10" md="8" xl="10">
                  <v-hover v-slot="{ hover }">
                    <a
                      class="cursor-pointer text-capitalize"
                      :class="[
                        !theme.dark ? 'text-hyperlink' : 'text-white',
                        hover ? 'text-decoration-underline' : 'text-decoration-none'
                      ]"
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
          <td class="text-left pa-1">
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
          <td class="text-center pa-1">
            <v-icon size="18" color="#0077cc" class="icon-action" @click="openActionDiglog(item, 'ProfitDialog')" />
          </td>
        </tr>
        <tr v-if="item.customerType === 'IndividualsType'">
          <td class="text-left" :class="!display.mdAndUp.value ? 'pa-1' : ''">
            <v-row>
              <v-col cols="2" xs="2" sm="2" lg="2" xl="2" md="4" class="text-center align-self">
                <div>
                  <v-icon size="18" class="icon-individual participantIcon" :class="display.xs.value ? 'pr-1' : 'pr-3'" />
                </div>
              </v-col>
              <v-col cols="10" xs="10" sm="10" lg="10" md="8" xl="10">
                <v-hover v-slot="{ hover }">
                  <a
                    class="cursor-pointer text-capitalize"
                    :class="[
                      !theme.dark ? 'text-hyperlink' : 'text-white',
                      hover ? 'text-decoration-underline' : 'text-decoration-none'
                    ]"
                    @click="viewParticipant(item.SchoolDistrict, item.SchoolDistrictId)"
                  >
                    {{ item.Account ? item.Account.toLowerCase() : '' }}</a
                  >
                </v-hover>
              </v-col>
            </v-row>
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.TPA }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : ' -- ' }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.TPA }}
          </td>
          <td class="text-left pa-1">
            <div
              :class="[
                item.SubStatus === 'Agreement Created'
                  ? 'openStatus'
                  : item.SubStatus === 'Agreement Sent'
                    ? 'agrmtOpenStatus'
                    : item.SubStatus === 'Participant Demographics Completed'
                      ? 'pdCompleteStatus'
                      : item.SubStatus === 'RTQ Completed'
                        ? 'rtqCompleteStatus'
                        : item.SubStatus === 'Beneficiary Updated'
                          ? 'benfiUpdatedStatus'
                          : item.SubStatus === 'Agreement Received'
                            ? 'agrmtReceStatus'
                            : item.SubStatus === 'Account Setup Started'
                              ? 'accSetupStatus'
                              : item.SubStatus === 'Inactive'
                                ? 'inActiveStatus'
                                : item.SubStatus === 'Won'
                                  ? 'wonStatus'
                                  : item.SubStatus === null
                                    ? ''
                                    : 'openStatus'
              ]"
            >
              <span class="text-capitalize">{{ formatStatus(item.SubStatus) }}</span>
            </div>
          </td>
          <td class="text-center pa-1">
            <v-icon size="18" color="#0077cc" class="icon-action" @click="openActionDiglog(item, 'ParticipantDialog')" />
          </td>
        </tr>
      </template>
    </v-data-table>
    <ActionPopup
      v-model="actionDialog"
      :filter-object="filterObject"
      :current-report="currentReport"
      :edit-activity="editActivity"
      :type="
        filterObject
          ? filterObject.customerType === 'PlansType'
            ? 'employee'
            : filterObject.customerType === 'IndividualsType'
              ? 'school'
              : ''
          : ''
      "
      @edit-open-account="editOpenAccount"
    />
  </v-card>
</template>
<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import ActionPopup from '@/components/TAL/Pipeline/ActionPopup'
export default {
  components: {
    ActionPopup
  },
  props: ['viewPlansDataList'],
  setup({ emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const router = useRouter()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const stageName = ref('')
    const viewPlansHeaders = ref([
      {
        title: 'Customer',
        value: 'Account',
        align: 'start',
        width: '30%',
        sortable: true,
        show: true,
        class: !display.mdAndUp.value ? 'pa-2' : ''
      },
      {
        title: 'Plan Type',
        value: 'PlanType',
        align: 'start',
        width: '18%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Activity Date',
        value: 'ActivityDate',
        align: 'start',
        width: '18%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'TPA',
        value: 'TPA',
        align: 'start',
        width: '20%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Status',
        value: 'Status',
        align: 'start',
        width: '10%',
        sortable: false,
        show: true,
        class: 'pa-1'
      },
      {
        title: 'Actions',
        value: 'Actions',
        align: 'center',
        width: '20%',
        sortable: false,
        show: true,
        class: display.xs.value ? 'pa-1' : ''
      }
    ])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 20
    })
    const loaderImage = ref(require('@/assets/images/bars.svg'))
    const actionDialog = ref(false)
    const currentReport = ref(false)
    const editActivity = ref(false)
    const filterObject = ref({})
    const viewPlansHeaderList = computed(() => {
      return viewPlansHeaders.value.filter((h) => h.show === true)
    })
    const editOpenAccount = (val) => {
      actionDialog.value = false
      emit('openAccount', val)
    }
    const openActionDiglog = (planData, value) => {
      actionDialog.value = true
      filterObject.value = planData
      editActivity.value = true
      if (value === 'ProfitDialog') {
        currentReport.value = true
      } else if (value === 'ParticipantDialog') {
        currentReport.value = false
      }
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
    const redirectToPlan = (stage, SEINPNO, planType, proposalId, planLeadId) => {
      switch (stage) {
        case 'Diagnostic':
          router.push({
            name: 'TALPlan',
            params: { id: SEINPNO, planType: planType },
            query: { reportOption: 'Diagnostic' }
          })
          break
        case 'Comparison':
          router.push({
            name: 'TALPlan',
            params: { id: SEINPNO, planType: planType },
            query: { reportOption: 'RPEA' }
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
              query: { reportOption: 'Proposal', planId: proposalId }
            })
          }
          break
        default:
          break
      }
    }
    const formatStatus = (value) => {
      if (value === null) return
      if (value === 'Agreement Created') return 'Agreement Created'
      else if (value === 'Agreement Sent') return 'Agreement Sent'
      else if (value === 'Account Setup Started') return 'Account Setup'
      else if (value === 'Agreement Received') return 'Agreement Received'
      return value
    }
    const viewParticipant = (SchoolDistrictName, SchoolDistrictId) => {
      if (SchoolDistrictName && SchoolDistrictId) {
        router.push({
          path: `/TAL/School`,
          query: {
            schoolDistName: SchoolDistrictName,
            schoolDistId: SchoolDistrictId,
            reportOption: 'Activity'
          }
        })
      }
    }
    return {
      theme,
      display,
      viewPlansHeaderList,
      pagination,
      viewPlan,
      openActionDiglog,
      viewParticipant,
      formatStatus,
      editOpenAccount,
      loaderImage,
      stageName,
      actionDialog,
      filterObject,
      currentReport,
      editActivity
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
