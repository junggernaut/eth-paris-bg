/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import axios from "axios";
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
  builderGardenContract = (await (
    await ethers.getContractFactory("BuilderGarden")
  ).attach("0x345d7C0c8564F44484456a2933eF23B8027a5919")) as BuilderGarden;

  console.log(await builderGardenContract.getBackerNumber());

  const user = {
    nickName: "seungan",
    walletAddress: "0x9ea091Ea7099441011e2e5247A0Fff48E9970aA1",
    userType: "builder",
    social: {
      twitter: "https://twitter.com/SeungAnJung",
    },
    pow: {
      github: "junggernaut",
    },
  };

  await axios.post("http://localhost:3000/user/", user);

  // const signupReciept = await (await builderGardenContract.connect(user1).builderSignUp("seungan")).wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log("error occur");
    console.error(error);
    process.exit(1);
  });
