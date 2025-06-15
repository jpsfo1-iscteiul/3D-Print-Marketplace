const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DesignRegistry", function () {
  let designRegistry;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const DesignRegistry = await ethers.getContractFactory("DesignRegistry");
    designRegistry = await DesignRegistry.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await designRegistry.owner()).to.equal(owner.address);
    });

    it("Should start with tokenId 0", async function () {
      expect(await designRegistry.nextTokenId()).to.equal(0);
    });
  });

  describe("Design Registration", function () {
    const tokenURI = "ipfs://QmTest123";
    const creatorName = "Test Creator";
    const description = "Test Description";

    it("Should register a design and mint NFT", async function () {
      const tx = await designRegistry.connect(addr1).registerDesign(
        tokenURI,
        creatorName,
        description
      );

      await expect(tx)
        .to.emit(designRegistry, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 0);

      expect(await designRegistry.ownerOf(0)).to.equal(addr1.address);
      expect(await designRegistry.tokenURI(0)).to.equal(tokenURI);
      
      const metadata = await designRegistry.getMetadata(0);
      expect(metadata.creatorName).to.equal(creatorName);
      expect(metadata.description).to.equal(description);
      expect(metadata.createdAt).to.be.gt(0);
    });

    it("Should increment tokenId after each registration", async function () {
      await designRegistry.connect(addr1).registerDesign(
        tokenURI,
        creatorName,
        description
      );
      expect(await designRegistry.nextTokenId()).to.equal(1);

      await designRegistry.connect(addr2).registerDesign(
        tokenURI,
        creatorName,
        description
      );
      expect(await designRegistry.nextTokenId()).to.equal(2);
    });

    it("Should revert when getting metadata for non-existent token", async function () {
      await expect(designRegistry.getMetadata(999))
        .to.be.revertedWith("Token does not exist");
    });
  });
}); 