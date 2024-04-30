<template>
  <v-container :fluid="!showFeeForm">
    <v-col v-show="!showFeeForm" cols="12" xs="12" class="pa-0">
      <v-col cols="12" xs="12" class="pt-2 pb-3">
        <h1 class="font-weight-medium">Fee Schedules</h1>
      </v-col>
      <v-col cols="12" xs="12" class="pa-0">
        <v-row>
          <v-col cols="12" lg="3" xl="3" md="5" sm="6" xs="12" class="text-left">
            <v-text-field
              v-model="searchText"
              hide-details
              label="Search"
              append-inner-icon="mdi-magnify"
              :menu-props="{ attach: true }"
              variant="outlined"
              density="compact"
              @update:model-value="filterData()"
            />
          </v-col>
          <v-col
            v-if="showFeeSchedule"
            cols="12"
            lg="9"
            xl="9"
            md="7"
            sm="6"
            xs="12"
            class="text-right align-self-flexend pa-0"
            :class="display.xs.value ? 'pt-2' : ''"
          >
            <v-btn class="ma-0" :color="theme.dark ? '' : 'accent'" @click="createNewFee()"> New Fee Schedule </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" class="mt-4">
        <v-data-table
          :headers="feeHeader"
          :items="feeList"
          :loading="feeListLoading"
          loader-height="2"
          item-key="feeScheduleID"
          :hide-default-header="display.smAndDown.value"
          :options="options"
          class="elevation-2"
          :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
        >
          <template #header="props">
            <tr>
              <th
                v-for="header in props.headers"
                v-show="header.text"
                :key="header.text"
                :align="header.align"
                :width="header.width"
              >
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template #item="props">
            <tr v-if="!display.smAndDown.value">
              <td>
                <v-icon v-if="props.item.defaultFeeSchedule" color="pink-darken-3" size="small"> star </v-icon>
              </td>
              <td>
                <v-hover v-slot="{ hover }">
                  <h4 @click="editFee(props.item.feeScheduleID, props.item.scheduleType, props.item.assignedFeeSchedule)">
                    <a
                      class="handcursor"
                      :class="[theme.dark ? '' : 'text-hyperlink', hover ? 'text-decoration-underline' : '']"
                      >{{ props.item.name }}</a
                    >
                  </h4>
                </v-hover>
              </td>
              <td>{{ props.item.planType }}</td>
              <td>{{ props.item.scheduleType }}</td>
              <td>
                <span v-if="props.item.annualAsset">Asset Based ({{ props.item.type }})</span>
                <span v-if="props.item.annualAsset === 1 && props.item.baseFee == 1">,</span>
                <span v-if="props.item.baseFee">Base Fee</span>
                <span v-if="(props.item.annualAsset === 1 || props.item.baseFee == 1) && props.item.annualParticipant == 1"
                  >,</span
                >
                <span v-if="props.item.annualParticipant">Participant Based ({{ props.item.participanttype }})</span>
              </td>
              <td>{{ props.item.status }}</td>
              <td class="text-center pt-0 pb-0 pl-1 pr-1">
                <v-col
                  v-if="
                    props.item.scheduleType === 'Administration'
                      ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Administration__c, $authz.permission.Full)
                      : props.item.scheduleType === 'Custodian'
                        ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Custodian__c, $authz.permission.Full)
                        : props.item.scheduleType === 'Advisory'
                          ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Advisory__c, $authz.permission.Full)
                          : props.item.scheduleType === 'Investment Manager'
                            ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Investment_Manager__c, $authz.permission.Full)
                            : props.item.scheduleType === 'Recordkeeping'
                              ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Recordkeeping__c, $authz.permission.Full)
                              : props.item.scheduleType === 'ETF'
                                ? $authz.hasPermission($authz.permissionSet.Fee_Engine_ETF__c, $authz.permission.Full)
                                : true
                  "
                >
                  <v-row v-if="props.item.assignedFeeSchedule != 1" class="justify-center">
                    <v-col v-if="showFeeSchedule" cols="6" xs="6" class="pa-0">
                      <v-btn icon variant="text" :color="!theme.dark ? 'accent' : ''" @click="copyFee(props.item.feeScheduleID)">
                        <v-icon size="small"> mdi-content-copy </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="6" xs="6" class="pa-0">
                      <v-btn
                        icon
                        variant="text"
                        :color="!theme.dark ? 'error' : ''"
                        @click.stop="$set(deletePopUpFee, props.item.feeScheduleID, true)"
                      >
                        <v-icon size="small"> fas fa-trash </v-icon>
                      </v-btn>
                      <v-dialog
                        :key="props.item.feeScheduleID"
                        v-model="deletePopUpFee[props.item.feeScheduleID]"
                        :scrollable="false"
                        max-width="350"
                        content-class="elevation-3"
                      >
                        <ActionPopUp
                          confirm-action-text="Delete"
                          cancel-action-text="Cancel"
                          action-text="Delete Fee Schedules"
                          :action-message="`Are you sure you want to delete the fee <b>${props.item.name}</b> from Fee Schedule lineup?`"
                          @confirm-action="deleteFeeSchedule(props.item)"
                          @cancel-action="$set(deletePopUpFee, props.item.feeScheduleID, false)"
                        />
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-col>
              </td>
            </tr>
            <tr v-else>
              <v-col class="ml-2 mb-2">
                <v-row>
                  <v-col cols="12" xs="12" class="pa-0">
                    <h5 class="pt-1">
                      <span class="text-grey">Name</span>
                    </h5>
                    <h4 class="text-capitalize">
                      <a
                        class="handcursor text_decoration"
                        :class="theme.dark ? '' : 'text-hyperlink'"
                        @click="editFee(props.item.feeScheduleID, props.item.scheduleType, props.item.assignedFeeSchedule)"
                      >
                        <b>{{ props.item.name }}</b>
                      </a>
                    </h4>
                  </v-col>
                  <v-col cols="8" xs="8" class="pa-0">
                    <h5 class="pt-1">
                      <span class="text-grey">Plan Type</span>
                    </h5>
                    <h4>{{ props.item.planType }}</h4>
                  </v-col>
                  <v-col cols="4" xs="4" class="pa-0">
                    <h5 class="pt-1">
                      <span class="text-grey">Schedule Type</span>
                    </h5>
                    <h4>{{ props.item.scheduleType }}</h4>
                  </v-col>
                  <v-col cols="8" xs="8" class="pa-0">
                    <h5 class="pt-1">
                      <span class="text-grey">Schedule Structure</span>
                    </h5>
                    <h4>
                      <span v-if="props.item.annualAsset">Asset Based ({{ props.item.type }})</span>
                      <span v-if="props.item.annualAsset === 1 && props.item.baseFee == 1">,</span>
                      <span v-if="props.item.baseFee">Base Fee</span>
                      <span v-if="(props.item.annualAsset === 1 || props.item.baseFee == 1) && props.item.annualParticipant == 1"
                        >,</span
                      >
                      <span v-if="props.item.annualParticipant">Participant Based ({{ props.item.participanttype }})</span>
                    </h4>
                  </v-col>
                  <v-col cols="4" xs="4" class="pa-0">
                    <h5 class="pt-1">
                      <span class="text-grey">Status</span>
                    </h5>
                    <h4>{{ props.item.status }}</h4>
                  </v-col>
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-row>
                      <v-col v-if="props.item.defaultFeeSchedule" cols="1" xs="1" class="align-self text-center pt-1">
                        <v-icon color="pink-darken-3"> star </v-icon>
                      </v-col>
                      <v-col
                        v-if="
                          props.item.scheduleType === 'Administration'
                            ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Administration__c, $authz.permission.Full)
                            : props.item.scheduleType === 'Custodian'
                              ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Custodian__c, $authz.permission.Full)
                              : props.item.scheduleType === 'Advisory'
                                ? $authz.hasPermission($authz.permissionSet.Fee_Engine_Advisory__c, $authz.permission.Full)
                                : props.item.scheduleType === 'Investment Manager'
                                  ? $authz.hasPermission(
                                      $authz.permissionSet.Fee_Engine_Investment_Manager__c,
                                      $authz.permission.Full
                                    )
                                  : props.item.scheduleType === 'Recordkeeping'
                                    ? $authz.hasPermission(
                                        $authz.permissionSet.Fee_Engine_Recordkeeping__c,
                                        $authz.permission.Full
                                      )
                                    : props.item.scheduleType === 'ETF'
                                      ? $authz.hasPermission($authz.permissionSet.Fee_Engine_ETF__c, $authz.permission.Full)
                                      : true
                        "
                      >
                        <v-row v-if="props.item.assignedFeeSchedule != 1">
                          <v-tooltip location="top">
                            <template #activator="{ props }">
                              <div>
                                <v-btn
                                  v-bind="props"
                                  icon
                                  variant="text"
                                  :color="!theme.dark ? 'error' : ''"
                                  class="ma-0"
                                  @click.stop="$set(deletePopUpFee, props.item.feeScheduleID, true)"
                                >
                                  <v-icon size="small"> fas fa-trash </v-icon>
                                </v-btn>
                                <v-dialog
                                  :key="props.item.feeScheduleID"
                                  v-model="deletePopUpFee[props.item.feeScheduleID]"
                                  :scrollable="false"
                                  max-width="310"
                                  content-class="elevation-3"
                                >
                                  <ActionPopUp
                                    confirm-action-text="Delete"
                                    cancel-action-text="Cancel"
                                    action-text="Delete Fee Schedules"
                                    :action-message="`Are you sure you want to delete the fee <b>${props.item.name}</b> from Fee Schedule lineup?`"
                                    @confirm-action="deleteFeeSchedule(props.item)"
                                    @cancel-action="$set(deletePopUpFee, props.item.feeScheduleID, false)"
                                  />
                                </v-dialog>
                              </div>
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                          <v-tooltip location="top">
                            <template #activator="{ props }">
                              <v-btn
                                v-if="showFeeSchedule"
                                icon
                                variant="text"
                                :color="!theme.dark ? 'accent' : ''"
                                class="ma-0"
                                v-bind="props"
                                @click="copyFee(props.item.feeScheduleID)"
                              >
                                <v-icon size="small"> mdi-content-copy </v-icon>
                              </v-btn>
                            </template>
                            <span>Create Copy</span>
                          </v-tooltip>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-col>
    <v-col v-show="showFeeForm" cols="12" xs="12" class="pa-0">
      <v-col cols="12" xs="12" class="pa-0">
        <v-col :class="theme.dark ? 'text-white' : 'text-hyperlink'" class="handcursor pa-0" @click="createNewFee()">
          <v-icon size="small" :class="theme.dark ? 'text-white pb-1' : 'text-hyperlink pb-1'"> mdi-chevron-left </v-icon>
          <span :class="theme.dark ? 'text-white pl-2 text-uppercase font_14' : 'text-hyperlink pl-2 text-uppercase font_14'">
            Back
          </span>
        </v-col>
      </v-col>
      <FeeScheduleForm :open-new-fees="showFeeForm" from-page="feeEngine" @show-fees="createNewFee" @get-fee="getFeeSchedule" />
    </v-col>
    <v-col cols="12" xs="12" class="pa-0">
      <FeeScheduleBuilder ref="etfScheduleBuilder" from="editETF" @get-e-t-f-fee="getFeeSchedule" />
    </v-col>
  </v-container>
</template>
<script>
import { ref, computed, onMounted, inject, getCurrentInstance } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import FeeScheduleForm from '@/components/Account/FeeScheduleForm'
import FeeScheduleBuilder from '@/components/Account/FeeScheduleBuilder'
import ActionPopUp from '@/components/ActionPopUp'
export default {
  components: {
    FeeScheduleForm,
    ActionPopUp,
    FeeScheduleBuilder
  },
  setup() {
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const instance = getCurrentInstance()
    const display = useDisplay()
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const $refs = instance.appContext.config.globalProperties.$refs
    const feeHeader = ref([
      {
        title: '',
        value: 'feeScheduleID',
        sortable: false,
        align: 'center',
        width: '30px'
      },
      {
        title: 'Name',
        value: 'name',
        width: '20%',
        sortable: true,
        align: 'start'
      },
      {
        title: 'Plan Type',
        value: 'planType',
        width: '15%',
        align: 'start'
      },
      {
        title: 'Schedule Type',
        value: 'scheduleType',
        width: '20%',
        align: 'left'
      },
      {
        title: 'Schedule Structure',
        value: 'type',
        width: '20%',
        align: 'start'
      },
      {
        title: 'Status',
        value: 'status',
        width: '15%',
        align: 'start'
      },
      {
        title: 'Action',
        value: 'action',
        sortable: false,
        width: '20%',
        align: 'center'
      }
    ])
    const feeList = ref([])
    const searchText = ref('')
    const feeListLoading = ref(true)
    const filterCount = ref(0)
    const deletePopUpFee = ref({})
    const showFeeForm = ref(false)
    const showFeesScheduleByprogram = ref(false)
    const totalFeeList = ref([])
    const options = ref({
      itemsPerPage: 50,
      sortBy: ['name']
    })
    const filterData = () => {
      if (searchText.value) {
        feeList.value = totalFeeList.value.filter((items) => items.name.toLowerCase().includes(searchText.value.toLowerCase()))
      } else {
        feeList.value = totalFeeList.value
      }
    }
    const copyFee = (FeeScheduleID) => {
      $axios
        .post(`/api/v1/tal/fee/${FeeScheduleID}/copy`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          getFeeSchedule()
        })
    }
    const getFeeSchedule = () => {
      searchText.value = ''
      $axios
        .get(`/api/v1/tal/feeengineschedule`)
        .then((success) => {
          if (success.data.d !== null) {
            var arr = success.data.d.length > 0 ? success.data.d : []
            if (arr.length > 0) {
              feeList.value = arr.map(function (element) {
                return {
                  name: element.Name,
                  type: element.AssetStructure === 0 ? 'Tiered' : 'Linear',
                  status: element.Active ? 'Active' : 'Inactive',
                  feeScheduleID: element.FeeScheduleID,
                  baseFee: element.BaseFee,
                  annualAsset:
                    element.AnnualAssets === 0 ? (element.Asset1Max !== 0 ? 1 : element.AnnualAssets) : element.AnnualAssets,
                  planType: element.PlanType,
                  scheduleType: element.ScheduleType,
                  annualParticipant:
                    element.AnnualParticipant === 0
                      ? element.Part1Max !== 0
                        ? 1
                        : element.AnnualParticipant
                      : element.AnnualParticipant,
                  participanttype: element.PartStructure === 0 ? 'Tiered' : 'Linear',
                  defaultFeeSchedule: element.DefaultFeeSchedule === null ? false : element.DefaultFeeSchedule,
                  assignedFeeSchedule: Number(element.AssignedFeeSchedule)
                }
              })
            } else {
              feeList.value = []
            }
            totalFeeList.value = feeList.value
          }
        })
        .finally(() => {
          feeListLoading.value = false
        })
    }
    const editFee = (id, scheduleType, assignedFeeSchedule) => {
      var readOnly = false
      if (scheduleType === 'Administration') {
        readOnly =
          assignedFeeSchedule === 1
            ? true
            : !$authz.hasPermission($authz.permissionSet.Fee_Engine_Administration__c, $authz.permission.Full)
        eventBus.emit('editFee', id, readOnly)
        showFeeForm.value = true
      } else if (scheduleType === 'Advisory') {
        readOnly =
          assignedFeeSchedule === 1
            ? true
            : !$authz.hasPermission($authz.permissionSet.Fee_Engine_Advisory__c, $authz.permission.Full)
        eventBus.emit('editFee', id, readOnly)
        showFeeForm.value = true
      } else if (scheduleType === 'Custodian') {
        readOnly =
          assignedFeeSchedule === 1
            ? true
            : !$authz.hasPermission($authz.permissionSet.Fee_Engine_Custodian__c, $authz.permission.Full)
        eventBus.emit('editFee', id, readOnly)
        showFeeForm.value = true
      } else if (scheduleType === 'Investment Manager') {
        readOnly =
          assignedFeeSchedule === 1
            ? true
            : !$authz.hasPermission($authz.permissionSet.Fee_Engine_Investment_Manager__c, $authz.permission.Full)
        eventBus.emit('editFee', id, readOnly)
        showFeeForm.value = true
      } else if (scheduleType === 'Recordkeeping') {
        readOnly =
          assignedFeeSchedule === 1
            ? true
            : !$authz.hasPermission($authz.permissionSet.Fee_Engine_Recordkeeping__c, $authz.permission.Full)
        eventBus.emit('editFee', id, readOnly)
        showFeeForm.value = true
      } else if (scheduleType === 'ETF') {
        readOnly =
          assignedFeeSchedule === 1 ? true : !$authz.hasPermission($authz.permissionSet.Fee_Engine_ETF__c, $authz.permission.Full)
        $refs.etfScheduleBuilder.editScheduleFee(id, readOnly)
      } else {
        eventBus.emit('editFee', id, readOnly)
        showFeeForm.value = true
      }
    }
    const deleteFeeSchedule = (feeObject) => {
      if (feeObject) {
        var feeIndex = feeList.value.findIndex((a) => a.feeScheduleID === feeObject.feeScheduleID)
        if (feeIndex > -1) feeList.value.splice(feeIndex, 1)
        $axios.delete(`/api/v1/tal/feeengineschedule/${feeObject.feeScheduleID}`).then(() => {
          getFeeSchedule()
        })
      }
    }
    const createNewFee = () => {
      showFeeForm.value = !showFeeForm.value
      eventBus.emit('readOnly', false)
    }
    const showFeeSchedule = computed(() => {
      if ($authz.hasRole($authz.roles.SiteAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)) {
        return $authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.Full)
      } else if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_create_Fee_Schedule__c, $authz.permission.Full) &&
          $authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.Full)
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_create_Fee_Schedule__c, $authz.permission.Full) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Advisors_Firms_to_create_Fee_Schedules__c,
            $authz.permission.Full
          ) &&
          $authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.Full)
        )
      } else return false
    })
    onMounted(() => {
      getFeeSchedule()
    })
    return {
      theme,
      $authz,
      filterCount,
      display,
      showFeeForm,
      searchText,
      showFeeSchedule,
      feeHeader,
      feeList,
      feeListLoading,
      deletePopUpFee,
      showFeesScheduleByprogram,
      options,
      filterData,
      createNewFee,
      editFee,
      copyFee,
      deleteFeeSchedule,
      getFeeSchedule
    }
  }
}
</script>
