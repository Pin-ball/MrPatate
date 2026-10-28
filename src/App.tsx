import { LocaleSwitcher } from '@src/components/LocaleSwitcher.tsx'
import { useLabel } from '@src/hooks/useLocale.ts'
import { partById, partsPile } from '@src/lib/catalog/index.ts'
import { Badge } from '@src/ui/Badge.tsx'
import { Button } from '@src/ui/Button.tsx'
import { IconButton } from '@src/ui/IconButton.tsx'
import { Pill } from '@src/ui/Pill.tsx'
import { Toast } from '@src/ui/Toast.tsx'
import { CornerDownLeft, Dices, Download, Link, Redo2, Share2, Star, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const club = partById.arms.variants[1]

export function App() {
  const { t } = useTranslation()
  const label = useLabel()

  return (
    <main className="flex min-h-dvh flex-col gap-8 p-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-display text-[26px]">{t('app_title')}</h1>
        <LocaleSwitcher />
      </header>

      <section className="flex flex-wrap items-center gap-4">
        <Pill className="h-12 gap-1 px-[5px]" role="toolbar" aria-label={t('actions')}>
          <IconButton variant="ghost" label={t('undo')}>
            <Undo2 size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
          <IconButton variant="ghost" label={t('redo')} disabled>
            <Redo2 size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
          <span className="bg-divider mx-[5px] h-5 w-0.5 rounded-xs" aria-hidden />
          <IconButton variant="ghost" label={t('surprise')}>
            <Dices size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
          <IconButton variant="ghost" label={t('favorite_add')}>
            <Star size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
        </Pill>
        <Button variant="primary" className="h-12">
          <Share2 size={18} strokeWidth={2.25} aria-hidden />
          {t('share')}
        </Button>
        <IconButton variant="primary" label={t('share')}>
          <Share2 size={16} strokeWidth={2.25} aria-hidden />
        </IconButton>
      </section>

      <section className="flex flex-wrap items-center gap-4">
        <Pill>
          <span className="label-caps text-muted-foreground">{label(partById.arms)} · 2/2</span>
          <span className="font-display text-[17px]">{club && label(club)}</span>
          <Badge>{t('trial')}</Badge>
        </Pill>
        <IconButton label={t('random_variant')}>
          <Dices size={20} strokeWidth={2.25} aria-hidden />
        </IconButton>
        <Button>
          <CornerDownLeft size={16} strokeWidth={2.25} aria-hidden />
          {t('back_to_parts')}
        </Button>
      </section>

      <section className="flex flex-wrap items-start gap-4">
        <div className="border-stroke bg-popover shadow-hard-lg flex min-w-[220px] flex-col rounded-xl p-1.5">
          <Button variant="ghost">
            <Link size={18} strokeWidth={2.25} aria-hidden />
            {t('share_copy_link')}
          </Button>
          <Button variant="ghost">
            <Download size={18} strokeWidth={2.25} aria-hidden />
            {t('share_download_png')}
          </Button>
        </div>
        <Toast
          message={t('toast_favorite_removed')}
          action={{ label: t('undo'), onClick: () => {} }}
        />
      </section>

      <section className="flex flex-wrap gap-2">
        {partsPile.map((part) => (
          <Badge key={part.id}>{label(part)}</Badge>
        ))}
      </section>
    </main>
  )
}
