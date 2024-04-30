<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Account Holder Statements and Agreements</h1>
        </v-flex>
        <v-flex class="pt-5">
          <h3>
            The client has the option of having statements both mailed directly to the account holder(s) and posted to their
            account website or only posted to their account website. Please select the desired distribution method below.
          </h3>
          <v-radio-group v-model="payMode" hide-details class="mt-0 pt-5">
            <v-radio color="accent" value="PaperandEStatements">
              <template v-slot:label>
                <p>
                  <b>Paper statements and e-statements -</b> Paper statements will be mailed directly to the account holder(s) via
                  regular U.S. mail and post e-statements on their account website. Postage and fulfillment expenses apply.
                </p>
              </template>
            </v-radio>
            <v-radio color="accent" value="EStatements">
              <template v-slot:label>
                <p>
                  <b>E-statements</b> will be posted via the account website (www.pcsretirement.com) only. Please note that an
                  e-mail address for each eligible employee must be provided with this option, and the account holder(s) with a
                  workplace email address must provide a personal email address upon termination of employment.Please note that
                  the account holder(s) have the right to request and obtain, free of charge, a paper version of the pension
                  benefit statement information required under the Employee Retirement Income Secur ty Act of 197 4 ("ERISA") §105
                  and Department of Labor ("DOL") Regulation §2550.404a-5.
                </p>
              </template>
            </v-radio>
          </v-radio-group>
          <v-checkbox
            hide-details
            v-model="isAgreeAccurate"
            :ripple="false"
            label="I agree that all the information I have provided is accurate"
            class="mt-0"
            color="accent"
          ></v-checkbox>
          <v-checkbox
            hide-details
            v-model="isAgree"
            :ripple="false"
            label="I agree to provide each of these agreements to the account holder(s)"
            class="mt-0 pt-2"
            color="accent"
          ></v-checkbox>
          <v-flex xs12 class="pl-8 pt-4">
            <a
              target="_blank"
              :href="`https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/007c3975687543bab532602b83b67286?v=fef01caf`"
              :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
              class="cursor-pointer"
              ><h3>Service Agreement with PCS Retirement, LLC</h3></a
            >
          </v-flex>
          <v-flex xs12 class="pl-8 pt-3">
            <a
              target="_blank"
              :href="`https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/df1d5f9b31fa4c588c2421b42002ea8c?v=c66ff08f`"
              :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
              class="cursor-pointer"
              ><h3>Custodial Account Agreement with AdvisorTrust, Inc.</h3></a
            >
          </v-flex>
          <v-flex xs12 class="pl-8 py-3">
            <a
              target="_blank"
              :href="`https://pcsretirement-delivery.sitecorecontenthub.cloud/api/public/content/b3bf6b4a67c2480c9444ea9220ea2071?v=c61963f6`"
              :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
              class="cursor-pointer"
              ><h3>Schedule of Ancillary Services - Exhibit A</h3></a
            >
          </v-flex>
        </v-flex>
        <v-flex pt-2>
          <v-flex class="text-center">
            <v-col class="pa-0">
              <v-btn
                class="text-capitalize"
                :color="$vuetify.theme.dark ? '' : 'accent'"
                @click="submitDetails()"
                :disabled="!isAgreeAccurate || !isAgree"
                >Submit</v-btn
              >
            </v-col>
            <v-col class="pl-0 pr-0 pt-2">
              <v-btn class="text-capitalize" variant="outlined" :color="$vuetify.theme.dark ? '' : 'accent'" @click="prevSlide()"
                >Go Back</v-btn
              >
            </v-col>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-row>
    <SoloKPreview v-model="showPreviewDialog" @closePreviewDialog="closePreviewDialog" :key="componentKey" />
  </v-flex>
</template>
<script>
import SoloKPreview from '@/components/Home/Acquisition/SoloKOpenAccountFlow/SoloKPreview'
export default {
  data() {
    return {
      isAgreeAccurate: false,
      isAgree: false,
      showPreviewDialog: false,
      componentKey: 0,
      payMode: 'PaperandEStatements'
    }
  },
  components: {
    SoloKPreview
  },
  methods: {
    submitDetails() {
      this.$store.state.soloKOpenAccountDetail.PaperandEStatements = this.payMode
        ? this.payMode === 'PaperandEStatements'
          ? true
          : false
        : false
      this.$store.state.soloKOpenAccountDetail.EStatements = this.payMode
        ? this.payMode === 'EStatements'
          ? true
          : false
        : false
      this.showPreviewDialog = true
    },
    closePreviewDialog() {
      this.showPreviewDialog = false
      this.$emit('closeSoloKDialog')
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
