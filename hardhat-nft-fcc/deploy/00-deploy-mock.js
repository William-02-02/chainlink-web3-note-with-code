// require
const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = "100000000000000000"
const GAS_PRICE_LINK = "1000000000"
const WEI_PER_UINT_LINK = "6156980000000000"


module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK, WEI_PER_UINT_LINK]
    const DECIMALS = 8
    const INITIAL_ANSWER = ethers.parseEther("2000")

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2_5Mock", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        log("VRF Mocks deployed!")
        log("----------------------------------")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        log("Chainlink Aggregator Mocks deployed!")
        log("----------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
