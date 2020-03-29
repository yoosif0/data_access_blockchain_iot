import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    modalErrorMesasge: undefined
}

export const layoutStore = createReducer(initialState, {
    OPEN_ERROR_MODAL: (state, action) => {
        state.modalErrorMesasge = action.message
    },
    CLOSE_ERROR_MODAL: (state, action) => {
        state.modalErrorMesasge = undefined
    },
})