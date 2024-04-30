<template>
  <v-col class="pa-0">
    <v-card>
      <v-data-table
        class="elevation-0 changeTableColor"
        loader-height="2"
        item-key="ID"
        :loading="schoolInformationLoading"
        :headers="Headers"
        :items="schoolArray"
        :hide-default-header="display.mdAndDown"
        :options="options"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
      >
        <template #item="{ item }">
          <tr v-if="!display.mdAndDown">
            <td>
              <v-col cols="12" xs="12">
                <v-row class="align-self">
                  <v-col v-if="item.latitude && item.longitude" cols="1" xs="1" class="text-center d-flex flex_none mr-2">
                    <v-icon size="16" class="icon-graduation schoolIcon" />
                  </v-col>
                  <v-col cols="12" xs="9" sm="10" class="d-flex">
                    <h4 class="text-capitalize">
                      {{ item.name ? item.name.toLowerCase() : '' }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
            </td>
            <td class="text-right">
              {{ item.id }}
            </td>
            <td>{{ item.address }}</td>
            <td class="text-left">
              {{ item.type }}
            </td>
            <td class="text-right">
              {{ item.employees }}
            </td>
            <td class="text-right">
              {{ item.studentTeachersRatio }}
            </td>
            <td class="text-center pa-1">
              <v-row class="justify-center">
                <v-col cols="12" xs="12" class="flex_none">
                  <v-btn
                    :color="!theme.dark ? 'hyperlink' : ''"
                    variant="text"
                    icon
                    class="text-none"
                    @click.stop=";[(closeReportPopUp[item.id] = true), (optionsSeinpNO = item.id), (optionsItem = item)]"
                  >
                    <v-icon size="21" class="icon-action" />
                  </v-btn>
                </v-col>
              </v-row>
              <v-dialog
                :key="item.id"
                v-model="closeReportPopUp[item.id]"
                :scrollable="false"
                max-width="max-content"
                content-class="elevation-3"
              >
                <v-card>
                  <v-card-title class="mt-2 mb-2 pt-2 pb-2">
                    <v-col cols="12" xs="12" class="text-left">
                      <v-row>
                        <v-col cols="11" xs="11" class="text-left">
                          <h3>Actions</h3>
                        </v-col>
                        <v-col cols="1" xs="1" class="text-right align-self">
                          <v-icon
                            class="handcursor"
                            :class="theme.dark ? '' : 'text-accent'"
                            @click="closeReportPopUp[item.id] = false"
                          >
                            close
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card-title>
                  <v-card-text class="pt-4">
                    <v-col cols="12" xs="12">
                      <v-row>
                        <v-btn
                          block
                          class="ml-0"
                          :disabled="item.payrollSlot !== 'Approved'"
                          size="x-large"
                          :color="!theme.dark ? 'hyperlink text-white' : ''"
                          @click="performAction(optionsSeinpNO, optionsItem, $event), (closeReportPopUp[item.id] = false)"
                        >
                          {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </td>
          </tr>
          <tr v-else :class="[item.selectedRow == true ? 'selected_row_color' : '']">
            <td class="pr-3 pl-3">
              <v-col cols="12" xs="12">
                <v-row>
                  <v-col cols="10" xs="10">
                    <h5 class="pt-1">
                      <span class="text-grey">School Name</span>
                    </h5>
                    <h4 class="text-uppercase">
                      {{ item.name }}
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" xs="12" class="pt-2">
                <v-row>
                  <v-col cols="7" xs="7">
                    <v-col cols="12" xs="12">
                      <h5 class="pt-1">
                        <span class="text-grey">School ID</span>
                      </h5>
                      <h4 class="text-uppercase">
                        {{ item.id }}
                      </h4>
                    </v-col>
                  </v-col>
                  <v-col cols="5" xs="5" class="text-right">
                    <v-col cols="12" xs="12">
                      <h5 class="pt-1">
                        <span class="text-grey">School Type</span>
                      </h5>
                      <h4 class="text-uppercase">
                        {{ item.type }}
                      </h4>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" xs="12" class="pt-2">
                <v-row>
                  <v-col cols="7" xs="7">
                    <v-col cols="12" xs="12">
                      <h5 class="pt-1">
                        <span class="text-grey">Address</span>
                      </h5>
                      <h4 class="text-uppercase">
                        {{ item.address }}
                      </h4>
                    </v-col>
                  </v-col>
                  <v-col cols="5" xs="5" class="text-right">
                    <v-col cols="12" xs="12">
                      <h5 class="pt-1">
                        <span class="text-grey">Employees</span>
                      </h5>
                      <h4 class="text-uppercase">
                        {{ item.employees }}
                      </h4>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" xs="12" class="pt-2">
                <v-row>
                  <v-col cols="7" xs="7">
                    <v-col cols="12" xs="12">
                      <h5 class="pt-1">
                        <span class="text-grey">Student/Teachers Ratio</span>
                      </h5>
                      <h4 class="text-uppercase">
                        {{ item.studentTeachersRatio }}
                      </h4>
                    </v-col>
                  </v-col>
                  <v-col cols="5" xs="5" class="text-right">
                    <v-col cols="12" xs="12">
                      <h5 class="pt-1">
                        <span class="text-grey">Actions</span>
                      </h5>
                    </v-col>
                    <v-col cols="12" xs="12">
                      <v-col cols="12" xs="12" class="flex_none">
                        <v-btn
                          :color="!theme.dark ? 'hyperlink' : ''"
                          variant="text"
                          icon
                          class="text-none"
                          @click.stop=";[(closeReportPopUp[item.id] = true), (optionsSeinpNO = item.id), (optionsItem = item)]"
                        >
                          <v-icon size="21" class="icon-action" />
                        </v-btn>
                      </v-col>
                      <v-dialog
                        :key="item.id"
                        v-model="closeReportPopUp[item.id]"
                        :scrollable="false"
                        max-width="max-content"
                        content-class="elevation-3"
                      >
                        <v-card>
                          <v-card-title class="pt-2 pb-2 mt-2 mb-2">
                            <v-col cols="12" xs="12" class="text-left">
                              <v-row>
                                <v-col cols="11" xs="11" class="text-left">
                                  <h3>Actions</h3>
                                </v-col>
                                <v-col cols="1" xs="1" class="text-right align-self">
                                  <v-icon
                                    class="handcursor"
                                    :class="theme.dark ? '' : 'text-accent'"
                                    @click="closeReportPopUp[item.id] = false"
                                  >
                                    close
                                  </v-icon>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-card-title>
                          <v-card-text class="pt-4">
                            <v-col cols="12" xs="12">
                              <v-row>
                                <v-btn
                                  block
                                  class="ml-0"
                                  :disabled="item.payrollSlot !== 'Approved'"
                                  size="x-large"
                                  :color="!theme.dark ? 'hyperlink text-white' : ''"
                                  @click="performAction(optionsSeinpNO, optionsItem, $event), (closeReportPopUp[item.id] = false)"
                                >
                                  {{ `Open Account ( ${item.name ? item.name.toLowerCase() : ''} )` }}
                                </v-btn>
                              </v-row>
                            </v-col>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="School" />
  </v-col>
</template>

<script>
import { ref, watch, getCurrentInstance } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
export default {
  components: {
    OpenAccount
  },
  props: ['selectedSchool'],
  setup(props) {
    const theme = useTheme()
    const display = useDisplay()
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const closeReportPopUp = ref({})
    const filterDialog = ref(false)
    const options = ref({
      itemsPerPage: 10,
      sortBy: []
    })
    const Headers = ref([
      {
        title: 'School Name',
        value: 'Name',
        sortable: true,
        align: 'start',
        width: '25%'
      },
      {
        title: 'School ID',
        value: 'ID',
        sortable: true,
        align: 'end',
        width: '15%'
      },
      {
        title: 'School Address',
        value: 'Address',
        sortable: true,
        width: '35%',
        align: 'start'
      },
      {
        title: 'School Type',
        value: 'Type',
        sortable: true,
        width: '12%',
        align: 'start'
      },
      {
        title: 'Employees',
        value: 'Employees',
        sortable: true,
        width: '10%',
        align: 'end'
      },
      {
        title: 'Student/Teachers Ratio',
        value: 'studentRatio',
        sortable: true,
        width: '12%',
        align: 'end'
      },
      {
        title: 'Actions',
        value: '',
        width: '3%',
        align: 'center',
        sortable: false,
        class: 'pa-1'
      }
    ])
    const schoolInformationLoading = ref(true)
    const schoolArray = ref([])
    const OpenAccount = ref(null)
    const performAction = (id, val) => {
      if (val) {
        if (OpenAccount.value) OpenAccount.value.openTeacherAccount(props.selectedSchool[0], val.name)
        $store.state.openAccountDetail = {}
        filterDialog.value = true
      }
    }
    watch(
      () => props.selectedSchool,
      (val) => {
        schoolInformationLoading.value = false
        if (val && val.length > 0) {
          schoolArray.value = val[0].schools ? val[0].schools : []
        }
      },
      { immediate: true, deep: true }
    )
    return {
      theme,
      display,
      schoolInformationLoading,
      Headers,
      schoolArray,
      closeReportPopUp,
      options,
      performAction,
      OpenAccount,
      filterDialog
    }
  }
}
</script>
