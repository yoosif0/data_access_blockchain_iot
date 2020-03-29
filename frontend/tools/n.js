const IPFS = require('ipfs')
const { AES, enc } = require('crypto-js')
const originalHash = 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n';



(async function a() {
    let t = await IPFS.create()
    async function addNewData() {
        const dataPoint = {
            temperature: Math.round(Math.random() * 10),
            humidity: Math.round(Math.random() * 10)
        }
        const encrypted = AES.encrypt(JSON.stringify(dataPoint), 'secret 123').toString()
        const obj = {
            Data: encrypted,
            Links: []
        }
        const newHash = (await t.object.put(obj)).toString()
        await t.object.patch.addLink(originalHash, { name: 'some-link', size: 10, cid: new IPFS.CID(newHash) })
    }
    addNewData()
    addNewData()
    addNewData()

})()


// (await t.object.links('QmSWt6ABVkQGTNBDYyJJju6oJDugjTswY8g6vbhge5wSuk'))
// (await t.object.data('QmPb5f92FxKPYdT3QNBd1GKiL4tZUXUrzF4Hkpdr3Gf1gK')).toString()



// AES.decrypt('U2FsdGVkX19n1iA1jFWMRMmmC1yDAPROPaesKt8Ui+h0+ITMJZR1IFK1UaqdEofq', 'secret 123').toString(enc.Utf8)