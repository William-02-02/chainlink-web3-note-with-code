const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
const { log } = require("console")
const { resolve } = require("path")
const { isTokenKind } = require("typescript")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RandomNFT", () => {
        // variable
        let deployer, randomNft, vrfCoordinatorMock, subscriptionId
        let _mintFee = ethers.parseEther("0.01")

        // deploy
        beforeEach(async () => {
            // 使用deploy脚本的tag
            await deployments.fixture(["randomIpfsNFT", "mocks"])
            // 拿到账户
            // const signers = await ethers.getSigners()// 都行 注意这个是拿到所有账户对象
            deployer = (await getNamedAccounts()).deployer// 这个是在config里面配置的0号用户
            // 拿到合约
            randomNft = await ethers.getContract("RandomIpfsNFT", deployer)
            // 其他合约
            vrfCoordinatorMock = await ethers.getContract("VRFCoordinatorV2_5Mock", deployer)
            // 其他内容 如订阅
            subscriptionId = await randomNft.getSubscriptionId()
            await vrfCoordinatorMock.addConsumer(subscriptionId, randomNft.target)
        })

        // 一个方法一个describe
        // constructor
        describe("Constructor", () => {
            it("check the parameter", async () => {
                const mintFee = await randomNft.getMintFee()
                const vrfCoordinator = await randomNft.getvrfCoordinatorV2_5()
                const dogTokenUris = await randomNft.getDogTokenUris(0)
                assert.isNotEmpty(vrfCoordinator)
                assert.equal(mintFee, _mintFee)
                assert.isNotEmpty(dogTokenUris)
            })

        })

        // request
        describe("request", () => {
            it("revert when no enough entrance fee", async () => {
                await expect(randomNft.requestNFT()).to.be.revertedWithCustomError(
                    randomNft,
                    "RandomIpfsNFT__NotEnoughEth"
                )
            })

            it("generate random number successfully", async () => {
                await expect(randomNft.requestNFT({ value: _mintFee })).to.emit(
                    randomNft,
                    "NFTRequested"
                )
            })
        })

        // fulfill
        //TODO: 这里需要测试 InsufficientBalance!!!
        describe("fulfill", () => {
            it("mints NFT after random number is returned", async () => {
                // 监听事件 在完成铸造之后检验值
                await new Promise(async (resolve, reject) => {
                    randomNft.once("NFTMinted", async (tokenId, breed, minter) => {
                        try {
                            const tokenUri = await randomNft.tokenURI(tokenId)
                            const tokenCounter = await randomNft.getTokenCounter()
                            const dogUri = await randomNft.getDogTokenUris(breed)

                            assert.equal(tokenUri.toString(), dogUri.toString())
                            assert.equal(minter, deployer)
                            assert.equal(
                                tokenCounter.toString(),
                                (ethers.toBigInt(tokenId) + ethers.toBigInt(1)).toString()
                            )

                            resolve()
                        } catch (error) {
                            console.log(error)
                            reject(error)
                        }
                    })

                    try {
                        const requestNftResponse = await randomNft.requestNFT({ value: _mintFee })
                        const requestNftReceipt = await requestNftResponse.wait(1)

                        const events = requestNftReceipt.logs
                            .filter((x) => x.address === randomNft.target) // Updated from .address to .target
                            .map((log) => randomNft.interface.parseLog(log)) // Search for the error that matches the error selector in data and parse out the details.
                        const requestId = events[0].args[0]

                        const log = randomNft.filters.NFTRequested()
                        console.log(requestId)
                        console.log(log)

                        // 调用 mock 合约完成随机数请求
                        const tx = await vrfCoordinatorMock.fulfillRandomWords(
                            requestId,
                            randomNft.target
                        )
                        const txReceipt = await tx.wait(1)
                        console.log(txReceipt)
                    } catch (error) {
                        console.log("Error details:", error)
                        reject(error)
                    }
                })
            })
        })


        // withdraw
        describe("withdraw", () => {
            it("only withdrawed by owner", async () => {
                // 切换用户测试提款
                const signers = await ethers.getSigners()
                await expect(randomNft.connect(signers[1]).withdraw()).to.be.revertedWith("Only callable by owner")
            })
        })

        // getBreedFromModdedRng
        describe("getBreedFromModdedRng", () => {
            it("should return pug if moddedRng < 10", async function () {
                const expectedValue = await randomNft.getBreedFromModdedRng(7)
                assert.equal(0, expectedValue)
            })
            it("should return shiba-inu if moddedRng is between 10 - 39", async function () {
                const expectedValue = await randomNft.getBreedFromModdedRng(21)
                assert.equal(1, expectedValue)
            })
            it("should return st. bernard if moddedRng is between 40 - 99", async function () {
                const expectedValue = await randomNft.getBreedFromModdedRng(77)
                assert.equal(2, expectedValue)
            })
            it("should revert if moddedRng > 99", async function () {
                await expect(randomNft.getBreedFromModdedRng(100)).to.be.revertedWithCustomError(
                    randomNft,
                    "RandomIpfsNFT__RangeOutOfBounds"
                )
            })
        })

    })






