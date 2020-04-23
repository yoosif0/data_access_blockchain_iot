import { createReducer } from '@reduxjs/toolkit'
import { userType } from '../types/userType'



const initialState = {
    identity: userType.UNKOWN,
    myAccountAddress: undefined,
    myEncryptedSecretKey: undefined
}

export const identityStore = createReducer(initialState, {
    SET_IDENTITY: (state, action) => {
        state.identity = action.payload
    },
    SET_SET_MY_ACCOUNT_ADDRESS: (state, action) => {
        state.myAccountAddress = action.payload
    },
    STORE_ENCRYPTED_SECRET_KEY: (state, action) => {
        state.myEncryptedSecretKey = action.payload
    },
})