<template>
  <v-card>
    <v-card-title class="text-secondary pa-3 bg-accent" fixed>
      <v-row>
        <v-col xl="1" lg="1" sm="1" md="1" cols="1" class="text-left align-self pa-0">
          <v-btn
            v-if="selectedCarosal === 1 || selectedCarosal === 2"
            variant="text"
            size="small"
            class="ma-0"
            @click="prevSlide()"
          >
            <v-icon color="secondary" class="icon-arrow-thin-left"></v-icon>
          </v-btn>
        </v-col>
        <v-col xl="10" lg="10" sm="10" md="10" cols="10" class="text-center align-self pa-0">
          <h4 v-if="!isXsOnly" class="text-secondary font_18 text-uppercase">Add a new Advisor (Pcs Only)</h4>
          <h5 v-if="isXsOnly" class="text-secondary text-uppercase">Add a new Advisor (Pcs Only)</h5>
        </v-col>
        <v-col xl="1" lg="1" sm="1" md="1" cols="1" class="text-right align-self pb-0 pt-0">
          <v-btn variant="text" v-if="selectedCarosal < 3" size="small" class="ma-0" @click="close()">
            <v-icon color="secondary" icon="mdi:mdi-window-close"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-col cols="12" class="pa-2">
        <v-row v-if="selectedCarosal < 3" class="justify-center customButton">
          <v-btn
            size="12"
            :disabled="true"
            class="ma-0 cursor-default"
            variant="text"
            :class="selectedCarosal === 0 ? 'highlightDot' : ''"
          >
            <v-icon size="12" icon="mdi:mdi-circle"></v-icon>
          </v-btn>
          <v-btn
            size="12"
            :disabled="true"
            variant="text"
            class="ma-0 cursor-default"
            :class="selectedCarosal === 1 ? 'highlightDot' : ''"
          >
            <v-icon size="12" icon="mdi:mdi-circle"></v-icon>
          </v-btn>
          <v-btn
            size="12"
            :disabled="true"
            class="ma-0 cursor-default"
            variant="text"
            :class="selectedCarosal === 2 ? 'highlightDot' : ''"
          >
            <v-icon size="12" icon="mdi:mdi-circle"></v-icon>
          </v-btn>
        </v-row>
        <v-col v-if="selectedCarosal === 0" cols="12" class="text-center pa-0">
          <h1 class="font_28 pa-5">
            Search for an advisor with an <br />
            existing PCS business relationship
          </h1>
          <v-col cols="12" class="text-center pb-6 pt-2 pl-0 pr-0">
            <v-row justify="center">
              <v-col sm="6" class="pb-5 pt-0 pl-0 pr-0">
                <v-autocomplete
                  v-model="advisor"
                  :items="advisorList"
                  placeholder="Begin typing the advisor's name to search"
                  :return-object="true"
                  :hide-no-data="!showNoUser"
                  no-data-text="User not found"
                  clearable
                  item-title="ContactName"
                  item-value="ContactId"
                  class="planName"
                  @update:search="getAdvisorList()"
                  @click:clear="clearAdvisor()"
                  @blur="showNoUser = false"
                  :menu-icon="showLoader ? '' : 'fa:icon-chevron-down'"
                >
                  <template v-slot:append-inner>
                    <v-icon color="accent" v-if="showLoader" :size="21" icon="fa:fas fa-circle-notch fa-spin"></v-icon>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :title="`${item.raw.ContactName} (${item.raw.Email})`"
                      @click="showFirm(item)"
                    ></v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="pa-5" cols="12">
            <h2 class="pb-3 font_17">
              <b>Can’t find the advisor?</b>
            </h2>
            <h2 class="font_17">Make sure the advisor is set up in Salesforce.</h2>
            <h2 class="font_17">Once they’re setup they’ll appear in this list.</h2>
          </v-col>
        </v-col>
        <v-col v-if="selectedCarosal === 1" cols="12" class="text-center pa-0">
          <h1 v-if="firmList.length < 2" class="font_28 pa-5">
            Confirm the firm {{ advisorName }} is <br />
            associated with
          </h1>
          <h1 v-else class="font_28 pa-5">
            Select the firm {{ advisorName }} is <br />
            associated with
          </h1>
          <v-col cols="12" class="text-center pb-6 pt-2 pl-0 pr-0">
            <v-row justify="center">
              <v-col v-if="firmList.length < 2" sm="6" class="pb-4 pt-0 pl-0 pr-0">
                <h2 :class="firm ? '' : 'pb-3 pt-1'">
                  {{ firm ? firm.FirmName : '' }}
                </h2>
                <br />
                <v-btn
                  :disabled="disableFirm"
                  color="accent"
                  size="x-large"
                  elevation="0"
                  class="pl-15 pr-15 text-none"
                  @click="showCustodian(firm)"
                >
                  Continue
                </v-btn>
              </v-col>
              <v-col v-else sm="6" class="pb-9 pl-0 pr-0 pt-0">
                <v-select
                  v-model="firm"
                  :items="firmList"
                  :label="firm ? '' : `Select firm ${advisorName} is associated with`"
                  :return-object="true"
                  class="planName"
                  item-title="FirmName"
                  item-value="FirmId"
                  @update:model-value="showCustodian(firm)"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col class="pa-5" cols="12">
            <h2 class="pb-3 font_17">
              <b>Can’t find the firm?</b>
            </h2>
            <h2 class="pb-1 font_17">Make sure the advisor is set up correctly in Salesforce.</h2>
          </v-col>
        </v-col>
        <v-col v-if="selectedCarosal === 2" cols="12" class="text-center pa-0">
          <h1 class="font_28 pa-5">
            Select a custodian for <br />
            {{ advisorName }}
          </h1>
          <v-col cols="12" class="text-center pt-2 pl-0 pr-0" :class="custodianError ? 'pb-0' : 'pb-6'">
            <v-row justify="center">
              <v-col sm="7">
                <v-select
                  v-model="custodian"
                  :items="custodianList"
                  :label="custodian ? '' : 'Select a custodian'"
                  :error="custodianError"
                  :error-messages="custodianErrorMsg"
                  class="planName"
                  item-title="AvailableCustodians"
                  item-value="AvailableCustodians"
                  :hide-details="!custodianError"
                  multiple
                />
              </v-col>
              <v-col sm="7">
                <v-select
                  v-model="subCustodian"
                  v-if="showSubCustodian"
                  :items="subCustodianList"
                  :label="subCustodian ? '' : 'Select a sub custodian (optional)'"
                  clearable
                  class="planName"
                  item-title="AvailableSubCustodians"
                  item-value="AvailableSubCustodians"
                  hide-details
                  multiple
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col :class="showSubCustodian ? 'pl-5 pr-5 pt-0 pb-10' : 'pl-5 pr-5 pt-3 pb-10'">
            <v-btn color="accent" size="x-large" elevation="0" class="pl-15 pr-15 text-none" @click="saveAdvisorDetail()">
              Finish
            </v-btn>
          </v-col>
        </v-col>
        <v-col v-show="selectedCarosal === 3" cols="12" class="text-center pa-0">
          <v-carousel
            :cycle="true"
            :show-arrows="false"
            hide-delimiters
            hide-delimiter-background
            :continuous="false"
            height="380"
            :interval="slideTime"
          >
            <v-carousel-item v-for="(slide, i) in slides" :key="i" transition="fade-transition">
              <v-sheet height="100%">
                <v-row class="fill-height" align="center" justify="center">
                  <v-col class="shortcutflex pa-0" cols="12">
                    <v-col class="loaderflex pa-0">
                      <v-img :src="loader" :eager="true" />
                    </v-col>
                    <v-col cols="9" class="pt-0 pb-0 text-center mt-3 pl-6 pr-6">
                      <h1 class="font_28 text-accent">
                        {{ slide.title }}
                      </h1>
                    </v-col>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col v-if="selectedCarosal === 4" cols="12" class="text-center pa-0">
          <h1 class="font_28 pt-5 pb-1 mt-4">You’re all set</h1>
          <h2 class="pb-1 font_17">{{ advisorName }} has been added to the portal and you can</h2>
          <h2 class="pb-1 font_17">now impersonate to create a comparison or proposal.</h2>
          <h2 class="mt-8 mb-3 font_17">
            <b>Impersonate {{ advisorName }} and:</b>
          </h2>
          <v-col cols="12">
            <v-btn color="accent" size="x-large" elevation="0" class="pl-15 pr-15 text-none" @click="redirect('advisorsetup')">
              Go to advisor setup
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              variant="outlined"
              color="accent"
              size="x-large"
              elevation="0"
              class="pl-15 pr-15 text-none"
              @click="redirect('startup')"
            >
              Create a proposal
            </v-btn>
          </v-col>
          <v-col class="pb-5 pt-0 pl-0 pr-0">
            <v-btn variant="text" color="accent" class="text-none" @click="redirect('acquisition')">
              Skip, impersonate later
            </v-btn>
          </v-col>
        </v-col>
      </v-col>
    </v-card-text>
  </v-card>
</template>
<script>
import { ref, onMounted, watch, getCurrentInstance, inject, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const selectedCarosal = ref(0)
    const showLoader = ref(false)
    const advisor = ref(null)
    const advisorList = ref([])
    const advisorName = ref(null)
    const firmList = ref([])
    const firm = ref(null)
    const cancelToken = ref(null)
    const custodian = ref([])
    const custodianList = ref([])
    const custodianError = ref(false)
    const custodianErrorMsg = ref('')
    const subCustodian = ref([])
    const subCustodianList = ref([])
    const slides = ref([])
    const showSubCustodian = ref(true)
    const loader = ref(require('@/assets/images/loader.svg'))
    const slideTime = ref(2000)
    const timer = ref(null)
    const showNoUser = ref(false)
    const eventBus = inject('eventBus')
    const toast = inject('toast')
    const isXsOnly = ref(false)
    const disableFirm = ref(false)
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
    })
    watch(custodian, (val) => {
      if (val && val.length > 0) {
        custodianError.value = false
        custodianErrorMsg.value = ''
        var index = custodian.value.findIndex((x) => x === 'AdvisorTrust')
        if (index > -1) {
          showSubCustodian.value = true
        } else {
          showSubCustodian.value = false
          subCustodian.value = []
        }
      } else showSubCustodian.value = true
    })
    watch(selectedCarosal, (val) => {
      if (val) {
        if (val === 4) {
          clearInterval(timer)
        }
      }
    })
    //mounted
    onMounted(() => {
      eventBus.on('clearAddUser', () => {
        advisor.value = null
        firm.value = null
        custodian.value = []
        subCustodian.value = []
        advisorList.value = []
        firmList.value = []
        custodianError.value = false
        custodianErrorMsg.value = ''
        selectedCarosal.value = 0
        disableFirm.value = false
      })
      eventBus.on('closePopUp', () => {
        emit('closeAdvisorWidget', false)
        eventBus.emit('getImpersonationList')
      })
    })
    //methods
    function close() {
      advisor.value = null
      firm.value = null
      custodian.value = []
      subCustodian.value = []
      advisorList.value = []
      firmList.value = []
      custodianError.value = false
      custodianErrorMsg.value = ''
      selectedCarosal.value = 0
      disableFirm.value = false
      emit('closeAdvisorWidget', false)
    }
    function showFirm(val) {
      if (val) {
        getFirmList(val)
        if (custodianList.value.length === 0) getCustodian()
        advisor.value = val
        advisorName.value = val.title
        selectedCarosal.value = 1
      }
    }
    function showCustodian(val) {
      if (val) {
        firm.value = val
        if (custodian.value && custodian.value.length === 0) {
          if (custodianList.value && custodianList.value.length > 0) {
            custodian.value.push(custodianList.value[0].AvailableCustodians)
            custodianError.value = false
            custodianErrorMsg.value = ''
          } else custodian.value = []
        }
        subCustodian.value = []
        selectedCarosal.value = 2
      }
    }
    function getAdvisorList() {
      if (event.target.value) {
        if (cancelToken.value) cancelToken.value.cancel()
        cancelToken.value = $axios.CancelToken.source()
        showLoader.value = true
        $axios
          .get(`/api/v1/sfdc/advisor/search?criteria=${event.target.value}`, {
            cancelToken: cancelToken.value.token
          })
          .then((success) => {
            showLoader.value = false
            advisorList.value = success.data.d && success.data.d.length > 0 ? success.data.d : []
            showNoUser.value = success.data.d && success.data.d.length === 0 ? true : false
          })
          .catch(function (thrown) {
            if (!$axios.isCancel(thrown)) {
              showLoader.value = false
              advisorList.value = []
              showNoUser.value = false
            }
          })
      } else {
        showLoader.value = false
        advisorList.value = []
        showNoUser.value = false
      }
    }
    function getFirmList(advisor) {
      disableFirm.value = true
      firm.value = null
      firmList.value = []
      var contactId = advisor ? advisor.value : ''
      if (contactId) {
        $axios.get(`/api/v1/sfdc/${contactId}/firms`).then((success) => {
          firmList.value = success.data.d ? success.data.d : []
          if (firmList.value && firmList.value.length === 1) {
            firm.value = firmList.value[0]
            disableFirm.value = false
          }
        })
      }
    }
    function getCustodian() {
      $axios.get(`/api/v1/sfdc/advisor/availablecustodians`).then((success) => {
        if (success.data.d) {
          custodianList.value = success.data.d.custodians && success.data.d.custodians.length > 0 ? success.data.d.custodians : []
          subCustodianList.value =
            success.data.d.subCustodians && success.data.d.subCustodians.length > 0 ? success.data.d.subCustodians : []
        }
      })
    }
    function prevSlide() {
      var val = Number(selectedCarosal.value)
      selectedCarosal.value = Number(val - 1)
    }
    function saveAdvisorDetail() {
      if (custodian.value && custodian.value.length === 0) {
        custodianError.value = true
        custodianErrorMsg.value = 'Custodian is required'
        return
      }
      var contactId = advisor.value ? advisor.value.value : ''
      var firmId = firm.value ? firm.value.FirmId : ''
      var availableCustodians = ''
      var custodianValue = ''
      if (custodian.value && custodian.value.length > 0) {
        availableCustodians = custodian.value.length > 1 ? custodian.value.join(';') : custodian.value[0]
        custodianValue = custodian.value.length > 1 ? custodian.value.join(', ') : custodian.value[0]
      }
      var subCustodianValue = ''
      if (subCustodian.value && subCustodian.value.length > 0) {
        subCustodianValue = subCustodian.value.length > 1 ? subCustodian.value.join(';') : subCustodian.value[0]
      }

      if (contactId && firmId && availableCustodians) {
        slides.value = [
          {
            title: `One minute, we’re adding ${advisorName.value} to the portal, do not close this window.`
          },
          {
            title: `Setting up ${advisorName.value} portal credentials…`
          },
          {
            title: `Creating relationship with ${firm.value.FirmName}…`
          },
          {
            title: `Associating ${custodianValue} as ${advisorName.value}’s custodian…`
          },
          {
            title: `Saving role and permissions for ${advisorName.value}…`
          }
        ]
        slideTime.value = 2000
        selectedCarosal.value = 3
        $axios
          .put(
            `/api/v1/sfdc/advisor/setup?contactId=${contactId}&firmId=${firmId}&availableCustodians=${availableCustodians}&subCustodians=${subCustodianValue}`
          )
          .then(() => {
            timer.value = setInterval(function () {
              selectedCarosal.value = 4
            }, 10000)
          })
      }
    }
    async function redirect(page) {
      if (page) {
        if (page === 'acquisition') {
          eventBus.emit('getImpersonationList')
          emit('closeAdvisorWidget', false)
        } else {
          var contactSuccess = await $axios.get(`/api/v1/${advisor.value.value}/membership`)
          if (contactSuccess.data.d && contactSuccess.data.d.length > 0) {
            var advisorProgram = contactSuccess.data.d[0]
            slides.value = []
            slides.value = [
              {
                title: `Logging in as ${advisorName.value}…`
              },
              {
                title: `Redirecting to ${page === 'startup' ? 'Create Startup Plan' : 'Advisor Setup'}…`
              }
            ]
            slideTime.value = 1000
            selectedCarosal.value = 3
            var route = page === 'startup' ? '/TAL/StartupPlan' : '/Home/AdvisorSetup'

            $axios
              .post(`/api/v1/user/impersonation/start`, advisorProgram)
              .then(() => {
                window.location.assign(route)
              })
              .catch((error) => {
                if (route !== '/') eventBus.emit('closePopUp')
                if (error.response.status !== 403) {
                  toast.error('Impersonation failed. Please try again later', { autoClose: false })
                }
              })
          }
        }
      }
    }
    function clearAdvisor() {
      showNoUser.value = false
      advisorList.value = []
      showLoader.value = false
      advisor.value = null
    }

    return {
      selectedCarosal,
      showLoader,
      advisor,
      advisorList,
      advisorName,
      firmList,
      firm,
      cancelToken,
      custodian,
      custodianList,
      custodianError,
      custodianErrorMsg,
      subCustodian,
      subCustodianList,
      slides,
      showSubCustodian,
      loader,
      slideTime,
      timer,
      showNoUser,
      display,
      isXsOnly,
      disableFirm,
      close,
      showFirm,
      showCustodian,
      getAdvisorList,
      getFirmList,
      getCustodian,
      prevSlide,
      saveAdvisorDetail,
      redirect,
      clearAdvisor
    }
  }
}
</script>
<style scoped>
.font_28 {
  font-size: 2.154rem;
  line-height: normal;
}
.shortcutflex .loaderflex {
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
}
</style>
