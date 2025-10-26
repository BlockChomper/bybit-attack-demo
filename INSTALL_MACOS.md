# macOS Installation Guide

## Quick Install (Recommended Method)

### Step 1: Install Homebrew (Package Manager)

Open Terminal and run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts (it will ask for your password). The installation takes 5-10 minutes.

After installation, you may need to run:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 2: Install Node.js and npm

```bash
brew install node
```

This installs:
- **Node.js** (JavaScript runtime)
- **npm** (Node Package Manager) - automatically included with Node.js

### Step 3: Verify Installation

```bash
node --version
npm --version
```

You should see version numbers (Node.js 18+ and npm 9+).

### Step 4: Install Git (if not already installed)

```bash
brew install git
```

### Step 5: Clone and Install Project Dependencies

```bash
# Navigate to your project directory
cd ~/bybit-attack-demo

# Install project dependencies
npm install
```

---

## Alternative Method: Direct Download

If you don't want to use Homebrew:

### Step 1: Download Node.js

1. Go to https://nodejs.org/
2. Click the **"LTS"** (Long Term Support) button
3. Download the macOS installer (.pkg file)
4. Run the installer
5. Follow the installation wizard

### Step 2: Verify Installation

```bash
node --version
npm --version
```

### Step 3: Install Git

Download from: https://git-scm.com/download/mac

Or use the Xcode Command Line Tools:
```bash
xcode-select --install
```

---

## Install MetaMask (Browser Extension)

1. Go to https://metamask.io/
2. Click **"Download"**
3. Select **Chrome**, **Firefox**, **Brave**, or **Edge**
4. Click **"Install MetaMask"**
5. Follow the setup wizard to create or import a wallet
6. ⚠️ **IMPORTANT**: Never share your seed phrase with anyone!

---

## Setting Up Your Development Environment

### 1. Install Project Dependencies

```bash
cd ~/bybit-attack-demo
npm install
```

### 2. Create Environment File

```bash
cp .env.example .env
```

### 3. Edit .env File

```bash
nano .env
```

Add your configuration (see main README for details):
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_rpc_url_here
ETHERSCAN_API_KEY=your_api_key_here
```

Save and exit (Ctrl+X, then Y, then Enter).

---

## Testing Your Installation

### Test 1: Check Node.js and npm
```bash
node --version
npm --version
```

Expected output: Version numbers (e.g., `v20.0.0` and `10.0.0`)

### Test 2: Install Project
```bash
cd ~/bybit-attack-demo
npm install
```

Expected output: Installed packages listed, no errors

### Test 3: Compile Contracts
```bash
npm run compile
```

Expected output: Success message and artifacts created

---

## Common Issues

### Issue 1: "Command not found: brew"
**Solution**: You need to install Homebrew first (see Step 1 above)

### Issue 2: "Permission denied" errors
**Solution**: 
```bash
sudo chown -R $(whoami) /usr/local/*
```

Or if using Homebrew on Apple Silicon (M1/M2):
```bash
sudo chown -R $(whoami) /opt/homebrew/*
```

### Issue 3: Node.js version is outdated
**Solution**:
```bash
brew upgrade node
```

### Issue 4: npm install fails
**Solution**: Clear npm cache and try again
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Issue 5: "EACCES" permission errors
**Solution**: Fix npm permissions (choose one method):

**Option A - Use npx without sudo:**
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Option B - Reinstall Node.js with Homebrew:**
```bash
brew uninstall node
brew install node
```

---

## Next Steps

Once everything is installed:

1. **Start Local Blockchain**:
   ```bash
   npx hardhat node
   ```

2. **Start Web Interface** (in another terminal):
   ```bash
   npm run dev
   ```

3. **Open in Browser**: http://localhost:3000

---

## System Requirements

- **macOS**: 10.15 (Catalina) or later
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space
- **Internet**: Required for downloading packages

---

## Need Help?

- Check the main `README.md` for project-specific instructions
- Node.js docs: https://nodejs.org/docs
- Homebrew docs: https://docs.brew.sh
- Troubleshoot npm: https://docs.npmjs.com/common-errors

