<template>
  <v-container
    ref="printContent"
    :class="[$vuetify?.breakpoint?.smAndDown ? 'pl-1 pr-1' : 'container--fluid', $vuetify?.theme.dark ? 'dark_bg' : '']"
  >
    <v-container class="pt-1" :class="$vuetify?.breakpoint?.smAndDown ? 'pl-0 pr-0' : 'container--fluid'">
      <v-col class="xs12 pt-2 pb-2">
        <v-row>
          <v-col xs6 class="align-self">
            <router-link
              :to="prevRoute.fullPath !== '/' ? (prevRoute.fullPath ? prevRoute.fullPath : '/') : lastRoute"
              class="text-decoration-none"
            >
              <span :class="$vuetify?.theme.dark ? 'text-white cursor-pointer' : 'text-hyperlink cursor-pointer'">
                <span data-html2canvas-ignore="true">
                  <v-icon size="small" :class="$vuetify?.theme.dark ? 'text-white pb-1' : 'text-hyperlink pb-1'"
                    >fas fa-angle-left</v-icon
                  >
                </span>
                <span
                  :class="
                    $vuetify?.theme.dark ? 'text-white pl-2 text-uppercase font_14' : 'text-hyperlink pl-2 text-uppercase font_14'
                  "
                  >Back</span
                >
              </span>
            </router-link>
          </v-col>
          <v-col xs6 class="text-right">
            <v-row justify="end">
              <v-col class="text-right align-self d-flex justify-end flex_none">
                <a
                  v-if="$authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full)"
                  href="#"
                  class="text-uppercase text-decoration-none pr-1 font_14"
                  :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                  @click="exportToExcel()"
                  >Export</a
                >
              </v-col>
              <v-col
                v-if="$authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full)"
                class="text-right align-self d-flex justify-end flex_none ml-4"
              >
                |
              </v-col>
              <v-col class="text-right align-self d-flex justify-end flex_none">
                <div class="pl-1">
                  <PlanStar :seinpno="selectedPlan.SEINPNO" from="TAL" type="ForProfit" />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col id="printMe">
        <v-card class="mb-3 elevation-4">
          <v-col>
            <PlanInformation
              ref="planInformationProgress"
              :selected-plan="selectedPlan"
              :report-type="reports"
              :plan-id="planId"
            />
          </v-col>
        </v-card>
      </v-col>
      <v-col v-if="$vuetify?.breakpoint?.smAndDown ? (createReport ? true : false) : true" pt-1>
        <v-row>
          <v-col id="reportsTab" :class="$vuetify?.breakpoint?.smAndDown ? 'xs11 sm11' : 'xs12 sm12'">
            <v-card>
              <v-tabs
                v-model="reportsTab"
                :bg-color="$vuetify?.theme.dark ? '' : 'accent'"
                class="plantabs"
                align-tabs="center"
                center-active
                show-arrows
                slider-color="white"
              >
                <v-tab v-for="(item, index) in items" :key="index" style>
                  {{ item.text }}
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
          <v-col
            v-if="$vuetify?.breakpoint?.smAndDown"
            :class="[
              $vuetify?.breakpoint?.smAndDown ? 'xs1 sm1 elevation-1 text-center' : '',
              $vuetify?.theme.dark ? 'assign_darkMode_color' : 'accent'
            ]"
            style="height: 48px !important"
            @click="createReport = !createReport"
          >
            <v-icon class="text-secondary pt-2 mt-1 cursor-pointer"> remove_circle </v-icon>
          </v-col>
          <v-progress-linear v-if="loadAll" color="accent" :indeterminate="true" height="5" class="mt-0" />
        </v-row>
      </v-col>
      <v-col
        v-if="$vuetify?.breakpoint?.smAndDown"
        v-show="!createReport"
        xs12
        sm12
        mt-2
        class="pt-2 pb-2 pl-2 pr-1 text-secondary border_radius_2"
        :class="$vuetify?.theme.dark ? 'assign_darkMode_color' : 'accent'"
        @click="createReport = !createReport"
      >
        <v-row>
          <v-col xs11 sm11 pt-1 pl-2> Reports </v-col>
          <v-col xs1 sm1 class="text-center cursor-pointer">
            <v-icon class="text-secondary"> add_circle </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-row
        v-if="$vuetify?.breakpoint?.smAndDown ? (createReport ? true : false) : true"
        class="justify-center"
        :class="step1Error || step2Error ? 'step_error' : 'stepper_main'"
      >
        <v-col xl11 lg11 sm11 md11 :class="loadAll ? '' : 'mt-3'">
          <div class="pt-1 stepers_div">
            <v-stepper v-model="el" vertical class="elevation-0 background_transparent">
              <v-stepper-step
                id="step1"
                v-ripple="false"
                step="1"
                :color="step1Error ? 'error' : 'accent'"
                :class="step1Error ? 'stepred' : ''"
              >
                <v-container class="ma-0 pa-0">
                  <v-col xl12 lg12 md12 sm12 xs12>
                    <v-row>
                      <v-col class="text-left align-self mr-4 flex_none">
                        <h2 :class="step1Error ? 'error--text' : $vuetify?.theme.dark ? 'text-white' : 'text-accent'">
                          {{ type1 }}
                        </h2>
                      </v-col>
                      <v-col v-if="presenterEdit && !loadAll">
                        <v-btn
                          class="mr-1"
                          size="small"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          @click="toggleStepper('1')"
                        >
                          Edit Plan Information
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-container>
              </v-stepper-step>
              <v-col v-if="presenterEdit" xl12 lg12 md12 sm12 xs12 pl-4 class="alignStepper">
                <!-- For RPEA / Proposal Presenter After Save -->
                <v-col>
                  <!-- For Proposal Presenter After Save -->
                  <v-col v-if="reports === 'Proposal'">
                    <h3>Plan Information from the latest FORM 5500</h3>
                    <v-col class="text-left" xs8 xl10 lg10 pt-2>
                      <h4>Company Name</h4>
                    </v-col>
                    <v-col class="text-left" xs10 xl10 lg10 pt-1>
                      <h3>{{ companyName }}</h3>
                    </v-col>
                    <v-col class="text-left" xs8 xl10 lg10 pt-2>
                      <h4>Plan Name</h4>
                    </v-col>
                    <v-col class="text-left" xs10 xl10 lg10 pt-1>
                      <h3>{{ planName }}</h3>
                    </v-col>
                    <v-row class="pt-2">
                      <v-col class="text-left" xs7 xl5 lg5>
                        <h4>Plan Type</h4>
                      </v-col>
                      <v-col class="text-left" xs5 xl5 lg5>
                        <h4>Federal ID#</h4>
                      </v-col>
                    </v-row>
                    <v-row class="pt-1">
                      <v-col class="text-left" xs7 xl5 lg5>
                        <h3>{{ planType }}</h3>
                      </v-col>
                      <v-col class="text-left" xs5 xl5 lg5>
                        <h3>{{ federalID }}</h3>
                      </v-col>
                    </v-row>
                    <v-row class="pt-2">
                      <v-col class="text-left" xs7 xl5 lg5>
                        <h4>Address</h4>
                      </v-col>
                      <v-col class="text-left" xs5 xl5 lg5>
                        <h4>City,State and Zip</h4>
                      </v-col>
                    </v-row>
                    <v-row class="pt-1">
                      <v-col class="text-left" xs7 xl5 lg5>
                        <h3>{{ address }}</h3>
                      </v-col>
                      <v-col class="text-left" xs5 xl5 lg5>
                        <h3>{{ city }}</h3>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- for both  -->
                  <v-row class="pt-2">
                    <v-col v-if="planId > 0" class="text-left" xs7 xl5 lg5>
                      <h4>Total Asset</h4>
                    </v-col>
                    <v-col v-else class="text-left" xs5 xl5 lg5>
                      <h4>Estimated 1st Year Contribution</h4>
                    </v-col>
                    <v-col class="text-left" xs5 xl5 lg5>
                      <h4>As of Date</h4>
                    </v-col>
                  </v-row>
                  <v-row class="pt-1">
                    <v-col class="text-left" xs7 xl5 lg5>
                      <h3>
                        {{ formatPrice(estimatedAnnualContributions, 2) }}
                      </h3>
                    </v-col>
                    <v-col class="text-left" xs5 xl5 lg5>
                      <h3>{{ asOfdate1 }}</h3>
                    </v-col>
                  </v-row>
                  <v-row class="pt-2">
                    <v-col class="text-left" xs7 xl5 lg5>
                      <h4>Participants with a Balance</h4>
                    </v-col>
                  </v-row>
                  <v-row class="pt-1 pb-2">
                    <v-col class="text-left" xs7 xl5 lg5>
                      <h3>{{ balanceParticipants }}</h3>
                    </v-col>
                  </v-row>
                  <v-row v-if="reports === 'Proposal'">
                    <v-col class="text-left" xs7 xl5 lg5>
                      <h4>Company Stock</h4>
                      <h3 class="pt-1 pb-2">
                        {{ formatPrice(companyStock ? companyStock : 0, 2) }}
                      </h3>
                    </v-col>
                    <v-col class="text-left" xs5 xl5 lg5>
                      <h4>Outside Assets</h4>
                      <h3 class="pt-1 pb-2">
                        {{ formatPrice(outsideAsset ? outsideAsset : 0, 2) }}
                      </h3>
                    </v-col>
                    <v-col class="text-left" xs7 xl5 lg5>
                      <h4>Self Directed Brokerage</h4>
                      <h3 class="pt-1 pb-2">
                        {{ formatPrice(selfDirectedBrokrage ? selfDirectedBrokrage : 0, 2) }}
                      </h3>
                    </v-col>
                    <v-col class="text-left" xs5 xl5 lg5>
                      <h4>Plan Year End</h4>
                      <h3 class="pt-1 pb-2">
                        {{ planYearEnd }}
                      </h3>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col v-if="!presenterEdit && presenterStart && !loadAll" class="alignGreyStepper" xl12 lg12 md12 sm12 xs12>
                <v-btn class="mr-1" size="small" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="toggleStepper('1')">
                  Add Plan Information
                </v-btn>
              </v-col>
              <v-dialog
                v-model="showFirstStepper"
                persistent
                class="elevation-3"
                scrollable
                :eager="true"
                :max-width="dialogWidth"
              >
                <v-card>
                  <v-card-title :class="$vuetify?.theme.dark ? '' : 'accent secondary--text'">
                    <v-col v-if="!presenterEdit && presenterStart" xs12>
                      <h3>{{ 'Add Plan Information' }}</h3>
                    </v-col>
                    <v-col v-else xs12>
                      <h3>{{ 'Edit Plan Information' }}</h3>
                    </v-col>
                  </v-card-title>
                  <v-divider class="bold" />
                  <v-card-text class="pt-5 pb-5 card_text_height" :class="$vuetify?.breakpoint?.xs ? 'pl-2 pr-2' : ''">
                    <v-col v-if="reports === 'Proposal'">
                      <PlanProposalInformation
                        ref="planInformation"
                        :save-plan-info-method="savePlanInfo"
                        :proposal-plan-info="proposalPlan"
                        :selected-plan="selectedPlan"
                        :plan-id="planId"
                        @proposal-plan-info-edit="proposalPlanMode"
                      />
                    </v-col>
                  </v-card-text>
                  <v-divider class="bold" />
                  <v-card-actions>
                    <v-btn
                      :color="$vuetify?.theme.dark ? '' : 'accent'"
                      :disabled="saveLoading"
                      :loading="saveLoading"
                      @click="saveStepper('1')"
                    >
                      Save And Close
                      <template #saveLoading>
                        <span class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                    <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" variant="outlined" @click="cancelChanges('1')">
                      Cancel, Don't Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-stepper-step id="step2" step="2" color="accent" class="text-green" :class="[step2Error ? 'stepred' : '']">
                <v-container class="pa-0 ma-0">
                  <v-col xl12 lg12 md12 sm12 xs12>
                    <v-row>
                      <v-col class="text-left align-self mr-4 flex_none">
                        <h2 :class="step2Error ? 'error--text' : $vuetify?.theme.dark ? 'text-white' : 'text-accent'">
                          {{ type2 }}
                        </h2>
                      </v-col>
                      <v-col v-if="investmentEdit && !loadAll">
                        <v-btn
                          class="mr-1"
                          size="small"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          @click="toggleStepper('2')"
                        >
                          {{ 'Edit Proposed Investments' }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-container>
              </v-stepper-step>
              <v-col v-if="investmentEdit && reports === 'Proposal'" xl12 lg12 md12 sm12 xs12 pl-4 class="alignStepper">
                <v-col v-show="reports === 'Proposal'" class="text-left" xs8 xl10 lg10>
                  <v-col
                    v-if="
                      $authz.allowedByProgram(
                        $authz.programPermissionSet.PCS_Aspire_Product__c,
                        $authz.pcsAspireProduct.Multi_Strategist_Product
                      )
                    "
                  >
                    <v-col class="text-left mr-2" xs12 pt-2>
                      <h2>Strategist</h2>
                      <v-data-table
                        density="compact"
                        :headers="startegistHeadersList"
                        :items="mmlStrategist"
                        item-key="Strategist"
                        hide-default-footer
                        sortable
                        :disable-pagination="true"
                        class="elevation-0"
                      >
                        <template #header="props">
                          <th v-for="header in props.headers" :key="header.text" :align="header.align">
                            {{ header.text }}
                          </th>
                        </template>
                        <template #item="props">
                          <tr>
                            <td class="text-left">
                              {{ props.item.Strategist }}
                            </td>
                            <td class="text-left">
                              {{ props.item.UnderlyingHoldings }}
                            </td>
                            <td class="text-right">
                              {{ props.item.AverageExpRatio ? props.item.AverageExpRatio.toFixed(2) : 0 }}%
                            </td>
                            <td class="text-right">
                              {{ props.item.ModelCount }}
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-col>
                </v-col>
              </v-col>
              <v-col
                v-if="!investmentEdit && investmentStart && !loadAll"
                class="alignGreyStepper"
                :class="$vuetify?.theme.dark ? 'text-white' : 'text-accent'"
                xs4
                xl2
              >
                <v-btn class="mr-1" size="small" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="toggleStepper('2')">
                  'Add Investments' }}
                </v-btn>
              </v-col>
              <v-dialog
                v-model="showSecondStepper"
                persistent
                class="elevation-3"
                scrollable
                :eager="true"
                :max-width="dialogWidth"
              >
                <v-card>
                  <v-card-title :class="$vuetify?.theme.dark ? '' : 'accent secondary--text'">
                    <v-col v-if="!investmentEdit && investmentStart" xs12>
                      <h3>{{ 'Add Proposed Investments' }}</h3>
                    </v-col>
                    <v-col v-else xs12>
                      <h3>{{ 'Edit Proposed Investments' }}</h3>
                    </v-col>
                  </v-card-title>
                  <v-divider class="bold" />
                  <v-card-text class="pt-5 pb-5 card_text_height">
                    <v-col v-if="reports === 'Proposal'">
                      <v-col
                        v-if="
                          $authz.allowedByProgram(
                            $authz.programPermissionSet.PCS_Aspire_Product__c,
                            $authz.pcsAspireProduct.Multi_Strategist_Product
                          )
                        "
                      >
                        <ProposedInvestments
                          ref="modelFund"
                          :plan-i-d="planId"
                          :reports="reports"
                          :seinpno="selectedPlan.SEINPNO"
                          :plan-type="selectedPlan.DCPTYPE"
                          :strategist="selectedPlan.Strategist"
                          @modelfund-details="strategistMode"
                        />
                      </v-col>
                    </v-col>
                  </v-card-text>
                  <v-divider class="bold" />
                  <v-card-actions>
                    <v-btn
                      :color="$vuetify?.theme.dark ? '' : 'accent'"
                      :loading="saveLoading"
                      :disabled="saveLoading"
                      @click="saveStepper('2')"
                    >
                      Save And Close
                      <template #saveLoading>
                        <span class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                    <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" variant="outlined" @click="cancelChanges('2')">
                      Cancel, Don't Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-stepper>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
import ProposedInvestments from '@/components/TAL/RPEA/ProposedInvestments'
import PlanInformation from '@/components/TAL/Diagnostics/TALPlanInformation'
import PlanProposalInformation from '@/components/TAL/Proposal/PlanProposalInformation'
import PlanStar from '@/components/TAL/PlanStar'
import * as XLSX from 'xlsx'
import moment from 'moment'
export default {
  components: {
    ProposedInvestments,
    PlanInformation,
    PlanProposalInformation,
    PlanStar
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.loadAll) {
      if (this.$vuetify?.breakpoint?.smAndDown && !this.createReport) {
        next()
      } else {
        if (this.reports === 'Activity') {
          this.toRoute = to.fullPath
          next()
        } else {
          this.toRoute = to.fullPath
          next()
        }
      }
    } else next()
  },
  data() {
    return {
      prevRoute: '',
      el: -1,
      tabList: [
        {
          text: 'Proposal',
          value: 'Proposal'
        }
      ],
      reports: 'Proposal',
      createReport: false,
      presenterStart: true,
      presenterEdit: false,
      planId: 0,
      investmentEdit: false,
      checkProposalData: true,
      investmentStart: true,
      type1: 'Plan Information and Features',
      type2: 'Proposed Investments',
      companyName: '',
      planName: '',
      planType: '',
      federalID: '',
      address: '',
      city: '',
      totalAsset: '',
      estimatedAnnualContributions: '',
      asOfdate1: '',
      balanceParticipants: '',
      selfDirectedBrokrage: 0,
      outsideAsset: 0,
      companyStock: 0,
      asOfdate2: '',
      proposalPlan: {
        SNAME: '',
        PNAME: '',
        DCPTYPE: '',
        SEINPNO: '',
        Contact: '',
        SSTREET: '',
        CityStateZip: '',
        TOTASSETS: 0,
        PARTIC: 0,
        YEAREND: new Date().toISOString().slice(0, 10),
        ServiceType: 0,
        TPASchedule: 0,
        TPACompany: '',
        TPAContact: '',
        TPAPhone: '',
        TPAEmail: '',
        PresentedBy: '',
        Presentation: new Date().toISOString().slice(0, 10),
        Anticipated: this.anticapteDate(),
        Status: '',
        Outside: 0,
        OutsideAmount: 0,
        Stock: 0,
        OutsideType: 0,
        StockAmount: 0,
        FeeType: 0,
        ManagerName: '',
        ManagerFee: 0,
        ManagerSchedule: 0,
        AdvisorFeeType: 0,
        AdvisorName: '',
        AdvisorFee: 0,
        AdvisorSchedule: 0,
        Broker: 0,
        Model1: 0,
        Model2: 0,
        Model3: 0,
        Model4: 0,
        Model5: 0,
        Model6: 0,
        AdvisorID: this.$store.state.user.id,
        Created: new Date().toISOString().slice(0, 10),
        PlanID: 0,
        SafeHarbor: 0,
        ETF: 0,
        WaiveFee1: false,
        WaiveFee2: false,
        AncillaryFee: false,
        ExcludeSummary: false,
        PBSAdvisor: false,
        PBSAdmin: false,
        PBSRecordkeeping: false,
        PBSCustodian: false,
        FiduciaryStatus: '',
        TPAName: '',
        TPARKFee: 0,
        TPARKSchedule: 0,
        TrusteeFee: 0,
        TrusteeSchedule: 0,
        ProviderType: 0,
        ProviderName: '',
        ProviderFee: 0,
        ProviderSchedule: 0,
        ProviderPercent: 0,
        ProviderDollar: 0,
        ManagerPercent: 0,
        ManagerDollar: 0,
        AdvisorPercent: 0,
        AdvisorDollar: 0,
        ExpensePercent: 0,
        ExpenseDollar: 0,
        PCSAdminDollar: 0,
        TPAAdminDollar: 0,
        TPARKDollar: 0,
        TrusteeDollar: 0,
        AdminFiduciary: 0,
        SUB: '',
        TPA: '',
        EstimatedPercent: 0,
        EstimatedDollar: 0,
        ConversionFeeShow: false,
        ConversionFeeText: '',
        DocumentFeeShow: false,
        DocumentFeeText: '',
        AboutTPA: false,
        AboutTPAName: '',
        AboutTPADescription: '',
        HidePresentation: false,
        MML: 0,
        IMType: 0,
        Delegation: false,
        PriceStatus: '',
        PricedEmail: '',
        PriceEmailDate: new Date().toISOString().slice(0, 10),
        BundledPricing: 0,
        PriceNotes: '',
        ElectronicOnly: false,
        AdvisorNotes: '',
        ElectronicDate: new Date().toISOString().slice(0, 10),
        illiquid: '',
        HCAddr1: '',
        HCAddr2: '',
        HCCityStateZip: '',
        ParticACCT: 0,
        PresentedByID: 0,
        EmployerCity: '',
        EmployerState: '',
        EmployerZip: '',
        CPlanProvider: '',
        CurrentPlanPricing: '',
        DefaultPricedEmail: '',
        inRPEA: false,
        ApprovedPartic: 0,
        ApprovedAssets: 0,
        ApprovedParticAcct: 0,
        Estimated_Annual_Contributions: 0,
        numHardCopies: 0,
        HardCopyNeeded: new Date().toISOString().slice(0, 10),
        EAddress2: '',
        SCITY: '',
        SPHONE: '',
        SSTATE: '',
        ZIPCODE: '',
        SSIGNATOR: '',
        ContactFirstName: '',
        ContactLastName: '',
        PresCity: '',
        PresState: '',
        PresZip: '',
        AdvisorExpPages: '',
        GIC_SV: '',
        FiduciaryServicesProgram: 0,
        TPAFeeType: 1,
        TPAFee: 0,
        AnnualRecordkeeping: false,
        EstimatedFirstYearContributions: 0,
        BDPlatformFee: 0,
        BDPlatFormPercent: 0,
        BDPlatFormDollar: 0,
        TPAAdminPercent: 0,
        TPARKPercent: 0,
        TrusteePercent: 0,
        MutualFundOffsetDollar: 0,
        MutualFundOffsetPercent: 0,
        Strategist: ''
      },
      selectedPlan: {
        PNAME: '',
        DCPTYPE: '',
        SEINPNO: '',
        TOTASSETS: 0,
        PARTIC: 0,
        YEDISPLAY: '',
        SNAME: '',
        SSTREET: '',
        SCITY: '',
        SSTATE: '',
        ZIPCODE: '',
        EXPACCT: 0,
        EXPADMIN: 0,
        EXPINVADV: 0,
        EXPPROFFEE: 0,
        EXPOTHER: 0,
        BROKER: 0,
        SF: false,
        SCHED: '',
        SHORT: 0,
        PLANTYPE: '',
        InBookOfBusiness: false,
        ReliusPlanId: undefined,
        TOTCONTRIB: 0,
        Strategist: ''
      },
      step1Error: false,
      step2Error: false,
      loadAll: false,
      load1: false,
      load3: false,
      toRoute: '',
      validationIssue: false,
      reportsTab: 0,
      lastRoute: '',
      mmlStrategist: [],
      groupId: 0,
      strategist: '',
      planLeadID: '',
      startegistHeadersList: [
        {
          text: 'Strategist',
          value: 'strategist',
          align: 'start',
          width: '25%',
          sortable: false
        },
        {
          text: 'Underlying Holdings',
          value: 'underlyingHoldings',
          align: 'start',
          width: '25%',
          sortable: false
        },
        {
          text: 'Average Expense Ratio',
          value: 'averageExpenseRatio',
          align: 'end',
          width: '20%',
          sortable: false
        },
        {
          text: '# of Models',
          value: 'NoofModels',
          align: 'end',
          width: '20%',
          sortable: false
        }
      ],
      saveLoading: false,
      showSecondStepper: false,
      showFirstStepper: false
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    },
    dialogWidth() {
      if (this.$vuetify?.breakpoint?.xlOnly) return '70%'
      else if (this.$vuetify?.breakpoint?.lgOnly) return '80%'
      else return '90%'
    }
  },
  watch: {
    reportsTab: function () {
      this.reports = 'Proposal'
      this.assignReports()
    },
    reports: function (oldvalue, newvalue) {
      if (oldvalue !== newvalue) {
        this.el = -1
        if (oldvalue === 'Proposal') this.GetProposalPlan(true)
      }
    },
    $route: {
      handler() {
        if (this.$route.params.id) {
          if (this.$route.query.planId !== undefined && this.$route.query.planId < 0) {
            this.reportsTab = this.items.findIndex((a) => a.value === 'Proposal')
            this.reports = 'Proposal'
            this.planId = parseFloat(this.$route.query.planId)
            this.planLeadID = this.$route.query.planLeadId
            this.GetProposalPlan(true)
            this.assignReports()
          }
        }
      },
      deep: true
    },
    load1: {
      handler() {
        !this.load1 && !this.load3 ? (this.loadAll = false) : ''
      }
    },
    load3: {
      handler() {
        !this.load1 && !this.load3 ? (this.loadAll = false) : ''
      }
    },
    loadAll: {
      handler(val) {
        if (!val) this.el = -1
      }
    },
    tabList: {
      handler() {
        if (this.$authz.hasPermission(this.$authz.permissionSet.Proposal__c, this.$authz.permission.None)) {
          var showProposal = this.tabList.findIndex((a) => a.value === 'Proposal')
          if (showProposal > -1) this.tabList.splice(showProposal, 1)
        }
        this.items = this.tabList
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.$route.query.reportOption) {
      this.reports = this.$route.query.reportOption
    } else {
      this.reports = this.items[0].value
    }
    this.reportsTab = 0
    this.assignReports()
  },
  created() {
    var that = this
    window.onbeforeunload = function () {
      if (that.prevRoute.fullPath !== '/') localStorage.setItem('lastRoute', that.prevRoute.fullPath)
    }
    if (localStorage.lastRoute && localStorage.lastRoute !== '/') this.lastRoute = localStorage.lastRoute

    if (this.$route.query.planId && this.$route.query.planId < 0) {
      this.planId = parseFloat(this.$route.query.planId)
      this.planLeadID = this.$route.query.planLeadId
      this.GetProposalPlan(true)
      this.reports = this.$route.query.reportOption
      this.reportsTab = 0
      this.assignReports()
    }
  },
  methods: {
    removeParam() {
      if (this.$route.query.type !== undefined && this.$route.query.type === 'NewPlan') {
        const query = Object.assign({}, this.$route.query)
        delete query.type
        this.$router.replace({ query })
      }
    },
    anticapteDate() {
      var date = moment().add(90, 'days').format('DD')
      var month = moment().add(90, 'days').format('MM')
      var year = moment().add(90, 'days').format('YYYY')
      var anticaptedDate = year + '-' + month + '-' + date
      return anticaptedDate
    },
    proposalPlanMode(proposalPlanDetails, type) {
      this.companyName = proposalPlanDetails.SNAME
      this.planName = proposalPlanDetails.PNAME
      this.planType = proposalPlanDetails.planType
      this.federalID = proposalPlanDetails.federalId
      this.address = proposalPlanDetails.address
      this.city = proposalPlanDetails.cityStateZip
      this.totalAsset = proposalPlanDetails.totalAssets
      this.estimatedAnnualContributions = proposalPlanDetails.estimatedAnnualContributions
      this.asOfdate = proposalPlanDetails.assetasOfDate
      this.planYearEnd = proposalPlanDetails.planYearEnd
      this.balanceParticipants = proposalPlanDetails.participantWithBalance
      this.partAsOfDate = proposalPlanDetails.partAsOfDate
      this.outsideAsset = proposalPlanDetails.outsideAsset
      this.companyStock = proposalPlanDetails.companyStock
      this.selfDirectedBrokrage = proposalPlanDetails.selfDirectedBrokrage
      if (type === 'Save') {
        this.presenterEdit = true
        this.presenterStart = false
      }
      if (type === 'load') {
        this.presenterEdit = true
        this.presenterStart = !this.presenterEdit
        this.load1 = false
      }
    },
    strategistMode(modelFundObject, type) {
      this.mmlStrategist = modelFundObject.strategistObject
      this.investmentEdit = true
      this.investmentStart = false
      if (type === 'load') this.load3 = false
      if (
        this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.PCS_Aspire_Product__c,
          this.$authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if (this.mmlStrategist.length === 0) {
          this.investmentEdit = false
          this.investmentStart = true
        } else {
          this.groupId = this.mmlStrategist[0].GroupId
          this.strategist = this.mmlStrategist[0].Strategist
        }
      }
    },
    toggleStepper(val) {
      if (val === '1') {
        this.showFirstStepper = true
      } else if (val === '2') {
        this.showSecondStepper = true
      }
    },
    assignReports() {
      this.step1Error = false
      this.step2Error = false
      this.validationIssue = false
      this.clearStarts()
      if (this.reports === 'Proposal') {
        this.reports = 'Proposal'
        this.type1 = 'Plan Information and Features'
        this.type2 = 'Proposed Investments'
        this.loadAll = this.load1 = this.load3 = true
      }
    },
    clearStarts() {
      this.presenterStart = true
      this.investmentStart = true
      this.presenterEdit = false
      this.investmentEdit = false
      this.companyName = ''
      this.planName = ''
      this.planType = ''
      this.federalID = ''
      this.address = ''
      this.city = ''
      this.totalAsset = ''
      this.estimatedAnnualContributions = ''
      this.asOfdate = ''
      this.balanceParticipants = ''
      this.partAsOfDate = ''
    },
    GetProposalPlan(val) {
      if (this.planId !== 0) {
        var proposalPlanDetail = {
          AdvisorID: this.$store.state.user.id,
          PlanID: this.planId,
          SEINPNO: this.planId > 0 ? this.$route.params.id : '',
          ESPType: this.espTypeSelected
        }
        this.$axios.put(`/api/v1/advisor/proposalplan`, proposalPlanDetail).then((success) => {
          if (success.data.d !== null) {
            this.proposalPlan = success.data.d
            this.proposalPlan.EstimatedFirstYearContributions = this.proposalPlan.Estimated_Annual_Contributions
            this.checkProposalData = true
            if (!this.proposalPlan.PNAME) this.proposalPlan.PNAME = this.selectedPlan.PNAME
            if (!this.proposalPlan.SNAME) this.proposalPlan.SNAME = this.selectedPlan.SNAME
            if (this.planId > 0) this.proposalPlan.DCPTYPE = this.selectedPlan.DCPTYPE
            if (this.planId < 0) {
              this.selectedPlan.PNAME = this.proposalPlan.PNAME
              this.selectedPlan.SEINPNO = this.proposalPlan.SEINPNO
              this.selectedPlan.TOTASSETS = this.proposalPlan.TOTASSETS
              this.selectedPlan.TOTCONTRIB = this.proposalPlan.Estimated_Annual_Contributions
              this.selectedPlan.PARTIC = this.proposalPlan.PARTIC
              this.selectedPlan.SNAME = this.proposalPlan.SNAME
              this.selectedPlan.SSTREET = this.proposalPlan.SSTREET
              this.selectedPlan.EXPACCT = 0
              this.selectedPlan.EXPADMIN = 0
              this.selectedPlan.EXPINVADV = 0
              this.selectedPlan.EXPPROFFEE = 0
              this.selectedPlan.EXPOTHER = 0
              this.checkProposalData = true
              this.selectedPlan.BROKER = 0
              this.selectedPlan.DCPTYPE = this.proposalPlan.DCPTYPE
              this.selectedPlan.PLANTYPE = this.proposalPlan.DCPTYPE
              var cityStateZip = this.proposalPlan.CityStateZip
              var city = ''
              var state = ''
              var zip = ''
              if (cityStateZip) {
                cityStateZip = cityStateZip.trim()
                var comma = cityStateZip.indexOf(',')
                city = cityStateZip.slice(0, comma)
                var after = cityStateZip.substring(comma + 2)
                var space = after.lastIndexOf(' ')
                state = after.slice(0, space)
                zip = after.substring(space + 1)
              }
              this.selectedPlan.SCITY = city ? city.trim() : ''
              this.selectedPlan.SSTATE = state ? state.trim() : ''
              this.selectedPlan.YEDISPLAY = this.proposalPlan.YEAREND ? this.proposalPlan.YEAREND : '2021-12-31T00:00:00'
              this.selectedPlan.AsOfDate = this.proposalPlan.AsofDate
              this.selectedPlan.ZIPCODE = zip ? zip.trim() : ''
            }
            this.proposalPlan.ESPType = this.$authz.firmRelationship.Single_Employer_Plan
          } else {
            this.proposalPlan = {
              PNAME: this.selectedPlan.PNAME,
              SNAME: this.selectedPlan.SNAME,
              DCPTYPE: this.selectedPlan.DCPTYPE,
              SEINPNO: this.selectedPlan.SEINPNO,
              Contact: '',
              SSTREET: this.selectedPlan.SSTREET,
              CityStateZip: this.selectedPlan.SCITY + ', ' + this.selectedPlan.SSTATE + ' ' + this.selectedPlan.ZIPCODE,
              TOTASSETS: this.selectedPlan.TOTASSETS,
              EstimatedFirstYearContributions: this.selectedPlan.TOTCONTRIB ? this.selectedPlan.TOTCONTRIB : 0,
              PARTIC: this.selectedPlan.PARTICACCT,
              YEAREND: this.selectedPlan.YEDISPLAY,
              AsofDate: this.selectedPlan.AsOfDate,
              ServiceType: 0,
              TPASchedule: 0,
              TPACompany: '',
              TPAContact: '',
              TPAPhone: '',
              TPAEmail: '',
              PresentedBy: '',
              Presentation: null,
              Anticipated: null,
              Status: '',
              Outside: 0,
              OutsideAmount: 0,
              Stock: 0,
              OutsideType: 0,
              StockAmount: 0,
              FeeType: 0,
              ManagerName: '',
              ManagerFee: 0,
              ManagerSchedule: 0,
              AdvisorFeeType: 0,
              AdvisorName: '',
              AdvisorFee: 0,
              AdvisorSchedule: 0,
              Broker: 0,
              Model1: 0,
              Model2: 0,
              Model3: 0,
              Model4: 0,
              Model5: 0,
              Model6: 0,
              AdvisorID: this.$store.state.user.id,
              Created: new Date().toISOString().slice(0, 10),
              PlanID: this.planId,
              SafeHarbor: 0,
              ETF: 0,
              WaiveFee1: false,
              WaiveFee2: false,
              AncillaryFee: false,
              ExcludeSummary: true,
              PBSAdvisor: false,
              PBSAdmin: false,
              PBSRecordkeeping: false,
              PBSCustodian: false,
              FiduciaryStatus: '',
              TPAName: '',
              TPARKFee: 0,
              TPARKSchedule: 0,
              TrusteeFee: 0,
              TrusteeSchedule: 0,
              ProviderType: 0,
              ProviderName: '',
              ProviderFee: 0,
              ProviderSchedule: 0,
              ProviderPercent: 0,
              ProviderDollar: 0,
              ManagerPercent: 0,
              ManagerDollar: 0,
              AdvisorPercent: 0,
              AdvisorDollar: 0,
              ExpensePercent: 0,
              ExpenseDollar: 0,
              PCSAdminDollar: 0,
              TPAAdminDollar: 0,
              TPARKDollar: 0,
              TrusteeDollar: 0,
              AdminFiduciary: 0,
              SUB: '',
              TPA: '',
              EstimatedPercent: 0,
              EstimatedDollar: 0,
              ConversionFeeShow: false,
              ConversionFeeText: '',
              DocumentFeeShow: false,
              DocumentFeeText: '',
              AboutTPA: false,
              AboutTPAName: '',
              AboutTPADescription: '',
              HidePresentation: false,
              MML: 0,
              IMType: 0,
              Delegation: false,
              PriceStatus: '',
              PricedEmail: '',
              PriceEmailDate: new Date().toISOString().slice(0, 10),
              BundledPricing: 0,
              PriceNotes: '',
              ElectronicOnly: false,
              AdvisorNotes: '',
              ElectronicDate: new Date().toISOString().slice(0, 10),
              illiquid: '',
              HCAddr1: '',
              HCAddr2: '',
              HCCityStateZip: '',
              ParticACCT: 0,
              PresentedByID: 0,
              EmployerCity: '',
              EmployerState: '',
              EmployerZip: '',
              CPlanProvider: '',
              CurrentPlanPricing: '',
              DefaultPricedEmail: '',
              inRPEA: false,
              ApprovedPartic: 0,
              ApprovedAssets: 0,
              ApprovedParticAcct: 0,
              numHardCopies: 0,
              HardCopyNeeded: new Date().toISOString().slice(0, 10),
              EAddress2: '',
              SCITY: '',
              SPHONE: '',
              SSTATE: '',
              ZIPCODE: '',
              SSIGNATOR: '',
              ContactFirstName: '',
              ContactLastName: '',
              PresCity: '',
              PresState: '',
              PresZip: '',
              AdvisorExpPages: '',
              GIC_SV: '',
              FiduciaryServicesProgram: 0,
              TPAFeeType: 1,
              TPAFee: 0,
              AnnualRecordkeeping: false,
              BDPlatformFee: 0,
              BDPlatFormPercent: 0,
              BDPlatFormDollar: 0,
              TPAAdminPercent: 0,
              TPARKPercent: 0,
              TrusteePercent: 0,
              MutualFundOffsetDollar: 0,
              MutualFundOffsetPercent: 0,
              ESPType: 'Single Employer Plan',
              AllowInvestmentManager: true,
              AllowFinancialAdvisor: true
            }
          }
          this.ancillaryFee = this.proposalPlan.AncillaryFee
          this.excludeSummary = this.proposalPlan.ExcludeSummary
          this.serviceType = this.proposalPlan.ServiceType ? this.proposalPlan.ServiceType : 0
          this.tpa = this.proposalPlan.TPA ? this.proposalPlan.TPA : ''
          this.serviceType = this.proposalPlan.MML ? this.proposalPlan.MML : 0
          if (val) {
            if (this.$refs.modelFund) this.$refs.modelFund.callProposalMethod()
          }
        })
      }
    },
    async saveProposal(val, proposalPlan) {
      if (val) {
        this.selectedPlan.Strategist = this.strategist
        await this.$axios.put(`/api/v1/tal/proposal/savestrategist?strategist=${this.strategist}&planId=${this.planId}`)
      }
      var proposalValue = {}
      if (this.planType.trim() === this.$authz.planType.Simple_IRA_Plan_Proposal) {
        proposalValue = val ? this.proposalPlan : proposalPlan
        var cityStateZip = proposalValue.CityStateZip
        var city = ''
        var state = ''
        var zip = ''
        if (cityStateZip) {
          cityStateZip = cityStateZip.trim()
          var comma = cityStateZip.indexOf(',')
          city = cityStateZip.slice(0, comma)
          var after = cityStateZip.substring(comma + 2)
          var space = after.lastIndexOf(' ')
          state = after.slice(0, space)
          zip = after.substring(space + 1)
        }

        var simpleIRARequest = {
          PlanID: this.planId,
          SNAME: proposalValue.SNAME,
          PNAME: proposalValue.PNAME,
          DCPTYPE: proposalValue.DCPTYPE,
          SEINPNO: proposalValue.SEINPNO,
          AsofDate: proposalValue.YEAREND ? proposalValue.YEAREND : '2021-12-31T00:00:00',
          SSTREET: proposalValue.SSTREET,
          ZipCode: zip ? zip.trim() : '',
          City: city ? city.trim() : '',
          State: state ? state.trim() : '',
          EstimatedFirstYearContributions: proposalValue.TOTASSETS,
          GroupId: this.groupId ? this.groupId : 0,
          Strategist: this.strategist ? this.strategist : this.selectedPlan.Strategist,
          PlanLeadId: this.planLeadID,
          Employees: proposalValue.PARTIC
        }
        await this.$axios.put(`/api/v1/plan/saveSimpleIRADetails`, simpleIRARequest)
      }
    },
    //method for Autosave as well as validation check
    async validateReportTypes() {
      var promises = []
      this.$toast?.destroy()
      if (this.reports === 'Proposal') {
        var isStrategistListValid = true
        isStrategistListValid = this.$refs.modelFund.validateModelFundList()
        if (!isStrategistListValid) {
          this.step2Error = true
          this.$scrollTo('#step2')
          this.validationIssue = true
        }
        if (isStrategistListValid) this.validationIssue = false

        if (this.validationIssue) return false

        this.step1Error = false
        this.step2Error = false
        this.validationIssue = false
        promises.push(this.$refs.planInformation.saveInformation(false))
        promises.push(this.$refs.modelFund.saveProposalHoldings())
        if (promises.length > 0) await Promise.all(promises)
        return true
      }
    },
    exportToExcel() {
      var xlHeaders = []
      var planResult = []
      var selected = []
      selected.push(this.selectedPlan)
      xlHeaders = this.ExportPlan(selected)
      planResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, planResult, 'Plan')
      for (var Xrow = 2; Xrow !== xlHeaders.length + 2; ++Xrow) {
        this.currencyConvert(wb, 'O', Xrow)
        this.currencyConvert(wb, 'Q', Xrow)
        this.currencyConvert(wb, 'R', Xrow)
        this.currencyConvert(wb, 'S', Xrow)
        this.currencyConvert(wb, 'T', Xrow)
        this.currencyConvert(wb, 'U', Xrow)
        this.percentConvert(wb, 'V', Xrow)
        this.percentConvert(wb, 'W', Xrow)
        this.currencyConvert(wb, 'X', Xrow)
        this.currencyConvert(wb, 'Y', Xrow)
        this.percentConvert(wb, 'Z', Xrow)
        this.currencyConvert(wb, 'AB', Xrow)
        this.currencyConvert(wb, 'AC', Xrow)
        this.currencyConvert(wb, 'AD', Xrow)
        this.currencyConvert(wb, 'AE', Xrow)
        this.currencyConvert(wb, 'AF', Xrow)
        this.percentConvert(wb, 'AG', Xrow)
        this.percentConvert(wb, 'AK', Xrow)
        this.percentConvert(wb, 'AL', Xrow)
        this.percentConvert(wb, 'AR', Xrow)
      }
      XLSX.writeFile(wb, 'Plan.xlsx')
    },
    currencyConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Plan'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    },
    percentConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Plan'][xlColRef + xlRowNum], '0.0000%')
    },
    ExportPlan(plans) {
      var xlHeaders = plans.map((rec) => {
        return {
          'Plan Name': rec.PNAME,
          'EIN#': rec.SEINPNO,
          //'EIN#': rec.sp_fedid,
          Company: rec.SNAME,
          Street: rec.SSTREET,
          City: rec.SCITY,
          State: rec.SSTATE,
          Zip: rec.ZIPCODE,
          Phone: rec.SPHONE,
          'Admin First Name': rec.AFIRSTNAME,
          'Admin Last Name': rec.ALASTNAME,
          'First Name': rec.FIRSTNAME,
          'Last Name': rec.LASTNAME,
          'Type of Plan': rec.DCPTYPE,
          'Plan is Collectively Bargained': rec.BARGAINED,
          'Total Plan Assets': rec.TOTASSETS,
          'Active Participants': rec.ACTPARTIC,
          'Average Account Balance': rec.AVEACCTBAL,
          'Average Participant Account Balance': rec.AVEPARTICBAL ? parseFloat(rec.AVEPARTICBAL.toFixed(0)) : 0,
          // rec.AVEPARTICBAL.toFixed(0),
          'Total Contributions': rec.TOTCONTRIB,
          'Average Participant Contribution': rec.PARTAVG ? parseFloat(rec.PARTAVG.toFixed(0)) : 0,
          'Average Employer Contribution': rec.EMPLYRAVG ? parseInt(rec.EMPLYRAVG.toFixed(0)) : 0,
          'Asset Growth': rec.GROWTH ? parseFloat(rec.GROWTH.toFixed(4)) : 0,
          'Return On Investment': rec.RETURN ? parseFloat(rec.RETURN.toFixed(4)) : 0,
          'Broker Commissions': rec.COMMISS ? parseFloat(rec.COMMISS.toFixed(0)) : 0,
          'Broker Fees': rec.FEES ? parseFloat(rec.FEES.toFixed(0)) : 0,
          'Broker %': rec.BROKERPCT ? parseFloat(rec.BROKERPCT.toFixed(4)) : 0,
          'Admin Expense': rec.EXPADMIN,
          'Other Expense': rec.EXPOTHER,
          'Professional Expense': rec.EXPPROFFEE,
          'Advisor Expense': rec.EXPINVADV,
          'Total Plan Expense': rec.EXPTOTPLN,
          'Total Admin Expense': rec.EXPTOTADM,
          'Total Admin Expense %': rec.EXPTOTADMPCT ? parseFloat(rec.EXPTOTADMPCT.toFixed(4)) : 0,
          Industry: rec.BUSCODE,
          'Plan Year End': rec.YEAREND,
          'Final Report': rec.FINAL === 0 ? true : false,
          'Loans as % of Plan Assets': rec.PARTLOANS ? parseFloat(rec.PARTLOANS.toFixed(4)) : 0,
          'Certain Deemed and/or Corrective Distributions': rec.DISTRB ? parseFloat(rec.DISTRB.toFixed(4)) : 0,
          'Audit Reported': rec.OPINIONTYP,
          'Failed to Transmit Participant Contributions': rec.TRANSMIT,
          'Plan Not Covered by Fidelity Bond': rec.FDLTYBDIND,
          'Plan Had Nonexempt Transactions': rec.NONEXEMPT,
          'Loss Due to Fraud/Dishonesty': rec.LOSS,
          'Revenue Share as % of Plan Assets': rec.REVENUE ? parseFloat(rec.REVENUE.toFixed(4)) : 0,
          Broker: rec.BROKER,
          'Service Provider': rec.PROVIDER,
          'Insurance Carrier': rec.INSCARRIER,
          'Estimated 1st Year Contribution': rec.estimatedAnnualContributions,
          Strategist: rec.Strategist
        }
      })
      return xlHeaders
    },
    cancelChanges(val) {
      if (this.reports === 'Proposal') {
        if (val === '1') {
          if (this.$refs.planInformation) this.$refs.planInformation.abondonProposalPlanInfo()
          this.showFirstStepper = false
          this.step1Error = false
        }
        if (val === '2') {
          if (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.PCS_Aspire_Product__c,
              this.$authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            if (this.$refs.modelFund) {
              this.$refs.modelFund.fundDialog = false
              this.$refs.modelFund.abondonInvestment()
            }
          }
          this.step2Error = false
          this.showSecondStepper = false
        }
      }
    },
    async saveStepper(val) {
      var savePromises = []
      this.saveLoading = true
      this.$toast?.destroy()
      if (this.reports === 'Proposal') {
        if (val === '1') {
          var isplanInformationValid = this.$refs.planInformation.validatePlanInformation()
          if (!isplanInformationValid) {
            this.step1Error = true
            this.saveLoading = false
            this.validationIssue = true
          } else {
            savePromises.push(this.$refs.planInformation.saveInformation(true))
            await Promise.all(savePromises)
          }
        }
        if (val === '2') {
          var isStrategistListValid = true
          if (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.PCS_Aspire_Product__c,
              this.$authz.pcsAspireProduct.Multi_Strategist_Product
            )
          ) {
            isStrategistListValid = this.$refs.modelFund.validateModelFundList()
          }
          if (!isStrategistListValid) {
            this.step2Error = true
            this.validationIssue = true
            this.saveLoading = false
            return
          } else {
            await this.$refs.modelFund.saveProposalHoldings()
            await this.saveProposal(true, this.proposalPlan)
            this.validationIssue = false
            this.step2Error = false
            this.saveLoading = false
            this.showSecondStepper = false
          }
        }
      }
    },
    async savePlanInfo(val, proposalPlan) {
      this.removeParam()
      await this.saveProposal(false, proposalPlan)
      this.validationIssue = false
      this.step1Error = false
      this.saveLoading = false
      this.showFirstStepper = false
      if (proposalPlan.DCPTYPE !== this.$authz.planType.Simple_IRA_Plan_Proposal) {
        let seinpno = proposalPlan.SEINPNO ? proposalPlan.SEINPNO : 'startup'
        this.$router.push({
          name: 'TALPlan',
          params: { id: seinpno, planType: proposalPlan.DCPTYPE },
          query: {
            reportOption: 'Proposal',
            planId: this.planId,
            planLeadId: this.planLeadID
          }
        })
      } else {
        this.GetProposalPlan(false)
      }
    }
  }
}
</script>
<style>
.hr_border_plan {
  max-width: 72% !important;
}
.hr_border_mobile {
  max-width: 80% !important;
}
.background_transparent {
  background: transparent !important;
}
.stepers_div .v-stepper__label {
  width: 100% !important;
}
.createReport .v-input__slot {
  background: rgb(var(--v-theme-accent)) !important;
  cursor: pointer !important;
}
.createProposalReport .v-input__slot {
  background: rgb(var(--v-theme-accent)) !important;
  cursor: default !important;
  padding-left: 30px;
}
.createReport label {
  color: white !important;
}
.createReport .v-select__selections {
  color: rgb(var(--v-theme-secondary)) !important;
}
.createProposalReport .v-select__selections {
  color: rgb(var(--v-theme-secondary)) !important;
  padding-left: 30px;
}
.createReport .v-select-list .v-list-item--active {
  background-color: rgb(var(--v-theme-accent)) !important;
}
.border_radius_2 {
  border-radius: 2px !important;
}

.alignStepper {
  margin-left: 36px !important;
  border-left: solid 1px rgb(var(--v-theme-accent)) !important;
}
.alignGreyStepper {
  margin-left: 36px !important;
  border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.stepper_main .v-stepper__step__step {
  border: solid 1px rgb(var(--v-theme-accent)) !important;
  color: rgb(var(--v-theme-accent)) !important;
  background: white !important;
}
.stepper_main .v-stepper__step--active .v-stepper__step__step {
  background: rgb(var(--v-theme-accent)) !important;
  color: white !important;
}
.step_error .v-stepper__step--active .v-stepper__step__step {
  background: red !important;
  color: white !important;
  border: solid red !important;
}
.step_error .stepred .v-stepper__step__step {
  background: red !important;
  color: white !important;
  border: solid red !important;
}
.step_error .v-stepper__step__step {
  border: solid 1px rgb(var(--v-theme-accent)) !important;
  color: rgb(var(--v-theme-accent)) !important;
  background: white !important;
}
.createReport .v-menu__content {
  overflow-y: hidden !important;
}
.plantabs .v-tabs__item {
  text-transform: uppercase !important;
}
/* .plantabs .addpadding {
  padding-left: 15px !important;
  padding-right: 15px !important;
} */
.plantabs .v-tabs__container {
  height: 45px !important;
}
.assign_darkMode_color {
  background-color: #424242 !important;
}
.maxHeight {
  height: 250px !important;
}
</style>
<style scoped>
.theme--light.v-stepper--vertical .v-stepper__content:last-child,
.no_border {
  border-left: 0px solid rgba(0, 0, 0, 0.12) !important;
}

.dark_bg {
  background: #303030;
}
</style>
