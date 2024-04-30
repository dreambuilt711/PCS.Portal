<template>
  <v-card>
    <v-card-title class="pt-3 pb-2 pl-4" fixed :class="theme.dark ? '' : 'accent'">
      <v-row>
        <v-col cols="11" xl="11" lg="11" md="11" sm="11" xs="11" class="align-self pa-0">
          <v-row>
            <CustomIcon type="StatusIcon" />
            <span class="font_14 text-secondary ml-2">Change Status</span>
          </v-row>
        </v-col>
        <v-col cols="1" xl="1" lg="1" md="1" sm="1" xs="1" class="text-right pa-0">
          <v-icon :color="theme.dark ? '' : 'secondary'" @click="resetStatus()"> mdi-close </v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pl-4 pr-4 pt-3 pb-2">
      <v-col cols="12" xs="12" :class="theme.dark ? '' : 'text-accent'" class="mb-3 pa-0">
        <v-row>
          <v-col class="flex_none align-self pa-0"> Current Status : </v-col>
          <v-col class="ml-3 pa-0">
            <div
              :class="[
                currentStatus === 'Active' || currentStatus === 'Draft'
                  ? 'openStatus'
                  : currentStatus === 'Delayed'
                    ? 'delayedStatus'
                    : currentStatus === 'Expired'
                      ? 'expiredStatus'
                      : currentStatus === 'Won'
                        ? 'wonStatus'
                        : currentStatus === 'Negotiation'
                          ? 'negotiateStatus'
                          : currentStatus === 'Presented'
                            ? 'presentedStatus'
                            : currentStatus === 'Lost'
                              ? 'lostStatus'
                              : ''
              ]"
            >
              <span class="text-capitalize">{{ currentStatus }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" :class="theme.dark ? '' : 'text-accent'" class="mb-2 pa-0"> New Status : </v-col>
      <v-col cols="12" xs="12" class="pa-0">
        <v-form
          :id="`statusForm ${planId < 0 ? planId : seinpno}`"
          ref="form1"
          v-model="formValid"
          lazy-validation
          @submit.prevent="SaveStatus()"
        >
          <v-col cols="12" xs="12" sm="10" md="10" lg="6" xl="6" class="pa-0">
            <v-select
              v-model="statusType"
              variant="outlined"
              label="Select Status"
              :items="statusList"
              item-title="text"
              :rules="[(v) => !!v || 'Status is required']"
              clearable
              density="compact"
              @update:model-value="changeStatus(statusType)"
            />
          </v-col>
          <v-col v-if="statusType === 'Lost'" cols="12" xs="12" class="pa-0">
            <v-select
              v-model="statusChangeReason"
              variant="outlined"
              label="Reason for Status Change"
              :items="statusReasonList"
              item-title="text"
              :error="reasonError"
              :error-messages="reasonErrorMsg"
              clearable
              density="compact"
              @update:model-value="reasonforStatusChange()"
            />
          </v-col>
          <v-col v-if="statusType === 'Delayed'" cols="12" xs="12" class="pa-0">
            <v-textarea
              v-model="delayedStatusReason"
              variant="outlined"
              density="compact"
              label="Add Reason"
              counter="250"
              maxlength="250"
              rows="2"
              :error-messages="reasonErrorMsg"
              :error="reasonError"
            />
          </v-col>
          <v-col v-if="statusChangeReason === 'Other'" cols="12" xs="12" class="pa-0">
            <v-textarea
              v-model="statusReason"
              variant="outlined"
              density="compact"
              label="Add Reason"
              counter="250"
              maxlength="250"
              rows="2"
            />
          </v-col>
          <v-col v-if="statusType === 'Lost'" cols="12" xs="12" class="pa-0">
            <v-text-field
              v-model="whatThePlanWasLostTo"
              variant="outlined"
              density="compact"
              label="What the plan was lost to?"
              counter="100"
              maxlength="100"
            />
          </v-col>
          <v-col v-if="statusType === 'Won' && statusChangeList.length > 1" cols="12" xs="12" class="pa-0">
            <p class="font_12">This plan has multiple proposals. Please select the winning proposal below.</p>
            <v-col class="activitydivheight flexborder" :class="display.xs.value ? 'overflow_x_hidden' : 'pa-2'">
              <v-row class="pa-1">
                <v-col v-if="!display.smAndDown.value" cols="12" xs="12" class="mt-1 pa-0">
                  <v-row>
                    <v-col cols="1" xs="1" class="pa-0" />
                    <v-col cols="1" xs="1" class="font-weight-medium pa-0"> ID </v-col>
                    <v-col cols="2" xs="2" class="font-weight-medium pa-0"> Activity Date </v-col>
                    <v-col cols="2" xs="2" class="font-weight-medium pa-0"> TPA </v-col>
                    <v-col cols="3" xs="3" class="font-weight-medium pa-0"> Fee Details </v-col>
                    <v-col cols="1" xs="1" class="font-weight-medium pa-0 text-right"> Cost ($) </v-col>
                    <v-col cols="2" xs="2" class="font-weight-medium pa-0 text-right">
                      <v-row>
                        <v-col cols="9" xs="9" class="pa-0"> Cost (%) </v-col>
                        <v-col cols="2" xs="2" class="pa-0" />
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-divider class="my-2 progressdivider" />
                </v-col>
                <v-col v-if="statusChangeList.length === 0" class="text-center bg-grey-lighten-2 pt-2 pb-2 pa-0">
                  No data available
                </v-col>
                <v-col v-if="statusChangeList.length > 0" class="pa-0">
                  <v-col v-for="(item, index) in statusChangeList" :key="item.ID" cols="12" xs="12" class="pa-0">
                    <v-row v-if="!display.smAndDown.value" class="pb-1 pt-1">
                      <v-col cols="1" xs="1" class="pa-0">
                        <v-radio-group
                          v-model="item.winProposal"
                          :mandatory="false"
                          hide-details
                          class="mr-0 mt-0 mb-0 ml-2 pa-0"
                          @update:model-value="selectedProposal(item)"
                        >
                          <v-radio color="accent" :value="item.ID" :ripple="false" class="ma-0" />
                        </v-radio-group>
                      </v-col>
                      <v-col :class="[theme.dark ? '' : 'text-accent']" cols="1" xs="1" class="pa-0">
                        {{ item.ID }}
                      </v-col>
                      <v-col cols="2" xs="2" class="pa-0">
                        {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                      </v-col>
                      <v-col cols="2" xs="2" class="text-capitalize pa-0">
                        {{ item.TPA }}
                      </v-col>
                      <v-col v-if="!item.expandFeeDetail" cols="3" xs="3" class="pa-0"> Estimated Cost </v-col>
                      <v-col v-if="!item.expandFeeDetail" class="text-right pa-0" cols="1" xs="1">
                        {{ formatPrice(item.EstimatedCost, 2) }}
                      </v-col>
                      <v-col v-if="!item.expandFeeDetail" class="text-right pa-0" cols="2" xs="2">
                        <v-row>
                          <v-col cols="9" xs="9" class="pa-0"> {{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}% </v-col>
                          <v-col cols="2" xs="2" class="text-right pa-0">
                            <span class="cursor-pointer" @click="showFeeDetails(item)">
                              <v-icon
                                size="small"
                                :color="theme.dark ? '' : 'black'"
                                :class="item.expandFeeDetail ? 'rotateactivityicon iconSize' : 'iconSize'"
                                >fas fa-chevron-right</v-icon
                              >
                            </span>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="item.expandFeeDetail" cols="3" xs="3" class="pa-0">
                        <span>Investment Manager</span>
                        <br />
                        <span>Administration</span>
                        <br />
                        <span>Recordkeeping</span>
                        <br />
                        <span>Trustee / Custodian</span>
                        <br />
                        <span>Average Investment Expense</span>
                        <br />
                        <span>Mutual Fund Offset</span>
                        <br />
                        <span class="font-weight-medium">Estimated Cost</span>
                      </v-col>
                      <v-col v-if="item.expandFeeDetail" class="text-right pa-0" cols="1" xs="1">
                        <span>{{ formatPrice(item.InvestmentManagerCost, 2) }}</span>
                        <br />
                        <span>{{ formatPrice(item.AdministrationCost, 2) }}</span>
                        <br />
                        <span>{{ formatPrice(item.RecordKeepingCost, 2) }}</span>
                        <br />
                        <span>{{ formatPrice(item.TrusteeCustodianCost, 2) }}</span>
                        <br />
                        <span>{{ formatPrice(item.AVGInvestmentExpenseCost, 2) }}</span>
                        <br />
                        <span>{{ formatPrice(item.MutualFundOffsetCost, 2) }}</span>
                        <br />
                        <span class="font-weight-medium">{{ formatPrice(item.EstimatedCost, 2) }}</span>
                      </v-col>
                      <v-col v-if="item.expandFeeDetail" class="text-right pa-0" cols="2" xs="2">
                        <v-row>
                          <v-col cols="9" xs="9" class="pa-0">
                            <span>{{ parseFloat(item.InvestmentManagerCostPercentage).toFixed(2) }}%</span>
                            <br />
                            <span>{{ parseFloat(item.AdministrationCostPercentage).toFixed(2) }}%</span>
                            <br />
                            <span>{{ parseFloat(item.RecordKeepingCostPercentage).toFixed(2) }}%</span>
                            <br />
                            <span>{{ parseFloat(item.TrusteeCustodianCostPercentage).toFixed(2) }}%</span>
                            <br />
                            <span>{{ parseFloat(item.AVGInvestmentExpenseCostPercentage).toFixed(2) }}%</span>
                            <br />
                            <span>{{ parseFloat(item.MutualFundOffsetCostPercentage).toFixed(2) }}%</span>
                            <br />
                            <span class="font-weight-medium">{{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}%</span>
                          </v-col>
                          <v-col cols="2" xs="2" class="text-right pa-0">
                            <span class="cursor-pointer" @click="showFeeDetails(item)">
                              <v-icon
                                size="small"
                                :color="theme.dark ? '' : 'black'"
                                :class="item.expandFeeDetail ? 'rotateactivityicon iconSize' : 'iconSize'"
                              >
                                mdi-chevron-right
                              </v-icon>
                            </span>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider
                      v-if="!display.smAndDown.value && index !== statusChangeList.length - 1"
                      class="my-2 progressdivider"
                    />
                    <v-row v-if="display.sm.value">
                      <v-col cols="12" xs="12" class="pr-2 pb-2 pl-1">
                        <v-row>
                          <v-col cols="10" xs="10" class="pa-0">
                            <v-row>
                              <v-col cols="1" sm="1">
                                <v-radio-group
                                  v-model="item.winProposal"
                                  :mandatory="false"
                                  hide-details
                                  class="mr-0 mt-3 mb-0 ml-0 pa-0"
                                  @update:model-value="selectedProposal(item)"
                                >
                                  <v-radio color="accent" :value="item.ID" :ripple="false" class="ma-0" />
                                </v-radio-group>
                              </v-col>
                              <v-col cols="3" sm="3">
                                <h5 class="pt-1">
                                  <span>ID</span>
                                </h5>
                                <h4>{{ item.ID }}</h4>
                              </v-col>
                              <v-col cols="3" sm="3">
                                <h5 class="pt-1">
                                  <span>Activity</span>
                                </h5>
                                <h4>
                                  {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                                </h4>
                              </v-col>
                              <v-col cols="5" sm="5">
                                <h5 class="pt-1">
                                  <span>TPA</span>
                                </h5>
                                <h4 class="text-capitalize">
                                  {{ item.TPA }}
                                </h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="2" xs="2" class="text-right cursor-pointer">
                            <v-btn icon class="cursor-pointer" variant="text" @click="showFeeDetails(item)">
                              <v-icon
                                size="small"
                                :color="theme.dark ? '' : 'black'"
                                :class="item.expandFeeDetail ? 'rotateactivityicon' : ''"
                              >
                                fas fa-chevron-right
                              </v-icon>
                            </v-btn>
                          </v-col>
                          <v-col cols="12" xs="12">
                            <v-row v-if="!item.expandFeeDetail">
                              <v-col cols="6" xs="6">
                                <h5 class="pt-1">
                                  <span>Fee Details</span>
                                </h5>
                                <h4>Estimated Cost</h4>
                              </v-col>
                              <v-col cols="3" xs="3">
                                <h5 class="pt-1">
                                  <span>Cost ($)</span>
                                </h5>
                                <h4>
                                  {{ formatPrice(item.EstimatedCost, 2) }}
                                </h4>
                              </v-col>
                              <v-col cols="3" xs="3">
                                <h5 class="pt-1">
                                  <span>Cost (%)</span>
                                </h5>
                                <h4>{{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}%</h4>
                              </v-col>
                            </v-row>
                            <v-row v-if="item.expandFeeDetail">
                              <v-col cols="6" xs="6">
                                <h5 class="pt-1">
                                  <span>Fee Details</span>
                                </h5>
                                <span>Investment Manager</span>
                                <br />
                                <span>Administration</span>
                                <br />
                                <span>Recordkeeping</span>
                                <br />
                                <span>Trustee / Custodian</span>
                                <br />
                                <span>Average Investment Expense</span>
                                <br />
                                <span>Mutual Fund Offset</span>
                                <br />
                                <span class="font-weight-medium">Estimated Cost</span>
                              </v-col>
                              <v-col cols="3" xs="3">
                                <h5 class="pt-1">
                                  <span>Cost ($)</span>
                                </h5>
                                <span>{{ formatPrice(item.InvestmentManagerCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.AdministrationCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.RecordKeepingCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.TrusteeCustodianCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.AVGInvestmentExpenseCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.MutualFundOffsetCost, 2) }}</span>
                                <br />
                                <span class="font-weight-medium">{{ formatPrice(item.EstimatedCost, 2) }}</span>
                              </v-col>
                              <v-col cols="3" xs="3">
                                <h5 class="pt-1">
                                  <span>Cost (%)</span>
                                </h5>
                                <span>{{ parseFloat(item.InvestmentManagerCostPercentage).toFixed(2) }}%</span>
                                <br />
                                <span>{{ parseFloat(item.AdministrationCostPercentage).toFixed(2) }}%</span>
                                <br />
                                <span>{{ parseFloat(item.RecordKeepingCostPercentage).toFixed(2) }}%</span>
                                <br />
                                <span>{{ parseFloat(item.TrusteeCustodianCostPercentage).toFixed(2) }}%</span>
                                <br />
                                <span>{{ parseFloat(item.AVGInvestmentExpenseCostPercentage).toFixed(2) }}%</span>
                                <br />
                                <span>{{ parseFloat(item.MutualFundOffsetCostPercentage).toFixed(2) }}%</span>
                                <br />
                                <span class="font-weight-medium">{{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}%</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row v-if="display.xs.value">
                      <v-col cols="12" xs="12" class="pb-1 pa-0">
                        <v-row>
                          <v-col cols="12" xs="12" class="pb-1">
                            <v-row>
                              <v-col cols="10" xs="10">
                                <v-row>
                                  <v-col cols="2" xs="2">
                                    <v-radio-group
                                      v-model="item.winProposal"
                                      :mandatory="false"
                                      hide-detailspa
                                      class="mr-0 mt-2 mb-0 ml-0 pa-0"
                                      @update:model-value="selectedProposal(item)"
                                    >
                                      <v-radio color="accent" :value="item.ID" :ripple="false" class="ma-0" />
                                    </v-radio-group>
                                  </v-col>
                                  <v-col cols="5" xs="5">
                                    <h4 class="pt-1 font-weight-medium" :class="theme.dark ? '' : 'grey--text text--darken-1'">
                                      ID
                                    </h4>
                                    <h4 :class="theme.dark ? '' : 'text-accent'">
                                      {{ item.ID }}
                                    </h4>
                                  </v-col>
                                  <v-col cols="5" xs="5">
                                    <h4 class="pt-1 font-weight-medium" :class="theme.dark ? '' : 'grey--text text--darken-1'">
                                      Activity
                                    </h4>
                                    <h4>
                                      {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                                    </h4>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="2" xs="2" class="text-right cursor-pointer">
                                <v-btn icon class="cursor-pointer ma-0" variant="text" @click="showFeeDetails(item)">
                                  <v-icon
                                    size="small"
                                    :color="theme.dark ? '' : 'black'"
                                    :class="item.expandFeeDetail ? 'rotateactivityicon' : ''"
                                  >
                                    fas fa-chevron-right
                                  </v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-if="item.expandFeeDetail" cols="12" xs="12">
                            <v-row class="pl-2 pr-2 pb-2" :class="theme.dark ? '' : 'tableListView_background'">
                              <v-col cols="12" xs="12">
                                <h4 class="pt-2 font-weight-medium" :class="theme.dark ? '' : 'grey--text text--darken-1'">
                                  TPA
                                </h4>
                                <h4 class="text-capitalize">
                                  {{ item.TPA }}
                                </h4>
                              </v-col>
                              <v-col cols="6" xs="6">
                                <h4 class="pt-2 font-weight-medium" :class="theme.dark ? '' : 'grey--text text--darken-1'">
                                  Fee Details
                                </h4>
                                <span>Investment Manager</span>
                                <br />
                                <span>Administration</span>
                                <br />
                                <span>Recordkeeping</span>
                                <br />
                                <span>Trustee / Custodian</span>
                                <br />
                                <span>Average Invest Exp.</span>
                                <br />
                                <span>Mutual Fund Offset</span>
                                <br />
                                <span class="font-weight-medium">Estimated Cost</span>
                              </v-col>
                              <v-col cols="6" xs="6" class="text-right">
                                <h4 class="pt-2 font-weight-medium" :class="theme.dark ? '' : 'grey--text text--darken-1'">
                                  Cost ($)
                                </h4>
                                <span>{{ formatPrice(item.InvestmentManagerCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.AdministrationCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.RecordKeepingCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.TrusteeCustodianCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.AVGInvestmentExpenseCost, 2) }}</span>
                                <br />
                                <span>{{ formatPrice(item.MutualFundOffsetCost, 2) }}</span>
                                <br />
                                <span class="font-weight-medium">{{ formatPrice(item.EstimatedCost, 2) }}</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider
                      v-if="display.smAndDown.value && index !== statusChangeList.length - 1"
                      class="my-2 progressdivider"
                    />
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-form>
      </v-col>
    </v-card-text>
    <v-card-actions class="pb-4 pt-2 pl-4 pr-4">
      <v-col class="text-right pa-0">
        <v-btn variant="outlined" :color="theme.dark ? '' : 'accent'" @click="resetFormData()"> Clear </v-btn>
        <v-btn
          type="submit"
          :color="theme.dark ? '' : 'accent'"
          :form="`statusForm ${planId < 0 ? planId : seinpno}`"
          class="elevation-0"
          :disabled="!formValid"
          @click="SaveStatus()"
        >
          Save
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import CustomIcon from '@/components/CustomIcon'
export default {
  components: {
    CustomIcon
  },
  props: ['dialog', 'seinpno', 'planId', 'currentStatus'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const statusChangeList = ref([])
    const planStatusList = ref([
      { text: 'Active', value: 'Active' },
      { text: 'Delayed', value: 'Delayed' },
      { text: 'Presented', value: 'Presented' },
      { text: 'Negotiation', value: 'Negotiation' },
      { text: 'Won', value: 'Won' },
      { text: 'Lost', value: 'Lost' },
      { text: 'Expired', value: 'Expired' }
    ])
    const delayedStatusReasonList = ref([
      { text: 'Waiting on Client Feedback', value: 'Client Feedback' },
      { text: 'Lost Momentum', value: 'Lost Momentum' },
      { text: 'Need to be Re-Qualified', value: 'Re-Qualified' },
      { text: 'Other', value: 'Other' }
    ])
    const closeStatusReasonList = ref([
      { text: 'Due to Cost', value: 'Due to Cost' },
      { text: 'Solution not offered', value: 'Solution not offered' },
      { text: 'Lost to competitor', value: 'Lost to competitor' },
      { text: 'Not moving forward', value: 'Not moving forward' },
      { text: 'Opportunity Expired', value: 'Opportunity Expired' },
      { text: 'Other', value: 'Other' }
    ])
    const lostStatusReasonList = ref([
      { text: 'Cost', value: 'Cost' },
      { text: 'Reputation', value: 'Reputation' },
      { text: 'Missing Feature', value: 'Missing Feature' },
      { text: 'Timing', value: 'Timing' },
      { text: 'Abandoned', value: 'Abandoned' },
      { text: 'Lost Momentum ', value: 'Lost Momentum ' },
      { text: 'Other', value: 'Other' }
    ])
    const whatThePlanWasLostTo = ref('')
    const statusChangeReason = ref('')
    const statusReason = ref('')
    const delayedStatusReason = ref('')
    const statusType = ref('')
    const reasonError = ref(false)
    const reasonErrorMsg = ref('')
    const formValid = ref(false)
    const talReportId = ref('')
    const form1 = ref(null)
    function SaveStatus() {
      if (form1.value.validate()) {
        if (statusType.value === 'Lost' && !statusChangeReason.value) {
          reasonError.value = true
          reasonErrorMsg.value = 'Reason for Status Change is required'
          return
        } else {
          reasonError.value = false
          reasonErrorMsg.value = ''
          var planStatus = {
            status: statusType.value,
            seinpno: props.seinpno,
            proposalId: props.planId,
            reasonforDelayed: delayedStatusReason.value,
            reasonforLost: statusChangeReason.value,
            whoPlanwasLostTo: whatThePlanWasLostTo.value,
            otherReasonforLost: statusReason.value,
            TALReportId: '',
            WinningProposal: false,
            time: new Date()
          }
          if (statusType.value === 'Won') {
            planStatus.WinningProposal = true
            planStatus.TALReportId = talReportId.value
          }
          var index = $store.state.planStatus.findIndex((item) => item.proposalId === props.planId)
          if (index > -1) $store.state.planStatus.splice(index, 1, planStatus)
          else $store.state.planStatus.push(planStatus)

          emit('getPlanProgress', planStatus)

          $axios
            .post('/api/v1/proposal/plan/status', planStatus)
            // eslint-disable-next-line no-unused-vars
            .then((success) => {
              emit('getPlanProgress', planStatus)
            })
        }
        resetStatus()
      }
    }
    function resetFormData() {
      statusReason.value = ''
      delayedStatusReason.value = ''
      statusChangeReason.value = ''
      reasonError.value = false
      reasonErrorMsg.value = ''
      statusType.value = ''
      if (form1.value) {
        form1.value.reset()
        form1.value.resetValidation()
      }
    }
    function changeStatus() {
      statusReason.value = ''
      statusChangeReason.value = ''
      reasonError.value = false
      reasonErrorMsg.value = ''
      if (statusChangeList.value.length > 1) {
        statusChangeList.value.forEach((element, index) => {
          element.expandFeeDetail = false
          element.winProposal = ''
          statusChangeList.value.splice(index, 1, element)
        })
      }
    }
    function resetStatus() {
      resetFormData()
      emit('closeStatus')
    }
    function showFeeDetails(proposalObject) {
      proposalObject.expandFeeDetail = !proposalObject.expandFeeDetail
      var index = statusChangeList.value.findIndex((item) => item.ID === proposalObject.ID)
      if (index > -1) {
        statusChangeList.value.splice(index, 1, proposalObject)
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
    function selectedProposal(item) {
      statusChangeList.value.forEach((element) => {
        element.winProposal = ''
      })
      statusChangeList.value.forEach((element, index) => {
        if (element.ID === item.ID) {
          element.winProposal = item.ID
        } else {
          statusChangeList.value.splice(index, 1, element)
        }
      })
      talReportId.value = item.TALReportId
    }
    function reasonforStatusChange() {
      if (statusChangeReason.value) {
        reasonError.value = false
        reasonErrorMsg.value = ''
      } else {
        reasonError.value = true
        reasonErrorMsg.value = 'Reason for Status Change is required'
      }
    }
    function getProposalActivity() {
      var ID = props.planId < 0 ? props.planId : props.seinpno
      $axios.get(`/api/v1/tal/plan/${ID}/proposal`).then((success) => {
        if (success.data.d !== null && success.data.d.length > 0) {
          var proposalList = success.data.d
          if (proposalList) {
            proposalList.sort(function (a, b) {
              return b.ID - a.ID
            })
            statusChangeList.value = proposalList
            statusChangeList.value.forEach((element) => {
              element.expandFeeDetail = false
              element.winProposal = ''
            })
          }
        }
      })
    }
    const statusList = computed(() => {
      return planStatusList.value.filter((a) => a.text !== props.currentStatus)
    })
    const statusReasonList = computed(() => {
      var reasonList = []
      switch (statusType.value) {
        case 'Active':
          break
        case 'Delayed':
          reasonList = delayedStatusReasonList.value
          break
        case 'Presented':
        case 'Negotiation':
        case 'Expired':
        case 'Won':
          break
        case 'Lost':
          reasonList = lostStatusReasonList.value
          break
        default:
          break
      }
      return reasonList
    })
    watch(
      () => props.dialog,
      (val) => {
        if (val) {
          getProposalActivity()
          resetFormData()
        }
      },
      { deep: true, immediate: true }
    )
    return {
      theme,
      display,
      form1,
      formValid,
      statusType,
      statusList,
      statusChangeReason,
      statusReasonList,
      reasonError,
      reasonErrorMsg,
      delayedStatusReason,
      statusReason,
      whatThePlanWasLostTo,
      statusChangeList,
      formatPrice,
      closeStatusReasonList,
      changeStatus,
      resetStatus,
      SaveStatus,
      reasonforStatusChange,
      parseFloat,
      showFeeDetails,
      selectedProposal,
      resetFormData
    }
  }
}
</script>
<style scoped>
.v-stepper__header .v-divider {
  margin: 0 0px !important;
}
.disableStepper:hover {
  cursor: not-allowed;
}
.rotateactivityicon {
  transform: rotate(90deg);
}
.iconSize {
  font-size: 1em !important;
}
.divider {
  border-color: rgba(0, 0, 0, 0.42) !important;
}
.activitydivheight {
  max-height: 300px !important;
  overflow-y: auto !important;
}
.border {
  border: 1px solid #707070;
}
.v-btn:before {
  opacity: 0 !important;
  width: 62px !important;
  height: 26px !important;
}

table.v-table tbody td,
table.v-table tfoot td {
  font-size: 0.82em !important;
}
.statusBack {
  background: #147ac2 0% 0% no-repeat padding-box;
  border-radius: 5px;
  opacity: 0.16;
  width: 82px !important;
  color: #0969b0;
}

.rotate_icon_180 {
  transform: rotate(90deg) !important;
  -webkit-transform: rotate(90deg) !important;
}

.flexborder {
  border: 1px solid #707070 !important;
}

.overflow_x_hidden {
  overflow-x: hidden !important;
}
</style>
