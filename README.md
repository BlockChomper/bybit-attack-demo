# Bybit Attack Demo

A comprehensive demonstration of the Bybit attack vector where a malicious contract can overwrite storage slot 0 (implementation) of a Safe contract by exploiting the transfer function's storage manipulation.

⚠️ **WARNING: This is for educational and security research purposes only. Do not use maliciously or against real contracts.**

---

## Table of Contents

- [Overview](#overview)
- [Attack Vector Explanation](#attack-vector-explanation)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start - Local Development](#quick-start---local-development)
- [Deploying to Sepolia Testnet](#deploying-to-sepolia-testnet)
- [Using the Web Interface](#using-the-web-interface)
- [Manually Executing the Exploit](#manually-executing-the-exploit)
- [Technical Details](#technical-details)
- [Security Implications](#security-implications)
- [Contract Architecture](#contract-architecture)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project demonstrates a critical vulnerability in smart contract proxy patterns. The attack exploits storage slot collisions to overwrite the implementation address in a Safe proxy contract, potentially allowing an attacker to gain control of the proxy.

### What This Demo Shows

1. How a malicious contract can manipulate storage slots
2. The danger of storage collisions in proxy patterns
3. How delegatecall can be exploited to overwrite critical storage variables
4. Why automated security tools and manual audits are essential

---

## Attack Vector Explanation

### The Vulnerability

Proxy contracts in Solidity use a delegatecall pattern where the proxy contract stores the address of the implementation contract in storage slot 0. When a user calls a function on the proxy, the proxy delegatecalls the implementation contract.

### The Exploit

1. **Storage Slot Collision**: The malicious contract's `_transfer` variable is stored in storage slot 0 (same slot as the Safe's implementation address)
2. **Function Signature Match**: The malicious `transfer()` function matches a typical ERC20 transfer signature
3. **Storage Overwrite**: When the malicious function is called via delegatecall, it writes to storage slot 0, overwriting the implementation address
4. **Contract Compromise**: The attacker can now redirect calls to their own malicious implementation

### Visual Flow

```
User calls → Proxy Contract → delegatecall → Malicious Contract
                                      ↓
                          Writes to storage slot 0
                                      ↓
                          Implementation address overwritten
                                      ↓
                          Proxy now calls attacker's contract
```

---

## Prerequisites

- **Node.js** 18+ and **npm** (comes with Node.js)
  - **macOS users**: See [INSTALL_MACOS.md](./INSTALL_MACOS.md) for step-by-step installation
  - **Other OS**: [Download Node.js](https://nodejs.org/)
- **Git** (for cloning the repository)
- **MetaMask** or another Web3 wallet ([Download](https://metamask.io/))
- **Sepolia ETH** for testnet deployment (see [Faucets](#getting-sepolia-eth))
- An RPC provider account (Alchemy, Infura, or QuickNode)

### Getting Sepolia ETH

- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Faucet](https://www.quicknode.com/guides/ethereum-development/getting-started-with-ethereum/testnet-faucets)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bybit-attack-demo
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js for the web interface
- Hardhat for smart contract development
- TypeScript and other dependencies

---

## Quick Start - Local Development

### Step 1: Start Local Blockchain

Open a new terminal and run:

```bash
npx hardhat node
```

This starts a local Hardhat network at `http://localhost:8545`.

### Step 2: Start the Web Interface

In another terminal:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 3: Compile Contracts

```bash
npm run compile
```

---

## Deploying to Sepolia Testnet

### Step 1: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your configuration:
   ```bash
   # Your wallet's private key (without 0x prefix)
   PRIVATE_KEY=your_private_key_here
   
   # Your RPC provider URL (choose one)
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   # OR
   # SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   
   # Etherscan API key for contract verification
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

### Step 2: Get an RPC Provider URL

Choose one of these providers:

**Alchemy** (Recommended):
1. Visit [alchemy.com](https://www.alchemy.com/)
2. Create account and create new app
3. Select Sepolia network
4. Copy the HTTP URL

**Infura**:
1. Visit [infura.io](https://infura.io/)
2. Create account and create new project
3. Select Sepolia network
4. Copy the project ID

**QuickNode**:
1. Visit [quicknode.com](https://www.quicknode.com/)
2. Create account and deploy endpoint
3. Select Sepolia network
4. Copy the URL

### Step 3: Get Etherscan API Key

1. Visit [etherscan.io](https://etherscan.io/)
2. Create a free account
3. Go to [API Keys](https://etherscan.io/apis)
4. Create a new API key

### Step 4: Fund Your Wallet

Send Sepolia ETH to the wallet address that corresponds to your `PRIVATE_KEY`. You'll need a small amount for gas fees (0.05 ETH is usually more than enough).

### Step 5: Deploy to Sepolia

```bash
npm run deploy:sepolia
```

The deployment script will:
1. Deploy MaliciousContract
2. Deploy SafeImplementation
3. Deploy SafeProxy with the SafeImplementation address
4. Display all contract addresses

Example output:
```
Deploying contracts with the account: 0xYourAddress...
Malicious Contract deployed to: 0x1234...
Safe Implementation deployed to: 0x5678...
Safe Proxy deployed to: 0x9abc...

All contracts deployed successfully!
```

### Step 6: (Optional) Verify Contracts

Verify the contracts on Etherscan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

---

## Using the Web Interface

The web interface provides a user-friendly way to interact with the demo.

### Access the Interface

- **Local**: [http://localhost:3000](http://localhost:3000)
- **Live Demo**: (if deployed)

### Interface Walkthrough

#### 1. Connect Your Wallet

1. Click the **"Connect Wallet"** button
2. Approve the connection in MetaMask
3. Ensure you're connected to the correct network:
   - For local: Localhost 8545
   - For Sepolia: Sepolia testnet

#### 2. Deploy Contracts

Follow this order:

**Step 1: Deploy Safe Implementation**
- Click **"Deploy Safe Implementation"**
- Approve the transaction in MetaMask
- Wait for confirmation
- Copy the deployed address

**Step 2: Deploy Safe Proxy**
- Enter or paste the Safe Implementation address
- Click **"Deploy Safe Proxy"**
- Approve the transaction
- Wait for confirmation
- Copy the Safe Proxy address

**Step 3: Deploy Malicious Contract**
- Click **"Deploy Malicious Contract"**
- Approve the transaction
- Wait for confirmation
- Copy the Malicious Contract address

#### 3. Execute the Exploit

Once all three contracts are deployed:

1. Click **"Execute Exploit"**
2. Approve the transaction
3. Wait for confirmation
4. The status will show "Exploit successful!"

#### 4. Verify the Attack

The UI will display:
- Previous implementation address (before attack)
- New implementation address (after attack - points to malicious contract)
- Explanation of what happened

---

## Manually Executing the Exploit

If you prefer to interact directly with the contracts, here's how to execute the exploit manually.

### Prerequisites

You'll need the contract addresses from deployment. Let's assume:
- `MALICIOUS_CONTRACT` = Address of deployed MaliciousContract
- `SAFE_PROXY` = Address of deployed SafeProxy

### Step 1: Get Current Implementation

```javascript
// In a browser console or via Hardhat console
const proxy = await ethers.getContractAt("SafeProxy", SAFE_PROXY);
const implementation = await proxy.getImplementation();
console.log("Current implementation:", implementation);
```

### Step 2: Execute the Exploit

```javascript
const malicious = await ethers.getContractAt("MaliciousContract", MALICIOUS_CONTRACT);

// Call transfer with attacker's address and any amount
// This will overwrite slot 0 in the proxy
const attackerAddress = "0xYourAddress";
const amount = ethers.parseEther("0");

await malicious.transfer(attackerAddress, amount);
```

### Step 3: Verify Implementation Changed

```javascript
const newImplementation = await proxy.getImplementation();
console.log("New implementation:", newImplementation);
console.log("Matches attacker address:", newImplementation.toLowerCase() === attackerAddress.toLowerCase());
```

### Using Hardhat Console

```bash
npx hardhat console --network sepolia
```

Then in the console:

```javascript
const [signer] = await ethers.getSigners();
const proxy = await ethers.getContractAt("SafeProxy", "SAFE_PROXY_ADDRESS");
const malicious = await ethers.getContractAt("MaliciousContract", "MALICIOUS_ADDRESS");

// Before
console.log("Before:", await proxy.getImplementation());

// Execute exploit
await malicious.transfer(signer.address, 0);

// After
console.log("After:", await proxy.getImplementation());
```

---

## Technical Details

### Storage Layout

#### SafeProxy Storage
```solidity
contract SafeProxy {
    address internal implementation; // Slot 0
    // ...
}
```

#### MaliciousContract Storage
```solidity
contract MaliciousContract {
    uint256 public _transfer; // Slot 0
    // ...
}
```

### The Attack Mechanism

1. **Normal Flow**: When a user calls a function on SafeProxy, it delegatecalls to the implementation stored in slot 0
2. **Attack Flow**: The malicious contract's `transfer()` function writes to slot 0
3. **Storage Collision**: Both contracts use slot 0 for different purposes
4. **Exploitation**: When called via proxy, the malicious write overwrites the implementation address

### Why This Works

- **Delegatecall**: Executes code in the context of the calling contract (proxy)
- **Shared Storage**: Both proxy and implementation share the same storage
- **Slot Collision**: Both contracts write to slot 0
- **Unchecked**: The malicious contract's storage write affects the proxy's storage

### Function Signatures

```
transfer(address,uint256) // 0xa9059cbb
```

The malicious contract's `transfer` function matches the standard ERC20 transfer signature, making it appear legitimate to automated analysis tools.

---

## Security Implications

### Why This Attack is Dangerous

1. **Complete Compromise**: Overwriting the implementation gives full control
2. **Stealth**: Function signature appears legitimate
3. **Automated Blindness**: Many tools won't detect storage collision issues
4. **Real-World Impact**: Similar vulnerabilities have been exploited in production

### Mitigation Strategies

1. **Storage Gap**: Use unstructured storage proxy pattern
2. **Append-Only Storage**: Never overwrite critical slots
3. **Immutable Implementation**: Use `immutable` keyword when possible
4. **Storage Layout Verification**: Automated checks for slot conflicts
5. **Professional Audits**: Always audit proxy patterns thoroughly

### Real-World Examples

Similar vulnerabilities have been discovered in:
- Safe (previously Gnosis Safe) - fixed in later versions
- Various DeFi protocols using upgradeable proxies
- Multiple token staking contracts

---

## Contract Architecture

### Contract Files

```
contracts/
├── SafeProxy.sol           # Proxy contract vulnerable to attack
├── SafeImplementation.sol  # Legitimate implementation
├── MaliciousContract.sol   # Attack contract
└── StorageExploit.sol      # Alternative exploit pattern
```

### Contract Functions

#### SafeProxy
- `getImplementation()` - Returns current implementation address
- `fallback()` - Delegates calls to implementation

#### SafeImplementation
- `setValue(uint256)` - Sets a stored value
- `getValue()` - Retrieves stored value

#### MaliciousContract
- `transfer(address,uint256)` - Overwrites storage slot 0
- `_transfer` - Storage variable at slot 0

---

## Troubleshooting

### Deployment Issues

**Error: "invalid transaction: insufficient funds"**
- Ensure your wallet has enough Sepolia ETH
- Get more from faucets listed above

**Error: "nonce too high"**
- Reset your MetaMask account by clicking your account → Settings → Advanced → Reset Account

**Error: "RPC rate limit exceeded"**
- Switch to a different RPC provider
- Use a private RPC endpoint

### Contract Interaction Issues

**Transaction fails with "revert"**
- Check you're on the correct network
- Verify contract addresses are correct
- Ensure contracts are deployed successfully

**Cannot connect wallet**
- Clear browser cache
- Update MetaMask
- Check network settings

### Compilation Errors

**"ParserError" or syntax errors**
- Run `npm run compile` to see full error messages
- Ensure Solidity version matches (0.8.19)
- Check for missing imports

### Network Issues

**Cannot switch to Sepolia**
- Manually add Sepolia in MetaMask:
  - Network Name: Sepolia
  - RPC URL: https://sepolia.infura.io/v3/your-key
  - Chain ID: 11155111
  - Currency: ETH

---

## Project Structure

```
bybit-attack-demo/
├── contracts/              # Smart contracts
│   ├── SafeProxy.sol
│   ├── SafeImplementation.sol
│   ├── MaliciousContract.sol
│   ├── StorageExploit.sol
│   └── ABI.ts
├── pages/                  # Next.js pages
│   ├── index.tsx          # Main demo interface
│   └── _app.tsx           # App configuration
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── styles/                 # CSS styles
│   └── globals.css
├── hardhat.config.js      # Hardhat configuration
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
└── README.md              # This file
```

---

## Available Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run compile          # Compile Solidity contracts
npm run deploy           # Deploy to local network
npm run deploy:sepolia   # Deploy to Sepolia testnet
npm run verify           # Verify contracts on Etherscan

# Build and Production
npm run build            # Build Next.js app
npm run start            # Start production server
npm run lint             # Run ESLint
```

---

## Contributing

This is an educational demo. If you find bugs or have suggestions:

1. Open an issue describing the problem
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

---

## License

MIT License - See LICENSE file for details

---

## Disclaimer

⚠️ **This code is for educational purposes only. Do not deploy to mainnet. Do not use maliciously. The authors are not responsible for any misuse of this code.**

By using this software, you agree that:
- You will not use this code for malicious purposes
- You will not use this code against real contracts
- You understand the security implications of this code
- You will use this code responsibly for learning and research only

---

## Additional Resources

- [Bybit Incident Analysis](https://rekt.news/bybit-rekt/)
- [Solidity Storage Layout](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)
- [OpenZeppelin Proxies](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies)
- [EVM Storage Vulnerabilities](https://www.trailofbits.com/research/1-rekt-billions-in-vulnerabilities/)

---

## Support

For questions or issues:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the contract code in `/contracts`

**Remember**: This is a demonstration. Always get professional security audits for real contracts.
