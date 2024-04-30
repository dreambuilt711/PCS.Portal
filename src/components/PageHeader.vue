<template>
  <v-system-bar
    name="systembar"
    v-if="$store.state.isImpersonating"
    color="systemBar"
    :height="isXsOnly ? '44px' : '24px'"
    order="0"
  >
    <v-row class="justify-center">
      <CustomIcon type="Impersonate" />
      <h4 class="ml-2 text-secondary">
        You are impersonating
        <span class="font-weight-medium">{{ userDisplayName }}</span>
      </h4>
      <h4
        class="ml-3 text-secondary text-uppercase text-decoration-underline handcursor font-weight-medium"
        @click="endImpersonation"
      >
        Exit View
      </h4>
    </v-row>
  </v-system-bar>
  <v-navigation-drawer
    v-if="
      currentRoute != 'Program' &&
      currentRoute != 'Disclosure' &&
      !isMdAndUp &&
      (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant')
    "
    id="sidemenu"
    :model-value="drawer"
    width="100%"
    :scrim="false"
    order="1"
    :temporary="true"
    :floating="true"
    location="left"
  >
    <v-list class="pa-0 text-center" density="compact" width="100%" nav>
      <v-list-item v-for="item in applicationsMenu" :key="`${item.title}_menu`" :to="item.href" ripple @click="resetStore()">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar name="toolbar" v-mutate="onMutate" :height="60" class="header elevation-3" extended extension-height="8">
    <div
      v-if="
        currentRoute != 'Program' &&
        currentRoute != 'Disclosure' &&
        !isMdAndUp &&
        (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant')
      "
      :class="[isMdAndUp ? 'pl-3 pr-3' : '']"
      class="flex_none"
    >
      <v-btn variant="text" :ripple="false" class="ma-1" @click.stop="toggleMenu(), resetStore()">
        <v-icon size="28" color="accent" icon="fa:icon-menu" />
      </v-btn>
    </div>
    <v-col lg="2" xl="2" @click="resetStore()">
      <router-link to="/" v-if="isSmAndUp && companyLogoImg">
        <v-img
          :src="companyLogoImg ? (currentRoute === 'ParticipantMPAA' ? contentURL : companyLogoImg) : ''"
          class="logo img-fluid"
          alt="logo"
          cover
          max-height="60"
        />
      </router-link>
    </v-col>
    <v-col v-if="currentRoute == 'Program' && !isSmAndUp" lg="2" xl="2" cols="8" class="flex_none mr-3" @click="resetStore()">
      <router-link to="/">
        <v-img
          :src="companyLogoImg ? (currentRoute === 'ParticipantMPAA' ? contentURL : companyLogoImg) : ''"
          class="logo img-fluid"
          alt="logo"
        />
      </router-link>
    </v-col>
    <v-spacer></v-spacer>
    <v-tabs
      v-if="
        isMdAndUp &&
        currentRoute !== 'Program' &&
        currentRoute !== 'Disclosure' &&
        (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant')
      "
      v-model="activeTab"
      align-tabs="center"
      height="60px"
      :hide-slider="true"
      class="headerMenu"
    >
      <v-tab
        v-for="item in applicationsMenu"
        :key="item.title"
        :to="item.href"
        height="45px"
        @click="resetStore()"
        :class="
          item.title === routeParentName
            ? darkModeSwitch
              ? 'v-tab--active bg-white text-black'
              : 'v-tab--active bg-accent text-white'
            : ''
        "
        :selected-class="item.title === routeParentName ? (darkModeSwitch ? 'bg-white text-black' : 'bg-accent text-white') : ''"
      >
        {{ item.title }}
      </v-tab>
    </v-tabs>
    <v-spacer />
    <template v-slot:append>
      <div v-show="isMultiProgram && !$store.state.isImpersonating" class="toolbarMenuButton">
        <v-btn
          v-if="
            currentRoute != 'Program' &&
            currentRoute != 'Disclosure' &&
            (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant')
          "
          icon="fa:icon-program"
          variant="text"
          color="accent"
          @click="viewPrograms()"
        >
        </v-btn>
      </div>
      <div
        class="toolbarMenuButton"
        v-show="
          currentRoute != 'Program' &&
          currentRoute != 'Disclosure' &&
          (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant')
        "
      >
        <div
          class="align-self pl-3 pr-3"
          v-if="$store.state.user.reliusLoginId && $store.state.user.reliusSSO && $store.state.user.tsmsso"
        >
          <v-menu
            class="usermenu"
            transition="sllide-y-transition"
            content-class="menucontent"
            location="bottom"
            :close-on-back="true"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="!isSmAndDown"
                v-bind="props"
                color="accent"
                prepend-icon="fa:icon-new-window"
                variant="elevated"
                size="small"
              >
                Client Accounts
              </v-btn>
              <v-btn v-if="isSmAndDown" v-bind="props" icon="fa:icon-new-window" variant="text" color="accent"> </v-btn>
            </template>
            <v-list density="compact" class="usermenu pa-0">
              <template v-for="(item, index) in externalLinks">
                <v-list-item
                  :key="item.title + index"
                  v-if="item.enabled"
                  @click="redirectToExternalLink('NewWindow', item.type)"
                >
                  <v-list-item-title class="text-accent">
                    {{ item.title }}
                  </v-list-item-title>
                  <v-list-item-action>
                    <v-icon size="21" color="accent" icon="icon-new-window" />
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="item.title + index + 1" v-if="!(item + 1 === item.length) && item.enabled"></v-divider>
              </template>
            </v-list>
          </v-menu>
        </div>
        <div class="align-self pl-3 pr-3" v-else>
          <v-btn
            v-if="!isSmAndDown"
            color="accent"
            prepend-icon="fa:icon-new-window"
            variant="elevated"
            size="small"
            @click="
              $store.state.user.reliusLoginId && $store.state.user.reliusSSO
                ? redirectToExternalLink('NewWindow', externalLinks[0].type)
                : $store.state.user.tsmsso
                  ? redirectToExternalLink('NewWindow', externalLinks[1].type)
                  : ''
            "
          >
            Client Accounts
          </v-btn>
          <v-btn
            v-if="isSmAndDown"
            icon="fa:icon-new-window"
            variant="text"
            color="accent"
            @click="
              $store.state.user.reliusLoginId && $store.state.user.reliusSSO
                ? redirectToExternalLink('NewWindow', externalLinks[0].type)
                : $store.state.user.tsmsso
                  ? redirectToExternalLink('NewWindow', externalLinks[1].type)
                  : ''
            "
          >
          </v-btn>
        </div>
      </div>
      <div class="toolbarMenuButton">
        <v-menu
          v-model="userMenu"
          location="bottom"
          class="usermenu"
          transition="slide-y-transition"
          content-class="usermenucontent"
          :close-on-content-click="closeUserMenu"
          :close-on-back="true"
          offset="0"
        >
          <template #activator="{ props }">
            <v-btn
              v-if="!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant'"
              v-bind="props"
              :size="!isSmAndDown ? 'default' : 'small'"
              :class="!isSmAndDown ? 'pr-3 pl-3' : ''"
              class="usersidemenu"
              :height="!isSmAndDown ? '100%' : 'auto'"
            >
              <v-icon size="28" color="accent" class="pr-1" v-if="!$store.state.isImpersonating" icon="fa:icon-profile"></v-icon>
              <v-icon
                size="24"
                color="accent"
                class="pr-1"
                v-if="$store.state.isImpersonating"
                icon="fa:fas fa-user-secret"
              ></v-icon>
              <div cols="3" xs="3" class="flex_none">
                <v-icon size="21" color="accent" :icon="userMenu ? 'fa:icon-chevron-up' : 'fa:icon-chevron-down'" />
              </div>
            </v-btn>
          </template>
          <v-list class="usermenu">
            <template v-for="(opt, userOpt) in userOption">
              <v-list-item v-if="opt.enabled" :key="userOpt.title" ripple="ripple" :disabled="opt.disabled" @click="opt.click">
                <v-list-item-title :class="opt.disabled ? '' : 'text-accent'" class="v_list_item_title">
                  {{ opt.title }}
                </v-list-item-title>
                <template v-slot:append>
                  <v-list-item-action center v-if="opt.icon === 'switch'">
                    <v-switch v-model="darkModeSwitch" color="accent" hide-details />
                  </v-list-item-action>
                  <v-list-item-action center v-else>
                    <v-icon v-if="opt.icon === 'ExternalLink'" size="21" color="accent" class="icon-new-window" />
                    <v-icon v-else size="small" class="ml-1" color="accent">
                      {{ opt.icon }}
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider v-if="!(userOpt + 1 === userOption.length) && opt.enabled" :key="opt.title + '-divider'" class="bold" />
              <h5 v-if="userOpt + 1 === userOption.length" :key="opt.title + '-lastlogin'" class="pl-3 pb-2 text-grey">
                <div>Last Login</div>
                <div>{{ lastLogin }}</div>
              </h5>
            </template>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
  <v-banner v-if="displayBanner" id="banner" name="banner" color="grey-darken-4" class="fixedFilter">
    <v-col cols="12" xs="12" class="pa-0">
      <v-row>
        <h4 v-mutate="onMutate" class="text-secondary">
          <v-row>
            <b class="pr-1">{{ bannerPrefixValue }} </b>
            <div v-html="bannerTextValue" />
          </v-row>
        </h4>
      </v-row>
    </v-col>
  </v-banner>
  <Impersonation @openAddAdvisorPopup="openAddAdvisorPopup" />
  <NotificationBanner name="notificationBanner" :eager="true" fromPage="header" />
  <v-dialog v-model="showAddUser" persistent :eager="true" max-width="850px" class="elevation-3">
    <AddUserWidget @closeAdvisorWidget="closeAdvisorWidget" />
  </v-dialog>
</template>
<script>
import { ref, computed, onMounted, watch, getCurrentInstance, inject, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay, useTheme, useLayout } from 'vuetify'
import Impersonation from '@/components/Impersonation'
import CustomIcon from '@/components/CustomIcon'
import AddUserWidget from '@/components/AddUserWidget'
import NotificationBanner from '@/components/Home/NotificationBanner'

export default {
  name: 'PcsHeader',
  components: {
    Impersonation,
    CustomIcon,
    AddUserWidget,
    NotificationBanner
  },
  props: ['companyLogo', 'showBanner', 'bannerPrefix', 'bannerText'],
  emits: ['changeThemeMethod'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const $store = instance.appContext.config.globalProperties.$store
    const $authz = instance.appContext.config.globalProperties.$authz
    const $axios = instance.appContext.config.globalProperties.$axios
    const route = useRoute()
    const router = useRouter()
    const display = useDisplay()
    const theme = useTheme()
    const { getLayoutItem } = useLayout()
    const eventBus = inject('eventBus')
    const toast = inject('toast')
    const drawer = ref(false)
    const lastLogin = ref('')
    const userMenu = ref(false)
    const closeUserMenu = ref(true)
    const darkModeSwitch = ref($store.state.sitePreferences.darkModeEnabled)
    const showAddUser = ref(false)
    const activeTab = ref('')
    const contentURL = ref('')
    const isSmAndUp = ref(false)
    const isXsOnly = ref(false)
    const isSmAndDown = ref(true)
    const isMdAndUp = ref(false)
    const externalLinks = ref([
      {
        title: 'Group Plan Portal',
        type: 'reliusPlan',
        enabled: $store.state.user.reliusLoginId && $store.state.user.reliusSSO ? true : false
      },
      {
        title: 'Individual Plan Portal',
        type: 'tsm',
        enabled: $store.state.user.tsmsso ? true : false
      }
    ])
    const notificationBanner = ref(null)
    const displayBanner = ref(props.showBanner)
    const companyLogoImg = ref(props.companyLogo)
    const bannerPrefixValue = ref(props.bannerPrefix)
    const bannerTextValue = ref(props.bannerText)
    //computed
    const currentRoute = computed(() => {
      return route.name
    })
    const routeParentName = computed(() => {
      return route.meta.parentName
    })
    const showBrandTheme = computed(() => {
      if (
        currentRoute.value !== 'Program' &&
        currentRoute.value !== 'Disclosure' &&
        (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant')
      ) {
        if ($store.state.user.selectedProgram) {
          if ($store.state.user.selectedProgram.programName === $authz.program.Axos) {
            return $authz.userRole() === $authz.roles.SiteAdmin
          } else {
            if (
              $authz.hasRole($authz.roles.SiteAdmin) ||
              $authz.hasRole($authz.roles.ProgramAdmin) ||
              $authz.hasRole($authz.roles.InternalAdmin)
            ) {
              return $authz.hasPermission($authz.permissionSet.Branding_Items__c, $authz.permission.Full)
            } else {
              return (
                $authz.allowedByProgram(
                  $authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c,
                  $authz.permission.Full
                ) && $authz.hasPermission($authz.permissionSet.Branding_Items__c, $authz.permission.Full)
              )
            }
          }
        } else return false
      } else return false
    })
    const userDisplayName = computed(() => {
      return $store.state.user.name
    })
    const applicationsMenu = computed(() => {
      if ($store.state.menu.length > 0) {
        return $store.state.menu
      }
      return []
    })
    const userRole = computed(() => {
      return $authz.userRole()
    })
    const userOption = computed(() => {
      var userList = [
        {
          title: 'My Account',
          icon: 'ExternalLink',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {
            openProfile()
          },
          enabled:
            !$store.state.user.mobileAppSession &&
            currentRoute.value !== 'Program' &&
            currentRoute.value !== 'Disclosure' &&
            (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant'),
          disabled: disableAccountSetting.value
        },
        {
          title: 'Dark Theme',
          icon: 'switch',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {},
          enabled: !$store.state.user.mobileAppSession,
          disabled: disableAccountSetting.value
        },
        {
          title: 'Brand & Theme',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {
            navigateToPage('/Branding')
          },
          enabled: !$store.state.user.mobileAppSession && showBrandTheme.value,
          disabled: disableAccountSetting.value
        },
        {
          title: 'Report Options',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {
            navigateToPage('/Account/ReportOptions/Logo')
          },
          enabled:
            !$store.state.user.mobileAppSession &&
            currentRoute.value !== 'Program' &&
            currentRoute.value !== 'Disclosure' &&
            (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant'),
          disabled: disableAccountSetting.value
        },
        {
          title: 'Impersonation',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {
            openImpersonation()
          },
          enabled:
            currentRoute.value !== 'Program' &&
            currentRoute.value !== 'Disclosure' &&
            (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant') &&
            !$store.state.isImpersonating &&
            $authz.hasPermission($authz.permissionSet.Impersonation__c, $authz.permission.Full),
          disabled: disableAccountSetting.value
        },
        {
          title: 'Add Advisor (PCS only)',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {
            openAddAdvisorPopup()
          },
          enabled:
            $authz.hasPermission($authz.permissionSet.Add_User__c, $authz.permission.Full) &&
            $store.state.user.selectedProgram.programId === $authz.programId.PCS,
          disabled: false
        },
        {
          title: 'Notifications',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {
            openNotification()
          },
          enabled:
            !$store.state.user.mobileAppSession &&
            currentRoute.value !== 'Program' &&
            currentRoute.value !== 'Disclosure' &&
            (!$store.state.user.temporarySessionType || $store.state.user.temporarySessionType !== 'Participant') &&
            $store.state.showNotification === true,
          disabled: false
        },
        {
          href: '#',
          title: 'Logout',
          // eslint-disable-next-line no-unused-vars
          click: (e) => {
            window.location.assign('/signout')
          },
          enabled: !$store.state.user.mobileAppSession,
          disabled: false
        }
      ]
      return userList
    })
    const isMultiProgram = computed(() => {
      var distinctPrograms = [...new Map($store.state.user.programs.map((item) => [item['programId'], item])).values()]
      if (distinctPrograms.length === 1) {
        var isAnyProgramBelongsAdminRole = distinctPrograms[0].roles.some(
          (a) =>
            a.roleName === $authz.roles.SiteAdmin ||
            a.roleName === $authz.roles.ProgramAdmin ||
            a.roleName === $authz.roles.InternalAdmin
        )
        var distinctAccounts = [...new Map(distinctPrograms[0].accounts.map((item) => [item['accountId'], item])).values()]
        var relationships = [...new Map(distinctPrograms[0].relationships.map((item) => [item['relationshipId'], item])).values()]
        if (isAnyProgramBelongsAdminRole) return false
        else if (distinctAccounts.length > 1 || relationships.length > 1) return true
        else return false
      } else if (distinctPrograms.length > 1) {
        return true
      } else return false
    })
    const disableAccountSetting = computed(() => {
      if (
        $authz.hasRole($authz.roles.Advisor) ||
        $authz.hasRole($authz.roles.Strategist) ||
        $authz.hasRole($authz.roles.Fiduciary338) ||
        $authz.hasRole($authz.roles.FirmAdmin) ||
        $authz.hasRole($authz.roles.AdvisorSupport) ||
        $authz.hasRole($authz.roles.ProgramAdmin)
      ) {
        return $store.state.user.tsmsso
      } else return false
    })
    //method
    function onMutate() {
      let height = 0
      let bannerHeight = 0
      let toolbarVal = {}
      let systembarVal = {}
      let bannerVal = {}
      const toolbar = getLayoutItem('toolbar')
      const systembar = getLayoutItem('systembar')
      const banner = getLayoutItem('banner')
      if (toolbar) toolbarVal = toolbar
      if (systembar) systembarVal = systembar
      if (banner) bannerVal = banner
      if (toolbarVal) {
        if ($store.state.isImpersonating) {
          height = toolbarVal?.size + systembarVal?.size
        } else {
          height = toolbarVal?.size
        }
        if (displayBanner.value) {
          bannerHeight = bannerVal?.size
        }
      }
      if (!height) height = 68
      if (!bannerHeight) bannerHeight = 0
      if (document.getElementById('banner')) document.getElementById('banner').style.top = `${height}px`
      if (document.getElementById('globalFilter'))
        document.getElementById('globalFilter').style.top = `${height + bannerHeight}px`
      document.documentElement.style.setProperty('--toolbarHeight', `${height + bannerHeight}px`)
    }
    function resetMenuDisplayState(expandActive) {
      var path = router.currentRoute.path
      applicationsMenu.value.forEach((m) => {
        var active = m.subMenus ? m.subMenus.some((sm) => sm.href === path) : false
        m.state = expandActive && (m.href === path || active)
      })
    }
    function redirectToExternalLink(target, href) {
      if (target !== 'NewWindow') return
      if (href === 'reliusPlan') {
        if ($store.state.isImpersonating) {
          toast.warning('Plan Portal SSO is unavailable when impersonating another user.', { autoClose: 5000 })

          return
        }
        onPopUpEvent(`/api/v1/retention/pcs401k/sso/initiate`, '_AccountLink')
      } else if (href === 'tsm') {
        onPopUpEvent(`/api/v1/retention/tsm/sso/initiate`, '_TSM')
      } else onPopUpEvent(href, '_ext')
    }
    function toggleMenu() {
      drawer.value = !drawer.value
    }
    function openImpersonation() {
      eventBus.emit('openImpersonationPopUp')
      closeUserMenu.value = true
    }
    function getLastLogin() {
      lastLogin.value = ''
      if ($store.state.user.loginHistory) {
        lastLogin.value = new Date(
          $store.state.user.loginHistory[$store.state.user.loginHistory.length > 1 ? 1 : 0]
        ).toLocaleString()
      }
    }
    function navigateToPage(value) {
      router.push(value)
      closeUserMenu.value = true
    }
    function openProfile() {
      //onPopUpEvent(`${window.__env.identityAuthority}/Manage`, '_pcsprofile')
      closeUserMenu.value = true
    }
    function changeToDarkMode() {
      theme.global.name.value = darkModeSwitch.value ? 'dark' : 'light'
      closeUserMenu.value = false
      if (!$store.state.sitePreferences) {
        $store.state.sitePreferences = {}
      }
      if ($store.state.sitePreferences.darkModeEnabled !== darkModeSwitch.value) {
        $store.state.sitePreferences.darkModeEnabled = darkModeSwitch
        $axios.post(`/api/v1/user/site/preferences`, $store.state.sitePreferences)
      }
    }
    function resetStore() {
      $store.state.finderList = {}
      $store.state.clientPlan = {}
      $store.state.marketInsight = {}
      $store.state.openAccountDetail = {}
    }
    function endImpersonation() {
      eventBus.emit('closeImpersonationPopUp')
    }
    function viewPrograms() {
      $store.state.user.programs.forEach((element) => {
        if (element.programId === $store.state.user.selectedProgram.programId) {
          element.selectedAccount = null
          element.selectedRelationship = null
        }
      })
      $store.state.user.selectedProgram = null
      emit('changeThemeMethod', false)
      router.push('/Program')
    }
    function openAddAdvisorPopup() {
      eventBus.emit('clearAddUser')
      showAddUser.value = true
      closeUserMenu.value = true
    }
    function getParticipantOpportunityDetails() {
      $axios.get(`/api/v1/sfdc/${route.params.id}/participant`).then((success) => {
        if (success.data.d && success.data.d.length > 0) {
          var participantURLandLTADetails = success.data.d ? success.data.d[0] : {}
          contentURL.value = participantURLandLTADetails.Web_Logo__c
        }
      })
    }
    function openNotification() {
      if ($store.state.user.reliusSSO) {
        if (notificationBanner.value) {
          notificationBanner.value.openNotification()
          closeUserMenu.value = true
        }
      }
    }
    function closeAdvisorWidget() {
      showAddUser.value = false
    }
    function onPopUpEvent(url, data) {
      if ($store.state.user.mobileAppSession) {
        if (url.indexOf('/download?reportName=') === -1) window.location = url
        else {
          $store.state.reportUri = url
          //this.$FModal.show({ component: PdfViewer, maxHeight: '98%', width: '98%', clickToClose: false }, { pdfUrl: url })
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
    //watch
    watchEffect(() => {
      isSmAndUp.value = display.smAndUp.value
      isXsOnly.value = display.xs.value
      isSmAndDown.value = display.smAndDown.value
      isMdAndUp.value = display.mdAndUp.value
    })
    watch(
      () => drawer.value,
      (val) => {
        resetMenuDisplayState(val)
      }
    )
    watch(
      () => darkModeSwitch.value,
      () => {
        changeToDarkMode()
      }
    )
    //mounted
    onMounted(() => {
      getLastLogin()
      onMutate()
      if (currentRoute.value === 'ParticipantMPAA') {
        getParticipantOpportunityDetails()
      }
    })

    return {
      $store,
      drawer,
      lastLogin,
      userMenu,
      closeUserMenu,
      darkModeSwitch,
      showAddUser,
      activeTab,
      contentURL,
      externalLinks,
      showBrandTheme,
      userDisplayName,
      applicationsMenu,
      userRole,
      userOption,
      isMultiProgram,
      disableAccountSetting,
      display,
      companyLogoImg,
      bannerPrefixValue,
      bannerTextValue,
      displayBanner,
      currentRoute,
      routeParentName,
      isSmAndUp,
      isXsOnly,
      isSmAndDown,
      isMdAndUp,
      getLayoutItem,
      toggleMenu,
      endImpersonation,
      resetStore,
      viewPrograms,
      redirectToExternalLink,
      onMutate,
      openAddAdvisorPopup,
      onPopUpEvent,
      closeAdvisorWidget
    }
  }
}
</script>
<style scoped>
.v_list_item_title {
  font-size: 12px !important;
}
</style>
