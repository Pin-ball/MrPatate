import Hero from './back_hero'

const part = {
  key:  'back',
  label: 'Dos',
  //TODO: Add "active" state ?
  logo: '/assets/icons/back/Back_icon.svg',
  skins: [
    {
      id: 0,
      //TODO: Add "active" state ?
      name:'Rien de spécial',
      logo: '/assets/icons/global/Empty.svg',
      elements: [
        {
          z: 5,
          Path: () => null,
          shift: {x: 1, y: 1}
        }
      ],
    },
    {
      id: 1,
      name:'Cape de super héro',
      logo: '/assets/icons/back/Back_hero_icon.svg',
      elements: [
        {
          z: 5,
          Path: Hero,
          shift: {x: 1, y: 1}
        }
      ],
    },
  ]
}

export default part
