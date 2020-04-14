import { createReducer } from '@reduxjs/toolkit'
import { publicToAddress } from '../services/ethUtils'

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
        const newObj = {}
        Object.keys(action.payload).forEach(publicKey => {
            newObj[publicKey] = {...action.payload[publicKey], address: publicToAddress(publicKey)}
        })
        state.items = newObj
        if (action.myAccountAddress) {
            console.log()
            Object.keys(state.items).forEach(pubKey=> {
                if(state.items[pubKey].address === action.myAccountAddress) {
                    console.log('yeaaaaaaaaah')
                    state.myEncryptedSecretKey = state.items[pubKey].encryptedSecretKey
                }
            })
        }
    },
    STORE_ENCRYPTED_SECRET_KEY: (state, action) => {
        state.myEncryptedSecretKey = action.payload
    },

})