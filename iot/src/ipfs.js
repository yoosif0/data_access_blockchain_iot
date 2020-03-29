const IPFS = require('ipfs')
const { AES, enc } = require('crypto-js')
const DataAccess = require('./src/DataAccess')
const Web3 = require('web3')
let combinedHash = undefined
let t = undefined
let web3 = undefined
let accounts = undefined
let account = undefined
let contract = undefined
const IpfsHttpClient = require('ipfs-http-client')
const ipfs = IpfsHttpClient({host: 'ipfs.infura.io', port: '5001', protocol: 'https'})
const { CID } = require('ipfs-http-client')

// get current hash from the smart contract 
// each time data is thrown in ipfs we save the new hash locally
// the class that have the hash updates the hash in the smaret contract when it is updated 2 times
// class that emulates that data is coming 


async function addNewDataPoint(dataPoint) {
    let latestSingleItemHash = (await ipfs.object.put(dataPoint)).toString()
    combinedHash = (await t.object.patch.addLink(combinedHash, { cid: new IPFS.CID(latestSingleItemHash) })).toString()
}




async function initiate() {
    // t = await IPFS.create()
    web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId()
    console.log(DataAccess)
    const networkData = DataAccess.networks[networkId];
    if (networkData) {
        contract = new web3.eth.Contract(DataAccess.abi, networkData.address);
        account = accounts[0]
        await getCombinedHash()
    } else {
        console.warn('Contract is not found in your blockchain.')
    }
}


async function getCombinedHash() {
    try {
        combinedHash = await contract.methods.getDataHash().call()
        if (!combinedHash) {
            console.log('looks like you never added anything')
        }
    } catch (e) {
        console.warn('Can\'t get your document\'s hash')
    }
}

async function getAllData() {
    const links = (await t.object.get(combinedHash)).Links
    const originalItemsPromises = links.map(link => t.object.data(link.Hash.toString()))
    return Promise.all(originalItemsPromises).then(arrOfData => arrOfData.map(d => d.toString()))
}

module.exports = {
    initiate
}
// await t.object.patch.addLink('QmW5kEYkxkwSHWxUXQXrEWBJH5EJ4JMK8sroKWib4YkXnY', { cid: new IPFS.CID(newHash) })