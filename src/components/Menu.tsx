import { RandomIcon, ResetIcon } from "@src/assets/icons";
import Customisation from "@src/components/Customisation";
import Presets from "@src/components/Presets";
import Accordion from "@src/components/ui/Accordion";
import useStore from "@src/store/store";

export default function Menu() {
  const { resetSkins, randomSkins } = useStore();

  return (
    <Accordion>
      <Accordion.Panel
        disabled
        title={
          <div className="flex items-center justify-between">
            Pierre Kayoo
            <div className="flex gap-2 my-auto shrink-0">
              <span
                onClick={resetSkins}
                className="p-2 transition-all rounded-full bg-c-neutral-700 hover:bg-c-green-500 active:scale-90"
              >
                <img src={ResetIcon} alt="Reset" className="invert size-5" />
              </span>
              <span
                onClick={randomSkins}
                className="p-2 transition-all rounded-full bg-c-neutral-700 hover:bg-c-green-500 active:scale-90"
              >
                <img src={RandomIcon} alt="Random" className="invert size-5" />
              </span>
            </div>
          </div>
        }
      >
        <></>
      </Accordion.Panel>

      <span className="mb-2"></span>

      <Accordion.Panel title="Personnalisation" defaultExpanded>
        <Customisation />
      </Accordion.Panel>

      <Accordion.Panel title="Ensembles">
        <Presets />
      </Accordion.Panel>
    </Accordion>
  );
}

Menu.propTypes = {};
