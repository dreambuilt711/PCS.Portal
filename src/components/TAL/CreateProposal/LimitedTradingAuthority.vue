<template>
  <v-col class="container pa-2">
    <v-row no-gutters class="justify-center">
      <v-col cols="12" xs="12" lg="7">
        <v-col class="text-center pt-3">
          <h1>Limited Trading Authority</h1>
        </v-col>
        <v-col class="text-center py-3">
          <h3>Review and confirm Limited Trading Authority on behalf of the Participant</h3>
        </v-col>
        <v-col class="pt-8">
          <v-row>
            <v-col cols="1" xs="1" :class="display.xs.value ? '' : 'pl-5'">
              <v-checkbox
                v-model="participantFinancialProfessional"
                class="pt-0 mt-0 changeCheckboxColor"
                :disabled="disableYesLTA"
                @click="checkYesLTAValue()"
              />
            </v-col>
            <v-col cols="11" xs="11">
              <h3>
                <b>Participant authorizes the Financial Professional</b> to direct investment of the Account and directs PCS |
                Aspire to act on instructions of the Financial Professional without further approval or direction from
                Participant. This grant of Account Access and Limited Trading Authority does not authorize the Financial
                Professional to transfer, withdraw, or disburse money or assets from the account except in connection with the
                assessment of applicable fees.
              </h3>
            </v-col>
          </v-row>
          <v-row class="pt-8">
            <v-col cols="1" xs="1" :class="display.xs.value ? '' : 'pl-5'">
              <v-checkbox
                v-model="noLimitedTradingGranted"
                class="pt-0 mt-0 changeCheckboxColor"
                :disabled="disableNoLTA"
                @click="checkNoLTAValue()"
              />
            </v-col>
            <v-col cols="11" xs="11">
              <h3><b>No Limited Trading Authority is granted</b> to the Financial Professional at this time.</h3>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="pt-16">
          <v-col class="text-center">
            <v-btn
              class="text-capitalize"
              :color="theme.dark ? '' : 'accent'"
              :disabled="!participantFinancialProfessional && !noLimitedTradingGranted"
              @click="goToNextPage()"
              size="large"
            >
              Next
            </v-btn>
          </v-col>
        </v-col>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
export default {
  props: ['opportunityId'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const participantFinancialProfessional = ref(false)
    const noLimitedTradingGranted = ref(false)
    const loader = ref(false)
    const disableNoLTA = ref(false)
    const disableYesLTA = ref(false)
    function goToNextPage() {
      emit('goToNextWindow')
      saveTradingAuthority()
      var value = participantFinancialProfessional.value ? 'Yes' : noLimitedTradingGranted.value ? 'No' : ''
      $store.state.openAccountDetail.LimitedAuthorityTrading = value
    }
    function saveTradingAuthority() {
      loader.value = true
      $axios
        .post(
          `/api/v1/sfdc/opportunity/${props.opportunityId}/limitedtrading/${
            participantFinancialProfessional.value ? 'Yes' : noLimitedTradingGranted.value ? 'No' : ''
          }`
        )
        .then(() => {
          loader.value = false
        })
        .catch(() => {
          loader.value = false
        })
    }
    function checkYesLTAValue() {
      noLimitedTradingGranted.value = false
      if (participantFinancialProfessional.value) {
        disableNoLTA.value = true
      } else {
        disableNoLTA.value = false
      }
    }
    function checkNoLTAValue() {
      participantFinancialProfessional.value = false
      if (noLimitedTradingGranted.value) {
        disableYesLTA.value = true
      } else {
        disableYesLTA.value = false
      }
    }
    onMounted(() => {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        participantFinancialProfessional.value = $store.state.openAccountDetail.LimitedAuthorityTrading === 'Yes' ? true : false
        noLimitedTradingGranted.value = $store.state.openAccountDetail.LimitedAuthorityTrading === 'No' ? true : false
      }
    })
    return {
      theme,
      display,
      participantFinancialProfessional,
      disableYesLTA,
      noLimitedTradingGranted,
      disableNoLTA,
      checkYesLTAValue,
      checkNoLTAValue,
      goToNextPage
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 300px;
}
</style>
