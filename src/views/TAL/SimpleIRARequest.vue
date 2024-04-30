<template>
  <v-container :class="$vuetify?.breakpoint?.xs ? 'pl-4 pr-4' : ''">
    <v-col class="xs12 sm11 md9 lg7 pt-3 pb-3">
      <h1>Your Simple IRA Proposal Request Has Been Submitted</h1>
      <h3 class="pt-5">Thank you for submitting your SIMPLE IRA proposal request.</h3>
      <br />
      <h3 class="pb-2 pt-2">
        One of our Sales Representatives will be sending your SIMPLE IRA package to the email address we have on file -
        <a
          :href="`mailto:${$store.state.user.email}`"
          target="_blank"
          :class="$vuetify?.theme.dark ? 'text-white' : 'text-hyperlink'"
          >{{ $store.state.user.email }}</a
        >
      </h3>
      <v-divider class="my-5" />
      <h3 class="pb-5 pt-2 font_18">Next Steps</h3>
      <v-list class="pa-0">
        <v-list-item class="pl-0 pb-5 pr-0">
          <template v-slot:prepend>
            <v-icon size="7" :color="$vuetify?.theme.dark ? '' : 'accent'"> mdi mdi-circle </v-icon>
          </template>
          <v-list-item-title class="font_16" style="white-space: normal; line-height: 24px"
            >Once you receive the email from us, you will need to work with the Employer and Employee to fill out the proposal
            package.</v-list-item-title
          >
        </v-list-item>
        <v-list-item class="pl-0 pb-5 pr-0">
          <template v-slot:prepend>
            <v-icon size="7" :color="$vuetify?.theme.dark ? '' : 'accent'"> mdi mdi-circle </v-icon>
          </template>
          <v-list-item-title class="font_16" style="white-space: normal; line-height: 24px"
            >Once the package is filled out, you’ll sign and email back to
            <a
              :href="`mailto:MMLISBPMSubmission@massmutual.com`"
              target="_blank"
              :class="$vuetify?.theme.dark ? 'text-white' : 'text-hyperlink'"
            >
              MMLISBPMSubmission@massmutual.com</a
            ></v-list-item-title
          >
        </v-list-item>
      </v-list>
      <v-col class="mt-5">
        <h3 class="font_16">
          <b>Need Help?</b>
        </h3>
        <h3 class="font_16">
          Contact the PCS Retirement Sales team to answer questions and to assist you with paperwork at
          <a :href="`tel:+1-877-272-4015`" target="_blank" :class="$vuetify?.theme.dark ? 'text-white' : 'text-black'"
            >1-877-272-4015</a
          >
          or
          <a :href="`mailto:sales@pcscapital.com`" target="_blank" :class="$vuetify?.theme.dark ? 'text-white' : 'text-hyperlink'"
            >sales@pcscapital.com</a
          >. Or, contact the MML Pension Resource Center at
          <a :href="`tel:+1-800-842-4015`" target="_blank" :class="$vuetify?.theme.dark ? 'text-white' : 'text-black'"
            ><b>1-800-842-4015</b></a
          >
          or
          <a
            :href="`mailto:MPRCSales@massmutual.com`"
            target="_blank"
            :class="$vuetify?.theme.dark ? 'text-white' : 'text-hyperlink'"
            >MPRCSales@massmutual.com</a
          >.
        </h3>
      </v-col>
    </v-col>
  </v-container>
</template>
<style scoped>
.theme--dark.v-sheet {
  background-color: transparent;
  border-color: transparent;
}
</style>
