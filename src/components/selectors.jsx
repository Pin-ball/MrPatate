import PropTypes from 'prop-types';
import OPTIONS from 'src/config/config.json'

import iconReset from 'src/assets/icons/reset.png'
import iconRandom from 'src/assets/icons/random.png'
import iconLock from 'src/assets/icons/lock.png'

import { useDispatch, useSelector } from "react-redux"
import { resetIndex, nextIndex, previousIndex, randomIndex } from "src/store/reducer/parts.js"


export default function Selectors({tab = undefined}) {
  const dispatch = useDispatch()
  const parts = useSelector(store => store.parts)

  let catParts = OPTIONS.parts.filter(part => part.cat === tab && part.listed === true && part.options.length > 1)
  return catParts.map((part, i) => {

    let partIndex = parts.indexes[part.key]
    if (!part.active || partIndex === undefined) return

    return (
      <li key={i} className={
        ((part.options).length <= 1 ? 'inactive' : undefined) +
        // TODO: Add Lock for each option ???
        // (part.options[partsIndex[part.key]-1].lock ? 'locked' : undefined) +
        ' selector'}>
        <div className="content">
          <div className="icon icon-item">
            <img src={`./assets/icons/`+part.logo} alt="Icon"/>
          </div>
          <div className="name">{part.options[partIndex].name}</div>
          <button className="icon icon-action" onClick={()=>dispatch(resetIndex(part.key))}>
            <img src={iconReset} alt="Reset"/>
          </button>
          <button className="icon icon-action" onClick={()=>{dispatch(randomIndex(part.key))}}>
            <img src={iconRandom} alt="Random"/>
          </button>
          <div className="choices">
            <button className="previous" onClick={()=>dispatch(previousIndex(part.key))}></button>
            <div className="position"><span>{parts.indexes[part.key]+1} </span>/ {(part.options.length)}</div>
            <button className="next" onClick={()=>dispatch(nextIndex(part.key))}></button>
            <div className="lock">
              <img src={iconLock} alt="Random"/>
            </div>
          </div>
        </div>
      <div className="separator"></div>
      </li>
    )
  })
}


Selectors.propTypes = {
  children: PropTypes.node,
  tab: PropTypes.string
};