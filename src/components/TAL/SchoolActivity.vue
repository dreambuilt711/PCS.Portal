<template>
  <v-col cols="12" xs="12" class="pa-0">
    <v-col cols="12" xs="12" class="pb-3 ml-2" :class="display.xs.value ? 'pl-1' : 'pl-4'">
      <v-row>
        <v-col cols="12" xs="12" class="text-left text-uppercase font_14 mb-1">
          <h4 :class="theme.dark ? '' : 'text-accent'">
            <span class="handcursor" @click="initiatePanel = !initiatePanel">
              <span data-html2canvas-ignore="true">
                <v-icon
                  size="small"
                  :color="theme.dark ? '' : 'black'"
                  :class="initiatePanel ? 'rotateactivityicon iconSize' : 'iconSize'"
                  >fas fa-chevron-right</v-icon
                >
              </span>
            </span>
            <span class="font-weight-medium ml-4" :class="theme.dark ? '' : 'text-accent'"
              >Prospecting ({{ initiateList.length }})
            </span>
          </h4>
        </v-col>
        <v-col v-if="initiatePanel" cols="12" xs="12" :class="display.xs.value ? 'pr-2' : 'ml-4 pr-4'">
          <v-col cols="12" xs="12" :class="!display.xs.value ? 'pl-2' : ''">
            <v-row class="margin_left_1">
              <v-col v-if="!display.mdAndDown.value" cols="12" xs="12" class="mt-1">
                <v-row>
                  <v-col cols="1" xs="1" class="font-weight-medium font_12"> ID </v-col>
                  <v-col cols="1" xs="1" class="ml-4 font-weight-medium font_12"> Activity Date </v-col>
                  <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left pl-2"> Account Name </v-col>
                  <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left"> Email </v-col>
                  <v-col cols="2" xs="2" class="font-weight-medium font_12 text-right"> Phone </v-col>
                  <v-col cols="1" xs="1" class="font-weight-medium font_12 text-right"> Asset </v-col>
                  <!-- <v-col cols="3" xs="3" class="font-weight-medium font_12 text-right"></v-col> -->
                </v-row>
              </v-col>
              <v-col
                v-if="initiateList.length === 0 && !showInitiateLoader"
                cols="12"
                xs="12"
                class="text-center font_12 pt-2 pb-2"
                :class="theme.dark ? 'grey darken-2' : 'grey lighten-2'"
              >
                No data available
              </v-col>
              <v-col v-if="initiateList.length === 0 && showInitiateLoader" class="text-center pt-2 pb-2">
                <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
              </v-col>
              <v-col>
                <v-col v-for="(item, index) in initiateList" :key="`${item.ID}_${index}`" class="mb-2" cols="12" xs="12">
                  <v-row v-if="!display.mdAndDown.value">
                    <v-col class="align-self font_12" :class="[theme.dark ? '' : 'text-accent', 'font_12']" cols=" 1" xs="1">
                      {{ item.ID }}
                    </v-col>
                    <v-col class="align-self font_12 ml-4" :class="[theme.dark ? '' : 'td_color']" cols="1" xs="1">
                      {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                    </v-col>
                    <v-col
                      class="align-self font_12 text-capitalize text-left pl-2"
                      :class="[theme.dark ? '' : 'td_color']"
                      cols="2"
                      xs="2"
                    >
                      {{ item.AccountName }}
                    </v-col>
                    <v-col class="align-self font_12 text-left" :class="[theme.dark ? '' : 'td_color']" cols="2" xs="2">
                      {{ item.Email }}
                    </v-col>
                    <v-col class="align-self text-right font_12" :class="[theme.dark ? '' : 'td_color']" cols="2" xs="2">
                      {{ item.Phone }}
                    </v-col>
                    <v-col class="align-self text-right font_12" :class="[theme.dark ? '' : 'td_color']" cols="1" xs="1">
                      {{ item.Asset ? item.Asset : '-' }}
                    </v-col>
                  </v-row>
                  <v-row v-if="display.mdAndDown.value">
                    <v-col cols="12" xs="12" class="pr-2 pb-2 pl-1">
                      <v-row>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="8" xs="8" sm="6">
                              <h5 class="pt-1">
                                <span>ID</span>
                              </h5>
                              <h4>{{ item.ID }}</h4>
                            </v-col>
                            <v-col cols="12" xs="4" sm="3">
                              <h5 class="text-left pt-1">
                                <span>Activity Date</span>
                              </h5>
                              <h4 class="text-left">
                                {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                              </h4>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="8" xs="8" sm="6">
                              <h5 class="pt-1">
                                <span>Account Name</span>
                              </h5>
                              <h4 class="text-capitalize">
                                {{ item.AccountName }}
                              </h4>
                            </v-col>
                            <v-col cols="12" xs="4" sm="6">
                              <h5 class="text-left pt-1">
                                <span>Phone</span>
                              </h5>
                              <h4 class="text-left white-space-textwrap">
                                {{ item.Phone }}
                              </h4>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" xs="12" class="pa-0">
                          <v-row>
                            <v-col cols="8" xs="8" sm="6">
                              <h5 class="pt-1">
                                <span>Email</span>
                              </h5>
                              <h4>{{ item.Email }}</h4>
                            </v-col>
                            <v-col cols="12" xs="4" sm="6">
                              <h5 class="pt-1">
                                <span>Assets</span>
                              </h5>
                              <h4>{{ item.Asset ? item.Asset : '-' }}</h4>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-divider v-if="display.mdAndDown.value && index !== initiateList.length - 1" />
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
      <v-col class="pb-2" />
      <v-divider class="divider" />
      <v-row>
        <v-col cols="12" xs="12" class="text-left text-uppercase font_14 mb-1 mt-3">
          <h4 :class="theme.dark ? '' : 'text-accent'">
            <span class="handcursor" @click="discoverPanel = !discoverPanel">
              <span data-html2canvas-ignore="true">
                <v-icon
                  size="small"
                  :color="theme.dark ? '' : 'black'"
                  :class="discoverPanel ? 'rotateactivityicon iconSize' : 'iconSize'"
                  >fas fa-chevron-right</v-icon
                >
              </span>
            </span>
            <span class="font-weight-medium ml-4">Proposing ({{ discoverList.length }}) </span>
          </h4>
        </v-col>
        <v-col v-if="discoverPanel" cols="12" xs="12" :class="display.xs.value ? 'pr-2' : 'ml-4 pr-4'">
          <v-col cols="12" xs="12" :class="!display.xs.value ? 'pl-2' : ''">
            <v-row class="margin_left_1">
              <v-col v-if="!display.mdAndDown.value" cols="12" xs="12" class="mt-1">
                <v-row>
                  <v-col cols="1" xs="1" class="font-weight-medium font_12"> ID </v-col>
                  <v-col cols="1" xs="1" class="ml-4 font-weight-medium font_12"> Activity Date </v-col>
                  <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left pl-2"> Account Name </v-col>
                  <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left"> Email </v-col>
                  <v-col cols="2" xs="2" class="font-weight-medium font_12 text-right"> Phone </v-col>
                  <v-col cols="1" xs="1" class="font-weight-medium font_12 text-right"> Asset </v-col>
                  <v-col cols="3" xs="3" class="font-weight-medium font_12 text-right" />
                </v-row>
              </v-col>
              <v-col
                v-if="discoverList.length === 0 && !showDiscoverLoader"
                cols="12"
                xs="12"
                class="text-center font_12 pt-2 pb-2"
                :class="theme.dark ? 'grey darken-2' : 'grey lighten-2'"
              >
                No data available
              </v-col>
              <v-col v-if="discoverList.length === 0 && showDiscoverLoader" class="text-center pt-2 pb-2">
                <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
              </v-col>
              <v-col>
                <v-col v-for="(item, index) in discoverList" :key="`${item.ID}_${index}`" class="mb-2" cols="12" xs="12">
                  <v-row v-if="!display.mdAndDown.value">
                    <v-col class="align-self font_12" :class="[theme.dark ? '' : 'text-accent', 'font_12']" cols=" 1" xs="1">
                      {{ item.ID }}
                    </v-col>
                    <v-col class="align-self font_12 ml-4" :class="[theme.dark ? '' : 'td_color']" cols="1" xs="1">
                      {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                    </v-col>
                    <v-col
                      class="align-self font_12 text-capitalize text-left pl-2"
                      :class="[theme.dark ? '' : 'td_color']"
                      cols="2"
                      xs="2"
                    >
                      {{ item.AccountName }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="align-self font_12 text-capitalize text-left" :class="theme.dark ? '' : 'td_color'" cols="2" xs="2">
                  {{ item.Email }}
                </v-col>
                <v-col class="align-self text-right font_12" :class="theme.dark ? '' : 'td_color'" cols="2" xs="2">
                  {{ item.Phone }}
                </v-col>
                <v-col class="align-self text-right font_12" :class="theme.dark ? '' : 'td_color'" cols="1" xs="1">
                  {{ item.Asset ? item.Asset : '-' }}
                </v-col>
              </v-col>
            </v-row>
            <v-row v-if="display.mdAndDown.value">
              <v-col cols="12" xs="12" class="pr-2 pb-2 pl-1">
                <v-row>
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-row>
                      <v-col cols="8" xs="8" sm="6">
                        <h5 class="pt-1">
                          <span>ID</span>
                        </h5>
                        <h4>{{ item.ID }}</h4>
                      </v-col>
                      <v-col cols="12" xs="4" sm="3">
                        <h5 class="text-left pt-1">
                          <span>Activity Date</span>
                        </h5>
                        <h4 class="text-left">
                          {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-row>
                      <v-col cols="8" xs="8" sm="6">
                        <h5 class="pt-1">
                          <span>Account Name</span>
                        </h5>
                        <h4 class="text-capitalize">
                          {{ item.AccountName }}
                        </h4>
                      </v-col>
                      <v-col cols="12" xs="4" sm="6">
                        <h5 class="text-left pt-1">
                          <span>Phone</span>
                        </h5>
                        <h4 class="text-left white-space-textwrap">
                          {{ item.Phone }}
                        </h4>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" xs="12" class="pa-0">
                    <v-row>
                      <v-col cols="8" xs="8" sm="6">
                        <h5 class="pt-1">
                          <span>Email</span>
                        </h5>
                        <h4>{{ item.Email }}</h4>
                      </v-col>
                      <v-col cols="12" xs="4" sm="6">
                        <h5 class="pt-1">
                          <span>Assets</span>
                        </h5>
                        <h4>{{ item.Asset ? item.Asset : '-' }}</h4>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider v-if="display.mdAndDown.value && index !== discoverList.length - 1" />
          </v-col>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="pb-2" />
    <v-divider class="divider" />
    <v-row>
      <v-col cols="12" xs="12" class="text-left text-uppercase font_14 mb-1 mt-3">
        <h4 :class="theme.dark ? '' : 'text-accent'">
          <span class="handcursor" @click="validatePanel = !validatePanel">
            <span data-html2canvas-ignore="true">
              <v-icon
                size="small"
                :color="theme.dark ? '' : 'black'"
                :class="validatePanel ? 'rotateactivityicon iconSize' : 'iconSize'"
                >fas fa-chevron-right</v-icon
              >
            </span>
          </span>
          <span class="font-weight-medium ml-4" :class="theme.dark ? '' : 'text-accent'"
            >Finalizing ({{ validateList.length }})
          </span>
        </h4>
      </v-col>
      <v-col v-if="validatePanel" cols="12" xs="12" :class="display.xs.value ? 'pr-2' : 'ml-4 pr-4'">
        <v-col cols="12" xs="12" :class="!display.xs.value ? 'pl-2' : ''">
          <v-row class="margin_left_1">
            <v-col v-if="!display.mdAndDown.value" cols="12" xs="12" class="mt-1">
              <v-row>
                <v-col cols="1" xs="1" class="font-weight-medium font_12"> ID </v-col>
                <v-col cols="1" xs="1" class="ml-4 font-weight-medium font_12"> Activity Date </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left pl-2"> Account Name </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left"> Email </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 text-right"> Phone </v-col>
                <v-col cols="1" xs="1" class="font-weight-medium font_12 text-right"> Asset </v-col>
                <v-col cols="3" xs="3" class="font-weight-medium font_12 text-right" />
              </v-row>
            </v-col>
            <v-col
              v-if="validateList.length === 0 && !showValidateLoader"
              cols="12"
              xs="12"
              class="text-center font_12 pt-2 pb-2"
              :class="theme.dark ? 'grey darken-2' : 'grey lighten-2'"
            >
              No data available
            </v-col>
            <v-col v-if="validateList.length === 0 && showValidateLoader" class="text-center pt-2 pb-2">
              <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
            </v-col>
            <v-col>
              <v-col v-for="(item, index) in validateList" :key="`${item.ID}_${index}`" class="mb-2" cols="12" xs="12">
                <v-row v-if="!display.mdAndDown.value">
                  <v-col class="align-self font_12" :class="[theme.dark ? '' : 'text-accent', 'font_12']" cols=" 1" xs="1">
                    {{ item.ID }}
                  </v-col>
                  <v-col class="align-self font_12 ml-4" :class="[theme.dark ? '' : 'td_color']" cols="1" xs="1">
                    {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                  </v-col>
                  <v-col
                    class="align-self font_12 text-capitalize text-left pl-2"
                    :class="[theme.dark ? '' : 'td_color']"
                    cols="2"
                    xs="2"
                  >
                    {{ item.AccountName }}
                  </v-col>
                  <v-col
                    class="align-self font_12 text-capitalize text-left"
                    :class="theme.dark ? '' : 'td_color'"
                    cols="2"
                    xs="2"
                  >
                    {{ item.Email }}
                  </v-col>
                  <v-col class="align-self text-right font_12" :class="theme.dark ? '' : 'td_color'" cols="2" xs="2">
                    {{ item.Phone }}
                  </v-col>
                  <v-col class="align-self text-right font_12" :class="theme.dark ? '' : 'td_color'" cols="1" xs="1">
                    {{ item.Asset ? item.Asset : '-' }}
                  </v-col>
                </v-row>
                <v-row v-if="display.mdAndDown.value">
                  <v-col cols="12" xs="12" class="pr-2 pb-2 pl-1">
                    <v-row>
                      <v-col cols="12" xs="12" class="pa-0">
                        <v-row>
                          <v-col cols="8" xs="8" sm="6">
                            <h5 class="pt-1">
                              <span>ID</span>
                            </h5>
                            <h4>{{ item.ID }}</h4>
                          </v-col>
                          <v-col cols="12" xs="4" sm="3">
                            <h5 class="text-left pt-1">
                              <span>Activity Date</span>
                            </h5>
                            <h4 class="text-left">
                              {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                            </h4>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" xs="12" class="pa-0">
                        <v-row>
                          <v-col cols="8" xs="8" sm="6">
                            <h5 class="pt-1">
                              <span>Account Name</span>
                            </h5>
                            <h4 class="text-capitalize">
                              {{ item.AccountName }}
                            </h4>
                          </v-col>
                          <v-col cols="12" xs="4" sm="6">
                            <h5 class="text-left pt-1">
                              <span>Phone</span>
                            </h5>
                            <h4 class="text-left white-space-textwrap">
                              {{ item.Phone }}
                            </h4>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" xs="12" class="pa-0">
                        <v-row>
                          <v-col cols="8" xs="8" sm="6">
                            <h5 class="pt-1">
                              <span>Email</span>
                            </h5>
                            <h4>{{ item.Email }}</h4>
                          </v-col>
                          <v-col cols="12" xs="4" sm="6">
                            <h5 class="pt-1">
                              <span>Assets</span>
                            </h5>
                            <h4>{{ item.Asset ? item.Asset : '-' }}</h4>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-divider v-if="display.mdAndDown.value && index !== validateList.length - 1" />
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-row>
    <v-col class="pb-2" />
    <v-divider class="divider" />
    <v-row>
      <v-col cols="12" xs="12" class="text-left text-uppercase font_14 mb-1 mt-3">
        <h4 :class="theme.dark ? '' : 'text-accent'">
          <span class="handcursor" @click="completedPanel = !completedPanel">
            <span data-html2canvas-ignore="true">
              <v-icon
                size="small"
                :color="theme.dark ? '' : 'black'"
                :class="completedPanel ? 'rotateactivityicon iconSize' : 'iconSize'"
                >fas fa-chevron-right</v-icon
              >
            </span>
          </span>
          <span class="font-weight-medium ml-4" :class="theme.dark ? '' : 'text-accent'"
            >Completed ({{ completedList.length }})
          </span>
        </h4>
      </v-col>
      <v-col v-if="completedPanel" cols="12" xs="12" :class="display.xs.value ? 'pr-2' : 'ml-4 pr-4'">
        <v-col cols="12" xs="12" :class="!display.xs.value ? 'pl-2' : ''">
          <v-row class="margin_left_1">
            <v-col v-if="!display.mdAndDown.value" cols="12" xs="12" class="mt-1">
              <v-row>
                <v-col cols="1" xs="1" class="font-weight-medium font_12"> ID </v-col>
                <v-col cols="1" xs="1" class="ml-4 font-weight-medium font_12"> Activity Date </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left pl-2"> Account Name </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 text-left"> Email </v-col>
                <v-col cols="2" xs="2" class="font-weight-medium font_12 text-right"> Phone </v-col>
                <v-col cols="1" xs="1" class="font-weight-medium font_12 text-right"> Asset </v-col>
                <v-col cols="3" xs="3" class="font-weight-medium font_12 text-right" />
              </v-row>
            </v-col>
            <v-col
              v-if="completedList.length === 0 && !showCompleteLoader"
              cols="12"
              xs="12"
              class="text-center font_12 pt-2 pb-2"
              :class="theme.dark ? 'grey darken-2' : 'grey lighten-2'"
            >
              No data available
            </v-col>
            <v-col v-if="completedList.length === 0 && showCompleteLoader" class="text-center pt-2 pb-2">
              <v-progress-circular indeterminate :size="40" :width="5" color="accent" />
            </v-col>
            <v-col>
              <v-col v-for="(item, index) in completedList" :key="`${item.ID}_${index}`" class="mb-2" cols="12" xs="12">
                <v-row v-if="!display.mdAndDown.value">
                  <v-col class="align-self font_12" :class="[theme.dark ? '' : 'text-accent', 'font_12']" cols=" 1" xs="1">
                    {{ item.ID }}
                  </v-col>
                  <v-col class="align-self font_12 ml-4" :class="[theme.dark ? '' : 'td_color']" cols="1" xs="1">
                    {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                  </v-col>
                  <v-col
                    class="align-self font_12 text-capitalize text-left pl-2"
                    :class="[theme.dark ? '' : 'td_color']"
                    cols="2"
                    xs="2"
                  >
                    {{ item.AccountName }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="align-self font_12 text-capitalize text-left" :class="theme.dark ? '' : 'td_color'" cols="2" xs="2">
                {{ item.Email }}
              </v-col>
              <v-col class="align-self text-right font_12" :class="theme.dark ? '' : 'td_color'" cols="2" xs="2">
                {{ item.Phone }}
              </v-col>
              <v-col class="align-self text-right font_12" :class="theme.dark ? '' : 'td_color'" cols="1" xs="1">
                {{ item.Asset ? item.Asset : '-' }}
              </v-col>
            </v-col>
          </v-row>
          <v-row v-if="display.mdAndDown.value">
            <v-col cols="12" xs="12" class="pr-2 pb-2 pl-1">
              <v-row>
                <v-col cols="12" xs="12" class="pa-0">
                  <v-row>
                    <v-col cols="8" xs="8" sm="6">
                      <h5 class="pt-1">
                        <span>ID</span>
                      </h5>
                      <h4>{{ item.ID }}</h4>
                    </v-col>
                    <v-col cols="12" xs="4" sm="3">
                      <h5 class="text-left pt-1">
                        <span>Activity Date</span>
                      </h5>
                      <h4 class="text-left">
                        {{ item.ActivityDate ? new Date(item.ActivityDate).toLocaleDateString() : '' }}
                      </h4>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" xs="12" class="pa-0">
                  <v-row>
                    <v-col cols="8" xs="8" sm="6">
                      <h5 class="pt-1">
                        <span>Account Name</span>
                      </h5>
                      <h4 class="text-capitalize">
                        {{ item.AccountName }}
                      </h4>
                    </v-col>
                    <v-col cols="12" xs="4" sm="6">
                      <h5 class="text-left pt-1">
                        <span>Phone</span>
                      </h5>
                      <h4 class="text-left white-space-textwrap">
                        {{ item.Phone }}
                      </h4>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" xs="12" class="pa-0">
                  <v-row>
                    <v-col cols="8" xs="8" sm="6">
                      <h5 class="pt-1">
                        <span>Email</span>
                      </h5>
                      <h4>{{ item.Email }}</h4>
                    </v-col>
                    <v-col cols="12" xs="4" sm="6">
                      <h5 class="pt-1">
                        <span>Assets</span>
                      </h5>
                      <h4>{{ item.Asset ? item.Asset : '-' }}</h4>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider v-if="display.mdAndDown.value && index !== completedList.length - 1" />
        </v-col>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
//import CustomIcon from '@/components/CustomIcon'
//import IndividualChangeStatus from '@/components/TAL/Finder/IndividualChangeStatus'
export default {
  components: {
    // CustomIcon,
    // IndividualChangeStatus
  },
  setup() {
    const $route = useRoute()
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const $store = instance.appContext.config.globalProperties.$store
    const initiatePanel = ref(false)
    const discoverPanel = ref(false)
    const validatePanel = ref(false)
    const completedPanel = ref(false)
    const initiateList = ref([])
    const discoverList = ref([])
    const validateList = ref([])
    const completedList = ref([])
    const deleteProposal = ref({})
    const deleteComparision = ref({})
    const deleteDiagnostic = ref({})
    const changeStatusPopup = ref({})
    const selectedSchoolActivity = ref([])
    const showInitiateLoader = ref(true)
    const showDiscoverLoader = ref(true)
    const showValidateLoader = ref(true)
    const showCompleteLoader = ref(true)
    const currentStatus = ref('')
    const schoolActivity = ref([])
    function openFilterDialog(status, Id) {
      if (Id) {
        changeStatusPopup.value[Id] = true
      }
    }
    function closeChangeStatus(Id) {
      if (Id) {
        changeStatusPopup.value[Id] = false
      }
    }
    function getSchoolActivityDetail() {
      var schooldistrictId = $route.query.schoolDistId
      var activityName = 'individual'
      if (schooldistrictId !== null) {
        $axios
          .get(`/api/v1/tal/plan/${schooldistrictId}/${activityName}`)
          .then((success) => {
            if (success.data.d !== null && success.data.d.length > 0) {
              schoolActivity.value = success.data.d
              var initiateActivityList = schoolActivity.value.filter((a) => a.StageName === 'Prospecting')
              if (initiateActivityList) {
                initiateActivityList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                initiateList.value = initiateActivityList
              }

              var discoverActivityList = schoolActivity.value.filter((a) => a.StageName === 'Proposing')
              if (discoverActivityList) {
                discoverActivityList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                discoverList.value = discoverActivityList
              }

              var validateActivityList = schoolActivity.value.filter((a) => a.StageName === 'Finalizing')
              if (validateActivityList) {
                validateActivityList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                validateList.value = validateActivityList
              }

              var completedActivityList = schoolActivity.value.filter((a) => a.StageName === 'Completed')
              if (completedActivityList) {
                completedActivityList.sort(function (a, b) {
                  return b.ID - a.ID
                })
                completedList.value = completedActivityList
              }

              initiatePanel.value = initiateList.value.length > 0 ? true : false
              discoverPanel.value = discoverList.value.length > 0 ? true : false
              validatePanel.value = validateList.value.length > 0 ? true : false
              completedPanel.value = completedList.value.length > 0 ? true : false
            }
            showInitiateLoader.value = false
            showDiscoverLoader.value = false
            showValidateLoader.value = false
            showCompleteLoader.value = false
          })
          .catch(() => {
            showInitiateLoader.value = false
            showDiscoverLoader.value = false
            showValidateLoader.value = false
            showCompleteLoader.value = false
          })
      }
    }
    function getSchoolDataProgress(planObject) {
      var schoolProgressList = schoolActivity.value.length > 0 ? schoolActivity.value : []
      if (schoolProgressList.length > 0) {
        var schoolStage = []
        var index
        if (planObject.schoolDistrictId > 0) {
          schoolStage = schoolProgressList.filter((a) => a.ID === planObject.schoolDistrictId)
        }
        if ($store.state.planStatus.length > 0) {
          var selectedSchoolStatus
          if (planObject.schoolDistrictId > 0) {
            selectedSchoolStatus = $store.state.planStatus.find((a) => a.schoolDistrictId === planObject.schoolDistrictId)
          }

          if (selectedSchoolStatus) {
            if (schoolStage[0].Status === selectedSchoolStatus.status) {
              $store.state.planStatus.splice($store.state.planStatus.indexOf(selectedSchoolStatus), 1)
            } else {
              var timeDifference = (new Date().getTime() - new Date(selectedSchoolStatus.time).getTime()) / 1000
              timeDifference /= 60
              var timeDiff = Math.abs(Math.round(timeDifference))
              if (timeDiff > 3) {
                $store.state.planStatus.splice($store.state.planStatus.indexOf(selectedSchoolStatus), 1)
              } else {
                schoolStage[0].Status = selectedSchoolStatus.status
              }
            }
          }
        }
        if (planObject.schoolDistrictId > 0) {
          index = schoolActivity.value.findIndex((item) => item.ID === planObject.schoolDistrictId)
        }
        if (index > -1) {
          schoolActivity.value[index].Status = schoolStage[0].Status
        }
      }
    }
    function formatStatus(value) {
      if (value === null) return
      if (value === 'Agreement Created') return 'Agreement Created'
      else if (value === 'Agreement Sent') return 'Agreement Sent'
      else if (value === 'Account Setup Started') return 'Account Setup'
      else if (value === 'Agreement Received') return 'Agreement Received'
      return value
    }
    onMounted(() => {
      getSchoolActivityDetail()
    })
    return {
      theme,
      display,
      initiatePanel,
      initiateList,
      showInitiateLoader,
      discoverPanel,
      discoverList,
      showDiscoverLoader,
      validatePanel,
      validateList,
      showValidateLoader,
      completedPanel,
      completedList,
      showCompleteLoader,
      deleteProposal,
      deleteDiagnostic,
      selectedSchoolActivity,
      currentStatus,
      deleteComparision,
      openFilterDialog,
      closeChangeStatus,
      getSchoolDataProgress,
      formatStatus
    }
  }
}
</script>
<style scoped>
.rotateactivityicon {
  transform: rotate(90deg);
}
.iconSize {
  font-size: 1em !important;
}

.td_color {
  color: #000000 !important;
}
.presentedStatus {
  padding: 4px 14px !important;
}
.negotiateStatus {
  padding: 4px 9px !important;
}
.v-divider {
  max-width: 96% !important;
}
</style>
