# Contract ABIs

This directory contains individual ABI JSON files for each contract.

## Files

- `MaliciousContract.abi.json` - ABI for the malicious contract
- `SafeImplementation.abi.json` - ABI for the Safe implementation
- `SafeProxy.abi.json` - ABI for the Safe proxy

## Usage

### In TypeScript/JavaScript

```typescript
import MaliciousABI from '../abis/MaliciousContract.abi.json'
import SafeImplABI from '../abis/SafeImplementation.abi.json'
import SafeProxyABI from '../abis/SafeProxy.abi.json'

// Use with ethers.js
const contract = new ethers.Contract(address, MaliciousABI, signer)
```

### In React/Next.js

```typescript
import { useState } from 'react'
import MaliciousABI from '../abis/MaliciousContract.abi.json'

function MyComponent() {
  const [contract, setContract] = useState(null)
  
  useEffect(() => {
    if (provider && address) {
      const contract = new ethers.Contract(
        address,
        MaliciousABI,
        provider.getSigner()
      )
      setContract(contract)
    }
  }, [provider, address])
  
  return <div>...</div>
}
```

### Direct Fetch

```typescript
// Fetch from public directory
const response = await fetch('/abis/MaliciousContract.abi.json')
const MaliciousABI = await response.json()
```

## Contract Functions

### MaliciousContract
- `_transfer()` view → uint256 (storage slot 0)
- `transfer(address recipient, uint256 amount)` payable

### SafeImplementation
- `getValue()` view → uint256
- `setValue(uint256 _value)`
- `transfer(address recipient, uint256 amount)` pure

### SafeProxy
- `getImplementation()` view → address
- `fallback()` payable (delegatecalls to implementation)

## Deployment Addresses

After deployment, you'll have these addresses:
- MaliciousContract: `0x...`
- SafeImplementation: `0x...`
- SafeProxy: `0x...`

Use these addresses with the corresponding ABI files to interact with the contracts.

