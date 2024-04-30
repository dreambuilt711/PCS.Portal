<template>
  <v-col :class="$vuetify?.theme.dark ? 'cardbackground dark' : 'cardbackground light'">
    <v-row :class="$vuetify?.breakpoint?.smAndDown ? 'pl-3 pt-2' : 'pl-4 pt-2'">
      <v-col xs12>
        <v-row>
          <v-col sm4 xs12 class="text-left">
            <h2>
              <span class="cursor-pointer font-weight-medium" @click="panel = !panel">
                <v-icon :color="$vuetify?.theme.dark ? '' : 'black'" :class="panel ? 'rotate_icon' : ''" class="mr-2"
                  >arrow_drop_down</v-icon
                >Market Insight
              </span>
            </h2>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="panel" xs12>
        <v-col class="pt-3 pb-3">
          <v-row
            v-if="
              showNetAnualizeFiveYear ||
              showNetAnualizeOneYear ||
              showParticipantFiveYear ||
              showParticipantOneYear ||
              showUtilizationFiveYear ||
              showUtilizationOneYear
            "
          >
            <v-col lg4 md6 sm6 xs12 :class="$vuetify?.breakpoint?.xl ? 'xl3' : 'xl4'">
              <h4 class="font-weight-medium text-uppercase">Net Annualized Total Return</h4>
              <v-progress-linear
                v-if="netAnnualizeLoader"
                color="accent"
                :indeterminate="true"
                height="4"
                style="width: 57%"
                class="mt-0"
              />
              <v-col pt-1>
                <v-row>
                  <v-col xl6 md6 lg6 sm6 xs6>
                    <v-col mb-1>
                      <span class="font_size_11">12 Months</span>
                    </v-col>
                    <v-col class="border_solid" :class="$vuetify?.breakpoint?.xs ? 'mr-2' : 'mr-3'">
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
                    <v-col mt-1>
                      <v-row>
                        <v-col xl6>
                          <v-col class="font-weight-medium">
                            netAnualizeOneYear[1] != null ? netAnualizeOneYear[1].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                          xl6
                          :class="[
                            $vuetify?.breakpoint?.md ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.xl ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.lg ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                          ]"
                        >
                          <v-col class="font-weight-medium">
                            netAnualizeOneYear[2] != null ? netAnualizeOneYear[2].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                  <v-col xl6 md6 lg6 sm6 xs6>
                    <v-col mb-1>
                      <span class="font_size_11">5 Years Average</span>
                    </v-col>
                    <v-col class="border_solid" :class="$vuetify?.breakpoint?.xs ? '' : 'mr-4'">
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
                    <v-col mt-1>
                      <v-row>
                        <v-col xl6>
                          <v-col class="font-weight-medium">
                            netAnualizeFiveYear[1] != null ? netAnualizeFiveYear[1].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                          xl6
                          :class="[
                            $vuetify?.breakpoint?.md ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.xl ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.lg ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                          ]"
                        >
                          <v-col class="font-weight-medium">
                            netAnualizeFiveYear[2] != null ? netAnualizeFiveYear[2].PlanName : '' }}
                          </v-col>
                          <v-col>
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
            <v-col lg4 md6 sm6 xs12 :class="[$vuetify?.breakpoint?.xl ? 'xl3' : 'xl4', $vuetify?.breakpoint?.xs ? 'mt-2' : '']">
              <h4 class="font-weight-medium text-uppercase">Participation Rate</h4>
              <v-progress-linear
                v-if="participantLoader"
                color="accent"
                :indeterminate="true"
                height="4"
                style="width: 36%"
                class="mt-0"
              />
              <v-col pt-1>
                <v-row>
                  <v-col xl6 md6 lg6 sm6 xs6>
                    <v-col mb-1>
                      <span class="font_size_11">12 Months</span>
                    </v-col>
                    <v-col class="border_solid" :class="$vuetify?.breakpoint?.xs ? 'mr-2' : 'mr-3'">
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
                    <v-col mt-1>
                      <v-row>
                        <v-col xl6>
                          <v-col class="font-weight-medium">
                            participantOneYear[1] != null ? participantOneYear[1].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                          xl6
                          :class="[
                            $vuetify?.breakpoint?.md ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.xl ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.lg ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                          ]"
                        >
                          <v-col class="font-weight-medium">
                            participantOneYear[2] != null ? participantOneYear[2].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                  <v-col xl6 md6 lg6 sm6 xs6>
                    <v-col mb-1>
                      <span class="font_size_11">5 Years Average</span>
                    </v-col>
                    <v-col class="border_solid" :class="$vuetify?.breakpoint?.xs ? '' : 'mr-4'">
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
                    <v-col mt-1>
                      <v-row>
                        <v-col xl6>
                          <v-col class="font-weight-medium">
                            participantFiveYear[1] != null ? participantFiveYear[1].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                          xl6
                          :class="[
                            $vuetify?.breakpoint?.md ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.xl ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.lg ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                          ]"
                        >
                          <v-col class="font-weight-medium">
                            participantFiveYear[2] != null ? participantFiveYear[2].PlanName : '' }}
                          </v-col>
                          <v-col>
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
              lg4
              md6
              sm6
              xs12
              :class="[$vuetify?.breakpoint?.xl ? 'xl3' : 'xl4', $vuetify?.breakpoint?.mdAndDown ? 'mt-2' : '']"
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
              <v-col pt-1>
                <v-row>
                  <v-col xl6 md6 lg6 sm6 xs6>
                    <v-col mb-1>
                      <span class="font_size_11">12 Months</span>
                    </v-col>
                    <v-col class="border_solid" :class="$vuetify?.breakpoint?.xs ? 'mr-2' : 'mr-3'">
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
                    <v-col mt-1>
                      <v-row>
                        <v-col xl6>
                          <v-col class="font-weight-medium">
                            utilizationOneYear[1] != null ? utilizationOneYear[1].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                          xl6
                          :class="[
                            $vuetify?.breakpoint?.md ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.xl ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.lg ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                          ]"
                        >
                          <v-col class="font-weight-medium">
                            utilizationOneYear[2] != null ? utilizationOneYear[2].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                  <v-col xl6 md6 lg6 sm6 xs6>
                    <v-col mb-1>
                      <span class="font_size_11">5 Years Average</span>
                    </v-col>
                    <v-col class="border_solid" :class="$vuetify?.breakpoint?.xs ? '' : 'mr-4'">
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
                    <v-col mt-1>
                      <v-row>
                        <v-col xl6>
                          <v-col class="font-weight-medium">
                            utilizationFiveYear[1] != null ? utilizationFiveYear[1].PlanName : '' }}
                          </v-col>
                          <v-col>
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
                          xl6
                          :class="[
                            $vuetify?.breakpoint?.md ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.xl ? (fontSize > 14 ? 'pl-4' : 'pl-5') : '',
                            $vuetify?.breakpoint?.lg ? (fontSize > 14 ? 'pl-3' : 'pl-4') : ''
                          ]"
                        >
                          <v-col class="font-weight-medium">
                            utilizationFiveYear[2] != null ? utilizationFiveYear[2].PlanName : '' }}
                          </v-col>
                          <v-col>
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
          <v-row v-else>
            <v-row justify="center" align="center" class="text-center">
              <v-col xs12>
                <h2 class="mb-1 mt-1">No market data available for this plan</h2>
              </v-col>
            </v-row>
          </v-row>
        </v-col>
      </v-col>
    </v-row>
    <v-col :class="$vuetify?.breakpoint?.smAndDown ? 'pl-3 pt-2 pb-2' : 'pl-4 pt-2 pb-2'">
      <v-col xs12>
        <v-row>
          <v-col sm4 xs12 class="text-left">
            <h2>
              <span class="cursor-pointer font-weight-medium" @click="panel1 = !panel1">
                <v-icon :color="$vuetify?.theme.dark ? '' : 'black'" :class="panel1 ? 'rotate_icon' : ''" class="mr-2"
                  >arrow_drop_down</v-icon
                >Plan Insight
              </span>
            </h2>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="panel1" xs12>
        <v-col class="pb-3 xl12 pt-3" :class="$vuetify?.breakpoint?.smAndDown ? 'pr-2 pl-2' : ''">
          <v-row>
            <v-col lg7 md8 sm12 xs12 :class="fontSize > 14 ? 'xl7' : 'xl6'">
              <h4 class="pb-2 text-uppercase">
                <b>Participation</b>
              </h4>
              <v-col>
                <v-progress-linear
                  v-if="planInformationLoading"
                  color="accent"
                  :indeterminate="true"
                  height="4"
                  style="width: 14%"
                  class="mt-0"
                />
                <v-row>
                  <v-col
                    xl4
                    md4
                    sm4
                    :class="[
                      $vuetify?.breakpoint?.width <= 320 ? 'xs12' : 'xs6',
                      $vuetify?.breakpoint?.width === 1280 || fontSize > 14 ? 'lg3' : 'lg4'
                    ]"
                  >
                    <v-col
                      :class="[
                        !$vuetify?.theme.dark ? 'grey--text text--darken-1' : '',
                        $vuetify?.breakpoint?.lgAndDown && fontSize > 12 ? 'font-size-performance' : ''
                      ]"
                    >
                      Participants with a Balance
                    </v-col>
                    <v-col
                      class="border_solid"
                      :class="$vuetify?.breakpoint?.xs || $vuetify?.breakpoint?.mdOnly ? 'mr-2' : 'mr-4'"
                    >
                      <h3 class="text-center pa-2">
                        <b>{{
                          selectedPlan.ParticipantsWithABalance != null && !planInformationLoading
                            ? selectedPlan.ParticipantsWithABalance
                            : '--'
                        }}</b>
                      </h3>
                    </v-col>
                  </v-col>
                  <v-col xl4 md4 lg4 sm4 :class="$vuetify?.breakpoint?.width <= 320 ? 'xs12' : 'xs6'">
                    <v-col
                      :class="[
                        !$vuetify?.theme.dark ? 'grey--text text--darken-1' : '',
                        $vuetify?.breakpoint?.lgAndDown && fontSize > 12 ? 'font-size-performance' : ''
                      ]"
                    >
                      Active Participants with a balance
                    </v-col>
                    <v-col
                      class="border_solid"
                      :class="$vuetify?.breakpoint?.xs ? '' : $vuetify?.breakpoint?.mdOnly ? 'mr-2' : 'mr-4'"
                    >
                      <h3 class="text-center pa-2">
                        <b>{{
                          selectedPlan.ActiveParticipantsWithABalance != null && !planInformationLoading
                            ? selectedPlan.ActiveParticipantsWithABalance
                            : '--'
                        }}</b>
                      </h3>
                    </v-col>
                  </v-col>
                  <v-col
                    xl4
                    md4
                    sm4
                    :class="[
                      $vuetify?.breakpoint?.xs ? 'mt-1 pr-2' : '',
                      $vuetify?.breakpoint?.width <= 320 ? 'xs12' : 'xs6',
                      $vuetify?.breakpoint?.width === 1280 || fontSize > 14 ? 'lg5' : 'lg4'
                    ]"
                  >
                    <v-col
                      :class="[
                        !$vuetify?.theme.dark ? 'grey--text text--darken-1' : '',
                        $vuetify?.breakpoint?.lgAndDown && fontSize > 12 ? 'font-size-performance' : ''
                      ]"
                    >
                      Eligible Not Contributing
                    </v-col>
                    <v-col
                      class="border_solid"
                      :class="$vuetify?.breakpoint?.xs ? '' : $vuetify?.breakpoint?.mdOnly ? 'mr-2' : 'mr-4'"
                    >
                      <h3 class="text-center pa-2">
                        <b>{{
                          selectedPlan.EligibleNotContributing != null && !planInformationLoading
                            ? selectedPlan.EligibleNotContributing
                            : '--'
                        }}</b>
                      </h3>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col lg5 md8 sm12 xs12 xl4 :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-3' : ''">
              <h4
                :class="[
                  $vuetify?.breakpoint?.smAndDown ? 'pt-2 pb-2 text-uppercase' : 'pb-2 text-uppercase',
                  $vuetify?.breakpoint?.mdOnly ? 'pt-2' : ''
                ]"
              >
                <b>Allocation</b>
              </h4>
              <v-col>
                <v-progress-linear
                  v-if="planInformationLoading"
                  color="accent"
                  :indeterminate="true"
                  height="4"
                  style="width: 17%"
                  class="mt-0"
                />
                <v-row>
                  <v-col xl6 md4 lg6 sm4 xs6>
                    <v-col
                      :class="[
                        !$vuetify?.theme.dark ? 'grey--text text--darken-1' : '',
                        $vuetify?.breakpoint?.lgAndDown && fontSize > 12 ? 'font-size-performance' : ''
                      ]"
                    >
                      # of Models
                    </v-col>
                    <v-col
                      class="border_solid"
                      :class="$vuetify?.breakpoint?.xs || $vuetify?.breakpoint?.mdOnly ? 'mr-2' : 'mr-4'"
                    >
                      <h3 class="text-center pa-2">
                        <b>{{
                          selectedPlan.Models != null && !planInformationLoading
                            ? selectedPlan.Models
                            : selectedPlan.Models == null
                              ? 0
                              : '--'
                        }}</b>
                      </h3>
                    </v-col>
                  </v-col>
                  <v-col xl6 md4 lg6 sm4 xs6>
                    <v-col
                      :class="[
                        !$vuetify?.theme.dark ? 'grey--text text--darken-1' : '',
                        $vuetify?.breakpoint?.lgAndDown && fontSize > 12 ? 'font-size-performance' : ''
                      ]"
                    >
                      # of Investments
                    </v-col>
                    <v-col
                      class="border_solid"
                      :class="$vuetify?.breakpoint?.xs || $vuetify?.breakpoint?.mdOnly ? 'mr-2' : 'mr-4'"
                    >
                      <h3 class="text-center pa-2">
                        <b>{{
                          selectedPlan.Investments != null && !planInformationLoading
                            ? selectedPlan.Investments
                            : selectedPlan.Investments == null
                              ? 0
                              : '--'
                        }}</b>
                      </h3>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-col>
  </v-col>
</template>
<script>
export default {
  props: ['selectedPlan', 'SEINPNO'],
  data() {
    return {
      planInformationLoading: true,
      netAnualizeFiveYear: [],
      netAnualizeOneYear: [],
      participantOneYear: [],
      participantFiveYear: [],
      utilizationOneYear: [],
      utilizationFiveYear: [],
      netAnnualizeLoader: true,
      participantLoader: true,
      utilizationLoader: true,
      panel: false,
      showNetAnualizeFiveYear: true,
      showNetAnualizeOneYear: true,
      showParticipantOneYear: true,
      showParticipantFiveYear: true,
      showUtilizationOneYear: true,
      showUtilizationFiveYear: true,
      panel1: false
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
    }
  },
  watch: {
    selectedPlan: {
      handler() {
        this.planInformationLoading = false
      }
    },
    SEINPNO: function () {
      this.getNetAnualizeReturn()
      this.getParticipantRate()
      this.getUtilizationRate()
    }
  },
  mounted() {
    if (!this.SEINPNO) return
    this.getNetAnualizeReturn()
    this.getParticipantRate()
    this.getUtilizationRate()
  },
  methods: {
    getNetAnualizeReturn() {
      this.$axios
        .get(`/api/v1/tal/plan/${this.SEINPNO}/performance/${0}`)
        .then((success) => {
          if (success.data.d != null) {
            this.netAnualizeFiveYear = success.data.d['fiveYear']
            this.netAnualizeOneYear = success.data.d['oneYear']
            if (this.netAnualizeFiveYear.length > 0) {
              this.netAnualizeFiveYear.forEach((element) => {
                element.Return = element.Return * 100
              })
              var anualizeFiveYear = this.netAnualizeFiveYear.filter((a) => a.Return > 0)
              this.showNetAnualizeFiveYear = anualizeFiveYear && anualizeFiveYear.length > 0 ? true : false
            }
            if (this.netAnualizeOneYear.length > 0) {
              this.netAnualizeOneYear.forEach((element) => {
                element.Return = element.Return * 100
              })
              let anualizeOneYear = this.netAnualizeOneYear.filter((a) => a.Return > 0)
              this.showNetAnualizeOneYear = anualizeOneYear && anualizeOneYear.length > 0 ? true : false
            }
          }
          this.netAnnualizeLoader = false
        })
        .catch(() => {
          this.netAnnualizeLoader = false
        })
    },
    getParticipantRate() {
      this.$axios
        .get(`/api/v1/tal/plan/${this.SEINPNO}/performance/${1}`)
        .then((success) => {
          if (success.data.d != null) {
            this.participantFiveYear = success.data.d['fiveYear']
            this.participantOneYear = success.data.d['oneYear']
            if (this.participantFiveYear.length > 0) {
              this.participantFiveYear.forEach((element) => {
                element.Participation = element.Participation * 100
              })
              var partFiveYear = this.participantFiveYear.filter((a) => a.Return > 0)
              this.showParticipantFiveYear = partFiveYear && partFiveYear.length > 0 ? true : false
            }
            if (this.participantOneYear.length > 0) {
              this.participantOneYear.forEach((element) => {
                element.Participation = element.Participation * 100
              })
              var partOneYear = this.participantOneYear.filter((a) => a.Return > 0)
              this.showParticipantOneYear = partOneYear && partOneYear.length > 0 ? true : false
            }
          }
          this.participantLoader = false
        })
        .catch(() => {
          this.participantLoader = false
        })
    },
    getUtilizationRate() {
      this.$axios
        .get(`/api/v1/tal/plan/${this.SEINPNO}/performance/${2}`)
        .then((success) => {
          if (success.data.d != null) {
            this.utilizationFiveYear = success.data.d['fiveYear']
            this.utilizationOneYear = success.data.d['oneYear']
            if (this.utilizationFiveYear.length > 0) {
              this.utilizationFiveYear.forEach((element) => {
                element.Utilization = element.Utilization * 100
              })
              var utilizeFiveYear = this.utilizationFiveYear.filter((a) => a.Return > 0)
              this.showUtilizationFiveYear = utilizeFiveYear && utilizeFiveYear.length > 0 ? true : false
            }
            if (this.utilizationOneYear.length > 0) {
              this.utilizationOneYear.forEach((element) => {
                element.Utilization = element.Utilization * 100
              })
              var utilizeOneYear = this.utilizationOneYear.filter((a) => a.Return > 0)
              this.showUtilizationOneYear = utilizeOneYear && utilizeOneYear.length > 0 ? true : false
            }
          }
          this.utilizationLoader = false
        })
        .catch(() => {
          this.utilizationLoader = false
        })
    }
  }
}
</script>
<style scoped>
.border_solid {
  border: solid 1px #9c9c9c;
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
  margin: 20px 0px;
}
.font-size-performance {
  font-size: 0.843em !important;
}
.cardbackground.light {
  background: #f6f6f6 !important;
}
.cardbackground.dark {
  background: rgba(246, 246, 246, 0.1) !important;
}
</style>
