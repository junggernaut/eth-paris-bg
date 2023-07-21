// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../interfaces/IBuilderVaultBeacon.sol";
import "./BuilderVaultImpl.sol";
import "../interfaces/IBuilderGardenTBARegistry.sol";

contract BuilderVaultFactory {
  struct FundingConfig {
    uint256 totalAmount;
    uint256 deadline;
  }

  IBuilderVaultBeacon immutable beacon;
  IBuilderGardenTBARegistry private builderGardenTBARegistry;

  constructor(address _beacon, address _builderGardenTBARegistry) {
    beacon = IBuilderVaultBeacon(_beacon);
    builderGardenTBARegistry = IBuilderGardenTBARegistry(_builderGardenTBARegistry);
  }

  event VaultCreated(address builder, address vault);

  function deployVault(FundingConfig calldata fundingConfig) external {
    address newVault = beacon.deployProxy();
    BuilderVaultImpl(newVault).initialize(msg.sender, fundingConfig.totalAmount, fundingConfig.deadline);
    emit VaultCreated(msg.sender, newVault);
  }
}
