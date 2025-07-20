// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title ResumeZK
 * @dev 基于零知识证明的简历验证智能合约
 * 支持简历数据的链上存储、验证和各类学历/英语等级证书的管理
 */
contract ResumeZK {
    // 凭证类型枚举：学位、四级、六级
    enum CredentialType { DEGREE, CET4, CET6 }

    // 简历结构体
    struct Resume {
        bytes32 merkleRoot;     // 简历数据的Merkle树根，用于零知识验证
        address owner;          // 简历所有者地址
        uint256 timestamp;      // 创建时间戳
        bool verified;          // 是否已通过验证
    }

    // 凭证结构体
    struct Credential {
        CredentialType credType;  // 凭证类型
        string dataHash;          // 凭证数据哈希
        uint256 timestamp;        // 创建时间戳
        bool verified;            // 是否已验证
    }

    // 存储所有简历：简历哈希 => 简历数据
    mapping(bytes32 => Resume) public resumes;
    
    // 存储用户的简历列表：用户地址 => 简历哈希数组
    mapping(address => bytes32[]) public userResumes;
    
    // 存储用户凭证：用户地址 => 凭证类型 => 凭证数据
    mapping(address => mapping(CredentialType => Credential)) public userCredentials;

    // 简历提交事件
    event ResumeSubmitted(bytes32 indexed resumeHash, address indexed owner, bytes32 merkleRoot);
    
    // 简历验证事件
    event ResumeVerified(bytes32 indexed resumeHash, address indexed verifier);
    
    // 凭证存储事件
    event CredentialStored(address indexed user, CredentialType credType, string dataHash);

    /**
     * @dev 提交简历到链上
     * @param resumeHash 简历的唯一哈希标识
     * @param merkleRoot 简历数据的Merkle树根，用于后续零知识证明验证
     */
    function submitResume(bytes32 resumeHash, bytes32 merkleRoot) external {
        require(resumes[resumeHash].owner == address(0), "Resume already exists");
        
        // 创建新简历记录
        resumes[resumeHash] = Resume({
            merkleRoot: merkleRoot,
            owner: msg.sender,
            timestamp: block.timestamp,
            verified: false
        });
        
        // 添加到用户简历列表
        userResumes[msg.sender].push(resumeHash);
        
        // 发出简历提交事件
        emit ResumeSubmitted(resumeHash, msg.sender, merkleRoot);
    }

    /**
     * @dev 验证简历，将简历标记为已验证状态
     * @param resumeHash 要验证的简历哈希
     * 注意：任何人都可以调用此方法进行验证，实际应用中可能需要权限控制
     */
    function verifyResume(bytes32 resumeHash) external {
        require(resumes[resumeHash].owner != address(0), "Resume does not exist");
        require(!resumes[resumeHash].verified, "Resume already verified");
        
        // 标记简历为已验证
        resumes[resumeHash].verified = true;
        
        // 发出简历验证事件
        emit ResumeVerified(resumeHash, msg.sender);
    }

    /**
     * @dev 根据简历哈希获取简历详细信息
     * @param resumeHash 简历哈希
     * @return Resume 简历结构体，包含merkleRoot、owner、timestamp、verified等信息
     */
    function getResume(bytes32 resumeHash) external view returns (Resume memory) {
        return resumes[resumeHash];
    }

    /**
     * @dev 获取指定用户的所有简历哈希列表
     * @param user 用户地址
     * @return bytes32[] 该用户的所有简历哈希数组
     */
    function getUserResumes(address user) external view returns (bytes32[] memory) {
        return userResumes[user];
    }

    /**
     * @dev 存储用户凭证（学位证书、英语等级证书等）
     * @param credType 凭证类型（DEGREE学位、CET4四级、CET6六级）
     * @param dataHash 凭证数据的哈希值，用于验证凭证真实性
     */
    function storeCredential(CredentialType credType, string memory dataHash) external {
        // 创建并存储凭证信息
        userCredentials[msg.sender][credType] = Credential({
            credType: credType,
            dataHash: dataHash,
            timestamp: block.timestamp,
            verified: true  // 默认设置为已验证，实际应用中可能需要额外验证流程
        });

        // 发出凭证存储事件
        emit CredentialStored(msg.sender, credType, dataHash);
    }

    /**
     * @dev 获取指定用户的特定类型凭证信息
     * @param user 用户地址
     * @param credType 凭证类型
     * @return Credential 凭证结构体，包含类型、数据哈希、时间戳、验证状态
     */
    function getUserCredential(address user, CredentialType credType) external view returns (Credential memory) {
        return userCredentials[user][credType];
    }

    /**
     * @dev 检查指定用户是否拥有特定类型的已验证凭证
     * @param user 用户地址
     * @param credType 凭证类型
     * @return bool 如果用户拥有该类型的已验证凭证则返回true，否则返回false
     */
    function hasCredential(address user, CredentialType credType) external view returns (bool) {
        return userCredentials[user][credType].verified;
    }
}
