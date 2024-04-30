<template>
  <v-col>
    <v-card>
      <v-card-title class="text-secondary" :class="theme.dark ? '' : 'accent'">
        <v-row>
          <v-col cols="11" xs="11">
            <h3 class="text-white">My Saved Searches</h3>
          </v-col>
          <v-col cols="1" xs="1" class="text-right">
            <v-icon :color="theme.dark ? '' : 'white'" @click="close()"> close </v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="cardHeight">
        <v-col v-for="(item, index) in savedSearchList" :key="index" cols="12" xs="12">
          <v-row v-if="!$vuetify?.breakpoint?.xs">
            <v-col cols="5" xs="5" class="mr-auto">
              <v-text-field
                ref="searchName"
                v-model="item['searchName']"
                variant="outlined"
                density="compact"
                hide-details
                :error="item['searchNameError']"
                @change="changeSearchName(item, item.id, 'searchName')"
                :prepend-icon="item['icon']"
              >
                <!-- <v-icon slot="prepend" size="16" :color="item['color']" :class="" /> -->
              </v-text-field>
            </v-col>
            <v-col cols="4" xs="4" class="mr-auto align-self">
              <v-checkbox
                v-model="item['showOnAcquisition']"
                class="mt-0 changeCheckboxColor"
                label="Show on Acquisition Screen"
                hide-details
                @update:model-value="changeSearchName(item, item.id, 'showOnAcquisition')"
              />
            </v-col>
            <v-col cols="2" xs="2" class="text-end align-self">
              <v-btn
                :color="theme.dark ? '' : 'hyperlink'"
                variant="text"
                :icon="$vuetify?.breakpoint?.xs"
                class="text-transform-capitalize mb-0 mt-1 pa-0 font-weight-regular"
                @click="deleteSavedSearch(item.id)"
              >
                <v-icon color="hyperlink" size="16" class="icon-trash" />
                <span>Delete</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="$vuetify?.breakpoint?.xs">
            <v-col cols="9" xs="9">
              <v-text-field
                ref="searchName"
                v-model="item['searchName']"
                variant="outlined"
                density="compact"
                hide-details
                :error="item['searchNameError']"
                @change="changeSearchName(item, item.id, 'searchName')"
                :prepend="item['icon']"
              >
                <!-- <v-icon slot="prepend" size="16" :color="item['color']" :class="" /> -->
              </v-text-field>
            </v-col>
            <v-col cols="3" xs="3" class="text-end">
              <v-btn
                :color="theme.dark ? '' : 'hyperlink'"
                variant="text"
                :icon="$vuetify?.breakpoint?.xs"
                class="text-transform-capitalize mb-0 mt-1 pa-0 font-weight-regular"
                @click="deleteSavedSearch(item.id)"
              >
                <v-icon color="hyperlink" size="16" class="icon-trash" />Delete
              </v-btn>
            </v-col>
            <v-col cols="10" xs="10" class="mr-auto ml-auto mt-2 align-self">
              <v-checkbox
                v-model="item['showOnAcquisition']"
                class="mt-0 changeCheckboxColor"
                label="Show on Acquisition Screen"
                hide-details
                @update:model-value="changeSearchName(item, item.id, 'showOnAcquisition')"
              />
            </v-col>
          </v-row>
          <v-divider class="my-2" />
        </v-col>
      </v-card-text>
      <v-card-actions v-if="savedSearchList && savedSearchList.length > 0" class="pb-5">
        <v-col v-if="!$vuetify?.breakpoint?.xs" cols="12" xs="12" class="text-right">
          <v-btn variant="text" size="large" :color="theme.dark ? '' : 'accent'" class="text-none" @click="close()">
            Cancel, don't save changes
          </v-btn>
          <v-btn :color="theme.dark ? '' : 'accent'" type="submit" size="large" @click="saveSearchCriteria()">
            Save Changes
          </v-btn>
        </v-col>
        <v-col v-if="$vuetify?.breakpoint?.xs" cols="12" xs="12" class="text-center">
          <v-btn :color="theme.dark ? '' : 'accent'" type="submit" size="large" class="pl-9 pr-9" @click="saveSearchCriteria()">
            Save Changes
          </v-btn>
          <v-btn variant="text" size="large" :color="theme.dark ? '' : 'accent'" class="text-none" @click="close()">
            Cancel, don't save changes
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { ref, inject, onMounted, computed, getCurrentInstance, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'

export default {
  setup() {
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const toast = instance.appContext.config.globalProperties.$toast
    const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const $nextTick = instance.appContext.config.globalProperties.$nextTick
    const savedSearchList = ref([])
    const newSavedSearchList = ref([])
    const showSchool = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Schools
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c, $authz.typeOfBusiness.Schools)
        )
      } else return true
    })
    const showEmployerSponsored = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    })
    const showIndividuals = computed(() => {
      // if ($authz.hasRole($authz.roles.FirmAdmin)) {
      //   return $authz.allowedByProgram(
      //     $authz.programPermissionSet
      //       .Type_of_Business_Advisors_Firms_allowed__c,
      //     $authz.typeOfBusiness.Individuals
      //   )
      // } else if (
      //   $authz.hasRole($authz.roles.Advisor) ||
      //   $authz.hasRole($authz.roles.Strategist) ||
      //   $authz.hasRole($authz.roles.Fiduciary338)
      // ) {
      //   return (
      //     $authz.allowedByProgram(
      //       $authz.programPermissionSet
      //         .Type_of_Business_Advisors_Firms_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     ) &&
      //     $authz.allowedByAccount(
      //       $authz.accountPermissionSet
      //         .Type_of_Business_Advisors_allowed__c,
      //       $authz.typeOfBusiness.Individuals
      //     )
      //   )
      // } else return true
      return false
    })
    const close = () => {
      newSavedSearchList.value = []
      getSavedSearch()
      eventBus.emit('closeSearchDialog')
    }
    const saveSearchCriteria = () => {
      if (newSavedSearchList.value && newSavedSearchList.value.length > 0) {
        $axios.put('/api/v1/tal/plan/searchrequests', newSavedSearchList.value).finally(() => {
          close()
          eventBus.emit('getSaveSearch')
        })
      } else {
        close()
      }
    }
    const deleteSavedSearch = (id) => {
      if (id) {
        $axios
          .delete(`/api/v1/tal/plan/searchrequest/${id}`)
          // eslint-disable-next-line no-unused-vars
          .finally(() => {
            getSavedSearch()
          })
      }
    }
    const getSavedSearch = () => {
      $axios.get(`/api/v1/tal/plan/searchrequests`).then((success) => {
        if (success.data.length > 0) {
          savedSearchList.value = success.data.filter((a) => a.searchName !== 'Starred')
          savedSearchList.value.forEach((element) => {
            element.oldSaveSearchName = element.searchName
            if (element.saveSearchType === 'Employer Sponsored') {
              element.icon = 'icon-for-profit'
              element.color = '#119944'
              element.display = showEmployerSponsored.value ? true : false
            } else if (element.saveSearchType === 'Schools') {
              element.icon = 'icon-graduation'
              element.color = '#006633'
              element.display = showSchool.value ? true : false
            } else if (element.saveSearchType === 'Municipalities') {
              element.icon = 'icon-government'
              element.color = '#056937'
              element.display = false
            } else if (element.saveSearchType === 'Tax-Exempt') {
              element.icon = 'icon-tax-exempt'
              element.color = '#F59A23'
              element.display = false
            } else if (element.saveSearchType === 'Individuals') {
              element.icon = 'icon-individual'
              element.color = '#552299'
              element.display = showIndividuals.value ? true : false
            }
          })
          savedSearchList.value = savedSearchList.value.filter((a) => a.display === true)
          savedSearchList.value.sort(function (a, b) {
            return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
          })
        } else {
          savedSearchList.value = []
          eventBus.emit('closeSearchDialog')
        }
        eventBus.emit('showSaveSearch', savedSearchList.value)
      })
    }
    const changeSearchName = (item, id, val) => {
      if (item) {
        if (item.searchName) {
          if (savedSearchList.value && savedSearchList.value.length > 0 && val === 'searchName') {
            var isNameExist = savedSearchList.value.find((a) => a.searchName === item.searchName && a.id !== item.id)
            if (isNameExist) {
              toast?.destroy()
              toast.error('Name already exist', '')
              item.searchName = item.oldSaveSearchName ? item.oldSaveSearchName : ''
              return false
            }
          }
          if (savedSearchList.value && savedSearchList.value.length > 0 && val === 'showOnAcquisition') {
            if (item.saveSearchType === 'Employer Sponsored' && item.showOnAcquisition === true) {
              let employeeSaveSearch = savedSearchList.value.filter(
                (a) => a.saveSearchType === 'Employer Sponsored' && a.showOnAcquisition === true
              )
              if (employeeSaveSearch && employeeSaveSearch.length > 5) {
                $nextTick(() => {
                  item.showOnAcquisition = false
                })
                toast?.destroy()
                toast.error('A maximum of 5 saved searches per customer type can be displayed on acquisition screen', '')
                return false
              }
            } else if (item.saveSearchType === 'Schools' && item.showOnAcquisition === true) {
              let schoolSaveSearch = savedSearchList.value.filter(
                (a) => a.saveSearchType === 'Schools' && a.showOnAcquisition === true
              )
              if (schoolSaveSearch && schoolSaveSearch.length > 5) {
                $nextTick(() => {
                  item.showOnAcquisition = false
                })
                toast?.destroy()
                toast.error('A maximum of 5 saved searches per customer type can be displayed on acquisition screen', '')
                return false
              }
            } else if (item.saveSearchType === 'Individuals' && item.showOnAcquisition === true) {
              let individualSaveSearch = savedSearchList.value.filter(
                (a) => a.saveSearchType === 'Individuals' && a.showOnAcquisition === true
              )
              if (individualSaveSearch && individualSaveSearch.length > 5) {
                $nextTick(() => {
                  item.showOnAcquisition = false
                })
                toast?.destroy()
                toast.error('A maximum of 5 saved searches per customer type can be displayed on acquisition screen', '')
                return false
              }
            }
          }
          var checkSearchName = newSavedSearchList.value.findIndex((a) => a.id === id)
          if (checkSearchName > -1) newSavedSearchList.value.splice(checkSearchName, 1)
          newSavedSearchList.value.push(item)
        } else {
          toast?.destroy()
          toast.error('Name cannot be empty', '')
          item.searchName = item.oldSaveSearchName ? item.oldSaveSearchName : ''
        }
      }
    }
    onMounted(() => {
      getSavedSearch()
      eventBus.on('getSaveSearch', () => {
        getSavedSearch()
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('getSaveSearch')
    })
    return {
      savedSearchList,
      newSavedSearchList,
      changeSearchName,
      deleteSavedSearch,
      saveSearchCriteria,
      store,
      $vuetify,
      theme
    }
  }
}
</script>
<style scoped>
.cardHeight {
  height: 400px !important;
  overflow: scroll;
}
</style>
