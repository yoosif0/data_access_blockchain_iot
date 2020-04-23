import { userType } from '../types/userType';
import { publicToAddress } from '../services/ethUtils';

const IpfsHttpClient = require('ipfs-http-client')
const ipfs = IpfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })


export function initiate(deployedContract, account) {
    return async function (dispatch) {
        dispatch({ type: 'SET_SET_MY_ACCOUNT_ADDRESS', payload: account })
        dispatch({ type: 'SET_DEPLOYED_CONTRACT', payload: deployedContract })
        dispatch(getUsersHash(deployedContract, account))
    };
}

export function addUser(deployedContract, userPubKey, myAccountAddress, users) {
    const updated = Object.assign({}, users)
    updated[userPubKey] = { haveAccess: false, encryptedSecretKey: undefined }
    return saveUsers(deployedContract, myAccountAddress, updated)
}


export function  giveAccess(deployedContract, userPubKey, myAccountAddress, users, encryptedSecretKey) {
    const updated = Object.assign({}, users)
    updated[userPubKey] = { haveAccess: true, encryptedSecretKey }
    return saveUsers(deployedContract, myAccountAddress, updated)
}

export function revokeAccess(deployedContract, userPubKey, myAccountAddress, users) {
    const updated = Object.assign({}, users)
    updated[userPubKey] = { haveAccess: false, encryptedSecretKey: undefined }
    return saveUsers(deployedContract, myAccountAddress, updated)
}

function saveUsers(deployedContract, myAccountAddress, users) {
    return async function (dispatch) {
        try {
            const res = await ipfs.object.put({ Data: JSON.stringify(users), Links: [] }).catch(e => dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t save users in IPFS' }))
            await storeUsersHashInBlockchain(deployedContract, myAccountAddress, res.toString()).catch(e => dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t store users hash in the blockchain' }))
            return dispatch({ type: 'SAVE_USERS', payload: users, myAccountAddress: myAccountAddress })
        } catch (e) {
            console.log(e) 
        }
    };
}

async function storeUsersHashInBlockchain(contract, myAccountAddress, usersHash) {
    const gasAmount = await contract.methods.storeUsersHash(usersHash).estimateGas({ from: myAccountAddress })
    return contract.methods.storeUsersHash(usersHash).send({ gas: gasAmount, from: myAccountAddress })
}


export function getData(deployedContract) {
    return async function (dispatch) {
        try {
            const hash = await deployedContract.methods.getDataHash().call()
            if (!hash) {
                dispatch({ type: 'OPEN_ERROR_MODAL', message: 'data hash is empty. Are you sure you ran the iot device' })
            } else {
                const r = await ipfs.object.get(hash)
                const data = JSON.parse(r._data.toString())
                console.log(data)
                return dispatch({type: 'STORE_DATA', payload: data})
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your data\'s hash' })
        }
    };
}

function getUsersHash(deployedContract, myAccountAddress) {
    return async function (dispatch) {
        try {
            const hash = await deployedContract.methods.getUsersHash().call()
            if (!hash) {
                return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'users hash is empty. Maybe you have never started your IoT device yet' })
            }
            try {
                const r = await ipfs.object.get(hash)
                const users = JSON.parse(r._data.toString())
                dispatch({ type: 'SAVE_USERS', payload: users })

                Object.keys(users).forEach(key => {
                    if (publicToAddress(key) === myAccountAddress) {
                        dispatch({ type: 'STORE_ENCRYPTED_SECRET_KEY', payload: users[key].encryptedSecretKey })
                        dispatch({ type: 'SET_IDENTITY', payload: users[key].identity ? users[key].identity : users[key].haveAccess ? userType.USER_WITH_ACCESS : userType.USER_WITHOUT_ACCESS })
                    }
                })
            } catch (e) {
                console.log(e)
                return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Error accessing ipfs ' })
            }

        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t call getUsersHash in the contract. Maybe you have never started your IoT device yet' })
        }
    }
}
