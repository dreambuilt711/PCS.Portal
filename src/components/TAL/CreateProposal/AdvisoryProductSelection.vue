<template>
  <v-col>
    <v-col>
      <v-col class="text-center py-3">
        <h1>Select Client Product</h1>
      </v-col>
      <v-col class="text-center py-6">
        <h3>Select the Client Product you want to include in the proposal. As a fee-based advisor, you will</h3>
        <h3>be asked to include fee deatils at a later step in this application.</h3>
      </v-col>
      <v-col>
        <div v-if="showClientProductLoader" class="container">
          <v-card :class="[display.xs.value ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="350" width="100%">
            <Loader :loading-text="`Loading..`" :loading="showClientProductLoader" />
          </v-card>
        </div>
        <div v-if="!showClientProductLoader" v-dragscroll="true" class="container">
          <v-col
            v-for="(item, index) in clientProductData"
            :key="index"
            cols="10"
            xl="3"
            lg="3"
            md="4"
            sm="4"
            xs="10"
            class="ma-3"
          >
            <v-card :class="[display.xs.value ? 'elevation-6 pa-2 card_heightNew' : 'elevation-6 pa-4 card_heightNew']">
              <v-col class="text-center imageFlexFixPosition py-3">
                <img :src="item.WebLogo ? item.WebLogo : contentURL" width="100%" height="100%" :contain="true" />
              </v-col>
              <v-col class="text-left fixHeightForFlex py-3 pl-3">
                <h3>
                  <b>{{ item.ClientProductName }}</b>
                </h3>
              </v-col>
              <v-row class="pb-2">
                <v-col class="text-center">
                  <a
                    class="font_14"
                    :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                    @click="showInvestments(item.ClientProductId)"
                  >
                    Investments
                  </a>
                </v-col>
                <v-divider inset vertical class="d-none d-block" />
                <v-col class="text-center">
                  <a
                    class="font_14"
                    :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                    @click="showFees(item.ClientProductId)"
                  >
                    Fees
                  </a>
                </v-col>
              </v-row>
              <v-row justify="center" class="pt-4">
                <v-btn :color="theme.dark ? '' : 'accent'" class="mx-0 buttonFixPosition" @click="continueDetails(item)">
                  Choose and continue
                </v-btn>
              </v-row>
            </v-card>
          </v-col>
        </div>
      </v-col>
      <div v-if="!showClientProductLoader && clientProductData.length === 0" class="pt-5">
        <v-card class="cardHeight nonSelectedBackground" :class="!display.xs.value ? 'pa-16' : 'pa-12'">
          <v-col class="text-h5 text-center py-14">
            <h5>No Client Product Found</h5>
          </v-col>
        </v-card>
      </div>
    </v-col>
    <v-col v-if="showModelFlag">
      <AdvisoryInvestments v-model="investmentDialog" :investment-message="investmentMessage" :header-text="headerText" />
    </v-col>
    <v-col v-if="investmentDialog">
      <AdvisoryInvestments
        v-model="investmentDialog"
        :investment-message="investmentMessage"
        :header-text="headerText"
        :ClientProductId="ClientProductId"
      />
    </v-col>
    <v-col v-if="feesDialog">
      <AdvisoryFees v-model="feesDialog" :ClientProductId="ClientProductId" />
    </v-col>
    <v-col v-if="docsDialog">
      <AdvisoryDocs v-model="docsDialog" />
    </v-col>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import AdvisoryInvestments from '@/components/TAL/CreateProposal/AdvisoryInvestments'
import AdvisoryFees from '@/components/TAL/CreateProposal/AdvisoryFees'
import AdvisoryDocs from '@/components/TAL/CreateProposal/AdvisoryDocs'
import Loader from '@/components/NewLoader'
export default {
  components: {
    AdvisoryInvestments,
    AdvisoryFees,
    AdvisoryDocs,
    Loader
  },
  props: ['clientProductData', 'showClientProductLoader'],
  setup(props, { emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const contentURL = ref($store.state.user.selectedProgram.brand.web_Logo__c)
    const investmentDialog = ref(false)
    const feesDialog = ref(false)
    const docsDialog = ref(false)
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 20
    })
    const show = ref(false)
    const showModelFlag = ref(false)
    const investmentMessage = ref('')
    const headerText = ref('')
    const editFlag = ref(false)
    const showAccountSetUp = ref(false)
    const ClientProductId = ref('')
    function continueDetails(val) {
      emit('continueDetails', val)
    }
    function showInvestments(val) {
      investmentDialog.value = true
      investmentMessage.value =
        'Seeks to maximize capital appreciation. The majority of the portfolio will generally be allocated to equities. Investors should realize that the equity emphasis will likely produce a significant level of volatility.'
      headerText.value = 'Available Investments'
      ClientProductId.value = val
    }
    function showFees(clientProductId) {
      feesDialog.value = true
      ClientProductId.value = clientProductId
    }
    function showDocs() {
      docsDialog.value = true
    }
    function showModelDetails(val) {
      if (val) {
        showModelFlag.value = true
        investmentDialog.value = true
        investmentMessage.value =
          'Seeks to maximize capital appreciation. Current income is not a consideration. The majority of the portfolio will generally be allocated to equities. Investors should realize that the equity emphasis will likely produce a significant level of volatility.'
        headerText.value = 'EA Agressive Fund List'
      }
    }
    return {
      theme,
      display,
      contentURL,
      showModelFlag,
      investmentDialog,
      investmentMessage,
      headerText,
      ClientProductId,
      feesDialog,
      docsDialog,
      pagination,
      show,
      editFlag,
      showAccountSetUp,
      showDocs,
      showModelDetails,

      showInvestments,
      showFees,
      continueDetails
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 200px;
}
.v-divider--vertical.v-divider--inset {
  margin-top: 2px;
  min-height: 0;
  max-height: calc(100% - 16px);
}
.widthForTooltip {
  width: 450px;
}
.dashboardflex {
  height: 490px !important;
  max-width: 412px !important;
  border-radius: 6px !important;
}
.card_heightNew {
  height: 300px !important;
  border-radius: 6px !important;
}
.container {
  display: -webkit-box !important;
  overflow-x: hidden;
}
.imageFlexFixPosition {
  height: 70px !important;
}
.buttonFixPosition {
  position: absolute !important;
  bottom: 15px !important;
}
.nonSelectedBackground {
  background-color: #dddddd !important;
}
.fixHeightForFlex {
  height: 100px !important;
}
</style>
