import Montain from './background_montain.jsx'

const part = {
  key:  'background',
  label: 'Background',
  //TODO: Add "active" state ?
  logo: '/assets/icons/body/Body_icon.svg',
  skins: [
    {
      id: 0,
      //TODO: Add "active" state ?
      name:'Montagne',
      logo: '/assets/icons/global/Empty.svg',
      elements: [
        {
          z: 0,
          Path: () => null,
        }
      ],
    },
    // {
    //   id: 1,
    //   name:'Montagne',
    //   logo: '/assets/icons/body/Body_basic_icon.svg',
    //   elements: [
    //     {
    //       z: 0,
    //       Path: Montain,
    //       shift: {x: 10, y: 1}
    //     }
    //   ],
    // },
  ]
}

export default part
