import { userType } from '../types/userType';
import { publicToAddress } from '../services/ethUtils';
import { encryptASymmtrically } from '../services/encryption';

const IpfsHttpClient = require('ipfs-http-client')
const ipfs = IpfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })


export function initiate(deployedContract, account) {
    return async function (dispatch) {
        dispatch({ type: 'SET_ETH_STATE', payload: {deployedContract, account} })
        dispatch(getDataHash(deployedContract))
        dispatch(getSecretObjectHash(deployedContract, account))
    };
}

export function addUser(deployedContract, userPubKey, myAccountAddress, secretObject) {
    const updated = Object.assign({}, secretObject)
    updated[userPubKey] = {haveAccess: false, encryptedSecretKey: undefined}
    return saveUsers(deployedContract, myAccountAddress, updated)
}


export function giveAccess(deployedContract, userPubKey, myAccountAddress, secretObject, secret) {
    console.log(userPubKey, myAccountAddress, secretObject, secret)
    const updated = Object.assign({}, secretObject)
    const encryptedSecretKey = encryptASymmtrically(userPubKey, secret)
    console.log('encryptedSecretKey', encryptedSecretKey)
    updated[userPubKey] = { haveAccess: true, encryptedSecretKey }
    return saveUsers(deployedContract, myAccountAddress, updated)
}

export function revokeAccess(deployedContract, userPubKey, myAccountAddress, secretObject) {
    const updated = Object.assign({}, secretObject)
    updated[userPubKey] = { haveAccess: false, encryptedSecretKey: undefined }
    return saveUsers(deployedContract, myAccountAddress, updated)
}

function saveUsers(deployedContract, myAccountAddress, secretObject) {
    return async function (dispatch) {
        try {
            const res = await ipfs.object.put({ Data: JSON.stringify(secretObject), Links: [] })
            await storeSecretObjectHashInBlockchain(deployedContract, myAccountAddress, res.toString())
            return dispatch({ type: 'SAVE_USERS', payload: secretObject, myAccountAddress: myAccountAddress })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t revoke access from a user. Make sure you are the owner of the contract' })
        }
    };
}

async function storeSecretObjectHashInBlockchain(contract, myAccountAddress, secretObjectHash) {
    const gasAmount = await contract.methods.storeSecretObjectHash(secretObjectHash).estimateGas({ from: myAccountAddress })
    return contract.methods.storeSecretObjectHash(secretObjectHash).send({ gas: gasAmount, from: myAccountAddress })
}


function getDataHash(deployedContract) {
    return async function (dispatch) {
        try {
            const hash = await deployedContract.methods.getDataHash().call()
            if (hash) {
                dispatch({ type: 'STORE_FILE_HASH', hash })
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your document\'s hash' })
        }
    };
}

function getSecretObjectHash(deployedContract, myAccountAddress) {
    return async function (dispatch) {
        try {
            const hash = await deployedContract.methods.getSecretObjectHash().call()
            if (hash) {
                dispatch({ type: 'STORE_SECRET_OBJECT_HASH', hash })
            }
            const r = await ipfs.object.get(hash)
            const users = JSON.parse(r._data.toString())
            dispatch({ type: 'SAVE_USERS', payload: users, myAccountAddress: myAccountAddress })

            Object.keys(users).forEach(key => {
                if (publicToAddress(key) === myAccountAddress) {
                    dispatch({ type: 'SET_IDENTITY', payload: users[key].identity ? users[key].identity : users[key].haveAccess ? userType.USER_WITH_ACCESS : userType.USER_WITHOUT_ACCESS })
                }
            })

        } catch (e) {
            console.log(e)
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your secret object hash' })
        }
    };
}
