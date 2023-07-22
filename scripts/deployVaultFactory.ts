/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
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

const deployContract = async (contractName: string, signer: SignerWithAddress, args: unknown[] = []) => {
  const factory = await ethers.getContractFactory(contractName, signer);
  const contract = await factory.deploy(...args);
  await contract.deployTransaction.wait();
  return contract;
};

async function main() {
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

  builderVaultFactory = (await deployContract("BuilderVaultFactory", mainDeployer, [
    "0x71FA6902fc9607c881D9F915d67E23B3dDB07214",
    "0x7552ca49b1a4734D53EBB45962788c6DFD2ceae3",
  ])) as BuilderVaultFactory;
  console.log("builderVaultFactory deployed to:", builderVaultFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log("error occur");
    console.error(error);
    process.exit(1);
  });
