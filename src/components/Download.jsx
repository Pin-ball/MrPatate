import useStore from '@src/store/store.js';
import {saveSvgAsPng} from 'save-svg-as-png';
import {downloadSvg} from '@src/utils/index.js';

export default function Download() {
  const { ref } = useStore()

  const getSvg = () => {
    downloadSvg(ref.current, 'Pierre.svg')
  }

  const getPng = () => {
    saveSvgAsPng(ref.current, 'Pierre.png')
  }

  return (
    <div className='absolute top-16 right-0 px-4 py-2 rounded-lg border border-c-neutral-700 bg-c-neutral-800'>
      <div className='text-sm font-extralight text-c-neutral-600 mb-4'>Téléchargement</div>
      <ul>
        <Item action={getSvg} title='SVG' description='Optimisé'/>
        <Item action={getPng} title='PNG' description='1600&nbsp;x&nbsp;2000'/>
      </ul>
    </div>
  )
}

const Item = ({action, title, description}) => (
  <li
    onClick={action}
    className='flex items-center justify-between mb-1 px-2 py-1 -mx-2 rounded hover:bg-c-neutral-700 active:scale-95 transition-all'
  >
    {title}
    <span className='ml-12 text-sm font-extralight text-c-neutral-600'>{description}</span>
  </li>
)
