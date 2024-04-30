<template>
  <v-col>
    <v-card class="mb-1 mt-1 elevation-6" height="560px" :class="$vuetify?.breakpoint?.xs ? 'ml-1 mr-1' : 'ml-6 mr-6'">
      <v-col xs12>
        <v-row justify="center">
          <v-col xs11 lg8 class="justify-center">
            <v-col xs12 class="text-center mb-2 mt-6">
              <h1 class="welcomeFont mb-2">Tell us about your Employer</h1>
              <h4>Verify and complete filling out details regarding your employer</h4>
            </v-col>
            <v-row justify="center" align-content="center" style="height: 100%">
              <v-form ref="form" v-model="valid">
                <v-col pt-4 pb-6>
                  <div v-if="!showPlanName" class="sub-title pb-1 font-weight-medium">School District</div>
                  <v-row v-if="!showPlanName">
                    <v-col sm12 pb-2>
                      <h3 class="mb-1 mt-1">
                        {{ schoolDistrict }}
                      </h3>
                    </v-col>
                    <v-col sm12>
                      <v-select
                        v-model="school"
                        density="compact"
                        :items="schoolList"
                        variant="outlined"
                        hide-details
                        placeholder="Select School"
                        append-icon="icon-chevron-down"
                        item-title="name"
                        item-value="name"
                        :disabled="disabledSchool"
                      />
                    </v-col>
                  </v-row>
                  <v-col v-if="showPlanName" sm12 pb-2>
                    <div v-if="!showPlanName" class="sub-title pb-1 font-weight-medium">Plan Name</div>
                    <h3 class="mb-1 mt-1">
                      {{ planName && planName.length > 0 ? planName[0].PlanSponsor : '' }}
                    </h3>
                  </v-col>
                  <v-col xs12 class="pb-1 pt-2">
                    <v-row>
                      <v-col xs12 sm8 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : 'pr-2'">
                        <div class="sub-title pb-1 pt-2 font-weight-medium">Occupation</div>
                        <v-col>
                          <v-text-field
                            v-model="occupation"
                            placeholder="Occupation"
                            single-line
                            variant="outlined"
                            density="compact"
                            :rules="[(v) => !!v || 'Occupation is required']"
                            hide-details
                          />
                        </v-col>
                      </v-col>
                      <v-col xs12 sm4 :class="$vuetify?.breakpoint?.xs ? 'pb-2' : ''">
                        <v-row>
                          <div class="sub-title pb-1 pt-2 font-weight-medium">Date of Hire</div>
                          <v-col xs12>
                            <v-menu
                              v-model="menu2"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              min-width="290px"
                            >
                              <template #activator="{ props }">
                                <v-text-field
                                  v-model="hireDate"
                                  density="compact"
                                  v-input-mask="{
                                    alias: 'datetime',
                                    inputFormat: 'mm/dd/yyyy',
                                    max: maxHireDate
                                  }"
                                  :error-messages="checkDateErrorMsg"
                                  :error="checkDateError"
                                  variant="outlined"
                                  :rules="[(v) => !!v || 'Date of Hire is required']"
                                  @update:model-value="dateHire = parseDate(hireDate)"
                                  @blur="checkDate(hireDate)"
                                  append-inner-icon="event"
                                  v-bind="props"
                                >
                                  <!-- <v-icon v-bind="props" slot="append"> event </v-icon> -->
                                </v-text-field>
                              </template>
                              <v-date-picker v-model="dateHire" color="accent" :max="maxDate" @input="menu2 = false" />
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
            :disabled="!valid"
            block
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            size="x-large"
            @click="saveEmployerInformation()"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      schoolDistrict: '',
      schoolDistrictList: [],
      school: '',
      schoolList: [],
      valid: true,
      occupation: '',
      position: '',
      menu2: false,
      checkDateErrorMsg: '',
      checkDateError: false,
      hireDate: '',
      isHireDate: false,
      dateHire: null,
      disabledSchool: false,
      planId: '',
      planList: [],
      planName: '',
      planTypeName: ''
    }
  },
  computed: {
    maxDate() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    },
    maxHireDate() {
      var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
      const [year, month, day] = today.split('-')
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    },
    showPlanName() {
      if (this.planTypeName === this.$authz.planType.Individual_Simple_IRA) {
        return true
      } else if (this.planTypeName === this.$authz.planType.Individual_457_b_Governmental_Plan) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    dateHire: {
      handler() {
        if (!this.isHireDate) this.hireDate = this.formatDate(this.dateHire)
        this.isHireDate = false
      },
      immediate: true,
      deep: true
    },
    menu2: {
      handler(val) {
        if (!val) {
          this.checkDate(this.hireDate)
        }
      }
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.schoolDistrictList = this.$store.state.openAccountDetail.schoolDistrictList
        ? this.$store.state.openAccountDetail.schoolDistrictList
        : []
      this.schoolList = this.$store.state.openAccountDetail.schoolList ? this.$store.state.openAccountDetail.schoolList : []
      if (this.$store.state.openAccountDetail.DateofHire) {
        this.hireDate = this.formatDate(this.$store.state.openAccountDetail.DateofHire)
        this.dateHire = this.parseDate(this.hireDate)
      }
      this.occupation = this.$store.state.openAccountDetail.Occupation ? this.$store.state.openAccountDetail.Occupation : ''
      this.position = this.$store.state.openAccountDetail.Position ? this.$store.state.openAccountDetail.Position : ''
      this.planTypeName = this.$store.state.openAccountDetail.PlanTypeName ? this.$store.state.openAccountDetail.PlanTypeName : ''
      if (!this.showPlanName) {
        this.schoolDistrict =
          this.$store.state.openAccountDetail.schoolDistrictList &&
          this.$store.state.openAccountDetail.schoolDistrictList.length > 0 &&
          this.$store.state.openAccountDetail.schoolDistrictList[0].name
            ? this.$store.state.openAccountDetail.schoolDistrictList[0].name
            : ''
        this.school = this.$store.state.openAccountDetail.SchoolName ? this.$store.state.openAccountDetail.SchoolName : ''
      }
      this.disabledSchool = this.$store.state.openAccountDetail.fromPage
        ? this.$store.state.openAccountDetail.fromPage === 'School'
          ? true
          : false
        : false
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
    parseDate(date) {
      // eslint-disable-next-line no-debugger
      if (!date) return null
      if (!Date.parse(date)) {
        this.isHireDate = true
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
    checkDate(val) {
      if (val) {
        if (!Date.parse(val)) {
          this.hireDate = ''
          this.checkDateErrorMsg = 'Invalid date'
          this.checkDateError = true
        } else {
          this.checkDateError = false
          this.checkDateErrorMsg = ''
        }
      }
    },
    saveEmployerInformation() {
      if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
        this.$store.state.openAccountDetail.DateofHire = this.dateHire ? this.dateHire : ''
        this.$store.state.openAccountDetail.Occupation = this.occupation ? this.occupation : ''
        this.$store.state.openAccountDetail.Position = this.position ? this.position : ''
        this.$store.state.openAccountDetail.SchoolName = this.school ? this.school : ''
        this.$axios.post(`/api/v1/sfdc/Registration`, this.$store.state.openAccountDetail)
        if (this.school && this.$store.state.openAccountDetail.OpportunityId) {
          this.$axios.post(
            `/api/v1/sfdc/opportunity/${this.$store.state.openAccountDetail.OpportunityId}/schooolname/${this.school}`
          )
        }
      }
      this.$emit('goToNextWindow')
    },
    goBack() {
      this.$emit('goBack')
    }
  }
}
</script>
