'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useResumeZK } from '@/hooks/useResumeZK'
import { CredentialType } from '@/lib/resumezk-contract'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ResumeContractDemo() {
  const { address } = useAccount()
  const {
    submitResume,
    verifyResume,
    storeCredential,
    userResumes,
    getResume,
    getUserCredential,
    hasCredential,
    contractAddress
  } = useResumeZK()

  const [resumeHash, setResumeHash] = useState('')
  const [merkleRoot, setMerkleRoot] = useState('')
  const [credentialDataInput, setCredentialDataInput] = useState('')
  const [selectedCredType, setSelectedCredType] = useState<CredentialType>(CredentialType.DEGREE)
  const [queryResumeHash, setQueryResumeHash] = useState('')

  // 查询简历数据
  const { data: resumeData, isLoading: isLoadingResume } = getResume(queryResumeHash)
  
  // 查询用户凭证
  const { data: credentialData, isLoading: isLoadingCred } = getUserCredential(address, selectedCredType)
  
  // 查询是否有凭证
  const { data: hasUserCred, isLoading: isLoadingHasCred } = hasCredential(address, selectedCredType)

  const handleSubmitResume = () => {
    if (resumeHash && merkleRoot) {
      submitResume.submitResume(resumeHash, merkleRoot)
    }
  }

  const handleVerifyResume = () => {
    if (queryResumeHash) {
      verifyResume.verifyResume(queryResumeHash)
    }
  }

  const handleStoreCredential = () => {
    if (credentialDataInput) {
      storeCredential.storeCredential(selectedCredType, credentialDataInput)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ResumeZK 合约交互演示</CardTitle>
          <CardDescription>
            合约地址: {contractAddress}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!address && (
            <p className="text-yellow-600">请先连接钱包</p>
          )}
        </CardContent>
      </Card>

      {address && (
        <>
          {/* 提交简历 */}
          <Card>
            <CardHeader>
              <CardTitle>提交简历</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="简历哈希 (bytes32)"
                value={resumeHash}
                onChange={(e) => setResumeHash(e.target.value)}
              />
              <Input
                placeholder="Merkle根 (bytes32)"
                value={merkleRoot}
                onChange={(e) => setMerkleRoot(e.target.value)}
              />
              <Button 
                onClick={handleSubmitResume}
                disabled={submitResume.isPending || submitResume.isConfirming}
              >
                {submitResume.isPending ? '提交中...' : 
                 submitResume.isConfirming ? '确认中...' : '提交简历'}
              </Button>
              {submitResume.isSuccess && (
                <p className="text-green-600">简历提交成功！</p>
              )}
              {submitResume.error && (
                <p className="text-red-600">错误: {submitResume.error.message}</p>
              )}
            </CardContent>
          </Card>

          {/* 存储凭证 */}
          <Card>
            <CardHeader>
              <CardTitle>存储凭证</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                value={selectedCredType}
                onChange={(e) => setSelectedCredType(Number(e.target.value) as CredentialType)}
                className="w-full p-2 border rounded"
              >
                <option value={CredentialType.DEGREE}>学历 (DEGREE)</option>
                <option value={CredentialType.CET4}>CET4</option>
                <option value={CredentialType.CET6}>CET6</option>
              </select>
              <Input
                placeholder="凭证数据 (JSON字符串)"
                value={credentialDataInput}
                onChange={(e) => setCredentialDataInput(e.target.value)}
              />
              <Button 
                onClick={handleStoreCredential}
                disabled={storeCredential.isPending || storeCredential.isConfirming}
              >
                {storeCredential.isPending ? '存储中...' : 
                 storeCredential.isConfirming ? '确认中...' : '存储凭证'}
              </Button>
              {storeCredential.isSuccess && (
                <p className="text-green-600">凭证存储成功！</p>
              )}
              {storeCredential.error && (
                <p className="text-red-600">错误: {storeCredential.error.message}</p>
              )}
            </CardContent>
          </Card>

          {/* 查询简历 */}
          <Card>
            <CardHeader>
              <CardTitle>查询简历</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="简历哈希"
                value={queryResumeHash}
                onChange={(e) => setQueryResumeHash(e.target.value)}
              />
              <Button 
                onClick={handleVerifyResume}
                disabled={verifyResume.isPending || verifyResume.isConfirming}
              >
                验证简历
              </Button>
              
              {isLoadingResume && <p>查询中...</p>}
              {resumeData && (
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">简历信息:</h4>
                  <p>所有者: {resumeData.owner}</p>
                  <p>Merkle根: {resumeData.merkleRoot}</p>
                  <p>时间戳: {new Date(Number(resumeData.timestamp) * 1000).toLocaleString()}</p>
                  <p>已验证: <Badge variant={resumeData.verified ? "default" : "secondary"}>
                    {resumeData.verified ? "是" : "否"}
                  </Badge></p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 用户简历列表 */}
          <Card>
            <CardHeader>
              <CardTitle>我的简历</CardTitle>
            </CardHeader>
            <CardContent>
              {userResumes.isLoading && <p>加载中...</p>}
              {userResumes.data && userResumes.data.length > 0 ? (
                <div className="space-y-2">
                  {userResumes.data.map((hash, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      简历 #{index + 1}: {hash}
                    </div>
                  ))}
                </div>
              ) : (
                <p>暂无简历</p>
              )}
            </CardContent>
          </Card>

          {/* 用户凭证信息 */}
          <Card>
            <CardHeader>
              <CardTitle>我的凭证</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                value={selectedCredType}
                onChange={(e) => setSelectedCredType(Number(e.target.value) as CredentialType)}
                className="w-full p-2 border rounded"
              >
                <option value={CredentialType.DEGREE}>学历 (DEGREE)</option>
                <option value={CredentialType.CET4}>CET4</option>
                <option value={CredentialType.CET6}>CET6</option>
              </select>
              
              {isLoadingHasCred && <p>检查中...</p>}
              {hasUserCred !== undefined && (
                <p>拥有该凭证: <Badge variant={hasUserCred ? "default" : "secondary"}>
                  {hasUserCred ? "是" : "否"}
                </Badge></p>
              )}
              
              {isLoadingCred && <p>加载凭证详情中...</p>}
              {credentialData && (
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">凭证详情:</h4>
                  <p>类型: {CredentialType[credentialData.credType]}</p>
                  <p>数据哈希: {credentialData.dataHash}</p>
                  <p>时间戳: {new Date(Number(credentialData.timestamp) * 1000).toLocaleString()}</p>
                  <p>已验证: <Badge variant={credentialData.verified ? "default" : "secondary"}>
                    {credentialData.verified ? "是" : "否"}
                  </Badge></p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}