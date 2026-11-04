import { thumbnailView } from '@src/lib/catalog/camera.ts'
import { defaultLook } from '@src/lib/catalog/index.ts'
import { withVariant } from '@src/lib/catalog/look.ts'
import type { Look, Part, Variant } from '@src/lib/catalog/types.ts'
import { BackgroundFill } from './BackgroundFill.tsx'
import { CharacterImage } from './CharacterImage.tsx'

type VariantThumbnailProps = {
  look: Look
  part: Part
  variant: Variant
}

export function VariantThumbnail({ look, part, variant }: VariantThumbnailProps) {
  const { paint } = variant

  return (
    <span className="border-foreground bg-background size-(--card-picture) shrink-0 overflow-hidden rounded-[14px] border-2">
      {paint?.kind === 'skin' && (
        <span className="block size-full" style={{ background: paint.color }} />
      )}
      {paint?.kind === 'background' && (
        <svg className="block size-full" aria-hidden>
          <BackgroundFill paint={paint} />
        </svg>
      )}
      {!paint && (
        <CharacterImage
          look={withVariant({ ...look, background: defaultLook.background }, part.id, variant.id)}
          view={thumbnailView(variant)}
          className="block size-full"
        />
      )}
    </span>
  )
}
