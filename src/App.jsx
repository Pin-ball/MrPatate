// import PRESET from 'src/config/preset.json'
import OPTIONS from 'src/config/config.json'

import 'src/assets/styles/App.css'
import icons from 'src/assets/icons.js'
import logo from 'src/assets/Logo.svg'

import Viewer from 'src/components/viewer'
import Selectors from 'src/components/selectors'

import {useEffect, useState} from 'react'

import {useDispatch, useSelector} from "react-redux"
import {randomIndexes, setIndexes} from "src/store/reducer/parts.js"
import downloadSvg from "src/fn/download.js";


function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  // const [downloadModal, setShowModal] = useState(false)
  const [tab, setTab] = useState('physical')
  // const { toggleTheme, darkMode } = useContext(ThemeContext)

  const dispatch = useDispatch()
  const parts = useSelector(store => store.parts)

  useEffect(() => {
    let ids = getUrlPreset()
    dispatch(setIndexes(ids))
    // dispatch(setIndexes(PRESET.roi))
  }, [])


  const getUrlPreset = () => {
    let urlPresetIds = {}
    for (const [key, id] of queryParameters) {
      urlPresetIds[key] = id
    }
    return urlPresetIds
  }


  const getShareUrl = () => {
    let url = Object.entries(parts.ids).reduce((acc, [key, id]) =>
      `${acc}&${key}=${id}`, "http://localhost:5173?")
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log('Copied share url: ', url)
      })
  }


  const DisplayTabs = () => {
    console.log()
    return Object.entries(OPTIONS.cats).map(([key, cat]) =>
      <button key={key} onClick={() => setTab(key)} className={tab === key ? 'active' : undefined}>{cat}</button>
    )
  }


  return (
    <div className="main">

      <div className="selectors-wrapper">
        <header className='header'>
          <img src={logo} className="logo" alt="Logo" />
          <div className="title">PIERRE &nbsp;MAKER</div>
        </header>

        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          <br></br>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>

        <div className="tabs">
          <DisplayTabs />
        </div>

        <ul className="selectors-list">
          <Selectors tab={tab} />
        </ul>
      </div>

      <div className="display-wrapper">
        <div className="display-actions">
          <button className="icon icon-action" onClick={() => dispatch(setIndexes())}>
            <img src={icons.reset} alt="Reset" />
          </button>
          <button className="icon icon-action" onClick={() => dispatch(randomIndexes())}>
            <img src={icons.random} alt="Random" />
          </button>
          <button className="icon icon-action" onClick={() => downloadSvg(parts)}>
            <img src={icons.download} alt="Download" />
          </button>
          <button className="icon icon-action" onClick={getShareUrl}>
            <img src={icons.share} alt='share' />
          </button>
        </div>

        <div className="parts">
          <Viewer />
        </div>
      </div>

      {/*{downloadModal && createPortal(<Modal closeModal={() => setShowModal(false)} src={src} />, document.body)}*/}

      {/* TODO: Add nicely later */}
      {/*<div className="tabs">*/}
      {/*  <button onClick={toggleTheme}>{darkMode ? 'Dark' : 'Light'} Theme</button>*/}
      {/*</div>*/}
    </div>
  )
}

export default App
