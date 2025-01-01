const { ethers, network } = require("hardhat")
const fs = require('fs');

const FRONT_END_ADDRESSES_FILE = "../nextjs-new-lottery-fcc/lottery/src/app/lottery/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-new-lottery-fcc/lottery/src/app/lottery/constants/abi.json"

module.exports = async (params) => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Update font end");
        UpdateContractAddresses()
        UpdateAbi()
    }
}

async function UpdateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const currentAddress = await JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    const chainId = await network.config.chainId;

    if (chainId in currentAddress) {
        if (!currentAddress[chainId].includes(raffle.target)) {
            currentAddress[chainId].push(raffle.target)// 插入新值到数组
        }
    } else {
        currentAddress[chainId] = [raffle.target]// 定义数组 并赋值
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE,JSON.stringify(currentAddress))

}

async function UpdateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, JSON.stringify(raffle.interface.fragments));

}

module.exports.tags = ["all","front"]