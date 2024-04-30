<template>
  <v-card class="elevation-3" height="100%" min-height="600px">
    <Loader :loading-text="`Loading results..`" :loading="showPlanLoader" />
    <v-col class="pa-5">
      <v-col :class="!$vuetify?.breakpoint?.xs ? 'pb-4' : ''">
        <v-row no-gutters>
          <v-col md="12" sm="12" cols="12" lg="12" xl="12">
            <h3 class="font_24" :class="$vuetify?.theme.dark ? '' : 'text-black'">Prospect Pipeline</h3>
          </v-col>
        </v-row>
      </v-col>
      <v-card v-if="!$vuetify?.breakpoint?.xs" class="elevation-0 pt-2">
        <div class="flex d-flex flex-row" style="height: 40px" :class="$vuetify?.breakpoint?.width === 1024 ? 'pl-6' : 'pl-4'">
          <div class="start_polygon background_grey rounded-s-lg" :class="screenClass">
            <div class="pt-3">
              <div>
                <h5 class="headerClass" :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '', aumClass]">
                  AUM
                  {{ currencyConvert(totalFinalAUM ? totalFinalAUM : 0) }}
                </h5>
              </div>
            </div>
          </div>
          <div
            class="cursor-pointer middle_polygon prospectingBackground"
            :class="screenClass"
            @click="viewDetailsWithStatus('Prospecting')"
          >
            <div class="pt-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '', prospectClass]">
                  <b class="steppercss"> Prospecting </b>
                </h5>
              </div>
            </div>
          </div>
          <div
            v-if="
              !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)
            "
            class="cursor-pointer middle_polygon evaluatingBackground"
            :class="screenClass"
            @click="viewDetailsWithStatus('Evaluating')"
          >
            <div class="pt-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '', evaluateClass]">
                  <b class="steppercss"> Evaluating </b>
                </h5>
              </div>
            </div>
          </div>
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            class="cursor-pointer middle_polygon proposingBackground"
            :class="screenClass"
            @click="viewDetailsWithStatus('Proposing')"
          >
            <div class="pt-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '', proposeClass]">
                  <b class="steppercss"> Proposing </b>
                </h5>
              </div>
            </div>
          </div>
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            class="cursor-pointer middle_polygon finalizingBackground"
            :class="screenClass"
            @click="viewDetailsWithStatus('Finalizing')"
          >
            <div class="pt-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '', finalizeClass]">
                  <b class="steppercss"> Finalizing </b>
                </h5>
              </div>
            </div>
          </div>
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            class="cursor-pointer end_polygon rounded-e-lg completedBackground"
            :class="completedClass"
            @click="viewDetailsWithStatus('Completed')"
          >
            <div class="pt-3">
              <div class="text-center">
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '']">
                  <b class="steppercss"> Completed </b>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </v-card>
      <div v-if="$vuetify?.breakpoint?.xs" class="slider-container">
        <div class="slide">
          <div class="cursor-pointer start_polygon prospectingBackground rounded-s-lg" @click="displayProspecting()">
            <div class="pt-3 pb-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '']">
                  <b class="steppercss pl-16 ml-14"> Prospecting </b>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div class="slide">
          <div
            v-if="
              !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
              !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)
            "
            class="cursor-pointer middle_polygon evaluatingBackground"
            @click="displayEvaluating()"
          >
            <div class="pt-3 pb-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '']">
                  <b class="steppercss pl-16 ml-14"> Evaluating </b>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div class="slide">
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            class="cursor-pointer middle_polygon proposingBackground"
            @click="displayProposing()"
          >
            <div class="pt-3 pb-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '']">
                  <b class="steppercss pl-16 ml-14"> Proposing </b>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div class="slide">
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            class="cursor-pointer middle_polygon finalizingBackground"
            @click="displayFinalizing()"
          >
            <div class="pt-3 pb-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '']">
                  <b class="steppercss pl-16 ml-14"> Finalizing </b>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div class="slide completedWidth">
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            class="cursor-pointer end_polygon rounded-e-lg completedBackground"
            @click="displayCompleted()"
          >
            <div class="pt-3 pb-3">
              <div>
                <h5 :class="[$vuetify?.theme.dark && comparison ? 'text-black' : '']">
                  <b class="steppercss pl-16 ml-14"> Completed </b>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-col v-if="!$vuetify?.breakpoint?.xs" pt-3>
        <v-col v-if="(forProfitData.length > 0 || participantData.length > 0) && !showPlanLoader">
          <v-col>
            <v-col v-if="showEmployerSponsored" class="headerClass background_grey text-uppercase pt-1 pb-1"> Sponsors </v-col>
            <v-col>
              <v-row v-if="showEmployerSponsored && forProfitData.length > 0">
                <v-col
                  class="pl-0 pr-0 text-center"
                  pt-4
                  lg3
                  md3
                  sm3
                  pb-3
                  :class="$vuetify?.breakpoint?.width === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  <v-row no-gutters>
                    <v-col lg3 md3 pt-2>
                      <v-icon
                        size="18"
                        class="icon-for-profit"
                        :class="showEmployerSponsored ? 'forProfitIcon' : 'disabledColor'"
                      />
                    </v-col>
                    <v-col
                      lg9
                      md9
                      class="text-left"
                      :class="
                        !$vuetify?.theme.dark
                          ? showEmployerSponsored
                            ? 'text-hyperlink cursor-pointer'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="showEmployerSponsored ? viewDetails('For Profit') : ''"
                    >
                      Employer <br />Sponsored
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg1 md1 sm1 mx-4>
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatus(forProfitData[0].StageName)"
                    >
                      {{ forProfitData[0].Plans ? forProfitData[0].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(forProfitData[0].Assets ? forProfitData[0].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col
                      :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatus(forProfitData[1].StageName)"
                    >
                      {{ forProfitData[1].Plans ? forProfitData[1].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(forProfitData[1].Assets ? forProfitData[1].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col
                      :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatus(forProfitData[2].StageName)"
                    >
                      {{ forProfitData[2].Plans ? forProfitData[2].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(forProfitData[2].Assets ? forProfitData[2].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col
                      :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatus(forProfitData[3].StageName)"
                    >
                      {{ forProfitData[3].Plans ? forProfitData[3].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(forProfitData[3].Assets ? forProfitData[3].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col
                      :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass">
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatus(forProfitData[4].StageName)"
                    >
                      {{ forProfitData[4].Plans ? forProfitData[4].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(forProfitData[4].Assets ? forProfitData[4].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col
                      :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
              </v-row>
              <v-divider v-if="showSchool && false" class="mt-1" />
              <v-row v-if="showSchool && false">
                <v-col
                  class="pl-0 pr-0 text-center"
                  pt-4
                  lg3
                  md3
                  sm3
                  pb-4
                  :class="$vuetify?.breakpoint?.width === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  <v-row no-gutters>
                    <v-col lg3 md3>
                      <v-icon size="18" class="icon-schools" :class="showSchool ? 'schoolIcon' : 'disabledColor'" />
                    </v-col>
                    <v-col
                      lg9
                      md9
                      class="text-left"
                      :class="
                        !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                      "
                      @click="showSchool ? viewDetails('Public Schools') : ''"
                    >
                      Schools
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg1 md1 sm1 mx-4>
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                      "
                    >
                      {{ publicSchoolData[0].Plans ? publicSchoolData[0].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(publicSchoolData[0].Assets ? publicSchoolData[0].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                      "
                    >
                      {{ publicSchoolData[1].Plans ? publicSchoolData[1].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(publicSchoolData[1].Assets ? publicSchoolData[1].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                      "
                    >
                      {{ publicSchoolData[2].Plans ? publicSchoolData[2].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(publicSchoolData[2].Assets ? publicSchoolData[2].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                      "
                    >
                      {{ publicSchoolData[3].Plans ? publicSchoolData[3].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(publicSchoolData[3].Assets ? publicSchoolData[3].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                      "
                    >
                      {{ publicSchoolData[4].Plans ? publicSchoolData[4].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(publicSchoolData[4].Assets ? publicSchoolData[4].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col v-if="showIndividuals" pt-2>
            <v-col class="headerClass background_grey text-uppercase pt-1 pb-1"> Individuals </v-col>
            <v-col>
              <v-row>
                <v-col
                  class="pl-0 pr-0 text-center"
                  pt-4
                  lg3
                  md3
                  sm3
                  pb-4
                  :class="$vuetify?.breakpoint?.width === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  <v-row no-gutters>
                    <v-col lg3 md3>
                      <v-icon size="18" class="icon-individual" :class="showIndividuals ? 'participantIcon' : 'disabledColor'" />
                    </v-col>
                    <v-col
                      lg9
                      md9
                      class="text-left"
                      :class="
                        !$vuetify?.theme.dark
                          ? showIndividuals
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="showIndividuals ? viewDetails('Participants') : ''"
                    >
                      Individuals
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg1 md1 sm1 mx-4>
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showIndividuals
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatusForIndividual('Initiate', 'Participants')"
                    >
                      {{ participantData[0].Plans ? participantData[0].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(participantData[0].Assets ? participantData[0].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showIndividuals ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showIndividuals
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatusForIndividual('Discover', 'Participants')"
                    >
                      {{ participantData[1].Plans ? participantData[1].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(participantData[1].Assets ? participantData[1].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showIndividuals ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showIndividuals
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatusForIndividual('Discover', 'Participants')"
                    >
                      {{ participantData[2].Plans ? participantData[2].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(participantData[2].Assets ? participantData[2].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showIndividuals ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" lg2 md2 sm2>
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showIndividuals
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatusForIndividual('IndividualEvaluate', 'Participants')"
                    >
                      {{ participantData[3].Plans ? participantData[3].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(participantData[3].Assets ? participantData[3].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showIndividuals ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass">
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="
                        !$vuetify?.theme.dark
                          ? showIndividuals
                            ? 'cursor-pointer text-hyperlink'
                            : 'disabledColor'
                          : 'text-white'
                      "
                      @click="viewDetailsWithStatusForIndividual('Validate', 'Participants')"
                    >
                      {{ participantData[4].Plans ? participantData[4].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(participantData[4].Assets ? participantData[4].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!$vuetify?.theme.dark ? (showIndividuals ? 'text-hyperlink' : 'disabledColor') : 'text-white'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col>
            <v-divider class="mt-1" />
            <v-col>
              <v-row>
                <v-col
                  class="pt-2 pb-2"
                  lg3
                  md3
                  sm3
                  :class="$vuetify?.breakpoint?.width === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  Total
                </v-col>
                <v-col class="text-center pt-2 pb-2" lg1 md1 sm1 mx-4>
                  <v-col>{{ currencyConvert(totalAssets[0] ? totalAssets[0] : 0) }}</v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2" lg2 md2 sm2>
                  <v-col>{{ currencyConvert(totalAssets[1] ? totalAssets[1] : 0) }}</v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2" lg2 md2 sm2>
                  <v-col>{{ currencyConvert(totalAssets[2] ? totalAssets[2] : 0) }}</v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2" lg2 md2 sm2>
                  <v-col>{{ currencyConvert(totalAssets[3] ? totalAssets[3] : 0) }}</v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2">
                  <v-col>{{ currencyConvert(totalAssets[4] ? totalAssets[4] : 0) }}</v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-col>
        <v-col v-if="forProfitData.length === 0 && participantData.length === 0 && !showPlanLoader" ma-1>
          <v-img :src="zeroStateImage" alt="ZeroState" width="100%" height="100%">
            <v-col class="d-flex flex-column justify-center align-center">
              <v-card class="pa-5 mt-10" :width="$vuetify?.breakpoint?.xs ? '88%' : '68%'" height="70%">
                <v-col class="text-center">
                  <v-col>
                    <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
                  </v-col>
                  <v-col pt-5 pb-5 class="font-weight-medium">
                    As you look for new clients this pipeline will keep track your progress from your first call to signed account
                    applications
                  </v-col>
                  <v-col class="font-weight-medium"> Create a prospect or open an account to get started </v-col>
                  <v-col pt-5 class="d-flex justify-center">
                    <v-row>
                      <v-col :class="!$vuetify?.breakpoint?.xs ? 'pl-0' : ''" xs="12">
                        <v-btn
                          v-if="
                            showEmployerSponsored &&
                            $authz.hasPermission($authz.permissionSet.Create_Start_up_Plan__c, $authz.permission.Full)
                          "
                          class="mr-0 text-capitalize"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          @click="createCorporate()"
                        >
                          Create Startup
                        </v-btn>
                      </v-col>
                      <v-col :class="!$vuetify?.breakpoint?.xs ? 'pl-0' : ''" xs="12">
                        <v-btn
                          v-if="showSchool || showIndividuals"
                          class="mr-0 text-capitalize"
                          :color="$vuetify?.theme.dark ? '' : 'accent'"
                          @click="createAccount()"
                        >
                          Open Account
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-card>
            </v-col>
          </v-img>
        </v-col>
      </v-col>
      <v-col v-if="$vuetify?.breakpoint?.xs">
        <v-col>
          <v-col class="headerClass background_grey text-uppercase pt-1 pb-1"> Sponsors </v-col>
          <v-col>
            <v-row v-if="showEmployerSponsored && forProfitData.length > 0">
              <v-col class="pl-0 pr-0 text-center" pt-4 xs6 pb-4>
                <v-row no-gutters>
                  <v-col xs3>
                    <v-icon
                      size="18"
                      class="icon-for-profit"
                      :class="showEmployerSponsored ? 'forProfitIcon' : 'disabledColor'"
                    />
                  </v-col>
                  <v-col
                    xs9
                    class="text-left cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    Employer <br />Sponsored
                  </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                    @click="viewDetailsWithStatus(forProfitData[0].StageName)"
                  >
                    {{ forProfitData[0].Plans ? forProfitData[0].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(forProfitData[0].Assets ? forProfitData[0].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark
                        ? showEmployerSponsored
                          ? 'cursor-pointer text-hyperlink'
                          : 'disabledColor'
                        : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="evaluateStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ forProfitData[1].Plans ? forProfitData[1].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(forProfitData[1].Assets ? forProfitData[1].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark
                        ? showEmployerSponsored
                          ? 'cursor-pointer text-hyperlink'
                          : 'disabledColor'
                        : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ forProfitData[2].Plans ? forProfitData[2].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(forProfitData[2].Assets ? forProfitData[2].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark
                        ? showEmployerSponsored
                          ? 'cursor-pointer text-hyperlink'
                          : 'disabledColor'
                        : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ forProfitData[3].Plans ? forProfitData[3].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(forProfitData[3].Assets ? forProfitData[3].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark
                        ? showEmployerSponsored
                          ? 'cursor-pointer text-hyperlink'
                          : 'disabledColor'
                        : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ forProfitData[4].Plans ? forProfitData[4].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(forProfitData[4].Assets ? forProfitData[4].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark
                        ? showEmployerSponsored
                          ? 'cursor-pointer text-hyperlink'
                          : 'disabledColor'
                        : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
            </v-row>
            <v-divider v-if="showSchool && false" class="mt-1" />
            <v-row v-if="showSchool && false">
              <v-col class="pl-0 pr-0 text-center" pt-4 xs6 pb-4>
                <v-row no-gutters>
                  <v-col xs3>
                    <v-icon size="18" class="icon-schools" :class="showSchool ? 'schoolIcon' : 'disabledColor'" />
                  </v-col>
                  <v-col
                    xs9
                    class="text-left cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    Schools
                  </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ publicSchoolData[0].Plans ? publicSchoolData[0].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[0].Assets ? publicSchoolData[0].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="evaluateStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ publicSchoolData[1].Plans ? publicSchoolData[1].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[1].Assets ? publicSchoolData[1].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ publicSchoolData[2].Plans ? publicSchoolData[2].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[2].Assets ? publicSchoolData[2].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ publicSchoolData[3].Plans ? publicSchoolData[3].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[3].Assets ? publicSchoolData[3].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    {{ publicSchoolData[4].Plans ? publicSchoolData[4].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[4].Assets ? publicSchoolData[4].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="showIndividuals" mt-2 class="headerClass background_grey text-uppercase pt-1 pb-1"> Individuals </v-col>
          <v-col v-if="showIndividuals">
            <v-row>
              <v-col class="pl-0 pr-0 text-center" pt-4 xs6 pb-4>
                <v-row no-gutters>
                  <v-col xs3>
                    <v-icon size="18" class="icon-individual" :class="showIndividuals ? 'participantIcon' : 'disabledColor'" />
                  </v-col>
                  <v-col
                    xs9
                    class="text-left cursor-pointer"
                    :class="!$vuetify?.theme.dark ? (showIndividuals ? 'text-hyperlink' : 'disabledColor') : 'text-white'"
                  >
                    Individuals
                  </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  />
                  <v-col>{{ currencyConvert(participantData[0].Assets ? participantData[0].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="evaluateStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    {{ participantData[1].Plans ? participantData[1].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(participantData[1].Assets ? participantData[1].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    {{ participantData[2].Plans ? participantData[2].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(participantData[2].Assets ? participantData[2].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    {{ participantData[3].Plans ? participantData[3].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(participantData[3].Assets ? participantData[3].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" xs5>
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    {{ participantData[4].Plans ? participantData[4].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(participantData[4].Assets ? participantData[4].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !$vuetify?.theme.dark ? (showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'text-white'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-divider class="mt-1" />
            <v-row>
              <v-col class="pl-0 pr-0 text-center pt-2" xs6>
                <v-row no-gutters>
                  <v-col xs12 class="text-left pl-10"> Total </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2" xs5>
                <v-col>{{ currencyConvert(totalAssets[0] ? totalAssets[0] : 0) }}</v-col>
              </v-col>
              <v-col v-if="evaluateStepper" class="text-center pt-2 pb-2" xs5>
                <v-col>{{ currencyConvert(totalAssets[1] ? totalAssets[1] : 0) }}</v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2" xs5>
                <v-col>{{ currencyConvert(totalAssets[2] ? totalAssets[2] : 0) }}</v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2" xs5>
                <v-col>{{ currencyConvert(totalAssets[3] ? totalAssets[3] : 0) }}</v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2" xs5>
                <v-col>{{ currencyConvert(totalAssets[4] ? totalAssets[4] : 0) }}</v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-col>
      <v-col v-if="!$vuetify?.breakpoint?.xs" pt-3>
        <v-row no-gutters>
          <v-col class="justify-start widgetLeftButtonPosition">
            <v-btn
              v-if="!$authz.hasPermission($authz.permissionSet.My_Pipeline__c, $authz.permission.None)"
              class="ml-0 text-capitalize"
              :color="$vuetify?.theme.dark ? '' : 'accent'"
              @click="showEmployerSponsored ? viewDetails('For Profit') : viewDetails('Participants')"
            >
              View Pipeline
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-end widgetRightButtonPosition">
            <v-row>
              <v-col :class="!$vuetify?.breakpoint?.xs ? 'pl-0' : ''" xs="12">
                <v-btn
                  v-if="
                    showEmployerSponsored &&
                    $authz.hasPermission($authz.permissionSet.Create_Start_up_Plan__c, $authz.permission.Full)
                  "
                  class="mr-0 text-capitalize"
                  :color="$vuetify?.theme.dark ? '' : 'accent'"
                  @click="createCorporate()"
                >
                  Create Startup
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  v-if="showSchool || showIndividuals"
                  class="mr-0 text-capitalize"
                  :color="$vuetify?.theme.dark ? '' : 'accent'"
                  @click="createAccount()"
                >
                  Open Account
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="$vuetify?.breakpoint?.xs" pt-3 xs12>
        <v-col xs12>
          <v-btn
            v-if="!$authz.hasPermission($authz.permissionSet.My_Pipeline__c, $authz.permission.None)"
            class="ml-0 mr-0 text-capitalize mobileViewForProspect"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            @click="viewDetails('For Profit')"
          >
            View Pipeline
          </v-btn>
        </v-col>
        <v-col v-if="showEmployerSponsored || showSchool || showIndividuals" xs12>
          <v-row>
            <v-col>
              <v-btn
                v-if="
                  showEmployerSponsored &&
                  $authz.hasPermission($authz.permissionSet.Create_Start_up_Plan__c, $authz.permission.Full)
                "
                class="ml-0 mr-0 text-capitalize mobileViewForProspect"
                :color="$vuetify?.theme.dark ? '' : 'accent'"
                @click="createCorporate()"
              >
                Create Startup
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                v-if="showSchool || showIndividuals"
                class="ml-0 mr-0 text-capitalize mobileViewForProspect"
                :color="$vuetify?.theme.dark ? '' : 'accent'"
                @click="createAccount()"
              >
                Open Account
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
      <OpenAccount v-model="filterDialog" from-page="OpenFlow" />
    </v-col>
  </v-card>
</template>
<script>
import qs from 'qs'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
import Loader from '@/components/NewLoader'
export default {
  components: {
    OpenAccount,
    Loader
  },
  props: ['from'],
  data() {
    return {
      showPlanLoader: false,
      prospecting: false,
      evaluating: false,
      proposing: false,
      finalizing: false,
      completed: false,
      filterDialog: false,
      prospectStepper: true,
      evaluateStepper: false,
      proposeStepper: false,
      finalizeStepper: false,
      completedStepper: false,
      zeroStateImage: require('@/assets/images/pipeline zero-state-background.svg'),
      drag: false,
      forProfitData: [],
      publicSchoolData: [],
      municipalitiesData: [],
      isIndividualAccount: false,
      nonProfitData: [],
      participantData: [],
      totalAssets: [],
      totalAUM: 0,
      myProspectIndividual: [],
      totalAUMForPlans: 0,
      totalAUMForIndividuals: 0,
      totalFinalAUM: 0
    }
  },
  computed: {
    fontSize() {
      return this.$root.$children[0].fontsize
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
    showSchool() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.Schools
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Schools
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.Schools
          )
        )
      } else return true
    },
    showIndividuals() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.Individuals
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.Individuals
          )
        )
      } else return true
    },
    showMunicipalities() {
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        return this.$authz.allowedByProgram(
          this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          this.$authz.typeOfBusiness.Municipalities
        )
      } else if (
        this.$authz.hasRole(this.$authz.roles.Advisor) ||
        this.$authz.hasRole(this.$authz.roles.Strategist) ||
        this.$authz.hasRole(this.$authz.roles.Fiduciary338)
      ) {
        return (
          this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          ) &&
          this.$authz.allowedByAccount(
            this.$authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            this.$authz.typeOfBusiness.Municipalities
          )
        )
      } else return true
    },
    cardHeightWithFontSize() {
      var fontSize = this.$root.$children[0].fontsize
      if (Number(fontSize) === 8) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '70.5em'
        } else {
          return '58.5em'
        }
      }
      if (Number(fontSize) === 9) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '64.5em'
        } else {
          return '53.5em'
        }
      }
      if (Number(fontSize) === 10) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '60.5em'
        } else {
          return '50.5em'
        }
      }
      if (Number(fontSize) === 11) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '58em'
        } else {
          return '48em'
        }
      }
      if (Number(fontSize) === 12) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '55.5em'
        } else {
          return '46em'
        }
      }
      if (Number(fontSize) === 13) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '53.5em'
        } else {
          return '44.5em'
        }
      }
      if (Number(fontSize) === 14) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '51.5em'
        } else {
          return '42.5em'
        }
      }
      if (Number(fontSize) === 15) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '50em'
        } else {
          return '40.5em'
        }
      }
      if (Number(fontSize) === 16) {
        if (this.$vuetify?.breakpoint?.xs) {
          return '49em'
        } else {
          return '40.5em'
        }
      } else return '44.5em'
    },
    screenClass() {
      if (this.$vuetify?.breakpoint?.width >= 1920 && this.$vuetify?.breakpoint?.height >= 1024) {
        return 'flexWidthBigScreen'
      }
      if (this.$vuetify?.breakpoint?.width === 1366) {
        return 'flexWidthHidpi'
      }
      if (this.$vuetify?.breakpoint?.width === 1280) {
        return 'flexWidthMdpi'
      }
      if (this.$vuetify?.breakpoint?.width === 1024) {
        return 'flexWidthIpadPro'
      }
      if (this.$vuetify?.breakpoint?.width === 667) {
        return 'flexWidthMobileRotate'
      } else return 'flex_width_stepper'
    },
    completedClass() {
      if (this.$vuetify?.breakpoint?.width >= 1920 && this.$vuetify?.breakpoint?.height >= 1024) {
        return 'stepperCompletedBigScreen'
      }
      if (this.$vuetify?.breakpoint?.width === 1366) {
        return 'stepperCompletedHidpi'
      }
      if (this.$vuetify?.breakpoint?.width === 1280) {
        return 'stepperCompletedMdpi'
      }
      if (this.$vuetify?.breakpoint?.width === 1024) {
        return 'stepperCompletedIpadPro'
      } else return 'stepperCompleted'
    },
    aumClass() {
      if (this.$vuetify?.breakpoint?.width === 1366) {
        return 'pl-6'
      }
      if (this.$vuetify?.breakpoint?.width === 1280) {
        return 'pl-4'
      }
      if (this.$vuetify?.breakpoint?.width === 1024) {
        return 'pl-10'
      } else return 'pl-6'
    },
    prospectClass() {
      if (this.$vuetify?.breakpoint?.width === 1366) {
        return 'pl-4'
      }
      if (this.$vuetify?.breakpoint?.width === 1280) {
        return 'pl-3'
      }
      if (this.$vuetify?.breakpoint?.width === 1024) {
        return 'pl-10'
      }
      if (this.$vuetify?.breakpoint?.width === 667) {
        return 'pl-3'
      } else return 'pl-5'
    },
    evaluateClass() {
      if (this.$vuetify?.breakpoint?.width === 1366) {
        return 'pl-5'
      }
      if (this.$vuetify?.breakpoint?.width === 1280) {
        return 'pl-4'
      }
      if (this.$vuetify?.breakpoint?.width === 1024) {
        return 'pl-10'
      }
      if (this.$vuetify?.breakpoint?.width === 667) {
        return 'pl-4'
      } else return 'pl-6'
    },
    proposeClass() {
      if (this.$vuetify?.breakpoint?.width === 1366) {
        return 'pl-5'
      }
      if (this.$vuetify?.breakpoint?.width === 1280) {
        return 'pl-4'
      }
      if (this.$vuetify?.breakpoint?.width === 1024) {
        return 'pl-10'
      }
      if (this.$vuetify?.breakpoint?.width === 667) {
        return 'pl-5'
      } else return 'pl-6'
    },
    finalizeClass() {
      if (this.$vuetify?.breakpoint?.width === 1366) {
        return 'pl-6'
      }
      if (this.$vuetify?.breakpoint?.width === 1280) {
        return 'pl-4'
      }
      if (this.$vuetify?.breakpoint?.width === 1024) {
        return 'pl-10'
      }
      if (this.$vuetify?.breakpoint?.width === 667) {
        return 'pl-5'
      } else return 'pl-7'
    }
  },
  watch: {
    totalAUM: {
      handler() {
        this.totalFinalAUM = this.totalAUMForPlans + this.totalAUMForIndividuals
        if (this.forProfitData.length > 0 && this.participantData.length > 0) {
          this.totalAssets[0] = this.forProfitData[0].Assets + this.participantData[0].Assets
          this.totalAssets[1] = this.forProfitData[1].Assets + this.participantData[1].Assets
          this.totalAssets[2] = this.forProfitData[2].Assets + this.participantData[2].Assets
          this.totalAssets[3] = this.forProfitData[3].Assets + this.participantData[3].Assets
          this.totalAssets[4] = this.forProfitData[4].Assets + this.participantData[4].Assets
        } else if (this.forProfitData.length > 0 && this.participantData.length === 0) {
          this.totalAssets[0] = this.forProfitData[0].Assets
          this.totalAssets[1] = this.forProfitData[1].Assets
          this.totalAssets[2] = this.forProfitData[2].Assets
          this.totalAssets[3] = this.forProfitData[3].Assets
          this.totalAssets[4] = this.forProfitData[4].Assets
        } else if (this.forProfitData.length === 0 && this.participantData.length > 0) {
          this.totalAssets[0] = this.participantData[0].Assets
          this.totalAssets[1] = this.participantData[1].Assets
          this.totalAssets[2] = this.participantData[2].Assets
          this.totalAssets[3] = this.participantData[3].Assets
          this.totalAssets[4] = this.participantData[4].Assets
        } else {
          this.totalAssets[0] = 0
          this.totalAssets[1] = 0
          this.totalAssets[2] = 0
          this.totalAssets[3] = 0
          this.totalAssets[4] = 0
        }
      }
    }
  },
  mounted() {
    this.getDetails()
    this.getProspectIndivualData()
    this.mobileStepperDisplay()
  },
  methods: {
    viewDetails(type) {
      this.$router
        .push({
          name: 'TALProspectPlans',
          params: { Type: type }
        })
        .catch(() => {})
    },
    createAccount() {
      this.$store.state.openAccountDetail = {}
      this.filterDialog = true
    },
    displayInfo(name) {
      if (name === 'Prospecting') {
        this.displayProspecting()
      } else if (name === 'Evaluating') {
        this.displayEvaluating()
      } else if (name === 'Proposing') {
        this.displayProposing()
      } else if (name === 'Finalizing') {
        this.displayFinalizing()
      } else {
        this.displayCompleted()
      }
    },
    openIndividualContactInformation() {
      this.isIndividualAccount = true
    },
    displayProspecting() {
      this.prospectStepper = true
      this.evaluateStepper = false
      this.proposeStepper = false
      this.finalizeStepper = false
      this.completedStepper = false
    },
    displayEvaluating() {
      this.prospectStepper = false
      this.evaluateStepper = true
      this.proposeStepper = false
      this.finalizeStepper = false
      this.completedStepper = false
    },
    displayProposing() {
      this.prospectStepper = false
      this.evaluateStepper = false
      this.proposeStepper = true
      this.finalizeStepper = false
      this.completedStepper = false
    },
    displayFinalizing() {
      this.prospectStepper = false
      this.evaluateStepper = false
      this.proposeStepper = false
      this.finalizeStepper = true
      this.completedStepper = false
    },
    displayCompleted() {
      this.prospectStepper = false
      this.evaluateStepper = false
      this.proposeStepper = false
      this.finalizeStepper = false
      this.completedStepper = true
    },
    getDetails() {
      this.showPlanLoader = true
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
        .get(`/api/v1/advisor/prospects`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          if (success.data.d && success.data.d.length > 0) {
            this.forProfitData = success.data.d
            this.forProfitData.forEach((element) => {
              this.totalAUMForPlans = this.totalAUMForPlans + element.Assets
            })
            this.totalAUM = this.totalAUMForPlans
            this.showPlanLoader = false
          }
        })
    },
    currencyConvert(labelValue) {
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
    },
    viewDetailsWithStatus(statusType) {
      this.$router
        .push({
          name: 'TALProspectPlans',
          params: { statusType: statusType }
        })
        .catch(() => {})
    },
    mobileStepperDisplay() {
      var that = this
      const slider = document.querySelector('.slider-container'),
        slides = Array.from(document.querySelectorAll('.slide'))

      let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID = 0,
        currentIndex = 0

      slides.forEach((slide, index) => {
        const slideImage = slide.querySelector('div')
        slideImage.addEventListener('dragstart', (e) => e.preventDefault())

        // Touch events
        slide.addEventListener('touchstart', touchStart(index))
        slide.addEventListener('touchend', touchEnd)
        slide.addEventListener('touchmove', touchMove)

        // Mouse events
        slide.addEventListener('mousedown', touchStart(index))
        slide.addEventListener('mouseup', touchEnd)
        slide.addEventListener('mouseleave', touchEnd)
        slide.addEventListener('mousemove', touchMove)
      })

      function touchStart(index) {
        return function (event) {
          currentIndex = index
          startPos = getPositionX(event)
          isDragging = true

          // https://css-tricks.com/using-requestanimationframe/
          animationID = requestAnimationFrame(animation)
          slider.classList.add('grabbing')
        }
      }

      function touchEnd() {
        isDragging = false
        cancelAnimationFrame(animationID)

        const movedBy = currentTranslate - prevTranslate

        if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1

        if (movedBy > 100 && currentIndex > 0) currentIndex -= 1

        setPositionByIndex()

        slider.classList.remove('grabbing')
      }

      function touchMove(event) {
        if (isDragging) {
          const currentPosition = getPositionX(event)
          currentTranslate = prevTranslate + currentPosition - startPos
        }
      }

      function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
      }

      function animation() {
        setSliderPosition()
        if (isDragging) requestAnimationFrame(animation)
      }

      function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`
      }

      function setPositionByIndex() {
        currentTranslate = currentIndex * -window.innerWidth
        prevTranslate = currentTranslate
        setSliderPosition()
        if (currentIndex === 0) {
          that.displayProspecting()
        } else if (currentIndex === 1) {
          that.displayEvaluating()
        } else if (currentIndex === 2) {
          that.displayProposing()
        } else if (currentIndex === 3) {
          that.displayFinalizing()
        } else if (currentIndex === 4) {
          that.displayCompleted()
        }
      }
    },
    getProspectIndivualData() {
      this.showPlanLoader = true
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
        .get(`/api/v1/advisor/prospects`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId,
            individual: true
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          this.participantData = success.data.d.length > 0 ? success.data.d : []
          this.participantData.forEach((element) => {
            this.totalAUMForIndividuals = this.totalAUMForIndividuals + element.Assets
          })
          this.totalAUM = this.totalAUMForIndividuals
          this.showPlanLoader = false
        })
        .catch(() => {
          this.showPlanLoader = false
        })
    },
    viewDetailsWithStatusForIndividual(statusType, type) {
      this.$router
        .push({
          name: 'TALProspectPlans',
          params: {
            Type: type,
            statusType: statusType
          }
        })
        .catch(() => {})
    },
    createCorporate() {
      this.$router.push('/TAL/StartupPlan').catch(() => {})
    }
  }
}
</script>
<style scoped>
.background_grey {
  background: #f4f4f4 !important;
}

.margin_left_2 {
  margin-left: 2px !important;
  margin-right: -0.02px !important;
}

.mobileViewForProspect {
  width: 100%;
}
.totalAUM {
  font-size: 10px;
  margin-right: 0;
  align-self: center;
  box-sizing: border-box;
  font-family: 'Roboto';
  color: #777777;
  text-align: left;
  line-height: normal;
}
.steppercss {
  font-weight: bold;
  font-size: 14px;
  margin-right: 0;
  align-self: center;
  box-sizing: border-box;
  font-family: 'Roboto';
  color: #ffffff;
  text-align: left;
  line-height: normal;
}
.alignCenterClass {
  align-self: center;
}
.flex_width_stepper {
  width: 22.5% !important;
  margin: 0 -20px 0 -18px;
}
.stepperCompleted {
  width: 19.2% !important;
  margin: 0 -20px 0 -18px;
}
.flexWidthBigScreen {
  width: 22.3% !important;
  margin: 0 -18px 0 -18px;
}
.stepperCompletedBigScreen {
  width: 19.2% !important;
  margin: 0 -18px 0 -18px;
}
.flexWidthHidpi {
  width: 22.8% !important;
  margin: 0 -18px 0 -18px;
}
.stepperCompletedHidpi {
  width: 20% !important;
  margin: 0 -18px 0 -18px;
}
.flexWidthMdpi {
  width: 22.4% !important;
  margin: 0 -15px 0 -15px;
}
.stepperCompletedMdpi {
  width: 19% !important;
  margin: 0 -15px 0 -15px;
}
.flexWidthIpadPro {
  width: 22.4% !important;
  margin: 0 -25px 0 -25px;
}
.flexWidthMobileRotate {
  width: 23.9% !important;
  margin: 0 -20px 0 -18px;
}
.stepperCompletedIpadPro {
  width: 19% !important;
  margin: 0 -25px 0 -25px;
}
.flex_width_mobile {
  margin: 0 -12px 0 -7px;
}
.start_polygon {
  clip-path: polygon(0% 0%, 80% 0%, 85% 50%, 80% 100%, 0% 100%);
}
.middle_polygon {
  clip-path: polygon(80% 0%, 85% 50%, 80% 100%, 0% 100%, 5% 50%, 0% 0%);
}
.end_polygon {
  clip-path: polygon(0% 0%, 5% 50%, 0% 100%, 100% 100%, 100% 0%);
}
.prospectingBackground {
  background-color: rgb(var(--v-theme-accent-lighten4)) !important;
}
.evaluatingBackground {
  background-color: rgb(var(--v-theme-accent-lighten3)) !important;
}
.proposingBackground {
  background-color: rgb(var(--v-theme-accent-lighten2)) !important;
}
.finalizingBackground {
  background-color: rgb(var(--v-theme-accent-lighten1)) !important;
}
.completedBackground {
  background-color: rgb(var(--v-theme-accent)) !important;
}
.nonSelectedBackground {
  background-color: #dddddd !important;
}
.steppercss {
  font-weight: bold;
  font-size: 14px;
  margin-right: 0;
  align-self: center;
  box-sizing: border-box;
  font-family: 'Roboto';
  color: #ffffff;
  text-align: left;
  line-height: normal;
}
.disabledColor {
  color: rgba(0, 0, 0, 0.54);
}
.widthImage {
  width: 280px;
}
.widthImageMd {
  width: 205px;
}
.overflowClass {
  overflow-x: scroll;
}
.headerClass {
  font-size: 11px;
  background-color: rgba(255, 255, 255, 0);
  box-sizing: border-box;
  font-family: 'Roboto';
  color: #999999;
  text-align: left;
  line-height: normal;
}
</style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.slider-container {
  height: 10vh;
  display: inline-flex;
  overflow: hidden;
  transform: translateX(0);
  transition: transform 0.3s ease-out;
  cursor: grab;
}

.slide {
  max-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
}

.slide div {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease-in-out;
}

.grabbing {
  cursor: grabbing;
}

.grabbing .slide div {
  transform: scale(0.9);
}
.textonImage {
  position: absolute;
}
.completedWidth div {
  max-width: 83%;
}
</style>
