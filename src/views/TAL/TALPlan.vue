<template>
  <v-container
    ref="printContent"
    :class="[display.smAndDown.value ? 'pl-1 pr-1' : 'v-container--fluid', theme.dark ? 'dark_bg' : '']"
  >
    <v-container class="pt-1" :class="display.smAndDown.value ? 'pl-0 pr-0' : 'v-container--fluid'">
      <v-col cols="12" class="pt-2 pb-2">
        <v-row>
          <v-col cols="6" class="align-self pa-0">
            <router-link
              :to="prevRoute.fullPath !== '/' ? (prevRoute.fullPath ? prevRoute.fullPath : '/') : lastRoute"
              class="text-decoration-none"
            >
              <span :class="theme.dark ? 'text-white handcursor' : 'text-hyperlink handcursor'">
                <span data-html2canvas-ignore="true">
                  <v-icon size="small" :class="theme.dark ? 'text-white pb-1' : 'text-hyperlink pb-1'">mdi-chevron-left</v-icon>
                </span>
                <span
                  :class="theme.dark ? 'text-white pl-2 text-uppercase font_14' : 'text-hyperlink pl-2 text-uppercase font_14'"
                >
                  Back
                </span>
              </span>
            </router-link>
          </v-col>
          <v-col cols="6" class="text-right pa-0">
            <v-row justify="end">
              <div class="text-right align-self d-flex justify-end flex_none">
                <a
                  v-if="exportPermissionForAdvisor"
                  href="#"
                  class="text-uppercase text-decoration-none pr-1 font_14"
                  :class="!theme.dark ? 'text-hyperlink' : 'text-white'"
                  @click="exportToExcel()"
                  >Export</a
                >
              </div>
              <div
                v-if="exportPermissionForAdvisor && planId > 0"
                class="text-right align-self d-flex justify-end flex_none ml-4"
              >
                |
              </div>
              <div v-if="planId > 0" class="text-right align-self d-flex justify-end flex_none">
                <div class="pl-1">
                  <PlanStar :seinpno="selectedPlan.SEINPNO" from="TAL" type="ForProfit" />
                </div>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <div id="printMe">
        <v-card class="mb-3 elevation-4">
          <v-col class="pa-0">
            <PlanInformation
              ref="planInformationProgress"
              :selected-plan="selectedPlan"
              :report-type="reports"
              :plan-id="planId"
              @get-activity="getActivity"
              @get-stage="getStage"
            />
          </v-col>
          <v-col>
            <PlanPerformance :SEINPNO="selectedPlan.SEINPNO" :plan-id="planId" :plan-name="selectedPlan.PNAME" />
          </v-col>
        </v-card>
      </div>
      <div v-if="display.smAndDown.value ? (createReport ? true : false) : true" class="pt-1">
        <v-row v-if="items.length > 1">
          <v-col
            id="reportsTab"
            :cols="display.smAndDown.value ? '11' : '12'"
            :sm="display.smAndDown.value ? '11' : '12'"
            class="pa-0"
          >
            <v-card>
              <v-tabs
                v-model="reportsTab"
                :bg-color="theme.dark ? '' : 'accent'"
                class="plantabs"
                align-tabs="center"
                center-active
                show-arrows
                slider-color="white"
              >
                <v-tab v-for="(item, index) in items" :key="index" style>
                  {{ item.text }}
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
          <v-col
            v-if="display.smAndDown.value"
            cols="1"
            sm="1"
            :class="[
              display.smAndDown.value ? 'elevation-1 text-center' : '',
              theme.dark ? 'assign_darkMode_color' : 'bg-accent'
            ]"
            style="height: 48px !important"
            @click="createReport = !createReport"
          >
            <v-icon class="text-secondary font_24 cursor-pointer"> mdi-minus-circle </v-icon>
          </v-col>
          <v-progress-linear v-if="loadAll" color="accent" :indeterminate="true" height="5" class="mt-0" />
        </v-row>
      </div>
      <v-col
        v-if="display.smAndDown.value && items.length > 1"
        v-show="!createReport"
        cols="12"
        sm="12"
        class="mt-2 pt-2 pb-2 pl-2 pr-1 text-secondary border_radius_2"
        :class="theme.dark ? 'assign_darkMode_color' : 'bg-accent'"
        @click="createReport = !createReport"
      >
        <v-row>
          <v-col cols="11" xs="11" sm="11" class="pt-1 pb-2 pl-2 cursor-pointer"> Reports And Activity </v-col>
          <v-col cols="1" xs="1" sm="1" class="text-center cursor-pointer pa-0 pt-1">
            <v-icon class="text-secondary font_24"> mdi-plus-circle </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-row
        v-show="reports !== 'Activity'"
        v-if="display.smAndDown.value ? (createReport ? true : false) : true"
        class="justify-center"
        :class="step1Error || step2Error || step3Error || step4Error || step5Error ? 'step_error' : 'stepper_main'"
      >
        <v-col cols="11" xl="11" lg="11" sm="11" md="11" :class="loadAll ? '' : 'mt-3'" class="pa-0">
          <h2 class="pl-4">
            {{ reportName }}
          </h2>
          <v-col v-if="reports === 'Proposal' && showESPType" class="pt-3 mb-0 pa-0" cols="12">
            <h3 class="pl-4">Proposal Type</h3>
            <v-radio-group
              v-model="espTypeSelected"
              inline
              class="ml-3 pt-0 pa-0"
              @update:model-value="selectedESPType(espTypeSelected)"
            >
              <v-radio label="Single Employer Plan" value="Single Employer Plan" color="accent" />
              <v-radio label="Pooled Employer Plan (PEP)" value="Pooled Employer Plan (PEP)" color="accent" />
            </v-radio-group>
          </v-col>
          <div class="pt-1 stepers_div">
            <v-stepper v-model="el" vertical class="elevation-0 background_transparent">
              <v-stepper-step
                id="step1"
                v-ripple="false"
                step="1"
                :color="step1Error ? 'error' : 'accent'"
                :class="step1Error ? 'stepred' : ''"
              >
                <v-container class="ma-0 pa-0 pl-6">
                  <div>
                    <v-row>
                      <div class="text-center align-self flex_none">
                        <v-icon color="accent"> mdi-numeric-1-circle-outline </v-icon>
                      </div>
                      <div class="text-left align-self mr-4 flex_none pt-0 pb-0 pl-1">
                        <h2 :class="step1Error ? 'text-error' : 'text-accent'">
                          {{ type1 }}
                        </h2>
                      </div>
                      <div v-if="presenterEdit && !loadAll" class="pa-0">
                        <v-btn class="mr-1" size="small" :color="theme.dark ? '' : 'accent'" @click="toggleStepper('1')">
                          {{
                            reports === 'Diagnostic'
                              ? 'Edit Presenter'
                              : reports === 'RPEA'
                                ? 'Edit Plan Info & Presenter'
                                : 'Edit Plan Information'
                          }}
                        </v-btn>
                        <v-btn
                          v-if="showRpea && reports === 'Proposal'"
                          :color="theme.dark ? '' : 'accent'"
                          size="small"
                          :disabled="rpeaLoading"
                          class="text-capitalize"
                          :loading="rpeaLoading"
                          @click="loadRPEAInformation()"
                        >
                          Load from Comparison
                          <v-icon class="pl-2" size="16"> mdi-plus-circle </v-icon>
                          <template #rpeaLoading>
                            <span class="custom-loader">
                              <v-icon light>cached</v-icon>
                            </span>
                          </template>
                        </v-btn>
                      </div>
                    </v-row>
                  </div>
                </v-container>
              </v-stepper-step>
              <v-stepper-content>
                <div v-if="presenterEdit" class="alignStepper pl-4 mt-2">
                  <!-- For RPEA / Proposal Presenter After Save -->
                  <div v-if="reports === 'RPEA' || reports === 'Proposal'">
                    <h2 v-if="reports === 'RPEA'">Plan Information</h2>
                    <!-- For Proposal Presenter After Save -->
                    <v-col v-if="reports === 'Proposal'" class="pa-0">
                      <h3>Plan Information from the latest FORM 5500</h3>
                      <v-col class="text-left pt-2 pa-0" cols="10" xs="8" xl="10" lg="10">
                        <h4>Company Name</h4>
                      </v-col>
                      <v-col class="text-left pt-1 pa-0" cols="10" xs="10" xl="10" lg="10">
                        <h3>{{ companyName }}</h3>
                      </v-col>
                      <v-col class="text-left pt-2 pa-0" cols="10" xs="8" xl="10" lg="10">
                        <h4>Plan Name</h4>
                      </v-col>
                      <v-col class="text-left pt-1 pa-0" cols="10" xs="10" xl="10" lg="10">
                        <h3>{{ planName }}</h3>
                      </v-col>
                      <v-row class="pt-2">
                        <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                          <h4>Plan Type</h4>
                        </v-col>
                        <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                          <h4>Federal ID#</h4>
                        </v-col>
                      </v-row>
                      <v-row class="pt-1">
                        <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                          <h3>{{ planType }}</h3>
                        </v-col>
                        <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                          <h3>{{ federalID }}</h3>
                        </v-col>
                      </v-row>
                      <v-row class="pt-2">
                        <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                          <h4>Address</h4>
                        </v-col>
                        <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                          <h4>City,State and Zip</h4>
                        </v-col>
                      </v-row>
                      <v-row class="pt-1">
                        <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                          <h3>{{ address }}</h3>
                        </v-col>
                        <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                          <h3>{{ city }}</h3>
                        </v-col>
                      </v-row>
                    </v-col>
                    <!-- for both  -->
                    <v-row class="pt-2">
                      <v-col v-if="planId > 0" class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h4>Total Asset</h4>
                      </v-col>
                      <v-col v-else class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h4>Estimated 1st Year Contribution</h4>
                      </v-col>
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h4>As of Date</h4>
                      </v-col>
                    </v-row>
                    <v-row class="pt-1">
                      <v-col v-if="planId > 0" class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h3>
                          {{ reports === 'RPEA' ? totalAsset : formatPrice(totalAsset, 2) }}
                        </h3>
                      </v-col>
                      <v-col v-else class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h3>
                          {{ reports === 'RPEA' ? estimatedAnnualContributions : formatPrice(estimatedAnnualContributions, 2) }}
                        </h3>
                      </v-col>
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h3>{{ asOfdate }}</h3>
                      </v-col>
                    </v-row>
                    <v-row class="pt-2">
                      <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h4>Participants with a Balance</h4>
                      </v-col>
                      <v-col v-if="reports != 'Proposal'" class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h4>As of Date</h4>
                      </v-col>
                      <v-col v-else-if="planId > 0" class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h4>Estimated 1st Year Contribution</h4>
                      </v-col>
                    </v-row>
                    <v-row class="pt-1 pb-2">
                      <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h3>{{ balanceParticipants }}</h3>
                      </v-col>
                      <v-col v-if="reports != 'Proposal'" class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h3>{{ partAsOfDate }}</h3>
                      </v-col>
                      <v-col v-else-if="planId > 0" class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h3>
                          {{ formatPrice(estimatedAnnualContributions != null ? estimatedAnnualContributions : 0, 2) }}
                        </h3>
                      </v-col>
                    </v-row>
                    <v-row v-if="reports === 'Proposal'">
                      <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h4>Company Stock</h4>
                        <h3 class="pt-1 pb-2">
                          {{ formatPrice(companyStock ? companyStock : 0, 2) }}
                        </h3>
                      </v-col>
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h4>Outside Assets</h4>
                        <h3 class="pt-1 pb-2">
                          {{ formatPrice(outsideAsset ? outsideAsset : 0, 2) }}
                        </h3>
                      </v-col>
                      <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h4>Self Directed Brokerage</h4>
                        <h3 class="pt-1 pb-2">
                          {{ formatPrice(selfDirectedBrokrage ? selfDirectedBrokrage : 0, 2) }}
                        </h3>
                      </v-col>
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5" xs="5">
                        <h4>Plan Year End</h4>
                        <h3 class="pt-1 pb-2">
                          {{ planYearEnd }}
                        </h3>
                      </v-col>
                    </v-row>
                    <v-row v-if="reports === 'RPEA'">
                      <v-col class="text-left pa-0" cols="7" xs="7" xl="5" lg="5">
                        <h4>Plan Year End</h4>
                        <h3 class="pt-1 pb-2">
                          {{ planYearEnd }}
                        </h3>
                      </v-col>
                    </v-row>
                    <!-- -------------------------------------------------------------------------- -->
                    <v-col v-if="reports === 'RPEA'" class="pt-2 pb-2">
                      <v-divider :class="display.smAndDown.value ? 'hr_border_mobile bold' : 'hr_border_plan bold'" />
                    </v-col>
                    <!-- For Rpea Presenter After Save -->
                  </div>
                  <div v-if="reports === 'Diagnostic'">
                    <h4>Current Presenter</h4>
                    <v-col class="text-left pa-0" cols="10" xs="8" xl="10" lg="10">
                      <h3>
                        {{ currentPresenterName ? currentPresenterName : currentUser }}
                      </h3>
                    </v-col>
                  </div>
                  <div v-if="reports === 'RPEA'">
                    <h2 class="pt-2">Presenter</h2>
                    <v-col v-if="reports === 'RPEA'" class="text-left pa-0" cols="10" xs="8" xl="10" lg="10">
                      <h4>Current Presenter</h4>
                    </v-col>
                    <v-col class="text-left pa-0" cols="10" xs="8" xl="10" lg="10">
                      <h3>{{ currentPresenterName }}</h3>
                    </v-col>
                  </div>
                </div>
                <div v-if="!presenterEdit && presenterStart && !loadAll" class="alignGreyStepper">
                  <v-btn class="mr-1" size="small" :color="theme.dark ? '' : 'accent'" @click="toggleStepper('1')">
                    {{
                      reports === 'Diagnostic'
                        ? 'Add Presenter'
                        : reports === 'RPEA'
                          ? 'Add Plan Info & Presenter'
                          : 'Add Plan Information'
                    }}
                  </v-btn>
                </div>
                <v-dialog
                  v-model="showFirstStepper"
                  persistent
                  class="elevation-3"
                  scrollable
                  :eager="true"
                  :max-width="dialogWidth"
                >
                  <v-card>
                    <v-card-title :class="theme.dark ? '' : 'bg-accent secondary--text'">
                      <v-col v-if="!presenterEdit && presenterStart">
                        <h3>
                          {{
                            reports === 'Diagnostic'
                              ? 'Add Presenter'
                              : reports === 'RPEA'
                                ? 'Add Plan Information and Presenter'
                                : 'Add Plan Information'
                          }}
                        </h3>
                      </v-col>
                      <v-col v-else>
                        <h3>
                          {{
                            reports === 'Diagnostic'
                              ? 'Edit Presenter'
                              : reports === 'RPEA'
                                ? 'Edit Plan Information and Presenter'
                                : 'Edit Plan Information'
                          }}
                        </h3>
                      </v-col>
                    </v-card-title>
                    <v-divider class="bold" />
                    <v-card-text class="pt-5 pb-5 card_text_height" :class="display.xs.value ? 'pl-2 pr-2' : ''">
                      <div v-if="reports !== 'Proposal'">
                        <PresenterInformation
                          ref="presenter"
                          :key="refreshComponent"
                          :selected-plan="selectedPlan"
                          :presenter-edit="PresenterMode"
                          :parent-reset="parentReset"
                          :reports="reports"
                          :plan-id="planId"
                          :proposal-plan="proposalPlan"
                          @clear-start-edit="clearPresenterStartEdit()"
                        />
                      </div>
                      <div v-if="reports === 'Proposal'">
                        <PlanProposalInformation
                          ref="planInformation"
                          :save-plan-info-method="savePlanInfo"
                          :key="refreshComponent"
                          :proposal-plan-info="proposalPlan"
                          :selected-plan="selectedPlan"
                          :plan-id="planId"
                          @proposal-plan-info-edit="proposalPlanMode"
                        />
                      </div>
                    </v-card-text>
                    <v-divider class="bold" />
                    <v-card-actions class="pl-6 pt-3 pb-3">
                      <v-btn
                        :class="theme.dark ? '' : 'bg-accent'"
                        :disabled="saveLoading"
                        :loading="saveLoading"
                        @click="saveStepper('1')"
                      >
                        Save And Close
                        <template #saveLoading>
                          <span class="custom-loader">
                            <v-icon light>cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
                      <v-btn :color="theme.dark ? '' : 'accent'" variant="outlined" @click="cancelChanges('1')">
                        Cancel, Don't Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-stepper-content>
              <v-stepper-step
                id="step2"
                step="2"
                color="accent"
                class="text-green"
                :class="reports === 'Diagnostic' ? (hideProvider ? 'disableProposalStepper' : '') : ''"
                @click="callCurrentInvestment('loaded')"
              >
                <v-container class="pa-0 ma-0 pl-6">
                  <v-row>
                    <div class="text-center align-self flex_none">
                      <v-icon color="accent"> mdi-numeric-2-circle-outline </v-icon>
                    </div>
                    <div class="text-left align-self mr-4 flex_none pl-1">
                      <h2 :class="step2Error ? 'text-error' : 'text-accent'">
                        {{ type2 }}
                      </h2>
                    </div>
                    <div v-if="providerEdit && !loadAll && !hideProvider">
                      <v-btn class="mr-1" size="small" color="accent" @click="toggleStepper('2')">
                        {{ reports === 'Diagnostic' || reports === 'RPEA' ? 'Edit Current Investments' : 'Edit Presenter' }}
                      </v-btn>
                    </div>
                  </v-row>
                </v-container>
              </v-stepper-step>
              <v-stepper-content>
                <div v-if="providerEdit && reports !== 'Proposal'" class="alignStepper pl-4">
                  <div class="text-left mr-2 pt-2">
                    <v-data-table
                      density="compact"
                      :headers="investmentHeader"
                      :items="investmentList"
                      item-key="ID"
                      :sort-by="investmentPagination.sortBy"
                      hide-default-footer
                      sortable
                      :disable-pagination="true"
                      class="elevation-0 fixHeader"
                      :fixed-header="true"
                      style="backface-visibility: hidden"
                      :mobile-breakpoint="0"
                    >
                      <template #item="{ item }">
                        <tr>
                          <td class="text-left pa-2">
                            {{ item.Ticker }}
                          </td>
                          <td class="text-left pa-2">
                            {{ item.Name }}
                          </td>
                          <td class="text-right pa-2">{{ formatPercent(item.mgmt) }}%</td>
                          <td class="text-right pa-2">{{ formatPercent(item.tload) }}%</td>
                          <td class="text-right pa-2">{{ formatPercent(item.SubTA) }}%</td>
                          <td class="text-right pa-2">{{ formatPercent(item.expratio) }}%</td>
                          <td class="text-right pa-2">{{ formatPercent(item.AMC) }}%</td>
                          <td class="text-right pa-2">{{ formatPercent(item.SSF) }}%</td>
                          <td class="text-right pa-2">{{ parseFloat(item.Total).toFixed(2) }}%</td>
                        </tr>
                      </template>
                      <template v-slot:body.append>
                        <tr v-if="investmentList && investmentList.length > 0">
                          <td />
                          <td class="text-left pa-2">
                            <strong>Total Funds: {{ investmentList.length }}</strong>
                          </td>
                          <td class="text-right pa-2">
                            <strong v-if="investmentList.length > 0">{{ totalNewMgmt }}%</strong>
                          </td>
                          <td class="text-right pa-2">
                            <strong v-if="investmentList.length > 0">{{ totalNewLoad }}%</strong>
                          </td>
                          <td class="text-right pa-2">
                            <strong v-if="investmentList.length > 0">{{ totalNewSubta }}%</strong>
                          </td>
                          <td class="text-right pa-2">
                            <strong v-if="investmentList.length > 0">{{ totalNewExpratio }}%</strong>
                          </td>
                          <td class="text-right pa-2">
                            <strong v-if="investmentList.length > 0">{{ totalNewAMC }}%</strong>
                          </td>
                          <td class="text-right pa-2">
                            <strong v-if="investmentList.length > 0">{{ totalNewSSF }}%</strong>
                          </td>
                          <td class="text-right pa-2">
                            <strong v-if="investmentList.length > 0">{{ totalNewFees }}%</strong>
                          </td>
                        </tr>
                      </template>
                      <template #bottom></template>
                    </v-data-table>
                  </div>
                </div>
                <div v-if="providerEdit && reports === 'Proposal'" class="alignStepper pl-4">
                  <v-col class="text-left pa-0" cols="12" xl="10" lg="10" xs="12">
                    <div class="text-left pt-2">
                      <h4>Current Presenter</h4>
                    </div>
                    <div class="text-left pt-1">
                      <h3>
                        {{ currentPresenterName ? currentPresenterName : currentUser }}
                      </h3>
                    </div>
                    <v-row class="pt-2">
                      <v-col class="text-left pa-0" cols="6">
                        <h4>Presentation Date</h4>
                      </v-col>
                      <v-col class="text-left pa-0" cols="5">
                        <h4>Anticipated Close Date</h4>
                      </v-col>
                    </v-row>
                    <v-row class="pt-1">
                      <v-col class="text-left pa-0" cols="6">
                        <h3>{{ presentationDate }}</h3>
                      </v-col>
                      <v-col class="text-left pa-0" cols="5">
                        <h3>{{ anticipatedDate }}</h3>
                      </v-col>
                    </v-row>
                    <v-col class="text-left pt-2 pa-0" cols="7" xl="10" lg="10" xs="7">
                      <h4>Administrator</h4>
                    </v-col>
                    <v-col class="text-left pt-1 pa-0" cols="5" xs="5" xl="10" lg="10">
                      <h3>{{ administrator }}</h3>
                    </v-col>
                  </v-col>
                </div>
                <v-col
                  v-if="!providerEdit && providerStart && !loadAll"
                  class="alignGreyStepper pa-0"
                  :class="[theme.dark ? 'text-white' : 'text-accent']"
                  cols="4"
                  xs="4"
                  xl="12"
                >
                  <v-btn
                    class="mr-1"
                    size="small"
                    :disabled="hideProvider"
                    :color="theme.dark ? '' : 'accent'"
                    @click="toggleStepper('2')"
                  >
                    {{ reports === 'Diagnostic' || reports === 'RPEA' ? 'Add Investments' : 'Add Presenter' }}
                  </v-btn>
                </v-col>
                <v-dialog
                  v-model="showSecondStepper"
                  persistent
                  class="elevation-3"
                  scrollable
                  :eager="true"
                  :max-width="dialogWidth"
                >
                  <v-card>
                    <v-card-title :class="theme.dark ? '' : 'bg-accent secondary--text'">
                      <v-col v-if="!providerEdit && providerStart">
                        <h3>
                          {{ reports === 'Diagnostic' || reports === 'RPEA' ? 'Add Current Investments' : 'Add Presenter' }}
                        </h3>
                      </v-col>
                      <v-col v-else>
                        <h3>
                          {{ reports === 'Diagnostic' || reports === 'RPEA' ? 'Edit Current Investments' : 'Edit Presenter' }}
                        </h3>
                      </v-col>
                    </v-card-title>
                    <v-divider class="bold" />
                    <v-card-text class="pt-5 pb-5 card_text_height">
                      <div v-if="reports !== 'Proposal'" :class="display.smAndDown.value ? 'pl-0' : 'pl-2'">
                        <h2 class="font-weight-medium">Investment Selection</h2>
                        <v-radio-group
                          v-if="
                            !$authz.allowedByProgram(
                              $authz.programPermissionSet.PCS_Aspire_Product__c,
                              $authz.pcsAspireProduct.Multi_Strategist_Product
                            )
                          "
                          v-model="investmentType"
                          inline
                          hide-details
                          @update:model-value="investmentTypeSelected()"
                        >
                          <v-radio color="accent" value="Add Plan Investments to Lineup" class="customStyle">
                            <template #label>
                              <div>
                                <div>Add Plan Investments to Lineup</div>
                                <div class="text-caption">Search and select investments you'd like to add to the proposal</div>
                              </div>
                            </template>
                          </v-radio>
                          <v-radio color="accent" value="Add Investments from Other Providers" class="customStyle">
                            <template #label>
                              <div>
                                <div>Add Investments from Other Providers</div>
                                <div class="text-caption">Select provider to add common investments used by the provider</div>
                              </div>
                            </template>
                          </v-radio>
                        </v-radio-group>
                        <ProviderInformation
                          ref="Provider"
                          :key="refreshComponent"
                          :plan-id="planId"
                          :available-investment="availableInvestment"
                          @assign-provider="assignProvider"
                        />
                      </div>
                      <div v-if="reports !== 'Proposal'">
                        <InvestmentInformation
                          ref="Investment"
                          :key="refreshComponent"
                          :plan-id="planId"
                          :reports="reports"
                          :available-investment="availableInvestment"
                          :provider="providerName"
                          @investment-details="investmentMode"
                          @diagnostic-implict-cost="diagnosticReport"
                          @reset-validation="resetStepperValidation"
                          @selected-current-investment="selectedCurrentInvestment"
                          @selected-investment-list="selectedInvestmentList"
                        />
                      </div>
                      <div v-if="reports === 'Proposal'">
                        <PresenterInformation
                          ref="presenter"
                          :key="refreshComponent"
                          :selected-plan="selectedPlan"
                          :presenter-edit="PresenterMode"
                          :save-proposal-presenter-method="savePresenterData"
                          :parent-reset="parentReset"
                          :reports="reports"
                          :plan-id="planId"
                          :proposal-plan="proposalPlan"
                          :esp-type="espTypeSelected"
                        />
                      </div>
                    </v-card-text>
                    <v-divider class="bold" />
                    <v-card-actions class="pl-6 pt-3 pb-3">
                      <v-btn
                        :class="theme.dark ? '' : 'bg-accent'"
                        :loading="saveLoading"
                        :disabled="saveLoading"
                        @click="
                          reports !== 'Proposal'
                            ? showInvestmentLineup
                              ? saveStepper('2')
                              : addToAdditionalList()
                            : saveStepper('2')
                        "
                      >
                        {{
                          reports === 'Proposal' ? 'Save And Close' : showInvestmentLineup ? 'Save And Close' : 'Add Investment'
                        }}
                        <template #saveLoading>
                          <span class="custom-loader">
                            <v-icon light>cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
                      <v-btn :color="theme.dark ? '' : 'accent'" variant="outlined" @click="cancelChanges('2')">
                        Cancel, Don't Save
                      </v-btn>
                      <v-spacer />
                      <h3 v-if="!showInvestmentLineup && reports !== 'Proposal' && !display.xs.value" class="font-weight-medium">
                        {{
                          `${
                            currentInvestmentSelected && currentInvestmentSelected.length > 0
                              ? currentInvestmentSelected.length
                              : 0
                          } Investments Selected`
                        }}
                      </h3>
                      <h3 v-if="showInvestmentLineup && reports !== 'Proposal' && !display.xs.value" class="font-weight-medium">
                        {{ `${investmentSelected ? investmentSelected : 0} Investments Selected` }}
                      </h3>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-stepper-content>
              <v-stepper-step
                v-if="reports !== 'Diagnostic'"
                id="step3"
                step="3"
                color="accent"
                class="text-green"
                :class="[step3Error ? 'stepred' : '', hideInvestmentStart ? 'disableProposalStepper' : '']"
                @click="reports === 'Diagnostic' ? callCurrentInvestment('loaded') : ''"
              >
                <v-container class="pa-0 ma-0 pl-6">
                  <v-row>
                    <div class="text-center align-self flex_none">
                      <v-icon color="accent"> mdi-numeric-3-circle-outline </v-icon>
                    </div>
                    <div class="text-left align-self mr-4 flex_none pl-1">
                      <h2 :class="step3Error ? 'error--text' : theme.dark ? 'text-white' : 'text-accent'">
                        {{ type3 }}
                      </h2>
                    </div>
                    <div v-if="investmentEdit && !loadAll && !hideInvestmentStart">
                      <v-btn class="mr-1" size="small" :color="theme.dark ? '' : 'accent'" @click="toggleStepper('3')">
                        {{ reports === 'RPEA' ? 'Edit Service Provider Fees' : 'Edit Proposed Investments' }}
                      </v-btn>
                    </div>
                  </v-row>
                </v-container>
              </v-stepper-step>
              <v-stepper-content>
                <div v-if="investmentEdit && reports === 'Proposal' && !hideInvestmentStart" class="alignStepper pl-4">
                  <v-col
                    v-if="
                      !$authz.allowedByProgram(
                        $authz.programPermissionSet.PCS_Aspire_Product__c,
                        $authz.pcsAspireProduct.Multi_Strategist_Product
                      )
                    "
                    class="text-left pa-0"
                    cols="10"
                    xl="10"
                    lg="10"
                  >
                    <v-col class="text-left pa-0" cols="8" xl="10" lg="10">
                      <h4 v-show="reports === 'Proposal'">Models Saved</h4>
                    </v-col>
                    <v-col class="text-left pa-0" cols="8" xl="10" lg="10">
                      <h3>{{ investmentCount }}</h3>
                    </v-col>
                  </v-col>
                  <v-col v-show="reports === 'Proposal'" class="text-left pa-0" cols="11" xl="10" lg="10">
                    <v-col
                      v-if="
                        !$authz.allowedByProgram(
                          $authz.programPermissionSet.PCS_Aspire_Product__c,
                          $authz.pcsAspireProduct.Multi_Strategist_Product
                        )
                      "
                      class="pa-0"
                    >
                      <v-col class="text-left pa-0" cols="10" xl="10" lg="10">
                        <h4>Supplemental Funds Saved</h4>
                      </v-col>
                      <v-col class="text-left pa-0" cols="8" xl="10" lg="10">
                        <h3>{{ investmentCount2 }}</h3>
                      </v-col>
                    </v-col>
                    <div
                      v-if="
                        $authz.allowedByProgram(
                          $authz.programPermissionSet.PCS_Aspire_Product__c,
                          $authz.pcsAspireProduct.Multi_Strategist_Product
                        )
                      "
                    >
                      <div class="text-left mr-2 pt-2">
                        <h2>Strategist</h2>
                        <v-data-table
                          density="compact"
                          :headers="startegistHeadersList"
                          :items="mmlStrategist"
                          item-key="Strategist"
                          hide-default-footer
                          sortable
                          :disable-pagination="true"
                          class="elevation-0 fixHeader"
                          :fixed-header="true"
                          style="backface-visibility: hidden"
                          :mobile-breakpoint="0"
                        >
                          <template #item="{ item }">
                            <tr>
                              <td class="text-left pa-2">
                                {{ item.Strategist }}
                              </td>
                              <td class="text-left pa-2">
                                {{ item.UnderlyingHoldings }}
                              </td>
                              <td class="text-right pa-2">{{ item.AverageExpRatio ? item.AverageExpRatio.toFixed(2) : 0 }}%</td>
                              <td class="text-right pa-2">
                                {{ item.ModelCount }}
                              </td>
                            </tr>
                          </template>
                          <template #bottom></template>
                        </v-data-table>
                      </div>
                      <div
                        v-if="
                          !(
                            (selectedPlan.DCPTYPE === $authz.planType.Defined_Benefit_Plan ||
                              selectedPlan.DCPTYPE === $authz.planType.Cash_Balance_Plan) &&
                            $store.state.user.selectedProgram.programName === $authz.managedPlan.PA
                          )
                        "
                        class="text-left mr-2 pt-2"
                        cols="12"
                      >
                        <h2>Investment Lineup</h2>
                        <div>
                          <v-data-table
                            density="compact"
                            :headers="investmentLineUpTableHeader"
                            :items="mmlInvestment"
                            item-key="Ticker"
                            hide-default-footer
                            sortable
                            :disable-pagination="true"
                            class="elevation-0 fixHeader"
                            :fixed-header="true"
                            style="backface-visibility: hidden"
                            :mobile-breakpoint="0"
                          >
                            <template #bottom></template>
                            <template #item="{ item }">
                              <tr>
                                <td class="text-left pa-2">
                                  {{ item.Type }}
                                </td>
                                <td class="text-left pa-2">
                                  {{ item.Ticker }}
                                </td>
                                <td class="text-left pa-2">
                                  {{ item.Name }}
                                </td>
                                <td class="text-right pa-2">{{ formatPercent(item.mgmt) }}%</td>
                                <td class="text-right pa-2">{{ formatPercent(item.tload) }}%</td>
                                <td class="text-right pa-2">{{ formatPercent(item.SubTA) }}%</td>
                                <td class="text-right pa-2">{{ formatPercent(item.expratio) }}%</td>
                              </tr>
                            </template>
                            <template v-slot:body.append>
                              <tr>
                                <td />
                                <td colspan="6" class="text-left pa-1">
                                  <strong>Total Funds: {{ mmlInvestment.length }}</strong>
                                </td>
                              </tr>
                            </template>
                          </v-data-table>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </div>
                <div v-if="investmentEdit && reports === 'RPEA'" class="alignStepper pl-4">
                  <v-col class="text-left pa-0" cols="12" xl="10" lg="10">
                    <v-row>
                      <v-col class="text-left pa-0" cols="11" xl="5" lg="5" sm="11">
                        <h4 class="mb-2">Current Fees</h4>
                        <v-data-table
                          density="compact"
                          :headers="providerCurrentFeeHeaders"
                          :items="providerCurrentFeeList"
                          item-key="name"
                          hide-default-footer
                          sortable
                          :disable-pagination="true"
                          class="elevation-0 fixHeader"
                          :fixed-header="true"
                          style="backface-visibility: hidden"
                          :mobile-breakpoint="0"
                        />
                      </v-col>
                      <v-col
                        class="text-left pa-0"
                        cols="11"
                        xl="5"
                        lg="5"
                        sm="11"
                        :class="display.smAndDown.value ? 'mt-2' : ' ml-4'"
                      >
                        <h4 class="mb-2">Proposed Fees</h4>
                        <v-data-table
                          density="compact"
                          :headers="providerScheduleHeaders"
                          :items="providerScheduleList"
                          item-key="name"
                          hide-default-footer
                          sortable
                          :disable-pagination="true"
                          class="elevation-0 fixHeader"
                          :fixed-header="true"
                          style="backface-visibility: hidden"
                          :mobile-breakpoint="0"
                        >
                          <template #bottom></template>
                          <template #item="{ item }">
                            <tr>
                              <td class="text-left pa-2">
                                {{ item.name && item.name === 'Enter Fees Manually' ? 'Manual Entry' : item.name }}
                              </td>
                              <td class="text-right pa-2">
                                {{ formatPrice(item.fees, 2) }}
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-col>
                </div>
                <v-col
                  v-if="!investmentEdit && investmentStart && !loadAll && reports !== 'Diagnostic'"
                  class="alignGreyStepper pa-0"
                  :class="theme.dark ? 'text-white' : 'text-accent'"
                  cols="4"
                  xl="12"
                >
                  <v-btn
                    class="mr-1"
                    size="small"
                    :disabled="hideInvestmentStart"
                    :color="theme.dark ? '' : 'accent'"
                    @click="toggleStepper('3')"
                  >
                    {{ reports === 'RPEA' ? 'Add Service Provider Fees' : 'Add Investments' }}
                  </v-btn>
                </v-col>
                <v-dialog
                  v-model="showThirdStepper"
                  persistent
                  class="elevation-3"
                  scrollable
                  :eager="true"
                  :max-width="reports === 'RPEA' ? '95%' : dialogWidth"
                >
                  <v-card>
                    <v-card-title :class="theme.dark ? '' : 'bg-accent secondary--text'">
                      <v-col v-if="!investmentEdit && investmentStart">
                        <h3>
                          {{
                            reports === 'Diagnostic'
                              ? 'Add Presenter'
                              : reports === 'RPEA'
                                ? 'Add Service Provider Fee'
                                : 'Add Proposed Investments'
                          }}
                        </h3>
                      </v-col>
                      <v-col v-else>
                        <h3>
                          {{
                            reports === 'Diagnostic'
                              ? 'Edit Presenter'
                              : reports === 'RPEA'
                                ? 'Edit Service Provider Fee'
                                : 'Edit Proposed Investments'
                          }}
                        </h3>
                      </v-col>
                    </v-card-title>
                    <v-divider class="bold" />
                    <v-card-text class="pt-5 pb-5 pl-3 pr-1 card_text_height">
                      <div v-if="reports === 'RPEA'">
                        <ServiceProvider
                          ref="ServiceProvider"
                          :key="refreshServiceComponent"
                          :plan-id="planId"
                          :SEINPNO="selectedPlan.SEINPNO"
                          :selected-plan="selectedPlan"
                          @rpeaprovider="ServiceProviderMode"
                        />
                      </div>
                      <div v-if="reports === 'Proposal'">
                        <div
                          v-if="
                            !$authz.allowedByProgram(
                              $authz.programPermissionSet.PCS_Aspire_Product__c,
                              $authz.pcsAspireProduct.Multi_Strategist_Product
                            )
                          "
                        >
                          <ProposalModelFundList
                            ref="proposalInvestment"
                            :seinpno="selectedPlan.SEINPNO"
                            :reports="'Proposal'"
                            :key="refreshComponent"
                            :proposal-plan-id="checkProposalData ? proposalPlan.PlanID : 0"
                            :plan-i-d="Number(planId)"
                            :get-model-id="getModelId"
                            :proposal-plan="proposalPlan"
                            @modelfund-details="proposalModelfundMode"
                            @selected-model-list="selectedModelList"
                            @selected-fund-list="selectedFundList"
                          />
                        </div>
                        <div
                          v-if="
                            $authz.allowedByProgram(
                              $authz.programPermissionSet.PCS_Aspire_Product__c,
                              $authz.pcsAspireProduct.Multi_Strategist_Product
                            )
                          "
                        >
                          <ProposedInvestments
                            ref="modelFund"
                            :plan-i-d="planId"
                            :reports="reports"
                            :seinpno="selectedPlan.SEINPNO"
                            :key="refreshComponent"
                            :plan-type="selectedPlan.DCPTYPE"
                            :strategist="selectedPlan.Strategist"
                            @modelfund-details="strategistMode"
                            @selected-model-list="selectedModelList"
                            @selected-fund-list="selectedFundList"
                          />
                        </div>
                      </div>
                    </v-card-text>
                    <v-divider class="bold" />
                    <v-card-actions class="pl-6 pt-3 pb-3">
                      <v-btn
                        :class="theme.dark ? '' : 'bg-accent'"
                        :loading="saveLoading"
                        :disabled="saveLoading"
                        @click="saveStepper('3')"
                      >
                        Save And Close
                        <template #saveLoading>
                          <span class="custom-loader">
                            <v-icon light>cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
                      <v-btn :color="theme.dark ? '' : 'accent'" variant="outlined" @click="cancelChanges('3')">
                        Cancel, Don't Save
                      </v-btn>
                      <v-spacer />
                      <h3 v-if="reports === 'Proposal' && !display.xs.value" class="font-weight-medium">
                        {{ `${parseInt(proposedModelSelected) + parseInt(proposedFundSelected)} Investments Selected` }}
                      </h3>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-stepper-content>
              <v-stepper-step
                v-show="reports !== 'Diagnostic'"
                id="step4"
                step="4"
                color="accent"
                class="text-green"
                :class="[hidePlanFeeStart ? 'disableProposalStepper' : '', step4Error ? 'stepred' : '']"
              >
                <v-container class="pa-0 ma-0 pl-6">
                  <v-row>
                    <div class="text-center align-self flex_none">
                      <v-icon color="accent"> mdi-numeric-4-circle-outline </v-icon>
                    </div>
                    <div class="text-left align-self mr-4 flex_none pl-1">
                      <h2 :class="step4Error ? 'error--text' : theme.dark ? 'text-white' : 'text-accent'">
                        {{ type4 }}
                      </h2>
                    </div>
                    <div v-if="modelfundEdit && !loadAll && !hidePlanFeeStart">
                      <v-btn class="mr-1" size="small" :color="theme.dark ? '' : 'accent'" @click="toggleStepper('4')">
                        {{ reports === 'RPEA' ? 'Edit Proposed Investments' : 'Edit Plan Fees' }}
                      </v-btn>
                    </div>
                  </v-row>
                </v-container>
              </v-stepper-step>
              <v-stepper-content>
                <div v-show="modelfundEdit && reports === 'Proposal' && !hidePlanFeeStart" class="alignStepper pl-4">
                  <v-col class="text-left mr-2 pa-0" cols="12" xl="10" lg="10">
                    <h2>Estimated Cost</h2>
                    <v-data-table
                      density="compact"
                      :headers="feeHeaders"
                      :items="feeList"
                      item-key="name"
                      class="elevation-0 fixHeader"
                      :mobile-breakpoint="0"
                    >
                      <template #item="{ item }">
                        <tr>
                          <td class="text-left pa-2">
                            {{ item.name }}
                          </td>
                          <td class="text-right pa-2">
                            {{ formatPrice(item.cost1, 2) }}
                          </td>
                          <td class="text-right pa-2">{{ item.cost2 }}%</td>
                        </tr>
                      </template>
                      <template #bottom></template>
                    </v-data-table>
                  </v-col>
                </div>
                <div v-if="modelfundEdit && reports === 'RPEA'" class="pl-4 alignStepper">
                  <v-col
                    v-if="
                      !$authz.allowedByProgram(
                        $authz.programPermissionSet.PCS_Aspire_Product__c,
                        $authz.pcsAspireProduct.Multi_Strategist_Product
                      )
                    "
                    class="text-left pa-0"
                    cols="10"
                    xl="10"
                    lg="10"
                  >
                    <v-row class="pt-2">
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5">
                        <h4>Model Saved</h4>
                      </v-col>
                    </v-row>
                    <v-row class="pt-1">
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5">
                        <h3>{{ modelCount }}</h3>
                      </v-col>
                    </v-row>
                    <v-row class="pt-2">
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5">
                        <h4>Investment List Saved</h4>
                      </v-col>
                    </v-row>
                    <v-row class="pt-1">
                      <v-col class="text-left pa-0" cols="5" xl="5" lg="5">
                        <h3>{{ fundCount }}</h3>
                      </v-col>
                    </v-row>
                  </v-col>
                  <div
                    v-if="
                      $authz.allowedByProgram(
                        $authz.programPermissionSet.PCS_Aspire_Product__c,
                        $authz.pcsAspireProduct.Multi_Strategist_Product
                      )
                    "
                  >
                    <div class="text-left mr-2 pt-2">
                      <h2>Strategist</h2>
                      <v-data-table
                        density="compact"
                        :headers="startegistHeadersList"
                        :items="mmlStrategist"
                        item-key="Strategist"
                        hide-default-footer
                        sortable
                        class="elevation-0 fixHeader"
                        :fixed-header="true"
                        style="backface-visibility: hidden"
                        :mobile-breakpoint="0"
                        :disable-pagination="true"
                      >
                        <template #item="{ item }">
                          <tr>
                            <td class="text-left pa-2">
                              {{ item.Strategist }}
                            </td>
                            <td class="text-left pa-2">
                              {{ item.UnderlyingHoldings }}
                            </td>
                            <td class="text-right pa-2">{{ item.AverageExpRatio ? item.AverageExpRatio.toFixed(2) : 0 }}%</td>
                            <td class="text-right pa-2">
                              {{ item.ModelCount }}
                            </td>
                          </tr>
                        </template>
                        <template #bottom></template>
                      </v-data-table>
                    </div>
                    <div
                      v-if="
                        !(
                          (selectedPlan.DCPTYPE === $authz.planType.Defined_Benefit_Plan ||
                            selectedPlan.DCPTYPE === $authz.planType.Cash_Balance_Plan) &&
                          $store.state.user.selectedProgram.programName === $authz.managedPlan.PA
                        )
                      "
                      class="text-left mr-2 pt-2"
                    >
                      <h2>Investment Lineup</h2>
                      <div>
                        <v-data-table
                          density="compact"
                          :headers="investmentLineUpTableHeader"
                          :items="mmlInvestment"
                          item-key="Ticker"
                          hide-default-footer
                          sortable
                          class="elevation-0 fixHeader"
                          :disable-pagination="true"
                          :mobile-breakpoint="0"
                          :fixed-header="true"
                          style="backface-visibility: hidden"
                        >
                          <template #item="{ item }">
                            <tr>
                              <td class="text-left pa-2">
                                {{ item.Type }}
                              </td>
                              <td class="text-left pa-2">
                                {{ item.Ticker }}
                              </td>
                              <td class="text-left pa-2">
                                {{ item.Name }}
                              </td>
                              <td class="text-right pa-2">{{ formatPercent(item.mgmt) }}%</td>
                              <td class="text-right pa-2">{{ formatPercent(item.tload) }}%</td>
                              <td class="text-right pa-2">{{ formatPercent(item.SubTA) }}%</td>
                              <td class="text-right pa-2">{{ formatPercent(item.expratio) }}%</td>
                            </tr>
                          </template>
                          <template v-slot:body.append>
                            <tr>
                              <td />
                              <td colspan="6" class="text-left pa-1">
                                <strong>Total Funds: {{ mmlInvestment.length }}</strong>
                              </td>
                            </tr>
                          </template>
                          <template #bottom></template>
                        </v-data-table>
                      </div>
                    </div>
                  </div>
                </div>
                <v-col
                  v-if="!modelfundEdit && modelfundStart && !loadAll && reports !== 'Diagnostic'"
                  class="alignGreyStepper pa-0"
                  :class="theme.dark ? 'text-white' : 'text-accent'"
                  cols="4"
                  xl="12"
                >
                  <v-btn
                    class="mr-1"
                    size="small"
                    :disabled="hidePlanFeeStart"
                    :color="theme.dark ? '' : 'accent'"
                    @click="toggleStepper('4')"
                  >
                    {{ reports === 'RPEA' ? 'Add Proposed Investments' : 'Add Plan Fees' }}
                  </v-btn>
                </v-col>
                <v-dialog
                  v-model="showFourthStepper"
                  persistent
                  class="elevation-3"
                  scrollable
                  :eager="true"
                  :max-width="reports === 'Proposal' ? '95%' : dialogWidth"
                >
                  <v-card>
                    <v-card-title :class="theme.dark ? '' : 'bg-accent text-secondary'">
                      <div v-if="!modelfundEdit && modelfundStart">
                        <h3>
                          {{ reports === 'RPEA' ? 'Add Proposed Investments' : 'Add Plan Fees' }}
                        </h3>
                      </div>
                      <div v-else>
                        <h3>
                          {{ reports === 'RPEA' ? 'Edit Proposed Investments' : 'Edit Plan Fees' }}
                        </h3>
                      </div>
                    </v-card-title>
                    <v-divider class="bold" />
                    <v-card-text class="pt-5 pb-5 card_text_height">
                      <div
                        v-if="
                          reports === 'RPEA' &&
                          !$authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                      >
                        <ModelFundList
                          ref="modelFund"
                          :key="modelfundComponent"
                          :seinpno="selectedPlan.SEINPNO"
                          :plan-i-d="planId"
                          :reports="'RPEA'"
                          @modelfund-details="rpeaModelFundMode"
                          @include-option-selected="reportOptionSelected"
                          @selected-model-list="selectedModelList"
                          @selected-fund-list="selectedFundList"
                          @show-model-count="showModelCountValue"
                        />
                      </div>
                      <div
                        v-if="
                          reports === 'RPEA' &&
                          $authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                        :class="display.xs.value ? 'pl-0' : 'pl-3'"
                      >
                        <ProposedInvestments
                          ref="modelFund"
                          :plan-i-d="planId"
                          :key="modelfundComponent"
                          :reports="reports"
                          :seinpno="selectedPlan.SEINPNO"
                          :plan-type="selectedPlan.DCPTYPE"
                          @modelfund-details="strategistMode"
                          @include-option-selected="mmlReportOption"
                          @selected-model-list="selectedModelList"
                          @selected-fund-list="selectedFundList"
                        />
                      </div>
                      <div v-if="reports === 'Proposal'" :class="display.xs.value ? 'pl-0' : 'pl-3'">
                        <ServiceProviderandPlanFees
                          ref="PlanFees"
                          :key="refreshComponent"
                          :plan-id="planId"
                          :reports="reports"
                          :SEINPNO="selectedPlan.SEINPNO"
                          :selected-plan="selectedPlan"
                          :proposal-plan="proposalPlan"
                          :save-proposal-plan-fees-method="saveProposalPlanFees"
                          :check-standard-pcs="checkStandardPcs"
                          @proposal-plan-fees="proposalPlanFeesMethod"
                        />
                      </div>
                    </v-card-text>
                    <v-divider class="bold" />
                    <v-card-actions class="pl-6 pt-3 pb-3">
                      <v-btn
                        :class="theme.dark ? '' : 'bg-accent'"
                        :loading="saveLoading"
                        :disabled="saveLoading"
                        @click="saveStepper('4')"
                      >
                        Save And Close
                        <template #saveLoading>
                          <span class="custom-loader">
                            <v-icon light>cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
                      <v-btn :color="theme.dark ? '' : 'accent'" variant="outlined" @click="cancelChanges('4')">
                        Cancel, Don't Save
                      </v-btn>
                      <v-spacer />
                      <h3 v-if="reports === 'RPEA' && showModelCount && !display.xs.value" class="font-weight-medium">
                        {{ `${parseInt(proposedModelSelected) + parseInt(proposedFundSelected)} Investments Selected` }}
                      </h3>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-stepper-content>
              <div v-if="reportPermission" :class="display.xs.value ? 'pl-6' : 'pl-6 pr-7'">
                <v-divider class="my-6 bold" />
              </div>
            </v-stepper>
          </div>
        </v-col>
        <v-col
          v-if="reportPermission"
          cols="11"
          xl="11"
          lg="11"
          sm="11"
          md="11"
          class="text-right pa-0"
          :class="display.xs.value ? '' : 'pr-6'"
        >
          <v-row justify="end">
            <v-btn
              :disabled="disableReport"
              size="small"
              :color="theme.dark ? '' : 'accent'"
              class="text-capitalize mr-1"
              @click="getReport('Generate')"
            >
              Generate Report
            </v-btn>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-btn
                  :disabled="disableReport"
                  size="small"
                  v-bind="props"
                  :color="theme.dark ? '' : 'accent'"
                  class="text-capitalize mr-1"
                  @click="getReport('Preview')"
                >
                  Preview Report
                </v-btn>
              </template>
              <span>Running a preview of a report will not affect the status/stage of your prospect.</span>
            </v-tooltip>
          </v-row>
        </v-col>
        <v-dialog
          v-model="reportDialog"
          persistent
          class="elevation-3"
          content-class="elevation-3"
          scrollable
          :max-width="!display.mdAndDown.value ? '380px' : '400px'"
        >
          <v-card v-if="loading">
            <v-card-text class="maxHeight">
              <v-row class="justify-center">
                <div class="advanceFilter pt-5 text-center">
                  <div :class="theme.dark ? 'text-center font_14' : 'text-accent text-center font_14'">
                    <h3>Generating Report...</h3>
                  </div>
                  <div class="pt-2" :class="theme.dark ? 'text-center' : 'text-accent text-center'">
                    <h4>The reports might take up to a minute to load.</h4>
                  </div>
                  <div class="pt-8">
                    <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
                  </div>
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row v-show="reports === 'Activity'" v-if="display.smAndDown.value ? (createReport ? true : false) : true">
        <div v-if="items.length > 1">
          <v-card>
            <h2 class="pt-3 pb-3" :class="display.xs.value ? 'pl-2' : 'pl-4'">Activity</h2>
            <div class="stepers_div">
              <Activity
                :key="refreshComponent"
                ref="activityDiv"
                :seinpno="selectedPlan.SEINPNO"
                :plan-id="planId"
                :esp-type-selected="espTypeSelected"
                :plan-type="planTypeValue"
                @load-activity="loadActivity"
                @activity-action="activityAction"
              />
            </div>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-container>
  <v-dialog v-model="pdfDialog" transition="dialog-bottom-transition" fullscreen>
    <PdfViewer :pdfUrl="pdfUrl" @closePopUpEvent="closePopUpEvent"></PdfViewer>
  </v-dialog>
</template>
<script>
import { ref, watch, computed, getCurrentInstance, inject, onMounted, onUnmounted, onBeforeMount } from 'vue'
import { useRoute, onBeforeRouteLeave, useRouter } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import PresenterInformation from '@/components/TAL/Diagnostics/PresenterInformation'
import ProposedInvestments from '@/components/TAL/RPEA/ProposedInvestments'
import PlanInformation from '@/components/TAL/Diagnostics/TALPlanInformation'
import PlanPerformance from '@/components/TAL/Diagnostics/PlanPerformance'
import ProviderInformation from '@/components/TAL/Diagnostics/ProviderInformation'
import InvestmentInformation from '@/components/TAL/Diagnostics/InvestmentInformation'
import ModelFundList from '@/components/TAL/ModelFundList'
import ServiceProvider from '@/components/TAL/RPEA/ServiceProvider'
import PlanProposalInformation from '@/components/TAL/Proposal/PlanProposalInformation'
import ServiceProviderandPlanFees from '@/components/TAL/Proposal/PlanFees'
import ProposalModelFundList from '@/components/TAL/ModelFundList'
import PlanStar from '@/components/TAL/PlanStar'
import * as XLSX from 'xlsx'
import Activity from '@/components/TAL/Activity'
import moment from 'moment'
import PdfViewer from '@/components/PdfViewer'

export default {
  components: {
    ProposedInvestments,
    PresenterInformation,
    PlanInformation,
    PlanPerformance,
    ProviderInformation,
    InvestmentInformation,
    ModelFundList,
    ServiceProvider,
    PlanProposalInformation,
    ServiceProviderandPlanFees,
    ProposalModelFundList,
    PlanStar,
    Activity,
    PdfViewer
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  setup() {
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const display = useDisplay()
    const $route = useRoute()
    const $router = useRouter()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const toast = inject('toast')
    const investmentType = ref('Add Plan Investments to Lineup')
    const showInvestmentLineup = ref(true)
    const prevRoute = ref('')
    const items = ref([])
    const el = ref(-1)
    const tabList = ref([
      {
        text: 'Diagnostic',
        value: 'Diagnostic'
      },
      {
        text: 'Comparison',
        value: 'RPEA'
      },
      {
        text: 'Proposal',
        value: 'Proposal'
      },
      { text: 'Activity', value: 'Activity' }
    ])
    const reports = ref('Diagnostic')
    const createReport = ref(false)
    const presenterStart = ref(true)
    const presenterEdit = ref(false)
    const currentPresenterName = ref('')
    const providerEdit = ref(false)
    const providerStart = ref(true)
    const providerName = ref('')
    const planId = ref(0)
    const investmentEdit = ref(false)
    const checkProposalData = ref(true)
    const modelFund = ref(null)
    const proposalInvestment = ref(null)
    const presenter = ref(null)
    const PlanFees = ref(null)
    const Provider = ref(null)
    const Investment = ref(null)
    const ServiceProvider = ref(null)
    const planInformation = ref(null)
    const planInformationProgress = ref(null)
    const activityDiv = ref(null)
    const investmentStart = ref(true)
    const modelfundStart = ref(true)
    const modelfundEdit = ref(false)
    const reportName = ref('Diagnostic Report')
    const type1 = ref('Presenter')
    const type2 = ref('Provider')
    const type3 = ref('Investments')
    const type4 = ref('')
    const type5 = ref('')
    const parentReset = ref(false)
    const companyName = ref('')
    const planName = ref('')
    const planType = ref('')
    const federalID = ref('')
    const address = ref('')
    const city = ref('')
    const totalAsset = ref('')
    const estimatedAnnualContributions = ref('')
    const asOfdate = ref('')
    const planYearEnd = ref('')
    const balanceParticipants = ref('')
    const selfDirectedBrokrage = ref(0)
    const outsideAsset = ref(0)
    const companyStock = ref(0)
    const partAsOfDate = ref('')
    const presentationDate = ref('')
    const anticipatedDate = ref('')
    const administrator = ref('')
    const investmentList = ref([])
    const feeHeaders = ref([
      {
        title: 'Fee',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { title: ' Cost', sortable: false, value: 'cost1', align: 'end' },
      { title: ' Cost', sortable: false, value: 'cost2', align: 'end' }
    ])
    const feeList = ref([])
    const providerCurrentFeeHeaders = ref([])
    const providerCurrentFeeList = ref([])
    const providerScheduleHeaders = ref([])
    const providerScheduleList = ref([])
    const modelCount = ref(0)
    const fundCount = ref(0)
    const proposalPlan = ref({
      SNAME: '',
      PNAME: '',
      DCPTYPE: '',
      SEINPNO: '',
      Contact: '',
      SSTREET: '',
      CityStateZip: '',
      TOTASSETS: 0,
      PARTIC: 0,
      YEAREND: new Date().toISOString().slice(0, 10),
      AsOfDate: new Date().toISOString().slice(0, 10),
      ServiceType: 0,
      TPASchedule: 0,
      TPACompany: '',
      TPAContact: '',
      TPAPhone: '',
      TPAEmail: '',
      PresentedBy: '',
      Presentation: null,
      Anticipated: null,
      Status: '',
      Outside: 0,
      OutsideAmount: 0,
      Stock: 0,
      OutsideType: 0,
      StockAmount: 0,
      FeeType: 0,
      ManagerName: '',
      ManagerFee: 0,
      ManagerSchedule: 0,
      AdvisorFeeType: 0,
      AdvisorName: '',
      AdvisorFee: 0,
      AdvisorSchedule: 0,
      Broker: 0,
      Model1: 0,
      Model2: 0,
      Model3: 0,
      Model4: 0,
      Model5: 0,
      Model6: 0,
      AdvisorID: $store.state.user.id,
      Created: new Date().toISOString().slice(0, 10),
      PlanID: 0,
      SafeHarbor: 0,
      ETF: 0,
      WaiveFee1: false,
      WaiveFee2: false,
      AncillaryFee: false,
      ExcludeSummary: false,
      PBSAdvisor: false,
      PBSAdmin: false,
      PBSRecordkeeping: false,
      PBSCustodian: false,
      FiduciaryStatus: '',
      TPAName: '',
      TPARKFee: 0,
      TPARKSchedule: 0,
      TrusteeFee: 0,
      TrusteeSchedule: 0,
      ProviderType: 0,
      ProviderName: '',
      ProviderFee: 0,
      ProviderSchedule: 0,
      ProviderPercent: 0,
      ProviderDollar: 0,
      ManagerPercent: 0,
      ManagerDollar: 0,
      AdvisorPercent: 0,
      AdvisorDollar: 0,
      ExpensePercent: 0,
      ExpenseDollar: 0,
      PCSAdminDollar: 0,
      TPAAdminDollar: 0,
      TPARKDollar: 0,
      TrusteeDollar: 0,
      AdminFiduciary: 0,
      SUB: '',
      TPA: '',
      EstimatedPercent: 0,
      EstimatedDollar: 0,
      ConversionFeeShow: false,
      ConversionFeeText: '',
      DocumentFeeShow: false,
      DocumentFeeText: '',
      AboutTPA: false,
      AboutTPAName: '',
      AboutTPADescription: '',
      HidePresentation: true,
      MML: 0,
      IMType: 0,
      Delegation: false,
      PriceStatus: '',
      PricedEmail: '',
      PriceEmailDate: new Date().toISOString().slice(0, 10),
      BundledPricing: 0,
      PriceNotes: '',
      ElectronicOnly: false,
      AdvisorNotes: '',
      ElectronicDate: new Date().toISOString().slice(0, 10),
      illiquid: '',
      HCAddr1: '',
      HCAddr2: '',
      HCCityStateZip: '',
      ParticACCT: 0,
      PresentedByID: 0,
      EmployerCity: '',
      EmployerState: '',
      EmployerZip: '',
      CPlanProvider: '',
      CurrentPlanPricing: '',
      DefaultPricedEmail: '',
      inRPEA: false,
      ApprovedPartic: 0,
      ApprovedAssets: 0,
      ApprovedParticAcct: 0,
      Estimated_Annual_Contributions: 0,
      numHardCopies: 0,
      HardCopyNeeded: new Date().toISOString().slice(0, 10),
      EAddress2: '',
      SCITY: '',
      SPHONE: '',
      SSTATE: '',
      ZIPCODE: '',
      SSIGNATOR: '',
      ContactFirstName: '',
      ContactLastName: '',
      PresCity: '',
      PresState: '',
      PresZip: '',
      AdvisorExpPages: '',
      GIC_SV: '',
      FiduciaryServicesProgram: 0,
      TPAFeeType: 1,
      TPAFee: 0,
      AnnualRecordkeeping: false,
      EstimatedFirstYearContributions: 0,
      BDPlatformFee: 0,
      BDPlatFormPercent: 0,
      BDPlatFormDollar: 0,
      TPAAdminPercent: 0,
      TPARKPercent: 0,
      TrusteePercent: 0,
      MutualFundOffsetDollar: 0,
      MutualFundOffsetPercent: 0,
      ESPType: '',
      AllowInvestmentManager: true,
      AllowFinancialAdvisor: true
    })
    const investmentCount = ref(0)
    const investmentCount2 = ref(0)
    const loading = ref(false)
    const reportRequest = ref({})
    const sfreportid = ref('')
    const currentid = ref(0)
    const contactId = ref(0)
    const performance = ref(true)
    const implicit = ref(true)
    const current = ref(true)
    const proposalReturnData = ref({})
    const selectedPlan = ref({
      PNAME: '',
      DCPTYPE: '',
      SEINPNO: '',
      TOTASSETS: 0,
      PARTIC: 0,
      Contact: '',
      YEDISPLAY: '',
      AsOfDate: '',
      SNAME: '',
      SSTREET: '',
      SCITY: '',
      SSTATE: '',
      ZIPCODE: '',
      EXPACCT: 0,
      EXPADMIN: 0,
      EXPINVADV: 0,
      EXPPROFFEE: 0,
      EXPOTHER: 0,
      BROKER: 0,
      SF: false,
      SCHED: '',
      SHORT: 0,
      PLANTYPE: '',
      InBookOfBusiness: false,
      ReliusPlanId: undefined,
      TOTCONTRIB: 0
    })
    const weightedAverageComparison = ref(false)
    const finra = ref(false)
    const dialog = ref(false)
    const stepper5Edit = ref(false)
    const stepper5Start = ref(true)
    const step1Error = ref(false)
    const step2Error = ref(false)
    const step3Error = ref(false)
    const step4Error = ref(false)
    const step5Error = ref(false)
    const loadAll = ref(false)
    const load1 = ref(false)
    const load2 = ref(false)
    const load3 = ref(false)
    const load4 = ref(false)
    const toRoute = ref('')
    const abondon = ref(false)
    const validationIssue = ref(false)
    const isPcsStandard = ref(false)
    const brinkerManager = ref(false)
    const modelIds = ref([])
    const reportsTab = ref(0)
    const availableInvestment = ref(false)
    const hidePlanFeeStart = ref(false)
    const hideInvestmentStart = ref(false)
    const lastRoute = ref('')
    const reportPermission = ref(true)
    const hideProvider = ref(false)
    const disableReport = ref(false)
    const hasDiagnosticCreated = ref(false)
    const hasRpeaCreated = ref(false)
    const mmlStrategist = ref([])
    const mmlInvestment = ref([])
    const startegistHeadersList = ref([
      {
        title: 'Strategist',
        value: 'strategist',
        align: 'start',
        width: '25%',
        sortable: false
      },
      {
        title: 'Underlying Holdings',
        value: 'underlyingHoldings',
        align: 'start',
        width: '25%',
        sortable: false
      },
      {
        title: 'Average Expense Ratio',
        value: 'averageExpenseRatio',
        align: 'end',
        width: '20%',
        sortable: false
      },
      {
        title: '# of Models',
        value: 'NoofModels',
        align: 'end',
        width: '20%',
        sortable: false
      }
    ])
    const investmentLineUpTableHeader = ref([
      {
        title: 'Type',
        value: 'Type',
        align: 'start',
        width: '10%',
        sortable: false
      },
      {
        title: 'Symbol',
        value: 'Ticker',
        align: 'start',
        width: '10%',
        sortable: false
      },
      {
        title: 'Name',
        value: 'Name',
        align: 'start',
        width: '40%',
        sortable: false
      },
      {
        title: 'Mgmt.',
        value: 'mgmt',
        align: 'end',
        width: '10%',
        sortable: false
      },
      {
        title: '12b-1',
        value: 'tload',
        align: 'end',
        width: '10%',
        sortable: false
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        align: 'end',
        width: '10%',
        sortable: false
      },
      {
        title: 'Total Fees',
        value: 'expratio',
        align: 'end',
        width: '10%',
        sortable: false
      }
    ])
    const reportDialog = ref(false)
    const timer = ref(null)
    const espTypeSelected = ref('Single Employer Plan')
    const planTypeValue = ref('')
    const refreshComponent = ref(0)
    const modelfundComponent = ref(0)
    const refreshServiceComponent = ref(0)
    const showFirstStepper = ref(false)
    const showSecondStepper = ref(false)
    const showThirdStepper = ref(false)
    const showFourthStepper = ref(false)
    const investmentHeader = ref([
      {
        title: 'Symbol',
        value: 'Ticker',
        sortable: false,
        align: 'start',
        width: '60px'
      },
      {
        title: 'Name',
        value: 'Name',
        sortable: false,
        align: 'start',
        width: '150px'
      },
      {
        title: 'Mgmt',
        value: 'mgmt',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: '12b-1',
        value: 'tload',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: 'FER',
        value: 'expratio',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Platform',
        value: 'AMC',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Advisor',
        value: 'SSF',
        sortable: false,
        width: '65px',
        align: 'end'
      },
      {
        title: 'Total Fees',
        value: 'Total',
        sortable: false,
        width: '65px',
        align: 'end'
      }
    ])
    const totalNewMgmt = ref(0)
    const totalNewLoad = ref(0)
    const totalNewSubta = ref(0)
    const totalNewExpratio = ref(0)
    const totalNewAMC = ref(0)
    const totalNewSSF = ref(0)
    const currentUser = ref('')
    const totalNewFees = ref(0)
    const saveLoading = ref(false)
    const currentInvestmentSelected = ref([])
    const proposedModelSelected = ref(0)
    const proposedFundSelected = ref(0)
    const investmentSelected = ref(0)
    const totalAssetValue = ref(0)
    const showModelCount = ref(true)
    const investmentPagination = ref({
      itemsPerPage: -1,
      sortBy: [{ key: 'ID', order: 'desc' }]
    })
    const rpeaLoading = ref(false)
    const showRpea = ref(false)
    const ancillaryFee = ref(false)
    const excludeSummary = ref(false)
    const serviceType = ref(0)
    const tpa = ref('')
    const mml = ref(0)
    const planLeadID = ref('')
    const showAdvisorRequestForm = ref(false)
    const contactDetails = ref([])
    const currentPresenterInfo = ref('')
    const pdfDialog = ref(false)
    const pdfUrl = ref(null)
    function removeParam() {
      if ($route.query.type !== undefined && $route.query.type === 'NewPlan') {
        const query = Object.assign({}, $route.query)
        delete query.type
        $router.replace({ query })
      }
    }
    function assignProvider(val) {
      providerName.value = val
    }
    function showModelCountValue(val) {
      showModelCount.value = val
    }
    function selectedInvestmentList(val) {
      investmentSelected.value = val && val.length > 0 ? val.length : 0
    }
    const loadRPEAInformation = async () => {
      rpeaLoading.value = true
      $axios.put(`/api/v1/tal/proposal/${planId.value}/loadfromcomparison`, null).then(() => {
        rpeaLoading.value = false
        showFirstStepper.value = false
        if ($store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
          showHideStepper(espTypeSelected.value)
        } else {
          assignReports()
          GetProposalPlan(true)
          modelfundComponent.value += 1
          refreshComponent.value += 1
        }
      })
    }
    function selectedFundList(val) {
      proposedFundSelected.value = val && val.length > 0 ? val.length : 0
      if (reports.value === 'Proposal') {
        if (
          !$authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          investmentCount2.value = proposedFundSelected.value
        }
      }
    }
    function selectedModelList(val) {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        proposedModelSelected.value = val ? 1 : 0
      } else {
        proposedModelSelected.value = val && val.length > 0 ? val.length : 0
      }
    }
    function selectedCurrentInvestment(val) {
      currentInvestmentSelected.value = val && val.length > 0 ? val : []
    }
    function addToAdditionalList() {
      if (Provider.value) {
        if (availableInvestment.value) var isProviderDiagnosticValid = Provider.value.validateProvider()

        if (!isProviderDiagnosticValid) {
          toast.clearAll()
          toast.error('Platform Provider is required', { autoClose: 5000 })
          return
        }
      }
      if (currentInvestmentSelected.value.length > 0) {
        saveLoading.value = true
        $axios.post(`/api/v1/diagnostic/plan/${planId.value}/investments`, currentInvestmentSelected.value).then(() => {
          saveLoading.value = false
          Investment.value.getInvestmentList()
          Investment.value.showInvestmentLineup = true
          showInvestmentLineup.value = true
        })
      } else {
        toast.error('No Investment Selected', { autoClose: 5000 })
      }
    }
    function investmentTypeSelected() {
      if (investmentType.value === 'Add Plan Investments to Lineup') availableInvestment.value = false
      else availableInvestment.value = true
    }
    function callCurrentInvestment(val) {
      if (Investment.value) {
        Investment.value.getInvestmentList(val)
        Investment.value.getCurrentInvestmentList()
      }
    }
    const selectedESPType = async () => {
      removeParam()
      await saveESPType(true)
      eventBus.emit('saveESPValue', espTypeSelected.value)
      showHideStepper(espTypeSelected.value)
      showHideRPEA()
    }
    function anticapteDate() {
      var date = moment().add(90, 'days').format('DD')
      var month = moment().add(90, 'days').format('MM')
      var year = moment().add(90, 'days').format('YYYY')
      var anticaptedDate = year + '-' + month + '-' + date
      return anticaptedDate
    }
    function callPresenter(val) {
      if (presenter.value) presenter.value.loadPresenter(val, reports.value, planId.value)
    }
    function proposalPlanMode(proposalPlanDetails, type) {
      companyName.value = proposalPlanDetails.SNAME
      planName.value = proposalPlanDetails.PNAME
      planType.value = proposalPlanDetails.planType
      federalID.value = proposalPlanDetails.federalId
      address.value = proposalPlanDetails.address
      city.value = proposalPlanDetails.cityStateZip
      totalAsset.value = proposalPlanDetails.totalAssets
      estimatedAnnualContributions.value = proposalPlanDetails.estimatedAnnualContributions
      asOfdate.value = proposalPlanDetails.assetasOfDate
      planYearEnd.value = proposalPlanDetails.planYearEnd
      balanceParticipants.value = proposalPlanDetails.participantWithBalance
      partAsOfDate.value = proposalPlanDetails.partAsOfDate
      outsideAsset.value = proposalPlanDetails.outsideAsset
      companyStock.value = proposalPlanDetails.companyStock
      selfDirectedBrokrage.value = proposalPlanDetails.selfDirectedBrokrage
      if (type === 'Save') {
        presenterEdit.value = true
        presenterStart.value = false
      }
      if (type === 'load') {
        presenterEdit.value = true
        presenterStart.value = !presenterEdit.value
        load1.value = false
      }
    }
    function PresenterMode(presenterObject, type) {
      currentPresenterName.value = presenterObject.Name === '' ? currentUser.value : presenterObject.Name
      if (reports.value === 'RPEA') {
        totalAsset.value = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(presenterObject.totalAsset)
        totalAssetValue.value = presenterObject.totalAsset
        asOfdate.value = presenterObject.asOfdate
          ? new Date(presenterObject.asOfdate).toLocaleDateString()
          : new Date(selectedPlan.value.AsOfDate).toLocaleDateString()
        balanceParticipants.value = presenterObject.participantBal
        partAsOfDate.value = presenterObject.partAsOfDate
          ? new Date(presenterObject.partAsOfDate).toLocaleDateString()
          : new Date(selectedPlan.value.AsOfDate).toLocaleDateString()
        planYearEnd.value = presenterObject.planYearEnd ? presenterObject.planYearEnd : ''
      }
      if (reports.value === 'Proposal') {
        anticipatedDate.value = presenterObject.anticipatedCloseDate ? presenterObject.anticipatedCloseDate : 'N/A'
        presentationDate.value = presenterObject.presentationDate ? presenterObject.presentationDate : 'N/A'
        if (type === 'Save') {
          administrator.value = presenterObject.administrator
        } else {
          if (proposalPlan.value.ServiceType === 0) {
            administrator.value = $store.state.user.selectedProgram.company_Short_Name__c
              ? $store.state.user.selectedProgram.company_Short_Name__c
              : 'PCS Retirement'
          } else administrator.value = 'Other'
        }
      }
      if (reports.value === 'Diagnostic') {
        if (presenterObject.Name === '') {
          presenterObject.Name = $store.state.user.name
        }
        presenterEdit.value = presenterObject.Name === '' ? false : true
        presenterStart.value = !presenterEdit.value
      } else if (reports.value === 'RPEA') {
        if (!presenterObject.totalAsset || !presenterObject.participantBal) {
          presenterEdit.value = false
        } else presenterEdit.value = true
        presenterStart.value = !presenterEdit.value
      } else if (reports.value === 'Proposal') {
        if (
          currentPresenterName.value ||
          (anticipatedDate.value !== '' && anticipatedDate.value !== 'N/A') ||
          (presentationDate.value !== '' && presentationDate.value !== 'N/A')
        ) {
          providerEdit.value = true
        } else providerEdit.value = false
        providerStart.value = !providerEdit.value
      }

      if (type === 'load') {
        if (reports.value === 'Diagnostic' || reports.value === 'RPEA') {
          load1.value = false
          assignHideProvider()
        } else {
          load2.value = false
        }
      }
    }
    function ServiceProviderMode(serviceProviderObject, type) {
      if (serviceProviderObject[1].length > 0 || serviceProviderObject[2].length > 0) {
        providerScheduleList.value = []
        providerCurrentFeeList.value = []
        providerCurrentFeeList.value = serviceProviderObject[1].length > 0 ? serviceProviderObject[1] : []
        providerScheduleList.value = serviceProviderObject[2].length > 0 ? serviceProviderObject[2] : []
        providerCurrentFeeHeaders.value = [
          {
            text: 'Fee Type',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          {
            text: 'Form 5500 Fees',
            sortable: false,
            value: 'currentFee',
            align: 'right'
          }
        ]
        if (serviceProviderObject && serviceProviderObject.length > 2) {
          if (serviceProviderObject[3].override) {
            providerCurrentFeeHeaders.value.splice(1, 1, {
              text: 'Override Form 5500 Fees',
              sortable: false,
              value: 'updatedFee',
              align: 'right'
            })
          }
        }
        providerScheduleHeaders.value = [
          {
            text: 'Schedule ',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: ' Fees', sortable: false, value: 'fees', align: 'right' }
        ]
        investmentEdit.value = true
        investmentStart.value = !investmentEdit.value
      } else {
        investmentStart.value = true
        investmentEdit.value = false
      }
      load3.value = false
      if (type === 'load') assignHideProvider()
    }
    function investmentMode(investment, type) {
      investmentList.value = investment && investment.length > 0 ? investment : []
      if (investmentList.value.length > 0) {
        var sumMgmt = 0
        var sumTload = 0
        var sumSubta = 0
        var sumExpratio = 0
        var sumAMC = 0
        var sumSSF = 0
        var sumTotalFees = 0
        for (var i = 0; i < investmentList.value.length; i++) {
          sumMgmt += !(investmentList.value[i].mgmt === -999) ? Number(investmentList.value[i].mgmt) : Number(0)
          sumTload += !(investmentList.value[i].tload === -999) ? Number(investmentList.value[i].tload) : Number(0)
          sumSubta += !(investmentList.value[i].SubTA === -999) ? Number(investmentList.value[i].SubTA) : Number(0)
          sumExpratio += !(investmentList.value[i].expratio === -999) ? Number(investmentList.value[i].expratio) : Number(0)
          sumAMC += !(investmentList.value[i].AMC === -999) ? Number(investmentList.value[i].AMC) : Number(0)
          sumSSF += !(investmentList.value[i].SSF === -999) ? Number(investmentList.value[i].SSF) : Number(0)
          sumTotalFees += !(investmentList.value[i].Total === -999) ? Number(investmentList.value[i].Total) : Number(0)
        }
        totalNewMgmt.value = parseFloat(Number(sumMgmt) / investmentList.value.length).toFixed(2)
        totalNewLoad.value = parseFloat(Number(sumTload) / investmentList.value.length).toFixed(2)
        totalNewSubta.value = parseFloat(Number(sumSubta) / investmentList.value.length).toFixed(2)
        totalNewExpratio.value = parseFloat(Number(sumExpratio) / investmentList.value.length).toFixed(2)
        totalNewAMC.value = parseFloat(Number(sumAMC) / investmentList.value.length).toFixed(2)
        totalNewSSF.value = parseFloat(Number(sumSSF) / investmentList.value.length).toFixed(2)
        totalNewFees.value = parseFloat(Number(sumTotalFees) / investmentList.value.length).toFixed(2)
      }
      providerEdit.value = true
      providerStart.value = !providerEdit.value
      if (type === 'load') {
        load2.value = false
        if (reports.value === 'Diagnostic') {
          load3.value = false
        }
        assignHideProvider()
      } else if (type === 'Save') {
        providerEdit.value = true
        providerStart.value = !providerEdit.value
      }
      if (investmentList.value && investmentList.value.length === 0) {
        providerEdit.value = false
        providerStart.value = true
      }
    }
    function rpeaModelFundMode(modelfundObject, type) {
      modelCount.value = modelfundObject.modelsCount
      fundCount.value = modelfundObject.fundsCount
      if (reports.value === 'RPEA') {
        modelfundEdit.value = true
        modelfundStart.value = false
      } else {
        investmentEdit.value = true
        investmentStart.value = false
      }
      if (type === 'load') {
        load4.value = false
        assignHideProvider()
      }
      if (modelCount.value === 0 && fundCount.value === 0) {
        modelfundEdit.value = false
        modelfundStart.value = true
      }
    }
    function roposalModelfundMode(modelfundObject, type) {
      investmentCount.value = modelfundObject.modelsCount
      investmentCount2.value = modelfundObject.fundsCount
      investmentEdit.value = true
      investmentStart.value = false
      if (modelfundObject.modelsCount === 0 && modelfundObject.fundsCount === 0) {
        investmentEdit.value = false
        investmentStart.value = true
      } else {
        hideInvestmentStart.value = false
        hidePlanFeeStart.value = false
        disableReport.value = false
      }
      if (hideInvestmentStart.value && modelfundObject.modelsCount === 0 && modelfundObject.fundsCount === 0) {
        investmentEdit.value = false
        investmentStart.value = true
      }
      if (type === 'load') {
        load3.value = false
      }
    }
    function proposalPlanFeesMethod(planFeeObject, type) {
      if (type === 'load') {
        if (PlanFees.value) PlanFees.value.updateOldplanFeesForm('loadValue')
      }
      feeHeaders.value = [
        { text: 'Fee', sortable: false, value: 'name' },
        { text: 'Cost($)', sortable: false, value: 'cost1', align: 'right' },
        { text: 'Cost(%)', sortable: false, value: 'cost2', align: 'right' }
      ]
      feeList.value = planFeeObject[0]
      if (planFeeObject.length > 0) {
        var estimateCost = planFeeObject[0].find((a) => a.name === 'Estimated Cost')
        if (estimateCost !== undefined && estimateCost !== null) {
          if (estimateCost.cost1 === 0 && estimateCost.cost2 === 0) {
            modelfundEdit.value = false
            modelfundStart.value = true
          } else {
            modelfundEdit.value = true
            modelfundStart.value = false
          }
        }
      }
      if (type === 'load') {
        load4.value = false
      }
    }
    function toggleStepper(val) {
      if (val === '1') {
        if (!presenterEdit.value) {
          if (reports.value === 'Diagnostic') {
            hideProvider.value = false
            disableReport.value = false
          }
        }
        showFirstStepper.value = true
      } else if (val === '2') {
        if (!providerEdit.value) {
          hideInvestmentStart.value = false
        }
        showSecondStepper.value = true
      } else if (val === '3') {
        if (investmentEdit.value) {
          hidePlanFeeStart.value = false
          disableReport.value = false
        }
        //Added here
        if (reports.value === 'RPEA') {
          ServiceProvider.value.createFeeDialog = false
          eventBus.emit('feeAdjustmentDoneForRPEA', true)
        }
        //upto here
        showThirdStepper.value = true
      } else if (val === '4') {
        if (reports.value === 'Proposal') {
          PlanFees.value.saveProvider = false
          PlanFees.value.saveManager = false
          PlanFees.value.saveAdvisor = false
          PlanFees.value.saveAdmin = false
          PlanFees.value.saveTpark = false
          PlanFees.value.saveTrustee = false
          PlanFees.value.saveOffset = false
          PlanFees.value.loadTypeValue = 'save'
          eventBus.emit('feeAdjustmentDone', true)
        }
        showFourthStepper.value = true
      }
    }
    function assignReports() {
      step1Error.value = false
      step2Error.value = false
      step3Error.value = false
      step4Error.value = false
      step5Error.value = false
      saveLoading.value = false
      validationIssue.value = false
      stepper5Start.value = true
      stepper5Edit.value = false
      clearStarts()
      load4.value = false
      if (reports.value === 'Diagnostic') {
        refreshComponent.value += 1
        reportName.value = 'Create Diagnostic'
        type1.value = 'Presenter'
        type2.value = 'Current Investments'
        loadAll.value = load1.value = load2.value = true
        parentReset.value = true
        if (planId.value > 0) {
          callPresenter('load')
          callCurrentInvestment('load')
        }
        hidePlanFeeStart.value = false
        hideInvestmentStart.value = false
        hideProvider.value = false
        hasRpeaCreated.value = false
        disableReport.value = false
        hasDiagnosticCreated.value = false
        if ($authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.Full)) reportPermission.value = true
        else reportPermission.value = false
      } else if (reports.value === 'RPEA') {
        loadAll.value = load1.value = load2.value = load3.value = load4.value = true
        modelfundComponent.value += 1
        refreshComponent.value += 1
        reportName.value = 'Create Comparison'
        type1.value = 'Plan Information And Presenter'
        type2.value = 'Current Investments'
        type3.value = 'Service Provider Fees'
        type4.value = 'Proposed Investments'
        parentReset.value = true
        if (planId.value > 0) {
          callPresenter('load')
          callCurrentInvestment('load')
        }
        hidePlanFeeStart.value = false
        hideInvestmentStart.value = false
        hideProvider.value = false
        hasDiagnosticCreated.value = false
        hasRpeaCreated.value = false
        disableReport.value = false
        if ($authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.Full)) reportPermission.value = true
        else reportPermission.value = false
      } else if (reports.value === 'Proposal') {
        reports.value = 'Proposal'
        reportName.value = 'Create Proposal'
        type1.value = 'Plan Information and Features'
        type2.value = 'Presenter' //'Presenter And Product Selection'
        type3.value = 'Proposed Investments'
        type4.value = 'Plan Fees'
        loadAll.value = load1.value = load2.value = load3.value = load4.value = true
        hideProvider.value = false
        hasDiagnosticCreated.value = false
        disableReport.value = false
        hasRpeaCreated.value = false
        refreshComponent.value += 1
        if ($route.query.type !== 'NewPlan') {
          hidePlanFeeStart.value = false
          hideInvestmentStart.value = false
        }
        if (!parentReset.value) parentReset.value = !parentReset.value
        if ($authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.Full)) reportPermission.value = true
        else reportPermission.value = false
      } else if (reports.value === 'Activity') {
        loadAll.value = true
        refreshComponent.value += 1
      }
    }
    function clearStarts() {
      presenterStart.value = true
      providerStart.value = true
      investmentStart.value = true
      modelfundStart.value = true
      presenterEdit.value = false
      providerEdit.value = false
      investmentEdit.value = false
      modelfundEdit.value = false
      parentReset.value = false
      companyName.value = ''
      planName.value = ''
      planType.value = ''
      federalID.value = ''
      address.value = ''
      city.value = ''
      totalAsset.value = ''
      estimatedAnnualContributions.value = ''
      asOfdate.value = ''
      balanceParticipants.value = ''
      partAsOfDate.value = ''
      currentPresenterName.value = ''
      providerName.value = ''
      providerCurrentFeeHeaders.value = []
      providerCurrentFeeList.value = []
      providerScheduleHeaders.value = []
      providerScheduleList.value = []
      presentationDate.value = ''
      anticipatedDate.value = ''
      administrator.value = ''
      feeHeaders.value = []
      feeList.value = []
      modelCount.value = ''
      fundCount.value = ''
      availableInvestment.value = false
    }
    function sendPlanToDiagnostic() {
      if (selectedPlan.value && selectedPlan.value.SEINPNO !== '' && selectedPlan.value.PNAME !== '') {
        var advisorPlan = {
          SEINPNO: selectedPlan.value.SEINPNO,
          PNAME1: selectedPlan.value.PNAME,
          PlatformName: '',
          DCPTYPE: selectedPlan.value.DCPTYPE,
          YEAREND: selectedPlan.value.YEDISPLAY
        }
        $axios.post(`/api/v1/diagnostic/advisor/planbyein`, advisorPlan).then((success) => {
          if (success.data.d !== null) {
            planId.value =
              success.data.d.planID === undefined
                ? success.data.d.length > 0
                  ? success.data.d[0].PlanID
                  : 0
                : success.data.d.planID
            let espValue =
              success.data.d.espType === undefined
                ? success.data.d.length > 0
                  ? success.data.d[0].ESPType
                  : ''
                : success.data.d.espType

            if ($store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
              if (espValue) {
                espTypeSelected.value = espValue
                eventBus.emit('saveESPValue', espTypeSelected.value)
                showHideStepper(espTypeSelected.value, 'load')
              } else {
                if (reports.value === 'Proposal') {
                  GetProposalPlan(true)
                }
                assignReports()
                saveESPType(false)
              }
            } else {
              espTypeSelected.value = $authz.firmRelationship.Single_Employer_Plan
              if (reports.value === 'Proposal') GetProposalPlan(true)
              assignReports()
            }
            showHideRPEA()
          }
        })
      }
    }
    function GetProposalPlan(val) {
      if (planId.value !== 0) {
        if (val) getProposalPermission()
        var proposalPlanDetail = {
          AdvisorID: $store.state.user.id,
          PlanID: planId.value,
          SEINPNO: planId.value > 0 ? $route.params.id : '',
          ESPType: espTypeSelected.value
        }
        $axios.put(`/api/v1/advisor/proposalplan`, proposalPlanDetail).then((success) => {
          if (success.data.d !== null) {
            proposalPlan.value = success.data.d
            proposalPlan.value.EstimatedFirstYearContributions = proposalPlan.value.Estimated_Annual_Contributions
            checkProposalData.value = true
            if (!proposalPlan.value.PNAME) proposalPlan.value.PNAME = selectedPlan.value.PNAME
            if (!proposalPlan.value.SNAME) proposalPlan.value.SNAME = selectedPlan.value.SNAME
            if (planId.value > 0) proposalPlan.value.DCPTYPE = selectedPlan.value.DCPTYPE
            if (planId.value < 0) {
              selectedPlan.value.PNAME = proposalPlan.value.PNAME
              selectedPlan.value.SEINPNO = proposalPlan.value.SEINPNO
              selectedPlan.value.TOTASSETS = proposalPlan.value.TOTASSETS
              selectedPlan.value.TOTCONTRIB = proposalPlan.value.Estimated_Annual_Contributions
              selectedPlan.value.PARTIC = proposalPlan.value.PARTIC
              selectedPlan.value.SNAME = proposalPlan.value.SNAME
              selectedPlan.value.Contact = proposalPlan.value.Contact
              selectedPlan.value.SSTREET = proposalPlan.value.SSTREET
              selectedPlan.value.EXPACCT = 0
              selectedPlan.value.EXPADMIN = 0
              selectedPlan.value.EXPINVADV = 0
              selectedPlan.value.EXPPROFFEE = 0
              selectedPlan.value.EXPOTHER = 0
              checkProposalData.value = true
              selectedPlan.value.BROKER = 0
              selectedPlan.value.DCPTYPE = proposalPlan.value.DCPTYPE
              selectedPlan.value.PLANTYPE = proposalPlan.value.DCPTYPE
              var cityStateZip = proposalPlan.value.CityStateZip
              var city = ''
              var state = ''
              var zip = ''
              if (cityStateZip) {
                cityStateZip = cityStateZip.trim()
                var comma = cityStateZip.indexOf(',')
                city = cityStateZip.slice(0, comma)
                var after = cityStateZip.substring(comma + 2)
                var space = after.lastIndexOf(' ')
                state = after.slice(0, space)
                zip = after.substring(space + 1)
              }
              selectedPlan.value.SCITY = city ? city.trim() : ''
              selectedPlan.value.SSTATE = state ? state.trim() : ''
              selectedPlan.value.YEDISPLAY = proposalPlan.value.YEAREND ? proposalPlan.value.YEAREND : '2021-12-31T00:00:00'
              selectedPlan.value.AsOfDate = proposalPlan.value.AsofDate
              selectedPlan.value.ZIPCODE = zip ? zip.trim() : ''
              if (val) {
                if ($route.query.type !== undefined && $route.query.type === 'NewPlan') {
                  disableReport.value = true
                }
              }
            }
            if ($store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
              if (selectedPlan.value.DCPTYPE !== $authz.planType.Defined_Contribution_Plan) {
                espTypeSelected.value = $authz.firmRelationship.Single_Employer_Plan
                proposalPlan.value.ESPType = $authz.firmRelationship.Single_Employer_Plan
              } else {
                espTypeSelected.value = proposalPlan.value.ESPType
                  ? proposalPlan.value.ESPType
                  : $authz.firmRelationship.Single_Employer_Plan
                proposalPlan.value.ESPType = proposalPlan.value.ESPType
                  ? proposalPlan.value.ESPType
                  : $authz.firmRelationship.Single_Employer_Plan
              }
            } else proposalPlan.value.ESPType = $authz.firmRelationship.Single_Employer_Plan
          } else {
            proposalPlan.value = {
              PNAME: selectedPlan.value.PNAME,
              SNAME: selectedPlan.value.SNAME,
              DCPTYPE: selectedPlan.value.DCPTYPE,
              SEINPNO: selectedPlan.value.SEINPNO,
              Contact: '',
              SSTREET: selectedPlan.value.SSTREET,
              CityStateZip: selectedPlan.value.SCITY + ', ' + selectedPlan.value.SSTATE + ' ' + selectedPlan.value.ZIPCODE,
              TOTASSETS: selectedPlan.value.TOTASSETS,
              EstimatedFirstYearContributions: selectedPlan.value.TOTCONTRIB ? selectedPlan.value.TOTCONTRIB : 0,
              PARTIC: selectedPlan.value.PARTICACCT,
              YEAREND: selectedPlan.value.YEDISPLAY,
              AsofDate: selectedPlan.value.AsOfDate,
              ServiceType: 0,
              TPASchedule: 0,
              TPACompany: '',
              TPAContact: '',
              TPAPhone: '',
              TPAEmail: '',
              PresentedBy: '',
              Presentation: null,
              Anticipated: null,
              Status: '',
              Outside: 0,
              OutsideAmount: 0,
              Stock: 0,
              OutsideType: 0,
              StockAmount: 0,
              FeeType: 0,
              ManagerName: '',
              ManagerFee: 0,
              ManagerSchedule: 0,
              AdvisorFeeType: 0,
              AdvisorName: '',
              AdvisorFee: 0,
              AdvisorSchedule: 0,
              Broker: 0,
              Model1: 0,
              Model2: 0,
              Model3: 0,
              Model4: 0,
              Model5: 0,
              Model6: 0,
              AdvisorID: $store.state.user.id,
              Created: new Date().toISOString().slice(0, 10),
              PlanID: planId.value,
              SafeHarbor: 0,
              ETF: 0,
              WaiveFee1: false,
              WaiveFee2: false,
              AncillaryFee: false,
              ExcludeSummary: true,
              PBSAdvisor: false,
              PBSAdmin: false,
              PBSRecordkeeping: false,
              PBSCustodian: false,
              FiduciaryStatus: '',
              TPAName: '',
              TPARKFee: 0,
              TPARKSchedule: 0,
              TrusteeFee: 0,
              TrusteeSchedule: 0,
              ProviderType: 0,
              ProviderName: '',
              ProviderFee: 0,
              ProviderSchedule: 0,
              ProviderPercent: 0,
              ProviderDollar: 0,
              ManagerPercent: 0,
              ManagerDollar: 0,
              AdvisorPercent: 0,
              AdvisorDollar: 0,
              ExpensePercent: 0,
              ExpenseDollar: 0,
              PCSAdminDollar: 0,
              TPAAdminDollar: 0,
              TPARKDollar: 0,
              TrusteeDollar: 0,
              AdminFiduciary: 0,
              SUB: '',
              TPA: '',
              EstimatedPercent: 0,
              EstimatedDollar: 0,
              ConversionFeeShow: false,
              ConversionFeeText: '',
              DocumentFeeShow: false,
              DocumentFeeText: '',
              AboutTPA: false,
              AboutTPAName: '',
              AboutTPADescription: '',
              HidePresentation: false,
              MML: 0,
              IMType: 0,
              Delegation: false,
              PriceStatus: '',
              PricedEmail: '',
              PriceEmailDate: new Date().toISOString().slice(0, 10),
              BundledPricing: 0,
              PriceNotes: '',
              ElectronicOnly: false,
              AdvisorNotes: '',
              ElectronicDate: new Date().toISOString().slice(0, 10),
              illiquid: '',
              HCAddr1: '',
              HCAddr2: '',
              HCCityStateZip: '',
              ParticACCT: 0,
              PresentedByID: 0,
              EmployerCity: '',
              EmployerState: '',
              EmployerZip: '',
              CPlanProvider: '',
              CurrentPlanPricing: '',
              DefaultPricedEmail: '',
              inRPEA: false,
              ApprovedPartic: 0,
              ApprovedAssets: 0,
              ApprovedParticAcct: 0,
              numHardCopies: 0,
              HardCopyNeeded: new Date().toISOString().slice(0, 10),
              EAddress2: '',
              SCITY: '',
              SPHONE: '',
              SSTATE: '',
              ZIPCODE: '',
              SSIGNATOR: '',
              ContactFirstName: '',
              ContactLastName: '',
              PresCity: '',
              PresState: '',
              PresZip: '',
              AdvisorExpPages: '',
              GIC_SV: '',
              FiduciaryServicesProgram: 0,
              TPAFeeType: 1,
              TPAFee: 0,
              AnnualRecordkeeping: false,
              BDPlatformFee: 0,
              BDPlatFormPercent: 0,
              BDPlatFormDollar: 0,
              TPAAdminPercent: 0,
              TPARKPercent: 0,
              TrusteePercent: 0,
              MutualFundOffsetDollar: 0,
              MutualFundOffsetPercent: 0,
              ESPType: 'Single Employer Plan',
              AllowInvestmentManager: true,
              AllowFinancialAdvisor: true
            }
            hideInvestmentStart.value = true
            hidePlanFeeStart.value = true
            checkProposalData.value = false
            disableReport.value = true
          }
          ancillaryFee.value = proposalPlan.value.AncillaryFee
          excludeSummary.value = proposalPlan.value.ExcludeSummary
          serviceType.value = proposalPlan.value.ServiceType ? proposalPlan.value.ServiceType : 0
          tpa.value = proposalPlan.value.TPA ? proposalPlan.value.TPA : ''
          serviceType.value = proposalPlan.value.MML ? proposalPlan.value.MML : 0
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            if (modelFund.value) modelFund.value.callProposalMethod()
          } else {
            if (proposalInvestment.value) proposalInvestment.value.callProposalMethod()
          }
        })
      }
    }
    const getReport = async (val) => {
      const diagnosticReportUrl = '/api/v1/tal/report/diagnostic'
      const rpeaReportUrl = '/api/v1/tal/report/rpea'
      const proposalReportUrl = '/api/v1/tal/report/proposal'
      var isPreview = val && val === 'Preview' ? true : false
      eventBus.emit('feeAdjustmentDone', true)
      loading.value = true
      reportDialog.value = true
      var validate = await validateReportTypes('GenerateReport')
      if (validate) {
        var preparedby = ''
        if (presenter.value && (reports.value === 'Diagnostic' || reports.value === 'RPEA')) {
          var tmp_presenter = presenter.value.presenters.find((a) => a.ID === presenter.value.presenterFormList.presenter)
          if (tmp_presenter) preparedby = tmp_presenter.PRESENTEDBY
        }
        var reportURL = ''
        var downloadUrl = ''
        sfreportid.value = ''
        if (reports.value === 'RPEA') {
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            if (modelFund.value) {
              if (
                (selectedPlan.value.DCPTYPE === $authz.planType.Defined_Benefit_Plan ||
                  selectedPlan.value.DCPTYPE === $authz.planType.Cash_Balance_Plan) &&
                $store.state.user.selectedProgram.programName === $authz.managedPlan.PA
              ) {
                if (modelFund.value.selectedGroupId === null) {
                  step4Error.value = true
                  toast.error('Additional data is required to generate report.', { autoClose: 5000 })
                  loading.value = false
                  reportDialog.value = false
                  window.scrollTo('#step4')
                  return
                }
              } else if (modelFund.value.investmentLineups.length === 0 || modelFund.value.selectedGroupId === null) {
                presenterStart.value = !presenterEdit.value
                providerStart.value = !providerEdit.value
                investmentStart.value = !investmentEdit.value
                modelfundStart.value = !modelfundEdit.value
                step4Error.value = true
                toast.error('Additional data is required to generate report.', { autoClose: 5000 })
                loading.value = false
                reportDialog.value = false
                window.scrollTo('#step4')
                return
              }
            }
          }
          reportRequest.value = {
            seinPNumber: selectedPlan.value.SEINPNO,
            currentID: planId.value,
            proposalID: proposalReturnData.value.proposalID,
            proposedPlanID: proposalReturnData.value.proposalPlanID,
            performance: performance.value,
            planImplicit: implicit.value,
            current: current.value,
            preparedby: preparedby
              ? preparedby
              : currentPresenterInfo.value
                ? currentPresenterInfo.value
                : $store.state.user.name,
            WeightedAverageComparison: weightedAverageComparison.value,
            finra: finra.value,
            planName: selectedPlan.value.PNAME,
            isPreviewReport: isPreview
          }
          reportURL = rpeaReportUrl
          downloadUrl = `${reportURL}/download`
          $axios.put(`/api/v1/tal/plan/${planId.value}/rpea`)
        } else if (reports.value === 'Proposal') {
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            if (modelFund.value) {
              if (
                (selectedPlan.value.DCPTYPE === $authz.planType.Defined_Benefit_Plan ||
                  selectedPlan.value.DCPTYPE === $authz.planType.Cash_Balance_Plan) &&
                $store.state.user.selectedProgram.programName === $authz.managedPlan.PA
              ) {
                if (modelFund.value.selectedGroupId === null) {
                  step3Error.value = true
                  toast.error('Additional data is required to generate report.', { autoClose: 5000 })
                  loading.value = false
                  reportDialog.value = false
                  window.scrollTo('#step3')
                  return
                }
              } else if (modelFund.value.investmentLineups.length === 0 || modelFund.value.selectedGroupId === null) {
                step3Error.value = true
                toast.error('Additional data is required to generate report.', { autoClose: 5000 })
                loading.value = false
                reportDialog.value = false
                window.scrollTo('#step3')
                return
              }
            }
          }
          reportRequest.value = {
            planID: planId.value,
            sfReportID: sfreportid.value,
            seinPNumber: selectedPlan.value.SEINPNO,
            planName: selectedPlan.value.PNAME,
            ancillaryFee: ancillaryFee.value,
            serviceType: serviceType.value,
            tpa: tpa.value,
            excludeSummary: !excludeSummary.value,
            mml: mml.value,
            modelIds: modelIds.value,
            espType: espTypeSelected.value,
            isPreviewReport: isPreview
          }
          reportURL = proposalReportUrl
          downloadUrl = `${reportURL}/download`

          if ($store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager.value) {
            if (!isPcsStandard.value) reportURL += '?customReport=true'
          }
          $axios.put(`/api/v1/tal/plan/${planId.value}/proposal`)
          removeParam()
        } else if (reports.value === 'Diagnostic') {
          reportRequest.value = {
            seinPNumber: selectedPlan.value.SEINPNO,
            preparedby: preparedby
              ? preparedby
              : currentPresenterInfo.value
                ? currentPresenterInfo.value
                : $store.state.user.name,
            planID: planId.value,
            implicit: implicit.value,
            isExpress: false,
            finra: finra.value,
            planName: selectedPlan.value.PNAME,
            isPreviewReport: isPreview
          }
          reportURL = diagnosticReportUrl
          downloadUrl = `${reportURL}/download`
          $axios.put(`/api/v1/tal/plan/${planId.value}/diagnostic`)
        }
        var timestamp = Math.floor(+new Date() / 1000)
        $axios(reportURL, {
          method: 'POST',
          data: reportRequest.value
        })
          .then((response) => {
            onPopUpEvent(
              `${downloadUrl}?reportName=${encodeURIComponent(response.data.reportName)}`,
              `${response.data.reportName}-${timestamp}`
            )
            loading.value = false
            reportDialog.value = false
            getProgress(reports.value)
          })
          .catch(() => {
            loading.value = false
            reportDialog.value = false
          })
      } else {
        if (!(reports.value === 'RPEA' && step5Error.value)) {
          toast.error('Unable to complete action. Additional data is required to generate report.', { autoClose: 5000 })
        }
        loading.value = false
        reportDialog.value = false
      }
    }
    function strategistMode(modelFundObject, type) {
      mmlStrategist.value = modelFundObject.strategistObject
      investmentEdit.value = true
      investmentStart.value = false
      if (type === 'load') load3.value = false
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if (mmlStrategist.value.length === 0) {
          investmentEdit.value = false
          investmentStart.value = true
        }
      }
    }
    function getContactInfo() {
      loading.value = true
      contactId.value = $store.state.user.contactId
      $axios
        .get(`/api/v1/sfdc/${contactId.value}/contact`)
        .then((success) => {
          if (success.data.d) {
            contactDetails.value = success.data.d
            currentPresenterInfo.value =
              contactDetails.value.FirstName +
              ' ' +
              contactDetails.value.LastName +
              '\n' +
              contactDetails.value.Email +
              '\n' +
              contactDetails.value.MailingStreet +
              '\n' +
              contactDetails.value.MailingCity +
              ', ' +
              contactDetails.value.MailingState +
              '\n' +
              contactDetails.value.MailingPostalCode +
              '\n' +
              contactDetails.value.Phone

            loading.value = false
          } else {
            loading.value = false
          }
        })
        .catch(() => {
          loading.value = false
        })
    }
    function getPlanInformationDetail(seinpno, from) {
      $axios.get(`/api/v1/tal/plan/${seinpno}/details`).then((success) => {
        if (success.data.d) {
          selectedPlan.value = success.data.d ? success.data.d : {}
          if (selectedPlan.value.SEINPNO) {
            if (from === 'watch') {
              sendPlanToDiagnostic()
            }
            if (planId.value === 0) {
              sendPlanToDiagnostic()
            }

            selectedPlan.value.InBookOfBusiness = success.data.d ? (success.data.d.planId ? true : false) : false

            $axios.get(`/api/v1/retention/pcs401k/plan/id?seinpno=${selectedPlan.value.SEINPNO}`).then((success) => {
              selectedPlan.value.ReliusPlanId = success.data
            })
          }
        }
      })
    }
    const reportOptionSelected = (includeOption) => {
      if (includeOption != null) {
        performance.value = includeOption.performance
        implicit.value = includeOption.implicit
        current.value = includeOption.includeCurrent
        if (modelCount.value <= 0 && fundCount.value <= 0) includeOption.weightedAverageComparison = false
        weightedAverageComparison.value = includeOption.weightedAverageComparison
        finra.value = includeOption.finra
        proposalReturnData.value.proposalPlanID = includeOption.proposalPlanID
        proposalReturnData.value.proposalID = includeOption.proposalID
      }
    }
    const mmlReportOption = (includeOption) => {
      implicit.value = true
      current.value = true
      finra.value = true
      proposalReturnData.value.proposalPlanID = includeOption.proposalPlanID
      proposalReturnData.value.proposalID = includeOption.proposalID
    }
    //method for Autosave as well as validation check
    const validateReportTypes = async (from) => {
      var promises = []
      var scrolled = false
      toast.clearAll()

      if (reports.value === 'Diagnostic') {
        var isProviderDiagnosticValid = true
        if (availableInvestment.value) isProviderDiagnosticValid = Provider.value.validateProvider()
        var isPresenterDiagnosticValid = presenter.value.validatePresenter()
        var isInvestmentDiagnosticValid = true
        if (Investment.value.additionalInvestment) Investment.value.removeError()
        if (!isPresenterDiagnosticValid) {
          step1Error.value = true
          window.scrollTo('#reportsTab')
          validationIssue.value = true
          scrolled = true
        }
        if (!isProviderDiagnosticValid) {
          step2Error.value = true
          if (!scrolled) window.scrollTo('#step1')
          validationIssue.value = true
        }
        if (!isInvestmentDiagnosticValid) {
          step2Error.value = true
          validationIssue.value = true
        }
        if (isPresenterDiagnosticValid && isProviderDiagnosticValid && isInvestmentDiagnosticValid) validationIssue.value = false

        if (validationIssue.value) return false

        step1Error.value = false
        step2Error.value = false
        step3Error.value = false
        validationIssue.value = false

        var presenterdiagnosticCheckSave = presenter.value.presenterCompare()
        if (presenterdiagnosticCheckSave) {
          promises.push(presenter.value.SavePresenterandPlan())
        }
        var investmentCheckSave = Investment.value.compareInvestment()
        if (investmentCheckSave || (from === 'GenerateReport' && (Investment.value.implicitCost || Investment.value.finra)))
          promises.push(Investment.value.saveInvestment())
        if (promises.length > 0) await Promise.allSettled(promises)
        return true
      }
      if (reports.value === 'RPEA') {
        var isproviderRPEAValid = true
        if (availableInvestment.value) isproviderRPEAValid = Provider.value.validateProvider()
        var ispresenterRPEAValid = presenter.value.validatePresenter()
        var isInvestmentRPEAValid = true
        if (Investment.value.additionalInvestment) Investment.value.removeError()
        var isModelFundListValid = modelFund.value.validateModelFundList()

        if (!ispresenterRPEAValid) {
          step1Error.value = true
          if (!scrolled) window.scrollTo('#reportsTab')
          validationIssue.value = true
          scrolled = true
        }
        if (!isproviderRPEAValid) {
          step2Error.value = true
          if (!scrolled) window.scrollTo('#step1')
          validationIssue.value = true
          scrolled = true
        }
        if (!isInvestmentRPEAValid) {
          step2Error.value = true
          if (!scrolled) window.scrollTo('#step1')
          validationIssue.value = true
          scrolled = true
        }
        if (!isModelFundListValid) {
          step5Error.value = true
          if (!scrolled) window.scrollTo('#step4')
          validationIssue.value = true
          scrolled = true
        }
        if (ispresenterRPEAValid && isproviderRPEAValid && isInvestmentRPEAValid && isModelFundListValid)
          validationIssue.value = false

        if (validationIssue.value) return false

        step1Error.value = false
        step2Error.value = false
        step3Error.value = false
        step4Error.value = false
        step5Error.value = false
        validationIssue.value = false

        var presenterCheckSave = presenter.value.presenterCompare()
        if (presenterCheckSave) {
          promises.push(presenter.value.SavePresenterandPlan())
        }
        var serviveProviderCheck = ServiceProvider.value.serviceProviderCompare()
        if (serviveProviderCheck) {
          promises.push(ServiceProvider.value.saveFees('Save'))
        }
        var investmentCheck = Investment.value.compareInvestment()
        if (investmentCheck) promises.push(Investment.value.saveInvestment())

        var modelfundListSaveCheck = $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
          ? modelFund.value.compareProposalInvestment()
          : modelFund.value.compareModelFundList()
        if (modelfundListSaveCheck) promises.push(modelFund.value.saveProposalHoldings())

        if (!serviveProviderCheck && from === 'GenerateReport') await ServiceProvider.value.saveFees('Save')

        if (promises.length > 0) await Promise.allSettled(promises)
        return true
      }
      if (reports.value === 'Proposal') {
        var ispresenterProposalValid = presenter.value.validatePresenter()
        var isStrategistListValid = true
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          isStrategistListValid = modelFund.value.validateModelFundList()
        }
        var isPlanFeesProposalValid = PlanFees.value.validatePlanFees()
        if (isPlanFeesProposalValid === undefined) isPlanFeesProposalValid = true

        if (!ispresenterProposalValid) {
          step2Error.value = true
          window.scrollTo('#step1')
          validationIssue.value = true
          scrolled = true
        }
        if (!isStrategistListValid) {
          step3Error.value = true
          window.scrollTo('#step3')
          validationIssue.value = true
          scrolled = true
        }
        if (!isPlanFeesProposalValid) {
          step4Error.value = true
          window.scrollTo('#step4')
          validationIssue.value = true
          showFourthStepper.value = true
          scrolled = true
        }
        if (ispresenterProposalValid && isPlanFeesProposalValid && isStrategistListValid) validationIssue.value = false

        if (validationIssue.value) return false

        step1Error.value = false
        step2Error.value = false
        step3Error.value = false
        step4Error.value = false
        step5Error.value = false
        validationIssue.value = false

        promises.push(planInformation.value.saveInformation(false))
        promises.push(presenter.value.SavePresenterandPlan(false))
        var proposalInvestmentCheck = false
        var feePromises = []
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          proposalInvestmentCheck = modelFund.value.compareProposalInvestment()
          if (proposalInvestmentCheck) {
            await modelFund.value.saveProposalHoldings()
          }
        } else {
          proposalInvestmentCheck = proposalInvestment.value.compareProposalInvestment()
          if (proposalInvestmentCheck) {
            await proposalInvestment.value.saveProposalModelInvestment()
          }
        }
        feePromises.push(PlanFees.value.getExpense(true))
        feePromises.push(PlanFees.value.getOffsetOverride(true))
        await Promise.all(feePromises)
        promises.push(PlanFees.value.savePlanFees(false))

        if (promises.length > 0) await Promise.allSettled(promises)
        return true
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
    const diagnosticReport = (implicitValue) => {
      if (implicitValue !== null) {
        implicit.value = implicitValue.implicitCost
        finra.value = implicitValue.finra
      }
    }
    function checkStandardPcs(val) {
      isPcsStandard.value = val
    }
    function getManager() {
      $axios.get(`/api/v1/tal/advisor/manager`).then((success) => {
        var data = success.data.d
        brinkerManager.value = (data || '').indexOf('@brinkercapital.com') !== -1 ? true : false
        eventBus.emit('brinkerManagerValue', brinkerManager.value)
      })
    }
    function getModelId() {
      if (planId.value !== 0) {
        $axios.get(`/api/v1/proposal/${planId.value}/models/id`).then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            modelIds.value = []
            for (var i = 0; i < success.data.d.length; i++) {
              modelIds.value.push(success.data.d[i].ModelID)
            }
          }
        })
      }
    }
    function resetStepperValidation(val) {
      if (!val) {
        step2Error.value = false
        validationIssue.value = false
      }
    }
    function clearPresenterStartEdit() {
      presenterStart.value = false
      presenterEdit.value = false
    }
    function exportToExcel() {
      var xlHeaders = []
      var planResult = []
      let selectedData = []
      selectedData.push(selectedPlan.value)
      xlHeaders = ExportPlan(selectedData)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'Plan')
      for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
        currencyConvert(wb, 'O', Xrow)
        currencyConvert(wb, 'Q', Xrow)
        currencyConvert(wb, 'R', Xrow)
        currencyConvert(wb, 'S', Xrow)
        currencyConvert(wb, 'T', Xrow)
        currencyConvert(wb, 'U', Xrow)
        percentConvert(wb, 'V', Xrow)
        percentConvert(wb, 'W', Xrow)
        currencyConvert(wb, 'X', Xrow)
        currencyConvert(wb, 'Y', Xrow)
        percentConvert(wb, 'Z', Xrow)
        currencyConvert(wb, 'AB', Xrow)
        currencyConvert(wb, 'AC', Xrow)
        currencyConvert(wb, 'AD', Xrow)
        currencyConvert(wb, 'AE', Xrow)
        currencyConvert(wb, 'AF', Xrow)
        percentConvert(wb, 'AG', Xrow)
        percentConvert(wb, 'AK', Xrow)
        percentConvert(wb, 'AL', Xrow)
        percentConvert(wb, 'AR', Xrow)
      }
      XLSX.writeFile(wb, 'Plan.xlsx')
    }
    function currencyConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Plan'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    function percentConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Plan'][xlColRef + xlRowNum], '0.0000%')
    }
    function ExportPlan(plans) {
      var xlHeaders = plans.map((rec) => {
        return {
          'Plan Name': rec.PNAME,
          'EIN#': rec.SEINPNO,
          //'EIN#': rec.sp_fedid,
          Company: rec.SNAME,
          Street: rec.SSTREET,
          City: rec.SCITY,
          State: rec.SSTATE,
          Zip: rec.ZIPCODE,
          Phone: rec.SPHONE,
          'Admin First Name': rec.AFIRSTNAME,
          'Admin Last Name': rec.ALASTNAME,
          'First Name': rec.FIRSTNAME,
          'Last Name': rec.LASTNAME,
          'Type of Plan': rec.DCPTYPE,
          'Plan is Collectively Bargained': rec.BARGAINED,
          'Total Plan Assets': rec.TOTASSETS,
          'Active Participants': rec.ACTPARTIC,
          'Average Account Balance': rec.AVEACCTBAL,
          'Average Participant Account Balance': rec.AVEPARTICBAL ? parseFloat(rec.AVEPARTICBAL.toFixed(0)) : 0,
          // rec.AVEPARTICBAL.toFixed(0),
          'Total Contributions': rec.TOTCONTRIB,
          'Average Participant Contribution': rec.PARTAVG ? parseFloat(rec.PARTAVG.toFixed(0)) : 0,
          'Average Employer Contribution': rec.EMPLYRAVG ? parseInt(rec.EMPLYRAVG.toFixed(0)) : 0,
          'Asset Growth': rec.GROWTH ? parseFloat(rec.GROWTH.toFixed(4)) : 0,
          'Return On Investment': rec.RETURN ? parseFloat(rec.RETURN.toFixed(4)) : 0,
          'Broker Commissions': rec.COMMISS ? parseFloat(rec.COMMISS.toFixed(0)) : 0,
          'Broker Fees': rec.FEES ? parseFloat(rec.FEES.toFixed(0)) : 0,
          'Broker %': rec.BROKERPCT ? parseFloat(rec.BROKERPCT.toFixed(4)) : 0,
          'Admin Expense': rec.EXPADMIN,
          'Other Expense': rec.EXPOTHER,
          'Professional Expense': rec.EXPPROFFEE,
          'Advisor Expense': rec.EXPINVADV,
          'Total Plan Expense': rec.EXPTOTPLN,
          'Total Admin Expense': rec.EXPTOTADM,
          'Total Admin Expense %': rec.EXPTOTADMPCT ? parseFloat(rec.EXPTOTADMPCT.toFixed(4)) : 0,
          Industry: rec.BUSCODE,
          'Plan Year End': rec.YEAREND,
          'Final Report': rec.FINAL === 0 ? true : false,
          'Loans as % of Plan Assets': rec.PARTLOANS ? parseFloat(rec.PARTLOANS.toFixed(4)) : 0,
          'Certain Deemed and/or Corrective Distributions': rec.DISTRB ? parseFloat(rec.DISTRB.toFixed(4)) : 0,
          'Audit Reported': rec.OPINIONTYP,
          'Failed to Transmit Participant Contributions': rec.TRANSMIT,
          'Plan Not Covered by Fidelity Bond': rec.FDLTYBDIND,
          'Plan Had Nonexempt Transactions': rec.NONEXEMPT,
          'Loss Due to Fraud/Dishonesty': rec.LOSS,
          'Revenue Share as % of Plan Assets': rec.REVENUE ? parseFloat(rec.REVENUE.toFixed(4)) : 0,
          Broker: rec.BROKER,
          'Service Provider': rec.PROVIDER,
          'Insurance Carrier': rec.INSCARRIER,
          'Estimated 1st Year Contribution': rec.estimatedAnnualContributions
        }
      })
      return xlHeaders
    }
    function loadActivity() {
      if (reports.value === 'Activity') {
        loadAll.value = false
      }
    }
    function closePopUpEvent() {
      pdfDialog.value = false
    }
    const onPopUpEvent = (url, data) => {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          pdfDialog.value = true
          pdfUrl.value = url
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
    function proposalModelfundMode(modelfundObject, type) {
      investmentCount.value = modelfundObject.modelsCount
      investmentCount2.value = modelfundObject.fundsCount
      investmentEdit.value = true
      investmentStart.value = false
      if (modelfundObject.modelsCount === 0 && modelfundObject.fundsCount === 0) {
        investmentEdit.value = false
        investmentStart.value = true
      } else {
        hideInvestmentStart.value = false
        hidePlanFeeStart.value = false
        disableReport.value = false
      }
      if (hideInvestmentStart.value && modelfundObject.modelsCount === 0 && modelfundObject.fundsCount === 0) {
        investmentEdit.value = false
        investmentStart.value = true
      }
      if (type === 'load') {
        load3.value = false
      }
    }

    function activityAction(action, report, data) {
      if (action === 'editStepper') {
        if (report === 'comparison') {
          reportsTab.value = items.value.findIndex((a) => a.value === 'RPEA')
        } else if (report === 'diagnostic') {
          reportsTab.value = items.value.findIndex((a) => a.value === 'Diagnostic')
        } else {
          reportsTab.value = items.value.findIndex((a) => a.value === 'Proposal')
        }
        getManager()
        assignReports()
      } else if (action === 'downloadReport') {
        $axios
          .get(`/api/v1/tal/report/${report}/${data}/exists`)
          // eslint-disable-next-line no-unused-vars
          .then((response) => {
            onPopUpEvent(`/api/v1/tal/report/${report}/download?reportName=${data}&inline=false`, data)
          })
          .catch(() => {
            var msg = 'A current report is not available. Please generate a new report for this opportunity.'
            toast.info(msg, { autoClose: 5000 })
          })
      }
    }
    function updateProgress() {
      timer.value = setInterval(function () {
        if (planInformationProgress.value) planInformationProgress.value.getPlanProgress()
      }, 80000)
    }
    function getActivity() {
      if (reports.value === 'Activity') {
        activityDiv.value.getPlanDetail()
      }
    }
    function getStage(planStage) {
      if (planStage && planStage.length > 0) {
        clearInterval(timer.value)
        if (reports.value === 'Diagnostic') {
          hasDiagnosticCreated.value = planStage[0].Stage.includes('Diagnostic')
          assignHideProvider()
        } else if (reports.value === 'RPEA') {
          hasRpeaCreated.value = planStage[0].Stage.includes('Comparison')
          assignHideProvider()
        }
      }
    }
    function getProgress(val) {
      var planProgress = {
        latestStage: val === 'RPEA' ? 'Comparison' : val,
        time: new Date(),
        planId: planId.value,
        seinpno: selectedPlan.value.SEINPNO
      }
      var index = $store.state.planProgress.findIndex((item) => item.planId === planId.value)
      if (index > -1) $store.state.planProgress.splice(index, 1, planProgress)
      else $store.state.planProgress.push(planProgress)
      if (planInformationProgress.value) planInformationProgress.value.getPlanProgress()
      updateProgress()
    }
    function assignHideProvider() {
      if (reports.value === 'Diagnostic') {
        if (
          (currentPresenterName.value && currentPresenterName.value !== 'N/A') ||
          investmentList.value.length > 0 ||
          hasDiagnosticCreated.value
        ) {
          hideProvider.value = false
          disableReport.value = false
        } else {
          hideProvider.value = true
          disableReport.value = true
        }
      } else if (reports.value === 'RPEA') {
        var selectedModelCount = 0
        var selectedFundCount = 0
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          selectedModelCount = Number(mmlStrategist.value.length)
          selectedFundCount = Number(mmlInvestment.value.length)
        } else {
          selectedModelCount = Number(modelCount.value)
          selectedFundCount = Number(fundCount.value)
        }
        if (
          investmentCount.value > 0 ||
          providerCurrentFeeList.value.length > 0 ||
          providerScheduleList.value.length > 0 ||
          selectedModelCount > 0 ||
          selectedFundCount > 0 ||
          hasRpeaCreated.value ||
          (currentPresenterName.value && currentPresenterName.value !== 'N/A')
        ) {
          hideProvider.value = false
          hideInvestmentStart.value = false
          hidePlanFeeStart.value = false
          disableReport.value = false
        } else {
          hideProvider.value = false
          hideInvestmentStart.value = true
          hidePlanFeeStart.value = true
          disableReport.value = true
        }
      }
    }
    function formatPercent(val) {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    }
    function getProposalPermission() {
      $axios.get(`/api/v1/tal/proposal/proposalpermission`).then((success) => {
        var proposalPermission = success.data.d && success.data.d.length > 0 ? success.data.d : []
        eventBus.emit('proposalPermission', proposalPermission)
      })
    }
    const saveESPType = async (val) => {
      if ($store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
        var esp = showESPType.value ? espTypeSelected.value : $authz.firmRelationship.Single_Employer_Plan
        if (esp === $authz.firmRelationship.Pooled_Employer_Plan) {
          proposalPlan.value.ServiceType = 0
        }
        await $axios.put(
          `/api/v1/diagnostic/${$store.state.user.id}/espType?plandId=${planId.value}&espType=${esp}&serviceType=${proposalPlan.value.ServiceType}`
        )
        if (val) eventBus.emit('saveESPValue', esp)
      }
    }
    function showHideStepper(val, type) {
      if ($store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
        espTypeSelected.value = val
        if (planId.value > 0) {
          if (val === $authz.firmRelationship.Pooled_Employer_Plan) {
            if (items.value && items.value.length > 0) {
              let diagnosticPosition = items.value.findIndex((a) => a.value === 'Diagnostic')
              if (diagnosticPosition > -1) items.value.splice(diagnosticPosition, 1)
              let rpeaPosition = items.value.findIndex((a) => a.value === 'RPEA')
              if (rpeaPosition > -1) items.value.splice(rpeaPosition, 1)
              if (diagnosticPosition > -1 && rpeaPosition > -1) {
                el.value = -1
                if (reports.value === 'Diagnostic' || reports.value === 'RPEA') {
                  reports.value = 'Proposal'
                }
                let index = items.value.findIndex((a) => a.value === reports.value)
                reportsTab.value = index > -1 ? index : 0
                assignReports()
                if (reports.value === 'Activity') {
                  refreshComponent.value += 1
                } else {
                  modelfundComponent.value += 1
                  refreshComponent.value += 1
                  if (reports.value === 'RPEA') refreshServiceComponent.value += 1
                }
                if (reports.value === 'Proposal') {
                  GetProposalPlan(true)
                }
              } else {
                assignReports()
                if (reports.value === 'Proposal') {
                  GetProposalPlan(true)
                  modelfundComponent.value += 1
                  refreshComponent.value += 1
                }
              }
            }
          } else if (val === $authz.firmRelationship.Single_Employer_Plan) {
            if (planTypeValue.value) {
              if (
                planTypeValue.value === $authz.planType.Defined_Contribution_Plan ||
                planTypeValue.value === $authz.planType.ERISA_403_b
              ) {
                items.value = tabList.value.slice(0)
                if (items.value && items.value.length > 0) {
                  el.value = -1
                  let indexValue = items.value.findIndex((a) => a.value === reports.value)
                  reportsTab.value = indexValue > -1 ? indexValue : 0
                  assignReports()
                  if (reports.value === 'Activity') {
                    refreshComponent.value += 1
                  } else {
                    modelfundComponent.value += 1
                    refreshComponent.value += 1
                    if (reports.value === 'RPEA') refreshServiceComponent.value += 1
                  }
                  if (reports.value === 'Proposal') {
                    GetProposalPlan(true)
                  }
                }
              } else if (type && type === 'load') {
                if (reports.value === 'Proposal') {
                  GetProposalPlan(true)
                }
                assignReports()
              }
            }
          }
        } else {
          assignReports()
          if (reports.value === 'Proposal') {
            GetProposalPlan(true)
            modelfundComponent.value += 1
            refreshComponent.value += 1
          }
        }
      }
    }
    function loadStepperDetail() {
      GetProposalPlan(true)
      reports.value = $route.query.reportOption
      reportsTab.value = reports.value === 'Proposal' ? 0 : 1
      if ($route.query.type && $route.query.type === 'NewPlan') {
        hidePlanFeeStart.value = true
        hideInvestmentStart.value = true
        disableReport.value = true
      }
      assignReports()
    }
    function cancelChanges(val) {
      if (reports.value === 'Diagnostic') {
        if (val === '1') {
          if (presenter.value) {
            presenter.value.abondonPresenterChanges()
          }
          step1Error.value = false
          showFirstStepper.value = false
        }
        if (val === '2') {
          if (Investment.value) {
            Investment.value.abondonInvestment()
          }
          step2Error.value = false
          step3Error.value = false
          investmentType.value = 'Add Plan Investments to Lineup'
          showInvestmentLineup.value = true
          availableInvestment.value = false
          showSecondStepper.value = false
        }
      }
      if (reports.value === 'RPEA') {
        if (val === '1') {
          if (presenter.value) {
            presenter.value.abondonPresenterChanges()
          }
          step1Error.value = false
          validationIssue.value = false
          showFirstStepper.value = false
        }
        if (val === '2') {
          if (Investment.value) {
            Investment.value.abondonInvestment()
          }
          step2Error.value = false
          step3Error.value = false
          investmentType.value = 'Add Plan Investments to Lineup'
          showInvestmentLineup.value = true
          availableInvestment.value = false
          showSecondStepper.value = false
        }
        if (val === '3') {
          if (ServiceProvider.value) {
            ServiceProvider.value.createFeeDialog = false
            ServiceProvider.value.abondondServiceProvider()
          }
          showThirdStepper.value = false
        }
        if (val === '4') {
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            if (modelFund.value) {
              modelFund.value.fundDialog = false
              modelFund.value.abondonInvestment()
            }
          } else {
            if (modelFund.value) {
              modelFund.value.modelDialog = false
              modelFund.value.resetModel()
              modelFund.value.fundDialog = false
              modelFund.value.resetFund()
              modelFund.value.abondonModelFund()
            }
          }
          step4Error.value = false
          step5Error.value = false
          showModelCount.value = true
          showFourthStepper.value = false
        }
      }
      if (reports.value === 'Proposal') {
        if (val === '1') {
          if (planInformation.value) planInformation.value.abondonProposalPlanInfo()
          showFirstStepper.value = false
          step1Error.value = false
        }
        if (val === '2') {
          if (presenter.value) presenter.value.abondonPresenterChanges()
          showSecondStepper.value = false
          step2Error.value = false
          if (hideInvestmentStart.value) hideInvestmentStart.value = false
        }
        if (val === '3') {
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            if (modelFund.value) {
              modelFund.value.fundDialog = false
              modelFund.value.abondonInvestment()
            }
          } else {
            if (proposalInvestment.value) {
              proposalInvestment.value.abondonModelFund()
            }
          }
          step3Error.value = false
          showThirdStepper.value = false
        }
        if (val === '4') {
          if (PlanFees.value) {
            PlanFees.value.abondondPlanFees()
          }
          step4Error.value = false
          step5Error.value = false
          showFourthStepper.value = false
        }
      }
    }
    const saveStepper = async (val) => {
      var savePromises = []
      saveLoading.value = true
      toast.clearAll()
      if (reports.value === 'Diagnostic') {
        if (val === '1') {
          var isPresenterDiagnosticValid = presenter.value.validatePresenter()
          if (!isPresenterDiagnosticValid) {
            step1Error.value = true
            validationIssue.value = true
            saveLoading.value = false
            return
          } else {
            savePromises.push(presenter.value.SavePresenterandPlan())
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
            validationIssue.value = false
            step1Error.value = false
            hideProvider.value = false
            disableReport.value = false
            saveLoading.value = false
            showFirstStepper.value = false
          }
        }
        if (val === '2') {
          var isProviderDiagnosticValid = true
          if (availableInvestment.value) isProviderDiagnosticValid = Provider.value.validateProvider()
          var isInvestmentDiagnosticValid = true
          if (Investment.value.additionalInvestment) Investment.value.removeError()

          if (!isProviderDiagnosticValid || !isInvestmentDiagnosticValid) {
            saveLoading.value = false
            step2Error.value = true
            validationIssue.value = true
          } else {
            savePromises.push(Investment.value.saveInvestment())
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
            validationIssue.value = false
            step2Error.value = false
            step3Error.value = false
            investmentType.value = 'Add Plan Investments to Lineup'
            showInvestmentLineup.value = true
            availableInvestment.value = false
            hideInvestmentStart.value = false
            hidePlanFeeStart.value = false
            disableReport.value = false
            saveLoading.value = false
            showSecondStepper.value = false
          }
        }
      }
      if (reports.value === 'RPEA') {
        if (val === '1') {
          var ispresenterRPEAValid = presenter.value.validatePresenter()
          if (!ispresenterRPEAValid) {
            step1Error.value = true
            validationIssue.value = true
            saveLoading.value = false
            return
          } else {
            savePromises.push(presenter.value.SavePresenterandPlan())
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
            if (ServiceProvider.value) {
              ServiceProvider.value.loadFees(totalAssetValue.value, balanceParticipants.value)
            }
            validationIssue.value = false
            step1Error.value = false
            hideProvider.value = false
            saveLoading.value = false
            showFirstStepper.value = false
          }
        }
        if (val === '2') {
          var isproviderRPEAValid = true
          if (availableInvestment.value) isproviderRPEAValid = Provider.value.validateProvider()
          var isInvestmentRPEAValid = true
          if (Investment.value.additionalInvestment) Investment.value.removeError()

          if (!isproviderRPEAValid || !isInvestmentRPEAValid) {
            step2Error.value = true
            validationIssue.value = true
            saveLoading.value = false
            return
          } else {
            savePromises.push(Investment.value.saveInvestment())
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
            validationIssue.value = false
            step2Error.value = false
            investmentType.value = 'Add Plan Investments to Lineup'
            showInvestmentLineup.value = true
            availableInvestment.value = false
            hideInvestmentStart.value = false
            saveLoading.value = false
            showSecondStepper.value = false
          }
        }
        if (val === '3') {
          savePromises.push(ServiceProvider.value.saveFees('Save'))
          savePromises.push(await saveDraft())
          await Promise.allSettled(savePromises)
          eventBus.emit('feeAdjustmentDoneForRPEA', true)
          validationIssue.value = false
          saveLoading.value = false
          hidePlanFeeStart.value = false
          disableReport.value = false
          showThirdStepper.value = false
        }
        if (val === '4') {
          var isModelFundListValid = modelFund.value.validateModelFundList()
          if (!isModelFundListValid) {
            step5Error.value = true
            validationIssue.value = true
            saveLoading.value = false
            return
          } else {
            savePromises.push(modelFund.value.saveProposalHoldings())
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
            validationIssue.value = false
            step5Error.value = false
            disableReport.value = false
            saveLoading.value = false
            showFourthStepper.value = false
          }
        }
      }
      if (reports.value === 'Proposal') {
        if (val === '1') {
          var isplanInformationValid = planInformation.value.validatePlanInformation()
          if (!isplanInformationValid) {
            step1Error.value = true
            saveLoading.value = false
            validationIssue.value = true
          } else {
            savePromises.push(planInformation.value.saveInformation(true))
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
          }
        }
        if (val === '2') {
          var ispresenterProposalValid = presenter.value.validatePresenter()
          if (!ispresenterProposalValid) {
            step2Error.value = true
            saveLoading.value = false
            validationIssue.value = true
            return
          } else {
            savePromises.push(presenter.value.SavePresenterandPlan(true))
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
          }
        }
        if (val === '3') {
          var isStrategistListValid = true
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            isStrategistListValid = modelFund.value.validateModelFundList()
          }
          if (!isStrategistListValid) {
            step3Error.value = true
            validationIssue.value = true
            saveLoading.value = false
            return
          } else {
            var feePromises = []
            if (
              $authz.allowedByProgram(
                $authz.programPermissionSet.PCS_Aspire_Product__c,
                $authz.pcsAspireProduct.Multi_Strategist_Product
              )
            ) {
              await modelFund.value.saveProposalHoldings()
            } else {
              await proposalInvestment.value.saveProposalModelInvestment()
            }
            feePromises.push(PlanFees.value.getExpense(true))
            feePromises.push(PlanFees.value.getOffsetOverride(true))
            feePromises.push(await saveDraft())
            await Promise.all(feePromises)
            setTimeout(() => {
              validationIssue.value = false
              step3Error.value = false
              hidePlanFeeStart.value = false
              saveLoading.value = false
              showThirdStepper.value = false
              disableReport.value = false
            }, 5000)
          }
        }
        if (val === '4') {
          var isPlanFeesProposalValid = PlanFees.value.validatePlanFees()
          if (isPlanFeesProposalValid === undefined) isPlanFeesProposalValid = true
          if (!isPlanFeesProposalValid) {
            step4Error.value = true
            validationIssue.value = true
            saveLoading.value = false
            step5Error.value = false
            return
          } else {
            savePromises.push(PlanFees.value.savePlanFees(true))
            savePromises.push(await saveDraft())
            await Promise.allSettled(savePromises)
            eventBus.emit('feeAdjustmentDone', true)
          }
        }
      }
    }
    const saveProposalPlanFees = async (proposalPlan) => {
      ancillaryFee.value = proposalPlan.AncillaryFee
      excludeSummary.value = proposalPlan.ExcludeSummary
      removeParam()
      setTimeout(() => {
        validationIssue.value = false
        step4Error.value = false
        saveLoading.value = false
        showFourthStepper.value = false
        step5Error.value = false
      }, 5000)
    }
    const savePresenterData = async (val, proposalPlan) => {
      tpa.value = proposalPlan.TPA
      serviceType.value = proposalPlan.ServiceType
      mml.value = proposalPlan.MML ? proposalPlan.MML : 0
      removeParam()
      if (val) await GetProposalPlan(false)
      if (PlanFees.value) PlanFees.value.loadTypeValue = 'load'
      setTimeout(() => {
        validationIssue.value = false
        hideInvestmentStart.value = false
        step2Error.value = false
        saveLoading.value = false
        showSecondStepper.value = false
      }, 5000)
    }
    const savePlanInfo = async (val, proposalPlan) => {
      removeParam()
      if (proposalPlan.DCPTYPE === $authz.planType.Simple_IRA_Plan_Proposal) {
        validationIssue.value = false
        step1Error.value = false
        saveLoading.value = false
        hideProvider.value = false
        showFirstStepper.value = false
        $router.push({
          path: `/TAL/SimpleIRAPlan/${proposalPlan.SEINPNO ? proposalPlan.SEINPNO : 'startup'}`,
          query: {
            reportOption: 'Proposal',
            planId: planId.value,
            planLeadId: planLeadID.value
          }
        })
      } else {
        if (val) await GetProposalPlan(false)
        if (PlanFees.value) PlanFees.value.loadTypeValue = 'load'
        setTimeout(() => {
          validationIssue.value = false
          step1Error.value = false
          saveLoading.value = false
          hideProvider.value = false
          showFirstStepper.value = false
        }, 5000)
      }
    }
    const saveDraft = async () => {
      $axios.post(
        `/api/v1/tal/report/${selectedPlan.value.SEINPNO ? selectedPlan.value.SEINPNO : 'startup'}/${planId.value}/draft`
      )
    }
    function showHideRPEA() {
      if (planId.value > 0) {
        if (espTypeSelected.value === $authz.firmRelationship.Pooled_Employer_Plan) {
          showRpea.value = false
        } else if (espTypeSelected.value === $authz.firmRelationship.Single_Employer_Plan) {
          if (planTypeValue.value) {
            if (
              planTypeValue.value === $authz.planType.Defined_Contribution_Plan ||
              planTypeValue.value === $authz.planType.ERISA_403_b
            ) {
              showRpea.value = true
            } else showRpea.value = false
          }
        }
      } else if (planId.value < 0) showRpea.value = false
    }
    const dialogWidth = computed(() => {
      if (display.xl.value) return '70%'
      else if (display.lg.value) return '80%'
      else return '90%'
    })
    const fontSize = computed(() => {
      return 12
    })
    const showESPType = computed(() => {
      if ($store.state.user.selectedProgram) {
        if ($store.state.user.selectedProgram.esP_Type__c === $authz.firmRelationship.Pooled_Employer_Plan) {
          if (selectedPlan.value.DCPTYPE) {
            if (selectedPlan.value.DCPTYPE === $authz.planType.Defined_Contribution_Plan) {
              return true
            } else return false
          } else return false
        }
        return false
      }
      return false
    })
    const exportPermissionForAdvisor = computed(() => {
      if (
        $authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full) ||
        $store.state.advisorExportPermission === $authz.permission.FullAccess
      ) {
        return true
      } else {
        return false
      }
    })
    watch(
      investmentType,
      (newVal) => {
        if (newVal === 'Add Plan Investments to Lineup') {
          showInvestmentLineup.value = true
        } else showInvestmentLineup.value = false
      },
      { deep: true, immediate: true }
    )
    watch(reportsTab, (val) => {
      if (planId.value >= 0) {
        reports.value = items.value[val]
      } else if (planId.value < 0) {
        if (val === 0) reports.value = 'Proposal'
        if (val === 1) reports.value = 'Activity'
      }
      assignReports()
    })
    watch(reports, (oldvalue, newvalue) => {
      proposalReturnData.value = {}
      if (oldvalue !== newvalue) {
        el.value = -1
        if (oldvalue === 'Proposal') {
          GetProposalPlan(true)
        }
      }
    })
    watch(load1, () => {
      !load1.value && !load2.value && !load3.value && !load4.value ? (loadAll.value = false) : ''
    })
    watch(load2, () => {
      !load1.value && !load2.value && !load3.value && !load4.value ? (loadAll.value = false) : ''
    })
    watch(load3, () => {
      !load1.value && !load2.value && !load3.value && !load4.value ? (loadAll.value = false) : ''
    })
    watch(load4, () => {
      !load1.value && !load2.value && !load3.value && !load4.value ? (loadAll.value = false) : ''
    })
    watch(loadAll, (val) => {
      if (!val) el.value = -1
    })
    watch(availableInvestment, (val) => {
      if (!val) {
        step2Error.value = false
        validationIssue.value = false
      }
    })
    watch(
      tabList,
      () => {
        if ($authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None) || $route.query.planId < 0) {
          var showDiagnostic = tabList.value.findIndex((a) => a.value === 'Diagnostic')
          if (showDiagnostic > -1) tabList.value.splice(showDiagnostic, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) || $route.query.planId < 0) {
          var showComparison = tabList.value.findIndex((a) => a.value === 'RPEA')
          if (showComparison > -1) tabList.value.splice(showComparison, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)) {
          var showProposal = tabList.value.findIndex((a) => a.value === 'Proposal')
          if (showProposal > -1) tabList.value.splice(showProposal, 1)
        }
        items.value = tabList.value.slice(0)
      },
      { deep: true, immediate: true }
    )
    onBeforeMount(() => {
      window.onbeforeunload = () => {
        if (lastRoute.value && lastRoute.value !== '/') {
          localStorage.setItem('lastRoute', lastRoute.value)
        }
      }
    })
    onBeforeRouteLeave((to, from, next) => {
      if (!loadAll.value) {
        if (display.smAndDown.value && createReport.value) {
          next()
        } else {
          if (reports.value === 'Activity') {
            toRoute.value = to.fullPath
            next()
          } else {
            toRoute.value = to.fullPath
            next()
          }
        }
      } else next()
    })
    onMounted(() => {
      if (planTypeValue.value) {
        planLeadID.value = $route.query.planLeadId || ''
        if (
          planTypeValue.value !== planType.value.Defined_Contribution_Plan &&
          planTypeValue.value !== planType.value.ERISA_403_b
        ) {
          let diagnosticPosition = items.value.findIndex((a) => a.value === 'Diagnostic')
          if (diagnosticPosition > -1) items.value.splice(diagnosticPosition, 1)
          let rpeaPosition = items.value.findIndex((a) => a.value === 'RPEA')
          if (rpeaPosition > -1) items.value.splice(rpeaPosition, 1)
        }
      }

      if ($route.params.id) {
        if ($route.query.planId && $route.query.planId < 0) {
          planId.value = parseFloat($route.query.planId)
          loadStepperDetail() // Make sure this function is defined or imported
        } else {
          getPlanInformationDetail($route.params.id) // Make sure this function is defined or imported
        }
      } else if ($route.query.planId && $route.query.planId < 0) {
        loadStepperDetail() // Make sure this function is defined or imported
      }
    })

    onMounted(() => {
      if ($route.query.reportOption) {
        reports.value = $route.query.reportOption
      } else {
        reports.value = items.value[0]?.value
      }

      if (planId.value < 0) {
        reportsTab.value = reports.value === 'Proposal' ? 0 : 1
        showRpea.value = false
      } else {
        const index = items.value.findIndex((a) => a.value === reports.value)
        reportsTab.value = index
      }

      currentUser.value = $store.state.user.name

      // Assuming getManager, getContactInfo, and assignReports are adapted to Composition API
      getManager()
      assignReports()
      getContactInfo()
    })

    onMounted(() => {
      eventBus.on('showCurrentInvestment', (data) => {
        if (data) {
          showInvestmentLineup.value = false
          providerName.value = data
        }
      })
    })

    onUnmounted(() => {
      eventBus.off('showCurrentInvestment')
    })

    onBeforeRouteLeave((to, from, next) => {
      if (!loadAll.value) {
        if (display.smAndDown.value && !createReport.value) {
          next()
        } else {
          if (reports.value === 'Activity') {
            toRoute.value = to.fullPath
            next()
          } else {
            toRoute.value = to.fullPath
            next()
          }
        }
      } else next()
    })
    return {
      display,
      theme,
      $authz,
      $store,
      modelFund,
      proposalInvestment,
      presenter,
      PlanFees,
      Provider,
      Investment,
      ServiceProvider,
      planInformation,
      planInformationProgress,
      activityDiv,
      fontSize,
      prevRoute,
      exportPermissionForAdvisor,
      reportName,
      selectedPlan,
      reports,
      planId,
      createReport,
      reportsTab,
      items,
      loadAll,
      load1,
      load2,
      load3,
      load4,
      step1Error,
      step2Error,
      step3Error,
      step4Error,
      step5Error,
      showESPType,
      espTypeSelected,
      presenterEdit,
      type1,
      type2,
      type3,
      type4,
      type5,
      currentid,
      dialog,
      abondon,
      showAdvisorRequestForm,
      currentPresenterInfo,
      showRpea,
      rpeaLoading,
      companyName,
      planName,
      planType,
      federalID,
      address,
      city,
      totalAsset,
      proposalModelfundMode,
      estimatedAnnualContributions,
      asOfdate,
      balanceParticipants,
      partAsOfDate,
      companyStock,
      outsideAsset,
      selfDirectedBrokrage,
      planYearEnd,
      currentPresenterName,
      presenterStart,
      showFirstStepper,
      dialogWidth,
      parentReset,
      proposalPlan,
      saveLoading,
      hideProvider,
      providerEdit,
      investmentHeader,
      investmentList,
      investmentPagination,
      totalNewMgmt,
      totalNewLoad,
      totalNewSubta,
      totalNewExpratio,
      totalNewAMC,
      totalNewSSF,
      totalNewFees,
      currentUser,
      presentationDate,
      anticipatedDate,
      administrator,
      providerStart,
      showSecondStepper,
      investmentType,
      availableInvestment,
      showInvestmentLineup,
      currentInvestmentSelected,
      investmentSelected,
      hideInvestmentStart,
      investmentEdit,
      investmentCount,
      investmentCount2,
      startegistHeadersList,
      investmentLineUpTableHeader,
      mmlInvestment,
      providerCurrentFeeHeaders,
      providerCurrentFeeList,
      providerScheduleHeaders,
      providerScheduleList,
      showThirdStepper,
      checkProposalData,
      proposedModelSelected,
      proposedFundSelected,
      hidePlanFeeStart,
      modelfundEdit,
      feeHeaders,
      feeList,
      modelCount,
      fundCount,
      mmlStrategist,
      showFourthStepper,
      reportPermission,
      disableReport,
      reportDialog,
      loading,
      planTypeValue,
      exportToExcel,
      getActivity,
      getStage,
      selectedESPType,
      anticapteDate,
      investmentMode,
      rpeaModelFundMode,
      roposalModelfundMode,
      toggleStepper,
      loadRPEAInformation,
      formatPrice,
      PresenterMode,
      clearPresenterStartEdit,
      savePlanInfo,
      proposalPlanMode,
      saveStepper,
      cancelChanges,
      callCurrentInvestment,
      assignProvider,
      investmentTypeSelected,
      diagnosticReport,
      resetStepperValidation,
      selectedCurrentInvestment,
      selectedInvestmentList,
      addToAdditionalList,
      proposalPlanFeesMethod,
      formatPercent,
      ServiceProviderMode,
      getModelId,
      strategistMode,
      selectedModelList,
      selectedFundList,
      reportOptionSelected,
      showModelCountValue,
      mmlReportOption,
      savePresenterData,
      checkStandardPcs,
      saveProposalPlanFees,
      getReport,
      loadActivity,
      activityAction,
      pdfDialog,
      pdfUrl,
      closePopUpEvent
    }
  }
}
</script>
<style>
.hr_border_plan {
  max-width: 72% !important;
}
.hr_border_mobile {
  max-width: 80% !important;
}
.background_transparent {
  background: transparent !important;
}
.stepers_div .v-stepper__label {
  width: 100% !important;
}
.createReport .v-input__slot {
  background: rgb(var(--v-theme-accent)) !important;
  cursor: pointer !important;
}
.createProposalReport .v-input__slot {
  background: rgb(var(--v-theme-accent)) !important;
  cursor: default !important;
  padding-left: 30px;
}
.createReport label {
  color: white !important;
}
.createReport .v-select__selections {
  color: rgb(var(--v-theme-secondary)) !important;
}
.createProposalReport .v-select__selections {
  color: rgb(var(--v-theme-secondary)) !important;
  padding-left: 30px;
}
.createReport .v-select-list .v-list-item--active {
  background-color: rgb(var(--v-theme-accent)) !important;
}
.border_radius_2 {
  border-radius: 2px !important;
}

.alignStepper {
  margin-left: 36px !important;
  border-left: solid 1px rgb(var(--v-theme-accent)) !important;
}
.alignGreyStepper {
  margin-left: 36px !important;
  border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.stepper_main .v-stepper__step__step {
  border: solid 1px rgb(var(--v-theme-accent)) !important;
  color: rgb(var(--v-theme-accent)) !important;
  background: white !important;
}
.stepper_main .v-stepper__step--active .v-stepper__step__step {
  background: rgb(var(--v-theme-accent)) !important;
  color: white !important;
}
.step_error .v-stepper__step--active .v-stepper__step__step {
  background: red !important;
  color: white !important;
  border: solid red !important;
}
.step_error .stepred .v-stepper__step__step {
  background: red !important;
  color: white !important;
  border: solid red !important;
}
.step_error .v-stepper__step__step {
  border: solid 1px rgb(var(--v-theme-accent)) !important;
  color: rgb(var(--v-theme-accent)) !important;
  background: white !important;
}
.createReport .v-menu__content {
  overflow-y: hidden !important;
}
.plantabs .v-btn {
  text-transform: uppercase !important;
}
.plantabs .v-tabs__container {
  height: 45px !important;
}
.assign_darkMode_color {
  background-color: #424242 !important;
}
.maxHeight {
  height: 250px !important;
}
.v-icon--size-default {
  font-size: 24px !important;
}
</style>
<style scoped>
.theme--light.v-stepper--vertical .v-stepper__content:last-child,
.no_border {
  border-left: 0px solid rgba(0, 0, 0, 0.12) !important;
}

.dark_bg {
  background: #303030;
}
</style>
