import useStore from '@src/store/store.js';
import preset from '@src/config/preset.json'

export default function Customisation() {
  const {setSkins} = useStore()

  // todo: Changer l'aspect des bouton de préset ou le mettre en vert si preset actif
  return (
    <>
      <ul className='flex gap-2 flex-wrap overflow-auto items-start'>
        {preset.map(({key, logo}) => (
          <li
            key={key}
            onClick={() => setSkins(key)}
            className='p-2 rounded hover:bg-c-neutral-700'
          >
            <img className='size-12' src={logo} alt={preset}/>
          </li>
        ))}
      </ul>
    </>
  )
}
