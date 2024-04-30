<template>
  <v-col class="information_review pa-0">
    <v-container
      :fluid="true"
      class="ml-0"
      :class="[display.smAndDown.value ? 'pr-2 pl-2' : 'pr-0 pl-0 pb-30', planInformationLoading ? 'pt-0' : '']"
    >
      <v-progress-linear v-if="planInformationLoading" indeterminate color="accent" height="4" />
      <v-col cols="12" lg="12" md="12" sm="12" xs="12" class="pa-0">
        <v-row>
          <v-col
            v-if="
              !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)
            "
            cols="12"
            xl="4"
            lg="4"
            md="4"
            sm="6"
            xs="12"
            :class="display.mdAndUp.value ? 'pr-3 pl-3' : 'pr-1 pl-1'"
            class="text-left pa-0"
          >
            <v-col cols="12" xs="12" class="padding_top_2">
              <h4 class="font-weight-medium text-uppercase">Progress</h4>
            </v-col>
            <v-col cols="12" xs="12" class="mb-2">
              <v-stepper :value="progress" class="elevation-0 background_transparent progressHeader">
                <v-stepper-header class="elevation-0 margin_left_1 margin_right_1">
                  <v-stepper-step
                    v-if="!$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)"
                    v-ripple="false"
                    step="D"
                    color="accent"
                    class="progressstepper pa-0"
                    :class="[diagnosticComplete ? 'highlightstepper' : '', planId > 0 ? '' : 'disableStepper']"
                  />
                  <v-divider
                    v-if="
                      !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) &&
                      (!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
                        !$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None))
                    "
                    class="progressdivider"
                    :class="planId > 0 ? '' : 'disableStepper'"
                  />

                  <v-stepper-step
                    v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                    v-ripple="false"
                    step="C"
                    color="accent"
                    class="progressstepper pa-0"
                    :class="[rpeaComplete ? 'highlightstepper' : '', planId > 0 ? '' : 'disableStepper']"
                  />
                  <v-divider
                    v-if="
                      !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) &&
                      !$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)
                    "
                    class="progressdivider"
                    :class="planId > 0 ? '' : 'disableStepper'"
                  />

                  <v-stepper-step
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    v-ripple="false"
                    step="P"
                    color="accent"
                    class="progressstepper pa-0"
                    :class="[proposalComplete ? 'highlightstepper' : '']"
                  />
                  <v-divider
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    class="progressdivider"
                  />

                  <v-stepper-step
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    v-ripple="false"
                    step="AS"
                    color="accent"
                    class="progressstepper pa-0"
                    :class="[agrmtSentComplete ? 'highlightstepper' : '']"
                  />
                  <v-divider
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    class="progressdivider"
                  />

                  <v-stepper-step
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    v-ripple="false"
                    step="AR"
                    color="accent"
                    class="progressstepper pa-0"
                    :class="[agrmtReceivedComplete ? 'highlightstepper' : '']"
                  />
                </v-stepper-header>
                <v-stepper-content step="-1" class="pa-0">
                  <v-card class="progressbackground pa-2">
                    <v-col cols="12" xs="12" class="mb-2 pa-0">
                      <v-row>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <span data-html2canvas-ignore="true">
                              <v-icon color="#E99200" size="small" data-html2canvas-ignore="true">mdi-lightbulb-outline</v-icon>
                            </span>
                            <h4 class="font-weight-medium pl-2">Next Steps:</h4>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pt-1 pa-0">
                          <h4 class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Get started by creating a Diagnostic or Comparison report.
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="D" class="pa-0" :class="progress === 'D' ? 'showProgresscard' : ''">
                  <v-card class="progressbackground pa-2">
                    <v-col cols="12" xs="12" class="mb-2 pa-0">
                      <v-row>
                        <v-col cols="12" xs="12" class="pa-0">
                          <h4>
                            Diagnostic Created:
                            {{ dateCreated ? new Date(dateCreated).toLocaleDateString() : '' }}
                          </h4>
                          <v-divider class="my-2 progressdivider" />
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row data-html2canvas-ignore="true">
                            <v-icon color="#E99200" size="small" data-html2canvas-ignore="true"> mdi-lightbulb-outline </v-icon>
                            <h4 class="font-weight-medium pl-2">Next Steps:</h4>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pt-1 pa-0">
                          <h4 class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Ready to show your value? Create a Comparison or Proposal report.
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="C" class="pa-0" :class="progress === 'C' ? 'showProgresscard' : ''">
                  <v-card class="progressbackground pa-2">
                    <v-col cols="12" xs="12" class="mb-2 pa-0">
                      <v-row>
                        <v-col cols="12" xs="12" class="pa-0">
                          <h4>
                            Comparison Created:
                            {{ dateCreated ? new Date(dateCreated).toLocaleDateString() : '' }}
                          </h4>
                          <v-divider class="my-2 progressdivider" />
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-icon color="#E99200" size="small" data-html2canvas-ignore="true"> mdi-lightbulb-outline </v-icon>
                            <h4 class="font-weight-medium pl-2">Next Steps:</h4>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pt-1 pa-0">
                          <h4 class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Time for a call-to-action. <br />Create a Proposal to seal the deal.
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="P" class="pa-0" :class="progress === 'P' ? 'showProgresscard' : ''">
                  <v-card class="progressbackground pa-2">
                    <v-col cols="12" xs="12" class="mb-2 pa-0">
                      <v-row>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="12" xs="12" class="pb-1 align-self pa-0">
                              <h4>
                                Proposal Created:
                                {{ dateCreated ? new Date(dateCreated).toLocaleDateString() : '' }}
                              </h4>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <v-row>
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
                                <div
                                  v-if="
                                    currentStatus !== 'Lost' &&
                                    currentStatus !== 'Won' &&
                                    planType !== $authz.planType.Simple_IRA_Plan_Proposal
                                  "
                                  class="align-self pl-2 handcursor"
                                  :class="theme.dark ? '' : 'grey--text'"
                                  @click="openChangeStatus()"
                                >
                                  <v-row>
                                    <div class="mt-1">
                                      <CustomIcon type="statusIcon" />
                                    </div>
                                    <div class="pl-1 align-self" :class="theme.dark ? '' : 'text-accent'">Change Status</div>
                                  </v-row>
                                </div>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-divider class="my-2 progressdivider" />
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-icon color="#E99200" size="small" data-html2canvas-ignore="true"> mdi-lightbulb-outline </v-icon>
                            <h4 class="font-weight-medium pl-2">Next Steps:</h4>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pt-1 pa-0">
                          <h4 v-if="currentStatus === 'Won'" class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Congratulations! We’ll email you an Agreements package to have completed by your client.
                          </h4>
                          <h4 v-if="currentStatus === 'Lost'" class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Create a new proposal report to review with client.
                          </h4>
                          <h4
                            v-if="currentStatus === 'Active' || currentStatus === 'Delayed'"
                            class="padding_left_19"
                            :class="theme.dark ? '' : 'text-accent'"
                          >
                            Ready to close this deal? <br />Update the status to Won.
                          </h4>
                          <h4
                            v-if="currentStatus === 'Presented'"
                            class="padding_left_19"
                            :class="theme.dark ? '' : 'text-accent'"
                          >
                            Ready to close this deal? <br />Update the status to closed Won.
                          </h4>
                          <h4
                            v-if="currentStatus === 'Negotiation'"
                            class="padding_left_19"
                            :class="theme.dark ? '' : 'text-accent'"
                          >
                            Need any help? Let us know what we can do to help you close this deal.
                          </h4>
                          <h4 v-if="currentStatus === 'Expired'" class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Create a new proposal report to review with client.
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="AS" class="pa-0" :class="progress === 'AS' ? 'showProgresscard' : ''">
                  <v-card class="progressbackground pa-2">
                    <v-col cols="12" xs="12" class="mb-2 pa-0">
                      <v-row>
                        <v-col cols="12" xs="12" class="pa-0">
                          <h4>
                            Agreements Sent:
                            {{ dateCreated ? new Date(dateCreated).toLocaleDateString() : '' }}
                          </h4>
                          <v-divider class="my-2 progressdivider" />
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-icon color="#E99200" size="small" data-html2canvas-ignore="true"> mdi-lightbulb-outline </v-icon>
                            <h4 class="font-weight-medium pl-2">Next Steps:</h4>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pt-1 pa-0">
                          <h4 class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Follow-up with the prospect to ensure completion and execution of the Agreements package.
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="AR" class="pa-0" :class="progress === 'AR' ? 'showProgresscard' : ''">
                  <v-card class="progressbackground pa-2">
                    <v-col cols="12" xs="12" class="mb-2">
                      <v-row>
                        <v-col cols="12" xs="12" class="pa-0">
                          <h4>
                            Agreements Received:
                            {{ dateCreated ? new Date(dateCreated).toLocaleDateString() : '' }}
                          </h4>
                          <v-divider class="my-2 progressdivider" />
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-icon color="#E99200" size="small" data-html2canvas-ignore="true"> mdi-lightbulb-outline </v-icon>
                            <h4 class="font-weight-medium pl-2">Next Steps:</h4>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pt-1 pa-0">
                          <h4 class="padding_left_19" :class="theme.dark ? '' : 'text-accent'">
                            Woohoo! We’ve received the signed Agreements package. We’re reviewing and will notify you with next
                            steps shortly.
                          </h4>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-stepper-content>
              </v-stepper>
            </v-col>
          </v-col>
          <v-col
            v-if="!planInformationLoading"
            cols="12"
            sm="12"
            xs="12"
            :xl="
              !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)
                ? '8'
                : '12'
            "
            :lg="
              !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)
                ? '8'
                : '12'
            "
            :md="
              !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)
                ? '8'
                : '12'
            "
            class="pa-0"
          >
            <v-row class="text-left">
              <v-col
                class="text-left pa-0"
                cols="12"
                md="8"
                xs="12"
                :class="[display.smAndDown.value ? 'pb-2 pt-2' : '', display.mdAndUp.value ? 'pl-3' : '']"
              >
                <h2>
                  {{ selectedPlan.PNAME }}
                  <v-tooltip v-if="selectedPlan.InBookOfBusiness === true" location="bottom">
                    <template #activator="{ props }">
                      <v-icon size="small" class="ml-1 mb-1" v-bind="props" color="blue-darken-2"> fas fa-book </v-icon>
                    </template>
                    <span>Within your Book of Business</span>
                  </v-tooltip>
                  <v-tooltip v-if="selectedPlan.ReliusPlanId !== undefined && selectedPlan.ReliusPlanId !== ''" location="bottom">
                    <template #activator="{ props }">
                      <v-icon
                        size="small"
                        class="ml-1 mb-1"
                        v-bind="props"
                        color="blue-darken-2"
                        @click="initiateAccountlinkSSOLogin()"
                      >
                        mdi-briefcase
                      </v-icon>
                    </template>
                    <span>View in Accountlink</span>
                  </v-tooltip>
                </h2>
              </v-col>
              <v-col v-if="reviewPanel" cols="12" xs="12" class="pa-0">
                <v-row>
                  <v-col cols="12" xl="2" xs="5" md="3" sm="5" lg="2" class="pb-2 pl-3 pa-0">
                    <v-col cols="12" xs="12" class="pa-0"> Plan Type </v-col>
                    <v-col cols="12" xs="12" class="pa-0">
                      <b>{{ selectedPlan.DCPTYPE }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col cols="6" xl="2" xs="6" lg="2" md="3" sm="6" class="pb-3 pl-3 pa-0">
                    <v-col class="pa-0">EIN/Plan #</v-col>
                    <v-col>
                      <b>{{ selectedPlan.SEINPNO }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!display.smAndDown.value" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="2" md="3" sm="5" class="pb-3 pl-3 pa-0">
                    <v-col class="pa-0">Total Assets</v-col>
                    <v-col class="pa-0">
                      <b>{{ formatPrice(selectedPlan.TOTASSETS != null ? selectedPlan.TOTASSETS : 0, 2) }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col v-if="planId > 0" cols="6" xl="2" xs="6" md="2" sm="6" lg="3" class="pb-3 pl-3 pa-0">
                    <v-col class="pa-0">Est. 1st year contribution</v-col>
                    <v-col class="pa-0">
                      <b>{{ formatPrice(selectedPlan.TOTCONTRIB != null ? selectedPlan.TOTCONTRIB : 0, 2) }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="display.lgAndUp.value && planId > 0" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="2" sm="5" :md="planId > 0 ? '3' : '2'" class="pl-3 pb-3 pa-0">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-col v-bind="props" class="pa-0"> Total Participants </v-col>
                      </template>
                      <span
                        >This includes eligible and ineligible participants,
                        <br />
                        termed participants and participants with <br />
                        and without an account balance.</span
                      >
                    </v-tooltip>
                    <v-col class="pa-0">
                      <b>{{ planId > 0 ? formatNumber(selectedPlan.PARTIC, 'decimal', 0) : '-' }}</b>
                    </v-col>
                  </v-col>
                  <v-divider
                    v-if="display.lgAndUp.value && planId < 0 && planType !== $authz.planType.Simple_IRA_Plan_Proposal"
                    inset
                    vertical
                    dark
                    class="hr_border"
                  />
                  <v-col
                    v-if="planId < 0 && planType !== $authz.planType.Simple_IRA_Plan_Proposal"
                    cols="12"
                    xl="3"
                    xs="5"
                    md="3"
                    sm="5"
                    lg="3"
                    class="pb-3 pl-3 pa-0"
                  >
                    <v-col class="pa-0">Fees per Latest Form 5500</v-col>
                    <v-col class="pa-0">
                      <b>{{
                        formatPrice(
                          (selectedPlan.EXPOTHER == null ? 0 : selectedPlan.EXPOTHER) +
                            (selectedPlan.EXPINVADV == null ? 0 : selectedPlan.EXPINVADV) +
                            (selectedPlan.EXPPROFFEE == null ? 0 : selectedPlan.EXPPROFFEE) +
                            (selectedPlan.EXPADMIN == null ? 0 : selectedPlan.EXPADMIN) +
                            broker,
                          2
                        )
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider
                    v-if="planType === $authz.planType.Simple_IRA_Plan_Proposal && display.lgAndUp.value"
                    inset
                    vertical
                    dark
                    class="hr_border"
                  />
                  <v-col
                    v-if="planType === $authz.planType.Simple_IRA_Plan_Proposal"
                    cols="12"
                    xl="2"
                    xs="5"
                    lg="2"
                    md="2"
                    sm="5"
                    class="pb-3 pl-3 pa-0"
                  >
                    <v-col class="pa-0">Strategist</v-col>
                    <v-col class="pa-0">
                      <b>{{ selectedPlan.Strategist }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="display.mdAndDown.value" inset vertical dark class="hr_border" />
                  <v-col cols="6" xl="2" xs="6" md="6" lg="2" sm="6" class="pb-3 pl-3 pa-0">
                    <v-col class="pa-0">Plan Sponsors</v-col>
                    <v-col :class="display.xs.value ? 'pr-2' : ''" class="pa-0">
                      <b>
                        <span>
                          <span v-if="selectedPlan.AFIRSTNAME && selectedPlan.ALASTNAME">
                            {{ selectedPlan.AFIRSTNAME }}
                            {{ selectedPlan.ALASTNAME }}
                          </span>

                          <span v-if="selectedPlan.AFIRSTNAME && selectedPlan.ALASTNAME"><br /></span>
                          <span v-if="selectedPlan.Contact">{{ selectedPlan.Contact }}</span>
                          <span v-if="selectedPlan.Contact"> <br /></span>
                          <span v-if="selectedPlan.SNAME">{{ selectedPlan.SNAME }}</span>
                          <span v-if="selectedPlan.SNAME"> <br /></span>
                          <span v-if="selectedPlan.SSTREET && selectedPlan.SCITY">
                            {{ selectedPlan.SSTREET }}
                            {{ selectedPlan.SCITY }}
                          </span>

                          <span v-if="selectedPlan.SCITY && selectedPlan.SSTATE">,</span>
                          <span v-if="selectedPlan.SCITY && selectedPlan.SSTATE"
                            >{{ selectedPlan.SSTATE }} {{ selectedPlan.ZIPCODE }}</span
                          >
                          <span v-if="selectedPlan.SCITY && selectedPlan.SSTATE"><br /></span>
                          <span v-if="selectedPlan.SPHONE">{{ selectedPlan.SPHONE }}</span>
                        </span>
                      </b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="display.mdAndUp.value" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="2" md="2" sm="5" class="pb-3 pl-3 pa-0">
                    <v-col class="pa-0">As of Date</v-col>
                    <v-col v-if="planId < 0" class="pa-0">
                      <b>{{ selectedPlan.AsOfDate ? new Date(selectedPlan.AsOfDate).toLocaleDateString() : '' }}</b>
                    </v-col>
                    <v-col v-if="planId > 0" class="pa-0">
                      <b>{{ selectedPlan.YEDISPLAY ? new Date(selectedPlan.YEDISPLAY).toLocaleDateString() : '' }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!display.md.value" inset vertical dark class="hr_border" />
                  <v-col cols="12" xl="2" xs="5" lg="2" md="3" sm="5" class="pb-3 pl-3 pa-0">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-col v-bind="props" class="pa-0"> Active Participants </v-col>
                      </template>
                      <span
                        >This is the total eligible participants <br />
                        in the plan with and without a balance.</span
                      >
                    </v-tooltip>
                    <v-col class="pa-0">
                      <b>{{ selectedPlan.ACTPARTIC ? formatNumber(selectedPlan.ACTPARTIC, 'decimal', 0) : '-' }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="planId > 0 && !display.smAndDown.value" inset vertical dark class="hr_border" />
                  <v-divider v-if="planId < 0 && !display.smAndDown.value" inset vertical dark class="hr_border" />
                  <v-col
                    v-if="planId > 0"
                    cols="12"
                    xl="2"
                    xs="5"
                    lg="3"
                    md="3"
                    sm="5"
                    class="pb-3 pl-3 pa-0"
                    :class="display.md.value ? 'pr-3' : ''"
                  >
                    <v-col class="pa-0">Fees per Latest Form 5500</v-col>
                    <v-col class="pa-0">
                      <b>{{
                        formatPrice(
                          (selectedPlan.EXPOTHER == null ? 0 : selectedPlan.EXPOTHER) +
                            (selectedPlan.EXPINVADV == null ? 0 : selectedPlan.EXPINVADV) +
                            (selectedPlan.EXPPROFFEE == null ? 0 : selectedPlan.EXPPROFFEE) +
                            (selectedPlan.EXPADMIN == null ? 0 : selectedPlan.EXPADMIN) +
                            broker,
                          2
                        )
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="planId > 0" inset vertical dark class="hr_border" />
                  <v-col class="pb-3 pl-3 pa-0">
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-col v-bind="props" class="pa-0"> Participants with a Balance </v-col>
                      </template>
                      <span
                        >This includes participants with an account balance
                        <br />
                        and termed participants with an account balance.</span
                      >
                    </v-tooltip>
                    <v-col class="pa-0">
                      <b>{{
                        planId > 0
                          ? formatNumber(selectedPlan.PARTICACCT, 'decimal', 0)
                          : formatNumber(selectedPlan.PARTIC, 'decimal', 0)
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-dialog
                      v-model="dialog"
                      :max-width="fontSize > 14 ? '850' : '800'"
                      persistent
                      scrollable
                      content-class="elevation-3"
                    >
                      <ChangeStatus
                        :dialog="dialog"
                        :seinpno="selectedPlan.SEINPNO"
                        :plan-id="planId"
                        :current-status="currentStatus"
                        @close-status="closeStatus"
                        @get-plan-progress="getPlanProgress"
                      />
                    </v-dialog>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance, computed, watch, onMounted } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import CustomIcon from '@/components/CustomIcon'
import ChangeStatus from '@/components/TAL/ChangeStatus'
export default {
  components: {
    CustomIcon,
    ChangeStatus
  },
  props: ['selectedPlan', 'planId', 'reportType'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const display = useDisplay()
    const theme = useTheme()
    const $store = instance.appContext.config.globalProperties.$store
    const $toast = instance.appContext.config.globalProperties.$toast
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const reviewPanel = ref(true)
    const asOfDate = ref(new Date())
    const planInformationLoading = ref(true)
    const progress = ref(-1)
    const dateCreated = ref('')
    const currentStatus = ref('Active')
    const diagnosticComplete = ref(false)
    const rpeaComplete = ref(false)
    const proposalComplete = ref(false)
    const agrmtSentComplete = ref(false)
    const agrmtReceivedComplete = ref(false)
    const dialog = ref(false)
    const broker = computed(() => {
      return (
        (props.selectedPlan.COMMISS != null ? props.selectedPlan.COMMISS : 0) +
        (props.selectedPlan.FEES != null ? props.selectedPlan.FEES : 0)
      )
    })
    const fontSize = computed(() => {
      return 12
    })
    const planType = computed(() => {
      if (props.selectedPlan) {
        return props.selectedPlan.DCPTYPE ? props.selectedPlan.DCPTYPE.trim() : ''
      }
      return ''
    })
    const onPopUpEvent = (url, data) => {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          $toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    const initiateAccountlinkSSOLogin = () => {
      if ($store.state.isImpersonating) {
        $toast.warning('Plan Portal SSO is unavailable when impersonating another user.', '')
        return
      }
      onPopUpEvent(`/api/v1/retention/pcs401k/sso/initiate?key=${props.selectedPlan.ReliusPlanId}&target=plan`, '_AccountLink')
    }
    const formatNumber = (value, type, decimal) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: type,
        currency: 'USD',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      })
      return formatter.format(value)
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
    const getPlanProgress = () => {
      var planId = props.planId ? Number(props.planId) : 0
      var planStage = []
      if (props.planId !== 0) {
        $axios.get(`/api/v1/tal/plan/${planId}/progress`).then((success) => {
          if (success.data.d !== null) {
            planStage = success.data.d.length > 0 ? success.data.d : []
            if (planStage.length > 0) {
              dateCreated.value = planStage[0].ActivityDate
              if (planStage[0].Stage.includes('Diagnostic')) {
                progress.value = 'D'
                diagnosticComplete.value = true
              }
              if (planStage[0].Stage.includes('Comparison')) {
                progress.value = 'C'
                rpeaComplete.value = true
              }
              if (planStage[0].Stage.includes('Proposal')) {
                progress.value = 'P'
                proposalComplete.value = true
              }
              if (planStage[0].Stage.includes('Agrmt. Sent')) {
                progress.value = 'AS'
                agrmtSentComplete.value = true
              }
              if (planStage[0].Stage.includes('Agrmt. Received')) {
                progress.value = 'AR'
                agrmtReceivedComplete.value = true
              }

              if ($store.state.planStatus && $store.state.planStatus.length > 0) {
                var selectedPlanStatus = $store.state.planStatus.find((a) => a.proposalId === planId)

                if (selectedPlanStatus) {
                  if (planStage[0].ProposalStatus === selectedPlanStatus.status) {
                    currentStatus.value = planStage[0].ProposalStatus
                    $store.state.planStatus.splice($store.state.planStatus.indexOf(selectedPlanStatus), 1)
                  } else {
                    var timeDifference = (new Date().getTime() - new Date(selectedPlanStatus.time).getTime()) / 1000
                    timeDifference /= 60
                    var timeDiff = Math.abs(Math.round(timeDifference))
                    if (timeDiff > 3) {
                      currentStatus.value = planStage[0].ProposalStatus
                      $store.state.planStatus.splice($store.state.planStatus.indexOf(selectedPlanStatus), 1)
                    } else {
                      currentStatus.value = selectedPlanStatus.status
                    }
                  }
                } else currentStatus.value = planStage[0].ProposalStatus
              } else currentStatus.value = planStage[0].ProposalStatus
            } else {
              progress.value = -1
              diagnosticComplete.value = false
              rpeaComplete.value = false
              proposalComplete.value = false
              agrmtSentComplete.value = false
              agrmtReceivedComplete.value = false
            }
            if ($store.state.planProgress.length > 0) {
              var planProgress = $store.state.planProgress.find((a) => a.planId === planId)

              if (planProgress) {
                switch (planProgress.latestStage) {
                  case 'Diagnostic':
                    if (!diagnosticComplete.value) {
                      if (progress.value === -1) progress.value = 'D'
                      diagnosticComplete.value = true
                    } else {
                      $store.state.planProgress.splice($store.state.planProgress.indexOf(planProgress), 1)
                    }
                    break
                  case 'Comparison':
                    if (!rpeaComplete.value) {
                      if (progress.value === -1 || progress.value === 'D') progress.value = 'C'
                      rpeaComplete.value = true
                    } else {
                      $store.state.planProgress.splice($store.state.planProgress.indexOf(planProgress), 1)
                    }
                    break
                  case 'Proposal':
                    if (!proposalComplete.value) {
                      if (progress.value === -1 || progress.value === 'D' || progress.value === 'C') progress.value = 'P'
                      proposalComplete.value = true
                    } else {
                      $store.state.planProgress.splice($store.state.planProgress.indexOf(planProgress), 1)
                    }
                    break
                }
              }
            }
          }
          emit('getStage', planStage)
        })
        emit('getActivity')
      }
    }
    const openChangeStatus = () => {
      dialog.value = true
    }
    const closeStatus = () => {
      dialog.value = false
    }
    watch(
      () => props.planId,
      () => {
        getPlanProgress()
        planInformationLoading.value = false
      },
      { deep: true }
    )
    onMounted(() => {
      if (props.planId !== 0) {
        getPlanProgress()
        planInformationLoading.value = false
      }
    })
    return {
      display,
      theme,
      $authz,
      planInformationLoading,
      progress,
      diagnosticComplete,
      rpeaComplete,
      proposalComplete,
      agrmtSentComplete,
      agrmtReceivedComplete,
      dateCreated,
      currentStatus,
      planType,
      dialog,
      fontSize,
      broker,
      asOfDate,
      reviewPanel,
      openChangeStatus,
      initiateAccountlinkSSOLogin,
      formatPrice,
      formatNumber,
      closeStatus,
      getPlanProgress
    }
  }
}
</script>
<style scoped>
.information_review .v-subheader {
  height: 28px !important;
}

.hr_border {
  border: solid 1px lightgray !important;
  height: 30px;
}
.v-label {
  font-size: 0.93em !important;
  color: grey !important;
}

.map_image_border {
  border: solid 1px lightgrey;
}
.img_slection_none {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>
<style scoped>
.v-stepper__header .v-divider {
  margin: 0 0px !important;
}
.disableStepper:hover {
  cursor: not-allowed;
}

.iconSize {
  font-size: 1em !important;
}
.divider {
  border-color: rgba(0, 0, 0, 0.42) !important;
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
.reduceFontSize .v-input {
  font-size: 12px;
}
</style>
