import { ethers, run, network } from "hardhat";
import "@chainlink/env-enc/config";

async function main() {
  // 注意await  如果不加就会导致报错
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract....");

  // 如果合约constructor需要参数 那么在这个deploy填入
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.waitForDeployment();
  // only when using non-local network need verify
  if (network.config.chainId != 31337 && process.env.ETHERSCAN_APIKEY) {
    console.log("waiting for block confirmation...")
    await (SimpleStorage)simpleStorage.deploymentTransaction().wait(6);
    await verify(simpleStorage.target, []);
  }

  // interact with contract
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${currentValue}`)

  // Update value
  const transactionResp = await simpleStorage.store(7)
  await transactionResp.wait(1)
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated value is: ${updatedValue}`)

  

}

// 合约上线需要验证  这里可以在代码里实现 也可以去ether scan上传
async function verify(contractAddress: string, args: any) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      ConstructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log(" Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
