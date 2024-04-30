<template>
  <v-col>
    <v-dialog
      v-model="dialog"
      persistent
      class="elevation-3"
      content-class="elevation-3"
      scrollable
      max-width="1000px"
      :eager="true"
    >
      <v-card>
        <v-card-title class="text-secondary pa-3" fixed :class="theme.dark ? '' : 'accent'">
          <v-row>
            <v-col v-if="!display.xs.value" cols="11" xl="11" lg="11" sm="11" md="11" xs="11">
              <h3 v-if="id === 0" class="text-secondary">New ETF Fee Schedule</h3>
              <h3 v-if="id > 0" class="text-secondary">
                {{ feeScheduleName + ' - ' + scheduleType }}
              </h3>
            </v-col>
            <v-col v-if="display.xs.value" cols="11" xl="11" lg="11" sm="11" md="11" xs="11">
              <h4 v-if="id === 0" class="text-secondary">New ETF Fee Schedule</h4>
              <h4 v-if="id > 0" class="text-secondary">
                {{ feeScheduleName + ' - ' + scheduleType }}
              </h4>
            </v-col>
            <v-col cols="1" xl="1" lg="1" sm="1" md="1" xs="1" class="text-right align-self">
              <v-icon :color="theme.dark ? '' : 'secondary'" @click="close()"> close </v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text id="feeContainerDiv" class="card_text_height">
          <v-container class="pb-3 pt-1" :pa-0="display.xs.value">
            <v-row>
              <v-col cols="12" xs="12" class="pb-3">
                <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Fee Details</h2>
              </v-col>
              <v-col cols="12" xl="5" lg="5" md="5" sm="5" xs="12" class="pr-3">
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
                  :disabled="readOnly"
                  @blur="checkFeeScheduleName()"
                />
              </v-col>
              <v-col cols="12" xl="5" lg="5" md="5" sm="5" xs="12" class="pr-3">
                <v-select
                  v-model="isActive"
                  variant="outlined"
                  density="compact"
                  :items="items"
                  item-title="text"
                  label="Status"
                  :class="display.xs.value ? '' : 'pt-0'"
                  :disabled="readOnly"
                  @update:model-value="checkFeeStatus()"
                />
              </v-col>
              <v-col cols="12" xl="5" lg="5" md="5" sm="5" xs="12" class="pr-3">
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
                  :disabled="readOnly"
                  :error-messages="minimumGreaterThanBaseErrorMsg"
                  :error="minimumGreaterThanBaseError"
                  @focus="$event.target.select()"
                  @blur="checkMinFee()"
                />
              </v-col>
              <v-col cols="12" xl="5" lg="5" md="5" sm="5" xs="12" class="pr-3">
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
                  :error-messages="maximumFeesErrorMsg"
                  :error="maximumFeesError"
                  :disabled="readOnly"
                  @focus="$event.target.select()"
                  @blur="validateFees()"
                />
              </v-col>
              <v-col cols="12" xl="5" lg="5" md="5" sm="5" xs="12" class="pr-3 pt-3">
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
                  :disabled="
                    readOnly ||
                    $authz.allowedByProgram(
                      $authz.programPermissionSet.PCS_Aspire_Product__c,
                      $authz.pcsAspireProduct.Multi_Strategist_Product
                    )
                  "
                />
              </v-col>
              <v-col cols="12" xs="12">
                <v-divider class="my-3 divider" />
              </v-col>
              <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                <v-row>
                  <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                    <h2 class="font-weight-medium" :class="theme.dark ? '' : 'text-accent'">Fee Structure</h2>
                  </v-col>
                  <v-col v-if="false" cols="12" xs="12">
                    <v-switch
                      v-model="isBaseFee"
                      color="accent"
                      :disabled="readOnly"
                      label="Base"
                      class="offsetSwitch"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="mt-3">
                    <span
                      >Base Fee will either charge a flat fee if used alone, or will charge in addition to an annual asset fee if
                      combined with an annual asset fee</span
                    >
                  </v-col>
                  <v-col v-if="isBaseFee" cols="12" xl="6" lg="6" md="6" sm="8" xs="12" class="mt-3">
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
                      label="Charge a base fee of"
                      prefix="$"
                      maxlength="13"
                      hide-details
                      :disabled="readOnly"
                      @focus="$event.target.select()"
                    />
                  </v-col>
                  <v-col v-if="showAssetBasedFee" cols="12" xs="12">
                    <v-divider class="my-3 divider" />
                  </v-col>
                  <v-col v-if="showAssetBasedFee" cols="12" xs="12">
                    <v-switch
                      v-model="isAnnualAsset"
                      color="accent"
                      label="Asset Based"
                      class="offsetSwitch mt-0"
                      hide-details
                      :disabled="readOnly"
                    />
                  </v-col>
                  <v-col v-if="isAnnualAsset" id="AnnualAsset" cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="mt-3">
                    <v-col cols="12" xs="12">
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
                        <v-radio value="Tiered Fees" class="mt-2" color="accent">
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
                  >
                    <v-col
                      v-show="annualAssetType === 'Tiered Fees'"
                      cols="12"
                      xl="8"
                      lg="8"
                      md="10"
                      sm="11"
                      xs="12"
                      class="pb-2"
                    >
                      <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pt-3 pb-2">
                        <v-row>
                          <v-col cols="4" xl="12" lg="2" md="2" sm="2" xs="4">
                            <v-row>
                              <v-col cols="4" xs="4" />
                              <v-col cols="7" xs="7"> From ($) </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="3" xl="3" lg="3" md="3" sm="3" xs="3"> To ($) </v-col>
                          <v-col cols="3" xl="3" lg="3" md="3" sm="3" xs="3"> Fee Rate (%) </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-for="(item, index) in annualAssetBlended" :key="index">
                        <v-row v-show="item.show">
                          <v-col cols="4" xl="12" lg="2" md="2" sm="2" xs="4">
                            <v-row>
                              <v-col cols="4" xs="4">
                                <v-btn
                                  :disabled="readOnly"
                                  icon
                                  :ripple="false"
                                  size="small"
                                  class="ml-0"
                                  @click="
                                    (greaterThanAssetBlended = !greaterThanAssetBlended), checkGreaterValue('asset', 'tiered')
                                  "
                                >
                                  <CustomIcon
                                    v-if="checkActiveBlended.length === index + 1 && !readOnly"
                                    :type="greaterThanAssetBlended ? 'greaterthanOn' : 'greaterthanOff'"
                                  />
                                </v-btn>
                              </v-col>
                              <v-col cols="7" xs="7" class="align-self">
                                <h3>
                                  {{ formatPrice(item['minimumAssetFees'], 0) }}
                                </h3>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="3" xl="3" lg="3" md="2" sm="3" xs="3" class="pr-2 pb-3">
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
                              Single-line
                              prefix="$"
                              v-if="item['hideMaxAsset']"
                              maxlength="13"
                              hide-details
                              :disabled="readOnly"
                              :error="item['assetBasedError']"
                              @focus="$event.target.select()"
                              @blur="checkFeePercent(index, 'tiered', 'Asset')"
                            />
                          </v-col>
                          <v-col cols="4" xl="3" lg="3" md="3" sm="3" xs="4" class="pr-1 pb-3">
                            <v-text-field
                              v-model="item['percent']"
                              suffix="%"
                              variant="outlined"
                              density="compact"
                              v-input-mask="{
                                alias: 'numeric',
                                digits: '2',
                                rightAlign: false,
                                allowMinus: false,
                                digitsOptional: true,
                                placeholder: '0',
                                autoUnmask: true
                              }"
                              Single-line
                              maxlength="10"
                              :error="error"
                              hide-details
                              :disabled="readOnly"
                              @focus="$event.target.select()"
                            />
                          </v-col>
                          <v-col cols="1" xl="1" lg="1" md="1" sm="1" xs="1" class="ml-2">
                            <v-btn icon class="ma-0" :disabled="readOnly">
                              <v-icon :color="theme.dark ? '' : 'error'" @click="removeBlendedRow(index, 'Asset')">
                                mdi-close-circle
                              </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-col
                          v-if="checkActiveBlended.length === index + 1 && checkActiveBlended.length !== 6 && !readOnly"
                          cols="12"
                          xs="12"
                        >
                          <v-btn
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
                      sm="11"
                      xs="12"
                      class="pb-2"
                    >
                      <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pt-3 pb-2">
                        <v-row>
                          <v-col cols="4" xl="12" lg="2" md="2" sm="2" xs="4">
                            <v-row>
                              <v-col cols="4" xs="4" />
                              <v-col cols="7" xs="7"> From ($) </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="3" xl="3" lg="3" md="3" sm="3" xs="3"> To ($) </v-col>
                          <v-col cols="3" xl="3" lg="3" md="3" sm="3" xs="3"> Fee Rate (%) </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-for="(item, index) in annualAssetBreakpoint" :key="index">
                        <v-row v-show="item.show">
                          <v-col cols="4" xl="12" lg="2" md="2" sm="2" xs="4">
                            <v-row>
                              <v-col cols="4" xs="4">
                                <v-btn
                                  :disabled="readOnly"
                                  icon
                                  :ripple="false"
                                  size="small"
                                  class="ml-0"
                                  @click="
                                    (greaterThanAssetBreakpoint = !greaterThanAssetBreakpoint),
                                      checkGreaterValue('asset', 'linear')
                                  "
                                >
                                  <CustomIcon
                                    v-if="checkActiveBreakpoint.length === index + 1 && !readOnly"
                                    :type="greaterThanAssetBreakpoint ? 'greaterthanOn' : 'greaterthanOff'"
                                  />
                                </v-btn>
                              </v-col>
                              <v-col cols="7" xs="7" class="align-self">
                                <h3>{{ formatPrice(item['minAsset'], 0) }}</h3>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="3" xl="3" lg="3" md="3" sm="3" xs="3" class="pr-2 pb-3">
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
                              ref="etfAssetLinear"
                              prefix="$"
                              maxlength="13"
                              v-if="item['hideMaxAsset']"
                              hide-details
                              :disabled="readOnly"
                              :error="item['assetBasedError']"
                              @focus="$event.target.select()"
                              @blur="checkFeePercent(index, 'linear', 'Asset')"
                            />
                          </v-col>
                          <v-col cols="3" xl="3" lg="3" md="3" sm="3" xs="3" class="pr-1 pb-3">
                            <v-text-field
                              v-model="item['breakpointPercent']"
                              v-input-mask="{
                                alias: 'numeric',
                                digits: '2',
                                rightAlign: false,
                                allowMinus: false,
                                digitsOptional: true,
                                placeholder: '0',
                                autoUnmask: true
                              }"
                              variant="outlined"
                              density="compact"
                              Single-line
                              :error="error"
                              hide-details
                              :disabled="readOnly"
                              maxlength="10"
                              suffix="%"
                              @focus="$event.target.select()"
                            />
                          </v-col>
                          <v-col cols="1" xl="1" lg="1" md="1" sm="1" xs="1" class="ml-2">
                            <v-btn icon class="ma-0" :disabled="readOnly">
                              <v-icon :color="theme.dark ? '' : 'error'" @click="removeBreakpointRow(index, 'Asset')">
                                mdi-close-circle
                              </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-col
                          v-if="checkActiveBreakpoint.length === index + 1 && checkActiveBreakpoint.length !== 6 && !readOnly"
                          cols="12"
                          xs="12"
                        >
                          <v-btn
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
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider class="bold" />
        <v-card-actions v-if="!readOnly">
          <v-btn :color="theme.dark ? '' : 'accent'" @click="SaveSchedule()"> Save And Close </v-btn>
          <v-btn :color="theme.dark ? '' : 'accent'" variant="outlined" @click="close()"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import { ref, inject, watch, computed, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import CustomIcon from '@/components/CustomIcon'
export default {
  components: {
    CustomIcon
  },
  props: ['getETFFee', 'from'],
  setup(props) {
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const display = useDisplay()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $toast = instance.appContext.config.globalProperties.$toast
    const $authz = instance.appContext.config.globalProperties.$authz
    const dialog = ref(false)
    const items = ref([
      { text: 'Active', value: 1 },
      { text: 'Inactive', value: 0 }
    ])
    const assets = ref([
      { text: 'Tiered Fees', value: 'Tiered Fees' },
      { text: 'Linear Fee Structure', value: 'Linear Fee Structure' }
    ])
    const annualAssetType = ref('Linear Fee Structure')
    const isActive = ref(1)
    const blended = ref(false)
    const breakpoint = ref(false)
    const scheduleNameErrorMsg = ref('')
    const scheduleType = ref('')
    const scheduleNameError = ref(false)
    const etfAssetLinear = ref(null)
    const feeScheduleName = ref('')
    const error = ref(false)
    const isAnnualAsset = ref(false)
    const isBaseFee = ref(false)
    const baseFee = ref(0)
    const minimumFees = ref(0)
    const maximumFees = ref(0)
    const minimumGreaterThanBaseError = ref(false)
    const minimumGreaterThanBaseErrorMsg = ref('')
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
    const assetFeeMin = ref(0)
    const maximumFeesErrorMsg = ref('')
    const maximumFeesError = ref(false)
    const readOnly = ref(false)
    const part1Base = ref(0)
    const greaterThanAssetBlended = ref(false)
    const greaterThanAssetBreakpoint = ref(false)
    const disableAssetBlendedFee = ref(false)
    const disableAssetBreakpointFee = ref(false)
    function checkGreaterValue(val, type) {
      if (val === 'asset') {
        if (type === 'linear') {
          if (greaterThanAssetBreakpoint.value) {
            var checkedValue = annualAssetBreakpoint.value.filter((a) => a.show === true && a.maxAsset > 0)
            if (checkedValue && checkedValue.length > 0) {
              var linearGreaterIndex = checkedValue.length - 1
              var assetBasedBreakpoint = annualAssetBreakpoint.value[linearGreaterIndex]
              if (linearGreaterIndex < 5) {
                annualAssetBreakpoint.value[linearGreaterIndex + 1].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
                annualAssetBreakpoint.value[linearGreaterIndex + 1].assetBasedError = false
                annualAssetBreakpoint.value[linearGreaterIndex + 1].hideMaxAsset = false
                annualAssetBreakpoint.value[linearGreaterIndex + 1].show = true
              } else {
                var linearGreaterIndex1 = checkedValue.length - 2
                var assetBasedBreakpoint1 = annualAssetBreakpoint.value[linearGreaterIndex1]
                annualAssetBreakpoint.value[linearGreaterIndex1 + 1].minAsset = parseInt(assetBasedBreakpoint1.maxAsset)
                annualAssetBreakpoint.value[linearGreaterIndex1 + 1].maxAsset = 0
                annualAssetBreakpoint.value[linearGreaterIndex1 + 1].assetBasedError = false
                annualAssetBreakpoint.value[linearGreaterIndex1 + 1].hideMaxAsset = false
                annualAssetBreakpoint.value[linearGreaterIndex1 + 1].show = true
              }
              annualAssetBreakpoint.value.forEach((element, index) => {
                if (checkedValue.length + 1 < index) {
                  element.show = false
                }
              })
              disableAssetBreakpointFee.value = true
            } else {
              annualAssetBreakpoint.value[0].assetBasedError = false
              annualAssetBreakpoint.value[0].hideMaxAsset = false
              annualAssetBreakpoint.value[0].show = true
            }
          } else {
            var checkedLinearValue = annualAssetBreakpoint.value.filter((a) => a.show === true && a.maxAsset > 0)
            if (checkedLinearValue && checkedLinearValue.length > 0) {
              var linearGreaterOffIndex = checkedLinearValue.length - 1
              var linearAssetBasedBreakpoint = annualAssetBreakpoint.value[linearGreaterOffIndex]
              if (linearGreaterOffIndex < 5) {
                annualAssetBreakpoint.value[linearGreaterOffIndex + 1].minAsset = parseInt(linearAssetBasedBreakpoint.maxAsset)
                annualAssetBreakpoint.value[linearGreaterOffIndex + 1].hideMaxAsset = true
                annualAssetBreakpoint.value[linearGreaterOffIndex + 1].assetBasedError = false
                annualAssetBreakpoint.value[linearGreaterOffIndex + 1].show = true
              } else {
                var linearGreaterOffIndex1 = checkedLinearValue.length - 2
                var linearAssetBasedBreakpoint1 = annualAssetBreakpoint.value[linearGreaterOffIndex1]
                annualAssetBreakpoint.value[linearGreaterOffIndex1 + 1].minAsset = parseInt(linearAssetBasedBreakpoint1.maxAsset)
                annualAssetBreakpoint.value[linearGreaterOffIndex1 + 1].maxAsset = 0
                annualAssetBreakpoint.value[linearGreaterOffIndex1 + 1].assetBasedError = true
                annualAssetBreakpoint.value[linearGreaterOffIndex1 + 1].hideMaxAsset = true
                annualAssetBreakpoint.value[linearGreaterOffIndex1 + 1].show = true
              }
              disableAssetBreakpointFee.value = false
            } else {
              annualAssetBreakpoint.value[0].hideMaxAsset = true
              annualAssetBreakpoint.value[0].assetBasedError = false
              annualAssetBreakpoint.value[0].show = true
            }
          }
        } else {
          if (greaterThanAssetBlended.value) {
            var checkedAssetValue = annualAssetBlended.value.filter((a) => a.show === true && a.asset > 0)
            if (checkedAssetValue && checkedAssetValue.length > 0) {
              var tieredGreaterOnIndex = checkedAssetValue.length - 1
              var assetBasedBreakpoint2 = annualAssetBlended.value[tieredGreaterOnIndex]
              if (tieredGreaterOnIndex < 5) {
                annualAssetBlended.value[tieredGreaterOnIndex + 1].minimumAssetFees = parseInt(assetBasedBreakpoint2.asset)
                annualAssetBlended.value[tieredGreaterOnIndex + 1].assetBasedError = false
                annualAssetBlended.value[tieredGreaterOnIndex + 1].hideMaxAsset = false
                annualAssetBlended.value[tieredGreaterOnIndex + 1].show = true
              } else {
                var tieredGreaterOnIndex1 = checkedAssetValue.length - 2
                var tieredAssetBasedBreakpoint = annualAssetBlended.value[tieredGreaterOnIndex1]
                annualAssetBlended.value[tieredGreaterOnIndex1 + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint.asset)
                annualAssetBlended.value[tieredGreaterOnIndex1 + 1].asset = 0
                annualAssetBlended.value[tieredGreaterOnIndex1 + 1].assetBasedError = false
                annualAssetBlended.value[tieredGreaterOnIndex1 + 1].hideMaxAsset = false
                annualAssetBlended.value[tieredGreaterOnIndex1 + 1].show = true
              }

              annualAssetBlended.value.forEach((element, index) => {
                if (checkedAssetValue.length + 1 < index) {
                  element.show = false
                }
              })
              disableAssetBlendedFee.value = true
            } else {
              annualAssetBlended.value[0].assetBasedError = false
              annualAssetBlended.value[0].hideMaxAsset = false
              annualAssetBlended.value[0].show = true
            }
          } else {
            var checkedTieredValue = annualAssetBlended.value.filter((a) => a.show === true && a.asset > 0)
            if (checkedTieredValue && checkedTieredValue.length > 0) {
              var tieredGreaterOffIndex = checkedTieredValue.length - 1
              var assetBasedBreakpoint3 = annualAssetBlended.value[tieredGreaterOffIndex]
              if (tieredGreaterOffIndex < 5) {
                annualAssetBlended.value[tieredGreaterOffIndex + 1].minimumAssetFees = parseInt(assetBasedBreakpoint3.asset)
                annualAssetBlended.value[tieredGreaterOffIndex + 1].assetBasedError = false
                annualAssetBlended.value[tieredGreaterOffIndex + 1].hideMaxAsset = true
                annualAssetBlended.value[tieredGreaterOffIndex + 1].show = true
              } else {
                var tieredGreaterOffIndex1 = checkedTieredValue.length - 2
                var tieredAssetBasedBreakpoint1 = annualAssetBlended.value[tieredGreaterOffIndex1]
                annualAssetBlended.value[tieredGreaterOffIndex1 + 1].minimumAssetFees = parseInt(
                  tieredAssetBasedBreakpoint1.asset
                )
                annualAssetBlended.value[tieredGreaterOffIndex1 + 1].asset = 0
                annualAssetBlended.value[tieredGreaterOffIndex1 + 1].assetBasedError = true
                annualAssetBlended.value[tieredGreaterOffIndex1 + 1].hideMaxAsset = true
                annualAssetBlended.value[tieredGreaterOffIndex1 + 1].show = true
              }
              disableAssetBlendedFee.value = false
            } else {
              annualAssetBlended.value[0].assetBasedError = false
              annualAssetBlended.value[0].hideMaxAsset = true
              annualAssetBlended.value[0].show = true
            }
          }
        }
      }
    }
    function checkFeeStatus() {
      if (isActive.value === 0 && id.value > 0) {
        $axios.get(`/api/v1/tal/feeengineschedule/${id.value}/statuschange`).then((success) => {
          var status = success.data.d !== null ? success.data.d : true
          if (!status) {
            $toast.warning(
              'The status cannot be changed to Inactive, since this fee schedule is currently associated with active opportunities.',
              ''
            )
            isActive.value = 1
          }
        })
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
        annualAssetBlended.value.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.show = true
          }
        })
      }
    }
    function addBreakpointRow(index, type) {
      var i = index + 1
      if (type === 'Asset') {
        annualAssetBreakpoint.value.forEach((element, index) => {
          if (element.show === false && i === index) {
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
        checkGreaterValue('asset', 'tiered')
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
              minParticipantAsset: 0,
              asset: 0,
              percent: 0,
              base: 0,
              assetBasedError: false
            })
          }
        })
        checkGreaterValue('asset', 'linear')
      }
    }
    function checkerror() {
      error.value = !error.value
    }
    function SaveSchedule() {
      // Validation check
      hasError.value = false
      if (feeScheduleName.value === '') {
        scheduleNameError.value = true
        scheduleNameErrorMsg.value = 'Fee Schedule Name is required'
        hasError.value = true
      }
      if (parseFloat(maximumFees.value) !== 0) {
        if (parseFloat(maximumFees.value) <= parseFloat(minimumFees.value)) {
          maximumFeesError.value = true
          maximumFeesErrorMsg.value = 'Maximum fee should be greater than Minimum fee'
          hasError.value = true
        }
      }

      if (hasError.value) {
        if (props.from === 'editETF') document.getElementsByClassName('card_text_height')[0].scrollTop = 0
        else document.getElementsByClassName('card_text_height')[1].scrollTop = 0
        return
      }
      if (!(isBaseFee.value || isAnnualAsset.value)) {
        $toast.error('Select Fee Structure', '')
        if (props.from === 'editETF') document.getElementsByClassName('card_text_height')[0].scrollTop = 0
        else document.getElementsByClassName('card_text_height')[1].scrollTop = 0
        return false
      }

      var schedule = {}
      // Header Details
      schedule.Id = id.value
      schedule.Name = feeScheduleName.value
      schedule.part1Base = part1Base.value ? parseFloat(part1Base.value) : 0
      schedule.Provider = ''
      schedule.PlanTypes = []
      schedule.MinFee = minimumFees.value === '' ? 0.0 : parseFloat(minimumFees.value)
      schedule.MaximumFee = maximumFees.value === '' ? 0.0 : parseFloat(maximumFees.value)
      schedule.AnnualAssets = isAnnualAsset.value ? 1 : 0
      schedule.BaseFee = isBaseFee.value ? 1 : 0
      schedule.AnnualParticipant = 0
      schedule.BaseFeeCharge = baseFee.value === '' ? 0 : parseFloat(baseFee.value)
      schedule.AssetStructure = annualAssetType.value === 'Tiered Fees' ? 0 : 1
      schedule.Active = isActive.value === 1 ? true : false
      schedule.ScheduleType = 'ETF'
      schedule.AssetFeeMin = assetFeeMin.value === '' ? 0 : parseFloat(assetFeeMin.value)
      schedule.Users = ''
      schedule.FootnoteTxt = ''
      schedule.SEINPNO = ''
      schedule.ConversionFee = 0
      schedule.DocumentFee = 0
      schedule.InstallationFee = 0
      schedule.TrusteeCustodian = ''
      schedule.SubCustodian = ''
      schedule.ETFSchedule = 0
      schedule.RKBaseHeader = ''
      schedule.RKParticipantHeader = ''
      schedule.RKAssetHeader = ''
      schedule.Startups = ''
      schedule.BusinessType = ''
      schedule.DefaultFeeSchedule = false
      schedule.AllUsers = false

      //Asset Tier fees Details
      if (isAnnualAsset.value) {
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

      if (props.from === 'editETF') document.getElementsByClassName('card_text_height')[0].scrollTop = 0
      else document.getElementsByClassName('card_text_height')[1].scrollTop = 0
      dialog.value = false
      $axios.put(`/api/v1/tal/feeschedule`, schedule).then(() => {
        eventBus.emit('getETFFee')
        resetFees()
        dialog.value = false
      })
    }
    function close() {
      resetFees()
      dialog.value = false
    }
    function resetFees() {
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
      annualAssetType.value = 'Linear Fee Structure'
      id.value = 0
      isActive.value = 1
      assetFeeMin.value = 0
      part1Base.value = 0
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
      maximumFeesErrorMsg.value = ''
      maximumFeesError.value = false
      greaterThanAssetBlended.value = false
      greaterThanAssetBreakpoint.value = false
      disableAssetBlendedFee.value = false
      disableAssetBreakpointFee.value = false
      if (props.from === 'editETF') document.getElementsByClassName('card_text_height')[0].scrollTop = 0
      else document.getElementsByClassName('card_text_height')[1].scrollTop = 0
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
                } else {
                  annualAssetBreakpoint.value[i + 1].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
                  if (annualAssetBreakpoint.value[i + 1].minAsset >= annualAssetBreakpoint.value[i + 1].maxAsset) {
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetsBreakpoint.value[i + 1].maxAsset = 0
                    annualAssetsBreakpoint.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBreakpoint.value[i + 1].assetBasedError = false
                  }
                }
              } else {
                var linearAssetBasedBreakpoint = annualAssetBreakpoint.value[i]
                var checkedValue1 = annualAssetBreakpoint.value.filter((a) => a.show === true && a.maxAsset > 0)
                annualAssetBreakpoint.value[i + 1].minAsset = parseInt(linearAssetBasedBreakpoint.maxAsset)
                if (checkedValue1.length - 1 !== i) {
                  if (annualAssetBreakpoint.value[i + 1].minAsset >= annualAssetBreakpoint.value[i + 1].maxAsset) {
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetsBreakpoint.value[i + 1].maxAsset = 0
                    annualAssetsBreakpoint.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBreakpoint.value[i + 1].assetBasedError = false
                  }
                } else {
                  annualAssetBreakpoint.value[i + 1].assetBasedError = false
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
                } else {
                  annualAssetBlended.value[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint.asset)
                  if (annualAssetBlended.value[i + 1].minimumAssetFees >= annualAssetBlended.value[i + 1].asset) {
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetBlended.value[i + 1].asset = 0
                    annualAssetBlended.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBlended.value[i + 1].assetBasedError = false
                  }
                }
              } else {
                var tieredAssetBasedBreakpoint1 = annualAssetBlended.value[i]
                var tiredCheckedValue1 = annualAssetBlended.value.filter((a) => a.show === true && a.asset > 0)
                annualAssetBlended.value[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint1.asset)
                if (tiredCheckedValue1.length - 1 !== i) {
                  if (annualAssetBlended.value[i + 1].minimumAssetFees >= annualAssetBlended.value[i + 1].asset) {
                    $toast.error(`To Amount should be greater than From Amount`, '')
                    annualAssetBlended.value[i + 1].asset = 0
                    annualAssetBlended.value[i + 1].assetBasedError = true
                    return
                  } else {
                    annualAssetBlended.value[i + 1].assetBasedError = false
                  }
                } else {
                  annualAssetBlended.value[i + 1].assetBasedError = false
                }
              }
            }
          }
        }
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
    function validateFees() {
      if (parseFloat(maximumFees.value) !== 0) {
        if (parseFloat(maximumFees.value) <= parseFloat(minimumFees.value)) {
          maximumFeesError.value = true
          maximumFeesErrorMsg.value = 'Maximum fee should be greater than Minimum fee'
        } else {
          maximumFeesError.value = false
          maximumFeesErrorMsg.value = ''
        }
      } else {
        maximumFeesError.value = false
        maximumFeesErrorMsg.value = ''
      }
    }
    function editScheduleFee(tmp_id, tmp_readOnly) {
      readOnly.value = tmp_readOnly
      $axios.get(`/api/v1/tal/feeschedule/${tmp_id}`).then((success) => {
        if (success.data.d !== null) {
          dialog.value = true
          id.value = success.data.d.id
          feeScheduleName.value = success.data.d.name
          minimumFees.value = success.data.d.minFee
          maximumFees.value = success.data.d.maximumFee
          part1Base.value = success.data.d.part1Base
          isAnnualAsset.value = success.data.d.annualAssets === 1 || success.data.d.assetFee1.max !== 0 ? true : false
          isBaseFee.value = success.data.d.baseFee === 1 ? true : false
          baseFee.value = success.data.d.baseFeeCharge
          annualAssetType.value = success.data.d.assetStructure === 0 ? 'Tiered Fees' : 'Linear Fee Structure'
          isActive.value = success.data.d.active === true ? 1 : 0
          scheduleType.value = 'ETF'
          assetFeeMin.value = success.data.d.assetFeeMin
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
        }
      })
    }
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
    watch(
      () => breakpoint.value,
      (val) => {
        if (val) blended.value = false
      }
    )
    watch(
      () => blended.value,
      (val) => {
        if (val) breakpoint.value = false
      }
    )
    watch(
      () => isAnnualAsset.value,
      (val) => {
        if (!val) annualAssetType.value = 'Linear Fee Structure'
      }
    )
    watch(
      () => minimumFees.value,
      (oldvalue, newvalue) => {
        if (oldvalue !== newvalue && maximumFees.value !== 0) {
          validateFees()
        }
      }
    )
    return {
      theme,
      display,
      $authz,
      dialog,
      feeScheduleName,
      scheduleType,
      scheduleNameErrorMsg,
      scheduleNameError,
      readOnly,
      items,
      minimumFees,
      minimumGreaterThanBaseErrorMsg,
      minimumGreaterThanBaseError,
      maximumFees,
      maximumFeesErrorMsg,
      maximumFeesError,
      part1Base,
      isBaseFee,
      baseFee,
      showAssetBasedFee,
      isAnnualAsset,
      annualAssetType,
      annualAssetBlended,
      greaterThanAssetBlended,
      checkActiveBlended,
      formatPrice,
      error,
      disableAssetBlendedFee,
      annualAssetBreakpoint,
      greaterThanAssetBreakpoint,
      checkActiveBreakpoint,
      etfAssetLinear,
      disableAssetBreakpointFee,
      assets,
      checkerror,
      editScheduleFee,
      close,
      checkFeeScheduleName,
      checkFeeStatus,
      validateFees,
      checkGreaterValue,
      checkFeePercent,
      removeBlendedRow,
      addBlendedRow,
      removeBreakpointRow,
      addBreakpointRow,
      SaveSchedule
    }
  }
}
</script>
<style scoped>
.background_fees {
  background-color: #d3d3d359 !important;
}
.card_text_height {
  height: 700px !important;
}
.feeschedule label {
  font-size: 1.1em !important;
}
.divider {
  border-color: rgba(0, 0, 0, 0.42) !important;
}
</style>
