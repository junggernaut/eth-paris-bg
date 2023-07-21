// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuilderGardenNft is ERC721, Ownable {
  address private builderGardenContract;

  constructor() ERC721("BuilderGardenNFT", "BG") {}

  function setBuilderGardenContract(address _builderGardenContract) external onlyOwner {
    builderGardenContract = _builderGardenContract;
  }

  function safeMint(address to, uint256 tokenId) public {
    require(msg.sender == builderGardenContract);
    _safeMint(to, tokenId);
  }
}
