<template>
  <v-dialog
    v-model="feesDialog"
    persistent
    class="elevation-3"
    :class="dialogPositionNew"
    :content-class="dialogPositionNew"
    scrollable
    :eager="true"
    :max-width="dialogWidth"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>
        <v-col cols="12" xs="12">
          <v-row>
            <v-col cols="11" xs="11" class="text-left">
              <h3>Participant Account Fees</h3>
            </v-col>
            <v-col cols="1" xs="1" class="text-right">
              <v-icon color="accent" @click="closeFeesDialog()"> close </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-col class="text-left font_12 py-6">
          <h3>
            Participant understands and agrees that certain annual fees will apply to the Account. These fees will include an
            Annual Maintenance Fee of $40.00 and an Annual Custody and Administration fee of 0.15% of the value of the Account.
            These fees will be assessed on a monthly or quarterly billing cycle and will be assessed, pro rata, from the assets in
            the Account. Participant understands and agrees that these fees may change, from time to time, upon notice from
            Aspire.
          </h3>
        </v-col>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, getCurrentInstance, computed } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  props: ['value', 'ClientProductId'],
  setup(props, { emit }) {
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const feesData = ref([])
    function closeFeesDialog() {
      feesDialog.value = false
    }
    function getAdvisorFeesDetails() {
      $axios.get(`/api/v1/user/clientproductfees/${props.ClientProductId}`).then((success) => {
        if (success.data && success.data.length > 0) {
          feesData.value = success.data
        }
      })
    }
    const feesDialog = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const dialogWidth = computed(() => {
      if (display.xl.value) return '55%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    const dialogPositionNew = computed(() => {
      if (display.xl.value) {
        return `dialogBigScreen`
      } else if (display.lg.value) {
        return `dialoglgScreen`
      } else if (display.md.value) return `dialogMdScreen`
      else if (display.sm.value) return `dialogSmScreen`
      else return `dialoglgScreen`
    })
    return {
      feesDialog,
      dialogPositionNew,
      dialogWidth,
      getAdvisorFeesDetails,
      closeFeesDialog
    }
  }
}
</script>
