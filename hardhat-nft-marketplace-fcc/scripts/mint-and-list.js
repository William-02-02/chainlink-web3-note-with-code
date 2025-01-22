const { error } = require("console")
const { ethers } = require("hardhat")

const Price = ethers.parseEther("0.1")

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const BasicNFT = await ethers.getContract("BasicNFT")
    console.log("minting...")
    const txResponse = await BasicNFT.mintNFT()
    const txReceipt = await txResponse.wait(1)
    const tokenId = await txReceipt.logs[0].topics[1]

    console.log("Approving...");
    const approveResp = await BasicNFT.approve(nftMarketplace.target, tokenId)
    const approceRecei = await approveResp.wait(1)
    console.log("Listing...");
    const listResp = await nftMarketplace.listNft(BasicNFT.target, tokenId, Price)
    await listResp.wait(1)
    console.log("Listed!")

}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })