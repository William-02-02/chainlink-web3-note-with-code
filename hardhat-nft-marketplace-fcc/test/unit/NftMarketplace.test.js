const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config.js")
const { network, ethers, deployments, getNamedAccounts } = require("hardhat")
const { deploy } = require("@nomicfoundation/ignition-core")
const { log } = require("console")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplace test", () => {
        let BasicNFT, NftMarketplaceContract, signers, deployer, player
        const Price = ethers.parseEther("0.1")
        const TokenId = 0

        beforeEach(async () => {
            signers = await ethers.getSigners()
            player = signers[1]
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            NftMarketplaceContract = await ethers.getContract("NftMarketplace")
            BasicNFT = await ethers.getContract("BasicNFT")
            await BasicNFT.mintNFT()
            await BasicNFT.approve(NftMarketplaceContract.target, TokenId)
        })

        describe("NftMarketplace List", () => {
            it("lists and can be bought", async function () {
                await NftMarketplaceContract.listNft(BasicNFT.target, TokenId, Price)
                const playerContract = await NftMarketplaceContract.connect(player)
                await playerContract.buyNft(BasicNFT.target, TokenId, { value: Price })
                const newOwner = await BasicNFT.ownerOf(TokenId)
                const deplyerBalance = await NftMarketplaceContract.getBalance(deployer)
                assert.equal(newOwner.toString(), player.address)
                assert.equal(deplyerBalance.toString(), Price.toString())
            })

            it("lists revert no price", async () => {
                await NftMarketplaceContract.getListing(BasicNFT.target, TokenId)
                await expect(NftMarketplaceContract.listNft(BasicNFT.target, TokenId, "0"))
                    .to.be.revertedWithCustomError(NftMarketplaceContract, "NftMarketplace__PriceMustBeGreaterThanZero")
            })

            it("already listed", async function () {
                await NftMarketplaceContract.listNft(BasicNFT.target, TokenId, Price)
                await expect(NftMarketplaceContract.listNft(BasicNFT.target, TokenId, Price))
                .to.be.revertedWithCustomError(NftMarketplaceContract, "NftMarketplace__AlreadyListed")
                .withArgs(BasicNFT.target, TokenId)
            })
        })

        describe("NftMarketplace cancelListing", () => {
            it("cancelListing", async () => {
                await NftMarketplaceContract.listNft(BasicNFT.target, TokenId, Price)
                await NftMarketplaceContract.cancelListing(BasicNFT.target, TokenId)
                const playerContract = await NftMarketplaceContract.connect(player)
                await expect(playerContract.buyNft(BasicNFT.target, TokenId, { value: Price }))
                    .to.be.revertedWithCustomError(
                        NftMarketplaceContract,
                        "NftMarketplace__NotListed"
                    ).withArgs(BasicNFT.target, TokenId)

            })
        })

        describe("NftMarketplace updateListing", () => {
            it("updateListing", async () => {
                const newPrice = ethers.parseEther("0.2")
                await NftMarketplaceContract.listNft(BasicNFT.target, TokenId, Price)
                await NftMarketplaceContract.updateListing(BasicNFT.target, TokenId, newPrice)
                const playerContract = await NftMarketplaceContract.connect(player)
                await expect(playerContract.buyNft(BasicNFT.target, TokenId, { value: Price }))
                    .to.be.revertedWithCustomError(
                        NftMarketplaceContract,
                        "NftMarketplace__PriceNotMet"
                    ).withArgs(BasicNFT.target, TokenId, newPrice)

            })
        })

        describe("NftMarketplace withdrawBalance", () => {
            it("withdrawBalance", async () => {
                await NftMarketplaceContract.listNft(BasicNFT.target, TokenId, Price)
                const playerContract = await NftMarketplaceContract.connect(player)
                await playerContract.buyNft(BasicNFT.target, TokenId, { value: Price })
                const deployerBalanceBefore = await ethers.provider.getBalance(deployer)
                const txResponse = await NftMarketplaceContract.withdrawBalance()
                const txReceipt = await txResponse.wait(1)
                const { gasUsed, gasPrice } = txReceipt
                const gasCost = gasUsed * gasPrice
                const deployerBalanceAfter = await ethers.provider.getBalance(deployer)
                assert.equal(
                    deployerBalanceAfter - deployerBalanceBefore + gasCost,
                    Price
                )
            })

            it("no balacne", async () => {
                await expect(NftMarketplaceContract.withdrawBalance())
                .to.be.revertedWithCustomError(NftMarketplaceContract, "NftMarketplace__NoBalanceToWithdraw")
            })

            it("not owner", async () => {
                
                await expect(NftMarketplaceContract.withdrawBalance())
                .to.be.revertedWithCustomError(NftMarketplaceContract, "NftMarketplace__NoBalanceToWithdraw")
            })
        })


    })