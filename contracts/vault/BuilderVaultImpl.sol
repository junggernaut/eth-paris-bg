// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BuilderVaultImpl is OwnableUpgradeable {
  struct Funding {
    address payable hacker;
    address payable[] backers;
  }

  // event SetN(uint n);

  // 23-07-23, 17:00:00
  string public constant HACKATHON = "Eth Paris";
  uint256 public constant deadline = 1690099200;

  // 2.5 ETH = 50 * 0.05 ETH
  uint256 public constant max = 50;
  uint256 public constant unit = 0.05 ether;

  Funding[] private _fundings;

  function initialize(address builder) external initializer {
    _transferOwnership(builder);
  }

  function register() public {
    // todo: check if msg.sender is ERC6551 wallet.
    _fundings.push(Funding(payable(msg.sender), new address payable[](0)));
  }

  function invest(uint256 n, uint256 amount) public payable {
    require(msg.value == amount * unit, "NOT MATCH");

    Funding storage funding = _fundings[n];
    require(funding.backers.length + amount <= max, "Already Capped");

    for (uint256 i = 0; i < amount; i++) {
      funding.backers.push(payable(msg.sender));
    }
  }

  function numberOfFundings() public view returns (uint256) {
    return _fundings.length;
  }

  function fundings() public view returns (Funding[] memory) {
    return _fundings;
  }

  function status(uint256 n) public view returns (uint256) {
    return _fundings[n].backers.length;
  }

  function mint(uint256 id, uint256 value, bytes memory data) external {
    _mint(msg.sender, id, value, data);
  }

  function claimAndSettle(uint256 n) public {
    require(block.timestamp > deadline, "Not Yet");

    Funding memory funding = _fundings[n];
    require(funding.backers.length == max, "Not Capped");

    (funding.hacker).transfer(max * unit);

    for (uint256 i = 0; i < max; i++) {
      _mint(funding.backers[i], 0, 1, "0x");
    }
  }
}
