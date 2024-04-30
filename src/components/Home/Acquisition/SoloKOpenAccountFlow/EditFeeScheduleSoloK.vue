<template>
  <v-flex>
    <v-flex class="text-center" pb-4>
      <h1>Edit Fee Schedule</h1>
    </v-flex>
    <v-row class="justify-center">
      <v-flex class="xl10 sm12 xs12 md10 lg10 mt-3 text-center" id="AnnualAsset">
        <v-flex xs12>
          <v-radio-group :disabled="readOnly" v-model="annualAssetType" class="mt-0 pt-0">
            <v-radio color="accent" value="Flat Fee">
              <template v-slot:label>
                <div>
                  Use a
                  <b>Flat Fee Structure.</b>
                  All assets are charged this amount irrespective of the asset value.
                </div>
              </template>
            </v-radio>
            <v-flex xl12 sm12 xs12 md12 lg12 ml-8 v-if="annualAssetType === 'Flat Fee'">
              <v-flex v-show="annualAssetType === 'Flat Fee'" class="xl8 lg8 sm11 md10 xs12 pb-2">
                <v-row>
                  <v-flex xs12 sm5 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                    <div class="text-subtitle-1 font-weight-bold pb-1">Flat Fee</div>
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      prefix="$"
                      maxlength="13"
                      v-model="flatFeeDollar"
                      @update:model-value="checkFee('dollar', 'flatFee')"
                      v-input-mask="{
                        alias: 'currency',
                        rightAlign: false,
                        autoUnmask: true,
                        allowMinus: false,
                        digitsOptional: true,
                        placeholder: '0'
                      }"
                    ></v-text-field>
                  </v-flex>
                  <v-flex
                    xs12
                    sm2
                    :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'"
                    class="text-subtitle-1 font-weight-bold align-self-center text-center"
                    >OR</v-flex
                  >
                  <v-flex xs12 sm5 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'" class="align-self-end">
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      maxlength="13"
                      v-model="flatFeePercent"
                      @update:model-value="checkFee('percent', 'flatFee')"
                      v-input-mask="{
                        alias: 'numeric',
                        digits: '2',
                        digitsOptional: true,
                        rightAlign: false,
                        allowMinus: false,
                        placeholder: '',
                        autoUnmask: true,
                        max: '100'
                      }"
                      suffix="%"
                    ></v-text-field>
                  </v-flex>
                </v-row>
              </v-flex>
            </v-flex>
            <v-radio color="accent" value="Linear Fee Structure">
              <template v-slot:label>
                <div>
                  Use a
                  <b>Linear Fee Structure</b>
                  or "breakpoint" fee structure. Once a level is reached, all assets are charged that percentage.
                </div>
              </template>
            </v-radio>
            <v-flex xl12 sm12 xs12 md12 lg12 ml-8 v-if="annualAssetType === 'Linear Fee Structure'">
              <v-flex v-show="annualAssetType === 'Linear Fee Structure'" class="xl8 lg8 sm11 md10 xs12 pb-2">
                <v-flex xl12 lg12 sm12 xs12 md12 pt-1 pb-1>
                  <v-row>
                    <v-flex xl3 sm3 lg3 md3 xs4 v-if="!$vuetify.breakpoint.xsOnly"></v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs12 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                      <div class="text-subtitle-1 font-weight-bold pb-1">Minimum Fee</div>
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        prefix="$"
                        maxlength="13"
                        hide-details
                        v-model="linearMinimumFee"
                        @update:model-value="checkFee('minimum', 'linear')"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: '0'
                        }"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs12 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                      <div class="text-subtitle-1 font-weight-bold pb-1">Base Fee</div>
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        prefix="$"
                        maxlength="13"
                        hide-details
                        @update:model-value="checkFee('base', 'linear')"
                        v-model="linearBaseFee"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: '0'
                        }"
                      ></v-text-field>
                    </v-flex>
                  </v-row>
                </v-flex>
                <v-flex xl12 lg12 sm12 xs12 md12 pt-3 pb-2>
                  <v-row>
                    <v-flex xl3 sm3 lg3 md3 xs4>
                      <v-row>
                        <v-flex xs4 sm3></v-flex>
                        <v-flex xs7 sm8 class="text-subtitle-1 font-weight-bold">From ($)</v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs3 class="text-subtitle-1 font-weight-bold">To ($)</v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs3 class="text-subtitle-1 font-weight-bold">Fee Rate (%)</v-flex>
                  </v-row>
                </v-flex>
                <v-flex v-for="(item, index) in annualAssetBreakpoint" :key="index">
                  <v-row v-show="item.show">
                    <v-flex xl3 sm3 lg3 md3 xs4>
                      <v-row>
                        <v-flex xs4 sm3>
                          <v-btn
                            :disabled="readOnly"
                            icon
                            :ripple="false"
                            size="small"
                            class="ml-0"
                            v-if="checkActiveBreakpoint.length === index + 1 && !readOnly"
                            @click="
                              greaterThanAssetBreakpoint = !greaterThanAssetBreakpoint
                              checkGreaterValue('asset', 'linear', index)
                            "
                          >
                            <CustomIcon :type="greaterThanAssetBreakpoint ? 'greaterthanOn' : 'greaterthanOff'" />
                          </v-btn>
                        </v-flex>
                        <v-flex xs7 sm8 class="align-self">
                          <h3 class="font_16">{{ formatPrice(item['minAsset'], 0) }}</h3>
                        </v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs3 pr-2 pb-3>
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        v-model="item['maxAsset']"
                        Single-line
                        prefix="$"
                        maxlength="13"
                        @focus="$event.target.select()"
                        v-input-mask="{
                          alias: 'currency',
                          digits: '0',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          placeholder: '0'
                        }"
                        hide-details
                        @blur="checkFeePercent(index, 'linear', 'Asset')"
                        :disabled="readOnly"
                        ref="etfAssetLinear"
                        :error="item['assetBasedError']"
                        v-if="item['hideMaxAsset']"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs3 pr-1 pb-3>
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        Single-line
                        v-model="item['breakpointPercent']"
                        :error="error"
                        @focus="$event.target.select()"
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
                        hide-details
                        :disabled="readOnly"
                        suffix="%"
                        @change="checkFeeRate(index, 'Linear')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xl1 sm1 lg1 md1 xs1 ml-2>
                      <v-btn icon class="ma-0" :disabled="readOnly">
                        <v-icon :color="$vuetify.theme.dark ? '' : 'error'" @click="removeBreakpointRow(index, 'Asset')"
                          >mdi-close-circle</v-icon
                        >
                      </v-btn>
                    </v-flex>
                  </v-row>
                  <v-flex
                    pt-2
                    xs12
                    v-if="checkActiveBreakpoint.length === index + 1 && checkActiveBreakpoint.length !== 7 && !readOnly"
                  >
                    <v-btn
                      :ripple="false"
                      :color="$vuetify.theme.dark ? '' : 'accent'"
                      class="ma-0"
                      @click="addBreakpointRow(index, 'Asset')"
                      :disabled="disableAssetBreakpointFee"
                      size="small"
                      >Add Row</v-btn
                    >
                  </v-flex>
                </v-flex>
              </v-flex>
            </v-flex>
            <v-radio value="Tiered Fees" class="mt-2" color="accent">
              <template v-slot:label>
                <div>
                  Use a
                  <b>Tiered Fee Structure</b>
                  or "blended" fee structure. Each range is charged the % fee, even as assets grow.
                </div>
              </template>
            </v-radio>
            <v-flex xl12 sm12 xs12 md12 lg12 ml-8 v-if="annualAssetType === 'Tiered Fees'">
              <v-flex v-show="annualAssetType === 'Tiered Fees'" class="xl8 lg8 sm11 md10 xs12 pb-2">
                <v-flex xl12 lg12 sm12 xs12 md12 pt-1 pb-1>
                  <v-row>
                    <v-flex xl3 sm3 lg3 md3 xs4 v-if="!$vuetify.breakpoint.xsOnly"></v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs12 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                      <div class="text-subtitle-1 font-weight-bold pb-1">Minimum Fee</div>
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        prefix="$"
                        maxlength="13"
                        hide-details
                        v-model="tieredMinimumFee"
                        @update:model-value="checkFee('minimum', 'tiered')"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: '0'
                        }"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs12 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : 'pr-2'">
                      <div class="text-subtitle-1 font-weight-bold pb-1">Base Fee</div>
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        prefix="$"
                        maxlength="13"
                        hide-details
                        v-model="tieredBaseFee"
                        @update:model-value="checkFee('base', 'tiered')"
                        v-input-mask="{
                          alias: 'currency',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          digitsOptional: true,
                          placeholder: '0'
                        }"
                      ></v-text-field>
                    </v-flex>
                  </v-row>
                </v-flex>
                <v-flex xl12 lg12 sm12 xs12 md12 pt-3 pb-2>
                  <v-row>
                    <v-flex xl3 sm3 lg3 md3 xs4>
                      <v-row>
                        <v-flex xs4 sm3></v-flex>
                        <v-flex xs7 sm8 class="text-subtitle-1 font-weight-bold">From ($)</v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs3 class="text-subtitle-1 font-weight-bold">To ($)</v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs3 class="text-subtitle-1 font-weight-bold">Fee Rate (%)</v-flex>
                  </v-row>
                </v-flex>
                <v-flex v-for="(item, index) in annualAssetBlended" :key="index">
                  <v-row v-show="item.show">
                    <v-flex xl3 sm3 lg3 md3 xs4>
                      <v-row>
                        <v-flex xs4 sm3>
                          <v-btn
                            :disabled="readOnly"
                            icon
                            :ripple="false"
                            size="small"
                            class="ml-0"
                            v-if="checkActiveBlended.length === index + 1 && !readOnly"
                            @click="
                              greaterThanAssetBlended = !greaterThanAssetBlended
                              checkGreaterValue('asset', 'tiered', index)
                            "
                          >
                            <CustomIcon :type="greaterThanAssetBlended ? 'greaterthanOn' : 'greaterthanOff'" />
                          </v-btn>
                        </v-flex>
                        <v-flex xs7 sm8 class="align-self">
                          <h3 class="font_16">
                            {{ formatPrice(item['minimumAssetFees'], 0) }}
                          </h3>
                        </v-flex>
                      </v-row>
                    </v-flex>
                    <v-flex xl3 sm3 lg3 md3 xs3 pr-2 pb-3>
                      <v-text-field
                        variant="outlined"
                        density="compact"
                        v-model="item['asset']"
                        Single-line
                        prefix="$"
                        maxlength="13"
                        v-input-mask="{
                          alias: 'currency',
                          digits: '0',
                          rightAlign: false,
                          autoUnmask: true,
                          allowMinus: false,
                          placeholder: '0'
                        }"
                        @focus="$event.target.select()"
                        hide-details
                        :error="item['assetBasedError']"
                        v-if="item['hideMaxAsset']"
                        @blur="checkFeePercent(index, 'tiered', 'Asset')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xl3 lg3 sm3 md3 xs3 pr-1 pb-3>
                      <v-text-field
                        :disabled="readOnly"
                        variant="outlined"
                        density="compact"
                        Single-line
                        v-model="item['percent']"
                        maxlength="10"
                        :error="error"
                        @focus="$event.target.select()"
                        hide-details
                        v-input-mask="{
                          alias: 'numeric',
                          digits: '3',
                          rightAlign: false,
                          allowMinus: false,
                          placeholder: '0',
                          autoUnmask: true
                        }"
                        suffix="%"
                        @blur="checkFeeRate(index, 'Tiered')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xl1 sm1 lg1 md1 xs1 ml-2>
                      <v-btn icon class="ma-0" :disabled="readOnly">
                        <v-icon :color="$vuetify.theme.dark ? '' : 'error'" @click="removeBlendedRow(index, 'Asset')"
                          >mdi-close-circle</v-icon
                        >
                      </v-btn>
                    </v-flex>
                  </v-row>
                  <v-flex
                    pt-2
                    xs12
                    v-if="checkActiveBlended.length === index + 1 && checkActiveBlended.length !== 7 && !readOnly"
                  >
                    <v-btn
                      :ripple="false"
                      :color="$vuetify.theme.dark ? '' : 'accent'"
                      class="ma-0"
                      @click="addBlendedRow(index, 'Asset')"
                      :disabled="disableAssetBlendedFee"
                      size="small"
                      >Add Row</v-btn
                    >
                  </v-flex>
                </v-flex>
              </v-flex>
            </v-flex>
          </v-radio-group>
        </v-flex>
      </v-flex>
    </v-row>
    <v-flex pt-8>
      <v-flex class="text-center">
        <v-col class="pa-0">
          <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="nextSlide()">Next</v-btn>
        </v-col>
        <v-col class="pl-0 pr-0 pt-2">
          <v-btn class="text-capitalize" variant="outlined" :color="$vuetify.theme.dark ? '' : 'accent'" @click="prevSlide()"
            >Go Back</v-btn
          >
        </v-col>
      </v-flex>
    </v-flex>
  </v-flex>
</template>
<script>
import CustomIcon from '@/components/CustomIcon'
export default {
  data() {
    return {
      annualAssetType: 'Flat Fee',
      readOnly: false,
      annualAssetsBlended: [
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
        },
        {
          Id: 7,
          hideMaxAsset: true,
          show: false,
          minimumAssetFees: 0,
          asset: 0,
          assetBasedError: false,
          percent: 0
        }
      ],
      annualAssetsBreakpoint: [
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
        },
        {
          Id: 7,
          hideMaxAsset: true,
          show: false,
          minAsset: 0,
          maxAsset: 0,
          breakpointPercent: 0,
          assetBasedError: false
        }
      ],
      error: false,
      greaterThanAssetBlended: false,
      greaterThanAssetBreakpoint: false,
      disableAssetBlendedFee: false,
      disableAssetBreakpointFee: false,
      linearMinimumFee: 0,
      linearBaseFee: 0,
      tieredMinimumFee: 0,
      tieredBaseFee: 0,
      flatFeeDollar: '',
      flatFeePercent: ''
    }
  },
  watch: {
    breakpoint(val) {
      if (val) this.blended = false
    },
    blended(val) {
      if (val) this.breakpoint = false
    }
  },
  components: {
    CustomIcon
  },
  computed: {
    annualAssetBlended() {
      return this.annualAssetsBlended
    },
    annualAssetBreakpoint() {
      return this.annualAssetsBreakpoint
    },
    checkActiveBlended() {
      return this.annualAssetBlended.filter((a) => a.show === true)
    },
    checkActiveBreakpoint() {
      return this.annualAssetBreakpoint.filter((a) => a.show === true)
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      let feeScheduleTier = this.$store.state.soloKOpenAccountDetail.FeeScheduleTier
        ? this.$store.state.soloKOpenAccountDetail.FeeScheduleTier
        : {}
      if (Object.keys(feeScheduleTier).length > 0) {
        if (feeScheduleTier.Linear) {
          this.annualAssetType = 'Linear Fee Structure'
        } else if (feeScheduleTier.Blended) {
          this.annualAssetType = 'Tiered Fees'
        } else {
          this.annualAssetType = 'Flat Fee'
        }
      }
      if (this.annualAssetType === 'Flat Fee') {
        if (feeScheduleTier.AnnualFeeType && feeScheduleTier.AnnualFeeType === 'percent') {
          this.flatFeePercent = feeScheduleTier.AnnualFee ? feeScheduleTier.AnnualFee : ''
          this.flatFeeDollar = ''
        } else if (feeScheduleTier.AnnualFeeType && feeScheduleTier.AnnualFeeType === 'dollar') {
          this.flatFeeDollar = feeScheduleTier.AnnualFee ? feeScheduleTier.AnnualFee : ''
          this.flatFeePercent = ''
        } else {
          this.flatFeeDollar = ''
          this.flatFeePercent = ''
        }
        this.linearMinimumFee = ''
        this.linearBaseFee = ''
        this.tieredBaseFee = ''
        this.tieredMinimumFee = ''
      } else if (this.annualAssetType === 'Linear Fee Structure') {
        this.flatFeeDollar = ''
        this.flatFeePercent = ''
        this.linearMinimumFee = feeScheduleTier.Minimum ? feeScheduleTier.AnnualFee : ''
        this.linearBaseFee = feeScheduleTier.Base ? feeScheduleTier.AnnualFee : ''
        this.tieredBaseFee = ''
        this.tieredMinimumFee = ''
      } else {
        this.flatFeeDollar = ''
        this.flatFeePercent = ''
        this.linearMinimumFee = ''
        this.linearBaseFee = ''
        this.tieredBaseFee = feeScheduleTier.Base ? feeScheduleTier.AnnualFee : ''
        this.tieredMinimumFee = feeScheduleTier.Minimum ? feeScheduleTier.AnnualFee : ''
      }
      let feeTiers = feeScheduleTier.FeeTiers && feeScheduleTier.FeeTiers.length > 0 ? feeScheduleTier.FeeTiers : []
      if (feeTiers && feeTiers.length > 0) {
        //Asset Tired Fee
        if (this.annualAssetType === 'Tiered Fees') {
          for (let i = 0; i < feeTiers.length; i++) {
            if (feeTiers[i].UpperValue !== 0 || feeTiers[i].Fee !== 0) {
              this.annualAssetsBlended[i].show = true
              this.annualAssetsBlended[i].minimumAssetFees = feeTiers[i].LowerValue !== 0 ? feeTiers[i].LowerValue : 0
              this.annualAssetsBlended[i].asset = feeTiers[i].UpperValue !== 0 ? feeTiers[i].UpperValue : 0
              this.annualAssetsBlended[i].percent = feeTiers[i].Fee
            } else {
              this.annualAssetsBlended[i].show = false
              this.annualAssetsBlended[i].minimumAssetFees = 0
              this.annualAssetsBlended[i].asset = 0
              this.annualAssetsBlended[i].percent = 0
            }
          }
          var checkFees = this.annualAssetsBlended.filter((a) => a.show === true)
          if (checkFees.length === 0) {
            this.annualAssetsBlended.map((element, index) => {
              if (index < 2) element.show = true
            })
          } else if (checkFees.length === 1) {
            var tiredFee = this.annualAssetsBlended[checkFees.length].minimumAssetFees
            var tiredValue = this.annualAssetsBlended[0]
            if (tiredValue) {
              this.greaterThanAssetBlended =
                this.annualAssetsBlended[0].minimumAssetFees === 0 &&
                this.annualAssetsBlended[0].asset === 0 &&
                this.annualAssetsBlended[0].percent > 0
                  ? true
                  : false
              if (this.greaterThanAssetBlended) {
                this.disableAssetBlendedFee = true
                this.annualAssetsBlended[checkFees.length - 1].hideMaxAsset = false
              } else {
                this.disableAssetBlendedFee = false
              }
            }
            if (tiredFee === 0) {
              this.annualAssetsBlended[checkFees.length].minimumAssetFees = this.annualAssetsBlended[checkFees.length - 1].asset
            }
          } else {
            this.greaterThanAssetBlended = this.annualAssetsBlended[checkFees.length - 1].asset === 0 ? true : false
            if (this.greaterThanAssetBlended) {
              this.disableAssetBlendedFee = true
              this.annualAssetsBlended[checkFees.length - 1].hideMaxAsset = false
            } else {
              this.disableAssetBlendedFee = false
            }
          }
        }
        //Asset Linear fee
        if (this.annualAssetType === 'Linear Fee Structure') {
          for (let j = 0; j < feeTiers.length; j++) {
            if (feeTiers[j].UpperValue !== 0 || feeTiers[j].Fee !== 0 || feeTiers[j].LowerValue !== 0) {
              this.annualAssetsBreakpoint[j].show = true
              this.annualAssetsBreakpoint[j].minAsset = feeTiers[j].LowerValue !== 0 ? feeTiers[j].LowerValue : 0
              this.annualAssetsBreakpoint[j].maxAsset = feeTiers[j].UpperValue !== 0 ? feeTiers[j].UpperValue : 0
              this.annualAssetsBreakpoint[j].breakpointPercent = feeTiers[j].Fee
            } else {
              this.annualAssetsBreakpoint[j].show = false
              this.annualAssetsBreakpoint[j].minAsset = 0
              this.annualAssetsBreakpoint[j].maxAsset = 0
              this.annualAssetsBreakpoint[j].breakpointPercent = 0
            }
          }

          var checkLinearFees = this.annualAssetsBreakpoint.filter((a) => a.show === true)
          if (checkLinearFees.length === 0) {
            this.annualAssetsBreakpoint.map((element, index) => {
              if (index < 2) element.show = true
            })
          } else if (checkLinearFees.length === 1) {
            var linearFee = this.annualAssetsBreakpoint[checkLinearFees.length].minAsset
            var linearValue = this.annualAssetsBreakpoint[0]
            if (linearValue) {
              this.greaterThanAssetBreakpoint =
                this.annualAssetsBreakpoint[0].minAsset === 0 &&
                this.annualAssetsBreakpoint[0].maxAsset === 0 &&
                this.annualAssetsBreakpoint[0].breakpointPercent > 0
                  ? true
                  : false
              if (this.greaterThanAssetBreakpoint) {
                this.disableAssetBreakpointFee = true
                this.annualAssetsBreakpoint[checkLinearFees.length - 1].hideMaxAsset = false
              } else {
                this.disableAssetBreakpointFee = false
              }
            }
            if (linearFee === 0) {
              this.annualAssetsBreakpoint[checkLinearFees.length].minAsset =
                this.annualAssetsBreakpoint[checkLinearFees.length - 1].maxAsset
            }
          } else {
            this.greaterThanAssetBreakpoint =
              this.annualAssetsBreakpoint[checkLinearFees.length - 1].maxAsset === 0 ? true : false
            if (this.greaterThanAssetBreakpoint) {
              this.disableAssetBreakpointFee = true
              this.annualAssetsBreakpoint[checkLinearFees.length - 1].hideMaxAsset = false
            } else {
              this.disableAssetBreakpointFee = false
            }
          }
        }
      }
    }
  },
  methods: {
    checkFee(val, type) {
      if (type === 'flatFee') {
        if (val === 'dollar') {
          this.flatFeePercent = ''
        } else if (val === 'percent') {
          this.flatFeeDollar = ''
        }
      } else if (type === 'linear') {
        if (val === 'minimum') {
          this.linearBaseFee = ''
        } else if (val === 'base') {
          this.linearMinimumFee = ''
        }
      } else if (type === 'tiered') {
        if (val === 'minimum') {
          this.tieredBaseFee = ''
        } else if (val === 'base') {
          this.tieredMinimumFee = ''
        }
      }
    },
    addBlendedRow(index, type) {
      var i = index + 1
      if (type === 'Asset') {
        var assetBlendValue = parseInt(this.annualAssetBlended[index].asset)
        this.annualAssetBlended.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.minimumAssetFees = this.greaterThanAssetBlended ? assetBlendValue : assetBlendValue > 0 ? assetBlendValue : 0
            element.show = true
          }
        })
      }
    },
    addBreakpointRow(index, type) {
      var i = index + 1
      if (type === 'Asset') {
        var assetValue = parseInt(this.annualAssetBreakpoint[index].maxAsset)
        this.annualAssetBreakpoint.forEach((element, index) => {
          if (element.show === false && i === index) {
            element.minAsset = this.greaterThanAssetBreakpoint ? assetValue : assetValue > 0 ? assetValue : 0
            element.show = true
          }
        })
      }
    },
    removeBlendedRow(i, type) {
      if (type === 'Asset') {
        var check = this.annualAssetBlended.filter((a) => a.show === true)
        if (check.length === 1) return
        this.annualAssetBlended.forEach((element, index) => {
          if (i === index) {
            element.show = false
            this.annualAssetsBlended.splice(i, 1)
            this.annualAssetsBlended.push({
              hideMaxAsset: true,
              show: false,
              minimumAssetFees: 0,
              asset: 0,
              percent: 0,
              assetBasedError: false
            })
          }
        })
        if (i > 0 && i !== 6) {
          if (this.greaterThanAssetBlended) {
            var check1 = this.annualAssetsBlended.filter((a) => a.show)
            if (check1.length - 1 === i) {
              this.annualAssetsBlended[i].minimumAssetFees = parseInt(this.annualAssetsBlended[i - 1].asset)
            } else {
              this.annualAssetsBlended[i].minimumAssetFees = parseInt(this.annualAssetsBlended[i - 1].asset)
            }
          } else {
            this.annualAssetsBlended[i].minimumAssetFees = parseInt(this.annualAssetsBlended[i - 1].asset)
          }
        }
        if (i === 6) {
          if (this.greaterThanAssetBlended) {
            this.annualAssetsBlended[i - 1].minimumAssetFees = parseInt(this.annualAssetsBlended[i - 2].asset)
            this.annualAssetsBlended[i - 1].hideMaxAsset = false
          } else {
            this.annualAssetsBlended[i - 1].minimumAssetFees = parseInt(this.annualAssetsBlended[i - 2].asset)
            this.annualAssetsBlended[i - 1].hideMaxAsset = true
          }
        }
      }
    },
    removeBreakpointRow(i, type) {
      if (type === 'Asset') {
        var check = this.annualAssetBreakpoint.filter((a) => a.show === true)
        if (check.length === 1) return
        this.annualAssetBreakpoint.forEach((element, index) => {
          if (i === index) {
            element.show = false
            this.annualAssetsBreakpoint.splice(i, 1)
            this.annualAssetsBreakpoint.push({
              hideMaxAsset: true,
              show: false,
              minAsset: 0,
              maxAsset: 0,
              breakpointPercent: 0,
              assetBasedError: false
            })
          }
        })
        if (i > 0 && i !== 6) {
          if (this.greaterThanAssetBreakpoint) {
            var checkVal = this.annualAssetsBreakpoint.filter((a) => a.show)
            if (checkVal.length - 1 === i) {
              this.annualAssetsBreakpoint[i].minAsset = parseInt(this.annualAssetsBreakpoint[i - 1].maxAsset)
            } else {
              this.annualAssetsBreakpoint[i].minAsset = parseInt(this.annualAssetsBreakpoint[i - 1].maxAsset)
            }
          } else {
            this.annualAssetsBreakpoint[i].minAsset = parseInt(this.annualAssetsBreakpoint[i - 1].maxAsset)
          }
        }
        if (i === 6) {
          if (this.greaterThanAssetBreakpoint) {
            this.annualAssetsBreakpoint[i - 1].minAsset = parseInt(this.annualAssetsBreakpoint[i - 2].maxAsset)
            this.annualAssetsBreakpoint[i - 1].hideMaxAsset = false
          } else {
            this.annualAssetsBreakpoint[i - 1].minAsset = parseInt(this.annualAssetsBreakpoint[i - 2].maxAsset)
            this.annualAssetsBreakpoint[i - 1].hideMaxAsset = true
          }
        }
      }
    },
    checkGreaterValue(val, type, index) {
      if (val === 'asset') {
        if (type === 'linear') {
          if (this.greaterThanAssetBreakpoint) {
            if (index > 0) {
              var assetBasedBreakpoint = this.annualAssetBreakpoint[index - 1]
              this.annualAssetBreakpoint[index].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
            }
            this.annualAssetBreakpoint[index].assetBasedError = false
            this.annualAssetBreakpoint[index].maxAsset = 0
            this.annualAssetBreakpoint[index].hideMaxAsset = false
            this.annualAssetBreakpoint[index].show = true
            this.annualAssetBreakpoint.forEach((element, i) => {
              if (index < i) {
                element.show = false
              }
            })
            this.disableAssetBreakpointFee = true
            this.$toast.destroy()
          } else {
            if (index > 0) {
              var linearAssetBasedBreakpoint = this.annualAssetBreakpoint[index - 1]
              this.annualAssetBreakpoint[index].minAsset = parseInt(linearAssetBasedBreakpoint.maxAsset)
            }
            this.annualAssetBreakpoint[index].assetBasedError = false
            this.annualAssetBreakpoint[index].maxAsset = 0
            this.annualAssetBreakpoint[index].hideMaxAsset = true
            this.annualAssetBreakpoint[index].show = true
            this.disableAssetBreakpointFee = false
          }
        } else {
          if (this.greaterThanAssetBlended) {
            if (index > 0) {
              var assetBasedBlend = this.annualAssetBlended[index - 1]
              this.annualAssetBlended[index].minimumAssetFees = parseInt(assetBasedBlend.asset)
            }
            this.annualAssetBlended[index].assetBasedError = false
            this.annualAssetBlended[index].asset = 0
            this.annualAssetBlended[index].hideMaxAsset = false
            this.annualAssetBlended[index].show = true
            this.annualAssetBlended.forEach((element, i) => {
              if (index < i) {
                element.show = false
              }
            })
            this.disableAssetBlendedFee = true
            this.$toast.destroy()
          } else {
            if (index > 0) {
              var tierredAssetBasedBlend = this.annualAssetBlended[index - 1]
              this.annualAssetBlended[index].minimumAssetFees = parseInt(tierredAssetBasedBlend.asset)
            }
            this.annualAssetBlended[index].assetBasedError = false
            this.annualAssetBlended[index].asset = 0
            this.annualAssetBlended[index].hideMaxAsset = true
            this.annualAssetBlended[index].show = true
            this.disableAssetBlendedFee = false
          }
        }
      }
    },
    checkFeeRate(index, type) {
      if (type === 'Linear') {
        var linearFeeRate = this.annualAssetBreakpoint[index].breakpointPercent
          ? parseFloat(this.annualAssetBreakpoint[index].breakpointPercent)
          : 0
        this.annualAssetBreakpoint[index].breakpointPercent = linearFeeRate
      } else {
        var tieredFeeRate = this.annualAssetBlended[index].percent ? parseFloat(this.annualAssetBlended[index].percent) : 0
        this.annualAssetBlended[index].percent = tieredFeeRate
      }
    },
    checkFeePercent(i, val, type) {
      if (type === 'Asset') {
        if (val === 'linear') {
          var checkMinimumLinearAsset = parseFloat(this.annualAssetsBreakpoint[i].minAsset)

          var checkLinearPercent = parseFloat(this.annualAssetsBreakpoint[i].maxAsset)
          if (isNaN(checkLinearPercent)) this.annualAssetsBreakpoint[i].maxAsset = 0
          else if (checkMinimumLinearAsset === 0 && checkLinearPercent === 0) {
            this.annualAssetsBreakpoint[i].assetBasedError = false
          } else {
            if (checkMinimumLinearAsset >= checkLinearPercent) {
              this.$toast.destroy()
              this.$toast.error(`To Amount should be greater than From Amount`, '', this.notificationSystem.options.error)
              this.annualAssetsBreakpoint[i].maxAsset = 0
              this.annualAssetsBreakpoint[i].assetBasedError = true
              return
            } else {
              this.annualAssetsBreakpoint[i].maxAsset = checkLinearPercent
              var assetValue = this.annualAssetsBreakpoint[i]
              if (assetValue) {
                assetValue.assetBasedError = false
                this.annualAssetsBreakpoint.splice(i, 1, assetValue)
              }
            }
            if (i < 6) {
              if (this.greaterThanAssetBreakpoint) {
                var assetBasedBreakpoint = this.annualAssetBreakpoint[i]
                var checkedValue = this.annualAssetBreakpoint.filter((a) => a.show === true && a.maxAsset > 0)
                var assetBasedBreakpointPosition = checkedValue && checkedValue.length > 0 ? checkedValue.length - 1 : 0
                if (assetBasedBreakpointPosition === i) {
                  this.annualAssetBreakpoint[i + 1].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
                  this.annualAssetBreakpoint[i + 1].assetBasedError = false
                  this.$toast.destroy()
                } else {
                  this.annualAssetBreakpoint[i + 1].minAsset = parseInt(assetBasedBreakpoint.maxAsset)
                  if (this.annualAssetBreakpoint[i + 1].minAsset >= this.annualAssetBreakpoint[i + 1].maxAsset) {
                    this.$toast.destroy()
                    this.$toast.error(`To Amount should be greater than From Amount`, '', this.notificationSystem.options.error)
                    this.annualAssetsBreakpoint[i + 1].maxAsset = 0
                    this.annualAssetsBreakpoint[i + 1].assetBasedError = true
                    return
                  } else {
                    this.annualAssetBreakpoint[i + 1].assetBasedError = false
                    this.$toast.destroy()
                  }
                }
              } else {
                var linearAssetBasedBreakpoint = this.annualAssetBreakpoint[i]
                var checkedValue1 = this.annualAssetBreakpoint.filter((a) => a.show === true && a.maxAsset > 0)
                this.annualAssetBreakpoint[i + 1].minAsset = parseInt(linearAssetBasedBreakpoint.maxAsset)
                if (checkedValue1.length - 1 !== i) {
                  if (this.annualAssetBreakpoint[i + 1].minAsset >= this.annualAssetBreakpoint[i + 1].maxAsset) {
                    this.$toast.destroy()
                    this.$toast.error(`To Amount should be greater than From Amount`, '', this.notificationSystem.options.error)
                    this.annualAssetsBreakpoint[i + 1].maxAsset = 0
                    this.annualAssetsBreakpoint[i + 1].assetBasedError = true
                    return
                  } else {
                    this.annualAssetBreakpoint[i + 1].assetBasedError = false
                    this.$toast.destroy()
                  }
                } else {
                  this.annualAssetBreakpoint[i + 1].assetBasedError = false
                  this.$toast.destroy()
                }
              }
            }
          }
        } else {
          var checkMinimumTieredAsset = parseFloat(this.annualAssetBlended[i].minimumAssetFees)
          var checkTieredPercent = parseFloat(this.annualAssetBlended[i].asset)
          if (isNaN(checkTieredPercent)) this.annualAssetBlended[i].asset = 0
          else if (checkMinimumTieredAsset === 0 && checkTieredPercent === 0) {
            this.annualAssetBlended[i].assetBasedError = false
          } else {
            if (checkMinimumTieredAsset >= checkTieredPercent) {
              this.$toast.destroy()
              this.$toast.error(`To Amount should be greater than From Amount`, '', this.notificationSystem.options.error)
              this.annualAssetBlended[i].asset = 0
              this.annualAssetBlended[i].assetBasedError = true
              return
            } else {
              this.annualAssetBlended[i].asset = checkTieredPercent
              var tieredAssetValue = this.annualAssetBlended[i]
              if (tieredAssetValue) {
                tieredAssetValue.assetBasedError = false
                this.annualAssetBlended.splice(i, 1, tieredAssetValue)
              }
            }
            if (i < 6) {
              if (this.greaterThanAssetBlended) {
                var tieredAssetBasedBreakpoint = this.annualAssetBlended[i]
                var checkedTieredValue = this.annualAssetBlended.filter((a) => a.show === true && a.asset > 0)
                var assetTieredBasedBreakpointPosition =
                  checkedTieredValue && checkedTieredValue.length > 0 ? checkedTieredValue.length - 1 : 0
                if (assetTieredBasedBreakpointPosition === i) {
                  this.annualAssetBlended[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint.asset)
                  this.annualAssetBlended[i + 1].assetBasedError = false
                  this.$toast.destroy()
                } else {
                  this.annualAssetBlended[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint.asset)
                  if (this.annualAssetBlended[i + 1].minimumAssetFees >= this.annualAssetBlended[i + 1].asset) {
                    this.$toast.destroy()
                    this.$toast.error(`To Amount should be greater than From Amount`, '', this.notificationSystem.options.error)
                    this.annualAssetBlended[i + 1].asset = 0
                    this.annualAssetBlended[i + 1].assetBasedError = true
                    return
                  } else {
                    this.annualAssetBlended[i + 1].assetBasedError = false
                    this.$toast.destroy()
                  }
                }
              } else {
                var tieredAssetBasedBreakpoint1 = this.annualAssetBlended[i]
                var tiredCheckedValue1 = this.annualAssetBlended.filter((a) => a.show === true && a.asset > 0)
                this.annualAssetBlended[i + 1].minimumAssetFees = parseInt(tieredAssetBasedBreakpoint1.asset)
                if (tiredCheckedValue1.length - 1 !== i) {
                  if (this.annualAssetBlended[i + 1].minimumAssetFees >= this.annualAssetBlended[i + 1].asset) {
                    this.$toast.destroy()
                    this.$toast.error(`To Amount should be greater than From Amount`, '', this.notificationSystem.options.error)
                    this.annualAssetBlended[i + 1].asset = 0
                    this.annualAssetBlended[i + 1].assetBasedError = true
                    return
                  } else {
                    this.annualAssetBlended[i + 1].assetBasedError = false
                    this.$toast.destroy()
                  }
                } else {
                  this.annualAssetBlended[i + 1].assetBasedError = false
                  this.$toast.destroy()
                }
              }
            }
          }
        }
      }
    },
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.FeeScheduleTier = {}
      this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = ''
      if (this.annualAssetType === 'Flat Fee') {
        if (this.flatFeeDollar && this.flatFeeDollar !== '0') {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = this.flatFeeDollar ? this.flatFeeDollar : 0
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFeeType = 'dollar'
        } else if (this.flatFeePercent && this.flatFeePercent !== '0') {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = this.flatFeePercent ? this.flatFeePercent : 0
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFeeType = 'percent'
        } else {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = 0
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFeeType = ''
        }
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Minimum = false
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Base = false
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Linear = false
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Blended = false
      } else if (this.annualAssetType === 'Linear Fee Structure') {
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Linear = true
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Blended = false
        if (this.linearBaseFee && this.linearBaseFee !== '0') {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Base = true
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = this.linearBaseFee
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Minimum = false
        } else if (this.linearMinimumFee && this.linearMinimumFee !== '0') {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Minimum = true
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = this.linearMinimumFee
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Base = false
        } else {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Minimum = false
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = ''
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Base = false
        }
      } else if (this.annualAssetType === 'Tiered Fees') {
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Linear = false
        this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Blended = true
        if (this.tieredBaseFee && this.tieredBaseFee !== '0') {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Base = true
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = this.tieredBaseFee
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Minimum = false
        } else if (this.tieredMinimumFee && this.tieredMinimumFee !== '0') {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Minimum = true
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = this.tieredMinimumFee
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Base = false
        } else {
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Minimum = false
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.AnnualFee = ''
          this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.Base = false
        }
      }
      let feeTiers = []
      //Asset Tier fees Details
      if (this.annualAssetType === 'Tiered Fees') {
        this.annualAssetsBlended.map((element) => {
          if (element.minimumAssetFees === '') element.minimumAssetFees = 0
          if (element.asset === '') element.asset = 0
          if (element.percent === '') element.percent = 0
        })
        feeTiers.push({
          LowerValue: 0,
          UpperValue: this.annualAssetsBlended[0].show ? parseInt(this.annualAssetsBlended[0].asset) : 0,
          Fee: isNaN(parseFloat(this.annualAssetsBlended[0].percent))
            ? 0
            : this.annualAssetsBlended[0].show
              ? this.annualAssetsBlended[0].percent
              : 0
        })
        feeTiers.push({
          LowerValue:
            parseInt(this.annualAssetsBlended[0].asset) === 0 && parseFloat(this.annualAssetsBlended[0].percent) === 0
              ? 0
              : this.annualAssetsBlended[1].show
                ? parseInt(this.annualAssetsBlended[1].minimumAssetFees)
                : 0,
          UpperValue:
            parseInt(this.annualAssetsBlended[1].asset) === 0
              ? 0
              : this.annualAssetsBlended[1].show
                ? parseInt(this.annualAssetsBlended[1].asset)
                : 0,
          Fee: this.annualAssetsBlended[1].show ? this.annualAssetsBlended[1].percent : 0
        })
        feeTiers.push({
          LowerValue:
            parseInt(this.annualAssetsBlended[1].asset) === 0 && parseFloat(this.annualAssetsBlended[1].percent) === 0
              ? 0
              : this.annualAssetsBlended[2].show
                ? parseInt(this.annualAssetsBlended[2].minimumAssetFees)
                : 0,
          UpperValue:
            parseInt(this.annualAssetsBlended[2].asset) === 0
              ? 0
              : this.annualAssetsBlended[2].show
                ? parseInt(this.annualAssetsBlended[2].asset)
                : 0,
          Fee: this.annualAssetsBlended[2].show ? this.annualAssetsBlended[2].percent : 0
        })
        feeTiers.push({
          LowerValue:
            parseInt(this.annualAssetsBlended[2].asset) === 0 && parseFloat(this.annualAssetsBlended[2].percent) === 0
              ? 0
              : this.annualAssetsBlended[3].show
                ? parseInt(this.annualAssetsBlended[3].minimumAssetFees)
                : 0,
          UpperValue:
            parseInt(this.annualAssetsBlended[3].asset) === 0
              ? 0
              : this.annualAssetsBlended[3].show
                ? parseInt(this.annualAssetsBlended[3].asset)
                : 0,
          Fee: this.annualAssetsBlended[3].show ? this.annualAssetsBlended[3].percent : 0
        })
        feeTiers.push({
          LowerValue:
            parseInt(this.annualAssetsBlended[3].asset) === 0 && parseFloat(this.annualAssetsBlended[3].percent) === 0
              ? 0
              : this.annualAssetsBlended[4].show
                ? parseInt(this.annualAssetsBlended[4].minimumAssetFees)
                : 0,
          UpperValue:
            parseInt(this.annualAssetsBlended[4].asset) === 0
              ? 0
              : this.annualAssetsBlended[4].show
                ? parseInt(this.annualAssetsBlended[4].asset)
                : 0,
          Fee: this.annualAssetsBlended[4].show ? this.annualAssetsBlended[4].percent : 0
        })
        feeTiers.push({
          LowerValue:
            parseInt(this.annualAssetsBlended[4].asset) === 0 && parseFloat(this.annualAssetsBlended[4].percent) === 0
              ? 0
              : this.annualAssetsBlended[5].show
                ? parseInt(this.annualAssetsBlended[5].minimumAssetFees)
                : 0,
          UpperValue:
            parseInt(this.annualAssetsBlended[5].asset) === 0
              ? 0
              : this.annualAssetsBlended[5].show
                ? parseInt(this.annualAssetsBlended[5].asset)
                : 0,
          Fee: this.annualAssetsBlended[5].show ? this.annualAssetsBlended[5].percent : 0
        })
        feeTiers.push({
          LowerValue:
            parseInt(this.annualAssetsBlended[5].asset) === 0 && parseFloat(this.annualAssetsBlended[5].percent) === 0
              ? 0
              : this.annualAssetsBlended[6].show
                ? parseInt(this.annualAssetsBlended[6].minimumAssetFees)
                : 0,
          UpperValue:
            parseInt(this.annualAssetsBlended[6].asset) === 0
              ? 0
              : this.annualAssetsBlended[6].show
                ? parseInt(this.annualAssetsBlended[6].asset)
                : 0,
          Fee: this.annualAssetsBlended[6].show ? this.annualAssetsBlended[6].percent : 0
        })
      }
      //Asset Linear Fees Details
      if (this.annualAssetType === 'Linear Fee Structure') {
        this.annualAssetsBreakpoint.map((element) => {
          if (element.minAsset === '') element.minAsset = 0
          if (element.maxAsset === '') element.maxAsset = 0
          if (element.breakpointPercent === '') element.breakpointPercent = 0
        })
        feeTiers.push({
          LowerValue: this.annualAssetsBreakpoint[0].show ? parseInt(this.annualAssetsBreakpoint[0].minAsset) : 0,
          UpperValue: this.annualAssetsBreakpoint[0].show ? parseInt(this.annualAssetsBreakpoint[0].maxAsset) : 0,
          Fee: this.annualAssetsBreakpoint[0].show ? this.annualAssetsBreakpoint[0].breakpointPercent : 0
        })
        feeTiers.push({
          LowerValue: this.annualAssetsBreakpoint[1].show ? parseInt(this.annualAssetsBreakpoint[1].minAsset) : 0,
          UpperValue: this.annualAssetsBreakpoint[1].show ? parseInt(this.annualAssetsBreakpoint[1].maxAsset) : 0,
          Fee: this.annualAssetsBreakpoint[1].show ? this.annualAssetsBreakpoint[1].breakpointPercent : 0
        })
        feeTiers.push({
          LowerValue: this.annualAssetsBreakpoint[2].show ? parseInt(this.annualAssetsBreakpoint[2].minAsset) : 0,
          UpperValue: this.annualAssetsBreakpoint[2].show ? parseInt(this.annualAssetsBreakpoint[2].maxAsset) : 0,
          Fee: this.annualAssetsBreakpoint[2].show ? this.annualAssetsBreakpoint[2].breakpointPercent : 0
        })
        feeTiers.push({
          LowerValue: this.annualAssetsBreakpoint[3].show ? parseInt(this.annualAssetsBreakpoint[3].minAsset) : 0,
          UpperValue: this.annualAssetsBreakpoint[3].show ? parseInt(this.annualAssetsBreakpoint[3].maxAsset) : 0,
          Fee: this.annualAssetsBreakpoint[3].show ? this.annualAssetsBreakpoint[3].breakpointPercent : 0
        })
        feeTiers.push({
          LowerValue: this.annualAssetsBreakpoint[4].show ? parseInt(this.annualAssetsBreakpoint[4].minAsset) : 0,
          UpperValue: this.annualAssetsBreakpoint[4].show ? parseInt(this.annualAssetsBreakpoint[4].maxAsset) : 0,
          Fee: this.annualAssetsBreakpoint[4].show ? this.annualAssetsBreakpoint[4].breakpointPercent : 0
        })
        feeTiers.push({
          LowerValue: this.annualAssetsBreakpoint[5].show ? parseInt(this.annualAssetsBreakpoint[5].minAsset) : 0,
          UpperValue: this.annualAssetsBreakpoint[5].show ? parseInt(this.annualAssetsBreakpoint[5].maxAsset) : 0,
          Fee: this.annualAssetsBreakpoint[5].show ? this.annualAssetsBreakpoint[5].breakpointPercent : 0
        })
        feeTiers.push({
          LowerValue: this.annualAssetsBreakpoint[6].show ? parseInt(this.annualAssetsBreakpoint[6].minAsset) : 0,
          UpperValue: this.annualAssetsBreakpoint[6].show ? parseInt(this.annualAssetsBreakpoint[6].maxAsset) : 0,
          Fee: this.annualAssetsBreakpoint[6].show ? this.annualAssetsBreakpoint[6].breakpointPercent : 0
        })
      }
      this.$store.state.soloKOpenAccountDetail.FeeScheduleTier.FeeTiers = feeTiers
      this.$emit('nextSlide')
    },
    prevSlide() {
      this.$emit('prevSlide')
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
