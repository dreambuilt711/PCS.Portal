<template>
  <v-layout>
    <v-col cols="12" class="pa-0" v-if="!display.smAndDown.value">
      <v-col cols="12">
        <v-row>
          <v-col cols="2" sm="2" :class="!theme.dark ? 'text-grey' : 'text-white'">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9"> Fee Type </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3" :class="!theme.dark ? 'text-grey' : 'text-white'"> Schedule </v-col>
          <v-col cols="2" sm="2" :class="!theme.dark ? 'text-grey' : 'text-white'"> Company Name </v-col>
          <v-col cols="2" sm="2" :class="!theme.dark ? 'text-grey' : 'text-white'"> Fee Entry Type </v-col>
          <v-col cols="1" sm="1" :class="!theme.dark ? 'text-grey' : 'text-white'"> Basis Points </v-col>
          <v-col cols="1" sm="1" :class="!theme.dark ? 'text-grey' : 'text-white'"> Cost($) </v-col>
          <v-col cols="1" sm="1" :class="!theme.dark ? 'text-grey' : 'text-white'"> Cost(%) </v-col>
        </v-row>
      </v-col>
      <!-- start here -->
      <v-divider class="bold my-2" />
      <v-col v-show="showProfessionalService === 'true'" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row class="align-self">
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="align-self mt-2"> Professional Services </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3">
            <v-col class="mr-2 pb-2">
              <v-select
                v-model="planFeesForm.providerSchedule"
                :label="planFeesForm.providerSchedule ? '' : 'Select Fee Schedule'"
                hide-details
                :items="providerScheduleList"
                item-title="Name"
                item-value="FeeScheduleID"
                clearable
                :menu-props="{ overflowY: true }"
                return-object
                :disabled="
                  !$authz.allowedByProgram(
                    $authz.programPermissionSet.PCS_Aspire_Product__c,
                    $authz.pcsAspireProduct.Multi_Strategist_Product
                  )
                    ? false
                    : true
                "
                item-props.disabled="disabled"
              />
            </v-col>
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-text-field
              v-model="planFeesForm.providerName"
              hide-details
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
                  ? false
                  : true
              "
            />
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-select
              v-model="planFeesForm.providerEntryFeeType"
              :label="planFeesForm.providerEntryFeeType ? '' : 'Select Fee Entry Type'"
              hide-details
              :items="entryTypeList"
              :menu-props="{ overflowY: true }"
              item-props.disabled="disabled"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
                  ? disableProviderFeeType
                  : true
              "
              @update:model-value="enableSelectedFeeType(planFeesForm.providerEntryFeeType, 'Provider')"
            />
          </v-col>
          <v-col v-show="showProviderFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="planFeesForm.providerFee"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
                  ? disableProviderFee
                  : true
              "
            />
          </v-col>
          <v-col v-show="showProviderFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="providerDollar"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
                  ? disableProviderDollar
                  : true
              "
              prefix="$"
            />
          </v-col>
          <v-col v-show="showProviderFeeText" cols="1" sm="1">
            <v-text-field
              v-model="providerPercent"
              v-input-mask="{
                alias: 'numeric',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
                  ? disableProviderPercent
                  : true
              "
              suffix="%"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-show="!showInvestmentManager" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row class="align-self">
              <v-col cols="3" sm="3">
                <v-switch
                  v-model="planFeesForm.AllowInvestmentManager"
                  class="offsetSwitch ma-0"
                  color="accent"
                  hide-details
                  v-if="
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  @update:model-value="checkInvestmentManager(planFeesForm.AllowInvestmentManager)"
                  :disabled="
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                      ? false
                      : true
                  "
                ></v-switch>
              </v-col>
              <v-col cols="9" sm="9" class="align-self mt-2">
                <v-col
                  v-if="
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  :class="planFeesForm.AllowInvestmentManager ? '' : 'disableClass'"
                >
                  Investment Manager
                </v-col>
                <v-col
                  v-if="
                    $authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  :class="planFeesForm.AllowInvestmentManager ? '' : 'disableClass'"
                >
                  {{ mmlInvestmentName }}
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3">
            <v-col class="mr-2 pb-2">
              <v-select
                v-model="planFeesForm.managerSchedule"
                :label="planFeesForm.managerSchedule ? '' : 'Select Fee Schedule'"
                :hide-details="investmentManagerScheduleError === true ? false : true"
                :items="managerScheduleList"
                item-title="Name"
                item-value="FeeScheduleID"
                clearable
                :error="investmentManagerScheduleError"
                :error-messages="investmentManagerScheduleErrorMsg"
                :menu-props="{ overflowY: true }"
                return-object
                :disabled="
                  !$authz.allowedByProgram(
                    $authz.programPermissionSet.PCS_Aspire_Product__c,
                    $authz.pcsAspireProduct.Multi_Strategist_Product
                  ) && planFeesForm.AllowInvestmentManager
                    ? false
                    : true
                "
                @blur="checkinvestmentManagerValue()"
                item-props.disabled="disabled"
                @update:model-value="getManagerValue(false)"
              />
            </v-col>
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-text-field
              v-model="planFeesForm.managerName"
              :hide-details="investmentManagerError === true ? false : true"
              :error="investmentManagerError"
              :error-messages="investmentManagerErrorMsg"
              @blur="checkinvestmentManagerValue()"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && planFeesForm.AllowInvestmentManager
                  ? false
                  : true
              "
            ></v-text-field>
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-select
              v-model="planFeesForm.managerEntryFeeType"
              :label="planFeesForm.managerEntryFeeType ? '' : 'Select Fee Entry Type'"
              hide-details
              :items="entryTypeList"
              item-title="text"
              :menu-props="{ overflowY: true }"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && planFeesForm.AllowInvestmentManager
                  ? disableManagerFeeType
                  : true
              "
              item-props.disabled="disabled"
              @update:model-value="enableSelectedFeeType(planFeesForm.managerEntryFeeType, 'Investment')"
            />
          </v-col>
          <v-col v-show="showManagerFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="planFeesForm.managerFee"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && planFeesForm.AllowInvestmentManager
                  ? disableManagerFee
                  : true
              "
              @blur="checkinvestmentManagerValue()"
            />
          </v-col>
          <v-col v-show="showManagerFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="managerDollar"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && planFeesForm.AllowInvestmentManager
                  ? disableManagerDollar
                  : true
              "
              @update:model-value="updateManagerBasis(managerDollar, 'dollar', 'Investment')"
              prefix="$"
              @blur="checkinvestmentManagerValue()"
            />
          </v-col>
          <v-col v-show="showManagerFeeText" cols="1" sm="1">
            <v-text-field
              v-model="managerPercent"
              v-input-mask="{
                alias: 'numeric',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && planFeesForm.AllowInvestmentManager
                  ? disableManagerPercent
                  : true
              "
              @update:model-value="updateManagerBasis(managerPercent, 'percent', 'Investment')"
              suffix="%"
              @blur="checkinvestmentManagerValue()"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-show="!showFinancialAdvisor" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row class="align-self">
              <v-col cols="3" sm="3">
                <v-switch
                  v-model="planFeesForm.AllowFinancialAdvisor"
                  class="offsetSwitch ma-0"
                  color="accent"
                  v-if="
                    showAdvisorEditIcon &&
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  hide-details
                  :disabled="
                    showAdvisorEditIcon &&
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                      ? false
                      : true
                  "
                  @update:model-value="checkFinancialAdvisor(planFeesForm.AllowFinancialAdvisor)"
                ></v-switch>
              </v-col>
              <v-col cols="9" sm="9" class="align-self mt-2">
                <v-col
                  v-if="
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  :class="planFeesForm.AllowFinancialAdvisor ? '' : 'disableClass'"
                >
                  {{ enterpriseName === 'Park Avenue Securities' ? 'Soliciting Advisor' : 'Financial Advisor' }}
                </v-col>
                <v-col
                  v-if="
                    $authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  :class="planFeesForm.AllowFinancialAdvisor ? '' : 'disableClass'"
                >
                  {{ mmlAdvisorName }}
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3">
            <v-col class="mr-2 pb-2">
              <v-select
                v-model="planFeesForm.advisorSchedule"
                :label="planFeesForm.advisorSchedule ? '' : 'Select Fee Schedule'"
                :hide-details="advisoryScheduleError === true ? false : true"
                :items="advisorScheduleList"
                item-title="Name"
                item-value="FeeScheduleID"
                clearable
                auto-select-first
                :menu-props="{ overflowY: true }"
                return-object
                :error="advisoryScheduleError"
                :error-messages="advisoryScheduleErrorMsg"
                :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? false : true"
                item-props.disabled="disabled"
                @blur="checkAdvisorValue()"
                @update:model-value="getAdvisorValue(false)"
              />
            </v-col>
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-text-field
              v-model="planFeesForm.advisorName"
              :hide-details="advisoryError === true ? false : true"
              :error="advisoryError"
              :error-messages="advisoryErrorMsg"
              :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? false : true"
              @blur="checkAdvisorValue()"
            />
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-select
              v-model="planFeesForm.advisorEntryFeeType"
              :label="planFeesForm.advisorEntryFeeType ? '' : 'Select Fee Entry Type'"
              hide-details
              :items="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
                  ? entryTypeList
                  : mmlEntryTypeList
              "
              :menu-props="{ overflowY: true }"
              :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? disableAdvisorFeeType : true"
              item-props.disabled="disabled"
              @update:model-value="enableSelectedFeeType(planFeesForm.advisorEntryFeeType, 'Advisor')"
            />
          </v-col>
          <v-col v-show="showAdvisorFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="planFeesForm.advisorFee"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? disableAdvisorFee : true"
              @blur="bpsRange(), checkAdvisorValue()"
            />
          </v-col>
          <v-col v-show="showAdvisorFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="advisorDollar"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && planFeesForm.AllowFinancialAdvisor
                  ? disableAdvisorDollar
                  : true
              "
              @update:model-value="updateManagerBasis(advisorDollar, 'dollar', 'Advisor')"
              prefix="$"
              @blur="checkAdvisorValue()"
            />
          </v-col>
          <v-col v-show="showAdvisorFeeText" cols="1" sm="1">
            <v-text-field
              v-model="advisorPercent"
              v-input-mask="{
                alias: 'numeric',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && planFeesForm.AllowFinancialAdvisor
                  ? disableAdvisorPercent
                  : true
              "
              @update:model-value="updateManagerBasis(advisorPercent, 'percent', 'Advisor')"
              suffix="%"
              @blur="checkAdvisorValue()"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col
        v-if="
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          ) && $store.state.user.selectedProgram.programName !== $authz.managedPlan.PA
        "
        cols="12"
        class="mt-4 mb-4"
      >
        <v-row>
          <v-col cols="2" sm="2">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="align-self mt-2">
                {{ mmlPlatformName }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3" class="pr-2 pb-2">
            <v-select
              v-model="planFeesForm.mmlSchedule"
              hide-details
              :items="mmlScheduleList"
              item-title="Name"
              item-value="FeeScheduleID"
              clearable
              auto-select-first
              :menu-props="{ overflowY: true }"
              return-object
              :disabled="true"
              item-props.disabled="disabled"
            />
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-text-field v-model="planFeesForm.mmlName" :hide-details="true" :disabled="true" />
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-select
              v-model="planFeesForm.mmlPlatformFeeType"
              :label="planFeesForm.mmlPlatformFeeType ? '' : 'Select Fee Entry Type'"
              hide-details
              :items="entryTypeList"
              :menu-props="{ overflowY: true }"
              :disabled="true"
              item-props.disabled="disabled"
            />
          </v-col>
          <v-col cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="planFeesForm.mmlPlatformFee"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
            />
          </v-col>
          <v-col cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="mmlPlatformDollar"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
              prefix="$"
            />
          </v-col>
          <v-col cols="1" sm="1">
            <v-text-field
              v-model="mmlPlatformPercent"
              v-input-mask="{
                alias: 'numeric',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
              suffix="%"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-show="!showAdministration" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="align-self mt-2"> Administration </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3">
            <v-col class="mr-2 pb-2">
              <v-select
                v-model="planFeesForm.tpaAdminSchedule"
                :label="planFeesForm.tpaAdminSchedule ? '' : 'Select Fee Schedule'"
                hide-details
                :items="tpaAdminScheduleList"
                item-title="Name"
                item-value="FeeScheduleID"
                clearable
                auto-select-first
                :menu-props="{ overflowY: true }"
                return-object
                :disabled="
                  !$authz.allowedByProgram(
                    $authz.programPermissionSet.PCS_Aspire_Product__c,
                    $authz.pcsAspireProduct.Multi_Strategist_Product
                  ) && proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan
                    ? false
                    : true
                "
                @update:model-value="getTPAFee(), getAdminValue(false)"
                item-props.disabled="disabled"
              />
            </v-col>
          </v-col>
          <v-col cols="2" sm="2">
            <v-col class="mr-2 pb-2">
              <v-text-field
                v-model="planFeesForm.tpaAdminName"
                hide-details
                :disabled="
                  proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan
                    ? serviceType === 1
                      ? false
                      : true
                    : true
                "
              />
            </v-col>
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-select
              v-model="planFeesForm.tpaEntryFeeType"
              :label="planFeesForm.tpaEntryFeeType ? '' : 'Select Fee Entry Type'"
              hide-details
              :items="entryTypeList"
              :menu-props="{ overflowY: true }"
              item-props.disabled="disabled"
              :disabled="disableTPAEntryFeeType"
              @update:model-value="enableSelectedFeeType(planFeesForm.tpaEntryFeeType, 'Administration')"
            />
          </v-col>
          <v-col v-show="showTPAFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="planFeesForm.tpaAdminBasisFee"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="serviceType !== 0 ? disableTpaFee : true"
              @update:model-value="updateManagerBasis(planFeesForm.tpaAdminBasisFee, 'basis', 'Administration')"
            />
          </v-col>
          <v-col v-show="showTPAFeeText" cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="tpaAdminDollar"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="serviceType !== 0 ? disableTpaDollar : true"
              prefix="$"
              @update:model-value="updateManagerBasis(tpaAdminDollar, 'dollar', 'Administration')"
            />
          </v-col>
          <v-col v-show="showTPAFeeText" cols="1" sm="1">
            <v-text-field
              v-model="tpaAdminPercent"
              v-input-mask="{
                alias: 'numeric',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="serviceType !== 0 ? disableTpaPercent : true"
              suffix="%"
              @update:model-value="updateManagerBasis(tpaAdminPercent, 'percent', 'Administration')"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-show="!showRecordkeeping" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="align-self mt-2"> Recordkeeping </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3">
            <v-col class="mr-2 pb-2">
              <v-select
                v-model="planFeesForm.tparkSchedule"
                :label="planFeesForm.tparkSchedule ? '' : 'Select Fee Schedule'"
                hide-details
                :items="tparkScheduleList"
                item-title="Name"
                item-value="FeeScheduleID"
                clearable
                :menu-props="{ overflowY: true }"
                return-object
                :disabled="
                  !$authz.allowedByProgram(
                    $authz.programPermissionSet.PCS_Aspire_Product__c,
                    $authz.pcsAspireProduct.Multi_Strategist_Product
                  ) && proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan
                    ? false
                    : true
                "
                item-props.disabled="disabled"
              />
            </v-col>
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-text-field v-model="planFeesForm.tparkName" hide-details :disabled="true" />
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-select
              v-model="planFeesForm.tparkFeeType"
              :label="planFeesForm.tparkFeeType ? '' : 'Select Fee Entry Type'"
              hide-details
              :items="entryTypeList"
              :menu-props="{ overflowY: true }"
              item-props.disabled="disabled"
              :disabled="true"
            />
          </v-col>
          <v-col cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="planFeesForm.tparkBasisFee"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
            />
          </v-col>
          <v-col cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="tparkDollar"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
              prefix="$"
            />
          </v-col>
          <v-col cols="1" sm="1">
            <v-text-field
              v-model="tparkPercent"
              v-input-mask="{
                alias: 'numeric',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
              suffix="%"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-show="!showTrusteeCustodian" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="align-self mt-2"> Trustee / Custodian </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" sm="3">
            <v-col class="mr-2 pb-2">
              <v-select
                v-model="planFeesForm.trusteeSchedule"
                :label="planFeesForm.trusteeSchedule ? '' : 'Select Fee Schedule'"
                hide-details
                :items="trusteeScheduleList"
                item-title="Name"
                item-value="FeeScheduleID"
                clearable
                auto-select-first
                :menu-props="{ overflowY: true }"
                return-object
                item-props.disabled="disabled"
                :disabled="
                  !$authz.allowedByProgram(
                    $authz.programPermissionSet.PCS_Aspire_Product__c,
                    $authz.pcsAspireProduct.Multi_Strategist_Product
                  ) && proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan
                    ? false
                    : true
                "
              />
            </v-col>
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-text-field v-model="planFeesForm.trusteeName" hide-details :disabled="true" />
          </v-col>
          <v-col cols="2" sm="2" class="pr-2">
            <v-select
              v-model="planFeesForm.trusteeFeeType"
              :label="planFeesForm.trusteeFeeType ? '' : 'Select Fee Entry Type'"
              hide-details
              :items="entryTypeList"
              :menu-props="{ overflowY: true }"
              item-props.disabled="disabled"
              :disabled="true"
            />
          </v-col>
          <v-col cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="planFeesForm.trusteeBasisFee"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
            />
          </v-col>
          <v-col cols="1" sm="1" class="pr-2">
            <v-text-field
              v-model="trusteeDollar"
              v-input-mask="{
                alias: 'currency',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '0'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
              prefix="$"
            />
          </v-col>
          <v-col cols="1" sm="1">
            <v-text-field
              v-model="trusteePercent"
              v-input-mask="{
                alias: 'numeric',
                rightAlign: false,
                autoUnmask: true,
                allowMinus: false,
                digitsOptional: true,
                placeholder: '0',
                digits: '2'
              }"
              hide-details
              maxlength="13"
              :disabled="true"
              suffix="%"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-show="!showAvgInvestmentExpense" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="align-self mt-2"> Average Investment Expense </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" sm="8" />
          <v-col cols="1" sm="1" class="pl-1">
            {{ formatPrice(expenseDollar, 2) }}
          </v-col>
          <v-col cols="1" sm="1" class="pl-1"> {{ expensePercent }}% </v-col>
        </v-row>
      </v-col>
      <v-col v-show="!showMutualFundOffset" cols="12" class="mt-4 mb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="align-self mt-2"> Mutual Fund Offset </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" sm="8" />
          <v-col cols="1" sm="1" class="pl-1">
            {{ formatPrice(offsetDollar, 2) }}
          </v-col>
          <v-col cols="1" sm="1" class="pl-1"> {{ planFeesForm.offsetPercent }}% </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" :class="theme.dark ? '' : 'grey lighten-2'" class="pt-4 pb-4">
        <v-row>
          <v-col cols="2" sm="2">
            <v-row>
              <v-col cols="3" sm="3" />
              <v-col cols="9" sm="9" class="font-weight-bold"> Total </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" sm="8" />
          <v-col cols="1" sm="1" class="pl-1 font-weight-bold">
            {{ estimatedDollar ? formatPrice(estimatedDollar, 2) : 0.0 }}
          </v-col>
          <v-col cols="1" sm="1" class="pl-1 font-weight-bold"> {{ estimatedPercent ? estimatedPercent : 0.0 }}% </v-col>
          <v-col cols="1" sm="1" />
        </v-row>
      </v-col>
      <!-- end here -->
      <v-divider class="bold mt-5 mb-5" />
      <v-col cols="12" class="mt-3 mb-1">
        <v-row>
          <v-col cols="6" sm="6" class="align-self text-left">
            <h2 class="font-weight-medium">Preference</h2>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col v-show="isEmployee === 'true' || showWaiveFee" cols="4" sm="4">
            <v-switch
              v-model="planFeesForm.waiveFee2"
              :label="planId <= 0 ? 'Waive Installation Fee' : 'Waive Conversion Fee'"
              class="offsetSwitch ma-0"
              hide-details
              color="accent"
            />
          </v-col>
          <v-col v-show="isEmployee === 'true' || showWaiveFee" cols="4" sm="4">
            <v-switch
              v-model="planFeesForm.waiveFee1"
              label="Waive Plan Document Fee"
              class="offsetSwitch ma-0"
              hide-details
              color="accent"
              :disabled="serviceType === 1"
            />
          </v-col>
          <v-col
            v-show="
              showConversionFeePaidBy === 'true' &&
              !$authz.allowedByProgram(
                $authz.programPermissionSet.PCS_Aspire_Product__c,
                $authz.pcsAspireProduct.Multi_Strategist_Product
              )
            "
            cols="4"
            sm="4"
          >
            <v-col cols="11" sm="11">
              <v-switch
                v-model="planFeesForm.paidByFee2"
                :label="planId <= 0 ? 'Installation Fee Paid By' : 'Conversion Fee Paid By'"
                class="offsetSwitch ma-0"
                color="accent"
                hide-details
              />
            </v-col>
            <v-col
              v-show="
                planFeesForm.paidByFee2 &&
                showConversionFeePaidBy === 'true' &&
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
              "
              class="pt-1 pb-1"
              cols="11"
              sm="11"
            >
              <v-text-field
                v-model="planFeesForm.feePaidByFee2"
                :label="planId <= 0 ? 'Installation Fee Paid By' : 'Conversion Fee Paid By'"
                maxlength="50"
                counter="50"
                hide-details
              />
            </v-col>
          </v-col>
          <v-col
            v-show="
              showDocumentFeePaidBy === 'true' &&
              !$authz.allowedByProgram(
                $authz.programPermissionSet.PCS_Aspire_Product__c,
                $authz.pcsAspireProduct.Multi_Strategist_Product
              )
            "
            cols="4"
            sm="4"
          >
            <v-col cols="11">
              <v-switch
                v-model="planFeesForm.paidByFee1"
                label="Plan Document Fee Paid By"
                class="offsetSwitch ma-0"
                color="accent"
                hide-details
              />
            </v-col>
            <v-col v-show="planFeesForm.paidByFee1" cols="11" class="pt-1 pb-1">
              <v-text-field
                v-model="planFeesForm.feePaidByFee1"
                label="Plan Document Fee Paid By"
                maxlength="50"
                counter="50"
                hide-details
              />
            </v-col>
          </v-col>
          <v-col v-show="showIncludeAncillaryFeeSchedule" cols="4" sm="4">
            <v-switch
              v-model="planFeesForm.ancillaryFee"
              label="Include Ancillary Fee Schedule"
              class="offsetSwitch ma-0"
              hide-details
              color="accent"
            />
          </v-col>
          <v-col v-show="showIncludeModelSummaryPages" cols="4" sm="4">
            <v-switch
              v-model="planFeesForm.excludeSummary"
              label="Include Model Summary Pages"
              class="offsetSwitch ma-0"
              hide-details
              color="accent"
            />
          </v-col>
          <v-col v-show="$store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager" cols="4" sm="4">
            <v-switch
              v-model="planFeesForm.brinker"
              label="Use standard PCS Proposal"
              class="offsetSwitch ma-0"
              hide-details
              color="accent"
            />
          </v-col>
          <v-col v-show="!hideExchangeTradedFunds" cols="4" sm="4">
            <v-switch
              v-model="planFeesForm.exchangeTradedFunds"
              label="`Exchange Traded Funds(ETFs)?`"
              class="offsetSwitch ma-0"
              hide-details
              color="accent"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <v-col cols="12" class="pa-0" v-if="display.smAndDown.value">
      <v-card flat :class="theme.dark ? '' : 'expandable'">
        <v-card-text class="pl-0 pr-0 pt-1">
          <v-col>
            <v-col v-show="showProfessionalService === 'true'" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" sm="6" class="mb-2">
                      <h5 class="pt-1">
                        <span class="text-grey">Fee Type</span>
                      </h5>
                      <h4>Professional Services</h4>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                      </v-col>
                      <v-col cols="12">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.providerSchedule"
                            hide-details
                            :items="providerScheduleList"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            :menu-props="{ overflowY: true }"
                            return-object
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                                ? false
                                : true
                            "
                            item-props.disabled="disabled"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Company Name</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.providerName"
                            hide-details
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                                ? false
                                : true
                            "
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.providerEntryFeeType"
                            hide-details
                            :items="entryTypeList"
                            :menu-props="{ overflowY: true }"
                            item-props.disabled="disabled"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                                ? disableProviderFeeType
                                : true
                            "
                            @update:model-value="enableSelectedFeeType(planFeesForm.providerEntryFeeType, 'Provider')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showProviderFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.providerFee"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                                ? disableProviderFee
                                : true
                            "
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showProviderFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="providerDollar"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                                ? disableProviderDollar
                                : true
                            "
                            prefix="$"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showProviderFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="providerPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                                ? disableProviderPercent
                                : true
                            "
                            suffix="%"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider v-show="showProfessionalService === 'true'" class="bold my-2" />
            <v-col v-show="!showInvestmentManager" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="3" sm="1" class="flex_none pr-2 mb-2">
                      <v-switch
                        v-model="planFeesForm.AllowInvestmentManager"
                        class="offsetSwitch ma-0"
                        hide-details
                        color="accent"
                        v-if="
                          !$authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                        :disabled="
                          !$authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                            ? false
                            : true
                        "
                        @update:model-value="checkInvestmentManager(planFeesForm.AllowInvestmentManager)"
                      />
                    </v-col>
                    <v-col cols="9" sm="5" class="mb-2">
                      <h5 class="pt-1">
                        <span class="text-grey">Fee Type</span>
                      </h5>
                      <h4
                        v-if="
                          !$authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                        :class="planFeesForm.AllowInvestmentManager ? '' : 'disableClass'"
                      >
                        Investment Manager
                      </h4>
                      <h4
                        v-if="
                          $authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                        :class="planFeesForm.AllowInvestmentManager ? '' : 'disableClass'"
                      >
                        {{ mmlInvestmentName }}
                      </h4>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                      </v-col>
                      <v-col cols="12">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.managerSchedule"
                            hide-details
                            :items="managerScheduleList"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            :menu-props="{ overflowY: true }"
                            return-object
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowInvestmentManager
                                ? false
                                : true
                            "
                            item-props.disabled="disabled"
                            @blur="checkinvestmentManagerValue()"
                            @update:model-value="getManagerValue(false)"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Company Name</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.managerName"
                            :hide-details="investmentManagerError === true ? false : true"
                            :error="investmentManagerError"
                            :error-messages="investmentManagerErrorMsg"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowInvestmentManager
                                ? false
                                : true
                            "
                            @blur="checkinvestmentManagerValue()"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.managerEntryFeeType"
                            hide-details
                            :items="entryTypeList"
                            :menu-props="{ overflowY: true }"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowInvestmentManager
                                ? disableManagerFeeType
                                : true
                            "
                            item-props.disabled="disabled"
                            @update:model-value="enableSelectedFeeType(planFeesForm.managerEntryFeeType, 'Investment')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showManagerFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.managerFee"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowInvestmentManager
                                ? disableManagerFee
                                : true
                            "
                            @blur="checkinvestmentManagerValue()"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showManagerFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="managerDollar"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowInvestmentManager
                                ? disableManagerDollar
                                : true
                            "
                            prefix="$"
                            @update:model-value="updateManagerBasis(managerDollar, 'dollar', 'Investment')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showManagerFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="managerPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowInvestmentManager
                                ? disableManagerPercent
                                : true
                            "
                            suffix="%"
                            @update:model-value="updateManagerBasis(managerPercent, 'percent', 'Investment')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider v-show="!showFinancialAdvisor" class="bold my-2" />
            <v-col v-show="!showFinancialAdvisor" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="3" sm="1" class="flex_none pr-2 mb-2">
                      <v-switch
                        v-model="planFeesForm.AllowFinancialAdvisor"
                        class="offsetSwitch ma-0"
                        color="accent"
                        hide-details
                        v-if="
                          showAdvisorEditIcon &&
                          !$authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                        :disabled="
                          showAdvisorEditIcon &&
                          !$authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                            ? false
                            : true
                        "
                        @update:model-value="checkFinancialAdvisor(planFeesForm.AllowFinancialAdvisor)"
                      />
                    </v-col>
                    <v-col cols="9" sm="5" class="mb-2">
                      <h5 class="pt-1">
                        <span class="text-grey">Fee Type</span>
                      </h5>
                      <h4
                        v-if="
                          !$authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                        :class="planFeesForm.AllowFinancialAdvisor ? '' : 'disableClass'"
                      >
                        {{ enterpriseName === 'Park Avenue Securities' ? 'Soliciting Advisor' : 'Financial Advisor' }}
                      </h4>
                      <h4
                        v-if="
                          $authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                        :class="planFeesForm.AllowFinancialAdvisor ? '' : 'disableClass'"
                      >
                        {{ mmlAdvisorName }}
                      </h4>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                      </v-col>
                      <v-col cols="12">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.advisorSchedule"
                            hide-details
                            :items="advisorScheduleList"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            auto-select-first
                            :menu-props="{ overflowY: true }"
                            return-object
                            :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? false : true"
                            item-props.disabled="disabled"
                            @blur="checkAdvisorValue()"
                            @update:model-value="getAdvisorValue(false)"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Company Name</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.advisorName"
                            :hide-details="advisoryError === true ? false : true"
                            :error="advisoryError"
                            :error-messages="advisoryErrorMsg"
                            :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? false : true"
                            @blur="checkAdvisorValue()"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.advisorEntryFeeType"
                            hide-details
                            :items="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              )
                                ? entryTypeList
                                : mmlEntryTypeList
                            "
                            clearable
                            :menu-props="{ overflowY: true }"
                            :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? disableAdvisorFeeType : true"
                            item-props.disabled="disabled"
                            @update:model-value="enableSelectedFeeType(planFeesForm.advisorEntryFeeType, 'Advisor')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showAdvisorFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.advisorFee"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="showAdvisorEditIcon && planFeesForm.AllowFinancialAdvisor ? disableAdvisorFee : true"
                            @blur="bpsRange(), checkAdvisorValue()"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showAdvisorFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="advisorDollar"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowFinancialAdvisor
                                ? disableAdvisorDollar
                                : true
                            "
                            prefix="$"
                            @update:model-value="updateManagerBasis(advisorDollar, 'dollar', 'Advisor')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showAdvisorFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="advisorPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && planFeesForm.AllowFinancialAdvisor
                                ? disableAdvisorPercent
                                : true
                            "
                            suffix="%"
                            @update:model-value="updateManagerBasis(advisorPercent, 'percent', 'Advisor')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider
              v-if="
                $authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && $store.state.user.selectedProgram.programName !== $authz.managedPlan.PA
              "
              class="bold my-2"
            />
            <v-col
              v-if="
                $authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                ) && $store.state.user.selectedProgram.programName !== $authz.managedPlan.PA
              "
              cols="12"
              class="pl-2 pr-2 pb-2"
            >
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" sm="6" class="mb-2">
                      <h5 class="pt-1">
                        <span class="text-grey">Fee Type</span>
                      </h5>
                      <h4>{{ mmlPlatformName }}</h4>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                      </v-col>
                      <v-col cols="12">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.mmlSchedule"
                            label="Select Fee Schedule"
                            hide-details
                            :items="mmlScheduleList"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            auto-select-first
                            :menu-props="{ overflowY: true }"
                            return-object
                            :disabled="true"
                            item-props.disabled="disabled"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Company Name</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field v-model="planFeesForm.mmlName" :hide-details="true" :disabled="true" />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.mmlPlatformFeeType"
                            hide-details
                            :items="entryTypeList"
                            :menu-props="{ overflowY: true }"
                            :disabled="true"
                            item-props.disabled="disabled"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.mmlPlatformFee"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="mmlPlatformDollar"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                            prefix="$"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="mmlPlatformPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                            suffix="%"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider v-show="!showAdministration" class="bold my-2" />
            <v-col v-show="!showAdministration" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" sm="6" class="mb-2">
                      <h5 class="pt-1">
                        <span class="text-grey">Fee Type</span>
                      </h5>
                      <h4>Administration</h4>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                      </v-col>
                      <v-col cols="12">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.tpaAdminSchedule"
                            hide-details
                            :items="tpaAdminScheduleList"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            auto-select-first
                            :menu-props="{ overflowY: true }"
                            return-object
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) &&
                              proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan &&
                              serviceType === 0
                                ? false
                                : true
                            "
                            @update:model-value="getTPAFee(), getAdminValue(false)"
                            item-props.disabled="disabled"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Company Name</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.tpaAdminName"
                            hide-details
                            :disabled="
                              proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan
                                ? serviceType === 1
                                  ? false
                                  : true
                                : true
                            "
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.tpaEntryFeeType"
                            hide-details
                            :items="entryTypeList"
                            :menu-props="{ overflowY: true }"
                            item-props.disabled="disabled"
                            :disabled="serviceType === 0"
                            @update:model-value="enableSelectedFeeType(planFeesForm.tpaEntryFeeType, 'Administration')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showTPAFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.tpaAdminBasisFee"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="serviceType !== 0 ? disableTpaFee : true"
                            @update:model-value="updateManagerBasis(planFeesForm.tpaAdminBasisFee, 'basis', 'Administration')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showTPAFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="tpaAdminDollar"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="serviceType !== 0 ? disableTpaDollar : true"
                            prefix="$"
                            @update:model-value="updateManagerBasis(tpaAdminDollar, 'dollar', 'Administration')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col v-show="showTPAFeeText" cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="tpaAdminPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="serviceType !== 0 ? disableTpaPercent : true"
                            suffix="%"
                            @update:model-value="updateManagerBasis(tpaAdminPercent, 'percent', 'Administration')"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider v-show="!showRecordkeeping" class="bold my-2" />
            <v-col v-show="!showRecordkeeping" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" sm="6" class="mb-2">
                      <h5 class="pt-1">
                        <span class="text-grey">Fee Type</span>
                      </h5>
                      <h4>Recordkeeping</h4>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                      </v-col>
                      <v-col cols="12">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.tparkSchedule"
                            hide-details
                            :items="tparkScheduleList"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            :menu-props="{ overflowY: true }"
                            return-object
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan
                                ? false
                                : true
                            "
                            item-props.disabled="disabled"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Company Name</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field v-model="planFeesForm.tparkName" hide-details :disabled="true" />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.tparkFeeType"
                            hide-details
                            :items="entryTypeList"
                            :menu-props="{ overflowY: true }"
                            item-props.disabled="disabled"
                            :disabled="true"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.tparkBasisFee"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="tparkDollar"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                            prefix="$"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="tparkPercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                            suffix="%"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider v-show="!showTrusteeCustodian" class="bold my-2" />
            <v-col v-show="!showTrusteeCustodian" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" sm="6" class="mb-2">
                      <h5 class="pt-1">
                        <span class="text-grey">Fee Type</span>
                      </h5>
                      <h4>Trustee / Custodian</h4>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Schedule</h5>
                      </v-col>
                      <v-col cols="12">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.trusteeSchedule"
                            hide-details
                            :items="trusteeScheduleList"
                            item-title="Name"
                            item-value="FeeScheduleID"
                            clearable
                            auto-select-first
                            :menu-props="{ overflowY: true }"
                            return-object
                            item-props.disabled="disabled"
                            :disabled="
                              !$authz.allowedByProgram(
                                $authz.programPermissionSet.PCS_Aspire_Product__c,
                                $authz.pcsAspireProduct.Multi_Strategist_Product
                              ) && proposalPlan.ESPType != $authz.firmRelationship.Pooled_Employer_Plan
                                ? false
                                : true
                            "
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Company Name</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field v-model="planFeesForm.trusteeName" hide-details :disabled="true" />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="6" sm="6" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Fee Entry Type</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-select
                            v-model="planFeesForm.trusteeFeeType"
                            hide-details
                            :items="entryTypeList"
                            :menu-props="{ overflowY: true }"
                            item-props.disabled="disabled"
                            :disabled="true"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Basis Points</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="planFeesForm.trusteeBasisFee"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost ($)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="trusteeDollar"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '0'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                            prefix="$"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                    <v-col cols="4" sm="4" class="mb-2">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost (%)</h5>
                      </v-col>
                      <v-col cols="12" class="mb-1">
                        <v-col cols="11">
                          <v-text-field
                            v-model="trusteePercent"
                            v-input-mask="{
                              alias: 'numeric',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0',
                              digits: '2'
                            }"
                            hide-details
                            maxlength="13"
                            :disabled="true"
                            suffix="%"
                          />
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider v-show="!showAvgInvestmentExpense" class="bold my-2" />
            <v-col v-show="!showAvgInvestmentExpense" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12" class="mb-2">
                  <h5 class="pt-1">
                    <span class="text-grey">Fee Type</span>
                  </h5>
                  <h4>Average Investment Expense</h4>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost($)</h5>
                      </v-col>
                      <v-col cols="12">
                        <h4>{{ formatPrice(expenseDollar, 2) }}</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="6">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost(%)</h5>
                      </v-col>
                      <v-col cols="12">
                        <h4>{{ expensePercent }}%</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-divider v-show="!showMutualFundOffset" class="bold my-2" />
            <v-col v-show="!showMutualFundOffset" cols="12" class="pl-2 pr-2 pb-2">
              <v-row>
                <v-col cols="12" class="mb-2">
                  <h5 class="pt-1">
                    <span class="text-grey">Fee Type</span>
                  </h5>
                  <h4>Mutual Fund Offset</h4>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost($)</h5>
                      </v-col>
                      <v-col cols="12">
                        <h4>{{ formatPrice(offsetDollar, 2) }}</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="6">
                      <v-col cols="12">
                        <h5 class="pl-0 pb-0 text-grey">Cost(%)</h5>
                      </v-col>
                      <v-col cols="12">
                        <h4>{{ planFeesForm.offsetPercent }}%</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <!-- here -->
            <v-divider class="bold mt-1 mb-0" />
            <v-col cols="12" class="bg-grey-lighten-3 pt-2 pb-2 pl-2 pr-2">
              <v-row>
                <v-col cols="6">
                  <v-col cols="12">
                    <v-col cols="12">
                      <h5 class="pl-0 pb-0 text-grey">Estimated Cost($)</h5>
                    </v-col>
                    <v-col cols="12">
                      <h4>
                        {{ estimatedDollar ? formatPrice(estimatedDollar, 2) : 0.0 }}
                      </h4>
                    </v-col>
                  </v-col>
                </v-col>
                <v-col cols="6">
                  <v-col cols="12">
                    <v-col cols="12">
                      <h5 class="pl-0 pb-0 text-grey">Estimated Cost(%)</h5>
                    </v-col>
                    <v-col cols="12">
                      <h4>{{ estimatedPercent ? estimatedPercent : 0.0 }}%</h4>
                    </v-col>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mt-5 mb-3 pl-2 pr-2">
              <v-row>
                <v-col cols="6" sm="6" class="align-self text-left">
                  <h2 class="font-weight-medium">Preference</h2>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pl-2 pr-2">
              <v-row>
                <v-col v-show="isEmployee === 'true' || showWaiveFee" cols="12">
                  <v-switch
                    v-model="planFeesForm.waiveFee2"
                    :label="planId <= 0 ? 'Waive Installation Fee' : 'Waive Conversion Fee'"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                  />
                </v-col>
                <v-col v-show="isEmployee === 'true' || showWaiveFee" cols="12">
                  <v-switch
                    v-model="planFeesForm.waiveFee1"
                    label="Waive Plan Document Fee"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                    :disabled="serviceType === 1"
                  />
                </v-col>
                <v-col
                  v-show="
                    showConversionFeePaidBy === 'true' &&
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  cols="12"
                >
                  <v-switch
                    v-model="planFeesForm.paidByFee2"
                    :label="planId <= 0 ? 'Installation Fee Paid By' : 'Conversion Fee Paid By'"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                  />
                </v-col>
                <v-col
                  v-show="
                    planFeesForm.paidByFee2 &&
                    showConversionFeePaidBy === 'true' &&
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  cols="12"
                >
                  <v-col cols="11" sm="11">
                    <v-text-field
                      v-model="planFeesForm.feePaidByFee2"
                      :label="planId <= 0 ? 'Installation Fee Paid By' : 'Conversion Fee Paid By'"
                      maxlength="50"
                      counter="50"
                    />
                  </v-col>
                </v-col>
                <v-col
                  v-show="
                    showDocumentFeePaidBy === 'true' &&
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  cols="12"
                >
                  <v-switch
                    v-model="planFeesForm.paidByFee1"
                    label="Plan Document Fee Paid By"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                  />
                </v-col>
                <v-col
                  v-show="
                    planFeesForm.paidByFee1 &&
                    showDocumentFeePaidBy === 'true' &&
                    !$authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                  cols="12"
                >
                  <v-col cols="11">
                    <v-text-field
                      v-model="planFeesForm.feePaidByFee1"
                      label="Plan Document Fee Paid By"
                      counter="50"
                      maxlength="50"
                    />
                  </v-col>
                </v-col>
                <v-col v-show="showIncludeAncillaryFeeSchedule" cols="12">
                  <v-switch
                    v-model="planFeesForm.ancillaryFee"
                    label="Include Ancillary Fee Schedule"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                  />
                </v-col>
                <v-col v-show="!hideExchangeTradedFunds" cols="4" sm="4">
                  <v-switch
                    v-model="planFeesForm.exchangeTradedFunds"
                    label="`Exchange Traded Funds(ETFs)?`"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                  />
                </v-col>
                <v-col v-show="showIncludeModelSummaryPages" cols="12">
                  <v-switch
                    v-model="planFeesForm.excludeSummary"
                    label="Include Model Summary Pages"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                  />
                </v-col>
                <v-col v-show="$store.state.user.id.indexOf('@brinkercapital.com') !== -1 || brinkerManager" cols="12">
                  <v-switch
                    v-model="planFeesForm.brinker"
                    label="Use standard PCS Proposal"
                    class="offsetSwitch ma-0"
                    hide-details
                    color="accent"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>
  </v-layout>
</template>
<script>
  import { ref, computed, watch, onMounted, getCurrentInstance, inject, onBeforeUnmount } from 'vue'
  import { useDisplay, useTheme } from 'vuetify'
  import { useRoute } from 'vue-router'
  export default {
    props: ['planId', 'SEINPNO', 'selectedPlan', 'proposalPlan', 'saveProposalPlanFeesMethod', 'checkStandardPcs'],
    setup(props, { emit }) {
      const eventBus = inject('eventBus')
      const display = useDisplay()
      const theme = useTheme()
      const instance = getCurrentInstance()
      const $axios = instance.appContext.config.globalProperties.$axios
      const $store = instance.appContext.config.globalProperties.$store
      const $authz = instance.appContext.config.globalProperties.$authz
      const $toast = instance.appContext.config.globalProperties.$toast
      const $route = useRoute()
      const managerPercent = ref(0.0)
      const managerDollar = ref(0.0)
      const managerScheduleList = ref([])
      const providerScheduleList = ref([])
      const providerDollar = ref(0.0)
      const providerPercent = ref(0.0)
      const advisorScheduleList = ref([])
      const advisorDollar = ref(0.0)
      const advisorPercent = ref(0.0)
      const tpaAdminScheduleList = ref([])
      const tpaAdminDollar = ref(0.0)
      const tpaAdminPercent = ref(0.0)
      const tparkScheduleList = ref([])
      const tparkDollar = ref(0.0)
      const tparkPercent = ref(0.0)
      const trusteeScheduleList = ref([])
      const trusteeDollar = ref(0.0)
      const trusteePercent = ref(0.0)
      const expenseDollar = ref(0.0)
      const expensePercent = ref(0.0)
      const offsetDollar = ref(0.0)
      const estimatedDollar = ref(0.0)
      const estimatedPercent = ref(0.0)
      const mmlPlatformDollar = ref(0.0)
      const mmlPlatformPercent = ref(0.0)
      const saveProvider = ref(false)
      const saveManager = ref(false)
      const saveAdvisor = ref(false)
      const saveAdmin = ref(false)
      const saveTpark = ref(false)
      const saveTrustee = ref(false)
      const saveOffset = ref(false)
      const offsetError = ref(false)
      const offsetErrorMsg = ref('')
      const deleteOffset = ref(false)
      const outsideAmount = ref(0)
      const stockAmount = ref(0)
      const outside = ref(0)
      const stock = ref(0)
      const etf = ref(0)
      const fiduciaryServices = ref(0)
      const subCustodian = ref('')
      const adminFiduciary = ref(0)
      const serviceType = ref(0)
      const totalAssets = ref(0)
      const totalParticipant = ref(0)
      const planType = ref('')
      const tpaAdminFeeType = ref(1)
      const showInvestmentManager = ref(false)
      const showFinancialAdvisor = ref(false)
      const showAdministration = ref(false)
      const showRecordkeeping = ref(false)
      const showTrusteeCustodian = ref(false)
      const showAvgInvestmentExpense = ref(false)
      const showMutualFundOffset = ref(false)
      const showIncludeAncillaryFeeSchedule = ref(false)
      const showIncludeModelSummaryPages = ref(false)
      const trusteeCustodian = ref('')
      const isEmployee = ref('')
      const showProfessionalService = ref('')
      const enterpriseName = ref('')
      const showConversionFeePaidBy = ref('')
      const showDocumentFeePaidBy = ref('')
      const accessSponsor = ref('')
      const assignedRKOnly = ref('')
      const assignedCustodianOnly = ref('')
      const offsetOverrideFee = ref(0)
      const expenseFee = ref(0)
      const adminFiduciaryFee = ref(0)
      const trusteeAmount = ref(0)
      const advisorAmount = ref(0)
      const advisorFee = ref(0)
      const managerAmount = ref(0)
      const providerAmount = ref(0)
      const offsetAmount = ref(0)
      const loadTypeValue = ref('')
      const successTrustee = ref(false)
      const successRecordkeeping = ref(false)
      const successAdministration = ref(false)
      const successAdvisory = ref(false)
      const successTPAFee = ref(false)
      const successOffsetOverride = ref(false)
      const successOffset = ref(false)
      const successExpense = ref(false)
      const successEstimated = ref(false)
      const hideExchangeTradedFunds = ref(false)
      const planFeesForm = ref({
        providerName: '',
        providerFeeType: '',
        providerFee: 0,
        providerSchedule: '',
        providerEntryFeeType: '',
        managerName: '',
        managerFeeType: '',
        managerEntryFeeType: '',
        managerFee: 0,
        managerSchedule: '',
        advisorName: '',
        advisorFeeType: '',
        advisorEntryFeeType: '',
        advisorFee: 0,
        advisorSchedule: '',
        mmlSchedule: '',
        mmlPlatformFeeType: '',
        mmlPlatformFee: 0,
        mmlName: '',
        tpaAdminName: '',
        tpaAdminSchedule: '',
        tpaAdminFee: 0,
        tpaAdminBasisFee: 0,
        tpaEntryFeeType: '',
        tpaFeeType: '',
        tparkSchedule: '',
        tparkFee: 0,
        tparkName: '',
        tparkFeeType: '',
        tparkBasisFee: 0,
        trusteeSchedule: '',
        trusteeFee: 0,
        trusteeName: '',
        trusteeFeeType: '',
        trusteeBasisFee: 0,
        offsetPercent: 0,
        waiveFee2: false,
        waiveFee1: false,
        paidByFee2: false,
        feePaidByFee2: '',
        paidByFee1: false,
        feePaidByFee1: '',
        ancillaryFee: false,
        exchangeTradedFunds: false,
        ETF: 0,
        excludeSummary: false,
        brinker: false,
        hidePresentation: false,
        tpaAdminFeeType: 1,
        expenseFee: 0,
        offsetAmount: 0,
        offsetOverrideFee: 0,
        AllowInvestmentManager: true,
        AllowFinancialAdvisor: true
      })
      const oldPlanFeesForm = ref({
        providerName: '',
        providerFeeType: '',
        providerFee: 0,
        providerSchedule: '',
        providerEntryFeeType: '',
        managerName: '',
        managerFeeType: '',
        managerEntryFeeType: '',
        managerFee: 0,
        managerSchedule: '',
        advisorName: '',
        advisorFeeType: '',
        advisorEntryFeeType: '',
        advisorFee: 0,
        advisorSchedule: '',
        mmlSchedule: '',
        mmlPlatformFeeType: '',
        mmlPlatformFee: 0,
        mmlName: '',
        tpaAdminName: '',
        tpaAdminSchedule: '',
        tpaAdminFee: 0,
        tpaAdminBasisFee: 0,
        tpaFeeType: '',
        tpaEntryFeeType: '',
        tparkSchedule: '',
        tparkFee: 0,
        tparkName: '',
        tparkFeeType: '',
        tparkBasisFee: 0,
        trusteeSchedule: '',
        trusteeFee: 0,
        trusteeName: '',
        trusteeFeeType: '',
        trusteeBasisFee: 0,
        offsetPercent: 0,
        waiveFee2: false,
        waiveFee1: false,
        paidByFee2: false,
        feePaidByFee2: '',
        paidByFee1: false,
        feePaidByFee1: '',
        ancillaryFee: false,
        exchangeTradedFunds: false,
        ETF: 0,
        excludeSummary: false,
        brinker: false,
        hidePresentation: false,
        tpaAdminFeeType: 1,
        expenseFee: 0,
        offsetAmount: 0,
        offsetOverrideFee: 0,
        AllowInvestmentManager: true,
        AllowFinancialAdvisor: true
      })
      const recordkeepingFeeMsg = ref('')
      const successProviderFee = ref(false)
      const successManagerFee = ref(false)
      const succeessAdvisorFee = ref(false)
      const successTparkFee = ref(false)
      const succeessTrusteeFee = ref(false)
      const brinkerManager = ref(false)
      const custodiansList = ref([])
      const subCustodiansList = ref([])
      const feesAdjusted = ref(false)
      const mmlInvestmentName = ref('')
      const mmlAdvisorName = ref('')
      const mmlPlatformName = ref('')
      const minAdvisoryFee = ref(0)
      const maxAdvisoryFee = ref(0)
      const investmentManagerError = ref(false)
      const investmentManagerErrorMsg = ref('')
      const advisoryError = ref(false)
      const advisoryErrorMsg = ref('')
      const entryTypeList = ref([
        {
          text: 'Basis Points',
          value: 1,
          disabled: false
        },
        {
          text: 'Cost ($)',
          value: 2,
          disabled: false
        },
        {
          text: 'Cost (%)',
          value: 3,
          disabled: false
        },
        {
          text: 'Fee Schedule',
          value: 4,
          disabled: true
        }
      ])
      const mmlEntryTypeList = ref([
        {
          text: 'Basis Points',
          value: 1,
          disabled: false
        },
        {
          text: 'Cost ($)',
          value: 2,
          disabled: true
        },
        {
          text: 'Cost (%)',
          value: 3,
          disabled: true
        },
        {
          text: 'Fee Schedule',
          value: 4,
          disabled: true
        }
      ])
      const mmlScheduleList = ref([
        {
          Name: 'Enter Fees Manually',
          FeeScheduleID: 0,
          MinimumFee: 0,
          MaximumFee: 0,
          DefaultFeeSchedule: false
        }
      ])
      const manageFeeValue = ref(0)
      const advisorFeeValue = ref(0)
      const manageFeeTypeValue = ref('manual')
      const advisorFeeTypeValue = ref('manual')
      const manageScheduleValue = ref('')
      const advisorScheduleValue = ref('')
      const managerDollarValue = ref(0)
      const advisorDollarValue = ref(0)
      const managerPercentValue = ref(0)
      const advisorPercentValue = ref(0)
      const feesAdjustedMessage = ref('')
      const professionalFeeMsg = ref('')
      const investmentManagerFeeMsg = ref('')
      const financialAdvisorFeeMsg = ref('')
      const custodianFeesMsg = ref('')
      const administrationFeesMsg = ref('')
      const disableProviderFeeType = ref(true)
      const disableProviderFee = ref(true)
      const disableProviderDollar = ref(true)
      const disableProviderPercent = ref(true)
      const disableManagerFeeType = ref(true)
      const disableManagerFee = ref(true)
      const disableManagerDollar = ref(true)
      const disableManagerPercent = ref(true)
      const disableAdvisorFeeType = ref(true)
      const disableAdvisorFee = ref(true)
      const disableAdvisorDollar = ref(true)
      const disableAdvisorPercent = ref(true)
      const disableTpaFeeType = ref(true)
      const disableTpaFee = ref(true)
      const disableTpaDollar = ref(true)
      const disableTpaPercent = ref(true)
      const showManagerFeeText = ref(true)
      const showAdvisorFeeText = ref(true)
      const showProviderFeeText = ref(true)
      const showTPAFeeText = ref(true)
      const advisorEntryFeeValue = ref('')
      const advisorName = ref('')
      const managerName = ref('')
      const managerEntryFeeType = ref('')
      const disableTPAEntryFeeType = ref(true)
      const oldManagerPercent = ref(0.0)
      const oldManagerDollar = ref(0.0)
      const oldAdvisorPercent = ref(0.0)
      const oldAdvisorDollar = ref(0.0)
      const oldTPAAdminPercent = ref(0.0)
      const oldTPAAdminDollar = ref(0.0)
      const tpaDiscountValue = ref(0)
      const investmentManagerScheduleError = ref(false)
      const investmentManagerScheduleErrorMsg = ref('')
      const advisoryScheduleError = ref(false)
      const advisoryScheduleErrorMsg = ref('')
      function getTPADiscount() {
        var tpaDiscount = {
          Participants:
            props.proposalPlan.PARTIC !== null && props.proposalPlan.PARTIC > 0
              ? props.proposalPlan.PARTIC
              : props.selectedPlan.PARTIC,
          ServiceType: props.proposalPlan.ServiceType,
          ProposalType: props.proposalPlan.ESPType,
          PlanType: props.proposalPlan.DCPTYPE === '' ? props.selectedPlan.DCPTYPE : props.proposalPlan.DCPTYPE
        }
        $axios.post(`/api/v1/tal/plan/tpadiscount`, tpaDiscount).then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            tpaDiscountValue.value = success.data.d[0].DiscountAmount ? success.data.d[0].DiscountAmount : 0
          } else tpaDiscountValue.value = 0
        })
      }
      function getManagerValue(assign) {
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          if (planFeesForm.value.managerSchedule !== null || planFeesForm.value.managerSchedule !== '') {
            planFeesForm.value.managerFeeType = 'manual'
            planFeesForm.value.managerEntryFeeType = 1
            disableManagerFeeType.value = true
            disableManagerFee.value = true
            disableManagerDollar.value = true
            disableManagerPercent.value = true
            showManagerFeeText.value = true
            investmentManagerFeeMsg.value = ''
          } else {
            disableManagerFeeType.value = true
            disableManagerFee.value = true
            disableManagerDollar.value = true
            disableManagerPercent.value = true
            planFeesForm.value.managerFee = 0
            planFeesForm.value.managerEntryFeeType = ''
            showManagerFeeText.value = true
            planFeesForm.value.managerFeeType = 'manual'
          }
        } else {
          if (planFeesForm.value.managerSchedule) {
            if (typeof planFeesForm.value.managerSchedule === 'object') {
              if (planFeesForm.value.managerSchedule.FeeScheduleID === 0) {
                planFeesForm.value.managerFeeType = 'manual'
                planFeesForm.value.managerEntryFeeType = assign ? planFeesForm.value.managerEntryFeeType : ''
                if (assign) {
                  disableManagerFee.value = planFeesForm.value.managerEntryFeeType === 1 ? false : true
                  disableManagerDollar.value = planFeesForm.value.managerEntryFeeType === 2 ? false : true
                  disableManagerPercent.value = planFeesForm.value.managerEntryFeeType === 3 ? false : true
                } else {
                  disableManagerFee.value = true
                  disableManagerDollar.value = true
                  disableManagerPercent.value = true
                  planFeesForm.value.managerFee = 0
                  managerDollar.value = 0
                  managerPercent.value = 0
                }
                disableManagerFeeType.value = false
                showManagerFeeText.value = assign ? true : false
                investmentManagerFeeMsg.value = ''
              } else {
                planFeesForm.value.managerFeeType = 'feeSchedule'
                planFeesForm.value.managerEntryFeeType = 4
                disableManagerFeeType.value = true
                disableManagerFee.value = true
                disableManagerDollar.value = true
                disableManagerPercent.value = true
                showManagerFeeText.value = true
              }
            }
          } else {
            disableManagerFeeType.value = true
            disableManagerFee.value = true
            disableManagerDollar.value = true
            disableManagerPercent.value = true
            planFeesForm.value.managerFee = 0
            planFeesForm.value.managerEntryFeeType = ''
            showManagerFeeText.value = false
            planFeesForm.value.managerFeeType = ''
          }
        }
        if (assign) {
          oldPlanFeesForm.value.managerFeeType = planFeesForm.value.managerFeeType
          oldPlanFeesForm.value.managerEntryFeeType = planFeesForm.value.managerEntryFeeType
          oldPlanFeesForm.value.managerFee = planFeesForm.value.managerFee
        }
      }
      function getAdvisorValue(assign) {
        if (planFeesForm.value.advisorSchedule) {
          if (typeof planFeesForm.value.advisorSchedule === 'object') {
            if (planFeesForm.value.advisorSchedule.FeeScheduleID === 0) {
              planFeesForm.value.advisorFeeType = 'manual'
              planFeesForm.value.advisorEntryFeeType = assign ? planFeesForm.value.advisorEntryFeeType : ''
              disableAdvisorFeeType.value = false
              if (assign) {
                disableAdvisorFee.value = planFeesForm.value.advisorEntryFeeType === 1 ? false : true
                disableAdvisorDollar.value = planFeesForm.value.advisorEntryFeeType === 2 ? false : true
                disableAdvisorPercent.value = planFeesForm.value.advisorEntryFeeType === 3 ? false : true
              } else {
                disableAdvisorFee.value = true
                disableAdvisorDollar.value = true
                disableAdvisorPercent.value = true
                planFeesForm.value.advisorFee = 0
                advisorDollar.value = 0
                advisorPercent.value = 0
              }
              showAdvisorFeeText.value = assign ? true : false
              financialAdvisorFeeMsg.value = ''
            } else {
              planFeesForm.value.advisorFeeType = 'feeSchedule'
              planFeesForm.value.advisorEntryFeeType = 4
              disableAdvisorFeeType.value = true
              disableAdvisorFee.value = true
              disableAdvisorDollar.value = true
              disableAdvisorPercent.value = true
              showAdvisorFeeText.value = true
            }
          }
        } else {
          disableAdvisorFeeType.value = true
          disableAdvisorFee.value = true
          disableAdvisorDollar.value = true
          disableAdvisorPercent.value = true
          planFeesForm.value.advisorFee = 0
          planFeesForm.value.advisorEntryFeeType = ''
          showAdvisorFeeText.value = false
          planFeesForm.value.advisorFeeType = ''
        }
        if (assign) {
          oldPlanFeesForm.value.advisorFeeType = planFeesForm.value.advisorFeeType
          oldPlanFeesForm.value.advisorEntryFeeType = planFeesForm.value.advisorEntryFeeType
          oldPlanFeesForm.value.advisorFee = planFeesForm.value.advisorFee
        }
      }
      function getAdminValue(assign) {
        if (planFeesForm.value.tpaAdminSchedule) {
          if (typeof planFeesForm.value.tpaAdminSchedule === 'object') {
            if (planFeesForm.value.tpaAdminSchedule.FeeScheduleID === -1) {
              if (props.proposalPlan.TPAName === 'PCS Retirement') {
                planFeesForm.value.tpaAdminName = props.proposalPlan.AboutTPA
              } else {
                planFeesForm.value.tpaAdminName = props.proposalPlan.TPAName
              }
              planFeesForm.value.tpaEntryFeeType = ''
              disableTpaFeeType.value = true
              disableTpaFee.value = true
              disableTpaDollar.value = true
              disableTpaPercent.value = true
              planFeesForm.value.tpaAdminFee = 0
              planFeesForm.value.tpaAdminBasisFee = 0
              tpaAdminDollar.value = 0
              tpaAdminPercent.value = 0
              showTPAFeeText.value = false
              administrationFeesMsg.value = ''
              disableTPAEntryFeeType.value = true
            } else if (planFeesForm.value.tpaAdminSchedule.FeeScheduleID === 0) {
              planFeesForm.value.tpaEntryFeeType = assign ? planFeesForm.value.tpaEntryFeeType : ''
              disableTpaFeeType.value = false
              if (assign) {
                disableTpaFee.value = planFeesForm.value.tpaEntryFeeType === 1 ? false : true
                disableTpaDollar.value = planFeesForm.value.tpaEntryFeeType === 2 ? false : true
                disableTpaPercent.value = planFeesForm.value.tpaEntryFeeType === 3 ? false : true
              } else {
                disableTpaFee.value = true
                disableTpaDollar.value = true
                disableTpaPercent.value = true
                planFeesForm.value.tpaAdminFee = 0
                planFeesForm.value.tpaAdminBasisFee = 0
                tpaAdminDollar.value = 0
                tpaAdminPercent.value = 0
              }
              showTPAFeeText.value = assign ? true : false
              disableTPAEntryFeeType.value = false
              administrationFeesMsg.value = ''
              if (serviceType.value === 1) {
                if (props.proposalPlan.TPAName === 'PCS Retirement') {
                  planFeesForm.value.tpaAdminName = props.proposalPlan.AboutTPA
                } else {
                  planFeesForm.value.tpaAdminName = props.proposalPlan.TPAName
                }
              } else {
                planFeesForm.value.tpaAdminName = 'PCS Retirement'
              }
            } else {
              planFeesForm.value.tpaEntryFeeType = 4
              if ($store.state.user.selectedProgram.programName === $authz.program.PCS) {
                if (serviceType.value === 0) {
                  planFeesForm.value.tpaAdminName = 'PCS Retirement'
                } else {
                  if (props.proposalPlan.TPAName === 'PCS Retirement') {
                    planFeesForm.value.tpaAdminName = props.proposalPlan.AboutTPA
                  } else {
                    planFeesForm.value.tpaAdminName = props.proposalPlan.TPAName
                  }
                }
              }
              disableTpaFeeType.value = true
              disableTpaFee.value = true
              disableTpaDollar.value = true
              disableTpaPercent.value = true
              showTPAFeeText.value = true
              disableTPAEntryFeeType.value = true
            }
          }
        } else {
          disableTpaFeeType.value = true
          disableTpaFee.value = true
          disableTpaDollar.value = true
          disableTpaPercent.value = true
          planFeesForm.value.tpaAdminFee = 0
          planFeesForm.value.tpaAdminBasisFee = 0
          planFeesForm.value.tpaEntryFeeType = ''
          showTPAFeeText.value = true
          planFeesForm.value.tpaAdminName = ''
          disableTPAEntryFeeType.value = true
        }
        if (assign) {
          oldPlanFeesForm.value.tpaEntryFeeType = planFeesForm.value.tpaEntryFeeType
          oldPlanFeesForm.value.tpaAdminFee = planFeesForm.value.tpaAdminFee
          oldPlanFeesForm.value.tpaAdminBasisFee = planFeesForm.value.tpaAdminBasisFee
          oldPlanFeesForm.value.tpaAdminName = planFeesForm.value.tpaAdminName
        }
      }
      function enableSelectedFeeType(feeType, type) {
        if (type === 'Provider') {
          if (!feeType) {
            disableProviderFee.value = true
            disableProviderDollar.value = true
            disableProviderPercent.value = true
            showProviderFeeText.value = false
          } else if (feeType === 1) {
            disableProviderFee.value = false
            disableProviderDollar.value = true
            disableProviderPercent.value = true
            showProviderFeeText.value = true
          } else if (feeType === 2) {
            disableProviderFee.value = true
            disableProviderDollar.value = false
            disableProviderPercent.value = true
            showProviderFeeText.value = true
          } else if (feeType === 3) {
            disableProviderFee.value = true
            disableProviderDollar.value = true
            disableProviderPercent.value = false
            showProviderFeeText.value = true
          }
        } else if (type === 'Investment') {
          if (!feeType) {
            disableManagerFee.value = true
            disableManagerDollar.value = true
            disableManagerPercent.value = true
            showManagerFeeText.value = false
          } else if (feeType === 1) {
            disableManagerFee.value = false
            disableManagerDollar.value = true
            disableManagerPercent.value = true
            showManagerFeeText.value = true
          } else if (feeType === 2) {
            disableManagerFee.value = true
            disableManagerDollar.value = false
            disableManagerPercent.value = true
            showManagerFeeText.value = true
          } else if (feeType === 3) {
            disableManagerFee.value = true
            disableManagerDollar.value = true
            disableManagerPercent.value = false
            showManagerFeeText.value = true
          }
        } else if (type === 'Advisor') {
          if (!feeType) {
            disableAdvisorFee.value = true
            disableAdvisorDollar.value = true
            disableAdvisorPercent.value = true
            showAdvisorFeeText.value = false
          } else if (feeType === 1) {
            disableAdvisorFee.value = false
            disableAdvisorDollar.value = true
            disableAdvisorPercent.value = true
            showAdvisorFeeText.value = true
          } else if (feeType === 2) {
            disableAdvisorFee.value = true
            disableAdvisorDollar.value = false
            disableAdvisorPercent.value = true
            showAdvisorFeeText.value = true
          } else if (feeType === 3) {
            disableAdvisorFee.value = true
            disableAdvisorDollar.value = true
            disableAdvisorPercent.value = false
            showAdvisorFeeText.value = true
          } else if (feeType === 4) {
            disableAdvisorFee.value = true
            disableAdvisorDollar.value = true
            disableAdvisorPercent.value = true
            showAdvisorFeeText.value = true
          }
        } else if (type === 'Administration') {
          if (!feeType) {
            disableTpaFee.value = true
            disableTpaDollar.value = true
            disableTpaPercent.value = true
            showTPAFeeText.value = false
          } else if (feeType === 1) {
            disableTpaFee.value = false
            disableTpaDollar.value = true
            disableTpaPercent.value = true
            showTPAFeeText.value = true
          } else if (feeType === 2) {
            disableTpaFee.value = true
            disableTpaDollar.value = false
            disableTpaPercent.value = true
            showTPAFeeText.value = true
          } else if (feeType === 3) {
            disableTpaFee.value = true
            disableTpaDollar.value = true
            disableTpaPercent.value = false
            showTPAFeeText.value = true
          } else if (feeType === 4) {
            disableTpaFee.value = true
            disableTpaDollar.value = true
            disableTpaPercent.value = true
            showTPAFeeText.value = true
          }
        }
      }
      function toFixed(val) {
        if (val) {
          return val.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        }
        return 0
      }
      function updateManagerBasis(value, type, feeType) {
        if (feeType === 'Investment') {
          if (type === 'dollar') {
            let managerDollarValue = parseInt(value).toFixed(0)
            managerDollar.value = managerDollarValue
            if (Number(managerDollar.value) === 0) {
              planFeesForm.value.managerFee = 0
              managerPercent.value = 0
            }
          } else if (type === 'percent') {
            let managerPercentValue = parseFloat(value)
            managerPercent.value = managerPercentValue
            if (Number(managerPercent.value) === 0) {
              planFeesForm.value.managerFee = 0
              managerDollar.value = 0
            }
          }
          showEstimatedFees()
        } else if (feeType === 'Advisor') {
          if (type === 'dollar') {
            let advisorDollarValue = parseInt(value).toFixed(0)
            advisorDollar.value = advisorDollarValue
            if (Number(advisorDollar.value) === 0) {
              planFeesForm.value.advisorFee = 0
              advisorPercent.value = 0
            }
          } else if (type === 'percent') {
            let advisorPercentValue = parseFloat(value)
            advisorPercent.value = advisorPercentValue
            if (Number(advisorPercent.value) === 0) {
              planFeesForm.value.advisorFee = 0
              advisorDollar.value = 0
            }
          }
          showEstimatedFees()
        } else if (feeType === 'Administration') {
          if (serviceType.value === 1) {
            if (type === 'dollar') {
              let adminDollarValue = parseInt(value).toFixed(0)
              tpaAdminDollar.value = adminDollarValue
              planFeesForm.value.tpaAdminFee = adminDollarValue
              if (Number(tpaAdminDollar.value) === 0) {
                planFeesForm.value.tpaAdminBasisFee = 0
                planFeesForm.value.tpaAdminFee = 0
                tpaAdminPercent.value = 0
              }
            } else if (type === 'percent') {
              let adminPercentValue = parseFloat(value)
              tpaAdminPercent.value = adminPercentValue
              if (Number(tpaAdminPercent.value) === 0) {
                planFeesForm.value.tpaAdminBasisFee = 0
                tpaAdminDollar.value = 0
                planFeesForm.value.tpaAdminFee = 0
              }
            } else if (type === 'basis') {
              planFeesForm.value.tpaAdminBasisFee = parseFloat(value)
              planFeesForm.value.tpaAdminFee = Number(parseFloat((value / 10000) * totalAssets.value).toFixed(0))
            }
            showEstimatedFees()
          }
        }
      }
      function bpsRange() {
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          if ($store.state.user.selectedProgram.programName === $authz.managedPlan.PA) {
            if (
              Number(planFeesForm.value.advisorFee) < minAdvisoryFee.value ||
              Number(planFeesForm.value.advisorFee) > maxAdvisoryFee.value
            ) {
              //planFeesForm.value.advisorFee = 0
  
              $toast.error('Fee must be between ' + minAdvisoryFee.value + ' bps and ' + maxAdvisoryFee.value + ' bps', '')
            }
            showEstimatedFees()
          }
          if ($store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
            if (Number(planFeesForm.value.advisorFee) > maxAdvisoryFee.value) {
              //planFeesForm.value.advisorFee = 0
  
              $toast.error('Fee must be ' + maxAdvisoryFee.value + ' bps or less ', '')
            }
            showEstimatedFees()
          }
        }
      }
      function showEstimatedFees() {
        successEstimated.value = false
        var tmp_estimatedDollar = 0
        var assets = totalAssets.value
        if (outside.value === 1) assets = assets - Number(outsideAmount.value)
        if (stock.value === 1) assets = assets - Number(stockAmount.value)
  
        ///Provider Fee
        var providerFees = Number(planFeesForm.value.providerFee)
        if (planFeesForm.value.providerName === '' || planFeesForm.value.providerName === undefined) providerFees = 0
        if (planFeesForm.value.providerFeeType === 'manual') {
          providerDollar.value = Number(parseFloat((providerFees / 10000) * assets).toFixed(0))
          providerPercent.value = Number(parseFloat(providerFees / 100).toFixed(2))
          tmp_estimatedDollar += Number(parseFloat((providerFees / 10000) * assets).toFixed(0))
        } else if (planFeesForm.value.providerFeeType === 'feeSchedule') {
          providerFees = Number(providerAmount.value)
          providerDollar.value = Number(parseFloat(providerFees).toFixed(0))
          providerPercent.value = assets !== 0 ? Number(parseFloat((providerFees / assets) * 100).toFixed(2)) : 0.0
          tmp_estimatedDollar += Number(parseFloat(providerFees).toFixed(0))
        } else {
          providerDollar.value = 0
          providerPercent.value = 0.0
        }
        ///Manager Fee
        var managerFees = isFinite(planFeesForm.value.managerFee) ? Number(planFeesForm.value.managerFee) : 0
        if (!showInvestmentManager.value) {
          if (planFeesForm.value.managerFeeType === 'manual') {
            if (planFeesForm.value.managerEntryFeeType === 1) {
              managerDollar.value = Number(parseFloat((managerFees / 10000) * assets).toFixed(0))
              managerPercent.value = Number(parseFloat(managerFees / 100).toFixed(2))
            } else if (planFeesForm.value.managerEntryFeeType === 2) {
              var managerFeeVal = (managerDollar.value / assets) * 10000
              planFeesForm.value.managerFee = isFinite(managerFeeVal) ? toFixed(managerFeeVal) : 0
              var managerPercentVal = (managerDollar.value / assets) * 100
              managerPercent.value = isFinite(managerPercentVal) ? Number(parseFloat(managerPercentVal).toFixed(2)) : 0
            } else if (planFeesForm.value.managerEntryFeeType === 3) {
              planFeesForm.value.managerFee = toFixed(managerPercent.value * 100)
              managerDollar.value = Number(parseFloat((managerPercent.value / 100) * assets).toFixed(0))
            }
            tmp_estimatedDollar += Number(managerDollar.value)
          } else if (planFeesForm.value.managerFeeType === 'feeSchedule') {
            managerFees = Number(managerAmount.value)
            managerDollar.value = Number(parseFloat(managerFees).toFixed(0))
            managerPercent.value = assets !== 0 ? Number(parseFloat((managerFees / assets) * 100).toFixed(2)) : 0.0
            var managerFeeValue1 = (managerDollar.value / assets) * 10000
  
            planFeesForm.value.managerFee = isFinite(managerFeeValue1) ? toFixed(managerFeeValue1) : 0
            tmp_estimatedDollar += Number(managerDollar.value)
          } else {
            managerDollar.value = 0
            managerPercent.value = 0.0
            planFeesForm.value.managerFee = 0
          }
        } else {
          managerDollar.value = 0
          managerPercent.value = 0.0
          planFeesForm.value.managerFee = 0
        }
  
        ///Advisor fee
        var advisorFees = isFinite(planFeesForm.value.advisorFee) ? Number(planFeesForm.value.advisorFee) : 0
        if (!showFinancialAdvisor.value) {
          if (planFeesForm.value.advisorFeeType === 'manual') {
            if (planFeesForm.value.advisorEntryFeeType === 1) {
              advisorDollar.value = Number(parseFloat((advisorFees / 10000) * assets).toFixed(0))
              advisorPercent.value = Number(parseFloat(advisorFees / 100).toFixed(2))
            } else if (planFeesForm.value.advisorEntryFeeType === 2) {
              var advisorFeeVal = (advisorDollar.value / assets) * 10000
              planFeesForm.value.advisorFee = isFinite(advisorFeeVal) ? toFixed(advisorFeeVal) : 0
              var advisorPercentVal = (advisorDollar.value / assets) * 100
              advisorPercent.value = isFinite(advisorPercentVal) ? Number(parseFloat(advisorPercentVal).toFixed(2)) : 0
            } else if (planFeesForm.value.advisorEntryFeeType === 3) {
              planFeesForm.value.advisorFee = toFixed(advisorPercent.value * 100)
              advisorDollar.value = Number(parseFloat((advisorPercent.value / 100) * assets).toFixed(0))
            }
            tmp_estimatedDollar += Number(advisorDollar.value)
          } else if (planFeesForm.value.advisorFeeType === 'feeSchedule') {
            advisorFees = Number(advisorAmount.value)
            advisorDollar.value = Number(parseFloat(advisorFees).toFixed(0))
            advisorPercent.value = assets !== 0 ? Number(parseFloat((advisorFees / assets) * 100).toFixed(2)) : 0.0
            var advisorFeeValue1 = (advisorDollar.value / assets) * 10000
            planFeesForm.value.advisorFee = isFinite(advisorFeeValue1) ? toFixed(advisorFeeValue1) : 0
            tmp_estimatedDollar += Number(advisorDollar.value)
          } else {
            advisorDollar.value = 0
            advisorPercent.value = 0.0
            planFeesForm.value.advisorFee = 0
          }
        } else {
          advisorDollar.value = 0
          advisorPercent.value = 0.0
          planFeesForm.value.advisorFee = 0
        }
  
        ///MMlPlatform Fee
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          ) &&
          $store.state.user.selectedProgram.programName !== $authz.managedPlan.PA
        ) {
          var mmlPlatformFee = Number(planFeesForm.value.mmlPlatformFee)
          if (planFeesForm.value.mmlPlatformFeeType === 'manual') {
            planFeesForm.value.mmlPlatformFee = mmlPlatformFee ? mmlPlatformFee : 0
            mmlPlatformDollar.value = Number(parseFloat((mmlPlatformFee / 10000) * assets).toFixed(0))
            mmlPlatformPercent.value = Number(parseFloat(mmlPlatformFee / 100).toFixed(2))
            tmp_estimatedDollar += Number(parseFloat((mmlPlatformFee / 10000) * assets).toFixed(0))
          }
        }
  
        ///Administration Fee
        var tpaAdminFees = isFinite(planFeesForm.value.tpaAdminFee) ? Number(planFeesForm.value.tpaAdminFee) : 0
        var tpaDiscount = tpaDiscountValue.value ? parseInt(tpaDiscountValue.value) : 0
        if (serviceType.value === 1) {
          if (planFeesForm.value.tpaEntryFeeType === 1) {
            var adminBasisFee = planFeesForm.value.tpaAdminBasisFee ? Number(planFeesForm.value.tpaAdminBasisFee) : 0
            tpaAdminDollar.value = Number(parseFloat((adminBasisFee / 10000) * assets).toFixed(0))
            tpaAdminPercent.value = Number(parseFloat(adminBasisFee / 100).toFixed(2))
          } else if (planFeesForm.value.tpaEntryFeeType === 2) {
            var adminFeeVal = (tpaAdminFees / assets) * 10000
            planFeesForm.value.tpaAdminBasisFee = isFinite(adminFeeVal) ? toFixed(adminFeeVal) : 0
            var adminPercentVal = (tpaAdminFees / assets) * 100
            tpaAdminPercent.value = isFinite(adminPercentVal) ? Number(parseFloat(adminPercentVal).toFixed(2)) : 0
            tpaAdminDollar.value = tpaAdminFees
          } else if (planFeesForm.value.tpaEntryFeeType === 3) {
            planFeesForm.value.tpaAdminBasisFee = toFixed(tpaAdminPercent.value * 100)
            tpaAdminDollar.value = Number(parseFloat((tpaAdminPercent.value / 100) * assets).toFixed(0))
          } else {
            tpaAdminDollar.value = Number(parseFloat(tpaAdminFees).toFixed(0))
            ///Negative Dollar Check
            tpaAdminDollar.value = tpaAdminDollar.value < 0 ? 0 : tpaAdminDollar.value
            tpaAdminFees = tpaAdminDollar.value ? tpaAdminDollar.value : 0
            tpaAdminPercent.value = assets !== 0 ? Number(parseFloat((tpaAdminFees / assets) * 100).toFixed(2)) : 0.0
            var tpaAdminFeeValue2 = (tpaAdminDollar.value / assets) * 10000
            planFeesForm.value.tpaAdminBasisFee = isFinite(tpaAdminFeeValue2) ? toFixed(tpaAdminFeeValue2) : 0
          }
          planFeesForm.value.tpaAdminFee = tpaAdminDollar.value
          tmp_estimatedDollar += Number(tpaAdminDollar.value)
        } else {
          tpaAdminDollar.value = Number(parseFloat(tpaAdminFees).toFixed(0)) - tpaDiscount
          ///Negative Dollar Check
          tpaAdminDollar.value = tpaAdminDollar.value < 0 ? 0 : tpaAdminDollar.value
          tpaAdminFees = tpaAdminDollar.value ? tpaAdminDollar.value : 0
          tpaAdminPercent.value = assets !== 0 ? Number(parseFloat((tpaAdminFees / assets) * 100).toFixed(2)) : 0.0
          var tpaAdminFeeValue1 = (tpaAdminDollar.value / assets) * 10000
          planFeesForm.value.tpaAdminBasisFee = isFinite(tpaAdminFeeValue1) ? toFixed(tpaAdminFeeValue1) : 0
          tmp_estimatedDollar += Number(parseFloat(tpaAdminFees).toFixed(0))
        }
        ///RecordKeeping
        var tparkFees = Number(planFeesForm.value.tparkFee)
        tparkDollar.value = Number(parseFloat(tparkFees).toFixed(0))
        tparkPercent.value = assets !== 0 ? Number(parseFloat((tparkFees / assets) * 100).toFixed(2)) : 0.0
        var tparkFeeValue1 = (tparkDollar.value / assets) * 10000
        planFeesForm.value.tparkBasisFee = isFinite(tparkFeeValue1) ? toFixed(tparkFeeValue1) : 0
        tmp_estimatedDollar += Number(parseFloat(tparkFees).toFixed(0))
        ///Trustee
        var trusteeFees = Number(planFeesForm.value.trusteeFee)
        trusteeFees = Number(trusteeAmount.value)
        var adminFiduciaryFees = Number(adminFiduciaryFee.value)
        var totalTrusteeFees = Number(trusteeFees) + Number(adminFiduciaryFees)
        trusteeDollar.value = Number(parseFloat(totalTrusteeFees).toFixed(0))
        trusteePercent.value = assets !== 0 ? Number(parseFloat((totalTrusteeFees / assets) * 100).toFixed(2)) : 0.0
        var trusteeFeeValue1 = (trusteeDollar.value / assets) * 10000
        planFeesForm.value.trusteeBasisFee = isFinite(trusteeFeeValue1) ? toFixed(trusteeFeeValue1) : 0
        tmp_estimatedDollar += Number(parseFloat(totalTrusteeFees).toFixed(0))
        ///Expense
        var expenseAmount = Number(expenseFee.value)
        expenseDollar.value = Number(parseFloat((expenseAmount / 100) * assets).toFixed(0))
        expensePercent.value = Number(parseFloat(expenseAmount).toFixed(2))
        tmp_estimatedDollar += Number(parseFloat((expenseAmount / 100) * assets).toFixed(0))
        ///Negative Dollar Check
        expenseDollar.value = expenseDollar.value < 0 ? 0 : expenseDollar.value
        expensePercent.value = expensePercent.value < 0 ? 0 : expensePercent.value
        //Offset Fees
        var feeOffset = Number(offsetOverrideFee.value)
        deleteOffset.value = feeOffset !== 0 ? true : false
        if (feeOffset === 0) feeOffset = Number(offsetAmount.value)
        offsetDollar.value = Number(parseFloat((feeOffset / 100) * assets * -1).toFixed(0))
        planFeesForm.value.offsetPercent = Number(parseFloat(feeOffset * -1).toFixed(2))
        tmp_estimatedDollar += Number(parseFloat((feeOffset / 100) * assets * -1).toFixed(0))
        ///Final Estimate Value
        estimatedDollar.value = Number(parseFloat(tmp_estimatedDollar).toFixed(0))
        estimatedPercent.value = assets === 0 ? 0 : Number(parseFloat((tmp_estimatedDollar / assets) * 100).toFixed(2))
        ///Negative Dollar Check
        estimatedDollar.value = tmp_estimatedDollar.value < 0 ? 0 : tmp_estimatedDollar.value
        estimatedPercent.value = estimatedPercent.value < 0 ? 0 : estimatedPercent.value
        if (loadTypeValue.value === 'load') {
          if (
            successOffsetOverride.value === true &&
            successOffset.value === true &&
            successExpense.value === true &&
            successManagerFee.value === true &&
            succeessAdvisorFee.value === true &&
            successTPAFee.value === true &&
            successTparkFee.value === true &&
            succeessTrusteeFee.value === true
          ) {
            successEstimated.value = true
            assignPlanFees('load')
          }
        }
      }
      function getProviderFee() {
        var scheduleId = 0
        if (planFeesForm.value.providerSchedule !== undefined && planFeesForm.value.providerSchedule !== '') {
          if (typeof planFeesForm.value.providerSchedule === 'object') {
            scheduleId = planFeesForm.value.providerSchedule.FeeScheduleID
          }
        }
        if (scheduleId > 0) {
          $axios
            .get(
              `/api/v1/tal/proposal/providerfee?feeSchedule=${scheduleId}&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}`
            )
            .then((success) => {
              if (success.data.d !== null) {
                var providerMinFee = planFeesForm.value.providerSchedule.MinimumFee
                  ? planFeesForm.value.providerSchedule.MinimumFee
                  : 0
                var providerMaxFee = planFeesForm.value.providerSchedule.MaximumFee
                  ? planFeesForm.value.providerSchedule.MaximumFee
                  : 0
                var providerFees = success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0
                if (planFeesForm.value.providerFeeType !== 'manual') {
                  if (providerMinFee > 0) {
                    if (providerFees <= providerMinFee) {
                      providerFees = providerMinFee
                      feesAdjusted.value = true
                      professionalFeeMsg.value =
                        'The Professional Services fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (providerMaxFee > 0) {
                    if (providerFees >= providerMaxFee) {
                      providerFees = providerMaxFee
                      feesAdjusted.value = true
                      professionalFeeMsg.value =
                        'The Professional Services fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (providerMinFee === 0 && providerMaxFee === 0) {
                    professionalFeeMsg.value = ''
                  }
                }
                providerAmount.value = providerFees
              } else providerAmount.value = 0
              successProviderFee.value = true
              showEstimatedFees()
            })
        } else {
          providerAmount.value = 0
          showEstimatedFees()
        }
      }
      function getManagerFee() {
        var rebate = 0
        var scheduleId = 0
        if (planFeesForm.value.managerSchedule !== undefined && planFeesForm.value.managerSchedule !== '') {
          if (typeof planFeesForm.value.managerSchedule === 'object') {
            scheduleId = planFeesForm.value.managerSchedule.FeeScheduleID
          }
        }
        if (scheduleId > 0) {
          $axios
            .get(
              `/api/v1/tal/proposal/providerfee?feeSchedule=${scheduleId}&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}`
            )
            .then((success) => {
              if (success.data.d !== null) {
                var minFee = planFeesForm.value.managerSchedule.MinimumFee ? planFeesForm.value.managerSchedule.MinimumFee : 0
                var maxFee = planFeesForm.value.managerSchedule.MaximumFee ? planFeesForm.value.managerSchedule.MaximumFee : 0
                var managerFees = success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0
                var name = $authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
                  ? mmlInvestmentName.value
                  : 'Investment Manager'
                if (planFeesForm.value.managerFeeType !== 'manual') {
                  if (minFee > 0) {
                    if (managerFees <= minFee) {
                      managerFees = minFee
                      feesAdjusted.value = true
                      investmentManagerFeeMsg.value =
                        'The ' + name + ' fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (maxFee > 0) {
                    if (managerFees >= maxFee) {
                      managerFees = maxFee
                      feesAdjusted.value = true
                      investmentManagerFeeMsg.value =
                        'The ' + name + ' fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (minFee === 0 && maxFee === 0) {
                    investmentManagerFeeMsg.value = ''
                  }
                }
                managerAmount.value = managerFees
              } else managerAmount.value = 0
              successManagerFee.value = false
              $axios.get(`/api/v1/tal/proposal/rebatefee/${props.planId}`).then((success) => {
                if (success.data.d !== null) {
                  rebate = success.data.d.length > 0 ? success.data.d[0].dblRebate1 : 0
                } else rebate = 0
                managerAmount.value = Number(managerAmount.value) - Number(rebate)
                successManagerFee.value = true
                showEstimatedFees()
              })
            })
        } else {
          managerAmount.value = 0
          showEstimatedFees()
        }
      }
      function getAdvisorFee() {
        var scheduleId = 0
        if (planFeesForm.value.advisorSchedule !== undefined && planFeesForm.value.advisorSchedule !== '') {
          if (typeof planFeesForm.value.advisorSchedule === 'object') {
            scheduleId = planFeesForm.value.advisorSchedule.FeeScheduleID
          }
        }
        if (scheduleId > 0) {
          $axios
            .get(
              `/api/v1/tal/proposal/providerfee?feeSchedule=${scheduleId}&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}`
            )
            .then((success) => {
              if (success.data.d !== null) {
                var minFee = planFeesForm.value.advisorSchedule.MinimumFee ? planFeesForm.value.advisorSchedule.MinimumFee : 0
                var maxFee = planFeesForm.value.advisorSchedule.MaximumFee ? planFeesForm.value.advisorSchedule.MaximumFee : 0
                var fees = success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0
                var name = enterpriseName.value === 'Park Avenue Securities' ? 'Soliciting Advisor' : 'Financial Advisor'
                if (planFeesForm.value.advisorFeeType !== 'manual') {
                  if (minFee > 0) {
                    if (fees <= minFee) {
                      fees = minFee
                      feesAdjusted.value = true
                      financialAdvisorFeeMsg.value =
                        'The ' + name + ' fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (maxFee > 0) {
                    if (fees >= maxFee) {
                      fees = maxFee
                      feesAdjusted.value = true
                      financialAdvisorFeeMsg.value =
                        'The ' + name + ' fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (minFee === 0 && maxFee === 0) {
                    financialAdvisorFeeMsg.value = ''
                  }
                }
                advisorAmount.value = fees
                advisorFee.value = fees
              } else {
                advisorAmount.value = 0
                advisorFee.value = 0
              }
              succeessAdvisorFee.value = true
              showEstimatedFees()
            })
        } else {
          advisorAmount.value = 0
          advisorFee.value = 0
          showEstimatedFees()
        }
      }
      function getTrusteeFee() {
        var scheduleId = 0
        if (planFeesForm.value.exchangeTradedFunds && planFeesForm.value.trusteeSchedule) {
          if (typeof planFeesForm.value.trusteeSchedule === 'object') {
            scheduleId = planFeesForm.value.trusteeSchedule.FeeScheduleID
          }
  
          if (scheduleId !== 0) {
            $axios
              .get(
                `/api/v1/tal/proposal/trusteefee?feeSchedule=${scheduleId}&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}&subCustodian=${subCustodian.value}`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  var trusteeMinFee = planFeesForm.value.trusteeSchedule.MinimumFee
                    ? planFeesForm.value.trusteeSchedule.MinimumFee
                    : 0
                  var trusteeMaxFee = planFeesForm.value.trusteeSchedule.MaximumFee
                    ? planFeesForm.value.trusteeSchedule.MaximumFee
                    : 0
                  var trusteeFees = success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0
                  if (trusteeMinFee > 0) {
                    if (trusteeFees <= trusteeMinFee) {
                      trusteeFees = trusteeMinFee
                      feesAdjusted.value = true
                      custodianFeesMsg.value =
                        'The Trustee / Custodian fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (trusteeMaxFee > 0) {
                    if (trusteeFees >= trusteeMaxFee) {
                      trusteeFees = trusteeMaxFee
                      feesAdjusted.value = true
                      custodianFeesMsg.value =
                        'The Trustee / Custodian fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (trusteeMinFee === 0 && trusteeMaxFee === 0) {
                    custodianFeesMsg.value = ''
                  }
                  trusteeAmount.value = trusteeFees
                } else trusteeAmount.value = 0
  
                planFeesForm.value.trusteeFee = Number(parseFloat(trusteeAmount.value).toFixed(0))
                if (loadTypeValue.value === 'load') {
                  oldPlanFeesForm.value.trusteeFee = planFeesForm.value.trusteeFee
                  oldPlanFeesForm.value.trusteeFeeType = 4
                }
  
                succeessTrusteeFee.value = true
                showEstimatedFees()
              })
          } else {
            trusteeAmount.value = 0
            planFeesForm.value.trusteeFee = 0
            succeessTrusteeFee.value = true
            showEstimatedFees()
          }
        } else if (planFeesForm.value.trusteeSchedule) {
          if (typeof planFeesForm.value.trusteeSchedule === 'object') {
            scheduleId = planFeesForm.value.trusteeSchedule.FeeScheduleID
          }
          if (scheduleId !== 0) {
            $axios
              .get(
                `/api/v1/tal/proposal/providerfee?feeSchedule=${scheduleId}&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  var trusteeMinFee = planFeesForm.value.trusteeSchedule.MinimumFee
                    ? planFeesForm.value.trusteeSchedule.MinimumFee
                    : 0
                  var trusteeMaxFee = planFeesForm.value.trusteeSchedule.MaximumFee
                    ? planFeesForm.value.trusteeSchedule.MaximumFee
                    : 0
                  var trusteeFees = success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0
                  if (trusteeMinFee > 0) {
                    if (trusteeFees <= trusteeMinFee) {
                      trusteeFees = trusteeMinFee
                      feesAdjusted.value = true
                      custodianFeesMsg.value =
                        'The Trustee / Custodian fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (trusteeMaxFee > 0) {
                    if (trusteeFees >= trusteeMaxFee) {
                      trusteeFees = trusteeMaxFee
                      feesAdjusted.value = true
                      custodianFeesMsg.value =
                        'The Trustee / Custodian fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                    }
                  }
                  if (trusteeMinFee === 0 && trusteeMaxFee === 0) {
                    custodianFeesMsg.value = ''
                  }
                  trusteeAmount.value = trusteeFees
                } else trusteeAmount.value = 0
                planFeesForm.value.trusteeFee = Number(parseFloat(trusteeAmount.value).toFixed(0))
                if (loadTypeValue.value === 'load') {
                  oldPlanFeesForm.value.trusteeFeeType = 4
                  oldPlanFeesForm.value.trusteeFee = planFeesForm.value.trusteeFee
                }
  
                succeessTrusteeFee.value = true
                showEstimatedFees()
              })
          } else {
            trusteeAmount.value = 0
            planFeesForm.value.trusteeFee = 0
            succeessTrusteeFee.value = true
            showEstimatedFees()
          }
        } else {
          trusteeAmount.value = 0
          planFeesForm.value.trusteeFee = 0
          succeessTrusteeFee.value = true
          showEstimatedFees()
        }
      }
      function getAdminFiduciaryFee() {
        if (
          (planType.value === 'Defined Contribution Plan' || planType.value === 'ERISA 403(b)') &&
          adminFiduciary.value === 1 &&
          trusteeCustodian.value === 'AdvisorTrust'
        ) {
          $axios
            .get(
              `/api/v1/tal/proposal/providerfee?feeSchedule=3148&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}`
            )
            .then((success) => {
              if (success.data.d !== null) {
                if (loadTypeValue.value === 'save' && adminFiduciaryFee.value !== success.data.d[0].fee) {
                  loadTypeValue.value = 'load'
                }
  
                adminFiduciaryFee.value = success.data.d.length > 0 ? success.data.d[0].fee : 0
              } else adminFiduciaryFee.value = 0
            })
        } else {
          if (loadTypeValue.value === 'save' && adminFiduciaryFee.value !== 0) {
            loadTypeValue.value = 'load'
          }
          adminFiduciaryFee.value = 0
        }
      }
      const getExpense = async (val) => {
        await $axios.get(`/api/v1/tal/proposal/offsetfee/${props.planId}`).then((success) => {
          if (success.data.d !== null) {
            expenseFee.value = success.data.d.length > 0 ? success.data.d[0].MgmtFee : 0
            offsetAmount.value = success.data.d.length > 0 ? success.data.d[0].fee : 0
          } else {
            expenseFee.value = 0
            offsetAmount.value = 0
          }
          successExpense.value = true
          successOffset.value = true
          planFeesForm.value.expenseFee = expenseFee.value
          planFeesForm.value.offsetAmount = offsetAmount.value
          if (val) showEstimatedFees()
        })
      }
      const getOffsetOverride = async (val) => {
        await $axios.get(`/api/v1/rpea/plan/${props.planId}/overrides`).then((success) => {
          if (success.data.d !== null) {
            var offsets = success.data.d.find((x) => x.ColumnName === 'OFFSET')
            offsetOverrideFee.value = offsets !== undefined ? offsets.ColumnValue : 0
          }
          successOffsetOverride.value = true
          planFeesForm.value.offsetOverrideFee = offsetOverrideFee.value
          if (val) showEstimatedFees()
        })
      }
      function getTPAFee() {
        var scheduleId = 0
        if (planFeesForm.value.tpaAdminSchedule) {
          if (typeof planFeesForm.value.tpaAdminSchedule === 'object') {
            scheduleId = planFeesForm.value.tpaAdminSchedule.FeeScheduleID
          }
        }
        if (scheduleId === -1) {
          showEstimatedFees()
          if (loadTypeValue.value === 'load') oldPlanFeesForm.value.tpaAdminFee = planFeesForm.value.tpaAdminFee
          successTPAFee.value = true
          administrationFeesMsg.value = ''
        } else if (scheduleId !== 0) {
          $axios
            .get(
              `/api/v1/tal/proposal/providerfee?feeSchedule=${scheduleId}&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}`
            )
            .then((success) => {
              if (success.data.d !== null) {
                var adminMinFee = planFeesForm.value.tpaAdminSchedule.MinimumFee
                  ? planFeesForm.value.tpaAdminSchedule.MinimumFee
                  : 0
                var adminMaxFee = planFeesForm.value.tpaAdminSchedule.MaximumFee
                  ? planFeesForm.value.tpaAdminSchedule.MaximumFee
                  : 0
                var adminFees = success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0
                if (adminMinFee > 0) {
                  if (adminFees <= adminMinFee) {
                    adminFees = adminMinFee
                    feesAdjusted.value = true
                    administrationFeesMsg.value =
                      'The Administration fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                  }
                }
                if (adminMaxFee > 0) {
                  if (adminFees >= adminMaxFee) {
                    adminFees = adminMaxFee
                    feesAdjusted.value = true
                    administrationFeesMsg.value =
                      'The Administration fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                  }
                }
                if (adminMinFee === 0 && adminMaxFee === 0) {
                  administrationFeesMsg.value = ''
                }
                planFeesForm.value.tpaAdminFee = adminFees
              } else planFeesForm.value.tpaAdminFee = 0
              if (loadTypeValue.value === 'load') oldPlanFeesForm.value.tpaAdminFee = planFeesForm.value.tpaAdminFee
              showEstimatedFees()
              successTPAFee.value = true
            })
        } else {
          if (!planFeesForm.value.tpaAdminSchedule) {
            planFeesForm.value.tpaAdminFee = 0
            successTPAFee.value = true
            showEstimatedFees()
          }
        }
      }
      function getPlanOptions(val) {
        outsideAmount.value = props.proposalPlan.OutsideAmount
        stockAmount.value = props.proposalPlan.StockAmount
        outside.value = props.proposalPlan.Outside
        stock.value = props.proposalPlan.Stock
        etf.value = props.proposalPlan.ETF
        fiduciaryServices.value = props.proposalPlan.FiduciaryServicesProgram
        if (props.proposalPlan.TPA === '' && custodiansList.value.length > 0) {
          trusteeCustodian.value = custodiansList.value[0]
        } else {
          trusteeCustodian.value = props.proposalPlan.TPA
        }
        if (props.proposalPlan.SUB === '' && subCustodiansList.value.length > 0 && trusteeCustodian.value === 'AdvisorTrust') {
          subCustodian.value = subCustodiansList.value[0]
        } else {
          subCustodian.value = props.proposalPlan.SUB !== '' ? props.proposalPlan.SUB : ''
        }
        adminFiduciary.value = props.proposalPlan.AdminFiduciary
        serviceType.value = props.proposalPlan.ServiceType
        planType.value = props.proposalPlan.DCPTYPE === '' ? props.selectedPlan.DCPTYPE : props.proposalPlan.DCPTYPE
        totalAssets.value =
          props.proposalPlan.TOTASSETS !== null && props.proposalPlan.TOTASSETS > 0
            ? props.proposalPlan.TOTASSETS
            : props.selectedPlan.TOTASSETS
        totalParticipant.value =
          props.proposalPlan.PARTIC !== null && props.proposalPlan.PARTIC > 0
            ? props.proposalPlan.PARTIC
            : props.selectedPlan.PARTIC
        ///Investment manager
        planFeesForm.value.managerName = props.proposalPlan.ManagerName
        if (props.proposalPlan.FeeType === 1) {
          planFeesForm.value.managerFeeType = 'feeSchedule'
        } else {
          planFeesForm.value.managerFeeType = props.proposalPlan.AllowInvestmentManager ? 'manual' : ''
        }
        if (planFeesForm.value.managerFeeType === 'manual') {
          planFeesForm.value.managerFee = props.proposalPlan.ManagerFee !== '' ? props.proposalPlan.ManagerFee : 0
          planFeesForm.value.managerSchedule = props.proposalPlan.ManagerFee && props.proposalPlan.ManagerFee > 0 ? 0 : ''
          successManagerFee.value = true
          managerDollar.value = props.proposalPlan.ManagerDollar ? props.proposalPlan.ManagerDollar : 0.0
          managerPercent.value = props.proposalPlan.ManagerPercent ? props.proposalPlan.ManagerPercent : 0.0
          planFeesForm.value.managerEntryFeeType = props.proposalPlan.ManagerFeeEntryType
            ? props.proposalPlan.ManagerFeeEntryType
            : ''
        } else {
          planFeesForm.value.managerFee = 0
          planFeesForm.value.managerSchedule = props.proposalPlan.ManagerSchedule === 0 ? '' : props.proposalPlan.ManagerSchedule
          successManagerFee.value = props.proposalPlan.ManagerSchedule === 0 ? true : false
          planFeesForm.value.managerEntryFeeType = props.proposalPlan.ManagerSchedule === 0 ? '' : 4
        }
        ///Advisor
        planFeesForm.value.advisorName = props.proposalPlan.AdvisorName
        adminFiduciary.value = props.proposalPlan.AdminFiduciary
        if (props.proposalPlan.AdvisorFeeType === 1) {
          planFeesForm.value.advisorFeeType = 'feeSchedule'
        } else {
          planFeesForm.value.advisorFeeType = props.proposalPlan.AllowFinancialAdvisor ? 'manual' : ''
        }
        if (planFeesForm.value.advisorFeeType === 'manual') {
          planFeesForm.value.advisorFee = props.proposalPlan.AdvisorFee
          planFeesForm.value.advisorSchedule = props.proposalPlan.AdvisorFee && props.proposalPlan.AdvisorFee > 0 ? 0 : ''
          succeessAdvisorFee.value = true
          advisorDollar.value = props.proposalPlan.AdvisorDollar ? props.proposalPlan.AdvisorDollar : 0.0
          advisorPercent.value = props.proposalPlan.AdvisorPercent ? props.proposalPlan.AdvisorPercent : 0.0
          planFeesForm.value.advisorEntryFeeType = props.proposalPlan.AdvisorFeeEntryType
            ? props.proposalPlan.AdvisorFeeEntryType
            : ''
        } else {
          planFeesForm.value.advisorFee = 0
          planFeesForm.value.advisorSchedule = props.proposalPlan.AdvisorSchedule === 0 ? '' : props.proposalPlan.AdvisorSchedule
          succeessAdvisorFee.value = props.proposalPlan.AdvisorSchedule === 0 ? true : false
          planFeesForm.value.advisorEntryFeeType = props.proposalPlan.AdvisorSchedule === 0 ? '' : 4
        }
        ///Professional Service
        planFeesForm.value.providerName = props.proposalPlan.ProviderName
        planFeesForm.value.providerFeeType = props.proposalPlan.ProviderType === 0 ? 'manual' : 'feeSchedule'
        if (planFeesForm.value.providerFeeType === 'manual') {
          planFeesForm.value.providerFee = props.proposalPlan.ProviderFee
          planFeesForm.value.providerSchedule = ''
          successProviderFee.value = true
          planFeesForm.value.providerEntryFeeType = props.proposalPlan.ProviderFee ? 1 : ''
        } else {
          planFeesForm.value.providerFee = 0
          planFeesForm.value.providerSchedule = props.proposalPlan.ProviderSchedule === 0 ? '' : props.proposalPlan.ProviderSchedule
          successProviderFee.value = props.proposalPlan.ProviderSchedule === 0 ? true : false
          planFeesForm.value.providerEntryFeeType = props.proposalPlan.ProviderSchedule === 0 ? '' : 4
        }
        //Administration
        planFeesForm.value.tpaAdminFeeType = props.proposalPlan.TPAFeeType
        if (serviceType.value === 1) {
          if (props.proposalPlan.TPAFeeType === 0) {
            planFeesForm.value.tpaAdminFee = props.proposalPlan.TPAFee
            planFeesForm.value.tpaAdminSchedule = ''
            successTPAFee.value = true
            planFeesForm.value.tpaEntryFeeType = props.proposalPlan.TPAFeeEntryType ? props.proposalPlan.TPAFeeEntryType : ''
          }
          if (props.proposalPlan.TPAFeeType === 1) {
            planFeesForm.value.tpaAdminSchedule = props.proposalPlan.TPASchedule === 0 ? '' : props.proposalPlan.TPASchedule
  
            planFeesForm.value.tpaAdminFee = props.proposalPlan.TPAFee
            successTPAFee.value = props.proposalPlan.TPASchedule === 0 ? true : false
  
            planFeesForm.value.tpaEntryFeeType = props.proposalPlan.TPAFeeEntryType ? props.proposalPlan.TPAFeeEntryType : ''
            if (!planFeesForm.value.tpaEntryFeeType && !props.proposalPlan.TPAFee) planFeesForm.value.tpaAdminBasisFee = 0
  
            disableTpaFeeType.value = false
            tpaAdminDollar.value = props.proposalPlan.TPAAdminDollar ? props.proposalPlan.TPAAdminDollar : 0.0
            tpaAdminPercent.value = props.proposalPlan.TPAAdminPercent ? props.proposalPlan.TPAAdminPercent : 0.0
            if (props.proposalPlan.TPAFeeEntryType === 1) {
              planFeesForm.value.tpaAdminBasisFee = toFixed(tpaAdminPercent.value * 100)
            }
          }
        } else {
          planFeesForm.value.tpaAdminSchedule = props.proposalPlan.TPASchedule === 0 ? '' : props.proposalPlan.TPASchedule
          successTPAFee.value = props.proposalPlan.TPASchedule === 0 ? true : false
          planFeesForm.value.tpaEntryFeeType = props.proposalPlan.TPAFeeEntryType ? props.proposalPlan.TPAFeeEntryType : ''
        }
        //Recordkeeping
        planFeesForm.value.tparkSchedule = props.proposalPlan.TPARKSchedule === 0 ? '' : props.proposalPlan.TPARKSchedule
        planFeesForm.value.tparkFee = props.proposalPlan.TPARKFee
        successTparkFee.value = props.proposalPlan.TPARKSchedule === 0 ? true : false
        planFeesForm.value.tparkFeeType = props.proposalPlan.TPARKSchedule === 0 ? '' : 4
        //Trustee / Custodian
        planFeesForm.value.trusteeSchedule = props.proposalPlan.TrusteeSchedule === 0 ? '' : props.proposalPlan.TrusteeSchedule
        planFeesForm.value.trusteeFee = props.proposalPlan.TrusteeFee
        succeessTrusteeFee.value = props.proposalPlan.TrusteeSchedule === 0 ? true : false
        planFeesForm.value.trusteeFeeType = props.proposalPlan.TrusteeSchedule === 0 ? '' : 4
        //Preference
        planFeesForm.value.paidByFee2 = props.proposalPlan.ConversionFeeShow
        planFeesForm.value.feePaidByFee2 = props.proposalPlan.ConversionFeeText
        planFeesForm.value.paidByFee1 = props.proposalPlan.DocumentFeeShow
        planFeesForm.value.feePaidByFee1 = props.proposalPlan.DocumentFeeText
        planFeesForm.value.waiveFee1 = props.proposalPlan.WaiveFee1
        planFeesForm.value.waiveFee2 = props.proposalPlan.WaiveFee2
        planFeesForm.value.exchangeTradedFunds = props.proposalPlan.ETF === 1 ? true : false
        planFeesForm.value.excludeSummary = !props.proposalPlan.ExcludeSummary
        planFeesForm.value.ancillaryFee = props.proposalPlan.AncillaryFee
        //toggle values
        planFeesForm.value.AllowInvestmentManager = props.proposalPlan.AllowInvestmentManager
        planFeesForm.value.AllowFinancialAdvisor = props.proposalPlan.AllowFinancialAdvisor
        if (loadTypeValue.value === '') loadTypeValue.value = 'load'
        if (val) getCapabilities()
        getOffsetOverride(false)
        getExpense(false)
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          planFeesForm.value.AllowInvestmentManager = true
          planFeesForm.value.AllowFinancialAdvisor = true
          $axios.get(`/api/v1/managedplan/${totalAssets.value}/serviceproviderfee`).then((success) => {
            if (success.data.d !== null && success.data.d.length > 0) {
              if ($store.state.user.selectedProgram.programName !== $authz.managedPlan.PA) {
                //MML Fees
                planFeesForm.value.mmlPlatformFeeType = 'manual'
                planFeesForm.value.mmlPlatformFee = success.data.d[2].Fee ? parseFloat(success.data.d[2].Fee) : 0
                mmlPlatformName.value = success.data.d[2].ServiceProvider
                planFeesForm.value.mmlPlatformFeeType = 1
                planFeesForm.value.mmlSchedule = 0
  
                oldPlanFeesForm.value.mmlPlatformFeeType = planFeesForm.value.mmlPlatformFeeType
                oldPlanFeesForm.value.mmlSchedule = planFeesForm.value.mmlSchedule
                oldPlanFeesForm.value.mmlPlatformFee = planFeesForm.value.mmlPlatformFee
              }
              /// Erisa fees
              planFeesForm.value.managerFeeType = 'manual'
              planFeesForm.value.managerFee = success.data.d[0].Fee ? parseFloat(success.data.d[0].Fee) : 0
              planFeesForm.value.managerEntryFeeType = 1
              planFeesForm.value.managerSchedule = 0
              mmlInvestmentName.value = success.data.d[0].ServiceProvider
              if (success.data.d[0].ServiceProviderName) {
                planFeesForm.value.managerName = success.data.d[0].ServiceProviderName
                oldPlanFeesForm.value.managerName = success.data.d[0].ServiceProviderName
              }
              successManagerFee.value = true
              ///Advisor
              var addEnterManually1 = true
              if (advisorScheduleList.value.length > 0) {
                var scheduleValueExist1 = advisorScheduleList.value.filter((a) => a.FeeScheduleID === 0)
                addEnterManually1 = scheduleValueExist1 && scheduleValueExist1.length > 0 ? false : true
              }
              if (addEnterManually1) {
                advisorScheduleList.value.push({
                  Name: 'Enter Fees Manually',
                  FeeScheduleID: 0,
                  MinimumFee: 0,
                  MaximumFee: 0,
                  DefaultFeeSchedule: false
                })
              }
              $axios.get(`/api/v1/managedplan/advisorfee/${totalAssets.value}`).then((advisorfeesuccess) => {
                if (advisorfeesuccess.data.d !== null) {
                  if ($store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
                    var defualtAdvisorFee =
                      advisorfeesuccess.data && advisorfeesuccess.data.d && advisorfeesuccess.data.d.length > 0
                        ? advisorfeesuccess.data.d[0].Fee
                          ? advisorfeesuccess.data.d[0].Fee
                          : 0
                        : 0
                    if (planFeesForm.value.advisorFee === 0 && planFeesForm.value.advisorFeeType === 'manual') {
                      planFeesForm.value.advisorFee = defualtAdvisorFee
                      if (advisorScheduleList.value.length > 0) {
                        planFeesForm.value.advisorSchedule = advisorScheduleList.value.find((obj) => {
                          return obj.FeeScheduleID === 0
                        })
                        planFeesForm.value.advisorEntryFeeType = 1
                      } else {
                        planFeesForm.value.advisorSchedule = ''
                        planFeesForm.value.advisorEntryFeeType = ''
                      }
                      oldPlanFeesForm.value.advisorFeeType = planFeesForm.value.advisorFeeType
                      oldPlanFeesForm.value.advisorFee = planFeesForm.value.advisorFee
                      oldPlanFeesForm.value.advisorSchedule = planFeesForm.value.advisorSchedule
                      oldPlanFeesForm.value.advisorEntryFeeType = planFeesForm.value.advisorEntryFeeType
                    }
                    maxAdvisoryFee.value = defualtAdvisorFee
                  }
  
                  if ($store.state.user.selectedProgram.programName === $authz.managedPlan.PA) {
                    minAdvisoryFee.value = advisorfeesuccess.data.d[0].MinFee
                    maxAdvisoryFee.value = advisorfeesuccess.data.d[0].Fee
                  }
                }
              })
  
              if ($store.state.user.selectedProgram.programName === $authz.managedPlan.PA) {
                if (planFeesForm.value.advisorFee === 0 && planFeesForm.value.advisorFeeType === 'manual') {
                  planFeesForm.value.advisorFee = parseFloat(success.data.d[1].Fee)
                  if (advisorScheduleList.value.length > 0) {
                    planFeesForm.value.advisorSchedule = advisorScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === 0
                    })
                    planFeesForm.value.advisorEntryFeeType = 1
                  } else {
                    planFeesForm.value.advisorSchedule = ''
                    planFeesForm.value.advisorEntryFeeType = ''
                  }
                }
              }
              mmlAdvisorName.value = success.data.d[1].ServiceProvider
              if (success.data.d[1].ServiceProviderName) {
                planFeesForm.value.advisorName = success.data.d[1].ServiceProviderName
                oldPlanFeesForm.value.advisorName = success.data.d[1].ServiceProviderName
              }
              succeessAdvisorFee.value = true
  
              oldPlanFeesForm.value.managerFeeType = planFeesForm.value.managerFeeType
              oldPlanFeesForm.value.managerFee = planFeesForm.value.managerFee
              oldPlanFeesForm.value.managerSchedule = planFeesForm.value.managerSchedule
              oldPlanFeesForm.value.managerEntryFeeType = planFeesForm.value.managerEntryFeeType
              oldPlanFeesForm.value.advisorFeeType = planFeesForm.value.advisorFeeType
              oldPlanFeesForm.value.advisorFee = planFeesForm.value.advisorFee
              oldPlanFeesForm.value.advisorSchedule = planFeesForm.value.advisorSchedule
              oldPlanFeesForm.value.advisorEntryFeeType = planFeesForm.value.advisorEntryFeeType
            }
          })
        }
        updateOldplanFeesForm()
      }
      function updateOldplanFeesForm() {
        oldPlanFeesForm.value.managerName = planFeesForm.value.managerName
        oldPlanFeesForm.value.managerFeeType = planFeesForm.value.managerFeeType
        oldPlanFeesForm.value.managerFee = planFeesForm.value.managerFee
        oldPlanFeesForm.value.managerSchedule = planFeesForm.value.managerSchedule
        oldPlanFeesForm.value.managerEntryFeeType = planFeesForm.value.managerEntryFeeType
        oldPlanFeesForm.value.AllowInvestmentManager = planFeesForm.value.AllowInvestmentManager
        oldPlanFeesForm.value.AllowFinancialAdvisor = planFeesForm.value.AllowFinancialAdvisor
        oldPlanFeesForm.value.advisorEntryFeeType = planFeesForm.value.advisorEntryFeeType
        oldPlanFeesForm.value.advisorName = planFeesForm.value.advisorName
        oldPlanFeesForm.value.advisorFeeType = planFeesForm.value.advisorFeeType
        oldPlanFeesForm.value.advisorFee = planFeesForm.value.advisorFee
        oldPlanFeesForm.value.advisorSchedule = planFeesForm.value.advisorSchedule
        oldPlanFeesForm.value.tpaAdminSchedule = planFeesForm.value.tpaAdminSchedule
        oldPlanFeesForm.value.tpaEntryFeeType = planFeesForm.value.tpaEntryFeeType
        oldPlanFeesForm.value.tpaAdminBasisFee = planFeesForm.value.tpaAdminBasisFee
        oldPlanFeesForm.value.tpaAdminName = planFeesForm.value.tpaAdminName
        oldPlanFeesForm.value.tparkSchedule = planFeesForm.value.tparkSchedule
        oldPlanFeesForm.value.tparkFee = planFeesForm.value.tparkFee
        oldPlanFeesForm.value.tparkName = planFeesForm.value.tparkName
        oldPlanFeesForm.value.tparkFeeType = planFeesForm.value.tparkFeeType
        oldPlanFeesForm.value.tparkBasisFee = planFeesForm.value.tparkBasisFee
        oldPlanFeesForm.value.trusteeSchedule = planFeesForm.value.trusteeSchedule
        oldPlanFeesForm.value.trusteeFee = planFeesForm.value.trusteeFee
        oldPlanFeesForm.value.trusteeFeeType = planFeesForm.value.trusteeFeeType
        oldPlanFeesForm.value.trusteeBasisFee = planFeesForm.value.trusteeBasisFee
        oldPlanFeesForm.value.trusteeName = planFeesForm.value.trusteeName
        oldPlanFeesForm.value.providerName = planFeesForm.value.providerName
        oldPlanFeesForm.value.providerFeeType = planFeesForm.value.providerFeeType
        oldPlanFeesForm.value.providerFee = planFeesForm.value.providerFee
        oldPlanFeesForm.value.providerSchedule = planFeesForm.value.providerSchedule
        oldPlanFeesForm.value.providerEntryFeeType = planFeesForm.value.providerEntryFeeType
        oldPlanFeesForm.value.waiveFee1 = planFeesForm.value.waiveFee1
        oldPlanFeesForm.value.waiveFee2 = planFeesForm.value.waiveFee2
        oldPlanFeesForm.value.ETF = planFeesForm.value.exchangeTradedFunds ? 1 : 0
        oldPlanFeesForm.value.paidByFee2 = planFeesForm.value.paidByFee2
        oldPlanFeesForm.value.feePaidByFee2 = planFeesForm.value.feePaidByFee2
        oldPlanFeesForm.value.paidByFee1 = planFeesForm.value.paidByFee1
        oldPlanFeesForm.value.feePaidByFee1 = planFeesForm.value.feePaidByFee1
        oldPlanFeesForm.value.ancillaryFee = planFeesForm.value.ancillaryFee
        oldPlanFeesForm.value.excludeSummary = planFeesForm.value.excludeSummary
        oldPlanFeesForm.value.tpaAdminFeeType = planFeesForm.value.tpaAdminFeeType
        oldPlanFeesForm.value.tpaAdminFee = planFeesForm.value.tpaAdminFee
        oldPlanFeesForm.value.expenseFee = planFeesForm.value.expenseFee
        oldPlanFeesForm.value.offsetAmount = planFeesForm.value.offsetAmount
        oldPlanFeesForm.value.offsetOverrideFee = planFeesForm.value.offsetOverrideFee
        oldManagerDollar.value = managerDollar.value
        oldManagerPercent.value = managerPercent.value
        oldAdvisorPercent.value = advisorPercent.value
        oldAdvisorDollar.value = advisorDollar.value
        oldTPAAdminDollar.value = tpaAdminDollar.value
        oldTPAAdminPercent.value = tpaAdminPercent.value
      }
      function getDynamicFees() {
        var schedule = 0
        if (planFeesForm.value.tparkSchedule) {
          if (typeof planFeesForm.value.tparkSchedule === 'object') {
            schedule = planFeesForm.value.tparkSchedule.FeeScheduleID
          }
        }
        if (schedule !== 0) {
          $axios
            .get(
              `/api/v1/tal/proposal/providerfee?feeSchedule=${schedule}&totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&participants=${totalParticipant.value}`
            )
            .then((success) => {
              if (success.data.d !== null) {
                var recordkeepingMinFee = planFeesForm.value.tparkSchedule.MinimumFee
                  ? planFeesForm.value.tparkSchedule.MinimumFee
                  : 0
                var recordkeepingMaxFee = planFeesForm.value.tparkSchedule.MaximumFee
                  ? planFeesForm.value.tparkSchedule.MaximumFee
                  : 0
                var recordkeepingFees =
                  success.data.d.length > 0 ? (success.data.d[0].fee ? parseFloat(success.data.d[0].fee) : 0) : 0
                if (recordkeepingMinFee > 0) {
                  if (recordkeepingFees <= recordkeepingMinFee) {
                    recordkeepingFees = recordkeepingMinFee
                    feesAdjusted.value = true
                    recordkeepingFeeMsg.value =
                      'The Recordkeeping fee has been adjusted to the minimum fee requirements of the corresponding fee schedule'
                  }
                }
                if (recordkeepingMaxFee > 0) {
                  if (recordkeepingFees >= recordkeepingMaxFee) {
                    recordkeepingFees = recordkeepingMaxFee
                    feesAdjusted.value = true
                    recordkeepingFeeMsg.value =
                      'The Recordkeeping fee has been adjusted to the maximum fee requirements of the corresponding fee schedule'
                  }
                }
                if (recordkeepingMinFee === 0 && recordkeepingMaxFee === 0) {
                  recordkeepingFeeMsg.value = ''
                }
                planFeesForm.value.tparkFee = Number(parseFloat(recordkeepingFees).toFixed(0))
              } else planFeesForm.value.tparkFee = 0
  
              if (loadTypeValue.value === 'load') {
                oldPlanFeesForm.value.tparkFee = planFeesForm.value.tparkFee
                oldPlanFeesForm.value.tparkFeeType = 4
              }
  
              successTparkFee.value = true
              showEstimatedFees()
            })
        } else {
          planFeesForm.value.tparkFee = 0
          successTparkFee.value = true
          if (loadTypeValue.value === 'load') {
            oldPlanFeesForm.value.tparkFeeType = 4
            oldPlanFeesForm.value.tparkFee = planFeesForm.value.tparkFee
          }
          showEstimatedFees()
        }
      }
      const savePlanFees = async () => {
        var proposalPlan = {}
        proposalPlan.DCPTYPE = props.selectedPlan.DCPTYPE
        proposalPlan.TPA = trusteeCustodian.value
        proposalPlan.SUB = subCustodian.value
        proposalPlan.FeeType = planFeesForm.value.managerFeeType === 'manual' ? 0 : 1
        proposalPlan.ManagerName = planFeesForm.value.managerName
        if (planFeesForm.value.managerFeeType === 'manual') {
          proposalPlan.ManagerFee = planFeesForm.value.managerFee ? parseFloat(planFeesForm.value.managerFee).toFixed(2) : 0
          proposalPlan.ManagerSchedule = 0
          proposalPlan.ManagerFeeEntryType = planFeesForm.value.managerEntryFeeType ? planFeesForm.value.managerEntryFeeType : 0
        } else if (planFeesForm.value.managerFeeType === 'feeSchedule') {
          proposalPlan.ManagerSchedule = planFeesForm.value.managerSchedule
            ? planFeesForm.value.managerSchedule.FeeScheduleID
              ? planFeesForm.value.managerSchedule.FeeScheduleID
              : 0
            : 0
          proposalPlan.ManagerFee = 0
          proposalPlan.ManagerFeeEntryType = 4
        } else {
          proposalPlan.ManagerSchedule = 0
          proposalPlan.ManagerFee = 0
          proposalPlan.ManagerFeeEntryType = 0
        }
        proposalPlan.AdvisorFeeType = planFeesForm.value.advisorFeeType === 'manual' ? 0 : 1
        proposalPlan.AdvisorName = planFeesForm.value.advisorName
        if (planFeesForm.value.advisorFeeType === 'manual') {
          proposalPlan.AdvisorFee = planFeesForm.value.advisorFee ? planFeesForm.value.advisorFee : 0
          proposalPlan.AdvisorSchedule = 0
          proposalPlan.AdvisorFeeEntryType = planFeesForm.value.advisorEntryFeeType ? planFeesForm.value.advisorEntryFeeType : 0
        } else if (planFeesForm.value.advisorFeeType === 'feeSchedule') {
          proposalPlan.AdvisorSchedule = planFeesForm.value.advisorSchedule
            ? planFeesForm.value.advisorSchedule.FeeScheduleID
              ? planFeesForm.value.advisorSchedule.FeeScheduleID
              : 0
            : 0
          proposalPlan.AdvisorFee = 0
          proposalPlan.AdvisorFeeEntryType = 4
        } else {
          proposalPlan.AdvisorSchedule = 0
          proposalPlan.AdvisorFee = 0
          proposalPlan.AdvisorFeeEntryType = 0
        }
        proposalPlan.WaiveFee1 = planFeesForm.value.waiveFee1
        proposalPlan.WaiveFee2 = planFeesForm.value.waiveFee2
        proposalPlan.ETF = planFeesForm.value.exchangeTradedFunds ? 1 : 0
        proposalPlan.AncillaryFee = planFeesForm.value.ancillaryFee
        proposalPlan.ExcludeSummary = !planFeesForm.value.excludeSummary
        proposalPlan.TPASchedule = planFeesForm.value.tpaAdminSchedule
          ? planFeesForm.value.tpaAdminSchedule.FeeScheduleID
            ? planFeesForm.value.tpaAdminSchedule.FeeScheduleID
            : 0
          : 0
        proposalPlan.ConversionFeeShow = planFeesForm.value.paidByFee2
        proposalPlan.ConversionFeeText = planFeesForm.value.feePaidByFee2
        proposalPlan.DocumentFeeShow = planFeesForm.value.paidByFee1
        proposalPlan.DocumentFeeText = planFeesForm.value.feePaidByFee1
        proposalPlan.TPARKFee = planFeesForm.value.tparkFee ? Number(parseFloat(planFeesForm.value.tparkFee).toFixed(0)) : 0
        proposalPlan.TPARKSchedule = planFeesForm.value.tparkSchedule
          ? planFeesForm.value.tparkSchedule.FeeScheduleID
            ? planFeesForm.value.tparkSchedule.FeeScheduleID
            : 0
          : 0
        proposalPlan.TrusteeFee = planFeesForm.value.trusteeFee ? Number(parseFloat(planFeesForm.value.trusteeFee).toFixed(0)) : 0
        proposalPlan.TrusteeSchedule = planFeesForm.value.trusteeSchedule
          ? planFeesForm.value.trusteeSchedule.FeeScheduleID
            ? planFeesForm.value.trusteeSchedule.FeeScheduleID
            : 0
          : 0
        proposalPlan.ProviderType = planFeesForm.value.providerFeeType === 'manual' ? 0 : 1
        proposalPlan.ProviderName = planFeesForm.value.providerName
        proposalPlan.ProviderFee = planFeesForm.value.providerFee
          ? Number(parseFloat(planFeesForm.value.providerFee).toFixed(0))
          : 0
        proposalPlan.ProviderSchedule = planFeesForm.value.providerSchedule
          ? planFeesForm.value.providerSchedule.FeeScheduleID
            ? planFeesForm.value.providerSchedule.FeeScheduleID
            : 0
          : 0
        proposalPlan.ProviderPercent = providerPercent.value
        proposalPlan.ProviderDollar = providerDollar.value
        proposalPlan.ManagerPercent = managerPercent.value
        proposalPlan.ManagerDollar = managerDollar.value
        proposalPlan.AdvisorPercent = advisorPercent.value
        proposalPlan.AdvisorDollar = advisorDollar.value
        proposalPlan.ExpensePercent = expensePercent.value
        proposalPlan.ExpenseDollar = expenseDollar.value
        proposalPlan.PCSAdminDollar = 0
        proposalPlan.TPAAdminDollar = tpaAdminDollar.value
        proposalPlan.TPARKDollar = tparkDollar.value
        proposalPlan.TrusteeDollar = trusteeDollar.value
        proposalPlan.EstimatedPercent = estimatedPercent.value
        proposalPlan.EstimatedDollar = estimatedDollar.value
        proposalPlan.TPAName = planFeesForm.value.tpaAdminName
        if (serviceType.value === 1 && planFeesForm.value.tpaAdminSchedule.FeeScheduleID === 0) {
          proposalPlan.TPAFeeType = 1
        } else {
          proposalPlan.TPAFeeType = 0
        }
        proposalPlan.TPAFee = serviceType.value === 1 ? Number(parseFloat(planFeesForm.value.tpaAdminFee).toFixed(0)) : 0
        proposalPlan.TPAFeeEntryType = planFeesForm.value.tpaEntryFeeType ? planFeesForm.value.tpaEntryFeeType : 0
        proposalPlan.TPAAdminManualBasisPoint = planFeesForm.value.tpaAdminBasisFee ? planFeesForm.value.tpaAdminBasisFee : 0
        proposalPlan.TPAAdminPercent = tpaAdminPercent.value
        proposalPlan.TPARKPercent = tparkPercent.value
        proposalPlan.TrusteePercent = trusteePercent.value
        proposalPlan.MutualFundOffsetDollar = offsetDollar.value
        proposalPlan.MutualFundOffsetPercent = planFeesForm.value.offsetPercent ? planFeesForm.value.offsetPercent : 0
        proposalPlan.RecordkeepingCompanyName = planFeesForm.value.tparkName ? planFeesForm.value.tparkName : ''
        proposalPlan.TrusteeCompanyName = planFeesForm.value.trusteeName ? planFeesForm.value.trusteeName : ''
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          ) &&
          $store.state.user.selectedProgram.programName !== $authz.managedPlan.PA
        ) {
          proposalPlan.BDPlatformFee = planFeesForm.value.mmlPlatformFee
            ? Number(parseFloat(planFeesForm.value.mmlPlatformFee).toFixed(0))
            : 0
          proposalPlan.BDPlatFormPercent = mmlPlatformPercent.value ? parseFloat(mmlPlatformPercent.value) : 0
          proposalPlan.BDPlatFormDollar = mmlPlatformDollar.value ? parseFloat(mmlPlatformDollar.value) : 0
        } else {
          proposalPlan.BDPlatformFee = 0
          proposalPlan.BDPlatFormPercent = 0
          proposalPlan.BDPlatFormDollar = 0
        }
        proposalPlan.AllowInvestmentManager = planFeesForm.value.AllowInvestmentManager
        proposalPlan.AllowFinancialAdvisor = planFeesForm.value.AllowFinancialAdvisor
        proposalPlan.PlanID = props.planId
        proposalPlan.SEINPNO = props.SEINPNO
  
        if (planFeesForm.value.AllowInvestmentManager === false) {
          proposalPlan.ManagerName = ''
          proposalPlan.FeeType = 0
          proposalPlan.ManagerFee = 0
          proposalPlan.ManagerSchedule = 0
        }
  
        if (planFeesForm.value.AllowFinancialAdvisor === false) {
          proposalPlan.AdvisorName = ''
          proposalPlan.AdvisorFeeType = 0
          proposalPlan.AdvisorFee = 0
          proposalPlan.AdvisorSchedule = 0
        }
        await $axios.put('/api/v1/tal/proposal/planfees', proposalPlan)
        saveFeeOptions()
        assignPlanFees('save')
        props.saveProposalPlanFeesMethod(proposalPlan)
        updateOldplanFeesForm()
        saveProvider.value = false
        saveManager.value = false
        saveAdvisor.value = false
        saveAdmin.value = false
        saveTpark.value = false
        saveTrustee.value = false
        saveOffset.value = false
      }
      function showPlanFees(val) {
        if (val && val.length > 0) {
          var proposalPermission = val[0]
          showInvestmentManager.value =
            proposalPermission.Hide_Investment_Manager__c !== null
              ? proposalPermission.Hide_Investment_Manager__c === 'false'
                ? false
                : true
              : false
          showFinancialAdvisor.value =
            proposalPermission.Hide_Financial_Advisor__c !== null
              ? proposalPermission.Hide_Financial_Advisor__c === 'false'
                ? false
                : true
              : false
          showAdministration.value =
            proposalPermission.Hide_Administration__c !== null
              ? proposalPermission.Hide_Administration__c === 'false'
                ? false
                : true
              : false
          showRecordkeeping.value =
            proposalPermission.Hide_Recordkeeping__c !== null
              ? proposalPermission.Hide_Recordkeeping__c === 'false'
                ? false
                : true
              : false
          showTrusteeCustodian.value =
            proposalPermission.Hide_Trustee_Custodian__c !== null
              ? proposalPermission.Hide_Trustee_Custodian__c === 'false'
                ? false
                : true
              : false
          showAvgInvestmentExpense.value =
            proposalPermission.Hide_Avg_Investment_Expense__c !== null
              ? proposalPermission.Hide_Avg_Investment_Expense__c === 'false'
                ? false
                : true
              : false
          showMutualFundOffset.value =
            proposalPermission.Hide_Mutual_Fund_Offset__c !== null
              ? proposalPermission.Hide_Mutual_Fund_Offset__c === 'false'
                ? false
                : true
              : false
          showIncludeAncillaryFeeSchedule.value =
            proposalPermission.Include_Ancillary_Fee_Schedule__c !== null
              ? proposalPermission.Include_Ancillary_Fee_Schedule__c === 'false'
                ? false
                : true
              : false
          hideExchangeTradedFunds.value =
            proposalPermission.Hide_Exchange_Traded_Funds__c !== null
              ? proposalPermission.Hide_Exchange_Traded_Funds__c === 'false'
                ? false
                : true
              : false
          showIncludeModelSummaryPages.value =
            proposalPermission.Include_Model_Summary_Pages__c !== null
              ? proposalPermission.Include_Model_Summary_Pages__c === 'false'
                ? false
                : true
              : false
        }
      }
      function getCapabilities() {
        $axios.get(`/api/v1/tal/advisor/capabilities/proposal`).then((success) => {
          isEmployee.value = success.data.d !== null ? success.data.d.IsEmployee : 'false'
          showProfessionalService.value = success.data.d !== null ? success.data.d.Show_Professional_Services_Line__c : 'false'
          enterpriseName.value = success.data.d !== null ? success.data.d.Enterprise__r_Name : ''
          showConversionFeePaidBy.value = success.data.d !== null ? success.data.d.Conversion_Fee_Paid_by__c : 'false'
          showDocumentFeePaidBy.value = success.data.d !== null ? success.data.d.Document_Fee_Paid_by__c : 'false'
          accessSponsor.value = success.data.d !== null ? success.data.d.Access_Sponsor__c : ''
          assignedRKOnly.value = success.data.d !== null ? success.data.d.Show_Only_Assigned_RK_Schedules__c : 'false'
          assignedCustodianOnly.value = success.data.d !== null ? success.data.d.Show_Only_Assigned_Custodian_Schedules__c : 'false'
          loadTrustee()
          loadSchedules()
        })
      }
      function getRecordkeepingFees() {
        var fee = 0
        var trusteeVal = etf.value === 0 ? 0.0003 : 0.0005
        if (accessSponsor.value) {
          $axios
            .get(
              `/api/v1/tal/proposal/recordkeepingfee?totalAssets=${totalAssets.value}&outsideAmount=${outsideAmount.value}&stockAmount=${stockAmount.value}&particiapant=${totalParticipant.value}&trustee=${trusteeVal}&accessSponsor=${accessSponsor.value}`
            )
            .then((success) => {
              if (success.data.d !== null) {
                fee = success.data.d.length > 0 ? success.data.d[0].fee : 0
              }
              if (planType.value === 'Uni-k') {
                fee = totalAssets.value * 0.0035
                if (fee < 300) fee = 300
                planFeesForm.value.tparkFee = Number(parseFloat(fee).toFixed(0))
              } else {
                fee = fee + 300
                planFeesForm.value.tparkFee = Number(parseFloat(fee).toFixed(0))
              }
              if (loadTypeValue.value === 'load') oldPlanFeesForm.value.tparkFee = planFeesForm.value.tparkFee
              successTparkFee.value = true
              showEstimatedFees()
            })
        } else showEstimatedFees()
      }
      const loadSchedules = async () => {
        var schedulePromise = []
        ///RecordKeeping
        if (assignedRKOnly.value === 'true') {
          schedulePromise.push(
            $axios
              .get(
                `/api/v1/tal/proposal/${props.planId}/recordkeeping?planType=${planType.value}&seinpno=${props.SEINPNO}&activeOnly=true&espType=${props.proposalPlan.ESPType}`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  tparkScheduleList.value = success.data.d.length > 0 ? success.data.d : []
                  if (tparkScheduleList.value.length > 0) {
                    if (props.proposalPlan.TPARKSchedule !== 0) {
                      var tparkFeeObject = tparkScheduleList.value.find((obj) => {
                        return obj.FeeScheduleID === props.proposalPlan.TPARKSchedule
                      })
                      if (!tparkFeeObject) {
                        var defaultRecordkeepingFees1 = tparkScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                        if (defaultRecordkeepingFees1.length > 0) {
                          planFeesForm.value.tparkSchedule = defaultRecordkeepingFees1[0]
                        } else {
                          planFeesForm.value.tparkSchedule = ''
                          if (props.proposalPlan.TPARKSchedule > 0) successRecordkeeping.value = true
                        }
                      } else planFeesForm.value.tparkSchedule = tparkFeeObject
                      oldPlanFeesForm.value.tparkSchedule = planFeesForm.value.tparkSchedule
                    } else {
                      var defaultRecordkeepingFees = tparkScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultRecordkeepingFees.length > 0) {
                        planFeesForm.value.tparkSchedule = defaultRecordkeepingFees[0]
                        oldPlanFeesForm.value.tparkSchedule = planFeesForm.value.tparkSchedule
                      }
                    }
                  } else {
                    planFeesForm.value.tparkSchedule = ''
                    planFeesForm.value.tparkFee = 0
                    planFeesForm.value.tparkFeeType = ''
                    planFeesForm.value.tparkBasisFee = 0
                    if (loadTypeValue.value === 'load') {
                      oldPlanFeesForm.value.tparkFee = 0
                      oldPlanFeesForm.value.tparkFeeType = ''
                      oldPlanFeesForm.value.tparkBasisFee = 0
                    }
                  }
                }
                if (success.data.d === null || success.data.d.length === 0) {
                  getRecordkeepingFees()
                }
                successRecordkeeping.value = true
              })
              .catch(() => {
                successRecordkeeping.value = true
              })
          )
        } else {
          schedulePromise.push(
            $axios
              .get(
                `/api/v1/tal/proposal/${props.planId}/allrecordkeeping?planType=${planType.value}&seinpno=${props.SEINPNO}&activeOnly=true&espType=${props.proposalPlan.ESPType}`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  tparkScheduleList.value = success.data.d.length > 0 ? success.data.d : []
                  if (tparkScheduleList.value.length > 0) {
                    if (props.proposalPlan.TPARKSchedule !== 0) {
                      var tparkFeeValue = tparkScheduleList.value.find((obj) => {
                        return obj.FeeScheduleID === props.proposalPlan.TPARKSchedule
                      })
                      if (!tparkFeeValue) {
                        var defaultRecordkeepingFees1 = tparkScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                        if (defaultRecordkeepingFees1.length > 0) {
                          planFeesForm.value.tparkSchedule = defaultRecordkeepingFees1[0]
                        } else {
                          planFeesForm.value.tparkSchedule = ''
                          if (props.proposalPlan.TPARKSchedule > 0) successRecordkeeping.value = true
                        }
                      } else planFeesForm.value.tparkSchedule = tparkFeeValue
                      oldPlanFeesForm.value.tparkSchedule = planFeesForm.value.tparkSchedule
                    } else {
                      var defaultRecordkeepingFees = tparkScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultRecordkeepingFees.length > 0) {
                        planFeesForm.value.tparkSchedule = defaultRecordkeepingFees[0]
                        oldPlanFeesForm.value.tparkSchedule = planFeesForm.value.tparkSchedule
                      }
                    }
                  } else {
                    planFeesForm.value.tparkSchedule = ''
                    planFeesForm.value.tparkFee = 0
                    if (loadTypeValue.value === 'load') oldPlanFeesForm.value.tparkFee = 0
                  }
                }
                if (success.data.d === null || success.data.d.length === 0) {
                  getRecordkeepingFees()
                }
                successRecordkeeping.value = true
              })
              .catch(() => {
                successRecordkeeping.value = true
              })
          )
        }
        // Administration
        if (serviceType.value === 1) {
          schedulePromise.push(
            $axios
              .get(
                `/api/v1/tal/proposal/${props.planId}/administrationother?planType=${planType.value}&seinpno=${props.SEINPNO}&activeOnly=true`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  tpaAdminScheduleList.value = success.data.d.length > 0 ? success.data.d : []
                  var addEnterManuallyAdmin = true
                  tpaAdminScheduleList.value.unshift({
                    Name: 'Priced Separately',
                    FeeScheduleID: -1,
                    MinimumFee: 0,
                    MaximumFee: 0,
                    DefaultFeeSchedule: true
                  })
  
                  if (tpaAdminScheduleList.value.length > 0) {
                    var manualScheduleValueExist = tpaAdminScheduleList.value.filter((a) => a.FeeScheduleID === 0)
                    addEnterManuallyAdmin = manualScheduleValueExist && manualScheduleValueExist.length > 0 ? false : true
                  }
                  if (addEnterManuallyAdmin) {
                    tpaAdminScheduleList.value.push({
                      Name: 'Enter Fees Manually',
                      FeeScheduleID: 0,
                      MinimumFee: 0,
                      MaximumFee: 0,
                      DefaultFeeSchedule: false
                    })
  
                    if (props.proposalPlan.TPASchedule !== 0) {
                      var tpaAdminFeeObject = tpaAdminScheduleList.value.find((obj) => {
                        return obj.FeeScheduleID === props.proposalPlan.TPASchedule
                      })
  
                      if (!tpaAdminFeeObject) {
                        var defaultAdminFees1 = tpaAdminScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                        if (defaultAdminFees1.length > 0) {
                          planFeesForm.value.tpaAdminSchedule = defaultAdminFees1[0]
                        } else {
                          planFeesForm.value.tpaAdminSchedule = ''
                          if (props.proposalPlan.TPASchedule > 0) successAdministration.value = true
                        }
                      } else planFeesForm.value.tpaAdminSchedule = tpaAdminFeeObject
                      oldPlanFeesForm.value.tpaAdminSchedule = planFeesForm.value.tpaAdminSchedule
                    } else if (props.proposalPlan.TPASchedule === 0 && props.proposalPlan.TPAFeeEntryType !== 0) {
                      var adminEntryFeeObject = tpaAdminScheduleList.value.find((obj) => {
                        return obj.FeeScheduleID === props.proposalPlan.TPASchedule
                      })
                      planFeesForm.value.tpaAdminSchedule = adminEntryFeeObject
                      oldPlanFeesForm.value.tpaAdminSchedule = planFeesForm.value.tpaAdminSchedule
                    } else {
                      var defaultAdminFees = tpaAdminScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultAdminFees.length > 0) {
                        planFeesForm.value.tpaAdminSchedule = defaultAdminFees[0]
                        oldPlanFeesForm.value.tpaAdminSchedule = planFeesForm.value.tpaAdminSchedule
                      }
                    }
                    getAdminValue(true, 'load')
                  } else {
                    planFeesForm.value.tpaAdminSchedule = ''
                    planFeesForm.value.tpaAdminFee = 0
                    planFeesForm.value.tpaEntryFeeType = ''
                    planFeesForm.value.tpaAdminBasisFee = 0
                    if (loadTypeValue.value === 'load') {
                      oldPlanFeesForm.value.tpaAdminFee = 0
                      oldPlanFeesForm.value.tpaEntryFeeType = ''
                      oldPlanFeesForm.value.tpaAdminBasisFee = 0
                    }
                  }
                }
                successAdministration.value = true
              })
              .catch(() => {
                successAdministration.value = true
              })
          )
        } else {
          schedulePromise.push(
            $axios
              .get(
                `/api/v1/tal/proposal/${props.planId}/administrationpcs?planType=${planType.value}&seinpno=${props.SEINPNO}&activeOnly=true&espType=${props.proposalPlan.ESPType}`
              )
              .then((success) => {
                if (success.data.d !== null) {
                  tpaAdminScheduleList.value = success.data.d.length > 0 ? success.data.d : []
                  if (tpaAdminScheduleList.value.length > 0) {
                    if (props.proposalPlan.TPASchedule !== 0) {
                      var adminDropdown = tpaAdminScheduleList.value.find((obj) => {
                        return obj.FeeScheduleID === props.proposalPlan.TPASchedule
                      })
                      if (!adminDropdown) {
                        var defaultPCSAdminFees = tpaAdminScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                        if (defaultPCSAdminFees.length > 0) {
                          planFeesForm.value.tpaAdminSchedule = defaultPCSAdminFees[0]
                        } else {
                          planFeesForm.value.tpaAdminSchedule = ''
                          if (props.proposalPlan.TPASchedule > 0) successAdministration.value = true
                        }
                      } else planFeesForm.value.tpaAdminSchedule = adminDropdown
                      oldPlanFeesForm.value.tpaAdminSchedule = planFeesForm.value.tpaAdminSchedule
                    } else {
                      var defaultAdminFees = tpaAdminScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultAdminFees.length > 0) {
                        planFeesForm.value.tpaAdminSchedule = defaultAdminFees[0]
                        oldPlanFeesForm.value.tpaAdminSchedule = planFeesForm.value.tpaAdminSchedule
                      }
                    }
                    getAdminValue(true, 'load')
                  } else {
                    planFeesForm.value.tpaAdminSchedule = ''
                    planFeesForm.value.tpaAdminFee = 0
                    planFeesForm.value.tpaEntryFeeType = ''
                    planFeesForm.value.tpaAdminBasisFee = 0
                    if (loadTypeValue.value === 'load') {
                      oldPlanFeesForm.value.tpaAdminFee = 0
                      oldPlanFeesForm.value.tpaEntryFeeType = ''
                      oldPlanFeesForm.value.tpaAdminBasisFee = 0
                    }
                  }
                }
                successAdministration.value = true
              })
              .catch(() => {
                successAdministration.value = true
              })
          )
        }
        //Advisory
        schedulePromise.push(
          $axios
            .get(
              `/api/v1/tal/proposal/${props.planId}/advisory?planType=${planType.value}&seinpno=${props.SEINPNO}&activeOnly=true`
            )
            .then((success) => {
              if (success.data.d !== null) {
                advisorScheduleList.value = success.data.d.length > 0 ? success.data.d : []
                var addEnterManually = true
                if (advisorScheduleList.value.length > 0) {
                  var scheduleValueExist = advisorScheduleList.value.filter((a) => a.FeeScheduleID === 0)
                  addEnterManually = scheduleValueExist && scheduleValueExist.length > 0 ? false : true
                }
                if (addEnterManually) {
                  advisorScheduleList.value.push({
                    Name: 'Enter Fees Manually',
                    FeeScheduleID: 0,
                    MinimumFee: 0,
                    MaximumFee: 0,
                    DefaultFeeSchedule: false
                  })
                }
                if (advisorScheduleList.value.length > 0) {
                  if (props.proposalPlan.AdvisorSchedule !== 0) {
                    var advisorFeeObject = advisorScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === props.proposalPlan.AdvisorSchedule
                    })
  
                    if (!advisorFeeObject) {
                      var defaultAdvisoryFees1 = advisorScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultAdvisoryFees1.length > 0) {
                        planFeesForm.value.advisorSchedule = defaultAdvisoryFees1[0]
                      } else {
                        planFeesForm.value.advisorSchedule = ''
                        if (props.proposalPlan.AdvisorSchedule > 0) successAdvisory.value = true
                      }
                    } else planFeesForm.value.advisorSchedule = advisorFeeObject
  
                    oldPlanFeesForm.value.advisorSchedule = planFeesForm.value.advisorSchedule
                  } else if (props.proposalPlan.AdvisorSchedule === 0 && props.proposalPlan.AdvisorFeeEntryType !== 0) {
                    var advisorEntryFeeObject = advisorScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === props.proposalPlan.AdvisorSchedule
                    })
                    planFeesForm.value.advisorSchedule = advisorEntryFeeObject
                    oldPlanFeesForm.value.advisorSchedule = planFeesForm.value.advisorSchedule
                  } else {
                    if (props.proposalPlan.AllowFinancialAdvisor) {
                      var defaultAdvisoryFees = advisorScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultAdvisoryFees.length > 0) {
                        planFeesForm.value.advisorSchedule = defaultAdvisoryFees[0]
                        oldPlanFeesForm.value.advisorSchedule = planFeesForm.value.advisorSchedule
                      }
                    }
                  }
                  getAdvisorValue(true)
                }
              }
              successAdvisory.value = true
            })
            .catch(() => {
              successAdvisory.value = true
            })
        )
  
        //Investment Manager
        schedulePromise.push(
          $axios
            .get(
              `/api/v1/tal/proposal/${props.planId}/investmentmanager?planType=${planType.value}&seinpno=${props.SEINPNO}&activeOnly=true`
            )
            .then((success) => {
              if (success.data.d !== null) {
                managerScheduleList.value = success.data.d.length > 0 ? success.data.d : []
                // PAS Manager Schedules
                if (enterpriseName.value === 'Park Avenue Securities') {
                  managerScheduleList.value = []
                  managerScheduleList.value.unshift({
                    Name: 'EA ERISA 3(38) Inv Mgr',
                    FeeScheduleID: 3961,
                    MinimumFee: 0,
                    MaximumFee: 0,
                    DefaultFeeSchedule: false
                  })
                }
                managerScheduleList.value.push({
                  Name: 'Enter Fees Manually',
                  FeeScheduleID: 0,
                  MinimumFee: 0,
                  MaximumFee: 0,
                  DefaultFeeSchedule: false
                })
                if (managerScheduleList.value.length > 0) {
                  if (props.proposalPlan.ManagerSchedule !== 0) {
                    var managerFeeObject = managerScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === props.proposalPlan.ManagerSchedule
                    })
  
                    if (!managerFeeObject) {
                      var defaultInvestmentFees1 = managerScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultInvestmentFees1.length > 0) {
                        planFeesForm.value.managerSchedule = defaultInvestmentFees1[0]
                      } else {
                        planFeesForm.value.managerSchedule = ''
                        if (props.proposalPlan.ManagerSchedule > 0) successManagerFee.value = true
                      }
                    } else planFeesForm.value.managerSchedule = managerFeeObject
  
                    oldPlanFeesForm.value.managerSchedule = planFeesForm.value.managerSchedule
                  } else if (props.proposalPlan.ManagerSchedule === 0 && props.proposalPlan.ManagerFeeEntryType !== 0) {
                    var managerEntryFeeObject = managerScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === props.proposalPlan.ManagerSchedule
                    })
                    planFeesForm.value.managerSchedule = managerEntryFeeObject
                    oldPlanFeesForm.value.managerSchedule = planFeesForm.value.managerSchedule
                  } else {
                    if (props.proposalPlan.AllowInvestmentManager) {
                      var defaultInvestmentFees = managerScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                      if (defaultInvestmentFees.length > 0) {
                        planFeesForm.value.managerSchedule = defaultInvestmentFees[0]
                        oldPlanFeesForm.value.managerSchedule = planFeesForm.value.managerSchedule
                      }
                    }
                  }
                  getManagerValue(true)
                }
              }
            })
        )
        //Professional Service
        schedulePromise.push(
          $axios
            .get(
              `/api/v1/tal/proposal/${props.planId}/professionalservice?planType=${planType.value}&seinpno=${props.SEINPNO}&activeOnly=true`
            )
            .then((success) => {
              if (success.data.d !== null) {
                providerScheduleList.value = success.data.d.length > 0 ? success.data.d : []
  
                if (providerScheduleList.value.length > 0) {
                  if (props.proposalPlan.ProviderSchedule !== 0) {
                    planFeesForm.value.providerSchedule = providerScheduleList.value.find((obj) => {
                      return obj.FeeScheduleID === props.proposalPlan.ProviderSchedule
                    })
                    oldPlanFeesForm.value.providerSchedule = planFeesForm.value.providerSchedule
                  } else {
                    var defaultProfessionalFees = providerScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                    if (defaultProfessionalFees.length > 0) {
                      planFeesForm.value.providerSchedule = defaultProfessionalFees[0]
                      oldPlanFeesForm.value.providerSchedule = planFeesForm.value.providerSchedule
                    }
                  }
                }
              }
            })
        )
        await Promise.allSettled(schedulePromise)
      }
      function loadTrustee() {
        var custodianOnly = assignedCustodianOnly.value === 'true' ? true : false
        if (!subCustodian.value) {
          if (props.proposalPlan.SUB === '' && subCustodiansList.value.length > 0 && trusteeCustodian.value === 'AdvisorTrust') {
            subCustodian.value = subCustodiansList.value[0]
          } else {
            subCustodian.value = props.proposalPlan.SUB !== '' ? props.proposalPlan.SUB : ''
          }
        }
        $axios
          .get(
            `/api/v1/tal/proposal/plan/${props.planId}/assignedtrusteeschedule/Custodian?trusteeCustodian=${trusteeCustodian.value}&subCustodian=${subCustodian.value}&planType=${planType.value}&assignedCustodian=${custodianOnly}&seinpno=${props.SEINPNO}&espType=${props.proposalPlan.ESPType}`
          )
          .then((success) => {
            if (success.data.d !== null) {
              trusteeScheduleList.value = success.data.d.length > 0 ? success.data.d : []
              if (trusteeScheduleList.value.length > 0) {
                if (props.proposalPlan.TrusteeSchedule !== 0) {
                  var trusteeFeeObject = trusteeScheduleList.value.find((obj) => {
                    return obj.FeeScheduleID === props.proposalPlan.TrusteeSchedule
                  })
                  if (!trusteeFeeObject) {
                    var defaultTrusteeFees1 = trusteeScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                    if (defaultTrusteeFees1.length > 0) {
                      planFeesForm.value.trusteeSchedule = defaultTrusteeFees1[0]
                    } else {
                      planFeesForm.value.trusteeSchedule = ''
                      if (props.proposalPlan.TrusteeSchedule > 0) successTrustee.value = true
                    }
                  } else planFeesForm.value.trusteeSchedule = trusteeFeeObject
  
                  oldPlanFeesForm.value.trusteeSchedule = planFeesForm.value.trusteeSchedule
                } else {
                  var defaultTrusteeFees = trusteeScheduleList.value.filter((a) => a.DefaultFeeSchedule === true)
                  if (defaultTrusteeFees.length > 0) {
                    planFeesForm.value.trusteeSchedule = defaultTrusteeFees[0]
                    oldPlanFeesForm.value.trusteeSchedule = planFeesForm.value.trusteeSchedule
                  }
                }
              } else {
                planFeesForm.value.trusteeSchedule = ''
                planFeesForm.value.trusteeFee = 0
                if (loadTypeValue.value === 'load') oldPlanFeesForm.value.trusteeFee = 0
              }
            }
            getAdminFiduciaryFee()
            successTrustee.value = true
          })
      }
      function assignPlanFees(val) {
        var planFeesObject = []
        var planObject = []
        if (showProfessionalService.value === 'true') {
          planObject.push({
            name: 'Professional Services',
            cost1: providerDollar.value,
            cost2: providerPercent.value
          })
        }
        if (showInvestmentManager.value === false) {
          planObject.push({
            name: $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
              ? mmlInvestmentName.value
              : 'Investment Manager',
            cost1: managerDollar.value,
            cost2: managerPercent.value
          })
        }
        if (!showFinancialAdvisor.value) {
          if (
            $authz.allowedByProgram(
              $authz.programPermissionSet.PCS_Aspire_Product__c,
              $authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            planObject.push({
              name: mmlAdvisorName.value,
              cost1: advisorDollar.value,
              cost2: advisorPercent.value
            })
          } else {
            planObject.push({
              name: enterpriseName.value === 'Park Avenue Securities' ? 'Soliciting Advisor' : 'Financial Advisor',
              cost1: advisorDollar.value,
              cost2: advisorPercent.value
            })
          }
        }
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          ) &&
          $store.state.user.selectedProgram.programName !== $authz.managedPlan.PA
        ) {
          planObject.push({
            name: mmlPlatformName.value,
            cost1: mmlPlatformDollar.value,
            cost2: mmlPlatformPercent.value
          })
        }
        if (!showAdministration.value) {
          planObject.push({
            name: 'Administration',
            cost1: tpaAdminDollar.value,
            cost2: tpaAdminPercent.value
          })
        }
        if (!showRecordkeeping.value) {
          planObject.push({
            name: 'Recordkeeping',
            cost1: tparkDollar.value,
            cost2: tparkPercent.value
          })
        }
        if (!showTrusteeCustodian.value) {
          planObject.push({
            name: 'Trustee / Custodian',
            cost1: trusteeDollar.value,
            cost2: trusteePercent.value
          })
        }
        if (!showAvgInvestmentExpense.value) {
          planObject.push({
            name: 'Average Investment Expense',
            cost1: expenseDollar.value,
            cost2: expensePercent.value
          })
        }
        if (!showMutualFundOffset.value) {
          planObject.push({
            name: 'Mutual Fund Offset',
            cost1: offsetDollar.value,
            cost2: planFeesForm.value.offsetPercent
          })
        }
        planObject.push({
          name: 'Estimated Cost',
          cost1: estimatedDollar.value,
          cost2: estimatedPercent.value
        })
        planFeesObject.push(planObject)
        if (val === 'save') {
          planFeesObject.push({ name: 'save' })
          loadTypeValue.value = 'load'
          emit('proposalPlanFees', planFeesObject, val)
        } else if (
          planFeesForm.value.managerFee === 0 &&
          planFeesForm.value.managerSchedule === 0 &&
          planFeesForm.value.advisorFee === 0 &&
          planFeesForm.value.advisorSchedule === 0 &&
          planFeesForm.value.trusteeSchedule === 0 &&
          planFeesForm.value.trusteeFee === 0 &&
          planFeesForm.value.providerFee === 0 &&
          planFeesForm.value.providerSchedule === 0 &&
          planFeesForm.value.tpaAdminFee === 0 &&
          planFeesForm.value.tpaAdminSchedule === 0 &&
          planFeesForm.value.tparkSchedule === 0 &&
          planFeesForm.value.tparkFee === 0
        ) {
          planFeesObject.push({ name: 'load' })
          loadTypeValue.value = 'load'
          emit('proposalPlanFees', planFeesObject, val)
        } else {
          if (
            successTrustee.value === true &&
            successRecordkeeping.value === true &&
            successAdministration.value === true &&
            successAdvisory.value === true &&
            successTPAFee.value === true &&
            successOffsetOverride.value === true &&
            successOffset.value === true &&
            successExpense.value === true &&
            successEstimated.value === true &&
            successManagerFee.value === true &&
            succeessAdvisorFee.value === true &&
            successTparkFee.value === true &&
            succeessTrusteeFee.value === true
          ) {
            planFeesObject.push({ name: 'edit' })
            loadTypeValue.value = 'load'
            emit('proposalPlanFees', planFeesObject, val)
          }
        }
      }
      const formatPrice = (value, decimals) => {
        if (value === undefined) {
          return 'N/A' // or some default formatting
        }
        // Your logic to format the price
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals
        }).format(value)
      }
      function validatePlanFees() {
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          if ($store.state.user.selectedProgram.programName === $authz.managedPlan.PA) {
            if (Number(planFeesForm.value.advisorFee) > 0) {
              if (
                Number(planFeesForm.value.advisorFee) < minAdvisoryFee.value ||
                Number(planFeesForm.value.advisorFee) > maxAdvisoryFee.value
              ) {
                //planFeesForm.value.advisorFee = 0
  
                $toast.error('Fee must be between ' + minAdvisoryFee.value + ' bps and ' + maxAdvisoryFee.value + ' bps', '')
                return false
              }
            }
          }
          if ($store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
            if (Number(planFeesForm.value.advisorFee) > 0) {
              if (Number(planFeesForm.value.advisorFee) > maxAdvisoryFee.value) {
                //planFeesForm.value.advisorFee = 0
  
                $toast.error('Fee must be ' + maxAdvisoryFee.value + ' bps or less ', '')
                return false
              }
            }
          }
        }
        if (
          !$authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          if (!showInvestmentManager.value) {
            if (planFeesForm.value.AllowInvestmentManager) {
              if (planFeesForm.value.managerEntryFeeType) {
                if (!planFeesForm.value.managerName) {
                  investmentManagerError.value = true
                  investmentManagerErrorMsg.value = 'Name is required'
                  return false
                }
              } else {
                investmentManagerScheduleError.value = true
                investmentManagerScheduleErrorMsg.value = 'Fee Schedule is required'
                return false
              }
            }
          }
        }
        if (!showFinancialAdvisor.value) {
          if (planFeesForm.value.AllowFinancialAdvisor) {
            if (planFeesForm.value.advisorEntryFeeType) {
              if (!planFeesForm.value.advisorName) {
                advisoryError.value = true
                advisoryErrorMsg.value = 'Name is required'
                return false
              }
            } else {
              advisoryScheduleError.value = true
              advisoryScheduleErrorMsg.value = 'Fee Schedule is required'
              return false
            }
          }
        }
      }
      function abondondPlanFees() {
        Object.assign(planFeesForm.value, oldPlanFeesForm.value)
        managerDollar.value = oldManagerDollar.value
        managerPercent.value = oldManagerPercent.value
        advisorPercent.value = oldAdvisorPercent.value
        advisorDollar.value = oldAdvisorDollar.value
        tpaAdminDollar.value = oldTPAAdminDollar.value
        tpaAdminPercent.value = oldTPAAdminPercent.value
        investmentManagerError.value = false
        investmentManagerErrorMsg.value = ''
        investmentManagerScheduleError.value = false
        investmentManagerScheduleErrorMsg.value = ''
        advisoryError.value = false
        advisoryErrorMsg.value = ''
        advisoryScheduleError.value = false
        advisoryScheduleErrorMsg.value = ''
        if (planFeesForm.value.managerFeeType === 'manual') investmentManagerFeeMsg.value = ''
        if (planFeesForm.value.advisorFeeType === 'manual') financialAdvisorFeeMsg.value = ''
        if (serviceType.value === 1) administrationFeesMsg.value = ''
        getAdminValue(true, 'abondon')
        getManagerValue(true)
        getAdvisorValue(true)
      }
      function getCustodians() {
        $axios.get(`/api/v1/tal/advisor/custodians`).then((success) => {
          custodiansList.value = success.data.d === null ? [] : success.data.d
          if (props.proposalPlan.TPA === '' && custodiansList.value.length > 0) {
            trusteeCustodian.value = custodiansList.value[0]
          } else {
            trusteeCustodian.value = props.proposalPlan.TPA
          }
        })
      }
      function getSubCustodians() {
        $axios.get(`/api/v1/tal/advisor/subcustodians`).then((success) => {
          subCustodiansList.value = success.data.d === null ? [] : success.data.d
        })
      }
      function feeAdjustmentMethod() {
        if (feesAdjusted.value) {
          var feeAdjustedMsg = ''
          feeAdjustedMsg += professionalFeeMsg.value ? professionalFeeMsg.value + '<br/>' : ''
          feeAdjustedMsg += investmentManagerFeeMsg.value ? investmentManagerFeeMsg.value + '<br/>' : ''
          feeAdjustedMsg += financialAdvisorFeeMsg.value ? financialAdvisorFeeMsg.value + '<br/>' : ''
          feeAdjustedMsg += custodianFeesMsg.value ? custodianFeesMsg.value + '<br/>' : ''
          feeAdjustedMsg += administrationFeesMsg.value ? administrationFeesMsg.value + '<br/>' : ''
          feeAdjustedMsg += recordkeepingFeeMsg.value ? recordkeepingFeeMsg.value : ''
          feesAdjustedMessage.value = feeAdjustedMsg
          if (feesAdjustedMessage.value) {
            $toast?.destroy()
            $toast.info(feesAdjustedMessage.value, '')
          }
          feesAdjusted.value = false
        }
      }
      function checkinvestmentManagerValue() {
        if (
          !$authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          if (!showInvestmentManager.value) {
            if (planFeesForm.value.AllowInvestmentManager) {
              if (planFeesForm.value.managerEntryFeeType) {
                investmentManagerScheduleError.value = false
                investmentManagerScheduleErrorMsg.value = ''
                if (!planFeesForm.value.managerName) {
                  investmentManagerError.value = true
                  investmentManagerErrorMsg.value = 'Name is required'
                  return
                } else {
                  investmentManagerError.value = false
                  investmentManagerErrorMsg.value = ''
                }
              } else {
                investmentManagerScheduleError.value = true
                investmentManagerScheduleErrorMsg.value = 'Fee Schedule is required'
                investmentManagerError.value = false
                investmentManagerErrorMsg.value = ''
              }
            } else {
              investmentManagerScheduleError.value = false
              investmentManagerScheduleErrorMsg.value = ''
              investmentManagerError.value = false
              investmentManagerErrorMsg.value = ''
            }
          } else {
            investmentManagerScheduleError.value = false
            investmentManagerScheduleErrorMsg.value = ''
            investmentManagerError.value = false
            investmentManagerErrorMsg.value = ''
          }
        } else {
          investmentManagerScheduleError.value = false
          investmentManagerScheduleErrorMsg.value = ''
          investmentManagerError.value = false
          investmentManagerErrorMsg.value = ''
        }
      }
      function checkAdvisorValue() {
        if (!showFinancialAdvisor.value) {
          if (planFeesForm.value.AllowFinancialAdvisor) {
            if (planFeesForm.value.advisorEntryFeeType) {
              if (!planFeesForm.value.advisorName) {
                advisoryScheduleError.value = false
                advisoryScheduleErrorMsg.value = ''
                advisoryError.value = true
                advisoryErrorMsg.value = 'Name is required'
                return
              } else {
                advisoryError.value = false
                advisoryErrorMsg.value = ''
                advisoryScheduleError.value = false
                advisoryScheduleErrorMsg.value = ''
              }
            } else {
              advisoryScheduleError.value = true
              advisoryScheduleErrorMsg.value = 'Fee Schedule is required'
              advisoryError.value = false
              advisoryErrorMsg.value = ''
            }
          } else {
            advisoryScheduleError.value = false
            advisoryScheduleErrorMsg.value = ''
            advisoryError.value = false
            advisoryErrorMsg.value = ''
          }
        } else {
          advisoryScheduleError.value = false
          advisoryScheduleErrorMsg.value = ''
          advisoryError.value = false
          advisoryErrorMsg.value = ''
        }
      }
      const saveFeeOptions = async () => {
        await $axios.put(
          `/api/v1/tal/proposal/savefeeoptions?proposalId=${props.planId}&allowInvestmentManager=${planFeesForm.value.AllowInvestmentManager}&allowFinancialAdvisor=${planFeesForm.value.AllowFinancialAdvisor}`,
          null
        )
      }
      function checkInvestmentManager(val) {
        if (!val) {
          manageFeeValue.value = planFeesForm.value.managerFee
          manageFeeTypeValue.value = planFeesForm.value.managerFeeType
          manageScheduleValue.value = planFeesForm.value.managerSchedule
          managerName.value = planFeesForm.value.managerName
          managerEntryFeeType.value = planFeesForm.value.managerEntryFeeType
          managerDollarValue.value = managerDollar.value
          managerPercentValue.value = managerPercent.value
          planFeesForm.value.managerName = ''
          planFeesForm.value.managerFeeType = ''
          planFeesForm.value.managerFee = 0
          planFeesForm.value.managerSchedule = ''
          planFeesForm.value.managerEntryFeeType = ''
          showManagerFeeText.value = true
          disableManagerFeeType.value = true
          disableManagerFee.value = true
          disableManagerDollar.value = true
          disableManagerPercent.value = true
          investmentManagerError.value = false
          investmentManagerErrorMsg.value = ''
          investmentManagerScheduleError.value = false
          investmentManagerScheduleErrorMsg.value = ''
        } else {
          planFeesForm.value.managerName = managerName.value ? managerName.value : oldPlanFeesForm.value.managerName
          planFeesForm.value.managerFeeType = manageFeeTypeValue.value
            ? manageFeeTypeValue.value
            : oldPlanFeesForm.value.managerFeeType
          planFeesForm.value.managerFee = manageFeeValue.value ? manageFeeValue.value : oldPlanFeesForm.value.managerFee
          planFeesForm.value.managerSchedule = manageScheduleValue.value
            ? manageScheduleValue.value
            : oldPlanFeesForm.value.managerSchedule
          planFeesForm.value.managerEntryFeeType = managerEntryFeeType.value
            ? managerEntryFeeType.value
            : oldPlanFeesForm.value.managerEntryFeeType
          managerDollar.value = managerDollarValue.value ? managerDollarValue.value : 0
          managerPercent.value = managerPercentValue.value ? managerPercentValue.value : 0
          if (planFeesForm.value.managerFeeType === 'manual') {
            planFeesForm.value.managerSchedule = managerScheduleList.value.find((obj) => {
              return obj.FeeScheduleID === 0
            })
            disableManagerFeeType.value = false
          }
          enableSelectedFeeType(planFeesForm.value.managerEntryFeeType, 'Investment')
        }
      }
      function checkFinancialAdvisor(val) {
        if (!val) {
          advisorName.value = planFeesForm.value.advisorName
          advisorFeeTypeValue.value = planFeesForm.value.advisorFeeType
          advisorFeeValue.value = planFeesForm.value.advisorFee
          advisorScheduleValue.value = planFeesForm.value.advisorSchedule
          advisorEntryFeeValue.value = planFeesForm.value.advisorEntryFeeType
          advisorDollarValue.value = advisorDollar.value
          advisorPercentValue.value = advisorPercent.value
          planFeesForm.value.advisorName = ''
          planFeesForm.value.advisorFeeType = ''
          planFeesForm.value.advisorFee = 0
          planFeesForm.value.advisorSchedule = ''
          planFeesForm.value.advisorEntryFeeType = ''
          showAdvisorFeeText.value = true
          disableAdvisorFeeType.value = true
          disableAdvisorFee.value = true
          disableAdvisorDollar.value = true
          disableAdvisorPercent.value = true
          advisoryError.value = false
          advisoryErrorMsg.value = ''
          advisoryScheduleError.value = false
          advisoryScheduleErrorMsg.value = ''
        } else {
          planFeesForm.value.advisorName = advisorName.value ? advisorName.value : oldPlanFeesForm.value.advisorName
          planFeesForm.value.advisorFeeType = advisorFeeTypeValue.value
            ? advisorFeeTypeValue.value
            : oldPlanFeesForm.value.advisorFeeType
          planFeesForm.value.advisorFee = advisorFeeValue.value ? advisorFeeValue.value : oldPlanFeesForm.value.advisorFee
          planFeesForm.value.advisorSchedule = advisorScheduleValue.value
            ? advisorScheduleValue.value
            : oldPlanFeesForm.value.advisorSchedule
          planFeesForm.value.advisorEntryFeeType = advisorEntryFeeValue.value
            ? advisorEntryFeeValue.value
            : oldPlanFeesForm.value.advisorEntryFeeType
          advisorDollar.value = advisorDollarValue.value ? advisorDollarValue.value : 0
          advisorPercent.value = advisorPercentValue.value ? advisorPercentValue.value : 0
          if (planFeesForm.value.advisorFeeType === 'manual') {
            planFeesForm.value.advisorSchedule = advisorScheduleList.value.find((obj) => {
              return obj.FeeScheduleID === 0
            })
            disableAdvisorFeeType.value = false
          }
          enableSelectedFeeType(planFeesForm.value.advisorEntryFeeType, 'Advisor')
        }
      }
      const showAdvisorEditIcon = computed(() => {
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          return true
        } else return true
      })
      const showWaiveFee = computed(() => {
        var impersonatedBy = $store.state.user.impersonatedBy
        if (impersonatedBy && impersonatedBy.selectedProgram) {
          if (impersonatedBy.selectedProgram.roles && impersonatedBy.selectedProgram.roles.length > 0) {
            return impersonatedBy.selectedProgram.roles.some(
              (r) => r.roleName === $authz.roles.SiteAdmin || r.roleName === $authz.roles.InternalAdmin
            )
          } else return false
        } else return false
      })
      watch(
        () => planFeesForm.value.providerSchedule,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            getProviderFee()
          }
        }
      )
      watch(
        () => planFeesForm.value.providerFee,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            showEstimatedFees()
          }
        }
      )
      watch(
        () => planFeesForm.value.providerFeeType,
        () => {
          getProviderFee()
        }
      )
      watch(
        () => planFeesForm.value.managerSchedule,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            getManagerFee()
          }
        }
      )
      watch(
        () => planFeesForm.value.managerFee,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            showEstimatedFees()
          }
        }
      )
      watch(
        () => planFeesForm.value.managerFeeType,
        () => {
          getManagerFee()
        }
      )
      watch(
        () => planFeesForm.value.advisorSchedule,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            getAdvisorFee()
          }
        }
      )
      watch(
        () => planFeesForm.value.advisorFee,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            showEstimatedFees()
          }
        }
      )
      watch(
        () => planFeesForm.value.advisorFeeType,
        () => {
          getAdvisorFee()
        }
      )
      watch(
        () => planFeesForm.value.trusteeSchedule,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            if (planFeesForm.value.trusteeSchedule) {
              planFeesForm.value.trusteeFeeType = 4
              if ($store.state.user.selectedProgram.programName === $authz.program.PCS) {
                planFeesForm.value.trusteeName = trusteeCustodian.value
              }
            } else {
              planFeesForm.value.trusteeFeeType = ''
              planFeesForm.value.trusteeName = ''
            }
            getTrusteeFee()
          }
        }
      )
      watch(
        () => planFeesForm.value.exchangeTradedFunds,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            if (planFeesForm.value.trusteeSchedule) {
              planFeesForm.value.trusteeFeeType = 4
            } else {
              planFeesForm.value.trusteeFeeType = ''
            }
            getTrusteeFee()
          }
        }
      )
      watch(
        () => planFeesForm.value.tpaAdminSchedule,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            getTPAFee()
          }
        }
      )
      watch(
        () => planFeesForm.value.tpaAdminFee,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            showEstimatedFees()
          }
        }
      )
      watch(
        () => planFeesForm.value.tparkSchedule,
        (oldvalue, newvalue) => {
          if (oldvalue !== newvalue) {
            if (planFeesForm.value.tparkSchedule) {
              planFeesForm.value.tparkFeeType = 4
              if ($store.state.user.selectedProgram.programName === $authz.program.PCS) {
                planFeesForm.value.tparkName = 'PCS Retirement'
              }
            } else {
              planFeesForm.value.tparkFeeType = ''
              planFeesForm.value.tparkName = ''
            }
            getDynamicFees()
          }
        }
      )
      watch(
        () => planFeesForm.value.brinker,
        (val) => {
          props.checkStandardPcs(val)
        },
        { immediate: true, deep: true }
      )
      watch(
        () => props.proposalPlan,
        (newvalue, oldvalue) => {
          if (newvalue !== oldvalue) {
            getTPADiscount()
            getPlanOptions(true)
          }
        }
      )
      watch(
        () => $route,
        () => {
          if ($route.query.planId) {
            loadTypeValue.value = ''
          }
        }
      )
      onBeforeUnmount(() => {
        eventBus.off('feeAdjustmentDone')
        eventBus.off('brinkerManagerValue')
        eventBus.off('proposalPermission')
      })
      onMounted(() => {
        eventBus.on('feeAdjustmentDone', () => {
          feeAdjustmentMethod()
        })
        eventBus.on('brinkerManagerValue', (data) => {
          brinkerManager.value = data
        })
        eventBus.on('proposalPermission', (proposalPermission) => {
          showPlanFees(proposalPermission)
        })
        getCustodians()
        getSubCustodians()
        oldPlanFeesForm.value = Object.assign({}, planFeesForm.value)
      })
      return {
        display,
        theme,
        $authz,
        $store,
        showProfessionalService,
        planFeesForm,
        providerScheduleList,
        entryTypeList,
        disableProviderFeeType,
        disableProviderFee,
        showProviderFeeText,
        providerDollar,
        disableProviderDollar,
        providerPercent,
        disableProviderPercent,
        showInvestmentManager,
        investmentManagerScheduleError,
        managerScheduleList,
        investmentManagerScheduleErrorMsg,
        investmentManagerError,
        investmentManagerErrorMsg,
        showManagerFeeText,
        managerDollar,
        managerPercent,
        showFinancialAdvisor,
        showAdvisorEditIcon,
        advisorScheduleList,
        advisoryScheduleError,
        advisoryScheduleErrorMsg,
        advisoryError,
        advisoryErrorMsg,
        mmlEntryTypeList,
        showAdvisorFeeText,
        advisorDollar,
        disableAdvisorDollar,
        advisorPercent,
        disableAdvisorPercent,
        mmlScheduleList,
        mmlPlatformDollar,
        mmlPlatformPercent,
        showAdministration,
        tpaAdminScheduleList,
        disableTPAEntryFeeType,
        showTPAFeeText,
        disableTpaFee,
        tpaAdminDollar,
        disableTpaDollar,
        tpaAdminPercent,
        disableTpaPercent,
        showRecordkeeping,
        tparkScheduleList,
        offsetError,
        offsetErrorMsg,
        tparkDollar,
        tparkPercent,
        showTrusteeCustodian,
        trusteeScheduleList,
        trusteeDollar,
        trusteePercent,
        showAvgInvestmentExpense,
        expenseDollar,
        showMutualFundOffset,
        formatPrice,
        expensePercent,
        offsetDollar,
        estimatedDollar,
        estimatedPercent,
        isEmployee,
        showWaiveFee,
        advisorFee,
        serviceType,
        tpaAdminFeeType,
        showConversionFeePaidBy,
        showDocumentFeePaidBy,
        showIncludeAncillaryFeeSchedule,
        showIncludeModelSummaryPages,
        brinkerManager,
        hideExchangeTradedFunds,
        enterpriseName,
        mmlAdvisorName,
        validatePlanFees,
        abondondPlanFees,
        savePlanFees,
        enableSelectedFeeType,
        checkInvestmentManager,
        checkinvestmentManagerValue,
        updateOldplanFeesForm,
        getManagerValue,
        updateManagerBasis,
        checkFinancialAdvisor,
        checkAdvisorValue,
        getAdvisorValue,
        bpsRange,
        getTPAFee,
        getAdminValue
      }
    }
  }
  </script>
  <style scoped>
  .expandable {
    background-color: #fafafa !important;
  }
  .theme--light.v-sheet {
    background-color: rgb(var(--v-theme-surface));
    border-color: rgb(var(--v-theme-surface));
  }
  .disableClass {
    color: #999999 !important;
  }
  </style>
  