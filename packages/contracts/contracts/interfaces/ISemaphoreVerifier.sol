//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/// @title SemaphoreVerifier contract interface.
interface ISemaphoreVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[10] calldata _pubSignals
    ) external view returns (bool);
}
