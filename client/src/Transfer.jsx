import { useState } from "react";
import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";

function Transfer({ setBalance, publicKey, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = {
        recipient,
        amount: parseInt(sendAmount)
      }
      const messageBytes = utf8ToBytes(JSON.stringify(message));
      const messageHash = toHex(keccak256(messageBytes));
      const signature = secp256k1.sign(messageHash, privateKey);

      const jsonSignature = JSON.stringify(signature, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );

      const {
        data: { balance },
      } = await server.post(`send`, {
        message: messageHash,
        signature: jsonSignature,
        publicKey,
        recipient,
        amount: parseInt(sendAmount)
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
