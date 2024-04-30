<template>
  <v-row class="justify-end">
    <v-dialog
      v-model="dialog"
      :eager="true"
      persistent
      scrollable
      max-width="1000px"
      class="elevation-3"
      content-class="elevation-3"
    >
      <template #activator="{ props }">
        <v-btn :color="!$vuetify?.theme.dark ? 'accent' : ''" v-bind="props" size="small" class="mt-0">
          Create New Fee Schedule
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="pa-3" fixed :class="$vuetify?.theme.dark ? '' : 'accent'">
          <v-row>
            <v-col xl11 lg11 sm11 md11 xs11>
              <h2 v-if="!$vuetify?.breakpoint?.xs" class="text-secondary">FEE BUILDER</h2>
              <h4 v-if="$vuetify?.breakpoint?.xs" class="text-secondary">FEE BUILDER</h4>
            </v-col>
            <v-col xl1 lg1 sm1 md1 xs1 class="text-right align-self">
              <v-icon color="secondary" @click="reset()"> close </v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-0" style="height: 600px">
          <v-form ref="form" v-model="validFeeBuilder">
            <v-container class="pt-3 pb-2 pl-2 pr-2">
              <v-col>
                <v-row>
                  <v-col xl6 lg6 md6 sm6 xs12 pr-2>
                    <v-text-field
                      v-model="name"
                      label="Name"
                      autofocus
                      :rules="[(v) => !!v || 'Name is required']"
                      required
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col xl3 lg3 md3 sm3 xs12 pr-2>
                    <v-text-field
                      v-model="minFees"
                      v-input-mask="{
                        alias: 'currency',
                        rightAlign: false,
                        autoUnmask: true,
                        allowMinus: false,
                        digitsOptional: true,
                        placeholder: '0'
                      }"
                      label="Minimum Fees"
                      prefix="$"
                      maxlength="8"
                      variant="outlined"
                      density="compact"
                      @blur="formateValue('minFees')"
                    />
                  </v-col>
                  <v-col xl12 lg12 sm12 md12 xs12 pt-1 pb-2>
                    <v-divider class="border_solid_grey" />
                  </v-col>
                  <v-col xl2 lg2 md2 sm3 xs12 pt-1 :class="$vuetify?.breakpoint?.xs ? 'text-right' : ''" />
                </v-row>
                <v-row>
                  <v-col xl6 lg6 md6 sm12 :class="$vuetify?.breakpoint?.mdAndUp ? 'pr-2' : ''">
                    <v-col xl12 lg12 md12 sm12>
                      <h2>Annual Assets Based Fees</h2>
                    </v-col>
                    <v-col xl12 lg12 md12 sm12>
                      <v-radio-group v-model="assetFeeStructure" inline>
                        <v-radio color="accent" label="Tiered Fee Structure" value="tieredFeeStructure" />
                        <v-radio color="accent" label="Linear Fee Structure" value="linearFeeStructure" />
                      </v-radio-group>
                    </v-col>
                    <v-radio-group v-model="assetFeeMode" inline class="mt-0 pb-0 pl-2 pr-2 pt-2 background_assets">
                      <v-radio color="accent" label="Total Assets" value="totalAssets" />
                      <v-radio color="accent" label="Average Account Balance" value="linearFeeStructure" />
                    </v-radio-group>
                    <v-col class="pt-0 pb-0 pl-2 pr-2 background_assets asset_div">
                      <v-row>
                        <v-col xl3 lg3 md3 sm3 xs4>
                          <b>From Amount($)</b>
                        </v-col>
                        <v-col xl9 lg9 md9 sm9 xs8>
                          <v-row>
                            <v-col xl2 lg2 md2 sm2 xs2 />
                            <v-col xl5 lg5 md5 sm5 xs5>
                              <b>To Amount($)</b>
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 />
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <b>Fees</b>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl3 lg3 md3 sm3 xs4 class="font_size_16">
                          <v-text-field v-model="fromAmount" prefix="$" :disabled="true" />
                        </v-col>
                        <v-col xl9 lg9 md9 sm9 xs8>
                          <v-row>
                            <v-col xl2 lg2 md2 sm2 xs2 pt-4 class="text-center"> to </v-col>
                            <v-col xl5 lg5 md5 sm5 xs5>
                              <v-text-field
                                v-model="assetMaxFee1"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4 pr-2>
                              <v-text-field
                                v-model="assetFeePct1"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                suffix="%"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl3 lg3 md3 sm3 xs4 class="font_size_16">
                          <v-text-field v-model="assetMaxFee1" variant="outlined" density="compact" prefix="$" :disabled="true" />
                        </v-col>
                        <v-col xl9 lg9 md9 sm9 xs8>
                          <v-row>
                            <v-col xl2 lg2 md2 sm2 xs2 pt-4 class="text-center"> to </v-col>
                            <v-col xl5 lg5 md5 sm5 xs5>
                              <v-text-field
                                v-model="assetMaxFee2"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4 pr-2>
                              <v-text-field
                                v-model="assetFeePct2"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                suffix="%"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl3 lg3 md3 sm3 xs4 class="font_size_16">
                          <v-text-field v-model="assetMaxFee2" variant="outlined" prefix="$" :disabled="true" />
                        </v-col>
                        <v-col xl9 lg9 md9 sm9 xs8>
                          <v-row>
                            <v-col xl2 lg2 md2 sm2 xs2 pt-4 class="text-center"> to </v-col>
                            <v-col xl5 lg5 md5 sm5 xs5>
                              <v-text-field
                                v-model="assetMaxFee3"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4 pr-2>
                              <v-text-field
                                v-model="assetFeePct3"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                suffix="%"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl3 lg3 md3 sm3 xs4 class="font_size_16">
                          <v-text-field v-model="assetMaxFee3" variant="outlined" density="compact" prefix="$" :disabled="true" />
                        </v-col>
                        <v-col xl9 lg9 md9 sm9 xs8>
                          <v-row>
                            <v-col xl2 lg2 md2 sm2 xs2 pt-4 class="text-center"> to </v-col>
                            <v-col xl5 lg5 md5 sm5 xs5>
                              <v-text-field
                                v-model="assetMaxFee4"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4 pr-2>
                              <v-text-field
                                v-model="assetFeePct4"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                suffix="%"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl3 lg3 md3 sm3 xs4 class="font_size_16">
                          <v-text-field v-model="assetMaxFee4" variant="outlined" density="compact" prefix="$" :disabled="true" />
                        </v-col>
                        <v-col xl9 lg9 md9 sm9 xs8>
                          <v-row>
                            <v-col xl2 lg2 md2 sm2 xs2 pt-4 class="text-center"> to </v-col>
                            <v-col xl5 lg5 md5 sm5 xs5>
                              <v-text-field
                                v-model="assetMaxFee5"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4 pr-2>
                              <v-text-field
                                v-model="assetFeePct5"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                suffix="%"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl3 lg3 md3 sm3 xs4 class="font_size_16">
                          <v-text-field v-model="assetMaxFee5" variant="outlined" density="compact" prefix="$" :disabled="true" />
                        </v-col>
                        <v-col xl9 lg9 md9 sm9 xs8>
                          <v-row>
                            <v-col xl2 lg2 md2 sm2 xs2 pt-4 class="text-center"> to </v-col>
                            <v-col xl5 lg5 md5 sm5 xs5>
                              <v-text-field
                                v-model="assetMaxFee6"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4 pr-2>
                              <v-text-field
                                v-model="assetFeePct6"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                suffix="%"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl3 lg3 sm3 md3 xs12>
                          <v-text-field
                            v-model="minimumAssetFees"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            label="Minimum Fees"
                            maxlength="8"
                            prefix="$"
                            variant="outlined"
                            density="compact"
                            @blur="formateValue('minimumAssetFees')"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                  <v-col xl6 lg6 md6 sm12 xs12 :class="$vuetify?.breakpoint?.mdAndUp ? 'pl-2' : ''">
                    <v-col xl12 lg12 md12 sm12 xs12>
                      <h2>Annual Participant Based Fees</h2>
                    </v-col>
                    <v-col xl12 lg12 md12 sm12 xs12>
                      <v-radio-group v-model="participantFeeStructure" inline>
                        <v-radio color="accent" label="Tiered Fee Structure" value="tieredFeeStructure" />
                        <v-radio color="accent" label="Linear Fee Structure" value="linearFeeStructure" />
                      </v-radio-group>
                    </v-col>
                    <v-radio-group v-model="participantFeeMode" inline class="mt-0 pb-0 pl-2 pr-2 pt-2 background_assets">
                      <v-radio color="accent" label="Total Paricipants" value="totalParticipants" />
                      <v-radio color="accent" label="Average Account Balance" value="averageAccountBalance" />
                    </v-radio-group>
                    <v-col class="pt-0 pl-2 pr-2 pb-0 background_assets particpant_div">
                      <v-row>
                        <v-col xl2 lg2 md2 sm2 xs3>
                          <b>From({{ participantFeeMode === 'averageAccountBalance' ? '$' : '#' }})</b>
                        </v-col>
                        <v-col xl10 lg10 md10 sm10 xs9>
                          <v-row>
                            <v-col xl1 lg1 md1 sm1 xs1 />
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <b>To({{ participantFeeMode === 'averageAccountBalance' ? '$' : '#' }})</b>
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 />
                            <v-col xl3 lg3 md3 sm3 xs3>
                              <b>Base Fees($)</b>
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 />
                          </v-row>
                        </v-col>
                        <v-col xl2 lg2 md2 sm2 xs3 class="font_size_16">
                          <v-text-field
                            v-model="fromParticipantAmount"
                            :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                            :disabled="true"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col xl10 lg10 md10 sm10 xs9>
                          <v-row>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center"> to </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <v-text-field
                                v-model="participantMax1"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="participantPct1"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('participantPct1')"
                              />
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="baseFee1"
                                prefix="$"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('baseFee1')"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl2 lg2 md2 sm2 xs3 class="font_size_16">
                          <v-text-field
                            v-model="participantMax1"
                            :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                            :disabled="true"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col xl10 lg10 md10 sm10 xs9>
                          <v-row>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center"> to </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <v-text-field
                                v-model="participantMax2"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="participantPct2"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('participantPct2')"
                              />
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="baseFee2"
                                prefix="$"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('baseFee2')"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl2 lg2 md2 sm2 xs3 class="font_size_16">
                          <v-text-field
                            v-model="participantMax2"
                            :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                            :disabled="true"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col xl10 lg10 md10 sm10 xs9>
                          <v-row>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center"> to </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <v-text-field
                                v-model="participantMax3"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="participantPct3"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('participantPct3')"
                              />
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="baseFee3"
                                prefix="$"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('baseFee3')"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl2 lg2 md2 sm2 xs3 class="font_size_16">
                          <v-text-field
                            v-model="participantMax3"
                            :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                            :disabled="true"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col xl10 lg10 md10 sm10 xs9>
                          <v-row>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center"> to </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <v-text-field
                                v-model="participantMax4"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="participantPct4"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('participantPct4')"
                              />
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="baseFee4"
                                prefix="$"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('baseFee4')"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl2 lg2 md2 sm2 xs3 class="font_size_16">
                          <v-text-field
                            v-model="participantMax4"
                            :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                            :disabled="true"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col xl10 lg10 md10 sm10 xs9>
                          <v-row>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center"> to </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <v-text-field
                                v-model="participantMax5"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="participantPct5"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('participantPct5')"
                              />
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="baseFee5"
                                prefix="$"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('baseFee5')"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl2 lg2 md2 sm2 xs3 class="font_size_16">
                          <v-text-field
                            v-model="participantMax5"
                            :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                            :disabled="true"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col xl10 lg10 md10 sm10 xs9>
                          <v-row>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center"> to </v-col>
                            <v-col xl4 lg4 md4 sm4 xs4>
                              <v-text-field
                                v-model="participantMax6"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                :prefix="participantFeeMode === 'averageAccountBalance' ? '$' : ''"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col xl1 lg1 md1 sm1 xs1 pt-4 class="text-center">
                              <b>:</b>
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="participantPct6"
                                v-input-mask="{
                                  alias: 'currency',
                                  rightAlign: false,
                                  autoUnmask: true,
                                  allowMinus: false,
                                  digitsOptional: true,
                                  placeholder: '0'
                                }"
                                prefix="$"
                                maxlength="8"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('participantPct6')"
                              />
                            </v-col>
                            <v-col xl3 lg3 md3 sm3 xs3 pr-2>
                              <v-text-field
                                v-model="baseFee6"
                                prefix="$"
                                variant="outlined"
                                density="compact"
                                @blur="formateValue('baseFee6')"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col xl2 lg2 sm2 md2 xs12>
                          <v-text-field
                            v-model="minimumParticipantFees"
                            v-input-mask="{
                              alias: 'currency',
                              rightAlign: false,
                              autoUnmask: true,
                              allowMinus: false,
                              digitsOptional: true,
                              placeholder: '0'
                            }"
                            label="Minimum Fees"
                            maxlength="8"
                            prefix="$"
                            variant="outlined"
                            density="compact"
                            @blur="formateValue('minimumParticipantFees')"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-col pt-3 pb-2>
                <v-divider />
              </v-col>
              <v-col>
                * Tiered Fee Structure - Each range is charged the associated % fee, even as assets grow and additional ranges
                reached.
              </v-col>
              <v-col>
                * Linear Fee Structure - Once a level is reached, ALL assets are charged that particular percentage.
              </v-col>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="bg-grey-darken-4">
          <v-row>
            <v-col xl6 lg6 md6 sm6 xs6 class="text-left">
              <v-btn color="accent" class="text-secondary elevation-0" @click="reset()"> Cancel </v-btn>
            </v-col>
            <v-col xl6 lg6 md6 sm6 xs6 class="text-right">
              <v-btn color="accent" :disabled="!validFeeBuilder" class="elevation-0" @click="saveAndClose()">
                Save & Close
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ['providerName'],
  data() {
    return {
      dialog: false,
      validFeeBuilder: true,
      name: '',
      fromAmount: 0,
      fromParticipantAmount: 0,
      assetMaxFee1: '',
      assetMaxFee2: '',
      assetMaxFee3: '',
      assetMaxFee4: '',
      assetMaxFee5: '',
      assetMaxFee6: '',
      assetFeePct1: '',
      assetFeePct2: '',
      assetFeePct3: '',
      assetFeePct4: '',
      assetFeePct5: '',
      assetFeePct6: '',
      participantMax1: '',
      participantMax2: '',
      participantMax3: '',
      participantMax4: '',
      participantMax5: '',
      participantMax6: '',
      participantPct1: '',
      participantPct2: '',
      participantPct3: '',
      participantPct4: '',
      participantPct5: '',
      participantPct6: '',
      baseFee1: '',
      baseFee2: '',
      baseFee3: '',
      baseFee4: '',
      baseFee5: '',
      baseFee6: '',
      assetFeeMode: 'totalAssets',
      assetFeeStructure: '',
      participantFeeMode: 'totalParticipants',
      participantFeeStructure: '',
      minimumParticipantFees: '',
      minimumAssetFees: '',
      minFees: ''
    }
  },
  watch: {
    dialog: function () {
      if (this.dialog === true) {
        this.fromAmount = '0'
        this.fromParticipantAmount = '0'
      }
    }
  },
  methods: {
    saveAndClose() {
      var feeSchedule = {
        Id: 0,
        Name: this.name,
        Provider: this.providerName === undefined ? '' : this.providerName,
        MinFee: this.minFees === '' ? 0.0 : parseFloat(this.minFees),
        AssetType: this.assetFeeMode === 'totalAssets' ? 0 : 1,
        AssetFixed: 0.0,
        Active: true,
        AssetStructure: this.assetFeeStructure === 'tieredFeeStructure' ? 0 : 1,
        AssetFeeMin: this.minimumAssetFees === '' ? 0 : this.minimumAssetFees,
        AssetFee1: {
          Min: 0,
          Max: this.assetMaxFee1 === '' ? 0 : this.assetMaxFee1,
          FeePct: this.assetFeePct1 === '' ? 0.0 : this.assetFeePct1
        },
        AssetFee2: {
          Min: this.assetMaxFee1 === '' ? 0 : this.assetMaxFee1,
          Max: this.assetMaxFee2 === '' ? 0 : this.assetMaxFee2,
          FeePct: this.assetFeePct2 === '' ? 0.0 : this.assetFeePct2
        },
        AssetFee3: {
          Min: this.assetMaxFee2 === '' ? 0 : this.assetMaxFee2,
          Max: this.assetMaxFee3 === '' ? 0 : this.assetMaxFee3,
          FeePct: this.assetFeePct3 === '' ? 0.0 : this.assetFeePct3
        },
        AssetFee4: {
          Min: this.assetMaxFee3 === '' ? 0 : this.assetMaxFee3,
          Max: this.assetMaxFee4 === '' ? 0 : this.assetMaxFee4,
          FeePct: this.assetFeePct4 === '' ? 0.0 : this.assetFeePct4
        },
        AssetFee5: {
          Min: this.assetMaxFee4 === '' ? 0 : this.assetMaxFee4,
          Max: this.assetMaxFee5 === '' ? 0 : this.assetMaxFee5,
          FeePct: this.assetFeePct5 === '' ? 0.0 : this.assetFeePct5
        },
        AssetFee6: {
          Min: this.assetMaxFee5 === '' ? 0 : this.assetMaxFee5,
          Max: this.assetMaxFee6 === '' ? 0 : this.assetMaxFee6,
          FeePct: this.assetFeePct6 === '' ? 0.0 : this.assetFeePct6
        },
        PartType: this.participantFeeMode === 'totalParticipants' ? 0 : 1,
        PartFixed: 0.0,
        PartStructure: this.participantFeeStructure === 'linearFeeStructure' ? 0 : 1,
        ParticipantFeeMin: this.minimumParticipantFees === '' ? 0 : this.minimumParticipantFees,
        PartBase: 0.0,
        ParticipantFee1: {
          Min: 0,
          Max: this.participantMax1 === '' ? 0 : this.participantMax1,
          FeePct: this.participantPct1 === '' ? 0.0 : this.participantPct1,
          BaseFee: this.baseFee1 === '' ? 0.0 : this.baseFee1
        },
        ParticipantFee2: {
          Min: this.participantMax1 === '' ? 0 : this.assetMaxFee1,
          Max: this.participantMax2 === '' ? 0 : this.participantMax2,
          FeePct: this.participantPct2 === '' ? 0.0 : this.participantPct2,
          BaseFee: this.baseFee2 === '' ? 0.0 : this.baseFee2
        },
        ParticipantFee3: {
          Min: this.participantMax2 === '' ? 0 : this.participantMax2,
          Max: this.participantMax3 === '' ? 0 : this.participantMax3,
          FeePct: this.participantPct3 === '' ? 0.0 : this.participantPct3,
          BaseFee: this.baseFee3 === '' ? 0.0 : this.baseFee3
        },
        ParticipantFee4: {
          Min: this.participantMax3 === '' ? 0 : this.participantMax3,
          Max: this.participantMax4 === '' ? 0 : this.participantMax4,
          FeePct: this.participantPct4 === '' ? 0.0 : this.participantPct4,
          BaseFee: this.baseFee4 === '' ? 0.0 : this.baseFee4
        },
        ParticipantFee5: {
          Min: this.participantMax4 === '' ? 0 : this.participantMax4,
          Max: this.participantMax5 === '' ? 0 : this.participantMax5,
          FeePct: this.participantPct5 === '' ? 0.0 : this.participantPct5,
          BaseFee: this.baseFee5 === '' ? 0.0 : this.baseFee5
        },
        ParticipantFee6: {
          Min: this.participantMax5 === '' ? 0 : this.participantMax5,
          Max: this.participantMax6 === '' ? 0 : this.participantMax6,
          FeePct: this.participantPct6 === '' ? 0.0 : this.participantPct6,
          BaseFee: this.baseFee6 === '' ? 0.0 : this.baseFee6
        }
      }
      // eslint-disable-next-line no-unused-vars
      this.$axios.put(`/api/v1/tal/feeschedule`, feeSchedule).then((success) => {
        this.$emit('insertSchedules', success.data.d)
        this.reset()
      })
    },
    formateValue(from) {
      switch (from) {
        case 'baseFee1':
          this.baseFee1 = this.baseFee1 !== '' ? parseFloat(this.baseFee1).toFixed(2) : ''
          break
        case 'baseFee2':
          this.baseFee2 = this.baseFee2 !== '' ? parseFloat(this.baseFee2).toFixed(2) : ''
          break
        case 'baseFee3':
          this.baseFee3 = this.baseFee3 !== '' ? parseFloat(this.baseFee3).toFixed(2) : ''
          break
        case 'baseFee4':
          this.baseFee4 = this.baseFee4 !== '' ? parseFloat(this.baseFee4).toFixed(2) : ''
          break
        case 'baseFee5':
          this.baseFee5 = this.baseFee5 !== '' ? parseFloat(this.baseFee5).toFixed(2) : ''
          break
        case 'baseFee6':
          this.baseFee6 = this.baseFee6 !== '' ? parseFloat(this.baseFee6).toFixed(2) : ''
          break
        case 'participantPct1':
          this.participantPct1 = this.participantPct1 !== '' ? parseFloat(this.participantPct1).toFixed(2) : ''
          break
        case 'participantPct2':
          this.participantPct2 = this.participantPct2 !== '' ? parseFloat(this.participantPct2).toFixed(2) : ''
          break
        case 'participantPct3':
          this.participantPct3 = this.participantPct3 !== '' ? parseFloat(this.participantPct3).toFixed(2) : ''
          break
        case 'participantPct4':
          this.participantPct4 = this.participantPct4 !== '' ? parseFloat(this.participantPct4).toFixed(2) : ''
          break
        case 'participantPct5':
          this.participantPct5 = this.participantPct5 !== '' ? parseFloat(this.participantPct5).toFixed(2) : ''
          break
        case 'participantPct6':
          this.participantPct6 = this.participantPct6 !== '' ? parseFloat(this.participantPct6).toFixed(2) : ''
          break
        case 'minimumParticipantFees':
          this.minimumParticipantFees =
            this.minimumParticipantFees !== '' ? parseFloat(this.minimumParticipantFees).toFixed(2) : ''
          break
        case 'minimumAssetFees':
          this.minimumAssetFees = this.minimumAssetFees !== '' ? parseFloat(this.minimumAssetFees).toFixed(2) : ''
          break
        case 'minFees':
          this.minFees = this.minFees !== '' ? parseFloat(this.minFees).toFixed(2) : ''
          break
        default:
          break
      }
    },
    reset() {
      this.$refs.form.reset()
      this.dialog = false
      this.validFeeBuilder = true
      this.name = null
      this.fromAmount = 0
      this.fromParticipantAmount = 0
      this.assetMaxFee1 = ''
      this.assetMaxFee2 = ''
      this.assetMaxFee3 = ''
      this.assetMaxFee4 = ''
      this.assetMaxFee5 = ''
      this.assetMaxFee6 = ''
      this.assetFeePct1 = ''
      this.assetFeePct2 = ''
      this.assetFeePct3 = ''
      this.assetFeePct4 = ''
      this.assetFeePct5 = ''
      this.assetFeePct6 = ''
      this.participantMax1 = ''
      this.participantMax2 = ''
      this.participantMax3 = ''
      this.participantMax4 = ''
      this.participantMax5 = ''
      this.participantMax6 = ''
      this.participantPct1 = ''
      this.participantPct2 = ''
      this.participantPct3 = ''
      this.participantPct4 = ''
      this.participantPct5 = ''
      this.participantPct6 = ''
      this.baseFee1 = ''
      this.baseFee2 = ''
      this.baseFee3 = ''
      this.baseFee4 = ''
      this.baseFee5 = ''
      this.baseFee6 = ''
      this.assetFeeMode = 'totalAssets'
      this.assetFeeStructure = ''
      this.participantFeeMode = 'totalParticipants'
      this.participantFeeStructure = ''
      this.minimumParticipantFees = ''
      this.minimumAssetFees = ''
      this.minFees = ''
    }
  }
}
</script>

<style scoped>
.font_size_16 {
  font-size: 16px !important;
}

.border_solid_grey {
  border: solid 1px #d3d3d3c4 !important;
}
.background_assets {
  background-color: #d3d3d338 !important;
}
.asset_div .v-text-field {
  padding-top: 2px !important;
}
.particpant_div .v-text-field {
  padding-top: 2px !important;
}
</style>
