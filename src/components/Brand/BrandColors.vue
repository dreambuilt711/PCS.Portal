<template>
  <v-col>
    <v-col xs12>
      <v-row>
        <v-col class="text-left" xs12>
          <h2 class="font-weight-bold">Brand Colors</h2>
        </v-col>
      </v-row>
    </v-col>
    <v-col xs12 class="mt-1">
      <h4 />
    </v-col>
    <v-col mt-3>
      <v-row>
        <v-col
          v-for="(item, index) in accentColors"
          :key="index"
          xs12
          sm6
          md6
          lg2
          xl2
          :class="$vuetify?.breakpoint?.lgAndUp ? 'pr-3' : 'mt-1'"
        >
          <v-col>
            <v-menu :close-on-content-click="false" :max-width="190">
              <template #activator="{ props }">
                <v-card height="150" :color="`${item.color}`" class="cursor-pointer" v-bind="props">
                  <v-col xs10 pa-2>
                    <span class="text-subtitle-2 text-white">{{ item.text }}</span>
                  </v-col>

                  <v-col pr-2 pb-1 class="text-right text-white bottom">
                    {{ item.color }}
                  </v-col>
                </v-card>
              </template>
              <v-card>
                <chrome-picker v-model="AccentColor1" @input="updateAccent1Picker(item.id)" />
              </v-card>
            </v-menu>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
    <v-col xs12 mt-4 :class="$vuetify?.breakpoint?.lgAndUp ? 'mr-5' : ''">
      <v-row>
        <v-menu :close-on-content-click="false" :max-width="227">
          <template #activator="{ props }">
            <v-col xs12 sm12 md12 lg4 xl4 class="border">
              <v-card height="70" :color="accentBackgroundColors[0].color" v-bind="props" class="cursor-pointer">
                <v-col xs12 pa-2>
                  <span class="text-subtitle-2" :class="!$vuetify?.theme.dark ? 'text-black' : ''">{{
                    accentBackgroundColors[0].name
                  }}</span>
                </v-col>
                <v-col pr-2 class="text-right" :class="!$vuetify?.theme.dark ? 'text-black' : ''">
                  accentBackgroundColors[0].color }}
                </v-col>
              </v-card>
            </v-col>
          </template>
          <v-card>
            <chrome-picker v-model="backgroundAccentColor" @input="updateBackgroundPicker" />
          </v-card>
        </v-menu>
        <!-- for primary -->
        <v-menu :close-on-content-click="false" :max-width="227">
          <template #activator="{ props }">
            <v-col xs12 sm12 md12 lg4 xl4 class="border" :class="$vuetify?.breakpoint?.lgAndUp ? 'ml-3' : ''">
              <v-card height="70" :color="accentTextColors[0].color" v-bind="props" class="cursor-pointer">
                <v-col xs12 pa-2>
                  <span class="text-subtitle-2" :class="!$vuetify?.theme.dark ? 'text-black' : ''">{{
                    accentTextColors[0].name
                  }}</span>
                </v-col>
                <v-col pr-2 class="text-right" :class="!$vuetify?.theme.dark ? 'text-black' : ''">
                  accentTextColors[0].color }}
                </v-col>
              </v-card>
            </v-col>
          </template>
          <v-card>
            <chrome-picker v-model="primaryAccentColor" @input="updatePrimaryPicker" />
          </v-card>
        </v-menu>
      </v-row>
    </v-col>
    <!-- for surface -->
    <v-col xs12 :class="$vuetify?.breakpoint?.lgAndUp ? 'mr-5' : ''">
      <v-row>
        <v-menu :close-on-content-click="false" :max-width="227">
          <template #activator="{ props }">
            <v-col xs12 sm12 md12 lg4 xl4 class="border">
              <v-card height="70" :color="accentBackgroundColors[1].color" v-bind="props" class="cursor-pointer">
                <v-col xs12 pa-2>
                  <span class="text-subtitle-2" :class="!$vuetify?.theme.dark ? 'text-black' : ''">{{
                    accentBackgroundColors[1].name
                  }}</span>
                </v-col>
                <v-col pr-2 class="text-right" :class="!$vuetify?.theme.dark ? 'text-black' : ''">
                  accentBackgroundColors[1].color }}
                </v-col>
              </v-card>
            </v-col>
          </template>
          <v-card>
            <chrome-picker v-model="surfaceAccentColor" @input="updateSurfacePicker" />
          </v-card>
        </v-menu>
        <!-- for secondary -->
        <v-menu :close-on-content-click="false" :max-width="227">
          <template #activator="{ props }">
            <v-col xs12 sm12 md12 lg4 xl4 class="border" :class="$vuetify?.breakpoint?.lgAndUp ? 'ml-3' : ''">
              <v-card height="70" :color="accentTextColors[1].color" v-bind="props" class="cursor-pointer">
                <v-col xs12 pa-2>
                  <span class="text-subtitle-2">{{ accentTextColors[1].name }}</span>
                </v-col>
                <v-col pr-2 class="text-right">
                  {{ accentTextColors[1].color }}
                </v-col>
              </v-card>
            </v-col>
          </template>
          <v-card>
            <chrome-picker v-model="secondaryAccentColor" @input="updateSecondaryPicker" />
          </v-card>
        </v-menu>
      </v-row>
    </v-col>
    <!-- for link -->
    <v-col xs12 :class="$vuetify?.breakpoint?.lgAndUp ? 'mr-5' : ''">
      <v-row>
        <v-col xs4 />
        <v-menu :close-on-content-click="false" :max-width="227">
          <template #activator="{ props }">
            <v-col xs12 sm12 md12 lg4 xl4 class="border" :class="$vuetify?.breakpoint?.lgAndUp ? 'ml-3' : ''">
              <v-card height="70" :color="accentTextColors[2].color" v-bind="props" class="cursor-pointer">
                <v-col xs12 pa-2>
                  <span class="text-subtitle-2">{{ accentTextColors[2].name }}</span>
                </v-col>
                <v-col pr-2 class="text-right">
                  {{ accentTextColors[2].color }}
                </v-col>
              </v-card>
            </v-col>
          </template>
          <v-card>
            <chrome-picker v-model="linkAccentColor" @input="updateLinkPicker" />
          </v-card>
        </v-menu>
      </v-row>
    </v-col>
    <v-col xs12>
      <v-row>
        <v-col v-if="showSaveButton" xs12 class="text-right">
          <v-btn
            variant="outlined"
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            :class="$vuetify?.breakpoint?.xs ? 'mr-0' : ''"
            @click="resetBrandColor()"
          >
            Reset
          </v-btn>
          <v-btn
            :color="$vuetify?.theme.dark ? '' : 'accent'"
            :class="[$vuetify?.breakpoint?.xs ? 'mr-0' : '']"
            @click="saveBrandColor()"
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
import { Chrome } from 'vue-color'
import TermOfUse from '@/components/Brand/TermOfUse'
export default {
  components: {
    'chrome-picker': Chrome,
    TermOfUse
  },
  props: ['brandColorsData', 'saveBrandMethod'],
  data() {
    return {
      accentColors: [
        {
          id: 0,
          text: 'Accent 1',
          color: '#6200EE',
          class: 'ml-3'
        },
        {
          id: 1,
          text: 'Accent 2',
          color: '#3700B3',
          class: 'ml-3'
        },
        {
          id: 2,
          text: 'Accent 3',
          color: '#03DAC6',
          class: 'ml-3'
        },
        {
          id: 3,
          text: 'Accent 4',
          color: '#018786',
          class: 'ml-3'
        }
      ],
      accentBackgroundColors: [
        {
          name: 'Background',
          color: ''
        },
        {
          name: 'Surface',
          color: ''
        }
      ],
      accentTextColors: [
        {
          name: 'Text Accent 1',
          color: ''
        },
        {
          name: 'Text Accent 2',
          color: ''
        },
        {
          name: 'Link',
          color: ''
        }
      ],
      AccentColor1: '',
      Accent1hex: '',
      backgroundAccentColor: '',
      primaryAccentColor: '',
      surfaceAccentColor: '',
      secondaryAccentColor: '',
      linkAccentColor: '',
      isAssociatedFirm: ''
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
    this.getBrandColorsData()
  },
  methods: {
    getBrandColorsData() {
      this.accentColors[0].color = this.brandColorsData.brand.color1__c
      this.accentColors[1].color = this.brandColorsData.brand.color2__c
      this.accentColors[2].color = this.brandColorsData.brand.color3__c
      this.accentColors[3].color = this.brandColorsData.brand.color4__c
      this.accentBackgroundColors[0].color = this.brandColorsData.brand.background__c
      this.accentBackgroundColors[1].color = this.brandColorsData.brand.surface__c
      this.accentTextColors[0].color = this.brandColorsData.brand.textColor1__c
      this.accentTextColors[1].color = this.brandColorsData.brand.textColor2__c
      this.accentTextColors[2].color = this.brandColorsData.brand.link__c
    },
    updateAccent1Picker(val) {
      this.accentColors[val].color = this.AccentColor1.hex
    },
    updateBackgroundPicker() {
      this.accentBackgroundColors[0].color = this.backgroundAccentColor.hex
    },
    updatePrimaryPicker() {
      this.accentTextColors[0].color = this.primaryAccentColor.hex
    },
    updateSurfacePicker() {
      this.accentBackgroundColors[1].color = this.surfaceAccentColor.hex
    },
    updateSecondaryPicker() {
      this.accentTextColors[1].color = this.secondaryAccentColor.hex
    },
    updateLinkPicker() {
      this.accentTextColors[2].color = this.linkAccentColor.hex
    },
    resetBrandColor() {
      this.accentColors[0].color = this.brandColorsData.brand.color1__c
      this.accentColors[1].color = this.brandColorsData.brand.color2__c
      this.accentColors[2].color = this.brandColorsData.brand.color3__c
      this.accentColors[3].color = this.brandColorsData.brand.color4__c
      this.accentBackgroundColors[0].color = this.brandColorsData.brand.background__c
      this.accentBackgroundColors[1].color = this.brandColorsData.brand.surface__c
      this.accentTextColors[0].color = this.brandColorsData.brand.textColor1__c
      this.accentTextColors[1].color = this.brandColorsData.brand.textColor2__c
      this.accentTextColors[2].color = this.brandColorsData.brand.link__c
    },
    saveBrandColor() {
      const ratio = this.calculateRatio(this.accentColors[0].color, this.accentTextColors[0].color)
      if (!(ratio < 1 / 3) && !(ratio < 1 / 4.5) && !(ratio < 1 / 4.5) && !(ratio < 1 / 7)) {
        this.$toast?.destroy()
        this.$toast.warning(
          'Text color don’t meet the 3:1 contrast ratio recommendations and can be difficult to read against the background colors."',
          '',
          this.notificationSystem.options.warning
        )
        return false
      }
      var brandColorsData = {}
      brandColorsData.color1__c = this.accentColors[0].color
      brandColorsData.color2__c = this.accentColors[1].color
      brandColorsData.color3__c = this.accentColors[2].color
      brandColorsData.color4__c = this.accentColors[3].color
      brandColorsData.background__c = this.accentBackgroundColors[0].color
      brandColorsData.surface__c = this.accentBackgroundColors[1].color
      brandColorsData.textColor1__c = this.accentTextColors[0].color
      brandColorsData.textColor2__c = this.accentTextColors[1].color
      brandColorsData.link__c = this.accentTextColors[2].color
      this.saveBrandMethod(brandColorsData)
      this.$vuetify.goTo(0)
    },
    hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
      })

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null
    },
    luminance(r, g, b) {
      var a = [r, g, b].map(function (v) {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      })
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
    },
    calculateRatio(color1, color2) {
      const color1rgb = this.hexToRgb(color1)
      const color2rgb = this.hexToRgb(color2)
      const color1luminance = this.luminance(color1rgb.r, color1rgb.g, color1rgb.b)
      const color2luminance = this.luminance(color2rgb.r, color2rgb.g, color2rgb.b)
      const ratio =
        color1luminance > color2luminance
          ? (color2luminance + 0.05) / (color1luminance + 0.05)
          : (color1luminance + 0.05) / (color2luminance + 0.05)

      return ratio
    }
  }
}
</script>
<style scoped>
.v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.cardText {
  align-content: end !important;
}
.border {
  border: 1px solid #707070;
}
.bottom {
  position: absolute;
  bottom: 0;
  right: 0;
}
.divRight {
  position: absolute;
  right: 0;
}
.v-card.v-sheet {
  border-radius: 0px !important;
}
</style>
