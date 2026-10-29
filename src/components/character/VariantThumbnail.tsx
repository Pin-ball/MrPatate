import { thumbnailView } from '@src/lib/catalog/camera.ts'
import { defaultLook } from '@src/lib/catalog/index.ts'
import type { Look, Part, Variant } from '@src/lib/catalog/types.ts'
import { Backdrop } from './Backdrop.tsx'
import { CharacterImage } from './CharacterImage.tsx'

type VariantThumbnailProps = {
  look: Look
  part: Part
  variant: Variant
}

export function VariantThumbnail({ look, part, variant }: VariantThumbnailProps) {
  const { paint } = variant

  return (
    <span className="border-foreground bg-background size-[72px] shrink-0 overflow-hidden rounded-[14px] border-2">
      {paint?.kind === 'skin' && (
        <span className="block size-full" style={{ background: paint.skin }} />
      )}
      {paint?.kind === 'background' && (
        <svg className="block size-full" aria-hidden>
          <Backdrop paint={paint} />
        </svg>
      )}
      {!paint && (
        <CharacterImage
          look={{ ...look, background: defaultLook.background, [part.id]: variant.id }}
          view={thumbnailView(variant)}
          className="block size-full"
        />
      )}
    </span>
  )
}
