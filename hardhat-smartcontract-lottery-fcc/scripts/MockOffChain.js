const { ethers, network } = require("hardhat")

async function mockKeepers() {
    const raffle = await ethers.getContract("Raffle")
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2_5Mock")

    // Add consumer before performing upkeep
    const subscriptionId = await raffle.get_SubId()
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.target)

    const checkData = ethers.keccak256(ethers.toUtf8Bytes(""))
    const { upkeepNeeded } = await raffle.checkUpkeep.staticCall(checkData)
    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData)
        const txReceipt = await tx.wait(1)
        // const requestId = txReceipt.
        //     events[1].args.requestId

        // 从合约里拿到需要查询的事件名
        const eventFilter = raffle.filters.RequestedRaffleWinner;
        // 从哪个区块到最新区块中 查询哪个事件
        const events = await raffle.queryFilter(eventFilter, -1);
        const requestId = events[0].args[0];

        console.log(`Performed upkeep with RequestId: ${requestId}`)
        const chainId = network.config.chainId
        if (chainId == 31337) {
            await mockVrf(requestId, raffle)
        }
    } else {
        console.log("No upkeep needed!")
    }
}

async function mockVrf(requestId, raffle) {
    console.log("We on a local network? Ok let's pretend...")
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2_5Mock")
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.target)
    console.log("Responded!")
    const recentWinner = await raffle.get_RecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })