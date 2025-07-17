// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ResumeZK} from "../src/ResumeZK.sol";

contract DeployScript is Script {
    ResumeZK public resumeZK;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        resumeZK = new ResumeZK();
        console.log("ResumeZK deployed to:", address(resumeZK));

        vm.stopBroadcast();
    }
}
