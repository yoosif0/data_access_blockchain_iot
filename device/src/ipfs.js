const DataAccess = require('../../blockchain/src/abis/DataAccess')
const Web3 = require('web3')
const config = require('dotenv').config().parsed
const { encryptSymmtrically, encryptASymmtrically, decryptASymmtrically } = require('./services/encryption');

let secretObjectHash = undefined
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
    // const nodePromise = IPFS.create()
    web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    const accountsPromise = web3.eth.getAccounts();
    const networkIdPromise = web3.eth.net.getId()

    // node = await nodePromise
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
        secretObjectHash = await contract.methods.getSecretObjectHash().call()
        console.log('secretObjectHash', secretObjectHash)
        const node = await ipfs.object.get(secretObjectHash)
        const secretObject = JSON.parse(node._data.toString())
        secretKey = await decryptASymmtrically(config.PRIVATE_KEY, secretObject[config.PUBLIC_KEY].encryptedSecretKey)
        // const updatedSecretObject = await encryptASUsersWithAccess(secretKey, secretObject)
        // const res = await ipfs.object.put({ Data: JSON.stringify(updatedSecretObject), Links: [] })
        // await storeSecretObjectHash(res.toString())
    } catch (e) {
        console.warn('Can\'t get your encrypted secret key')
        const rnd = Math.random().toString(36).substring(10)
        const encryptedSecretKey = await encryptASymmtrically(config.PUBLIC_KEY, rnd)
        const secretObject = {[config.PUBLIC_KEY]: {encryptedSecretKey, identity: 'OWNER'}}
        const res = await ipfs.object.put({ Data: JSON.stringify(secretObject), Links: [] })
        await storeSecretObjectHash(res.toString())
        secretKey = rnd
    }
    console.log('finally this the secret key', secretKey)
}


// function encryptASUsersWithAccess(secretKey, secretObject) {
//     Object.keys(secretObject).forEach(async publicKey => {
//         if (secretObject[publicKey].haveAccess &&  !secretObject[publicKey].encryptedSecretKey) {
//             secretObject[publicKey].encryptedSecretKey = await encryptASymmtrically(publicKey, secretKey)
//         }
//     })
//     return secretObject
// }

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

async function storeSecretObjectHash(secretObjectHash) {
    console.log(secretObjectHash, config.MY_ACCOUNT_ADDRESS)
    const gasAmount = await contract.methods.storeSecretObjectHash(secretObjectHash).estimateGas({ from: config.MY_ACCOUNT_ADDRESS })
    return contract.methods.storeSecretObjectHash(secretObjectHash).send({ gas: gasAmount, from: config.MY_ACCOUNT_ADDRESS })
}

async function getAllData() {
    // const links = (await ipfs.object.get(combinedHash)).Links
    // const originalItemsPromises = links.map(link => ipfs.object.data(link.Hash.toString()))
    // return Promise.all(originalItemsPromises).then(arrOfData => arrOfData.map(d => d.toString()))
}

module.exports = {
    initiate,
    addNewDataPoint,
    getAllData

}
// await ipfs.object.patch.addLink('QmW5kEYkxkwSHWxUXQXrEWBJH5EJ4JMK8sroKWib4YkXnY', { cid: new IPFS.CID(newHash) })