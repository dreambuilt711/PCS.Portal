<template>
  <v-container :class="xsOnly ? 'pa-0' : 'pt-0 pb-2'" :fluid="!xsOnly">
    <v-col cols="12" class="pt-0 pb-0">
      <v-row class="justify-space-around">
        <v-col id="scrollUps" cols="12" md="12" :class="['pt-8 pb-2 pl-2 pr-2']">
          <v-col cols="12" :class="xsOnly ? 'pb-1 pt-0 pl-0 pr-0' : 'pa-0'">
            <v-row>
              <v-col v-if="false" :cols="mdAndUp ? '8' : '12'" class="pa-0">
                <span
                  v-if="breadCrumb.parentName"
                  class="text-capitalize font_12 cursor-pointer text-hyperlink"
                  @click="navigate()"
                  >{{ breadCrumb.parentName }}</span
                >
                <v-icon size="12" color="hyperlink" class="icon-chevron-right ml-1 mr-1" />
                <span v-if="breadCrumb.parentName" class="text-capitalize font_12 text-hyperlink">{{ breadCrumb.pageName }}</span>
              </v-col>
              <v-col cols="12" class="pl-0 pt-1 pr-0 pb-0">
                <h1>Resource Center</h1>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pb-0 pl-0 pr-0">
            <v-tabs v-model="activeTab" class="notificationMenu" color="accent" height="30px" slider-size="3">
              <v-tab v-for="(item, index) in resourceList" :key="index">
                <span>{{ item ? item : '' }}</span>
              </v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
              <v-window-item transition="fade-in">
                <DocumentLibrary />
              </v-window-item>
              <v-window-item transition="fade-in">
                <CommunicationCenter />
              </v-window-item>
            </v-window>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
import DocumentLibrary from '@/components/Account/DocumentLibrary'
import CommunicationCenter from '@/components/Account/CommunicationCenter'
import { ref, watchEffect, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
export default {
  components: {
    DocumentLibrary,
    CommunicationCenter
  },
  setup() {
    const display = useDisplay()
    const route = useRoute()
    const router = useRouter()
    const resourceList = ref(['Documents Library', 'Communication Center'])
    const activeTab = ref(0)
    const xsOnly = ref(false)
    const mdAndUp = ref(false)
    //watch
    watchEffect(() => {
      xsOnly.value = display.xs.value
      mdAndUp.value = display.mdAndUp.value
    })
    //computed
    const breadCrumb = computed(() => {
      return route.meta
    })
    function navigate() {
      router.push('/Home/ResourceCenter').catch(() => {})
    }

    return {
      resourceList,
      activeTab,
      xsOnly,
      mdAndUp,
      breadCrumb,
      navigate
    }
  }
}
</script>
