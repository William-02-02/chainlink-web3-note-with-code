const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let priceFeedAddress

    if(developmentChains.includes(network.name)){
        const mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
        priceFeedAddress = mockV3Aggregator.target
        log("Local network detected! Deploying mocks...")
    } else {
        priceFeedAddress = networkConfig[chainId]["priceFeedAddress"]
    }

    const lowSVG = await fs.readFileSync("./images/dynamicNft/frown.svg", { encoding: "utf-8" })
    const highSVG = await fs.readFileSync("./images/dynamicNft/happy.svg", { encoding: "utf-8" })

    args = [priceFeedAddress, lowSVG, highSVG]
    const dynamicSVGNFT = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying...")
        await verify(dynamicSVGNFT.target, args)
    }
    log(`Dynamic SVG NFT deployed!`)
    log("----------------------------------")
}

module.exports.tags = ["all", "dynamicSvgNft", "main"]