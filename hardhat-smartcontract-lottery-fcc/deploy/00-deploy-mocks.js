const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

// base fee 是用于chainlink节点请求ETH网络所需的费用  perform函数传入随机值是由chainlink节点传入的 需要gas
const BASE_FEE = ethers.parseEther("0.25");
// BASE_FEE 是支付给 Ethereum 网络的 Gas 费用，确保 Chainlink 节点能够在 Ethereum 上发起和处理交易。
//GAS_PRICE_LINK 是支付给 Chainlink 节点的 Link 代币费用，补偿节点的计算资源。
const GAS_PRICE_LINK = 1e9;
const WEI_PER_UINT_LINK = 7085403416910127;

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [BASE_FEE, GAS_PRICE_LINK, WEI_PER_UINT_LINK];

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...");

        await deploy("VRFCoordinatorV2_5Mock", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        });
        log("Mocks Deployed!")
        log("---------------------------------------------------")
    }
};

module.exports.tags = ["all", "mocks"];

