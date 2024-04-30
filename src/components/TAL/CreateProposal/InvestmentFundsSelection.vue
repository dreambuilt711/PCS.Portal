<template>
  <v-col>
    <v-row no-gutters>
      <v-col class="text-right" xs8>
        <h1>Select Investment Funds(s)?</h1>
      </v-col>
      <v-col class="text-left" xs2 pl-5>
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <span><i class="fas fa-info-circle fa-lg" v-bind="props" @click="show = !show" /></span>
          </template>
          <v-col xs12 class="widthForTooltip"> Some disclaimer about funds </v-col>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-col pt-6 lg4>
      <v-text-field
        v-model="fundsText"
        density="compact"
        variant="outlined"
        :clearable="fundsText ? (fundsText.trim() !== '' ? true : false) : false"
        placeholder="Lookup and add funds"
        hide-details
      >
        <template #append>
          <v-icon size="21" :color="$vuetify?.theme.dark ? '' : 'hyperlink'" class="icon-search cursor-pointer" />
        </template>
      </v-text-field>
    </v-col>
    <v-col pt-2>
      <AddInvestment
        ref="addInvestement"
        :reports="'Model_Benchmark'"
        :investment-list="investmentList"
        :additional-investment="true"
        :plan-id="planProposalID"
        :reset-form="fundDialog"
        :model-i-d="modelID"
        :hide-from-fund="true"
      />
    </v-col>
    <v-col>
      <v-radio-group v-model="radios">
        <v-row no-gutters>
          <v-col lg5>
            <v-radio color="accent" value="fundAllocation">
              <template #label>
                <div :color="$vuetify?.theme.dark ? '' : 'hyperlink'">Recommend my funds and fund allocation</div>
              </template>
            </v-radio>
          </v-col>
          <v-col class="text-left">
            <v-radio color="accent" value="ParticipantSelection">
              <template #label>
                <div :color="$vuetify?.theme.dark ? '' : 'hyperlink'">Let participant select their own</div>
              </template>
            </v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
    </v-col>
    <v-col class="text-center" pt-6 large>
      <v-btn class="text-capitalize" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="goToNextPage()"> Next </v-btn>
    </v-col>
  </v-col>
</template>
<script>
import AddInvestment from '@/components/TAL/AddInvestment'
export default {
  components: {
    AddInvestment
  },
  data() {
    return {
      fundsText: '',
      investmentList: [
        {
          Type: 'Mutual Fund',
          Ticker: 'VBR',
          Name: 'Vanguard Small-Cap Value ETF',
          Amount: 12.5,
          Percentage: 0.125,
          ID: 57795856,
          Taxable: false,
          expratio: 0.06999999999999999,
          mgmt: 0.06999999999999999,
          tload: 0,
          SubTA: 0,
          AMC: 0,
          SSF: 0,
          Total: 0.06999999999999999,
          index: 1
        },
        {
          Type: 'Mutual Fund',
          Ticker: 'VB',
          Name: 'Vanguard Small-Cap ETF',
          Amount: 7.5,
          Percentage: 0.075,
          ID: 57795316,
          Taxable: false,
          expratio: 0.05,
          mgmt: 0.05,
          tload: 0,
          SubTA: 0,
          AMC: 0,
          SSF: 0,
          Total: 0.05,
          index: 1
        },
        {
          Type: 'Mutual Fund',
          Ticker: 'SCZ',
          Name: 'iShares MSCI EAFE Small-Cap ETF',
          Amount: 4.5,
          Percentage: 0.045,
          ID: 57792149,
          Taxable: false,
          expratio: 0.4,
          mgmt: 0.4,
          tload: 0,
          SubTA: 0,
          AMC: 0,
          SSF: 0,
          Total: 0.4,
          index: 1
        }
      ],
      planProposalID: 0,
      fundDialog: true,
      modelID: -975,
      radios: 'fundAllocation'
    }
  },
  methods: {
    goToNextPage() {
      this.$emit('goToEditFeesPage')
    }
  }
}
</script>
<style scoped>
.widthForTooltip {
  width: 450px;
}
</style>
