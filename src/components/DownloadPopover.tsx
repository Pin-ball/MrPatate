import { downloadPng, downloadSvg } from '@src/lib/download.ts'
import { useCharacterStore } from '@src/stores/character.ts'
import { Popover } from '@src/ui/Popover.tsx'

const PNG_SIZE = { width: 1600, height: 2000 }

export function DownloadPopover() {
  const svgElement = useCharacterStore((state) => state.svgElement)

  return (
    <Popover title="Téléchargement">
      <ul>
        <DownloadOption
          format="SVG"
          description="Optimisé"
          onClick={() => svgElement && downloadSvg(svgElement, 'Pierre.svg')}
        />
        <DownloadOption
          format="PNG"
          description={`${PNG_SIZE.width} x ${PNG_SIZE.height}`}
          onClick={() => svgElement && downloadPng(svgElement, 'Pierre.png', PNG_SIZE)}
        />
      </ul>
    </Popover>
  )
}

type DownloadOptionProps = {
  format: string
  description: string
  onClick: () => void
}

function DownloadOption({ format, description, onClick }: DownloadOptionProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="hover:bg-surface-raised -mx-2 mb-1 flex w-[calc(100%+1rem)] cursor-pointer items-center justify-between rounded px-2 py-1 whitespace-nowrap transition-all active:scale-95"
      >
        {format}
        <span className="text-muted ml-12 text-sm font-extralight">{description}</span>
      </button>
    </li>
  )
}
