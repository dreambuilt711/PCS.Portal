<template>
  <v-container fill-height :fluid="true">
    <v-col cols="12" :class="xsOnly ? 'pb-1 pl-0 pr-0 pt-0' : 'pa-0'">
      <v-row>
        <v-col cols="12" md="8" class="pa-0">
          <span v-if="breadCrumb.parentName" class="text-capitalize font_12 cursor-pointer text-hyperlink" @click="redirectPage()"
            >Client Management</span
          >
          <v-icon size="12" color="hyperlink" class="icon-chevron-right ml-1 mr-1" />
          <span v-if="breadCrumb.parentName" class="text-capitalize font_12 text-hyperlink">{{ breadCrumb.pageName }}</span>
        </v-col>
        <v-col cols="12" class="pl-0 pt-2 pr-0 pb-2">
          <v-row class="align-self-center">
            <v-col sm="6" class="pa-0">
              <h1>Participants Overview</h1>
            </v-col>
            <v-spacer />
            <v-col sm="3" class="pa-0">
              <v-row justify="end">
                <v-btn class="text-capitalize" color="accent" @click="viewAllParticipants()"> View All Participants </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-row v-resize="onResize">
      <v-col cols="12" lg="12" class="pa-3">
        <v-card class="elevation-6" :class="[mdAndDown ? '' : width <= 1368 ? 'chart_height_widget' : 'chart_height']">
          <v-col v-if="showParticipantOverviewLoader" cols="12" lg="12" class="ma-0 pa-0">
            <v-progress-linear v-if="showParticipantOverviewLoader" indeterminate color="accent" height="4" class="ma-0" />
          </v-col>
          <v-col v-else cols="12" class="pa-0">
            <v-col v-if="!showParticipantOverviewLoader && participantOverview && participantOverview.length > 0" class="pa-0">
              <v-row class="pa-4">
                <v-col cols="12" class="pa-0">
                  <v-row no-gutters class="align-self-center">
                    <h4 class="font-weight-bold mr-2 align-self-center">
                      {{ total ? formatNumber(total, 'decimal', 0) : 0 }}
                    </h4>
                    <h4 class="mr-2 align-self-center">total</h4>
                    <v-tooltip v-if="false" offset="120" color="white" location="bottom">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" size="14" color="accent" class="icon-information mr-6" />
                      </template>
                      <span />
                    </v-tooltip>
                    <div v-for="(item, i) in participantOverview" :key="i" class="flex_none mr-3 align-self-center pa-0">
                      <v-row v-if="!item.section" class="align-self-center" no-gutters>
                        <template v-if="item.icon === 'progress'">
                          <v-progress-circular :model-value="item.count" :color="item.color" :width="10" :rotate="-90" />
                          <h4 class="font-weight-bold ml-2 mr-2 align-self-center">{{ parseFloat(item.count).toFixed(2) }}%</h4>
                          <h4 class="mr-2 align-self-center">
                            {{ item.name }}
                          </h4>
                        </template>
                        <template v-else>
                          <v-icon size="14" :color="item.color" class="mr-2 outlineIcon">
                            {{ item.icon }}
                          </v-icon>
                          <v-hover v-slot="{ hover }">
                            <h4>
                              <a
                                :class="['text-hyperlink', hover ? 'text-decoration-underline' : 'text-decoration-none']"
                                @click="viewDetailsWithFilter(item.name)"
                                >{{ item.name }} {{ ` (${formatNumber(item.count, 'decimal', 0)})` }}</a
                              >
                            </h4>
                          </v-hover>
                        </template>
                      </v-row>
                    </div>
                  </v-row>
                </v-col>
              </v-row>
              <v-divider class="bold" />
              <v-row>
                <v-col cols="12" class="pa-0">
                  <v-row>
                    <v-col sm="6" md="3" class="pa-4">
                      <h3 class="font-weight-bold">Saving</h3>
                      <template v-if="!showNoSaving && !savingLoader">
                        <div v-for="(item, i) in participantOverview" :key="i" class="flex_none mb-3 align-self-center pa-0">
                          <v-row v-if="item.section === 'saving'" class="align-self-center" no-gutters>
                            <template>
                              <v-col cols="4" class="text-end ml-1 pa-0">
                                <template v-for="a in item.count" :key="a">
                                  <v-icon size="12" :color="item.color" class="mr-2" :icon="item.icon"></v-icon>
                                </template>
                              </v-col>
                              <v-col v-if="item.name === 'Eligible, Not Contributing'" xs7 class="ml-1 pa-0">
                                <v-tooltip location="top">
                                  <template #activator="{ props }">
                                    <v-hover v-slot="{ hover }">
                                      <h4>
                                        <a
                                          v-bind="props"
                                          :class="[
                                            'text-hyperlink',
                                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                                          ]"
                                          @click="viewDetailsWithFilter(item.name)"
                                          >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                        >
                                      </h4>
                                    </v-hover>
                                  </template>
                                  <span v-html="getTextWithNewLine(item.tooltip)" />
                                </v-tooltip>
                              </v-col>
                              <v-col v-else cols="7" class="ml-1 pa-0">
                                <v-col v-if="item.tooltip !== ''" class="pa-0">
                                  <v-tooltip location="top">
                                    <template #activator="{ props }">
                                      <h4>
                                        <a v-bind="props" class="cursor-auto text-decoration-none iconColor"
                                          >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                        >
                                      </h4>
                                    </template>
                                    <span v-html="getTextWithNewLine(item.tooltip)" />
                                  </v-tooltip>
                                </v-col>
                                <v-col v-else class="pa-0">
                                  <h4>
                                    <a class="cursor-auto text-decoration-none iconColor"
                                      >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                    >
                                  </h4>
                                </v-col>
                              </v-col>
                            </template>
                          </v-row>
                        </div>
                      </template>
                      <template v-if="showNoSaving && !savingLoader">
                        <v-col class="pa-6 ma-8 bg-grey-lighten-3">
                          <h4>
                            <a class="cursor-auto text-decoration-none iconColor">
                              There are currently no Participants with Saving opportunities in your clients list</a
                            >
                          </h4>
                        </v-col>
                      </template>
                    </v-col>
                    <v-divider vertical class="bold" />
                    <v-col sm="6" md="3" class="pa-4">
                      <h3 class="font-weight-bold">Maximizing</h3>
                      <template v-if="!showNoMaximize && !maximizingLoader">
                        <div v-for="(item, i) in participantOverview" :key="i" class="flex_none mb-3 align-self-center pa-0">
                          <v-row v-if="item.section === 'maximizing'" class="align-self-center" no-gutters>
                            <template>
                              <v-col cols="4" class="text-end ml-1 pa-0">
                                <v-icon
                                  v-for="a in item.count"
                                  :key="a"
                                  size="12"
                                  :color="item.color"
                                  class="mr-2"
                                  :icon="item.icon"
                                >
                                </v-icon>
                              </v-col>
                              <v-col cols="7" class="ml-1 pa-0">
                                <v-col v-if="item.tooltip !== ''" class="pa-0">
                                  <v-tooltip location="top">
                                    <template #activator="{ props }">
                                      <h4>
                                        <a v-bind="props" class="cursor-auto text-decoration-none iconColor"
                                          >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                        >
                                      </h4>
                                    </template>
                                    <span v-html="getTextWithNewLine(item.tooltip)" />
                                  </v-tooltip>
                                </v-col>
                                <v-col v-else class="pa-0">
                                  <h4>
                                    <a class="cursor-auto text-decoration-none iconColor"
                                      >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                    >
                                  </h4>
                                </v-col>
                              </v-col>
                            </template>
                          </v-row>
                        </div>
                      </template>
                      <template v-if="showNoMaximize && !maximizingLoader">
                        <v-col class="pa-6 ma-8 bg-grey-lighten-3">
                          <h4>
                            <a class="cursor-auto text-decoration-none iconColor">
                              There are currently no Participants with Maximizing opportunities in your clients list</a
                            >
                          </h4>
                        </v-col>
                      </template>
                    </v-col>
                    <v-divider v-if="mdAndUp" vertical class="bold" />
                    <v-col sm="6" md="3" class="pa-4">
                      <h3 class="font-weight-bold">Investments</h3>
                      <template v-if="!showNoInvestment && !investmentLoader">
                        <div v-for="(item, i) in participantOverview" :key="i" class="flex_none mb-3 align-self-center pa-0">
                          <v-row v-if="item.section === 'investments'" class="align-self-center" no-gutters>
                            <template>
                              <v-col cols="4" class="text-end ml-1 pa-0">
                                <v-icon
                                  v-for="a in item.count"
                                  :key="a"
                                  size="12"
                                  :color="item.color"
                                  class="mr-2"
                                  :icon="item.icon"
                                >
                                </v-icon>
                              </v-col>
                              <v-col cols="7" class="ml-1 pa-0">
                                <h4>
                                  <a class="cursor-auto text-decoration-none iconColor"
                                    >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                  >
                                </h4>
                              </v-col>
                            </template>
                          </v-row>
                        </div>
                      </template>
                      <template v-if="showNoInvestment && !investmentLoader">
                        <v-col class="pa-6 ma-8 bg-grey-lighten-3">
                          <h4>
                            <a class="cursor-auto text-decoration-none iconColor">
                              There are currently no Participants with Investment opportunities in your clients list</a
                            >
                          </h4>
                        </v-col>
                      </template>
                    </v-col>
                    <v-divider vertical class="bold" />
                    <v-col sm="6" md="3" class="pa-4">
                      <h3 class="font-weight-bold">Distributions</h3>
                      <template v-if="!showNoDistribution && !distributionLoader">
                        <div v-for="(item, i) in participantOverview" :key="i" class="flex_none mb-3 align-self-center pa-0">
                          <v-row v-if="item.section === 'distributions'" class="align-self-center" no-gutters>
                            <template>
                              <v-col cols="4" class="text-end ml-1">
                                <v-icon
                                  v-for="a in item.count"
                                  :key="a"
                                  size="12"
                                  :color="item.color"
                                  class="mr-2"
                                  :icon="item.icon"
                                >
                                </v-icon>
                              </v-col>
                              <v-col cols="7" class="ml-1 pa-0">
                                <v-col v-if="item.tooltip !== ''" class="pa-0">
                                  <v-tooltip location="top">
                                    <template #activator="{ props }">
                                      <h4>
                                        <a v-bind="props" class="cursor-auto text-decoration-none iconColor"
                                          >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                        >
                                      </h4>
                                    </template>
                                    <span v-html="getTextWithNewLine(item.tooltip)" />
                                  </v-tooltip>
                                </v-col>
                                <v-col v-else class="pa-0">
                                  <h4>
                                    <a class="cursor-auto text-decoration-none iconColor"
                                      >{{ item.name }} {{ ` (${formatNumber(item.value, 'decimal', 0)})` }}</a
                                    >
                                  </h4>
                                </v-col>
                              </v-col>
                            </template>
                          </v-row>
                        </div>
                      </template>
                      <template v-if="showNoDistribution && !distributionLoader">
                        <v-col class="pa-6 ma-8 bg-grey-lighten-3">
                          <h4>
                            <a class="cursor-auto text-decoration-none iconColor">
                              There are currently no Participants with Distributions opportunities in your clients list</a
                            >
                          </h4>
                        </v-col>
                      </template>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-col cols="12" class="advisorWidgetButtonPosition pa-0">
                <v-row class="pl-8 pr-8 pt-3">
                  <v-icon size="10" color="iconColor" class="mr-2 align-self-center" icon="fa:fas fa-user-alt"></v-icon>
                  <h5 class="mt-1">
                    {{ `= ${formatNumber(individualCount, 'decimal', 0)} participants` }}
                  </h5>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-else cols="12" class="pa-0">
              <v-row class="pt-12">
                <v-col cols="12" class="shortcutflex pa-0">
                  <v-col class="imageflex mt-5 pl-3 pr-3">
                    <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                  </v-col>
                  <v-col cols="12" class="text-center mt-2 mb-4">
                    <h2 class="font-weight-medium">No Data Available</h2>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="pa-3">
        <v-card class="elevation-6" :class="[xsOnly ? '' : 'chart_height_widget']">
          <v-col v-if="showAccountBalanceLoader" cols="12" lg="12" class="ma-0 pa-0">
            <v-progress-linear v-if="showAccountBalanceLoader" indeterminate color="accent" height="4" class="ma-0" />
          </v-col>
          <v-row v-else class="pa-4">
            <v-col cols="12" class="pa-0">
              <v-col cols="12" class="pa-0">
                <v-row no-gutters>
                  <h2 class="font-weight-medium">Account Balance by Age</h2>
                  <v-spacer />
                </v-row>
              </v-col>
              <v-col
                class="pa-0"
                v-if="!showAccountBalanceLoader && averageAccountBalanceByAgeData && averageAccountBalanceByAgeData.length > 0"
              >
                <AccountBalanceByAge
                  :key="componentKey"
                  :live-width="liveWidth"
                  :account-balance-by-age="averageAccountBalanceByAgeData"
                />
                <v-col cols="12" class="pa-0">
                  <v-row class="pb-1">
                    <v-col class="flex_none pt-1 ml-3 pb-0 pl-0 pr-0" cols="3">
                      <v-col cols="12" class="flex_none pa-0">
                        <h4 class="font-weight-bold pb-1">Participant Age</h4>
                      </v-col>
                      <v-col cols="12" class="flex_none pa-0">
                        <h4>No. of Participants</h4>
                      </v-col>
                    </v-col>
                    <v-col v-for="(item, i) in averageAccountBalanceByAgeData" :key="i" class="text-center pt-1 pb-1">
                      <h4 class="font-weight-medium pb-1">
                        {{ item.series }}
                      </h4>
                      <h4>
                        {{ `(${item.individuals})` }}
                      </h4>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col v-else cols="12" class="pa-0">
                <v-row class="mt-6">
                  <v-col cols="12" class="shortcutflex">
                    <v-col class="imageflex mt-5 pl-3 pr-3">
                      <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                    </v-col>
                    <v-col cols="12" class="text-center mt-2 mb-4">
                      <h2 class="font-weight-medium">No Data Available</h2>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="pa-3">
        <v-card class="elevation-6" :class="[xsOnly ? '' : 'chart_height_widget']">
          <v-col v-if="showRetirementLoader" cols="12" lg12 class="ma-0 pa-0">
            <v-progress-linear v-if="showRetirementLoader" indeterminate color="accent" height="4" class="ma-0" />
          </v-col>
          <v-row v-else class="pa-4">
            <v-col cols="12" class="pa-0">
              <h2 class="font-weight-medium pb-3">Participants Nearing Retirement</h2>
              <v-col v-if="!showRetirementLoader && retirementData && retirementData.length > 0 && showRetirement" class="pa-0">
                <RetirementAgeChart :retirementData="retirementData" :liveWidth="liveWidth" />
                <v-col cols="12" class="pa-0">
                  <v-row class="pb-1">
                    <v-col class="flex_none pt-1 ml-3 pb-0 pl-0 pr-0" cols="3">
                      <v-col cols="12" class="flex_none pa-0">
                        <h4 class="font-weight-bold pb-1">Years to Retirement</h4>
                      </v-col>
                      <v-col cols="12" class="flex_none pa-0">
                        <h4>No. of Participants</h4>
                      </v-col>
                    </v-col>
                    <v-col v-for="item in years" :key="item.id" class="text-center pt-1 pb-1">
                      <h4 class="font-weight-medium pb-1">
                        {{ item.noOfYears }}
                      </h4>
                      <h4>
                        {{ `(${item.totalparticipants})` }}
                      </h4>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col v-else cols="12" class="pa-0">
                <v-row class="mt-6">
                  <v-col cols="12" class="shortcutflex">
                    <v-col class="imageflex mt-5 pl-3 pr-3">
                      <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                    </v-col>
                    <v-col cols="12" class="text-center mt-2 mb-4">
                      <h2 class="font-weight-medium">No Data Available</h2>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col v-if="false" cols="12" class="pa-3">
        <v-card class="elevation-6" :class="[mdAndDown ? '' : 'chart_height']">
          <v-col v-if="showProductAnalysisLoader" cols="12" lg12 class="ma-0 pa-0">
            <v-progress-linear v-if="showProductAnalysisLoader" indeterminate color="accent" height="4" class="ma-0" />
          </v-col>
          <v-col v-else cols="12">
            <v-col v-if="!showProductAnalysisLoader && participantContribution && participantContribution.length > 0" cols="12">
              <h2 class="font-weight-medium pa-4">Participant Contribution Analysis</h2>
              <v-row no-gutters>
                <v-col xs10 md9 :class="mdAndUp ? 'mr-16' : ''">
                  <v-col cols="12" class="pb-2">
                    <v-row class="pb-1 pl-7">
                      <v-col class="xs3 pt-1 mr-auto">
                        <v-col cols="12">
                          <h4 class="font-weight-bold pb-1">Participant Age</h4>
                        </v-col>
                        <v-col cols="12">
                          <h4>No. of Participants</h4>
                        </v-col>
                      </v-col>
                      <v-col v-for="(item, i) in participantContribution" :key="i" class="text-center pt-1 pb-1">
                        <h4 class="font-weight-medium text-accent">
                          {{ item.participantAge }}
                        </h4>
                        <h4 class="text-accent">
                          {{ `(${item.noOfIndividuals})` }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" class="pt-3 pb-3">
                    <v-row class="pl-7">
                      <v-col class="xs3 mr-auto">
                        <v-col cols="12">
                          <h4 class="font-weight-bold">Average Participant Balance</h4>
                        </v-col>
                      </v-col>
                      <v-col v-for="(item, i) in participantContribution" :key="i" class="text-center pt-1 pb-1">
                        <h4>
                          {{ formatNumber(item.averageParticipantBalance, 'currency', 0) }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="bold" />
                  <v-col cols="12" class="pt-3 pb-3">
                    <v-row class="pl-7">
                      <v-col class="xs3 mr-auto">
                        <v-col cols="12">
                          <h4 class="font-weight-bold">Average Participant Contribution</h4>
                        </v-col>
                      </v-col>
                      <v-col v-for="(item, i) in participantContribution" :key="i" class="text-center pt-1 pb-1">
                        <h4>
                          {{ formatNumber(item.averageParticipantContribution, 'currency', 0) }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="bold" />
                  <v-col cols="12" class="pt-3 pb-3">
                    <v-row class="pl-7">
                      <v-col class="xs3 mr-auto">
                        <v-col cols="12">
                          <h4 class="font-weight-bold">Average Projected Contribution</h4>
                        </v-col>
                      </v-col>
                      <v-col v-for="(item, i) in participantContribution" :key="i" class="text-center pt-1 pb-1">
                        <h4>
                          {{ formatNumber(item.averageProjectedContribution, 'currency', 0) }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="bold" />
                  <v-col cols="12" class="pt-3 pb-3">
                    <v-row class="pl-7">
                      <v-col class="xs3 mr-auto">
                        <v-col cols="12">
                          <h4 class="font-weight-bold">Average Projected Balance</h4>
                        </v-col>
                      </v-col>
                      <v-col v-for="(item, i) in participantContribution" :key="i" class="text-center pt-1 pb-1">
                        <h4>
                          {{ formatNumber(item.averageProjectedBalance, 'currency', 0) }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="bold" />
                  <v-col cols="12" class="pt-3 pb-3">
                    <v-row class="pl-7">
                      <v-col class="xs3 mr-auto">
                        <v-col cols="12">
                          <h4 class="font-weight-bold">Average Increase in Retirement Savings</h4>
                        </v-col>
                      </v-col>
                      <v-col v-for="(item, i) in participantContribution" :key="i" class="text-center pt-1 pb-1">
                        <h4>
                          {{ formatNumber(item.averageIncreaseInRetirement, 'currency', 0) }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
                <v-col xs2 class="text-center">
                  <v-row class="pl-4 pr-4">
                    <v-col cols="12">
                      <h1 class="font-weight-medium text-accent">33</h1>
                    </v-col>
                    <v-col cols="12" class="mb-5">
                      <h3>Average Participant Age</h3>
                    </v-col>
                    <v-col cols="12">
                      <h1 class="font-weight-medium text-accent">1267</h1>
                    </v-col>
                    <v-col cols="12" class="mb-5">
                      <h3>Active Participants with a Balance</h3>
                    </v-col>
                    <v-col cols="12">
                      <h1 class="font-weight-medium text-accent">61%</h1>
                    </v-col>
                    <v-col cols="12">
                      <h3>Active Participants Contributing</h3>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-else cols="12">
              <v-row class="pt-12">
                <v-col cols="12" class="shortcutflex">
                  <v-col class="imageflex mt-5 pl-3 pr-3">
                    <v-img :src="comingSoonImage" alt="Coming Soon" width="100%" />
                  </v-col>
                  <v-col cols="12" class="text-center mt-2 mb-4">
                    <h2 class="font-weight-medium">No Data Available</h2>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-col cols="12" class="pl-8 pr-8 pt-4 pb-4">
      <h4>
        *Average Participant Balance and Contribution are based on annualized data for the current year. Projected Contribution
        and Projected Balance are based on a 100% increase in average monthly contributions. Increase in Retirement Savings is the
        difference between projected balance at retirement with a 100% increase in contributions and projected balance at
        retirement with no increase in contributions. Participants 67 and older are excluded from Project Balance analysis.
      </h4>
    </v-col> -->
  </v-container>
</template>
<script>
import RetirementAgeChart from '@/components/Retention/RetirementAgeChart'
import AccountBalanceByAge from '@/components/Retention/AccountBalanceByAgeWidget'
import { ref, onMounted, getCurrentInstance, inject, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter, useRoute } from 'vue-router'
export default {
  components: {
    RetirementAgeChart,
    AccountBalanceByAge
  },
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const display = useDisplay()
    const selectedBrand = inject('selectedBrand')
    const comingSoonImage = ref(require('@/assets/images/win.svg'))
    const showAccountBalanceLoader = ref(false)
    const averageAccountBalanceByAgeData = ref([])
    const router = useRouter()
    const route = useRoute()
    const yearList = ref([])
    const year = ref(null)
    const showRetirementLoader = ref(false)
    const retirementData = ref([])
    const showRetirement = ref(false)
    const years = ref([
      {
        id: 1,
        noOfYears: '1 Year',
        totalparticipants: 0
      },
      {
        id: 2,
        noOfYears: '2 Yrs',
        totalparticipants: 0
      },
      {
        id: 3,
        noOfYears: '3 Yrs',
        totalparticipants: 0
      },
      {
        id: 4,
        noOfYears: '5 Yrs',
        totalparticipants: 0
      },
      {
        id: 5,
        noOfYears: '10 Yrs',
        totalparticipants: 0
      }
    ])
    const liveWidth = ref('500')
    const showProductAnalysisLoader = ref(false)
    const showParticipantOverviewLoader = ref(false)
    const total = ref(0)
    const participantOverview = ref([])
    const participantOverviewHeaderData = ref([])
    const componentKey = ref(0)
    const participantContribution = ref([])
    const individualCount = ref(100)
    const showNoSaving = ref(false)
    const savingLoader = ref(true)
    const showNoInvestment = ref(false)
    const investmentLoader = ref(true)
    const showNoDistribution = ref(false)
    const distributionLoader = ref(true)
    const showNoMaximize = ref(false)
    const maximizingLoader = ref(true)
    const width = ref(0)
    const xsOnly = ref(false)
    const mdAndUp = ref(false)
    const mdAndDown = ref(false)

    //computed
    const fontSize = computed(() => {
      return parseInt(selectedBrand.brand.font_Size__c)
    })
    const breadCrumb = computed(() => {
      return route.meta
    })
    //watch
    watchEffect(() => {
      width.value = display.width.value
      xsOnly.value = display.xs.value
      mdAndUp.value = display.mdAndUp.value
      mdAndDown.value = display.mdAndDown.value
    })
    //mounted
    onMounted(() => {
      loadRetirementByAge()
      loadAccountBalanceAge()
      loadParticipantOverview()
    })
    //methods
    function onResize() {
      let bodyWidth = document.getElementsByTagName('body')
      if (bodyWidth && bodyWidth.length > 0) {
        if (document.getElementsByTagName('body')[0].offsetWidth)
          liveWidth.value = document.getElementsByTagName('body')[0].offsetWidth
      }
    }
    function assignAccountBalanceData(val) {
      if (val) {
        const avgAccountBalanceList = val
        if (
          avgAccountBalanceList.averageAccountBalanceByAgeData &&
          avgAccountBalanceList.averageAccountBalanceByAgeData.length > 0
        ) {
          //const accountBalanceList = avgAccountBalanceList.averageAccountBalanceByAgeData.filter((a) => a.Year === year)
          const accountBalanceList = avgAccountBalanceList.averageAccountBalanceByAgeData
          if (accountBalanceList && accountBalanceList.length > 0) {
            averageAccountBalanceByAgeData.value = [
              {
                series: '< 30',
                balance: accountBalanceList.find((a) => a.ParticipantAge === '<30').Assets
                  ? accountBalanceList.find((a) => a.ParticipantAge === '<30').Assets
                  : 0,
                individuals: accountBalanceList.find((a) => a.ParticipantAge === '<30').NumberOfIndividuals
                  ? accountBalanceList.find((a) => a.ParticipantAge === '<30').NumberOfIndividuals
                  : 0
              },
              {
                series: '30 - 42',
                balance: accountBalanceList.find((a) => a.ParticipantAge === '30-42').Assets
                  ? accountBalanceList.find((a) => a.ParticipantAge === '30-42').Assets
                  : 0,
                individuals: accountBalanceList.find((a) => a.ParticipantAge === '30-42').NumberOfIndividuals
                  ? accountBalanceList.find((a) => a.ParticipantAge === '30-42').NumberOfIndividuals
                  : 0
              },
              {
                series: '43 - 52',
                balance: accountBalanceList.find((a) => a.ParticipantAge === '43-52').Assets
                  ? accountBalanceList.find((a) => a.ParticipantAge === '43-52').Assets
                  : 0,
                individuals: accountBalanceList.find((a) => a.ParticipantAge === '43-52').NumberOfIndividuals
                  ? accountBalanceList.find((a) => a.ParticipantAge === '43-52').NumberOfIndividuals
                  : 0
              },
              {
                series: '53 - 62',
                balance: accountBalanceList.find((a) => a.ParticipantAge === '53-62').Assets
                  ? accountBalanceList.find((a) => a.ParticipantAge === '53-62').Assets
                  : 0,
                individuals: accountBalanceList.find((a) => a.ParticipantAge === '53-62').NumberOfIndividuals
                  ? accountBalanceList.find((a) => a.ParticipantAge === '53-62').NumberOfIndividuals
                  : 0
              },
              {
                series: '> 62',
                balance: accountBalanceList.find((a) => a.ParticipantAge === '>62').Assets
                  ? accountBalanceList.find((a) => a.ParticipantAge === '>62').Assets
                  : 0,
                individuals: accountBalanceList.find((a) => a.ParticipantAge === '>62').NumberOfIndividuals
                  ? accountBalanceList.find((a) => a.ParticipantAge === '>62').NumberOfIndividuals
                  : 0
              }
            ]
          } else averageAccountBalanceByAgeData.value = []
        } else averageAccountBalanceByAgeData.value = []
      }
      showAccountBalanceLoader.value = false
    }
    function getAccountBalanceAge(val) {
      if (val) {
        showAccountBalanceLoader.value = true
        if (Object.keys($store.state.avgAccountBalanceChange).length === 0) {
          if ($store.state.user.reliusLoginId) {
            $axios
              .get(`/api/v1/rbc/participant/averageaccountbalancebyage`)
              .then((success) => {
                if (success.data.d) {
                  assignAccountBalanceData(success.data.d)
                } else {
                  averageAccountBalanceByAgeData.value = []
                  showAccountBalanceLoader.value = false
                }
              })
              .catch(() => {
                averageAccountBalanceByAgeData.value = []
                showAccountBalanceLoader.value = false
              })
          } else {
            averageAccountBalanceByAgeData.value = []
            showAccountBalanceLoader.value = false
          }
        } else {
          assignAccountBalanceData($store.state.avgAccountBalanceChange)
          componentKey.value += 1
        }
      } else {
        averageAccountBalanceByAgeData.value = []
        showAccountBalanceLoader.value = false
      }
    }
    function loadAccountBalanceAge() {
      showAccountBalanceLoader.value = true
      if ($store.state.user.reliusLoginId) {
        $store
          .dispatch('getAccountBalance')
          .then(() => {
            if ($store.state.avgAccountBalanceChange) {
              assignAccountBalanceData($store.state.avgAccountBalanceChange)
            } else {
              yearList.value = []
              averageAccountBalanceByAgeData.value = []
              showAccountBalanceLoader.value = false
            }
          })
          .catch(() => {
            showAccountBalanceLoader.value = false
            yearList.value = []
            averageAccountBalanceByAgeData.value = []
          })
      } else {
        showAccountBalanceLoader.value = false
        yearList.value = []
        averageAccountBalanceByAgeData.value = []
      }
    }
    function loadRetirementByAge() {
      showRetirementLoader.value = true
      if ($store.state.user.reliusLoginId) {
        $store
          .dispatch('getRetirementByAge')
          .then(() => {
            retirementData.value = []
            if (Object.keys($store.state.retirement).length) {
              retirementData.value = $store.state.retirement
              if (retirementData.value && retirementData.value.length > 0) {
                years.value[0].totalparticipants = retirementData.value[0]
                  ? retirementData.value.find((a) => a.YearsToRetirement === '1 Year').NumberOfIndividuals
                  : 0
                years.value[1].totalparticipants = retirementData.value[1]
                  ? retirementData.value.find((a) => a.YearsToRetirement === '2 Years').NumberOfIndividuals
                  : 0
                years.value[2].totalparticipants = retirementData.value[2]
                  ? retirementData.value.find((a) => a.YearsToRetirement === '3 Years').NumberOfIndividuals
                  : 0
                years.value[3].totalparticipants = retirementData.value[3]
                  ? retirementData.value.find((a) => a.YearsToRetirement === '5 Years').NumberOfIndividuals
                  : 0
                years.value[4].totalparticipants = retirementData.value[4]
                  ? retirementData.value.find((a) => a.YearsToRetirement === '10 Years').NumberOfIndividuals
                  : 0
                let participant = years.value.filter((a) => a.totalparticipants > 0)
                showRetirement.value = participant.length === 0 ? false : true
              }
            } else {
              retirementData.value = []
              years.value = []
              showRetirement.value = false
            }
            showRetirementLoader.value = false
          })
          .catch(() => {
            showRetirementLoader.value = false
            retirementData.value = []
            years.value = []
            showRetirement.value = false
          })
      } else {
        showRetirementLoader.value = false
        retirementData.value = []
        years.value = []
        showRetirement.value = false
      }
    }
    function calculateIndividual() {
      if ($authz.hasRole($authz.roles.SiteAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)) {
        individualCount.value = 10000
      } else {
        individualCount.value = 100
      }

      participantOverview.value.forEach((a) => {
        if (a.section) {
          if (a.value > 0) {
            if (a.value > 99) {
              a.count = parseInt(a.value / parseInt(individualCount.value))
            } else {
              if (a.value > 49) {
                a.count = Math.round(a.value / parseInt(individualCount.value))
              } else a.count = 1
            }
          } else a.count = 0
        }
      })
    }
    async function loadParticipantOverview() {
      showParticipantOverviewLoader.value = true
      participantOverview.value = [
        {
          name: 'Eligible, Contributing',
          color: '#119944',
          icon: 'fa fa-thumbs-up',
          section: '',
          count: 0,
          value: 0,
          type: 'EnrolledContributing',
          tooltip: ''
        },
        {
          name: 'Eligible, Not Contributing',
          color: '#8f9faf',
          icon: 'fa fa-thumbs-up rotateIcon',
          section: '',
          count: 0,
          value: 0,
          type: 'EnrolledNotContributing',
          tooltip: ''
        },
        {
          name: 'Contribution Rate',
          color: '#faa74a',
          icon: 'progress',
          section: '',
          count: 0,
          value: 0,
          type: 'ContributionRate',
          tooltip: ''
        },
        {
          name: 'Eligible, Not Contributing',
          value: 0,
          color: '#552299',
          icon: 'fas fa-user-alt',
          count: 0,
          section: 'saving',
          type: 'EnrolledNotContributing',
          tooltip: 'These are participants who are enrolled in <br/> the plan and not making active contributions.'
        },
        {
          name: 'Auto Enrollment Opt Out',
          value: 0,
          icon: 'fas fa-user-alt',
          count: 0,
          color: '#119944',
          section: 'saving',
          type: 'AutoEnrollmentOptOut',
          tooltip: ''
        },
        {
          name: 'Rollovers',
          value: 0,
          icon: 'fas fa-user-alt',
          count: 0,
          color: '#ffbb11',
          section: 'saving',
          type: 'Rollovers',
          tooltip: ''
        },
        {
          name: 'Will Be Eligible Soon',
          value: 0,
          icon: 'fas fa-user-alt',
          count: 0,
          color: '#cc0000',
          section: 'saving',
          type: 'WillBeEligibleSoon',
          tooltip: 'Refers to participants who will become eligible <br/> to enroll in their plan within 30 days or less.'
        },
        {
          name: 'Auto Increase Not Enabled',
          value: 0,
          color: '#ff6600',
          icon: 'fas fa-user-alt',
          count: 0,
          section: 'maximizing',
          type: 'AutoIncreaseNotEnabled',
          tooltip:
            'This represents the number of participants enrolled in the <br/> plan who have not taken advantage of the automatic escalation <br/> feature that allows contributions to automatically increase <br/> on a date the participant has chosen.'
        },
        /* {
          name: 'Employer Match Not Maximized',
          value: 644,
          color: '#006633',
          icon: 'fas fa-user-alt',
          count: 0,
          section: 'maximizing',
          type: ''
        }, */
        // {
        //   name: 'Invested in One Fund',
        //   value: 544,
        //   color: '#ffbb11',
        //   icon: 'fas fa-user-alt',
        //   count: 0,
        //   section: 'investments',
        //   type: ''
        // },
        {
          name: "Risk Tolerance Doesn't Match Investments",
          value: 0,
          color: '#552299',
          icon: 'fas fa-user-alt',
          count: 0,
          section: 'investments',
          type: 'RiskToleranceNotMatchingInvestments',
          tooltip: ''
        },
        // {
        //   name: 'Invested in only Cash & Equivalents',
        //   value: 80,
        //   color: '#ff6600',
        //   icon: 'fas fa-user-alt',
        //   count: 0,
        //   section: 'investments',
        //   type: ''
        // },
        {
          name: 'Nearing Retirement',
          value: 0,
          color: '#119944',
          count: 0,
          icon: 'fas fa-user-alt',
          section: 'distributions',
          type: 'NearingRetirementCount',
          tooltip: ''
        },
        {
          name: 'Recently Terminated High Balance',
          value: 0,
          color: '#ffbb11',
          count: 0,
          icon: 'fas fa-user-alt',
          section: 'distributions',
          type: 'RecentlyTerminatedHighBalanceCount',
          tooltip: 'Refers to employees terminated in the last 90 days <br/> with an account balance of $25,000 or greater.'
        },
        {
          name: 'Recently Terminated',
          value: 0,
          color: '#cc0000',
          count: 0,
          icon: 'fas fa-user-alt',
          section: 'distributions',
          type: 'RecentlyTerminatedCount',
          tooltip: 'This refers to employees terminated in the last 90 days.'
        }
      ]

      $axios.get(`/api/v1/rbc/participant/enrollment`).then((success) => {
        if (success.data.d && success.data.d.length > 0) {
          let totalVal = success.data.d.filter((a) => a.Overview === 'Individuals')
          total.value = totalVal && totalVal.length > 0 ? totalVal[0].Count : 0
          success.data.d.forEach((a) => {
            participantOverview.value.forEach((element) => {
              if (element.type && !element.section) {
                if (element.type === a.Overview) {
                  element.count = a.Count ? a.Count : 0
                }
              }
            })
          })
          participantOverview.value[3].value = participantOverview.value[1].count

          calculateIndividual()
          showParticipantOverviewLoader.value = false
        }
      })

      distributionLoader.value = true
      $axios
        .get(`/api/v1/rbc/participant/distribution`)
        .then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            success.data.d.forEach((a) => {
              participantOverview.value.forEach((element) => {
                if (element.type && element.section === 'distributions') {
                  if (element.type === a.Distributions) {
                    element.value = a.Count ? a.Count : 0
                  }
                }
              })
            })

            calculateIndividual()
          }
          let value = participantOverview.value.filter((a) => a.value > 0 && a.section === 'distributions')
          showNoDistribution.value = value && value.length > 0 ? false : true
          distributionLoader.value = false
          showParticipantOverviewLoader.value = false
        })
        .catch(() => {
          showNoDistribution.value = true
          distributionLoader.value = false
        })

      investmentLoader.value = true
      $axios
        .get(`/api/v1/rbc/participant/risktolerancenotmatchinginvestments`)
        .then((success) => {
          participantOverview.value[8].value =
            success.data.d && success.data.d.length > 0 ? success.data.d[0].RiskToleranceNotMatchingInvestments : 0
          showNoInvestment.value = parseInt(participantOverview.value[8].value) > 0 ? false : true
          calculateIndividual()
          investmentLoader.value = false
          showParticipantOverviewLoader.value = false
        })
        .catch(() => {
          showNoInvestment.value = true
          investmentLoader.value = false
        })

      maximizingLoader.value = true
      $axios
        .get(`/api/v1/rbc/participant/autoincreasenotenabled`)
        .then((success) => {
          participantOverview.value[7].value =
            success.data.d && success.data.d.length > 0 ? success.data.d[0].AutoIncreaseNotEnabled : 0
          showNoMaximize.value = parseInt(participantOverview.value[7].value) > 0 ? false : true
          calculateIndividual()
          maximizingLoader.value = false
          showParticipantOverviewLoader.value = false
        })
        .catch(() => {
          showNoMaximize.value = true
          maximizingLoader.value = false
        })

      let promise = []
      savingLoader.value = true
      promise.push(
        $axios.get(`/api/v1/rbc/participant/contribution`).then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            success.data.d.forEach((a) => {
              participantOverview.value.forEach((element) => {
                if (element.type && !element.section) {
                  if (element.type === a.Overview) {
                    element.count = a.Count ? a.Count : 0
                  }
                }
              })
            })
            participantOverview.value[3].value = participantOverview.value[1].count
            calculateIndividual()
          }
        })
      )

      promise.push(
        $axios.get(`/api/v1/rbc/participant/autoenrollmentoptout`).then((success) => {
          participantOverview.value[4].value =
            success.data.d && success.data.d.length > 0 ? success.data.d[0].AutoEnrollmentOptOut : 0
          calculateIndividual()
        })
      )
      promise.push(
        $axios.get(`/api/v1/rbc/participant/rollover`).then((success) => {
          participantOverview.value[5].value = success.data.d && success.data.d.length > 0 ? success.data.d[0].Rollovers : 0
          calculateIndividual()
        })
      )
      promise.push(
        $axios.get(`/api/v1/rbc/participant/willbeeligiblesoon`).then((success) => {
          participantOverview.value[6].value =
            success.data.d && success.data.d.length > 0 ? success.data.d[0].WillBeEligibleSoon : 0
          calculateIndividual()
        })
      )
      await Promise.allSettled(promise)
      let savingval = participantOverview.value.filter((a) => a.value > 0 && a.section === 'saving')
      showNoSaving.value = savingval && savingval.length > 0 ? false : true
      savingLoader.value = false
      showParticipantOverviewLoader.value = false
    }
    function loadParticipantContribution() {
      showProductAnalysisLoader.value = true
      participantContribution.value = [
        {
          participantAge: '< 30',
          noOfIndividuals: 905,
          averageParticipantBalance: 12345,
          averageParticipantContribution: 2345,
          averageProjectedContribution: 5345,
          averageProjectedBalance: 2002345,
          averageIncreaseInRetirement: 812345
        },
        {
          participantAge: '30 - 42',
          noOfIndividuals: 1045,
          averageParticipantBalance: 42345,
          averageParticipantContribution: 6345,
          averageProjectedContribution: 12345,
          averageProjectedBalance: 2442345,
          averageIncreaseInRetirement: 942345
        },
        {
          participantAge: '43 - 52',
          noOfIndividuals: 1306,
          averageParticipantBalance: 123345,
          averageParticipantContribution: 12345,
          averageProjectedContribution: 20345,
          averageProjectedBalance: 2644345,
          averageIncreaseInRetirement: 612345
        },
        {
          participantAge: '53 - 62',
          noOfIndividuals: 1445,
          averageParticipantBalance: 52345,
          averageParticipantContribution: 9345,
          averageProjectedContribution: 19945,
          averageProjectedBalance: 412345,
          averageIncreaseInRetirement: 172345
        },
        {
          participantAge: '> 62',
          noOfIndividuals: 1445,
          averageParticipantBalance: 12345,
          averageParticipantContribution: 12345,
          averageProjectedContribution: 12345,
          averageProjectedBalance: 12345,
          averageIncreaseInRetirement: 12345
        }
      ]
      showProductAnalysisLoader.value = false
    }
    function viewDetailsWithFilter(val) {
      var value1 = val.split(',')
      $store.state.clientPlan = {}
      $store.state.clientPlan.prospectValue = 0
      $store.state.clientPlan.filter = {
        partPlanStatus: [value1[0].length > 0 ? value1[0].trim() : ''],
        partContribution: [value1[1].length > 0 ? (value1[1].trim() === 'Contributing' ? 'Yes' : 'No') : '']
      }
      router.push('/Retention/Plans').catch(() => {})
    }
    function viewAllParticipants() {
      $store.state.clientPlan = {}
      $store.state.clientPlan.prospectValue = 0
      router.push('/Retention/Plans').catch(() => {})
    }
    function getTextWithNewLine(val) {
      return val
    }
    function redirectPage() {
      router.push('/Home/ClientManagement').catch(() => {})
    }
    function formatNumber(value, type, decimal) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: type,
        currency: 'USD',
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      })
      return formatter.format(value)
    }

    return {
      comingSoonImage,
      showAccountBalanceLoader,
      averageAccountBalanceByAgeData,
      yearList,
      year,
      showRetirementLoader,
      retirementData,
      showRetirement,
      years,
      liveWidth,
      showProductAnalysisLoader,
      showParticipantOverviewLoader,
      total,
      participantOverview,
      participantOverviewHeaderData,
      componentKey,
      participantContribution,
      individualCount,
      showNoSaving,
      savingLoader,
      showNoInvestment,
      investmentLoader,
      showNoDistribution,
      distributionLoader,
      showNoMaximize,
      maximizingLoader,
      breadCrumb,
      fontSize,
      onResize,
      assignAccountBalanceData,
      getAccountBalanceAge,
      loadAccountBalanceAge,
      loadRetirementByAge,
      calculateIndividual,
      loadParticipantOverview,
      loadParticipantContribution,
      viewDetailsWithFilter,
      viewAllParticipants,
      getTextWithNewLine,
      redirectPage,
      xsOnly,
      mdAndUp,
      mdAndDown,
      width,
      formatNumber
    }
  }
}
</script>
<style scoped>
.chart_height {
  height: 400px !important;
}
.chart_height_widget {
  height: 440px !important;
}
.rotateIcon {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}
</style>
