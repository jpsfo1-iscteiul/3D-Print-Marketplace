// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      // You can configure this for a local development network if needed,
      // but defaults are usually fine for npx hardhat node
    },
    // Example for Sepolia testnet (UNCOMMENT AND FILL IN LATER WHEN READY FOR TESTNET)
    /*
    sepolia: {
      url: `YOUR_SEPOLIA_RPC_URL`, // e.g., `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`
      accounts: [`YOUR_PRIVATE_KEY`], // Your metamask private key (be careful with this!)
    },
    */
  },
};
