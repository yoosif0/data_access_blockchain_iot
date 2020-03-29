const EthCrypto = require('eth-crypto');

const privateKey = '3ccbe67f32be6ad8e9f32da0361f42ba490d3d8c66ca99c952ca78e0a269f651'
const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
console.log(publicKey)
const address = EthCrypto.publicKey.toAddress(publicKey);

console.log(address)

const message = 'secret 123'
EthCrypto.encryptWithPublicKey(publicKey, message)
    .then(x =>
        EthCrypto.decryptWithPrivateKey(
            privateKey,
            x
        ))
    .then(x => console.log(x));