<template>
  <v-col>
    <v-card class="mb-1 mt-1 elevation-6" :class="$vuetify?.breakpoint?.xs ? 'ml-1 mr-1' : 'ml-6 mr-6'">
      <v-col xs12>
        <v-row justify="center">
          <v-col xs12 lg12 class="justify-center">
            <v-col xs12 class="text-center mb-2 mt-6">
              <h1 class="welcomeFont mb-2">Agreements and Disclosures</h1>
            </v-col>
            <v-row align-content="center" style="height: 100%">
              <v-form ref="form" v-model="valid">
                <v-col pt-2 pb-6 :class="$vuetify?.breakpoint?.xs ? 'ml-2 mr-2' : 'ml-8 mr-8'">
                  <v-col>
                    <h3><b>Carefully review the Account Opening Agreements below.</b></h3>
                    <ul>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            <a class="text-accent text-decoration-underline" @click="downloadPDF()"
                              >Account Agreements and Disclosures (PDF)</a
                            >
                            Includes the Customer Agreement, Custodial Agreement, Customer Relationship Summaries, and important
                            information about privacy, fees, fiduciary advisor disclosure and commissions, if any.
                          </h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            <a
                              class="text-accent text-decoration-underline"
                              href="https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/pcsprivacypolicy"
                              target="_blank"
                              >Privacy Policy (PDF)</a
                            >
                            Privacy Policy applicable to opening your account
                          </h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            <a
                              class="text-accent text-decoration-underline"
                              href="https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/pcstermsconditions"
                              target="_blank"
                              >Terms & Conditions (PDF)</a
                            >
                            Terms & Conditions applicable to opening your account
                          </h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            <a
                              class="text-accent text-decoration-underline"
                              href="https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/PCS-electronic-delivery-agreement"
                              target="_blank"
                              >Electronic Delivery Agreement (PDF)</a
                            >
                            Information about your consent to receive account related communication electronically rather than
                            through the U.S. mail
                          </h3>
                        </v-col>
                      </li>
                    </ul>
                    <h3>
                      <b>By selecting Open account below,</b> you are electronically signing this application and acknowledging
                      that you:
                    </h3>
                    <ul>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>Received, understand, and agree to the Account Opening Agreements</h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            Agree the cash in this account will be held in the
                            <a
                              class="text-accent text-decoration-underline"
                              target="_blank"
                              href=" https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/advisortrust-demand-deposit-account"
                            >
                              AdvisorTrust Demand Deposit Account</a
                            >
                            pending further instruction. Other option may be available after opening the account
                          </h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>Confirm that your personal information is correct</h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            Agree to conduct business with Aspire Financial electronically and to the electronic delivery of all
                            documents and communications for all your Aspire accounts as detailed in the Electronic Delivery
                            Agreement.
                          </h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            Consent to Aspire Financial's use of your email and/or mobile number to message, call or text you to
                            help secure your account, provide transactional alerts, and deliver other communications. Message and
                            data rates apply; frequency may vary. For help with texts, reply HELP. To opt-out of texts, log onto
                            aspireonline.com or reply STOP
                          </h3>
                        </v-col>
                      </li>
                      <li>
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            Understand this account is governed by a pre-dispute arbitration clause contained on the last page of
                            the Customer Agreement
                          </h3>
                        </v-col>
                      </li>
                      <li v-if="limitedAuthorityTrading">
                        <v-col xs12 pt-2 pb-2>
                          <h3>
                            Participant authorizes the Financial Professional to direct investment of the Account and directs PCS
                            | Aspire to act on instructions of the Financial Professional without further approval or direction
                            from Participant. This grant of Account Access and Limited Trading Authority does not authorize the
                            Financial Professional to transfer, withdraw, or disburse money or assets from the account except in
                            connection with the assessment of applicable fees.
                          </h3>
                        </v-col>
                      </li>
                    </ul>
                  </v-col>
                  <v-col xs12>
                    <v-row>
                      <v-checkbox
                        id="termsAndCondition"
                        v-model="termsAndCondition"
                        class="mt-1 changeCheckboxColor agreementCheckbox"
                        color="accent"
                        :rules="[(v) => !!v]"
                      >
                        <template #label>
                          <h3>
                            By checking this box you are agreeing to the Account Opening Agreements and electronically signing
                            this application to initiate opening a {{ accountName }} with {{ firmName }}
                          </h3>
                        </template>
                      </v-checkbox>
                    </v-row>
                    <v-row>
                      <v-col xs12 sm8 lg5 :class="$vuetify?.breakpoint?.xs ? '' : 'pr-5'">
                        <v-row>
                          <div class="sub-title pb-1 pt-2 font-weight-medium">Participant Name</div>
                          <v-col xs12>
                            <v-text-field
                              v-model="participantName"
                              placeholder="Participant Name"
                              variant="outlined"
                              density="compact"
                              single-line
                              hide-details
                              :rules="[(v) => !!v || 'Participant Name is required']"
                              disabled
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col xs12 sm4 lg2>
                        <v-row>
                          <div class="sub-title pb-1 pt-2 font-weight-medium">Date</div>
                          <v-col xs12>
                            <v-menu
                              v-model="menu1"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              min-width="290px"
                            >
                              <template #activator="{ props }">
                                <v-text-field
                                  v-model="date"
                                  v-input-mask="{
                                    alias: 'datetime',
                                    inputFormat: 'mm/dd/yyyy',
                                    max: dateRange
                                  }"
                                  density="compact"
                                  variant="outlined"
                                  disabled
                                  :rules="[(v) => !!v || 'Date is required']"
                                  @update:model-value="signatureDate = parseDate(date)"
                                  @blur="checkDate(date)"
                                  append-inner-icon="event"
                                  v-bind="props"
                                >
                                  <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="signatureDate"
                                color="accent"
                                :min="dateRange"
                                :max="dateRange"
                                @input="menu1 = false"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-form>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <v-col :class="$vuetify?.breakpoint?.xs ? '' : 'ml-4 mr-4'">
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
            :disabled="!valid"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="saveAgreement()"
          >
            Open Account
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
export default {
  props: ['limitedAuthorityTrading'],
  data() {
    return {
      options: {
        penColor: this.$store.state.theme.accentColors[0]
      },
      valid: false,
      participantName: '',
      digitalSignatureData: [],
      termsAndCondition: false,
      menu1: false,
      firmName: '',
      signatureDate: null,
      isSignatureDate: false,
      date: '',
      accountName: '',
      opportunityId: ''
    }
  },
  computed: {
    dateRange() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    }
  },
  watch: {
    signatureDate: {
      handler() {
        if (!this.isSignatureDate) this.date = this.formatDate(this.date)
        this.isSignatureDate = false
      },
      immediate: true,
      deep: true
    },
    menu1: {
      handler(val) {
        if (!val) {
          this.checkDate(this.date)
        }
      }
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.opportunityId = this.$store.state.openAccountDetail.OpportunityId
        ? this.$store.state.openAccountDetail.OpportunityId
        : ''
      this.participantName = this.$store.state.openAccountDetail.FirstName
        ? this.$store.state.openAccountDetail.FirstName + ' ' + this.$store.state.openAccountDetail.LastName
        : ''
      this.firmName = this.$store.state.openAccountDetail.FirmName ? this.$store.state.openAccountDetail.FirmName : ''
      this.date = this.formatDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10))
      this.signatureDate = this.parseDate(this.date)
      this.accountName = this.$store.state.openAccountDetail.PlanTypeName ? this.$store.state.openAccountDetail.PlanTypeName : ''
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          this.date = ''
        }
      }
    },
    parseDate(date) {
      if (!date) return null
      if (!Date.parse(date)) {
        this.isSignatureDate = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    saveAgreement() {
      //const { data } = this.$refs.signaturePad.saveSignature()
      var digitalSignatureDetails = {
        OpportunityId: this.opportunityId,
        SignatureData: '',
        SignatureDate: this.signatureDates
      }
      this.$axios.post(`/api/v1/sfdc/opportunity/${this.opportunityId}/Agreement Received`)
      this.$axios.post(`/api/v1/sfdc/opportunity/signature`, digitalSignatureDetails)
      this.$emit('goToNextWindow')
    },
    downloadPDF() {
      if (this.opportunityId) {
        this.onPopUpEvent(`/api/v1/opportunity/${this.opportunityId}/agreementanddisclosure`, `agreementanddisclosure`)
      }
    }
  }
}
</script>
<style>
#signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white), radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.legal_min_height {
  max-height: 600px !important;
}
</style>
