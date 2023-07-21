/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import axios from "axios";
import { assert, expect } from "chai";
import { BigNumber, Event } from "ethers";
import { ethers, run } from "hardhat";

import {
  BuilderGarden,
  BuilderGardenNft,
  BuilderGardenTBA,
  BuilderGardenTBARegistry,
  BuilderVaultBeacon,
  BuilderVaultFactory,
  BuilderVaultImpl,
} from "../typechain";

const deployContract = async (contractName: string, signer: SignerWithAddress, args: unknown[] = []) => {
  const factory = await ethers.getContractFactory(contractName, signer);
  const contract = await factory.deploy(...args);
  await contract.deployTransaction.wait();
  return contract;
};

describe("initTest", function () {
  let mainDeployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user1Tba: BuilderGardenTBA;
  let user2: SignerWithAddress;
  let user2Tba: BuilderGardenTBA;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;

  let builderGardenNft: BuilderGardenNft;
  let registryContract: BuilderGardenTBARegistry;
  let tbaImpl: BuilderGardenTBA;

  let builderGardenContract: BuilderGarden;

  let builderVaultImpl: BuilderVaultImpl;
  let builderVaultBeacon: BuilderVaultBeacon;
  let builderVaultFactory: BuilderVaultFactory;

  before(async () => {
    [mainDeployer, user1, user2, user3, user4] = await ethers.getSigners();
    console.log(
      "mainDeployer:",
      mainDeployer.address,
      "\nuser1:",
      user1.address,
      "\nuser2: ",
      user2.address,
      "\nuser3",
      user3.address,
      "\n",
    );

    builderGardenNft = (await deployContract("BuilderGardenNft", mainDeployer)) as BuilderGardenNft;
    tbaImpl = (await deployContract("BuilderGardenTBA", mainDeployer)) as BuilderGardenTBA;
    registryContract = (await deployContract("BuilderGardenTBARegistry", mainDeployer, [
      builderGardenNft.address,
      tbaImpl.address,
    ])) as BuilderGardenTBARegistry;

    builderGardenContract = (await deployContract("BuilderGarden", mainDeployer, [
      registryContract.address,
      builderGardenNft.address,
    ])) as BuilderGarden;
    await (await builderGardenNft.setBuilderGardenContract(builderGardenContract.address)).wait();

    builderVaultImpl = (await deployContract("BuilderVaultImpl", mainDeployer)) as BuilderVaultImpl;
    builderVaultBeacon = (await deployContract("BuilderVaultBeacon", mainDeployer, [
      builderVaultImpl.address,
    ])) as BuilderVaultBeacon;
    builderVaultFactory = (await deployContract("BuilderVaultFactory", mainDeployer, [
      builderVaultBeacon.address,
    ])) as BuilderVaultFactory;

    console.log("builderGardenNft:", builderGardenNft.address);
  });

  it("user1 as builder", async function () {
    const signupReciept = await (await builderGardenContract.connect(user1).builderSignUp()).wait();
    if (signupReciept.events) {
      const event = signupReciept.events.find(e => e.event === "SignUp") as Event;
      if (event.args) {
        user1Tba = (await ethers.getContractFactory("BuilderGardenTBA")).attach(event.args.tba) as BuilderGardenTBA;
        expect(await user1Tba.owner()).to.equal(user1.address);
        expect(event.args.tokenId).to.equal(1);
      } else {
        assert(false, "no args of event");
      }
    } else {
      assert(false, "no event occur");
    }
    expect(await builderGardenNft.balanceOf(user1.address)).to.equal(1);
  });

  it("user2 as backer", async function () {
    const signupReciept = await (await builderGardenContract.connect(user2).backerSignUp()).wait();
    if (signupReciept.events) {
      const event = signupReciept.events.find(e => e.event === "SignUp") as Event;
      if (event.args) {
        user2Tba = (await ethers.getContractFactory("BuilderGardenTBA")).attach(event.args.tba) as BuilderGardenTBA;
        expect(await user2Tba.owner()).to.equal(user2.address);
        expect(event.args.tokenId).to.equal(2);
      } else {
        assert(false, "no args of event");
      }
    } else {
      assert(false, "no event occur");
    }
    expect(await builderGardenNft.balanceOf(user2.address)).to.equal(1);
  });
});
