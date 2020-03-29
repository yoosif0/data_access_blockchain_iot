import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    fileHash: undefined,
    secretObjectHash: undefined
}

export const documentStore = createReducer(initialState, {
    STORE_FILE_HASH: (state, action) => {
        state.fileHash = action.hash
    },
    STORE_SECRET_OBJECT_HASH: (state, action) => {
        state.secretObjectHash = action.hash
    },
})