import React, { Component } from "react";
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { getData } from "../../actions/index";
import './DataPage.css';
import { ModalCLoseButton } from "../core/ModalCloseButton";
import { decryptSymmtrically } from "../../services/encryption";
import { DataTable } from "../tables/DataTable";


const mapStateToProps = state => ({
  data: state.dataStore.data,
  contract: state.ethStore.deployedContract,
  myAccountAddress: state.identityStore.myAccountAddress,
  myEncryptedSecretKey: state.identityStore.myEncryptedSecretKey,
})
const mapDispatchToProps = dispatch => ({
  openErrorMoadalForWrongSecretKey: () => dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Wrong secret key' }),
  initiate: (c) => dispatch(getData(c))
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

export class PDataPage extends Component {

  state = {
    modalIsOpen: false,
    secretKeyInput: '',
    data: []
  };

  componentDidMount() {
    this.props.initiate(this.props.contract)
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  handleChange = (e) => {
    this.setState({ secretKeyInput: e.target.value });
  }

  decrypt = () => {
    const data = this.props.data.map(encryptedString => {
      try {
        const decrypted = decryptSymmtrically(encryptedString, this.state.secretKeyInput)
        const parsed = JSON.parse(decrypted)
        console.log(parsed)
        const finalObject = { ...parsed, date: (new Date(parseInt(parsed.date.replace(/,/g, '')))).toISOString() }
        console.log(finalObject)
        return finalObject
      } catch (e) {
        return {}
      }
    })
    console.log(data)
    this.setState({ data })
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
          <button className="btn btn-warning" onClick={this.decrypt}>Decrypt</button>

        </Modal>


        <div className="row">
          <main>
            {
              this.props.myEncryptedSecretKey &&
              <div className="secret-block mt-10">
                <button className="btn btn-link" onClick={() => { navigator.clipboard.writeText(JSON.stringify(this.props.myEncryptedSecretKey)) }}>Copy</button>
                <div className="body mt-10">
                  {JSON.stringify(this.props.myEncryptedSecretKey)}
                </div>
              </div>
            }

            <div>
              <button onClick={this.openModal} className="btn btn-warning mt-10">Decrypt symmetrically using the secret key</button>
            </div>

            <div>
              {
                this.state.data && !!this.state.data.length && <DataTable data={this.state.data} />
              }
            </div>

          </main>
        </div>
      </div>
    );
  }
}

export const DataPage = connect(mapStateToProps, mapDispatchToProps)(PDataPage)