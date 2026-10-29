import { Character } from '@src/components/character/Character.tsx'
import { CharacterImage } from '@src/components/character/CharacterImage.tsx'
import { LocaleSwitcher } from '@src/components/LocaleSwitcher.tsx'
import { useLabel } from '@src/hooks/useLocale.ts'
import { FRAME, thumbnailView, viewOf } from '@src/lib/catalog/camera.ts'
import { defaultLook, partById, partsPile, visibleVariants } from '@src/lib/catalog/index.ts'
import type { Look, PartId } from '@src/lib/catalog/types.ts'
import { download } from '@src/lib/download.ts'
import { characterPng, characterSvg } from '@src/lib/export.ts'
import { cn } from '@src/lib/utils.ts'
import { Button } from '@src/ui/Button.tsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function App() {
  const { t } = useTranslation()
  const label = useLabel()
  const [look, setLook] = useState<Look>(defaultLook)
  const [focused, setFocused] = useState<PartId | null>(null)
  const part = focused ? partById[focused] : null

  const select = (id: PartId, variant: string) => setLook({ ...look, [id]: variant })

  const downloadSvg = async () => {
    const svg = await characterSvg(look, t('character'))
    download(new Blob([svg], { type: 'image/svg+xml' }), 'mr-patate.svg')
  }

  const downloadPng = async () =>
    download(await characterPng(look, t('character')), 'mr-patate.png')

  return (
    <main className="flex min-h-dvh flex-col gap-6 p-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-display text-[26px]">{t('app_title')}</h1>
        <LocaleSwitcher />
      </header>

      <div className="flex flex-wrap items-start gap-8">
        <div className="flex w-[min(440px,100%)] flex-col gap-3">
          <Character
            look={look}
            view={part ? viewOf(part.camera) : FRAME}
            label={t('character')}
            className="border-stroke shadow-hard aspect-4/5 w-full rounded-2xl"
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadSvg}>{t('share_download_svg')}</Button>
            <Button variant="primary" onClick={downloadPng}>
              {t('share_download_png')}
            </Button>
          </div>
        </div>

        <section className="flex min-w-72 flex-1 flex-col gap-3">
          <Button
            className={cn('self-start', !focused && 'bg-accent')}
            onClick={() => setFocused(null)}
          >
            {t('whole_character')}
          </Button>
          {partsPile.map((pilePart) => (
            <div key={pilePart.id} className="flex items-center gap-3">
              <Button
                className={cn('w-36 justify-start', focused === pilePart.id && 'bg-accent')}
                onClick={() => setFocused(pilePart.id)}
              >
                {label(pilePart)}
              </Button>
              <select
                aria-label={label(pilePart)}
                value={look[pilePart.id]}
                onChange={(event) => select(pilePart.id, event.target.value)}
                className="border-stroke bg-card h-11 flex-1 rounded-full px-4 font-bold"
              >
                {visibleVariants(pilePart).map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {label(variant)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </section>
      </div>

      {part && (
        <section className="flex flex-wrap gap-3">
          {visibleVariants(part).map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => select(part.id, variant.id)}
              className={cn(
                'border-stroke shadow-hard bg-card flex w-[104px] cursor-pointer flex-col items-center gap-1 rounded-2xl p-1.5 text-xs font-bold',
                look[part.id] === variant.id && 'bg-accent',
              )}
            >
              <CharacterImage
                look={{ ...look, [part.id]: variant.id }}
                view={thumbnailView(variant)}
                className="border-border aspect-4/5 w-full rounded-lg border-2"
              />
              {label(variant)}
            </button>
          ))}
        </section>
      )}
    </main>
  )
}
