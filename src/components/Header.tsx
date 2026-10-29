import { LocaleMenu } from '@src/components/LocaleMenu.tsx'
import { ShareMenu } from '@src/components/ShareMenu.tsx'
import { Toolbar } from '@src/components/Toolbar.tsx'
import { useTranslation } from 'react-i18next'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="relative z-60 grid h-20 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3.5 px-6">
      <h1 className="font-display on-dark:text-background text-[26px]">{t('app.title')}</h1>
      <div className="flex items-center gap-3.5">
        <Toolbar />
        <ShareMenu />
      </div>
      <div className="justify-self-end">
        <LocaleMenu />
      </div>
    </header>
  )
}
