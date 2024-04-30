<template>
  <v-col class="pa-0">
    <v-card class="elevation-6">
      <v-row class="pa-5">
        <v-col cols="12" xs="12" lg="3" md="3" xl="2" sm="4" class="d-flex align-center">
          <v-row no-gutters>
            <v-col cols="12" class="img-height pa-0">
              <v-row class="align-center">
                <v-col cols="11" class="pa-0">
                  <v-img :src="companyLogo ? companyLogo : ''" class="logo img-fluid" alt="logo" cover max-height="60" />
                </v-col>
                <!-- <v-col xs2>
                  <v-btn
                    icon
                    v-if="
                      !$store.state.user.temporarySessionType ||
                      ($store.state.user.temporarySessionType !== 'Participant' && isMultiProgram)
                    "
                    @click="viewPrograms()"
                  >
                    <v-icon size="21" :color="theme.dark ? '' : 'accent'" class="icon-program"></v-icon>
                  </v-btn>
                </v-col> -->
              </v-row>
            </v-col>
            <v-col cols="12" class="pt-1">
              <v-row no-gutters>
                <v-col cols="12" class="pb-1">
                  <v-row v-if="programName" no-gutters>
                    <v-col cols="12" xs="12" xl="7" lg="7" md="7" sm="7" class="pa-0">
                      <h3 class="font_16">
                        <b>Program Name </b>
                      </h3>
                    </v-col>
                    <v-col cols="12" xs="12" xl="5" lg="5" md="5" sm="5" class="pa-0">
                      <h3 class="font_16">
                        {{ programName ? programName : '' }}
                      </h3>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-divider v-if="!isXsOnly" vertical class="mx-3 bold" />
        <v-divider v-if="isXsOnly" class="mx-1 my-3 bold" />
        <v-col cols="12" xs="12" lg="2" md="3" sm="4" xl="3">
          <v-row class="justify-center text-center">
            <v-col c0ls="12" class="img-height d-flex">
              <v-row class="align-self-center text-center justify-center">
                <h3 class="font_24" :class="theme.dark ? '' : 'text-hyperlink'">
                  {{ overviews && overviews.length > 0 ? formatPrice(overviews[0].value, 0) : 0 }}
                </h3>
              </v-row>
            </v-col>
            <v-col cols="12" class="pb-1 pt-1">
              <h3 class="font_16">
                <b>{{ overviews && overviews.length > 0 ? overviews[0].title : '' }}</b>
              </h3>
            </v-col>
            <v-col cols="12">
              <v-row class="justify-center">
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[0].trending > 0 ? true : false) : false"
                  size="16"
                  color="#119944"
                >
                  mdi-triangle
                </v-icon>
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[0].trending < 0 ? true : false) : false"
                  size="16"
                  color="#cc0000"
                  class="rotateIcon"
                >
                  mdi-triangle
                </v-icon>
                <h3 v-if="overviews && overviews.length > 0 ? (overviews[0].trending !== 0 ? true : false) : false" class="ml-1">
                  {{ overviews && overviews.length > 0 ? parseFloat(overviews[0].trending, 2) : 0 }}%
                </h3>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-divider v-if="!isXsOnly" vertical class="mx-3 bold" />
        <v-divider v-if="isXsOnly" class="mx-1 my-3 bold" />
        <v-col cols="12" xs="12" lg="2" md="2" sm="2" xl="2">
          <v-row class="justify-center text-center">
            <v-col cols="12" class="img-height d-flex">
              <v-row class="align-self-center text-center justify-center">
                <h3 class="font_24" :class="theme.dark ? '' : 'text-hyperlink'">
                  {{ overviews && overviews.length > 0 ? new Intl.NumberFormat().format(overviews[1].value) : 0 }}
                </h3>
              </v-row>
            </v-col>
            <v-col cols="12" class="pb-1 pt-1">
              <h3 class="font_16">
                <b>{{ overviews && overviews.length > 0 ? overviews[1].title : '' }}</b>
              </h3>
            </v-col>
            <v-col cols="12">
              <v-row class="justify-center">
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[1].trending > 0 ? true : false) : false"
                  size="16"
                  color="#119944"
                >
                  mdi-triangle
                </v-icon>
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[1].trending < 0 ? true : false) : false"
                  size="16"
                  color="#cc0000"
                  class="rotateIcon"
                >
                  mdi-triangle
                </v-icon>
                <h3 v-if="overviews && overviews.length > 0 ? (overviews[1].trending !== 0 ? true : false) : false" class="ml-1">
                  {{ overviews && overviews.length > 0 ? parseFloat(overviews[1].trending, 2) : 0 }}%
                </h3>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-divider v-if="!isXsOnly && !display.smAndDown.value" vertical class="mx-3 bold" />
        <v-divider v-if="isXsOnly" class="mx-1 my-3 bold" />
        <v-col cols="12" xs="12" lg="2" md="2" sm="4" xl="2">
          <v-row class="justify-center text-center">
            <v-col cols="12" xs="12" class="img-height d-flex">
              <v-row class="align-self-center text-center justify-center">
                <h3 class="font_24" :class="theme.dark ? '' : 'text-hyperlink'">
                  {{ overviews && overviews.length > 0 ? new Intl.NumberFormat().format(overviews[2].value) : 0 }}
                </h3>
              </v-row>
            </v-col>
            <v-col cols="12" class="pb-1 pt-1">
              <h3 class="font_16">
                <b>{{ overviews && overviews.length > 0 ? overviews[2].title : '' }}</b>
              </h3>
            </v-col>
            <v-col cols="12" xs="12">
              <v-row class="justify-center">
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[2].trending > 0 ? true : false) : false"
                  size="16"
                  color="#119944"
                >
                  mdi-triangle
                </v-icon>
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[2].trending < 0 ? true : false) : false"
                  size="16"
                  color="#cc0000"
                  class="rotateIcon"
                >
                  mdi-triangle
                </v-icon>
                <h3 v-if="overviews && overviews.length > 0 ? (overviews[2].trending !== 0 ? true : false) : false" class="ml-1">
                  {{ overviews && overviews.length > 0 ? parseFloat(overviews[2].trending, 2) : 0 }}%
                </h3>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-divider
          v-if="!isXsOnly && (display.lgAndUp.value || display.smAndDown.value)"
          vertical
          class="bold"
          :class="display.smOnly ? 'mx-3' : 'mx-2'"
        />
        <v-divider v-if="isXsOnly" class="mx-1 my-3 bold" />
        <v-col cols="12" lg="2" md="2" sm="3" xl="2">
          <v-row class="justify-center text-center" no-gutters>
            <v-col cols="12" xs="12" class="img-height d-flex">
              <v-row class="align-self-center text-center justify-center">
                <h3 class="font_24" :class="theme.dark ? '' : 'text-hyperlink'">
                  {{ overviews && overviews.length > 0 ? formatPrice(overviews[3].value, 0) : 0 }}
                </h3>
              </v-row>
            </v-col>
            <v-col cols="12" xs="12" class="pa-0 pb-1 pt-1">
              <h3 class="font_16">
                <b>{{ overviews && overviews.length > 0 ? overviews[3].title : '' }}</b>
              </h3>
            </v-col>
            <v-col cols="12" xs="12">
              <v-row class="justify-center">
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[3].trending > 0 ? true : false) : false"
                  size="16"
                  color="#119944"
                >
                  mdi-triangle
                </v-icon>
                <v-icon
                  v-if="overviews && overviews.length > 0 ? (overviews[3].trending < 0 ? true : false) : false"
                  size="16"
                  color="#cc0000"
                  class="rotateIcon"
                >
                  mdi-triangle
                </v-icon>
                <h3 v-if="overviews && overviews.length > 0 ? (overviews[3].trending !== 0 ? true : false) : false" class="ml-1">
                  {{ overviews && overviews.length > 0 ? parseFloat(overviews[3].trending, 2) : 0 }}%
                </h3>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="programDialog" persistent scrollable max-width="800px" :eager="true">
      <v-card class="elevation-3">
        <v-card-title class="text-secondary pa-3" fixed :class="theme.dark ? '' : 'accent'">
          <h3>Select Program</h3>
          <v-row>
            <v-col cols="12" xs="12">
              <v-row>
                <v-col xl="11" lg="11" sm="11" md="11" xs="10" class="align-self" />
                <v-col xl="1" lg="1" sm="1" md="1" xs="2" class="text-right">
                  <v-icon color="secondary" @click="programDialog = false"> close </v-icon>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="mb-2">
          <v-data-table
            v-model="selected"
            :headers="header"
            :items="programList"
            item-key="Id"
            class="elevation-0"
            hide-default-footer
            :disable-pagination="true"
            mobile-breakpoint="0"
            :fixed-header="!display.xs.value"
            style="backface-visibility: hidden"
            show-select
            :single-select="true"
          >
            <template #item="{ item, isSelected, select }">
              <tr>
                <td width="2%">
                  <v-checkbox-btn :color="theme.dark ? '' : 'accent'" :value="isSelected" @input="select($event)" />
                </td>
                <td class="pt-2 pb-2">
                  <v-col cols="12" xs="12" class="img-height">
                    <v-row class="justify-center align-self-center text-center rowheight">
                      <v-col cols="12" xs="12" class="justify-center align-self-center text-center">
                        <v-img
                          :src="
                            item && item.brand
                              ? theme.dark && item.brand.dark_Theme_Logo__c
                                ? item.brand.dark_Theme_Logo__c
                                : item.brand.web_Logo__c
                              : ''
                          "
                          class="logo img-fluid"
                          alt="logo"
                          contains
                          max-height="60"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="display.xs.value" xs="12" class="mt-5 mb-5">
                    <v-col cols="12" xs="12" class="mt-2">
                      {{ item.programName ? `Program Name: ${item.programName}` : '' }}
                    </v-col>
                    <v-col cols="12" xs="12" class="mt-2 mb-2">
                      {{ item.accountName ? `Firm Name: ${item.accountName}` : '' }}
                    </v-col>
                  </v-col>
                </td>
                <td v-if="!display.xs.value">
                  {{ item.programName ? item.programName : '' }}
                </td>
                <td v-if="!display.xs.value">
                  {{ item.accountName ? item.accountName : '' }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn class="pl-6 pr-6" :loading="loading" :color="theme.dark ? '' : 'accent'" @click="selectProgram()">
            Select
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useDisplay, useTheme } from 'vuetify'
import qs from 'qs'

export default {
  setup({ emit }) {
    const instance = getCurrentInstance()
    const display = useDisplay()
    const store = useStore()
    const theme = useTheme()
    //const eventBus = inject('eventBus')
    // Reactive data properties
    const programDialog = ref(false)
    const overviews = ref([
      {
        title: 'Total Assets (AUM)',
        value: 0,
        trending: 0,
        show: true,
        text: 'TotalAssets'
      },
      {
        title: 'Total Plans',
        value: 0,
        trending: 0,
        show: true,
        text: 'TotalPlans'
      },
      {
        title: 'Total Participants',
        value: 0,
        trending: 0,
        show: true,
        text: 'TotalPPTs'
      },
      {
        title: 'Distributions (YTD)',
        value: 0,
        trending: 0,
        show: true,
        text: 'TotalDistributions'
      }
    ])
    const tilesDataList = ref([])
    const programs = ref([])
    const selectedProgram = ref({})
    const loading = ref(false)
    const selected = ref([])
    const $axios = instance.appContext.config.globalProperties.$axios
    const toast = instance.appContext.config.globalProperties.$toast
    //const $authz = instance.appContext.config.globalProperties.$authz

    // Computed properties
    const formatPrice = (value, decimals) => {
      if (value === undefined) {
        return 'N/A' // or some default formatting
      }
      // Your logic to format the price
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals
      }).format(value)
    }

    const isMultiProgram = computed(() => {
      const distinctPrograms = [...new Map(store.state.user.programs.map((item) => [item['programId'], item])).values()]
      if (distinctPrograms.length === 1) {
        const isAnyProgramBelongsAdminRole = distinctPrograms[0].roles.some(
          (role) =>
            role.roleName === store.state.authz.roles.SiteAdmin ||
            role.roleName === store.state.authz.roles.ProgramAdmin ||
            role.roleName === store.state.authz.roles.InternalAdmin
        )
        const distinctAccounts = [...new Map(distinctPrograms[0].accounts.map((item) => [item['accountId'], item])).values()]
        if (isAnyProgramBelongsAdminRole) return false
        else if (distinctAccounts.length > 1) return true
        else return false
      } else if (distinctPrograms.length > 1) {
        return true
      } else return false
    })

    const programName = computed(() => {
      if (store.state.user.selectedProgram && store.state.user.selectedProgram.programName) {
        return store.state.user.selectedProgram.programName
      }
      return 'All'
    })
    const isXsOnly = computed(() => display.xs && !display.sm)

    const companyLogo = computed(() => {
      const selectedProgram = store.state.user.selectedProgram
      const defaultProgram = store.state.defaultProgram
      const darkTheme = theme.dark
      if (selectedProgram && selectedProgram.brand) {
        return darkTheme && selectedProgram.brand.dark_Theme_Logo__c
          ? selectedProgram.brand.dark_Theme_Logo__c
          : selectedProgram.brand.web_Logo__c
      } else if (defaultProgram && defaultProgram.brand) {
        return darkTheme && defaultProgram.brand.dark_Theme_Logo__c
          ? defaultProgram.brand.dark_Theme_Logo__c
          : defaultProgram.brand.web_Logo__c
      }
      return ''
    })

    const firmName = computed(() => {
      const selectedProgram = store.state.user.selectedProgram
      if (selectedProgram?.selectedAccount?.accountId) {
        return selectedProgram.selectedAccount.accountName
      }
      return ''
    })

    const programList = computed(() => {
      if (store.state.user.programs && store.state.user.programs.length > 0) {
        var distinctPrograms = [...new Map(store.state.user.programs.map((item) => [item['programId'], item])).values()]
        var programAndFirmList = []
        distinctPrograms.forEach((element) => {
          const firms = programAndAccountList(element)
          if (programAndFirmList && programAndFirmList.length === 0) {
            programAndFirmList = firms
          } else {
            Array.prototype.push.apply(programAndFirmList, firms)
          }
        })
        programAndFirmList.forEach((a, index) => {
          a.Id = index + 1
        })
        return programAndFirmList
      }
      return []
    })

    // Watching programList for changes
    watch(
      programList,
      (val) => {
        if (val && val.length > 0) {
          const userSelectedProgram = store.state.user.selectedProgram
          if (userSelectedProgram) {
            if (userSelectedProgram.selectedAccount && userSelectedProgram.selectedAccount.accountId) {
              selected.value = val.filter((a) => a.accountId === userSelectedProgram.selectedAccount.accountId)
            } else {
              selected.value = val.filter((a) => a.programId === userSelectedProgram.programId)
            }
          }
        }
      },
      { deep: true }
    )

    // Methods
    function selectProgram() {
      if (selected.value && selected.value.length > 0) {
        programDialog.value = false
        var selectedProgram = programs.value.find((a) => a.programId === selected.value[0]?.programId)
        if (selectedProgram && selectedProgram.length === 1) {
          managePlan(selected.value[0]?.programId)
        } else {
          manageFirm(selected.value[0]?.programId, selected.value[0]?.accountId, selected.value[0]?.relationshipId)
        }
      } else {
        toast?.destroy()
        // How does notification system work?
        //toast.error('Program not selected', '', notificationSystem.options.error)
      }
    }

    function manageFirm(programId, accountId, relationshipId) {
      var selectedProgram = programs.value.find((a) => a.programId === programId)
      if (selectedProgram) {
        var selectedAccount = selectedProgram.accounts.find((a) => a.accountId === accountId)
        if (selectedAccount) selectedProgram.selectedAccount = selectedAccount
        var selectedRelationship = selectedProgram.relationships.find((a) => a.relationshipId === relationshipId)
        if (selectedRelationship) selectedProgram.selectedRelationship = selectedRelationship
        store.state.user.selectedProgram = selectedProgram
      }
      $axios.post(`/api/v1/user`, store.state.user).then(() => {
        window.location.assign('/')
      })
    }

    function managePlan(programId) {
      var selectedProgram = programs.value.find((a) => a.programId === programId)
      if (selectedProgram) {
        // set selected account if only one account in program
        if (selectedProgram.accounts.length === 1) selectedProgram.selectedAccount = selectedProgram.accounts[0]

        store.state.user.selectedProgram = selectedProgram
      }
      emit('showLoader')
      $axios.post(`/api/v1/user`, store.state.user).then(() => {
        window.location.assign('/')
      })
    }

    function getOverView() {
      let accountId = []
      let contactId = []
      // Extract accountId and contactId based on globalFilter conditions
      if (Object.keys(store.state.globalFilter).length > 0) {
        if (store.state.globalFilter.firm && store.state.globalFilter.firm.length > 0) {
          accountId = store.state.globalFilter.firm.map((el) => el.accountId).filter(Boolean)
        }
        if (store.state.globalFilter.advisor && store.state.globalFilter.advisor.length > 0) {
          contactId = store.state.globalFilter.advisor.map((el) => el.contactId).filter(Boolean)
        }
      }

      // Proceed if a reliusLoginId is present
      if (store.state.user.reliusLoginId) {
        $axios
          .get(`/api/v1/rbc/clientoverview`, {
            params: { accountId, advisorContactId: contactId },
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
          })
          .then((success) => {
            store.state.clientOverview = success.data.d
            if (store.state.clientOverview.length > 0) {
              const list = ['TotalAssets', 'TotalPlans', 'TotalPPTs', 'TotalDistributions']

              list.forEach((itemKey) => {
                const overviewItem = overviews.value.find((item) => item.text === itemKey)
                if (overviewItem) {
                  const clientOverviewValue = store.state.clientOverview[0][itemKey]
                  overviewItem.value = clientOverviewValue || 0
                  const trendingKey = `Trending${itemKey.replace('Total', '')}`
                  overviewItem.trending = store.state.clientOverview[0][trendingKey] || 0
                }
              })
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error)
            // Handle error scenario, e.g., showing a notification or logging
          })
      }
    }

    function viewPrograms() {
      programDialog.value = true
    }

    function programAndAccountList(item) {
      let programList = []
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
        li.programName = item.programName
        li.brand = item.brand
        programList.push(li)
      })
      if (programList.length > 0) {
        return programList
      }
      return []
    }

    // Lifecycle hooks
    onMounted(() => {
      // eslint-disable-next-line no-unused-vars
      // eventBus.on('filterGlobalData', (data) => {
      //   getOverView()
      // })
      getOverView()
    })

    // Exposing to the template
    return {
      programDialog,
      overviews,
      tilesDataList,
      programs,
      selectedProgram,
      loading,
      selected,
      isMultiProgram,
      programName,
      companyLogo,
      firmName,
      programList,
      selectProgram,
      manageFirm,
      managePlan,
      getOverView,
      viewPrograms,
      programAndAccountList,
      display,
      toast,
      formatPrice,
      isXsOnly,
      theme
    }
  }
}
</script>
<style scoped>
.img-height {
  height: 60px !important;
}

.card_text_height {
  height: 600px !important;
}
.borderbox.selected {
  border: solid #2196f3;
}
.borderbox:not(.selected) {
  border: solid lightgrey;
}
.borderbox {
  border: solid lightgrey;
  border-radius: 10px;
  border-width: 2px;
  height: 130px;
}
.rowheight {
  height: -webkit-fill-available;
}
</style>
