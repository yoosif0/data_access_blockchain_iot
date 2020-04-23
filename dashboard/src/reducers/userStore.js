import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    items: {},
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
})