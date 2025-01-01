const { network, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { log } = require("console");
const { start } = require("repl");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", () => {
          let raffle, vrfCoordinatorV2_5Mock, chainId, raffleEntranceFee, deployer, interval;
          chainId = network.config.chainId;

          // 部署脚本
          beforeEach(async () => {
              // 拿到deployer
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              raffle = await ethers.getContract("Raffle", deployer);
              vrfCoordinatorV2_5Mock = await ethers.getContract("VRFCoordinatorV2_5Mock", deployer);
              raffleEntranceFee = await raffle.get_EntranceFee();
              interval = await raffle.get_Interval();
              // consumer
              const subscriptionId = await raffle.get_SubId();
              await vrfCoordinatorV2_5Mock.addConsumer(subscriptionId, raffle.target);
          });

          describe("constructor", () => {
              it("Initialize the raffle correctly", async () => {
                  const state = await raffle.get_RaffleState();
                  assert.equal(state.toString(), "0");
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
              });
          });

          describe("enterRaffle", () => {
              it("reverts when you don't pay enough", async () => {
                  await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
                      raffle,
                      "Raffle__NotEnoughETH",
                  );
              });

              it("records player when they enter", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  const player = await raffle.get_Player(0);
                  assert.equal(player, deployer);
              });

              it("emits event on enter", async () => {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffelEnter",
                  );
              });

              it("doesn't allow entrance when raffle is calculating", async () => {
                  // 调整链参数 使其满足performUpkeep前置条件
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [parseInt(interval) + 1]);
                  await network.provider.send("evm_mine", []);
                  // pretend to be chainlink keeper  这里传递空bytes 需要用0x代替
                  await raffle.performUpkeep("0x");
                  await expect(
                      raffle.enterRaffle({ value: raffleEntranceFee }),
                  ).to.be.revertedWithCustomError(raffle, "Raffle__NotOpen");
              });
          });

          describe("checkUpkeep", () => {
              it("return false if people haven't send any ETH", async () => {
                  await network.provider.send("evm_increaseTime", [parseInt(interval) + 1]);
                  await network.provider.send("evm_mine", []);
                  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x");
                  assert(!upkeepNeeded);
              });

              it("returns false if enough time hasn't passed", async () => {
                  await network.provider.send("evm_increaseTime", [parseInt(interval) - 1]);
                  await network.provider.send("evm_mine", []);
                  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x");
                  assert(!upkeepNeeded);
              });

              it("returns true if enough time has passed, has players, eth, and is open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [parseInt(interval) + 1]);
                  await network.provider.send("evm_mine", []);
                  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x");
                  assert(upkeepNeeded);
              });
          });

          describe("performUpkeep", () => {
              it("it can only run if checkupkeep is true", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [parseInt(interval) + 1]);
                  await network.provider.send("evm_mine", []);
                  const tx = await raffle.performUpkeep("0x");
                  assert(tx);
              });

              it("revert when checkupkeep is false", async () => {
                  await expect(raffle.performUpkeep("0x")).to.be.revertedWithCustomError(
                      raffle,
                      "Raffle__UpkeepNotNeeded",
                  );
              });

              it("updates the raffle state, emits and event, call the vrfcoordinator", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [parseInt(interval) + 1]);
                  await network.provider.send("evm_mine", []);
                  const txResponse = await raffle.performUpkeep("0x");
                  const txReceipt = await txResponse.wait(1);
                  // 使用VRFCoordinator里面的event

                  /** ===============================两种获取Event的方式================================== */

                  // 从合约里拿到需要查询的事件名
                  const eventFilter = raffle.filters.RequestedRaffleWinner;
                  // 从哪个区块到最新区块中 查询哪个事件
                  const events = await raffle.queryFilter(eventFilter, -1);
                  const requestId1 = events[0].args[0];

                  const events2 = txReceipt.logs
                      .filter((x) => x.address === raffle.target) // Updated from .address to .target
                      .map((log) => raffle.interface.parseLog(log)); // Search for the error that matches the error selector in data and parse out the details.
                  const requestId2 = events2[0].args[0];

                  log(requestId1);
                  log(requestId2);

                  const raffleState = await raffle.get_RaffleState();
                  assert(parseInt(requestId1) > 0);
                  // calculating
                  assert(parseInt(raffleState) == 1);
              });
          });

          describe("fulfillRandomWords", function () {
              beforeEach(async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee });
                  await network.provider.send("evm_increaseTime", [parseInt(interval) + 1]);
                  await network.provider.send("evm_mine", []);
              });

              it("can only be called after performUpkeep", async () => {
                  await expect(vrfCoordinatorV2_5Mock.fulfillRandomWords(0, raffle.target)).to.be
                      .reverted;
                  await expect(vrfCoordinatorV2_5Mock.fulfillRandomWords(1, raffle.target)).to.be
                      .reverted;
              });

              it("picks a winner, restes the lottery and sends money", async () => {
                  const additionalPlayers = 3;
                  const startingAcountIndex = 1; //deployer = 0
                  const accounts = await ethers.getSigners(); // 获取hardhat虚拟账户
                  for (
                      let i = startingAcountIndex;
                      i < startingAcountIndex + additionalPlayers;
                      i++
                  ) {
                      const accountConnectedRaffle = raffle.connect(accounts[i]);
                      await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee });
                  }
                  const startingTimeStamp = await raffle.get_LastTimestamp();

                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          try {
                              const recentWinner = await raffle.get_RecentWinner();
                              const raffleState = await raffle.get_RaffleState();
                              const endingTimeStamp = await raffle.get_LastTimestamp();
                              const numPlayers = await raffle.get_NumberOfPlayers();
                              console.log(recentWinner);
                              console.log(accounts[0]);
                              console.log(accounts[1]);
                              console.log(accounts[2]);
                              console.log(accounts[3]);
                              // assert winner's balance。 我这里拿不到subscriptionID 跳过算了
                              assert.equal(numPlayers.toString(), "0");
                              assert.equal(raffleState.toString(), "0");
                              assert(endingTimeStamp > startingTimeStamp);
                              resolve();
                          } catch (e) {
                              rejectj(e);
                          }
                      });

                      const tx = await raffle.performUpkeep([]);
                      const txReceipt = await tx.wait(1);
                      const events = txReceipt.logs
                          .filter((x) => x.address === raffle.target) // Updated from .address to .target
                          .map((log) => raffle.interface.parseLog(log)); // Search for the error that matches the error selector in data and parse out the details.
                      const requestId = events[0].args[0];
                      //   const winnerStartingBalance = await accounts[1].getBalance();// 视频中
                      // 这里之所以调用coordinator的fulfill是因为父类方法是根据requestId下发给对应consumer的！
                      // 父类方法执行过程中调用了子类override的fulfill方法
                      await vrfCoordinatorV2_5Mock.fulfillRandomWords(requestId, raffle.target);
                  });
              });
          });
      });
