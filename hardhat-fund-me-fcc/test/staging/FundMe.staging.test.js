const { assert } = require("console");
const { developmentChains } = require("../../helper-hardhat-config");
const { network, getNamedAccounts, ethers } = require("hardhat");

developmentChains.includes(network.name) ? describe.skip : describe(
    "FundMe", async () => {
        
        let fundMe;
        let deployer;
        const sendValue = ethers.parseEther("1")
        beforeEach(async () => {
            deployer = (await getNamedAccounts).deployer;
            fundMe = ethers.getContract("fundMe", deployer)
        })
        it("allows people to fund and withdraw", async () => {
            await fundMe.fund({value: sendValue})
            await fundMe.withdraw()
            assert.equal(
                (await ethers.provider.getBalance(fundMe.target)).toString(), "0"
            )
        })
    }
);
