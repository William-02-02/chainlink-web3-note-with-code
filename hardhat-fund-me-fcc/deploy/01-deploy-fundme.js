const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// 可以全部写到module export里面 也可以这样拆分  把Aggregator拆出来 pricefeed也拆出来
async function deployFunc(hre) {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  log("-------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfiermation: network.config.blockConfirmations || 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  }
}

module.exports = async (hre) => {
  await deployFunc(hre);
};
// 为该脚本添加标签 用于单体指定执行
module.exports.tags = ["all", "fundme"];
