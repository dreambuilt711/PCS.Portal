<template>
  <v-flex>
    <v-row justify="center">
      <v-flex lg6 md8 sm8>
        <v-flex class="text-center">
          <h1>Plan Contact - Authorized Signer</h1>
        </v-flex>
        <v-flex class="py-3 text-center">
          <h3>
            The individual who has the authority to cause the Plan to enter into arrangements for necessary services for the
            operation and/or administration of the Plan, including without limitation, the services contemplated hereunder.
          </h3>
        </v-flex>
        <v-form ref="form" v-model="valid" v-if="!loader">
          <v-flex class="pt-3">
            <div class="text-h6 pb-1">Name and email</div>
            <v-row class="pb-2">
              <v-flex sm12 xs12 :class="$vuetify.breakpoint.xs ? 'pt-2' : ''">
                <v-text-field
                  v-model="firstName"
                  placeholder="Name"
                  required
                  variant="outlined"
                  maxlength="140"
                  density="compact"
                  single-line
                  :rules="[(v) => !!v || 'Name is required']"
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
        </v-form>
        <v-flex pt-16>
          <v-flex class="text-center">
            <v-col class="pa-0">
              <v-btn class="text-capitalize" :color="$vuetify.theme.dark ? '' : 'accent'" @click="nextSlide()">Next</v-btn>
            </v-col>
            <v-col class="pl-0 pr-0 pt-2">
              <v-btn class="text-capitalize" variant="outlined" :color="$vuetify.theme.dark ? '' : 'accent'" @click="prevSlide()"
                >Go Back</v-btn
              >
            </v-col>
          </v-flex>
        </v-flex>
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
      firstName: '',
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      email: ''
    }
  },
  mounted() {
    if (Object.keys(this.$store.state.soloKOpenAccountDetail).length > 0) {
      this.firstName =
        this.$store.state.soloKOpenAccountDetail.PlanContact && this.$store.state.soloKOpenAccountDetail.PlanContact.Name
          ? this.$store.state.soloKOpenAccountDetail.PlanContact.Name
          : ''
      this.email =
        this.$store.state.soloKOpenAccountDetail.PlanContact && this.$store.state.soloKOpenAccountDetail.PlanContact.Email
          ? this.$store.state.soloKOpenAccountDetail.PlanContact.Email
          : ''
    }
  },
  methods: {
    nextSlide() {
      this.$store.state.soloKOpenAccountDetail.PlanContact = {}
      this.$store.state.soloKOpenAccountDetail.PlanContact.Name = this.firstName ? this.firstName : ''
      this.$store.state.soloKOpenAccountDetail.PlanContact.Email = this.email ? this.email : ''
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
