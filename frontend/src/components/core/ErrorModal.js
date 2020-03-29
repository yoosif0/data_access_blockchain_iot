import React from "react";
import Modal from 'react-modal';
import { connect } from 'react-redux';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};


const mapStateToProps = state => ({ modalErrorMesasge: state.layoutStore.modalErrorMesasge })
const mapDispatchToProps = dispatch => ({
    onCloseClick: () => dispatch({type: 'CLOSE_ERROR_MODAL'}),
})

export function PErrorModal({onCloseClick, modalErrorMesasge}) {
    return (
    
    <Modal
        isOpen={modalErrorMesasge ? true : false}
        onRequestClose={onCloseClick}
        style={customStyles}
        contentLabel="Error Modal"

    >
        <button className="btn btn-warning" onClick={onCloseClick}>close</button>
        
        <p>{modalErrorMesasge}</p>

    </Modal>
    )

}



export const ErrorModal =  connect(mapStateToProps, mapDispatchToProps)(PErrorModal)