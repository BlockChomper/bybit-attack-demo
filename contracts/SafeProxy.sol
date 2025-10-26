// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SafeProxy - Simplified Safe Proxy for Demo
 * @dev This is a simplified version of a Safe proxy for demonstration purposes
 *      It uses storage slot 0 to store the implementation address
 */
contract SafeProxy {
    // Storage slot 0 - stores the implementation address
    address internal implementation;
    
    /**
     * @dev Fallback function that delegatecalls to the implementation
     */
    fallback() external payable {
        address impl = implementation;
        require(impl != address(0), "Proxy: implementation not set");
        
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    /**
     * @dev Get the current implementation address
     */
    function getImplementation() external view returns (address) {
        return implementation;
    }
    
    /**
     * @dev Constructor to initialize the proxy with an implementation
     */
    constructor(address _implementation) {
        implementation = _implementation;
    }
}
