<template>
  <v-dialog v-model="showPopup" persistent class="elevation-3" content-class="elevation-3" scrollable max-width="850px">
    <v-col class="pa-0" cols="12">
      <v-card>
        <v-card-title class="text-secondary pa-3 bg-accent">
          <v-col cols="12" class="text-left pa-0">
            <v-row class="align-self-center">
              <v-col cols="11" class="text-left text-body-1 align-self-center pa-0">
                <h3 class="align-self-center">Pending Notices for Review</h3>
              </v-col>
              <v-col class="text-right pa-0" cols="1">
                <v-icon class="cursor-pointer text-secondary" @click="closePendingReview()" icon="mdi:mdi-window-close"></v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-card-title>
        <v-card-text class="text-body-1">
          <v-col v-if="!showReview" cols="12">
            <h3 v-if="showAnnualReview">
              Please review the following pending notices. You may choose to either download them or post them on the Sponsor
              Website.
            </h3>
            <h3 v-else>
              You have pending notices that need to be reviewed by <b>Monday, June 12th.</b> To review, click the
              <b>Review</b> button to download. These disclosures will be automatically posted to the sponsor site on Monday, June
              12th, and then mailed to eligible and active participants on or before <b>July 1st.</b>
            </h3>
            <v-col cols="12" class="mt-8 mb-8 pa-0">
              <v-row class="mb-3">
                <v-col cols="6" class="pa-0">
                  <h3 class="font-weight-bold">Notice Type</h3>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <h3 class="font-weight-bold">Number of Plans</h3>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-for="(item, index) in notificationTypeList" :key="index" cols="12" class="pa-0">
                  <v-row class="mb-3">
                    <v-col cols="6" class="pa-0">
                      <h3>{{ item.NoticeType ? item.NoticeType : '' }}</h3>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <h3>{{ item.NumberOfPlans ? item.NumberOfPlans : 0 }}</h3>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="text-center mt-5 mb-5 pa-0">
              <v-btn size="large" color="accent" class="pl-15 pr-15" @click="showReview = true"> Review </v-btn>
            </v-col>
          </v-col>
          <v-col v-if="showReview" cols="12" class="pa-0">
            <v-col v-if="notificationTypeList && notificationTypeList.length === 1" class="pa-0">
              <h3 v-if="showAnnualReview">
                The Annual Review Benchmarking Report has been generated for the following plans. These reports do not include
                reporting on the Investments section. You may choose to download them or opt out of posting them on to the Sponsor
                website.
              </h3>
              <h3 v-if="showAnnualReview" class="pt-2 font-weight-bold">
                A blue checkmark in the left column indicates that the report will be published on the Sponsor website on
                September 25, 2023
              </h3>
              <div v-if="!showAnnualReview">
                <h3 v-if="item.NoticeType?.toLowerCase() === 'all-in-one fee report'">
                  The All-In-One Fee Report has been generated for the following plans. These reports will be published on the
                  Sponsor website on September 14, 2023.
                </h3>
                <h3 v-else>You may review the notices by clicking the download link below.</h3>
              </div>
              <v-col v-if="showAnnualReview" cols="12" class="mt-2 mb-8 pa-0">
                <v-data-table
                  :headers="header"
                  v-model="selected"
                  :items="notificationList"
                  item-value="NotificationId"
                  class="elevation-0 fixHeader"
                  :hide-default-footer="true"
                  :disable-pagination="true"
                  mobile-breakpoint="0"
                  :fixed-header="!isXsOnly"
                  style="backface-visibility: hidden"
                  :height="notificationList.length > 4 ? '340px' : ''"
                  :loading="loading"
                  show-select
                  return-object
                >
                  <template v-slot:item.Action="{ item }">
                    <v-btn variant="text" color="accent" @click="downloadDetails(item)">
                      <v-icon start class="pr-1" icon="fa:fa fa-arrow-down"> </v-icon> Download
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
              <v-col v-else cols="12" class="mt-2 mb-8 pa-0">
                <v-data-table
                  :headers="header"
                  :items="notificationList"
                  item-value="PlanId"
                  class="elevation-0 fixHeader"
                  :hide-default-footer="true"
                  :disable-pagination="true"
                  mobile-breakpoint="0"
                  :fixed-header="!isXsOnly"
                  style="backface-visibility: hidden"
                  :height="notificationList.length > 4 ? '340px' : ''"
                  :loading="loading"
                >
                  <template #item="{ item }">
                    <tr>
                      <td>
                        {{ item.PlanName ? item.PlanName : '' }}
                      </td>
                      <td>
                        <v-btn variant="text" color="accent" @click="downloadDetails(item)">
                          <v-icon start class="pr-1" icon="fa:fa fa-arrow-down"> </v-icon> Download
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
              <v-col v-if="showAnnualReview" cols="12" class="pa-0">
                <v-row justify="center">
                  <v-btn color="accent" size="large" class="pl-15 pr-15" @click="postMultiSponsor()">
                    Confirm Plan Selection
                  </v-btn>
                </v-row>
              </v-col>
            </v-col>
            <v-col v-if="notificationTypeList && notificationTypeList.length > 1" class="height_600 pa-0">
              <v-tabs v-model="activeTab" class="notificationMenu" color="accent" height="30px" slider-size="3">
                <v-tab v-for="item in notificationTypeList" :key="item.NoticeType">
                  <span>{{ item.NoticeType ? item.NoticeType : '' }}</span>
                </v-tab>
              </v-tabs>
              <v-window v-model="activeTab">
                <v-window-item v-for="item in notificationTypeList" :key="item.NoticeType">
                  <v-col v-if="item.NoticeType?.toLowerCase() === 'annual review'" class="mt-6 pa-0">
                    <h3>
                      The Annual Review Benchmarking Report has been generated for the following plans. These reports do not
                      include reporting on the Investments section. You may choose to download them or opt out of posting them on
                      to the Sponsor website.
                    </h3>
                    <h3 class="pt-2 font-weight-bold">
                      A blue checkmark in the left column indicates that the report will be published on the Sponsor website on
                      September 25, 2023
                    </h3>
                    <v-col cols="12" class="mt-2 mb-8 pa-0">
                      <v-data-table
                        :headers="header"
                        v-model="selected"
                        :items="notificationTypeBasedList"
                        item-value="NotificationId"
                        class="elevation-0 fixHeader"
                        :hide-default-footer="true"
                        :disable-pagination="true"
                        mobile-breakpoint="0"
                        :fixed-header="!isXsOnly"
                        style="backface-visibility: hidden"
                        height="340px"
                        :loading="loading"
                        show-select
                        return-object
                      >
                        <template v-slot:item.Action="{ item }">
                          <v-btn variant="text" color="accent" @click="downloadDetails(item)">
                            <v-icon start class="pr-1" icon="fa:fa fa-arrow-down"> </v-icon> Download
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      <v-row justify="center">
                        <v-btn color="accent" size="large" class="pl-15 pr-15" @click="postMultiSponsor()">
                          Confirm Plan Selection
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-col>
                  <v-col v-else class="mt-6 pa-0">
                    <h3 v-if="item.NoticeType?.toLowerCase() === 'all-in-one fee report'">
                      The All-In-One Fee Report has been generated for the following plans. These reports will be published on the
                      Sponsor website on September 14, 2023.
                    </h3>
                    <h3 v-else>You may review the notices by clicking the download link below.</h3>
                    <v-col cols="12" class="mt-2 mb-8 pa-0">
                      <v-data-table
                        :headers="header"
                        :items="notificationTypeBasedList"
                        item-value="PlanId"
                        class="elevation-0 fixHeader"
                        :hide-default-footer="true"
                        :disable-pagination="true"
                        mobile-breakpoint="0"
                        :fixed-header="!isXsOnly"
                        style="backface-visibility: hidden"
                        height="400px"
                        :loading="loading"
                      >
                        <template v-slot:item.Action="{ item }">
                          <v-btn variant="text" color="accent" @click="downloadDetails(item)">
                            <v-icon start class="pr-1" icon="fa:fa fa-arrow-down"> </v-icon> Download
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-col>
                </v-window-item>
              </v-window>
            </v-col>
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>
  </v-dialog>
</template>
<script>
import { ref, onMounted, getCurrentInstance, inject, watch, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  props: ['fromPage'],
  setup(props) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const eventBus = inject('eventBus')
    const toast = inject('toast')
    const activeTab = ref(0)
    const showPopup = ref(false)
    const showReview = ref(false)
    const fromPageVal = ref(props.fromPage)
    const header = ref([
      {
        title: 'Plan Name',
        align: 'start',
        sortable: false,
        key: 'PlanName',
        width: '75%',
        class: 'font-weight-bold pl-2 pr-2'
      },
      {
        title: 'Actions',
        align: 'center',
        sortable: false,
        key: 'Action',
        width: '25%',
        class: 'font-weight-bold'
      }
    ])
    const notificationList = ref([])
    const notificationTypeList = ref([])
    const loading = ref(false)
    const showAnnualReview = ref(false)
    const selected = ref([])
    const notificationTypeBasedList = ref([])
    const isXsOnly = ref(false)
    //watch
    watchEffect(() => {
      isXsOnly.value = display.xs.value
    })
    watch(
      activeTab,
      (val) => {
        if (notificationTypeList.value && notificationTypeList.value.length > 0) {
          let notificationBasedOnType = notificationTypeList[val].NoticeType
          if (notificationBasedOnType) {
            if (notificationList.value && notificationList.value.length > 0) {
              notificationTypeBasedList.value = notificationList.value.filter(
                (a) => a.NoticeType?.toLowerCase() === notificationBasedOnType?.toLowerCase()
              )
            } else {
              notificationTypeBasedList.value = []
            }
          }
        }
      },
      { immediate: true }
    )
    //mounted
    onMounted(() => {
      if (fromPageVal.value === 'Home') {
        eventBus.on('callAnnualReviewNotification', () => {
          getNotificationList()
        })
      }
    })
    //methods
    function openNotification() {
      showReview.value = false
      $axios.get(`/api/v1/rbc/report/notifications`).then((success) => {
        if (success.data && success.data.d && success.data.d.length > 0) {
          let notificationType = success.data.d.filter((a) => parseInt(a.NumberOfPlans) > 0)
          let notificationExist = notificationType && notificationType.length > 0 ? true : false
          notificationTypeList.value = notificationType && notificationType.length > 0 ? notificationType : []
          notificationTypeList.value.forEach((a) => {
            if (a.NoticeType?.toLowerCase() === 'annual review') {
              showAnnualReview.value = true
            }
          })
          if (notificationExist) {
            getReportNotificationDetail()
          }
          showPopup.value = notificationExist
        } else {
          showPopup.value = false
        }
      })
    }
    function getNotificationList() {
      if ($store.state.user.reliusSSO && !$store.state.hidePendingReview) {
        showReview.value = false
        $axios.get(`/api/v1/rbc/report/notifications`).then((success) => {
          if (success.data && success.data.d && success.data.d.length > 0) {
            let notificationType = success.data.d.filter((a) => parseInt(a.NumberOfPlans) > 0)
            let notificationExist = notificationType && notificationType.length > 0 ? true : false
            notificationTypeList.value = notificationType && notificationType.length > 0 ? notificationType : []
            notificationTypeList.value.forEach((a) => {
              if (a.NoticeType?.toLowerCase() === 'annual review') {
                showAnnualReview.value = true
              }
            })
            if (notificationExist) {
              getReportNotificationDetail()
            } else {
              $store.state.showNotification = false
              callFirstTimeUX()
            }
            showPopup.value = notificationExist
          } else {
            $store.state.showNotification = true
            showPopup.value = false
            callFirstTimeUX()
          }
        })
      } else {
        $store.state.showNotification = true
        callFirstTimeUX()
        showPopup.value = false
      }
    }
    function callFirstTimeUX() {
      if (fromPageVal.value === 'Home') {
        $store.dispatch('getContactPreferences').then(() => {
          if ($store.state.contactPreferences && !$store.state.contactPreferences.hideFirstTimeUX) {
            eventBus.emit('showFirstTimeUX', true)
            $store.state.contactPreferences.hideFirstTimeUX = true
          }
        })
      }
    }
    function getReportNotificationDetail() {
      if (notificationTypeList.value && notificationTypeList.value.length > 0) {
        notificationList.value = []
        loading.value = true
        notificationTypeList.value.forEach((element) => {
          $axios
            .get(`/api/v1/rbc/report/notificationdetails/${element.NoticeType}`)
            .then((success) => {
              if (success.data && success.data.d && success.data.d.length > 0) {
                let noticeList = success.data.d
                noticeList.forEach((a) => {
                  a.NoticeType = element.NoticeType
                })
                if (notificationList.value && notificationList.value.length === 0) {
                  notificationList.value = noticeList
                } else {
                  Array.prototype.push.apply(notificationList, noticeList)
                }
              }
              if (notificationList.value && notificationList.value.length > 0) {
                let annualReviewNotice = notificationList.value.filter((a) => a.NoticeType?.toLowerCase() === 'annual review')
                selected.value = annualReviewNotice && annualReviewNotice.length > 0 ? annualReviewNotice : []
                if (notificationTypeList.value && notificationTypeList.value.length > 0) {
                  let notificationBasedOnType = notificationTypeList[activeTab].NoticeType
                  if (notificationBasedOnType) {
                    if (notificationList.value && notificationList.value.length > 0) {
                      notificationTypeBasedList.value = notificationList.value.filter(
                        (a) => a.NoticeType?.toLowerCase() === notificationBasedOnType?.toLowerCase()
                      )
                    } else {
                      notificationTypeBasedList.value = []
                    }
                  }
                }
              } else notificationTypeBasedList.value = []

              $store.state.showNotification = notificationList.value && notificationList.value.length > 0 ? true : false
              loading.value = false
            })
            .catch(() => {
              loading.value = false
              $store.state.showNotification = false
            })
        })
      }
    }
    function downloadDetails(val) {
      if (val && val.HyperLink) {
        $axios.get(`/api/v1/sfdc/report/${val.NotificationId}/post`).then(() => {
          getReportNotificationDetail()
          toast.clearAll()
          toast.success('Download Complete', { autoClose: 3000 })
        })
        //onPopUpEvent(val.HyperLink)
      }
    }
    function postSponsor(val) {
      if (val && val.NotificationId) {
        $axios.get(`/api/v1/sfdc/report/${val.NotificationId}/post`).then(() => {
          getReportNotificationDetail()
          toast.clearAll()
          toast.success('Sponsor has been posted successfully', { autoClose: 3000 })
        })
      }
    }
    function postMultiSponsor() {
      if (notificationList.value && notificationList.value.length > 0) {
        let notificationIds = notificationList
        notificationIds.value.forEach((a) => {
          a.OptOut = true
        })
        if (selected.value && selected.value.length > 0) {
          notificationIds.value.forEach((a) => {
            selected.value.forEach((b) => {
              if (b.NotificationId === a.NotificationId) {
                a.OptOut = false
              }
            })
          })
          if (notificationIds && notificationIds.value.length > 0) {
            $axios.post(`/api/v1/sfdc/report/postonsponsorwebsite`, notificationIds)
            $store.state.showNotification = notificationList.value && notificationList.value.length > 0 ? true : false
            showPopup.value = false
            callFirstTimeUX()
            toast.clearAll()
            toast.success('Sponsor has been posted successfully', { autoClose: 3000 })
          }
        }
      }
    }
    function closePendingReview() {
      $store.state.hidePendingReview = true
      $store.state.showNotification = notificationList.value && notificationList.value.length > 0 ? true : false
      showPopup.value = false
      callFirstTimeUX()
    }

    return {
      activeTab,
      showPopup,
      showReview,
      header,
      notificationList,
      notificationTypeList,
      loading,
      showAnnualReview,
      selected,
      notificationTypeBasedList,
      display,
      fromPageVal,
      toast,
      isXsOnly,
      postSponsor,
      downloadDetails,
      callFirstTimeUX,
      closePendingReview,
      postMultiSponsor,
      getReportNotificationDetail,
      getNotificationList,
      openNotification
    }
  }
}
</script>
