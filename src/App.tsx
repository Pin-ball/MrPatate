import { Background } from '@src/components/Background.tsx'
import { Header } from '@src/components/Header.tsx'
import { LabPanel } from '@src/components/LabPanel.tsx'
import { Scene } from '@src/components/Scene.tsx'
import { Toaster } from '@src/components/Toaster.tsx'
import { useParallax } from '@src/hooks/useParallax.ts'
import { useSharedLink } from '@src/hooks/useSharedLink.ts'
import { backgroundOf } from '@src/lib/catalog/layers.ts'
import { useShownLook } from '@src/stores/editor.ts'

export function App() {
  useSharedLink()
  useParallax()
  const background = backgroundOf(useShownLook())

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden pb-[90px]">
      <Background paint={background} />
      <Header dark={background.dark} />
      <Scene />
      <LabPanel />
      <Toaster />
    </main>
  )
}
