// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBuilderGardenTBARegistry {
  event AccountCreated(
    address account,
    address implementation,
    uint256 chainId,
    address tokenContract,
    uint256 tokenId,
    uint256 salt
  );

  function createAccount(uint256 tokenId) external returns (address);

  function account(uint256 chainId, uint256 tokenId, uint256 salt) external view returns (address);
}
