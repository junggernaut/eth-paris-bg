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

  const deployContract = async (contractName: string, signer: SignerWithAddress, args: unknown[] = []) => {
    const factory = await ethers.getContractFactory(contractName, signer);
    const contract = await factory.deploy(...args);
    await contract.deployTransaction.wait();
    return contract;
  };

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

  console.log(
    "builderGardenContract:",
    builderGardenContract.address,
    "\nBuilderVaultFactory: ",
    builderVaultFactory.address,
    "\nBuilderVaultBeacon: ",
    builderVaultBeacon.address,
    "\nBuilderVaultImpl: ",
    builderVaultImpl.address,
    "\nBuilderGardenNft: ",
    builderGardenNft.address,
    "\nBuilderGardenTBARegistry: ",
    registryContract.address,
    "\nBuilderGardenTBA: ",
    tbaImpl.address,
    "\nALT: ",
    altContract.address,
  );

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // verify contracts
  await run("verify:verify", {
    address: builderGardenNft.address,
    constructorArguments: [],
  }).catch(error => console.log(error));

  await delay(5000);

  // verify contracts
  await run("verify:verify", {
    address: tbaImpl.address,
    constructorArguments: [],
  }).catch(error => console.log(error));

  await delay(5000);
  // verify contracts
  await run("verify:verify", {
    address: registryContract.address,
    constructorArguments: [],
  }).catch(error => console.log(error));

  await delay(5000);
  // verify contracts
  await run("verify:verify", {
    address: builderGardenContract.address,
    constructorArguments: [registryContract.address, builderGardenNft.address, tbaImpl.address],
  }).catch(error => console.log(error));

  await delay(5000);

  // verify contracts
  await run("verify:verify", {
    address: altContract.address,
    constructorArguments: ["test"],
  }).catch(error => console.log(error));

  await delay(5000); // verify contracts
  await run("verify:verify", {
    address: builderVaultImpl.address,
    constructorArguments: [builderGardenContract.address, altContract.address],
  }).catch(error => console.log(error));

  await delay(5000); // verify contracts
  await run("verify:verify", {
    address: builderVaultBeacon.address,
    constructorArguments: [builderVaultImpl.address],
  }).catch(error => console.log(error));

  await delay(5000);

  await run("verify:verify", {
    address: builderVaultFactory.address,
    constructorArguments: [builderVaultBeacon.address, registryContract.address],
  }).catch(error => console.log(error));

  await delay(5000);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log("error occur");
    console.error(error);
    process.exit(1);
  });
