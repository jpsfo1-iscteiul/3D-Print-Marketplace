// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DesignRegistry is ERC721URIStorage, Ownable {
    uint256 public nextTokenId; // Counter for token IDs

    // Struct to store additional metadata
    struct DesignMetadata {
        string creatorName;
        string description;
        uint256 createdAt;
    }

    // Mapping from tokenId to additional metadata
    mapping(uint256 => DesignMetadata) public designMetadata;

    constructor(address initialOwner) ERC721("DesignToken", "DST") Ownable(initialOwner) {}

    /**
     * @notice Registers a design and mints an NFT.
     * @param tokenURI URI for the design file (e.g., IPFS hash).
     * @param creatorName Name of the designer.
     * @param description Brief description of the design.
     */
    function registerDesign(
        string memory tokenURI,
        string memory creatorName,
        string memory description
    ) public returns (uint256) {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        // Mint the NFT to the designer
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Store additional metadata
        designMetadata[tokenId] = DesignMetadata({
            creatorName: creatorName,
            description: description,
            createdAt: block.timestamp
        });

        return tokenId;
    }

    /**
     * @notice Retrieves metadata for a specific tokenId.
     * @param tokenId The ID of the token.
     * @return DesignMetadata The additional metadata for the token.
     */
    function getMetadata(uint256 tokenId) public view returns (DesignMetadata memory) {
        if (_ownerOf(tokenId) == address(0)) {
            revert("Token does not exist");
        }
        return designMetadata[tokenId];
    }
}
