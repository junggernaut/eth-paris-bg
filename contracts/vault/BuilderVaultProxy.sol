// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "../interfaces/IBuilderVaultBeacon.sol";
import "@openzeppelin/contracts/proxy/Proxy.sol";

contract BuilderVaultProxy is Proxy {
  IBuilderVaultBeacon immutable beacon;

  constructor(address _beacon) {
    beacon = IBuilderVaultBeacon(_beacon);
  }

  function _implementation() internal view override returns (address) {
    return beacon.getImplAddress();
  }
}
