import { userType } from '../types/userType';
import { publicToAddress } from '../services/ethUtils';
import { AES, enc } from 'crypto-js';
import * as  EthCrypto from 'eth-crypto';

const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

export function getUsers(deployedContract, myAccountAddress) {
    return async function (dispatch) {
        try {
            const pubKeys = await deployedContract.methods.returnUsersPubKeys().call({ from: myAccountAddress })
            const users = {}
            for (let i = 0; i < pubKeys.length; i++) {
                const haveAccess = await deployedContract.methods.doesUserHaveAccess(pubKeys[i]).call({ from: myAccountAddress })
                const userAddress = publicToAddress(pubKeys[i])
                console.log(myAccountAddress)
                console.log(userAddress)
                users[pubKeys[i]] = { haveAccess, address: userAddress }
                if (userAddress === myAccountAddress) {
                    console.log('I am a user')
                    dispatch({ type: 'SET_IDENTITY', payload: users[pubKeys[i]].haveAccess ? userType.DOCTOR_WITH_ACCESS : userType.DOCTOR_WITHOUT_ACCESS })
                } else {
                    console.log('I am not a user')
                }
            }
            console.log(users)
            return dispatch({ type: 'SAVE_DOCTORS', payload: users })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get the users' })
        }

    };
}


export function amIOwner(deployedContract, myAccountAddress) {
    return async function (dispatch) {
        try {
            const isOwner = await deployedContract.methods.amIOwner().call({ from: myAccountAddress })
            console.log('isOwner', isOwner)
            if (isOwner) {
                console.log('looks like I am the owner')
                dispatch({ type: 'SET_IDENTITY', payload: userType.OWNER })
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'No Idea why the amIOwner method is not working' })
        }
    };
}


export function addUser(deployedContract, userPubKey, myAccountAddress) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.registerUser(userPubKey).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.registerUser(userPubKey).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch(getUsers(deployedContract, myAccountAddress))
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t add a user. Make sure you are the owner of the contract' })
        }
    };
}

export function giveAccess(deployedContract, userPubKey, myAccountAddress) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.grantAccessToUser(userPubKey).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.grantAccessToUser(userPubKey).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'GIVE_ACCESS', pubKey: userPubKey })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t give access to a user. Make sure you are the owner of the contract' })
        }
    };
}

export function revokeAccess(deployedContract, userPubKey, myAccountAddress) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.revokeAccessFromUser(userPubKey).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.revokeAccessFromUser(userPubKey).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'REVOKE_ACCESS', pubKey: userPubKey })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t revoke access from a user. Make sure you are the owner of the contract' })
        }
    };
}


export function dealWithDocument(deployedContract, myAccountAddress, users, dataUrl) {
    return async function (dispatch) {
        console.log(users)
        const secretKey = Math.random().toString(36).substring(10)
        console.log('random', secretKey)
        const encryptedFileAsString = AES.encrypt(dataUrl, secretKey).toString()
        // const decryptedString = AES.decrypt(encryptedFileAsString, secretKey).toString(enc.Utf8)
        // console.log(decryptedString)
        ipfs.files.add(Buffer(encryptedFileAsString), (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log("File added succesfully");
            console.log("IPFS result", result);
            dispatch(storeFileHash(deployedContract, myAccountAddress, result[0].hash));
        });
        
        const ecryptedSecretsArr = await Promise.all(Object.keys(users).map(async publicKey => EthCrypto.encryptWithPublicKey(publicKey, secretKey)))
        const secretKeys = Object.keys(users).reduce((obj, k, i) => ({...obj, [k]: ecryptedSecretsArr[i] }), {})

        console.log('resolved', ecryptedSecretsArr)
        console.log('secret keys', secretKeys)

        
        const stringifiedSecretKeys = JSON.stringify(secretKeys)
        console.log('stringifiedSecretKeys', stringifiedSecretKeys)
        ipfs.files.add(Buffer(stringifiedSecretKeys), (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log("Secret Object added succesfully");
            console.log("IPFS result", result);
            dispatch(storeSecretObjectHash(deployedContract, myAccountAddress, result[0].hash));
        });
    };
}

function storeFileHash(deployedContract, myAccountAddress, hash) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.storeFileHash(hash).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.storeFileHash(hash).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'STORE_FILE_HASH', hash })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t store your document hash in the smart contract' })
        }
    };
}


function storeSecretObjectHash(deployedContract, myAccountAddress, hash) {
    return async function (dispatch) {
        try {
            const gasAmount = await deployedContract.methods.storeSecretObjectHash(hash).estimateGas({ from: myAccountAddress })
            await deployedContract.methods.storeSecretObjectHash(hash).send({ gas: gasAmount, from: myAccountAddress })
            return dispatch({ type: 'STORE_SECRET_OBJECT_HASH', hash })
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t store your secret object hash in the smart contract' })
        }
    };
}

export function getDataHash(deployedContract) {
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

export function getSecretObjectHash(deployedContract) {
    return async function (dispatch) {
        try {
            const hash = await deployedContract.methods.getSecretObjectHash().call()
            if (hash) {
                dispatch({ type: 'STORE_SECRET_OBJECT_HASH', hash })
            }
        } catch (e) {
            return dispatch({ type: 'OPEN_ERROR_MODAL', message: 'Can\'t get your secret object hash' })
        }
    };
}