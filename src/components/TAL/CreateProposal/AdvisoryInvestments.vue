<template>
  <v-dialog
    v-model="investmentDialog"
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
              {{ headerText }}
            </v-col>
            <v-col cols="1" xs="1" class="text-right">
              <v-icon color="accent" @click="closeInvestmentDialog()"> mdi-close </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-col class="text-left px-4">
          <h3>{{ investmentMessage }}</h3>
        </v-col>
        <div v-if="showInvestmentLoader" class="container">
          <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="350" width="100%">
            <Loader :loading-text="`Loading..`" :loading="showInvestmentLoader" />
          </v-card>
        </div>
        <v-col v-if="!showInvestmentLoader" class="pt-1">
          <AddAdvisoryInvestment
            ref="addInvestement"
            :reports="'ClientProduct_Benchmark'"
            :investment-list="investmentData"
            :hide-from-fund="true"
          />
        </v-col>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useDisplay } from 'vuetify'
import AddAdvisoryInvestment from '@/components/TAL/CreateProposal/AddAdvisoryInvestment'
import Loader from '@/components/NewLoader'
export default {
  components: {
    AddAdvisoryInvestment,
    Loader
  },
  props: ['value', 'investmentMessage', 'headerText', 'ClientProductId'],
  setup(props, { emit }) {
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const investmentData = ref([])
    const showInvestmentLoader = ref(false)
    const addInvestement = ref(null)
    function closeInvestmentDialog() {
      investmentDialog.value = false
    }
    function getAdvisorInvestmentDetails() {
      showInvestmentLoader.value = true
      $axios.get(`/api/v1/user/clientproductinvestment/${props.ClientProductId}`).then((success) => {
        investmentData.value = success.data && success.data.length > 0 ? success.data : []
        investmentData.value.forEach((element) => {
          element.mgmt = element.mgmt * 100
          element.tload = element.tload * 100
          element.SubTA = element.SubTA * 100
          element.Total = element.Total * 100
        })
        showInvestmentLoader.value = false
      })
    }
    const investmentDialog = computed({
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
    onMounted(() => {
      getAdvisorInvestmentDetails()
    })
    return {
      display,
      investmentDialog,
      dialogPositionNew,
      dialogWidth,
      showInvestmentLoader,
      addInvestement,
      investmentData,
      closeInvestmentDialog
    }
  }
}
</script>
