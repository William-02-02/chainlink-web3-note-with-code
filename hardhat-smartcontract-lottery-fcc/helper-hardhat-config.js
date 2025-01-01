const { ethers } = require("hardhat");

const developmentChains = ["hardhat", "localhost"];

const networkConfig = {
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "0",
        callbackGasLimit: "500000",
        interval: "30",
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "0",
        callbackGasLimit: "500000",
        interval: "30",
    },
};

module.exports = {
    networkConfig,
    developmentChains,
};
