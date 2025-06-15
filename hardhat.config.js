// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    // Example for Sepolia testnet (UNCOMMENT AND FILL IN LATER WHEN READY FOR TESTNET)
    /*
    sepolia: {
      url: `YOUR_SEPOLIA_RPC_URL`, // e.g., `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`
      accounts: [`YOUR_PRIVATE_KEY`], // Your metamask private key (be careful with this!)
    },
    */
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test"
  }
};
