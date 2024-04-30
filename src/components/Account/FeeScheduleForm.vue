<template>
  <v-col id="feeContainerSection" class="pa-0">
    <v-col v-if="fromPage !== 'serviceProvider'" cols="12" xs="12" class="pt-3 pb-3 pa-0">
      <h1 v-if="id === 0" class="font-weight-medium">New Fee Schedules</h1>
      <h1 v-if="id > 0 && scheduleType" class="font-weight-medium">
        {{ feeScheduleName + ' - ' + scheduleType }}
      </h1>
      <h1 v-if="id > 0 && !scheduleType" class="font-weight-medium">
        {{ feeScheduleName }}
      </h1>
      <Loader v-model="loading" :loading="loading" />
    </v-col>
    <v-form ref="form" v-model="valid">
      <v-col cols="12" xs="12" class="pa-0">
        <v-radio-group v-model="businessType" inline class="mt-0 pt-0">
          <v-radio color="accent" label="Employer-Sponsored Plans" value="employerSponsored" />
          <v-radio color="accent" disabled label="Individual Account(Coming Soon)" value="individualAccount" />
        </v-radio-group>
      </v-col>
      <v-col cols="12" xs="12" class="pb-3 pa-0">
        <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Fee Schedule Type</h2>
      </v-col>
      <v-col cols="12" xs="12" class="pb-2 pa-0">
        <v-row>
          <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
            <v-col v-if="!readOnly" class="pa-0">
              <v-select
                v-model="scheduleType"
                variant="outlined"
                :items="scheduleTypeList"
                item-title="text"
                class="pt-0 mt-0"
                label="Schedule Type"
                autocomplete="autofill-off"
                :hide-details="!scheduleTypeError"
                density="compact"
                :menu-props="{
                  zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                }"
                :disabled="isActiveFees"
                clearable
                :error-messages="scheduleTypeErrorMsg"
                :error="scheduleTypeError"
                @update:model-value="assignDefaultAsset()"
              />
            </v-col>
            <v-col v-else class="pa-0">
              <v-text-field
                v-model="scheduleType"
                variant="outlined"
                class="pt-0 mt-0"
                label="Schedule Type"
                autocomplete="autofill-off"
                hide-details
                density="compact"
                :disabled="readOnly"
              />
            </v-col>
          </v-col>
          <v-col cols="12" xl="5" lg="5" md="6" xs="12" class="align-self flex_none pa-0">
            <v-checkbox
              v-model="isDefault"
              :disabled="readOnly"
              :readonly="markDefaultReadOnly"
              hide-details
              :ripple="false"
              label="Mark as Default"
              class="mt-0"
              color="accent"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-divider class="my-3 divider" />
      <v-col cols="12" xs="12" class="pb-3 pa-0">
        <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Fee Details</h2>
      </v-col>
      <v-col id="feeContainer" class="pa-0">
        <v-row>
          <v-col cols="12" xs="12" class="pa-0">
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                <v-text-field
                  v-model="feeScheduleName"
                  variant="outlined"
                  density="compact"
                  :class="display.xs.value ? 'pt-0 mt-0' : 'pt-0'"
                  label="Fee Schedule Name *"
                  counter="100"
                  maxlength="100"
                  :error-messages="scheduleNameErrorMsg"
                  :error="scheduleNameError"
                  autocomplete="autofill-off"
                  :disabled="readOnly"
                  @blur="checkFeeScheduleName()"
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                <v-select
                  v-model="isActive"
                  variant="outlined"
                  density="compact"
                  :items="items"
                  item-title="text"
                  label="Status"
                  :class="display.xs.value ? '' : 'pt-0'"
                  autocomplete="autofill-off"
                  :menu-props="{
                    zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                  }"
                  :disabled="readOnly"
                  @update:model-value="checkFeeStatus()"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" class="pa-0">
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                <v-text-field
                  v-model="minimumFees"
                  v-input-mask="{
                    alias: 'currency',
                    rightAlign: false,
                    autoUnmask: true,
                    allowMinus: false,
                    digitsOptional: true,
                    placeholder: '0'
                  }"
                  variant="outlined"
                  density="compact"
                  label="Minimum Fee"
                  prefix="$"
                  maxlength="13"
                  hint="This fee schedule will have a minimum fee of"
                  persistent-hint
                  autocomplete="autofill-off"
                  :disabled="readOnly || showMinMaxFee"
                  :error-messages="minimumFeeErrorMsg"
                  :error="minimumFeeError"
                  @focus="$event.target.select()"
                />
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                <v-text-field
                  v-model="maximumFees"
                  v-input-mask="{
                    alias: 'currency',
                    rightAlign: false,
                    autoUnmask: true,
                    allowMinus: false,
                    digitsOptional: true,
                    placeholder: '0'
                  }"
                  variant="outlined"
                  density="compact"
                  label="Maximum Fee *"
                  prefix="$"
                  maxlength="13"
                  hint="This fee schedule will have a maximum fee of"
                  persistent-hint
                  autocomplete="autofill-off"
                  :error-messages="maximumFeesErrorMsg"
                  :error="maximumFeesError"
                  :disabled="readOnly || showMinMaxFee"
                  @focus="$event.target.select()"
                  @blur="validateFees()"
                />
              </v-col>
              <v-col v-if="scheduleType === 'Custodian'" cols="12" xs="12" class="pt-2 pb-2 pa-0">
                <v-row>
                  <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                    <v-select
                      v-model="custodian"
                      variant="outlined"
                      :items="custodianList"
                      class="pt-0 mt-0"
                      label="Trustee / Custodian *"
                      autocomplete="autofill-off"
                      density="compact"
                      :menu-props="{
                        zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                      }"
                      :disabled="readOnly"
                      append-icon="icon-chevron-down"
                      :error-messages="custodianErrorMsg"
                      :error="custodianError"
                      @update:model-value="checkTrustee()"
                    />
                  </v-col>
                  <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                    <v-select
                      v-model="subCustodian"
                      variant="outlined"
                      density="compact"
                      :items="subCustodianList"
                      class="pt-0 mt-0"
                      label="Sub-Custodian"
                      autocomplete="autofill-off"
                      :menu-props="{
                        zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                      }"
                      :disabled="readOnly"
                      append-icon="icon-chevron-down"
                      :error-messages="subCustodianErrorMsg"
                      :error="subCustodianError"
                      @update:model-value="checkSubCustodian()"
                    />
                  </v-col>
                  <v-col cols="12" xs="12" class="pb-3 pt-3 pa-0">
                    <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Select ETF Schedule or Create New</h2>
                  </v-col>
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-row>
                      <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" :class="display.xs.value ? '' : 'pr-3'" class="pa-0">
                        <v-select
                          v-model="etfSchedule"
                          variant="outlined"
                          density="compact"
                          :items="etfScheduleList"
                          class="pt-0 mt-0"
                          label="ETF Schedule"
                          autocomplete="autofill-off"
                          hide-details
                          item-title="Name"
                          item-value="FeeScheduleID"
                          :menu-props="{
                            zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                          }"
                          :disabled="readOnly"
                          append-icon="icon-chevron-down"
                        />
                      </v-col>
                      <v-col
                        v-if="
                          fromPage !== 'serviceProvider' &&
                          $authz.hasPermission($authz.permissionSet.Fee_Engine_ETF__c, $authz.permission.Full)
                        "
                        class="pa-0"
                        :class="!display.xs.value ? '' : 'text-right mt-1'"
                      >
                        <v-btn v-if="!readOnly" :color="theme.dark ? '' : 'accent'" class="mt-0" @click="openETFSchedule()">
                          Add New ETF Fee Schedule
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="scheduleType === 'Recordkeeping'" cols="12" xs="12" class="pt-2 pa-0">
                <v-row>
                  <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0">
                    <v-col :class="display.xs.value ? '' : 'pr-3'" class="pa-0">
                      <v-text-field
                        v-model="conversion"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: '0'
                        }"
                        variant="outlined"
                        density="compact"
                        label="Conversion"
                        prefix="$"
                        maxlength="13"
                        autocomplete="autofill-off"
                        :disabled="readOnly"
                        @focus="$event.target.select()"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0">
                    <v-col :class="display.xs.value ? '' : 'pr-3'" class="pa-0">
                      <v-text-field
                        v-model="document"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: '0'
                        }"
                        variant="outlined"
                        density="compact"
                        label="Document"
                        prefix="$"
                        maxlength="13"
                        autocomplete="autofill-off"
                        :disabled="readOnly"
                        @focus="$event.target.select()"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0">
                    <v-col :class="display.xs.value ? '' : 'pr-3'" class="pa-0">
                      <v-text-field
                        v-model="installation"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: '0'
                        }"
                        variant="outlined"
                        density="compact"
                        label="Installation"
                        prefix="$"
                        maxlength="13"
                        autocomplete="autofill-off"
                        :disabled="readOnly"
                        @focus="$event.target.select()"
                      />
                    </v-col>
                  </v-col>
                  <v-col cols="12" sm="8" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                    <v-text-field
                      v-model="baseHeader"
                      variant="outlined"
                      density="compact"
                      label="Base Header"
                      autocomplete="autofill-off"
                      :disabled="readOnly"
                      @focus="$event.target.select()"
                    />
                  </v-col>
                  <v-col cols="12" sm="8" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                    <v-text-field
                      v-model="participantHeader"
                      variant="outlined"
                      density="compact"
                      label="Participant Header"
                      autocomplete="autofill-off"
                      :disabled="readOnly"
                      @focus="$event.target.select()"
                    />
                  </v-col>
                  <v-col cols="12" sm="8" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                    <v-text-field
                      v-model="assetHeader"
                      variant="outlined"
                      density="compact"
                      label="Asset Header"
                      autocomplete="autofill-off"
                      :disabled="readOnly"
                      @focus="$event.target.select()"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12" class="pt-2 pa-0">
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                <v-text-field
                  v-model="part1Base"
                  v-input-mask="{
                    alias: 'currency',
                    rightAlign: false,
                    autoUnmask: true,
                    placeholder: '0',
                    allowMinus: false,
                    digitsOptional: true
                  }"
                  variant="outlined"
                  prefix="$"
                  density="compact"
                  label="Base Fee"
                  maxlength="13"
                  autocomplete="autofill-off"
                  :disabled="readOnly || showMinMaxFee"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-divider v-if="scheduleType" class="my-3 divider" />
      <v-col v-if="scheduleType" cols="12" xs="12" class="pa-0">
        <v-col
          v-if="
            $authz.hasRole($authz.roles.Advisor) ||
            $authz.hasRole($authz.roles.Strategist) ||
            $authz.hasRole($authz.roles.Fiduciary338)
          "
          id="addPlanTypeSection"
          cols="12"
          xs="12"
          class="pb-3 pa-0"
        >
          <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Assign Plan Type</h2>
        </v-col>
        <v-col v-else id="addPlanTypeSection" cols="12" xs="12" class="pb-3 pa-0">
          <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Assign Plan Type, Users and Plans</h2>
        </v-col>
        <v-col cols="12" xs="12" class="pa-0">
          <v-col cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
            <v-select
              v-model="planType"
              variant="outlined"
              :items="planTypeList"
              item-title="text"
              class="pt-0 mt-0"
              label="Plan Type"
              autocomplete="autofill-off"
              hide-details
              :multiple="id === 0"
              density="compact"
              :menu-props="{
                zIndex: fromPage !== 'serviceProvider' ? '2' : ''
              }"
              :disabled="readOnly || isActiveFees"
            />
          </v-col>
        </v-col>
        <v-col ref="addUserSection" cols="12" xs="12" class="pt-3 pa-0">
          <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'"></h2>
        </v-col>
        <v-col
          v-if="
            $authz.hasRole($authz.roles.SiteAdmin) ||
            $authz.hasRole($authz.roles.ProgramAdmin) ||
            $authz.hasRole($authz.roles.FirmAdmin) ||
            $authz.hasRole($authz.roles.InternalAdmin)
          "
          cols="12"
          xs="12"
          class="pb-2 pa-0"
        >
          <h4>Add Users who can use this fee schedule</h4>
          <v-col cols="12" xs="12" class="pt-3 pa-0">
            <v-row>
              <v-col cols="12" xl="6" lg="8" md="8" sm="8" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
                <v-autocomplete
                  v-model="user"
                  :items="userList"
                  label="Search Users *"
                  clearable
                  auto-select-first
                  append-icon
                  autocomplete="autofill-off"
                  :item-title="getUserDisplayName"
                  variant="outlined"
                  return-object
                  multiple
                  density="compact"
                  :hide-details="display.xs.value"
                  :menu-props="{
                    zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                  }"
                  :disabled="allUsers || (readOnly && !$authz.hasRole($authz.roles.InternalAdmin))"
                  :error-messages="searchUsersErrorMsg"
                  :error="searchUsersError"
                  @blur="selectedUser()"
                />
              </v-col>
              <v-col cols="6" xs="6" lg="1" xl="1" sm="2" md="2" class="mt-1 flex_none pa-0">
                <v-checkbox
                  v-model="allUsers"
                  :disabled="readOnly && !$authz.hasRole($authz.roles.InternalAdmin)"
                  :ripple="false"
                  label="All Users"
                  class="mt-0"
                  color="accent"
                  @update:model-value="selectAllUsers()"
                />
              </v-col>
            </v-row>
            <v-col v-show="!allUsers" cols="12" xs="12" class="pa-0">
              <v-combobox
                v-model="selectedUserListValue"
                :items="emptyArray"
                multiple
                chips
                auto-grow
                rows="1"
                autocomplete="autofill-off"
                variant="outlined"
                hide-details
                :closable-chips="true"
                :menu-props="{
                  zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                }"
                :disabled="allUsers || readOnly"
                append-icon
                @update:modelValue="callPlanList"
              />
            </v-col>
          </v-col>
          <v-switch
            v-model="addPlan"
            color="accent"
            :disabled="readOnly || allUsers"
            label="Add Plan (plans based on selected user)"
            hide-details
          />
          <v-col v-if="addPlan" cols="12" xs="12" class="pt-3 pa-0">
            <v-col cols="12" xl="6" lg="8" md="8" sm="8" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
              <v-autocomplete
                v-model="plan"
                :items="planList"
                label="Search Plan"
                clearable
                auto-select-first
                append-icon
                autocomplete="autofill-off"
                return-object
                item-title="PNAME"
                item-value="SEINPNO"
                variant="outlined"
                multiple
                density="compact"
                :menu-props="{
                  zIndex: fromPage !== 'serviceProvider' ? '2' : '',
                  overflowY: true
                }"
                :disabled="readOnly"
                @blur="selectedPlans()"
              />
            </v-col>
            <v-col cols="12" xs="12" class="pa-0">
              <v-combobox
                v-model="selectedPlanListText"
                :items="emptyArray"
                multiple
                chips
                auto-grow
                rows="1"
                autocomplete="autofill-off"
                variant="outlined"
                hide-details
                :closable-chips="true"
                :menu-props="{
                  zIndex: fromPage !== 'serviceProvider' ? '2' : '',
                  overflowY: true
                }"
                :disabled="readOnly"
                append-icon
                @update:model-value="removePlanList"
              />
            </v-col>
          </v-col>
          <v-switch
            v-model="addStartup"
            :disabled="readOnly || allUsers"
            label="Add Startup (plans based on selected user)"
            class="offsetSwitch"
            hide-details
            color="accent"
          />
          <v-col v-if="addStartup" cols="12" xs="12" class="pt-3 pa-0">
            <v-col cols="12" xl="6" lg="8" md="8" sm="8" xs="12" class="pa-0" :class="display.xs.value ? '' : 'pr-3'">
              <v-autocomplete
                v-model="startup"
                :items="startupList"
                label="Search Startup"
                clearable
                auto-select-first
                append-icon
                autocomplete="autofill-off"
                return-object
                variant="outlined"
                item-title="PNAME"
                item-value="PlanID"
                multiple
                density="compact"
                :menu-props="{
                  zIndex: fromPage !== 'serviceProvider' ? '2' : '',
                  overflowY: true
                }"
                :disabled="readOnly"
                @blur="selectedStartups()"
              />
            </v-col>
            <v-col cols="12" xs="12" class="pa-0">
              <v-combobox
                v-model="selectedStartupsText"
                :items="emptyArray"
                multiple
                chips
                auto-grow
                rows="1"
                autocomplete="autofill-off"
                variant="outlined"
                hide-details
                :closable-chips="true"
                :menu-props="{
                  zIndex: fromPage !== 'serviceProvider' ? '2' : ''
                }"
                :disabled="readOnly"
                append-icon
                @update:model-value="removeStartupList"
              />
            </v-col>
          </v-col>
          <v-switch
            v-model="footNote"
            :disabled="readOnly"
            label="Footnote Text"
            class="offsetSwitch"
            hide-details
            color="accent"
          />
          <v-col v-if="footNote" cols="12" xs="12" class="pt-3 pa-0">
            <v-text-field
              v-model="footNoteText"
              auto-grow
              rows="1"
              autocomplete="autofill-off"
              variant="outlined"
              density="compact"
              hide-details
              :disabled="readOnly"
            />
          </v-col>
        </v-col>
      </v-col>
      <v-divider class="my-3 divider" />
      <v-col cols="12" xs="12" class="pb-3 pa-0">
        <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Fee Structure</h2>
      </v-col>
      <v-col id="feeStructure" cols="12" xs="12" class="pa-0">
        <v-card :class="display.xs.value ? ' pt-2 pb-4 pl-2 pr-2' : ' pt-2 pb-4 pl-5 pr-5'">
          <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pa-0">
            <v-row>
              <v-col v-if="false" cols="12" xs="12" class="pa-0">
                <v-switch
                  v-model="isBaseFee"
                  :disabled="readOnly"
                  label="Base"
                  class="offsetSwitch"
                  hide-details
                  color="accent"
                />
              </v-col>
              <v-col id="baseFeeTextField" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="mt-3 pa-0">
                <span
                  >Base Fee will either charge a flat fee if used alone, or will charge in addition to an annual asset fee if
                  combined with an annual asset fee</span
                >
              </v-col>
              <v-col v-if="isBaseFee" cols="12" xl="4" lg="4" md="5" sm="5" xs="12" class="mt-3 pa-0">
                <v-text-field
                  v-model="baseFee"
                  v-input-mask="{
                    alias: 'currency',
                    rightAlign: false,
                    autoUnmask: true,
                    allowMinus: false,
                    digitsOptional: true,
                    placeholder: '0'
                  }"
                  variant="outlined"
                  density="compact"
                  label="Charge a Base fee of"
                  prefix="$"
                  maxlength="13"
                  :hide-details="!baseFeeError"
                  autocomplete="autofill-off"
                  :disabled="readOnly"
                  :error-messages="baseFeeErrorMsg"
                  :error="baseFeeError"
                  @focus="$event.target.select()"
                />
              </v-col>
              <v-col cols="12" xs="12" class="pa-0">
                <v-divider class="my-3 divider" />
              </v-col>
              <v-col v-if="showAssetBasedFee" cols="12" xs="12" class="pa-0">
                <v-switch
                  v-model="isAnnualAsset"
                  label="Asset Based"
                  class="offsetSwitch mt-0"
                  hide-details
                  :disabled="readOnly"
                  color="accent"
                  @update:model-value="checkSchedule()"
                />
              </v-col>
              <v-col v-show="showAssetBasedFee" id="AnnualAssetSection" class="pa-0">
                <v-col v-if="isAnnualAsset" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="mt-3 pa-0">
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-radio-group v-model="annualAssetType" :disabled="readOnly" class="mt-0 pt-0">
                      <v-radio color="accent" value="Linear Fee Structure">
                        <template #label>
                          <div>
                            Use a
                            <b>Linear Fee Structure</b>
                            or "breakpoint" fee structure. Once a level is reached, all assets are charged that percentage.
                          </div>
                        </template>
                      </v-radio>
                      <v-radio
                        value="Tiered Fees"
                        class="mt-2"
                        color="accent"
                        :disabled="$store.state.user.selectedProgram.programName === $authz.managedPlan.MML"
                      >
                        <template #label>
                          <div>
                            Use a
                            <b>Tiered Fee Structure</b>
                            or "blended" fee structure. Each range is charged the % fee, even as assets grow.
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-col>
                </v-col>
                <v-col
                  v-if="(annualAssetType === 'Tiered Fees' || annualAssetType === 'Linear Fee Structure') && isAnnualAsset"
                  cols="12"
                  xl="12"
                  lg="12"
                  md="12"
                  sm="12"
                  xs="12"
                  class="pa-0"
                >
                  <v-col
                    v-show="annualAssetType === 'Tiered Fees'"
                    cols="12"
                    xl="8"
                    lg="8"
                    md="10"
                    xs="12"
                    sm="11"
                    class="pb-2 pa-0"
                  >
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pt-3 pb-2 pa-0">
                      <v-row>
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4" class="pa-0">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1" />
                            <v-col cols="8" xs="8"> From ($) </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> To ($) </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mt-0 mx-4 mb-3 transparentDivider" />
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> Fee Rate (%) </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-for="(item, index) in annualAssetBlended" :key="index" class="pa-0">
                      <v-row v-show="item.show">
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4" class="pa-0">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1 pa-0">
                              <v-btn
                                v-if="checkActiveBlended.length === index + 1 && !readOnly"
                                :disabled="readOnly"
                                icon
                                :ripple="false"
                                size="small"
                                class="ml-0"
                                @click="
                                  (greaterThanAssetBlended = !greaterThanAssetBlended),
                                    checkGreaterValue('asset', 'tiered', index)
                                "
                              >
                                <CustomIcon :type="greaterThanAssetBlended ? 'greaterthanOn' : 'greaterthanOff'" />
                              </v-btn>
                            </v-col>
                            <v-col cols="8" xs="8" class="align-self pa-0">
                              <h3>
                                {{ formatPrice(item['minimumAssetFees'], 0) }}
                              </h3>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          cols="3"
                          xl="3"
                          sm="3"
                          lg="3"
                          md="3"
                          xs="3"
                          class="pb-3 pa-0"
                          :class="display.xs.value ? 'pr-2' : ''"
                        >
                          <v-text-field
                            v-model="item['asset']"
                            v-input-mask="{
                              alias: 'currency',
                              digits: '0',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              placeholder: '0'
                            }"
                            variant="outlined"
                            density="compact"
                            v-if="item['hideMaxAsset']"
                            Single-line
                            prefix="$"
                            maxlength="13"
                            autocomplete="autofill-off"
                            hide-details
                            :error="item['assetBasedError']"
                            :disabled="readOnly || $store.state.user.selectedProgram.programName === $authz.managedPlan.MML"
                            @focus="$event.target.select()"
                            @blur="checkFeePercent(index, 'tiered', 'Asset')"
                          />
                        </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mt-0 mx-4 mb-3 divider" />
                        <v-col cols="3" xl="3" lg="3" sm="3" md="3" xs="3" class="pr-1 pb-3 pa-0">
                          <v-text-field
                            v-model="item['percent']"
                            :disabled="readOnly"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '3',
                              rightAlign: false,
                              allowMinus: false,
                              placeholder: '0',
                              autoUnmask: true
                            }"
                            variant="outlined"
                            density="compact"
                            Single-line
                            maxlength="10"
                            :error="error"
                            hide-details
                            autocomplete="autofill-off"
                            suffix="%"
                            @focus="$event.target.select()"
                            @blur="checkFeeRate(index, 'Tiered')"
                          />
                        </v-col>
                        <v-col cols="1" xl="1" sm="1" lg="1" md="1" xs="1" class="ml-2 pa-0">
                          <v-btn icon class="ma-0" :disabled="readOnly">
                            <v-icon :color="theme.dark ? '' : 'error'" @click="removeBlendedRow(index, 'Asset')">
                              mdi-close-circle
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-col
                        v-if="checkActiveBlended.length === index + 1 && checkActiveBlended.length !== 6 && !readOnly"
                        class="pa-0"
                        cols="12"
                        xs="12"
                      >
                        <v-btn
                          v-if="$store.state.user.selectedProgram.programName !== $authz.managedPlan.MML"
                          :ripple="false"
                          :color="theme.dark ? '' : 'accent'"
                          class="ma-0"
                          :disabled="disableAssetBlendedFee"
                          @click="addBlendedRow(index, 'Asset')"
                        >
                          Add Row
                        </v-btn>
                      </v-col>
                    </v-col>
                  </v-col>
                  <v-col
                    v-show="annualAssetType === 'Linear Fee Structure'"
                    cols="12"
                    xl="8"
                    lg="8"
                    md="10"
                    xs="12"
                    sm="11"
                    class="pb-2 pa-0"
                  >
                    <v-col cols="12" xl="12" lg="12" sm="12" xs="12" md="12" class="pt-3 pb-2 pa-0">
                      <v-row>
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4" class="pa-0">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1" />
                            <v-col cols="8" xs="8"> From ($) </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> To ($) </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mt-0 mx-4 mb-3 transparentDivider" />
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> Fee Rate (%) </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-for="(item, index) in annualAssetBreakpoint" :key="index" class="pa-0">
                      <v-row v-show="item.show">
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4" class="pa-0">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1">
                              <v-btn
                                v-if="checkActiveBreakpoint.length === index + 1 && !readOnly"
                                :disabled="readOnly"
                                icon
                                :ripple="false"
                                size="small"
                                class="ml-0"
                                @click="
                                  (greaterThanAssetBreakpoint = !greaterThanAssetBreakpoint),
                                    checkGreaterValue('asset', 'linear', index)
                                "
                              >
                                <CustomIcon :type="greaterThanAssetBreakpoint ? 'greaterthanOn' : 'greaterthanOff'" />
                              </v-btn>
                            </v-col>
                            <v-col cols="8" xs="8" class="align-self">
                              <h3>{{ formatPrice(item['minAsset'], 0) }}</h3>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          cols="3"
                          xl="3"
                          sm="3"
                          lg="3"
                          md="3"
                          xs="3"
                          class="pb-3 pa-0"
                          :class="display.xs.value ? 'pr-2' : ''"
                        >
                          <v-text-field
                            v-model="item['maxAsset']"
                            v-input-mask="{
                              alias: 'currency',
                              digits: '0',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              placeholder: '0'
                            }"
                            variant="outlined"
                            density="compact"
                            Single-line
                            ref="assetLinear"
                            prefix="$"
                            v-if="item['hideMaxAsset']"
                            maxlength="13"
                            autocomplete="autofill-off"
                            hide-details
                            :disabled="readOnly || $store.state.user.selectedProgram.programName === $authz.managedPlan.MML"
                            :error="item['assetBasedError']"
                            @focus="$event.target.select()"
                            @blur="checkFeePercent(index, 'linear', 'Asset')"
                          />
                        </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mt-0 mx-4 mb-3 divider" />
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3" class="pr-1 pb-3 pa-0">
                          <v-text-field
                            v-model="item['breakpointPercent']"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '3',
                              max: 100,
                              min: 0,
                              rightAlign: false,
                              allowMinus: false,
                              placeholder: '0',
                              autoUnmask: true
                            }"
                            variant="outlined"
                            density="compact"
                            Single-line
                            suffix="%"
                            :error="error"
                            autocomplete="autofill-off"
                            hide-details
                            :disabled="readOnly"
                            @focus="$event.target.select()"
                            @change="checkFeeRate(index, 'Linear')"
                          />
                        </v-col>
                        <v-col cols="1" xl="1" sm="1" lg="1" md="1" xs="1" class="ml-2 pa-0">
                          <v-btn icon class="ma-0" :disabled="readOnly">
                            <v-icon :color="theme.dark ? '' : 'error'" @click="removeBreakpointRow(index, 'Asset')">
                              mdi-close-circle
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-col
                        v-if="checkActiveBreakpoint.length === index + 1 && checkActiveBreakpoint.length !== 6 && !readOnly"
                        class="pa-0"
                        cols="12"
                        xs="12"
                      >
                        <v-btn
                          v-if="$store.state.user.selectedProgram.programName !== $authz.managedPlan.MML"
                          :ripple="false"
                          :color="theme.dark ? '' : 'accent'"
                          class="ma-0"
                          :disabled="disableAssetBreakpointFee"
                          @click="addBreakpointRow(index, 'Asset')"
                        >
                          Add Row
                        </v-btn>
                      </v-col>
                    </v-col>
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="showParticipantBasedFee" cols="12" xs="12" class="pa-0">
                <v-divider class="my-3 divider" />
              </v-col>
              <v-col v-if="showParticipantBasedFee" id="AnnualParticipantSection" cols="12" xs="12" class="pa-0">
                <v-switch
                  v-model="isParticipantFee"
                  label="Participant Based"
                  class="offsetSwitch mt-0"
                  hide-details
                  :disabled="readOnly"
                  color="accent"
                />
              </v-col>
              <v-col v-if="showParticipantBasedFee" class="pa-0">
                <v-col v-if="isParticipantFee" cols="12" xl="12" lg="12" sm="12" xs="12" md="12" class="mt-3 pa-0">
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-radio-group v-model="partStructureType" :disabled="readOnly" class="mt-0 pt-0">
                      <v-radio color="accent" value="Linear Fee Structure">
                        <template #label>
                          <div>
                            Use a
                            <b>Linear Fee Structure</b>
                            or "breakpoint" fee structure. Once a level is reached, all assets are charged that percentage.
                          </div>
                        </template>
                      </v-radio>
                      <v-radio
                        color="accent"
                        value="Tiered Fees"
                        class="mt-2"
                        :disabled="$store.state.user.selectedProgram.programName === $authz.managedPlan.MML"
                      >
                        <template #label>
                          <div>
                            Use a
                            <b>Tiered Fee Structure</b>
                            or "blended" fee structure. Each range is charged the % fee, even as assets grow.
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-col>
                </v-col>
                <v-col
                  v-if="(partStructureType === 'Tiered Fees' || partStructureType === 'Linear Fee Structure') && isParticipantFee"
                  class="pa-0"
                  cols="12"
                  xl="12"
                  lg="12"
                  sm="12"
                  xs="12"
                  md="12"
                >
                  <v-col
                    v-show="partStructureType === 'Tiered Fees'"
                    cols="12"
                    xl="8"
                    lg="8"
                    md="10"
                    xs="12"
                    sm="11"
                    class="pb-2 pa-0"
                  >
                    <v-col cols="12" xl="12" lg="12" sm="12" xs="12" md="12" class="pt-3 pa-0">
                      <v-row>
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4" class="pa-0">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1" />
                            <v-col cols="8" xs="8"> From (#) </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> To (#) </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mt-0 mx-4 mb-3 transparentDivider" />
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> Fee Rate ($) </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-for="(item, index) in participantBlended" :key="index" class="pa-0">
                      <v-row v-show="item.show">
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4" class="pa-0">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1">
                              <v-btn
                                v-if="checkActiveParticipantBlended.length === index + 1 && !readOnly"
                                :disabled="readOnly"
                                icon
                                :ripple="false"
                                size="small"
                                class="ml-0"
                                @click="
                                  (greaterThanParticipantBlended = !greaterThanParticipantBlended),
                                    checkGreaterValue('participant', 'tiered', index)
                                "
                              >
                                <CustomIcon :type="greaterThanParticipantBlended ? 'greaterthanOn' : 'greaterthanOff'" />
                              </v-btn>
                            </v-col>
                            <v-col cols="8" xs="8" class="align-self">
                              <h3>{{ item['minParticipantAsset'] }}</h3>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          cols="3"
                          xl="3"
                          sm="3"
                          lg="3"
                          md="3"
                          xs="3"
                          class="pb-3 pa-0"
                          :class="display.xs.value ? 'pr-2' : ''"
                        >
                          <v-text-field
                            v-model="item['asset']"
                            v-input-mask="{
                              alias: 'currency',
                              digits: '0',
                              rightAlign: false,
                              allowMinus: false,
                              placeholder: '0',
                              autoUnmask: true
                            }"
                            variant="outlined"
                            density="compact"
                            Single-line
                            v-if="item['hideMaxAsset']"
                            maxlength="10"
                            autocomplete="autofill-off"
                            hide-details
                            :disabled="readOnly"
                            :error="item['participantBasedError']"
                            @focus="$event.target.select()"
                            @blur="checkFeePercent(index, 'tiered', 'Participant')"
                          />
                        </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mt-0 mx-4 mb-3 divider" />
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3" class="pr-2 pb-3 pa-0">
                          <v-text-field
                            v-model="item['percent']"
                            prefix="$"
                            v-input-mask="{
                              alias: 'currency',
                              digits: '0',
                              rightAlign: false,
                              allowMinus: false,
                              placeholder: '0',
                              autoUnmask: true
                            }"
                            variant="outlined"
                            density="compact"
                            Single-line
                            maxlength="10"
                            :error="error"
                            autocomplete="autofill-off"
                            hide-details
                            :disabled="readOnly"
                            @focus="$event.target.select()"
                            @change="checkParticipantFeeRate(index, 'Tiered')"
                          />
                        </v-col>
                        <v-col cols="1" xl="1" sm="1" lg="1" md="1" xs="1" class="ml-2">
                          <v-btn icon class="ma-0" :disabled="readOnly">
                            <v-icon :color="theme.dark ? '' : 'error'" @click="removeBlendedRow(index, 'Participant')">
                              mdi-close-circle
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-col
                        v-if="
                          checkActiveParticipantBlended.length === index + 1 &&
                          checkActiveParticipantBlended.length !== 6 &&
                          !readOnly
                        "
                        class="pa-0"
                        cols="12"
                        xs="12"
                      >
                        <v-btn
                          :ripple="false"
                          :color="theme.dark ? '' : 'accent'"
                          class="ma-0"
                          :disabled="disableParticipantBlendedFee"
                          @click="addBlendedRow(index, 'Participant')"
                        >
                          Add Row
                        </v-btn>
                      </v-col>
                    </v-col>
                  </v-col>
                  <v-col
                    v-show="partStructureType === 'Linear Fee Structure'"
                    cols="12"
                    xl="8"
                    lg="8"
                    md="8"
                    sm="10"
                    xs="12"
                    class="pb-2 pa-0"
                  >
                    <v-col cols="12" xl="12" lg="12" sm="12" xs="12" md="12" class="pt-3 pa-0">
                      <v-row>
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1" />
                            <v-col cols="8" xs="8"> From (#) </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> To (#) </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mt-0 mx-4 mb-3 transparentDivider" />
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3"> Fee Rate ($) </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-for="(item, index) in participantBreakpoint" :key="index" class="pa-0">
                      <v-row v-show="item.show">
                        <v-col cols="4" xl="2" sm="3" lg="3" md="3" xs="4" class="pa-0">
                          <v-row>
                            <v-col cols="2" xs="2" class="margin_right_1">
                              <v-btn
                                v-if="checkActiveParticipantBreakpoint.length === index + 1 && !readOnly"
                                :disabled="readOnly"
                                icon
                                :ripple="false"
                                size="small"
                                class="ml-0"
                                @click="
                                  (greaterThanParticipantBreakpoint = !greaterThanParticipantBreakpoint),
                                    checkGreaterValue('participant', 'linear', index)
                                "
                              >
                                <CustomIcon :type="greaterThanParticipantBreakpoint ? 'greaterthanOn' : 'greaterthanOff'" />
                              </v-btn>
                            </v-col>
                            <v-col cols="8" xs="8" class="align-self">
                              <h3>{{ item['minAsset'] }}</h3>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          cols="3"
                          xl="3"
                          sm="3"
                          lg="3"
                          md="3"
                          xs="3"
                          class="pb-3 pa-0"
                          :class="display.xs.value ? 'pr-2' : ''"
                        >
                          <v-text-field
                            v-model="item['maxAsset']"
                            variant="outlined"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '0',
                              rightAlign: false,
                              allowMinus: false,
                              placeholder: '0',
                              autoUnmask: true
                            }"
                            density="compact"
                            ref="participantLinear"
                            Single-line
                            v-if="item['hideMaxAsset']"
                            maxlength="10"
                            hide-details
                            autocomplete="autofill-off"
                            :disabled="readOnly"
                            :error="item['participantBasedError']"
                            @focus="$event.target.select()"
                            @blur="checkFeePercent(index, 'linear', 'Participant')"
                          />
                        </v-col>
                        <v-divider v-if="!display.xs.value" vertical class="mx-4 mt-0 mb-3 divider" />
                        <v-col cols="3" xl="3" sm="3" lg="3" md="3" xs="3" class="pr-1 pb-3 pa-0">
                          <v-text-field
                            v-model="item['breakpointPercent']"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digits: '0',
                              placeholder: '0'
                            }"
                            variant="outlined"
                            density="compact"
                            Single-line
                            prefix="$"
                            hide-details
                            autocomplete="autofill-off"
                            :disabled="readOnly"
                            maxlength="10"
                            @focus="$event.target.select()"
                            @change="checkParticipantFeeRate(index, 'Linear')"
                          />
                        </v-col>
                        <v-col cols="1" xl="1" sm="1" lg="1" md="1" xs="1" class="ml-2 pa-0">
                          <v-btn icon class="ma-0" :disabled="readOnly">
                            <v-icon :color="theme.dark ? '' : 'error'" @click="removeBreakpointRow(index, 'Participant')">
                              mdi-close-circle
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-col
                        v-if="
                          checkActiveParticipantBreakpoint.length === index + 1 &&
                          checkActiveParticipantBreakpoint.length !== 6 &&
                          !readOnly
                        "
                        class="pa-0"
                        cols="12"
                        xs="12"
                      >
                        <v-btn
                          :ripple="false"
                          :color="theme.dark ? '' : 'accent'"
                          class="ma-0"
                          :disabled="disableParticipantBreakpointFee"
                          @click="addBreakpointRow(index, 'Participant')"
                        >
                          Add Row
                        </v-btn>
                      </v-col>
                    </v-col>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" class="pt-3 pb-3 pa-0">
                    <v-text-field
                      v-model="waivedParticipants"
                      v-input-mask="{
                        alias: 'currency',
                        digits: '0',
                        rightAlign: false,
                        autoUnmask: true,
                        allowMinus: false,
                        placeholder: ''
                      }"
                      variant="outlined"
                      density="compact"
                      label="Waived Participants"
                      autocomplete="autofill-off"
                      maxlength="13"
                      hide-details
                      :disabled="readOnly"
                      @focus="$event.target.select()"
                    />
                  </v-col>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
      <v-col v-if="fromPage !== 'serviceProvider'" cols="12" xs="12" class="mt-4 pa-0">
        <v-row>
          <v-col v-if="!readOnly || $authz.hasRole($authz.roles.InternalAdmin)" cols="12" xs="12" class="text-right">
            <v-btn
              v-if="!display.xs.value"
              variant="outlined"
              :color="theme.dark ? '' : 'accent'"
              :class="display.xs.value ? 'mr-0' : ''"
              @click="resetFees()"
            >
              Clear
            </v-btn>
            <v-btn class="mr-0" :color="theme.dark ? '' : 'accent'" :disabled="!valid" @click="SaveSchedule()">
              Save & Close
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
    <v-col cols="12" xs="12" class="pa-0">
      <FeeScheduleBuilder ref="etfScheduleBuilder" from="createETF" @get-e-t-f-fee="getETFFeeSchedule" />
    </v-col>
  </v-col>
</template>
<script>
import { ref, inject, getCurrentInstance, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import FeeScheduleBuilder from '@/components/Account/FeeScheduleBuilder'
import Loader from '@/components/Loader'
import CustomIcon from '@/components/CustomIcon'
export default {
  components: {
    FeeScheduleBuilder,
    Loader,
    CustomIcon
  },
  props: ['getFee', 'openNewFees', 'fromPage'],
  setup(props) {
    const eventBus = inject('eventBus')
    const $toast = inject('toast')
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $authz = instance.appContext.config.globalProperties.$authz
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const emptyArray = ref([])
    const etfScheduleBuilder = ref(null)
    const valid = ref(false)
    const businessType = ref('employerSponsored')
    const isDefault = ref(false)
    const scheduleType = ref('')
    const addUserSection = ref(null)
    const scheduleTypes = ref([
      { text: 'Administration', value: 'Administration' },
      { text: 'Advisory', value: 'Advisory' },
      { text: 'Investment Manager', value: 'Investment Manager' },
      { text: 'Custodian', value: 'Custodian' },
      { text: 'Recordkeeping', value: 'Recordkeeping' }
    ])
    const scheduleTypeList = ref([])
    const items = ref([
      { text: 'Active', value: 1 },
      { text: 'Inactive', value: 0 }
    ])
    const annualAssetType = ref('Linear Fee Structure')
    const partStructureType = ref('Linear Fee Structure')
    const isActive = ref(1)
    const blended = ref(false)
    const breakpoint = ref(false)
    const scheduleNameErrorMsg = ref('')
    const scheduleNameError = ref(false)
    const feeScheduleName = ref('')
    const error = ref(false)
    const isAnnualAsset = ref(false)
    const isBaseFee = ref(false)
    const part1Base = ref(0)
    const baseFee = ref(0)
    const minimumFees = ref(0)
    const maximumFees = ref(0)
    const annualAssetsBlended = ref([
      {
        Id: 1,
        hideMaxAsset: true,
        show: true,
        minimumAssetFees: 0,
        asset: 0,
        percent: 0,
        assetBasedError: false
      },
      {
        Id: 2,
        hideMaxAsset: true,
        show: true,
        minimumAssetFees: 0,
        asset: 0,
        percent: 0,
        assetBasedError: false
      },
      {
        Id: 3,
        hideMaxAsset: true,
        show: false,
        minimumAssetFees: 0,
        asset: 0,
        assetBasedError: false,
        percent: 0
      },
      {
        Id: 4,
        hideMaxAsset: true,
        show: false,
        minimumAssetFees: 0,
        asset: 0,
        assetBasedError: false,
        percent: 0
      },
      {
        Id: 5,
        hideMaxAsset: true,
        show: false,
        minimumAssetFees: 0,
        asset: 0,
        assetBasedError: false,
        percent: 0
      },
      {
        Id: 6,
        hideMaxAsset: true,
        show: false,
        minimumAssetFees: 0,
        asset: 0,
        assetBasedError: false,
        percent: 0
      }
    ])
    const annualAssetsBreakpoint = ref([
      {
        Id: 1,
        hideMaxAsset: true,
        show: true,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        assetBasedError: false
      },
      {
        Id: 2,
        hideMaxAsset: true,
        show: true,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        assetBasedError: false
      },
      {
        Id: 3,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        assetBasedError: false
      },
      {
        Id: 4,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        assetBasedError: false
      },
      {
        Id: 5,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        assetBasedError: false
      },
      {
        Id: 6,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        assetBasedError: false
      }
    ])
    const id = ref(0)
    const hasError = ref(false)
    const isParticipantFee = ref(false)
    const assetFeeMin = ref(0)
    const participantFeeMin = ref(0)
    const participantsBlended = ref([
      {
        Id: 1,
        hideMaxAsset: true,
        show: true,
        minParticipantAsset: 0,
        asset: 0,
        percent: 0,
        participantBasedError: false,
        base: 0
      },
      {
        Id: 2,
        hideMaxAsset: true,
        show: true,
        minParticipantAsset: 0,
        asset: 0,
        percent: 0,
        participantBasedError: false,
        base: 0
      },
      {
        Id: 3,
        hideMaxAsset: true,
        show: false,
        minParticipantAsset: 0,
        asset: 0,
        percent: 0,
        participantBasedError: false,
        base: 0
      },
      {
        Id: 4,
        hideMaxAsset: true,
        show: false,
        minParticipantAsset: 0,
        asset: 0,
        percent: 0,
        participantBasedError: false,
        base: 0
      },
      {
        Id: 5,
        hideMaxAsset: true,
        show: false,
        minParticipantAsset: 0,
        asset: 0,
        percent: 0,
        participantBasedError: false,
        base: 0
      },
      {
        Id: 6,
        hideMaxAsset: true,
        show: false,
        minParticipantAsset: 0,
        asset: 0,
        percent: 0,
        participantBasedError: false,
        base: 0
      }
    ])
    const participantsBreakpoint = ref([
      {
        Id: 1,
        hideMaxAsset: true,
        show: true,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        base: 0,
        participantBasedError: false
      },
      {
        Id: 2,
        hideMaxAsset: true,
        show: true,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        base: 0,
        participantBasedError: false
      },
      {
        Id: 3,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        base: 0,
        participantBasedError: false
      },
      {
        Id: 4,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        base: 0,
        participantBasedError: false
      },
      {
        Id: 5,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        base: 0,
        participantBasedError: false
      },
      {
        Id: 6,
        hideMaxAsset: true,
        show: false,
        minAsset: 0,
        maxAsset: 0,
        breakpointPercent: 0,
        base: 0,
        participantBasedError: false
      }
    ])
    const waivedParticipants = ref(0)
    const planTypeList = ref([])
    const planType = ref([])
    const addUser = ref(false)
    const addPlan = ref(false)
    const addStartup = ref(false)
    const footNote = ref(false)
    const conversion = ref(0)
    const document = ref(0)
    const installation = ref(0)
    const assetHeader = ref('')
    const participantHeader = ref('')
    const baseHeader = ref('')
    const footNoteText = ref('')
    const startup = ref('')
    const startupList = ref([])
    const plan = ref('')
    const planList = ref([])
    const user = ref('')
    const feeContainerModel = ref(null)
    const userList = ref([])
    const selectedUserListValue = ref([])
    const custodianList = ref([
      { text: 'TD Ameritrade', value: 'TD Ameritrade' },
      { text: 'AdvisorTrust', value: 'AdvisorTrust' },
      { text: 'Charles Schwab', value: 'Charles Schwab' },
      { text: 'Fidelity', value: 'Fidelity' },
      { text: 'Folio', value: 'Folio' },
      { text: 'Save Daily', value: 'Save Daily' }
    ])
    const custodian = ref('')
    const subCustodian = ref('')
    const subCustodianList = ref([
      { text: 'TD Ameritrade', value: 'TD Ameritrade' },
      { text: 'Charles Schwab', value: 'Charles Schwab' },
      {
        text: 'Matrix Financial Solutions',
        value: 'Matrix Financial Solutions'
      },
      { text: 'Fidelity', value: 'Fidelity' }
    ])
    const etfScheduleList = ref([])
    const etfSchedule = ref('')
    const selectedPlanListText = ref([])
    const selectedPlanListValue = ref([])
    const selectedStartupsText = ref([])
    const selectedStartupsValue = ref([])
    const allUsers = ref(false)
    const maximumFeesErrorMsg = ref('')
    const maximumFeesError = ref(false)
    const loading = ref(false)
    const readOnly = ref(false)
    const markDefaultReadOnly = ref(false)
    const isActiveFees = ref(false)
    const searchUsersErrorMsg = ref('')
    const searchUsersError = ref(false)
    const baseFeeErrorMsg = ref('')
    const baseFeeError = ref(false)
    const minimumFeeError = ref(false)
    const minimumFeeErrorMsg = ref('')
    const scheduleTypeError = ref(false)
    const scheduleTypeErrorMsg = ref('')
    const defaultAsset = ref([])
    const greaterThanAssetBlended = ref(false)
    const greaterThanAssetBreakpoint = ref(false)
    const greaterThanParticipantBlended = ref(false)
    const greaterThanParticipantBreakpoint = ref(false)
    const disableParticipantBreakpointFee = ref(false)
    const disableAssetBlendedFee = ref(false)
    const disableAssetBreakpointFee = ref(false)
    const disableParticipantBlendedFee = ref(false)
    const custodianErrorMsg = ref('')
    const custodianError = ref(false)
    const subCustodianError = ref(false)
    const subCustodianErrorMsg = ref('')
    const annualAssetBlended = computed(() => {
      return annualAssetsBlended.value
    })
    const annualAssetBreakpoint = computed(() => {
      return annualAssetsBreakpoint.value
    })
    const checkActiveBlended = computed(() => {
      return annualAssetBlended.value.filter((a) => a.show === true)
    })
    const checkActiveBreakpoint = computed(() => {
      return annualAssetBreakpoint.value.filter((a) => a.show === true)
    })
    const participantBlended = computed(() => {
      return participantsBlended.value
    })
    const participantBreakpoint = computed(() => {
      return participantsBreakpoint.value
    })
    const checkActiveParticipantBlended = computed(() => {
      return participantBlended.value.filter((a) => a.show === true)
    })
    const checkActiveParticipantBreakpoint = computed(() => {
      return participantBreakpoint.value.filter((a) => a.show === true)
    })
    const showAssetBasedFee = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram($authz.programPermissionSet.Allow_Asset_Based_Fee__c, $authz.permission.Full)
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Allow_Asset_Based_Fee__c, $authz.permission.Full) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Allow_Asset_Based_Fee__c, $authz.permission.Full)
        )
      } else return true
    })
    const showParticipantBasedFee = computed(() => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if (
          $authz.hasRole($authz.roles.SiteAdmin) ||
          $authz.hasRole($authz.roles.ProgramAdmin) ||
          $authz.hasRole($authz.roles.InternalAdmin)
        ) {
          if (scheduleType.value !== 'Advisory' && scheduleType.value !== '') {
            return true
          } else {
            return false
          }
        } else return false
      } else if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram($authz.programPermissionSet.Allow_Participant_Based_Fee__c, $authz.permission.Full)
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram($authz.programPermissionSet.Allow_Participant_Based_Fee__c, $authz.permission.Full) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Allow_Participant_Based_Fee__c, $authz.permission.Full)
        )
      } else return true
    })
    const maximumAdvisoryFees = computed(() => {
      if (
        $authz.hasRole($authz.roles.SiteAdmin) ||
        $authz.hasRole($authz.roles.ProgramAdmin) ||
        $authz.hasRole($authz.roles.FirmAdmin)
      ) {
        if ($store.state.user.selectedProgram.maximum_Advisor_Fee__c) {
          return parseFloat($store.state.user.selectedProgram.maximum_Advisor_Fee__c)
        } else return 0
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        if ($store.state.user.selectedProgram && $store.state.user.selectedProgram.accounts.length > 0) {
          var advisorFees = 0
          advisorFees = $store.state.user.selectedProgram.accounts[0].maximum_Advisor_Fee__c
            ? parseFloat($store.state.user.selectedProgram.accounts[0].maximum_Advisor_Fee__c)
            : 0
          if (advisorFees === 0) {
            advisorFees = $store.state.user.selectedProgram.maximum_Advisor_Fee__c
              ? parseFloat($store.state.user.selectedProgram.maximum_Advisor_Fee__c)
              : 0
          }
          return advisorFees
        }
        return 0
      }
      return 0
    })
    const showMinMaxFee = computed(() => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if (
          $authz.hasRole($authz.roles.SiteAdmin) ||
          $authz.hasRole($authz.roles.ProgramAdmin) ||
          $authz.hasRole($authz.roles.InternalAdmin)
        ) {
          if (scheduleType.value !== 'Advisory' && scheduleType.value !== '') {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      } else return false
    })
    const checkGreaterValue = (val, type, index) => {
      if (val === 'asset') {
        if (type === 'linear') {
          if (greaterThanAssetBreakpoint.value) {
            if (index > 0) {
              var assetBasedBreakpoint = annualAssetBreakpoint.value[index - 1]
              annualAssetBreakpoint.value[index].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
            }
            annualAssetBreakpoint.value[index].assetBasedError = false
            annualAssetBreakpoint.value[index].maxAsset = 0
            annualAssetBreakpoint.value[index].hideMaxAsset = false
            annualAssetBreakpoint.value[index].show = true
            annualAssetBreakpoint.value.forEach((element, i) => {
              if (index < i) {
                element.show = false
              }
            })
            disableAssetBreakpointFee.value = true
            $toast?.destroy()
          } else {
            if (index > 0) {
              var linearAssetBasedBreakpoint = annualAssetBreakpoint.value[index - 1]
              annualAssetBreakpoint.value[index].minAsset = parseInt(linearAssetBasedBreakpoint.maxAsset)
            }
            annualAssetBreakpoint.value[index].assetBasedError = false
            annualAssetBreakpoint.value[index].maxAsset = 0
            annualAssetBreakpoint.value[index].hideMaxAsset = true
            annualAssetBreakpoint.value[index].show = true
            disableAssetBreakpointFee.value = false
          }
        } else {
          if (greaterThanAssetBlended.value) {
            if (index > 0) {
              var assetBasedBlend = annualAssetBlended.value[index - 1]
              annualAssetBlended.value[index].minimumAssetFees = parseInt(assetBasedBlend.asset)
            }
            annualAssetBlended.value[index].assetBasedError = false
            annualAssetBlended.value[index].asset = 0
            annualAssetBlended.value[index].hideMaxAsset = false
            annualAssetBlended.value[index].show = true
            annualAssetBlended.value.forEach((element, i) => {
              if (index < i) {
                element.show = false
              }
            })
            disableAssetBlendedFee.value = true
            $toast?.destroy()
          } else {
            if (index > 0) {
              var tierredAssetBasedBlend = annualAssetBlended.value[index - 1]
              annualAssetBlended.value[index].minimumAssetFees = parseInt(tierredAssetBasedBlend.asset)
            }
            annualAssetBlended.value[index].assetBasedError = false
            annualAssetBlended.value[index].asset = 0
            annualAssetBlended.value[index].hideMaxAsset = true
            annualAssetBlended.value[index].show = true
            disableAssetBlendedFee.value = false
          }
        }
      } else {
        if (type === 'linear') {
          if (greaterThanParticipantBreakpoint.value) {
            if (index > 0) {
              var participantBasedBreakpoint = participantsBreakpoint.value[index - 1]
              participantsBreakpoint.value[index].minAsset = parseInt(participantBasedBreakpoint.maxAsset)
            }
            participantsBreakpoint.value[index].participantBasedError = false
            participantsBreakpoint.value[index].maxAsset = 0
            participantsBreakpoint.value[index].hideMaxAsset = false
            participantsBreakpoint.value[index].show = true
            participantsBreakpoint.value.forEach((element, i) => {
              if (index < i) {
                element.show = false
              }
            })
            disableParticipantBreakpointFee.value = true
            $toast?.destroy()
          } else {
            if (index > 0) {
              var linearPartBasedBreakpoint = participantsBreakpoint.value[index - 1]
              participantsBreakpoint.value[index].minAsset = parseInt(linearPartBasedBreakpoint.maxAsset)
            }
            participantsBreakpoint.value[index].participantBasedError = false
            participantsBreakpoint.value[index].maxAsset = 0
            participantsBreakpoint.value[index].hideMaxAsset = true
            participantsBreakpoint.value[index].show = true
            disableParticipantBreakpointFee.value = false
          }
        } else {
          if (greaterThanParticipantBlended.value) {
            if (index > 0) {
              var participantBasedBlend = participantsBlended.value[index - 1]
              participantsBlended.value[index].minParticipantAsset = parseInt(participantBasedBlend.asset)
            }
            participantsBlended.value[index].participantBasedError = false
            participantsBlended.value[index].asset = 0
            participantsBlended.value[index].hideMaxAsset = false
            participantsBlended.value[index].show = true
            participantsBlended.value.forEach((element, i) => {
              if (index < i) {
                element.show = false
              }
            })
            disableParticipantBlendedFee.value = true
            $toast?.destroy()
          } else {
            if (index > 0) {
              var tierredParticipantBasedBlend = participantsBlended.value[index - 1]
              participantsBlended.value[index].minParticipantAsset = parseInt(tierredParticipantBasedBlend.asset)
            }
            participantsBlended.value[index].participantBasedError = false
            participantsBlended.value[index].asset = 0
            participantsBlended.value[index].hideMaxAsset = true
            participantsBlended.value[index].show = true
            disableParticipantBlendedFee.value = false
          }
        }
      }
    }
    const checkSchedule = () => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if (
          $store.state.user.selectedProgram.programName === $authz.managedPlan.MML ||
          $store.state.user.selectedProgram.programName === $authz.managedPlan.PA
        ) {
          if (showAssetBasedFee.value) {
            if (!scheduleType.value) {
              scheduleType.value = 'Advisory'
              assignDefaultAsset()
            }
          }
        }
      }
    }
    const checkFeeRate = (index, type) => {
      if (type === 'Linear') {
        var linearFeeRate = annualAssetBreakpoint.value[index].breakpointPercent
          ? parseFloat(annualAssetBreakpoint.value[index].breakpointPercent)
          : 0
        annualAssetBreakpoint.value[index].breakpointPercent = linearFeeRate
      } else {
        var tieredFeeRate = annualAssetBlended.value[index].percent ? parseFloat(annualAssetBlended.value[index].percent) : 0
        annualAssetBlended.value[index].percent = tieredFeeRate
      }
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if ($store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
          var assetFeeRate = defaultAsset.value[index].Fee ? parseFloat(defaultAsset.value[index].Fee / 100) : 0
          var changedFeeRate = 0
          if (type === 'Linear') {
            changedFeeRate = annualAssetBreakpoint.value[index].breakpointPercent
              ? parseFloat(annualAssetBreakpoint.value[index].breakpointPercent)
              : 0
          } else if (type === 'Tiered') {
            changedFeeRate = annualAssetBlended.value[index].percent ? parseFloat(annualAssetBlended.value[index].percent) : 0
          }
          if (changedFeeRate > assetFeeRate) {
            $toast?.destroy()
            $toast.error(`Fee Rate should be less than ${assetFeeRate}%`, '')
            if (type === 'Linear') {
              annualAssetsBreakpoint.value[index].breakpointPercent = assetFeeRate
            } else if (type === 'Tiered') {
              annualAssetBlended.value[index].percent = assetFeeRate
            }
            return
          }
        } else if ($store.state.user.selectedProgram.programName === $authz.managedPlan.PA) {
          var minAssetFee = defaultAsset.value[0].MinFee ? parseFloat(defaultAsset.value[0].MinFee / 100) : 0
          var maxAssetFee = defaultAsset.value[0].Fee ? parseFloat(defaultAsset.value[0].Fee / 100) : 0
          var changedFeeValue = 0
          if (type === 'Linear') {
            changedFeeValue = annualAssetBreakpoint.value[index].breakpointPercent
              ? parseFloat(annualAssetBreakpoint.value[index].breakpointPercent)
              : 0
          } else if (type === 'Tiered') {
            changedFeeValue = annualAssetBlended.value[index].percent ? parseFloat(annualAssetBlended.value[index].percent) : 0
          }
          if (changedFeeValue < minAssetFee || changedFeeValue > maxAssetFee) {
            $toast?.destroy()
            $toast.error(`Fee Rate should be between ${minAssetFee}% and ${maxAssetFee}%`, '')
            if (type === 'Linear') {
              annualAssetsBreakpoint.value[index].breakpointPercent = 0
            } else if (type === 'Tiered') {
              annualAssetBlended.value[index].percent = 0
            }
            return
          }
        }
      }
    }
    const checkParticipantFeeRate = (index, type) => {
      if (type === 'Linear') {
        var linearFeeRate = participantsBreakpoint.value[index].breakpointPercent
          ? parseFloat(participantsBreakpoint.value[index].breakpointPercent)
          : 0
        participantsBreakpoint.value[index].breakpointPercent = linearFeeRate
      } else {
        var tieredFeeRate = participantsBlended.value[index].percent ? parseFloat(participantsBlended.value[index].percent) : 0
        participantsBlended.value[index].percent = tieredFeeRate
      }
    }
    function openETFSchedule() {
      if (etfScheduleBuilder.value) etfScheduleBuilder.value.dialog = true
    }
    function getETFFeeSchedule() {
      $axios.get(`/api/v1/tal/feeengineschedule/etffees`).then((success) => {
        etfScheduleList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
      })
    }
    function checkTrustee() {
      if (!custodian.value) {
        custodianErrorMsg.value = 'Trustee / Custodian is required'
        custodianError.value = true
      } else {
        custodianErrorMsg.value = ''
        custodianError.value = false
        checkSubCustodian()
      }
    }
    function checkSubCustodian() {
      if (!subCustodian.value) {
        if (custodian.value && custodian.value === 'AdvisorTrust') {
          subCustodianErrorMsg.value = 'Sub-Custodian is required'
          subCustodianError.value = true
        } else {
          subCustodianErrorMsg.value = ''
          subCustodianError.value = false
        }
      } else {
        subCustodianErrorMsg.value = ''
        subCustodianError.value = false
      }
    }
    function checkFeeScheduleName() {
      if (feeScheduleName.value.length > 100) {
        scheduleNameErrorMsg.value = 'Name cannot be greater than 100'
        scheduleNameError.value = true
      } else if (feeScheduleName.value === '') {
        scheduleNameErrorMsg.value = 'Fee Schedule Name is required'
        scheduleNameError.value = true
      } else {
        scheduleNameErrorMsg.value = ''
        scheduleNameError.value = false
      }
    }
    function addBlendedRow(index, type) {
      var i = index + 1
      if (type === 'Asset') {
        var assetBlendValue = parseInt(annualAssetBlended.value[index].asset)
        annualAssetBlended.value.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.minimumAssetFees = greaterThanAssetBlended.value ? assetBlendValue : assetBlendValue > 0 ? assetBlendValue : 0
            element.show = true
          }
        })
      } else {
        var partBlendValue = parseInt(participantBlended.value[index].asset)
        participantBlended.value.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.minParticipantAsset = greaterThanParticipantBlended.value
              ? partBlendValue
              : partBlendValue > 0
                ? partBlendValue
                : 0
            element.show = true
          }
        })
      }
    }
    function addBreakpointRow(index, type) {
      var i = index + 1
      if (type === 'Asset') {
        var assetValue = parseInt(annualAssetBreakpoint.value[index].maxAsset)
        annualAssetBreakpoint.value.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.minAsset = greaterThanAssetBreakpoint.value ? assetValue : assetValue > 0 ? assetValue : 0
            element.show = true
          }
        })
      } else {
        var partValue = parseInt(participantBreakpoint.value[index].maxAsset)
        participantBreakpoint.value.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.minAsset = greaterThanParticipantBreakpoint.value ? partValue : partValue > 0 ? partValue : 0
            element.show = true
          }
        })
      }
    }
    function removeBlendedRow(i, type) {
      if (type === 'Asset') {
        var check = annualAssetBlended.value.filter((a) => a.show === true)
        if (check.length === 1) return
        annualAssetBlended.value.forEach((element, index) => {
          if (i === index) {
            element.show = false
            annualAssetsBlended.value.splice(i, 1)
            annualAssetsBlended.value.push({
              hideMaxAsset: true,
              show: false,
              minimumAssetFees: 0,
              asset: 0,
              percent: 0,
              assetBasedError: false
            })
          }
        })
        if (i > 0 && i !== 5) {
          if (greaterThanAssetBlended.value) {
            var check1 = annualAssetsBlended.value.filter((a) => a.show)
            if (check1.length - 1 === i) {
              annualAssetsBlended.value[i].minimumAssetFees = parseInt(annualAssetsBlended.value[i - 1].asset)
            } else {
              annualAssetsBlended.value[i].minimumAssetFees = parseInt(annualAssetsBlended.value[i - 1].asset)
            }
          } else {
            annualAssetsBlended.value[i].minimumAssetFees = parseInt(annualAssetsBlended.value[i - 1].asset)
          }
        }
        if (i === 5) {
          if (greaterThanAssetBlended.value) {
            annualAssetsBlended.value[i - 1].minimumAssetFees = parseInt(annualAssetsBlended.value[i - 2].asset)
            annualAssetsBlended.value[i - 1].hideMaxAsset = false
          } else {
            annualAssetsBlended.value[i - 1].minimumAssetFees = parseInt(annualAssetsBlended.value[i - 2].asset)
            annualAssetsBlended.value[i - 1].hideMaxAsset = true
          }
        }
      } else {
        var checked = participantBlended.value.filter((a) => a.show === true)
        if (checked.length === 1) return
        participantBlended.value.forEach((element, index) => {
          if (i === index) {
            element.show = false
            participantsBlended.value.splice(i, 1)
            participantsBlended.value.push({
              hideMaxAsset: true,
              show: false,
              minParticipantAsset: 0,
              asset: 0,
              percent: 0,
              base: 0,
              participantBasedError: false
            })
          }
        })
        if (i > 0 && i !== 5) {
          if (greaterThanParticipantBlended.value) {
            var check2 = participantsBlended.value.filter((a) => a.show)
            if (check2.length - 1 === i) {
              participantsBlended.value[i].minParticipantAsset = parseInt(participantsBlended.value[i - 1].asset)
            } else {
              participantsBlended.value[i].minParticipantAsset = parseInt(participantsBlended.value[i - 1].asset)
            }
          } else {
            participantsBlended.value[i].minParticipantAsset = parseInt(participantsBlended.value[i - 1].asset)
          }
        }
        if (i === 5) {
          if (greaterThanParticipantBlended.value) {
            participantsBlended.value[i - 1].minParticipantAsset = parseInt(participantsBlended.value[i - 2].asset)
            participantsBlended.value[i - 1].hideMaxAsset = false
          } else {
            participantsBlended.value[i - 1].minParticipantAsset = parseInt(participantsBlended.value[i - 2].asset)
            participantsBlended.value[i - 1].hideMaxAsset = true
          }
        }
      }
    }
    function removeBreakpointRow(i, type) {
      if (type === 'Asset') {
        var check = annualAssetBreakpoint.value.filter((a) => a.show === true)
        if (check.length === 1) return
        annualAssetBreakpoint.value.forEach((element, index) => {
          if (i === index) {
            element.show = false
            annualAssetsBreakpoint.value.splice(i, 1)
            annualAssetsBreakpoint.value.push({
              hideMaxAsset: true,
              show: false,
              minAsset: 0,
              maxAsset: 0,
              breakpointPercent: 0,
              assetBasedError: false
            })
          }
        })
        if (i > 0 && i !== 5) {
          if (greaterThanAssetBreakpoint.value) {
            var checkVal = annualAssetsBreakpoint.value.filter((a) => a.show)
            if (checkVal.length - 1 === i) {
              annualAssetsBreakpoint.value[i].minAsset = parseInt(annualAssetsBreakpoint.value[i - 1].maxAsset)
            } else {
              annualAssetsBreakpoint.value[i].minAsset = parseInt(annualAssetsBreakpoint.value[i - 1].maxAsset)
            }
          } else {
            annualAssetsBreakpoint.value[i].minAsset = parseInt(annualAssetsBreakpoint.value[i - 1].maxAsset)
          }
        }
        if (i === 5) {
          if (greaterThanAssetBreakpoint.value) {
            annualAssetsBreakpoint.value[i - 1].minAsset = parseInt(annualAssetsBreakpoint.value[i - 2].maxAsset)
            annualAssetsBreakpoint.value[i - 1].hideMaxAsset = false
          } else {
            annualAssetsBreakpoint.value[i - 1].minAsset = parseInt(annualAssetsBreakpoint.value[i - 2].maxAsset)
            annualAssetsBreakpoint.value[i - 1].hideMaxAsset = true
          }
        }
      } else {
        var checked = participantBreakpoint.value.filter((a) => a.show === true)
        if (checked.length === 1) return
        participantBreakpoint.value.forEach((element, index) => {
          if (i === index) {
            element.show = false
            participantsBreakpoint.value.splice(i, 1)
            participantsBreakpoint.value.push({
              hideMaxAsset: true,
              show: false,
              minAsset: 0,
              maxAsset: 0,
              breakpointPercent: 0,
              base: 0,
              participantBasedError: false
            })
          }
        })
        if (i > 0 && i !== 5) {
          if (greaterThanParticipantBreakpoint.value) {
            var check1 = participantBreakpoint.value.filter((a) => a.show)
            if (check1.length - 1 === i) {
              participantBreakpoint.value[i].minAsset = parseInt(participantBreakpoint.value[i - 1].maxAsset)
            } else {
              participantBreakpoint.value[i].minAsset = parseInt(participantBreakpoint.value[i - 1].maxAsset)
            }
          } else {
            participantBreakpoint.value[i].minAsset = parseInt(participantBreakpoint.value[i - 1].maxAsset)
          }
        }
        if (i === 5) {
          if (greaterThanParticipantBreakpoint.value) {
            participantBreakpoint.value[i - 1].minAsset = parseInt(participantBreakpoint.value[i - 2].maxAsset)
            participantBreakpoint.value[i - 1].hideMaxAsset = false
          } else {
            participantBreakpoint.value[i - 1].minAsset = parseInt(participantBreakpoint.value[i - 2].maxAsset)
            participantBreakpoint.value[i - 1].hideMaxAsset = true
          }
        }
      }
    }
    function SaveSchedule() {
      // Validation check
      hasError.value = false
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if (!scheduleType.value) {
          scheduleTypeError.value = true
          scheduleTypeErrorMsg.value = 'Schedule Type is required'
          hasError.value = true
        }
      }
      if (feeScheduleName.value === '') {
        scheduleNameError.value = true
        scheduleNameErrorMsg.value = 'Fee Schedule Name is required'
        hasError.value = true
      }
      var maxFees = Intl.NumberFormat().format(maximumAdvisoryFees.value)
      if (scheduleType.value && scheduleType.value === 'Advisory' && maximumAdvisoryFees.value > 0) {
        if (parseFloat(maximumFees.value) !== 0) {
          if (parseFloat(maximumFees.value) > parseFloat(maximumAdvisoryFees.value)) {
            maximumFeesError.value = true
            maximumFeesErrorMsg.value = `Maximum fee should not exceed $${maxFees}`
            hasError.value = true
          }
        }
      }
      if (parseFloat(maximumFees.value) !== 0) {
        if (parseFloat(maximumFees.value) <= parseFloat(minimumFees.value)) {
          maximumFeesError.value = true
          maximumFeesErrorMsg.value = 'Maximum fee should be greater than Minimum fee'
          hasError.value = true
        }
      }
      if (scheduleType.value && scheduleType.value === 'Custodian') {
        if (!custodian.value) {
          custodianError.value = true
          custodianErrorMsg.value = 'Trustee / Custodian is required'
          hasError.value = true
        }
        if (!subCustodian.value) {
          if (custodian.value && custodian.value === 'AdvisorTrust') {
            subCustodianError.value = true
            subCustodianErrorMsg.value = 'Sub-Custodian is required'
            hasError.value = true
          }
        }
      }
      if (hasError.value) {
        if (props.fromPage !== 'serviceProvider') window.scrollTo(0, 0)
        else feeContainerModel.value.scrollTop = 0
        return
      }
      if (
        $authz.hasRole($authz.roles.SiteAdmin) ||
        $authz.hasRole($authz.roles.ProgramAdmin) ||
        $authz.hasRole($authz.roles.FirmAdmin) ||
        $authz.hasRole($authz.roles.InternalAdmin)
      ) {
        if (selectedUserListValue.value.length === 0 && !allUsers.value && scheduleType.value) {
          $toast?.destroy()
          if (props.fromPage !== 'serviceProvider') window.scrollTo(0, addUserSection.value.offsetTop)
          else feeContainerModel.value.scrollTop = addUserSection.value.offsetTop

          searchUsersError.value = true
          searchUsersErrorMsg.value = 'Users are required'

          return false
        }
      }

      var schedule = {}
      // Header Details
      schedule.Id = id.value
      schedule.Name = feeScheduleName.value
      schedule.part1Base = part1Base.value ? parseFloat(part1Base.value) : 0
      schedule.Provider = ''
      schedule.PlanTypes = Array.isArray(planType.value)
        ? planType.value.length > 0
          ? planType.value
          : []
        : planType.value
          ? [planType.value]
          : []
      schedule.MinFee = minimumFees.value === '' ? 0.0 : parseFloat(minimumFees.value)
      schedule.MaximumFee = maximumFees.value === '' ? 0.0 : parseFloat(maximumFees.value)
      schedule.AnnualAssets = isAnnualAsset.value ? 1 : 0
      schedule.BaseFee = isBaseFee.value ? 1 : 0
      schedule.AnnualParticipant = isParticipantFee.value ? 1 : 0
      schedule.BaseFeeCharge = baseFee.value === '' ? 0 : parseFloat(baseFee.value)
      schedule.AssetStructure = annualAssetType.value === 'Tiered Fees' ? 0 : 1
      schedule.Active = isActive.value === 1 ? true : false
      schedule.PartStructure = partStructureType.value === 'Tiered Fees' ? 0 : 1
      schedule.ScheduleType = scheduleType.value
      schedule.WaivedParticipants = waivedParticipants.value === '' ? 0 : parseFloat(waivedParticipants.value)
      schedule.AssetFeeMin = assetFeeMin.value === '' ? 0 : parseFloat(assetFeeMin.value)
      schedule.ParticipantFeeMin = participantFeeMin.value === '' ? 0 : parseFloat(participantFeeMin.value)
      schedule.Users = selectedUserListValue.value.length > 0 ? selectedUserListValue.value.join(';') : ''
      schedule.FootnoteTxt = footNoteText.value
      schedule.SEINPNO = selectedPlanListValue.value.length > 0 ? selectedPlanListValue.value.join(';') : ''
      schedule.ConversionFee = conversion.value === '' ? 0 : parseFloat(conversion.value)
      schedule.DocumentFee = document.value === '' ? 0 : parseFloat(document.value)
      schedule.InstallationFee = installation.value === '' ? 0 : parseFloat(installation.value)
      schedule.TrusteeCustodian = custodian.value
      schedule.SubCustodian = subCustodian.value
      schedule.ETFSchedule = etfSchedule.value ? etfSchedule.value : 0
      schedule.RKBaseHeader = baseHeader.value
      schedule.RKParticipantHeader = participantHeader.value
      schedule.RKAssetHeader = assetHeader.value
      schedule.Startups = selectedStartupsValue.value.length > 0 ? selectedStartupsValue.value.join(';') : ''
      schedule.BusinessType = businessType.value
      schedule.DefaultFeeSchedule = isDefault.value
      schedule.AllUsers =
        selectedUserListValue.value.length === 0 && !allUsers.value && scheduleType.value ? true : allUsers.value
      if (isAnnualAsset.value) {
        //Asset Tier fees Details
        if (annualAssetType.value === 'Tiered Fees') {
          annualAssetsBlended.value.map((element) => {
            if (element.minimumAssetFees === '') element.minimumAssetFees = 0
            if (element.asset === '') element.asset = 0
            if (element.percent === '') element.percent = 0
          })
          schedule.AssetFee1 = {
            Min: 0,
            Max: annualAssetsBlended.value[0].show ? parseInt(annualAssetsBlended.value[0].asset) : 0,
            FeePct: isNaN(parseFloat(annualAssetsBlended.value[0].percent))
              ? 0
              : annualAssetsBlended.value[0].show
                ? annualAssetsBlended.value[0].percent
                : 0
          }
          schedule.AssetFee2 = {
            Min:
              parseInt(annualAssetsBlended.value[0].asset) === 0 && parseFloat(annualAssetsBlended.value[0].percent) === 0
                ? 0
                : annualAssetsBlended.value[1].show
                  ? parseInt(annualAssetsBlended.value[1].minimumAssetFees)
                  : 0,
            Max:
              parseInt(annualAssetsBlended.value[1].asset) === 0
                ? 0
                : annualAssetsBlended.value[1].show
                  ? parseInt(annualAssetsBlended.value[1].asset)
                  : 0,
            FeePct: annualAssetsBlended.value[1].show ? annualAssetsBlended.value[1].percent : 0
          }
          schedule.AssetFee3 = {
            Min:
              parseInt(annualAssetsBlended.value[1].asset) === 0 && parseFloat(annualAssetsBlended.value[1].percent) === 0
                ? 0
                : annualAssetsBlended.value[2].show
                  ? parseInt(annualAssetsBlended.value[2].minimumAssetFees)
                  : 0,
            Max:
              parseInt(annualAssetsBlended.value[2].asset) === 0
                ? 0
                : annualAssetsBlended.value[2].show
                  ? parseInt(annualAssetsBlended.value[2].asset)
                  : 0,
            FeePct: annualAssetsBlended.value[2].show ? annualAssetsBlended.value[2].percent : 0
          }
          schedule.AssetFee4 = {
            Min:
              parseInt(annualAssetsBlended.value[2].asset) === 0 && parseFloat(annualAssetsBlended.value[2].percent) === 0
                ? 0
                : annualAssetsBlended.value[3].show
                  ? parseInt(annualAssetsBlended.value[3].minimumAssetFees)
                  : 0,
            Max:
              parseInt(annualAssetsBlended.value[3].asset) === 0
                ? 0
                : annualAssetsBlended.value[3].show
                  ? parseInt(annualAssetsBlended.value[3].asset)
                  : 0,
            FeePct: annualAssetsBlended.value[3].show ? annualAssetsBlended.value[3].percent : 0
          }
          schedule.AssetFee5 = {
            Min:
              parseInt(annualAssetsBlended.value[3].asset) === 0 && parseFloat(annualAssetsBlended.value[3].percent) === 0
                ? 0
                : annualAssetsBlended.value[4].show
                  ? parseInt(annualAssetsBlended.value[4].minimumAssetFees)
                  : 0,
            Max:
              parseInt(annualAssetsBlended.value[4].asset) === 0
                ? 0
                : annualAssetsBlended.value[4].show
                  ? parseInt(annualAssetsBlended.value[4].asset)
                  : 0,
            FeePct: annualAssetsBlended.value[4].show ? annualAssetsBlended.value[4].percent : 0
          }
          schedule.AssetFee6 = {
            Min:
              parseInt(annualAssetsBlended.value[4].asset) === 0 && parseFloat(annualAssetsBlended.value[4].percent) === 0
                ? 0
                : annualAssetsBlended.value[5].show
                  ? parseInt(annualAssetsBlended.value[5].minimumAssetFees)
                  : 0,
            Max:
              parseInt(annualAssetsBlended.value[5].asset) === 0
                ? 0
                : annualAssetsBlended.value[5].show
                  ? parseInt(annualAssetsBlended.value[5].asset)
                  : 0,
            FeePct: annualAssetsBlended.value[5].show ? annualAssetsBlended.value[5].percent : 0
          }
        }
        //Asset Linear Fees Details
        if (annualAssetType.value === 'Linear Fee Structure') {
          annualAssetsBreakpoint.value.map((element) => {
            if (element.minAsset === '') element.minAsset = 0
            if (element.maxAsset === '') element.maxAsset = 0
            if (element.breakpointPercent === '') element.breakpointPercent = 0
          })
          schedule.AssetFee1 = {
            Min: annualAssetsBreakpoint.value[0].show ? parseInt(annualAssetsBreakpoint.value[0].minAsset) : 0,
            Max: annualAssetsBreakpoint.value[0].show ? parseInt(annualAssetsBreakpoint.value[0].maxAsset) : 0,
            FeePct: annualAssetsBreakpoint.value[0].show ? annualAssetsBreakpoint.value[0].breakpointPercent : 0
          }
          schedule.AssetFee2 = {
            Min: annualAssetsBreakpoint.value[1].show ? parseInt(annualAssetsBreakpoint.value[1].minAsset) : 0,
            Max: annualAssetsBreakpoint.value[1].show ? parseInt(annualAssetsBreakpoint.value[1].maxAsset) : 0,
            FeePct: annualAssetsBreakpoint.value[1].show ? annualAssetsBreakpoint.value[1].breakpointPercent : 0
          }
          schedule.AssetFee3 = {
            Min: annualAssetsBreakpoint.value[2].show ? parseInt(annualAssetsBreakpoint.value[2].minAsset) : 0,
            Max: annualAssetsBreakpoint.value[2].show ? parseInt(annualAssetsBreakpoint.value[2].maxAsset) : 0,
            FeePct: annualAssetsBreakpoint.value[2].show ? annualAssetsBreakpoint.value[2].breakpointPercent : 0
          }
          schedule.AssetFee4 = {
            Min: annualAssetsBreakpoint.value[3].show ? parseInt(annualAssetsBreakpoint.value[3].minAsset) : 0,
            Max: annualAssetsBreakpoint.value[3].show ? parseInt(annualAssetsBreakpoint.value[3].maxAsset) : 0,
            FeePct: annualAssetsBreakpoint.value[3].show ? annualAssetsBreakpoint.value[3].breakpointPercent : 0
          }
          schedule.AssetFee5 = {
            Min: annualAssetsBreakpoint.value[4].show ? parseInt(annualAssetsBreakpoint.value[4].minAsset) : 0,
            Max: annualAssetsBreakpoint.value[4].show ? parseInt(annualAssetsBreakpoint.value[4].maxAsset) : 0,
            FeePct: annualAssetsBreakpoint.value[4].show ? annualAssetsBreakpoint.value[4].breakpointPercent : 0
          }
          schedule.AssetFee6 = {
            Min: annualAssetsBreakpoint.value[5].show ? parseInt(annualAssetsBreakpoint.value[5].minAsset) : 0,
            Max: annualAssetsBreakpoint.value[5].show ? parseInt(annualAssetsBreakpoint.value[5].maxAsset) : 0,
            FeePct: annualAssetsBreakpoint.value[5].show ? annualAssetsBreakpoint.value[5].breakpointPercent : 0
          }
        }
      }
      if (isParticipantFee.value) {
        //Participant Tier fees Details
        if (partStructureType.value === 'Tiered Fees') {
          participantsBlended.value.map((element) => {
            if (element.minParticipantAsset === '') element.minParticipantAsset = 0
            if (element.asset === '') element.asset = 0
            if (element.percent === '') element.percent = 0
          })
          schedule.ParticipantFee1 = {
            Min: 0,
            Max: parseInt(participantsBlended.value[0].asset),
            FeePct: isNaN(parseFloat(participantsBlended.value[0].percent))
              ? 0
              : parseFloat(participantsBlended.value[0].percent),
            BaseFee: parseFloat(participantsBlended.value[0].base)
          }
          schedule.ParticipantFee2 = {
            Min:
              parseInt(participantsBlended.value[0].asset) === 0
                ? 0
                : participantsBlended.value[1].show
                  ? parseInt(participantsBlended.value[1].minParticipantAsset)
                  : 0,
            Max:
              parseInt(participantsBlended.value[1].asset) === 0
                ? 0
                : participantsBlended.value[1].show
                  ? parseInt(participantsBlended.value[1].asset)
                  : 0,
            FeePct: participantsBlended.value[1].show ? parseFloat(participantsBlended.value[1].percent) : 0,
            BaseFee: participantsBlended.value[1].show ? parseFloat(participantsBlended.value[1].base) : 0
          }
          schedule.ParticipantFee3 = {
            Min:
              parseInt(participantsBlended.value[1].asset) === 0
                ? 0
                : participantsBlended.value[2].show
                  ? parseInt(participantsBlended.value[2].minParticipantAsset)
                  : 0,
            Max:
              parseInt(participantsBlended.value[2].asset) === 0
                ? 0
                : participantsBlended.value[2].show
                  ? parseInt(participantsBlended.value[2].asset)
                  : 0,
            FeePct: participantsBlended.value[2].show ? parseFloat(participantsBlended.value[2].percent) : 0,
            BaseFee: participantsBlended.value[2].show ? parseFloat(participantsBlended.value[2].base) : 0
          }
          schedule.ParticipantFee4 = {
            Min:
              parseInt(participantsBlended.value[2].asset) === 0
                ? 0
                : participantsBlended.value[3].show
                  ? parseInt(participantsBlended.value[3].minParticipantAsset)
                  : 0,
            Max:
              parseInt(participantsBlended.value[3].asset) === 0
                ? 0
                : participantsBlended.value[3].show
                  ? parseInt(participantsBlended.value[3].asset)
                  : 0,
            FeePct: participantsBlended.value[3].show ? parseFloat(participantsBlended.value[3].percent) : 0,
            BaseFee: participantsBlended.value[3].show ? parseFloat(participantsBlended.value[3].base) : 0
          }
          schedule.ParticipantFee5 = {
            Min:
              parseInt(participantsBlended.value[3].asset) === 0
                ? 0
                : participantsBlended.value[4].show
                  ? parseInt(participantsBlended.value[4].minParticipantAsset)
                  : 0,
            Max:
              parseInt(participantsBlended.value[4].asset) === 0
                ? 0
                : participantsBlended.value[4].show
                  ? parseInt(participantsBlended.value[4].asset)
                  : 0,
            FeePct: participantsBlended.value[4].show ? participantsBlended.value[4].percent : 0,
            BaseFee: participantsBlended.value[4].show ? parseFloat(participantsBlended.value[4].base) : 0
          }
          schedule.ParticipantFee6 = {
            Min:
              parseInt(participantsBlended.value[4].asset) === 0
                ? 0
                : participantsBlended.value[5].show
                  ? parseInt(participantsBlended.value[5].minParticipantAsset)
                  : 0,
            Max:
              parseInt(participantsBlended.value[5].asset) === 0
                ? 0
                : participantsBlended.value[5].show
                  ? parseInt(participantsBlended.value[5].asset)
                  : 0,
            FeePct: participantsBlended.value[5].show ? participantsBlended.value[5].percent : 0,
            BaseFee: participantsBlended.value[5].show ? parseFloat(participantsBlended.value[5].base) : 0
          }
        }
        //Participant Linear Fees Details
        if (partStructureType.value === 'Linear Fee Structure') {
          participantsBreakpoint.value.map((element) => {
            if (element.minAsset === '') element.minAsset = 0
            if (element.maxAsset === '') element.maxAsset = 0
            if (element.breakpointPercent === '') element.breakpointPercent = 0
          })
          schedule.ParticipantFee1 = {
            Min: participantsBreakpoint.value[0].show ? parseInt(participantsBreakpoint.value[0].minAsset) : 0,
            Max: participantsBreakpoint.value[0].show ? parseInt(participantsBreakpoint.value[0].maxAsset) : 0,
            FeePct: participantsBreakpoint.value[0].show ? participantsBreakpoint.value[0].breakpointPercent : 0,
            BaseFee: participantsBreakpoint.value[0].show ? parseFloat(participantsBreakpoint.value[0].base) : 0
          }
          schedule.ParticipantFee2 = {
            Min: participantsBreakpoint.value[1].show ? parseInt(participantsBreakpoint.value[1].minAsset) : 0,
            Max: participantsBreakpoint.value[1].show ? parseInt(participantsBreakpoint.value[1].maxAsset) : 0,
            FeePct: participantsBreakpoint.value[1].show ? participantsBreakpoint.value[1].breakpointPercent : 0,
            BaseFee: participantsBreakpoint.value[1].show ? parseFloat(participantsBreakpoint.value[1].base) : 0
          }
          schedule.ParticipantFee3 = {
            Min: participantsBreakpoint.value[2].show ? parseInt(participantsBreakpoint.value[2].minAsset) : 0,
            Max: participantsBreakpoint.value[2].show ? parseInt(participantsBreakpoint.value[2].maxAsset) : 0,
            FeePct: participantsBreakpoint.value[2].show ? participantsBreakpoint.value[2].breakpointPercent : 0,
            BaseFee: participantsBreakpoint.value[2].show ? parseFloat(participantsBreakpoint.value[2].base) : 0
          }
          schedule.ParticipantFee4 = {
            Min: participantsBreakpoint.value[3].show ? parseInt(participantsBreakpoint.value[3].minAsset) : 0,
            Max: participantsBreakpoint.value[3].show ? parseInt(participantsBreakpoint.value[3].maxAsset) : 0,
            FeePct: participantsBreakpoint.value[3].show ? participantsBreakpoint.value[3].breakpointPercent : 0,
            BaseFee: participantsBreakpoint.value[3].show ? parseFloat(participantsBreakpoint.value[3].base) : 0
          }
          schedule.ParticipantFee5 = {
            Min: participantsBreakpoint.value[4].show ? parseInt(participantsBreakpoint.value[4].minAsset) : 0,
            Max: participantsBreakpoint.value[4].show ? parseInt(participantsBreakpoint.value[4].maxAsset) : 0,
            FeePct: participantsBreakpoint.value[4].show ? participantsBreakpoint.value[4].breakpointPercent : 0,
            BaseFee: participantsBreakpoint.value[4].show ? parseFloat(participantsBreakpoint.value[4].base) : 0
          }
          schedule.ParticipantFee6 = {
            Min: participantsBreakpoint.value[5].show ? parseInt(participantsBreakpoint.value[5].minAsset) : 0,
            Max: participantsBreakpoint.value[5].show ? parseInt(participantsBreakpoint.value[5].maxAsset) : 0,
            FeePct: participantsBreakpoint.value[5].show ? participantsBreakpoint.value[5].breakpointPercent : 0,
            BaseFee: participantsBreakpoint.value[5].show ? parseFloat(participantsBreakpoint.value[5].base) : 0
          }
        }
      }
      if (props.fromPage !== 'serviceProvider') loading.value = true
      else feeContainerModel.value.scrollTop = 0
      if (readOnly.value && $authz.hasRole($authz.roles.InternalAdmin)) {
        var feeScheduleUsers = {
          feescheduleId: schedule.Id,
          AllUsers: schedule.AllUsers,
          Users: schedule.Users
        }

        $axios
          .put(`/api/v1/tal/feescheduleusers`, feeScheduleUsers)
          .then(() => {
            loading.value = false
            eventBus.emit('showFees')
            eventBus.emit('getFee', schedule)
            resetFees()
            if (props.fromPage !== 'serviceProvider') {
              $toast?.destroy()
              $toast.success('Saved Successfully', '')
              window.scrollTo(0, 0)
            }
          })
          .catch(() => {
            loading.value = false
          })
      } else {
        $axios
          .put(`/api/v1/tal/feeschedule`, schedule)
          .then(() => {
            loading.value = false
            eventBus.emit('showFees')
            eventBus.emit('getFee', schedule)
            resetFees()
            if (props.fromPage !== 'serviceProvider') {
              $toast?.destroy()
              $toast.success('Saved Successfully', '')
              window.scrollTo(0, 0)
            }
          })
          .catch(() => {
            loading.value = false
          })
      }
    }
    function editScheduleFee(id) {
      window.scrollTo(0, 0)
      loading.value = true
      assignDefaultAsset()
      $axios
        .get(`/api/v1/tal/feeschedule/${id}`)
        .then((success) => {
          if (success.data.d !== null) {
            id.value = success.data.d.id
            selectedUserListValue.value = success.data.d.users ? success.data.d.users.split(';') : []
            selectedPlanListValue.value = success.data.d.seinpno ? success.data.d.seinpno.split(';') : []
            selectedStartupsValue.value = success.data.d.startups ? success.data.d.startups.split(';') : []
            if (!success.data.d.allUsers) {
              getPlanList(true)
              getStartupPlanList(true)
            }
            feeScheduleName.value = success.data.d.name
            planType.value = success.data.d.planType ? success.data.d.planType : []
            minimumFees.value = success.data.d.minFee
            maximumFees.value = success.data.d.maximumFee
            part1Base.value = success.data.d.part1Base
            isAnnualAsset.value = success.data.d.annualAssets === 1 || success.data.d.assetFee1.max !== 0 ? true : false
            isBaseFee.value = success.data.d.baseFee === 1 ? true : false
            isParticipantFee.value =
              success.data.d.annualParticipant === 1 || success.data.d.participantFee1.max !== 0 ? true : false
            baseFee.value = success.data.d.baseFeeCharge
            annualAssetType.value = success.data.d.assetStructure === 0 ? 'Tiered Fees' : 'Linear Fee Structure'
            isActive.value = success.data.d.active === true ? 1 : 0
            partStructureType.value = success.data.d.partStructure === 0 ? 'Tiered Fees' : 'Linear Fee Structure'
            scheduleType.value = success.data.d.scheduleType
            waivedParticipants.value = success.data.d.waivedParticipants
            assetFeeMin.value = success.data.d.assetFeeMin
            participantFeeMin.value = success.data.d.participantFeeMin
            footNoteText.value = success.data.d.footnoteTxt
            conversion.value = success.data.d.conversionFee
            document.value = success.data.d.documentFee
            installation.value = success.data.d.installationFee
            custodian.value = success.data.d.trusteeCustodian
            subCustodian.value = success.data.d.subCustodian
            etfSchedule.value = success.data.d.etfSchedule
            baseHeader.value = success.data.d.rkBaseHeader
            participantHeader.value = success.data.d.rkParticipantHeader
            assetHeader.value = success.data.d.rkAssetHeader
            businessType.value = success.data.d.businessType
            isDefault.value = success.data.d.defaultFeeSchedule
            allUsers.value = success.data.d.allUsers
            addUser.value = success.data.d.users ? true : false
            addPlan.value = success.data.d.seinpno ? true : false
            addStartup.value = success.data.d.startups ? true : false
            footNote.value = success.data.d.footnoteTxt ? true : false
            //Asset Tired Fee
            if (annualAssetType.value === 'Tiered Fees') {
              if (success.data.d.assetFee1.max !== 0 || success.data.d.assetFee1.feePct !== 0) {
                annualAssetsBlended.value[0].show = true
                annualAssetsBlended.value[0].minimumAssetFees = success.data.d.assetFee1.min
                annualAssetsBlended.value[0].asset = success.data.d.assetFee1.max
                annualAssetsBlended.value[0].percent = success.data.d.assetFee1.feePct
              } else {
                annualAssetsBlended.value[0].show = false
                annualAssetsBlended.value[0].minimumAssetFees = 0
                annualAssetsBlended.value[0].asset = 0
                annualAssetsBlended.value[0].percent = 0
              }
              if (success.data.d.assetFee2.max !== 0 || success.data.d.assetFee2.feePct !== 0) {
                annualAssetsBlended.value[1].show = true
                annualAssetsBlended.value[1].minimumAssetFees = success.data.d.assetFee2.min
                annualAssetsBlended.value[1].asset = success.data.d.assetFee2.max
                annualAssetsBlended.value[1].percent = success.data.d.assetFee2.feePct
              } else {
                annualAssetsBlended.value[1].show = false
                annualAssetsBlended.value[1].minimumAssetFees = 0
                annualAssetsBlended.value[1].asset = 0
                annualAssetsBlended.value[1].percent = 0
              }
              if (success.data.d.assetFee3.max !== 0 || success.data.d.assetFee3.feePct !== 0) {
                annualAssetsBlended.value[2].show = true
                annualAssetsBlended.value[2].minimumAssetFees = success.data.d.assetFee3.min
                annualAssetsBlended.value[2].asset = success.data.d.assetFee3.max !== 0 ? success.data.d.assetFee3.max : 0
                annualAssetsBlended.value[2].percent = success.data.d.assetFee3.feePct
              } else {
                annualAssetsBlended.value[2].show = false
                annualAssetsBlended.value[2].minimumAssetFees = 0
                annualAssetsBlended.value[2].asset = 0
                annualAssetsBlended.value[2].percent = 0
              }
              if (success.data.d.assetFee4.max !== 0 || success.data.d.assetFee4.feePct !== 0) {
                annualAssetsBlended.value[3].show = true
                annualAssetsBlended.value[3].minimumAssetFees = success.data.d.assetFee4.min
                annualAssetsBlended.value[3].asset = success.data.d.assetFee4.max !== 0 ? success.data.d.assetFee4.max : 0
                annualAssetsBlended.value[3].percent = success.data.d.assetFee4.feePct
              } else {
                annualAssetsBlended.value[3].show = false
                annualAssetsBlended.value[3].minimumAssetFees = 0
                annualAssetsBlended.value[3].asset = 0
                annualAssetsBlended.value[3].percent = 0
              }
              if (success.data.d.assetFee5.max !== 0 || success.data.d.assetFee5.feePct !== 0) {
                annualAssetsBlended.value[4].show = true
                annualAssetsBlended.value[4].minimumAssetFees = success.data.d.assetFee5.min
                annualAssetsBlended.value[4].asset = success.data.d.assetFee5.max !== 0 ? success.data.d.assetFee5.max : 0
                annualAssetsBlended.value[4].percent = success.data.d.assetFee5.feePct
              } else {
                annualAssetsBlended.value[4].show = false
                annualAssetsBlended.value[4].minimumAssetFees = 0
                annualAssetsBlended.value[4].asset = 0
                annualAssetsBlended.value[4].percent = 0
              }
              if (success.data.d.assetFee6.max !== 0 || success.data.d.assetFee6.feePct !== 0) {
                annualAssetsBlended.value[5].show = true
                annualAssetsBlended.value[5].minimumAssetFees = success.data.d.assetFee6.min
                annualAssetsBlended.value[5].asset = success.data.d.assetFee6.max !== 0 ? success.data.d.assetFee6.max : 0
                annualAssetsBlended.value[5].percent = success.data.d.assetFee6.feePct
              } else {
                annualAssetsBlended.value[5].show = false
                annualAssetsBlended.value[5].minimumAssetFees = 0
                annualAssetsBlended.value[5].asset = 0
                annualAssetsBlended.value[5].percent = 0
              }
              var checkFees = annualAssetsBlended.value.filter((a) => a.show === true)
              if (checkFees.length === 0) {
                annualAssetsBlended.value.map((element, index) => {
                  if (index < 2) element.show = true
                })
              } else if (checkFees.length === 1) {
                var tiredFee = annualAssetsBlended.value[checkFees.length].minimumAssetFees
                var tiredValue = annualAssetsBlended.value[0]
                if (tiredValue) {
                  greaterThanAssetBlended.value =
                    annualAssetsBlended.value[0].minimumAssetFees === 0 &&
                    annualAssetsBlended.value[0].asset === 0 &&
                    annualAssetsBlended.value[0].percent > 0
                      ? true
                      : false
                  if (greaterThanAssetBlended.value) {
                    disableAssetBlendedFee.value = true
                    annualAssetsBlended.value[checkFees.length - 1].hideMaxAsset = false
                  } else {
                    disableAssetBlendedFee.value = false
                  }
                }
                if (tiredFee === 0) {
                  annualAssetsBlended.value[checkFees.length].minimumAssetFees =
                    annualAssetsBlended.value[checkFees.length - 1].asset
                }
              } else {
                greaterThanAssetBlended.value = annualAssetsBlended.value[checkFees.length - 1].asset === 0 ? true : false
                if (greaterThanAssetBlended.value) {
                  disableAssetBlendedFee.value = true
                  annualAssetsBlended.value[checkFees.length - 1].hideMaxAsset = false
                } else {
                  disableAssetBlendedFee.value = false
                }
              }
            }
            //Asset Linear fee
            if (annualAssetType.value === 'Linear Fee Structure') {
              if (
                success.data.d.assetFee1.max !== 0 ||
                success.data.d.assetFee1.min !== 0 ||
                success.data.d.assetFee1.feePct !== 0
              ) {
                annualAssetsBreakpoint.value[0].show = true
                annualAssetsBreakpoint.value[0].minAsset = success.data.d.assetFee1.min
                annualAssetsBreakpoint.value[0].maxAsset = success.data.d.assetFee1.max
                annualAssetsBreakpoint.value[0].breakpointPercent = success.data.d.assetFee1.feePct
              } else {
                annualAssetsBreakpoint.value[0].show = false
                annualAssetsBreakpoint.value[0].minAsset = 0
                annualAssetsBreakpoint.value[0].maxAsset = 0
                annualAssetsBreakpoint.value[0].breakpointPercent = 0
              }
              if (
                success.data.d.assetFee2.max !== 0 ||
                success.data.d.assetFee2.min !== 0 ||
                success.data.d.assetFee2.feePct !== 0
              ) {
                annualAssetsBreakpoint.value[1].show = true
                annualAssetsBreakpoint.value[1].minAsset = success.data.d.assetFee2.min
                annualAssetsBreakpoint.value[1].maxAsset = success.data.d.assetFee2.max
                annualAssetsBreakpoint.value[1].breakpointPercent = success.data.d.assetFee2.feePct
              } else {
                annualAssetsBreakpoint.value[1].show = false
                annualAssetsBreakpoint.value[1].minAsset = 0
                annualAssetsBreakpoint.value[1].maxAsset = 0
                annualAssetsBreakpoint.value[1].breakpointPercent = 0
              }
              if (
                success.data.d.assetFee3.max !== 0 ||
                success.data.d.assetFee3.min !== 0 ||
                success.data.d.assetFee3.feePct !== 0
              ) {
                annualAssetsBreakpoint.value[2].show = true
                annualAssetsBreakpoint.value[2].minAsset = success.data.d.assetFee3.min
                annualAssetsBreakpoint.value[2].maxAsset = success.data.d.assetFee3.max
                annualAssetsBreakpoint.value[2].breakpointPercent = success.data.d.assetFee3.feePct
              } else {
                annualAssetsBreakpoint.value[2].show = false
                annualAssetsBreakpoint.value[2].minAsset = 0
                annualAssetsBreakpoint.value[2].maxAsset = 0
                annualAssetsBreakpoint.value[2].breakpointPercent = 0
              }
              if (
                success.data.d.assetFee4.max !== 0 ||
                success.data.d.assetFee4.min !== 0 ||
                success.data.d.assetFee4.feePct !== 0
              ) {
                annualAssetsBreakpoint.value[3].show = true
                annualAssetsBreakpoint.value[3].minAsset = success.data.d.assetFee4.min
                annualAssetsBreakpoint.value[3].maxAsset = success.data.d.assetFee4.max
                annualAssetsBreakpoint.value[3].breakpointPercent = success.data.d.assetFee4.feePct
              } else {
                annualAssetsBreakpoint.value[3].show = false
                annualAssetsBreakpoint.value[3].minAsset = 0
                annualAssetsBreakpoint.value[3].maxAsset = 0
                annualAssetsBreakpoint.value[3].breakpointPercent = 0
              }
              if (
                success.data.d.assetFee5.max !== 0 ||
                success.data.d.assetFee5.min !== 0 ||
                success.data.d.assetFee5.feePct !== 0
              ) {
                annualAssetsBreakpoint.value[4].show = true
                annualAssetsBreakpoint.value[4].minAsset = success.data.d.assetFee5.min
                annualAssetsBreakpoint.value[4].maxAsset = success.data.d.assetFee5.max
                annualAssetsBreakpoint.value[4].breakpointPercent = success.data.d.assetFee5.feePct
              } else {
                annualAssetsBreakpoint.value[4].show = false
                annualAssetsBreakpoint.value[4].minAsset = 0
                annualAssetsBreakpoint.value[4].maxAsset = 0
                annualAssetsBreakpoint.value[4].breakpointPercent = 0
              }
              if (
                success.data.d.assetFee6.max !== 0 ||
                success.data.d.assetFee6.min !== 0 ||
                success.data.d.assetFee6.feePct !== 0
              ) {
                annualAssetsBreakpoint.value[5].show = true
                annualAssetsBreakpoint.value[5].minAsset = success.data.d.assetFee6.min
                annualAssetsBreakpoint.value[5].maxAsset = success.data.d.assetFee6.max
                annualAssetsBreakpoint.value[5].breakpointPercent = success.data.d.assetFee6.feePct
              } else {
                annualAssetsBreakpoint.value[5].show = false
                annualAssetsBreakpoint.value[5].minAsset = 0
                annualAssetsBreakpoint.value[5].maxAsset = 0
                annualAssetsBreakpoint.value[5].breakpointPercent = 0
              }

              var checkLinearFees = annualAssetsBreakpoint.value.filter((a) => a.show === true)
              if (checkLinearFees.length === 0) {
                annualAssetsBreakpoint.value.map((element, index) => {
                  if (index < 2) element.show = true
                })
              } else if (checkLinearFees.length === 1) {
                var linearFee = annualAssetsBreakpoint.value[checkLinearFees.length].minAsset
                var linearValue = annualAssetsBreakpoint.value[0]
                if (linearValue) {
                  greaterThanAssetBreakpoint.value =
                    annualAssetsBreakpoint.value[0].minAsset === 0 &&
                    annualAssetsBreakpoint.value[0].maxAsset === 0 &&
                    annualAssetsBreakpoint.value[0].breakpointPercent > 0
                      ? true
                      : false
                  if (greaterThanAssetBreakpoint.value) {
                    disableAssetBreakpointFee.value = true
                    annualAssetsBreakpoint.value[checkLinearFees.length - 1].hideMaxAsset = false
                  } else {
                    disableAssetBreakpointFee.value = false
                  }
                }
                if (linearFee === 0) {
                  annualAssetsBreakpoint.value[checkLinearFees.length].minAsset =
                    annualAssetsBreakpoint.value[checkLinearFees.length - 1].maxAsset
                }
              } else {
                greaterThanAssetBreakpoint.value =
                  annualAssetsBreakpoint.value[checkLinearFees.length - 1].maxAsset === 0 ? true : false
                if (greaterThanAssetBreakpoint.value) {
                  disableAssetBreakpointFee.value = true
                  annualAssetsBreakpoint.value[checkLinearFees.length - 1].hideMaxAsset = false
                } else {
                  disableAssetBreakpointFee.value = false
                }
              }
            }
            //Participant Tired Fee
            if (partStructureType.value === 'Tiered Fees') {
              if (
                success.data.d.participantFee1.max !== 0 ||
                success.data.d.participantFee1.feePct !== 0 ||
                success.data.d.participantFee1.baseFee !== 0
              ) {
                participantsBlended.value[0].show = true
                participantsBlended.value[0].minParticipantAsset = success.data.d.participantFee1.min
                participantsBlended.value[0].asset = success.data.d.participantFee1.max
                participantsBlended.value[0].percent = success.data.d.participantFee1.feePct
                participantsBlended.value[0].base = success.data.d.participantFee1.baseFee
              } else {
                participantsBlended.value[0].show = false
                participantsBlended.value[0].minParticipantAsset = 0
                participantsBlended.value[0].asset = 0
                participantsBlended.value[0].percent = 0
                participantsBlended.value[0].base = 0
              }
              if (
                success.data.d.participantFee2.max !== 0 ||
                success.data.d.participantFee2.feePct !== 0 ||
                success.data.d.participantFee2.baseFee !== 0
              ) {
                participantsBlended.value[1].show = true
                participantsBlended.value[1].minParticipantAsset = success.data.d.participantFee2.min
                participantsBlended.value[1].asset = success.data.d.participantFee2.max
                participantsBlended.value[1].percent = success.data.d.participantFee2.feePct
                participantsBlended.value[1].base = success.data.d.participantFee2.baseFee
              } else {
                participantsBlended.value[1].show = false
                participantsBlended.value[1].minParticipantAsset = 0
                participantsBlended.value[1].asset = 0
                participantsBlended.value[1].percent = 0
                participantsBlended.value[1].base = 0
              }
              if (
                success.data.d.participantFee3.max !== 0 ||
                success.data.d.participantFee3.feePct !== 0 ||
                success.data.d.participantFee3.baseFee !== 0
              ) {
                participantsBlended.value[2].show = true
                participantsBlended.value[2].minParticipantAsset = success.data.d.participantFee3.min
                participantsBlended.value[2].asset =
                  success.data.d.participantFee3.max !== 0 ? success.data.d.participantFee3.max : 0
                participantsBlended.value[2].percent = success.data.d.participantFee3.feePct
                participantsBlended.value[2].base = success.data.d.participantFee3.baseFee
              } else {
                participantsBlended.value[2].show = false
                participantsBlended.value[2].minParticipantAsset = 0
                participantsBlended.value[2].asset = 0
                participantsBlended.value[2].percent = 0
                participantsBlended.value[2].base = 0
              }
              if (
                success.data.d.participantFee4.max !== 0 ||
                success.data.d.participantFee4.feePct !== 0 ||
                success.data.d.participantFee4.baseFee !== 0
              ) {
                participantsBlended.value[3].show = true
                participantsBlended.value[3].minParticipantAsset = success.data.d.participantFee4.min
                participantsBlended.value[3].asset =
                  success.data.d.participantFee4.max !== 0 ? success.data.d.participantFee4.max : 0
                participantsBlended.value[3].percent = success.data.d.participantFee4.feePct
                participantsBlended.value[3].base = success.data.d.participantFee4.baseFee
              } else {
                participantsBlended.value[3].show = false
                participantsBlended.value[3].minParticipantAsset = 0
                participantsBlended.value[3].asset = 0
                participantsBlended.value[3].percent = 0
                participantsBlended.value[3].base = 0
              }
              if (
                success.data.d.participantFee5.max !== 0 ||
                success.data.d.participantFee5.feePct !== 0 ||
                success.data.d.participantFee5.baseFee !== 0
              ) {
                participantsBlended.value[4].show = true
                participantsBlended.value[4].minParticipantAsset = success.data.d.participantFee5.min
                participantsBlended.value[4].asset =
                  success.data.d.participantFee5.max !== 0 ? success.data.d.participantFee5.max : 0
                participantsBlended.value[4].percent = success.data.d.participantFee5.feePct
                participantsBlended.value[4].base = success.data.d.participantFee5.baseFee
              } else {
                participantsBlended.value[4].show = false
                participantsBlended.value[4].minParticipantAsset = 0
                participantsBlended.value[4].asset = 0
                participantsBlended.value[4].percent = 0
                participantsBlended.value[4].base = 0
              }
              if (
                success.data.d.participantFee6.max !== 0 ||
                success.data.d.participantFee6.feePct !== 0 ||
                success.data.d.participantFee6.baseFee !== 0
              ) {
                participantsBlended.value[5].show = true
                participantsBlended.value[5].minParticipantAsset = success.data.d.participantFee6.min
                participantsBlended.value[5].asset =
                  success.data.d.participantFee6.max !== 0 ? success.data.d.participantFee6.max : 0
                participantsBlended.value[5].percent = success.data.d.participantFee6.feePct
                participantsBlended.value[5].base = success.data.d.participantFee6.baseFee
              } else {
                participantsBlended.value[5].show = false
                participantsBlended.value[5].minParticipantAsset = 0
                participantsBlended.value[5].asset = 0
                participantsBlended.value[5].percent = 0
                participantsBlended.value[5].base = 0
              }
              var checkedFees = participantsBlended.value.filter((a) => a.show === true)
              if (checkedFees.length === 0) {
                participantsBlended.value.map((element, index) => {
                  if (index < 2) element.show = true
                })
              } else if (checkedFees.length === 1) {
                var participantTiredFee = participantsBlended.value[checkedFees.length].minParticipantAsset
                var partTiredValue = participantsBlended.value[0]
                if (partTiredValue) {
                  greaterThanParticipantBlended.value =
                    participantsBlended.value[0].minParticipantAsset === 0 &&
                    participantsBlended.value[0].asset === 0 &&
                    participantsBlended.value[0].percent > 0
                      ? true
                      : false
                  if (greaterThanParticipantBlended.value) {
                    disableParticipantBlendedFee.value = true
                    participantsBlended.value[checkedFees.length - 1].hideMaxAsset = false
                  } else {
                    disableParticipantBlendedFee.value = false
                  }
                }
                if (participantTiredFee === 0) {
                  participantsBlended.value[checkedFees.length].minParticipantAsset =
                    participantsBlended.value[checkedFees.length - 1].asset
                }
              } else {
                greaterThanParticipantBlended.value = participantsBlended.value[checkedFees.length - 1].asset === 0 ? true : false
                if (greaterThanParticipantBlended.value) {
                  disableParticipantBlendedFee.value = true
                  participantsBlended.value[checkedFees.length - 1].hideMaxAsset = false
                } else {
                  disableParticipantBlendedFee.value = false
                }
              }
            }
            //Participant Linear Fee
            if (partStructureType.value === 'Linear Fee Structure') {
              if (
                success.data.d.participantFee1.max !== 0 ||
                success.data.d.participantFee1.min !== 0 ||
                success.data.d.participantFee1.feePct !== 0 ||
                success.data.d.participantFee1.baseFee !== 0
              ) {
                participantsBreakpoint.value[0].show = true
                participantsBreakpoint.value[0].minAsset = success.data.d.participantFee1.min
                participantsBreakpoint.value[0].maxAsset = success.data.d.participantFee1.max
                participantsBreakpoint.value[0].breakpointPercent = success.data.d.participantFee1.feePct
                participantsBreakpoint.value[0].base = success.data.d.participantFee1.baseFee
              } else {
                participantsBreakpoint.value[0].show = false
                participantsBreakpoint.value[0].minAsset = 0
                participantsBreakpoint.value[0].maxAsset = 0
                participantsBreakpoint.value[0].breakpointPercent = 0
                participantsBreakpoint.value[0].base = 0
              }
              if (
                success.data.d.participantFee2.max !== 0 ||
                success.data.d.participantFee2.min !== 0 ||
                success.data.d.participantFee2.feePct !== 0 ||
                success.data.d.participantFee2.baseFee !== 0
              ) {
                participantsBreakpoint.value[1].show = true
                participantsBreakpoint.value[1].minAsset = success.data.d.participantFee2.min
                participantsBreakpoint.value[1].maxAsset = success.data.d.participantFee2.max
                participantsBreakpoint.value[1].breakpointPercent = success.data.d.participantFee2.feePct
                participantsBreakpoint.value[1].base = success.data.d.participantFee2.baseFee
              } else {
                participantsBreakpoint.value[1].show = false
                participantsBreakpoint.value[1].minAsset = 0
                participantsBreakpoint.value[1].maxAsset = 0
                participantsBreakpoint.value[1].breakpointPercent = 0
                participantsBreakpoint.value[1].base = 0
              }
              if (
                success.data.d.participantFee3.max !== 0 ||
                success.data.d.participantFee3.min !== 0 ||
                success.data.d.participantFee3.feePct !== 0 ||
                success.data.d.participantFee3.baseFee !== 0
              ) {
                participantsBreakpoint.value[2].show = true
                participantsBreakpoint.value[2].minAsset = success.data.d.participantFee3.min
                participantsBreakpoint.value[2].maxAsset = success.data.d.participantFee3.max
                participantsBreakpoint.value[2].breakpointPercent = success.data.d.participantFee3.feePct
                participantsBreakpoint.value[2].base = success.data.d.participantFee3.baseFee
              } else {
                participantsBreakpoint.value[2].show = false
                participantsBreakpoint.value[2].minAsset = 0
                participantsBreakpoint.value[2].maxAsset = 0
                participantsBreakpoint.value[2].breakpointPercent = 0
                participantsBreakpoint.value[2].base = 0
              }
              if (
                success.data.d.participantFee4.max !== 0 ||
                success.data.d.participantFee4.min !== 0 ||
                success.data.d.participantFee4.feePct !== 0 ||
                success.data.d.participantFee4.baseFee !== 0
              ) {
                participantsBreakpoint.value[3].show = true
                participantsBreakpoint.value[3].minAsset = success.data.d.participantFee4.min
                participantsBreakpoint.value[3].maxAsset = success.data.d.participantFee4.max
                participantsBreakpoint.value[3].breakpointPercent = success.data.d.participantFee4.feePct
                participantsBreakpoint.value[3].base = success.data.d.participantFee4.baseFee
              } else {
                participantsBreakpoint.value[3].show = false
                participantsBreakpoint.value[3].minAsset = 0
                participantsBreakpoint.value[3].maxAsset = 0
                participantsBreakpoint.value[3].breakpointPercent = 0
                participantsBreakpoint.value[3].base = 0
              }
              if (
                success.data.d.participantFee5.max !== 0 ||
                success.data.d.participantFee5.min !== 0 ||
                success.data.d.participantFee5.feePct !== 0 ||
                success.data.d.participantFee5.baseFee !== 0
              ) {
                participantsBreakpoint.value[4].show = true
                participantsBreakpoint.value[4].minAsset = success.data.d.participantFee5.min
                participantsBreakpoint.value[4].maxAsset = success.data.d.participantFee5.max
                participantsBreakpoint.value[4].breakpointPercent = success.data.d.participantFee5.feePct
                participantsBreakpoint.value[4].base = success.data.d.participantFee5.baseFee
              } else {
                participantsBreakpoint.value[4].show = false
                participantsBreakpoint.value[4].minAsset = 0
                participantsBreakpoint.value[4].maxAsset = 0
                participantsBreakpoint.value[4].breakpointPercent = 0
                participantsBreakpoint.value[4].base = 0
              }
              if (
                success.data.d.participantFee6.max !== 0 ||
                success.data.d.participantFee6.min !== 0 ||
                success.data.d.participantFee6.feePct !== 0 ||
                success.data.d.participantFee6.baseFee !== 0
              ) {
                participantsBreakpoint.value[5].show = true
                participantsBreakpoint.value[5].minAsset = success.data.d.participantFee6.min
                participantsBreakpoint.value[5].maxAsset = success.data.d.participantFee6.max
                participantsBreakpoint.value[5].breakpointPercent = success.data.d.participantFee6.feePct
                participantsBreakpoint.value[5].base = success.data.d.participantFee6.baseFee
              } else {
                participantsBreakpoint.value[5].show = false
                participantsBreakpoint.value[5].minAsset = 0
                participantsBreakpoint.value[5].maxAsset = 0
                participantsBreakpoint.value[5].breakpointPercent = 0
                participantsBreakpoint.value[5].base = 0
              }

              var checkParticipantFees = participantsBreakpoint.value.filter((a) => a.show === true)
              if (checkParticipantFees.length === 0) {
                participantsBreakpoint.value.map((element, index) => {
                  if (index < 2) element.show = true
                })
              } else if (checkParticipantFees.length === 1) {
                var participantLinearFee = participantsBreakpoint.value[checkParticipantFees.length].minAsset
                var partLinearValue = participantsBreakpoint.value[0]
                if (partLinearValue) {
                  greaterThanParticipantBreakpoint.value =
                    participantsBreakpoint.value[0].minAsset === 0 &&
                    participantsBreakpoint.value[0].maxAsset === 0 &&
                    participantsBreakpoint.value[0].breakpointPercent > 0
                      ? true
                      : false
                  if (greaterThanParticipantBreakpoint.value) {
                    disableParticipantBreakpointFee.value = true
                    participantsBreakpoint.value[checkParticipantFees.length - 1].hideMaxAsset = false
                  } else {
                    disableParticipantBreakpointFee.value = false
                  }
                }
                if (participantLinearFee === 0) {
                  participantsBreakpoint.value[checkParticipantFees.length].minAsset =
                    participantsBreakpoint.value[checkParticipantFees.length - 1].maxAsset
                }
              } else {
                greaterThanParticipantBreakpoint.value =
                  participantsBreakpoint.value[checkParticipantFees.length - 1].maxAsset === 0 ? true : false
                if (greaterThanParticipantBreakpoint.value) {
                  disableParticipantBreakpointFee.value = true
                  participantsBreakpoint.value[checkParticipantFees.length - 1].hideMaxAsset = false
                } else {
                  disableParticipantBreakpointFee.value = false
                }
              }
            }
            loading.value = false
          } else if (success.data.message) {
            eventBus.emit('showFees')
            loading.value = false
          }
        })
        .catch(() => {
          loading.value = false
          eventBus.emit('showFees')
        })
    }
    function resetFees() {
      isDefault.value = false
      minimumFees.value = 0
      maximumFees.value = 0
      feeScheduleName.value = ''
      isAnnualAsset.value = false
      isBaseFee.value = false
      blended.value = false
      breakpoint.value = false
      baseFee.value = 0
      scheduleNameErrorMsg.value = ''
      scheduleNameError.value = false
      searchUsersErrorMsg.value = ''
      searchUsersError.value = false
      annualAssetType.value = 'Linear Fee Structure'
      partStructureType.value = 'Linear Fee Structure'
      id.value = 0
      isActive.value = 1
      scheduleType.value = ''
      isParticipantFee.value = false
      assetFeeMin.value = 0
      participantFeeMin.value = 0
      waivedParticipants.value = 0
      annualAssetsBlended.value = [
        {
          Id: 1,
          hideMaxAsset: true,
          show: true,
          minimumAssetFees: 0,
          asset: 0,
          percent: 0,
          assetBasedError: false
        },
        {
          Id: 2,
          hideMaxAsset: true,
          show: true,
          minimumAssetFees: 0,
          asset: 0,
          percent: 0,
          assetBasedError: false
        },
        {
          Id: 3,
          hideMaxAsset: true,
          show: false,
          minimumAssetFees: 0,
          asset: 0,
          assetBasedError: false,
          percent: 0
        },
        {
          Id: 4,
          hideMaxAsset: true,
          show: false,
          minimumAssetFees: 0,
          asset: 0,
          assetBasedError: false,
          percent: 0
        },
        {
          Id: 5,
          hideMaxAsset: true,
          show: false,
          minimumAssetFees: 0,
          asset: 0,
          assetBasedError: false,
          percent: 0
        },
        {
          Id: 6,
          hideMaxAsset: true,
          show: false,
          minimumAssetFees: 0,
          asset: 0,
          assetBasedError: false,
          percent: 0
        }
      ]
      annualAssetsBreakpoint.value = [
        {
          Id: 1,
          hideMaxAsset: true,
          show: true,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          assetBasedError: false
        },
        {
          Id: 2,
          hideMaxAsset: true,
          show: true,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          assetBasedError: false
        },
        {
          Id: 3,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          assetBasedError: false
        },
        {
          Id: 4,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          assetBasedError: false
        },
        {
          Id: 5,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          assetBasedError: false
        },
        {
          Id: 6,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          assetBasedError: false
        }
      ]
      participantsBlended.value = [
        {
          Id: 1,
          hideMaxAsset: true,
          show: true,
          minParticipantAsset: 0,
          asset: 0,
          percent: 0,
          participantBasedError: false,
          base: 0
        },
        {
          Id: 2,
          hideMaxAsset: true,
          show: true,
          minParticipantAsset: 0,
          asset: 0,
          percent: 0,
          participantBasedError: false,
          base: 0
        },
        {
          Id: 3,
          hideMaxAsset: true,
          show: false,
          minParticipantAsset: 0,
          asset: 0,
          percent: 0,
          participantBasedError: false,
          base: 0
        },
        {
          Id: 4,
          hideMaxAsset: true,
          show: false,
          minParticipantAsset: 0,
          asset: 0,
          percent: 0,
          participantBasedError: false,
          base: 0
        },
        {
          Id: 5,
          hideMaxAsset: true,
          show: false,
          minParticipantAsset: 0,
          asset: 0,
          percent: 0,
          participantBasedError: false,
          base: 0
        },
        {
          Id: 6,
          hideMaxAsset: true,
          show: false,
          minParticipantAsset: 0,
          asset: 0,
          percent: 0,
          participantBasedError: false,
          base: 0
        }
      ]
      participantsBreakpoint.value = [
        {
          Id: 1,
          hideMaxAsset: true,
          show: true,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          base: 0,
          participantBasedError: false
        },
        {
          Id: 2,
          hideMaxAsset: true,
          show: true,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          base: 0,
          participantBasedError: false
        },
        {
          Id: 3,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          base: 0,
          participantBasedError: false
        },
        {
          Id: 4,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          base: 0,
          participantBasedError: false
        },
        {
          Id: 5,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          base: 0,
          participantBasedError: false
        },
        {
          Id: 6,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          base: 0,
          participantBasedError: false
        }
      ]
      businessType.value = 'employerSponsored'
      planType.value = []
      addUser.value = false
      addPlan.value = false
      addStartup.value = false
      footNote.value = false
      conversion.value = 0
      document.value = 0
      installation.value = 0
      assetHeader.value = ''
      participantHeader.value = ''
      baseHeader.value = ''
      footNoteText.value = ''
      startup.value = ''
      plan.value = ''
      user.value = ''
      selectedUserListValue.value = []
      custodian.value = ''
      subCustodian.value = ''
      etfSchedule.value = ''
      selectedPlanListValue.value = []
      selectedStartupsValue.value = []
      selectedPlanListText.value = []
      selectedStartupsText.value = []
      allUsers.value = false
      maximumFeesErrorMsg.value = ''
      maximumFeesError.value = false
      markDefaultReadOnly.value = false
      baseFeeErrorMsg.value = ''
      baseFeeError.value = false
      minimumFeeError.value = false
      minimumFeeErrorMsg.value = ''
      part1Base.value = 0
      scheduleTypeError.value = false
      scheduleTypeErrorMsg.value = ''
      defaultAsset.value = []
      greaterThanAssetBlended.value = false
      greaterThanAssetBreakpoint.value = false
      greaterThanParticipantBlended.value = false
      greaterThanParticipantBreakpoint.value = false
      disableParticipantBreakpointFee.value = false
      disableAssetBlendedFee.value = false
      disableAssetBreakpointFee.value = false
      disableParticipantBlendedFee.value = false
      custodianErrorMsg.value = ''
      custodianError.value = false
      subCustodianErrorMsg.value = ''
      subCustodianError.value = false
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
    function checkFeePercent(i, val, type) {
      if (type === 'Asset') {
        if (val === 'linear') {
          var checkMinimumLinearAsset = parseFloat(annualAssetsBreakpoint.value[i].minAsset)

          var checkLinearPercent = parseFloat(annualAssetsBreakpoint.value[i].maxAsset)
          if (isNaN(checkLinearPercent)) annualAssetsBreakpoint.value[i].maxAsset = 0
          else if (checkMinimumLinearAsset === 0 && checkLinearPercent === 0) {
            annualAssetsBreakpoint.value[i].assetBasedError = false
          } else {
            if (checkMinimumLinearAsset >= checkLinearPercent) {
              $toast?.destroy()
              $toast.error(`To Amount should be greater than From Amount`, '')
              annualAssetsBreakpoint.value[i].maxAsset = 0
              annualAssetsBreakpoint.value[i].assetBasedError = true
              return
            } else {
              annualAssetsBreakpoint.value[i].maxAsset = checkLinearPercent
              var assetValue = annualAssetsBreakpoint.value[i]
              if (assetValue) {
                assetValue.assetBasedError = false
                annualAssetsBreakpoint.value.splice(i, 1, assetValue)
              }
            }
            if (i < 5) {
              if (greaterThanAssetBreakpoint.value) {
                var assetBasedBreakpoint = annualAssetBreakpoint.value[i]
                var checkedValue = annualAssetBreakpoint.value.filter((a) => a.show === true && a.maxAsset > 0)
                var assetBasedBreakpointPosition = checkedValue && checkedValue.length > 0 ? checkedValue.length - 1 : 0
                if (assetBasedBreakpointPosition === i) {
                  annualAssetBreakpoint.value[i + 1].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
                  annualAssetBreakpoint.value[i + 1].assetBasedError = false
                  $toast?.destroy()
                } else {
                  annualAssetBreakpoint.value[i + 1].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
                  if (annualAssetBreakpoint.value[i + 1].minAsset >= annualAssetBreakpoint.value[i + 1].maxAsset) {
                    $toast?.destroy()
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetsBreakpoint.value[i + 1].maxAsset = 0
                    annualAssetsBreakpoint.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBreakpoint.value[i + 1].assetBasedError = false
                    $toast?.destroy()
                  }
                }
              } else {
                var linearAssetBasedBreakpoint = annualAssetBreakpoint.value[i]
                var checkedValue1 = annualAssetBreakpoint.value.filter((a) => a.show === true && a.maxAsset > 0)
                annualAssetBreakpoint.value[i + 1].minAsset = parseInt(linearAssetBasedBreakpoint.maxAsset)
                if (checkedValue1.length - 1 !== i) {
                  if (annualAssetBreakpoint.value[i + 1].minAsset >= annualAssetBreakpoint.value[i + 1].maxAsset) {
                    $toast?.destroy()
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetsBreakpoint.value[i + 1].maxAsset = 0
                    annualAssetsBreakpoint.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBreakpoint.value[i + 1].assetBasedError = false
                    $toast?.destroy()
                  }
                } else {
                  annualAssetBreakpoint.value[i + 1].assetBasedError = false
                  $toast?.destroy()
                }
              }
            }
          }
        } else {
          var checkMinimumTieredAsset = parseFloat(annualAssetBlended.value[i].minimumAssetFees)
          var checkTieredPercent = parseFloat(annualAssetBlended.value[i].asset)
          if (isNaN(checkTieredPercent)) annualAssetBlended.value[i].asset = 0
          else if (checkMinimumTieredAsset === 0 && checkTieredPercent === 0) {
            annualAssetBlended.value[i].assetBasedError = false
          } else {
            if (checkMinimumTieredAsset >= checkTieredPercent) {
              $toast?.destroy()
              $toast.error(`To Amount should be greater than From Amount`, '')
              annualAssetBlended.value[i].asset = 0
              annualAssetBlended.value[i].assetBasedError = true
              return
            } else {
              annualAssetBlended.value[i].asset = checkTieredPercent
              var tieredAssetValue = annualAssetBlended.value[i]
              if (tieredAssetValue) {
                tieredAssetValue.assetBasedError = false
                annualAssetBlended.value.splice(i, 1, tieredAssetValue)
              }
            }
            if (i < 5) {
              if (greaterThanAssetBlended.value) {
                var tieredAssetBasedBreakpoint = annualAssetBlended.value[i]
                var checkedTieredValue = annualAssetBlended.value.filter((a) => a.show === true && a.asset > 0)
                var assetTieredBasedBreakpointPosition =
                  checkedTieredValue && checkedTieredValue.length > 0 ? checkedTieredValue.length - 1 : 0
                if (assetTieredBasedBreakpointPosition === i) {
                  annualAssetBlended.value[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint.asset)
                  annualAssetBlended.value[i + 1].assetBasedError = false
                  $toast?.destroy()
                } else {
                  annualAssetBlended.value[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint.asset)
                  if (annualAssetBlended.value[i + 1].minimumAssetFees >= annualAssetBlended.value[i + 1].asset) {
                    $toast?.destroy()
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetBlended.value[i + 1].asset = 0
                    annualAssetBlended.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBlended.value[i + 1].assetBasedError = false
                    $toast?.destroy()
                  }
                }
              } else {
                var tieredAssetBasedBreakpoint1 = annualAssetBlended.value[i]
                var tiredCheckedValue1 = annualAssetBlended.value.filter((a) => a.show === true && a.asset > 0)
                annualAssetBlended.value[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint1.asset)
                if (tiredCheckedValue1.length - 1 !== i) {
                  if (annualAssetBlended.value[i + 1].minimumAssetFees >= annualAssetBlended.value[i + 1].asset) {
                    $toast?.destroy()
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetBlended.value[i + 1].asset = 0
                    annualAssetBlended.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBlended.value[i + 1].assetBasedError = false
                    $toast?.destroy()
                  }
                } else {
                  annualAssetBlended.value[i + 1].assetBasedError = false
                  $toast?.destroy()
                }
              }
            }
          }
        }
      } else {
        if (val === 'linear') {
          var checkMinimumLinearParticipant = parseFloat(participantsBreakpoint.value[i].minAsset)

          var checkLinearPercentVal = parseFloat(participantsBreakpoint.value[i].maxAsset)
          if (isNaN(checkLinearPercentVal)) participantsBreakpoint.value[i].maxAsset = 0
          else if (checkMinimumLinearParticipant === 0 && checkLinearPercentVal === 0) {
            participantsBreakpoint.value[i].participantBasedError = false
          } else {
            if (checkMinimumLinearParticipant >= checkLinearPercentVal) {
              $toast?.destroy()
              $toast.error(`To value should be greater than From value`, '')
              participantsBreakpoint.value[i].maxAsset = 0
              participantsBreakpoint.value[i].participantBasedError = true
              return
            } else {
              participantsBreakpoint.value[i].maxAsset = checkLinearPercentVal
              var participantValue = participantsBreakpoint.value[i]
              if (participantValue) {
                participantValue.participantBasedError = false
                participantsBreakpoint.value.splice(i, 1, participantValue)
              }
            }
            if (i < 5) {
              if (greaterThanParticipantBreakpoint.value) {
                var partBasedBreakpoint = participantBreakpoint.value[i]
                var partLinearCheckedValue = participantBreakpoint.value.filter((a) => a.show === true && a.maxAsset > 0)
                var partBasedBreakpointPosition =
                  partLinearCheckedValue && partLinearCheckedValue.length > 0 ? partLinearCheckedValue.length - 1 : 0
                if (partBasedBreakpointPosition === i) {
                  participantBreakpoint.value[i + 1].minAsset = parseInt(partBasedBreakpoint.maxAsset)
                  participantBreakpoint.value[i + 1].participantBasedError = false
                  $toast?.destroy()
                } else {
                  participantBreakpoint.value[i + 1].minAsset = parseInt(partBasedBreakpoint.maxAsset)
                  if (participantBreakpoint.value[i + 1].minAsset >= participantBreakpoint.value[i + 1].maxAsset) {
                    $toast?.destroy()
                    $toast.error(`To value should be greater than From value`, '')
                    participantBreakpoint.value[i + 1].maxAsset = 0
                    participantBreakpoint.value[i + 1].participantBasedError = true
                    return
                  } else {
                    participantBreakpoint.value[i + 1].participantBasedError = false
                    $toast?.destroy()
                  }
                }
              } else {
                var linearPartBasedBreakpoint = participantBreakpoint.value[i]
                var partLinearCheckedValue1 = participantBreakpoint.value.filter((a) => a.show === true && a.maxAsset > 0)
                participantBreakpoint.value[i + 1].minAsset = parseInt(linearPartBasedBreakpoint.maxAsset)
                if (partLinearCheckedValue1.length - 1 !== i) {
                  if (participantBreakpoint.value[i + 1].minAsset >= participantBreakpoint.value[i + 1].maxAsset) {
                    $toast?.destroy()
                    $toast.error(`To value should be greater than From value`, '')
                    participantBreakpoint.value[i + 1].maxAsset = 0
                    participantBreakpoint.value[i + 1].participantBasedError = true
                    return
                  } else {
                    participantBreakpoint.value[i + 1].participantBasedError = false
                    $toast?.destroy()
                  }
                } else {
                  participantBreakpoint.value[i + 1].participantBasedError = false
                  $toast?.destroy()
                }
              }
            }
          }
        } else {
          var checkMinimumTieredParticipant = parseFloat(participantBlended.value[i].minParticipantAsset)

          var checkTieredParticipant = parseFloat(participantBlended.value[i].asset)
          if (isNaN(checkTieredParticipant)) participantBlended.value[i].asset = 0
          else if (checkMinimumTieredParticipant === 0 && checkTieredParticipant === 0) {
            participantBlended.value[i].participantBasedError = false
          } else {
            if (checkMinimumTieredParticipant >= checkTieredParticipant) {
              $toast?.destroy()
              $toast.error(`To Amount should be greater than From Amount`, '')
              participantBlended.value[i].asset = 0
              participantBlended.value[i].participantBasedError = true
              return
            } else {
              participantBlended.value[i].asset = checkTieredParticipant
              var tieredParticipantValue = participantBlended.value[i]
              if (tieredParticipantValue) {
                tieredParticipantValue.participantBasedError = false
                participantBlended.value.splice(i, 1, tieredParticipantValue)
              }
            }
            if (i < 5) {
              if (greaterThanParticipantBlended.value) {
                var tieredPartBasedBreakpoint = participantBlended.value[i]
                var checkedPartTieredValue = participantBlended.value.filter((a) => a.show === true && a.asset > 0)
                var partTieredBasedBreakpointPosition =
                  checkedPartTieredValue && checkedPartTieredValue.length > 0 ? checkedPartTieredValue.length - 1 : 0
                if (partTieredBasedBreakpointPosition === i) {
                  participantBlended.value[i + 1].minParticipantAsset = parseInt(tieredPartBasedBreakpoint.asset)
                  participantBlended.value[i + 1].participantBasedError = false
                  $toast?.destroy()
                } else {
                  participantBlended.value[i + 1].minParticipantAsset = parseInt(tieredPartBasedBreakpoint.asset)
                  if (participantBlended.value[i + 1].minParticipantAsset >= participantBlended.value[i + 1].asset) {
                    $toast?.destroy()
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    participantBlended.value[i + 1].asset = 0
                    participantBlended.value[i + 1].participantBasedError = true
                    return
                  } else {
                    participantBlended.value[i + 1].participantBasedError = false
                    $toast?.destroy()
                  }
                }
              } else {
                var tieredPartBasedBreakpoint1 = participantBlended.value[i]
                var tiredPartCheckedValue1 = participantBlended.value.filter((a) => a.show === true && a.asset > 0)
                participantBlended.value[i + 1].minParticipantAsset = parseInt(tieredPartBasedBreakpoint1.asset)
                if (tiredPartCheckedValue1.length - 1 !== i) {
                  if (participantBlended.value[i + 1].minParticipantAsset >= participantBlended.value[i + 1].asset) {
                    $toast?.destroy()
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    participantBlended.value[i + 1].asset = 0
                    participantBlended.value[i + 1].participantBasedError = true
                    return
                  } else {
                    participantBlended.value[i + 1].participantBasedError = false
                    $toast?.destroy()
                  }
                } else {
                  participantBlended.value[i + 1].participantBasedError = false
                  $toast?.destroy()
                }
              }
            }
          }
        }
      }
    }
    function getUserList() {
      $axios.get(`/api/v1/user/relationship/members`).then((response) => {
        userList.value = response.data.length > 0 ? response.data : []
      })
    }
    function getUserDisplayName(user) {
      if (!user) return
      return `${(user.name || user.contactName || '').replace(/\s\s+/g, ' ')} (${user.email || user.username})`
    }
    function callPlanList() {
      getPlanList()
      getStartupPlanList()
    }
    function removePlanList() {
      selectedPlanListValue.value = selectedPlanListText.value.map((a) => a.value)
    }
    function removeStartupList() {
      selectedStartupsValue.value = selectedStartupsText.value.map((a) => a.value)
    }
    function selectedUser() {
      if (user.value) {
        var contact = selectedUserListValue.value
        user.value.forEach(function (item) {
          var name = item.username
          if (!contact.includes(name)) {
            contact.push(name)
          }
        })
        selectedUserListValue.value = contact
        user.value = ''
        if (selectedUserListValue.value.length === 0) {
          searchUsersError.value = true
          searchUsersErrorMsg.value = 'Users are required'
        } else {
          searchUsersErrorMsg.value = ''
          searchUsersError.value = false
        }
        getPlanList()
        getStartupPlanList()
      }
    }
    function selectAllUsers() {
      if (selectedUserListValue.value.length === 0 && !allUsers.value && scheduleType.value) {
        searchUsersError.value = true
        searchUsersErrorMsg.value = 'Users are required'
      } else {
        searchUsersErrorMsg.value = ''
        searchUsersError.value = false
        addPlan.value = false
        addStartup.value = false
        selectedPlanListText.value = []
        selectedStartupsText.value = []
      }
    }
    function selectedPlans() {
      if (plan.value) {
        var planName = selectedPlanListText.value
        var seinpno = selectedPlanListValue.value
        plan.value.forEach(function (item) {
          var name = item.SEINPNO
          var pname = { value: item.SEINPNO, text: item.PNAME }
          if (!seinpno.includes(name)) {
            planName.push(pname)
            seinpno.push(name)
          }
        })
        selectedPlanListValue.value = seinpno
        selectedPlanListText.value = planName
        plan.value = ''
      }
    }
    function selectedStartups() {
      if (startup.value) {
        var planName = selectedStartupsText.value
        var planId = selectedStartupsValue.value
        startup.value.forEach(function (item) {
          var name = item.PlanID
          var pname = { value: item.PlanID, text: item.PNAME }
          if (!planId.includes(name)) {
            planName.push(pname)
            planId.push(name)
          }
        })
        selectedStartupsValue.value = planId
        selectedStartupsText.value = planName
        startup.value = ''
      }
    }
    function getStartupPlanList(val) {
      if (!readOnly.value) {
        $axios.post(`/api/v1/tal/feeengineschedule/plans/startup`, selectedUserListValue.value).then((response) => {
          startupList.value = response.data.d && response.data.d.length > 0 ? response.data.d : []
          if (val) {
            var selectedStartupValue = selectedStartupsValue.value.map(Number)
            var filteredStartup = startupList.value.filter((x) => selectedStartupValue.includes(x.PlanID))
            var startupPlan = []
            filteredStartup.forEach(function (item) {
              var pname = { value: item.PlanID, text: item.PNAME }
              startupPlan.push(pname)
            })
            selectedStartupsText.value = startupPlan
          }
        })
      }
    }
    function getPlanList(val) {
      if (!readOnly.value) {
        $axios.post(`/api/v1/tal/feeengineschedule/plans`, selectedUserListValue.value).then((response) => {
          planList.value = response.data.d && response.data.d.length > 0 ? response.data.d : []
          if (val) {
            var selectedValue = selectedPlanListValue.value
            var filteredArray = planList.value.filter((x) => selectedValue.includes(x.SEINPNO))
            var plan = []
            filteredArray.forEach(function (item) {
              var pname = { value: item.SEINPNO, text: item.PNAME }
              plan.push(pname)
            })
            selectedPlanListText.value = plan
          }
        })
      }
    }
    function validateFees() {
      if (parseFloat(maximumFees.value) !== 0) {
        var maxFees = Intl.NumberFormat().format(maximumAdvisoryFees.value)
        if (parseFloat(maximumFees.value) <= parseFloat(minimumFees.value)) {
          maximumFeesError.value = true
          maximumFeesErrorMsg.value = 'Maximum fee should be greater than Minimum fee'
        } else if (scheduleType.value && scheduleType.value === 'Advisory' && maximumAdvisoryFees.value > 0) {
          if (parseFloat(maximumFees.value) > parseFloat(maximumAdvisoryFees.value)) {
            maximumFeesError.value = true
            maximumFeesErrorMsg.value = `Maximum fee should not exceed $${maxFees}`
            hasError.value = true
          } else {
            maximumFeesError.value = false
            maximumFeesErrorMsg.value = ''
          }
        } else {
          maximumFeesError.value = false
          maximumFeesErrorMsg.value = ''
        }
      } else {
        maximumFeesError.value = false
        maximumFeesErrorMsg.value = ''
      }
    }
    function checkFeeStatus() {
      if (isActive.value === 0 && id.value > 0) {
        $axios.get(`/api/v1/tal/feeengineschedule/${id.value}/statuschange`).then((success) => {
          var status = success.data.d !== null ? success.data.d : true
          if (!status) {
            $toast?.destroy()
            $toast.warning(
              'The status cannot be changed to Inactive, since this fee schedule is currently associated with active opportunities.',
              ''
            )
            isActive.value = 1
          }
        })
      }
    }
    function checkDefault() {
      if (scheduleType.value && planType.value.length > 0) {
        var type = Array.isArray(planType.value) ? planType.value[0] : planType.value
        $axios.get(`/api/v1/tal/feeengineschedule/markasdefault/${scheduleType.value}/${type}`).then((success) => {
          var status = success.data.d ? success.data.d : false
          if (status) {
            isDefault.value = true
            markDefaultReadOnly.value = true
          } else {
            markDefaultReadOnly.value = false
          }
        })
      }
    }
    function checkFeeActive(id) {
      if (id > 0) {
        $axios.get(`/api/v1/tal/feeengineschedule/${id}/statuschange`).then((success) => {
          var status = success.data.d !== null ? success.data.d : true
          isActiveFees.value = !status ? true : false
        })
      } else isActiveFees.value = false
    }
    function getPlanTypes() {
      $store
        .dispatch('getPlanTypes')
        .then(() => {
          planTypeList.value = $store.state.planTypes.length > 0 ? $store.state.planTypes : []
        })
        .catch(() => {
          planTypeList.value = []
        })
    }
    function assignDefaultAsset() {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        scheduleTypeError.value = false
        scheduleTypeErrorMsg.value = ''
        minimumFees.value = 0
        maximumFees.value = 0
        part1Base.value = 0
        if (scheduleType.value) {
          $axios.get(`/api/v1/managedplan/program/advisoryfee`).then((success) => {
            if (success.data.d && success.data.d.length > 0) {
              defaultAsset.value = success.data.d
              if ($store.state.user.selectedProgram.programName === $authz.managedPlan.MML) {
                var totalAssetValue = success.data.d.length - 1
                for (var i = 0; i < success.data.d.length; i++) {
                  //Asset Linear Based
                  annualAssetsBreakpoint.value[i].show = true
                  annualAssetsBreakpoint.value[i].minAsset = success.data.d[i].MinAsset
                  annualAssetsBreakpoint.value[i].maxAsset = totalAssetValue === i ? 0 : success.data.d[i].MaxAsset
                  annualAssetsBreakpoint.value[i].breakpointPercent = success.data.d[i].Fee
                    ? parseFloat(success.data.d[i].Fee / 100)
                    : 0
                  //Asset Tierred Based
                  annualAssetsBlended.value[i].show = true
                  annualAssetsBlended.value[i].asset =
                    totalAssetValue === i ? 0 : success.data.d[i].MaxAsset - success.data.d[i].MinAsset
                  annualAssetsBlended.value[i].percent = success.data.d[i].Fee ? parseFloat(success.data.d[i].Fee / 100) : 0
                }
              }
            }
          })
        }
      }
    }
    watch(
      () => breakpoint.value,
      (val) => {
        if (val) blended.value = false
      }
    )
    watch(
      () => blended.value,
      () => {
        breakpoint.value = false
      }
    )
    watch(
      () => isAnnualAsset.value,
      (val) => {
        if (!val) annualAssetType.value = 'Linear Fee Structure'
      }
    )
    watch(
      () => isParticipantFee.value,
      (val) => {
        if (!val) partStructureType.value = 'Linear Fee Structure'
      }
    )
    watch(
      () => scheduleTypes.value,
      () => {
        if (!$authz.hasPermission($authz.permissionSet.Fee_Engine_Administration__c, $authz.permission.Full)) {
          var admin = scheduleTypes.value.findIndex((a) => a.value === 'Administration')
          if (admin > -1) scheduleTypes.value.splice(admin, 1)
        }
        if (!$authz.hasPermission($authz.permissionSet.Fee_Engine_Advisory__c, $authz.permission.Full)) {
          var advisory = scheduleTypes.value.findIndex((a) => a.value === 'Advisory')
          if (advisory > -1) scheduleTypes.value.splice(advisory, 1)
        }
        if (!$authz.hasPermission($authz.permissionSet.Fee_Engine_Custodian__c, $authz.permission.Full)) {
          var custodian = scheduleTypes.value.findIndex((a) => a.value === 'Custodian')
          if (custodian > -1) scheduleTypes.value.splice(custodian, 1)
        }
        if (!$authz.hasPermission($authz.permissionSet.Fee_Engine_Recordkeeping__c, $authz.permission.Full)) {
          var recordKeeping = scheduleTypes.value.findIndex((a) => a.value === 'Recordkeeping')
          if (recordKeeping > -1) scheduleTypes.value.splice(recordKeeping, 1)
        }
        if (!$authz.hasPermission($authz.permissionSet.Fee_Engine_Investment_Manager__c, $authz.permission.Full)) {
          var investmentManager = scheduleTypes.value.findIndex((a) => a.value === 'Investment Manager')
          if (investmentManager > -1) scheduleTypes.value.splice(investmentManager, 1)
        }
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          if (
            $authz.hasRole($authz.roles.SiteAdmin) ||
            $authz.hasRole($authz.roles.ProgramAdmin) ||
            $authz.hasRole($authz.roles.InternalAdmin)
          ) {
            scheduleTypeList.value = scheduleTypes.value
          } else {
            let scheduleValue = scheduleTypes.value.filter((a) => a.value === 'Advisory')
            if (!$authz.hasPermission($authz.permissionSet.Fee_Engine_Advisory__c, $authz.permission.Full)) {
              var advisory1 = scheduleValue.findIndex((a) => a.value === 'Advisory')
              if (advisory1 > -1) scheduleValue.splice(advisory1, 1)
            }
          }
        } else {
          scheduleTypeList.value = scheduleTypes.value
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.openNewFees,
      (val) => {
        if (val) {
          resetFees()
        }
      },
      { immediate: true }
    )
    watch(
      () => minimumFees.value,
      (oldvalue, newvalue) => {
        if (oldvalue !== newvalue && maximumFees.value !== 0) {
          validateFees()
        }
      }
    )
    watch(
      () => allUsers.value,
      (val) => {
        if (val) {
          var users = []
          var contact = []
          userList.value.forEach(function (item) {
            var val = item.contactName
            var name = item.username
            if (!users.includes(val) && !contact.includes(name)) {
              users.push(val)
              contact.push(name)
            }
          })
          selectedUserListValue.value = contact
          getPlanList()
          getStartupPlanList()
        } else {
          selectedUserListValue.value = []
          getPlanList()
          getStartupPlanList()
        }
      }
    )
    onMounted(() => {
      getPlanTypes()
      getUserList()
      getETFFeeSchedule()
      eventBus.on('editFee', (id, read) => {
        readOnly.value = read
        editScheduleFee(id)
        checkFeeActive(id)
      })
      eventBus.on('readOnly', (data) => {
        readOnly.value = data
        checkFeeActive(0)
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('editFee')
      eventBus.off('readOnly')
    })
    return {
      theme,
      id,
      display,
      $authz,
      $store,
      scheduleType,
      loading,
      businessType,
      valid,
      readOnly,
      scheduleTypeList,
      scheduleTypeError,
      isActiveFees,
      isActive,
      scheduleTypeErrorMsg,
      markDefaultReadOnly,
      feeScheduleName,
      scheduleNameErrorMsg,
      scheduleNameError,
      minimumFees,
      showMinMaxFee,
      minimumFeeErrorMsg,
      minimumFeeError,
      maximumFees,
      maximumFeesErrorMsg,
      maximumFeesError,
      custodian,
      isDefault,
      custodianErrorMsg,
      custodianError,
      subCustodian,
      subCustodianList,
      subCustodianErrorMsg,
      subCustodianError,
      etfSchedule,
      etfScheduleList,
      conversion,
      installation,
      baseHeader,
      participantHeader,
      assetHeader,
      part1Base,
      planType,
      planTypeList,
      user,
      userList,
      allUsers,
      searchUsersErrorMsg,
      searchUsersError,
      selectedUserListValue,
      emptyArray,
      addPlan,
      plan,
      planList,
      selectedPlanListText,
      addStartup,
      startup,
      startupList,
      selectedStartupsText,
      items,
      error,
      custodianList,
      footNote,
      footNoteText,
      isBaseFee,
      baseFee,
      baseFeeError,
      baseFeeErrorMsg,
      showAssetBasedFee,
      isAnnualAsset,
      annualAssetType,
      annualAssetBlended,
      checkActiveBlended,
      greaterThanAssetBlended,
      disableAssetBlendedFee,
      annualAssetBreakpoint,
      checkActiveBreakpoint,
      greaterThanAssetBreakpoint,
      disableAssetBreakpointFee,
      showParticipantBasedFee,
      partStructureType,
      participantBlended,
      checkActiveParticipantBlended,
      greaterThanParticipantBlended,
      disableParticipantBlendedFee,
      checkActiveParticipantBreakpoint,
      participantBreakpoint,
      disableParticipantBreakpointFee,
      waivedParticipants,
      etfScheduleBuilder,
      selectedPlans,
      assignDefaultAsset,
      checkFeeScheduleName,
      checkFeeStatus,
      checkDefault,
      validateFees,
      checkTrustee,
      checkSubCustodian,
      SaveSchedule,
      openETFSchedule,
      selectAllUsers,
      getUserDisplayName,
      selectedUser,
      callPlanList,
      removePlanList,
      selectedStartups,
      removeStartupList,
      checkSchedule,
      checkGreaterValue,
      formatPrice,
      checkFeePercent,
      checkFeeRate,
      removeBlendedRow,
      addBlendedRow,
      addBreakpointRow,
      checkParticipantFeeRate,
      removeBreakpointRow,
      resetFees,
      getETFFeeSchedule
    }
  }
}
</script>
<style scoped>
.divider {
  border-color: rgba(0, 0, 0, 0.42) !important;
}
.transparentDivider {
  border-color: transparent !important;
}
.background_fees {
  background-color: #d3d3d359 !important;
}
.v-chip .v-chip__content {
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  height: auto !important;
  white-space: normal !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}
</style>
