import { LocaleMenu } from '@src/components/LocaleMenu.tsx'
import { ShareMenu } from '@src/components/ShareMenu.tsx'
import { Toolbar } from '@src/components/Toolbar.tsx'
import { useTranslation } from 'react-i18next'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="desktop:grid desktop:h-20 desktop:grid-cols-[1fr_auto_1fr] desktop:gap-3.5 desktop:px-6 relative z-60 flex h-16 shrink-0 items-center gap-2 px-4">
      <h1 className="font-display on-dark:text-background desktop:not-sr-only sr-only text-[26px]">
        {t('app.title')}
      </h1>
      <div className="desktop:flex desktop:items-center desktop:gap-3.5 contents">
        <div className="desktop:me-0 me-auto">
          <Toolbar />
        </div>
        <ShareMenu />
      </div>
      <div className="justify-self-end">
        <LocaleMenu />
      </div>
    </header>
  )
}
