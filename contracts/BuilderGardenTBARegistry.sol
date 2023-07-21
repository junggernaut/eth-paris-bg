// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Create2.sol";
import "./interfaces/IBuilderGardenTBARegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuilderGardenTBARegistry is IBuilderGardenTBARegistry, Ownable {
  address private bgNftContract;
  address private tba;

  constructor(address _bgNftContract, address _tba) {
    bgNftContract = _bgNftContract;
    tba = _tba;
  }

  function setImplAddress(address newTbaImpl) external onlyOwner {
    tba = newTbaImpl;
  }

  function createAccount(uint256 tokenId) external returns (address) {
    // no init Data for BuilderGarden TBA
    uint256 salt = uint256(keccak256("BuilderGarden"));
    bytes memory code = _creationCode(tba, block.chainid, bgNftContract, tokenId, salt);
    address _account = Create2.computeAddress(bytes32(salt), keccak256(code));
    if (_account.code.length != 0) return _account;

    _account = Create2.deploy(0, bytes32(salt), code);
    emit AccountCreated(_account, tba, block.chainid, bgNftContract, tokenId, salt);
    return _account;
  }

  function account(uint256 chainId, uint256 tokenId, uint256 salt) external view returns (address) {
    bytes32 bytecodeHash = keccak256(_creationCode(tba, chainId, bgNftContract, tokenId, salt));

    return Create2.computeAddress(bytes32(salt), bytecodeHash);
  }

  function _creationCode(
    address implementation_,
    uint256 chainId_,
    address nftContract_,
    uint256 tokenId_,
    uint256 salt_
  ) internal pure returns (bytes memory) {
    return
      abi.encodePacked(
        hex"3d60ad80600a3d3981f3363d3d373d3d3d363d73",
        implementation_,
        hex"5af43d82803e903d91602b57fd5bf3",
        abi.encode(salt_, chainId_, nftContract_, tokenId_)
      );
  }
}
