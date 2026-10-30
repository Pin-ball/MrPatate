import { Background } from '@src/components/Background.tsx'
import { Header } from '@src/components/Header.tsx'
import { FavoritesPile } from '@src/components/hand/FavoritesPile.tsx'
import { PartsPile } from '@src/components/hand/PartsPile.tsx'
import { VariantsHand } from '@src/components/hand/VariantsHand.tsx'
import { Scene } from '@src/components/Scene.tsx'
import { Toaster } from '@src/components/Toaster.tsx'
import { useCloseHandOnEscape } from '@src/hooks/useCloseHandOnEscape.ts'
import { useSharedLink } from '@src/hooks/useSharedLink.ts'
import { backgroundOf } from '@src/lib/catalog/layers.ts'
import { useShownLook } from '@src/stores/editor.ts'

export function App() {
  useSharedLink()
  useCloseHandOnEscape()
  const background = backgroundOf(useShownLook())

  return (
    <main
      data-backdrop={background.dark ? 'dark' : 'light'}
      className="relative flex h-dvh flex-col overflow-hidden pb-[90px]"
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
