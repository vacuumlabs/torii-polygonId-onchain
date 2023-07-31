// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Imports
// ========================================================
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";

// Main Contract
// ========================================================
contract ERC20Verifier is ERC20, ZKPVerifier {
    // Variables
    uint64 public constant TRANSFER_REQUEST_ID = 1;
    uint256 public TOKEN_AMOUNT_FOR_AIRDROP_PER_ID =
        5 * 10**uint256(decimals());
    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    // Functions
    /**
     * @dev constructor
     */
    constructor(string memory name_, string memory symbol_)
        ERC20(name_, symbol_)
    {}

    /**
     * @dev _afterProofSubmit
     */
    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        uint256 id = inputs[validator.getChallengeInputIndex()];
       
    }
}
