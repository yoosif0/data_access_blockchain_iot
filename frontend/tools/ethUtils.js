const eUtil = require('ethereumjs-util')
const crypto = require('node-rsa');

const privateKey = '3ccbe67f32be6ad8e9f32da0361f42ba490d3d8c66ca99c952ca78e0a269f651';
console.log(eUtil.isValidPrivate(Buffer.from(privateKey, 'hex')))

const publicKey = eUtil.privateToPublic(Buffer.from(privateKey, 'hex'))
console.log(publicKey)
console.log(eUtil.isValidPublic(publicKey))



var encrypted = crypto.publicEncrypt(publicKey, Buffer('aa'));

console.log(encrypted)
