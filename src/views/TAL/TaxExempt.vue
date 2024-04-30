<template>
  <v-container
    :class="[$vuetify?.breakpoint?.smAndDown ? 'pl-1 pr-1' : 'container--fluid', $vuetify?.theme.dark ? 'dark_bg' : '']"
  >
    <v-container class="pt-1" :class="$vuetify?.breakpoint?.smAndDown ? 'pl-0 pr-0' : 'container--fluid'">
      <v-col xs12 pt-2 pb-2>
        <v-row>
          <v-col class="pt-2" :class="$vuetify?.breakpoint?.smAndDown ? 'pl-2 pb-1' : 'pb-1'">
            <router-link
              :to="prevRoute.fullPath !== '/' ? (prevRoute.fullPath ? prevRoute.fullPath : '/') : lastRoute"
              class="text-decoration-none"
            >
              <span :class="$vuetify?.theme.dark ? 'text-white cursor-pointer' : 'text-hyperlink cursor-pointer'">
                <v-icon size="small" :class="$vuetify?.theme.dark ? 'text-white pb-1' : 'text-hyperlink pb-1'"
                  >fas fa-angle-left</v-icon
                >
                <span
                  :class="
                    $vuetify?.theme.dark ? 'text-white pl-2 text-uppercase font_14' : 'text-hyperlink pl-2 text-uppercase font_14'
                  "
                  >Back</span
                >
              </span>
            </router-link>
          </v-col>
          <v-col
            v-if="$authz.hasPermission($authz.permissionSet.Prospects_Export_Option__c, $authz.permission.Full)"
            class="text-right align-self"
            :class="$vuetify?.breakpoint?.smAndDown ? 'pt-2 pb-1' : ''"
          >
            <a
              href="#"
              class="text-uppercase text-decoration-none pr-1 font_14"
              :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'"
              style="padding-right: 5px !important"
              @click="exportToExcel()"
              >Export</a
            >
            <span>|</span>
          </v-col>
          <div style="padding-left: 5px !important" class="pt-1">
            <PlanStar :tax-exempt-id="EIN" from="TAL" />
          </div>
        </v-row>
      </v-col>
      <v-col xs12>
        <v-card class="elevation-4">
          <TaxExemptDetail :selected-tax-exempt="selectedTaxExempt ? selectedTaxExempt : []" />
        </v-card>
      </v-col>
      <!-- tabs start here -->
      <v-col v-if="$vuetify?.breakpoint?.smAndDown ? (createReport ? true : false) : true" pt-1>
        <v-row>
          <v-col mt-2 :class="$vuetify?.breakpoint?.smAndDown ? 'xs11 sm11' : 'xs12 sm12'">
            <v-card>
              <v-tabs
                v-model="taxExemptTab"
                :bg-color="$vuetify?.theme.dark ? '' : 'accent'"
                class="plantabs"
                align-tabs="center"
                center-active
                show-arrows
                slider-color="white"
              >
                <v-tab v-for="(item, index) in taxExemptTabList" :key="index" style>
                  {{ item.text }}
                </v-tab>
              </v-tabs>
            </v-card>
          </v-col>
          <v-col
            v-if="$vuetify?.breakpoint?.smAndDown"
            :class="[
              $vuetify?.breakpoint?.smAndDown ? 'xs1 sm1 elevation-1 text-center' : '',
              $vuetify?.theme.dark ? 'darkmode_background' : 'accent'
            ]"
            style="height: 45px !important"
            mt-2
            @click="createReport = !createReport"
          >
            <v-icon class="text-secondary mt-2 pt-1 cursor-pointer"> remove_circle </v-icon>
          </v-col>
        </v-row>
      </v-col>

      <v-col
        v-if="$vuetify?.breakpoint?.smAndDown"
        v-show="!createReport"
        xs12
        sm12
        mt-2
        class="pt-2 pb-2 pl-2 pr-1 text-secondary border_radius_2"
        :class="$vuetify?.theme.dark ? 'darkmode_background' : 'accent'"
        @click="createReport = !createReport"
      >
        <v-row>
          <v-col xs11 sm11 pt-1> Select Type </v-col>
          <v-col xs1 sm1 class="text-center cursor-pointer">
            <v-icon class="text-secondary"> add_circle </v-icon>
          </v-col>
        </v-row>
      </v-col>
      <!-- Activity tab -->
      <v-col v-if="$vuetify?.breakpoint?.smAndDown ? (createReport ? true : false) : true">
        <v-col xl12 lg12 md12 mt-4>
          <v-card>
            <h2 class="pt-3 pb-3 font-weight-medium" :class="$vuetify?.breakpoint?.xs ? 'pl-2' : 'pl-4'">Activity</h2>
            <v-col>
              <SchoolActivity :selected-tax-exempt="selectedTaxExempt ? selectedTaxExempt : []" />
            </v-col>
          </v-card>
        </v-col>
      </v-col>
    </v-container>
  </v-container>
</template>
<script>
import TaxExemptDetail from '@/components/TAL/Finder/TaxExemption/TaxExemptionDetail'
import SchoolActivity from '@/components/TAL/SchoolActivity'
import PlanStar from '@/components/TAL/PlanStar'
import * as XLSX from 'xlsx'
export default {
  components: {
    TaxExemptDetail,
    SchoolActivity,
    PlanStar
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  data() {
    return {
      createReport: false,
      taxExemptTab: 0,
      taxExemptTabList: [{ text: 'Activity', value: 'activity' }],
      lastPath: this.$route.params.lastRoute,
      prevRoute: '',
      zipcode: null,
      radius: 0,
      selectedTaxExempt: [],
      searchText: '',
      taxExemptLoading: true,
      taxExemptName: '',
      EIN: ''
    }
  },
  mounted() {
    this.getTaxExemptDetail()
    if (this.$vuetify?.breakpoint?.smAndDown) {
      this.createReport = true
    }
  },
  created() {
    var that = this
    window.onbeforeunload = function () {
      if (that.prevRoute.fullPath !== '/') localStorage.setItem('taxExemptLastRoute', that.prevRoute.fullPath)
    }
    if (localStorage.lastRoute && localStorage.lastRoute !== '/') this.lastRoute = localStorage.taxExemptLastRoute
  },
  methods: {
    encodeQueryData(data) {
      const ret = []
      for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
      return ret.join('&')
    },
    async getTaxExemptDetail() {
      if (this.$route.query.name) this.taxExemptName = this.$route.query.name
      if (this.$route.query.Id) this.EIN = this.$route.query.Id
      if (this.$route.query.zipcode) this.zipcode = this.$route.query.zipcode
      if (this.$route.query.radius) this.radius = this.$route.query.radius
      if (this.taxExemptName) {
        this.$axios.get(`/api/v1/taxexempt?searchCriteria=${this.taxExemptName}`).then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            var taxExemptValue = success.data.d
            this.selectedTaxExempt = taxExemptValue.filter((d) => d.EIN === this.EIN)
            this.taxExemptLoading = false
          } else {
            this.selectedTaxExempt = []
            this.taxExemptLoading = false
          }
        })
      } else if (this.zipcode > 0 && this.radius > 0) {
        var promises = []
        var url = '/api/v1/taxexempt'
        let urlObj = {}
        if (this.zipcode) {
          urlObj['zipcode'] = this.zipcode
          url = `/api/v1/taxexempt?${this.encodeQueryData(urlObj)}`
        }
        if (this.radius) {
          urlObj['radius'] = this.radius
          url = `/api/v1/taxexempt?${this.encodeQueryData(urlObj)}`
        }
        if (this.searchText) {
          urlObj['searchCriteria'] = this.searchText
          url = `/api/v1/taxexempt?${this.encodeQueryData(urlObj)}`
        }

        promises.push(
          this.$axios.get(`${url}`).then((success) => {
            if (success.data.d && success.data.d.length > 0) {
              var taxExemptValue = success.data.d
              this.selectedTaxExempt = taxExemptValue.filter((d) => d.EIN === this.EIN)
              this.taxExemptLoading = false
            } else {
              this.selectedTaxExempt = []
              this.taxExemptLoading = false
            }
          })
        )
        await Promise.allSettled(promises)
      } else if (this.$store.state.finderList.taxExemptData) {
        this.selectedTaxExempt = this.$store.state.finderList.taxExemptData.filter((d) => d.EIN === this.EIN)
        this.taxExemptLoading = false
      }
    },
    ExportTaxExempt(selectedTaxExempt) {
      var xlHeaders = selectedTaxExempt.map((rec) => {
        return {
          Name: rec.Name ? rec.Name : '',
          Address: rec.Address ? rec.Address : '',
          City: rec.City ? rec.City : '',
          State: rec.State ? rec.State : '',
          Zip: rec.Zip ? rec.Zip : '',
          Assets: rec.Assets ? rec.Assets : '',
          Description: rec.Description ? rec.Description : '',
          EIN: rec.EIN ? rec.EIN : '',
          FormationYear: rec.FormationYear ? rec.FormationYear : '',
          PhoneNumber: rec.PhoneNumber ? rec.PhoneNumber : '',
          WebsiteAddress: rec.WebsiteAddress ? rec.WebsiteAddress : null
        }
      })
      return xlHeaders
    },
    exportToExcel() {
      var xlHeaders = []
      var taxExemptResult = []
      var selected = []
      selected.push(this.selectedTaxExempt)
      xlHeaders = this.ExportTaxExempt(selected[0])
      taxExemptResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, taxExemptResult, 'Tax-Exempt')
      XLSX.writeFile(wb, 'Tax-Exempt.xlsx')
    }
  }
}
</script>
<style scoped>
.darkmode_background {
  background: #424242 !important;
}

.border_radius_2 {
  border-radius: 2px !important;
}
</style>
