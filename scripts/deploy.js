// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy DesignRegistry
    const DesignRegistry = await ethers.getContractFactory("DesignRegistry");
    const designRegistry = await DesignRegistry.deploy(deployer.address);
    await designRegistry.waitForDeployment(); // Use waitForDeployment for Hardhat 2.13.0 and later

    console.log("DesignRegistry deployed to:", designRegistry.target); // Use .target for Hardhat 2.13.0 and later

    // Deploy NFTMarketplace
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.waitForDeployment(); // Use waitForDeployment for Hardhat 2.13.0 and later

    console.log("NFTMarketplace deployed to:", nftMarketplace.target); // Use .target for Hardhat 2.13.0 and later

    // (Optional) Save contract addresses to a file for frontend
    const fs = require('fs');
    const contractsDir = __dirname + '/../frontend/src/contracts';

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + '/contract-addresses.json',
        JSON.stringify({
            DesignRegistry: designRegistry.target,
            NFTMarketplace: nftMarketplace.target,
        }, undefined, 2)
    );

    const DesignRegistryArtifact = artifacts.readArtifactSync("DesignRegistry");
    fs.writeFileSync(
        contractsDir + '/DesignRegistry.json',
        JSON.stringify(DesignRegistryArtifact, null, 2)
    );

    const NFTMarketplaceArtifact = artifacts.readArtifactSync("NFTMarketplace");
    fs.writeFileSync(
        contractsDir + '/NFTMarketplace.json',
        JSON.stringify(NFTMarketplaceArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
