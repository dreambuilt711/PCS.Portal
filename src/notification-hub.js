/* eslint-disable no-console */
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { createApp } from 'vue'
import App from './App'
export default {
  install() {
    const connection = new HubConnectionBuilder().withUrl(`/hubs/notification`).configureLogging(LogLevel.Information).build()
    const app = createApp(App)
    const notificationHub = app

    // notification received signal
    connection.on('PushNotification', (notification) => {
      notificationHub.$emit('notification-received', notification)
    })

    // internal system messaging
    connection.on('PushSystemMessage', (msg) => {
      notificationHub.$emit('sys-msg-received', msg)
    })

    // register/unregister user signals
    notificationHub.registerUser = () => {
      return startedPromise.then(() => connection.invoke('RegisterUser')).catch(console.error)
    }
    notificationHub.unregisterUser = () => {
      return startedPromise.then(() => connection.invoke('UnregisterUser')).catch(console.error)
    }

    // switch platform signals
    notificationHub.platformActivated = (platformId) => {
      return startedPromise.then(() => connection.invoke('JoinPlatformGroup', platformId)).catch(console.error)
    }
    notificationHub.platformDeactivated = (platformId) => {
      return startedPromise.then(() => connection.invoke('LeavePlatformGroup', platformId)).catch(console.error)
    }
    app.config.globalProperties.$notificationHub = notificationHub

    // establish the connection
    let startedPromise = null
    // function start() {
    //   startedPromise = connection.start().catch(err => {
    //     if (err.statusCode === 401) return
    //     console.error('Failed to connect with hub', err)
    //     return new Promise((resolve, reject) =>
    //       setTimeout(
    //         () =>
    //           start()
    //             .then(resolve)
    //             .catch(reject),
    //         5000 // attempt to establish connection every 5 seconds
    //       )
    //     )
    //   })
    //   return startedPromise
    // }
    // connection.onclose(() => start()) // re-establish connection on close

    //start()
  }
}
