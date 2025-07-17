'use client'

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { Upload, FileText, AlertCircle, CheckCircle, Loader, Shield, ExternalLink } from 'lucide-react'

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
  }
  experience: {
    company: string
    position: string
    duration: string
    description: string
  }[]
  skills: string[]
}

export function ResumeUpload() {
  const { isConnected } = useAccount()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      alert('请上传PDF或DOC格式的简历文件')
      return
    }

    const fileInfo: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
    }

    setUploadedFile(fileInfo)
    setIsProcessing(true)

    // 模拟解析简历信息
    setTimeout(() => {
      setResumeInfo({
        personalInfo: {
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138000',
          location: '北京市海淀区'
        },
        education: {
          degree: '计算机科学与技术学士',
          university: '清华大学',
          graduationYear: '2020',
          major: '计算机科学与技术'
        },
        experience: [
          {
            company: '字节跳动',
            position: '前端开发工程师',
            duration: '2020.07 - 2023.08',
            description: '负责前端业务开发，使用React、TypeScript等技术栈'
          },
          {
            company: '阿里巴巴',
            position: '高级前端开发工程师',
            duration: '2023.09 - 至今',
            description: '负责核心业务前端架构设计和开发'
          }
        ],
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Vue.js', 'JavaScript']
      })
      setIsProcessing(false)
    }, 2000)
  }, [])

  const handleEducationVerification = useCallback(async () => {
    try {
      // 这里集成Primus SDK进行学信网验证
      // 根据docs/primus.md的示例代码
      alert('正在跳转到学信网进行学历验证...')
      
      // 实际实现中这里会调用Primus SDK
      // const primusZKTLS = new PrimusZKTLS()
      // const appId = "YOUR_APPID"
      // await primusZKTLS.init(appId)
      // const attTemplateID = "XUEXIN_TEMPLATE_ID"
      // const userAddress = address // 从wagmi获取
      // const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress)
      // ... 继续验证流程
      
      console.log('Education verification initiated')
    } catch (error) {
      console.error('Education verification failed:', error)
      alert('学历验证失败，请重试')
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
            <h3 className="text-lg md:text-xl font-semibold mb-4">简历信息</h3>
            
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
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm md:text-base mb-1">
                      {resumeInfo.education.degree}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {resumeInfo.education.university} • {resumeInfo.education.major}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      毕业年份: {resumeInfo.education.graduationYear}
                    </div>
                  </div>
                  <button
                    onClick={handleEducationVerification}
                    className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs hover:bg-primary/90 transition-colors"
                  >
                    <Shield className="w-3 h-3" />
                    学信网验证
                    <ExternalLink className="w-3 h-3" />
                  </button>
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
            <div>
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
          </div>
        </div>
      )}
    </div>
  )
}