// Complete ABIs for all contracts
// Use this for interacting with deployed contracts

export const MaliciousContractABI = [
  {
    inputs: [],
    name: "_transfer",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

export const SafeImplementationABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "pure",
    type: "function"
  }
];

export const SafeProxyABI = [
  {
    inputs: [{ internalType: "address", name: "_implementation", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    stateMutability: "payable",
    type: "fallback"
  },
  {
    inputs: [],
    name: "getImplementation",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
];

// All ABIs combined for easy access
export const AllABIs = {
  MaliciousContract: MaliciousContractABI,
  SafeImplementation: SafeImplementationABI,
  SafeProxy: SafeProxyABI
};

