// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ResumeZK {
    struct Resume {
        bytes32 merkleRoot;
        address owner;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => Resume) public resumes;
    mapping(address => bytes32[]) public userResumes;

    event ResumeSubmitted(bytes32 indexed resumeHash, address indexed owner, bytes32 merkleRoot);
    event ResumeVerified(bytes32 indexed resumeHash, address indexed verifier);

    function submitResume(bytes32 resumeHash, bytes32 merkleRoot) external {
        require(resumes[resumeHash].owner == address(0), "Resume already exists");
        
        resumes[resumeHash] = Resume({
            merkleRoot: merkleRoot,
            owner: msg.sender,
            timestamp: block.timestamp,
            verified: false
        });
        
        userResumes[msg.sender].push(resumeHash);
        
        emit ResumeSubmitted(resumeHash, msg.sender, merkleRoot);
    }

    function verifyResume(bytes32 resumeHash) external {
        require(resumes[resumeHash].owner != address(0), "Resume does not exist");
        require(!resumes[resumeHash].verified, "Resume already verified");
        
        resumes[resumeHash].verified = true;
        
        emit ResumeVerified(resumeHash, msg.sender);
    }

    function getResume(bytes32 resumeHash) external view returns (Resume memory) {
        return resumes[resumeHash];
    }

    function getUserResumes(address user) external view returns (bytes32[] memory) {
        return userResumes[user];
    }
}
