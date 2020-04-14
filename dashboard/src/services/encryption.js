import { AES, enc } from 'crypto-js';
const EthCrypto = require('eth-crypto');

export function decryptSymmtrically(encryptedData, secretKey) {
    return AES.decrypt(encryptedData, secretKey).toString(enc.Utf8)
}

export function encryptSymmtrically(dataUrl, secretKey) {
    return AES.encrypt(dataUrl, secretKey).toString()
}

export function encryptASymmtrically(publicKey, secretKey) {
    return EthCrypto.encryptWithPublicKey(publicKey, secretKey)
}