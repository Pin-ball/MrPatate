import { createSlice } from "@reduxjs/toolkit";

import OPTIONS from 'src/config/config.json';

const initialState = {
    indexes: {},
    active: {},
    ids: {}
}

export const parts = createSlice({
    name: 'parts',
    initialState,
    reducers: {
        setIndexes: (state, action) => {
            let idsPreset = action.payload ? action.payload : {}

            OPTIONS.parts.map(({key, options}) => {
                let index = options.findIndex(option => option.id === idsPreset[key]),
                    newIndex = index !== -1 ? index : 0
                state.indexes[key] = newIndex
                state.ids[key] = options[newIndex].id
                //TODO: In progress
                state.active[key] = options[newIndex]
            })
        },

        nextIndex: (state, action) => {
            let partKey = action.payload,
                part = OPTIONS.parts.filter(part => part.key === partKey)[0],
                partIndex = state.indexes[partKey]+1 >= part.options.length ? 0 : state.indexes[partKey]+1

            state.indexes[partKey] = partIndex
            state.ids[partKey] = part.options[partIndex].id
            //TODO: In progress
            state.active[partKey] = part.options[partIndex]
        },

        previousIndex: (state, action) => {
            let partKey = action.payload,
              part = OPTIONS.parts.filter(part => part.key === partKey)[0],
              partIndex = state.indexes[partKey]-1 < 0 ? part.options.length-1 : state.indexes[partKey]-1

            state.indexes[partKey] = partIndex
            state.ids[partKey] = part.options[partIndex].id
            //TODO: In progress
            state.active[partKey] = part.options[partIndex]
        },

        resetIndex: (state, action) => {
            let partKey = action.payload,
                part = OPTIONS.parts.filter(part => part.key === partKey)[0]
            
            state.indexes[partKey] = 0
            state.ids[partKey] = part.options[state.indexes[partKey]].id
            //TODO: In progress
            state.active[partKey] = part.options[state.indexes[partKey]]
        },

        randomIndex: (state, action) => {
            let partKey = action.payload,
                part = OPTIONS.parts.filter(part => part.key === partKey)[0]

            state.indexes[partKey] = _random(0, part.options.length, state.indexes[partKey])
            state.ids[partKey] = part.options[state.indexes[partKey]].id
            //TODO: In progress
            state.active[partKey] = part.options[state.indexes[part.key]]
        },
        
        randomIndexes: (state) => {
            OPTIONS.parts.map(({key, options}) => {
                state.indexes[key] = _random(0, options.length)
                state.ids[key] = options[state.indexes[key]].id
                //TODO: In progress
                state.active[key] = options[state.indexes[key]]
            })
            console.log(parts)
        },
    }
})


const _random = (min, max, exclude = false) => {
    if (exclude === false) {
      return Math.floor(Math.random() * max + min);
    }
    else {
      for (let i = 0; i < 10; i++) {
        let rand = Math.floor(Math.random() * max + min);
        if (rand !== exclude) return rand
      }   
    }
  }


export const {
    setIndexes,
    resetIndex,
    nextIndex,
    previousIndex,
    randomIndex,
    randomIndexes
} = parts.actions
export default parts.reducer