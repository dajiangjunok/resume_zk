// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ResumeZK} from "../src/ResumeZK.sol";

contract ResumeZKTest is Test {
    ResumeZK public resumeZK;
    address public user1;
    address public user2;

    function setUp() public {
        resumeZK = new ResumeZK();
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
    }

    function test_SubmitResume() public {
        bytes32 resumeHash = keccak256("test-resume");
        bytes32 merkleRoot = keccak256("test-merkle-root");

        vm.prank(user1);
        resumeZK.submitResume(resumeHash, merkleRoot);

        ResumeZK.Resume memory resume = resumeZK.getResume(resumeHash);
        assertEq(resume.owner, user1);
        assertEq(resume.merkleRoot, merkleRoot);
        assertEq(resume.verified, false);
    }

    function test_VerifyResume() public {
        bytes32 resumeHash = keccak256("test-resume");
        bytes32 merkleRoot = keccak256("test-merkle-root");

        vm.prank(user1);
        resumeZK.submitResume(resumeHash, merkleRoot);

        vm.prank(user2);
        resumeZK.verifyResume(resumeHash);

        ResumeZK.Resume memory resume = resumeZK.getResume(resumeHash);
        assertEq(resume.verified, true);
    }

    function test_GetUserResumes() public {
        bytes32 resumeHash1 = keccak256("test-resume-1");
        bytes32 resumeHash2 = keccak256("test-resume-2");
        bytes32 merkleRoot = keccak256("test-merkle-root");

        vm.startPrank(user1);
        resumeZK.submitResume(resumeHash1, merkleRoot);
        resumeZK.submitResume(resumeHash2, merkleRoot);
        vm.stopPrank();

        bytes32[] memory userResumes = resumeZK.getUserResumes(user1);
        assertEq(userResumes.length, 2);
        assertEq(userResumes[0], resumeHash1);
        assertEq(userResumes[1], resumeHash2);
    }
}
