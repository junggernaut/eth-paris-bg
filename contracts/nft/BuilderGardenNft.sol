// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/IBuilderGardenTBARegistry.sol";

contract BuilderGardenNft is ERC721, Ownable {
  error SoulBounded();

  address private builderGardenContract;
  IBuilderGardenTBARegistry private builderGardenTBARegistry;
  address private builderGardenTBAImpl;

  constructor() ERC721("BuilderGardenToken", "BGT") {}

  function setTBAInfo(
    address _builderGardenContract,
    address _builderGardenTBARegistry,
    address _builderGardenTBAImpl
  ) external onlyOwner {
    builderGardenContract = _builderGardenContract;
    builderGardenTBARegistry = IBuilderGardenTBARegistry(_builderGardenTBARegistry);
    builderGardenTBAImpl = _builderGardenTBAImpl;
  }

  function getAccount(uint tokenId) public view returns (address) {
    return
      builderGardenTBARegistry.account(
        builderGardenTBAImpl,
        builderGardenContract,
        block.chainid,
        tokenId,
        uint256(keccak256("BuilderGarden"))
      );
  }

  function safeMint(address to, uint256 tokenId) external {
    require(msg.sender == builderGardenContract);
    _safeMint(to, tokenId);
  }

  function _beforeTokenTransfer(address _from, address _to, uint256, uint256) internal pure override {
    if (_from != address(0) && _to != address(0)) {
      revert SoulBounded();
    }
  }
}
