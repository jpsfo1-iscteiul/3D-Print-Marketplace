const ethers = require('ethers');
const config = require('../config');

// Load ABI files
const DesignRegistryABI = require('../../artifacts/contracts/DesignRegistry.sol/DesignRegistry.json').abi;
const NFTMarketplaceABI = require('../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json').abi;

// Create provider for Polygon
const provider = new ethers.providers.JsonRpcProvider(config.blockchain.polygonRpcUrl);

//  Wallet for server-side transactions (e.g., admin, setup)
const wallet = new ethers.Wallet(config.blockchain.privateKey, provider);

// Contract instances (no signer here)
const designRegistry = new ethers.Contract(
  config.blockchain.designRegistryAddress,
  DesignRegistryABI,
  provider
);

const nftMarketplace = new ethers.Contract(
  config.blockchain.nftMarketplaceAddress,
  NFTMarketplaceABI,
  provider
);

/**
 * Registers a design as an NFT on the blockchain (PREPARES transaction data)
 * @param {string} filePath - Path to the design file
 * @param {Object} metadata - Design metadata
 * @returns {Object} - Transaction data to be signed by the user
 */
exports.registerNFT = async (filePath, metadata) => {
  try {
    const tx = await designRegistry.populateTransaction.registerDesign(
      filePath,
      metadata.creatorName,
      metadata.description
    );

    return {
      to: config.blockchain.designRegistryAddress,
      data: tx.data,
    };
  } catch (error) {
    console.error('Error preparing register NFT transaction:', error);
    throw new Error('Failed to prepare register NFT transaction');
  }
};

/**
 * Lists a design for sale on the marketplace (PREPARES transaction data)
 * @param {string} tokenId - ID of the NFT token
 * @param {number} price - Price in MATIC
 * @returns {Object} - Transaction data to be signed by the user
 */
exports.listDesignForSale = async (tokenId, price) => {
  try {
    const approveTx = await designRegistry.populateTransaction.approve(
      config.blockchain.nftMarketplaceAddress,
      tokenId
    );

    const listTx = await nftMarketplace.populateTransaction.listDesign(
      config.blockchain.designRegistryAddress,
      tokenId,
      ethers.utils.parseEther(price.toString())
    );

    return {
      approve: {
        to: config.blockchain.designRegistryAddress,
        data: approveTx.data,
      },
      list: {
        to: config.blockchain.nftMarketplaceAddress,
        data: listTx.data,
      },
    };
  } catch (error) {
    console.error('Error preparing list for sale transaction:', error);
    throw new Error('Failed to prepare list for sale transaction');
  }
};

/**
 * Gets details about a design from the blockchain (NO CHANGE)
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
      tokenURI,
    };
  } catch (error) {
    console.error('Error getting design details:', error);
    throw new Error('Failed to get design details from blockchain');
  }
};

/**
 * Executes a transaction using the server's wallet (for server-controlled actions)
 * @param {Object} tx - The transaction object (e.g., from populateTransaction)
 * @returns {Object} - Transaction receipt
 */
exports.executeTransaction = async (tx) => {
  try {
    const transaction = await wallet.sendTransaction(tx);
    const receipt = await transaction.wait();
    return receipt;
  } catch (error) {
    console.error('Error executing transaction:', error);
    throw new Error('Failed to execute transaction');
  }
};
