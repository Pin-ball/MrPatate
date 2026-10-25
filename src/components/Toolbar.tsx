import { DownloadPopover } from '@src/components/DownloadPopover.tsx'
import { FavoritesPopover } from '@src/components/FavoritesPopover.tsx'
import { SharePopover } from '@src/components/SharePopover.tsx'
import { useOutsideClick } from '@src/hooks/useOutsideClick.ts'
import { IconButton } from '@src/ui/IconButton.tsx'
import type { LucideIcon } from 'lucide-react'
import { Download, Share2, Star } from 'lucide-react'
import type { ComponentType } from 'react'
import { useRef, useState } from 'react'

type ToolbarActionId = 'favorites' | 'download' | 'share'

type ToolbarAction = {
  id: ToolbarActionId
  label: string
  icon: LucideIcon
  Popover: ComponentType
}

const toolbarActions: ToolbarAction[] = [
  { id: 'favorites', label: 'Favoris', icon: Star, Popover: FavoritesPopover },
  { id: 'download', label: 'Télécharger', icon: Download, Popover: DownloadPopover },
  { id: 'share', label: 'Partager', icon: Share2, Popover: SharePopover },
]

export function Toolbar() {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [openActionId, setOpenActionId] = useState<ToolbarActionId | null>(null)

  useOutsideClick(toolbarRef, () => setOpenActionId(null))

  const OpenPopover = toolbarActions.find((action) => action.id === openActionId)?.Popover

  return (
    <div
      ref={toolbarRef}
      className="border-border bg-surface relative ml-auto flex gap-2 rounded-lg border px-4 py-2.5"
    >
      {toolbarActions.map(({ id, label, icon }) => (
        <IconButton
          key={id}
          icon={icon}
          label={label}
          active={openActionId === id}
          onClick={() => setOpenActionId((current) => (current === id ? null : id))}
        />
      ))}

      {OpenPopover && <OpenPopover />}
    </div>
  )
}
