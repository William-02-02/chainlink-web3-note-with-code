const { expect, assert } = require("chai")
const { network, deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNFT", () => {
        let basicNFT, deployer

        beforeEach(async () => {
            //deploy
            await deployments.fixture(["basicNFT"])
            // signer = await ethers.getSigners();
            deployer = (await getNamedAccounts()).deployer
            // console.log(signer); // 这两个都是返回的signer对象
            // console.log(deployer);
            basicNFT = await ethers.getContract("BasicNFT", deployer)
        })

        describe("Contructor", () => {
            it("s_tokenCounter Should start at 0", async () => {
                const name = await basicNFT.name()
                const symbol = await basicNFT.symbol()
                const tokenCounter = await basicNFT.getTokenCounter()
                assert.equal(tokenCounter.toString(), "0")
                assert.equal(name, "Doggie")
                assert.equal(symbol, "DOG")
            })
        })

        describe("mintNFT", () => {
            beforeEach(async () => {
                const tx = await basicNFT.mintNFT()
                await tx.wait(1)
            })

            it("Allows users to mint NFTs, updates appropriately", async () => {
                const tokenURI = await basicNFT.tokenURI(0)
                const tokenCounter = await basicNFT.getTokenCounter()
                assert.equal(tokenURI.toString(), await basicNFT.TOKEN_URI())
                assert.equal(tokenCounter.toString(), "1")
            })

            it("show the correct owner of the NFT", async () => {
                const owner = await basicNFT.ownerOf("0")
                const balance = await basicNFT.balanceOf(deployer)

                assert.equal(owner, deployer)
                assert.equal(balance.toString(), "1")
            })
        })


    });










