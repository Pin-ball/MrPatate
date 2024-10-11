import Happy from './mouth_happy'
import Bave from "./mouth_bave"
import BigTooth from "./mouth_bigTooth"
import BottomLipUp from "./mouth_bottomLipUp"
import Dot from "./mouth_dot"
import Zip from "./mouth_zip"

const part = {
  key:  'mouth',
  label: 'Bouche',
  //TODO: Add "active" state ?
  logo: '/assets/icons/mouth/Mouth_icon.svg',
  skins: [
    {
      id: 0,
      //TODO: Add "active" state ?
      name:'Bouche standard',
      logo: '/assets/icons/mouth/Mouth_happy_icon.svg',
      elements: [
        {
          z: 5,
          Path: Happy,
          shift: {x: 2, y: 1}
        }
      ],
    },
    {
      id: 1,
      name:'Bouche baveuse',
      logo: '/assets/icons/mouth/Mouth_bave_icon.svg',
      elements: [
        {
          z: 5,
          Path: Bave,
          shift: {x: 2, y: 1}
        }
      ],
    },
    {
      id: 2,
      name:'Bouche à grosse dent',
      logo: '/assets/icons/mouth/Mouth_bigTooth_icon.svg',
      elements: [
        {
          z: 5,
          Path: BigTooth,
          shift: {x: 2, y: 1}
        }
      ],
    },
    {
      id: 3,
      name:'Bouche triste',
      logo: '/assets/icons/mouth/Mouth_bottomLipUp_icon.svg',
      elements: [
        {
          z: 5,
          Path: BottomLipUp,
          shift: {x: 2, y: 1}
        }
      ],
    },
    {
      id: 4,
      name:'Bouche fermée',
      logo: '/assets/icons/mouth/Mouth_dot_icon.svg',
      elements: [
        {
          z: 5,
          Path: Dot,
          shift: {x: 2, y: 1}
        }
      ],
    },
    {
      id: 5,
      name:'Bouche zippée',
      logo: '/assets/icons/mouth/Mouth_zip_icon.svg',
      elements: [
        {
          z: 5,
          Path: Zip,
          shift: {x: 2, y: 1}
        }
      ],
    },
  ]
}

export default part
