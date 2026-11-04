import type { Locale } from '@src/i18n/locales.ts'
import { baseLocale, locales } from '@src/i18n/locales.ts'
import type { Label } from '@src/lib/catalog/types.ts'
import { useTranslation } from 'react-i18next'

export function useLocale(): Locale {
  const { i18n } = useTranslation()
  return locales.find((locale) => locale === i18n.resolvedLanguage) ?? baseLocale
}

export function useLabel() {
  const locale = useLocale()
  return (item: { label: Label }) => item.label[locale]
}
