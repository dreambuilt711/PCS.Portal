<template>
  <v-container :class="isMdOnly ? 'fluid' : ''">
    <v-col xl="12" lg="12" sm="12" md="12" cols="12" class="pa-0">
      <v-row class="justify-space-around">
        <v-col xl="9" lg="12" sm="12" md="11" cols="12">
          <div v-if="isSmAndUp" class="text-center pt-3">
            <h2>Welcome to Advisor Lab, {{ userDisplayName }}</h2>
          </div>
          <v-col v-else class="text-center mb-3" cols="12">
            <div class="text-center">
              <h3>Welcome to Advisor Lab,</h3>
            </div>
            <div class="text-center">
              <h3>{{ userDisplayName }}</h3>
            </div>
          </v-col>
          <div :class="isXsOnly ? 'pt-2 pl-2' : 'pt-5 pl-2'">
            <h3>
              <b>Overview Across all programs</b>
            </h3>
          </div>
          <v-col cols="12" class="pa-0">
            <v-row>
              <v-col class="pa-0" cols="12" v-if="isMdAndUp">
                <v-row>
                  <div
                    v-for="(item, index) in overviewList"
                    :key="index"
                    class="pa-2"
                    :style="isMdAndUp ? 'width:' + 100 / overviewList.length + '%' : ''"
                  >
                    <v-card height="100px" class="pa-3 elevation-6">
                      <h4>
                        <b>{{ item.title }}</b>
                      </h4>
                      <h2 class="pt-3">
                        <b v-if="item.title === 'Total Assets'">{{ formatPrice(item.value) }}</b>
                        <b v-else>{{ new Intl.NumberFormat().format(item.value) }}</b>
                      </h2>
                    </v-card>
                  </div>
                </v-row>
              </v-col>
              <v-col class="pa-0" cols="12" v-else>
                <v-row>
                  <v-col v-for="(item, index) in overviewList" :key="index" sm="4" cols="6" class="pa-2">
                    <v-card height="100px" class="pa-3 elevation-6">
                      <h4>
                        <b>{{ item.title }}</b>
                      </h4>
                      <h2 class="pt-3">
                        <b v-if="item.title === 'Total Assets'">{{ formatPrice(item.value) }}</b>
                        <b v-else>{{ new Intl.NumberFormat().format(item.value) }}</b>
                      </h2>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pl-2 pt-4">
            <div class="pb-2">You have access to multiple Programs. Please select the Program</div>
            <div v-for="(item, index) in programList" :key="index" :class="index != 0 ? 'pt-5' : 'pt-3'">
              <v-card :height="isXsOnly ? '' : '100px'" class="elevation-6">
                <div class="pt-0 pb-0">
                  <v-row :class="!isXsOnly ? 'tile_height_100' : ''">
                    <v-col
                      cols="12"
                      lg="2"
                      md="2"
                      xl="2"
                      sm="2"
                      class="pl-3 pr-3 align-center"
                      :class="[isXsOnly ? 'pt-2 pb-2' : 'align_tile pt-0 pb-0']"
                    >
                      <v-img
                        :src="
                          item.brand
                            ? darkMode && item.brand.dark_Theme_Logo__c
                              ? item.brand.dark_Theme_Logo__c
                              : item.brand.web_Logo__c
                            : ''
                        "
                        width="100%"
                        class="logo img-fluid"
                        alt="logo"
                        contains
                        max-height="60"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      lg="8"
                      md="8"
                      sm="8"
                      xl="8"
                      :class="isXsOnly ? 'pa-0' : width === 667 ? 'align_tile pa-0' : 'align_tile pb-0 pt-0 pr-0 pl-4'"
                    >
                      <v-row>
                        <v-col
                          v-if="item.selection ? (item.selection.TotalFirms >= 0 ? true : false) : false"
                          cols="4"
                          lg="2"
                          md="2"
                          sm="2"
                          xl="2"
                          :class="[isXsOnly ? 'text-center' : '', isSmAndDown ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0']"
                        >
                          <h4>Program Name</h4>
                          <h3>
                            <b>{{ item.selection.Program }}</b>
                          </h3>
                        </v-col>
                        <v-col
                          v-if="
                            (isProgramAdmin(item) || isSiteAdmin(item)) && item.selection
                              ? item.selection.TotalFirms >= 0
                                ? true
                                : false
                              : false
                          "
                          cols="4"
                          lg="2"
                          md="2"
                          sm="2"
                          xl="2"
                          :class="[isXsOnly ? 'text-center' : '', isSmAndDown ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0']"
                        >
                          <h4>Total Firms</h4>
                          <h3>
                            <b>{{ item.selection ? new Intl.NumberFormat().format(item.selection.TotalFirms) : 0 }}</b>
                          </h3>
                        </v-col>
                        <v-col
                          v-if="
                            (isProgramAdmin(item) || isSiteAdmin(item) || isFirmAdmin(item)) && item.selection
                              ? item.selection.TotalAdvisors >= 0
                                ? true
                                : false
                              : false
                          "
                          cols="4"
                          lg="2"
                          md="2"
                          sm="2"
                          xl="2"
                          :class="[isXsOnly ? 'text-center' : '', isSmAndDown ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0']"
                        >
                          <h4>Total Advisors</h4>
                          <h3>
                            <b>{{ item.selection ? new Intl.NumberFormat().format(item.selection.TotalAdvisors) : 0 }}</b>
                          </h3>
                        </v-col>
                        <v-col
                          v-if="item.selection ? item.selection.TotalProducts : 0"
                          cols="4"
                          lg="2"
                          md="2"
                          sm="2"
                          xl="2"
                          :class="[isXsOnly ? 'text-center' : '', isSmAndDown ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0']"
                        >
                          <h4>Total Products</h4>
                          <h3>
                            <b>{{ item.selection ? new Intl.NumberFormat().format(item.selection.TotalProducts) : 0 }}</b>
                          </h3>
                        </v-col>
                        <v-col
                          v-if="item.selection ? (item.selection.TotalAssets >= 0 ? true : false) : false"
                          cols="4"
                          lg="2"
                          md="2"
                          sm="2"
                          xl="2"
                          :class="[isXsOnly ? 'text-center' : '', isSmAndDown ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0']"
                        >
                          <h4>Total Assets</h4>
                          <h3>
                            <b>{{ item.selection ? formatPrice(item.selection.TotalAssets) : 0 }}</b>
                          </h3>
                        </v-col>
                        <v-col
                          v-if="item.selection ? (item.selection.TotalPlans >= 0 ? true : false) : false"
                          cols="4"
                          lg="2"
                          md="2"
                          sm="2"
                          xl="2"
                          :class="[
                            isXsOnly ? 'text-center' : '',
                            isSmAndDown ? 'pb-1 pt-0 pl-0 pr-0' : '',
                            width === 667 ? 'pl-1 pt-0 pb-0 pr-0' : 'pa-0'
                          ]"
                        >
                          <h4>Total Plans</h4>
                          <h3>
                            <b>{{ item.selection ? new Intl.NumberFormat().format(item.selection.TotalPlans) : 0 }}</b>
                          </h3>
                        </v-col>
                        <v-col
                          v-if="item.selection ? (item.selection.TotalPPTs >= 0 ? true : false) : false"
                          cols="4"
                          lg="2"
                          md="2"
                          sm="2"
                          xl="2"
                          :class="[isXsOnly ? 'text-center' : '', isSmAndDown ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0']"
                        >
                          <h4>Total Participants</h4>
                          <h3>
                            <b>{{ item.selection ? new Intl.NumberFormat().format(item.selection.TotalPPTs) : 0 }}</b>
                          </h3>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      lg="2"
                      md="2"
                      sm="2"
                      xl="2"
                      :class="isXsOnly ? 'pt-2 pb-2 mr-0 pr-2 text-right' : 'pr-4 align_tile text-right pt-0 pl-0 pb-0'"
                    >
                      <v-menu v-if="firmOrAdvisorList(item).length > 0">
                        <template #activator="{ props }">
                          <v-btn class="mt-0 mb-0 pr-2 pl-2" color="accent" :class="isXsOnly ? 'mr-0' : ''" v-bind="props">
                            Manage
                            <v-icon class="ml-1" size="x-small" icon="fa:fa fa-caret-down"></v-icon>
                          </v-btn>
                        </template>
                        <v-list class="managebtnlist">
                          <v-list-item
                            v-for="(item, index) in firmOrAdvisorList(item)"
                            :key="index"
                            @click="manageFirm(item.programId, item.accountId, item.relationshipId)"
                          >
                            <v-list-item-title>
                              {{ item.accountName }}{{ item.branchId ? ` | ${item.branchId}` : ''
                              }}{{ item.repCode ? ` | ${item.repCode}` : '' }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                      <v-btn
                        v-else
                        :id="item.programName"
                        color="accent"
                        :class="isXsOnly ? 'mr-0' : ''"
                        class="mt-0 mb-0"
                        @click="managePlan(item.programId)"
                      >
                        Manage
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
    <Loader v-model="loading" :loading="loading" />
  </v-container>
</template>

<script>
import Loader from '@/components/Loader'
import { ref, getCurrentInstance, computed, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  components: {
    Loader
  },
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const overviews = ref([
      {
        title: 'Total Firms',
        value: 0,
        show: isAnyRoleBelongsProgramAdmin() || isAnyRoleBelongsSiteAdmin()
      },
      {
        title: 'Total Advisors',
        value: 0,
        show: isAnyRoleBelongsProgramAdmin() || isAnyRoleBelongsSiteAdmin() || isAnyRoleBelongsFirmAdmin()
      },
      {
        title: 'Total Products',
        value: 0,
        show: true
      },
      {
        title: 'Total Assets',
        value: 0,
        show: true
      },
      {
        title: 'Total Plans',
        value: 0,
        show: true
      },
      {
        title: 'Total Participants',
        value: 0,
        show: true
      }
    ])
    const tilesDataList = ref([])
    const programList = ref([])
    const loading = ref(false)
    const isMdOnly = ref(false)
    const isSmAndUp = ref(false)
    const isXsOnly = ref(false)
    const isSmAndDown = ref(false)
    const isMdAndUp = ref(false)
    const width = ref(0)

    //watch
    watchEffect(() => {
      isMdOnly.value = display.md.value
      isSmAndUp.value = display.smAndUp.value
      isXsOnly.value = display.xs.value
      isSmAndDown.value = display.smAndDown.value
      isMdAndUp.value = display.mdAndUp.value
      width.value = display.width.value
    })
    //computed
    const userDisplayName = computed(() => {
      return $store.state.user.name
    })
    const darkMode = computed(() => {
      if ($store.state.sitePreferences && $store.state.sitePreferences.darkModeEnabled) {
        return $store.state.sitePreferences.darkModeEnabled
      } else return false
    })
    const overviewList = computed(() => {
      return overviews.value.filter((a) => a.show && a.value >= 0)
    })
    //method
    function managePlan(programId) {
      loading.value = true
      var selectedProgram = $store.state.user.programs.find((a) => a.programId === programId)
      if (selectedProgram) {
        // set selected account if only one account in program
        if (selectedProgram.accounts.length === 1) selectedProgram.selectedAccount = selectedProgram.accounts[0]

        $store.state.user.selectedProgram = selectedProgram
      }
      $axios.post(`/api/v1/user`, $store.state.user).then(() => {
        window.location.assign('/')
      })
    }
    function firmOrAdvisorList(item) {
      if (
        item.roles.some(
          (a) =>
            a.roleName === $authz.roles.SiteAdmin ||
            a.roleName === $authz.roles.ProgramAdmin ||
            a.roleName === $authz.roles.InternalAdmin
        )
      ) {
        return []
      }
      var manageList = []
      item.relationships.forEach((r) => {
        var a = item.accounts.find((a) => r.accountIds.some((ar) => ar === a.accountId))
        var li = {}
        li.programId = a.programId
        li.accountId = a.accountId
        li.relationshipId = r.relationshipId
        li.repCode = r.repCode
        li.branchId = r.branchId
        li.accountName = a.accountName
        li.roleName = r.roleName
        manageList.push(li)
      })
      if (manageList.length > 1) {
        return manageList
      }
      return []
    }
    function getSelections() {
      loading.value = true
      $axios
        .get('/api/v1/rbc/selection')
        .then((success) => {
          if (success.data.d) {
            if (success.data.d.advisorSelectionPageAggregate.length > 0) {
              tilesDataList.value = success.data.d.advisorSelectionPageAggregate
              var distinctPrograms = [...new Map($store.state.user.programs.map((item) => [item['programId'], item])).values()]
              const lookup = tilesDataList.value.reduce((a, e) => {
                a[e.Program] = ++a[e.Program] || ''
                return a
              }, {})
              var duplicateSelection = tilesDataList.value.filter((e) => lookup[e.Program])
              if (duplicateSelection.length > 0) {
                var totalFirm = getListValueSum(duplicateSelection, 'TotalFirms')
                var totalAdvisor = getListValueSum(duplicateSelection, 'TotalAdvisors')
                var totalPlans = getListValueSum(duplicateSelection, 'TotalPlans')
                var totalAssets = getListValueSum(duplicateSelection, 'TotalAssets')
                var totalParticipants = getListValueSum(duplicateSelection, 'TotalPPTs')
                tilesDataList.value.forEach((element) => {
                  var isSelectionMatch = duplicateSelection.some((item) => item.Program === element.Program)
                  if (isSelectionMatch) {
                    element.TotalFirms = totalFirm
                    element.TotalProducts = 0
                    element.TotalAdvisors = totalAdvisor
                    element.TotalPlans = totalPlans
                    element.TotalAssets = totalAssets
                    element.TotalPPTs = totalParticipants
                  }
                })
              }
              var distictselectionList = []
              tilesDataList.value.forEach((element) => {
                var index = distinctPrograms.findIndex((a) => a.relationshipId === element.id)
                if (index > -1) {
                  distinctPrograms[index].selection = element
                  distictselectionList.push(element)
                }
              })
              programList.value = distinctPrograms
              if (distictselectionList.length > 0) {
                overviews.value[0].value = getListValueSum(
                  distictselectionList.filter(
                    (a) => a.ROLES__C === $authz.roles.SiteAdmin || a.ROLES__C === $authz.roles.ProgramAdmin
                  ),
                  'TotalFirms'
                )
                overviews.value[1].value = getListValueSum(
                  distictselectionList.filter(
                    (a) =>
                      a.ROLES__C === $authz.roles.SiteAdmin ||
                      a.ROLES__C === $authz.roles.ProgramAdmin ||
                      a.ROLES__C === $authz.roles.FirmAdmin
                  ),
                  'TotalAdvisors'
                )
                overviews.value[2].value = -1
                //commenting till product enhancement
                // getListValueSum(
                //   distictselectionList,
                //   'TotalProducts'
                // )
                overviews.value[3].value = getListValueSum(distictselectionList, 'TotalAssets')
                overviews.value[4].value = getListValueSum(distictselectionList, 'TotalPlans')
                overviews.value[5].value = getListValueSum(distictselectionList, 'TotalPPTs')
              }
              loading.value = false
            } else {
              loading.value = false
            }
          }
        })
        .catch(() => {
          loading.value = false
        })
    }
    function getListValueSum(element, type) {
      if (element && element.length > 0) {
        return element
          .map((o) => o[type])
          .reduce((a, c) => {
            return a + c
          })
      } else {
        return 0
      }
    }
    function isSiteAdmin(item) {
      var isSiteAdmin = item.roles.some((a) => a.roleName === $authz.roles.SiteAdmin)
      return isSiteAdmin
    }
    function isProgramAdmin(item) {
      var isProgramAdmin = item.roles.some((a) => a.roleName === $authz.roles.ProgramAdmin)
      return isProgramAdmin
    }
    function isFirmAdmin(item) {
      var isFirmAdmin = item.roles.some((a) => a.roleName === $authz.roles.FirmAdmin)
      return isFirmAdmin
    }
    function isAnyRoleBelongsProgramAdmin() {
      var programs = $store.state.user.programs
      var isAnyProgramWithProgramAdminRole = programs.filter((element) => {
        return element.roles.some((a) => a.roleName === $authz.roles.ProgramAdmin)
      })
      return isAnyProgramWithProgramAdminRole.length > 0 ? true : false
    }
    function isAnyRoleBelongsSiteAdmin() {
      var programs = $store.state.user.programs
      var isAnyProgramWithSiteAdminRole = programs.filter((element) => {
        return element.roles.some((a) => a.roleName === $authz.roles.SiteAdmin)
      })
      return isAnyProgramWithSiteAdminRole.length > 0 ? true : false
    }
    function isAnyRoleBelongsFirmAdmin() {
      var programs = $store.state.user.programs
      var isAnyProgramWithFirmAdminRole = programs.filter((element) => {
        return element.roles.some((a) => a.roleName === $authz.roles.FirmAdmin)
      })
      return isAnyProgramWithFirmAdminRole.length > 0 ? true : false
    }
    function manageFirm(programId, accountId, relationshipId) {
      loading.value = true
      var selectedProgram = $store.state.user.programs.find((a) => a.programId === programId)
      if (selectedProgram) {
        var selectedAccount = selectedProgram.accounts.find((a) => a.accountId === accountId)
        if (selectedAccount) selectedProgram.selectedAccount = selectedAccount
        var selectedRelationship = selectedProgram.relationships.find((a) => a.relationshipId === relationshipId)
        if (selectedRelationship) selectedProgram.selectedRelationship = selectedRelationship
        $store.state.user.selectedProgram = selectedProgram
      }
      $axios.post(`/api/v1/user`, $store.state.user).then(() => {
        window.location.assign('/')
      })
    }
    function formatPrice(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
        : // Six Zeroes for Millions
          Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
          : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : Math.abs(Number(labelValue))
    }
    //created
    getSelections()
    //return setup
    return {
      overviews,
      userDisplayName,
      overviewList,
      tilesDataList,
      programList,
      loading,
      darkMode,
      display,
      isMdOnly,
      isSmAndUp,
      isXsOnly,
      isSmAndDown,
      isMdAndUp,
      width,
      managePlan,
      firmOrAdvisorList,
      getSelections,
      isSiteAdmin,
      isProgramAdmin,
      isFirmAdmin,
      isAnyRoleBelongsProgramAdmin,
      isAnyRoleBelongsSiteAdmin,
      isAnyRoleBelongsFirmAdmin,
      manageFirm,
      formatPrice,
      getListValueSum
    }
  }
}
</script>

<style scoped>
.rate_increase {
  font-size: 11px !important;
}
.arrow_font {
  font-size: 13px !important;
}
.light_theme_card_border {
  border: solid 1px #80808052 !important;
}
.dark_theme_card_border {
  border: solid 1px #80808094 !important;
}
.addProgram .v-btn--floating.v-btn--small {
  background: rgba(255, 197, 66, 0.19) !important;
}
.addProgram .v-subheader {
  height: 22px !important;
}
</style>
<style>
.managebtnlist .v-list-item {
  height: 36px !important;
}
.align_tile {
  align-self: center !important;
}
.tile_height_100 {
  height: 100px !important;
}
</style>
