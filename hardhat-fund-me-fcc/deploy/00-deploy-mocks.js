const { network } = require("hardhat");
const {
  DECIMALS,
  INITIAL_ANSER,
  developmentChains,
} = require("../helper-hardhat-config");
const { Contract } = require("ethers");

// 语法糖 直接从hre中拿到这两个对象
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // 因为本地测试无法拿到预言机信息 所以需要用Mock数据 先实例这个Aggregator合约
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMALS, INITIAL_ANSER],
    });
    log("Mocks Deployed!");
    log(
      "You are deploying to a local network,you'll need a local network running to interact"
    );
    log(
      "Please run `npx hardhat console` to interact with the deployed smart contracts!"
    );
    log("------------------------------------------------");
  }
};
module.exports.tags = ["all", "mocks"];
