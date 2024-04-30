<template>
  <v-flex v-if="showPreviewDialog" xs12 lg12 pt-16 pb-12 class="justify-center">
    <v-dialog
      v-model="showPreviewDialog"
      persistent
      class="elevation-3"
      :class="dialogPositionNew"
      :content-class="dialogPositionNew"
      scrollable
      :eager="true"
      :max-width="dialogWidth"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <v-row>
            <v-flex xl11 lg11 sm11 md11 xs11 class="align-self text-center font_14 text-uppercase text-secondary">
              Preview
            </v-flex>
            <v-flex xl1 lg1 sm1 md1 xs1 class="text-right">
              <v-icon color="accent" @click="closePreviewDialog()">close</v-icon>
            </v-flex>
          </v-row>
        </v-card-title>
        <v-card-text :class="$vuetify.breakpoint.xs ? 'pa-2' : 'px-2 py-0'">
          <v-row class="justify-center">
            <v-flex xs12 lg9 class="justify-center">
              <v-flex xs12 class="text-center text-uppercase">
                <h1>Master Retirement Plan Services Application</h1>
              </v-flex>
              <div class="container pa-0" v-if="loader">
                <v-card :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
                  <Loader :loadingText="`Loading..`" :loading="loader" />
                </v-card>
              </div>
              <div v-if="!loader">
                <v-flex xs12 class="text-center py-4">
                  <h3>(For Tax-Qualified Defined Contribution Plans)</h3>
                </v-flex>
                <v-flex xs12>
                  <h3>
                    This Master Retirement Plan Services Application ("Application") is submitted bu the client/plan sponsor
                    identified below
                  </h3>
                  <h3>
                    ("client" or "you"), an entity or individual that has the authority to bind the retirement plan identified
                    below("Plan") to the terms
                  </h3>
                  <h3>
                    of this application and the enclosed agreements ("Agreements"), to PCS Retirement, LLC ("PCS"), a provider of
                  </h3>
                  <h3>
                    recordkeeping and administration services for a wide variety of employee benefit plans, and AdvisorTrust, Inc
                  </h3>
                  <h3>("AdvisorTrust") South Dakota chartered trust company, regarding the provision of services to the Plan.</h3>
                </v-flex>
                <v-flex>
                  <div class="text-h6 pb-1 pt-2 align-self"><b>1. Advisor Information</b> (Plan Sponsor Information)</div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Name of Client: {{ firstName + ' ' + lastName }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Email: {{ email }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">CRD: {{ crd }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Rep Code: {{ repCode }}</v-flex>
                </v-flex>
                <v-flex>
                  <div class="text-h6 pb-1 pt-2 align-self"><b>2. Plan Information</b></div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Plan Type: {{ planType }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Plan Name: {{ legalPlanName }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Plan Number: {{ planNumber }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Effective Date: {{ effectiveDate }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Assets: {{ assets }}</v-flex>
                </v-flex>
                <v-flex v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'">
                  <div class="text-h6 pb-1 pt-2 align-self"><b>3. Provider Information</b></div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Company Information: {{ companyInformation }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Address: {{ streetAddress }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1"
                    >City, State, Zip: {{ city ? city + ',' : '' }} {{ state ? state + ',' : '' }}{{ zipCode }}</v-flex
                  >
                  <v-flex xs12 class="flexClass pa-2 mb-1">Outside TPA: {{ outSideTPA }}</v-flex>
                </v-flex>
                <v-flex v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'">
                  <div class="text-h6 pb-1 pt-2 align-self"><b>4. Current TPA Information</b></div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Company Information: {{ tpaCompanyInformation }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Address: {{ tpaStreetAddress }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1"
                    >City, State, Zip: {{ tpaCity ? tpaCity + ',' : '' }} {{ tpaState ? tpaState + ',' : ''
                    }}{{ tpaZipCode }}</v-flex
                  >
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>5. Account Holder Information</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>3. Account Holder Information</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Name: {{ firstName1 + ' ' + lastName1 }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Email: {{ email1 }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Date of Birth: {{ birthDate }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Social Security Number: {{ ssn }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Date of Hire: {{ hireDate }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Phone: {{ phone }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Is Account Holder Owner: {{ isOwner }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Percentage Owned: {{ percentageOwned }}</v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>6. Controlled or Affiliated Service Group Status</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>4. Controlled or Affiliated Service Group Status</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Group Name: {{ groupName }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Legal Name: {{ legalName }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Address: {{ groupStreetAddress }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1"
                    >City, State, Zip: {{ groupCity ? groupCity + ',' : '' }} {{ groupState ? groupState + ',' : ''
                    }}{{ groupZipCode }}</v-flex
                  >
                  <v-flex xs12 class="flexClass pa-2 mb-1">Federal Tax ID: {{ federalTaxId }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Fiscal Year-End: {{ fiscalYearEnd }}</v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>7. Company Information</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>5. Company Information</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Company Name: {{ companyName }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Address: {{ companyStreetAddress }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1"
                    >City, State, Zip: {{ companyCity ? companyCity + ',' : '' }} {{ companyState ? companyState + ',' : ''
                    }}{{ companyZipCode }}</v-flex
                  >
                  <v-flex xs12 class="flexClass pa-2 mb-1">EIN: {{ ein }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Fiscal Year-End: {{ companyfiscalYearEnd }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Type of Entity: {{ entity }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Business Code: {{ businessCode }}</v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>8. Other Retirement Plans</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>6. Other Retirement Plans</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Other Retirement Plans: {{ otherRetirementPlans }}</v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>9. Client Product</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>7. Client Product</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Client Product: {{ clientProduct }}</v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>10. Selected Investment</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>8. Selected Investment</b>
                  </div>
                  <v-flex xs12 v-for="(item, index) in investmentData" :key="index">
                    <v-flex xs12 class="flexClass pa-2 mb-1">Name: {{ item.FundName }}</v-flex>
                    <v-flex xs12 class="flexClass pa-2 mb-1">Percentage: {{ item.Percent }}</v-flex>
                  </v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>11. Fund Contributions</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>9. Fund Contributions</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Contributions funded to the plan: {{ typeContribution }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Frequency Setup: {{ frequencySetup }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Total Contributions: {{ totalContribution }}</v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>12. Additional Account Holders</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>10. Additional Account Holders</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Is Additional Account Holders: {{ additionalAccountHolder }}</v-flex>
                </v-flex>
                <v-flex>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Conversion'"
                  >
                    <b>13. Plan Contact - Authorized Signer</b>
                  </div>
                  <div
                    class="text-h6 pb-1 pt-2 align-self"
                    v-if="$store.state.soloKOpenAccountDetail.PlanInformation.PlanType === 'Start-up'"
                  >
                    <b>11. Plan Contact - Authorized Signer</b>
                  </div>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Name: {{ planContactName }}</v-flex>
                  <v-flex xs12 class="flexClass pa-2 mb-1">Email: {{ planContactEmail }}</v-flex>
                </v-flex>
                <v-row justify="center mt-4 mb-4">
                  <v-flex class="flex_none" :class="$vuetify.breakpoint.xs ? '' : 'mr-3'">
                    <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="finishAndDownload()"
                      >Finish</v-btn
                    >
                  </v-flex>
                  <v-flex class="align-self flex_none" :class="$vuetify.breakpoint.xs ? '' : 'ml-3'">
                    <v-btn
                      class="text-capitalize"
                      variant="outlined"
                      :color="$vuetify.theme.dark ? '' : 'accent'"
                      @click="closePreviewDialog()"
                      >Cancel</v-btn
                    >
                  </v-flex>
                </v-row>
              </div>
            </v-flex>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-flex>
</template>
<script>
import Loader from '@/components/NewLoader'
export default {
  data() {
    return {
      valid: false,
      loader: false,
      firstName: '',
      lastName: '',
      email: '',
      crd: '',
      repCode: '',
      planType: '',
      legalPlanName: '',
      planNumber: '',
      effectiveDate: '',
      assets: '',
      providerName: '',
      companyInformation: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      outSideTPA: '',
      tpaCompanyInformation: '',
      tpaStreetAddress: '',
      tpaCity: '',
      tpaState: '',
      tpaZipCode: '',
      firstName1: '',
      lastName1: '',
      email1: '',
      birthDate: '',
      ssn: '',
      hireDate: '',
      phone: '',
      isOwner: '',
      percentageOwned: '',
      groupName: '',
      legalName: '',
      groupStreetAddress: '',
      groupCity: '',
      groupState: '',
      groupZipCode: '',
      federalTaxId: '',
      fiscalYearEnd: '',
      companyName: '',
      companyStreetAddress: '',
      companyCity: '',
      companyState: '',
      companyZipCode: '',
      ein: '',
      companyfiscalYearEnd: '',
      entity: '',
      businessCode: '',
      otherRetirementPlans: '',
      clientProduct: '',
      investmentData: [],
      typeContribution: '',
      frequencySetup: '',
      totalContribution: '',
      additionalAccountHolder: '',
      planContactName: '',
      planContactEmail: ''
    }
  },
  components: {
    Loader
  },
  props: ['value'],
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.firstName =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.FirstName
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.FirstName
          : ''
      this.lastName =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.LastName
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.LastName
          : ''
      this.email =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.Email
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.Email
          : ''
      this.crd =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.CRD
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.CRD
          : ''
      this.repCode =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.RepCode
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.RepCode
          : ''

      this.planType =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanType
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanType
          : ''
      this.legalPlanName =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.LegalPlanName
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.LegalPlanName
          : ''
      this.planNumber =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanNumber
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanNumber
          : ''
      this.effectiveDate =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.EffectiveDate
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.EffectiveDate
          : ''
      this.assets =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.Assets
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.Assets
          : ''

      this.providerName =
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation &&
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.CurrentProviderName
          ? this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.CurrentProviderName
          : ''
      this.companyInformation =
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation &&
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.CompanyInformation
          ? this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.CompanyInformation
          : ''
      this.streetAddress =
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation &&
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.StreetAddress
          ? this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.StreetAddress
          : ''
      this.city =
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation &&
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.City
          ? this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.City
          : ''
      this.state =
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation &&
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.State
          ? this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.State
          : ''
      this.zipCode =
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation &&
        this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.ZipCode
          ? this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation.ZipCode
          : ''
      this.outSideTPA = this.$store.state.soloKOpenAccountDetail.OutSideTPA
        ? this.$store.state.soloKOpenAccountDetail.OutSideTPA
        : ''
      this.tpaCompanyInformation =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA &&
        this.$store.state.soloKOpenAccountDetail.CurrentTPA.CompanyInformation
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.CompanyInformation
          : ''
      this.tpaStreetAddress =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.StreetAddress
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.StreetAddress
          : ''
      this.tpaCity =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.City
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.City
          : ''
      this.tpaState =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.State
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.State
          : ''
      this.tpaZipCode =
        this.$store.state.soloKOpenAccountDetail.CurrentTPA && this.$store.state.soloKOpenAccountDetail.CurrentTPA.ZipCode
          ? this.$store.state.soloKOpenAccountDetail.CurrentTPA.ZipCode
          : ''

      this.firstName1 =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FirstName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FirstName
          : ''
      this.lastName1 =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LastName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LastName
          : ''
      this.email1 =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Email
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Email
          : ''
      this.ssn =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.SocialSecurityNumber
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.SocialSecurityNumber
          : ''
      this.phone =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Phone
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.Phone
          : ''
      this.percentageOwned =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.PercentageOwned
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.PercentageOwned
          : 0
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfBirth
      ) {
        this.birthDate = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfBirth
      }
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfhire
      ) {
        this.hireDate = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.DateOfhire
      }
      if (
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.AccountHolderIsOwner
      ) {
        this.isOwner = this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.AccountHolderIsOwner ? 'Yes' : 'No'
      } else {
        this.isOwner = 'No'
      }
      this.groupName = this.$store.state.soloKOpenAccountDetail.GroupMode
        ? this.$store.state.soloKOpenAccountDetail.GroupMode
        : ''
      this.legalName =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LegalName
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.LegalName
          : ''
      this.groupStreetAddress =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.StreetAddress
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.StreetAddress
          : ''
      this.groupCity =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.City
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.City
          : ''
      this.groupState =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.State
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.State
          : ''
      this.groupZipCode =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.ZipCode
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.ZipCode
          : ''
      this.federalTaxId =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FedaralTaxId
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FedaralTaxId
          : ''
      this.fiscalYearEnd =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FiscalYearEnd
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.FiscalYearEnd
          : ''
      this.companyName =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessInformationName
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessInformationName
          : ''
      this.companyStreetAddress =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessStreetAddress
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessStreetAddress
          : ''
      this.companyCity =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCity
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCity
          : ''
      this.companyState =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessState
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessState
          : ''
      this.companyZipCode =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessZipCode
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessZipCode
          : ''
      this.ein =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.EmployerIdentificationNumber
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.EmployerIdentificationNumber
          : ''
      this.companyfiscalYearEnd =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.FiscalYearEnd
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.FiscalYearEnd
          : ''
      this.entity =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.TypeOfEntity
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.TypeOfEntity
          : ''
      this.businessCode =
        this.$store.state.soloKOpenAccountDetail.CompanyInformation &&
        this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCode
          ? this.$store.state.soloKOpenAccountDetail.CompanyInformation.BusinessCode
          : ''

      this.otherRetirementPlans = this.$store.state.soloKOpenAccountDetail.OtherRetirementPlans ? 'Yes' : 'No'
      this.clientProduct = this.$store.state.soloKOpenAccountDetail.ClientProductName
        ? this.$store.state.soloKOpenAccountDetail.ClientProductName
        : ''
      this.investmentData =
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation &&
        this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.InvestmentSelections
          ? this.$store.state.soloKOpenAccountDetail.AccountHolderInformation.InvestmentSelections
          : ''
      this.typeContribution =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.CheckSentByParticipant
          ? 'Check - Check sent by participant'
          : this.$store.state.soloKOpenAccountDetail.FundContributions.ACHTransferByPCSRetirement
            ? 'ACH transfer - initiated by PCS Retirement'
            : ''
      this.frequencySetup =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.FrequencySetupContributions
          ? 'Yes'
          : 'No'
      this.totalContribution =
        this.$store.state.soloKOpenAccountDetail.FundContributions &&
        this.$store.state.soloKOpenAccountDetail.FundContributions.TotalContribution
          ? this.$store.state.soloKOpenAccountDetail.FundContributions.TotalContribution
          : ''
      this.additionalAccountHolder = this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag
        ? this.$store.state.soloKOpenAccountDetail.AdditionalAccountFlag
        : ''
      this.planContactName =
        this.$store.state.soloKOpenAccountDetail.PlanContact && this.$store.state.soloKOpenAccountDetail.PlanContact.Name
          ? this.$store.state.soloKOpenAccountDetail.PlanContact.Name
          : ''
      this.planContactEmail =
        this.$store.state.soloKOpenAccountDetail.PlanContact && this.$store.state.soloKOpenAccountDetail.PlanContact.Email
          ? this.$store.state.soloKOpenAccountDetail.PlanContact.Email
          : ''
    }
  },
  computed: {
    showPreviewDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    dialogWidth() {
      if (this.$vuetify.breakpoint.xlOnly) return '55%'
      else if (this.$vuetify.breakpoint.lgOnly) return '70%'
      else return '90%'
    },
    dialogPositionNew() {
      if (!this.$store.state.user.temporarySessionType || this.$store.state.user.temporarySessionType !== 'Participant') {
        if (this.$vuetify.breakpoint.xlOnly) {
          return `dialogBigScreen`
        } else if (this.$vuetify.breakpoint.lgOnly) {
          return `dialoglgScreen`
        } else if (this.$vuetify.breakpoint.mdOnly) return `dialogMdScreen`
        else if (this.$vuetify.breakpoint.smOnly) return `dialogSmScreen`
        else return `dialoglgScreen`
      } else return 'auto'
    }
  },
  methods: {
    closePreviewDialog() {
      this.showPreviewDialog = false
    },
    finishAndDownload() {
      if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
        var soloKRequest = {
          AdvisorInformation: this.$store.state.soloKOpenAccountDetail.AdvisorInformation,
          PlanInformation: this.$store.state.soloKOpenAccountDetail.PlanInformation,
          ClientProduct: this.$store.state.soloKOpenAccountDetail.ClientProduct,
          CurrentProviderInformation: this.$store.state.soloKOpenAccountDetail.CurrentProviderInformation,
          OutSideTPA: this.$store.state.soloKOpenAccountDetail.OutSideTPA === 'Yes' ? 1 : 0,
          CurrentTPA: this.$store.state.soloKOpenAccountDetail.CurrentTPA,
          CompanyInformation: this.$store.state.soloKOpenAccountDetail.CompanyInformation,
          AccountHolderInformation: this.$store.state.soloKOpenAccountDetail.AccountHolderInformation,
          AccountHolderInformation1: this.$store.state.soloKOpenAccountDetail.AccountHolderInformation1,
          AccountHolderInformation2: this.$store.state.soloKOpenAccountDetail.AccountHolderInformation2,
          AccountHolderInformation3: this.$store.state.soloKOpenAccountDetail.AccountHolderInformation3,
          PlanContact: this.$store.state.soloKOpenAccountDetail.PlanContact,
          OtherRetirementPlans: this.$store.state.soloKOpenAccountDetail.OtherRetirementPlans,
          FundContributions: this.$store.state.soloKOpenAccountDetail.FundContributions,
          PaperandEStatements: this.$store.state.soloKOpenAccountDetail.PaperandEStatements,
          EStatements: this.$store.state.soloKOpenAccountDetail.EStatements,
          FeeScheduleTier: this.$store.state.soloKOpenAccountDetail.FeeScheduleTier
        }
        this.$axios.post(`/api/v1/sfdc/solok/submit`, soloKRequest).then(() => {
          this.closePreviewDialog()
          this.$emit('closePreviewDialog')
        })
      }
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
.flexClass {
  border-width: 1px;
  border-color: black;
  border-style: inset;
}
</style>
