import Basic from './body_basic'

const part = {
  key:  'body',
  label: 'Corps',
  //TODO: Add "active" state ?
  logo: '/assets/icons/body/Body_icon.svg',
  skins: [
    {
      id: 0,
      //TODO: Add "active" state ?
      name:'Corps standard',
      logo: '/assets/icons/body/Body_basic_icon.svg',
      elements: [
        {
          z: 4,
          Path: Basic,
          shift: {x: 1, y: 1}
        }
      ],
    },
  ]
}

export default part
