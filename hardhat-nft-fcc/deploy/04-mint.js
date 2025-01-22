const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // Basic NFT
    const basicNft = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicNft.mintNFT()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 tokenURI: ${await basicNft.tokenURI(0)}`)

    // Dynamic SVG  NFT
    const highValue = ethers.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue)
    await dynamicSvgNftMintTx.wait(1)
    console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)

    // Random IPFS NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNFT", deployer)
    let vrfCoordinatorMock;
    if (chainId == 31337) {
        await subscribe(vrfCoordinatorMock, randomIpfsNft)
    }

    // mint
    const mintFee = await randomIpfsNft.getMintFee()
    const randomIpfsNftMintTx = await randomIpfsNft.requestNFT({ value: mintFee.toString() })
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
    // Need to listen for response
    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000) // 5 minute timeout time
        // setup listener for our event
        randomIpfsNft.once("NFTMinted", async () => {
            console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)
            resolve()
        })
        if (chainId == 31337) {
            const events = randomIpfsNftMintTxReceipt.logs
                .filter((x) => x.address === randomIpfsNft.target) // Updated from .address to .target
                .map((log) => randomIpfsNft.interface.parseLog(log)) // Search for the error that matches the error selector in data and parse out the details.
            const requestId = events[0].args[0].toString()
            console.log(`requestId: ${requestId}`)
            await vrfCoordinatorMock.fulfillRandomWords(requestId, randomIpfsNft.target)
            const subscription = await vrfCoordinatorMock.getSubscription(subscriptionId)
            console.log(`after fulfill subscription: ${subscription}`)
        }
    })

}

async function subscribe(vrfCoordinatorMock, randomIpfsNft) {
    // subscribe
    vrfCoordinatorMock = await ethers.getContract("VRFCoordinatorV2_5Mock", deployer)
    const subscriptionId = await randomIpfsNft.getSubscriptionId()
    await vrfCoordinatorMock.addConsumer(subscriptionId, randomIpfsNft.target)
    await vrfCoordinatorMock.fundSubscription(subscriptionId, "100000000000000000000")
    const subscription = await vrfCoordinatorMock.getSubscription(subscriptionId)
    console.log(`before fulfill subscription: ${subscription}`)
}

module.exports.tags = ["all", "mint"]