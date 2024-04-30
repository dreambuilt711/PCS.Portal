import { createI18n } from 'vue-i18n'
import english from '@/locales/en-US.json'

const messages = {
  'en-US': english
}

const numberFormatsTemplate = {
  '2dec': { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  '3dec': { minimumFractionDigits: 3, maximumFractionDigits: 3 },
  '4dec': { minimumFractionDigits: 4, maximumFractionDigits: 4 }
}

const dateTimeFormatsTemplate = {
  short: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  },
  med: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric'
  }
}

var numberFormats = {
  'en-US': numberFormatsTemplate
}

var dateTimeFormats = {
  'en-US': dateTimeFormatsTemplate
}

const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  dateTimeFormats,
  numberFormats,
  messages
})

i18n.loadedLanguages = ['en-US']

function setI18nLanguage(lang) {
  i18n.locale = lang
  this.$axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)

  return lang
}

i18n.loadLanguageAsync = (lang) => {
  if (i18n.locale !== lang) {
    if (!i18n.loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `./locales/${lang}`)
        .then((msgs) => {
          numberFormats[lang] = numberFormatsTemplate
          dateTimeFormats[lang] = dateTimeFormatsTemplate
          i18n.setLocaleMessage(lang, msgs)
          i18n.loadedLanguages.push(lang)

          return setI18nLanguage(lang)
        })
        .catch(() => {
          lang = 'en-US'
        })
    }

    return Promise.resolve(setI18nLanguage(lang))
  }

  return Promise.resolve(lang)
}

export default i18n
