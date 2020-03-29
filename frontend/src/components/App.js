import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { UsersListing } from './routes/UsersListing';
import { connect } from 'react-redux';
import Web3 from 'web3';
import DataAccess from '../abis/DataAccess'
import { Navbar } from './layout/Navbar'
import { getUsers, getDataHash, amIOwner, getSecretObjectHash } from '../actions';
import { DocumentPage } from './routes/DocumentPage';
import { ErrorModal } from './core/ErrorModal';
import { IdentityPage } from './routes/IdentityPage';
import { DocumentForUserPage } from './routes/DocumentForUser';



const mapStateToProps = state => ({ account: state.ethStore.account, contract: state.ethStore.deployedContract })
const mapDispatchToProps = dispatch => ({
  saveAccounts: (payload) => dispatch({ type: 'SAVE_ACCOUNT', payload }),
  getUsers: (deployedContract, account) => dispatch(getUsers(deployedContract, account)),
  amIOwner: (deployedContract, account) => dispatch(amIOwner(deployedContract, account)),
  setEthState: obj => dispatch({type: 'SET_ETH_STATE', payload: obj}),
  getDataHash: (contract) => dispatch(getDataHash(contract)),
  getSecretObjectHash:  (contract) => dispatch(getSecretObjectHash(contract)),
})


class Appa extends Component {
  state = {

  }
  async getWeb3Provider() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
  async componentDidMount() {
    await this.appInititiated();
  }

  async appInititiated() {
    await this.getWeb3Provider()
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.props.saveAccounts(accounts)
    const networkId = await web3.eth.net.getId()
    const networkData = DataAccess.networks[networkId];
    if (networkData) {
      const deployedContract = new web3.eth.Contract(DataAccess.abi, networkData.address);
      this.props.setEthState({deployedContract, account: accounts[0]})
      this.props.getUsers(deployedContract, accounts[0])
      this.props.amIOwner(deployedContract, accounts[0])
      this.props.getDataHash(this.props.contract)
      this.props.getSecretObjectHash(this.props.contract)
    } else {
      window.alert('Contract is not found in your blockchain.')
    }
  }

  render() {
    return (
      <BrowserRouter>
          <Navbar account={this.props.account} />
          <ErrorModal></ErrorModal>
        <div>
        </div>
        <div className="container">
        <Route path="/users" component={UsersListing} />
        <Route path="/document" component={DocumentPage} />
        <Route path="/identity" component={IdentityPage} />
        <Route path="/documentForUser" component={DocumentForUserPage} />
        <Route path='/'>
          <Redirect to="/identity" />
        </Route>
        </div>
      </BrowserRouter>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(Appa)
export default App;
