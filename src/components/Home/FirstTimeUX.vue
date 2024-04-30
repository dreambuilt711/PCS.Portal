<template>
  <v-dialog
    v-model="showHomePopup"
    :content-class="isMdOnly ? 'firstTimeDialog' : ''"
    persistent
    :scrollable="false"
    :max-width="dialogWidth"
    :eager="true"
  >
    <v-card v-if="!isXsOnly" class="pa-5 elevation-3">
      <v-col class="text-left mb-3 pa-0" cols="12">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row class="align-center height_28">
              <v-btn v-if="selectedCarosal !== 0" size="small" variant="text" class="ma-0" @click="prevSlide()">
                <v-icon color="accent" class="icon-arrow-thin-left"></v-icon>
              </v-btn>
              <v-row class="justify-center customButton" :class="selectedCarosal !== 0 ? 'pr-7' : ''">
                <v-btn
                  size="small"
                  icon
                  class="ma-0"
                  variant="flat"
                  :class="selectedCarosal === 0 ? 'highlightDot' : ''"
                  @click="showSlide(0)"
                >
                  <v-icon size="12"> mdi mdi-circle </v-icon>
                </v-btn>
                <v-btn
                  size="small"
                  icon
                  class="ma-0"
                  variant="flat"
                  :class="selectedCarosal === 1 ? 'highlightDot' : ''"
                  @click="showSlide(1)"
                >
                  <v-icon size="12"> mdi mdi-circle </v-icon>
                </v-btn>
                <v-btn
                  size="small"
                  icon
                  class="ma-0"
                  variant="flat"
                  :class="selectedCarosal === 2 ? 'highlightDot' : ''"
                  @click="showSlide(2)"
                >
                  <v-icon size="12"> mdi mdi-circle </v-icon>
                </v-btn>
                <v-btn
                  size="small"
                  icon
                  class="ma-0"
                  :variant="true && 'flat'"
                  :class="selectedCarosal === 3 ? 'highlightDot' : ''"
                  @click="showSlide(3)"
                >
                  <v-icon size="12"> mdi mdi-circle </v-icon>
                </v-btn>
              </v-row>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="mt-2 pa-0">
        <v-carousel
          v-model="selectedCarosal"
          :cycle="false"
          :show-arrows="false"
          hide-delimiters
          class="customcarousel"
          :height="modelHeight"
          :continuous="false"
        >
          <v-carousel-item v-for="(item, index) in slides" :key="index" :eager="true">
            <v-sheet height="100%">
              <v-row class="mt-2">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" class="text-center mb-1" :class="isXsOnly ? 'pl-4 pr-4 pt-0 pb-0' : 'pa-0'">
                      <h2 class="text-h4">{{ item.title }}<sup v-if="index === 0" class="registredFont">&reg;</sup></h2>
                    </v-col>
                    <v-col cols="12" class="text-center mb-1" :class="isXsOnly ? 'pl-4 pr-4 pt-0 pb-0' : 'pa-0'">
                      <h3>{{ item.subtitle }}</h3>
                    </v-col>
                    <v-col cols="12" class="pl-5 pr-5 pb-3" :class="isLgOnly ? 'pt-1' : 'pt-3'">
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="6"
                          class="pt-1 pb-0 pl-0 pr-0"
                          :class="!isXsOnly ? (isLgOnly ? 'mt-1' : 'mt-6') : 'mt-2'"
                        >
                          <v-row v-for="(subitem, i) in item.description" :key="i" class="mb-3" no-gutters>
                            <v-col cols="1" class="pt-1 pb-0 pl-0 pr-0">
                              <div :class="subitem.class">
                                {{ index === 0 ? '' : i + 1 }}
                              </div>
                            </v-col>
                            <v-col cols="11" class="pa-0">
                              <h3>
                                <b>{{ subitem.title }}</b>
                              </h3>
                              <h3 v-if="index === 0 && i === 3">
                                {{ subitem.subtitle }}
                                <a class="text-accent cursor-auto">
                                  <v-icon size="18" color="accent" class="mr-1" icon="fa:icon-new-window" /><span
                                    >Sponsor Portal</span
                                  >
                                </a>
                                link.
                              </h3>
                              <h3 v-else>
                                {{ subitem.subtitle }}
                              </h3>
                              <h3 v-if="subitem.subtitle1" class="mt-2">
                                {{ subitem.subtitle1 }}
                              </h3>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col v-if="!isXsOnly" cols="12" sm="6" :class="isLgOnly ? 'mt-1 pa-0' : 'mt-6 pa-0'">
                          <v-row>
                            <v-img :src="item.img" width="100%" :cover="true" height="100%" :eager="true"></v-img>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col
        v-if="selectedCarosal !== 3"
        cols="12"
        class="text-center height_100 mt-3 mb-2 pa-0"
        :class="!isXsOnly ? '' : 'mt-5'"
      >
        <v-btn color="accent" size="large" @click="nextSlide()"> Next </v-btn>
      </v-col>
      <v-col
        v-if="selectedCarosal === 3"
        cols="12"
        class="text-center height_100 mt-3 mb-2 pa-0"
        :class="!isXsOnly ? '' : 'mt-5'"
      >
        <v-col cols="12" class="text-center pa-0">
          <v-btn color="accent" size="large" @click="closePopUp()"> Close </v-btn>
        </v-col>
        <v-col cols="12" class="text-center pa-0 mt-2">
          <v-btn variant="text" color="accent" size="large" @click="hideUX()"> Close, don't show again </v-btn>
        </v-col>
      </v-col>
    </v-card>
    <v-card v-if="isXsOnly" class="pt-0 pl-0 pr-0 pb-3 elevation-3">
      <v-col cols="12" class="pa-0">
        <v-carousel
          v-model="selectedCarosal"
          :cycle="false"
          :show-arrows="false"
          hide-delimiters
          class="customcarousel"
          :height="modelHeight"
          :continuous="false"
        >
          <v-carousel-item v-for="(item, index) in slides" :key="index" :eager="true">
            <v-sheet height="100%">
              <v-row>
                <v-col cols="12" class="pa-0">
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" class="pa-0">
                      <v-img :src="item.img" width="100%" height="180" :eager="true">
                        <v-row no-gutters style="height: 100%">
                          <v-col class="text-left pa-0" cols="12">
                            <v-row no-gutters>
                              <v-col cols="12" class="pa-0">
                                <v-row class="align-center height_28 mt-2">
                                  <v-btn
                                    v-if="selectedCarosal !== 0"
                                    size="small"
                                    variant="text"
                                    class="ma-0"
                                    @click="prevSlide()"
                                  >
                                    <v-icon color="white" class="icon-arrow-thin-left"></v-icon>
                                  </v-btn>
                                  <v-row
                                    class="justify-center customButton mobileView"
                                    :class="selectedCarosal !== 0 ? 'pr-11' : 'mt-2'"
                                  >
                                    <v-btn
                                      size="small"
                                      icon
                                      class="ma-0"
                                      variant="flat"
                                      :class="selectedCarosal === 0 ? 'highlightDot' : ''"
                                      @click="showSlide(0)"
                                    >
                                      <v-icon size="12"> mdi mdi-circle </v-icon>
                                    </v-btn>
                                    <v-btn
                                      size="small"
                                      icon
                                      class="ma-0"
                                      variant="flat"
                                      :class="selectedCarosal === 1 ? 'highlightDot' : ''"
                                      @click="showSlide(1)"
                                    >
                                      <v-icon size="12"> mdi mdi-circle </v-icon>
                                    </v-btn>
                                    <v-btn
                                      size="small"
                                      icon
                                      class="ma-0"
                                      variant="flat"
                                      :class="selectedCarosal === 2 ? 'highlightDot' : ''"
                                      @click="showSlide(2)"
                                    >
                                      <v-icon size="12"> mdi mdi-circle </v-icon>
                                    </v-btn>
                                    <v-btn
                                      size="small"
                                      icon
                                      class="ma-0"
                                      variant="flat"
                                      :class="selectedCarosal === 3 ? 'highlightDot' : ''"
                                      @click="showSlide(3)"
                                    >
                                      <v-icon size="12"> mdi mdi-circle </v-icon>
                                    </v-btn>
                                  </v-row>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col class="ma-2 align-self-flexend pa-0">
                            <v-col
                              cols="12"
                              class="text-center mb-1 text-white"
                              :class="isXsOnly ? 'pl-4 pr-4 pt-0 pb-0' : 'pa-0'"
                            >
                              <h4 class="font_18 text-h4">
                                {{ item.title }}<sup v-if="index === 0" class="registredFont">&reg;</sup>
                              </h4>
                            </v-col>
                            <v-col
                              cols="12"
                              class="text-center mb-1 text-white"
                              :class="isXsOnly ? 'pl-4 pr-4 pt-0 pb-0' : 'pa-0'"
                            >
                              <h4>{{ item.subtitle }}</h4>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-img>
                    </v-col>
                    <v-col cols="12" class="pl-5 pr-5 pb-3 pt-3">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6" class="pt-1 pl-0 pr-0 pb-0" :class="!isXsOnly ? 'mt-6' : 'mt-2'">
                          <v-row v-for="(subitem, i) in item.description" :key="i" class="mb-3" no-gutters>
                            <v-col cols="1" class="pt-1 pl-0 pr-0 pb-0">
                              <div :class="subitem.class">
                                {{ index === 0 ? '' : i + 1 }}
                              </div>
                            </v-col>
                            <v-col cols="11" class="pa-0">
                              <h4>
                                <b>{{ subitem.title }}</b>
                              </h4>
                              <h4 v-if="index === 0 && i === 3">
                                {{ subitem.subtitle }}
                                <a class="text-accent cursor-auto">
                                  <v-icon size="21" color="accent" class="mr-1" icon="fa:icon-new-windows" /><span
                                    >Sponsor Portal</span
                                  >
                                </a>
                                link.
                              </h4>
                              <h4 v-else>
                                {{ subitem.subtitle }}
                              </h4>
                              <h4 v-if="subitem.subtitle1" class="mt-2">
                                {{ subitem.subtitle1 }}
                              </h4>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col
        v-if="selectedCarosal !== 3"
        cols="12"
        class="text-center mt-2 pa-0 mb-2"
        :class="fontSize >= 14 ? '' : 'height_100'"
      >
        <v-btn color="accent" @click="nextSlide()"> Next </v-btn>
      </v-col>
      <v-col
        v-if="selectedCarosal === 3"
        cols="12"
        class="text-center mt-2 pa-0 mb-2"
        :class="fontSize >= 14 ? '' : 'height_100'"
      >
        <v-col cols="12" class="text-center">
          <v-btn color="accent" @click="closePopUp()"> Close </v-btn>
        </v-col>
        <v-col cols="12" class="text-center pa-0 mt-2">
          <v-btn variant="text" color="accent" @click="hideUX()"> Close, don't show again </v-btn>
        </v-col>
      </v-col>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed, ref, onMounted, getCurrentInstance, inject, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const selectedCarosal = ref(0)
    const showHomePopup = ref(false)
    const employeeSponsoredSlides = ref([
      {
        title: 'Welcome to the Advisor Lab',
        subtitle: 'Your most powerful partner in retirement plan growth.',
        img: require('@/assets/images/Welcome.svg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Acquisition',
            subtitle: 'Find new leads, manage prospects, and create on-demand retirement plan proposals.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Clients',
            subtitle: 'Analyze and manage clients across your book of business.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Setup',
            subtitle: 'Manage investment options and your fees in one place.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Sponsor Portal',
            subtitle: 'Access all your plan details using the '
          }
        ],
        showSetup: false
      },
      {
        title: 'Acquisition',
        subtitle: 'Find leads, manage prospects, and create on-demand retirement plan proposals.',
        img: require('@/assets/images/Acquisition.svg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Find new leads',
            subtitle: 'Find new retirement plan prospects based on location and plan type with our advanced search engine.',
            subtitle1: 'Take a quick glance at plan summary data and flag ‘favorite’ leads that you want to track.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Prospect Pipeline',
            subtitle:
              'Manage prospect status within your sales pipeline. Easily toggle between plan sponsors or individuals and view estimated plan assets.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Clients',
        subtitle: 'Analyze and manage clients across your book of business.',
        img: require('@/assets/images/Clients.svg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Managed assets',
            subtitle:
              'View client contributions, distributions, and net cash flow. Access participation rates and investment holdings.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Company information',
            subtitle:
              'See a detailed breakdown of your clients, including assets under management, participant data, and plan types.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Participant information',
            subtitle: 'Analyze plan participation, auto-enrollment data, and individuals with a balance.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Setup',
        subtitle: 'Manage investment options and your fees in one place.',
        img: require('@/assets/images/Setup.svg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Models',
            subtitle: 'Review and modify your models across your plans and individual accounts.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Investments',
            subtitle: 'Review and modify your investment lineups across your plans and individual accounts.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Fee Schedules',
            subtitle: 'View, create, and edit your fee schedules.'
          }
        ],
        showSetup: true
      }
    ])
    const mobileEmployeeSponsoredSlides = ref([
      {
        title: 'Welcome to the Advisor Lab',
        subtitle: 'Your most powerful partner in retirement plan growth.',
        img: require('@/assets/images/Welcome_dark.png'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Acquisition',
            subtitle: 'Find new leads, manage prospects, and create on-demand retirement plan proposals.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Clients',
            subtitle: 'Analyze and manage clients across your book of business.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Setup',
            subtitle: 'Manage investment options and your fees in one place.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Sponsor Portal',
            subtitle: 'Access all your plan details using the '
          }
        ],
        showSetup: false
      },
      {
        title: 'Acquisition',
        subtitle: 'Find leads, manage prospects, and create on-demand retirement plan proposals.',
        img: require('@/assets/images/Acquisition_dark.png'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Find new leads',
            subtitle: 'Find new retirement plan prospects based on location and plan type with our advanced search engine.',
            subtitle1: 'Take a quick glance at plan summary data and flag ‘favorite’ leads that you want to track.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Prospect Pipeline',
            subtitle:
              'Manage prospect status within your sales pipeline. Easily toggle between plan sponsors or individuals and view estimated plan assets.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Clients',
        subtitle: 'Analyze and manage clients across your book of business.',
        img: require('@/assets/images/Clients_dark.png'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Managed assets',
            subtitle:
              'View client contributions, distributions, and net cash flow. Access participation rates and investment holdings.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Company information',
            subtitle:
              'See a detailed breakdown of your clients, including assets under management, participant data, and plan types.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Participant information',
            subtitle: 'Analyze plan participation, auto-enrollment data, and individuals with a balance.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Setup',
        subtitle: 'Manage investment options and your fees in one place.',
        img: require('@/assets/images/Setup_dark.png'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Models',
            subtitle: 'Review and modify your models across your plans and individual accounts.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Investments',
            subtitle: 'Review and modify your investment lineups across your plans and individual accounts.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Fee Schedules',
            subtitle: 'View, create, and edit your fee schedules.'
          }
        ],
        showSetup: true
      }
    ])
    const schoolHomeSlides = ref([
      {
        title: 'Welcome to the Advisor Lab',
        subtitle: 'Your most powerful partner in retirement plan growth.',
        img: require('@/assets/images/Welcome.svg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Acquisition',
            subtitle:
              'Find nearby tax-exempt organizations and easily initiate and track new enrollments or transfers using your available funds or fee structures.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Client management',
            subtitle: 'Effortlessly manage all participants with a single login, even if you have multiple rep codes.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Clients: (Coming Soon)',
            subtitle: 'Analyze and manage your clients, including identifying participants ready to retire.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Acquisition',
        subtitle: 'Find nearby tax-exempt organizations and easily initiate and track new enrollments or transfers.',
        img: require('@/assets/images/Acquisition.svg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Find new leads',
            subtitle:
              'Discover new prospects and plans near you with our advanced search engine, which lists all US school districts, municipalities, churches, and tax-exempt organizations registered with the IRS.',
            subtitle1:
              'Easily establish a new payroll slot or initiate an enrollment. You can even flag your favorite leads for easy tracking.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Prospect Pipeline',
            subtitle:
              'Track all prospects and accounts in transition with our pipeline status feature, keeping you informed of their progress through the sales process.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Client Management',
        subtitle: 'Effortlessly manage all participants with a single login, even if you have multiple rep codes.',
        img: require('@/assets/images/clientmanagement.jpg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Client information',
            subtitle:
              'View detailed client breakdowns by plan and sponsor (school district/employer or church/tax-exempt), including assets under management, participant data, and plan types.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Participant information',
            subtitle:
              'Effectively manage your entire portfolio of participants by identifying anomalies and opportunities, such as those solely invested in one fund or cash, and those nearing retirement.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Resources',
            subtitle: 'Access a variety of helpful resources to assist you in managing your clients.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Clients: (Coming Soon)',
        subtitle: 'Analyze and manage your clients, including identifying participants ready to retire.',
        img: require('@/assets/images/Clients.svg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Managed assets',
            subtitle:
              'View client contributions, distributions, and net cash flow. Access participation rates and investment holdings.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Company information',
            subtitle:
              'See a detailed breakdown of your clients, including assets under management, participant data, and plan types.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Participant information',
            subtitle: 'Analyze plan participation, auto-enrollment data, and individuals with a balance.'
          }
        ],
        showSetup: true
      }
    ])
    const mobileSchoolHomeSlides = ref([
      {
        title: 'Welcome to the Advisor Lab',
        subtitle: 'Your most powerful partner in retirement plan growth.',
        img: require('@/assets/images/Welcome_dark.png'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Acquisition',
            subtitle:
              'Find nearby tax-exempt organizations and easily initiate and track new enrollments or transfers using your available funds or fee structures.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Client management',
            subtitle: 'Effortlessly manage all participants with a single login, even if you have multiple rep codes.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Clients: (Coming Soon)',
            subtitle: 'Analyze and manage your clients, including identifying participants ready to retire.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Acquisition',
        subtitle: 'Find nearby tax-exempt organizations and easily initiate and track new enrollments or transfers.',
        img: require('@/assets/images/Acquisition_dark.png'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Find new leads',
            subtitle:
              'Discover new prospects and plans near you with our advanced search engine, which lists all US school districts, municipalities, churches, and tax-exempt organizations registered with the IRS.',
            subtitle1:
              'Easily establish a new payroll slot or initiate an enrollment. You can even flag your favorite leads for easy tracking.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Prospect Pipeline',
            subtitle:
              'Track all prospects and accounts in transition with our pipeline status feature, keeping you informed of their progress through the sales process.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Client Management',
        subtitle: 'Effortlessly manage all participants with a single login, even if you have multiple rep codes.',
        img: require('@/assets/images/clientmanagement-mobile.jpg'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Client information',
            subtitle:
              'View detailed client breakdowns by plan and sponsor (school district/employer or church/tax-exempt), including assets under management, participant data, and plan types.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Participant information',
            subtitle:
              'Effectively manage your entire portfolio of participants by identifying anomalies and opportunities, such as those solely invested in one fund or cash, and those nearing retirement.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Resources',
            subtitle: 'Access a variety of helpful resources to assist you in managing your clients.'
          }
        ],
        showSetup: false
      },
      {
        title: 'Clients: (Coming Soon)',
        subtitle: 'Analyze and manage your clients, including identifying participants ready to retire.',
        img: require('@/assets/images/Setup_dark.png'),
        description: [
          {
            class: 'contentlegend_circle',
            title: 'Managed assets',
            subtitle:
              'View client contributions, distributions, and net cash flow. Access participation rates and investment holdings.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Company information',
            subtitle:
              'See a detailed breakdown of your clients, including assets under management, participant data, and plan types.'
          },
          {
            class: 'contentlegend_circle',
            title: 'Participant information',
            subtitle: 'Analyze plan participation, auto-enrollment data, and individuals with a balance.'
          }
        ],

        showSetup: true
      }
    ])
    const isMdOnly = ref(false)
    const isLgOnly = ref(false)
    const isXlOnly = ref(false)
    const isSmOnly = ref(false)
    const isXsOnly = ref(false)
    const width = ref(0)
    //computed
    const showSchool = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)) {
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
    const showEmployerSponsored = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)) {
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
    const showIndividuals = computed(() => {
      if ($authz.hasRole($authz.roles.FirmAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)) {
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
    const dialogWidth = computed(() => {
      if (isXlOnly.value) return '60%'
      else if (isLgOnly.value) return '70%'
      else return '90%'
    })
    const modelHeight = computed(() => {
      var fontSize = 13 // $root.$children[0].fontsize
      if (!isXsOnly.value && Number(fontSize) >= 14) return 'auto'
      if (isXsOnly.value) {
        if (Number(fontSize) >= 14) return 'auto'
        else return '510px'
      } else if (isSmOnly.value) return '500px'
      else if (width.value === 1280) return '400px'
      else return '430px'
    })
    const fontSize = computed(() => {
      return '13'
    })
    const slides = computed(() => {
      if (showEmployerSponsored.value) {
        if (isXsOnly.value) return mobileEmployeeSponsoredSlides.value
        else return employeeSponsoredSlides.value
      } else if (showSchool.value || showIndividuals) {
        if (isXsOnly.value) return mobileSchoolHomeSlides.value
        else return schoolHomeSlides.value
      } else {
        if (isXsOnly.value) return mobileEmployeeSponsoredSlides.value
        else return employeeSponsoredSlides.value
      }
    })
    //watch
    watchEffect(() => {
      isMdOnly.value = display.md.value
      isLgOnly.value = display.lg.value
      isXlOnly.value = display.xl.value
      isSmOnly.value = display.sm.value
      isXsOnly.value = display.xs.value
      width.value = display.width.value
    })
    //methods
    function closePopUp() {
      if ($store.state.contactPreference) {
        $store.state.contactPreference.hideFirstTimeUX = true
      }
      showHomePopup.value = false
    }
    function nextSlide() {
      var val = Number(selectedCarosal.value)
      if (val < 4) selectedCarosal.value = Number(val + 1)
    }
    function prevSlide() {
      var val = Number(selectedCarosal.value)
      selectedCarosal.value = Number(val - 1)
    }
    function hideUX() {
      var contactPreferences = {
        contactId: $store.state.user.contactId,
        hideFirstTimeUX: true
      }
      if ($store.state.contactPreference) {
        $store.state.contactPreference.hideFirstTimeUX = true
      }
      showHomePopup.value = false
      $axios.post(`/api/v1/user/contact/preferences`, contactPreferences)
    }
    function showSlide(val) {
      selectedCarosal.value = val
    }
    //mounted
    onMounted(() => {
      eventBus.on('showFirstTimeUX', (data) => {
        showHomePopup.value = data
      })
    })

    return {
      selectedCarosal,
      showHomePopup,
      employeeSponsoredSlides,
      mobileEmployeeSponsoredSlides,
      schoolHomeSlides,
      mobileSchoolHomeSlides,
      display,
      slides,
      fontSize,
      modelHeight,
      dialogWidth,
      isMdOnly,
      isLgOnly,
      isXlOnly,
      isSmOnly,
      isXsOnly,
      width,
      closePopUp,
      showSlide,
      hideUX,
      prevSlide,
      nextSlide
    }
  }
}
</script>
<style scoped>
.contentlegend_circle {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: #e99200 !important;
  font-size: 0.75em;
  text-align: center;
  color: white;
}
</style>
