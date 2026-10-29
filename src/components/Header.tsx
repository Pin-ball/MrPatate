import { LocaleSwitcher } from '@src/components/LocaleSwitcher.tsx'
import { ShareMenu } from '@src/components/ShareMenu.tsx'
import { Toolbar } from '@src/components/Toolbar.tsx'
import { cn } from '@src/lib/utils.ts'
import { useTranslation } from 'react-i18next'

export function Header({ dark }: { dark: boolean }) {
  const { t } = useTranslation()

  return (
    <header className="relative z-60 flex h-20 shrink-0 items-center gap-3.5 px-6">
      <h1 className={cn('font-display flex-1 text-[26px]', dark && 'text-background')}>
        {t('app_title')}
      </h1>
      <LocaleSwitcher />
      <Toolbar />
      <ShareMenu />
    </header>
  )
}
