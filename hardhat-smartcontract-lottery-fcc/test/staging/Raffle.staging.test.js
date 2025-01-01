const { network, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { log } = require("console");
const { start } = require("repl");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", () => {
          let raffle, vrfCoordinatorV2_5Mock, chainId, raffleEntranceFee, deployer, interval;
          chainId = network.config.chainId;

          // 部署脚本
          beforeEach(async () => {
              // 拿到deployer
              deployer = (await getNamedAccounts()).deployer;
              // staging运行在测试网上 不会需要运行部署了
              //   await deployments.fixture(["all"]);
              raffle = await ethers.getContract("Raffle", deployer);
              //   vrfCoordinatorV2_5Mock = await ethers.getContract("VRFCoordinatorV2_5Mock", deployer);
              raffleEntranceFee = await raffle.get_EntranceFee();
              //   interval = await raffle.get_Interval();
              // consumer
              const subscriptionId = await raffle.get_SubId();
              await vrfCoordinatorV2_5Mock.addConsumer(subscriptionId, raffle.target);
          });

          describe("fulfillRandomWords", function () {
              it("works with live chainlink keepers and vrf, we get a random winner", async () => {
                  // all we have to do is enterRaffle. chainlink do the rest
                  const startingTimeStamp = await raffle.get_LastTimestamp();
                  const accounts = await ethers.getSiners();

                  // setup the listener first(before enterRaffle)
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!");
                          try {
                              const recentWinner = await raffle.get_RecentWinner();
                              const raffleState = await raffle.get_RaffleState();
                              const winnerEndingBalance = await accounts[0].getBalance();
                              const endingTimeStamp = await raffle.get_LastTimestamp();

                              await expect(raffle.get_Players(0)).to.be.reverted;
                              assert.equal(raffleState.toString(), "0");
                              assert.equal(recentWinner.toString, accounts[0].address);
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString(),
                              );
                              assert(endingTimeStamp > startingTimeStamp);
                              resolve();
                          } catch (e) {
                              console.log(e);
                              rejectj(e);
                          }
                      });

                      await raffle.enterRaffle({ value: raffleEntranceFee });
                      const winnerStartingBalance = await accounts[0].getBalance();
                  });
              });
          });
      });
