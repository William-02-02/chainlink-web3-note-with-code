require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy-ethers");
require("hardhat-deploy");
require("hardhat-gas-reporter")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.28",
  solidity: {
    compilers:[
      {version: "0.8.28"},
      //可以指定多个版本的solidity 如果引入的项目版本不合适
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia:{
      url: process.env.SEPOLIA_URL || "",
      // accounts: [privateKey0, privateKey1]
    }
  },
  gasReporter: {
    enable: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: "3ce8248f-bd53-4ac3-8c5c-da315d95cd4a",
    token: "MATIC",
  },

  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        31337: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
},
};
