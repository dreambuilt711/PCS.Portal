<template>
  <v-card :class="[display.xs.value ? 'elevation-0' : 'elevation-6 mb-3 mt-4', nonProfitsLoader ? 'fixHeightForLoader' : '']">
    <Loader :loading-text="`Loading results..`" :loading="nonProfitsLoader" />
    <v-data-table
      v-if="!nonProfitsLoader"
      :headers="nonProfitsHeaderList"
      :items="nonProfitsData"
      item-key="name"
      :class="display.xs.value ? 'elevation-0' : 'elevation-6 mb-3'"
      :options="pagination"
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
      :mobile="false"
      :mobile-breakpoint="0"
    >
      <template #item="{ item }">
        <tr>
          <td class="text-left" :class="!display.mdAndUp.value ? 'pa-1' : ''">
            <v-hover v-slot="{ hover }">
              <a
                class="cursor-pointer text-capitalize"
                :class="[
                  !theme.dark ? 'text-hyperlink' : 'text-white',
                  hover ? 'text-decoration-underline' : 'text-decoration-none'
                ]"
                @click="viewPlan(item.SEINPNO, item.Stage, item.ProposalId, item.PlanType, item.PlanLeadId)"
                ><v-icon size="18" color="#119944" class="icon-for-profit pr-3" />
                {{ item.PlanName ? item.PlanName.toLowerCase() : '' }}</a
              >
            </v-hover>
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
            {{ item.TotalAssets }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.Participants }}
          </td>
          <td class="text-left pa-1">
            <div
              v-if="item.Stage === 'Proposal'"
              :class="[
                item.ProposalStatus === 'Active'
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
            <v-icon size="18" color="#0077cc" class="icon-action" @click="openProfitDiglog('ProfitDialog')" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { getCurrentInstance, ref, computed } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import Loader from '@/components/NewLoader'
export default {
  components: {
    Loader
  },
  setup() {
    const instance = getCurrentInstance()
    const theme = useTheme()
    const router = useRouter()
    const display = useDisplay()
    const $axios = instance.appContext.config.globalProperties.$axios
    const stageName = ref('')
    const nonProfitsHeaders = ref([
      {
        title: 'Company Name',
        value: 'PlanName',
        align: 'start',
        width: '25%',
        sortable: true,
        show: true,
        class: !display.mdAndUp.value ? 'pa-2' : ''
      },
      {
        title: 'Plan Type',
        value: 'PlanType',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Activity Date',
        value: 'ActivityDate',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'TPA',
        value: 'TPA',
        align: 'start',
        width: '15%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Assets',
        value: 'TotalAssets',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Participants',
        value: 'Participants',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Status',
        value: 'ProposalStatus',
        align: 'start',
        width: '8%',
        sortable: false,
        show: true,
        class: 'pa-1'
      },
      {
        title: 'Actions',
        value: 'Actions',
        align: 'center',
        width: '10%',
        sortable: false,
        show: true,
        class: 'pa-1'
      }
    ])
    const loaderImage = ref(require('@/assets/images/bars.svg'))
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 10
    })
    const nonProfitsLoader = ref(false)
    const nonProfitsData = ref([])
    const nonProfitsHeaderList = computed(() => {
      return nonProfitsHeaders.value.filter((h) => h.show === true)
    })
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
    return {
      theme,
      display,
      nonProfitsLoader,
      nonProfitsHeaderList,
      loaderImage,
      nonProfitsData,
      pagination,
      viewPlan,
      redirectToPlan
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
