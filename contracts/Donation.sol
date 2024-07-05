// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    struct DonationInfo {
        uint256 id;
        address donateur;
        uint256 montant;
        uint256 timestamp;
    }

    mapping(uint256 => DonationInfo) public donations;
    mapping(address => uint256[]) public donationsByDonator;
    uint256 public nextId;

    event DonationReceived(uint256 id, address indexed donateur, uint256 montant, uint256 timestamp);

    // Ajout d'un commentaire explicatif
    /// @notice Crée une nouvelle donation
    /// @dev Le montant de la donation est envoyé avec la transaction
    function createDonation() public payable {
        require(msg.value > 0, "Le montant du don doit etre superieur a 0");

        uint256 id = nextId;
        donations[id] = DonationInfo(id, msg.sender, msg.value, block.timestamp);
        donationsByDonator[msg.sender].push(id);
        nextId++;

        emit DonationReceived(id, msg.sender, msg.value, block.timestamp);
    }

    /// @notice Récupère les IDs des donations faites par un donateur spécifique
    /// @param _donator L'adresse du donateur
    /// @return Un tableau des IDs de donation
    function getDonationsByDonator(address _donator) public view returns (uint256[] memory) {
        return donationsByDonator[_donator];
    }

    /// @notice Récupère les informations d'une donation spécifique
    /// @param _id L'ID de la donation
    /// @return Les informations de la donation
    function getDonation(uint256 _id) public view returns (DonationInfo memory) {
        require(_id < nextId, "ID de donation invalide");
        return donations[_id];
    }
}