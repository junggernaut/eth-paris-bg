// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";

contract SponsorResolver is SchemaResolver {
  address[] private _targetAttesters;
  uint256 private immutable _endTime;

  constructor(IEAS eas, address[] memory targetAttesters, uint256 endTime) SchemaResolver(eas) {
    require(endTime > block.timestamp, "SponsorResolver: end time must be in the future");
    require(targetAttesters.length < 30, "SponsorResolver: too many target attesters");

    _targetAttesters = targetAttesters;
    _endTime = endTime;
  }

  function onAttest(Attestation calldata attestation, uint256 /*value*/) internal view override returns (bool) {
    if (block.timestamp > _endTime) {
      return false;
    }

    for (uint256 i = 0; i < _targetAttesters.length; i++) {
      if (attestation.attester == _targetAttesters[i]) {
        return true;
      }
    }

    return false;
  }

  function onRevoke(Attestation calldata /*attestation*/, uint256 /*value*/) internal pure override returns (bool) {
    return true;
  }

  function getTargetAttesters() external view returns (address[] memory) {
    return _targetAttesters;
  }

  function isTargetAttester(address attester) external view returns (bool) {
    for (uint256 i = 0; i < _targetAttesters.length; i++) {
      if (attester == _targetAttesters[i]) {
        return true;
      }
    }

    return false;
  }

  function getEndTime() external view returns (uint256) {
    return _endTime;
  }
}
