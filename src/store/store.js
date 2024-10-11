import {create} from 'zustand'
import {random} from '@src/utils'
import preset from '@src/config/preset.json'
import {immer} from 'zustand/middleware/immer'
import {allParts, getPart} from '@src/components/svg'

const colors = {
  black: '#000',
  grey: '#353B3F',
  white: '#FFF',
  green: '#21C488',
  red: '#FF3A4B',
  pink: '#F4D0E9',
  yellow: '#FFD53F',
  blue: '#D5EEFF',
  brown: '#9E744D',
  shadow: '#10101033',
}

const defaultSkins = preset.find(p => p.key === 'default').skins
const initialState = {
  ref: null,
  skins: defaultSkins,
  colors
}

const useStore = create()(
  immer((set) => ({
    ...initialState,

    setRef: (ref) =>
      set(state => {
        state.ref = ref
      }),

    resetSkins: () =>
      set(state => {
        state.skins = defaultSkins
      }),

    resetSkin: (key) =>
      set(state => {
        state.skins[key] = getPart(key).skins[0].id
      }),

    setSkin: (part, id) =>
      set(state => {
        state.skins[part] = id
      }),

    setSkins: (presetKey) => {
      const selectedSkins = preset.find(p => p.key === presetKey).skins

      return set(state => {
        state.skins = {...defaultSkins, ...selectedSkins}
      })
    },

    randomSkin: (key) =>
      set(state => {
        const availableSkins = getPart(key).skins.filter(s => s.id !== state.skins[key])
        if (availableSkins.length === 0) return

        state.skins[key] = availableSkins[random(0, availableSkins.length)].id
      }),

    randomSkins: () =>
      set(state => {
        allParts.forEach(part => {
          state.skins[part.key] = part.skins[random(0, part.skins.length)].id
        })
      }),
  }))
)

export default useStore;
