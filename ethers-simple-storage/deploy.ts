// const ethers = require("ethers");
// const fs = require("fs-extra");
// require("dotenv").config();
import {ethers} from "ethers"
import * as fs from "fs-extra"
import "dotevn/config"

async function main() {
  // 注意版本差异 v5使用 ethers.providers.JsonRpcProvider
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  // 使用明文私钥
  //   const wallet = new ethers.Wallet(
  //     process.env.PRIVATE_KEY,
  //     provider
  //   );
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD!,
  );
  console.log(wallet);
  // 此处不知道为什么 无法连接上provider v5 v6？
  wallet = wallet.connect(provider);
  console.log(wallet);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8",
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");

  const contract = await contractFactory.deploy();
  console.log(contract);
  // wait(1) means wait one block
  const deploymentReceipt = await contract.deploymentTransaction()!.wait(1);
  console.log("here is the deployment transaction:");
  console.log(contract.deploymentTransaction);

  console.log("here is the deployment transaction receipt:");
  console.log(deploymentReceipt);

  console.log("Let's deploy with only transaction data!");

  //======the nonce is used to prevent double spending attack
  //======nonce is the transaction that the account ever send
  //======以前发了几个交易就填几 不需要nonce+1
  //   console.log(await wallet.getNonce());
  //   const tx ={
  //     nonce:8,
  //     gasPrice: 2000000000,
  //     gasLimit: 1000000,
  //     to: null,
  //     value: 0,
  //     data: "",
  //     chainId: 5777
  //   };
  //   const signedTXResponse = await wallet.signTransaction(tx);
  //   await wallet.sendTransaction(tx);

  const currentFacoriteNumber = await contract.retrieve();
  // string interpolation
  // In computer programming,
  // string interpolation (or variable interpolation, variable substitution, or variable expansion)
  // is the process of evaluating a string literal containing one or more placeholders,
  // yielding a result in which the placeholders are replaced with their corresponding values.
  console.log(`Current Favorite Number:${currentFacoriteNumber}`);
  const transactionResponse = await contract.store("9");
  // response只是打包交易的返回结果  等待一个区块保证交易被打包过后查看receipt
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number is :${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error();
    process.exit(1);
  });
