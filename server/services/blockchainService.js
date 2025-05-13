// server/services/blockchainService.js
const ethers = require('ethers');
const config = require('../config');

// Load ABI files
const DesignRegistryABI = require('../../artifacts/contracts/DesignRegistry.sol/DesignRegistry.json').abi;
const NFTMarketplaceABI = require('../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;

// Create provider for Polygon
const provider = new ethers.providers.JsonRpcProvider(config.blockchain.polygonRpcUrl);
const wallet = new ethers.Wallet(config.blockchain.privateKey, provider);

// Contract instances
const designRegistry = new ethers.Contract(
  config.blockchain.designRegistryAddress,
  DesignRegistryABI,
  wallet
);

const nftMarketplace = new ethers.Contract(
  config.blockchain.nftMarketplaceAddress,
  NFTMarketplaceABI,
  wallet
);

/**
 * Registers a design as an NFT on the blockchain
 * @param {string} filePath - Path to the design file
 * @param {Object} metadata - Design metadata
 * @returns {Object} - Transaction receipt and token ID
 */
exports.registerNFT = async (filePath, metadata) => {
  try {
    // Register the design on the blockchain
    const tx = await designRegistry.registerDesign(
      filePath, // Using file path as token URI for simplicity
      metadata.creatorName,
      metadata.description
    );
    
    const receipt = await tx.wait();
    
    // Extract the token ID from the events
    const event = receipt.events.find(e => e.event === 'Transfer');
    const tokenId = event.args.tokenId || event.args[2]; // Depends on event structure
    
    return {
      tokenId: tokenId.toString(),
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error('Error registering NFT:', error);
    throw new Error('Failed to register NFT on blockchain');
  }
};

/**
 * Lists a design for sale on the marketplace
 * @param {string} tokenId - ID of the NFT token
 * @param {number} price - Price in MATIC
 * @returns {Object} - Transaction receipt
 */
exports.listDesignForSale = async (tokenId, price) => {
  try {
    // Approve the marketplace to transfer the NFT
    const approveTx = await designRegistry.approve(
      config.blockchain.nftMarketplaceAddress,
      tokenId
    );
    await approveTx.wait();
    
    // List the design on the marketplace
    const listTx = await nftMarketplace.listDesign(
      config.blockchain.designRegistryAddress,
      tokenId,
      ethers.utils.parseEther(price.toString())
    );
    
    const receipt = await listTx.wait();
    
    return {
      transactionHash: receipt.transactionHash,
      success: true
    };
  } catch (error) {
    console.error('Error listing design for sale:', error);
    throw new Error('Failed to list design on marketplace');
  }
};

/**
 * Gets details about a design from the blockchain
 * @param {string} tokenId - ID of the NFT token
 * @returns {Object} - Design details
 */
exports.getDesignDetails = async (tokenId) => {
  try {
    const metadata = await designRegistry.getMetadata(tokenId);
    const owner = await designRegistry.ownerOf(tokenId);
    const tokenURI = await designRegistry.tokenURI(tokenId);
    
    return {
      tokenId,
      creatorName: metadata.creatorName,
      description: metadata.description,
      createdAt: new Date(metadata.createdAt * 1000).toISOString(),
      owner,
      tokenURI
    };
  } catch (error) {
    console.error('Error getting design details:', error);
    throw new Error('Failed to get design details from blockchain');
  }
};
