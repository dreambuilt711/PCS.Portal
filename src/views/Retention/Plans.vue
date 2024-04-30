<template>
  <v-col :class="showLegalText && lgAndUp ? 'heightForlargeLegalText' : ''" class="pa-0">
    <v-col v-if="displayGlobalFilter" id="globalFilter" cols="12" class="fixedFilter pa-0">
      <GlobalFilter @openFilter="openFilter" />
    </v-col>
    <v-container :class="xsOnly ? 'pa-0' : 'pt-0 pb-2'" :fluid="!xsOnly">
      <v-col cols="12" class="pa-0">
        <v-row class="justify-space-around">
          <v-col
            id="scrollUps"
            cols="12"
            md="12"
            :class="['pt-8 pb-2', smAndDown ? 'pl-2 pr-2' : 'pl-0 pr-0']"
            @scroll="handleScroll()"
          >
            <v-col cols="12" :class="xsOnly ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0'">
              <v-row>
                <v-col :cols="mdAndUp ? '8' : '12'" class="pa-0">
                  <span
                    v-if="breadCrumb.parentName"
                    class="text-capitalize font_12 cursor-pointer text-hyperlink"
                    @click="router.push('/Home/ClientManagement').catch(() => {})"
                    >Client Management</span
                  >
                  <v-icon size="12" color="hyperlink" class="icon-chevron-right ml-1 mr-1" />
                  <span v-if="breadCrumb.parentName" class="text-capitalize font_12 text-hyperlink">{{
                    breadCrumb.pageName
                  }}</span>
                </v-col>
                <v-col cols="12" class="pl-0 pt-1 pr-0">
                  <h1>My Clients</h1>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pt-1 pb-0 pl-0 pr-0">
              <v-row>
                <div v-if="!showSearch" class="pa-0">
                  <v-btn
                    variant="outlined"
                    class="pa-2 ma-0 buttonStyle"
                    :disabled="(!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) || showStarred"
                    @click="showSearch = !showSearch"
                  >
                    <span>
                      <v-icon size="21" color="hyperlink" class="icon-search" @click="showHideSearch()" />
                      <v-icon
                        size="13"
                        color="hyperlink"
                        class="ml-1 width_10"
                        @click="showHideSearch()"
                        icon="fa:fas fa-caret-right"
                      ></v-icon>
                    </span>
                  </v-btn>
                </div>
                <v-col
                  v-if="showSearch"
                  v-click-input-outside="searchAreaFocusOut"
                  xl="5"
                  lg="5"
                  md="10"
                  sm="10"
                  cols="12"
                  :class="[mdAndUp ? 'mr-3' : '', xlOnly ? 'pr-3 pt-0 pl-0 pb-0' : 'pa-0']"
                >
                  <v-text-field
                    v-model="searchText"
                    ref="wildCardSearch"
                    :clearable="searchText ? (searchText.trim() !== '' ? true : false) : false"
                    placeholder="Search for...."
                    :menu-props="{ zIndex: '9999', attach: true }"
                    :loading="showloader"
                    z-index="9999"
                    :disabled="(!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) || showStarred"
                    @click="hideCard = true"
                    @click:clear="clearSearch()"
                    @update:model-value="checkFields('company')"
                  >
                    <template #append-inner>
                      <v-icon size="21" color="hyperlink" class="icon-search cursor-pointer" @click="showHideSearch()" />
                      <v-icon
                        size="13"
                        color="hyperlink"
                        class="ml-1 width_10 cursor-pointer"
                        @click="showHideSearch()"
                        icon="fa:fas fa-caret-left"
                      />
                    </template>
                  </v-text-field>
                  <v-card
                    v-if="
                      (hideCard &&
                        ((filterPlans.length > 0 && showEmployerSponsored) || (filterSchools.length > 0 && showSchool))) ||
                      (filterIndividual.length > 0 && showIndividuals) ||
                      (filterMunicipalities.length > 0 && showMunicipalities)
                    "
                    :width="wildCardSearch ? wildCardSearch.$el.clientWidth : '200px'"
                    color="white"
                    class="elevation-3 plans_card_height"
                  >
                    <v-col
                      v-if="filterPlans.length > 0 && showEmployerSponsored && prospectTab === 0"
                      class="pl-2 pr-2 pt-0 pb-0"
                    >
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-for-profit forProfitIcon" size="21" />
                        </v-list-item-action>

                        <v-list-item-title class="font_14 font-weight-medium"> For Profit </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list>
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
                    <v-col v-if="filterSchools.length > 0 && showSchool && prospectTab === 0" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-graduation schoolIcon" size="21" />
                        </v-list-item-action>

                        <v-list-item-title class="font_14 font-weight-medium"> Schools </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list>
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
                    <v-col
                      v-if="filterMunicipalities.length > 0 && showMunicipalities && prospectTab === 0"
                      class="pl-2 pr-2 pt-0 pb-0"
                    >
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-individual municipalitiesIcon" size="21" />
                        </v-list-item-action>

                        <v-list-item-title class="font_14 font-weight-medium"> Municipalities </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list>
                        <v-tooltip v-for="(item, index) in filterMunicipalities" :key="index" location="top">
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
                    <v-col v-if="filterIndividual.length > 0 && showIndividuals && prospectTab === 3" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list-item>
                        <v-list-item-action class="mr-1">
                          <v-icon class="icon-individual participantIcon" size="21" />
                        </v-list-item-action>

                        <v-list-item-title class="font_14 font-weight-medium"> Individuals </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list>
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
                  </v-card>
                </v-col>
                <v-col v-if="!showSearch" xl="2" lg="2" md="4" sm="4" cols="4" class="ml-2 mr-2 d-flex pa-0">
                  <v-select
                    v-model="searchRadius"
                    :menu-props="{ zIndex: '9999', attach: true }"
                    :items="radiusList"
                    clearable
                    :disabled="(!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) || showStarred"
                  />
                </v-col>
                <div v-if="!showSearch" class="flex_none pt-3 pb-0 pl-0 pr-0" :class="xsOnly ? 'mr-auto ml-auto' : 'ml-1 mr-1'">
                  of
                </div>
                <v-col
                  v-if="!showSearch"
                  xl="2"
                  lg="2"
                  md="4"
                  sm="4"
                  cols="5"
                  class="ml-2 d-flex pa-0"
                  :class="xsOnly ? '' : 'mr-3'"
                >
                  <v-text-field
                    v-model="zipcode"
                    hint="ex.90001"
                    maxlength="5"
                    :class="[zipcode === 'Current Location' ? 'textColor' : '', 'hyperlinkColor']"
                    :error="zipcodeError"
                    :error-messages="zipcodeErrorMsg"
                    clearable
                    :disabled="(!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) || showStarred"
                    @keypress="onlyNumber"
                    @keydown="maskAllow(event)"
                    @blur="checkCurrentLocation()"
                    @click:clear="clearZip"
                    @update:model-value="checkFields('location')"
                    @click:append-inner="getCurrentLocation()"
                    append-inner-icon=""
                  >
                    <template #append-inner>
                      <v-icon
                        :color="zipcode ? 'hyperlink' : ''"
                        class="cursor-pointer"
                        @click="getCurrentLocation()"
                        icon="fa:icon-geo-locate"
                      />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col xl="2" lg="1" md="2" sm="2" cols="4" class="d-flex mr-auto pa-0">
                  <v-btn
                    color="accent"
                    :disabled="
                      searchLoading ||
                      (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                      showStarred ||
                      disableSearch
                    "
                    :loading="searchLoading"
                    class="mt-0 elevation-1"
                    :block="xsOnly"
                    :class="[
                      xsOnly ? 'ml-0 pl-0' : '',
                      showSearch && lgOnly ? 'margin_left_2' : '',
                      showSearch && xlOnly ? 'margin_left_6' : ''
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
                <v-col xl="2" lg="2" md="5" sm="5" cols="7" class="d-flex justify-end pa-0">
                  <v-select
                    v-model="prospectTab"
                    :menu-props="{ zIndex: '9999', attach: true }"
                    :items="sponsorList"
                    item-props.disabled="disabled"
                    :class="xsOnly ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                    :disabled="searchLoading"
                    @update:model-value="getCustomerType"
                  >
                    <template #selection="{ item }">
                      <v-icon size="16" :class="[item.icon, item.color, 'mr-1']" />
                      <span class="text-accent">{{ item.text }}</span>
                    </template>
                    <template #item="slotProps">
                      <v-icon size="16" :class="[slotProps.item.icon, slotProps.item.color, 'mr-1']" />
                      <span class="text-accent">{{ slotProps.item.text }}</span>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pb-3 pt-0 pl-0 pr-0">
              <v-row>
                <v-chip
                  v-if="advanceFilter ? (advanceFilter.planChips.length === 0 && prospectTab === 0 ? true : false) : false"
                  class="elevation-0 align-self-center light-grey text-black font_12"
                  label
                  size="small"
                >
                  ({{ new Intl.NumberFormat().format(constantPlanCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <v-chip
                  v-if="advanceFilter ? (advanceFilter.participantChips.length === 0 && prospectTab === 3 ? true : false) : false"
                  class="elevation-0 align-self-center light-grey text-black font_12"
                  label
                  size="small"
                >
                  ({{ new Intl.NumberFormat().format(individualDataCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <v-chip
                  v-if="prospectTab === 4"
                  class="elevation-0 align-self-center light-grey text-black font_12"
                  label
                  size="small"
                >
                  ({{ favoriteList ? new Intl.NumberFormat().format(favoriteList.length) : 0
                  }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
              </v-row>
            </v-col>
            <v-col v-show="prospectTab === 0" cols="12" class="pa-0">
              <v-col v-if="advanceFilter ? (advanceFilter.planChips.length > 0 ? true : false) : ''" class="mb-2 mt-2 pa-0">
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.planChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2 text-white"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2 light-grey text-black" label size="small">
                  ({{ new Intl.NumberFormat().format(constantPlanCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-divider v-if="constantPlanCount && constantPlanCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    color="hyperlink"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-6 mb-0 pa-2" width="100%">
                      <!-- new added here-->
                      <v-col class="py-3" cols="12">
                        <v-row>
                          <v-col xl="7" md="4" sm="4" :lg="width > 1366 ? '6' : '5'">
                            <v-row>
                              <v-btn
                                v-if="exportPermissionForAdvisor"
                                variant="text"
                                class="font-weight-regular"
                                :class="xsOnly ? 'ml-0 mr-0' : ''"
                                color="hyperlink"
                                size="x-small"
                                @click="exportToExcel()"
                              >
                                Export
                              </v-btn>
                              <v-divider v-if="exportPermissionForAdvisor" vertical class="ma-0 mb-n2 mx-3 height_32" />
                              <v-btn
                                variant="text"
                                class="font-weight-regular pl-0 ml-0"
                                color="hyperlink"
                                size="x-small"
                                :disabled="
                                  (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                                  showStarred
                                "
                                @click="openAdvanceFilter()"
                              >
                                Filter
                              </v-btn>
                            </v-row>
                          </v-col>
                          <v-spacer />
                          <v-col xl="5" md="8" sm="8" cols="12" class="d-flex justify-end pa-0" :lg="width > 1366 ? '6' : '7'">
                            <v-row>
                              <v-col
                                xl="6"
                                lg="6"
                                md="3"
                                sm="4"
                                class="pt-3 font-weight-medium pl-0 pb-0"
                                :class="xsOnly ? '' : mdOnly ? 'text-right pr-3' : 'text-right pr-6'"
                              >
                                Sort results by
                              </v-col>
                              <v-col xl="6" lg="6" md="9" sm="8">
                                <v-select
                                  v-model="planSortByType"
                                  :menu-props="{ zIndex: '9999' }"
                                  :items="employeeSortByListType"
                                  item-props.disabled="disabled"
                                  :class="xsOnly ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                                  :disabled="searchLoading"
                                  hide-details
                                  @update:model-value="getSortByData"
                                >
                                  <template #selection="{ item }">
                                    <span class="text-accent">{{ item.text }}</span>
                                  </template>
                                  <template #item="slotProps">
                                    <span class="text-accent">{{ slotProps.item.text }}</span>
                                  </template>
                                </v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- end here -->
                      <v-data-table
                        :headers="headerList"
                        :items="searchResult"
                        item-value="PLANID"
                        mobile-breakpoint="0"
                        :class="[smAndDown ? 'elevation-0 mb-0' : 'elevation-3 mb-0', 'hideMap']"
                        items-per-page="50"
                        :items-per-page-options="[
                          { value: 10, title: '10' },
                          { value: 25, title: '25' },
                          { value: 50, title: '50' },
                          { value: 100, title: '100' }
                        ]"
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td class="text-left text-capitalize pl-2 pr-2">
                              <v-hover v-slot="{ hover }">
                                <v-tooltip location="top" color="#0077CC" opacity="1" :max-width="lgAndUp ? '600px' : 'auto'">
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
                                              'text-hyperlink',
                                              hover ? 'text-decoration-underline' : 'text-decoration-none'
                                            ]"
                                            class="text-capitalize"
                                            @click="planInfo(item.NAME, item.PLANID, item.Source, item)"
                                            >{{ item.NAME ? item.NAME.toLowerCase() : '' }}</a
                                          >
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                  </template>
                                  <v-col class="pa-1">
                                    <v-col cols="12">
                                      <v-row no-gutters>
                                        <v-col cols="12" class="font-weight-medium pb-1"> Plan Details: </v-col>
                                        <v-col class="text-capitalize">
                                          {{ item.NAME ? item.NAME.toLowerCase() : ''
                                          }}{{ item.PLANID ? ' - ' + item.PLANID + '' : '' }}
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                    <v-col v-if="item.PlanStatus" cols="12" class="pt-1">
                                      item.PlanStatus ? item.PlanStatus : '' }}
                                    </v-col>
                                    <v-col v-if="item.PLANYEAREND" cols="12" class="pt-1">
                                      item.PLANYEAREND ? item.PLANYEAREND : '' }}
                                    </v-col>
                                    <v-col cols="12">
                                      <v-row>
                                        <v-col v-if="item.Advisor || item.FirmName" xs7>
                                          <v-row no-gutters>
                                            <v-col cols="12" class="font-weight-medium pt-2 pb-1"> Advisor: </v-col>
                                            <v-col cols="12">
                                              {{ item.Advisor ? item.Advisor : '' }}
                                            </v-col>
                                            <v-col cols="12" class="pt-1">
                                              {{ item.FirmName ? item.FirmName : '' }}
                                            </v-col>
                                          </v-row>
                                        </v-col>
                                        <v-col v-if="item.TPA" xs5 class="flex_none">
                                          <v-row no-gutters>
                                            <v-col cols="12" class="font-weight-medium pt-2 pb-1"> TPA: </v-col>
                                            <v-col cols="12">
                                              {{ item.TPA ? item.TPA : '' }}
                                            </v-col>
                                          </v-row>
                                        </v-col>
                                        <v-col v-if="item.PlanSponsorName || item.PlanSponsorPhone" cols="12">
                                          <v-row no-gutters>
                                            <v-col cols="12" class="font-weight-medium pt-2 pb-1"> Sponsor: </v-col>
                                            <v-col cols="12">
                                              {{ item.PlanSponsorName ? item.PlanSponsorName : '' }}
                                            </v-col>
                                            <v-col cols="12">
                                              {{ item.PlanSponsorPhone ? item.PlanSponsorPhone : '' }}
                                            </v-col>
                                          </v-row>
                                        </v-col>
                                        <v-col cols="12" class="py-1"> (Click the name to go to account details) </v-col>
                                      </v-row>
                                    </v-col>
                                  </v-col>
                                </v-tooltip>
                              </v-hover>
                            </td>
                            <td v-if="mdAndUp" class="text-right">
                              {{ formatPrice(item.ASSETS, 2) }}
                            </td>
                            <td v-if="mdAndUp">
                              {{ item.PLANYEAREND }}
                            </td>
                            <td v-if="mdAndUp">
                              {{ item.PlanType }}
                            </td>
                            <td v-if="mdAndUp">
                              {{ item.PlanStatus }}
                            </td>
                            <td v-if="mdAndUp" class="text-right">
                              {{ item.TotalEmployees }}
                            </td>

                            <td v-if="mdAndUp">
                              {{ item.TPA }}
                            </td>
                            <td v-if="lgAndUp" class="text-left">
                              {{ item.RelationshipManagerName }}
                            </td>
                            <td class="text-center pa-1">
                              <v-row class="justify-center">
                                <v-col xs4 class="flex_none">
                                  <v-btn
                                    icon
                                    color="hyperlink"
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
                                <v-col xs4 class="flex_none">
                                  <PlanStar
                                    :key="componentBookmarkKey"
                                    :seinpno="item.PLANID"
                                    from="RBC"
                                    :type="item.PlanBusinessType"
                                  />
                                </v-col>
                                <v-col v-if="false" xs4 class="align-self">
                                  <v-btn
                                    icon
                                    variant="text"
                                    size="small"
                                    color="accent"
                                    @click="initiateManagePlanSSOLogin(item.PLANID, item.Source)"
                                  >
                                    <v-icon size="small"> fas fa-external-link-alt </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                      <Loader
                        :loadingText="
                          searchText ? `Finding plan ${searchText}` : zipcode ? `Finding plans in ${zipcode}` : 'Loading....'
                        "
                        :loading="searchLoading"
                        :count="searchResult ? searchResult.length : 0"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 3" class="pa-0">
              <v-col
                v-if="advanceFilter ? (advanceFilter.participantChips.length > 0 ? true : false) : ''"
                class="mb-4 mt-2 pa-0"
              >
                <v-chip
                  v-for="(item, index) in advanceFilter ? advanceFilter.participantChips : []"
                  :key="`${index}_${item.text}`"
                  closable
                  class="elevation-0 mr-3 mb-2 text-white"
                  color="accent"
                  label
                  size="small"
                  @click:close="onChipsClose(item)"
                >
                  <b>{{ item.text }}</b>
                </v-chip>
                <v-chip class="elevation-0 mr-2 mb-2 light-grey text-black" label size="small">
                  ({{ new Intl.NumberFormat().format(individualDataCount) }}<span class="ml-1 mr-1">found)</span>
                </v-chip>
                <span class="d-inline-block">
                  <v-btn
                    v-if="false"
                    color="hyperlink"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="openSavedSearches()"
                  >
                    {{ showEditSearch ? 'Edit Search' : 'Save Search' }}
                  </v-btn>
                  <v-divider v-if="individualDataCount && individualDataCount > 0" vertical class="ma-0 mb-n2 mx-3 height_32" />
                  <v-btn
                    color="accent"
                    variant="text"
                    size="small"
                    class="text-transform-capitalize mb-2 mt-0 pa-0 font-weight-regular"
                    @click="clearFilter(true)"
                  >
                    Clear Filters
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12" class="pa-0">
                    <v-card class="elevation-6 mb-0 pa-2" width="100%">
                      <v-col class="py-3" cols="12">
                        <v-row>
                          <v-col xl="7" md="4" sm="4" :lg="width > 1366 ? '6' : '5'">
                            <v-row>
                              <v-btn
                                v-if="exportPermissionForAdvisor"
                                variant="text"
                                class="font-weight-regular"
                                :class="xsOnly ? 'ml-0 mr-0' : ''"
                                color="hyperlink"
                                size="x-small"
                                @click="exportToExcel()"
                              >
                                Export
                              </v-btn>
                              <v-divider v-if="exportPermissionForAdvisor" vertical class="ma-0 mb-n2 mx-3 height_32" />
                              <v-btn
                                variant="text"
                                class="font-weight-regular pl-0 ml-0"
                                color="hyperlink"
                                size="x-small"
                                :disabled="
                                  (!showEmployerSponsored && !showSchool && !showMunicipalities && !showIndividuals) ||
                                  showStarred
                                "
                                @click="openAdvanceFilter()"
                              >
                                Filter
                              </v-btn>
                            </v-row>
                          </v-col>
                          <v-col xl="5" md="8" sm="8" cols="12" class="d-flex justify-end pa-0" :lg="width > 1366 ? '6' : '7'">
                            <v-row>
                              <v-col
                                xl="6"
                                lg="6"
                                md="3"
                                sm="4"
                                class="pt-3 font-weight-medium pb-0 pl-0"
                                :class="xsOnly ? '' : mdOnly ? 'text-right pr-3' : 'text-right pr-6'"
                              >
                                Sort results by
                              </v-col>
                              <v-col xl="6" lg="6" md="9" sm="8">
                                <v-select
                                  v-model="participantSortByType"
                                  :menu-props="{ zIndex: '9999' }"
                                  :items="participantSortByListType"
                                  item-props.disabled="disabled"
                                  :class="xsOnly ? 'reduceFontSizeSmall' : 'reduceFontSize'"
                                  :disabled="searchLoading"
                                  hide-details
                                  @update:model-value="getSortByData"
                                >
                                  <template #selection="{ item }">
                                    <span class="text-accent">{{ item.text }}</span>
                                  </template>
                                  <template #item="slotProps">
                                    <span class="text-accent">{{ slotProps.item.text }}</span>
                                  </template>
                                </v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                      <ClientIndividual
                        :key="componentIndividualKey"
                        ref="individualComponent"
                        :zipcode="zipcode"
                        :radius="searchRadius"
                      />
                      <Loader
                        :loadingText="
                          searchText ? `Finding plans ${searchText}` : zipcode ? `Finding plans in ${zipcode}` : 'Loading....'
                        "
                        :loading="searchLoading"
                        :count="totalIndividualPlans"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-show="prospectTab === 4">
              <v-col cols="12">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="12">
                    <v-card class="elevation-0" width="100%">
                      <ClientFavorite :key="componentFavouriteKey" :favoriteList="favoriteList" :searchLoading="searchLoading" />
                      <Loader
                        :loadingText="`Loading favorite clients`"
                        :loading="searchLoading"
                        :count="favoriteList ? favoriteList.length : 0"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
    <v-dialog v-model="advanceFilterModel" persistent scrollable max-width="1000px" :eager="true">
      <v-card>
        <v-card-title class="bg-accent">
          <v-col cols="12" class="pa-0">
            <v-row>
              <v-col cols="11" class="pa-0">
                <h4 v-if="prospectTab === 0" class="text-white">
                  <v-icon size="21" color="white" class="pr-1" />Advanced Search Filters for Plans
                </h4>
                <h4 v-if="prospectTab === 3" class="text-white">
                  <v-icon size="21" color="white" class="pr-1 icon-individual" />Advanced Search Filters for Individuals
                </h4>
              </v-col>
              <v-col cols="1" class="pa-0 text-right">
                <v-icon size="21" color="white" @click="closeAdvanceFilter()"> close </v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-card-title>
        <v-card-text class="rbcchart_height">
          <ClientAdvanceFilter ref="advanceFilter" :prospect-tab="prospectTab" />
        </v-card-text>
        <v-divider class="my-3" />
        <v-card-actions>
          <v-col cols="12" class="text-right pa-0">
            <v-btn variant="text" color="accent" class="text-none" @click="resetFilter()"> Cancel, don't apply filter </v-btn>
            <v-btn color="accent" :disabled="searchLoading" :loading="searchLoading" @click="applyAdvanceFilter()">
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
  </v-col>
</template>
<script>
import ClientAdvanceFilter from '@/components/Retention/ClientPlan/ClientAdvanceFilter'
import ClientIndividual from '@/components/Retention/ClientPlan/ClientIndividual'
import ClientFavorite from '@/components/Retention/ClientPlan/ClientFavorite'
import PlanStar from '@/components/TAL/PlanStar'
import Loader from '@/components/NewLoader'
import * as XLSX from 'xlsx'
import planfinderlist from '@/assets/planfinder.json'
import RBCReport from '@/components/Retention/RBCReport'
import qs from 'qs'
import GlobalFilter from '@/components/GlobalFilter'
import { ref, computed, watch, onMounted, getCurrentInstance, watchEffect, inject, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
export default {
  components: {
    PlanStar,
    ClientIndividual,
    Loader,
    ClientAdvanceFilter,
    RBCReport,
    GlobalFilter,
    ClientFavorite
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const toast = inject('toast')
    const route = useRoute()
    const router = useRouter()
    const disableSearch = ref(false)
    const planId = ref(null)
    const showFilter = ref(false)
    const headerList = ref([
      {
        title: 'Plan Name',
        key: 'NAME',
        align: 'start pl-2 pr-2 sticky-header',
        sortable: false
      },
      {
        title: 'Total Plan Assets',
        key: 'ASSETS',
        align: 'end sticky-header d-none d-sm-none d-md-table-cell',
        sortable: false
      },
      {
        title: 'Plan Year',
        key: 'PLANYEAREND',
        align: 'start sticky-header d-none d-sm-none d-md-table-cell',
        sortable: false
      },
      {
        title: 'Plan Type',
        key: 'PlanType',
        align: 'start sticky-header d-none d-sm-none d-md-table-cell',
        sortable: false
      },
      {
        title: 'Plan Status',
        key: 'PlanStatus',
        align: 'start sticky-header d-none d-sm-none d-md-table-cell',
        sortable: false
      },
      {
        title: 'Participants',
        key: 'TotalEmployees',
        align: 'end sticky-header d-none d-sm-none d-md-table-cell',
        sortable: false
      },
      {
        title: 'TPA',
        key: 'TPA',
        align: 'start sticky-header d-none d-sm-none d-md-table-cell',
        sortable: false
      },
      {
        title: 'Relationship Manager',
        key: 'RelationshipManagerName',
        align: 'start sticky-header d-none d-sm-none d-md-none d-lg-table-cell',
        sortable: false
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center sticky-header',
        width: '150px',
        sortable: false
      }
    ])
    const radiusList = ref([
      { text: 'within 5 miles', value: 5 },
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
    const searchRadius = ref(null)
    const zipcode = ref(null)
    const prevRoute = ref(null)
    const advanceFilterModel = ref(false)
    const closeReportPopUp = ref({})
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref(null)
    const searchLoading = ref(false)
    const clearValue = ref(planfinderlist.clearValue)
    const loading = ref(false)
    const componentKey = ref(0)
    const componentIndividualKey = ref(0)
    const componentFavouriteKey = ref(0)
    const componentBookmarkKey = ref(0)
    const showStarred = ref(false)
    const hideCard = ref(false)
    const sponsorList = ref([])
    const businessType = ref([
      {
        text: 'Plans',
        value: 0,
        icon: '',
        color: '',
        disabled: false,
        show: true
      },
      {
        text: 'Individuals',
        value: 3,
        icon: 'icon-individual',
        color: 'participantIcon',
        disabled: false,
        show: true
      },
      {
        divider: true,
        show: true
      },
      {
        text: 'My favorites',
        value: 4,
        icon: 'icon-bookmark',
        color: 'forProfitIcon',
        disabled: false,
        show: true
      }
    ])
    const prospectTab = ref(0)
    const searchText = ref(null)
    const filterPlans = ref([])
    const filterSchools = ref([])
    const filterMunicipalities = ref([])
    const filterIndividual = ref([])
    const searchResult = ref([])
    const savePlans = ref([])
    const individualData = ref([])
    const individualSearchResult = ref([])
    const favoriteList = ref([])
    const totalReport = ref(8)
    const constantPlanCount = ref(0)
    const individualDataCount = ref(0)
    const cancelToken = ref(null)
    const showloader = ref(false)
    const showSearch = ref(false)
    const planSortByType = ref('NAME-ASC')
    const employeeSortByListType = ref([
      { text: 'Plan Name - A to Z', value: 'NAME-ASC' },
      { text: 'Plan Name - Z to A', value: 'NAME-DESC' },
      { text: 'Total Plan Assets - Low to High', value: 'ASSETS-ASC' },
      { text: 'Total Plan Assets - High to Low', value: 'ASSETS-DESC' },
      { text: 'Plan Year - Low to High', value: 'PLANYEAREND-ASC' },
      { text: 'Plan Year - High to Low', value: 'PLANYEAREND-DESC' },
      { text: 'Plan Type - A to Z', value: 'PlanType-ASC' },
      { text: 'Plan Type - Z to A', value: 'PlanType-DESC' },
      { text: 'Plan Status - A to Z', value: 'PlanStatus-ASC' },
      { text: 'Plan Status - Z to A', value: 'PlanStatus-DESC' },
      { text: 'Participants - Low to High', value: 'TotalEmployees-ASC' },
      { text: 'Participants - High to Low', value: 'TotalEmployees-DESC' },
      { text: 'TPA - A to Z', value: 'TPA-ASC' },
      { text: 'TPA - Z to A', value: 'TPA-DESC' },
      {
        text: 'Relationship Manager - A to Z',
        value: 'RelationshipManagerName-ASC'
      },
      {
        text: 'Relationship Manager - Z to A',
        value: 'RelationshipManagerName-DESC'
      }
    ])
    const participantSortByType = ref('ParticipantName-Asc')
    const participantSortByListType = ref([
      {
        text: 'Participant Name - A to Z',
        value: 'ParticipantName-Asc'
      },
      { text: 'Participant Name - Z to A', value: 'ParticipantName-Desc' },
      { text: 'Participant Age - Low to High', value: 'Age-Asc' },
      { text: 'Participant Age - High to Low', value: 'Age-Desc' },
      { text: 'Salary - Low to High', value: 'Salary-Asc' },
      { text: 'Salary - High to Low', value: 'Salary-Desc' },
      { text: 'Plan Name - A to Z', value: 'PlanName-Asc' },
      { text: 'Plan Name - Z to A', value: 'PlanName-Desc' },
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
    ])
    const individualPage = ref(1)
    const totalIndividualPlans = ref(-1)
    const lgAndUp = ref(false)
    const xsOnly = ref(false)
    const smAndDown = ref(false)
    const mdAndUp = ref(false)
    const xlOnly = ref(false)
    const lgOnly = ref(false)
    const width = ref(0)
    const mdOnly = ref(false)
    const advanceFilter = ref(null)
    const individualComponent = ref(null)
    const wildCardSearch = ref(null)
    //computed
    const breadCrumb = computed(() => {
      return route.meta
    })
    const exportPermissionForAdvisor = computed(() => {
      if (
        $authz.hasPermission($authz.permissionSet.Clients_Export_Option__c, $authz.permission.Full) ||
        $store.state.advisorExportPermission === $authz.permission.FullAccess
      ) {
        return true
      } else {
        return false
      }
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
      return true
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
    const displayGlobalFilter = computed(() => {
      if (
        $authz.hasRole($authz.roles.SiteAdmin) ||
        $authz.hasRole($authz.roles.ProgramAdmin) ||
        $authz.hasRole($authz.roles.InternalAdmin) ||
        $authz.hasRole($authz.roles.FirmAdmin)
      ) {
        return $store.state.user.selectedProgram.accounts.length > 0
      }
      return false
    })
    const showLegalText = computed(() => {
      if (
        $store.state.user.selectedProgram &&
        $store.state.user.selectedProgram.legal_Policy__c &&
        $store.state.user.selectedProgram.legal_Policy__c.length <= 600
      ) {
        return true
      }
      return false
    })
    //watch
    watchEffect(() => {
      width.value = display.width.value
      mdOnly.value = display.md.value
      lgOnly.value = display.lg.value
      lgAndUp.value = display.lgAndUp.value
      xsOnly.value = display.xs.value
      smAndDown.value = display.smAndDown.value
      mdAndUp.value = display.mdAndUp.value
      xlOnly.value = display.xl.value
    })
    watch(
      businessType,
      () => {
        if (!showEmployerSponsored.value && !showSchool.value && !showMunicipalities.value) {
          var hideEmployeeSponsored = businessType.value.findIndex((a) => a.value === 0)
          if (hideEmployeeSponsored > -1) businessType.value.splice(hideEmployeeSponsored, 1)
        }
        if (!showIndividuals.value) {
          var hideIndividual = businessType.value.findIndex((a) => a.value === 3)
          if (hideIndividual > -1) businessType.value.splice(hideIndividual, 1)
        }
        sponsorList.value = businessType.value.slice(0)
        if (Object.keys($store.state.clientPlan).length > 0) {
          prospectTab.value = $store.state.clientPlan.prospectValue
        } else {
          prospectTab.value = sponsorList.value && sponsorList.value.length > 0 ? sponsorList.value[0].value : 0
        }
      },
      { deep: true },
      { immediate: true }
    )
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('applyClientSchoolFilteredData')
      eventBus.off('getClientStarredData')
      eventBus.off('clientMunicipalitiesFilteredData')
      eventBus.off('callParticipantApi')
      eventBus.off('clientPlanFilteredData')
    })
    //mounted
    onMounted(() => {
      $store.dispatch('getAccountList')
      $store.dispatch('getClientFilterValue')
      if ($store.state.clientPlan.prospectValue >= 0) {
        prospectTab.value = $store.state.clientPlan.prospectValue
      } else {
        var tabValue = sponsorList.value.filter((a) => a.show === true)
        if (tabValue && tabValue.length > 0) {
          var selectedTab = sponsorList.value.filter((a) => a.text === tabValue[0].text)
          if (selectedTab && selectedTab.length > 0) prospectTab.value = selectedTab[0].value
        }
      }
      updateClientModels()
    })
    //methods
    function closeAdvanceFilter() {
      advanceFilterModel.value = false
      searchLoading.value = false
    }
    function clearSearch() {
      hideCard.value = false
      searchText.value = null
      planId.value = null
      disableSearch.value = prospectTab.value !== 3 ? true : false
      if ($store.state.clientPlan.searchTypeSelected === 'Plans' && prospectTab.value === 0) {
        $store.state.clientPlan.plan = ''
        $store.state.clientPlan.planId = ''
      } else if ($store.state.clientPlan.searchTypeSelected === 'Individual' && prospectTab.value === 3) {
        $store.state.clientPlan.plan = ''
        $store.state.clientPlan.planId = ''
      }

      filterPlans.value = []
      filterSchools.value = []
      filterIndividual.value = []
      filterMunicipalities.value = []
      showloader.value = false
    }
    ///Observable Start
    async function participantIntersected() {
      if (!searchLoading.value) {
        if (parseInt(individualPage) > 1) {
          if (!searchText.value) {
            if (individualData.value && individualData.value.length > 0) {
              if (totalIndividualPlans.value < individualDataCount.value) {
                applyFilter('nextPage')
              }
            }
          }
        }
      }
    }
    ///Observable End
    ///Maintain user filter selection Start
    function updateClientModels() {
      if (Object.keys($store.state.clientPlan).length > 0) {
        showStarred.value = $store.state.clientPlan.showStarred
        planSortByType.value = $store.state.clientPlan.planSortByType ? $store.state.clientPlan.planSortByType : 'NAME-ASC'

        if ($store.state.clientPlan.searchTypeSelected === 'Plans' && prospectTab.value === 0) {
          searchText.value = $store.state.clientPlan.plan ? $store.state.clientPlan.plan : null
          planId.value = $store.state.clientPlan.planId ? $store.state.clientPlan.planId : null
          zipcode.value = $store.state.clientPlan.zipcode ? $store.state.clientPlan.zipcode : null
          searchRadius.value = $store.state.clientPlan.searchRadius ? $store.state.clientPlan.searchRadius : null
          disableSearch.value = $store.state.clientPlan.planId ? false : true
        } else if ($store.state.clientPlan.searchTypeSelected === 'Individual' && prospectTab.value === 3) {
          searchText.value = $store.state.clientPlan.plan ? $store.state.clientPlan.plan : null
          planId.value = $store.state.clientPlan.planId ? $store.state.clientPlan.planId : null
          showSearch.value = true
          disableSearch.value = false
        } else {
          searchText.value = null
          planId.value = null
          zipcode.value = null
          searchRadius.value = null
          disableSearch.value = false
        }
        if (prospectTab.value === 3) {
          showSearch.value = true
        } else {
          showSearch.value = searchText.value ? true : false
        }
        searchResult.value = $store.state.clientPlan.searchResult ? $store.state.clientPlan.searchResult : []
        savePlans.value = $store.state.clientPlan.savePlans ? $store.state.clientPlan.savePlans : []
        constantPlanCount.value = $store.state.clientPlan.constantPlanCount ? $store.state.clientPlan.constantPlanCount : 0
        individualData.value = $store.state.clientPlan.individualData ? $store.state.clientPlan.individualData : []
        individualDataCount.value = $store.state.clientPlan.individualDataCount ? $store.state.clientPlan.individualDataCount : 0
        componentBookmarkKey.value += 1
        eventBus.emit('refreshClientBookMark')
        if (constantPlanCount.value === 0 && searchResult.value.length === 0 && prospectTab.value === 0) {
          applyFilter('search')
        } else if (individualDataCount.value === 0 && individualData.value.length === 0 && prospectTab.value === 3) {
          applyFilter('search')
        } else if (prospectTab.value === 4) {
          searchRadius.value = null
          zipcode.value = null
          showSearch.value = false
          showStarred.value = true
          getStarredValue(true)
        }
      } else {
        if (!zipcode.value && !searchText.value) {
          applyFilter('pageLoad')
        } else if (zipcode.value && !searchText.value && zipcode.value !== 'Current Location') {
          applyFilter('pageLoad')
        } else if ((!zipcode.value || zipcode.value === 'Current Location') && !searchText.value) {
          $store.dispatch('getUser').then(() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
            }
          })
        }
      }
    }
    function getCustomerType() {
      if (searchText.value) {
        $store.state.clientPlan.plan = ''
        $store.state.clientPlan.planId = ''
        searchText.value = null
        planId.value = null
        filterPlans.value = []
        filterSchools.value = []
        filterMunicipalities.value = []
        filterIndividual.value = []
        disableSearch.value = false
      }
      if (prospectTab.value === 3) {
        searchRadius.value = null
        zipcode.value = null
        showSearch.value = true
        disableSearch.value = false
      }
      if (prospectTab.value === 4) {
        searchRadius.value = null
        zipcode.value = null
        showSearch.value = false
        showStarred.value = true
        $store.state.clientPlan.prospectValue = prospectTab
        $store.state.clientPlan.showStarred = showStarred
        getStarredValue(true)
      } else {
        $store.state.clientPlan.showStarred = false
        showStarred.value = false
        $store.state.clientPlan.prospectValue = prospectTab
        updateClientModels()
      }
    }
    ///Starred Code Start
    async function getStarredValue(val) {
      if (showStarred.value) {
        searchLoading.value = val
        if (val) favoriteList.value = []
        var starredPromise = []
        var starredPlans = []
        var starredSchoolPlans = []
        var starredMunicipalitiesPlans = []
        var starredParticipant = []
        var planResult = []
        var individualValue = []
        if (showEmployerSponsored.value) {
          starredPlans =
            $store.state.starredLivePlans && $store.state.starredLivePlans.planList ? $store.state.starredLivePlans.planList : []
          starredPlans = starredPlans.filter((n) => n)
        }
        if (showSchool.value) {
          starredSchoolPlans = $store.state.starredLivePlans.schoolList ? $store.state.starredLivePlans.schoolList : []
          starredSchoolPlans = starredSchoolPlans.filter((n) => n)
        }
        if (showMunicipalities.value) {
          starredMunicipalitiesPlans = $store.state.starredLivePlans.municipalitiesList
            ? $store.state.starredLivePlans.municipalitiesList
            : []
          starredMunicipalitiesPlans = starredMunicipalitiesPlans.filter((n) => n)
        }
        if (starredSchoolPlans && starredSchoolPlans.length > 0) Array.prototype.push.apply(starredPlans, starredSchoolPlans)

        if (starredMunicipalitiesPlans && starredMunicipalitiesPlans.length > 0)
          Array.prototype.push.apply(starredPlans, starredMunicipalitiesPlans)

        if (starredPlans && starredPlans.length > 0) {
          if ($store.state.user.reliusLoginId) {
            starredPromise.push(
              $axios.post(`/api/v1/retention/rbc/starredprospects`, starredPlans).then((success) => {
                planResult = success.data.d && success.data.d.length > 0 ? success.data.d : []
                if (planResult && planResult.length > 0) {
                  planResult.forEach((element) => {
                    element.favoriteId = element.PLANID
                  })
                }
              })
            )
          }
        }
        if (showIndividuals.value) {
          starredParticipant =
            $store.state.starredLivePlans.participantList && $store.state.starredLivePlans.participantList.length > 0
              ? $store.state.starredLivePlans.participantList
              : []
          if (starredParticipant && starredParticipant.length > 0) {
            var FilterParticipantDetails = {}
            FilterParticipantDetails.Page = individualPage.value ? individualPage : 1
            FilterParticipantDetails.Hasloan = -1
            FilterParticipantDetails.Searchcriteria = ''
            FilterParticipantDetails.StarredHouseHoldIds = starredParticipant
            FilterParticipantDetails.SortColumn = 'ParticipantName'
            FilterParticipantDetails.SortBy = 'Asc'

            if ($store.state.user.reliusLoginId) {
              starredPromise.push(
                $axios.post(`/api/v1/rbc/paginatedparticipantdetails`, FilterParticipantDetails).then((success) => {
                  individualValue =
                    success.data.d && success.data.d.individualData && success.data.d.individualData.length > 0
                      ? success.data.d.individualData
                      : []
                  if (individualValue.length > 0) {
                    individualValue.forEach((element) => {
                      element.PlanBusinessType = 'Individuals'
                      element.favoriteId = element.ssn
                    })
                  }
                })
              )
            }
          }
        }
        await Promise.allSettled(starredPromise)
        favoriteList.value = planResult
        if (individualValue && individualValue.length > 0) Array.prototype.push.apply(favoriteList, individualValue)
        componentFavouriteKey.value += 1
        searchLoading.value = false
      }
    }
    ///Starred Code Finish
    ///Autocomplete Start
    function showHideSearch() {
      showSearch.value = !showSearch.value
      if (prospectTab.value === 3) showSearch.value = true
      if (showSearch.value === false) {
        if (Object.keys($store.state.clientPlan).length > 0) {
          zipcode.value = $store.state.clientPlan.zipcode ? $store.state.clientPlan.zipcode : null
          searchRadius.value = $store.state.clientPlan.searchRadius ? $store.state.clientPlan.searchRadius : 0
          searchText.value = null
          planId.value = null
          disableSearch.value = false
        } else {
          if (!zipcode.value && !searchText.value) {
            applyFilter('search')
          } else if (zipcode.value && !searchText.value && zipcode.value !== 'Current Location') {
            applyFilter('search')
          } else if ((!zipcode.value || zipcode.value === 'Current Location') && !searchText.value) {
            $store.dispatch('getUser').then(() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
              }
            })
          }
        }
      } else {
        disableSearch.value = true
        clearFilter(false)
        if (advanceFilter.value) {
          advanceFilter.value.getFilterChips()
          advanceFilter.value.setStoreValues()
        }
      }
    }
    function getPlanValue(val) {
      searchText.value = val.Name
      planId.value = val.PlanId
      filterPlans.value = []
      filterSchools.value = []
      filterIndividual.value = []
      filterMunicipalities.value = []
      disableSearch.value = prospectTab.value === 3 ? true : false
      clearFilter(true)
    }
    function checkFields(val) {
      switch (val) {
        case 'company':
          zipcode.value = null
          zipcodeError.value = false
          zipcodeErrorMsg.value = null
          searchRadius.value = null
          showStarred.value = false
          if (searchText.value === '' || searchText.value === null || searchText.value === undefined) {
            filterPlans.value = []
            filterSchools.value = []
            filterIndividual.value = []
            filterMunicipalities.value = []
          }
          getPlanResults()
          break
        case 'location':
          searchText.value = null
          planId.value = null
          showStarred.value = false
          filterPlans.value = []
          filterSchools.value = []
          filterIndividual.value = []
          filterMunicipalities.value = []
          break
        case 'radius':
          searchText.value = null
          planId.value = null
          showStarred.value = false
          if (!zipcode.value && zipcode.value === 'Current Location') {
            getCurrentLocation()
          } else {
            applyFilter('search')
          }
          break
        default:
          break
      }
    }
    function searchAreaFocusOut() {
      hideCard.value = false
      filterPlans.value = []
      filterSchools.value = []
      filterIndividual.value = []
      filterMunicipalities.value = []
    }
    async function getPlanResults() {
      if (searchText.value) {
        showloader.value = true
        if (cancelToken.value) cancelToken.value.cancel()
        cancelToken.value = $axios.CancelToken.source()
        hideCard.value = true
        if (prospectTab.value === 3) {
          if ($store.state.user.reliusLoginId) {
            await $axios
              .get(`/api/v1/rbc/autocomplete/participantDetails/${event.target.value}`, {
                cancelToken: cancelToken.value.token
              })
              .then((success) => {
                filterIndividual.value = success.data.d ? success.data.d : []
                showloader.value = false
              })
              .catch(() => {
                showloader.value = false
              })
          }
        } else {
          const config = {
            method: 'get',
            url: `/api/v1/rbc/autocomplete/plan/${event.target.value}`
          }
          let res = await $axios(config, {
            cancelToken: cancelToken.value.token
          })
          var response = res.data.d && res.data.d.length > 0 ? res.data.d : []
          if (response.length > 0) {
            response = response.filter((b) => b.PlanBusinessType)
            if (showEmployerSponsored.value)
              filterPlans.value = response.filter((a) => a.PlanBusinessType === 'Employer Sponsored')
            if (showSchool.value) filterSchools.value = response.filter((a) => a.PlanBusinessType === 'School')
            if (showMunicipalities.value)
              filterMunicipalities.value = response.filter((a) => a.PlanBusinessType === 'Municipality')
            showloader.value = false
          } else {
            filterPlans.value = []
            filterSchools.value = []
            filterIndividual.value = []
            filterMunicipalities.value = []
            showloader.value = false
          }
        }
      } else {
        showloader.value = false
        hideCard.value = false
      }
    }
    ///Autocomplete Finish
    ///Zipcode Validation Start
    function getCurrentLocation() {
      zipcode.value = 'Current Location'
      checkCurrentLocation('current_location')
    }
    async function getAddress(zipcode) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode}` }, (results, status) => {
          if (status === 'OK') {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.exec(zipcode)) {
              zipcodeError.value = false
              zipcodeErrorMsg.value = null
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
    }
    async function checkCurrentLocation(from) {
      if (zipcode.value && zipcode.value !== 'Current Location') {
        var isValidZip = await getAddress(zipcode)
        if (!isValidZip) return
      }
      if (zipcode.value === 'Current Location') {
        if (prospectTab.value === 3) {
          individualPage.value = 1
          individualData.value = []
          individualSearchResult.value = []
          totalIndividualPlans.value = -1
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
        zipcodeErrorMsg.value = null
        if (from === 'search') {
          if (prospectTab.value === 3) {
            individualPage.value = 1
            individualData.value = []
            individualSearchResult.value = []
            totalIndividualPlans.value = -1
          }
          applyFilter('search')
        }
      }
    }
    function showCurrentError() {
      zipcode.value = $store.state.user.zipCode
      if (Object.keys($store.state.clientPlan).length > 0)
        zipcode.value = $store.state.clientPlan.zipcode ? $store.state.clientPlan.zipcode : $store.state.user.zipCode
      applyFilter('search')
    }
    // eslint-disable-next-line no-unused-vars
    function getZipcode(position, from) {
      zipcodeError.value = false
      zipcodeErrorMsg.value = null
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
                : $store.state.user.zipCode
          } else {
            if (Object.keys($store.state.clientPlan).length > 0) {
              zipcode.value = $store.state.clientPlan.zipcode
                ? $store.state.clientPlan.zipcode
                : success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : $store.state.user.zipCode
            } else {
              zipcode.value =
                success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : $store.state.user.zipCode
            }
          }
          applyFilter('search')
        })
    }
    function clearZip() {
      zipcode.value === null
      zipcodeError.value = false
      zipcodeErrorMsg.value = null
      searchRadius.value = null
    }
    function maskAllow(event) {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if (keyCode === 8 || keyCode === 46) {
        if (zipcode.value === 'Current Location') zipcode.value = null
      }
    }
    ///Zipcode Validation Finish
    function planInfo(planName, planID, source, item) {
      if (planID) {
        let type = item.PlanBusinessType
        $store.state.clientPlan.prospectValue = 0
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
        router.push(`/Retention/Plan/${planID}${query}`)
      } else {
        toast.info('Plan Information not found', { autoClose: 5000 })
        loading.value = false
      }
    }
    function handleScroll() {
      hideCard.value = false
    }
    function openFilter(val) {
      showFilter.value = val
    }
    function currencyFormat(value) {
      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    }
    function reportList(val) {
      totalReport.value = val.length
    }
    ///Advance Filter Start
    function applyAdvanceFilter() {
      if (prospectTab.value === 0) {
        searchResult.value = []
        searchText.value = null
        planId.value = null
        showSearch.value = false
        applyFilter('filter')
      } else if (prospectTab.value === 3) {
        individualPage.value = 1
        individualData.value = []
        individualSearchResult.value = []
        totalIndividualPlans.value = -1
        applyFilter('filter')
      }
    }
    function openAdvanceFilter() {
      advanceFilter.value.updateModels()
      advanceFilterModel.value = true
    }
    function resetFilter() {
      if (advanceFilter.value) {
        if (prospectTab.value === 0) {
          advanceFilter.value.resetPlanFilter()
        } else if (prospectTab.value === 3) {
          advanceFilter.value.resetIndividualFilter()
        }
      }
    }
    function onChipsClose(item) {
      if (advanceFilter.value) {
        advanceFilter[item.modelName] = item.defaultValue
        if (prospectTab.value === 0) {
          if (advanceFilter.value) {
            if (savePlans.value && savePlans.value.length > 0) {
              let employeeResult = savePlans
              let employeePlanType = advanceFilter.value.employerPlanType ? advanceFilter.value.employerPlanType : ''
              let employeeAssetValue = advanceFilter.value.employerAsset ? advanceFilter.value.employerAsset : {}
              let employeeParticipant = advanceFilter.value.employerParticipant ? advanceFilter.value.employerParticipant : {}
              let employeeTPA = advanceFilter.value.employerTpa ? advanceFilter.value.employerTpa : ''
              let employeePlanYear = advanceFilter.value.employerPlanYear ? advanceFilter.value.employerPlanYear : ''
              let employeeRelationshipManager = advanceFilter.value.employerRelationshipManager
                ? advanceFilter.value.employerRelationshipManager
                : ''
              if (employeePlanType) {
                employeeResult.value = employeeResult.value.filter((a) => a.PlanType === employeePlanType)
              }
              if (Object.keys(employeeAssetValue).length > 0) {
                if (Number(employeeAssetValue.item1) >= 0 && Number(employeeAssetValue.item2) > 0) {
                  employeeResult.value = employeeResult.value.filter(
                    (a) => a.ASSETS >= Number(employeeAssetValue.item1) && a.ASSETS <= Number(employeeAssetValue.item2)
                  )
                }
              }
              if (Object.keys(employeeParticipant).length > 0) {
                if (Number(employeeParticipant.item1) >= 0 && Number(employeeParticipant.item2) > 0) {
                  employeeResult.value = employeeResult.value.filter(
                    (a) =>
                      a.TotalEmployees >= Number(employeeParticipant.item1) &&
                      a.TotalEmployees <= Number(employeeParticipant.item2)
                  )
                }
              }

              if (employeeTPA) {
                employeeResult.value = employeeResult.value.filter((a) => a.TPA === employeeTPA)
              }
              if (employeePlanYear) {
                employeeResult.value = employeeResult.value.filter((a) => a.PLANYEAREND === employeePlanYear)
              }
              if (employeeRelationshipManager) {
                employeeResult.value = employeeResult.value.filter(
                  (a) => a.RelationshipManagerName === employeeRelationshipManager
                )
              }
              searchResult.value = employeeResult && employeeResult.value.length > 0 ? employeeResult : []
              constantPlanCount.value = searchResult.value && searchResult.value.length > 0 ? searchResult.value.length : 0
              advanceFilter.value.getFilterChips()
              advanceFilter.value.setStoreValues()
            } else {
              applyFilter('filter')
            }
          }
        } else if (prospectTab.value === 3) {
          individualPage.value = 1
          individualData.value = []
          individualSearchResult.value = []
          totalIndividualPlans.value = -1
          applyFilter('filter')
        }
      }
    }
    function clearFilter(val) {
      if (advanceFilter.value) {
        if (prospectTab.value === 0) {
          advanceFilter.value.planChips.forEach((element) => {
            advanceFilter[element.modelName] = element.defaultValue
          })
          advanceFilter.value.getFilterChips()
          advanceFilter.value.setStoreValues()
        } else if (prospectTab.value === 3) {
          advanceFilter.value.participantChips.forEach((element) => {
            advanceFilter[element.modelName] = element.defaultValue
          })
          if (val) {
            individualPage.value = 1
            individualData.value = []
            individualSearchResult.value = []
            totalIndividualPlans.value = -1
          }
        }
        if (val) {
          applyFilter('searchText')
        }
      }
    }
    ///Advance Filter Finish
    function getSortByData() {
      if (prospectTab.value === 0) {
        searchResult.value = []
      } else if (prospectTab.value === 3) {
        individualPage.value = 1
        individualData.value = []
        individualSearchResult.value = []
        totalIndividualPlans.value = -1
        if (individualComponent.value) individualComponent.value.searchResult = []
      }
      applyFilter('sortBy')
    }
    ///Search plans
    async function applyFilter(val) {
      searchLoading.value = val === 'searchText' ? false : true
      if (val === 'searchText' && (prospectTab.value === 3 || prospectTab.value === 0)) searchLoading.value = true
      var promises = []
      var totalPlanCount = 0
      var accountId = []
      var contactId = []
      var rbcPlans = []
      var tsmPlans = []
      var employeeSponserUrl = `/api/v1/retention/rbc/myplans`
      let urlObj = {}
      let sortSelected = []
      if (Object.keys($store.state.globalFilter).length > 0) {
        if ($store.state.globalFilter.firm && $store.state.globalFilter.firm.length > 0) {
          accountId = $store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if ($store.state.globalFilter.advisor && $store.state.globalFilter.advisor.length > 0) {
          contactId = $store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      if (prospectTab.value === 0) {
        if (searchRadius.value && searchRadius.value !== undefined) {
          urlObj['radius'] = searchRadius
          employeeSponserUrl = `/api/v1/retention/rbc/myplans?${encodeQueryData(urlObj)}`
        }
        if (zipcode.value && zipcode.value !== 'Current Location') {
          urlObj['zipCode'] = zipcode
          employeeSponserUrl = `/api/v1/retention/rbc/myplans?${encodeQueryData(urlObj)}`
        }
        if (searchText.value) {
          urlObj['searchCriteria'] = planId
          employeeSponserUrl = `/api/v1/retention/rbc/myplans?${encodeQueryData(urlObj)}`
        }
        if (prospectTab.value === 0) {
          if (planSortByType.value) {
            sortSelected = planSortByType.value.split('-')
          } else sortSelected = []
        }
        if (sortSelected && sortSelected.length > 0) {
          urlObj['sortColumn'] = sortSelected && sortSelected.length > 0 ? sortSelected[0] : 'NAME'
          urlObj['sortBy'] = sortSelected && sortSelected.length > 0 ? sortSelected[1] : 'ASC'
          employeeSponserUrl = `/api/v1/retention/rbc/myplans?${encodeQueryData(urlObj)}`
        }

        if ($store.state.user.reliusLoginId) {
          promises.push(
            $axios
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

        if ($store.state.user.tsmLoginId) {
          promises.push(
            $axios.get(`/api/v1/retention/tsm/myplans`).then((success) => {
              tsmPlans = success.data.d && success.data.d.length > 0 ? success.data.d : []
            })
          )
        }
        await Promise.allSettled(promises)
        savePlans.value = rbcPlans.concat(tsmPlans)
        $store.state.clientPlan.savePlans = savePlans
        if (savePlans.value && savePlans.value.length > 0) {
          if (showEmployerSponsored.value || showSchool || showMunicipalities) {
            var employeeResult = savePlans
            if (advanceFilter.value) {
              let employeePlanType = advanceFilter.value.employerPlanType ? advanceFilter.value.employerPlanType : ''
              let employeeAssetValue = advanceFilter.value.employerAsset ? advanceFilter.value.employerAsset : {}
              let employeeParticipant = advanceFilter.value.employerParticipant ? advanceFilter.value.employerParticipant : {}
              let employeeTPA = advanceFilter.value.employerTpa ? advanceFilter.value.employerTpa : ''
              let employeePlanYear = advanceFilter.value.employerPlanYear ? advanceFilter.value.employerPlanYear : ''
              let employeeRelationshipManager = advanceFilter.value.employerRelationshipManager
                ? advanceFilter.value.employerRelationshipManager
                : ''
              if (employeePlanType) {
                employeeResult.value = employeeResult.value.filter((a) => a.PlanType === employeePlanType)
              }
              if (Object.keys(employeeAssetValue).length > 0) {
                if (Number(employeeAssetValue.item1) >= 0 && Number(employeeAssetValue.item2) > 0) {
                  employeeResult.value = employeeResult.value.filter(
                    (a) => a.ASSETS >= Number(employeeAssetValue.item1) && a.ASSETS <= Number(employeeAssetValue.item2)
                  )
                }
              }
              if (Object.keys(employeeParticipant).length > 0) {
                if (Number(employeeParticipant.item1) >= 0 && Number(employeeParticipant.item2) > 0) {
                  employeeResult.value = employeeResult.value.filter(
                    (a) =>
                      a.TotalEmployees >= Number(employeeParticipant.item1) &&
                      a.TotalEmployees <= Number(employeeParticipant.item2)
                  )
                }
              }

              if (employeeTPA) {
                employeeResult.value = employeeResult.value.filter((a) => a.TPA === employeeTPA)
              }
              if (employeePlanYear) {
                employeeResult.value = employeeResult.value.filter((a) => a.PLANYEAREND === employeePlanYear)
              }
              if (employeeRelationshipManager) {
                employeeResult.value = employeeResult.value.filter(
                  (a) => a.RelationshipManagerName === employeeRelationshipManager
                )
              }

              searchResult.value = employeeResult && employeeResult.value.length > 0 ? employeeResult : []
              constantPlanCount.value = searchResult.value && searchResult.value.length > 0 ? searchResult.value.length : 0
              advanceFilter.value.getFilterChips()
            }
          }
        } else {
          if (prospectTab.value === 0) {
            searchResult.value = []
            constantPlanCount.value = 0
          }
          searchLoading.value = false
        }
      }
      if (showIndividuals.value && prospectTab.value === 3) {
        if (participantSortByType.value) {
          sortSelected = participantSortByType.value.split('-')
        } else sortSelected = []

        var FilterParticipantDetails = {}
        if (advanceFilter.value) {
          FilterParticipantDetails = advanceFilter.value.getParticipantSearchRequest()
        }
        FilterParticipantDetails.Page = individualPage.value ? individualPage : 1
        FilterParticipantDetails.Hasloan = FilterParticipantDetails.Hasloan
          ? FilterParticipantDetails.Hasloan === 'Has a Loan'
            ? 1
            : 0
          : -1
        FilterParticipantDetails.AccountId = accountId
        FilterParticipantDetails.AdvisorContactId = contactId
        FilterParticipantDetails.Searchcriteria = searchText.value ? searchText : ''
        FilterParticipantDetails.StarredHouseHoldIds = []
        FilterParticipantDetails.SortColumn = sortSelected && sortSelected.length > 0 ? sortSelected[0] : 'ParticipantName'
        FilterParticipantDetails.SortBy = sortSelected && sortSelected.length > 0 ? sortSelected[1] : 'Asc'

        if ($store.state.user.reliusLoginId) {
          promises.push(
            $axios.post(`/api/v1/rbc/paginatedparticipantdetails`, FilterParticipantDetails).then((success) => {
              let resultSet =
                success.data.d && success.data.d.individualData && success.data.d.individualData.length > 0
                  ? success.data.d.individualData
                  : []

              if (individualData.value && individualData.value.length > 0) {
                Array.prototype.push.apply(individualData, resultSet)
              } else individualData.value = resultSet
              individualDataCount.value = success.data.d.rowcount[0].RowsCount
              individualPage.value = success.data.d.rowcount[0].CurrentPageNumber
            })
          )
          await Promise.allSettled(promises)
          totalIndividualPlans.value = individualData.value && individualData.value.length > 0 ? individualData.value.length : -1

          if (advanceFilter.value) {
            advanceFilter.value.getIndividualFilterChips()
          }
          advanceFilterModel.value = false
          if (totalIndividualPlans.value > 0) {
            individualPage.value++
          }
          searchLoading.value = false
        } else {
          searchLoading.value = false
          individualData.value = []
          individualDataCount.value = 0
          totalIndividualPlans.value = -1
          individualPage.value = 1
        }
      }
      await Promise.allSettled(promises)
      if (Object.keys($store.state.clientPlan).length > 0) {
        if (zipcode.value !== $store.state.clientPlan.zipcode || searchRadius.value !== $store.state.clientPlan.searchRadius) {
          if (prospectTab.value !== 3) {
            $store.state.clientPlan.individualSearchResult = []
            $store.state.clientPlan.individualDataCount = 0
            $store.state.clientPlan.individualData = []
            individualData.value = []
            individualSearchResult.value = []
            individualDataCount.value = 0
            individualPage.value = 1
          } else if (prospectTab.value === 3) {
            $store.state.clientPlan.searchResult = []
            $store.state.clientPlan.constantPlanCount = 0
            constantPlanCount.value = 0
            searchResult.value = []
          }
        }
      }
      $store.state.clientPlan.zipcode = zipcode.value ? zipcode : ''
      $store.state.clientPlan.searchRadius = searchRadius.value ? searchRadius.value : 0
      if (advanceFilter.value) {
        advanceFilter.value.setStoreValues()
      }

      if (showEmployerSponsored.value && prospectTab.value === 0) {
        totalPlanCount = constantPlanCount
        $store.state.clientPlan.planSortByType = planSortByType
        $store.state.clientPlan.searchResult = searchResult
        $store.state.clientPlan.constantPlanCount = constantPlanCount
        if (searchResult.value.length === 1 && totalPlanCount === 1) {
          if (searchText.value) {
            $store.state.clientPlan.zipcode = searchResult.value[0].PlanSponsorBillingPostalCode
            $store.state.clientPlan.plan = searchText.value ? searchText : null
            $store.state.clientPlan.planId = planId.value ? planId : null
            $store.state.clientPlan.searchRadius = 10
            $store.state.clientPlan.prospectValue = 0
            $store.state.clientPlan.searchTypeSelected = 'Plans'
            planInfo(
              searchResult.value[0].NAME,
              searchResult.value[0].PLANID,
              searchResult.value[0].Source,
              searchResult.value[0]
            )
          }
        }
      }
      if (showIndividuals.value && prospectTab.value === 3) {
        totalPlanCount = individualDataCount
        $store.state.clientPlan.individualSearchResult = individualData
        $store.state.clientPlan.individualDataCount = individualDataCount
        $store.state.clientPlan.individualData = individualData
        $store.state.clientPlan.individualPage = individualPage.value ? individualPage : 1
        componentIndividualKey.value += 1
        if (individualDataCount.value === 1 && totalPlanCount === 1) {
          if (searchText.value) {
            $store.state.clientPlan.zipcode = individualData.value[0].zipCode
            $store.state.clientPlan.plan = searchText.value ? searchText : null
            $store.state.clientPlan.planId = planId.value ? planId : null
            $store.state.clientPlan.searchRadius = 10
            $store.state.clientPlan.prospectValue = 3
            $store.state.clientPlan.searchTypeSelected = 'Individual'
          }
        }
        if (advanceFilter.value) {
          advanceFilter.value.getIndividualFilterChips()
          advanceFilter.value.setStoreValues()
        }
      }
      advanceFilterModel.value = false
      if (totalPlanCount === 0 && val === 'search') {
        toast.clearAll()
        toast.info('No results found. Please refine your search criteria.', { autoClose: 5000 })
      } else {
        if (prospectTab.value === 3 && totalPlanCount > 0) {
          individualPage.value++
        }
      }
      searchLoading.value = false
    }
    function initiateManagePlanSSOLogin(planID, source) {
      if (!source) {
        if ($store.state.isImpersonating) {
          toast.warning('Plan Portal SSO is unavailable when impersonating another user.', { autoClose: 5000 })

          return
        }
        onPopUpEvent(`/api/v1/retention/pcs401k/sso/initiate?key=${planID}&target=plan`, '_AccountLink')
      } else onPopUpEvent(`/api/v1/retention/tsm/sso/initiate?planId=${planID}`, `_${source}`)
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          //$FModal.show({ component: PdfViewer, maxHeight: '98%', width: '98%', clickToClose: false }, { pdfUrl: url })
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
    ///Excel Download Start
    function exportToExcel() {
      var xlHeaders = []
      var planResult = []
      var xlIndividualHeaders = []
      var individualResults = []

      var wb = XLSX.utils.book_new()

      if (
        searchResult.value.length > 0 &&
        prospectTab.value === 0 &&
        (showEmployerSponsored.value || showSchool || showMunicipalities)
      ) {
        xlHeaders = ExportPlan(searchResult, 'Plans')
        planResult = XLSX.utils.json_to_sheet(xlHeaders)
        XLSX.utils.book_append_sheet(wb, planResult, 'Plans')
        for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
          currencyConvert(wb, 'E', Xrow, 'Plans')
        }
      }
      if (individualData.value.length > 0 && showIndividuals && prospectTab.value === 3) {
        xlIndividualHeaders = ExportIndividual(individualData, 'Individuals')
        individualResults = XLSX.utils.json_to_sheet(xlIndividualHeaders)
        XLSX.utils.book_append_sheet(wb, individualResults, 'Individuals')
        for (var XIndividualrow = 2; XIndividualrow !== xlIndividualHeaders.length + 2; ++XIndividualrow) {
          currencyConvert(wb, 'F', XIndividualrow, 'Individuals')
          currencyConvert(wb, 'G', XIndividualrow, 'Individuals')
          currencyConvert(wb, 'H', XIndividualrow, 'Individuals')
          currencyConvert(wb, 'I', XIndividualrow, 'Individuals')
          currencyConvert(wb, 'J', XIndividualrow, 'Individuals')
          percentConvert(wb, 'K', XIndividualrow, 'Individuals')
        }
      }
      if (wb && wb.SheetNames && wb.SheetNames.length > 0) {
        XLSX.writeFile(wb, 'Plan.xlsx')
      }
    }
    function currencyConvert(xlWb, xlColRef, xlRowNum, sheetName) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets[sheetName][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    }
    function percentConvert(xlWb, xlColRef, xlRowNum, sheetName) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets[sheetName][xlColRef + xlRowNum], '0.00%')
    }
    function ExportPlan(plans) {
      var xlHeaders = plans.map((rec) => {
        return {
          'Plan ID': rec.PLANID,
          Name: rec.NAME,
          'EIN#': rec.EIN,
          'Type of Plan': rec.PlanType,
          'Total Plan Asset': rec.ASSETS,
          'Service Type': rec.ServiceType,
          Advisor: rec.Advisor,
          'Advisor Id': rec.AdvisorId,
          'Firm Id': rec.FirmId,
          'Firm Name': rec.FirmName,
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
          'Relationship Manager': rec.RelationshipManagerName,
          'Relationship Manager Email': rec.RelationshipManagerEmail,
          'Relationship Manager Firm': rec.RelationshipManagerFirm,
          'Relationship Manager Mobile': rec.RelationshipManagerMobile,
          'Relationship Manager Phone': rec.RelationshipManagerPhone
        }
      })
      return xlHeaders
    }
    function ExportIndividual(individual) {
      var xlHeaders = individual.map((rec) => {
        return {
          'Plan Id': rec.planID,
          'Plan Name': rec.plan,
          SSN: rec.displaySSN,
          Name: rec.name,
          Age: rec.age,
          'Account Balance': rec.balance ? parseFloat(rec.balance) : 0.0,
          'Loan Balance': rec.currentLoansBalanceAmt ? parseFloat(rec.currentLoansBalanceAmt) : 0.0,
          Salary: rec.income ? parseFloat(rec.income) : 0.0,
          'Employee Contribution': rec.savings ? parseFloat(rec.savings) : 0.0,
          'Employer Contribution': rec.employer ? parseFloat(rec.employer) : 0.0,
          'Equity Allocation': rec.ep ? parseFloat(rec.ep / 100) : 0.0,
          'Account Type': rec.accountType,
          'Account Status': rec.employmentStatus,
          'Plan Status': rec.planStatus,
          'Employment Status': rec.employmentStatus,
          'Termination Date': rec.terminationDate ? new Date(rec.terminationDate).toLocaleDateString() : '',
          EmailId: rec.internetAddr,
          Phone: rec.phone,
          'Street Address': rec.streetAddress,
          City: rec.city,
          State: rec.state,
          ZipCode: rec.zipCode
        }
      })
      return xlHeaders
    }
    ///Excel Download Finish
    function encodeQueryData(data) {
      const ret = []
      for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
      return ret.join('&')
    }
    function onlyNumber($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault()
      }
    }
    eventBus.on('getClientStarredData', () => {
      getStarredValue(false)
    })
    eventBus.on('callParticipantApi', () => {
      participantIntersected()
    })

    return {
      onlyNumber,
      showEmployerSponsored,
      showIndividuals,
      showMunicipalities,
      displayGlobalFilter,
      showLegalText,
      showSchool,
      breadCrumb,
      exportPermissionForAdvisor,
      disableSearch,
      planId,
      showFilter,
      headerList,
      radiusList,
      searchRadius,
      zipcode,
      prevRoute,
      advanceFilterModel,
      closeReportPopUp,
      zipcodeError,
      zipcodeErrorMsg,
      searchLoading,
      clearValue,
      loading,
      componentKey,
      componentIndividualKey,
      componentFavouriteKey,
      componentBookmarkKey,
      showStarred,
      hideCard,
      sponsorList,
      businessType,
      prospectTab,
      searchText,
      filterPlans,
      filterSchools,
      filterMunicipalities,
      filterIndividual,
      searchResult,
      savePlans,
      individualData,
      individualSearchResult,
      favoriteList,
      totalReport,
      constantPlanCount,
      individualDataCount,
      cancelToken,
      showloader,
      showSearch,
      planSortByType,
      employeeSortByListType,
      participantSortByType,
      participantSortByListType,
      individualPage,
      totalIndividualPlans,
      encodeQueryData,
      ExportIndividual,
      percentConvert,
      currencyConvert,
      exportToExcel,
      initiateManagePlanSSOLogin,
      applyFilter,
      getSortByData,
      clearFilter,
      onChipsClose,
      resetFilter,
      openAdvanceFilter,
      applyAdvanceFilter,
      reportList,
      currencyFormat,
      openFilter,
      handleScroll,
      planInfo,
      maskAllow,
      clearZip,
      getZipcode,
      showCurrentError,
      checkCurrentLocation,
      getAddress,
      getCurrentLocation,
      getPlanResults,
      searchAreaFocusOut,
      checkFields,
      getPlanValue,
      showHideSearch,
      getStarredValue,
      getCustomerType,
      updateClientModels,
      participantIntersected,
      clearSearch,
      closeAdvanceFilter,
      lgAndUp,
      xsOnly,
      smAndDown,
      mdAndUp,
      xlOnly,
      lgOnly,
      width,
      mdOnly,
      onPopUpEvent,
      advanceFilter,
      individualComponent,
      wildCardSearch
    }
  }
}
</script>
<style>
#myMap {
  height: 100%;
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
</style>
<style scoped>
.font_size_span {
  font-size: 1.077rem !important;
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
