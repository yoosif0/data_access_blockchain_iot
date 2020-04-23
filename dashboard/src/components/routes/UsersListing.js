import React from 'react'
import { UsersTable } from '../tables/UsersTable';
import Title from '../text/Title';
import { connect } from 'react-redux';
import { PageContentLayout } from '../layout/PageContentLayout';
import Modal from 'react-modal';
import { addUser, giveAccess, revokeAccess } from '../../actions';
import { ModalCLoseButton } from '../core/ModalCloseButton';
import { encryptASymmtrically } from '../../services/encryption';


const mapStateToProps = state => ({ 
    users: state.usersStore.items,
     contract: state.ethStore.deployedContract,
      myAccountAddress: state.ethStore.account
    
    })
const mapDispatchToProps = dispatch => ({
    addUser: (contract, pubkey, myAccountAddress, users) => dispatch(addUser(contract, pubkey, myAccountAddress, users)),
    grant: (contract, pubkey, myAccountAddress, users, encryptedSecretKey) => dispatch(giveAccess(contract, pubkey, myAccountAddress, users, encryptedSecretKey)),
    revoke: (contract, pubkey, myAccountAddress, users) => dispatch(revokeAccess(contract, pubkey, myAccountAddress, users)),
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

export class PUsersListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            input: '',
            isAddingUser: false,
            selecetedUserPublicKey: '',
        };
    }

    openModalToGrantAccess = (userPubKey) => {
        this.setState({ modalIsOpen: true, isAddingUser: false, selecetedUserPublicKey: userPubKey })
    }

    openModalToAddUser = () => {
        this.setState({ modalIsOpen: true, isAddingUser: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false, input: '', selecetedUserPublicKey: '' })
    }

    handleChange = (e) =>  {
        this.setState({ input: e.target.value });
    }

    async giveAccess() {
        const encryptedSecretKey = await encryptASymmtrically(this.state.selecetedUserPublicKey, this.state.input)
        this.props.grant(this.props.contract, this.state.selecetedUserPublicKey, this.props.myAccountAddress, this.props.users, encryptedSecretKey)
    }
    


    render() {
        return (
            <React.Fragment>
                <Title> Users </Title>
                <div> 
                <button className="btn btn-warning" onClick={this.openModalToAddUser}>Add user</button>
                </div>
                
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <ModalCLoseButton onClick={this.closeModal} />
                    <form className="mt-10">
                    <input className="form-control" onChange={ this.handleChange } placeholder={ this.state.isAddingUser  ? "Enter user's public key" : 'Enter secret'}/> 
                    </form>
                    { this.state.isAddingUser ? 
                        <button className="btn btn-warning mt-10" onClick={ () => this.props.addUser(this.props.contract, this.state.input, this.props.myAccountAddress, this.props.users)}>Add</button> :
                        <button className="btn btn-warning mt-10" onClick={ async () => await this.giveAccess()}>Give Access</button>    
                }
                </Modal>
                <PageContentLayout isRendering={Object.keys(this.props.users).length} unAvailabilityText="No users">

                    <UsersTable users={this.props.users} onGrantClick={ (userPubKey) => this.openModalToGrantAccess(userPubKey)  }  onRevokeClick={ (userPubKey) => this.props.revoke(this.props.contract, userPubKey, this.props.myAccountAddress, this.props.users)} />

                </PageContentLayout>

            </React.Fragment>
        )
    }

}


export const UsersListing = connect(mapStateToProps, mapDispatchToProps)(PUsersListing)