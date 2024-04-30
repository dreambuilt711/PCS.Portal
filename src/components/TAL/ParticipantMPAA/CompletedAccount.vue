<template>
  <v-row no-gutters class="justify-center">
    <v-col xl12 lg12 pa-2 class="justify-center">
      <v-row v-if="loader" class="justify-center">
        <v-col class="justify-center">
          <v-card :class="[$vuetify?.breakpoint?.xs ? 'elevation-0 pa-2' : 'elevation-0 pa-4']" height="250" width="100%">
            <Loader :loading-text="`Saving..`" :loading="loader" />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="!loader" class="justify-center pb-6 pt-6">
        <v-col lg8 class="text-center">
          <v-row no-gutters class="justify-center">
            <v-col lg5 xl5 class="shortcutflex">
              <v-col class="logoflex">
                <v-img :src="contentURL" :eager="true" max-width="100%" max-height="100%" />
              </v-col>
            </v-col>
          </v-row>
          <v-col py-4 mt-6>
            <h1 class="welcomeFont">Your Retirement Account is all set, start saving today!</h1>
          </v-col>
          <v-col>
            <h3>While we set up your account, get in touch with your financial advisor to start funding your account today!</h3>
          </v-col>
          <v-col mt-6>
            <v-row no-gutters justify="center">
              <v-col lg8>
                <v-divider class="bold mx-4 my-6" />
                <v-col xs12 class="mb-2">
                  <h3>For additional questions about your account please call:</h3>
                </v-col>
                <v-col xs12 class="mb-2">
                  <h3>{{ presenterName }}</h3>
                </v-col>
                <v-col xs12 class="mb-2">
                  <h3 class="font-weight-bold">
                    {{ firmName }}
                  </h3>
                </v-col>
                <v-col xs12 class="mb-2">
                  <h3>{{ presenterPhone }}</h3>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import Loader from '@/components/NewLoader'
export default {
  components: {
    Loader
  },
  props: ['contentURL'],
  data() {
    return {
      presenterName: '',
      presenterPhone: '',
      firmName: '',
      loader: true
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.firmName = this.$store.state.openAccountDetail.FirmName ? this.$store.state.openAccountDetail.FirmName : ''
      this.presenterName = this.$store.state.openAccountDetail.PresenterName
        ? this.$store.state.openAccountDetail.PresenterName
        : ''
      this.presenterPhone = this.$store.state.openAccountDetail.PresenterPhone
        ? this.$store.state.openAccountDetail.PresenterPhone
        : ''
    }
    setTimeout(() => {
      this.loader = false
    }, 5000)
  },
  methods: {}
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 300px;
}
</style>
