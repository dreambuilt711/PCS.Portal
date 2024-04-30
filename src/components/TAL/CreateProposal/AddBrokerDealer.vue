<template>
  <v-col v-if="openBrokerDealer" xs12 lg12 pt-16 pb-12 class="justify-center">
    <v-dialog
      v-model="openBrokerDealer"
      persistent
      class="elevation-3"
      :class="dialogPositionNew"
      :content-class="dialogPositionNew"
      scrollable
      :eager="true"
      transition="dialog-bottom-transition"
      :max-width="dialogWidth"
    >
      <v-card>
        <v-card-title>
          <v-col xs12>
            <v-col class="text-right">
              <v-icon color="accent" @click="closeBrokerDialog()"> close </v-icon>
            </v-col>
          </v-col>
        </v-card-title>
        <v-card-text :class="$vuetify?.breakpoint?.xs ? 'pa-2' : 'px-2 py-0'">
          <v-col xs12>
            <h1 class="text-center pb-2">Add Broker Dealer Rep Code</h1>
          </v-col>
          <v-col xs12>
            <h3 class="text-center">Look up a broker dealer or enter name and code manually</h3>
          </v-col>
          <v-row justify="center" class="pt-5">
            <v-form ref="form" v-model="valid">
              <v-row justify="center">
                <v-col sm8 xs12 py-3>
                  <v-row justify="center">
                    <v-col xs12>
                      <v-row>
                        <div class="text-h6 pb-1 pt-2">Broker Dealer Rep Code</div>
                        <v-col xs12>
                          <v-text-field
                            v-model="brokerDealerRepCode"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '0',
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false
                            }"
                            variant="outlined"
                            density="compact"
                            placeholder="Enter Broker Dealer Rep Code"
                            :error="brokerDelearError"
                            :error-messages="brokerDelearErrorMsg"
                            required
                            :rules="[(v) => !!v || 'Rep Code is required']"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col xs12>
                      <div class="text-h6 pb-1 pt-2 align-self">Select Broker Dealer</div>
                      <v-col xs12>
                        <v-row>
                          <v-col xs12>
                            <v-select
                              v-model="broker"
                              variant="outlined"
                              density="compact"
                              :items="brokerDealerList"
                              placeholder="Select Broker Dealer"
                              append-icon="icon-chevron-down"
                              item-title="DealerName"
                              item-value="Id"
                              required
                              :rules="[(v) => !!v || 'Broker Dealer is required']"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                    <v-col v-if="broker ? broker === '0' : false" xs12>
                      <v-row>
                        <div class="text-h6 pb-1 pt-2">Broker Dealer Name</div>
                        <v-col xs12>
                          <v-text-field
                            v-model="brokerDealerName"
                            variant="outlined"
                            density="compact"
                            placeholder="Enter Broker Dealer Name"
                            :error="brokerDelearNameError"
                            :error-messages="brokerDelearNameErrorMsg"
                            required
                            :rules="[(v) => !!v || 'Broker Dealer Name is required']"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-btn
                  class="text-capitalize pl-15 pr-15"
                  :color="$vuetify?.theme.dark ? '' : 'accent'"
                  :disabled="!valid"
                  :loading="loading"
                  @click="saveBrokerDealer()"
                >
                  Save
                  <template #loading>
                    <span class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </template>
                </v-btn>
                <v-btn
                  class="text-none"
                  variant="text"
                  :color="$vuetify?.theme.dark ? '' : 'accent'"
                  @click="closeBrokerDialog()"
                >
                  Cancel, go back
                </v-btn>
              </v-row>
            </v-form>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {
      brokerDealerList: [],
      valid: false,
      brokerDealerRepCode: '',
      brokerDelearError: false,
      brokerDelearErrorMsg: '',
      broker: '',
      brokerDealerName: '',
      brokerDelearNameError: false,
      brokerDelearNameErrorMsg: '',
      showBrokerDealerName: false,
      loading: false
    }
  },
  computed: {
    openBrokerDealer: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    dialogWidth() {
      if (this.$vuetify?.breakpoint?.xlOnly) return '55%'
      else if (this.$vuetify?.breakpoint?.lgOnly) return '70%'
      else return '90%'
    },
    dialogPositionNew() {
      if (this.$vuetify?.breakpoint?.xlOnly) {
        return `dialogBigScreen`
      } else if (this.$vuetify?.breakpoint?.lgOnly) {
        return `dialoglgScreen`
      } else if (this.$vuetify?.breakpoint?.mdOnly) return `dialogMdScreen`
      else if (this.$vuetify?.breakpoint?.smOnly) return `dialogSmScreen`
      else return `dialoglgScreen`
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.openAccountDetail).length > 0) {
      this.brokerDealerList =
        this.$store.state.openAccountDetail.brokerDealerList && this.$store.state.openAccountDetail.brokerDealerList.length > 0
          ? this.$store.state.openAccountDetail.brokerDealerList
          : []
      this.brokerDealerRepCode = this.$store.state.openAccountDetail.RepCode ? this.$store.state.openAccountDetail.RepCode : ''
      if (this.$store.state.openAccountDetail.BrokerDealerManual) {
        this.broker = '0'
        this.brokerDealerName = this.$store.state.openAccountDetail.BrokerDealerManual
      } else {
        this.broker = this.$store.state.openAccountDetail.BrokerDealerId ? this.$store.state.openAccountDetail.BrokerDealerId : ''
        this.brokerDealerName = ''
      }
    }
  },
  methods: {
    closeBrokerDialog() {
      this.openBrokerDealer = false
      this.$emit('closeBrokerDialog')
    },
    saveBrokerDealer() {
      this.loading = true
      var brokerDealerName = ''
      if (this.broker !== '0') {
        let dealerSelected = this.brokerDealerList.filter((a) => a.Id === this.broker)
        brokerDealerName = dealerSelected && dealerSelected.length > 0 ? dealerSelected[0].DealerName : ''
      }
      if (this.$store.state.openAccountDetail.OpportunityId) {
        this.$store.state.openAccountDetail.BrokerDealerId = this.broker && this.broker !== '0' ? this.broker : ''
        this.$store.state.openAccountDetail.BrokerDealerName = this.broker && this.broker !== '0' ? brokerDealerName : ''
        this.$store.state.openAccountDetail.RepCode = this.brokerDealerRepCode
        this.$store.state.openAccountDetail.BrokerDealerManual = this.broker && this.broker === '0' ? this.brokerDealerName : ''

        this.$axios.post(`/api/v1/sfdc/opportunity/brokerUpdate`, this.$store.state.openAccountDetail).finally(() => {
          this.loading = false
          this.closeBrokerDialog()
        })
      }
    }
  }
}
</script>
