import { PresetPicker } from '@src/components/PresetPicker.tsx'
import { VariantPicker } from '@src/components/VariantPicker.tsx'
import { useCharacterStore } from '@src/stores/character.ts'
import { Accordion, AccordionPanel } from '@src/ui/Accordion.tsx'
import { IconButton } from '@src/ui/IconButton.tsx'
import { PersonStanding, RotateCcw, Shuffle } from 'lucide-react'

export function Sidebar() {
  const resetLook = useCharacterStore((state) => state.resetLook)
  const randomizeLook = useCharacterStore((state) => state.randomizeLook)

  return (
    <div className="flex h-full flex-col">
      <header className="border-border bg-surface mb-6 flex h-14 shrink-0 items-center rounded-lg border px-4">
        <PersonStanding aria-hidden="true" className="text-accent m-2 mr-8 size-6" />
        <h1 className="grow">Mr Patate</h1>
        <div className="flex shrink-0 gap-2">
          <IconButton icon={RotateCcw} label="Réinitialiser" onClick={resetLook} />
          <IconButton icon={Shuffle} label="Aléatoire" onClick={randomizeLook} />
        </div>
      </header>

      <Accordion defaultValue="variants">
        <AccordionPanel value="variants" title="Personnalisation">
          <VariantPicker />
        </AccordionPanel>

        <AccordionPanel value="presets" title="Ensembles">
          <PresetPicker />
        </AccordionPanel>
      </Accordion>
    </div>
  )
}
