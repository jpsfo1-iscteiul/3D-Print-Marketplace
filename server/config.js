// server/config.js - Simplified for Polygon
require('dotenv').config();

module.exports = {
  blockchain: {
    polygonRpcUrl: process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
    privateKey: process.env.PRIVATE_KEY,
    designRegistryAddress: process.env.DESIGN_REGISTRY_ADDRESS,
    nftMarketplaceAddress: process.env.NFT_MARKETPLACE_ADDRESS
  }
};
