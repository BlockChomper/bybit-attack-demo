# Contract Deployment Guide

## Current Status

You mentioned you **can't deploy contracts at the moment**. Here's what you need:

## Option 1: Install Prerequisites First (Recommended)

### Step 1: Install Node.js and npm

You need to install these first to deploy contracts. Follow the instructions in `INSTALL_MACOS.md`:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

### Step 2: Install Project Dependencies

```bash
cd ~/bybit-attack-demo
npm install
```

### Step 3: Configure for Sepolia

1. Create a `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` file and add:
```
PRIVATE_KEY=your_private_key_without_0x_prefix
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 4: Get Sepolia ETH

Visit one of these faucets:
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia

### Step 5: Deploy Contracts

```bash
npm run compile    # Compile contracts
npm run deploy:sepolia  # Deploy to Sepolia
```

This will output all contract addresses that you can then paste into the UI.

---

## Option 2: Use a Pre-Deployed Demo (If Available)

If someone has already deployed the contracts, you can:
1. Get the deployed addresses
2. Paste them into the UI's "Manual Address Entry"
3. Test the exploit on those contracts

---

## Option 3: Manual Deployment Instructions

If you want to deploy contracts manually without the UI, here's how:

### Step 1: Get Your Wallet Ready
- Install MetaMask
- Get Sepolia testnet ETH
- Make sure you have enough gas

### Step 2: Compile Contracts
```bash
npm run compile
```

### Step 3: Deploy via Script
```bash
npm run deploy:sepolia
```

The script will show output like:
```
✅ ALL CONTRACTS DEPLOYED SUCCESSFULLY!
═══════════════════════════════════════════════════════

📋 Copy these addresses for the UI:

Malicious Contract:
0x1234567890abcdef...

Safe Implementation:
0xabcdef1234567890...

Safe Proxy:
0x7890abcdef123456...
```

### Step 4: Copy Addresses to UI
- Start the UI: `npm run dev`
- Go to "Manual Address Entry" section
- Paste all three addresses
- Click "Load Addresses"

---

## What You Need Right Now

**To deploy contracts, you need:**

1. ✅ **Node.js installed** (you don't have this yet)
2. ✅ **npm installed** (comes with Node.js)
3. ✅ **MetaMask installed** in browser
4. ✅ **Sepolia ETH** in your wallet
5. ✅ **RPC provider** (Alchemy, Infura, etc.)
6. ✅ **Project dependencies** installed via `npm install`

---

## Quick Check

Run this to see what you're missing:
```bash
which node    # Should show path to node
which npm     # Should show path to npm
which brew    # Should show path to homebrew
```

If any of these say "not found", you need to install them first.

---

## Next Steps

**If you haven't installed Node.js yet:**
1. Follow `INSTALL_MACOS.md`
2. Install Homebrew and Node.js
3. Then come back and deploy

**If you have Node.js installed:**
1. Run `npm install`
2. Set up `.env` file
3. Get Sepolia ETH
4. Run `npm run deploy:sepolia`
5. Copy addresses to UI

---

## Alternative: Test on Local Network First

If you want to test locally without Sepolia:

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy to localhost
npm run deploy

# Terminal 3: Start UI
npm run dev
```

Then connect MetaMask to `http://localhost:8545` network.

---

## Need Help?

- Check browser console (F12) for errors
- Make sure MetaMask is unlocked
- Ensure you're on Sepolia network
- Verify you have enough ETH for gas

