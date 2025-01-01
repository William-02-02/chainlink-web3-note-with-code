require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();
require("@typechain/hardhat");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
const COINMARKET_APIKEY = process.env.COINMARKET_APIKEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    defaultNetwork: "hardhat",
    typechain: {
        outDir: "type-chain", // 输出 TypeScript 文件的目录
        target: "ethers-v6", // 使用 ethers v5 类型
        alwaysGenerateOverloads: true,
        dontOverrideCompile: false,
    },
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 31337,
            url: "http://127.0.0.1:8545"
        },
        sepolia: {
            chainId: 11155111,
            blockConfirmations: 6,
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            31337: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
            // 4: RINKEBY_ACCOUNT
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 30000, //30sec
    }
};
