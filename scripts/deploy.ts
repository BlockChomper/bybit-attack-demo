import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Malicious Contract
  const MaliciousContract = await ethers.getContractFactory("MaliciousContract");
  const malicious = await MaliciousContract.deploy();
  await malicious.waitForDeployment();
  const maliciousAddress = await malicious.getAddress();
  console.log("Malicious Contract deployed to:", maliciousAddress);

  // Deploy Safe Implementation
  const SafeImplementation = await ethers.getContractFactory("SafeImplementation");
  const safeImpl = await SafeImplementation.deploy();
  await safeImpl.waitForDeployment();
  const safeImplAddress = await safeImpl.getAddress();
  console.log("Safe Implementation deployed to:", safeImplAddress);

  // Deploy Safe Proxy
  const SafeProxy = await ethers.getContractFactory("SafeProxy");
  const safeProxy = await SafeProxy.deploy(safeImplAddress);
  await safeProxy.waitForDeployment();
  const safeProxyAddress = await safeProxy.getAddress();
  console.log("Safe Proxy deployed to:", safeProxyAddress);

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("✅ ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
  console.log("═══════════════════════════════════════════════════════");
  console.log("\n📋 Copy these addresses for the UI:");
  console.log("\nMalicious Contract:");
  console.log(maliciousAddress);
  console.log("\nSafe Implementation:");
  console.log(safeImplAddress);
  console.log("\nSafe Proxy:");
  console.log(safeProxyAddress);
  console.log("\n🔗 Etherscan Links:");
  console.log(`https://sepolia.etherscan.io/address/${maliciousAddress}`);
  console.log(`https://sepolia.etherscan.io/address/${safeImplAddress}`);
  console.log(`https://sepolia.etherscan.io/address/${safeProxyAddress}`);
  console.log("\n💡 Paste these addresses into the UI's 'Manual Address Entry' section");
  console.log("═══════════════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
