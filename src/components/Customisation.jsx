import clsx from 'clsx';
import {useState} from 'react';
import useStore from '@src/store/store.js';
import {allParts} from '@src/components/svg'
import {RandomIcon, ResetIcon} from '@src/assets/icons';

export default function Customisation() {
  const [tab, setTab] = useState(0)
  const {skins, resetSkin, setSkin, randomSkin} = useStore()

  const selectedPart = allParts[tab]
  const selectedSkin = skins[selectedPart.key]

  return (
    <div className='flex h-full'>
      <div className='mr-4 pr-4 shrink-0 border-r border-c-neutral-700'>
        {
          allParts.map((part, i) => (
            <div
              key={i}
              onClick={() => setTab(i)}
              className={clsx('mb-2 p-2 rounded-full',
                part.key === selectedPart.key ? 'bg-c-green-400' : 'bg-c-neutral-700')}
            >
              <img src={part.logo} alt={part.label} className='size-6 fill-white'/>
            </div>
          ))
        }
      </div>

      <div className='grow flex flex-col'>
        <div className='flex justify-between mb-4'>
          <div>
            <p className='text-sm font-extralight text-c-neutral-600'>{selectedPart.label}</p>
            <p>{selectedPart.skins.find(s => s.id === selectedSkin).name || 'oupsy'}</p>
          </div>

          <div className='flex shrink-0 gap-2 my-auto'>
            <span
              onClick={() => resetSkin(selectedPart.key)}
              className='p-2 bg-c-neutral-700 rounded-full hover:bg-c-green-500 active:scale-90 transition-all'>
              <img src={ResetIcon} alt='Reset' className='invert size-5'/>
            </span>
            <span
              onClick={() => randomSkin(selectedPart.key)}
              className='p-2 bg-c-neutral-700 rounded-full hover:bg-c-green-500 active:scale-90 transition-all'>
              <img src={RandomIcon} alt='Random' className='invert size-5'/>
            </span>
          </div>
        </div>

        <ul className='flex gap-2 flex-wrap overflow-auto items-start'>
          {selectedPart.skins.map(s => (
            <li
              key={s.id}
              onClick={() => setSkin(selectedPart.key, s.id)}
              className={clsx('p-2 rounded',
                s.id === selectedSkin ? 'bg-c-green-400' : 'hover:bg-c-neutral-700'
              )}
            >
              <img className='size-12' src={s.logo} alt={s.name}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
