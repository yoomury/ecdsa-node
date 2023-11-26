import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

/*
d23dbd5868ddee951b6bd4ff9304912b6db094bcf33e4f46c992eea455f0936f
02de2eacc794903d3d6435912413b52622cef730e4aa032e45681a824976c8b71f
82be4a53776a3bb7ad69c892dfcf7d0ef4079b15

99920bebcf2f6889764118047d757d8f64da1e76fa97767632c269ec03e0d401
02ca519b605d07bafe549a1026266822f1f293a2941b024325331e24b02c73d61f
f3453ef8f986f6403331a8b7bea23f94a606258a

5cd33f9d79b5301f951b08533ab6b577e94976ccf26fa1edcbe3c22e44a6fc01
0203ba07c10335ff8aa5bf2204ab374a9ee3686ed9241f7a2dd3137107a3f75916
eaf9493f7d59bc06e1bb31ed8bf1f821db467420
 */


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, setPublicKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    // get public key
    const publicKey = secp256k1.getPublicKey(privateKey)

    setPublicKey(toHex(publicKey));

    // derive address
    const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
    if (address) {
      setAddress(address);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Type the private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <div className="balance">Address: {address}</div>
    </div>
  );
}

export default Wallet;
