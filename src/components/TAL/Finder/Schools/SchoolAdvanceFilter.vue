<template>
  <v-dialog
    v-model="filterDialog"
    persistent
    class="elevation-3"
    content-class="elevation-3"
    scrollable
    :max-width="!$vuetify?.breakpoint?.mdAndDown ? '930px' : '400px'"
  >
    <v-card v-if="filterObject.dialogAction === 'Approved'">
      <v-card-title class="pt-3 pb-2" :class="$vuetify?.theme.dark ? '' : 'accent'">
        <v-row>
          <v-col xs12>
            <v-row>
              <v-col xl11 lg11 sm11 md11 xs11 class="align-self">
                <v-row>
                  <CustomIcon :type="'enrollmentIconDialog'" />
                  <span class="font_14 text-uppercase text-secondary ml-2 pt-1">Enrollment</span>
                </v-row>
              </v-col>
              <v-col xl1 lg1 sm1 md1 xs1 class="text-right">
                <v-icon color="secondary" @click="filterDialog = false"> close </v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <SchoolEnrollmentForm />
      </v-card-text>
    </v-card>
    <v-card v-else-if="filterObject.dialogAction === 'Approval Required'">
      <v-card-title class="pt-3 pb-2" :class="$vuetify?.theme.dark ? '' : 'accent'">
        <v-row>
          <v-col xs12>
            <v-row>
              <v-col xl11 lg11 sm11 md11 xs11 class="align-self">
                <v-row>
                  <CustomIcon :type="'redflagIconDialog'" />
                  <span class="font_14 text-uppercase text-secondary ml-2 pt-1">Get Approval for Payroll Slot</span>
                </v-row>
              </v-col>
              <v-col xl1 lg1 sm1 md1 xs1 class="text-right">
                <v-icon color="secondary" @click="filterDialog = false"> close </v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <iframe
          id="ft1600971973145-178-22"
          onload="window.parent.scrollTo(0,0)"
          allowtransparency="true"
          :src="approvalRequiredformTitanUrl"
          frameborder="0"
          width="768"
          height="750"
          scrolling="no"
        />
      </v-card-text>
    </v-card>
    <v-card v-else height="400">
      <v-card-title class="pt-3 pb-2" :class="$vuetify?.theme.dark ? '' : 'accent'">
        <v-row>
          <v-col xs12>
            <v-row>
              <v-col xl11 lg11 sm11 md11 xs11 class="align-self">
                <v-row>
                  <CustomIcon color="white" :type="'redflagIconDialog'" />
                  <span class="font_14 text-uppercase text-secondary ml-2">Get Approval for Payroll Slot</span>
                </v-row>
              </v-col>
              <v-col xl1 lg1 sm1 md1 xs1 class="text-right">
                <v-icon color="secondary" @click="filterDialog = false"> close </v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text height="400">
        <v-row class="justify-center">
          <v-col class="advanceFilter pt-5" xs12>
            <v-col :class="$vuetify?.theme.dark ? 'text-center' : 'text-accent text-center'">
              <h4>Your Payroll Slot is not approved in Spring-Ford Area School District</h4>
            </v-col>
            <v-col xs12 class="text-center pt-5 pr-2">
              <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" class="elevation-0 ml-5" @click="getApproved()">
                Get Approved
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import CustomIcon from '@/components/CustomIcon'
import SchoolEnrollmentForm from '@/components/TAL/Finder/Schools/SchoolEnrollmentForm'
export default {
  components: {
    CustomIcon,
    SchoolEnrollmentForm
  },
  props: ['value', 'filterObject'],
  data() {
    return {
      states: '',
      stateValue: [],
      schoolDistrict: '',
      schoolDistrictValue: [],
      relationship: '',
      relationshipValue: [],
      payVendor: '',
      payVendorValue: [],
      products: '',
      productValue: [],
      formSrc: ''
    }
  },
  computed: {
    filterDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    formTitanUrl() {
      var schoolDistrictId = this.filterObject.schoolDistrictId ? this.filterObject.schoolDistrictId.trim() : 0
      var advisorContactId = this.filterObject.advisorContactId
      var programId = this.filterObject.programId ? this.filterObject.programId.trim() : ''
      var relationshipId = this.filterObject.relationshipId ? this.filterObject.relationshipId.trim() : ''
      var advisorWebsiteCredentialId = this.filterObject.advisorWebsiteCredentialId

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.formSrc = `${window.__env.formTitanBaseUri}403benrollment/?fld453=${schoolDistrictId}&fld456=${advisorContactId}&fld491=${programId}&fld460=${relationshipId}&fld714=${advisorWebsiteCredentialId}`
      return this.formSrc
    },
    approvalRequiredformTitanUrl() {
      var advisorAccountId = this.filterObject.advisorAccountId
      var schoolDistrictId = this.filterObject.schoolDistrictId
      var programPayrollSetup = 'payrollslotsetup'
      var program = this.$store.state.user.selectedProgram.programName
      if (this.$authz.program.Axos === program) programPayrollSetup = 'payrollslotsetup-axos'
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.formSrc = `${window.__env.formTitanBaseUri}${programPayrollSetup}/?fld372=${advisorAccountId}&fld435=${schoolDistrictId}`
      return this.formSrc
    }
  }
}
</script>
