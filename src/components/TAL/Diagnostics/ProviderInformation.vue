<template>
  <v-col class="mt-3">
    <v-form v-show="availableInvestment" ref="form" v-model="valid" lazy-validation>
      <v-col>
        <v-col cols="12" xs="12" sm="6" class="mt-3">
          <v-select
            v-model="providerForm.provider"
            :items="providerList"
            label="Platform Provider"
            clearable
            auto-select-first
            :error="error"
            :error-messages="errorMsg"
            variant="outlined"
            append-icon="icon-chevron-down"
            :rules="[(v) => !!v || 'Platform Provider is required']"
            density="compact"
            @update:model-value="changeProvider()"
          />
        </v-col>
      </v-col>
    </v-form>
  </v-col>
</template>
<script>
import { ref, inject, getCurrentInstance, watch, onMounted } from 'vue'
export default {
  props: ['planId', 'availableInvestment'],
  setup(props, { emit }) {
    const eventBus = inject('eventBus')
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const providerForm = ref({
      provider: ''
    })
    const oldProviderForm = ref({
      provider: ''
    })
    const providerList = ref([])
    const valid = ref(false)
    const error = ref(false)
    const errorMsg = ref('')
    const advisorPlan = ref({})
    const loaded = ref(false)
    const getProviderList = () => {
      $axios.get(`/api/v1/diagnostic/platforms`).then((success) => {
        providerList.value = success.data.d
      })
    }
    const saveProvider = async () => {
      if (providerForm.value.provider) {
        advisorPlan.value.PlanID = props.planId
        advisorPlan.value.AdvisorID = $store.state.user.id
        advisorPlan.value.PlatformName = providerForm.value.provider
        advisorPlan.value.AMCFee = 0
        advisorPlan.value.SSFFee = 0
        advisorPlan.value.AMCOffset = false
        advisorPlan.value.SSFOffset = false
        await $axios.put(`/api/v1/diagnostic/advisor/provider`, advisorPlan.value)
        eventBus.emit('showCurrentInvestment', providerForm.value.provider)
      } else {
        error.value = true
        errorMsg.value = 'Provider is required'
      }
    }
    function getProviderData(planIdVal) {
      if (planIdVal) {
        $axios.get(`/api/v1/plan/${planIdVal}`).then((success) => {
          if (success.data.d !== null) {
            advisorPlan.value = success.data.d
            providerForm.value.provider = success.data.d.platformName
            oldProviderForm.value.provider = providerForm.value.provider
            emit('assignProvider', providerForm.value.provider)
          }
        })
      }
    }
    const checkDecimal = async (model, $event) => {
      if ((event.which < 48 || event.which > 57) && event.which !== 46 && event.which !== 13) {
        $event.preventDefault()
      }
      if (
        providerForm.value[model] != null &&
        providerForm.value[model].indexOf('.') > -1 &&
        providerForm.value[model].split('.')[1].length > 1
      ) {
        $event.preventDefault()
      }
    }
    function validateProvider() {
      if (error.value === true) return false
      else return true
    }
    function providerCompare() {
      if (!Object.compare(providerForm.value, oldProviderForm.value)) return true
      else return false
    }
    function changeProvider() {
      saveProvider()
    }
    watch(
      () => providerForm.value.provider,
      (val) => {
        if (val) {
          error.value = false
          errorMsg.value = ''
        }
      }
    )
    watch(
      () => props.availableInvestment,
      (val) => {
        if (val) {
          getProviderData(props.planId)
        }
      },
      { deep: true, immediate: true }
    )
    onMounted(() => {
      getProviderList()
    })
    return {
      providerForm,
      providerList,
      errorMsg,
      error,
      valid,
      loaded,
      checkDecimal,
      validateProvider,
      providerCompare,
      changeProvider
    }
  }
}
</script>
<style scoped>
.offsetSwitch.v-input.v-input--selection-controls.v-input--switch {
  -webkit-box-pack: start !important;
  justify-content: start !important;
}
</style>
<style>
.advisorFee .v-input__slot {
  margin-bottom: 0px !important;
}
</style>
