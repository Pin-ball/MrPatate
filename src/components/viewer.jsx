import OPTIONS from 'src/config/config.json'

import { useSelector } from 'react-redux';

export default function Viewer() {
  const parts = useSelector(store => store.parts)

  const srcError = (e) => {
    e.onerror = null;
    e.target.src= './assets/parts/calibre.svg';
  }

  // console.log(parts)

  return OPTIONS.parts.map((part, i) => {

    let partIndex = parts.indexes[part.key]
    if (part.active === false || partIndex === undefined) return

    let option = part.options[partIndex]
    if (option.id === null ) return

    let url = `./assets/parts/${part.prefix + option.id}.svg`

    return (
      <img key={i} className='part' ref={(r)=>{
        // console.log(r)
      }}
      src={url}  alt={part.key+'-part'}
      style={{zIndex: option.zIndex}}
      onError={srcError}
      />
      )
  })

  // return Object.entries(parts.active).map(([key, part], i) => {
  //
  //   // let partIndex = parts.indexes[key]
  //   // TODO: Implement part.active in store ?
  //   // if (part.active === false || partIndex === undefined) return
  //
  //   console.log(part)
  //   if (part.id === null) return
  //   console.log("part id OK")
  //
  //   // let option = part.options[partIndex]
  //   // if (option.id === null ) return
  //
  //   let url = `./assets/parts/${part.prefix + part.id}.svg`
  //
  //   return (
  //     <img key={i} className='part'
  //     src={url}  alt={key+'-part'}
  //     style={{zIndex: part.zIndex}}
  //     onError={srcError}
  //     />
  //     )
  // })
}
