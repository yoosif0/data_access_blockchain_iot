import { createReducer } from '@reduxjs/toolkit'

const initialState = {deployedContract:undefined  }

export const ethStore = createReducer(initialState, {
    SET_DEPLOYED_CONTRACT: (state, action) => {
        state.deployedContract = action.payload
    },
})
