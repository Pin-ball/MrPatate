import clsx from "clsx";
import {useEffect, useState} from "react";
import Share from "@src/components/Share.jsx";
import Download from '@src/components/Download';
import Favorite from "@src/components/Favorite.jsx";
import useOutsideClick from "@src/components/useOutsideClick.jsx";
import {DownloadIcon, FavoriteIcon, ShareIcon} from '@src/assets/icons/index.js';

export default function Header() {
  const [selected, setSelected] = useState(null)
  //TODO: Modify evenListener to catch click outside only if HeaderItem is Mounted
  const ref = useOutsideClick(() => { setSelected(null) });

  const headers = [
    {name:'favorite', icon:FavoriteIcon},
    {name:'download', icon:DownloadIcon},
    {name:'share', icon:ShareIcon}
  ]

  const handleSelection = (target) =>
  {
    setSelected(target === selected ? null : target)
  }

  return (
    <div ref={ref} className='relative flex ml-auto gap-2 px-4 py-2.5 rounded-lg border border-c-neutral-700 bg-c-neutral-800'>
      {headers.map((item, i) => (
          <HeaderItem key={i} item={item} action={handleSelection} selected={selected}/>
        ))
      }

      {selected === 'favorite' ? <Favorite/> : null}
      {selected === 'download' ? <Download/> : null}
      {selected === 'share'    ? <Share/> : null}
    </div>
  )
}


function HeaderItem({item, action, selected}) {
  const {name, icon} = item
  return (
    <span
      onClick={() => action(name)}
      className={
        clsx('p-2 rounded-full active:scale-90 transition-all',
          {'bg-c-green-500': selected === name, 'bg-c-neutral-700 hover:bg-neutral-600': selected !== name})}
    >
        <img src={icon} alt={name} className='invert size-5'/>
    </span>
  )
}
