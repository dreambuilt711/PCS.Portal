<template>
  <v-container fluid>
    <v-col class="pa-0">
      <v-dialog
        v-model="fundDialog"
        persistent
        scrollable
        max-width="1000px"
        class="elevation-3"
        content-class="elevation-3"
        :eager="true"
      >
        <template #activator="{ props }">
          <v-col cols="12" xl="12" md="12" sm="12" xs="12" class="pt-2 pa-0">
            <v-row>
              <v-col cols="4" xl="4" md="4" sm="4" xs="12" class="text-left">
                <h1 class="font-weight-medium">Investments</h1>
              </v-col>
              <v-col cols="12" lg="8" xl="8" md="8" xs="12" class="text-right">
                <v-btn
                  v-if="$authz.hasPermission($authz.permissionSet.Investment_Lineup__c, $authz.permission.Full)"
                  :color="theme.dark ? '' : 'accent'"
                  v-bind="props"
                  class="ma-0"
                  @click="showFundDialog()"
                >
                  New Prospect Invt. Lineup
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </template>
        <v-card>
          <v-card-title class="pa-1" fixed :class="theme.dark ? '' : 'accent bg-accent secondary--text'">
            <v-row>
              <v-col cols="11" lg="11" sm="11" md="11" xs="11">
                <h3 v-if="!display.xs.value">New Prospect Invt. Lineup</h3>
                <h4 v-if="display.xs.value">New Prospect Invt. Lineup</h4>
              </v-col>
              <v-col cols="1" xl="1" lg="1" sm="1" md="1" xs="1" class="text-right align-self">
                <v-icon :color="theme.dark ? '' : 'secondary'" @click="resetFund()"> close </v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text id="fundModel" style="height: 700px">
            <v-container
              v-if="
                !$authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
              "
              class="pa-0"
            >
              <v-col v-if="!fundEditable" cols="12" xs="12" class="pb-2 pa-0">
                <h3 class="font-weight-medium">
                  This Investment is only available for Prospecting. <br /><i
                    >If you like to establish this investment for Client(s), please reach out to your sales rep or contact
                    {{ advisorContactId }}</i
                  >
                </h3>
              </v-col>
              <v-col>
                <v-row>
                  <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pr-2 pb-3 pa-0">
                    <h2>Investment Details</h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pr-2 pa-0">
                    <v-text-field
                      v-model="fundName"
                      label="Name of Investment List"
                      required
                      :error="modelfunderror"
                      :error-messages="modelFundMsg"
                      variant="outlined"
                      autofocus
                      density="compact"
                      :disabled="fundEditable"
                      @blur="removeValidation()"
                    />
                  </v-col>
                  <v-col cols="12" xs="12" xl="12" lg="12" md="12" sm="12" class="pr-2 pa-0">
                    <v-text-field
                      v-model="fundDescription"
                      label="Investment List Description"
                      maxlength="250"
                      counter="250"
                      variant="outlined"
                      density="compact"
                      :disabled="fundEditable"
                    />
                  </v-col>
                  <v-col cols="12" xl="12" lg="12" sm="12" md="12" xs="12" class="pt-3 pb-2 pa-0">
                    <v-divider />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                    <h2>Add Investments</h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" xl="12" lg="12" md="12" sm="12" class="pa-0">
                    <AddInvestment
                      :reports="'Investment_Fund'"
                      :investment-list="fundInvestmentList"
                      :additional-investment="true"
                      :plan-id="planProposalID"
                      :reset-form="fundDialog"
                      :model-i-d="fundID"
                      :hide-from-fund="fundEditable"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-container>
            <v-container
              v-if="
                $authz.allowedByProgram(
                  $authz.programPermissionSet.PCS_Aspire_Product__c,
                  $authz.pcsAspireProduct.Multi_Strategist_Product
                )
              "
              class="pt-3 pb-2 pl-2 pr-2"
            >
              <v-col v-if="!fundEditable" cols="12" xs="12" class="pb-2 pa-0">
                <h4>
                  <span class="font-weight-medium">This Investment is only available for Prospecting. </span>
                  <br /><i
                    >If you like to establish this investment for Client(s), please reach out to your sales rep or contact
                    {{ advisorContactId }}</i
                  >
                </h4>
              </v-col>
              <MMLInvestment ref="proposedFund" />
            </v-container>
          </v-card-text>
          <v-divider class="bold" />
          <v-card-actions v-if="!fundEditable" class="pa-6">
            <v-btn :class="theme.dark ? '' : 'bg-accent'" :disable="!valid" @click="saveFundInvestment()">Save And Close</v-btn>
            <v-btn :color="theme.dark ? '' : 'accent'" variant="outlined" @click="resetFund()"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col cols="12" xs="12">
      <v-data-table
        class="elevation-2"
        loader-height="2"
        :headers="currentFundHeaders"
        :items="currentFundList"
        item-key="ListID"
        :loading="isLoading"
        :hide-default-header="display.smAndDown.value"
        :options="options"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
      >
        <template #header="props">
          <th v-for="header in props.headers" v-show="header.text" :key="header.text" :align="header.align" :width="header.width">
            {{ header.text }}
          </th>
        </template>
        <template #item="props">
          <tr v-if="!display.smAndDown.value">
            <td>
              <v-hover v-slot="{ hover }">
                <h4 @click="editFund(props.item)">
                  <a class="handcursor" :class="[theme.dark ? '' : 'text-hyperlink', hover ? 'text-decoration-underline' : '']">
                    {{ props.item.Name }}
                  </a>
                </h4>
              </v-hover>
            </td>
            <td class="text-wrap wrapword">
              {{ props.item.Description }}
            </td>
            <td
              v-if="$authz.hasPermission($authz.permissionSet.Investment_Lineup__c, $authz.permission.Full)"
              class="text-center"
            >
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    variant="text"
                    :color="!theme.dark ? 'accent' : ''"
                    v-bind="props"
                    @click="copyInvestment(props.item)"
                  >
                    <v-icon size="small"> mdi-content-copy </v-icon>
                  </v-btn>
                </template>
                <span>Create Copy</span>
              </v-tooltip>
            </td>
            <td class="text-center">
              <v-col v-if="props.item.HideDelete == 0" class="pa-0">
                <v-btn
                  icon
                  :color="!theme.dark ? 'error' : ''"
                  variant="text"
                  @click.stop="$set(deletePopUp, props.item.ListID, true)"
                >
                  <v-icon size="large" color="#ff5252"> mdi-delete </v-icon>
                </v-btn>
                <v-dialog
                  :key="props.item.ListID"
                  v-model="deletePopUp[props.item.ListID]"
                  :scrollable="false"
                  max-width="350"
                  content-class="elevation-3"
                >
                  <ActionPopUp
                    confirm-action-text="Delete"
                    cancel-action-text="Cancel"
                    action-text="Delete Investment"
                    :action-message="`Are you sure you want to delete the investment <b>${props.item.Name}</b> from Investment lineup?`"
                    @confirm-action="deleteInvestment(props.item)"
                    @cancel-action="$set(deletePopUp, props.item.ListID, false)"
                  />
                </v-dialog>
              </v-col>
            </td>
          </tr>
          <tr v-else>
            <v-col class="ml-2 mb-2 pa-0">
              <v-row>
                <v-col cols="10" xs="10" class="pa-0">
                  <h5 class="pt-1">
                    <span class="text-grey">Name</span>
                  </h5>
                  <h4 class="text-capitalize">
                    <a
                      class="handcursor text_decoration"
                      :class="theme.dark ? '' : 'text-hyperlink'"
                      @click="editFund(props.item)"
                    >
                      <b>{{ props.item.Name }}</b>
                    </a>
                  </h4>
                </v-col>
                <v-col
                  v-if="$authz.hasPermission($authz.permissionSet.Investment_Lineup__c, $authz.permission.Full)"
                  cols="2"
                  xs="2"
                >
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-btn
                        icon
                        variant="text"
                        :color="!theme.dark ? 'accent' : ''"
                        v-bind="props"
                        @click="copyInvestment(props.item)"
                      >
                        <v-icon size="small"> mdi-content-copy </v-icon>
                      </v-btn>
                    </template>
                    <span>Create Copy</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="10" xs="10">
                  <h5 class="pt-1">
                    <span class="text-grey">Description</span>
                  </h5>
                  <h4 class="text-uppercase">
                    {{
                      props.item.Description
                        ? props.item.Description.length > 80
                          ? props.item.Description.substring(0, 80) + '...'
                          : props.item.Description
                        : ''
                    }}
                  </h4>
                </v-col>
                <v-col cols="2" xs="2" class="pa-0">
                  <v-col v-if="props.item.HideDelete == 0" class="pa-0">
                    <v-btn
                      icon
                      :color="!theme.dark ? 'error' : ''"
                      variant="text"
                      @click.stop="$set(deletePopUp, props.item.ListID, true)"
                    >
                      <v-icon size="large" color="#ff5252"> mdi-delete </v-icon>
                    </v-btn>
                    <v-dialog
                      :key="props.item.ListID"
                      v-model="deletePopUp[props.item.ListID]"
                      :scrollable="false"
                      max-width="350"
                      content-class="elevation-3"
                    >
                      <ActionPopUp
                        confirm-action-text="Delete"
                        cancel-action-text="Cancel"
                        action-text="Delete Investment"
                        :action-message="`Are you sure you want to delete the investment <b>${props.item.Name}</b> from Investment lineup?`"
                        @confirm-action="deleteInvestment(props.item)"
                        @cancel-action="$set(deletePopUp, props.item.ListID, false)"
                      />
                    </v-dialog>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-container>
</template>
<script>
import { ref, computed, inject, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import AddInvestment from '@/components/TAL/AddInvestment'
import ActionPopUp from '@/components/ActionPopUp'
import MMLInvestment from '@/components/TAL/MMLInvestment'
export default {
  components: {
    AddInvestment,
    ActionPopUp,
    MMLInvestment
  },
  props: ['CreateNewInvestment'],
  setup(props) {
    const display = useDisplay()
    const theme = useTheme()
    const instance = getCurrentInstance()
    const eventBus = inject('eventBus')
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const $toast = instance.appContext.config.globalProperties.$toast
    const proposedFund = ref(null)
    const fundDialog = ref(false)
    const fundName = ref('')
    const fundDescription = ref('')
    const planProposalID = ref(0)
    const valid = ref(false)
    const currentFundHeaderList = ref([
      {
        title: 'Name',
        value: 'Name',
        sortable: true,
        align: 'left',
        width: '30%'
      },
      {
        title: 'Description',
        value: 'Description',
        sortable: true,
        align: 'left',
        width: '40%'
      },
      {
        title: 'Create Copy',
        value: 'copy',
        sortable: false,
        width: '15%',
        align: 'center'
      },
      {
        title: 'Action',
        value: '',
        sortable: false,
        width: '15%',
        align: 'center'
      }
    ])
    const options = ref({
      itemsPerPage: 50,
      sortBy: ['Name']
    })
    const currentFundList = ref([])
    const fundInvestmentList = ref([])
    const hover = ref(false)
    const modelfunderror = ref(false)
    const modelFundMsg = ref('')
    const fundID = ref(0)
    const snackBar = ref(false)
    const isLoading = ref(true)
    const deletePopUp = ref({})
    const fundEditable = ref(false)
    const showSSO = ref(false)
    const getReliusProfession = () => {
      $axios.get(`/api/v1/advisor/reliusprofession`).then((success) => {
        var reliusProfession = success.data.d !== null ? success.data.d : ''
        showSSO.value = reliusProfession === 'Rep As PM' ? true : false
      })
    }
    const resetFund = () => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        eventBus.emit('resetInvestment', true)
        fundDialog.value = false
        document.getElementById('fundModel').scrollTop = 0
      } else {
        fundName.value = ''
        fundID.value = 0
        fundDescription.value = ''
        fundInvestmentList.value = []
        fundDialog.value = false
        modelFundMsg.value = ''
        snackBar.value = false
        modelfunderror.value = false
        document.getElementById('fundModel').scrollTop = 0
      }
    }
    const showFundDialog = () => {
      fundDialog.value = true
      fundEditable.value = false
      document.getElementById('fundModel').scrollTop = 0
    }
    const getPlanFunds = () => {
      $axios
        .get(`/api/v1/tal/proposal/${planProposalID.value}/funds`)
        .then((success) => {
          isLoading.value = false
          if (success.data.d !== null) {
            currentFundList.value = success.data.d.length > 0 ? success.data.d : []
          }
        })
        .catch(() => {
          isLoading.value = false
        })
    }
    const editFund = (fundItem) => {
      if (fundItem !== undefined && fundItem.ListID !== 0) {
        fundDialog.value = false
        fundEditable.value = fundItem.HideDelete === 0 ? false : true
        document.getElementById('fundModel').scrollTop = 0
        if (
          $authz.allowedByProgram(
            $authz.programPermissionSet.PCS_Aspire_Product__c,
            $authz.pcsAspireProduct.Multi_Strategist_Product
          )
        ) {
          eventBus.emit('editMMLFees', fundItem)
          fundDialog.value = true
        } else {
          resetFund()
          $axios.get(`/api/v1/tal/fund/${fundItem.ListID}`).then((success) => {
            if (success.data.d !== null) {
              fundInvestmentList.value = success.data.d
              if (fundInvestmentList.value.length > 0) {
                fundInvestmentList.value.forEach((element, index) => {
                  element.index = index + 1
                  element.mgmt = element.mgmt * 100
                  element.tload = element.tload * 100
                  element.SubTA = element.SubTA * 100
                  element.expratio = element.expratio * 100
                  element.Total = element.Total * 100
                })
              }
              fundName.value = fundItem.Name
              fundDescription.value = fundItem.Description
              fundDialog.value = true
              fundID.value = fundItem.ListID
              modelfunderror.value = false
            }
          })
        }
      }
    }
    const saveFundInvestment = () => {
      if (
        $authz.allowedByProgram(
          $authz.programPermissionSet.PCS_Aspire_Product__c,
          $authz.pcsAspireProduct.Multi_Strategist_Product
        )
      ) {
        if (proposedFund.value) {
          valid.value = proposedFund.value.valid
          if (valid.value) document.getElementById('fundModel').scrollTop = 0
        }
        eventBus.emit('saveInvestment', true)
      } else {
        if (fundName.value === '') {
          modelfunderror.value = true
          modelFundMsg.value = 'Name of Investment List is required'
          return
        }
        if (fundInvestmentList.value.length > 0) {
          fundInvestmentList.value.sort(function (a, b) {
            return b.index - a.index
          })
        }
        var investList = fundInvestmentList.value.map((rec) => {
          return {
            Id: rec.ID === undefined ? 0 : rec.ID,
            Type: rec.Type,
            Ticker: rec.Ticker,
            Name: rec.Name,
            Amount: 1,
            Code: rec.Code,
            Taxable: rec.Taxable === undefined ? false : rec.Taxable
          }
        })
        var fundInvestment = {
          Id: fundID.value,
          Name: fundName.value,
          Description: fundDescription.value,
          Investments: investList
        }
        if (fundInvestment.Name !== '') {
          $axios.put(`/api/v1/tal/fund`, fundInvestment).then((success) => {
            if (success.data.d != null) {
              resetFund()
              getPlanFunds()
              $toast.success('Investments Saved Successfully', '')
              document.getElementById('fundModel').scrollTop = 0
            }
          })
        }
      }
    }
    const copyInvestment = (fundItem) => {
      $axios
        .post(`/api/v1/tal/fund/${fundItem.ListID}/copy`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          getPlanFunds()
        })
    }
    const deleteInvestment = (fundItem) => {
      currentFundList.value.splice(currentFundList.value.indexOf(fundItem.ListID), 1)
      $axios
        .delete(`/api/v1/tal/fund/delete/${fundItem.ListID}`)
        // eslint-disable-next-line no-unused-vars
        .then((success) => {
          getPlanFunds()
        })
    }
    const removeValidation = () => {
      if (fundName.value !== '') {
        modelfunderror.value = false
        modelFundMsg.value = ''
      } else {
        modelfunderror.value = true
        modelFundMsg.value = 'Name is required'
      }
    }
    const currentFundHeaders = computed(() => {
      var list = currentFundHeaderList.value
      if (!$authz.hasPermission($authz.permissionSet.Investment_Lineup__c, $authz.permission.Full)) {
        var allinOne = list.findIndex((a) => a.text === 'Create Copy')
        if (allinOne > -1) list.splice(allinOne, 1)
      }
      return list
    })
    const advisorContactId = computed(() => {
      if ($store.state.user.selectedProgram) {
        return $store.state.user.selectedProgram.advisor_Phone_Number__c
      }
      return ''
    })
    onMounted(() => {
      if (props.CreateNewInvestment) fundDialog.value = true
      getReliusProfession()
      getPlanFunds()
      eventBus.on('getFundsList', () => {
        fundDialog.value = false
        getPlanFunds()
      })
      eventBus.on('closeDialog', (data) => {
        fundDialog.value = data
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('getFundsList')
    })
    return {
      display,
      theme,
      $authz,
      fundEditable,
      advisorContactId,
      fundName,
      modelfunderror,
      modelFundMsg,
      fundDescription,
      fundInvestmentList,
      planProposalID,
      fundDialog,
      fundID,
      valid,
      currentFundHeaders,
      currentFundList,
      isLoading,
      options,
      deletePopUp,
      hover,
      proposedFund,
      showFundDialog,
      resetFund,
      removeValidation,
      saveFundInvestment,
      editFund,
      copyInvestment,
      deleteInvestment
    }
  }
}
</script>
