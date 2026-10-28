import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './en.ts'
import { fr } from './fr.ts'
import { baseLocale, locales } from './locales.ts'

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    supportedLngs: [...locales],
    load: 'languageOnly',
    fallbackLng: baseLocale,
    initAsync: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'mr-patate:locale',
      caches: ['localStorage'],
      convertDetectedLanguage: (language) => language.split('-')[0] ?? language,
    },
  })

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof fr }
  }
}
