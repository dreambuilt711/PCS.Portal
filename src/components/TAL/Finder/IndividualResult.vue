<template>
  <v-col cols="12" xs="12">
    <v-data-table-server
      v-model:expanded="expanded"
      :headers="headerList"
      :items="individualList"
      item-key="householdId"
      :single-expand="true"
      :class="[
        $vuetify?.breakpoint?.smAndDown ? 'elevation-0 mb-0' : 'elevation-6 mb-0',
        isShowMapSwitch ? 'showMap' : 'hideMap'
      ]"
      :options="pagination"
      mobile-breakpoint="0"
      :hide-default-footer="true"
      :items-length="totalIndiviudalPlans"
    >
      <template #item="{ item, isExpanded, expand }">
        <tr :class="mapSelectedIndividual == item.householdId ? rowcolor : ''">
          <td :class="mapSelectedIndividual == item.householdId ? selectedRowPadding : ''">
            <v-col cols="12" xs="12">
              <v-row class="align-self">
                <v-col
                  v-if="
                    item.individualAccounts.length > 0 &&
                    item.individualAccounts[0].latitude &&
                    item.individualAccounts[0].longitude
                  "
                  cols="1"
                  xs="1"
                  class="text-center d-flex flex_none mr-2"
                  :class="isShowMapSwitch ? 'cursor-pointer' : ''"
                  @click="isShowMapSwitch ? mapHighlightForHousehold(item.individualAccounts[0].accountId) : ''"
                >
                  <v-icon size="16" class="icon-individual participantIcon" />
                </v-col>
                <v-col v-else cols="1" xs="1" class="text-center d-flex flex_none mr-2" style="width: 16px" />
                <v-col cols="1" xs="1" class="d-flex flex_none mr-3">
                  <v-icon :ripple="false" size="12" class="participantIcon removeOpacity" @click="expand(!isExpanded)">
                    {{ isExpanded ? 'fas fa-caret-up' : 'fas fa-caret-down' }}
                  </v-icon>
                </v-col>
                <v-col cols="9" xs="9" sm="10" class="d-flex">
                  <v-hover v-slot="{ hover }">
                    <h4 class="pt-1">
                      <a
                        :class="[
                          !theme.dark ? 'text-hyperlink' : 'text-white',
                          hover ? 'text-decoration-underline' : 'text-decoration-none'
                        ]"
                        class="text-capitalize"
                        @click="householdInfo(item.householdId, item.householdName)"
                        >{{ item.householdName.toLowerCase()
                        }}<span class="ml-1 text-lowercase">{{ `(${item.accounts} accounts)` }}</span></a
                      >
                    </h4>
                  </v-hover>
                </v-col>
              </v-row>
            </v-col>
          </td>
          <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-right pl-0">
            {{ formatPrice(item.totalValue, 2) }}
          </td>
          <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-left pr-0 pl-5" :class="!theme.dark ? 'text-hyperlink' : ''">
            {{ item.contact ? item.contact : '-' }}
          </td>
          <td class="text-center pa-1">
            <v-row class="justify-center">
              <v-col cols="6" xs="6" class="flex_none">
                <v-btn
                  :color="!theme.dark ? 'hyperlink' : ''"
                  variant="text"
                  @click.stop="
                    ;[
                      $set(closeReportPopUp, item.householdId, true),
                      (optionsHouseholdID = item.householdId),
                      (optionsItem = item)
                    ]
                  "
                >
                  <v-icon size="21" class="icon-action" />
                </v-btn>
              </v-col>
              <v-col cols="6" xs="6" class="flex_none">
                <PlanStar
                  :key="componentBookmarkKey"
                  style="line-height: 0.5"
                  :household-id="item.householdId"
                  from="TAL"
                  type="Individual"
                />
              </v-col>
            </v-row>
            <v-dialog
              :key="item.householdId"
              v-model="closeReportPopUp[item.householdId]"
              :scrollable="false"
              :max-width="400"
              content-class="elevation-3"
            >
              <v-card>
                <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                  <v-col cols="12" xs="12" class="text-left">
                    <v-row>
                      <v-col cols="11" xs="11" class="text-left">
                        <h3>Actions</h3>
                      </v-col>
                      <v-col cols="1" xs="1" class="text-right align-self">
                        <v-icon
                          class="cursor-pointer"
                          :class="theme.dark ? '' : 'text-accent'"
                          @click="$set(closeReportPopUp, item.householdId, false)"
                        >
                          close
                        </v-icon>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-card-title>
                <v-card-text class="pt-4">
                  <v-col cols="12" xs="12">
                    <v-row>
                      <template v-for="(item, index) in item.actionList" :key="`${index}_${item.value}`">
                        <v-col cols="12" sm="6">
                          <v-btn
                            block
                            class="ml-0"
                            size="x-large"
                            :color="!theme.dark ? 'hyperlink text-white' : ''"
                            @click="performAction(optionsHouseholdID, optionsItem, item.value, $event)"
                          >
                            {{ item.text }}
                          </v-btn>
                        </v-col>
                      </template>
                    </v-row>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </template>
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-data-table
            :headers="nestedTableHeader"
            :items="item.individualAccounts ? item.individualAccounts : []"
            item-key="accountId"
            hide-default-footer
            :disable-pagination="true"
            class="nestedTable"
            mobile-breakpoint="0"
          >
            <template #item="props">
              <tr v-if="$vuetify?.breakpoint?.mdAndUp">
                <td></td>
                <td class="text-capitalize">
                  {{ props.item.accountName ? props.item.accountName.toLowerCase() : '' }}
                </td>
                <td>{{ props.item.accountType }}</td>
                <td>{{ props.item.account }}</td>
                <td class="text-right">
                  {{ formatPrice(props.item.totalValue, 2) }}
                </td>
                <td :class="!theme.dark ? 'text-hyperlink breakWord' : 'breakWord'">
                  {{ props.item.accountContact ? props.item.accountContact : '-' }}
                </td>
              </tr>
              <tr v-else>
                <td></td>
                <td>
                  <v-col cols="12" xs="12" class="text-capitalize mb-1 mt-2">
                    {{ props.item.accountName ? props.item.accountName.toLowerCase() : '' }}
                  </v-col>
                  <v-col cols="12" xs="12" class="mt-1 mb-1">
                    {{ props.item.accountType }}
                  </v-col>
                  <v-col cols="12" xs="12" class="mt-1 mb-1">
                    {{ props.item.account }}
                  </v-col>
                  <v-col cols="12" xs="12" class="mt-1 mb-1">
                    {{ formatPrice(props.item.totalValue, 2) }}
                  </v-col>
                  <v-col cols="12" xs="12" class="mt-1 mb-2" :class="!theme.dark ? 'text-hyperlink' : ''">
                    {{ props.item.accountContact ? props.item.accountContact : '-' }}
                  </v-col>
                </td>
              </tr>
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table-server>
    <Observer @intersect="intersected" />
  </v-col>
</template>

<script>
import { ref, inject, onMounted, getCurrentInstance, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import PlanStar from '@/components/TAL/PlanStar'
import Observer from '@/components/Observer'
export default {
  components: {
    PlanStar,
    Observer
  },
  props: ['isShowMapSwitch', 'mapFinderInfo', 'isShowStarred', 'zipcode'],
  setup(props) {
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const closeReportPopUp = ref({})
    const expanded = ref([])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 50
    })
    const headerList = ref([
      {
        text: 'Household Name',
        value: 'householdName',
        width: '50%',
        align: 'start',
        class: 'sticky-header'
      },
      {
        text: 'Total Value',
        value: 'totalValue',
        width: '15%',
        align: 'end',
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        text: 'Contact',
        value: 'contact',
        width: '20%',
        align: 'start',
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        text: 'Actions',
        value: '',
        width: $vuetify?.breakpoint?.xs ? '20%' : '15%',
        align: 'center',
        sortable: false,
        class: 'pa-1 sticky-header'
      }
    ])
    const nestedTableHeader = ref([
      {
        text: '',
        value: '',
        align: $vuetify?.breakpoint?.smAndDown ? 'center pr-7' : 'center',
        width: '5%',
        sortable: false
      },
      {
        text: 'Accounts',
        value: 'accountName',
        width: $vuetify?.breakpoint?.smAndDown ? '95%' : '15%',
        align: 'start',
        sortable: false
      },
      {
        text: 'Account Type',
        value: 'accountType',
        width: '15%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        text: 'Account #',
        value: 'account',
        width: '15%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        text: 'Total Value',
        value: 'totalValue',
        width: '15%',
        align: 'end',
        sortable: false,
        class: 'hidden-sm-and-down'
      },
      {
        text: 'Contact',
        value: 'accountContact',
        width: '35%',
        align: 'start',
        sortable: false,
        class: 'hidden-sm-and-down'
      }
    ])
    const individualList = ref([])
    const zipcode = ref(props.store)
    const radius = ref(store.state.finderList.searchRadius)
    const hasLoan = ref('')
    const employmentStatus = ref('')
    const planStatus = ref('')
    const equityAllocation = ref('')
    const actionList = ref([
      {
        text: 'Email Reminder...',
        value: 'EmailReminder'
      },
      {
        text: 'Open Account',
        value: 'OpenAccount'
      }
    ])
    const mapSelectedIndividual = ref('')
    const selectedRowPadding = ref('')
    const rowcolor = ref('')
    const componentBookmarkKey = ref(0)
    const totalIndiviudalPlans = ref(-1)
    watch(
      () => store.state.finderList.individualData,
      () => {
        individualList.value = store.state.finderList.individualData
        zipcode.value = store.state.finderList.zipcode
        radius.value = store.state.finderList.searchRadius
        totalIndiviudalPlans.value = individualList.value && individualList.value.length > 0 ? individualList.value.length : -1
      },
      { deep: true, immediate: true }
    )
    const intersected = async () => {
      eventBus.emit('callIndiviudalApi')
    }
    const performAction = (householdId, item, val) => {
      if (val === 'EmailReminder') {
        if (item.individualAccounts && item.individualAccounts.length > 0) {
          if (item.individualAccounts[0].accountContact) {
            window.location.href = `mailto:${item.individualAccounts[0].accountContact}`
          } else {
            window.location.href = 'mailto:'
          }
        } else {
          window.location.href = 'mailto:'
        }
      }
    }
    const formatPrice = (labelValue) => {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
        : // Six Zeroes for Millions
          Math.abs(Number(labelValue)) >= 1.0e6
          ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
          : // Three Zeroes for Thousands
            Math.abs(Number(labelValue)) >= 1.0e3
            ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
            : Math.abs(Number(labelValue))
    }
    const applyIndividualFilter = () => {
      eventBus.emit('applyIndividualFilteredData')
    }
    const householdInfo = (householdId, householdName) => {
      store.state.finderList.prospectValue = 4
      router.push({
        query: {
          householdId: householdId,
          householdName: householdName
        },
        name: 'TALHouseholdResult',
        params: {
          lastRoute: route.path
        }
      })
    }
    const mapHighlightForHousehold = (accountId) => {
      props.mapFinderInfo.highlightIndividualMarker(accountId)
    }
    onMounted(() => {
      applyIndividualFilter()
      eventBus.on('refreshBookMark', () => {
        componentBookmarkKey.value += 1
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('refreshBookMark')
    })
    return {
      closeReportPopUp,
      expanded,
      pagination,
      headerList,
      nestedTableHeader,
      hasLoan,
      employmentStatus,
      planStatus,
      equityAllocation,
      actionList,
      mapSelectedIndividual,
      selectedRowPadding,
      rowcolor,
      store,
      $vuetify,
      theme,
      router,
      individualList,
      totalIndiviudalPlans,
      componentBookmarkKey,
      intersected,
      performAction,
      householdInfo,
      mapHighlightForHousehold,
      formatPrice
    }
  }
}
</script>
<style scoped>
.v-data-table.showMap :deep(.sticky-header) {
  position: sticky;
  top: -15px !important;
  z-index: 2;
}

.v-data-table.hideMap :deep(.sticky-header) {
  position: sticky;
  top: var(--toolbarHeight) !important;
  z-index: 2;
}

.v-data-table.showMap :deep(.v-data-table__wrapper),
.v-data-table.hideMap :deep(.v-data-table__wrapper) {
  overflow: unset;
}
</style>
