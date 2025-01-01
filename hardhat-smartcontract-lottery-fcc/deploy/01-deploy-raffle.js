
const { network, ethers } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const VRF_SUB_FUND_AMOUNT = ethers.parseEther("2");
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
        log("debug----")
        log("vrfCoordinatorV2_5Mock:",vrfCoordinatorV2_5Mock)
        subscriptionId = transactionReceipt.logs[0].topics[1];
        log("topic:",transactionReceipt.logs[0].topics[1])

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

