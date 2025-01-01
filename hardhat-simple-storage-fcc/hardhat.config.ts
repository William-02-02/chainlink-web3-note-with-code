import "@nomicfoundation/hardhat-toolbox";
import "@chainlink/env-enc";
import "@nomicfoundation/hardhat-verify";
/** @type import('hardhat/config').HardhatUserConfig */
// 导入自定义的task
import "./tasks/block-number";
import "@nomicfoundation/hardhat-toolbox"

// 这里一直读取不出来检查一下：
//  1. require("dotenv").config();有没有写config
//  2. env是不是小写的！！！ .ENV会读不到
//  3. env里面属性名字错了没！
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.ethereum.org/example";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
const COINMARKET_APIKEY = process.env.COINMARKET_APIKEY;

module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_APIKEY,
    },
  },
  networks: {
    sepolia: {
      // 注意是`号
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY,
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    }
  },
  gasReporter: {
    enable: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKET_APIKEY,
    token: "MATIC",
  }
};
