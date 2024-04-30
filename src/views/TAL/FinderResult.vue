<template>
  <div>
    <v-container fluid :class="display.xs.value ? 'pa-0' : 'pt-0 pb-0'">
      <v-col
        id="finderTable"
        cols="12"
        class="pa-0"
        :class="showMap && showLegalText && display.lgAndUp.value ? 'heightForlargeLegalText' : ''"
      >
        <v-row class="justify-space-around">
          <v-col
            class="pt-3 pr-3 pl-1"
            :cols="display.smAndDown.value ? '12' : showMap ? '8' : '9'"
            :class="[display.smAndDown.value ? 'pl-2 pr-2' : '']"
            :style="showMap && !display.smAndDown.value ? `height:${cardHeight}vh !important;overflow:auto!important` : ''"
            @scroll="handleScroll()"
          >
            <v-col cols="12" :class="display.xs.value ? 'pb-1' : ''">
              <v-row>
                <v-col :cols="display.mdAndUp.value ? '8' : '12'" class="pa-0">
                  <span
                    v-if="breadCrumb.parentName"
                    class="text-capitalize font_12 cursor-pointer"
                    :class="!theme.dark ? 'text-hyperlink' : ''"
                    @click="router.push('/Home/Acquisition').catch(() => {})"
                    >{{ breadCrumb.parentName }}</span
                  >
                  <v-icon size="12" :color="!theme.dark ? 'hyperlink' : ''" class="icon-chevron-right ml-1 mr-1" />
                  <span v-if="breadCrumb.parentName" class="text-capitalize font_12" :class="!theme.dark ? 'text-hyperlink' : ''">
                    {{ breadCrumb.pageName }}
                  </span>
                </v-col>
                <v-col v-if="display.mdAndUp.value" align-self="end" cols="4" class="d-flex justify-end pa-0">
                  <span class="cursor-pointer">
                    <span
                      :class="!theme.dark ? 'text-hyperlink' : ''"
                      class="text-capitalize font_14 pr-2 align-self"
                      @click="showHideMap()"
                      >{{ showMap ? 'Hide Map' : 'Show Map' }}</span
                    >
                    <v-icon
                      size="25"
                      :class="showMap ? 'icon-hide-horizontal' : 'icon-show-horizontal'"
                      :color="!theme.dark ? 'hyperlink' : ''"
                    />
                  </span>
                </v-col>
                <v-col cols="12" class="pl-0 pt-1 pr-0">
                  <h1>Search Leads</h1>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pt-1 pa-0">
              <v-row no-gutters>
                <div v-if="!showSearch" class="flex flex_none pa-0">
                  <v-btn
                    variant="text"
                    class="pa-2 ma-0"
                    style="border: 1px solid rgba(0, 0, 0, 0.12); height: 42px"
                    :disabled="(!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) || showStarred"
                    @click="showSearch = !showSearch"
                  >
                    <span>
                      <v-icon size="21" :color="theme.dark ? '' : 'hyperlink'" @click="showHideSearch()"> mdi-magnify </v-icon>
                      <v-icon size="18" :color="theme.dark ? '' : 'hyperlink'" class="ml-1 width_10" @click="showHideSearch()">
                        mdi-menu-right
                      </v-icon>
                    </span>
                  </v-btn>
                </div>
                <v-col
                  v-if="showSearch"
                  v-click-input-outside="searchAreaFocusOut"
                  xl="3"
                  lg="3"
                  md="4"
                  sm="4"
                  cols="4"
                  :class="[display.mdAndUp.value ? 'mr-auto' : '', display.xl.value ? 'pr-3' : '']"
                >
                  <v-text-field
                    v-model="searchText"
                    ref="wildCardSearch"
                    :clearable="searchText ? (searchText.trim() !== '' ? true : false) : false"
                    placeholder="Search for...."
                    :menu-props="{ zIndex: '9999', attach: true }"
                    :disabled="(!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) || showStarred"
                    @click="hideCard = true"
                    @blur=";/-00[0-9]/.exec(searchText) ? searchBlur(true) : searchBlur(false)"
                    @click:clear="clearSearch()"
                    @update:model-value="checkFields('company')"
                  >
                    <template #append-inner>
                      <v-icon
                        v-if="!showClient"
                        size="21"
                        :color="theme.dark ? '' : 'hyperlink'"
                        class="cursor-pointer"
                        @click="showHideSearch()"
                      >
                        mdi-magnify
                      </v-icon>
                      <v-icon
                        v-if="!showClient"
                        size="18"
                        :color="theme.dark ? '' : 'hyperlink'"
                        class="ml-1 width_10 cursor-pointer"
                        @click="showHideSearch()"
                      >
                        mdi-menu-left
                      </v-icon>
                    </template>
                  </v-text-field>
                  <v-card
                    v-if="
                      hideCard &&
                      ((filterPlans.length > 0 && showEmployerSponsored) ||
                        (filterSchools.length > 0 && showSchool) ||
                        (filterIndividual.length > 0 && showIndividuals) ||
                        (filterMunicipal.length > 0 && showMunicipalities) ||
                        (filterChurch.length > 0 && showMunicipalities) ||
                        (filterTaxExempt.length > 0 && showMunicipalities))
                    "
                    :width="wildCardSearch ? wildCardSearch.$el.clientWidth : '200px'"
                    :color="theme.dark ? '' : 'white'"
                    class="elevation-3 plans_card_height"
                  >
                    <v-col v-if="filterPlans.length > 0 && showEmployerSponsored" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-for-profit forProfitIcon" size="21" />
                        </v-list-item-action>
                        <v-list-item-title class="font_14 font-weight-medium"> For Profit </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list density="compact">
                        <v-tooltip v-for="(item, index) in filterPlans" :key="index" location="top">
                          <template #activator="{ props }">
                            <v-list-item :key="index" @click="getPlanValue(item)">
                              <v-list-item-title v-bind="props" class="text-uppercase">
                                {{ item.Name }}
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span class="text-uppercase">{{ item.Name }}</span>
                        </v-tooltip>
                      </v-list>
                    </v-col>
                    <v-col v-if="filterSchools.length > 0 && showSchool" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-graduation schoolIcon" size="21" />
                        </v-list-item-action>
                        <v-list-item-title class="font_14 font-weight-medium"> Schools </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list density="compact">
                        <v-tooltip v-for="(item, index) in filterSchools" :key="index" location="top">
                          <template #activator="{ props }">
                            <v-list-item :key="index" @click="getPlanValue(item)">
                              <v-list-item-title v-bind="props" class="text-uppercase">
                                {{ item.Name }}
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span class="text-uppercase">{{ item.Name }}</span>
                        </v-tooltip>
                      </v-list>
                    </v-col>
                    <v-col v-if="filterIndividual.length > 0 && showIndividuals" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-individual participantIcon" size="21" />
                        </v-list-item-action>
                        <v-list-item-title class="font_14 font-weight-medium"> Individuals </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list density="compact">
                        <v-tooltip v-for="(item, index) in filterIndividual" :key="index" location="top">
                          <template #activator="{ props }">
                            <v-list-item :key="index" @click="getPlanValue(item)">
                              <v-list-item-title v-bind="props" class="text-uppercase">
                                {{ item.Name }}
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span class="text-uppercase">{{ item.Name }}</span>
                        </v-tooltip>
                      </v-list>
                    </v-col>
                    <v-col v-if="filterMunicipal.length > 0 && showMunicipalities" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-government municipalitiesIcon" size="21" />
                        </v-list-item-action>
                        <v-list-item-title class="font_14 font-weight-medium"> Municipalities </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list density="compact">
                        <v-tooltip v-for="(item, index) in filterMunicipal" :key="index" location="top">
                          <template #activator="{ props }">
                            <v-list-item :key="index" @click="getPlanValue(item)">
                              <v-list-item-title v-bind="props" class="text-uppercase">
                                {{ item.Name }}
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span class="text-uppercase">{{ item.Name }}</span>
                        </v-tooltip>
                      </v-list>
                    </v-col>
                    <v-col v-if="filterChurch.length > 0 && showMunicipalities" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="fas fa-church nonProfitIcon" size="21" />
                        </v-list-item-action>
                        <v-list-item-title class="font_14 font-weight-medium"> Churches </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list density="compact">
                        <v-tooltip v-for="(item, index) in filterChurch" :key="index" location="top">
                          <template #activator="{ props }">
                            <v-list-item :key="index" @click="getPlanValue(item)">
                              <v-list-item-title v-bind="props" class="text-uppercase">
                                {{ item.Name }}
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span class="text-uppercase">{{ item.Name }}</span>
                        </v-tooltip>
                      </v-list>
                    </v-col>
                    <v-col v-if="filterTaxExempt.length > 0 && showMunicipalities" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-tax-exempt taxExemptIcon" size="21" />
                        </v-list-item-action>
                        <v-list-item-title class="font_14 font-weight-medium"> Tax Exempt </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list density="compact">
                        <v-tooltip v-for="(item, index) in filterTaxExempt" :key="index" location="top">
                          <template #activator="{ props }">
                            <v-list-item :key="index" @click="getPlanValue(item)">
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
                <v-col v-if="!showSearch" cols="4" xl="3" lg="3" md="4" sm="4" class="ml-2 mr-2 d-flex">
                  <v-select
                    v-model="searchRadius"
                    :items="radiusList"
                    variant="outlined"
                    item-title="text"
                    item-value="value"
                    style="z-index: 9999"
                    :disabled="
                      (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                      showStarred ||
                      showClient
                    "
                  />
                </v-col>
                <div v-if="!showSearch" class="flex flex_none pt-3">of</div>
                <v-col
                  v-if="!showSearch"
                  xl="3"
                  lg="3"
                  md="4"
                  sm="4"
                  cols="5"
                  class="ml-2 d-flex"
                  :class="display.xs.value ? '' : 'mr-2'"
                >
                  <v-text-field
                    v-model="zipcode"
                    hint="ex.90001"
                    maxlength="5"
                    :class="[zipcode === 'Current Location' && !theme.dark ? 'textColor' : '', 'text-hyperlink']"
                    :error="zipcodeError"
                    :error-messages="zipcodeErrorMsg"
                    clearable
                    :disabled="
                      (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                      showStarred ||
                      showClient
                    "
                    @keypress="onlyNumber"
                    @keydown="maskAllow($event)"
                    @blur="checkCurrentLocation()"
                    @click:clear="clearZip"
                    @update:model-value="checkFields('location')"
                    @click:append-inner="getCurrentLocation()"
                    append-inner-icon="mdi-crosshairs-gps"
                  >
                    <!-- <v-icon
                      slot="append"
                      class="padding_top_2 icon-geo-locate"
                      :color="!theme.dark && zipcode ? 'hyperlink' : ''"
                      :disabled="
                        (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                        showStarred ||
                        showClient
                      "
                      @click="getCurrentLocation()"
                    /> -->
                  </v-text-field>
                </v-col>
                <v-col
                  v-if="$authz.hasPermission($authz.permissionSet.Finder__c, $authz.permission.Full)"
                  cols="4"
                  xl="2"
                  lg="1"
                  md="2"
                  sm="2"
                  class="d-flex mr-2"
                >
                  <v-btn
                    :color="theme.dark ? '' : 'accent'"
                    :disabled="
                      searchLoading ||
                      (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                      showStarred
                    "
                    :loading="searchLoading"
                    class="mt-0 elevation-1"
                    :block="display.xs.value"
                    :class="[
                      display.xs.value ? 'ml-0 pl-0' : '',
                      showSearch && display.lg.value ? 'margin_left_2' : '',
                      showSearch && display.xl.value ? 'margin_left_6' : ''
                    ]"
                    @click="checkCurrentLocation('search')"
                  >
                    Search
                    <template #searchLoading>
                      <span class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </v-col>
                <v-col cols="7" xl="3" lg="3" md="5" sm="5" class="d-flex justify-end">
                  <!-- <v-select
                    v-model="prospectTab"
                    :items="sponsorList"
                    style="z-index: 8888"
                    item-title="text"
                    item-value="value"
                    item-props.disabled="disabled"
                    :class="display.xs.value ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                    :disabled="searchLoading"
                    @update:model-value="getCustomerType"
                  /> -->
                  <v-select
                    v-model="prospectTab"
                    density="compact"
                    variant="outlined"
                    :menu-props="{ zIndex: '1' }"
                    :items="sponsorList"
                    item-title="text"
                    style="height: 40px"
                    :class="display.xs.value ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                    :disabled="searchLoading"
                    hide-details
                    @update:model-value="getCustomerType"
                  >
                    <template #selection="{ item }">
                      <v-list-item class="pa-0">
                        <template #prepend>
                          <v-icon v-if="item.raw.icon" size="16" :class="[item.raw.icon, item.raw.color, 'mr-1']" />
                          {{ item.raw.text }}
                        </template>
                      </v-list-item>
                    </template>
                    <template #item="{ props, item }">
                      <v-list-item :title="item.text" v-bind="props">
                        <template #prepend>
                          <v-icon v-if="item.raw.icon" size="16" :class="[item.raw.icon, item.raw.color, 'mr-1']" />
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-row no-gutters>
                <v-btn
                  variant="text"
                  class="font-weight-regular ml-0 pl-0 mt-0"
                  :class="display.xs.value ? 'ml-0 mr-0' : ''"
                  :color="theme.dark ? '' : 'hyperlink'"
                  size="x-small"
                  :disabled="
                    prospectTab === 1 ||
                    prospectTab === 2 ||
                    prospectTab === 3 ||
                    prospectTab === 7 ||
                    (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                    showStarred ||
                    showClient
                  "
                  @click="openAdvanceFilter()"
                >
                  Advanced Search
                </v-btn>
                <v-col
                  v-show="prospectTab === 0 && advanceFilter ? (advanceFilter.filterChips.length === 0 ? true : false) : ''"
                  xl="1"
                  lg="1"
                  md="2"
                  sm="2"
                  class="pa-0"
                >
                  <v-col cols="12" class="mb-2 pa-0">
                    ({{ new Intl.NumberFormat().format(constantPlanCount) }}<span class="ml-1">found)</span>
                  </v-col>
                </v-col>
                <v-col
                  v-show="prospectTab === 1 && advanceFilter ? (advanceFilter.schoolChips.length === 0 ? true : false) : ''"
                  xl="1"
                  lg="1"
                  md="2"
                  sm="2"
                  class="pa-0"
                  cols="12"
                >
                  <div class="mb-2 pa-0">
                    ({{ new Intl.NumberFormat().format(schoolDataCount) }}<span class="ml-1">found)</span>
                  </div>
                </v-col>
                <v-col
                  v-show="prospectTab === 2 && advanceFilter ? (advanceFilter.municipalChips.length === 0 ? true : false) : ''"
                  xl="1"
                  lg="1"
                  md="2"
                  sm="2"
                  class="pa-0"
                  cols="12"
                >
                  <div class="mb-2 pa-0">
                    ({{ new Intl.NumberFormat().format(municipalDataCount) }}<span class="ml-1">found)</span>
                  </div>
                </v-col>
                <v-col
                  v-show="prospectTab === 3 && advanceFilter ? (advanceFilter.churchChips.length === 0 ? true : false) : ''"
                  xl="1"
                  lg="1"
                  md="2"
                  sm="2"
                  class="pa-0"
                  cols="12"
                >
                  <div class="mb-2 pa-0">
                    ({{ new Intl.NumberFormat().format(churchDataCount) }}<span class="ml-1">found)</span>
                  </div>
                </v-col>
                <v-col
                  v-show="prospectTab === 7 && advanceFilter ? (advanceFilter.taxExemptChips.length === 0 ? true : false) : ''"
                  xl="1"
                  lg="1"
                  md="2"
                  sm="2"
                  class="pa-0"
                  cols="12"
                >
                  <div class="mb-2 pa-0">
                    ({{ new Intl.NumberFormat().format(taxExemptDataCount) }}<span class="ml-1">found)</span>
                  </div>
                </v-col>
                <v-col
                  v-show="prospectTab === 4 && advanceFilter ? (advanceFilter.individualChips.length === 0 ? true : false) : ''"
                  xl="1"
                  lg="1"
                  md="2"
                  sm="2"
                  class="pa-0"
                  cols="12"
                >
                  <div class="mb-2 pa-0">
                    ({{ new Intl.NumberFormat().format(individualDataCount) }}<span class="ml-1">found)</span>
                  </div>
                </v-col>
                <v-col cols="12" v-show="prospectTab === 5" xl="1" lg="1" md="2" sm="2" class="pa-0">
                  <div class="mb-2 pa-0">
                    ({{ favoriteList ? new Intl.NumberFormat().format(favoriteList.length) : 0 }}<span class="ml-1">found)</span>
                  </div>
                </v-col>
                <v-col cols="12" v-show="prospectTab === 6" xl="1" lg="1" md="2" sm="2" class="pa-0">
                  <div class="mb-2 pa-0">
                    ({{ new Intl.NumberFormat().format(clientDataCount) }}<span class="ml-1">found)</span>
                  </div>
                </v-col>
                <v-divider v-if="showSavedSearchList" vertical class="pl-5" />
                <v-btn
                  v-if="showSavedSearchList"
                  variant="text"
                  class="font-weight-regular mt-0"
                  :class="display.xs.value ? 'ml-0 mr-0' : ''"
                  :color="theme.dark ? '' : 'hyperlink'"
                  size="x-small"
                  @click="showSavedSearch()"
                >
                  My Saved Searches
                </v-btn>
              </v-row>
            </v-col>
            <v-col v-show="prospectTab === 0" cols="12" class="pa-0">
              <v-col v-if="advanceFilter ? (advanceFilter.filterChips.length > 0 ? true : false) : ''" class="mb-2 mt-2">
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.filterChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2"
                  :class="theme.dark ? '' : 'text-white'"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2" :class="theme.dark ? '' : 'light-grey text-black'" label size="small">
                  ({{ new Intl.NumberFormat().format(constantPlanCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-btn
                    v-if="constantPlanCount && constantPlanCount > 0"
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="openSavedSearches()"
                  >
                    {{ showEditSearch ? 'Edit Search' : 'Save Search' }}
                  </v-btn>
                  <v-divider v-if="constantPlanCount && constantPlanCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col v-if="false" cols="12" class="mb-4">
                <b>Please note: </b>PCS provides data in this tool that is pulled directly from the Department of Labor (DOL). PCS
                does not validate the accuracy of the DOL data.
              </v-col>
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-6 mb-0 pa-2" width="100%">
                      <!-- new added here       -->
                      <v-col class="py-3 pa-0" cols="12">
                        <v-row>
                          <v-col xl="7" md="4" sm="4" :lg="display.width.value > 1366 ? '6' : '5'" class="pa-0">
                            <v-btn
                              v-if="exportPermissionForAdvisor"
                              variant="text"
                              class="font-weight-regular"
                              :class="display.xs.value ? 'ml-0 mr-0' : ''"
                              :color="theme.dark ? '' : 'hyperlink'"
                              size="x-small"
                              @click="exportToExcel()"
                            >
                              Export
                            </v-btn>
                            <v-col
                              v-if="!exportPermissionForAdvisor"
                              class="align-self-center font_size_span pt-3 font-weight-medium pa-0"
                            >
                              <span>
                                To export a copy of the lead search results, please get in touch with a sales rep
                                <a
                                  class="text-accent"
                                  target="_blank"
                                  href="https://www.pcsretirement.com/about-us/sales-team#team=employer"
                                >
                                  here</a
                                >.
                              </span>
                            </v-col>
                          </v-col>
                          <v-col
                            xl="5"
                            md="8"
                            sm="8"
                            cols="12"
                            :lg="display.width.value > 1366 ? '6' : '7'"
                            class="d-flex justify-end pa-0"
                          >
                            <v-row>
                              <v-col
                                xl="5"
                                lg="4"
                                md="4"
                                sm="4"
                                class="pt-3 font-weight-medium pa-0"
                                :class="display.xs.value ? '' : display.md.value ? 'text-right pr-3' : 'text-right pr-6'"
                              >
                                Sort results by
                              </v-col>
                              <v-col xl="7" lg="8" md="9" sm="8" class="pa-0">
                                <v-select
                                  v-model="sortByType"
                                  :menu-props="{ zIndex: '9999' }"
                                  :items="sortByListType"
                                  item-title="text"
                                  item-value="value"
                                  item-props.disabled="disabled"
                                  :class="display.xs.value ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                                  :disabled="searchLoading"
                                  hide-details
                                  @update:model-value="getSortByData"
                                />
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- end here -->
                      <v-data-table
                        :headers="headerList"
                        :items="searchResult"
                        item-key="SEINPNO"
                        :class="[
                          display.smAndDown.value ? 'elevation-0 mb-0' : 'elevation-3 mb-0',
                          showMap ? 'showMap' : 'hideMap'
                        ]"
                        :options="pagination"
                        mobile-breakpoint="0"
                        :hide-default-footer="true"
                        :items-length="totalPlans"
                      >
                        <template #item="{ item }">
                          <tr :class="mapselectedSEINPNO == item.SEINPNO ? rowcolor : ''">
                            <td class="pa-1" :class="mapselectedSEINPNO == item.SEINPNO ? selectedRowPadding : ''">
                              <v-col cols="12" class="pa-0">
                                <v-row no-gutters>
                                  <v-col cols="2" sm="2" lg="2" xl="2" md="4" class="text-center align-self pa-0">
                                    <div
                                      :class="[showMap ? 'cursor-pointer' : '']"
                                      @click="showMap ? mapHighlight(item.SEINPNO) : ''"
                                    >
                                      <v-icon
                                        v-if="item.PlANADDRESSLATITUDE && item.PLANADDRESSLONGITUDE"
                                        size="16"
                                        class="icon-for-profit forProfitIcon"
                                      />
                                    </div>
                                  </v-col>
                                  <v-col cols="10" sm="10" lg="10" md="8" xl="10" class="pa-0">
                                    <v-hover v-slot="{ hover }">
                                      <h4 class="pt-1">
                                        <a
                                          v-if="item.InBookOfBusiness === 0"
                                          :class="[
                                            !theme.dark ? 'text-hyperlink' : 'text-white',
                                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                                          ]"
                                          class="text-capitalize"
                                          @click="planInfo(item, $event)"
                                          >{{ item.PNAME ? item.PNAME.toLowerCase() : '' }}</a
                                        >
                                      </h4>
                                    </v-hover>
                                    <v-tooltip location="top">
                                      <template #activator="{ props }">
                                        <h4>
                                          <a
                                            v-if="item.InBookOfBusiness === 1"
                                            v-bind="props"
                                            :class="[!theme.dark ? 'text-black' : 'text-white']"
                                            class="text-capitalize cursor-auto text-decoration-none"
                                          >
                                            {{ item.PNAME ? item.PNAME.toLowerCase() : '' }}
                                          </a>
                                        </h4>
                                      </template>
                                      <span>
                                        This Plan is already on the PCS Platform. Please contact<br />
                                        your regional sales team for more information.
                                      </span>
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </td>
                            <td class="text-center pa-1">
                              {{ formatPrice(item.TOTASSETS, 2) }}
                            </td>
                            <td class="text-center pa-1">
                              {{ item.GROWTH ? `${parseFloat(item.GROWTH.toFixed(4) * 100).toFixed(2)}%` : '-' }}
                            </td>
                            <td class="text-center pa-1">
                              {{ formatNumber(item.ACTPARTIC, 'decimal', 0) }}
                            </td>
                            <td class="text-center pa-1">
                              {{ formatPrice(item.PARTAVG, 0) }}
                            </td>
                            <td class="text-center pa-1">
                              {{ formatPrice(item.EMPLYRAVG, 0) }}
                            </td>
                            <td class="text-center pa-1 text-capitalize">
                              {{ item.SCITY ? item.SCITY.toLowerCase() : '' }}
                            </td>
                            <td class="text-center pa-1 text-capitalize">
                              {{ item.SSTATE ? item.SSTATE : '' }}
                            </td>
                            <td class="text-center pa-1">
                              <v-row class="justify-center" no-gutters>
                                <v-col cols="6" class="flex_none pa-0">
                                  <v-btn
                                    icon
                                    :color="!theme.dark ? 'hyperlink' : ''"
                                    variant="text"
                                    @click.stop="
                                      ;[
                                        (closeReportPopUp[item.SEINPNO] = true),
                                        (optionsSeinpNO = item.SEINPNO),
                                        (optionsItem = item)
                                      ]
                                    "
                                  >
                                    <v-icon size="21" class="icon-action" />
                                  </v-btn>
                                </v-col>
                                <v-col cols="6" class="flex_none pa-0">
                                  <PlanStar :key="componentBookmarkKey" :seinpno="item.SEINPNO" from="TAL" type="ForProfit" />
                                </v-col>
                              </v-row>
                              <v-dialog
                                v-if="item.InBookOfBusiness === 1"
                                :key="item.SEINPNO"
                                v-model="closeReportPopUp[item.SEINPNO]"
                                :scrollable="false"
                                :max-width="display.xs.value ? '100%' : '600'"
                                content-class="elevation-3"
                              >
                                <v-card>
                                  <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                                    <v-col cols="12" class="text-left pa-0">
                                      <v-row no-gutters>
                                        <v-col cols="12" class="text-right pa-0">
                                          <v-icon
                                            class="cursor-pointer"
                                            :class="theme.dark ? '' : 'text-accent'"
                                            @click="closeReportPopUp[item.SEINPNO] = false"
                                          >
                                            mdi-close
                                          </v-icon>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                  </v-card-title>
                                  <v-card-text class="pt-4">
                                    <v-col cols="12" class="pa-0">
                                      <v-row no-gutters>
                                        <v-col cols="12" class="text-left pa-0">
                                          <h3 class="font_16">
                                            This Plan is already on the PCS Platform. Please contact your regional sales team for
                                            more information.
                                          </h3>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                              <v-dialog
                                v-if="item.InBookOfBusiness === 0"
                                :key="item.SEINPNO"
                                v-model="closeReportPopUp[item.SEINPNO]"
                                :scrollable="false"
                                :max-width="
                                  display.xs.value
                                    ? '100%'
                                    : item.selectreport
                                      ? item.selectreport.length === 1
                                        ? '300'
                                        : item.selectreport.length === 2
                                          ? '400'
                                          : item.selectreport.length === 3
                                            ? '500'
                                            : '50%'
                                      : '50%'
                                "
                                content-class="elevation-3"
                              >
                                <v-card>
                                  <v-card-title class="pt-2 pb-2 mt-2 mb-2">
                                    <v-col cols="12" class="text-left pa-0">
                                      <v-row no-gutters>
                                        <v-col cols="11" class="text-left pa-0">
                                          <h3>Actions</h3>
                                        </v-col>
                                        <v-col cols="1" class="text-right pa-0">
                                          <v-icon
                                            class="cursor-pointer"
                                            :class="theme.dark ? '' : 'text-accent'"
                                            @click="closeReportPopUp[item.SEINPNO] = false"
                                          >
                                            mdi-close
                                          </v-icon>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                  </v-card-title>
                                  <v-card-text class="pt-4">
                                    <v-col cols="12" class="pa-0">
                                      <v-row>
                                        <v-hover v-for="(item, index) in item.selectreport" v-slot="{ hover }" :key="index">
                                          <v-col
                                            v-show="item.show === true"
                                            :key="index"
                                            :cols="item.selectreport && item.selectreport.length === 4 ? '3' : '12'"
                                            :class="hover ? 'accent' : ''"
                                            class="cursor-pointer flexclass pb-4 pt-4 text-center report_btn_border pb-2 pt-2"
                                            @click="
                                              !item.disabled && !item.loader
                                                ? checkReportOptions(optionsSeinpNO, optionsItem, item, $event)
                                                : null
                                            "
                                          >
                                            <v-progress-circular
                                              v-if="item.loader"
                                              :size="26"
                                              :color="hover ? 'white' : 'accent'"
                                              indeterminate
                                            />
                                            <CustomIcon
                                              v-if="!item.loader"
                                              :hover="hover"
                                              :disabled="item.disabled"
                                              :type="item.text === 'Comparison' ? 'RPEA' : item.text"
                                            />
                                            <br />
                                            <h4
                                              class="textBold"
                                              :class="
                                                hover || theme.dark ? 'text-white font_size_13 ' : 'text-accent font_size_13 '
                                              "
                                            >
                                              {{ item.text }}
                                            </h4>
                                          </v-col>
                                        </v-hover>
                                      </v-row>
                                    </v-col>
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                      <Observer @intersect="employeeIntersected" />
                      <Loader
                        :loading-text="searchText ? `Finding leads ${searchText}` : `Finding leads in ${zipcode}`"
                        :loading="searchLoading"
                        :count="totalPlans"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 1" class="pa-0">
              <v-col v-if="advanceFilter ? (advanceFilter.schoolChips.length > 0 ? true : false) : ''" class="mb-4 mt-5">
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.schoolChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2"
                  :class="theme.dark ? '' : 'text-white'"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2" :class="theme.dark ? '' : 'light-grey text-black'" label size="small">
                  ({{ new Intl.NumberFormat().format(schoolDataCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-btn
                    v-if="schoolDataCount && schoolDataCount > 0"
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="openSavedSearches()"
                  >
                    {{ showEditSearch ? 'Edit Search' : 'Save Search' }}
                  </v-btn>
                  <v-divider v-if="schoolDataCount && schoolDataCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-0" width="100%">
                      <SchoolResult
                        :key="componentSchoolKey"
                        ref="SchoolComponent"
                        :is-show-map-switch="showMap"
                        :map-finder-info="mapFinderInfo()"
                        :is-show-starred="showStarred"
                      />
                      <Loader
                        :loading-text="searchText ? `Finding leads ${searchText}` : `Finding leads in ${zipcode}`"
                        :loading="searchLoading"
                        :count="schoolDataCount"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 2" class="pa-0">
              <v-col v-if="advanceFilter ? (advanceFilter.municipalChips.length > 0 ? true : false) : ''" class="mb-4 mt-5">
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.municipalChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2"
                  :class="theme.dark ? '' : 'text-white'"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2" :class="theme.dark ? '' : 'light-grey text-black'" label size="small">
                  ({{ new Intl.NumberFormat().format(municipalDataCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-btn
                    v-if="municipalDataCount && municipalDataCount > 0"
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="openSavedSearches()"
                  >
                    {{ showEditSearch ? 'Edit Search' : 'Save Search' }}
                  </v-btn>
                  <v-divider v-if="municipalDataCount && municipalDataCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    :color="theme.dark ? '' : 'accent'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-0" width="100%">
                      <MunicipalResult
                        :key="componentMunicipalKey"
                        ref="municipalComponent"
                        :zipcode="zipcode"
                        :is-show-map-switch="showMap"
                        :radius="searchRadius"
                        :map-finder-info="mapFinderInfo()"
                        :is-show-starred="showStarred"
                      />
                      <Loader
                        :loading-text="searchText ? `Finding leads ${searchText}` : `Finding leads in ${zipcode}`"
                        :loading="searchLoading"
                        :count="totalMunicipalPlans"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 3" class="pa-0">
              <v-col v-if="advanceFilter ? (advanceFilter.churchChips.length > 0 ? true : false) : ''" class="mb-4 mt-5">
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.churchChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2"
                  :class="theme.dark ? '' : 'text-white'"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2" :class="theme.dark ? '' : 'light-grey text-black'" label size="small">
                  ({{ new Intl.NumberFormat().format(churchDataCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-btn
                    v-if="churchDataCount && churchDataCount > 0"
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="openSavedSearches()"
                  >
                    {{ showEditSearch ? 'Edit Search' : 'Save Search' }}
                  </v-btn>
                  <v-divider v-if="churchDataCount && churchDataCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    :color="theme.dark ? '' : 'accent'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-0" width="100%">
                      <ChurchResult
                        :key="componentChurchKey"
                        ref="churchComponent"
                        :zipcode="zipcode"
                        :is-show-map-switch="showMap"
                        :radius="searchRadius"
                        :map-finder-info="mapFinderInfo()"
                        :is-show-starred="showStarred"
                      />
                      <Loader
                        :loading-text="searchText ? `Finding leads ${searchText}` : `Finding leads in ${zipcode}`"
                        :loading="searchLoading"
                        :count="totalChurchPlans"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 7" class="pa-0">
              <v-col v-if="advanceFilter ? (advanceFilter.taxExemptChips.length > 0 ? true : false) : ''" class="mb-4 mt-5">
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.taxExemptChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2"
                  :class="theme.dark ? '' : 'text-white'"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2" :class="theme.dark ? '' : 'light-grey text-black'" label size="small">
                  ({{ new Intl.NumberFormat().format(taxExemptDataCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-btn
                    v-if="taxExemptDataCount && taxExemptDataCount > 0"
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="openSavedSearches()"
                  >
                    {{ showEditSearch ? 'Edit Search' : 'Save Search' }}
                  </v-btn>
                  <v-divider v-if="taxExemptDataCount && taxExemptDataCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    :color="theme.dark ? '' : 'accent'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-0" width="100%">
                      <TaxExemptionResult
                        :key="componentTaxExemptKey"
                        ref="taxExemptComponent"
                        :zipcode="zipcode"
                        :is-show-map-switch="showMap"
                        :radius="searchRadius"
                        :map-finder-info="mapFinderInfo()"
                        :is-show-starred="showStarred"
                      />
                      <Loader
                        :loading-text="searchText ? `Finding leads ${searchText}` : `Finding leads in ${zipcode}`"
                        :loading="searchLoading"
                        :count="totalTaxExemptPlans"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 4" class="pa-0">
              <v-col v-if="advanceFilter ? (advanceFilter.individualChips.length > 0 ? true : false) : ''" class="mb-4 mt-5">
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.individualChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2"
                  :class="theme.dark ? '' : 'text-white'"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2" :class="theme.dark ? '' : 'light-grey text-black'" label size="small">
                  ({{ new Intl.NumberFormat().format(individualDataCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-btn
                    v-if="individualDataCount && individualDataCount > 0"
                    :color="theme.dark ? '' : 'hyperlink'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="openSavedSearches()"
                  >
                    {{ showEditSearch ? 'Edit Search' : 'Save Search' }}
                  </v-btn>
                  <v-divider v-if="individualDataCount && individualDataCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    :color="theme.dark ? '' : 'accent'"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-0" width="100%">
                      <IndividualResult
                        :key="componentindividualKey"
                        ref="individualComponent"
                        :zipcode="zipcode"
                        :is-show-map-switch="showMap"
                        :radius="searchRadius"
                        :map-finder-info="mapFinderInfo()"
                        :is-show-starred="showStarred"
                      />
                      <Loader
                        :loading-text="searchText ? `Finding leads ${searchText}` : `Finding leads in ${zipcode}`"
                        :loading="searchLoading"
                        :count="totalIndividualPlans"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 5" class="pa-0">
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-0" width="100%">
                      <FavoriteLead
                        :key="componentFavouriteKey"
                        :show-map="showMap"
                        :favorite-list="favoriteList"
                        :search-loading="searchLoading"
                        :map-finder-info="mapFinderInfo()"
                        from="Finder"
                      />
                      <Loader
                        :loading-text="`Loading favorite leads`"
                        :loading="searchLoading"
                        :count="favoriteList ? favoriteList.length : 0"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 6" class="pa-0">
              <v-col cols="12" class="pt-1 pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-0" width="100%">
                      <Client
                        :key="componentClientKey"
                        :show-map="showMap"
                        :client-list="clientList"
                        :search-loading="searchLoading"
                        :map-finder-info="mapFinderInfo()"
                      />
                      <Loader
                        :loading-text="`Loading clients`"
                        :loading="searchLoading"
                        :count="clientList ? clientList.length : 0"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-col>
          <v-col v-show="!display.smAndDown.value && showMap" cols="4">
            <v-col>
              <FinderMap
                ref="mapFinder"
                :show-map="showMap"
                map-type="web"
                :plan-info="redirectPlanInfo"
                :last-map="''"
                :client-plan-info="clientPlanInfo"
                :prospect-tab="prospectTab"
                from-page="finder"
                :search-zipcode="searchZipcode"
                :school-detail-page="schoolDetailPage"
              />
            </v-col>
          </v-col>
        </v-row>
        <v-dialog v-model="advanceFilterModel" persistent scrollable max-width="1000px" :eager="true">
          <v-card>
            <v-card-title :class="theme.dark ? '' : 'accent'">
              <v-col cols="12" xs="12">
                <v-row>
                  <v-col cols="11">
                    <h4 v-if="prospectTab === 0" class="text-white">
                      <v-icon size="21" color="white" class="pr-1 icon-for-profit" />
                      Advanced Search Filters for For Profit Employer
                    </h4>
                    <h4 v-if="prospectTab === 1" class="text-white">
                      <v-icon size="21" color="white" class="pr-1 icon-schools" />
                      Advanced Search Filters for Schools
                    </h4>
                    <h4 v-if="prospectTab === 4" class="text-white">
                      <v-icon size="21" color="white" class="pr-1 icon-individual" />
                      Advanced Search Filters for Individual Employees
                    </h4>
                  </v-col>
                  <v-col cols="1" class="text-right">
                    <v-icon size="21" color="white" @click="closeAdvanceFilter()"> mdi-close </v-icon>
                  </v-col>
                </v-row>
              </v-col>
            </v-card-title>
            <v-card-text class="rbcchart_height">
              <AdvanceFilter ref="advanceFilter" :prospect-tab="prospectTab" />
            </v-card-text>
            <v-divider class="my-3" />
            <v-card-actions>
              <v-col cols="12" xs="12" class="text-right">
                <v-btn variant="text" :color="theme.dark ? '' : 'accent'" class="text-none" @click="resetFilter()">
                  Cancel, don't apply filter
                </v-btn>
                <v-btn
                  :color="theme.dark ? '' : 'accent'"
                  :disabled="searchLoading"
                  :loading="searchLoading"
                  @click="applyAdvanceFilter()"
                >
                  Apply Filter
                  <template #searchLoading>
                    <span class="custom-loader">
                      5
                      <v-icon light>cached</v-icon>
                    </span>
                  </template>
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="saveSearchDialog" max-width="500">
          <SaveSearch
            ref="searchSave"
            :key="componentSearchKey"
            :saved-result="savedResult"
            :prospect-tab="prospectTab"
            @close-dialog="closeSaveSearch()"
            @save-search="saveSearchCriteria"
          />
        </v-dialog>
        <v-dialog v-model="savedSearches" :max-width="display.xs.value ? '' : '700'" :eager="true">
          <SavedSearches @close-search-dialog="closeSavedSearch()" />
        </v-dialog>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import { ref, inject, onMounted, computed, getCurrentInstance, watch, onBeforeUnmount } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import FinderMap from '@/components/TAL/Finder/FinderMap'
import AdvanceFilter from '@/components/TAL/Finder/AdvanceFilter'
import SaveSearch from '@/components/TAL/Finder/SaveSearch'
import IndividualResult from '@/components/TAL/Finder/IndividualResult'
import PlanStar from '@/components/TAL/PlanStar'
import CustomIcon from '@/components/CustomIcon'
import planfinderlist from '@/assets/planfinder.json'
import SchoolResult from '@/components/TAL/Finder/Schools/SchoolResult'
import FavoriteLead from '@/components/TAL/Finder/FavoriteLead'
import SavedSearches from '@/components/TAL/Finder/SavedSearches'
import Loader from '@/components/NewLoader'
import Observer from '@/components/Observer'
import Client from '@/components/TAL/Finder/MyClient'
import * as XLSX from 'xlsx'
import MunicipalResult from '@/components/TAL/Finder/Municipalities/MunicipalResult'
import ChurchResult from '@/components/TAL/Finder/Church/ChurchResult'
import TaxExemptionResult from '@/components/TAL/Finder/TaxExemption/TaxExemptionResult'
export default {
  components: {
    FinderMap,
    AdvanceFilter,
    PlanStar,
    SaveSearch,
    CustomIcon,
    IndividualResult,
    SchoolResult,
    FavoriteLead,
    SavedSearches,
    Loader,
    Observer,
    Client,
    MunicipalResult,
    ChurchResult,
    TaxExemptionResult
  },
  setup() {
    const theme = useTheme()
    const eventBus = inject('eventBus')
    const display = useDisplay()
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const toast = instance.appContext.config.globalProperties.$toast
    const headerList = ref([
      {
        title: 'Plan Name',
        value: 'PNAME',
        width: '25%',
        align: 'center',
        sortable: false,
        class: !display.mdAndUp.value ? 'pa-2 sticky-header' : 'sticky-header'
      },
      {
        title: 'Total Assets',
        value: 'TOTASSETS',
        width: '10%',
        align: 'center',
        sortable: false,
        class: 'pa-1 hidden-sm-and-down sticky-header'
      },
      {
        title: 'Growth',
        value: 'GROWTH',
        width: '10%',
        align: 'center',
        sortable: false,
        class: 'pa-1 hidden-sm-and-down sticky-header'
      },
      {
        title: 'Active Participants',
        value: 'ACTPARTIC',
        width: '10%',
        align: 'center',
        sortable: false,
        class: 'pa-1 hidden-sm-and-down sticky-header'
      },
      {
        title: 'Avg Employee Contribution',
        value: 'PARTAVG',
        width: '15%',
        align: 'center',
        sortable: false,
        class: 'pa-1 hidden-sm-and-down sticky-header'
      },
      {
        title: 'Avg Employer Contribution',
        value: 'EMPLYRAVG',
        width: '15%',
        align: 'center',
        sortable: false,
        class: 'pa-1 hidden-sm-and-down sticky-header'
      },
      {
        title: 'City',
        value: 'SCITY',
        width: '3%',
        align: 'center',
        sortable: false,
        class: 'pa-1 hidden-sm-and-down sticky-header'
      },
      {
        title: 'State',
        value: 'SSTATE',
        width: '2%',
        align: 'center',
        sortable: false,
        class: 'pa-1 hidden-sm-and-down sticky-header'
      },
      {
        title: 'Actions',
        value: '',
        width: '10%',
        align: 'center',
        sortable: false,
        class: 'pa-1 sticky-header'
      }
    ])
    const savedResult = ref([])
    const mapselectedSEINPNO = ref('')
    const radiusList = ref([
      {
        text: 'within 5 miles',
        value: 5
      },
      {
        text: 'within 10 miles',
        value: 10
      },
      {
        text: 'within 25 miles',
        value: 25
      },
      {
        text: 'within 50 miles',
        value: 50
      },
      {
        text: 'within 100 miles',
        value: 100
      }
    ])
    const searchRadius = ref(5)
    const zipcode = ref('Current Location')
    const showMap = ref(true)
    // const prevRoute = ref('')
    const advanceFilterModel = ref(false)
    const showClient = ref(false)
    const saveSearchDialog = ref(false)
    const closeReportPopUp = ref({})
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    const planSearchRequest = ref({})
    const searchLoading = ref(false)
    const planReportList = ref(planfinderlist.planReports)
    const clearValue = ref(planfinderlist.clearValue)
    const searchResult = ref([])
    const loading = ref(false)
    const advanceFilter = ref(null)
    // const clientMapResult = ref([])
    const selectedRowPadding = ref('')
    const rowcolor = ref('')
    const componentSchoolKey = ref(0)
    const componentindividualKey = ref(0)
    const componentMunicipalKey = ref(0)
    const componentChurchKey = ref(0)
    const planList = ref([])
    const showStarred = ref(false)
    const hideCard = ref(false)
    const businessType = ref([
      {
        text: 'For Profit',
        value: 0,
        icon: 'icon-for-profit',
        color: 'forProfitIcon',
        show: true,
        disabled: false
      },
      {
        text: 'Schools',
        value: 1,
        icon: 'icon-graduation',
        color: 'schoolIcon',
        show: true,
        disabled: false
      },
      // {
      //   text: 'Municipalities',
      //   value: 2,
      //   icon: 'icon-government',
      //   color: 'municipalitiesIcon',
      //   show: true,
      //   disabled: false
      // },
      // {
      //   text: 'Churches',
      //   value: 3,
      //   icon: 'fas fa-church',
      //   color: 'nonProfitIcon',
      //   show: true,
      //   disabled: false
      // },
      // {
      //   text: 'Tax-Exempt',
      //   value: 7,
      //   icon: 'icon-tax-exempt',
      //   color: 'taxExemptIcon',
      //   show: true,
      //   disabled: false
      // },
      // {
      //   text: 'Individuals',
      //   value: 4,
      //   icon: 'icon-individual',
      //   color: 'participantIcon',
      //   show: true,
      //   disabled: false
      // },
      {
        text: 'My favorites',
        value: 5,
        icon: 'icon-bookmark',
        color: 'forProfitIcon',
        show: true,
        disabled: false
      },
      {
        text: 'My Clients',
        value: 6,
        icon: 'icon-my-clients',
        color: 'text-hyperlink',
        show: true,
        disabled: false
      }
    ])
    const searchText = ref('')
    const filterPlans = ref([])
    const savePlans = ref([])
    const planReports = ref([])
    const plan = ref('')
    const EIN = ref('')
    const prospectTab = ref(0)
    const filterSchools = ref([])
    const schoolData = ref([])
    const schoolDataResult = ref([])
    const filterIndividual = ref([])
    // const schoolFilterChips = ref([])
    const individualDataCount = ref(0)
    const individualData = ref([])
    // const individualFilterChips = ref([])
    const individualDataResult = ref([])
    const individualSearchResult = ref([])
    const constantPlanCount = ref(0)
    const municipalDataCount = ref(0)
    const municipalSearchResult = ref([])
    const churchDataCount = ref(0)
    const churchSearchResult = ref(0)
    const schoolDataCount = ref(0)
    // const schoolSearchResult = ref([])
    const showSearch = ref(false)
    const sponsorList = ref([])
    const componentFavouriteKey = ref(0)
    const actionList = ref([
      {
        text: 'Email Reminder...',
        value: 'EmailReminder'
      }
      // {
      //   text: 'Open Account',
      //   value: 'OpenAccount'
      // }
    ])
    const favoriteList = ref([])
    const savedSearches = ref(false)
    const showSavedSearchList = ref(false)
    const componentSearchKey = ref(0)
    const showEditSearch = ref(false)
    const componentBookmarkKey = ref(0)
    const employeeSponsorPage = ref(1)
    const clientList = ref([])
    const componentClientKey = ref(0)
    const totalPlans = ref(-1)
    const individualPage = ref(1)
    const totalIndividualPlans = ref(-1)
    const totalClientPlans = ref(-1)
    const clientDataCount = ref(0)
    const clientPage = ref(1)
    const sortByType = ref(3)
    const sortByListType = ref([
      { text: 'Plan Name - A to Z', value: 0, sortable: false },
      { text: 'Plan Name - Z to A', value: 1 },
      { text: 'Total Assets - Low to High', value: 2 },
      { text: 'Total Assets - High to Low', value: 3 },
      { text: 'Growth - Low to High', value: 4 },
      { text: 'Growth - High to Low', value: 5 },
      { text: 'Active Participants - Low to High', value: 6 },
      { text: 'Active Participants - High to Low', value: 7 },
      { text: 'Avg Employee Contr. - Low to High', value: 8 },
      { text: 'Avg Employee Contr. - High to Low', value: 9 },
      { text: 'Avg Employer Contr. - Low to High', value: 10 },
      { text: 'Avg Employer Contr. - High to Low', value: 11 },
      { text: 'City - A to Z', value: 12 },
      { text: 'City - Z to A', value: 13 },
      { text: 'State - A to Z', value: 14 },
      { text: 'State - Z to A', value: 15 }
    ])
    const sortByTypeName = ref('')
    const sortByTypeOrder = ref('')
    const totalMunicipalPlans = ref(0)
    const filterMunicipal = ref([])
    const totalChurchPlans = ref(0)
    const filterChurch = ref([])
    const totalTaxExemptPlans = ref(0)
    const filterTaxExempt = ref([])
    const taxExemptDataCount = ref(0)
    const taxExemptSearchResult = ref([])
    const componentTaxExemptKey = ref(0)
    const municipalPage = ref(0)
    const municipalData = ref([])
    const churchPage = ref(0)
    const churchData = ref([])
    const taxExemptPage = ref(0)
    const taxExemptData = ref([])
    const municipalDataResult = ref([])
    const churchDataResult = ref([])
    const taxExemptDataResult = ref([])
    const mapFinder = ref(null)
    const searchSave = ref({})
    const breadCrumb = computed(() => {
      return route.meta
    })
    const showSchool = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Schools
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c, $authz.typeOfBusiness.Schools)
        )
      } else return true
    })
    const showEmployerSponsored = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    })
    const showIndividuals = computed(() => {
      // if ($authz.hasRole($authz.roles.FirmAdmin)) {
      //   return $authz.allowedByProgram(
      //     $authz.programPermissionSet
      //       .Type_of_Business_Advisors_Firms_allowed__c,
      //     $authz.typeOfBusiness.Individuals
      //   )
      // } else if (
      //   $authz.hasRole($authz.roles.Advisor) ||
      //   $authz.hasRole($authz.roles.Strategist) ||
      //   $authz.hasRole($authz.roles.Fiduciary338)
      // ) {
      //   return (
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     ) &&
      //     $authz.allowedByAccount(
      //       $authz.accountPermissionSet
      //         .Type_of_Business_Advisors_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     )
      //   )
      // } else return true
      return false
    })
    const showMunicipalities = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Municipalities
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Municipalities
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Municipalities
          )
        )
      } else return true
    })
    const showLegalText = computed(() => {
      if (
        store.state.user.selectedProgram &&
        store.state.user.selectedProgram.legal_Policy__c &&
        store.state.user.selectedProgram.legal_Policy__c.length <= 600
      ) {
        return true
      } else return false
    })
    const cardHeight = computed(() => {
      if (showLegalText.value) {
        if (display.xl.value) {
          return 100 - 17
        } else if (display.width.value >= 1400) {
          return 100 - 18
        } else if (!display.smAndDown.value) {
          return 100 - 24
        } else return 100 - 24
      } else {
        if (display.xl.value) {
          return 100 - 11
        }
        if (display.width.value >= 1400) {
          return 100 - 12
        } else if (!display.smAndDown.value) {
          return 100 - 13
        } else return 100 - 13
      }
    })
    const exportPermissionForAdvisor = computed(() => {
      if (
        $authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full) ||
        store.state.advisorExportPermission === $authz.permission.FullAccess
      ) {
        return true
      } else {
        return false
      }
    })
    const clearSearch = () => {
      hideCard.value = false
      searchText.value = ''
      plan.value = ''
      EIN.value = ''
      filterPlans.value = []
      filterSchools.value = []
      filterIndividual.value = []
      filterMunicipal.value = []
      filterChurch.value = []
      filterTaxExempt.value = []
    }
    const encodeQueryData = (data) => {
      const ret = []
      for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
      return ret.join('&')
    }
    const resetSchoolData = () => {
      store.state.finderList.schoolSearchResult = []
      store.state.finderList.schoolData = []
      store.state.finderList.schoolDataCount = 0
      schoolDataCount.value = 0
      schoolData.value = []
    }
    const resetIndividualData = () => {
      store.state.finderList.individualSearchResult = []
      store.state.finderList.individualDataCount = 0
      store.state.finderList.individualData = []
      individualData.value = []
      individualDataCount.value = 0
      individualPage.value = 1
    }
    const resetMunicipalData = () => {
      store.state.finderList.municipalSearchResult = []
      store.state.finderList.municipalDataCount = 0
      store.state.finderList.municipalData = []
      municipalData.value = []
      municipalDataCount.value = 0
      municipalPage.value = 1
    }
    const resetChurchData = () => {
      store.state.finderList.churchSearchResult = []
      store.state.finderList.churchDataCount = 0
      store.state.finderList.churchData = []
      churchData.value = []
      churchDataCount.value = 0
      churchPage.value = 1
    }
    const resetTaxExemptData = () => {
      store.state.finderList.taxExemptSearchResult = []
      store.state.finderList.taxExemptDataCount = 0
      store.state.finderList.taxExemptData = []
      taxExemptData.value = []
      taxExemptDataCount.value = 0
      taxExemptPage.value = 1
    }
    const resetClientData = () => {
      store.state.finderList.clientPlanCount = 0
      store.state.finderList.clientData = []
      clientList.value = []
      clientDataCount.value = 0
      clientPage.value = 1
    }
    const resetEmployerData = () => {
      store.state.finderList.searchResult = []
      store.state.finderList.constantPlanCount = 0
      constantPlanCount.value = 0
      searchResult.value = []
      employeeSponsorPage.value = 1
    }
    const resetMarker = () => {
      if (mapFinder.value) {
        mapFinder.value.resetProspectMarker()
        mapFinder.value.resetSchoolMarker()
        mapFinder.value.resetIndividualHouseholdMarker()
        mapFinder.value.resetMunicipalMarker()
        mapFinder.value.resetChurchMarker()
        mapFinder.value.resetTaxExemptMarker()
      }
    }
    const getSchoolMap = () => {
      if (store.state.finderList.schoolSearchResult) {
        schoolDataResult.value = store.state.finderList.schoolSearchResult ? store.state.finderList.schoolSearchResult : []
      } else {
        schoolDataResult.value = store.state.finderList.schoolData ? store.state.finderList.schoolData : []
      }
      if (prospectTab.value === 1 && showSchool.value) {
        if (schoolDataResult.value && schoolDataResult.value.length > 0) {
          mapFinder.value.setSchoolDistrictMarker(schoolDataResult.value, 'Schools')
        }
      }
    }
    const getMunicipalMap = () => {
      if (store.state.finderList.municipalSearchResult) {
        municipalDataResult.value = store.state.finderList.municipalSearchResult
          ? store.state.finderList.municipalSearchResult
          : []
      } else {
        municipalDataResult.value = store.state.finderList.municipalData ? store.state.finderList.municipalData : []
      }
      if (prospectTab.value === 2 && showMunicipalities.value) {
        if (municipalDataResult.value && municipalDataResult.value.length > 0) {
          mapFinder.value.setMunicipalMarker(municipalDataResult.value, 'Municipalities')
        }
      }
    }
    const getChurchMap = () => {
      if (store.state.finderList.churchSearchResult) {
        churchDataResult.value = store.state.finderList.churchSearchResult ? store.state.finderList.churchSearchResult : []
      } else {
        churchDataResult.value = store.state.finderList.churchData ? store.state.finderList.churchData : []
      }
      if (prospectTab.value === 3 && showMunicipalities.value) {
        if (churchDataResult.value && churchDataResult.value.length > 0) {
          mapFinder.value.setChurchMarker(churchDataResult.value, 'Church')
        }
      }
    }
    const getTaxExemptMap = () => {
      if (store.state.finderList.taxExemptSearchResult) {
        taxExemptDataResult.value = store.state.finderList.taxExemptSearchResult
          ? store.state.finderList.taxExemptSearchResult
          : []
      } else {
        taxExemptDataResult.value = store.state.finderList.taxExemptData ? store.state.finderList.taxExemptData : []
      }
      if (prospectTab.value === 7 && showMunicipalities.value) {
        if (taxExemptDataResult.value && taxExemptDataResult.value.length > 0) {
          mapFinder.value.setTaxExemptMarker(taxExemptDataResult.value, 'TaxExempt')
        }
      }
    }
    const getIndividualMap = () => {
      if (store.state.finderList.individualSearchResult) {
        individualDataResult.value = store.state.finderList.individualSearchResult
          ? store.state.finderList.individualSearchResult
          : []
      } else {
        individualDataResult.value = store.state.finderList.individualData ? store.state.finderList.individualData : []
      }
      if (prospectTab.value === 4 && showIndividuals.value) {
        if (individualDataResult.value && individualDataResult.value.length > 0) {
          mapFinder.value.setIndividualHouseholdMarker(individualDataResult.value, 'Individuals')
        }
      }
    }
    const getGoogleMap = () => {
      mapFinder.value.setCenterPin(zipcode.value)
      resetMarker()
      if (prospectTab.value === 0 && showEmployerSponsored.value) {
        var result = []
        result = searchResult.value
        if (result && result.length > 0) {
          mapFinder.value.setProspectMarker(result, 'Employer Sponsored')
        }
      } else if (showSchool.value && prospectTab.value === 1) {
        getSchoolMap()
      } else if (showMunicipalities.value && prospectTab.value === 2) {
        getMunicipalMap()
      } else if (showMunicipalities.value && prospectTab.value === 3) {
        getChurchMap()
      } else if (showMunicipalities.value && prospectTab.value === 7) {
        getTaxExemptMap()
      } else if (showIndividuals.value && prospectTab.value === 4) {
        getIndividualMap()
      } else if (prospectTab.value === 6) {
        if (clientList.value && clientList.value.length > 0) {
          mapFinder.value.setClientProspectMarker(clientList.value, 'Employer Sponsored')
        }
      }
    }
    const showHideMap = () => {
      showMap.value = !showMap.value
      store.state.finderList.showMap = showMap.value
      getGoogleMap()
    }
    const applyFilter = async (val) => {
      searchLoading.value = true
      var searchCountPromises = []
      var totalPlanCount = 0
      showClient.value = false
      if (showEmployerSponsored.value && prospectTab.value === 0) {
        if (advanceFilter.value) {
          planSearchRequest.value = advanceFilter.value.getPlanSearchRequest()
        }
        planSearchRequest.value.searchRadius = searchRadius.value ? searchRadius.value : 0
        planSearchRequest.value.zipCode = !zipcode.value ? null : zipcode.value
        planSearchRequest.value.plan = !plan.value ? null : plan.value
        planSearchRequest.value.ein = !EIN.value ? null : EIN.value
        planSearchRequest.value.page = employeeSponsorPage.value ? employeeSponsorPage.value : 1
        planSearchRequest.value.size = 50
        planSearchRequest.value.sortBy = sortByTypeName.value
        planSearchRequest.value.sortOrder = sortByTypeOrder.value
        if (zipcode.value) planSearchRequest.value.retrieveResultCountOnly = true
        if (!searchText.value) {
          if (val !== 'nextPage') {
            searchCountPromises.push(
              $axios.post(`/api/v1/tal/plan/search`, planSearchRequest.value).then((success) => {
                if (planSearchRequest.value.zipCode) {
                  constantPlanCount.value =
                    success.data.d && success.data.d.results && success.data.d.results.length > 0
                      ? success.data.d.results[0].LeadsCount
                      : 0
                  store.state.finderList.constantPlanCount = constantPlanCount.value
                  let radiusValue =
                    success.data.d && success.data.d.resultsSearchRadius && success.data.d.resultsSearchRadius.SearchRadius
                      ? success.data.d.resultsSearchRadius.SearchRadius
                      : 0
                  if (radiusValue !== searchRadius.value) {
                    let radiusExist = radiusList.value.filter((a) => a.value === radiusValue)
                    if (radiusExist && radiusExist.length === 0) {
                      let newRadiusValue = {
                        text: `within ${radiusValue} miles`,
                        value: radiusValue
                      }
                      radiusList.value.push(newRadiusValue)
                      radiusList.value = radiusList.value.sort(function (a, b) {
                        return a.value - b.value
                      })
                    }
                    searchRadius.value = radiusValue
                  }
                }
              })
            )
          }
        }
      }
      if (showSchool.value && prospectTab.value === 1) {
        searchCountPromises.push(
          $axios
            .get(
              `/api/v1/tal/schooldistricts?zipcode=${zipcode.value ? zipcode.value : null}&radius=${
                searchRadius.value ? searchRadius.value : 0
              }&searchCriteria=${searchText.value !== null ? searchText.value : ''}`
            )
            .then((success) => {
              schoolDataCount.value =
                success.data.d && success.data.d.schooldistrictData && success.data.d.schooldistrictData.length > 0
                  ? success.data.d.schooldistrictData.length
                  : 0
              schoolData.value =
                success.data.d && success.data.d.schooldistrictData && success.data.d.schooldistrictData.length > 0
                  ? success.data.d.schooldistrictData
                  : []
              if (schoolData.value && schoolData.value.length > 0) {
                for (var i = 0; i < schoolData.value.length; i++) {
                  if (schoolData.value[i].schools && schoolData.value[i].schools.length > 0) {
                    for (var j = 0; j < schoolData.value[i].schools.length; j++) {
                      schoolData.value[i].schools[j].payrollSlot = schoolData.value[i].payrollSlot
                    }
                  }
                }
              }
            })
        )
      }
      if (showMunicipalities.value && prospectTab.value === 2) {
        let url = '/api/v1/municipal'
        let urlObj = {}
        if (zipcode.value) {
          urlObj['zipcode'] = zipcode.value
          url = `/api/v1/municipal?${encodeQueryData(urlObj)}`
        }
        if (searchRadius.value) {
          urlObj['radius'] = searchRadius.value
          url = `/api/v1/municipal?${encodeQueryData(urlObj)}`
        }
        if (searchText.value) {
          urlObj['searchCriteria'] = searchText.value
          url = `/api/v1/municipal?${encodeQueryData(urlObj)}`
        }
        searchCountPromises.push(
          $axios.get(`${url}`).then((success) => {
            municipalDataCount.value = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d.length : 0
            municipalData.value = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d : []
            totalMunicipalPlans.value = municipalData.value && municipalData.value.length > 0 ? municipalData.value.length : -1
          })
        )
      }
      if (showMunicipalities.value && prospectTab.value === 3) {
        let url = '/api/v1/church'
        let urlObj = {}
        if (zipcode.value) {
          urlObj['zipcode'] = zipcode.value
          url = `/api/v1/church?${encodeQueryData(urlObj)}`
        }
        if (searchRadius.value) {
          urlObj['radius'] = searchRadius.value
          url = `/api/v1/church?${encodeQueryData(urlObj)}`
        }
        if (searchText.value) {
          urlObj['searchCriteria'] = searchText.value
          url = `/api/v1/church?${encodeQueryData(urlObj)}`
        }
        searchCountPromises.push(
          $axios.get(`${url}`).then((success) => {
            churchDataCount.value = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d.length : 0
            churchData.value = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d : []
            totalChurchPlans.value = churchData.value && churchData.value.length > 0 ? churchData.value.length : -1
          })
        )
      }
      if (showMunicipalities.value && prospectTab.value === 7) {
        let url = '/api/v1/taxexempt'
        let urlObj = {}
        if (zipcode.value) {
          urlObj['zipcode'] = zipcode.value
          url = `/api/v1/taxexempt?${encodeQueryData(urlObj)}`
        }
        if (searchRadius.value) {
          urlObj['radius'] = searchRadius.value
          url = `/api/v1/taxexempt?${encodeQueryData(urlObj)}`
        }
        if (searchText.value) {
          urlObj['searchCriteria'] = searchText.value
          url = `/api/v1/taxexempt?${encodeQueryData(urlObj)}`
        }
        searchCountPromises.push(
          $axios.get(`${url}`).then((success) => {
            taxExemptDataCount.value = success.data.d && success.data.d.length > 0 ? success.data.d.length : 0
            taxExemptData.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
            totalTaxExemptPlans.value = taxExemptData.value && taxExemptData.value.length > 0 ? taxExemptData.value.length : -1
          })
        )
      }
      if (showIndividuals.value && prospectTab.value === 4) {
        let individualFilterValue = advanceFilter.value.getIndividualSearchRequest()
        var FilterParticipantDetails = {
          Page: individualPage.value,
          Hasloan: individualFilterValue.hasLoan ? (individualFilterValue.hasLoan === 'Has a Loan' ? 1 : 0) : 9999,
          Employmentstatus: individualFilterValue.employmentStatus ? individualFilterValue.employmentStatus : null,
          Planstatus: individualFilterValue.planStatus ? individualFilterValue.planStatus : null,
          EP: individualFilterValue.equityAllocation ? individualFilterValue.equityAllocation : null,
          IndividualStatus: individualFilterValue.individualStatus ? individualFilterValue.individualStatus : null,
          Age: individualFilterValue.participantValue ? individualFilterValue.participantValue : clearValue.value,
          ContributionRate: individualFilterValue.contributionRate ? individualFilterValue.contributionRate : clearValue.value,
          Assests: individualFilterValue.accountBalance ? individualFilterValue.accountBalance : clearValue.value,
          Zipcode: zipcode.value,
          Radius: searchRadius.value ? searchRadius.value : 5,
          Searchcriteria: searchText.value ? searchText.value : '',
          Size: 50
        }
        searchCountPromises.push(
          $axios.post(`/api/v1/tal/individualpagination`, FilterParticipantDetails).then((success) => {
            let indiviudalResultSet =
              success.data.d && success.data.d.individualData && success.data.d.individualData.length > 0
                ? success.data.d.individualData
                : []
            if (individualData.value && individualData.value.length > 0) {
              Array.prototype.push.apply(individualData.value, indiviudalResultSet)
            } else individualData.value = indiviudalResultSet
            totalIndividualPlans.value =
              individualData.value && individualData.value.length > 0 ? individualData.value.length : -1
            if (searchText.value) {
              individualDataCount.value =
                success.data.d && success.data.d.householdCount && success.data.d.householdCount.length > 0
                  ? success.data.d.householdCount.length
                  : 0
            } else {
              individualDataCount.value =
                success.data.d && success.data.d.householdCount && success.data.d.householdCount.length > 0
                  ? success.data.d.householdCount[0].HouseholdCount
                  : 0
            }
            let radiusValue =
              success.data.d && success.data.d.searchRadius && success.data.d.searchRadius.length > 0
                ? success.data.d.searchRadius[0].SearchRadius
                : 0
            if (radiusValue !== searchRadius.value) {
              let radiusExist = radiusList.value.filter((a) => a.value === radiusValue)
              if (radiusExist && radiusExist.length === 0) {
                let newRadiusValue = {
                  text: `within ${radiusValue} miles`,
                  value: radiusValue
                }
                radiusList.value.push(newRadiusValue)
                radiusList.value = radiusList.value.sort(function (a, b) {
                  return a.value - b.value
                })
              }
              searchRadius.value = radiusValue
            }
            if (individualData.value && individualData.value.length > 0) {
              individualData.value.map((element) => {
                element['actionList'] = actionList.value && actionList.value.length > 0 ? actionList.value : []
              })
            }
          })
        )
      }
      await Promise.allSettled(searchCountPromises)
      var promises = []
      if (showEmployerSponsored.value && prospectTab.value === 0) {
        planSearchRequest.value.retrieveResultCountOnly = false
        promises.push(
          $axios.post(`/api/v1/tal/plan/search`, planSearchRequest.value).then((success) => {
            let resultSet =
              success.data.d && success.data.d.results && success.data.d.results.length > 0 ? success.data.d.results : []
            if (searchResult.value && searchResult.value.length > 0) {
              Array.prototype.push.apply(searchResult.value, resultSet)
            } else searchResult.value = resultSet
            if (searchText.value) {
              constantPlanCount.value =
                success.data.d && success.data.d.results && success.data.d.results.length > 0 ? success.data.d.results.length : 0
              store.state.finderList.constantPlanCount = constantPlanCount.value
              let radiusValue =
                success.data.d && success.data.d.resultsSearchRadius && success.data.d.resultsSearchRadius.SearchRadius
                  ? success.data.d.resultsSearchRadius.SearchRadius
                  : 0
              if (radiusValue !== searchRadius.value) {
                let radiusExist = radiusList.value.filter((a) => a.value === radiusValue)
                if (radiusExist && radiusExist.length === 0) {
                  let newRadiusValue = {
                    text: `within ${radiusValue} miles`,
                    value: radiusValue
                  }
                  radiusList.value.push(newRadiusValue)
                  radiusList.value = radiusList.value.sort(function (a, b) {
                    return a.value - b.value
                  })
                }
                searchRadius.value = radiusValue
              }
            }
          })
        )
      }
      await Promise.allSettled(promises)
      if (Object.keys(store.state.finderList).length > 0) {
        if (zipcode.value !== store.state.finderList.zipcode || searchRadius.value !== store.state.finderList.searchRadius) {
          if (prospectTab.value === 0) {
            resetSchoolData()
            resetIndividualData()
            resetMunicipalData()
            resetChurchData()
            resetTaxExemptData()
            resetClientData()
          } else if (prospectTab.value === 1) {
            resetEmployerData()
            resetIndividualData()
            resetMunicipalData()
            resetChurchData()
            resetTaxExemptData()
            resetClientData()
          } else if (prospectTab.value === 2) {
            resetEmployerData()
            resetSchoolData()
            resetIndividualData()
            resetChurchData()
            resetTaxExemptData()
            resetClientData()
          } else if (prospectTab.value === 3) {
            resetEmployerData()
            resetSchoolData()
            resetIndividualData()
            resetMunicipalData()
            resetTaxExemptData()
            resetClientData()
          } else if (prospectTab.value === 4) {
            resetSchoolData()
            resetEmployerData()
            resetMunicipalData()
            resetChurchData()
            resetTaxExemptData()
            resetClientData()
          } else if (prospectTab.value === 7) {
            resetSchoolData()
            resetEmployerData()
            resetIndividualData()
            resetMunicipalData()
            resetChurchData()
            resetClientData()
          }
        }
      }
      store.state.finderList.showMap = showMap.value
      store.state.finderList.zipcode = zipcode.value
      store.state.finderList.searchRadius = searchRadius.value

      if (showEmployerSponsored.value && prospectTab.value === 0) {
        if (searchResult.value.length > 0) {
          planReports.value.forEach((a) => {
            a.loader = false
          })
          let reportValue = planReports.value.slice()
          if (reportValue && reportValue.length > 0) {
            let expressDiagnosticPosition = reportValue.findIndex((a) => a.value === 'Express Diagnostic')
            if (expressDiagnosticPosition > -1) reportValue.splice(expressDiagnosticPosition, 1)
            let diagnosticPosition = reportValue.findIndex((a) => a.value === 'Diagnostic')
            if (diagnosticPosition > -1) reportValue.splice(diagnosticPosition, 1)
            let rpeaPosition = reportValue.findIndex((a) => a.value === 'RPEA')
            if (rpeaPosition > -1) reportValue.splice(rpeaPosition, 1)
          }
          searchResult.value.map((element) => {
            if (
              element.DCPTYPE === $authz.planType.Defined_Contribution_Plan ||
              element.DCPTYPE === $authz.planType.ERISA_403_b
            ) {
              element['selectreport'] = planReports.value && planReports.value.length > 0 ? planReports.value : []
            } else {
              element['selectreport'] = reportValue && reportValue.length > 0 ? reportValue : []
            }
          })
          searchResult.value.map((element, index) => {
            element['isMarker'] = true
            element['markerIndex'] = index
          })
        }
        totalPlanCount = constantPlanCount.value
        totalPlans.value = searchResult.value && searchResult.value.length > 0 ? searchResult.value.length : -1
        store.state.finderList.searchResult = searchResult.value
        savePlans.value = searchResult.value
        store.state.finderList.constantPlanCount = constantPlanCount.value
        store.state.finderList.employeeSponsorPage = employeeSponsorPage.value ? employeeSponsorPage.value : 1
        if (searchResult.value.length === 1 && totalPlanCount === 1) {
          store.state.finderList.zipcode = searchResult.value[0].ZIPCODE
          store.state.finderList.searchRadius = 10
          if (searchText.value && searchResult.value[0].InBookOfBusiness === 0) {
            store.state.finderList.zipcode = searchResult.value[0].ZIPCODE
            store.state.finderList.plan = plan.value
            store.state.finderList.EIN = EIN.value
            store.state.finderList.searchRadius = 10
            store.state.finderList.prospectValue = 0
            store.state.finderList.searchTypeSelected = 'EmployeeSponsor'
            router.push({
              name: 'TALPlan',
              params: {
                id: searchResult.value[0].SEINPNO,
                planType: searchResult.value[0].DCPTYPE
              }
            })
          }
        }
      }
      if (advanceFilter.value) {
        advanceFilter.value.getFilterChips()
        advanceFilter.value.setStoreValues()
      }
      advanceFilterModel.value = false
      if (showSchool.value && prospectTab.value === 1) {
        totalPlanCount = schoolDataCount.value
        store.state.finderList.schoolSearchResult = schoolData.value
        store.state.finderList.schoolData = schoolData.value
        store.state.finderList.schoolDataCount = schoolDataCount.value
        componentSchoolKey.value += 1
        if (schoolDataCount.value === 1 && totalPlanCount === 1) {
          if (searchText.value) {
            store.state.finderList.zipcode = schoolData.value[0].zipCode
            store.state.finderList.plan = plan.value
            store.state.finderList.EIN = EIN.value
            store.state.finderList.searchRadius = 10
            store.state.finderList.prospectValue = 1
            store.state.finderList.searchTypeSelected = 'Schools'
            router.push(
              `/TAL/School?schoolDistId=${schoolData.value[0].id}&zipcode=${zipcode.value ? zipcode.value : null}&radius=${
                searchRadius.value ? searchRadius.value : 0
              }`
            )
          }
        }
        if (val === 'applyFilter') {
          if (advanceFilter.value) {
            advanceFilter.value.getSchoolFilterChips()
            advanceFilter.value.setStoreValues()
          }
        }
      }
      if (showMunicipalities.value && prospectTab.value === 2) {
        totalPlanCount = municipalDataCount.value
        store.state.finderList.municipalSearchResult = municipalData.value
        store.state.finderList.municipalDataCount = municipalDataCount.value
        store.state.finderList.municipalData = municipalData.value
        store.state.finderList.municipalPage = municipalPage.value ? municipalPage.value : 1
        componentMunicipalKey.value += 1
        if (municipalDataCount.value === 1 && totalPlanCount === 1) {
          if (searchText.value) {
            store.state.finderList.zipcode = municipalData.value[0].Zip
            store.state.finderList.plan = plan.value
            store.state.finderList.EIN = EIN.value
            store.state.finderList.searchRadius = 10
            store.state.finderList.prospectValue = 2
            store.state.finderList.searchTypeSelected = 'Municipalities'
            router.push(
              `/TAL/Municipalities?Id=${municipalData.value[0].DepartmentId}&zipcode=${
                municipalData.value[0].Zip ? municipalData.value[0].Zip : null
              }&radius=${searchRadius.value ? searchRadius.value : 0}&name=${municipalData.value[0].Name}`
            )
          }
        }
        // if (advanceFilter.value) {
        //   advanceFilter.value.getIndividualFilterChips()
        //   advanceFilter.value.setStoreValues()
        // }
      }
      if (showMunicipalities.value && prospectTab.value === 3) {
        totalPlanCount = churchDataCount.value
        store.state.finderList.churchSearchResult = churchData.value
        store.state.finderList.churchDataCount = churchDataCount.value
        store.state.finderList.churchData = churchData.value
        store.state.finderList.churchPage = churchPage.value ? churchPage.value : 1
        componentChurchKey.value += 1
        if (churchDataCount.value === 1 && totalPlanCount === 1) {
          if (searchText.value) {
            store.state.finderList.zipcode = churchData.value[0].zipCode
            store.state.finderList.plan = plan.value
            store.state.finderList.EIN = EIN.value
            store.state.finderList.searchRadius = 10
            store.state.finderList.prospectValue = 3
            store.state.finderList.searchTypeSelected = 'Churches'
            router.push(
              `/TAL/Church?name=${churchData.value[0].Name}&zipcode=${
                churchData.value[0].Zip ? churchData.value[0].Zip : null
              }&radius=${searchRadius.value ? searchRadius.value : 0}`
            )
          }
        }
        // if (advanceFilter.value) {
        //   advanceFilter.value.getChurchFilterChips()
        //   advanceFilter.value.setStoreValues()
        // }
      }
      if (showMunicipalities.value && prospectTab.value === 7) {
        totalPlanCount = taxExemptDataCount.value
        store.state.finderList.taxExemptSearchResult = taxExemptData.value
        store.state.finderList.taxExemptDataCount = taxExemptDataCount.value
        store.state.finderList.taxExemptData = taxExemptData.value
        store.state.finderList.taxExemptPage = taxExemptPage.value ? taxExemptPage.value : 1
        componentTaxExemptKey.value += 1
        if (taxExemptDataCount.value === 1 && totalPlanCount === 1) {
          if (searchText.value) {
            store.state.finderList.zipcode = taxExemptData.value[0].Zip
            store.state.finderList.plan = plan.value
            store.state.finderList.EIN = EIN.value
            store.state.finderList.searchRadius = 10
            store.state.finderList.prospectValue = 7
            store.state.finderList.searchTypeSelected = 'TaxExempt'
            router.push(
              `/TAL/TaxExempt?Id=${taxExemptData.value[0].EIN}&zipcode=${
                taxExemptData.value[0].Zip ? taxExemptData.value[0].Zip : null
              }&radius=${searchRadius.value ? searchRadius.value : 0}&name=${taxExemptData.value[0].Name}`
            )
          }
        }
        // if (advanceFilter.value) {
        //   advanceFilter.value.getTaxExemptFilterChips()
        //   advanceFilter.value.setStoreValues()
        // }
      }
      if (showIndividuals.value && prospectTab.value === 4) {
        totalPlanCount = individualDataCount.value
        store.state.finderList.individualSearchResult = individualData.value
        store.state.finderList.individualDataCount = individualDataCount.value
        store.state.finderList.individualData = individualData.value
        store.state.finderList.individualPage = individualPage.value ? individualPage.value : 1
        componentindividualKey.value += 1
        if (individualDataCount.value === 1 && totalPlanCount === 1) {
          if (searchText.value) {
            store.state.finderList.zipcode = individualData.value[0].individualAccounts[0].accountZipCode
            store.state.finderList.plan = plan.value
            store.state.finderList.EIN = EIN.value
            store.state.finderList.searchRadius = 10
            store.state.finderList.prospectValue = 4
            store.state.finderList.searchTypeSelected = 'Individual'
            router.push(
              `/TAL/HouseholdResult?householdId=${individualData.value[0].householdId}&zipcode=${
                zipcode.value ? zipcode.value : null
              }&radius=${searchRadius.value ? searchRadius.value : 0}`
            )
          }
        }
        if (advanceFilter.value) {
          advanceFilter.value.getIndividualFilterChips()
          advanceFilter.value.setStoreValues()
        }
      }

      mapFinder.value.GoogleMap()
      getGoogleMap()

      if (totalPlanCount === 0 && val === 'search') {
        toast.info('No results found. Please refine your search criteria.', '')
      } else {
        if (prospectTab.value === 0 && totalPlanCount > 0) {
          employeeSponsorPage.value++
        } else if (prospectTab.value === 2 && totalPlanCount > 0) {
          municipalPage.value++
        } else if (prospectTab.value === 3 && totalPlanCount > 0) {
          churchPage.value++
        } else if (prospectTab.value === 4 && totalPlanCount > 0) {
          individualPage.value++
        } else if (prospectTab.value === 7 && totalPlanCount > 0) {
          taxExemptPage.value++
        }
      }
      searchLoading.value = false
    }

    const assignSchoolCount = (result) => {
      schoolData.value = result ? result : []
      schoolDataCount.value = result ? result.length : 0
      store.state.finderList.schoolDataCount = schoolDataCount.value
      store.state.finderList.schoolSearchResult = result ? result : []
      getSchoolMap()
      advanceFilterModel.value = false
      searchLoading.value = false
    }

    const schoolDetailPage = (schoolDistrictId, zipcode) => {
      if (showSchool.value) {
        updateFinderModel()
        store.state.finderList.prospectValue = 1
        router.push({
          query: {
            schoolDistId: schoolDistrictId,
            zipcode: zipcode ? zipcode : zipcode,
            radius: 50,
            type: 'SchoolDistrict'
          },
          name: 'SchoolAccountDetails',
          params: {
            lastRoute: route.path
          }
        })
      }
    }

    const getStarredValue = async (val) => {
      resetMarker()
      if (showStarred.value) {
        searchLoading.value = val
        if (val) favoriteList.value = []
        var starredPromise = []
        mapFinder.value.setCenterPin(store.state.user.zipCode)
        if (showEmployerSponsored.value) {
          var starredPlans = store.state.starredPlansSearchRequest.planSearchRequest
            ? store.state.starredPlansSearchRequest.planSearchRequest.einList
            : []
          starredPlans = starredPlans.filter((n) => n)
          var planResult = []
          var individualValue = []
          var schoolValue = []
          var municipalValue = []
          var churchValue = []
          var taxExemptValue = []
          if (starredPlans && starredPlans.length > 0) {
            var searchRequest = store.state.starredPlansSearchRequest.planSearchRequest
            searchRequest.retrieveResultCountOnly = false
            starredPromise.push(
              $axios.post(`/api/v1/tal/plan/search`, searchRequest).then((success) => {
                planResult =
                  success.data.d && success.data.d.results && success.data.d.results.length > 0 ? success.data.d.results : []
                if (planResult && planResult.length > 0) {
                  planReports.value.forEach((a) => {
                    a.loader = false
                  })
                  let proposalReport = planReports.value.slice()
                  if (proposalReport && proposalReport.length > 0) {
                    let expressDiagnosticPosition = proposalReport.findIndex((a) => a.value === 'Express Diagnostic')
                    if (expressDiagnosticPosition > -1) proposalReport.splice(expressDiagnosticPosition, 1)
                    let diagnosticPosition = proposalReport.findIndex((a) => a.value === 'Diagnostic')
                    if (diagnosticPosition > -1) proposalReport.splice(diagnosticPosition, 1)
                    let rpeaPosition = proposalReport.findIndex((a) => a.value === 'RPEA')
                    if (rpeaPosition > -1) proposalReport.splice(rpeaPosition, 1)
                  }

                  planResult.map((element) => {
                    if (
                      element.DCPTYPE === $authz.planType.Defined_Contribution_Plan ||
                      element.DCPTYPE === $authz.planType.ERISA_403_b
                    ) {
                      element['selectreport'] = planReports.value && planReports.value.length > 0 ? planReports.value : []
                    } else {
                      element['selectreport'] = proposalReport && proposalReport.length > 0 ? proposalReport : []
                    }
                  })
                  planResult.map((element, index) => {
                    element['isMarker'] = true
                    element['markerIndex'] = index
                  })
                  planResult.forEach((element) => {
                    element.customerType = 'Employer Sponsored'
                    element.favoriteId = element.SEINPNO
                  })
                  mapFinder.value.setProspectMarker(planResult, 'Employer Sponsored')
                }
              })
            )
          }
        }
        if (showSchool.value) {
          var starredSchoolPlans = store.state.starredPlansSearchRequest.planSearchRequest
            ? store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList
            : []
          starredSchoolPlans = starredSchoolPlans.filter((n) => n)
          if (starredSchoolPlans && starredSchoolPlans.length > 0) {
            starredPromise.push(
              $axios.post(`/api/v1/school/starredprospects`, starredSchoolPlans).then((success) => {
                schoolValue =
                  success.data.d && success.data.d.schooldistrictData && success.data.d.schooldistrictData.length > 0
                    ? success.data.d.schooldistrictData
                    : []
                if (schoolValue && schoolValue.length > 0) {
                  schoolValue.forEach((element) => {
                    element.customerType = 'Schools'
                    element.favoriteId = element.id
                  })
                  for (var i = 0; i < schoolValue.length; i++) {
                    if (schoolValue[i].schools && schoolValue[i].schools.length > 0) {
                      for (var j = 0; j < schoolValue[i].schools.length; j++) {
                        schoolValue[i].schools[j].payrollSlot = schoolValue[i].payrollSlot
                      }
                    }
                  }
                  mapFinder.value.setSchoolDistrictMarker(schoolValue, 'Schools')
                }
              })
            )
          }
        }
        if (showIndividuals.value) {
          var starredIndividualPlans = store.state.starredPlansSearchRequest.planSearchRequest
            ? store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList
            : []
          starredIndividualPlans = starredIndividualPlans.filter((n) => n)
          if (starredIndividualPlans && starredIndividualPlans.length > 0) {
            starredPromise.push(
              $axios.post(`/api/v1/individual/starredprospects`, starredIndividualPlans).then((success) => {
                individualValue =
                  success.data.d && success.data.d.individualData && success.data.d.individualData.length > 0
                    ? success.data.d.individualData
                    : []
                if (individualValue.length > 0) {
                  individualValue.map((element) => {
                    element['actionList'] = actionList.value && actionList.value.length > 0 ? actionList.value : []
                  })
                  individualValue.forEach((element) => {
                    element.customerType = 'Individuals'
                    element.favoriteId = element.householdId
                  })
                  mapFinder.value.setIndividualHouseholdMarker(individualValue, 'Individuals')
                }
              })
            )
          }
        }
        if (showMunicipalities.value) {
          var starredMunicipalPlans = store.state.starredPlansSearchRequest.planSearchRequest
            ? store.state.starredPlansSearchRequest.planSearchRequest.municipalIdList
            : []
          starredMunicipalPlans = starredMunicipalPlans.filter((n) => n)
          if (starredMunicipalPlans && starredMunicipalPlans.length > 0) {
            starredPromise.push(
              $axios.post(`/api/v1/municipal/starredprospects`, starredMunicipalPlans).then((success) => {
                municipalValue = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d : []
                if (municipalValue.length > 0) {
                  municipalValue.forEach((element) => {
                    element.customerType = 'Municipalities'
                    element.favoriteId = element.DepartmentId
                  })
                  mapFinder.value.setMunicipalMarker(municipalValue, 'Municipalities')
                }
              })
            )
          }
          var starredChurchPlans = store.state.starredPlansSearchRequest.planSearchRequest
            ? store.state.starredPlansSearchRequest.planSearchRequest.churchIdList
            : []
          starredChurchPlans = starredChurchPlans.filter((n) => n)
          if (starredChurchPlans && starredChurchPlans.length > 0) {
            starredPromise.push(
              $axios.post(`/api/v1/church/starredprospects`, starredChurchPlans).then((success) => {
                churchValue =
                  success.data.d && success.data.d.churchData && success.data.d.churchData.length > 0
                    ? success.data.d.churchData
                    : []
                if (churchValue.length > 0) {
                  churchValue.forEach((element) => {
                    element.customerType = 'Churches'
                    element.favoriteId = element.Id
                  })
                  mapFinder.value.setChurchMarker(churchValue, 'Church')
                }
              })
            )
          }
          var starredTaxExemptPlans = store.state.starredPlansSearchRequest.planSearchRequest
            ? store.state.starredPlansSearchRequest.planSearchRequest.taxExemptIdList
            : []
          starredTaxExemptPlans = starredTaxExemptPlans.filter((n) => n)
          if (starredTaxExemptPlans && starredTaxExemptPlans.length > 0) {
            starredPromise.push(
              $axios.post(`/api/v1/taxexempt/starredprospects`, starredTaxExemptPlans).then((success) => {
                taxExemptValue = success.data.d && success.data.d && success.data.d.length > 0 ? success.data.d : []
                if (taxExemptValue.length > 0) {
                  taxExemptValue.forEach((element) => {
                    element.customerType = 'TaxExempt'
                    element.favoriteId = element.EIN
                  })
                  mapFinder.value.setTaxExemptMarker(taxExemptValue, 'TaxExempt')
                }
              })
            )
          }
        }
        await Promise.allSettled(starredPromise)
        favoriteList.value = planResult ? planResult : []
        if (schoolValue && schoolValue.length > 0) Array.prototype.push.apply(favoriteList.value, schoolValue)
        if (individualValue && individualValue.length > 0) Array.prototype.push.apply(favoriteList.value, individualValue)
        if (municipalValue && municipalValue.length > 0) Array.prototype.push.apply(favoriteList.value, municipalValue)
        if (churchValue && churchValue.length > 0) Array.prototype.push.apply(favoriteList.value, churchValue)
        if (taxExemptValue && taxExemptValue.length > 0) Array.prototype.push.apply(favoriteList.value, taxExemptValue)
        componentFavouriteKey.value += 1
        searchLoading.value = false
      }
    }

    const searchZipcode = (lat, lng) => {
      loading.value = true
      $axios
        .get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'jsonv2',
            lat: lat,
            lon: lng
          }
        })
        .then((success) => {
          zipcode.value =
            success.data && success.data.address != null && success.data.address.postcode
              ? success.data.address.postcode
              : store.state.user.zipCode
        })
    }

    const getClientData = () => {
      if (store.state.user.reliusLoginId) {
        showClient.value = true
        searchLoading.value = true
        $axios
          .get(`/api/v1/retention/rbc/myclients?page=${clientPage.value}&searchCriteria=${searchText.value}`)
          .then((success) => {
            var clientResult =
              success.data.d && success.data.d.clientsData && success.data.d.clientsData.length > 0
                ? success.data.d.clientsData
                : []
            if (clientResult && clientResult.length > 0) {
              clientResult.forEach((element) => {
                element.customerType = 'Employer Sponsored'
                element.clientId = element.PLANID
              })
              if (!searchText.value) {
                Array.prototype.push.apply(clientList.value, clientResult)
                clientPage.value++
              } else {
                clientList.value = clientResult
                clientPage.value = 1
              }
            } else clientList.value = clientResult
            mapFinder.value.setCenterPin(store.state.user.zipCode)
            if (clientList.value && clientList.value.length > 0) {
              mapFinder.value.setClientProspectMarker(clientList.value, 'Employer Sponsored')
            }
            totalClientPlans.value = clientList.value && clientList.value.length > 0 ? clientList.value.length : -1
            if (searchText.value) {
              clientDataCount.value = clientList.value && clientList.value.length > 0 ? clientList.value.length : 0
            } else {
              clientDataCount.value =
                success.data.d && success.data.d.clientsCount && success.data.d.clientsCount.length > 0
                  ? success.data.d.clientsCount[0].ClientsCount
                  : 0
            }
            store.state.finderList.clientPage = clientPage.value
            store.state.finderList.clientPlanCount = clientDataCount.value
            store.state.finderList.clientData = clientList.value
            if (clientDataCount.value === 1 && clientList.value.length > 0) {
              if (searchText.value) {
                store.state.finderList.zipcode = clientList.value[0].PlanSponsorBillingPostalCode
                store.state.finderList.plan = plan.value
                store.state.finderList.EIN = EIN.value
                store.state.finderList.searchRadius = 10
                store.state.finderList.prospectValue = 6
                store.state.finderList.searchTypeSelected = 'Client'
                router.push(`/Retention/Plan/${clientList.value[0].PLANID}`)
              }
            }
            componentClientKey.value += 1
            searchLoading.value = false
          })
          .catch(() => {
            searchLoading.value = false
          })
      }
    }

    const indiviudalIntersected = async () => {
      if (searchLoading.value) {
        if (parseInt(individualPage.value) > 1) {
          if (searchText.value) {
            if (individualData.value && individualData.value.length > 0) {
              if (totalIndividualPlans.value < individualDataCount.value) {
                applyFilter('nextPage')
              }
            }
          }
        }
      }
    }

    const clientIntersected = async () => {
      if (!searchLoading.value) {
        if (parseInt(clientPage.value) > 1) {
          if (!searchText.value) {
            if (clientList.value && clientList.value.length > 0) {
              if (totalClientPlans.value < clientDataCount.value) {
                getClientData()
              }
            }
          }
        }
      }
    }

    const municipalIntersected = async () => {
      if (!searchLoading.value) {
        if (parseInt(municipalPage.value) > 1) {
          if (!searchText.value) {
            if (municipalData.value && municipalData.value.length > 0) {
              if (totalMunicipalPlans.value < municipalDataCount.value) {
                applyFilter('nextPage')
              }
            }
          }
        }
      }
    }
    const churchIntersected = async () => {
      if (!searchLoading.value) {
        if (parseInt(churchPage.value) > 1) {
          if (!searchText.value) {
            if (churchData.value && churchData.value.length > 0) {
              if (totalChurchPlans.value < churchDataCount.value) {
                applyFilter('nextPage')
              }
            }
          }
        }
      }
    }
    const taxExemptIntersected = async () => {
      if (!searchLoading.value) {
        if (parseInt(taxExemptPage.value) > 1) {
          if (!searchText.value) {
            if (taxExemptData.value && taxExemptData.value.length > 0) {
              if (totalTaxExemptPlans.value < taxExemptDataCount.value) {
                applyFilter('nextPage')
              }
            }
          }
        }
      }
    }
    const clearSaveSearch = () => {
      showEditSearch.value = false
      if (route.query.saveSearch) {
        router.replace({ query: null })
      }
    }
    const handleScroll = () => {
      hideCard.value = false
      if (document.getElementById('banner')) {
        if (document.getElementById('finderTable'))
          document.getElementById('finderTable').style.marginTop = `${document.getElementById('banner').clientHeight}px`
      }
    }
    const updateFinderModel = () => {
      if (Object.keys(store.state.finderList).length > 0) {
        showStarred.value = store.state.finderList.showStarred
        showMap.value = store.state.finderList.showMap
        zipcode.value = store.state.finderList.zipcode
        searchRadius.value = store.state.finderList.searchRadius ? store.state.finderList.searchRadius : 5
        let radiusExist = radiusList.value.filter((a) => a.value === searchRadius.value)
        if (radiusExist && radiusExist.length === 0) {
          let newRadiusValue = {
            text: `within ${searchRadius.value} miles`,
            value: searchRadius.value
          }
          radiusList.value.push(newRadiusValue)
          radiusList.value = radiusList.value.sort(function (a, b) {
            return a.value - b.value
          })
        }

        if (store.state.finderList.searchTypeSelected === 'EmployeeSponsor' && prospectTab.value === 0) {
          plan.value = store.state.finderList.plan
          EIN.value = store.state.finderList.EIN
          if (plan.value) searchText.value = plan.value
          if (EIN.value) searchText.value = EIN.value
        } else if (store.state.finderList.searchTypeSelected === 'Schools' && prospectTab.value === 1) {
          searchText.value = store.state.finderList.plan ? store.state.finderList.plan : ''
        } else if (store.state.finderList.searchTypeSelected === 'Municipalities' && prospectTab.value === 2) {
          searchText.value = store.state.finderList.plan ? store.state.finderList.plan : ''
        } else if (store.state.finderList.searchTypeSelected === 'Churches' && prospectTab.value === 3) {
          searchText.value = store.state.finderList.plan ? store.state.finderList.plan : ''
        } else if (store.state.finderList.searchTypeSelected === 'Individual' && prospectTab.value === 4) {
          searchText.value = store.state.finderList.plan ? store.state.finderList.plan : ''
        } else if (store.state.finderList.searchTypeSelected === 'TaxExempt' && prospectTab.value === 7) {
          searchText.value = store.state.finderList.plan ? store.state.finderList.plan : ''
        } else if (store.state.finderList.searchTypeSelected === 'Client' && prospectTab.value === 6) {
          searchText.value = store.state.finderList.plan ? store.state.finderList.plan : ''
        } else {
          searchText.value = ''
          plan.value = ''
          EIN.value = ''
        }

        showSearch.value = searchText.value ? true : false
        searchResult.value = store.state.finderList.searchResult ? store.state.finderList.searchResult : []
        individualData.value = store.state.finderList.individualData ? store.state.finderList.individualData : []
        individualDataCount.value = store.state.finderList.individualDataCount ? store.state.finderList.individualDataCount : 0
        schoolData.value = store.state.finderList.schoolData ? store.state.finderList.schoolData : []
        schoolDataCount.value = store.state.finderList.schoolDataCount ? store.state.finderList.schoolDataCount : 0
        municipalData.value = store.state.finderList.municipalData ? store.state.finderList.municipalData : []
        municipalDataCount.value = store.state.finderList.municipalDataCount ? store.state.finderList.municipalDataCount : 0
        churchData.value = store.state.finderList.churchData ? store.state.finderList.churchData : []
        churchDataCount.value = store.state.finderList.churchDataCount ? store.state.finderList.churchDataCount : 0
        taxExemptData.value = store.state.finderList.taxExemptData ? store.state.finderList.taxExemptData : []
        taxExemptDataCount.value = store.state.finderList.taxExemptDataCount ? store.state.finderList.taxExemptDataCount : 0
        savePlans.value = searchResult.value
        constantPlanCount.value = store.state.finderList.constantPlanCount ? store.state.finderList.constantPlanCount : 0
        clientList.value = store.state.finderList.clientData ? store.state.finderList.clientData : []
        clientDataCount.value = store.state.finderList.clientPlanCount ? store.state.finderList.clientPlanCount : 0
        if (prospectTab.value === 0) {
          employeeSponsorPage.value = store.state.finderList.employeeSponsorPage
            ? store.state.finderList.employeeSponsorPage + 1
            : 1
        }
        if (prospectTab.value === 2) {
          municipalPage.value = store.state.finderList.municipalPage ? store.state.finderList.municipalPage + 1 : 1
        }
        if (prospectTab.value === 3) {
          churchPage.value = store.state.finderList.churchPage ? store.state.finderList.churchPage + 1 : 1
        }
        if (prospectTab.value === 4) {
          individualPage.value = store.state.finderList.individualPage ? store.state.finderList.individualPage + 1 : 1
        }
        if (prospectTab.value === 6) {
          clientPage.value = store.state.finderList.clientPage ? store.state.finderList.clientPage : 1
        }
        if (prospectTab.value === 7) {
          taxExemptPage.value = store.state.finderList.taxExemptPage ? store.state.finderList.taxExemptPage + 1 : 1
        }
        componentBookmarkKey.value += 1
        eventBus.emit('refreshBookMark')
        if (constantPlanCount.value === 0 && searchResult.value.length === 0 && prospectTab.value === 0) {
          employeeSponsorPage.value = 1
          resetMarker()
          applyFilter('search')
        } else if (schoolDataCount.value === 0 && schoolData.value.length === 0 && prospectTab.value === 1) {
          resetMarker()
          applyFilter('search')
        } else if (individualDataCount.value === 0 && individualData.value.length === 0 && prospectTab.value === 4) {
          individualPage.value = 1
          resetMarker()
          applyFilter('search')
        } else if (municipalDataCount.value === 0 && municipalData.value.length === 0 && prospectTab.value === 2) {
          municipalPage.value = 1
          resetMarker()
          applyFilter('search')
        } else if (churchDataCount.value === 0 && churchData.value.length === 0 && prospectTab.value === 3) {
          churchPage.value = 1
          resetMarker()
          applyFilter('search')
        } else if (taxExemptDataCount.value === 0 && taxExemptData.value.length === 0 && prospectTab.value === 7) {
          taxExemptPage.value = 1
          resetMarker()
          applyFilter('search')
        } else if (prospectTab.value === 5) {
          searchRadius.value = 0
          zipcode.value = ''
          showSearch.value = false
          showStarred.value = true
          mapFinder.value.GoogleMap()
          getGoogleMap()
          getStarredValue(true)
        } else if (prospectTab.value === 6) {
          mapFinder.value.GoogleMap()
          getGoogleMap()
          searchRadius.value = 0
          zipcode.value = ''
          showSearch.value = true
          showStarred.value = false
          showClient.value = true
          if (clientDataCount.value === 0 && clientList.value.length === 0) {
            resetMarker()
            clientPage.value = 1
            getClientData()
          }
        } else {
          if (searchText.value) {
            mapFinder.value.GoogleMap()
            getGoogleMap()
          } else {
            if (Object.keys(store.state.finderList).length > 0) {
              mapFinder.value.GoogleMap()
              getGoogleMap()
            }
          }
        }
      } else {
        if (zipcode.value && !searchText.value && zipcode.value !== 'Current Location') {
          applyFilter('search')
        } else if ((!zipcode.value || zipcode.value === 'Current Location') && !searchText.value) {
          store.dispatch('getUser').then(() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
            }
          })
        }
      }
    }
    const getCustomerType = () => {
      if (searchText.value) {
        searchText.value = ''
        plan.value = ''
        EIN.value = ''
        filterPlans.value = []
        filterSchools.value = []
        filterIndividual.value = []
      }
      showClient.value = false
      if (prospectTab.value === 5) {
        searchRadius.value = 0
        zipcode.value = ''
        showSearch.value = false
        showStarred.value = true
        store.state.finderList.prospectValue = prospectTab.value
        store.state.finderList.showStarred = showStarred.value
        mapFinder.value.GoogleMap()
        getGoogleMap()
        getStarredValue(true)
      } else if (prospectTab.value === 6) {
        searchRadius.value = 0
        zipcode.value = ''
        showSearch.value = true
        showStarred.value = false
        showClient.value = true
        store.state.finderList.prospectValue = prospectTab.value
        store.state.finderList.showStarred = showStarred.value
        clientList.value = []
        resetMarker()
        getClientData()
      } else {
        if (route.query.showStarred) {
          router.replace({ query: null })
        }
        store.state.finderList.showStarred = false
        showStarred.value = false
        store.state.finderList.prospectValue = prospectTab.value
        updateFinderModel()
      }
    }
    const mapHighlight = (seinpno) => {
      if (display.mdAndUp.value) mapFinder.value.highlightMarker(seinpno)
    }
    const mapFinderInfo = () => {
      var mapReference = mapFinder.value
      return mapReference
    }
    ///Autocomplete Start
    const clearFilter = (val) => {
      if (advanceFilter.value) {
        if (prospectTab.value === 0) {
          advanceFilter.value.filterChips.forEach((element) => {
            advanceFilter.value[element.modelName] = element.defaultValue
          })
        } else if (prospectTab.value === 1) {
          advanceFilter.value.schoolChips.forEach((element) => {
            advanceFilter.value[element.modelName] = element.defaultValue
          })
          advanceFilter.value.getSchoolFilterChips()
          advanceFilter.value.setStoreValues()
        } else if (prospectTab.value === 2) {
          advanceFilter.value.municipalChips.forEach((element) => {
            advanceFilter.value[element.modelName] = element.defaultValue
          })
        } else if (prospectTab.value === 3) {
          advanceFilter.value.churchChips.forEach((element) => {
            advanceFilter.value[element.modelName] = element.defaultValue
          })
        } else if (prospectTab.value === 4) {
          advanceFilter.value.individualChips.forEach((element) => {
            advanceFilter.value[element.modelName] = element.defaultValue
          })
        } else if (prospectTab.value === 7) {
          advanceFilter.value.taxExemptChips.forEach((element) => {
            advanceFilter.value[element.modelName] = element.defaultValue
          })
        }
        if (prospectTab.value !== 1) {
          if (val) {
            resetData()
            applyFilter('filter')
          }
        }
        clearSaveSearch()
      }
    }
    const showHideSearch = () => {
      showSearch.value = !showSearch.value
      if (showSearch.value === false) {
        if (Object.keys(store.state.finderList).length > 0) {
          zipcode.value = store.state.finderList.zipcode
          searchRadius.value = store.state.finderList.searchRadius ? store.state.finderList.searchRadius : 5
          searchText.value = ''
          plan.value = ''
          EIN.value = ''
        } else {
          if (zipcode.value && !searchText.value && zipcode.value !== 'Current Location') {
            applyFilter('search')
          } else if ((!zipcode.value || zipcode.value === 'Current Location') && !searchText.value) {
            store.dispatch('getUser').then(() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
              }
            })
          }
        }
      } else {
        clearFilter(false)
        if (advanceFilter.value) {
          advanceFilter.value.getFilterChips()
          advanceFilter.value.setStoreValues()
        }
      }
    }
    const searchBlur = (val) => {
      if (val) {
        EIN.value = searchText.value
        plan.value = ''
      } else {
        EIN.value = ''
        plan.value = searchText.value
      }
    }
    const getAddress = async (zipcode) => {
      var request = new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode}` }, (results, status) => {
          // console.log('Zero' + google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
          if (status === 'OK') {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.exec(zipcode)) {
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
              resolve(true)
            } else {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Invalid Zip Code'
              reject(false)
            }
          } else {
            // eslint-disable-next-line no-undef
            if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
              resolve(true)
            } else {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Invalid Zip Code'
              reject(false)
            }
          }
        })
      })
      var result = request
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err
        })
      return result
    }
    const resetData = () => {
      if (prospectTab.value === 0) {
        employeeSponsorPage.value = 1
        searchResult.value = []
        totalPlans.value = -1
      } else if (prospectTab.value === 2) {
        municipalPage.value = 1
        municipalData.value = []
        municipalSearchResult.value = []
        totalMunicipalPlans.value = -1
      } else if (prospectTab.value === 3) {
        churchPage.value = 1
        churchData.value = []
        churchSearchResult.value = []
        totalChurchPlans.value = -1
      } else if (prospectTab.value === 4) {
        individualPage.value = 1
        individualData.value = []
        individualSearchResult.value = []
        totalIndividualPlans.value = -1
      } else if (prospectTab.value === 7) {
        taxExemptPage.value = 1
        taxExemptData.value = []
        taxExemptSearchResult.value = []
        totalTaxExemptPlans.value = -1
      }
    }
    const formatPrice = (labelValue) => {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
        : // Six Zeroes for Millions
          Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
          : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : Math.abs(Number(labelValue))
    }
    const checkCurrentLocation = async (from) => {
      if (from === 'search') {
        if (!zipcode.value && !searchText.value) {
          zipcodeError.value = true
          zipcodeErrorMsg.value = 'Zip code is a required field'
          return
        } else if (!searchRadius.value) {
          searchRadius.value = 5
        } else {
          zipcodeError.value = false
          zipcodeErrorMsg.value = ''
        }
      }
      if (zipcode.value && zipcode.value !== 'Current Location') {
        var isValidZip = await getAddress(zipcode.value)
        if (!isValidZip) return
      }
      if (zipcode.value === 'Current Location') {
        if (route.query.saveSearch) {
          clearSaveSearch()
        }
        if (
          prospectTab.value === 0 ||
          prospectTab.value === 2 ||
          prospectTab.value === 3 ||
          prospectTab.value === 4 ||
          prospectTab.value === 7
        ) {
          resetData()
        }
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              getZipcode(position, from)
            },
            // eslint-disable-next-line no-unused-vars
            (error) => {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Location could not be determined'
              loading.value = false
            }
          )
        }
      } else {
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
        if (from === 'search') {
          clearSaveSearch()
          if (
            prospectTab.value === 0 ||
            prospectTab.value === 2 ||
            prospectTab.value === 3 ||
            prospectTab.value === 4 ||
            prospectTab.value === 7
          ) {
            resetData()
          }
          if (prospectTab.value === 6) {
            clientPage.value = 1
            clientList.value = []
            totalClientPlans.value = -1
            clientDataCount.value = 0
            resetMarker()
            getClientData()
          } else {
            applyFilter('search')
          }
        }
      }
    }
    const getPlanValue = (val) => {
      searchText.value = val.Name
      plan.value = val.Name
      filterPlans.value = []
      filterSchools.value = []
      filterIndividual.value = []
      filterMunicipal.value = []
      filterChurch.value = []
      filterTaxExempt.value = []
      if (prospectTab.value === 6) {
        resetMarker()
        getClientData()
      } else {
        checkCurrentLocation('search')
      }
    }
    const getPlanResults = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/tal/plan/autocomplete/plan/${event.target.value}`
        }
        let res = await $axios(config)
        filterPlans.value = res.data.d
        filterPlans.value.forEach((a) => {
          a.Name = a.name
          delete a.name
        })
      } else hideCard.value = false
    }
    const getSchoolResults = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/school/${event.target.value}`
        }
        let res = await $axios(config)
        filterSchools.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    const getMunicipalResults = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/municipal/${event.target.value}`
        }
        let res = await $axios(config)
        filterMunicipal.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    const getChurchResults = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/church/${event.target.value}`
        }
        let res = await $axios(config)
        filterChurch.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    const getIndividualResults = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/tal/individual/autocomplete/${event.target.value}`
        }
        let res = await $axios(config)
        filterIndividual.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    const getClientPlans = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/rbc/autocomplete/plan/${event.target.value}`
        }
        let res = await $axios(config)
        var response = res.data.d && res.data.d.length > 0 ? res.data.d : []
        if (response.length > 0) {
          response = response.filter((b) => b.PlanBusinessType)
          if (showEmployerSponsored.value) {
            filterPlans.value = response.filter((a) => a.PlanBusinessType === 'Employer Sponsored')
          }
        } else {
          filterPlans.value = []
          filterSchools.value = []
          filterIndividual.value = []
          hideCard.value = false
        }
      } else hideCard.value = false
    }
    const getTaxExemptResults = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/taxexempt/${event.target.value}`
        }
        let res = await $axios(config)
        filterTaxExempt.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    const getCurrentLocation = () => {
      zipcode.value = 'Current Location'
      checkCurrentLocation('current_location')
    }
    const checkFields = (val) => {
      switch (val) {
        case 'company':
          EIN.value = ''
          zipcode.value = ''
          zipcodeError.value = false
          zipcodeErrorMsg.value = ''
          searchRadius.value = 0
          showStarred.value = false
          if (searchText.value === '') {
            filterPlans.value = []
            filterSchools.value = []
            filterIndividual.value = []
            filterMunicipal.value = []
            filterChurch.value = []
            filterTaxExempt.value = []
          }
          if (prospectTab.value === 0) {
            getPlanResults()
          } else if (prospectTab.value === 1) {
            getSchoolResults()
          } else if (prospectTab.value === 2) {
            getMunicipalResults()
          } else if (prospectTab.value === 3) {
            getChurchResults()
          } else if (prospectTab.value === 4) {
            getIndividualResults()
          } else if (prospectTab.value === 6) {
            getClientPlans()
          } else if (prospectTab.value === 7) {
            getTaxExemptResults()
          }
          break
        case 'location':
          plan.value = ''
          EIN.value = ''
          searchText.value = ''
          showStarred.value = false
          filterPlans.value = []
          filterSchools.value = []
          filterIndividual.value = []
          break
        case 'radius':
          plan.value = ''
          EIN.value = ''
          if (zipcode.value === 'Current Location') {
            getCurrentLocation()
          } else {
            zipcodeError.value = true
            zipcodeErrorMsg.value = 'Location could not be determined'
          }
          break
        default:
          break
      }
    }
    const searchAreaFocusOut = () => {
      hideCard.value = false
      filterPlans.value = []
      filterSchools.value = []
      filterIndividual.value = []
      filterMunicipal.value = []
      filterChurch.value = []
      filterTaxExempt.value = []
    }
    const closeSavedSearch = () => {
      savedSearches.value = false
    }
    const showSavedSearch = () => {
      savedSearches.value = true
    }
    const openAdvanceFilter = () => {
      advanceFilter.value.updateModels()
      advanceFilterModel.value = true
    }
    const openSavedSearches = () => {
      if (showEditSearch.value) {
        openAdvanceFilter()
      } else {
        saveSearchDialog.value = true
        componentSearchKey.value += 1
      }
    }
    const closeSaveSearch = () => {
      saveSearchDialog.value = false
    }
    const getPlanDetail = (val) => {
      hideCard.value = false
      searchLoading.value = true
      var searchCriteria = null
      showStarred.value = false
      $axios.get(`/api/v1/tal/plan/searchrequests`).then((success) => {
        searchCriteria = success.data.length > 0 ? success.data.find((a) => a.searchName === val) : null
        if (searchCriteria) {
          prospectTab.value =
            searchCriteria.saveSearchType === 'Employer Sponsored'
              ? 0
              : searchCriteria.saveSearchType === 'Schools'
                ? 1
                : searchCriteria.saveSearchType === 'Municipalities'
                  ? 2
                  : searchCriteria.saveSearchType === 'Churches'
                    ? 3
                    : searchCriteria.saveSearchType === 'Individuals'
                      ? 4
                      : searchCriteria.saveSearchType === 'TaxExempt'
                        ? 7
                        : 0
          zipcode.value = searchCriteria.planSearchRequest.zipCode
          plan.value = searchCriteria.planSearchRequest.plan
          EIN.value = searchCriteria.planSearchRequest.ein
          let radiusValue = searchCriteria.planSearchRequest.searchRadius ? searchCriteria.planSearchRequest.searchRadius : 5
          let radiusExist = radiusList.value.filter((a) => a.value === radiusValue)
          if (radiusExist && radiusExist.length === 0) {
            let newRadiusValue = {
              text: `within ${radiusValue} miles`,
              value: radiusValue
            }
            radiusList.value.push(newRadiusValue)
            radiusList.value = radiusList.value.sort(function (a, b) {
              return a.value - b.value
            })
          }
          searchRadius.value = radiusValue
          store.state.finderList.advanceFilter = searchCriteria.planSearchRequest
          store.state.finderList.advanceFilter.schoolType = searchCriteria.schoolSearchRequest.schoolType
          store.state.finderList.advanceFilter.employee = searchCriteria.schoolSearchRequest.employee
          store.state.finderList.advanceFilter.tpa = searchCriteria.schoolSearchRequest.tpa
          store.state.finderList.advanceFilter.payroll = searchCriteria.schoolSearchRequest.payroll
          store.state.finderList.advanceFilter.payrollOwner = searchCriteria.schoolSearchRequest.payrollOwner
          store.state.finderList.advanceFilter.hasLoan = searchCriteria.individualSearchRequest.hasLoan
          store.state.finderList.advanceFilter.employmentStatus = searchCriteria.individualSearchRequest.employmentStatus
          store.state.finderList.advanceFilter.planStatus = searchCriteria.individualSearchRequest.planStatus
          store.state.finderList.advanceFilter.equityAllocation = searchCriteria.individualSearchRequest.equityAllocation
            ? searchCriteria.individualSearchRequest.equityAllocation
            : ''
          // store.state.finderList.advanceFilter.individualStatus =
          //   searchCriteria.individualSearchRequest.individualStatus
          store.state.finderList.advanceFilter.participantValue = searchCriteria.individualSearchRequest.participantValue
          store.state.finderList.advanceFilter.contributionRate = searchCriteria.individualSearchRequest.contributionRate
          store.state.finderList.advanceFilter.accountBalance = searchCriteria.individualSearchRequest.accountBalance
          advanceFilter.value.updateModels()
          applyFilter('applyFilter')
        }
      })
    }
    const saveSearchCriteria = (saveSearchName, showOnAcquisition) => {
      saveSearchDialog.value = false
      planSearchRequest.value = advanceFilter.value.getPlanSearchRequest()
      planSearchRequest.value.searchRadius = searchRadius.value ? searchRadius.value : 0
      planSearchRequest.value.zipCode = !zipcode.value ? null : zipcode.value
      planSearchRequest.value.plan = !plan.value ? null : plan.value
      planSearchRequest.value.ein = !EIN.value ? null : EIN.value
      planSearchRequest.value.planCount = constantPlanCount.value && prospectTab.value === 0 ? constantPlanCount.value : 0

      let schoolSearchRequest = advanceFilter.value.getSchoolSearchRequest()
      schoolSearchRequest.schoolCount = schoolDataCount.value && prospectTab.value === 1 ? schoolDataCount.value : 0
      let municipalSearchRequest = advanceFilter.value.getMunicipalSearchRequest()
      municipalSearchRequest.municipalCount = municipalDataCount.value && prospectTab.value === 2 ? municipalDataCount.value : 0
      let churchSearchRequest = advanceFilter.value.getChurchSearchRequest()
      churchSearchRequest.churchCount = churchDataCount.value && prospectTab.value === 3 ? churchDataCount.value : 0
      let taxExemptSearchRequest = advanceFilter.value.getTaxExemptSearchRequest()
      taxExemptSearchRequest.taxExemptCount = taxExemptDataCount.value && prospectTab.value === 7 ? taxExemptDataCount.value : 0
      let individualSearchRequest = advanceFilter.value.getIndividualSearchRequest()
      if (individualSearchRequest && individualSearchRequest.equityAllocation === '') {
        individualSearchRequest.equityAllocation = 0
      }
      individualSearchRequest.individualCount =
        individualDataCount.value && prospectTab.value === 4 ? individualDataCount.value : 0

      var saveUserSearchValue = {
        SearchName: saveSearchName,
        PlanSearchRequest: planSearchRequest.value,
        SchoolSearchRequest: schoolSearchRequest,
        IndividualSearchRequest: individualSearchRequest,
        // MunicipalSearchRequest: municipalSearchRequest,
        // ChurchSearchRequest: churchSearchRequest,
        // TaxExemptSearchRequest: taxExemptSearchRequest,s
        ShowOnAcquisition: showOnAcquisition
      }

      let saveTypeValue = sponsorList.value.filter((a) => a.value === prospectTab.value)
      saveUserSearchValue.SaveSearchType = saveTypeValue && saveTypeValue.length > 0 ? saveTypeValue[0].text : ''
      let saveUserSearch = []
      saveUserSearch.push(saveUserSearchValue)
      $axios.put(`/api/v1/tal/plan/searchrequests`, saveUserSearch).then(() => {
        toast.success('Saved Successfully', '')
        searchSave.value.saveSearchName = ''
        searchSave.value.showonAcquisition = true
        eventBus.emit('getSaveSearch')
      })
    }
    const showCurrentError = () => {
      zipcode.value = store.state.user.zipCode
      if (Object.keys(store.state.finderList).length > 0)
        zipcode.value = store.state.finderList.zipcode ? store.state.finderList.zipcode : store.state.user.zipCode
      mapFinder.value.GoogleMap()
      applyFilter('search')
    }
    // eslint-disable-next-line no-unused-vars
    const getZipcode = (position, from) => {
      zipcodeError.value = false
      zipcodeErrorMsg.value = ''
      $axios
        .get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'jsonv2',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
        })
        .then((success) => {
          if (from === 'current_location') {
            zipcode.value =
              success.data && success.data.address != null && success.data.address.postcode
                ? success.data.address.postcode
                : store.state.user.zipCode
          } else {
            if (Object.keys(store.state.finderList).length > 0) {
              zipcode.value = store.state.finderList.zipcode
                ? store.state.finderList.zipcode
                : success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : store.state.user.zipCode
            } else {
              zipcode.value =
                success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : store.state.user.zipCode
            }
          }
          applyFilter('search')
        })
    }
    const clearZip = () => {
      zipcode.value === ''
      zipcodeError.value = false
      zipcodeErrorMsg.value = ''
      searchRadius.value = ''
    }
    const maskAllow = ($event) => {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode === 8 || keyCode === 46) {
        if (zipcode.value === 'Current Location') zipcode.value = null
      }
    }
    ///Zipcode Validation Finish
    const getReport = (planSingleObject, reportType) => {
      if (reportType !== undefined && reportType !== '') {
        if (reportType !== 'Express Diagnostic') return
        //enable express diagnostics loader at index 0
        planSingleObject.selectreport[0].loader = true
        var reportRequest = {
          seinPNumber: planSingleObject.SEINPNO,
          preparedby: store.state.user.name,
          isExpress: true,
          planName: planSingleObject.PNAME
        }

        $axios('/api/v1/tal/report/diagnostic', {
          method: 'POST',
          data: reportRequest
        }).then((response) => {
          this.onPopUpEvent(
            `/api/v1/tal/report/diagnostic/download?reportName=${encodeURIComponent(response.data.reportName)}`,
            response.data.reportName
          )
          planSingleObject.selectreport[0].loader = false
        })
      }
    }
    const checkReportOptions = (seinpNO, plan, val, event) => {
      if (display.smAndDown.value) {
        if (event) {
          if (event.target.classList[2] === 'disabled') return
        }
      }
      if (val === 'Express Diagnostic') {
        getReport(plan, val)
      } else {
        store.state.finderList.prospectValue = 0
        router.push({
          name: 'TALPlan',
          params: { id: seinpNO, planType: plan.DCPTYPE },
          query: { reportOption: val }
        })
      }
    }
    const planInfo = (item) => {
      if (item.InBookOfBusiness === 0) {
        if (item.SEINPNO) {
          store.state.finderList.prospectValue = prospectTab.value
          router.push({
            name: 'TALPlan',
            params: { id: item.SEINPNO, planType: item.DCPTYPE }
          })
        }
      }
    }
    ///Advance Filter Start
    const applyAdvanceFilter = () => {
      if (prospectTab.value === 1) {
        if (advanceFilter.value) {
          searchLoading.value = true
          advanceFilter.value.getSchoolFilterChips()
          advanceFilter.value.setStoreValues()
        }
      } else {
        if (prospectTab.value === 0) {
          searchText.value = ''
          EIN.value = ''
          plan.value = ''
          showSearch.value = false
        }
        resetData()
        applyFilter('filter')
      }
      clearSaveSearch()
    }
    const onlyNumber = ($event) => {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault()
      }
    }
    const resetFilter = () => {
      if (advanceFilter.value) {
        clearSaveSearch()
        if (prospectTab.value === 0) {
          advanceFilter.value.resetVariables()
        } else if (prospectTab.value === 1) {
          advanceFilter.value.resetSchoolFilter()
        } else if (prospectTab.value === 2) {
          advanceFilter.value.resetMunicipalFilter()
        } else if (prospectTab.value === 3) {
          advanceFilter.value.resetChurchFilter()
        } else if (prospectTab.value === 4) {
          advanceFilter.value.resetIndividualFilter()
        } else if (prospectTab.value === 7) {
          advanceFilter.value.resetTaxExemptFilter()
        }
        advanceFilterModel.value = false
      }
    }
    const onChipsClose = (item) => {
      if (advanceFilter.value) {
        advanceFilter.value[item.modelName] = item.defaultValue
        if (prospectTab.value === 1) {
          advanceFilter.value.getSchoolFilterChips()
          advanceFilter.value.setStoreValues()
        } else {
          resetData()
          applyFilter('filter')
        }
        clearSaveSearch()
      }
    }
    ///Advance Filter Finish
    const currencyFormat = (value) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    }
    const redirectPlanInfo = (seinpno, planType, bookOfBusiness) => {
      if (parseInt(bookOfBusiness) === 0) {
        if (seinpno) {
          store.state.finderList.prospectValue = prospectTab.value
          router.push({
            name: 'TALPlan',
            params: { id: seinpno, planType: planType }
          })
        }
      }
    }
    const clientPlanInfo = (planId) => {
      if (planId) {
        store.state.finderList.prospectValue = 6
        router.push(`/Retention/Plan/${planId}`)
      } else {
        toast.info('Plan Information not found', '')
      }
    }
    const currencyConvert = (xlWb, xlColRef, xlRowNum) => {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Plan Finder'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    const percentConvert = (xlWb, xlColRef, xlRowNum) => {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Plan Finder'][xlColRef + xlRowNum], '0.00%')
    }
    const ExportPlan = (plans) => {
      var xlHeaders = plans.map((rec) => {
        return {
          'Plan Name': rec.PNAME,
          'EIN#': rec.sp_fedid,
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
          'Average Participant Account Balance': parseFloat(rec.AVEPARTICBAL.toFixed(0)),
          'Total Contributions': rec.TOTCONTRIB,
          'Average Participant Contribution': rec.PARTAVG ? parseFloat(rec.PARTAVG.toFixed(0)) : rec.PARTAVG,
          'Average Employer Contribution': parseInt(rec.EMPLYRAVG.toFixed(0)),
          'Asset Growth': parseFloat(rec.GROWTH.toFixed(4)),
          'Return On Investment': parseFloat(rec.RETURN.toFixed(4)),
          'Broker Commissions': parseFloat(rec.COMMISS.toFixed(0)),
          'Broker Fees': parseFloat(rec.FEES.toFixed(0)),
          'Broker %': parseFloat(rec.BROKERPCT.toFixed(4)),
          'Admin Expense': rec.EXPADMIN,
          'Other Expense': rec.EXPOTHER,
          'Professional Expense': rec.EXPPROFFEE,
          'Advisor Expense': rec.EXPINVADV,
          'Total Plan Expense': rec.EXPTOTPLN,
          'Total Admin Expense': rec.EXPTOTADM,
          'Total Admin Expense %': parseFloat(rec.EXPTOTADMPCT.toFixed(4)),
          Industry: rec.BUSCODE,
          'Plan Year End': rec.YEAREND,
          'Final Report': rec.FINAL === 0 ? true : false,
          'Loans as % of Plan Assets': parseFloat(rec.PARTLOANS.toFixed(4)),
          'Certain Deemed and/or Corrective Distributions': parseFloat(rec.DISTRB.toFixed(4)),
          'Audit Reported': rec.OPINIONTYP,
          'Failed to Transmit Participant Contributions': rec.TRANSMIT,
          'Plan Not Covered by Fidelity Bond': rec.FDLTYBDIND,
          'Plan Had Nonexempt Transactions': rec.NONEXEMPT,
          'Loss Due to Fraud/Dishonesty': rec.LOSS,
          'Revenue Share as % of Plan Assets': parseFloat(rec.REVENUE.toFixed(4)),
          Broker: rec.BROKER,
          'Service Provider': rec.PROVIDER,
          'Insurance Carrier': rec.INSCARRIER
        }
      })
      return xlHeaders
    }
    const closeAdvanceFilter = () => {
      advanceFilterModel.value = false
      searchLoading.value = false
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
    const exportToExcel = () => {
      var xlHeaders = []
      var planResult = []
      xlHeaders = ExportPlan(searchResult.value)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'Plan Finder')
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
      XLSX.writeFile(wb, 'Plan Finder.xlsx')
    }
    const getSortByData = () => {
      if (sortByType.value === 0) {
        sortByTypeName.value = 'PNAME'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 1) {
        sortByTypeName.value = 'PNAME'
        sortByTypeOrder.value = 'Desc'
      } else if (sortByType.value === 2) {
        sortByTypeName.value = 'TOTASSETS'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 3) {
        sortByTypeName.value = 'TOTASSETS'
        sortByTypeOrder.value = 'Desc'
      } else if (sortByType.value === 4) {
        sortByTypeName.value = 'GROWTH'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 5) {
        sortByTypeName.value = 'GROWTH'
        sortByTypeOrder.value = 'Desc'
      } else if (sortByType.value === 6) {
        sortByTypeName.value = 'ACTPARTIC'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 7) {
        sortByTypeName.value = 'ACTPARTIC'
        sortByTypeOrder.value = 'Desc'
      } else if (sortByType.value === 8) {
        sortByTypeName.value = 'PARTAVG'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 9) {
        sortByTypeName.value = 'PARTAVG'
        sortByTypeOrder.value = 'Desc'
      } else if (sortByType.value === 10) {
        sortByTypeName.value = 'EMPLYRAVG'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 11) {
        sortByTypeName.value = 'EMPLYRAVG'
        sortByTypeOrder.value = 'Desc'
      } else if (sortByType.value === 12) {
        sortByTypeName.value = 'SCITY'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 13) {
        sortByTypeName.value = 'SCITY'
        sortByTypeOrder.value = 'Desc'
      } else if (sortByType.value === 14) {
        sortByTypeName.value = 'SSTATE'
        sortByTypeOrder.value = 'Asc'
      } else if (sortByType.value === 15) {
        sortByTypeName.value = 'SSTATE'
        sortByTypeOrder.value = 'Desc'
      }
      employeeSponsorPage.value = 1
      searchResult.value = []
      totalPlans.value = -1
      applyFilter('filter')
    }
    watch(
      () => theme.dark,
      () => {
        mapFinder.value.GoogleMap()
        getGoogleMap()
      }
    )
    watch(
      () => store.state.finderList.showMap,
      () => {
        var val = store.state.finderList.showMap
        if (val) {
          document.documentElement.style.overflow = ''
        }
      },
      { deep: true, immediate: true }
    )
    watch(
      () => showMap.value,
      (val) => {
        if (!val) {
          document.documentElement.style.overflow = 'auto'
        } else {
          document.documentElement.style.overflow = ''
        }
        if (!val) {
          if (showStarred.value) {
            searchResult.value = planList.value
            showStarred.value = false
          }
        }
      }
    )
    watch(
      () => planReportList.value,
      () => {
        if (!$authz.hasPermission($authz.permissionSet.Express_Diagnostic__c, $authz.permission.Full)) {
          var showExpressDiagnostic = planReportList.value.findIndex((a) => a.value === 'Express Diagnostic')
          if (showExpressDiagnostic > -1) planReportList.value.splice(showExpressDiagnostic, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)) {
          var showDiagnostic = planReportList.value.findIndex((a) => a.value === 'Diagnostic')
          if (showDiagnostic > -1) planReportList.value.splice(showDiagnostic, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)) {
          var showComparison = planReportList.value.findIndex((a) => a.value === 'RPEA')
          if (showComparison > -1) planReportList.value.splice(showComparison, 1)
        }
        if ($authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)) {
          var showProposal = planReportList.value.findIndex((a) => a.value === 'Proposal')
          if (showProposal > -1) planReportList.value.splice(showProposal, 1)
        }
        planReports.value = planReportList.value
      },
      { deep: true, immediate: true }
    )
    // watch(
    //   () => prospectTab,
    //   (val) => {
    //     quickFilter = false
    //     if (val) {
    //       if (advanceFilter.value) if (advanceFilter.value.filterChips.length > 0) quickFilter = true
    //     }
    //   },
    //   { immediate: true }
    // )

    watch(
      () => searchText.value,
      (val) => {
        if (val === '') {
          plan.value = ''
          EIN.value = ''
        }
      }
    )
    watch(
      () => businessType.value,
      () => {
        if (!showEmployerSponsored.value) {
          var hideEmployeeSponsored = businessType.value.findIndex((a) => a.value === 0)
          if (hideEmployeeSponsored > -1) businessType.value.splice(hideEmployeeSponsored, 1)
        }
        if (!showSchool.value) {
          var hideSchool = businessType.value.findIndex((a) => a.value === 1)
          if (hideSchool > -1) businessType.value.splice(hideSchool, 1)
        }
        if (!showMunicipalities.value) {
          var hideMunicipalities = businessType.value.findIndex((a) => a.value === 2)
          if (hideMunicipalities > -1) businessType.value.splice(hideMunicipalities, 1)
          var hideChurch = businessType.value.findIndex((a) => a.value === 3)
          if (hideChurch > -1) businessType.value.splice(hideChurch, 1)
          var hideTaxExempt = businessType.value.findIndex((a) => a.value === 7)
          if (hideTaxExempt > -1) businessType.value.splice(hideTaxExempt, 1)
        }
        if (!showIndividuals.value) {
          var hideIndividual = businessType.value.findIndex((a) => a.value === 4)
          if (hideIndividual > -1) businessType.value.splice(hideIndividual, 1)
        }

        if (store.state.user.selectedProgram) {
          if (store.state.user.selectedProgram.programName === $authz.program.Franklin) {
            var hideMyClients = businessType.value.findIndex((a) => a.value === 6)
            if (hideMyClients > -1) businessType.value.splice(hideMyClients, 1)
          }
        }
        sponsorList.value = businessType.value
        if (Object.keys(store.state.finderList).length > 0) {
          prospectTab.value = store.state.finderList.prospectValue
        } else {
          prospectTab.value = sponsorList.value && sponsorList.value.length > 0 ? sponsorList.value[0] : 0
        }
      },
      { deep: true, immediate: true }
    )
    onMounted(() => {
      sortByTypeName.value = 'TOTASSETS'
      sortByTypeOrder.value = 'Desc'
      if (showSchool.value) {
        store.dispatch('getFinderSchoolFilter')
      }
      if (showEmployerSponsored.value) {
        store.dispatch('getFinderPlanType')
      }
      if (showIndividuals.value) {
        store.dispatch('getFinderEmploymentStatus')
        store.dispatch('getFinderPlanStatus')
      }
      if (store.state.finderList.prospectValue >= 0) {
        let prospectTab = store.state.finderList.prospectValue
        let tabValue = sponsorList.value.filter((a) => a.show === true)
        if (tabValue && tabValue.length > 0) {
          let selectedTab = sponsorList.value.findIndex((a) => a.value === prospectTab)
          if (selectedTab > -1) {
            prospectTab = selectedTab
          } else {
            let selectedTab1 = sponsorList.value.findIndex((a) => a.text === tabValue[0].text)
            if (selectedTab1 > -1) prospectTab = selectedTab1
          }
        }
      } else {
        let tabValue = sponsorList.value.filter((a) => a.show === true)
        if (tabValue && tabValue.length > 0) {
          let selectedTab2 = sponsorList.value.findIndex((a) => a.text === tabValue[0].text)
          if (selectedTab2 > -1) prospectTab.value = selectedTab2
        }
      }
      if (route.query.saveSearch) {
        showEditSearch.value = true
        getPlanDetail(route.query.saveSearch)
      } else if (route.query.showStarred) {
        if (Object.keys(store.state.finderList).length > 0) {
          showMap.value = store.state.finderList.showMap
        } else showMap.value = true
        prospectTab.value = 5
        if (mapFinder.value) mapFinder.value.GoogleMap()
        getCustomerType()
      } else {
        updateFinderModel()
      }
      handleScroll()
      eventBus.on('applySchoolFilteredData', assignSchoolCount)
      eventBus.on('showSaveSearch', (data) => {
        showSavedSearchList.value = data && data.length > 0
        savedResult.value = data
      })
      eventBus.on('getStarredData', () => getStarredValue(false))
      eventBus.on('callIndiviudalApi', indiviudalIntersected)
      eventBus.on('callMunicipalApi', municipalIntersected)
      eventBus.on('callChurchApi', churchIntersected)
      eventBus.on('callTaxExemptApi', taxExemptIntersected)
      eventBus.on('callClientApi', clientIntersected)
    })
    onBeforeUnmount(() => {
      eventBus.off('applySchoolFilteredData')
      eventBus.off('showSaveSearch')
      eventBus.off('getStarredData')
      eventBus.off('callIndiviudalApi')
      eventBus.off('applyIndividualFilteredData')
      eventBus.off('callClientApi')
    })
    return {
      businessType,
      sponsorList,
      searchRadius,
      zipcode,
      loading,
      searchText,
      EIN,
      plan,
      breadCrumb,
      headerList,
      planReportList,
      showStarred,
      planReports,
      filterChurch,
      filterPlans,
      filterSchools,
      filterIndividual,
      filterMunicipal,
      filterTaxExempt,
      clientList,
      prospectTab,
      showMap,
      formatNumber,
      municipalDataCount,
      totalPlans,
      schoolDataCount,
      showSearch,
      searchLoading,
      searchResult,
      showSchool,
      mapselectedSEINPNO,
      closeReportPopUp,
      selectedRowPadding,
      totalClientPlans,
      radiusList,
      rowcolor,
      sortByType,
      sortByListType,
      getPlanValue,
      checkFields,
      searchAreaFocusOut,
      constantPlanCount,
      closeSavedSearch,
      saveSearchCriteria,
      mapHighlight,
      schoolDetailPage,
      showHideSearch,
      clearFilter,
      showEmployerSponsored,
      showIndividuals,
      showMunicipalities,
      advanceFilter,
      showSavedSearch,
      openSavedSearches,
      savedResult,
      closeSaveSearch,
      saveSearchDialog,
      searchSave,
      clearZip,
      maskAllow,
      showSavedSearchList,
      applyAdvanceFilter,
      resetFilter,
      onChipsClose,
      currencyFormat,
      clientPlanInfo,
      exportToExcel,
      getSortByData,
      getCustomerType,
      resetMarker,
      getGoogleMap,
      mapFinderInfo,
      componentMunicipalKey,
      componentChurchKey,
      componentTaxExemptKey,
      componentSchoolKey,
      componentindividualKey,
      componentFavouriteKey,
      componentBookmarkKey,
      componentSearchKey,
      componentClientKey,
      totalMunicipalPlans,
      totalIndividualPlans,
      totalChurchPlans,
      formatPrice,
      searchZipcode,
      closeAdvanceFilter,
      openAdvanceFilter,
      churchDataCount,
      favoriteList,
      taxExemptDataCount,
      showHideMap,
      handleScroll,
      mapFinder,
      showLegalText,
      cardHeight,
      individualDataCount,
      exportPermissionForAdvisor,
      totalTaxExemptPlans,
      showEditSearch,
      clearSearch,
      updateFinderModel,
      planInfo,
      redirectPlanInfo,
      getAddress,
      getCurrentLocation,
      checkCurrentLocation,
      searchBlur,
      getReport,
      checkReportOptions,
      onlyNumber,
      store,
      theme,
      $authz,
      router,
      display
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  }
}
</script>
<style>
#myLeadMap.finder {
  height: 84%;
  width: 33.5%;
}
.flexclass {
  border-radius: 2px;
  margin: 2px !important;
  flex: 1 0 24% !important;
  flex-wrap: wrap;
}
.heightForlargeLegalText {
  max-height: 75vh !important;
}
.v-field__input {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style>
<style scoped>
.font_size_span {
  font-size: 1.077rem !important;
}
.v-data-table.showMap :deep(.sticky-header) {
  position: sticky;
  top: -15px !important;
  z-index: 2;
}
.v-data-table.hideMap :deep(.sticky-header) {
  position: sticky;
  top: var(--toolbarHeight) !important;
  z-index: 2;
}

.v-data-table :deep(.v-data-table__wrapper) {
  overflow: unset;
}
</style>
