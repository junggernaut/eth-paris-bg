// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../interfaces/IBuilderGarden.sol";

contract BuilderVaultImpl is OwnableUpgradeable {
  string private constant HACKATHON = "ETH PARIS";
  uint256 private constant FUNDING_PRICE_UNIT = 0.05 ether;

  IBuilderGarden private builderGarden;

  uint256 private totalAmount;
  uint256 private deadline;

  uint256 private currentAmount;
  address[] private backers;
  mapping(address => uint256) private amountForBacker;

  constructor(address _builderGarden) {
    builderGarden = IBuilderGarden(_builderGarden);
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
      amountForBacker[backerTBA] = numUnits;
    } else {
      amountForBacker[backerTBA] += numUnits;
    }
  }

  function claim() external onlyOwner {
    require(currentAmount == totalAmount, "not finished");
    // make two array from list "backers". first one is for backer address list, and it should not be redundant. second one is for amount list, and its length should be same with backer address list. integer is the number of backer address(redundent amount) in the list "backers".
  }
}
