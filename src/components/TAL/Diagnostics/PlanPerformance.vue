<template>
  <v-col class="pa-0">
    <v-col cols="12" xs="12" class="pa-3" :class="theme.dark ? 'cardbackground dark' : 'cardbackground light'">
      <v-row>
        <v-col cols="12" xs="12" class="pa-0">
          <v-row>
            <v-col cols="12" sm="4" xs="12" class="text-left pa-0">
              <h2>
                <span class="handcursor font-weight-medium" @click="panel = !panel">
                  <v-icon :color="theme.dark ? '' : 'black'" :class="panel ? 'rotate_icon' : ''" class="mr-2">
                    mdi-chevron-down
                  </v-icon>
                  Market Insight
                </span>
              </h2>
            </v-col>
            <v-col
              v-if="showDiagnostic"
              cols="12"
              xs="12"
              sm="8"
              class="text-right align-self pa-0"
              :class="display.xs.value ? 'pl-0 pr-0 pt-2' : ''"
            >
              <v-btn
                v-if="planId > 0"
                size="small"
                variant="text"
                :color="theme.dark ? '' : 'hyperlink'"
                class="ma-0"
                @click="getReport()"
              >
                Generate Express Diagnostic
              </v-btn>
            </v-col>
            <v-dialog
              v-model="reportDialog"
              persistent
              class="elevation-3"
              content-class="elevation-3"
              scrollable
              :max-width="!display.mdAndDown.value ? '380px' : '400px'"
            >
              <v-card v-if="performanceLoading">
                <v-card-text class="maxHeight">
                  <v-row class="justify-center">
                    <v-col class="advanceFilter pt-5 text-center pa-0" cols="12" xs="12">
                      <v-col :class="theme.dark ? '' : 'text-accent'" class="pa-0 text-center font_14">
                        <h3>Generating Report...</h3>
                      </v-col>
                      <v-col class="pt-2 text-center pa-0" :class="theme.dark ? '' : 'text-accent'">
                        <h4>The reports might take up to a minute to load.</h4>
                      </v-col>
                      <v-col class="pt-8 pa-0">
                        <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
                      </v-col>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-row>
        </v-col>
        <v-col v-if="panel" cols="12" xs="12" class="pa-0">
          <v-col class="pt-3 pb-3 pa-0">
            <v-row v-if="planId > 0">
              <v-col cols="12" lg="4" md="6" sm="6" xs="12" :xl="display.xl.value ? '3' : '4'" class="pa-0">
                <h4 class="font-weight-medium text-uppercase">Net Annualized Total Return</h4>
                <v-progress-linear
                  v-if="netAnnualizeLoader"
                  color="accent"
                  :indeterminate="true"
                  height="4"
                  style="width: 57%"
                  class="mt-0"
                />
                <v-col class="pt-1 pa-0">
                  <v-row>
                    <v-col cols="6" xl="6" md="6" lg="6" sm="6" xs="6" class="pa-0">
                      <v-col class="mb-1 pa-0">
                        <span class="font_size_11">12 Months</span>
                      </v-col>
                      <v-col class="border_solid pa-0" :class="display.xs.value ? 'mr-2' : 'mr-3'">
                        <h1 class="text-center">
                          {{
                            netAnualizeOneYear[0] != null
                              ? netAnualizeOneYear[0].Return != undefined
                                ? netAnualizeOneYear[0].Return.toFixed(2)
                                : 0
                              : '--'
                          }}<span v-if="netAnualizeOneYear[0] != null">%</span>
                        </h1>
                      </v-col>
                      <v-col class="mt-1 pa-0">
                        <v-row>
                          <v-col cols="6" xl="6" class="pa-0">
                            <v-col class="font-weight-medium pa-0">
                              {{ netAnualizeOneYear[1] != null ? netAnualizeOneYear[1].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  netAnualizeOneYear[1] != null
                                    ? netAnualizeOneYear[1].Return != undefined
                                      ? netAnualizeOneYear[1].Return.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="netAnualizeOneYear[1] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                          <v-col
                            cols="6"
                            xl="6"
                            :class="[
                              display.md.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.xl.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.lg.value ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                            ]"
                            class="pa-0"
                          >
                            <v-col class="font-weight-medium pa-0">
                              {{ netAnualizeOneYear[2] != null ? netAnualizeOneYear[2].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  netAnualizeOneYear[2] != null
                                    ? netAnualizeOneYear[2].Return != undefined
                                      ? netAnualizeOneYear[2].Return.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="netAnualizeOneYear[2] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                    <v-col cols="6" xl="6" md="6" lg="6" sm="6" xs="6" class="pa-0">
                      <v-col class="mb-1 pa-0">
                        <span class="font_size_11">5 Years Average</span>
                      </v-col>
                      <v-col class="border_solid pa-0" :class="display.xs.value ? '' : 'mr-4'">
                        <h1 class="text-center">
                          {{
                            netAnualizeFiveYear[0] != null
                              ? netAnualizeFiveYear[0].Return != undefined
                                ? netAnualizeFiveYear[0].Return.toFixed(2)
                                : 0
                              : '--'
                          }}<span v-if="netAnualizeFiveYear[0] != null">%</span>
                        </h1>
                      </v-col>
                      <v-col class="mt-1 pa-0">
                        <v-row>
                          <v-col cols="6" xl="6" class="pa-0">
                            <v-col class="font-weight-medium pa-0">
                              {{ netAnualizeFiveYear[1] != null ? netAnualizeFiveYear[1].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  netAnualizeFiveYear[1] != null
                                    ? netAnualizeFiveYear[1].Return != undefined
                                      ? netAnualizeFiveYear[1].Return.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="netAnualizeFiveYear[1] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                          <v-col
                            cols="6"
                            xl="6"
                            :class="[
                              display.md.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.xl.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.lg.value ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                            ]"
                            class="pa-0"
                          >
                            <v-col class="font-weight-medium pa-0">
                              {{ netAnualizeFiveYear[2] != null ? netAnualizeFiveYear[2].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  netAnualizeFiveYear[2] != null
                                    ? netAnualizeFiveYear[2].Return != undefined
                                      ? netAnualizeFiveYear[2].Return.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="netAnualizeFiveYear[2] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col
                cols="12"
                lg="4"
                md="6"
                sm="6"
                xs="12"
                :xl="display.xl.value ? '3' : '4'"
                :class="display.xs.value ? 'mt-2' : ''"
                class="pa-0"
              >
                <h4 class="font-weight-medium text-uppercase">Participation Rate</h4>
                <v-progress-linear
                  v-if="participantLoader"
                  color="accent"
                  :indeterminate="true"
                  height="4"
                  style="width: 36%"
                  class="mt-0"
                />
                <v-col class="pt-1 pa-0">
                  <v-row>
                    <v-col cols="6" xl="6" md="6" lg="6" sm="6" xs="6" class="pa-0">
                      <v-col class="mb-1 pa-0">
                        <span class="font_size_11">12 Months</span>
                      </v-col>
                      <v-col class="border_solid pa-0" :class="display.xs.value ? 'mr-2' : 'mr-3'">
                        <h1 class="text-center">
                          {{
                            participantOneYear[0] != null
                              ? participantOneYear[0].Participation != undefined
                                ? participantOneYear[0].Participation.toFixed(2)
                                : 0
                              : '--'
                          }}<span v-if="participantOneYear[0] != null">%</span>
                        </h1>
                      </v-col>
                      <v-col class="mt-1 pa-0">
                        <v-row>
                          <v-col cols="6" xl="6" class="pa-0">
                            <v-col class="font-weight-medium pa-0">
                              {{ participantOneYear[1] != null ? participantOneYear[1].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  participantOneYear[1] != null
                                    ? participantOneYear[1].Participation != undefined
                                      ? participantOneYear[1].Participation.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="participantOneYear[1] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                          <v-col
                            cols="6"
                            xl="6"
                            :class="[
                              display.md.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.xl.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.lg.value ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                            ]"
                            class="pa-0"
                          >
                            <v-col class="font-weight-medium pa-0">
                              {{ participantOneYear[2] != null ? participantOneYear[2].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  participantOneYear[2] != null
                                    ? participantOneYear[2].Participation != undefined
                                      ? participantOneYear[2].Participation.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="participantOneYear[2] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                    <v-col cols="6" xl="6" md="6" lg="6" sm="6" xs="6" class="pa-0">
                      <v-col class="mb-1 pa-0">
                        <span class="font_size_11">5 Years Average</span>
                      </v-col>
                      <v-col class="border_solid pa-0" :class="display.xs.value ? '' : 'mr-4'">
                        <h1 class="text-center">
                          {{
                            participantFiveYear[0] != null
                              ? participantFiveYear[0].Participation != undefined
                                ? participantFiveYear[0].Participation.toFixed(2)
                                : 0
                              : '--'
                          }}<span v-if="participantFiveYear[1] != null">%</span>
                        </h1>
                      </v-col>
                      <v-col class="mt-1 pa-0">
                        <v-row>
                          <v-col cols="6" xl="6" class="pa-0">
                            <v-col class="font-weight-medium pa-0">
                              {{ participantFiveYear[1] != null ? participantFiveYear[1].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  participantFiveYear[1] != null
                                    ? participantFiveYear[1].Participation != undefined
                                      ? participantFiveYear[1].Participation.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="participantFiveYear[1] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                          <v-col
                            cols="6"
                            xl="6"
                            :class="[
                              display.md.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.xl.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.lg.value ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                            ]"
                            class="pa-0"
                          >
                            <v-col class="font-weight-medium pa-0">
                              {{ participantFiveYear[2] != null ? participantFiveYear[2].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  participantFiveYear[2] != null
                                    ? participantFiveYear[2].Participation != undefined
                                      ? participantFiveYear[2].Participation.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="participantFiveYear[2] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
              <v-col
                cols="12"
                lg="4"
                md="6"
                sm="6"
                xs="12"
                :xl="display.xl.value ? '3' : '4'"
                :class="display.mdAndDown.value ? 'mt-2' : ''"
                class="pa-0"
              >
                <h4 class="font-weight-medium text-uppercase">Utilization Rate</h4>
                <v-progress-linear
                  v-if="utilizationLoader"
                  color="accent"
                  :indeterminate="true"
                  height="4"
                  style="width: 32%"
                  class="mt-0"
                />
                <v-col class="pt-1 pa-0">
                  <v-row>
                    <v-col cols="6" xl="6" md="6" lg="6" sm="6" xs="6" class="pa-0">
                      <v-col class="mb-1 pa-0">
                        <span class="font_size_11">12 Months</span>
                      </v-col>
                      <v-col class="border_solid pa-0" :class="display.xs.value ? 'mr-2' : 'mr-3'">
                        <h1 class="text-center">
                          {{
                            utilizationOneYear[0] != null
                              ? utilizationOneYear[0].Utilization != undefined
                                ? utilizationOneYear[0].Utilization.toFixed(2)
                                : 0
                              : '--'
                          }}<span v-if="utilizationOneYear[0] != null">%</span>
                        </h1>
                      </v-col>
                      <v-col class="mt-1 pa-0">
                        <v-row>
                          <v-col cols="6" xl="6" class="pa-0">
                            <v-col class="font-weight-medium pa-0">
                              {{ utilizationOneYear[1] != null ? utilizationOneYear[1].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  utilizationOneYear[1] != null
                                    ? utilizationOneYear[1].Utilization != undefined
                                      ? utilizationOneYear[1].Utilization.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="utilizationOneYear[1] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                          <v-col
                            cols="6"
                            xl="6"
                            :class="[
                              display.md.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.xl.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.lg.value ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                            ]"
                            class="pa-0"
                          >
                            <v-col class="font-weight-medium pa-0">
                              {{ utilizationOneYear[2] != null ? utilizationOneYear[2].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  utilizationOneYear[2] != null
                                    ? utilizationOneYear[2].Utilization != undefined
                                      ? utilizationOneYear[2].Utilization.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="utilizationOneYear[2] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                    <v-col cols="6" xl="6" md="6" lg="6" sm="6" xs="6" class="pa-0">
                      <v-col class="mb-1 pa-0">
                        <span class="font_size_11">5 Years Average</span>
                      </v-col>
                      <v-col class="border_solid pa-0" :class="display.xs.value ? '' : 'mr-4'">
                        <h1 class="text-center">
                          {{
                            utilizationFiveYear[0] != null
                              ? utilizationFiveYear[0].Utilization != undefined
                                ? utilizationFiveYear[0].Utilization.toFixed(2)
                                : 0
                              : '--'
                          }}<span v-if="utilizationFiveYear[0] != null">%</span>
                        </h1>
                      </v-col>
                      <v-col class="mt-1 pa-0">
                        <v-row>
                          <v-col cols="6" xl="6" class="pa-0">
                            <v-col class="font-weight-medium pa-0">
                              {{ utilizationFiveYear[1] != null ? utilizationFiveYear[1].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  utilizationFiveYear[1] != null
                                    ? utilizationFiveYear[1].Utilization != undefined
                                      ? utilizationFiveYear[1].Utilization.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="utilizationFiveYear[1] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                          <v-col
                            cols="6"
                            xl="6"
                            :class="[
                              display.md.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.xl.value ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                              display.lg.value ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                            ]"
                            class="pa-0"
                          >
                            <v-col class="font-weight-medium pa-0">
                              {{ utilizationFiveYear[2] != null ? utilizationFiveYear[2].PlanName : '' }}
                            </v-col>
                            <v-col class="pa-0">
                              <h3>
                                {{
                                  utilizationFiveYear[2] != null
                                    ? utilizationFiveYear[2].Utilization != undefined
                                      ? utilizationFiveYear[2].Utilization.toFixed(2)
                                      : 0
                                    : '--'
                                }}<span v-if="utilizationFiveYear[2] != null">%</span>
                              </h3>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
            </v-row>
            <v-row v-if="planId < 0">
              <v-row justify="center" align="center" class="text-center">
                <v-col cols="12" xs="12" class="pa-0">
                  <h2 class="mb-1 mt-1">No market data available for this plan</h2>
                </v-col>
              </v-row>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>

<script>
import { ref, computed, inject, getCurrentInstance, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
export default {
  props: ['SEINPNO', 'planId', 'planName'],
  setup(props) {
    const instance = getCurrentInstance()
    const $route = useRoute()
    const display = useDisplay()
    const theme = useTheme()
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const $toast = instance.appContext.config.globalProperties.$toast
    const eventBus = inject('eventBus')
    const diagnosticPanel = ref(true)
    const netAnualizeFiveYear = ref([])
    const netAnualizeOneYear = ref([])
    const participantOneYear = ref([])
    const participantFiveYear = ref([])
    const utilizationOneYear = ref([])
    const utilizationFiveYear = ref([])
    const asOfDate = ref(new Date())
    const performanceLoading = ref(false)
    const implicit = ref(true)
    const netAnnualizeLoader = ref(true)
    const participantLoader = ref(true)
    const utilizationLoader = ref(true)
    const panel = ref(false)
    const reportDialog = ref(false)
    const showDiagnostic = ref(true)
    const planType = ref('')
    const showHideDiagnostic = (val) => {
      if ($authz.hasPermission($authz.permissionSet.Express_Diagnostic__c, $authz.permission.Full)) {
        if (props.planId > 0) {
          if (val === $authz.firmRelationship.Pooled_Employer_Plan) {
            showDiagnostic.value = false
          } else if (val === $authz.firmRelationship.Single_Employer_Plan) {
            if (planType.value) {
              if (
                planType.value === $authz.planType.Defined_Contribution_Plan ||
                planType.value === $authz.planType.ERISA_403_b
              ) {
                showDiagnostic.value = true
              } else showDiagnostic.value = false
            }
          }
        }
      }
    }
    const getNetAnualizeReturn = () => {
      $axios
        .get(`/api/v1/tal/plan/${props.SEINPNO}/performance/${0}`)
        .then((success) => {
          if (success.data.d != null) {
            netAnualizeFiveYear.value = success.data.d['fiveYear']
            netAnualizeOneYear.value = success.data.d['oneYear']
            if (netAnualizeFiveYear.value.length > 0) {
              netAnualizeFiveYear.value.forEach((element) => {
                element.Return = element.Return * 100
              })
            }
            if (netAnualizeOneYear.value.length > 0) {
              netAnualizeOneYear.value.forEach((element) => {
                element.Return = element.Return * 100
              })
            }
          }
          netAnnualizeLoader.value = false
        })
        .catch(() => {
          netAnnualizeLoader.value = false
        })
    }
    const getParticipantRate = () => {
      $axios
        .get(`/api/v1/tal/plan/${props.SEINPNO}/performance/${1}`)
        .then((success) => {
          if (success.data.d != null) {
            participantFiveYear.value = success.data.d['fiveYear']
            participantOneYear.value = success.data.d['oneYear']
            if (participantFiveYear.value.length > 0) {
              participantFiveYear.value.forEach((element) => {
                element.Participation = element.Participation * 100
              })
            }
            if (participantOneYear.value.length > 0) {
              participantOneYear.value.forEach((element) => {
                element.Participation = element.Participation * 100
              })
            }
          }
          participantLoader.value = false
        })
        .catch(() => {
          participantLoader.value = false
        })
    }
    const getUtilizationRate = () => {
      $axios
        .get(`/api/v1/tal/plan/${props.SEINPNO}/performance/${2}`)
        .then((success) => {
          if (success.data.d != null) {
            utilizationFiveYear.value = success.data.d['fiveYear']
            utilizationOneYear.value = success.data.d['oneYear']
            if (utilizationFiveYear.value.length > 0) {
              utilizationFiveYear.value.forEach((element) => {
                element.Utilization = element.Utilization * 100
              })
            }
            if (utilizationOneYear.value.length > 0) {
              utilizationOneYear.value.forEach((element) => {
                element.Utilization = element.Utilization * 100
              })
            }
          }
          utilizationLoader.value = false
        })
        .catch(() => {
          utilizationLoader.value = false
        })
    }
    const onPopUpEvent = (url, data) => {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          $toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    const getReport = () => {
      var reportRequest = {
        seinPNumber: props.SEINPNO,
        preparedby: $store.state.user.name,
        planID: props.planId,
        implicit: implicit.value,
        isExpress: true,
        planName: props.planName
      }
      performanceLoading.value = true
      reportDialog.value = true
      $axios('/api/v1/tal/report/diagnostic', {
        method: 'POST',
        data: reportRequest
      })
        .then((response) => {
          onPopUpEvent(
            `/api/v1/tal/report/diagnostic/download?reportName=${encodeURIComponent(response.data.reportName)}`,
            response.data.reportName
          )
          performanceLoading.value = false
          reportDialog.value = false
        })
        .catch(() => {
          performanceLoading.value = false
          reportDialog.value = false
        })
    }
    const fontSize = computed(() => {
      return 12
    })
    watch(
      () => props.SEINPNO,
      () => {
        getNetAnualizeReturn()
        getParticipantRate()
        getUtilizationRate()
      }
    )
    onMounted(() => {
      if ($authz.hasPermission($authz.permissionSet.Express_Diagnostic__c, $authz.permission.Full)) {
        if ($route.params.planType) {
          planType.value = $route.params.planType
          if (planType.value === $authz.planType.Defined_Contribution_Plan || planType.value === $authz.planType.ERISA_403_b) {
            showDiagnostic.value = true
          } else {
            showDiagnostic.value = false
          }
        } else showDiagnostic.value = true
      } else showDiagnostic.value = false
      if (!props.SEINPNO) return
      getNetAnualizeReturn()
      getParticipantRate()
      getUtilizationRate()
      eventBus.on('saveESPValue', (data) => {
        showHideDiagnostic(data)
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('saveESPValue')
    })
    return {
      theme,
      display,
      panel,
      showDiagnostic,
      reportDialog,
      performanceLoading,
      netAnnualizeLoader,
      netAnualizeOneYear,
      fontSize,
      participantLoader,
      utilizationLoader,
      utilizationOneYear,
      participantFiveYear,
      participantOneYear,
      netAnualizeFiveYear,
      utilizationFiveYear,
      diagnosticPanel,
      asOfDate,
      getReport
    }
  }
}
</script>
<style scoped>
.rotate_icon {
  transform: rotate(-180deg) !important;
}
.border_solid {
  border: solid 1px grey;
}
.font_size_11 {
  font-size: 0.85em !important;
}
.grey_dark {
  color: #616161 !important;
}

.main_class .v-label {
  top: -3px !important;
  color: white !important;
}

.hr_border {
  border: solid 1px lightgray !important;
  height: 30px;
}
.cardbackground.light {
  background: #f6f6f6 !important;
}
.cardbackground.dark {
  background: rgba(246, 246, 246, 0.1) !important;
}
</style>
