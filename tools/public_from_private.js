const EthCrypto = require('eth-crypto');

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


rl.on('line', function(line){
    console.log(EthCrypto.publicKeyByPrivateKey(line))
})