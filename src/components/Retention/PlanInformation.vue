<template>
  <v-col class="information_review">
    <v-progress-linear v-if="planInformationLoading" indeterminate color="accent" height="4" />
    <v-container
      class="ml-0"
      :class="[$vuetify?.breakpoint?.smAndDown ? 'pr-2 pl-2' : 'pr-0 pl-0 pb-0', $vuetify?.theme.dark ? '' : 'white']"
    >
      <v-col xl12 lg12 md12 sm12 xs12 :class="planInformationLoading ? 'pb-3' : ''">
        <v-row>
          <v-col
            ref="staticMap"
            v-resize="onResize"
            xl4
            lg4
            md4
            sm12
            xs12
            :class="$vuetify?.breakpoint?.mdAndUp ? 'pl-4 pr-3' : 'pl-2 pr-2'"
            class="text-center"
          >
            <v-card class="elevation-0" style="background-color: lightgrey">
              <i
                v-if="!googleMarkerimg"
                class="fas fa-map-marked-alt fa-7x icon_font"
                :class="$vuetify?.breakpoint?.smAndDown ? 'pb-3 pt-2' : 'pt-3 pb-3'"
              />
            </v-card>
            <img
              v-if="googleMarkerimg"
              :src="googleMarkerimg"
              draggable="false"
              :style="$vuetify?.breakpoint?.md ? 'height:250px' : 'height:200px'"
              border="0"
              width="100%"
              height
              class="map_image_border img_slection_none"
            />
          </v-col>
          <v-col v-if="!planInformationLoading" xl8 lg8 md8 sm12 xs12 :class="$vuetify?.breakpoint?.smOnly ? 'mt-2' : ''">
            <v-row class="text-left">
              <v-col
                class="text-left"
                md3
                sm3
                xs12
                :class="[$vuetify?.breakpoint?.smAndDown ? 'pt-2 align-self' : '', $vuetify?.breakpoint?.mdAndUp ? 'pl-3' : '']"
              >
                <v-row v-if="selectedPlan.PlanStatus != 'Implementation'">
                  <v-col class="flex_none">
                    <span data-html2canvas-ignore="true"
                      ><v-icon v-if="!$vuetify?.breakpoint?.xs" size="medium" class="ml-1 mb-1" color="teal"
                        >fas fa-award</v-icon
                      ></span
                    >
                    <span data-html2canvas-ignore="true"
                      ><v-icon v-if="$vuetify?.breakpoint?.xs" size="small" class="ml-1" color="teal">fas fa-award</v-icon></span
                    >
                  </v-col>
                  <v-col class="flex_none align-self">
                    <h3
                      v-if="!$vuetify?.breakpoint?.xs"
                      :class="$vuetify?.theme.dark ? 'align-self pl-1' : 'teal--text align-self pl-1'"
                    >
                      <b>Live Plan</b>
                    </h3>
                    <a
                      v-if="$vuetify?.breakpoint?.xs"
                      href="#"
                      :class="
                        !$vuetify?.theme.dark ? 'teal--text text-decoration-none pl-1' : 'text-white text-decoration-none pl-1'
                      "
                      ><b>Live Plan</b></a
                    >
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col class="flex_none">
                    <span data-html2canvas-ignore="true"
                      ><v-icon v-if="!$vuetify?.breakpoint?.xs" size="medium" class="ml-1 mb-1" color="orange"
                        >fas fa-award</v-icon
                      ></span
                    >
                    <span data-html2canvas-ignore="true"
                      ><v-icon v-if="$vuetify?.breakpoint?.xs" size="small" class="ml-1" color="orange"
                        >fas fa-award</v-icon
                      ></span
                    >
                  </v-col>
                  <v-col class="flex_none align-self">
                    <h3
                      v-if="!$vuetify?.breakpoint?.xs"
                      :class="$vuetify?.theme.dark ? 'align-self pl-1' : 'orange--text align-self pl-1'"
                    >
                      <b>Plan in Implementation</b>
                    </h3>
                    <a
                      v-if="$vuetify?.breakpoint?.xs"
                      href="#"
                      :class="
                        !$vuetify?.theme.dark ? 'orange--text text-decoration-none pl-1' : 'text-white text-decoration-none pl-1'
                      "
                      ><b>Plan in Implementation</b></a
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs12 />
              <v-col
                class="text-left"
                :class="[$vuetify?.breakpoint?.smAndDown ? 'pb-2 pt-2' : '', $vuetify?.breakpoint?.mdAndUp ? 'pl-3' : '']"
              >
                <h2 class="font-weight-medium">
                  {{ selectedPlan.NAME }}
                </h2>
              </v-col>
              <v-col xs12 pb-4 />
              <v-col v-if="reviewPanel">
                <v-row>
                  <v-col v-if="$vuetify?.breakpoint?.smAndDown" xs6 sm6 pb-3 pl-3>
                    <v-col>Status</v-col>
                    <v-col>
                      <b>Active</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="$vuetify?.breakpoint?.smAndDown" inset vertical dark class="hr_border" />
                  <v-col xl2 xs5 lg2 md3 sm5 pb-3 pl-3>
                    <v-col>Plan ID</v-col>
                    <v-col class="pt-1">
                      <b>{{ selectedPlan.PLANID }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.smAndDown" inset vertical dark class="hr_border" />
                  <v-col xl2 xs6 lg2 md3 sm6 pb-3 pl-3>
                    <v-col>EIN</v-col>
                    <v-col class="pt-1">
                      <b>{{ selectedPlan.EIN }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col xl2 xs5 lg2 md3 sm5 pb-3 pl-3>
                    <v-col>Total Plan Asset</v-col>
                    <v-col class="pt-1">
                      <b>{{ formatPrice(selectedPlan.ASSETS != null ? selectedPlan.ASSETS : 0, 2) }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.smAndDown" inset vertical dark class="hr_border" />
                  <v-col xl2 xs6 lg2 md2 sm6 pb-3 pl-3>
                    <v-col>Type</v-col>
                    <v-col class="pt-1">
                      <b>{{ selectedPlan.PlanType }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.md" inset vertical dark class="hr_border" />
                  <v-col xl3 xs5 lg2 md3 sm5 pb-3 pl-3>
                    <v-col>Plan Year</v-col>
                    <v-col class="pt-1">
                      <b>{{ selectedPlan.YrEndDate ? new Date(selectedPlan.YrEndDate).toLocaleDateString() : '' }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="$vuetify?.breakpoint?.mdOnly" inset vertical dark class="hr_border" />
                  <v-col xl2 xs6 md6 lg4 sm6 pb-3 pl-3>
                    <v-col>Plan Sponsors</v-col>
                    <v-col :class="$vuetify?.breakpoint?.xs ? 'pr-2 pt-1' : 'pt-1'">
                      <b>
                        <span>
                          {{ selectedPlan.PlanSponsorName }}
                          <br />
                          {{ selectedPlan.PlanSponsorBillingStreet }}
                          {{ selectedPlan.PlanSponsorBillingCity }},
                          {{ selectedPlan.PlanSponsorBillingState }}
                          {{ selectedPlan.PlanSponsorBillingPostalCode }}
                        </span>
                      </b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.mdOnly" inset vertical dark class="hr_border" />
                  <v-col xl4 xs5 md6 lg4 sm5 pb-3 pl-3>
                    <v-col>Plan Relationship Manager</v-col>
                    <v-col :class="$vuetify?.breakpoint?.xs ? 'pr-2 pt-1' : 'pt-1'">
                      <b>
                        <span>
                          {{ selectedPlan.RelationshipManagerName }}<br />
                          {{ selectedPlan.RelationshipManagerPhone }}<br />
                          {{ selectedPlan.RelationshipManagerEmail }}
                        </span>
                      </b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.smAndDown" inset vertical dark class="hr_border" />
                  <v-col xl2 xs6 md5 lg3 sm6 pb-3 pl-3>
                    <v-col>Primary Advisor</v-col>
                    <v-col :class="$vuetify?.breakpoint?.xs ? 'pr-2 pt-1' : 'pt-1'">
                      <b>
                        <span>
                          {{ selectedPlan.PrimaryAdvisor }}
                        </span>
                      </b>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </v-col>
</template>

<script>
import * as XLSX from 'xlsx'
export default {
  props: ['selectedPlan', 'planId', 'printing'],
  data() {
    return {
      reviewPanel: true,
      asOfDate: new Date(),
      googleMarkerimg: '',
      planStatus: 'Select Status',
      status: '',
      statusList: [
        { text: 'Closed Won', value: 1 },
        { text: 'Closed Lost', value: 2 }
      ],
      dialog: false,
      showStatus: false,
      formValid: false,
      planInformationLoading: true
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    }
  },
  watch: {
    selectedPlan: {
      handler() {
        this.GetMap()
        this.planInformationLoading = false
      },
      deep: true
    }
  },
  mounted() {
    this.GetMap()
  },
  methods: {
    initiateManagePlanSSOLogin() {
      if (!this.selectedPlan.Source) {
        if (this.$store.state.isImpersonating) {
          this.$toast.warning(
            'Plan Portal SSO is unavailable when impersonating another user.',
            '',
            this.notificationSystem.options.warning
          )

          return
        }
        this.onPopUpEvent(`/api/v1/retention/pcs401k/sso/initiate?key=${this.selectedPlan.PLANID}&target=plan`, '_AccountLink')
      } else
        this.onPopUpEvent(`/api/v1/retention/tsm/sso/initiate?planId=${this.selectedPlan.PLANID}`, `_${this.selectedPlan.Source}`)
    },
    GetMap() {
      if (!this.selectedPlan.PlanSponsorBillingPostalCode) return
      var height = this.$vuetify?.breakpoint?.md ? '250' : '200'
      var queryString = `locs=${
        this.selectedPlan.PlanSponsorBillingStreet
          ? this.selectedPlan.PlanSponsorBillingStreet.replace('#', ' ')
          : this.selectedPlan.PlanSponsorBillingStreet
      },${this.selectedPlan.PlanSponsorBillingCity},${this.selectedPlan.PlanSponsorBillingState},${
        this.selectedPlan.PlanSponsorBillingPostalCode
      }`

      queryString += '&size=' + this.$refs.staticMap.clientWidth + 'x' + height + '&scale=2'

      var apiUrl = `/api/v1/tal/plan/map?${queryString}`

      this.$axios(apiUrl, {
        method: 'GET',
        responseType: 'blob'
      }).then((success) => {
        this.googleMarkerimg = ''
        var file = new Blob([success.data], { type: 'image/png' })
        var url = URL.createObjectURL(file)
        this.googleMarkerimg = url
      })
    },
    print() {
      this.printing()
    },
    onResize() {
      this.GetMap()
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
        this.currencyConvert(wb, 'E', Xrow)
      }
      XLSX.writeFile(wb, 'Plan.xlsx')
    },
    currencyConvert(xlWb, xlColRef, xlRowNum) {
      XLSX.utils.cell_set_number_format(xlWb.Sheets['Plan'][xlColRef + xlRowNum], '[$$-409]#,##0.00;-[$$-409]#,##0.00')
    },
    ExportPlan(plans) {
      var xlHeaders = plans.map((rec) => {
        return {
          'Plan ID': rec.PLANID,
          Name: rec.NAME,
          'EIN#': rec.EIN,
          'Type of Plan': rec.PlanType,
          'Total Plan Asset': rec.ASSETS,
          TPA: rec.TPA,
          'Plan Year Begin': rec.YrBegDate !== null ? new Date(rec.YrBegDate).toLocaleDateString() : '',
          'Plan Year End': rec.YrEndDate !== null ? new Date(rec.YrEndDate).toLocaleDateString() : '',
          'Plan Sponsor Name': rec.PlanSponsorName,
          'Plan Sponsor Street': rec.PlanSponsorBillingStreet,
          'Plan Sponsor City': rec.PlanSponsorBillingCity,
          'Plan Sponsor State': rec.PlanSponsorBillingState,
          'Plan Sponsor Zip': rec.PlanSponsorBillingPostalCode,
          'Plan Contact Name': rec.PlanContactName,
          'Plan Contact Phone': rec.PlanContactPhone,
          'Plan Contact Email': rec.PlanContactEmail,
          Models: rec.Models,
          Investments: rec.Investments,
          'Total Employees': rec.TotalParticipants,
          'Active Participant With a Balance': rec.ActiveParticipantsWithABalance,
          'Participant Without a Balance': rec.ParticipantsWithABalances,
          'DISCLOSURE LINK': rec.DISCLOSURE_LINK,
          'DISCLOSURE RUNDATE':
            rec.DISCLOSURE_RUNDATE !== '0001-01-01T00:00:00' && rec.DISCLOSURE_RUNDATE !== null
              ? new Date(rec.DISCLOSURE_RUNDATE).toLocaleDateString()
              : '',
          'DISCLOSURE NEEDS REVIEW': rec.DISCLOSURE_NEEDSREVIEW,
          'DISCLOSURE ID': rec.DISCLOSURE_ID,
          'REVIEW LINK': rec.REVIEW_LINK,
          'REVIEW RUNDATE':
            rec.REVIEW_RUNDATE !== '0001-01-01T00:00:00' && rec.REVIEW_RUNDATE !== null
              ? new Date(rec.REVIEW_RUNDATE).toLocaleDateString()
              : '',
          'REVIEW POSTED': rec.REVIEW_POSTED,
          'REVIEW NEEDS REVIEW': rec.REVIEW_NEEDSREVIEW,
          'REVIEW ID': rec.REVIEW_ID,
          'GUIDE LINK': rec.GUIDE_LINK,
          'GUIDE RUNDATE':
            rec.GUIDE_RUNDATE !== '0001-01-01T00:00:00' && rec.GUIDE_RUNDATE !== null
              ? new Date(rec.GUIDE_RUNDATE).toLocaleDateString()
              : '',
          'GUIDE NEEDS REVIEW': rec.GUIDE_NEEDSREVIEW,
          'GUIDE ID': rec.GUIDE_ID,
          'OVERVIEW LINK': rec.OVERVIEW_LINK,
          'OVERVIEW RUNDATE':
            rec.OVERVIEW_RUNDATE !== '0001-01-01T00:00:00' && rec.OVERVIEW_RUNDATE !== null
              ? new Date(rec.OVERVIEW_RUNDATE).toLocaleDateString()
              : '',
          'ALL IN ONE LINK': rec.ALLINONE_LINK,
          'ALL IN ONE RUNDATE':
            rec.ALLINONE_RUNDATE !== '0001-01-01T00:00:00' && rec.ALLINONE_RUNDATE !== null
              ? new Date(rec.ALLINONE_RUNDATE).toLocaleDateString()
              : '',
          'ALL IN ONE NEEDS REVIEW': rec.ALLINONE_NEEDSREVIEW,
          'ALL IN ONE ID': rec.ALLINONE_ID,
          SFID: rec.SFID
        }
      })
      return xlHeaders
    }
  }
}
</script>
<style scoped>
.information_review .v-subheader {
  height: 28px !important;
}
.hr_border {
  border: solid 1px lightgray !important;
  height: 60px;
}
.v-label {
  font-size: 0.93em !important;
  color: grey !important;
}

.map_image_border {
  border: solid 1px lightgrey;
}
.img_slection_none {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.theme--light .v-sheet {
  color: #a8a8bd !important;
}
</style>
