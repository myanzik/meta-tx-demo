// SPDX-License-Identifier: unlicensed
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

/// @author Rumsan Team
/// @dev Inherits AccessControl and Multicall from openzeppelin,
/// AccessControl to manage multiple roles in contract
/// Multicall to make bulk calls to a contract
contract Storage is AccessControl, ERC2771Context, Multicall {
    /// @dev event to be emitted when data is recorded
    /// @param dataHash keccak256 hash of the data to be recorder
    /// @param member address of the member who recorded the data

    event dataRecorded(
        bytes32 indexed dataHash,
        address indexed member,
        address indexed executor
    );

    using EnumerableSet for EnumerableSet.Bytes32Set;

    /// @dev Member_Role id for the AccessControl Contract
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");

    /// @dev list of anchored did
    EnumerableSet.Bytes32Set private hashSet;

    /// @dev Set the admins and the members roles during deployment
    /// @param _admins list of admins addresses
    /// @param _members list of org members addresses
    constructor(
        address _forwarder,
        address[] memory _admins,
        address[] memory _members
    ) ERC2771Context(address(_forwarder)) {
        _setRoleAdmin(MEMBER_ROLE, DEFAULT_ADMIN_ROLE);
        for (uint256 i = 0; i < _admins.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, _admins[i]);
        }
        for (uint256 i = 0; i < _members.length; i++) {
            _grantRole(MEMBER_ROLE, _members[i]);
        }
    }

    /// @dev Checks if the caller is registered as a member or not
    modifier OnlyMember() {
        require(
            hasRole(MEMBER_ROLE, _msgSender()),
            "Storage: Only Members can record data"
        );
        _;
    }

    /// @dev it checks if data is recorded or not
    /// @param _data keccak256 hash of the data string
    /// @return bool value if data exists or not
    function dataExists(string memory _data) public view returns (bool) {
        bytes32 dataHash = keccak256(abi.encodePacked(_data));
        return hashSet.contains(dataHash);
    }

    /// @dev Records Data
    /// @param _data data to be recorded
    function recordData(string memory _data) external OnlyMember {
        bytes32 dataHash = keccak256(abi.encodePacked(_data));
        hashSet.add(dataHash);
        emit dataRecorded(dataHash, _msgSender(), msg.sender);
    }

    ///region overrides

    /// @dev overriding the method to ERC2771Context
    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address sender)
    {
        sender = ERC2771Context._msgSender();
    }

    /// @dev overriding the method to ERC2771Context
    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength()
        internal
        view
        override(Context, ERC2771Context)
        returns (uint256)
    {
        return ERC2771Context._contextSuffixLength();
    }
}
