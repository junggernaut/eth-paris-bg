/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import axios from "axios";
import { assert, expect } from "chai";
import { BigNumber, Event } from "ethers";
import { ethers, run } from "hardhat";

import {
  ALT,
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
  let user3Tba: BuilderGardenTBA;
  let user4: SignerWithAddress;

  let user1FundingVault: BuilderVaultImpl;

  let builderGardenNft: BuilderGardenNft;
  let registryContract: BuilderGardenTBARegistry;
  let tbaImpl: BuilderGardenTBA;

  let builderGardenContract: BuilderGarden;

  let builderVaultImpl: BuilderVaultImpl;
  let builderVaultBeacon: BuilderVaultBeacon;
  let builderVaultFactory: BuilderVaultFactory;

  let altContract: ALT;

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
    registryContract = (await deployContract("BuilderGardenTBARegistry", mainDeployer)) as BuilderGardenTBARegistry;
    builderGardenContract = (await deployContract("BuilderGarden", mainDeployer, [
      registryContract.address,
      builderGardenNft.address,
      tbaImpl.address,
    ])) as BuilderGarden;
    await (
      await builderGardenNft.setTBAInfo(builderGardenContract.address, registryContract.address, tbaImpl.address)
    ).wait();

    altContract = (await deployContract("ALT", mainDeployer, ["test"])) as ALT;

    builderVaultImpl = (await deployContract("BuilderVaultImpl", mainDeployer, [
      builderGardenContract.address,
      altContract.address,
    ])) as BuilderVaultImpl;
    builderVaultBeacon = (await deployContract("BuilderVaultBeacon", mainDeployer, [
      builderVaultImpl.address,
    ])) as BuilderVaultBeacon;
    builderVaultFactory = (await deployContract("BuilderVaultFactory", mainDeployer, [
      builderVaultBeacon.address,
      registryContract.address,
    ])) as BuilderVaultFactory;

    console.log("builderGardenNft:", builderGardenNft.address);
  });

  it("builder: user1 signUp", async function () {
    const signupReciept = await (await builderGardenContract.connect(user1).builderSignUp("seungan")).wait();
    if (signupReciept.events) {
      const event = signupReciept.events.find(e => e.event === "SignUp") as Event;
      if (event.args) {
        user1Tba = (await ethers.getContractFactory("BuilderGardenTBA")).attach(event.args.tba) as BuilderGardenTBA;
        expect(await user1Tba.owner()).to.equal(user1.address);
        expect(event.args.tokenId).to.equal(1);
        expect(event.args.userType).to.equal(0);
      } else {
        assert(false, "no args of event");
      }
    } else {
      assert(false, "no event occur");
    }
    expect(await builderGardenNft.balanceOf(user1.address)).to.equal(1);
  });

  it("backer: user2 signUp", async function () {
    const signupReciept = await (await builderGardenContract.connect(user2).backerSignUp("gunwoo")).wait();
    if (signupReciept.events) {
      const event = signupReciept.events.find(e => e.event === "SignUp") as Event;
      if (event.args) {
        user2Tba = (await ethers.getContractFactory("BuilderGardenTBA")).attach(event.args.tba) as BuilderGardenTBA;
        expect(await user2Tba.owner()).to.equal(user2.address);
        expect(event.args.tokenId).to.equal(2);
        expect(event.args.userType).to.equal(1);
      } else {
        assert(false, "no args of event");
      }
    } else {
      assert(false, "no event occur");
    }
    expect(await builderGardenNft.balanceOf(user2.address)).to.equal(1);
    expect(await builderGardenContract.getTBAAddress(user2.address)).to.equal(user2Tba.address);
    //user3 as backer with same logic
    const signupReciept2 = await (await builderGardenContract.connect(user3).backerSignUp("jooho")).wait();
    if (signupReciept2.events) {
      const event = signupReciept2.events.find(e => e.event === "SignUp") as Event;
      if (event.args) {
        user3Tba = (await ethers.getContractFactory("BuilderGardenTBA")).attach(event.args.tba) as BuilderGardenTBA;
      }
    }
  });

  it("user1(builder) create funding", async function () {
    const fundingConfig = {
      totalAmount: ethers.utils.parseEther("1"),
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      title: "fund for seungan",
    };
    const receipt = await (await builderVaultFactory.connect(user1).deployVault(fundingConfig)).wait();

    if (receipt.events) {
      const event = receipt.events.find(e => e.event === "VaultCreated") as Event;
      if (event.args) {
        user1FundingVault = (await ethers.getContractFactory("BuilderVaultImpl")).attach(
          event.args.vault,
        ) as BuilderVaultImpl;
        expect(await user1FundingVault.owner()).to.equal(user1.address);
      } else {
        assert(false, "no args of event");
      }
    } else {
      assert(false, "no event occur");
    }
  });

  it("user2, 3(backer) fund to user1(builder)", async function () {
    await (await user1FundingVault.connect(user2).fund(10, { value: ethers.utils.parseEther("0.5") })).wait();
    await (await user1FundingVault.connect(user3).fund(10, { value: ethers.utils.parseEther("0.5") })).wait();
    expect((await user1FundingVault.getFundedInfo())[1]).to.equal(ethers.utils.parseEther("1"));
  });

  it("user1(builder) claim funded Token", async function () {
    await user1FundingVault.connect(user1).claim();
    expect(await user1FundingVault.isClaimed()).to.equal(true);
    expect(await altContract.balanceOf(user1Tba.address, 1)).to.equal(20);
    expect(await altContract.balanceOf(user2Tba.address, 2)).to.equal(10);
    expect(await altContract.balanceOf(user3Tba.address, 2)).to.equal(10);
  });
});
