// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/*
  ALT is an NFT minted to both the Builder and Backer of BuilderGarden, 
  following the ERC1155 structure.

  Odd-numbered tokenIDs serve as certificates granted to builders who initiate each funding round. 
  Only one token is minted for each funding round, and transfers are not allowed for these tokens.

  Even-numbered tokenIDs are issued as ALT to backers, and the total quantity varies based on the funding amount raised by the builder. 
  Backers have the option to transfer a portion or the entire quantity of their ALTs, 
  and these tokens can be used as warrants for the builder in proportion to the transferred amount in the future.
  
  For each builder's funding round, two tokenIDs are issued as pairs. Ex)1-2, 3-4, ...
 */
contract ALT is ERC1155 {
  error SoulBounded();

  string constant name = "AngelListedToken";
  string public symbol = "ALT";

  uint256 private counter;

  // If builderOfId[10] is 0x1234(TBA of BuilderGarden), then tokens 19 and 20 are ALTs issued during the funding round of 0x1234.
  mapping(uint256 => address) private builderOfId;

  constructor(string memory uri) ERC1155(uri) {}

  function mint(address builderTBA, address[] backerTBA, uint256 amount) {}

  function _beforeTokenTransfer(
    address,
    address,
    address,
    uint256[] memory _ids,
    uint256[] memory,
    bytes memory
  ) internal pure override {
    // check if there is a odd-numbered tokenID in the list _ids. If there exist, revert.
    for (uint256 i = 0; i < _ids.length; i++) {
      if (_ids[i] % 2 == 1) {
        revert SoulBounded();
      }
    }
  }
}
