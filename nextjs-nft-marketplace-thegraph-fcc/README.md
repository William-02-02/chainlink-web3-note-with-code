# NFT Marketplace DApp

A decentralized NFT marketplace built on Ethereum, featuring a modern UI and seamless user experience.

## Overview

This project is a full-featured NFT (Non-Fungible Token) marketplace that enables users to list, buy, and manage digital assets. Built with Next.js and Ethereum smart contracts, it provides a secure and user-friendly platform for NFT trading.

## Key Features

- **Modern UI/UX**: Sleek, responsive design with glassmorphism effects and smooth animations
- **Wallet Integration**: Seamless connection with Web3 wallets (MetaMask, etc.)
- **NFT Management**:
  - List NFTs for sale
  - Update listing prices
  - Purchase NFTs
  - View detailed NFT information
- **Profile Dashboard**: Personal NFT portfolio management and transaction history
- **Real-time Updates**: Live price updates and transaction notifications
- **Smart Contract Integration**: Secure and transparent trading mechanisms

## Technology Stack

### Frontend
- **Next.js**: React framework for production
- **TailwindCSS**: Utility-first CSS framework
- **Web3UIKit**: UI components for Web3 applications
- **Apollo Client**: GraphQL client for data fetching

### Blockchain
- **Ethereum**: Smart contract platform
- **The Graph**: Blockchain data indexing
- **Moralis**: Web3 development platform
- **IPFS**: Decentralized storage for NFT metadata

### Development Tools
- **Hardhat**: Ethereum development environment
- **Ethers.js**: Ethereum wallet implementation
- **GraphQL**: API query language

## Getting Started

### Prerequisites
- Node.js >= 14.0.0
- Yarn or NPM
- MetaMask wallet

### Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
cd nextjs-nft-marketplace-thegraph-fcc
\`\`\`

2. Install dependencies:
\`\`\`bash
yarn install
# or
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Start the development server:
\`\`\`bash
yarn dev
# or
npm run dev
\`\`\`

## Architecture

The application follows a modern, decentralized architecture:

1. **Frontend Layer**: Next.js application with TailwindCSS for styling
2. **Data Layer**: The Graph Protocol for indexing blockchain data
3. **Smart Contract Layer**: Ethereum smart contracts for marketplace logic
4. **Storage Layer**: IPFS for decentralized storage

## Features in Detail

### NFT Listing
- Support for ERC721 tokens
- Customizable pricing
- Batch listing capabilities
- Automatic metadata fetching

### Trading
- Real-time price updates
- Secure transaction processing
- Gas fee estimation
- Transaction status tracking

### Profile Management
- Portfolio overview
- Transaction history
- Total value tracking
- Listed NFTs management

## Security

- Smart contract auditing
- Secure wallet integration
- Transaction verification
- Error handling and recovery

## Performance

- Optimized image loading
- Efficient data fetching
- Responsive design
- Minimal loading states

## Future Roadmap

- [ ] Multi-chain support
- [ ] Advanced search and filtering
- [ ] Bidding system
- [ ] Collection creation tools
- [ ] Social features and sharing
- [ ] Mobile app development

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for smart contract standards
- The Graph Protocol for blockchain indexing
- Web3UIKit for UI components
- FreeCodeCamp for inspiration and guidance



