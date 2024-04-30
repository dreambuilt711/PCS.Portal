<template>
  <v-card :class="[display.xs.value ? 'elevation-0' : 'elevation-6 mb-3 mt-4', participantsLoader ? 'fixHeightForLoader' : '']">
    <Loader :loading-text="`Loading results..`" :loading="participantsLoader" />
    <v-data-table
      v-if="!participantsLoader && forParticipantDataList.length > 0"
      :headers="participantsHeaderList"
      :items="forParticipantDataList"
      item-key="OpportunityId"
      :class="display.xs.value ? 'elevation-0 mb-3' : 'elevation-6 mb-3'"
      :options="pagination"
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
      :mobile="false"
      :mobile-breakpoint="0"
    >
      <template #item="{ item }">
        <tr>
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
                    @click="editOpenAccount(item)"
                  >
                    {{ item.Account ? item.Account.toLowerCase() : '' }}</a
                  >
                </v-hover>
              </v-col>
            </v-row>
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.PlanType ? item.PlanType : '' }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : ' -- ' }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.TPA }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1 text-capitalize">
            {{ item.Employer ? item.Employer.toLowerCase() : '' }}
          </td>
          <td v-if="display.mdAndUp.value" class="text-left pa-1">
            {{ item.PayrollSlot }}
          </td>
          <td class="text-left pa-1">
            <div
              :class="[
                item.Status === 'Agreement'
                  ? 'openStatus'
                  : item.Status === 'Funding'
                    ? 'agrmtReceStatus'
                    : item.Status === 'Setup'
                      ? 'accSetupStatus'
                      : item.Status === 'Complete'
                        ? 'wonStatus'
                        : item.Status === null
                          ? ''
                          : 'openStatus'
              ]"
            >
              <span class="text-capitalize">{{ formatStatus(item.Status) }}</span>
            </div>
          </td>
          <td class="text-center pa-1">
            <v-icon size="18" color="#0077cc" class="icon-action" @click="openActionDiglog(item)" />
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-col v-if="!participantsLoader && forParticipantDataList.length === 0">
      <ZeroState :from-page="fromPage" />
    </v-col>
    <ActionPopup
      :key="componentRefresh"
      v-model="actionDialog"
      :filter-object="filterObject"
      :current-report="currentReport"
      :edit-activity="editActivity"
      type="school"
      @edit-open-account="editOpenAccount"
    />
  </v-card>
</template>
<script>
import { ref, computed, getCurrentInstance, watch } from 'vue'
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
  props: ['pipelineIndividualPlans', 'initiating', 'discovering', 'individualEvaluating', 'validating', 'participantsLoader'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const router = useRouter()
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const participantsHeaders = ref([
      {
        title: 'Account Holder',
        value: 'Account',
        align: 'start',
        width: '18%',
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
        width: '11%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'TPA',
        value: 'TPA',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Employer',
        value: 'SchoolDistrict',
        align: 'start',
        width: '15%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Payroll Slot',
        value: 'PayrollSlot',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Status',
        value: 'Status',
        align: 'start',
        width: '12%',
        sortable: false,
        show: true,
        class: 'pa-1'
      },
      {
        title: 'Actions',
        value: 'Actions',
        align: 'center',
        width: '7%',
        sortable: false,
        show: true,
        class: 'pa-1'
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
    const filterDialog = ref(false)
    const fromPage = ref('participantsPage')
    const filterObject = ref([])
    const forParticipantDataList = ref([])
    const stageName = ref('')
    const componentRefresh = ref(0)
    const participantsHeaderList = computed(() => {
      return participantsHeaders.value.filter((h) => h.show === true)
    })
    watch(
      () => props.pipelineIndividualPlans,
      () => {
        if (props.initiating && !props.discovering && !props.individualEvaluating && !props.validating) {
          forParticipantDataList.value = store.state.pipelineList.initiatingList
          stageName.value = 'Initiate'
        } else if (!props.initiating && props.discovering && !props.individualEvaluating && !props.validating) {
          forParticipantDataList.value = store.state.pipelineList.discoveringList
          stageName.value = 'Discover'
        } else if (!props.initiating && !props.discovering && props.individualEvaluating && !props.validating) {
          forParticipantDataList.value = store.state.pipelineList.individualEvaluatingList
          stageName.value = 'IndividualEvaluate'
        } else if (!props.initiating && !props.discovering && !props.individualEvaluating && props.validating) {
          forParticipantDataList.value = store.state.pipelineList.validatingList
          stageName.value = 'Validate'
        } else {
          forParticipantDataList.value = store.state.pipelineList.pipelineIndividualPlans
          stageName.value = 'All'
        }
        componentRefresh.value += 1
      },
      { immediate: true }
    )
    const editOpenAccount = (val) => {
      actionDialog.value = false
      emit('openAccount', val)
    }
    const openActionDiglog = (planData) => {
      actionDialog.value = true
      filterObject.value = planData
      currentReport.value = false
      editActivity.value = true
    }
    const formatStatus = (value) => {
      if (value === null) return
      if (value === 'Agreement') return 'Agreement'
      else if (value === 'Funding') return 'Funding'
      else if (value === 'Setup') return 'Setup'
      else if (value === 'Complete') return 'Complete'
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
      participantsHeaderList,
      forParticipantDataList,
      pagination,
      filterObject,
      editOpenAccount,
      formatStatus,
      openActionDiglog,
      editActivity,
      currentReport,
      actionDialog,
      fromPage,
      loaderImage,
      filterDialog,
      viewParticipant
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
