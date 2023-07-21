// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./interfaces/IBuilderGardenTBARegistry.sol";
import "./nft/BuilderGardenNft.sol";

contract BuilderGarden {
  IBuilderGardenTBARegistry private bgTbaRegistry;
  BuilderGardenNft private bgNftContract;
  address private tbaImpl;

  uint256 private backerCounter;
  uint256 private builderCounter;
  mapping(address => address) private eoaToTBA;

  //0 for builder, 1 for backer
  event SignUp(address eoa, address tba, uint256 tokenId, uint256 userType);

  constructor(address _bgTbaRegistry, address _bgNftContract, address _tbaImpl) {
    bgTbaRegistry = IBuilderGardenTBARegistry(_bgTbaRegistry);
    bgNftContract = BuilderGardenNft(_bgNftContract);
    tbaImpl = _tbaImpl;
  }

  function getBackerNumber() public view returns (uint256) {
    return backerCounter;
  }

  function getBuilderNumber() public view returns (uint256) {
    return builderCounter;
  }

  function getTBAAddress(address user) public view returns (address) {
    return eoaToTBA[user];
  }

  function builderSignUp() public {
    require(bgNftContract.balanceOf(msg.sender) == 0);
    bgNftContract.safeMint(msg.sender, 2 * builderCounter + 1);
    address tbaAddress = bgTbaRegistry.createAccount(tbaImpl, address(bgNftContract), 2 * builderCounter + 1);
    eoaToTBA[msg.sender] = tbaAddress;

    emit SignUp(msg.sender, tbaAddress, 2 * builderCounter + 1, 0);
    ++builderCounter;
  }

  function backerSignUp() public {
    require(bgNftContract.balanceOf(msg.sender) == 0);
    bgNftContract.safeMint(msg.sender, 2 * (backerCounter + 1));
    address tbaAddress = bgTbaRegistry.createAccount(tbaImpl, address(bgNftContract), 2 * (backerCounter + 1));
    eoaToTBA[msg.sender] = tbaAddress;

    emit SignUp(msg.sender, tbaAddress, 2 * (backerCounter + 1), 1);
    ++backerCounter;
  }
}
