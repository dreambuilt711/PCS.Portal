<template>
  <v-col>
    <v-col xs12>
      <v-row>
        <v-col class="text-left" xs12>
          <h2 class="font-weight-bold">Font Family, Size and Color</h2>
        </v-col>
      </v-row>
    </v-col>
    <v-col xs12 class="text-subtitle-1 mt-1" />
    <v-col xs12 xl4 lg4 md6 sm6 mt-2>
      <v-select
        v-model="FontFamily"
        :items="FontFamilys"
        label="Font Family"
        variant="outlined"
        append-icon="icon-chevron-down"
        density="compact"
      />
    </v-col>
    <v-col xs12 xl4 lg4 md6 sm6 pr-2 pt-3>
      <v-slider
        v-model="FontSize"
        label="Font Size"
        thumb-label="always"
        always-dirty
        prepend-icon="format_size"
        color="accent"
        min="8"
        max="16"
      />
    </v-col>
    <v-col class="text-left mt-4" xs12>
      <h2 class="font-weight-bold">Sample Text</h2>
    </v-col>
    <v-col
      xs12
      mt-2
      pb-3
      :style="'font-size:' + FontSize + 'px !important' + ';font-family:' + FontFamily + ',sans-serif !important'"
      :class="$vuetify?.breakpoint?.smAndUp ? '' : ''"
    >
      <v-col xs12 sm12 md12 lg6 xl6 pa-3 class="border">
        <v-col pl-4>
          <h1>
            <b>The spectale before us was indeed sublime</b>
          </h1>
        </v-col>
        <v-col pl-4 mt-4>
          <h3>
            Apparently we had reached a great height in the atmosphere,for the sky was was dead black,and the stars had ceased to
            twinkle. By the same illusion which lifts the horizon of the sea to the level of a spectator on a hillside,the sable
            cloud beneath was dished out, and the car seemed to float in the middle of an immerse dark sphere,whose upper half was
            strewn with silver. Looking down into the dark gulf below, I could see a ruddy light streaming through a rift in the
            clouds.
          </h3>
        </v-col>
      </v-col>
    </v-col>
    <v-col xs12>
      <v-row>
        <v-col v-if="showSaveButton" xs12 class="text-right">
          <v-btn
            variant="outlined"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
            @click="resetLogoData()"
          >
            Reset
          </v-btn>
          <v-btn
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            :class="[$vuetify?.breakpoint?.xs ? 'mr-0' : '']"
            @click="saveTypography()"
          >
            Save
          </v-btn>
        </v-col>
        <v-col text-left xs12>
          <TermOfUse />
        </v-col>
      </v-row>
    </v-col>
  </v-col>
</template>

<script>
import TermOfUse from '@/components/Brand/TermOfUse'
export default {
  components: {
    TermOfUse
  },
  props: ['brandTabs', 'brandData', 'saveBrandMethod'],
  data() {
    return {
      isAssociatedFirm: '',
      FontFamilys: [
        { text: 'Arial', value: 'Arial' },
        { text: 'Helvetica', value: 'Helvetica' },
        { text: 'Times New Roman', value: 'Times New Roman' },
        { text: 'Courier New', value: 'Courier New' },
        { text: 'Lora', value: 'Lora' },
        { text: 'Karla', value: 'Karla' },
        { text: 'Archivo', value: 'Archivo' },
        { text: 'Spectral', value: 'Spectral' },
        { text: 'Raleway', value: 'Raleway' },
        { text: 'Roboto', value: 'Roboto' },
        { text: 'Rubik', value: 'Rubik' }
      ],
      FontFamily: 'Arial',
      FontSize: 10
    }
  },
  computed: {
    showSaveButton() {
      if (this.$authz.hasPermission(this.$authz.permissionSet.Branding_Items__c, this.$authz.permission.Full)) {
        if (this.$authz.hasRole(this.$authz.roles.SiteAdmin) || this.$authz.hasRole(this.$authz.roles.ProgramAdmin)) {
          return true
        } else if (this.$authz.hasRole(this.$authz.roles.FirmAdmin)) {
          return this.$authz.allowedByProgram(
            this.$authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c,
            this.$authz.permission.Full
          )
        } else if (
          this.$authz.hasRole(this.$authz.roles.Advisor) ||
          this.$authz.hasRole(this.$authz.roles.Strategist) ||
          this.$authz.hasRole(this.$authz.roles.Fiduciary338)
        ) {
          return (
            this.$authz.allowedByProgram(
              this.$authz.programPermissionSet.Advisors_Firms_to_Upload_own_Brand__c,
              this.$authz.permission.Full
            ) &&
            this.$authz.allowedByAccount(
              this.$authz.accountPermissionSet.Allow_Advisors_Firms_Upload_Brand__c,
              this.$authz.permission.Full
            )
          )
        } else return true
      }
      return false
    }
  },
  mounted() {
    this.getTypographyData()
  },
  methods: {
    saveTypography() {
      var typographyData = {}
      typographyData.font_Size__c = this.FontSize
      typographyData.font_Family__c = this.FontFamily
      this.saveBrandMethod(typographyData)
      this.$vuetify.goTo(0)
    },
    resetLogoData() {
      this.FontSize = this.brandData.brand.font_Size__c ? this.brandData.brand.font_Size__c : 10
      this.FontFamily = this.brandData.brand.font_Family__c
    },
    getTypographyData() {
      this.FontSize = this.brandData.brand.font_Size__c
      this.FontFamily = this.brandData.brand.font_Family__c
    }
  }
}
</script>
<style scoped>
.border {
  border: 1px solid #707070;
}
.v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.small_flex {
  height: 650px !important;
}
</style>
