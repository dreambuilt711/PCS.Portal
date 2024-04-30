<template>
  <v-col class="pa-0">
    <v-card v-if="!display.xs.value" class="elevation-0 pa-0 pt-2">
      <div
        class="flex d-flex flex-row"
        style="height: 40px; justify-content: space-between"
        :class="display.width.value === 1024 ? 'pl-6' : 'pl-4'"
      >
        <div class="start_polygon background_grey rounded-s-lg" :class="screenClass">
          <div class="pt-3">
            <div>
              <h5 class="headerClass" :class="[theme.dark ? 'black--text' : '', aumClass]">
                AUM
                {{ currencyConvert(totalAUMForPlans ? totalAUMForPlans : 0) }}
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
              <h5 :class="[theme.dark ? 'black--text' : '', prospectClass]">
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
              <h5 :class="[theme.dark ? 'black--text' : '', evaluateClass]">
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
              <h5 :class="[theme.dark ? 'black--text' : '', proposeClass]">
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
              <h5 :class="[theme.dark ? 'black--text' : '', finalizeClass]">
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
              <h5 :class="[theme.dark ? 'black--text' : '']">
                <b class="steppercss"> Completed </b>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <div v-if="display.xs.value" cols="12" xs="12">
      <v-carousel v-model="currentIndex" height="60" class="py-2 custom">
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            :class="slide.class"
            @click="displayInfo(slide.stage)"
          >
            <div class="pt-3 pb-3">
              <div>
                <h5 :class="[theme.dark ? 'black--text' : '']">
                  <b class="steppercss pl-16 ml-14">{{ currentTitle }}</b>
                </h5>
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </div>
    <v-col v-if="!display.xs.value" class="pa-0 pt-3">
      <v-col v-if="!showPlanLoader && forProfitData && forProfitData.length === 0" class="ma-1 pa-0">
        <v-col class="d-flex flex-column justify-center align-center pa-0">
          <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
            <v-col class="text-center pa-0">
              <v-col>
                <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
              </v-col>
              <v-col class="font-weight-medium pt-5 pb-5">
                As you look for new clients this pipeline will keep track your progress from your first call to signed account
                applications
              </v-col>
              <v-col class="font-weight-medium"> Create a prospect to get started </v-col>
              <v-col pt-5 class="d-flex justify-center">
                <v-row>
                  <v-col :class="!display.xs.value ? 'pl-0' : ''" xs="12">
                    <v-btn
                      v-if="showEmployerSponsored"
                      class="mr-0 text-capitalize"
                      :color="theme.dark ? '' : 'accent'"
                      @click="createCorporate()"
                    >
                      Create Startup
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-card>
        </v-col>
      </v-col>
      <v-col v-else class="pa-0">
        <v-col v-if="showZerostate" class="pa-0">
          <v-col class="d-flex flex-column justify-center align-center pa-0">
            <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
              <v-col class="text-center pa-0">
                <v-col>
                  <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
                </v-col>
                <v-col class="font-weight-medium pt-5 pb-5">
                  As you look for new clients this pipeline will keep track your progress from your first call to signed account
                  applications
                </v-col>
                <v-col class="font-weight-medium"> Create a prospect to get started </v-col>
                <v-col pt-5 class="d-flex justify-center">
                  <v-row>
                    <v-col :class="!display.xs.value ? 'pl-0' : ''" xs="12">
                      <v-btn
                        v-if="showEmployerSponsored"
                        class="mr-0 text-capitalize"
                        :color="theme.dark ? '' : 'accent'"
                        @click="createCorporate()"
                      >
                        Create Startup
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
            </v-card>
          </v-col>
        </v-col>
        <v-col v-else class="pa-0">
          <v-col class="pa-0">
            <v-col v-if="showEmployerSponsored" class="headerClass background_grey text-capitalize pt-1 pb-1"> Plan Type </v-col>
            <v-col class="pa-0">
              <v-row v-if="showEmployerSponsored && forProfitData.length > 0">
                <v-col
                  cols="2"
                  lg="2"
                  md="2"
                  sm="2"
                  class="pl-0 pr-0 text-center pb-3 pt-4"
                  :class="display.width.value === 1280 ? 'mr-4' : fontSize > 13 ? '' : ''"
                >
                  <v-row no-gutters>
                    <v-col cols="3" lg="3" md="3" class="pt-2 pa-0">
                      <v-icon
                        size="18"
                        class="icon-for-profit"
                        :class="showEmployerSponsored ? 'forProfitIcon' : 'disabledColor'"
                      />
                    </v-col>
                    <v-col
                      cols="9"
                      lg="9"
                      md="9"
                      class="text-left"
                      :class="
                        !theme.dark ? (showEmployerSponsored ? 'text-hyperlink cursor-pointer' : 'disabledColor') : 'white--text'
                      "
                      @click="showEmployerSponsored ? viewDetails('For Profit') : ''"
                    >
                      Employer <br />Sponsored
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 pa-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink pa-0'
                            : 'disabledColor pa-0'
                          : 'white--text pa-0'
                      "
                      @click="viewDetailsWithStatus(forProfitData[0].StageName)"
                    >
                      {{ forProfitData[0].Plans ? forProfitData[0].Plans : 0 }}
                    </v-col>
                    <v-col class="pa-0">
                      {{
                        currencyConvert(
                          forProfitData && forProfitData.length > 0 ? (forProfitData[0].Assets ? forProfitData[0].Assets : 0) : 0
                        )
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else class="pa-0">
                    <v-col :class="!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'white--text'">
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 pa-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink pa-0'
                            : 'disabledColor pa-0'
                          : 'white--text pa-0'
                      "
                      @click="viewDetailsWithStatus(forProfitData[1].StageName)"
                    >
                      {{ forProfitData[1].Plans ? forProfitData[1].Plans : 0 }}
                    </v-col>
                    <v-col class="pa-0">
                      {{
                        currencyConvert(
                          forProfitData && forProfitData.length > 0 ? (forProfitData[1].Assets ? forProfitData[1].Assets : 0) : 0
                        )
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else class="pa-0">
                    <v-col
                      :class="
                        !theme.dark ? (showEmployerSponsored ? 'text-hyperlink pa-0' : 'disabledColor pa-0') : 'white--text pa-0'
                      "
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 pa-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink pa-0'
                            : 'disabledColor pa-0'
                          : 'white--text pa-0'
                      "
                      @click="viewDetailsWithStatus(forProfitData[2].StageName)"
                    >
                      {{ forProfitData[2].Plans ? forProfitData[2].Plans : 0 }}
                    </v-col>
                    <v-col class="pa-0">
                      {{
                        currencyConvert(
                          forProfitData && forProfitData.length > 1 ? (forProfitData[2].Assets ? forProfitData[2].Assets : 0) : 0
                        )
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else class="pa-0">
                    <v-col
                      :class="
                        !theme.dark ? (showEmployerSponsored ? 'text-hyperlink pa-0' : 'disabledColor pa-0') : 'white--text pa-0'
                      "
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 pa-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink pa-0'
                            : 'disabledColor pa-0'
                          : 'white--text pa-0'
                      "
                      @click="viewDetailsWithStatus(forProfitData[3].StageName)"
                    >
                      {{ forProfitData[3].Plans ? forProfitData[3].Plans : 0 }}
                    </v-col>
                    <v-col class="pa-0">
                      {{
                        currencyConvert(
                          forProfitData && forProfitData.length > 2 ? (forProfitData[3].Assets ? forProfitData[3].Assets : 0) : 0
                        )
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else class="pa-0">
                    <v-col
                      :class="
                        !theme.dark ? (showEmployerSponsored ? 'text-hyperlink pa-0' : 'disabledColor pa-0') : 'white--text pa-0'
                      "
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 pa-0 alignCenterClass">
                  <v-col v-if="forProfitData && forProfitData.length > 0">
                    <v-col
                      :class="
                        !theme.dark
                          ? showEmployerSponsored
                            ? 'cursor-pointer text-hyperlink pa-0'
                            : 'disabledColor pa-0'
                          : 'white--text pa-0'
                      "
                      @click="viewDetailsWithStatus(forProfitData[4].StageName)"
                    >
                      {{ forProfitData[4].Plans ? forProfitData[4].Plans : 0 }}
                    </v-col>
                    <v-col class="pa-0">
                      {{
                        currencyConvert(
                          forProfitData && forProfitData.length > 3 ? (forProfitData[4].Assets ? forProfitData[4].Assets : 0) : 0
                        )
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col
                      :class="
                        !theme.dark ? (showEmployerSponsored ? 'text-hyperlink pa-0' : 'disabledColor pa-0') : 'white--text pa-0'
                      "
                    >
                      -
                    </v-col>
                  </v-col>
                </v-col>
              </v-row>
              <v-divider v-if="showSchool && false" class="mt-1" />
              <v-row v-if="showSchool && false">
                <v-col
                  class="pl-0 pr-0 text-center pb-4 pt-4"
                  cols="3"
                  lg="3"
                  md="3"
                  sm="3"
                  :class="display.width.value === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  <v-row no-gutters>
                    <v-col cols="3" lg="3" md="3">
                      <v-icon size="18" class="icon-schools" :class="showSchool ? 'schoolIcon' : 'disabledColor'" />
                    </v-col>
                    <v-col
                      cols="9"
                      lg="9"
                      md="9"
                      class="text-left"
                      :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'"
                      @click="showSchool ? viewDetails('Public Schools') : ''"
                    >
                      Schools
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass mx-4" cols="1" lg="1" md="1" sm="1">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'"
                    >
                      {{ publicSchoolData[0].Plans ? publicSchoolData[0].Plans : 0 }}
                    </v-col>
                    <v-col>{{ publicSchoolData[0].Assets ? currencyConvert(publicSchoolData[0].Assets) : 0 }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'"
                    >
                      {{ publicSchoolData[1].Plans ? publicSchoolData[1].Plans : 0 }}
                    </v-col>
                    <v-col>{{ publicSchoolData[1].Assets ? currencyConvert(publicSchoolData[1].Assets) : 0 }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'"
                    >
                      {{ publicSchoolData[2].Plans ? publicSchoolData[2].Plans : 0 }}
                    </v-col>
                    <v-col>{{ publicSchoolData[2].Assets ? currencyConvert(publicSchoolData[2].Assets) : 0 }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'"
                    >
                      {{ publicSchoolData[3].Plans ? publicSchoolData[3].Plans : 0 }}
                    </v-col>
                    <v-col>{{ publicSchoolData[3].Assets ? currencyConvert(publicSchoolData[3].Assets) : 0 }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col
                      :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'"
                    >
                      {{ publicSchoolData[4].Plans ? publicSchoolData[4].Plans : 0 }}
                    </v-col>
                    <v-col>{{ publicSchoolData[4].Assets ? currencyConvert(publicSchoolData[4].Assets) : 0 }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'">-</v-col>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col class="pa-0">
            <v-divider class="mt-1" />
            <v-col class="pa-0">
              <v-row>
                <v-col
                  cols="2"
                  lg="2"
                  md="2"
                  sm="2"
                  class="pt-2 pb-2 pl-16 pa-0"
                  :class="display.width.value === 1280 ? 'mr-n4' : fontSize > 13 ? '' : ''"
                >
                  Total
                </v-col>
                <v-col class="text-center pt-2 pb-2 pa-0" cols="2" lg="2" md="2" sm="2">
                  <v-col class="pa-0">
                    {{
                      forProfitData && forProfitData.length > 0
                        ? forProfitData[0].Assets
                          ? currencyConvert(forProfitData[0].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2 pa-0" cols="2" lg="2" md="2" sm="2">
                  <v-col class="pa-0">
                    {{
                      forProfitData && forProfitData.length > 0
                        ? forProfitData[1].Assets
                          ? currencyConvert(forProfitData[1].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2 pa-0" cols="2" lg="2" md="2" sm="2">
                  <v-col class="pa-0">
                    {{
                      forProfitData && forProfitData.length > 0
                        ? forProfitData[2].Assets
                          ? currencyConvert(forProfitData[2].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2 pa-0" cols="2" lg="2" md="2" sm="2">
                  <v-col class="pa-0">
                    {{
                      forProfitData && forProfitData.length > 0
                        ? forProfitData[3].Assets
                          ? currencyConvert(forProfitData[3].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2 pa-0">
                  <v-col class="pa-0">
                    {{
                      forProfitData && forProfitData.length > 0
                        ? forProfitData[4].Assets
                          ? currencyConvert(forProfitData[4].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-col>
      </v-col>
    </v-col>
    <v-col v-if="display.xs.value" class="pa-0">
      <v-col v-if="!showPlanLoader && forProfitData && forProfitData.length === 0" class="ma-1 pa-0">
        <v-col class="d-flex flex-column justify-center align-center pa-0">
          <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
            <v-col class="text-center pa-0">
              <v-col>
                <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
              </v-col>
              <v-col class="font-weight-medium pt-5 pb-5">
                As you look for new clients this pipeline will keep track your progress from your first call to signed account
                applications
              </v-col>
              <v-col class="font-weight-medium"> Create a prospect to get started </v-col>
              <v-col pt-5 class="d-flex justify-center">
                <v-row>
                  <v-col :class="!display.xs.value ? 'pl-0' : ''" xs="12">
                    <v-btn
                      v-if="showEmployerSponsored"
                      class="mr-0 text-capitalize"
                      :color="theme.dark ? '' : 'accent'"
                      @click="createCorporate()"
                    >
                      Create Startup
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-card>
        </v-col>
      </v-col>
      <v-col v-else class="pa-0">
        <v-col v-if="showZerostate" class="pa-0">
          <v-col class="d-flex flex-column justify-center align-center pa-0">
            <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
              <v-col class="text-center pa-0">
                <v-col>
                  <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
                </v-col>
                <v-col class="font-weight-medium pt-5 pb-5">
                  As you look for new clients this pipeline will keep track your progress from your first call to signed account
                  applications
                </v-col>
                <v-col class="font-weight-medium"> Create a prospect to get started </v-col>
                <v-col pt-5 class="d-flex justify-center">
                  <v-row>
                    <v-col :class="!display.xs.value ? 'pl-0' : ''" xs="12">
                      <v-btn
                        v-if="showEmployerSponsored"
                        class="mr-0 text-capitalize"
                        :color="theme.dark ? '' : 'accent'"
                        @click="createCorporate()"
                      >
                        Create Startup
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-col>
            </v-card>
          </v-col>
        </v-col>
        <v-col v-else>
          <v-col class="headerClass background_grey text-uppercase pt-1 pb-1"> Sponsors </v-col>
          <v-col>
            <v-row v-if="showEmployerSponsored && forProfitData.length > 0">
              <v-col class="pl-0 pr-0 text-center pt-4 pb-4" cols="6" xs="6">
                <v-row no-gutters>
                  <v-col cols="3" xs="3" class="pa-0">
                    <v-icon
                      size="18"
                      class="icon-for-profit"
                      :class="showEmployerSponsored ? 'forProfitIcon' : 'disabledColor'"
                    />
                  </v-col>
                  <v-col
                    cols="9"
                    xs="9"
                    class="text-left cursor-pointer"
                    :class="!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                    @click="showEmployerSponsored ? viewDetails('For Profit') : ''"
                  >
                    Employer <br />Sponsored
                  </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ forProfitData[0].Plans ? forProfitData[0].Plans : 0 }}
                  </v-col>
                  <v-col>{{ forProfitData[0].Assets ? currencyConvert(forProfitData[0].Assets) : 0 }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !theme.dark ? (showEmployerSponsored ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="evaluateStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ forProfitData[1].Plans ? forProfitData[1].Plans : 0 }}
                  </v-col>
                  <v-col>{{ forProfitData[1].Assets ? currencyConvert(forProfitData[1].Assets) : 0 }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !theme.dark ? (showEmployerSponsored ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ forProfitData[2].Plans ? forProfitData[2].Plans : 0 }}
                  </v-col>
                  <v-col>{{ forProfitData[2].Assets ? currencyConvert(forProfitData[2].Assets) : 0 }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !theme.dark ? (showEmployerSponsored ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ forProfitData[3].Plans ? forProfitData[3].Plans : 0 }}
                  </v-col>
                  <v-col>{{ forProfitData[3].Assets ? currencyConvert(forProfitData[3].Assets) : 0 }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !theme.dark ? (showEmployerSponsored ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="forProfitData && forProfitData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showEmployerSponsored ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ forProfitData[4].Plans ? forProfitData[4].Plans : 0 }}
                  </v-col>
                  <v-col>{{ forProfitData[4].Assets ? currencyConvert(forProfitData[4].Assets) : 0 }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col
                    :class="
                      !theme.dark ? (showEmployerSponsored ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'
                    "
                  >
                    -
                  </v-col>
                </v-col>
              </v-col>
            </v-row>
            <v-divider v-if="showSchool && false" class="mt-1" />
            <v-row v-if="showSchool && false">
              <v-col class="pl-0 pr-0 text-center pt-4 pb-4" cols="6" xs="6">
                <v-row no-gutters>
                  <v-col cols="3" xs="3" class="pa-0">
                    <v-icon size="18" class="icon-schools" :class="showSchool ? 'schoolIcon' : 'disabledColor'" />
                  </v-col>
                  <v-col
                    cols="9"
                    xs="9"
                    class="text-left cursor-pointer"
                    :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    Schools
                  </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ publicSchoolData[0].Plans ? publicSchoolData[0].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[0].Assets ? publicSchoolData[0].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'">
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="evaluateStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ publicSchoolData[1].Plans ? publicSchoolData[1].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[1].Assets ? publicSchoolData[1].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'">
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ publicSchoolData[2].Plans ? publicSchoolData[2].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[2].Assets ? publicSchoolData[2].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'">
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ publicSchoolData[3].Plans ? publicSchoolData[3].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[3].Assets ? publicSchoolData[3].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'">
                    -
                  </v-col>
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5" xs="5">
                <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                  <v-col
                    class="cursor-pointer"
                    :class="!theme.dark ? (showSchool ? 'text-hyperlink' : 'disabledColor') : 'white--text'"
                  >
                    {{ publicSchoolData[4].Plans ? publicSchoolData[4].Plans : 0 }}
                  </v-col>
                  <v-col>{{ currencyConvert(publicSchoolData[4].Assets ? publicSchoolData[4].Assets : 0) }}</v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="!theme.dark ? (showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor') : 'white--text'">
                    -
                  </v-col>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-divider class="mt-1" />
            <v-row>
              <v-col class="pl-0 pr-0 text-center pt-2" cols="6" xs="6">
                <v-row no-gutters>
                  <v-col cols="12" xs="12" class="text-left pl-10"> Total </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2" cols="5" xs="5">
                <v-col>
                  {{
                    forProfitData && forProfitData.length > 0
                      ? forProfitData[0].Assets
                        ? currencyConvert(forProfitData[0].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
              <v-col v-if="evaluateStepper" class="text-center pt-2 pb-2" cols="5" xs="5">
                <v-col>
                  {{
                    forProfitData && forProfitData.length > 0
                      ? forProfitData[1].Assets
                        ? currencyConvert(forProfitData[1].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2" cols="5" xs="5">
                <v-col>
                  {{
                    forProfitData && forProfitData.length > 0
                      ? forProfitData[2].Assets
                        ? currencyConvert(forProfitData[2].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2" cols="5" xs="5">
                <v-col>
                  {{
                    forProfitData && forProfitData.length > 0
                      ? forProfitData[3].Assets
                        ? currencyConvert(forProfitData[3].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2" cols="5" xs="5">
                <v-col>
                  {{
                    forProfitData && forProfitData.length > 0
                      ? forProfitData[4].Assets
                        ? currencyConvert(forProfitData[4].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-col>
    </v-col>
    <v-col v-if="!display.xs.value" class="pa-0 pt-3">
      <v-row no-gutters>
        <v-col v-if="forProfitData && forProfitData.length > 0" class="justify-start widgetLeftButtonPosition">
          <v-btn
            v-if="!$authz.hasPermission($authz.permissionSet.My_Pipeline__c, $authz.permission.None) && !showZerostate"
            class="ml-0 text-capitalize"
            :color="theme.dark ? '' : 'accent'"
            @click="viewDetails('For Profit')"
          >
            View Plans Pipeline
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="display.xs.value" class="pa-0 pt-3" cols="12" xs="12">
      <v-col cols="12" xs="12" class="pa-0">
        <v-btn
          v-if="!$authz.hasPermission($authz.permissionSet.My_Pipeline__c, $authz.permission.None) && !showZerostate"
          class="ml-0 mr-0 text-capitalize mobileViewForProspect"
          :color="theme.dark ? '' : 'accent'"
          @click="viewDetails('For Profit')"
        >
          View Plans Pipeline
        </v-btn>
      </v-col>
    </v-col>
  </v-col>
</template>
<script>
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  props: ['forProfitData', 'totalAUMForPlans', 'showPlanLoader'],
  setup(props) {
    const router = useRouter()
    const display = useDisplay()
    const theme = useTheme()
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const prospecting = ref(false)
    const evaluating = ref(false)
    const proposing = ref(false)
    const finalizing = ref(false)
    const completed = ref(false)
    const filterDialog = ref(false)
    const prospectStepper = ref(true)
    const evaluateStepper = ref(false)
    const proposeStepper = ref(false)
    const finalizeStepper = ref(false)
    const completedStepper = ref(false)
    const zeroStateImage = ref(require('@/assets/images/pipeline zero-state-background.svg'))
    const drag = ref(false)
    const publicSchoolData = ref([])
    const municipalitiesData = ref([])
    const isIndividualAccount = ref(false)
    const nonProfitData = ref([])
    const participantData = ref([])
    const totalAssets = ref([])
    const totalAUM = ref(0)
    const myProspectIndividual = ref([])
    const totalAUMForIndividuals = ref(0)
    const totalFinalAUM = ref(0)
    const showZerostate = ref(false)
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
    const viewDetails = (type) => {
      router
        .push({
          name: 'TALProspectPlans',
          params: { Type: type }
        })
        .catch(() => {})
    }
    const createAccount = () => {
      store.state.openAccountDetail = {}
      filterDialog.value = true
    }
    const displayInfo = (name) => {
      if (name === 'Prospecting') {
        displayProspecting()
      } else if (name === 'Evaluating') {
        displayEvaluating()
      } else if (name === 'Proposing') {
        displayProposing()
      } else if (name === 'Finalizing') {
        displayFinalizing()
      } else {
        displayCompleted()
      }
    }
    const openIndividualContactInformation = () => {
      isIndividualAccount.value = true
    }
    const displayProspecting = () => {
      prospectStepper.value = true
      evaluateStepper.value = false
      proposeStepper.value = false
      finalizeStepper.value = false
      completedStepper.value = false
    }
    const displayEvaluating = () => {
      prospectStepper.value = false
      evaluateStepper.value = true
      proposeStepper.value = false
      finalizeStepper.value = false
      completedStepper.value = false
    }
    const displayProposing = () => {
      prospectStepper.value = false
      evaluateStepper.value = false
      proposeStepper.value = true
      finalizeStepper.value = false
      completedStepper.value = false
    }
    const displayFinalizing = () => {
      prospectStepper.value = false
      evaluateStepper.value = false
      proposeStepper.value = false
      finalizeStepper.value = true
      completedStepper.value = false
    }
    const displayCompleted = () => {
      prospectStepper.value = false
      evaluateStepper.value = false
      proposeStepper.value = false
      finalizeStepper.value = false
      completedStepper.value = true
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
    const viewDetailsWithStatus = (statusType) => {
      router
        .push({
          name: 'TALProspectPlans',
          params: { statusType: statusType }
        })
        .catch(() => {})
    }
    const mobileStepperDisplay = () => {
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
    }
    const viewDetailsWithStatusForIndividual = (statusType, type) => {
      router
        .push({
          name: 'TALProspectPlans',
          params: {
            Type: type,
            statusType: statusType
          }
        })
        .catch(() => {})
    }
    const createCorporate = () => {
      router.push('/TAL/StartupPlan').catch(() => {})
    }
    const fontSize = computed(() => {
      return 14
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
    const showMunicipalities = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin)) {
        return $authz.allowedByProgram(
          $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
          $authz.typeOfBusiness.Municipalities
        )
      } else if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338)
      ) {
        return (
          $authz.allowedByProgram(
            $authz.programPermissionSet.Type_of_Business_Advisors_Firms_allowed__c,
            $authz.typeOfBusiness.Municipalities
          ) &&
          $authz.allowedByAccount(
            $authz.accountPermissionSet.Type_of_Business_Advisors_allowed__c,
            $authz.typeOfBusiness.Municipalities
          )
        )
      } else return true
    })
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
      if (display.width.value === 667) {
        return 'flexWidthMobileRotate'
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
      } else return 'stepperCompleted'
    })
    const aumClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-6'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-4'
      } else return 'pl-6'
    })
    const prospectClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-4'
      }
      if (display.width.value === 1280) {
        return 'pl-3'
      }
      if (display.width.value === 1024) {
        return 'pl-4'
      }
      if (display.width.value === 667) {
        return 'pl-3'
      } else return 'pl-4'
    })
    const evaluateClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-5'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      }
      if (display.width.value === 667) {
        return 'pl-4'
      } else return 'pl-5'
    })
    const proposeClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-5'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      }
      if (display.width.value === 667) {
        return 'pl-5'
      } else return 'pl-5'
    })
    const finalizeClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-6'
      }
      if (display.width.value === 1280) {
        return 'pl-4'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      }
      if (display.width.value === 667) {
        return 'pl-5'
      } else return 'pl-5'
    })
    const currentTitle = computed(() => {
      if (slides.value[currentIndex.value].stage) {
        displayInfo(slides.value[currentIndex.value].stage)
      }
      return slides.value[currentIndex.value].stage
    })
    watch(
      () => props.forProfitData,
      () => {
        if (props.forProfitData && props.forProfitData.length > 0) {
          if (
            props.forProfitData[0].Plans === 0 &&
            props.forProfitData[1].Plans === 0 &&
            props.forProfitData[2].Plans === 0 &&
            props.forProfitData[3].Plans === 0 &&
            props.forProfitData[4].Plans === 0
          ) {
            showZerostate.value = true
          }
        }
      },
      { immediate: true }
    )
    watch(
      () => totalAUM.value,
      () => {
        totalFinalAUM.value = props.totalAUMForPlans
        if (props.forProfitData && props.forProfitData.length > 0) {
          totalAssets.value[0] = props.forProfitData && props.forProfitData.length > 0 ? props.forProfitData[0].Assets : 0
          totalAssets.value[1] = props.forProfitData && props.forProfitData.length > 0 ? props.forProfitData[1].Assets : 0
          totalAssets.value[2] = props.forProfitData && props.forProfitData.length > 1 ? props.forProfitData[2].Assets : 0
          totalAssets.value[3] = props.forProfitData && props.forProfitData.length > 2 ? props.forProfitData[3].Assets : 0
          totalAssets.value[4] = props.forProfitData && props.forProfitData.length > 3 ? props.forProfitData[4].Assets : 0
        } else {
          totalAssets.value[0] = 0
          totalAssets.value[1] = 0
          totalAssets.value[2] = 0
          totalAssets.value[3] = 0
          totalAssets.value[4] = 0
        }
      }
    )
    return {
      theme,
      display,
      $authz,
      screenClass,
      prospectClass,
      finalizeClass,
      completedClass,
      currentIndex,
      slides,
      showEmployerSponsored,
      showZerostate,
      showSchool,
      publicSchoolData,
      prospectStepper,
      evaluateStepper,
      proposeStepper,
      finalizeStepper,
      completedStepper,
      prospecting,
      evaluating,
      proposing,
      finalizing,
      completed,
      zeroStateImage,
      drag,
      municipalitiesData,
      nonProfitData,
      participantData,
      myProspectIndividual,
      totalAUMForIndividuals,
      fontSize,
      showIndividuals,
      showMunicipalities,
      aumClass,
      evaluateClass,
      proposeClass,
      currentTitle,
      createAccount,
      openIndividualContactInformation,
      mobileStepperDisplay,
      viewDetailsWithStatusForIndividual,
      currencyConvert,
      viewDetailsWithStatus,
      displayInfo,
      createCorporate,
      viewDetails
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
  width: 21% !important;
  margin: 0 -20px 0 -20px;
}
.stepperCompleted {
  width: 19% !important;
  margin: 0 -19px 0 -19px;
}
.flexWidthBigScreen {
  width: 21% !important;
  margin: 0 -20px 0 -20px;
}
.stepperCompletedBigScreen {
  width: 19% !important;
  margin: 0 -19px 0 -19px;
}
.flexWidthHidpi {
  width: 22% !important;
  margin: 0 -18px 0 -18px;
}
.stepperCompletedHidpi {
  width: 19% !important;
  margin: 0 -18px 0 -18px;
}
.flexWidthMdpi {
  width: 21.4% !important;
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
  /* clip-path: polygon(0% 0%, 80% 0%, 85% 50%, 80% 100%, 0% 100%); */
  /* clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%); */
  clip-path: polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%);
}
.middle_polygon {
  /* clip-path: polygon(80% 0%, 85% 50%, 80% 100%, 0% 100%, 5% 50%, 0% 0%); */
  clip-path: polygon(95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%);
}
.end_polygon {
  clip-path: polygon(0% 0%, 5% 50%, 0% 100%, 100% 100%, 100% 0%);
}
.prospectingBackground {
  background-color: #a1e2ff !important;
}
.evaluatingBackground {
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
<style>
.custom .v-window__prev,
.custom .v-window__next {
  display: none;
}

.custom .v-carousel__controls {
  display: none;
}
</style>
