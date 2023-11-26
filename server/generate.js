const secp = require('ethereum-cryptography/secp256k1');
const keccak = require('ethereum-cryptography/keccak');
const { toHex } = require('ethereum-cryptography/utils');

const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey);
const address = keccak.keccak256(publicKey.slice(1)).slice(-20);


console.log(toHex(privateKey));
console.log(toHex(publicKey));
console.log(toHex(address));