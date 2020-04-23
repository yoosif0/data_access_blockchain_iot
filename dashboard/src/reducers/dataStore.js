import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    data: [],
}

export const dataStore = createReducer(initialState, {
    STORE_DATA: (state, action) => {
        state.data = action.payload
    },
})