<template>
  <v-col cols="12" class="pa-0"
    >{{ mdAndDown }}
    <v-data-table-server
      :headers="headers"
      :items="searchResult"
      item-key="ssn"
      :options="pagination"
      mobile-breakpoint="0"
      :hide-default-footer="true"
      :class="[mdAndDown ? 'elevation-0 mb-0' : 'elevation-6 mb-0']"
      :hide-default-header="mdAndDown"
      :items-length="totalIndividualPlans"
    >
      <template #item="{ item, isExpanded, expand }">
        <tr v-if="!mdAndDown">
          <td class="text-left text-capitalize pr-0">
            <v-hover v-slot="{ hover }">
              <v-tooltip location="top" color="#0077CC" opacity="1">
                <template #activator="{ props }">
                  <v-col class="flex_none pa-0">
                    <v-row>
                      <v-col cols="2" xl="1" class="pa-0">
                        <v-icon size="18" class="icon-individual participantIcon width_10 pr-2 pl-1" />
                        <v-icon
                          v-if="item.individualcount.length > 0 && item.individualcount[0].householdcount > 1"
                          :class="isExpanded ? 'rotate_icon_plus_180' : ''"
                          size="small"
                          class="font-size-14 participantIcon"
                          @click="expand(!isExpanded)"
                        >
                          fa-solid fa-caret-down
                        </v-icon>
                      </v-col>
                      <v-col cols="10" xl="11" class="flex_none pa-0">
                        <a
                          v-bind="props"
                          :class="[
                            !$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white',
                            hover ? 'text-decoration-underline' : 'text-decoration-none'
                          ]"
                          class="text-capitalize"
                          @click="individualSSOToRelius(item.planID, item.ssn)"
                          >{{ item.name }}
                          {{
                            item.individualcount[0].householdcount > 1 ? '(' + item.individualcount[0].householdcount + ')' : ''
                          }}</a
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </template>
                <v-col class="pa-1">
                  <v-col v-if="item.streetAddress" class="pa-0">
                    {{ item.streetAddress ? item.streetAddress : '' }}
                  </v-col>
                  <v-col class="pt-1 pb-0 pl-0 pr-0">
                    <v-row no-gutters>
                      <v-col class="pa-0">
                        {{ item.city ? item.city : '' }}{{ item.state ? ' ' + item.state + ',' : ''
                        }}{{ item.zipCode ? ' ' + item.zipCode : '' }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="item.internetAddr" class="pt-1 pb-0 pl-0 pr-0">
                    {{ item.internetAddr ? item.internetAddr : '' }}
                  </v-col>
                  <v-col class="py-1">
                    <v-row no-gutters>
                      <v-col v-if="item.phone">
                        {{ item.phone ? formatPhoneNumber(item.phone) : '' }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="pa-0">{{ item.age ? item.age : '0' }} years old</v-col>
                  <v-col class="py-1">
                    {{ item.displaySSN ? item.displaySSN : '' }}
                  </v-col>
                  <v-col class="pa-0">
                    <v-row no-gutters>
                      <v-col class="pa-0">
                        {{ item.employmentStatus ? item.employmentStatus : ''
                        }}{{ item.planStatus ? ', ' + item.planStatus : '' }}
                        {{ item.accountStatus ? ', ' + item.accountStatus : ''
                        }}{{ item.loanStatus ? ', ' + item.loanStatus : '' }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="py-1"> (Click the name to go to account details) </v-col>
                </v-col>
              </v-tooltip>
            </v-hover>
          </td>
          <td class="text-left text-capitalize">
            {{ item.plan ? item.plan.toLowerCase() : '' }}
          </td>
          <td class="text-left wraptext" @mouseover="!isdragscroll ? (isdragscroll = true) : ''">
            <span class="mr-1">{{ item.planStatus }}</span>
            <span v-if="item.terminationDate">({{ new Date(item.terminationDate).toLocaleDateString() }})</span>
          </td>
          <td class="text-right wraptext" @mouseover="!isdragscroll ? (isdragscroll = true) : ''">
            {{ item.age ? item.age : '-' }}
          </td>
          <td class="text-right wraptext" @mouseover="!isdragscroll ? (isdragscroll = true) : ''">
            {{ item.balance ? (item.balance === '0.00' ? '-' : formatPrice(item.balance, 2)) : '-' }}
          </td>
          <td class="text-right wraptext" @mouseover="!isdragscroll ? (isdragscroll = true) : ''">
            {{ item.income ? (item.income === '0.00' ? '-' : formatPrice(item.income, 2)) : '-' }}
          </td>
          <td class="text-right wraptext" @mouseover="!isdragscroll ? (isdragscroll = true) : ''">
            {{ item.savings ? (item.savings === '0.00' ? '-' : formatPrice(item.savings, 2)) : '-' }}
          </td>
          <td class="text-right wraptext" @mouseover="!isdragscroll ? (isdragscroll = true) : ''">
            {{ item.employer ? (item.employer === '0.00' ? '-' : formatPrice(item.employer, 2)) : '-' }}
          </td>
          <td class="text-right wraptext">
            {{ item.ep ? `${item.ep}%` : '-' }}
          </td>
          <td class="text-right wraptext">
            {{ item.currentLoansBalanceAmt ? formatPrice(item.currentLoansBalanceAmt, 2) : '-' }}
          </td>
          <td class="text-center" @mouseover="isdragscroll = false">
            <v-col class="pa-0">
              <v-row class="justify-center">
                <v-col class="align-self pa-0" cols="4">
                  <v-btn
                    icon
                    class="ma-0"
                    size="small"
                    :color="!$vuetify?.theme.dark ? 'accent' : ''"
                    variant="text"
                    :disabled="item.Source"
                    @click.stop="$set(closeReportPopUp, item.ssn, true)"
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                  <v-dialog
                    :key="item.ssn"
                    v-model="closeReportPopUp[item.ssn]"
                    :scrollable="false"
                    :max-width="totalReport === 1 ? '300' : '400'"
                    content-class="elevation-3"
                  >
                    <RBCReport
                      :plan-i-d="item.planID"
                      :ssn="item.ssn"
                      from-page="Participants"
                      :plan-name="item.name"
                      :target-object="item"
                      :email="item.internetAddr"
                      @close-report="$set(closeReportPopUp, item.ssn, false)"
                      @report-list="reportList"
                    />
                  </v-dialog>
                </v-col>
                <v-col class="align-self pa-0" cols="4">
                  <PlanStar :key="componentBookmarkKey" :seinpno="item.householdID" from="RBC" type="Individuals" />
                </v-col>
              </v-row>
            </v-col>
          </td>
        </tr>
        <tr v-else>
          <td class="pr-3 pl-3">
            <v-col class="mb-2 pa-0">
              <v-row>
                <v-col cols="10" class="pa-0">
                  <v-row>
                    <v-col cols="12" class="pa-0">
                      <h5 class="pt-1">
                        <v-row>
                          <v-col cols="1" class="pt-2 pb-0 pl-0 pr-0">
                            <v-icon size="18" class="icon-individual participantIcon width_10 pr-2 pl-1" />
                          </v-col>
                          <v-col cols="9" class="pt-0 pb-0 pl-2 pr-0">
                            <span>
                              <span>Name</span>
                              <br />
                              <a
                                :class="[!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white']"
                                class="text-capitalize text-decoration-underline"
                                @click="individualSSOToRelius(item.planID, item.ssn)"
                                ><h4>{{ item.name }}</h4>
                                {{
                                  item.individualcount[0].householdcount > 1
                                    ? '(' + item.individualcount[0].householdcount + ')'
                                    : ''
                                }}</a
                              >
                            </span>
                          </v-col>
                        </v-row>
                      </h5>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="2" class="text-right cursor-pointer pa-0">
                  <v-btn icon variant="text" @click="expand(!isExpanded)">
                    <v-icon :class="isExpanded ? 'rotate_icon' : ''"> expand_more </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" class="mb-2 pa-0">
                  <v-row>
                    <v-col cols="8" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Email</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>
                          <a class="word_break" :href="`mailto:${item.internetAddr}`" target="_blank">{{ item.internetAddr }}</a>
                        </h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0 mb-2">
                      <v-col cols="12" class="pa-0">
                        <h5>Account Balance</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ formatPrice(item.balance, 2) }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="mb-2 pa-0">
                  <v-row>
                    <v-col cols="8" class="pa-0 mb-2">
                      <v-col cols="12" class="pa-0">
                        <h5>Salary</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ formatPrice(item.income, 2) }}</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Age</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.age }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-col cols="12" :class="mdAndDown ? 'pl-1 pt-0 pb-0 pr-0' : 'pa-0'">
                    <v-row>
                      <v-col
                        v-if="item.individualcount.length > 0 && item.individualcount[0].householdcount > 1"
                        cols="2"
                        sm="1"
                        class="cursor-pointer align-self pa-0"
                        @click="expand(!isExpanded)"
                      >
                        <customicon
                          v-if="item.individualcount.length > 0 && item.individualcount[0].householdcount > 1"
                          type="houseHoldIcon"
                        />
                      </v-col>
                      <v-col cols="2" sm="1" class="align-self pa-0">
                        <v-btn
                          icon
                          class="ma-0"
                          size="small"
                          :color="!$vuetify?.theme.dark ? 'accent' : ''"
                          variant="text"
                          :disabled="item.Source"
                          @click.stop="$set(closeReportPopUp, item.ssn, true)"
                        >
                          <v-icon size="small"> fas fa-ellipsis-v </v-icon>
                        </v-btn>
                        <v-dialog
                          :key="item.ssn"
                          v-model="closeReportPopUp[item.ssn]"
                          :scrollable="false"
                          :max-width="totalReport === 1 ? '300' : '400'"
                          content-class="elevation-3"
                        >
                          <RBCReport
                            :plan-i-d="item.planID"
                            :ssn="item.ssn"
                            from-page="Participants"
                            :plan-name="item.name"
                            :target-object="item"
                            :email="item.internetAddr"
                            @close-report="$set(closeReportPopUp, item.ssn, false)"
                            @report-list="reportList"
                          />
                        </v-dialog>
                      </v-col>
                      <v-col cols="2" sm="1" class="align-self pa-0">
                        <PlanStar :key="componentBookmarkKey" :seinpno="item.householdID" from="RBC" type="Individuals" />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </td>
        </tr>
      </template>
      <template #expanded-item="{ headers, item }">
        <td v-if="!mdAndDown" :colspan="headers.length">
          <v-card flat>
            <v-card-text>
              <div class="position-class c_background">
                <v-col cols="12" class="ml-4 pa-0">
                  <v-col cols="12" class="pa-0">
                    <v-row>
                      <v-col cols="12" class="pa-0 mt-1">
                        <v-row>
                          <v-col cols="2" class="font-weight-medium pa-0 text-accent"> Accounts </v-col>
                          <v-col cols="3" class="font-weight-medium ml-4 text-accent pa-0"> Account Type </v-col>
                          <v-col cols="2" class="font-weight-medium text-accent pa-0"> Email </v-col>
                          <v-col cols="2" class="font-weight-medium text-right text-accent pa-0"> Total Value </v-col>
                          <v-col cols="2" class="font-weight-medium text-right text-accent pa-0"> Account # </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-row>
                          <v-col
                            v-for="(individual, index) in item.individualAccount"
                            :key="index"
                            cols="12"
                            class="pt-0 pl-0 pr-0 pb-3"
                          >
                            <v-row>
                              <v-col cols="2" class="text-accent pa-0">
                                {{ individual.accountName }}
                              </v-col>
                              <v-col cols="3" class="ml-4 pa-0">
                                {{ individual.accountType }}
                              </v-col>
                              <v-col cols="2" class="word_break pa-0">
                                individual.accountContact ? individual.accountContact : '-' }}
                              </v-col>
                              <v-col cols="2" class="text-right pa-0">
                                {{ formatPrice(individual.totalValue, 2) }}
                              </v-col>
                              <v-col cols="2" class="text-right pa-0">
                                {{ individual.account }}
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </div>
            </v-card-text>
          </v-card>
        </td>
        <td v-if="mdAndDown" :colspan="headers.length">
          <v-card flat class="expandable_background">
            <v-card-text>
              <v-row>
                <v-col cols="12" class="mb-2 pa-0">
                  <v-row>
                    <v-col cols="8" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Household</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.householdName }}</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Phone</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.phone }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="pa-0 mb-2">
                  <v-row>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>SSN</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.displaySSN }}</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5 :class="xsOnly ? 'pl-2 pb-0' : 'pl-0 pb-0'">Age</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4 :class="xsOnly ? 'pl-2' : ''">
                          {{ item.age }}
                        </h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Zip Code</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.zipCode }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="pa-0 mb-2">
                  <v-row>
                    <v-col cols="12" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Plan Name</h5>
                      </v-col>
                      <v-col cols="12" class="text-capitalize pa-0">
                        <h4>{{ item.plan ? item.plan.toLowerCase() : '' }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="pa-0 mb-2">
                  <v-row>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Plan Status</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>
                          <span class="mr-1">{{ item.planStatus }}</span>
                          <span v-if="item.terminationDate">({{ new Date(item.terminationDate).toLocaleDateString() }})</span>
                        </h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Account Status</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.employmentStatus }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="mb-2 pa-0">
                  <v-row>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5 class="pl-0 pb-0">Employment Status</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.employmentStatus }}</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5 class="pl-0 pb-0 pr-1">Employer Contributions</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ formatPrice(item.employer, 2) }}</h4>
                      </v-col>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5>Employee Contributions</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ formatPrice(item.savings, 2) }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="pa-0 mb-2">
                  <v-row>
                    <v-col cols="6" sm="4" class="pa-0">
                      <v-col cols="12" class="pa-0">
                        <h5 class="pl-0 pb-0">Equity Allocation</h5>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <h4>{{ item.ep ? `${item.ep}%` : '' }}</h4>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="item.individualAccount && item.individualAccount.length > 1" class="pa-0">
                  <v-col v-for="(individual, index) in item.individualAccount" :key="index" cols="12" class="hidedivider pa-0">
                    <h3 class="mb-1 mt-2 text-blue font-weight-regular">
                      {{ item.householdName }}
                    </h3>
                    <v-col cols="12" class="pa-0 mb-2">
                      <v-row>
                        <v-col cols="8" class="pa-0">
                          <v-col cols="12" class="pa-0">
                            <h5 class="pl-0 pb-0">Account Name</h5>
                          </v-col>
                          <v-col cols="12" class="pa-0">
                            <h4>{{ individual.accountName }}</h4>
                          </v-col>
                        </v-col>
                        <v-col cols="4" class="pa-0">
                          <v-col cols="12" class="pa-0">
                            <h5 class="pl-0 pb-0">Balance</h5>
                          </v-col>
                          <v-col cols="12" class="pa-0">
                            <h4>{{ formatPrice(individual.totalValue, 2) }}</h4>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="mb-2 pa-0">
                      <v-row>
                        <v-col cols="8" class="pa-0">
                          <v-col cols="12" class="pa-0">
                            <h5 class="pl-0 pb-0">Account Type</h5>
                          </v-col>
                          <v-col cols="12" class="pa-0">
                            <h4>{{ individual.accountType }}</h4>
                          </v-col>
                        </v-col>
                        <v-col cols="4" class="pa-0">
                          <v-col cols="12" class="pa-0">
                            <h5 class="pl-0 pb-0">Account #</h5>
                          </v-col>
                          <v-col cols="12" class="pa-0">
                            <h4>{{ individual.account }}</h4>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-divider class="my-3 divider" />
                  </v-col>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-divider class="my-1 divider" />
        </td>
      </template>
    </v-data-table-server>
    <Observer @intersect="intersected" />
  </v-col>
</template>
<script>
import RBCReport from '@/components/Retention/RBCReport'
import PlanStar from '@/components/TAL/PlanStar'
import customicon from '@/components/CustomIcon'
import Observer from '@/components/Observer'
import { ref, watch, onMounted, getCurrentInstance, watchEffect, inject, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
export default {
  components: {
    RBCReport,
    PlanStar,
    customicon,
    Observer
  },
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const toast = inject('toast')
    const router = useRouter()
    const isdragscroll = ref(false)
    const componentBookmarkKey = ref(0)
    const headers = ref([
      {
        text: 'Participant Name',
        value: 'name',
        align: 'start',
        width: '16%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Plan Name',
        value: 'plan',
        align: 'start',
        width: '16%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Plan Status (Termination Date)',
        value: 'planStatus',
        align: 'start',
        width: '7%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Age',
        value: 'age',
        align: 'end',
        width: '5%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Account Balance',
        value: 'balance',
        align: 'end',
        width: '8%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Salary',
        value: 'income',
        align: 'end',
        width: '8%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Employee Contributions',
        value: 'savings',
        align: 'end',
        width: '8%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Employer Contributions',
        value: 'employer',
        align: 'end',
        width: '8%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Equity Allocation',
        value: 'ep',
        align: 'end',
        width: '8%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Loan Balance',
        value: 'currentLoansBalanceAmt',
        align: 'end',
        width: '8%',
        display: true,
        sortable: false,
        class: 'sticky-header'
      },
      {
        text: 'Actions',
        value: 'action',
        align: 'center',
        width: '8%',
        class: 'sticky-header',
        display: false,
        sortable: false
      }
    ])
    const totalIndividualPlans = ref(-1)
    const searchResult = ref([])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: -1
    })
    const closeReportPopUp = ref({})
    const rbcPlans = ref([])
    const totalReport = ref(2)
    const currentPageNumber = ref(1)
    const sortByTypeName = ref('ParticipantName-ASC')
    const mdAndDown = ref(false)
    const xsOnly = ref(false)
    const width = ref(0)

    //watch
    watchEffect(() => {
      mdAndDown.value = display.mdAndDown.value
      xsOnly.value = display.xs.value
      width.value = display.width.value
    })
    watch(
      $store.state.clientPlan.individualData,
      () => {
        searchResult.value = $store.state.clientPlan.individualData ? $store.state.clientPlan.individualData : []
        totalIndividualPlans.value = searchResult.value && searchResult.value.length > 0 ? searchResult.value.length : -1
      },
      { deep: true },
      { immediate: true }
    )
    //mounted
    onMounted(() => {
      eventBus.on('refreshClientBookMark', () => {
        componentBookmarkKey.value += 1
      })
    })
    //beforeUnmonth
    onBeforeUnmount(() => {
      eventBus.off('refreshClientBookMark')
    })
    //methods
    function formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      }
      return ''
    }
    function redirect() {
      router.push('/TAL/Finder/Result').catch(() => {})
    }
    ///Observable Start
    async function intersected() {
      eventBus.emit('callParticipantApi')
    }
    ///Observable End
    ///Search plans
    function reportList(val) {
      totalReport.value = val.length
    }
    function individualSSOToRelius(planID, key) {
      if ($store.state.isImpersonating) {
        toast.warning('Plan Portal SSO is unavailable when impersonating another user.', { autoClose: 5000 })
        return
      }
      onPopUpEvent(`/api/v1/retention/pcs401k/individual/sso/initiate?planId=${planID}&key=${key}`, '_AccountLink')
    }
    function currencyFormat(value) {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      })
      return formatter.format(value)
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          //this.$FModal.show({ component: PdfViewer, maxHeight: '98%', width: '98%', clickToClose: false }, { pdfUrl: url })
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    //created
    $store.dispatch('getAccountList')

    return {
      isdragscroll,
      componentBookmarkKey,
      headers,
      totalIndividualPlans,
      searchResult,
      pagination,
      closeReportPopUp,
      rbcPlans,
      totalReport,
      currentPageNumber,
      sortByTypeName,
      width,
      mdAndDown,
      xsOnly,
      currencyFormat,
      individualSSOToRelius,
      reportList,
      intersected,
      redirect,
      formatPhoneNumber,
      onPopUpEvent
    }
  }
}
</script>
<style scoped>
.wraptext {
  white-space: pre-wrap;
}
.filterChips .v-chip {
  border-radius: 5px !important;
}
.livePlanTable .fixed-column-left {
  position: absolute !important;
  display: flex !important;
  align-items: center !important;
  left: 16px !important;
}
.livePlanTable .fixed-column-right {
  position: absolute !important;
  display: flex !important;
  align-items: center !important;
  right: 16px !important;
}
.position-class {
  position: absolute;
  left: 0;
  padding: 0 20px;
  height: auto;
  overflow-y: auto;
  display: block;
  width: 100%;
  z-index: 1;
  max-height: 150px;
}
.c_background {
  background: #fff !important;
}

.lg_height_overflow {
  overflow-y: auto;
  height: calc(100vh - 99px);
}

.hidedivider:last-child .divider {
  display: none;
}
.word_break {
  word-break: break-all;
}
.heightForlargeLegalText {
  max-height: 75vh !important;
}
.lgHeightOverflow {
  max-height: 75vh !important;
  overflow-y: auto !important;
}
.xlheightwithoverflow {
  max-height: 82vh !important;
  overflow-y: auto !important;
}
.xl_height_with_overflow {
  max-height: 90vh !important;
  overflow-y: auto !important;
}
.groupTable.v-data-table__wrapper tbody tr.planSelected {
  border: none !important;
}
.v-data-table :deep(.sticky-header) {
  position: sticky;
  top: var(--toolbarHeight);
  z-index: 2;
}

.v-data-table :deep(.v-data-table__wrapper) {
  overflow: unset;
}
</style>
<style>
.decreaseFont .v-label {
  font-size: 1.1rem;
  font-weight: 500;
}
.fixed-column-left {
  left: 16px !important;
}
.right_16 {
  right: 16px !important;
}
</style>
