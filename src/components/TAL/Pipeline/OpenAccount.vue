<template>
  <v-dialog v-if="filterDialog" persistent class="elevation-3" scrollable :eager="true" :max-width="dialogWidth">
    <v-card :height="dialogHeight">
      <v-card-title>
        <v-col v-if="selectedpage !== 3 && selectedpage !== 5" cols="12" xs="12">
          <v-row no-gutters>
            <v-col v-if="selectedpage !== 1" class="text-left align-self">
              <v-icon color="text-hyperlink" @click="goBackToPreviousPage(selectedpage)"> mdi-chevron-left </v-icon>
            </v-col>
            <v-col v-if="!openAccountDialog" class="text-right align-self">
              <v-icon color="text-hyperlink" @click="closeWindow()"> mdi-close </v-icon>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="selectedpage === 3 || selectedpage === 5" cols="12" xs="12">
          <v-row no-gutters class="justify-center">
            <v-col cols="9" lg="9">
              <v-card v-if="!display.xs.value" class="elevation-0 pt-2">
                <div class="flex d-flex flex-row" style="height: 25px">
                  <div
                    v-if="!$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)"
                    class="cursor-pointer start_polygon rounded-s-lg prospectingBackground ml-auto"
                    :class="screenClass"
                  >
                    <div class="pt-1">
                      <div>
                        <h5 class="steppercss" :class="[theme.dark ? 'text-black' : '', prospectClass]">Prospecting</h5>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                    class="cursor-pointer middle_polygon nonSelectedBackground"
                    :class="screenClass"
                  >
                    <div class="pt-1">
                      <div>
                        <h5 class="steppercss" :class="[theme.dark ? 'text-black' : '', evaluateClass]">Evaluating</h5>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    class="cursor-pointer middle_polygon nonSelectedBackground"
                    :class="screenClass"
                  >
                    <div class="pt-1">
                      <div>
                        <h5 class="steppercss" :class="[theme.dark ? 'text-black' : '', proposeClass]">Proposing</h5>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    class="cursor-pointer middle_polygon nonSelectedBackground"
                    :class="screenClass"
                  >
                    <div class="pt-1">
                      <div>
                        <h5 class="steppercss" :class="[theme.dark ? 'text-black' : '', finalizeClass]">Finalizing</h5>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                    class="cursor-pointer end_polygon rounded-e-lg nonSelectedBackground mr-auto"
                    :class="completedClass"
                  >
                    <div class="pt-1 pl-5">
                      <div class="text-center">
                        <h5 class="steppercss" :class="[theme.dark ? 'text-black' : '']">Completed</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-card-title>
      <v-card-text class="justify-center align-center">
        <div v-if="loading" class="container pa-0">
          <v-col class="justify-center">
            <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
              <Loader :loading-text="`Loading..`" :loading="loading" />
            </v-card>
          </v-col>
        </div>
        <div v-if="!loading" class="container pa-0">
          <v-row no-gutters class="justify-center">
            <v-col v-if="selectedpage === 1" cols="12" xs="12" lg="7" md="7" sm="7" class="justify-center">
              <v-form ref="form" v-model="valid">
                <v-col class="text-center pa-0">
                  <h1>Individual Contact Information</h1>
                </v-col>
                <v-col class="pt-4 pb-8">
                  <v-col class="pa-0">
                    <v-col class="text-h6"> Contact Name, Email and Phone </v-col>
                  </v-col>
                  <v-col class="pt-4">
                    <v-text-field
                      v-model="firstName"
                      placeholder="First Name *"
                      required
                      variant="outlined"
                      maxlength="140"
                      density="compact"
                      single-line
                      :rules="[(v) => !!v || 'First Name is required']"
                      hide-details
                    />
                  </v-col>
                  <v-col class="pt-2">
                    <v-text-field
                      v-model="lastName"
                      placeholder="Last Name *"
                      required
                      variant="outlined"
                      maxlength="140"
                      density="compact"
                      single-line
                      :rules="[(v) => !!v || 'Last Name is required']"
                      hide-details
                    />
                  </v-col>
                  <v-col class="pt-2">
                    <v-text-field
                      v-model="email"
                      placeholder="Email Address *"
                      single-line
                      variant="outlined"
                      density="compact"
                      required
                      :rules="[
                        (v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !!v || 'Email Address is required')
                      ]"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" lg="12" class="pt-2">
                    <v-row no-gutters>
                      <v-col cols="8" xl="8" lg="8" md="8" sm="8" xs="8">
                        <v-text-field
                          v-model="phone"
                          v-input-mask="{
                            mask: '(999)[ 999][-9999]',
                            showMaskOnHover: false,
                            rightAlign: false,
                            placeholder: '',
                            allowMinus: false,
                            allowPlus: true,
                            autoUnmask: true
                          }"
                          density="compact"
                          placeholder="Phone Number (optional)"
                          single-line
                          variant="outlined"
                          class="pr-4"
                          :error="phoneError"
                          :error-messages="phoneErrorMsg"
                          @keyup="checkPhoneNumber()"
                        />
                      </v-col>
                      <v-col cols="4" xl="4" lg="4" md="4" sm="4" xs="4">
                        <v-select v-model="typeForPhone" density="compact" :items="items" variant="outlined" hide-details />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
                <v-col class="text-center">
                  <v-btn
                    class="text-capitalize"
                    style="width: 250px; height: 46px"
                    :disabled="!valid"
                    :color="theme.dark ? '' : 'accent'"
                    @click="goToPlanSelectionPage(email)"
                  >
                    Next
                  </v-btn>
                </v-col>
              </v-form>
            </v-col>
            <v-col v-if="selectedpage === 2" cols="12" xs="12" lg="7" md="7" sm="7" class="justify-center">
              <v-col class="text-center mb-4 pa-0">
                <h1>Plan Type</h1>
              </v-col>
              <v-col class="pt-8 pb-8 pa-0">
                <v-col class="pa-0">
                  <v-select
                    v-model="individualPlanType"
                    density="compact"
                    variant="outlined"
                    placeholder="Select Individual Plan Type..."
                    :items="individualPlanTypeList"
                    hide-details
                    item-title="PlanType"
                    item-value="SFId"
                    @update:model-value="checkValue()"
                  />
                </v-col>
                <v-col v-if="displayPlansDropdown && !showSimpleIRANote && !showDisclaimer" class="pt-2 pa-0">
                  <v-select
                    v-model="planValue"
                    density="compact"
                    variant="outlined"
                    placeholder="Select Plan"
                    :items="planList"
                    append-icon="icon-chevron-down"
                    hide-details
                    item-title="Name"
                    item-value="Id"
                    @update:model-value="checkSimpleIRA()"
                  />
                </v-col>
                <v-col v-if="displayPlansDropdown && showSimpleIRANote" class="text-center font_12 pt-4 py-2">
                  <h3>
                    Your user account does not have any Simple IRA plans established on the platform. Get started by filling out a
                    plan establishment form located
                    <a class="cursor-pointer" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="createCorporate()">
                      here</a
                    >.
                  </h3>
                </v-col>
                <v-col v-if="displayPlansDropdown && showDisclaimer" class="text-left font_12 py-2 pt-4">
                  <h3>
                    <b>Disclaimer:</b> If you are not finding the municipality you are searching for, it may not be a plan with an
                    approved payroll slot, please call our team at 866-634-5873, option 2 to find out more.
                  </h3>
                </v-col>
                <v-col v-if="individualPlanType && !displayPlansDropdown" class="pt-2 pa-0">
                  <v-select
                    v-model="stateValue"
                    density="compact"
                    variant="outlined"
                    :placeholder="stateValue ? '' : 'Select school district state'"
                    :items="stateList"
                    append-icon="icon-chevron-down"
                    hide-details
                    item-title="BillingState"
                    item-value="BillingState"
                    :disabled="fromPage === 'School'"
                    @update:model-value="clearSchoolDistrict()"
                  />
                </v-col>
                <v-col v-if="stateValue && !displayPlansDropdown" class="pt-2 pa-0">
                  <v-text-field
                    v-model="searchTextSchoolDistrict"
                    ref="wildCardSearchSchoolDistrict"
                    density="compact"
                    variant="outlined"
                    :clearable="searchTextSchoolDistrict ? (searchTextSchoolDistrict.trim() !== '' ? true : false) : false"
                    placeholder="Enter school district"
                    :loading="loadSchoolDistrict"
                    :disabled="fromPage === 'School'"
                    :menu-props="{ attach: true }"
                    @click="hideCardSchoolDistrict = true"
                    @click:clear="clearSchoolDistrict()"
                    @update:model-value="checkFields('schoolDistrict')"
                  />
                  <v-card
                    v-if="hideCardSchoolDistrict && filterSchoolDistricts.length > 0"
                    :width="wildCardSearchSchoolDistrict ? wildCardSearchSchoolDistrict.$el.clientWidth : '200px'"
                    :color="theme.dark ? '' : 'white'"
                    class="elevation-3 plans_card_height"
                  >
                    <v-col v-if="filterSchoolDistricts.length > 0" class="pl-2 pr-2 pt-0 pb-0">
                      <v-list density="compact">
                        <v-tooltip v-for="(item, index) in filterSchoolDistricts" :key="index" location="top">
                          <template #activator="{ props }">
                            <v-list-item :key="index" @click="getSchoolDistrictValue(item)">
                              <v-list-item-title v-bind="props" class="text-uppercase">
                                {{ `${item.SchoolDistrictName} - ${item.PayrollVendorSlotName} (Owner)` }}
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span class="text-uppercase">{{ item.SchoolDistrictName }}</span>
                        </v-tooltip>
                      </v-list>
                    </v-col>
                  </v-card>
                </v-col>
                <v-col v-if="stateValue && fromPage !== 'School'" class="text-left font_12 py-2">
                  <h3>
                    <b>Disclaimer:</b> If you are not finding the school district you are searching for, it may not be a district
                    with an approved payroll slot, please call our team at 866-634-5873, option 3 to find out more.
                  </h3>
                </v-col>
              </v-col>
              <v-col v-if="!showSimpleIRANote && !showDisclaimer" class="text-center" :class="planValue ? 'mt-6' : 'mt-16'">
                <v-btn
                  class="text-capitalize"
                  style="width: 250px; height: 46px"
                  :disabled="disablePlanType"
                  :color="theme.dark ? '' : 'accent'"
                  @click="saveDetails(schoolDistrictValue)"
                >
                  Next
                </v-btn>
              </v-col>
            </v-col>
            <v-col v-if="selectedpage === 3" cols="12" xs="12" lg="8" md="6" sm="7" class="justify-center pa-0">
              <v-col class="pa-0">
                <v-col class="text-center font-weight-medium pa-0">
                  <h1>You're all set</h1>
                </v-col>
                <v-col class="text-center pt-10 pa-0">
                  <h2>Your prospect is saved. Here are your next steps.</h2>
                </v-col>
                <v-col cols="12" xs="12" class="text-center pt-16 mt-10 pa-0">
                  <v-btn class="text-capitalize" :color="theme.dark ? '' : 'accent'" @click="createProposal()">
                    Start Application
                  </v-btn>
                </v-col>
                <v-col v-if="false" cols="12" xs="12" class="text-center pt-2 pa-0">
                  <v-btn class="ma-1" variant="outlined" :color="theme.dark ? '' : 'accent'" @click="goToProspectDetailsPage()">
                    Go to Prospect Details
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="12" class="text-center py-8 pa-0">
                  <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeWindow()"
                    ><b>Close, I'll do this later</b></a
                  >
                </v-col>
              </v-col>
            </v-col>
            <v-col v-if="selectedpage === 4" cols="12" xs="12" lg="8" md="10" sm="12" class="justify-center">
              <v-col>
                <v-col cols="12" xs="12" class="text-center font-weight-medium">
                  <h1>Submit a Plan Establishment Guide (PEG) Request</h1>
                </v-col>
                <v-col v-if="!display.xs.value" class="text-center pt-8 pl-4">
                  <v-col class="text-left">
                    <h2>This school district does not have an available payroll slot.Tell us a little about the</h2>
                  </v-col>
                  <v-col class="text-left">
                    <h2>request and We’ll follow up with the school district to get the payroll slot approved</h2>
                  </v-col>
                </v-col>
                <v-col v-if="display.xs.value" cols="12" xs="12" class="text-center pt-8">
                  <v-col class="text-left">
                    <h2>
                      This school district does not have an available payroll slot.Tell us a little about the request and We’ll
                      follow up with the school district to get the payroll slot approved
                    </h2>
                  </v-col>
                </v-col>

                <v-col class="text-center" :class="!display.xs.value ? 'pt-7' : 'pt-2'">
                  <v-row v-if="!display.xs.value">
                    <v-col cols="8" xs="8" class="text-h5 pt-4 pl-10">
                      <v-col class="text-left">
                        <h4>Do you have a contact at the district who</h4>
                      </v-col>
                      <v-col class="text-left">
                        <h4>can approve the payroll slot?</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="3" xs="3" :class="!display.xs.value ? '' : 'pl-16'">
                      <v-radio-group v-model="payrollSlot" inline>
                        <v-radio color="accent" label="No" value="false" />
                        <v-radio color="accent" label="Yes" value="true" />
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-col v-if="display.xs.value">
                    <v-col cols="12" xs="12" class="text-h5 pt-2">
                      <v-col cols="12" xs="12" class="text-left">
                        <h4>Do you have a contact at the district who can approve the payroll slot?</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="12" xs="12" :class="!display.xs.value ? '' : 'pl-16'">
                      <v-radio-group v-model="payrollSlot" inline>
                        <v-radio color="accent" label="No" value="false" />
                        <v-radio color="accent" label="Yes" value="true" />
                      </v-radio-group>
                    </v-col>
                  </v-col>
                  <v-col v-if="payrollSlot === 'true'" class="mt-2" :class="!display.xs.value ? 'pl-10 ' : ''">
                    <v-col>
                      <h3 class="text-left font-weight-bold">Please Provide name of contact</h3>
                      <v-col class="pt-2">
                        <v-row no-gutters>
                          <v-col cols="6" xs="6" lg="5" class="pr-2">
                            <v-text-field
                              v-model="firstName1"
                              density="compact"
                              placeholder="First Name"
                              single-line
                              variant="outlined"
                              hide-details
                            />
                          </v-col>
                          <v-col cols="6" xs="6" lg="5" class="pl-2">
                            <v-text-field
                              v-model="lastName1"
                              density="compact"
                              placeholder="Last Name"
                              single-line
                              variant="outlined"
                              hide-details
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-col>
                </v-col>
                <v-col class="text-center" :class="!display.xs.value ? 'pt-4' : ''">
                  <v-row v-if="!display.xs.value">
                    <v-col cols="8" xs="8" class="text-h5 pt-4 pl-10 text-left">
                      <h4>Are you part a Request for Proposal (RFP)?</h4>
                    </v-col>
                    <v-col cols="3" xs="3" :class="!display.xs.value ? '' : 'pl-16'">
                      <v-radio-group v-model="rfpValue" inline>
                        <v-radio color="accent" label="No" value="false" />
                        <v-radio color="accent" label="Yes" value="true" />
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-col v-if="display.xs.value">
                    <v-col cols="12" xs="12" class="text-h5 pt-2 text-left">
                      <h4>Are you part a Request for Proposal (RFP)?</h4>
                    </v-col>
                    <v-col cols="12" xs="12" :class="!display.xs.value ? '' : 'pl-16'">
                      <v-radio-group v-model="rfpValue" inline>
                        <v-radio color="accent" label="No" value="false" />
                        <v-radio color="accent" label="Yes" value="true" />
                      </v-radio-group>
                    </v-col>
                  </v-col>
                </v-col>
                <v-col cols="12" xs="12" :class="!display.xs.value ? 'pt-16' : 'pt-4'" class="text-center">
                  <v-btn
                    class="text-capitalize"
                    :disabled="payrollSlot === '' || rfpValue === ''"
                    :color="theme.dark ? '' : 'accent'"
                    @click="GoToProspectDetailsPage()"
                  >
                    Next
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="12" class="text-center" pt-6 mb-10>
                  <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeWindow()"
                    ><b>Skip, I'll do this later</b></a
                  >
                </v-col>
              </v-col>
            </v-col>
            <v-col v-if="selectedpage === 5" cols="12" xs="12" lg="12" class="justify-center">
              <v-col v-if="payrollSlot === 'false' && rfpValue === 'false'">
                <v-col class="text-center font-weight-medium">
                  <h1>You're all set</h1>
                </v-col>
                <v-col class="text-center text-h5" pt-10>
                  <h5>Your prospect is saved.</h5>
                </v-col>
                <v-col class="text-center text-h5" pt-4>
                  <h5>Please reach out to our team for information about the payroll approval process.</h5>
                </v-col>
                <v-col class="text-center text-h5" pt-4>
                  <h5>Call <b>888-888-8888</b></h5>
                </v-col>
                <v-col class="text-center text-h5" pt-4>
                  <h5>- OR -</h5>
                </v-col>
                <v-col class="text-center text-h5" pt-4>
                  <v-row no-gutters>
                    <v-col pr-2 class="text-right">
                      <h5>Email</h5>
                    </v-col>
                    <v-col pl-2 class="text-left" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']">
                      <h5>sales@pcsretirement.com</h5>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="false" cols="12" xs="12" class="text-center pt-8">
                  <v-btn class="text-capitalize" :color="theme.dark ? '' : 'accent'" @click="goToProspectDetailsPage()">
                    Go to Prospect Details
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="12" class="text-center" py-8>
                  <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeWindow()"
                    ><b>Close, I'll do this later</b></a
                  >
                </v-col>
              </v-col>
              <v-col v-else>
                <v-col class="text-center font-weight-medium">
                  <h1>You're all set</h1>
                </v-col>
                <v-col class="text-center text-h5" pt-10>
                  <h5>Your prospect is saved and your Plan Establishment Guide Request has been submitted.</h5>
                </v-col>
                <v-col class="text-center text-h5" pt-4>
                  <h5>Our team will reach out to you shortly to discuss your request.</h5>
                </v-col>
                <v-col v-if="false" cols="12" xs="12" class="text-center pt-16">
                  <v-btn class="text-capitalize" :color="theme.dark ? '' : 'accent'" @click="goToProspectDetailsPage()">
                    Go to Prospect Details
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="12" class="text-center" py-8>
                  <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeWindow()"
                    ><b>Close, I'll do this later</b></a
                  >
                </v-col>
              </v-col>
            </v-col>
            <v-col v-if="selectedpage === 6" cols="12" xs="12" lg="6" class="justify-center pt-16 pb-12">
              <v-col class="text-h5 text-center"> Sponsor Contact Information </v-col>
              <v-col class="text-center pt-10 pb-8">
                <v-col cols="12" lg="12" class="pt-2">
                  <v-row no-gutters>
                    <v-col>
                      <v-text-field
                        v-model="searchText"
                        :clearable="searchText ? (searchText.trim() !== '' ? true : false) : false"
                        append-icon
                        return-object
                        multiple
                        hide-details
                        @blur=";/-00[0-9]/.exec(searchText) ? searchBlur(true) : searchBlur(false)"
                        hide-selected
                        @click:clear="clearSponsorSearch()"
                        ref="wildCardSearch"
                        @change="checkCurrentLocation('search')"
                        placeholder="Sponsor Name"
                        @update:model-value="checkFields('company')"
                        variant="outlined"
                        density="compact"
                        single-line
                      >
                        <template #append>
                          <v-icon size="21" :color="theme.dark ? '' : 'accent'" class="icon-search cursor-pointer" />
                        </template>
                      </v-text-field>
                      <v-card
                        v-if="hideCard && filterPlans.length > 0 && showEmployerSponsored"
                        :width="wildCardSearch ? wildCardSearch.$el.clientWidth : '200px'"
                        :color="theme.dark ? '' : 'white'"
                        class="elevation-3 plans_card_height"
                      >
                        <v-col v-if="filterPlans.length > 0 && showEmployerSponsored" class="pl-2 pr-2 pt-0 pb-0">
                          <v-list density="compact">
                            <v-tooltip v-for="(item, index) in filterPlans" :key="index" location="top">
                              <template #activator="{ props }">
                                <v-list-item :key="index" @click="checkCurrentLocation('search')">
                                  <v-list-item-title v-bind="props" class="text-uppercase">
                                    {{ item.name }}
                                  </v-list-item-title>
                                </v-list-item>
                              </template>
                              <span class="text-uppercase">{{ item }}</span>
                            </v-tooltip>
                          </v-list>
                        </v-col>
                      </v-card>
                    </v-col>
                    <v-col class="text-left pt-2" @click="showHideDetails()">
                      <span
                        :class="!theme.dark ? 'text-hyperlink' : 'text-white'"
                        class="font-weight-regular text-left cursor-pointer"
                        color="#0077cc"
                        >Additional Employer Information
                        <!-- <v-icon
                          v-if="!showInformation"
                          slot="append"
                          size="14"
                          class="padding_top_2 icon-chevron-up"
                          :color="!theme.dark ? 'primary' : ''"
                        />
                        <v-icon
                          v-if="showInformation"
                          slot="append"
                          size="14"
                          class="padding_top_2 icon-chevron-down"
                          :color="!theme.dark ? 'primary' : ''"
                        /> -->
                      </span>
                    </v-col>
                    <v-col v-if="showInformation">
                      <v-row no-gutters>
                        <v-col cols="8" xl="6" lg="6" md="8" sm="8" xs="8" class="pt-2">
                          <v-text-field
                            v-model="contactFirstName"
                            placeholder="Contact First Name"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                        <v-col xl="6" lg="6" md="8" sm="4" xs="4" cols="4" class="pt-2 pl-2">
                          <v-text-field
                            v-model="contactLastName"
                            placeholder="Contact Last Name"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col cols="8" xs="8" xl="5" lg="5" md="8" sm="8" class="pt-2">
                          <v-text-field
                            v-model="estLiveDate"
                            placeholder="Est. Live Date"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                        <v-col cols="4" xl="5" lg="5" md="6" sm="4" xs="4" class="pt-2 pl-2">
                          <v-text-field
                            v-model="noOfEmployees"
                            placeholder="# of employees"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col cols="8" xl="7" lg="7" md="8" sm="8" xs="8" class="pt-2">
                          <v-text-field
                            v-model="streetAddress"
                            placeholder="Street Address"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                        <v-col cols="4" xl="5" lg="5" md="8" sm="4" xs="4" class="pt-2 pl-2">
                          <v-text-field
                            v-model="zipcode"
                            placeholder="Zip Code"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col cols="8" xl="7" lg="7" md="8" sm="8" xs="8" class="pt-2">
                          <v-text-field
                            v-model="city"
                            placeholder="City"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                        <v-col cols="4" xl="5" lg="5" md="8" sm="4" xs="4" class="pt-2 pl-2">
                          <v-select
                            v-model="state"
                            variant="outlined"
                            :items="stateList"
                            placeholder="Select State"
                            auto-select-first
                            hide-no-data
                            density="compact"
                            append-icon="icon-chevron-down"
                            @update:model-value="checkFields('state')"
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col cols="8" xl="5" lg="5" md="8" sm="8" xs="8" class="pt-2">
                          <v-text-field
                            v-model="EINNo"
                            placeholder="EIN# (optional)"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                        <v-col cols="4" xl="7" lg="7" md="8" sm="4" xs="4" class="pt-2 pl-2">
                          <v-text-field
                            v-model="contactEmail"
                            placeholder="Contact email (optional)"
                            variant="outlined"
                            maxlength="140"
                            density="compact"
                            single-line
                            hide-details
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col class="text-center">
                <v-btn
                  class="text-capitalize"
                  :disabled="contactFirstName === '' || contactLastName === '' || contactEmail === ''"
                  :color="theme.dark ? '' : 'accent'"
                  @click="goToGroupPlanSelectedPage()"
                >
                  Next
                </v-btn>
              </v-col>
            </v-col>
            <v-col v-if="selectedpage === 7" cols="12" xs="12" lg="6" class="justify-center pt-16 pb-12">
              <v-col class="text-h5 text-center"> Plan Type? </v-col>
              <v-col class="pt-8 pb-8">
                <v-col>
                  <v-select
                    v-model="groupPlanType"
                    density="compact"
                    variant="outlined"
                    placeholder="Select Group Plan Type..."
                    :items="groupPlanTypeList"
                    item-title="PlanTypeName"
                    item-value="PlanTypeId"
                    hide-details
                  />
                </v-col>
              </v-col>
              <v-col class="text-center">
                <v-btn
                  class="text-capitalize"
                  :disabled="groupPlanType === ''"
                  :color="theme.dark ? '' : 'accent'"
                  @click="saveDetails(schoolDistrictValue)"
                >
                  Next
                </v-btn>
              </v-col>
            </v-col>
            <v-col v-if="contactInfoDialog" cols="12" xs="12" class="justify-center">
              <v-col>
                <!-- here code -->
                <DuplicateNameSuggestion
                  v-model="contactInfoDialog"
                  :duplicate-email-i-d-list="duplicateEmailIDList"
                  @new-selectedpage="chkNewSelectedpage"
                  @plan-selection-page="planSelectionPage"
                  @open-view-contact="openDuplicatesEditDialog"
                />
              </v-col>
            </v-col>
            <v-col v-if="presenterInfoDialog" cols="12" xs="12">
              <PresenterInfo
                :key="componentOpenAccountKey"
                v-model="presenterInfoDialog"
                :opportunity-id="opportunityId"
                :registration-id="registrationId"
                :plan-type-name-value="planTypeNameValue"
                :school-district-id="schoolDistrictAccountId"
                @close-all-window="closeWindow"
                @open-save-close="openCloseDialog"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="filterCloseDialog"
      persistent
      class="elevation-3"
      scrollable
      :eager="true"
      :max-width="!display.mdAndDown.value ? '400px' : '300px'"
    >
      <v-card>
        <v-card-text>
          <v-col>
            <v-col class="text-center pt-12">
              <h1>You have unsaved changes</h1>
            </v-col>
            <v-col class="text-center text-h5" pt-6>
              <h5>save your changes before closing this window</h5>
            </v-col>
            <v-col cols="12" xs="12" class="text-center pt-14">
              <v-btn class="text-none" :color="theme.dark ? '' : 'accent'" @click="saveAndClose()">Save and close</v-btn>
            </v-col>
            <v-col v-if="!showLastCancelDialog" cols="12" xs="12" class="text-center pt-3 pb-6">
              <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="closeDialogWindow()"
                ><b>Don't close</b></a
              >
            </v-col>
            <v-col v-if="showLastCancelDialog" cols="12" xs="12" class="text-center pt-3 pb-6">
              <a
                class="font_14"
                :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                @click="closeWithoutSaving('Participants')"
                ><b>Close without saving</b></a
              >
            </v-col>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="openAccountDialog"
      persistent
      class="elevation-3"
      scrollable
      :max-width="!display.mdAndDown.value ? '400px' : '300px'"
    >
      <v-card>
        <v-card-text>
          <v-col class="pa-0">
            <v-col class="text-center text-h5 pt-6">
              <h5>
                {{
                  `You will now continue the Online Account Opening application for ${
                    from === 'Duplicates' ? opportunityItem.Name : opportunityItem.Account
                  } from where you last left off.`
                }}
              </h5>
            </v-col>
            <v-col cols="12" xs="12" class="text-center pt-14">
              <v-btn class="text-none pl-15 pr-15" size="large" :color="theme.dark ? '' : 'accent'" @click="editOpenAccount()">
                Continue
              </v-btn>
            </v-col>
            <v-col cols="12" xs="12" class="text-center pt-3 pb-6">
              <a
                class="font_14 cursor-pointer"
                :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                @click="closeEditDialog()"
              >
                <b>Cancel, Go back</b>
              </a>
            </v-col>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import DuplicateNameSuggestion from '@/components/TAL/Pipeline/DuplicateNameSuggestion'
import PresenterInfo from '@/components/TAL/CreateProposal/PresenterInfo'
import Loader from '@/components/NewLoader'
export default {
  components: {
    DuplicateNameSuggestion,
    PresenterInfo,
    Loader
  },
  props: ['value', 'fromPage'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const router = useRouter()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const $nextTick = instance.appContext.config.globalProperties.$nextTick
    const wildCardSearchSchoolDistrict = ref(null)
    const wildCardSearch = ref(null)
    const valid = ref(true)
    const loadSchoolDistrict = ref(false)
    const selectedpage = ref(1)
    const items = ref(['Mobile', 'Home'])
    const groupPlanType = ref('')
    const individualPlanType = ref('')
    const individualPlanTypeList = ref([])
    const groupPlanTypeList = ref([])
    const hideCard = ref(false)
    const firstName = ref('')
    const lastName = ref('')
    const ein = ref('')
    const stateValue = ref('')
    const schoolDistrictValue = ref('')
    const stateList = ref([])
    const phone = ref('')
    const email = ref('')
    const emailRegex = ref(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    )
    const filterCloseDialog = ref(false)
    const rfpValue = ref('')
    const payrollSlot = ref('')
    const firstName1 = ref('')
    const lastName1 = ref('')
    const contactInfoDialog = ref(false)
    const presenterInfoDialog = ref(false)
    const contactFirstName = ref('')
    const contactLastName = ref('')
    const estLiveDate = ref('')
    const noOfEmployees = ref('')
    const streetAddress = ref('')
    const zipcode = ref('')
    const city = ref('')
    const state = ref('')
    const EINNo = ref('')
    const contactEmail = ref('')
    const searchText = ref('')
    const filterPlans = ref([])
    const showInformation = ref(false)
    const searchTextSchoolDistrict = ref('')
    const filterSchoolDistricts = ref([])
    const hideCardSchoolDistrict = ref(false)
    const componentOpenAccountKey = ref(0)
    const typeForPhone = ref('Mobile')
    const recordTypeDetails = ref([])
    const schoolDistrictAccountId = ref(0)
    const duplicateEmailIDList = ref([])
    const loading = ref(false)
    const validAdd = ref(true)
    const opportunityId = ref('')
    const registrationId = ref('')
    const disablePlanType = ref(true)
    const phoneError = ref(false)
    const phoneErrorMsg = ref('')
    const openAccountDialog = ref(false)
    const opportunityItem = ref({})
    const showLastCancelDialog = ref(false)
    const planValue = ref('')
    const planList = ref([])
    const plan = ref('')
    const typeName = ref('')
    const planTypeNameValue = ref('')
    const showSimpleIRANote = ref(false)
    const selectedSchoolName = ref('')
    const planId = ref('')
    const governmentPlanList = ref([])
    const displayPlansDropdown = ref(false)
    const showDisclaimer = ref(false)
    const simpleIRAPlanList = ref([])
    const from = ref('')
    const filterDialog = ref({
      get: () => {
        if (props.value) {
          getIndividualPlanTypeList()
          getRecordTypeId()
          getStateList()
          if (showSimpleIRAPlanType.value) getSimpleIRAPlanList()
          if (show457bGovernmentPlanType.value) get457bGovernmentPlanList()
        }
        return props.value
      },
      set: (value) => {
        emit('update:modelValue', value)
      }
    })
    const screenClass = computed(() => {
      if (display.width.value >= 1920 && display.height.value >= 1024) {
        return 'flexWidthBigScreen'
      }
      if (display.width.value === 1366) {
        return 'flexWidthHidpi'
      }
      if (display.width.value === 1280) {
        return 'flexWidthMdpi'
      }
      if (display.width.value === 1024) {
        return 'flexWidthIpadPro'
      } else return 'flex_width_stepper'
    })
    const completedClass = computed(() => {
      if (display.width.value >= 1920 && display.height.value >= 1024) {
        return 'stepperCompletedBigScreen'
      }
      if (display.width.value === 1366) {
        return 'stepperCompletedHidpi'
      }
      if (display.width.value === 1280) {
        return 'stepperCompletedMdpi'
      }
      if (display.width.value === 1024) {
        return 'stepperCompletedIpadPro'
      } else return 'stepperCompleted'
    })
    const prospectClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-4'
      }
      if (display.width.value === 1280) {
        return 'pl-3'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      } else return 'pl-8'
    })
    const evaluateClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-5'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      } else return 'pl-10'
    })
    const proposeClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-5'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      } else return 'pl-10'
    })
    const finalizeClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-6'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      } else return 'pl-10'
    })
    const showEmployerSponsored = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    })
    const showSchool = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Schools
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c, $authz.typeOfBusiness.Schools)
        )
      } else return true
    })
    const showIndividuals = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Individuals
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Individuals
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Individuals
          )
        )
      } else return true
    })
    const dialogWidth = computed(() => {
      if (display.xl.value) return '55%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    const dialogHeight = computed(() => {
      if (display.xl.value) return `calc(100vh - 300px)`
      else if (display.lg.value) {
        if (display.width.value < 1400 && display.width.value > 1300) return `calc(100vh - 100px)`
        else return `calc(100vh - 200px)`
      } else if (display.md.value) return `calc(100vh - 200px)`
      else if (display.sm.value) return `calc(100vh - 300px)`
      else return `calc(100vh - 100px)`
    })
    const showSimpleIRAPlanType = computed(() => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        ) &&
        store.state.user.selectedProgram.programName !== $authz.program.Axos &&
        store.state.user.selectedProgram.programName !== $authz.managedPlan.PA &&
        store.state.user.selectedProgram.programName !== $authz.managedPlan.MML
      ) {
        return true
      } else return false
    })
    const show457bGovernmentPlanType = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Municipalities
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Municipalities
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Municipalities
          )
        )
      } else return true
    })
    const show457fIndividualTaxExemptPlan = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Schools
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c, $authz.typeOfBusiness.Schools)
        )
      } else return true
    })
    const clearSponsorSearch = () => {
      hideCard.value = false
      searchText.value = ''
      plan.value = ''
      ein.value = ''
      filterPlans.value = []
      checkCurrentLocation('search')
    }
    const clearSchoolDistrict = () => {
      hideCardSchoolDistrict.value = false
      searchTextSchoolDistrict.value = ''
      filterSchoolDistricts.value = []
      disablePlanType.value = true
    }
    const openTeacherAccount = (val, schoolName) => {
      schoolDistrictAccountId.value = val && val.accountId ? val.accountId : ''
      searchTextSchoolDistrict.value = val && val.name ? `${val.name} - ${val.payrollVendorSlotName} (Owner)` : ''
      schoolDistrictValue.value = val.name + ' ' + val.payrollSlot
      var address = val && val.country ? val.country.trim() : ''
      if (address) {
        var comma = address.indexOf(',')
        var after = address.substring(comma + 2)
        var space = after.lastIndexOf(' ')
        var state = space > -1 ? after.slice(0, space) : after
        stateValue.value = state ? state : ''
      } else {
        stateValue.value = ''
      }
      store.state.openAccountDetail.schoolDistrictAccountId = schoolDistrictAccountId.value
      selectedSchoolName.value = schoolName ? schoolName : ''
      getSchoolName(schoolDistrictAccountId.value)
      disablePlanType.value = false
      opportunityItem.value = {}
      selectedpage.value = 1
    }
    const openEditDialog = (val) => {
      opportunityItem.value = val ? val : {}
      if (opportunityItem.value) {
        filterDialog.value = true
        openAccountDialog.value = true
      }
    }
    const openDuplicatesEditDialog = (obj) => {
      opportunityItem.value = obj.val ? obj.val : {}
      from.value = obj.from
      if (opportunityItem.value) {
        filterDialog.value = true
        openAccountDialog.value = true
      }
    }
    const closeEditDialog = () => {
      if (from.value === 'Duplicates') {
        opportunityItem.value = {}
        store.state.openAccountDetail = {}
        filterDialog.value = true
        openAccountDialog.value = false
      } else {
        opportunityItem.value = {}
        store.state.openAccountDetail = {}
        filterDialog.value = false
        openAccountDialog.value = false
      }
    }
    const editOpenAccount = () => {
      if (opportunityItem.value) {
        openAccountDialog.value = false
        contactInfoDialog.value = false
        loading.value = true
        selectedpage.value = 3
        $axios
          .get(`/api/v1/sfdc/opportunity/${opportunityItem.value.OpportunityId}`)
          .then((success) => {
            if (success.data.d) {
              opportunityId.value = success.data.d.Id
              registrationId.value = success.data.d.RegistrationId ? success.data.d.RegistrationId : ''
              schoolDistrictAccountId.value = success.data.d.AccountId ? success.data.d.AccountId : ''
              planTypeNameValue.value = success.data.d.PlanTypeName ? success.data.d.PlanTypeName : ''
              planId.value = success.data.d.PlanId ? success.data.d.PlanId : ''
              store.state.openAccountDetail = success.data.d
              store.state.openAccountDetail.OpportunityId = opportunityId.value
              store.state.openAccountDetail.schoolDistrictAccountId = schoolDistrictAccountId.value
              store.state.openAccountDetail.fromPipeline = 1
              getRegistrationDetail(true)
              getSchoolName(schoolDistrictAccountId.value)
            }
          })
          .catch(() => {
            loading.value = false
          })
      }
    }
    const getRegistrationDetail = (val) => {
      $axios.get(`/api/v1/sfdc/Registration/${registrationId.value}`).then((success) => {
        var registrationObject = success.data.d ? success.data.d : {}
        if (Object.keys(store.state.openAccountDetail).length === 0) {
          store.state.openAccountDetail = registrationObject
          store.state.openAccountDetail.RegistrationId = registrationId.value
          store.state.openAccountDetail.OpportunityId = opportunityId.value
          store.state.openAccountDetail.schoolDistrictAccountId = schoolDistrictAccountId.value
        } else {
          Object.assign(store.state.openAccountDetail, registrationObject)
        }
        store.state.openAccountDetail.PlanId = planId.value ? planId.value : ''
        store.state.openAccountDetail.PlanTypeName = planTypeNameValue.value ? planTypeNameValue.value : ''
        if (planTypeNameValue.value === $authz.planType.Individual_457_b_Governmental_Plan) {
          planList.value = governmentPlanList.value
        } else if (planTypeNameValue.value === $authz.planType.Individual_Simple_IRA) {
          planList.value = simpleIRAPlanList.value
        } else {
          planList.value = []
        }
        store.state.openAccountDetail.planList = planList.value ? planList.value : []
        if (!val) getSchoolName(schoolDistrictAccountId.value)
        if (val) presenterInfoDialog.value = true
        loading.value = false
      })
    }
    const getSchoolName = (schoolDistrictAccountId) => {
      if (schoolDistrictAccountId) {
        $axios.get(`/api/v1/${schoolDistrictAccountId}/schooldistrictsbyId`).then((success) => {
          if (success.data.d && success.data.d.schooldistrictData.length > 0) {
            if (Object.keys(store.state.openAccountDetail).length > 0) {
              store.state.openAccountDetail.schoolDistrictList = success.data.d.schooldistrictData
              store.state.openAccountDetail.schoolList =
                success.data.d.schooldistrictData[0].schools && success.data.d.schooldistrictData[0].schools.length > 0
                  ? success.data.d.schooldistrictData[0].schools
                  : []
              if (props.fromPage === 'School') {
                store.state.openAccountDetail.SchoolName = selectedSchoolName.value
                store.state.openAccountDetail.fromPage = selectedSchoolName.value ? props.fromPage : ''
              }
            }
          }
        })
      }
    }
    const createCorporate = () => {
      router.push('/TAL/StartupPlan').catch(() => {})
    }
    const createParticipant = () => {
      selectedpage.value = 1
    }
    const goBackToPreviousPage = (val) => {
      if (val === 1) {
        selectedpage.value = 0
      } else if (val === 2) {
        selectedpage.value = 1
      } else if (val === 4) {
        selectedpage.value = 2
      } else if (val === 6) {
        selectedpage.value = 0
      } else if (val === 7) {
        selectedpage.value = 6
      }
    }
    const checkSimpleIRA = () => {
      if (planValue.value) {
        disablePlanType.value = false
      } else {
        disablePlanType.value = true
      }
    }
    const checkValue = () => {
      if (individualPlanTypeList.value.length > 1) {
        var planNameData = individualPlanTypeList.value.filter((a) => a.SFId === individualPlanType.value)
        typeName.value = planNameData[0].PlanType
        if (typeName.value === $authz.planType.Individual_Simple_IRA && showSimpleIRAPlanType.value) {
          displayPlansDropdown.value = true
          if (simpleIRAPlanList.value.length === 0) {
            showSimpleIRANote.value = true
            showDisclaimer.value = false
          } else {
            showSimpleIRANote.value = false
            showDisclaimer.value = false
          }
          planList.value = simpleIRAPlanList.value
        } else if (typeName.value === $authz.planType.Individual_457_b_Governmental_Plan && show457bGovernmentPlanType.value) {
          if (governmentPlanList.value.length === 0) {
            showDisclaimer.value = true
            showSimpleIRANote.value = false
          } else {
            showDisclaimer.value = false
            showSimpleIRANote.value = false
          }
          displayPlansDropdown.value = true
          planList.value = governmentPlanList.value
        } else {
          displayPlansDropdown.value = false
          showSimpleIRANote.value = false
          showDisclaimer.value = false
        }
      } else {
        showSimpleIRANote.value = false
        displayPlansDropdown.value = false
        showDisclaimer.value = false
      }
      planValue.value = ''
      if (props.fromPage !== 'School') {
        searchTextSchoolDistrict.value = ''
        stateValue.value = ''
        hideCardSchoolDistrict.value = false
        filterSchoolDistricts.value = []
        disablePlanType.value = true
      }
    }
    const checkPhoneNumber = () => {
      if (phone.value) {
        if (phone.value.length < 10) {
          phoneError.value = true
          phoneErrorMsg.value = 'Invalid Phone Number'
          return
        } else {
          phoneError.value = false
          phoneErrorMsg.value = ''
        }
      } else {
        phoneError.value = false
        phoneErrorMsg.value = ''
      }
    }
    const goToPlanSelectionPage = (val) => {
      var contactId = []
      contactId = store.state.user.contactId
      $axios.get(`/api/v1/sfdc/Registration/${val}/duplicates/${contactId}`).then((success) => {
        duplicateEmailIDList.value = success.data.d && success.data.d.length ? success.data.d : []

        if (success.data.d && success.data.d.length > 0) {
          contactInfoDialog.value = true
        } else {
          selectedpage.value = 2
        }
      })
    }
    const goToGroupPlanSelectedPage = () => {
      selectedpage.value = 7
      displayGroupPlanTypeList()
    }
    const saveDetails = (val) => {
      if (val.includes('Approval Required')) {
        selectedpage.value = 4
      } else {
        selectedpage.value = 3
        saveIndividualsDetails()
      }
    }
    const displayGroupPlanTypeList = () => {
      $axios.get(`/api/v1/sfdc/group/plantypes`).then((success) => {
        if (success.data.d) {
          groupPlanTypeList.value = success.data.d
        }
      })
    }
    const openCloseDialog = (val) => {
      presenterInfoDialog.value = true
      filterCloseDialog.value = true
      if (val === 12) {
        showLastCancelDialog.value = true
      }
    }
    const closeDialogWindow = () => {
      filterCloseDialog.value = false
      presenterInfoDialog.value = true
    }
    const closeWindow = () => {
      resetData()
      selectedpage.value = 1
      store.state.openAccountDetail = {}
      filterDialog.value = false
      presenterInfoDialog.value = false
    }
    const GoToProspectDetailsPage = () => {
      saveIndividualsDetails()
      selectedpage.value = 5
    }
    const saveAndClose = () => {
      selectedpage.value = 1
      if (Object.keys(store.state.openAccountDetail).length > 0) {
        $axios.post(
          `/api/v1/sfdc/opportunity/${store.state.openAccountDetail.OpportunityId}/lastclosingstate/${store.state.openAccountDetail.LastClosingState}`
        )
      }
      store.state.openAccountDetail = {}
      filterDialog.value = false
      resetData()
      if (showLastCancelDialog.value) {
        closeWithoutSaving('Participants')
      }
    }
    const chkNewSelectedpage = () => {
      selectedpage.value = 1
    }
    const planSelectionPage = () => {
      selectedpage.value = 2
    }
    const createProposal = () => {
      presenterInfoDialog.value = true
    }
    const searchBlur = (val) => {
      if (val) {
        ein.value = searchText.value
      } else {
        plan.value = searchText.value
        ein.value = ''
      }
    }
    const checkFields = (val) => {
      switch (val) {
        case 'company':
          ein.value = ''
          if (searchText.value === '') {
            filterPlans.value = []
          }
          getPlanResults()
          break
        case 'schoolDistrict':
          if (searchTextSchoolDistrict.value === '') {
            filterSchoolDistricts.value = []
            disablePlanType.value = true
          }
          getSchoolDistrictResults(stateValue.value)
          break
        default:
          break
      }
    }
    const getPlanResults = async () => {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/tal/plan/autocomplete/plan/${event.target.value}`
        }
        let res = await $axios(config)
        filterPlans.value = res.data.d
      } else hideCard.value = false
    }
    const showHideDetails = () => {
      showInformation.value = !showInformation.value
    }
    const checkCurrentLocation = async (from) => {
      if (from === 'search') {
        showInformation.value = true
        if (showEmployerSponsored.value) {
          var planSearchRequest = {
            retrieveResultCountOnly: false,
            ein: ein.value
          }
          await $axios.post(`/api/v1/tal/plan/search`, planSearchRequest).then((success) => {
            $nextTick(() => {
              zipcode.value = success.data.d.results[0].ZIPCODE
              city.value = success.data.d.results[0].SCITY
              state.value = success.data.d.results[0].SSTATE
              streetAddress.value = success.data.d.results[0].SSTREET
            })
          })
        }
      }
    }
    const getSchoolDistrictResults = async (state) => {
      if (searchTextSchoolDistrict.value) {
        loadSchoolDistrict.value = true
        const config = {
          method: 'get',
          url: `/api/v1/${state}/schooldistricts`
        }
        let res = await $axios(config)
        var schoolDistrictData
        schoolDistrictData = res.data.d && res.data.d.length > 0 ? res.data.d.filter((a) => a.PayrollSlot === 'Approved') : []
        filterSchoolDistricts.value = schoolDistrictData.filter((a) =>
          a.SchoolDistrictName.toUpperCase().includes(searchTextSchoolDistrict.value.toUpperCase())
        )
        if (filterSchoolDistricts.value && filterSchoolDistricts.value.length > 0) {
          filterSchoolDistricts.value.sort(function (a, b) {
            if (a.SchoolDistrictName < b.SchoolDistrictName) {
              return -1
            }
            if (a.SchoolDistrictName > b.SchoolDistrictName) {
              return 1
            }
            return 0
          })
        }
        hideCardSchoolDistrict.value = filterSchoolDistricts.value && filterSchoolDistricts.value.length > 0 ? true : false
        loadSchoolDistrict.value = false
      } else {
        hideCardSchoolDistrict.value = false
        loadSchoolDistrict.value = false
        disablePlanType.value = true
      }
    }
    const getSchoolDistrictValue = (val) => {
      searchTextSchoolDistrict.value = `${val.SchoolDistrictName} - ${val.PayrollVendorSlotName} (Owner)`
      schoolDistrictValue.value = val.SchoolDistrictName + ' ' + val.PayrollSlot
      schoolDistrictAccountId.value = val.SchoolDistrictAccountId
      disablePlanType.value = false
      filterSchoolDistricts.value = []
    }
    const getIndividualPlanTypeList = () => {
      disablePlanType.value = true
      $axios.get(`/api/v1/tal/plan/plantypempaaflow`).then((success) => {
        if (success.data.d && success.data.d.length > 0) {
          var planTypeValue = success.data.d.filter((a) => a.Context === props.fromPage)
          individualPlanTypeList.value = planTypeValue && planTypeValue.length > 0 ? planTypeValue : []
          if (!showSimpleIRAPlanType.value) {
            var hideSimple = individualPlanTypeList.value.findIndex((a) => a.PlanType === 'SIMPLE IRA')
            if (hideSimple > -1) individualPlanTypeList.value.splice(hideSimple, 1)
          }
          if (!show457fIndividualTaxExemptPlan.value) {
            var hide457f = individualPlanTypeList.value.findIndex((a) => a.PlanType === '457(f) Individual Tax Exempt Plan')
            if (hide457f > -1) individualPlanTypeList.value.splice(hide457f, 1)
          }
          if (!show457bGovernmentPlanType.value) {
            var hide457bGovernmentalPlan = individualPlanTypeList.value.findIndex(
              (a) => a.PlanType === $authz.planType.Individual_457_b_Governmental_Plan
            )
            if (hide457bGovernmentalPlan > -1) individualPlanTypeList.value.splice(hide457bGovernmentalPlan, 1)
          }
          if (individualPlanTypeList.value.length === 1) {
            individualPlanType.value = individualPlanTypeList.value[0].SFId
            typeName.value = individualPlanTypeList.value[0].PlanType
            disablePlanType.value = false
          }
        } else individualPlanTypeList.value = []
      })
    }
    const getRecordTypeId = () => {
      $axios.get(`/api/v1/sfdc/opportunity/opportunityrecordtypes`).then((success) => {
        if (success.data != null) {
          recordTypeDetails.value = success.data
        }
      })
    }
    const saveIndividualsDetails = () => {
      loading.value = true
      var OpportunityRecordsType = 'Application and agreement'
      var PlanTypeName = ''
      var planNameData
      if (individualPlanTypeList.value.length > 1) {
        planNameData = individualPlanTypeList.value.filter((a) => a.SFId === individualPlanType.value)
      }
      planId.value = planValue.value ? planValue.value : ''
      PlanTypeName = individualPlanTypeList.value.length > 1 ? planNameData[0].PlanType : individualPlanTypeList.value[0].PlanType
      if (PlanTypeName === '403(b)(7) Individual ( k-12) Plan') {
        OpportunityRecordsType = '403(b)(7) Participant Enrollment - Multi Vendor'
      }
      if (PlanTypeName === '457(b) Individual Governmental Plan') {
        OpportunityRecordsType = '457(b) Participant Enrollment - Multi Vendor'
      }
      var typeData = recordTypeDetails.value.filter((a) => a.OpportunityRecordsType === OpportunityRecordsType)
      var saveIndividualData = {
        FirstName: firstName.value,
        LastName: lastName.value,
        HomePhone: typeForPhone.value === 'Home' ? phone.value : '',
        MobilePhone: typeForPhone.value === 'Mobile' ? phone.value : '',
        EmailAddress: email.value,
        RecordTypeId: typeData[0].RecordTypeId,
        OpportunityRecordType: typeData[0].OpportunityRecordsType,
        AccountId: searchTextSchoolDistrict.value ? schoolDistrictAccountId.value : '',
        PlanType: individualPlanType.value,
        PlanTypeName: PlanTypeName,
        PlanId: planValue.value ? planValue.value : ''
      }
      $axios
        .post(`/api/v1/sfdc/individual`, saveIndividualData)
        .then((success) => {
          if (success.data.d != null) {
            opportunityId.value = success.data.d.OpportunityId
            registrationId.value = success.data.d.RegistrationId
            planTypeNameValue.value = success.data.d.PlanTypeName
            getRegistrationDetail(false)
          }
          loading.value = false
          resetData()
        })
        .catch(() => {
          loading.value = false
        })
    }
    const resetData = () => {
      firstName.value = ''
      lastName.value = ''
      email.value = ''
      phone.value = ''
      individualPlanType.value = ''
      stateValue.value = ''
      searchTextSchoolDistrict.value = ''
      payrollSlot.value = ''
      typeForPhone.value = 'Mobile'
      planValue.value = ''
    }
    const closeWithoutSaving = (type) => {
      filterCloseDialog.value = false
      presenterInfoDialog.value = false
      filterDialog.value = false
      showLastCancelDialog.value = false
      router
        .push({
          name: 'TALProspectPlans',
          params: { Type: type }
        })
        .catch(() => {})
    }
    const getSimpleIRAPlanList = () => {
      $axios.get(`/api/v1/rbc/individuals/simpleiraplans`).then((success) => {
        simpleIRAPlanList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
        if (props.fromPage !== 'School') {
          if (simpleIRAPlanList.value.length === 0) {
            showSimpleIRANote.value = true
          }
          checkValue()
        }
      })
    }
    const get457bGovernmentPlanList = () => {
      $axios.get(`/api/v1/rbc/individuals/457bplans`).then((success) => {
        governmentPlanList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
      })
    }
    const getStateList = () => {
      $axios.get(`/api/v1/tal/openaccount/payrollstates`).then((success) => {
        stateList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
      })
    }
    return {
      theme,
      display,
      $authz,
      filterDialog,
      dialogWidth,
      dialogHeight,
      selectedpage,
      openAccountDialog,
      firstName,
      lastName,
      email,
      emailRegex,
      phone,
      phoneError,
      phoneErrorMsg,
      typeForPhone,
      individualPlanType,
      individualPlanTypeList,
      displayPlansDropdown,
      showSimpleIRANote,
      showDisclaimer,
      planValue,
      planList,
      stateValue,
      stateList,
      searchTextSchoolDistrict,
      loadSchoolDistrict,
      hideCardSchoolDistrict,
      filterSchoolDistricts,
      disablePlanType,
      schoolDistrictValue,
      payrollSlot,
      firstName1,
      lastName1,
      rfpValue,
      searchText,
      hideCard,
      filterPlans,
      showEmployerSponsored,
      showInformation,
      contactFirstName,
      contactLastName,
      estLiveDate,
      noOfEmployees,
      streetAddress,
      zipcode,
      city,
      state,
      EINNo,
      contactEmail,
      groupPlanType,
      groupPlanTypeList,
      contactInfoDialog,
      duplicateEmailIDList,
      presenterInfoDialog,
      componentOpenAccountKey,
      planTypeNameValue,
      schoolDistrictAccountId,
      filterCloseDialog,
      showLastCancelDialog,
      valid,
      items,
      validAdd,
      screenClass,
      prospectClass,
      evaluateClass,
      proposeClass,
      finalizeClass,
      showSchool,
      showIndividuals,
      completedClass,
      wildCardSearchSchoolDistrict,
      wildCardSearch,
      from,
      opportunityItem,
      openTeacherAccount,
      goBackToPreviousPage,
      closeWindow,
      checkPhoneNumber,
      goToPlanSelectionPage,
      checkValue,
      checkSimpleIRA,
      createCorporate,
      clearSchoolDistrict,
      checkFields,
      getSchoolDistrictValue,
      saveDetails,
      createProposal,
      GoToProspectDetailsPage,
      searchBlur,
      clearSponsorSearch,
      checkCurrentLocation,
      showHideDetails,
      goToGroupPlanSelectedPage,
      chkNewSelectedpage,
      planSelectionPage,
      openDuplicatesEditDialog,
      openCloseDialog,
      openEditDialog,
      createParticipant,
      saveAndClose,
      closeDialogWindow,
      closeWithoutSaving,
      editOpenAccount,
      closeEditDialog
    }
  }
}
</script>
<style scoped>
.start_polygon {
  clip-path: polygon(0% 0%, 80% 0%, 85% 50%, 80% 100%, 0% 100%);
}
.middle_polygon {
  clip-path: polygon(80% 0%, 85% 50%, 80% 100%, 0% 100%, 5% 50%, 0% 0%);
}
.end_polygon {
  clip-path: polygon(0% 0%, 5% 50%, 0% 100%, 100% 100%, 100% 0%);
}
.prospectingBackground {
  /* background-color: rgb(var(--v-theme-accent-lighten4)) !important; */
  background-color: #a1e2ff !important;
}
.evaluatingBackground {
  /* background-color: rgb(var(--v-accent-lighten3)) !important; */
  background-color: #82c6ff !important;
}
.proposingBackground {
  background-color: #62abff !important;
}
.finalizingBackground {
  background-color: #3f90e8 !important;
}
.completedBackground {
  background-color: #0077cc !important;
}
.nonSelectedBackground {
  background-color: #dddddd !important;
}
.steppercss {
  font-weight: bold;
  font-size: 12px;
  margin-right: 0;
  align-self: center;
  box-sizing: border-box;
  font-family: 'Roboto';
  color: #ffffff;
  text-align: left;
  line-height: normal;
}
.disabledColor {
  color: rgba(0, 0, 0, 0.54);
}
.flex_width_stepper {
  width: 32.5% !important;
  margin: 0 -20px 0 -18px;
}
.stepperCompleted {
  width: 25% !important;
  margin: 0 -20px 0 -18px;
}
.flexWidthBigScreen {
  width: 22.3% !important;
  margin: 0 -18px 0 -18px;
}
.stepperCompletedBigScreen {
  width: 19.2% !important;
  margin: 0 -18px 0 -18px;
}
.flexWidthHidpi {
  width: 22.8% !important;
  margin: 0 -18px 0 -18px;
}
.stepperCompletedHidpi {
  width: 20% !important;
  margin: 0 -18px 0 -18px;
}
.flexWidthMdpi {
  width: 22.4% !important;
  margin: 0 -15px 0 -15px;
}
.stepperCompletedMdpi {
  width: 19% !important;
  margin: 0 -15px 0 -15px;
}
.flexWidthIpadPro {
  width: 22.4% !important;
  margin: 0 -25px 0 -25px;
}
.stepperCompletedIpadPro {
  width: 19% !important;
  margin: 0 -25px 0 -25px;
}
.radioButtonPosition {
  padding-left: 200px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
