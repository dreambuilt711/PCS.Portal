<template>
  <v-layout>
    <v-col>
      <v-col v-show="!createFeeDialog">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-col cols="12" xs="12">
            <v-row>
              <v-col cols="12" xs="12" lg="4">
                <v-col cols="12" xs="12">
                  <h3 class="font-weight-medium">Current Fees</h3>
                </v-col>
                <h5>Select current fees to be included in the proposed fees</h5>
                <h5>If you choose to override the Form 5500 fees, the updated values will reflect in the Report</h5>
                <v-card class="elevation-0">
                  <v-col class="pb-1 padding_top_2" :class="display.xs.value ? 'pl-1' : 'pl-3'">
                    <v-col class="pt-2 pb-2">
                      <v-row>
                        <v-col cols="3" xs="3" lg="3" class="font_11 align-self"> Fee Type </v-col>
                        <v-col cols="4" xs="4" lg="4" class="text-right font_11 pr-4 align-self">
                          {{ display.lg.value ? 'Form 5500' : 'Form 5500 Fees' }}
                        </v-col>
                        <v-col cols="4" xs="4" lg="4">
                          <v-checkbox
                            id="overrideCheckbox"
                            v-model="serviceProviderList.chkOverride"
                            hide-details
                            :ripple="false"
                            :label="display.lg.value || display.md.value ? 'Override Form 5500' : 'Override Form 5500 Fees'"
                            class="ma-0 pa-0 overrideCheckbox"
                            color="accent"
                            :density="compact"
                            @update:model-value="calculateTotal('Current')"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-divider />
                    <v-col class="pt-1 pb-2">
                      <v-row class="fixHeight">
                        <v-col cols="3" xs="3" lg="3" class="align-self-flexend mb-2"> Accounting </v-col>
                        <v-col cols="4" xs="4" lg="4" class="align-self-flexend text-right pr-4 mb-2">
                          <span :class="!theme.dark ? 'grey--text text--darken-2' : 'text-white'">{{
                            formatPrice(lblCostsCurrent, 0)
                          }}</span>
                        </v-col>
                        <v-col v-if="serviceProviderList.chkOverride" cols="4" xs="4" lg="4" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtCostsCurrent"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            density="compact"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('Accounting', 'addFee', serviceProviderList.txtCostsCurrent, false)"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row class="fixHeight">
                        <v-col cols="3" xs="3" lg="3" class="align-self-flexend mb-2"> Administration </v-col>
                        <v-col cols="4" xs="4" lg="4" class="align-self-flexend mb-2 text-right pr-4">
                          <span :class="!theme.dark ? 'grey--text text--darken-2' : 'text-white'">{{
                            formatPrice(lblAdminCurrent, 0)
                          }}</span>
                        </v-col>
                        <v-col v-if="serviceProviderList.chkOverride" cols="4" xs="4" lg="4" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtAdminCurrent"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            density="compact"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('Administration', 'addFee', serviceProviderList.txtAdminCurrent, false)"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row class="fixHeight">
                        <v-col cols="4" xs="4" lg="4" class="align-self-flexend mb-2">
                          Investment Advisory
                          <sup>1</sup>
                        </v-col>
                        <v-col cols="3" xs="3" lg="3" class="align-self-flexend mb-2 text-right pr-4">
                          <span :class="!theme.dark ? 'grey--text text--darken-2' : 'text-white'">{{
                            formatPrice(lblAdvisoryCurrent, 0)
                          }}</span>
                        </v-col>
                        <v-col v-if="serviceProviderList.chkOverride" cols="4" xs="4" lg="4" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtAdvisoryCurrent"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            density="compact"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('Investment', 'addFee', serviceProviderList.txtAdvisoryCurrent, false)"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row class="fixHeight">
                        <v-col cols="3" xs="3" lg="3" class="align-self-flexend mb-2">
                          Professional
                          <sup>2</sup>
                        </v-col>
                        <v-col cols="4" xs="4" lg="4" class="align-self-flexend mb-2 text-right pr-4">
                          <span :class="!theme.dark ? 'grey--text text--darken-2' : 'text-white'">{{
                            formatPrice(lblProCurrent, 0)
                          }}</span>
                        </v-col>
                        <v-col v-if="serviceProviderList.chkOverride" cols="4" xs="4" lg="4" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtProCurrent"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            density="compact"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('Professional', 'addFee', serviceProviderList.txtProCurrent, false)"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row class="fixHeight">
                        <v-col cols="3" xs="3" lg="3" class="align-self-flexend mb-2"> Recordkeeping </v-col>
                        <v-col cols="4" xs="4" lg="4" class="align-self-flexend mb-2 text-right pr-4">
                          <span :class="!theme.dark ? 'grey--text text--darken-2' : 'text-white'">{{
                            formatPrice(lblRecordCurrent, 0)
                          }}</span>
                        </v-col>
                        <v-col v-if="serviceProviderList.chkOverride" cols="4" xs="4" lg="4" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtRecordCurrent"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            density="compact"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('Recordkeeping', 'addFee', serviceProviderList.txtRecordCurrent, false)"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row class="fixHeight">
                        <v-col cols="4" xs="4" lg="4" class="align-self-flexend mb-2"> Trustee / Custodian </v-col>
                        <v-col cols="3" xs="3" lg="3" class="align-self-flexend mb-2 text-right pr-4">
                          <span :class="!theme.dark ? 'grey--text text--darken-2' : 'text-white'">{{
                            formatPrice(lblCustodianCurrent, 0)
                          }}</span>
                        </v-col>
                        <v-col v-if="serviceProviderList.chkOverride" cols="4" xs="4" lg="4" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtCustodianCurrent"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            density="compact"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('Trustee', 'addFee', serviceProviderList.txtCustodianCurrent, false)"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row class="fixHeight">
                        <v-col cols="3" xs="3" lg="3" class="align-self-flexend mb-2"> Other </v-col>
                        <v-col cols="4" xs="4" lg="4" class="align-self-flexend mb-2 text-right pr-4">
                          <span :class="!theme.dark ? 'grey--text text--darken-2' : 'text-white'">{{
                            formatPrice(lblOtherCurrent, 0)
                          }}</span>
                        </v-col>
                        <v-col v-if="serviceProviderList.chkOverride" cols="4" xs="4" lg="4" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtOtherCurrent"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            density="compact"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('Other', 'addFee', serviceProviderList.txtOtherCurrent, false)"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                  <v-col :class="theme.dark ? '' : 'grey lighten-2'" class="pt-3 pb-3">
                    <v-row>
                      <v-col cols="3" xs="3" lg="3" class="font_11 font-weight-medium pl-3"> Total </v-col>
                      <v-col cols="4" xs="4" lg="4" class="text-right font_11 pr-2 font-weight-medium">
                        {{ formatPrice(totalCurrentFee ? totalCurrentFee : 0, 0) }}
                      </v-col>
                      <v-col
                        v-if="serviceProviderList.chkOverride"
                        cols="4"
                        xs="4"
                        lg="4"
                        class="font_11 font-weight-medium pl-2"
                      >
                        {{ formatPrice(totalCurrentAdditionalFees ? totalCurrentAdditionalFees : 0, 0) }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="pl-3 pt-1">
                    <v-row>
                      <v-col cols="12" xs="12" class="align-self">
                        <v-row>
                          <v-col cols="11" xs="11" class="flex_none pr-1">
                            <v-switch
                              v-model="serviceProviderList.current_338"
                              label="Emphasize 3(38) service fees as separate line item"
                              class="ma-0"
                              :ripple="false"
                              hide-details
                              color="accent"
                            />
                          </v-col>
                          <v-col cols="1" xs="1">
                            <v-menu :persistent="false" close-on-content-click transition="scroll-y-transition">
                              <template #activator="{ props }">
                                <v-btn size="small" v-bind="props" :icon="true" variant="text" class="ma-0">
                                  <v-icon size="small" :class="!theme.dark ? 'text-accent' : ''"> fa fa-info-circle </v-icon>
                                </v-btn>
                              </template>
                              <v-card max-width="300px">
                                <v-card-actions class="pb-0 pt-1">
                                  <v-spacer />
                                  <v-btn size="small" variant="text" :icon="true">
                                    <v-icon class="text-accent"> close </v-icon>
                                  </v-btn>
                                </v-card-actions>
                                <v-card-text class="pt-0">
                                  Checking this box will move whatever amount you input under ‘Investment Advisory’ and transfer
                                  it to a new line item underneath Service Provider Fees titled ‘Discretionary 3(38) Investment
                                  Manager’.
                                </v-card-text>
                              </v-card>
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="pl-3">
                    <v-row>
                      <div :class="display.xl.value ? 'ml-11' : display.mdAndDown.value ? '' : 'ml-12'" class="mr-2 mt-2">
                        <span class="font-size-14">Revenue Offset</span>
                      </div>
                      <v-checkbox
                        v-model="serviceProviderList.chkCurrent12b1"
                        small
                        label="12b-1"
                        class="ma-0 pr-2"
                        hide-details
                        color="accent"
                      />
                      <v-checkbox
                        v-model="serviceProviderList.chkCurrentSubTA"
                        small
                        label="SubTA"
                        class="ma-0"
                        hide-details
                        color="accent"
                      />
                    </v-row>
                  </v-col>
                </v-card>
              </v-col>
              <v-col cols="12" xs="12" lg="8" :class="display.mdAndDown.value ? 'pt-5' : ''">
                <v-col cols="12" xs="12">
                  <v-row>
                    <v-col cols="6" xl="6" lg="6" md="6" sm="6" xs="6">
                      <h3 :class="display.lgAndUp.value ? 'ml-1 font-weight-medium' : 'ml-1 font-weight-medium'">
                        Proposed Fees
                      </h3>
                      <h5 class="ml-1">Select fee schedules to be included in the proposed fees</h5>
                      <br />
                    </v-col>
                    <v-col
                      v-if="showFeeSchedule"
                      cols="6"
                      xs="6"
                      xl="6"
                      lg="6"
                      md="6"
                      sm="6"
                      class="text-right"
                      :class="display.xs.value ? 'pb-2' : ''"
                    >
                      <v-btn size="small" :color="theme.dark ? '' : 'accent'" class="ma-0" @click="createNewFee()">
                        New Fee Schedule
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-card class="elevation-0">
                  <v-col class="pt-2 pb-1 pl-2" v-if="!display.smAndDown.value">
                    <v-col class="padding-top-5px padding-bottom-11px">
                      <v-row>
                        <v-col cols="4" xs="4" class="font_11 pr-2 align-self">Schedule</v-col>
                        <v-col cols="2" xs="2" class="font_11 pr-n1 align-self">Fee Entry Type</v-col>
                        <v-col cols="2" xs="2" class="font_11 pr-2 pl-2 align-self">Basis Points</v-col>
                        <v-col cols="2" xs="2" class="font_11 pr-2 align-self">Cost ($)</v-col>
                        <v-col cols="2" xs="2" class="font_11 pr-2 align-self">Cost (%)</v-col>
                      </v-row>
                    </v-col>
                    <v-divider />
                    <v-col class="pt-1 pb-2">
                      <v-row>
                        <v-col cols="4" xs="4" class="pr-2">
                          <v-select
                            v-model="serviceProviderList.cboCostsSchedule"
                            hide-details
                            :items="scheduleFees"
                            :return-object="true"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            class="customfontsize"
                            :label="serviceProviderList.cboCostsSchedule ? '' : 'Select Accounting Schedule'"
                            density="compact"
                            append-icon="icon-chevron-down"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="pr-n1" v-if="serviceProviderList.cboCostsSchedule">
                          <v-select
                            v-model="serviceProviderList.txtCostsFeeType"
                            hide-details
                            :items="feeEntryTypeList"
                            clearable
                            class="customfontsize"
                            :label="serviceProviderList.txtCostsFeeType ? '' : 'Select Fee Entry Type'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            item-props.disabled="disabled"
                            :disabled="disableCostFeeType"
                            @update:model-value="enableSelectedFeeType(serviceProviderList.txtCostsFeeType, 'Accounting')"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2 pl-2" v-if="serviceProviderList.txtCostsFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtCostsProposedBasis"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyCostsProposed"
                            density="compact"
                            :disabled="disableCostBasis"
                            @focus="$event.target.select()"
                            @change="
                              assignFeeValue('ProposedAccounting', 'basis', serviceProviderList.txtCostsProposedBasis, false)
                            "
                          />
                        </v-col>
                        <v-col v-if="serviceProviderList.txtCostsFeeType" cols="2" xs="2" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtCostsProposed"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyCostsProposed"
                            density="compact"
                            :disabled="disableCostDollar"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('ProposedAccounting', 'dollar', serviceProviderList.txtCostsProposed, false)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2" v-if="serviceProviderList.txtCostsFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtCostsProposedPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            suffix="%"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyCostsProposed"
                            density="compact"
                            :disabled="disableCostPercent"
                            @focus="$event.target.select()"
                            @change="
                              assignFeeValue('ProposedAccounting', 'percent', serviceProviderList.txtCostsProposedPercent, false)
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row>
                        <v-col cols="4" xs="4" class="pr-2">
                          <v-select
                            v-model="serviceProviderList.cboAdminSchedule"
                            hide-details
                            class="customfontsize"
                            :return-object="true"
                            clearable
                            item-title="Name"
                            item-value="FeeScheduleID"
                            :items="adminScheduleList"
                            :label="serviceProviderList.cboAdminSchedule ? '' : 'Select Administration Schedule'"
                            density="compact"
                            append-icon="icon-chevron-down"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="pr-n1" v-if="serviceProviderList.cboAdminSchedule">
                          <v-select
                            v-model="serviceProviderList.txtAdminFeeType"
                            hide-details
                            class="customfontsize"
                            clearable
                            :items="feeEntryTypeList"
                            :label="serviceProviderList.txtAdminFeeType ? '' : 'Select Fee Entry Type'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            item-props.disabled="disabled"
                            :disabled="disableAdminFeeType"
                            @update:model-value="enableSelectedFeeType(serviceProviderList.txtAdminFeeType, 'Administration')"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2 pl-2" v-if="serviceProviderList.txtAdminFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtAdminProposedBasis"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyAdminProposed"
                            density="compact"
                            :disabled="disableAdminProposedBasis"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('ProposedAdmin', 'basis', serviceProviderList.txtAdminProposedBasis, false)"
                          />
                        </v-col>
                        <v-col v-if="serviceProviderList.txtAdminFeeType" cols="2" xs="2" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtAdminProposed"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyAdminProposed"
                            density="compact"
                            :disabled="disableAdminProposed"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2" v-if="serviceProviderList.txtAdminFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtAdminProposedPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            suffix="%"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyAdminProposed"
                            density="compact"
                            :disabled="disableAdminProposedPercent"
                            @change="
                              assignFeeValue('ProposedAdmin', 'percent', serviceProviderList.txtAdminProposedPercent, false)
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row>
                        <v-col cols="4" xs="4" class="pr-2">
                          <v-select
                            v-model="serviceProviderList.cboAdvisorySchedule"
                            hide-details
                            :items="investmentProposedFees"
                            :return-object="true"
                            clearable
                            item-title="Name"
                            item-value="FeeScheduleID"
                            class="customfontsize"
                            :label="serviceProviderList.cboAdvisorySchedule ? '' : 'Select Investment Advisory Schedule'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            :disabled="
                              $authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                            "
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="pr-n1" v-if="serviceProviderList.cboAdvisorySchedule">
                          <v-select
                            v-model="serviceProviderList.txtAdvisoryFeeType"
                            hide-details
                            :items="feeEntryTypeList"
                            clearable
                            class="customfontsize"
                            :label="serviceProviderList.txtAdvisoryFeeType ? '' : 'Select Fee Entry Type'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            item-props.disabled="disabled"
                            :disabled="disableAdvisoryFeeType"
                            @update:model-value="enableSelectedFeeType(serviceProviderList.txtAdvisoryFeeType, 'Advisory')"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2 pl-2" v-if="serviceProviderList.txtAdvisoryFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtAdvisoryProposedBasis"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyAdvisoryProposed"
                            density="compact"
                            :disabled="disableAdvisoryProposedBasis"
                            @focus="$event.target.select()"
                            @change="
                              assignFeeValue('ProposedAdvisory', 'basis', serviceProviderList.txtAdvisoryProposedBasis, false)
                            "
                          />
                        </v-col>
                        <v-col v-if="serviceProviderList.txtAdvisoryFeeType" cols="2" xs="2" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtAdvisoryProposed"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyAdvisoryProposed"
                            density="compact"
                            :disabled="disableAdvisoryProposed"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2" v-if="serviceProviderList.txtAdvisoryFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtAdvisoryProposedPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            suffix="%"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyAdvisoryProposed"
                            density="compact"
                            :disabled="disableAdvisoryProposedPercent"
                            @change="
                              assignFeeValue('ProposedAdvisory', 'percent', serviceProviderList.txtAdvisoryProposedPercent, false)
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row>
                        <v-col cols="4" xs="4" class="pr-2">
                          <v-select
                            v-model="serviceProviderList.cboProSchedule"
                            hide-details
                            :items="advisoryProposedFees"
                            :return-object="true"
                            clearable
                            item-title="Name"
                            item-value="FeeScheduleID"
                            class="customfontsize"
                            :label="serviceProviderList.cboProSchedule ? '' : 'Select Professional Schedule'"
                            density="compact"
                            append-icon="icon-chevron-down"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="pr-n1" v-if="serviceProviderList.cboProSchedule">
                          <v-select
                            v-model="serviceProviderList.txtProFeeType"
                            hide-details
                            :items="feeEntryTypeList"
                            clearable
                            class="customfontsize"
                            :label="serviceProviderList.txtProFeeType ? '' : 'Select Fee Entry Type'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            item-props.disabled="disabled"
                            :disabled="disableProFeeType"
                            @update:model-value="enableSelectedFeeType(serviceProviderList.txtProFeeType, 'Professional')"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2 pl-2" v-if="serviceProviderList.txtProFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtProProposedBasis"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyProProposed"
                            density="compact"
                            :disabled="disableProProposedBasis"
                            @change="
                              assignFeeValue('ProposedProfessional', 'basis', serviceProviderList.txtProProposedBasis, false)
                            "
                          />
                        </v-col>
                        <v-col v-if="serviceProviderList.txtProFeeType" cols="2" xs="2" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtProProposed"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyProProposed"
                            density="compact"
                            :disabled="disableProProposed"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2" v-if="serviceProviderList.txtProFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtProProposedPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            suffix="%"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyProProposed"
                            density="compact"
                            :disabled="disableProProposedPercent"
                            @change="
                              assignFeeValue('ProposedProfessional', 'percent', serviceProviderList.txtProProposedPercent, false)
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row>
                        <v-col cols="4" xs="4" class="pr-2">
                          <v-select
                            v-model="serviceProviderList.cboRecordSchedule"
                            hide-details
                            class="customfontsize"
                            :items="recordScheduleList"
                            :return-object="true"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            :label="serviceProviderList.cboRecordSchedule ? '' : 'Select Recordkeeping Schedule'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            :disabled="
                              $authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                            "
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="pr-n1" v-if="serviceProviderList.cboRecordSchedule">
                          <v-select
                            v-model="serviceProviderList.txtRecordFeeType"
                            hide-details
                            class="customfontsize"
                            :items="feeEntryTypeList"
                            clearable
                            :label="serviceProviderList.txtRecordFeeType ? '' : 'Select Fee Entry Type'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            item-props.disabled="disabled"
                            :disabled="disableRecordFeeType"
                            @update:model-value="enableSelectedFeeType(serviceProviderList.txtRecordFeeType, 'Recordkeeping')"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2 pl-2" v-if="serviceProviderList.txtRecordFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtRecordProposedBasis"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            class="font_size_13"
                            hide-details
                            readonly
                            density="compact"
                            :disabled="disableRecordProposedBasis"
                          />
                        </v-col>
                        <v-col v-if="serviceProviderList.txtRecordFeeType" cols="2" xs="2" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtRecordProposed"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            readonly
                            density="compact"
                            :disabled="disableRecordProposed"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2" v-if="serviceProviderList.txtRecordFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtRecordProposedPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            suffix="%"
                            class="font_size_13"
                            hide-details
                            readonly
                            density="compact"
                            :disabled="disableRecordProposedPercent"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row>
                        <v-col cols="4" xs="4" class="pr-2">
                          <v-select
                            v-model="serviceProviderList.cboCustodianSchedule"
                            hide-details
                            class="customfontsize"
                            :items="custodianScheduleList"
                            :return-object="true"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            :label="serviceProviderList.cboCustodianSchedule ? '' : 'Select Trustee / Custodian Schedule'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            :disabled="
                              $authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                            "
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="pr-n1" v-if="serviceProviderList.cboCustodianSchedule">
                          <v-select
                            v-model="serviceProviderList.txtCustodianFeeType"
                            hide-details
                            class="customfontsize"
                            :items="feeEntryTypeList"
                            clearable
                            :label="serviceProviderList.txtCustodianFeeType ? '' : 'Select Fee Entry Type'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            item-props.disabled="disabled"
                            :disabled="disableCustodianFeeType"
                            @update:model-value="enableSelectedFeeType(serviceProviderList.txtCustodianFeeType, 'Custodian')"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2 pl-2" v-if="serviceProviderList.txtCustodianFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtCustodianProposedBasis"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            class="font_size_13"
                            hide-details
                            readonly
                            density="compact"
                            :disabled="disableCustodianProposedBasis"
                          />
                        </v-col>
                        <v-col v-if="serviceProviderList.txtCustodianFeeType" cols="2" xs="2" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtCustodianProposed"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            readonly
                            density="compact"
                            :disabled="disableCustodianProposed"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2" v-if="serviceProviderList.txtCustodianFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtCustodianProposedPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            suffix="%"
                            class="font_size_13"
                            hide-details
                            readonly
                            density="compact"
                            :disabled="disableCustodianProposedPercent"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pb-2">
                      <v-row>
                        <v-col cols="4" xs="4" class="pr-2">
                          <v-select
                            v-model="serviceProviderList.cboOtherSchedule"
                            hide-details
                            class="customfontsize"
                            :items="otherProposedFees"
                            :return-object="true"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            :label="serviceProviderList.cboOtherSchedule ? '' : 'Select Other Schedule'"
                            density="compact"
                            append-icon="icon-chevron-down"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="pr-n1" v-if="serviceProviderList.cboOtherSchedule">
                          <v-select
                            v-model="serviceProviderList.txtOtherFeeType"
                            hide-details
                            class="customfontsize"
                            :items="feeEntryTypeList"
                            clearable
                            :label="serviceProviderList.txtOtherFeeType ? '' : 'Select Fee Entry Type'"
                            density="compact"
                            append-icon="icon-chevron-down"
                            item-props.disabled="disabled"
                            :disabled="disableOtherFeeType"
                            @update:model-value="enableSelectedFeeType(serviceProviderList.txtOtherFeeType, 'Other')"
                          ></v-select>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2 pl-2" v-if="serviceProviderList.txtOtherFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtOtherProposedBasis"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyOtherProposed"
                            density="compact"
                            :disabled="disableOtherProposedBasis"
                            @change="assignFeeValue('ProposedOther', 'basis', serviceProviderList.txtOtherProposedBasis, false)"
                          />
                        </v-col>
                        <v-col v-if="serviceProviderList.txtOtherFeeType" cols="2" xs="2" class="paddingAlignment pr-2">
                          <v-text-field
                            v-model="serviceProviderList.txtOtherProposed"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            prefix="$"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyOtherProposed"
                            density="compact"
                            :disabled="disableOtherProposed"
                            @focus="$event.target.select()"
                            @change="assignFeeValue('ProposedOther', 'dollar', serviceProviderList.txtOtherProposed, false)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" xs="2" class="paddingAlignment pr-2" v-if="serviceProviderList.txtOtherFeeType">
                          <v-text-field
                            v-model="serviceProviderList.txtOtherProposedPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            suffix="%"
                            class="font_size_13"
                            hide-details
                            :readonly="readonlyOtherProposed"
                            density="compact"
                            :disabled="disableOtherProposedPercent"
                            @change="
                              assignFeeValue('ProposedOther', 'percent', serviceProviderList.txtOtherProposedPercent, false)
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                  <v-card flat :class="theme.dark ? '' : 'expandable'" v-if="display.smAndDown.value">
                    <v-card-text class="pl-0 pr-0 pt-1">
                      <v-col>
                        <v-col cols="12" xs="12" class="pl-2 pr-2 pb-2">
                          <v-row>
                            <v-col cols="12" xs="12" sm="6" class="mb-2">
                              <h5 class="pt-1">
                                <span class="text-grey">Fee Type</span>
                              </h5>
                              <h4>Accounting</h4>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" sm="6" class="mb-2">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.cboCostsSchedule"
                                        hide-details
                                        :items="scheduleFees"
                                        :return-object="true"
                                        item-title="Name"
                                        item-value="FeeScheduleID"
                                        @update:model-value="getCostSchedule(serviceProviderList.cboCostsSchedule, false)"
                                        clearable
                                        class="customfontsize"
                                        :label="serviceProviderList.cboCostsSchedule ? '' : 'Select Accounting Schedule'"
                                        append-icon="icon-chevron-down"
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" sm="6" class="mb-2" v-if="serviceProviderList.cboCostsSchedule">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.txtCostsFeeType"
                                        hide-details
                                        :items="feeEntryTypeList"
                                        clearable
                                        class="customfontsize"
                                        :label="serviceProviderList.txtCostsFeeType ? '' : 'Select Fee Entry Type'"
                                        append-icon="icon-chevron-down"
                                        item-props.disabled="disabled"
                                        :disabled="disableCostFeeType"
                                        @update:model-value="
                                          enableSelectedFeeType(serviceProviderList.txtCostsFeeType, 'Accounting')
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtCostsFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtCostsProposedBasis"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyCostsProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAccounting',
                                            'basis',
                                            serviceProviderList.txtCostsProposedBasis,
                                            false
                                          )
                                        "
                                        density="compact"
                                        :disabled="disableCostBasis"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtCostsFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtCostsProposed"
                                        prefix="$"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyCostsProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAccounting',
                                            'dollar',
                                            serviceProviderList.txtCostsProposed,
                                            false
                                          )
                                        "
                                        density="compact"
                                        :disabled="disableCostDollar"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtCostsFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtCostsProposedPercent"
                                        suffix="%"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyCostsProposed"
                                        v-input-mask="{
                                          alias: 'numeric',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAccounting',
                                            'percent',
                                            serviceProviderList.txtCostsProposedPercent,
                                            false
                                          )
                                        "
                                        density="compact"
                                        :disabled="disableCostPercent"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-divider class="bold my-2"></v-divider>
                        <v-col cols="12" xs="12" class="pl-2 pr-2 pb-2">
                          <v-row>
                            <v-col cols="12" xs="12" sm="6" class="mb-2">
                              <h5 class="pt-1">
                                <span class="text-grey">Fee Type</span>
                              </h5>
                              <h4>Administration</h4>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" sm="6" class="mb-2">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.cboAdminSchedule"
                                        hide-details
                                        class="customfontsize"
                                        :return-object="true"
                                        clearable
                                        item-title="Name"
                                        item-value="FeeScheduleID"
                                        @update:model-value="getAdminSchedule(serviceProviderList.cboAdminSchedule, false)"
                                        :items="adminScheduleList"
                                        :label="serviceProviderList.cboAdminSchedule ? '' : 'Select Administration Schedule'"
                                        append-icon="icon-chevron-down"
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" sm="6" class="mb-2" v-if="serviceProviderList.cboAdminSchedule">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.txtAdminFeeType"
                                        hide-details
                                        class="customfontsize"
                                        clearable
                                        :items="feeEntryTypeList"
                                        :label="serviceProviderList.txtAdminFeeType ? '' : 'Select Fee Entry Type'"
                                        append-icon="icon-chevron-down"
                                        item-props.disabled="disabled"
                                        :disabled="disableAdminFeeType"
                                        @update:model-value="
                                          enableSelectedFeeType(serviceProviderList.txtAdminFeeType, 'Administration')
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtAdminFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtAdminProposedBasis"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyAdminProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAdmin',
                                            'basis',
                                            serviceProviderList.txtAdminProposedBasis,
                                            false
                                          )
                                        "
                                        density="compact"
                                        :disabled="disableAdminProposedBasis"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtAdminFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtAdminProposed"
                                        prefix="$"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyAdminProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        density="compact"
                                        @change="
                                          assignFeeValue('ProposedAdmin', 'dollar', serviceProviderList.txtAdminProposed, false)
                                        "
                                        :disabled="disableAdminProposed"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtAdminFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtAdminProposedPercent"
                                        suffix="%"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyAdminProposed"
                                        v-input-mask="{
                                          alias: 'numeric',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAdmin',
                                            'percent',
                                            serviceProviderList.txtAdminProposedPercent,
                                            false
                                          )
                                        "
                                        :disabled="disableAdminProposedPercent"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-divider class="bold my-2"></v-divider>
                        <v-col cols="12" xs="12" class="pl-2 pr-2 pb-2">
                          <v-row>
                            <v-col cols="12" xs="12" sm="6" class="mb-2">
                              <h5 class="pt-1">
                                <span class="text-grey">Fee Type</span>
                              </h5>
                              <h4>Investment Advisory<sup>1</sup></h4>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" sm="6" class="mb-2">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.cboAdvisorySchedule"
                                        hide-details
                                        :items="investmentProposedFees"
                                        :return-object="true"
                                        clearable
                                        item-title="Name"
                                        item-value="FeeScheduleID"
                                        @update:model-value="getAdvisorySchedule(serviceProviderList.cboAdvisorySchedule, false)"
                                        class="customfontsize"
                                        :label="
                                          serviceProviderList.cboAdvisorySchedule ? '' : 'Select Investment Advisory Schedule'
                                        "
                                        append-icon="icon-chevron-down"
                                        :disabled="
                                          $authz.allowedByProgram(
                                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                                            $authz.pcsAspireProduct.Multi_Strategist_Product
                                          )
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" sm="6" class="mb-2" v-if="serviceProviderList.cboAdvisorySchedule">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.txtAdvisoryFeeType"
                                        hide-details
                                        :items="feeEntryTypeList"
                                        clearable
                                        class="customfontsize"
                                        :label="serviceProviderList.txtAdvisoryFeeType ? '' : 'Select Fee Entry Type'"
                                        append-icon="icon-chevron-down"
                                        item-props.disabled="disabled"
                                        :disabled="disableAdvisoryFeeType"
                                        @update:model-value="
                                          enableSelectedFeeType(serviceProviderList.txtAdvisoryFeeType, 'Advisory')
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtAdvisoryFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtAdvisoryProposedBasis"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyAdvisoryProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAdvisory',
                                            'basis',
                                            serviceProviderList.txtAdvisoryProposedBasis,
                                            false
                                          )
                                        "
                                        :disabled="disableAdvisoryProposedBasis"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtAdvisoryFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtAdvisoryProposed"
                                        prefix="$"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyAdvisoryProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAdvisory',
                                            'dollar',
                                            serviceProviderList.txtAdvisoryProposed,
                                            false
                                          )
                                        "
                                        :disabled="disableAdvisoryProposed"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtAdvisoryFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtAdvisoryProposedPercent"
                                        suffix="%"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyAdvisoryProposed"
                                        v-input-mask="{
                                          alias: 'numeric',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedAdvisory',
                                            'percent',
                                            serviceProviderList.txtAdvisoryProposedPercent,
                                            false
                                          )
                                        "
                                        :disabled="disableAdvisoryProposedPercent"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-divider class="bold my-2"></v-divider>
                        <v-col cols="12" xs="12" class="pl-2 pr-2 pb-2">
                          <v-row>
                            <v-col cols="12" xs="12" sm="6" class="mb-2">
                              <h5 class="pt-1">
                                <span class="text-grey">Fee Type</span>
                              </h5>
                              <h4>Professional <sup>2</sup></h4>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" sm="6" class="mb-2">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.cboProSchedule"
                                        hide-details
                                        :items="advisoryProposedFees"
                                        :return-object="true"
                                        clearable
                                        item-title="Name"
                                        item-value="FeeScheduleID"
                                        @update:model-value="getProSchedule(serviceProviderList.cboProSchedule, false)"
                                        class="customfontsize"
                                        :label="serviceProviderList.cboProSchedule ? '' : 'Select Professional Schedule'"
                                        append-icon="icon-chevron-down"
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" sm="6" class="mb-2" v-if="serviceProviderList.cboProSchedule">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.txtProFeeType"
                                        hide-details
                                        :items="feeEntryTypeList"
                                        clearable
                                        class="customfontsize"
                                        :label="serviceProviderList.txtProFeeType ? '' : 'Select Fee Entry Type'"
                                        append-icon="icon-chevron-down"
                                        item-props.disabled="disabled"
                                        :disabled="disableProFeeType"
                                        @update:model-value="
                                          enableSelectedFeeType(serviceProviderList.txtProFeeType, 'Professional')
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtProFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtProProposedBasis"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyProProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedProfessional',
                                            'basis',
                                            serviceProviderList.txtProProposedBasis,
                                            false
                                          )
                                        "
                                        :disabled="disableProProposedBasis"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtProFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtProProposed"
                                        prefix="$"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyProProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedProfessional',
                                            'dollar',
                                            serviceProviderList.txtProProposed,
                                            false
                                          )
                                        "
                                        :disabled="disableProProposed"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtProFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtProProposedPercent"
                                        suffix="%"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyProProposed"
                                        v-input-mask="{
                                          alias: 'numeric',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedProfessional',
                                            'percent',
                                            serviceProviderList.txtProProposedPercent,
                                            false
                                          )
                                        "
                                        :disabled="disableProProposedPercent"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-divider class="bold my-2"></v-divider>
                        <v-col cols="12" xs="12" class="pl-2 pr-2 pb-2">
                          <v-row>
                            <v-col cols="12" xs="12" sm="6" class="mb-2">
                              <h5 class="pt-1">
                                <span class="text-grey">Fee Type</span>
                              </h5>
                              <h4>Recordkeeping</h4>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" sm="6" class="mb-2">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.cboRecordSchedule"
                                        hide-details
                                        class="customfontsize"
                                        :items="recordScheduleList"
                                        :return-object="true"
                                        item-title="Name"
                                        item-value="FeeScheduleID"
                                        clearable
                                        @update:model-value="getRecordSchedule(serviceProviderList.cboRecordSchedule, false)"
                                        :label="serviceProviderList.cboRecordSchedule ? '' : 'Select Recordkeeping Schedule'"
                                        append-icon="icon-chevron-down"
                                        :disabled="
                                          $authz.allowedByProgram(
                                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                                            $authz.pcsAspireProduct.Multi_Strategist_Product
                                          )
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" sm="6" class="mb-2" v-if="serviceProviderList.cboRecordSchedule">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.txtRecordFeeType"
                                        hide-details
                                        class="customfontsize"
                                        :items="feeEntryTypeList"
                                        clearable
                                        :label="serviceProviderList.txtRecordFeeType ? '' : 'Select Fee Entry Type'"
                                        append-icon="icon-chevron-down"
                                        item-props.disabled="disabled"
                                        :disabled="disableRecordFeeType"
                                        @update:model-value="
                                          enableSelectedFeeType(serviceProviderList.txtRecordFeeType, 'Recordkeeping')
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtRecordFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtRecordProposedBasis"
                                        class="font_size_13"
                                        hide-details
                                        readonly
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        :disabled="disableRecordProposedBasis"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtRecordFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtRecordProposed"
                                        prefix="$"
                                        class="font_size_13"
                                        hide-details
                                        readonly
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        density="compact"
                                        :disabled="disableRecordProposed"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtRecordFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtRecordProposedPercent"
                                        suffix="%"
                                        class="font_size_13"
                                        hide-details
                                        readonly
                                        v-input-mask="{
                                          alias: 'numeric',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        :disabled="disableRecordProposedPercent"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-divider class="bold my-2"></v-divider>
                        <v-col cols="12" xs="12" class="pl-2 pr-2 pb-2">
                          <v-row>
                            <v-col cols="12" xs="12" sm="6" class="mb-2">
                              <h5 class="pt-1">
                                <span class="text-grey">Fee Type</span>
                              </h5>
                              <h4>Trustee / Custodian</h4>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" sm="6" class="mb-2">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.cboCustodianSchedule"
                                        hide-details
                                        class="customfontsize"
                                        :items="custodianScheduleList"
                                        :return-object="true"
                                        item-title="Name"
                                        item-value="FeeScheduleID"
                                        clearable
                                        @update:model-value="
                                          getCustodianSchedule(serviceProviderList.cboCustodianSchedule, false)
                                        "
                                        :label="
                                          serviceProviderList.cboCustodianSchedule ? '' : 'Select Trustee / Custodian Schedule'
                                        "
                                        append-icon="icon-chevron-down"
                                        :disabled="
                                          $authz.allowedByProgram(
                                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                                            $authz.pcsAspireProduct.Multi_Strategist_Product
                                          )
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" sm="6" class="mb-2" v-if="serviceProviderList.cboCustodianSchedule">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.txtCustodianFeeType"
                                        hide-details
                                        class="customfontsize"
                                        :items="feeEntryTypeList"
                                        clearable
                                        :label="serviceProviderList.txtCustodianFeeType ? '' : 'Select Fee Entry Type'"
                                        append-icon="icon-chevron-down"
                                        item-props.disabled="disabled"
                                        :disabled="disableCustodianFeeType"
                                        @update:model-value="
                                          enableSelectedFeeType(serviceProviderList.txtCustodianFeeType, 'Custodian')
                                        "
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtCustodianFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtCustodianProposedBasis"
                                        class="font_size_13"
                                        hide-details
                                        readonly
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        :disabled="disableCustodianProposedBasis"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtCustodianFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtCustodianProposed"
                                        prefix="$"
                                        class="font_size_13"
                                        hide-details
                                        readonly
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        density="compact"
                                        :disabled="disableCustodianProposed"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtCustodianFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtCustodianProposedPercent"
                                        suffix="%"
                                        class="font_size_13"
                                        hide-details
                                        readonly
                                        v-input-mask="{
                                          alias: 'numeric',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        :disabled="disableCustodianProposedPercent"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-divider class="bold my-2"></v-divider>
                        <v-col cols="12" xs="12" class="pl-2 pr-2 pb-2">
                          <v-row>
                            <v-col cols="12" xs="12" sm="6" class="mb-2">
                              <h5 class="pt-1">
                                <span class="text-grey">Fee Type</span>
                              </h5>
                              <h4>Other</h4>
                            </v-col>
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-col cols="12" sm="6" class="mb-2">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.cboOtherSchedule"
                                        hide-details
                                        class="customfontsize"
                                        :items="otherProposedFees"
                                        :return-object="true"
                                        item-title="Name"
                                        item-value="FeeScheduleID"
                                        clearable
                                        @update:model-value="getOtherSchedule(serviceProviderList.cboOtherSchedule, false)"
                                        :label="serviceProviderList.cboOtherSchedule ? '' : 'Select Other Schedule'"
                                        append-icon="icon-chevron-down"
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="6" sm="6" class="mb-2" v-if="serviceProviderList.cboOtherSchedule">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-select
                                        v-model="serviceProviderList.txtOtherFeeType"
                                        hide-details
                                        class="customfontsize"
                                        :items="feeEntryTypeList"
                                        clearable
                                        :label="serviceProviderList.txtOtherFeeType ? '' : 'Select Fee Entry Type'"
                                        append-icon="icon-chevron-down"
                                        item-props.disabled="disabled"
                                        :disabled="disableOtherFeeType"
                                        @update:model-value="enableSelectedFeeType(serviceProviderList.txtOtherFeeType, 'Other')"
                                      ></v-select>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtOtherFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtOtherProposedBasis"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyOtherProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        @change="
                                          assignFeeValue(
                                            'ProposedOther',
                                            'basis',
                                            serviceProviderList.txtOtherProposedBasis,
                                            false
                                          )
                                        "
                                        :disabled="disableOtherProposedBasis"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtOtherFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtOtherProposed"
                                        prefix="$"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyOtherProposed"
                                        v-input-mask="{
                                          alias: 'currency',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        @focus="$event.target.select()"
                                        @change="
                                          assignFeeValue('ProposedOther', 'dollar', serviceProviderList.txtOtherProposed, false)
                                        "
                                        density="compact"
                                        :disabled="disableOtherProposed"
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                                <v-col cols="4" sm="4" class="mb-2" v-if="serviceProviderList.txtOtherFeeType">
                                  <v-col cols="12" xs="12">
                                    <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                                  </v-col>
                                  <v-col cols="12" xs="12" class="mb-1">
                                    <v-col cols="11" xs="11">
                                      <v-text-field
                                        v-model="serviceProviderList.txtOtherProposedPercent"
                                        suffix="%"
                                        class="font_size_13"
                                        hide-details
                                        :readonly="readonlyOtherProposed"
                                        v-input-mask="{
                                          alias: 'numeric',
                                          rightAlign: false,
                                          autoUnmask: true,
                                          allowMinus: false,
                                          digitsOptional: true,
                                          placeholder: '0'
                                        }"
                                        density="compact"
                                        :disabled="disableOtherProposedPercent"
                                        @change="
                                          assignFeeValue(
                                            'ProposedOther',
                                            'percent',
                                            serviceProviderList.txtOtherProposedPercent,
                                            false
                                          )
                                        "
                                      ></v-text-field>
                                    </v-col>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-card-text>
                  </v-card>
                  <v-col :class="theme.dark ? '' : 'grey lighten-2'" class="pt-3 pb-3" v-if="!display.smAndDown.value">
                    <v-row>
                      <v-col cols="4" xs="4" class="pr-2"></v-col>
                      <v-col cols="2" xs="2" class="pr-n1"></v-col>
                      <v-col cols="2" xs="2" class="mr-1 pl-2"></v-col>
                      <v-col cols="2" xs="2" lg="2" class="font_11 font-weight-medium">{{
                        formatPrice(totalProposedFees ? totalProposedFees : 0, 0)
                      }}</v-col>
                      <v-col cols="2" xs="2" lg="2" class="pr-2"></v-col>
                    </v-row>
                  </v-col>
                  <v-col :class="theme.dark ? '' : 'grey lighten-2'" class="pt-3 pb-3" v-if="display.smAndDown.value">
                    <v-row>
                      <v-col cols="6" xs="6" class="font_11 font-weight-medium pl-6">Total</v-col>
                      <v-col cols="6" xs="6" class="font_11 font-weight-medium">{{
                        formatPrice(totalProposedFees ? totalProposedFees : 0, 0)
                      }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" xs="12" class="pl-4 pt-1 align-self">
                    <v-row>
                      <v-col cols="11" xs="11" class="flex_none pr-1">
                        <v-switch
                          v-model="serviceProviderList.proposed_338"
                          label="Emphasize 3(38) service fees as separate line item"
                          class="ma-0"
                          :ripple="false"
                          hide-details
                          color="accent"
                        />
                      </v-col>
                      <v-col cols="1" xs="1">
                        <v-menu :persistent="false" close-on-content-click transition="scroll-y-transition">
                          <template #activator="{ props }">
                            <v-btn size="small" v-bind="props" :icon="true" variant="text" class="ma-0">
                              <v-icon size="small" :class="!theme.dark ? 'text-accent' : ''"> fa fa-info-circle </v-icon>
                            </v-btn>
                          </template>
                          <v-card max-width="300px">
                            <v-card-actions class="pb-0 pt-1">
                              <v-spacer />
                              <v-btn size="small" variant="text" :icon="true">
                                <v-icon class="text-accent"> close </v-icon>
                              </v-btn>
                            </v-card-actions>
                            <v-card-text class="pt-0">
                              Checking this box will move whatever amount you input under ‘Investment Advisory’ and transfer it a
                              new line item underneath Service Provider Fees titled ‘Discretionary 3(38) Investment Manager’.
                            </v-card-text>
                          </v-card>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="pl-4 pt-1">
                    <v-row>
                      <div :class="display.xl.value ? 'ml-11' : display.mdAndDown.value ? '' : 'ml-12'" class="mr-2 mt-2">
                        <span class="font-size-14">Revenue Offset</span>
                      </div>
                      <v-checkbox
                        v-model="serviceProviderList.chkProposed12b1"
                        small
                        label="12b-1"
                        class="ma-0 pr-2"
                        hide-details
                        color="accent"
                      />
                      <v-checkbox
                        v-model="serviceProviderList.chkProposedSubTA"
                        small
                        label="SubTA"
                        class="ma-0"
                        color="accent"
                        hide-details
                      />
                    </v-row>
                  </v-col>
                  <v-col class="pl-4 pt-1">
                    <v-switch
                      v-model="serviceProviderList.exchangeTradedFunds"
                      label="`Exchange Traded Funds(ETFs)?`"
                      class="offsetSwitch ma-0"
                      hide-details
                      color="accent"
                    />
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-form>
        <v-col cols="12" xs="12" class="mt-1 mb-1">
          <div class="theme--dark pr-1">
            <h5>
              <sup>1</sup>This refers to the ERISA 3(38) or 3(21) on the Plan
              <br />
            </h5>
          </div>
          <div class="theme--dark pr-1">
            <h5><sup>2</sup>This refers to the Financial Advisor / Solicitor on the Plan</h5>
          </div>
        </v-col>
      </v-col>
      <v-col v-show="createFeeDialog" id="feeContainerModel">
        <v-dialog v-model="createFeeDialog" persistent class="elevation-3" scrollable :eager="true" max-width="95%">
          <v-card>
            <v-card-title :class="theme.dark ? '' : 'accent secondary--text'">
              <v-col cols="12" xs="12">
                <h3>New Fee Schedule</h3>
              </v-col>
            </v-card-title>
            <v-divider class="bold" />
            <v-card-text class="pt-5 pb-5 card_text_height">
              <FeeScheduleForm
                ref="scheduleBuilder"
                from-page="serviceProvider"
                @show-fees="createNewFee"
                @get-fee="insertSchedules"
              />
            </v-card-text>
            <v-divider class="bold" />
            <v-card-actions>
              <v-btn :color="theme.dark ? '' : 'accent'" @click="SaveSchedule()"> Save Schedule </v-btn>
              <v-btn :color="theme.dark ? '' : 'accent'" @click="createNewFee()"> Cancel, Go Back </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-col>
  </v-layout>
</template>
<script>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, watch, inject, computed } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import FeeScheduleForm from '@/components/Account/FeeScheduleForm'
export default {
  components: {
    FeeScheduleForm
  },
  props: ['planId', 'SEINPNO', 'selectedPlan'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const $store = instance.appContext.config.globalProperties.$store
    const $toast = instance.appContext.config.globalProperties.$toast
    const theme = useTheme()
    const display = useDisplay()
    const scheduleBuilder = ref(null)
    const createFeeDialog = ref(false)
    const serviceProviderList = ref({
      txtCostsCurrent: 0,
      txtAdminCurrent: 0,
      txtAdvisoryCurrent: 0,
      txtProCurrent: 0,
      txtRecordCurrent: 0,
      txtCustodianCurrent: 0,
      txtOtherCurrent: 0,
      chkOverride: false,
      current_338: false,
      chkCurrent12b1: false,
      chkCurrentSubTA: false,
      cboCostsSchedule: '',
      txtCostsFeeType: '',
      txtCostsProposed: 0,
      txtCostsProposedBasis: 0,
      txtCostsProposedPercent: 0,
      cboAdminSchedule: '',
      txtAdminFeeType: '',
      txtAdminProposed: 0,
      txtAdminProposedBasis: 0,
      txtAdminProposedPercent: 0,
      cboAdvisorySchedule: '',
      txtAdvisoryFeeType: '',
      txtAdvisoryProposed: 0,
      txtAdvisoryProposedBasis: 0,
      txtAdvisoryProposedPercent: 0,
      cboProSchedule: '',
      txtProFeeType: '',
      txtProProposed: 0,
      txtProProposedBasis: 0,
      txtProProposedPercent: 0,
      cboRecordSchedule: '',
      txtRecordFeeType: '',
      txtRecordProposed: 0,
      txtRecordProposedPercent: 0,
      txtRecordProposedBasis: 0,
      cboCustodianSchedule: '',
      txtCustodianFeeType: '',
      txtCustodianProposed: 0,
      txtCustodianProposedBasis: 0,
      txtCustodianProposedPercent: 0,
      cboOtherSchedule: '',
      txtOtherFeeType: '',
      txtOtherProposed: 0,
      txtOtherProposedBasis: 0,
      txtOtherProposedPercent: 0,
      proposed_338: false,
      exchangeTradedFunds: false,
      chkProposedSubTA: false,
      chkProposed12b1: false
    })
    const oldserviceProviderList = ref({
      txtCostsCurrent: 0,
      txtAdminCurrent: 0,
      txtAdvisoryCurrent: 0,
      txtProCurrent: 0,
      txtRecordCurrent: 0,
      txtCustodianCurrent: 0,
      txtOtherCurrent: 0,
      chkOverride: false,
      current_338: false,
      chkCurrent12b1: false,
      chkCurrentSubTA: false,
      cboCostsSchedule: '',
      txtCostsFeeType: '',
      txtCostsProposed: 0,
      txtCostsProposedBasis: 0,
      txtCostsProposedPercent: 0,
      cboAdminSchedule: '',
      txtAdminFeeType: '',
      txtAdminProposed: 0,
      txtAdminProposedBasis: 0,
      txtAdminProposedPercent: 0,
      cboAdvisorySchedule: '',
      txtAdvisoryFeeType: '',
      txtAdvisoryProposed: 0,
      txtAdvisoryProposedBasis: 0,
      txtAdvisoryProposedPercent: 0,
      cboProSchedule: '',
      txtProFeeType: '',
      txtProProposed: 0,
      txtProProposedBasis: 0,
      txtProProposedPercent: 0,
      cboRecordSchedule: '',
      txtRecordFeeType: '',
      txtRecordProposed: 0,
      txtRecordProposedPercent: 0,
      txtRecordProposedBasis: 0,
      cboCustodianSchedule: '',
      txtCustodianFeeType: '',
      txtCustodianProposed: 0,
      txtCustodianProposedBasis: 0,
      txtCustodianProposedPercent: 0,
      cboOtherSchedule: '',
      txtxOtherFeeType: '',
      txtOtherProposed: 0,
      txtOtherProposedBasis: 0,
      txtOtherProposedPercent: 0,
      proposed_338: false,
      exchangeTradedFunds: false,
      chkProposedSubTA: false,
      chkProposed12b1: false
    })
    const valid = ref(false)
    const trusteeAmount = ref(0)
    const lblCostsCurrent = ref(0)
    const lblAdminCurrent = ref(0)
    const lblAdvisoryCurrent = ref(0)
    const lblProCurrent = ref(0)
    const lblRecordCurrent = ref(0)
    const lblCustodianCurrent = ref(0)
    const lblOtherCurrent = ref(0)
    const providerName = ref('')
    const proposalID = ref(0)
    const scheduleFees = ref([])
    const readonlyCostsProposed = ref(false)
    const readonlyAdvisoryProposed = ref(false)
    const readonlyAdminProposed = ref(false)
    const readonlyProProposed = ref(false)
    const readonlyOtherProposed = ref(false)
    const planDetail = ref({})
    const recordScheduleList = ref([])
    const adminScheduleList = ref([])
    const custodianScheduleList = ref([])
    const serviceProviderObject = ref([])
    const successCustodian = ref(false)
    const successAdminSchedule = ref(false)
    const successRecord = ref(false)
    const successAdvisory = ref(false)
    const successCosts = ref(false)
    const successProProposed = ref(false)
    const successOtherProposed = ref(false)
    const successLoad5500 = ref(false)
    const otherProposedFees = ref([])
    const advisoryProposedFees = ref([])
    const investmentProposedFees = ref([])
    const totalAssets = ref(0)
    const totalParticipant = ref(0)
    const minAdvisoryFee = ref(0)
    const maxAdvisoryFee = ref(0)
    const loadType = ref('')
    const totalProposedFees = ref(0)
    const totalCurrentAdditionalFees = ref(0)
    const totalCurrentFee = ref(0)
    const totalCurrentDollar = ref(0)
    const feesAdjusted = ref(false)
    const feesAdjustedMessage = ref('')
    const accountingFeesAdjustedMessage = ref('')
    const otherFeesAdjustedMessage = ref('')
    const professionalFeesAdjustedMessage = ref('')
    const investmentFeesAdjustedMessage = ref('')
    const recordkeepingFeesAdjustedMessage = ref('')
    const adminFeesAdjustedMessage = ref('')
    const custodianFeesAdjustedMessage = ref('')
    const feeEntryTypeList = ref([
      {
        text: 'Basis Points',
        value: 1,
        disabled: false
      },
      {
        text: 'Cost ($)',
        value: 2,
        disabled: $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
          ? true
          : false
      },
      {
        text: 'Cost (%)',
        value: 3,
        disabled: $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
          ? true
          : false
      },
      {
        text: 'Fee Schedule',
        value: 4,
        disabled: true
      }
    ])
    const disableCostFeeType = ref(false)
    const disableCostBasis = ref(false)
    const disableCostDollar = ref(false)
    const disableCostPercent = ref(false)
    const disableAdminFeeType = ref(false)
    const disableAdminProposedBasis = ref(false)
    const disableAdminProposed = ref(false)
    const disableAdminProposedPercent = ref(false)
    const disableAdvisoryFeeType = ref(false)
    const disableAdvisoryProposedBasis = ref(false)
    const disableAdvisoryProposed = ref(false)
    const disableAdvisoryProposedPercent = ref(false)
    const disableProFeeType = ref(false)
    const disableProProposedBasis = ref(false)
    const disableProProposed = ref(false)
    const disableProProposedPercent = ref(false)
    const disableRecordFeeType = ref(false)
    const disableRecordProposedBasis = ref(false)
    const disableRecordProposed = ref(false)
    const disableRecordProposedPercent = ref(false)
    const disableCustodianFeeType = ref(false)
    const disableCustodianProposedBasis = ref(false)
    const disableCustodianProposed = ref(false)
    const disableCustodianProposedPercent = ref(false)
    const disableOtherFeeType = ref(false)
    const disableOtherProposedBasis = ref(false)
    const disableOtherProposed = ref(false)
    const disableOtherProposedPercent = ref(false)
    const subCustodian = ref('')
    function toFixed(val) {
      if (val) {
        return val.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
      }
      return 0
    }
    function calculateTotal(val) {
      if (val === 'Proposed') {
        var totalProposedDollar =
          parseFloat(serviceProviderList.value.txtCostsProposed) +
          parseFloat(serviceProviderList.value.txtOtherProposed) +
          parseFloat(serviceProviderList.value.txtProProposed) +
          parseFloat(serviceProviderList.value.txtAdvisoryProposed) +
          parseFloat(serviceProviderList.value.txtAdminProposed) +
          parseFloat(serviceProviderList.value.txtCustodianProposed) +
          parseFloat(serviceProviderList.value.txtRecordProposed)
        totalProposedFees.value = parseFloat(totalProposedDollar).toFixed(2)
      } else if (val === 'Current') {
        var totalCurrentAddDollar =
          parseFloat(serviceProviderList.value.txtCostsCurrent) +
          parseFloat(serviceProviderList.value.txtAdminCurrent) +
          parseFloat(serviceProviderList.value.txtAdvisoryCurrent) +
          parseFloat(serviceProviderList.value.txtProCurrent) +
          parseFloat(serviceProviderList.value.txtRecordCurrent) +
          parseFloat(serviceProviderList.value.txtCustodianCurrent) +
          parseFloat(serviceProviderList.value.txtOtherCurrent)
        totalCurrentAdditionalFees.value = parseFloat(totalCurrentAddDollar).toFixed(2)

        var tmp_totalCurrentDollar =
          parseFloat(serviceProviderList.value.txtCostsCurrentDollar) +
          parseFloat(serviceProviderList.value.txtAdminCurrentDollar) +
          parseFloat(serviceProviderList.value.txtAdvisoryCurrentDollar) +
          parseFloat(serviceProviderList.value.txtProCurrentDollar) +
          parseFloat(serviceProviderList.value.txtRecordCurrentDollar) +
          parseFloat(serviceProviderList.value.txtCustodianCurrentDollar) +
          parseFloat(serviceProviderList.value.txtOtherCurrentDollar)
        totalCurrentDollar.value = parseFloat(tmp_totalCurrentDollar).toFixed(2)
      }
    }
    const loadCurrentFees = async () => {
      var currentFeePromise = []
      currentFeePromise.push(
        $axios.get(`/api/v1/rpea/plan/${props.planId}/fee/20`).then((success) => {
          if (success.data.d != null) {
            serviceProviderList.value.txtAdvisoryCurrent =
              success.data.d.sp_fees !== 0 ? Number(parseFloat(success.data.d.sp_fees).toFixed(0)) : 0
            oldserviceProviderList.value.txtAdvisoryCurrent = serviceProviderList.value.txtAdvisoryCurrent
            assignFeeValue('Investment', 'addFee', serviceProviderList.value.txtAdvisoryCurrent, true)
          } else {
            serviceProviderList.value.txtAdvisoryCurrent = lblAdvisoryCurrent.value ? lblAdvisoryCurrent.value : 0
          }
        })
      )
      currentFeePromise.push(
        $axios.get(`/api/v1/rpea/plan/${props.planId}/fee/24`).then((success) => {
          if (success.data.d != null) {
            serviceProviderList.value.txtRecordCurrent =
              success.data.d.sp_fees !== 0 ? Number(parseFloat(success.data.d.sp_fees).toFixed(0)) : 0
            oldserviceProviderList.value.txtRecordCurrent = serviceProviderList.value.txtRecordCurrent
            assignFeeValue('Recordkeeping', 'addFee', serviceProviderList.value.txtRecordCurrent, true)
          } else {
            serviceProviderList.value.txtRecordCurrent = lblRecordCurrent.value ? lblRecordCurrent.value : 0
          }
        })
      )
      currentFeePromise.push(
        $axios.get(`/api/v1/rpea/plan/${props.planId}/fee/18`).then((success) => {
          if (success.data.d != null) {
            serviceProviderList.value.txtCustodianCurrent =
              success.data.d.sp_fees !== 0 ? Number(parseFloat(success.data.d.sp_fees).toFixed(0)) : 0
            oldserviceProviderList.value.txtCustodianCurrent = serviceProviderList.value.txtCustodianCurrent
            assignFeeValue('Trustee', 'addFee', serviceProviderList.value.txtCustodianCurrent, true)
          } else {
            serviceProviderList.value.txtCustodianCurrent = lblCustodianCurrent.value ? lblCustodianCurrent.value : 0
          }
        })
      )
      currentFeePromise.push(
        $axios.get(`/api/v1/rpea/plan/${props.planId}/fee/12`).then((success) => {
          if (success.data.d != null) {
            serviceProviderList.value.txtAdminCurrent =
              success.data.d.sp_fees !== 0 ? Number(parseFloat(success.data.d.sp_fees).toFixed(0)) : 0
            oldserviceProviderList.value.txtAdminCurrent = serviceProviderList.value.txtAdminCurrent
            assignFeeValue('Administration', 'addFee', serviceProviderList.value.txtAdminCurrent, true)
          } else {
            serviceProviderList.value.txtAdminCurrent = lblAdminCurrent.value ? lblAdminCurrent.value : 0
          }
        })
      )
      currentFeePromise.push(
        $axios.get(`/api/v1/rpea/plan/${props.planId}/fee/16`).then((success) => {
          if (success.data.d != null) {
            serviceProviderList.value.txtProCurrent =
              success.data.d.sp_fees !== 0 ? Number(parseFloat(success.data.d.sp_fees).toFixed(0)) : 0
            oldserviceProviderList.value.txtProCurrent = serviceProviderList.value.txtProCurrent
            assignFeeValue('Professional', 'addFee', serviceProviderList.value.txtProCurrent, true)
          } else {
            serviceProviderList.value.txtProCurrent = lblProCurrent.value ? lblProCurrent.value : 0
          }
        })
      )
      currentFeePromise.push(
        $axios.get(`/api/v1/rpea/plan/${props.planId}/fee/99`).then((success) => {
          if (success.data.d != null) {
            serviceProviderList.value.txtOtherCurrent =
              success.data.d.sp_fees !== 0 ? Number(parseFloat(success.data.d.sp_fees).toFixed(0)) : 0
            oldserviceProviderList.value.txtOtherCurrent = serviceProviderList.value.txtOtherCurrent
            assignFeeValue('Other', 'addFee', serviceProviderList.value.txtOtherCurrent, true)
          } else {
            serviceProviderList.value.txtOtherCurrent = lblOtherCurrent.value ? lblOtherCurrent.value : 0
          }
        })
      )
      currentFeePromise.push(
        $axios.get(`/api/v1/rpea/plan/${props.planId}/fee/10`).then((success) => {
          if (success.data.d != null) {
            serviceProviderList.value.txtCostsCurrent =
              success.data.d.sp_fees !== 0 ? Number(parseFloat(success.data.d.sp_fees).toFixed(0)) : 0
            oldserviceProviderList.value.txtCostsCurrent = serviceProviderList.value.txtCostsCurrent
            assignFeeValue('Accounting', 'addFee', serviceProviderList.value.txtCostsCurrent, true)
          } else {
            serviceProviderList.value.txtCostsCurrent = lblCostsCurrent.value ? lblCostsCurrent.value : 0
          }
        })
      )
      await Promise.allSettled(currentFeePromise)
    }
    function load5500() {
      $axios
        .get(`/api/v1/plan/${props.SEINPNO}/fees5500`)
        .then((success) => {
          if (success.data.d != null) {
            lblCostsCurrent.value = success.data.d.length > 0 ? parseFloat(success.data.d[0].Costs).toFixed(0) : 0
            lblAdminCurrent.value = success.data.d.length > 0 ? parseFloat(success.data.d[0].Admin).toFixed(0) : 0
            lblAdvisoryCurrent.value = success.data.d.length > 0 ? parseFloat(success.data.d[0].Advisory).toFixed(0) : 0
            lblProCurrent.value = success.data.d.length > 0 ? parseFloat(success.data.d[0].Pro).toFixed(0) : 0
            lblRecordCurrent.value = 0
            lblCustodianCurrent.value = success.data.d.length > 0 ? parseFloat(success.data.d[0].Custodian).toFixed(0) : 0
            lblOtherCurrent.value = success.data.d.length > 0 ? parseFloat(success.data.d[0].Other).toFixed(0) : 0
          }
          successLoad5500.value = true
          loadCurrentFees()
          var tmp_totalCurrentFee =
            parseFloat(lblCostsCurrent.value) +
            parseFloat(lblAdminCurrent.value) +
            parseFloat(lblAdvisoryCurrent.value) +
            parseFloat(lblProCurrent.value) +
            parseFloat(lblRecordCurrent.value) +
            parseFloat(lblCustodianCurrent.value) +
            parseFloat(lblOtherCurrent.value)
          totalCurrentFee.value = parseFloat(tmp_totalCurrentFee).toFixed(2)
        })
        .catch(() => {
          successLoad5500.value = true
        })
    }
    function loadOffsets() {
      $axios.get(`/api/v1/rpea/plan/${props.planId}/feeoffsets`).then((success) => {
        if (success.data.d != null) {
          if (success.data.d.length > 0) {
            serviceProviderList.value.chkCurrent12b1 = success.data.d[0].Current_12b1
            serviceProviderList.value.chkCurrentSubTA = success.data.d[0].Current_SubTA
            serviceProviderList.value.chkProposed12b1 = success.data.d[0].Proposed_12b1
            serviceProviderList.value.chkProposedSubTA = success.data.d[0].Proposed_SubTA
            oldserviceProviderList.value.chkCurrent12b1 = serviceProviderList.value.chkCurrent12b1
            oldserviceProviderList.value.chkCurrentSubTA = serviceProviderList.value.chkCurrentSubTA
            oldserviceProviderList.value.chkProposed12b1 = serviceProviderList.value.chkProposed12b1
            oldserviceProviderList.value.chkProposedSubTA = serviceProviderList.value.chkProposedSubTA
          }
        }
      })
    }
    function loadOverForm() {
      $axios.get(`/api/v1/plan/${props.planId}`).then((success) => {
        if (success.data.d != null) {
          planDetail.value = success.data.d
          providerName.value = success.data.d.platformName
          serviceProviderList.value.current_338 =
            success.data.d.overForm !== null && success.data.d.overForm !== '' ? success.data.d.current_338 : false
          serviceProviderList.value.proposed_338 =
            success.data.d.overForm !== null && success.data.d.overForm !== '' ? success.data.d.proposed_338 : false
          serviceProviderList.value.chkOverride =
            success.data.d.overForm !== null && success.data.d.overForm !== '' ? success.data.d.overForm : false
          serviceProviderList.value.exchangeTradedFunds =
            success.data.d.exchangeTradedFunds !== null && success.data.d.exchangeTradedFunds !== ''
              ? success.data.d.exchangeTradedFunds
              : false
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            loadAdvisorFee()
          }
          oldserviceProviderList.value.current_338 = serviceProviderList.value.current_338
          oldserviceProviderList.value.proposed_338 = serviceProviderList.value.proposed_338
          oldserviceProviderList.value.exchangeTradedFunds = serviceProviderList.value.exchangeTradedFunds
          oldserviceProviderList.value.chkOverride = serviceProviderList.value.chkOverride
        }
      })
    }
    function getProposalID() {
      if (props.SEINPNO) {
        $axios.post(`/api/v1/tal/proposal/generateid?seinpno=${props.SEINPNO}`).then((success) => {
          proposalID.value = success.data.d
          loadProposalSchedules()
          loadProposedFeeList()
        })
      }
    }
    function loadProposedFees() {
      if (proposalID.value > 0) {
        $axios
          .get(`/api/v1/tal/proposal/${proposalID.value}/fee/10`)
          .then((success) => {
            if (success.data.d !== null) {
              serviceProviderList.value.txtCostsProposed = Number(parseFloat(success.data.d.sp_fees).toFixed(0))
              if (success.data.d.sp_fees > 0) {
                if (scheduleFees.value.length > 0) {
                  if (success.data.d.FeeScheduleID) {
                    serviceProviderList.value.cboCostsSchedule = scheduleFees.value.find((obj) => {
                      return obj.FeeScheduleID === success.data.d.FeeScheduleID
                    })
                    if (serviceProviderList.value.cboCostsSchedule && serviceProviderList.value.cboCostsSchedule.Fee)
                      serviceProviderList.value.txtCostsProposed = Number(
                        parseFloat(serviceProviderList.value.cboCostsSchedule.Fee).toFixed(0)
                      )
                    getCostSchedule(serviceProviderList.value.cboCostsSchedule, true)
                  } else {
                    serviceProviderList.value.cboCostsSchedule = scheduleFees.value.find((obj) => {
                      return obj.Name === 'Enter Fees Manually'
                    })
                    assignFeeValue('ProposedAccounting', 'dollar', serviceProviderList.value.txtCostsProposed, true)
                  }
                } else {
                  serviceProviderList.value.cboCostsSchedule = ''
                }
                readonlyCostsProposed.value = success.data.d.FeeScheduleID !== 0 ? true : false
                oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
                oldserviceProviderList.value.cboCostsSchedule = serviceProviderList.value.cboCostsSchedule
              } else {
                if (scheduleFees.value.length > 0) {
                  var defaultCostFees = scheduleFees.value.filter((a) => a.DefaultFeeSchedule === true)
                  if (defaultCostFees.length > 0) {
                    serviceProviderList.value.cboCostsSchedule = defaultCostFees[0]
                    serviceProviderList.value.txtCostsProposed = Number(parseFloat(defaultCostFee[0].Fee).toFixed(0))
                    getCostSchedule(serviceProviderList.value.cboCostsSchedule, true)
                    oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
                    oldserviceProviderList.value.cboCostsSchedule = serviceProviderList.value.cboCostsSchedule
                  }
                } else {
                  serviceProviderList.value.cboCostsSchedule = ''
                  serviceProviderList.value.txtCostsProposed = 0
                  oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
                  oldserviceProviderList.value.cboCostsSchedule = serviceProviderList.value.cboCostsSchedule
                }
              }
            } else {
              if (scheduleFees.value.length > 0) {
                var defaultCostFee = scheduleFees.value.filter((a) => a.DefaultFeeSchedule === true)
                if (defaultCostFee.length > 0) {
                  serviceProviderList.value.cboCostsSchedule = defaultCostFee[0]
                  serviceProviderList.value.txtCostsProposed = Number(parseFloat(defaultCostFee[0].Fee).toFixed(0))
                  getCostSchedule(serviceProviderList.value.cboCostsSchedule, true)
                  oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
                  oldserviceProviderList.value.cboCostsSchedule = serviceProviderList.value.cboCostsSchedule
                }
              } else {
                serviceProviderList.value.cboCostsSchedule = ''
                serviceProviderList.value.txtCostsProposed = 0
                oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
                oldserviceProviderList.value.cboCostsSchedule = serviceProviderList.value.cboCostsSchedule
              }
            }
            //added here
            if (
              scheduleFees.value.length > 0 &&
              serviceProviderList.value.cboCostsSchedule &&
              serviceProviderList.value.cboCostsSchedule.Name !== 'Enter Fees Manually'
            ) {
              var minCostsScheduleFee = serviceProviderList.value.cboCostsSchedule.MinimumFee
                ? serviceProviderList.value.cboCostsSchedule.MinimumFee
                : 0
              var maxCostsScheduleFee = serviceProviderList.value.cboCostsSchedule.MaximumFee
                ? serviceProviderList.value.cboCostsSchedule.MaximumFee
                : 0
              var feesCostsSchedule = serviceProviderList.value.cboCostsSchedule.Fee
                ? parseFloat(serviceProviderList.value.cboCostsSchedule.Fee)
                : 0
              if (minCostsScheduleFee > 0) {
                if (feesCostsSchedule <= minCostsScheduleFee) {
                  feesCostsSchedule = minCostsScheduleFee
                  feesAdjusted.value = true
                  accountingFeesAdjustedMessage.value =
                    'The Accounting fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                }
              } else if (maxCostsScheduleFee > 0) {
                if (feesCostsSchedule > maxCostsScheduleFee) {
                  feesCostsSchedule = maxCostsScheduleFee
                  feesAdjusted.value = true
                  accountingFeesAdjustedMessage.value =
                    'The Accounting fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                }
              }

              serviceProviderList.value.txtCostsProposed = Number(parseFloat(feesCostsSchedule).toFixed(0))
              oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
            }
            //upto here
            successCosts.value = true
            loadServiceProvider()
          })
          .catch(() => {
            successCosts.value = true
          })
      }
    }
    function getOtherData() {
      if (proposalID.value > 0) {
        $axios
          .get(`/api/v1/tal/proposal/${proposalID.value}/fee/99`)
          .then((success) => {
            if (success.data.d !== null) {
              serviceProviderList.value.txtOtherProposed = Number(parseFloat(success.data.d.sp_fees).toFixed(0))
              if (success.data.d.sp_fees > 0) {
                if (otherProposedFees.value.length > 0) {
                  if (success.data.d.FeeScheduleID) {
                    serviceProviderList.value.cboOtherSchedule = otherProposedFees.value.find((obj) => {
                      return obj.FeeScheduleID === success.data.d.FeeScheduleID
                    })
                    if (serviceProviderList.value.cboOtherSchedule && serviceProviderList.value.cboOtherSchedule.Fee)
                      serviceProviderList.value.txtOtherProposed = Number(
                        parseFloat(serviceProviderList.value.cboOtherSchedule.Fee).toFixed(0)
                      )
                    getOtherSchedule(serviceProviderList.value.cboOtherSchedule, true)
                  } else {
                    serviceProviderList.value.cboOtherSchedule = otherProposedFees.value.find((obj) => {
                      return obj.Name === 'Enter Fees Manually'
                    })
                    assignFeeValue('ProposedOther', 'dollar', serviceProviderList.value.txtOtherProposed, true)
                  }
                } else {
                  serviceProviderList.value.cboOtherSchedule = ''
                }
                readonlyOtherProposed.value = success.data.d.FeeScheduleID !== 0 ? true : false
                oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
                oldserviceProviderList.value.cboOtherSchedule = serviceProviderList.value.cboOtherSchedule
              } else {
                if (otherProposedFees.value.length > 0) {
                  var defaultOtherFees = otherProposedFees.value.filter((a) => a.DefaultFeeSchedule === true)
                  if (defaultOtherFees.length > 0) {
                    serviceProviderList.value.cboOtherSchedule = defaultOtherFees[0]
                    serviceProviderList.value.txtOtherProposed = Number(parseFloat(defaultOtherFees[0].Fee).toFixed(0))
                    getOtherSchedule(serviceProviderList.value.cboOtherSchedule, true)
                    oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
                    oldserviceProviderList.value.cboOtherSchedule = serviceProviderList.value.cboOtherSchedule
                  }
                } else {
                  serviceProviderList.value.cboOtherSchedule = ''
                  serviceProviderList.value.txtOtherProposed = 0
                  oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
                  oldserviceProviderList.value.cboOtherSchedule = serviceProviderList.value.cboOtherSchedule
                }
              }
            } else {
              if (otherProposedFees.value.length > 0) {
                var defaultOtherFee = otherProposedFees.value.filter((a) => a.DefaultFeeSchedule === true)
                if (defaultOtherFee.length > 0) {
                  serviceProviderList.value.cboOtherSchedule = defaultOtherFee[0]
                  serviceProviderList.value.txtOtherProposed = Number(parseFloat(defaultOtherFee[0].Fee).toFixed(0))
                  getOtherSchedule(serviceProviderList.value.cboOtherSchedule, true)
                  oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
                  oldserviceProviderList.value.cboOtherSchedule = serviceProviderList.value.cboOtherSchedule
                }
              } else {
                serviceProviderList.value.cboOtherSchedule = ''
                serviceProviderList.value.txtOtherProposed = 0
                oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
                oldserviceProviderList.value.cboOtherSchedule = serviceProviderList.value.cboOtherSchedule
              }
            }

            //added here
            if (
              otherProposedFees.value.length > 0 &&
              serviceProviderList.value.cboOtherSchedule &&
              serviceProviderList.value.cboOtherSchedule.Name !== 'Enter Fees Manually'
            ) {
              var minOtherScheduleFee = serviceProviderList.value.cboOtherSchedule.MinimumFee
                ? serviceProviderList.value.cboOtherSchedule.MinimumFee
                : 0
              var maxOtherScheduleFee = serviceProviderList.value.cboOtherSchedule.MaximumFee
                ? serviceProviderList.value.cboOtherSchedule.MaximumFee
                : 0
              var feesOtherSchedule = serviceProviderList.value.cboOtherSchedule.Fee
                ? parseFloat(serviceProviderList.value.cboOtherSchedule.Fee)
                : 0
              if (minOtherScheduleFee > 0) {
                if (feesOtherSchedule <= minOtherScheduleFee) {
                  feesOtherSchedule = minOtherScheduleFee
                  feesAdjusted.value = true
                  otherFeesAdjustedMessage.value =
                    'The Other fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                }
              } else if (maxOtherScheduleFee > 0) {
                if (feesOtherSchedule > maxOtherScheduleFee) {
                  feesOtherSchedule = maxOtherScheduleFee
                  feesAdjusted.value = true
                  otherFeesAdjustedMessage.value =
                    'The Other fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                }
              }

              serviceProviderList.value.txtOtherProposed = Number(parseFloat(feesOtherSchedule).toFixed(0))
              oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
            }
            //upto here

            successOtherProposed.value = true
            loadServiceProvider()
          })
          .catch(() => {
            successOtherProposed.value = true
          })
      }
    }
    function getProfessionalData() {
      if (proposalID.value > 0) {
        $axios
          .get(`/api/v1/tal/proposal/${proposalID.value}/fee/16`)
          .then((success) => {
            if (success.data.d !== null) {
              serviceProviderList.value.txtProProposed = Number(parseFloat(success.data.d.sp_fees).toFixed(0))
              if (success.data.d.sp_fees > 0) {
                if (advisoryProposedFees.value.length > 0) {
                  if (success.data.d.FeeScheduleID) {
                    serviceProviderList.value.cboProSchedule = advisoryProposedFees.value.find((obj) => {
                      return obj.FeeScheduleID === success.data.d.FeeScheduleID
                    })
                    if (serviceProviderList.value.cboProSchedule && serviceProviderList.value.cboProSchedule.Fee)
                      serviceProviderList.value.txtProProposed = Number(
                        parseFloat(serviceProviderList.value.cboProSchedule.Fee).toFixed(0)
                      )
                    getProSchedule(serviceProviderList.value.cboProSchedule, true)
                  } else {
                    serviceProviderList.value.cboProSchedule = advisoryProposedFees.value.find((obj) => {
                      return obj.Name === 'Enter Fees Manually'
                    })
                    if (
                      $authz.allowedByProgram(
                        $authz.programPermissionSet.PCS_Aspire_Product__c,
                        $authz.pcsAspireProduct.Multi_Strategist_Product
                      )
                    ) {
                      if (Object.keys(planDetail.value).length > 0) {
                        serviceProviderList.value.txtProProposedBasis =
                          planDetail.value && planDetail.value.advisorFee
                            ? Number(parseFloat(planDetail.value.advisorFee).toFixed(0))
                            : 0
                        if (serviceProviderList.value.txtProProposedBasis !== 0) {
                          serviceProviderList.value.txtProProposed = Number(
                            parseFloat(
                              (Number(serviceProviderList.value.txtProProposedBasis) / 10000) * totalAssets.value
                            ).toFixed(0)
                          )
                          serviceProviderList.value.txtProProposedPercent = parseFloat(
                            Number(serviceProviderList.value.txtProProposedBasis) / 100
                          ).toFixed(2)

                          serviceProviderList.value.txtProFeeType = 1
                          disableProFeeType.value = false
                          disableProProposedBasis.value = false
                          disableProProposed.value = true
                          disableProProposedPercent.value = true
                          oldserviceProviderList.value.txtProProposedBasis = serviceProviderList.value.txtProProposedBasis
                          oldserviceProviderList.value.txtProFeeType = serviceProviderList.value.txtProFeeType
                          oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
                          oldserviceProviderList.value.txtProProposedPercent = serviceProviderList.value.txtProProposedPercent
                        }
                      }
                    } else {
                      assignFeeValue('ProposedProfessional', 'dollar', serviceProviderList.value.txtProProposed, true)
                    }
                  }
                } else {
                  serviceProviderList.value.cboProSchedule = ''
                }
                readonlyProProposed.value = success.data.d.FeeScheduleID !== 0 ? true : false
                oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
                oldserviceProviderList.value.cboProSchedule = serviceProviderList.value.cboProSchedule
              } else {
                if (advisoryProposedFees.value.length > 0) {
                  var defaultAdvisoryFees = advisoryProposedFees.value.filter((a) => a.DefaultFeeSchedule === true)
                  if (defaultAdvisoryFees.length > 0) {
                    serviceProviderList.value.cboProSchedule = defaultAdvisoryFees[0]
                    serviceProviderList.value.txtProProposed = Number(parseFloat(defaultAdvisoryFees[0].Fee).toFixed(0))
                    getProSchedule(serviceProviderList.value.cboProSchedule, true)
                    oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
                    oldserviceProviderList.value.cboProSchedule = serviceProviderList.value.cboProSchedule
                  } else {
                    serviceProviderList.value.cboProSchedule = ''
                    serviceProviderList.value.txtProProposed = 0
                    oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
                    oldserviceProviderList.value.cboProSchedule = serviceProviderList.value.cboProSchedule
                  }
                }
              }
            } else {
              if (advisoryProposedFees.value.length > 0) {
                var defaultAdvisoryFee = advisoryProposedFees.value.filter((a) => a.DefaultFeeSchedule === true)
                if (defaultAdvisoryFee.length > 0) {
                  serviceProviderList.value.cboProSchedule = defaultAdvisoryFee[0]
                  serviceProviderList.value.txtProProposed = Number(parseFloat(defaultAdvisoryFee[0].Fee).toFixed(0))
                  getProSchedule(serviceProviderList.value.cboProSchedule, true)
                  oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
                  oldserviceProviderList.value.cboProSchedule = serviceProviderList.value.cboProSchedule
                } else {
                  serviceProviderList.value.cboProSchedule = ''
                  serviceProviderList.value.txtProProposed = 0
                  oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
                  oldserviceProviderList.value.cboProSchedule = serviceProviderList.value.cboProSchedule
                }
              }
            }

            //added here
            if (
              advisoryProposedFees.value.length > 0 &&
              serviceProviderList.value.cboProSchedule &&
              serviceProviderList.value.cboProSchedule.Name !== 'Enter Fees Manually'
            ) {
              var minProScheduleFee = serviceProviderList.value.cboProSchedule.MinimumFee
                ? serviceProviderList.value.cboProSchedule.MinimumFee
                : 0
              var maxProScheduleFee = serviceProviderList.value.cboProSchedule.MaximumFee
                ? serviceProviderList.value.cboProSchedule.MaximumFee
                : 0
              var feesProSchedule = serviceProviderList.value.cboProSchedule.Fee
                ? parseFloat(serviceProviderList.value.cboProSchedule.Fee)
                : 0
              if (minProScheduleFee > 0) {
                if (feesProSchedule <= minProScheduleFee) {
                  feesProSchedule = minProScheduleFee
                  feesAdjusted.value = true
                  professionalFeesAdjustedMessage.value =
                    'The Professional fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                }
              } else if (maxProScheduleFee > 0) {
                if (feesProSchedule > maxProScheduleFee) {
                  feesProSchedule = maxProScheduleFee
                  feesAdjusted.value = true
                  professionalFeesAdjustedMessage.value =
                    'The Professional fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                }
              }

              serviceProviderList.value.txtProProposed = Number(parseFloat(feesProSchedule).toFixed(0))
              oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
            }
            //upto here

            successProProposed.value = true
            loadServiceProvider()
          })
          .catch(() => {
            successProProposed.value = true
          })
      }
    }
    function getAdvisoryData() {
      if (proposalID.value > 0) {
        $axios
          .get(`/api/v1/tal/proposal/${proposalID.value}/fee/20`)
          .then((success) => {
            if (success.data.d !== null) {
              serviceProviderList.value.txtAdvisoryProposed = Number(parseFloat(success.data.d.sp_fees).toFixed(0))

              if (success.data.d.sp_fees > 0) {
                if (investmentProposedFees.value.length > 0) {
                  if (
                    $authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  ) {
                    serviceProviderList.value.cboAdvisorySchedule = investmentProposedFees.value.find((obj) => {
                      return obj.FeeScheduleID === 0
                    })
                    if (serviceProviderList.value.cboAdvisorySchedule && serviceProviderList.value.cboAdvisorySchedule.Fee)
                      serviceProviderList.value.txtAdvisoryProposed = Number(
                        parseFloat(serviceProviderList.value.cboAdvisorySchedule.Fee).toFixed(0)
                      )
                    getAdvisorySchedule(serviceProviderList.value.cboAdvisorySchedule, true)
                  } else {
                    if (success.data.d.FeeScheduleID) {
                      serviceProviderList.value.cboAdvisorySchedule = investmentProposedFees.value.find((obj) => {
                        return obj.FeeScheduleID === success.data.d.FeeScheduleID
                      })
                      if (serviceProviderList.value.cboAdvisorySchedule && serviceProviderList.value.cboAdvisorySchedule.Fee)
                        serviceProviderList.value.txtAdvisoryProposed = Number(
                          parseFloat(serviceProviderList.value.cboAdvisorySchedule.Fee).toFixed(0)
                        )
                      getAdvisorySchedule(serviceProviderList.value.cboAdvisorySchedule, true)
                    } else {
                      serviceProviderList.value.cboAdvisorySchedule = investmentProposedFees.value.find((obj) => {
                        return obj.Name === 'Enter Fees Manually'
                      })
                      assignFeeValue('ProposedAdvisory', 'dollar', serviceProviderList.value.txtAdvisoryProposed, true)
                    }
                  }
                } else {
                  serviceProviderList.value.cboAdvisorySchedule = ''
                }
                readonlyAdvisoryProposed.value = success.data.d.FeeScheduleID !== 0 ? true : false
                oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
                oldserviceProviderList.value.cboAdvisorySchedule = serviceProviderList.value.cboAdvisorySchedule
              } else {
                if (investmentProposedFees.value.length > 0) {
                  var defaultInvestmentFees = investmentProposedFees.value.filter((a) => a.DefaultFeeSchedule === true)
                  if (defaultInvestmentFees.length > 0) {
                    serviceProviderList.value.cboAdvisorySchedule = defaultInvestmentFees[0]
                    serviceProviderList.value.txtAdvisoryProposed = Number(parseFloat(defaultInvestmentFees[0].Fee).toFixed(0))
                    getAdvisorySchedule(serviceProviderList.value.cboAdvisorySchedule, true)
                    oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
                    oldserviceProviderList.value.cboAdvisorySchedule = serviceProviderList.value.cboAdvisorySchedule
                  }
                } else {
                  serviceProviderList.value.cboAdvisorySchedule = ''
                  serviceProviderList.value.txtAdvisoryProposed = 0
                  oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
                  oldserviceProviderList.value.cboAdvisorySchedule = serviceProviderList.value.cboAdvisorySchedule
                }
              }
            } else {
              if (investmentProposedFees.value.length > 0) {
                var defaultInvestmentFee = investmentProposedFees.value.filter((a) => a.DefaultFeeSchedule === true)
                if (defaultInvestmentFee.length > 0) {
                  serviceProviderList.value.cboAdvisorySchedule = defaultInvestmentFee[0]
                  serviceProviderList.value.txtAdvisoryProposed = Number(parseFloat(defaultInvestmentFee[0].Fee).toFixed(0))
                  getAdvisorySchedule(serviceProviderList.value.cboAdvisorySchedule, true)
                  oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
                  oldserviceProviderList.value.cboAdvisorySchedule = serviceProviderList.value.cboAdvisorySchedule
                }
              } else {
                serviceProviderList.value.cboAdvisorySchedule = ''
                serviceProviderList.value.txtAdvisoryProposed = 0
                oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
                oldserviceProviderList.value.cboAdvisorySchedule = serviceProviderList.value.cboAdvisorySchedule
              }
            }

            //added here
            if (
              investmentProposedFees.value.length > 0 &&
              serviceProviderList.value.cboAdvisorySchedule &&
              serviceProviderList.value.cboAdvisorySchedule.Name !== 'Enter Fees Manually'
            ) {
              var minAdvisoryScheduleFee = serviceProviderList.value.cboAdvisorySchedule.MinimumFee
                ? serviceProviderList.value.cboAdvisorySchedule.MinimumFee
                : 0
              var maxAdvisoryScheduleFee = serviceProviderList.value.cboAdvisorySchedule.MaximumFee
                ? serviceProviderList.value.cboAdvisorySchedule.MaximumFee
                : 0
              var feesAdvisorySchedule = serviceProviderList.value.cboAdvisorySchedule.Fee
                ? parseFloat(serviceProviderList.value.cboAdvisorySchedule.Fee)
                : 0
              if (minAdvisoryScheduleFee > 0) {
                if (feesAdvisorySchedule <= minAdvisoryScheduleFee) {
                  feesAdvisorySchedule = minAdvisoryScheduleFee
                  feesAdjusted.value = true
                  investmentFeesAdjustedMessage.value =
                    'The Investment Advisory fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                }
              } else if (maxAdvisoryScheduleFee > 0) {
                if (feesAdvisorySchedule > maxAdvisoryScheduleFee) {
                  feesAdvisorySchedule = maxAdvisoryScheduleFee
                  feesAdjusted.value = true
                  investmentFeesAdjustedMessage.value =
                    'The Investment Advisory fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                }
              }

              serviceProviderList.value.txtAdvisoryProposed = Number(parseFloat(feesAdvisorySchedule).toFixed(0))
              oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
            }
            //upto here

            successAdvisory.value = true
            loadServiceProvider()
          })
          .catch(() => {
            successAdvisory.value = true
          })
      }
    }
    function getRecordData() {
      if (proposalID.value > 0) {
        $axios
          .get(`/api/v1/tal/proposal/${proposalID.value}/fee/24`)
          .then((success) => {
            if (success.data.d !== null) {
              // For Managed Plan Fee selection is locked. Condition applies to Manual selection fee
              if (
                $authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
              ) {
                if (recordScheduleList.value.length > 0) {
                  let defaultRecordFee = recordScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                  if (defaultRecordFee.length > 0) {
                    serviceProviderList.value.cboRecordSchedule = defaultRecordFee[0]
                    serviceProviderList.value.txtRecordProposed = Number(parseFloat(defaultRecordFee[0].Fee).toFixed(0))
                    getRecordSchedule(serviceProviderList.value.cboRecordSchedule, true)
                    oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
                    oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
                  }
                } else {
                  serviceProviderList.value.cboRecordSchedule = ''
                  serviceProviderList.value.txtRecordProposed = 0
                  oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
                  oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
                }
              } else {
                serviceProviderList.value.txtRecordProposed = Number(parseFloat(success.data.d.sp_fees).toFixed(0))

                if (success.data.d.FeeScheduleID !== null && success.data.d.sp_fees > 0) {
                  if (recordScheduleList.value.length > 0) {
                    serviceProviderList.value.cboRecordSchedule = recordScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === success.data.d.FeeScheduleID
                    })
                    if (serviceProviderList.value.cboRecordSchedule && serviceProviderList.value.cboRecordSchedule.Fee)
                      serviceProviderList.value.txtRecordProposed = Number(
                        parseFloat(serviceProviderList.value.cboRecordSchedule.Fee).toFixed(0)
                      )
                    getRecordSchedule(serviceProviderList.value.cboRecordSchedule, true)
                  } else {
                    serviceProviderList.value.cboRecordSchedule = ''
                  }
                  oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
                  oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
                } else {
                  if (recordScheduleList.value.length > 0) {
                    var defaultRecordFees = recordScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                    if (defaultRecordFees.length > 0) {
                      serviceProviderList.value.cboRecordSchedule = defaultRecordFees[0]
                      serviceProviderList.value.txtRecordProposed = Number(parseFloat(defaultRecordFees[0].Fee).toFixed(0))
                      getRecordSchedule(serviceProviderList.value.cboRecordSchedule, true)
                      oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
                      oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
                    }
                  } else {
                    serviceProviderList.value.cboRecordSchedule = ''
                    serviceProviderList.value.txtRecordProposed = 0
                    oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
                    oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
                  }
                }
              }
            } else {
              if (recordScheduleList.value.length > 0) {
                var defaultRecordFee = recordScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                if (defaultRecordFee.length > 0) {
                  serviceProviderList.value.cboRecordSchedule = defaultRecordFee[0]
                  serviceProviderList.value.txtRecordProposed = Number(parseFloat(defaultRecordFee[0].Fee).toFixed(0))
                  getRecordSchedule(serviceProviderList.value.cboRecordSchedule, true)
                  oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
                  oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
                }
              } else {
                serviceProviderList.value.cboRecordSchedule = ''
                serviceProviderList.value.txtRecordProposed = 0
                oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
                oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
              }
            }

            //added here
            if (recordScheduleList.value.length > 0 && serviceProviderList.value.cboRecordSchedule) {
              var minRecordScheduleFee = serviceProviderList.value.cboRecordSchedule.MinimumFee
                ? serviceProviderList.value.cboRecordSchedule.MinimumFee
                : 0
              var maxRecordScheduleFee = serviceProviderList.value.cboRecordSchedule.MaximumFee
                ? serviceProviderList.value.cboRecordSchedule.MaximumFee
                : 0
              var feesRecordSchedule = serviceProviderList.value.cboRecordSchedule.Fee
                ? parseFloat(serviceProviderList.value.cboRecordSchedule.Fee)
                : 0
              if (minRecordScheduleFee > 0) {
                if (feesRecordSchedule <= minRecordScheduleFee) {
                  feesRecordSchedule = minRecordScheduleFee
                  feesAdjusted.value = true
                  recordkeepingFeesAdjustedMessage.value =
                    'The Recordkeeping fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                }
              } else if (maxRecordScheduleFee > 0) {
                if (feesRecordSchedule > maxRecordScheduleFee) {
                  feesRecordSchedule = maxRecordScheduleFee
                  feesAdjusted.value = true
                  recordkeepingFeesAdjustedMessage.value =
                    'The Recordkeeping fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                }
              }

              serviceProviderList.value.txtRecordProposed = Number(parseFloat(feesRecordSchedule).toFixed(0))
              oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
            }
            //upto here

            successRecord.value = true
            loadServiceProvider()
          })
          .catch(() => {
            successRecord.value = true
          })
      }
    }
    function getAdminScheduleData() {
      if (proposalID.value > 0) {
        $axios
          .get(`/api/v1/tal/proposal/${proposalID.value}/fee/12`)
          .then((success) => {
            if (success.data.d !== null) {
              // For Managed Plan Admin Fee selection is allowed. but cannot enter manual fee
              if (
                $authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
              ) {
                if (success.data.d.FeeScheduleID !== 0) {
                  if (adminScheduleList.value.length > 0) {
                    serviceProviderList.value.cboAdminSchedule = adminScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === success.data.d.FeeScheduleID
                    })
                    if (serviceProviderList.value.cboAdminSchedule && serviceProviderList.value.cboAdminSchedule.Fee)
                      serviceProviderList.value.txtAdminProposed = Number(
                        parseFloat(serviceProviderList.value.cboAdminSchedule.Fee).toFixed(0)
                      )
                    getAdminSchedule(serviceProviderList.value.cboAdminSchedule, true)
                  } else {
                    serviceProviderList.value.cboAdminSchedule = ''
                  }
                  readonlyAdminProposed.value = success.data.d.FeeScheduleID !== 0 ? true : false
                  oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                  oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
                } else {
                  if (adminScheduleList.value.length > 0) {
                    let defaultAdminFees = adminScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                    if (defaultAdminFees.length > 0) {
                      serviceProviderList.value.cboAdminSchedule = defaultAdminFees[0]
                      serviceProviderList.value.txtAdminProposed = Number(parseFloat(defaultAdminFees[0].Fee).toFixed(0))
                      getAdminSchedule(serviceProviderList.value.cboAdminSchedule, true)
                      oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                      oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
                    }
                  } else {
                    serviceProviderList.value.cboAdminSchedule = ''
                    serviceProviderList.value.txtAdminProposed = 0
                    oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                    oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
                  }
                }
              } else {
                serviceProviderList.value.txtAdminProposed = Number(parseFloat(success.data.d.sp_fees).toFixed(0))

                if (success.data.d.sp_fees > 0) {
                  if (adminScheduleList.value.length > 0) {
                    if (success.data.d.FeeScheduleID) {
                      serviceProviderList.value.cboAdminSchedule = adminScheduleList.value.find((obj) => {
                        return obj.FeeScheduleID === success.data.d.FeeScheduleID
                      })
                      if (serviceProviderList.value.cboAdminSchedule && serviceProviderList.value.cboAdminSchedule.Fee)
                        serviceProviderList.value.txtAdminProposed = Number(
                          parseFloat(serviceProviderList.value.cboAdminSchedule.Fee).toFixed(0)
                        )
                      getAdminSchedule(serviceProviderList.value.cboAdminSchedule, true)
                    } else {
                      serviceProviderList.value.cboAdminSchedule = adminScheduleList.value.find((obj) => {
                        return obj.Name === 'Enter Fees Manually'
                      })
                      assignFeeValue('ProposedAdmin', 'dollar', serviceProviderList.value.txtAdminProposed, true)
                    }
                  } else {
                    serviceProviderList.value.cboAdminSchedule = ''
                  }
                  readonlyAdminProposed.value = success.data.d.FeeScheduleID !== 0 ? true : false
                  oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                  oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
                } else {
                  if (adminScheduleList.value.length > 0) {
                    var defaultAdminFees = adminScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                    if (defaultAdminFees.length > 0) {
                      serviceProviderList.value.cboAdminSchedule = defaultAdminFees[0]
                      serviceProviderList.value.txtAdminProposed = Number(parseFloat(defaultAdminFees[0].Fee).toFixed(0))
                      getAdminSchedule(serviceProviderList.value.cboAdminSchedule, true)
                      oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                      oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
                    }
                  } else {
                    serviceProviderList.value.cboAdminSchedule = ''
                    serviceProviderList.value.txtAdminProposed = 0
                    oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                    oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
                  }
                }
              }
            } else {
              if (adminScheduleList.value.length > 0) {
                var defaultAdminFee = adminScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                if (defaultAdminFee.length > 0) {
                  serviceProviderList.value.cboAdminSchedule = defaultAdminFee[0]
                  serviceProviderList.value.txtAdminProposed = Number(parseFloat(defaultAdminFee[0].Fee).toFixed(0))
                  getAdminSchedule(serviceProviderList.value.cboAdminSchedule, true)
                  oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                  oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
                }
              } else {
                serviceProviderList.value.cboAdminSchedule = ''
                serviceProviderList.value.txtAdminProposed = 0
                oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
                oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
              }
            }
            //added here
            if (
              adminScheduleList.value.length > 0 &&
              serviceProviderList.value.cboAdminSchedule &&
              serviceProviderList.value.cboAdminSchedule.Name !== 'Enter Fees Manually'
            ) {
              var minFee = serviceProviderList.value.cboAdminSchedule.MinimumFee
                ? serviceProviderList.value.cboAdminSchedule.MinimumFee
                : 0
              var maxFee = serviceProviderList.value.cboAdminSchedule.MaximumFee
                ? serviceProviderList.value.cboAdminSchedule.MaximumFee
                : 0
              var feesAdminSchedule = serviceProviderList.value.cboAdminSchedule.Fee
                ? parseFloat(serviceProviderList.value.cboAdminSchedule.Fee)
                : 0
              if (minFee > 0) {
                if (feesAdminSchedule <= minFee) {
                  feesAdminSchedule = minFee
                  feesAdjusted.value = true
                  adminFeesAdjustedMessage.value =
                    'The Administration fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                }
              } else if (maxFee > 0) {
                if (feesAdminSchedule > maxFee) {
                  feesAdminSchedule = maxFee
                  feesAdjusted.value = true
                  adminFeesAdjustedMessage.value =
                    'The Administration fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                }
              }

              serviceProviderList.value.txtAdminProposed = Number(parseFloat(feesAdminSchedule).toFixed(0))
              oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
            }
            //upto here

            successAdminSchedule.value = true
            loadServiceProvider()
          })
          .catch(() => {
            successAdminSchedule.value = true
          })
      }
    }
    function getCustodianData() {
      if (proposalID.value > 0) {
        $axios
          .get(`/api/v1/tal/proposal/${proposalID.value}/fee/18`)
          .then((success) => {
            if (success.data.d !== null) {
              // For Managed Plan Fee selection is locked. Condition applies to Manual selection fee
              if (
                $authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
              ) {
                if (custodianScheduleList.value.length > 0) {
                  var defaultCustodianFee = custodianScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                  if (defaultCustodianFee.length > 0) {
                    serviceProviderList.value.cboCustodianSchedule = defaultCustodianFee[0]
                    serviceProviderList.value.txtCustodianProposed = Number(parseFloat(defaultCustodianFee[0].Fee).toFixed(0))
                    getCustodianSchedule(serviceProviderList.value.cboCustodianSchedule, true)
                    oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                    oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
                  }
                } else {
                  serviceProviderList.value.cboCustodianSchedule = ''
                  serviceProviderList.value.txtCustodianProposed = 0
                  oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                  oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
                }
              } else {
                serviceProviderList.value.txtCustodianProposed = Number(parseFloat(success.data.d.sp_fees).toFixed(0))

                if (success.data.d.FeeScheduleID !== null && success.data.d.sp_fees > 0) {
                  if (custodianScheduleList.value.length > 0) {
                    serviceProviderList.value.cboCustodianSchedule = custodianScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === success.data.d.FeeScheduleID
                    })
                    if (serviceProviderList.value.cboCustodianSchedule && serviceProviderList.value.cboCustodianSchedule.Fee)
                      serviceProviderList.value.txtCustodianProposed = Number(
                        parseFloat(serviceProviderList.value.cboCustodianSchedule.Fee).toFixed(0)
                      )
                    getCustodianSchedule(serviceProviderList.value.cboCustodianSchedule, true)
                  } else {
                    serviceProviderList.value.cboCustodianSchedule = ''
                  }
                  oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                  oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
                } else {
                  if (custodianScheduleList.value.length > 0) {
                    var defaultCustodianFees = custodianScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                    if (defaultCustodianFees.length > 0) {
                      serviceProviderList.value.cboCustodianSchedule = defaultCustodianFees[0]
                      serviceProviderList.value.txtCustodianProposed = Number(parseFloat(defaultCustodianFees[0].Fee).toFixed(0))
                      getCustodianSchedule(serviceProviderList.value.cboCustodianSchedule, true)
                      oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                      oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
                    }
                  } else {
                    serviceProviderList.value.cboCustodianSchedule = ''
                    serviceProviderList.value.txtCustodianProposed = 0
                    oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                    oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
                  }
                }
              }
            } else {
              if (custodianScheduleList.value.length > 0) {
                let defaultCustodianFee = custodianScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                if (defaultCustodianFee.length > 0) {
                  serviceProviderList.value.cboCustodianSchedule = defaultCustodianFee[0]
                  serviceProviderList.value.txtCustodianProposed = Number(parseFloat(defaultCustodianFee[0].Fee).toFixed(0))
                  getCustodianSchedule(serviceProviderList.value.cboCustodianSchedule, true)
                  oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                  oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
                }
              } else {
                serviceProviderList.value.cboCustodianSchedule = ''
                serviceProviderList.value.txtCustodianProposed = 0
                oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
              }
            }
            loadEtfTrusteeCustodianfees(true)
            //added here
            if (custodianScheduleList.value.length > 0 && serviceProviderList.value.cboCustodianSchedule) {
              var minCustodianScheduleFee = serviceProviderList.value.cboCustodianSchedule.MinimumFee
                ? serviceProviderList.value.cboCustodianSchedule.MinimumFee
                : 0
              var maxCustodianScheduleFee = serviceProviderList.value.cboCustodianSchedule.MaximumFee
                ? serviceProviderList.value.cboCustodianSchedule.MaximumFee
                : 0
              var feesCustodianSchedule = serviceProviderList.value.cboCustodianSchedule.Fee
                ? parseFloat(serviceProviderList.value.cboCustodianSchedule.Fee)
                : 0
              if (minCustodianScheduleFee > 0) {
                if (feesCustodianSchedule <= minCustodianScheduleFee) {
                  feesCustodianSchedule = minCustodianScheduleFee
                  feesAdjusted.value = true
                  custodianFeesAdjustedMessage.value =
                    'The Trustee / Custodian fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                }
              } else if (maxCustodianScheduleFee > 0) {
                if (feesCustodianSchedule > maxCustodianScheduleFee) {
                  feesCustodianSchedule = maxCustodianScheduleFee
                  feesAdjusted.value = true
                  custodianFeesAdjustedMessage.value =
                    'The Trustee / Custodian fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                }
              }

              serviceProviderList.value.txtCustodianProposed = Number(parseFloat(feesCustodianSchedule).toFixed(0))
              oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
            }
            //upto here

            successCustodian.value = true
            loadServiceProvider()
          })
          .catch(() => {
            successCustodian.value = true
          })
      }
    }
    function loadProposalSchedules() {
      $axios
        .get(`/api/v1/rpea/plan/${props.planId}/feeschedule/Recordkeeping?seinpno=${props.SEINPNO}&activeOnly=true`)
        .then((success) => {
          recordScheduleList.value = []
          if (success.data.d !== null && success.data.d !== undefined && success.data.d.length > 0) {
            recordScheduleList.value = success.data.d.length > 0 ? success.data.d : []
          }
          getRecordData()
        })

      $axios
        .get(
          `/api/v1/rpea/plan/${props.planId}/feeschedule/custodian?seinpno=${props.SEINPNO}&totalAssets=${totalAssets.value}&totalParticipants=${totalParticipant.value}&activeOnly=true`
        )
        .then((success) => {
          custodianScheduleList.value = []
          if (success.data.d !== null && success.data.d !== undefined && success.data.d.length > 0) {
            custodianScheduleList.value = success.data.d.length > 0 ? success.data.d : []
          }
          getCustodianData()
        })
      loadAdvisoryFeeList(true)
      loadAdministrationFeeList(true)
      loadInvestmentFeeList(true)
      loadOtherFeeList(true)
    }
    function loadAdvisoryFeeList(val) {
      $axios
        .get(`/api/v1/rpea/plan/${props.planId}/feeschedule/Advisory?seinpno=${props.SEINPNO}&activeOnly=true`)
        .then((success) => {
          advisoryProposedFees.value = []
          if (success.data.d !== null && success.data.d !== undefined && success.data.d.length > 0) {
            advisoryProposedFees.value = success.data.d.length > 0 ? success.data.d : []
          }
          advisoryProposedFees.value.unshift({
            Name: 'Enter Fees Manually',
            FeeScheduleID: 0,
            Fee: 0,
            DefaultFeeSchedule: false
          })
          if (val === true) {
            getProfessionalData()
          }
        })
    }
    function loadAdministrationFeeList(val) {
      $axios
        .get(`/api/v1/rpea/plan/${props.planId}/feeschedule/Administration?seinpno=${props.SEINPNO}&activeOnly=true`)
        .then((success) => {
          adminScheduleList.value = []
          if (success.data.d !== null && success.data.d !== undefined && success.data.d.length > 0) {
            adminScheduleList.value = success.data.d.length > 0 ? success.data.d : []
          }
          if (
            !$authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            adminScheduleList.value.unshift({
              Name: 'Enter Fees Manually',
              FeeScheduleID: 0,
              Fee: 0,
              DefaultFeeSchedule: false
            })
          }
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            adminScheduleList.value.unshift({
              Name: 'Priced Separately',
              FeeScheduleID: -1,
              Fee: 0,
              DefaultFeeSchedule: false
            })
          }

          if (val === true) getAdminScheduleData()
        })
    }
    function loadInvestmentFeeList(val) {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        $axios.get(`/api/v1/managedplan/${totalAssets.value}/serviceproviderfee`).then((success) => {
          investmentProposedFees.value = []
          if (success.data.d !== null && success.data.d.length > 0) {
            var investmentFees = {
              Name: success.data.d[0].ServiceProvider,
              FeeScheduleID: 0,
              Fee: success.data.d[0].CostDollar,
              DefaultFeeSchedule: true
            }
            investmentProposedFees.value.push(investmentFees)
            if (val === true) getAdvisoryData()
          }
        })
      } else {
        $axios
          .get(`/api/v1/rpea/plan/${props.planId}/feeschedule/Investment?seinpno=${props.SEINPNO}&activeOnly=true`)
          .then((success) => {
            investmentProposedFees.value = []
            if (success.data.d !== null && success.data.d !== undefined && success.data.d.length > 0) {
              investmentProposedFees.value = success.data.d.length > 0 ? success.data.d : []
            }
            investmentProposedFees.value.unshift({
              Name: 'Enter Fees Manually',
              FeeScheduleID: 0,
              Fee: 0,
              DefaultFeeSchedule: false
            })
            if (val === true) getAdvisoryData()
          })
      }
    }
    function loadOtherFeeList(val) {
      $axios
        .get(`/api/v1/rpea/plan/${props.planId}/feeschedule/Other?seinpno=${props.SEINPNO}&activeOnly=true`)
        .then((success) => {
          otherProposedFees.value = []
          if (success.data.d !== null && success.data.d !== undefined && success.data.d.length > 0) {
            otherProposedFees.value = success.data.d.length > 0 ? success.data.d : []
          }
          otherProposedFees.value.unshift({
            Name: 'Enter Fees Manually',
            FeeScheduleID: 0,
            Fee: 0,
            DefaultFeeSchedule: false
          })
          if (val === true) getOtherData()
        })
    }
    function LoadSchedules() {
      getProposalID()
      load5500()
    }
    function loadProposedFeeList() {
      $axios
        .get(`/api/v1/rpea/plan/${props.planId}/feeschedule/Other?seinpno=${props.SEINPNO}&activeOnly=true`)
        .then((success) => {
          scheduleFees.value = []
          if (success.data.d !== null && success.data.d !== undefined && success.data.d.length > 0) {
            scheduleFees.value = success.data.d.length > 0 ? success.data.d : []
          }
          scheduleFees.value.unshift({
            Name: 'Enter Fees Manually',
            FeeScheduleID: 0,
            Fee: 0,
            DefaultFeeSchedule: false
          })
          if (loadType.value === 'load') {
            loadProposedFees()
            loadOffsets()
            loadOverForm()
          } else if (loadType.value === 'load1') {
            loadProposedFees()
            loadOverForm()
          }
        })
    }
    function enableSelectedFeeType(val, type) {
      if (type === 'Accounting') {
        if (val === 1) {
          disableCostBasis.value = false
          disableCostDollar.value = true
          disableCostPercent.value = true
          serviceProviderList.value.txtCostsProposedBasis = 0
          serviceProviderList.value.txtCostsProposedPercent = 0
          serviceProviderList.value.txtCostsProposed = 0
        } else if (val === 2) {
          disableCostBasis.value = true
          disableCostDollar.value = false
          disableCostPercent.value = true
          serviceProviderList.value.txtCostsProposedBasis = 0
          serviceProviderList.value.txtCostsProposedPercent = 0
          serviceProviderList.value.txtCostsProposed = 0
        } else if (val === 3) {
          disableCostBasis.value = true
          disableCostDollar.value = true
          disableCostPercent.value = false
          serviceProviderList.value.txtCostsProposedBasis = 0
          serviceProviderList.value.txtCostsProposedPercent = 0
          serviceProviderList.value.txtCostsProposed = 0
        }
      } else if (type === 'Administration') {
        if (val === 1) {
          disableAdminProposedBasis.value = false
          disableAdminProposed.value = true
          disableAdminProposedPercent.value = true
          serviceProviderList.value.txtAdminProposedBasis = 0
          serviceProviderList.value.txtAdminProposedPercent = 0
          serviceProviderList.value.txtAdminProposed = 0
        } else if (val === 2) {
          disableAdminProposedBasis.value = true
          disableAdminProposed.value = false
          disableAdminProposedPercent.value = true
          serviceProviderList.value.txtAdminProposedBasis = 0
          serviceProviderList.value.txtAdminProposedPercent = 0
          serviceProviderList.value.txtAdminProposed = 0
        } else if (val === 3) {
          disableAdminProposedBasis.value = true
          disableAdminProposed.value = true
          disableAdminProposedPercent.value = false
          serviceProviderList.value.txtAdminProposedBasis = 0
          serviceProviderList.value.txtAdminProposedPercent = 0
          serviceProviderList.value.txtAdminProposed = 0
        }
      } else if (type === 'Advisory') {
        if (val === 1) {
          disableAdvisoryProposedBasis.value = false
          disableAdvisoryProposed.value = true
          disableAdvisoryProposedPercent.value = true
          serviceProviderList.value.txtAdvisoryProposedBasis = 0
          serviceProviderList.value.txtAdvisoryProposedPercent = 0
          serviceProviderList.value.txtAdvisoryProposed = 0
        } else if (val === 2) {
          disableAdvisoryProposedBasis.value = true
          disableAdvisoryProposed.value = false
          disableAdvisoryProposedPercent.value = true
          serviceProviderList.value.txtAdvisoryProposedBasis = 0
          serviceProviderList.value.txtAdvisoryProposedPercent = 0
          serviceProviderList.value.txtAdvisoryProposed = 0
        } else if (val === 3) {
          disableAdvisoryProposedBasis.value = true
          disableAdvisoryProposed.value = true
          disableAdvisoryProposedPercent.value = false
          serviceProviderList.value.txtAdvisoryProposedBasis = 0
          serviceProviderList.value.txtAdvisoryProposedPercent = 0
          serviceProviderList.value.txtAdvisoryProposed = 0
        }
      } else if (type === 'Professional') {
        if (val === 1) {
          disableProProposedBasis.value = false
          disableProProposed.value = true
          disableProProposedPercent.value = true
          serviceProviderList.value.txtProProposedBasis = 0
          serviceProviderList.value.txtProProposedPercent = 0
          serviceProviderList.value.txtProProposed = 0
        } else if (val === 2) {
          disableProProposedBasis.value = true
          disableProProposed.value = false
          disableProProposedPercent.value = true
          serviceProviderList.value.txtProProposedBasis = 0
          serviceProviderList.value.txtProProposedPercent = 0
          serviceProviderList.value.txtProProposed = 0
        } else if (val === 3) {
          disableProProposedBasis.value = true
          disableProProposed.value = true
          disableProProposedPercent.value = false
          serviceProviderList.value.txtProProposedBasis = 0
          serviceProviderList.value.txtProProposedPercent = 0
          serviceProviderList.value.txtProProposed = 0
        }
      } else if (type === 'Other') {
        if (val === 1) {
          disableOtherProposedBasis.value = false
          disableOtherProposed.value = true
          disableOtherProposedPercent.value = true
          serviceProviderList.value.txtOtherProposedBasis = 0
          serviceProviderList.value.txtOtherProposedPercent = 0
          serviceProviderList.value.txtOtherProposed = 0
        } else if (val === 2) {
          disableOtherProposedBasis.value = true
          disableOtherProposed.value = false
          disableOtherProposedPercent.value = true
          serviceProviderList.value.txtOtherProposedBasis = 0
          serviceProviderList.value.txtOtherProposedPercent = 0
          serviceProviderList.value.txtOtherProposed = 0
        } else if (val === 3) {
          disableOtherProposedBasis.value = true
          disableOtherProposed.value = true
          disableOtherProposedPercent.value = false
          serviceProviderList.value.txtOtherProposedBasis = 0
          serviceProviderList.value.txtOtherProposedPercent = 0
          serviceProviderList.value.txtOtherProposed = 0
        }
      }
    }
    function getCostSchedule(fees, assign) {
      if (fees && fees.Name !== 'Enter Fees Manually') {
        readonlyCostsProposed.value = true
        var minCostsProposedFee = fees.MinimumFee ? fees.MinimumFee : 0
        var maxCostsProposedFee = fees.MaximumFee ? fees.MaximumFee : 0
        var feesCostsProposedSchedule = fees.Fee ? parseFloat(fees.Fee) : 0
        if (minCostsProposedFee > 0) {
          if (feesCostsProposedSchedule <= minCostsProposedFee) {
            feesCostsProposedSchedule = minCostsProposedFee
            feesAdjusted.value = true
            accountingFeesAdjustedMessage.value =
              'The Accounting fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
          }
        } else if (maxCostsProposedFee > 0) {
          if (feesCostsProposedSchedule > maxCostsProposedFee) {
            feesCostsProposedSchedule = maxCostsProposedFee
            feesAdjusted.value = true
            accountingFeesAdjustedMessage.value =
              'The Accounting fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
          } else {
            feesAdjusted.value = false
            accountingFeesAdjustedMessage.value = ''
          }
        } else {
          feesAdjusted.value = false
          accountingFeesAdjustedMessage.value = ''
        }
        serviceProviderList.value.txtCostsFeeType = 4
        disableCostFeeType.value = true
        disableCostBasis.value = true
        disableCostDollar.value = true
        disableCostPercent.value = true
        serviceProviderList.value.txtCostsProposed = Number(parseFloat(feesCostsProposedSchedule).toFixed(0))
        if (serviceProviderList.value.txtCostsProposed !== 0) {
          serviceProviderList.value.txtCostsProposedPercent = parseFloat(
            (serviceProviderList.value.txtCostsProposed / totalAssets.value) * 100
          ).toFixed(2)

          serviceProviderList.value.txtCostsProposedBasis = toFixed(
            (serviceProviderList.value.txtCostsProposed / totalAssets.value) * 10000
          )
        } else {
          serviceProviderList.value.txtCostsProposedBasis = 0
          serviceProviderList.value.txtCostsProposedPercent = 0
        }
        if (assign) {
          oldserviceProviderList.value.txtCostsProposedBasis = serviceProviderList.value.txtCostsProposedBasis
          oldserviceProviderList.value.txtCostsFeeType = serviceProviderList.value.txtCostsFeeType
          oldserviceProviderList.value.txtCostsProposedPercent = serviceProviderList.value.txtCostsProposedPercent
        }
      } else {
        readonlyCostsProposed.value = false
        serviceProviderList.value.txtCostsProposed = 0
        serviceProviderList.value.txtCostsProposedBasis = 0
        serviceProviderList.value.txtCostsProposedPercent = 0
        serviceProviderList.value.txtCostsFeeType = ''
        disableCostFeeType.value = false
        disableCostBasis.value = false
        disableCostDollar.value = false
        disableCostPercent.value = false
      }
    }
    function getAdvisorySchedule(fees, assign) {
      if (fees && fees.Name !== 'Enter Fees Manually') {
        readonlyAdvisoryProposed.value = true
        var minAdvisoryProposedFee = fees.MinimumFee ? fees.MinimumFee : 0
        var maxAdvisoryProposedFee = fees.MaximumFee ? fees.MaximumFee : 0
        var feesAdvisoryProposedSchedule = fees.Fee ? parseFloat(fees.Fee) : 0
        if (minAdvisoryProposedFee > 0) {
          if (feesAdvisoryProposedSchedule <= minAdvisoryProposedFee) {
            feesAdvisoryProposedSchedule = minAdvisoryProposedFee
            feesAdjusted.value = true
            investmentFeesAdjustedMessage.value =
              'The Investment Advisory fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
          }
        } else if (maxAdvisoryProposedFee > 0) {
          if (feesAdvisoryProposedSchedule > maxAdvisoryProposedFee) {
            feesAdvisoryProposedSchedule = maxAdvisoryProposedFee
            feesAdjusted.value = true
            investmentFeesAdjustedMessage.value =
              'The Investment Advisory fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
          } else {
            feesAdjusted.value = false
            investmentFeesAdjustedMessage.value = ''
          }
        } else {
          feesAdjusted.value = false
          investmentFeesAdjustedMessage.value = ''
        }
        serviceProviderList.value.txtAdvisoryFeeType = 4
        disableAdvisoryFeeType.value = true
        disableAdvisoryProposedBasis.value = true
        disableAdvisoryProposed.value = true
        disableAdvisoryProposedPercent.value = true
        serviceProviderList.value.txtAdvisoryProposed = Number(parseFloat(feesAdvisoryProposedSchedule).toFixed(0))
        if (serviceProviderList.value.txtAdvisoryProposed !== 0) {
          serviceProviderList.value.txtAdvisoryProposedPercent = parseFloat(
            (serviceProviderList.value.txtAdvisoryProposed / totalAssets.value) * 100
          ).toFixed(2)
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            serviceProviderList.value.txtAdvisoryProposedBasis = Math.round(
              (serviceProviderList.value.txtAdvisoryProposed / totalAssets.value) * 10000
            )
          } else {
            serviceProviderList.value.txtAdvisoryProposedBasis = toFixed(
              (serviceProviderList.value.txtAdvisoryProposed / totalAssets.value) * 10000
            )
          }
        } else {
          serviceProviderList.value.txtAdvisoryProposedBasis = 0
          serviceProviderList.value.txtAdvisoryProposedPercent = 0
        }
        if (assign) {
          oldserviceProviderList.value.txtAdvisoryFeeType = serviceProviderList.value.txtAdvisoryFeeType
          oldserviceProviderList.value.txtAdvisoryProposedBasis = serviceProviderList.value.txtAdvisoryProposedBasis
          oldserviceProviderList.value.txtAdvisoryProposedPercent = serviceProviderList.value.txtAdvisoryProposedPercent
        }
      } else {
        readonlyAdvisoryProposed.value = false
        serviceProviderList.value.txtAdvisoryProposed = 0
        serviceProviderList.value.txtAdvisoryProposedBasis = 0
        serviceProviderList.value.txtAdvisoryProposedPercent = 0
        serviceProviderList.value.txtAdvisoryFeeType = ''
        disableAdvisoryFeeType.value = false
        disableAdvisoryProposedBasis.value = false
        disableAdvisoryProposed.value = false
        disableAdvisoryProposedPercent.value = false
      }
    }
    function getAdminSchedule(fees, assign) {
      if (fees && fees.Name !== 'Enter Fees Manually') {
        readonlyAdminProposed.value = true
        var minAdminProposedFee = fees.MinimumFee ? fees.MinimumFee : 0
        var maxAdminProposedFee = fees.MaximumFee ? fees.MaximumFee : 0
        var feesAdminProposedSchedule = fees.Fee ? parseFloat(fees.Fee) : 0
        if (minAdminProposedFee > 0) {
          if (feesAdminProposedSchedule <= minAdminProposedFee) {
            feesAdminProposedSchedule = minAdminProposedFee
            feesAdjusted.value = true
            adminFeesAdjustedMessage.value =
              'The Administration fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
          }
        } else if (maxAdminProposedFee > 0) {
          if (feesAdminProposedSchedule > maxAdminProposedFee) {
            feesAdminProposedSchedule = maxAdminProposedFee
            feesAdjusted.value = true
            adminFeesAdjustedMessage.value =
              'The Administration fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
          } else {
            feesAdjusted.value = false
            adminFeesAdjustedMessage.value = ''
          }
        } else {
          feesAdjusted.value = false
          adminFeesAdjustedMessage.value = ''
        }
        serviceProviderList.value.txtAdminFeeType = 4
        disableAdminFeeType.value = true
        disableAdminProposedBasis.value = true
        disableAdminProposed.value = true
        disableAdminProposedPercent.value = true
        serviceProviderList.value.txtAdminProposed = Number(parseFloat(feesAdminProposedSchedule).toFixed(0))
        if (serviceProviderList.value.txtAdminProposed !== 0) {
          serviceProviderList.value.txtAdminProposedPercent = parseFloat(
            (serviceProviderList.value.txtAdminProposed / totalAssets.value) * 100
          ).toFixed(2)

          serviceProviderList.value.txtAdminProposedBasis = toFixed(
            (serviceProviderList.value.txtAdminProposed / totalAssets.value) * 10000
          )
        } else {
          serviceProviderList.value.txtAdminProposedBasis = 0
          serviceProviderList.value.txtAdminProposedPercent = 0
        }
        if (assign) {
          oldserviceProviderList.value.txtAdminFeeType = serviceProviderList.value.txtAdminFeeType
          oldserviceProviderList.value.txtAdminProposedBasis = serviceProviderList.value.txtAdminProposedBasis
          oldserviceProviderList.value.txtAdminProposedPercent = serviceProviderList.value.txtAdminProposedPercent
        }
      } else {
        readonlyAdminProposed.value = false
        serviceProviderList.value.txtAdminProposed = 0
        serviceProviderList.value.txtAdminProposedBasis = 0
        serviceProviderList.value.txtAdminProposedPercent = 0
        serviceProviderList.value.txtAdminFeeType = ''
        disableAdminFeeType.value = false
        disableAdminProposedBasis.value = false
        disableAdminProposed.value = false
        disableAdminProposedPercent.value = false
      }
    }
    function getProSchedule(fees, assign) {
      if (fees && fees.Name !== 'Enter Fees Manually') {
        readonlyProProposed.value = true
        var minProProposedFee = fees.MinimumFee ? fees.MinimumFee : 0
        var maxProProposedFee = fees.MaximumFee ? fees.MaximumFee : 0
        var feesProProposedSchedule = fees.Fee ? parseFloat(fees.Fee) : 0
        if (minProProposedFee > 0) {
          if (feesProProposedSchedule <= minProProposedFee) {
            feesProProposedSchedule = minProProposedFee
            feesAdjusted.value = true
            professionalFeesAdjustedMessage.value =
              'The Professional fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
          }
        } else if (maxProProposedFee > 0) {
          if (feesProProposedSchedule > maxProProposedFee) {
            feesProProposedSchedule = maxProProposedFee
            feesAdjusted.value = true
            professionalFeesAdjustedMessage.value =
              'The Professional fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
          } else {
            feesAdjusted.value = false
            professionalFeesAdjustedMessage.value = ''
          }
        } else {
          feesAdjusted.value = false
          professionalFeesAdjustedMessage.value = ''
        }
        serviceProviderList.value.txtProFeeType = 4
        disableProFeeType.value = true
        disableProProposedBasis.value = true
        disableProProposed.value = true
        disableProProposedPercent.value = true
        serviceProviderList.value.txtProProposed = Number(parseFloat(feesProProposedSchedule).toFixed(0))
        if (serviceProviderList.value.txtProProposed !== 0) {
          serviceProviderList.value.txtProProposedPercent = parseFloat(
            (serviceProviderList.value.txtProProposed / totalAssets.value) * 100
          ).toFixed(2)

          serviceProviderList.value.txtProProposedBasis = toFixed(
            (serviceProviderList.value.txtProProposed / totalAssets.value) * 10000
          )
        } else {
          serviceProviderList.value.txtProProposedBasis = 0
          serviceProviderList.value.txtProProposedPercent = 0
        }
        if (assign) {
          oldserviceProviderList.value.txtProFeeType = serviceProviderList.value.txtProFeeType
          oldserviceProviderList.value.txtProProposedBasis = serviceProviderList.value.txtProProposedBasis
          oldserviceProviderList.value.txtProProposedPercent = serviceProviderList.value.txtProProposedPercent
        }
      } else {
        readonlyProProposed.value = false
        serviceProviderList.value.txtProProposed = 0
        serviceProviderList.value.txtProProposedBasis = 0
        serviceProviderList.value.txtProProposedPercent = 0
        serviceProviderList.value.txtProFeeType = ''
        disableProFeeType.value = false
        disableProProposedBasis.value = false
        disableProProposed.value = false
        disableProProposedPercent.value = false
      }
    }
    function getRecordSchedule(fees, assign) {
      if (fees) {
        var minRecordProposedFee = fees.MinimumFee ? fees.MinimumFee : 0
        var maxRecordProposedFee = fees.MaximumFee ? fees.MaximumFee : 0
        var feesRecordProposedSchedule = fees.Fee ? parseFloat(fees.Fee) : 0
        if (minRecordProposedFee > 0) {
          if (feesRecordProposedSchedule <= minRecordProposedFee) {
            feesRecordProposedSchedule = minRecordProposedFee
            feesAdjusted.value = true
            recordkeepingFeesAdjustedMessage.value =
              'The Recordkeeping fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
          }
        } else if (maxRecordProposedFee > 0) {
          if (feesRecordProposedSchedule > maxRecordProposedFee) {
            feesRecordProposedSchedule = maxRecordProposedFee
            feesAdjusted.value = true
            recordkeepingFeesAdjustedMessage.value =
              'The Recordkeeping fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
          } else {
            feesAdjusted.value = false
            recordkeepingFeesAdjustedMessage.value = ''
          }
        } else {
          feesAdjusted.value = false
          recordkeepingFeesAdjustedMessage.value = ''
        }
        serviceProviderList.value.txtRecordFeeType = 4
        disableRecordFeeType.value = true
        disableRecordProposedBasis.value = true
        disableRecordProposed.value = true
        disableRecordProposedPercent.value = true
        serviceProviderList.value.txtRecordProposed = Number(parseFloat(feesRecordProposedSchedule).toFixed(0))
        if (serviceProviderList.value.txtRecordProposed !== 0) {
          serviceProviderList.value.txtRecordProposedPercent = parseFloat(
            (serviceProviderList.value.txtRecordProposed / totalAssets.value) * 100
          ).toFixed(2)

          serviceProviderList.value.txtRecordProposedBasis = toFixed(
            (serviceProviderList.value.txtRecordProposed / totalAssets.value) * 10000
          )
        } else {
          serviceProviderList.value.txtRecordProposedBasis = 0
          serviceProviderList.value.txtRecordProposedPercent = 0
        }
        if (assign) {
          oldserviceProviderList.value.txtRecordFeeType = serviceProviderList.value.txtRecordFeeType
          oldserviceProviderList.value.txtRecordProposedBasis = serviceProviderList.value.txtRecordProposedBasis
          oldserviceProviderList.value.txtRecordProposedPercent = serviceProviderList.value.txtRecordProposedPercent
        }
      } else {
        serviceProviderList.value.txtRecordProposed = 0
        serviceProviderList.value.txtRecordProposedBasis = 0
        serviceProviderList.value.txtRecordProposedPercent = 0
        serviceProviderList.value.txtRecordFeeType = ''
        disableRecordFeeType.value = false
        disableRecordProposedBasis.value = false
        disableRecordProposed.value = false
        disableRecordProposedPercent.value = false
      }
    }
    function getCustodianSchedule(fees, assign) {
      if (fees) {
        subCustodian.value = fees.SubCustodian
        var minCustodianProposedFee = fees.MinimumFee ? fees.MinimumFee : 0
        var maxCustodianProposedFee = fees.MaximumFee ? fees.MaximumFee : 0
        var feesCustodianProposedSchedule = fees.Fee ? parseFloat(fees.Fee) : 0
        if (minCustodianProposedFee > 0) {
          if (feesCustodianProposedSchedule <= minCustodianProposedFee) {
            feesCustodianProposedSchedule = minCustodianProposedFee
            feesAdjusted.value = true
            custodianFeesAdjustedMessage.value =
              'The Trustee / Custodian fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
          }
        } else if (maxCustodianProposedFee > 0) {
          if (feesCustodianProposedSchedule > maxCustodianProposedFee) {
            feesCustodianProposedSchedule = maxCustodianProposedFee
            feesAdjusted.value = true
            custodianFeesAdjustedMessage.value =
              'The Trustee / Custodian fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
          } else {
            feesAdjusted.value = false
            custodianFeesAdjustedMessage.value = ''
          }
        } else {
          feesAdjusted.value = false
          custodianFeesAdjustedMessage.value = ''
        }
        serviceProviderList.value.txtCustodianFeeType = 4
        disableCustodianFeeType.value = true
        disableCustodianProposedBasis.value = true
        disableCustodianProposed.value = true
        disableCustodianProposedPercent.value = true
        serviceProviderList.value.txtCustodianProposed = Number(parseFloat(feesCustodianProposedSchedule).toFixed(0))
        if (serviceProviderList.value.txtCustodianProposed !== 0) {
          serviceProviderList.value.txtCustodianProposedPercent = parseFloat(
            (serviceProviderList.value.txtCustodianProposed / totalAssets.value) * 100
          ).toFixed(2)

          serviceProviderList.value.txtCustodianProposedBasis = toFixed(
            (serviceProviderList.value.txtCustodianProposed / totalAssets.value) * 10000
          )
        } else {
          serviceProviderList.value.txtCustodianProposedBasis = 0
          serviceProviderList.value.txtCustodianProposedPercent = 0
        }
        if (assign) {
          oldserviceProviderList.value.txtCustodianFeeType = serviceProviderList.value.txtCustodianFeeType
          oldserviceProviderList.value.txtCustodianProposedBasis = serviceProviderList.value.txtCustodianProposedBasis
          oldserviceProviderList.value.txtCustodianProposedPercent = serviceProviderList.value.txtCustodianProposedPercent
        }
      } else {
        serviceProviderList.value.txtCustodianProposed = 0
        serviceProviderList.value.txtCustodianProposedBasis = 0
        serviceProviderList.value.txtCustodianProposedPercent = 0
        serviceProviderList.value.txtCustodianFeeType = ''
        disableCustodianFeeType.value = false
        disableCustodianProposedBasis.value = false
        disableCustodianProposed.value = false
        disableCustodianProposedPercent.value = false
      }
    }
    function getOtherSchedule(fees, assign) {
      if (fees && fees.Name !== 'Enter Fees Manually') {
        readonlyOtherProposed.value = true
        var minOtherProposedFee = fees.MinimumFee ? fees.MinimumFee : 0
        var maxOtherProposedFee = fees.MaximumFee ? fees.MaximumFee : 0
        var feesOtherProposedSchedule = fees.Fee ? parseFloat(fees.Fee) : 0
        if (minOtherProposedFee > 0) {
          if (feesOtherProposedSchedule <= minOtherProposedFee) {
            feesOtherProposedSchedule = minOtherProposedFee
            feesAdjusted.value = true
            otherFeesAdjustedMessage.value =
              'The Other fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
          }
        } else if (maxOtherProposedFee > 0) {
          if (feesOtherProposedSchedule > maxOtherProposedFee) {
            feesOtherProposedSchedule = maxOtherProposedFee
            feesAdjusted.value = true
            otherFeesAdjustedMessage.value =
              'The Other fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
          } else {
            feesAdjusted.value = false
            otherFeesAdjustedMessage.value = ''
          }
        } else {
          feesAdjusted.value = false
          otherFeesAdjustedMessage.value = ''
        }
        serviceProviderList.value.txtOtherFeeType = 4
        disableOtherFeeType.value = true
        disableOtherProposedBasis.value = true
        disableOtherProposed.value = true
        disableOtherProposedPercent.value = true
        serviceProviderList.value.txtOtherProposed = Number(parseFloat(feesOtherProposedSchedule).toFixed(0))
        if (serviceProviderList.value.txtOtherProposed !== 0) {
          serviceProviderList.value.txtOtherProposedPercent = parseFloat(
            (serviceProviderList.value.txtOtherProposed / totalAssets.value) * 100
          ).toFixed(2)

          serviceProviderList.value.txtOtherProposedBasis = toFixed(
            (serviceProviderList.value.txtOtherProposed / totalAssets.value) * 10000
          )
        } else {
          serviceProviderList.value.txtOtherProposedBasis = 0
          serviceProviderList.value.txtOtherProposedPercent = 0
        }
        if (assign) {
          oldserviceProviderList.value.txtOtherFeeType = serviceProviderList.value.txtOtherFeeType
          oldserviceProviderList.value.txtOtherProposedBasis = serviceProviderList.value.txtOtherProposedBasis
          oldserviceProviderList.value.txtOtherProposedPercent = serviceProviderList.value.txtOtherProposedPercent
        }
      } else {
        readonlyOtherProposed.value = false
        serviceProviderList.value.txtOtherProposed = 0
        serviceProviderList.value.txtOtherProposedBasis = 0
        serviceProviderList.value.txtOtherProposedPercent = 0
        serviceProviderList.value.txtOtherFeeType = ''
        disableOtherFeeType.value = false
        disableOtherProposedBasis.value = false
        disableOtherProposed.value = false
        disableOtherProposedPercent.value = false
      }
    }
    const saveFees = async () => {
      serviceProviderList.value.txtAdvisoryCurrent =
        serviceProviderList.value.txtAdvisoryCurrent !== ''
          ? parseFloat(serviceProviderList.value.txtAdvisoryCurrent) < 1
            ? parseFloat(serviceProviderList.value.txtAdvisoryCurrent) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtAdvisoryCurrent).toFixed(0))
          : 0
      oldserviceProviderList.value.txtAdvisoryCurrent = serviceProviderList.value.txtAdvisoryCurrent

      serviceProviderList.value.txtRecordCurrent =
        serviceProviderList.value.txtRecordCurrent !== ''
          ? parseFloat(serviceProviderList.value.txtRecordCurrent) < 1
            ? parseFloat(serviceProviderList.value.txtRecordCurrent) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtRecordCurrent).toFixed(0))
          : 0
      oldserviceProviderList.value.txtRecordCurrent = serviceProviderList.value.txtRecordCurrent

      serviceProviderList.value.txtCustodianCurrent =
        serviceProviderList.value.txtCustodianCurrent !== ''
          ? parseFloat(serviceProviderList.value.txtCustodianCurrent) < 1
            ? parseFloat(serviceProviderList.value.txtCustodianCurrent) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtCustodianCurrent).toFixed(0))
          : 0
      oldserviceProviderList.value.txtCustodianCurrent = serviceProviderList.value.txtCustodianCurrent

      serviceProviderList.value.txtAdminCurrent =
        serviceProviderList.value.txtAdminCurrent !== ''
          ? parseFloat(serviceProviderList.value.txtAdminCurrent) < 1
            ? parseFloat(serviceProviderList.value.txtAdminCurrent) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtAdminCurrent).toFixed(0))
          : 0
      oldserviceProviderList.value.txtAdminCurrent = serviceProviderList.value.txtAdminCurrent

      serviceProviderList.value.txtProCurrent =
        serviceProviderList.value.txtProCurrent !== ''
          ? parseFloat(serviceProviderList.value.txtProCurrent) < 1
            ? parseFloat(serviceProviderList.value.txtProCurrent) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtProCurrent).toFixed(0))
          : 0
      oldserviceProviderList.value.txtProCurrent = serviceProviderList.value.txtProCurrent

      serviceProviderList.value.txtOtherCurrent =
        serviceProviderList.value.txtOtherCurrent !== ''
          ? parseFloat(serviceProviderList.value.txtOtherCurrent) < 1
            ? parseFloat(serviceProviderList.value.txtOtherCurrent) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtOtherCurrent).toFixed(0))
          : 0
      oldserviceProviderList.value.txtOtherCurrent = serviceProviderList.value.txtOtherCurrent

      serviceProviderList.value.txtCostsCurrent =
        serviceProviderList.value.txtCostsCurrent !== ''
          ? parseFloat(serviceProviderList.value.txtCostsCurrent) < 1
            ? parseFloat(serviceProviderList.value.txtCostsCurrent) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtCostsCurrent).toFixed(0))
          : 0
      oldserviceProviderList.value.txtCostsCurrent = serviceProviderList.value.txtCostsCurrent

      serviceProviderList.value.txtAdvisoryProposed =
        serviceProviderList.value.txtAdvisoryProposed !== ''
          ? parseFloat(serviceProviderList.value.txtAdvisoryProposed) < 1
            ? parseFloat(serviceProviderList.value.txtAdvisoryProposed) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtAdvisoryProposed).toFixed(0))
          : 0
      oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
      oldserviceProviderList.value.txtAdvisoryFeeType = serviceProviderList.value.txtAdvisoryFeeType
      oldserviceProviderList.value.txtAdvisoryProposedBasis = serviceProviderList.value.txtAdvisoryProposedBasis
      oldserviceProviderList.value.txtAdvisoryProposedPercent = serviceProviderList.value.txtAdvisoryProposedPercent

      serviceProviderList.value.txtRecordProposed =
        serviceProviderList.value.txtRecordProposed !== ''
          ? parseFloat(serviceProviderList.value.txtRecordProposed) < 1
            ? parseFloat(serviceProviderList.value.txtRecordProposed) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtRecordProposed).toFixed(0))
          : 0
      oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
      oldserviceProviderList.value.txtRecordFeeType = serviceProviderList.value.txtRecordFeeType
      oldserviceProviderList.value.txtRecordProposedBasis = serviceProviderList.value.txtRecordProposedBasis
      oldserviceProviderList.value.txtRecordProposedPercent = serviceProviderList.value.txtRecordProposedPercent

      serviceProviderList.value.txtCustodianProposed =
        serviceProviderList.value.txtCustodianProposed !== ''
          ? parseFloat(serviceProviderList.value.txtCustodianProposed) < 1
            ? parseFloat(serviceProviderList.value.txtCustodianProposed) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtCustodianProposed).toFixed(0))
          : 0
      oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
      oldserviceProviderList.value.txtCustodianFeeType = serviceProviderList.value.txtCustodianFeeType
      oldserviceProviderList.value.txtCustodianProposedBasis = serviceProviderList.value.txtCustodianProposedBasis
      oldserviceProviderList.value.txtCustodianProposedPercent = serviceProviderList.value.txtCustodianProposedPercent

      serviceProviderList.value.txtAdminProposed =
        serviceProviderList.value.txtAdminProposed !== ''
          ? parseFloat(serviceProviderList.value.txtAdminProposed) < 1
            ? parseFloat(serviceProviderList.value.txtAdminProposed) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtAdminProposed).toFixed(0))
          : 0
      oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
      oldserviceProviderList.value.txtAdminFeeType = serviceProviderList.value.txtAdminFeeType
      oldserviceProviderList.value.txtAdminProposedBasis = serviceProviderList.value.txtAdminProposedBasis
      oldserviceProviderList.value.txtAdminProposedPercent = serviceProviderList.value.txtAdminProposedPercent

      serviceProviderList.value.txtProProposed =
        serviceProviderList.value.txtProProposed !== ''
          ? parseFloat(serviceProviderList.value.txtProProposed) < 1
            ? parseFloat(serviceProviderList.value.txtProProposed) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtProProposed).toFixed(0))
          : 0
      oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
      oldserviceProviderList.value.txtProFeeType = serviceProviderList.value.txtProFeeType
      oldserviceProviderList.value.txtProProposedBasis = serviceProviderList.value.txtProProposedBasis
      oldserviceProviderList.value.txtProProposedPercent = serviceProviderList.value.txtProProposedPercent

      serviceProviderList.value.txtOtherProposed =
        serviceProviderList.value.txtOtherProposed !== ''
          ? parseFloat(serviceProviderList.value.txtOtherProposed) < 1
            ? parseFloat(serviceProviderList.value.txtOtherProposed) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtOtherProposed).toFixed(0))
          : 0
      oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
      oldserviceProviderList.value.txtOtherFeeType = serviceProviderList.value.txtOtherFeeType
      oldserviceProviderList.value.txtOtherProposedBasis = serviceProviderList.value.txtOtherProposedBasis
      oldserviceProviderList.value.txtOtherProposedPercent = serviceProviderList.value.txtOtherProposedPercent

      serviceProviderList.value.txtCostsProposed =
        serviceProviderList.value.txtCostsProposed !== ''
          ? parseFloat(serviceProviderList.value.txtCostsProposed) < 1
            ? parseFloat(serviceProviderList.value.txtCostsProposed) * parseFloat(totalAssets.value)
            : Number(parseFloat(serviceProviderList.value.txtCostsProposed).toFixed(0))
          : 0
      oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
      oldserviceProviderList.value.txtCostsFeeType = serviceProviderList.value.txtCostsFeeType
      oldserviceProviderList.value.txtCostsProposedBasis = serviceProviderList.value.txtCostsProposedBasis
      oldserviceProviderList.value.txtCostsProposedPercent = serviceProviderList.value.txtCostsProposedPercent

      loadServiceProvider()
      if (proposalID.value > 0) {
        var proposedFees = []
        oldserviceProviderList.value.cboAdvisorySchedule = serviceProviderList.value.cboAdvisorySchedule
        oldserviceProviderList.value.cboRecordSchedule = serviceProviderList.value.cboRecordSchedule
        oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
        oldserviceProviderList.value.cboAdminSchedule = serviceProviderList.value.cboAdminSchedule
        oldserviceProviderList.value.cboProSchedule = serviceProviderList.value.cboProSchedule
        oldserviceProviderList.value.cboOtherSchedule = serviceProviderList.value.cboOtherSchedule
        oldserviceProviderList.value.cboCostsSchedule = serviceProviderList.value.cboCostsSchedule
        proposedFees.push({
          ScheduleId: serviceProviderList.value.cboAdvisorySchedule
            ? serviceProviderList.value.cboAdvisorySchedule.FeeScheduleID
            : 0,
          Code: 20,
          Fee: serviceProviderList.value.txtAdvisoryProposed
        })
        proposedFees.push({
          ScheduleId: serviceProviderList.value.cboRecordSchedule ? serviceProviderList.value.cboRecordSchedule.FeeScheduleID : 0,
          Code: 24,
          Fee: serviceProviderList.value.txtRecordProposed
        })
        proposedFees.push({
          ScheduleId: serviceProviderList.value.cboCustodianSchedule
            ? serviceProviderList.value.cboCustodianSchedule.FeeScheduleID
            : 0,
          Code: 18,
          Fee: serviceProviderList.value.txtCustodianProposed
        })
        proposedFees.push({
          ScheduleId: serviceProviderList.value.cboAdminSchedule ? serviceProviderList.value.cboAdminSchedule.FeeScheduleID : 0,
          Code: 12,
          Fee: serviceProviderList.value.txtAdminProposed
        })
        proposedFees.push({
          ScheduleId: serviceProviderList.value.cboProSchedule ? serviceProviderList.value.cboProSchedule.FeeScheduleID : 0,
          Code: 16,
          Fee: serviceProviderList.value.txtProProposed
        })
        proposedFees.push({
          ScheduleId: serviceProviderList.value.cboOtherSchedule ? serviceProviderList.value.cboOtherSchedule.FeeScheduleID : 0,
          Code: 99,
          Fee: serviceProviderList.value.txtOtherProposed
        })
        proposedFees.push({
          ScheduleId: serviceProviderList.value.cboCostsSchedule ? serviceProviderList.value.cboCostsSchedule.FeeScheduleID : 0,
          Code: 10,
          Fee: serviceProviderList.value.txtCostsProposed
        })

        var currentFees = []
        currentFees.push({
          ScheduleId: 0,
          Code: 20,
          Fee: serviceProviderList.value.chkOverride
            ? parseFloat(serviceProviderList.value.txtAdvisoryCurrent)
            : parseFloat(lblAdvisoryCurrent.value)
        })
        currentFees.push({
          ScheduleId: 0,
          Code: 24,
          Fee: serviceProviderList.value.chkOverride
            ? parseFloat(serviceProviderList.value.txtRecordCurrent)
            : parseFloat(lblRecordCurrent.value)
        })
        currentFees.push({
          ScheduleId: 0,
          Code: 18,
          Fee: serviceProviderList.value.chkOverride
            ? parseFloat(serviceProviderList.value.txtCustodianCurrent)
            : parseFloat(lblCustodianCurrent.value)
        })
        currentFees.push({
          ScheduleId: 0,
          Code: 12,
          Fee: serviceProviderList.value.chkOverride
            ? parseFloat(serviceProviderList.value.txtAdminCurrent)
            : parseFloat(lblAdminCurrent.value)
        })
        currentFees.push({
          ScheduleId: 0,
          Code: 16,
          Fee: serviceProviderList.value.chkOverride
            ? parseFloat(serviceProviderList.value.txtProCurrent)
            : parseFloat(lblProCurrent.value)
        })
        currentFees.push({
          ScheduleId: 0,
          Code: 99,
          Fee: serviceProviderList.value.chkOverride
            ? parseFloat(serviceProviderList.value.txtOtherCurrent)
            : parseFloat(lblOtherCurrent.value)
        })
        currentFees.push({
          ScheduleId: 0,
          Code: 10,
          Fee: serviceProviderList.value.chkOverride
            ? parseFloat(serviceProviderList.value.txtCostsCurrent)
            : parseFloat(lblCostsCurrent.value)
        })
        var promises = []
        var serviceProviderFee = {
          PlanId: props.planId,
          ProposalId: proposalID.value,
          ProposedFees: proposedFees,
          CurrentFees: currentFees
        }
        promises.push($axios.put(`/api/v1/rpea/plan/serviceproviderfee`, serviceProviderFee))

        var feeOffsets = {
          current12b1: serviceProviderList.value.chkCurrent12b1,
          currentSubTA: serviceProviderList.value.chkCurrentSubTA,
          proposed12b1: serviceProviderList.value.chkProposed12b1,
          proposedSubTA: serviceProviderList.value.chkProposedSubTA
        }
        oldserviceProviderList.value.chkCurrent12b1 = serviceProviderList.value.chkCurrent12b1
        oldserviceProviderList.value.chkCurrentSubTA = serviceProviderList.value.chkCurrentSubTA
        oldserviceProviderList.value.chkProposed12b1 = serviceProviderList.value.chkProposed12b1
        oldserviceProviderList.value.chkProposedSubTA = serviceProviderList.value.chkProposedSubTA
        oldserviceProviderList.value.current_338 = serviceProviderList.value.current_338
        oldserviceProviderList.value.proposed_338 = serviceProviderList.value.proposed_338
        oldserviceProviderList.value.chkOverride = serviceProviderList.value.chkOverride
        promises.push($axios.put(`/api/v1/rpea/plan/${props.planId}/feeoffsets`, feeOffsets))
        planDetail.value.overForm = serviceProviderList.value.chkOverride
        planDetail.value.current_338 =
          serviceProviderList.value.current_338 !== null ? serviceProviderList.value.current_338 : false
        planDetail.value.proposed_338 =
          serviceProviderList.value.proposed_338 !== null ? serviceProviderList.value.proposed_338 : false
        planDetail.value.exchangeTradedFunds =
          serviceProviderList.value.exchangeTradedFunds !== null ? serviceProviderList.value.exchangeTradedFunds : false
        promises.push($axios.put(`/api/v1/diagnostic/advisor/overform`, planDetail.value))
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          promises.push(
            $axios.put(`/api/v1/rpea/plan/${props.planId}/advisorfee/${serviceProviderList.value.txtProProposedBasis}`)
          )
        }
      }
      await Promise.allSettled(promises)
    }
    function insertSchedules(schedule) {
      if (schedule.ScheduleType === 'Administration') {
        loadAdministrationFeeList(false)
      } else if (schedule.ScheduleType === 'Advisory') {
        loadAdvisoryFeeList(false)
      } else if (schedule.ScheduleType === '') {
        loadOtherFeeList(false)
      } else if (schedule.ScheduleType === 'Investment Manager') {
        loadInvestmentFeeList(false)
      }
      loadProposedFeeList()
    }
    function loadServiceProvider() {
      serviceProviderObject.value = []
      var currentFeeObject = []
      var scheduleFeeObject = []
      if (
        Number(serviceProviderList.value.txtCostsCurrent) > 0 ||
        Number(serviceProviderList.value.txtCostsProposed) > 0 ||
        serviceProviderList.value.cboCostsSchedule
      ) {
        currentFeeObject.push({
          name: 'Accounting',
          currentFee: formatPrice(lblCostsCurrent.value, 0),
          updatedFee: formatPrice(serviceProviderList.value.txtCostsCurrent, 0)
        })
      }
      if (
        Number(serviceProviderList.value.txtAdminCurrent) > 0 ||
        Number(serviceProviderList.value.txtAdminProposed) > 0 ||
        serviceProviderList.value.cboAdminSchedule
      ) {
        currentFeeObject.push({
          name: 'Administration',
          currentFee: formatPrice(lblAdminCurrent.value, 0),
          updatedFee: formatPrice(serviceProviderList.value.txtAdminCurrent, 0)
        })
      }
      if (
        Number(serviceProviderList.value.txtAdvisoryCurrent) > 0 ||
        Number(serviceProviderList.value.txtAdvisoryProposed) > 0 ||
        serviceProviderList.value.cboAdvisorySchedule
      ) {
        currentFeeObject.push({
          name: 'Investment Advisory',
          currentFee: formatPrice(lblAdvisoryCurrent.value, 0),
          updatedFee: formatPrice(serviceProviderList.value.txtAdvisoryCurrent, 0)
        })
      }
      if (
        Number(serviceProviderList.value.txtProCurrent) > 0 ||
        Number(serviceProviderList.value.txtProProposed) > 0 ||
        serviceProviderList.value.cboProSchedule
      ) {
        currentFeeObject.push({
          name: 'Professional',
          currentFee: formatPrice(lblProCurrent.value, 0),
          updatedFee: formatPrice(serviceProviderList.value.txtProCurrent, 0)
        })
      }
      if (
        Number(serviceProviderList.value.txtRecordCurrent) > 0 ||
        Number(serviceProviderList.value.txtRecordProposed) > 0 ||
        serviceProviderList.value.cboRecordSchedule
      ) {
        currentFeeObject.push({
          name: 'Recordkeeping',
          currentFee: formatPrice(lblRecordCurrent.value, 0),
          updatedFee: formatPrice(serviceProviderList.value.txtRecordCurrent, 0)
        })
      }
      if (
        Number(serviceProviderList.value.txtCustodianCurrent) > 0 ||
        Number(serviceProviderList.value.txtCustodianProposed) > 0 ||
        serviceProviderList.value.cboCustodianSchedule
      ) {
        currentFeeObject.push({
          name: 'Trustee/Custodian',
          currentFee: formatPrice(lblCustodianCurrent.value, 0),
          updatedFee: formatPrice(serviceProviderList.value.txtCustodianCurrent, 0)
        })
      }
      if (
        Number(serviceProviderList.value.txtOtherCurrent) > 0 ||
        Number(serviceProviderList.value.txtOtherProposed) > 0 ||
        serviceProviderList.value.cboOtherSchedule
      ) {
        currentFeeObject.push({
          name: 'Other',
          currentFee: formatPrice(lblOtherCurrent.value, 0),
          updatedFee: formatPrice(serviceProviderList.value.txtOtherCurrent, 0)
        })
      }
      // For  Scheduled fees
      if (serviceProviderList.value.cboCostsSchedule) {
        scheduleFeeObject.push({
          name: serviceProviderList.value.cboCostsSchedule.Name,
          fees: serviceProviderList.value.txtCostsProposed
        })
      }

      if (serviceProviderList.value.cboAdminSchedule) {
        scheduleFeeObject.push({
          name: serviceProviderList.value.cboAdminSchedule.Name,
          fees: serviceProviderList.value.txtAdminProposed
        })
      }

      if (serviceProviderList.value.cboAdvisorySchedule) {
        scheduleFeeObject.push({
          name: serviceProviderList.value.cboAdvisorySchedule.Name,
          fees: serviceProviderList.value.txtAdvisoryProposed
        })
      }
      if (serviceProviderList.value.cboProSchedule) {
        scheduleFeeObject.push({
          name: serviceProviderList.value.cboProSchedule.Name,
          fees: serviceProviderList.value.txtProProposed
        })
      }
      if (serviceProviderList.value.cboRecordSchedule) {
        scheduleFeeObject.push({
          name: serviceProviderList.value.cboRecordSchedule.Name,
          fees: serviceProviderList.value.txtRecordProposed
        })
      }

      if (serviceProviderList.value.cboCustodianSchedule) {
        scheduleFeeObject.push({
          name: serviceProviderList.value.cboCustodianSchedule.Name,
          fees: serviceProviderList.value.txtCustodianProposed
        })
      }

      if (serviceProviderList.value.cboOtherSchedule) {
        scheduleFeeObject.push({
          name: serviceProviderList.value.cboOtherSchedule.Name,
          fees: serviceProviderList.value.txtOtherProposed
        })
      }

      serviceProviderObject.value.push(loadType.value)
      serviceProviderObject.value.push(currentFeeObject)
      serviceProviderObject.value.push(scheduleFeeObject)
      serviceProviderObject.value.push({
        override: serviceProviderList.value.chkOverride
      })
      if (loadType.value === 'load' || loadType.value === 'load1') {
        if (
          successCustodian.value === true &&
          successLoad5500.value === true &&
          successAdminSchedule.value === true &&
          successRecord.value === true &&
          successAdvisory.value === true &&
          successCosts.value === true &&
          successProProposed.value === true &&
          successOtherProposed.value === true
        ) {
          emit('rpeaprovider', serviceProviderObject.value, loadType.value)
        }
      } else {
        emit('rpeaprovider', serviceProviderObject.value, loadType.value)
      }
    }
    function serviceProviderCompare() {
      if (!Object.compare(serviceProviderList.value, oldserviceProviderList.value)) return true
      else return false
    }
    function abondondServiceProvider() {
      Object.assign(serviceProviderList.value, oldserviceProviderList.value)
    }
    function SaveSchedule() {
      if (scheduleBuilder.value) scheduleBuilder.value.SaveSchedule()
    }
    function createNewFee() {
      if (scheduleBuilder.value) scheduleBuilder.value.resetFees()
      createFeeDialog.value = !createFeeDialog.value
    }
    function closeDialog() {
      createFeeDialog.value = false
    }
    function loadAdvisorFee() {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        $axios.get(`/api/v1/managedplan/advisorfee/${totalAssets.value}`).then((advisorfeesuccess) => {
          if (advisorfeesuccess.data.d !== null && advisorfeesuccess.data.d.length > 0) {
            minAdvisoryFee.value = advisorfeesuccess.data.d[0].MinFee
            maxAdvisoryFee.value = advisorfeesuccess.data.d[0].Fee
          }
        })
      } else {
        getProfessionalData()
      }
    }
    function loadFees(totalAssets, participantBalance) {
      totalAssets.value = totalAssets && totalAssets > 0 ? totalAssets : props.selectedPlan.TOTASSETS
      totalParticipant.value = participantBalance && participantBalance > 0 ? participantBalance : props.selectedPlan.PARTICACCT
      let assetCompare = Number(totalAssets) !== Number(props.selectedPlan.TOTASSETS)
      let participantCompare = Number(participantBalance) !== Number(props.selectedPlan.PARTICACCT)

      if (assetCompare || participantCompare) {
        loadType.value = 'load1'
        LoadSchedules()
      }
    }
    function compareValue(totalAssets, participantBalance) {
      let assetCompare = Number(totalAssets) !== Number(totalAssets.value)
      let participantCompare = Number(participantBalance) !== Number(totalParticipant.value)
      if (assetCompare || participantCompare) {
        loadFees(totalAssets, participantBalance)
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
    function assignFeeValue(from, type, value, assign) {
      if (from === 'Accounting') {
        serviceProviderList.value.txtCostsCurrent = Number(parseFloat(value).toFixed(0))
        calculateTotal('Current')
      } else if (from === 'Administration') {
        serviceProviderList.value.txtAdminCurrent = Number(parseFloat(value).toFixed(0))
        calculateTotal('Current')
      } else if (from === 'Investment') {
        serviceProviderList.value.txtAdvisoryCurrent = Number(parseFloat(value).toFixed(0))
        calculateTotal('Current')
      } else if (from === 'Professional') {
        serviceProviderList.value.txtProCurrent = Number(parseFloat(value).toFixed(0))
        calculateTotal('Current')
      } else if (from === 'Recordkeeping') {
        serviceProviderList.value.txtRecordCurrent = Number(parseFloat(value).toFixed(0))
        calculateTotal('Current')
      } else if (from === 'Trustee') {
        serviceProviderList.value.txtCustodianCurrent = Number(parseFloat(value).toFixed(0))
        calculateTotal('Current')
      } else if (from === 'Other') {
        serviceProviderList.value.txtOtherCurrent = Number(parseFloat(value).toFixed(0))
        calculateTotal('Current')
      } else if (from === 'ProposedAccounting') {
        if (type === 'basis') {
          if (scheduleFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboCostsSchedule = scheduleFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedAccountBasisValue = toFixed(value)
            serviceProviderList.value.txtCostsProposedBasis = proposedAccountBasisValue

            serviceProviderList.value.txtCostsProposed = Number(
              parseFloat((proposedAccountBasisValue / 10000) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtCostsProposedPercent = parseFloat(proposedAccountBasisValue / 100).toFixed(2)
          }
        } else if (type === 'dollar') {
          if (scheduleFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboCostsSchedule = scheduleFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            let dollarValue = Number(parseFloat(value).toFixed(0))
            serviceProviderList.value.txtCostsProposed = dollarValue
            serviceProviderList.value.txtCostsProposedBasis = toFixed((dollarValue / totalAssets.value) * 10000)

            serviceProviderList.value.txtCostsProposedPercent = toFixed((dollarValue / totalAssets.value) * 100)
            serviceProviderList.value.txtCostsFeeType = 2
            disableCostFeeType.value = false
            disableCostBasis.value = true
            disableCostDollar.value = false
            disableCostPercent.value = true
          }
        } else if (type === 'percent') {
          if (scheduleFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboCostsSchedule = scheduleFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedAccountPercentValue = parseFloat(value).toFixed(2)

            serviceProviderList.value.txtCostsProposedPercent = proposedAccountPercentValue
            serviceProviderList.value.txtCostsProposed = Number(
              parseFloat((proposedAccountPercentValue / 100) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtCostsProposedBasis = toFixed(proposedAccountPercentValue * 100)
          }
        }
        if (assign) {
          oldserviceProviderList.value.txtCostsProposedBasis = serviceProviderList.value.txtCostsProposedBasis
          oldserviceProviderList.value.txtCostsFeeType = serviceProviderList.value.txtCostsFeeType
          oldserviceProviderList.value.txtCostsProposed = serviceProviderList.value.txtCostsProposed
          oldserviceProviderList.value.txtCostsProposedPercent = serviceProviderList.value.txtCostsProposedPercent
        }
        calculateTotal('Proposed')
      } else if (from === 'ProposedAdmin') {
        if (type === 'basis') {
          if (adminScheduleList.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboAdminSchedule = adminScheduleList.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedAdminBasisValue = toFixed(value)
            serviceProviderList.value.txtAdminProposedBasis = proposedAdminBasisValue

            serviceProviderList.value.txtAdminProposed = Number(
              parseFloat((proposedAdminBasisValue / 10000) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtAdminProposedPercent = parseFloat(proposedAdminBasisValue / 100).toFixed(2)
          }
        } else if (type === 'dollar') {
          if (adminScheduleList.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboAdminSchedule = adminScheduleList.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            let proposedAdminDollarValue = Number(parseFloat(value).toFixed(0))
            serviceProviderList.value.txtAdminProposed = proposedAdminDollarValue
            serviceProviderList.value.txtAdminProposedBasis = toFixed((proposedAdminDollarValue / totalAssets.value) * 10000)
            serviceProviderList.value.txtAdminProposedPercent = parseFloat(
              (proposedAdminDollarValue / totalAssets.value) * 100
            ).toFixed(2)
            serviceProviderList.value.txtAdminFeeType = 2
            disableAdminFeeType.value = false
            disableAdminProposedBasis.value = true
            disableAdminProposed.value = false
            disableAdminProposedPercent.value = true
          }
        } else if (type === 'percent') {
          if (adminScheduleList.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboAdminSchedule = adminScheduleList.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedAdminPercentValue = parseFloat(value).toFixed(2)
            serviceProviderList.value.txtAdminProposedPercent = proposedAdminPercentValue
            serviceProviderList.value.txtAdminProposed = Number(
              parseFloat((proposedAdminPercentValue / 100) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtAdminProposedBasis = toFixed(proposedAdminPercentValue * 100)
          }
        }
        if (assign) {
          oldserviceProviderList.value.txtAdminProposedBasis = serviceProviderList.value.txtAdminProposedBasis
          oldserviceProviderList.value.txtAdminFeeType = serviceProviderList.value.txtAdminFeeType
          oldserviceProviderList.value.txtAdminProposed = serviceProviderList.value.txtAdminProposed
          oldserviceProviderList.value.txtAdminProposedPercent = serviceProviderList.value.txtAdminProposedPercent
        }
        calculateTotal('Proposed')
      } else if (from === 'ProposedAdvisory') {
        if (type === 'basis') {
          if (investmentProposedFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboAdvisorySchedule = investmentProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedAdvisoryBasisValue = toFixed(value)

            serviceProviderList.value.txtAdvisoryProposedBasis = proposedAdvisoryBasisValue

            serviceProviderList.value.txtAdvisoryProposed = Number(
              parseFloat((proposedAdvisoryBasisValue / 10000) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtAdvisoryProposedPercent = parseFloat(proposedAdvisoryBasisValue / 100).toFixed(2)
          }
        } else if (type === 'dollar') {
          if (investmentProposedFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboAdvisorySchedule = investmentProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            let advisoryDollarValue = Number(parseFloat(value).toFixed(0))
            serviceProviderList.value.txtAdvisoryProposed = advisoryDollarValue
            serviceProviderList.value.txtAdvisoryProposedBasis = toFixed((advisoryDollarValue / totalAssets.value) * 10000)

            serviceProviderList.value.txtAdvisoryProposedPercent = parseFloat(
              (advisoryDollarValue / totalAssets.value) * 100
            ).toFixed(2)
            serviceProviderList.value.txtAdvisoryFeeType = 2
            disableAdvisoryFeeType.value = false
            disableAdvisoryProposedBasis.value = true
            disableAdvisoryProposed.value = false
            disableAdvisoryProposedPercent.value = true
          }
        } else if (type === 'percent') {
          if (investmentProposedFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboAdvisorySchedule = investmentProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedAdvisoryPercentValue = parseFloat(value).toFixed(2)

            serviceProviderList.value.txtAdvisoryProposedPercent = proposedAdvisoryPercentValue
            serviceProviderList.value.txtAdvisoryProposed = Number(
              parseFloat((proposedAdvisoryPercentValue / 100) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtAdvisoryProposedBasis = toFixed(proposedAdvisoryPercentValue * 100)
          }
        }
        if (assign) {
          oldserviceProviderList.value.txtAdvisoryProposedBasis = serviceProviderList.value.txtAdvisoryProposedBasis
          oldserviceProviderList.value.txtAdvisoryFeeType = serviceProviderList.value.txtAdvisoryFeeType
          oldserviceProviderList.value.txtAdvisoryProposed = serviceProviderList.value.txtAdvisoryProposed
          oldserviceProviderList.value.txtAdvisoryProposedPercent = serviceProviderList.value.txtAdvisoryProposedPercent
        }
        calculateTotal('Proposed')
      } else if (from === 'ProposedProfessional') {
        if (type === 'basis') {
          if ($store.state.user.selectedProgram.programName === $authz.managedPlan.PA) {
            if (Number(value) < minAdvisoryFee.value || Number(value) > maxAdvisoryFee.value) {
              serviceProviderList.value.txtProProposedBasis = 0
              serviceProviderList.value.txtProProposed = 0
              serviceProviderList.value.txtProProposedPercent = 0
              $toast.error('Fee must be between ' + minAdvisoryFee.value + ' bps and ' + maxAdvisoryFee.value + ' bps', '')
              return
            }
            if (serviceProviderList.value.txtProProposedBasis !== 0) {
              serviceProviderList.value.txtProProposed = Number(
                parseFloat((Number(value) / 10000) * totalAssets.value).toFixed(0)
              )
              serviceProviderList.value.txtProProposedPercent = parseFloat(Number(value) / 100).toFixed(2)
            }
          } else if ($store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
            if (Number(serviceProviderList.value.txtProProposedBasis) > maxAdvisoryFee.value) {
              serviceProviderList.value.txtProProposedBasis = 0
              serviceProviderList.value.txtProProposed = 0
              serviceProviderList.value.txtProProposedPercent = 0
              $toast.error('Fee must be less than ' + maxAdvisoryFee.value + ' bps', '')
              return
            }
            if (serviceProviderList.value.txtProProposedBasis !== 0) {
              serviceProviderList.value.txtProProposed = Number(
                parseFloat((Number(value) / 10000) * totalAssets.value).toFixed(0)
              )
              serviceProviderList.value.txtProProposedPercent = parseFloat(Number(value) / 100).toFixed(2)
            }
          } else {
            if (advisoryProposedFees.value.length > 0 && Number(value) > 0) {
              serviceProviderList.value.cboProSchedule = advisoryProposedFees.value.find((obj) => {
                return obj.Name === 'Enter Fees Manually'
              })
              var proposedProBasisValue = toFixed(value)
              serviceProviderList.value.txtProProposedBasis = proposedProBasisValue

              serviceProviderList.value.txtProProposed = Number(
                parseFloat((proposedProBasisValue / 10000) * totalAssets.value).toFixed(0)
              )
              serviceProviderList.value.txtProProposedPercent = parseFloat(proposedProBasisValue / 100).toFixed(2)
            }
          }
        } else if (type === 'dollar') {
          if (advisoryProposedFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboProSchedule = advisoryProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            let proposedDollarValue = Number(parseFloat(value).toFixed(0))
            serviceProviderList.value.txtProProposed = proposedDollarValue
            serviceProviderList.value.txtProProposedBasis = toFixed((proposedDollarValue / totalAssets.value) * 10000)
            serviceProviderList.value.txtProProposedPercent = parseFloat((proposedDollarValue / totalAssets.value) * 100).toFixed(
              2
            )
            serviceProviderList.value.txtProFeeType = 2
            disableProFeeType.value = false
            disableProProposedBasis.value = true
            disableProProposed.value = false
            disableProProposedPercent.value = true
          }
        } else if (type === 'percent') {
          if (advisoryProposedFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboProSchedule = advisoryProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedProPercentValue = toFixed(value)
            serviceProviderList.value.txtProProposedPercent = proposedProPercentValue
            serviceProviderList.value.txtProProposed = Number(
              parseFloat((proposedProPercentValue / 100) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtProProposedBasis = toFixed(proposedProPercentValue * 100)
          }
        }
        if (assign) {
          oldserviceProviderList.value.txtProProposedBasis = serviceProviderList.value.txtProProposedBasis
          oldserviceProviderList.value.txtProFeeType = serviceProviderList.value.txtProFeeType
          oldserviceProviderList.value.txtProProposed = serviceProviderList.value.txtProProposed
          oldserviceProviderList.value.txtProProposedPercent = serviceProviderList.value.txtProProposedPercent
        }
        calculateTotal('Proposed')
      } else if (from === 'ProposedRecordkeeping') {
        if (assign) {
          oldserviceProviderList.value.txtRecordProposed = serviceProviderList.value.txtRecordProposed
          oldserviceProviderList.value.txtRecordFeeType = serviceProviderList.value.txtRecordFeeType
          oldserviceProviderList.value.txtRecordProposedBasis = serviceProviderList.value.txtRecordProposedBasis
          oldserviceProviderList.value.txtRecordProposedPercent = serviceProviderList.value.txtRecordProposedPercent
        }
        calculateTotal('Proposed')
      } else if (from === 'ProposedCustodian') {
        if (assign) {
          oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
          oldserviceProviderList.value.txtCustodianFeeType = serviceProviderList.value.txtCustodianFeeType
          oldserviceProviderList.value.txtCustodianProposedBasis = serviceProviderList.value.txtCustodianProposedBasis
          oldserviceProviderList.value.txtCustodianProposedPercent = serviceProviderList.value.txtCustodianProposedPercent
        }
        calculateTotal('Proposed')
      } else if (from === 'ProposedOther') {
        if (type === 'basis') {
          if (scheduleFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboOtherSchedule = otherProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedOtherBasisValue = toFixed(value)
            serviceProviderList.value.txtOtherProposedBasis = proposedOtherBasisValue

            serviceProviderList.value.txtOtherProposed = Number(
              parseFloat((proposedOtherBasisValue / 10000) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtOtherProposedPercent = parseFloat(proposedOtherBasisValue / 100).toFixed(2)
          }
        } else if (type === 'dollar') {
          if (scheduleFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboOtherSchedule = otherProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            let otherProposedDollarValue = Number(parseFloat(value).toFixed(0))
            serviceProviderList.value.txtOtherProposed = otherProposedDollarValue
            serviceProviderList.value.txtOtherProposedBasis = toFixed((otherProposedDollarValue / totalAssets.value) * 10000)

            serviceProviderList.value.txtOtherProposedPercent = parseFloat(
              (otherProposedDollarValue / totalAssets.value) * 100
            ).toFixed(2)
            serviceProviderList.value.txtOtherFeeType = 2
            disableOtherFeeType.value = false
            disableOtherProposedBasis.value = true
            disableOtherProposed.value = false
            disableOtherProposedPercent.value = true
          }
        } else if (type === 'percent') {
          if (scheduleFees.value.length > 0 && Number(value) > 0) {
            serviceProviderList.value.cboOtherSchedule = otherProposedFees.value.find((obj) => {
              return obj.Name === 'Enter Fees Manually'
            })
            var proposedOtherPercentValue = parseFloat(value).toFixed(2)
            serviceProviderList.value.txtOtherProposedPercent = proposedOtherPercentValue
            serviceProviderList.value.txtOtherProposed = Number(
              parseFloat((proposedOtherPercentValue / 100) * totalAssets.value).toFixed(0)
            )
            serviceProviderList.value.txtOtherProposedBasis = toFixed(proposedOtherPercentValue * 100)
          }
        }
        if (assign) {
          oldserviceProviderList.value.txtOtherProposedBasis = serviceProviderList.value.txtOtherProposedBasis
          oldserviceProviderList.value.txtOtherFeeType = serviceProviderList.value.txtOtherFeeType
          oldserviceProviderList.value.txtOtherProposed = serviceProviderList.value.txtOtherProposed
          oldserviceProviderList.value.txtOtherProposedPercent = serviceProviderList.value.txtOtherProposedPercent
        }
        calculateTotal('Proposed')
      }
    }
    function feeAdjustmentMethod() {
      if (feesAdjusted.value) {
        var feeAdjustedMsg = ''
        feeAdjustedMsg += accountingFeesAdjustedMessage.value ? accountingFeesAdjustedMessage.value + '<br/>' : ''
        feeAdjustedMsg += otherFeesAdjustedMessage.value ? otherFeesAdjustedMessage.value + '<br/>' : ''
        feeAdjustedMsg += professionalFeesAdjustedMessage.value ? professionalFeesAdjustedMessage.value + '<br/>' : ''
        feeAdjustedMsg += investmentFeesAdjustedMessage.value ? investmentFeesAdjustedMessage.value + '<br/>' : ''
        feeAdjustedMsg += recordkeepingFeesAdjustedMessage.value ? recordkeepingFeesAdjustedMessage.value + '<br/>' : ''
        feeAdjustedMsg += adminFeesAdjustedMessage.value ? adminFeesAdjustedMessage.value + '<br/>' : ''
        feeAdjustedMsg += custodianFeesAdjustedMessage.value ? custodianFeesAdjustedMessage.value : ''
        feesAdjustedMessage.value = feeAdjustedMsg

        $toast?.destroy()
        $toast.info(feesAdjustedMessage.value, '')
        feesAdjusted.value = false
      }
    }
    function loadEtfTrusteeCustodianfees(val) {
      //get the etf true false
      if (serviceProviderList.value.cboCustodianSchedule) {
        if (serviceProviderList.value.exchangeTradedFunds) {
          if (serviceProviderList.value.cboCustodianSchedule.FeeScheduleID !== 0) {
            $axios
              .get(
                `/api/v1/tal/proposal/trusteefee?feeSchedule=${serviceProviderList.value.cboCustodianSchedule.FeeScheduleID}&totalAssets=${totalAssets.value}&outsideAmount=${0}&stockAmount=${0}&participants=${totalParticipant.value}&subCustodian=${subCustodian.value}`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  var trusteeFees =
                    success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0

                  trusteeAmount.value = trusteeFees
                  serviceProviderList.value.cboCustodianSchedule.Fee = trusteeAmount.value
                  getCustodianSchedule(serviceProviderList.value.cboCustodianSchedule, true)
                }
                if (val) {
                  oldserviceProviderList.value.txtCustodianProposed = serviceProviderList.value.txtCustodianProposed
                  oldserviceProviderList.value.cboCustodianSchedule = serviceProviderList.value.cboCustodianSchedule
                }
                loadServiceProvider()
              })
          }
        } else {
          if (serviceProviderList.value.cboCustodianSchedule.FeeScheduleID !== 0) {
            $axios
              .get(
                `/api/v1/tal/proposal/providerfee?feeSchedule=${serviceProviderList.value.cboCustodianSchedule.FeeScheduleID}&totalAssets=${totalAssets.value}&outsideAmount=${0}&stockAmount=${0}&participants=${totalParticipant.value}`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  var trusteeFees =
                    success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0

                  trusteeAmount.value = trusteeFees
                  serviceProviderList.value.cboCustodianSchedule.Fee = trusteeAmount.value
                  getCustodianSchedule(serviceProviderList.value.cboCustodianSchedule, true)
                }
              })
          }
        }
      }
    }
    const showFeeSchedule = computed(() => {
      if ($authz.hasRole($authz.roles.SiteAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)) {
        return $authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.Full)
      } else if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_create_Fee_Schedule__c, $authz.permission.Full) &&
          $authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.Full)
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Advisors_Firms_to_create_Fee_Schedule__c, $authz.permission.Full) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Advisors_Firms_to_create_Fee_Schedules__c,
            $authz.permission.Full
          ) &&
          $authz.allowedByProgram($authz.programPermissionSet.Access_to_fee_engine_allowed__c, $authz.permission.Full)
        )
      } else return false
    })
    watch(
      () => props.planId,
      (val) => {
        if (val) {
          totalAssets.value = props.selectedPlan.TOTASSETS
          totalParticipant.value = props.selectedPlan.PARTICACCT
          loadType.value = 'load'
          LoadSchedules()
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => serviceProviderList.value.txtCostsProposed,
      (value) => {
        if (Number(value) === 0 && !serviceProviderList.value.cboCostsSchedule) {
          serviceProviderList.value.cboCostsSchedule = ''
          serviceProviderList.value.txtCostsFeeType = ''
          disableCostFeeType.value = false
          disableCostBasis.value = false
          disableCostDollar.value = false
          disableCostPercent.value = false
          serviceProviderList.value.txtCostsProposedBasis = 0
          serviceProviderList.value.txtCostsProposedPercent = 0
        }
        calculateTotal('Proposed')
      }
    )
    watch(
      () => serviceProviderList.value.txtOtherProposed,
      (value) => {
        if (Number(value) === 0 && !serviceProviderList.value.cboOtherSchedule) {
          serviceProviderList.value.cboOtherSchedule = ''
          serviceProviderList.value.txtOtherProposedBasis = 0
          serviceProviderList.value.txtOtherProposedPercent = 0
          serviceProviderList.value.txtOtherFeeType = ''
          disableOtherFeeType.value = false
          disableOtherProposedBasis.value = false
          disableOtherProposed.value = false
          disableOtherProposedPercent.value = false
        }
        calculateTotal('Proposed')
      }
    )
    watch(
      () => serviceProviderList.value.txtProProposed,
      (value) => {
        if (Number(value) === 0 && !serviceProviderList.value.cboProSchedule) {
          serviceProviderList.value.cboProSchedule = ''
          serviceProviderList.value.txtProProposedBasis = 0
          serviceProviderList.value.txtProProposedPercent = 0
          serviceProviderList.value.txtProFeeType = ''
          disableProFeeType.value = false
          disableProProposedBasis.value = false
          disableProProposed.value = false
          disableProProposedPercent.value = false
        }
        calculateTotal('Proposed')
      }
    )
    watch(
      () => serviceProviderList.value.txtAdvisoryProposed,
      (value) => {
        if (Number(value) === 0 && !serviceProviderList.value.cboAdvisorySchedule) {
          serviceProviderList.value.cboAdvisorySchedule = ''
          serviceProviderList.value.txtAdvisoryProposedBasis = 0
          serviceProviderList.value.txtAdvisoryProposedPercent = 0
          serviceProviderList.value.txtAdvisoryFeeType = ''
          disableAdvisoryFeeType.value = false
          disableAdvisoryProposedBasis.value = false
          disableAdvisoryProposed.value = false
          disableAdvisoryProposedPercent.value = false
        }
        calculateTotal('Proposed')
      }
    )
    watch(
      () => serviceProviderList.value.txtAdminProposed,
      (value) => {
        if (Number(value) === 0 && !serviceProviderList.value.cboAdminSchedule) {
          serviceProviderList.value.cboAdminSchedule = ''
          serviceProviderList.value.txtAdminProposedBasis = 0
          serviceProviderList.value.txtAdminProposedPercent = 0
          serviceProviderList.value.txtAdminFeeType = ''
          disableAdminFeeType.value = false
          disableAdminProposedBasis.value = false
          disableAdminProposed.value = false
          disableAdminProposedPercent.value = false
        }
        calculateTotal('Proposed')
      }
    )
    watch(
      () => serviceProviderList.value.txtCustodianProposed,
      () => {
        calculateTotal('Proposed')
      }
    )
    watch(
      () => serviceProviderList.value.txtRecordProposed,
      () => {
        calculateTotal('Proposed')
      }
    )
    watch(
      () => serviceProviderList.value.exchangeTradedFunds,
      () => {
        loadEtfTrusteeCustodianfees()
      }
    )
    onBeforeUnmount(() => {
      eventBus.off('updateProposedFee')
      eventBus.off('updateTrusteeFee')
      eventBus.off('feeAdjustmentDoneForRPEA')
    })
    onMounted(() => {
      oldserviceProviderList.value = Object.assign({}, serviceProviderList.value)
      eventBus.on('updateProposedFee', (totalAssets, participantBalance) => {
        compareValue(totalAssets, participantBalance)
      })
      eventBus.on('updateTrusteeFee', () => {
        loadType.value = 'load1'
        LoadSchedules()
      })
      // eslint-disable-next-line no-unused-vars
      eventBus.on('feeAdjustmentDoneForRPEA', (data) => {
        feeAdjustmentMethod()
      })
    })
    return {
      theme,
      display,
      $authz,
      createFeeDialog,
      valid,
      serviceProviderList,
      calculateTotal,
      formatPrice,
      assignFeeValue,
      lblAdminCurrent,
      lblCostsCurrent,
      lblAdvisoryCurrent,
      lblRecordCurrent,
      lblCustodianCurrent,
      lblOtherCurrent,
      totalCurrentFee,
      totalCurrentAdditionalFees,
      showFeeSchedule,
      scheduleFees,
      feeEntryTypeList,
      disableCostFeeType,
      enableSelectedFeeType,
      disableCostBasis,
      readonlyCostsProposed,
      disableCostDollar,
      disableCostPercent,
      adminScheduleList,
      disableAdminFeeType,
      readonlyAdminProposed,
      disableAdminProposedBasis,
      disableAdminProposed,
      disableAdminProposedPercent,
      investmentProposedFees,
      disableAdvisoryFeeType,
      readonlyAdvisoryProposed,
      disableAdvisoryProposedBasis,
      disableAdvisoryProposed,
      disableAdvisoryProposedPercent,
      advisoryProposedFees,
      disableProFeeType,
      readonlyProProposed,
      disableProProposedBasis,
      disableProProposed,
      disableProProposedPercent,
      recordScheduleList,
      disableRecordFeeType,
      disableRecordProposedBasis,
      disableRecordProposed,
      disableRecordProposedPercent,
      custodianScheduleList,
      disableCustodianFeeType,
      disableCustodianProposedBasis,
      disableCustodianProposed,
      disableCustodianProposedPercent,
      otherProposedFees,
      disableOtherFeeType,
      readonlyOtherProposed,
      disableOtherProposedBasis,
      disableOtherProposed,
      disableOtherProposedPercent,
      saveFees,
      serviceProviderCompare,
      abondondServiceProvider,
      closeDialog,
      getCostSchedule,
      getAdminSchedule,
      getAdvisorySchedule,
      getProSchedule,
      getCustodianSchedule,
      getOtherSchedule,
      totalProposedFees,
      scheduleBuilder,
      insertSchedules,
      SaveSchedule,
      createNewFee
    }
  }
}
</script>
<style scoped>
.margin-left-67 {
  margin-left: 67px !important;
}
</style>
<style>
.paddingAlignment .v-text-field input {
  padding: 10px 0 8px !important;
}
</style>
