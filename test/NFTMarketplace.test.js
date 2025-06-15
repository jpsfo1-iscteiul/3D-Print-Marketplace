const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let nftMarketplace;
  let designRegistry;
  let owner;
  let seller;
  let buyer;
  let tokenId;
  const price = ethers.parseEther("1.0");

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();
    
    // Deploy DesignRegistry
    const DesignRegistry = await ethers.getContractFactory("DesignRegistry");
    designRegistry = await DesignRegistry.deploy(owner.address);
    
    // Deploy NFTMarketplace
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();

    // Register a design and get the tokenId
    const tx = await designRegistry.connect(seller).registerDesign(
      "ipfs://QmTest123",
      "Test Creator",
      "Test Description"
    );
    const receipt = await tx.wait();
    const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'Transfer');
    tokenId = event.args[2];
  });

  describe("Listing", function () {
    it("Should allow owner to list their NFT", async function () {
      // Approve marketplace
      await designRegistry.connect(seller).approve(nftMarketplace.target, tokenId);
      
      // List the NFT
      await expect(nftMarketplace.connect(seller).listDesign(
        designRegistry.target,
        tokenId,
        price
      ))
        .to.emit(nftMarketplace, "DesignListed")
        .withArgs(designRegistry.target, tokenId, price, seller.address);

      const listing = await nftMarketplace.listings(designRegistry.target, tokenId);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
    });

    it("Should not allow non-owner to list NFT", async function () {
      await expect(nftMarketplace.connect(buyer).listDesign(
        designRegistry.target,
        tokenId,
        price
      )).to.be.revertedWith("You must own the NFT to list it");
    });

    it("Should not allow listing without marketplace approval", async function () {
      await expect(nftMarketplace.connect(seller).listDesign(
        designRegistry.target,
        tokenId,
        price
      )).to.be.revertedWith("Marketplace must be approved");
    });

    it("Should not allow listing with zero price", async function () {
      await designRegistry.connect(seller).approve(nftMarketplace.target, tokenId);
      
      await expect(nftMarketplace.connect(seller).listDesign(
        designRegistry.target,
        tokenId,
        0
      )).to.be.revertedWith("Price must be greater than zero");
    });
  });

  describe("Buying", function () {
    beforeEach(async function () {
      // Setup: approve and list the NFT
      await designRegistry.connect(seller).approve(nftMarketplace.target, tokenId);
      await nftMarketplace.connect(seller).listDesign(
        designRegistry.target,
        tokenId,
        price
      );
    });

    it("Should allow buying a listed NFT", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await expect(nftMarketplace.connect(buyer).buyDesign(
        designRegistry.target,
        tokenId,
        { value: price }
      ))
        .to.emit(nftMarketplace, "DesignPurchased")
        .withArgs(designRegistry.target, tokenId, buyer.address);

      // Check NFT ownership
      expect(await designRegistry.ownerOf(tokenId)).to.equal(buyer.address);
      
      // Check seller received payment
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(price);

      // Check listing is removed
      const listing = await nftMarketplace.listings(designRegistry.target, tokenId);
      expect(listing.price).to.equal(0);
    });

    it("Should not allow buying with incorrect price", async function () {
      await expect(nftMarketplace.connect(buyer).buyDesign(
        designRegistry.target,
        tokenId,
        { value: ethers.parseEther("0.5") }
      )).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should not allow buying an unlisted NFT", async function () {
      // Create and list a new NFT
      const tx = await designRegistry.connect(seller).registerDesign(
        "ipfs://QmTest456",
        "Test Creator",
        "Test Description"
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'Transfer');
      const newTokenId = event.args[2];

      await expect(nftMarketplace.connect(buyer).buyDesign(
        designRegistry.target,
        newTokenId,
        { value: price }
      )).to.be.revertedWith("This design is not listed for sale");
    });
  });
}); 