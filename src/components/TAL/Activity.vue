<template>
  <div class="pb-3 ml-2" :class="display.xs.value ? 'pl-1' : 'pl-4'">
    <v-row v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)">
      <v-col cols="6" class="text-left text-uppercase font_14 mb-1 pa-0">
        <h4 class="text-accent">
          <span class="cursor-pointer" @click="proposalPanel = !proposalPanel">
            <span data-html2canvas-ignore="true">
              <v-icon size="small" color="iconColor" :class="proposalPanel ? 'rotateactivityicon iconSize' : 'iconSize'"
                >mdi-chevron-left
              </v-icon>
            </span>
          </span>
          <span class="font-weight-medium ml-4">Proposals ({{ proposalActivityList.length }})</span>
        </h4>
      </v-col>
      <v-col cols="12" v-if="proposalPanel" class="pa-0" :class="display.xs.value ? 'pr-2' : 'ml-4 pr-4'">
        <div class="activitydivheight" :class="!display.xs.value ? 'pl-2' : ''">
          <div class="margin_left_1">
            <div v-if="!display.mdAndDown.value" class="mt-1">
              <v-row>
                <v-col cols="1" xs="1" class="font-weight-medium font_12 pa-0"> ID </v-col>
                <v-col cols="1" xs="1" class="font-weight-medium font_12 pa-0"> Activity Date </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 pa-0"> TPA </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 pa-0"> Fee Details </v-col>
                <v-col cols="1" xs="1" class="font-weight-medium font_12 text-right pa-0"> Cost ($) </v-col>
                <v-col cols="1" xs="1" class="font-weight-medium font_12 text-right pa-0"> Cost (%) </v-col>
                <v-col cols="1" xs="1" />
                <v-col cols="2" xs="2" />
              </v-row>
            </div>
            <div
              v-if="proposalActivityList.length === 0 && !showProposalLoader"
              class="text-center font_12 pt-2 pb-2"
              :class="theme.dark ? 'grey darken-2' : 'grey lighten-2'"
            >
              No data available
            </div>
            <div v-if="proposalActivityList.length === 0 && showProposalLoader" class="text-center pt-2 pb-2">
              <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
            </div>
            <div v-if="proposalActivityList.length > 0">
              <div v-for="(item, index) in proposalActivityList" :key="item.ID" class="mb-2">
                <v-row v-if="!display.mdAndDown.value">
                  <v-col :class="[item.expandFeeDetail ? '' : 'align-self', 'text-accent font_12']" class="pa-0" cols="1">
                    {{ item.ID }}
                  </v-col>
                  <v-col :class="item.expandFeeDetail ? '' : 'align-self'" class="font_12 pa-0" cols="1" xs="1">
                    {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                  </v-col>
                  <v-col :class="item.expandFeeDetail ? '' : 'align-self'" class="font_12 text-capitalize pa-0" cols="2" xs="2">
                    {{ item.TPA }}
                  </v-col>
                  <v-col v-if="!item.expandFeeDetail" class="align-self font_12 text-capitalize pa-0" cols="2" xs="2">
                    Estimated Cost
                  </v-col>
                  <v-col v-if="!item.expandFeeDetail" class="align-self text-right font_12 pa-0" cols="1" xs="1">
                    {{ formatPrice(item.EstimatedCost, 2) }}
                  </v-col>
                  <v-col v-if="!item.expandFeeDetail" class="align-self text-right font_12 pa-0 pr-3" cols="1" xs="1">
                    {{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}%
                  </v-col>
                  <v-col v-if="item.expandFeeDetail" cols="2" xs="2" class="font_12 pa-0">
                    <span>{{ showInvestmentFee }}</span
                    ><br />
                    <span v-if="showAdvisor">{{ showAdvisorFee }}</span
                    ><br v-if="showAdvisor" />
                    <span v-if="showMMLPlatformFee">MML Platform Fee</span>
                    <br v-if="showMMLPlatformFee" />
                    <span>Administration</span><br />
                    <span>Recordkeeping</span><br />
                    <span>Trustee / Custodian</span><br />
                    <span>Average Investment Expense</span><br />
                    <span>Mutual Fund Offset</span><br />
                    <span class="font-weight-medium">Estimated Cost</span>
                  </v-col>
                  <v-col v-if="item.expandFeeDetail" class="text-right font_12 pa-0" cols="1" xs="1">
                    <span>{{ formatPrice(item.InvestmentManagerCost, 2) }}</span>
                    <br />
                    <span v-if="showAdvisor">{{ formatPrice(item.FinancialAdvisorCost, 2) }}</span
                    ><br v-if="showAdvisor" />
                    <span v-if="showMMLPlatformFee">{{ formatPrice(item.BDPlatformCost, 2) }}</span>
                    <br v-if="showMMLPlatformFee" />
                    <span>{{ formatPrice(item.AdministrationCost, 2) }}</span
                    ><br />
                    <span>{{ formatPrice(item.RecordKeepingCost, 2) }}</span
                    ><br />
                    <span>{{ formatPrice(item.TrusteeCustodianCost, 2) }}</span
                    ><br />
                    <span>{{ formatPrice(item.AVGInvestmentExpenseCost, 2) }}</span
                    ><br />
                    <span>{{ formatPrice(item.MutualFundOffsetCost, 2) }}</span
                    ><br />
                    <span class="font-weight-medium">{{ formatPrice(item.EstimatedCost, 2) }}</span>
                  </v-col>
                  <v-col v-if="item.expandFeeDetail" class="text-right font_12 pa-0" cols="1" xs="1">
                    <span>{{ parseFloat(item.InvestmentManagerCostPercentage).toFixed(2) }}%</span>
                    <br />
                    <span v-if="showAdvisor">{{ parseFloat(item.FinancialAdvisorCostPercentage).toFixed(2) }}%</span
                    ><br v-if="showAdvisor" />
                    <span v-if="showMMLPlatformFee">{{ parseFloat(item.BDPlatformCostPercentage).toFixed(2) }}%</span>
                    <br v-if="showMMLPlatformFee" />
                    <span>{{ parseFloat(item.AdministrationCostPercentage).toFixed(2) }}%</span><br />
                    <span>{{ parseFloat(item.RecordKeepingCostPercentage).toFixed(2) }}%</span><br />
                    <span>{{ parseFloat(item.TrusteeCustodianCostPercentage).toFixed(2) }}%</span><br />
                    <span>{{ parseFloat(item.AVGInvestmentExpenseCostPercentage).toFixed(2) }}%</span><br />
                    <span>{{ parseFloat(item.MutualFundOffsetCostPercentage).toFixed(2) }}%</span><br />
                    <span class="font-weight-medium">{{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}%</span>
                  </v-col>
                  <v-col cols="1" xs="1" class="font_12 pa-0" :class="item.expandFeeDetail ? '' : 'align-self'">
                    <v-col offset-xs="2" class="text-center pa-0">
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
                                  : item.ProposalStatus === 'Negotiation'
                                    ? 'negotiateStatus'
                                    : item.ProposalStatus === 'Presented'
                                      ? 'presentedStatus'
                                      : item.ProposalStatus === 'Lost'
                                        ? 'lostStatus'
                                        : ''
                        ]"
                      >
                        <span class="text-capitalize">{{ item.ProposalStatus }}</span>
                      </div>
                    </v-col>
                  </v-col>
                  <v-col cols="2" xs="2" class="flex_none ml-1 pa-0">
                    <v-row>
                      <span
                        v-if="$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.Full)"
                        class="cursor-pointer pl-2 pr-2"
                        @click="activityAction('proposal', 'downloadReport', item.SyncReferenceID)"
                      >
                        <span data-html2canvas-ignore="true">
                          <v-tooltip location="top">
                            <template #activator="{ props }">
                              <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'" v-bind="props">mdi-file</v-icon>
                            </template>
                            <span>View Report</span>
                          </v-tooltip>
                        </span>
                      </span>
                      <span class="cursor-pointer pl-2 pr-2" @click="activityAction('proposal', 'editStepper')">
                        <span data-html2canvas-ignore="true">
                          <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-content-copy</v-icon>
                        </span>
                      </span>
                      <span class="pl-2 pr-2 cursor-pointer" @click.stop="deleteProposal[item.ID] = true">
                        <span data-html2canvas-ignore="true">
                          <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-delete </v-icon>
                        </span>
                      </span>
                      <span class="cursor-pointer pl-2 pr-2" @click="showFeeDetails(item)">
                        <span data-html2canvas-ignore="true">
                          <v-icon
                            size="small"
                            color="iconColor"
                            :class="item.expandFeeDetail ? 'rotateactivityicon iconSize' : 'iconSize'"
                            >fas fa-chevron-right</v-icon
                          >
                        </span>
                      </span>
                      <v-dialog
                        :key="item.ID"
                        v-model="deleteProposal[item.ID]"
                        :scrollable="false"
                        max-width="350"
                        content-class="elevation-3"
                      >
                        <ActionPopUp
                          confirm-action-text="Delete"
                          cancel-action-text="Cancel"
                          action-text="Delete Activity"
                          :action-message="`Are you sure you want to delete the activity id <b>${item.ID}</b> from Proposal lineup?`"
                          @confirm-action="deleteActivity(item, 'proposal')"
                          @cancel-action="deleteProposal[item.ID] = false"
                        />
                      </v-dialog>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row v-if="display.mdAndDown.value">
                  <v-col class="pr-2 pb-2 pl-1 pa-0">
                    <v-row>
                      <v-col cols="10" xs="10" class="pa-0">
                        <v-row>
                          <v-col cols="6" sm="6" class="pa-0">
                            <h5 class="pt-1">
                              <span>ID</span>
                            </h5>
                            <h4>{{ item.ID }}</h4>
                          </v-col>
                          <v-col cols="6" sm="6" class="pa-0">
                            <h5 class="pt-1">
                              <span>Activity</span>
                            </h5>
                            <h4>
                              {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                            </h4>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="2" xs="2" class="text-right cursor-pointer pa-0">
                        <v-btn icon class="cursor-pointer" variant="text" @click="showFeeDetails(item)">
                          <v-icon size="small" color="iconColor" :class="item.expandFeeDetail ? 'rotateactivityicon' : ''">
                            mdi-chevron-right
                          </v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="10" class="pa-0">
                        <v-row>
                          <v-col cols="6" sm="6" class="pa-0">
                            <h5 class="pt-1">
                              <span>TPA</span>
                            </h5>
                            <h4 class="text-capitalize">
                              {{ item.TPA }}
                            </h4>
                          </v-col>
                          <v-col cols="3" xs="3" class="align-self pa-0">
                            <v-col :offset-xs="display.xs.value ? '1' : ''">
                              <div
                                :class="[
                                  item.ProposalStatus === 'Active'
                                    ? 'openStatus'
                                    : item.ProposalStatus === 'Delayed'
                                      ? 'delayedStatus'
                                      : item.ProposalStatus === 'Expired'
                                        ? 'expiredStatus'
                                        : item.ProposalStatus === 'Won'
                                          ? 'wonStatus'
                                          : item.ProposalStatus === 'Negotiation'
                                            ? 'negotiateStatus'
                                            : item.ProposalStatus === 'Presented'
                                              ? 'presentedStatus'
                                              : item.ProposalStatus === 'Lost'
                                                ? 'lostStatus'
                                                : ''
                                ]"
                              >
                                <span class="text-capitalize">{{ item.ProposalStatus }}</span>
                              </div>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="10" class="pa-0">
                        <v-row v-if="!item.expandFeeDetail && !display.xs.value">
                          <v-col cols="6" xs="6" class="pa-0">
                            <h5 class="pt-1">
                              <span>Fee Details</span>
                            </h5>
                            <h4>Estimated Cost</h4>
                          </v-col>
                          <v-col :xs="!display.xs.value ? '3' : '6'" :class="!display.xs.value ? '' : 'text-right'" class="pa-0">
                            <h5 class="pt-1">
                              <span>Cost ($)</span>
                            </h5>
                            <h4>{{ formatPrice(item.EstimatedCost, 2) }}</h4>
                          </v-col>
                          <v-col v-if="!display.xs.value" cols="3" xs="3" class="pa-0">
                            <h5 class="pt-1">
                              <span>Cost (%)</span>
                            </h5>
                            <h4>{{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}%</h4>
                          </v-col>
                        </v-row>
                        <v-row v-if="item.expandFeeDetail">
                          <v-col cols="6" xs="6" class="pa-0">
                            <h5 class="pt-1">
                              <span>Fee Details</span>
                            </h5>
                            <span>{{ showInvestmentFee }}</span
                            ><br />
                            <span v-if="showAdvisor">{{ showAdvisorFee }}</span
                            ><br v-if="showAdvisor" />
                            <span v-if="showMMLPlatformFee">MML Platform Fee</span>
                            <br v-if="showMMLPlatformFee" />
                            <span>Administration</span><br />
                            <span>Recordkeeping</span><br />
                            <span>Trustee / Custodian</span><br />
                            <span>Average Investment Expense</span><br />
                            <span>Mutual Fund Offset</span><br />
                            <span class="font-weight-medium">Estimated Cost</span>
                          </v-col>
                          <v-col
                            :xs="!display.xs.value ? '3' : '6'"
                            :class="!display.xs.value ? '' : 'text-right pr-3'"
                            class="pa-0"
                          >
                            <h5 class="pt-1">
                              <span>Cost ($)</span>
                            </h5>
                            <span>{{ formatPrice(item.InvestmentManagerCost, 2) }}</span>
                            <br />
                            <span v-if="showAdvisor">{{ formatPrice(item.FinancialAdvisorCost, 2) }}</span
                            ><br v-if="showAdvisor" />
                            <span v-if="showMMLPlatformFee">{{ formatPrice(item.BDPlatformCost, 2) }}</span>
                            <br v-if="showMMLPlatformFee" />
                            <span>{{ formatPrice(item.AdministrationCost, 2) }}</span
                            ><br />
                            <span>{{ formatPrice(item.RecordKeepingCost, 2) }}</span
                            ><br />
                            <span>{{ formatPrice(item.TrusteeCustodianCost, 2) }}</span
                            ><br />
                            <span>{{ formatPrice(item.AVGInvestmentExpenseCost, 2) }}</span
                            ><br />
                            <span>{{ formatPrice(item.MutualFundOffsetCost, 2) }}</span
                            ><br />
                            <span class="font-weight-medium">{{ formatPrice(item.EstimatedCost, 2) }}</span>
                          </v-col>
                          <v-col v-if="!display.xs.value" cols="3" xs="3" class="pa-0">
                            <h5 class="pt-1">
                              <span>Cost (%)</span>
                            </h5>
                            <span>{{ parseFloat(item.InvestmentManagerCostPercentage).toFixed(2) }}%</span>
                            <br />
                            <span v-if="showAdvisor">{{ parseFloat(item.FinancialAdvisorCostPercentage).toFixed(2) }}%</span
                            ><br v-if="showAdvisor" />
                            <span v-if="showMMLPlatformFee">{{ parseFloat(item.BDPlatformCostPercentage).toFixed(2) }}%</span>
                            <br v-if="showMMLPlatformFee" />
                            <span>{{ parseFloat(item.AdministrationCostPercentage).toFixed(2) }}%</span><br />
                            <span>{{ parseFloat(item.RecordKeepingCostPercentage).toFixed(2) }}%</span><br />
                            <span>{{ parseFloat(item.TrusteeCustodianCostPercentage).toFixed(2) }}%</span><br />
                            <span>{{ parseFloat(item.AVGInvestmentExpenseCostPercentage).toFixed(2) }}%</span><br />
                            <span>{{ parseFloat(item.MutualFundOffsetCostPercentage).toFixed(2) }}%</span><br />
                            <span class="font-weight-medium">{{ parseFloat(item.EstimatedCostPercentage).toFixed(2) }}%</span>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="10" class="mt-2 pa-0">
                        <v-col cols="6" xs="6" class="pa-0">
                          <v-row>
                            <span
                              v-if="$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.Full)"
                              class="cursor-pointer pa-2"
                              @click="activityAction('proposal', 'downloadReport', item.SyncReferenceID)"
                            >
                              <span data-html2canvas-ignore="true">
                                <v-tooltip location="top">
                                  <template #activator="{ props }">
                                    <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'" v-bind="props">
                                      mdi-file
                                    </v-icon>
                                  </template>
                                  <span>View Report</span>
                                </v-tooltip>
                              </span>
                            </span>
                            <span class="cursor-pointer pa-2" @click="activityAction('proposal', 'editStepper')">
                              <span data-html2canvas-ignore="true">
                                <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'"> mdi-content-copy </v-icon>
                              </span>
                            </span>
                            <span class="pa-2 cursor-pointer" @click.stop="deleteProposal[item.ID] = true">
                              <span data-html2canvas-ignore="true">
                                <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'"> mdi-delete </v-icon>
                              </span>
                            </span>
                            <v-dialog
                              :key="item.ID"
                              v-model="deleteProposal[item.ID]"
                              :scrollable="false"
                              max-width="350"
                              content-class="elevation-3"
                            >
                              <ActionPopUp
                                confirm-action-text="Delete"
                                cancel-action-text="Cancel"
                                action-text="Delete Activity"
                                :action-message="`Are you sure you want to delete the activity id <b>${item.ID}</b> from Proposal lineup?`"
                                @confirm-action="deleteActivity(item, 'proposal')"
                                @cancel-action="deleteProposal[item.ID] = false"
                              />
                            </v-dialog>
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-divider v-if="display.mdAndDown.value && index !== proposalActivityList.length - 1" />
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <div v-if="showDiagnostic">
      <v-divider
        v-if="
          !$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None) &&
          (!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
            !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)) &&
          planId > 0
        "
        class="my-3 divider mr-5"
      />
      <v-row v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) && planId > 0">
        <v-col cols="6" class="text-left text-uppercase font_14 mb-1 pa-0">
          <h4 class="text-accent">
            <span class="cursor-pointer" @click="comparisonPanel = !comparisonPanel">
              <span data-html2canvas-ignore="true">
                <v-icon size="small" color="iconColor" :class="comparisonPanel ? 'rotateactivityicon iconSize' : 'iconSize'"
                  >fas fa-chevron-right</v-icon
                >
              </span>
            </span>
            <span class="font-weight-medium ml-4">Comparison ({{ comparisonActivityList.length }})</span>
          </h4>
        </v-col>
        <div v-if="comparisonPanel" :class="display.xs.value ? 'pr-2' : 'ml-4 mr-4'">
          <div :class="!display.xs.value ? 'pl-2' : ''" class="activitydivheight">
            <v-row class="margin_left_1">
              <div v-if="!display.mdAndDown.value" class="mt-1">
                <v-row>
                  <v-col cols="1" xs="1" class="font-weight-medium font_12"> ID </v-col>
                  <v-col cols="1" xs="1" class="font-weight-medium font_12"> Activity Date </v-col>
                  <v-col cols="3" xs="3" class="font-weight-medium font_12"> Plan Name </v-col>
                  <v-col cols="2" xs="2" class="font-weight-medium font_12 pl-5"> Plan Type </v-col>
                  <v-col cols="1" xs="1" class="font-weight-medium font_12 text-right"> Total Assets </v-col>
                </v-row>
              </div>
              <div
                v-if="comparisonActivityList.length === 0 && !showComparisonLoader"
                class="text-center font_12 pt-2 pb-2"
                :class="theme.dark ? 'grey darken-2' : 'grey lighten-2'"
              >
                No data available
              </div>
              <div v-if="comparisonActivityList.length === 0 && showComparisonLoader" class="text-center pt-2 pb-2">
                <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
              </div>
              <div v-if="comparisonActivityList.length > 0">
                <div v-for="item in comparisonActivityList" :key="item.ID" class="mb-3">
                  <v-row v-if="!display.mdAndDown.value">
                    <v-col cols="1" class="align-self font_12 text-accent">
                      {{ item.ID }}
                    </v-col>
                    <v-col cols="1" class="align-self font_12">
                      {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                    </v-col>
                    <v-col cols="3" xs="3" class="align-self font_12">
                      {{ item.PlanName }}
                    </v-col>
                    <v-col cols="2" xs="2" class="align-self font_12 pl-5">
                      {{ item.PlanType }}
                    </v-col>
                    <v-col cols="1" xs="1" class="align-self font_12 text-right">
                      {{ formatPrice(item.TotalAssets, 2) }}
                    </v-col>
                    <v-col v-if="!display.xs.value" cols="1" xs="1" :class="proposalActivityList.length > 8 ? 'ml-1' : ''" />
                    <v-col :offset-xs="display.xs.value ? '3' : ''" :class="display.xs.value ? '' : 'font_12'" class="align-self">
                      <v-row>
                        <span
                          v-if="$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.Full)"
                          class="cursor-pointer pl-4 pr-2"
                          :class="display.xl.value ? 'ml-3' : ''"
                          @click="activityAction('rpea', 'downloadReport', item.SyncReferenceID)"
                        >
                          <span data-html2canvas-ignore="true">
                            <v-tooltip location="top">
                              <template #activator="{ props }">
                                <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'" v-bind="props">mdi-file</v-icon>
                              </template>
                              <span>View Report</span>
                            </v-tooltip>
                          </span>
                        </span>
                        <span class="cursor-pointer pl-2 pr-2" @click="activityAction('comparison', 'editStepper')">
                          <span data-html2canvas-ignore="true">
                            <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-content-copy</v-icon>
                          </span>
                        </span>
                        <span class="pl-2 pr-2 cursor-pointer" @click.stop="deleteComparision[item.ID] = true">
                          <span data-html2canvas-ignore="true">
                            <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-delete </v-icon>
                          </span>
                        </span>
                        <v-dialog
                          :key="item.ID"
                          v-model="deleteComparision[item.ID]"
                          :scrollable="false"
                          max-width="350"
                          content-class="elevation-3"
                        >
                          <ActionPopUp
                            confirm-action-text="Delete"
                            cancel-action-text="Cancel"
                            action-text="Delete Activity"
                            :action-message="`Are you sure you want to delete the activity id <b>${item.ID}</b> from Comparison lineup?`"
                            @confirm-action="deleteActivity(item, 'comparison')"
                            @cancel-action="deleteComparision[item.ID] = false"
                          />
                        </v-dialog>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row v-if="display.mdAndDown.value">
                    <v-col cols="12" xs="12" class="pr-2 pb-2 pl-1">
                      <v-row>
                        <v-col cols="12" xs="12">
                          <v-row>
                            <v-col cols="6" sm="6" xs="6">
                              <h5 class="pt-1">
                                <span>ID</span>
                              </h5>
                              <h4>{{ item.ID }}</h4>
                            </v-col>
                            <v-col cols="6" sm="6" xs="6">
                              <h5 class="pt-1">
                                <span>Activity</span>
                              </h5>
                              <h4>
                                {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                              </h4>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12">
                          <v-row>
                            <v-col cols="6" sm="6" xs="6">
                              <h5 class="pt-1">
                                <span>Plan Name</span>
                              </h5>
                              <h4>{{ item.PlanName }}</h4>
                            </v-col>
                            <v-col cols="6" sm="6" xs="6">
                              <h5 class="pt-1">
                                <span>Plan Type</span>
                              </h5>
                              <h4>{{ item.PlanType }}</h4>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12">
                          <v-row>
                            <v-col cols="6" sm="6" xs="6">
                              <h5 class="pt-1">
                                <span>Total Assets</span>
                              </h5>
                              <h4>{{ formatPrice(item.TotalAssets, 2) }}</h4>
                            </v-col>
                            <v-col cols="6" sm="6" xs="6">
                              <v-row>
                                <span
                                  v-if="$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.Full)"
                                  class="cursor-pointer pl-4 pr-2"
                                  :class="display.xl.value ? 'ml-3' : ''"
                                  @click="activityAction('rpea', 'downloadReport', item.SyncReferenceID)"
                                >
                                  <span data-html2canvas-ignore="true">
                                    <v-tooltip location="top">
                                      <template #activator="{ props }">
                                        <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'" v-bind="props"
                                          >mdi-file
                                        </v-icon>
                                      </template>
                                      <span>View Report</span>
                                    </v-tooltip>
                                  </span>
                                </span>
                                <span class="cursor-pointer pl-2 pr-2" @click="activityAction('comparison', 'editStepper')">
                                  <span data-html2canvas-ignore="true">
                                    <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-content-copy</v-icon>
                                  </span>
                                </span>
                                <span class="pl-2 pr-2 cursor-pointer" @click.stop="deleteComparision[item.ID] = true">
                                  <span data-html2canvas-ignore="true">
                                    <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-delete</v-icon>
                                  </span>
                                </span>
                                <v-dialog
                                  :key="item.ID"
                                  v-model="deleteComparision[item.ID]"
                                  :scrollable="false"
                                  max-width="350"
                                  content-class="elevation-3"
                                >
                                  <ActionPopUp
                                    confirm-action-text="Delete"
                                    cancel-action-text="Cancel"
                                    action-text="Delete Activity"
                                    :action-message="`Are you sure you want to delete the activity id <b>${item.ID}</b> from Comparison lineup?`"
                                    @confirm-action="deleteActivity(item, 'comparison')"
                                    @cancel-action="deleteComparision[item.ID] = false"
                                  />
                                </v-dialog>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-divider v-if="display.mdAndDown.value && index !== comparisonActivityList.length - 1" />
                </div>
              </div>
            </v-row>
          </div>
        </div>
      </v-row>
      <v-divider
        v-if="
          !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) &&
          !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) &&
          planId > 0
        "
        class="my-3 divider mr-5"
      />
      <v-row v-if="!$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) && planId > 0" class="mb-4">
        <v-col cols="6" class="text-left text-uppercase font_14 mb-1 pa-0">
          <h4 class="text-accent">
            <span class="cursor-pointer" @click="diagnosticPanel = !diagnosticPanel">
              <span data-html2canvas-ignore="true">
                <v-icon size="small" color="iconColor" :class="diagnosticPanel ? 'rotateactivityicon iconSize' : 'iconSize'"
                  >fas fa-chevron-right</v-icon
                >
              </span>
            </span>
            <span class="font-weight-medium ml-4">Diagnostic ({{ diagnosticActivityList.length }})</span>
          </h4>
        </v-col>
        <v-col v-if="diagnosticPanel" cols="12" xs="12" :class="display.xs.value ? 'pr-2' : 'ml-4 mr-4'" class="pa-0">
          <v-col :class="!display.xs.value ? 'pl-2' : ''" class="activitydivheight" cols="12" xs="12">
            <v-row class="margin_left_1">
              <v-col cols="12" xs="12" class="mt-1">
                <v-row>
                  <v-col
                    :xs="display.mdAndDown.value ? '2' : '1'"
                    :class="display.mdAndDown.value ? '' : 'font_12'"
                    class="font-weight-medium"
                  >
                    ID
                  </v-col>
                  <v-col
                    :xs="display.mdAndDown.value ? '2' : '1'"
                    :class="display.mdAndDown.value ? '' : 'font_12'"
                    class="font-weight-medium"
                  >
                    Activity Date
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-if="diagnosticActivityList.length === 0 && !showDiagnosticLoader"
                class="text-center font_12 pt-2 pb-2 bg-grey"
                :class="theme.dark ? 'darken-2' : 'lighten-2'"
              >
                No data available
              </v-col>
              <v-col v-if="diagnosticActivityList.length === 0 && showDiagnosticLoader" class="text-center pt-2 pb-2">
                <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
              </v-col>
              <v-col v-if="diagnosticActivityList.length > 0">
                <v-col v-for="item in diagnosticActivityList" :key="item.ID" cols="12" xs="12" class="mb-3">
                  <v-row>
                    <v-col
                      class="align-self"
                      :xs="display.mdAndDown.value ? '2' : '1'"
                      :class="['text-accent', display.mdAndDown.value ? '' : 'font_12']"
                    >
                      {{ item.ID }}
                    </v-col>
                    <v-col
                      :xs="display.mdAndDown.value ? '2' : '1'"
                      class="align-self"
                      :class="display.mdAndDown.value ? '' : 'font_12'"
                    >
                      {{ item.Activity ? new Date(item.Activity).toLocaleDateString() : '' }}
                    </v-col>
                    <v-col v-if="!display.xs.value" cols="1" xs="1" :class="proposalActivityList.length > 8 ? 'ml-1' : 'ml-3'" />
                    <v-col
                      class="align-self"
                      :offset-xs="display.xs.value ? '3' : '6'"
                      :class="display.xs.value ? '' : 'font_12'"
                    >
                      <v-row>
                        <span
                          v-if="$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.Full)"
                          class="cursor-pointer pl-4 pr-2"
                          :class="display.xl.value ? 'ml-3' : 'ml-2'"
                          @click="activityAction('diagnostic', 'downloadReport', item.SyncReferenceID)"
                        >
                          <span data-html2canvas-ignore="true">
                            <v-tooltip location="top">
                              <template #activator="{ props }">
                                <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'" v-bind="props">mdi-file</v-icon>
                              </template>
                              <span>View Report</span>
                            </v-tooltip>
                          </span>
                        </span>
                        <span class="cursor-pointer pl-2 pr-2" @click="activityAction('diagnostic', 'editStepper')">
                          <span data-html2canvas-ignore="true">
                            <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-content-copy</v-icon>
                          </span>
                        </span>
                        <span class="pl-2 pr-2 cursor-pointer" @click.stop="deleteDiagnostic[item.ID] = true">
                          <span data-html2canvas-ignore="true">
                            <v-icon size="small" :color="theme.dark ? '' : 'grey lighten-1'">mdi-delete </v-icon>
                          </span>
                        </span>
                        <v-dialog
                          :key="item.ID"
                          v-model="deleteDiagnostic[item.ID]"
                          :scrollable="false"
                          max-width="350"
                          content-class="elevation-3"
                        >
                          <ActionPopUp
                            confirm-action-text="Delete"
                            cancel-action-text="Cancel"
                            action-text="Delete Activity"
                            :action-message="`Are you sure you want to delete the activity id <b>${item.ID}</b> from Diagnostic lineup?`"
                            @confirm-action="deleteActivity(item, 'diagnostic')"
                            @cancel-action="deleteDiagnostic[item.ID] = false"
                          />
                        </v-dialog>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { ref, getCurrentInstance, computed, watch, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import ActionPopUp from '@/components/ActionPopUp'
export default {
  components: {
    ActionPopUp
  },
  props: ['seinpno', 'planId', 'espTypeSelected', 'planType'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const $store = instance.appContext.config.globalProperties.$store
    const proposalPanel = ref(false)
    const comparisonPanel = ref(false)
    const diagnosticPanel = ref(false)
    const proposalActivityList = ref([])
    const comparisonActivityList = ref([])
    const diagnosticActivityList = ref([])
    const deleteProposal = ref({})
    const deleteComparision = ref({})
    const deleteDiagnostic = ref({})
    const showProposalLoader = ref(true)
    const showComparisonLoader = ref(true)
    const showDiagnosticLoader = ref(true)
    const showDiagnostic = ref(true)
    function getPlanDetail() {
      var ID = props.planId < 0 ? props.planId : props.seinpno
      if (ID) {
        $axios
          .get(`/api/v1/tal/plan/${ID}/All`)
          .then((success) => {
            if (success.data.d !== null && success.data.d.length > 0) {
              var planActivity = success.data.d
              var diagnoticList = planActivity.filter((a) => a.ReportType === 'Diagnostic')
              if (diagnoticList) {
                diagnoticList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                diagnosticActivityList.value = diagnoticList
              }

              var comparisionList = planActivity.filter((a) => a.ReportType === 'RPEA/Comparison')
              if (comparisionList) {
                comparisionList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                comparisonActivityList.value = comparisionList
              }

              var proposalList = planActivity.filter((a) => a.ReportType === 'PCS Proposal')
              if (proposalList) {
                proposalList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                proposalActivityList.value = proposalList
                proposalActivityList.value.forEach((element) => {
                  element.expandFeeDetail = false
                })
              }

              proposalPanel.value = proposalActivityList.value.length > 0 ? true : false
              comparisonPanel.value = comparisonActivityList.value.length > 0 ? true : false
              diagnosticPanel.value = diagnosticActivityList.value.length > 0 ? true : false
            }
            emit('loadActivity', false)
            showProposalLoader.value = false
            showComparisonLoader.value = false
            showDiagnosticLoader.value = false
          })
          .catch(() => {
            emit('loadActivity', false)
            showProposalLoader.value = false
            showComparisonLoader.value = false
            showDiagnosticLoader.value = false
          })
      }
    }
    function activityAction(report, action, data) {
      emit('activityAction', action, report, data)
    }
    function showFeeDetails(proposalObject) {
      proposalObject.expandFeeDetail = !proposalObject.expandFeeDetail
      var index = proposalActivityList.value.findIndex((item) => item.ID === proposalObject.ID)
      if (index > -1) {
        proposalActivityList.value.splice(index, 1, proposalObject)
      }
    }
    function deleteActivity(item, type) {
      if (item.TALReportId) {
        $axios.delete(`/api/v1/tal/plan/activity/${item.SEINPNO}/${item.TALReportId}`).then(() => {
          if (type === 'proposal') {
            showProposalLoader.value = true
            proposalActivityList.value = []
            getProposalActivity()
          } else if (type === 'comparison') {
            showComparisonLoader.value = true
            comparisonActivityList.value = []
            getComparisonActivity()
          } else if (type === 'diagnostic') {
            showDiagnosticLoader.value = true
            diagnosticActivityList.value = []
            getDiagnosticActivity()
          }
        })
        if (type === 'diagnostic') {
          deleteDiagnostic.value[item.ID] = false
        } else if (type === 'comparison') {
          deleteComparision.value[item.ID] = false
        } else if (type === 'proposal') {
          deleteProposal.value[item.ID] = false
        }
      }
    }
    function getProposalActivity() {
      var ID = props.planId < 0 ? props.planId : props.seinpno
      if (ID) {
        $axios
          .get(`/api/v1/tal/plan/${ID}/All`)
          .then((success) => {
            if (success.data.d !== null && success.data.d.length > 0) {
              var proposalList = success.data.d.filter((a) => a.ReportType === 'PCS Proposal')
              if (proposalList) {
                proposalList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                proposalActivityList.value = proposalList
                proposalActivityList.value.forEach((element) => {
                  element.expandFeeDetail = false
                })
              }
            }
            showProposalLoader.value = false
            proposalPanel.value = proposalActivityList.value.length > 0 ? true : false
          })
          .catch(() => {
            showProposalLoader.value = false
          })
      }
    }
    const formatPrice = (value, decimals) => {
      if (value === undefined) {
        return 'N/A' // or some default formatting
      }
      // Your logic to format the price
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals
      }).format(value)
    }
    function getComparisonActivity() {
      $axios
        .get(`/api/v1/tal/plan/${props.seinpno}/All`)
        .then((success) => {
          if (success.data.d !== null && success.data.d.length > 0) {
            var comparisionList = success.data.d.filter((a) => a.ReportType === 'RPEA/Comparison')
            if (comparisionList) {
              comparisionList.sort(function (a, b) {
                return b.ID - a.ID
              })
              comparisonActivityList.value = comparisionList
            }
          }
          showComparisonLoader.value = false
          comparisonPanel.value = comparisonActivityList.value.length > 0 ? true : false
        })
        .catch(() => {
          showComparisonLoader.value = false
        })
    }
    function getDiagnosticActivity() {
      $axios
        .get(`/api/v1/tal/plan/${props.seinpno}/All`)
        .then((success) => {
          if (success.data.d !== null && success.data.d.length > 0) {
            var diagnoticList = success.data.d.filter((a) => a.ReportType === 'Diagnostic')
            if (diagnoticList) {
              diagnoticList.sort(function (a, b) {
                return b.ID - a.ID
              })
              diagnosticActivityList.value = diagnoticList
            }
          }
          showDiagnosticLoader.value = false
          diagnosticPanel.value = diagnosticActivityList.value.length > 0 ? true : false
        })
        .catch(() => {
          showDiagnosticLoader.value = false
        })
    }
    const showAdvisor = computed(() => {
      if (
        $authz.hasRole($authz.roles.SiteAdmin) ||
        $authz.hasRole($authz.roles.ProgramAdmin) ||
        $authz.hasRole($authz.roles.FirmAdmin)
      ) {
        return $authz.allowedByProgram($authz.programPermissionSet.Allow_Investment_Manager_TAMP__c, $authz.permission.Full)
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Allow_Investment_Manager_TAMP__c, $authz.permission.Full) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Allow_Investment_Manager_TAMP__c, $authz.permission.Full)
        )
      } else return true
    })
    const showInvestmentFee = computed(() => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        return 'ERISA 3(38) Fiduciary Fee'
      } else return 'Investment Manager'
    })
    const showAdvisorFee = computed(() => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        return 'Advisor Fee'
      } else return 'Financial Advisor'
    })
    const showMMLPlatformFee = computed(() => {
      if ($store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
        return true
      } else return false
    })
    watch(
      () => props.seinpno,
      () => {
        getPlanDetail()
      },
      { deep: true }
    )
    onMounted(() => {
      if (props.planId > 0) {
        if (props.espTypeSelected === $authz.firmRelationship.Pooled_Employer_Plan) {
          showDiagnostic.value = false
        } else if (props.espTypeSelected === $authz.firmRelationship.Single_Employer_Plan) {
          if (props.planType) {
            if (props.planType === $authz.planType.Defined_Contribution_Plan || props.planType === $authz.planType.ERISA_403_b) {
              showDiagnostic.value = true
            } else showDiagnostic.value = false
          } else showDiagnostic.value = true
        } else {
          if (props.planType) {
            if (props.planType === $authz.planType.Defined_Contribution_Plan || props.planType === $authz.planType.ERISA_403_b) {
              showDiagnostic.value = true
            } else showDiagnostic.value = false
          } else showDiagnostic.value = true
        }
      } else showDiagnostic.value = false
      getPlanDetail()
    })
    return {
      theme,
      display,
      $authz,
      proposalPanel,
      proposalActivityList,
      showProposalLoader,
      formatPrice,
      parseFloat,
      showInvestmentFee,
      showAdvisorFee,
      activityAction,
      deleteProposal,
      showFeeDetails,
      deleteActivity,
      showMMLPlatformFee,
      showAdvisor,
      showDiagnostic,
      comparisonPanel,
      getPlanDetail,
      comparisonActivityList,
      showComparisonLoader,
      deleteComparision,
      showDiagnosticLoader,
      diagnosticActivityList,
      deleteDiagnostic
    }
  }
}
</script>
<style scoped>
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
</style>
