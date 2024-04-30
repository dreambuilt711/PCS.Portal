<template>
  <v-col :class="showLegalText && $vuetify?.breakpoint?.lgAndUp ? 'heightForlargeLegalText' : ''" class="pa-0">
    <v-col v-if="displayGlobalFilter" id="globalFilter" cols="12" class="fixedFilter pa-0">
      <GlobalFilter @openFilter="openFilter" />
    </v-col>
    <v-container :class="$vuetify?.breakpoint?.xs ? 'pl-0 pr-0 pb-0 pt-4' : 'pt-0 pb-2 pt-4 container--fluid'">
      <v-col xs12>
        <v-row class="justify-space-around">
          <v-col
            id="scrollUps"
            xs12
            md12
            :class="['pt-4 pb-2', $vuetify?.breakpoint?.smAndDown ? 'xs12 pl-2 pr-2' : 'xs12']"
            @scroll="handleScroll()"
          >
            <v-col xs12 :class="$vuetify?.breakpoint?.xs ? 'pb-1' : ''">
              <v-row>
                <v-col :cols="$vuetify?.breakpoint?.mdAndUp ? '8' : '12'" class="pa-0">
                  <span
                    v-if="breadCrumb.parentName"
                    class="text-capitalize font_12 cursor-pointer"
                    :class="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
                    @click="$router.push('/Home/ClientManagement').catch(() => {})"
                    >Client Management</span
                  >
                  <v-icon size="12" :color="!$vuetify?.theme.dark ? 'hyperlink' : ''" class="icon-chevron-right ml-1 mr-1" />
                  <span
                    v-if="breadCrumb.parentName"
                    class="text-capitalize font_12 cursor-pointer"
                    :class="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
                    @click="$router.push('/Retention/Participants').catch(() => {})"
                    >Client Dashboard</span
                  >
                  <v-icon size="12" :color="!$vuetify?.theme.dark ? 'hyperlink' : ''" class="icon-chevron-right ml-1 mr-1" />
                  <span
                    v-if="breadCrumb.parentName"
                    class="text-capitalize font_12"
                    :class="!$vuetify?.theme.dark ? 'text-hyperlink' : ''"
                    >{{ breadCrumb.pageName }}</span
                  >
                </v-col>
                <v-col cols="12" class="pl-0 pt-1 pr-0">
                  <h1>My Clients</h1>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-col>
                <v-row no-gutters>
                  <v-col v-if="!showSearch" class="flex_none mr-2" :class="$vuetify?.breakpoint?.xs ? 'mb-2' : ''">
                    <v-btn variant="text" class="pa-2 ma-0 buttonStyle" @click="showSearch = !showSearch">
                      <span>
                        <v-icon
                          size="21"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          class="icon-search"
                          @click="showHideSearch()"
                        />
                        <v-icon
                          size="13"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          class="ml-1 width_10"
                          @click="showHideSearch()"
                          >fas fa-caret-right</v-icon
                        >
                      </span>
                    </v-btn>
                  </v-col>
                  <v-col
                    v-if="showSearch"
                    v-click-input-outside="searchAreaFocusOut"
                    xl4
                    lg4
                    md6
                    sm6
                    xs12
                    :class="[$vuetify?.breakpoint?.mdAndUp ? 'mr-auto' : '', $vuetify?.breakpoint?.xlOnly ? 'pr-3' : '']"
                  >
                    <v-text-field
                      v-if="showSearch"
                      v-model="searchText"
                      hide-details
                      ref="wildCardSearch"
                      density="compact"
                      variant="outlined"
                      :clearable="searchText ? (searchText.trim() !== '' ? true : false) : false"
                      placeholder="Search for..."
                      :menu-props="{ zIndex: '9999', attach: true }"
                      @click="hideCard = true"
                      @click:clear="clearSearch()"
                      @update:model-value="checkFields()"
                    >
                      <template #append>
                        <v-icon
                          size="21"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          class="icon-search cursor-pointer"
                          @click="showHideSearch()"
                        />
                        <v-icon
                          size="13"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          class="ml-1 width_10 cursor-pointer"
                          @click="showHideSearch()"
                        >
                          fas fa-caret-left
                        </v-icon>
                      </template>
                    </v-text-field>
                    <v-card
                      v-if="
                        hideCard &&
                        ((searchParticipants && searchParticipants.length > 0) || (searchPlans && searchPlans.length > 0))
                      "
                      :width="$refs.wildCardSearch ? $refs.wildCardSearch.$el.clientWidth : '200px'"
                      :color="$vuetify?.theme.dark ? '' : 'white'"
                      class="elevation-3 participant_card_height z_index_999"
                    >
                      <v-col v-if="searchParticipants && searchParticipants.length > 0" class="pl-2 pr-2 pt-0 pb-0">
                        <v-list-item>
                          <v-list-item-action class="mr-1">
                            <v-icon class="icon-individual participantIcon" size="21" />
                          </v-list-item-action>

                          <v-list-item-title class="font_14 font-weight-medium"> First Name / Last Name </v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list density="compact">
                          <template v-for="(item, index) in searchParticipants">
                            <v-tooltip :key="index" location="top">
                              <template #activator="{ props }">
                                <v-list-item :key="index" @click="getPlanValue(item.Name, 'individual')">
                                  <v-list-item-title v-bind="props" class="text-uppercase">
                                    {{ item.Name ? item.Name.toLowerCase() : '' }}
                                  </v-list-item-title>
                                </v-list-item>
                              </template>
                              <span class="text-uppercase">{{ item.Name ? item.Name.toLowerCase() : '' }}</span>
                            </v-tooltip>
                          </template>
                        </v-list>
                      </v-col>
                      <v-col v-if="searchPlans && searchPlans.length > 0" class="pl-2 pr-2 pt-0 pb-0">
                        <v-list-item>
                          <v-list-item-action class="mr-1">
                            <v-icon class="icon-for-profit forProfitIcon" size="21" />
                          </v-list-item-action>

                          <v-list-item-title class="font_14 font-weight-medium"> Plans </v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <v-list density="compact">
                          <v-tooltip v-for="(item, index) in searchPlans" :key="index" location="top">
                            <template #activator="{ props }">
                              <v-list-item :key="index" @click="getPlanValue(item, 'plans')">
                                <v-list-item-title v-bind="props" class="text-uppercase">
                                  {{ item.Name }}
                                </v-list-item-title>
                              </v-list-item>
                            </template>
                            <span class="text-uppercase">{{ item.Name }}</span>
                          </v-tooltip>
                        </v-list>
                      </v-col>
                    </v-card>
                  </v-col>
                  <v-col v-if="!showSearch">
                    <v-row>
                      <v-col v-for="(item, index) in filterButton" :key="index" class="flex_none">
                        <v-col v-if="clientTab === 0 && item.tooltip !== ''">
                          <v-tooltip location="top">
                            <template #activator="{ props }">
                              <v-btn
                                v-if="clientTab === item.tab"
                                class="mt-0 mb-0 ml-2 mr-2 classForButton text-capitalize elevation-0"
                                :color="$vuetify?.theme.dark ? '' : item.selected === true ? 'accent' : 'text-accent'"
                                stacked
                                v-bind="props"
                                @click="showParticipantFilter(item)"
                              >
                                {{ item.text }}
                                <v-badge
                                  v-if="item.count > 0"
                                  :content="item.count"
                                  color="yellow"
                                  class="classForBadge newClass"
                                />
                              </v-btn>
                            </template>
                            <span>{{ item.tooltip }}</span>
                          </v-tooltip>
                        </v-col>
                        <v-col v-else>
                          <v-btn
                            v-if="clientTab === item.tab"
                            class="mt-0 mb-0 ml-2 mr-2 classForButton text-capitalize elevation-0"
                            :color="$vuetify?.theme.dark ? '' : item.selected === true ? 'accent' : 'text-accent'"
                            stacked
                            @click="showParticipantFilter(item)"
                          >
                            {{ item.text }}
                            <v-badge v-if="item.count > 0" :content="item.count" color="yellow" class="classForBadge newClass" />
                            />
                          </v-btn>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="!showSearch" xs12>
                    <v-row>
                      <v-col v-if="filterType === 'participantPlanStaus'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in planStatusList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'participantPlanStaus')"
                            >
                              {{ item.PlanStatus }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'enrolledStatus'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in enrolledStatusList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'enrolledStatus')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'participantAge'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in participantAgeList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'participantAge')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'participantAccountType'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in accountTypeList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'participantAccountType')"
                            >
                              {{ item.AccountType }}
                            </v-btn>
                          </v-col>
                          <v-col class="flex_none mx-2 align-self-center">
                            ({{ new Intl.NumberFormat().format(participantCount) }}<span class="ml-1">found</span>)
                          </v-col>
                          <v-divider inset class="mx-1 my-3 bold" vertical />
                          <v-col class="mx-2 align-self-center">
                            <a
                              class="font_14"
                              :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                              @click="resetFilter()"
                              >Reset filters</a
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'participantAssetValue'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in assetValueList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'participantAssetValue')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'equity'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in equityAllocationList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'equity')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'employmentStatus'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in employmentStatusList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'employmentStatus')"
                            >
                              {{ item.EmploymentStatus }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'contributionStatus'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in contributionStatusList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'contributionStatus')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'retirement'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in retirementList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyParticipantFilter(item, 'retirement')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'planStatus'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in employeePlanStatusList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyPlanFilter(item, 'planStatus')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'accountType'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in employeePlanTypeList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyPlanFilter(item, 'accountType')"
                            >
                              {{ item.PlanType }}
                            </v-btn>
                          </v-col>
                          <v-col class="flex_none mx-2 align-self-center">
                            ({{ new Intl.NumberFormat().format(planCount) }}<span class="ml-1">found</span>)
                          </v-col>
                          <v-divider inset class="mx-1 my-3 bold" vertical />
                          <v-col class="mx-2 align-self-center">
                            <a
                              class="font_14"
                              :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                              @click="resetFilter()"
                              >Reset filters</a
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'assetValue'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in employerAssetList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyPlanFilter(item, 'assetValue')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="filterType === 'totalParticipant'" class="my-1 flex_none">
                        <v-row>
                          <v-col v-for="(item, i) in participantsList" :key="i" class="flex_none">
                            <v-btn
                              class="ml-0 text-capitalize elevation-0"
                              :class="$vuetify?.theme.dark ? '' : 'buttonColor'"
                              :color="$vuetify?.theme.dark ? '' : item.selected ? 'accent' : 'text-accent'"
                              @click="applyPlanFilter(item, 'totalParticipant')"
                            >
                              {{ item.text }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        v-if="clientTab === 0 && filterType !== 'participantAccountType'"
                        class="flex_none mx-2 align-self-center"
                      >
                        ({{ new Intl.NumberFormat().format(participantCount) }}<span class="ml-1">found</span>)
                      </v-col>
                      <v-col v-if="clientTab === 1 && filterType !== 'accountType'" class="flex_none mx-2 align-self-center">
                        ({{ new Intl.NumberFormat().format(planCount) }}<span class="ml-1">found</span>)
                      </v-col>
                      <v-divider
                        v-if="filterType !== 'accountType' && filterType !== 'participantAccountType'"
                        inset
                        class="mx-1 my-3 bold"
                        vertical
                      />
                      <v-col
                        v-if="filterType !== 'accountType' && filterType !== 'participantAccountType'"
                        class="mx-2 align-self-center"
                      >
                        <a class="font_14" :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'" @click="resetFilter()"
                          >Reset filters</a
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col xs12>
              <v-row>
                <v-col lg4 mt-3 mb-4>
                  <v-tabs v-model="clientTab" class="notificationMenu" color="accent" slider-size="3">
                    <v-tab v-for="(item, i) in clientList" v-show="item.show" :key="i" :disabled="!item.disable">
                      {{ item.text }}
                    </v-tab>
                  </v-tabs>
                </v-col>
                <v-col
                  v-if="clientTab === 0"
                  class="d-flex justify-end"
                  :class="$vuetify?.breakpoint?.xs ? 'mt-5 mb-5' : 'mb-2 pl-5'"
                >
                  <v-col xl5 lg6 sm12 md8 pt-2>
                    <v-row class="justify-end">
                      <v-col d-flex lg5 md4 sm4 pt-2 pr-2 :class="$vuetify?.breakpoint?.xs ? 'mb-1' : ' justify-end'">
                        <h4 class="font-weight-medium">Sort results by</h4>
                      </v-col>
                      <v-col lg7 md7 sm6 pr-2>
                        <v-select
                          v-model="sortByType"
                          :items="sortByListType"
                          placeholder="Sort by"
                          append-icon="icon-chevron-down"
                          hide-details
                          density="compact"
                          variant="outlined"
                          :menu-props="{ zIndex: '9999' }"
                          :class="$vuetify?.breakpoint?.xs ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                          :disabled="searchLoading"
                          @update:model-value="getSortByData()"
                        >
                          <template #selection="{ item }">
                            <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ item.text }}</span>
                          </template>
                          <template #item="slotProps">
                            <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ slotProps.item.text }}</span>
                          </template>
                          <template #append>
                            <v-icon color="hyperlink"> icon-chevron-down </v-icon>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
                <v-col
                  v-if="clientTab === 1"
                  class="d-flex justify-end"
                  :class="$vuetify?.breakpoint?.xs ? 'mt-5 mb-5' : 'mb-2 pl-5'"
                >
                  <v-col xl5 lg6 sm12 md8 pt-2>
                    <v-row class="justify-end">
                      <v-col d-flex lg5 md4 sm4 pt-2 pr-2 :class="$vuetify?.breakpoint?.xs ? 'mb-1' : ' justify-end'">
                        <h4 class="font-weight-medium">Sort results by</h4>
                      </v-col>
                      <v-col lg7 md7 sm6 pr-2>
                        <v-select
                          v-model="employeeSortByType"
                          density="compact"
                          variant="outlined"
                          :menu-props="{ zIndex: '9999' }"
                          :items="employeeSortByListType"
                          append-icon="icon-chevron-down"
                          item-props.disabled="disabled"
                          :class="$vuetify?.breakpoint?.xs ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                          :disabled="planLoading"
                          hide-details
                          @update:model-value="getPlanSortByData"
                        >
                          <template #selection="{ item }">
                            <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ item.text }}</span>
                          </template>
                          <template #item="slotProps">
                            <span :class="$vuetify?.theme.dark ? '' : 'text-accent'">{{ slotProps.item.text }}</span>
                          </template>
                          <template #append>
                            <v-icon color="hyperlink"> icon-chevron-down </v-icon>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="clientTab === 0">
              <v-col v-if="showLeadPage && !searchLoading">
                <v-card :class="$vuetify?.breakpoint?.smAndDown ? 'elevation-0 pa-5' : 'elevation-6 pa-5'">
                  <v-card-text class="justify-center text-center">
                    <v-row justify="center" align="center" class="mt-8 mb-8">
                      <v-col xs12>
                        <h2 class="mb-4">You don’t have any Plan Participants yet.</h2>
                      </v-col>
                      <v-col xs12>
                        <h3 class="mb-3 font_14">
                          When you sell retirement plans using the lab, the individual plan participants will display here. Go
                          ahead and find new customers using our lead search.
                        </h3>
                      </v-col>
                      <v-col xs12>
                        <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" @click="redirect()"> Lead Search </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col v-else x12>
                <v-card class="elevation-0" :class="$vuetify?.breakpoint?.smAndDown ? 'pt-3 pb-3' : 'pt-0 pb-0'">
                  <v-col xs12>
                    <v-data-table-server
                      v-model:options="pagination"
                      :headers="headers"
                      :items="searchResult"
                      item-key="ssn"
                      mobile-breakpoint="0"
                      :class="[$vuetify?.breakpoint?.mdAndDown ? 'elevation-0 mb-0' : 'elevation-3 mb-0']"
                      :hide-default-header="$vuetify?.breakpoint?.mdAndDown"
                      :items-length="participantCount"
                      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
                      @update:items-per-page="getItemPerPage"
                      @update:page="participantIntersected"
                    >
                      <template #item="{ item, isExpanded, expand }">
                        <tr v-if="!$vuetify?.breakpoint?.mdAndDown">
                          <td class="text-left text-capitalize pr-0">
                            <v-hover v-slot="{ hover }">
                              <v-tooltip location="top" color="#0077CC" opacity="1">
                                <template #activator="{ props }">
                                  <v-col class="flex_none">
                                    <a
                                      v-bind="props"
                                      :class="[
                                        !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                                        hover ? 'text-decoration-underline' : 'text-decoration-none'
                                      ]"
                                      class="text-capitalize"
                                      @click="individualSSOToRelius(item.planId, item.ssn)"
                                      >{{ item.participantName }}</a
                                    >
                                  </v-col>
                                </template>
                                <v-col class="pa-1">
                                  <v-col v-if="item.mailingStreet">
                                    {{ item.mailingStreet ? item.mailingStreet : '' }}
                                  </v-col>
                                  <v-col class="pt-1">
                                    <v-row no-gutters>
                                      <v-col>
                                        {{ item.mailingCity ? item.mailingCity : ''
                                        }}{{ item.mailingState ? ' ' + item.mailingState + ',' : ''
                                        }}{{ item.mailingPostalCode ? ' ' + item.mailingPostalCode : '' }}
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col v-if="item.email" class="pt-1">
                                    {{ item.email ? item.email : '' }}
                                  </v-col>
                                  <v-col class="py-1">
                                    <v-row no-gutters>
                                      <v-col v-if="item.phone">
                                        {{ item.phone ? formatPhoneNumber(item.phone) : '' }}
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col>{{ item.participantAge ? item.participantAge : '0' }} years old</v-col>
                                  <v-col class="py-1">
                                    {{ item.displaySSN ? item.displaySSN : '' }}
                                  </v-col>
                                  <v-col>
                                    <v-row no-gutters>
                                      <v-col>
                                        {{ item.employmentStatus ? item.employmentStatus : ''
                                        }}{{ item.planStatus ? ', ' + item.planStatus : '' }}
                                        {{ item.loanStatus ? ', ' + item.loanStatus : '' }}
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col class="py-1"> (Click the name to go to account details) </v-col>
                                </v-col>
                              </v-tooltip>
                            </v-hover>
                          </td>
                          <td class="text-left text-capitalize">
                            {{ item.planName ? item.planName.toLowerCase() : '' }}
                          </td>
                          <td class="text-left text-capitalize">
                            {{ item.planType ? item.planType.toLowerCase() : '' }}
                          </td>
                          <td class="text-right wraptext">
                            {{ item.totalAssets ? formatPrice(item.totalAssets, 2) : '0' }}
                          </td>
                          <td class="text-right wraptext">
                            {{ item.participantAge }}
                          </td>
                          <td class="text-left wraptext">
                            {{ item.planStatus }}
                          </td>
                          <td class="text-left wraptext">
                            {{ item.employmentStatus }}
                          </td>
                          <td class="text-left wraptext">
                            {{ item.loanStatus }}
                          </td>
                          <td class="text-right wraptext">
                            {{ `${item.equityAllocation}%` }}
                          </td>
                          <td class="text-center">
                            <v-col>
                              <v-row class="justify-center">
                                <v-col class="align-self xs4">
                                  <v-btn
                                    icon
                                    class="ma-0"
                                    size="small"
                                    :color="!$vuetify?.theme.dark ? 'accent' : ''"
                                    variant="text"
                                    :disabled="item.Source"
                                    @click.stop="$set(closeReportPopUp, item.ssn, true)"
                                  >
                                    <!-- <v-icon small>fas fa-ellipsis-v</v-icon> -->
                                    <v-icon size="21" class="icon-action" />
                                  </v-btn>
                                  <v-dialog
                                    :key="item.ssn"
                                    v-model="closeReportPopUp[item.ssn]"
                                    :scrollable="false"
                                    :max-width="totalReport === 1 ? '300' : '400'"
                                    content-class="elevation-3"
                                  >
                                    <RBCReport
                                      :plan-i-d="item.planId"
                                      :ssn="item.ssn"
                                      from-page="Participants"
                                      :plan-name="item.participantName"
                                      :target-object="item"
                                      :email="item.email"
                                      @close-report="$set(closeReportPopUp, item.ssn, false)"
                                      @report-list="reportList"
                                    />
                                  </v-dialog>
                                </v-col>
                              </v-row>
                            </v-col>
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
                                              <span>Participant Name</span>
                                              <br />
                                              <a
                                                :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                                                class="text-capitalize text-decoration-underline"
                                                @click="individualSSOToRelius(item.planId, item.ssn)"
                                                ><h4>{{ item.participantName }}</h4>
                                              </a>
                                            </span>
                                          </v-col>
                                        </v-row>
                                      </h5>
                                    </v-col>
                                  </v-row>
                                </v-col>
                                <v-col xs2 class="text-right cursor-pointer">
                                  <v-btn icon variant="text" @click="expand(!isExpanded)">
                                    <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                          </td>
                        </tr>
                      </template>
                      <template v-if="$vuetify?.breakpoint?.mdAndDown" #expanded-item="{ item }">
                        <td class="pr-3 pl-3">
                          <v-col xs12 class="mb-2">
                            <v-row>
                              <v-col xs8>
                                <v-col xs12>
                                  <h5>Plan Name</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>
                                    {{ item.planName ? item.planName.toLowerCase() : '' }}
                                  </h4>
                                </v-col>
                              </v-col>
                              <v-col xs4 mb-2>
                                <v-col xs12>
                                  <h5>Plan Type</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>
                                    {{ item.planType ? item.planType.toLowerCase() : '' }}
                                  </h4>
                                </v-col>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs12 class="mb-2">
                            <v-row>
                              <v-col xs8 mb-2>
                                <v-col xs12>
                                  <h5>Total Assets</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>{{ item.totalAssets ? formatPrice(item.totalAssets, 2) : '0' }}</h4>
                                </v-col>
                              </v-col>
                              <v-col xs4>
                                <v-col xs12>
                                  <h5>Participant Age</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>
                                    {{ item.participantAge }}
                                  </h4>
                                </v-col>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs12 class="mb-2">
                            <v-row>
                              <v-col xs8 mb-2>
                                <v-col xs12>
                                  <h5>Plan Status</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>{{ item.planStatus }}</h4>
                                </v-col>
                              </v-col>
                              <v-col xs4>
                                <v-col xs12>
                                  <h5>Employment Status</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>
                                    {{ item.employmentStatus }}
                                  </h4>
                                </v-col>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs12 class="mb-2">
                            <v-row>
                              <v-col xs8 mb-2>
                                <v-col xs12>
                                  <h5>Loan Status</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>{{ item.loanStatus }}</h4>
                                </v-col>
                              </v-col>
                              <v-col xs4>
                                <v-col xs12>
                                  <h5>Equity Allocation</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>
                                    {{ `${item.equityAllocation}%` }}
                                  </h4>
                                </v-col>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col xs12>
                            <v-col xs12 :class="$vuetify?.breakpoint?.mdAndDown ? 'pl-1' : ''">
                              <v-row>
                                <v-col class="align-self xs4">
                                  <v-btn
                                    icon
                                    class="ma-0"
                                    size="small"
                                    :color="!$vuetify?.theme.dark ? 'accent' : ''"
                                    variant="text"
                                    :disabled="item.Source"
                                    @click.stop="$set(closeReportPopUp, item.ssn, true)"
                                  >
                                    <!-- <v-icon small>fas fa-ellipsis-v</v-icon> -->
                                    <v-icon size="21" class="icon-action" />
                                  </v-btn>
                                  <v-dialog
                                    :key="item.ssn"
                                    v-model="closeReportPopUp[item.ssn]"
                                    :scrollable="false"
                                    :max-width="totalReport === 1 ? '300' : '400'"
                                    content-class="elevation-3"
                                  >
                                    <RBCReport
                                      :plan-i-d="item.planId"
                                      :ssn="item.ssn"
                                      from-page="Participants"
                                      :plan-name="item.participantName"
                                      :target-object="item"
                                      :email="item.email"
                                      @close-report="$set(closeReportPopUp, item.ssn, false)"
                                      @report-list="reportList"
                                    />
                                  </v-dialog>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-col>
                        </td>
                      </template>
                    </v-data-table-server>
                    <Loader
                      :loading-text="searchText ? `Finding ${searchText}` : `Loading...`"
                      :loading="searchLoading"
                      :count="totalIndividualPlans"
                    />
                  </v-col>
                </v-card>
              </v-col>
            </v-col>
            <v-col v-if="clientTab === 1">
              <v-col v-if="showPlanLeadPage && !planLoading">
                <v-card :class="$vuetify?.breakpoint?.smAndDown ? 'elevation-0 pa-5' : 'elevation-6 pa-5'">
                  <v-card-text class="justify-center text-center">
                    <v-row justify="center" align="center" class="mt-8 mb-8">
                      <v-col xs12>
                        <h2 class="mb-4">You don’t have any Plans/Accounts yet.</h2>
                      </v-col>
                      <v-col xs12>
                        <h3 class="mb-3 font_14">
                          When you sell retirement plans using the lab, the plan will display here. Go ahead and find new business
                          using our lead search.
                        </h3>
                      </v-col>
                      <v-col xs12>
                        <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" @click="redirect()"> Lead Search </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col v-else>
                <v-card class="elevation-0" :class="$vuetify?.breakpoint?.smAndDown ? 'pt-3 pb-3' : 'pt-0 pb-0'">
                  <v-col xs12>
                    <v-data-table
                      :headers="headerList"
                      :items="searchResultForPlans"
                      item-key="PLANID"
                      mobile-breakpoint="0"
                      :class="[$vuetify?.breakpoint?.mdAndDown ? 'elevation-0 mb-0' : 'elevation-3 mb-0']"
                      :options="options"
                      :footer-props="{
                        'items-per-page-options': [10, 20, 50, 100]
                      }"
                    >
                      <template #item="{ item }">
                        <tr>
                          <td class="text-left text-capitalize pl-2 pr-2">
                            <v-hover v-slot="{ hover }">
                              <v-tooltip
                                location="top"
                                color="#0077CC"
                                opacity="1"
                                :max-width="$vuetify?.breakpoint?.lgAndUp ? '600px' : 'auto'"
                              >
                                <template #activator="{ props }">
                                  <v-col class="flex_none">
                                    <v-row>
                                      <v-col xs1 md2 lg1 xl1>
                                        <v-icon
                                          v-if="item.PlanBusinessType === 'School'"
                                          size="16"
                                          class="icon-graduation schoolIcon pr-1"
                                        />
                                        <v-icon
                                          v-if="item.PlanBusinessType === 'Employer Sponsored'"
                                          class="icon-for-profit forProfitIcon pr-1"
                                          size="21"
                                        />
                                        <v-icon
                                          v-if="item.PlanBusinessType === 'Municipality'"
                                          size="16"
                                          class="icon-government municipalitiesIcon pr-1"
                                        />
                                      </v-col>
                                      <v-col xs11 md10 lg11 xl11 class="flex_none">
                                        <a
                                          v-bind="props"
                                          :class="[
                                            !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                                          ]"
                                          class="text-capitalize pl-1"
                                          @click="planInfo(item.NAME, item.PLANID, item.Source, item)"
                                          >{{ item.NAME ? item.NAME.toLowerCase() : '' }}</a
                                        >
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </template>
                                <v-col class="pa-1">
                                  <v-col xs12>
                                    <v-row no-gutters>
                                      <v-col xs12 class="font-weight-medium pb-1"> Plan Details: </v-col>
                                      <v-col class="text-capitalize">
                                        {{ item.NAME ? item.NAME.toLowerCase() : ''
                                        }}{{ item.PLANID ? ' - ' + item.PLANID + '' : '' }}
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col v-if="item.PlanStatus" xs12 class="pt-1">
                                    item.PlanStatus ? item.PlanStatus : '' }}
                                  </v-col>
                                  <v-col v-if="item.PLANYEAREND" xs12 class="pt-1">
                                    item.PLANYEAREND ? item.PLANYEAREND : '' }}
                                  </v-col>
                                  <v-col xs12>
                                    <v-row>
                                      <v-col v-if="item.Advisor || item.FirmName" xs7>
                                        <v-row no-gutters>
                                          <v-col xs12 class="font-weight-medium pt-2 pb-1"> Advisor: </v-col>
                                          <v-col xs12>
                                            {{ item.PrimaryAdvisor ? item.PrimaryAdvisor : '' }}
                                          </v-col>
                                          <v-col xs12 class="pt-1">
                                            {{ item.FirmName ? item.FirmName : '' }}
                                          </v-col>
                                        </v-row>
                                      </v-col>
                                      <v-col v-if="item.TPA" xs5 class="flex_none">
                                        <v-row no-gutters>
                                          <v-col xs12 class="font-weight-medium pt-2 pb-1"> TPA: </v-col>
                                          <v-col xs12>
                                            {{ item.TPA ? item.TPA : '' }}
                                          </v-col>
                                        </v-row>
                                      </v-col>
                                      <v-col v-if="item.PlanSponsorName || item.PlanSponsorPhone" xs12>
                                        <v-row no-gutters>
                                          <v-col xs12 class="font-weight-medium pt-2 pb-1"> Sponsor: </v-col>
                                          <v-col xs12>
                                            {{ item.PlanSponsorName ? item.PlanSponsorName : '' }}
                                          </v-col>
                                          <v-col xs12>
                                            {{ item.PlanSponsorPhone ? item.PlanSponsorPhone : '' }}
                                          </v-col>
                                        </v-row>
                                      </v-col>
                                      <v-col xs12 class="py-1"> (Click the name to go to account details) </v-col>
                                    </v-row>
                                  </v-col>
                                </v-col>
                              </v-tooltip>
                            </v-hover>
                          </td>
                          <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-right">
                            {{ formatPrice(item.ASSETS, 2) }}
                          </td>
                          <td v-if="$vuetify?.breakpoint?.mdAndUp">
                            {{ item.PlanType }}
                          </td>
                          <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-right">
                            {{ item.TotalParticipants }}
                          </td>
                          <td v-if="$vuetify?.breakpoint?.mdAndUp">
                            {{ item.TPA }}
                          </td>
                          <td v-if="$vuetify?.breakpoint?.mdAndUp">
                            {{ item.RelationshipManagerName }}
                          </td>
                          <td v-if="$vuetify?.breakpoint?.mdAndUp">
                            {{ item.PLANYEAREND }}
                          </td>
                          <td v-if="$vuetify?.breakpoint?.mdAndUp">
                            {{ item.PlanStatus }}
                          </td>
                          <td class="text-center pa-1">
                            <v-row class="justify-center">
                              <v-col xs12 class="flex_none">
                                <v-btn
                                  icon
                                  :color="!$vuetify?.theme.dark ? 'hyperlink' : ''"
                                  variant="text"
                                  :disabled="item.Source"
                                  @click.stop=";[$set(closeReportPopUp, item.PLANID, true)]"
                                >
                                  <v-icon size="21" class="icon-action" />
                                </v-btn>
                                <v-dialog
                                  :key="item.PLANID"
                                  v-model="closeReportPopUp[item.PLANID]"
                                  :scrollable="false"
                                  :max-width="
                                    totalReport === 1 ? '300' : totalReport === 2 ? '400' : totalReport === 3 ? '500' : '50%'
                                  "
                                  content-class="elevation-3"
                                >
                                  <RBCReport
                                    :plan-i-d="item.PLANID"
                                    from-page="LivePlans"
                                    :plan-name="item.NAME"
                                    :target-object="item"
                                    @close-report="$set(closeReportPopUp, item.PLANID, false)"
                                    @report-list="reportList"
                                  />
                                </v-dialog>
                              </v-col>
                            </v-row>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                    <Loader
                      :loading-text="searchText ? `Finding plan ${searchText}` : 'Loading....'"
                      :loading="planLoading"
                      :count="searchResultForPlans ? searchResultForPlans.length : 0"
                    />
                  </v-col>
                </v-card>
              </v-col>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </v-col>
</template>
<script>
import RBCReport from '@/components/Retention/RBCReport'
import GlobalFilter from '@/components/GlobalFilter'
import { eventBus } from '@/main'
import Loader from '@/components/NewLoader'
import qs from 'qs'
import _ from 'lodash'
export default {
  components: {
    RBCReport,
    GlobalFilter,
    Loader
  },
  data() {
    return {
      hideCard: false,
      showFilter: false,
      searchText: '',
      headers: [
        {
          text: 'Participant Name',
          value: 'participantName',
          align: 'start',
          width: '15%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Plan Name',
          value: 'planName',
          align: 'start',
          width: '15%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Plan Type',
          value: 'planType',
          align: 'start',
          width: '10%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Participant Balance',
          value: 'totalAssets',
          align: 'start',
          width: '8%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Participant Age',
          value: 'participantAge',
          align: 'end',
          width: '8%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Participant Status',
          value: 'planStatus',
          align: 'start',
          width: '9%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Employment Status',
          value: 'employmentStatus',
          align: 'start',
          width: '9%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Loan Status',
          value: 'loanStatus',
          align: 'start',
          width: '9%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Equity Allocation',
          value: 'equityAllocation',
          align: 'end',
          width: '8%',
          display: true,
          sortable: false,
          class: 'sticky-header'
        },
        {
          text: 'Actions',
          value: 'action',
          align: 'center',
          width: '10%',
          class: 'sticky-header',
          display: false,
          sortable: false
        }
      ],
      totalIndividualPlans: -1,
      searchResult: [],
      searchResultForPlans: [],
      pagination: {
        sortBy: [],
        itemsPerPage: 20
      },
      closeReportPopUp: {},
      rbcPlans: [],
      totalReport: 2,
      currentPageNumber: 1,
      searchParticipants: [],
      searchLoading: false,
      planLoading: false,
      showPlanLeadPage: false,
      cancelToken: null,
      showloader: false,
      participantCount: 0,
      planCount: 0,
      sortByType: 'ParticipantName-Asc',
      sortByListType: [
        {
          text: 'Participant Name - A to Z',
          value: 'ParticipantName-Asc'
        },
        { text: 'Participant Name - Z to A', value: 'ParticipantName-Desc' },
        { text: 'Plan Name - A to Z', value: 'PlanName-Asc' },
        { text: 'Plan Name - Z to A', value: 'PlanName-Desc' },
        { text: 'Plan Type - A to Z', value: 'PlanType-Asc' },
        { text: 'Plan Type - Z to A', value: 'PlanType-Desc' },
        { text: 'Participant Balance - Low to High', value: 'TotalAssets-Asc' },
        { text: 'Participant Balance - High to Low', value: 'TotalAssets-Desc' },
        { text: 'Participant Age - Low to High', value: 'Age-Asc' },
        { text: 'Participant Age - High to Low', value: 'Age-Desc' },
        {
          text: 'Participant Status - A to Z',
          value: 'PlanStatus-Asc'
        },
        {
          text: 'Participant Status - Z to A',
          value: 'PlanStatus-Desc'
        },
        {
          text: 'Employment Status - A to Z',
          value: 'EmploymentStatus-Asc'
        },
        {
          text: 'Employment Status - Z to A',
          value: 'EmploymentStatus-Desc'
        },
        { text: 'Loan Status - Low to High', value: 'LoanStatus-Asc' },
        { text: 'Loan Status - High to Low', value: 'LoanStatus-Desc' },
        {
          text: 'Equity Allocation - Low to High',
          value: 'EquityAllocation-Asc'
        },
        {
          text: 'Equity Allocation - High to Low',
          value: 'EquityAllocation-Desc'
        }
      ],
      showLeadPage: false,
      filterType: '',
      headerList: [
        {
          text: 'Plan Name',
          value: 'NAME',
          align: 'start',
          class: 'pl-2 pr-2 sticky-header',
          sortable: false
        },
        {
          text: 'Total Assets',
          value: 'ASSETS',
          align: 'end',
          class: 'hidden-sm-and-down sticky-header',
          sortable: false
        },
        {
          text: 'Plan Type',
          value: 'PlanType',
          align: 'start',
          class: 'hidden-sm-and-down sticky-header',
          sortable: false
        },
        {
          text: 'Total Participants',
          value: 'TotalParticipants',
          align: 'end',
          class: 'hidden-sm-and-down sticky-header',
          sortable: false
        },
        {
          text: 'Third party Administrator',
          value: 'TPA',
          align: 'start',
          class: 'hidden-sm-and-down sticky-header',
          sortable: false
        },
        {
          text: 'Relationship Manager',
          value: 'RelationshipManagerName',
          align: 'start',
          class: 'hidden-sm-and-down sticky-header',
          sortable: false
        },
        {
          text: 'Plan Year',
          value: 'PLANYEAREND',
          align: 'start',
          class: 'hidden-sm-and-down sticky-header',
          sortable: false
        },
        {
          text: 'Plan Status',
          value: 'PlanStatus',
          align: 'start',
          class: 'pa-1 hidden-sm-and-down sticky-header',
          sortable: false
        },
        {
          text: 'Action',
          value: 'action',
          align: 'center',
          width: '80px',
          class: 'pa-1 sticky-header',
          sortable: false
        }
      ],
      employeeSortByType: 'NAME-ASC',
      employeeSortByListType: [
        { text: 'Plan Name - A to Z', value: 'NAME-ASC' },
        { text: 'Plan Name - Z to A', value: 'NAME-DESC' },
        { text: 'Total Assets - Low to High', value: 'ASSETS-ASC' },
        { text: 'Total Assets - High to Low', value: 'ASSETS-DESC' },
        { text: 'Plan Type - A to Z', value: 'PlanType-ASC' },
        { text: 'Plan Type - Z to A', value: 'PlanType-DESC' },
        { text: 'Total Participants - Low to High', value: 'TotalParticipants-ASC' },
        { text: 'Total Participants - High to Low', value: 'TotalParticipants-DESC' },
        { text: 'TPA - Low to High', value: 'TPA-ASC' },
        { text: 'TPA - High to Low', value: 'TPA-DESC' },
        {
          text: 'Relationship Manager - A to Z',
          value: 'RelationshipManagerName-ASC'
        },
        {
          text: 'Relationship Manager - Z to A',
          value: 'RelationshipManagerName-DESC'
        },
        { text: 'Plan Year - Low to High', value: 'PLANYEAREND-ASC' },
        { text: 'Plan Year - High to Low', value: 'PLANYEAREND-DESC' },
        { text: 'Plan Status - A to Z', value: 'PlanStatus-ASC' },
        { text: 'Plan Status - Z to A', value: 'PlanStatus-DESC' }
      ],
      showSearch: false,
      options: {
        sortBy: [],
        itemsPerPage: 20
      },
      participantPlanStatus: '',
      participantAgeDetails: {},
      participantAccountType: '',
      participantAsset: {},
      participantEquity: {},
      participantEmploymentStatus: '',
      participantContributionStatus: '',
      participantRetirement: '',
      participantEnrolledStatus: '',
      employeePlanStatus: [],
      employeeAccountType: [],
      employeeAsset: [],
      employeeParticipant: [],
      participantAgeList: [
        {
          item1: 0,
          item2: 19,
          text: '<20 years',
          type: 'participantage',
          selected: false
        },
        {
          item1: 20,
          item2: 30,
          text: '20-30 years',
          type: 'participantage',
          selected: false
        },
        {
          item1: 30,
          item2: 40,
          text: '30-40 years',
          type: 'participantage',
          selected: false
        },
        {
          item1: 40,
          item2: 50,
          text: '40-50 years',
          type: 'participantage',
          selected: false
        },
        {
          item1: 51,
          item2: 9999999,
          text: '>50 years',
          type: 'participantage',
          selected: false
        }
      ],
      assetValueList: [
        {
          item1: 0,
          item2: 100000,
          text: '<$100k',
          type: 'asset',
          selected: false,
          value: '$0-$100000'
        },
        {
          item1: 100001,
          item2: 500000,
          text: '$100K-$500K',
          type: 'asset',
          selected: false,
          value: '$100001-$500000'
        },
        {
          item1: 500001,
          item2: 1000000,
          text: '$500K-$1M',
          type: 'asset',
          selected: false,
          value: '$500001-$1000000'
        },
        {
          item1: 1000001,
          item2: 5000000,
          text: '$1M-$5M',
          type: 'asset',
          selected: false,
          value: '$1000001-$5000000'
        },
        {
          item1: 5000001,
          item2: 10000000,
          text: '$5M-$10M',
          type: 'asset',
          selected: false,
          value: '$5000001-$10000000'
        },
        {
          item1: 10000001,
          item2: 999999999999999,
          text: '>$10M',
          type: 'asset',
          selected: false,
          value: '$0-$999999999999999'
        }
      ],
      equityAllocationList: [
        {
          item1: 10,
          item2: 25,
          text: '10-25%',
          type: 'ep',
          selected: false
        },
        {
          item1: 25,
          item2: 50,
          text: '25-50%',
          type: 'ep',
          selected: false
        },
        {
          item1: 50,
          item2: 75,
          text: '50-75%',
          type: 'ep',
          selected: false
        },
        {
          item1: 75,
          item2: 100,
          text: '75-100%',
          type: 'ep',
          selected: false
        }
      ],
      clientTab: 0,
      clientList: [
        {
          text: 'Participant View',
          value: 0,
          disable: true,
          show: true
        },
        {
          text: 'Plan View',
          value: 1,
          disable: true,
          show: true
        }
      ],
      contributionStatusList: [
        {
          text: 'Contributing',
          selected: false
        },
        {
          text: 'Not Contributing',
          selected: false
        }
      ],
      enrolledStatusList: [
        {
          text: 'Enrolled',
          selected: false
        },
        {
          text: 'Not Enrolled',
          selected: false
        }
      ],
      retirementList: [
        {
          text: '1 Year',
          selected: false,
          value: 1
        },
        {
          text: '2 Years',
          selected: false,
          value: 2
        },
        {
          text: '3 Years',
          selected: false,
          value: 3
        },
        {
          text: '5 Years',
          selected: false,
          value: 5
        },
        {
          text: '10 Years',
          selected: false,
          value: 10
        }
      ],
      searchPlans: [],
      employeePlanStatusList: [
        {
          text: 'Implementation',
          value: 'Implementation',
          selected: false
        },
        {
          text: 'Live',
          value: 'Live',
          selected: false
        },
        {
          text: 'Live (Plan Termination)',
          value: 'Live (Plan Termination)',
          selected: false
        },
        {
          text: 'Live (Service Termination)',
          value: 'Live (Service Termination)',
          selected: false
        }
      ],
      employerAssetList: [
        {
          item1: 0,
          item2: 100000,
          text: '< $100k',
          type: 'employerasset',
          selected: false
        },
        {
          item1: 100000,
          item2: 500000,
          text: '$100K - $500K',
          type: 'employerasset',
          selected: false
        },
        {
          item1: 500000,
          item2: 1000000,
          text: '$500K - $1M',
          type: 'employerasset',
          selected: false
        },
        {
          item1: 1000000,
          item2: 5000000,
          text: '$1M - $5M',
          type: 'employerasset',
          selected: false
        },
        {
          item1: 5000000,
          item2: 10000000,
          text: '$5M - $10M',
          type: 'employerasset',
          selected: false
        },
        {
          item1: 10000000,
          item2: 999999999999999,
          text: '> $10M',
          type: 'employerasset',
          selected: false
        }
      ],
      participantsList: [
        {
          item1: 0,
          item2: 24,
          text: '< 25',
          type: 'employerparticipant',
          selected: false
        },
        {
          item1: 25,
          item2: 50,
          text: '25 - 50',
          type: 'employerparticipant',
          selected: false
        },
        {
          item1: 51,
          item2: 100,
          text: '51 - 100',
          type: 'employerparticipant',
          selected: false
        },
        {
          item1: 101,
          item2: 250,
          text: '101 - 250',
          type: 'employerparticipant',
          selected: false
        },
        {
          item1: 251,
          item2: 500,
          text: '251 - 500',
          type: 'employerparticipant',
          selected: false
        },
        {
          item1: 501,
          item2: 999999999,
          text: '> 501',
          type: 'employerparticipant',
          selected: false
        }
      ],
      filterButton: [
        {
          text: 'Participant Status',
          value: 'participantPlanStaus',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: 'Refers to a participant’s eligibility to enter the plan, or if an employee has been terminated.'
        },
        {
          text: 'Enrolled Status',
          value: 'enrolledStatus',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: ''
        },
        {
          text: 'Participant Age',
          value: 'participantAge',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: ''
        },
        {
          text: 'Plan Type',
          value: 'participantAccountType',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: 'Refers to the type of retirement plan.'
        },
        {
          text: 'Participant Balance',
          value: 'participantAssetValue',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: ''
        },
        {
          text: 'Equity Allocation',
          value: 'equity',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: 'Refers to the percent of equity within a participants account.'
        },
        {
          text: 'Employment Status',
          value: 'employmentStatus',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: ''
        },
        {
          text: 'Contribution Status',
          value: 'contributionStatus',
          tab: 0,
          selected: false,
          count: 0,
          tooltip:
            'Only refers to participants who are eligible and enrolled in the plan, does not account for eligible employees not enrolled in the plan.'
        },
        {
          text: 'Retirement',
          value: 'retirement',
          tab: 0,
          selected: false,
          count: 0,
          tooltip: 'Refers to how many years away the participant is from their social security retirement age.'
        },
        {
          text: 'Plan Status',
          value: 'planStatus',
          tab: 1,
          selected: false,
          count: 0,
          tooltip: ''
        },
        {
          text: 'Plan Type',
          value: 'accountType',
          tab: 1,
          selected: false,
          count: 0,
          tooltip: ''
        },
        {
          text: 'Asset Value',
          value: 'assetValue',
          tab: 1,
          selected: false,
          count: 0,
          tooltip: ''
        },
        {
          text: 'Total Participants',
          value: 'totalParticipant',
          tab: 1,
          selected: false,
          count: 0,
          tooltip: ''
        }
      ],
      itemPerPage: 20
    }
  },
  computed: {
    breadCrumb() {
      return this.$route.meta
    },
    fontSize() {
      return this.$root.$children[0].fontsize
    },
    displayGlobalFilter() {
      if (
        this.$authz.hasRole(this.$authz.roles.SiteAdmin) ||
        this.$authz.hasRole(this.$authz.roles.ProgramAdmin) ||
        this.$authz.hasRole(this.$authz.roles.InternalAdmin) ||
        this.$authz.hasRole(this.$authz.roles.FirmAdmin)
      ) {
        return this.$store.state.user.selectedProgram.accounts.length > 0
      }
      return false
    },
    showLegalText() {
      if (
        this.$store.state.user.selectedProgram &&
        this.$store.state.user.selectedProgram.legal_Policy__c &&
        this.$store.state.user.selectedProgram.legal_Policy__c.length <= 600
      ) {
        return true
      }
      return false
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
    },
    cardHeight() {
      if (this.showLegalText) {
        if (this.$vuetify?.breakpoint?.xlOnly) {
          return 100 - 17
        } else if (this.$vuetify?.breakpoint?.width >= 1400) {
          return 100 - 18
        } else if (!this.$vuetify?.breakpoint?.smAndDown) {
          return 100 - 24
        } else return 100 - 24
      } else {
        if (this.$vuetify?.breakpoint?.xlOnly) {
          return 100 - 11
        }
        if (this.$vuetify?.breakpoint?.width >= 1400) {
          return 100 - 12
        } else if (!this.$vuetify?.breakpoint?.smAndDown) {
          return 100 - 13
        } else return 100 - 13
      }
    },
    accountTypeList() {
      if (Object.keys(this.$store.state.clientFilter).length > 0) {
        return this.$store.state.clientFilter.accountTypeList
          ? this.$store.state.clientFilter.accountTypeList.map((v) => Object.assign(v, { selected: false }))
          : []
      }
      return []
    },
    employmentStatusList() {
      if (Object.keys(this.$store.state.clientFilter).length > 0) {
        return this.$store.state.clientFilter.employmentStatusList
          ? this.$store.state.clientFilter.employmentStatusList.map((v) => Object.assign(v, { selected: false }))
          : []
      }
      return []
    },
    planStatusList() {
      if (Object.keys(this.$store.state.clientFilter).length > 0) {
        return this.$store.state.clientFilter.planStatusList
          ? this.$store.state.clientFilter.planStatusList.map((v) => Object.assign(v, { selected: false }))
          : []
      }
      return []
    },
    employeePlanTypeList() {
      if (Object.keys(this.$store.state.clientFilter).length > 0) {
        if (this.$store.state.clientFilter.employeePlanList && this.$store.state.clientFilter.employeePlanList.length > 0) {
          return this.$store.state.clientFilter.employeePlanList.map((v) => Object.assign(v, { selected: false }))
        }
        return []
      }
      return []
    }
  },
  watch: {
    clientTab: {
      handler(val) {
        this.getFilterValue(val)
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.$store.dispatch('getAccountList')
  },
  mounted() {
    this.$store.dispatch('getClientFilterValue')
    if (this.$store.state.clientPlan.prospectValue >= 0) {
      this.clientTab = this.$store.state.clientPlan.prospectValue
    } else {
      var tabValue = this.clientList.filter((a) => a.show === true)
      if (tabValue && tabValue.length > 0) {
        this.clientTab = tabValue[0].value
      }
    }
    this.updateClientModels()
    eventBus.on('filterGlobalData', () => {
      this.searchResult = []
      this.totalIndividualPlans = -1
      this.currentPageNumber = 1
      this.participantCount = 0
      this.searchResultForPlans = []
      this.planCount = 0
      this.applyFilter('pageLoad')
    })
  },
  methods: {
    getFilterValue(val) {
      if (val === 0) {
        let selectedTab = this.filterButton.filter((a) => a.tab === val && a.selected === true)
        if (selectedTab && selectedTab.length > 0) {
          this.filterType = selectedTab[0].value
          this.filterButton.forEach((a) => {
            if (a.value !== selectedTab[0].value) {
              a.selected = false
            }
          })
        } else {
          this.filterButton[0].selected = true
          this.filterType = this.filterButton[0].value
        }
        this.searchText = this.$store.state.clientPlan.participantSearchText
          ? this.$store.state.clientPlan.participantSearchText
          : ''
        this.showSearch = this.$store.state.clientPlan.participantSearchText ? true : false
      } else {
        let selectedTab1 = this.filterButton.filter((a) => a.tab === val && a.selected === true)
        if (selectedTab1 && selectedTab1.length > 0) {
          this.filterType = selectedTab1[0].value
        } else {
          this.filterButton[9].selected = true
          this.filterType = this.filterButton[9].value
        }
        if (this.$store.state.clientPlan.planSelectText) {
          this.searchText = this.$store.state.clientPlan.planSelectText
          this.planId = this.$store.state.clientPlan.planId
          this.showSearch = true
        } else {
          this.searchText = ''
          this.planId = ''
          this.showSearch = false
        }
      }
    },
    formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      }
      return ''
    },
    redirect() {
      this.$store.state.finderList = {}
      this.$router.push('/TAL/Finder/Result').catch(() => {})
    },
    clearSearch(val) {
      this.hideCard = false
      if (this.clientTab === 0) {
        this.$store.state.clientPlan.participantSearchText = ''
        this.searchText = ''
        this.showloader = false
        if (val === 'load') {
          this.searchParticipants = []
          this.searchResult = []
          this.currentPageNumber = 1
          this.participantCount = 0
          this.totalIndividualPlans = -1
          this.applyFilter('pageLoad')
        }
      } else if (this.clientTab === 1) {
        this.$store.state.clientPlan.planSelectText = ''
        this.$store.state.clientPlan.planId = ''
        this.searchText = ''
        this.planId = ''
        this.showloader = false
        if (val === 'load') {
          this.searchPlans = []
          this.searchResultForPlans = []
          this.planCount = 0
          this.applyFilter('pageLoad')
        }
      }
    },
    handleScroll() {
      this.hideCard = false
    },
    updateClientModels() {
      if (Object.keys(this.$store.state.clientPlan).length > 0) {
        this.employeeSortByType = this.$store.state.clientPlan.employeeSortByType
          ? this.$store.state.clientPlan.employeeSortByType
          : 'NAME-ASC'

        if (this.$store.state.clientPlan.searchTypeSelected === 'Plans' && this.clientTab === 1) {
          this.searchText = this.$store.state.clientPlan.plan ? this.$store.state.clientPlan.plan : ''
          this.planId = this.$store.state.clientPlan.planId ? this.$store.state.clientPlan.planId : ''
          this.showSearch = true
        } else if (this.$store.state.clientPlan.searchTypeSelected === 'Individual' && this.clientTab === 0) {
          this.searchText = this.$store.state.clientPlan.plan ? this.$store.state.clientPlan.plan : ''
          this.planId = this.$store.state.clientPlan.planId ? this.$store.state.clientPlan.planId : ''
          this.showSearch = true
        } else {
          this.searchText = ''
          this.planId = ''
          this.showSearch = false
        }
        this.searchResultForPlans = this.$store.state.clientPlan.planData ? this.$store.state.clientPlan.planData : []
        this.savePlans = this.$store.state.clientPlan.savePlans ? this.$store.state.clientPlan.savePlans : []
        this.planCount = this.$store.state.clientPlan.planCount ? this.$store.state.clientPlan.planCount : 0
        this.searchResult = this.$store.state.clientPlan.individualData ? this.$store.state.clientPlan.individualData : []
        this.participantCount = this.$store.state.clientPlan.individualDataCount
          ? this.$store.state.clientPlan.individualDataCount
          : 0

        if (this.$store.state.clientPlan.filter && Object.keys(this.$store.state.clientPlan.filter).length > 0) {
          this.filterButton.forEach((a) => {
            if (a.tab === this.clientTab) {
              a.selected = false
            }
          })
          let filterValue = this.$store.state.clientPlan.filter
          this.participantPlanStatus =
            filterValue.partPlanStatus && filterValue.partPlanStatus.length > 0 ? filterValue.partPlanStatus : ''
          this.participantAgeDetails = filterValue.partAge ? filterValue.partAge : {}
          this.participantAccountType =
            filterValue.partAccountType && filterValue.partAccountType.length > 0 ? filterValue.partAccountType : ''
          this.participantAsset = filterValue.partAsset ? filterValue.partAsset : {}
          this.participantEquity = filterValue.partEquity ? filterValue.partEquity : {}
          this.participantEmploymentStatus =
            filterValue.partEmployment && filterValue.partEmployment.length > 0 ? filterValue.partEmployment : ''
          this.participantContributionStatus =
            filterValue.partContribution && filterValue.partContribution.length > 0 ? filterValue.partContribution : ''
          this.participantEnrolledStatus =
            filterValue.partEnrolled && filterValue.partEnrolled.length > 0 ? filterValue.partEnrolled : ''
          this.participantRetirement =
            filterValue.partRetirement && filterValue.partRetirement.length > 0 ? filterValue.partRetirement : ''
          this.employeePlanStatus =
            filterValue.empPlanStatus && filterValue.empPlanStatus.length > 0 ? filterValue.empPlanStatus : []
          this.employeeAccountType =
            filterValue.empAccountType && filterValue.empAccountType.length > 0 ? filterValue.empAccountType : []
          this.employeeAsset = filterValue.empAsset && filterValue.empAsset.length > 0 ? filterValue.empAsset : []
          this.employeeParticipant =
            filterValue.empParticipant && filterValue.empParticipant.length > 0 ? filterValue.empParticipant : []

          if (this.participantPlanStatus && this.participantPlanStatus.length > 0) {
            this.planStatusList.forEach((ele) => {
              if (ele.PlanStatus === this.participantPlanStatus[0]) {
                ele.selected = true
              }
            })
            this.updateFilterCount(
              'participantPlanStaus',
              this.participantPlanStatus && this.participantPlanStatus.length > 0 ? this.participantPlanStatus.length : 0
            )
          }
          if (this.participantContributionStatus && this.participantContributionStatus.length > 0) {
            var data1
            if (this.participantContributionStatus[0] === 'Yes') {
              data1 = 'Contributing'
            } else {
              data1 = 'Not Contributing'
            }
            this.contributionStatusList.forEach((a) => {
              if (a.text === data1) {
                a.selected = true
              }
            })
            this.updateFilterCount(
              'contributionStatus',
              this.participantContributionStatus && this.participantContributionStatus.length > 0
                ? this.participantContributionStatus.length
                : 0
            )

            let filterPosition = this.filterButton.findIndex((a) => a.value === 'contributionStatus')
            if (filterPosition !== 'undefined' && filterPosition > -1) {
              this.filterButton[filterPosition].selected = true
            }
            this.filterType = 'contributionStatus'
          }

          if (this.participantEnrolledStatus && this.participantEnrolledStatus.length > 0) {
            var data2
            if (this.participantEnrolledStatus[0] === 'Yes') {
              data2 = 'Enrolled'
            } else {
              data2 = 'Not Enrolled'
            }
            this.enrolledStatusList.forEach((a) => {
              if (a.text === data2) {
                a.selected = true
              }
            })
            this.updateFilterCount(
              'enrolledStatus',
              this.participantEnrolledStatus && this.participantEnrolledStatus.length > 0
                ? this.participantEnrolledStatus.length
                : 0
            )

            let filterPosition = this.filterButton.findIndex((a) => a.value === 'enrolledStatus')
            if (filterPosition !== 'undefined' && filterPosition > -1) {
              this.filterButton[filterPosition].selected = true
            }
            this.filterType = 'enrolledStatus'
          }

          if (this.participantAgeDetails) {
            let ageValue = filterValue.partAge ? filterValue.partAge.text : ''
            this.participantAgeList.forEach((ab) => {
              if (ab.text === ageValue) {
                ab.selected = true
              }
            })
            let newArray = this.participantAgeList.filter((a) => a.selected === true)
            this.updateFilterCount('participantAge', newArray && newArray.length > 0 ? newArray.length : 0)
          }

          if (this.participantAccountType) {
            this.accountTypeList.forEach((ele) => {
              if (ele.AccountType === this.participantAccountType[0]) {
                ele.selected = true
              }
            })
            this.updateFilterCount(
              'participantAccountType',
              this.participantAccountType && this.participantAccountType.length > 0 ? this.participantAccountType.length : 0
            )
          }

          if (this.participantAsset) {
            let assetValue = filterValue.partAsset ? filterValue.partAsset.text : ''
            this.assetValueList.forEach((a) => {
              if (a.value === assetValue) {
                a.selected = true
              }
            })
            let newArray = this.assetValueList.filter((a) => a.selected === true)
            this.updateFilterCount('participantAssetValue', newArray && newArray.length > 0 ? newArray.length : 0)
          }

          if (this.participantEquity) {
            let equityValue = filterValue.partEquity ? filterValue.partEquity.text : ''
            this.equityAllocationList.forEach((a) => {
              if (a.text === equityValue) {
                a.selected = true
              }
            })
            let newArray = this.equityAllocationList.filter((a) => a.selected === true)
            this.updateFilterCount('equity', newArray && newArray.length > 0 ? newArray.length : 0)
          }
          if (this.participantEmploymentStatus) {
            this.employmentStatusList.forEach((ele) => {
              if (ele.EmploymentStatus === this.participantEmploymentStatus[0]) {
                ele.selected = true
              }
            })
            this.updateFilterCount(
              'employmentStatus',
              this.participantEmploymentStatus && this.participantEmploymentStatus.length > 0
                ? this.participantEmploymentStatus.length
                : 0
            )
          }
          if (this.participantRetirement) {
            this.retirementList.forEach((ele) => {
              if (ele.value === this.participantRetirement[0]) {
                ele.selected = true
              }
            })
            this.updateFilterCount(
              'retirement',
              this.participantRetirement && this.participantRetirement.length > 0 ? this.participantRetirement.length : 0
            )
          }

          if (this.employeePlanStatus && this.employeePlanStatus.length > 0) {
            this.employeePlanStatusList.forEach((a) => {
              this.employeePlanStatus.forEach((b) => {
                if (b.text === a.text) {
                  a.selected = true
                }
              })
            })
            this.filterButton[9].selected = true
            this.updateFilterCount(
              'planStatus',
              this.employeePlanStatus && this.employeePlanStatus.length > 0 ? this.employeePlanStatus.length : 0
            )
          }
          if (this.employeeAccountType && this.employeeAccountType.length > 0) {
            this.employeePlanTypeList.forEach((a) => {
              this.employeeAccountType.forEach((b) => {
                if (b.PlanType === a.PlanType) {
                  a.selected = true
                }
              })
            })
            this.filterButton[10].selected = true
            this.updateFilterCount(
              'accountType',
              this.employeeAccountType && this.employeeAccountType.length > 0 ? this.employeeAccountType.length : 0
            )
          }
          if (this.employeeAsset && this.employeeAsset.length > 0) {
            this.employerAssetList.forEach((a) => {
              this.employeeAsset.forEach((b) => {
                if (b.text === a.text) {
                  a.selected = true
                }
              })
            })
            this.filterButton[11].selected = true
            this.updateFilterCount(
              'assetValue',
              this.employeeAsset && this.employeeAsset.length > 0 ? this.employeeAsset.length : 0
            )
          }
          if (this.employeeParticipant && this.employeeParticipant.length > 0) {
            this.participantsList.forEach((a) => {
              this.employeeParticipant.forEach((b) => {
                if (b.text === a.text) {
                  a.selected = true
                }
              })
            })
            this.filterButton[12].selected = true
            this.updateFilterCount(
              'totalParticipant',
              this.employeeParticipant && this.employeeParticipant.length > 0 ? this.employeeParticipant.length : 0
            )
          }
          this.getFilterValue(this.clientTab)

          this.applyFilter('participantsearch')
          this.applyFilter('plansearch')
        } else {
          if (
            (this.planCount === 0 && this.searchResultForPlans && this.searchResultForPlans.length === 0) ||
            (this.participantCount === 0 && this.searchResult && this.searchResult.length === 0)
          ) {
            this.applyFilter('pageLoad')
          }
        }
      } else {
        this.applyFilter('pageLoad')
      }
    },
    getItemPerPage(val) {
      if (val) {
        this.itemPerPage = val
        this.applyFilter('perPage')
      }
    },
    ///Observable Start
    async participantIntersected(val) {
      this.currentPageNumber = val
      if (!this.searchLoading) {
        if (parseInt(this.currentPageNumber) > 0) {
          if (!this.searchText) {
            if (this.searchResult && this.searchResult.length > 0) {
              this.applyFilter('nextPage')
            }
          }
        }
      }
    },
    ///Observable End
    ///Autocomplete Start
    getPlanValue(val, type) {
      if (type === 'plans') {
        this.searchText = val.Name
        this.planId = val.PlanId
        this.$store.state.clientPlan.planSelectText = val.Name
        this.$store.state.clientPlan.planId = val.PlanId
        this.searchPlans = []
        this.searchResultForPlans = []
        this.planCount = 0
      } else {
        this.searchText = val
        this.$store.state.clientPlan.participantSearchText = val
        this.planId = ''
        this.searchResult = []
        this.searchParticipants = []
        this.participantCount = 0
      }
      this.clearFilter(true)
    },
    checkFields() {
      if (this.searchText === '') {
        if (this.clientTab === 0) {
          this.searchParticipants = []
          this.$store.state.clientPlan.participantSearchText = ''
        }
        if (this.clientTab === 1) {
          this.searchPlans = []
          this.$store.state.clientPlan.planSelectText = ''
          this.$store.state.clientPlan.planId = ''
          this.planId = ''
        }
        this.hideCard = true
        this.showloader = false
      } else {
        if (this.clientTab === 0) this.$store.state.clientPlan.participantSearchText = this.searchText
        if (this.clientTab === 1) this.$store.state.clientPlan.planSelectText = this.searchText
        this.getPlanResults()
      }
    },
    searchAreaFocusOut() {
      this.hideCard = false
      if (this.clientTab === 0) this.searchParticipants = []
      if (this.clientTab === 1) this.searchPlans = []
    },
    async getPlanResults() {
      if (this.searchText) {
        this.hideCard = true
        this.showloader = true
        if (this.cancelToken) this.cancelToken.cancel()
        this.cancelToken = this.$axiosCancelToken.source()
        if (this.clientTab === 0) {
          if (this.$store.state.user.reliusLoginId) {
            await this.$axios
              .get(`/api/v1/rbc/autocomplete/participantDetails/${event.target.value}`, {
                cancelToken: this.cancelToken.token
              })
              .then((success) => {
                this.searchParticipants = success.data.d ? success.data.d : []
                this.showloader = false
              })
              .catch(() => {
                this.showloader = false
              })
          }
        } else {
          await this.$axios
            .get(`/api/v1/rbc/autocomplete/plan/${event.target.value}`, {
              cancelToken: this.cancelToken.token
            })
            .then((success) => {
              this.searchPlans = success.data.d && success.data.d.length > 0 ? success.data.d : []
              this.showloader = false
            })
            .catch(() => {
              this.showloader = false
            })
        }
      } else {
        this.hideCard = true
        this.showloader = false
        if (this.clientTab === 1) this.searchPlans = []
        if (this.clientTab === 0) this.searchParticipants = []
      }
    },
    ///Autocomplete End
    ///Advance Filter Start
    clearFilter(val) {
      if (this.clientTab === 0) {
        if (val) {
          this.currentPageNumber = 1
          this.searchResult = []
          this.participantCount = 0
          this.totalIndividualPlans = -1
          this.applyFilter('participantsearch')
        }
      } else if (this.clientTab === 1) {
        if (val) {
          this.searchResultForPlans = []
          this.planCount = 0
          this.applyFilter('plansearch')
        }
      }
    },
    resetFilter() {
      if (this.clientTab === 0) {
        this.participantPlanStatus = ''
        this.participantAgeDetails = {}
        this.participantAccountType = ''
        this.participantAsset = {}
        this.participantEquity = {}
        this.participantEmploymentStatus = ''
        this.participantContributionStatus = ''
        this.participantRetirement = ''
        this.participantEnrolledStatus = ''
        this.filterButton.forEach((ele) => {
          if (ele.tab === 0) {
            ele.count = 0
          }
        })
        if (this.accountTypeList.length > 0) {
          this.accountTypeList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.planStatusList.length > 0) {
          this.planStatusList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.participantAgeList.length > 0) {
          this.participantAgeList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.assetValueList.length > 0) {
          this.assetValueList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.equityAllocationList.length > 0) {
          this.equityAllocationList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.employmentStatusList.length > 0) {
          this.employmentStatusList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.contributionStatusList.length > 0) {
          this.contributionStatusList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.enrolledStatusList.length > 0) {
          this.enrolledStatusList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.retirementList.length > 0) {
          this.retirementList.forEach((element) => {
            element.selected = false
          })
        }
        this.$store.state.clientPlan.filter.partPlanStatus = ''
        this.$store.state.clientPlan.filter.partAge = {}
        this.$store.state.clientPlan.filter.partAccountType = ''
        this.$store.state.clientPlan.filter.partAsset = {}
        this.$store.state.clientPlan.filter.partEquity = {}
        this.$store.state.clientPlan.filter.partEmployment = ''
        this.$store.state.clientPlan.filter.partContribution = ''
        this.$store.state.clientPlan.filter.partRetirement = ''
        this.$store.state.clientPlan.filter.partEnrolled = ''
        this.setParticipantFilter()
      } else {
        this.employeePlanStatus = []
        this.employeeAccountType = []
        this.employeeAsset = []
        this.employeeParticipant = []
        this.filterButton.forEach((a) => {
          if (a.tab === 1) {
            a.count = 0
          }
        })
        if (this.employeePlanStatusList.length > 0) {
          this.employeePlanStatusList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.employeePlanTypeList.length > 0) {
          this.employeePlanTypeList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.employerAssetList.length > 0) {
          this.employerAssetList.forEach((element) => {
            element.selected = false
          })
        }
        if (this.participantsList.length > 0) {
          this.participantsList.forEach((element) => {
            element.selected = false
          })
        }
        this.getFilteredPlan()
        this.setPlanFilterChips()
      }
    },
    ///Advance Filter Finish
    ///Search plans
    reportList(val) {
      this.totalReport = val.length
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
    async applyFilter(val) {
      var accountId = []
      var contactId = []
      if (Object.keys(this.$store.state.globalFilter).length > 0) {
        if (this.$store.state.globalFilter.firm && this.$store.state.globalFilter.firm.length > 0) {
          accountId = this.$store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if (this.$store.state.globalFilter.advisor && this.$store.state.globalFilter.advisor.length > 0) {
          contactId = this.$store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      this.getPlanData(val, accountId, contactId)
      this.getParticipant(val, accountId, contactId)
    },
    async getPlanData(val, accountId, contactId) {
      if (val === 'pageLoad' || val === 'plansearch') {
        this.planLoading = true
        this.showPlanLeadPage = false
        var promises = []
        var rbcPlans = []
        var tsmPlans = []
        let urlObj = {}
        let sortSelected = []
        var employeeSponserUrl = `/api/v1/retention/rbc/myplans`
        if (this.$store.state.clientPlan.planSelectText) {
          urlObj['searchCriteria'] = this.planId
          employeeSponserUrl = `/api/v1/retention/rbc/myplans?${this.encodeQueryData(urlObj)}`
        }
        if (this.employeeSortByType) {
          sortSelected = this.employeeSortByType.split('-')
        }
        if (sortSelected && sortSelected.length > 0) {
          urlObj['sortColumn'] = sortSelected && sortSelected.length > 0 ? sortSelected[0] : 'NAME'
          urlObj['sortBy'] = sortSelected && sortSelected.length > 0 ? sortSelected[1] : 'ASC'
          employeeSponserUrl = `/api/v1/retention/rbc/myplans?${this.encodeQueryData(urlObj)}`
        }
        if (this.$store.state.user.reliusLoginId) {
          promises.push(
            this.$axios
              .get(`${employeeSponserUrl}`, {
                params: {
                  accountId: accountId,
                  advisorContactId: contactId
                },
                paramsSerializer: (params) => {
                  return qs.stringify(params, { arrayFormat: 'repeat' })
                }
              })
              .then((success) => {
                rbcPlans = success.data.d && success.data.d.length > 0 ? success.data.d : []
              })
          )
        }

        if (this.$store.state.user.tsmLoginId) {
          promises.push(
            this.$axios.get(`/api/v1/retention/tsm/myplans`).then((success) => {
              tsmPlans = success.data.d && success.data.d.length > 0 ? success.data.d : []
            })
          )
        }
        await Promise.allSettled(promises)
        this.savePlans = rbcPlans.concat(tsmPlans)
        this.$store.state.clientPlan.savePlans = this.savePlans
        if (this.savePlans && this.savePlans.length > 0) {
          this.getFilteredPlan()
        } else {
          this.searchResultForPlans = []
          this.planCount = 0
          this.planLoading = false
          if (val === 'pageLoad') this.showPlanLeadPage = true
        }
      }
    },
    async getParticipant(val, accountId, contactId) {
      if (val === 'pageLoad' || val === 'nextPage' || val === 'participantsearch' || val === 'perPage') {
        let sortSelected = []
        if (this.sortByType) {
          sortSelected = this.sortByType.split('-')
        } else sortSelected = []

        this.searchLoading = true
        this.showLeadPage = false
        var FilterParticipantDetails = {}
        FilterParticipantDetails.Page = this.currentPageNumber ? this.currentPageNumber : 1
        FilterParticipantDetails.AccountId = accountId
        FilterParticipantDetails.AdvisorContactId = contactId
        FilterParticipantDetails.Searchcriteria = this.searchText ? this.searchText : ''

        FilterParticipantDetails.SortColumn = sortSelected && sortSelected.length > 0 ? sortSelected[0] : 'ParticipantName'
        FilterParticipantDetails.SortBy = sortSelected && sortSelected.length > 0 ? sortSelected[1] : 'Asc'
        FilterParticipantDetails.PlanStatus = this.participantPlanStatus ? this.participantPlanStatus : null
        FilterParticipantDetails.ParticipantAge = this.participantAgeDetails
        FilterParticipantDetails.AssetValue = this.participantAsset
        FilterParticipantDetails.PlanTypeList =
          this.participantAccountType && this.participantAccountType.length > 0 ? this.participantAccountType : []
        FilterParticipantDetails.EquityAllocation = this.participantEquity
        FilterParticipantDetails.EmploymentStatus = this.participantEmploymentStatus ? this.participantEmploymentStatus : null
        FilterParticipantDetails.ContributionStatus = this.participantContributionStatus
          ? this.participantContributionStatus
          : null
        FilterParticipantDetails.Retirement = this.participantRetirement ? this.participantRetirement : []
        FilterParticipantDetails.PlanId = []
        FilterParticipantDetails.EnrolledStatus = this.participantEnrolledStatus ? this.participantEnrolledStatus : null
        FilterParticipantDetails.Limit = this.itemPerPage ? this.itemPerPage : 20

        if (this.$store.state.user.reliusLoginId) {
          var participantPromise = []
          if (this.cancelToken) this.cancelToken.cancel()
          this.cancelToken = this.$axiosCancelToken.source()
          participantPromise.push(
            this.$axios
              .post(`/api/v1/rbc/participant/count`, FilterParticipantDetails, {
                cancelToken: this.cancelToken.token
              })
              .then((success) => {
                this.participantCount = success.data.d[0].RowsCount
                this.$store.state.clientPlan.individualDataCount = this.participantCount
              })
          )
          participantPromise.push(
            this.$axios
              .post(`/api/v1/rbc/paginatedparticipantdetails`, FilterParticipantDetails, {
                cancelToken: this.cancelToken.token
              })
              .then((success) => {
                let resultSet = success.data.d && success.data.d.length > 0 ? success.data.d : []

                if (this.searchResult && this.searchResult.length > 0 && resultSet.length > 0 && this.currentPageNumber > 1) {
                  //Array.prototype.push.apply(this.searchResult, resultSet)
                  this.searchResult = resultSet
                } else this.searchResult = resultSet
                this.$store.state.clientPlan.individualData = this.searchResult
              })
          )
          await Promise.allSettled(participantPromise)
          this.totalIndividualPlans = this.searchResult && this.searchResult.length > 0 ? this.searchResult.length : -1
        } else {
          this.searchResult = []
          this.participantCount = 0
          this.totalIndividualPlans = -1
          this.currentPageNumber = 1
          this.showLeadPage = true
        }
        if (this.searchResult && this.searchResult.length === 0 && val === 'pageLoad') {
          this.showLeadPage = true
        }
        this.searchLoading = false
      }
    },
    encodeQueryData(data) {
      const ret = []
      for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
      return ret.join('&')
    },
    getSortByData() {
      this.currentPageNumber = 1
      this.searchResult = []
      this.participantCount = 0
      this.totalIndividualPlans = -1
      this.applyFilter('participantsearch')
    },
    getPlanSortByData() {
      this.searchResultForPlans = []
      this.applyFilter('plansearch')
    },
    openFilter(val) {
      this.showFilter = val
    },
    showParticipantFilter(val) {
      if (val) {
        val.selected = true
        this.filterButton.forEach((a) => {
          if (this.clientTab === a.tab) {
            a.selected = false
          }
        })
        let filterPosition = this.filterButton.findIndex((a) => a.value === val.value)
        if (filterPosition > -1) {
          this.filterButton[filterPosition].selected = true
        }
        this.filterType = val.value
      }
    },
    showHideSearch() {
      this.showSearch = !this.showSearch
      if (this.showSearch === false) this.clearSearch('load')
    },
    updateFilterCount(type, count) {
      this.filterButton.forEach((ele) => {
        if (ele.value === type) {
          ele.count = count ? count : 0
        }
      })
    },
    applyParticipantFilter(item, type) {
      if (type === 'participantPlanStaus') {
        if (item !== null) {
          item.selected = !item.selected
          let resultArray = []
          if (this.planStatusList.length > 0) {
            let newArray = this.planStatusList.filter((a) => a.selected === true)
            this.planStatusFilterCount = newArray ? newArray.length : 0
            newArray.forEach((element) => {
              resultArray.push(element.PlanStatus)
            })
          }
          this.participantPlanStatus = resultArray ? resultArray : ''
          this.updateFilterCount(type, this.participantPlanStatus ? this.participantPlanStatus.length : 0)
        }
      }
      if (type === 'participantAge') {
        if (item !== null) {
          item.selected = !item.selected
          var min, max
          let newArray
          if (this.participantAgeList.length > 0) {
            newArray = this.participantAgeList.filter((a) => a.selected === true)
            //this.ageFilterCount = newArray ? newArray.length : 0
            min = Math.min.apply(
              null,
              newArray.map((item) => item.item1)
            )
            max = Math.max.apply(
              null,
              newArray.map((item) => item.item2)
            )
          }
          this.participantAgeDetails =
            newArray.length > 0
              ? {
                  item1: min,
                  item2: max,
                  text: min + '-' + max + ' years'
                }
              : {}
          this.updateFilterCount(type, newArray ? newArray.length : 0)
        }
      }
      if (type === 'participantAccountType') {
        if (item !== null) {
          item.selected = !item.selected
          let resultArray = []
          if (this.accountTypeList.length > 0) {
            let newArray = this.accountTypeList.filter((a) => a.selected === true)
            this.accountTypeFilterCount = newArray ? newArray.length : 0
            newArray.forEach((element) => {
              resultArray.push(element.AccountType)
            })
          }
          this.participantAccountType = resultArray ? resultArray : ''
          this.updateFilterCount(type, this.participantAccountType ? this.participantAccountType.length : 0)
        }
      }
      if (type === 'participantAssetValue') {
        if (item !== null) {
          item.selected = !item.selected
          var min1, max1
          let newArray
          if (this.assetValueList.length > 0) {
            newArray = this.assetValueList.filter((a) => a.selected === true)
            //this.assetFilterCount = newArray ? newArray.length : 0
            min1 = Math.min.apply(
              null,
              newArray.map((item) => item.item1)
            )
            max1 = Math.max.apply(
              null,
              newArray.map((item) => item.item2)
            )
          }
          this.participantAsset =
            newArray.length > 0
              ? {
                  item1: min1,
                  item2: max1,
                  text: '$' + min1 + '-$' + max1
                }
              : {}
          this.updateFilterCount(type, newArray ? newArray.length : 0)
        }
      }
      if (type === 'equity') {
        if (item !== null) {
          item.selected = !item.selected
          var min2, max2
          let newArray
          if (this.equityAllocationList.length > 0) {
            newArray = this.equityAllocationList.filter((a) => a.selected === true)
            min2 = Math.min.apply(
              null,
              newArray.map((item) => item.item1)
            )
            max2 = Math.max.apply(
              null,
              newArray.map((item) => item.item2)
            )
          }
          this.participantEquity =
            newArray.length > 0
              ? {
                  item1: min2,
                  item2: max2,
                  text: min2 + '-' + max2 + '%'
                }
              : {}
          this.updateFilterCount(type, newArray ? newArray.length : 0)
        }
      }
      if (type === 'employmentStatus') {
        if (item !== null) {
          item.selected = !item.selected
          let resultArray = []
          if (this.employmentStatusList.length > 0) {
            let newArray = this.employmentStatusList.filter((a) => a.selected === true)
            newArray.forEach((element) => {
              resultArray.push(element.EmploymentStatus)
            })
          }
          this.participantEmploymentStatus = resultArray ? resultArray : ''
          this.updateFilterCount(type, this.participantEmploymentStatus ? this.participantEmploymentStatus.length : 0)
        }
      }
      if (type === 'contributionStatus') {
        if (item !== null) {
          item.selected = !item.selected
          let resultArray = []
          if (this.contributionStatusList.length > 0) {
            let newArray = this.contributionStatusList.filter((a) => a.selected === true)
            newArray.forEach((element) => {
              resultArray.push(element.text === 'Contributing' ? 'Yes' : 'No')
            })
          }
          this.participantContributionStatus = resultArray && resultArray.length > 0 ? resultArray : ''
          this.updateFilterCount(type, this.participantContributionStatus ? this.participantContributionStatus.length : 0)
        }
      }
      if (type === 'enrolledStatus') {
        if (item !== null) {
          item.selected = !item.selected
          let resultArray = []
          if (this.enrolledStatusList.length > 0) {
            let newArray = this.enrolledStatusList.filter((a) => a.selected === true)
            newArray.forEach((element) => {
              resultArray.push(element.text === 'Enrolled' ? 'Yes' : 'No')
            })
          }
          this.participantEnrolledStatus = resultArray && resultArray.length > 0 ? resultArray : ''
          this.updateFilterCount(type, this.participantEnrolledStatus ? this.participantEnrolledStatus.length : 0)
        }
      }
      if (type === 'retirement') {
        if (item !== null) {
          item.selected = !item.selected
          let resultArray = []
          if (this.retirementList.length > 0) {
            let newArray = this.retirementList.filter((a) => a.selected === true)
            this.retirementFilterCount = newArray ? newArray.length : 0
            newArray.forEach((element) => {
              resultArray.push(element.value)
            })
          }
          this.participantRetirement = resultArray && resultArray.length > 0 ? resultArray : ''
          this.updateFilterCount(type, this.participantRetirement ? this.participantRetirement.length : 0)
        }
      }
      this.setParticipantFilterChips()
    },
    setParticipantFilterChips() {
      if (this.clientTab === 0) {
        this.$store.state.clientPlan.filter = {
          partPlanStatus: this.participantPlanStatus ? this.participantPlanStatus : '',
          partAge: this.participantAgeDetails ? this.participantAgeDetails : {},
          partAccountType: this.participantAccountType ? this.participantAccountType : '',
          partAsset: this.participantAsset ? this.participantAsset : {},
          partEquity: this.participantEquity ? this.participantEquity : {},
          partEmployment: this.participantEmploymentStatus ? this.participantEmploymentStatus : '',
          partContribution: this.participantContributionStatus ? this.participantContributionStatus : '',
          partRetirement: this.participantRetirement ? this.participantRetirement : '',
          partEnrolled: this.participantEnrolledStatus ? this.participantEnrolledStatus : ''
        }
      }
      this.setParticipantFilter()
    },
    applyPlanFilter(item, type) {
      if (type === 'planStatus') {
        if (item !== null) {
          item.selected = !item.selected
          let index = this.employeePlanStatusList.findIndex((a) => a.text === item.text)
          if (index > -1) {
            this.employeePlanStatusList.splice(index, 1, item)
          }
          this.employeePlanStatus = this.employeePlanStatusList.filter((a) => a.selected === true)
          this.updateFilterCount(
            type,
            this.employeePlanStatus && this.employeePlanStatus.length > 0 ? this.employeePlanStatus.length : 0
          )
        }
      }
      if (type === 'accountType') {
        if (item !== null) {
          item.selected = !item.selected
          let index = this.employeePlanTypeList.findIndex((a) => a.PlanType === item.PlanType)
          if (index > -1) {
            this.employeePlanTypeList.splice(index, 1, item)
          }
          this.employeeAccountType = this.employeePlanTypeList.filter((a) => a.selected === true)
          this.updateFilterCount(
            type,
            this.employeeAccountType && this.employeeAccountType.length > 0 ? this.employeeAccountType.length : 0
          )
        }
      }
      if (type === 'assetValue') {
        if (item !== null) {
          item.selected = !item.selected
          let index = this.employerAssetList.findIndex((a) => a.text === item.text)
          if (index > -1) {
            this.employerAssetList.splice(index, 1, item)
          }
          this.employeeAsset = this.employerAssetList.filter((a) => a.selected === true)
          this.updateFilterCount(type, this.employeeAsset && this.employeeAsset.length > 0 ? this.employeeAsset.length : 0)
        }
      }
      if (type === 'totalParticipant') {
        if (item !== null) {
          item.selected = !item.selected
          let index = this.participantsList.findIndex((a) => a.text === item.text)
          if (index > -1) {
            this.participantsList.splice(index, 1, item)
          }
          this.employeeParticipant = this.participantsList.filter((a) => a.selected === true)
          this.updateFilterCount(
            type,
            this.employeeParticipant && this.employeeParticipant.length > 0 ? this.employeeParticipant.length : 0
          )
        }
      }
      this.getFilteredPlan()
    },
    getFilteredPlan() {
      var planResult = this.savePlans

      if (this.employeePlanStatus && this.employeePlanStatus.length > 0) {
        let filterByPlanStatus = []
        for (let i = 0; i < this.employeePlanStatus.length; i++) {
          let planTypeFilter = planResult.filter((a) => a.PlanStatus === this.employeePlanStatus[i].text)
          if (filterByPlanStatus && filterByPlanStatus.length > 0) {
            planTypeFilter.forEach((element) => {
              filterByPlanStatus.push(element)
            })
          } else filterByPlanStatus = planTypeFilter
        }
        planResult = _.uniqBy(filterByPlanStatus)
      }
      if (this.employeeAccountType && this.employeeAccountType.length > 0) {
        let filterAccountType = []
        for (let l = 0; l < this.employeeAccountType.length; l++) {
          let accountTypeFilter = planResult.filter((d) => d.PlanType === this.employeeAccountType[l].PlanType)
          if (filterAccountType && filterAccountType.length > 0) {
            accountTypeFilter.forEach((element) => {
              filterAccountType.push(element)
            })
          } else filterAccountType = accountTypeFilter
        }
        planResult = _.uniqBy(filterAccountType)
      }

      if (this.employeeAsset && this.employeeAsset.length > 0) {
        let filterAssetData = []
        for (let j = 0; j < this.employeeAsset.length; j++) {
          let filterTotalAsset = planResult.filter(
            (a) => a.ASSETS >= this.employeeAsset[j].item1 && a.ASSETS <= this.employeeAsset[j].item2
          )
          if (filterAssetData.length > 0) {
            filterTotalAsset.forEach((element) => {
              filterAssetData.push(element)
            })
          } else filterAssetData = filterTotalAsset
        }
        planResult = filterAssetData
      }

      if (this.employeeParticipant && this.employeeParticipant.length > 0) {
        let filterParticipantData = []
        for (let k = 0; k < this.employeeParticipant.length; k++) {
          let filterPartValue = planResult.filter(
            (a) =>
              a.TotalParticipants >= this.employeeParticipant[k].item1 && a.TotalParticipants <= this.employeeParticipant[k].item2
          )
          if (filterParticipantData.length > 0) {
            filterPartValue.forEach((element) => {
              filterParticipantData.push(element)
            })
          } else filterParticipantData = filterPartValue
        }
        planResult = filterParticipantData
      }

      this.searchResultForPlans = planResult && planResult.length > 0 ? planResult : []
      this.planCount = this.searchResultForPlans && this.searchResultForPlans.length > 0 ? this.searchResultForPlans.length : 0
      this.$store.state.clientPlan.planCount = this.planCount
      this.$store.state.clientPlan.planData = this.searchResultForPlans
      this.$store.state.clientPlan.employeeSortByType = this.employeeSortByType
      this.planLoading = false
      this.setPlanFilterChips()
    },
    setPlanFilterChips() {
      if (this.clientTab === 1) {
        this.$store.state.clientPlan.filter = {
          empPlanStatus: this.employeePlanStatus && this.employeePlanStatus.length ? this.employeePlanStatus : [],
          empAccountType: this.employeeAccountType && this.employeeAccountType.length ? this.employeeAccountType : [],
          empAsset: this.employeeAsset && this.employeeAsset.length ? this.employeeAsset : [],
          empParticipant: this.employeeParticipant && this.employeeParticipant.length ? this.employeeParticipant : []
        }
      }
    },
    planInfo(planName, planID, source, item) {
      if (planID) {
        let type = item.PlanBusinessType
        this.$store.state.clientPlan.prospectValue = 1
        let query = ''
        if (type === 'School') {
          if (source) {
            query = `?s=${encodeURIComponent(btoa(source))}&type=School`
          } else {
            query = `?type=School`
          }
        } else if (type === 'Municipality') {
          if (source) {
            query = `?s=${encodeURIComponent(btoa(source))}&type=Municipalities`
          } else {
            query = `?type=Municipalities`
          }
        } else {
          if (source) {
            query = `?s=${encodeURIComponent(btoa(source))}&type=Employee`
          } else {
            query = `?type=Employee`
          }
        }
        this.$router.push(`/Retention/Plan/${planID}${query}`)
      } else {
        this.$toast.info('Plan Information not found', '', this.notificationSystem.options.info)
        this.loading = false
      }
    },
    setParticipantFilter() {
      this.currentPageNumber = 1
      this.searchResult = []
      this.participantCount = 0
      this.totalIndividualPlans = -1
      this.searchText = ''
      this.participantPlanStatus = this.$store.state.clientPlan.filter.partPlanStatus
        ? this.$store.state.clientPlan.filter.partPlanStatus
        : ''
      this.participantAgeDetails = this.$store.state.clientPlan.filter.partAge ? this.$store.state.clientPlan.filter.partAge : {}
      this.participantAccountType = this.$store.state.clientPlan.filter.partAccountType
        ? this.$store.state.clientPlan.filter.partAccountType
        : ''
      this.participantAsset = this.$store.state.clientPlan.filter.partAsset ? this.$store.state.clientPlan.filter.partAsset : {}
      this.participantEquity = this.$store.state.clientPlan.filter.partEquity
        ? this.$store.state.clientPlan.filter.partEquity
        : {}
      this.participantEmploymentStatus = this.$store.state.clientPlan.filter.partEmployment
        ? this.$store.state.clientPlan.filter.partEmployment
        : ''
      this.participantContributionStatus = this.$store.state.clientPlan.filter.partContribution
        ? this.$store.state.clientPlan.filter.partContribution
        : ''
      this.participantRetirement = this.$store.state.clientPlan.filter.partRetirement
        ? this.$store.state.clientPlan.filter.partRetirement
        : ''
      this.participantEnrolledStatus = this.$store.state.clientPlan.filter.partEnrolled
        ? this.$store.state.clientPlan.filter.partEnrolled
        : ''
      this.applyFilter('participantsearch')
    }
  }
}
</script>
<style scoped>
.v-data-table :deep(.sticky-header) {
  position: sticky;
  top: var(--toolbarHeight);
  z-index: 2;
}

.v-data-table :deep(.v-data-table__wrapper) {
  overflow: unset;
}
.heightForlargeLegalText {
  max-height: 75vh !important;
}
.wraptext {
  white-space: pre-wrap;
}
.classForButton.theme--light.v-btn.v-btn--has-bg {
  background-color: white;
}
.classForBadge {
  position: unset !important;
}

.buttonColor {
  background: #3c82cc19 !important;
}
</style>
<style lang="scss">
#no-background-hover::before {
  background-color: transparent !important;
}
</style>
