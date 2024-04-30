<template>
  <div>
    <div v-if="mapType === 'web'" id="myLeadMap" ref="mapVal" style="position: absolute !important" :class="fromPage"></div>
  </div>
</template>

<script>
import mapstyle from '@/assets/mapstyle.json'
import { ref, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
export default {
  props: [
    'showMap',
    'mapType',
    'planInfo',
    'lastMap',
    'clientPlanInfo',
    'prospectTab',
    'fromPage',
    'searchZipcode',
    'schoolDetailPage'
  ],
  setup(props, { root }) {
    const markers = ref([])
    const markers1 = ref([])
    const defaultMarker = ref([])
    const lastMapType = ref('roadmap')
    const latestZipCodeByMap = ref('')
    const map = ref(null)
    const timer = ref(null)
    const individualMarkers = ref([])
    const schoolMarker = ref([])
    const municipalMarkers = ref([])
    const churchMarkers = ref([])
    const taxExemptMarkers = ref([])
    const instance = getCurrentInstance()
    const theme = useTheme()
    const route = useRoute()
    const router = useRouter()
    const store = instance.appContext.config.globalProperties.$store
    const GoogleMap = async () => {
      markers.value = new Array()
      schoolMarker.value = new Array()
      individualMarkers.value = new Array()
      municipalMarkers.value = new Array()
      churchMarkers.value = new Array()
      taxExemptMarkers.value = new Array()
      clearTimeout(timer)
      let elementId = 'myLeadMap'
      let grayStyles
      if (!theme.dark) grayStyles = mapstyle.standard
      else grayStyles = mapstyle.dark
      var zoomLevel = 14
      if (store.state.finderList.searchRadius) {
        switch (store.state.finderList.searchRadius) {
          case 5:
            zoomLevel = 13
            break
          case 10:
            zoomLevel = 12
            break
          case 20:
            zoomLevel = 11
            break
          case 25:
            zoomLevel = 10
            break
          case 50:
            zoomLevel = 9
            break
          case 100:
            zoomLevel = 8
            break
          default:
            break
        }
      }
      if (props.fromPage === 'searchLead') zoomLevel = 11

      var mapOptions = {
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        styles: grayStyles,
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: true,
        zoomControl: false,
        rotateControl: false,
        // eslint-disable-next-line no-undef
        mapTypeId: 'roadmap',
        zoom: zoomLevel
      }
      lastMapType.value = 'roadmap'
      // eslint-disable-next-line no-undef
      map.value = new google.maps.Map(document.getElementById(elementId), mapOptions)
      var zoomControlDiv = document.createElement('div')
      ZoomControl(zoomControlDiv, map)
      zoomControlDiv.index = 1
      // eslint-disable-next-line no-undef
      map.value.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv)
      if (props.fromPage === 'searchLead') {
        const centerControlDiv = document.createElement('div')
        const centerControl = CenterButton(map)
        centerControl.index = 1
        // Append the control to the DIV.
        centerControlDiv.appendChild(centerControl)
        // eslint-disable-next-line no-undef
        map.value.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv)
      }
    }
    // await setCenterPin(this)

    const ZoomControl = (controlDiv, map) => {
      // Creating divs & styles for custom zoom control
      controlDiv.style.padding = '5px'

      // Set CSS for the control wrapper
      var controlWrapper = document.createElement('div')
      controlWrapper.className = 'zoomDiv'
      controlDiv.appendChild(controlWrapper)

      // Set CSS for the zoomIn
      var zoomInButton = document.createElement('div')
      zoomInButton.className = 'Zmbuttondiv'
      zoomInButton.innerHTML =
        '<i class="fa fa-plus text-hyperlink" style="font-size: 14px;padding: 7px;font-weight: 700;background:white"></i>'
      controlWrapper.appendChild(zoomInButton)

      // Set CSS for the zoomOut
      var zoomOutButton = document.createElement('div')
      zoomInButton.className = 'Zmbuttondiv'
      zoomOutButton.innerHTML =
        '<i class="fa fa-minus text-hyperlink" style="font-size: 14px;padding: 7px;font-weight: 700;border-top: solid lightgrey 1px;background:white;"></i>'
      controlWrapper.appendChild(zoomOutButton)

      // Setup the click event listener - zoomIn
      // eslint-disable-next-line no-undef
      google.maps.event.addDomListener(zoomInButton, 'click', function () {
        map.value.setZoom(map.value.getZoom() + 1)
      })

      // Setup the click event listener - zoomOut
      // eslint-disable-next-line no-undef
      google.maps.event.addDomListener(zoomOutButton, 'click', function () {
        map.value.setZoom(map.value.getZoom() - 1)
      })
    }
    const CenterButton = (map) => {
      const controlButton = document.createElement('button')
      // Set CSS for the control.
      controlButton.style.backgroundColor = theme.dark ? '#272727' : '#fff'
      controlButton.style.border = theme.dark ? '2px solid #272727' : '2px solid #fff'
      controlButton.style.borderRadius = '5px'
      controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)'
      // controlButton.style.color = theme.dark ? '#ffff' : theme.themes.light.accent
      controlButton.style.color = theme.dark ? '#ffff' : 'rgb(0, 119, 204)'
      controlButton.style.cursor = 'pointer'
      controlButton.style.fontSize = '1.2em'
      controlButton.style.margin = '20px 0 20px'
      controlButton.style.padding = '6px'
      controlButton.style.textAlign = 'center'
      controlButton.textContent = 'Search this area'
      controlButton.title = 'Click to search this area for leads'
      controlButton.type = 'button'
      // Setup the click event listeners: simply set the map to Chicago.
      controlButton.addEventListener('click', () => {
        // eslint-disable-next-line no-unused-vars
        const mapCenterLat = map.value.getCenter().lat()
        const mapCenterLng = map.value.getCenter().lng()
        if (mapCenterLat && mapCenterLng) {
          props.searchZipcode(mapCenterLat, mapCenterLng)
        }
      })
      return controlButton
    }
    const getIcons = (element, type) => {
      let pinIcon
      if (type === 'Schools') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg width="18" height="25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter x="-17.8%" y="-11.6%" width="149.9%" height="128.2%" filterUnits="objectBoundingBox" id="a"><feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" in="shadowBlurOuter1"/></filter><path d="M8.64 1.62c3.877 0 7.02 3.022 7.02 6.75 0 1.52 0 2.46-1.403 5.4-.83 1.74-2.4 4.418-4.708 8.036a1.08 1.08 0 01-1.82.002c-2.305-3.599-3.873-6.278-4.704-8.036C1.62 10.8 1.62 9.89 1.62 8.37c0-3.728 3.143-6.75 7.02-6.75z" id="b"/></defs><g fill="none" fill-rule="evenodd"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="#063" xlink:href="#b"/><path d="M5.52 8.516L8.384 9.99l2.72-1.4v1.85c0 .404-.225.775-.585.96l-1.64.845c-.31.16-.68.16-.99 0l-1.785-.92a1.08 1.08 0 01-.586-.96v-1.85zM8.894 4.57l3.028 1.94c.31.198.497.54.497.909v2.167a.257.257 0 01-.513 0v-2.45l-3.595 1.87-3.29-1.745a.54.54 0 01-.039-.932L7.73 4.571a1.08 1.08 0 011.165 0z" fill="#FFF"/></g></svg>'
            )
        }
      } else if (type === 'Employer Sponsored') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg width="18" height="25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter x="-17.8%" y="-11.6%" width="149.9%" height="128.2%" filterUnits="objectBoundingBox" id="a"><feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" in="shadowBlurOuter1"/></filter><path d="M8.64 1.62c3.877 0 7.02 3.022 7.02 6.75 0 1.52 0 2.46-1.403 5.4-.83 1.74-2.4 4.418-4.708 8.036a1.08 1.08 0 01-1.82.002c-2.305-3.599-3.873-6.278-4.704-8.036C1.62 10.8 1.62 9.89 1.62 8.37c0-3.728 3.143-6.75 7.02-6.75z" id="b"/></defs><g fill="none" fill-rule="evenodd"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="#194" xlink:href="#b"/><path d="M11.88 11.838c0 .322-.26.582-.582.582H5.442a.582.582 0 110-1.163h5.856c.322 0 .582.26.582.581zM7.2 9.512v1.163H6.03V9.512H7.2zm1.755-.581v1.744h-1.17V8.931h1.17zm1.755-1.163v2.907H9.54V7.768h1.17zm.585-2.908v2.264l-.733-.716-1.926 1.847-1.968.001-.58.566a.586.586 0 01-.818 0 .56.56 0 010-.8l.918-.898h1.974l1.58-1.517-.764-.747h2.317z" fill="#FFF"/></g></svg>'
            )
        }
      } else if (type === 'Individuals') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(8, 0),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg width="18" height="25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter x="-17.8%" y="-11.6%" width="149.9%" height="128.2%" filterUnits="objectBoundingBox" id="a"><feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" in="shadowBlurOuter1"/></filter><path d="M8.64 1.62c3.877 0 7.02 3.022 7.02 6.75 0 1.52 0 2.46-1.403 5.4-.83 1.74-2.4 4.418-4.708 8.036a1.08 1.08 0 01-1.82.002c-2.305-3.599-3.873-6.278-4.704-8.036C1.62 10.8 1.62 9.89 1.62 8.37c0-3.728 3.143-6.75 7.02-6.75z" id="b"/></defs><g fill="none" fill-rule="evenodd"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="#529" xlink:href="#b"/><path d="M8.64 9.27c1.967 0 3.24.98 3.24 1.83v.24a1.08 1.08 0 01-1.08 1.08H6.48a1.08 1.08 0 01-1.08-1.08v-.24c0-.85 1.274-1.83 3.24-1.83zm-.154-4.41c1.022 0 1.851.846 1.851 1.89s-.829 1.89-1.851 1.89a1.825 1.825 0 01-1.312-.551 1.902 1.902 0 01-.54-1.339c0-1.044.83-1.89 1.852-1.89z" fill="#FFF" fill-rule="nonzero"/></g></svg>'
            )
        }
      } else if (type === 'Municipalities') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(8, 0),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg width="18" height="25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter x="-17.8%" y="-11.6%" width="149.9%" height="128.2%" filterUnits="objectBoundingBox" id="a"><feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" in="shadowBlurOuter1"/></filter><path d="M8.64 1.62c3.877 0 7.02 3.022 7.02 6.75 0 1.52 0 2.46-1.403 5.4-.83 1.74-2.4 4.418-4.708 8.036a1.08 1.08 0 01-1.82.002c-2.305-3.599-3.873-6.278-4.704-8.036C1.62 10.8 1.62 9.89 1.62 8.37c0-3.728 3.143-6.75 7.02-6.75z" id="b"/></defs><g fill="none" fill-rule="evenodd"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="#063" xlink:href="#b"/><path d="M6.75 8.01v3.15h1.26V8.01h1.26v3.15h1.26V8.01h1.26v3.15a.63.63 0 110 1.26h-6.3a.63.63 0 110-1.26V8.01h1.26zm1.89-3.15l2.52 1.26h.63a.63.63 0 110 1.26h-6.3a.63.63 0 010-1.26h.63l2.52-1.26z" fill="#FFF"/></g></svg>'
            )
        }
      } else if (type === 'Church') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(8, 0),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Artboard</title><g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><image id="output-onlinepngtools__6_-removebg-preview" x="0" y="0" width="25" height="25" xlink:href="data:image/png;base64,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AnoF2OSu15PWEEgtIAfJXZCVXTvVq1f2m7ekDpoVEUBAmwAFXRslDSGQXcCl09k4oj17vmkBAZ0CFHSdmrSFgAYBF4o6xVxDomkCAc0CFHTNoDSHgA4Bm4s6xVxHhmkDAf0CHBSn35QWEcgs8N96jqyWRtRtV217jPynkwfW2jYoxoMAAqUSBZ1PAQIWCrS2tvbJsGy8M1t/R0dHj4VkDAmB4AXY5B78RwAAmwVk07tNl4flfHObPyyMLXgBZujBfwQAsFmgcj/xi6bHqPabc1lX01mgfwTqCzBDr+/DuwhYISAzdXUluVsMDYaZuSF4ukWgGQEKejNaLIuAQQEp6mq/+uKCh0AxLxic7hBIK8Am97RyrIdAwQLPH9tzV8Fdlp45uHNz0X3SHwIIpBNghp7OjbUQMCJQ8PnpFyv78I3ESqcIINCcAAW9OS+WRsC4QEG3W2VTu/FMMwAEmhNgk3tzXiyNgHGBl0rlpTKI3I5854h24ylmAAikEmCGnoqNlRAwL5DTTJ2ZufnUMgIEUgkwQ0/FxkoImBfYtuePj+kexfYP//yo7jZpDwEEihFghl6MM70gkIuA5oPkmJ3nkiUaRaAYAQp6Mc70gkBuAlLUL0vjCzN2cEWOaF+QsQ1WRwABgwIUdIP4dI2ALoGMRZ1irisRtIOAQQEKukF8ukZAp4AU9UFpb36TbQ7JzLzZdZrsgsURQKAIAQp6Ecr0gUBBAq+UWodKpXhusu6iqztKPfOSLctSCCBguwBHudueIcaHQBMCL8YX1LXerzVeJboqy7LPvDEUSyDgjAAF3ZlUMVAEGgtEUTT8s/Of3SpLDtdeOrr641Mft8iyY7WX4R0EEHBNgILuWsYYLwINBNra2vp/eGJ/lyw2Wm3R546+f1d7e7va384DAQQ8EqCge5RMQkFgXKCzs/Pru9/4+TPjzyf8v7+7u/vohOf8iAACnghwUJwniSQMBKoJTDnynSPaqyHxGgIIIIAAAi4ISFEfkH/9LoyVMSKAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAALhCvx/jqK8Zlgg/8MAAAAASUVORK5CYII="></image><circle id="Oval" fill="#870E1D" cx="12.5" cy="9.5" r="4.5"></circle><image id="output-onlinepngtools-(7)" x="8" y="5" width="9" height="9" xlink:href="data:image/png;base64,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AwIECBAgMK+AADBvbc2MAAECBAgcCggAhzQ+IECAAAEC8woIAPPW1swIECBAgMChgABwSOMDAgQIECAwr4AAMG9tzYwAAQIECBwKCACHND4gcCzgvz8/tkl/ohZpcf3NIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBQICQAGWSwkQIECAwCwCAsAslTQPAgQIECBQICAAFGC5lAABAgQIzCIgAMxSSfMgQIAAAQIFAgJAAZZLCRAgQIDALAICwCyVNA8CBAgQIFAgIAAUYLmUAAECBAjMIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBQICQAGWSwkQIECAwCwCAsAslTQPAgQIECBQICAAFGC5lAABAgQIzCIgAMxSSfMgQIAAAQIFAgJAAZZLCRAgQIDALAICwCyVNA8CBAgQIFAgIAAUYLmUAAECBAjMIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBQICQAGWSwkQIECAwCwCAsAslTQPAgQIECBQICAAFGC5lAABAgQIzCIgAMxSSfMgQIAAAQIFAgJAAZZLCRAgQIDALAICwCyVNA8CBAgQIFAgIAAUYLmUAAECBAjMIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBQICQAGWSwkQIECAwCwCAsAslTQPAgQIECBQICAAFGC5lAABAgQIzCIgAMxSSfMgQIAAAQIFAgJAAZZLCRAgQIDALAICwCyVNA8CBAgQIFAgIAAUYLmUAAECBAjMIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBQICQAGWSwkQIECAwCwCAsAslTQPAgQIECBQICAAFGC5lAABAgQIzCIgAMxSSfMgQIAAAQIFAgJAAZZLCRAgQIDALAICwCyVNA8CBAgQIFAgIAAUYLmUAAECBAjMIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBQICQAGWSwkQIECAwCwCAsAslTQPAgQIECBQICAAFGC5lAABAgQIzCIgAMxSSfMgQIAAAQIFAgJAAZZLCRAgQIDALAICwCyVNA8CBAgQIFAgIAAUYLmUAAECBAjMIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBQICQAGWSwkQIECAwCwCAsAslTQPAgQIECBQICAAFGC5lAABAgQIzCIgAMxSSfMgQIAAAQIFAgJAAZZLCRAgQIDALAICwCyVNA8CBAgQIFAgIAAUYLmUAAECBAjMIiAAzFJJ8yBAgAABAgUCAkABlksJECBAgMAsAgLALJU0DwIECBAgUCAgABRguZQAAQIECMwiIADMUknzIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIEygf8DLvCDBFcK67QAAAAASUVORK5CYII="></image></g></svg>'
            )
        }
      } else if (type === 'TaxExempt') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(8, 0),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg width="25" height="25" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Group 10</title><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-10"><image id="output-onlinepngtools__4_-removebg-preview-(2)" x="0" y="0" width="25" height="25" xlink:href="data:image/png;base64,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"></image><circle id="Oval" fill="#EB9C34" cx="12" cy="10" r="5"></circle><image id="output-onlinepngtools-(2)" x="8" y="5" width="9" height="9" xlink:href="data:image/png;base64,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"></image></g></g></svg>'
            )
        }
      }
      return pinIcon
    }
    const setCenterPin = async (zipcode) => {
      // eslint-disable-next-line no-unused-vars
      return new Promise(function (resolve, reject) {
        if (defaultMarker.value && defaultMarker.value.length > 0) {
          defaultMarker.value.forEach((element, index) => {
            defaultMarker.value[index].setMap(null)
          })
        }
        zipcode = !zipcode ? store.state.finderList.zipcode : zipcode
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `zipcode: ${zipcode}` }, function (results, status) {
          if (status === 'OK') {
            if (map.value) {
              map.value.setCenter(results[0].geometry.location)
              var icon = {
                // eslint-disable-next-line no-undef
                anchor: new google.maps.Point(16, 16),
                url:
                  'data:image/svg+xml;utf-8,' +
                  encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">\
                      <g id="Rectangle_1646" data-name="Rectangle 1646" fill="#147ac2" stroke="#fff" stroke-width="1">\
                        <rect width="20" height="20" rx="10" stroke="none"/>\
                        <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="none"/>\
                      </g>\
                    </svg>'
                  )
              }
              // eslint-disable-next-line no-undef
              var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map.value,
                icon: icon
              })
              defaultMarker.value.push(marker)
            }
            resolve(results[0].geometry.location)
          } else {
            // eslint-disable-next-line no-undef
            if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
              // eslint-disable-next-line no-console
              console.log('Query Limit')
              setTimeout(function () {
                GoogleMap()
              }, 2000)
            } else {
              // eslint-disable-next-line no-console
              console.log('Geocode was not successful for the following reason: ' + status)
              resolve(status)
            }
          }
        })
      })
    }
    const highlightMarker = (SEINPNO) => {
      var index = markers.value.findIndex((a) => a.SEINPNO === SEINPNO)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(markers[index], 'click')
        root.$parent.rowcolor = 'background-color:white'
        root.$parent.selectedRowPadding = ''
      }
    }
    const hideAllInfoWindows = (map) => {
      markers.value.forEach(function (marker) {
        marker.infowindow.close(map.value, marker)
      })
      schoolMarker.value.forEach(function (marker) {
        marker.infowindow.close(map.value, marker)
      })
      individualMarkers.value.forEach(function (marker) {
        marker.infowindow.close(map.value, marker)
      })
      municipalMarkers.value.forEach(function (marker) {
        marker.infowindow.close(map.value, marker)
      })
      churchMarkers.value.forEach(function (marker) {
        marker.infowindow.close(map.value, marker)
      })
      taxExemptMarkers.value.forEach(function (marker) {
        marker.infowindow.close(map.value, marker)
      })
    }
    ///Start Employee Sponsor Icon
    const setProspectMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.forEach((element, index) => {
          var address = element.SSTREET + ',' + element.SCITY + ',' + element.SSTATE + ' ' + element.ZIPCODE
          if (element.PlANADDRESSLATITUDE && element.PLANADDRESSLONGITUDE) {
            var latlng = {
              lat: parseFloat(element.PlANADDRESSLATITUDE),
              lng: parseFloat(element.PLANADDRESSLONGITUDE)
            }
            drawProspectMarker(
              map,
              element.PNAME,
              address,
              element.SEINPNO,
              element,
              getIcons(element, type),
              index,
              latlng,
              element.DCPTYPE
            )
          }
        })
      }
    }
    // eslint-disable-next-line no-unused-vars
    const drawProspectMarker = (map, companyName, address, SEINPNO, Obj, icon, i, latlng, planType) => {
      var bookOfBuinsess = Obj && Obj.InBookOfBusiness ? Obj.InBookOfBusiness : 0
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({
        maxWidth: 300
      })
      // eslint-disable-next-line no-undef
      var marker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map.value,
        infowindow: infowindow
      })
      marker.setValues({ SEINPNO: SEINPNO })
      markers.value.push(marker)
      window.markerPlanInfo = function (SEINPNO, planType, bookOfBuinsess) {
        props.planInfo(SEINPNO, planType, bookOfBuinsess)
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        marker,
        'click',
        (function () {
          return function () {
            hideAllInfoWindows(map, infowindow)
            root.$parent.rowcolor = 'background-color:white'
            root.$parent.shakeMarker = ''
            root.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<div id="employerSponsorInfoWindow">
                <h4 class="mb-2"><a class='${
                  bookOfBuinsess === 1 ? 'cursor-auto white--text text-capitalize' : 'white--text text-capitalize'
                }' onclick="markerPlanInfo('${SEINPNO.toString()}', '${planType.toString()}', '${bookOfBuinsess}')" style="font-weight: 600;">
                      ${companyName ? companyName.toLowerCase() : ''}
                      </a></h4>
                      <span class="white--text text-capitalize">
                      ${address ? address.toLowerCase() : ''} 
                      </span>
                </div>`
            )
            infowindow.open(map.value, marker)
            root.$parent.rowcolor = 'selected_row elevation-4'
            root.$parent.shakeMarker = 'face'
            root.$parent.selectedRowPadding = 'pt-4 pb-4'
            //lastWindow = infowindow
            root.$parent.mapselectedSEINPNO = SEINPNO
            timer.value = setTimeout(function () {
              infowindow.close()
              if (root.$parent) {
                root.$parent.rowcolor = 'background-color:white'
                root.$parent.selectedRowPadding = ''
              }
            }, 3000)
          }
        })(marker, i)
      )
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(infowindow, 'domready', function () {
        document.getElementById('employerSponsorInfoWindow').offsetParent.parentElement.classList.add('employerSponsorInfoCSS')
      })
    }
    const resetProspectMarker = () => {
      for (var j = 0; j < markers.value.length; j++) {
        if (markers.value[j].SEINPNO) {
          markers.value[j].setMap(null)
        }
      }
    }
    ///End Employee Sponsor Icon
    ///Start School Icon
    const schoolDistrictInfo = (schoolDistrictId, zipcode) => {
      if (props.fromPage === 'searchLead') {
        props.schoolDetailPage(schoolDistrictId, zipcode)
      } else {
        store.state.finderList.prospectValue = props.prospectTab
        router.push({
          query: {
            schoolDistId: schoolDistrictId,
            zipcode: zipcode ? zipcode : store.state.finderList.zipcode,
            radius: store.state.finderList.searchRadius,
            type: 'SchoolDistrict'
          },
          name: 'SchoolAccountDetails',
          params: {
            lastRoute: route.path
          }
        })
      }
    }
    // eslint-disable-next-line no-unused-vars
    const highlightSchoolDistrictMarker = (schoolDistId) => {
      var index = schoolMarker.value.findIndex((a) => a.schoolDistrictId === schoolDistId)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(schoolMarker[index], 'click')
        root.$parent.rowcolor = 'background-color:white'
        root.$parent.selectedRowPadding = ''
      }
    }
    const resetSchoolMarker = () => {
      for (var j = 0; j < schoolMarker.value.length; j++) {
        if (schoolMarker.value[j].schoolDistrictId) {
          schoolMarker.value[j].setMap(null)
        }
      }
    }
    const setSchoolDistrictMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.forEach((element, index) => {
          if (element.latitude && element.longitude) {
            var address = element.address + ',' + element.country + ' ' + element.zipCode
            var latlng = {
              lat: parseFloat(element.latitude),
              lng: parseFloat(element.longitude)
            }
            drawSchoolDistrictMarker(
              element.name,
              address,
              element.id,
              element,
              getIcons(element, type),
              index,
              latlng,
              map,
              element.zipCode
            )
          }
        })
      }
      //end
    }
    const setSchoolsMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.value.forEach((element, index) => {
          if (element.SchoolDistrictLatitude && element.SchoolDistrictLongitude) {
            var address =
              element.SchoolDistrictAddress + ',' + element.SchoolDistrictCountry + ' ' + element.SchoolDistrictZipCode
            var latlng = {
              lat: parseFloat(element.SchoolDistrictLatitude),
              lng: parseFloat(element.SchoolDistrictLongitude)
            }
            drawSchoolDistrictMarker(
              element.SchoolDistrictName,
              address,
              element.SchoolDistrictId,
              element,
              getIcons(element, type),
              index,
              latlng,
              map,
              element.SchoolDistrictZipCode
            )
          }
        })
      }
      //end
    }
    // eslint-disable-next-line no-unused-vars
    const drawSchoolDistrictMarker = (
      schoolDistrictName,
      address,
      schoolDistrictId,
      Obj,
      icon,
      i,
      latlng,
      map,
      schoolDistrictZipCode
    ) => {
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var markerSchool = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map.value,
        infowindow: infowindow
      })
      markerSchool.setValues({ schoolDistrictId: schoolDistrictId })
      schoolMarker.value.push(markerSchool)
      window.markerSchoolDistrictInfo = function (schoolDistrictId, schoolDistrictZipCode) {
        schoolDistrictInfo(schoolDistrictId, schoolDistrictZipCode)
      }
      schoolMarker.value.push(markerSchool)
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerSchool,
        'click',
        (function () {
          return function () {
            hideAllInfoWindows(map, infowindow)
            if (root.$parent.$refs.SchoolComponent) {
              root.$parent.$refs.SchoolComponent.rowcolor = 'background-color:white'
              root.$parent.$refs.SchoolComponent.shakeMarker = ''
              root.$parent.$refs.SchoolComponent.selectedRowPadding = ''
            }

            infowindow.setContent(
              `<div id="schoolInfoWindow">
                <h4 class="mb-2"><a class="white--text text-capitalize" onclick="markerSchoolDistrictInfo('${schoolDistrictId.toString()}', '${schoolDistrictZipCode?.toString()}')" style="font-weight: 600;">
                    ${schoolDistrictName ? schoolDistrictName.toLowerCase() : ''}
                    </a></h4>
                    <p>
                    <span class="white--text text-capitalize">
                    ${address ? address.toLowerCase() : ''} 
                    </span>
                    </p>
                </div>`
            )
            infowindow.open(map.value, markerSchool)
            if (root.$parent.$refs.SchoolComponent) {
              root.$parent.$refs.SchoolComponent.rowcolor = 'selected_row elevation-4'
              root.$parent.$refs.SchoolComponent.shakeMarker = 'face'
              root.$parent.$refs.SchoolComponent.selectedRowPadding = 'pt-4 pb-4'
              //lastWindow = infowindow
              root.$parent.$refs.SchoolComponent.mapSelectedSchool = schoolDistrictId
              timer.value = setTimeout(function () {
                infowindow.close()
                if (root.$parent.$refs.SchoolComponent) {
                  root.$parent.$refs.SchoolComponent.rowcolor = 'background-color:white'
                  root.$parent.$refs.SchoolComponent.selectedRowPadding = ''
                }
              }, 3000)
            }
          }
        })(markerSchool, i)
      )
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(infowindow, 'domready', function () {
        document.getElementById('schoolInfoWindow').offsetParent.parentElement.classList.add('schoolInfoCSS')
      })
    }
    ///End School Pin point
    ///Start Individual Pin point
    const individualHouseholdInfo = (accountId, householdName) => {
      store.state.finderList.prospectValue = props.prospectTab
      router.push({
        query: {
          accountId: accountId,
          householdName: householdName
        },
        name: 'TALHouseholdResult',
        params: {
          lastRoute: route.path
        }
      })
    }
    const drawIndividualHouseholdMarker = (accountName, accountAddress, accountId, Obj, icon, i, latlng, map) => {
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var markerIndividualHousehold = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map.value,
        infowindow: infowindow
      })
      markerIndividualHousehold.setValues({
        accountId: accountId,
        householdId: Obj.householdId,
        householdName: Obj.householdName
      })
      individualMarkers.value.push(markerIndividualHousehold)
      window.markerIndividualHouseholdInfo = function (accountId, householdName) {
        individualHouseholdInfo(accountId, householdName)
      }

      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerIndividualHousehold,
        'click',
        (function () {
          return function () {
            hideAllInfoWindows(map, infowindow)
            if (root.$parent.$refs.individualComponent) {
              root.$parent.$refs.individualComponent.rowcolor = 'background-color:white'
              root.$parent.$refs.individualComponent.shakeMarker = ''
              root.$parent.$refs.individualComponent.selectedRowPadding = ''
            }
            infowindow.setContent(
              `<div id="individualInfoWindow">
                <h4 class="mb-2"><a class="white--text text-capitalize" onclick="markerIndividualHouseholdInfo('${accountId.toString()}', '${Obj.householdName.toString()}')" style="font-weight: 600;">
                    ${accountName ? accountName.toLowerCase() : ''}
                    </a></h4>
                    <p>
                    <span class="white--text text-capitalize">
                    ${accountAddress ? accountAddress.toLowerCase() : ''} 
                    </span>
                    </p>
              </div>`
            )
            infowindow.open(map.value, markerIndividualHousehold)
            if (root.$parent.$refs.individualComponent) {
              root.$parent.$refs.individualComponent.rowcolor = 'selected_row elevation-4'
              root.$parent.$refs.individualComponent.shakeMarker = 'face'
              root.$parent.$refs.individualComponent.selectedRowPadding = 'pt-4 pb-4'
              //lastWindow = infowindow
              root.$parent.$refs.individualComponent.mapSelectedIndividual = Obj.householdId
              timer.value = setTimeout(function () {
                infowindow.close()
                if (root.$parent.$refs.individualComponent) {
                  root.$parent.$refs.individualComponent.rowcolor = 'background-color:white'
                  root.$parent.$refs.individualComponent.selectedRowPadding = ''
                }
              }, 3000)
            }
          }
        })(markerIndividualHousehold, i)
      )
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(infowindow, 'domready', function () {
        document.getElementById('individualInfoWindow').offsetParent.parentElement.classList.add('individualInfoCSS')
      })
    }
    const setIndividualHouseholdMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.value.forEach((element, index) => {
          element.individualAccounts.forEach((individualElement) => {
            if (individualElement.latitude && individualElement.longitude) {
              var latlng = {
                lat: parseFloat(individualElement.latitude),
                lng: parseFloat(individualElement.longitude)
              }
              drawIndividualHouseholdMarker(
                individualElement.accountName,
                individualElement.accountAddress,
                individualElement.accountId,
                element,
                getIcons(element, type),
                index,
                latlng,
                map
              )
            }
          })
        })
      }
    }
    const resetIndividualHouseholdMarker = () => {
      for (var j = 0; j < individualMarkers.value.length; j++) {
        if (individualMarkers.value[j].accountId) {
          individualMarkers.value[j].setMap(null)
        }
      }
    }
    const highlightIndividualMarker = (accountId) => {
      var index = individualMarkers.value.findIndex((a) => a.accountId === accountId)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(individualMarkers[index], 'click')
        root.$parent.rowcolor = 'background-color:white'
        root.$parent.selectedRowPadding = ''
      }
    }
    ///End Individual Pin Icon
    ///Start Municipal Pin icon
    const resetMunicipalMarker = () => {
      for (var j = 0; j < municipalMarkers.value.length; j++) {
        if (municipalMarkers.value[j].DepartmentId) {
          municipalMarkers.value[j].setMap(null)
        }
      }
    }
    const highlightMunicipalMarker = (Id) => {
      var index = municipalMarkers.value.findIndex((a) => a.DepartmentId === Id)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(municipalMarkers[index], 'click')
        root.$parent.rowcolor = 'background-color:white'
        root.$parent.selectedRowPadding = ''
      }
    }
    const municipalInfo = (DepartmentId, Name) => {
      store.state.finderList.prospectValue = 2
      router.push({
        query: {
          Id: DepartmentId,
          zipcode: store.state.finderList.zipcode,
          radius: store.state.finderList.searchRadius,
          name: Name
        },
        name: 'MunicipalDetail',
        params: {
          lastRoute: route.path
        }
      })
    }
    const setMunicipalMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.value.forEach((element, index) => {
          if (element.lat && element.lng) {
            var address = element.Address + ',' + element.City + ' ' + element.Zip
            var latlng = {
              lat: parseFloat(element.lat),
              lng: parseFloat(element.lng)
            }
            drawMunicipalMarker(element.Name, address, element.DepartmentId, element, getIcons(element, type), index, latlng, map)
          }
        })
      }
      //end
    }
    // eslint-disable-next-line no-unused-vars
    const drawMunicipalMarker = (municipalName, address, municipalId, Obj, icon, i, latlng, map) => {
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var markerMunicipal = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map.value,
        infowindow: infowindow
      })
      markerMunicipal.setValues({ DepartmentId: municipalId, Name: municipalName })
      municipalMarkers.value.push(markerMunicipal)
      window.markerMunicipalInfo = function (DepartmentId, Name) {
        municipalInfo(DepartmentId, Name)
      }
      municipalMarkers.value.push(markerMunicipal)
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerMunicipal,
        'click',
        (function () {
          return function () {
            hideAllInfoWindows(map, infowindow)
            if (root.$parent.$refs.municipalComponent) {
              root.$parent.$refs.municipalComponent.rowcolor = 'background-color:white'
              root.$parent.$refs.municipalComponent.shakeMarker = ''
              root.$parent.$refs.municipalComponent.selectedRowPadding = ''
            }

            infowindow.setContent(
              `<div id="municipalInfoWindow">
                <h4 class="mb-2"><a class="white--text text-capitalize" onclick="markerMunicipalInfo('${municipalId.toString()}', '${municipalName.toString()}')" style="font-weight: 600;">
                    ${municipalName ? municipalName.toLowerCase() : ''}
                    </a></h4>
                    <p>
                    <span class="white--text text-capitalize">
                    ${address ? address.toLowerCase() : ''} 
                    </span>
                    </p>
                </div>`
            )
            infowindow.open(map.value, markerMunicipal)
            if (root.$parent.$refs.municipalComponent) {
              root.$parent.$refs.municipalComponent.rowcolor = 'selected_row elevation-4'
              root.$parent.$refs.municipalComponent.shakeMarker = 'face'
              root.$parent.$refs.municipalComponent.selectedRowPadding = 'pt-4 pb-4'
              //lastWindow = infowindow
              root.$parent.$refs.municipalComponent.mapSelectedMunicipal = municipalId
              timer.value = setTimeout(function () {
                infowindow.close()
                if (root.$parent.$refs.municipalComponent) {
                  root.$parent.$refs.municipalComponent.rowcolor = 'background-color:white'
                  root.$parent.$refs.municipalComponent.selectedRowPadding = ''
                }
              }, 3000)
            }
          }
        })(markerMunicipal, i)
      )
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(infowindow, 'domready', function () {
        document.getElementById('municipalInfoWindow').offsetParent.parentElement.classList.add('municipalInfoCSS')
      })
    }
    ///End Municipal Pin icon
    ///Start Church Pin icon
    const resetChurchMarker = () => {
      for (var j = 0; j < churchMarkers.value.length; j++) {
        if (churchMarkers.value[j].Name) {
          churchMarkers.value[j].setMap(null)
        }
      }
    }
    const highlightChurchMarker = (Name) => {
      var index = churchMarkers.value.findIndex((a) => a.Name === Name)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(churchMarkers[index], 'click')
        root.$parent.rowcolor = 'background-color:white'
        root.$parent.selectedRowPadding = ''
      }
    }
    const churchInfo = (Name) => {
      store.state.finderList.prospectValue = 3
      router.push({
        query: {
          name: Name,
          zipcode: store.state.finderList.zipcode,
          radius: store.state.finderList.searchRadius
        },
        name: 'ChurchDetail',
        params: {
          lastRoute: route.path
        }
      })
    }
    const setChurchMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.value.forEach((element, index) => {
          if (element.lat && element.lng) {
            var address = element.Address + ',' + element.City + ' ' + element.Zip
            var latlng = {
              lat: parseFloat(element.lat),
              lng: parseFloat(element.lng)
            }
            drawChurchMarker(element.Name, address, element.Name, element, getIcons(element, type), index, latlng, map)
          }
        })
      }
      //end
    }
    // eslint-disable-next-line no-unused-vars
    const drawChurchMarker = (churchName, address, churchId, Obj, icon, i, latlng, map) => {
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var markerChurch = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map.value,
        infowindow: infowindow
      })
      markerChurch.setValues({ Name: churchName })
      churchMarkers.value.push(markerChurch)
      window.markerChurchInfo = function (Name) {
        churchInfo(Name)
      }
      churchMarkers.value.push(markerChurch)
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerChurch,
        'click',
        (function () {
          return function () {
            hideAllInfoWindows(map, infowindow)
            if (root.$parent.$refs.churchComponent) {
              root.$parent.$refs.churchComponent.rowcolor = 'background-color:white'
              root.$parent.$refs.churchComponent.shakeMarker = ''
              root.$parent.$refs.churchComponent.selectedRowPadding = ''
            }

            infowindow.setContent(
              `<div id="churchInfoWindow">
                <h4 class="mb-2"><a class="white--text text-capitalize" onclick="markerChurchInfo('${churchName.toString()}')" style="font-weight: 600;">
                    ${churchName ? churchName.toLowerCase() : ''}
                    </a></h4>
                    <p>
                    <span class="white--text text-capitalize">
                    ${address ? address.toLowerCase() : ''} 
                    </span>
                    </p>
                </div>`
            )
            infowindow.open(map.value, markerChurch)
            if (root.$parent.$refs.churchComponent) {
              root.$parent.$refs.churchComponent.rowcolor = 'selected_row elevation-4'
              root.$parent.$refs.churchComponent.shakeMarker = 'face'
              root.$parent.$refs.churchComponent.selectedRowPadding = 'pt-4 pb-4'
              //lastWindow = infowindvow
              root.$parent.$refs.churchComponent.mapSelectedChurch = churchName
              timer.value = setTimeout(function () {
                infowindow.close()
                if (root.$parent.$refs.churchComponent) {
                  root.$parent.$refs.churchComponent.rowcolor = 'background-color:white'
                  root.$parent.$refs.churchComponent.selectedRowPadding = ''
                }
              }, 3000)
            }
          }
        })(markerChurch, i)
      )
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(infowindow, 'domready', function () {
        document.getElementById('churchInfoWindow').offsetParent.parentElement.classList.add('churchInfoCSS')
      })
    }
    ///End Church Pin icon
    ///Start Tax Exempt Pin icon
    const resetTaxExemptMarker = () => {
      for (var j = 0; j < taxExemptMarkers.value.length; j++) {
        if (taxExemptMarkers.value[j].EIN) {
          taxExemptMarkers.value[j].setMap(null)
        }
      }
    }
    const highlightTaxExemptMarker = (Id) => {
      var index = taxExemptMarkers.value.findIndex((a) => a.EIN === Id)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(taxExemptMarkers[index], 'click')
        root.$parent.rowcolor = 'background-color:white'
        root.$parent.selectedRowPadding = ''
      }
    }
    const taxExemptInfo = (EIN, Name) => {
      store.state.finderList.prospectValue = 7
      router.push({
        query: {
          Id: EIN,
          zipcode: store.state.finderList.zipcode,
          radius: store.state.finderList.searchRadius,
          name: Name
        },
        name: 'TaxExemptDetail',
        params: {
          lastRoute: route.path
        }
      })
    }
    const setTaxExemptMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.value.forEach((element, index) => {
          if (element.lat && element.lng) {
            var address = element.Address + ',' + element.City + ' ' + element.Zip
            var latlng = {
              lat: parseFloat(element.lat),
              lng: parseFloat(element.lng)
            }
            drawTaxExemptMarker(element.Name, address, element.EIN, element, getIcons(element, type), index, latlng, map)
          }
        })
      }
      //end
    }
    // eslint-disable-next-line no-unused-vars
    const drawTaxExemptMarker = (taxExmptName, address, EIN, Obj, icon, i, latlng, map) => {
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var markerTaxExempt = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map.value,
        infowindow: infowindow
      })
      markerTaxExempt.setValues({ EIN: EIN, Name: taxExmptName })
      taxExemptMarkers.value.push(markerTaxExempt)
      window.markerTaxExemptInfo = function (EIN, Name) {
        taxExemptInfo(EIN, Name)
      }
      churchMarkers.value.push(markerTaxExempt)
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerTaxExempt,
        'click',
        (function () {
          return function () {
            hideAllInfoWindows(map, infowindow)
            if (root.$parent.$refs.taxExemptComponent) {
              root.$parent.$refs.taxExemptComponent.rowcolor = 'background-color:white'
              root.$parent.$refs.taxExemptComponent.shakeMarker = ''
              root.$parent.$refs.taxExemptComponent.selectedRowPadding = ''
            }

            infowindow.setContent(
              `<div id="taxExemptInfoWindow">
                <h4 class="mb-2"><a class="white--text text-capitalize" onclick="markerTaxExemptInfo('${EIN.toString()}', '${taxExmptName.toString()}')" style="font-weight: 600;">
                    ${taxExmptName ? taxExmptName.toLowerCase() : ''}
                    </a></h4>
                    <p>
                    <span class="white--text text-capitalize">
                    ${address ? address.toLowerCase() : ''} 
                    </span>
                    </p>
                </div>`
            )
            infowindow.open(map.value, markerTaxExempt)
            if (root.$parent.$refs.taxExemptComponent) {
              root.$parent.$refs.taxExemptComponent.rowcolor = 'selected_row elevation-4'
              root.$parent.$refs.taxExemptComponent.shakeMarker = 'face'
              root.$parent.$refs.taxExemptComponent.selectedRowPadding = 'pt-4 pb-4'
              //lastWindow = infowindvow
              root.$parent.$refs.taxExemptComponent.mapSelectedTaxExempt = EIN
              timer.value = setTimeout(function () {
                infowindow.close()
                if (root.$parent.$refs.taxExemptComponent) {
                  root.$parent.$refs.taxExemptComponent.rowcolor = 'background-color:white'
                  root.$parent.$refs.taxExemptComponent.selectedRowPadding = ''
                }
              }, 3000)
            }
          }
        })(markerTaxExempt, i)
      )
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(infowindow, 'domready', function () {
        document.getElementById('taxExemptInfoWindow').offsetParent.parentElement.classList.add('taxExemptInfoCSS')
      })
    }
    ///End Tax Exempt Pin icon
    //Client Prospect Marker
    const setClientProspectMarker = (locations, type) => {
      clearTimeout(timer)
      if (locations) {
        locations.value.forEach((element, index) => {
          var address =
            element.PlanSponsorBillingStreet +
            ',' +
            element.PlanSponsorBillingCity +
            ',' +
            element.PlanSponsorBillingState +
            ' ' +
            element.PlanSponsorBillingPostalCode
          if (element.PlanSponsorLatitude && element.PlanSponsorLongitude) {
            var latlng = {
              lat: parseFloat(element.PlanSponsorLatitude),
              lng: parseFloat(element.PlanSponsorLongitude)
            }
            drawClientProspectMarker(
              map,
              element.PLANNAME,
              address,
              element.EIN,
              element,
              getIcons(element, type),
              index,
              latlng,
              element.PLANID
            )
          }
        })
      }
    }
    // eslint-disable-next-line no-unused-vars
    const drawClientProspectMarker = (map, companyName, address, SEINPNO, Obj, icon, i, latlng, PLANID) => {
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({
        maxWidth: 300
      })
      // eslint-disable-next-line no-undef
      var marker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map.value,
        infowindow: infowindow
      })
      marker.setValues({ PLANID: PLANID })
      markers.value.push(marker)
      window.markerClientPlanInfo = function (PLANID) {
        props.clientPlanInfo(PLANID)
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        marker,
        'click',
        (function () {
          return function () {
            hideAllInfoWindows(map, infowindow)
            root.$parent.rowcolor = 'background-color:white'
            root.$parent.shakeMarker = ''
            root.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<div id="employerSponsorInfoWindow">
                <h4 class="mb-2"><a class="white--text text-capitalize" onclick="markerClientPlanInfo('${PLANID.toString()}')" style="font-weight: 600;">
                      ${companyName ? companyName.toLowerCase() : ''}
                      </a></h4>
                      <span class="white--text text-capitalize">
                      ${address ? address.toLowerCase() : ''} 
                      </span>
                </div>`
            )
            infowindow.open(map.value, marker)
            root.$parent.rowcolor = 'selected_row elevation-4'
            root.$parent.shakeMarker = 'face'
            root.$parent.selectedRowPadding = 'pt-4 pb-4'
            //lastWindow = infowindow
            root.$parent.mapselectedSEINPNO = SEINPNO
            timer.value = setTimeout(function () {
              infowindow.close()
              if (root.$parent) {
                root.$parent.rowcolor = 'background-color:white'
                root.$parent.selectedRowPadding = ''
              }
            }, 3000)
          }
        })(marker, i)
      )
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(infowindow, 'domready', function () {
        document.getElementById('employerSponsorInfoWindow').offsetParent.parentElement.classList.add('employerSponsorInfoCSS')
      })
    }
    const highlightClientMarker = (PLANID) => {
      var index = markers.value.findIndex((a) => a.PLANID === PLANID)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(markers[index], 'click')
        root.$parent.rowcolor = 'background-color:white'
        root.$parent.selectedRowPadding = ''
      }
    }
    return {
      markers,
      markers1,
      defaultMarker,
      lastMapType,
      latestZipCodeByMap,
      map,
      timer,
      individualMarkers,
      schoolMarker,
      municipalMarkers,
      churchMarkers,
      taxExemptMarkers,
      store,
      theme,
      route,
      router,
      GoogleMap,
      ZoomControl,
      CenterButton,
      getIcons,
      setCenterPin,
      highlightMarker,
      setProspectMarker,
      drawProspectMarker,
      resetProspectMarker,
      schoolDistrictInfo,
      highlightSchoolDistrictMarker,
      resetSchoolMarker,
      setSchoolDistrictMarker,
      setSchoolsMarker,
      drawSchoolDistrictMarker,
      individualHouseholdInfo,
      drawIndividualHouseholdMarker,
      setIndividualHouseholdMarker,
      resetIndividualHouseholdMarker,
      highlightIndividualMarker,
      resetMunicipalMarker,
      municipalInfo,
      setMunicipalMarker,
      drawMunicipalMarker,
      resetChurchMarker,
      highlightChurchMarker,
      setChurchMarker,
      drawChurchMarker,
      resetTaxExemptMarker,
      highlightTaxExemptMarker,
      taxExemptInfo,
      setTaxExemptMarker,
      drawTaxExemptMarker,
      setClientProspectMarker,
      drawClientProspectMarker,
      highlightClientMarker,
      highlightMunicipalMarker,
      churchInfo
    }
  }
}
</script>
<style>
.zoomDiv {
  border-color: gray;
  cursor: pointer;
  text-align: center;
  width: 32px;
  height: 56px;
}

.Zmbuttondiv {
  width: 32px;
  height: 28px;
  color: var(--v-accent-base);
}

.gm-ui-hover-effect {
  display: none !important;
}

.employerSponsorInfoCSS .gm-style-iw.gm-style-iw-c {
  padding: 8px !important;
  background: #119944 !important;
  color: #fff !important;
}

.gm-style .gm-style-iw-t.employerSponsorInfoCSS .gm-style-iw-tc::after {
  background: #119944 !important;
}

.schoolInfoCSS .gm-style-iw.gm-style-iw-c {
  padding: 8px !important;
  background-color: #006633 !important;
  color: #fff !important;
}

.gm-style .gm-style-iw-t.schoolInfoCSS .gm-style-iw-tc::after {
  background: #006633 !important;
}

.individualInfoCSS .gm-style-iw.gm-style-iw-c {
  background-color: #552299 !important;
  color: #fff !important;
  padding: 8px !important;
}

.gm-style .gm-style-iw-t.individualInfoCSS .gm-style-iw-tc::after {
  background: #552299 !important;
}

.municipalInfoCSS .gm-style-iw.gm-style-iw-c {
  background-color: #056937 !important;
  color: #fff !important;
  padding: 8px !important;
}

.gm-style .gm-style-iw-t.municipalInfoCSS .gm-style-iw-tc::after {
  background: #056937 !important;
}

.churchInfoCSS .gm-style-iw.gm-style-iw-c {
  background-color: #910012 !important;
  color: #fff !important;
  padding: 8px !important;
}

.gm-style .gm-style-iw-t.churchInfoCSS .gm-style-iw-tc::after {
  background: #910012 !important;
}

.taxExemptInfoCSS .gm-style-iw.gm-style-iw-c {
  background-color: #f59a23 !important;
  color: #fff !important;
  padding: 8px !important;
}

.gm-style .gm-style-iw-t.taxExemptInfoCSS .gm-style-iw-tc::after {
  background: #f59a23 !important;
}

.gm-style-iw-d {
  overflow: auto !important;
}
.gm-style .gm-style-iw-c {
  transform: translate3d(-68%, -100%, 0) !important;
}
</style>
