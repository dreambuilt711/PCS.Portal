import axios from 'axios'

// Full config:  https://github.com/axios/axios#request-config
let config = {}

const _axios = axios.create(config)
_axios.defaults.headers.common['Pragma'] = 'no-cache'

// compare app version from health endpoint and force reload if different
_axios.get(`/api/v1/health`).then((success) => {
  if (!success || !success.data || !success.data.appVersion || success.data.appVersion !== window.__env.appVersion)
    window.location.assign('/')
})

_axios.defaults.headers.common['X-App-Version'] = window.__env.appVersion
_axios.defaults.headers.common['X-App-Slot'] = window.__env.appSlot

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      // Reloading the page will pull down index.html, which will prompt user for login
      window.location.reload(true)
    } else if (error.response.status === 403) {
      // TODO: Uncomment once error page has been implemented
      //window.location.href = '/error'
    }
    return Promise.reject(error)
  }
)

export default {
  install: (app) => {
    app.config.globalProperties.$axios = axios
  }
}
