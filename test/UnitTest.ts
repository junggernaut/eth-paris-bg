/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import axios from "axios";
import { assert, expect } from "chai";
import { BigNumber, Event } from "ethers";
import { ethers, run } from "hardhat";

import { ERC6551Account, ERC6551Registry, MyNFT } from "../typechain";

const deployContract = async (contractName: string, signer: SignerWithAddress, args: unknown[] = []) => {
  const factory = await ethers.getContractFactory(contractName, signer);
  const contract = await factory.deploy(...args);
  await contract.deployTransaction.wait();
  return contract;
};

describe("initTest", function () {
  let mainDeployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;

  let testNftContract: MyNFT;
  let registryContract: ERC6551Registry;
  let accountContract: ERC6551Account;

  before(async () => {
    [mainDeployer, user1, user2, user3, user4] = await ethers.getSigners();

    testNftContract = (await deployContract("myNFT", mainDeployer)) as MyNFT;
    await (await testNftContract.safeMint(user1.address, 1)).wait();

    console.log(await testNftContract.balanceOf(user1.address));

    registryContract = (await deployContract("ERC6551Registry", mainDeployer)) as ERC6551Registry;

    accountContract = (await deployContract("ERC6551Account", mainDeployer)) as ERC6551Account;
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
