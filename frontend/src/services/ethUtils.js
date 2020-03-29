import * as  EthCrypto from 'eth-crypto';

export function publicToAddress(pubKey) {
    return EthCrypto.publicKey.toAddress( pubKey );
}