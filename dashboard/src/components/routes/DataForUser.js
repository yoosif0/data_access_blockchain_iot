import React, { Component } from "react";
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { getData } from "../../services/file.service";
import './DataForUser.css';
import { ModalCLoseButton } from "../core/ModalCloseButton";


// const calculateMyEncryptedSecretKey = (users) => {
//   Object.keys(users).forEach(async publicKey => {
//     if (users[publicKey].identity === 'OWNER') {
//       return users[publicKey].encryptedSecretKey
//     }
//   })
// }
const mapStateToProps = state => ({
  dataHash: state.documentStore.dataHash,
  myAccountAddress: state.ethStore.account,
  myEncryptedSecretKey: state.usersStore.myEncryptedSecretKey,
  users: state.usersStore.items,
})
const mapDispatchToProps = dispatch => ({
  openErrorMoadalForWrongSecretKey: () => dispatch({
    type: 'OPEN_ERROR_MODAL',
    message: 'Wrong secret key'
  })
})

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

export class PDataForUserPage extends Component {

  state = {
    // myEncryptedSecretKey: calculateMyEncryptedSecretKey(this.props.users),
    modalIsOpen: false,
    input: '',
  };

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  }

  downloadData = async () => {
    try {
      await getData(this.props.dataHash, this.state.input)
    } catch (e) {
      this.closeModal()
      this.props.openErrorMoadalForWrongSecretKey()
    }

  }

  render() {
    return (
      <div className="container-fluid mt-5">

        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Ente secret key modal"
        >
          <ModalCLoseButton onClick={this.closeModal} />
          <form>
            <div className="form-group">
              <input name="decryptedSecret" className="form-control" onChange={this.handleChange} placeholder="Enter decrypted secret" />
            </div>
          </form>
          <button className="btn btn-warning" onClick={this.downloadData}>GetData</button>

        </Modal>


        <div className="row">
          <main>
            <div>
              {this.props.dataHash ? 'Owner\'s document URL:    https://ipfs.infura.io/ipfs/' + this.props.dataHash : 'No files are saved for the user'}
            </div>
            <div>
              {this.props.secretObjectHash && 'Secret Object URL:    https://ipfs.infura.io/ipfs/' + this.props.secretObjectHash}
            </div>


            {
              this.props.myEncryptedSecretKey &&
              <div className="secret-block mt-10">
                <button className="btn btn-link" onClick={() => { navigator.clipboard.writeText(this.props.myEncryptedSecretKey) }}>Copy</button>
                <div className="body mt-10">
                  {this.props.myEncryptedSecretKey}
                </div>
              </div>
            }

            <div>
              <button onClick={this.openModal} className="btn btn-warning mt-10">Get Data</button>
            </div>

          </main>
        </div>
      </div>
    );
  }
}

export const DataForUserPage = connect(mapStateToProps, mapDispatchToProps)(PDataForUserPage)