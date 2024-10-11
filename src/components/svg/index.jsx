import useStore from '@src/store/store.js'
import body from '@src/components/svg/body'
import mouth from '@src/components/svg/mouth'
import eyes from '@src/components/svg/eyes'
import arms from '@src/components/svg/arms'
import legs from '@src/components/svg/legs'
import back from '@src/components/svg/back'

export const allParts = [
  body,
  mouth,
  eyes,
  arms,
  legs,
  back,
  // background,
]

export const getPart = (key) => {
  return allParts.find(s => s.key === key)
}

export const getActiveElements = () => {
  const elements = allParts.reduce((acc, part) => acc.concat(getActiveElement(part)), [])
  elements.sort((a, b) => a.z - b.z)
  return elements
}
const getActiveElement = (part) => {
  const {skins} = useStore()
  const activeSkin = part.skins.find(s => s.id === skins[part.key])
  return activeSkin.elements.map(e => ({...e, key: part.key}))
}
