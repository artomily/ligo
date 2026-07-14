// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDT} from "../src/MockUSDT.sol";

/// Deploy to Base Sepolia:
///   forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org \
///     --private-key $DEPLOYER_KEY --broadcast
contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        MockUSDT usdt = new MockUSDT();
        vm.stopBroadcast();
        console.log("MockUSDT deployed at:", address(usdt));
    }
}
