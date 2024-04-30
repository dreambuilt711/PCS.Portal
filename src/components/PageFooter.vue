<template>
  <v-footer id="footer" app absolute height="auto" class="pa-0">
    <v-card id="footerBackground" flat rounded="0" class="text-center flex">
      <v-card-text v-if="legalLink && legalLink.length <= 600" class="pt-2 pb-2 preline">
        <div v-html="legalLink" />
      </v-card-text>
      <v-divider v-if="legalLink && legalLink.length <= 600 && !isSmAndDown" />
      <v-card-text class="pt-2 pb-2">
        <v-row no-gutters>
          <v-col v-if="!isMdAndDown" cols="12" sm="3" class="align-self">
            <h4 class="text-left">{{ showCopyRightYear }}{{ copyrightText }}</h4>
          </v-col>
          <v-col v-if="!isMdAndDown" cols="12" sm="6" class="text-center align-self">
            <ul id="footerSocialIcons" class="breadcrumb">
              <li v-if="privacyLink">
                <a :href="privacyLink" title="Privacy" target="_blank">
                  <span class="text-hyperlink">Privacy</span>
                </a>
              </li>
              <v-divider v-if="privacyLink" vertical class="mx-2" />
              <li v-if="legalLink && legalLink.length > 600">
                <a title="Legal" @click="legalShow = true">
                  <span class="text-hyperlink">Legal</span>
                </a>
              </li>
              <v-divider v-if="legalLink && legalLink.length > 600" vertical class="mx-2" />
              <li v-if="facebookLink">
                <a :href="facebookLink" target="_blank" title="Facebook">
                  <v-icon color="iconColor" size="14" icon="fa:fab fa-facebook-f"></v-icon>
                </a>
              </li>
              <v-divider v-if="facebookLink" vertical class="mx-2" />
              <li v-if="linkedInLink">
                <a :href="linkedInLink" target="_blank" title="Linkedin">
                  <v-icon color="iconColor" size="14" icon="fa:fab fa-linkedin-in"></v-icon>
                </a>
              </li>
              <v-divider v-if="linkedInLink" vertical class="mx-2" />
              <li v-if="twitterLink">
                <a :href="twitterLink" target="_blank" title="Twitter">
                  <v-icon color="iconColor" size="14" icon="fa:fab fa-twitter"></v-icon>
                </a>
              </li>
              <v-divider v-if="twitterLink && phoneNumber" vertical class="mx-2" />
              <li v-if="phoneNumber">
                Sales:
                <a :href="`tel:+${phoneNumber}`" title="Sales" target="_blank">
                  <span class="text-hyperlink">{{ phoneNumber }}</span>
                </a>
              </li>
              <v-divider vertical class="mx-2" />
              <li>
                Support:
                <a :href="`mailto:info@theadvisorlab.com`" title="Tech Support" target="_blank">
                  <span class="text-hyperlink">info@theadvisorlab.com</span>
                </a>
              </li>
            </ul>
          </v-col>

          <!-- for xs only -->
          <v-col v-if="isMdAndDown && privacyLink" cols="12" class="align-self text-center pb-4">
            <a :href="privacyLink" title="Privacy" target="_blank">
              <span class="text-hyperlink">Privacy</span>
            </a>
          </v-col>
          <v-col v-if="isMdAndDown" cols="12" class="align-self text-center pb-4">
            <ul class="breadcrumb footerPadding">
              <v-divider v-if="privacyLink" vertical class="mx-2" />
              <li v-if="legalLink && legalLink.length > 600">
                <a title="Legal" @click="legalShow = true">
                  <span class="text-hyperlink">Legal</span>
                </a>
              </li>
              <v-divider v-if="legalLink && legalLink.length > 600" vertical class="mx-2" />
              <li v-if="facebookLink">
                <a :href="facebookLink" target="_blank" title="Facebook">
                  <v-icon color="iconColor" size="14" icon="fa:fab fa-facebook-f"></v-icon>
                </a>
              </li>
              <v-divider v-if="facebookLink" vertical class="mx-2" />
              <li v-if="linkedInLink">
                <a :href="linkedInLink" target="_blank" title="Linkedin">
                  <v-icon color="iconColor" size="14" icon="fa:fab fa-linkedin-in"></v-icon>
                </a>
              </li>
              <v-divider v-if="linkedInLink" vertical class="mx-2" />
              <li v-if="twitterLink">
                <a :href="twitterLink" target="_blank" title="Twitter">
                  <v-icon color="iconColor" size="14" icon="fa:fab fa-twitter"></v-icon>
                </a>
              </li>
              <v-divider v-if="twitterLink && phoneNumber" vertical class="mx-2" />
            </ul>
          </v-col>
          <v-col v-if="isMdAndDown" cols="12" class="align-self text-center pb-4">
            <ul class="breadcrumb footerPadding">
              <li v-if="phoneNumber">
                Sales:
                <a :href="`tel:+${phoneNumber}`" title="Sales" target="_blank">
                  <span class="text-hyperlink">{{ phoneNumber }}</span>
                </a>
              </li>
              <v-divider vertical class="mx-2" />
              <li>
                Support:
                <a :href="`mailto:info@theadvisorlab.com`" title="Tech Support" target="_blank">
                  <span class="text-hyperlink">info@theadvisorlab.com</span>
                </a>
              </li>
            </ul>
          </v-col>
          <!-- end here -->
          <v-col cols="12" :sm="isMdAndDown ? '12' : '3'" class="align-self" :class="isMdAndDown ? 'pb-4' : ''">
            <h4 :class="isMdAndDown ? 'text-center' : 'text-right'">
              v{{ window.__env.appVersion }}-{{ window.__env.appSlot }} | Powered by Advisor Lab
            </h4>
          </v-col>
          <v-col v-if="isMdAndDown" cols="12" class="align-self text-center">
            <h4>{{ copyrightText }}</h4>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="legalShow" persistent scrollable max-width="1000px" class="elevation-3" content-class="elevation-3">
      <v-card>
        <v-card-title class="pa-3 bg-accent" fixed>
          <v-row>
            <v-col cols="11" xs="11" xl="11" lg="11" sm="11" md="11">
              <h2 class="text-secondary">Term Of Use</h2>
            </v-col>
            <v-col cols="1" xl="1" lg="1" sm="1" md="1" xs="1" class="text-right">
              <v-icon color="secondary" @click="legalShow = false"> close </v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-0 legal_min_height">
          <v-container class="pr-2 pl-2">
            <div v-html="legalLink"></div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-footer>
</template>
<script>
import { useDisplay } from 'vuetify'
import { ref, computed, watchEffect } from 'vue'
export default {
  props: ['copyright', 'privacyPolicy', 'linkedin', 'twitter', 'facebook', 'legal', 'phone'],
  setup(props) {
    const display = useDisplay()
    const legalShow = ref(false)
    const copyrightText = ref(props.copyright)
    const privacyLink = ref(props.privacyPolicy)
    const linkedInLink = ref(props.linkedin)
    const twitterLink = ref(props.twitter)
    const facebookLink = ref(props.facebook)
    const legalLink = ref(props.legal)
    const phoneNumber = ref(props.phone)
    const isSmAndDown = ref(false)
    const isMdAndDown = ref(false)
    const showCopyRightYear = computed(() => {
      var year = new Date().getFullYear()
      var prefixYear = '© ' + year + ' '
      return prefixYear
    })
    watchEffect(() => {
      isSmAndDown.value = display.smAndDown.value
      isMdAndDown.value = display.mdAndDown.value
    })
    return {
      legalShow,
      showCopyRightYear,
      copyrightText,
      privacyLink,
      linkedInLink,
      twitterLink,
      facebookLink,
      legalLink,
      phoneNumber,
      display,
      isSmAndDown,
      isMdAndDown
    }
  }
}
</script>
<style scoped>
.legal_min_height {
  min-height: 500px !important;
  white-space: pre-wrap;
}
.footer {
  background: #ececec !important;
}
.v-application a {
  text-decoration: none !important;
}
.footerPadding {
  display: inline-flex !important;
}
.v-application ul,
.v-application ol {
  padding-left: 0px !important;
}
</style>
