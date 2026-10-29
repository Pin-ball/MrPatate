import { download } from '@src/lib/download.ts'
import { characterPng, characterSvg } from '@src/lib/export.ts'
import { shareUrl } from '@src/lib/share.ts'
import { useEditor } from '@src/stores/editor.ts'
import { showToast } from '@src/stores/toast.ts'
import { Button } from '@src/ui/Button.tsx'
import type { LucideIcon } from 'lucide-react'
import { FileDown, ImageDown, Link, Share, Share2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const canShareNatively = 'share' in navigator

export function ShareMenu() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const look = useEditor((state) => state.look)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    const listeners = new AbortController()
    document.addEventListener('pointerdown', closeOutside, listeners)
    document.addEventListener('keydown', closeOnEscape, listeners)
    return () => listeners.abort()
  }, [open])

  const run = (action: () => Promise<void>) => () => {
    setOpen(false)
    trigger.current?.focus()
    void action()
  }

  const link = () => shareUrl(look, location.href)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link())
      showToast(t('toast_link_copied'))
    } catch {
      showToast(t('toast_link_not_copied'))
    }
  }

  const downloadPng = async () => {
    download(await characterPng(look, t('character')), 'mr-patate.png')
    showToast(t('toast_png_downloaded'))
  }

  const downloadSvg = async () => {
    const svg = await characterSvg(look, t('character'))
    download(new Blob([svg], { type: 'image/svg+xml' }), 'mr-patate.svg')
    showToast(t('toast_svg_downloaded'))
  }

  const shareNatively = () =>
    navigator.share({ title: t('app_title'), url: link() }).catch(() => undefined)

  return (
    <div ref={root} className="relative">
      <Button ref={trigger} variant="primary" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Share2 size={18} strokeWidth={2.5} />
        {t('share')}
      </Button>
      {open && (
        <div className="border-stroke bg-popover text-popover-foreground shadow-hard-lg animate-fade-in absolute top-[calc(100%+10px)] right-0 z-40 flex min-w-[220px] flex-col rounded-xl p-1.5">
          <MenuItem icon={Link} onClick={run(copyLink)}>
            {t('share_copy_link')}
          </MenuItem>
          <MenuItem icon={ImageDown} onClick={run(downloadPng)}>
            {t('share_download_png')}
          </MenuItem>
          <MenuItem icon={FileDown} onClick={run(downloadSvg)}>
            {t('share_download_svg')}
          </MenuItem>
          {canShareNatively && (
            <MenuItem icon={Share} onClick={run(shareNatively)}>
              {t('share_native')}
            </MenuItem>
          )}
        </div>
      )}
    </div>
  )
}

type MenuItemProps = {
  icon: LucideIcon
  onClick: () => void
  children: ReactNode
}

function MenuItem({ icon: Icon, onClick, children }: MenuItemProps) {
  return (
    <Button variant="ghost" onClick={onClick} className="text-[14px]">
      <Icon size={16} strokeWidth={2.5} />
      {children}
    </Button>
  )
}
