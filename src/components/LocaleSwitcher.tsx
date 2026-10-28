import { useLocale } from '@src/hooks/useLocale.ts'
import type { Locale } from '@src/i18n/locales.ts'
import { locales } from '@src/i18n/locales.ts'
import { cn } from '@src/lib/utils.ts'
import { useTranslation } from 'react-i18next'

const localeNames: Record<Locale, string> = { fr: 'Français', en: 'English' }

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation()
  const current = useLocale()

  return (
    <fieldset className="border-stroke bg-card flex h-11 items-center gap-1 rounded-full p-1">
      <legend className="sr-only">{t('language')}</legend>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          aria-pressed={locale === current}
          onClick={() => i18n.changeLanguage(locale)}
          className={cn(
            'h-full cursor-pointer rounded-full px-3 text-sm font-bold',
            locale === current && 'bg-foreground text-background',
          )}
        >
          {localeNames[locale]}
        </button>
      ))}
    </fieldset>
  )
}
