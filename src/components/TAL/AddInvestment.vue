<template>
  <v-col class="pa-0">
    <v-col :class="display.smAndDown.value ? 'mb-5' : 'mb-4'" class="pa-0">
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="addSelectedInvestment">
        <v-col class="pa-0">
          <v-col v-if="modelID >= 0 && !hideFromFund" cols="12" xs="12" class="pa-0">
            <v-row v-if="additionalInvestment">
              <v-col cols="12" xs="12" :class="assetFundNameLabel ? 'pb-2' : ''" class="pa-0">
                <h4 cols="12" xs="12">
                  {{ assetFundNameLabel }}
                </h4>
              </v-col>
              <v-col
                xs="12"
                :lg="reports === 'Diagnostic' || reports === 'RPEA' ? '12' : '2'"
                :md="reports === 'Diagnostic' || reports === 'RPEA' ? '12' : '2'"
                :xl="reports === 'Diagnostic' || reports === 'RPEA' ? '12' : '2'"
                :sm="reports === 'Diagnostic' || reports === 'RPEA' ? '12' : '2'"
                class="pa-0"
                :class="[
                  reports === 'Diagnostic' || reports === 'RPEA' ? '' : 'align-self mb-2',
                  reports === 'Proposal_Fund' ? (display.smAndDown.value ? 'pb-2' : '') : 'align-self'
                ]"
              >
                <v-btn-toggle v-model="investmentType" mandatory class="toggleCSS">
                  <v-btn v-if="reports !== 'Proposal_Fund'" variant="text" value="Asset" height="40">
                    <span>Asset</span>
                  </v-btn>
                  <v-btn v-if="reports === 'Proposal_Fund'" variant="text" value="Open" height="40">
                    <span>Fund</span>
                  </v-btn>
                  <v-btn variant="text" value="Cash" height="40">
                    <span>Cash</span>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col
                v-if="investmentType !== 'Cash'"
                class="align-self pr-3 pa-0"
                xs="12"
                lg="7"
                xl="6"
                md="8"
                :sm="reports === 'Diagnostic' || reports === 'RPEA' ? '6' : '7'"
                :class="[
                  reports === 'Diagnostic' || reports === 'RPEA' ? 'padding-top-5px' : '',
                  display.sm.value
                    ? reports === 'Diagnostic' || reports === 'RPEA'
                      ? ''
                      : 'ml-3'
                    : display.xs.value
                      ? reports === 'Diagnostic' || reports === 'RPEA'
                        ? ''
                        : 'ml-1'
                      : ''
                ]"
              >
                <v-row no-gutters :class="reports === 'Diagnostic' || reports === 'RPEA' ? 'pb-5' : ''">
                  <v-col cols="12" sm="6" md="8">
                    <v-card rounded="0" />
                  </v-col>
                  <v-col cols="6" md="4">
                    <v-card rounded="0" class="text-end">
                      <v-col v-if="assetlist.length > 0">
                        <span>{{ assetlist.length }} records found</span>
                      </v-col>
                    </v-card>
                  </v-col>
                </v-row>
                <v-tooltip location="top">
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="asset"
                      variant="outlined"
                      density="compact"
                      clearable
                      clear-icon="mdi-close-circle"
                      :placeholder="labelForAutocomplete"
                      autocomplete="off"
                      required
                      :loading="showloader"
                      :error="asseterror"
                      :error-messages="assetMsg"
                      @click:clear="clearFilter('blur')"
                      @keydown.enter="searchFundsResult()"
                    />
                  </template>
                  <span>Type the Asset or Ticker then Press Enter</span>
                </v-tooltip>
              </v-col>
              <v-col
                v-else
                class="align-self pr-3 pa-0"
                xs="12"
                lg="7"
                md="8"
                xl="6"
                :sm="reports === 'Diagnostic' || reports === 'RPEA' ? '8' : '7'"
                :class="[
                  reports === 'Diagnostic' || reports === 'RPEA' ? ' padding-top-5px' : '',
                  display.sm.value
                    ? reports === 'Diagnostic' || reports === 'RPEA'
                      ? ''
                      : 'ml-4'
                    : display.xs.value
                      ? reports === 'Diagnostic' || reports === 'RPEA'
                        ? ''
                        : 'ml-1'
                      : 'pl-1'
                ]"
              >
                <v-row no-gutters :class="reports === 'Diagnostic' || reports === 'RPEA' ? 'pb-5' : ''">
                  <v-col cols="12" class="pa-0">
                    <v-card rounded="0" />
                  </v-col>
                </v-row>
                <v-tooltip location="top">
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="cash"
                      variant="outlined"
                      density="compact"
                      placeholder="Enter Cash Name"
                      autocomplete="off"
                      required
                      :error="asseterror"
                      :error-messages="assetMsg"
                      @keydown.enter="addInvestment()"
                    />
                  </template>
                  <span>Type the Cash Name then Press Enter</span>
                </v-tooltip>
              </v-col>
              <v-col v-if="reports === 'Diagnostic' || reports === 'RPEA'" cols="12" sm="6" lg="5">
                <v-col>
                  <span
                    >Enter Collective Platform and Advisor Fees for the selected investments <br />
                    before adding to the lineup</span
                  >
                </v-col>
                <v-col cols="12" xs="12" class="pt-2">
                  <v-row>
                    <v-col cols="5" xs="5" sm="4" lg="4" xl="4" md="4" class="pr-1">
                      <v-col cols="12" xs="12">
                        <v-text-field
                          v-model="amcFee"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          label="Platform Fees"
                          autocomplete="autofill-off"
                          maxlength="7"
                          suffix="%"
                          :error="amcError"
                          :error-messages="amcErrorMsg"
                          variant="outlined"
                          density="compact"
                          @blur="formatAMCPercent(amcFee)"
                          @focus="$event.target.select()"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="5" xs="5" sm="4" lg="4" xl="4" md="4">
                      <v-col cols="12" xs="12" class="advisorFee">
                        <v-text-field
                          v-model="ssfFee"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          label="Advisor Fees"
                          autocomplete="autofill-off"
                          maxlength="7"
                          suffix="%"
                          :error="ssfError"
                          :error-messages="ssfErrorMsg"
                          variant="outlined"
                          density="compact"
                          @blur="formatSSFPercent(ssfFee)"
                          @focus="$event.target.select()"
                        />
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col cols="12" xs="12" class="pb-2">
                <v-card v-if="assetlist.length > 0" class="searchResultCard pa-2">
                  <template v-for="(item, index) in assetlist" :key="index">
                    <v-checkbox
                      v-model="item.checked"
                      :label="item.checked ? `${item.name} - (added to lineup)` : item.name"
                      :color="item.checked ? 'grey' : 'accent'"
                      :ripple="false"
                      hide-details
                      class="ma-0 pb-1"
                      :class="item.checked ? 'changeCheckboxColorGrey' : 'changeCheckboxColor'"
                      @update:model-value="addRemoveInvestment(item, item.checked)"
                    />
                  </template>
                </v-card>
              </v-col>
              <v-col v-if="noRecordsFound" cols="12" xs="12">
                <div class="norecords">
                  <h2>No Records Found</h2>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-divider v-if="reports === 'Proposal_Fund'" class="my-1" />
          <v-col cols="12" lg="12" xl="12" md="12" sm="12" xs="12" class="text-left pl-2">
            <v-col v-if="reports === 'RPEA' || reports === 'Diagnostic' || reports === 'Proposal_Fund'">
              <h2 class="font-weight-medium" :class="reports === 'RPEA' || reports === 'Diagnostic' ? 'pt-2 pb-1' : 'pt-2 pb-2'">
                Investments Lineup
              </h2>
              <h5 v-if="reports === 'RPEA' || reports === 'Diagnostic'" class="pb-1">
                Finalize the investment menu. Add investments by searching for their name or ticker symbol. Adjust the Platform
                and Advisor fees by clicking the Edit Fees link. Please confirm that the fund’s Total Fees match the cost within
                the plan. This will ensure the most accurate report.
              </h5>
            </v-col>
            <v-col
              v-show="
                reports === 'RPEA' ||
                reports === 'Diagnostic' ||
                reports === 'Proposal_Fund' ||
                reports === 'RPEA_Fund' ||
                reports === 'RPEA_Model'
                  ? true
                  : investmentList.length > 0
              "
              cols="12"
              xs="12"
            >
              <v-row>
                <v-col
                  v-if="display.smAndDown.value && modelID >= 0 && !hideFromFund && investmentList.length > 0"
                  class="mt-2 text-right"
                >
                  <span
                    v-if="reports === 'Diagnostic' || reports === 'RPEA'"
                    class="pr-2 pl-2 text-body-1"
                    @click="overrideAll = true"
                  >
                    <b :class="theme.dark ? '' : 'text-accent'">Override All Fees</b>
                  </span>
                  <span v-if="reports === 'Diagnostic' || reports === 'RPEA'">|</span>
                  <span v-if="investmentList.length > 0" class="pr-2 pl-2 text-body-1" @click="dialog = true">
                    <b :class="theme.dark ? '' : 'text-accent'">Delete All</b>
                  </span>
                </v-col>
                <v-col
                  v-show="!display.smAndDown.value && modelID >= 0 && !hideFromFund && investmentList.length > 0"
                  class="text-right handcursor"
                  :class="theme.dark ? '' : 'text-accent'"
                  cols="11"
                  xs="11"
                  sm="12"
                >
                  <div>
                    <span class="pr-2 text-body-1" @click="dialog = true">
                      <b>Delete All</b>
                    </span>
                    <span v-if="reports !== 'Investment_Fund' && reports !== 'RPEA_Fund' && reports !== 'Proposal_Fund'">|</span>
                    <span
                      v-if="reports === 'Diagnostic' || reports === 'RPEA'"
                      class="pr-2 pl-2 text-body-1"
                      @click="overrideAll = true"
                    >
                      <b>Override All Fees</b>
                    </span>
                    <span v-if="reports === 'Diagnostic' || reports === 'RPEA'">|</span>
                    <span
                      v-if="reports !== 'Investment_Fund' && reports !== 'RPEA_Fund' && reports !== 'Proposal_Fund'"
                      class="pl-2 pr-2 text-body-1"
                      @click="editFeesAllocation"
                    >
                      <b>{{ editFees === false ? editText : saveText }}</b>
                    </span>
                  </div>
                </v-col>
                <v-col
                  v-show="
                    (reports === 'RPEA_Model' || reports === 'Model_Benchmark' || reports === 'ClientProduct_Benchmark') &&
                    investmentList.length > 0 &&
                    itemAmountError
                  "
                  class="text-right"
                  :class="theme.dark ? '' : 'text-accent'"
                  cols="12"
                  xs="12"
                >
                  <div>
                    <span class="text-red">{{ amountMessage }}</span>
                  </div>
                </v-col>
              </v-row>
              <v-data-table
                class="elevation-0 mt-2"
                :class="[
                  reports !== 'Proposal_Fund' || reports !== 'Diagnostic' || reports !== 'RPEA' ? 'changeTableColor' : '',
                  reports === 'Diagnostic' || reports === 'RPEA' ? 'reduceHeight' : 'fixHeader'
                ]"
                :headers="Headers"
                :items="investmentList"
                item-key="ID"
                :sort-by="investmentPagination.sortBy"
                hide-default-footer
                :hide-default-header="display.smAndDown.value"
                :options="investmentPagination"
                style="backface-visibility: hidden"
                :fixed-header="true"
              >
                <template v-if="(reports === 'RPEA' || reports === 'Diagnostic') && !display.smAndDown.value">
                  <thead class="v-data-table-header">
                    <tr>
                      <th />
                      <th />
                      <th />
                      <th colspan="4" class="text-center parent-header">
                        <strong> Fund Expenses </strong>
                      </th>
                      <th colspan="4" class="text-center parent-header">
                        <strong> Service Provider Fees </strong>
                      </th>
                      <th />
                    </tr>
                  </thead>
                </template>
                <template #item="{ item, isExpanded, expand }">
                  <tr v-if="!display.smAndDown.value">
                    <td v-if="modelID >= 0 && !hideFromFund" class="text-center handcursor pl-1 pr-1">
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                        :color="!theme.dark ? 'error' : ''"
                        @click.stop="deletepopupinvestment[item.Name] = true"
                      >
                        <v-icon size="x-small"> fas fa-trash </v-icon>
                      </v-btn>
                      <v-dialog
                        :key="item.Name"
                        v-model="deletepopupinvestment[item.Name]"
                        :scrollable="false"
                        max-width="350"
                        content-class="elevation-3"
                      >
                        <ActionPopUp
                          confirm-action-text="Delete"
                          cancel-action-text="Cancel"
                          action-text="Delete Investment"
                          :action-message="`Are you sure you want to delete the investment <b>${item.Name}</b> from Investment lineup?`"
                          @confirm-action="deleteInvestment(item)"
                          @cancel-action="deletepopupinvestment[item.Name] = false"
                        />
                      </v-dialog>
                    </td>
                    <td v-if="reports === 'Proposal_Fund'" class="text-left pl-2 pr-2">
                      {{ item.Type }}
                    </td>
                    <td v-if="reports === 'ClientProduct_Benchmark'" class="text-left pl-2 pr-2">
                      {{ item.Symbol }}
                    </td>
                    <td v-else class="text-left pl-2 pr-2">
                      {{ item.Ticker }}
                    </td>
                    <td class="text-left pl-2 pr-2">
                      {{ item.Name }}
                    </td>
                    <td class="text-right pl-2 pr-2">{{ formatPercent(item.mgmt) }}%</td>
                    <td class="text-right pl-2 pr-2">{{ formatPercent(item.tload) }}%</td>
                    <td class="text-right pl-2 pr-2">{{ formatPercent(item.SubTA) }}%</td>
                    <td
                      v-if="
                        reports !== 'RPEA_Model' &&
                        reports !== 'RPEA_Fund' &&
                        reports !== 'Proposal_Fund' &&
                        reports !== 'Model_Benchmark' &&
                        reports !== 'Investment_Fund' &&
                        reports !== 'ClientProduct_Benchmark'
                      "
                      class="text-right pl-2 pr-2"
                    >
                      {{ formatPercent(item.expratio) }}%
                    </td>
                    <template v-if="editFees == false">
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="text-right pl-2 pr-2"
                      >
                        {{ formatDecimal(item.AMC) }}%
                      </td>
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="pa-1 text-center"
                      >
                        <v-btn
                          v-model="item.amcOffset"
                          :color="theme.dark ? '' : 'accent'"
                          :disabled="item.disableAMCOffset"
                          variant="outlined"
                          size="x-small"
                          class="ma-0"
                          @click="checkAMC(item)"
                        >
                          Offset
                        </v-btn>
                      </td>
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="text-right pl-2 pr-2"
                      >
                        {{ formatDecimal(item.SSF) }}%
                      </td>
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="pa-1 text-center"
                      >
                        <v-btn
                          v-model="item.ssfOffset"
                          :color="theme.dark ? '' : 'accent'"
                          :disabled="item.disableSSFOffset"
                          variant="outlined"
                          size="x-small"
                          class="ma-0"
                          @click="checkSSF(item)"
                        >
                          Offset
                        </v-btn>
                      </td>
                    </template>
                    <template v-else>
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="pr-1 pt-1 pl-8"
                      >
                        <v-text-field
                          v-model.lazy="item.AMC"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          suffix="%"
                          autocomplete="autofill-off"
                          class="font_12 pa-0 text-right"
                          hide-details
                          maxlength="5"
                          variant="outlined"
                          density="compact"
                          @change="formatAMCFees(item)"
                        />
                      </td>
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="pa-1 text-center"
                      >
                        <v-btn
                          v-model="item.amcOffset"
                          :color="theme.dark ? '' : 'accent'"
                          :disabled="item.disableAMCOffset"
                          variant="outlined"
                          size="x-small"
                          class="ma-0"
                          @click="checkAMC(item)"
                        >
                          Offset
                        </v-btn>
                      </td>
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="pr-1 pt-1"
                      >
                        <v-text-field
                          v-model.lazy="item.SSF"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          suffix="%"
                          autocomplete="autofill-off"
                          class="font_12 pa-0 text-right"
                          hide-details
                          maxlength="5"
                          variant="outlined"
                          density="compact"
                          @change="formatSSFFees(item)"
                        />
                      </td>
                      <td
                        v-if="
                          reports !== 'RPEA_Model' &&
                          reports !== 'RPEA_Fund' &&
                          reports !== 'Proposal_Fund' &&
                          reports !== 'Model_Benchmark' &&
                          reports !== 'Investment_Fund' &&
                          reports !== 'ClientProduct_Benchmark'
                        "
                        class="pa-1 text-center"
                      >
                        <v-btn
                          v-model="item.ssfOffset"
                          :color="theme.dark ? '' : 'accent'"
                          :disabled="item.disableSSFOffset"
                          variant="outlined"
                          size="x-small"
                          class="ma-0"
                          @click="checkSSF(item)"
                        >
                          Offset
                        </v-btn>
                      </td>
                    </template>
                    <td v-if="reports === 'Proposal_Fund'" class="text-right pl-2 pr-2">
                      {{ parseFloat(item.expratio).toFixed(2) }}%
                    </td>
                    <td v-if="reports !== 'Proposal_Fund'" class="text-right pl-2 pr-2">
                      {{ parseFloat(item.Total).toFixed(2) }}%
                    </td>
                    <template v-if="editFees === false">
                      <td v-if="reports === 'RPEA_Model' || reports === 'Model_Benchmark'" class="text-right pl-2 pr-2">
                        {{ parseFloat(item.Amount).toFixed(2) }}%
                      </td>
                    </template>
                    <template v-else>
                      <td v-if="reports === 'RPEA_Model' || reports === 'Model_Benchmark'" class="pr-1 pt-1">
                        <v-text-field
                          v-model.lazy="item.Amount"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          suffix="%"
                          autocomplete="autofill-off"
                          class="font_12 pa-0 text-right"
                          hide-details
                          maxlength="5"
                          variant="outlined"
                          density="compact"
                          @blur="checkItemPercent(item)"
                        />
                      </td>
                    </template>
                  </tr>
                  <tr
                    v-else
                    :class="[item.selectedRow == true ? 'selected_row_color' : '', isExpanded ? 'border_bottom_none' : '']"
                    @click="longtap ? longTapFunction(event, item) : ''"
                  >
                    <td class="pr-3 pl-3">
                      <v-col cols="12" xs="12" class="pa-0">
                        <v-row>
                          <v-col cols="10" xs="10" sm="10" lg="10" md="10">
                            <h5 class="pt-1">
                              <span class="text-grey">Name</span>
                            </h5>
                            <h4 class="text-uppercase">
                              {{ item.Name }}
                            </h4>
                          </v-col>
                          <v-col cols="2" xs="2" sm="2" lg="2" md="2" class="text-right handcursor">
                            <v-btn v-if="selected.length == 0" icon variant="text" @click="expand(!isExpanded)">
                              <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                            </v-btn>
                            <v-icon v-if="selected.length && item.selectedRow" class="pt-3" color="accent"> check_circle </v-icon>
                          </v-col>
                          <v-col cols="12" xs="8" sm="10" lg="10" md="10">
                            <h5 class="pt-1">
                              <span class="text-grey">Symbol</span>
                            </h5>
                            <h4>{{ item.Ticker }}</h4>
                          </v-col>
                          <v-col
                            v-if="modelID >= 0 && !hideFromFund"
                            cols="2"
                            xs="2"
                            sm="1"
                            lg="1"
                            md="1"
                            class="text-right handcursor"
                          >
                            <v-btn
                              icon
                              variant="text"
                              :color="!theme.dark ? 'error' : ''"
                              @click.stop="deletepopupinvestment[item.Name] = true"
                            >
                              <v-icon size="small"> fas fa-trash </v-icon>
                            </v-btn>
                            <v-dialog
                              :key="item.Name"
                              v-model="deletepopupinvestment[item.Name]"
                              :scrollable="false"
                              max-width="350"
                              content-class="elevation-3"
                            >
                              <ActionPopUp
                                confirm-action-text="Delete"
                                cancel-action-text="Cancel"
                                action-text="Delete Investment"
                                :action-message="`Are you sure you want to delete the investment <b>${item.Name}</b> from Investment lineup?`"
                                @confirm-action="deleteInvestment(item)"
                                @cancel-action="deletepopupinvestment[item.Name] = false"
                              />
                            </v-dialog>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'Proposal_Fund' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Investment_Fund' &&
                              modelID >= 0 &&
                              !hideFromFund
                            "
                            cols="2"
                            xs="2"
                            sm="1"
                            lg="1"
                            md="1"
                            class="text-right handcursor"
                          >
                            <v-btn icon variant="text" @click="editFeesAllocation(), (index = item.index), expand(!isExpanded)">
                              <v-icon
                                v-if="!(editFees && index === item.index)"
                                size="small"
                                :color="!theme.dark ? 'accent' : ''"
                              >
                                edit
                              </v-icon>
                              <v-icon v-show="editFees && index === item.index" size="small" :color="!theme.dark ? 'accent' : ''">
                                save
                              </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </td>
                  </tr>
                </template>
                <template v-if="display.smAndDown.value" #expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-card flat :class="theme.dark ? '' : 'expandable_background'">
                      <v-card-text>
                        <v-row>
                          <v-col v-if="reports === 'Proposal_Fund'" cols="6" xs="6">
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Type</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <h4>{{ formatPercent(item.Type) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Mgmt</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <h4>{{ formatPercent(item.mgmt) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">12b-1</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <h4>{{ formatPercent(item.tload) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col cols="6" xs="6">
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">SubTA</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <h4>{{ formatPercent(item.SubTA) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="6"
                            xs="6"
                          >
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">FER</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <h4>{{ formatPercent(item.expratio) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="6"
                            xs="6"
                          >
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Platform Fee</h5>
                            </v-col>
                            <v-col v-show="!editFees" cols="12" xs="12">
                              <h4>{{ formatDecimal(item.AMC) }}%</h4>
                            </v-col>
                            <v-col v-show="editFees" cols="12" xs="12" class="mb-1">
                              <v-col cols="10" xs="10">
                                <v-text-field
                                  v-model.lazy="item.AMC"
                                  v-input-mask="{
                                    alias: 'numeric',
                                    digits: '2',
                                    digitsOptional: true,
                                    rightAlign: false,
                                    placeholder: '',
                                    allowMinus: false
                                  }"
                                  suffix="%"
                                  autocomplete="autofill-off"
                                  class="font_12 pa-0 text-right"
                                  hide-details
                                  maxlength="5"
                                  variant="outlined"
                                  density="compact"
                                  @change="formatAMCFees(item)"
                                />
                              </v-col>
                            </v-col>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="6"
                            xs="6"
                            class="align-self"
                          >
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Platform Fee Offset*</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <v-btn
                                v-model="item.amcOffset"
                                :color="theme.dark ? '' : 'accent'"
                                :disabled="item.disableAMCOffset"
                                variant="outlined"
                                size="x-small"
                                class="ma-0"
                                @click="checkAMC(item)"
                              >
                                Offset
                              </v-btn>
                            </v-col>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="6"
                            xs="6"
                          >
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Advisor Fee</h5>
                            </v-col>
                            <v-col v-show="!editFees" cols="12" xs="12">
                              <h4>{{ formatDecimal(item.SSF) }}%</h4>
                            </v-col>
                            <v-col v-show="editFees" cols="12" xs="12" class="mb-1">
                              <v-col cols="10" xs="10">
                                <v-text-field
                                  v-model.lazy="item.SSF"
                                  v-input-mask="{
                                    alias: 'numeric',
                                    digits: '2',
                                    digitsOptional: true,
                                    rightAlign: false,
                                    placeholder: '',
                                    allowMinus: false
                                  }"
                                  suffix="%"
                                  autocomplete="autofill-off"
                                  class="font_12 pa-0 text-right"
                                  hide-details
                                  maxlength="5"
                                  variant="outlined"
                                  density="compact"
                                  @change="formatSSFFees(item)"
                                />
                              </v-col>
                            </v-col>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="6"
                            xs="6"
                            class="align-self"
                          >
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Advisor Fee Offset**</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <v-btn
                                v-model="item.ssfOffset"
                                :color="theme.dark ? '' : 'accent'"
                                :disabled="item.disableSSFOffset"
                                variant="outlined"
                                size="x-small"
                                class="ma-0"
                                @click="checkSSF(item)"
                              >
                                Offset
                              </v-btn>
                            </v-col>
                          </v-col>
                          <v-col v-if="reports === 'Proposal_Fund'" cols="6" xs="6">
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Total Fees</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <h4>{{ parseFloat(item.expratio).toFixed(2) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col v-if="reports !== 'Proposal_Fund'" cols="6" xs="6">
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Total Fees</h5>
                            </v-col>
                            <v-col cols="12" xs="12" class="pa-0">
                              <h4>{{ parseFloat(item.Total).toFixed(2) }}%</h4>
                            </v-col>
                          </v-col>
                          <v-col v-if="reports === 'RPEA_Model' || reports === 'Model_Benchmark'" cols="6" xs="6">
                            <v-col cols="12" xs="12" class="pa-0">
                              <h5 class="pl-0 pb-0 text-grey">Allocation</h5>
                            </v-col>
                            <v-col v-show="!editFees || index !== item.index" cols="12" xs="12">
                              <h4>{{ parseFloat(item.Amount).toFixed(2) }}%</h4>
                            </v-col>
                            <v-col v-show="editFees && index === item.index" cols="12" xs="12" class="mb-1">
                              <v-col cols="11" xs="11">
                                <v-text-field
                                  v-model.lazy="item.Amount"
                                  v-input-mask="{
                                    alias: 'numeric',
                                    digits: '2',
                                    digitsOptional: true,
                                    rightAlign: false,
                                    placeholder: '',
                                    allowMinus: false
                                  }"
                                  suffix="%"
                                  autocomplete="autofill-off"
                                  class="font_12 pa-0 text-right"
                                  hide-details
                                  maxlength="5"
                                  variant="outlined"
                                  density="compact"
                                  @blur="checkItemPercent(item)"
                                />
                              </v-col>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </td>
                </template>
                <template v-slot:body.append>
                  <tr v-if="!display.smAndDown.value">
                    <td v-if="modelID >= 0 && !hideFromFund" />
                    <td />
                    <td v-if="reports === 'Proposal_Fund'" />
                    <td class="text-left pl-2 pr-2">
                      <strong>Total Funds: {{ investmentList.length }}</strong>
                    </td>
                    <td class="text-right pl-2 pr-2">
                      <strong v-if="investmentList.length > 0">{{ totalNewMgmt }}%</strong>
                    </td>
                    <td class="text-right pl-2 pr-2">
                      <strong v-if="investmentList.length > 0">{{ totalNewLoad }}%</strong>
                    </td>
                    <td class="text-right pl-2 pr-2">
                      <strong v-if="investmentList.length > 0">{{ totalNewSubta }}%</strong>
                    </td>
                    <td
                      v-if="
                        reports !== 'RPEA_Model' &&
                        reports !== 'RPEA_Fund' &&
                        reports !== 'Proposal_Fund' &&
                        reports !== 'Model_Benchmark' &&
                        reports !== 'Investment_Fund' &&
                        reports !== 'ClientProduct_Benchmark'
                      "
                      class="text-right pl-2 pr-2"
                    >
                      <strong v-if="investmentList.length > 0">{{ totalNewExpratio }}%</strong>
                    </td>
                    <td
                      v-if="
                        reports !== 'RPEA_Model' &&
                        reports !== 'RPEA_Fund' &&
                        reports !== 'Proposal_Fund' &&
                        reports !== 'Model_Benchmark' &&
                        reports !== 'Investment_Fund' &&
                        reports !== 'ClientProduct_Benchmark'
                      "
                      class="text-right pl-2 pr-2"
                    >
                      <strong v-if="investmentList.length > 0">{{ totalNewAMC }}%</strong>
                    </td>
                    <td
                      v-if="
                        reports !== 'RPEA_Model' &&
                        reports !== 'RPEA_Fund' &&
                        reports !== 'Proposal_Fund' &&
                        reports !== 'Model_Benchmark' &&
                        reports !== 'Investment_Fund' &&
                        reports !== 'ClientProduct_Benchmark'
                      "
                    />
                    <td
                      v-if="
                        reports !== 'RPEA_Model' &&
                        reports !== 'RPEA_Fund' &&
                        reports !== 'Proposal_Fund' &&
                        reports !== 'Model_Benchmark' &&
                        reports !== 'Investment_Fund' &&
                        reports !== 'ClientProduct_Benchmark'
                      "
                      class="text-right pl-2 pr-2"
                    >
                      <strong v-if="investmentList.length > 0">{{ totalNewSSF }}%</strong>
                    </td>
                    <td
                      v-if="
                        reports !== 'RPEA_Model' &&
                        reports !== 'RPEA_Fund' &&
                        reports !== 'Proposal_Fund' &&
                        reports !== 'Model_Benchmark' &&
                        reports !== 'Investment_Fund' &&
                        reports !== 'ClientProduct_Benchmark'
                      "
                    />
                    <td v-if="reports === 'Proposal_Fund'" class="text-right pl-2 pr-2">
                      <strong>{{ parseFloat(totalNewExpratio).toFixed(2) }}%</strong>
                    </td>
                    <td
                      v-if="reports === 'RPEA_Model' || reports === 'Model_Benchmark' || reports === 'ClientProduct_Benchmark'"
                      class="text-right pl-2 pr-2"
                    >
                      <strong>{{ totalNewFees }}%</strong>
                    </td>
                    <td v-if="reports === 'RPEA_Model' || reports === 'Model_Benchmark'" class="text-right pl-2 pr-2">
                      <strong>{{ totalNewAmount }}%</strong>
                    </td>
                    <td
                      v-if="
                        reports !== 'Proposal_Fund' &&
                        reports !== 'RPEA_Model' &&
                        reports !== 'Model_Benchmark' &&
                        reports !== 'ClientProduct_Benchmark'
                      "
                      class="text-right pl-2 pr-2"
                    >
                      <strong v-if="investmentList.length > 0">{{ totalNewFees }}%</strong>
                    </td>
                  </tr>
                  <tr v-if="display.smAndDown.value && investmentList.length > 0">
                    <td class="pr-3 pl-3">
                      <v-col cols="12" xs="12" class="pa-0">
                        <v-row>
                          <v-col cols="4" xs="4">
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Funds</span>
                                </h5>
                                <h4 class="text-uppercase">
                                  {{ investmentList.length }}
                                </h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="4" xs="4">
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Mgmt</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewMgmt }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="4" xs="4">
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total 12b-1</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewLoad }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="4" xs="4">
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total SubTA</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewSubta }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="4"
                            xs="4"
                          >
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total FER</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewExpratio }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="4"
                            xs="4"
                          >
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Platform</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewAMC }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'RPEA_Model' &&
                              reports !== 'RPEA_Fund' &&
                              reports !== 'Proposal_Fund' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'Investment_Fund' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="4"
                            xs="4"
                          >
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Advisor</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewSSF }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-if="reports === 'Proposal_Fund'" cols="4" xs="4">
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Fees</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewExpratio }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col
                            v-if="
                              reports === 'RPEA_Model' || reports === 'Model_Benchmark' || reports === 'ClientProduct_Benchmark'
                            "
                            cols="4"
                            xs="4"
                          >
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Fees</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewFees }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col
                            v-if="
                              reports === 'RPEA_Model' || reports === 'Model_Benchmark' || reports === 'ClientProduct_Benchmark'
                            "
                            cols="4"
                            xs="4"
                          >
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Allocation</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewAmount }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col
                            v-if="
                              reports !== 'Proposal_Fund' &&
                              reports !== 'RPEA_Model' &&
                              reports !== 'Model_Benchmark' &&
                              reports !== 'ClientProduct_Benchmark'
                            "
                            cols="4"
                            xs="4"
                          >
                            <v-row>
                              <v-col cols="12" xs="12" class="pa-0">
                                <h5 class="pt-1">
                                  <span class="text-grey">Total Fees</span>
                                </h5>
                                <h4 class="text-uppercase">{{ totalNewFees }}%</h4>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
            <v-col v-if="reports === 'RPEA' || reports === 'Diagnostic'" cols="12" xs="12">
              <v-col class="pt-6 pb-1">
                <strong
                  >* When Platform Fee Offset is selected, the platform fee will be reduced by 12b-1 and SubTA fund
                  revenue.</strong
                >
              </v-col>
              <v-col>
                <strong
                  >** When Advisor Fee Offset is selected, the advisor fee will be reduced by 12b-1 and SubTA fund
                  revenue.</strong
                >
              </v-col>
            </v-col>
          </v-col>
        </v-col>
      </v-form>
    </v-col>
    <v-dialog v-model="dialog" max-width="350">
      <ActionPopUp
        confirm-action-text="Delete"
        cancel-action-text="Cancel"
        action-text="Delete Investment"
        :action-message="'Are you sure you want to delete all the investments from Investment lineup?'"
        @confirm-action="deleteAllInvestment()"
        @cancel-action="dialog = false"
      />
    </v-dialog>
    <v-dialog v-model="overrideAll" width="400">
      <v-card>
        <v-card-title class="text-secondary pl-3 pr-3 pt-2 pb-2" :class="theme.dark ? '' : 'accent'">
          <v-col cols="12" xs="12" class="pa-0">
            <v-row>
              <v-col class="text-left" cols="9" xs="9"> Override Fees </v-col>
              <v-col class="text-right" cols="3" xs="3">
                <v-icon :color="theme.dark ? '' : 'white'" @click="clearOverride()"> close </v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-card-title>
        <v-card-text class="pb-0 pt-1">
          <v-col>
            <h4 class="pb-3 pt-1">
              <b>Enter values to override all assets.</b>
            </h4>
          </v-col>
          <v-col cols="4" xs="4">
            <v-col>
              <v-text-field
                v-model="platformFee"
                v-input-mask="{
                  alias: 'numeric',
                  digits: '2',
                  digitsOptional: true,
                  rightAlign: false,
                  placeholder: '',
                  allowMinus: false
                }"
                label="Platform Fee"
                suffix="%"
                :error="platformFeeError"
                :error-messages="platformFeeErrorMsg"
                variant="outlined"
                density="compact"
                @blur="formatPlatformFee(platformFee)"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="advisorFee"
                v-input-mask="{
                  alias: 'numeric',
                  digits: '2',
                  digitsOptional: true,
                  rightAlign: false,
                  placeholder: '',
                  allowMinus: false
                }"
                label="Advisor Fee"
                suffix="%"
                :error="advisorFeeError"
                :error-messages="advisorFeeErrorMsg"
                variant="outlined"
                density="compact"
                @blur="formatAdvisorFee(advisorFee)"
              />
            </v-col>
          </v-col>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-col class="text-right">
            <v-btn
              color="accent"
              class="ml-2"
              :disabled="advisorFeeError || platformFeeError"
              size="small"
              variant="text"
              @click="overrideFees()"
            >
              Apply
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { ref, computed, inject, watch, getCurrentInstance } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import ActionPopUp from '@/components/ActionPopUp'
export default {
  components: {
    ActionPopUp
  },
  props: {
    reports: {
      type: String,
      default: ''
    },
    investmentList: {
      default: []
    },
    planId: {
      type: Number,
      default: 0
    },
    resetForm: {
      type: Boolean,
      default: false
    },
    modelID: {
      type: Number,
      default: 0
    },
    proposalPlanId: {
      type: Number,
      default: 0
    },
    additionalInvestment: {
      type: Boolean,
      default: false
    },
    hideFromFund: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const display = useDisplay()
    const theme = useTheme()
    const $toast = inject('toast')
    const $axios = instance.appContext.config.globalProperties.$axios
    const cancelToken = ref(null)
    const showloader = ref(false)
    const index = ref(0)
    const deletepopupinvestment = ref({})
    const asset = ref('')
    const assetText = ref('')
    const noRecordsFound = ref(false)
    const assetlist = ref([])
    const longtap = ref(false)
    const assetPercentage = ref(
      props.reports === 'RPEA' || props.reports === 'Diagnostic' || props.reports === 'Proposal_Fund' ? 1 : ''
    )
    const headers = ref([
      {
        title: '',
        value: 'feeScheduleID',
        sortable: false,
        align: 'center',
        width: '5px',
        hide: props.hideFromFund,
        class: 'pl-2 pr-2'
      },
      {
        title: 'Type',
        value: 'Type',
        sortable: true,
        align: 'start',
        width: '20px',
        hide: props.reports !== 'Proposal_Fund',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Symbol',
        value: 'Ticker',
        sortable: true,
        align: 'start',
        width: '60px',
        hide: false,
        class: 'pl-2 pr-2'
      },
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '150px',
        hide: false,
        class: 'pl-2 pr-2'
      },
      {
        title: 'Mgmt',
        value: 'mgmt',
        sortable: true,
        width: '45px',
        align: 'end',
        hide: false,
        class: 'pl-2 pr-2'
      },
      {
        title: '12b-1',
        value: 'tload',
        sortable: true,
        width: '45px',
        align: 'end',
        hide: false,
        class: 'pl-2 pr-2'
      },
      {
        title: 'SubTA',
        value: 'SubTA',
        sortable: true,
        width: '45px',
        align: 'end',
        hide: false,
        class: 'pl-2 pr-2'
      },
      {
        title: 'FER',
        value: 'expratio',
        sortable: true,
        width: '45px',
        align: 'end',
        hide:
          props.reports === 'RPEA_Model' ||
          props.reports === 'RPEA_Fund' ||
          props.reports === 'Proposal_Fund' ||
          props.reports === 'Model_Benchmark' ||
          props.reports === 'Investment_Fund' ||
          props.reports === 'ClientProduct_Benchmark',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Platform Fee',
        value: 'AMC',
        sortable: false,
        width: '85px',
        align: 'end',
        hide:
          props.reports === 'RPEA_Model' ||
          props.reports === 'RPEA_Fund' ||
          props.reports === 'Proposal_Fund' ||
          props.reports === 'Model_Benchmark' ||
          props.reports === 'Investment_Fund' ||
          props.reports === 'ClientProduct_Benchmark',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Platform Fee Offset*',
        value: 'amcOffset',
        sortable: false,
        width: '25px',
        align: 'center',
        hide:
          props.reports === 'RPEA_Model' ||
          props.reports === 'RPEA_Fund' ||
          props.reports === 'Proposal_Fund' ||
          props.reports === 'Model_Benchmark' ||
          props.reports === 'Investment_Fund' ||
          props.reports === 'ClientProduct_Benchmark',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Advisor Fee',
        value: 'SSF',
        sortable: false,
        width: '65px',
        align: 'end',
        hide:
          props.reports === 'RPEA_Model' ||
          props.reports === 'RPEA_Fund' ||
          props.reports === 'Proposal_Fund' ||
          props.reports === 'Model_Benchmark' ||
          props.reports === 'Investment_Fund' ||
          props.reports === 'ClientProduct_Benchmark',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Advisor Fee Offset**',
        value: 'ssfOffset',
        sortable: false,
        width: '25px',
        align: 'center',
        hide:
          props.reports === 'RPEA_Model' ||
          props.reports === 'RPEA_Fund' ||
          props.reports === 'Proposal_Fund' ||
          props.reports === 'Model_Benchmark' ||
          props.reports === 'Investment_Fund' ||
          props.reports === 'ClientProduct_Benchmark',
        class: 'pl-2 pr-2'
      },
      {
        title: 'Total Fees',
        value: props.reports === 'Proposal_Fund' ? 'expratio' : 'Total',
        sortable: true,
        width: '75px',
        align: 'end',
        hide: false,
        class: 'pl-2 pr-2'
      },
      {
        title: 'Allocation',
        value: 'Amount',
        sortable: true,
        width: '65px',
        align: 'end',
        hide: props.reports !== 'RPEA_Model' && props.reports !== 'Model_Benchmark',
        class: 'pl-2 pr-2'
      }
    ])
    const selected = ref([])
    const editFees = ref(false)
    const deleteFees = ref(false)
    const newInvestment = ref(true)
    const investmentPagination = ref({
      itemsPerPage: -1,
      sortBy: [{ key: 'ID', order: 'desc' }]
    })
    const currentLoader = ref(true)
    const investmentType = ref(props.reports === 'Proposal_Fund' ? 'Open' : 'Asset')
    const valid = ref(false)
    const investmentMsg = ref('')
    const assetMsg = ref('')
    const totalNewMgmt = ref(0)
    const totalNewLoad = ref(0)
    const totalNewSubta = ref(0)
    const totalNewExpratio = ref(0)
    const totalNewAMC = ref(0)
    const totalNewSSF = ref(0)
    const totalNewFees = ref(0)
    const totalNewAmount = ref(0)
    const error = ref(false)
    const asseterror = ref(false)
    const itemAmountError = ref(false)
    const amountMessage = ref('')
    const editText = ref(
      props.reports === 'RPEA_Model' ||
        props.reports === 'Proposal_Fund' ||
        props.reports === 'Model_Benchmark' ||
        props.reports === 'ClientProduct_Benchmark'
        ? 'Edit Allocation'
        : 'Edit Fees'
    )
    const saveText = ref(
      props.reports === 'RPEA_Model' ||
        props.reports === 'Proposal_Fund' ||
        props.reports === 'Model_Benchmark' ||
        props.reports === 'ClientProduct_Benchmark'
        ? 'Save Allocation'
        : 'Save Fees'
    )
    const cash = ref('')
    const dialog = ref(false)
    const searchInput = ref(null)
    const overrideAll = ref(false)
    const platformFee = ref(0)
    const advisorFee = ref(0)
    const platformFeeErrorMsg = ref('')
    const platformFeeError = ref(false)
    const advisorFeeErrorMsg = ref('')
    const advisorFeeError = ref(false)
    const amcFee = ref(0)
    const amcOffset = ref(false)
    const ssfFee = ref(0)
    const ssfOffset = ref(false)
    const amcErrorMsg = ref('')
    const amcError = ref(false)
    const ssfErrorMsg = ref('')
    const ssfError = ref(false)
    const addDisabled = ref(false)
    const addRemoveInvestment = (val, checked) => {
      if (val) {
        if (checked) addInvestment()
        else {
          val.checked = false
          var tmp_index = assetlist.value.findIndex((item) => item.name === val.name)
          if (tmp_index > -1) {
            assetlist.value.splice(tmp_index, 1, val)
          }
          var assetExistArray = props.investmentList.find((a) => a.Name === val.name.split('[')[0])
          if (assetExistArray) {
            deleteInvestment(assetExistArray)
          }
        }
      }
    }
    const clearFilter = (val) => {
      if (val === 'blur') {
        showloader.value = false
        amcFee.value = 0
        ssfFee.value = 0
        ssfOffset.value = false
        amcOffset.value = false
        asset.value = ''
        assetPercentage.value = ''
        error.value = false
        assetlist.value = []
        noRecordsFound.value = false
        addDisabled.value = false
      } else {
        showloader.value = false
        assetlist.value = []
        noRecordsFound.value = false
        addDisabled.value = false
      }
    }
    const editFeesAllocation = () => {
      if (props.reports === 'RPEA_Model' || props.reports === 'Model_Benchmark' || props.reports === 'ClientProduct_Benchmark') {
        editFees.value = !editFees.value
        if (parseInt(totalNewAmount.value) > 100) {
          $toast?.destroy()
          $toast.error('Value cannot be greater then 100 %', '')
        } else if (parseInt(totalNewAmount.value) < 100) {
          $toast?.destroy()
          $toast.error('Model allocation should be 100%', '')
        }
      } else {
        editFees.value = !editFees.value
      }
    }
    const searchFundsResult = () => {
      clearFilter()
      if (investmentType.value !== 'Cash') {
        if (!asset.value) {
          asseterror.value = true
          assetMsg.value = 'Asset Name is required'
          return
        }
      }
      if (asset.value) {
        getAssetList()
      }
    }
    const addSelectedInvestment = () => {
      if (asset.value) {
        addInvestment()
      }
    }
    const getAssetList = () => {
      if (event.target.value) {
        if (cancelToken.value) cancelToken.value.cancel()
        cancelToken.value = $axios.CancelToken.source()
        if (props.reports === 'Proposal_Fund') {
          showloader.value = true
          $axios
            .get(`/api/v1/proposal/asset/${event.target.value}`, {
              cancelToken: cancelToken.value.token
            })
            .then((success) => {
              if (success.data.d.length !== 0) {
                showloader.value = false
                var proposalAssetArray = success.data.d.length > 0 ? success.data.d : []
                proposalAssetArray.forEach((element, index) => {
                  element.checked = false
                  element.index = index + 1
                })
                if (proposalAssetArray && proposalAssetArray.length === 1) proposalAssetArray[0].checked = true
                assetlist.value = proposalAssetArray
                addDisabled.value = true
                if (assetlist.value && assetlist.value.length === 1) {
                  addProposalFund()
                }
              } else {
                addDisabled.value = false
                asset.value = ''
                noRecordsFound.value = true
                showloader.value = false
              }
            })
        } else {
          showloader.value = true
          //this fix is due to search text goes missing after clicking enter for RPEA reports
          assetText.value = asset.value
          $axios
            .get(`/api/v1/diagnostic/asset/${event.target.value}`, {
              cancelToken: cancelToken.value.token
            })
            .then((success) => {
              if (success.data.d && success.data.d.length !== 0) {
                showloader.value = false
                var assetArray = success.data.d.length > 0 ? success.data.d : []
                assetArray.forEach((element, index) => {
                  element.checked = false
                  element.index = index + 1
                })
                if (assetArray && assetArray.length === 1) assetArray[0].checked = true
                assetlist.value = assetArray
                addDisabled.value = true
                if (assetlist.value && assetlist.value.length === 1) {
                  addAsset()
                }
              } else {
                addDisabled.value = false
                asset.value = ''
                noRecordsFound.value = true
                showloader.value = false
              }
            })
        }
      } else {
        showloader.value = false
        assetlist.value = []
      }
    }
    const updateAssetTotal = () => {
      amountMessage.value = ''
      itemAmountError.value = false
      totalNewAmount.value = 0
      if (props.investmentList.length > 0) {
        totalNewFees.value = 0
        var sumMgmt = 0
        var sumTload = 0
        var sumSubta = 0
        var sumExpratio = 0
        var sumAMC = 0
        var sumSSF = 0
        var sumTotalFees = 0
        var sumAmount = 0
        for (var i = 0; i < props.investmentList.length; i++) {
          if (props.investmentList[i].Amount === '')
            // eslint-disable-next-line vue/no-mutating-props
            props.investmentList[i].Amount = 0
          if (props.reports === 'RPEA_Model' || props.reports === 'Model_Benchmark') {
            if (Number(props.investmentList[i].Amount) > 100) {
              amountMessage.value = 'Value cannot be greater then 100 %'
              itemAmountError.value = true
            }
          }
          if (props.reports === 'Model_Benchmark' || props.reports === 'RPEA_Model') {
            sumMgmt += !(props.investmentList[i].mgmt === -999)
              ? Number(props.investmentList[i].mgmt) * Number(props.investmentList[i].Amount)
              : Number(0)
            sumTload += !(props.investmentList[i].tload === -999)
              ? Number(props.investmentList[i].tload) * Number(props.investmentList[i].Amount)
              : Number(0)
            sumSubta += !(props.investmentList[i].SubTA === -999)
              ? Number(props.investmentList[i].SubTA) * Number(props.investmentList[i].Amount)
              : Number(0)
            sumTotalFees += !(props.investmentList[i].Total === -999)
              ? Number(props.investmentList[i].Total) * Number(props.investmentList[i].Amount)
              : Number(0)
            sumAmount += !(props.investmentList[i].Amount === -999)
              ? Number(parseFloat(props.investmentList[i].Amount).toFixed(2))
              : Number(0)
          } else {
            sumMgmt += !(props.investmentList[i].mgmt === -999) ? Number(props.investmentList[i].mgmt) : Number(0)
            sumTload += !(props.investmentList[i].tload === -999) ? Number(props.investmentList[i].tload) : Number(0)
            sumSubta += !(props.investmentList[i].SubTA === -999) ? Number(props.investmentList[i].SubTA) : Number(0)
            sumExpratio += !(props.investmentList[i].expratio === -999) ? Number(props.investmentList[i].expratio) : Number(0)
            sumAMC += !(props.investmentList[i].AMC === -999) ? Number(props.investmentList[i].AMC) : Number(0)
            sumSSF += !(props.investmentList[i].SSF === -999) ? Number(props.investmentList[i].SSF) : Number(0)
            sumTotalFees += !(props.investmentList[i].Total === -999) ? Number(props.investmentList[i].Total) : Number(0)
            sumAmount += !(props.investmentList[i].Amount === -999)
              ? Number(parseFloat(props.investmentList[i].Amount).toFixed(2))
              : Number(0)
          }
        }
        totalNewMgmt.value =
          props.reports === 'Model_Benchmark' || props.reports === 'RPEA_Model' || props.reports === 'ClientProduct_Benchmark'
            ? parseFloat(Number(sumMgmt) / 100).toFixed(2)
            : parseFloat(Number(sumMgmt) / props.investmentList.length).toFixed(2)
        totalNewLoad.value =
          props.reports === 'Model_Benchmark' || props.reports === 'RPEA_Model' || props.reports === 'ClientProduct_Benchmark'
            ? parseFloat(Number(sumTload) / 100).toFixed(2)
            : parseFloat(Number(sumTload) / props.investmentList.length).toFixed(2)
        totalNewSubta.value =
          props.reports === 'Model_Benchmark' || props.reports === 'RPEA_Model' || props.reports === 'ClientProduct_Benchmark'
            ? parseFloat(Number(sumSubta) / 100).toFixed(2)
            : parseFloat(Number(sumSubta) / props.investmentList.length).toFixed(2)
        totalNewExpratio.value =
          props.reports === 'Proposal_Fund'
            ? parseFloat(Number(sumExpratio) / props.investmentList.length).toFixed(3)
            : parseFloat(Number(sumExpratio) / props.investmentList.length).toFixed(2)
        totalNewAMC.value = parseFloat(Number(sumAMC) / props.investmentList.length).toFixed(2)
        totalNewSSF.value = parseFloat(Number(sumSSF) / props.investmentList.length).toFixed(2)
        totalNewFees.value =
          props.reports === 'Model_Benchmark' || props.reports === 'RPEA_Model' || props.reports === 'ClientProduct_Benchmark'
            ? parseFloat(Number(sumTotalFees) / 100).toFixed(2)
            : parseFloat(Number(sumTotalFees) / props.investmentList.length).toFixed(2)
        totalNewAmount.value = parseFloat(Number(sumAmount)).toFixed(2)
      }
      if (props.reports === 'RPEA_Model' || props.reports === 'Model_Benchmark' || props.reports === 'ClientProduct_Benchmark') {
        if (Number(totalNewAmount.value) > 100) {
          amountMessage.value = 'Value exceeded 100 %'
          itemAmountError.value = true
        }
      }
    }
    const addAsset = () => {
      if (assetlist.value && assetlist.value.length > 0) {
        editFees.value = true
        if (
          (props.reports === 'RPEA_Model' ||
            props.reports === 'Model_Benchmark' ||
            props.reports === 'ClientProduct_Benchmark') &&
          parseFloat(Number(assetPercentage.value)) <= 0
        ) {
          error.value = true
          investmentMsg.value = 'Percentage value not valid'
        } else {
          error.value = false
          investmentMsg.value = ''
        }
        let selectedAsset = []
        if (assetlist.value && assetlist.value.length > 0) {
          selectedAsset = assetlist.value.filter((a) => a.checked)
        }
        var assetValue = selectedAsset
        for (var i = 0; i < assetValue.length; i++) {
          var expratioPercent = assetValue[i].name.split('[').length > 3 ? assetValue[i].name.split('[')[3].replace(']', '') : 0.0
          var expratioVal = 0.0
          if (expratioPercent !== 0.0) {
            expratioVal = expratioPercent.endsWith('%') ? expratioPercent.replace('%', '') : 0.0
            expratioVal = Number(expratioVal) !== -999 ? expratioVal : 0
          }
          var tload = Number(assetValue[i].value.split('|')[3]) !== -999 ? assetValue[i].value.split('|')[3] : 0
          var subta = Number(assetValue[i].value.split('|')[4]) !== -999 ? assetValue[i].value.split('|')[4] : 0
          var mgmt = Number(expratioVal) - Number(tload) - Number(subta)
          var tmp_amcFee = 0.0
          var tmp_ssfFee = 0.0
          if (props.reports === 'Diagnostic' || props.reports === 'RPEA') {
            tmp_amcFee = amcOffset.value ? amcFee.value - tload : amcFee.value
            tmp_ssfFee = ssfOffset.value ? ssfFee.value - tload : ssfFee.value
          }
          var isAssetExist = props.investmentList.find((a) => a.Name === assetValue[i].name.split('[')[0])
          if (!isAssetExist) {
            var investment = {
              ID: 0,
              Ticker: assetValue[i].value.split('|')[0],
              Name: assetValue[i].name.split('[')[0],
              mgmt: mgmt,
              tload: tload,
              SubTA: subta,
              expratio: expratioVal,
              AMC: tmp_amcFee,
              SSF: tmp_ssfFee,
              amcOffset: props.reports === 'Diagnostic' || props.reports === 'RPEA' ? amcOffset.value : false,
              ssfOffset: props.reports === 'Diagnostic' || props.reports === 'RPEA' ? ssfOffset.value : false,
              Total:
                props.reports === 'Model_Benchmark' ||
                props.reports === 'RPEA_Model' ||
                props.reports === 'ClientProduct_Benchmark'
                  ? expratioVal
                  : parseFloat(Number(expratioVal) + Number(0.0) + Number(0.0)).toFixed(2),
              Type: assetValue[i].value.split('|')[1],
              Code: assetValue[i].value.split('|')[2],
              edit: true,
              Amount: props.reports === 'RPEA' ? 1 : assetPercentage.value === '' ? 0 : assetPercentage.value
            }
            if (props.reports === 'Proposal_Fund') {
              investment.ID = 0
              investment.Taxable = false
              $axios.post(`/api/v1/tal/proposal/${props.proposalPlanId}/investment`, investment).then((success) => {
                if (success.data.d != null) {
                  asset.value = ''
                  assetPercentage.value = ''
                  eventBus.emit('getInvestment', false)
                  assetlist.value = []
                  error.value = false
                }
              })
            } else if (props.reports === 'RPEA' || props.reports === 'Diagnostic') {
              var Investments = []
              Investments.push(investment)
              $axios.post(`/api/v1/diagnostic/plan/${props.planId}/investments`, Investments).then((success) => {
                if (success.data.d != null) {
                  emit('getInvestmentList', '')
                }
              })
            } else {
              if (props.investmentList.length === 0) {
                // eslint-disable-next-line vue/no-mutating-props
                props.investmentList.push(investment)
                // eslint-disable-next-line vue/no-mutating-props
              } else props.investmentList.unshift(investment)
              props.investmentList.forEach((element, index) => {
                element.index = index + 1
              })
              index.value = 0
            }
          }
        }
      } else addDisabled.value = false
    }
    const formatDecimal = (num) => {
      if (num !== undefined) {
        return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
      }
    }
    const formatPercent = (val) => {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    }
    const deleteInvestment = (investment) => {
      if (investment.ID !== undefined && investment.ID !== 0) {
        var investmentId = []
        investmentId.push(investment.ID)
        if (
          props.reports === 'Model_Benchmark' ||
          props.reports === 'RPEA_Model' ||
          props.reports === 'ClientProduct_Benchmark'
        ) {
          $axios
            .delete(`/api/v1/tal/model/${props.modelID}/investments`, {
              data: investmentId
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(props.investmentList.indexOf(investment), 1)
              props.investmentList.forEach((element, index) => {
                element.index = index + 1
              })
              index.value = 0
              editFees.value = true
            })
        } else if (props.reports === 'Investment_Fund' || props.reports === 'RPEA_Fund') {
          $axios
            .delete(`/api/v1/tal/fund/${props.modelID}/investments`, {
              data: investmentId
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(props.investmentList.indexOf(investment), 1)
              props.investmentList.forEach((element, index) => {
                element.index = index + 1
              })
              index.value = 0
              editFees.value = true
            })
        } else if (props.reports !== 'Proposal_Fund') {
          $axios
            .delete(`/api/v1/diagnostic/plan/${props.planId}/investments`, {
              data: investmentId
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(props.investmentList.indexOf(investment), 1)
              props.investmentList.forEach((element, index) => {
                element.index = index + 1
              })
              index.value = 0
              editFees.value = true
              emit('updateInvestment', props.reports)
            })
        } else {
          $axios
            .delete(`/api/v1/tal/proposal/${props.proposalPlanId}/investments`, {
              data: investmentId
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(props.investmentList.indexOf(investment), 1)
              props.investmentList.forEach((element, index) => {
                element.index = index + 1
              })
              index.value = 0
              editFees.value = true
              emit('updateInvestment', props.reports)
            })
        }
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        props.investmentList.splice(props.investmentList.indexOf(investment), 1)
        props.investmentList.forEach((element, index) => {
          element.index = index + 1
        })
        index.value = 0
        editFees.value = true
      }
      deletepopupinvestment.value[investment.Name] = false
    }
    const addCash = () => {
      if (cash.value) {
        if (
          (props.reports === 'RPEA_Model' ||
            props.reports === 'Model_Benchmark' ||
            props.reports === 'ClientProduct_Benchmark') &&
          parseFloat(Number(assetPercentage.value)) <= 0
        ) {
          error.value = true
          investmentMsg.value = 'Percentage value not valid'
        } else {
          error.value = false
          investmentMsg.value = ''
        }
        var isCashExist = props.investmentList.find((a) => a.Name === cash.value)
        if (!isCashExist) {
          $axios
            .get(
              props.reports !== 'Proposal'
                ? `/api/v1/diagnostic/asset/principia?assetName=${cash.value}&assetType=CASH`
                : `/api/v1/diagnostic/asset/principia?assetName=${asset.value.name.split('[')[0]}&assetType=CASH`
            )
            .then((success) => {
              var expratioVal = 0.0
              if (success.data.d != null) {
                expratioVal = success.data.d.expratio !== undefined ? success.data.d.expratio : 0.0
              }
              var investment = {
                ID: 0,
                Ticker: 'CASH',
                Name: cash.value,
                mgmt: expratioVal,
                tload: 0,
                SubTA: 0,
                expratio: expratioVal,
                AMC: props.reports === 'Diagnostic' || props.reports === 'RPEA' ? amcFee.value : 0.0,
                SSF: props.reports === 'Diagnostic' || props.reports === 'RPEA' ? ssfFee.value : 0.0,
                amcOffset: props.reports === 'Diagnostic' || props.reports === 'RPEA' ? amcOffset.value : false,
                ssfOffset: props.reports === 'Diagnostic' || props.reports === 'RPEA' ? ssfOffset.value : false,
                Total: parseFloat(Number(expratioVal) + Number(0.0) + Number(0.0)).toFixed(2),
                Type: 'CASH',
                Code: 'FTCIMA0000',
                edit: true,
                Amount: props.reports === 'RPEA' ? 1 : assetPercentage.value === '' ? 1 : assetPercentage.value
              }

              cash.value = ''
              if (props.reports === 'Proposal_Fund') {
                investment.ID = 0
                investment.Taxable = false
                $axios.post(`/api/v1/tal/proposal/${props.proposalPlanId}/investment`, investment).then((success) => {
                  if (success.data.d != null) {
                    eventBus.emit('getInvestment', false)
                    investment.ID = success.data.d.id
                    cash.value = ''
                    assetPercentage.value = ''
                    assetlist.value = []
                    error.value = false
                  }
                })
              } else if (props.reports === 'Diagnostic' || props.reports === 'RPEA') {
                var Investments = []
                Investments.push(investment)
                $axios.post(`/api/v1/diagnostic/plan/${props.planId}/investments`, Investments).then((success) => {
                  if (success.data.d != null) {
                    amcFee.value = 0
                    ssfFee.value = 0
                    ssfOffset.value = false
                    amcOffset.value = false
                    asset.value = ''
                    assetPercentage.value = ''
                    emit('getInvestmentList', '')
                    assetlist.value = []
                    error.value = false
                  }
                })
              } else {
                if (props.investmentList.length === 0) {
                  // eslint-disable-next-line vue/no-mutating-props
                  props.investmentList.push(investment)
                  // eslint-disable-next-line vue/no-mutating-props
                } else props.investmentList.unshift(investment)
                props.investmentList.forEach((element, index) => {
                  element.index = index + 1
                })
                index.value = 0
                asset.value = ''
                assetPercentage.value = ''
                assetlist.value = []
                error.value = false
                editFees.value = true
              }
            })
        } else {
          cash.value = ''
          addDisabled.value = false
        }
      } else {
        addDisabled.value = false
      }
    }
    const formatAMCFees = (investment) => {
      investment.disableAMCOffset = false
      if (isNaN(Number(investment.AMC.replace(/[^0-9/\\.]/g, '')))) investment.AMC = 0
      if (Number(investment.AMC.replace(/[^0-9/\\.]/g, '')) > 100) {
        $toast?.destroy()
        $toast.error('Value cannot be greater then 100 %', '')
        investment.AMC = 0
        return
      }
      var AMCfee
      if (investment.AMC.toString().indexOf('.') !== -1) {
        AMCfee = parseFloat(Number(investment.AMC)).toFixed(2)
      } else {
        AMCfee = parseFloat(Math.round(Number(investment.AMC)) / 100).toFixed(2)
      }
      investment.AMC = Number(investment.AMC.replace(/[^0-9/\\.]/g, ''))
      if (AMCfee > 0) {
        if (investment.amcOffset === true) {
          AMCfee = Number(AMCfee) - Number(investment.tload) - Number(investment.SubTA)
          if (AMCfee < 0) AMCfee = 0.0
        }
      }
      investment.AMC = formatDecimal(AMCfee)
      investment.oldAMC = formatDecimal(AMCfee)
      investment.Total = parseFloat(Number(investment.expratio) + Number(investment.AMC) + Number(investment.SSF)).toFixed(2)
      return investment
    }
    const formatSSFFees = (investment) => {
      investment.disableSSFOffset = false
      if (isNaN(Number(investment.SSF.replace(/[^0-9/\\.]/g, '')))) investment.SSF = 0
      if (Number(investment.SSF.replace(/[^0-9/\\.]/g, '')) > 100) {
        $toast?.destroy()
        $toast.error('Value cannot be greater then 100 %', '')
        investment.SSF = 0
        return
      }
      var SSFfee
      if (investment.SSF.toString().indexOf('.') !== -1) {
        SSFfee = parseFloat(Number(investment.SSF)).toFixed(2)
      } else {
        SSFfee = parseFloat(Math.round(Number(investment.SSF)) / 100).toFixed(2)
      }
      investment.SSF = Number(investment.SSF.replace(/[^0-9/\\.]/g, ''))
      if (SSFfee > 0) {
        if (investment.ssfOffset === true) {
          SSFfee = Number(SSFfee) - Number(investment.tload) - Number(investment.SubTA)
          if (SSFfee < 0) SSFfee = 0.0
        }
      }
      investment.SSF = formatDecimal(SSFfee)
      investment.oldSSF = formatDecimal(SSFfee)
      investment.Total = parseFloat(Number(investment.expratio) + Number(investment.AMC) + Number(investment.SSF)).toFixed(2)
      return investment
    }
    const formatAmount = (investment) => {
      investment.Amount = Number(investment.Amount.replace(/[^0-9/\\.]/g, ''))
      if (isNaN(investment.Amount)) investment.Amount = 0
      var amount = parseFloat(Number(investment.Amount)).toFixed(2)
      if (amount < 0) amount = 0.0
      investment.Amount = formatDecimal(amount)
      return investment
    }
    const checkPercent = () => {
      if (assetPercentage.value !== undefined) {
        // assetPercentage.value = Number(
        //   assetPercentage.value.replace(/[^0-9/\\.]/g, '')
        // )
        if (isNaN(assetPercentage.value)) assetPercentage.value = 0
        error.value = false
        investmentMsg.value = ''
      }
    }
    const checkItemPercent = (itemData) => {
      if (itemData.Amount === null || itemData.Amount === '') itemData.Amount = '0'

      amountMessage.value = ''
      itemAmountError.value = false
      itemData.Amount = Number(itemData.Amount.toString().replace(/[^0-9/\\.]/g, ''))
      if (isNaN(itemData.Amount)) itemData.Amount = '0'
      itemData.Amount = parseFloat(itemData.Amount).toFixed(2)
    }
    const resetInvestment = () => {
      asset.value = ''
      assetPercentage.value = ''
      assetlist.value = []
      assetMsg.value = ''
      amountMessage.value = ''
      error.value = false
      addDisabled.value = false
      editFees.value = false
      asseterror.value = false
      itemAmountError.value = false
      if (props.investmentList.length === 0) totalNewAmount.value = 0
      deletepopupinvestment.value = {}
    }
    const SelectAll = () => {
      selected.value = []
      selected.value = props.investmentList.value.slice()
      selected.value.forEach((element) => {
        element['selectedRow'] = true
      })
    }
    const UnSelectAll = () => {
      selected.value.forEach((element) => {
        element['selectedRow'] = false
      })
      selected.value = []
    }
    const addInvestment = () => {
      error.value = false
      asseterror.value = false
      investmentMsg.value = ''
      assetMsg.value = ''
      amountMessage.value = ''
      itemAmountError.value = false
      if (investmentType.value === 'Cash') {
        if (cash.value === null || cash.value === '') {
          asseterror.value = true
          assetMsg.value = 'Cash Name is required'
          return
        }
      }
      if (investmentType.value === 'Asset' || investmentType.value === 'Open') {
        if (props.reports === 'Proposal_Fund') addProposalFund()
        else addAsset()
      } else addCash()
    }
    const longTapFunction = (event, data) => {
      longtap.value = true
      var checkSelect = selected.value.find((a) => a.ID === data.ID)
      if (checkSelect == null) {
        data['selectedRow'] = true
        selected.value.push(data)
      } else {
        data['selectedRow'] = false
        selected.value.forEach((element, index) => {
          if (element.ID === data.ID) selected.value.splice(index, 1)
        })
      }
      if (selected.value.length === 0) longtap.value = false
    }
    const deleteAllInvestment = () => {
      var investment = props.investmentList.length
      var investmentObjects = props.investmentList.filter(function (a) {
        return a.ID > 0
      })
      if (investmentObjects.length > 0) {
        var investmentIds = investmentObjects.map((a) => a.ID)
        if (
          props.reports === 'Model_Benchmark' ||
          props.reports === 'RPEA_Model' ||
          props.reports === 'ClientProduct_Benchmark'
        ) {
          $axios
            .delete(`/api/v1/tal/model/${props.modelID}/investments`, {
              data: investmentIds
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(0, investment)
            })
        } else if (props.reports === 'Investment_Fund' || props.reports === 'RPEA_Fund') {
          $axios
            .delete(`/api/v1/tal/fund/${props.modelID}/investments`, {
              data: investmentIds
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(0, investment)
            })
        } else if (props.reports !== 'Proposal_Fund') {
          $axios
            .delete(`/api/v1/diagnostic/plan/${props.planId}/investments`, {
              data: investmentIds
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(0)
              emit('updateInvestment', props.reports)
            })
        } else {
          $axios
            .delete(`/api/v1/tal/proposal/${props.proposalPlanId}/investments`, {
              data: investmentIds
            })
            .then(() => {
              // eslint-disable-next-line vue/no-mutating-props
              props.investmentList.splice(0, investment)
              emit('updateInvestment', props.reports)
            })
        }
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        props.investmentList.splice(0, investment)
      }
      dialog.value = false
    }
    const addProposalFund = () => {
      if (assetlist.value && assetlist.value.length > 0) {
        let selectedAsset = []
        if (assetlist.value && assetlist.value.length > 0) {
          selectedAsset = assetlist.value.filter((a) => a.checked)
        }
        var assetValue = selectedAsset
        // eslint-disable-next-line no-unused-vars
        var assetPercentage = assetPercentage.value === '' ? 0 : parseFloat(assetPercentage.value).toFixed(2)
        for (var i = 0; i < assetValue.length; i++) {
          var expratioPercent = assetValue[i].name.split('[').length > 0 ? assetValue[i].name.split('[')[1].replace(']', '') : 0.0
          var expratioVal = 0.0
          if (expratioPercent !== 0.0) {
            expratioVal = expratioPercent.endsWith('%') ? expratioPercent.replace('%', '') : 0.0
            expratioVal = Number(expratioVal) !== -999 ? expratioVal : 0
          }
          var isAssetExist = props.investmentList.find((a) => a.Name === assetValue[i].name.split('[')[0])
          if (!isAssetExist) {
            var investment = {
              ID: 0,
              Ticker: assetValue[i].Ticker.split('|')[0],
              Name: assetValue[i].name.split('[')[0],
              mgmt: 0.0,
              tload: 0.0,
              SubTA: 0.0,
              expratio: expratioVal,
              AMC: 0.0,
              SSF: 0.0,
              amcOffset: false,
              ssfOffset: false,
              Total: parseFloat(Number(expratioVal) + Number(0.0) + Number(0.0)).toFixed(2),
              edit: true,
              Amount: 1,
              Taxable: false,
              Type: assetValue[i].Ticker.split('|')[1]
            }
            $axios.post(`/api/v1/tal/proposal/${props.proposalPlanId}/investment`, investment).then((success) => {
              if (success.data.d != null) {
                eventBus.emit('getInvestment', false)
              }
            })
          }
        }
      }
    }
    const formatPlatformFee = (value) => {
      var valueType = value.indexOf('.') !== -1 ? 1 : 100
      var val = Number(parseFloat(value))
      if (isNaN(val)) val = 0
      var AMCfees = val === '' ? 0 : Number(val)
      if (Number(val) > 100) {
        platformFeeErrorMsg.value = 'Value cannot be greater then 100 %'
        platformFeeError.value = true
        platformFee.value = 0
      } else {
        platformFeeErrorMsg.value = ''
        platformFeeError.value = false
        platformFee.value =
          Number(val.length) >= 6 ? Number(AMCfees) / valueType : Number(parseFloat(AMCfees).toFixed(2)) / valueType
      }
    }
    const formatAdvisorFee = (value) => {
      var valueType = value.indexOf('.') !== -1 ? 1 : 100
      var val = Number(parseFloat(value))
      if (isNaN(val)) val = 0
      var AMCfees = val === '' ? 0 : Number(val)
      if (Number(val) > 100) {
        advisorFeeErrorMsg.value = 'Value cannot be greater then 100 %'
        advisorFeeError.value = true
        advisorFee.value = 0
      } else {
        advisorFeeErrorMsg.value = ''
        advisorFeeError.value = false
        advisorFee.value =
          Number(val.length) >= 6 ? Number(AMCfees) / valueType : Number(parseFloat(AMCfees).toFixed(2)) / valueType
      }
    }
    const overrideFees = () => {
      props.investmentList.forEach((element) => {
        element.AMC = platformFee.value
        element.oldAMC = platformFee.value
        element.disableAMCOffset = false
        element.SSF = advisorFee.value
        element.oldSSF = advisorFee.value
        element.disableSSFOffset = false
        element.Total = parseFloat(Number(element.expratio) + Number(element.AMC) + Number(element.SSF)).toFixed(2)
      })
      $axios
        .post(`/api/v1/diagnostic/plan/${props.planId}/investments`, props.investmentList)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          eventBus.emit('getInvestment', false)
        })
      overrideAll.value = false
    }
    const saveEditedFees = () => {
      $axios
        .post(`/api/v1/diagnostic/plan/${props.planId}/investments`, props.investmentList)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          eventBus.emit('getInvestment', false)
        })
    }
    const clearOverride = () => {
      platformFee.value = 0
      advisorFee.value = 0
      overrideAll.value = false
    }
    const formatAMCPercent = (value) => {
      var val = Number(parseFloat(value))
      if (isNaN(val)) val = 0
      var AMCfees = val === '' ? 0 : Number(val)
      if (Number(val) > 100) {
        amcErrorMsg.value = 'Value cannot be greater then 100 %'
        amcError.value = true
        amcFee.value = 0
      } else {
        amcErrorMsg.value = ''
        amcError.value = false
        amcFee.value = Number(val.length) >= 6 ? Number(AMCfees) : Number(parseFloat(AMCfees).toFixed(2))
      }
    }
    const formatSSFPercent = (value) => {
      var val = Number(parseFloat(value))
      if (isNaN(val)) val = 0
      var SSFfees = val === '' ? 0 : Number(val)
      if (Number(val) > 100) {
        ssfErrorMsg.value = 'Value cannot be greater then 100 %'
        ssfError.value = true
        ssfFee.value = 0
      } else {
        error.value = false
        ssfError.value = false
        ssfErrorMsg.value = ''
        ssfFee.value = Number(val).length >= 6 ? Number(SSFfees) : Number(parseFloat(SSFfees).toFixed(2))
      }
    }
    const checkAMC = (Investment) => {
      Investment.amcOffset = !Investment.amcOffset
      if (isNaN(Investment.AMC)) Investment.AMC = 0
      var amcVal = Investment.AMC
      if (Investment.amcOffset === true) {
        Investment.ssfOffset = false
        Investment.disableSSFOffset = true
        if (amcVal > 0) {
          if (Investment.amcOffset === true) {
            amcVal = Number(amcVal) - Number(Investment.tload) - Number(Investment.SubTA)
            if (amcVal < 0) amcVal = 0.0
          }
          Investment.AMC = formatDecimal(amcVal)
        }
        if (Investment.SSF > 0) {
          if (parseInt(Investment.SSF) !== parseInt(Investment.oldSSF)) {
            Investment.SSF = formatDecimal(Investment.oldSSF)
          }
        }
        Investment.Total = parseFloat(Number(Investment.expratio) + Number(Investment.AMC) + Number(Investment.SSF)).toFixed(2)
      } else {
        if (Investment.AMC > 0) {
          amcVal = Number(amcVal) + Number(Investment.tload) + Number(Investment.SubTA)
          Investment.AMC = formatDecimal(amcVal)
          Investment.Total = parseFloat(Number(Investment.expratio) + Number(Investment.AMC) + Number(Investment.SSF)).toFixed(2)
        }
      }
      return Investment
    }
    const checkSSF = (Investment) => {
      Investment.ssfOffset = !Investment.ssfOffset
      if (isNaN(Investment.SSF)) Investment.SSF = 0
      var ssfVal = Investment.SSF
      if (Investment.ssfOffset === true) {
        Investment.amcOffset = false
        Investment.disableAMCOffset = true
        if (ssfVal > 0) {
          if (Investment.ssfOffset === true) {
            ssfVal = Number(ssfVal) - Number(Investment.tload) - Number(Investment.SubTA)
            if (ssfVal < 0) ssfVal = 0.0
          }
          Investment.SSF = formatDecimal(ssfVal)
        }
        if (Investment.AMC > 0) {
          if (parseInt(Investment.AMC) !== parseInt(Investment.oldAMC)) {
            Investment.AMC = formatDecimal(Investment.oldAMC)
          }
        }
        Investment.Total = parseFloat(Number(Investment.expratio) + Number(Investment.AMC) + Number(Investment.SSF)).toFixed(2)
      } else {
        if (Investment.SSF > 0) {
          ssfVal = Number(ssfVal) + Number(Investment.tload) + Number(Investment.SubTA)
          Investment.SSF = formatDecimal(ssfVal)
          Investment.Total = parseFloat(Number(Investment.expratio) + Number(Investment.AMC) + Number(Investment.SSF)).toFixed(2)
        }
      }
      return Investment
    }
    const Headers = computed(() => {
      return headers.value.filter((h) => !h.hide)
    })
    const assetFundNameLabel = computed(() => {
      let label = ''
      if (props.reports === 'Diagnostic' || props.reports === 'RPEA' || props.reports === 'Proposal_Fund') label = ''
      else label = 'To look up a ticker enter first 3 characters and to look up a asset name enter first name of the asset'
      return label
    })
    const labelForAutocomplete = computed(() => {
      let label = ''
      if (props.reports === 'Proposal_Fund') label = 'Search by Fund Name or Ticker'
      else label = 'Search by Asset Name or Ticker'
      return label
    })
    watch(
      () => props.hideFromFund,
      (val) => {
        headers.value[0].hide = val
      },
      { deep: true }
    )
    watch(
      () => props.modelID,
      (val) => {
        if (
          props.reports === 'Model_Benchmark' ||
          props.reports === 'RPEA_Model' ||
          props.reports === 'ClientProduct_Benchmark'
        ) {
          if (val < 0) headers.value[0].hide = true
          else headers.value[0].hide = false
        }
      },
      { deep: true }
    )
    watch(
      () => props.resetForm,
      () => {
        resetInvestment()
      }
    )
    watch(
      () => props.planId,
      (val) => {
        if (val !== '' && val !== undefined) {
          if (props.investmentList.length !== undefined) {
            if (props.investmentList.length > 0) updateAssetTotal()
          }
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.investmentList,
      () => {
        updateAssetTotal()
      },
      { deep: true }
    )
    watch(
      () => editFees.value,
      () => {
        if (!editFees.value) {
          if (props.reports === 'Diagnostic' || props.reports === 'RPEA') saveEditedFees()
          else updateAssetTotal()
        }
      }
    )
    watch(
      () => investmentType.value,
      (oldvalue, newvalue) => {
        if (oldvalue !== newvalue) {
          assetMsg.value = ''
          asseterror.value = false
          assetlist.value = []
        }
      }
    )
    return {
      theme,
      display,
      valid,
      assetFundNameLabel,
      investmentType,
      assetlist,
      asset,
      labelForAutocomplete,
      showloader,
      asseterror,
      assetMsg,
      cash,
      amcFee,
      amcError,
      amcErrorMsg,
      ssfFee,
      ssfError,
      ssfErrorMsg,
      noRecordsFound,
      overrideAll,
      dialog,
      itemAmountError,
      amountMessage,
      Headers,
      investmentPagination,
      deletepopupinvestment,
      editFees,
      selected,
      platformFee,
      platformFeeError,
      platformFeeErrorMsg,
      advisorFee,
      advisorFeeError,
      advisorFeeErrorMsg,
      deleteFees,
      newInvestment,
      currentLoader,
      editText,
      saveText,
      investmentMsg,
      searchInput,
      assetPercentage,
      error,
      checkPercent,
      SelectAll,
      UnSelectAll,
      longTapFunction,
      formatAmount,
      addRemoveInvestment,
      addSelectedInvestment,
      clearFilter,
      searchFundsResult,
      addInvestment,
      formatAMCPercent,
      formatSSFPercent,
      editFeesAllocation,
      deleteInvestment,
      formatPercent,
      formatDecimal,
      checkAMC,
      checkSSF,
      formatAMCFees,
      formatSSFFees,
      parseFloat,
      checkItemPercent,
      deleteAllInvestment,
      clearOverride,
      formatPlatformFee,
      formatAdvisorFee,
      overrideFees
    }
  }
}
</script>
<style scoped>
.searchResultCard {
  max-width: 850px;
  max-height: 180px !important;
  overflow-y: scroll !important;
}
div.norecords {
  text-align: center;
  color: #333333;
  text-rendering: optimizeLegibility;
}
</style>
