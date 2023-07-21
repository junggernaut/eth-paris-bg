// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IALT {
  function mint(address builderTBA, address[] memory backerTBA, uint256[] memory numUnits) external;
}
