/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import axios from "axios";
import { randomBytes } from "crypto";
import { BN, ecsign, keccakFromString, toRpcSig } from "ethereumjs-util";
import { ethers, run } from "hardhat";
import * as secp256k1 from "secp256k1";

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
let user2FundingVault: BuilderVaultImpl;

let builderGardenNft: BuilderGardenNft;
let registryContract: BuilderGardenTBARegistry;
let tbaImpl: BuilderGardenTBA;

let builderGardenContract: BuilderGarden;

let builderVaultImpl: BuilderVaultImpl;
let builderVaultBeacon: BuilderVaultBeacon;
let builderVaultFactory: BuilderVaultFactory;

let altContract: ALT;

async function personalSign(message: Buffer, privateKey: Buffer): Promise<Buffer> {
  const messageHash = keccakFromString(`\x19Ethereum Signed Message:\n${message.length}${message}`, 256);
  const signature = ecsign(messageHash, privateKey);
  return Buffer.from(toRpcSig(signature.v, signature.r, signature.s).slice(2), "hex");
}

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

  // const msg = randomBytes(32);
  // let privKey;
  // do {
  //   privKey = randomBytes(32);
  // } while (!secp256k1.privateKeyVerify(privKey));

  // const pubKey = secp256k1.publicKeyCreate(privKey);
  // const pubkeyHex = Buffer.from(pubKey).toString("hex");
  // const privkeyHex = privKey.toString("hex");
  // console.log(pubkeyHex, "\n", privkeyHex);

  // const res = await axios.post("https://proof-service.next.id/v1/proof/payload", {
  //   action: "create",
  //   platform: "twitter",
  //   identity: "SeungAnJung",
  //   public_key: pubkeyHex,
  // });

  // console.log(res.data);

  // const message = Buffer.from(res.data.sign_payload);
  // const secretKey = Buffer.from(privkeyHex, "hex");
  // const signature = await personalSign(message, secretKey);
  // const signatureString = signature.toString("base64");
  // console.log(signatureString);

  // const location = "1682520456652283905";
  // const uuid = "e8b9d935-3498-4e8a-b918-e0184ce02ce9";
  // const created_at = "1689979023";
  // await axios.post("https://proof-service.next.id/v1/proof", {
  //   action: "create",
  //   platform: "twitter",
  //   identity: "SeungAnJung",
  //   public_key: "029155ca00b9185656dc880489edc7f32023f835e91e1d279ddb07bb4278a64842",
  //   proof_location: location,
  //   extra: {},
  //   uuid,
  //   created_at,
  // });

  // const res1 = await axios.get("https://proof-service.next.id/v1/proof?platform=twitter&identity=SeungAnJung");
  // console.log(res1.data.ids[0].proofs);

  // const msg = randomBytes(32);
  // let privKey;
  // do {
  //   privKey = randomBytes(32);
  // } while (!secp256k1.privateKeyVerify(privKey));

  // const pubKey = secp256k1.publicKeyCreate(privKey);
  // const pubkeyHex = Buffer.from(pubKey).toString("hex");
  // const privkeyHex = privKey.toString("hex");
  // console.log(pubkeyHex, "\n", privkeyHex);

  // const res = await axios.post("https://proof-service.next.id/v1/proof/payload", {
  //   action: "create",
  //   platform: "ethereum",
  //   identity: "0xA29B144A449E414A472c60C7AAf1aaFfE329021D",
  //   public_key: pubkeyHex,
  // });

  // console.log(res.data);

  // const message = Buffer.from(res.data.sign_payload);
  // const secretKey = Buffer.from(privkeyHex, "hex");
  // const signatureSp = await personalSign(message, secretKey);
  // const signatureSw = await mainDeployer.signMessage(message);
  // console.log(signatureSw, signatureSw.slice(2));
  // console.log(Buffer.from(signatureSw.slice(2), "hex"));

  // await axios.post("https://proof-service.next.id/v1/proof", {
  //   action: "create",
  //   platform: "ethereum",
  //   identity: mainDeployer.address,
  //   public_key: pubkeyHex,
  //   extra: {
  //     signature: signatureSp.toString("base64"),
  //     wallet_signature: Buffer.from(signatureSw.slice(2), "hex").toString("base64"),
  //   },
  //   uuid: res.data.uuid,
  //   created_at: res.data.created_at,
  // });

  const res1 = await axios.get(
    "https://proof-service.next.id/v1/proof?platform=ethereum&identity=0xA29B144A449E414A472c60C7AAf1aaFfE329021D",
  );
  console.log(res1.data, res1.data.ids[0].proofs);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log("error occur");
    console.error(error);
    process.exit(1);
  });
