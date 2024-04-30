<template>
  <v-container :fluid="true" class="pl-4 pr-4">
    <v-col cols="12" class="pa-0">
      <v-row>
        <v-col cols="12" sm="5" xl="4" class="pa-0">
          <v-text-field
            ref="wildCardSearch"
            v-model="searchText"
            density="compact"
            variant="outlined"
            clearable
            placeholder="Search for...."
            :hide-details="xsOnly"
            @update:model-value="searchDocument()"
          >
            <template #append-inner>
              <v-icon size="21" color="hyperlink" class="icon-search cursor-pointer" @click="searchDocument()" />
              <v-icon size="13" color="hyperlink" class="ml-1 width_10 cursor-pointer" icon="fa:fas fa-caret-left"></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="7" xl="8" class="pa-0">
          <v-row justify="end" class="text-end">
            <div class="flex_none pa-0">
              <v-btn
                variant="text"
                :disabled="selected && selected.length === 0"
                color="accent"
                class="text-white mr-0 pr-0"
                @click="downloadSelected()"
              >
                <v-icon start size="21" color="accent"> mdi mdi-arrow-down-box </v-icon> Download Selected
              </v-btn>
            </div>
            <div class="flex_none pa-0" v-if="false">
              <v-btn variant="text" :disabled="selected && selected.length === 0" color="accent" class="text-white">
                <v-icon start size="21" color="accent"> mdi mdi-email </v-icon> Email Selected
              </v-btn>
            </div>
            <div class="flex_none pa-0" v-if="false">
              <v-btn
                variant="text"
                color="accent"
                class="text-white text-none"
                :class="gallery ? 'mr-0 ' : 'mr-0 pr-0'"
                @click="gallery = !gallery"
              >
                <v-icon start size="21" color="accent" :class="gallery ? 'icon-view-list' : 'icon-program'" />{{
                  gallery ? 'View as a list' : 'View as a gallery'
                }}
              </v-btn>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="!gallery" cols="12" class="pa-0">
      <v-data-table
        v-model="selected"
        :headers="header"
        :items="documentList"
        item-value="ContentDocumentId"
        :class="['elevation-3 mb-0', 'changecheckbox']"
        mobile-breakpoint="0"
        style="backface-visibility: hidden"
        :loading="loading"
        return-object
        show-select
      >
        <template v-slot:item.Name="{ item }">
          <div v-if="item.Name">
            <a class="text-hyperlink font_14 cursor-default" @click="downloadDocument(item)">{{ item.Name }}</a>
          </div>
        </template>
        <template v-slot:item.Action="{ item }">
          <div class="flex_none">
            <PlanStar :key="componentKey" :seinpno="item.ContentDocumentId" from="ResourceCenter" type="DocumentList" />
          </div>
        </template>
      </v-data-table>
    </v-col>
    <v-col v-if="gallery" cols="12" class="pa-0">
      <v-card :class="[smAndDown ? 'elevation-0' : 'elevation-3']">
        <v-row class="pl-8 pr-8 pt-6 pb-6">
          <v-col v-for="(item, index) in documentList" :key="index" class="xl2 md4 sm5 xs11 lg2 mt-3 mb-3 ml-5 mr-5">
            <v-row>
              <v-card class="elevation-2 fill-height" height="250">
                <v-col class="text-center pa-4">
                  <v-row class="ml-9 mr-9">
                    <v-col cols="12" class="text-center pt-3">
                      <CustomIcon :type="item.icon" />
                    </v-col>
                    <v-col cols="12" class="text-center pt-3">
                      <h3 class="font-weight-medium">
                        {{ item.Name }}
                      </h3>
                    </v-col>
                    <v-col cols="12" class="text-center pt-3">
                      <h3 class="font-weight-normal">
                        {{ item.Description }}
                      </h3>
                    </v-col>
                    <v-col cols="12" class="text-center pt-3 buttonPosition">
                      <v-row class="justify-center">
                        <v-btn variant="text" class="text-none" color="hyperlink" @click="favoriteDocument()">
                          <v-icon
                            start
                            size="21"
                            class="cursor-pointer icon-bookmark"
                            :color="isStarred ? '#119944' : '#99CCEE'"
                          />
                          Save as favorite
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-container>
</template>
<script>
import PlanStar from '@/components/TAL/PlanStar'
import CustomIcon from '@/components/CustomIcon'
import { ref, watchEffect, getCurrentInstance, onMounted, inject } from 'vue'
import { useDisplay } from 'vuetify'
export default {
  components: {
    PlanStar,
    CustomIcon
  },
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $axios = instance.appContext.config.globalProperties.$axios
    const display = useDisplay()
    const xsOnly = ref(false)
    const mdAndUp = ref(false)
    const smAndDown = ref(false)
    const searchText = ref('')
    const selected = ref([])
    const componentKey = ref(0)
    const gallery = ref(false)
    const header = ref([
      {
        title: 'Name',
        align: 'start',
        sortable: false,
        key: 'Name'
      },
      {
        title: 'Description',
        align: 'start d-none d-sm-table-cell',
        sortable: false,
        key: 'Description'
      },
      {
        title: 'Type',
        align: 'start d-none d-sm-table-cell',
        sortable: false,
        key: 'Type'
      },
      {
        title: 'Last Activity',
        align: 'start d-none d-sm-table-cell',
        sortable: false,
        key: 'LastActivity'
      },
      {
        title: 'Save as Favorite',
        align: 'start',
        sortable: false,
        key: 'Action'
      }
    ])
    const documentList = ref([])
    const documentCard = ref([
      {
        icon: 'retirementSaving',
        name: 'Give your retirement savings a boost',
        description: 'For participant rates below 30%'
      },
      {
        icon: 'rightJoin',
        name: 'Money maker - meet your employer match',
        description: 'For participants not meeting employer match'
      },
      {
        icon: 'moneyMarket',
        name: 'Money maker - meet your employer match',
        description: 'For participants not meeting employer match'
      }
    ])
    const loading = ref(false)
    const documents = ref([])
    const toast = inject('toast')
    //watch
    watchEffect(() => {
      xsOnly.value = display.xs.value
      mdAndUp.value = display.mdAndUp.value
      smAndDown.value = display.smAndDown.value
    })
    //mounted
    onMounted(() => {
      $store.dispatch('getStarredResource')
      getDocument()
    })
    function getDocument() {
      loading.value = true
      $axios
        .get(`/api/v1/sfdc/document/resourcecenter`)
        .then((success) => {
          documentList.value = success.data && success.data.length > 0 ? success.data : []
          documents.value = documentList
          loading.value = false
        })
        .catch(() => {
          loading.value = false
        })
    }
    function downloadDocument(val) {
      if (val && val.LinkedEntityId && val.ContentDocumentId) {
        onPopUpEvent(`/api/v1/sfdc/resourcecenter/${val.LinkedEntityId}/${val.ContentDocumentId}/document`)
      }
    }
    function downloadSelected() {
      if (selected.value && selected.value.length > 0) {
        selected.value.forEach((element) => {
          if (element && element.LinkedEntityId && element.ContentDocumentId) {
            onPopUpEvent(`/api/v1/sfdc/resourcecenter/${element.LinkedEntityId}/${element.ContentDocumentId}/document`)
          }
        })
      }
    }
    function searchDocument() {
      if (searchText.value) {
        documentList.value = documents.value.filter((items) => items.Name.toLowerCase().includes(searchText.value.toLowerCase()))
      } else {
        documentList.value = documents
      }
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          //$FModal.show({ component: PdfViewer, maxHeight: '98%', width: '98%', clickToClose: false }, { pdfUrl: url })
        }
      } else {
        var windowUrl = window.open(url, data)
        if (!windowUrl || windowUrl.closed) {
          toast.warning('Enable popups and try again.<br/>Looks like popups are currently being blocked.', {
            dangerouslyHTMLString: true,
            autoClose: 5000
          })
        }
      }
    }
    return {
      searchText,
      selected,
      componentKey,
      gallery,
      header,
      documentList,
      documentCard,
      documents,
      loading,
      xsOnly,
      smAndDown,
      mdAndUp,
      getDocument,
      downloadDocument,
      downloadSelected,
      searchDocument,
      onPopUpEvent
    }
  }
}
</script>
<style scoped>
.buttonPosition {
  bottom: 5px;
  position: absolute;
}
</style>
