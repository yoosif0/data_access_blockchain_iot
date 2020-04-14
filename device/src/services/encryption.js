const { AES, enc } = require('crypto-js');
const EthCrypto = require('eth-crypto');

function decryptSymmtrically(encryptedFile, secretKey) {
    return AES.decrypt(encryptedFile, secretKey).toString(enc.Utf8)
}

function encryptSymmtrically(data, secretKey) {
    return AES.encrypt(data, secretKey).toString()
}

function encryptASymmtrically(publicKey, secretKey) {
    return EthCrypto.encryptWithPublicKey(publicKey, secretKey)
}

function decryptASymmtrically(privateKey, cipher) {
    return EthCrypto.decryptWithPrivateKey(privateKey, cipher)
}

module.exports = {
    decryptSymmtrically, encryptSymmtrically, encryptASymmtrically, decryptASymmtrically
}