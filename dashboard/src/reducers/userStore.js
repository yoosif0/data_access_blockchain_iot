import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    items: {},
    myEncryptedSecretKey: undefined
}

export const usersStore = createReducer(initialState, {
    GIVE_ACCESS: (state, action) => {
        state.items[action.pubKey].haveAccess = true
    },
    REVOKE_ACCESS: (state, action) => {
        state.items[action.pubKey].haveAccess = false
    },
    SAVE_USERS: (state, action) => {
        state.items = action.payload
    },
    STORE_ENCRYPTED_SECRET_KEY: (state, action) => {
        state.myEncryptedSecretKey = action.payload
    },

})