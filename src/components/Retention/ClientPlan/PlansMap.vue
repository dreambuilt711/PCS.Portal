<template>
  <div>
    <div
      v-if="mapType === 'web' && !$vuetify?.breakpoint?.smAndDown"
      id="myMap"
      ref="mapVal"
      style="position: absolute !important"
    />
    <div v-if="mapType === 'mobile' && $vuetify?.breakpoint?.smAndDown" id="myMobileMap" style="position: relative !important" />
  </div>
</template>

<script>
import mapstyle from '@/assets/mapstyle.json'
export default {
  props: ['showMap', 'mapType', 'showAllAccountAndPlans', 'planInfo', 'mapMoveMethod', 'lastMap', 'clientResult'],
  data() {
    return {
      markers: new Array(),
      markers1: new Array(),
      starMarkers: new Array(),
      defaultMarker: new Array(),
      lastMapType: 'roadmap',
      latestZipCodeByMap: '',
      map: null,
      timer: null,
      individualMarkers: new Array(),
      municipalityMarkers: new Array()
    }
  },
  methods: {
    async GoogleMap() {
      this.markers = new Array()
      this.individualMarkers = new Array()
      clearTimeout(this.timer)
      var elementId = this.$vuetify?.breakpoint?.smAndDown ? 'myMobileMap' : 'myMap'
      var grayStyles
      if (!this.$vuetify?.theme.dark) grayStyles = mapstyle.standard
      else grayStyles = mapstyle.dark
      var zoomLevel = this.$store.state.clientPlan.showAllAccountAndPlans ? 5 : 14
      if (this.$store.state.clientPlan.searchRadius && !this.$store.state.clientPlan.showAllAccountAndPlans) {
        switch (this.$store.state.clientPlan.searchRadius) {
          case 5:
            zoomLevel = 13
            break
          case 10:
            zoomLevel = 12
            break
          case 25:
            zoomLevel = 10
            break
          default:
            break
        }
      }
      var mapOptions = {
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        styles: grayStyles,
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: true,
        zoomControl: false,
        rotateControl: false,
        mapTypeId: 'roadmap',
        zoom: zoomLevel
      }
      this.lastMapType = 'roadmap'
      // eslint-disable-next-line no-undef
      this.map = new google.maps.Map(document.getElementById(elementId), mapOptions)
      if (!this.$vuetify?.breakpoint?.smAndDown) {
        var zoomControlDiv = document.createElement('div')
        this.ZoomControl(zoomControlDiv, this.map)
        zoomControlDiv.index = 1
        // eslint-disable-next-line no-undef
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv)
      }
      // await this.setCenterPin(this)
    },
    ZoomControl(controlDiv, map) {
      // Creating divs & styles for custom zoom control
      controlDiv.style.padding = '5px'
      controlDiv.style.bottom = '65px'
      controlDiv.style.position = 'absolute !important'
      // Set CSS for the control wrapper
      var controlWrapper = document.createElement('div')
      controlWrapper.className = 'zoomDiv'
      controlDiv.appendChild(controlWrapper)

      // Set CSS for the zoomIn
      var zoomInButton = document.createElement('div')
      zoomInButton.className = 'Zmbuttondiv'
      zoomInButton.innerHTML = '<i class="fa fa-plus" style="font-size: 14px;padding: 7px;font-weight: 700;background:white"></i>'
      controlWrapper.appendChild(zoomInButton)

      // Set CSS for the zoomOut
      var zoomOutButton = document.createElement('div')
      zoomInButton.className = 'Zmbuttondiv'
      zoomOutButton.innerHTML =
        '<i class="fa fa-minus" style="font-size: 14px;padding: 7px;font-weight: 700;border-top: solid lightgrey 1px;background:white;color:rgb(var(--v-theme-accent))"></i>'
      controlWrapper.appendChild(zoomOutButton)

      // Setup the click event listener - zoomIn
      // eslint-disable-next-line no-undef
      google.maps.event.addDomListener(zoomInButton, 'click', function () {
        map.setZoom(map.getZoom() + 1)
      })

      // Setup the click event listener - zoomOut
      // eslint-disable-next-line no-undef
      google.maps.event.addDomListener(zoomOutButton, 'click', function () {
        map.setZoom(map.getZoom() - 1)
      })
    },
    getIcons(element, type) {
      let pinIcon
      let starIcon
      if (type === 'School') {
        element.isStarred = false
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg id="School_Dist_pin_icon" xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 26">\
                <path id="Exclusion_1" data-name="Exclusion 1" d="M9,0A9.044,9.044,0,0,0,0,9.1C0,15.925,9,26,9,26s9-10.075,9-16.9A9.044,9.044,0,0,0,9,0Z" fill="#fff"/>\
                <path id="Subtraction_6" data-name="Subtraction 6" d="M8.387,24.357h0a55.209,55.209,0,0,1-4.193-5.518C2.28,15.956,0,11.828,0,8.525a8.541,8.541,0,0,1,2.455-6.03,8.3,8.3,0,0,1,11.865,0,8.541,8.541,0,0,1,2.455,6.03c0,3.3-2.281,7.432-4.194,10.314a55.235,55.235,0,0,1-4.193,5.518Zm2.088-14.9a.772.772,0,0,1,.341.078.8.8,0,0,1,.481.765c0,1.072,0,2.162,0,3.216,0,.069.02.091.082.091h.007c.088,0,.176,0,.263,0h.316c.1,0,.1,0,.1-.1V8.544H4.48c0,.01,0,.019,0,.028s0,.025,0,.037q0,2.46,0,4.919c0,.067.027.079.079.079h.005l.347,0h.232c.108,0,.109,0,.109-.107v-.9q0-.9,0-1.8c0-.048,0-.1,0-.145,0-.155,0-.312.011-.466a.814.814,0,0,1,.787-.734h.023a.821.821,0,0,1,.83.817c0,.212,0,.428,0,.636,0,.093,0,.184,0,.275v.465c0,.613,0,1.243,0,1.863,0,.069.021.093.083.093h.011c.052,0,.1,0,.153,0h.2c.1,0,.1,0,.1-.1q0-1.616,0-3.232a.887.887,0,0,1,.021-.209A.816.816,0,0,1,8.2,9.422a.711.711,0,0,1,.082,0,.819.819,0,0,1,.8.711c.014.167.014.339.013.5,0,.052,0,.1,0,.157,0,1.018,0,1.91,0,2.727a.1.1,0,0,0,.019.072.085.085,0,0,0,.064.018h.008c.052,0,.1,0,.151,0h.2c.1,0,.1,0,.1-.1q0-.636,0-1.272,0-.954,0-1.908a1.172,1.172,0,0,1,.023-.223A.829.829,0,0,1,10.475,9.457Zm-.448,2.431h0v.463c0,.378,0,.769,0,1.157a.107.107,0,0,0,.02.079.093.093,0,0,0,.069.02h.007c.114,0,.231,0,.346,0s.232,0,.347,0h.008a.087.087,0,0,0,.065-.018.1.1,0,0,0,.019-.075c0-.429,0-.862,0-1.281v-.921c0-.334,0-.68,0-1.022a.439.439,0,0,0-.437-.444.468.468,0,0,0-.141.022.439.439,0,0,0-.3.431c0,.381,0,.764,0,1.135v.454ZM8.271,9.816A.447.447,0,0,0,8.1,9.85a.442.442,0,0,0-.27.425v1.936c0,.429,0,.869,0,1.3,0,.072.022.095.091.095l.354,0,.35,0H8.63c.065,0,.086-.024.086-.1,0-.219,0-.441,0-.655V11.85q0-.788,0-1.576a.453.453,0,0,0-.13-.328A.438.438,0,0,0,8.271,9.816Zm-2.2.029a.439.439,0,0,0-.434.451c0,.384,0,.771,0,1.146v.863q0,.608,0,1.215a.092.092,0,0,0,.017.069.084.084,0,0,0,.063.018l.268,0h.455c.036,0,.056,0,.066-.013s.013-.039.012-.092v-.038q0-1.393,0-2.786c0-.032,0-.064,0-.1,0-.119,0-.239-.009-.355a.4.4,0,0,0-.293-.355A.455.455,0,0,0,6.069,9.846ZM4.59,7.015l-.7,0a.563.563,0,0,0-.54.751.583.583,0,0,0,.554.382q1.1,0,2.186,0h5.454q.565,0,1.13,0a.566.566,0,1,0-.043-1.131H4.59Zm-1.2-2.157h0a.887.887,0,0,0-.726.368.872.872,0,0,0-.131.778.906.906,0,0,0,.868.621h6.827q1.461,0,2.92,0a1.022,1.022,0,0,0,.281-.041.877.877,0,0,0,.391-1.439.894.894,0,0,0-.7-.286H3.386Z" transform="translate(0.631 0.643)" fill="#24a194"/>\
              </svg>'
            )
        }

        starIcon = {
          path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
          fillColor: '#24a194', //color of the marker
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#24a194',
          scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
          // eslint-disable-next-line no-undef
          origin: new google.maps.Point(0, 0),
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          // eslint-disable-next-line no-undef
          scaledSize: new google.maps.Size(20, 20),
          // eslint-disable-next-line no-undef
          labelOrigin: new google.maps.Point(9, 8)
        }
      } else if (type === 'Individual') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg id="Individual_pin_Icon" xmlns="http://www.w3.org/2000/svg" width="17" height="28" viewBox="0 0 17 28">\
            <path id="Pin_2" data-name="Pin 2" d="M8.5,0A8.444,8.444,0,0,0,0,8.4C0,14.7,8.5,24,8.5,24S17,14.7,17,8.4A8.444,8.444,0,0,0,8.5,0Z" fill="#fff"/>\
            <path id="Pin_1" data-name="Pin 1" d="M7.887,0A7.85,7.85,0,0,0,0,7.825c0,5.869,7.887,14.532,7.887,14.532s7.887-8.664,7.887-14.532A7.85,7.85,0,0,0,7.887,0Z" transform="translate(0.631 0.643)" fill="#95a124"/>\
            <path id="Individual" d="M9.119,8.437A1.227,1.227,0,1,0,7.892,7.209,1.224,1.224,0,0,0,9.119,8.437ZM5.437,7.946A1.473,1.473,0,1,0,3.964,6.473,1.467,1.467,0,0,0,5.437,7.946ZM9.119,9.419c-.9,0-2.7.452-2.7,1.35v1.1h5.4v-1.1C11.819,9.87,10.017,9.419,9.119,9.419ZM5.437,8.928C4.293,8.928,2,9.5,2,10.646v1.227H5.437v-1.1A1.935,1.935,0,0,1,6.6,9.065,6.031,6.031,0,0,0,5.437,8.928Z" transform="translate(1.613 -0.545)" fill="#fff"/>\
            </svg>'
            )
        }

        starIcon = {
          path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
          fillColor: '#95a124', //color of the marker
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#95a124',
          scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
          // eslint-disable-next-line no-undef
          origin: new google.maps.Point(0, 0),
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          // eslint-disable-next-line no-undef
          scaledSize: new google.maps.Size(20, 20),
          // eslint-disable-next-line no-undef
          labelOrigin: new google.maps.Point(9, 8)
        }
      } else if (type === 'Employee Sponsored') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="24" viewBox="0 0 17 24">\
              <g  transform="translate(22355.631 16691.643)">\
              <path d="M8.5,0A8.444,8.444,0,0,0,0,8.4C0,14.7,8.5,24,8.5,24S17,14.7,17,8.4A8.444,8.444,0,0,0,8.5,0Z" transform="translate(-22355.631 -16691.643)" fill="#fff"></path>\
              <path d="M-1732.113,3033.715h0a51.032,51.032,0,0,1-3.943-5.065c-1.8-2.645-3.943-6.435-3.943-9.467a7.743,7.743,0,0,1,2.308-5.535,7.868,7.868,0,0,1,5.579-2.29,7.868,7.868,0,0,1,5.578,2.29,7.744,7.744,0,0,1,2.308,5.535c0,3.032-2.144,6.822-3.943,9.467a51.032,51.032,0,0,1-3.943,5.065Zm-4.692-19.182v8.607h9.563v-6.694h-4.781v-1.913Zm8.607,7.65h-3.825v-.956h.956v-.957h-.956v-.956h.956v-.957h-.956v-.956h3.825v4.78Zm-1.913-1.912v.957h.956v-.957Zm0-1.913v.957h.956v-.957Zm-2.869,3.825h-.956v-.956h.956v.955Zm-1.912,0h-.956v-.956h.956v.955Zm1.912-1.912h-.956v-.956h.956v.955Zm-1.912,0h-.956v-.956h.956v.955Zm1.912-1.913h-.956v-.956h.956v.955Zm-1.912,0h-.956v-.956h.956v.955Zm1.912-1.912h-.956v-.956h.956v.955Zm-1.912,0h-.956v-.956h.956v.955Z" transform="translate(-20615 -19702.357)" fill="#dc0d0d"/>\
              </g>\
            </svg>'
            )
        }

        starIcon = {
          path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
          fillColor: '#ff4040', //color of the marker
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ff4040',
          scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
          // eslint-disable-next-line no-undef
          origin: new google.maps.Point(0, 0),
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          // eslint-disable-next-line no-undef
          scaledSize: new google.maps.Size(20, 20),
          // eslint-disable-next-line no-undef
          labelOrigin: new google.maps.Point(9, 8)
        }
      } else if (type === 'Municipalities') {
        pinIcon = {
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          url:
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
              '<svg id="Municipal_pin_icon" xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 24">\
                <path id="Exclusion_1" data-name="Exclusion 1" d="M8.5,0A8.444,8.444,0,0,0,0,8.4C0,14.7,8.5,24,8.5,24S17,14.7,17,8.4A8.444,8.444,0,0,0,8.5,0Z" fill="#fff"/>\
                <path id="Exclusion_2" data-name="Exclusion 2" d="M7.887,0A7.85,7.85,0,0,0,0,7.825c0,5.869,7.887,14.532,7.887,14.532s7.887-8.664,7.887-14.532A7.85,7.85,0,0,0,7.887,0Z" transform="translate(0.631 0.643)" fill="#e99200"/>\
                <path id="Municipal_icon" d="M20690,19757v-1h10v1Zm7-2v-4h2v4Zm-3,0v-4h2v4Zm-3,0v-4h2v4Zm-1-5v-1l5-2.5,5,2.5v1Z" transform="translate(-20686.369 -19744)" fill="#fff"/>\
              </svg>'
            )
        }

        starIcon = {
          path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
          fillColor: '#ff4040', //color of the marker
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ff4040',
          scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
          // eslint-disable-next-line no-undef
          origin: new google.maps.Point(0, 0),
          // eslint-disable-next-line no-undef
          anchor: new google.maps.Point(16, 16),
          // eslint-disable-next-line no-undef
          scaledSize: new google.maps.Size(20, 20),
          // eslint-disable-next-line no-undef
          labelOrigin: new google.maps.Point(9, 8)
        }
      }
      return element.isStarred ? starIcon : pinIcon
    },
    async setCenterPin(that, zipcode) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(function (resolve, reject) {
        if (that.defaultMarker && that.defaultMarker.length > 0) {
          that.defaultMarker.forEach((element, index) => {
            that.defaultMarker[index].setMap(null)
          })
        }
        // eslint-disable-next-line no-undef
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode(
          {
            address: `zipcode: ${zipcode ? zipcode : that.$store.state.user.zipCode}`
          },
          function (results, status) {
            if (status === 'OK') {
              if (that.map) {
                that.map.setCenter(results[0].geometry.location)
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
                  map: that.map,
                  icon: icon
                })
                that.defaultMarker.push(marker)
              }
              resolve(results[0].geometry.location)
            } else {
              // eslint-disable-next-line no-undef
              if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                // eslint-disable-next-line no-console
                console.log('Query Limit')
                setTimeout(function () {
                  that.GoogleMap()
                }, 2000)
              } else {
                // eslint-disable-next-line no-console
                console.log('Geocode was not successful for the following reason: ' + status)
                resolve(status)
              }
            }
          }
        )
      })
    },
    highlightMarker(dataObj) {
      var index = this.markers.findIndex((a) => a.PLANID === dataObj.PLANID)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(this.markers[index], 'click')
        this.$parent.rowcolor = 'background-color:white'
        this.$parent.selectedRowPadding = ''
      }
    },
    highlightStarMarker(val, type) {
      var index = -1
      if (type === 'employee') {
        index = this.starMarkers.findIndex((a) => a.PLANID === val)
      } else if (type === 'individual') {
        index = this.starMarkers.findIndex((a) => a.AccountId === val)
      } else if (type === 'school') {
        index = this.starMarkers.findIndex((a) => a.schoolDistrictId === val)
      } else if (type === 'municipalities') {
        index = this.starMarkers.findIndex((a) => a.PLANID === val)
      }
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(this.starMarkers[index], 'click')
        this.$parent.rowcolor = 'background-color:white'
        this.$parent.selectedRowPadding = ''
      }
    },
    hideAllInfoWindows(map) {
      this.markers.forEach(function (marker) {
        marker.infowindow.close(map, marker)
      })
      this.markers1.forEach(function (marker) {
        marker.infowindow.close(map, marker)
      })
      this.individualMarkers.forEach(function (marker) {
        marker.infowindow.close(map, marker)
      })
      this.municipalityMarkers.forEach(function (marker) {
        marker.infowindow.close(map, marker)
      })
      this.starMarkers.forEach(function (marker) {
        marker.infowindow.close(map, marker)
      })
    },
    setClientMarker(val) {
      clearTimeout(this.timer)
      if (this.clientResult.length > 0) {
        if (val) {
          for (var i = 0; i < this.markers1.length; i++) {
            this.markers1[i].setMap(null)
          }
          this.clientResult.forEach((element, index) => {
            var address =
              element.PlanSponsorBillingStreet +
              ',' +
              element.PlanSponsorBillingCity +
              ',' +
              element.PlanSponsorBillingState +
              ',' +
              element.PlanSponsorBillingPostalCode
            if (element.PlanSponsorLatitude && element.PlanSponsorLongitude) {
              var latlng = {
                lat: parseFloat(element.PlanSponsorLatitude),
                lng: parseFloat(element.PlanSponsorLongitude)
              }
              this.callClientMarker(this.map, element.PLANNAME, address, element.EIN, index, latlng, element.DCPTYPE)
            }
          })
        } else {
          for (i = 0; i < this.markers1.length; i++) {
            this.markers1[i].setMap(null)
          }
          this.markers1 = new Array()
        }
      } else {
        this.$emit('resetclient')
      }
    },
    callClientMarker(map, NAME, address, planId, i, latlng, planType) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      var icon = {
        path: 'M256,0C156.698,0,76,80.7,76,180c0,33.6,9.302,66.301,27.001,94.501l140.787,230.414 c2.402,3.9,6.002,6.301,10.203,6.901c5.698,0.899,12.001-1.5,15.3-7.2l141.2-232.516C427.299,244.501,436,212.401,436,180 C436,80.7,355.302,0,256,0z M256,270c-50.398,0-90-40.8-90-90c0-49.501,40.499-90,90-90s90,40.499,90,90 C346,228.9,306.999,270,256,270z', //SVG path of awesomefont marker
        fillColor: '#0969b0', //color of the marker
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#0969b0',
        scale: 0.05, //size of the marker, careful! this scale also affects anchor and labelOrigin
        // eslint-disable-next-line no-undef
        origin: new google.maps.Point(0, 0),
        // eslint-disable-next-line no-undef
        anchor: new google.maps.Point(0, 20),
        // eslint-disable-next-line no-undef
        scaledSize: new google.maps.Size(20, 20),
        // eslint-disable-next-line no-undef
        labelOrigin: new google.maps.Point(9, 8)
      }
      window.livePlanInfo = function (planId, planType) {
        that.clientPlanInfo(planId, planType)
      }
      // eslint-disable-next-line no-undef
      var marker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: that.map,
        infowindow: infowindow
      })
      that.markers1.push(marker)

      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        marker,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(this.map, infowindow)
            infowindow.setContent(
              `<h4><a class="text-hyperlink" onclick="livePlanInfo('${planId.toString()}', '${planType.toString()}')" style="font-weight: 600;">
                    ${NAME}
                    </a></h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(this.map, marker)
          }
        })(marker)
      )
    },
    clientPlanInfo(seinpno, planType) {
      if (seinpno) {
        this.$router.push({
          name: 'TALPlan',
          params: { id: seinpno, planType: planType }
        })
      }
    },
    toggleEmployeeSponserIcon(ele, type) {
      this.markers.forEach((element, index) => {
        if (element.PLANID === ele.PLANID) {
          this.markers[index].setMap(null)
          let latlng = {
            lat: parseFloat(ele.PlanSponsorLatitude),
            lng: parseFloat(ele.PlanSponsorLongitude)
          }
          let address =
            ele.PlanSponsorBillingStreet +
            ',' +
            ele.PlanSponsorBillingCity +
            ',' +
            ele.PlanSponsorBillingState +
            ' ' +
            ele.PlanSponsorBillingPostalCode
          let that = this
          // eslint-disable-next-line no-undef
          let infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
          let newIcon = this.getIcons(ele, type)
          // eslint-disable-next-line no-undef
          let marker = new google.maps.Marker({
            position: latlng,
            icon: newIcon,
            map: that.map,
            infowindow: infowindow
          })
          // eslint-disable-next-line no-undef
          google.maps.event.addListener(
            marker,
            'click',
            (function () {
              return function () {
                that.hideAllInfoWindows(that.map, infowindow)
                that.$parent.rowcolor = 'background-color:white'
                that.$parent.shakeMarker = ''
                that.$parent.selectedRowPadding = ''

                infowindow.setContent(
                  `<h4><a class="text-hyperlink" onclick="markerInfo('${ele.PLANID.toString()}')" style="font-weight: 600;">
                        ${ele.NAME}
                        </a></h4>
                        <p>
                        <span class="text-black">
                        ${address}
                        </span>
                        </p>`
                )
                infowindow.open(that.map, marker)
                that.$parent.rowcolor = 'selected_row elevation-4'
                that.$parent.shakeMarker = 'face'
                that.$parent.selectedRowPadding = 'pt-4 pb-4'
                //lastWindow = infowindow
                that.$parent.mapselectedSEINPNO = ele.SEINPNO
                that.timer = setTimeout(function () {
                  that.$parent.rowcolor = 'background-color:white'
                  that.$parent.selectedRowPadding = ''
                }, 2000)
              }
            })(marker, index)
          )
          marker.setValues({
            PLANID: ele.PLANID
          })
          marker.setValues({ isStarred: ele.isStarred ? true : false })
          this.markers[index] = marker
        }
      })
    },
    setProspectMarker(locations, isChecked, isUncheckedAll, type) {
      clearTimeout(this.timer)
      if (isUncheckedAll) {
        for (let l = 0; l < this.markers1.length; l++) {
          this.markers1[l].setMap(null)
        }
        for (let m = 0; m < this.starMarkers.length; m++) {
          this.starMarkers[m].setMap(null)
        }
      }
      if (isChecked) {
        for (let k = 0; k < this.markers.length; k++) {
          if (this.markers[k].PLANID) {
            this.markers[k].setMap(null)
          }
        }
        locations.forEach((element, index) => {
          let address =
            element.PlanSponsorBillingStreet +
            ',' +
            element.PlanSponsorBillingCity +
            ',' +
            element.PlanSponsorBillingState +
            ' ' +
            element.PlanSponsorBillingPostalCode
          if (element.PlanSponsorLatitude && element.PlanSponsorLongitude) {
            let latlng = {
              lat: parseFloat(element.PlanSponsorLatitude),
              lng: parseFloat(element.PlanSponsorLongitude)
            }
            this.drawProspectMarker(
              this.map,
              element.NAME,
              address,
              element.PLANID,
              element,
              this.getIcons(element, type),
              index,
              latlng
            )
          }
        })
      } else {
        for (let j = 0; j < this.markers.length; j++) {
          if (this.markers[j].PLANID) {
            this.markers[j].setMap(null)
          }
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    drawProspectMarker(map, companyName, address, PLANID, Obj, icon, i, latlng) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var marker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      marker.setValues({ PLANID: PLANID })
      marker.setValues({ isStared: Obj.isStarred ? true : false })
      that.markers.push(marker)
      window.markerPlanInfo = function (PLANID) {
        that.planInfo(PLANID, '', 'Employee')
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        marker,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            that.$parent.rowcolor = 'background-color:white'
            that.$parent.shakeMarker = ''
            that.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<h4><a class="text-hyperlink" onclick="markerPlanInfo('${PLANID.toString()}')" style="font-weight: 600;">
                    ${companyName}
                    </a></h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, marker)
            that.$parent.rowcolor = 'selected_row elevation-4'
            that.$parent.shakeMarker = 'face'
            that.$parent.selectedRowPadding = 'pt-4 pb-4'
            //lastWindow = infowindow
            that.$parent.mapselectedPLANID = PLANID
            that.timer = setTimeout(function () {
              that.$parent.rowcolor = 'background-color:white'
              that.$parent.selectedRowPadding = ''
            }, 2000)
            map.setCenter(marker.getPosition())
          }
        })(marker, i)
      )
    },
    resetProspectMarker() {
      for (var j = 0; j < this.markers.length; j++) {
        if (this.markers[j].PLANID) {
          this.markers[j].setMap(null)
        }
      }
    },
    setStarMarker(locations) {
      for (var i = 0; i < locations.length; i++) {
        var address =
          locations[i].PlanSponsorBillingStreet +
          ',' +
          locations[i].PlanSponsorBillingCity +
          ',' +
          locations[i].PlanSponsorBillingState +
          ' ' +
          locations[i].PlanSponsorBillingPostalCode

        var latlng = {
          lat: parseFloat(locations[i].PlanSponsorLatitude),
          lng: parseFloat(locations[i].PlanSponsorLongitude)
        }
        if (locations[i].PlanSponsorLatitude && locations[i].PlanSponsorLongitude) {
          this.callStarMarker(this.map, locations[i].NAME, address, locations[i].PLANID, i, latlng)
        }
      }
    },
    callStarMarker(map, companyName, address, PLANID, i, latlng) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      var icon = {
        path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
        fillColor: '#ff4040', //color of the marker
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ff4040',
        scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
        // eslint-disable-next-line no-undef
        origin: new google.maps.Point(0, 0),
        // eslint-disable-next-line no-undef
        anchor: new google.maps.Point(0, 20),
        // eslint-disable-next-line no-undef
        scaledSize: new google.maps.Size(20, 20),
        // eslint-disable-next-line no-undef
        labelOrigin: new google.maps.Point(9, 8)
      }
      // eslint-disable-next-line no-undef
      var marker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      marker.setValues({ PLANID: PLANID })
      that.starMarkers.push(marker)
      window.markerPlanInfo = function (PLANID) {
        that.planInfo(PLANID)
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        marker,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            infowindow.setContent(
              `<h4><a class="text-hyperlink" onclick="markerPlanInfo('${PLANID.toString()}')" style="font-weight: 600;">
                    ${companyName}
                    </a></h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, marker)
          }
        })(marker, i)
      )
    },
    drawSchoolDistrictMarker(map, name, address, planId, Obj, icon, i, latlng) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })

      // eslint-disable-next-line no-undef
      var markerSchool = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      markerSchool.setValues({ schoolPlanId: planId })
      if (Obj.isStarred) {
        markerSchool.setValues({ isSchoolStarred: true })
      }
      that.markers.push(markerSchool)
      window.markerSchoolInfo = function (planId) {
        that.planInfo(planId, '', 'School')
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerSchool,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            that.$parent.rowcolor = 'background-color:white'
            that.$parent.shakeMarker = ''
            that.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<h4><a class="text-hyperlink" onclick="markerSchoolInfo('${planId.toString()}')" style="font-weight: 600;">
                    ${name}
                    </a></h4>
                    <p>
                    <span class="text-black">
                    ${address}
                    </span>
                    </p>`
            )
            infowindow.open(that.map, markerSchool)
          }
        })(markerSchool, i)
      )
    },
    setSchoolDistrictStarMarker(locations) {
      for (var i = 0; i < locations.length; i++) {
        let address =
          locations[i].PlanSponsorBillingStreet +
          ',' +
          locations[i].PlanSponsorBillingCity +
          ',' +
          locations[i].PlanSponsorBillingState +
          ' ' +
          locations[i].PlanSponsorBillingPostalCode

        if (locations[i].PlanSponsorLatitude && locations[i].PlanSponsorLongitude) {
          var latlng = {
            lat: parseFloat(locations[i].PlanSponsorLatitude),
            lng: parseFloat(locations[i].PlanSponsorLongitude)
          }
          this.callSchoolDistrictStarMarker(this.map, locations[i].NAME, address, locations[i].PLANID, i, latlng)
        }
      }
      //end
    },
    callSchoolDistrictStarMarker(map, schoolDistrictName, schoolDistrictAddress, planId, i, latlng) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      var icon = {
        path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
        fillColor: '#24a194', //color of the marker
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#24a194',
        scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
        // eslint-disable-next-line no-undef
        origin: new google.maps.Point(0, 0),
        // eslint-disable-next-line no-undef
        anchor: new google.maps.Point(0, 20),
        // eslint-disable-next-line no-undef
        scaledSize: new google.maps.Size(20, 20),
        // eslint-disable-next-line no-undef
        labelOrigin: new google.maps.Point(9, 8)
      }
      // eslint-disable-next-line no-undef
      var marker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      // that.starMarkers.push(marker)
      marker.setValues({ schoolPlanId: planId })
      that.markers.push(marker)
      window.markerSchoolInfo = function (planId) {
        that.planInfo(planId, '', 'School')
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        marker,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            infowindow.setContent(
              `<h4><a class="text-hyperlink" onclick="markerSchoolInfo('${planId.toString()}')" style="font-weight: 600;">
                    ${schoolDistrictName}
                    </a></h4>
                    <p>
                    <span class="text-black">
                    ${schoolDistrictAddress}
                    </span>
                    </p>`
            )
            infowindow.open(that.map, marker)
          }
        })(marker, i)
      )
    },
    highlightSchoolMarker(schoolPlanId) {
      var index = this.markers.findIndex((a) => a.schoolPlanId === schoolPlanId)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(this.markers[index], 'click')
        this.$parent.rowcolor = 'background-color:white'
        this.$parent.selectedRowPadding = ''
      }
    },
    resetSchoolMarker() {
      for (var j = 0; j < this.markers.length; j++) {
        if (this.markers[j].schoolPlanId && !this.markers[j].isSchoolStarred) {
          this.markers[j].setMap(null)
        }
      }
    },
    setSchoolDistrictMarker(locations, type) {
      locations.forEach((element, index) => {
        if (element.PlanSponsorLatitude && element.PlanSponsorLongitude) {
          var address =
            element.PlanSponsorBillingStreet +
            ',' +
            element.PlanSponsorBillingCity +
            ',' +
            element.PlanSponsorBillingState +
            ' ' +
            element.PlanSponsorBillingPostalCode
          var latlng = {
            lat: parseFloat(element.PlanSponsorLatitude),
            lng: parseFloat(element.PlanSponsorLongitude)
          }
          this.drawSchoolDistrictMarker(
            this.map,
            element.NAME,
            address,
            element.PLANID,
            element,
            this.getIcons(element, type),
            index,
            latlng
          )
        }
      })
      //end
    },
    toggleSchoolIcon(ele, type) {
      this.markers.forEach((element, index) => {
        if (element.schoolPlanId === ele.PLANID) {
          this.markers[index].setMap(null)
          let latlng = {
            lat: parseFloat(ele.PlanSponsorLatitude),
            lng: parseFloat(ele.PlanSponsorLongitude)
          }
          let address =
            ele.PlanSponsorBillingStreet +
            ',' +
            ele.PlanSponsorBillingCity +
            ',' +
            ele.PlanSponsorBillingState +
            ' ' +
            ele.PlanSponsorBillingPostalCode
          let that = this
          // eslint-disable-next-line no-undef
          let infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
          let newIcon = this.getIcons(ele, type)
          // eslint-disable-next-line no-undef
          let markerSchool = new google.maps.Marker({
            position: latlng,
            icon: newIcon,
            map: that.map,
            infowindow: infowindow
          })
          // eslint-disable-next-line no-undef
          google.maps.event.addListener(
            markerSchool,
            'click',
            (function () {
              return function () {
                that.hideAllInfoWindows(that.map, infowindow)
                that.$parent.rowcolor = 'background-color:white'
                that.$parent.shakeMarker = ''
                that.$parent.selectedRowPadding = ''

                infowindow.setContent(
                  `<h4><a class="text-hyperlink" onclick="markerSchoolInfo('${ele.PLANID.toString()}')" style="font-weight: 600;">
                        ${ele.NAME}
                        </a></h4>
                        <p>
                        <span class="text-black">
                        ${address}
                        </span>
                        </p>`
                )
                infowindow.open(that.map, markerSchool)
              }
            })(markerSchool, index)
          )
          markerSchool.setValues({ schoolPlanId: ele.PLANID })
          markerSchool.setValues({
            isSchoolStarred: ele.isStarred ? true : false
          })
          this.markers[index] = markerSchool
        }
      })
    },
    setIndividualStarMarker(locations) {
      //for Individual household star
      locations.forEach((element, index) => {
        if (element.Latitude && element.Longitude) {
          var latlng = {
            lat: parseFloat(element.Latitude),
            lng: parseFloat(element.Longitude)
          }
          this.drawIndividualStarMarker(element.AccountName, element.AccountId, element.Address, index, latlng, this.map)
        }
      })
      //end
    },
    drawIndividualStarMarker(name, accountId, address, i, latlng, map) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      var icon = {
        path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
        fillColor: '#95a124', //color of the marker
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#95a124',
        scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
        // eslint-disable-next-line no-undef
        origin: new google.maps.Point(0, 0),
        // eslint-disable-next-line no-undef
        anchor: new google.maps.Point(0, 20),
        // eslint-disable-next-line no-undef
        scaledSize: new google.maps.Size(20, 20),
        // eslint-disable-next-line no-undef
        labelOrigin: new google.maps.Point(9, 8)
      }
      // eslint-disable-next-line no-undef
      var individualStarMarker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      that.starMarkers.push(individualStarMarker)
      window.markerIndividualHouseholdInfo = function (accountId) {
        that.individualHouseholdInfo(accountId)
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        individualStarMarker,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            infowindow.setContent(
              `<h4 style="font-weight: 600 !important;">${name}</h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, individualStarMarker)
          }
        })(individualStarMarker, i)
      )
    },
    resetStaredMarker() {
      for (var j = 0; j < this.starMarkers.length; j++) {
        this.starMarkers[j].setMap(null)
      }
    },
    toggleIndividualIcon(ele, type) {
      this.individualMarkers.forEach((element, index) => {
        var latlng
        if (ele.AccountId) {
          if (element.individualPlanId === ele.AccountId) {
            this.individualMarkers[index].setMap(null)
            latlng = {
              lat: parseFloat(ele.Latitude),
              lng: parseFloat(ele.Longitude)
            }
            this.set(ele, type, latlng, index)
          }
        }
      })
    },
    drawIndividualHouseholdMarker(name, address, plandId, Obj, icon, i, latlng, map) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var markerIndividualHousehold = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      markerIndividualHousehold.setValues({ individualPlanId: plandId })
      markerIndividualHousehold.setValues({
        isIndividualStarred: Obj.isStarred ? true : false
      })
      that.individualMarkers.push(markerIndividualHousehold)
      window.markerIndividualHouseholdInfo = function (plandId) {
        that.individualHouseholdInfo(plandId)
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerIndividualHousehold,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            that.$parent.rowcolor = 'background-color:white'
            that.$parent.shakeMarker = ''
            that.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<h4 style="font-weight: 600 !important;">${name}</h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, markerIndividualHousehold)
          }
        })(markerIndividualHousehold, i)
      )
    },
    set(ele, type, latlng, index) {
      let that = this
      // eslint-disable-next-line no-undef
      let infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      let newIcon = this.getIcons(ele, type)
      // eslint-disable-next-line no-undef
      let markerIndividualHousehold = new google.maps.Marker({
        position: latlng,
        icon: newIcon,
        map: that.map,
        infowindow: infowindow
      })
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerIndividualHousehold,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            that.$parent.rowcolor = 'background-color:white'
            that.$parent.shakeMarker = ''
            that.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<h4><a class="text-hyperlink" onclick="markerIndividualHouseholdInfo('${ele.AccountId.toString()}')" style="font-weight: 600;">
                    ${ele.AccountName}
                    </a></h4>
                    <p>
                    <span class="text-black">
                    ${ele.Address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, markerIndividualHousehold)
          }
        })(markerIndividualHousehold, index)
      )
      markerIndividualHousehold.setValues({
        individualPlanId: ele.PLANID
      })
      markerIndividualHousehold.setValues({
        isIndividualStarred: ele.isStarred ? true : false
      })
      that.individualMarkers[index] = markerIndividualHousehold
    },
    // eslint-disable-next-line no-unused-vars
    setIndividualHouseholdMarker(locations, type) {
      if (locations) {
        locations.forEach((element, index) => {
          if (element.Latitude && element.Longitude) {
            var latlng = {
              lat: parseFloat(element.Latitude),
              lng: parseFloat(element.Longitude)
            }
            this.drawIndividualHouseholdMarker(
              element.AccountName,
              element.Address,
              element.AccountId,
              element,
              this.getIcons(element, type),
              index,
              latlng,
              this.map
            )
          }
        })
      }
    },
    resetIndividualMarker() {
      for (var j = 0; j < this.individualMarkers.length; j++) {
        if (this.individualMarkers[j].individualPlanId && !this.individualMarkers[j].isIndividualStarred) {
          this.individualMarkers[j].setMap(null)
        }
      }
    },
    highlightIndividualMarker(individualPlanId) {
      var index = this.individualMarkers.findIndex((a) => a.individualPlanId === individualPlanId)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(this.individualMarkers[index], 'click')
        this.$parent.rowcolor = 'background-color:white'
        this.$parent.selectedRowPadding = ''
      }
    },
    toggleMunicipalitiesIcon(ele, type) {
      this.municipalityMarkers.forEach((element, index) => {
        if (element.PLANID === ele.PLANID) {
          this.municipalityMarkers[index].setMap(null)
          let latlng = {
            lat: parseFloat(ele.PlanSponsorLatitude),
            lng: parseFloat(ele.PlanSponsorLongitude)
          }
          let address =
            ele.PlanSponsorBillingStreet +
            ',' +
            ele.PlanSponsorBillingCity +
            ',' +
            ele.PlanSponsorBillingState +
            ' ' +
            ele.PlanSponsorBillingPostalCode
          let that = this
          // eslint-disable-next-line no-undef
          let infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
          let newIcon = this.getIcons(ele, type)
          // eslint-disable-next-line no-undef
          let marker = new google.maps.Marker({
            position: latlng,
            icon: newIcon,
            map: that.map,
            infowindow: infowindow
          })
          // eslint-disable-next-line no-undef
          google.maps.event.addListener(
            marker,
            'click',
            (function () {
              return function () {
                that.hideAllInfoWindows(that.map, infowindow)
                that.$parent.rowcolor = 'background-color:white'
                that.$parent.shakeMarker = ''
                that.$parent.selectedRowPadding = ''

                infowindow.setContent(
                  `<h4><a class="text-hyperlink" onclick="markerInfo('${ele.PLANID.toString()}')" style="font-weight: 600;">
                        ${ele.NAME}
                        </a></h4>
                        <p>
                        <span class="text-black">
                        ${address}
                        </span>
                        </p>`
                )
                infowindow.open(that.map, marker)
                that.$parent.rowcolor = 'selected_row elevation-4'
                that.$parent.shakeMarker = 'face'
                that.$parent.selectedRowPadding = 'pt-4 pb-4'
                //lastWindow = infowindow
                that.$parent.mapselectedSEINPNO = ele.SEINPNO
                that.timer = setTimeout(function () {
                  that.$parent.rowcolor = 'background-color:white'
                  that.$parent.selectedRowPadding = ''
                }, 2000)
              }
            })(marker, index)
          )
          marker.setValues({
            PLANID: ele.PLANID
          })
          marker.setValues({ isStarred: ele.isStarred ? true : false })
          this.municipalityMarkers[index] = marker
        }
      })
    },
    setMunicipalitiesMarker(locations, type) {
      for (let k = 0; k < this.municipalityMarkers.length; k++) {
        if (this.municipalityMarkers[k].PLANID) {
          this.municipalityMarkers[k].setMap(null)
        }
      }
      locations.forEach((element, index) => {
        let address =
          element.PlanSponsorBillingStreet +
          ',' +
          element.PlanSponsorBillingCity +
          ',' +
          element.PlanSponsorBillingState +
          ' ' +
          element.PlanSponsorBillingPostalCode
        if (element.PlanSponsorLatitude && element.PlanSponsorLongitude) {
          let latlng = {
            lat: parseFloat(element.PlanSponsorLatitude),
            lng: parseFloat(element.PlanSponsorLongitude)
          }
          this.drawMunicipalitiesMarker(
            this.map,
            element.NAME,
            address,
            element.PLANID,
            element,
            this.getIcons(element, type),
            index,
            latlng
          )
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    drawMunicipalitiesMarker(map, companyName, address, PLANID, Obj, icon, i, latlng) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      // eslint-disable-next-line no-undef
      var marker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      marker.setValues({ PLANID: PLANID })
      marker.setValues({ isStared: Obj.isStarred ? true : false })
      that.municipalityMarkers.push(marker)
      window.markerMunicipalitiesInfo = function (PLANID) {
        that.planInfo(PLANID, '', 'Municipalities')
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        marker,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            that.$parent.rowcolor = 'background-color:white'
            that.$parent.shakeMarker = ''
            that.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<h4><a class="text-hyperlink" onclick="markerMunicipalitiesInfo('${PLANID.toString()}')" style="font-weight: 600;">
                    ${companyName}
                    </a></h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, marker)
            that.$parent.rowcolor = 'selected_row elevation-4'
            that.$parent.shakeMarker = 'face'
            that.$parent.selectedRowPadding = 'pt-4 pb-4'
            //lastWindow = infowindow
            that.$parent.mapselectedPLANID = PLANID
            that.timer = setTimeout(function () {
              that.$parent.rowcolor = 'background-color:white'
              that.$parent.selectedRowPadding = ''
            }, 2000)
            map.setCenter(marker.getPosition())
          }
        })(marker, i)
      )
    },
    resetMunicipalitiesMarker() {
      for (var v = 0; v < this.municipalityMarkers.length; v++) {
        if (this.municipalityMarkers[v].PLANID) {
          this.municipalityMarkers[v].setMap(null)
        }
      }
    },
    highlightMunicipalMarker(dataObj) {
      var index = this.municipalityMarkers.findIndex((a) => a.PLANID === dataObj.PLANID)
      if (index > -1) {
        // eslint-disable-next-line no-undef
        google.maps.event.trigger(this.municipalityMarkers[index], 'click')
        this.$parent.rowcolor = 'background-color:white'
        this.$parent.selectedRowPadding = ''
      }
    },
    setParticipantsMarker(locations) {
      if (locations) {
        locations.forEach((element, index) => {
          var address = element.streetAddress + ',' + element.city + ',' + element.state + ' ' + element.zipCode
          if (element.latitude && element.longitude) {
            var latlng = {
              lat: parseFloat(element.latitude),
              lng: parseFloat(element.longitude)
            }
            this.drawParticipantsHouseholdMarker(element.name, address, element.householdID, index, latlng, this.map)
          }
        })
      }
    },
    drawParticipantsHouseholdMarker(name, address, householdId, i, latlng, map) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      var icon = {
        // eslint-disable-next-line no-undef
        anchor: new google.maps.Point(16, 16),
        url:
          'data:image/svg+xml;utf-8,' +
          encodeURIComponent(
            '<svg id="Individual_pin_Icon" xmlns="http://www.w3.org/2000/svg" width="17" height="28" viewBox="0 0 17 28">\
            <path id="Pin_2" data-name="Pin 2" d="M8.5,0A8.444,8.444,0,0,0,0,8.4C0,14.7,8.5,24,8.5,24S17,14.7,17,8.4A8.444,8.444,0,0,0,8.5,0Z" fill="#fff"/>\
            <path id="Pin_1" data-name="Pin 1" d="M7.887,0A7.85,7.85,0,0,0,0,7.825c0,5.869,7.887,14.532,7.887,14.532s7.887-8.664,7.887-14.532A7.85,7.85,0,0,0,7.887,0Z" transform="translate(0.631 0.643)" fill="#95a124"/>\
            <path id="Individual" d="M9.119,8.437A1.227,1.227,0,1,0,7.892,7.209,1.224,1.224,0,0,0,9.119,8.437ZM5.437,7.946A1.473,1.473,0,1,0,3.964,6.473,1.467,1.467,0,0,0,5.437,7.946ZM9.119,9.419c-.9,0-2.7.452-2.7,1.35v1.1h5.4v-1.1C11.819,9.87,10.017,9.419,9.119,9.419ZM5.437,8.928C4.293,8.928,2,9.5,2,10.646v1.227H5.437v-1.1A1.935,1.935,0,0,1,6.6,9.065,6.031,6.031,0,0,0,5.437,8.928Z" transform="translate(1.613 -0.545)" fill="#fff"/>\
            </svg>'
          )
      }
      // eslint-disable-next-line no-undef
      var markerParticipantsHousehold = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      markerParticipantsHousehold.setValues({
        participantsIndividualId: householdId
      })
      that.markers.push(markerParticipantsHousehold)
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        markerParticipantsHousehold,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            that.$parent.rowcolor = 'background-color:white'
            that.$parent.shakeMarker = ''
            that.$parent.selectedRowPadding = ''

            infowindow.setContent(
              `<h4 style="font-weight: 600 !important;">${name}</h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, markerParticipantsHousehold)
          }
        })(markerParticipantsHousehold, i)
      )
    },
    drawParticipantsStarMarker(name, address, household, i, latlng, map) {
      var that = this
      // eslint-disable-next-line no-undef
      var infowindow = new google.maps.InfoWindow({ maxWidth: 300 })
      var icon = {
        path: 'M19.2,21.5l-5.566-3.335L8.067,21.5l1.474-6.29L4.633,10.985l6.474-.549L13.633,4.5l2.526,5.924,6.474.549L17.725,15.2Z', //SVG path of awesomefont marker
        fillColor: '#95a124', //color of the marker
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#95a124',
        scale: 0.9, //size of the marker, careful! this scale also affects anchor and labelOrigin
        // eslint-disable-next-line no-undef
        origin: new google.maps.Point(0, 0),
        // eslint-disable-next-line no-undef
        anchor: new google.maps.Point(16, 16),
        // eslint-disable-next-line no-undef
        scaledSize: new google.maps.Size(20, 20),
        // eslint-disable-next-line no-undef
        labelOrigin: new google.maps.Point(9, 8)
      }
      // eslint-disable-next-line no-undef
      var individualStarMarker = new google.maps.Marker({
        position: latlng,
        icon: icon,
        map: map,
        infowindow: infowindow
      })
      individualStarMarker.setValues({
        participantsIndividualId: household
      })
      that.markers.push(individualStarMarker)
      window.markerIndividualHouseholdInfo = function (accountId) {
        that.individualHouseholdInfo(accountId)
      }
      // eslint-disable-next-line no-undef
      google.maps.event.addListener(
        individualStarMarker,
        'click',
        (function () {
          return function () {
            that.hideAllInfoWindows(that.map, infowindow)
            infowindow.setContent(
              `<h4 style="font-weight: 600 !important;">${name}</h4>
                    <p>
                    <span class="text-black">
                    ${address} 
                    </span>
                    </p>`
            )
            infowindow.open(that.map, individualStarMarker)
          }
        })(individualStarMarker, i)
      )
    },
    setParticipantsStarMarker(locations) {
      //for Individual household star
      locations.forEach((element, index) => {
        var address = element.streetAddress + ',' + element.city + ',' + element.state + ' ' + element.zipCode
        if (element.latitude && element.longitude) {
          var latlng = {
            lat: parseFloat(element.latitude),
            lng: parseFloat(element.longitude)
          }
          this.drawParticipantsStarMarker(element.name, address, element.householdID, index, latlng, this.map)
        }
      })
      //end
    },
    highlightParticipantsMarker(householdId, type) {
      var index = this.markers.findIndex((a) => a.participantsIndividualId === householdId)
      if (index > -1) {
        if (type === 'star') {
          // eslint-disable-next-line no-undef
          google.maps.event.trigger(this.starMarkers[index], 'click')
        } else {
          // eslint-disable-next-line no-undef
          google.maps.event.trigger(this.markers[index], 'click')
        }
        this.$parent.rowcolor = 'background-color:white'
        this.$parent.selectedRowPadding = ''
      }
    },
    resetParticipantsMarker() {
      for (var j = 0; j < this.markers.length; j++) {
        if (this.markers[j].participantsIndividualId) {
          this.markers[j].setMap(null)
        }
      }
      for (var k = 0; k < this.starMarkers.length; k++) {
        this.starMarkers[k].setMap(null)
      }
    }
  }
}
</script>
<style>
.buttondiv {
  color: #20b2aa;
  font-size: 12.1px;
  line-height: 38px;
  padding-left: 5px;
  padding-right: 5px;
  background: #d3d3d3;
  border-radius: 4px !important;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px !important;
}

.maindivs {
  border-radius: 4px !important;
  cursor: pointer !important;
  text-align: center !important;
  width: 77px !important;
  height: 21px !important;
  z-index: 0px !important;
  position: absolute !important;
  text-align: left !important;
  left: 0px !important;
  right: 0px !important;
  border-radius: 4px !important;
}

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
  color: rgb(var(--v-theme-accent));
}
.z-index-0 {
  z-index: 0 !important;
}
</style>
