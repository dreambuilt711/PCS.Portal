import 'core-js'
import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { vuetify } from './plugins/vuetify'
import axiosPlugin from './plugins/axios'
import i18n from './i18n'
import { AppInsightsPlugin } from 'vue3-application-insights'
import VueGtag from 'vue-gtag'
import VueScrollTo from 'vue-scrollto'
import Vue3Toastify, { toast } from 'vue3-toastify'
import IdleVue from 'idle-vue'
import 'vue3-toastify/dist/index.css'
import VueDragscroll from 'vue-dragscroll'
import authz from './authz'
import mitt from 'mitt'
import Inputmask from 'inputmask'

const emitter = mitt()
const app = createApp(App)

app.use(store)
app.use(Vue3Toastify, {
  position: toast.POSITION.TOP_CENTER,
  transition: toast.TRANSITIONS.FLIP
})
app.use(VueDragscroll)
app.use(axiosPlugin)
app.use(IdleVue, {
  eventEmitter: {
    $on: (...args) => emitter.on(...args),
    $all: (...args) => emitter.all(...args),
    $off: (...args) => emitter.off(...args),
    $emit: (...args) => emitter.emit(...args)
  },
  events: ['keydown', 'mousedown', 'touchstart'],
  idleTime: 900000 // 18 min idle session alert
})

app.use(
  VueGtag,
  {
    config: { id: window.__env.googleAnalyticsKey }
  },
  router
)

app.use(VueScrollTo, {
  container: 'body',
  duration: 1000,
  easing: 'ease',
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
})

app.use(AppInsightsPlugin, {
  instrumentationKey: window.__env.insightsKey,
  router,
  trackAppErrors: true
})

app.directive('input-mask', {
  mounted(el, binding) {
    const inputs = el.getElementsByTagName('INPUT')
    const input = inputs.length > 1 ? inputs[inputs.length - 1] : inputs[0]
    new Inputmask(binding.value).mask(input)
  }
})

app.directive('click-input-outside', {
  mounted(el, binding, vNode) {
    if (typeof binding.value !== 'function') {
      const compName = vNode.component ? vNode.component.name : undefined
      let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
      if (compName) {
        warn += ` Found in component '${compName}'`
      }
      // eslint-disable-next-line no-console
      console.warn(warn)
    }
    const bubble = binding.modifiers.bubble
    const handler = (e) => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = handler
    document.addEventListener('click', handler)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__vueClickOutside__)
    el.__vueClickOutside__ = null
  }
})

Object.compare = (a, b) => {
  let s = (o) =>
    Object.entries(o)
      .sort()
      .map((i) => {
        if (i[1] instanceof Object) i[1] = s(i[1])
        return i
      })
  return JSON.stringify(s(a)) === JSON.stringify(s(b))
}

app.provide('eventBus', emitter)
app.provide('toast', toast)

app.config.globalProperties.$authz = authz
app.config.globalProperties.window = window
app.config.globalProperties.$store = store // Add Vuex $store globally
app.config.globalProperties.$toast = toast
// Async initialization
async function initializeApp() {
  try {
    await store.dispatch('getUser')
    await store.dispatch('getDisclosure')
    await store.dispatch('getIsImpersonating')
    await store.dispatch('getSitePreferences')
    await store.dispatch('getDefaultBranding').then(() => {
      app.use(router)
      app.use(i18n)
      app.use(vuetify)
      app
        .use({
          setup() {
            const logoutTimerId = ref(null)
            function onIdle() {
              toast.warning('Your session will soon timeout due to inactivity.', {
                autoClose: false,
                toastClassName: 'toast-inactive',
                hideProgressBar: true
              })
              logoutTimerId.value = setTimeout(
                () => window.location.assign('/signout'),
                120000 // 2 min grace to allow for session activity
              )
            }
            function onActive() {
              if (logoutTimerId.value != null) {
                clearTimeout(logoutTimerId)
                logoutTimerId.value = null
                toast.clearAll()
              }
            }
            return {
              logoutTimerId,
              onIdle,
              onActive
            }
          }
        })
        .mount('#app')
    })
    // Add other store dispatches as needed
  } catch (error) {
    // Handle initialization error
  }
}

initializeApp()
