<template>
  <v-dialog v-model="filterDialog" persistent class="elevation-3" scrollable :eager="true" :max-width="dialogWidth">
    <v-card :height="dialogHeight">
      <v-card-title class="pt-3 pb-2" :class="$vuetify.theme.dark ? '' : 'accent'">
        <v-flex xs12>
          <v-row no-gutters>
            <!-- <v-flex xl1 lg1 sm1 md1 xs1 class="text-left align-self" v-if="selectedpage !== 0 && selectedpage !== 2">
              <v-icon color="accent" @click="goBackToPreviousPage(selectedpage)">arrow_back</v-icon>
            </v-flex> -->
            <v-flex xl11 lg11 sm11 md11 xs11 class="align-self text-left font_14 text-secondary">
              <h3 class="text-secondary">Open new Solo (k) account</h3>
            </v-flex>
            <v-flex xl1 lg1 sm1 md1 xs1 class="text-right align-self">
              <v-icon color="secondary" @click="closeWindow()">close</v-icon>
            </v-flex>
          </v-row>
        </v-flex>
      </v-card-title>
      <v-card-text class="justify-center align-center d-flex">
        <div class="container pa-0" v-if="loading">
          <v-flex class="justify-center">
            <v-card :class="[$vuetify.breakpoint.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
              <Loader :loadingText="`Loading..`" :loading="loading" />
            </v-card>
          </v-flex>
        </div>
        <div class="container pa-0" v-if="!loading">
          <v-row no-gutters class="justify-center">
            <v-flex xs12 v-if="selectedpage === 0" lg9 md9 sm9 class="justify-center">
              <v-flex class="text-center">
                <h1 class="font-weight-normal">Solo(k) account request</h1>
              </v-flex>
              <v-flex class="text-center" pt-10>
                <h2>Requesting a Solo(k) account is a simple process that starts here.</h2>
              </v-flex>
              <v-flex class="pt-6 justify-center">
                <v-row no-gutters class="justify-center">
                  <v-flex lg7 :key="index" v-for="(item, index) in processFlowDetails" class="pt-7">
                    <v-row class="justify-center">
                      <v-flex xs1 class="text-center">
                        <v-avatar class="bg-accent" size="25">
                          <h4 style="color: white">
                            <b>{{ item.value }}</b>
                          </h4>
                        </v-avatar>
                      </v-flex>
                      <v-flex xs11 class="pl-3"
                        ><h2>{{ item.text }}</h2></v-flex
                      ></v-row
                    >
                  </v-flex>
                </v-row>
              </v-flex>
              <v-flex class="text-center pt-10" v-if="false">
                <h2>Once the plan is approved, the account holder will receive a plan</h2>
                <h2>package that will need to be digitally signed to complete the process.</h2>
              </v-flex>
              <v-flex pt-16>
                <v-flex class="text-center">
                  <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="getStarted()"
                    >Get started</v-btn
                  >
                </v-flex>
              </v-flex>
              <v-flex class="pt-5 mt-5 text-center">
                <h3>
                  <b>Have questions?</b> Call us at 866-634-5873 | Select option 2 and then option 2 again | or email us at
                  internalsales@pcscapital.com
                </h3>
              </v-flex>
            </v-flex>
            <v-flex xs12 v-if="selectedpage === 1" lg8 md8 sm8 class="justify-center px-5">
              <v-flex class="text-center">
                <h1 class="font-weight-normal">Before you start</h1>
              </v-flex>
              <v-flex class="text-left" pt-10>
                <h2>
                  The following Solo(k) form will roughly take about 10-15 minutes to complete and submit.You must complete the
                  entire form. If you exit before submitting the form, you will have to start again.
                </h2>
              </v-flex>
              <v-flex class="text-left" pt-5>
                <h2>Keep the following information handy before you start the request process</h2>
              </v-flex>
              <v-flex class="pt-4 justify-center">
                <v-row no-gutters class="justify-center">
                  <v-flex :key="index" v-for="(item, index) in beforeStartDetails" class="pt-5 lg8">
                    <v-row class="justify-center">
                      <v-flex xs2 class="text-center">
                        <v-avatar class="bg-accent" size="25">
                          <h4 style="color: white">
                            <b>{{ item.value }}</b>
                          </h4>
                        </v-avatar>
                      </v-flex>
                      <v-flex xs10 class="pt-1"
                        ><h2>{{ item.text }}</h2></v-flex
                      ></v-row
                    >
                  </v-flex>
                </v-row>
              </v-flex>
              <v-flex xs12 pt-10>
                <v-flex class="text-center">
                  <v-col class="pa-0">
                    <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="startProcess()"
                      >Start</v-btn
                    >
                  </v-col>
                  <v-col class="pl-0 pr-0 pt-2">
                    <v-btn
                      class="text-capitalize mx-0"
                      variant="outlined"
                      :color="$vuetify.theme.dark ? '' : 'accent'"
                      @click="goBackToPreviousPage(selectedpage)"
                    >
                      Go Back
                    </v-btn>
                  </v-col>
                </v-flex>
              </v-flex>
            </v-flex>
            <v-flex xs12 v-if="selectedpage === 2" class="justify-center">
              <SoloKFlowDetails @selectedPageValue="selectedPageValue" @closeSoloKMainDialog="closeWindow" />
            </v-flex>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Loader from '@/components/NewLoader'
import SoloKFlowDetails from '@/components/Home/Acquisition/SoloKOpenAccountFlow/SoloKFlowDetails'
export default {
  data() {
    return {
      selectedpage: 0,
      loading: false,
      processFlowDetails: [
        {
          value: 1,
          text: 'Fill out this online form to submit a Solo(K) account request.'
        },
        {
          value: 2,
          text: 'Upon submission, a plan package will be emailed to you by our sales team for digital signature.'
        },
        {
          value: 3,
          text: 'Additionally, a PDF copy of this request will be emailed to you.'
        }
      ],
      beforeStartDetails: [
        {
          value: 1,
          text: 'Advisor contact information'
        },
        {
          value: 2,
          text: 'Plan information and contacts'
        },
        {
          value: 3,
          text: 'Account holder information'
        },
        {
          value: 4,
          text: 'Investment selection and election percentage'
        },
        {
          value: 5,
          text: 'Statement preferences'
        }
      ]
    }
  },
  props: ['value', 'fromPage'],
  components: {
    Loader,
    SoloKFlowDetails
  },
  computed: {
    filterDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    dialogHeight() {
      if (this.$vuetify.breakpoint.xlOnly) return `calc(105vh - 300px)`
      else if (this.$vuetify.breakpoint.lgOnly) {
        if (this.$vuetify.breakpoint.width < 1400 && this.$vuetify.breakpoint.width > 1300) return `calc(100vh - 120px)`
        else return `calc(115vh - 200px)`
      } else if (this.$vuetify.breakpoint.mdOnly) return `calc(100vh - 200px)`
      else if (this.$vuetify.breakpoint.smOnly) return `calc(100vh - 300px)`
      else return `calc(100vh - 100px)`
    },
    dialogWidth() {
      if (this.$vuetify.breakpoint.xlOnly) return '55%'
      else if (this.$vuetify.breakpoint.lgOnly) return '67%'
      else return '90%'
    }
  },
  methods: {
    goBackToPreviousPage(val) {
      if (val === 1) {
        this.selectedpage = 0
      } else if (val === 2) {
        this.selectedpage = 1
      } else if (val === 3) {
        this.selectedpage = 2
      } else if (val === 4) {
        this.selectedpage = 3
      } else if (val === 5) {
        this.selectedpage = 4
      }
    },
    selectedPageValue(val) {
      this.goBackToPreviousPage(val)
    },
    closeWindow() {
      this.selectedpage = 0
      this.$store.state.soloKOpenAccoutDetail = {}
      this.filterDialog = false
    },
    getStarted() {
      this.selectedpage = 1
    },
    startProcess() {
      this.selectedpage = 2
    }
  }
}
</script>
<style scoped>
ul ::marker {
  font-size: 200%;
  color: #0077cc;
  padding-top: 10px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
