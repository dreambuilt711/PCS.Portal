<template>
  <v-col class="pa-0">
    <v-card v-if="!display.xs.value" class="elevation-0 pt-2">
      <div class="flex d-flex flex-row" style="height: 40px" :class="display.width.value === 1024 ? 'pl-6' : 'pl-4'">
        <div class="start_polygon background_grey rounded-s-lg" :class="screenClass">
          <div class="pt-3">
            <div>
              <h5 class="headerClass" :class="[theme.dark ? 'text-black' : '', aumClass]">
                AUM1
                {{ currencyConvert(totalAUMForIndividuals ? totalAUMForIndividuals : 0) }}
              </h5>
            </div>
          </div>
        </div>
        <div
          v-if="
            !$authz.hasPermission($authz.permissionSet.Comparison__c, $authz.permission.None) ||
            !$authz.hasPermission($authz.permissionSet.Diagnostic__c, $authz.permission.None)
          "
          class="cursor-pointer middle_polygon agreementBackground"
          :class="screenClass"
          @click="viewDetailsWithStatusForIndividual('Agreement', 'Participants')"
        >
          <div class="pt-3">
            <div>
              <h5 :class="[theme.dark ? 'text-black' : '', agreementClass]">
                <b class="steppercss"> Agreement </b>
              </h5>
            </div>
          </div>
        </div>
        <div
          v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
          class="cursor-pointer middle_polygon setupBackground"
          :class="screenClass"
          @click="viewDetailsWithStatusForIndividual('Setup', 'Participants')"
        >
          <div class="pt-3">
            <div>
              <h5 :class="[theme.dark ? 'text-black' : '', setupClass]">
                <b class="steppercss"> Setup </b>
              </h5>
            </div>
          </div>
        </div>
        <div
          v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
          class="cursor-pointer middle_polygon fundingBackground"
          :class="screenClass"
          @click="viewDetailsWithStatusForIndividual('Funding', 'Participants')"
        >
          <div class="pt-3">
            <div>
              <h5 :class="[theme.dark ? 'text-black' : '', fundingClass]">
                <b class="steppercss"> Funding </b>
              </h5>
            </div>
          </div>
        </div>
        <div
          v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
          class="cursor-pointer end_polygon rounded-e-lg completedBackground"
          :class="completedClass"
          @click="viewDetailsWithStatusForIndividual('Complete', 'Participants')"
        >
          <div class="pt-3">
            <div class="text-center">
              <h5 :class="[theme.dark ? 'text-black' : '']">
                <b class="steppercss"> Complete </b>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <div v-if="display.xs.value" cols="12">
      <v-carousel v-model="currentIndex" height="60" class="py-2 custom">
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <div
            v-if="!$authz.hasPermission($authz.permissionSet.Proposal__c, $authz.permission.None)"
            :class="slide.class"
            @click="displayInfo(slide.stage)"
          >
            <div class="pt-3 pb-3">
              <div>
                <h5 :class="[theme.dark ? 'text-black' : '']">
                  <b class="steppercss pl-16 ml-14">{{ currentTitle }}</b>
                </h5>
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </div>
    <v-col v-if="!display.xs.value" class="pa-0 pt-3">
      <v-col v-if="participantData && participantData.length === 0 && !showPlanLoader" class="ma-1 pa-0">
        <v-col class="d-flex flex-column justify-center align-center pa-0">
          <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
            <v-col class="text-center">
              <v-col>
                <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
              </v-col>
              <v-col class="pt-5 pb-5 font-weight-medium">
                As you look for new clients this pipeline will keep track your progress from your first call to signed account
                applications
              </v-col>
              <v-col class="font-weight-medium"> Create an account to get started </v-col>
              <v-col class="pt-5 d-flex justify-center">
                <v-row>
                  <v-col :class="!display.xs.value ? 'pl-0' : ''" cols="12">
                    <v-btn
                      v-if="showSchool || showIndividuals"
                      class="mr-0 text-capitalize"
                      color="accent"
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
      </v-col>
      <v-col v-else class="pa-0">
        <v-col v-if="showZerostate" class="pa-0">
          <v-col class="d-flex flex-column justify-center align-center pa-0">
            <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
              <v-col class="text-center">
                <v-col>
                  <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
                </v-col>
                <v-col class="pt-5 pb-5 font-weight-medium">
                  As you look for new clients this pipeline will keep track your progress from your first call to signed account
                  applications
                </v-col>
                <v-col class="font-weight-medium"> Create an account to get started </v-col>
                <v-col class="pt-5 d-flex justify-center">
                  <v-row>
                    <v-col :class="!display.xs.value ? 'pl-0' : ''" cols="12">
                      <v-btn
                        v-if="showSchool || showIndividuals"
                        class="mr-0 text-capitalize"
                        color="accent"
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
        </v-col>
        <v-col v-else>
          <v-col>
            <v-col v-if="showIndividuals" class="headerClass background_grey text-capitalize pt-1 pb-1">
              Participant Plan Type
            </v-col>
            <v-col>
              <v-divider v-if="showSchool && false" class="mt-1" />
              <v-row v-if="showSchool && false">
                <v-col
                  class="pl-0 pr-0 text-center pt-4 pb-4"
                  cols="3"
                  lg="3"
                  md="3"
                  sm="3"
                  :class="display.width.value === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  <v-row no-gutters>
                    <v-col cols="3" md="3">
                      <v-icon size="18" class="icon-schools" :class="showSchool ? 'schoolIcon' : 'disabledColor'" />
                    </v-col>
                    <v-col
                      cols="9"
                      lg="9"
                      md="9"
                      class="text-left"
                      :class="showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor'"
                      @click="showSchool ? viewDetails('Public Schools') : ''"
                    >
                      Schools
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass mx-4" cols="1" lg="1" md="1" sm="1">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col :class="showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                      {{ publicSchoolData[0].Plans ? publicSchoolData[0].Plans : 0 }}
                    </v-col>
                    <v-col>
                      {{
                        publicSchoolData && publicSchoolData.length > 0
                          ? publicSchoolData[0].Assets
                            ? currencyConvert(publicSchoolData[0].Assets)
                            : 0
                          : 0
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showSchool ? 'text-hyperlink' : 'disabledColor'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col :class="showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                      {{ publicSchoolData[1].Plans ? publicSchoolData[1].Plans : 0 }}
                    </v-col>
                    <v-col>
                      {{
                        publicSchoolData && publicSchoolData.length > 0
                          ? publicSchoolData[1].Assets
                            ? currencyConvert(publicSchoolData[1].Assets)
                            : 0
                          : 0
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showSchool ? 'text-hyperlink' : 'disabledColor'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col :class="showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                      {{ publicSchoolData[2].Plans ? publicSchoolData[2].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(publicSchoolData[2].Assets ? publicSchoolData[2].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showSchool ? 'text-hyperlink' : 'disabledColor'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="publicSchoolData && publicSchoolData.length > 0">
                    <v-col :class="showSchool ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                      {{ publicSchoolData[3].Plans ? publicSchoolData[3].Plans : 0 }}
                    </v-col>
                    <v-col>{{ currencyConvert(publicSchoolData[3].Assets ? publicSchoolData[3].Assets : 0) }}</v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showSchool ? 'text-hyperlink' : 'disabledColor'">-</v-col>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-col v-if="showIndividuals" class="pt-2">
            <v-col>
              <v-row>
                <v-col
                  class="pl-0 pr-0 text-center pt-4 pb-4"
                  cols="3"
                  lg="3"
                  md="3"
                  sm="3"
                  :class="display.width.value === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  <v-row no-gutters>
                    <v-col cols="3" lg="3" md="3">
                      <v-icon size="18" class="icon-individual" :class="showIndividuals ? 'participantIcon' : 'disabledColor'" />
                    </v-col>
                    <v-col
                      cols="9"
                      lg="9"
                      md="9"
                      class="text-left"
                      :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"
                      @click="showIndividuals ? viewDetails('Participants') : ''"
                    >
                      Individuals
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col
                  class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass"
                  cols="2"
                  lg="2"
                  md="2"
                  sm="2"
                  :class="display.width.value === 1280 ? 'mx-2' : 'mx-3'"
                >
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"
                      @click="viewDetailsWithStatusForIndividual('Agreement', 'Participants')"
                    >
                      {{ participantData[0].Plans ? participantData[0].Plans : 0 }}
                    </v-col>
                    <v-col>
                      {{
                        participantData && participantData.length > 0
                          ? participantData[0].Assets
                            ? currencyConvert(participantData[0].Assets)
                            : 0
                          : 0
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showIndividuals ? 'text-hyperlink' : 'disabledColor'"> - </v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col
                  class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass"
                  cols="2"
                  lg="2"
                  md="2"
                  sm="2"
                  :class="display.width.value === 1280 ? 'mx-2' : 'mx-3'"
                >
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"
                      @click="viewDetailsWithStatusForIndividual('Setup', 'Participants')"
                    >
                      {{ participantData[1].Plans ? participantData[1].Plans : 0 }}
                    </v-col>
                    <v-col>
                      {{
                        participantData && participantData.length > 0
                          ? participantData[1].Assets
                            ? currencyConvert(participantData[1].Assets)
                            : 0
                          : 0
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showIndividuals ? 'text-hyperlink' : 'disabledColor'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col
                  class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass"
                  cols="2"
                  lg="2"
                  md="2"
                  ms="2"
                  :class="display.width.value === 1280 ? 'mx-2' : 'mx-3'"
                >
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"
                      @click="viewDetailsWithStatusForIndividual('Funding', 'Participants')"
                    >
                      {{ participantData[2].Plans ? participantData[2].Plans : 0 }}
                    </v-col>
                    <v-col>
                      {{
                        participantData && participantData.length > 1
                          ? participantData[2].Assets
                            ? currencyConvert(participantData[2].Assets)
                            : 0
                          : 0
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showIndividuals ? 'text-hyperlink' : 'disabledColor'">-</v-col>
                  </v-col>
                </v-col>
                <v-divider inset vertical class="d-none d-sm-block" />
                <v-col class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="2" lg="2" md="2" sm="2">
                  <v-col v-if="participantData && participantData.length > 0">
                    <v-col
                      :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"
                      @click="viewDetailsWithStatusForIndividual('Complete', 'Participants')"
                    >
                      {{ participantData[3].Plans ? participantData[3].Plans : 0 }}
                    </v-col>
                    <v-col>
                      {{
                        participantData && participantData.length > 2
                          ? participantData[3].Assets
                            ? currencyConvert(participantData[3].Assets)
                            : 0
                          : 0
                      }}
                    </v-col>
                  </v-col>
                  <v-col v-else>
                    <v-col :class="showIndividuals ? 'text-hyperlink' : 'disabledColor'">-</v-col>
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
                  class="pt-2 pb-2 pl-16"
                  cols="3"
                  md="3"
                  sm="6"
                  :class="display.width.value === 1280 ? 'mr-n4' : fontSize > 13 ? '' : 'mr-n6'"
                >
                  Total
                </v-col>
                <v-col
                  class="text-center pt-2 pb-2"
                  cols="2"
                  lg="2"
                  md="2"
                  sm="2"
                  :class="display.width.value === 1280 ? 'mx-2' : 'mx-3'"
                >
                  <v-col>
                    {{
                      participantData && participantData.length > 0
                        ? participantData[0].Assets
                          ? currencyConvert(participantData[0].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col
                  class="text-center pt-2 pb-2"
                  cols="2"
                  lg="2"
                  md="2"
                  sm="2"
                  :class="display.width.value === 1280 ? 'mx-2' : 'mx-3'"
                >
                  <v-col>
                    {{
                      participantData && participantData.length > 0
                        ? participantData[1].Assets
                          ? currencyConvert(participantData[1].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col
                  class="text-center pt-2 pb-2"
                  cols="2"
                  lg="2"
                  md="2"
                  sm="2"
                  :class="display.width.value === 1280 ? 'mx-2' : 'mx-3'"
                >
                  <v-col>
                    {{
                      participantData && participantData.length > 1
                        ? participantData[2].Assets
                          ? currencyConvert(participantData[2].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col class="text-center pt-2 pb-2" cols="2" lg="2" md="2" sm="2">
                  <v-col>
                    {{
                      participantData && participantData.length > 2
                        ? participantData[3].Assets
                          ? currencyConvert(participantData[3].Assets)
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
      <v-col v-if="participantData && participantData.length === 0 && !showPlanLoader" class="ma-1 pa-0">
        <v-col class="d-flex flex-column justify-center align-center">
          <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
            <v-col class="text-center">
              <v-col>
                <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
              </v-col>
              <v-col class="pt-5 pb-5 font-weight-medium">
                As you look for new clients this pipeline will keep track your progress from your first call to signed account
                applications
              </v-col>
              <v-col class="font-weight-medium"> Create an account to get started </v-col>
              <v-col class="pt-5 d-flex justify-center">
                <v-row>
                  <v-col :class="!display.xs.value ? 'pl-0' : ''" cols="12">
                    <v-btn
                      v-if="showSchool || showIndividuals"
                      class="mr-0 text-capitalize"
                      color="accent"
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
      </v-col>
      <v-col v-else class="pa-0">
        <v-col v-if="showZerostate" class="pa-0">
          <v-col class="d-flex flex-column justify-center align-center">
            <v-card class="pa-5 mt-10" :width="display.xs.value ? '88%' : '68%'" height="70%">
              <v-col class="text-center">
                <v-col>
                  <h4 class="font-weight-medium font_18">This is your sales prospect pipeline</h4>
                </v-col>
                <v-col class="pt-5 pb-5 font-weight-medium">
                  As you look for new clients this pipeline will keep track your progress from your first call to signed account
                  applications
                </v-col>
                <v-col class="font-weight-medium"> Create an account to get started </v-col>
                <v-col class="pt-5 d-flex justify-center">
                  <v-row>
                    <v-col :class="!display.xs.value ? 'pl-0' : ''" cols="12">
                      <v-btn
                        v-if="showSchool || showIndividuals"
                        class="mr-0 text-capitalize"
                        color="accent"
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
        </v-col>
        <v-col v-else>
          <v-col v-if="showIndividuals" class="headerClass mt-2 background_grey text-uppercase pt-1 pb-1"> Individuals </v-col>
          <v-col v-if="showIndividuals">
            <v-row>
              <v-col class="pl-0 pr-0 text-center pt-4 pb-4" cols="6">
                <v-row no-gutters>
                  <v-col cols="3" class="pa-0">
                    <v-icon size="18" class="icon-individual" :class="showIndividuals ? 'participantIcon' : 'disabledColor'" />
                  </v-col>
                  <v-col
                    cols="9"
                    class="text-left cursor-pointer"
                    :class="showIndividuals ? 'text-hyperlink' : 'disabledColor'"
                    @click="showIndividuals ? viewDetails('Participants') : ''"
                  >
                    Individuals
                  </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5">
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                    {{ participantData[0].Plans ? participantData[0].Plans : 0 }}
                  </v-col>
                  <v-col>
                    {{
                      participantData && participantData.length > 0
                        ? participantData[0].Assets
                          ? currencyConvert(participantData[0].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"> - </v-col>
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5">
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                    {{ participantData[1].Plans ? participantData[1].Plans : 0 }}
                  </v-col>
                  <v-col>
                    {{
                      participantData && participantData.length > 0
                        ? participantData[1].Assets
                          ? currencyConvert(participantData[1].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"> - </v-col>
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5">
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                    {{ participantData[2].Plans ? participantData[2].Plans : 0 }}
                  </v-col>
                  <v-col>
                    {{
                      participantData && participantData.length > 1
                        ? participantData[2].Assets
                          ? currencyConvert(participantData[2].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"> - </v-col>
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2 pl-0 pr-0 alignCenterClass" cols="5">
                <v-col v-if="participantData && participantData.length > 0">
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'">
                    {{ participantData[3].Plans ? participantData[3].Plans : 0 }}
                  </v-col>
                  <v-col>
                    {{
                      participantData && participantData.length > 2
                        ? participantData[3].Assets
                          ? currencyConvert(participantData[3].Assets)
                          : 0
                        : 0
                    }}
                  </v-col>
                </v-col>
                <v-col v-else>
                  <v-col :class="showIndividuals ? 'cursor-pointer text-hyperlink' : 'disabledColor'"> - </v-col>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-divider class="mt-1" />
            <v-row>
              <v-col class="pl-0 pr-0 text-center pt-2" cols="6">
                <v-row no-gutters>
                  <v-col cols="12" class="text-left pl-10"> Total </v-col>
                </v-row>
              </v-col>
              <v-divider inset vertical class="d-none d-block" />
              <v-col v-if="prospectStepper" class="text-center pt-2 pb-2" cols="5">
                <v-col>
                  {{
                    participantData && participantData.length > 0
                      ? participantData[0].Assets
                        ? currencyConvert(participantData[0].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
              <v-col v-if="proposeStepper" class="text-center pt-2 pb-2" cols="5">
                <v-col>
                  {{
                    participantData && participantData.length > 0
                      ? participantData[1].Assets
                        ? currencyConvert(participantData[1].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
              <v-col v-if="finalizeStepper" class="text-center pt-2 pb-2" cols="5">
                <v-col>
                  {{
                    participantData && participantData.length > 1
                      ? participantData[2].Assets
                        ? currencyConvert(participantData[2].Assets)
                        : 0
                      : 0
                  }}
                </v-col>
              </v-col>
              <v-col v-if="completedStepper" class="text-center pt-2 pb-2" cols="5">
                <v-col>
                  {{
                    participantData && participantData.length > 2
                      ? participantData[3].Assets
                        ? currencyConvert(participantData[3].Assets)
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
    <v-col v-if="!display.xs.value" pt-3>
      <v-row no-gutters>
        <v-col v-if="participantData && participantData.length > 0" class="justify-start widgetLeftButtonPosition">
          <v-btn
            v-if="!$authz.hasPermission($authz.permissionSet.My_Pipeline__c, $authz.permission.None) && !showZerostate"
            class="ml-0 text-capitalize"
            color="accent"
            @click="viewDetails('Participants')"
          >
            View Participant Pipeline
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="display.xs.value" class="pt-3 pa-0" cols="12">
      <v-col cols="12">
        <v-btn
          v-if="!$authz.hasPermission($authz.permissionSet.My_Pipeline__c, $authz.permission.None) && !showZerostate"
          class="ml-0 mr-0 text-capitalize mobileViewForProspect"
          color="accent"
          @click="viewDetails('Participants')"
        >
          View Participant Pipeline
        </v-btn>
      </v-col>
    </v-col>
    <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="OpenFlow" />
  </v-col>
</template>
<script>
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
import { ref, getCurrentInstance, computed, watch } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  components: {
    OpenAccount
  },
  props: ['participantData', 'totalAUMForIndividuals', 'showPlanLoader'],
  setup(props, { root }) {
    const instance = getCurrentInstance()
    const router = useRouter()
    const theme = useTheme()
    const display = useDisplay()
    const store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const prospecting = ref(false)
    const evaluating = ref(false)
    const proposing = ref(false)
    const finalizing = ref(false)
    const completed = ref(false)
    const filterDialog = ref(false)
    const prospectStepper = ref(true)
    const proposeStepper = ref(false)
    const finalizeStepper = ref(false)
    const completedStepper = ref(false)
    const zeroStateImage = ref(require('@/assets/images/pipeline zero-state-background.svg'))
    // const drag = ref(false)
    const forProfitData = ref([])
    const publicSchoolData = ref([])
    const municipalitiesData = ref([])
    const isIndividualAccount = ref(false)
    const nonProfitData = ref([])
    const totalAssets = ref([])
    const totalAUM = ref(0)
    const myProspectIndividual = ref([])
    const totalAUMForPlans = ref(0)
    const totalFinalAUM = ref(0)
    const showZerostate = ref(false)
    const currentIndex = ref(0)
    const slides = ref([
      {
        class: 'cursor-pointer start_polygon agreementBackground rounded-l-lg',
        stage: 'Agreement'
      },
      {
        class: 'cursor-pointer middle_polygon setupBackground',
        stage: 'Setup'
      },
      {
        class: 'cursor-pointer middle_polygon fundingBackground',
        stage: 'Funding'
      },
      {
        class: 'cursor-pointer end_polygon rounded-r-lg completedBackground',
        stage: 'Complete'
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
      if (name === 'Agreement') {
        displayProspecting()
      } else if (name === 'Setup') {
        displayProposing()
      } else if (name === 'Funding') {
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
      proposeStepper.value = false
      finalizeStepper.value = false
      completedStepper.value = false
    }
    const displayEvaluating = () => {
      prospectStepper.value = false
      proposeStepper.value = false
      finalizeStepper.value = false
      completedStepper.value = false
    }
    const displayProposing = () => {
      prospectStepper.value = false
      proposeStepper.value = true
      finalizeStepper.value = false
      completedStepper.value = false
    }
    const displayFinalizing = () => {
      prospectStepper.value = false
      proposeStepper.value = false
      finalizeStepper.value = true
      completedStepper.value = false
    }
    const displayCompleted = () => {
      prospectStepper.value = false
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
      const slider = document.querySelector('.slider-container'),
        slidess = Array.from(document.querySelectorAll('.slide'))

      let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID = 0,
        currentIndex = 0

      slidess.forEach((slide, index) => {
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
        if (movedBy < -100 && currentIndex < slidess.length - 1) currentIndex += 1
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
          displayProspecting()
        } else if (currentIndex === 1) {
          displayEvaluating()
        } else if (currentIndex === 2) {
          displayProposing()
        } else if (currentIndex === 3) {
          displayFinalizing()
        } else if (currentIndex === 4) {
          displayCompleted()
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
      return root.$children[0].fontsize
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
        return 'pl-12'
      }
      if (display.width.value === 1280) {
        return 'pl-10'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      } else return 'pl-15'
    })
    const prospectClass = computed(() => {
      if (display.width.value === 1366) {
        return 'pl-4'
      }
      if (display.width.value === 1280) {
        return 'pl-3'
      }
      if (display.width.value === 1024) {
        return 'pl-10'
      }
      if (display.width.value === 667) {
        return 'pl-3'
      } else return 'pl-5'
    })
    const agreementClass = computed(() => {
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
      } else return 'pl-15'
    })
    const setupClass = computed(() => {
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
      } else return 'pl-16'
    })
    const fundingClass = computed(() => {
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
      } else return 'pl-16'
    })
    const currentTitle = computed(() => {
      if (slides.value[currentIndex.value].stage) {
        displayInfo(slides.value[currentIndex.value].stage)
      }
      return slides.value[currentIndex.value].stage
    })
    watch(
      () => props.participantData,
      () => {
        if (props.participantData && props.participantData.length > 0) {
          if (
            props.participantData[0].Plans === 0 &&
            props.participantData[1].Plans === 0 &&
            props.participantData[2].Plans === 0 &&
            props.participantData[3].Plans === 0
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
        totalFinalAUM.value = props.totalAUMForIndividuals
        if (props.participantData && props.participantData.length > 0) {
          totalAssets.value[0] = props.participantData[0].Assets
          totalAssets.value[1] = props.participantData[1].Assets
          totalAssets.value[2] = props.participantData[2].Assets
          totalAssets.value[3] = props.participantData[3].Assets
          totalAssets.value[4] = props.participantData[4].Assets
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
      currencyConvert,
      viewDetailsWithStatusForIndividual,
      viewDetailsWithStatus,
      mobileStepperDisplay,
      displayInfo,
      slides,
      showSchool,
      showIndividuals,
      completedClass,
      completed,
      createAccount,
      showZerostate,
      viewDetails,
      publicSchoolData,
      prospectStepper,
      proposeStepper,
      finalizeStepper,
      completedStepper,
      filterDialog,
      prospecting,
      evaluating,
      proposing,
      finalizing,
      zeroStateImage,
      forProfitData,
      municipalitiesData,
      nonProfitData,
      myProspectIndividual,
      totalAUMForPlans,
      openIndividualContactInformation,
      fontSize,
      createCorporate,
      showMunicipalities,
      aumClass,
      prospectClass,
      agreementClass,
      setupClass,
      fundingClass,
      currentTitle,
      screenClass,
      showEmployerSponsored
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
  width: 26% !important;
  margin: 0 -27px 0 -22px;
}
.stepperCompleted {
  width: 20% !important;
  margin: 0 -25px 0 -25px;
}
.flexWidthBigScreen {
  width: 26.3% !important;
  margin: 0 -25px 0 -25px;
}
.stepperCompletedBigScreen {
  width: 19% !important;
  margin: 0 -25px 0 -25px;
}
.flexWidthHidpi {
  width: 25.8% !important;
  margin: 0 -18px 0 -18px;
}
.stepperCompletedHidpi {
  width: 20% !important;
  margin: 0 -18px 0 -18px;
}
.flexWidthMdpi {
  width: 26% !important;
  margin: 0 -18px 0 -18px;
}
.stepperCompletedMdpi {
  width: 21% !important;
  margin: 0 -15px 0 -15px;
}
.flexWidthIpadPro {
  width: 26.6% !important;
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
  clip-path: polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%);
}
.middle_polygon {
  /* clip-path: polygon(80% 0%, 85% 50%, 80% 100%, 0% 100%, 5% 50%, 0% 0%); */
  clip-path: polygon(95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%);
}
.end_polygon {
  clip-path: polygon(0% 0%, 5% 50%, 0% 100%, 100% 100%, 100% 0%);
}
.agreementBackground {
  background-color: #82c6ff !important;
}
.setupBackground {
  background-color: #62abff !important;
}
.fundingBackground {
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
