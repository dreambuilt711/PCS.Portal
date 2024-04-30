<template>
  <v-col>
    <v-col v-if="splitFeeSchedule">
      <v-row no-gutters>
        <v-col xs12 class="text-center pb-3">
          <h1>
            Add Split % for the Advisors
            <v-icon class="icon-information ml-2" size="18" color="#0077CC" />
          </h1>
        </v-col>
      </v-row>
      <v-col class="text-center" pb-4>
        <h4 class="text-h6">Review and confirm the Split % for all the advisors on the proposal</h4>
      </v-col>
      <v-container :fluid="true">
        <v-row no-gutters class="justify-center">
          <v-col
            v-for="(item, index) in advisorInformationData"
            :key="index"
            class="lg4 xl3 md4 sm6 xs12 text-center pt-4"
            :class="[
              $vuetify?.breakpoint?.smOnly ? ((index + 1) % 2 === 0 ? '' : 'pr-3') : '',
              $vuetify?.breakpoint?.mdOnly || $vuetify?.breakpoint?.lgOnly ? ((index + 1) % 3 === 0 ? '' : 'pr-3') : '',
              $vuetify?.breakpoint?.xlOnly ? ((index + 1) % 4 === 0 ? '' : 'pr-4') : ''
            ]"
          >
            <v-card class="elevation-6">
              <v-col class="text-center" py-10 px-2>
                <img :src="item.WebLogo" width="80%" :height="$vuetify?.breakpoint?.xs ? '80%' : '40%'" />
              </v-col>
              <v-col class="text-center">
                <h2>{{ item.Name }}</h2>
              </v-col>
              <v-col class="text-center text-capitalize" py-2>
                <h3>
                  <b>{{ item.FirmName }}</b>
                </h3>
              </v-col>
              <v-col class="text-center">
                <h3>
                  {{ item.Address1 + item.Address2 + item.State + item.Zip }}
                </h3>
              </v-col>
              <v-col class="text-center" py-2 pb-12>
                <h3>{{ item.Phone }}</h3>
              </v-col>
            </v-card>
            <v-col pt-3>
              <v-text-field
                v-model="item.SplitRatio"
                v-input-mask="{
                  alias: 'numeric',
                  digits: '2',
                  rightAlign: false,
                  allowMinus: false,
                  digitsOptional: true,
                  placeholder: '0'
                }"
                placeholder="Split value"
                maxlength="10"
                density="compact"
                variant="outlined"
                suffix="%"
                hide-details
                @change="checkFeesSplitValue(item)"
              />
            </v-col>
          </v-col>
        </v-row>
      </v-container>
      <v-col class="text-center">
        <v-col class="errorMessage">
          {{ showSplitMessage }}
        </v-col>
      </v-col>
      <v-col xs12 pt-4 class="text-center">
        <v-btn
          :color="$vuetify?.theme.dark ? '' : 'accent'"
          class="mx-0"
          :disabled="disableNextButton"
          @click="goToAccountSetUp()"
        >
          Next
        </v-btn>
      </v-col>
    </v-col>
  </v-col>
</template>
<script>
export default {
  props: ['splitFeeSchedule', 'advisorInformationData', 'opportunityId'],
  data() {
    return {
      showSplitMessage: '',
      disableNextButton: true,
      splitAdvisorsDetails: []
    }
  },
  methods: {
    goToAccountSetUp() {
      this.$emit('goToProductSelectionPage')
      this.updateAdvisorSplit()
    },
    checkFeesSplitValue(val) {
      if (val) {
        let splitArrayValue =
          this.advisorInformationData && this.advisorInformationData.length > 0 ? this.advisorInformationData.length : 0
        let SplitRatio = val.SplitRatio ? parseFloat(val.SplitRatio) : 0
        if (SplitRatio > 100) {
          this.showSplitMessage = '* All Split percentages must add up to 100.'
          this.disableNextButton = true
          return
        }
        if (splitArrayValue > 1) {
          let remainingSplitValue = 100 - SplitRatio
          let divideRemainingSplitValue = remainingSplitValue / (splitArrayValue - 1)
          this.advisorInformationData.forEach((element) => {
            if (element.AdvisorId !== val.AdvisorId) {
              element.SplitRatio = parseFloat(divideRemainingSplitValue)
            } else {
              element.SplitRatio = parseFloat(SplitRatio)
            }
          })
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          this.advisorInformationData[0].SplitRatio = SplitRatio
        }
      }
      let totalSplitValue = 0
      if (this.advisorInformationData && this.advisorInformationData.length > 0) {
        this.advisorInformationData.forEach((element) => {
          totalSplitValue += parseFloat(element.SplitRatio)
        })
      }
      this.showSplitMessage = totalSplitValue !== 100 ? '* All Split percentages must add up to 100.' : ''
      this.disableNextButton = totalSplitValue !== 100 ? true : false
    },
    updateAdvisorSplit() {
      this.loading = true
      var splitData = []
      this.advisorInformationData.forEach((element) => {
        var saveAdvisorSplitData = {
          OpportunityId: this.opportunityId,
          AdvisorId: element.AdvisorId,
          Name: element.Name,
          FirmName: element.FirmName,
          WebLogo: element.WebLogo,
          SplitRatio: element.SplitRatio,
          OppSplitId: element.OppSplitId,
          Address1: element.Address1,
          Address2: element.Address2,
          State: element.State,
          Zip: element.Zip,
          Phone: element.Phone,
          Email: element.Email
        }
        splitData.push(saveAdvisorSplitData)
      })
      this.$axios
        .post(`/api/v1/tal/individual/${this.opportunityId}/advisorsplit`, splitData)
        .then((success) => {
          if (success.data.d != null) {
            this.splitAdvisorsDetails = success.data.d ? success.data.d : []
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 200px;
}
.classForCard {
  height: 310px;
  width: 280px;
}
</style>
