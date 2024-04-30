<template>
  <v-col cols="12" xs="12" class="pa-0">
    <v-col v-if="favoriteList && favoriteList.length === 0 && !searchLoading" class="pa-0">
      <v-card :class="display.smAndDown.value ? 'elevation-0 pa-5' : 'elevation-6 pa-5'">
        <v-card-text class="justify-center text-center">
          <v-row justify="center" align="center" class="mt-8 mb-8">
            <v-col cols="12" xs="12" class="pa-0">
              <h2 class="mb-4">You have no favorites selected</h2>
            </v-col>
            <v-col cols="12" xs="12" class="pa-0">
              <h3 class="mb-3 font_14">Go ahead and favorite leads you want to follow up with.</h3>
            </v-col>
            <v-col cols="12" xs="12" class="pa-0">
              <v-icon size="32" class="cursor-pointer icon-bookmark" color="#119944" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-else cols="12" xs="12" class="pa-0">
      <v-data-table
        v-model:expanded="expanded"
        :headers="headerList"
        :items="favoriteList"
        item-key="favoriteId"
        :single-expand="true"
        :class="[display.smAndDown.value ? 'elevation-0 mb-3' : 'elevation-6 mb-3', showMap ? 'showMap' : 'hideMap']"
        :options="pagination"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
        mobile-breakpoint="0"
      >
        <template #item="{ item, isExpanded, expand }">
          <tr v-if="item.customerType === 'Schools'">
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row class="align-self">
                  <v-col
                    v-if="item.latitude && item.longitude"
                    cols="1"
                    xs="1"
                    lg="1"
                    md="1"
                    sm="1"
                    class="text-center d-flex flex_none mr-2 pa-0"
                    :class="showMap ? 'cursor-pointer' : ''"
                    @click="showMap ? mapHighlightForSchoolDistrict(item.id) : ''"
                  >
                    <v-icon size="16" class="icon-graduation schoolIcon" />
                  </v-col>
                  <v-col cols="1" xs="1" md="1" lg="1" sm="1" class="d-flex flex_none mr-2 pa-0">
                    <v-icon :ripple="false" size="12" class="schoolIcon removeOpacity" @click="expand(!isExpanded)">
                      {{ isExpanded ? 'mdi-menu-up' : 'mdi-menu-down' }}
                    </v-icon>
                  </v-col>
                  <v-col cols="9" xs="9" sm="9" lg="9" md="9" class="d-flex pa-0">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="schoolInfo(item)"
                          >{{ item.name ? item.name.toLowerCase() : '' }}</a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row>
                  <v-col class="flex_none mr-1 text-lowercase pa-0">
                    {{ `${item.numberofSchools} schools / ${item.employees} individuals /` }}
                  </v-col>
                  <v-col v-if="item.payrollSlot !== 'Approved'" class="pa-0">
                    <v-row>
                      <v-icon size="16" class="icon-warning pr-1" :color="!theme.dark ? '#ffbb11' : ''" />
                      <span>{{ item.payrollSlot }}</span>
                    </v-row>
                  </v-col>
                  <v-col v-else class="pa-0">
                    {{ item.payrollSlot }}
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-center pa-1">
              <v-row class="justify-center">
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <v-btn
                    :color="!theme.dark ? 'hyperlink' : ''"
                    variant="text"
                    icon
                    class="text-none"
                    @click.stop=";[(closeSchoolDistrictPopUp[item.id] = true), (optionsSeinpNO = item.id), (optionsItem = item)]"
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <PlanStar
                    style="line-height: 0.5"
                    :school-district-id="item.id"
                    from="TAL"
                    type="SchoolDistrict"
                    prospect-tab="5"
                  />
                </v-col>
              </v-row>
              <v-dialog
                :key="item.id"
                v-model="closeSchoolDistrictPopUp[item.id]"
                :scrollable="false"
                max-width="max-content"
                content-class="elevation-3"
              >
                <v-card>
                  <v-card-title class="pt-2 pb-2 mt-2 mb-2">
                    <v-col cols="12" xs="12" class="text-left">
                      <v-row>
                        <v-col cols="11" xs="11" class="text-left pa-0">
                          <h3>Actions</h3>
                        </v-col>
                        <v-col cols="1" xs="1" class="text-right align-self pa-0">
                          <v-icon
                            class="cursor-pointer"
                            :class="theme.dark ? '' : 'text-accent'"
                            @click="closeSchoolDistrictPopUp[item.id] = false"
                          >
                            mdi-close
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card-title>
                  <v-card-text class="pt-4">
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row>
                        <v-btn
                          block
                          class="ml-0"
                          :disabled="item.payrollSlot !== 'Approved'"
                          size="x-large"
                          :color="!theme.dark ? 'hyperlink text-white' : ''"
                          @click="
                            performSchoolAction(optionsSeinpNO, optionsItem, 'schoolDistrict', $event),
                              (closeSchoolDistrictPopUp[item.id] = false)
                          "
                        >
                          {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </td>
          </tr>
          <tr v-if="item.customerType === 'Individuals'">
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row class="align-self" no-gutters>
                  <v-col
                    v-if="
                      item.individualAccounts.length > 0 &&
                      item.individualAccounts[0].latitude &&
                      item.individualAccounts[0].longitude
                    "
                    cols="1"
                    xs="1"
                    lg="1"
                    md="1"
                    sm="1"
                    class="text-center d-flex flex_none mr-2 pa-0"
                    :class="showMap ? 'cursor-pointer' : ''"
                    @click="showMap ? mapHighlightForHousehold(item.individualAccounts[0].accountId) : ''"
                  >
                    <v-icon size="16" class="icon-individual participantIcon" />
                  </v-col>
                  <v-col
                    v-else
                    cols="1"
                    xs="1"
                    lg="1"
                    md="1"
                    sm="1"
                    class="text-center d-flex flex_none mr-2"
                    style="width: 16px"
                  />
                  <v-col cols="1" xs="1" class="d-flex flex_none mr-2 pa-0">
                    <v-icon :ripple="false" size="12" class="participantIcon removeOpacity" @click="expand(!isExpanded)">
                      {{ isExpanded ? 'mdi-menu-up' : 'mdi-menu-down' }}
                    </v-icon>
                  </v-col>
                  <v-col cols="9" xs="9" sm="9" md="9" lg="9" class="d-flex pa-0">
                    <v-hover v-slot="{ hover }">
                      <h4 class="pt-1">
                        <a
                          :class="[
                            !theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="householdInfo(item.householdId, item.householdName)"
                          >{{ item.householdName ? item.householdName.toLowerCase() : '' }}</a
                        >
                      </h4>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row no-gutters>
                  <v-col class="flex_none text-lowercase pa-0">
                    {{ `${formatPrice(item.totalValue, 2)} / ${item.accounts} accounts` }}
                  </v-col>
                  <v-col v-if="item.contact" class="flex_none mr-1 accent--ttext pa-0">
                    {{ `/ ${item.contact}` }}
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-center pa-1">
              <v-row class="justify-center">
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <v-btn
                    icon
                    :color="!theme.dark ? 'hyperlink' : ''"
                    variant="text"
                    @click.stop="
                      ;[
                        (closeIndividualReportPopUp[item.householdId] = true),
                        (optionsHouseholdID = item.householdId),
                        (optionsHouseholdItem = item)
                      ]
                    "
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <PlanStar
                    style="line-height: 0.5"
                    :household-id="item.householdId"
                    from="TAL"
                    type="Individual"
                    prospect-tab="5"
                  />
                </v-col>
              </v-row>
              <v-dialog
                :key="item.householdId"
                v-model="closeIndividualReportPopUp[item.householdId]"
                :scrollable="false"
                :max-width="300"
                content-class="elevation-3"
              >
                <v-card>
                  <v-card-title class="pt-2 pb-2 mt-2 mb-2">
                    <v-col cols="12" xs="12" class="text-left pa-0">
                      <v-row>
                        <v-col cols="11" xs="11" class="text-left pa-0">
                          <h3>Actions</h3>
                        </v-col>
                        <v-col cols="1" xs="1" class="text-right pa-0">
                          <v-icon
                            class="cursor-pointer"
                            :class="theme.dark ? '' : 'text-accent'"
                            @click="closeIndividualReportPopUp[item.householdId] = false"
                          >
                            mdi-close
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card-title>
                  <v-card-text class="pt-4">
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row no-gutters>
                        <v-col v-for="(item, index) in item.actionList" :key="`${index}_${item.value}`" cols="12" class="pa-0">
                          <v-btn
                            block
                            class="ml-0"
                            size="x-large"
                            :color="!theme.dark ? 'hyperlink text-white' : ''"
                            @click="performAction(closeIndividualReportPopUp, optionsHouseholdItem, item.value, $event)"
                          >
                            {{ item.text }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </td>
          </tr>
          <tr v-if="item.customerType === 'Employer Sponsored'" class="pa-0">
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row class="align-self">
                  <v-col
                    cols="1"
                    xs="1"
                    lg="1"
                    md="1"
                    class="text-center d-flex flex_none mr-2 pa-0"
                    :class="showMap ? 'cursor-pointer' : ''"
                    @click="showMap ? mapHighlight(item.SEINPNO) : ''"
                  >
                    <v-icon
                      v-if="item.PlANADDRESSLATITUDE && item.PLANADDRESSLONGITUDE"
                      size="16"
                      class="icon-for-profit forProfitIcon"
                    />
                  </v-col>
                  <v-col
                    cols="1"
                    xs="1"
                    lg="1"
                    md="1"
                    sm="1"
                    class="text-center d-flex flex_none mr-2 pa-0"
                    :style="`width:${item.PlANADDRESSLATITUDE && item.PLANADDRESSLONGITUDE ? '6px' : '23px'}`"
                  />
                  <v-col cols="9" xs="9" sm="9" md="9" lg="9" class="d-flex pa-0">
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
                        This Plan is already on the PCS Platform. Please contact <br />your regional sales team for more
                        information.</span
                      >
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td>
              <v-col cols="12" xs="12" class="pa-0">
                <v-row>
                  <v-col class="flex_none mr-1 text-lowercase">
                    {{ `${formatPrice(item.TOTASSETS, 2)} total assets / ${item.ACTPARTIC} active individuals` }}
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-center pa-1">
              <v-row class="justify-center">
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <v-btn
                    v-if="item.selectreport && item.selectreport.length > 0"
                    icon
                    :color="!theme.dark ? 'hyperlink' : ''"
                    variant="text"
                    @click.stop="
                      ;[(closeReportPopUp[item.SEINPNO] = true), (optionsSeinpNO = item.SEINPNO), (optionsItem = item)]
                    "
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
                <v-col cols="6" xs="6" class="flex_none pa-0">
                  <PlanStar :seinpno="item.SEINPNO" from="TAL" type="ForProfit" prospect-tab="5" />
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
                  <v-card-title class="pt-2 pb-2 mt-2 mb-2">
                    <v-col cols="12" xs="12" class="text-left">
                      <v-row>
                        <v-col cols="12" xs="12" class="text-right pa-0">
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
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row>
                        <v-col cols="12" xs="12" class="text-left">
                          <h3 class="font_16">
                            This Plan is already on the PCS Platform. Please contact your regional sales team for more
                            information.
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
                    <v-col cols="12" xs="12" class="text-left">
                      <v-row>
                        <v-col cols="11" xs="11" class="text-left pa-0">
                          <h3>Actions</h3>
                        </v-col>
                        <v-col cols="1" xs="1" class="text-right pa-0">
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
                    <v-col cols="12" xs="12" class="pa-0">
                      <v-row>
                        <v-hover v-for="(item, index) in item.selectreport" v-slot="{ hover }" :key="index">
                          <v-col
                            :xs="item.selectreport && item.selectreport.length === 4 ? '3' : '12'"
                            v-show="item.show === true"
                            :key="index"
                            :class="hover ? 'accent' : ''"
                            class="cursor-pointer flexclass pb-4 pt-4 text-center report_btn_border"
                            @click="
                              !item.disabled && !item.loader
                                ? checkReportOptions(optionsSeinpNO, optionsItem, item.value, $event)
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
                              :class="hover || theme.dark ? 'text-white font_size_13 ' : 'text-accent font_size_13 '"
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
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-col v-if="item.customerType === 'Schools'">
              <v-data-table
                :headers="nestedSchoolTableHeader"
                :items="item.schools ? item.schools : []"
                item-key="id"
                hide-default-footer
                :disable-pagination="true"
                class="nestedTable"
                mobile-breakpoint="0"
              >
                <template #item="{ item }">
                  <tr>
                    <td></td>
                    <td class="text-capitalize">
                      {{ item.name ? item.name.toLowerCase() : '' }}
                    </td>
                    <td v-if="display.smAndDown.value">
                      <v-col cols="12" xs="12" class="text-capitalize mt-2">
                        {{ item.name ? item.name.toLowerCase() : '' }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-2 mb-2">
                        {{ item.address }}
                      </v-col>
                    </td>
                    <td class="text-right">
                      {{ item.id }}
                    </td>
                    <td>
                      {{ item.type }}
                    </td>
                    <td class="text-right">
                      {{ item.employees }}
                    </td>
                    <td v-if="display.smAndDown.value">
                      <v-col cols="12" xs="12" class="pt-2 ml-2 pb-5">
                        {{ item.employees }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-2">
                        <v-btn
                          :color="!theme.dark ? 'hyperlink' : ''"
                          variant="text"
                          icon
                          class="text-none ma-0 pa-0"
                          @click.stop="
                            ;[(closeSchoolPopUp[item.id] = true), (optionsSchool = item.districtId), (optionSchoolItem = item)]
                          "
                        >
                          <v-icon size="21" class="icon-action" />
                        </v-btn>
                      </v-col>
                      <v-dialog
                        :key="item.id"
                        v-model="closeSchoolPopUp[item.id]"
                        :scrollable="false"
                        max-width="max-content"
                        content-class="elevation-3"
                      >
                        <v-card>
                          <v-card-title class="pt-2 pb-2 mt-2 mb-2">
                            <v-col cols="12" xs="12" class="text-left">
                              <v-row>
                                <v-col cols="11" xs="11" class="text-left pa-0">
                                  <h3>Actions</h3>
                                </v-col>
                                <v-col cols="1" xs="1" class="text-right align-self pa-0">
                                  <v-icon
                                    class="cursor-pointer"
                                    :class="theme.dark ? '' : 'text-accent'"
                                    @click="closeSchoolPopUp[item.id] = false"
                                  >
                                    mdi-close
                                  </v-icon>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-card-title>
                          <v-card-text class="pt-4">
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-btn
                                  block
                                  class="ml-0"
                                  :disabled="item.payrollSlot !== 'Approved'"
                                  size="x-large"
                                  :color="!theme.dark ? 'hyperlink text-white' : ''"
                                  @click="
                                    performAction(optionsSchool, optionSchoolItem, 'school', $event),
                                      (closeSchoolPopUp[item.id] = false)
                                  "
                                >
                                  {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                                </v-btn>
                              </v-row>
                            </v-col>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </td>
                    <td>
                      {{ item.address }}
                    </td>
                    <td class="text-center">
                      <v-row class="justify-center">
                        <v-col cols="12" xs="12" class="flex_none">
                          <v-btn
                            :color="!theme.dark ? 'hyperlink' : ''"
                            variant="text"
                            icon
                            class="text-none"
                            @click.stop="
                              ;[(closeSchoolPopUp[item.id] = true), (optionsSchool = item.districtId), (optionSchoolItem = item)]
                            "
                          >
                            <v-icon size="21" class="icon-action" />
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-dialog
                        :key="item.id"
                        v-model="closeSchoolPopUp[item.id]"
                        :scrollable="false"
                        max-width="max-content"
                        content-class="elevation-3"
                      >
                        <v-card>
                          <v-card-title class="pt-2 pb-2 mt-2 mb-2">
                            <v-col cols="12" xs="12" class="text-left">
                              <v-row>
                                <v-col cols="11" xs="11" class="text-left pa-0">
                                  <h3>Actions</h3>
                                </v-col>
                                <v-col cols="1" xs="1" class="text-right align-self pa-0">
                                  <v-icon
                                    class="cursor-pointer"
                                    :class="theme.dark ? '' : 'text-accent'"
                                    @click="closeSchoolPopUp[item.id] = false"
                                  >
                                    mdi-close
                                  </v-icon>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-card-title>
                          <v-card-text class="pt-4">
                            <v-col cols="12" xs="12" class="pa-0">
                              <v-row>
                                <v-btn
                                  block
                                  class="ml-0"
                                  :disabled="item.payrollSlot !== 'Approved'"
                                  size="x-large"
                                  :color="!theme.dark ? 'hyperlink text-white' : ''"
                                  @click="
                                    performSchoolAction(optionsSchool, optionSchoolItem, 'school', $event),
                                      (closeSchoolPopUp[item.id] = false)
                                  "
                                >
                                  {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                                </v-btn>
                              </v-row>
                            </v-col>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
            <v-col v-if="item.customerType === 'Individuals'">
              <v-data-table
                :headers="nestedIndividualTableHeader"
                :items="item.individualAccounts ? item.individualAccounts : []"
                item-key="accountId"
                hide-default-footer
                :disable-pagination="true"
                class="nestedTable"
                mobile-breakpoint="0"
              >
                <template #item="props">
                  <tr v-if="display.mdAndUp.value">
                    <td></td>
                    <td class="text-capitalize">
                      {{ props.item.accountName ? props.item.accountName.toLowerCase() : '' }}
                    </td>
                    <td>{{ props.item.accountType }}</td>
                    <td>{{ props.item.account }}</td>
                    <td class="text-right">
                      {{ formatPrice(props.item.totalValue, 2) }}
                    </td>
                    <td :class="!theme.dark ? 'text-hyperlink breakWord' : 'breakWord'">
                      {{ props.item.accountContact ? props.item.accountContact : '-' }}
                    </td>
                  </tr>
                  <tr v-else>
                    <td></td>
                    <td>
                      <v-col cols="12" xs="12" class="text-capitalize mb-1 mt-2">
                        {{ props.item.accountName ? props.item.accountName.toLowerCase() : '' }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-1">
                        {{ props.item.accountType }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-1">
                        {{ props.item.account }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-1">
                        {{ formatPrice(props.item.totalValue, 2) }}
                      </v-col>
                      <v-col cols="12" xs="12" class="mt-1 mb-2" :class="!theme.dark ? 'text-hyperlink' : ''">
                        {{ props.item.accountContact ? props.item.accountContact : '-' }}
                      </v-col>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </td>
        </template>
      </v-data-table>
    </v-col>
    <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="School" />
  </v-col>
</template>
<script>
import { ref, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme, useDisplay } from 'vuetify'
import PlanStar from '@/components/TAL/PlanStar'
import CustomIcon from '@/components/CustomIcon'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
export default {
  components: {
    PlanStar,
    CustomIcon,
    OpenAccount
  },
  props: ['showMap', 'favoriteList', 'mapFinderInfo', 'searchLoading'],
  setup(props) {
    const instance = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    const theme = useTheme()
    const display = useDisplay()
    const store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const toast = instance.appContext.config.globalProperties.$toast
    const $refs = instance.appContext.config.globalProperties.$refs
    const headerList = ref([
      {
        title: 'Name',
        value: 'Name',
        width: display.md.value ? '45%' : '40%',
        align: 'start',
        sortable: false,
        class: 'sticky-header'
      },
      {
        title: 'Description',
        value: 'Description',
        width: display.md.value ? '40%' : '45%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        title: 'Actions',
        value: '',
        width: '15%',
        align: 'center',
        sortable: false,
        class: 'sticky-header'
      }
    ])
    const expanded = ref([])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 20
    })
    const nestedSchoolTableHeader = ref([
      {
        title: '',
        value: '',
        align: display.xs.value ? 'center pr-6' : 'center',
        width: display.sm.value ? '1%' : '5%',
        sortable: false
      },
      {
        title: 'School Name',
        value: 'schoolName',
        align: 'start',
        width: display.lg.value || display.md.value ? '21%' : '25%',
        sortable: false
      },
      {
        title: 'School ID',
        value: 'schoolID',
        align: 'start',
        width: '10%',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'School Type',
        value: 'schoolType',
        align: 'start',
        width: '10%',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: '# Employees',
        value: 'Employees',
        align: display.mdAndUp.value ? 'end' : 'start',
        width: '15%',
        sortable: false
      },
      {
        title: 'Address',
        value: 'address',
        align: 'start',
        width: '35%',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Actions',
        value: '',
        width: '3%',
        align: 'center',
        sortable: false,
        class: 'hidden-sm-and-down'
      }
    ])
    const nestedIndividualTableHeader = ref([
      {
        title: '',
        value: '',
        align: display.smAndDown.value ? 'center pr-7' : 'center',
        width: '5%',
        sortable: false
      },

      {
        title: 'Accounts',
        value: 'accountName',
        width: display.smAndDown.value ? '95%' : '15%',
        align: 'start',
        sortable: false
      },
      {
        title: 'Account Type',
        value: 'accountType',
        width: '15%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Account #',
        value: 'account',
        width: '15%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Total Value',
        value: 'totalValue',
        width: '15%',
        align: 'end',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        title: 'Contact',
        value: 'accountContact',
        width: '35%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      }
    ])
    const item = ref([])
    const closeReportPopUp = ref({})
    const closeIndividualReportPopUp = ref({})
    const closeSchoolPopUp = ref({})
    const closeSchoolDistrictPopUp = ref({})
    const zipcode = ref(store.state.finderList.zipcode)
    const radius = ref(store.state.finderList.searchRadius)
    const filterDialog = ref(false)
    const performSchoolAction = (id, val, type) => {
      if (val) {
        var schoolDistrictValue = {}
        if (type === 'school') {
          var parentValue = props.favoriteList.filter((a) => a.favoriteId === id)
          schoolDistrictValue = parentValue && parentValue.length > 0 ? parentValue[0] : {}
        } else {
          schoolDistrictValue = val
        }
        var schoolNameVal = type === 'school' ? val.name : ''
        if ($refs.OpenAccount) $refs.OpenAccount.openTeacherAccount(schoolDistrictValue, schoolNameVal)
        store.state.openAccountDetail = {}
        filterDialog.value = true
      }
    }
    const onPopUpEvent = (url, data) => {
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
          onPopUpEvent(
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
        store.state.finderList.prospectValue = 5
        router.push({
          name: 'TALPlan',
          params: { id: seinpNO, planType: plan.DCPTYPE },
          query: { reportOption: val }
        })
      }
    }
    const performAction = (householdId, item, val) => {
      if (val === 'EmailReminder') {
        if (item.individualAccounts && item.individualAccounts.length > 0) {
          if (item.individualAccounts[0].accountContact) {
            window.location.href = `mailto:${item.individualAccounts[0].accountContact}`
          } else {
            window.location.href = 'mailto:'
          }
        } else {
          window.location.href = 'mailto:'
        }
      }
    }
    const householdInfo = (householdId, householdName) => {
      store.state.finderList.prospectValue = 5
      router
        .push({
          name: 'TALHouseholdResult',
          query: {
            householdId: householdId,
            householdName: householdName
          },
          params: {
            lastRoute: route.path
          }
        })
        .catch(() => {})
    }
    const mapHighlightForHousehold = (accountId) => {
      props.mapFinderInfo.highlightIndividualMarker(accountId)
    }
    const mapHighlightForSchoolDistrict = (schoolDistId) => {
      props.mapFinderInfo.highlightSchoolDistrictMarker(schoolDistId)
    }
    const schoolInfo = (schoolDistrictId) => {
      store.state.finderList.prospectValue = 5
      router
        .push({
          name: 'SchoolAccountDetails',
          query: {
            schoolDistId: schoolDistrictId.id,
            zipcode: schoolDistrictId.zipCode,
            radius: 50
          },
          params: {
            lastRoute: route.path
          }
        })
        .catch(() => {})
    }
    const mapHighlight = (seinpno) => {
      props.mapFinderInfo.highlightMarker(seinpno)
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
    const planInfo = (item) => {
      if (item.SEINPNO) {
        store.state.finderList.prospectValue = 5
        router.push({
          name: 'TALPlan',
          params: { id: item.SEINPNO, planType: item.DCPTYPE }
        })
      }
    }
    return {
      store,
      display,
      theme,
      headerList,
      nestedSchoolTableHeader,
      nestedIndividualTableHeader,
      zipcode,
      radius,
      item,
      expanded,
      pagination,
      closeSchoolDistrictPopUp,
      closeIndividualReportPopUp,
      closeReportPopUp,
      closeSchoolPopUp,
      filterDialog,
      mapHighlightForSchoolDistrict,
      schoolInfo,
      mapHighlightForHousehold,
      householdInfo,
      formatPrice,
      performAction,
      mapHighlight,
      planInfo,
      checkReportOptions,
      performSchoolAction
    }
  }
}
</script>
<style scoped>
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
