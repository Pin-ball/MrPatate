import { download } from '@src/lib/download.ts'
import { characterPng, characterSvg } from '@src/lib/export.ts'
import { shareUrl } from '@src/lib/share.ts'
import { useEditor } from '@src/stores/editor.ts'
import { showToast } from '@src/stores/toast.ts'
import { Menu } from '@src/ui/Menu.tsx'
import { MenuItem } from '@src/ui/MenuItem.tsx'
import { FileDown, ImageDown, Link, Share, Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const canShareNatively = 'share' in navigator

export function ShareMenu() {
  const { t } = useTranslation()
  const look = useEditor((state) => state.look)

  const link = () => shareUrl(look, location.href)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link())
      showToast(t('toast.link_copied'))
    } catch {
      showToast(t('toast.link_not_copied'))
    }
  }

  const downloadPng = async () => {
    download(await characterPng(look, t('app.character')), 'mr-patate.png')
    showToast(t('toast.png_downloaded'))
  }

  const downloadSvg = async () => {
    const svg = await characterSvg(look, t('app.character'))
    download(new Blob([svg], { type: 'image/svg+xml' }), 'mr-patate.svg')
    showToast(t('toast.svg_downloaded'))
  }

  const shareNatively = () =>
    navigator.share({ title: t('app.title'), url: link() }).catch(() => undefined)

  return (
    <Menu
      variant="primary"
      className="h-12"
      trigger={
        <>
          <Share2 size={18} strokeWidth={2.5} />
          {t('share.label')}
        </>
      }
    >
      <MenuItem icon={Link} onClick={() => void copyLink()}>
        {t('share.copy_link')}
      </MenuItem>
      <MenuItem icon={ImageDown} onClick={() => void downloadPng()}>
        {t('share.download_png')}
      </MenuItem>
      <MenuItem icon={FileDown} onClick={() => void downloadSvg()}>
        {t('share.download_svg')}
      </MenuItem>
      {canShareNatively && (
        <MenuItem icon={Share} onClick={() => void shareNatively()}>
          {t('share.native')}
        </MenuItem>
      )}
    </Menu>
  )
}
