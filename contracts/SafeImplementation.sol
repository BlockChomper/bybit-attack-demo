// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SafeImplementation - Legitimate Safe Implementation
 * @dev This represents a legitimate Safe implementation
 */
contract SafeImplementation {
    uint256 private storedValue;
    
    function setValue(uint256 _value) external {
        storedValue = _value;
    }
    
    function getValue() external view returns (uint256) {
        return storedValue;
    }
    
    function transfer(address recipient, uint256 amount) external pure {
        // This is a legitimate transfer function that doesn't touch storage slot 0
        // This is what should happen in a real Safe
    }
}
