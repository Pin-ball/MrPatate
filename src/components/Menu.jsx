import useStore from '@src/store/store.js';
import Presets from "@src/components/Presets.jsx";
import Accordion from '@src/components/Accordion.jsx';
import {RandomIcon, ResetIcon} from '@src/assets/icons';
import Customisation from "@src/components/Customisation.jsx";

export default function Menu() {
  const {resetSkins, randomSkins} = useStore()

  return (
    <Accordion>
      <Accordion.Panel
        disabled
        title={
          <div className='flex justify-between items-center'>
            Pierre Kayoo
            <div className='flex shrink-0 gap-2 my-auto'>
              <span
                onClick={resetSkins}
                className='p-2 bg-c-neutral-700 rounded-full hover:bg-c-green-500 active:scale-90 transition-all'>
                <img src={ResetIcon} alt='Reset' className='invert size-5'/>
              </span>
              <span
                onClick={randomSkins}
                className='p-2 bg-c-neutral-700 rounded-full hover:bg-c-green-500 active:scale-90 transition-all'>
                <img src={RandomIcon} alt='Random' className='invert size-5'/>
              </span>
            </div>
          </div>}>
      </Accordion.Panel>

      <span className='mb-2'></span>

      <Accordion.Panel title='Personnalisation' defaultExpanded>
        <Customisation/>
      </Accordion.Panel>

      <Accordion.Panel title='Ensembles'>
        <Presets/>
      </Accordion.Panel>
    </Accordion>
  )
}

Menu.propTypes = {};
