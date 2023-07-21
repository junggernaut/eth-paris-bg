// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../interfaces/IBuilderVaultBeacon.sol";
import "./BuilderVaultImpl.sol";

contract BuilderVaultFactory {
  struct FundingConfig {
    uint256 amount;
    uint256 deadline;
  }

  IBuilderVaultBeacon immutable beacon;

  constructor(address _beacon) {
    beacon = IBuilderVaultBeacon(_beacon);
  }

  event VaultCreated(address builder, address vault);

  function deployVault(FundingConfig calldata fundingConfig) external {
    address newVault = beacon.deployProxy();
    BuilderVaultImpl(newVault).initialize(msg.sender, fundingConfig.amount, fundingConfig.deadline);
    emit VaultCreated(msg.sender, newVault);
  }
}
