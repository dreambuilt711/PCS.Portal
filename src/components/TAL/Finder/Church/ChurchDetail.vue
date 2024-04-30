<template>
  <v-col class="information_review">
    <v-container :fluid="true" :class="[churchLoading ? 'pt-0' : 'pb-2 pt-3']">
      <v-progress-linear v-if="churchLoading" indeterminate color="accent" height="4" />
      <v-col xl12 lg12 md12 sm12 xs12>
        <v-row>
          <v-col
            ref="staticMap"
            v-resize="onResize"
            xl4
            lg4
            md4
            sm12
            xs12
            :class="$vuetify?.breakpoint?.mdAndUp ? 'pr-3 pl-3' : 'pr-1'"
            class="text-center"
          >
            <v-card class="elevation-0" style="background-color: lightgrey">
              <i
                v-if="!googleMarkerimg"
                class="fas fa-map-marked-alt fa-7x icon_font"
                :class="$vuetify?.breakpoint?.smAndDown ? 'pb-3 pt-2' : 'pt-3 pb-3'"
              />
            </v-card>
            <img
              v-if="googleMarkerimg"
              :src="googleMarkerimg"
              draggable="false"
              :style="$vuetify?.breakpoint?.md ? 'height:250px' : 'height:200px'"
              border="0"
              width="100%"
              height
              class="map_image_border img_slection_none"
            />
          </v-col>
          <v-col v-if="!churchLoading" xl8 lg8 md8 sm12 xs12>
            <v-row class="text-left">
              <v-col
                class="text-left"
                md8
                xs12
                :class="[$vuetify?.breakpoint?.smAndDown ? 'pb-2 pt-2' : '', $vuetify?.breakpoint?.mdAndUp ? 'pl-3' : '']"
              >
                <h2 class="text-capitalize">
                  {{
                    selectedChurch && selectedChurch.length > 0
                      ? selectedChurch[0].Name
                        ? selectedChurch[0].Name.toLowerCase()
                        : 'Not available'
                      : ''
                  }}
                </h2>
              </v-col>
              <v-col mt-2 xs12>
                <v-row>
                  <v-col xl2 xs5 lg2 md3 sm6 pb-3 pl-3>
                    <v-col>SIC Code</v-col>
                    <v-col>
                      <b>{{
                        selectedChurch && selectedChurch.length > 0
                          ? selectedChurch[0].SICCode
                            ? selectedChurch[0].SICCode
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.smAndDown" inset vertical dark class="hr_border" />
                  <v-col xl2 xs6 lg2 md3 sm5 pb-3 pl-3>
                    <v-col>Industry</v-col>
                    <v-col>
                      <b>{{
                        selectedChurch && selectedChurch.length > 0
                          ? selectedChurch[0].Industry
                            ? selectedChurch[0].Industry
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="!$vuetify?.breakpoint?.md" inset vertical dark class="hr_border" />
                  <v-col xl2 xs5 lg2 md3 sm6 pb-3 pl-3>
                    <v-col>Employee Count</v-col>
                    <v-col>
                      <b>{{
                        selectedChurch && selectedChurch.length > 0
                          ? selectedChurch[0].EmployeeCount
                            ? selectedChurch[0].EmployeeCount
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col xl2 xs6 md3 lg2 sm5 pb-3 pl-3>
                    <v-col>Annual Sales</v-col>
                    <v-col>
                      <b>{{
                        selectedChurch && selectedChurch.length > 0
                          ? selectedChurch[0].AnnualSales
                            ? selectedChurch[0].AnnualSales
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider inset vertical dark class="hr_border" />
                  <v-col xl2 xs5 lg2 md3 sm5 pb-3 pl-3>
                    <v-col>County</v-col>
                    <v-col>
                      <b>{{
                        selectedChurch && selectedChurch.length > 0
                          ? selectedChurch[0].County
                            ? selectedChurch[0].County
                            : 'Not available'
                          : ''
                      }}</b>
                    </v-col>
                  </v-col>
                  <v-divider v-if="$vuetify?.breakpoint?.xlOnly" inset vertical dark class="hr_border" />
                  <v-col xl2 xs5 lg3 md3 sm5 pb-3 pl-3>
                    <v-col>Address</v-col>
                    <v-col :class="$vuetify?.breakpoint?.xs ? 'pr-2' : ''">
                      <b>
                        <span>
                          {{
                            selectedChurch && selectedChurch.length > 0
                              ? selectedChurch[0].Address
                                ? selectedChurch[0].Address
                                : ''
                              : ''
                          }}
                          <br v-if="selectedChurch && selectedChurch.length > 0 && selectedChurch[0].Address" />{{
                            selectedChurch && selectedChurch.length > 0
                              ? selectedChurch[0].City
                                ? selectedChurch[0].City
                                : ''
                              : ''
                          }}
                          {{
                            selectedChurch && selectedChurch.length > 0
                              ? selectedChurch[0].State
                                ? selectedChurch[0].State
                                : ''
                              : ''
                          }}
                          {{
                            selectedChurch && selectedChurch.length > 0
                              ? selectedChurch[0].Zip
                                ? selectedChurch[0].Zip
                                : ''
                              : ''
                          }}
                        </span>
                      </b>
                    </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="!churchLoading" xs12>
            <v-row class="justify-end">
              <v-col sm6 class="text-end">
                <v-btn :disabled="true" :color="!$vuetify?.theme.dark ? 'hyperlink text-white' : ''">
                  {{
                    `Open Account ( ${
                      selectedChurch && selectedChurch.length > 0
                        ? selectedChurch[0].Name
                          ? selectedChurch[0].Name.toLowerCase()
                          : ''
                        : ''
                    } )`
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <OpenAccount ref="OpenAccount" v-model="filterDialog" from-page="School" />
    </v-container>
  </v-col>
</template>
<script>
import OpenAccount from '@/components/TAL/Pipeline/OpenAccount'
export default {
  components: {
    OpenAccount
  },
  props: ['selectedChurch'],
  data() {
    return {
      reviewPanel: true,
      asOfDate: new Date(),
      churchLoading: true,
      progress: -1,
      dateCreated: '',
      currentStatus: 'Active',
      diagnosticComplete: false,
      rpeaComplete: false,
      proposalComplete: false,
      agrmtSentComplete: false,
      agrmtReceivedComplete: false,
      dialog: false,
      planId: 1,
      googleMarkerimg: '',
      school: '',
      filterDialog: false
    }
  },
  watch: {
    selectedChurch: {
      handler() {
        this.GetMap()
        this.churchLoading = false
      }
    }
  },
  mounted() {
    this.GetMap()
  },
  methods: {
    performAction(val) {
      if (val) {
        if (this.$refs.OpenAccount) this.$refs.OpenAccount.openTeacherAccount(val, '')
        this.$store.state.openAccountDetail = {}
        this.filterDialog = true
      }
    },
    onResize() {
      this.GetMap()
    },
    GetMap() {
      var address = this.selectedChurch.length > 0 && this.selectedChurch[0].Address ? this.selectedChurch[0].Address : ''
      // eslint-disable-next-line no-undef
      var geocoder = new google.maps.Geocoder()
      var that = this
      geocoder.geocode(
        {
          address: address
        },
        function (results, status) {
          // eslint-disable-next-line no-undef
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            that.callMap(address)
          } else {
            address = ''
            that.callMap(address)
          }
        }
      )
    },
    callMap(address) {
      var height = this.$vuetify?.breakpoint?.md ? '250' : '200'
      var width = this.$refs.staticMap !== undefined ? this.$refs.staticMap.clientWidth : 363
      var queryString = `locs=${address}`
      queryString += '&size=' + width + 'x' + height + '&scale=2'

      var apiUrl = `/api/v1/tal/plan/map?${queryString}`

      this.$axios(apiUrl, {
        method: 'GET',
        responseType: 'blob'
      }).then((success) => {
        this.googleMarkerimg = ''
        var file = new Blob([success.data], { type: 'image/png' })
        var url = URL.createObjectURL(file)
        this.googleMarkerimg = url
      })
    }
  }
}
</script>
<style scoped>
.information_review .v-subheader {
  height: 28px !important;
}

.hr_border {
  border: solid 1px lightgray !important;
  height: 30px;
}
.v-label {
  font-size: 0.93em !important;
  color: grey !important;
}

.map_image_border {
  border: solid 1px lightgrey;
}
.img_slection_none {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>
<style scoped>
.v-stepper__header .v-divider {
  margin: 0 0px !important;
}

.iconSize {
  font-size: 1em !important;
}

.v-btn:before {
  opacity: 0 !important;
  width: 62px !important;
  height: 26px !important;
}

table.v-table tbody td,
table.v-table tfoot td {
  font-size: 0.82em !important;
}
.statusBack {
  background: #147ac2 0% 0% no-repeat padding-box;
  border-radius: 5px;
  opacity: 0.16;
  width: 82px !important;
  color: #0969b0;
}

.rotate_icon_180 {
  transform: rotate(90deg) !important;
  -webkit-transform: rotate(90deg) !important;
}

.flexborder {
  border: 1px solid #707070 !important;
}

.overflow_x_hidden {
  overflow-x: hidden !important;
}
</style>
