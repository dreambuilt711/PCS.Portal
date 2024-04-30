import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { fa } from 'vuetify/iconsets/fa'
import { aliases, mdi, md } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

export const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VBtn: {
      class: 'text-none',
      style: 'letter-spacing: normal'
    },
    VSelect: {
      menuIcon: 'fa:icon-chevron-down',
      density: 'compact',
      variant: 'outlined',
      clearIcon: 'mdi-close'
    },
    VAutocomplete: {
      menuIcon: 'fa:icon-chevron-down',
      density: 'compact',
      variant: 'outlined',
      clearIcon: 'mdi-close'
    },
    VCombobox: {
      menuIcon: 'fa:icon-chevron-down',
      density: 'compact',
      variant: 'outlined',
      clearIcon: 'mdi-close'
    },
    VTextField: {
      density: 'compact',
      variant: 'outlined',
      clearIcon: 'mdi-close'
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { fa, mdi, md }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          accent: '#0000', //'#0077cc',
          hyperlink: '#0000',
          portalBackground: '#0000',
          iconColor: '#0000'
        }
      },
      dark: {
        dark: true,
        colors: {
          accent: '#272727',
          hyperlink: '#FFFF',
          portalBackground: '#303030',
          iconColor: '#FFFF'
        }
      }
    }
  }
})
