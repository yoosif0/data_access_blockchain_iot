const IPFS = require('ipfs')
const { AES, enc } = require('crypto-js')
let combinedHash = 'Qmc73nuj14QD6eJR82vTKMdCuA7KJeRhr8ZtwR3DUGtUqE'
let t = undefined
// get current hash from the smart contract 
// each time data is thrown in ipfs we save the new hash locally
// the class that have the hash updates the hash in the smaret contract when it is updated 2 times
// class that emulates that data is coming 


async function addNewDataPoint(dataPoint) {
    let latestSingleItemHash = (await t.object.put(dataPoint)).toString()
    combinedHash = (await t.object.patch.addLink(combinedHash, { cid: new IPFS.CID(latestSingleItemHash) })).toString()
}


async function initiate() {
    combinedHash = await
    t = await IPFS.create()
}

async function getAllData() {
    const links = (await t.object.get(combinedHash)).Links
    const originalItemsPromises = links.map(link => t.object.data(link.Hash.toString()))
    return Promise.all(originalItemsPromises).then(arrOfData => arrOfData.map(d => d.toString()))
}

// await t.object.patch.addLink('QmW5kEYkxkwSHWxUXQXrEWBJH5EJ4JMK8sroKWib4YkXnY', { cid: new IPFS.CID(newHash) })