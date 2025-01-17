import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { UsersListingPage } from './routes/UsersListingPage';
import { connect } from 'react-redux';
import Web3 from 'web3';
import DataAccess from '../../../blockchain/src/abis/DataAccess.json'
import { Navbar } from './layout/Navbar'
import { initiate } from '../actions';
import { ErrorModal } from './core/ErrorModal';
import { IdentityPage } from './routes/IdentityPage';
import { DataPage } from './routes/DataPage';



const mapStateToProps = state => ({ account: state.identityStore.myAccountAddress })
const mapDispatchToProps = dispatch => ({
  saveAccounts: (payload) => dispatch({ type: 'SAVE_ACCOUNT', payload }),
  initiate: (deployedContract, account) => dispatch(initiate(deployedContract, account)),
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
      this.props.initiate(deployedContract, accounts[0])
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
        <Route path="/users" component={UsersListingPage} />
        {/* <Route path="/document" component={DataPage} /> */}
        <Route path="/identity" component={IdentityPage} />
        <Route path="/dataForUser" component={DataPage} />
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
