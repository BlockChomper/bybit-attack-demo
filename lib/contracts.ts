// Contract bytecode and ABIs for deployment from UI
import { MaliciousContractABI, SafeImplementationABI, SafeProxyABI } from '../contracts/ABI'

// Note: These bytecode values need to be filled from compiled artifacts
// Run: npm run compile, then check artifacts/contracts/*.sol/*.json

export const contractBytecode = {
  // To get these, run: npm run compile
  // Then check: artifacts/contracts/MaliciousContract.sol/MaliciousContract.json
  // Copy the "bytecode" field
  
  SafeImplementation: '', // Fill after compilation
  MaliciousContract: '', // Fill after compilation  
  SafeProxy: '' // Fill after compilation
}

export const contractABIs = {
  SafeImplementation: SafeImplementationABI,
  MaliciousContract: MaliciousContractABI,
  SafeProxy: SafeProxyABI
}

// Helper function to deploy a contract from UI
export async function deployContract(
  provider: any,
  contractName: 'SafeImplementation' | 'MaliciousContract' | 'SafeProxy',
  constructorArgs: any[] = []
): Promise<string> {
  const signer = await provider.getSigner()
  
  // Get the bytecode
  const bytecode = contractBytecode[contractName]
  
  if (!bytecode || bytecode === '') {
    throw new Error(`Contract ${contractName} not compiled. Please run: npm run compile`)
  }
  
  // Get the ABI
  const abi = contractABIs[contractName]
  
  // Create factory
  const factory = new (await import('ethers')).ContractFactory(abi, bytecode, signer)
  
  // Deploy
  const contract = await factory.deploy(...constructorArgs)
  await contract.waitForDeployment()
  
  const address = await contract.getAddress()
  return address
}

