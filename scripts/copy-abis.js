const fs = require('fs');
const path = require('path');

// Source and destination paths
const artifactsDir = path.join(__dirname, '..', 'artifacts', 'contracts');
const frontendDir = path.join(__dirname, '..', 'frontend', 'src', 'contracts');

// Create the frontend contracts directory if it doesn't exist
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir, { recursive: true });
}

// Copy DesignRegistry ABI
const designRegistryPath = path.join(artifactsDir, 'DesignRegistry.sol', 'DesignRegistry.json');
const designRegistryDest = path.join(frontendDir, 'DesignRegistry.json');

// Copy NFTMarketplace ABI
const nftMarketplacePath = path.join(artifactsDir, 'NFTMarketplace.sol', 'NFTMarketplace.json');
const nftMarketplaceDest = path.join(frontendDir, 'NFTMarketplace.json');

try {
  // Copy DesignRegistry ABI
  if (fs.existsSync(designRegistryPath)) {
    const designRegistryArtifact = require(designRegistryPath);
    fs.writeFileSync(
      designRegistryDest,
      JSON.stringify({ 
        abi: designRegistryArtifact.abi,
        bytecode: designRegistryArtifact.bytecode 
      }, null, 2)
    );
    console.log('✓ Copied DesignRegistry ABI');
  } else {
    console.error('✗ DesignRegistry artifact not found. Please compile contracts first.');
  }

  // Copy NFTMarketplace ABI
  if (fs.existsSync(nftMarketplacePath)) {
    const nftMarketplaceArtifact = require(nftMarketplacePath);
    fs.writeFileSync(
      nftMarketplaceDest,
      JSON.stringify({ 
        abi: nftMarketplaceArtifact.abi,
        bytecode: nftMarketplaceArtifact.bytecode 
      }, null, 2)
    );
    console.log('✓ Copied NFTMarketplace ABI');
  } else {
    console.error('✗ NFTMarketplace artifact not found. Please compile contracts first.');
  }
} catch (error) {
  console.error('Error copying ABIs:', error);
  process.exit(1);
} 