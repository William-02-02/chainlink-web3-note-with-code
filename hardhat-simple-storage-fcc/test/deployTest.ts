import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

// 可能有多个describe
describe("SimpleStorage", async () => {
  let simpleStorageFactory: SimpleStorage__factory,
    simpleStorage: SimpleStorage;
  // it是需要运行的操作  beforeEach会在每一个it执行前执行
  beforeEach(async () => {
    simpleStorageFactory = (await ethers.getContractFactory("SimpleStorage")) as unknown as SimpleStorage__factory;
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

  it("should update) as SimpleStorage__factory when we call store", async () => {
    const expectedValue = "7";
    const transactionResp = await simpleStorage.store(expectedValue);
    await transactionResp.wait(1);

    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  });
});
