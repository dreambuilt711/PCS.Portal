<template>
  <v-container :fluid="!display.xl.value" :class="display.xs.value ? 'pl-0 pr-0' : ''">
    <v-row class="justify-center">
      <v-col cols="12" :class="display.xs.value ? 'pa-1 pl-3' : 'pa-0'">
        <span
          v-if="breadCrumb.parentName"
          class="text-capitalize font_12 cursor-pointer"
          :class="!theme.dark ? 'text-hyperlink' : ''"
          @click="router.push('/Home/Acquisition').catch(() => {})"
          >{{ breadCrumb.parentName }}</span
        >
        <v-icon size="12" :color="!theme.dark ? 'hyperlink' : ''" class="icon-chevron-right ml-1 mr-1" />
        <span v-if="breadCrumb.parentName" class="text-capitalize font_12" :class="!theme.dark ? 'text-hyperlink' : ''">
          {{ breadCrumb.pageName }}
        </span>
      </v-col>
      <v-col cols="12" sm="12" lg="11" xl="10" class="pa-0">
        <v-col :class="display.xs.value ? 'pa-2' : 'pa-3'">
          <v-col class="pa-0">
            <v-row no-gutters>
              <v-col cols="12" xs="12" class="pa-0">
                <h2 class="text-h6 font_20" :class="theme.dark ? '' : 'text-black'">Prospect Pipeline</h2>
              </v-col>
              <v-row>
                <v-col v-if="!display.xs.value" class="d-flex justify-end pa-0">
                  <v-btn
                    v-if="
                      showEmployerSponsored &&
                      $authz.hasPermission($authz.permissionSet.Create_Start_up_Plan__c, $authz.permission.Full) &&
                      profit &&
                      !planLoader &&
                      pipelinePlans.length > 0
                    "
                    class="mr-0 text-capitalize"
                    :color="theme.dark ? '' : 'accent'"
                    @click="createCorporate()"
                  >
                    Create Startup
                  </v-btn>
                  <v-btn
                    v-if="
                      (showSchool || showIndividuals) && participants && !participantsLoader && pipelineIndividualPlans.length > 0
                    "
                    class="mr-0 text-capitalize"
                    :color="theme.dark ? '' : 'accent'"
                    @click="createAccount()"
                  >
                    Open Account
                  </v-btn>
                </v-col>
              </v-row>
              <v-col v-if="display.xs.value" cols="12" xs="12" class="pt-3 pa-0">
                <v-row no-gutters>
                  <v-col
                    v-if="
                      showEmployerSponsored &&
                      $authz.hasPermission($authz.permissionSet.Create_Start_up_Plan__c, $authz.permission.Full) &&
                      profit &&
                      !planLoader &&
                      pipelinePlans.length > 0
                    "
                    cols="5"
                    xs="5"
                    class="text-left pa-0"
                  >
                    <v-btn class="text-capitalize" :color="theme.dark ? '' : 'accent'" @click="createCorporate()">
                      Create Startup
                    </v-btn>
                  </v-col>
                  <v-col
                    v-if="
                      (showSchool || showIndividuals) && participants && !participantsLoader && pipelineIndividualPlans.length > 0
                    "
                    cols="5"
                    xs="5"
                    class="text-left pa-0"
                  >
                    <v-btn class="text-capitalize" :color="theme.dark ? '' : 'accent'" @click="createAccount()">
                      Open Account
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="OpenFlow" />
          </v-col>
          <v-col v-if="!viewPlans && !display.smAndDown.value" class="pt-2 pa-0" style="transform: translateX(0px)">
            <v-row no-gutters>
              <v-col v-if="showEmployerSponsored" cols="2" lg="1" md="2" xl="1" class="flex_none pr-2 pa-0">
                <v-col v-if="profit" class="font_14 pa-0">
                  <v-btn
                    class="mr-0 ml-0 text-capitalize"
                    :disabled="showEmployerSponsored ? false : true"
                    :color="theme.dark ? '' : 'accent'"
                    @click="showEmployerSponsored ? displayData('For-profits') : ''"
                  >
                    <v-icon size="18" color="#ffffff" class="icon-for-profit pr-2" />For Profit
                  </v-btn>
                </v-col>
                <v-col v-if="!profit" class="pt-2 pa-0">
                  <a
                    class="font_14 cursor-pointer"
                    :class="[!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'text-white']"
                    @click="showEmployerSponsored ? displayData('For-profits') : ''"
                  >
                    <v-icon
                      size="18"
                      class="icon-for-profit pr-2"
                      :class="showEmployerSponsored ? 'forProfitIcon' : 'disabledColor'"
                    />For Profit</a
                  >
                </v-col>
              </v-col>
              <v-col
                v-if="showIndividuals"
                cols="2"
                md="2"
                xl="1"
                lg="1"
                class="pa-0"
                :class="display.width.value <= 1366 ? (display.width.value === 1280 ? 'ml-8' : 'ml-4') : 'ml-3'"
              >
                <v-col v-if="participants" class="font_14 pa-0">
                  <v-btn
                    class="mr-0 text-capitalize"
                    :disabled="showIndividuals ? false : true"
                    :color="theme.dark ? '' : 'accent'"
                    @click="showIndividuals ? displayData('Participants') : ''"
                  >
                    <v-icon size="18" color="#ffffff" class="icon-individual pr-2" /> Individuals
                  </v-btn>
                </v-col>
                <v-col v-if="!participants" class="pt-2 pa-0">
                  <a
                    class="font_14 cursor-pointer"
                    :class="[!theme.dark ? (showIndividuals ? 'text-hyperlink' : 'disabledColor') : 'text-white']"
                    @click="showIndividuals ? displayData('Participants') : ''"
                  >
                    <v-icon
                      size="18"
                      class="icon-individual pr-2"
                      :class="showIndividuals ? 'participantIcon' : 'disabledColor'"
                    />Individuals</a
                  >
                </v-col>
              </v-col>
              <v-col cols="3" lg="3" md="3" xl="3">
                <v-col v-if="!viewPlans" :class="display.width.value <= 1366 ? 'pl-4 pt-2' : 'pl-12 pt-2'">
                  <a
                    class="font_14 cursor-pointer"
                    :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                    @click="displayData('View Plans')"
                  >
                    <v-icon size="18" class="icon-search pr-2 searchDoc" />Search prospect pipeline
                  </a>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="viewPlans && !display.smAndDown.value" cols="6" lg="6" md="8" class="customerMargin pa-0">
            <v-row no-gutters>
              <v-col class="pa-0">
                <v-col class="pt-3 pa-0">
                  <v-text-field
                    v-model="searchSpecificPlan"
                    density="compact"
                    variant="outlined"
                    placeholder="Search prospect pipeline..."
                    autocomplete="false"
                    :menu-props="{ attach: true }"
                    @keyup="searchPipelineResult"
                  >
                    <template #append-inner>
                      <v-icon
                        size="21"
                        :color="theme.dark ? '' : 'hyperlink'"
                        class="icon-search cursor-pointer"
                        @click="searchPipelineResult()"
                      />
                    </template>
                  </v-text-field>
                </v-col>
              </v-col>
              <v-col>
                <v-col class="pl-4 pt-5">
                  <a
                    class="font_14 cursor-pointer"
                    :class="[!theme.dark ? 'text-hyperlink' : 'text-white']"
                    @click="showEmployerSponsored ? displayData('For-profits') : displayData('Participants')"
                  >
                    <v-icon size="18" class="icon-individual pr-2 searchDoc" />View by customer type</a
                  >
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="!viewPlans && display.smAndDown.value" class="d-flex justify-end pb-2">
            <v-row no-gutters>
              <v-col cols="8" xs="8" sm="5">
                <v-col class="pt-3">
                  <v-select
                    v-model="prospectTab"
                    density="compact"
                    variant="outlined"
                    :menu-props="{ zIndex: '1' }"
                    :items="sponsorList"
                    autocomplete="false"
                    append-icon="icon-chevron-down"
                    hide-details
                  >
                    <template #selection="{ item }">
                      <v-icon size="16" :class="[item.icon, item.color, 'mr-1']" />
                      <span :class="theme.dark ? '' : 'text-accent'">{{ item.text }}</span>
                    </template>
                    <template #item="slotProps">
                      <v-icon size="16" :class="[slotProps.item.icon, slotProps.item.color, 'mr-1']" />
                      <span :class="theme.dark ? '' : 'text-accent'">{{ slotProps.item.text }}</span>
                    </template>
                  </v-select>
                </v-col>
              </v-col>
              <v-divider inset vertical class="d-none d-block pr-2 mt-3" />
              <v-col cols="3" xs="3" sm="6">
                <v-col v-if="!viewPlans" class="pl-2 pt-5">
                  <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="displayData('View Plans')">
                    <v-icon size="18" class="icon-search pr-2 searchDoc" />Search
                  </a>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-show="viewPlans && display.smAndDown.value" class="customerMargin">
            <v-row no-gutters>
              <v-col cols="8" xs="8" sm="5">
                <v-col class="pt-3">
                  <v-text-field
                    v-model="searchSpecificPlan"
                    density="compact"
                    variant="outlined"
                    placeholder="Search prospect pipeline..."
                    autocomplete="false"
                    :menu-props="{ attach: true }"
                    @keyup="searchPipelineResult"
                  >
                    <template #append>
                      <v-icon
                        size="21"
                        :color="theme.dark ? '' : 'hyperlink'"
                        class="icon-search cursor-pointer"
                        @click="searchPipelineResult()"
                      />
                    </template>
                  </v-text-field>
                </v-col>
              </v-col>
              <v-divider inset vertical class="d-none d-block pr-4 mb-6 mt-3" />
              <v-col cols="3" xs="3" sm="6">
                <v-col class="pl-3 pt-4">
                  <a class="font_14" :class="[!theme.dark ? 'text-hyperlink' : 'text-white']" @click="displayData('For-profits')">
                    <v-icon size="18" class="icon-individual pr-2 searchDoc" />View Customers
                  </a>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-card v-if="!display.xs.value && showEmployerSponsored && profit" class="elevation-0 pt-2">
            <div class="flex d-flex flex-row pl-4" style="height: 55px">
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer start_polygon rounded-s-lg"
                :class="[prospecting ? 'prospectingBackground' : 'nonSelectedBackground', screenClass]"
                @click="prospectingDetails(d1)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div>
                    <h5 :class="[theme.dark ? 'text-black' : '', prospectClass]">
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineStepsData[0].StageName }} ( {{ pipelineStepsData[0].Plans }} /
                        {{ currencyConvert(pipelineStepsData[0].Assets) }} )
                      </b>
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineStepsData[0].StageName }}
                        </v-col>
                        <v-col> ( {{ pipelineStepsData[0].Plans }} / {{ currencyConvert(pipelineStepsData[0].Assets) }} ) </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer middle_polygon"
                :class="[evaluating ? 'evaluatingBackground' : 'nonSelectedBackground', screenClass]"
                @click="evaluatingDetails(d2)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div>
                    <h5 :class="[theme.dark ? 'text-black' : '', evaluateClass]">
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineStepsData[1].StageName }} ( {{ pipelineStepsData[1].Plans }} /
                        {{ currencyConvert(pipelineStepsData[1].Assets) }} )
                      </b>
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineStepsData[1].StageName }}
                        </v-col>
                        <v-col> ( {{ pipelineStepsData[1].Plans }} / {{ currencyConvert(pipelineStepsData[1].Assets) }} ) </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer middle_polygon"
                :class="[proposing ? 'proposingBackground' : 'nonSelectedBackground', screenClass]"
                @click="proposingDetails(d3)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div>
                    <h5 :class="[theme.dark ? 'text-black' : '', proposeClass]">
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineStepsData[2].StageName }} ( {{ pipelineStepsData[2].Plans }} /
                        {{ currencyConvert(pipelineStepsData[2].Assets) }} )
                      </b>
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineStepsData[2].StageName }}
                        </v-col>
                        <v-col> ( {{ pipelineStepsData[2].Plans }} / {{ currencyConvert(pipelineStepsData[2].Assets) }} ) </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer middle_polygon"
                :class="[finalizing ? 'finalizingBackground' : 'nonSelectedBackground', screenClass]"
                @click="finalizingDetails(d4)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div>
                    <h5 :class="[theme.dark ? 'text-black' : '', finalizeClass]">
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineStepsData[3].StageName }} ( {{ pipelineStepsData[3].Plans }} /
                        {{ currencyConvert(pipelineStepsData[3].Assets) }} )
                      </b>
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineStepsData[3].StageName }}
                        </v-col>
                        <v-col> ( {{ pipelineStepsData[3].Plans }} / {{ currencyConvert(pipelineStepsData[3].Assets) }} ) </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer end_polygon rounded-e-lg"
                :class="[completed ? 'completedBackground' : 'nonSelectedBackground', completedClass]"
                @click="completedDetails(d5)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div
                    :class="
                      display.width.value === 768 ||
                      display.width.value === 800 ||
                      (display.height.value > 374 && display.height.value < 415)
                        ? 'pl-10'
                        : 'text-center'
                    "
                  >
                    <h5 :class="[theme.dark ? 'text-black' : '']">
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineStepsData[4].StageName }} ( {{ pipelineStepsData[4].Plans }} /
                        {{ currencyConvert(pipelineStepsData[4].Assets) }} )
                      </b>
                      <b
                        v-if="
                          pipelineStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineStepsData[4].StageName }}
                        </v-col>
                        <v-col> ( {{ pipelineStepsData[4].Plans }} / {{ currencyConvert(pipelineStepsData[4].Assets) }} ) </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
          <div v-if="display.xs.value && showEmployerSponsored && profit" cols="12" xs="12" class="pt-2">
            <v-carousel v-model="currentIndex" height="60" class="py-2 custom">
              <v-carousel-item v-for="(slide, i) in slides" :key="i">
                <div
                  v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                  :class="slide.class"
                  @click="displayInfo(slide.stage)"
                >
                  <div class="pt-3 pb-3">
                    <div>
                      <h5 :class="[theme.dark && comparison ? 'text-black' : '']">
                        <b v-if="pipelineStepsData.length > 0" class="steppercss pl-16 ml-12"
                          >{{ currentTitle }}( {{ pipelineStepsData[i].Plans }} /
                          {{ currencyConvert(pipelineStepsData[i].Assets) }} )</b
                        >
                      </h5>
                    </div>
                  </div>
                </div>
              </v-carousel-item>
            </v-carousel>
          </div>
          <v-card v-if="!display.xs.value && showIndividuals && participants" class="elevation-0 pt-2">
            <div class="flex d-flex flex-row pl-4" style="height: 55px">
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer start_polygon rounded-s-lg"
                :class="[initiating ? 'evaluatingBackground' : 'nonSelectedBackground', individualScreenClass]"
                @click="initiateDetails(d1)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div>
                    <h5 :class="[theme.dark ? 'text-black' : '', initiateClass]">
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineIndividualStepsData[0].StageName }} ( {{ pipelineIndividualStepsData[0].Plans }} /
                        {{ currencyConvert(pipelineIndividualStepsData[0].Assets) }}
                        )
                      </b>
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineIndividualStepsData[0].StageName }}
                        </v-col>
                        <v-col>
                          ( {{ pipelineIndividualStepsData[0].Plans }} /
                          {{ currencyConvert(pipelineIndividualStepsData[0].Assets) }}
                          )
                        </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer middle_polygon"
                :class="[discovering ? 'proposingBackground' : 'nonSelectedBackground', individualScreenClass]"
                @click="discoverDetails(d2)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div>
                    <h5 :class="[theme.dark ? 'text-black' : '', discoverClass]">
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineIndividualStepsData[1].StageName }} ( {{ pipelineIndividualStepsData[1].Plans }} /
                        {{ currencyConvert(pipelineIndividualStepsData[1].Assets) }}
                        )
                      </b>
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineIndividualStepsData[1].StageName }}
                        </v-col>
                        <v-col>
                          ( {{ pipelineIndividualStepsData[1].Plans }} /
                          {{ currencyConvert(pipelineIndividualStepsData[1].Assets) }}
                          )
                        </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer middle_polygon"
                :class="[individualEvaluating ? 'finalizingBackground' : 'nonSelectedBackground', individualScreenClass]"
                @click="individualEvaluateDetails(d3)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div>
                    <h5 :class="[theme.dark ? 'text-black' : '', individualEvaluateClass]">
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineIndividualStepsData[2].StageName }} ( {{ pipelineIndividualStepsData[2].Plans }} /
                        {{ currencyConvert(pipelineIndividualStepsData[2].Assets) }}
                        )
                      </b>
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineIndividualStepsData[2].StageName }}
                        </v-col>
                        <v-col>
                          ( {{ pipelineIndividualStepsData[2].Plans }} /
                          {{ currencyConvert(pipelineIndividualStepsData[2].Assets) }}
                          )
                        </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div
                v-if="!$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None)"
                class="cursor-pointer end_polygon rounded-e-lg"
                :class="[validating ? 'completedBackground' : 'nonSelectedBackground', validateClass]"
                @click="validateDetails(d4)"
              >
                <div
                  :class="
                    display.width.value === 768 ||
                    display.width.value === 800 ||
                    (display.height.value > 374 && display.height.value < 415)
                      ? 'pt-3'
                      : 'pt-5'
                  "
                >
                  <div
                    :class="
                      display.width.value === 768 ||
                      display.width.value === 800 ||
                      (display.height.value > 374 && display.height.value < 415)
                        ? 'pl-10'
                        : 'text-center'
                    "
                  >
                    <h5 :class="[theme.dark ? 'text-black' : '']">
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          display.width.value !== 768 &&
                          display.width.value !== 800 &&
                          !(display.height.value > 374 && display.height.value < 415)
                        "
                        class="steppercss"
                      >
                        {{ pipelineIndividualStepsData[3].StageName }} ( {{ pipelineIndividualStepsData[3].Plans }} /
                        {{ currencyConvert(pipelineIndividualStepsData[3].Assets) }}
                        )
                      </b>
                      <b
                        v-if="
                          pipelineIndividualStepsData.length > 0 &&
                          (display.width.value === 768 ||
                            display.width.value === 800 ||
                            (display.height.value > 374 && display.height.value < 415))
                        "
                        class="steppercss"
                      >
                        <v-col>
                          {{ pipelineIndividualStepsData[3].StageName }}
                        </v-col>
                        <v-col>
                          ( {{ pipelineIndividualStepsData[3].Plans }} /
                          {{ currencyConvert(pipelineIndividualStepsData[3].Assets) }}
                          )
                        </v-col>
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
          <div v-if="display.xs.value && showIndividuals && participants" cols="12" xs="12" class="pt-2">
            <v-carousel v-model="currentIndexIndividuals" height="60" class="py-2 custom">
              <v-carousel-item v-for="(slide, i) in slidesForIndividuals" :key="i">
                <div
                  v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
                  :class="slide.class"
                  @click="displayInfoIndividuals(slide.stage)"
                >
                  <div class="pt-3 pb-3">
                    <div>
                      <h5 :class="[theme.dark && comparison ? 'text-black' : '']">
                        <b v-if="pipelineIndividualStepsData.length > 0" class="steppercss pl-16 ml-14"
                          >{{ currentTitleIndividuals }}( {{ pipelineIndividualStepsData[i].Plans }} /
                          {{ currencyConvert(pipelineIndividualStepsData[i].Assets) }} )</b
                        >
                      </h5>
                    </div>
                  </div>
                </div>
              </v-carousel-item>
            </v-carousel>
          </div>
          <v-col v-if="profit" class="pa-0" :class="!display.mdAndUp.value ? '' : 'pt-2'">
            <ForProfit
              :key="componentProfitKey"
              :pipeline-plans="pipelinePlans"
              :prospecting="prospecting"
              :evaluating="evaluating"
              :proposing="proposing"
              :finalizing="finalizing"
              :completed="completed"
              :plan-loader="planLoader"
            />
          </v-col>
          <v-col v-if="publicSchool" class="pa-0" :class="!display.mdAndUp.value ? '' : 'pt-2'">
            <PublicSchools />
          </v-col>
          <v-col v-if="municipalities" class="pa-0" :class="!display.mdAndUp.value ? '' : 'pt-2'">
            <Municipalities />
          </v-col>
          <v-col v-if="nonProfits" class="pa-0" :class="!display.mdAndUp.value ? '' : 'pt-2'">
            <NonProfits />
          </v-col>
          <v-col v-if="participants" class="pa-0" :class="!display.mdAndUp.value ? '' : 'pt-2'">
            <Participants
              :key="componentProfitKey"
              :pipeline-individual-plans="pipelineIndividualPlans"
              :initiating="initiating"
              :discovering="discovering"
              :individual-evaluating="individualEvaluating"
              :validating="validating"
              :participants-loader="participantsLoader"
              @open-account="editOpenAccount"
            />
          </v-col>
          <v-col v-if="viewPlans" class="pa-0" :class="!display.mdAndUp.value ? '' : 'pt-2'">
            <ViewPlans :key="componentProfitKey" :view-plans-data-list="viewPlansDataList" @open-account="editOpenAccount" />
          </v-col>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ref, inject, onMounted, computed, getCurrentInstance, watch, onBeforeUnmount } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter, useRoute } from 'vue-router'
import ForProfit from '@/components/TAL/Pipeline/ForProfit'
import PublicSchools from '@/components/TAL/Pipeline/PublicSchools'
import Participants from '@/components/TAL/Pipeline/Participants'
import ViewPlans from '@/components/TAL/Pipeline/ViewPlans'
import Municipalities from '@/components/TAL/Pipeline/Municipalities'
import NonProfits from '@/components/TAL/Pipeline/NonProfits'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
import qs from 'qs'
export default {
  components: {
    ForProfit,
    PublicSchools,
    Participants,
    ViewPlans,
    Municipalities,
    NonProfits,
    OpenAccount
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  setup() {
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const display = useDisplay()
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $authz = instance.appContext.config.globalProperties.$authz
    const store = instance.appContext.config.globalProperties.$store
    const OpenAccount = ref(null)
    const profit = ref(false)
    const publicSchool = ref(false)
    const municipalities = ref(false)
    const nonProfits = ref(false)
    const participants = ref(false)
    const viewPlans = ref(false)
    const filterDialog = ref(false)
    const prospecting = ref(true)
    const evaluating = ref(true)
    const proposing = ref(true)
    const finalizing = ref(true)
    const completed = ref(true)
    const d1 = ref(0)
    const d2 = ref(0)
    const d3 = ref(0)
    const d4 = ref(0)
    const d5 = ref(0)
    const sponsorList = ref([
      {
        text: 'For Profit',
        value: 0,
        icon: 'icon-for-profit',
        color: 'forProfitIcon',
        show: true
      },
      {
        text: 'Individuals',
        value: 1,
        icon: 'icon-individual',
        color: 'participantIcon',
        show: true
      }
    ])
    const prospectTab = ref(0)
    const pipelineStepsData = ref([])
    const statusType = ref('')
    const type = ref('')
    const pipelinePlans = ref([])
    const oldPipelinePlans = ref([])
    const planLoader = ref(false)
    const viewPlansDataList = ref([])
    const prospectingList = ref([])
    const evaluatingList = ref([])
    const proposingList = ref([])
    const finalizingList = ref([])
    const completedList = ref([])
    const pipelinePlansData = ref([])
    const prevRoute = ref('')
    const componentProfitKey = ref(0)
    const searchSpecificPlan = ref('')
    const pipelineIndividualPlans = ref([])
    const oldPipelineIndividualPlans = ref([])
    const participantsLoader = ref(false)
    const initiating = ref(true)
    const discovering = ref(true)
    const individualEvaluating = ref(true)
    const validating = ref(true)
    const initiatingList = ref([])
    const discoveringList = ref([])
    const individualEvaluatingList = ref([])
    const validatingList = ref([])
    const individualPlansDetails = ref([])
    const pipelineIndividualStepsData = ref([])
    const currentIndex = ref(0)
    const slides = ref([
      {
        class: 'cursor-pointer start_polygon prospectingBackground rounded-l-lg',
        stage: 'Prospecting'
      },
      {
        class: 'cursor-pointer middle_polygon evaluatingBackground',
        stage: 'Evaluating'
      },
      {
        class: 'cursor-pointer middle_polygon proposingBackground',
        stage: 'Proposing'
      },
      {
        class: 'cursor-pointer middle_polygon finalizingBackground',
        stage: 'Finalizing'
      },
      {
        class: 'cursor-pointer end_polygon rounded-r-lg completedBackground',
        stage: 'Completed'
      }
    ])
    const currentIndexIndividuals = ref(0)
    const slidesForIndividuals = ref([
      {
        class: 'cursor-pointer start_polygon evaluatingBackground rounded-l-lg',
        stage: 'Agreement'
      },
      {
        class: 'cursor-pointer middle_polygon proposingBackground',
        stage: 'Setup'
      },
      {
        class: 'cursor-pointer middle_polygon finalizingBackground',
        stage: 'Funding'
      },
      {
        class: 'cursor-pointer end_polygon rounded-r-lg completedBackground',
        stage: 'Complete'
      }
    ])
    const breadCrumb = computed(() => {
      return route.meta
    })
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
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Schools
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Schools
          ) &&
          $authz.allowedByAccount($authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c, $authz.typeOfBusiness.Schools)
        )
      } else return true
    })
    const showIndividuals = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Individuals
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Individuals
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Individuals
          )
        )
      } else return true
    })
    // const showMunicipalities = computed(() => {
    //   if ($authz.hasRole($authz.roles.FirmAdmin)) {
    //     return $authz.allowedByProgram(
    //       $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
    //       $authz.typeOfBusiness.Municipalities
    //     )
    //   } else if (
    //     $authz.hasRole($authz.roles.Advisor) ||
    //     $authz.hasRole($authz.roles.Strategist) ||
    //     $authz.hasRole($authz.roles.Fiduciary338)
    //   ) {
    //     return (
    //       $authz.allowedByProgram(
    //         $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
    //         $authz.typeOfBusiness.Municipalities
    //       ) &&
    //       $authz.allowedByAccount(
    //         $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
    //         $authz.typeOfBusiness.Municipalities
    //       )
    //     )
    //   } else return true
    // })
    // const fontSize = computed(() => {
    //   return root.$children[0].fontsize
    // })
    const screenClass = computed(() => {
      if (display.width.value >= 1920 && display.height.value >= 1024) {
        return 'flexWidthBigScreen'
      }
      if (display.width.value === 1366) {
        return 'flexWidthHidpi'
      }
      if (display.width.value === 1280) {
        return 'flexWidthMdpi'
      }
      if (display.width.value === 1024) {
        return 'flexWidthIpadPro'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'flexWidthIpad'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'flexWidthMobileRotate'
      }
      if (display.height.value === 1280) {
        return 'flexWidthMDPIRotate'
      } else return 'flex_width_stepper'
    })
    const completedClass = computed(() => {
      if (display.width.value >= 1920 && display.height.value >= 1024) {
        return 'stepperCompletedBigScreen'
      }
      if (display.width.value === 1366) {
        return 'stepperCompletedHidpi'
      }
      if (display.width.value === 1280) {
        return 'stepperCompletedMdpi'
      }
      if (display.width.value === 1024) {
        return 'stepperCompletedIpadPro'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'stepperCompletedIpad'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'stepperCompletedMobileRotate'
      } else return 'stepperCompleted'
    })
    const prospectClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-6'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-3'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'pl-6'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'pl-7'
      }
      if (display.height.value === 1280) {
        return 'pl-2'
      } else return 'pl-11'
    })
    const evaluateClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-10'
      }
      if (display.width.value === 1280) {
        return 'pl-8'
      }
      if (display.width.value === 1024) {
        return 'pl-6'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'pl-8'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'pl-7'
      }
      if (display.height.value === 1280) {
        return 'pl-5'
      } else return 'pl-13'
    })
    const proposeClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-12'
      }
      if (display.width.value === 1280) {
        return 'pl-11'
      }
      if (display.width.value === 1024) {
        return 'pl-8'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'pl-10'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'pl-7'
      }
      if (display.height.value === 1280) {
        return 'pl-6'
      } else return 'pl-15'
    })
    const finalizeClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-15'
      }
      if (display.width.value === 1280) {
        return 'pl-15'
      }
      if (display.width.value === 1024) {
        return 'pl-12'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'pl-12'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'pl-9'
      }
      if (display.height.value === 1280) {
        return 'pl-8'
      } else return 'pl-16 ml-2'
    })
    const validateClass = computed(() => {
      if (display.width.value >= 1920 && display.height.value >= 1024) {
        return 'stepperValidateBigScreen'
      }
      if (display.width.value === 1366) {
        return 'stepperValidateHidpi'
      }
      if (display.width.value === 1280) {
        return 'stepperValidateMdpi'
      }
      if (display.width.value === 1024) {
        return 'stepperValidateIpadPro'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'stepperValidateIpad'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'stepperCompletedMobileRotate'
      } else return 'stepperValidate'
    })
    const individualScreenClass = computed(() => {
      if (display.width.value >= 1920 && display.height.value >= 1024) {
        return 'flexWidthBigScreenIndividual'
      }
      if (display.width.value === 1366) {
        return 'flexWidthHidpiIndividual'
      }
      if (display.width.value === 1280) {
        return 'flexWidthMdpiIndividual'
      }
      if (display.width.value === 1024) {
        return 'flexWidthIpadProIndividual'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'flexWidthIpadIndividual'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'flexWidthMobileRotate'
      }
      if (display.height.value === 1280) {
        return 'flexWidthMDPIRotate'
      } else return 'flex_width_stepper_individual'
    })
    const initiateClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-6'
      }
      if (display.width.value === 1280) {
        return 'pl-15'
      }
      if (display.width.value === 1024) {
        return 'pl-11'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'pl-10'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'pl-7'
      }
      if (display.height.value === 1280) {
        return 'pl-2'
      } else return 'pl-16 ml-10'
    })
    const discoverClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-10'
      }
      if (display.width.value === 1280) {
        return 'pl-16 ml-2'
      }
      if (display.width.value === 1024) {
        return 'pl-14'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'pl-12'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'pl-7'
      }
      if (display.height.value === 1280) {
        return 'pl-5'
      } else return 'pl-16 ml-8'
    })
    const individualEvaluateClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-12'
      }
      if (display.width.value === 1280) {
        return 'pl-16 ml-4'
      }
      if (display.width.value === 1024) {
        return 'pl-16 ml-1'
      }
      if (display.width.value === 768 || display.width.value === 800) {
        return 'pl-14'
      }
      if (display.height.value > 374 && display.height.value < 415) {
        return 'pl-7'
      }
      if (display.height.value === 1280) {
        return 'pl-6'
      } else return 'pl-16 ml-10'
    })
    const currentTitle = computed(() => {
      if (slides.value[currentIndex.value].stage) {
        displayInfo(slides.value[currentIndex.value].stage)
      }
      return slides.value[currentIndex.value].stage
    })
    const currentTitleIndividuals = computed(() => {
      if (slidesForIndividuals.value[currentIndexIndividuals.value].stage) {
        displayInfoIndividuals(slidesForIndividuals.value[currentIndexIndividuals.value].stage)
      }
      return slidesForIndividuals.value[currentIndexIndividuals.value].stage
    })
    const displayData = (value) => {
      if (value === 'For-profits') {
        profit.value = !profit.value
        publicSchool.value = false
        municipalities.value = false
        nonProfits.value = false
        participants.value = false
        viewPlans.value = false
        searchSpecificPlan.value = ''
        viewPlansDataList.value = []
        if (display.xs.value) {
          prospectingDetails(0)
          mobileStepperDisplay()
          prospectTab.value = 0
        }
      } else if (value === 'Public Schools') {
        publicSchool.value = !publicSchool.value
        profit.value = false
        municipalities.value = false
        nonProfits.value = false
        participants.value = false
        viewPlans.value = false
      } else if (value === 'Municipalities') {
        municipalities.value = !municipalities.value
        profit.value = false
        publicSchool.value = false
        nonProfits.value = false
        participants.value = false
        viewPlans.value = false
      } else if (value === 'Non-profits') {
        nonProfits.value = !nonProfits.value
        profit.value = false
        publicSchool.value = false
        municipalities.value = false
        participants.value = false
        viewPlans.value = false
      } else if (value === 'Participants') {
        participants.value = showIndividuals.value && showEmployerSponsored.value ? !participants.value : true
        profit.value = false
        publicSchool.value = false
        municipalities.value = false
        nonProfits.value = false
        viewPlans.value = false
      } else if (value === 'View Plans') {
        participants.value = false
        profit.value = false
        publicSchool.value = false
        municipalities.value = false
        nonProfits.value = false
        viewPlans.value = !viewPlans.value
        getViewData()
      } else {
        if (showEmployerSponsored.value) {
          profit.value = !profit.value
          publicSchool.value = false
          municipalities.value = false
          nonProfits.value = false
          participants.value = false
          viewPlans.value = false
          searchSpecificPlan.value = ''
          viewPlansDataList.value = []
          if (display.xs.value) {
            prospectingDetails(0)
            mobileStepperDisplay()
            prospectTab.value = 0
          }
        } else {
          participants.value = !participants.value
          profit.value = false
          publicSchool.value = false
          municipalities.value = false
          nonProfits.value = false
          viewPlans.value = false
        }
      }
      if (!profit.value && !publicSchool.value && !participants.value && !viewPlans.value) {
        profit.value = showEmployerSponsored.value
        publicSchool.value = false
        municipalities.value = false
        nonProfits.value = false
        participants.value = false
        viewPlans.value = false
      }
    }
    const createCorporate = () => {
      router.push('/TAL/StartupPlan').catch(() => {})
    }
    const editOpenAccount = (val) => {
      if (val) {
        if (OpenAccount.value) OpenAccount.value.openEditDialog(val)
      }
    }
    const createAccount = () => {
      store.state.openAccountDetail = {}
      filterDialog.value = true
    }
    const prospectingDetails = (d11) => {
      if (d11 === 2) {
        d1.value = 0
      }
      if (d11 === 0) {
        prospecting.value = true
        evaluating.value = false
        proposing.value = false
        finalizing.value = false
        completed.value = false
        pipelinePlans.value = prospectingList.value
      }
      if (d11 === 1) {
        prospecting.value = true
        evaluating.value = true
        proposing.value = true
        finalizing.value = true
        completed.value = true
        pipelinePlans.value = pipelinePlansData.value
      }
      d1.value = d11 + 1
      d2.value = 0
      d3.value = 0
      d4.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const evaluatingDetails = (d22) => {
      console.log(d22)
      if (d22 === 2) {
        d2.value = 0
      }
      if (d22 === 0) {
        prospecting.value = false
        evaluating.value = true
        proposing.value = false
        finalizing.value = false
        completed.value = false
        pipelinePlans.value = evaluatingList.value
      }
      if (d22 === 1) {
        prospecting.value = true
        evaluating.value = true
        proposing.value = true
        finalizing.value = true
        completed.value = true
        pipelinePlans.value = pipelinePlansData.value
      }
      d2.value = d22 + 1
      d1.value = 0
      d3.value = 0
      d4.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const proposingDetails = (d33) => {
      if (d33 === 2) {
        d3.value = 0
      }
      if (d33 === 0) {
        prospecting.value = false
        evaluating.value = false
        proposing.value = true
        finalizing.value = false
        completed.value = false
        pipelinePlans.value = proposingList.value
      }
      if (d33 === 1) {
        prospecting.value = true
        evaluating.value = true
        proposing.value = true
        finalizing.value = true
        completed.value = true
        pipelinePlans.value = pipelinePlansData.value
      }
      d3.value = d33 + 1
      d1.value = 0
      d2.value = 0
      d4.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const finalizingDetails = (d44) => {
      if (d44 === 2) {
        d4.value = 0
      }
      if (d44 === 0) {
        prospecting.value = false
        evaluating.value = false
        proposing.value = false
        finalizing.value = true
        completed.value = false
        pipelinePlans.value = finalizingList.value
      }
      if (d44 === 1) {
        prospecting.value = true
        evaluating.value = true
        proposing.value = true
        finalizing.value = true
        completed.value = true
        pipelinePlans.value = pipelinePlansData.value
      }
      d4.value = d44 + 1
      d1.value = 0
      d2.value = 0
      d3.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const completedDetails = (d55) => {
      if (d55 === 2) {
        d5.value = 0
      }
      if (d55 === 0) {
        prospecting.value = false
        evaluating.value = false
        proposing.value = false
        finalizing.value = false
        completed.value = true
        pipelinePlans.value = completedList.value
      }
      if (d55 === 1) {
        prospecting.value = true
        evaluating.value = true
        proposing.value = true
        finalizing.value = true
        completed.value = true
        pipelinePlans.value = pipelinePlansData.value
      }
      d5.value = d55 + 1
      d1.value = 0
      d2.value = 0
      d3.value = 0
      d4.value = 0
      componentProfitKey.value += 1
    }
    const currencyConvert = (labelValue) => {
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
    const getPipeline = () => {
      planLoader.value = true
      var accountId = []
      var contactId = []
      $axios
        .get(`/api/v1/tal/advisor/pipeline/plan`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          planLoader.value = false
          pipelinePlans.value = success.data.d
          pipelinePlansData.value = success.data.d
          pipelinePlans.value.forEach((element) => {
            element.show = true
            element.customerType = 'PlansType'
          })
          prospectingList.value = pipelinePlans.value.filter((a) => a.StageName === 'Prospecting')
          evaluatingList.value = pipelinePlans.value.filter((a) => a.StageName === 'Evaluating')
          proposingList.value = pipelinePlans.value.filter((a) => a.StageName === 'Proposing')
          finalizingList.value = pipelinePlans.value.filter((a) => a.StageName === 'Finalizing')
          completedList.value = pipelinePlans.value.filter((a) => a.StageName === 'Completed')
          store.state.pipelineList.pipelinePlans = pipelinePlans.value
          store.state.pipelineList.prospectingList = prospectingList.value
          store.state.pipelineList.evaluatingList = evaluatingList.value
          store.state.pipelineList.proposingList = proposingList.value
          store.state.pipelineList.finalizingList = finalizingList.value
          store.state.pipelineList.completedList = completedList.value
          if (store.state.planStatus.length > 0) {
            for (var j = 0; j < store.state.planStatus.length; j++) {
              var planObject = store.state.planStatus[j]
              var selectedPlanStatus
              if (planObject.proposalId < 0) {
                selectedPlanStatus = pipelinePlans.value.find((a) => a.ProposalId === planObject.proposalId)
              } else {
                selectedPlanStatus = pipelinePlans.value.find((a) => a.SEINPNO === planObject.seinpno)
              }
              if (selectedPlanStatus) {
                if (planObject.status === selectedPlanStatus.ProposalStatus) {
                  store.state.planStatus.splice(store.state.planStatus.indexOf(selectedPlanStatus), 1)
                } else {
                  var timeDifference = (new Date().getTime() - new Date(planObject.time).getTime()) / 1000
                  timeDifference /= 60
                  var timeDiff = Math.abs(Math.round(timeDifference))
                  if (timeDiff > 3) {
                    store.state.planStatus.splice(store.state.planStatus.indexOf(planObject), 1)
                  } else {
                    selectedPlanStatus.ProposalStatus = planObject.status
                  }
                }
              }
            }
          }
          oldPipelinePlans.value = pipelinePlans.value
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          planLoader.value = false
        })
    }
    const mobileStepperDisplay = () => {
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

      const touchStart = (index) => {
        return function (event) {
          currentIndex = index
          startPos = getPositionX(event)
          isDragging = true

          // https://css-tricks.com/using-requestanimationframe/
          animationID = requestAnimationFrame(animation)
          slider.classList.add('grabbing')
        }
      }

      const touchEnd = () => {
        isDragging = false
        cancelAnimationFrame(animationID)

        const movedBy = currentTranslate - prevTranslate

        if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1

        if (movedBy > 100 && currentIndex > 0) currentIndex -= 1

        setPositionByIndex()

        slider.classList.remove('grabbing')
      }

      const touchMove = (event) => {
        if (isDragging) {
          const currentPosition = getPositionX(event)
          currentTranslate = prevTranslate + currentPosition - startPos
        }
      }

      const getPositionX = (event) => {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
      }

      const animation = () => {
        setSliderPosition()
        if (isDragging) requestAnimationFrame(animation)
      }

      const setSliderPosition = () => {
        slider.style.transform = `translateX(${currentTranslate}px)`
      }

      const setPositionByIndex = () => {
        currentTranslate = currentIndex * -window.innerWidth
        prevTranslate = currentTranslate
        setSliderPosition()
        if (currentIndex === 0) {
          prospectingDetails(0)
        } else if (currentIndex === 1) {
          evaluatingDetails(0)
        } else if (currentIndex === 2) {
          proposingDetails(0)
        } else if (currentIndex === 3) {
          finalizingDetails(0)
        } else if (currentIndex === 4) {
          completedDetails(0)
        }
      }
    }
    const displayInfo = (name) => {
      if (name === 'Prospecting') {
        prospectingDetails(0)
      } else if (name === 'Evaluating') {
        evaluatingDetails(0)
      } else if (name === 'Proposing') {
        proposingDetails(0)
      } else if (name === 'Finalizing') {
        finalizingDetails(0)
      } else {
        completedDetails(0)
      }
    }
    const getIndividualPipelineData = (val) => {
      participantsLoader.value = val
      let accountId = []
      let contactId = []
      $axios
        .get(`/api/v1/tal/advisor/pipeline/individuals`, {
          params: {
            accountId: accountId,
            advisorContactId: contactId
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        })
        .then((success) => {
          participantsLoader.value = false
          pipelineIndividualPlans.value = success.data.d ? success.data.d : []
          individualPlansDetails.value = success.data.d ? success.data.d : []
          initiatingList.value = pipelineIndividualPlans.value.filter((a) => a.StageName === 'Agreement')
          discoveringList.value = pipelineIndividualPlans.value.filter((a) => a.StageName === 'Setup')
          individualEvaluatingList.value = pipelineIndividualPlans.value.filter((a) => a.StageName === 'Funding')
          validatingList.value = pipelineIndividualPlans.value.filter((a) => a.StageName === 'Complete')
          store.state.pipelineList.pipelineIndividualPlans = pipelineIndividualPlans.value
          store.state.pipelineList.initiatingList = initiatingList.value
          store.state.pipelineList.discoveringList = discoveringList.value
          store.state.pipelineList.individualEvaluatingList = individualEvaluatingList.value
          store.state.pipelineList.validatingList = validatingList.value
          // totalIndividualCount.value = 0
          pipelineIndividualPlans.value.forEach((element) => {
            element.show = true
            //let stages = element.Status.split(',')
            let isInitiate = element.StageName.includes('Agreement')
            let isDiscover = element.StageName.includes('Setup')
            let isValidate = element.StageName.includes('Funding')
            let isCompleted = element.StageName.includes('Complete')
            element.isInitiate = isInitiate
            element.isDiscover = isDiscover
            element.isValidate = isValidate
            element.isCompleted = isCompleted
            element.customerType = 'IndividualsType'
          })
          oldPipelineIndividualPlans.value = pipelineIndividualPlans.value
          if (!val) componentProfitKey.value += 1
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          participantsLoader.value = false
        })
    }
    const getViewData = () => {
      viewPlansDataList.value = []
      Array.prototype.push.apply(viewPlansDataList.value, pipelinePlans.value)
      if (pipelineIndividualPlans.value.length > 0) {
        pipelineIndividualPlans.value.forEach((element) => {
          element.customerType = 'IndividualsType'
        })
      }
      Array.prototype.push.apply(viewPlansDataList.value, pipelineIndividualPlans.value)
    }
    const searchPipelineResult = () => {
      if (searchSpecificPlan.value) {
        getSpecificPlanList()
      } else {
        getViewData()
      }
    }
    const getSpecificPlanList = () => {
      var filterPlanTypeData = []
      var filterIndividualTypeData = []
      if (pipelinePlans.value && pipelinePlans.value.length > 0) {
        pipelinePlans.value.forEach((element) => {
          element.customerType = 'PlansType'
        })
        var filterPlanTypeList = pipelinePlans.value.filter((a) => a.PlanName)
        filterPlanTypeData = filterPlanTypeList.filter((a) =>
          a.PlanName.toUpperCase().includes(searchSpecificPlan.value.toUpperCase())
        )
      }
      if (pipelineIndividualPlans.value && pipelineIndividualPlans.value.length > 0) {
        pipelineIndividualPlans.value.forEach((element) => {
          element.customerType = 'IndividualsType'
        })
        var filterIndividualList = pipelineIndividualPlans.value.filter((a) => a.Account)
        filterIndividualTypeData = filterIndividualList.filter((a) =>
          a.Account.toUpperCase().includes(searchSpecificPlan.value.toUpperCase())
        )
      }
      Array.prototype.push.apply(filterPlanTypeData, filterIndividualTypeData)
      viewPlansDataList.value = filterPlanTypeData
    }
    const initiateDetails = (tmp_d1) => {
      if (tmp_d1 === 2) {
        tmp_d1 = 0
      }
      if (tmp_d1 === 0) {
        initiating.value = true
        discovering.value = false
        individualEvaluating.value = false
        validating.value = false
        pipelineIndividualPlans.value = initiatingList.value
      }
      if (tmp_d1 === 1) {
        initiating.value = true
        discovering.value = true
        individualEvaluating.value = true
        validating.value = true
        pipelineIndividualPlans.value = individualPlansDetails.value
      }
      d1.value = tmp_d1 + 1
      d2.value = 0
      d3.value = 0
      d4.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const discoverDetails = (tmp_d2) => {
      if (tmp_d2 === 2) {
        tmp_d2 = 0
      }
      if (tmp_d2 === 0) {
        initiating.value = false
        discovering.value = true
        individualEvaluating.value = false
        validating.value = false
        pipelineIndividualPlans.value = discoveringList.value
      }
      if (tmp_d2 === 1) {
        initiating.value = true
        discovering.value = true
        individualEvaluating.value = true
        validating.value = true
        pipelineIndividualPlans.value = individualPlansDetails.value
      }
      d2.value = tmp_d2 + 1
      d1.value = 0
      d3.value = 0
      d4.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const individualEvaluateDetails = (tmp_d3) => {
      if (tmp_d3 === 2) {
        tmp_d3 = 0
      }
      if (tmp_d3 === 0) {
        initiating.value = false
        discovering.value = false
        individualEvaluating.value = true
        validating.value = false
        pipelineIndividualPlans.value = individualEvaluatingList.value
      }
      if (tmp_d3 === 1) {
        initiating.value = true
        discovering.value = true
        individualEvaluating.value = true
        validating.value = true
        pipelineIndividualPlans.value = individualPlansDetails.value
      }
      d3.value = tmp_d3 + 1
      d1.value = 0
      d2.value = 0
      d4.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const validateDetails = (tmp_d4) => {
      if (tmp_d4 === 2) {
        tmp_d4 = 0
      }
      if (tmp_d4 === 0) {
        initiating.value = false
        discovering.value = false
        individualEvaluating.value = false
        validating.value = true
        pipelineIndividualPlans.value = validatingList.value
      }
      if (tmp_d4 === 1) {
        initiating.value = true
        discovering.value = true
        individualEvaluating.value = true
        validating.value = true
        pipelineIndividualPlans.value = individualPlansDetails.value
      }
      d4.value = tmp_d4 + 1
      d1.value = 0
      d2.value = 0
      d3.value = 0
      d5.value = 0
      componentProfitKey.value += 1
    }
    const displayInfoIndividuals = (name) => {
      if (name === 'Agreement') {
        initiateDetails(0)
      } else if (name === 'Setup') {
        discoverDetails(0)
      } else if (name === 'Funding') {
        individualEvaluateDetails(0)
      } else {
        validateDetails(0)
      }
    }
    watch(
      prospectTab.value,
      (val) => {
        var indexValue = val ? val : 0
        switch (sponsorList.value[indexValue].value) {
          case 0:
            displayData('For-profits')
            break
          case 1:
            displayData('Participants')
            break
          case 2:
            displayData('Municipalities')
            break
          case 3:
            displayData('Non-profits')
            break
          case 4:
            displayData('Public Schools')
            break
          default:
            break
        }
      },
      { immediate: true }
    )
    onBeforeUnmount(() => {
      eventBus.off('getPiplineIndividualData')
    })
    onMounted(() => {
      getPipeline()
      getIndividualPipelineData(true)
      if (Object.keys(route.params).length > 0) {
        statusType.value = route.params.statusType ? route.params.statusType : ''
        type.value = route.params.Type ? route.params.Type : ''
      }
      displayData(type.value)
      if (display.xs.value && type.value === 'Participants') {
        prospectTab.value = 1
        displayData('Participants')
      }
      var path = prevRoute.value.fullPath
      if (statusType.value === 'Prospecting' || (path ? path.includes('Prospecting') : '')) {
        prospectingDetails(0)
      } else if (statusType.value === 'Evaluating' || (path ? path.includes('Evaluating') : '')) {
        evaluatingDetails(0)
      } else if (statusType.value === 'Proposing' || (path ? path.includes('Proposing') : '')) {
        proposingDetails(0)
      } else if (statusType.value === 'Finalizing' || (path ? path.includes('Finalizing') : '')) {
        finalizingDetails(0)
      } else if (statusType.value === 'Completed' || (path ? path.includes('Completed') : '')) {
        completedDetails(0)
      } else if (statusType.value === 'Agreement' || (path ? path.includes('Agreement') : '')) {
        initiateDetails(0)
      } else if (statusType.value === 'Setup' || (path ? path.includes('Setup') : '')) {
        discoverDetails(0)
      } else if (statusType.value === 'Funding' || (path ? path.includes('Funding') : '')) {
        individualEvaluateDetails(0)
      } else if (statusType.value === 'Complete' || (path ? path.includes('Complete') : '')) {
        validateDetails(0)
      }
      store.dispatch('getPipelinePlanSponsor').then(() => {
        pipelineStepsData.value = store.state.pipelinePlanSponsor.length > 0 ? store.state.pipelinePlanSponsor : []
      })
      store.dispatch('getPipelineIndividualSponsor').then(() => {
        pipelineIndividualStepsData.value =
          store.state.pipelineIndividualSponsor.length > 0 ? store.state.pipelineIndividualSponsor : []
      })
      eventBus.on('getPiplineIndividualData', () => {
        getIndividualPipelineData(false)
      })
    })
    return {
      theme,
      display,
      $authz,
      router,
      breadCrumb,
      showEmployerSponsored,
      planLoader,
      profit,
      pipelinePlans,
      showSchool,
      showIndividuals,
      participants,
      participantsLoader,
      pipelineIndividualPlans,
      filterDialog,
      viewPlans,
      searchSpecificPlan,
      prospectTab,
      sponsorList,
      pipelineStepsData,
      evaluating,
      prospecting,
      finalizing,
      completed,
      currentIndex,
      initiating,
      pipelineIndividualStepsData,
      discovering,
      individualEvaluating,
      validating,
      currentIndexIndividuals,
      slidesForIndividuals,
      currentTitleIndividuals,
      componentProfitKey,
      publicSchool,
      municipalities,
      nonProfits,
      viewPlansDataList,
      OpenAccount,
      proposing,
      d1,
      d2,
      d3,
      d4,
      d5,
      createCorporate,
      createAccount,
      displayData,
      searchPipelineResult,
      prospectingDetails,
      currencyConvert,
      evaluatingDetails,
      proposingDetails,
      finalizingDetails,
      completedDetails,
      displayInfo,
      initiateDetails,
      discoverDetails,
      individualEvaluateDetails,
      validateDetails,
      displayInfoIndividuals,
      editOpenAccount,
      currentTitle,
      completedClass,
      prospectClass,
      evaluateClass,
      proposeClass,
      finalizeClass,
      validateClass,
      individualScreenClass,
      individualEvaluateClass,
      screenClass,
      initiateClass,
      discoverClass
    }
  }
}
</script>
<style scoped>
.font_20 {
  font-size: 2.125rem !important;
}
.fixHeightForLoader {
  height: 500px !important;
}
.customerMargin {
  margin: 0 0 -16px 0 !important;
}
.stepper_width_new {
  width: 115% !important;
  display: flex !important;
  height: 55px;
}
.flex_width_new {
  margin: 0 -12px 0 -7px;
}
.flex_width_stepper {
  width: 27% !important;
  margin: 0 -75px 0 -15px;
}
.stepperCompleted {
  width: 21.3% !important;
  margin: 0 0 0 -15px;
}
.flexWidthBigScreen {
  width: 27% !important;
  margin: 0 -76px 0 -18px;
}
.stepperCompletedBigScreen {
  width: 22% !important;
  margin: 0 0 0 -20px;
}
.flexWidthHidpi {
  width: 27.2% !important;
  margin: 0 -65px 0 -15px;
}
.stepperCompletedHidpi {
  width: 21% !important;
  margin: 0 0 0 -15px;
}
.flexWidthMdpi {
  width: 28% !important;
  margin: 0 -65px 0 -18px;
}
.stepperCompletedMdpi {
  width: 23% !important;
  margin: 0 0 0 -15px;
}
.flexWidthIpadPro {
  width: 27% !important;
  margin: 0 -50px 0 -15px;
}
.stepperCompletedIpadPro {
  width: 21.3% !important;
  margin: 0 0 0 -15px;
}
.flexWidthIpad {
  width: 27% !important;
  margin: 0 -28px 0 -18px;
}
.stepperCompletedIpad {
  width: 22% !important;
  margin: 0 0 0 -18px;
}
.stepperCompletedMobileRotate {
  width: 22% !important;
  margin: 0 0 0 -18px;
}
.flexWidthMobileRotate {
  width: 37% !important;
  margin: 0 -75px 0 -15px;
}
.flexWidthMDPIRotate {
  width: 30% !important;
  margin: 0 -45px 0 -15px;
}
.flex_width_mobile {
  margin: 0 -12px 0 -7px;
}
.start_polygon {
  /* clip-path: polygon(0% 0%, 90% 0%, 95% 50%, 90% 100%, 0% 100%); */
  clip-path: polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%);
}
.middle_polygon {
  /* clip-path: polygon(90% 0%, 95% 50%, 90% 100%, 0% 100%, 5% 50%, 0% 0%); */
  clip-path: polygon(95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%);
}
.end_polygon {
  clip-path: polygon(0% 0%, 5% 50%, 0% 100%, 100% 100%, 100% 0%);
}
.prospectingBackground {
  /* background-color: rgb(var(--v-theme-accent-lighten4)) !important; */
  background-color: #a1e2ff !important;
}
.evaluatingBackground {
  /* background-color: rgb(var(--v-accent-lighten3)) !important; */
  background-color: #82c6ff !important;
}
.proposingBackground {
  background-color: #62abff !important;
}
.finalizingBackground {
  background-color: #3f90e8 !important;
}
.completedBackground {
  background-color: #0077cc !important;
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
.stepperValidate {
  width: 25.5% !important;
  margin: 0 0 0 -15px;
}
.flex_width_stepper_individual {
  width: 32% !important;
  margin: 0 -75px 0 -15px;
}
.flexWidthBigScreenIndividual {
  width: 32% !important;
  margin: 0 -76px 0 -18px;
}
.stepperValidateBigScreen {
  width: 26% !important;
  margin: 0 0 0 -20px;
}
.flexWidthHidpiIndividual {
  width: 32% !important;
  margin: 0 -65px 0 -15px;
}
.stepperValidateHidpi {
  width: 28% !important;
  margin: 0 0 0 -15px;
}
.flexWidthMdpiIndividual {
  width: 33% !important;
  margin: 0 -65px 0 -18px;
}
.stepperValidateMdpi {
  width: 25% !important;
  margin: 0 0 0 -15px;
}
.flexWidthIpadIndividual {
  width: 32.5% !important;
  margin: 0 -28px 0 -18px;
}
.stepperValidateIpad {
  width: 25% !important;
  margin: 0 0 0 -18px;
}
.flexWidthIpadProIndividual {
  width: 32.5% !important;
  margin: 0 -50px 0 -15px;
}
.stepperValidateIpadPro {
  width: 24.8% !important;
  margin: 0 0 0 -15px;
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
  /* height: 10vh; */
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
  max-width: 95%;
}
</style>
