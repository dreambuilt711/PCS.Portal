<template>
  <v-col class="pa-0">
    <v-col cols="12" xl="12" md="12" sm="12" xs="12" lg="12" class="pa-0">
      <v-card class="elevation-3 pa-5" height="100%" min-height="600px">
        <Loader
          :loading-text="searchText ? `Finding leads ${searchText}` : `Finding leads in ${zipcode}`"
          :loading="showLoader"
        />
        <v-col class="pa-0 pb-4">
          <v-row no-gutters>
            <v-col cols="12" class="pa-0">
              <v-row align="center" justify="center">
                <h2 class="font_24 pl-2">Market Opportunities</h2>
                <v-spacer />
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="pa-0 pb-4">
          <v-col cols="12" xs="12" class="ml-2 pa-0">
            <v-row no-gutters>
              <v-col
                v-if="!showSearch"
                cols="12"
                xl="3"
                sm="8"
                md="5"
                :lg="display?.width < 1400 && display?.width > 1250 ? '4' : '5'"
                :xs="display?.smAndDown ? '8' : '5'"
                class="ml-2 mr-2 pr-2 pa-0"
              >
                <v-select
                  v-model="searchRadius"
                  :menu-props="{ zIndex: '1' }"
                  :items="radiusList"
                  placeholder="Radius"
                  hide-details
                  variant="outlined"
                  item-title="text"
                  item-value="value"
                  density="compact"
                  @update:model-value="checkCurrentLocation('search')"
                >
                  <!-- <template #append>
                    <v-icon color="hyperlink"> icon-chevron-down </v-icon>
                  </template> -->
                </v-select>
              </v-col>
              <v-col v-if="!showSearch" cols="12" xl="3" lg="4" md="5" sm="6" xs="4" class="pa-0">
                <v-text-field
                  v-show="showZipCodeText"
                  v-model="zipcode"
                  :class="[zipcode === 'Current Location' && !$vuetify?.theme.dark ? 'textColor' : '', 'text-hyperlink']"
                  clearable
                  variant="outlined"
                  maxlength="5"
                  density="compact"
                  :error="zipcodeError"
                  @keypress="onlyNumber"
                  :error-messages="zipcodeErrorMsg"
                  @click:clear="clearReset()"
                  @keydown="maskAllow($event)"
                  @keyup.enter="loadMarketInsight"
                  @update:model-value="checkFields('location')"
                  @blur="checkCurrentLocation('search')"
                  @click:append-inner="getCurrentLocation()"
                  append-inner-icon="mdi-crosshairs-gps"
                >
                  <!-- <v-icon
                    class="padding_top_2"
                    :color="!$vuetify?.theme.dark && zipcode ? 'hyperlink' : ''"
                    @click="getCurrentLocation()"
                  >
                    mdiCrosshairsGps
                  </v-icon> -->
                </v-text-field>
                <v-text-field
                  v-show="!showZipCodeText"
                  v-model="zipcode"
                  maxlength="5"
                  variant="outlined"
                  clearable
                  density="compact"
                  :error="zipcodeError"
                  :error-messages="zipcodeErrorMsg"
                  @blur="checkCurrentLocation('search')"
                  :autofocus="showZipCodeText === false ? true : false"
                  @keypress="onlyNumber"
                  :class="[zipcode === 'Current Location' && !$vuetify?.theme.dark ? 'textColor' : '', 'text-hyperlink']"
                  @keydown="maskAllow($event)"
                  @click:clear="clearReset()"
                  @keyup.enter="loadMarketInsight"
                  @click:append-inner="getCurrentLocation()"
                  append-inner-icon="mdi-crosshairs-gps"
                >
                  <!-- <v-icon
                    slot="append"
                    class="padding_top_2 icon-geo-locate"
                    :color="!$vuetify?.theme.dark && zipcode ? 'hyperlink' : ''"
                    :disabled="!showEmployerSponsored && !showSchool && !showIndividual"
                    @click="getCurrentLocation()"
                  /> -->
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="!showEmployerSponsored && !showSchool && !showIndividual && !showMunicipalities">
            <v-col class="d-flex justify-center mb-3 pt-16">
              <img :src="noLeadsFoundImage" />
            </v-col>
            <v-col class="d-flex justify-center mb-1">
              <div>
                <h2>No Leads found</h2>
              </div>
            </v-col>
            <v-col class="d-flex justify-center mb-7 mt-0">
              <div>
                <h3>Try adjusting zipcode and radius.</h3>
              </div>
            </v-col>
          </v-col>
          <v-col v-if="!display?.xs" class="pa-0">
            <v-col cols="12" xs="12" class="pa-0">
              <h3 class="pl-6 p1-0 mb-4">Show plans with...</h3>
            </v-col>
            <v-row no-gutters>
              <v-col cols="12" lg="6" xl="6" class="pa-0">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title class="font-weight-regular text-left">
                      <h3>
                        <v-icon size="16" class="icon-for-profit" color="#119944" />
                        <span class="pl-1 text-left font_16" color="#0077cc" size="15">
                          For Profit ({{ new Intl.NumberFormat().format(forProfitCount) }})</span
                        >
                      </h3>
                    </v-list-item-title>
                    <v-col v-for="(item, index) in forProfitData" :key="index" class="pl-4 pb-0 pt-1">
                      <v-row no-gutters>
                        <v-col v-if="index < 5" cols="12" lg="12" class="pa-1">
                          <v-col class="text-left cursor-pointer" @click="showAllPlanDetails(item.searchName)">
                            <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                            <span class="pl-2 py-1" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'"
                              ><h3>{{ `${item.searchName} (${item.planCount})` }}</h3></span
                            >
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col v-if="false" cols="12" lg="6" xl="6">
                <v-col class="pl-0">
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title class="font-weight-regular text-left">
                        <v-icon size="16" class="icon-individual" color="#552299" />
                        <span class="pl-1 text-left">Individuals ({{ new Intl.NumberFormat().format(individualCount) }})</span>
                      </v-list-item-title>
                      <v-col v-for="(item, index) in individualData" :key="index" class="pl-3 pb-0">
                        <v-row no-gutters>
                          <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                            <v-col class="text-left cursor-pointer text-no-wrap" @click="showDetails(item, 'Individuals')">
                              <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                              <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                                `${item.searchName} (${item.planCount})`
                              }}</span>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col v-if="showMunicipalities" class="pl-0">
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title class="font-weight-regular text-left">
                        <v-icon size="16" class="icon-government municipalitiesIcon" color="#056937" />
                        <span class="pl-1 text-left" color="#0077cc" size="14">
                          Municipalities ({{ new Intl.NumberFormat().format(municipalitiesCount) }})</span
                        >
                      </v-list-item-title>
                      <v-col v-for="(item, index) in municipalitiesData" :key="index" class="pl-4 pb-0">
                        <v-row no-gutters>
                          <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                            <v-col class="text-left cursor-pointer" @click="showDetails(item, 'Municipalties')">
                              <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                              <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                                `${item.searchName} (${item.planCount})`
                              }}</span>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="display?.xs" class="pa-0">
            <v-row v-if="showEmployerSponsored && forProfitCount > 0" class="pl-0" no-gutters>
              <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" class="pa-0">
                <h3 class="pl-6 p1-0 mb-0">Show plans with...</h3>
              </v-col>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="pt-4 font-weight-regular text-left">
                    <h2>
                      <v-icon size="16" class="icon-for-profit" color="#119944" />
                      <span class="pl-1 text-left font_16" color="#0077cc" size="15"> For Profit ({{ forProfitCount }})</span>
                    </h2>
                  </v-list-item-title>
                  <v-col v-for="(item, index) in forProfitData" :key="index" class="pl-4 pa-0">
                    <v-row no-gutters>
                      <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                        <v-col class="text-left pa-0 handcursor" @click="showAllPlanDetails(item.searchName)">
                          <h3>
                            <v-icon size="12" class="icon-insight" color="#ffbb11" />
                            <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'text-hyperlink' : 'text-white'">{{
                              `${item.searchName} (${item.planCount})`
                            }}</span>
                          </h3>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row class="pl-0">
              <v-list v-if="showSchool && false" density="compact">
                <v-list-item>
                  <v-list-item-title class="pt-4 font-weight-regular text-left">
                    <v-icon size="16" class="icon-individual" color="#552299" />
                    <span class="pl-1 text-left">Individuals ({{ individualCount }})</span>
                  </v-list-item-title>
                  <v-col v-for="(item, index) in individualData" :key="index" class="pl-3 pb-0">
                    <v-row no-gutters>
                      <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                        <v-col class="text-left" @click="showDetails(item, 'Individuals')">
                          <v-icon size="12" class="icon-insight" color="#ffbb11" />
                          <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                            `${item.searchName} (${item.planCount})`
                          }}</span>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row v-if="showMunicipalities && false" class="pl-0">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="pt-4 font-weight-regular text-left">
                    <v-icon size="16" class="icon-government municipalitiesIcon" color="#056937" />
                    <span class="pl-1 text-left">Municipalities ({{ new Intl.NumberFormat().format(municipalitiesCount) }})</span>
                  </v-list-item-title>
                  <v-col v-for="(item, index) in municipalitiesData" :key="index" class="pl-4 pb-0">
                    <v-row no-gutters>
                      <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                        <v-col class="text-left cursor-pointer" @click="showDetails(item, 'Municipalties')">
                          <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                          <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                            `${item.searchName} (${item.planCount})`
                          }}</span>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-list-item>
              </v-list>
            </v-row>
          </v-col>
          <v-col v-if="!display?.xs && false">
            <v-row>
              <v-col cols="6" xl="6" lg="6" class="pl-0">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title class="font-weight-regular text-left">
                      <v-icon size="16" class="icon-schools" color="#006633" />
                      <span class="pl-1 text-left">Schools ({{ new Intl.NumberFormat().format(schoolCount) }})</span>
                    </v-list-item-title>
                    <v-col v-for="(item, index) in schoolData" :key="index" class="pl-3 pb-0">
                      <v-row no-gutters>
                        <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                          <v-col class="text-left cursor-pointer" @click="showDetails(item, 'Schools')">
                            <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                            <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                              `${item.searchName} (${item.planCount})`
                            }}</span>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col v-if="showMunicipalities" cols="6" xl="6" lg="6">
                <v-col class="pl-0">
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title class="font-weight-regular text-left">
                        <v-icon size="16" class="fas fa-church" color="#910012" />
                        <span class="pl-1 text-left" color="#0077cc" size="14">
                          Churches ({{ new Intl.NumberFormat().format(churchCount) }})</span
                        >
                      </v-list-item-title>
                      <v-col v-for="(item, index) in churchData" :key="index" class="pl-4 pb-0">
                        <v-row no-gutters>
                          <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                            <v-col class="text-left cursor-pointer" @click="showDetails(item, 'Churches')">
                              <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                              <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                                `${item.searchName} (${item.planCount})`
                              }}</span>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col class="pl-0">
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title class="font-weight-regular text-left">
                        <v-icon size="16" class="icon-tax-exempt" color="#F59A23" />
                        <span class="pl-1 text-left">Tax-Exempt ({{ new Intl.NumberFormat().format(taxExemptCount) }})</span>
                      </v-list-item-title>
                      <v-col v-for="(item, index) in taxExemptData" :key="index" class="pl-3 pb-0">
                        <v-row no-gutters>
                          <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                            <v-col class="text-left cursor-pointer text-no-wrap" @click="showDetails(item, 'TaxExempt')">
                              <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                              <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                                `${item.searchName} (${item.planCount})`
                              }}</span>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="display?.xs">
            <v-row v-if="showSchool && false" class="pl-0">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="pt-4 font-weight-regular text-left">
                    <v-icon size="16" class="icon-schools" color="#006633" />
                    <span class="pl-1 text-left">Schools ({{ schoolCount }})</span>
                  </v-list-item-title>
                  <v-col v-for="(item, index) in schoolData" :key="index" class="pl-3 pb-0">
                    <v-row no-gutters>
                      <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                        <v-col class="text-left" @click="showDetails(item, 'Schools')">
                          <v-icon size="12" class="icon-insight" color="#ffbb11" />
                          <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                            `${item.searchName} (${item.planCount})`
                          }}</span>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row v-if="showMunicipalities && false" class="pl-0">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="pt-4 font-weight-regular text-left">
                    <v-icon size="16" class="fas fa-church" color="#910012" />
                    <span class="pl-1 text-left">Churches ({{ new Intl.NumberFormat().format(churchCount) }})</span>
                  </v-list-item-title>
                  <v-col v-for="(item, index) in churchData" :key="index" class="pl-4 pb-0">
                    <v-row no-gutters>
                      <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                        <v-col class="text-left cursor-pointer" @click="showDetails(item, 'Churches')">
                          <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                          <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                            `${item.searchName} (${item.planCount})`
                          }}</span>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row v-if="showMunicipalities && false" class="pl-0">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="pt-4 font-weight-regular text-left">
                    <v-icon size="16" class="icon-tax-exempt" color="#F59A23" />
                    <span class="pl-1 text-left">Tax-Exempt ({{ new Intl.NumberFormat().format(taxExemptCount) }})</span>
                  </v-list-item-title>
                  <v-col v-for="(item, index) in taxExemptData" :key="index" class="pl-3 pb-0">
                    <v-row no-gutters>
                      <v-col v-if="index < 5" cols="12" lg="12" class="pa-2">
                        <v-col class="text-left cursor-pointer text-no-wrap" @click="showDetails(item, 'TaxExempt')">
                          <v-icon size="12" class="icon-insight pr-3 pb-2" color="#ffbb11" />
                          <span class="pl-1 pb-2" :class="!$vuetify?.theme.dark ? 'hyperlink--text' : 'white--text'">{{
                            `${item.searchName} (${item.planCount})`
                          }}</span>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-list-item>
              </v-list>
            </v-row>
          </v-col>
          <v-col cols="12" xs="12">
            <v-row no-gutters>
              <v-col class="justify-start widgetLeftButtonPosition">
                <v-btn
                  class="ml-0 text-capitalize"
                  :disabled="showLoader || (!showEmployerSponsored && !showMunicipalities && !showSchool)"
                  :color="$vuetify?.theme.dark ? '' : 'accent'"
                  @click="redirectToLeads()"
                >
                  Search All Leads
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-card>
    </v-col>
  </v-col>
</template>
<script>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import Loader from '@/components/NewLoader'
export default {
  components: {
    Loader
  },
  setup() {
    const instance = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    const store = instance.appContext.config.globalProperties.$store
    const display = useDisplay()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    //const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const loading = ref(false)
    const noLeadsFoundImage = ref(require('@/assets/images/no-records.svg'))
    const showSearch = ref(false)
    const radiusList = ref([
      { text: 'within 5 miles of ', value: 5 },
      { text: 'within 10 miles of', value: 10 },
      { text: 'within 25 miles of', value: 25 },
      { text: 'within 50 miles of', value: 50 },
      { text: 'within 100 miles of', value: 100 }
    ])
    let LowParticipationResult = ref('')
    const searchRadius = ref(5)
    const searchText = ref('')
    const zipcode = ref('Current Location')
    const zipcodeError = ref(false)
    const zipcodeErrorMsg = ref('')
    const radius = ref(5)
    const showZipCodeText = ref(true)
    const planReports = ref([])
    const forProfitData = ref([])
    const schoolData = ref([])
    const individualData = ref([])
    const municipalitiesData = ref([])
    const taxExemptData = ref([])
    const churchData = ref([])
    const hideCard = ref(false)
    const filterPlans = ref([])
    const filterSchools = ref([])
    const filterIndividual = ref([])
    const filterMunicipalties = ref([])
    const filterTaxExempt = ref([])
    const filterChurches = ref([])
    const forProfitCount = ref(0)
    const schoolCount = ref(0)
    const individualCount = ref(0)
    const municipalitiesCount = ref(0)
    const taxExemptCount = ref(0)
    const churchCount = ref(0)
    const lowestReturnPlans = ref([])
    const displayAllPlanDialog = ref(false)
    const EIN = ref('')
    const plan = ref('')
    const showLoader = ref('')
    const lowReturnValue = ref([])
    const showError = ref(false)
    let PlanResult = ref([])
    const WidgetName = ref('')
    const closePlanDialog = ref(false)
    const componentKeyResult = ref(0)
    const selectreports = ref([])
    const lowReturnsResult = ref([])
    const lowParticipationReturnValue = ref([])
    const lowestParticipationPlans = ref([])
    const prospectResult = ref([])
    const prospectPlanResult = ref([])
    const benchmarkPlans = ref([])
    const benchmarkPlanResult = ref([])
    const prospectTab = ref(8)
    const showEmployerSponsored = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.EmployerSponsored
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.EmployerSponsored
          )
        )
      } else return true
    })
    const showSchool = computed(() => {
      return true
    })
    const showIndividual = computed(() => {
      return false
    })
    const showMunicipalities = computed(() => {
      return false
    })
    const dialogWidth = computed(() => {
      if (display.xl.value) return '60%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    onMounted(() => {
      if (Object.keys(store.state.marketInsight).length > 0) {
        zipcode.value = store.state.marketInsight.zipcode ? store.state.marketInsight.zipcode : null
        searchRadius.value = store.state.marketInsight.searchRadius ? store.state.marketInsight.searchRadius : 5
        let radiusExist = radiusList.value.filter((a) => a.value === searchRadius.value)
        if (radiusExist && radiusExist.length === 0) {
          let newRadiusValue = {
            text: `within ${searchRadius.value} miles`,
            value: searchRadius
          }
          radiusList.value.push(newRadiusValue)
          radiusList.value = radiusList.value.sort(function (a, b) {
            return a.value - b.value
          })
        }
      }
      if (zipcode.value && zipcode.value !== 'Current Location') {
        loadMarketInsight()
      } else if (!zipcode.value || zipcode.value === 'Current Location') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
        }
      }
    })

    function closeMarketInsightPlans() {
      displayAllPlanDialog.value = false
    }

    function viewDetails(type) {
      if (type === 'For-Profit') {
        displayAllPlanDialog.value = true
      }
      if (type === 'Schools') {
        displayAllPlanDialog.value = true
      }
      if (type === 'Individuals') {
        displayAllPlanDialog.value = true
      }
      if (type === 'Municipalties') {
        displayAllPlanDialog.value = true
      }
      if (type === 'Churches') {
        displayAllPlanDialog.value = true
      }
      if (type === 'TaxExempt') {
        displayAllPlanDialog.value = true
      }
    }
    function searchBlur(val) {
      {
        if (val) {
          EIN.value = searchText
          plan.value = ''
        } else {
          EIN.value = ''
          plan.value = searchText
        }
      }
    }

    function searchAreaFocusOut() {
      hideCard.value = false
      filterPlans.value = []
      filterSchools.value = []
      filterIndividual.value = []
      filterMunicipalties.value = []
      filterChurches.value = []
      filterTaxExempt.value = []
    }
    function showHideSearch() {
      showSearch.value = !showSearch.value
      if (showSearch.value === false) {
        if (Object.keys(store.state.marketInsight).length > 0) {
          zipcode.value = store.state.marketInsight.zipcode
          searchRadius.value = store.state.marketInsight.searchRadius ? store.state.marketInsight.searchRadius : 5
          searchText.value = ''
        } else {
          if (zipcode.value && !searchText.value && zipcode.value !== 'Current Location') {
            loadMarketInsight()
          } else if ((!zipcode.value || zipcode.value === 'Current Location') && !searchText.value) {
            store.dispatch('getUser').then(() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(getZipcode, showCurrentError)
              }
            })
          }
        }
      }
    }
    function checkFields(val) {
      switch (val) {
        case 'company':
          EIN.value = ''
          zipcode.value = ''
          zipcodeError.value = false
          zipcodeErrorMsg.value = ''
          searchRadius.value = 0
          if (searchText.value === '') {
            filterPlans.value = []
            filterSchools.value = []
            filterIndividual.value = []
            filterMunicipalties.value = []
            filterChurches.value = []
            filterTaxExempt.value = []
          }
          if (showEmployerSponsored.value) getPlanResults()
          if (showSchool.value) getSchoolResults()
          if (showIndividual.value) getIndividualResults()
          if (showMunicipalities.value) {
            getMunicipalResults()
            getTaxExemptResults()
            getChurchResults()
          }
          break
        case 'location':
          plan.value = ''
          EIN.value = ''
          searchText.value = ''
          filterPlans.value = []
          filterSchools.value = []
          filterIndividual.value = []
          filterMunicipalties.value = []
          filterChurches.value = []
          filterTaxExempt.value = []
          break
        case 'radius':
          plan.value = ''
          EIN.value = ''
          if (zipcode.value === 'Current Location') {
            getCurrentLocation()
          } else {
            zipcodeError.value = true
            zipcodeErrorMsg.value = 'Location could not be determined'
          }
          break
        default:
          break
      }
    }
    async function getPlanResults() {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/tal/plan/autocomplete/plan/${event.target.value}`
        }
        let res = await $axios(config)
        filterPlans.value = res.data.d
        filterPlans.value.forEach((a) => {
          a.Name = a.name
          delete a.name
        })
      } else hideCard.value = false
    }
    async function getSchoolResults() {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/school/${event.target.value}`
        }
        let res = await $axios(config)
        filterSchools.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    async function getIndividualResults() {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/tal/individual/autocomplete/${event.target.value}`
        }
        let res = await $axios(config)
        filterIndividual.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    async function getMunicipalResults() {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/municipal/${event.target.value}`
        }
        let res = await $axios(config)
        filterMunicipalties.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    async function getChurchResults() {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/church/${event.target.value}`
        }
        let res = await $axios(config)
        //this is
        filterChurches.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    async function getTaxExemptResults() {
      if (searchText.value) {
        hideCard.value = true
        const config = {
          method: 'get',
          url: `/api/v1/autocomplete/taxexempt/${event.target.value}`
        }
        let res = await $axios(config)
        filterTaxExempt.value = res.data.d && res.data.d.length > 0 ? res.data.d : []
      } else hideCard.value = false
    }
    function getPlanValue(val, type) {
      searchText.value = val.Name
      plan.value = val.Name
      EIN.value = ''
      if (type === 'employeeSponsor') EIN.value = val.ein ? val.ein : ''
      filterSchools.value = []
      filterIndividual.value = []
      filterPlans.value = []
      filterMunicipalties.value = []
      filterChurches.value = []
      filterTaxExempt.value = []
      if (type === 'employeeSponsor') getEmployeeSponsorData()
      if (type === 'school') getSchoolData()
      if (type === 'individual') getIndividualData()
      if (type === 'municipal') getMunicipalResults() //changed this to getMunicipalResults compated to master
      if (type === 'church') getChurchResults()
      if (type === 'taxExempt') getTaxExemptResults()
    }
    function getEmployeeSponsorData() {
      loading.value = true
      if (showEmployerSponsored.value) {
        //api call will be written here
      }
    }
    function getSchoolData() {
      loading.value = true
      if (showSchool.value) {
        //api call will be here
      }
    }
    function getIndividualData() {
      loading.value = true
      if (showIndividual.value) {
        //api will be written here
      }
    }
    ///Zipcode Validation Start
    function getCurrentLocation() {
      zipcode.value = 'Current Location'
      checkCurrentLocation('current_location')
    }
    async function getAddress(zipcode) {
      var request = new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode}` }, (results, status) => {
          if (status === 'OK') {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.exec(zipcode)) {
              zipcodeError.value = false
              zipcodeErrorMsg.value = ''
              resolve(true)
            } else {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Invalid Zip Code'
              reject(false)
            }
          } else {
            // eslint-disable-next-line no-undef
            if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
              resolve(true)
            } else {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Invalid Zip Code'
              reject(false)
            }
          }
        })
      })
      var result = request
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err
        })
      return result
    }
    function getZipcode(position, from) {
      zipcodeError.value = false
      zipcodeErrorMsg.value = ''
      $axios
        .get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'jsonv2',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
        })
        .then((success) => {
          if (from === 'current_location') {
            zipcode.value =
              success.data && success.data.address != null && success.data.address.postcode
                ? success.data.address.postcode
                : store.state.user.zipCode
          } else {
            if (Object.keys(store.state.marketInsight).length > 0) {
              zipcode.value = store.state.marketInsight.zipcode
                ? store.state.marketInsight.zipcode
                : success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : store.state.user.zipCode
            } else {
              zipcode.value =
                success.data && success.data.address != null && success.data.address.postcode
                  ? success.data.address.postcode
                  : store.state.user.zipCode
            }
          }
          loadMarketInsight('search')
        })
    }
    async function checkCurrentLocation(from) {
      if (from === 'search') {
        if (!zipcode.value && !searchText.value) {
          zipcodeError.value = true
          zipcodeErrorMsg.value = 'Zip code is a required'
          return
        } else if (!searchRadius.value) {
          searchRadius.value = 5
        } else {
          zipcodeError.value = false
          zipcodeErrorMsg.value = ''
        }
      }
      if (zipcode.value && zipcode.value !== 'Current Location') {
        var isValidZip = await getAddress(zipcode.value)
        if (!isValidZip) return
      }
      if (zipcode.value === 'Current Location') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              getZipcode(position, from)
            },
            // eslint-disable-next-line no-unused-vars
            (error) => {
              zipcodeError.value = true
              zipcodeErrorMsg.value = 'Location could not be determined'
            }
          )
        }
      } else {
        zipcodeError.value = false
        zipcodeErrorMsg.value = ''
        if (from === 'search') {
          loadMarketInsight('search')
        }
      }
    }
    function showCurrentError() {
      zipcode.value = store.state.user.zipCode
      if (Object.keys(store.state.marketInsight).length > 0)
        zipcode.value = store.state.marketInsight.zipcode ? store.state.marketInsight.zipcode : store.state.user.zipCode
      store.state.marketInsight.zipcode = zipcode.value
      store.state.marketInsight.searchRadius = searchRadius.value
      loadMarketInsight('search')
    }
    function clearReset() {
      zipcode.value = ''
      zipcodeError.value = false
      zipcodeErrorMsg.value = ''
      searchRadius.value = ''
    }
    function maskAllow($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode === 8 || keyCode === 46) {
        if (zipcode.value === 'Current Location') zipcode.value = null
      }
    }
    function updateFinderModel() {
      store.state.finderList = {
        zipcode: zipcode.value,
        searchRadius: searchRadius.value ? searchRadius.value : 5,
        plan: searchText.value ? plan.value : '',
        EIN: searchText.value ? EIN.value : '',
        showMap: true,
        prospectValue: prospectTab.value === 8 ? 0 : prospectTab.value,
        showStarred: false
      }
    }
    function redirectToLeads() {
      updateFinderModel()
      router
        .push({
          name: 'TALFinderResult'
        })
        .catch(() => {})
    }
    ///Zipcode Validation Finish
    async function redirect() {
      var isValidZip = await getAddress(zipcode.value)
      if (!isValidZip) return
      if (zipcode.value) {
        store.state.finderList = {
          zipcode: zipcode.value,
          searchRadius: searchRadius.value ? searchRadius.value : 5,
          plan: plan.value,
          EIN: EIN.value,
          showMap: true,
          prospectValue: 8,
          showStarred: false
        }
        router
          .push({
            name: 'TALFinderResult'
          })
          .catch(() => {})
      } else {
        zipcodeError.value = true
        zipcodeErrorMsg.value = 'Zip code is a required'
      }
    }
    async function loadMarketInsight() {
      forProfitData.value = [
        {
          planCount: 0,
          searchName: 'Low participation rates'
        },
        {
          planCount: 0,
          searchName: 'Compliance issues'
        },
        {
          planCount: 0,
          searchName: 'Low Returns'
        },
        {
          planCount: 0,
          searchName: 'Fees Above Benchmark'
        }
      ]
      schoolData.value = [
        {
          planCount: 0,
          searchName: 'High Employee Count'
        },
        {
          planCount: 0,
          searchName: 'High Salaries'
        },
        {
          planCount: 0,
          searchName: 'Districts with Open Slots'
        }
      ]
      individualData.value = [
        {
          planCount: 0,
          searchName: 'Eligible and not Contributing'
        },
        {
          planCount: 0,
          searchName: 'New and rurolled'
        }
      ]
      municipalitiesData.value = [
        {
          planCount: 0,
          searchName: 'Eligible and not Contributing'
        }
      ]
      taxExemptData.value = [
        {
          planCount: 0,
          searchName: 'Eligible and not Contributing'
        }
      ]
      churchData.value = [
        {
          planCount: 0,
          searchName: 'Eligible and not Contributing'
        }
      ]
      forProfitCount.value = 0
      schoolCount.value = 0
      individualCount.value = 0
      municipalitiesCount.value = 0
      churchCount.value = 0
      taxExemptCount.value = 0
      getLowReturnPlan()
      getLowParticipation()
      GetProspectResultCompliance()
      getBenchmark()
    }
    function showAllPlanDetails(type) {
      if (type === 'Low Returns') {
        PlanResult.value = lowReturnsResult.value
        store.state.marketInsight.PlanResult = lowReturnsResult.value
        store.state.marketInsight.TotalCount = forProfitData.value[2].planCount
        WidgetName.value = 'lowReturn'
        store.state.marketInsight.WidgetName = 'lowReturn'
      } else if (type === 'Low participation rates') {
        PlanResult.value = LowParticipationResult.value
        store.state.marketInsight.PlanResult = LowParticipationResult.value
        store.state.marketInsight.TotalCount = forProfitData.value[0].planCount
        WidgetName.value = 'participationRates'
        store.state.marketInsight.WidgetName = 'participationRates'
      } else if (type === 'Fees Above Benchmark') {
        PlanResult.value = benchmarkPlanResult.value
        store.state.marketInsight.PlanResult = benchmarkPlanResult.value
        WidgetName.value = 'benchmark'
        store.state.marketInsight.TotalCount = forProfitData.value[3].planCount
        store.state.marketInsight.WidgetName = 'benchmark'
      } else {
        PlanResult.value = prospectPlanResult.value
        store.state.marketInsight.PlanResult = prospectPlanResult.value
        store.state.marketInsight.TotalCount = forProfitData.value[1].planCount
        WidgetName.value = 'compliance'
        store.state.marketInsight.WidgetName = 'compliance'
      }
      store.state.marketInsight.zipcode = zipcode.value
      store.state.marketInsight.searchRadius = searchRadius.value
      router
        .push({
          name: 'MarketOpportunities',
          params: { type: type, WidgetName: WidgetName.value }
        })
        .catch(() => {})
    }
    function getLowReturnPlan() {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/LowestReturns/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              lowReturnValue.value = []
              lowestReturnPlans.value = []
              showError.value = true
              return
            }
            if (success.data.d !== null) {
              lowestReturnPlans.value = success.data.d
            }
            showLoader.value = false
            showError.value = false
            showLowestReturnPlan()
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            showLoader.value = false
            lowReturnValue.value = []
            lowestReturnPlans.value = []
            showError.value = true
          })
      }
    }
    function showLowestReturnPlan() {
      lowReturnsResult.value = lowestReturnPlans.value
      componentKeyResult.value += 1
      forProfitData.value[2].planCount = lowReturnsResult.value ? lowReturnsResult.value.length : 0
      store.state.marketInsight.lowReturnsResult = lowReturnsResult.value
      updateTotalCount()
    }
    function getLowParticipation() {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/LowestParticipation/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              lowParticipationReturnValue.value = []
              lowestParticipationPlans.value = []
              showError.value = true
              return
            }
            if (success.data.d !== null) {
              lowestParticipationPlans.value = success.data.d
            }
            showLoader.value = false
            showError.value = false
            showLowestParticipationPlans()
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            showLoader.value = false
            lowParticipationReturnValue.value = []
            lowestParticipationPlans.value = []
            showError.value = true
          })
      }
    }
    function showLowestParticipationPlans() {
      LowParticipationResult.value = lowestParticipationPlans.value
      componentKeyResult.value += 1
      forProfitData.value[0].planCount = LowParticipationResult.value ? LowParticipationResult.value.length : 0
      store.state.marketInsight.LowParticipationResult = LowParticipationResult.value
      updateTotalCount()
    }
    function GetProspectResultCompliance() {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/ComplianceAlerts/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              prospectResult.value = []
              showError.value = true
              return
            }
            if (success.data.d != null) {
              if (Object.keys(success.data.d).length > 0) {
                prospectResult.value = success.data.d
              }
              showLoader.value = false
              showError.value = false
              showProspectPlanCompliance()
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            showLoader.value = false
            prospectResult.value = []
            showError.value = true
          })
      }
    }
    function showProspectPlanCompliance() {
      prospectPlanResult.value = prospectResult.value
      componentKeyResult.value += 1
      forProfitData.value[1].planCount = prospectPlanResult.value ? prospectPlanResult.value.length : 0
      store.state.marketInsight.prospectPlanResult = prospectPlanResult.value
      updateTotalCount()
    }
    function getBenchmark() {
      if (zipcode.value) {
        showLoader.value = true
        $axios
          .get(`/api/v1/tal/plan/PlanFeeAboveBenchmark/${zipcode.value}/${searchRadius.value}`)
          .then((success) => {
            if (success.data.message) {
              showLoader.value = false
              benchmarkPlans.value = []
              showError.value = true
              return
            }
            if (success.data.d != null) {
              benchmarkPlans.value = success.data.d.length > 0 ? success.data.d : []
            }
            showLoader.value = false
            showError.value = false
            showBenchmarkPlans()
          })
          .catch(() => {
            showLoader.value = false
            benchmarkPlans.value = []
            showError.value = true
          })
      }
    }
    function showBenchmarkPlans() {
      benchmarkPlanResult.value = benchmarkPlans.value
      componentKeyResult.value += 1
      forProfitData.value[3].planCount = benchmarkPlanResult.value ? benchmarkPlanResult.value.length : 0
      store.state.marketInsight.benchmarkPlanResult = benchmarkPlanResult.value
      updateTotalCount()
    }
    function updateTotalCount() {
      forProfitCount.value = 0
      forProfitCount.value =
        forProfitData.value[0].planCount +
        forProfitData.value[1].planCount +
        forProfitData.value[2].planCount +
        forProfitData.value[3].planCount
    }
    function showDetails() {}
    return {
      router,
      route,
      store,
      display,
      loading,
      noLeadsFoundImage,
      showSearch,
      radiusList,
      searchRadius,
      searchText,
      zipcode,
      zipcodeError,
      zipcodeErrorMsg,
      radius,
      showZipCodeText,
      planReports,
      forProfitData,
      schoolData,
      individualData,
      municipalitiesData,
      taxExemptData,
      churchData,
      hideCard,
      filterPlans,
      filterSchools,
      filterIndividual,
      filterMunicipalties,
      filterTaxExempt,
      filterChurches,
      forProfitCount,
      schoolCount,
      individualCount,
      municipalitiesCount,
      taxExemptCount,
      churchCount,
      lowestReturnPlans,
      displayAllPlanDialog,
      EIN,
      plan,
      showLoader,
      lowReturnValue,
      showError,
      PlanResult,
      WidgetName,
      closePlanDialog,
      componentKeyResult,
      selectreports,
      lowReturnsResult,
      lowParticipationReturnValue,
      lowestParticipationPlans,
      prospectResult,
      prospectPlanResult,
      benchmarkPlanResult,
      benchmarkPlans,
      prospectTab,
      showEmployerSponsored,
      showSchool,
      showIndividual,
      showMunicipalities,
      dialogWidth,
      closeMarketInsightPlans,
      viewDetails,
      searchBlur,
      searchAreaFocusOut,
      showHideSearch,
      checkFields,
      getPlanResults,
      getSchoolResults,
      getIndividualResults,
      getMunicipalResults,
      getChurchResults,
      getTaxExemptResults,
      getPlanValue,
      getEmployeeSponsorData,
      getSchoolData,
      getIndividualData,
      getCurrentLocation,
      getAddress,
      getZipcode,
      checkCurrentLocation,
      showCurrentError,
      clearReset,
      maskAllow,
      updateFinderModel,
      redirectToLeads,
      redirect,
      loadMarketInsight,
      showAllPlanDetails,
      getLowReturnPlan,
      showLowestReturnPlan,
      getLowParticipation,
      showLowestParticipationPlans,
      GetProspectResultCompliance,
      showProspectPlanCompliance,
      getBenchmark,
      showBenchmarkPlans,
      updateTotalCount,
      showDetails
    }
  }
}
</script>
<style scoped>
#mapSizing {
  border-radius: 5px;
  margin-top: -20px;
}
.line-break {
  width: 100%;
}
.flex {
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: 50%;
  /* height: 50px;
  margin: 5px; */
}
</style>
