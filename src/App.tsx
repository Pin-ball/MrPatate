import { Badge } from '@src/ui/Badge.tsx'
import { Button } from '@src/ui/Button.tsx'
import { IconButton } from '@src/ui/IconButton.tsx'
import { Pill } from '@src/ui/Pill.tsx'
import { Toast } from '@src/ui/Toast.tsx'
import { Dices, Download, Link, Redo2, Share2, Star, Undo2 } from 'lucide-react'

export function App() {
  return (
    <main className="flex min-h-dvh flex-col gap-8 p-8">
      <h1 className="font-display text-[26px]">Mr Patate</h1>

      <section className="flex flex-wrap items-center gap-4">
        <Pill className="h-12 gap-1 px-[5px]" role="toolbar" aria-label="Actions">
          <IconButton variant="ghost" label="Annuler">
            <Undo2 size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
          <IconButton variant="ghost" label="Rétablir" disabled>
            <Redo2 size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
          <span className="bg-divider mx-[5px] h-5 w-0.5 rounded-xs" aria-hidden />
          <IconButton variant="ghost" label="Surprise : un Pierre au hasard">
            <Dices size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
          <IconButton variant="ghost" label="Ajouter aux Favoris">
            <Star size={22} strokeWidth={2.25} aria-hidden />
          </IconButton>
        </Pill>
        <Button variant="primary" className="h-12">
          <Share2 size={18} strokeWidth={2.25} aria-hidden />
          Partager
        </Button>
        <IconButton variant="primary" label="Partager">
          <Share2 size={16} strokeWidth={2.25} aria-hidden />
        </IconButton>
      </section>

      <section className="flex flex-wrap items-center gap-4">
        <Pill>
          <span className="label-caps text-muted-foreground">Bras · 3/8</span>
          <span className="font-display text-[17px]">Bras massue</span>
          <Badge>essai</Badge>
        </Pill>
        <IconButton label="Variante au hasard">
          <Dices size={20} strokeWidth={2.25} aria-hidden />
        </IconButton>
        <Button>↙ Parties</Button>
      </section>

      <section className="flex flex-wrap items-start gap-4">
        <div className="border-stroke bg-popover shadow-hard-lg flex min-w-[220px] flex-col rounded-xl p-1.5">
          <Button variant="ghost">
            <Link size={18} strokeWidth={2.25} aria-hidden />
            Copier le lien
          </Button>
          <Button variant="ghost">
            <Download size={18} strokeWidth={2.25} aria-hidden />
            Télécharger le PNG
          </Button>
        </div>
        <Toast message="Retiré des Favoris" action={{ label: 'Annuler', onClick: () => {} }} />
      </section>

      <section className="flex flex-wrap gap-4">
        <div className="border-stroke bg-card shadow-hard h-[136px] w-[104px] rounded-2xl" />
        <div className="border-stroke bg-accent shadow-hard h-[136px] w-[104px] rounded-2xl" />
        <div className="border-stroke border-slot bg-slot-surface h-[136px] w-[104px] rounded-2xl border-dashed" />
      </section>
    </main>
  )
}
