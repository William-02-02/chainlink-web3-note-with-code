const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

// 可能有多个describe
describe("SimpleStorage", async () => {
  let simpleStorageFactory, simpleStorage;
  // it是需要运行的操作  beforeEach会在每一个it执行前执行
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with favorite number 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    //assert
    //expect 功能一致
    assert.equal(currentValue.toString(), expectedValue);
    //expect(currentValue.toString()).to.equal(expectedValue);
  });

  it("should update when we call store", async () => {
    const expectedValue = "7";
    const transactionResp = await simpleStorage.store(expectedValue);
    await transactionResp.wait(1);

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  });
});
