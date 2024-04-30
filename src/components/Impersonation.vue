<template>
  <div>
    <v-dialog v-model="dialogShow" persistent :scrollable="false" max-width="500" content-class="elevation-3" :eager="true">
      <v-card>
        <v-card-title class="pt-3 pb-3 bg-accent">
          <v-row>
            <v-col
              xl="11"
              lg="11"
              sm="11"
              md="11"
              xs="11"
              class="align-self text-center font_14 text-uppercase text-secondary pa-0"
            >
              Impersonate an advisor
            </v-col>
            <v-col xl="1" lg="1" sm="1" md="1" xs="1" class="text-right pa-0">
              <v-icon color="secondary" @click="closeImpersonation()" icon="mdi:mdi-close"></v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pl-4 pr-4 pt-5 pb-8">
          <v-form ref="form" v-model="valid">
            <v-col xl="12" lg="12" md="12" sm="12" xs="12" class="pa-0">
              <v-row class="justify-center">
                <v-col xl="12" lg="12" md="12" sm="12" xs="12" class="pa-0">
                  <v-autocomplete
                    v-model="impersonatingUser"
                    :readonly="isImpersonating"
                    :items="userList"
                    v-if="!isImpersonating"
                    item-title="contactName"
                    placeholder="Search advisor to impersonate"
                    return-object
                    :rules="[(v) => !!v || 'User is required']"
                    clearable
                    required
                    :error-messages="errorMsg"
                    :error="error"
                    hide-no-data
                    @click:clear="clearImpersonation"
                    @update:model-value="getFirmList"
                    :menu-icon="loaderForUserList ? '' : 'fa:icon-chevron-down'"
                  >
                    <template v-slot:append-inner>
                      <v-icon
                        color="accent"
                        v-if="userList.length === 0 ? loaderForUserList : false"
                        :size="21"
                        icon="fa:fas fa-circle-notch fa-spin"
                      ></v-icon>
                    </template>
                  </v-autocomplete>
                  <v-col v-if="isImpersonating" class="text-left mb-3 pa-0">
                    <h3>You are impersonating {{ $store.state.user }}</h3>
                  </v-col>
                </v-col>
                <v-col v-if="showFirmList && !isImpersonating" xl="12" lg="12" md="12" sm="12" xs="12" class="pa-0">
                  <h3 class="mb-3 font_12">
                    This advisor has more than one relationship within the program. Please select the appropriate relationship to
                    impersonate.
                  </h3>
                  <v-select
                    v-model="firm"
                    :readonly="isImpersonating"
                    :items="firmList"
                    label="Select Advisor Relationship"
                    return-object
                    :rules="showFirmList ? [(v) => !!v || 'Advisor Relationship is required'] : []"
                    item-title="accountName"
                    :required="showFirmList"
                    :error-messages="firmErrorMsg"
                    :error="firmError"
                  />
                </v-col>
                <v-col xl="12" lg="12" md="12" sm="12" xs="12" class="text-center pa-0 mt-2">
                  <v-btn v-if="isImpersonating" color="accent" @click="endImpersonation()"> Stop </v-btn>
                  <v-btn v-if="!isImpersonating" :disabled="!valid" color="accent" size="large" @click="beginImpersonation()">
                    Impersonate
                  </v-btn>
                </v-col>
                <v-col
                  v-if="
                    $authz.hasPermission($authz.permissionSet.Add_User__c, $authz.permission.Full) &&
                    $store.state.user.selectedProgram.programId === $authz.programId.PCS
                  "
                  xl="12"
                  lg="12"
                  md="12"
                  sm="12"
                  xs="12"
                  class="text-center mt-3 pa-0"
                >
                  <h3 class="mb-1 font-weight-bold font_13 mt-2">Can’t find the advisor to impersonate?</h3>
                  <v-btn variant="text" class="text-none ma-0 font_14" color="accent" @click="callAddUser()">
                    Add Advisor to the portal
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Loader v-model="loading" :loading="loading" />
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import { ref, computed, onMounted, watch, getCurrentInstance, inject, onBeforeUnmount } from 'vue'
export default {
  components: {
    Loader
  },
  emits: ['openAddAdvisorPopup'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const valid = ref(true)
    const userList = ref([])
    const impersonatingUser = ref(null)
    const errorMsg = ref('')
    const error = ref(false)
    const showFirmList = ref(false)
    const firmList = ref([])
    const firm = ref(null)
    const firmErrorMsg = ref('')
    const firmError = ref(false)
    const loading = ref(false)
    const loaderForUserList = ref(false)
    const eventBus = inject('eventBus')
    const toast = inject('toast')
    const form = ref(null)
    const dialogShow = ref(false)
    //computed
    const isImpersonating = computed(() => {
      return $store.state.isImpersonating
    })
    //watch
    watch(
      impersonatingUser,
      (val) => {
        if (val && val.value && val.value.username) {
          errorMsg.value = ''
          error.value = false
          valid.value = true
        }
      },
      { immediate: true },
      { deep: true }
    )
    //mounted
    onMounted(() => {
      eventBus.on('getImpersonationList', () => {
        getUserList()
      })
      eventBus.on('beginImpersonation', (advisor, route) => {
        callImpersonationApi(advisor, route)
      })
      eventBus.on('openImpersonationPopUp', () => {
        dialogShow.value = true
        resetForm()
        getUserList()
      })
      eventBus.on('closeImpersonationPopUp', () => {
        endImpersonation()
      })
    })
    //beforeUnMount
    onBeforeUnmount(() => {
      eventBus.off('getImpersonationList')
      eventBus.off('beginImpersonation')
      eventBus.off('openImpersonationPopUp')
      eventBus.off('closeImpersonationPopUp')
    })
    //methods
    function beginImpersonation() {
      if (impersonatingUser.value && !impersonatingUser.value.username) {
        errorMsg.value = 'User is required'
        error.value = true
        return
      } else {
        errorMsg.value = ''
        error.value = false
      }
      if (showFirmList.value) {
        if (!firm.value) {
          firmErrorMsg.value = 'Advisor Relationship is required'
          firmError.value = true
          return
        } else {
          firmErrorMsg.value = ''
          firmError.value = false
        }
      }
      if (form.value.validate()) {
        loading.value = true
        dialogShow.value = false
        var impersonateRelation = ''
        if (showFirmList.value) {
          impersonateRelation = firm.value
        } else impersonateRelation = impersonatingUser.value
        callImpersonationApi(impersonateRelation, '/')
      }
    }
    function callImpersonationApi(val, route) {
      $axios
        .post(`/api/v1/user/impersonation/start`, val)
        .then(() => {
          window.location.assign(route)
        })
        .catch((error) => {
          if (route !== '/') eventBus.emit('closePopUp')
          if (error.response.status !== 403) {
            loading.value = false

            toast.error('Impersonation failed. Please try again later', { autoClose: false })
          }
        })
    }
    function endImpersonation() {
      loading.value = true
      dialogShow.value = false
      $axios
        .post(`/api/v1/user/impersonation/stop`)
        .then(() => {
          window.location.assign('/')
          form.value.resetValidation()
        })
        .catch((error) => {
          toast.error(error.response.data.message, { autoClose: false })
        })
    }
    function resetForm() {
      if (dialogShow.value === true) {
        if (!$store.state.isImpersonating) {
          impersonatingUser.value = null
          errorMsg.value = ''
          error.value = false
        }
        form.value.resetValidation()
      }
    }
    function clearImpersonation() {
      impersonatingUser.value = null
      firm.value = null
      firmList.value = []
      showFirmList.value = false
    }
    function getUserList() {
      loaderForUserList.value = true
      $axios
        .get(`/api/v1/user/relationship/members`)
        .then((response) => {
          userList.value = response.data && response.data.length > 0 ? response.data : []
          loaderForUserList.value = false
        })
        .catch(() => {
          loaderForUserList.value = false
        })
    }
    function getFirmList() {
      firmList.value = []
      firm.value = null
      let contactName = impersonatingUser.value ? impersonatingUser.value.contactName : ''
      if (contactName) {
        let firmCount = userList.value.filter((a) => a.contactName === contactName)
        if (firmCount && firmCount.length > 0) {
          let distinctValue = []
          firmCount.filter(function (item) {
            let i = distinctValue.findIndex((x) => x.accountName === item.accountName)
            if (i <= -1) {
              distinctValue.push(item)
            }
            return null
          })
          if (distinctValue && distinctValue.length > 1) {
            firmList.value = distinctValue
            showFirmList.value = true
          } else {
            showFirmList.value = false
            if (
              $authz.allowedByProgram(
                $authz.programPermissionSet.PCS_Aspire_Product__c,
                $authz.pcsAspireProduct.Multi_Strategist_Product
              )
            ) {
              if (distinctValue.length === 1 && firmCount.length > 1) {
                let userName = firmCount.filter((a) => a.username.includes('ENV'))
                if (userName && userName.length > 0) {
                  impersonatingUser.value = userName[0]
                }
              }
            }
          }
        } else showFirmList.value = false
      }
    }
    function callAddUser() {
      dialogShow.value = false
      emit('openAddAdvisorPopup')
    }
    function closeImpersonation() {
      dialogShow.value = false
    }

    return {
      valid,
      userList,
      impersonatingUser,
      errorMsg,
      error,
      showFirmList,
      firmList,
      firm,
      firmErrorMsg,
      firmError,
      loading,
      loaderForUserList,
      isImpersonating,
      dialogShow,
      form,
      callAddUser,
      getFirmList,
      clearImpersonation,
      endImpersonation,
      beginImpersonation,
      closeImpersonation
    }
  }
}
</script>
