import { CharacterView } from '@src/components/CharacterView.tsx'
import { MobileUnsupported } from '@src/components/MobileUnsupported.tsx'
import { Sidebar } from '@src/components/Sidebar.tsx'
import { Toolbar } from '@src/components/Toolbar.tsx'
import { useMediaQuery } from '@src/hooks/useMediaQuery.ts'

export function App() {
  const isMobile = useMediaQuery('(max-width: 800px)')
  if (isMobile) return <MobileUnsupported />

  return (
    <div className="flex h-screen p-7">
      <nav className="w-1/3 min-w-[390px]">
        <Sidebar />
      </nav>
      <main className="flex grow flex-col">
        <Toolbar />
        <CharacterView />
      </main>
    </div>
  )
}
