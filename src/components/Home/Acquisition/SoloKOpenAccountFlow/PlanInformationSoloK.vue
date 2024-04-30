<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Plan Information</h1>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader" class="pt-8">
          <v-flex>
            <div class="text-h6 pb-1">What type of plan is this?</div>
            <v-radio-group v-model="planMode" inline class="mt-0 pt-0" @update:model-value="selectPlanType()">
              <v-radio color="accent" label="Start-up" value="Start-up"></v-radio>
              <v-radio color="accent" label="Conversion" value="Conversion"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex>
            <v-row>
              <v-flex sm8 xs12>
                <div class="text-h6 pb-1">Legal plan name</div>
                <v-flex xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                  <v-text-field
                    v-model="planName"
                    placeholder="Plan name"
                    required
                    variant="outlined"
                    maxlength="140"
                    density="compact"
                    single-line
                    :rules="[(v) => !!v || 'Plan Name is required']"
                    hide-details
                  ></v-text-field>
                </v-flex>
              </v-flex>
              <v-flex sm4 xs12>
                <div class="text-h6 pb-1">Plan number</div>
                <v-flex xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                  <v-text-field
                    v-model="planNumber"
                    required
                    variant="outlined"
                    maxlength="3"
                    density="compact"
                    single-line
                    hide-details
                    :rules="[(v) => !!v || 'Plan Number is required']"
                    :disabled="readOnly"
                    v-input-mask="{
                      mask: '999',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                  ></v-text-field>
                </v-flex>
              </v-flex>
            </v-row>
            <v-flex class="py-2">
              <h3>Please ensure the spelling, punctuation and capitalization is correct for the plan name.</h3>
              <h3 class="pt-3">
                If this is the first qualified retirement plan the account holder has sponsored enter 001. If they have sponsored
                any other qualified retirement plan, enter as appropriate. i.e. 002, 003.
              </h3>
            </v-flex>
            <v-flex class="pt-4">
              <v-row>
                <v-flex sm5 xs12>
                  <div class="text-h6 pb-1">Plan effective date</div>
                  <v-flex>
                    <!-- <v-menu
                      v-model="planEffectiveDateMenu"
                      :close-on-content-click="false"
                      offset
                      z-index="99999"
                      transition="scale-transition"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          variant="outlined"
                          density="compact"
                          v-model="planEffectiveDate"
                          
                          :rules="[(v) => !!v || 'Effective Date is required']"
                          :error="planEffectiveDateError"
                          :error-messages="planEffectiveDateErrorMsg"
                          :hide-details="!planEffectiveDateError"
                          @blur="checkDate(planEffectiveDate)"
                          v-input-mask="{
                            alias: 'datetime',
                            inputFormat: 'mm/dd/yyyy',
                            showMaskOnHover: false
                          }"
                          @update:model-value="datePlanEffective = parseDate(planEffectiveDate)"
                          class="pr-2"
                        >
                          <v-icon v-bind="props" slot="append">event</v-icon>
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="datePlanEffective"
                        @input="planEffectiveDateMenu = false"
                        :min="minDate"
                        color="accent"
                      ></v-date-picker>
                    </v-menu> -->
                  </v-flex>
                </v-flex>
                <v-flex sm5 xs12 v-if="planMode === 'Conversion'"
                  ><div class="text-h6 pb-1">Assets ($)</div>
                  <v-text-field
                    prefix="$"
                    v-model="assets"
                    v-input-mask="{
                      alias: 'currency',
                      rightAlign: false,
                      autoUnmask: true,
                      allowMinus: false,
                      digitsOptional: true,
                      placeholder: '0'
                    }"
                    variant="outlined"
                    density="compact"
                    hide-details
                  ></v-text-field
                ></v-flex>
              </v-row>
              <h3 class="pt-2">Plan effective date will determine the year which first contributions can be made.</h3>
            </v-flex>
            <v-flex v-if="planMode === 'Start-up'">
              <h3 class="pt-2">If this is a start-up plan, effective date cannot be sooner than current fiscal year.</h3>
            </v-flex>
          </v-flex>
          <v-flex pt-8>
            <v-flex class="text-center">
              <v-col class="pa-0">
                <v-btn
                  class="text-capitalize"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  @click="nextSlide()"
                  :disabled="!valid"
                  >Next</v-btn
                >
              </v-col>
              <v-col class="pl-0 pr-0 pt-2">
                <v-btn
                  class="text-capitalize"
                  variant="outlined"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  @click="prevSlide()"
                  >Go Back</v-btn
                >
              </v-col>
            </v-flex>
          </v-flex>
        </v-form>
      </v-flex>
    </v-row>
  </v-flex>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      planName: '',
      planMode: 'Start-up',
      planNumber: '',
      planNumberStartup: '001',
      planEffectiveDateMenu: false,
      planEffectiveDate: '',
      planEffectiveDateError: false,
      planEffectiveDateErrorMsg: '',
      isPlanEffectiveDate: false,
      datePlanEffective: null,
      valid: false,
      loader: false,
      assets: 0,
      readOnly: false
    }
  },
  watch: {
    planEffectiveDateMenu: {
      handler(val) {
        if (!val) {
          this.checkDate(this.planEffectiveDate)
        }
      }
    },
    datePlanEffective: function () {
      if (!this.isPlanEffectiveDate) {
        this.planEffectiveDate = this.formatDate(this.datePlanEffective)
      }
      this.isPlanEffectiveDate = false
    }
  },
  computed: {
    minDate() {
      var year = moment().subtract(12, 'months').format('YYYY')
      var currentdate = new Date()
      var month = ('0' + currentdate.getMonth()).slice(-2)
      var date = ('0' + currentdate.getDate()).slice(-2)
      var effectiveDate = year + '-' + month + '-' + date
      return effectiveDate
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.planMode =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanType
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanType
          : 'Start-up'
      this.planName =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.LegalPlanName
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.LegalPlanName
          : ''
      this.planNumber =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanNumber
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanNumber
          : ''
      this.planEffectiveDate =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.EffectiveDate
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.EffectiveDate
          : ''
      this.assets =
        this.$store.state.soloKOpenAccountDetail.PlanInformation &&
        this.$store.state.soloKOpenAccountDetail.PlanInformation.Assets
          ? this.$store.state.soloKOpenAccountDetail.PlanInformation.Assets
          : 0
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.PlanInformation = {}
      this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanType = this.planMode ? this.planMode : 'Start-up'
      this.$store.state.soloKOpenAccountDetail.PlanInformation.LegalPlanName = this.planName ? this.planName : ''
      this.$store.state.soloKOpenAccountDetail.PlanInformation.PlanNumber = this.planNumber ? this.planNumber : ''
      this.$store.state.soloKOpenAccountDetail.PlanInformation.EffectiveDate = this.planEffectiveDate
        ? this.planEffectiveDate
        : ''
      this.$store.state.soloKOpenAccountDetail.PlanInformation.Assets = this.assets ? parseFloat(this.assets) : 0
      //this.$emit('nextSlide')
      this.$emit('displayNextSlide', this.planMode)
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null
      if (!Date.parse(date)) {
        this.isPlanEffectiveDate = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          this.planEffectiveDate = ''
          this.planEffectiveDateError = true
          this.planEffectiveDateErrorMsg = 'Invalid date'
        } else {
          this.planEffectiveDateError = false
          this.planEffectiveDateErrorMsg = ''
        }
      }
    },
    selectPlanType() {
      this.planNumber = ''
      this.planName = ''
      this.assets = 0
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
