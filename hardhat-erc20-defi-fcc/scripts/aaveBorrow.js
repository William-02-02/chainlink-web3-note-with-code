const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth } = require("../scripts/getWeth")


async function getLendingPoll(account) {
    const signer = await ethers.getSigner(account)

    const iLendingPoolAddressProvider = await ethers.getContractAt(
        "IPoolAddressesProvider",
        "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
        signer
    )
    const lendingPoolAddress = await iLendingPoolAddressProvider.getPool()
    const lendingPool = await ethers.getContractAt(
        "IPool",
        lendingPoolAddress,
        signer
    )

    return lendingPool;

}

async function approveErc20(erc20Address, spenderAddress, amount, account) {
    const signer = await ethers.getSigner(account)
    const erc20 = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        signer
    )
    const tx = await erc20.approve(spenderAddress, amount)
    await tx.wait(1)
    console.log("Approved")
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralBase,
        totalDebtBase,
        availableBorrowsBase,
        currentLiquidationThreshold,
        ltv,
        healthFactor } = await lendingPool.getUserAccountData(account)

    console.log(`You have ${totalCollateralBase} worth of ETH deposited`)
    console.log(`You have ${totalDebtBase} worth of ETH borrowed`)
    console.log(`You have ${availableBorrowsBase} worth of ETH available to borrow`)
    console.log(`Your current liquidation threshold is ${currentLiquidationThreshold}`)
    console.log(`Your loan to value is ${ltv}`)
    console.log(`Your health factor is ${healthFactor}`)

    return { availableBorrowsBase, totalDebtBase }

}

async function getDaiPrice(account) {
    const signer = await ethers.getSigner(account)
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4",
        signer
    )
    const { answer } = await daiEthPriceFeed.latestRoundData()
    const price = ethers.formatUnits(answer, 8)
    console.log(`THE DAI/ETH price is ${price}`)
    return price
}

async function borrowDai(daiAddress, lendingPool, amountDaiToBorrowEth, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrowEth, 1, 0, account)
    await borrowTx.wait(1)
    console.log("Borrowed DAI")
}

async function repayDai(daiAddress, lendingPool, amountDaiToRepay, account) {
    const repayTx = await lendingPool.repay(daiAddress, amountDaiToRepay, 1, account)
    await repayTx.wait(1)
    console.log("Repaid DAI")
}


async function main() {
    // deposit weth to lendingPool
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPoll(deployer)
    console.log(lendingPool.target)
    const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const amount = ethers.parseEther("0.01")
    // approve weth to lendingPool
    await approveErc20(wethAddress, lendingPool.target, amount, deployer)
    console.log("depositing weth to lendingPool");
    // address asset, amount, onBehalfOf, referralCode
    await lendingPool.deposit(wethAddress, amount, deployer, 0)
    console.log("Deposited");

    let { availableBorrowsBase } = await getBorrowUserData(lendingPool, deployer)
    const daiPrice = await getDaiPrice(deployer)
    
    // Convert availableBorrowsBase from Wei and adjust for decimals
    const availableBorrowsETH = ethers.formatUnits(availableBorrowsBase, 8)
    console.log(`Available to borrow (ETH): ${availableBorrowsETH}`)
    
    // Calculate DAI amount with proper decimal handling (using 70% of available)
    const amountDaiToBorrow = (
        (Number(availableBorrowsETH) * 0.5) / Number(daiPrice)
    ).toFixed(18)
    
    console.log(`Planning to borrow ${amountDaiToBorrow} DAI`)
    
    // Convert to Wei for the contract call
    const amountDaiToBorrowWei = ethers.parseUnits(amountDaiToBorrow, 18)
    
    const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
    try {
        await borrowDai(daiAddress, lendingPool, amountDaiToBorrowWei, deployer)
        await getBorrowUserData(lendingPool, deployer)
    } catch (error) {
        if (error.message.includes('33')) {
            console.log("Error: Insufficient collateral to cover borrow amount")
            console.log("Try borrowing a smaller amount")
        } else {
            console.log("Error:", error.message)
        }
    }
    await getBorrowUserData(lendingPool, deployer)
    await repayDai(daiAddress, lendingPool, amountDaiToBorrowWei, deployer)
    await getBorrowUserData(lendingPool, deployer)
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1)
    })