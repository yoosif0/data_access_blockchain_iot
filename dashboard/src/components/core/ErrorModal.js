import React from "react";
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ModalCLoseButton } from "./ModalCloseButton";

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
        ariaHideApp={false}
        isOpen={modalErrorMesasge ? true : false}
        onRequestClose={onCloseClick}
        style={customStyles}
        contentLabel="Error Modal"
    >
        <ModalCLoseButton onClick={onCloseClick} />
        
        <div> 
            <p>{modalErrorMesasge}</p>
        </div>
    </Modal>
    )

}



export const ErrorModal =  connect(mapStateToProps, mapDispatchToProps)(PErrorModal)