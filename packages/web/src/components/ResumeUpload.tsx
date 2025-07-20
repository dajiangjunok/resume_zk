'use client'

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { Upload, FileText, AlertCircle, CheckCircle, Loader, Shield, ExternalLink } from 'lucide-react'
import Cet4ZktlsComponent from './zktls/Cet4Zktls'
import DegreeZktlsComponent from './zktls/DigreeZktls'
import { parseResumeFile, validateResumeFile } from '../lib/resume-parser'
import { ShareButton } from './ShareButton'

interface UploadedFile {
  name: string
  size: number
  type: string
  content?: string
}

interface ResumeInfo {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  education: {
    degree: string
    university: string
    graduationYear: string
    major: string
    gpa?: string
    englishLevel?: string
  }
  experience: {
    company: string
    position: string
    duration: string
    description: string
  }[]
  skills: string[]
  certifications?: string[]
  languages?: {
    language: string
    level: string
    certification: string
  }[]
}

export function ResumeUpload() {
  const { isConnected } = useAccount()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  
  // 验证状态管理
  const [degreeVerified, setDegreeVerified] = useState(false)
  const [cetVerified, setCetVerified] = useState(false)
  const [degreeError, setDegreeError] = useState('')
  const [cetError, setCetError] = useState('')

  const handleFileUpload = useCallback(async (file: File) => {
    // 使用新的文件验证函数
    const validationError = validateResumeFile(file)
    if (validationError) {
      alert(validationError)
      return
    }

    const fileInfo: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
    }

    setUploadedFile(fileInfo)
    setIsProcessing(true)

    try {
      // 使用新的简历解析功能
      const parsedInfo = await parseResumeFile(file)
      setResumeInfo(parsedInfo)
    } catch (error) {
      console.error('简历解析失败:', error)
      alert(error instanceof Error ? error.message : '解析失败，请重试')
      setResumeInfo(null)
    } finally {
      setIsProcessing(false)
    }
  }, [])

 

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">请先连接钱包</h3>
        <p className="text-muted-foreground">
          您需要连接到Monad测试网才能使用简历分析功能
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
        />
        <label htmlFor="resume-upload" className="cursor-pointer">
          <Upload className="w-8 md:w-12 h-8 md:h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2">上传您的简历</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4 px-2">
            <span className="hidden sm:inline">将PDF或DOC文件拖拽到此处，或点击选择文件</span>
            <span className="sm:hidden">点击选择PDF或DOC文件</span>
          </p>
          <div className="gradient-bg text-white px-4 md:px-6 py-2 rounded-lg font-medium inline-block hover:opacity-90 transition-opacity text-sm md:text-base">
            选择文件
          </div>
        </label>
      </div>

      {/* 文件信息 */}
      {uploadedFile && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {isProcessing ? (
              <Loader className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>
      )}

      {/* 处理进度 */}
      {isProcessing && (
        <div className="border rounded-lg p-6 text-center">
          <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">正在解析您的简历...</h3>
          <p className="text-muted-foreground">
            我们正在提取您的简历信息，请稍候
          </p>
        </div>
      )}

      {/* 简历信息显示 */}
      {resumeInfo && !isProcessing && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold">简历信息</h3>
              <ShareButton 
                resumeData={resumeInfo} 
                className="scale-90"
              />
            </div>
            
            {/* 个人信息 */}
            <div className="mb-6">
              <h4 className="font-semibold text-primary mb-3 text-sm md:text-base">👤 个人信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-muted-foreground">姓名:</span>
                  <span className="ml-2 font-medium">{resumeInfo.personalInfo.name}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">邮箱:</span>
                  <span className="ml-2 font-medium">{resumeInfo.personalInfo.email}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">电话:</span>
                  <span className="ml-2 font-medium">{resumeInfo.personalInfo.phone}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">地址:</span>
                  <span className="ml-2 font-medium">{resumeInfo.personalInfo.location}</span>
                </div>
              </div>
            </div>

            {/* 教育背景 */}
            <div className="mb-6">
              <h4 className="font-semibold text-primary mb-3 text-sm md:text-base">🎓 教育背景</h4>
              <div className="border rounded-lg p-4 bg-secondary/20">
                <div className="space-y-2">
                  <div className="font-medium text-sm md:text-base">
                    {resumeInfo.education.degree}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-between">
                    <span className="text-sm text-muted-foreground">
                      {resumeInfo.education.university} • {resumeInfo.education.major}
                    </span>
                    <div className="scale-75">
                      <DegreeZktlsComponent
                        isVerified={degreeVerified}
                        onVerificationChange={setDegreeVerified}
                        name={resumeInfo.personalInfo.name}
                        errorMessage={degreeError}
                        onErrorMessageChange={setDegreeError}
                      />
                    </div>
                  </div>
                  {degreeError && (
                    <div className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded border-l-2 border-red-200">
                      ⚠️ {degreeError}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    毕业年份: {resumeInfo.education.graduationYear}
                  </div>
                  {resumeInfo.education.gpa && (
                    <div className="text-xs text-muted-foreground">
                      GPA: {resumeInfo.education.gpa}
                    </div>
                  )}
                  {resumeInfo.education.englishLevel && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-xs text-green-600 font-medium">
                          英语水平: {resumeInfo.education.englishLevel}
                        </span>
                        <div className="scale-75">
                          <Cet4ZktlsComponent
                            isVerified={cetVerified}
                            onVerificationChange={setCetVerified}
                            name={resumeInfo.personalInfo.name}
                            errorMessage={cetError}
                            onErrorMessageChange={setCetError}
                          />
                        </div>
                      </div>
                      {cetError && (
                        <div className="text-xs text-red-600 p-2 bg-red-50 rounded border-l-2 border-red-200">
                          ⚠️ {cetError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 工作经历 */}
            <div className="mb-6">
              <h4 className="font-semibold text-primary mb-3 text-sm md:text-base">💼 工作经历</h4>
              <div className="space-y-3">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-secondary/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm md:text-base">{exp.position}</div>
                      <div className="text-xs text-muted-foreground">{exp.duration}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{exp.company}</div>
                    <div className="text-xs text-muted-foreground">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 技能标签 */}
            <div className="mb-6">
              <h4 className="font-semibold text-primary mb-3 text-sm md:text-base">🛠️ 技能</h4>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {resumeInfo.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 证书 */}
            {resumeInfo.certifications && resumeInfo.certifications.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-primary mb-3 text-sm md:text-base">📜 证书</h4>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {resumeInfo.certifications.map((cert: string, index: number) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 语言能力 */}
            {resumeInfo.languages && resumeInfo.languages.length > 0 && (
              <div>
                <h4 className="font-semibold text-primary mb-3 text-sm md:text-base">🌐 语言能力</h4>
                <div className="space-y-2">
                  {resumeInfo.languages.map((lang, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-blue-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{lang.language}</span>
                        <span className="text-xs text-blue-600">{lang.level}</span>
                      </div>
                      {lang.certification && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {lang.certification}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}