const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { network,ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const args = [];
    log("ChainId", chainId);

    log("Deploying BasicNFT...");
    const basicNFT = await deploy("BasicNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
    });


    if (!developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(basicNFT.address, args);
    }

    log("BasicNFT deployed!");
};

module.exports.tags = ["all", "basicNFT", "main"]