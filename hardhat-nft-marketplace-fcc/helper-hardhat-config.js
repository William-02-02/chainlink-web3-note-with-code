const { ethers } = require("hardhat");

const developmentChains = ["hardhat", "localhost"];

const networkConfig = {
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2_5: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
        priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306", //eth/usd
        gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        subscriptionId: "12257",
        callbackGasLimit: "500000",
        interval: "30",
        blockConfirmations: 6,
        mintFee: ethers.parseEther("0.01"),
    },
    31337: {
        name: "hardhat",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "0",
        callbackGasLimit: "500000",
        interval: "30",
        blockConfirmations: 1,
        mintFee: ethers.parseEther("0.01"),
    },
};

module.exports = {
    networkConfig,
    developmentChains,
};
