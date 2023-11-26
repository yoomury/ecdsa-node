const express = require("express");
const app = express();
const cors = require("cors");
const secp = require('ethereum-cryptography/secp256k1');
const keccak = require("ethereum-cryptography/keccak");
const utils = require("ethereum-cryptography/utils");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "82be4a53776a3bb7ad69c892dfcf7d0ef4079b15": 100,
  "f3453ef8f986f6403331a8b7bea23f94a606258a": 50,
  "eaf9493f7d59bc06e1bb31ed8bf1f821db467420": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature, publicKey, recipient, amount } = req.body;
  const parsedSignature = JSON.parse(signature);

  const sig = new secp.secp256k1.Signature(BigInt(parsedSignature.r), BigInt(parsedSignature.s))

  if (!secp.secp256k1.verify(sig, message, publicKey)) {
    res.status(400).send({ message: `Invalid Transaction` });
  }
  sig.assertValidity()

  const publicKeyBytes = utils.hexToBytes(publicKey);
  const sender = utils.toHex(keccak.keccak256(publicKeyBytes.slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
