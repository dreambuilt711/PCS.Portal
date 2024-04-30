<template>
  <v-col>
    <v-col>
      <v-stepper v-model="e6" class="elevation-0" vertical>
        <v-layout low wrap>
          <v-col lg3 sm3 pa-3>
            <v-stepper-step
              v-ripple="false"
              color="#fff"
              class="progressschoolstepper cursor-pointer"
              :complete="completed"
              :step="e6 === 1 ? '1' : ''"
              :class="[e6 > 1 ? 'highlightschoolstepper' : '']"
              @click="e6 = 1"
            >
              <v-col class="text-uppercase font-weight-medium text-hyperlink pl-2"> Relationship </v-col>
            </v-stepper-step>
            <v-divider ml-2 inset vertical dark class="hr_border progressdivider" />
            <v-stepper-step
              v-ripple="false"
              color="#fff"
              class="progressschoolstepper cursor-pointer"
              :complete="completed"
              :step="e6 === 2 ? '2' : ''"
              :class="[e6 > 2 ? 'highlightschoolstepper' : '']"
              @click="e6 = 2"
            >
              <v-col text-uppercase font-weight-medium pl-2 :class="e6 >= 2 ? ' text-hyperlink' : ''"> Participant Info </v-col>
            </v-stepper-step>
            <v-divider ml-2 inset vertical dark class="hr_border" />
            <v-stepper-step
              v-ripple="false"
              color="#fff"
              class="progressschoolstepper cursor-pointer"
              :complete="completed"
              :step="e6 === 3 ? '3' : ''"
              :class="[e6 > 3 ? 'highlightschoolstepper' : '']"
              @click="e6 = 3"
            >
              <v-col text-uppercase font-weight-medium pl-2 :class="e6 >= 3 ? ' text-hyperlink' : ''"> Beneficiary </v-col>
            </v-stepper-step>
            <v-divider ml-2 inset vertical dark class="hr_border" />
            <v-stepper-step
              v-ripple="false"
              color="#fff"
              class="progressschoolstepper cursor-pointer"
              :complete="completed"
              :step="e6 === 4 ? '4' : ''"
              :class="[e6 > 4 ? 'highlightschoolstepper' : '']"
              @click="e6 = 4"
            >
              <v-col text-uppercase font-weight-medium pl-2 :class="e6 >= 4 ? ' text-hyperlink' : ''"> Investment </v-col>
            </v-stepper-step>
            <v-divider ml-2 inset vertical dark class="hr_border" />
            <v-stepper-step
              v-ripple="false"
              color="#fff"
              class="progressschoolstepper cursor-pointer"
              :complete="completed"
              :step="e6 === 5 ? '5' : ''"
              :class="[e6 > 5 ? 'highlightschoolstepper' : '']"
              @click="e6 = 5"
            >
              <v-col text-uppercase font-weight-medium pl-2 :class="e6 >= 5 ? ' text-hyperlink' : ''"> Fees </v-col>
            </v-stepper-step>
            <v-divider ml-2 inset vertical dark class="hr_border" />
            <v-stepper-step
              v-ripple="false"
              color="#fff"
              class="progressschoolstepper cursor-pointer"
              :complete="completed"
              :step="e6 === 6 ? '6' : ''"
              :class="[e6 > 6 ? 'highlightschoolstepper' : '']"
              @click="e6 = 6"
            >
              <v-col text-uppercase font-weight-medium pl-2 :class="e6 >= 6 ? ' text-hyperlink' : ''">
                Account Consolidation
              </v-col>
            </v-stepper-step>
            <v-divider ml-2 inset vertical dark class="hr_border" />
            <v-stepper-step
              v-ripple="false"
              color="#fff"
              class="progressschoolstepper"
              :complete="completed"
              :step="e6 === 7 ? '7' : ''"
              :class="[e6 > 7 ? 'highlightschoolstepper' : '']"
            >
              <v-col text-uppercase font-weight-medium pl-2 :class="e6 >= 7 ? ' text-hyperlink' : ''"> Confirmation </v-col>
            </v-stepper-step>
          </v-col>

          <v-col v-if="e6 === 1" lg9 sm9 pt-2 pr-1>
            <v-card class="elevation-4" :class="$vuetify?.breakpoint?.xs ? '' : 'pa-3'">
              <v-stepper-content step="1">
                <h2 class="font-weight-medium">Relationship & Product Information</h2>
                <v-col pt-2>
                  <h3 class="font-weight-medium text-hyperlink">You have more than one relationship for this program</h3>
                </v-col>
                <v-col> Please select the relationship to allocate Fee Schedule to opportunity </v-col>
                <v-col pt-2 lg6>
                  <v-select
                    v-model="searchRelationship"
                    label="Relationship"
                    browser-
                    :items="relationshipList"
                    clearable
                    variant="filled"
                    density="compact"
                    return-object
                    auto-select-first
                    :rules="[(v) => !!v || 'Relationship is required']"
                    class="shortcutdropdown"
                  />
                </v-col>
                <v-col lg6>
                  <v-select
                    v-model="searchProduct"
                    label="Select Product"
                    browser-
                    :items="productList"
                    clearable
                    variant="filled"
                    density="compact"
                    return-object
                    auto-select-first
                    :rules="[(v) => !!v || 'Select Product is required']"
                    class="shortcutdropdown"
                  />
                </v-col>
                <v-col pt-5>
                  <v-layout row wrap>
                    <v-col xs12 class="text-right">
                      <v-btn
                        variant="outlined"
                        :color="$vuetify.dark ? '' : 'accent'"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
                        @click="resetData()"
                      >
                        Clear
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 2">
                        Continue
                      </v-btn>
                    </v-col>
                  </v-layout>
                </v-col>
              </v-stepper-content>
            </v-card>
          </v-col>
          <v-col v-if="e6 === 2" lg9 sm9 pt-2 pr-1>
            <v-card class="elevation-4" :class="$vuetify?.breakpoint?.xs ? '' : 'pa-3'">
              <v-stepper-content step="2">
                <h2 class="font-weight-medium">Participant Info</h2>
                <v-col pt-3>
                  <h3 class="font-weight-medium text-hyperlink text-uppercase">Name, Email, Phone</h3>
                </v-col>
                <v-col pt-2>
                  <v-layout low wrap>
                    <v-col lg4 sm4 xs12>
                      <v-text-field
                        label="First Name"
                        variant="filled"
                        maxlength="13"
                        browser-
                        @keyup.enter="event.target.blur"
                      />
                    </v-col>
                    <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2'">
                      <v-text-field
                        label="Middle Name"
                        variant="filled"
                        maxlength="13"
                        browser-
                        @keyup.enter="event.target.blur"
                      />
                    </v-col>
                    <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2'">
                      <v-text-field label="Last Name" variant="filled" maxlength="13" browser- @keyup.enter="event.target.blur" />
                    </v-col>
                  </v-layout>
                </v-col>
                <v-col>
                  <v-layout low wrap>
                    <v-col lg4 sm4 xs12>
                      <v-text-field
                        v-model="email"
                        label="Email"
                        browser-
                        :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                        variant="filled"
                      />
                    </v-col>
                    <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2'">
                      <v-text-field
                        v-model="confirmEmail"
                        label="Confirm Email"
                        browser-
                        :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                        variant="filled"
                      />
                    </v-col>
                  </v-layout>
                </v-col>
                <v-col>
                  <v-layout low wrap>
                    <v-col lg4 sm4 xs12>
                      <v-text-field
                        v-model="Phone"
                        v-input-mask="{
                          mask: '[+]9[-999][-999][-9999]',
                          rightAlign: false,
                          placeholder: '',
                          allowMinus: false,
                          allowPlus: true
                        }"
                        label="Phone"
                        maxlength="15"
                        :rules="[(v) => !!v || 'Phone is required']"
                        counter="15"
                        required
                        variant="filled"
                      />
                    </v-col>
                  </v-layout>
                </v-col>
                <v-col>
                  <v-layout low wrap>
                    <h3 class="font-weight-medium">Additional Participant Information (Optional)</h3>
                  </v-layout>
                  <v-col> Would you like to enter additional participant information ? </v-col>
                  <v-col>
                    <v-radio-group v-model="hasAdditionalInfo" inline>
                      <v-radio color="accent" label="Yes" value="true" />
                      <v-radio color="accent" label="No" value="false" />
                    </v-radio-group>
                  </v-col>
                  <v-col v-if="hasAdditionalInfo === 'true'">
                    <v-col lg4 sm4 xs12>
                      <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        lazy
                        content-class="z_index_1 hideoverflow boxshadow"
                        transition="scale-transition"
                        min-width="290px"
                      >
                        <template #activator="{ props }">
                          <v-text-field
                            v-model="birthDate"
                            label="Date of Birth"
                            browser-
                            :error-messages="checkDateErrorMsg"
                            v-input-mask="{
                              alias: 'datetime',
                              inputFormat: 'mm/dd/yyyy'
                            }"
                            :error="checkDateError"
                            required
                            variant="filled"
                            :rules="[(v) => !!v || 'Date of Birth is required']"
                            @update:model-value="dateofBirth = parseDate(birthDate)"
                            @blur="checkDate(birthDate)"
                            append-inner-icon="event"
                            v-bind="props"
                          >
                            <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dateofBirth"
                          color="accent"
                          :min="minDate"
                          :max="maxDate"
                          @input="menu2 = false"
                        />
                      </v-menu>
                    </v-col>
                    <v-col>
                      <h4 class="font-weight-medium text-hyperlink text-uppercase">Identification Document</h4>
                    </v-col>
                    <v-col>
                      <v-radio-group inline>
                        <v-radio color="accent" label="Driver's License" value="0" />
                        <v-radio color="accent" label="State ID" value="1" />
                        <v-radio color="accent" label="Passport" value="2" />
                      </v-radio-group>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-text-field
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '0',
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false
                            }"
                            label="Document Number"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-4' : 'pl-2'">
                          <v-text-field
                            label="Place of Issue"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-menu
                            v-model="menu1"
                            :close-on-content-click="false"
                            lazy
                            content-class="z_index_1 hideoverflow boxshadow"
                            transition="scale-transition"
                            min-width="290px"
                          >
                            <template #activator="{ props }">
                              <v-text-field
                                v-model="expirationDate"
                                label="Expiration Date"
                                browser-
                                :error-messages="checkDateErrorMsg"
                                v-input-mask="{
                                  alias: 'datetime',
                                  inputFormat: 'mm/dd/yyyy'
                                }"
                                :error="checkDateError"
                                required
                                variant="filled"
                                :rules="[(v) => !!v || 'Expiration Date is required']"
                                @update:model-value="dateofExpiration = parseDate(expirationDate)"
                                @blur="checkDate(expirationDate)"
                                append-inner-icon="event"
                                v-bind="props"
                              >
                                <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                              </v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dateofExpiration"
                              color="accent"
                              :min="minDate"
                              :max="maxDate"
                              @input="menu1 = false"
                            />
                          </v-menu>
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-select
                            v-model="countryOfResidency"
                            label="Country of Residency"
                            browser-
                            :items="countryOfResidencyList"
                            clearable
                            variant="filled"
                            density="compact"
                            return-object
                            auto-select-first
                            :rules="[(v) => !!v || 'Country of Residency is required']"
                            class="shortcutdropdown"
                          />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-4' : 'pl-2'">
                          <v-select
                            v-model="countryOfCitizenship"
                            label="Country of Citizenship"
                            browser-
                            :items="countryOfCitizenshipList"
                            clearable
                            variant="filled"
                            density="compact"
                            return-object
                            auto-select-first
                            :rules="[(v) => !!v || 'Country of Citizenship is required']"
                            class="shortcutdropdown"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col pt-3 pb-1>
                      <h4 class="font-weight-medium text-hyperlink text-uppercase">Address</h4>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-text-field
                            label="Address Line 1"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-text-field
                            label="Address Line 2"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-text-field label="City" variant="filled" maxlength="13" browser- @keyup.enter="event.target.blur" />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-4' : 'pl-2'">
                          <v-text-field label="State" variant="filled" maxlength="13" browser- @keyup.enter="event.target.blur" />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-4' : 'pl-2'">
                          <v-text-field
                            v-model="zipcode"
                            v-input-mask="{
                              mask: '99999',
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false
                            }"
                            class="text-left"
                            label="Zip"
                            maxlength="5"
                            browser-
                            :error="zipcodeError"
                            variant="filled"
                            :error-messages="zipcodeErrorMsg"
                            @change="getAddress()"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col pb-1>
                      <h4 class="font-weight-medium text-hyperlink text-uppercase">Occupation</h4>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-text-field
                            label="Position"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-select
                            v-model="schoolType"
                            label="School"
                            browser-
                            :items="schoolList"
                            clearable
                            variant="filled"
                            density="compact"
                            return-object
                            auto-select-first
                            :rules="[(v) => !!v || 'School is required']"
                            class="shortcutdropdown"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                  </v-col>
                </v-col>
                <v-col pt-5>
                  <v-layout row wrap>
                    <v-col xs12 class="text-right">
                      <v-btn
                        variant="outlined"
                        :color="$vuetify.dark ? '' : 'accent'"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
                        @click="resetParticipantInfo()"
                      >
                        Clear
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 1">
                        Back
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 3">
                        Continue
                      </v-btn>
                    </v-col>
                  </v-layout>
                </v-col>
              </v-stepper-content>
            </v-card>
          </v-col>
          <v-col v-if="e6 === 3" lg9 sm9 pt-2 pr-1>
            <v-card class="elevation-4" :class="$vuetify?.breakpoint?.xs ? '' : 'pa-3'">
              <v-stepper-content step="3">
                <h2 class="font-weight-medium">Beneficiary Designation</h2>
                <v-col pt-3 class="font-weight-medium"> Would you like to designate beneficiaries now ? </v-col>
                <v-col>
                  <v-radio-group v-model="hasBeneficiary" inline>
                    <v-radio color="accent" label="Yes" value="true" />
                    <v-radio color="accent" label="No" value="false" />
                  </v-radio-group>
                </v-col>
                <v-divider />
                <v-col v-if="hasBeneficiary === 'true'">
                  <v-col xs12 pt-2>
                    <v-layout low wrap>
                      <v-col lg2 pt-2>
                        <h4 class="text-hyperlink text-uppercase">Beneficiary 1</h4>
                      </v-col>
                      <v-col lg4 pt-1>
                        <v-switch
                          v-model="showBeneficiary1"
                          color="accent"
                          inset
                          label="Primary"
                          class="mt-0 pt-0 pb-2"
                          :class="$vuetify?.breakpoint?.xs ? 'pr-2' : 'pr-3'"
                          hide-details
                        />
                      </v-col>
                    </v-layout>
                  </v-col>
                  <v-col v-if="showBeneficiary1">
                    <v-col pt-2>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-text-field
                            v-model="firstName"
                            label="First Name"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2'">
                          <v-text-field
                            v-model="middleName"
                            label="M.I"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2'">
                          <v-text-field
                            v-model="lastName"
                            label="Last Name"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col pt-2>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-select
                            v-model="beneficiaryRelationship"
                            label="Beneficiary Relationship"
                            browser-
                            :items="beneficiaryRelationshipList"
                            clearable
                            variant="filled"
                            density="compact"
                            return-object
                            auto-select-first
                            :rules="[(v) => !!v || 'Beneficiary Relationship is required']"
                            class="shortcutdropdown"
                          />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-4' : 'pl-2'">
                          <v-select
                            v-model="shareType"
                            label="Share"
                            browser-
                            :items="shareList"
                            clearable
                            variant="filled"
                            density="compact"
                            return-object
                            auto-select-first
                            :rules="[(v) => !!v || 'Share is required']"
                            class="shortcutdropdown"
                          />
                        </v-col>
                      </v-layout>
                      <v-col pt-3 pb-3> Primary Total: 0% </v-col>
                    </v-col>
                  </v-col>
                  <v-divider />
                  <v-col
                    pt-2
                    class="cursor-pointer text-uppercase"
                    :class="[!$vuetify.dark ? 'text-hyperlink' : 'text-white']"
                    @click="addOtherBeneficiaryInfo()"
                  >
                    Add Another Beneficiary
                  </v-col>
                  <v-col v-if="addBeneficiaryInfo">
                    <v-col xs12 pt-2>
                      <v-layout low wrap>
                        <v-col lg2 pt-2>
                          <h4 class="text-hyperlink text-uppercase">Beneficiary 2</h4>
                        </v-col>
                        <v-col lg4 pt-1>
                          <v-switch
                            v-model="showBeneficiary2"
                            color="accent"
                            inset
                            label="Primary"
                            class="mt-0 pt-0 pb-2"
                            :class="$vuetify?.breakpoint?.xs ? 'pr-2' : 'pr-3'"
                            hide-details
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                    <v-col v-if="showBeneficiary2">
                      <v-col pt-2>
                        <v-layout low wrap>
                          <v-col lg4 sm4 xs12>
                            <v-text-field
                              v-model="firstName2"
                              label="First Name"
                              variant="filled"
                              maxlength="13"
                              browser-
                              @keyup.enter="event.target.blur"
                            />
                          </v-col>
                          <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2'">
                            <v-text-field
                              v-model="middleName2"
                              label="M.I"
                              variant="filled"
                              maxlength="13"
                              browser-
                              @keyup.enter="event.target.blur"
                            />
                          </v-col>
                          <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'pl-2'">
                            <v-text-field
                              v-model="lastName2"
                              label="Last Name"
                              variant="filled"
                              maxlength="13"
                              browser-
                              @keyup.enter="event.target.blur"
                            />
                          </v-col>
                        </v-layout>
                      </v-col>
                      <v-col pt-2>
                        <v-layout low wrap>
                          <v-col lg4 sm4 xs12>
                            <v-select
                              v-model="beneficiaryRelationship2"
                              label="Beneficiary Relationship"
                              browser-
                              :items="beneficiaryRelationshipList"
                              clearable
                              variant="filled"
                              density="compact"
                              return-object
                              auto-select-first
                              :rules="[(v) => !!v || 'Beneficiary Relationship is required']"
                              class="shortcutdropdown"
                            />
                          </v-col>
                          <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-4' : 'pl-2'">
                            <v-select
                              v-model="shareType2"
                              label="Share"
                              browser-
                              :items="shareList"
                              clearable
                              variant="filled"
                              density="compact"
                              return-object
                              auto-select-first
                              :rules="[(v) => !!v || 'Share is required']"
                              class="shortcutdropdown"
                            />
                          </v-col>
                        </v-layout>
                        <v-col pt-3 pb-3> Primary Total: 0% </v-col>
                      </v-col>
                    </v-col>
                  </v-col>
                </v-col>

                <v-col pt-5>
                  <v-layout row wrap>
                    <v-col xs12 class="text-right">
                      <v-btn
                        variant="outlined"
                        :color="$vuetify.dark ? '' : 'accent'"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
                        @click="resetBeneficiaryData()"
                      >
                        Clear
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 2">
                        Back
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 4">
                        Continue
                      </v-btn>
                    </v-col>
                  </v-layout>
                </v-col>
              </v-stepper-content>
            </v-card>
          </v-col>
          <v-col v-if="e6 === 4" lg9 sm9 pt-2 pr-1>
            <v-card class="elevation-4" :class="$vuetify?.breakpoint?.xs ? '' : 'pa-3'">
              <v-stepper-content step="4">
                <h2 class="font-weight-medium">Create Investment Lineup</h2>
                <v-col pt-3>
                  <h4 class="font-weight-medium">Search Investment</h4>
                </v-col>
                <v-col class="align-self pb-2">
                  <v-layout low wrap>
                    <v-col pt-3 lg3>
                      <v-btn-toggle mandatory class="toggleCSS">
                        <v-btn variant="flat" value="Open" size="small">
                          <span>Funds</span>
                        </v-btn>
                        <v-btn variant="flat" value="Cash" size="small">
                          <span>Cash</span>
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                    <v-col xs12 lg6 :class="$vuetify?.breakpoint?.mdAndDown ? 'pt-3' : ''">
                      <v-text-field
                        v-model="search"
                        variant="filled"
                        append-icon="search"
                        label="Search Asset Name/ Symbol/ Model"
                        :class="$vuetify?.breakpoint?.xs ? 'pt-3' : ''"
                      />
                    </v-col>
                    <v-col lg2 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pt-1 pl-2'">
                      <v-btn
                        :color="!$vuetify.dark ? 'accent' : ''"
                        :disable="!valid"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-2' : ''"
                      >
                        Add
                      </v-btn>
                    </v-col>
                  </v-layout>
                  <v-col>
                    <v-layout row wrap>
                      <v-col v-if="$vuetify?.breakpoint?.smAndDown" class="mt-2 text-right">
                        <span class="pr-2 pl-2" @click="overrideAll = true">
                          <b :class="$vuetify.dark ? '' : 'text-accent'">Override All Fees</b>
                        </span>
                        <span>|</span>
                        <span class="pr-2 pl-2" @click="dialog = true">
                          <b :class="$vuetify.dark ? '' : 'text-accent'">Delete All</b>
                        </span>
                      </v-col>
                      <v-col
                        v-show="!$vuetify?.breakpoint?.smAndDown"
                        class="text-right cursor-pointer"
                        :class="$vuetify.dark ? '' : 'text-accent'"
                        xs11
                        sm12
                      >
                        <div>
                          <span class="pr-2" @click="dialog = true">
                            <b>Delete All</b>
                          </span>
                          <span>|</span>
                          <span class="pr-2 pl-2" @click="overrideAll = true">
                            <b>Override All Fees</b>
                          </span>
                          <span>|</span>
                          <span class="pl-2 pr-2">
                            <b>{{ editFees === false ? editText : saveText }}</b>
                          </span>
                        </div>
                      </v-col>
                    </v-layout>
                    <v-data-table
                      v-model:pagination="investmentPagination"
                      :headers="Headers"
                      density="compact"
                      :items="investmentList"
                      hide-default-footer
                      item-key="Name"
                      sortable
                      class="fixed-header v-table__overflow numberSize"
                      :style="
                        $vuetify?.breakpoint?.smAndDown
                          ? 'max-height: 200px;backface-visibility: hidden;'
                          : 'max-height: 500px;backface-visibility: hidden;'
                      "
                      :rows-per-page-items="investmentList.length > 0 ? [investmentList.length] : [investmentList.length]"
                    >
                      <template v-if="!$vuetify?.breakpoint?.smAndDown" #no-data>
                        <tr>
                          <td colspan="12" class="text-center">No data available</td>
                        </tr>
                      </template>
                      <template #headers="props">
                        <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                          <th width="10" class="pa-1" />
                          <th
                            v-for="header in props.headers"
                            v-show="header.text != ''"
                            :key="header.text"
                            :class="[
                              'column sortable',
                              investmentPagination.descending ? 'desc' : 'asc',
                              header.value === investmentPagination.sortBy ? 'active' : ''
                            ]"
                            :align="header.align"
                            :width="header.width"
                            class="pa-1"
                            @click="changeSort(header.value)"
                          >
                            <v-icon v-if="header.align == 'right'"> arrow_upward </v-icon>
                            {{ header.text }}
                            <v-icon v-if="header.align == 'left'"> arrow_upward </v-icon>
                          </th>
                        </tr>
                      </template>
                      <template #items="props">
                        <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                          <td class="pa-1 text-center">
                            <v-checkbox />
                          </td>
                          <td class="pa-1 text-left">
                            <v-hover v-slot="{ hover }">
                              <h4 class="pt-1" :class="hover ? 'text-decoration-underline text-capitalize' : ''">
                                <a
                                  href="javascript:void(0)"
                                  :class="
                                    $vuetify.dark
                                      ? 'cursor-pointer text_decoration text-white text-capitalize'
                                      : 'cursor-pointer text_decoration text-accent text-capitalize'
                                  "
                                >
                                  <b>{{ props.item.Ticker }}</b>
                                </a>
                              </h4>
                            </v-hover>
                          </td>
                          <td class="pa-1 text-left">
                            {{ props.item.Name }}
                          </td>
                          <td class="pa-1 text-right">{{ formatPercent(props.item.AllocationTarget) }}%</td>
                          <td class="pa-1 text-right">{{ formatPercent(props.item.mgmt) }}%</td>
                          <td class="pa-1 text-right">{{ formatPercent(props.item.tload) }}%</td>
                          <td class="pa-1 text-right">{{ formatPercent(props.item.SubTA) }}%</td>
                          <td class="pa-1 text-right">{{ formatPercent(props.item.expratio) }}%</td>
                        </tr>
                        <tr
                          v-else
                          :class="[props.expanded ? 'border_bottom_none' : '']"
                          @click="longtap ? longTapFunction(event, props.item) : ''"
                        >
                          <td class="pr-3 pl-3">
                            <v-col class="xs12">
                              <v-layout row wrap>
                                <v-col xs10 sm10 lg10 md10>
                                  <h5 class="pt-1">
                                    <span class="text-grey">Name</span>
                                  </h5>
                                  <h4 class="text-uppercase">
                                    {{ props.item.Name }}
                                  </h4>
                                </v-col>
                                <v-col xs2 sm2 lg2 md2 class="text-right exapnd_pointer">
                                  <v-btn icon variant="flat" @click="props.expanded = !props.expanded">
                                    <v-icon :class="props.expanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                                  </v-btn>
                                </v-col>
                                <v-col xs8 sm10 lg10 md10>
                                  <h5 class="pt-1">
                                    <span class="text-grey">Symbol</span>
                                  </h5>
                                  <h4 class="text-uppercase">
                                    <a
                                      href="javascript:void(0)"
                                      :class="
                                        $vuetify.dark
                                          ? 'cursor-pointer text_decoration text-white text-capitalize'
                                          : 'cursor-pointer text_decoration text-accent text-capitalize'
                                      "
                                    >
                                      <b>{{ props.item.Ticker }}</b>
                                    </a>
                                  </h4>
                                </v-col>
                              </v-layout>
                            </v-col>
                          </td>
                        </tr>
                      </template>
                      <template v-if="$vuetify?.breakpoint?.smAndDown" #expand="props">
                        <v-card flat :class="$vuetify.dark ? '' : 'expandable_background'">
                          <v-card-text>
                            <v-layout row wrap>
                              <v-col xs6>
                                <v-col xs12>
                                  <h5 class="pl-0 pb-0 text-grey">Mgmt</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>{{ formatPercent(props.item.mgmt) }}%</h4>
                                </v-col>
                              </v-col>
                              <v-col xs6>
                                <v-col xs12>
                                  <h5 class="pl-0 pb-0 text-grey">12b-1</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>{{ formatPercent(props.item.tload) }}%</h4>
                                </v-col>
                              </v-col>
                              <v-col xs6>
                                <v-col xs12>
                                  <h5 class="pl-0 pb-0 text-grey">SubTA</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>{{ formatPercent(props.item.SubTA) }}%</h4>
                                </v-col>
                              </v-col>
                              <v-col xs6>
                                <v-col xs12>
                                  <h5 class="pl-0 pb-0 text-grey">Total Fees</h5>
                                </v-col>
                                <v-col xs12>
                                  <h4>{{ formatPercent(props.item.expratio) }}%</h4>
                                </v-col>
                              </v-col>
                            </v-layout>
                          </v-card-text>
                        </v-card>
                      </template>
                      <template #footer>
                        <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                          <td />
                          <td />
                          <td class="text-left pa-1">
                            <strong>Total Funds: {{ investmentList.length }}</strong>
                          </td>
                          <td class="text-right pa-1">
                            <strong v-if="investmentList.length > 0">{{ totalAllocationTarget }}%</strong>
                          </td>
                          <td class="text-right pa-1">
                            <strong v-if="investmentList.length > 0">{{ totalNewMgmt }}%</strong>
                          </td>
                          <td class="text-right pa-1">
                            <strong v-if="investmentList.length > 0">{{ totalNewLoad }}%</strong>
                          </td>
                          <td class="text-right pa-1">
                            <strong v-if="investmentList.length > 0">{{ totalNewSubta }}%</strong>
                          </td>
                          <td class="text-right pa-1">
                            <strong v-if="investmentList.length > 0">{{ totalNewExpratio }}%</strong>
                          </td>
                        </tr>
                        <tr v-if="$vuetify?.breakpoint?.smAndDown && investmentList.length > 0">
                          <td class="pr-3 pl-3">
                            <v-col xs12>
                              <v-layout row wrap>
                                <v-col xs4>
                                  <v-layout row wrap>
                                    <v-col xs12>
                                      <h5 class="pt-1">
                                        <span class="text-grey">Total Funds</span>
                                      </h5>
                                      <h4 class="text-uppercase">
                                        {{ investmentList.length }}
                                      </h4>
                                    </v-col>
                                  </v-layout>
                                </v-col>
                                <v-col xs4>
                                  <v-layout row wrap>
                                    <v-col xs12>
                                      <h5 class="pt-1">
                                        <span class="text-grey">Total Mgmt</span>
                                      </h5>
                                      <h4 class="text-uppercase">{{ totalNewMgmt }}%</h4>
                                    </v-col>
                                  </v-layout>
                                </v-col>
                                <v-col xs4>
                                  <v-layout row wrap>
                                    <v-col xs12>
                                      <h5 class="pt-1">
                                        <span class="text-grey">Total 12b-1</span>
                                      </h5>
                                      <h4 class="text-uppercase">{{ totalNewLoad }}%</h4>
                                    </v-col>
                                  </v-layout>
                                </v-col>
                                <v-col xs4>
                                  <v-layout row wrap>
                                    <v-col xs12>
                                      <h5 class="pt-1">
                                        <span class="text-grey">Total SubTA</span>
                                      </h5>
                                      <h4 class="text-uppercase">{{ totalNewSubta }}%</h4>
                                    </v-col>
                                  </v-layout>
                                </v-col>
                                <v-col xs4>
                                  <v-layout row wrap>
                                    <v-col xs12>
                                      <h5 class="pt-1">
                                        <span class="text-grey">Total Fees</span>
                                      </h5>
                                      <h4 class="text-uppercase">{{ totalNewExpratio }}%</h4>
                                    </v-col>
                                  </v-layout>
                                </v-col>
                              </v-layout>
                            </v-col>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-col>
                <v-col pt-3>
                  <v-col xs12>
                    <h3 class="font-weight-medium">Automatic Rebalance</h3>
                    <h4 class="pt-2">
                      This feature automatically rebalance the investment in your account to maintain the asset allocation
                      percentage that you elect.
                    </h4>
                  </v-col>
                  <v-col class="text-right" xs12 pt-3>
                    <v-switch
                      v-model="showRebalanceAccount"
                      color="accent"
                      inset
                      label="Automatically rebalanced account"
                      class="mt-0 pt-0 pb-2"
                      :class="$vuetify?.breakpoint?.xs ? 'pr-2' : 'pr-3'"
                      hide-details
                    />
                  </v-col>
                  <v-col v-if="showRebalanceAccount" xs12>
                    <v-layout low wrap>
                      <v-col lg1 pt-3 mr-3>
                        <h4>Frequency</h4>
                      </v-col>
                      <v-col lg3>
                        <v-select
                          v-model="quartelyType"
                          label="Quartely"
                          browser-
                          :items="quartelyList"
                          clearable
                          variant="filled"
                          density="compact"
                          return-object
                          auto-select-first
                          :rules="[(v) => !!v || 'Quartely is required']"
                          class="shortcutdropdown"
                        />
                      </v-col>
                    </v-layout>
                  </v-col>
                </v-col>
                <v-col pt-5>
                  <v-layout row wrap>
                    <v-col xs12 class="text-right">
                      <v-btn
                        variant="outlined"
                        :color="$vuetify.dark ? '' : 'accent'"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
                      >
                        Clear
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 3">
                        Back
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 5">
                        Continue
                      </v-btn>
                    </v-col>
                  </v-layout>
                </v-col>
              </v-stepper-content>
            </v-card>
          </v-col>
          <v-col v-if="e6 === 5" lg9 sm9 pt-2 pr-1>
            <v-card class="elevation-4" :class="$vuetify?.breakpoint?.xs ? '' : 'pa-3'">
              <v-stepper-content step="5">
                <h2 class="font-weight-medium">Fees</h2>
                <v-layout low wrap>
                  <v-col pt-3 lg4>
                    <h4 class="font-weight-medium">Select Fee Schedule</h4>
                  </v-col>
                  <v-col pt-2 pl-2 lg4>
                    <v-switch
                      v-model="showFeeSchedule"
                      color="accent"
                      inset
                      label="Override Fees"
                      class="mt-0 pt-0 pb-2"
                      :class="$vuetify?.breakpoint?.xs ? 'pr-2' : 'pr-3'"
                      hide-details
                    />
                  </v-col>
                </v-layout>
                <v-col v-if="showFeeSchedule">
                  <v-layout low wrap>
                    <v-col pt-1 lg4 sm4 xs12>
                      <v-select
                        v-model="feeSchedule"
                        label="Fee Schedule ABC"
                        browser-
                        :items="feeScheduleList"
                        clearable
                        variant="filled"
                        density="compact"
                        return-object
                        auto-select-first
                        :rules="[(v) => !!v || 'Fee Schedule ABC is required']"
                        class="shortcutdropdown"
                      />
                    </v-col>
                    <v-col pt-1 lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pl-2'">
                      <v-text-field
                        v-model="percentData"
                        variant="filled"
                        label="%"
                        class="shortcutdropdown"
                        :menu-props="{ attach: true }"
                      />
                    </v-col>
                  </v-layout>

                  <v-col pt-2 lg7>
                    <h4 class="font-weight-medium">Fee Details: Fee Schedule ABC</h4>
                    <v-col pt-2 class="font-weight-medium">
                      <v-layout low wrap>
                        <v-col lg4> Asset based tiered fees: </v-col>
                        <v-col lg2> Cost </v-col>
                      </v-layout>
                    </v-col>
                    <v-col pt-1>
                      <v-layout low wrap>
                        <v-col lg4> $0-$200,000 </v-col>
                        <v-col lg2> 0.30% </v-col>
                      </v-layout>
                    </v-col>
                    <v-col pt-1>
                      <v-layout low wrap>
                        <v-col lg4> $200,000+ </v-col>
                        <v-col lg2> 0.25% </v-col>
                      </v-layout>
                    </v-col>
                    <v-col pt-1>
                      <v-layout low wrap>
                        <v-col lg4> $500,000+ </v-col>
                        <v-col lg2> 0.20% </v-col>
                      </v-layout>
                    </v-col>
                  </v-col>
                  <v-col class="text-right" xs12 pt-3>
                    <v-switch
                      v-model="showFeeMinMaxLimit"
                      color="accent"
                      inset
                      label="Are Fees with in Min/Max Limit?"
                      class="mt-0 pt-0 pb-2"
                      :class="$vuetify?.breakpoint?.xs ? 'pr-2' : 'pr-3'"
                      hide-details
                    />
                  </v-col>
                  <v-col v-if="showFeeMinMaxLimit" pt-2> Lorem ipsum dolor sit amit. Ut svgsffsg asgagdthg asrgefgdfhbgdh </v-col>
                </v-col>
                <v-col pt-5>
                  <v-layout row wrap>
                    <v-col xs12 class="text-right">
                      <v-btn
                        variant="outlined"
                        :color="$vuetify.dark ? '' : 'accent'"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
                        @click="resetFeeData()"
                      >
                        Clear
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 4">
                        Back
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 6">
                        Continue
                      </v-btn>
                    </v-col>
                  </v-layout>
                </v-col>
              </v-stepper-content>
            </v-card>
          </v-col>
          <v-col v-if="e6 === 6" lg9 sm9 pt-2 pr-1>
            <v-card class="elevation-4" :class="$vuetify?.breakpoint?.xs ? '' : 'pa-3'">
              <v-stepper-content step="6">
                <h2 class="font-weight-medium">Account Consolidation</h2>
                <v-col pt-3>
                  <v-col> Are there any other accounts to tranfer </v-col>
                  <v-radio-group v-model="hasAccounts" inline>
                    <v-radio color="accent" label="Yes" value="true" />
                    <v-radio color="accent" label="No" value="false" />
                  </v-radio-group>
                </v-col>
                <v-col v-if="hasAccounts === 'true'">
                  <v-divider />
                  <v-col pt-2 class="text-hyperlink text-uppercase"> Account 1 </v-col>
                  <v-col pt-2>
                    <v-layout low wrap>
                      <v-col lg4 sm4 xs12>
                        <v-text-field
                          v-model="estimatedAssets"
                          label="Estimated Assets"
                          variant="filled"
                          maxlength="13"
                          browser-
                          @keyup.enter="event.target.blur"
                        />
                      </v-col>
                      <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pl-2'">
                        <v-select
                          v-model="currentProvider"
                          label="Current Provider"
                          browser-
                          :items="currentProviderList"
                          clearable
                          variant="filled"
                          density="compact"
                          return-object
                          auto-select-first
                          :rules="[(v) => !!v || 'Current Provider is required']"
                          class="shortcutdropdown"
                        />
                      </v-col>
                    </v-layout>
                  </v-col>
                  <v-col
                    pt-2
                    class="text-hyperlink cursor-pointer text-uppercase"
                    :class="[$vuetify?.breakpoint?.xs ? 'pt-2' : '', !$vuetify.dark ? 'text-hyperlink' : 'text-white']"
                    @click="addOtherAccountInfo()"
                  >
                    Add Another
                  </v-col>
                  <v-col v-if="addAccountInfo">
                    <v-col pt-2 class="text-hyperlink text-uppercase"> Account 2 </v-col>
                    <v-col pt-2>
                      <v-layout low wrap>
                        <v-col lg4 sm4 xs12>
                          <v-text-field
                            v-model="estimatedAssets2"
                            label="Estimated Assets"
                            variant="filled"
                            maxlength="13"
                            browser-
                            @keyup.enter="event.target.blur"
                          />
                        </v-col>
                        <v-col lg4 sm4 xs12 :class="$vuetify?.breakpoint?.xs ? 'pt-2' : 'pl-2'">
                          <v-select
                            v-model="currentProvider2"
                            label="Current Provider"
                            browser-
                            :items="currentProviderList"
                            clearable
                            variant="filled"
                            density="compact"
                            return-object
                            auto-select-first
                            :rules="[(v) => !!v || 'Current Provider is required']"
                            class="shortcutdropdown"
                          />
                        </v-col>
                      </v-layout>
                    </v-col>
                  </v-col>
                </v-col>
                <v-col pt-5>
                  <v-layout row wrap>
                    <v-col xs12 class="text-right">
                      <v-btn
                        variant="outlined"
                        :color="$vuetify.dark ? '' : 'accent'"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
                        @click="resetAccountConsolidationData()"
                      >
                        Clear
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 5">
                        Back
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 7">
                        Continue
                      </v-btn>
                    </v-col>
                  </v-layout>
                </v-col>
              </v-stepper-content>
            </v-card>
          </v-col>
          <v-col v-if="e6 === 7" lg9 sm9 pt-2 pr-1>
            <v-card class="elevation-4" :class="$vuetify?.breakpoint?.xs ? '' : 'pa-3'">
              <v-stepper-content step="7">
                <h2 class="font-weight-medium">Confirmation</h2>
                <v-layout low wrap>
                  <v-col lg10 pt-3>
                    <h4 class="font-weight-medium text-hyperlink text-uppercase">Participant Info</h4>
                  </v-col>
                  <v-col pt-3 class="text-hyperlink text-uppercase text-right">
                    <h4 class="font-weight-medium cursor-pointer" @click="e6 = 2">Edit</h4>
                  </v-col>
                </v-layout>
                <v-col v-if="!$vuetify?.breakpoint?.xs" pt-2>
                  <v-layout low wrap>
                    <v-col lg4> Name </v-col>
                    <v-col lg4 pl-2> Email </v-col>
                    <v-col lg4 pl-2> Phone </v-col>
                  </v-layout>
                </v-col>
                <v-col v-if="!$vuetify?.breakpoint?.xs" pt-2 pb-3>
                  <v-layout low wrap>
                    <v-col lg4> Jaydn M Macweget </v-col>
                    <v-col lg4 pl-2> jaydn.macdsfgd@gmail.com </v-col>
                    <v-col lg4 pl-2> 123-456-7890 </v-col>
                  </v-layout>
                </v-col>
                <v-col v-if="$vuetify?.breakpoint?.xs">
                  <v-col xs12>
                    <v-layout row wrap>
                      <v-col xs6>
                        <v-col xs12>
                          <h5>Name</h5>
                        </v-col>
                        <v-col xs12>
                          <h4>Jaydn M Macweget</h4>
                        </v-col>
                      </v-col>
                    </v-layout>
                  </v-col>
                  <v-col xs12>
                    <v-layout row wrap>
                      <v-col xs6>
                        <v-col xs12>
                          <h5>Email</h5>
                        </v-col>
                        <v-col xs12>
                          <h4>jaydn.macdsfgd@gmail.com</h4>
                        </v-col>
                      </v-col>
                    </v-layout>
                  </v-col>
                  <v-col xs12>
                    <v-layout row wrap>
                      <v-col xs6>
                        <v-col xs12>
                          <h5>Phone</h5>
                        </v-col>
                        <v-col xs12>
                          <h4>123-456-7890</h4>
                        </v-col>
                      </v-col>
                    </v-layout>
                  </v-col>
                </v-col>
                <v-divider />
                <v-layout low wrap class="pb-2">
                  <v-col lg10 pt-3>
                    <h4 class="font-weight-medium text-hyperlink text-uppercase">Investments</h4>
                  </v-col>
                  <v-col pt-3 class="text-hyperlink text-uppercase text-right">
                    <h4 class="font-weight-medium cursor-pointer" @click="e6 = 4">Edit</h4>
                  </v-col>
                </v-layout>
                <v-col>
                  <v-data-table
                    v-model:pagination="investmentPagination"
                    :headers="investmentHeaders"
                    density="compact"
                    :items="investmentList"
                    hide-default-footer
                    item-key="Name"
                    sortable
                    class="fixed-header v-table__overflow numberSize"
                    :style="
                      $vuetify?.breakpoint?.smAndDown
                        ? 'max-height: 200px;backface-visibility: hidden;'
                        : 'max-height: 500px;backface-visibility: hidden;'
                    "
                    :rows-per-page-items="investmentList.length > 0 ? [investmentList.length] : [investmentList.length]"
                  >
                    <template v-if="!$vuetify?.breakpoint?.smAndDown" #no-data>
                      <tr>
                        <td colspan="12" class="text-center">No data available</td>
                      </tr>
                    </template>
                    <template #headers="props">
                      <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                        <th
                          v-for="header in props.headers"
                          v-show="header.text != ''"
                          :key="header.text"
                          :class="[
                            'column sortable',
                            investmentPagination.descending ? 'desc' : 'asc',
                            header.value === investmentPagination.sortBy ? 'active' : ''
                          ]"
                          :align="header.align"
                          :width="header.width"
                          class="pa-1"
                          @click="changeSort(header.value)"
                        >
                          <v-icon v-if="header.align == 'right'"> arrow_upward </v-icon>
                          {{ header.text }}
                          <v-icon v-if="header.align == 'left'"> arrow_upward </v-icon>
                        </th>
                      </tr>
                    </template>
                    <template #items="props">
                      <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                        <td class="pa-1 text-left">
                          <v-hover v-slot="{ hover }">
                            <h4 class="pt-1" :class="hover ? 'text-decoration-underline text-capitalize' : ''">
                              <a
                                href="javascript:void(0)"
                                :class="
                                  $vuetify.dark
                                    ? 'cursor-pointer text_decoration text-white text-capitalize'
                                    : 'cursor-pointer text_decoration text-accent text-capitalize'
                                "
                              >
                                <b>{{ props.item.Ticker }}</b>
                              </a>
                            </h4>
                          </v-hover>
                        </td>
                        <td class="pa-1 text-left">
                          {{ props.item.Name }}
                        </td>
                        <td class="pa-1 text-right">{{ formatPercent(props.item.AllocationTarget) }}%</td>
                      </tr>
                      <tr
                        v-else
                        :class="[props.expanded ? 'border_bottom_none' : '']"
                        @click="longtap ? longTapFunction(event, props.item) : ''"
                      >
                        <td class="pr-3 pl-3">
                          <v-col class="xs12">
                            <v-layout row wrap>
                              <v-col xs10 sm10 lg10 md10>
                                <h5 class="pt-1">
                                  <span class="text-grey">Name</span>
                                </h5>
                                <h4 class="text-uppercase">
                                  {{ props.item.Name }}
                                </h4>
                              </v-col>
                              <v-col xs2 sm2 lg2 md2 class="text-right exapnd_pointer">
                                <v-btn icon variant="flat" @click="props.expanded = !props.expanded">
                                  <v-icon :class="props.expanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                                </v-btn>
                              </v-col>
                              <v-col xs8 sm10 lg10 md10>
                                <h5 class="pt-1">
                                  <span class="text-grey">Symbol</span>
                                </h5>
                                <h4 class="text-uppercase">
                                  <a
                                    href="javascript:void(0)"
                                    :class="
                                      $vuetify.dark
                                        ? 'cursor-pointer text_decoration text-white text-capitalize'
                                        : 'cursor-pointer text_decoration text-accent text-capitalize'
                                    "
                                  >
                                    <b>{{ props.item.Ticker }}</b>
                                  </a>
                                </h4>
                              </v-col>
                            </v-layout>
                          </v-col>
                        </td>
                      </tr>
                    </template>
                    <template v-if="$vuetify?.breakpoint?.smAndDown" #expand="props">
                      <v-card flat :class="$vuetify.dark ? '' : 'expandable_background'">
                        <v-card-text>
                          <v-layout row wrap>
                            <v-col xs6>
                              <v-col xs12>
                                <h5 class="pl-0 pb-0 text-grey">Allocation Target %</h5>
                              </v-col>
                              <v-col xs12>
                                <h4>{{ formatPercent(props.item.AllocationTarget) }}%</h4>
                              </v-col>
                            </v-col>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </template>
                    <template #footer>
                      <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                        <td />
                        <td class="text-left pa-1">
                          <strong>Total Funds: {{ investmentList.length }}</strong>
                        </td>
                        <td class="text-right pa-1">
                          <strong v-if="investmentList.length > 0">{{ totalAllocationTarget }}%</strong>
                        </td>
                      </tr>
                      <tr v-if="$vuetify?.breakpoint?.smAndDown && investmentList.length > 0">
                        <td class="pr-3 pl-3">
                          <v-col xs12>
                            <v-layout row wrap>
                              <v-col xs4>
                                <v-layout row wrap>
                                  <v-col xs12>
                                    <h5 class="pt-1">
                                      <span class="text-grey">Total Funds</span>
                                    </h5>
                                    <h4 class="text-uppercase">
                                      {{ investmentList.length }}
                                    </h4>
                                  </v-col>
                                </v-layout>
                              </v-col>
                              <v-col xs4>
                                <v-layout row wrap>
                                  <v-col xs12>
                                    <h5 class="pt-1">
                                      <span class="text-grey">Total Allocation Target</span>
                                    </h5>
                                    <h4 class="text-uppercase">{{ totalAllocationTarget }}%</h4>
                                  </v-col>
                                </v-layout>
                              </v-col>
                            </v-layout>
                          </v-col>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
                <v-divider />
                <v-layout low wrap>
                  <v-col lg10 pt-3>
                    <h4 class="font-weight-medium text-hyperlink text-uppercase">Fees</h4>
                  </v-col>
                  <v-col pt-3 class="text-hyperlink text-uppercase text-right">
                    <h4 class="font-weight-medium cursor-pointer" @click="e6 = 5">Edit</h4>
                  </v-col>
                </v-layout>
                <v-col> Fee Schedule </v-col>
                <v-col pb-3 class="font-weight-medium"> Fee Schedule ABC </v-col>
                <v-divider />
                <v-layout low wrap class="pb-3">
                  <v-col lg10 pt-3>
                    <h4 class="font-weight-medium text-hyperlink text-uppercase">Beneficiary Info</h4>
                  </v-col>
                  <v-col pt-3 class="text-hyperlink text-uppercase text-right">
                    <h4 class="font-weight-medium cursor-pointer" @click="e6 = 3">Edit</h4>
                  </v-col>
                </v-layout>
                <v-divider />
                <v-layout low wrap>
                  <v-col lg10 pt-3>
                    <h4 class="font-weight-medium text-hyperlink text-uppercase">Account Consolidation</h4>
                  </v-col>
                  <v-col pt-3 class="text-hyperlink text-uppercase text-right">
                    <h4 class="font-weight-medium cursor-pointer" @click="e6 = 6">Edit</h4>
                  </v-col>
                </v-layout>
                <v-col pt-5>
                  <v-layout row wrap>
                    <v-col xs12 class="text-right">
                      <v-btn
                        variant="outlined"
                        :color="$vuetify.dark ? '' : 'accent'"
                        :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
                      >
                        Clear
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 6">
                        Back
                      </v-btn>
                      <v-btn :class="[!$vuetify.dark ? 'accent' : '', $vuetify?.breakpoint?.xs ? 'mr-0' : '']" @click="e6 = 8">
                        Send
                      </v-btn>
                    </v-col>
                  </v-layout>
                </v-col>
              </v-stepper-content>
            </v-card>
          </v-col>
        </v-layout>
      </v-stepper>
    </v-col>
    <v-snackbar v-model="enrollmentFormSnackbar" top="top">
      {{ enrollmentFormSendMsg }}
      <v-btn variant="flat" color="red" @click="enrollmentFormSnackbar = false"> Close </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" persistent max-width="350">
      <ActionPopUp
        confirm-action-text="Abandon"
        cancel-action-text="Remain Here"
        action-text="Confirmation"
        :action-message="'You have unsaved changes. What would you like to do?'"
        @confirm-action="abandon()"
        @cancel-action="dialog = false"
      />
    </v-dialog>
  </v-col>
</template>
<script>
import moment from 'moment'
import ActionPopUp from '@/components/ActionPopUp'
export default {
  components: {
    ActionPopUp
  },
  data() {
    return {
      e6: 1,
      valid: false,
      investmentMsg: '',
      assetMsg: '',
      snackBar: false,
      currentSnackBar: false,
      totalNewMgmt: 0,
      totalNewLoad: 0,
      totalNewSubta: 0,
      totalNewExpratio: 0,
      totalNewAMC: 0,
      totalNewSSF: 0,
      totalNewFees: 0,
      totalNewAmount: 0,
      totalAllocationTarget: 0,
      error: false,
      asseterror: false,
      menu2: false,
      menu1: false,
      dateofBirth: null,
      dateofExpiration: null,
      headers: [
        {
          text: '',
          value: 'checkbox',
          sortable: true,
          align: 'left',
          width: '100px',
          hide: false
        },
        {
          text: 'Symbol',
          value: 'Ticker',
          sortable: true,
          align: 'left',
          width: '100px',
          hide: false
        },
        {
          text: 'Name',
          value: 'Name',
          sortable: true,
          align: 'left',
          width: '350px',
          hide: false
        },
        {
          text: 'Allocation Target %',
          value: 'AllocationTarget',
          sortable: true,
          align: 'right',
          width: '110px',
          hide: false
        },
        {
          text: 'Mgmt',
          value: 'mgmt',
          sortable: true,
          width: '100px',
          align: 'right',
          hide: false
        },
        {
          text: '12b-1',
          value: 'tload',
          sortable: true,
          width: '100px',
          align: 'right',
          hide: false
        },
        {
          text: 'SubTA',
          value: 'SubTA',
          sortable: true,
          width: '100px',
          align: 'right',
          hide: false
        },
        {
          text: 'Total Fees',
          value: 'expratio',
          sortable: true,
          width: '100px',
          align: 'right',
          hide: false
        }
      ],
      investmentList: [
        {
          Ticker: 'VFIAX ',
          Name: 'Vanguard 500 Index Admiral ',
          AllocationTarget: 1,
          expratio: 0.04,
          mgmt: 0.04,
          tload: 0,
          SubTA: 0
        },
        {
          Ticker: 'VWEAX ',
          Name: 'Vanguard High-Yield Corporate Adm ',
          AllocationTarget: 1,
          expratio: 0.13,
          mgmt: 0.13,
          tload: 0,
          SubTA: 0
        },
        {
          Ticker: 'VAIPX ',
          Name: 'Vanguard Inflation-Protected Secs Adm ',
          AllocationTarget: 1,
          expratio: 0.1,
          mgmt: 0.1,
          tload: 0,
          SubTA: 0
        },
        {
          Ticker: 'VTRIX ',
          Name: 'Vanguard International Value Inv ',
          AllocationTarget: 1,
          expratio: 0.37,
          mgmt: 0.37,
          tload: 0,
          SubTA: 0
        },
        {
          Ticker: 'VBIRX ',
          Name: 'Vanguard Short-Term Bond Index Adm ',
          AllocationTarget: 1,
          expratio: 0.06999999999999999,
          mgmt: 0.06999999999999999,
          tload: 0,
          SubTA: 0
        },
        {
          Ticker: 'VFSUX ',
          Name: 'Vanguard Short-Term Investment-Grade Adm ',
          AllocationTarget: 1,
          expratio: 0.1,
          mgmt: 0.1,
          tload: 0,
          SubTA: 0
        },
        {
          Ticker: 'VSMAX ',
          Name: 'Vanguard Small Cap Index Adm ',
          AllocationTarget: 1,
          expratio: 0.05,
          mgmt: 0.05,
          tload: 0,
          SubTA: 0
        }
      ],
      investmentPagination: {
        descending: false,
        sortBy: 'Name',
        rowsPerPage: 1000
      },
      investmentHeaders: [
        {
          text: 'Symbol',
          value: 'Ticker',
          sortable: true,
          align: 'left',
          width: '100px',
          hide: false
        },
        {
          text: 'Name',
          value: 'Name',
          sortable: true,
          align: 'left',
          width: '350px',
          hide: false
        },
        {
          text: 'Allocation Target %',
          value: 'AllocationTarget',
          sortable: true,
          align: 'right',
          width: '110px',
          hide: false
        }
      ],
      searchRelationship: 0,
      relationshipList: [
        { text: 'Relationship XYZ', value: 0 },
        {
          text: 'Relationship ABC',
          value: 1
        },
        {
          text: 'Relationship PQR',
          value: 2
        }
      ],
      searchProduct: 0,
      productList: [
        { text: 'Product 1', value: 0 },
        {
          text: 'Product 2',
          value: 1
        },
        {
          text: 'Product 3',
          value: 2
        }
      ],
      hasAdditionalInfo: 'false',
      editText: 'Edit Fees',
      saveText: 'Save Fees',
      editFees: false,
      isBirthOfDate: false,
      isExpirationOfDate: false,
      birthDate: '',
      expirationDate: '',
      checkDateErrorMsg: '',
      checkDateError: false,
      zipcodeError: false,
      zipcodeErrorMsg: '',
      zipcode: '',
      email: '',
      confirmEmail: '',
      showRebalanceAccount: false,
      hasBeneficiary: 'true',
      addBeneficiaryInfo: false,
      hasAccounts: 'true',
      addAccountInfo: false,
      showFeeSchedule: true,
      showFeeMinMaxLimit: false,
      showBeneficiary1: true,
      showBeneficiary2: true,
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      estimatedAssets: '',
      estimatedAssets2: '',
      currentProvider: '',
      currentProvider2: '',
      beneficiaryRelationship: '',
      shareType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      beneficiaryRelationship2: '',
      shareType2: '',
      firstName2: '',
      middleName2: '',
      lastName2: '',
      enrollmentFormSendMsg: '',
      enrollmentFormSnackbar: false,
      dialog: false,
      completed: false,
      countryOfCitizenship: '',
      countryOfResidency: '',
      Phone: '',
      search: '',
      feeScheduleList: [],
      feeSchedule: '',
      percentData: '',
      countryOfResidencyList: [],
      countryOfCitizenshipList: [],
      schoolList: [],
      schoolType: '',
      beneficiaryRelationshipList: [],
      shareList: [],
      currentProviderList: [],
      quartelyList: []
    }
  },
  computed: {
    Headers() {
      return this.headers.filter((h) => !h.hide)
    },
    minDate() {
      var year = moment().subtract(12, 'months').format('YYYY')
      var currentdate = new Date()
      var month = ('0' + currentdate.getMonth()).slice(-2)
      var date = ('0' + currentdate.getDate()).slice(-2)
      var minAsofDate = year + '-' + month + '-' + date
      return minAsofDate
    },
    maxDate() {
      var year = moment().add(12, 'months').format('YYYY')
      var currentdate = new Date()
      var month = ('0' + currentdate.getMonth()).slice(-2)
      var date = ('0' + currentdate.getDate()).slice(-2)
      var minAsofDate = year + '-' + month + '-' + date
      return minAsofDate
    }
  },
  watch: {
    dateofBirth: {
      handler() {
        if (!this.isBirthOfDate) this.birthDate = this.formatDate(this.dateofBirth)
        this.isBirthOfDate = false
      },
      immediate: true,
      deep: true
    },
    dateofExpiration: {
      handler() {
        if (!this.isExpirationOfDate) this.expirationDate = this.formatDate(this.dateofExpiration)
        this.isExpirationOfDate = false
      },
      immediate: true,
      deep: true
    },
    menu2: {
      handler(val) {
        if (!val) {
          this.checkDate(this.birthDate)
        }
      }
    },
    menu1: {
      handler(val) {
        if (!val) {
          this.checkDate(this.expirationDate)
        }
      }
    }
  },
  methods: {
    changeSort(column) {
      if (this.investmentPagination.sortBy === column) {
        this.investmentPagination.descending = !this.investmentPagination.descending
      } else {
        this.investmentPagination.sortBy = column
        this.investmentPagination.descending = false
      }
    },
    formatPercent: function (val) {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    },
    checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          this.birthDate = ''
          this.expirationDate = ''
          this.checkDateErrorMsg = 'Invalid date'
          this.checkDateError = true
        } else {
          this.checkDateError = false
          this.checkDateErrorMsg = ''
        }
      }
    },
    parseDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        this.isBirthOfDate = true
        this.isExpirationOfDate = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    resetData() {
      this.searchRelationship = ''
      this.searchProduct = ''
    },
    resetParticipantInfo() {
      this.schoolType = ''
      this.zipcode = ''
      this.countryOfCitizenship = ''
      this.countryOfResidency = ''
      this.expirationDate = ''
      this.birthDate = ''
      this.hasAdditionalInfo = ''
      this.Phone = ''
      this.confirmEmail = ''
      this.email = ''
    },
    resetFeeData() {
      this.showFeeSchedule = ''
      this.feeSchedule = ''
      this.percentData = ''
      this.showFeeMinMaxLimit = ''
    },
    resetBeneficiaryData() {
      this.showBeneficiary1 = true
      this.beneficiaryRelationship = ''
      this.shareType = ''
      this.showBeneficiary2 = true
      this.firstName = ''
      this.middleName = ''
      this.lastName = ''
      if (this.addBeneficiaryInfo) {
        this.beneficiaryRelationship2 = ''
        this.shareType2 = ''
        this.firstName2 = ''
        this.middleName2 = ''
        this.lastName2 = ''
      }
    },
    resetAccountConsolidationData() {
      this.estimatedAssets = ''
      this.currentProvider = ''
      if (this.addAccountInfo) {
        this.estimatedAssets2 = ''
        this.currentProvider2 = ''
      }
    },
    addOtherBeneficiaryInfo() {
      this.addBeneficiaryInfo = true
    },
    addOtherAccountInfo() {
      this.addAccountInfo = true
    },
    abandon() {
      this.abondon = true
      this.$router.push(this.toRoute)
    },
    getAddress() {
      var that = this
      if (this.zipcode) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${this.zipcode}` }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              var address = results[0].formatted_address.split(',')
              that.city = address[0].length > 0 ? address[0].trim() : ''
              that.state = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              that.companyZip = that.city + ' ' + that.state + ' ' + that.zipcode
              that.zipcodeError = false
              that.zipcodeErrorMsg = ''
            } else {
              // eslint-disable-next-line no-console
              console.log('No results found')
              that.zipcodeError = false
              that.zipcodeErrorMsg = ''
            }
          } else {
            // eslint-disable-next-line no-console
            console.log('Geocoder failed due to: ' + status)
            that.city = ''
            that.state = ''
            that.zipcodeError = true
            that.zipcodeErrorMsg = 'Invalid Zip Code'
          }
        })
      } else {
        that.city = ''
        that.state = ''
        that.companyZip = ''
        that.zipcodeError = false
        that.zipcodeErrorMsg = ''
      }
    }
  }
}
</script>
<style scoped>
.v-stepper__wrapper {
  margin-left: 20%;
}
.v-input.v-input--selection-controls.v-input--switch {
  justify-content: flex-start;
}
.hr_border {
  border: solid 1px lightgray !important;
  height: 15px;
}
.v-stepper--vertical .v-stepper__step {
  padding: 0px 0px 0px;
}
.v-divider--vertical.v-divider--inset {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 9px;
}
.v-stepper--vertical .v-stepper__content {
  margin: -8px -16px -16px 16px;
  padding: 10px 20px 16px 3px;
}
.v-stepper--vertical .v-stepper__content:not(:last-child) {
  border: none;
}
</style>
