/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";
import { ethers } from "hardhat";
import hre from "hardhat";

import { SponsorResolver } from "../typechain";

let deployer: SignerWithAddress;
let sponsorResolver: SponsorResolver;
const deployContract = async (contractName: string, signer: SignerWithAddress, args: unknown[] = []) => {
  const factory = await ethers.getContractFactory(contractName, signer);
  const contract = await factory.deploy(...args);
  await contract.deployTransaction.wait();
  return contract;
};

async function main() {
  [deployer] = await ethers.getSigners();

  const eas = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
  const sponsors = [
    "0xb0bD02F6a392aF548bDf1CfAeE5dFa0EefcC8EaB",
    "0xE9217BC70B7ED1f598ddD3199e80b093fA71124F",
    "0x7B7B957c284C2C227C980d6E2F804311947b84d0",
    "0x4d7c2d113906c73E69fDCA43C51B7619D2f283Bc",
    "0x8B0003B2AA1699Ca0Dd269ceda5bC26757a86FbC",
    "0x9DA239E509C0ECB7dc9d7401B61422Ec301ec868",
  ];
  const endTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

  sponsorResolver = (await deployContract("SponsorResolver", deployer, [eas, sponsors, endTime])) as SponsorResolver;
  console.log("sponsorResolver deployed to:", sponsorResolver.address);
  console.log(eas, sponsors, endTime);

  setTimeout(async () => {
    await hre.run(
      "verify:verify",
      {
        address: sponsorResolver.address,
        constructorArguments: [eas, sponsors, endTime],
      },
      [100000],
    );
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log("error occur");
    console.error(error);
    process.exit(1);
  });
