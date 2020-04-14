import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    dataHash: undefined,
}

export const dataStore = createReducer(initialState, {
    STORE_FILE_HASH: (state, action) => {
        state.dataHash = action.hash
    },
})