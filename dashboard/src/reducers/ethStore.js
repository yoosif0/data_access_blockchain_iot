import { createReducer } from '@reduxjs/toolkit'

const initialState = {deployedContract:undefined, account: undefined, totalNumber:undefined, items: undefined,  }

export const ethStore = createReducer(initialState, {
    SAVE_ACCOUNTS: (state, action) => {
        state.accounts = action.payload.accounts
    },
    SET_ETH_STATE: (state, action) => {
        state.deployedContract = action.payload.deployedContract
        state.account= action.payload.account
    },
})
