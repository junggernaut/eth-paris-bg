// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./interfaces/IBuilderGardenTBARegistry.sol";
import "./BuilderGardenNft.sol";

contract BuilderGarden {
  IBuilderGardenTBARegistry private bgTbaRegistry;
  BuilderGardenNft private bgNftContract;

  uint256 private backerCounter;
  uint256 private builderCounter;

  function getBackerNumber() public view returns (uint256) {
    return backerCounter;
  }

  function getBuilderNumber() public view returns (uint256) {
    return builderCounter;
  }

  function backerSignUp() public {
    require(bgNftContract.balanceOf(msg.sender) == 0);
    bgNftContract.safeMint(msg.sender, 2 * (backerCounter + 1));
    ++backerCounter;
    // _bgTbaRegistry;
  }

  function builderSignUp() public {
    require(bgNftContract.balanceOf(msg.sender) == 0);
    bgNftContract.safeMint(msg.sender, 2 * builderCounter + 1);
    ++builderCounter;
  }
}
