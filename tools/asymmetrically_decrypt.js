const EthCrypto = require('eth-crypto');

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.question("What is your private key ?\n ", function (privateKey) {
    rl.question("What's your encrypted secret key?\n", async function (x) {
        const sk = await EthCrypto.decryptWithPrivateKey(privateKey, JSON.parse(x))
        console.log(`Your secret key is ${sk}`);
        rl.close();
    });
});
