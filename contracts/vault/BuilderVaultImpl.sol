// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BuilderVaultImpl is OwnableUpgradeable {
  function initialize(address builder) external initializer {
    _transferOwnership(builder);
  }
}
