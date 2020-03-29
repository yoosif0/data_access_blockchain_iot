import React from 'react'
import { UsersTable } from '../tables/UsersTable';
import Title from '../text/Title';
import { connect } from 'react-redux';
import { PageContentLayout } from '../layout/PageContentLayout';
import Modal from 'react-modal';
import { addUser, giveAccess, revokeAccess } from '../../actions';


const mapStateToProps = state => ({ users: state.usersStore.items, contract: state.ethStore.deployedContract, myAccountAddress: state.ethStore.account })
const mapDispatchToProps = dispatch => ({
    addUser: (contract, pubkey, myAccountAddress) => dispatch(addUser(contract, pubkey, myAccountAddress)),
    grant: (contract, pubkey, myAccountAddress) => dispatch(giveAccess(contract, pubkey, myAccountAddress)),
    revoke: (contract, pubkey, myAccountAddress) => dispatch(revokeAccess(contract, pubkey, myAccountAddress)),
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
            input: ''
        };
    }
    openModal = () => {
        console.log(this.props)
        this.setState({ modalIsOpen: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false })
    }

    handleChange = (e) =>  {
        this.setState({ input: e.target.value });
    }


    render() {
        return (
            <React.Fragment>
                <Title> Users </Title>
                <div> 
                <button className="btn btn-warning" onClick={this.openModal}>Add user</button>
                </div>
                
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"

                >
                    <button onClick={this.closeModal}>close</button>
                    <form>
                        <input onChange={ this.handleChange }/>
                       
                    </form>
                    <button className="btn btn-warning" onClick={ () => this.props.addUser(this.props.contract, this.state.input, this.props.myAccountAddress)}>Add</button>

                </Modal>
                <PageContentLayout isRendering={Object.keys(this.props.users).length} unAvailabilityText="No users">

                    <UsersTable users={this.props.users} onGrantClick={ (userPubKey) => this.props.grant(this.props.contract, userPubKey, this.props.myAccountAddress)}  onRevokeClick={ (userPubKey) => this.props.revoke(this.props.contract, userPubKey, this.props.myAccountAddress)} />

                </PageContentLayout>

            </React.Fragment>
        )
    }

}


export const UsersListing = connect(mapStateToProps, mapDispatchToProps)(PUsersListing)