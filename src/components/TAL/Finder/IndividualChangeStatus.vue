<template>
  <v-card>
    <v-card-title class="pt-3 pb-2 pl-4" fixed :class="$vuetify?.theme.dark ? '' : 'accent'">
      <v-row>
        <v-col xl11 lg11 sm11 md11 xs11 class="align-self">
          <v-row>
            <CustomIcon type="StatusIcon" />
            <span class="font_14 text-uppercase text-secondary ml-2">Change Status</span>
          </v-row>
        </v-col>
        <v-col xl1 lg1 sm1 md1 xs1 class="text-right">
          <v-icon color="secondary" @click="resetStatus()"> close </v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pl-4 pr-4 pt-3 pb-2">
      <v-col xs12 :class="$vuetify?.theme.dark ? '' : 'text-accent'" mb-3>
        <v-row>
          <v-col class="flex_none align-self"> Current Status : </v-col>
          <v-col class="ml-3">
            <div
              :class="[
                currentStatus === 'Envelope Created'
                  ? 'openStatus'
                  : currentStatus === 'Agreement Opened'
                    ? 'agrmtOpenStatus'
                    : currentStatus === 'Participant Demographics Completed'
                      ? 'pdCompleteStatus'
                      : currentStatus === 'RTQ Completed'
                        ? 'rtqCompleteStatus'
                        : currentStatus === 'Beneficiary Updated'
                          ? 'benfiUpdatedStatus'
                          : currentStatus === 'Agreement Received, in Quality Check'
                            ? 'agrmtReceStatus'
                            : currentStatus === 'Account Setup'
                              ? 'accSetupStatus'
                              : currentStatus === 'Inactive'
                                ? 'inActiveStatus'
                                : ''
              ]"
            >
              <span class="text-capitalize">{{ formatStatus(currentStatus) }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col xs12 :class="$vuetify?.theme.dark ? '' : 'text-accent'" mb-2> New Status : </v-col>
      <v-col xs12>
        <v-form
          :id="`statusForm ${opportunityId}`"
          ref="form1"
          v-model="formValid"
          lazy-validation
          @submit.prevent="SaveStatus()"
        >
          <v-col xs12 sm10 md10 lg6 xl6>
            <v-select
              v-model="statusType"
              variant="outlined"
              append-icon="icon-chevron-down"
              label="Select Status"
              :items="statusList"
              :rules="[(v) => !!v || 'Status is required']"
              clearable
              density="compact"
              @update:model-value="changeStatus(statusType)"
            />
          </v-col>
          <v-col v-if="statusType === 'InActive'" xs12>
            <v-select
              v-model="statusChangeReason"
              variant="outlined"
              append-icon="icon-chevron-down"
              label="Reason for Status Change"
              :items="statusReasonList"
              :error="reasonError"
              :error-messages="reasonErrorMsg"
              clearable
              density="compact"
              @update:model-value="reasonforStatusChange()"
            />
          </v-col>
        </v-form>
      </v-col>
    </v-card-text>
    <v-card-actions class="pb-4 pt-2 pl-4 pr-4">
      <v-col class="text-right">
        <v-btn variant="outlined" :color="$vuetify?.theme.dark ? '' : 'accent'" @click="resetFormData()"> Clear </v-btn>
        <v-btn
          type="submit"
          :color="$vuetify?.theme.dark ? '' : 'accent'"
          :form="`statusForm ${opportunityId}`"
          class="elevation-0"
          :disabled="!formValid"
          @click="SaveStatus()"
        >
          Save
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>
<script>
import CustomIcon from '@/components/CustomIcon'
export default {
  components: {
    CustomIcon
  },
  props: ['dialog', 'opportunityId', 'currentStatus'],
  data() {
    return {
      statusChangeList: [],
      planStatusList: [{ text: 'InActive', value: 'InActive' }],
      inActiveStatusReasonList: [
        {
          text: 'Participant opted not to contribute',
          value: 'Participant opted not to contribute'
        },
        {
          text: 'Participant selected alternative product/vendor/financial professional',
          value: 'Participant selected alternative product/vendor/financial professional'
        },
        {
          text: 'Lost contact with participant',
          value: 'Lost contact with participant'
        },
        {
          text: 'No activity on opportunity for 60 days',
          value: 'No activity on opportunity for 60 days'
        }
      ],
      whatThePlanWasLostTo: '',
      statusChangeReason: '',
      statusReason: '',
      delayedStatusReason: '',
      statusType: '',
      reasonError: false,
      reasonErrorMsg: '',
      formValid: false,
      talReportId: ''
    }
  },
  computed: {
    statusList() {
      return this.planStatusList.filter((a) => a.text !== this.currentStatus)
    },
    statusReasonList() {
      var reasonList = []
      switch (this.statusType) {
        case 'InActive':
          reasonList = this.inActiveStatusReasonList
          break
        default:
          break
      }
      return reasonList
    }
  },
  watch: {
    dialog: {
      handler(val) {
        if (val) {
          this.resetFormData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    SaveStatus() {
      if (this.$refs.form1.validate()) {
        if (this.statusType === 'InActive' && !this.statusChangeReason) {
          this.reasonError = true
          this.reasonErrorMsg = 'Reason for Status Change is required'
          return
        } else {
          this.reasonError = false
          this.reasonErrorMsg = ''
          var planStatus = {
            status: this.statusType,
            opportunityId: this.opportunityId,
            reasonforLost: this.statusChangeReason,
            time: new Date()
          }
          this.$store.state.planStatus.push(planStatus)
          this.$emit('getSchoolDataProgress', planStatus)
          this.$axios
            .post(`/api/v1/proposal/plan/status`, planStatus)
            // eslint-disable-next-line no-unused-vars
            .then((success) => {
              this.$emit('getSchoolDataProgress', planStatus)
            })
        }
        this.resetStatus()
      }
    },
    resetFormData() {
      this.statusReason = ''
      this.statusChangeReason = ''
      this.reasonError = false
      this.reasonErrorMsg = ''
      this.statusType = ''
      if (this.$refs.form1) {
        this.$refs.form1.reset()
        this.$refs.form1.resetValidation()
      }
    },
    changeStatus() {
      this.statusReason = ''
      this.statusChangeReason = ''
      this.reasonError = false
      this.reasonErrorMsg = ''
      this.statusType = 'InActive'
    },
    resetStatus() {
      this.resetFormData()
      this.$emit('closeStatus')
    },
    reasonforStatusChange() {
      if (this.statusChangeReason) {
        this.reasonError = false
        this.reasonErrorMsg = ''
      } else {
        this.reasonError = true
        this.reasonErrorMsg = 'Reason for Status Change is required'
      }
    },
    formatStatus(value) {
      if (value === null) return
      if (value === 'Envelope Created') return 'Env. Created'
      else if (value === 'Agreement Opened') return 'Agrmt. Open'
      else if (value === 'Participant Demographics Completed') return 'P.D.Completed'
      else if (value === 'Beneficiary Updated') return 'Benif. Updated'
      else if (value === 'Agreement Received, in Quality Check') return 'Agrmt.Recv.'
      else if (value === 'Account Setup') return 'Acct.Setup'
      else if (value === 'Account Funded') return 'Acc.Funded'
      else if (value === 'Assets Transferred') return 'Asst.Transferred'
      else if (value === 'Account Live') return 'Acc.Live'
      return value
    }
  }
}
</script>
<style scoped>
.v-stepper__header .v-divider {
  margin: 0 0px !important;
}
.disableStepper:hover {
  cursor: not-allowed;
}

.iconSize {
  font-size: 1em !important;
}
.divider {
  border-color: rgba(0, 0, 0, 0.42) !important;
}

.border {
  border: 1px solid #707070;
}
.v-btn:before {
  opacity: 0 !important;
  width: 62px !important;
  height: 26px !important;
}

table.v-table tbody td,
table.v-table tfoot td {
  font-size: 0.82em !important;
}
.statusBack {
  background: #147ac2 0% 0% no-repeat padding-box;
  border-radius: 5px;
  opacity: 0.16;
  width: 82px !important;
  color: #0969b0;
}

.rotate_icon_180 {
  transform: rotate(90deg) !important;
  -webkit-transform: rotate(90deg) !important;
}

.flexborder {
  border: 1px solid #707070 !important;
}

.overflow_x_hidden {
  overflow-x: hidden !important;
}
</style>
