<template>
  <v-col>
    <v-card>
      <v-card-title class="text-secondary" :class="theme.dark ? '' : 'accent'">
        <v-row>
          <v-col cols="11" xs="11">
            <h3 v-if="prospectTab === 0" class="text-white">
              <v-icon size="21" color="white" class="pr-1 icon-for-profit" />Save Search For Profit
            </h3>
            <h3 v-if="prospectTab === 1" class="text-white">
              <v-icon size="21" color="white" class="pr-1 icon-schools" />Save Search Schools
            </h3>
            <h3 v-if="prospectTab === 4" class="text-white">
              <v-icon size="21" color="white" class="pr-1 icon-individual" />Save Search Individuals
            </h3>
          </v-col>
          <v-col cols="1" xs="1" class="text-right">
            <v-icon :color="theme.dark ? '' : 'white'" @click="close()"> close </v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pl-6 pr-6 mt-5">
        <v-col cols="12" xs="12">
          <v-text-field
            v-model="saveSearchName"
            placeholder="Name of Search"
            variant="outlined"
            density="compact"
            maxlength="50"
            counter="50"
            :error="saveSearchError"
            :error-messages="saveSearchErrorMessage"
            :hide-details="!saveSearchError"
            @blur="blurSearchName()"
          />
        </v-col>
        <v-col cols="12" xs="12" :class="saveSearchError ? '' : 'pt-2'">
          <v-checkbox
            v-model="showonAcquisition"
            class="mt-0 changeCheckboxColor"
            label="Show on Acquisition Screen"
            @click="acquistion()"
          />
        </v-col>
      </v-card-text>
      <v-card-actions class="pb-5">
        <v-col cols="12" xs="12" class="text-right">
          <v-btn variant="text" size="large" :color="theme.dark ? '' : 'accent'" class="text-none" @click="close()">
            Cancel, don't save
          </v-btn>
          <v-btn :color="theme.dark ? '' : 'accent'" type="submit" size="large" @click="saveSearchCriteria()">
            Save Search
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
import { ref, watch, getCurrentInstance } from 'vue'
import { useTheme } from 'vuetify'

export default {
  props: ['savedResult', 'prospectTab'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const theme = useTheme()
    const store = instance.appContext.config.globalProperties.$store
    const $nextTick = instance.appContext.config.globalProperties.$nextTick
    const toast = instance.appContext.config.globalProperties.$toast
    const saveSearchName = ref('')
    const saveSearchError = ref(false)
    const saveSearchErrorMessage = ref('')
    const showonAcquisition = ref(true)
    const close = () => {
      saveSearchError.value = false
      saveSearchErrorMessage.value = ''
      saveSearchName.value = ''
      showonAcquisition.value = true
      emit('closeDialog')
    }
    const saveSearchCriteria = () => {
      if (saveSearchName.value) {
        if (props.savedResult && props.savedResult.length > 0) {
          var isNameExist = props.savedResult.find((a) => a.searchName === saveSearchName.value)
          if (isNameExist) {
            saveSearchError.value = true
            saveSearchErrorMessage.value = 'Name already exist'
            return false
          }
        }
        emit('saveSearch', saveSearchName.value, showonAcquisition.value)
      } else {
        saveSearchError.value = true
        saveSearchErrorMessage.value = 'Name is required'
      }
    }
    const blurSearchName = () => {
      if (saveSearchName.value) {
        saveSearchError.value = false
        saveSearchErrorMessage.value = ''
      } else {
        saveSearchError.value = true
        saveSearchErrorMessage.value = 'Name is required'
      }
    }
    const acquistion = () => {
      if (showonAcquisition.value) {
        showAcquisition(true)
      }
    }
    const showAcquisition = (val) => {
      if (props.prospectTab === 0) {
        let employeeSaveSearch = props.savedResult.filter(
          (a) => a.saveSearchType === 'Employer Sponsored' && a.showOnAcquisition === true
        )
        if (employeeSaveSearch && employeeSaveSearch.length < 5) {
          showonAcquisition.value = true
        } else {
          if (val) {
            toast?.destroy()
            toast.error('A maximum of 5 saved searches per customer type can be selected', '')
          }
          $nextTick(() => {
            showonAcquisition.value = false
          })
        }
      } else if (props.prospectTab === 1) {
        let schoolSaveSearch = props.savedResult.filter((a) => a.saveSearchType === 'Schools' && a.showOnAcquisition === true)
        if (schoolSaveSearch && schoolSaveSearch.length < 5) {
          showonAcquisition.value = true
        } else {
          if (val) {
            toast?.destroy()
            toast.error('A maximum of 5 saved searches per customer type can be selected', '')
          }
          $nextTick(() => {
            showonAcquisition.value = false
          })
        }
      } else if (props.prospectTab === 4) {
        let individualSaveSearch = props.savedResult.filter(
          (a) => a.saveSearchType === 'Individuals' && a.showOnAcquisition === true
        )
        if (individualSaveSearch && individualSaveSearch.length < 5) {
          showonAcquisition.value = true
        } else {
          if (val) {
            toast?.destroy()
            toast.error('A maximum of 5 saved searches per customer type can be selected', '')
          }
          $nextTick(() => {
            showonAcquisition.value = false
          })
        }
      }
    }
    watch(
      () => props.savedResult,
      () => {
        showAcquisition()
      },
      { immediate: true, deep: true }
    )
    return {
      saveSearchName,
      saveSearchError,
      saveSearchErrorMessage,
      saveSearchCriteria,
      showonAcquisition,
      blurSearchName,
      acquistion,
      close,
      store,
      theme
    }
  }
}
</script>
