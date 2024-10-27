import clsx from 'clsx';
import useStore from "@src/store/store.js";
import {useEffect, useRef, useState} from 'react';
import {getActiveElements} from '@src/components/svg'

export default function Viewer() {
  const {setRef} = useStore()
  const svgRef = useRef()
  const [hasHoverShift, setHasHoverShift] = useState(true)
  const [hover, setHover] = useState(null)
  const [mouse, setMouse] = useState({x: 0, y: 0})

  //TODO: Revoir fonctionnement > Pas du tout optimisé (get a chaque refresh)
  const elements = getActiveElements()

  useEffect(() => {
    setRef(svgRef.current)

    return () => {
      setRef(null)
    }
  }, []);

  const handleHover = (e) => {
    if (!svgRef) return

    const {x, y, height, width} = svgRef.current.getBoundingClientRect()
    const [xShift, yShift] = [((e.clientX - x) / (width / 2)) - 1, ((e.clientY - y) / (height / 2)) - 1]
    setMouse({x: -xShift, y: -yShift})
  }

  const handleLeave = (e) => {
    setMouse({x: 0, y: 0})
  }

  return (
    <svg
      ref={svgRef}
      {...(hasHoverShift && {onMouseMove: handleHover, onMouseLeave: handleLeave})}
      xmlns='http://www.w3.org/2000/svg' xmlSpace='preserve' x='0px' y='0px'
      width='80' height='100' viewBox='0 0 800 1000' fill='#000' enableBackground='new 0 0 800 1000'
      className='grow w-auto'>
      {elements.map(({Path, shift, key}, i) => (
        <Path
          key={i}
          onClick={() => console.log('Click: ', key)}
          onMouseOver={() => {
            setHover(key)
          }}
          onMouseLeave={() => {
            setHover(null)
          }}
          //TODO: Contour blanc sur :hover à la place ?
          className={clsx({
            'transition-all': mouse.x === 0 && mouse.y === 0,
            // 'grayscale saturate-50 brightness-75 blur-[2px]': hover && hover !== key,
            // 'drop-shadow-[0px_0px_10px_rgba(0,0,0,0.30)]': hover && hover === key,
          })}
          //TODO: Move Translation into it's own component
          style={{
            transformOrigin: '50% 50%',
            transform: `translate(${mouse.x * (shift?.x ?? 0)}rem, ${mouse.y * (shift?.y / 2 ?? 0)}rem) rotateY(${mouse.x * 25}deg)`
          }}/>
      ))}
    </svg>
  )
}

