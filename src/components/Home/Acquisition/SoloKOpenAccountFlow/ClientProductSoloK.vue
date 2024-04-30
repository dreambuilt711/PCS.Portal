<template>
  <v-flex>
    <v-flex class="text-center" pt-3>
      <h1>Select Client Product</h1>
    </v-flex>
    <v-flex class="text-center" py-6>
      <h3>Select the Client Product you want to include in the proposal. As a fee-based advisor, you will</h3>
      <h3>be asked to include fee deatils at a later step in this application.</h3>
    </v-flex>
    <!-- <v-flex xs12 sm5 md5 lg4 xl5 :class="$vuetify.breakpoint.xsOnly ? 'pb-2' : ''" class="pl-6">
      <div class="title pb-1">Select client product type</div>
      <v-select
        density="compact"
        variant="outlined"
        placeholder="Select"
        v-model="clientProductType"
        :items="clientProductTypeList"
        
        append-icon="icon-chevron-down"
        hide-details
        return-object
      ></v-select>
    </v-flex> -->
    <v-flex>
      <div class="container py-2" v-if="showClientProductLoader">
        <v-card :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="350" width="100%">
          <Loader :loadingText="`Loading..`" :loading="showClientProductLoader" />
        </v-card>
      </div>
      <div class="container py-0 justify-center" v-if="!showClientProductLoader" v-dragscroll="true">
        <v-flex v-for="(item, index) in clientProductData" :key="index" class="xl3 lg3 md4 sm4 xs10 ma-3">
          <v-card :class="[$vuetify.breakpoint.xs ? 'elevation-6 pa-2 card_heightNew' : 'elevation-6 pa-4 card_heightNew']">
            <v-flex class="text-center imageFlexFixPosition" py-3>
              <img :src="item.WebLogo ? item.WebLogo : contentURL" width="100%" height="100%" :contain="true" />
            </v-flex>
            <v-flex class="text-left fixHeightForFlex" py-3 pl-3>
              <h3 class="">
                <b>{{ item.ClientProductName }}</b>
              </h3>
              <h3 class="pt-3">
                {{ item.FeeType }}
              </h3>
            </v-flex>
            <v-row class="pb-2" v-if="false">
              <v-flex class="text-center">
                <a
                  class="font_14"
                  :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']"
                  @click="showInvestments(item.ClientProductId)"
                  >Investments</a
                >
              </v-flex>
              <v-divider vertical class="bold my-1 mx-1"></v-divider>
              <v-flex class="text-center">
                <a
                  class="font_14"
                  :class="[!$vuetify.theme.dark ? 'text-hyperlink' : 'text-white']"
                  @click="showFees(item.ClientProductId)"
                  >Fees</a
                >
              </v-flex>
            </v-row>
            <v-row justify="center" class="mt-5">
              <v-btn :color="$vuetify.theme.dark ? '' : 'accent'" @click="continueDetails(item)" class="mx-0"
                >Choose and continue</v-btn
              >
            </v-row>
          </v-card>
        </v-flex>
      </div>
    </v-flex>
    <div v-if="!showClientProductLoader && clientProductData.length === 0" class="pt-5">
      <v-card class="cardHeight nonSelectedBackground" :class="!$vuetify.breakpoint.xs ? 'pa-16' : 'pa-12'">
        <v-flex class="text-h5 text-center py-14"><h5>No Client Product Found</h5> </v-flex>
      </v-card>
    </div>
    <v-row justify="center">
      <v-flex lg6 md8 sm8>
        <v-flex pt-8>
          <v-flex class="text-center">
            <v-col class="pl-0 pr-0">
              <v-btn
                class="text-capitalize btnStyle"
                variant="outlined"
                :color="$vuetify.theme.dark ? '' : 'accent'"
                @click="prevSlide()"
                >Go Back</v-btn
              >
            </v-col>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-row>
  </v-flex>
</template>
<script>
import Loader from '@/components/NewLoader'
export default {
  data() {
    return {
      contentURL: this.$store.state.user.selectedProgram.brand.web_Logo__c,
      showClientProductLoader: false,
      clientProductData: [],
      planTypeNameValue: ''
    }
  },
  mounted() {
    this.getSoloKClientProductDetails()
  },
  components: {
    Loader
  },
  methods: {
    getSoloKClientProductDetails() {
      this.showClientProductLoader = true
      this.planTypeNameValue = 'Solo K'
      this.$axios
        .get(`/api/v1/user/clientproduct/plantypename/${this.planTypeNameValue}`)
        .then((success) => {
          var clientProductDetails = success.data && success.data.length > 0 ? success.data : []
          if (clientProductDetails.length > 0) {
            clientProductDetails.sort(function (a, b) {
              return new Date(b.CreatedDate) - new Date(a.CreatedDate)
            })
          }
          this.clientProductData = clientProductDetails
          this.showClientProductLoader = false
        })
        .catch(() => {
          this.showClientProductLoader = false
        })
    },
    continueDetails(val) {
      this.$store.state.soloKOpenAccountDetail.ClientProduct = val && val.ClientProductId ? val.ClientProductId : ''
      this.$store.state.soloKOpenAccountDetail.ClientProductName = val && val.ClientProductName ? val.ClientProductName : ''
      this.$store.state.soloKOpenAccountDetail.FeeTypeDetail = val && val.FeeType ? val.FeeType : ''
      //this.$emit('nextSlide')
      this.$emit('displayFeeSchedule', this.$store.state.soloKOpenAccountDetail.FeeTypeDetail)
    },
    prevSlide() {
      this.$emit('prevSlide')
    }
  }
}
</script>
<style scoped>
/* .container {
  display: flex;
  overflow-x: auto;
} */
.container {
  display: -webkit-box !important;
  overflow-x: hidden;
}
.card_heightNew {
  height: 300px !important;
  border-radius: 6px !important;
}
.imageFlexFixPosition {
  height: 70px !important;
}
.fixHeightForFlex {
  height: 135px !important;
}
.btnStyle {
  height: 46px !important;
  width: 250px !important;
}
</style>
