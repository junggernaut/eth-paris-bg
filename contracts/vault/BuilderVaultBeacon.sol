// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BuilderVaultProxy.sol";

contract BuilderVaultBeacon is Ownable {
  address private implAddress;

  function setImplAddress(address _implAddress) external onlyOwner {
    implAddress = _implAddress;
  }

  function getImplAddress() external view returns (address) {
    return implAddress;
  }

  function deployProxy() external returns (address) {
    return address(new BuilderVaultProxy(address(this)));
  }
}
