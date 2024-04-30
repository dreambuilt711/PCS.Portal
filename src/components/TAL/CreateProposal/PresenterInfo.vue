<template>
  <v-dialog v-model="presenterInfoDialog" persistent class="elevation-3" scrollable :eager="true" :max-width="dialogWidth">
    <v-card :height="dialogHeight">
      <v-card-title>
        <v-col cols="12" xs="12" class="pb-3 pt-1">
          <v-row no-gutters>
            <v-col class="text-left align-self">
              <v-icon
                v-if="presenterInfoFlow !== 0 || (presenterFlag !== 0 && presenterFlag !== 1)"
                color="accent"
                @click="goBackToPreviousPage(presenterInfoFlow)"
              >
                mdi-arrow-left
              </v-icon>
            </v-col>
            <v-col cols="10" xs="10">
              <v-row no-gutters class="justify-center">
                <v-col cols="10" lg="10">
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
                        class="cursor-pointer middle_polygon evaluatingBackground"
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
                        class="cursor-pointer middle_polygon proposingBackground"
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
            <v-col cols="1" xs="1" class="text-right align-self">
              <v-icon color="accent" @click="closePresenterDialog()"> mdi-close </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-card-title>
      <v-divider />
      <v-progress-linear :model-value="progressValue" height="8" />
      <v-card-text class="justify-center align-center d-flex" :class="display.xs.value ? 'pa-3' : 'pa-0'">
        <div class="v-container" :class="display.xs.value ? 'pa-0' : 'pa-2'">
          <v-row no-gutters class="justify-center">
            <v-col v-if="presenterInfoFlow === 0" cols="12" xs="12" class="pt-5">
              <AdvisoryProductSelection
                :client-product-data="clientProductData"
                :show-client-product-loader="showClientProductLoader"
                @continue-details="continueDetails"
              />
            </v-col>
            <v-col v-if="presenterInfoFlow === 1" cols="12" xs="12">
              <v-col v-if="presenterFlag === 0">
                <v-col v-if="!showPermissionGrantPage" class="text-center">
                  <h1>Advisor Information</h1>
                </v-col>
                <v-col v-if="!showPermissionGrantPage" class="text-center text-h5 pt-3 pb-5">
                  <h5>Review confirm the advisor’s information for this proposal.</h5>
                </v-col>
                <v-col v-if="showPermissionGrantPage" class="text-center">
                  <h1>Edit Advisor</h1>
                </v-col>
                <v-col v-if="showPermissionGrantPage" class="text-center text-h5 pt-5 pb-8">
                  <h5>Confirm additional details about the advisor before adding to the proposal.</h5>
                </v-col>
                <div v-if="loader">
                  <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                    <Loader :loading-text="`Loading..`" :loading="loader" />
                  </v-card>
                </div>
                <v-col v-if="!loader && !showPermissionGrantPage">
                  <v-row no-gutters class="justify-center">
                    <v-col cols="11" xs="11" lg="7" md="8" sm="11" class="text-center">
                      <v-card class="elevation-6">
                        <v-col :class="[display.xs.value ? 'pt-2' : 'px-12 pt-9 pb-8']">
                          <v-row>
                            <v-col cols="5" lg="5" md="5" sm="5" class="align-self-center">
                              <img :src="contentURL" width="80%" :height="display.xs.value ? '80%' : '40%'" />
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="6" xs="12" class="pl-4">
                              <v-col :class="display.xs.value ? 'text-center pt-2' : 'text-left'">
                                <h2 class="font-weight-medium">
                                  {{
                                    contactDetails
                                      ? contactDetails.FirstName + ' ' + contactDetails.LastName
                                      : advisorInformationData[0].Name
                                  }}
                                </h2>
                              </v-col>
                              <v-col class="text-capitalize py-2" :class="display.xs.value ? 'text-center' : 'text-left'">
                                <h3 class="font-weight-bold">
                                  {{ contactDetails ? contactDetails.AccountName : advisorInformationData[0].FirmName }}
                                </h3>
                              </v-col>
                              <v-col :class="display.xs.value ? 'text-center' : 'text-left'">
                                <h3>
                                  {{
                                    contactDetails
                                      ? contactDetails.MailingStreet +
                                        ' ' +
                                        contactDetails.MailingCity +
                                        ', ' +
                                        contactDetails.MailingState +
                                        ' ' +
                                        contactDetails.MailingPostalCode
                                      : advisorInformationData[0].Address1 +
                                        advisorInformationData[0].Address2 +
                                        advisorInformationData[0].City +
                                        advisorInformationData[0].State +
                                        advisorInformationData[0].Zip
                                  }}
                                </h3>
                              </v-col>
                              <v-col :class="display.xs.value ? 'text-center' : 'text-left'" class="pt-2">
                                <h3>
                                  {{ contactDetails ? contactDetails.Phone : advisorInformationData[0].Phone }}
                                </h3>
                              </v-col>
                              <v-col v-if="false" :class="display.xs.value ? 'text-center' : 'text-left'" class="py-2">
                                <h3>
                                  {{
                                    grantAuthority
                                      ? '(Has limited trading authority)'
                                      : '(Does not have limited trading authority)'
                                  }}
                                </h3>
                              </v-col>
                              <v-col v-if="repCode" :class="display.xs.value ? 'text-center' : 'text-left'" class="py-3">
                                <h3 class="font-weight-medium">
                                  {{ showBrokerDealer ? 'Broker Dealer' : 'Broker Dealer Rep Code' }}
                                </h3>
                                <v-col cols="11" xs="11">
                                  <h3 v-if="showBrokerDealer">
                                    {{ `${brokerDealerName} (${repCode})` }}
                                  </h3>
                                  <h3 v-else>
                                    {{ repCode }}
                                  </h3>
                                </v-col>
                              </v-col>
                              <v-col
                                v-if="feeType != 'Commission Based'"
                                :class="display.xs.value ? 'text-center' : 'text-left'"
                                class="py-2"
                              >
                                <h3 class="font-weight-medium">Professional/ Advisory Fees</h3>
                                <v-col cols="9" lg="9" xl="8" md="9" sm="9" xs="11">
                                  <v-text-field
                                    v-model="advisoryFee"
                                    :disabled="readOnly"
                                    v-input-mask="{
                                      alias: 'numeric',
                                      digits: '2',
                                      digitsOptional: true,
                                      rightAlign: false,
                                      placeholder: '',
                                      allowMinus: false,
                                      max: '100'
                                    }"
                                    variant="outlined"
                                    density="compact"
                                    Single-line
                                    maxlength="10"
                                    :error="error"
                                    hide-details
                                    suffix="%"
                                    class="advisorFeeClass"
                                    @focus="$event.target.select()"
                                    @update:model-value="checkAdvisoryFee()"
                                  />
                                </v-col>
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-divider v-if="!showPermissionGrantPage && false" class="divider" />
                        <v-col v-if="!showPermissionGrantPage && false" cols="12" lg="12">
                          <v-row>
                            <v-col class="pt-4 pb-4">
                              <a
                                class="font_14"
                                :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                                @click="editContactDetails()"
                                ><b>Edit Advisor Info</b></a
                              >
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-card>
                    </v-col>
                    <v-col v-if="showBrokerDealer" cols="11" xs="11" lg="7" md="8" sm="11" class="text-center py-2">
                      <v-btn
                        variant="text"
                        class="font-weight-regular"
                        :color="theme.dark ? '' : 'hyperlink'"
                        size="x-small"
                        @click="openBrokerScreen = true"
                      >
                        {{ `${repCode ? 'Edit' : 'Add'} Broker Dealer Rep Code` }}
                      </v-btn>
                    </v-col>
                    <v-col cols="11" xs="11" lg="8" md="8" sm="11" class="text-left font_12 py-2">
                      <h3>
                        <b>Note:</b> This data is pulled from SEC and FINRA databases and stored in our system; you can edit this
                        information and it will update your contact record. Please, be aware that contact information is updated
                        in our system weekly from SEC and FINRA databases. To make your changes permanent, please submit your
                        updates to the SEC/FINRA.
                      </h3>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="openBrokerScreen">
                  <AddBrokerDealer v-model="openBrokerScreen" @close-broker-dialog="closeBrokerDialog" />
                </v-col>
                <v-col v-if="showPermissionGrantPage">
                  <v-row no-gutters class="justify-center">
                    <v-col cols="12" xs="12" lg="6" class="text-center">
                      <v-card :class="[display.xs.value ? 'elevation-6' : 'elevation-6']">
                        <v-col :class="[display.xs.value ? '' : 'px-12 py-15']">
                          <v-row>
                            <v-col cols="6" lg="6" class="pt-8">
                              <img :src="contentURL" width="80%" :height="display.xs.value ? '80%' : '40%'" />
                            </v-col>
                            <v-col cols="6" lg="6" class="pl-4">
                              <v-col cols="12" xs="12" :class="display.xs.value ? 'text-center pt-2' : 'text-left'">
                                <h2>
                                  {{ name ? name : advisorInformationData[0].Name }}
                                </h2>
                              </v-col>
                              <v-col
                                cols="12"
                                xs="12"
                                class="text-capitalize py-2"
                                :class="display.xs.value ? 'text-center' : 'text-left'"
                              >
                                <h3>
                                  <b>{{ firm ? firm : advisorInformationData[0].FirmName }}</b>
                                </h3>
                              </v-col>
                              <v-col :class="display.xs.value ? 'text-center' : 'text-left'">
                                <h3>
                                  {{
                                    address1
                                      ? address1 + ' ' + [address2 ? address2 : ''] + ' ' + city + ', ' + state + ' ' + zipcode
                                      : advisorInformationData[0].Address
                                  }}
                                </h3>
                              </v-col>
                              <v-col cols="12" xs="12" :class="display.xs.value ? 'text-center' : 'text-left'" class="py-2">
                                <h3>
                                  {{ phone ? phone : advisorInformationData[0].Phone }}
                                </h3>
                              </v-col>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row class="justify-center" no-gutters>
                    <v-col class="text-center text-h5 pt-5" cols="12" xs="12">
                      <h5>Grant Limited Trading Authority to the Advisor?</h5>
                    </v-col>
                    <v-col class="text-center" cols="12" xs="12">
                      <v-row class="justify-center">
                        <v-radio-group v-model="grantAuthority" inline>
                          <v-radio color="accent" label="No" value="No" />
                          <v-radio color="accent" label="Yes" value="Yes" />
                        </v-radio-group>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-col>
                    <v-row no-gutters>
                      <v-col class="flex_none">
                        <v-btn
                          class="text-capitalize"
                          :color="theme.dark ? '' : 'accent'"
                          :disabled="grantAuthority === ''"
                          @click="saveAndAddAdvisor()"
                        >
                          Save Changes
                        </v-btn>
                      </v-col>
                      <v-col class="align-self ml-3">
                        <a class="font_16" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="cancel()"
                          ><b>Cancel</b></a
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
                <v-col v-if="!showPermissionGrantPage">
                  <v-col v-if="false" class="text-center pt-6">
                    <a class="font_16" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="addAdvisor()"
                      ><b>Add Advisor</b></a
                    >
                  </v-col>
                  <v-col class="text-center pt-4" large>
                    <v-btn
                      class="text-capitalize"
                      :color="theme.dark ? '' : 'accent'"
                      :disabled="disableNextButton"
                      @click="goToNextPage()"
                    >
                      Next
                    </v-btn>
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="presenterFlag === 1">
                <EditAdvisor
                  v-model="editFlag"
                  :title-name="titleName"
                  :display-message="displayMessage"
                  :add-new-advisor="addNewAdvisor"
                  :contact-id="contactId"
                  :contact-details="contactDetails"
                  :grant-authority="grantAuthority"
                  @go-back="goBack"
                  @save-and-add-advisor="saveAndAddAdvisor"
                  @get-grant-authority="getGrantAuthority"
                />
              </v-col>
              <v-col v-if="presenterFlag === 2">
                <v-col v-if="!showPermissionGrantPage" class="text-center pt-8">
                  <h1>Advisor Information</h1>
                </v-col>
                <v-col v-if="!showPermissionGrantPage" class="text-center text-h5 pt-3 pb-5">
                  <h5>Review confirm the advisor’s information for this proposal.</h5>
                </v-col>
                <div v-if="loader" class="container pa-0">
                  <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                    <Loader :loading-text="`Loading..`" :loading="loader" />
                  </v-card>
                </div>
                <v-container v-if="!loader" :fluid="true">
                  <v-row no-gutters class="justify-center">
                    <v-col
                      v-for="(item, index) in advisorInformationData"
                      :key="index"
                      cols="12"
                      xs="12"
                      sm="6"
                      md="4"
                      xl="3"
                      lg="4"
                      class="text-center pt-4"
                      :class="[
                        display.sm.value ? ((index + 1) % 2 === 0 ? '' : 'pr-3') : '',
                        display.md.value || display.lg.value ? ((index + 1) % 3 === 0 ? '' : 'pr-3') : '',
                        display.xl.value ? ((index + 1) % 4 === 0 ? '' : 'pr-4') : ''
                      ]"
                    >
                      <v-card class="elevation-6" height="100%">
                        <v-col :class="[display.xs.value ? '' : 'px-2 pt-8 pb-8']">
                          <v-row>
                            <v-col cols="11" xs="11" lg="11" class="pt-4 pb-10">
                              <img :src="item.WebLogo" width="80%" :height="display.xs.value ? '80%' : '80%'" />
                            </v-col>
                            <v-col v-if="index !== 0" cols="1" lg="1" xs="1" class="deleteIconPosition">
                              <v-btn
                                icon
                                variant="text"
                                :color="!theme.dark ? 'error' : ''"
                                @click.stop="deletePopUpPresenter[item.AdvisorId] = true"
                              >
                                <v-icon size="small"> fas fa-trash </v-icon>
                              </v-btn>
                              <v-dialog
                                :key="item.AdvisorId"
                                v-model="deletePopUpPresenter[item.AdvisorId]"
                                :scrollable="false"
                                max-width="350"
                                content-class="elevation-3"
                              >
                                <ActionPopUp
                                  confirm-action-text="Delete"
                                  cancel-action-text="Cancel"
                                  action-text="Delete Presenter"
                                  :action-message="`Are you sure you want to delete <b>${item.Name}</b>  presenter ?`"
                                  @confirm-action="deletePresenter(item)"
                                  @cancel-action="deletePopUpPresenter[item.AdvisorId] = false"
                                />
                              </v-dialog>
                            </v-col>
                          </v-row>
                          <v-col class="text-center">
                            <v-col :class="display.xs.value ? 'text-center pt-2' : 'text-center'">
                              <h2>{{ item.Name }}</h2>
                            </v-col>
                            <v-col class="text-capitalize py-2" :class="display.xs.value ? 'text-center' : 'text-center'">
                              <h3>
                                <b>{{ item.FirmName }}</b>
                              </h3>
                            </v-col>
                            <v-col :class="display.xs.value ? 'text-center' : 'text-center'">
                              <h3>
                                {{ item.Address1 + ' ' + item.Address2 + ' ' + item.State + ' ' + item.Zip }}
                              </h3>
                            </v-col>
                            <v-col :class="display.xs.value ? 'text-center' : 'text-center'" class="py-2">
                              <h3>{{ item.Phone }}</h3>
                            </v-col>
                          </v-col>
                        </v-col>
                        <v-col v-if="!showPermissionGrantPage" class="mt-5">
                          <v-divider class="divider" />
                          <v-col cols="12" lg="12">
                            <v-row>
                              <v-col v-if="index !== 0" class="pt-4 pb-4">
                                <a
                                  class="font_14"
                                  :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                                  @click="replaceAdvisor(item)"
                                  ><b>Replace Advisor</b></a
                                >
                              </v-col>
                              <v-divider v-if="index !== 0" inset vertical class="d-none d-block hr_border" />
                              <v-col class="pt-4 pb-4">
                                <a
                                  class="font_14"
                                  :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                                  @click="editDetails(item.AdvisorId)"
                                  ><b>Edit Advisor Info</b></a
                                >
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
                <v-col v-if="!showPermissionGrantPage">
                  <v-col v-if="false" class="text-center pt-6">
                    <a class="font_16" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="addAdvisor()"
                      ><b>Add Advisor</b></a
                    >
                  </v-col>
                  <v-col class="text-center pt-4" large>
                    <v-btn class="text-capitalize" :color="theme.dark ? '' : 'accent'" @click="goToNextPage()"> Next </v-btn>
                  </v-col>
                </v-col>
              </v-col>
            </v-col>
            <v-col v-if="presenterInfoFlow === 2" cols="12" xs="12">
              <AddInvestments @go-to-next-window="goToSelectedInvestmentsInformation" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 3" cols="12" xs="12">
              <SelectedInvestments :load-waived="loadWaived" @go-to-next-window="goToInvestmentInformation" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 4" cols="12" xs="12" class="py-8">
              <SplitFeeAdvisor
                :split-fee-schedule="splitFeeSchedule"
                :advisor-information-data="advisorInformationData"
                :opportunity-id="opportunityId"
                @go-to-product-selection-page="goToProductSelectionPage"
              />
            </v-col>
            <v-col v-if="presenterInfoFlow === 5" cols="12" xs="12" class="py-1">
              <LimitedTradingAuthority
                :opportunity-id="opportunityId"
                @go-to-next-window="goToAccountSetUP"
                @get-grant-authority="getGrantAuthority"
              />
            </v-col>
            <v-col v-if="presenterInfoFlow === 6" cols="12" xs="12" class="py-10">
              <AccountSetUp @save-and-close-all-windows="closePresenterDialog" @complete-details="goToContactDetails" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 7" cols="12" xs="12" class="pt-4">
              <ContactInformation @go-to-next-window="goToPersonalInformation" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 8" cols="12" xs="12" class="pt-4">
              <PersonalInformation @go-to-next-window="goToEmployerInformation" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 9" cols="12" xs="12" class="pt-4">
              <EmployerInformation @go-to-next-window="goToBeneficiariesInformation" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 10" cols="12" xs="12">
              <Beneficiaries :registration-id="registrationId" @go-to-next-window="goToTransferBalancePage" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 11" cols="12" xs="12">
              <TransferBalances :opportunity-id="opportunityId" @go-to-next-window="goToCompletePage" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 12" cols="12" xs="12">
              <CompletedAccountSetUp @save-and-close-all-windows="closePresenterDialog" />
            </v-col>
            <v-col v-if="presenterInfoFlow === 13" cols="12" xs="12" class="py-8">
              <EditFeeSchedule @show-account-set-up-flag="showAccountSetUpFlag" />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import AdvisoryProductSelection from '@/components/TAL/CreateProposal/AdvisoryProductSelection'
import AccountSetUp from '@/components/TAL/CreateProposal/AccountSetUp'
import EditFeeSchedule from '@/components/TAL/CreateProposal/EditFeeSchedule'
import ContactInformation from '@/components/TAL/CreateProposal/ContactInformation'
import PersonalInformation from '@/components/TAL/CreateProposal/PersonalInformation'
import EmployerInformation from '@/components/TAL/CreateProposal/EmployerInformation'
import AddInvestments from '@/components/TAL/CreateProposal/AddInvestments'
import Beneficiaries from '@/components/TAL/CreateProposal/Beneficiaries'
import TransferBalances from '@/components/TAL/CreateProposal/TransferBalances'
import CompletedAccountSetUp from '@/components/TAL/CreateProposal/CompletedAccountSetUp'
import SelectedInvestments from '@/components/TAL/CreateProposal/SelectedInvestments'
import SplitFeeAdvisor from '@/components/TAL/CreateProposal/SplitFeeAdvisor'
import EditAdvisor from '@/components/TAL/CreateProposal/EditAdvisor'
import ActionPopUp from '@/components/ActionPopUp'
import Loader from '@/components/NewLoader'
import planfinderlist from '@/assets/planfinder.json'
import AddBrokerDealer from '@/components/TAL/CreateProposal/AddBrokerDealer'
import LimitedTradingAuthority from '@/components/TAL/CreateProposal/LimitedTradingAuthority'
export default {
  components: {
    AdvisoryProductSelection,
    AccountSetUp,
    EditFeeSchedule,
    ContactInformation,
    PersonalInformation,
    EmployerInformation,
    AddInvestments,
    Beneficiaries,
    TransferBalances,
    CompletedAccountSetUp,
    ActionPopUp,
    SplitFeeAdvisor,
    EditAdvisor,
    SelectedInvestments,
    Loader,
    AddBrokerDealer,
    LimitedTradingAuthority
  },
  props: ['value', 'opportunityId', 'registrationId', 'planTypeNameValue', 'schoolDistrictId'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const $toast = instance.appContext.config.globalProperties.$toast
    const $authz = instance.appContext.config.globalProperties.$authz
    const openBrokerScreen = ref(false)
    const brokerDealerName = ref('')
    const repCode = ref('')
    const presenterInfoFlow = ref(0)
    const contentURL = ref($store.state.user.selectedProgram.brand.web_Logo__c)
    const progressValue = ref(10)
    const editFlag = ref(false)
    const crdNo = ref('')
    const error = ref(false)
    const CrdMessage = ref('')
    const presenterFlag = ref(0)
    const replaceAdvisorFlag = ref(false)
    const showPermissionGrantPage = ref(false)
    const grantAuthority = ref('')
    const titleName = ref('')
    const displayMessage = ref('')
    const editMode = ref(false)
    const presenterList = ref([])
    const presenterDetails = ref([])
    const showMultiplePresenter = ref(false)
    const addNewAdvisor = ref(0)
    const advisorInformationData = ref([])
    const deletePopUpPresenter = ref({})
    const splitFeeSchedule = ref(false)
    const loader = ref(false)
    const clientProductId = ref('')
    const splitAdvisorsDetails = ref([])
    const onlyOnePresenter = ref(false)
    const contactDetails = ref([])
    const contactId = ref('')
    const dialogDelete = ref(false)
    const editLoggedInContact = ref(false)
    const addAdvisorFlag = ref(false)
    const replaceAdvisorData = ref('')
    const stateList = ref(planfinderlist.states)
    const zipcode = ref('')
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    const city = ref('')
    const state = ref('')
    const address1 = ref('')
    const address2 = ref('')
    const phone = ref('')
    const email = ref('')
    const name = ref('')
    const firm = ref('')
    const firmCRD = ref('')
    const recordTypeId = ref('')
    const presenter = ref('')
    const phoneError = ref(false)
    const phoneErrorMsg = ref('')
    const valid = ref(true)
    const emailRegex = ref(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    )
    const readOnly = ref(false)
    const advisoryFee = ref('')
    const disableNextButton = ref(true)
    const feeDetails = ref([])
    const strategistFee = ref('')
    const feeType = ref('')
    const clientProductData = ref([])
    const showClientProductLoader = ref(false)
    const paymentType = ref('')
    const showBrokerDealer = ref(false)
    const loadWaived = ref('')
    const crd = ref(null)
    function getExternalCode() {
      $axios.get(`/api/v1/tal/openaccount/relationship`).then((success) => {
        if (success.data.d && success.data.d.length > 0) {
          repCode.value = success.data.d[0].External_Id__c ? success.data.d[0].External_Id__c : ''
          showBrokerDealer.value = success.data.d[0].External_Id__c ? false : true
        } else showBrokerDealer.value = true
        if (showBrokerDealer.value) getBrokerDealers()
      })
    }
    function getBrokerDealers() {
      $axios.get(`/api/v1/tal/plan/brokerdealers`).then((success) => {
        $store.state.openAccountDetail.brokerDealerList = success.data.d && success.data.d.length > 0 ? success.data.d : []
        $store.state.openAccountDetail.brokerDealerList.unshift({
          DealerName: 'Enter Manually',
          Id: '0'
        })
        if ($store.state.openAccountDetail.BrokerDealerId) {
          let dealerSelected = $store.state.openAccountDetail.brokerDealerList.filter(
            (a) => a.Id === $store.state.openAccountDetail.BrokerDealerId
          )
          brokerDealerName.value = dealerSelected && dealerSelected.length > 0 ? dealerSelected[0].DealerName : ''
          $store.state.openAccountDetail.BrokerDealerName = brokerDealerName.value
        }
      })
    }
    function closeBrokerDialog() {
      openBrokerScreen.value = false
      repCode.value = $store.state.openAccountDetail.RepCode ? $store.state.openAccountDetail.RepCode : ''
      brokerDealerName.value = $store.state.openAccountDetail.BrokerDealerId
        ? $store.state.openAccountDetail.BrokerDealerName
        : $store.state.openAccountDetail.BrokerDealerManual
    }
    function goBackToPreviousPage(val) {
      switch (val) {
        case 0:
          presenterInfoFlow.value = 0
          progressValue.value = 10
          break
        case 1:
          presenterInfoFlow.value = 0
          progressValue.value = 10
          break
        case 2:
          presenterInfoFlow.value = 1
          progressValue.value = 20
          break
        case 3:
          presenterInfoFlow.value = 2
          progressValue.value = 30
          break
        case 4:
          presenterInfoFlow.value = 3
          progressValue.value = 40
          break
        case 5:
          presenterInfoFlow.value = 3
          progressValue.value = 40
          break
        case 6:
          presenterInfoFlow.value = showBasedOnAdvisorRole.value ? 5 : 3
          progressValue.value = showBasedOnAdvisorRole.value ? 45 : 40
          break
        case 7:
          presenterInfoFlow.value = 6
          progressValue.value = 55
          break
        case 8:
          presenterInfoFlow.value = 7
          progressValue.value = 60
          break
        case 9:
          presenterInfoFlow.value = 8
          progressValue.value = 70
          break
        case 10:
          presenterInfoFlow.value = 9
          progressValue.value = 80
          break
        case 11:
          presenterInfoFlow.value = 10
          progressValue.value = 90
          break
        case 12:
          // presenterInfoFlow.value = 11
          // progressValue.value = 95
          presenterInfoFlow.value = 10
          progressValue.value = 90
          break
        default:
          presenterInfoFlow.value = 0
          progressValue.value = 10
          break
      }
    }
    function goBack() {
      presenterFlag.value = 0
      if (advisorInformationData.value.length > 1) {
        presenterFlag.value = 2
      }
      editFlag.value = false
      replaceAdvisorFlag.value = false
      addAdvisorFlag.value = false
      resetForm()
    }
    function addAdvisor() {
      presenterFlag.value = 1
      replaceAdvisorFlag.value = false
      addAdvisorFlag.value = true
      editLoggedInContact.value = false
      titleName.value = 'Add Advisor'
      displayMessage.value = "Enter the presenting advisor's CRD# to include their information on report."
      addNewAdvisor.value = 1
      resetForm()
    }
    function replaceAdvisor(val) {
      presenterFlag.value = 1
      replaceAdvisorFlag.value = true
      editLoggedInContact.value = false
      addAdvisorFlag.value = false
      titleName.value = 'Add Advisor'
      displayMessage.value = "Enter the presenting advisor's CRD# to include their information on report."
      resetForm()
      replaceAdvisorData.value = val
    }
    function closePresenterDialog() {
      presenterInfoDialog.value = false
      var lastClosingStage = ''
      var stepValue = ''
      switch (presenterInfoFlow.value) {
        case 0:
          stepValue = 0
          lastClosingStage = 'AdvisoryProduct'
          break
        case 1:
          stepValue = 1
          lastClosingStage = 'Presenter'
          break
        case 2:
          stepValue = 2
          lastClosingStage = 'AddModelFund'
          break
        case 3:
          stepValue = 3
          lastClosingStage = 'SelectedInvestment'
          break
        case 4:
          stepValue = 4
          lastClosingStage = 'SplitFee'
          break
        case 5:
          stepValue = 5
          lastClosingStage = 'EditFee'
          break
        case 6:
          stepValue = 6
          lastClosingStage = 'AccountSetUp'
          break
        case 7:
          stepValue = 7
          lastClosingStage = 'Contact'
          break
        case 8:
          stepValue = 8
          lastClosingStage = 'Personal'
          break
        case 9:
          stepValue = 9
          lastClosingStage = 'Employer'
          break
        case 10:
          stepValue = 10
          lastClosingStage = 'Beneficiaries'
          break
        case 11:
          stepValue = 11
          lastClosingStage = 'TransferBalances'
          break
        case 12:
          stepValue = 12
          lastClosingStage = 'CompletedAccount'
          break
        default:
          lastClosingStage = ''
          break
      }
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        if ($store.state.openAccountDetail.LastClosingState) {
          if (lastClosingStage !== $store.state.openAccountDetail.LastClosingState) {
            var oldStepValue = $store.state.openAccountDetail.LastClosingStateStep
              ? $store.state.openAccountDetail.LastClosingStateStep
              : 0
            if (stepValue >= oldStepValue) {
              $store.state.openAccountDetail.LastClosingState = lastClosingStage
            }
          } else $store.state.openAccountDetail.LastClosingState = lastClosingStage
        } else $store.state.openAccountDetail.LastClosingState = lastClosingStage
      }
      emit('openSaveClose', presenterInfoFlow.value)
    }
    function editDetails(val) {
      presenterFlag.value = 1
      editFlag.value = true
      titleName.value = 'Edit Advisor'
      displayMessage.value = "Edit the presenting advisor's information before including on report."
      if (val === contactDetails.value.contactId) {
        editLoggedInContact.value = true
        editAdvisorContactInfo()
      } else {
        editLoggedInContact.value = false
        editPresenter(val)
      }
    }
    function editContactDetails() {
      presenterFlag.value = 1
      editFlag.value = true
      titleName.value = 'Edit Advisor'
      displayMessage.value = "Edit the presenting advisor's information before including on report."
      editLoggedInContact.value = true
      editAdvisorContactInfo()
    }
    function goToPermissionPage() {
      editFlag.value = false
      replaceAdvisorFlag.value = false
      addAdvisorFlag.value = false
      presenterFlag.value = 0
      showPermissionGrantPage.value = true
    }
    function saveAndAddAdvisor(val) {
      editFlag.value = false
      showPermissionGrantPage.value = false
      addAdvisorFlag.value = false
      if (editLoggedInContact.value) {
        saveLoggedInUserDetails(val)
      } else {
        SavePresenter()
      }
      saveTradingAuthority()
      if (addNewAdvisor.value === 1) {
        presenterFlag.value = 2
      }
      presenterFlag.value = 0
    }
    function getGrantAuthority(val) {
      grantAuthority.value = val
    }
    function cancel() {
      editFlag.value = true
      replaceAdvisorFlag.value = false
      addAdvisorFlag.value = false
      showPermissionGrantPage.value = false
      presenterFlag.value = 1
    }
    function getPresenter() {
      if (crdNo.value) {
        loader.value = true
        $axios.get(`/api/v1/tal/diagnostic/Presenter/${crdNo.value}`).then((success) => {
          var presenterData = success.data.d
          if (presenterData != null) {
            name.value = presenterData.Name
            firm.value = presenterData.Firm ? presenterData.Firm : ''
            firmCRD.value = presenterData.FirmCRD ? presenterData.FirmCRD : 0
            recordTypeId.value = presenterData.RecordTypeId ? presenterData.RecordTypeId : ''
            address1.value = presenterData.Address1 ? presenterData.Address1 : ''
            address2.value = presenterData.Address2 ? presenterData.Address2 : ''
            city.value = presenterData.City ? presenterData.City : ''
            state.value = presenterData.State ? presenterData.State : ''
            zipcode.value = presenterData.Zip ? presenterData.Zip : ''
            phone.value = presenterData.Phone ? presenterData.Phone : ''
            email.value = presenterData.Email ? presenterData.Email : ''
            editFlag.value = true
            replaceAdvisorFlag.value = false
            addAdvisorFlag.value = false
            loader.value = false
          } else {
            error.value = false
            loader.value = false
            CrdMessage.value = 'You must enter a valid CRD# to continue.'
            crdNo.value = ''
            crd.value.focus()
          }
        })
      } else {
        error.value = false
        loader.value = false
        CrdMessage.value = 'You must enter a valid CRD# to continue.'
        crdNo.value = ''
        crd.value.focus()
      }
    }
    const SavePresenter = async () => {
      if (name.value) {
        loader.value = true
        var presentedBy = ''
        presentedBy += name.value + '\n'
        if (firm.value) presentedBy += firm.value + '\n'
        if (address1.value) presentedBy += address1.value + '\n'
        if (address2.value) presentedBy += address2.value + '\n'
        if (city.value) presentedBy += city.value + ', '
        if (state.value) presentedBy += state.value + '\n'
        if (zipcode.value) presentedBy += zipcode.value + '\n'
        if (phone.value) presentedBy += phone.value + '\n'
        if (email.value) presentedBy += email.value

        if (replaceAdvisorData.value) {
          let deletePosition = advisorInformationData.value.findIndex((a) => a.AdvisorId === replaceAdvisorData.value.AdvisorId)
          if (deletePosition > -1) advisorInformationData.value.splice(deletePosition, 1)
          deletePresenter(replaceAdvisorData.value)
        }

        var savePresenterRequest = {
          Name: name.value,
          Firm: firm.value,
          FirmCRD: firmCRD.value ? firmCRD.value : 0,
          RecordTypeId: recordTypeId.value,
          Address1: address1.value,
          Address2: address2.value,
          City: city.value,
          State: state.value,
          Zip: zipcode.value,
          Phone: phone.value,
          Email: email.value,
          Description: name.value,
          PresentedBy: presentedBy,
          AboutUs: '',
          AboutInfo: '',
          CRDNumber: crdNo.value === '' ? 0 : crdNo.value,
          Id: editMode.value ? presenter.value : 0
        }
        var success = await $axios.put(`/api/v1/tal/diagnostic/presenter`, savePresenterRequest)
        if (success.data.d != null) {
          if (crdNo.value > 0) $axios.post(`/api/v1/sfdc/contact`, savePresenterRequest)
          loader.value = false
          $toast.success('Saved Successfully', '')
          if (addNewAdvisor.value === 1 && !editMode.value) {
            var newData = []
            newData.WebLogo = $store.state.user.selectedProgram.brand.web_Logo__c
            newData.AdvisorId = success.data.d.id
            newData.Name = success.data.d.name
            newData.FirmName = success.data.d.firm
            newData.Address1 = success.data.d.address1
            newData.Address2 = success.data.d.address2 + ',' + success.data.d.city
            newData.State = success.data.d.state
            newData.Zip = success.data.d.zip
            newData.Phone = success.data.d.phone
            newData.SplitRatio = 0
            advisorInformationData.value.push(newData)
          }
          presenter.value = success.data.d.id
          resetForm()
        } else {
          loader.value = false
          if (success.data.message.includes('already exists')) {
            var alreadyExistData = []
            alreadyExistData.WebLogo = $store.state.user.selectedProgram.brand.web_Logo__c
            alreadyExistData.AdvisorId = savePresenterRequest.FirmCRD
            alreadyExistData.Name = savePresenterRequest.Name
            alreadyExistData.FirmName = savePresenterRequest.Firm
            alreadyExistData.Address1 = savePresenterRequest.Address1
            alreadyExistData.Address2 = savePresenterRequest.Address2
            alreadyExistData.State = savePresenterRequest.State
            alreadyExistData.Zip = savePresenterRequest.Zip
            alreadyExistData.Phone = savePresenterRequest.Phone
            alreadyExistData.SplitRatio = 0
            advisorInformationData.value.push(alreadyExistData)
          }
        }
        return true
      }
    }
    function removeValidation() {
      error.value = false
      CrdMessage.value = ''
    }
    function deletePresenter(presenter) {
      var presenterId = []
      if (presenter) {
        presenterId.push(presenter.AdvisorId)
      }
      if (presenterId.length > 0) {
        $axios
          .delete(`/api/v1/reportoptions/presenter`, {
            data: presenterId
          })
          // eslint-disable-next-line no-unused-vars
          .then((success) => {
            if (success.data.d == null) {
              let deletePosition = advisorInformationData.value.findIndex((a) => a.AdvisorId === presenter.AdvisorId)
              if (deletePosition > -1) advisorInformationData.value.splice(deletePosition, 1)
              getPresenterFromAdvisorSplit()
              dialogDelete.value = false
            }
          })
      }
    }
    function editPresenter(val) {
      loader.value = true
      $axios
        .get(`/api/v1/tal/presenter/presentedby/${val}`)
        .then((success) => {
          if (success.data.d != null) {
            var presenterData = success.data.d
            name.value = presenterData[0].Name
            firm.value = presenterData[0].Firm
            address1.value = presenterData[0].Address1
            address2.value = presenterData[0].Address2
            city.value = presenterData[0].City
            state.value = presenterData[0].State
            zipcode.value = presenterData[0].Zip
            phone.value = presenterData[0].Phone
            email.value = presenterData[0].Email
            crdNo.value = presenterData[0].CRDNumber
            editMode.value = true
            loader.value = false
          } else {
            loader.value = false
          }
        })
        .catch(() => {
          loader.value = false
        })
    }
    function resetForm() {
      name.value = ''
      firm.value = ''
      address1.value = ''
      address2.value = ''
      city.value = ''
      state.value = ''
      zipcode.value = ''
      phone.value = ''
      email.value = ''
      crdNo.value = ''
      editMode.value = false
      replaceAdvisorData.value = ''
    }
    function saveAdvisorSplit() {
      loader.value = true
      var splitData = []
      advisorInformationData.value.forEach((element) => {
        var saveAdvisorSplitData = {
          OpportunityId: props.opportunityId,
          Name: element.FirstName + ' ' + element.LastName,
          FirmName: element.AccountName,
          Address1: element.Address1,
          Address2: element.Address2,
          State: element.State,
          City: element.City,
          Zip: element.Zip,
          Phone: element.Phone,
          Email: element.Email,
          SplitRatio: onlyOnePresenter.value ? 100 : 0,
          ContactId: contactId.value,
          IsPrimary: true
        }
        splitData.push(saveAdvisorSplitData)
      })
      $axios
        .post(`/api/v1/tal/individual/${props.opportunityId}/advisorsplit`, splitData)
        .then((success) => {
          if (success.data.d != null) {
            loader.value = false
            getPresenterFromAdvisorSplit()
          }
        })
        .catch(() => {
          loader.value = false
        })
    }
    function getPresenterFromAdvisorSplit() {
      contactId.value = $store.state.user.contactId
      $axios.get(`/api/v1/tal/individual/${props.opportunityId}/getadvisorsplit`).then((success) => {
        if (success.data.d.length > 0) {
          advisorInformationData.value = success.data.d
          var contactData = success.data.d
          var firstName = contactData[0].Name.split(' ')
          contactDetails.value.FirstName = firstName[0]
          contactDetails.value.LastName = firstName[1]
          contactDetails.value.MailingStreet = contactData[0].Address1 + ' ' + contactData[0].Address2
          contactDetails.value.MailingState = contactData[0].State
          contactDetails.value.MailingCity = contactData[0].City
          contactDetails.value.MailingPostalCode = contactData[0].Zip
          contactDetails.value.Phone = contactData[0].Phone
          contactDetails.value.Email = contactData[0].Email
          contactDetails.value.AccountName = contactData[0].FirmName
          contactDetails.value.ContactId = contactData[0].ContactId
        } else {
          getContactInfo()
        }
      })
    }
    function getContactInfo() {
      loader.value = true
      contactId.value = $store.state.user.contactId
      $axios
        .get(`/api/v1/sfdc/${contactId.value}/contact`)
        .then((success) => {
          if (success.data.d) {
            contactDetails.value = success.data.d
            loader.value = false
          } else {
            loader.value = false
          }
        })
        .catch(() => {
          loader.value = false
        })
    }
    function editAdvisorContactInfo() {
      name.value = contactDetails.value.FirstName + ' ' + contactDetails.value.LastName
      firm.value = contactDetails.value.AccountName
      address1.value = contactDetails.value.MailingStreet
      state.value = contactDetails.value.MailingState
      city.value = contactDetails.value.MailingCity
      zipcode.value = contactDetails.value.MailingPostalCode
      phone.value = contactDetails.value.Phone
      email.value = contactDetails.value.Email
    }
    const saveLoggedInUserDetails = async (val) => {
      contactDetails.value.FirstName = val.FirstName
      contactDetails.value.LastName = val.LastName
      contactDetails.value.MailingStreet = val.Address1 + val.Address2
      contactDetails.value.MailingState = val.State
      contactDetails.value.MailingCity = val.City
      contactDetails.value.MailingPostalCode = val.Zip
      contactDetails.value.Phone = val.Phone
      contactDetails.value.Email = val.Email
      contactDetails.value.AccountName = val.AccountName
      contactDetails.value.contactId = val.contactId
      if (advisorInformationData.value.length === 0) {
        advisorInformationData.value.push(val)
      } else {
        editMode.value = true
        advisorInformationData.value[0].Name = val.FirstName + ' ' + val.LastName
        advisorInformationData.value[0].FirmName = val.AccountName
        advisorInformationData.value[0].Address1 = val.Address1
        advisorInformationData.value[0].Address2 = val.Address2
        advisorInformationData.value[0].City = val.City
        advisorInformationData.value[0].State = val.State
        advisorInformationData.value[0].Zip = val.Zip
        advisorInformationData.value[0].Phone = val.Phone
        advisorInformationData.value[0].SplitRatio = 100
        advisorInformationData.value[0].ContactId = val.contactId
      }
    }
    function saveTradingAuthority() {
      loader.value = true
      $axios
        .post(`/api/v1/sfdc/opportunity/${props.opportunityId}/limitedtrading/${grantAuthority.value ? 'Yes' : 'No'}`)
        .then(() => {
          loader.value = false
        })
        .catch(() => {
          loader.value = false
        })
    }
    function saveOpportunityClientProduct() {
      loader.value = true
      $axios
        .post(`/api/v1/sfdc/opportunity/${props.opportunityId}/clientproduct/${clientProductId.value}`)
        .then(() => {
          loader.value = false
        })
        .catch(() => {
          loader.value = false
        })
    }
    function getAddress() {
      if (zipcode.value) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode.value}` }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              var address = results[0].formatted_address.split(',')
              city.value = address[0].length > 0 ? address[0].trim() : ''
              var stateCode = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
              var stateName = ''
              if (stateCode) {
                stateName = stateList.value.filter((a) => a.value === stateCode)
              }
              state.value = stateName && stateName.length > 0 ? stateName[0].value : ''
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
            } else {
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
            }
          } else {
            city.value = ''
            state.value = ''
            zipcodeError.value = true
            zipcodeErrorMsg.value = 'Invalid Zip Code'
          }
        })
      } else {
        city.value = ''
        state.value = ''
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
      }
    }
    function checkPhoneNumber() {
      if (phone.value) {
        if (phone.value.length < 14) {
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
    function updateAdvisorSplit() {
      loader.value = true
      var splitData = []
      advisorInformationData.value.forEach((element) => {
        var saveAdvisorSplitData = {
          OpportunityId: props.opportunityId,
          ContactId: element.ContactId,
          Name: element.Name,
          FirmName: element.FirmName,
          WebLogo: element.WebLogo,
          SplitRatio: element.SplitRatio,
          OppSplitId: element.OppSplitId,
          Address1: element.Address1,
          Address2: element.Address2,
          City: element.City,
          State: element.State,
          Zip: element.Zip,
          Phone: element.Phone,
          Email: element.Email,
          IsPrimary: true
        }
        splitData.push(saveAdvisorSplitData)
      })
      $axios
        .post(`/api/v1/tal/individual/${props.opportunityId}/advisorsplit`, splitData)
        .then((success) => {
          if (success.data.d != null) {
            splitAdvisorsDetails.value = success.data.d ? success.data.d : []
            loader.value = false
          }
        })
        .catch(() => {
          loader.value = false
        })
    }
    function checkAdvisoryFee() {
      if (parseFloat(advisoryFee.value) > 0) {
        disableNextButton.value = false
      } else disableNextButton.value = true
    }
    function getClientProductFeeDetails() {
      loader.value = true
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        $store.state.openAccountDetail.FeeBasedType = feeType.value ? feeType.value : ''
      }
      $axios
        .get(`/api/v1/user/clientproductfees/${clientProductId.value}`)
        .then((success) => {
          if (success.data.length > 0) {
            feeDetails.value = success.data
            var advisorFeeDetails
            var strategistFeeDetails
            advisorFeeDetails = feeDetails.value.filter((a) => a.FeeType === 'Advisor')
            strategistFeeDetails = feeDetails.value.filter((a) => a.FeeType === 'Strategist_Fee')
            advisoryFee.value = advisorFeeDetails.length > 0 ? advisorFeeDetails[0].FixedCost : ''
            if (Object.keys($store.state.openAccountDetail).length > 0) {
              $store.state.openAccountDetail.AdvisorFeePercentage =
                advisorFeeDetails.length > 0 ? advisorFeeDetails[0].FixedCost : 0
            }
            strategistFee.value = strategistFeeDetails.length > 0 ? strategistFeeDetails[0].FixedCost : ''
            if (advisoryFee.value) {
              readOnly.value = true
              disableNextButton.value = false
            } else {
              if (feeType.value !== 'Commission Based') {
                readOnly.value = false
                disableNextButton.value = true
              } else {
                readOnly.value = true
                disableNextButton.value = false
              }
            }
            loader.value = false
          } else {
            feeDetails.value = []
            loader.value = false
            disableNextButton.value = false
          }
        })
        .catch(() => {
          loader.value = false
          disableNextButton.value = false
        })
    }
    function saveFeesSchedule() {
      if (advisoryFee.value && strategistFee.value) {
        paymentType.value = 'Financial Professional Fee and Investment Strategist Fee'
      } else {
        paymentType.value = 'Financial Professional Fee Only'
      }
      var saveAdvisorFeesData = {
        Type: paymentType.value,
        AdvisorFeePercentage: feeType.value !== 'Commission Based' ? (advisoryFee.value ? parseFloat(advisoryFee.value) : 0) : 0,
        StrategistFeePercentage: strategistFee.value ? strategistFee.value : 0,
        OpportunityId: props.opportunityId
      }
      $axios.post(`/api/v1/sfdc/opportunity/advisorfees`, saveAdvisorFeesData)
    }
    function getClientProductDetails() {
      showClientProductLoader.value = true
      if (
        (props.planTypeNameValue && props.planTypeNameValue === $authz.planType.Individual_Simple_IRA) ||
        props.planTypeNameValue === $authz.planType.Individual_457_b_Governmental_Plan
      ) {
        $axios
          .get(`/api/v1/user/clientproduct/plantypename/${props.planTypeNameValue}`)
          .then((success) => {
            var clientProductDetails = success.data && success.data.length > 0 ? success.data : []

            if (clientProductDetails.length > 0) {
              clientProductDetails.sort(function (a, b) {
                return new Date(b.CreatedDate) - new Date(a.CreatedDate)
              })
            }

            clientProductData.value = clientProductDetails

            showClientProductLoader.value = false
            if (Object.keys($store.state.openAccountDetail).length > 0 && $store.state.openAccountDetail.ClientProduct) {
              var clientProductDetailsData = clientProductData.value.filter(
                (a) => a.ClientProductId === $store.state.openAccountDetail.ClientProduct
              )
              feeType.value = clientProductDetailsData[0].FeeType
              $store.state.openAccountDetail.FeeBasedType = clientProductDetailsData[0].FeeType
              loadWaived.value = clientProductDetailsData[0].LoadWaivedOptions
            }
          })
          .catch(() => {
            showClientProductLoader.value = false
          })
      } else {
        if (props.schoolDistrictId) {
          $axios
            .get(`/api/v1/user/clientproduct/schooldistrict/${props.schoolDistrictId}`)
            .then((success) => {
              var clientProductDetails = success.data && success.data.length > 0 ? success.data : []

              if (clientProductDetails.length > 0) {
                clientProductDetails.sort(function (a, b) {
                  return new Date(b.CreatedDate) - new Date(a.CreatedDate)
                })
              }

              clientProductData.value = clientProductDetails

              showClientProductLoader.value = false
              if (Object.keys($store.state.openAccountDetail).length > 0 && $store.state.openAccountDetail.ClientProduct) {
                var clientProductDetailsData = clientProductData.value.filter(
                  (a) => a.ClientProductId === $store.state.openAccountDetail.ClientProduct
                )
                feeType.value = clientProductDetailsData[0].FeeType
                $store.state.openAccountDetail.FeeBasedType = clientProductDetailsData[0].FeeType
                loadWaived.value = clientProductDetailsData[0].LoadWaivedOptions
              }
            })
            .catch(() => {
              showClientProductLoader.value = false
            })
        }
      }
    }
    function continueDetails(val) {
      presenterInfoFlow.value = 1
      progressValue.value = 20
      if (clientProductId.value !== val.ClientProductId) {
        $axios.delete(`/api/v1/sfdc/opportunityfund/${props.opportunityId}/delete/all`)
      }
      clientProductId.value = val.ClientProductId
      loadWaived.value = val.LoadWaivedOptions
      feeType.value = val.FeeType
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        $store.state.openAccountDetail.ClientProduct = clientProductId.value
        $store.state.openAccountDetail.FeeBasedType = feeType.value
      }
      saveOpportunityClientProduct()
      getClientProductFeeDetails()
    }
    function goToNextPage() {
      presenterInfoFlow.value = 2
      progressValue.value = 30
      onlyOnePresenter.value = true
      saveFeesSchedule()
    }
    function goToSelectedInvestmentsInformation() {
      presenterInfoFlow.value = 3
      progressValue.value = 40
    }
    function goToInvestmentInformation() {
      if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338) ||
        $authz.hasRole($authz.roles.FirmAdmin)
      ) {
        if ($authz.allowedByAccount($authz.accountPermissionSet.Advisors_Firms__c, $authz.permission.Full)) {
          presenterInfoFlow.value = 5
          progressValue.value = 45
        } else {
          presenterInfoFlow.value = 6
          progressValue.value = 50
        }
      } else {
        presenterInfoFlow.value = 5
        progressValue.value = 45
      }
    }
    function goToAccountSetUP() {
      presenterInfoFlow.value = 6
      progressValue.value = 50
    }
    function goToContactDetails() {
      presenterInfoFlow.value = 7
      progressValue.value = 60
    }
    function goToPersonalInformation() {
      presenterInfoFlow.value = 8
      progressValue.value = 70
    }
    function goToEmployerInformation() {
      presenterInfoFlow.value = 9
      progressValue.value = 80
    }
    function goToBeneficiariesInformation() {
      presenterInfoFlow.value = 10
      progressValue.value = 90
    }
    function goToTransferBalancePage() {
      // presenterInfoFlow.value = 11
      // progressValue.value = 95
      presenterInfoFlow.value = 12
      progressValue.value = 100
    }
    function goToCompletePage() {
      presenterInfoFlow.value = 12
      progressValue.value = 100
    }
    ///we are not using this method
    function goToProductSelectionPage() {
      presenterInfoFlow.value = 5
      progressValue.value = 50
    }
    ///we are not using this method
    function showAccountSetUpFlag() {
      presenterInfoFlow.value = 6
      progressValue.value = 50
    }
    const presenterInfoDialog = computed({
      get() {
        return props.value
      },
      set(value) {
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
    const dialogWidth = computed(() => {
      if (display.xl.value) return '55%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    const dialogHeight = computed(() => {
      if (display.xl.value) return `calc(100vh - 300px)`
      else if (display.lg.value) return `calc(100vh - 100px)`
      else if (display.md.value) return `calc(100vh - 160px)`
      else if (display.sm.value) return `calc(100vh - 200px)`
      else return `calc(100vh - 100px)`
    })
    const showBasedOnAdvisorRole = computed(() => {
      if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338) ||
        $authz.hasRole($authz.roles.FirmAdmin)
      ) {
        if ($authz.allowedByAccount($authz.accountPermissionSet.Advisors_Firms__c, $authz.permission.Full)) {
          return true
        } else return false
      } else return true
    })
    onMounted(() => {
      getExternalCode()
      var closingStageValue = $store.state.openAccountDetail.LastClosingState
        ? $store.state.openAccountDetail.LastClosingState
        : ''
      grantAuthority.value = $store.state.openAccountDetail.LimitedAuthorityTrading
        ? $store.state.openAccountDetail.LimitedAuthorityTrading
        : ''
      if (closingStageValue) {
        switch (closingStageValue) {
          case 'AdvisoryProduct':
            presenterInfoFlow.value = 0
            progressValue.value = 10
            $store.state.openAccountDetail.LastClosingStateStep = 0
            break
          case 'Presenter':
            presenterInfoFlow.value = 1
            progressValue.value = 20
            $store.state.openAccountDetail.LastClosingStateStep = 1
            break
          case 'AddModelFund':
            presenterInfoFlow.value = 2
            progressValue.value = 30
            $store.state.openAccountDetail.LastClosingStateStep = 2
            break
          case 'SelectedInvestment':
            presenterInfoFlow.value = 3
            progressValue.value = 40
            $store.state.openAccountDetail.LastClosingStateStep = 3
            break
          case 'SplitFee': //we are not using
            presenterInfoFlow.value = 4
            progressValue.value = 50
            $store.state.openAccountDetail.LastClosingStateStep = 4
            break
          case 'EditFee': //we are not using
            presenterInfoFlow.value = 5
            progressValue.value = 60
            $store.state.openAccountDetail.LastClosingStateStep = 5
            break
          case 'AccountSetUp':
            presenterInfoFlow.value = 6
            progressValue.value = 50
            $store.state.openAccountDetail.LastClosingStateStep = 6
            break
          case 'Contact':
            presenterInfoFlow.value = 7
            progressValue.value = 60
            $store.state.openAccountDetail.LastClosingStateStep = 7
            break
          case 'Personal':
            presenterInfoFlow.value = 8
            progressValue.value = 70
            $store.state.openAccountDetail.LastClosingStateStep = 8
            break
          case 'Employer':
            presenterInfoFlow.value = 9
            progressValue.value = 80
            $store.state.openAccountDetail.LastClosingStateStep = 9
            break
          case 'Beneficiaries':
            presenterInfoFlow.value = 10
            progressValue.value = 90
            $store.state.openAccountDetail.LastClosingStateStep = 10
            break
          case 'TransferBalances':
            presenterInfoFlow.value = 11
            progressValue.value = 95
            $store.state.openAccountDetail.LastClosingStateStep = 11
            break
          case 'CompletedAccount':
            presenterInfoFlow.value = 12
            progressValue.value = 100
            $store.state.openAccountDetail.LastClosingStateStep = 12
            break
          default:
            presenterInfoFlow.value = 0
            progressValue.value = 10
            $store.state.openAccountDetail.LastClosingStateStep = 0
            break
        }
      }
      getContactInfo()
      getClientProductDetails()
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        clientProductId.value = $store.state.openAccountDetail.ClientProduct
        advisoryFee.value = $store.state.openAccountDetail.AdvisorFeePercentage
          ? $store.state.openAccountDetail.AdvisorFeePercentage
          : ''
        feeType.value = $store.state.openAccountDetail.FeeBasedType ? $store.state.openAccountDetail.FeeBasedType : ''
        repCode.value = $store.state.openAccountDetail.RepCode ? $store.state.openAccountDetail.RepCode : ''
        brokerDealerName.value = $store.state.openAccountDetail.BrokerDealerId
          ? $store.state.openAccountDetail.BrokerDealerName
            ? $store.state.openAccountDetail.BrokerDealerName
            : ''
          : $store.state.openAccountDetail.BrokerDealerManual
      }
      if (advisoryFee.value) {
        readOnly.value = true
        disableNextButton.value = false
      }
    })
    return {
      theme,
      display,
      crd,
      $authz,
      presenterInfoDialog,
      dialogWidth,
      dialogHeight,
      presenterInfoFlow,
      presenterFlag,
      screenClass,
      prospectClass,
      evaluateClass,
      proposeClass,
      finalizeClass,
      progressValue,
      clientProductData,
      showClientProductLoader,
      showPermissionGrantPage,
      loader,
      contentURL,
      contactDetails,
      advisorInformationData,
      grantAuthority,
      showBrokerDealer,
      brokerDealerName,
      repCode,
      feeType,
      advisoryFee,
      readOnly,
      error,
      openBrokerScreen,
      address1,
      address2,
      city,
      state,
      zipcode,
      phone,
      disableNextButton,
      editFlag,
      titleName,
      displayMessage,
      addNewAdvisor,
      contactId,
      deletePopUpPresenter,
      loadWaived,
      splitFeeSchedule,
      presenterList,
      presenterDetails,
      showMultiplePresenter,
      valid,
      emailRegex,
      completedClass,
      replaceAdvisor,
      goToPermissionPage,
      getPresenter,
      removeValidation,
      saveAdvisorSplit,
      getAddress,
      checkPhoneNumber,
      updateAdvisorSplit,
      goBackToPreviousPage,
      closePresenterDialog,
      continueDetails,
      checkAdvisoryFee,
      editContactDetails,
      closeBrokerDialog,
      saveAndAddAdvisor,
      cancel,
      addAdvisor,
      goToNextPage,
      goBack,
      getGrantAuthority,
      deletePresenter,
      editDetails,
      goToSelectedInvestmentsInformation,
      goToInvestmentInformation,
      goToProductSelectionPage,
      goToAccountSetUP,
      goToContactDetails,
      goToPersonalInformation,
      goToEmployerInformation,
      goToBeneficiariesInformation,
      goToTransferBalancePage,
      goToCompletePage,
      showAccountSetUpFlag
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
.editButtonClass {
  /* clip-path: polygon(50% 0%, 0% 100%, 100% 100%); */
  clip-path: polygon(100% 0%, 0% 0%, 100% 100%);
  position: absolute;
  top: -6px;
  right: -10px;
  height: 56px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
.hr_border {
  margin-top: 0px;
}
.cardHeight {
  height: 250px;
  width: 100%;
}
.iconColor {
  color: rgb(var(--v-theme-accent)) !important;
}
.container {
  display: flex;
  overflow-x: auto;
}
</style>
<style>
.advisorFeeClass .v-input__slot {
  color: #0077cc !important;
}
</style>
