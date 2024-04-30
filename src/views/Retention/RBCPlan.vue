<template>
  <v-container
    ref="printContent"
    :class="[$vuetify?.breakpoint?.smAndDown ? 'pl-1 pr-1' : 'container--fluid', $vuetify?.theme.dark ? 'dark_bg' : '']"
  >
    <loader v-model="loading" :loading="loading" />
    <v-container fluid class="pt-1" :class="$vuetify?.breakpoint?.smAndDown ? 'pl-0 pr-0' : 'container--fluid'">
      <v-col xs12 pt-2 pb-2>
        <v-row>
          <v-col class="pt-2" :class="$vuetify?.breakpoint?.smAndDown ? 'pl-2 pb-1' : 'pb-2'">
            <router-link
              :to="prevRoute.fullPath !== '/' ? (prevRoute.fullPath ? prevRoute.fullPath : '/') : lastRoute"
              class="text-decoration-none"
            >
              <span :class="$vuetify?.theme.dark ? 'text-white' : 'text-hyperlink'">
                <span data-html2canvas-ignore="true">
                  <v-icon size="small" :class="$vuetify?.theme.dark ? 'text-white pb-1' : 'text-hyperlink pb-1'"
                    >fas fa-angle-left</v-icon
                  >
                </span>
                <span
                  :class="
                    $vuetify?.theme.dark ? 'text-white pl-2 text-uppercase font_14' : 'text-hyperlink pl-2 text-uppercase font_14'
                  "
                  >Back</span
                >
              </span>
            </router-link>
          </v-col>
          <v-col class="text-right align-self" :class="$vuetify?.breakpoint?.smAndDown ? 'pt-2 pb-1' : ''">
            <a
              v-if="selectedPlan.PlanType === 'Simple IRA' && selectedPlan.PlanStatus === 'Live'"
              href="#"
              :class="
                !$vuetify?.theme.dark
                  ? 'text-hyperlink text-decoration-none text-uppercase font-weight-medium'
                  : 'text-white text-decoration-none text-uppercase font-weight-medium'
              "
              style="padding-right: 5px !important"
              @click="openEmployeeDataDialog()"
              >Upload Employee Data</a
            >
            <span v-if="selectedPlan.PlanType === 'Simple IRA' && selectedPlan.PlanStatus === 'Live'">|</span>
            <a
              v-if="exportPermissionForAdvisor"
              href="#"
              :class="
                !$vuetify?.theme.dark
                  ? 'text-hyperlink text-decoration-none text-uppercase font-weight-medium'
                  : 'text-white text-decoration-none text-uppercase font-weight-medium'
              "
              style="padding-right: 5px !important; padding-left: 5px !important"
              @click="exportToExcel()"
              >Export</a
            >
            <span v-if="exportPermissionForAdvisor" class="ml-4">|</span>
            <a
              v-if="false"
              :class="
                !$vuetify?.theme.dark
                  ? 'text-hyperlink text-decoration-none pr-2 text-uppercase font-weight-medium'
                  : 'text-white text-decoration-none pr-2 text-uppercase font-weight-medium'
              "
              style="padding-right: 5px !important; padding-left: 5px !important"
              @click="initiateManagePlanSSOLogin()"
            >
              Manage Plan
              <span data-html2canvas-ignore="true">
                <v-icon class="pl-1" size="small" :color="$vuetify?.theme.dark ? '' : 'hyperlink'"
                  >fas fa-external-link-alt</v-icon
                >
              </span>
            </a>
            <span v-if="false">|</span>
          </v-col>
          <div>
            <PlanStar
              :seinpno="selectedPlan.PLANID"
              from="RBC"
              :type="
                $route.query.type && $route.query.type.includes('School')
                  ? 'School'
                  : $route.query.type && $route.query.type.includes('Municipalities')
                    ? 'Municipality'
                    : 'Employer Sponsored'
              "
            />
          </div>
        </v-row>
      </v-col>
      <v-card>
        <v-col id="printMe">
          <v-col>
            <PlanInformation :selected-plan="selectedPlan" :printing="printing" />
          </v-col>
          <v-col>
            <PlanPerformance :selected-plan="selectedPlan" :SEINPNO="selectedPlan.EIN" />
          </v-col>
        </v-col>
        <v-col v-if="!createReport && startup === true" pa-2>
          <v-row>
            <v-col xs11 sm11>
              <h2>{{ selectedPlan.NAME }}</h2>
            </v-col>
            <v-col xs1 sm1>
              <PlanStar :seinpno="selectedPlan.PLANID" from="RBC" type="Employee Sponsored" />
            </v-col>
          </v-row>
        </v-col>
      </v-card>
      <v-col xs12 pb-4 />
      <v-col v-if="$vuetify?.breakpoint?.smAndDown ? (createReport ? true : false) : true" pt-1>
        <v-row>
          <v-col id="step1" :class="$vuetify?.breakpoint?.smAndDown ? 'xs11 sm11' : 'xs12 sm12'">
            <v-card>
              <v-tabs
                v-model="reportsTab"
                :bg-color="$vuetify?.theme.dark ? '' : 'accent'"
                class="plantabs"
                align-tabs="center"
                center-active
                show-arrows
                slider-color="white"
              >
                <v-tab v-for="(item, index) in items" :key="index" style :disabled="item.disableItem">
                  {{ item.text }}
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
          <v-col
            v-if="$vuetify?.breakpoint?.smAndDown"
            :class="$vuetify?.breakpoint?.smAndDown ? 'xs1 sm1 elevation-1 text-center' : ''"
            style="height: 45px !important"
            class="bg-accent"
            @click="createReport = !createReport"
          >
            <v-icon class="text-secondary pt-2 mt-1 cursor-pointer"> remove_circle </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        v-if="$vuetify?.breakpoint?.smAndDown"
        v-show="!createReport"
        xs12
        sm12
        mt-2
        class="pt-2 pb-2 pl-2 pr-1 bg-accent text-secondary border_radius_2"
        @click="createReport = !createReport"
      >
        <v-row>
          <v-col xs11 sm11 pt-1> Select Type </v-col>
          <v-col xs1 sm1 class="text-center cursor-pointer">
            <v-icon class="text-secondary"> add_circle </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-layout v-if="$vuetify?.breakpoint?.smAndDown ? (createReport ? true : false) : true" class="justify-center stepper_main">
        <v-col v-if="reports === 'Overview'" :class="$vuetify?.breakpoint?.smAndDown ? 'pa-2' : ''">
          <v-col xs12 pb-4 />
          <v-col xs12 lg12>
            <v-card class="elevation-6" :class="[fontSize < 17 && !$vuetify?.breakpoint?.xs ? 'chart_height' : '']">
              <v-col v-if="showloader" xs12 lg12 class="mt-0 pt-0 mb-0 ml-0 mr-0 pl-0 pr-0">
                <v-progress-linear v-if="showloader" indeterminate color="accent" height="4" class="ma-0" />
              </v-col>
              <v-col>
                <v-col v-if="assetsList.length > 0" pt-3 pb-4 pr-4>
                  <v-row>
                    <v-col xl6 pl-4>
                      <h2 v-if="!$vuetify?.breakpoint?.xs" class="font-weight-medium">
                        Total Plan Assets: {{ formatPrice(assetCount, 2) }}
                      </h2>
                      <h3 v-if="$vuetify?.breakpoint?.xs" class="font-weight-medium">
                        Total Plan Assets: {{ formatPrice(assetCount, 2) }}
                      </h3>
                    </v-col>
                    <v-col
                      v-if="$authz.hasPermission($authz.permissionSet.Clients_Export_Option__c, $authz.permission.Full)"
                      xl6
                      class="text-right text-accent cursor-pointer"
                    >
                      <p>
                        <span
                          :class="
                            !$vuetify?.theme.dark
                              ? 'text-hyperlink text-decoration-none text-uppercase font-weight-medium'
                              : 'text-white text-decoration-none text-uppercase font-weight-medium'
                          "
                          @click="exportAssets()"
                          >Export</span
                        >
                      </p>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="assetsList.length > 0">
                  <v-row>
                    <v-col
                      xl3
                      lg4
                      md5
                      sm5
                      xs12
                      :class="[$vuetify?.breakpoint?.lg ? 'mr-4' : 'pl-4', $vuetify?.breakpoint?.xs ? 'text-center' : '']"
                    >
                      <TotalPlanAsset v-if="assetsList.length > 0" :key="componentKey" :data="assetsList" :live-width="mywidth" />
                    </v-col>
                    <v-col xl7 lg7 md7 sm7 xs12 pb-2>
                      <v-col xs12>
                        <v-row>
                          <v-col xl6 lg6 md5 xs5 class="pl-4">
                            <h3 class="font-weight-medium">Investment</h3>
                          </v-col>
                          <v-col xl3 lg3 md4 xs4>
                            <h3 class="text-right pr-2 font-weight-medium">Amount($)</h3>
                          </v-col>
                          <v-col xl3 lg3 md3 xs3>
                            <h3 class="text-center font-weight-medium">Amount(%)</h3>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col pb-3 />
                      <v-col style="height: 230px !important; overflow-y: auto !important">
                        <v-col v-for="(item, index) in assetsList" :key="index" :class="index === 0 ? 'pt-3' : 'pt-2'">
                          <v-row>
                            <v-col xl6 lg6 md5 xs5 class="pl-2">
                              <v-col xs12>
                                <v-row>
                                  <v-col xl1 lg1 md2 xs2 class="pt-1" :class="$vuetify?.breakpoint?.xl ? 'pl-3' : ''">
                                    <div class="circle" :style="'background-color:' + assetcolors[index]" />
                                  </v-col>
                                  <v-col xl11 lg11 md10 xs10>
                                    <v-tooltip v-model="hideTooltip[index]" location="bottom">
                                      <template #activator="{ props }">
                                        <h3
                                          v-bind="props"
                                          class="wrap_investment_text"
                                          :class="$vuetify?.theme.dark ? 'text-white text-decoration-underline' : ''"
                                          @mouseover="hideTooltip[index] = true"
                                          @mouseleave="hideTooltip[index] = false"
                                        >
                                          {{ item.AssetName }}
                                        </h3>
                                      </template>
                                      <span
                                        :class="
                                          $vuetify?.theme.dark ? 'text-white font-weight-medium' : 'text-white font-weight-medium'
                                        "
                                        >{{ item.AssetName }}</span
                                      >
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-col>
                            <v-col xl3 lg3 md4 xs4>
                              <h3 class="text-right pl-3">
                                {{ formatPrice(item.DollarAmount, 2) }}
                              </h3>
                            </v-col>
                            <v-col xl3 lg3 md3 xs3>
                              <h3 class="text-center pl-4">{{ item.PercentAmount.toFixed(2) }}%</h3>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col v-if="!showloader && assetsList.length === 0" xs12 class="shortcutflex">
                <v-col class="imageflex mt-5" pl-3 pr-3>
                  <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                </v-col>
                <v-col xs12 text-center mt-2>
                  <h2 class="font-weight-medium">No Data Available</h2>
                </v-col>
              </v-col>
            </v-card>
          </v-col>
          <v-col xs12 pt-4>
            <v-row>
              <v-col xl6 lg6 md12 :class="$vuetify?.breakpoint?.lgAndUp ? 'pr-2' : 'pb-4'">
                <v-card class="elevation-6" :class="[fontSize < 17 && !$vuetify?.breakpoint?.xs ? 'chart_height' : '']">
                  <v-col v-if="showloader" xs12 lg12 class="mt-0 pt-0 mb-0 ml-0 mr-0 pl-0 pr-0">
                    <v-progress-linear
                      v-if="showloader"
                      indeterminate
                      color="accent"
                      height="4"
                      class="mt-0 pt-0 mb-0 ml-0 mr-0 pl-0 pr-0"
                    />
                  </v-col>
                  <v-row>
                    <v-col xl8 lg7 md8 sm8 class="pl-4 pt-2">
                      <h2 class="font-weight-medium">Participation Rate</h2>
                    </v-col>
                    <v-col v-if="!planSource" xl4 lg5 md4 sm4 pb-2 pl-4 pr-4 pt-2 class="text-right">
                      <v-col xl10 lg12 md12 sm12 :class="$vuetify?.breakpoint?.xl ? 'offset-xs2' : ''">
                        <v-select
                          v-model="participantType"
                          variant="outlined"
                          append-icon="icon-chevron-down"
                          :items="participantListType"
                          density="compact"
                          hide-details
                          :menu-props="{ zIndex: '1' }"
                          @update:model-value="changeParticipant()"
                        />
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-col xs12>
                    <v-row>
                      <v-col
                        v-if="!showloader && (participant.length === 0 || displayParticipantWithNoData)"
                        xs12
                        class="shortcutflex"
                      >
                        <v-col class="imageflex mt-5" pl-3 pr-3>
                          <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                        </v-col>
                        <v-col xs12 text-center mt-2>
                          <h2 class="font-weight-medium">No Data Available</h2>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col v-if="!showloader && participant.length > 0 && !displayParticipantWithNoData">
                    <v-row class="pl-4 pr-4 pb-4 pt-3">
                      <v-col xl6 lg7 md7 sm7 xs12 pt-2 :class="$vuetify?.breakpoint?.xs ? 'text-center' : ''">
                        <Participant
                          v-if="participant.length > 0"
                          :key="componentKey"
                          :live-width="mywidth"
                          :participant="participant"
                        />
                      </v-col>
                      <v-col
                        xl6
                        lg5
                        md5
                        sm5
                        xs12
                        pt-2
                        :class="[$vuetify?.breakpoint?.xs ? 'text-center' : '', fontSize > 14 ? 'pt-1' : 'pt-3']"
                      >
                        <v-tooltip location="top">
                          <template #activator="{ props }">
                            <v-col v-bind="props">
                              <h4
                                :class="$vuetify?.theme.dark ? 'text-white font-weight-medium' : 'text-accent font-weight-medium'"
                              >
                                Total Participants w/ Balances
                              </h4>
                              <h2 class="font-weight-medium">
                                {{ formatNumber(participant[1] ? participant[1].Number : 0) }}
                              </h2>
                            </v-col>
                          </template>
                          <span>
                            This includes participants with an account balance
                            <br />and termed participants with an account balance
                          </span>
                        </v-tooltip>
                        <v-col :class="fontSize > 14 ? 'py-1' : 'py-3'">
                          <h4 :class="$vuetify?.theme.dark ? 'text-white font-weight-medium' : 'text-accent font-weight-medium'">
                            Termed Participants w/ Balances
                          </h4>
                          <h2 class="font-weight-medium">
                            {{ formatNumber(participant[2] ? participant[2].Number : 0) }}
                          </h2>
                        </v-col>
                        <v-tooltip location="top">
                          <template #activator="{ props }">
                            <v-col v-bind="props">
                              <h4
                                :class="$vuetify?.theme.dark ? 'text-white font-weight-medium' : 'text-accent font-weight-medium'"
                              >
                                Total Active Participants
                              </h4>
                              <h2 class="font-weight-medium">
                                {{ formatNumber(participant[3] ? participant[3].Number : 0) }}
                              </h2>
                            </v-col>
                          </template>
                          <span>
                            This is the total eligible participants
                            <br />in the plan with and without a balance
                          </span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-card>
              </v-col>
              <v-col xl6 lg6 md12 :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-2' : 'pb-4'">
                <v-card class="elevation-6" :class="[fontSize < 17 && !$vuetify?.breakpoint?.xs ? 'chart_height' : '']">
                  <v-col v-if="showloader" xs12 lg12 class="mt-0 pt-0 mb-0 ml-0 mr-0 pl-0 pr-0">
                    <v-progress-linear v-if="showloader" indeterminate color="accent" height="4" class="ma-0" />
                  </v-col>
                  <v-row>
                    <v-col xl8 lg7 md8 sm8 class="pl-4 pt-2" :class="$vuetify?.breakpoint?.smAndDown ? 'xs6' : ''">
                      <h2 class="font-weight-medium">Cash Flow</h2>
                    </v-col>

                    <v-col v-if="!planSource" xl4 lg5 md4 sm4 pb-2 pl-4 pr-4 pt-2 class="text-right">
                      <v-col xl10 lg12 md12 sm12 :class="$vuetify?.breakpoint?.xl ? 'offset-xs2' : ''">
                        <v-select
                          v-model="cashflowType"
                          variant="outlined"
                          append-icon="icon-chevron-down"
                          :items="cashflowListType"
                          hide-details
                          :menu-props="{ zIndex: '1' }"
                          density="compact"
                          @update:model-value="changeCashFlow()"
                        />
                      </v-col>
                    </v-col>
                  </v-row>
                  <v-col xs12>
                    <v-row>
                      <v-col
                        v-if="!showloader && (cashFlowSum.length === 0 || displayCashFlowWithNoData)"
                        xs12
                        class="shortcutflex"
                      >
                        <v-col class="imageflex mt-5" pl-3 pr-3>
                          <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                        </v-col>
                        <v-col xs12 text-center mt-2>
                          <h2 class="font-weight-medium">No Data Available</h2>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="!showloader && !displayCashFlowWithNoData && cashFlowSum.length > 0">
                    <v-row class="pl-4 pr-4 pb-4 pt-1">
                      <v-col xl6 lg7 md7 sm7 xs12 pt-3 :class="$vuetify?.breakpoint?.xs ? 'text-center' : ''">
                        <Cashflow
                          v-if="cashFlowSum.length > 0"
                          :key="componentKey"
                          :live-width="mywidth"
                          :cash-flow="cashFlowSum"
                        />
                      </v-col>
                      <v-col xl6 lg4 md5 sm5 xs12 pt-3 :class="$vuetify?.breakpoint?.xs ? 'text-center' : ''">
                        <v-col :class="fontSize > 14 ? 'pt-1' : 'pt-3'">
                          <h4 :class="$vuetify?.theme.dark ? 'text-white' : 'text-accent'" class="font-weight-medium">
                            Contribution
                          </h4>
                          <h2 class="font-weight-medium">
                            {{ formatPrice(cashFlowSum[0].Amount ? cashFlowSum[0].Amount : 0, 2) }}
                          </h2>
                        </v-col>
                        <v-col :class="fontSize > 14 ? 'py-1' : 'py-3'">
                          <h4 :class="$vuetify?.theme.dark ? 'text-white' : 'text-accent'" class="font-weight-medium">
                            Rollovers
                          </h4>
                          <h2 class="font-weight-medium">
                            {{ formatPrice(cashFlowSum[1].Amount ? cashFlowSum[1].Amount : 0, 2) }}
                          </h2>
                        </v-col>
                        <v-tooltip location="top">
                          <template #activator="{ props }">
                            <v-col v-bind="props">
                              <h4 :class="$vuetify?.theme.dark ? 'text-white' : 'text-accent'" class="font-weight-medium">
                                Distributions
                              </h4>
                              <h2 class="font-weight-medium">
                                {{ formatPrice(cashFlowSum[2].Amount ? cashFlowSum[2].Amount : 0, 2) }}
                              </h2>
                            </v-col>
                          </template>
                          <span>Loans are included in distribution calculations.</span>
                        </v-tooltip>
                        <v-col :class="fontSize > 14 ? 'pt-1' : 'pt-3'">
                          <h4 :class="$vuetify?.theme.dark ? 'text-white' : 'text-accent'" class="font-weight-medium">Net</h4>
                          <h2 class="font-weight-medium">
                            {{
                              formatPrice(
                                (isNaN(cashFlowSum[0].Amount + cashFlowSum[1].Amount - cashFlowSum[2].Amount)
                                  ? 0
                                  : cashFlowSum[0].Amount + cashFlowSum[1].Amount - cashFlowSum[2].Amount
                                ).toFixed(2),
                                2
                              )
                            }}
                          </h2>
                        </v-col>
                      </v-col>
                    </v-row>
                    <!-- <v-col :class="!$vuetify?.breakpoint?.xs? 'marketInsightButtonPosition' : 'mt-1'">
                          <v-divider></v-divider> 
                          <v-layout>
                            <v-col xs12 text-left>       
                            <v-btn :color="$vuetify?.theme.dark?'':'accent'" 
                            text small class="mb-0" 
                            @click="dialog=true">
                            View Details</v-btn>
                            </v-col>
                            <v-col xs12 text-right>
                            <v-btn :color="$vuetify?.theme.dark?'':'accent'" 
                            text small class="mb-0" 
                            @click="exportCashFlow()">
                            Export</v-btn>
                            </v-col>
                          </v-layout>
                    </v-col>-->
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
        <v-col v-if="reports === 'Participants'" :class="$vuetify?.breakpoint?.smAndDown ? 'pa-2' : ''">
          <v-col>
            <v-col xs12 pb-4 />
            <v-card class="elevation-0">
              <v-col>
                <v-col xs12 class="mb-2">
                  ({{ new Intl.NumberFormat().format(participantCount) }} <span class="ml-1">found</span>)
                </v-col>
                <v-col xs12>
                  <v-data-table-server
                    :headers="headersForParticipantsTab"
                    :items="searchResult"
                    item-key="ssn"
                    class="elevation-2"
                    :options="options"
                    loader-height="2"
                    :loading="isProgressLinear"
                    mobile-breakpoint="0"
                    :hide-default-footer="true"
                    :hide-default-header="$vuetify?.breakpoint?.mdAndDown"
                    :items-length="totalIndividualPlans"
                  >
                    <template #top>
                      <v-col class="d-flex justify-end" :class="$vuetify?.breakpoint?.xs ? 'mt-5 mb-5' : 'mb-2 pl-5'">
                        <v-col xl4 lg5 sm12 md7 pt-2>
                          <v-row class="justify-end">
                            <v-col d-flex lg5 md4 sm4 pt-2 pr-2 :class="$vuetify?.breakpoint?.xs ? 'mb-1' : ' justify-end'">
                              <h4 class="font-weight-medium">Sort results by</h4>
                            </v-col>
                            <v-col lg7 md6 sm6 pr-2>
                              <v-select
                                v-model="sortByType"
                                :menu-props="{ zIndex: '9999' }"
                                :items="sortByListType"
                                append-icon="icon-chevron-down"
                                :class="$vuetify?.breakpoint?.xs ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                                :disabled="isProgressLinear"
                                hide-details
                                density="compact"
                                variant="outlined"
                                @update:model-value="getSortByData"
                              >
                                <template #selection="{ item }">
                                  <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ item.text }}</span>
                                </template>
                                <template #item="slotProps">
                                  <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ slotProps.item.text }}</span>
                                </template>
                              </v-select>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-col>
                    </template>
                    <template #item="{ item, isExpanded, expand }">
                      <tr v-if="!$vuetify?.breakpoint?.mdAndDown">
                        <td class="text-left text-capitalize pr-0">
                          <v-hover v-slot:default="{ hover }">
                            <v-tooltip location="right" color="#0077CC" opacity="1">
                              <template v-slot:activator="{ props }">
                                <v-flex v-bind="props">
                                  <v-row>
                                    <v-flex xs2 xl1>
                                      <v-icon size="18" class="icon-individual participantIcon width_10 pr-2 pl-1"></v-icon>
                                      <v-icon
                                        v-if="item.individualcount.length > 0 && item.individualcount[0].householdcount > 1"
                                        @click="expand(!isExpanded)"
                                        :class="isExpanded && index === index ? 'rotate_icon_plus_180' : ''"
                                        size="small"
                                        class="font-size-14 participantIcon"
                                        >fa-solid fa-caret-down</v-icon
                                      >
                                    </v-flex>
                                    <v-flex xs10 xl11>
                                      <a
                                        :class="[
                                          !$vuetify.theme.dark ? 'text-hyperlink' : 'text-white',
                                          hover ? 'text-decoration-underline' : 'text-decoration-none'
                                        ]"
                                        class="text-capitalize"
                                        @click="individualSSOToRelius(item.planID, item.ssn)"
                                      >
                                        {{ item.name ? item.name.toLowerCase() : '' }}
                                        {{
                                          item.individualcount[0].householdcount > 1
                                            ? '(' + item.individualcount[0].householdcount + ')'
                                            : ''
                                        }}
                                      </a>
                                    </v-flex>
                                  </v-row>
                                </v-flex>
                              </template>
                              <v-flex class="pa-1">
                                <v-flex v-if="item.streetAddress">
                                  {{ item.streetAddress ? item.streetAddress : '' }}
                                </v-flex>
                                <v-flex class="pt-1">
                                  <v-row no-gutters>
                                    <v-flex>
                                      {{ item.city ? item.city : '' }}{{ item.state ? ' ' + item.state + ',' : ''
                                      }}{{ item.zipCode ? ' ' + item.zipCode : '' }}
                                    </v-flex>
                                  </v-row>
                                </v-flex>
                                <v-flex class="pt-1" v-if="item.internetAddr">
                                  {{ item.internetAddr ? item.internetAddr : '' }}
                                </v-flex>
                                <v-flex class="py-1">
                                  <v-row no-gutters>
                                    <v-flex v-if="item.phone">
                                      {{ item.phone ? formatPhoneNumber(item.phone) : '' }}
                                    </v-flex>
                                  </v-row>
                                </v-flex>
                                <v-flex>{{ item.age ? item.age : '0' }} years old</v-flex>
                                <v-flex class="py-1">{{ item.displaySSN ? item.displaySSN : '' }}</v-flex>
                                <v-flex>
                                  <v-row no-gutters>
                                    <v-flex>
                                      {{ item.employmentStatus ? item.employmentStatus : ''
                                      }}{{ item.planStatus ? ', ' + item.planStatus : '' }}
                                      {{ item.accountStatus ? ', ' + item.accountStatus : ''
                                      }}{{ item.loanStatus ? ', ' + item.loanStatus : '' }}
                                    </v-flex>
                                  </v-row>
                                </v-flex>
                                <v-flex class="py-1"> (Click the name to go to account details) </v-flex>
                              </v-flex>
                            </v-tooltip>
                          </v-hover>
                        </td>
                        <td class="text-left wraptext">
                          <span class="mr-1">{{ item.planStatus }}</span>
                          <span v-if="item.terminationDate">({{ new Date(item.terminationDate).toLocaleDateString() }})</span>
                        </td>
                        <td class="text-right wraptext">
                          {{ item.age ? item.age : '-' }}
                        </td>
                        <td class="text-right wraptext">
                          {{ item.balance ? (item.balance === '0.00' ? '-' : formatPrice(item.balance, 2)) : '-' }}
                        </td>
                        <td class="text-right wraptext">
                          {{ item.income ? (item.income === '0.00' ? '-' : formatPrice(item.income, 2)) : '-' }}
                        </td>
                        <td class="text-right wraptext">
                          {{ item.savings ? (item.savings === '0.00' ? '-' : formatPrice(item.savings, 2)) : '-' }}
                        </td>
                        <td class="text-right wraptext">
                          {{ item.employer ? (item.employer === '0.00' ? '-' : formatPrice(item.employer, 2)) : '-' }}
                        </td>
                        <td class="text-right wraptext">
                          {{ item.ep ? `${item.ep}%` : '-' }}
                        </td>
                        <td class="text-right wraptext">
                          {{ item.currentLoansBalanceAmt ? formatPrice(item.currentLoansBalanceAmt, 2) : '-' }}
                        </td>
                        <td class="text-center">
                          <v-col>
                            <v-row class="justify-center">
                              <v-flex class="align-self xs4">
                                <v-btn
                                  icon
                                  class="ma-0"
                                  size="small"
                                  :color="!$vuetify?.theme.dark ? 'accent' : ''"
                                  variant="text"
                                  :disabled="item.Source"
                                  @click.stop="$set(closeReportPopUp, item.ssn, true)"
                                >
                                  <v-icon size="21" class="icon-action" />
                                </v-btn>
                                <v-dialog
                                  :key="item.ssn"
                                  v-model="closeReportPopUp[item.ssn]"
                                  max-width="400"
                                  content-class="elevation-3"
                                >
                                  <RBCReport
                                    :planID="item.planID"
                                    :ssn="item.ssn"
                                    fromPage="Participants"
                                    :planName="item.name"
                                    :targetObject="item"
                                    @closeReport="$set(closeReportPopUp, item.ssn, false)"
                                    :email="item.internetAddr"
                                  />
                                </v-dialog>
                              </v-flex>
                              <v-flex class="align-self xs4">
                                <PlanStar :seinpno="item.householdID" from="RBC" type="Individuals" :key="componentBookmarkKey" />
                              </v-flex>
                            </v-row>
                          </v-col>
                        </td>
                      </tr>
                      <tr
                        v-if="!$vuetify.breakpoint.mdAndDown"
                        v-show="isExpanded && index === index && item.individualAccount.length > 1"
                      >
                        <td>
                          <div class="position-class" :class="!$vuetify.theme.dark ? 'c_background' : 'accent'">
                            <v-flex xs12 class="ml-4">
                              <v-flex xs12>
                                <v-row>
                                  <v-flex xs12 mt-1>
                                    <v-row>
                                      <v-flex xs2 class="font-weight-medium" :class="$vuetify.theme.dark ? '' : 'text-accent'"
                                        >Accounts</v-flex
                                      >
                                      <v-flex
                                        xs3
                                        class="font-weight-medium ml-4"
                                        :class="$vuetify.theme.dark ? '' : 'text-accent'"
                                        >Account Type</v-flex
                                      >
                                      <v-flex xs2 class="font-weight-medium" :class="$vuetify.theme.dark ? '' : 'text-accent'"
                                        >Email</v-flex
                                      >
                                      <v-flex
                                        xs2
                                        class="font-weight-medium text-right"
                                        :class="$vuetify.theme.dark ? '' : 'text-accent'"
                                        >Total Value</v-flex
                                      >
                                      <v-flex
                                        xs2
                                        class="font-weight-medium text-right"
                                        :class="$vuetify.theme.dark ? '' : 'text-accent'"
                                        >Account #</v-flex
                                      >
                                    </v-row>
                                  </v-flex>
                                  <v-flex xs12>
                                    <v-row>
                                      <v-flex xs12 pb-3 v-for="(individual, index) in item.individualAccount" :key="index">
                                        <v-row>
                                          <v-flex xs2 :class="$vuetify.theme.dark ? '' : 'text-accent '">
                                            {{ individual.accountName }}
                                          </v-flex>
                                          <v-flex xs3 class="ml-4">{{ individual.accountType }}</v-flex>
                                          <v-flex xs2 class="word_break">
                                            {{ individual.accountContact ? individual.accountContact : '-' }}
                                          </v-flex>
                                          <v-flex xs2 class="text-right">
                                            {{ formatPrice(individual.totalValue, 2) }}
                                          </v-flex>
                                          <v-flex xs2 class="text-right">{{ individual.account }}</v-flex>
                                        </v-row>
                                      </v-flex>
                                    </v-row>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                            </v-flex>
                          </div>
                        </td>
                      </tr>
                      <tr v-else>
                        <td class="pr-3 pl-3">
                          <v-col mb-2>
                            <v-row>
                              <v-col xs10>
                                <v-row>
                                  <v-col xs12>
                                    <h5 class="pt-1">
                                      <v-row>
                                        <v-col xs1 pt-2>
                                          <v-icon size="18" class="icon-individual participantIcon width_10 pr-2 pl-1" />
                                        </v-col>
                                        <v-col pl-2>
                                          <span xs9>
                                            <span>Name</span>
                                            <br />
                                            <a
                                              :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                                              class="text-capitalize text-decoration-underline"
                                              @click="individualSSOToRelius(item.planID, item.ssn)"
                                            >
                                              <h4>
                                                {{ item.name ? item.name.toLowerCase() : '' }}
                                                {{
                                                  item.individualcount[0].householdcount > 1
                                                    ? '(' + item.individualcount[0].householdcount + ')'
                                                    : ''
                                                }}
                                              </h4>
                                            </a>
                                          </span>
                                        </v-col>
                                      </v-row>
                                    </h5>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-flex xs2 class="text-right cursor-pointer">
                                <v-btn icon variant="text" @click="expand(!isExpanded)">
                                  <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                                </v-btn>
                              </v-flex>
                              <v-flex xs12 class="mb-2">
                                <v-row>
                                  <v-flex xs8>
                                    <v-flex xs12>
                                      <h5>Email</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>
                                        <a class="word_break" :href="`mailto:${item.internetAddr}`" target="_blank">{{
                                          item.internetAddr
                                        }}</a>
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4 mb-2>
                                    <v-flex xs12>
                                      <h5>Account Balance</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>
                                        {{ formatPrice(item.balance, 2) }}
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex xs12 class="mb-2">
                                <v-row>
                                  <v-flex xs8 mb-2>
                                    <v-flex xs12>
                                      <h5>Salary</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ formatPrice(item.income, 2) }}</h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5>Age</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ item.age }}</h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex xs12>
                                <v-flex xs12 :class="$vuetify.breakpoint.xs ? 'pl-1' : ''">
                                  <v-row>
                                    <v-flex
                                      xs2
                                      sm1
                                      v-if="item.individualcount.length > 0 && item.individualcount[0].householdcount > 1"
                                      class="cursor-pointer align-self"
                                      @click="expand(!isExpanded)"
                                    >
                                      <customicon
                                        v-if="item.individualcount.length > 0 && item.individualcount[0].householdcount > 1"
                                        type="houseHoldIcon"
                                      />
                                    </v-flex>
                                    <v-flex xs2 sm1 class="align-self">
                                      <v-btn
                                        icon
                                        class="ma-0"
                                        size="small"
                                        :color="!$vuetify.theme.dark ? 'accent' : ''"
                                        variant="text"
                                        @click.stop="$set(closeReportPopUp, item.ssn, true)"
                                        :disabled="item.Source"
                                      >
                                        <v-icon size="small">fas fa-ellipsis-v</v-icon>
                                      </v-btn>
                                      <v-dialog
                                        :scrollable="false"
                                        v-model="closeReportPopUp[item.ssn]"
                                        max-width="400"
                                        content-class="elevation-3"
                                        :key="item.ssn"
                                      >
                                        <RBCReport
                                          :planID="item.planID"
                                          :ssn="item.ssn"
                                          fromPage="Participants"
                                          :planName="item.name"
                                          :targetObject="item"
                                          @closeReport="$set(closeReportPopUp, item.ssn, false)"
                                          :email="item.internetAddr"
                                        />
                                      </v-dialog>
                                    </v-flex>
                                    <v-flex xs2 sm1 class="align-self">
                                      <PlanStar
                                        :seinpno="item.householdID"
                                        from="RBC"
                                        type="Individuals"
                                        :key="componentBookmarkKey"
                                      />
                                    </v-flex>
                                  </v-row>
                                </v-flex>
                              </v-flex>
                            </v-row>
                          </v-col>
                        </td>
                      </tr>
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length" v-if="$vuetify.breakpoint.mdAndDown">
                        <v-card flat :class="$vuetify.theme.dark ? '' : 'expandable_background'">
                          <v-card-text>
                            <v-row>
                              <v-flex class="xs12" mb-2>
                                <v-row>
                                  <v-flex xs8>
                                    <v-flex xs12>
                                      <h5>Household</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ item.householdName }}</h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5>Phone</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ item.phone }}</h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex class="xs12" mb-2>
                                <v-row>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5>SSN</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ item.displaySSN }}</h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5 :class="$vuetify.breakpoint.xs ? 'pl-2 pb-0' : 'pl-0 pb-0'">Age</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4 :class="$vuetify.breakpoint.xs ? 'pl-2' : ''">
                                        {{ item.age }}
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5>Zip Code</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ item.zipCode }}</h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex xs12 mb-2>
                                <v-row>
                                  <v-flex :class="$vuetify.breakpoint.width <= 360 ? 'xs12' : 'xs12'">
                                    <v-flex xs12>
                                      <h5>Plan Name</h5>
                                    </v-flex>
                                    <v-flex xs12 class="text-capitalize">
                                      <h4>
                                        {{ item.plan ? item.plan.toLowerCase() : '' }}
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex class="xs12" mb-2>
                                <v-row>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5>Plan Status</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>
                                        <span class="mr-1">{{ item.planStatus }}</span>
                                        <span v-if="item.terminationDate"
                                          >({{ new Date(item.terminationDate).toLocaleDateString() }})</span
                                        >
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5>Account Status</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ item.employmentStatus }}</h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex class="xs12" mb-2>
                                <v-row>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5 class="pl-0 pb-0">Employment Status</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>{{ item.employmentStatus }}</h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5 class="pl-0 pb-0 pr-1">Employer Contributions</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>
                                        {{ formatPrice(item.employer, 2) }}
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                  <v-flex xs4>
                                    <v-flex xs12>
                                      <h5>Employee Contributions</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>
                                        {{ formatPrice(item.savings, 2) }}
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex class="xs12" mb-2>
                                <v-row>
                                  <v-flex xs6 sm4>
                                    <v-flex xs12>
                                      <h5 class="pl-0 pb-0">Equity Allocation</h5>
                                    </v-flex>
                                    <v-flex xs12>
                                      <h4>
                                        {{ item.ep ? `${item.ep}%` : '' }}
                                      </h4>
                                    </v-flex>
                                  </v-flex>
                                </v-row>
                              </v-flex>
                              <v-flex v-if="item.individualAccount && item.individualAccount.length > 1">
                                <v-flex
                                  class="xs12 hidedivider"
                                  v-for="(individual, index) in item.individualAccount"
                                  :key="index"
                                >
                                  <h3 class="mb-1 mt-2 text-blue font-weight-regular">
                                    {{ item.householdName }}
                                  </h3>
                                  <v-flex class="xs12" mb-2>
                                    <v-row>
                                      <v-flex xs8>
                                        <v-flex xs12>
                                          <h5 class="pl-0 pb-0">Account Name</h5>
                                        </v-flex>
                                        <v-flex xs12>
                                          <h4>{{ individual.accountName }}</h4>
                                        </v-flex>
                                      </v-flex>
                                      <v-flex xs4>
                                        <v-flex xs12>
                                          <h5 class="pl-0 pb-0">Balance</h5>
                                        </v-flex>
                                        <v-flex xs12>
                                          <h4>
                                            {{ formatPrice(individual.totalValue, 2) }}
                                          </h4>
                                        </v-flex>
                                      </v-flex>
                                    </v-row>
                                  </v-flex>
                                  <v-flex class="xs12" mb-2>
                                    <v-row>
                                      <v-flex xs8>
                                        <v-flex xs12>
                                          <h5 class="pl-0 pb-0">Account Type</h5>
                                        </v-flex>
                                        <v-flex xs12>
                                          <h4>{{ individual.accountType }}</h4>
                                        </v-flex>
                                      </v-flex>
                                      <v-flex xs4>
                                        <v-flex xs12>
                                          <h5 class="pl-0 pb-0">Account #</h5>
                                        </v-flex>
                                        <v-flex xs12>
                                          <h4>{{ individual.account }}</h4>
                                        </v-flex>
                                      </v-flex>
                                    </v-row>
                                  </v-flex>
                                  <v-divider class="my-3 divider"></v-divider>
                                </v-flex>
                              </v-flex>
                            </v-row>
                          </v-card-text>
                        </v-card>
                        <v-divider class="my-1 divider"></v-divider>
                      </td>
                    </template>
                  </v-data-table-server>
                  <Observer @intersect="participantIntersected" />
                  <Newloader v-model="isProgressLinear" :loading="isProgressLinear" />
                </v-col>
              </v-col>
            </v-card>
          </v-col>
        </v-col>
        <v-col v-if="reports === 'Reports'">
          <v-col xs12 pb-4 />
          <RBCReport
            :plan-i-d="selectedPlan.PLANID"
            from-page="PlanDetail"
            :plan-name="selectedPlan.NAME"
            :target-object="selectedPlan"
          />
        </v-col>
        <v-dialog v-model="dialog" max-width="700px">
          <v-card>
            <v-card-text>
              <v-col xs12>
                <v-row>
                  <v-col xs6>
                    <h4 class="text-accent cursor-pointer" @click="dialog = false">Hide Details</h4>
                  </v-col>
                  <v-col
                    v-if="$authz.hasPermission($authz.permissionSet.Clients_Export_Option__c, $authz.permission.Full)"
                    xs6
                    class="text-right cursor-pointer"
                  >
                    <h4 class="text-accent" @click="exportCashFlow()">Export</h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs12>
                <v-data-table v-model="selected" :headers="headers" :items="cashflowList" sortable>
                  <template #header="props">
                    <th v-for="(header, index) in props.headers" :key="index" :class="index === 0 ? 'text-left' : 'text-right'">
                      {{ header.text }}
                    </th>
                  </template>
                  <template #item="props">
                    <tr>
                      <td>
                        {{ props.item.Month.substring(0, 3) + ' ' + new Date(props.item.AsOf).getFullYear() }}
                      </td>
                      <td class="text-right">
                        {{ props.item.Contributions }}
                      </td>
                      <td class="text-right">
                        {{ props.item.Rollovers }}
                      </td>
                      <td class="text-right">
                        {{ props.item.Distributions }}
                      </td>
                      <td class="text-right">
                        {{ props.item.Net }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
    <v-col v-if="employeeUploadDialog" class="xs12">
      <UploadEmployeeData v-model="employeeUploadDialog" :sfplanid="selectedPlan.SFID" :plantypename="selectedPlan.PlanType" />
    </v-col>
  </v-container>
</template>
<script>
import PlanInformation from '@/components/Retention/PlanInformation'
import Loader from '@/components/Loader'
import RBCReport from '@/components/Retention/RBCReport'
import PlanStar from '@/components/TAL/PlanStar'
import TotalPlanAsset from '@/components/Retention/TotalPlanAsset'
import Participant from '@/components/Retention/Participant'
import Cashflow from '@/components/Retention/Cashflow'
import PlanPerformance from '@/components/Retention/PlanPerformance'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import UploadEmployeeData from '@/components/Retention/UploadEmployeeData'
import Observer from '@/components/Observer'
import Newloader from '@/components/NewLoader'
export default {
  components: {
    PlanInformation,
    Loader,
    RBCReport,
    PlanStar,
    TotalPlanAsset,
    Participant,
    Cashflow,
    PlanPerformance,
    UploadEmployeeData,
    Observer,
    Newloader
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  data() {
    return {
      componentBookmarkKey: 0,
      startup: false,
      prevRoute: '',
      loading: false,
      selectedPlan: {
        PLANID: '',
        NAME: '',
        ASSETS: 0,
        YrEndDate: '',
        PlanContactName: '',
        PlanContactPhone: '',
        PlanContactEmail: '',
        DCPTYPE: '',
        EIN: '',
        SNAME: '',
        SSTREET: '',
        SCITY: '',
        SSTATE: '',
        ZIPCODE: '',
        Models: 0,
        Investments: 0,
        TotalEmployees: 0,
        ActiveEmpWithBalance: 0,
        ActiveEmpWithOutBalance: 0,
        PlanSponsorName: '',
        PlanSponsorBillingStreet: '',
        PlanSponsorBillingCity: '',
        PlanSponsorBillingState: '',
        PlanSponsorBillingPostalCode: '',
        SponsorWebAccess: '',
        PlanType: '',
        SFID: ''
      },
      assetcolors: [
        '#ffbcc4',
        '#874594',
        '#d87c14',
        '#dc4a55',
        '#8676ad',
        '#cb3e70',
        '#004c91',
        '#ccaccb',
        '#e06138',
        '#b0bad9',
        '#564a98',
        '#f0854d',
        '#345d9d',
        '#e7cadd',
        '#ffbcc4',
        '#874594',
        '#d87c14',
        '#dc4a55',
        '#8676ad',
        '#cb3e70',
        '#004c91',
        '#ccaccb',
        '#e06138',
        '#b0bad9',
        '#564a98',
        '#f0854d',
        '#345d9d',
        '#e7cadd',
        '#c7cee5'
      ],
      items: [
        { text: 'Overview', value: 'Overview', disableItem: false },
        { text: 'Participants', value: 'Participants', disableItem: false },
        { text: 'Reports', value: 'Reports', disableItem: false }
      ],
      cashflowListType: [
        { text: 'Current', value: 0 },
        { text: 'Last Month', value: 4 },
        { text: '3 Months Ago', value: 1 },
        { text: '6 Months Ago', value: 2 },
        { text: '12 Months Ago', value: 3 }
      ],
      participantListType: [
        { text: 'Current', value: 0, sortable: false },
        { text: 'Last Month', value: 1 },
        { text: '3 Months Ago', value: 2 },
        { text: '6 Months Ago', value: 3 },
        { text: '12 Months Ago', value: 4 }
      ],
      participantsHeader: [
        { text: 'Account Name', value: 0 },
        { text: 'Balance', value: 4 },
        { text: 'Account Type', value: 1 },
        { text: 'Email', value: 2 },
        { text: 'Account #', value: 3 }
      ],
      cashflowType: 0,
      createReport: false,
      reports: 'Overview',
      participant: [],
      cashFlowSum: [],
      assetsList: [],
      participantType: 0,
      mywidth: 0,
      assetCount: 0,
      dialog: false,
      cashflowList: [],
      searchResult: [],
      headers: [
        { text: 'Month', value: '', sortable: false },
        { text: 'Contributions($)', value: '', sortable: false },
        { text: 'Rollovers($)', value: '', sortable: false },
        { text: 'Distributions($)', value: '', sortable: false },
        { text: 'Net($)', value: '', sortable: false }
      ],
      selected: [],
      componentKey: 0,
      hideTooltip: [],
      reportsTab: 0,
      planSource: undefined,
      comingSoonImage: require('@/assets/images/win.svg'),
      showloader: true,
      displayCashFlowWithNoData: false,
      options: {
        itemsPerPage: -1,
        sortBy: []
      },
      headersForParticipantsTab: [
        {
          text: 'Participant Name',
          value: 'name',
          align: 'start',
          width: '13%',
          sortable: false
        },
        {
          text: 'Plan Status (Termination Date)',
          value: 'planStatus',
          align: 'start',
          width: '10%',
          sortable: false
        },
        {
          text: 'Age',
          value: 'age',
          align: 'end',
          width: '10%',
          sortable: false
        },
        {
          text: 'Account Balance',
          value: 'balance',
          align: 'end',
          width: '9%',
          sortable: false
        },
        {
          text: 'Salary',
          value: 'income',
          align: 'end',
          width: '9%',
          sortable: false
        },
        {
          text: 'Employee Contributions',
          value: 'savings',
          align: 'end',
          width: '7%',
          sortable: false
        },
        {
          text: 'Employer Contributions',
          value: 'employer',
          align: 'end',
          width: '9%',
          sortable: false
        },
        {
          text: 'Equity Allocation',
          value: 'ep',
          align: 'end',
          width: '9%',
          sortable: false
        },
        {
          text: 'Loan Balance',
          value: 'currentLoansBalanceAmt',
          align: 'end',
          width: '9%',
          sortable: false
        },
        {
          text: 'Action',
          value: 'action',
          align: 'center',
          width: '9%',
          sortable: false
        }
      ],
      isProgressLinear: false,
      closeReportPopUp: {},
      longtap: false,
      lastRoute: '',
      displayParticipantWithNoData: false,
      employeeUploadDialog: false,
      sortByType: 'ParticipantName-Asc',
      sortByListType: [
        {
          text: 'Participant Name - A to Z',
          value: 'ParticipantName-Asc'
        },
        { text: 'Participant Name - Z to A', value: 'ParticipantName-Desc' },
        { text: 'Participant Age - Low to High', value: 'Age-Asc' },
        { text: 'Participant Age - High to Low', value: 'Age-Desc' },
        { text: 'Salary - Low to High', value: 'Salary-Asc' },
        { text: 'Salary - High to Low', value: 'Salary-Desc' },
        { text: 'Account Balance - Low to High', value: 'AccountBalance-Asc' },
        { text: 'Account Balance - High to Low', value: 'AccountBalance-Desc' },
        {
          text: 'Employee Contr. - Low to High',
          value: 'EmployeeContributions-Asc'
        },
        {
          text: 'Employee Contr. - High to Low',
          value: 'EmployeeContributions-Desc'
        },
        {
          text: 'Employer Contr. - Low to High',
          value: 'EmployerContributions-Asc'
        },
        {
          text: 'Employer Contr. - High to Low',
          value: 'EmployerContributions-Desc'
        },
        {
          text: 'Equity Allocation - Low to High',
          value: 'EquityAllocation-Asc'
        },
        {
          text: 'Equity Allocation - High to Low',
          value: 'EquityAllocation-Desc'
        },
        { text: 'Loan Balance - Low to High', value: 'LoanBalance-Asc' },
        { text: 'Loan Balance - High to Low', value: 'LoanBalance-Desc' },
        {
          text: 'Plan Status - A to Z',
          value: 'planStatus-Asc'
        },
        {
          text: 'Plan Status - Z to A',
          value: 'planStatus-Desc'
        },
        {
          text: 'Termination Date - Oldest to Recent',
          value: 'TerminationDate-Asc'
        },
        {
          text: 'Termination Date - Recent to Oldest',
          value: 'TerminationDate-Desc'
        }
      ],
      currentPageNumber: 1,
      totalIndividualPlans: -1,
      participantCount: 0
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    },
    exportPermissionForAdvisor() {
      if (
        this.$authz.hasPermission(this.$authz.permissionSet.Clients_Export_Option__c, this.$authz.permission.Full) ||
        this.$store.state.advisorExportPermission === this.$authz.permission.FullAccess
      ) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.params.id) {
          if (this.$route.query.s) this.planSource = this.$route.query.ss
          this.getPlanInformationDetail(this.$route.params.id)
        }
      },
      deep: true
    },
    assetsList: function () {
      var amount = 0
      this.assetsList.forEach((element) => {
        amount = amount + element.DollarAmount
      })
      this.assetCount = parseFloat(amount)
    },
    reportsTab: function (val) {
      if (val === 0) {
        this.reports = 'Overview'
      }
      if (val === 1) {
        this.reports = 'Participants'
      }
      if (val === 2) {
        this.reports = 'Reports'
      }
    },
    reports: function (val) {
      if (val === 'Participants') {
        this.searchResult = []
        this.currentPageNumber = 1
        this.getParticipantList()
      }
    },
    cashFlowSum: {
      handler() {
        this.showloader = false
      }
    }
  },
  unmounted() {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  created() {
    var that = this
    window.onbeforeunload = function () {
      if (that.prevRoute.fullPath !== '/') localStorage.setItem('rbcPlanLastRoute', that.prevRoute.fullPath)
    }
    if (localStorage.lastRoute && localStorage.lastRoute !== '/') this.lastRoute = localStorage.rbcPlanLastRoute
    if (this.$route.params.id) {
      if (this.$route.query.s) this.planSource = this.$route.query.s
      this.getPlanInformationDetail(this.$route.params.id)
    }
    window.addEventListener('scroll', this.scrollHandler)
    this.getValues()
  },
  mounted() {
    this.reports = 'Overview'
    this.reportsTab = 0
  },
  methods: {
    formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      }
      return ''
    },
    async participantIntersected() {
      if (!this.isProgressLinear) {
        if (parseInt(this.currentPageNumber) > 1) {
          if (this.searchResult && this.searchResult.length > 0) {
            if (this.totalIndividualPlans < this.participantCount) {
              this.getParticipantList('nextPage')
            }
          }
        }
      }
    },
    getSortByData() {
      this.currentPageNumber = 1
      this.searchResult = []
      this.totalIndividualPlans = -1
      this.getParticipantList()
    },
    printing() {
      const doc = new jsPDF('l', 'mm', 'a4')
      var that = this
      html2canvas(this.$refs.printContent, {
        letterRendering: 0,
        allowTaint: true,
        useCORS: true,
        scale: 5
      }).then(function (canvas) {
        const img = canvas.toDataURL('image/jpeg', 0.8)
        var width = doc.internal.pageSize.getWidth()
        var height = doc.internal.pageSize.getHeight()

        if (that.$vuetify?.breakpoint?.lg) doc.addImage(img, 'JPEG', 0, 0, 240, 200)
        else if (that.$vuetify?.breakpoint?.md) doc.addImage(img, 'JPEG', 30, 10, 240, 200)
        else if (that.$vuetify?.breakpoint?.sm) doc.addImage(img, 'JPEG', 10, 0, width - 20, height)
        else if (that.$vuetify?.breakpoint?.xs) doc.addImage(img, 'JPEG', 90, 10, 100, 200)
        else if (that.$vuetify?.breakpoint?.xl) doc.addImage(img, 'JPEG', 0, 0, width, height)
        doc.save('Plan_details.pdf')
      })
    },
    scrollHandler() {
      if (window.scrollY > 0) {
        this.componentKey += 1
        this.hideTooltip = []
      }
    },
    async getPlanInformationDetail(planId) {
      var tgt = this.planSource ? 'tsm' : 'rbc'

      if (this.planSource) this.items.find((t) => t.text === 'Reports').disableItem = true

      await this.$axios.get(`/api/v1/retention/${tgt}/plan/${planId}`).then((success) => {
        this.selectedPlan = success.data.d.length > 0 ? success.data.d[0] : []
      })
    },
    changeCashFlow() {
      var planId = this.$route.params.id
      if (!this.planSource) planId += ';'
      var tgt = this.planSource ? 'tsm' : 'rbc'

      this.$axios
        .get(`/api/v1/retention/${tgt}/cashflowsum/${this.cashflowType}?planId=${planId}`)
        .then((success) => {
          if (success.data.d.length > 0) {
            this.cashFlowSum = success.data.d
            this.showloader = false
            if (
              (this.cashFlowSum[0].Amount === null || this.cashFlowSum[0].Amount === 0) &&
              (this.cashFlowSum[1].Amount === null || this.cashFlowSum[1].Amount === 0) &&
              (this.cashFlowSum[2].Amount === null || this.cashFlowSum[2].Amount === 0)
            ) {
              this.displayCashFlowWithNoData = true
            } else {
              this.displayCashFlowWithNoData = false
            }
          } else {
            this.cashFlowSum = []
            this.displayCashFlowWithNoData = true
            this.showloader = false
          }
        })
        .catch(() => {
          this.cashFlowSum = []
          this.displayCashFlowWithNoData = true
          this.showloader = false
        })
    },
    changeParticipant() {
      var planId = this.$route.params.id
      if (!this.planSource) planId += ';'
      var tgt = this.planSource ? 'tsm' : 'rbc'

      this.$axios
        .get(`/api/v1/retention/${tgt}/participation/${this.participantType}?planId=${planId}`)
        .then((success) => {
          this.participant = success.data.d && success.data.d.length > 0 ? success.data.d : []
          this.showloader = false
        })
        .catch(() => {
          this.showloader = false
          this.participant = []
        })
    },
    loadTotalPlanAsset() {
      var planId = this.$route.params.id
      if (!this.planSource) planId += ';'
      var tgt = this.planSource ? 'tsm' : 'rbc'

      this.$axios.get(`/api/v1/retention/${tgt}/participation/0?planId=${planId}`).then((success) => {
        if (success.data.d) this.participant = success.data.d
        if (
          this.participant[0].Number === 0 &&
          this.participant[1].Number === 0 &&
          this.participant[2].Number === 0 &&
          this.participant[3].Number === 0
        ) {
          this.displayParticipantWithNoData = true
        } else {
          this.displayParticipantWithNoData = false
        }
      })
      this.$axios
        .get(`/api/v1/retention/${tgt}/assets/0?planId=${planId}`)
        .then((success) => {
          if (success.data.d) {
            if (tgt === 'rbc')
              success.data.d
                .sort((a, b) => {
                  if (a.DollarAmount < b.DollarAmount) return -1
                  if (a.DollarAmount > b.DollarAmount) return 1
                  // a must be equal to b
                  return 0
                })
                .reverse()
            this.assetsList = success.data.d.length > 0 ? success.data.d : []
          }
        })
        .catch(() => {
          this.assetsList = []
          this.showloader = false
        })
    },
    getValues() {
      var planId = this.$route.params.id
      if (!this.planSource) planId += ';'
      var tgt = this.planSource ? 'tsm' : 'rbc'
      this.loadTotalPlanAsset()
      this.$axios.get(`/api/v1/retention/${tgt}/cashflowsum/0?planId=${planId}`).then((success) => {
        if (success.data.d) this.cashFlowSum = success.data.d.length > 0 ? success.data.d : []
        if (
          (this.cashFlowSum[0].Amount === null || this.cashFlowSum[0].Amount === 0) &&
          (this.cashFlowSum[1].Amount === null || this.cashFlowSum[1].Amount === 0) &&
          (this.cashFlowSum[2].Amount === null || this.cashFlowSum[2].Amount === 0)
        ) {
          this.displayCashFlowWithNoData = true
        } else {
          this.displayCashFlowWithNoData = false
        }
      })
      this.$axios.get(`/api/v1/retention/${tgt}/cashflow/0?planId=${planId}`).then((success) => {
        if (success.data.d) this.cashflowList = success.data.d.length > 0 ? success.data.d : []
      })
    },
    onResize() {
      let bodyWidth = document.getElementsByTagName('body')
      if (bodyWidth && bodyWidth.length > 0) {
        if (document.getElementsByTagName('body')[0].offsetWidth)
          this.mywidth = document.getElementsByTagName('body')[0].offsetWidth
      }
    },

    exportAssets() {
      var xlHeaders = []
      var planResult = []
      xlHeaders = this.Export(this.assetsList)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'Models')
      for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
        this.currencyConvert(wb, 'B', Xrow)
        this.percentConvert(wb, 'C', Xrow)
      }
      XLSX.writeFile(wb, 'Models.xlsx')
    },
    currencyConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Models'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    },
    formatNumber(value, type, decimal) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: type,
        currency: 'USD',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      })
      return formatter.format(value)
    },
    percentConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Models'][xlColRef + xlRowNum], '0.00%')
    },
    Export(models) {
      var xlHeaders = models.map((rec) => {
        return {
          'Asset Name': rec.AssetName,
          'Dollar Amount': rec.DollarAmount,
          'Percent Amount': rec.PercentAmount / 100
        }
      })
      return xlHeaders
    },
    exportCashFlow() {
      var xlHeaders = []
      var planResult = []
      xlHeaders = this.cashflow(this.cashflowList)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'Models')
      for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
        this.currencyConvert(wb, 'B', Xrow)
        this.currencyConvert(wb, 'C', Xrow)
        this.currencyConvert(wb, 'D', Xrow)
        this.currencyConvert(wb, 'E', Xrow)
      }
      XLSX.writeFile(wb, 'cashflow.xlsx')
    },
    cashflow(cashflow) {
      var xlHeaders = cashflow.map((rec) => {
        return {
          Month: rec.Month.substring(0, 3) + ' ' + new Date(rec.AsOf).getFullYear(),
          'Contributions($)': rec.Contributions ? rec.Contributions : 0,
          'Rollovers($)': rec.Rollovers ? rec.Rollovers : 0,
          'Distributions($)': rec.Distributions ? rec.Distributions : 0,
          'Net($)': rec.Net ? rec.Net : 0
        }
      })
      return xlHeaders
    },
    LoadCashFlowData() {
      var planId = this.$route.params.id
      if (!this.planSource) planId += ';'
      var tgt = this.planSource ? 'tsm' : 'rbc'

      this.$axios
        .get(`/api/v1/retention/${tgt}/cashflowsum/0?planId=${planId}`)
        .then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            this.cashFlowSum = success.data.d
            this.showloader = false
            if (
              (this.cashFlowSum[0].Amount === null || this.cashFlowSum[0].Amount === 0) &&
              (this.cashFlowSum[1].Amount === null || this.cashFlowSum[1].Amount === 0) &&
              (this.cashFlowSum[2].Amount === null || this.cashFlowSum[2].Amount === 0)
            ) {
              this.displayCashFlowWithNoData = true
            } else {
              this.displayCashFlowWithNoData = false
            }
          } else {
            this.cashFlowSum = []
            this.showloader = false
            this.displayCashFlowWithNoData = true
          }
        })
        .catch(() => {
          this.cashFlowSum = []
          this.showloader = false
          this.displayCashFlowWithNoData = true
        })
    },
    exportToExcel() {
      var xlHeaders = []
      var planResult = []
      var selected = []
      selected.push(this.selectedPlan)
      xlHeaders = this.ExportPlan(selected)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'Models')
      for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
        this.currencyConvert(wb, 'E', Xrow)
      }
      XLSX.writeFile(wb, 'Plan.xlsx')
    },
    individualSSOToRelius(planID, key) {
      if (this.$store.state.isImpersonating) {
        this.$toast.warning(
          'Plan Portal SSO is unavailable when impersonating another user.',
          '',
          this.notificationSystem.options.warning
        )

        return
      }
      this.onPopUpEvent(`/api/v1/retention/pcs401k/individual/sso/initiate?planId=${planID}&key=${key}`, '_AccountLink')
    },
    initiateManagePlanSSOLogin() {
      if (this.$store.state.isImpersonating) {
        this.$toast.warning(
          'Plan Portal SSO is unavailable when impersonating another user.',
          '',
          this.notificationSystem.options.warning
        )

        return
      }
      if (!this.selectedPlan.planSource)
        this.onPopUpEvent(`/api/v1/retention/pcs401k/sso/initiate?key=${this.selectedPlan.PLANID}&target=plan`, '_AccountLink')
      else
        this.onPopUpEvent(
          `/api/v1/retention/tsm/sso/initiate?planId=${this.selectedPlan.PLANID}`,
          `_${this.selectedPlan.planSource}`
        )
    },
    ExportPlan(plans) {
      var xlHeaders = plans.map((rec) => {
        return {
          'Plan ID': rec.PLANID,
          Name: rec.NAME,
          'EIN#': rec.EIN,
          'Type of Plan': rec.PlanType,
          'Total Plan Asset': rec.ASSETS,
          TPA: rec.TPA,
          'Plan Year Begin': rec.YrBegDate !== null ? new Date(rec.YrBegDate).toLocaleDateString() : '',
          'Plan Year End': rec.YrEndDate !== null ? new Date(rec.YrEndDate).toLocaleDateString() : '',
          'Plan Sponsor Name': rec.PlanSponsorName,
          'Plan Sponsor Street': rec.PlanSponsorBillingStreet,
          'Plan Sponsor City': rec.PlanSponsorBillingCity,
          'Plan Sponsor State': rec.PlanSponsorBillingState,
          'Plan Sponsor Zip': rec.PlanSponsorBillingPostalCode,
          'Plan Contact Name': rec.PlanContactName,
          'Plan Contact Phone': rec.PlanContactPhone,
          'Plan Contact Email': rec.PlanContactEmail,
          Models: rec.Models,
          Investments: rec.Investments,
          'Total Employees': rec.TotalEmployees,
          'Active Employee With Balance': rec.ActiveEmpWithBalance,
          'Active Employee Without Balance': rec.ActiveEmpWithOutBalance,
          'DISCLOSURE LINK': rec.DISCLOSURE_LINK,
          'DISCLOSURE RUNDATE':
            rec.DISCLOSURE_RUNDATE !== '0001-01-01T00:00:00' && rec.DISCLOSURE_RUNDATE !== null
              ? new Date(rec.DISCLOSURE_RUNDATE).toLocaleDateString()
              : '',
          'DISCLOSURE NEEDS REVIEW': rec.DISCLOSURE_NEEDSREVIEW,
          'DISCLOSURE ID': rec.DISCLOSURE_ID,
          'REVIEW LINK': rec.REVIEW_LINK,
          'REVIEW RUNDATE':
            rec.REVIEW_RUNDATE !== '0001-01-01T00:00:00' && rec.REVIEW_RUNDATE !== null
              ? new Date(rec.REVIEW_RUNDATE).toLocaleDateString()
              : '',
          'REVIEW POSTED': rec.REVIEW_POSTED,
          'REVIEW NEEDS REVIEW': rec.REVIEW_NEEDSREVIEW,
          'REVIEW ID': rec.REVIEW_ID,
          'GUIDE LINK': rec.GUIDE_LINK,
          'GUIDE RUNDATE':
            rec.GUIDE_RUNDATE !== '0001-01-01T00:00:00' && rec.GUIDE_RUNDATE !== null
              ? new Date(rec.GUIDE_RUNDATE).toLocaleDateString()
              : '',
          'GUIDE NEEDS REVIEW': rec.GUIDE_NEEDSREVIEW,
          'GUIDE ID': rec.GUIDE_ID,
          'OVERVIEW LINK': rec.OVERVIEW_LINK,
          'OVERVIEW RUNDATE':
            rec.OVERVIEW_RUNDATE !== '0001-01-01T00:00:00' && rec.OVERVIEW_RUNDATE !== null
              ? new Date(rec.OVERVIEW_RUNDATE).toLocaleDateString()
              : '',
          'ALL IN ONE LINK': rec.ALLINONE_LINK,
          'ALL IN ONE RUNDATE':
            rec.ALLINONE_RUNDATE !== '0001-01-01T00:00:00' && rec.ALLINONE_RUNDATE !== null
              ? new Date(rec.ALLINONE_RUNDATE).toLocaleDateString()
              : '',
          'ALL IN ONE NEEDS REVIEW': rec.ALLINONE_NEEDSREVIEW,
          'ALL IN ONE ID': rec.ALLINONE_ID,
          SFID: rec.SFID
        }
      })
      return xlHeaders
    },
    async getParticipantList() {
      var planId = this.$route.params.id
      var promises = []
      var sortSelected = []
      if (planId) {
        if (this.sortByType) {
          sortSelected = this.sortByType.split('-')
        } else sortSelected = []

        var FilterParticipantDetails = {
          Page: this.currentPageNumber ? this.currentPageNumber : 1,
          Hasloan: -1,
          Searchcriteria: '',
          PlanNames: planId ? planId.split() : [],
          StarredHouseHoldIds: [],
          SortColumn: sortSelected && sortSelected.length > 0 ? sortSelected[0] : 'ParticipantName',
          SortBy: sortSelected && sortSelected.length > 0 ? sortSelected[1] : 'Asc'
        }

        this.planerror = false
        this.planErrorMessage = ''
        this.isProgressLinear = true
        if (this.$store.state.user.reliusLoginId) {
          promises.push(
            this.$axios.post(`/api/v1/rbc/paginatedparticipantdetails`, FilterParticipantDetails).then((success) => {
              let resultSet =
                success.data.d && success.data.d.individualData && success.data.d.individualData.length > 0
                  ? success.data.d.individualData
                  : []

              if (this.searchResult && this.searchResult.length > 0) {
                Array.prototype.push.apply(this.searchResult, resultSet)
              } else this.searchResult = resultSet
              this.participantCount = success.data.d.rowcount[0].RowsCount
              this.currentPageNumber = success.data.d.rowcount[0].CurrentPageNumber
            })
          )
          await Promise.allSettled(promises)
          this.totalIndividualPlans = this.searchResult && this.searchResult.length > 0 ? this.searchResult.length : -1
          if (this.totalIndividualPlans > 0) {
            this.currentPageNumber++
          }
          this.isProgressLinear = false
        }
      } else {
        this.planerror = true
        this.searchResult = []
      }
    },
    getParticipantData() {
      this.showloader = true
      if (this.$store.state.user.reliusLoginId) {
        this.$store
          .dispatch('getParticipantsData')
          .then(() => {
            this.participant = this.$store.state.participantChange
            this.showloader = false
          })
          .catch(() => {
            this.participant = []
            this.showloader = false
          })
      } else {
        this.participant = []
        this.showloader = false
      }
    },
    openEmployeeDataDialog() {
      this.employeeUploadDialog = true
    }
  }
}
</script>
<style scoped>
.expandable_background tr {
  background-color: #eee !important;
}
.expandable_background_dark {
  background-color: #d7d7d7 !important;
}

.createReport .v-input__slot {
  background: rgb(var(--v-theme-accent)) !important;
  cursor: pointer !important;
}
.createReport label {
  color: white !important;
}
.createReport .v-select__selections {
  color: rgb(var(--v-theme-secondary)) !important;
}
.createReport .v-select-list .v-list-item--active {
  background-color: rgb(var(--v-theme-accent)) !important;
}

.border_radius_2 {
  border-radius: 2px !important;
}

.createReport .v-menu__content {
  overflow-y: hidden !important;
}

.circle {
  height: 10px;
  width: 10px;
  border-radius: 5px;
}
.chart_height {
  height: 435px !important;
}
.wrap_investment_text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chart_height_largeFont {
  height: 34em !important;
}
.chart_height_text {
  margin-top: 96px;
}
</style>
<style>
.cashflow_select .v-input .v-input__control .v-input__slot {
  margin-bottom: 0px !important;
}
.participants_select .v-input .v-input__control .v-input__slot {
  margin-bottom: 0px !important;
}
.height_0 {
  height: 0px !important;
}
.height_30 {
  height: 30px !important;
}
.darkmode_background {
  background: #303030 !important;
}
</style>
