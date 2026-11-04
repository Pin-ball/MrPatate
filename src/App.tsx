import { Background } from '@src/components/Background.tsx'
import { Header } from '@src/components/Header.tsx'
import { FavoritesPile } from '@src/components/hand/FavoritesPile.tsx'
import { PartsPile } from '@src/components/hand/PartsPile.tsx'
import { VariantsHand } from '@src/components/hand/VariantsHand.tsx'
import { Scene } from '@src/components/Scene.tsx'
import { Toaster } from '@src/components/Toaster.tsx'
import { useCloseHandOnEscape } from '@src/hooks/useCloseHandOnEscape.ts'
import { useOrientationPermission } from '@src/hooks/useOrientationPermission.ts'
import { useSharedLink } from '@src/hooks/useSharedLink.ts'
import { backgroundOf } from '@src/lib/catalog/layers.ts'
import { MOTION_VARIABLES } from '@src/lib/motion.ts'
import { useShownLook } from '@src/stores/editor.ts'

export function App() {
  useSharedLink()
  useCloseHandOnEscape()
  useOrientationPermission()
  const look = useShownLook()
  const background = backgroundOf(look)

  return (
    <main
      style={MOTION_VARIABLES}
      data-background={background.dark ? 'dark' : 'light'}
      className="relative flex h-dvh flex-col overflow-hidden pt-(--safe-top) pb-(--safe-bottom)"
    >
      <Background paint={background} />
      <Header />
      <Scene />
      <VariantsHand />
      <PartsPile />
      <FavoritesPile />
      <Toaster />
    </main>
  )
}
