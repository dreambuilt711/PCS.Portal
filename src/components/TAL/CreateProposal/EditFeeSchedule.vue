<template>
  <v-col>
    <v-col class="text-center pb-4">
      <h1>Edit Fee Schedule</h1>
    </v-col>
    <v-col class="pa-4">
      <v-data-table
        :headers="investmentModelHeaderList"
        :items="investmentModelDataList"
        item-key="ID"
        :class="display.xs.value ? 'elevation-0' : 'elevation-1 my-3'"
        :mobile="false"
        :mobile-breakpoint="0"
        hide-default-footer
        :hide-default-header="display.smAndDown.value"
      >
        <template #item="{ item, isExpanded, expand }">
          <tr v-if="!display.smAndDown.value">
            <td class="pt-2 pb-2">
              <v-row no-gutters>
                <v-col cols="1" xs="1" class="mr-2">
                  <v-radio-group
                    v-model="item.selected"
                    :mandatory="false"
                    hide-details
                    class="mr-0 mt-0 mb-0 ml-2 pa-0"
                    @update:model-value="selectedFee(item)"
                  >
                    <v-radio color="accent" :value="item.ID" :ripple="false" class="ma-0" />
                  </v-radio-group>
                </v-col>
                <v-col cols="10" xs="10" class="align-self">
                  {{ item.FeePreference }}
                </v-col>
              </v-row>
            </td>
            <td class="text-center pt-2 pb-2">
              <v-row v-show="item.selected === item.ID" class="justify-center">
                <v-col v-show="item.financialPreference" cols="8" xs="8">
                  <v-text-field
                    v-model.lazy="item.FinancialProfessional"
                    v-input-mask="{
                      alias: 'numeric',
                      digits: '2',
                      digitsOptional: true,
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false,
                      max: '100'
                    }"
                    suffix="%"
                    hide-details
                    density="compact"
                    variant="outlined"
                    placeholder="Fee"
                    @update:model-value="saveFee(item)"
                  />
                </v-col>
                <v-col v-show="!item.financialPreference" cols="8" xs="8">
                  {{ item.FinancialProfessional }}
                </v-col>
              </v-row>
            </td>
            <td class="text-center pt-2 pb-2">
              <v-row v-show="item.selected === item.ID" class="justify-center">
                <v-col v-show="item.investmentPreference" cols="8" xs="8">
                  <v-text-field
                    v-model.lazy="item.InvestmentStrategist"
                    v-input-mask="{
                      alias: 'numeric',
                      digits: '2',
                      digitsOptional: true,
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false,
                      max: '100'
                    }"
                    suffix="%"
                    hide-details
                    density="compact"
                    variant="outlined"
                    placeholder="Fee"
                    @update:model-value="saveFee(item)"
                  />
                </v-col>
                <v-col v-show="!item.investmentPreference" cols="8" xs="8">
                  {{ item.InvestmentStrategist }}
                </v-col>
              </v-row>
            </td>
          </tr>
          <tr
            v-if="display.smAndDown.value"
            :class="[item.selectedRow == true ? 'selected_row_color' : '', isExpanded ? 'border_bottom_none' : '']"
          >
            <td>
              <v-col cols="12" xs="12">
                <v-row>
                  <v-col cols="1" xs="1" sm="1" class="mr-2 mt-3">
                    <v-radio-group
                      v-model="item.selected"
                      :mandatory="false"
                      hide-details
                      class="mr-0 mt-0 mb-0 ml-2 pa-0"
                      @update:model-value="selectedFee(item)"
                    >
                      <v-radio color="accent" :value="item.ID" :ripple="false" class="ma-0" />
                    </v-radio-group>
                  </v-col>
                  <v-col cols="9" xs="9" sm="9" class="pl-2">
                    <h5 class="pt-1">
                      <span class="text-grey">Fee Preference</span>
                    </h5>
                    <h4 class="text-uppercase">
                      {{ item.FeePreference }}
                    </h4>
                  </v-col>
                  <v-col v-show="item.selected === item.ID" cols="1" xs="1" sm="1" class="text-right cursor-pointer">
                    <v-btn icon variant="text" @click="expand(!isExpanded)">
                      <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </td>
          </tr>
        </template>
        <template v-if="display.smAndDown.value" #expanded-item="{ headers, item }">
          <td v-show="item.selected === item.ID" :colspan="headers.length">
            <v-card flat :class="theme.dark ? '' : 'expandable_background'">
              <v-card-text>
                <v-row>
                  <v-col cols="6" xs="6">
                    <v-col v-show="item.selected === item.ID" cols="12" xs="12">
                      <h5 class="pl-0 pb-0 text-grey">Financial Professional (annual fee)</h5>
                    </v-col>
                    <v-col cols="12" xs="12">
                      <v-row v-show="item.selected === item.ID" class="justify-center">
                        <v-col v-show="item.financialPreference" cols="8" xs="8">
                          <v-text-field
                            v-model.lazy="item.FinancialProfessional"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '2',
                              digitsOptional: true,
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false,
                              max: '100'
                            }"
                            suffix="%"
                            hide-details
                            density="compact"
                            variant="outlined"
                            placeholder="Fee"
                            @update:model-value="saveFee(item)"
                          />
                        </v-col>
                        <v-col v-show="!item.financialPreference" cols="8" xs="8">
                          {{ item.FinancialProfessional }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                  <v-col cols="6" xs="6">
                    <v-col v-show="item.selected === item.ID" cols="12" xs="12">
                      <h5 class="pl-0 pb-0 text-grey">Investment Strategist (annual fee)</h5>
                    </v-col>
                    <v-col cols="12" xs="12">
                      <v-row v-show="item.selected === item.ID" class="justify-center">
                        <v-col v-show="item.investmentPreference" cols="8" xs="8">
                          <v-text-field
                            v-model.lazy="item.InvestmentStrategist"
                            v-input-mask="{
                              alias: 'numeric',
                              digits: '2',
                              digitsOptional: true,
                              rightAlign: false,
                              placeholder: '',
                              allowMinus: false,
                              max: '100'
                            }"
                            suffix="%"
                            hide-details
                            density="compact"
                            variant="outlined"
                            placeholder="Fee"
                            @update:model-value="saveFee(item)"
                          />
                        </v-col>
                        <v-col v-show="!item.investmentPreference" cols="8" xs="8">
                          {{ item.InvestmentStrategist }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="12" xs="12" class="text-center pt-7">
      <v-btn :disabled="disableNextButton" :color="theme.dark ? '' : 'accent'" class="mx-0" @click="goToNextPage()">Next</v-btn>
    </v-col>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
export default {
  setup({ emit }) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const investmentModelHeaderList = ref([
      {
        title: 'Fee Preference',
        value: 'FeePreference',
        width: display.xs.value ? '30%' : '20%',
        sortable: false
      },
      {
        title: 'Financial Professional (annual fee)',
        value: 'FinancialProfessional',
        align: 'center',
        width: '8%',
        sortable: false
      },
      {
        title: 'Investment Strategist (annual fee)',
        value: 'InvestmentStrategist',
        width: '8%',
        align: 'center',
        sortable: false
      }
    ])
    const investmentModelDataList = ref([
      {
        ID: 1,
        FeePreference: 'Financial Professional Fee Only',
        FinancialProfessional: '',
        InvestmentStrategist: 'N/A',
        selected: 1,
        financialPreference: true,
        investmentPreference: false
      },
      {
        ID: 2,
        FeePreference: 'Financial Professional Fee and Investment Strategist Fee',
        FinancialProfessional: '',
        InvestmentStrategist: '',
        selected: '',
        financialPreference: true,
        investmentPreference: true
      },
      {
        ID: 3,
        FeePreference: 'Combined Financial Professional Fee and Investment Strategist Fee (paid to Financial Professional)',
        FinancialProfessional: '',
        InvestmentStrategist: 'N/A',
        selected: '',
        financialPreference: true,
        investmentPreference: false
      },
      {
        ID: 4,
        FeePreference: 'Combined Financial Professional Fee and Investment Strategist Fee (paid to Investment Strategist)',
        FinancialProfessional: 'N/A',
        InvestmentStrategist: '',
        selected: '',
        financialPreference: false,
        investmentPreference: true
      }
    ])
    const disableNextButton = ref(true)
    const opportunityId = ref('')
    function selectedFee(item) {
      disableNextButton.value = true
      investmentModelDataList.value.forEach((element) => {
        element.selected = ''
      })
      investmentModelDataList.value.forEach((element, index) => {
        if (element.ID === item.ID) {
          element.selected = item.ID
          if (item.financialPreference && item.investmentPreference) {
            if (parseFloat(item.FinancialProfessional) > 0 && parseFloat(item.InvestmentStrategist) > 0)
              disableNextButton.value = false
          } else if (item.financialPreference) {
            if (parseFloat(item.FinancialProfessional) > 0) disableNextButton.value = false
          } else if (item.investmentPreference) {
            if (parseFloat(item.InvestmentStrategist) > 0) disableNextButton.value = false
          }
        } else {
          investmentModelDataList.value.splice(index, 1, element)
        }
      })
    }
    function goToNextPage() {
      emit('showAccountSetUpFlag')
      saveAdvisorFeesSchedule()
    }
    function saveAdvisorFeesSchedule() {
      let selectedData = investmentModelDataList.value.filter((a) => a.ID === a.selected)
      var saveAdvisorFeesData = {
        Type: selectedData[0].FeePreference,
        AdvisorFeePercentage: selectedData[0].FinancialProfessional
          ? selectedData[0].FinancialProfessional !== 'N/A'
            ? parseFloat(selectedData[0].FinancialProfessional)
            : 0
          : 0,
        StrategistFeePercentage: selectedData[0].InvestmentStrategist
          ? selectedData[0].InvestmentStrategist !== 'N/A'
            ? parseFloat(selectedData[0].InvestmentStrategist)
            : 0
          : 0,
        OpportunityId: opportunityId.value
      }
      $axios.post(`/api/v1/sfdc/opportunity/advisorfees`, saveAdvisorFeesData)
    }
    function saveFee(item) {
      investmentModelDataList.value.forEach((element) => {
        if (element.selected) {
          if (item.financialPreference && item.investmentPreference) {
            if (parseFloat(item.FinancialProfessional) > 0 && parseFloat(item.InvestmentStrategist) > 0) {
              disableNextButton.value = false
            } else disableNextButton.value = true
          } else if (item.financialPreference) {
            if (parseFloat(item.FinancialProfessional) > 0) {
              disableNextButton.value = false
            } else disableNextButton.value = true
          } else if (item.investmentPreference) {
            if (parseFloat(item.InvestmentStrategist) > 0) {
              disableNextButton.value = false
            } else disableNextButton.value = true
          }
        }
      })
    }
    onMounted(() => {
      if (Object.keys($store.state.openAccountDetail).length > 0) {
        opportunityId.value = $store.state.openAccountDetail.OpportunityId
        if ($store.state.openAccountDetail.Type) {
          investmentModelDataList.value.forEach((element) => {
            element.selected = ''
          })
          investmentModelDataList.value.forEach((element) => {
            if (element.FeePreference === $store.state.openAccountDetail.Type) {
              disableNextButton.value = false
              element.selected = element.ID
              if (element.FinancialProfessional !== 'N/A')
                element.FinancialProfessional = parseFloat($store.state.openAccountDetail.AdvisorFeePercentage)
              if (element.InvestmentStrategist !== 'N/A')
                element.InvestmentStrategist = parseFloat($store.state.openAccountDetail.StrategistFeePercentage)
            }
          })
        }
      }
    })
    return {
      theme,
      display,
      investmentModelHeaderList,
      investmentModelDataList,
      disableNextButton,
      selectedFee,
      saveFee,
      goToNextPage
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
.container {
  display: flex;
  overflow-x: auto;
}
.smallContainer {
  display: -webkit-box !important;
  overflow-x: auto;
}
.card_heightNew {
  height: 300px !important;
  width: 260px !important;
  border-radius: 6px !important;
}
.errorMessage {
  color: red !important;
}
</style>
