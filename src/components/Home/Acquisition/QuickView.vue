<template>
  <v-card
    class="elevation-3"
    :height="
      fontSize > 12
        ? $vuetify?.breakpoint?.xs
          ? ''
          : '38.462em'
        : fontSize > 10
          ? $vuetify?.breakpoint?.xs
            ? ''
            : '44em'
          : fontSize > 8
            ? $vuetify?.breakpoint?.xs
              ? ''
              : '53em'
            : fontSize === 8 && $vuetify?.breakpoint?.xs
              ? ''
              : '58.500em'
    "
  >
    <v-progress-linear v-if="loader" indeterminate color="accent" class="mt-0 position_absolute mb-1" height="4" />
    <v-col class="pa-5">
      <v-col>
        <h6 class="text-h6 font_20" :class="$vuetify?.theme.dark ? '' : 'text-black'">Quick View</h6>
      </v-col>
      <v-col pt-8 pb-8>
        <v-col>
          <v-row>
            <v-col
              v-for="item in QuickViewHeaderList"
              v-show="item.display"
              :key="item.id"
              :class="
                item.id === 1
                  ? fontSize >= 15 && $vuetify?.breakpoint?.width === 768
                    ? 'widthFirstColumnLargeFont lg6 xl6 md6 sm5 xs6'
                    : 'widthFirstColumn lg6 xl6 md6 sm6 xs6'
                  : $vuetify?.breakpoint?.width === 768 && item.id === 2
                    ? 'lg3 xl3 md3 sm4 xs3'
                    : 'lg3 xl3 md3 sm3 xs3'
              "
              class="font-weight-medium text-center"
            >
              <v-col>
                <CustomIcon :type="item.icon" />
              </v-col>
              <v-col :class="$vuetify?.breakpoint?.xs && item.name === 'Individuals' ? 'pl-1' : ''">
                {{ item.name }}
              </v-col>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-col v-for="item in QuickViewDataList" :key="item.id" pt-3>
            <v-row>
              <v-col lg6 xl6 md6 sm6 xs6 style="width: 40%" class="font-weight-medium">
                <v-row>
                  <v-col v-if="item.name === 'My Favorites'" xs2 class="text-center">
                    <v-icon color="pink-darken-3"> star </v-icon>
                  </v-col>
                  <v-col v-else xs2 class="text-center">
                    <CustomIcon :type="'prospectFilledIcon'" />
                  </v-col>
                  <v-col>{{ item.name }}</v-col>
                </v-row>
              </v-col>
              <v-col
                v-if="item.name === 'My Favorites'"
                lg3
                xl3
                md3
                sm3
                xs3
                class="font-weight-medium handcursor text-center"
                :class="!$vuetify?.theme.dark ? 'text-accent' : ''"
                @click="redirectToLeadSearch('plans')"
              >
                {{ constantPlanCount + schoolDataCount }}
              </v-col>
              <v-col
                v-else
                lg3
                xl3
                md3
                sm3
                xs3
                class="font-weight-medium handcursor text-center"
                :class="!$vuetify?.theme.dark ? 'text-accent' : ''"
                @click="viewDetails('plans')"
              >
                {{ totalPlansCount }}
              </v-col>
              <v-col
                v-if="item.name === 'My Favorites'"
                lg3
                xl3
                md3
                sm3
                xs3
                class="font-weight-medium handcursor text-center"
                :class="[!$vuetify?.theme.dark ? 'text-accent' : '']"
                @click="redirectToLeadSearch('individuals')"
              >
                {{ individualCount }}
              </v-col>
              <v-col
                v-else
                lg3
                xl3
                md3
                sm3
                xs3
                class="font-weight-medium handcursor text-center"
                :class="[!$vuetify?.theme.dark ? 'text-accent' : '']"
                @click="viewDetails('individual')"
              >
                {{ individualDataCount }}
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-col>
      <v-divider />
      <v-col pt-12 pb-12 mt-4 mb-4 pl-6 pr-6>
        <v-col text-center>
          <h6 class="text-h6 font_20" :class="$vuetify?.theme.dark ? '' : 'text-black'">Create Start-up Plan</h6>
        </v-col>
        <v-col pt-3 class="text-center font-weight-medium">
          If you have information for a company that does not currently have a retirement plan for their employees, turn them a
          prospect using the free form method.
        </v-col>
      </v-col>
      <v-col xs12>
        <v-col
          v-if="$authz.hasPermission($authz.permissionSet.Finder__c, $authz.permission.Full)"
          class="text-right"
          :class="[
            $vuetify?.breakpoint?.smAndUp ? 'widgetButtonPosition pr-1' : 'pt-4',
            $vuetify?.breakpoint?.smOnly ? 'pt-3' : ''
          ]"
        >
          <v-btn
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            :class="$vuetify?.breakpoint?.xs ? 'mb-0 mr-0' : 'mr-0'"
            @click="redirect()"
          >
            Create
          </v-btn>
        </v-col>
      </v-col>
    </v-col>
  </v-card>
</template>
<script>
import CustomIcon from '@/components/CustomIcon'
export default {
  components: {
    CustomIcon
  },
  props: ['liveWidth', 'totalPlansCount', 'individualDataCount'],
  data() {
    return {
      QuickViewHeaderList: [
        {
          id: 1,
          name: '',
          value: '',
          width: '40%',
          display: true
        },
        {
          id: 2,
          name: 'Companies',
          value: 'Companies',
          icon: 'employeeSponsor',
          width: '30%',
          display: true
        },
        {
          id: 3,
          name: 'Individuals',
          value: 'Individuals',
          icon: 'acctIcon',
          width: '30%',
          display: true
        }
      ],
      QuickViewDataList: [
        {
          id: 1,
          name: 'My Favorites'
        },
        {
          id: 2,
          name: 'My Prospects'
        }
      ],
      constantPlanCount: 0,
      searchResult: [],
      schoolDataCount: 0,
      individualCount: 0,
      loader: true
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    },
    showIndividual() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          )
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          (this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Individuals
            )) ||
          (this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Municipalities
            )) ||
          (this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Schools
            ))
        )
      } else return true
    },
    showEmployerSponsored() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    }
  },
  mounted() {
    this.$store.dispatch('getStarredPlans').then(() => {
      this.getStarredCountData()
    })
  },
  methods: {
    redirect() {
      this.$router.push('/TAL/StartupPlan').catch(() => {})
    },
    viewDetails(type) {
      if (type === 'plans') this.$router.push('/TAL/Plans').catch(() => {})
      else
        this.$router
          .push({
            name: 'TALProspectPlans',
            query: { Individuals: 'individuals' }
          })
          .catch(() => {})
    },
    redirectToLeadSearch(tabType) {
      this.$router
        .push({
          name: 'TALFinderResult',
          query: {
            isStarred: 'starred',
            tabType: tabType
          }
        })
        .catch(() => {})
    },
    getStarredCountData() {
      var starredPlans = this.$store.state.starredPlansSearchRequest.planSearchRequest
        ? this.$store.state.starredPlansSearchRequest.planSearchRequest.einList
        : []
      var starredSchoolPlans = this.$store.state.starredPlansSearchRequest.planSearchRequest
        ? this.$store.state.starredPlansSearchRequest.planSearchRequest.schoolIdList
        : []
      var starredIndividualPlans =
        this.$store.state.starredPlansSearchRequest.planSearchRequest &&
        this.$store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList
          ? this.$store.state.starredPlansSearchRequest.planSearchRequest.houseHoldIdList
          : []
      this.constantPlanCount = starredPlans ? starredPlans.length : 0
      this.schoolDataCount = starredSchoolPlans ? starredSchoolPlans.length : 0
      this.individualCount = starredIndividualPlans ? starredIndividualPlans.length : 0
      this.loader = false
    }
  }
}
</script>
<style scoped>
.widthFirstColumn {
  width: 55%;
}
.widthFirstColumnLargeFont {
  width: 46%;
}
</style>
