// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy DesignRegistry
    const DesignRegistry = await hre.ethers.getContractFactory("DesignRegistry");
    const designRegistry = await DesignRegistry.deploy(deployer.address);
    await designRegistry.waitForDeployment();
    console.log("DesignRegistry deployed to:", await designRegistry.getAddress());

    // Deploy NFTMarketplace
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.waitForDeployment();
    console.log("NFTMarketplace deployed to:", await nftMarketplace.getAddress());

    // Write contract addresses to a file that can be used by the frontend
    const fs = require("fs");
    const path = require("path");
    const envContent = `VITE_DESIGN_REGISTRY_ADDRESS=${await designRegistry.getAddress()}
VITE_NFT_MARKETPLACE_ADDRESS=${await nftMarketplace.getAddress()}`;

    fs.writeFileSync(
        path.join(__dirname, "..", "frontend", ".env.local"),
        envContent
    );
    console.log("Contract addresses written to frontend/.env.local");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
