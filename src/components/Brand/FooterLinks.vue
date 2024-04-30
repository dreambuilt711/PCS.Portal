<template>
  <v-col>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-col v-show="!hideCopyright">
        <v-col xs12>
          <v-row>
            <v-col class="text-left" xs12 sm12 md12 lg7 xl8>
              <h2 class="font-weight-bold">Copyright and Privacy Links</h2>
            </v-col>
            <v-col
              class="text-right brandSwitch d-flex justify-end"
              xs12
              sm12
              md12
              lg5
              xl4
              :class="$vuetify?.breakpoint?.mdAndDown ? 'mt-1' : ''"
            >
              <v-switch
                v-if="
                  $authz.hasRole($authz.roles.SiteAdmin) ||
                  $authz.hasRole($authz.roles.ProgramAdmin) ||
                  $authz.hasRole($authz.roles.InternalAdmin)
                "
                v-model="isAssociatedFirmAllowCopyright"
                label="Allow Associated Firms to update Copyright and Privacy Links"
                hide-details
                color="accent"
                :class="$vuetify?.breakpoint?.mdAndDown ? 'offsetSwitch' : 'wraptext'"
              />
              <v-switch
                v-if="
                  $authz.hasRole($authz.roles.FirmAdmin) &&
                  $authz.allowedByProgram(
                    $authz.programPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
                    $authz.permission.Full
                  )
                "
                v-model="isAssociatedAdvisorCopyright"
                label="Allow Associated Advisors to update Copyright and Privacy Links"
                hide-details
                color="accent"
                :class="$vuetify?.breakpoint?.mdAndDown ? 'offsetSwitch' : 'wraptext'"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col xs12 class="text-subtitle-1 mt-1" />
        <v-col xs12 mt-3>
          <v-row>
            <v-col xs12 sm12 md12 lg4 xl3>
              <v-text-field
                v-model="Company"
                label="Company URL"
                maxlength="50"
                :rules="[(v) => !!v || 'Company URL is required']"
                required
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col
              v-if="$authz.hasRole($authz.roles.SiteAdmin) || $authz.hasRole($authz.roles.ProgramAdmin)"
              xs12
              sm12
              md12
              lg4
              xl3
              :class="$vuetify?.breakpoint?.lgAndUp ? 'pl-3' : ''"
            >
              <v-text-field
                v-model="Phone"
                v-input-mask="{
                  mask: '[+]9[-999][-999][-9999]',
                  rightAlign: false,
                  placeholder: '',
                  allowMinus: false,
                  allowPlus: true
                }"
                label="Phone #"
                maxlength="15"
                :rules="[(v) => !!v || 'Phone is required']"
                required
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col xs12 sm12 md12 lg8 xl8>
          <v-text-field
            v-model="Copyright"
            :rules="[(v) => !!v || 'Copyright is required']"
            label="Copyright Text"
            :prefix="prefixYear"
            auto-grow
            required
            maxlength="250"
            variant="outlined"
            density="compact"
            hint="For example ©2021 PCS"
            persistent-hint
          />
        </v-col>
        <v-col xs12 sm12 md12 lg8 xl8>
          <v-textarea
            v-model="Legal"
            label="Legal Text"
            auto-grow
            maxlength="2500"
            counter
            :rules="[(v) => !!v || 'Reference to Legal page is required']"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col xs12 sm12 md12 lg4 xl3>
          <v-text-field
            v-model="PrivacyLink"
            label="Privacy Link"
            maxlength="100"
            :rules="[
              (v) =>
                /(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/.test(v) || 'Invalid URL (example: https://test.com)',
              (v) => !!v || 'Privacy link is required'
            ]"
            hint="example:https://test.com"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-col>
      <v-col v-show="!hideSocialLink" mb-3 pb-5>
        <v-col xs12>
          <v-row>
            <v-col class="text-left" mt-2 xs12 sm12 md12 lg7 xl8>
              <h2 class="font-weight-bold">Social Media Links</h2>
            </v-col>
            <v-col
              class="text-right brandSwitch d-flex justify-end"
              xs12
              sm12
              md12
              lg5
              xl4
              :class="$vuetify?.breakpoint?.mdAndDown ? 'mt-1' : 'pr-4'"
            >
              <v-switch
                v-if="
                  $authz.hasRole($authz.roles.SiteAdmin) ||
                  $authz.hasRole($authz.roles.ProgramAdmin) ||
                  $authz.hasRole($authz.roles.InternalAdmin)
                "
                v-model="isAssociatedFirmSocialMedia"
                label="Allow Associated Firms to update Social Media Links"
                hide-details
                color="accent"
                :class="$vuetify?.breakpoint?.mdAndDown ? 'offsetSwitch' : 'wraptext'"
              />
              <v-switch
                v-if="
                  $authz.hasRole($authz.roles.FirmAdmin) &&
                  $authz.allowedByProgram(
                    $authz.programPermissionSet.Advisors_Firms_to_promote_Social_Media__c,
                    $authz.permission.Full
                  )
                "
                v-model="isAssociatedAdvisorSocialMedia"
                label="Allow Associated Advisors to update Social Media Links"
                hide-details
                color="accent"
                :class="$vuetify?.breakpoint?.mdAndDown ? 'offsetSwitch' : 'wraptext'"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col xs12 class="text-subtitle-1 mt-1" />
        <v-col xs12 sm12 md12 lg4 xl3 mt-3>
          <v-text-field
            v-model="Facebook"
            label="Facebook Link"
            maxlength="75"
            :rules="[
              (v) =>
                !v ||
                v === '' ||
                (v !== '' && /^(http|https)\:\/\/(www.facebook.com|facebook.com)\.*/.test(v)) ||
                'Invalid Facebook URL (should start with https://www.facebook.com)'
            ]"
            hint="Starts with https://www.facebook.com/"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col xs12 sm12 md12 lg4 xl3>
          <v-text-field
            v-model="Twitter"
            maxlength="75"
            label="Twitter Link"
            :rules="[
              (v) =>
                !v ||
                v === '' ||
                (v !== '' && /^(http|https)\:\/\/(www.twitter.com|twitter.com)\.*/.test(v)) ||
                'Invalid Twitter URL (should start with https://www.twitter.com)'
            ]"
            hint="Starts with twitter.com"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col xs12 sm12 md12 lg4 xl3>
          <v-text-field
            v-model="Linkedin"
            label="Linkedin Link"
            maxlength="75"
            :rules="[
              (v) =>
                !v ||
                v === '' ||
                (v !== '' && /^(http|https)\:\/\/(www.linkedin.com|linkedin.com)\.*/.test(v)) ||
                'Invalid Linkedin URL (should start with https://www.linkedin.com)'
            ]"
            hint="Starts with www.linkedin.com"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-col>
      <v-col xs12>
        <v-row>
          <v-col v-if="showSaveButton" xs12 class="text-right">
            <v-btn
              variant="outlined"
              :color="$vuetify?.theme.dark ? '' : 'accent'"
              :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
              @click="resetFooterData()"
            >
              Reset
            </v-btn>
            <v-btn
              :color="$vuetify?.theme.dark ? '' : 'accent'"
              :class="[$vuetify?.breakpoint?.xs ? 'mr-0' : '']"
              :disabled="!valid"
              @click="saveFooterLinks()"
            >
              Save
            </v-btn>
          </v-col>
          <v-col text-left xs12>
            <TermOfUse />
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-col>
</template>
<script>
import TermOfUse from '@/components/Brand/TermOfUse'
export default {
  components: {
    TermOfUse
  },
  props: ['brandFooterData', 'saveBrandMethod'],
  data() {
    return {
      isAssociatedFirmSocialMedia: false,
      isAssociatedAdvisorCopyright: false,
      isAssociatedFirmAllowCopyright: false,
      isAssociatedAdvisorSocialMedia: false,
      Copyright: '',
      Phone: '',
      Company: '',
      Legal: '',
      PrivacyLink: '',
      Facebook: '',
      Twitter: '',
      Linkedin: '',
      valid: true,
      InnerFormValid: false,
      hideCopyright: false,
      hideSocialLink: false,
      prefixYear: ''
    }
  },
  computed: {
    showSaveButton() {
      if (this.$authz.hasPermission(this.$authz.permissionSet.Branding_Items__c, this.$authz.permission.Full)) {
        if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
          return true
        } else if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
          return (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
              this.$authz.permission.Full
            ) ||
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_to_promote_Social_Media__c,
              this.$authz.permission.Full
            )
          )
        } else if (
          this.$authz.hasRole(this.$authz.roles.Advisor) ||
          this.$authz.hasRole(this.$authz.roles.Strategist) ||
          this.$authz.hasRole(this.$authz.roles.Fiduciary338)
        ) {
          if (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
              this.$authz.permission.Full
            ) ||
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_to_promote_Social_Media__c,
              this.$authz.permission.Full
            )
          ) {
            return (
              this.$authz.allowedByAccount(
                this.$authz.accountPermissionSet.Allow_Advisors_Firms_Social_Media_Links__c,
                this.$authz.permission.Full
              ) ||
              this.$authz.allowedByAccount(
                this.$authz.accountPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
                this.$authz.permission.Full
              )
            )
          } else return false
        } else return true
      }
      return false
    }
  },
  watch: {
    brandFooterData: {
      handler() {
        if (this.$authz.hasPermission(this.$authz.permissionSet.Branding_Items__c, this.$authz.permission.Full)) {
          if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
            this.hideSocialLink = false
            this.hideCopyright = false
            return
          } else if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
            if (
              this.$authz.allowedByProgram(
                this.$authz.programPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
                this.$authz.permission.None
              )
            ) {
              this.hideCopyright = true
            } else this.hideCopyright = false
            if (
              this.$authz.allowedByProgram(
                this.$authz.programPermissionSet.Advisors_Firms_to_promote_Social_Media__c,
                this.$authz.permission.None
              )
            ) {
              this.hideSocialLink = true
            } else this.hideSocialLink = false
          } else if (
            this.$authz.hasRole(this.$authz.roles.Advisor) ||
            this.$authz.hasRole(this.$authz.roles.Strategist) ||
            this.$authz.hasRole(this.$authz.roles.Fiduciary338)
          ) {
            if (
              this.$authz.allowedByProgram(
                this.$authz.programPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
                this.$authz.permission.None
              ) &&
              this.$authz.allowedByAccount(
                this.$authz.accountPermissionSet.Advisors_Firms_Update_Copyright_Privacy__c,
                this.$authz.permission.None
              )
            ) {
              this.hideCopyright = true
            } else this.hideCopyright = false

            if (
              this.$authz.allowedByProgram(
                this.$authz.programPermissionSet.Advisors_Firms_to_promote_Social_Media__c,
                this.$authz.permission.None
              ) &&
              this.$authz.allowedByAccount(
                this.$authz.accountPermissionSet.Allow_Advisors_Firms_Social_Media_Links__c,
                this.$authz.permission.None
              )
            ) {
              this.hideSocialLink = true
            } else this.hideSocialLink = false
          }
        } else false
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getbrandFooterData()
  },
  methods: {
    getbrandFooterData() {
      var year = new Date().getFullYear()
      this.prefixYear = '© ' + year + ' '
      this.Twitter = this.brandFooterData.twitter__c ? this.brandFooterData.twitter__c : ''
      this.Linkedin = this.brandFooterData.linkedin__c ? this.brandFooterData.linkedin__c : ''
      this.Facebook = this.brandFooterData.facebook__c ? this.brandFooterData.facebook__c : ''
      this.Copyright = this.brandFooterData.copyright__c ? this.brandFooterData.copyright__c : ''
      this.Phone = this.brandFooterData.advisor_Phone_Number__c ? this.brandFooterData.advisor_Phone_Number__c : ''
      this.PrivacyLink = this.brandFooterData.privacy_Policy__c ? this.brandFooterData.privacy_Policy__c : ''
      this.Legal = this.brandFooterData.legal_Policy__c ? this.brandFooterData.legal_Policy__c : ''
      this.Company = this.brandFooterData.login_URL__c ? this.brandFooterData.login_URL__c : ''
      this.checkSwitchBasedOnCondition()
    },
    resetFooterData() {
      this.Twitter = this.brandFooterData.twitter__c
      this.Linkedin = this.brandFooterData.linkedin__c
      this.Facebook = this.brandFooterData.facebook__c
      this.Copyright = this.brandFooterData.copyright__c
      this.Phone = this.brandFooterData.advisor_Phone_Number__c
      this.PrivacyLink = this.brandFooterData.privacy_Policy__c
      this.Legal = this.brandFooterData.legal_Policy__c
      this.Company = this.brandFooterData.login_URL__c
      if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
        this.isAssociatedFirmSocialMedia = this.brandFooterData.advisors_Firms_to_promote_Social_Media__c
        this.isAssociatedFirmAllowCopyright = this.brandFooterData.advisors_Firms_Update_Copyright_Privacy__c
      }
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        this.isAssociatedAdvisorCopyright = this.brandFooterData.advisors_Firms_Update_Copyright_Privacy__c
        this.isAssociatedAdvisorSocialMedia = this.brandFooterData.advisors_Firms_to_promote_Social_Media__c
      }
    },
    saveFooterLinks() {
      var footerData = {}
      footerData.twitter__c = this.Twitter
      footerData.linkedin__c = this.Linkedin
      footerData.facebook__c = this.Facebook
      footerData.copyright__c = this.Copyright
      footerData.advisor_Phone_Number__c = this.Phone
      footerData.privacy_Policy__c = this.PrivacyLink
      footerData.legal_Policy__c = this.Legal
      footerData.login_URL__c = this.Company
      if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
        footerData.advisors_Firms_to_promote_Social_Media__c = this.isAssociatedFirmSocialMedia
        footerData.advisors_Firms_Update_Copyright_Privacy__c = this.isAssociatedFirmAllowCopyright
      }
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        footerData.advisors_Firms_Update_Copyright_Privacy__c = this.isAssociatedAdvisorCopyright
        footerData.advisors_Firms_to_promote_Social_Media__c = this.isAssociatedAdvisorSocialMedia
      }
      this.saveBrandMethod(footerData)
      this.$vuetify.goTo(0)
    },
    checkSwitchBasedOnCondition() {
      // For program or site admin
      if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
        this.isAssociatedFirmSocialMedia = this.brandFooterData.advisors_Firms_to_promote_Social_Media__c
        this.isAssociatedFirmAllowCopyright = this.brandFooterData.advisors_Firms_Update_Copyright_Privacy__c
      }
      // For site admin
      if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
        this.isAssociatedAdvisorCopyright = this.brandFooterData.advisors_Firms_Update_Copyright_Privacy__c
        this.isAssociatedAdvisorSocialMedia = this.brandFooterData.advisors_Firms_to_promote_Social_Media__c
      }
    }
  }
}
</script>

<style scoped>
.brandSwitch .v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
</style>
