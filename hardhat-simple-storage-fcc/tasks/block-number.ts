import { task } from "hardhat/config";

export default task("block-number", "Prints the current block number").setAction(
  // anonymous function
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`current block number is ${blockNumber}`);
  }
);
