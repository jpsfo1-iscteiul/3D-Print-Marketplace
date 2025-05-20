// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
    }

    // Mapping of tokenId to Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    // Event emitted when a design is listed
    event DesignListed(address indexed nftAddress, uint256 indexed tokenId, uint256 price, address seller);

    // Event emitted when a design is purchased
    event DesignPurchased(address indexed nftAddress, uint256 indexed tokenId, address buyer);

    // List an NFT for sale
    function listDesign(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than zero");
        
        // Check that the sender owns the NFT
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "You must own the NFT to list it");

        // Approve the contract for transfer
        require(nft.getApproved(tokenId) == address(this), "Marketplace must be approved");

        listings[nftAddress][tokenId] = Listing(msg.sender, price);

        emit DesignListed(nftAddress, tokenId, price, msg.sender);
    }

    // Buy an NFT
    function buyDesign(address nftAddress, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.price > 0, "This design is not listed for sale");
        require(msg.value == listing.price, "Incorrect payment amount");

        // Transfer funds to the seller
        payable(listing.seller).transfer(msg.value);

        // Transfer the NFT to the buyer
        IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Remove the listing
        delete listings[nftAddress][tokenId];

        emit DesignPurchased(nftAddress, tokenId, msg.sender);
    }
}
