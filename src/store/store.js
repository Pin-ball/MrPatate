import { configureStore } from '@reduxjs/toolkit'
import parts from 'src/store/reducer/parts.js'

export const store = configureStore({
    reducer: {
        parts
    }
})