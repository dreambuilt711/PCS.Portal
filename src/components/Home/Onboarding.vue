<template>
  <v-col xs12>
    <v-row class="justify-center">
      <v-col cols="12" lg="8" xl="8">
        <v-card
          class="pa-5 elevation-3"
          :height="
            fontSize > 12
              ? $vuetify?.breakpoint?.xs
                ? ''
                : '38.462em'
              : fontSize > 10
                ? $vuetify?.breakpoint?.xs
                  ? ''
                  : '44em'
                : fontSize > 8
                  ? $vuetify?.breakpoint?.xs
                    ? ''
                    : '53em'
                  : fontSize === 8 && $vuetify?.breakpoint?.xs
                    ? ''
                    : '58.500em'
          "
        >
          <v-col xs12>
            <v-row>
              <v-col xs12 sm4 md3 lg4 xl3>
                <v-row no-gutters>
                  <v-col xs12>
                    <h6 class="text-h6 font_20" :class="$vuetify?.theme.dark ? '' : 'text-black'">Onboarding Activity</h6>
                  </v-col>
                  <v-col v-if="showEmployerSponsored && showIndividuals" xs12 mt-4 mb-3>
                    <v-btn-toggle
                      v-model="toggleWidget"
                      mandatory
                      :rounded="true"
                      density="compact"
                      class="toggleCSS elevation-0"
                    >
                      <v-btn variant="text" class="pl-2 pr-2" value="Company" :ripple="false">
                        Company
                        <span
                          class="ml-1 pl-1 pr-1"
                          :class="toggleWidget === 'Company' ? 'activeBtn_result text-accent' : 'inActiveBtn_result text-accent'"
                          >{{ totalCompanyPlans }}</span
                        >
                      </v-btn>
                      <v-btn variant="text" class="pl-2 pr-2" value="Individual" :ripple="false">
                        Individual
                        <span
                          class="ml-1 pl-1 pr-1"
                          :class="
                            toggleWidget === 'Individual' ? 'activeBtn_result text-accent' : 'inActiveBtn_result text-accent'
                          "
                          >{{ totalIndividualPlans }}</span
                        >
                      </v-btn>
                    </v-btn-toggle>
                  </v-col>
                  <v-col xs12 pa-3>
                    <h2 v-if="toggleWidget === 'Company'" class="font-weight-medium">{{ totalCompanyPlans }} Plans</h2>
                    <h2 v-if="toggleWidget === 'Individual'" class="font-weight-medium">{{ totalIndividualPlans }} Accounts</h2>
                  </v-col>
                  <v-col v-if="toggleWidget === 'Company'">
                    <v-col
                      v-for="(item, index) in companyStatusList"
                      :key="index"
                      pb-3
                      xs12
                      class="cursor-pointer"
                      @click="addRemoveStatus(item.text, 'company')"
                    >
                      <div
                        id="switchButton"
                        v-ripple
                        :style="`width: ${$vuetify?.breakpoint?.xs ? '100%' : '146px'}`"
                        :class="item.display ? `accent lighten-${4 - index}` : `blue-grey lighten-${4 - index}`"
                      >
                        <div
                          id="statusDot"
                          :class="item.display ? `accent lighten-${4 - index}` : `blue-grey lighten-${4 - index}`"
                        >
                          <span class="text-white">{{ item.value ? item.value : 0 }}</span>
                        </div>
                        <span
                          :style="`width: ${$vuetify?.breakpoint?.xs ? '70%' : ''}`"
                          :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'pl-3'"
                          >{{ item.text }}</span
                        >
                      </div>
                    </v-col>
                  </v-col>
                  <v-col v-if="toggleWidget === 'Individual'">
                    <v-col
                      v-for="(item, index) in individualStateList"
                      :key="index"
                      pb-3
                      xs12
                      class="cursor-pointer"
                      @click="addRemoveStatus(item.text, 'individual')"
                    >
                      <div
                        id="switchButton"
                        v-ripple
                        :style="`width: ${$vuetify?.breakpoint?.xs ? '100%' : '200px'}`"
                        :class="item.display ? `accent lighten-${4 - index}` : `blue-grey lighten-${4 - index}`"
                      >
                        <div
                          id="statusDot"
                          :class="item.display ? `accent lighten-${4 - index}` : `blue-grey lighten-${4 - index}`"
                        >
                          <span class="text-white">{{ item.value ? item.value : 0 }}</span>
                        </div>
                        <span
                          :style="`width: ${$vuetify?.breakpoint?.xs ? '70%' : ''}`"
                          :class="$vuetify?.breakpoint?.xs ? 'text-center' : 'pl-3'"
                          >{{ item.text }}</span
                        >
                      </div>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs12 sm8 md9 lg8 xl9>
                <v-row no-gutters>
                  <v-col xs12 class="align-self pt-1">
                    <h4
                      v-if="toggleWidget === 'Company'"
                      class="font-weight-medium text-uppercase"
                      :class="$vuetify?.theme.dark ? '' : 'text-accent'"
                    >
                      Onboarding Company Details
                    </h4>
                    <h4
                      v-if="toggleWidget === 'Individual'"
                      class="font-weight-medium text-uppercase"
                      :class="$vuetify?.theme.dark ? '' : 'text-accent'"
                    >
                      Individual Account Details
                    </h4>
                  </v-col>
                  <v-col v-if="toggleWidget === 'Company'" xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'mt-6'">
                    <v-data-table
                      class="elevation-0 changeTableColor hideBorder increaseEmptyHeight"
                      :headers="companyHeaders"
                      :items="companyDetails"
                      item-key="PlanId"
                      :hide-default-header="$vuetify?.breakpoint?.smAndDown"
                      hide-default-footer
                      :fixed-header="true"
                      :height="fontSize > 10 ? '31.769em' : '42.769em'"
                      :disable-pagination="true"
                      :loading="showCompanyLoader"
                      loader-height="2"
                      style="backface-visibility: hidden"
                    >
                      <template #no-data>
                        <v-col xs12 class="text-center">
                          <h2 class="font-weight-medium pb-2" :class="$vuetify?.theme.dark ? '' : 'text-black'">
                            There is no current onboarding activity
                          </h2>
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            >To begin onboarding prospect - Start a plan</span
                          ><br />
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            >diagnostic by using <a @click="redirect('finder')">Lead Search</a> to find</span
                          ><br />
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            >potential plan prospects, or create your own</span
                          ><br />
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            ><a @click="redirect('prospect')">Plan Prospect</a> if you already have one.</span
                          >
                        </v-col>
                      </template>
                      <template #item="{ item, isExpanded, expand }">
                        <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                          <td class="text-capitalize pa-2">
                            {{ item.PlanName ? item.PlanName.toLowerCase() : '' }}
                          </td>
                          <td class="pa-2">
                            {{ item.PlanType }}
                          </td>
                          <td class="text-right pa-2">
                            {{ formatPrice(item.Assets, 0) }}
                          </td>
                          <td class="pa-2">
                            {{ item.Status }}
                          </td>
                          <td class="pa-2">
                            {{
                              item.ActivityDate
                                ? item.ActivityDate === '01/01/00'
                                  ? ''
                                  : new Date(item.ActivityDate).toLocaleDateString()
                                : ''
                            }}
                          </td>
                        </tr>
                        <tr v-else :class="[isExpanded ? 'border_bottom_none' : '']">
                          <td class="pr-3 pl-3">
                            <v-col class="xs12">
                              <v-row>
                                <v-col xs10>
                                  <h4 class="pt-1">
                                    <span>Plan Name</span>
                                    <br />
                                    <h4 class="text-capitalize">
                                      {{ item.PlanName ? item.PlanName.toLowerCase() : '' }}
                                    </h4>
                                  </h4>
                                </v-col>
                                <v-col xs2 class="text-right cursor-pointer">
                                  <v-btn icon variant="text" @click="expand(!isExpanded)">
                                    <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                          </td>
                        </tr>
                      </template>
                      <template v-if="$vuetify?.breakpoint?.smAndDown" #expanded-item="{ headers, item }">
                        <td :colspan="headers.length">
                          <v-card flat :class="$vuetify?.theme.dark ? '' : 'expandable_background'">
                            <v-card-text>
                              <v-row>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">Plan Type</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>{{ item.PlanType }}</h4>
                                  </v-col>
                                </v-col>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">Asset</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>{{ formatPrice(item.Assets, 0) }}</h4>
                                  </v-col>
                                </v-col>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">Status</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>{{ item.Status }}</h4>
                                  </v-col>
                                </v-col>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">Activity Date</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>
                                      {{
                                        item.ActivityDate
                                          ? item.ActivityDate === '01/01/00'
                                            ? ''
                                            : new Date(item.ActivityDate).toLocaleDateString()
                                          : ''
                                      }}
                                    </h4>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </td>
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col v-if="toggleWidget === 'Individual'" xs12 :class="$vuetify?.breakpoint?.xs ? '' : 'mt-6'">
                    <v-data-table
                      class="elevation-0 changeTableColor hideBorder increaseEmptyHeight"
                      :headers="individualHeaders"
                      :items="individualDetails"
                      item-key="OpportunityId"
                      :hide-default-header="$vuetify?.breakpoint?.smAndDown"
                      hide-default-footer
                      :fixed-header="true"
                      :disable-pagination="true"
                      :height="fontSize > 10 ? '31.769em' : '42.769em'"
                      :loading="showIndividualLoader"
                      loader-height="2"
                      style="backface-visibility: hidden"
                    >
                      <template #no-data>
                        <v-col xs12 class="text-center">
                          <h2 class="font-weight-medium pb-2" :class="$vuetify?.theme.dark ? '' : 'text-black'">
                            There is no current onboarding activity
                          </h2>
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            >To begin onboarding prospect - Start a plan</span
                          ><br />
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            >diagnostic by using <a @click="redirect('finder')">Lead Search</a> to find</span
                          ><br />
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            >potential plan prospects, or create your own</span
                          ><br />
                          <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                            ><a @click="redirect('prospect')">Plan Prospect</a> if you already have one.</span
                          >
                        </v-col>
                      </template>
                      <template #item="{ item, isExpanded, expand }">
                        <tr v-if="!$vuetify?.breakpoint?.smAndDown">
                          <td class="text-capitalize pa-2">
                            {{ item.AccountName ? item.AccountName.toLowerCase() : '' }}
                          </td>
                          <td class="pa-2">
                            {{ item.SchoolDistrict }}
                          </td>
                          <td class="text-right pa-2">
                            {{ formatPrice(item.Assets, 0) }}
                          </td>
                          <td class="pa-2">
                            {{ item.StageName }}
                          </td>
                          <td class="pa-2">
                            {{
                              item.ActivityDate
                                ? item.ActivityDate === '01/01/00'
                                  ? ''
                                  : new Date(item.ActivityDate).toLocaleDateString()
                                : ''
                            }}
                          </td>
                        </tr>
                        <tr v-else :class="[isExpanded ? 'border_bottom_none' : '']">
                          <td class="pr-3 pl-3">
                            <v-col class="xs12">
                              <v-row>
                                <v-col xs10>
                                  <h4 class="pt-1">
                                    <span>Account Name</span>
                                    <br />
                                    <h4 class="text-capitalize">
                                      {{ item.AccountName ? item.AccountName.toLowerCase() : '' }}
                                    </h4>
                                  </h4>
                                </v-col>
                                <v-col xs2 class="text-right cursor-pointer">
                                  <v-btn icon variant="text" @click="expand(!isExpanded)">
                                    <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                          </td>
                        </tr>
                      </template>
                      <template v-if="$vuetify?.breakpoint?.smAndDown" #expanded-item="{ headers, item }">
                        <td :colspan="headers.length">
                          <v-card flat :class="$vuetify?.theme.dark ? '' : 'expandable_background'">
                            <v-card-text>
                              <v-row>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">School District</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>{{ item.SchoolDistrict }}</h4>
                                  </v-col>
                                </v-col>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">Asset</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>{{ formatPrice(item.Assets, 0) }}</h4>
                                  </v-col>
                                </v-col>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">State</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>{{ item.StageName }}</h4>
                                  </v-col>
                                </v-col>
                                <v-col xs6 class="pb-1">
                                  <v-col xs12>
                                    <h4 class="pl-0 pb-0">Activity Date</h4>
                                  </v-col>
                                  <v-col xs12>
                                    <h4>
                                      {{
                                        item.ActivityDate
                                          ? item.ActivityDate === '01/01/00'
                                            ? ''
                                            : new Date(item.ActivityDate).toLocaleDateString()
                                          : ''
                                      }}
                                    </h4>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </td>
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col v-if="!showButton" xs12 :class="!$vuetify?.breakpoint?.xs ? 'widgetButtonPosition' : 'mt-1'">
                    <v-row class="justify-end">
                      <v-btn :color="$vuetify?.theme.dark ? '' : 'accent'" @click="redirect('finder')"> Lead Search </v-btn>
                      <v-btn class="mr-0" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="redirect('prospect')">
                        Create Prospect
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" xl="4" sm="8">
        <v-card
          class="pa-5 elevation-3"
          :height="
            fontSize > 12
              ? $vuetify?.breakpoint?.xs
                ? ''
                : '38.462em'
              : fontSize > 10
                ? $vuetify?.breakpoint?.xs
                  ? ''
                  : '44em'
                : fontSize > 8
                  ? $vuetify?.breakpoint?.xs
                    ? ''
                    : '53em'
                  : fontSize === 8 && $vuetify?.breakpoint?.xs
                    ? ''
                    : '58.500em'
          "
        >
          <v-col xs12>
            <v-row>
              <v-col xs12 sm8 :class="$vuetify?.breakpoint?.xs ? 'mb-2' : ''">
                <h6 class="text-h6 font_20" :class="$vuetify?.theme.dark ? '' : 'text-black'">Recently Onboarded Clients</h6>
              </v-col>
              <v-col v-if="toggleWidget === 'Company'" xs12 sm4 class="text-right">
                <v-select
                  v-model="companyClient"
                  variant="outlined"
                  :items="dropDownList"
                  hide-details
                  density="compact"
                  append-icon="icon-chevron-down"
                  class="reducefont"
                  @update:model-value="getCompanyClientHistory()"
                />
              </v-col>
              <v-col v-if="toggleWidget === 'Individual'" xs12 sm4 class="text-right">
                <v-select
                  v-model="individualClient"
                  variant="outlined"
                  :items="dropDownList"
                  hide-details
                  density="compact"
                  append-icon="icon-chevron-down"
                  class="reducefont"
                  @update:model-value="getIndividualClientHistory()"
                />
              </v-col>
            </v-row>
            <v-row :class="$vuetify?.breakpoint?.xs ? 'mt-2' : ''">
              <v-col v-if="toggleWidget === 'Company'" xs12>
                <v-data-table
                  class="elevation-0 changeTableColor hideBorder increaseEmptyHeight"
                  :headers="clientHistoryHeader"
                  :items="companyClientHistory"
                  item-key="PlanId"
                  hide-default-footer
                  :fixed-header="true"
                  :height="fontSize > 10 ? '31.769em' : '42.769em'"
                  :loading="showCompanyClientLoader"
                  loader-height="2"
                  :disable-pagination="true"
                  :mobile-breakpoint="0"
                  style="backface-visibility: hidden"
                >
                  <template #no-data>
                    <v-col xs12 class="text-center">
                      <h2 class="font-weight-medium pb-2" :class="$vuetify?.theme.dark ? '' : 'text-black'">
                        No Live Plans/Accounts
                      </h2>
                      <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                        >Begin onboarding prospects to transition to live plan</span
                      >
                    </v-col>
                  </template>
                  <template #item="{ item }">
                    <tr>
                      <td class="text-capitalize pa-2">
                        {{ item.PlanName ? item.PlanName.toLowerCase() : '' }}
                      </td>
                      <td class="pa-2">
                        {{
                          item.ActivityDate
                            ? item.ActivityDate === '01/01/00'
                              ? ''
                              : new Date(item.ActivityDate).toLocaleDateString()
                            : ''
                        }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
              <v-col v-if="toggleWidget === 'Individual'" xs12>
                <v-data-table
                  class="elevation-0 changeTableColor hideBorder increaseEmptyHeight"
                  :headers="clientHistoryHeader"
                  :items="individualClientHistory"
                  item-key="OpportunityId"
                  :mobile-breakpoint="0"
                  hide-default-footer
                  :fixed-header="true"
                  :height="fontSize > 10 ? '31.769em' : '42.769em'"
                  :loading="showIndividualClientLoader"
                  loader-height="2"
                  :disable-pagination="true"
                  style="backface-visibility: hidden"
                >
                  <template #no-data>
                    <v-col xs12 class="text-center">
                      <h2 class="font-weight-medium pb-2" :class="$vuetify?.theme.dark ? '' : 'text-black'">
                        No Live Plans/Accounts
                      </h2>
                      <span :class="$vuetify?.theme.dark ? '' : 'text-black'"
                        >Begin onboarding prospects to transition to live plan</span
                      >
                    </v-col>
                  </template>
                  <template #item="{ item }">
                    <tr>
                      <td class="text-capitalize pa-2">
                        {{ item.AccountName ? item.AccountName.toLowerCase() : '' }}
                      </td>
                      <td class="pa-2">
                        {{
                          item.ActivityDate
                            ? item.ActivityDate === '01/01/00'
                              ? ''
                              : new Date(item.ActivityDate).toLocaleDateString()
                            : ''
                        }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { eventBus } from '@/main'
import qs from 'qs'
export default {
  data() {
    return {
      showCompanyLoader: true,
      showCompanyClientLoader: true,
      showIndividualLoader: true,
      showIndividualClientLoader: true,
      toggleWidget: 'Company',
      totalCompanyPlans: 0,
      totalIndividualPlans: 0,
      companyHeaders: [
        {
          text: 'Plan Name',
          value: 'PlanName',
          align: 'start',
          width: '30%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'Plan Type',
          value: 'PlanType',
          align: 'start',
          width: '25%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'Asset',
          value: 'Assets',
          align: 'end',
          width: '15%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'Status',
          value: 'Status',
          align: 'start',
          width: '15%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'Activity Date',
          value: 'ActivityDate',
          align: 'start',
          width: '15%',
          class: 'pl-2 pr-2'
        }
      ],
      individualHeaders: [
        {
          text: 'Account Name',
          value: 'AccountName',
          align: 'start',
          width: '27%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'School District',
          value: 'SchoolDistrict',
          align: 'start',
          width: '23%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'Asset',
          value: 'Assets',
          align: 'end',
          width: '15%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'State',
          value: 'StageName',
          align: 'start',
          width: '15%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'Activity Date',
          value: 'ActivityDate',
          align: 'start',
          width: '20%',
          class: 'pl-2 pr-2'
        }
      ],
      companyDetails: [],
      individualDetails: [],
      dropDownList: [
        { text: 'Year to Date', value: 0 },
        { text: '3 Months', value: 1 },
        { text: '6 Months', value: 2 },
        { text: '12 Months', value: 3 }
      ],
      companyClient: 3,
      individualClient: 3,
      clientHistoryHeader: [
        {
          text: 'Plan Name',
          value: 'PlanName',
          align: 'start',
          width: '70%',
          class: 'pl-2 pr-2'
        },
        {
          text: 'Go Live Date',
          value: 'ActivityDate',
          align: 'start',
          width: '30%',
          class: 'pl-2 pr-2'
        }
      ],
      companyClientHistory: [],
      individualClientHistory: [],
      companyStatusList: [
        {
          text: 'Blueprint',
          value: 0,
          display: true
        },
        {
          text: 'Educate',
          value: 0,
          display: true
        },
        {
          text: 'Train',
          value: 0,
          display: true
        },
        {
          text: 'Invest',
          value: 0,
          display: true
        }
      ],
      individualStateList: [
        {
          text: 'SRA Completed',
          value: 0,
          display: true
        },
        {
          text: 'Assets Transferred',
          value: 0,
          display: true
        },
        {
          text: 'Account Funded',
          value: 0,
          display: true
        }
      ],
      globalFilter: false,
      companyPlanDetail: [],
      individualPlanDetail: []
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    },
    showButton() {
      if (this.toggleWidget === 'Company') return this.companyDetails.length > 0
      else return this.individualDetails.length > 0
    },
    showEmployerSponsored() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    },
    showIndividuals() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          )
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        if (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) ||
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          )
        ) {
          return (
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Individuals
            ) ||
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Municipalities
            ) ||
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
              this.$authz.typeOfBusiness.Schools
            )
          )
        } else return false
      } else return true
    }
  },
  watch: {
    showEmployerSponsored: {
      handler(val) {
        if (!val) {
          this.toggleWidget = 'Individual'
        } else {
          this.toggleWidget = 'Company'
        }
      }
    }
  },
  beforeUnmount() {
    eventBus.off('filterGlobalData')
    eventBus.off('callOnboarding')
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    eventBus.on('filterGlobalData', (data) => {
      if (this.showEmployerSponsored) this.getCompany('reload')
      if (this.showIndividuals) this.getIndividual('reload')
      this.globalFilter = data
    })
    // eslint-disable-next-line no-unused-vars
    eventBus.on('callOnboarding', (data) => {
      if (this.showEmployerSponsored) this.loadCompany()
      if (this.showIndividuals) this.loadIndividual()
    })
    if (this.showEmployerSponsored) this.loadCompany()
    if (this.showIndividuals) this.loadIndividual()
  },
  methods: {
    redirect(page) {
      if (page) {
        if (page === 'finder') {
          this.$store.state.finderList = {}
          if (this.toggleWidget === 'Company') {
            this.$route.query.showBack = true
            this.$router.push('/TAL/Finder/Result').catch(() => {})
          } else {
            this.$route.query.showBack = true
            this.$router
              .push({
                name: 'TALFinderResult',
                query: {
                  tabType: 'individuals'
                }
              })
              .catch(() => {})
          }
        } else {
          this.$router.push('/TAL/StartupPlan').catch(() => {})
        }
      }
    },
    getCompany(val) {
      this.showCompanyLoader = val === 'reload' ? true : false
      this.showCompanyClientLoader = val === 'reload' ? true : false
      var accountId = []
      var contactId = []
      if (Object.keys(this.$store.state.globalFilter).length > 0) {
        if (this.$store.state.globalFilter.firm && this.$store.state.globalFilter.firm.length > 0) {
          accountId = this.$store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if (this.$store.state.globalFilter.advisor && this.$store.state.globalFilter.advisor.length > 0) {
          contactId = this.$store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      this.$axios
        .get(`/api/v1/tal/advisor/wins/plans/3`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          var companyPlans = success.data.d && success.data.d.length > 0 ? success.data.d : []
          if (companyPlans && companyPlans.length > 0) {
            this.companyDetails = companyPlans.filter((a) => a.Status !== 'Live')
            this.companyClientHistory = companyPlans.filter((a) => a.Status === 'Live')
            this.totalCompanyPlans = this.companyDetails.length
            for (var i = 0; i < this.companyStatusList.length; i++) {
              this.companyStatusList[i].value = this.companyDetails.filter(
                (a) => a.Status === this.companyStatusList[i].text
              ).length
              this.companyStatusList[i].display =
                this.companyDetails.filter((a) => a.Status === this.companyStatusList[i].text).length > 0
            }
          } else {
            this.companyDetails = []
            this.companyClientHistory = []
            this.totalCompanyPlans = 0
            this.companyStatusList.forEach((element) => {
              element.value = 0
              element.display = false
            })
          }
          this.showCompanyLoader = false
          this.showCompanyClientLoader = false
          this.companyPlanDetail = this.companyDetails
        })
        .catch(() => {
          this.showCompanyLoader = false
          this.showCompanyClientLoader = false
          this.companyDetails = []
          this.companyClientHistory = []
          this.totalCompanyPlans = 0
          this.companyStatusList.forEach((element) => {
            element.value = 0
            element.display = false
          })
        })
    },
    getIndividual(val) {
      this.showIndividualLoader = val === 'reload' ? true : false
      this.showIndividualClientLoader = val === 'reload' ? true : false
      var accountId = []
      var contactId = []
      if (Object.keys(this.$store.state.globalFilter).length > 0) {
        if (this.$store.state.globalFilter.firm && this.$store.state.globalFilter.firm.length > 0) {
          accountId = this.$store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if (this.$store.state.globalFilter.advisor && this.$store.state.globalFilter.advisor.length > 0) {
          contactId = this.$store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      this.$axios
        .get(`/api/v1/tal/advisor/wins/individuals/3`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          var individualAccount = success.data.d && success.data.d.length > 0 ? success.data.d : []
          if (individualAccount && individualAccount.length > 0) {
            this.individualDetails = individualAccount.filter((a) => a.StageName !== 'Account Live')
            this.individualClientHistory = individualAccount.filter((a) => a.StageName === 'Account Live')
            this.totalIndividualPlans = this.individualDetails.length
            for (var b = 0; b < this.individualStateList.length; b++) {
              this.individualStateList[b].value = this.individualDetails.filter(
                (a) => a.StageName === this.individualStateList[b].text
              ).length
              this.individualStateList[b].display =
                this.individualDetails.filter((a) => a.StageName === this.individualStateList[b].text).length > 0
            }
          } else {
            this.individualDetails = []
            this.individualClientHistory = []
            this.totalIndividualPlans = 0
            this.individualStateList.forEach((element) => {
              element.value = 0
              element.display = false
            })
          }
          this.showIndividualLoader = false
          this.showIndividualClientLoader = false
          this.individualPlanDetail = this.individualDetails
        })
        .catch(() => {
          this.showIndividualLoader = false
          this.showIndividualClientLoader = false
          this.individualDetails = []
          this.individualClientHistory = []
          this.totalIndividualPlans = 0
          this.individualStateList.forEach((element) => {
            element.value = 0
            element.display = false
          })
        })
    },
    loadCompany() {
      this.showCompanyLoader = true
      this.$store
        .dispatch('getCompanyOnboarding')
        .then(() => {
          var companyPlans = this.$store.state.companyOnboarding
          if (companyPlans && companyPlans.length > 0) {
            this.companyDetails = companyPlans.filter((a) => a.Status !== 'Live')
            this.companyClientHistory = companyPlans.filter((a) => a.Status === 'Live')
            this.totalCompanyPlans = this.companyDetails.length
            for (var m = 0; m < this.companyStatusList.length; m++) {
              this.companyStatusList[m].value = this.companyDetails.filter(
                (a) => a.Status === this.companyStatusList[m].text
              ).length
              this.companyStatusList[m].display =
                this.companyDetails.filter((a) => a.Status === this.companyStatusList[m].text).length > 0
            }
          } else {
            this.companyDetails = []
            this.companyClientHistory = []
            this.totalCompanyPlans = 0
            this.companyStatusList.forEach((element) => {
              element.value = 0
              element.display = false
            })
          }
          this.showCompanyLoader = false
          this.showCompanyClientLoader = false
          this.companyPlanDetail = this.companyDetails
        })
        .catch(() => {
          this.showCompanyLoader = false
          this.showCompanyClientLoader = false
          this.companyDetails = []
          this.companyClientHistory = []
          this.totalCompanyPlans = 0
          this.companyStatusList.forEach((element) => {
            element.value = 0
            element.display = false
          })
        })
    },
    loadIndividual() {
      this.showIndividualLoader = true
      this.$store
        .dispatch('getIndividualOnboarding')
        .then(() => {
          var individualAccount = this.$store.state.individualOnboarding
          if (individualAccount && individualAccount.length > 0) {
            this.individualDetails = individualAccount.filter((a) => a.StageName !== 'Account Live')
            this.individualClientHistory = individualAccount.filter((a) => a.StageName === 'Account Live')
            this.totalIndividualPlans = this.individualDetails.length
            for (var k = 0; k < this.individualStateList.length; k++) {
              this.individualStateList[k].value = this.individualDetails.filter(
                (a) => a.StageName === this.individualStateList[k].text
              ).length
              this.individualStateList[k].display =
                this.individualDetails.filter((a) => a.StageName === this.individualStateList[k].text).length > 0
            }
          } else {
            this.individualDetails = []
            this.individualClientHistory = []
            this.totalIndividualPlans = 0
            this.individualStateList.forEach((element) => {
              element.value = 0
              element.display = false
            })
          }

          this.showIndividualLoader = false
          this.showIndividualClientLoader = false
          this.individualPlanDetail = this.individualDetails
        })
        .catch(() => {
          this.showIndividualLoader = false
          this.showIndividualClientLoader = false
          this.individualDetails = []
          this.individualClientHistory = []
          this.totalIndividualPlans = 0
          this.individualStateList.forEach((element) => {
            element.value = 0
            element.display = false
          })
        })
    },
    getCompanyClientHistory() {
      this.showCompanyClientLoader = true
      var accountId = []
      var contactId = []
      if (Object.keys(this.$store.state.globalFilter).length > 0) {
        if (this.$store.state.globalFilter.firm && this.$store.state.globalFilter.firm.length > 0) {
          accountId = this.$store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if (this.$store.state.globalFilter.advisor && this.$store.state.globalFilter.advisor.length > 0) {
          contactId = this.$store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      this.$axios
        .get(`/api/v1/tal/advisor/wins/plans/${this.companyClient}`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          var companyClientPlans = success.data.d && success.data.d.length > 0 ? success.data.d : []
          if (companyClientPlans && companyClientPlans.length > 0) {
            this.companyClientHistory = companyClientPlans.filter((a) => a.Status === 'Live')
          } else {
            this.companyClientHistory = []
          }
          this.showCompanyClientLoader = false
        })
        .catch(() => {
          this.showCompanyClientLoader = false
          this.companyClientHistory = []
        })
    },
    getIndividualClientHistory() {
      this.showIndividualClientLoader = true
      var accountId = []
      var contactId = []
      if (Object.keys(this.$store.state.globalFilter).length > 0) {
        if (this.$store.state.globalFilter.firm && this.$store.state.globalFilter.firm.length > 0) {
          accountId = this.$store.state.globalFilter.firm.map(function (el) {
            if (el.accountId) {
              return el.accountId
            }
          })
        }
        if (this.$store.state.globalFilter.advisor && this.$store.state.globalFilter.advisor.length > 0) {
          contactId = this.$store.state.globalFilter.advisor.map(function (el) {
            if (el.contactId) {
              return el.contactId
            }
          })
        }
      }
      this.$axios
        .get(`/api/v1/tal/advisor/wins/individuals/${this.individualClient}`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          var individualClientPlans = success.data.d && success.data.d.length > 0 ? success.data.d : []
          if (individualClientPlans && individualClientPlans.length > 0) {
            this.individualClientHistory = individualClientPlans.filter((a) => a.StageName === 'Account Live')
          } else {
            this.individualClientHistory = []
          }
          this.showIndividualClientLoader = false
        })
        .catch(() => {
          this.showIndividualClientLoader = false
          this.individualClientHistory = []
        })
    },
    addRemoveStatus(status, business) {
      if (business === 'company') {
        if (this.companyPlanDetail && this.companyPlanDetail.length > 0) {
          this.companyStatusList.forEach((element) => {
            if (element.text === status) {
              element.display = !element.display
            }
          })
          var selectedCompanyFilter = this.companyStatusList.filter((a) => a.display === true)
          var companyFilterValue = selectedCompanyFilter.map((a) => a.text)
          this.companyDetails = this.companyPlanDetail.filter((x) => companyFilterValue.includes(x.Status))
        }
      } else {
        if (this.individualPlanDetail && this.individualPlanDetail.length > 0) {
          this.individualStateList.forEach((element) => {
            if (element.text === status) {
              element.display = !element.display
            }
          })
          var selectedFilter = this.individualStateList.filter((a) => a.display === true)
          var filterValue = selectedFilter.map((a) => a.text)
          this.individualDetails = this.individualPlanDetail.filter((x) => filterValue.includes(x.StageName))
        }
      }
    }
  }
}
</script>
<style scoped>
#statusDot {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  color: #fff;
  font-size: 1.1rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 17px;
  letter-spacing: 0.02px;
}
#switchButton {
  height: 45px;
  text-align: left;
  border-radius: 23px;
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 1.1rem !important;
  line-height: 17px;
  letter-spacing: 0.02px;
}
</style>
