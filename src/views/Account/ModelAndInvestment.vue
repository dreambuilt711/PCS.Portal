<template>
  <v-container fluid>
    <v-col class="pa-0">
      <v-dialog
        v-model="modelDialog"
        persistent
        scrollable
        max-width="1000px"
        class="elevation-3"
        content-class="elevation-3"
        :eager="true"
      >
        <template #activator="{ props }">
          <v-col cols="12" xl="12" md="12" sm="12" xs="12" class="pt-2 pa-0">
            <v-row>
              <v-col cols="4" lg="4" xl="4" md="4" sm="4" xs="12" class="text-left">
                <h1 class="font-weight-medium">Models</h1>
              </v-col>
              <v-col cols="8" xl="8" md="8" sm="8" xs="12" class="text-right">
                <v-btn
                  v-if="
                    $authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full) &&
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  :color="theme.dark ? '' : 'accent'"
                  v-bind="props"
                  class="ma-0"
                  @click="showModelDialog()"
                >
                  New Prospect Model
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </template>
        <v-card>
          <v-card-title class="pa-3" fixed :class="theme.dark ? '' : 'bg-accent secondary--text'">
            <v-row>
              <v-col cols="11" xl="11" lg="11" sm="11" md="11" xs="11">
                <h3 v-if="!display.xs.value">New Prospect Model</h3>
                <h4 v-if="display.xs.value">New Prospect Model</h4>
              </v-col>
              <v-col cols="1" xl="1" lg="1" sm="1" md="1" xs="1" class="text-right align-self">
                <v-icon :color="theme.dark ? '' : 'secondary'" @click="resetModel()"> close </v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text id="modelContainer" style="height: 700px">
            <v-form ref="form" v-model="validModelBuilder">
              <v-container class="pa-0">
                <v-col v-if="modelID >= 0" cols="12" xs="12" class="pb-2">
                  <h3 class="font-weight-medium">
                    This Model is only available for Prospecting.
                    <br />
                    <i
                      >If you like to establish this model for Client(s), please reach out to your sales rep or contact
                      {{ advisorContactId }}</i
                    >
                  </h3>
                </v-col>
                <v-col class="pa-0">
                  <v-row>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2 pb-3 pa-0">
                      <h2 :class="theme.dark ? '' : 'grey--text text--darken-3'">Model Details</h2>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="modelInvest pr-2 pa-0">
                      <v-text-field
                        ref="modelname"
                        v-model="modelName"
                        variant="outlined"
                        density="compact"
                        label="Model Name"
                        required
                        :error="modelfunderror"
                        :error-messages="modelMessage"
                        autocomplete="autofill-off"
                        autofocus
                        :rules="[(v) => !!v || 'Model name required']"
                        :disabled="modelID < 0"
                      />
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2 pa-0">
                      <v-text-field
                        v-model="modelDescription"
                        variant="outlined"
                        density="compact"
                        label="Model Description"
                        maxlength="250"
                        counter="250"
                        auto-grow
                        rows="1"
                        autocomplete="autofill-off"
                        :disabled="modelID < 0"
                      />
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" sm="12" md="12" xs="12" class="pt-3 pb-2 pa-0">
                      <v-divider />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                      <h2 :class="theme.dark ? '' : 'grey--text text--darken-3'">Add Investments</h2>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12">
                      <AddInvestment
                        ref="addInvestement"
                        :reports="'Model_Benchmark'"
                        :investment-list="modelInvestmentList"
                        :plan-id="planProposalID"
                        :reset-form="modelDialog"
                        :additional-investment="true"
                        :model-i-d="modelID"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="planList.length > 0" class="pt-2 pb-2 pa-0">
                  <v-divider />
                </v-col>
                <v-col v-if="planList.length > 0" cols="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                  <h2 :class="theme.dark ? '' : 'grey--text text--darken-3'">Plan List</h2>
                </v-col>
                <v-col v-if="planList.length > 0" class="pt-2 pb-2 pa-0">
                  <v-data-table
                    :headers="planHeader"
                    :items="planList"
                    item-key="PlanID"
                    hide-default-footer
                    :disable-pagination="true"
                    :items-per-page="-1"
                    class="elevation-0 changeTableColor fixHeader"
                    :fixed-header="true"
                    style="backface-visibility: hidden"
                  >
                    <template #no-data>
                      <p class="text-center">No Plans Currently Use This Model</p>
                    </template>
                    <template #header="props">
                      <th
                        v-for="header in props.headers"
                        v-show="header.text"
                        :key="header.text"
                        :align="header.align"
                        :width="header.width"
                      >
                        {{ header.text }}
                      </th>
                    </template>
                    <template #item="props">
                      <tr>
                        <td>{{ props.item.PlanID }}</td>
                        <td>{{ props.item.PlanNam }}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col class="pt-2 pb-2 pa-0">
                  <v-divider />
                </v-col>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                  <h2 :class="theme.dark ? '' : 'grey--text text--darken-3'">Description</h2>
                </v-col>
                <v-col class="pt-2 pb-2 pa-0">
                  <v-textarea
                    v-model="summary"
                    variant="outlined"
                    density="compact"
                    label="Enter Description"
                    auto-grow
                    rows="1"
                    maxlength="1100"
                    counter="1100"
                    autocomplete="autofill-off"
                  />
                </v-col>
                <v-col class="pt-2 pb-2 pa-0">
                  <v-divider />
                </v-col>
                <v-col id="performanceDiv" cols="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                  <h2 :class="theme.dark ? '' : 'grey--text text--darken-3'">Performance</h2>
                </v-col>
                <v-col class="pt-2 pb-2">
                  <v-row>
                    <v-col cols="6" xs="6" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-text-field
                          v-model="rtn1Month"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          variant="outlined"
                          density="compact"
                          label="1 Month"
                          autocomplete="autofill-off"
                          suffix="%"
                          :disabled="disableText"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="6" xs="6" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-text-field
                          v-model="rtn3Month"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          variant="outlined"
                          density="compact"
                          label="3 Month"
                          autocomplete="autofill-off"
                          suffix="%"
                          :disabled="disableText"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="6" xs="6" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-text-field
                          v-model="rtn1Year"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          variant="outlined"
                          density="compact"
                          label="1 Year"
                          autocomplete="autofill-off"
                          suffix="%"
                          :disabled="disableText"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="6" xs="6" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-text-field
                          v-model="rtn3Year"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          variant="outlined"
                          density="compact"
                          label="3 Year"
                          autocomplete="autofill-off"
                          suffix="%"
                          :disabled="disableText"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="6" xs="6" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-text-field
                          v-model="rtn5Year"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          variant="outlined"
                          density="compact"
                          label="5 Year"
                          autocomplete="autofill-off"
                          suffix="%"
                          :disabled="disableText"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="6" xs="6" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-text-field
                          v-model="rtn10Year"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          variant="outlined"
                          density="compact"
                          label="10 Year"
                          autocomplete="autofill-off"
                          suffix="%"
                          :disabled="disableText"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="10" xs="10" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-text-field
                          v-model="rtnInception"
                          v-input-mask="{
                            alias: 'numeric',
                            digits: '2',
                            digitsOptional: true,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false
                          }"
                          variant="outlined"
                          density="compact"
                          label="Inception"
                          autocomplete="autofill-off"
                          suffix="%"
                          :disabled="disableText"
                        />
                      </v-col>
                    </v-col>
                    <v-col cols="10" xs="10" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                          <template #activator="{ props }">
                            <v-text-field
                              v-model="rtnAsOf"
                              v-input-mask="{
                                alias: 'datetime',
                                inputFormat: 'mm/dd/yyyy',
                                showMaskOnHover: false
                              }"
                              variant="outlined"
                              density="compact"
                              label="As of Date"
                              autocomplete="autofill-off"
                              :error-messages="checkasofDateErrorMsg"
                              :error="checkasofDateError"
                              :disabled="disableText"
                              @update:model-value="dateAsOf = parseDate(rtnAsOf, 'asOfDate')"
                              @blur="checkasofDate(rtnAsOf)"
                              append-inner-icon="event"
                              v-bind="props"
                            >
                              <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                            </v-text-field>
                          </template>
                          <v-date-picker v-model="dateAsOf" color="accent" @input="menu1 = false" />
                        </v-menu>
                      </v-col>
                    </v-col>
                    <v-col cols="10" xs="10" sm="3" class="pa-0">
                      <v-col cols="11" xs="11" class="pa-0">
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :offset="30"
                          transition="scale-transition"
                          min-width="290px"
                        >
                          <template #activator="{ props }">
                            <v-text-field
                              v-model="rtnInceptionDate"
                              variant="outlined"
                              density="compact"
                              v-input-mask="{
                                alias: 'datetime',
                                inputFormat: 'mm/dd/yyyy',
                                showMaskOnHover: false
                              }"
                              label="Inception Date"
                              autocomplete="autofill-off"
                              :disabled="disableText"
                              :error-messages="checkDateErrorMsg"
                              :error="checkDateError"
                              @update:model-value="dateInception = parseDate(rtnInceptionDate, 'inception')"
                              @blur="checkDate(rtnInceptionDate)"
                              append-inner-icon="event"
                              v-bind="props"
                            >
                              <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                            </v-text-field>
                          </template>
                          <v-date-picker v-model="dateInception" color="accent" @input="menu2 = false" />
                        </v-menu>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="pt-2 pb-2 pa-0">
                  <v-divider />
                </v-col>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                  <h2 :class="theme.dark ? 'pb-1' : 'grey--text text--darken-3 pb-1'">Choose Your Benchmark</h2>
                  <h4>
                    The default benchmark is Lipper's primary benchmark for each asset, weighted based on the allocation of your
                    model. To change the benchmark, check the override checkbox and select a custom benchmark.
                  </h4>
                </v-col>
                <v-col v-if="defaultBenchmarkList.length > 0" class="pt-2 pb-2 pa-0">
                  <v-data-table
                    class="elevation-0 changeTableColor fixHeader"
                    :items-per-page="-1"
                    :headers="benchmarkHeader"
                    :items="defaultBenchmarkList"
                    item-key="Name"
                    hide-default-footer
                    :disable-pagination="true"
                    :mobile-breakpoint="0"
                    :fixed-header="true"
                    style="backface-visibility: hidden"
                  >
                    <template #item="props">
                      <tr>
                        <td class="text-capitalize">
                          {{ props.item.Name }}
                        </td>
                        <td>{{ props.item.Amount * 100 }}%</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col class="pt-2 pb-2 pa-0">
                  <v-row>
                    <v-col class="pa-0">
                      <v-switch
                        v-model="override"
                        hide-details
                        label="Override Default Indices"
                        class="offsetSwitch ma-1"
                        :disabled="disableText"
                        color="accent"
                        @update:model-value="overrideChange"
                      />
                    </v-col>
                  </v-row>
                  <v-col v-show="showBenchmark" cols="12" xs="12" class="pa-0">
                    <v-row>
                      <v-col
                        :class="display.smAndDown.value ? '' : 'pr-3'"
                        xs="12"
                        :sm="display.smAndDown.value ? '12' : '7'"
                        class="pa-0"
                      >
                        <v-select
                          v-model="benchmark"
                          variant="outlined"
                          :items="benchmarklist"
                          :return-object="true"
                          label="Benchmark"
                          clearable
                          autocomplete="autofill-off"
                          :menu-props="{ overflowY: true }"
                          hide-details
                          item-title="Name"
                          item-value="BenchmarkID"
                          auto-select-first
                          :disabled="modelID < 0"
                          density="compact"
                        />
                      </v-col>
                      <v-col
                        class="align-self pa-0"
                        :class="display.smAndDown.value ? 'pt-3' : ''"
                        xs="12"
                        :sm="display.smAndDown.value ? '12' : '5'"
                      >
                        <a
                          class="handcursor text_decoration font_14 align-self ml-3"
                          :class="[
                            theme.dark
                              ? modelID < 0
                                ? 'disabledDarkMode'
                                : 'text-white'
                              : modelID < 0
                                ? 'disabled'
                                : 'text-accent'
                          ]"
                          @click.prevent="modelID < 0 ? '' : addBenchmark()"
                        >
                          <b>Manually Add Benchmark</b>
                        </a>
                      </v-col>

                      <v-col v-if="benchmarklist.length > 0" class="pt-2 pb-2 pa-0" cols="12" xs="12">
                        <v-data-table
                          class="elevation-0 changeTableColor fixHeader"
                          :hide-default-header="display.smAndDown.value"
                          :items-per-page="-1"
                          :headers="currentModelHeaderList"
                          :items="benchmarklist"
                          item-key="BenchmarkID"
                          hide-default-footer
                          :disable-pagination="true"
                          :fixed-header="true"
                          style="backface-visibility: hidden"
                        >
                          <template #header="props">
                            <th
                              v-for="header in props.headers"
                              v-show="header.text"
                              :key="header.text"
                              :align="header.align"
                              :width="header.width"
                            >
                              {{ header.text }}
                            </th>
                          </template>
                          <template #item="props">
                            <tr v-if="!display.smAndDown.value">
                              <td>
                                <v-row>
                                  <div>
                                    <v-hover v-slot="{ hover }">
                                      <h4 class="pt-1" :class="hover ? 'text-decoration-underline text-capitalize' : ''">
                                        <a
                                          :class="[
                                            theme.dark
                                              ? modelID < 0
                                                ? 'handcursor text_decoration disabledDarkMode text-capitalize'
                                                : 'handcursor text_decoration text-white text-capitalize'
                                              : modelID < 0
                                                ? 'text_decoration text-capitalize disabled'
                                                : 'handcursor text_decoration text-accent text-capitalize'
                                          ]"
                                          @click.prevent="modelID < 0 ? '' : editBenchmark(props.item)"
                                        >
                                          <b>{{ props.item.Name }}</b>
                                        </a>
                                      </h4>
                                    </v-hover>
                                  </div>
                                </v-row>
                              </td>
                              <td class="modelname text-wrap wrapword">
                                {{ props.item.Description }}
                              </td>
                              <td class="text-center">
                                <v-tooltip location="top">
                                  <template #activator="{ props }">
                                    <v-btn
                                      icon
                                      variant="text"
                                      :color="!theme.dark ? 'accent' : ''"
                                      v-bind="props"
                                      :disabled="modelID < 0"
                                      @click="copyBenchmark(props.item)"
                                    >
                                      <v-icon size="small"> mdi-content-copy </v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Create Copy</span>
                                </v-tooltip>
                              </td>
                              <td class="text-center">
                                <v-btn
                                  icon
                                  variant="text"
                                  :color="!theme.dark ? 'error' : ''"
                                  :disabled="modelID < 0"
                                  @click.stop="deletePopUpBenchmark[props.item.BenchmarkID] = true"
                                >
                                  <v-icon size="small"> fas fa-trash </v-icon>
                                </v-btn>
                                <v-dialog
                                  :key="props.item.BenchmarkID"
                                  v-model="deletePopUpBenchmark[props.item.BenchmarkID]"
                                  :scrollable="false"
                                  max-width="350"
                                  content-class="elevation-3"
                                >
                                  <ActionPopUp
                                    confirm-action-text="Delete"
                                    cancel-action-text="Cancel"
                                    action-text="Delete Benchmark"
                                    :action-message="`Are you sure you want to delete the benchmark <b>${props.item.Name}</b> from Benchmark lineup?`"
                                    @confirm-action="deleteBenchmark(props.item)"
                                    @cancel-action="deletePopUpBenchmark[props.item.BenchmarkID] = false"
                                  />
                                </v-dialog>
                              </td>
                            </tr>
                            <tr v-else>
                              <v-col ml-2>
                                <v-row>
                                  <v-col cols="9" xs="9">
                                    <h5 class="pt-1">
                                      <span class="text-grey">Name</span>
                                    </h5>
                                    <h4 class="text-uppercase">
                                      <a
                                        href="javascript:void(0)"
                                        :class="[
                                          theme.dark
                                            ? modelID < 0
                                              ? 'handcursor text_decoration disabledDarkMode text-capitalize'
                                              : 'handcursor text_decoration text-white text-capitalize'
                                            : modelID < 0
                                              ? 'text_decoration text-capitalize disabled'
                                              : 'handcursor text_decoration text-accent text-capitalize'
                                        ]"
                                        @click.prevent="modelID < 0 ? '' : editBenchmark(props.item)"
                                      >
                                        <b>{{ props.item.Name }}</b>
                                      </a>
                                    </h4>
                                  </v-col>
                                  <v-col cols="2" xs="2">
                                    <v-tooltip location="top">
                                      <template #activator="{ props }">
                                        <v-btn
                                          icon
                                          variant="text"
                                          :color="!theme.dark ? 'accent' : ''"
                                          v-bind="props"
                                          :disabled="modelID < 0"
                                          @click="copyBenchmark(props.item)"
                                        >
                                          <v-icon size="small"> mdi-content-copy </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Create Copy</span>
                                    </v-tooltip>
                                  </v-col>
                                  <v-col cols="9" xs="9">
                                    <h5 class="pt-1">
                                      <span class="text-grey">Description</span>
                                    </h5>
                                    <h4 class="text-uppercase">
                                      {{
                                        props.item.Description.length > 80
                                          ? props.item.Description.substring(0, 80) + '...'
                                          : props.item.Description
                                      }}
                                    </h4>
                                  </v-col>

                                  <v-col cols="2" xs="2">
                                    <v-tooltip location="top">
                                      <template #activator="{ props }">
                                        <div v-on="on">
                                          <v-btn
                                            v-bind="props"
                                            icon
                                            variant="text"
                                            :color="!theme.dark ? 'error' : ''"
                                            :disabled="modelID < 0"
                                            @click.stop="deletePopUpBenchmark[props.item.BenchmarkID] = true"
                                          >
                                            <v-icon size="small"> fas fa-trash </v-icon>
                                          </v-btn>
                                          <v-dialog
                                            :key="props.item.BenchmarkID"
                                            v-model="deletePopUpBenchmark[props.item.BenchmarkID]"
                                            :scrollable="false"
                                            max-width="310"
                                            content-class="elevation-3"
                                          >
                                            <ActionPopUp
                                              confirm-action-text="Delete"
                                              cancel-action-text="Cancel"
                                              action-text="Delete Benchmark"
                                              :action-message="`Are you sure you want to delete the benchmark <b>${props.item.Name}</b> from Benchmark lineup?`"
                                              @confirm-action="deleteBenchmark(props.item)"
                                              @cancel-action="deletePopUpBenchmark[props.item.BenchmarkID] = false"
                                            />
                                          </v-dialog>
                                        </div>
                                      </template>
                                      <span>Delete</span>
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-show="addManualBenchmark" id="benchmarkDiv" class="pa-0">
                    <v-form v-model="validAdd">
                      <v-row>
                        <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2 pa-0">
                          <v-text-field
                            ref="benchmarkNameField"
                            v-model="benchmarkName"
                            label="Name"
                            autocomplete="autofill-off"
                            :error="benchmarkNameError"
                            :error-messages="benchmarkNameMsg"
                            variant="outlined"
                            density="compact"
                            @blur="validateBenchmarkName()"
                          />
                        </v-col>
                        <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pr-2 pa-0">
                          <v-text-field
                            v-model="benchmarkDescription"
                            label="Description"
                            autocomplete="autofill-off"
                            maxlength="250"
                            counter="250"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col cols="12" xl="7" lg="7" md="7" sm="8" xs="12" class="pr-2 pa-0">
                          <v-autocomplete
                            v-model="benchmarkIndex"
                            :items="benchmarkIndexList"
                            return-object
                            variant="outlined"
                            density="compact"
                            label="Search Index Name"
                            persistent-hint
                            clearable
                            auto-select-first
                            hide-no-data
                            item-title="name"
                            item-value="ticker"
                            :error="benchmarkIndexError"
                            :error-messages="benchmarkIndexMsg"
                            autocomplete="autofill-off"
                            @update:model-value="getIndexNameList"
                          />
                        </v-col>
                        <v-col cols="12" lg="2" md="2" sm="2" xs="12" class="pr-2 pa-0">
                          <v-text-field
                            v-model="benchmarkPercentage"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '2',
                              digitsOptional: true,
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false
                            }"
                            label="Percentage"
                            maxlength="5"
                            suffix="%"
                            autocomplete="autofill-off"
                            :error="percentageError"
                            :error-messages="percentageMsg"
                            variant="outlined"
                            density="compact"
                            @blur="checkPercent()"
                          />
                        </v-col>
                        <v-col cols="2" xl="2" lg="2" sm="2" xs="2" md="2" class="text-right pa-0">
                          <v-btn
                            :color="theme.dark ? '' : 'accent'"
                            :class="theme.dark ? 'ml-0' : 'secondary--text ml-0'"
                            size="small"
                            @click="saveIndex()"
                          >
                            Add Index
                          </v-btn>
                        </v-col>
                        <v-col v-if="benchmarkBuilders.length > 0" cols="12" xs="12" class="pa-0">
                          <v-data-table
                            class="elevation-0 changeTableColor fixHeader"
                            :hide-default-header="display.smAndDown.value"
                            :items-per-page="-1"
                            :headers="benchmarkBuilderHeader"
                            :items="benchmarkBuilders"
                            hide-default-footer
                            :disable-pagination="true"
                            item-key="ID"
                            :fixed-header="true"
                            style="backface-visibility: hidden"
                          >
                            <template #item="props">
                              <tr v-if="!display.smAndDown.value">
                                <td>{{ props.item.Name }}</td>
                                <template v-if="props.item.edit">
                                  <td class="text-right">{{ parseFloat(props.item.Amount).toFixed(2) }}%</td>
                                </template>
                                <template v-else>
                                  <td>
                                    <v-text-field
                                      v-model.lazy="props.item.Amount"
                                      v-input-mask="{
                                        alias: 'numeric',
                                        digits: '0',
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
                                      @blur="checkItemPercent(props.item)"
                                    />
                                  </td>
                                </template>
                                <td class="text-center">
                                  <v-btn v-show="props.item.edit" icon variant="text" @click="editIndex(props.item)">
                                    <v-icon size="small" :color="!theme.dark ? 'accent' : ''" class="handcursor"> edit </v-icon>
                                  </v-btn>
                                  <v-btn v-show="!props.item.edit" icon variant="text" @click="updateIndex(props.item)">
                                    <v-icon size="small" :color="!theme.dark ? 'accent' : ''" class="handcursor"> save </v-icon>
                                  </v-btn>

                                  <v-btn
                                    icon
                                    variant="text"
                                    :color="!theme.dark ? 'error' : ''"
                                    class="handcursor"
                                    @click.stop="deletePopUp[props.item.ID] = true"
                                  >
                                    <v-icon size="small"> fas fa-trash </v-icon>
                                  </v-btn>
                                  <v-dialog
                                    :key="props.item.ID"
                                    v-model="deletePopUp[props.item.ID]"
                                    :scrollable="false"
                                    max-width="350"
                                    content-class="elevation-3"
                                  >
                                    <ActionPopUp
                                      confirm-action-text="Delete"
                                      cancel-action-text="Cancel"
                                      action-text="Delete BenchmarkBuilder"
                                      :action-message="`Are you sure you want to delete the BenchmarkBuilder <b>${props.item.Name}</b> from Benchmark lineup?`"
                                      @confirm-action="deleteBenchmarkBuilder(props.item)"
                                      @cancel-action="deletePopUp[props.item.ID] = false"
                                    />
                                  </v-dialog>
                                </td>
                              </tr>
                              <tr v-else>
                                <v-col class="ml-2 mb-2">
                                  <v-row>
                                    <v-col cols="9" xs="9">
                                      <h5 class="pt-1">
                                        <span class="text-grey">Name</span>
                                      </h5>
                                      <h4 class="text-uppercase">
                                        {{ props.item.Name }}
                                      </h4>
                                    </v-col>

                                    <v-col cols="2" xs="2">
                                      <v-btn
                                        icon
                                        variant="text"
                                        :color="!theme.dark ? 'error' : ''"
                                        class="handcursor"
                                        @click.stop="deletePopUp[props.item.ID] = true"
                                      >
                                        <v-icon size="small"> fas fa-trash </v-icon>
                                      </v-btn>
                                      <v-dialog
                                        :key="props.item.ID"
                                        v-model="deletePopUp[props.item.ID]"
                                        :scrollable="false"
                                        max-width="350"
                                        content-class="elevation-3"
                                      >
                                        <ActionPopUp
                                          confirm-action-text="Delete"
                                          cancel-action-text="Cancel"
                                          action-text="Delete BenchmarkBuilder"
                                          :action-message="`Are you sure you want to delete the BenchmarkBuilder <b>${props.item.Name}</b> from Benchmark lineup?`"
                                          @confirm-action="deleteBenchmarkBuilder(props.item)"
                                          @cancel-action="deletePopUp[props.item.ID] = false"
                                        />
                                      </v-dialog>
                                    </v-col>

                                    <v-col cols="9" xs="9">
                                      <h5 class="pt-1">
                                        <span class="text-grey">Allocation</span>
                                      </h5>
                                      <v-col v-show="props.item.edit" cols="12" xs="12">
                                        <h4 class="text-uppercase">{{ parseFloat(props.item.Amount).toFixed(2) }}%</h4>
                                      </v-col>
                                      <v-col v-show="!props.item.edit" cols="12" xs="12" mb-1>
                                        <v-col cols="11" xs="11">
                                          <v-text-field
                                            v-model.lazy="props.item.Amount"
                                            v-input-mask="{
                                              alias: 'numeric',
                                              digits: '0',
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
                                            @blur="checkItemPercent(props.item)"
                                          />
                                        </v-col>
                                      </v-col>
                                    </v-col>
                                    <v-col cols="2" xs="2">
                                      <v-btn v-show="props.item.edit" icon variant="text" @click="editIndex(props.item)">
                                        <v-icon size="small" :color="!theme.dark ? 'accent' : ''" class="handcursor">
                                          edit
                                        </v-icon>
                                      </v-btn>
                                      <v-btn v-show="!props.item.edit" icon variant="text" @click="updateIndex(props.item)">
                                        <v-icon size="small" :color="!theme.dark ? 'accent' : ''" class="handcursor">
                                          save
                                        </v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </tr>
                            </template>
                            <template v-slot:body.append>
                              <tr v-if="!display.smAndDown.value">
                                <td>
                                  <strong>Total Funds: {{ benchmarkBuilders.length }}</strong>
                                </td>
                                <td class="text-right">
                                  <strong>{{ parseFloat(totalAllocation).toFixed(2) }}%</strong>
                                </td>
                                <td />
                              </tr>
                              <tr v-if="display.smAndDown.value">
                                <td class="pr-3 pl-3">
                                  <v-col cols="12" xs="12">
                                    <v-row>
                                      <v-col cols="4" xs="4">
                                        <v-row>
                                          <v-col cols="12" xs="12">
                                            <h5 class="pt-1">
                                              <span class="text-grey">Total Funds</span>
                                            </h5>
                                            <h4 class="text-uppercase">
                                              {{ benchmarkBuilders.length }}
                                            </h4>
                                          </v-col>
                                        </v-row>
                                      </v-col>
                                      <v-col cols="4" xs="4">
                                        <v-row>
                                          <v-col cols="12" xs="12">
                                            <h5 class="pt-1">
                                              <span class="text-grey">Total Allocation</span>
                                            </h5>
                                            <h4 class="text-uppercase">{{ parseFloat(totalAllocation).toFixed(2) }}%</h4>
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
                        <v-col cols="12" xl="12" lg="12" sm="12" xs="12" md="12" class="text-right pt-2 pa-0">
                          <v-row>
                            <v-col align-self="end" class="pa-0">
                              <v-btn
                                :color="theme.dark ? '' : 'accent'"
                                :disabled="!validAdd"
                                size="small"
                                @click="saveBenchmark()"
                              >
                                Save Benchmark
                              </v-btn>
                              <v-btn
                                variant="outlined"
                                :color="theme.dark ? '' : 'accent'"
                                size="small"
                                @click="closeBenchmark()"
                              >
                                Back
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-col>
                </v-col>
                <v-col class="pt-2 pb-2 pa-0">
                  <v-divider />
                </v-col>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" class="pb-1 pa-0">
                  <h2 :class="theme.dark ? 'pb-1' : 'grey--text text--darken-3 pb-1'">Performance Disclosure</h2>
                </v-col>
                <v-col class="pa-0">
                  <v-textarea
                    v-model="rtnDisclosure"
                    variant="outlined"
                    density="compact"
                    label="Enter Disclosure"
                    auto-grow
                    rows="1"
                    maxlength="500"
                    counter="500"
                    autocomplete="autofill-off"
                    :disabled="modelID < 0"
                  />
                </v-col>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider class="bold" />
          <v-card-actions v-if="modelID >= 0">
            <v-btn :class="theme.dark ? '' : 'bg-accent'" :disable="!valid" @click="saveModelInvestment()">
              Save And Close
            </v-btn>
            <v-btn :color="theme.dark ? '' : 'accent'" variant="outlined" @click="resetModel()"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col cols="12" xs="12" class="pa-0">
      <v-data-table
        loader-height="2"
        :hide-default-header="display.smAndDown.value"
        :options="options"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
        :headers="currentModelHeaders"
        :items="currentModelList"
        item-key="ModelID"
        class="elevation-2"
        :loading="isLoading"
      >
        <template #header="props">
          <th v-for="header in props.headers" :key="header.text" :align="header.align" :width="header.width">
            {{ header.text }}
          </th>
        </template>
        <template #item="props">
          <tr v-if="!display.smAndDown.value">
            <td>
              <v-hover v-slot="{ hover }">
                <h4 @click="editModel(props.item)">
                  <a
                    href="javascript:void(0)"
                    class="handcursor"
                    :class="[theme.dark ? '' : 'text-hyperlink', hover ? 'text-decoration-underline' : '']"
                    >{{ props.item.Name }}</a
                  >
                </h4>
              </v-hover>
            </td>
            <td class="modelname text-wrap wrapword">
              {{ props.item.Description }}
            </td>
            <td v-if="$authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full)" class="text-center">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-btn icon variant="text" :color="!theme.dark ? 'accent' : ''" v-bind="props" @click="copyModel(props.item)">
                    <v-icon size="small"> mdi-content-copy </v-icon>
                  </v-btn>
                </template>
                <span>Create Copy</span>
              </v-tooltip>
            </td>
            <td class="text-center">
              <v-btn
                v-if="props.item.ModelID > 0"
                icon
                variant="text"
                :color="!theme.dark ? 'error' : ''"
                @click.stop="deletePopUpmodel[props.item.ModelID] = true"
              >
                <v-icon size="small"> fas fa-trash </v-icon>
              </v-btn>
              <v-dialog
                :key="props.item.ModelID"
                v-model="deletePopUpmodel[props.item.ModelID]"
                :scrollable="false"
                max-width="350"
                content-class="elevation-3"
              >
                <ActionPopUp
                  confirm-action-text="Delete"
                  cancel-action-text="Cancel"
                  action-text="Delete Model"
                  :action-message="`Are you sure you want to delete the model <b>${props.item.Name}</b> from Model lineup?`"
                  @confirm-action="deleteModel(props.item)"
                  @cancel-action="deletePopUpmodel[props.item.ModelID] = false"
                />
              </v-dialog>
            </td>
          </tr>
          <tr v-else>
            <v-col class="ml-2 mb-2">
              <v-row>
                <v-col cols="10" xs="10">
                  <h5 class="pt-1">
                    <span class="text-grey">Name</span>
                  </h5>
                  <h4 class="text-uppercase">
                    <a
                      href="javascript:void(0)"
                      :class="theme.dark ? 'handcursor text_decoration text-white' : 'handcursor text_decoration text-accent'"
                      @click="editModel(props.item)"
                    >
                      <b>{{ props.item.Name }}</b>
                    </a>
                  </h4>
                </v-col>
                <v-col v-if="$authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full)" cols="2" xs="2">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-btn
                        icon
                        variant="text"
                        :color="!theme.dark ? 'accent' : ''"
                        v-bind="props"
                        @click="copyModel(props.item)"
                      >
                        <v-icon size="small"> mdi-content-copy </v-icon>
                      </v-btn>
                    </template>
                    <span>Create Copy</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="10" xs="10">
                  <h5 class="pt-1">
                    <span class="text-grey">Description</span>
                  </h5>
                  <h4>
                    {{
                      props.item.Description.length > 80
                        ? props.item.Description.substring(0, 80) + '...'
                        : props.item.Description
                    }}
                  </h4>
                </v-col>

                <v-col v-if="props.item.ModelID > 0" cols="2" xs="2">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <div v-on="on">
                        <v-btn
                          v-bind="props"
                          icon
                          variant="text"
                          :color="!theme.dark ? 'error' : ''"
                          @click.stop="deletePopUpmodel[props.item.ModelID] = true"
                        >
                          <v-icon size="small"> fas fa-trash </v-icon>
                        </v-btn>
                        <v-dialog
                          :key="props.item.ModelID"
                          v-model="deletePopUpmodel[props.item.ModelID]"
                          :scrollable="false"
                          max-width="310"
                          content-class="elevation-3"
                        >
                          <ActionPopUp
                            confirm-action-text="Delete"
                            cancel-action-text="Cancel"
                            action-text="Delete Model"
                            :action-message="`Are you sure you want to delete the model <b>${props.item.Name}</b> from Model lineup?`"
                            @confirm-action="deleteModel(props.item)"
                            @cancel-action="deletePopUpmodel[props.item.ModelID] = false"
                          />
                        </v-dialog>
                      </div>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-container>
</template>
<script>
import { ref, computed, watch, getCurrentInstance, onMounted } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import AddInvestment from '@/components/TAL/AddInvestment'
import ActionPopUp from '@/components/ActionPopUp'
export default {
  components: {
    AddInvestment,
    ActionPopUp
  },
  props: ['CreateNewModel'],
  setup(props) {
    const display = useDisplay()
    const theme = useTheme()
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $toast = instance.appContext.config.globalProperties.$toast
    const $authz = instance.appContext.config.globalProperties.$authz
    const addInvestement = ref(null)
    const form = ref(null)
    const benchmarkNameField = ref(null)
    const validModelBuilder = ref(true)
    const modelFundMsg = ref('')
    const modelMessage = ref('')
    const snackBar = ref(false)
    const totalNewMgmt = ref(0)
    const totalNewLoad = ref(0)
    const totalNewSubta = ref(0)
    const totalNewExpratio = ref(0)
    const totalNewAMC = ref(0)
    const totalNewSSF = ref(0)
    const totalNewFees = ref(0)
    const modelDialog = ref(false)
    const hasErrors = ref(false)
    const modelID = ref(0)
    const modelName = ref('')
    const modelDescription = ref('')
    const planProposalID = ref(0)
    const currentModelHeaderList = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '30%'
      },
      {
        title: 'Description',
        value: 'Description',
        sortable: true,
        align: 'start',
        width: '40%'
      },
      {
        title: 'Create Copy',
        value: '',
        sortable: false,
        width: '15%',
        align: 'center'
      },
      {
        title: 'Action',
        value: '',
        sortable: false,
        width: '15%',
        align: 'center'
      }
    ])
    const selected = ref([])
    const modelfunderror = ref(false)
    const modelInvestmentList = ref([])
    const valid = ref(false)
    const currentModelList = ref([])
    const options = ref({
      itemsPerPage: 50,
      sortBy: ['Name']
    })
    const rtn1Month = ref(0.0)
    const rtn3Month = ref(0.0)
    const rtn1Year = ref(0.0)
    const rtn3Year = ref(0.0)
    const rtn5Year = ref(0.0)
    const rtn10Year = ref(0.0)
    const rtnInception = ref(0.0)
    const rtnAsOf = ref('')
    const rtnInceptionDate = ref('')
    const rtnDisclosure = ref('')
    const override = ref(false)
    const benchmark = ref('')
    const summary = ref('')
    const benchmarklist = ref([])
    const planList = ref([])
    const menu1 = ref(false)
    const menu2 = ref(false)
    const showBenchmark = ref(false)
    const dateInception = ref(null)
    const dateAsOf = ref(null)
    const benchmarkHeader = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: false
      },
      {
        title: 'Allocation',
        value: 'Amount',
        sortable: false
      }
    ])
    const defaultBenchmarkList = ref([])
    const planHeader = ref([
      {
        title: 'Plan ID',
        value: 'PlanID',
        sortable: false,
        align: 'start'
      },
      {
        title: 'Plan Name',
        value: 'PlanNam',
        sortable: false,
        align: 'start'
      }
    ])
    const rtn1MonthError = ref(false)
    const rtn1MonthMsg = ref('')
    const rtn3MonthError = ref(false)
    const rtn3MonthMsg = ref('')
    const rtn1YearError = ref(false)
    const rtn1YearMsg = ref('')
    const rtn3YearError = ref(false)
    const rtn3YearMsg = ref('')
    const rtn5YearError = ref(false)
    const rtn5YearMsg = ref('')
    const rtn10YearError = ref(false)
    const rtn10YearMsg = ref('')
    const rtnInceptionError = ref(false)
    const rtnInceptionMsg = ref('')
    const addManualBenchmark = ref(false)
    const validAdd = ref(true)
    const benchmarkName = ref('')
    const benchmarkDescription = ref('')
    const benchmarkIndex = ref('')
    const benchmarkIndexList = ref([])
    const benchmarkIndexError = ref(false)
    const benchmarkIndexMsg = ref('')
    const benchmarkPercentage = ref('')
    const percentageError = ref(false)
    const percentageMsg = ref('')
    const benchmarkbuilderId = ref(0)
    const benchmarkBuilderHeader = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '60%'
      },
      {
        title: 'Allocation',
        value: 'Amount',
        sortable: true,
        align: 'end',
        width: '20%'
      },
      {
        title: 'Action',
        value: '',
        sortable: false,
        align: 'center',
        width: '20%'
      }
    ])
    const benchmarkBuilders = ref([])
    const totalAllocation = ref(0)
    const benchmarkNameError = ref(false)
    const benchmarkNameMsg = ref('')
    const disableBenchmark = ref(false)
    const disableText = ref(false)
    const checkDateErrorMsg = ref('')
    const checkDateError = ref(false)
    const checkasofDateErrorMsg = ref('')
    const checkasofDateError = ref(false)
    const isLoading = ref(true)
    const deletePopUp = ref({})
    const deletePopUpBenchmark = ref({})
    const deletePopUpmodel = ref({})
    const isAsOfDate = ref(false)
    const isInceptionDate = ref(false)
    const showSSO = ref(false)
    const finalModelPercent = computed(() => {
      var finalPercent = 0
      for (var i = 0; i < modelInvestmentList.value.length; i++) {
        finalPercent += !(modelInvestmentList.value[i].Amount === -999) ? Number(modelInvestmentList.value[i].Amount) : Number(0)
      }
      return parseFloat(finalPercent).toFixed(2)
    })
    const currentModelHeaders = computed(() => {
      var list = currentModelHeaderList.value
      if (!$authz.hasPermission($authz.permissionSet.Models__c, $authz.permission.Full)) {
        var allinOne = list.findIndex((a) => a.text === 'Create Copy')
        if (allinOne > -1) list.splice(allinOne, 1)
      }
      return list
    })
    const advisorContactId = computed(() => {
      if ($store.state.user.selectedProgram) {
        return $store.state.user.selectedProgram.advisor_Phone_Number__c
      }
      return ''
    })
    const getReliusProfession = () => {
      $axios.get(`/api/v1/advisor/reliusprofession`).then((success) => {
        var reliusProfession = success.data.d !== null ? success.data.d : ''
        showSSO.value = reliusProfession === 'Rep As PM' ? true : false
      })
    }
    const parseDate = (date, from) => {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        if (from === 'asOfDate') isAsOfDate.value = true
        if (from === 'inception') isInceptionDate.value = true
        return null
      }

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    const checkDate = (val) => {
      if (val) {
        if (!Date.parse(val)) {
          rtnInceptionDate.value = ''
          checkDateErrorMsg.value = 'Invalid date'
          checkDateError.value = true
          isInceptionDate.value = true
          dateInception.value = new Date().toISOString().substr(0, 10)
        } else {
          checkDateError.value = false
          checkDateErrorMsg.value = ''
        }
      }
    }
    const checkasofDate = (val) => {
      if (val) {
        if (!Date.parse(val)) {
          rtnAsOf.value = ''
          checkasofDateErrorMsg.value = 'Invalid date'
          checkasofDateError.value = true
          isAsOfDate.value = true
          dateAsOf.value = new Date().toISOString().substr(0, 10)
        } else {
          checkasofDateError.value = false
          checkasofDateErrorMsg.value = ''
        }
      }
    }
    const saveModelInvestment = () => {
      modelfunderror.value = false
      modelMessage.value = ''
      if (modelName.value === '') {
        modelfunderror.value = true
        modelMessage.value = 'Model name required'
        hasErrors.value = true
      }
      if (modelID.value >= 0) {
        if (
          (addInvestement.value.asset === null || addInvestement.value.asset.length === 0) &&
          parseFloat(Number(finalModelPercent.value)) <= 0 &&
          modelInvestmentList.value.length === 0
        ) {
          addInvestement.value.asseterror = true
          addInvestement.value.assetMsg = 'Asset/Cash Name is required'
          hasErrors.value = true
        }
        if (modelID.value >= 0) {
          addInvestement.value.assetAmount = parseFloat(Number(addInvestement.value.assetPercentage)).toFixed(2)
          if (
            (addInvestement.value.assetAmount <= 0 || addInvestement.value.assetAmount === 'NaN') &&
            parseFloat(Number(finalModelPercent.value)) <= 0 &&
            addInvestement.value.asset.length > 0
          ) {
            addInvestement.value.error = true
            addInvestement.value.investmentMsg = 'Percentage value is not valid'
            hasErrors.value = true
          } else if (addInvestement.value.reports === 'Model_Benchmark' && Number(addInvestement.value.totalNewAmount) > 100) {
            addInvestement.value.amountMessage = 'Value exceeded 100 %'
            addInvestement.value.itemAmountError = true
            addInvestement.value.error = false
            hasErrors.value = true
          } else if (parseFloat(Number(finalModelPercent.value)) !== 100) {
            addInvestement.value.amountMessage = 'Model allocation should be 100%'
            addInvestement.value.error = false
            addInvestement.value.itemAmountError = true
            hasErrors.value = true
          }
        }
      }
      if (hasErrors.value) {
        if (
          modelfunderror.value ||
          addInvestement.value.asseterror ||
          addInvestement.value.error ||
          addInvestement.value.itemAmountError
        ) {
          document.getElementById('modelContainer').scrollTop = 0
        } else if (
          rtn1MonthError.value ||
          rtn3MonthError.value ||
          rtn1YearError.value ||
          rtn3YearError.value ||
          rtn5YearError.value ||
          rtn10YearError.value ||
          rtnInceptionError.value
        ) {
          document.getElementById('modelContainer').scrollTop = document.getElementById('performanceDiv').offsetTop
        }
        hasErrors.value = false
        return
      }
      if (modelInvestmentList.value.length > 0) {
        modelInvestmentList.value.sort(function (a, b) {
          return b.index - a.index
        })
      }
      var investList = modelInvestmentList.value.map((rec) => {
        return {
          Id: rec.ID === undefined ? 0 : rec.ID,
          Type: rec.Type,
          Ticker: rec.Ticker,
          Name: rec.Name,
          Amount: Number(rec.Amount) > 0 ? Number(parseFloat(rec.Amount / 100).toFixed(4)) : 0,
          Code: rec.Code === undefined ? '' : rec.Code,
          Taxable: rec.Taxable === undefined ? false : rec.Taxable
        }
      })
      var modelInvestment = {
        Id: modelID.value,
        Name: modelName.value,
        Description: modelDescription.value,
        Investments: investList
      }
      var modelInvestmentDetails = {
        Summary: summary.value,
        Rtn1Month: Number(rtn1Month.value) > 0 ? Number(rtn1Month.value) / 100 : 0,
        Rtn3Month: Number(rtn3Month.value) > 0 ? Number(rtn3Month.value) / 100 : 0,
        Rtn1Year: Number(rtn1Year.value) > 0 ? Number(rtn1Year.value) / 100 : 0,
        Rtn3Year: Number(rtn3Year.value) > 0 ? Number(rtn3Year.value) / 100 : 0,
        Rtn5Year: Number(rtn5Year.value) > 0 ? Number(rtn5Year.value) / 100 : 0,
        Rtn10Year: Number(rtn10Year.value) > 0 ? Number(rtn10Year.value) / 100 : 0,
        RtnInception: Number(rtnInception.value) > 0 ? Number(rtnInception.value) / 100 : 0,
        RtnAsOf: rtnAsOf.value,
        RtnInceptionDate: rtnInceptionDate.value,
        Disclosure: rtnDisclosure.value,
        BenchmarkId: override.value === true ? (benchmark.value !== '' ? benchmark.value.BenchmarkID : 0) : 0
      }
      if (modelInvestment.Name !== '') {
        $axios.put(`/api/v1/tal/model`, modelInvestment).then((success) => {
          if (success.data.d != null) {
            modelID.value = success.data.d.id
            $axios.delete(`/api/v1/tal/model/details/${success.data.d.id}`).then(() => {
              $axios.post(`/api/v1/tal/model/details/${success.data.d.id}`, modelInvestmentDetails)
            })
            resetModel()
            getPlanModels()
            $toast?.destroy()
            $toast.success('Model Investments Saved Successfully', '')
          }
        })
      }
    }
    const editModel = (modelItem) => {
      if (modelItem !== null && modelItem.ModelID != null) {
        modelDialog.value = false
        resetModel()
        $axios.get(`/api/v1/tal/model/${modelItem.ModelID}`).then((success) => {
          if (success.data.d !== null) {
            modelName.value = modelItem.Name
            modelID.value = modelItem.ModelID
            modelDescription.value = modelItem.Description
            success.data.d.map(function (item) {
              item.Amount = Number(parseFloat(item.Amount * 100).toFixed(4))
            })
            modelInvestmentList.value = success.data.d
            if (modelInvestmentList.value.length > 0) {
              modelInvestmentList.value.forEach((element, index) => {
                element.index = index + 1
                element.mgmt = element.mgmt * 100
                element.tload = element.tload * 100
                element.SubTA = element.SubTA * 100
                element.expratio = element.expratio * 100
                element.Total = element.Total * 100
              })
            }
            loadDetails(modelItem.ModelID)
            getDefaultBenchmark(modelItem.ModelID)
            showPlanList(modelItem.ModelID)
            modelDialog.value = true
            modelfunderror.value = false
            addManualBenchmark.value = false
            disableText.value = modelID.value < 0 ? true : false
            document.getElementById('modelContainer').scrollTop = 0
          }
        })
      }
    }
    const getPlanModels = () => {
      $axios
        .get(`/api/v1/tal/proposal/${planProposalID.value}/models`)
        .then((success) => {
          if (success.data.d !== null) {
            isLoading.value = false
            currentModelList.value = success.data.d.length > 0 ? success.data.d : []
          }
        })
        .finally(() => {
          isLoading.value = false
        })
    }
    const getDefaultBenchmark = (modelId) => {
      $axios.get(`/api/v1/tal/benchmark/${modelId}/defaultbenchmark`).then((success) => {
        defaultBenchmarkList.value = success.data.d.length > 0 ? success.data.d : []
      })
    }
    const resetModel = () => {
      form.value.reset(), (validModelBuilder.value = true), (modelName.value = '')
      modelID.value = 0
      modelDescription.value = ''
      modelInvestmentList.value = []
      modelFundMsg.value = ''
      snackBar.value = false
      modelfunderror.value = false
      modelDialog.value = false
      rtn1Month.value = 0.0
      rtn3Month.value = 0.0
      rtn1Year.value = 0.0
      rtn3Year.value = 0.0
      rtn5Year.value = 0.0
      rtn10Year.value = 0.0
      rtnInception.value = 0.0
      rtnAsOf.value = ''
      rtnInceptionDate.value = ''
      rtnDisclosure.value = ''
      override.value = false
      benchmark.value = ''
      summary.value = ''
      rtn1MonthError.value = false
      rtn1MonthMsg.value = ''
      rtn3MonthError.value = false
      rtn3MonthMsg.value = ''
      rtn1YearError.value = false
      rtn1YearMsg.value = ''
      rtn3YearError.value = false
      rtn3YearMsg.value = ''
      rtn5YearError.value = false
      rtn5YearMsg.value = ''
      rtn10YearError.value = false
      rtn10YearMsg.value = ''
      rtnInceptionError.value = false
      rtnInceptionMsg.value = ''
      modelfunderror.value = false
      modelMessage.value = ''
      addManualBenchmark.value = false
      planList.value = []
      defaultBenchmarkList.value = []
      disableText.value = false
      document.getElementById('modelContainer').scrollTop = 0
    }
    const showModelDialog = () => {
      resetModel()
      modelDialog.value = true
      modelfunderror.value = false
      document.getElementById('modelContainer').scrollTop = 0
    }
    const copyModel = (modelObject) => {
      $axios
        .post(`/api/v1/tal/model/${modelObject.ModelID}/copy`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          getPlanModels()
        })
    }
    const getBenchmark = () => {
      $axios.get(`/api/v1/tal/benchmarks`).then((success) => {
        benchmarklist.value = success.data.d.length > 0 ? success.data.d : []
      })
    }
    const deleteModel = (modelObject) => {
      currentModelList.value.splice(currentModelList.value.indexOf(modelObject.ModelID), 1)
      if (modelObject !== null && modelObject !== '') {
        $axios.delete(`/api/v1/tal/model/${modelObject.ModelID}`).then(() => {
          getPlanModels()
        })
      }
    }
    const loadDetails = (modelId) => {
      $axios.get(`/api/v1/tal/model/details/${modelId}`).then((success) => {
        summary.value = success.data.d.length > 0 ? success.data.d[0].Summary : ''
        rtn1Month.value =
          success.data.d.length > 1
            ? Number(parseFloat(success.data.d[1].RTN_1Month * 100).toFixed(2))
            : success.data.d.length > 0
              ? Number(parseFloat(success.data.d[0].RTN_1Month * 100).toFixed(2))
              : 0.0
        rtn3Month.value =
          success.data.d.length > 1
            ? Number(parseFloat(success.data.d[1].RTN_3Month * 100).toFixed(2))
            : success.data.d.length > 0
              ? Number(parseFloat(success.data.d[0].RTN_3Month * 100).toFixed(2))
              : 0.0
        rtn1Year.value =
          success.data.d.length > 1
            ? Number(parseFloat(success.data.d[1].RTN_1Year * 100).toFixed(2))
            : success.data.d.length > 0
              ? Number(parseFloat(success.data.d[0].RTN_1Year * 100).toFixed(2))
              : 0.0
        rtn3Year.value =
          success.data.d.length > 1
            ? Number(parseFloat(success.data.d[1].RTN_3Year * 100).toFixed(2))
            : success.data.d.length > 0
              ? Number(parseFloat(success.data.d[0].RTN_3Year * 100).toFixed(2))
              : 0.0
        rtn5Year.value =
          success.data.d.length > 1
            ? Number(parseFloat(success.data.d[1].RTN_5Year * 100).toFixed(2))
            : success.data.d.length > 0
              ? Number(parseFloat(success.data.d[0].RTN_5Year * 100).toFixed(2))
              : 0.0
        rtn10Year.value =
          success.data.d.length > 1
            ? Number(parseFloat(success.data.d[1].RTN_10Year * 100).toFixed(2))
            : success.data.d.length > 0
              ? Number(parseFloat(success.data.d[0].RTN_10Year * 100).toFixed(2))
              : 0.0
        rtnInception.value =
          success.data.d.length > 1
            ? Number(parseFloat(success.data.d[1].RTN_Inception * 100).toFixed(2))
            : success.data.d.length > 0
              ? Number(parseFloat(success.data.d[0].RTN_Inception * 100).toFixed(2))
              : 0.0
        rtnAsOf.value =
          success.data.d.length > 1
            ? success.data.d[1].RTN_AsOf !== ''
              ? new Date(success.data.d[1].RTN_AsOf).toLocaleDateString()
              : ''
            : success.data.d.length > 0
              ? success.data.d[0].RTN_AsOf !== ''
                ? new Date(success.data.d[0].RTN_AsOf).toLocaleDateString()
                : ''
              : ''
        rtnInceptionDate.value =
          success.data.d.length > 1
            ? success.data.d[1].RTN_InceptionDate !== ''
              ? new Date(success.data.d[1].RTN_InceptionDate).toLocaleDateString()
              : ''
            : success.data.d.length > 0
              ? success.data.d[0].RTN_InceptionDate !== ''
                ? new Date(success.data.d[0].RTN_InceptionDate).toLocaleDateString()
                : ''
              : ''
        rtnDisclosure.value =
          success.data.d.length > 1 ? success.data.d[1].Disclosure : success.data.d.length > 0 ? success.data.d[0].Disclosure : ''
        if (benchmarklist.value.length > 0 && success.data.d.length > 0) {
          if (success.data.d[0].Benchmark !== 0 && success.data.d[0].Benchmark !== -1) {
            benchmark.value = benchmarklist.value.find((obj) => {
              return obj.BenchmarkID === success.data.d[0].Benchmark
            })
          } else {
            benchmark.value = ''
          }
        } else {
          benchmark.value = ''
        }
        override.value =
          success.data.d.length > 0
            ? success.data.d[0].Benchmark !== 0 && success.data.d[0].Benchmark !== -1
              ? true
              : false
            : false
        showBenchmark.value =
          success.data.d.length > 0
            ? success.data.d[0].Benchmark !== 0 && success.data.d[0].Benchmark !== -1
              ? true
              : false
            : false
      })
    }
    const showPlanList = (modelId) => {
      $axios.get(`/api/v1/tal/model/${modelId}/plans`).then((success) => {
        planList.value = success.data.d.length > 0 ? success.data.d : []
      })
    }
    const overrideChange = () => {
      showBenchmark.value = override.value === true ? true : false
      addManualBenchmark.value = false
    }
    const addBenchmark = () => {
      resetBenchmark()
      addManualBenchmark.value = true
      showBenchmark.value = false
      benchmarkNameField.value.focus()
    }
    const closeBenchmark = () => {
      resetBenchmark()
      addManualBenchmark.value = false
      showBenchmark.value = true
      getBenchmark()
    }
    const resetBenchmark = () => {
      benchmarkName.value = ''
      benchmarkDescription.value = ''
      benchmarkIndex.value = ''
      benchmarkIndexList.value = []
      benchmarkIndexError.value = false
      benchmarkIndexMsg.value = ''
      benchmarkPercentage.value = ''
      percentageError.value = false
      percentageMsg.value = ''
      benchmarkbuilderId.value = 0
      benchmarkNameError.value = false
      benchmarkNameMsg.value = ''
      benchmarkBuilders.value = []
    }
    const resetIndex = () => {
      benchmarkPercentage.value = ''
      percentageError.value = false
      percentageMsg.value = ''
      benchmarkIndex.value = ''
      benchmarkIndexList.value = []
      benchmarkIndexError.value = false
      benchmarkIndexMsg.value = ''
    }
    const checkPercent = () => {
      if (benchmarkPercentage.value !== undefined) {
        benchmarkPercentage.value = Number(benchmarkPercentage.value.replace(/[^0-9/\\.]/g, ''))
        if (isNaN(benchmarkPercentage.value)) benchmarkPercentage.value = 0
        if (benchmarkPercentage.value === '') {
          percentageError.value = true
          percentageMsg.value = 'Percentage is required'
          return
        }
        if (benchmarkPercentage.value === '.') {
          percentageError.value = true
          percentageMsg.value = 'Enter valid Percentage'
          return
        }
        if (Number(benchmarkPercentage.value) <= 0 && benchmarkIndex.value !== '') {
          percentageError.value = true
          percentageMsg.value = 'Percentage should be greater than zero'
          return
        }
        if (Number(benchmarkPercentage.value) > 100) {
          percentageError.value = true
          percentageMsg.value = 'Percentage cannot be greater than 100 %'
          return
        } else {
          percentageError.value = false
          percentageMsg.value = ''
        }
      }
    }
    const getIndexNameList = () => {
      if (event.target.value !== '') {
        benchmarkIndexList.value = []
        $axios.get(`/api/v1/tal/benchmark/autocomplete?criteria=${event.target.value}`).then((success) => {
          benchmarkIndexList.value = success.data.d
        })
      }
    }
    const checkItemPercent = (itemData) => {
      if (isNaN(Number(itemData.Amount.replace(/[^0-9/\\.]/g, '')))) itemData.Amount = 0
      modelFundMsg.value = ''
      snackBar.value = false
      if (Number(itemData.Amount.replace(/[^0-9/\\.]/g, '')) <= 0) {
        $toast?.destroy()
        $toast.error('Allocation should be greater then zero', '')
        return
      }
      if (Number(itemData.Amount.replace(/[^0-9/\\.]/g, '')) > 100) {
        $toast?.destroy()
        $toast.error('Allocation cannot be greater then 100 %', '')
        return
      }
      var sumAmount = 0
      for (var i = 0; i < benchmarkBuilders.value.length; i++) {
        sumAmount += !(benchmarkBuilders.value[i].Amount === -999)
          ? Number(parseFloat(benchmarkBuilders.value[i].Amount).toFixed(2))
          : Number(0)
      }
      totalAllocation.value = Number(sumAmount) > 0 ? parseFloat(Number(sumAmount)).toFixed(2) : 0.0

      return itemData
    }
    const saveIndex = () => {
      if (benchmarkIndex.value === '') {
        benchmarkIndexError.value = true
        benchmarkIndexMsg.value = 'Index Name is required'
        return
      }
      if (benchmarkPercentage.value <= 0) {
        percentageError.value = true
        percentageMsg.value = 'Value should be greater than zero'
        return
      }
      if (benchmarkPercentage.value > 100) {
        percentageError.value = true
        percentageMsg.value = 'Value cannot be greater than 100 %'
        return
      }
      if (Number(totalAllocation.value) > 100) {
        $toast?.destroy()
        $toast.error('Total Allocation exceeded 100 %', '')
        return
      }
      var percentage = 0
      if (Number(benchmarkPercentage.value) >= 1) percentage = Number(benchmarkPercentage.value) / 100

      var holdings = {
        Type: 'Open',
        Ticker: benchmarkIndex.value.ticker,
        Name: benchmarkIndex.value.name,
        Amount: percentage,
        Taxable: false,
        Fundno: 0,
        Id: 0
      }
      if (benchmarkbuilderId.value === 0) {
        var benchmark = {
          Name: 'INIT',
          FsgId: '',
          BenchmarkId: benchmarkbuilderId.value
        }
        $axios.put(`/api/v1/tal/benchmark`, benchmark).then((success) => {
          if (success.data.d !== null) {
            benchmarkbuilderId.value = success.data.d
            $axios.post(`/api/v1/tal/benchmark/${benchmarkbuilderId.value}/holdings`, holdings).then((success) => {
              if (success.data.d !== null) {
                getBenchmarkBuilder()
                resetIndex()
              }
            })
          }
        })
      } else {
        $axios.post(`/api/v1/tal/benchmark/${benchmarkbuilderId.value}/holdings`, holdings).then((success) => {
          if (success.data.d !== null) {
            getBenchmarkBuilder()
            resetIndex()
          }
        })
      }
    }
    const deleteBenchmarkBuilder = (benchmarkObject) => {
      benchmarkBuilders.value.splice(benchmarkBuilders.value.indexOf(benchmarkObject.ID), 1)
      if (benchmarkObject.ID > 0) {
        $axios.delete(`/api/v1/tal/benchmark/benchmarkholding/${benchmarkObject.ID}`).then(() => {
          getBenchmarkBuilder()
        })
      }
    }
    const formatDate = (date) => {
      if (!date) return null
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }
    const getBenchmarkBuilder = () => {
      var sumAmount = 0
      $axios.get(`/api/v1/tal/benchmark/${benchmarkbuilderId.value}/holdings`).then((success) => {
        if (success.data.d !== null) {
          benchmarkBuilders.value = success.data.d.length > 0 ? success.data.d : []
          for (var i = 0; i < benchmarkBuilders.value.length; i++) {
            benchmarkBuilders.value[i].Amount = parseFloat(Number(benchmarkBuilders.value[i].Amount) * 100).toFixed(2)
            benchmarkBuilders.value[i].edit = true
            sumAmount += !(benchmarkBuilders.value[i].Amount === -999)
              ? Number(parseFloat(benchmarkBuilders.value[i].Amount).toFixed(2))
              : Number(0)
          }
          totalAllocation.value = Number(sumAmount) > 0 ? parseFloat(Number(sumAmount)).toFixed(2) : 0.0
        }
      })
    }
    const editIndex = (benchmarkObject) => {
      if (benchmarkObject !== null) {
        benchmarkObject.edit = false
        disableBenchmark.value = true
        var index = benchmarkBuilders.value.findIndex((item) => item.ID === benchmarkObject.ID)
        if (index > -1) {
          benchmarkBuilders.value.splice(index, 1, benchmarkObject)
        }
      }
    }
    const updateIndex = (benchmarkObject) => {
      if (benchmarkObject !== null) {
        if (benchmarkObject.Amount === '') {
          $toast?.destroy()
          $toast.error('Value is required', '')
          return
        }
        if (Number(benchmarkObject.Amount) <= 0) {
          $toast?.destroy()
          $toast.error('Value should be greater than zero', '')
          return
        }
        if (Number(benchmarkObject.Amount) > 100) {
          $toast?.destroy()
          $toast.error('Value cannot be greater than 100 %', '')
          return
        }
        if (Number(totalAllocation.value) > 100) {
          $toast?.destroy()
          $toast.error('Total Allocation exceeded 100 %', '')
          return
        }
        var percentage = 0
        if (Number(benchmarkObject.Amount) >= 1) percentage = Number(benchmarkObject.Amount) / 100

        var holdings = {
          Type: 'Open',
          Ticker: benchmarkObject.Ticker,
          Name: benchmarkObject.Name,
          Amount: percentage,
          Id: benchmarkObject.ID
        }
        if (benchmarkObject.ID !== null) {
          $axios.post(`/api/v1/tal/benchmark/${benchmarkObject.ID}/holdings`, holdings)
          benchmarkObject.edit = true
          disableBenchmark.value = false
          var index = benchmarkBuilders.value.findIndex((item) => item.ID === benchmarkObject.ID)
          if (index > -1) {
            benchmarkBuilders.value.splice(index, 1, benchmarkObject)
          }
        }
      }
    }
    const saveBenchmark = () => {
      if (benchmarkName.value === '') {
        benchmarkNameError.value = true
        benchmarkNameMsg.value = 'Name is required'
        document.getElementById('modelContainer').scrollTop = document.getElementById('benchmarkDiv').offsetTop
        return
      }
      if (Number(totalAllocation.value) > 100) {
        $toast?.destroy()
        $toast.error('Total Allocation exceeded 100 %', '')
        document.getElementById('modelContainer').scrollTop = document.getElementById('benchmarkDiv').offsetTop
        return
      }
      if (Number(totalAllocation.value) < 100) {
        $toast?.destroy()
        $toast.error('Total Allocation should be 100 %', '')
        document.getElementById('modelContainer').scrollTop = document.getElementById('benchmarkDiv').offsetTop
        return
      }
      if (disableBenchmark.value === true) {
        $toast?.destroy()
        $toast.error('Save the Index Detail first', '')
        document.getElementById('modelContainer').scrollTop = document.getElementById('benchmarkDiv').offsetTop
        return
      }
      var benchmark = {
        Name: benchmarkName.value,
        Description: benchmarkDescription.value,
        FsgId: '',
        BenchmarkId: benchmarkbuilderId.value
      }
      $axios.put(`/api/v1/tal/benchmark`, benchmark).then((success) => {
        benchmarkbuilderId.value = success.data.d
        getBenchmark()
        closeBenchmark()
      })
    }
    const copyBenchmark = (benchmarkObject) => {
      $axios
        .post(`/api/v1/tal/benchmark/${benchmarkObject.BenchmarkID}/copy`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          getBenchmark()
        })
    }
    const deleteBenchmark = (benchmarkObject) => {
      benchmarklist.value.splice(benchmarklist.value.indexOf(benchmarkObject.BenchmarkID), 1)
      $axios
        .delete(`/api/v1/tal/benchmark/${benchmarkObject.BenchmarkID}`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          getBenchmark()
        })
    }
    const editBenchmark = (benchmarkObject) => {
      if (benchmarkObject !== null && benchmarkObject.BenchmarkID != null) {
        resetBenchmark()
        $axios.get(`/api/v1/tal/model/${benchmarkObject.BenchmarkID}`).then((success) => {
          if (success.data.d !== null) {
            benchmarkName.value = benchmarkObject.Name
            benchmarkbuilderId.value = benchmarkObject.BenchmarkID
            benchmarkDescription.value = benchmarkObject.Description
            getBenchmarkBuilder()
            addManualBenchmark.value = true
            showBenchmark.value = false
          }
        })
      }
    }
    const validateBenchmarkName = () => {
      if (benchmarkName.value === '') {
        benchmarkNameError.value = true
        benchmarkNameMsg.value = 'Name is required'
      } else {
        benchmarkNameError.value = false
        benchmarkNameMsg.value = ''
      }
    }
    watch(
      () => modelName.value,
      () => {
        if (modelDialog.value && modelName.value === '') {
          modelfunderror.value = true
          modelMessage.value = 'Model name required'
        } else {
          modelfunderror.value = false
          modelMessage.value = ''
        }
      }
    )
    watch(
      () => benchmarkName.value,
      () => {
        if (benchmarkName.value === '') {
          benchmarkNameError.value = true
          benchmarkNameMsg.value = 'Name is required'
        } else {
          benchmarkNameError.value = false
          benchmarkNameMsg.value = ''
        }
      }
    )
    watch(
      () => dateAsOf.value,
      () => {
        if (!isAsOfDate.value) {
          rtnAsOf.value = formatDate(dateAsOf.value)
        }
        isAsOfDate.value = false
      },
      { immediate: true, deep: true }
    )
    watch(
      () => dateInception.value,
      () => {
        if (!isInceptionDate.value) {
          rtnInceptionDate.value = formatDate(dateInception.value)
        }
        isInceptionDate.value = false
      },
      { immediate: true, deep: true }
    )
    watch(
      () => menu2.value,
      (val) => {
        if (!val) {
          checkDate(rtnInceptionDate.value)
        }
      }
    )
    watch(
      () => menu1.value,
      (val) => {
        if (!val) {
          checkasofDate(rtnAsOf.value)
        }
      }
    )
    watch(
      () => rtn1Month.value,
      (value) => {
        if (value === '') {
          rtn1MonthError.value = true
          rtn1MonthMsg.value = 'Value is required'
          return
        }
        if (value === '.') {
          rtn1MonthError.value = true
          rtn1MonthMsg.value = 'Enter valid number'
          return
        }
        if (Number(value) <= 0) {
          rtn1MonthError.value = true
          rtn1MonthMsg.value = 'Value should be greater than zero'
        } else {
          rtn1MonthError.value = false
          rtn1MonthMsg.value = ''
        }
      }
    )
    watch(
      () => rtn3Month.value,
      (value) => {
        if (value === '') {
          rtn3MonthError.value = true
          rtn3MonthMsg.value = 'Value is required'
          return
        }
        if (value === '.') {
          rtn3MonthError.value = true
          rtn3MonthMsg.value = 'Enter valid number'
          return
        }
        if (Number(value) <= 0) {
          rtn3MonthError.value = true
          rtn3MonthMsg.value = 'Value should be greater than zero'
        } else {
          rtn3MonthError.value = false
          rtn3MonthMsg.value = ''
        }
      }
    )
    watch(
      () => rtn1Year.value,
      (value) => {
        if (value === '') {
          rtn1YearError.value = true
          rtn1YearMsg.value = 'Value is required'
          return
        }
        if (value === '.') {
          rtn1YearError.value = true
          rtn1YearMsg.value = 'Enter valid number'
          return
        }
        if (Number(value) <= 0) {
          rtn1YearError.value = true
          rtn1YearMsg.value = 'Value should be greater than zero'
        } else {
          rtn1YearError.value = false
          rtn1YearMsg.value = ''
        }
      }
    )
    watch(
      () => rtn3Year.value,
      (value) => {
        if (value === '') {
          rtn3YearError.value = true
          rtn3YearMsg.value = 'Value is required'
          return
        }
        if (value === '.') {
          rtn3YearError.value = true
          rtn3YearMsg.value = 'Enter valid number'
          return
        }
        if (Number(value) <= 0) {
          rtn3YearError.value = true
          rtn3YearMsg.value = 'Value should be greater than zero'
        } else {
          rtn3YearError.value = false
          rtn3YearMsg.value = ''
        }
      }
    )
    watch(
      () => rtn5Year.value,
      (value) => {
        if (value === '') {
          rtn5YearError.value = true
          rtn5YearMsg.value = 'Value is required'
          return
        }
        if (value === '.') {
          rtn5YearError.value = true
          rtn5YearMsg.value = 'Enter valid number'
          return
        }
        if (Number(value) <= 0) {
          rtn5YearError.value = true
          rtn5YearMsg.value = 'Value should be greater than zero'
        } else {
          rtn5YearError.value = false
          rtn5YearMsg.value = ''
        }
      }
    )
    watch(
      () => rtn10Year.value,
      (value) => {
        if (value === '') {
          rtn10YearError.value = true
          rtn10YearMsg.value = 'Value is required'
          return
        }
        if (value === '.') {
          rtn10YearError.value = true
          rtn10YearMsg.value = 'Enter valid number'
          return
        }
        if (Number(value) <= 0) {
          rtn10YearError.value = true
          rtn10YearMsg.value = 'Value should be greater than zero'
        } else {
          rtn10YearError.value = false
          rtn10YearMsg.value = ''
        }
      }
    )
    watch(
      () => rtnInception.value,
      (value) => {
        if (value === '') {
          rtnInceptionError.value = true
          rtnInceptionMsg.value = 'Value is required'
          return
        }
        if (value === '.') {
          rtnInceptionError.value = true
          rtnInceptionMsg.value = 'Enter valid number'
          return
        }
        if (Number(value) <= 0) {
          rtnInceptionError.value = true
          rtnInceptionMsg.value = 'Value should be greater than zero'
        } else {
          rtnInceptionError.value = false
          rtnInceptionMsg.value = ''
        }
      }
    )
    onMounted(() => {
      if (props.CreateNewModel) modelDialog.value = true
      getReliusProfession()
      getPlanModels()
      getBenchmark()
    })
    return {
      theme,
      $authz,
      display,
      modelDialog,
      validModelBuilder,
      modelID,
      modelName,
      modelfunderror,
      modelMessage,
      modelDescription,
      planProposalID,
      planList,
      planHeader,
      summary,
      rtn1Month,
      disableText,
      rtn3Month,
      rtn1Year,
      rtn3Year,
      rtn5Year,
      rtn10Year,
      rtnInception,
      menu1,
      rtnAsOf,
      checkasofDateErrorMsg,
      checkasofDateError,
      dateAsOf,
      addInvestement,
      menu2,
      benchmarkNameField,
      form,
      rtnInceptionDate,
      checkDateErrorMsg,
      checkDateError,
      dateInception,
      defaultBenchmarkList,
      benchmarkHeader,
      showBenchmark,
      benchmark,
      benchmarklist,
      currentModelHeaderList,
      deletePopUpBenchmark,
      addManualBenchmark,
      validAdd,
      benchmarkName,
      benchmarkNameError,
      benchmarkNameMsg,
      benchmarkDescription,
      benchmarkIndex,
      benchmarkIndexList,
      benchmarkIndexError,
      benchmarkIndexMsg,
      benchmarkPercentage,
      percentageError,
      percentageMsg,
      benchmarkBuilders,
      benchmarkBuilderHeader,
      deletePopUp,
      rtnDisclosure,
      currentModelHeaders,
      currentModelList,
      isLoading,
      deletePopUpmodel,
      totalNewMgmt,
      totalNewLoad,
      totalNewSubta,
      totalNewExpratio,
      totalNewAMC,
      totalNewSSF,
      totalNewFees,
      selected,
      valid,
      options,
      advisorContactId,
      override,
      checkDate,
      showModelDialog,
      resetModel,
      parseDate,
      checkasofDate,
      overrideChange,
      addBenchmark,
      copyBenchmark,
      deleteBenchmark,
      editBenchmark,
      validateBenchmarkName,
      getIndexNameList,
      checkPercent,
      saveIndex,
      checkItemPercent,
      editIndex,
      updateIndex,
      deleteBenchmarkBuilder,
      saveBenchmark,
      closeBenchmark,
      saveModelInvestment,
      editModel,
      copyModel,
      deleteModel
    }
  }
}
</script>
<style scoped>
table.v-table tbody tr td.modelname {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
}
.disabled {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.26) !important;
}
.disabledDarkMode {
  cursor: not-allowed;
  color: #919191 !important;
}
</style>
