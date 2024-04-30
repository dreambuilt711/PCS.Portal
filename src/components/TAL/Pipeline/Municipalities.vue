<template>
  <v-card :class="[display.xs.value ? 'elevation-0' : 'elevation-6 mb-3 mt-4', municipalitiesLoader ? 'fixHeightForLoader' : '']">
    <Loader :loading-text="`Loading results..`" :loading="municipalitiesLoader" />
    <v-data-table
      v-if="!municipalitiesLoader"
      :headers="municipalitiesHeaderList"
      :items="municipalitiesData"
      item-key="name"
      :class="display.xs.value ? 'elevation-0' : 'elevation-6 mb-3'"
      :options="pagination"
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
      :mobile="false"
      :mobile-breakpoint="0"
    >
      <template #header="props">
        <th
          v-for="header in props.headers"
          :key="header.text ? header.text : header.value"
          :width="header.width"
          :align="header.align"
        >
          {{ header.text }}
        </th>
      </template>
      <template #item="{ item }">
        <tr v-if="!display.mdAndDown">
          <td class="text-left">
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
          <td class="text-left">
            {{ item.PlanType }}
          </td>
          <td class="text-left">
            {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : ' -- ' }}
          </td>
          <td class="text-left">
            {{ item.TPA }}
          </td>
          <td class="text-left">
            {{ item.TotalAssets }}
          </td>
          <td class="text-left">
            {{ item.Participants }}
          </td>
          <td class="text-left">
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
          <td class="text-center">
            <v-icon size="18" color="#0077cc" class="icon-action" @click="openProfitDiglog('ProfitDialog')" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { ref, getCurrentInstance, computed } from 'vue'
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
    const display = useDisplay()
    const router = useRouter()
    const $axios = instance.appContext.config.globalProperties.$axios
    const stageName = ref('')
    const municipalitiesHeaders = ref([
      {
        title: 'Company Name',
        value: 'PlanName',
        align: 'start',
        width: '25%',
        sortable: true,
        show: true
      },
      {
        title: 'Plan Type',
        value: 'PlanType',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value
      },
      {
        title: 'Activity Date',
        value: 'ActivityDate',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value
      },
      {
        title: 'TPA',
        value: 'TPA',
        align: 'start',
        width: '15%',
        sortable: true,
        show: display.mdAndUp.value
      },
      {
        title: 'Assets',
        value: 'TotalAssets',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value
      },
      {
        title: 'Participants',
        value: 'Participants',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value
      },
      {
        title: 'Status',
        value: 'ProposalStatus',
        align: 'start',
        width: '8%',
        sortable: false,
        show: true
      },
      {
        title: 'Actions',
        value: 'Actions',
        align: 'center',
        width: '10%',
        sortable: false,
        show: true
      }
    ])
    const loaderImage = ref(require('@/assets/images/bars.svg'))
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 10
    })
    const municipalitiesLoader = ref(false)
    const municipalitiesData = ref([])
    const municipalitiesHeaderList = computed(() => {
      return municipalitiesHeaders.value.filter((h) => h.show === true)
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
      display,
      theme,
      municipalitiesHeaders,
      municipalitiesLoader,
      loaderImage,
      municipalitiesData,
      municipalitiesHeaderList,
      pagination,
      viewPlan
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
