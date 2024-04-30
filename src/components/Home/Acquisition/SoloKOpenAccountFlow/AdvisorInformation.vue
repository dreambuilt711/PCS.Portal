<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg8 md8 sm8>
        <v-flex class="text-center">
          <h1>Advisor Information</h1>
        </v-flex>
        <v-flex class="text-center pb-5 pt-2">
          <h2>Review and confirm the advisor's information</h2>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader">
          <v-flex sm12 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
            <v-flex class="pt-5">
              <v-row>
                <v-flex xs8>
                  <div class="text-h6 pb-1">CRD #</div>
                </v-flex>
                <v-flex xs4 class="text-right">
                  <a
                    v-bind:href="lookUpCredUrl"
                    target="_blank"
                    class="cursor-pointer"
                    :class="$vuetify.theme.dark ? 'white--text' : 'accent--text'"
                  >
                    <b>Find my CRD #</b
                    ><v-icon class="pl-1" size="x-small" :color="$vuetify.theme.dark ? '' : 'accent'"
                      >fas fa-external-link-alt</v-icon
                    >
                  </a>
                </v-flex>
              </v-row>
              <v-text-field
                variant="outlined"
                density="compact"
                placeholder="Enter CRD#"
                v-model="crdNumber"
                v-input-mask="{
                  alias: 'numeric',
                  digits: '0',
                  rightAlign: false,
                  placeholder: '',
                  allowMinus: false
                }"
                :rules="[(v) => !!v || 'CRD is required']"
                hide-details
              >
              </v-text-field>
            </v-flex>
            <v-flex class="pt-3">
              <div class="text-h6 pb-1">Name and email</div>
              <v-row class="pb-2">
                <v-flex sm6 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : 'pr-2'">
                  <v-text-field
                    v-model="firstName"
                    placeholder="First Name"
                    required
                    variant="outlined"
                    maxlength="140"
                    density="compact"
                    single-line
                    :rules="[(v) => !!v || 'First Name is required']"
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex sm6 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : ''">
                  <v-text-field
                    v-model="lastName"
                    placeholder="Last Name"
                    required
                    variant="outlined"
                    maxlength="140"
                    density="compact"
                    single-line
                    :rules="[(v) => !!v || 'Last Name is required']"
                    hide-details
                  ></v-text-field>
                </v-flex>
              </v-row>
              <v-text-field
                v-model="email"
                placeholder="Email"
                single-line
                variant="outlined"
                density="compact"
                hide-details
                :rules="[(v) => (v != '' ? emailRegex.test(v) || 'Invalid Email address' : !v)]"
              ></v-text-field>
            </v-flex>
            <v-flex class="pt-3" sm6 xs12>
              <div class="text-h6 pb-1">Rep Code</div>
              <v-text-field
                variant="outlined"
                density="compact"
                placeholder="Rep Code"
                v-model="repCode"
                :error="repCodeError"
                :error-messages="repCodeErrorMsg"
                v-input-mask="{
                  alias: 'numeric',
                  digits: '0',
                  rightAlign: false,
                  placeholder: '',
                  allowMinus: false
                }"
                required
                :rules="[(v) => !!v || 'Rep Code is required']"
              ></v-text-field>
            </v-flex>
          </v-flex>
          <v-flex pt-8>
            <v-flex class="text-center">
              <v-col class="pa-0">
                <v-btn
                  class="text-capitalize"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  @click="nextSlide()"
                  :disabled="!valid"
                  >Next</v-btn
                >
              </v-col>
              <v-col class="pl-0 pr-0 pt-2">
                <v-btn
                  class="text-capitalize"
                  variant="outlined"
                  :color="$vuetify.theme.dark ? '' : 'accent'"
                  @click="prevSlide()"
                  >Go Back</v-btn
                >
              </v-col>
            </v-flex>
          </v-flex>
        </v-form>
      </v-flex>
    </v-row>
  </v-flex>
</template>
<script>
export default {
  data() {
    return {
      valid: false,
      loader: false,
      crdNumber: '',
      lookUpCredUrl: 'https://brokercheck.finra.org/',
      firstName: '',
      lastName: '',
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      email: '',
      repCode: '',
      repCodeError: false,
      repCodeErrorMsg: ''
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.firstName =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.FirstName
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.FirstName
          : ''
      this.lastName =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.LastName
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.LastName
          : ''
      this.email =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.Email
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.Email
          : ''
      this.repCode =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.RepCode
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.RepCode
          : ''
      this.crdNumber =
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation &&
        this.$store.state.soloKOpenAccountDetail.AdvisorInformation.CRD
          ? this.$store.state.soloKOpenAccountDetail.AdvisorInformation.CRD
          : ''
    } else {
      var name = this.$store.state.user.name ? this.$store.state.user.name.split(' ') : ''
      this.firstName = name && name[0] ? name[0] : ''
      this.lastName = name && name[1] ? name[1] : ''
      this.email = this.$store.state.user.email ? this.$store.state.user.email : ''
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.AdvisorInformation = {}
      this.$store.state.soloKOpenAccountDetail.AdvisorInformation.FirstName = this.firstName ? this.firstName : ''
      this.$store.state.soloKOpenAccountDetail.AdvisorInformation.LastName = this.lastName ? this.lastName : ''
      this.$store.state.soloKOpenAccountDetail.AdvisorInformation.Email = this.email ? this.email : ''
      this.$store.state.soloKOpenAccountDetail.AdvisorInformation.RepCode = this.repCode ? this.repCode : ''
      this.$store.state.soloKOpenAccountDetail.AdvisorInformation.CRD = this.crdNumber ? this.crdNumber : ''
      this.$emit('nextSlide')
    },
    prevSlide() {
      this.$emit('prevSlide')
    }
  }
}
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 46px;
  width: 250px;
}
</style>
