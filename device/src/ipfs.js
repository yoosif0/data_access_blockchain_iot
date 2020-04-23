const DataAccess = require('../../blockchain/src/abis/DataAccess')
const Web3 = require('web3')
const config = require('dotenv').config().parsed
const { encryptSymmtrically, encryptASymmtrically, decryptASymmtrically } = require('./services/encryption');

let usersHash = undefined
let web3 = undefined
let accounts = undefined
let secretKey = undefined
let contract = undefined
let myAccountAddress = undefined
const IpfsHttpClient = require('ipfs-http-client')
const ipfs = IpfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
let dataArr = []


async function addNewDataPoint(dataPoint) {
    const encryptedData = encryptSymmtrically(JSON.stringify(dataPoint), secretKey)
    dataArr.push(encryptedData)
    const res = await ipfs.object.put({ Data: JSON.stringify(dataArr), Links: [] })
    console.log(res.toString())
    
    if ( dataArr.length % 100 === 0) {
        await storeDataHash(res.toString())
    }
}


async function initiate() {
    web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    const accountsPromise = web3.eth.getAccounts();
    const networkIdPromise = web3.eth.net.getId()

    accounts = await accountsPromise
    const networkId = await networkIdPromise
    const networkData = DataAccess.networks[networkId];

    if (networkData) {
        contract = new web3.eth.Contract(DataAccess.abi, networkData.address);
        myAccountAddress = accounts[0]
        dealWithSecretObjectPromise = dealWithSecretObject()
        dealWithDataPromise = dealWithData()
        

        await dealWithSecretObjectPromise
        await dealWithDataPromise
    } else {
        console.warn('Contract is not found in your blockchain.')
    }
}

async function dealWithSecretObject() {
    try {
        usersHash = await contract.methods.getUsersHash().call()
        console.log('usersHash', usersHash)
        const node = await ipfs.object.get(usersHash)
        const users = JSON.parse(node._data.toString())
        secretKey = await decryptASymmtrically(config.PRIVATE_KEY, users[config.PUBLIC_KEY].encryptedSecretKey)
    } catch (e) {
        console.warn('Can\'t get your encrypted secret key')
        const rnd = Math.random().toString(36).substring(10)
        const encryptedSecretKey = await encryptASymmtrically(config.PUBLIC_KEY, rnd)
        const users = {[config.PUBLIC_KEY]: {encryptedSecretKey, identity: 'OWNER'}}
        const res = await ipfs.object.put({ Data: JSON.stringify(users), Links: [] })
        await storeUsersHash(res.toString())
        secretKey = rnd
    }
    console.log('finally this the secret key', secretKey)
}

async function dealWithData() {
    try {
        dataHash = await contract.methods.getDataHash().call()
        const node = await ipfs.object.get(dataHash)
        dataArr = JSON.parse(node._data.toString())
        console.log(dataArr.length)
    } catch (e) {
        console.warn('Can\'t get your data')
    }
}


async function storeDataHash(combinedHash) {
    const gasAmount = await contract.methods.storeDataHash(combinedHash).estimateGas({ from: config.MY_ACCOUNT_ADDRESS })
    await contract.methods.storeDataHash(combinedHash).send({ gas: gasAmount, from: config.MY_ACCOUNT_ADDRESS })
}

async function storeUsersHash(usersHash) {
    const gasAmount = await contract.methods.storeUsersHash(usersHash).estimateGas({ from: config.MY_ACCOUNT_ADDRESS })
    return contract.methods.storeUsersHash(usersHash).send({ gas: gasAmount, from: config.MY_ACCOUNT_ADDRESS })
}


module.exports = {
    initiate,
    addNewDataPoint,
}