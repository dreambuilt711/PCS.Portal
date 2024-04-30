<template>
  <div id="app">
    <v-app>
      <PageHeader
        @changeThemeMethod="changeThemes"
        :showBanner="showBanner"
        :bannerPrefix="bannerPrefix"
        :bannerText="bannerText"
        v-if="init"
      />
      <v-main :class="[backgroundClass, showBanner && isXsOnly ? 'mt-8' : '']" v-if="init">
        <div class="bgImageDark">
          <router-view v-slot="{ Component }">
            <v-slide-x-transition mode="out-in">
              <component :is="Component" />
            </v-slide-x-transition>
          </router-view>
        </div>
      </v-main>
      <PageFooter
        v-if="!$store.state.user.mobileAppSession && init"
        :copyright="copyright"
        :privacyPolicy="privacyPolicy"
        :linkedin="Linkedin"
        :twitter="Twitter"
        :facebook="Facebook"
        :legal="Legal"
        :phone="Phone"
      />
    </v-app>
  </div>
</template>

<script>
import PageHeader from './components/PageHeader'
import PageFooter from './components/PageFooter'
import { computed, ref, onMounted, watch, getCurrentInstance, watchEffect, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import { toast } from 'vue3-toastify'

export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter
  },
  setup() {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const route = useRoute()
    const theme = useTheme()
    const display = useDisplay()
    const init = ref(false)
    const showBanner = ref(false)
    const favicon = ref('')
    const copyright = ref('')
    const companyLogo = ref('')
    const privacyPolicy = ref('')
    const Facebook = ref('')
    const Linkedin = ref('')
    const Phone = ref('')
    const Twitter = ref('')
    const Legal = ref('')
    const fontsize = ref('10')
    const fontfamily = ref('')
    const isXsOnly = ref(false)
    const bannerPrefix = ref('')
    const bannerText = ref('')
    //computed
    const user = computed(() => {
      return $store.state.user
    })
    const currentRoute = computed(() => {
      return route.name
    })
    const backgroundClass = computed(() => {
      if (
        currentRoute.value === 'HomeAcquisition' ||
        currentRoute.value === 'HomeOnboarding' ||
        currentRoute.value === 'HomeClientManagement' ||
        currentRoute.value === 'HomeAdvisorSetup' ||
        currentRoute.value === 'HomeResourceCenter'
      )
        return 'backgroundImage'
      else if (currentRoute.value === 'Program') return 'backgroundImage_Program'
      else return 'portalBackground'
    })
    //function
    const isAdminLevelRole = () => {
      return $store.state.user.selectedProgram.roles.some(
        (a) => a.roleName === $authz.roles.SiteAdmin || a.roleName === $authz.roles.ProgramAdmin
      )
    }
    const isFirmLevelRole = () => {
      return $store.state.user.selectedProgram.roles.some((a) => a.roleName === $authz.roles.FirmAdmin)
    }
    const isAdvisorLevelRole = () => {
      return $store.state.user.selectedProgram.roles.some(
        (a) =>
          a.roleName === $authz.roles.Advisor ||
          a.roleName === $authz.roles.Strategist ||
          a.roleName === $authz.roles.Fiduciary338 ||
          a.roleName === $authz.roles.InternalAdmin
      )
    }
    function getBanner() {
      $axios
        .get(`/api/v1/banner`)
        .then((success) => {
          showBanner.value = success.data.showBanner
          bannerPrefix.value = success.data.bannerPrefix
          bannerText.value = success.data.bannerText
        })
        .catch(() => {
          showBanner.value = false
        })
    }
    function changeThemes(val) {
      var selectedProgram = $store.state.user.selectedProgram
      if (val && currentRoute.value !== 'Program') {
        if (selectedProgram) {
          var isAdminRole = isAdminLevelRole()
          var isFirmRole = isFirmLevelRole()
          var isAdvisorRole = isAdvisorLevelRole()
          $store.state.theme = {}
          //for admin level role
          if ((selectedProgram.brand && isAdminRole) || (selectedProgram.brand && isFirmRole)) {
            applyProgramBrand(selectedProgram)
          }
          //for advisor or Strategist role
          else if (selectedProgram && isAdvisorRole) {
            if (selectedProgram.selectedAccount) {
              if (selectedProgram.selectedAccount.brand) {
                if (selectedProgram.selectedAccount.allow_Advisors_Firms_Upload_Brand__c === $authz.permission.Full)
                  applyFirmBrand(selectedProgram.selectedAccount)
                else applyProgramBrand(selectedProgram)
              } else {
                applyProgramBrand(selectedProgram)
              }
            } else {
              applyProgramBrand(selectedProgram)
            }
          }
          //default
          else {
            applyDefaultBrand()
          }
        } else {
          applyDefaultBrand()
        }
      } else {
        applyDefaultBrand()
      }
    }
    function applyProgramBrand(selectedProgram) {
      if (Object.keys(selectedProgram.brand ? selectedProgram.brand : {}).length > 0) apply(selectedProgram)
      else applyDefaultBrand()
    }
    function applyFirmBrand(selectedAccount) {
      if (Object.keys(selectedAccount.brand ? selectedAccount.brand : {}).length > 0) apply(selectedAccount)
      else applyDefaultBrand()
    }
    function apply(selected) {
      $store.state.theme.accentColors = [
        selected.brand.color1__c,
        selected.brand.color2__c,
        selected.brand.color3__c,
        selected.brand.color4__c
      ]
      theme.themes.value.light.colors.accent = selected.brand.color1__c ? selected.brand.color1__c : '#0077cc'
      theme.themes.value.light.colors.secondary = selected.brand.textColor1__c ? selected.brand.textColor1__c : '#FFFF'
      theme.themes.value.light.colors.portalBackground = selected.brand.background__c ? selected.brand.background__c : '#FFFF'
      theme.themes.value.light.colors.surface = selected.brand.surface__c ? selected.brand.surface__c : '#D3D3D30F'
      theme.themes.value.light.colors.hyperlink = selected.brand.link__c ? selected.brand.link__c : '#0000EE'
      theme.themes.value.light.colors.systemBar = selected.brand.color4__c ? selected.brand.color4__c : '#0000EE'
      theme.themes.value.dark.colors.accent = '#FFFFFF'
      theme.themes.value.dark.colors.secondary = '#FFFFFF'
      theme.themes.value.dark.colors.hyperlink = '#FFFFFF'
      fontsize.value = selected.brand.font_Size__c ? Number(selected.brand.font_Size__c) : 10
      fontfamily.value = selected.brand.font_Family__c
      companyLogo.value = selected.brand.web_Logo__c
      copyright.value = selected.copyright__c
      privacyPolicy.value = selected.privacy_Policy__c
      Facebook.value = selected.facebook__c
      Linkedin.value = selected.linkedin__c
      Phone.value = selected.advisor_Phone_Number__c
      Twitter.value = selected.twitter__c
      Legal.value = selected.legal_Policy__c
      provide('fontsize', fontsize.value)
      provide('selectedBrand', selected)
      document.documentElement.style.setProperty('--fontSize', `${fontsize.value}px`)
      document.documentElement.style.setProperty('--fontFamily', `${fontfamily.value}, sans-serif`)
      if (favicon) {
        var favicon = document.getElementById('favicon')
        var faviconShortcut = document.getElementById('faviconshortcut')
        favicon.href = favicon ? favicon : '/pcslogo.png'
        faviconShortcut.href = favicon ? favicon : '/pcslogo.png'
      }
    }
    function applyDefaultBrand() {
      if (Object.keys($store.state.defaultProgram).length === 0) {
        $axios
          .get('/api/v1/program')
          .then((success) => {
            if (success.data) {
              var defaultProgram = success.data
              $store.state.defaultProgram = defaultProgram
              apply(defaultProgram)
            }
          })
          .catch(() => {
            //just for backup if API failed
            $store.state.theme.accentColors = ['#2C305D', '#B35757', '#4EA569', '#2E6AC7']
            fontsize.value = 10
            fontfamily.value = 'Roboto'
            theme.themes.value.light.colors.accent = '#0077cc'
            theme.themes.value.light.colors.portalBackground = '#FFFFFF'
            theme.themes.value.light.colors.surface = '#FFFFFF'
            theme.themes.value.light.colors.hyperlink = '#0077cc'
            theme.themes.value.light.colors.systemBar = '#0000EE'
            theme.themes.value.dark.colors.accent = '#FFFFFF'
            theme.themes.value.dark.colors.secondary = '#FFFFFF'
            theme.themes.value.dark.colors.hyperlink = '#FFFFFF'
            document.documentElement.style.setProperty('--fontSize', `${fontsize.value}px`)
            document.documentElement.style.setProperty('--fontFamily', `${fontfamily.value}, sans-serif`)
            companyLogo.value = ''
            Facebook.value = ''
            Linkedin.value = ''
            Twitter.value = ''
            Legal.value = ''
            Phone.value = ''
            privacyPolicy.value = ''
            copyright.value = ''
          })
      } else {
        var defaultProgram = $store.state.defaultProgram
        apply(defaultProgram)
      }
    }
    //mounted
    onMounted(() => {
      if ($store.state.sitePreferences && $store.state.sitePreferences.darkModeEnabled) {
        let darkModeEnabled = $store.state.sitePreferences.darkModeEnabled
        theme.global.name.value = darkModeEnabled ? 'dark' : 'light'
      }
      changeThemes(true)
      init.value = true
      if (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant') {
        if (!$store.state.user || !$store.state.user.selectedProgram) return

        $store.dispatch('getMenu').then(() => {
          $store.dispatch('getAdvisorExportDetail')
          $store.dispatch('getStarredPlans').then(() => {
            $store.dispatch('getStarredRbcPlans')
          })
        })
        getBanner()
      }
    })
    //watch
    watch(route, (to, from) => {
      if (to.path !== from.path) toast.clearAll()
    })
    watch(
      favicon,
      (val) => {
        var favicon = document.getElementById('favicon')
        var faviconShortcut = document.getElementById('faviconshortcut')
        favicon.href = val ? val : '/pcslogo.png'
        faviconShortcut.href = val ? val : '/pcslogo.png'
      },
      { deep: true }
    )
    watchEffect(() => {
      isXsOnly.value = display.xs.value
    })

    return {
      copyright,
      companyLogo,
      privacyPolicy,
      Facebook,
      Linkedin,
      Phone,
      Twitter,
      Legal,
      fontsize,
      fontfamily,
      bannerPrefix,
      bannerText,
      user,
      backgroundClass,
      init,
      isXsOnly,
      showBanner,
      changeThemes,
      theme
    }
  }
}
</script>
<style>
@import '../src/css/main.css';
@import '../src/css/style.css';
</style>
<style>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.theme--light.v-sheet {
  background-color: rgb(var(--v-theme-surface));
  border-color: rgb(var(--v-theme-surface));
}
</style>
<style lang="scss">
$body-font-family: var(--fontFamily);
$font-size-root: var(--fontSize);

body,
html,
.v-application {
  font-family: $body-font-family, sans-serif !important;
  font-size: $font-size-root !important;
}
</style>
