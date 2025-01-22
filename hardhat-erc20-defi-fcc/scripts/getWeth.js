const { getNamedAccounts, ethers } = require('hardhat');

const AMOUNT = ethers.parseEther("0.02")

// 这里我们在forking主网，使用aave在主网上的合约地址
// wrapped eth 就是 aave 上
async function getWeth() {
    const { deployer } = await getNamedAccounts()

    const signer = await ethers.getSigner(deployer)

    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",// 主网上的wrapped eth 合约地址
        signer
    )
    const tx = await iWeth.deposit({ value: AMOUNT })// 使用本地fork的虚拟账户充值
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)

}
module.exports = { getWeth }