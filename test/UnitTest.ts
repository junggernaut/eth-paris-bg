/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import axios from "axios";
import { assert, expect } from "chai";
import { BigNumber, Event } from "ethers";
import { ethers, run } from "hardhat";

describe("initTest", function () {
  before(async () => {
    console.log("init");
  });

  it("Test1", async () => {
    console.log("hi");
  });
  it("test initial value", async function () {
    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();
    await storage.deployed();
    console.log("storage deployed at:" + storage.address);
    expect((await storage.retrieve()).toNumber()).to.equal(0);
  });
  it("test updating and retrieving updated value", async function () {
    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();
    await storage.deployed();
    const storage2 = await ethers.getContractAt("Storage", storage.address);
    const setValue = await storage2.store(56);
    await setValue.wait();
    expect((await storage2.retrieve()).toNumber()).to.equal(56);
  });
});
