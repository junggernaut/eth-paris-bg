// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IBuilderVaultBeacon {
  function getImplAddress() external view returns (address);

  function deployProxy() external returns (address);
}
