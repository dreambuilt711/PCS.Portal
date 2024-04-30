<template>
  <v-dialog
    v-model="contactInfoDialog"
    persistent
    class="elevation-3 dialogPosition"
    content-class="elevation-3 dialogPosition"
    scrollable
    :eager="true"
    :max-width="dialogWidth"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>
        <v-col cols="12" xs="12">
          <v-col class="text-right">
            <v-icon color="accent" @click="closeContactInfoDialog()"> close </v-icon>
          </v-col>
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-col class="text-h5 text-left font-weight-medium"> Duplicate Contact Found </v-col>
        <v-col class="pt-4 pb-8">
          <h3>The following contact(s) already exist. View status for contact or use existing contact.</h3>
        </v-col>
        <v-data-table
          v-if="!contactInfoLoader"
          :headers="contactInfoHeaderList"
          :items="duplicateEmailIDList"
          item-key="FirstName"
          :class="display.xs.value ? 'elevation-0' : 'elevation-0 mb-3'"
          :options="pagination"
          :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
          :mobile="false"
          :mobile-breakpoint="0"
          hide-default-footer
        >
          <template #item="{ item }">
            <tr>
              <td class="text-left" :class="!display.mdAndUp.value ? 'pa-1' : ''">
                {{ item.FirstName }}
              </td>
              <td v-if="display.mdAndUp.value" class="text-left pa-1">
                {{ item.LastName }}
              </td>
              <td v-if="display.mdAndUp.value" class="text-left pa-1">
                {{ item.Email }}
              </td>
              <td v-if="display.mdAndUp.value" class="text-left pa-1">
                {{ item.HomePhone ? item.HomePhone : item.MobilePhone }}
              </td>
              <td v-if="display.mdAndUp.value" class="text-left pa-1">
                {{ item.PlanType }}
              </td>
              <td
                v-if="display.mdAndUp.value"
                class="text-left pa-1 cursor-pointer text-decoration-underline"
                :class="!theme.dark ? 'text-hyperlink' : 'text-white'"
                @click="viewContactDetails('Participants')"
              >
                {{ item.Status }}
              </td>
              <td class="text-center" :class="display.xs.value ? 'pa-0' : ''">
                <v-btn class="ma-2 text-capitalize" :color="theme.dark ? '' : 'accent'" @click="openApplication(item)">
                  Use This Contact
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-col class="text-left pb-8 pt-2">
          <v-btn class="text-capitalize" :color="theme.dark ? '' : 'accent'" @click="createNewContact()">
            Ignore, Create new opportunity
          </v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, computed } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
export default {
  props: ['value', 'duplicateEmailIDList'],
  setup(props, { emit }) {
    const theme = useTheme()
    const router = useRouter()
    const display = useDisplay()
    const contactInfoHeaders = ref([
      {
        title: 'First Name',
        value: 'FirstName',
        align: 'start',
        width: display.xs.value ? '30%' : '15%',
        sortable: true,
        show: true,
        class: !display.mdAndUp.value ? 'pa-2' : ''
      },
      {
        title: 'Last Name',
        value: 'LastName',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Email',
        value: 'Email',
        align: 'start',
        width: '12%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Phone',
        value: 'Phone',
        align: 'start',
        width: '15%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Plan Type',
        value: 'PlanType',
        align: 'start',
        width: '18%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: 'Lead Status',
        value: 'Status',
        align: 'start',
        width: '18%',
        sortable: true,
        show: display.mdAndUp.value,
        class: 'pa-1'
      },
      {
        title: '',
        value: 'Actions',
        align: 'center',
        width: display.xs.value ? '1%' : '10%',
        sortable: false,
        show: true,
        class: display.xs.value ? 'pa-0' : ''
      }
    ])
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 20
    })
    const contactInfoLoader = ref(false)
    const contactInfoDialog = computed({
      get: () => {
        return props.value
      },
      set: (value) => {
        emit('input', value)
      }
    })
    const contactInfoHeaderList = computed(() => {
      return contactInfoHeaders.value.filter((h) => h.show === true)
    })
    const dialogWidth = computed(() => {
      if (display.xl.value) return '55%'
      else if (display.lg.value) return '70%'
      else return '90%'
    })
    const closeContactInfoDialog = () => {
      contactInfoDialog.value = false
      emit('newSelectedpage')
    }
    const createNewContact = () => {
      contactInfoDialog.value = false
      emit('planSelectionPage')
    }
    const goToActivity = (val) => {
      if (val === 'Prospect Pipeline') {
        router.push('/TAL/Plans').catch(() => {})
      }
      if (val === 'Onboarding') {
        router.push('/Home/Onboarding').catch(() => {})
      }
    }
    const viewContactDetails = (type) => {
      router
        .push({
          name: 'TALProspectPlans',
          params: { Type: type }
        })
        .catch(() => {})
    }
    const openApplication = (val) => {
      emit('openViewContact', { val: val, from: 'Duplicates' })
    }
    return {
      theme,
      display,
      contactInfoDialog,
      dialogWidth,
      contactInfoLoader,
      contactInfoHeaderList,
      pagination,
      goToActivity,
      closeContactInfoDialog,
      viewContactDetails,
      openApplication,
      createNewContact
    }
  }
}
</script>
<style>
div.v-dialog.dialogPosition {
  position: absolute;
  bottom: 0;
  top: 250px;
}
</style>
