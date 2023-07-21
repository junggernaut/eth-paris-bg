// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/*
  ALT is an NFT minted to both the Builder and Backer of BuilderGarden, 
  following the ERC1155 structure.

  Odd-numbered tokenIDs serve as certificates granted to builders who initiate each funding round. 
  (Total Funding Amount / Unit) is minted for each funding round, and transfers are not allowed for these tokens.

  Even-numbered tokenIDs are issued as ALT to backers, (Each Funding Amount / Unit) is minted for each backers. 
  Backers have the option to transfer a portion or the entire quantity of their ALTs, 
  and these tokens can be used as warrants for the builder in proportion to the transferred amount in the future.
  
  For each builder's funding round, two tokenIDs are issued as pairs. Ex)1-2, 3-4, ...
 */
contract ALT is ERC1155 {
  error SoulBounded();

  string constant name = "AngelListedToken";
  string public symbol = "ALT";

  uint256 private counter;

  constructor(string memory uri) ERC1155(uri) {}

  function mint(address builderTBA, address[] memory backerTBA, uint256[] memory numUnits) external {
    uint256 totalUnits = 0;
    for (uint256 i = 0; i < backerTBA.length; i++) {
      _mint(backerTBA[i], 2 * counter + 2, numUnits[i], "");
      totalUnits += numUnits[i];
    }
    _mint(builderTBA, 2 * counter + 1, totalUnits, "");
    ++counter;
  }

  function _beforeTokenTransfer(
    address,
    address _from,
    address _to,
    uint256[] memory _ids,
    uint256[] memory,
    bytes memory
  ) internal pure override {
    // check if there is a odd-numbered tokenID in the list _ids. If there exist, revert.
    for (uint256 i = 0; i < _ids.length; i++) {
      if (_ids[i] % 2 == 1) {
        if (_from != address(0) && _to != address(0)) {
          revert SoulBounded();
        }
      }
    }
  }
}
