// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../interfaces/IBuilderGarden.sol";
import "../interfaces/IALT.sol";

contract BuilderVaultImpl is OwnableUpgradeable {
  string private constant HACKATHON = "ETH PARIS";
  uint256 private constant FUNDING_PRICE_UNIT = 0.05 ether;

  IBuilderGarden private immutable builderGarden;
  IALT private immutable altContract;

  uint256 private totalAmount;
  uint256 private deadline;

  uint256 private currentAmount;
  bool private claimed;
  address[] private backers;
  mapping(address => uint256) private amountForBacker;

  constructor(address _builderGarden, address _altContract) {
    builderGarden = IBuilderGarden(_builderGarden);
    altContract = IALT(_altContract);
  }

  function initialize(address _builder, uint256 _totalAmount, uint256 _deadline) external initializer {
    _transferOwnership(_builder);
    totalAmount = _totalAmount;
    deadline = _deadline;
  }

  function getFundedInfo() external view returns (address[] memory, uint256) {
    return (backers, currentAmount);
  }

  function fund(uint256 numUnits) public payable {
    require(currentAmount + msg.value <= totalAmount, "overfunded");
    require(block.timestamp <= deadline, "overdue");
    require(msg.value == numUnits * FUNDING_PRICE_UNIT, "inexact amount");

    address backerTBA = builderGarden.getTBAAddress(msg.sender);
    require(backerTBA != address(0), "invalid backer address");
    currentAmount += msg.value;
    if (amountForBacker[backerTBA] == 0) {
      backers.push(backerTBA);
    }
    amountForBacker[backerTBA] += numUnits;
  }

  function claim() external onlyOwner {
    require(currentAmount == totalAmount, "not finished");
    address builderTBA = builderGarden.getTBAAddress(msg.sender);

    uint256[] memory numUnits = new uint256[](backers.length);
    for (uint256 i = 0; i < backers.length; i++) {
      numUnits[i] = amountForBacker[backers[i]];
    }

    altContract.mint(builderTBA, backers, numUnits);
    claimed = true;
  }

  function isClaimed() external view returns (bool) {
    return claimed;
  }
}
