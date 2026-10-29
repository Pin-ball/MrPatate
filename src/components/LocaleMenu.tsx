import { useLocale } from '@src/hooks/useLocale.ts'
import type { Locale } from '@src/i18n/locales.ts'
import { locales } from '@src/i18n/locales.ts'
import { Menu } from '@src/ui/Menu.tsx'
import { MenuItem } from '@src/ui/MenuItem.tsx'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const localeNames: Record<Locale, string> = { fr: 'Français', en: 'English' }

export function LocaleMenu() {
  const { t, i18n } = useTranslation()
  const current = useLocale()

  return (
    <Menu
      aria-label={t('app.language', { language: localeNames[current] })}
      className="shadow-hard h-12 uppercase"
      trigger={
        <>
          <Languages size={18} strokeWidth={2.25} />
          {current}
        </>
      }
    >
      {locales.map((locale) => (
        <MenuItem
          key={locale}
          lang={locale}
          checked={locale === current}
          onClick={() => void i18n.changeLanguage(locale)}
        >
          {localeNames[locale]}
        </MenuItem>
      ))}
    </Menu>
  )
}
