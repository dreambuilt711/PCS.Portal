<template>
  <v-container ref="printContent" fluid>
    <v-col>
      <v-col xs12 pt-2 pb-2>
        <v-row>
          <v-col class="pt-2" :class="$vuetify?.breakpoint?.smAndDown ? 'pl-2 pb-1' : 'pb-2'">
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
                  @click="goBack()"
                  >BACK</span
                >
              </span>
            </router-link>
          </v-col>
          <v-col class="text-right align-self" :class="$vuetify?.breakpoint?.smAndDown ? 'pt-2 pb-1' : ''">
            <v-col v-if="$authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full)">
              <a
                href="#"
                class="text-uppercase text-decoration-none pr-1 font_14"
                :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
                style="padding-right: 5px !important"
                @click="exportToExcel()"
                >Export</a
              >
              |
            </v-col>
            <v-col>
              <a
                v-show="false"
                :class="
                  !$vuetify?.theme.dark
                    ? 'text-hyperlink text-decoration-none pr-2 text-uppercase font-weight-medium'
                    : 'text-white text-decoration-none pr-2 text-uppercase font-weight-medium'
                "
                style="padding-right: 5px !important; padding-left: 5px !important"
                @click="initiateManagePlanSSOLogin()"
              >
                Manage Household
                <span data-html2canvas-ignore="true">
                  <v-icon class="pl-1" size="small" :color="$vuetify?.theme.dark ? '' : 'accent'"
                    >fas fa-external-link-alt</v-icon
                  >
                </span>
              </a>
            </v-col>
          </v-col>
          <div style="padding-left: 5px !important" class="pt-1">
            <PlanStar :household-id="householdId" from="TAL" type="Individual" />
          </div>
        </v-row>
      </v-col>
      <v-card class="elevation-6">
        <v-col id="printMe">
          <v-col>
            <HouseholdInformation
              :key="componentkey"
              :selected-individual-data="selectedIndividualData"
              @overview-tab-display="overviewTabDisplay"
            />
          </v-col>
        </v-col>
      </v-card>
      <v-col xs12 pb-4 />
      <v-col pt-1>
        <v-row>
          <v-col id="step1" class="xs12 sm12">
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
                <v-tab v-for="(item, index) in items" :key="index" style :disabled="item.disableItem">
                  {{ item.text }}
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col xs12 pb-4 />
      <v-layout class="justify-center stepper_main">
        <v-col v-show="reports === 'Overview'" :class="$vuetify?.breakpoint?.smAndDown ? 'pa-2' : ''">
          <HouseholdOverview
            :key="componentkey"
            :display-overview="displayOverview"
            :Id="Id"
            :selected-individual-data="selectedIndividualData"
          />
        </v-col>
        <v-col v-show="reports === 'Holdings'" :class="$vuetify?.breakpoint?.smAndDown ? 'pa-2' : ''">
          <HouseholdHoldings :key="componentkey" :selected-individual-data="selectedIndividualData" />
        </v-col>
        <v-col v-show="reports === 'Activity'" :class="$vuetify?.breakpoint?.smAndDown ? 'pa-2' : ''">
          <HouseholdActivity :key="componentkey" />
        </v-col>
      </v-layout>
    </v-col>
  </v-container>
</template>
<script>
import PlanStar from '@/components/TAL/PlanStar'
import HouseholdOverview from '@/components/TAL/Finder/Households/HouseholdOverview'
import HouseholdHoldings from '@/components/TAL/Finder/Households/HouseholdHoldings'
import HouseholdActivity from '@/components/TAL/Finder/Households/HouseholdActivity'
import HouseholdInformation from '@/components/TAL/Finder/Households/HouseholdInformation'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  components: {
    PlanStar,
    HouseholdOverview,
    HouseholdInformation,
    HouseholdHoldings,
    HouseholdActivity
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  data() {
    return {
      componentkey: 0,
      mywidth: 0,
      createReport: true,
      reportsTab: 0,
      reports: 'Overview',
      items: [
        { text: 'Overview', value: 'Overview', disableItem: false },
        { text: 'Holdings', value: 'Holdings', disableItem: false }
      ],
      displayOverview: true,
      Id: 1,
      prevRoute: '',
      lastRoute: '',
      lastPath: this.$route.params.lastRoute,
      selectedIndividualData: [],
      householdId: '',
      householdName: '',
      accountId: 0,
      AccountSummary: []
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    }
  },
  watch: {
    reportsTab: function (val) {
      if (val === 0) {
        this.reports = 'Overview'
      }
      if (val === 1) {
        this.reports = 'Holdings'
      }
      if (val === 2) {
        this.reports = 'Activity'
      }
    }
  },
  created() {
    var that = this
    window.onbeforeunload = function () {
      if (that.prevRoute.fullPath !== '/') localStorage.setItem('householdLastRoute', that.prevRoute.fullPath)
    }
    if (localStorage.lastRoute && localStorage.lastRoute !== '/') this.lastRoute = localStorage.householdLastRoute
  },
  unmounted() {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  mounted() {
    this.getIndividualData()
  },
  methods: {
    goBack() {
      if (this.prevRoute.fullPath === '/') {
        this.$store.state.finderList = {}
      } else {
        this.$router.push(this.prevRoute.fullPath)
      }
    },
    overviewTabDisplay(val) {
      this.displayOverview = val.displayOverview
      this.Id = val.Id
    },
    async getIndividualData() {
      this.householdId = this.$route.query.householdId
      this.householdName = this.$route.query.householdName
      this.accountId = this.$route.query.accountId ? this.$route.query.accountId : 0
      if (this.$store.state.finderList.individualData) {
        if (this.householdId) {
          this.selectedIndividualData = this.$store.state.finderList.individualData.filter(
            (d) => d.householdId === this.householdId
          )
        } else {
          this.selectedIndividualData = this.$store.state.finderList.individualData.filter((a) => {
            let individualArray = a.individualAccounts.filter((b) => {
              return b.accountId === this.accountId
            })
            if (individualArray.length > 0) return true
            else return false
          })
        }
      } else {
        var FilterParticipantDetails = {
          Page: 1,
          Size: 50,
          Searchcriteria: this.householdName
        }
        var promises = []
        promises.push(
          this.$axios.post(`/api/v1/tal/individualpagination`, FilterParticipantDetails).then((success) => {
            if (success.data.d) {
              let householdDetail = success.data.d
              if (householdDetail.individualData && householdDetail.individualData.length > 0) {
                if (this.householdId) {
                  this.selectedIndividualData = success.data.d.individualData.filter((d) => d.householdId === this.householdId)
                } else {
                  this.selectedIndividualData = success.data.d.individualData.filter((a) => {
                    let individualArray = a.individualAccounts.filter((b) => {
                      return b.accountId === this.accountId
                    })
                    if (individualArray.length > 0) return true
                    else return false
                  })
                }
              } else {
                this.selectedIndividualData = []
              }
            } else {
              this.selectedIndividualData = []
            }
          })
        )
      }
    },
    exportHousehold(selectedIndividualData) {
      var xlHeaders = selectedIndividualData.map((rec) => {
        return {
          'Individual Account Id': rec.individualAccounts[0].account,
          'Individual Household Id': rec.householdId,
          'Individual Household Name': rec.householdName,
          'Individual Address': rec.individualAccounts[0].accountAddress,
          'Individual Account Type': rec.individualAccounts[0].accountType
        }
      })
      return xlHeaders
    },
    exportToExcel() {
      var xlHeaders = []
      var schoolResult = []
      var selected = []
      selected.push(this.selectedIndividualData)
      xlHeaders = this.exportHousehold(selected[0])
      schoolResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, schoolResult, 'Individual')
      XLSX.writeFile(wb, 'Individual.xlsx')
    },
    printing() {
      const doc = new jsPDF('l', 'mm', 'a4')
      var that = this
      html2canvas(this.$refs.printContent, {
        letterRendering: 0,
        allowTaint: true,
        useCORS: true,
        scale: 5
      }).then(function (canvas) {
        const img = canvas.toDataURL('image/jpeg', 0.8)
        var width = doc.internal.pageSize.getWidth()
        var height = doc.internal.pageSize.getHeight()

        if (that.$vuetify?.breakpoint?.lg) doc.addImage(img, 'JPEG', 0, 0, 240, 200)
        else if (that.$vuetify?.breakpoint?.md) doc.addImage(img, 'JPEG', 30, 10, 240, 200)
        else if (that.$vuetify?.breakpoint?.sm) doc.addImage(img, 'JPEG', 10, 0, width - 20, height)
        else if (that.$vuetify?.breakpoint?.xs) doc.addImage(img, 'JPEG', 90, 10, 100, 200)
        else if (that.$vuetify?.breakpoint?.xl) doc.addImage(img, 'JPEG', 0, 0, width, height)
        doc.save('Plan_details.pdf')
      })
    }
  }
}
</script>
