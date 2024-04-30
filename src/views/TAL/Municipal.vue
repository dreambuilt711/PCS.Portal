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
            <PlanStar :municipal-id="municipalId" from="TAL" />
          </div>
        </v-row>
      </v-col>
      <v-col xs12>
        <v-card class="elevation-4">
          <MunicipalDetails :selected-municipal="selectedMunicipal ? selectedMunicipal : []" />
        </v-card>
      </v-col>
      <!-- tabs start here -->
      <v-col v-if="$vuetify?.breakpoint?.smAndDown ? (createReport ? true : false) : true" pt-1>
        <v-row>
          <v-col mt-2 :class="$vuetify?.breakpoint?.smAndDown ? 'xs11 sm11' : 'xs12 sm12'">
            <v-card>
              <v-tabs
                v-model="municipalTab"
                :bg-color="$vuetify?.theme.dark ? '' : 'accent'"
                class="plantabs"
                align-tabs="center"
                center-active
                show-arrows
                slider-color="white"
              >
                <v-tab v-for="(item, index) in municipalTabList" :key="index" style>
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
              <SchoolActivity :selected-school="selectedMunicipal ? selectedMunicipal : []" />
            </v-col>
          </v-card>
        </v-col>
      </v-col>
    </v-container>
  </v-container>
</template>
<script>
import MunicipalDetails from '@/components/TAL/Finder/Municipalities/MunicipalDetail'
import SchoolActivity from '@/components/TAL/SchoolActivity'
import PlanStar from '@/components/TAL/PlanStar'
import * as XLSX from 'xlsx'
export default {
  components: {
    MunicipalDetails,
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
      municipalTab: 0,
      municipalTabList: [{ text: 'Activity', value: 'activity' }],
      lastPath: this.$route.params.lastRoute,
      prevRoute: '',
      zipcode: null,
      radius: 0,
      selectedMunicipal: [],
      searchText: '',
      municipalLoading: true,
      municipalId: '',
      municipalName: ''
    }
  },
  mounted() {
    this.getMunicipalDetail()
    if (this.$vuetify?.breakpoint?.smAndDown) {
      this.createReport = true
    }
  },
  created() {
    var that = this
    window.onbeforeunload = function () {
      if (that.prevRoute.fullPath !== '/') localStorage.setItem('municipalLastRoute', that.prevRoute.fullPath)
    }
    if (localStorage.lastRoute && localStorage.lastRoute !== '/') this.lastRoute = localStorage.municipalLastRoute
  },
  methods: {
    encodeQueryData(data) {
      const ret = []
      for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
      return ret.join('&')
    },
    async getMunicipalDetail() {
      if (this.$route.query.Id) this.municipalId = this.$route.query.Id
      if (this.$route.query.zipcode) this.zipcode = this.$route.query.zipcode
      if (this.$route.query.radius) this.radius = this.$route.query.radius
      if (this.$route.query.name) this.municipalName = this.$route.query.name
      if (this.municipalName) {
        this.$axios.get(`/api/v1/municipal?searchCriteria=${this.municipalName}`).then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            var municipalValue = success.data.d
            this.selectedMunicipal = municipalValue.filter((d) => d.DepartmentId === this.municipalId)
            this.municipalLoading = false
          } else {
            this.selectedMunicipal = []
            this.municipalLoading = false
          }
        })
      } else if (this.zipcode > 0 && this.radius > 0) {
        var promises = []
        var url = '/api/v1/municipal'
        let urlObj = {}
        if (this.zipcode) {
          urlObj['zipcode'] = this.zipcode
          url = `/api/v1/municipal?${this.encodeQueryData(urlObj)}`
        }
        if (this.radius) {
          urlObj['radius'] = this.radius
          url = `/api/v1/municipal?${this.encodeQueryData(urlObj)}`
        }
        if (this.searchText) {
          urlObj['searchCriteria'] = this.searchText
          url = `/api/v1/municipal?${this.encodeQueryData(urlObj)}`
        }

        promises.push(
          this.$axios.get(`${url}`).then((success) => {
            if (success.data.d && success.data.d.length > 0) {
              var municipalValue = success.data.d
              this.selectedMunicipal = municipalValue.filter((d) => d.DepartmentId === this.municipalId)
              this.municipalLoading = false
            } else {
              this.selectedMunicipal = []
              this.municipalLoading = false
            }
          })
        )
        await Promise.allSettled(promises)
      } else if (this.$store.state.finderList.municipalData) {
        this.selectedMunicipal = this.$store.state.finderList.municipalData.filter((d) => d.DepartmentId === this.municipalId)
        this.municipalLoading = false
      }
    },
    ExportMunicipal(selectedMunicipal) {
      var xlHeaders = selectedMunicipal.map((rec) => {
        return {
          DepartmentId: rec.DepartmentId ? rec.DepartmentId : '',
          Name: rec.Name ? rec.Name : '',
          Employees: rec.Employees ? rec.Employees : '',
          Address: rec.Address ? rec.Address : '',
          City: rec.City ? rec.City : '',
          State: rec.State ? rec.State : '',
          Zip: rec.Zip ? rec.Zip : '',
          County: rec.County ? rec.County : '',
          Population: rec.Population ? rec.Population : '',
          'Department Type': rec.DepartmentType ? rec.DepartmentType : null,
          Specializations: rec.Specializations ? rec.Specializations : null,
          Firefighters: rec.Firefighters ? rec.Firefighters : null,
          'Emergency Personnel': rec.EmergencyPersonnel ? rec.EmergencyPersonnel : null,
          Officers: rec.Officers ? rec.Officers : null,
          'Department Status': rec.DepartmentStatus ? rec.DepartmentStatus : null,
          'Department Finance': rec.DepartmentFinance ? rec.DepartmentFinance : null,
          Phone: rec.Phone ? rec.Phone : null
        }
      })
      return xlHeaders
    },
    exportToExcel() {
      var xlHeaders = []
      var municipalResult = []
      var selected = []
      selected.push(this.selectedMunicipal)
      xlHeaders = this.ExportMunicipal(selected[0])
      municipalResult = XLSX.utils.json_to_sheet(xlHeaders)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, municipalResult, 'Municipalities')
      XLSX.writeFile(wb, 'Municipalities.xlsx')
    }
  }
}
</script>
<style scoped>
.label {
  color: red;
}

.darkmode_background {
  background: #424242 !important;
}

.border_radius_2 {
  border-radius: 2px !important;
}
</style>
