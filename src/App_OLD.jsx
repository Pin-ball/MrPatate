// import PRESET from 'src/config/preset.json'
import OPTIONS from 'src/config/config.json'

import 'src/assets/styles/App.css'
import icons from '@src/assets/icons_OLD/icons.js'
import logo from 'src/assets/Logo.svg'

import Viewer from 'src/components/viewer'
import Selectors from 'src/components/selectors'

import {useEffect, useState} from 'react'

import {useDispatch, useSelector} from "react-redux"
import {randomIndexes, setIndexes} from "src/store/reducer/parts.js"
import downloadSvg from "src/fn/download.js";

// https://www.npmjs.com/package/react-share
import {
  EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  FacebookMessengerShareButton, FacebookMessengerIcon,
  WhatsappShareButton, WhatsappIcon
} from "react-share";
import PositionnedModal from "src/components/positionnedModal.jsx";


function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  // const [downloadModal, setShowModal] = useState(false)
  const [tab, setTab] = useState('physical')
  const [shareUrl, setShareUrl] = useState('https://mr-patate.vercel.app')
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
    // let baseUrl = 'http://localhost:5173?'
    let baseUrl = 'https://mr-patate.vercel.app?'
    let url = Object.entries(parts.ids).reduce((acc, [key, id]) =>
      `${acc}&${key}=${id}`, baseUrl)
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log('Copied share url: ', url)
        setShareUrl(url)
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
          <img src={logo} className="logo" alt="Logo"/>
          <div className="title">PIERRE &nbsp;MAKER</div>
        </header>

        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
          <br></br>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>

        <EmailIcon size={32} round={true}></EmailIcon>
        <EmailShareButton
          url={shareUrl}
          subject={"Pierre Maker"}
          body={"Trouve un nouvel outil trop cool pour créer ton propre Pierre ici :"}
        >
          EmailShareButton
        </EmailShareButton>

        <br></br>
        <br></br>

        <WhatsappIcon size={32} round={true}></WhatsappIcon>
        <WhatsappShareButton
          url={shareUrl}
          title={"Pierre Maker: Un nouvel outil trop cool pour créer ton propre Pierre"}
          separator={'\n'}
        >
          WhatsappShareButton
        </WhatsappShareButton>

        <br></br>
        <br></br>

        <FacebookIcon size={32} round={true}></FacebookIcon>
        <FacebookShareButton
          url={shareUrl}
          title={"Pierre Maker: Un nouvel outil trop cool pour créer ton propre Pierre"}
          separator={'\n'}
        >
          FacebookShareButton
        </FacebookShareButton>

        <br></br>
        <br></br>

        <FacebookMessengerIcon size={32} round={true}></FacebookMessengerIcon>
        <FacebookMessengerShareButton
          url={shareUrl}
          title={"Pierre Maker: Un nouvel outil trop cool pour créer ton propre Pierre"}
          separator={'\n'}
        >
          FacebookMessengerShareButton
        </FacebookMessengerShareButton>

        <div className="tabs">
          <DisplayTabs/>
        </div>

        <ul className="selectors-list">
          <Selectors tab={tab}/>
        </ul>
      </div>

      <div className="display-wrapper">
        <div className="display-actions">
          <button className="icon icon-action" onClick={() => dispatch(setIndexes())}>
            <img src={icons.reset} alt="Reset"/>
          </button>
          <button className="icon icon-action" onClick={() => dispatch(randomIndexes())}>
            <img src={icons.random} alt="Random"/>
          </button>
          <button className="icon icon-action" onClick={() => downloadSvg(parts)}>
            <img src={icons.download} alt="Download"/>
          </button>
          <button className="icon icon-action" onClick={getShareUrl}>
            <img src={icons.share} alt='share'/>
          </button>
          <button className="icon icon-action"  onMouseEnter={getShareUrl}>
            TEST ON HOVER
            <div style={{position: "relative", left: "100px"}}>INNER DIV</div>
          </button>
        </div>

        <div className="parts">
          <Viewer/>
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
