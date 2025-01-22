
const { network, ethers } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const VRF_SUB_FUND_AMOUNT = ethers.parseEther("60");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Address, subscriptionId;
    

    if (developmentChains.includes(network.name)) {
        // const contractAddress = (await deployments.get('VRFCoordinatorV2_5Mock')).address;
        const vrfCoordinatorV2_5Mock = await ethers.getContract('VRFCoordinatorV2_5Mock');
        // const vrfCoordinatorV2_5Mock = await deployments.get("VRFCoordinatorV2_5Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2_5Mock.target;
        const transactionResp = await vrfCoordinatorV2_5Mock.createSubscription();
        const transactionReceipt = await transactionResp.wait(1);

        // 从哪个区块到最新区块中 查询哪个事件
        const eventFilter = vrfCoordinatorV2_5Mock.filters.SubscriptionCreated()
        const events = await vrfCoordinatorV2_5Mock.queryFilter(eventFilter, 0, 'latest')
        log("events:",events)
        // 把subscriptionId转化为十六进制，前方添加0x
        // 这里可以使用ethers.utils.hexValue(events[0].args[0]) 但是我的是hardhat ethers 版本还是5
        subscriptionId = "0x" + events[0].args[0].toString(16)

        // log("debug----")
        // log("vrfCoordinatorV2_5Mock:",vrfCoordinatorV2_5Mock)
        // subscriptionId = transactionReceipt.logs[0].topics[1];
        // console.log("topic:",transactionReceipt.logs[0].topics[1])


        // fund the subscription
        await vrfCoordinatorV2_5Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }
    const entranceFee = networkConfig[chainId]["entranceFee"];
    const gasLane = networkConfig[chainId]["gasLane"];
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
    const interval = networkConfig[chainId]["interval"];

    const args = [entranceFee, vrfCoordinatorV2Address, gasLane, subscriptionId, callbackGasLimit, interval];
    log("args:",args)
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_APIKEY){
        log("Verifying...")
        await verify(raffle.address, args)
    }

    log("----------------------------------------------")
};
module.exports.tags = ["all", "raffle"];

