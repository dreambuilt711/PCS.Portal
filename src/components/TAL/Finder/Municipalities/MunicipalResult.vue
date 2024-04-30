<template>
  <v-col cols="12" xs="12">
    <v-data-table-server
      :headers="headerList"
      :items="municipalList"
      item-key="DepartmentId"
      :class="[
        $vuetify?.breakpoint?.smAndDown ? 'elevation-0 mb-0' : 'elevation-6 mb-0',
        isShowMapSwitch ? 'showMap' : 'hideMap'
      ]"
      :options="pagination"
      mobile-breakpoint="0"
      :hide-default-footer="true"
      :items-length="totalMunicipalPlans"
    >
      <template #item="{ item }">
        <tr :class="mapSelectedMunicipal == item.DepartmentId ? rowcolor : ''">
          <td class="pa-1" :class="mapSelectedMunicipal == item.DepartmentId ? selectedRowPadding : ''">
            <v-col cols="12" xs="12">
              <v-row>
                <v-col cols="2" xs="2" sm="2" lg="2" xl="2" md="4" class="text-center align-self">
                  <div
                    v-if="item.lat && item.lng"
                    :class="[isShowMapSwitch ? 'cursor-pointer' : '']"
                    @click="isShowMapSwitch ? mapMunicipalHighlight(item.DepartmentId) : ''"
                  >
                    <v-icon size="16" class="icon-government municipalitiesIcon" />
                  </div>
                </v-col>
                <v-col cols="10" sm="10" lg="10" md="8" xl="10">
                  <v-hover v-slot="{ hover }">
                    <h4 class="pt-1">
                      <a
                        :class="[
                          !theme.dark ? 'text-hyperlink' : 'text-white',
                          hover ? 'text-decoration-underline' : 'text-decoration-none'
                        ]"
                        class="text-capitalize"
                        @click="municipalInfo(item, $event)"
                        >{{ item.Name ? item.Name.toLowerCase() : '' }}</a
                      >
                    </h4>
                  </v-hover>
                </v-col>
              </v-row>
            </v-col>
          </td>
          <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-center pa-1">
            {{ item.Employees }}
          </td>
          <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-center pa-1 text-capitalize">
            {{ item.City ? item.City.toLowerCase() : '' }}
          </td>
          <td v-if="$vuetify?.breakpoint?.mdAndUp" class="text-center pa-1 text-capitalize">
            {{ item.State ? item.State : '' }}
          </td>
          <td class="text-center pa-1">
            <v-row class="justify-center">
              <v-col cols="6" xs="6" class="flex_none">
                <v-btn
                  icon
                  :color="!theme.dark ? 'hyperlink' : ''"
                  variant="text"
                  @click.stop="
                    ;[$set(closeReportPopUp, item.DepartmentId, true), (optionsSeinpNO = item.DepartmentId), (optionsItem = item)]
                  "
                >
                  <v-icon size="21" class="icon-action" />
                </v-btn>
              </v-col>
              <v-col cols="6" xs="6" class="flex_none">
                <PlanStar :key="componentBookmarkKey" :municipal-id="item.DepartmentId" from="TAL" />
              </v-col>
            </v-row>
            <v-dialog
              :key="item.DepartmentId"
              v-model="closeReportPopUp[item.DepartmentId]"
              :scrollable="false"
              max-width="max-content"
              content-class="elevation-3"
            >
              <v-card>
                <v-card-title mt-2 mb-2 class="pt-2 pb-2">
                  <v-col cols="12" xs="12" class="text-left">
                    <v-row>
                      <v-col cols="11" xs="11" class="text-left">
                        <h3>Actions</h3>
                      </v-col>
                      <v-col cols="1" xs="1" class="text-right align-self">
                        <v-icon
                          class="cursor-pointer"
                          :class="theme.dark ? '' : 'text-accent'"
                          @click="$set(closeReportPopUp, item.DepartmentId, false)"
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
                        :disabled="true"
                        size="x-large"
                        :color="!theme.dark ? 'hyperlink text-white' : ''"
                      >
                        {{ `Open Account ( ${item.Name ? item.Name.toLowerCase() : ''} )` }}
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </template>
    </v-data-table-server>
    <Observer @intersect="intersected" />
  </v-col>
</template>

<script>
import { ref, inject, onMounted, getCurrentInstance, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import PlanStar from '@/components/TAL/PlanStar'
import Observer from '@/components/Observer'
export default {
  components: {
    PlanStar,
    Observer
  },
  props: ['isShowMapSwitch', 'mapFinderInfo', 'isShowStarred'],
  setup(props) {
    const eventBus = inject('eventBus')
    const theme = useTheme()
    const router = useRouter()
    const route = useRoute()
    const instance = getCurrentInstance()
    const store = instance.appContext.config.globalProperties.$store
    const $vuetify = instance.appContext.config.globalProperties.$vuetify
    const closeReportPopUp = ref({})
    const pagination = ref({
      sortBy: [],
      itemsPerPage: 50
    })
    const headerList = ref([
      {
        text: 'Name',
        value: 'Name',
        align: 'start',
        width: '30%',
        class: 'sticky-header',
        sortable: false
      },
      {
        text: 'Employees',
        value: 'Employees',
        align: 'center',
        width: '15%',
        class: 'hidden-sm-and-down sticky-header',
        sortable: false
      },
      {
        text: 'City',
        value: 'City',
        width: '20%',
        align: 'center',
        class: 'hidden-sm-and-down sticky-header',
        sortable: false
      },
      {
        text: 'State',
        value: 'State',
        width: '20%',
        align: 'center',
        sortable: false,
        class: 'hidden-sm-and-down sticky-header'
      },
      {
        text: 'Actions',
        value: '',
        width: '15%',
        align: 'center',
        sortable: false,
        class: 'pa-1 sticky-header'
      }
    ])
    const municipalList = ref([])
    const zipcode = ref(store.state.finderList.zipcode)
    const radius = ref(store.state.finderList.searchRadius)
    const actionList = ref([
      {
        text: 'Open Account',
        value: 'OpenAccount'
      }
    ])
    const mapSelectedMunicipal = ref('')
    const selectedRowPadding = ref('')
    const rowcolor = ref('')
    const componentBookmarkKey = ref(0)
    const totalMunicipalPlans = ref(-1)
    watch(
      () => store.state.finderList.municipalData,
      () => {
        municipalList.value = store.state.finderList.municipalData
        zipcode.value = store.state.finderList.zipcode
        radius.value = store.state.finderList.searchRadius
        totalMunicipalPlans.value = municipalList.value && municipalList.value.length > 0 ? municipalList.value.length : -1
      },
      { deep: true, immediate: true }
    )
    onMounted(() => {
      eventBus.on('refreshBookMark', () => {
        componentBookmarkKey.value += 1
      })
    })
    onBeforeUnmount(() => {
      eventBus.off('refreshBookMark')
    })
    const intersected = async () => {
      eventBus.emit('callMunicipalApi')
    }
    const applyMunicipalFilter = () => {
      eventBus.emit('applyMunicipalFilteredData')
    }
    const municipalInfo = (item) => {
      store.state.finderList.prospectValue = 2
      router.push({
        query: {
          Id: item.DepartmentId,
          zipcode: item.Zip,
          radius: radius.value,
          name: item.Name
        },
        name: 'MunicipalDetail',
        params: {
          lastRoute: route.path
        }
      })
    }
    const mapMunicipalHighlight = (municipalId) => {
      props.mapFinderInfo.highlightMunicipalMarker(municipalId)
    }
    return {
      closeReportPopUp,
      pagination,
      headerList,
      actionList,
      mapSelectedMunicipal,
      selectedRowPadding,
      rowcolor,
      intersected,
      applyMunicipalFilter,
      municipalInfo,
      mapMunicipalHighlight,
      store,
      $vuetify,
      theme,
      router,
      municipalList,
      componentBookmarkKey
    }
  }
}
</script>
<style scoped>
.v-data-table.showMap :deep(.sticky-header) {
  position: sticky;
  top: -15px !important;
  z-index: 2;
}

.v-data-table.hideMap :deep(.sticky-header) {
  position: sticky;
  top: var(--toolbarHeight) !important;
  z-index: 2;
}

.v-data-table.showMap :deep(.v-data-table__wrapper),
.v-data-table.hideMap :deep(.v-data-table__wrapper) {
  overflow: unset;
}
</style>
