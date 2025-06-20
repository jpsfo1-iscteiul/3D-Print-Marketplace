# 3D-Print-Marketplace

A decentralized marketplace for 3D printing designs built with Ethereum smart contracts and React frontend. This platform allows designers to register and sell their 3D printing designs as NFTs, while buyers can purchase and own these digital assets.

## 🏗️ Project Architecture

### Smart Contracts
- **DesignRegistry.sol**: ERC721 contract for minting and managing 3D design NFTs
- **NFTMarketplace.sol**: Marketplace contract for listing and purchasing designs
- **Lock.sol**: Sample contract (can be removed)

### Frontend
- **React + TypeScript**: Modern frontend with Vite build tool
- **Tailwind CSS**: Styling with shadcn/ui components
- **Ethers.js**: Ethereum interaction
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask or another Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 3D-Print-Marketplace
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Development Setup

1. **Compile smart contracts**
   ```bash
   npm run compile
   ```

2. **Start local blockchain**
   ```bash
   npm run node
   ```

3. **Deploy contracts to local network** (in a new terminal)
   ```bash
   npm run deploy:local
   ```

4. **Start frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

5. **Connect MetaMask to localhost:8545**
   - Network Name: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

## 📁 Project Structure

```
3D-Print-Marketplace/
├── contracts/                 # Smart contracts
│   ├── DesignRegistry.sol    # NFT contract for designs
│   ├── NFTMarketplace.sol    # Marketplace contract
│   └── Lock.sol              # Sample contract
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── context/          # React contexts
│   │   ├── contracts/        # Contract ABIs
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   └── routes.tsx        # Routing configuration
│   └── package.json
├── scripts/                  # Deployment scripts
│   ├── deploy.js            # Contract deployment
│   └── copy-abis.js         # ABI copying utility
├── test/                     # Contract tests
├── hardhat.config.js         # Hardhat configuration
└── package.json
```

## 🔧 Available Scripts

### Root Directory
- `npm run compile` - Compile smart contracts
- `npm run copy-abis` - Copy contract ABIs to frontend
- `npm run deploy:local` - Deploy contracts to local network
- `npm run node` - Start local Hardhat node
- `npm test` - Run contract tests

### Frontend Directory
- `npm run dev` - Start development server (http://localhost:8080)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Features

### For Designers
- Register 3D designs as NFTs
- Set custom metadata (creator name, description)
- List designs for sale on the marketplace
- Receive payments directly to wallet

### For Buyers
- Browse available 3D designs
- Purchase designs with ETH
- Own digital rights to designs
- View design metadata and creator information

### Technical Features
- ERC721 standard compliance
- Secure payment handling with ReentrancyGuard
- IPFS-ready token URIs
- Responsive React frontend
- Web3 wallet integration
- Multi-language support (English/Portuguese)

## 🧪 Testing

Run the smart contract tests:
```bash
npm test
```

Run specific test files:
```bash
npx hardhat test test/DesignRegistry.test.js
npx hardhat test test/NFTMarketplace.test.js
```

## 🚀 Deployment

### Local Development
1. Start local node: `npm run node`
2. Deploy contracts: `npm run deploy:local`
3. Start frontend: `cd frontend && npm run dev`

### Testnet Deployment
1. Update `hardhat.config.js` with your testnet configuration
2. Add your private key and RPC URL
3. Deploy: `npx hardhat run scripts/deploy.js --network sepolia`

### Production Deployment
1. Configure production network in `hardhat.config.js`
2. Set up environment variables for production
3. Deploy contracts to mainnet
4. Build frontend: `cd frontend && npm run build`
5. Deploy frontend to your hosting service

## 🔒 Security

- Smart contracts use OpenZeppelin libraries
- ReentrancyGuard protection for marketplace transactions
- Ownable pattern for admin functions
- Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Frontend can't connect to contracts**
- Ensure contracts are deployed and ABIs are copied
- Check that MetaMask is connected to the correct network
- Verify contract addresses in `.env.local`

**Compilation errors**
- Make sure you have the correct Node.js version
- Clear cache: `npx hardhat clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Transaction failures**
- Ensure you have sufficient ETH for gas fees
- Check that you're connected to the correct network
- Verify contract addresses are correct

## 📞 Support

For questions or issues, please open an issue on the GitHub repository.
