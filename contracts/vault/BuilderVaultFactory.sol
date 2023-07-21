// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../interfaces/IBuilderVaultBeacon.sol";

contract BuilderVaultFactory {
  IBuilderVaultBeacon immutable beacon;

  constructor(address _beacon) {
    beacon = IBuilderVaultBeacon(_beacon);
  }

  event VaultCreated(address builder, address vault);

  function deployVault() external {
    address newVault = beacon.deployProxy();
    // newVault.initialize
    emit VaultCreated(msg.sender, newVault);
  }
}
