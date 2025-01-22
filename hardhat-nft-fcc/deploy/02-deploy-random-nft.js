const { log } = require("console")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
const { verify } = require("../utils/verify")
const { network, ethers } = require("hardhat")
const { default: PinataClient } = require("@pinata/sdk")

const imagesPath = "./images/randomNft"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cutteness",
            value: "100",
        },
    ],
}
//75316787248964041682035556771270617562170786780774209958770042313719631071761n
//"0xa683ca7923840e0e507412f44af998b0fdd979f561d4841a841961240a444a11"


let tokenURIs = [
    'ipfs://Qmf9onnDu5bVPZQ4PvtwviGeytW4EW63bQ5ZZj1YrCexPx',
    'ipfs://QmQVsb9rAzSupLTQZkPoN4p1qknG2TQSM5h9jT5vtDxqVF',
    'ipfs://QmP52CUtgWF74vwXKnanNQjuH7L43UjBtsddamQhc6Ru9E'
]

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const VRF_FUND_AMOUNT = ethers.parseEther("600")

    let vrfCoordinatorV2_5MockAddress, subscriptionId

    // 可以本地写死图片token的ipfs
    // 也可以上传
    // 1. upload to ipfs 需要两个节点保存你的信息
    // 2. upload to nft.storage
    // 3. upload to pinata 一个中心化的提供ipfs服务的平台



    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenURIs = await handleTokenUris()
    }

    if (developmentChains.includes(network.name)) {
        // get mock
        const vrfCoordinatorMock = await ethers.getContract("VRFCoordinatorV2_5Mock")
        vrfCoordinatorV2_5MockAddress = vrfCoordinatorMock.target  // 添加这行
        const tx = await vrfCoordinatorMock.createSubscription()
        const txReceipt = await tx.wait(1) // 等待交易确认

        // // 见 ethers js官方文档 queryfilter！
        // // 从合约里拿到需要查询的事件名
        // const eventFilter = vrfCoordinatorMock.filters.SubscriptionCreated()
        // // 从哪个区块到最新区块中 查询哪个事件
        // const events = await vrfCoordinatorMock.queryFilter(eventFilter, 0, "latest")
        // // 这里的subId是十进制的 需要转化
        // subscriptionId = "0x" + events[0].args[0].toString(16)
        // console.log(subscriptionId)

        subscriptionId = txReceipt.logs[0].topics[1];
        console.log("topic:",txReceipt.logs[0].topics[1])

        await vrfCoordinatorMock.fundSubscription(subscriptionId, VRF_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2_5MockAddress = networkConfig[chainId].vrfCoordinatorV2_5
        subscriptionId = networkConfig[chainId].subscriptionId
    }


    const args = [
        vrfCoordinatorV2_5MockAddress,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        tokenURIs,
        networkConfig[chainId].mintFee,
    ]

    log("Deploying RandomNFT...")
    const randomIpfsNFT = await deploy("RandomIpfsNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
    })


    if (!developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNFT.address, args)
    }

    log("RandomIpfsNFT deployed!")

}

// 上传图片到ipfs，并生成metadata metadata转成metadataTemplate格式
async function handleTokenUris() {
    log("Uploading images to pinata...")
    const tokenURIs = []
    // store img in IPFS
    // store metadata in IPFS
    const { responses: imageUploadResponses, files } = await storeImages(imagesPath)
    for (imageResp in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageResp].replace(".png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageResp].IpfsHash}`
        console.log(`uploading ${tokenUriMetadata.name}...`)

        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenURIs.push(`ipfs://${metadataUploadResponse.IpfsHash}`)

    }
    log("Metadata uploaded!")
    console.log(tokenURIs)
    return tokenURIs
}



module.exports.tags = ["all", "uploadToPinata", "randomIpfsNFT", "main"]
