<template>
  <v-layout>
    <v-col class="pt-2 pa--" cols="12">
      <Loader v-model="presenterLoading" :loading="presenterLoading" />
      <v-col class="pa-0" cols="12" v-if="reports === 'Proposal'">
        <h2 class="pb-2 font-weight-medium text-accent">Plan Information</h2>
      </v-col>
      <v-col class="pa-0" cols="12" v-if="reports === 'RPEA'">
        <h2 class="pb-3 font-weight-medium">Plan Information</h2>
        <div>
          <v-form ref="planInfo" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="6" sm="6" xs="11" class="pa-0" :class="display.smAndUp.value ? 'pr-4' : ''">
                <v-text-field
                  v-model="presenterFormList.totalAssets"
                  v-input-mask="{
                    alias: 'currency',
                    rightAlign: false,
                    autoUnmask: true,
                    allowMinus: false,
                    digitsOptional: true,
                    placeholder: '0'
                  }"
                  label="Total Assets"
                  prefix="$"
                  maxlength="21"
                  required
                  :error="assetsError"
                  :error-messages="assetsErrorMsg"
                  :rules="[(v) => !!v || 'Total Assets is required', (v) => (v && v > 0) || 'Value should be greater than zero']"
                />
              </v-col>
              <v-col
                cols="12"
                xl="4"
                lg="4"
                class="pa-0"
                :md="undoAsset ? '5' : '6'"
                :sm="undoAsset ? '5' : '6'"
                :xs="undoAsset ? '10' : '11'"
              >
                <v-text-field
                  v-model="presenterFormList.assetsAsofDate"
                  v-input-mask="{
                    alias: 'datetime',
                    inputFormat: 'mm/dd/yyyy',
                    showMaskOnHover: false
                  }"
                  label="As of Date"
                  required
                  :rules="[(v) => !!v || 'As of Date is required']"
                  :error="assetsasOfDateError"
                  :error-messages="assetsasOfDateErrorMsg"
                  @blur="checkDate(presenterFormList.assetsAsofDate, 'asset')"
                  @update:model-value="dateTotalAsset = parseDate(presenterFormList.assetsAsofDate, 'assetAsOfDate')"
                  append-inner-icon="event"
                >
                  <template #append-inner>
                    <v-btn icon variant="flat" style="height: 36px; width: 36px">
                      <v-icon> mdi-calendar </v-icon>
                      <v-menu activator="parent">
                        <v-date-picker
                          v-model="dateTotalAsset"
                          :min="yeDisplay.toJSON()"
                          color="accent"
                          width="368px"
                          @update:modalValue="assetAsOfDateMenu = false"
                        />
                      </v-menu>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col v-show="undoAsset" cols="1" xl="1" lg="1" md="1" sm="1" class="cursor-pointer pa-0" @click="deleteAsset">
                <v-btn color="accent" icon variant="text">
                  <v-icon size="small"> fas fa-undo </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="6" sm="6" xs="11" :class="display.smAndUp.value ? 'pr-4' : ''">
                <v-text-field
                  v-model="presenterFormList.participantBalance"
                  v-input-mask="{
                    alias: 'numeric',
                    digits: '0',
                    rightAlign: false,
                    placeholder: '',
                    allowMinus: false
                  }"
                  label="Participants with a Balance"
                  required
                  :error="participantError"
                  :error-messages="participantErrorMsg"
                  :rules="[
                    (v) => !!v || 'Participants with a Balance is required',
                    (v) => (v && v > 0) || 'Value should be greater than zero'
                  ]"
                />
              </v-col>
              <v-col
                cols="12"
                xl="4"
                lg="4"
                :md="undoAsset ? '5' : '6'"
                :sm="undoAsset ? '5' : '6'"
                :xs="undoAsset ? '10' : '11'"
              >
                <v-text-field
                  v-model="presenterFormList.participantBalanceAsofDate"
                  v-input-mask="{
                    alias: 'datetime',
                    inputFormat: 'mm/dd/yyyy',
                    showMaskOnHover: false
                  }"
                  label="As of Date"
                  required
                  :rules="[(v) => !!v || 'As of Date is required']"
                  :error="partasOfDateError"
                  :error-messages="partasOfDateErrorMsg"
                  @blur="checkDate(presenterFormList.participantBalanceAsofDate, 'participant')"
                  @update:model-value="
                    dateParticipant = parseDate(presenterFormList.participantBalanceAsofDate, 'participantBalanceAsofDate')
                  "
                  append-inner-icon="event"
                  v-bind="props"
                >
                  <template #append-inner>
                    <v-btn icon variant="flat" style="height: 36px; width: 36px">
                      <v-icon> mdi-calendar </v-icon>
                      <v-menu activator="parent">
                        <v-date-picker
                          v-model="dateParticipant"
                          :min="yeDisplay.toJSON()"
                          color="accent"
                          @update:modalValue="participantAsOfDate = false"
                          width="368px"
                        />
                      </v-menu>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                v-show="undoParticipant"
                cols="1"
                xl="1"
                lg="1"
                md="1"
                sm="1"
                class="cursor-pointer"
                @click="deleteParticipant"
              >
                <v-btn :color="theme.dark ? '' : 'accent'" icon variant="text">
                  <v-icon size="small"> fas fa-undo </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="6" sm="6" :class="display.smAndUp.value ? 'pr-4' : ''">
                <v-select
                  v-model="presenterFormList.planYearEnd"
                  label="Plan Year End"
                  :items="planYearEndList"
                  clearable
                  variant="outlined"
                  density="compact"
                  append-icon="icon-chevron-down"
                />
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div class="pt-2 pb-3">
          <h2 class="font-weight-medium">Presenter</h2>
        </div>
      </v-col>
      <v-col class="pa-0" cols="12">
        <v-radio-group v-model="presenterMode" inline class="mt-0 pt-0">
          <v-radio color="accent" label="Current Presenter" value="currentPresenter" />
          <v-radio color="accent" label="Add New Presenter" value="addPresenter" />
        </v-radio-group>
        <div v-show="!presenterForm && !presenterDetailForm">
          <div class="pr-2">
            <v-row>
              <v-col cols="12" xl="8" lg="8" sm="8" xs="12" md="8" class="pa-0">
                <v-autocomplete
                  v-model="presenterFormList.presenter"
                  :items="presenterList"
                  label="Select Presenter"
                  :menu-props="{ overflowY: true }"
                  item-title="text"
                  item-value="value"
                  :clearable="presenterFormList.presenter ? true : false"
                  auto-select-first
                  @click:clear="(presenterFormList.presenter = ''), clearStartEdit()"
                />
              </v-col>
              <v-col
                v-if="reports === 'Proposal' && presenterFormList.presenter"
                cols="4"
                xl="4"
                lg="4"
                md="4"
                sm="4"
                class="pl-2 pt-4 pa-0"
              >
                <span
                  :class="theme.dark ? '' : 'text-accent'"
                  class="cursor-pointer text-decoration-underline"
                  @click="editPresenter()"
                >
                  <b>Edit</b>
                </span>
              </v-col>
              <v-col cols="12" class="pa-0" v-show="reports === 'Proposal'">
                <v-row>
                  <v-col cols="4" xl="4" lg="4" md="4" sm="4" xs="4" class="pa-0">
                    <v-col cols="12" :xs="display.xs.value ? '12' : '11'" class="pa-0">
                      <v-text-field
                        v-model="presenterFormList.presentationDate"
                        v-input-mask="{
                          alias: 'datetime',
                          inputFormat: 'mm/dd/yyyy',
                          showMaskOnHover: false
                        }"
                        label="Presentation Date"
                        persistent-hint
                        :error-messages="presentationDateErrorMsg"
                        :error="presentationDateError"
                        @update:model-value="datePresentation = parseDate(presenterFormList.presentationDate, 'presentationDate')"
                        @change="checkDate(presenterFormList.presentationDate, 'presented')"
                        append-inner-icon="event"
                      >
                        <template #append-inner>
                          <v-btn icon variant="flat" style="height: 36px; width: 36px">
                            <v-icon> mdi-calendar </v-icon>
                            <v-menu activator="parent">
                              <v-date-picker
                                v-model="datePresentation"
                                :min="currentDate"
                                color="accent"
                                width="368px"
                                @update:modalValue="presentationDateMenu = false"
                              />
                            </v-menu>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-col>
                  <v-col cols="4" xl="4" lg="4" md="4" sm="4" xs="4" :class="display.xs.value ? 'pb-5' : 'pt-0'">
                    <v-switch
                      v-model="presenterFormList.hidePresentation"
                      label="Hide Presentation Date"
                      class="offsetSwitch ma-0"
                      color="accent"
                      hide-details
                    />
                  </v-col>
                </v-row>
                <v-col cols="4" xl="4" lg="4" md="4" sm="4" xs="4" class="pa-0">
                  <v-col :xs="display.xs.value ? '12' : '11'" class="pa-0">
                    <v-text-field
                      v-model="presenterFormList.anticipatedCloseDate"
                      v-input-mask="{
                        alias: 'datetime',
                        inputFormat: 'mm/dd/yyyy',
                        showMaskOnHover: false
                      }"
                      label="Anticipated Close Date"
                      persistent-hint
                      :error="anticipatedDateError"
                      :error-messages="anticipatedDateErrorMsg"
                      @update:model-value="
                        dateAnticipate = parseDate(presenterFormList.anticipatedCloseDate, 'anticipatedCloseDate')
                      "
                      @change="checkDate(presenterFormList.anticipatedCloseDate, 'anticipation')"
                      append-inner-icon="event"
                    >
                      <template #append-inner>
                        <v-btn icon variant="flat" style="height: 36px; width: 36px">
                          <v-icon> mdi-calendar </v-icon>
                          <v-menu activator="parent">
                            <v-date-picker
                              v-model="dateAnticipate"
                              :min="currentDate"
                              color="accent"
                              width="368px"
                              @input="anticipatedCloseDateMenu = false"
                            />
                          </v-menu>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-col>
              </v-col>
              <v-col cols="12" class="pa-0" v-show="reports === 'Proposal'">
                <PlanOptions
                  ref="planOptions"
                  :proposal-plan-list="proposalPlan"
                  :selected-plan="selectedPlan"
                  :esp-type="espType"
                  :report="reports"
                />
              </v-col>
            </v-row>
          </div>
        </div>
        <v-form
          v-if="presenterForm"
          ref="presenterForm"
          v-model="valid"
          class="pb-2"
          :lazy-validation="lazy"
          @submit.prevent="null"
        >
          <div>
            <v-col cols="3" xl="3" lg="3" md="3" sm="3" xs="3" class="pa-0">
              <h3 class="pb-3 font-weight-medium">Select Presenter Type</h3>
              <v-select
                v-model="newPresenter"
                :items="newPresenterOptions"
                label="Presenter Type"
                :menu-props="{ overflowY: true }"
                item-title="text"
                item-value="value"
                :clearable="newPresenter ? true : false"
                auto-select-first
                @update:model-value="showPresenterOptions()"
              />
            </v-col>
            <div v-if="showPresenterAndPrimaryAdvisor">
              <div class="pb-2 pt-1">
                <h4>Enter the presenting advisor's CRD# to include their information on report</h4>
              </div>
              <v-row>
                <v-col cols="12" xl="6" lg="6" md="8" sm="6" xs="9" class="pr-2 pa-0">
                  <v-text-field
                    ref="crd"
                    v-model="crdNo"
                    v-input-mask="{
                      alias: 'numeric',
                      digits: '0',
                      rightAlign: false,
                      placeholder: '',
                      allowMinus: false
                    }"
                    label="Enter CRD#"
                    :error="error"
                    :error-messages="CrdMessage"
                    @blur="removeValidation()"
                  >
                    <v-btn color="accent" class="ml-0" size="small" :disabled="!valid" @click="getPresenter()">
                      <v-icon color="secondary"> arrow_forward_ios </v-icon>
                    </v-btn>
                  </v-text-field>
                </v-col>
                <v-col cols="12" xl="6" lg="6" sm="3" md="4" class="pa-0">
                  <v-btn color="accent" class="ml-0 mt-0" :disabled="!valid" @click="getPresenter()">
                    <v-icon color="secondary--text"> arrow_forward_ios </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-col cols="12" xl="5" lg="5" md="5" sm="12" class="pt-2 pa-0">
                <div>
                  <a :href="lookUpCredUrl" target="_blank" underline class="text-decoration-underline pad-2 text-accent">
                    <b>Look up the CRD#</b>
                  </a>
                </div>
              </v-col>
            </div>
          </div>
        </v-form>

        <div>
          <v-form ref="presenterAddForm" v-model="validAdd">
            <v-row v-if="presenterDetailForm">
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" xs="12" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.name"
                  label="Name *"
                  :rules="[(v) => !!v || 'Name is required']"
                  required
                  @blur="change()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.firm"
                  variant="outlined"
                  density="compact"
                  label="Firm"
                  @blur="change()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.address1"
                  variant="outlined"
                  density="compact"
                  label="Address 1"
                  @blur="change()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.address2"
                  variant="outlined"
                  density="compact"
                  label="Address 2"
                  @blur="change()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" xs="12" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.phone"
                  v-input-mask="{
                    mask: '(999) 999-9999',
                    showMaskOnHover: false,
                    rightAlign: false,
                    placeholder: '',
                    allowMinus: false,
                    allowPlus: true
                  }"
                  label="Phone"
                  @blur="change()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" xs="12" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.email"
                  label="Email"
                  :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
                  @blur="change()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" xs="12" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.zip"
                  v-input-mask="{
                    mask: '99999',
                    rightAlign: false,
                    placeholder: '',
                    allowMinus: false
                  }"
                  label="Zip"
                  maxlength="5"
                  :error="zipcodeError"
                  :error-messages="zipcodeErrorMsg"
                  @blur="change()"
                  @change="getAddress()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" class="pr-2 pa-0">
                <v-text-field
                  v-model="presenterFormList.city"
                  variant="outlined"
                  density="compact"
                  label="City"
                  @blur="change()"
                />
              </v-col>
              <v-col cols="12" xl="3" lg="4" md="4" sm="6" xs="12" class="pr-2 pa-0">
                <v-select
                  v-model="presenterFormList.state"
                  placeholder="State"
                  :items="stateList"
                  hide-details
                  return-object
                  @blur="change()"
                />
              </v-col>
              <div>
                <v-row no-gutters>
                  <div>
                    <v-btn color="accent" :disabled="!validAdd" class="text-secondary" size="small" @click="SavePresenter()">
                      Add Presenter
                    </v-btn>
                  </div>
                </v-row>
              </div>
            </v-row>
          </v-form>
        </div>
      </v-col>
      <v-snackbar v-model="PresenterSuccessBar" top="top">
        {{ presenterMessage }}
        <v-btn variant="text" color="red" @click="PresenterSuccessBar = false"> Close </v-btn>
      </v-snackbar>
    </v-col>
  </v-layout>
</template>

<script>
import { ref, getCurrentInstance, onMounted, watch, inject } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import Loader from '@/components/Loader'
import PlanOptions from '@/components/TAL/Proposal/PlanOptions'
import planfinderlist from '@/assets/planfinder.json'
export default {
  components: {
    Loader,
    PlanOptions
  },
  props: [
    'selectedPlan',
    'planId',
    'parentReset',
    'reports',
    'proposalPlan',
    'saveProposalPresenterMethod',
    'presenterEdit',
    'espType'
  ],
  setup(props, { emit }) {
    const theme = useTheme()
    const eventBus = inject('eventBus')
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $toast = instance.appContext.config.globalProperties.$toast
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const crd = ref(null)
    const planOptions = ref(null)
    const planInfo = ref(null)
    const presenterAddForm = ref(null)
    const presenterFormList = ref({
      name: '',
      firm: '',
      firmCRD: 0,
      recordTypeId: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      aboutUs: '',
      discription: '',
      presenter: '',
      totalAssets: '',
      assetsAsofDate: formatDate(new Date().toISOString().substr(0, 10)),
      participantBalance: '',
      participantBalanceAsofDate: formatDate(new Date().toISOString().substr(0, 10)),
      presentationDate: null,
      anticipatedCloseDate: formatDate(new Date().toISOString().substr(0, 10)),
      hidePresentation: true,
      planYearEnd: ''
    })
    const oldpresenterFormList = ref({
      name: '',
      firm: '',
      firmCRD: 0,
      recordTypeId: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      aboutUs: '',
      discription: '',
      presenter: '',
      totalAssets: '',
      assetsAsofDate: formatDate(new Date().toISOString().substr(0, 10)),
      participantBalance: '',
      participantBalanceAsofDate: formatDate(new Date().toISOString().substr(0, 10)),
      presentationDate: null,
      anticipatedCloseDate: formatDate(new Date().toISOString().substr(0, 10)),
      hidePresentation: true,
      planYearEnd: ''
    })
    const count = ref(0)
    const newPresenter = ref('')
    const showPresenterAndPrimaryAdvisor = ref(false)
    const showPresenterOnly = ref(false)
    const newPresenterOptions = ref([
      { text: 'Presenter Only', value: 'presenterOnly' },
      {
        text: 'Presenter & Primary Advisor',
        value: 'presenterAndPrimaryAdvisor'
      }
    ])
    const panel = ref(true)
    const presenterForm = ref(false)
    const presenterList = ref([])
    const prese = ref(false)
    const presenter = ref('')
    const PresenterSuccessBar = ref(false)
    const presenterMessage = ref('')
    const CrdMessage = ref('')
    const presenterLoading = ref(false)
    const crdNo = ref('')
    const lazy = ref(false)
    const valid = ref(true)
    const crdRules = ref([])
    const error = ref(false)
    const presenterMode = ref('currentPresenter')
    const presenterDetailForm = ref(false)
    const lookUpCredUrl = ref('https://brokercheck.finra.org/')
    const presenterName = ref('')
    const totalAssets = ref('')
    const assetsAsofDate = ref(formatDate(new Date().toISOString().substr(0, 10)))
    const participantBalance = ref('')
    const participantBalanceAsofDate = ref(formatDate(new Date().toISOString().substr(0, 10)))
    const assetAsOfDateMenu = ref(false)
    const participantAsOfDate = ref(false)
    const presentationDateMenu = ref(false)
    const anticipatedCloseDateMenu = ref(false)
    const yeDisplay = ref(new Date(props.selectedPlan.YEDISPLAY.substring(0, 10)))
    const participantError = ref(false)
    const participantErrorMsg = ref('')
    const assetsErrorMsg = ref('')
    const assetsError = ref(false)
    const undoAsset = ref(false)
    const undoParticipant = ref(false)
    const partasOfDateError = ref(false)
    const partasOfDateErrorMsg = ref('')
    const assetsasOfDateError = ref(false)
    const assetsasOfDateErrorMsg = ref('')
    const numberValue1 = ref(0)
    const datePresentation = ref(null)
    const dateAnticipate = ref(null)
    const dateParticipant = ref(new Date().toISOString().substr(0, 10))
    const dateTotalAsset = ref(new Date().toISOString().substr(0, 10))
    const currentDate = ref(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10))
    const validAdd = ref(true)
    const advisorPlan = ref({})
    const assetSaved = ref(false)
    const editMode = ref(false)
    const manuallyAddPresenter = ref(false)
    const stepError = ref('')
    const presenters = ref([])
    const isPresentationDate = ref(false)
    const isAnticipatedDate = ref(false)
    const isAssetAsOfDate = ref(false)
    const isParticipantBalanceAsofDate = ref(false)
    const presentationDateError = ref(false)
    const presentationDateErrorMsg = ref('')
    const anticipatedDateError = ref(false)
    const anticipatedDateErrorMsg = ref('')
    const emailRegex = ref(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    )
    const planYearEndList = ref([
      { text: '01/31', value: '01/31' },
      { text: '02/28', value: '02/28' },
      { text: '03/31', value: '03/31' },
      { text: '04/30', value: '04/30' },
      { text: '05/31', value: '05/31' },
      { text: '06/30', value: '06/30' },
      { text: '07/31', value: '07/31' },
      { text: '08/31', value: '08/31' },
      { text: '09/30', value: '09/30' },
      { text: '10/31', value: '10/31' },
      { text: '11/30', value: '11/30' },
      { text: '12/31', value: '12/31' }
    ])
    const stateList = ref(planfinderlist.states)
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    function getPresenterList(val) {
      $axios.get(`/api/v1/tal/diagnostic/presenters`).then((success) => {
        if (success.data.d.length > 0) {
          presenters.value = success.data.d
          success.data.d.forEach((element) => {
            if (element.Name !== '') {
              element['text'] = element.Name !== '' ? element.Name + ' ' + '(' + element.CRD + ')' : ''
              element['value'] = element.ID
            }
          })
          presenterList.value = success.data.d.filter((a) => a.Name !== '')
        }
        if (val === 'load') {
          if (props.reports === 'RPEA') {
            resetPresenterObject()
            getAssetandParticipant(val)
          } else GetPresenterByPlanId(val)
        }
      })
    }
    function GetPresenterByPlanId(val, planId) {
      resetPresenterObject()
      let planIdValue = props.planId !== 0 ? props.planId : planId
      if (planIdValue !== 0) {
        $axios.get(`/api/v1/plan/${planIdValue}`).then((success) => {
          advisorPlan.value = success.data.d !== null ? success.data.d : {}
          if (props.reports !== 'Proposal') {
            presenterFormList.value.presenter = success.data.d !== null ? success.data.d.presentedByID : 0
            presenterFormList.value.planYearEnd =
              success.data.d !== null && success.data.d.yearend ? success.data.d.yearend : props.selectedPlan.YEDISPLAY
            if (presenterFormList.value.planYearEnd) {
              // eslint-disable-next-line no-unused-vars
              const [month, day, year] = presenterFormList.value.planYearEnd
                ? formatDate(presenterFormList.value.planYearEnd.substring(0, 10)).split('/')
                : ''
              var yearEndData = month + '/' + day
              presenterFormList.value.planYearEnd = yearEndData
            }
          } else {
            presenterFormList.value.presenter = props.proposalPlan.PresentedByID
          }
          if (val === 'load') {
            if (props.reports !== 'Proposal') {
              oldpresenterFormList.value.presenter = success.data.d !== null ? success.data.d.presentedByID : 0
            }
            assignPresenter(val)
          }
        })
      }
    }
    const updatePresenter = async () => {
      advisorPlan.value.PlanID = props.planId
      advisorPlan.value.AdvisorID = $store.state.user.id
      advisorPlan.value.PresentedByID = presenterFormList.value.presenter === undefined ? 0 : presenterFormList.value.presenter
      var current_date = new Date()
      var year = current_date.getFullYear()
      var planYearEndDate = presenterFormList.value.planYearEnd ? presenterFormList.value.planYearEnd + '/' + year : ''
      advisorPlan.value.YEAREND = planYearEndDate

      var success = await $axios.put(`/api/v1/diagnostic/advisor/presenter`, advisorPlan.value)
      if (success.data.d !== null) {
        oldpresenterFormList.value.presenter = presenterFormList.value.presenter
        oldpresenterFormList.value.planYearEnd = presenterFormList.value.planYearEnd
        if (props.reports !== 'RPEA') assignPresenter('Save')
      }
    }
    function showPresenterOptions() {
      if (newPresenter.value === 'presenterAndPrimaryAdvisor') {
        showPresenterAndPrimaryAdvisor.value = true
      } else {
        showPresenterAndPrimaryAdvisor.value = false
      }
      if (newPresenter.value === 'presenterOnly') {
        crdNo.value = ''
        presenterFormList.value.name = ''
        presenterFormList.value.firm = ''
        presenterFormList.value.firmCRD = 0
        presenterFormList.value.address1 = ''
        presenterFormList.value.address2 = ''
        presenterFormList.value.city = ''
        presenterFormList.value.state = ''
        presenterFormList.value.zip = ''
        presenterFormList.value.phone = ''
        presenterFormList.value.email = ''
        presenterDetailForm.value = true
        showPresenterOnly.value = true
      } else {
        showPresenterOnly.value = false
        presenterDetailForm.value = false
      }
    }
    function removeValidation() {
      error.value = false
      CrdMessage.value = ''
    }
    function clearPresenterDetail() {
      presenterFormList.value.name = ''
      presenterFormList.value.firm = ''
      presenterFormList.value.firmCRD = 0
      presenterFormList.value.address1 = ''
      presenterFormList.value.address2 = ''
      presenterFormList.value.city = ''
      presenterFormList.value.state = ''
      presenterFormList.value.zip = ''
      presenterFormList.value.phone = ''
      presenterFormList.value.email = ''
    }
    function getPresenter() {
      if (crdNo.value) {
        $axios.get(`/api/v1/tal/diagnostic/Presenter/${crdNo.value}`).then((success) => {
          var presenterData = success.data.d
          if (presenterData != null) {
            presenterFormList.value.name = presenterData.Name
            presenterFormList.value.firm = presenterData.Firm ? presenterData.Firm : ''
            presenterFormList.value.firmCRD = presenterData.FirmCRD ? presenterData.FirmCRD : 0
            presenterFormList.value.recordTypeId = presenterData.RecordTypeId ? presenterData.RecordTypeId : ''
            presenterFormList.value.address1 = presenterData.Address1 ? presenterData.Address1 : ''
            presenterFormList.value.address2 = presenterData.Address2 ? presenterData.Address2 : ''
            presenterFormList.value.city = presenterData.City ? presenterData.City : ''
            presenterFormList.value.state = presenterData.State ? presenterData.State : ''
            presenterFormList.value.zip = presenterData.Zip ? presenterData.Zip : ''
            presenterFormList.value.phone = presenterData.Phone ? presenterData.Phone : ''
            presenterFormList.value.email = presenterData.Email ? presenterData.Email : ''
            presenterDetailForm.value = true
            presenterForm.value = true
            showPresenterAndPrimaryAdvisor.value = true
          } else {
            error.value = false
            CrdMessage.value = 'You must enter a valid CRD# to continue.'
            crdNo.value = ''
            crd.value.focus()
          }
        })
      } else {
        error.value = false
        CrdMessage.value = 'You must enter a valid CRD# to continue.'
        crdNo.value = ''
        crd.value.focus()
      }
    }
    function change() {
      presenterFormList.value.discription =
        presenterFormList.value.name +
        '\n ' +
        presenterFormList.value.firm +
        '\n ' +
        presenterFormList.value.address1 +
        '\n ' +
        presenterFormList.value.address2 +
        '\n ' +
        presenterForm.value.city +
        ', ' +
        presenterFormList.value.state +
        ' ' +
        presenterFormList.value.zip +
        '\n ' +
        presenterFormList.value.phone +
        '\n ' +
        presenterFormList.value.email
    }
    function resetPresenterForm() {
      presenterFormList.value.name = ''
      presenterFormList.value.firm = ''
      presenterFormList.value.firmCRD = 0
      presenterFormList.value.address1 = ''
      presenterFormList.value.address2 = ''
      presenterForm.value.city = ''
      presenterFormList.value.state = ''
      presenterFormList.value.zip = ''
      presenterFormList.value.phone = ''
      presenterFormList.value.email = ''
    }
    const SavePresenter = async () => {
      if (presenterFormList.value.name) {
        var presentedBy = ''
        presentedBy += presenterFormList.value.name + '\n'
        if (presenterFormList.value.firm) presentedBy += presenterFormList.value.firm + '\n'
        if (presenterFormList.value.address1) presentedBy += presenterFormList.value.address1 + '\n'
        if (presenterFormList.value.address2 !== '' && presenterFormList.value.address2 !== undefined)
          presentedBy += presenterFormList.value.address2 + '\n'
        if (presenterFormList.value.city) presentedBy += presenterFormList.value.city + ', '
        if (presenterFormList.value.state) presentedBy += presenterFormList.value.state.value + '\n'
        if (presenterFormList.value.zip) presentedBy += presenterFormList.value.zip + '\n'
        if (presenterFormList.value.phone) presentedBy += presenterFormList.value.phone + '\n'
        if (presenterFormList.value.email) presentedBy += presenterFormList.value.email

        var savePresenterRequest = {
          Name: presenterFormList.value.name,
          Firm: presenterFormList.value.firm,
          FirmCRD: presenterFormList.value.firmCRD ? presenterFormList.value.firmCRD : 0,
          RecordTypeId: presenterFormList.value.recordTypeId,
          Address1: presenterFormList.value.address1,
          Address2: presenterFormList.value.address2,
          City: presenterFormList.value.city,
          State: presenterFormList.value.state.value ? presenterFormList.value.state.value : '',
          Zip: presenterFormList.value.zip,
          Phone: presenterFormList.value.phone,
          Email: presenterFormList.value.email,
          Description: presenterFormList.value.name,
          PresentedBy: presentedBy,
          AboutUs: '',
          AboutInfo: '',
          CRDNumber: crdNo.value === '' ? 0 : crdNo.value,
          ID: editMode.value ? presenterFormList.value.presenter : 0
        }
        var success = await $axios.put(`/api/v1/tal/diagnostic/presenter`, savePresenterRequest)
        if (success.data.d != null) {
          if (crdNo.value > 0) $axios.post(`/api/v1/sfdc/contact`, savePresenterRequest)
          presenterMessage.value = 'Saved Successfully'
          presenterName.value = presenterFormList.value.name
          getPresenterList()
          resetForm()
          ResetPresenter()
          presenterMode.value = 'currentPresenter'
          presenterFormList.value.presenter = success.data.d.id
          presenterLoading.value = false
        } else {
          $toast?.destroy()
          $toast.error(success.data.message, '')
        }
        return true
      }
    }
    function resetForm() {
      presenterFormList.value.name = ''
      presenterFormList.value.firm = ''
      presenterFormList.value.address1 = ''
      presenterFormList.value.address2 = ''
      presenterFormList.value.city = ''
      presenterFormList.value.state = ''
      presenterFormList.value.zip = ''
      presenterFormList.value.phone = ''
      presenterFormList.value.email = ''
      presenterFormList.value.aboutUs = ''
      presenterFormList.value.discription = ''
      crdNo.value = ''
      editMode.value = false
    }
    function formatString(value, dec, type) {
      dec = dec || 0
      if (value === null) {
        return 0
      }
      switch (type) {
        case 'currency': {
          return (
            '' +
            Number(value)
              .toFixed(dec)
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
          )
        }
      }
    }
    function CheckPresenter() {
      presenterDetailForm.value = true
      presenterForm.value = false
    }
    function ResetPresenter() {
      presenterForm.value = false
      presenterDetailForm.value = false
      presenterMode.value = 'addPresenter'
      resetForm()
    }
    function backPresenter() {
      presenterForm.value = false
      presenterDetailForm.value = false
      presenterMode.value = 'currentPresenter'
      newPresenter.value = ''
      resetForm()
    }
    function assignPresenter(val) {
      presenterForm.value = false
      presenterDetailForm.value = false
      presenterMode.value = 'currentPresenter'
      var presenterObject = {
        Name: '',
        anticipatedCloseDate: '',
        presentationDate: '',
        administrator: ''
      }
      if (val === 'Save' || val === 'load') {
        if (presenterFormList.value.presenter === '' || (presenterFormList.value.presenter === undefined && val === 'Save')) {
          presenterObject.Name = props.reports === 'Diagnostic' ? '' : 'N/A'
        } else {
          if (presenterFormList.value.presenter) {
            if (presenterList.value.length > 0) {
              var presenterone = presenterList.value.find((a) => a.ID === presenterFormList.value.presenter)
              presenterObject.Name = presenterone ? presenterone.Name : ''
            } else presenterObject.Name = ''
          } else presenterObject.Name = ''
        }

        presenterObject.anticipatedCloseDate =
          presenterFormList.value.anticipatedCloseDate !== null ? presenterFormList.value.anticipatedCloseDate : ''
        presenterObject.presentationDate =
          presenterFormList.value.presentationDate !== null ? presenterFormList.value.presentationDate : ''
        if (planOptions.value) {
          presenterObject.administrator =
            planOptions.value.planOptionForm.professionalCapitalService === 'ProfessionalCapital' ? 'PCS Retirement' : 'Other'
        } else {
          presenterObject.administrator = 'PCS Retirement'
        }

        presenterObject.totalAsset = presenterFormList.value.totalAssets ? presenterFormList.value.totalAssets : ''

        presenterObject.asOfdate = presenterFormList.value.assetsAsofDate !== null ? presenterFormList.value.assetsAsofDate : ''

        presenterObject.participantBal = presenterFormList.value.participantBalance
          ? parseInt(presenterFormList.value.participantBalance, 10)
          : ''

        presenterObject.partAsOfDate =
          presenterFormList.value.participantBalanceAsofDate !== null ? presenterFormList.value.participantBalanceAsofDate : ''

        var currentYearEndData = presenterFormList.value.planYearEnd ? presenterFormList.value.planYearEnd : ''
        // eslint-disable-next-line no-unused-vars
        const [month, day, year] = currentYearEndData.split('/')
        var yearEndData = month + '/' + day
        presenterObject.planYearEnd = presenterFormList.value.planYearEnd ? yearEndData : ''
      }
      props.presenterEdit(presenterObject, val)
    }
    function addPresenterManually() {
      crdNo.value = ''
      presenterDetailForm.value = true
      presenterForm.value = false
      manuallyAddPresenter.value = true
    }
    function getAssetandParticipant(val, planid) {
      let planIdValue = props.planId !== 0 ? props.planId : planid
      if (planIdValue !== 0) {
        $axios.get(`/api/v1/rpea/plan/${planIdValue}/overrides`).then((success) => {
          if (success.data.d !== null) {
            if (success.data.d.length > 0) {
              var totalValue = success.data.d.find((x) => x.ColumnName === 'TOTASSETS')
              var participant = success.data.d.find((x) => x.ColumnName === 'PARTIC')
            }
            presenterFormList.value.totalAssets = totalValue !== undefined ? totalValue.ColumnValue : props.selectedPlan.TOTASSETS

            presenterFormList.value.assetsAsofDate =
              totalValue !== undefined
                ? formatDate(totalValue.AsOf.substring(0, 10))
                : formatDate(props.selectedPlan.YEDISPLAY.substring(0, 10))

            dateTotalAsset.value = parseDate(presenterFormList.value.assetsAsofDate)

            presenterFormList.value.participantBalance =
              participant !== undefined ? participant.ColumnValue : props.selectedPlan.PARTICACCT

            presenterFormList.value.participantBalanceAsofDate =
              participant !== undefined
                ? formatDate(participant.AsOf.substring(0, 10))
                : formatDate(props.selectedPlan.YEDISPLAY.substring(0, 10))

            dateParticipant.value = parseDate(presenterFormList.value.participantBalanceAsofDate)

            if (totalValue !== undefined) {
              var assetCompare = Number(totalValue.ColumnValue) === Number(props.selectedPlan.TOTASSETS)

              var assetsAsofDateCompare =
                new Date(totalValue.AsOf.substring(0, 10)).toLocaleDateString() ===
                new Date(props.selectedPlan.YEDISPLAY).toLocaleDateString()

              if (assetCompare && assetsAsofDateCompare) {
                undoAsset.value = false
              } else {
                undoAsset.value = true
              }
            } else {
              undoAsset.value = false
            }
            if (participant !== undefined) {
              var participantCompare = Number(participant.ColumnValue) === Number(props.selectedPlan.PARTICACCT)

              var participantofDateCompare =
                new Date(participant.AsOf.substring(0, 10)).toLocaleDateString() ===
                new Date(props.selectedPlan.YEDISPLAY).toLocaleDateString()
              if (participantCompare && participantofDateCompare) {
                undoParticipant.value = false
              } else {
                undoParticipant.value = true
              }
            } else {
              undoParticipant.value = false
            }
            assetSaved.value = true
          } else {
            assetSaved.value = false
            presenterFormList.value.totalAssets = props.selectedPlan.TOTASSETS !== null ? props.selectedPlan.TOTASSETS : 0
            presenterFormList.value.participantBalance =
              props.selectedPlan.PARTICACCT !== null ? props.selectedPlan.PARTICACCT : 0
            presenterFormList.value.assetsAsofDate = formatDate(props.selectedPlan.YEDISPLAY.substring(0, 10))
            presenterFormList.value.participantBalanceAsofDate = formatDate(props.selectedPlan.YEDISPLAY.substring(0, 10))
          }
          yeDisplay.value = new Date(props.selectedPlan.YEDISPLAY.substring(0, 10))
          eventBus.emit('updateProposedFee', presenterFormList.value.totalAssets, presenterFormList.value.participantBalance)
          oldpresenterFormList.value.totalAssets = presenterFormList.value.totalAssets
          oldpresenterFormList.value.assetsAsofDate = presenterFormList.value.assetsAsofDate
          oldpresenterFormList.value.participantBalance = presenterFormList.value.participantBalance
          oldpresenterFormList.value.participantBalanceAsofDate = presenterFormList.value.participantBalanceAsofDate
          if (val === 'load') GetPresenterByPlanId(val, planIdValue)
        })
      }
    }
    const saveAsset = async () => {
      var deletePromises = []
      var promises = []
      var total_Assets = presenterFormList.value.totalAssets
      var assets_AsofDate = presenterFormList.value.assetsAsofDate
      var participant_Balance = presenterFormList.value.participantBalance
      var participant_BalanceAsofDate = presenterFormList.value.participantBalanceAsofDate
      if (presenterFormList.value.totalAssets <= 0) {
        assetsError.value = true
        assetsErrorMsg.value = 'Value should be greater than zero'
      }
      if (presenterFormList.value.participantBalance <= 0) {
        participantError.value = true
        participantErrorMsg.value = 'Value should be greater than zero'
      }
      deletePromises.push($axios.delete(`/api/v1/rpea/plan/${props.planId}/override/TOTASSETS`))
      deletePromises.push($axios.delete(`/api/v1/rpea/plan/${props.planId}/override/PARTIC`))
      await Promise.all(deletePromises)
      promises.push($axios.put(`/api/v1/rpea/plan/${props.planId}/override/TOTASSETS/${total_Assets}?asOf=${assets_AsofDate}`))
      promises.push(
        $axios.put(`/api/v1/rpea/plan/${props.planId}/override/PARTIC/${participant_Balance}?asOf=${participant_BalanceAsofDate}`)
      )
      await Promise.all(promises)
      eventBus.emit('updateProposedFee', total_Assets, participant_Balance)

      var assetCompare = Number(total_Assets) === Number(props.selectedPlan.TOTASSETS)

      var assetsAsofDateCompare =
        new Date(assets_AsofDate.substring(0, 10)).toLocaleDateString() ===
        new Date(props.selectedPlan.YEDISPLAY).toLocaleDateString()

      if (assetCompare && assetsAsofDateCompare) {
        undoAsset.value = false
      } else {
        undoAsset.value = true
      }

      var participantCompare = Number(participant_Balance) === Number(props.selectedPlan.PARTICACCT)

      var participantofDateCompare =
        new Date(participant_BalanceAsofDate.substring(0, 10)).toLocaleDateString() ===
        new Date(props.selectedPlan.YEDISPLAY).toLocaleDateString()
      if (participantCompare && participantofDateCompare) {
        undoParticipant.value = false
      } else {
        undoParticipant.value = true
      }

      oldpresenterFormList.value.totalAssets = total_Assets
      oldpresenterFormList.value.assetsAsofDate = assets_AsofDate
      oldpresenterFormList.value.participantBalance = participant_Balance
      oldpresenterFormList.value.participantBalanceAsofDate = participant_BalanceAsofDate
      assignPresenter('Save')
    }
    function deleteAsset() {
      $axios.delete(`/api/v1/rpea/plan/${props.planId}/override/TOTASSETS`).then(() => {
        $axios.get(`/api/v1/tal/plan/${props.selectedPlan.SEINPNO}`).then((success) => {
          presenterFormList.value.totalAssets = success.data.d.TOTASSETS
          presenterFormList.value.assetsAsofDate = formatDate(success.data.d.YEDISPLAY.substring(0, 10))
          dateTotalAsset.value = parseDate(presenterFormList.value.assetsAsofDate)
          undoAsset.value = false
          assetsasOfDateError.value = false
          assetsasOfDateErrorMsg.value = ''
        })
      })
    }
    function deleteParticipant() {
      $axios.delete(`/api/v1/rpea/plan/${props.planId}/override/PARTIC`).then(() => {
        $axios.get(`/api/v1/tal/plan/${props.selectedPlan.SEINPNO}`).then((success) => {
          presenterFormList.value.participantBalance = success.data.d.PARTICACCT
          presenterFormList.value.participantBalanceAsofDate = formatDate(success.data.d.YEDISPLAY.substring(0, 10))
          dateParticipant.value = parseDate(presenterFormList.value.participantBalanceAsofDate)
          undoParticipant.value = false
          partasOfDateError.value = false
          partasOfDateErrorMsg.value = ''
        })
      })
    }
    const SavePresenterandPlan = async (val) => {
      if (props.reports === 'RPEA') {
        if (planInfo.value.validate()) {
          await updatePresenter()
          await saveAsset()
        }
      } else if (props.reports === 'Proposal') {
        saveProposalPresenters('Save', val)
      } else {
        updatePresenter()
      }
    }
    const saveProposalPresenters = async (val, callPlan) => {
      var proposalPlan = {}
      proposalPlan.PresentedByID = presenterFormList.value.presenter
      proposalPlan.Presentation = presenterFormList.value.presentationDate
      proposalPlan.Anticipated = presenterFormList.value.anticipatedCloseDate
      proposalPlan.PlanID = props.planId
      proposalPlan.SEINPNO = props.selectedPlan.SEINPNO
      proposalPlan.HidePresentation = presenterFormList.value.hidePresentation
      var presenterone = presenters.value.find((a) => a.ID === presenterFormList.value.presenter)
      if (presenterone) proposalPlan.PresentedBy = presenterone.PRESENTEDBY
      else proposalPlan.PresentedBy = $store.state.user.name
      if (planOptions.value) {
        var planOptionData = planOptions.value.SetPlanOptionsValue()
        if (planOptionData) {
          proposalPlan.ServiceType = planOptionData.ServiceType
          proposalPlan.AboutTPA = planOptionData.AboutTPA
          proposalPlan.AboutTPAName = planOptionData.AboutTPAName
          proposalPlan.AboutTPADescription = planOptionData.AboutTPADescription
          proposalPlan.TPA = planOptionData.TPA
          proposalPlan.SUB = planOptionData.SUB
          proposalPlan.TPAName = planOptionData.TPAName
          proposalPlan.AdminFiduciary = planOptionData.AdminFiduciary
          proposalPlan.ETF = planOptionData.ETF
          proposalPlan.OutsideAmount = planOptionData.OutsideAmount
          proposalPlan.OutsideType = planOptionData.OutsideType
          proposalPlan.StockAmount = planOptionData.StockAmount
          proposalPlan.Outside = planOptionData.Outside
          proposalPlan.Stock = planOptionData.Stock
          proposalPlan.Broker = planOptionData.Broker
          proposalPlan.SafeHarbor = planOptionData.SafeHarbor
          proposalPlan.MML = planOptionData.MML
        }
      }
      if (props.espType === $authz.firmRelationship.Pooled_Employer_Plan) {
        proposalPlan.ServiceType = 0
      }
      await $axios.put('/api/v1/tal/proposal/presenter', proposalPlan)
      props.saveProposalPresenterMethod(callPlan, proposalPlan)
      assignPresenter(val)
    }
    function loadProposalDetails(val) {
      presenterFormList.value.presenter = props.proposalPlan.PresentedByID
      presenterFormList.value.presentationDate = props.proposalPlan.Presentation
        ? formatDate(props.proposalPlan.Presentation.substring(0, 10))
        : props.proposalPlan.Presentation
      presenterFormList.value.anticipatedCloseDate = props.proposalPlan.Anticipated
        ? formatDate(props.proposalPlan.Anticipated.substring(0, 10))
        : props.proposalPlan.Anticipated
      datePresentation.value = parseDate(presenterFormList.value.presentationDate)
      dateAnticipate.value = parseDate(presenterFormList.value.anticipatedCloseDate)
      presenterFormList.value.hidePresentation = props.proposalPlan.HidePresentation
      oldpresenterFormList.value.presenter = presenterFormList.value.presenter
      oldpresenterFormList.value.presentationDate = presenterFormList.value.presentationDate
      oldpresenterFormList.value.anticipatedCloseDate = presenterFormList.value.anticipatedCloseDate
      oldpresenterFormList.value.hidePresentation = presenterFormList.value.hidePresentation
      if (val === 'load') assignPresenter('load')
    }
    function formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    function parseDate(date, value) {
      if (!date) return null
      if (!Date.parse(date)) {
        if (value === 'assetAsOfDate') isAssetAsOfDate.value = true
        if (value === 'participantBalanceAsofDate') isParticipantBalanceAsofDate.value = true
        if (value === 'presentationDate') isPresentationDate.value = true
        if (value === 'anticipatedCloseDate') isAnticipatedDate.value = true
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    function checkDate(val, from) {
      if (val) {
        if (!Date.parse(val)) {
          if (from === 'asset') {
            presenterFormList.value.assetsAsofDate = ''
            dateTotalAsset.value = new Date().toISOString().substr(0, 10)
            assetsasOfDateErrorMsg.value = 'Invalid date'
            assetsasOfDateError.value = true
          } else if (from === 'participant') {
            presenterFormList.value.participantBalanceAsofDate = ''
            dateParticipant.value = new Date().toISOString().substr(0, 10)
            partasOfDateErrorMsg.value = 'Invalid date'
            partasOfDateError.value = true
          } else if (from === 'presented') {
            presenterFormList.value.presentationDate = ''
            datePresentation.value = parseDate(presenterFormList.value.presentationDate)
            isPresentationDate.value = true
            presentationDateError.value = true
            presentationDateErrorMsg.value = 'Invalid Date'
          } else if (from === 'anticipation') {
            presenterFormList.value.anticipatedCloseDate = ''
            dateAnticipate.value = parseDate(presenterFormList.value.anticipatedCloseDate)
            isAnticipatedDate.value = true
            anticipatedDateError.value = true
            anticipatedDateErrorMsg.value = 'Invalid Date'
          }
        } else {
          var current_Date = new Date(new Date().toISOString()).toLocaleDateString()
          if (from === 'asset') {
            assetsasOfDateError.value = false
            assetsasOfDateErrorMsg.value = ''
          } else if (from === 'participant') {
            partasOfDateErrorMsg.value = ''
            partasOfDateError.value = false
          } else if (from === 'presented') {
            let presentationDate = new Date(new Date(val).toISOString()).toLocaleDateString()
            if (new Date(presentationDate) >= new Date(current_Date)) {
              presentationDateError.value = false
              presentationDateErrorMsg.value = ''
            } else {
              presenterFormList.value.presentationDate = ''
              datePresentation.value = parseDate(presenterFormList.value.presentationDate)
              isPresentationDate.value = true
              presentationDateError.value = true
              presentationDateErrorMsg.value = 'Date must not be in the past'
            }
          } else if (from === 'anticipation') {
            let anticipationDate = new Date(new Date(val).toISOString()).toLocaleDateString()
            if (new Date(anticipationDate) >= new Date(current_Date)) {
              anticipatedDateError.value = false
              anticipatedDateErrorMsg.value = ''
            } else {
              presenterFormList.value.anticipatedCloseDate = ''
              dateAnticipate.value = parseDate(presenterFormList.value.anticipatedCloseDate)
              isAnticipatedDate.value = true
              anticipatedDateError.value = true
              anticipatedDateErrorMsg.value = 'Date must not be in the past'
            }
          }
        }
      } else {
        if (from === 'asset') {
          assetsasOfDateErrorMsg.value = 'As of Date is required'
          assetsasOfDateError.value = true
        } else if (from === 'participant') {
          partasOfDateErrorMsg.value = 'As of Date is required'
          partasOfDateError.value = true
        }
      }
    }
    const checkDecimal = (model, $event) => {
      if (
        (event.which < 48 || event.which > 57) &&
        (event.which !== 46 || presenterFormList.value[model].indexOf('.') !== -1) &&
        event.which !== 13
      ) {
        $event.preventDefault()
      }
      if (
        presenterFormList.value[model] != null &&
        presenterFormList.value[model].indexOf('.') > -1 &&
        presenterFormList.value[model].split('.')[1].length > 1
      ) {
        $event.preventDefault()
      }
    }
    function loadPresenter(val, reports, planId) {
      if (reports === 'RPEA') {
        resetPresenterObject()
        getAssetandParticipant(val, planId)
      } else {
        GetPresenterByPlanId(val, planId)
      }
    }
    const editPresenter = () => {
      $axios.get(`/api/v1/tal/presenter/presentedby/${presenterFormList.value.presenter}`).then((success) => {
        if (success.data.d != null) {
          var presenterData = success.data.d
          presenterFormList.value.name = presenterData[0].Name
          presenterFormList.value.firm = presenterData[0].Firm
          presenterFormList.value.address1 = presenterData[0].Address1
          presenterFormList.value.address2 = presenterData[0].Address2
          presenterFormList.value.city = presenterData[0].City
          presenterFormList.value.state = presenterData[0].State
          presenterFormList.value.zip = presenterData[0].Zip
          presenterFormList.value.phone = presenterData[0].Phone
          presenterFormList.value.email = presenterData[0].Email
          crdNo.value = presenterData[0].CRDNumber
          presenterDetailForm.value = true
          presenterForm.value = false
          editMode.value = true
          resetPresenterObject()
        }
      })
    }
    function validatePresenter() {
      if (props.reports === 'Diagnostic') return presenterAddForm.value.validate()
      if (props.reports === 'RPEA') return planInfo.value.validate() && presenterAddForm.value.validate()
      if (props.reports === 'Proposal') {
        var tpaName = false
        var tpaDesc = false
        if (planOptions.value) {
          tpaName = planOptions.value.tpaNameError
          tpaDesc = planOptions.value.tpaDescriptionError
        }
        var validateTPA = presenterAddForm.value.validate()
        if (validateTPA) {
          if (!tpaName && !tpaDesc && !anticipatedDateError.value && !presentationDateErrorMsg.value) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }
    function presenterCompare() {
      var planoptioncompare = false
      if (planOptions.value && props.reports === 'Proposal') planoptioncompare = planOptions.value.planOptionCompare()
      if (!Object.compare(presenterFormList.value, oldpresenterFormList.value) || planoptioncompare) return true
      else return false
    }
    function abondonPresenterChanges() {
      Object.assign(presenterFormList.value, oldpresenterFormList.value)
      presenterMode.value = 'currentPresenter'
      presenterAddForm.value.reset()
      resetPresenterForm()
      if (props.reports === 'RPEA') {
        assetsError.value = false
        assetsErrorMsg.value = ''
        assetsasOfDateError.value = false
        assetsasOfDateErrorMsg.value = ''
        participantError.value = false
        participantErrorMsg.value = ''
        partasOfDateError.value = false
        partasOfDateErrorMsg.value = ''
      }
      if (props.reports === 'Proposal') {
        if (planOptions.value) {
          planOptions.value.abondonPlanOptions()
        }
        datePresentation.value = parseDate(presenterFormList.value.presentationDate)
        dateAnticipate.value = parseDate(presenterFormList.value.anticipatedCloseDate)
        anticipatedDateError.value = false
        anticipatedDateErrorMsg.value = ''
        presentationDateError.value = false
        presentationDateErrorMsg.value = ''
      }
    }
    function resetPresenterObject() {
      oldpresenterFormList.value.presenter = presenterFormList.value.presenter
      oldpresenterFormList.value.name = presenterFormList.value.name
      oldpresenterFormList.value.firm = presenterFormList.value.firm
      oldpresenterFormList.value.address1 = presenterFormList.value.address1
      oldpresenterFormList.value.address2 = presenterFormList.value.address2
      oldpresenterFormList.value.city = presenterFormList.value.city
      oldpresenterFormList.value.state = presenterFormList.value.state
      oldpresenterFormList.value.zip = presenterFormList.value.zip
      oldpresenterFormList.value.phone = presenterFormList.value.phone
      oldpresenterFormList.value.email = presenterFormList.value.email
      oldpresenterFormList.value.aboutUs = presenterFormList.value.aboutUs
      oldpresenterFormList.value.discription = presenterFormList.value.discription
    }
    function clearStartEdit() {
      if (props.reports === 'Diagnostic') emit('clearStartEdit')
    }
    function getAddress() {
      if (presenterFormList.value.zip) {
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode(
          {
            address: `zipcode: ${presenterFormList.value.zip}`
          },
          function (results, status) {
            if (status === 'OK') {
              if (results[0]) {
                var address = results[0].formatted_address.split(',')
                presenterFormList.value.city = address[0].length > 0 ? address[0].trim() : ''
                var stateCode = address[1].length > 0 ? address[1].replace(/\d+/, '').trim() : ''
                var stateName = ''
                if (stateCode) {
                  stateName = stateList.value.filter((a) => a.value === stateCode)
                }
                presenterFormList.value.state = stateName && stateName.length > 0 ? stateName[0] : ''
                zipcodeError.value = false
                zipcodeErrorMsg.value = ''
              } else {
                zipcodeError.value = false
                zipcodeErrorMsg.value = ''
              }
            } else {
              presenterFormList.value.city = ''
              presenterFormList.value.state = ''
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Invalid Zip Code'
            }
          }
        )
      } else {
        presenterFormList.value.city = ''
        presenterFormList.value.state = ''
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
      }
    }
    watch(
      () => datePresentation.value,
      () => {
        if (!isPresentationDate.value) {
          presenterFormList.value.presentationDate = formatDate(datePresentation.value)
        }
        isPresentationDate.value = false
      }
    )
    watch(
      () => dateAnticipate.value,
      () => {
        if (!isAnticipatedDate.value) {
          presenterFormList.value.anticipatedCloseDate = formatDate(dateAnticipate.value)
        }
        isAnticipatedDate.value = false
      }
    )
    watch(
      () => dateParticipant.value,
      () => {
        if (!isParticipantBalanceAsofDate.value) {
          presenterFormList.value.participantBalanceAsofDate = formatDate(dateParticipant.value)
        }
        isParticipantBalanceAsofDate.value = false
      }
    )
    watch(
      () => dateTotalAsset.value,
      () => {
        if (!isAssetAsOfDate.value) {
          presenterFormList.value.assetsAsofDate = formatDate(dateTotalAsset.value)
        }
        isAssetAsOfDate.value = false
      }
    )
    watch(
      () => assetAsOfDateMenu.value,
      (val) => {
        if (!val) {
          checkDate(presenterFormList.value.assetsAsofDate, 'asset')
        }
      }
    )
    watch(
      () => participantAsOfDate.value,
      (val) => {
        if (!val) {
          checkDate(presenterFormList.value.participantBalanceAsofDate, 'participant')
        }
      }
    )
    watch(
      () => anticipatedCloseDateMenu.value,
      (val) => {
        if (!val) {
          checkDate(presenterFormList.value.anticipatedCloseDate, 'anticipation')
        }
      }
    )
    watch(
      () => presentationDateMenu.value,
      (val) => {
        if (!val) {
          checkDate(presenterFormList.value.presentationDate, 'presented')
        }
      }
    )
    watch(
      () => presenterMode.value,
      (val) => {
        if (val === 'addPresenter') {
          presenterForm.value = true
          presenterDetailForm.value = false
          newPresenter.value = ''
          showPresenterAndPrimaryAdvisor.value = false
          removeValidation()
        } else {
          presenterForm.value = false
          presenterDetailForm.value = false
        }
      }
    )
    watch(
      () => props.parentReset,
      () => {
        resetForm()
        ResetPresenter()
        presenterMode.value = 'currentPresenter'
        presenter.value = ''
      }
    )
    watch(
      () => props.proposalPlan,
      (newval, oldval) => {
        if (newval !== oldval) {
          loadProposalDetails('load')
        }
      }
    )
    watch(
      () => props.planId,
      (val) => {
        if (val) {
          getPresenterList('load')
        }
      },
      { immediate: true, deep: true }
    )
    onMounted(() => {
      oldpresenterFormList.value = Object.assign({}, presenterFormList.value)
    })
    return {
      display,
      theme,
      crd,
      planOptions,
      planInfo,
      presenterAddForm,
      presenterLoading,
      presenterFormList,
      assetsError,
      assetsErrorMsg,
      undoAsset,
      assetAsOfDateMenu,
      assetsasOfDateError,
      assetsasOfDateErrorMsg,
      dateTotalAsset,
      yeDisplay,
      participantError,
      participantErrorMsg,
      participantAsOfDate,
      partasOfDateError,
      partasOfDateErrorMsg,
      dateParticipant,
      undoParticipant,
      planYearEndList,
      presenterMode,
      presenterForm,
      presenterDetailForm,
      presenterList,
      presentationDateMenu,
      presentationDateErrorMsg,
      presentationDateError,
      datePresentation,
      currentDate,
      anticipatedCloseDateMenu,
      anticipatedDateError,
      anticipatedDateErrorMsg,
      dateAnticipate,
      lazy,
      newPresenter,
      newPresenterOptions,
      showPresenterAndPrimaryAdvisor,
      crdNo,
      error,
      CrdMessage,
      valid,
      lookUpCredUrl,
      validAdd,
      emailRegex,
      zipcodeError,
      zipcodeErrorMsg,
      stateList,
      PresenterSuccessBar,
      presenters,
      count,
      panel,
      prese,
      crdRules,
      totalAssets,
      assetsAsofDate,
      participantBalance,
      participantBalanceAsofDate,
      numberValue1,
      stepError,
      presenterName,
      deleteAsset,
      deleteParticipant,
      SavePresenterandPlan,
      checkDecimal,
      loadPresenter,
      validatePresenter,
      presenterCompare,
      abondonPresenterChanges,
      addPresenterManually,
      formatString,
      CheckPresenter,
      backPresenter,
      clearPresenterDetail,
      clearStartEdit,
      checkDate,
      parseDate,
      editPresenter,
      showPresenterOptions,
      removeValidation,
      getPresenter,
      change,
      getAddress,
      SavePresenter
    }
  }
}
</script>
<style scoped>
.pad-2 {
  padding: 2px !important;
}
.height_44 .v-btn {
  height: 44px !important;
}
</style>
<style>
.v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
  margin-bottom: 0px !important;
}
.v-field__append-inner {
  width: 20px !important;
}
</style>
