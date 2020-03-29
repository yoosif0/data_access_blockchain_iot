import { createReducer } from '@reduxjs/toolkit'
import { userType } from '../types/userType'



const initialState = {
    identity: userType.UNKOWN,
}

export const identityStore = createReducer(initialState, {
    SET_IDENTITY: (state, action) => {
        state.identity = action.payload
    },
})