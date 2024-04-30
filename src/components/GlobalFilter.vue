<template>
  <v-col v-if="showFilter" cols="12" class="pa-0">
    <v-card class="pa-2">
      <v-row class="justify-center">
        <v-col
          v-show="!$authz.hasRole($authz.roles.FirmAdmin)"
          cols="12"
          sm="3"
          xl="2"
          class="pa-0"
          :class="isXsOnly ? 'mb-2' : ''"
        >
          <v-col cols="12" sm="11" class="pa-0">
            <v-select
              v-model="firm"
              placeholder="Firms"
              :items="firmList"
              multiple
              clearable
              hide-details
              name="firmselect"
              item-title="accountName"
              item-value="accountId"
              :menu-props="{ zIndex: '2' }"
              return-object
              :loading="firmList.length === 0"
              @update:model-value="getAdvisor()"
              @click:clear="clear('firm')"
            />
          </v-col>
        </v-col>
        <v-col cols="12" sm="3" xl="2" :class="isXsOnly ? 'mb-2 pa-0' : 'pa-0'">
          <v-col cols="12" sm="11" class="pa-0">
            <v-select
              v-model="advisor"
              placeholder="All Advisors"
              :items="advisorList"
              multiple
              clearable
              hide-details
              :menu-props="{ zIndex: '2' }"
              name="select"
              return-object
              item-title="contactName"
              item-value="contactId"
              :disabled="advisorList.length === 0"
              :loading="advisorLoaded"
              @click:clear="clear('advisor')"
            />
          </v-col>
        </v-col>
        <v-col cols="12" sm="1" class="align-self ml-2 pa-0">
          <v-btn color="accent" @click="viewFilter()"> View </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
  <v-col cols="12" class="pa-0">
    <v-row class="justify-center" style="z-index: 2">
      <v-col sm="6" xl="4" lg="4" class="pa-0">
        <v-card class="background_offwhite">
          <v-card-title class="pa-1">
            <v-row class="cursor-pointer">
              <v-col class="align-self pa-0" :cols="filterSelected > 0 ? '8' : '11'" @click="openGlobalFilter()">
                <v-row>
                  <v-icon size="18" color="accent" class="ml-1 align-self-center" icon="mdi:mdi-filter-variant"></v-icon>
                  <span class="font-weight-medium font_12 text-uppercase ml-2 text-accent">View By</span>
                  <span v-if="filterSelected > 0" class="bg-red text-white ml-2 counter text-center align-self-center">
                    {{ filterSelected }}</span
                  >
                </v-row>
              </v-col>
              <v-col v-if="filterSelected > 0" cols="3" class="text-right pa-0">
                <span class="cursor-pointer font_12" @click="clearFilter()">
                  <v-icon size="15" class="mr-1" color="iconColor" icon="mdi:mdi-close"></v-icon>
                  <span class="font-weight-medium font_12 text-uppercase text-black">Clear Filter</span>
                </span>
              </v-col>
              <v-col cols="1" class="text-right align-self pa-0" @click="openGlobalFilter()">
                <v-icon
                  size="25"
                  color="iconColor"
                  :class="showFilter ? 'rotateactivityicon mr-2' : 'mr-2'"
                  icon="mdi:mdi-chevron-down"
                >
                </v-icon>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import qs from 'qs'
import { computed, ref, onMounted, getCurrentInstance, onUnmounted, inject, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  emits: ['openFilter'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const advisor = ref(null)
    const firm = ref(null)
    const advisorList = ref([])
    const showFilter = ref(false)
    const filterSelected = ref(0)
    const accountList = ref([])
    const advisorLoaded = ref(false)
    const isXsOnly = ref(false)
    watchEffect(() => {
      isXsOnly.value = display.xs.value
    })
    //computed
    const firmList = computed(() => {
      if ($store.state.accountList.length > 0) {
        if ($store.state.accountList.length === 1 && $authz.hasRole($authz.roles.FirmAdmin)) getAdvisor($store.state.accountList)
        return $store.state.accountList
      }
      return []
    })
    //methods
    function viewFilter() {
      filterSelected.value = 0
      $store.state.globalFilter = {}
      if (firm.value && firm.value.length > 0) {
        filterSelected.value += 1
        $store.state.globalFilter.firm = firm
      }
      if (advisor.value && advisor.value.length > 0) {
        filterSelected.value += 1
        $store.state.globalFilter.advisor = advisor
      }
      eventBus.emit('filterGlobalData', true)
      showFilter.value = false
      emit('openFilter', false)
    }
    function clear(val) {
      if (val === 'firm') {
        firm.value = null
        advisorList.value = []
        advisor.value = null
      } else if (val === 'advisor') {
        advisor.value = null
      }
    }
    function getAdvisor() {
      var accountId = []
      if (firm.value.length > 0) {
        accountId = firm.value.map((a) => a.accountId)
      }
      advisorLoaded.value = true
      $axios
        .get(`/api/v1/program/accounts`, {
          params: {
            accountIds: accountId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          if (success.data.d !== null && success.data.d.length > 1) {
            advisorList.value = success.data.d[1].map(function (element) {
              return {
                contactId: element.ContactId,
                contactName: element.ContactName
              }
            })
            if (advisor.value) {
              advisor.value = advisorList.value.filter((el) => {
                return advisor.value.some((f) => {
                  return f.contactId === el.contactId
                })
              })
            }
          }
          advisorLoaded.value = false
        })
        .catch(() => {
          advisorList.value = []
          advisorLoaded.value = false
        })
    }
    function clearFilter() {
      firm.value = null
      if (!$authz.hasRole($authz.roles.FirmAdmin)) advisorList.value = []

      advisor.value = null
      filterSelected.value = 0
      $store.state.globalFilter = {}
      eventBus.emit('filterGlobalData', false)
      showFilter.value = false
      emit('openFilter', false)
    }
    function openGlobalFilter() {
      showFilter.value = !showFilter.value
      emit('openFilter', showFilter.value)
    }
    function getFilterValue() {
      filterSelected.value = 0
      if (Object.keys($store.state.globalFilter).length > 0) {
        if ($store.state.globalFilter.firm && $store.state.globalFilter.firm.length > 0) {
          firm.value = $store.state.globalFilter.firm
          filterSelected.value += 1
          getAdvisor(firm)
        }
        if ($store.state.globalFilter.advisor && $store.state.globalFilter.advisor.length > 0) {
          advisor.value = $store.state.globalFilter.advisor
          filterSelected.value += 1
        }
      }
    }
    function scrollHandler() {
      if (window.scrollY > 0) {
        // if ($refs !== undefined) {
        //   if ($refs.select !== undefined) $refs.select.blur()
        //   if ($refs.firmselect !== undefined) $refs.firmselect.blur()
        // }
      }
    }
    //mounted
    onMounted(() => {
      getFilterValue()
    })
    //unmount
    onUnmounted(() => {
      window.removeEventListener('scroll', scrollHandler)
    })
    //created
    window.addEventListener('scroll', scrollHandler)

    return {
      firmList,
      advisor,
      firm,
      advisorList,
      showFilter,
      filterSelected,
      accountList,
      advisorLoaded,
      display,
      isXsOnly,
      scrollHandler,
      getFilterValue,
      openGlobalFilter,
      clearFilter,
      getAdvisor,
      viewFilter,
      clear
    }
  }
}
</script>
<style scoped>
.rotateactivityicon {
  transform: rotate(180deg);
}
</style>
