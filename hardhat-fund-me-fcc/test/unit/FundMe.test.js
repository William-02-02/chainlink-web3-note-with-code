const { expect, assert } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const {
  developementChains,
  developmentChains,
} = require("../../helper-hardhat-config");

// 只有在本地测试时使用
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let deployer;
      const sendValue = ethers.parseEther("1");
      beforeEach(async () => {
        // 从配置文件里拿到namedAccounts 获取自己定义的 deployer 获取harhat网络的指定下标的账号
        deployer = (await getNamedAccounts()).deployer;
        // 注意这个是批量部署  是deployments！ 使用tag批量部署
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
          const resp = await fundMe.get_priceFeed();
          // 注意 这里拿到的合约对象地址更新成了 target里面
          assert.equal(resp, mockV3Aggregator.target);
        });
      });

      describe("fund", function () {
        it("Fails if you don't send enough ETH", async () => {
          await expect(fundMe.fund()).to.be.revertedWith("not enough!");
        });

        it("Updates the abount funded data structure", async () => {
          await fundMe.fund({ value: sendValue });
          const resp = await fundMe.get_addressToFund(deployer);
          assert.equal(resp, sendValue);
        });

        it("Add funder to array of funders", async () => {
          await fundMe.fund({ value: sendValue });
          const funderAddress = await fundMe.get_funders(0);
          assert.equal(funderAddress, deployer);
        });
      });

      describe("withdraw", function () {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });

        // 测试代码的编写逻辑 Arrange  Act  Assert
        it("withdraws ETH from a single funder", async () => {
          // Arrange
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          // 从收据中拿到gas数据
          const { gasUsed, gasPrice } = await transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            (startingFundMeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );

          await fundMe.withdraw();
          assert.equal();
        });

        it("it allow us to withdraw with multiple funders", async () => {
          // Arrange
          // 多用户连接合约转账
          const accounts = await ethers.getSigners();
          for (index = 0; index < 6; index++) {
            const fundMeConnectedContract = await fundMe.connect(
              accounts[index]
            );
            await fundMeConnectedContract.fund({ value: sendValue });
          }

          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundMe.withdraw();
          // const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          // 从收据中拿到gas数据
          const { gasUsed, gasPrice } = await transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            (startingFundMeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );
          await expect(fundMe.get_funders(0)).to.be.reverted;

          for (let index = 0; index < 6; index++) {
            assert.equal(
              await fundMe.get_addressToFund(accounts[index].address),
              0
            );
          }
        });

        it("it allow us to cheaperWithdraw with multiple funders", async () => {
          // Arrange
          // 多用户连接合约转账
          const accounts = await ethers.getSigners();
          for (index = 0; index < 6; index++) {
            const fundMeConnectedContract = await fundMe.connect(
              accounts[index]
            );
            await fundMeConnectedContract.fund({ value: sendValue });
          }

          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Act
          // const transactionResponse = await fundMe.withdraw();
          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          // 从收据中拿到gas数据
          const { gasUsed, gasPrice } = await transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            (startingFundMeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );
          await expect(fundMe.get_funders(0)).to.be.reverted;

          for (let index = 0; index < 6; index++) {
            assert.equal(
              await fundMe.get_addressToFund(accounts[index].address),
              0
            );
          }
        });

        it("Only allow the owner to withdraw", async () => {
          // 拿非创建者账号调用withdraw
          const accounts = await ethers.getSigners();
          const connectedFundMe = await fundMe.connect(accounts[1]);
          await expect(
            connectedFundMe.withdraw()
          ).to.be.revertedWithCustomError(connectedFundMe, "FUNDME__NotOwner");
          // 新版chai用法
        });
      });
    });
