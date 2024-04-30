<template>
  <v-col>
    <v-card
      class="mb-1 mt-1 elevation-6"
      :class="$vuetify?.breakpoint?.xs ? 'ml-1 mr-1' : $vuetify?.breakpoint?.smOnly ? 'ml-4 mr-4 ' : 'ml-6 mr-6'"
    >
      <v-col xs12>
        <v-row justify="center">
          <v-col xs12 class="justify-center">
            <v-row justify="center">
              <v-col xs12 sm11 lg8 class="text-center mb-2 mt-6">
                <v-row justify="center">
                  <h1 class="welcomeFont mb-2">Review your information before submitting</h1>
                  <h4>
                    Please review your application information to ensure it is correct. You can go back if you need to make
                    changes.
                  </h4>
                </v-row>
              </v-col>
            </v-row>
            <v-card
              class="rounded-0 mt-4 mb-4 elevation-0"
              :class="$vuetify?.breakpoint?.xs ? 'ml-2 mr-2' : $vuetify?.breakpoint?.smOnly ? 'ml-4 mr-4 ' : 'ml-8 mr-8'"
              style="border: 1px solid #d9d9d9"
            >
              <v-col>
                <v-row>
                  <v-col class="pa-4 xs12 sm4">
                    <v-row>
                      <v-col xs10 class="text-left">
                        <h3><b>Legal Name & Contact</b></h3>
                      </v-col>
                      <v-col xs2 class="text-right">
                        <v-icon size="18" color="#0077CC" @click="editFlow(2)"> fas fa-edit </v-icon>
                      </v-col>
                    </v-row>
                    <v-col pt-1 class="text-left">
                      <h3>{{ firstName + ' ' + middleName + ' ' + lastName }}{{ ' (' + martialStatus + ')' }}</h3>
                    </v-col>
                    <v-col pt-3 class="text-left">
                      <h3>{{ email }}</h3>
                      <h3>{{ phone ? formatPhoneNumber(phone) : '' }}</h3>
                    </v-col>
                    <v-col pt-3 class="text-left">
                      <h3>{{ streetAddress }}</h3>
                      <h3>{{ city + ', ' + getStateCode(state) + zipCode }}</h3>
                    </v-col>
                  </v-col>
                  <v-divider v-if="$vuetify?.breakpoint?.xs" class="mx-1" />
                  <v-divider v-if="!$vuetify?.breakpoint?.xs" vertical />
                  <v-col class="pa-4 xs12 sm4">
                    <v-row>
                      <v-col xs10 class="text-left">
                        <h3><b>Identification</b></h3>
                      </v-col>
                      <v-col xs2 class="text-right">
                        <v-icon size="18" color="#0077CC" @click="editFlow(2)"> fas fa-edit </v-icon>
                      </v-col>
                    </v-row>
                    <v-col pt-1 class="text-left">
                      <h3 v-if="birthDate">DOB: {{ birthDate ? formatDate(birthDate) : '' }}</h3>
                      <h3 v-if="ssn">SSN: {{ ssn ? formatSocialSecurity(ssn) : '' }}</h3>
                    </v-col>
                    <v-col pt-3 class="text-left">
                      <h3 v-if="residency">
                        {{ `${residency} Resident` }}
                      </h3>
                      <h3 v-if="citizenship">
                        {{ `${citizenship} Citizen` }}
                      </h3>
                    </v-col>
                    <v-col pt-3 class="text-left">
                      <h3>{{ `${driverLicense}# ${document}` }}</h3>
                      <h3>{{ placeOfIssuance }}</h3>
                      <h3 v-if="expirationDate">Expires: {{ expirationDate ? formatDate(expirationDate) : '' }}</h3>
                    </v-col>
                  </v-col>
                  <v-divider v-if="$vuetify?.breakpoint?.xs" class="mx-1" />
                  <v-divider v-if="!$vuetify?.breakpoint?.xs" vertical />
                  <v-col class="pa-4 xs12 sm4">
                    <v-row>
                      <v-col xs10 class="text-left">
                        <h3><b>Employment</b></h3>
                      </v-col>
                      <v-col xs2 class="text-right">
                        <v-icon size="18" color="#0077CC" @click="editFlow(3)"> fas fa-edit </v-icon>
                      </v-col>
                    </v-row>
                    <v-col v-if="!showPlanName" pt-1 class="text-left">
                      <h3>{{ schoolDistrict }}</h3>
                      <h3>{{ school }}</h3>
                    </v-col>
                    <v-col v-if="showPlanName" pt-1 class="text-left">
                      <h3>{{ planName && planName.length > 0 ? planName[0].PlanSponsor : '' }}</h3>
                    </v-col>
                    <v-col pt-3 class="text-left">
                      <h3>{{ occupation }}</h3>
                    </v-col>
                    <v-col pt-3 class="text-left">
                      <h3 v-if="hireDate">Hired: {{ hireDate ? formatDate(hireDate) : '' }}</h3>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider />
              <v-col class="pa-4 sm12">
                <v-row>
                  <v-col xs11 class="text-left">
                    <h3><b>Investment Portfolio</b></h3>
                  </v-col>
                  <v-col xs1 class="text-right">
                    <v-icon size="18" color="#0077CC" @click="editFlow(4)"> fas fa-edit </v-icon>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider />
              <v-col class="mb-4 sm12">
                <v-data-table
                  :headers="headers"
                  density="compact"
                  item-key="Symbol"
                  :height="investmentsList.length > 8 ? '320px' : ''"
                  :items="investmentsList"
                  class="elevation-0 reviewTable"
                  mobile-breakpoint="0"
                  :hide-default-footer="true"
                  :fixed-header="!$vuetify?.breakpoint?.xs"
                  :hide-default-header="$vuetify?.breakpoint?.xs"
                  :disable-pagination="true"
                  style="backface-visibility: hidden"
                  :loading="loadingFund"
                  loader-height="2"
                >
                  <template #item="{ item }">
                    <tr v-if="!$vuetify?.breakpoint?.xs">
                      <td v-if="item.Type === 'Fund'">
                        <span :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">
                          {{ item.Symbol ? item.Symbol : '' }}</span
                        >
                      </td>
                      <td v-else>
                        <span :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">
                          {{ item.ModelFundsListID ? item.ModelFundsListID : '' }}</span
                        >
                      </td>
                      <td>
                        <v-tooltip location="bottom">
                          <template #activator="{ props }">
                            <span :class="!$vuetify?.theme.dark ? '' : 'text-white'" v-bind="props">{{ item.Name }}</span>
                          </template>
                          <span>{{ item.Name }}</span>
                        </v-tooltip>
                      </td>
                      <td class="text-right">{{ formatPercent(item.OneYearYeild) }}%</td>
                      <td class="text-right">{{ formatPercent(item.ThreeYearYeild) }}%</td>
                      <td class="text-right">{{ formatPercent(item.FiveYearYeild) }}%</td>
                      <td class="text-right">{{ formatPercent(item.Total) }}%</td>
                      <td class="text-right">{{ formatPercent(item.ElectionPercentage) }}%</td>
                    </tr>
                    <tr v-else>
                      <td class="pr-3 pl-3">
                        <v-row>
                          <v-col xs12 class="pb-1">
                            <h5 class="pt-1">
                              <span class="text-grey">Symbol/ID</span>
                            </h5>
                            <h4 v-if="item.Type === 'Fund'" class="text-capitalize">
                              <a target="_blank" class="cursor-pointer" @click="getFundDetail(item.Symbol)">
                                <span
                                  :class="!$vuetify?.theme.dark ? 'text-hyperlink cursor-pointer' : 'text-white cursor-pointer'"
                                >
                                  {{ item.Symbol ? item.Symbol : '' }}</span
                                >
                                <v-icon
                                  v-if="item.Symbol"
                                  size="18"
                                  class="icon-modal-light cursor-pointer"
                                  :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                                />
                              </a>
                            </h4>
                            <h4 v-else class="text-capitalize">
                              <span :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">
                                {{ item.ModelFundsListID ? item.ModelFundsListID : '' }}</span
                              >
                            </h4>
                          </v-col>
                          <v-col xs12 class="pb-1">
                            <h5 class="pt-1">
                              <span class="text-grey">Name</span>
                            </h5>
                            <h4 class="text-uppercase">
                              {{ item.Name }}
                            </h4>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <h5 class="pt-1">
                              <span class="text-grey">1yr Yield</span>
                            </h5>
                            <h4>{{ formatPercent(item.OneYearYeild) }}%</h4>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <h5 class="pt-1">
                              <span class="text-grey">3yr Yield</span>
                            </h5>
                            <h4>{{ formatPercent(item.ThreeYearYeild) }}%</h4>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <h5 class="pt-1">
                              <span class="text-grey">5yr Yield</span>
                            </h5>
                            <h4>{{ formatPercent(item.FiveYearYeild) }}%</h4>
                          </v-col>
                          <v-col xs6 class="pb-1">
                            <h5 class="pt-1">
                              <span class="text-grey">Exp Ratio</span>
                            </h5>
                            <h4>{{ formatPercent(item.Total) }}%</h4>
                          </v-col>
                          <v-col xs6 class="pb-2">
                            <h5 class="pt-1">
                              <span class="text-grey">Allocation</span>
                            </h5>
                            <h4>{{ formatPercent(item.ElectionPercentage) }}%</h4>
                          </v-col>
                        </v-row>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
              <v-divider />
              <v-col class="sm12">
                <v-row>
                  <v-col xs12 sm6 lg6 class="pa-4">
                    <v-row class="pb-1">
                      <v-col xs10 class="text-left">
                        <h3><b>Beneficiaries</b></h3>
                      </v-col>
                      <v-col xs2 class="text-right">
                        <v-icon size="18" color="#0077CC" @click="editFlow(5)"> fas fa-edit </v-icon>
                      </v-col>
                    </v-row>
                    <v-col v-if="beneficiariesData.length === 0" class="text-left">
                      <h3>N/A</h3>
                    </v-col>
                    <v-col v-if="beneficiariesData.length > 0" class="text-left">
                      <v-col v-for="(item, index) in beneficiariesData" :key="index" class="xs12">
                        <v-col class="text-left">
                          <v-col class="text-capitalize">
                            <h2>{{ item.Name }}</h2>
                            <v-row>
                              <v-col xs12>
                                <h3>{{ item.BeneficiaryType + ' Beneficiary, ' + item.BeneficiaryPercent + '% share' }}</h3>
                                <h3>{{ item.BeneficiaryRelationship }}</h3>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-col>
                  <v-divider v-if="$vuetify?.breakpoint?.xs" class="mx-1" />
                  <v-divider v-if="!$vuetify?.breakpoint?.xs" vertical />
                  <v-col xs12 sm6 lg6 class="pa-4">
                    <v-row class="pb-1">
                      <v-col xs10 class="text-left">
                        <h3><b>Account Balance Transfers</b></h3>
                      </v-col>
                      <v-col xs2 class="text-right">
                        <v-icon size="18" color="#0077CC" @click="editFlow(6)"> fas fa-edit </v-icon>
                      </v-col>
                    </v-row>
                    <v-col v-if="transferBalanceData.length === 0" class="text-left">
                      <h3>N/A</h3>
                    </v-col>
                    <v-col v-if="transferBalanceData.length > 0" class="text-left">
                      <v-col v-for="(item, index) in transferBalanceData" :key="index" class="xs12">
                        <v-col class="text-left">
                          <v-col class="text-capitalize">
                            <h2>{{ item.AccountProvider }}</h2>
                            <v-row>
                              <v-col xs12 lg6>
                                <v-row>
                                  <h3>Account Number :</h3>
                                  <h3 class="pl-1">
                                    {{ item.AccountNumber }}
                                  </h3>
                                </v-row>
                              </v-col>
                              <v-col xs12 lg6 :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-2' : ''">
                                <v-row>
                                  <h3>Account Balance :</h3>
                                  <h3 class="pl-1">${{ formatNumber(item.AccountBalance) }}</h3>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <v-col :class="$vuetify?.breakpoint?.xs ? '' : $vuetify?.breakpoint?.smOnly ? 'ml-1 mr-1' : 'ml-4 mr-4'">
      <v-row>
        <v-col sm="3">
          <v-btn
            class="text-capitalize ml-0"
            block
            variant="outlined"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="goBack()"
          >
            Go Back
          </v-btn>
        </v-col>
        <v-spacer />
        <v-col sm="3" :class="$vuetify?.breakpoint?.xs ? '' : 'mr-2'">
          <v-btn
            class="text-capitalize"
            block
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="goToNextScreen()"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
import planfinderlist from '@/assets/planfinder.json'
export default {
  data() {
    return {
      investmentsList: [],
      loadingFund: false,
      headers: [
        {
          text: 'Symbol/ID',
          align: 'start',
          sortable: false,
          value: 'Symbol',
          width: '15%'
        },
        {
          text: 'Name',
          value: 'Name',
          align: 'center',
          width: '30%',
          sortable: false
        },
        {
          text: '1yr Yield',
          value: 'OneYearYeild',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: '3yr Yield',
          value: 'ThreeYearYeild',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: '5yr Yield',
          value: 'FiveYearYeild',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: 'Exp Ratio',
          value: 'Total',
          align: 'right',
          width: '10%',
          sortable: false
        },
        {
          text: 'Allocation',
          value: 'ElectionPercentage',
          align: 'right',
          sortable: false,
          width: '15%'
        }
      ],
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      streetAddress: '',
      zipCode: '',
      city: '',
      state: '',
      martialStatus: '',
      phone: '',
      birthDate: '',
      ssn: '',
      driverLicense: '',
      document: '',
      placeOfIssuance: '',
      residency: '',
      citizenship: '',
      expirationDate: '',
      occupation: '',
      planName: '',
      schoolList: [],
      planId: '',
      schoolDistrict: '',
      school: '',
      planTypeName: '',
      hireDate: '',
      stateList: planfinderlist.states,
      transferBalanceData: [],
      beneficiariesData: [],
      showPlanName: false
    }
  },
  created() {
    this.getSelectedInvestment()
    //this.getAllTransferAccounts()
    this.getBeneficiary()
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.firstName = this.$store.state.openAccountDetail.FirstName
      this.middleName = this.$store.state.openAccountDetail.MiddleInitial ? this.$store.state.openAccountDetail.MiddleInitial : ''
      this.lastName = this.$store.state.openAccountDetail.LastName
      this.email = this.$store.state.openAccountDetail.Email
      this.streetAddress = this.$store.state.openAccountDetail.MailingStreetAddress
        ? this.$store.state.openAccountDetail.MailingStreetAddress
        : ''
      this.zipCode = this.$store.state.openAccountDetail.MailingZip ? this.$store.state.openAccountDetail.MailingZip : ''
      this.city = this.$store.state.openAccountDetail.MailingCity ? this.$store.state.openAccountDetail.MailingCity : ''
      if (this.$store.state.openAccountDetail.MailingState) {
        var stateName = this.stateList.filter(
          (a) => a.text.split('-')[1].trim() === this.$store.state.openAccountDetail.MailingState.toUpperCase()
        )
        this.state = stateName && stateName.length > 0 ? stateName[0].text : ''
      } else this.state = ''
      this.martialStatus = this.$store.state.openAccountDetail.MaritalStatus
        ? this.$store.state.openAccountDetail.MaritalStatus
        : 'Single'
      if (this.$store.state.openAccountDetail.MobilePhone) {
        this.phone = this.$store.state.openAccountDetail.MobilePhone
      }
      if (this.$store.state.openAccountDetail.HomePhone) {
        this.phone = this.$store.state.openAccountDetail.HomePhone
      }

      if (this.$store.state.openAccountDetail.Birthdate) {
        this.birthDate = this.$store.state.openAccountDetail.Birthdate
      }
      this.ssn = this.$store.state.openAccountDetail.SSN ? this.$store.state.openAccountDetail.SSN : ''
      this.driverLicense = this.$store.state.openAccountDetail.IDType
        ? this.$store.state.openAccountDetail.IDType
        : "Driver's License"
      this.document = this.$store.state.openAccountDetail.IDNumber ? this.$store.state.openAccountDetail.IDNumber : ''
      this.placeOfIssuance = this.$store.state.openAccountDetail.PlaceofIssuance
        ? this.$store.state.openAccountDetail.PlaceofIssuance
        : ''
      if (this.$store.state.openAccountDetail.CountryofLegalResidence) {
        this.residency =
          this.$store.state.openAccountDetail.CountryofLegalResidence === 'United States of America'
            ? 'US'
            : this.$store.state.openAccountDetail.CountryofLegalResidence
      } else this.residency = ''
      if (this.$store.state.openAccountDetail.CountryofCitizenship) {
        this.citizenship =
          this.$store.state.openAccountDetail.CountryofCitizenship === 'United States of America'
            ? 'US'
            : this.$store.state.openAccountDetail.CountryofCitizenship
      } else this.citizenship = ''
      if (this.$store.state.openAccountDetail.ExpirationDate) {
        this.expirationDate = this.$store.state.openAccountDetail.ExpirationDate
      }
      this.schoolList = this.$store.state.openAccountDetail.schoolList ? this.$store.state.openAccountDetail.schoolList : []
      if (this.$store.state.openAccountDetail.DateofHire) {
        this.hireDate = this.$store.state.openAccountDetail.DateofHire
      }
      this.occupation = this.$store.state.openAccountDetail.Occupation ? this.$store.state.openAccountDetail.Occupation : ''
      this.planTypeName = this.$store.state.openAccountDetail.PlanTypeName ? this.$store.state.openAccountDetail.PlanTypeName : ''
      this.showPlanName =
        this.planTypeName === this.$authz.planType.Individual_Simple_IRA ||
        this.planTypeName === this.$authz.planType.Individual_457_b_Governmental_Plan
          ? true
          : false
      if (!this.showPlanName) {
        this.schoolDistrict = this.$store.state.openAccountDetail.schoolDistrictList[0].name
          ? this.$store.state.openAccountDetail.schoolDistrictList[0].name
          : ''
        this.school = this.$store.state.openAccountDetail.SchoolName ? this.$store.state.openAccountDetail.SchoolName : ''
      }
      this.planId = this.$store.state.openAccountDetail.PlanId ? this.$store.state.openAccountDetail.PlanId : ''
      if (this.$store.state.openAccountDetail.planList && this.$store.state.openAccountDetail.planList.length > 0) {
        this.planName = this.$store.state.openAccountDetail.planList.filter(
          (a) => a.Id === this.$store.state.openAccountDetail.PlanId
        )
      } else {
        this.planName = ''
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      if (date.includes('-')) {
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      } else return date
    },
    getStateCode(state) {
      if (state) {
        var string = state.split('-')
        var stateCode = string && string.length > 1 ? string[0] : ''
        return stateCode
      }
      return ''
    },
    formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        var intlCode = match[1] ? '+1 ' : ''
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
      }
      return ''
    },
    formatSocialSecurity(val) {
      val = val.replace(/\D/g, '')
      val = val.replace(/^(\d{3})/, '$1-')
      val = val.replace(/-(\d{2})/, '-$1-')
      val = val.replace(/(\d)-(\d{4}).*/, '$1-$2')
      return val
    },
    goBack() {
      this.$emit('goBack')
    },
    getBeneficiary() {
      this.loader = true
      this.$axios
        .get(`/api/v1/sfdc/beneficiary/${this.$store.state.openAccountDetail.RegistrationId}/GetAll`)
        .then((success) => {
          this.beneficiariesData = success.data.d.records ? success.data.d.records : []
        })
        .catch(() => {
          this.beneficiariesData = []
        })
    },
    getAllTransferAccounts() {
      this.loader = true
      this.$axios
        .get(`/api/v1/tal/opportunity/${this.$store.state.openAccountDetail.OpportunityId}/balancetransfer/getall`)
        .then((success) => {
          this.transferBalanceData = success.data.d ? success.data.d : []
        })
        .catch(() => {
          this.transferBalanceData = []
        })
    },
    getSelectedInvestment() {
      if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
        this.loadingFund = true
        this.$axios
          .get(
            `/api/v1/user/clientproductinvestment/${this.$store.state.openAccountDetail.ClientProduct}/opportunityfunds/${this.$store.state.openAccountDetail.OpportunityId}/getall`
          )
          .then((success) => {
            this.investmentsList = success.data.d && success.data.d.length > 0 ? success.data.d : []
            this.investmentsList.sort(function (a, b) {
              let left = a.Type
              let right = b.Type
              return left === right ? 0 : left === 'Model' ? 1 : -1
            })
            this.investmentsList.forEach((element) => {
              element.Total = element.Total * 100
            })
          })
          .finally(() => {
            this.loadingFund = false
          })
      }
    },
    formatPercent(val) {
      if (val !== undefined) {
        return parseFloat(Number(val)).toFixed(2)
      }
    },
    editFlow(val) {
      this.$emit('goToFlowEditScreen', val)
    },
    goToNextScreen() {
      this.$emit('goToNextWindow')
    }
  }
}
</script>
<style scoped>
.reviewTable table thead.v-data-table-header tr {
  height: 30px !important;
}
</style>
