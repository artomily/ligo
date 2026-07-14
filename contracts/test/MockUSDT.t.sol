// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MockUSDT} from "../src/MockUSDT.sol";

contract MockUSDTTest is Test {
    MockUSDT usdt;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        usdt = new MockUSDT();
    }

    function test_Metadata() public view {
        assertEq(usdt.name(), "Tether USD");
        assertEq(usdt.symbol(), "USDT");
        assertEq(usdt.decimals(), 6);
    }

    function test_FaucetMints100() public {
        vm.prank(alice);
        usdt.faucet();
        assertEq(usdt.balanceOf(alice), 100e6);
        assertEq(usdt.totalSupply(), 100e6);
    }

    function test_FaucetIsRepeatable() public {
        vm.startPrank(alice);
        usdt.faucet();
        usdt.faucet();
        vm.stopPrank();
        assertEq(usdt.balanceOf(alice), 200e6);
    }

    function test_Transfer() public {
        vm.prank(alice);
        usdt.faucet();
        vm.prank(alice);
        assertTrue(usdt.transfer(bob, 45e6));
        assertEq(usdt.balanceOf(alice), 55e6);
        assertEq(usdt.balanceOf(bob), 45e6);
    }

    function test_RevertWhen_TransferExceedsBalance() public {
        vm.prank(alice);
        usdt.faucet();
        vm.prank(alice);
        vm.expectRevert("USDT: insufficient balance");
        usdt.transfer(bob, 101e6);
    }

    function test_RevertWhen_TransferToZero() public {
        vm.prank(alice);
        usdt.faucet();
        vm.prank(alice);
        vm.expectRevert("USDT: transfer to zero address");
        usdt.transfer(address(0), 1e6);
    }

    function test_ApproveAndTransferFrom() public {
        vm.prank(alice);
        usdt.faucet();
        vm.prank(alice);
        usdt.approve(bob, 50e6);
        vm.prank(bob);
        assertTrue(usdt.transferFrom(alice, bob, 30e6));
        assertEq(usdt.balanceOf(bob), 30e6);
        assertEq(usdt.allowance(alice, bob), 20e6);
    }

    function test_RevertWhen_TransferFromExceedsAllowance() public {
        vm.prank(alice);
        usdt.faucet();
        vm.prank(alice);
        usdt.approve(bob, 10e6);
        vm.prank(bob);
        vm.expectRevert("USDT: insufficient allowance");
        usdt.transferFrom(alice, bob, 11e6);
    }

    function test_InfiniteAllowanceNotDecremented() public {
        vm.prank(alice);
        usdt.faucet();
        vm.prank(alice);
        usdt.approve(bob, type(uint256).max);
        vm.prank(bob);
        usdt.transferFrom(alice, bob, 40e6);
        assertEq(usdt.allowance(alice, bob), type(uint256).max);
    }
}
