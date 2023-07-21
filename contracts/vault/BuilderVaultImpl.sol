// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BuilderVaultImpl is OwnableUpgradeable {
  string private constant HACKATHON = "ETH PARIS";
  uint256 private constant FUNDING_PRICE_UNIT = 0.05 ether;
  uint256 private amount;
  uint256 private deadline;

  function initialize(address _builder, uint256 _amount, uint256 _deadline) external initializer {
    _transferOwnership(_builder);
    amount = _amount;
    deadline = _deadline;
  }

  // function createProjectForFunding() public {
  //   _projects.push(
  //     Project({ hacker: payable(msg.sender), backers: new address payable[](0), totalFunded: 0, claimed: false })
  //   );
  //   emit Created(_projectId, msg.sender);

  //   _projectId++;
  // }

  // function fundProject(uint256 projectId, uint256 amount) public payable {
  //   require(block.timestamp <= FUNDING_DEADLINE, "REACHED DEADLINE");
  //   require(msg.value == amount * FUNDING_PRICE_UNIT, "INEXACT AMOUNT");

  //   Project storage funding = _projects[projectId];
  //   require(funding.backers.length + amount <= CAP, "ALREADY CAPPED");

  //   for (uint256 i = 0; i < amount; i++) {
  //     funding.backers.push(payable(msg.sender));
  //   }
  //   funding.totalFunded += msg.value;
  //   emit Funded(projectId, msg.sender, msg.value);
  // }

  // // function claim(uint256 projectId) public {
  // //   // Project storage project = _projects[projectId];
  // //   require(project.backers.length == CAP, "NOT CAPPED");

  // //   (project.hacker).transfer(project.totalFunded);

  // //   // for (uint256 i = 0; i < CAP; i++) {
  // //   //   _mint(project.backers[i], projectId, 1, "0x");
  // //   // }
  // //   project.claimed = true;
  // //   emit Claimed(projectId, project.totalFunded);
  // // }

  // function projects() public view returns (Project[] memory) {
  //   return _projects;
  // }

  // function project(uint256 projectId) public view returns (Project memory) {
  //   return _projects[projectId];
  // }

  // function currentProjectId() public view returns (uint256) {
  //   return _projectId;
  // }
}
