import { Header } from '@/components/Header'
import { ResumeUpload } from '@/components/ResumeUpload'
import { ClientOnly } from '@/components/ClientOnly'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <ClientOnly>
        <Header />
      </ClientOnly>
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Resume ZK</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            使用零知识证明技术构建和验证您的专业简历，保护隐私的同时证明真实性
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center px-4">
            <div className="bg-primary/10 text-primary px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium">
              🔒 隐私保护
            </div>
            <div className="bg-primary/10 text-primary px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium">
              ⚡ AI驱动分析
            </div>
            <div className="bg-primary/10 text-primary px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium">
              🌐 区块链验证
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-morphism rounded-2xl p-4 md:p-8 shadow-xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                开始分析您的简历
              </h2>
              <p className="text-muted-foreground text-sm md:text-base px-2">
                上传您的简历文件，我们将为您提供专业的AI分析和改进建议
              </p>
            </div>
            
            <ClientOnly>
              <ResumeUpload />
            </ClientOnly>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-4 md:gap-8">
          <div className="text-center p-4 md:p-6 rounded-lg border bg-card">
            <div className="w-10 md:w-12 h-10 md:h-12 gradient-bg rounded-lg flex items-center justify-center text-white text-xl md:text-2xl mx-auto mb-3 md:mb-4">
              🤖
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">AI智能分析</h3>
            <p className="text-muted-foreground text-xs md:text-sm">
              使用先进的AI技术深度分析您的简历内容，提供个性化的改进建议
            </p>
          </div>
          
          <div className="text-center p-4 md:p-6 rounded-lg border bg-card">
            <div className="w-10 md:w-12 h-10 md:h-12 gradient-bg rounded-lg flex items-center justify-center text-white text-xl md:text-2xl mx-auto mb-3 md:mb-4">
              🔐
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">零知识证明</h3>
            <p className="text-muted-foreground text-xs md:text-sm">
              保护您的隐私，在不泄露具体信息的情况下证明简历的真实性
            </p>
          </div>
          
          <div className="text-center p-4 md:p-6 rounded-lg border bg-card">
            <div className="w-10 md:w-12 h-10 md:h-12 gradient-bg rounded-lg flex items-center justify-center text-white text-xl md:text-2xl mx-auto mb-3 md:mb-4">
              📊
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">详细报告</h3>
            <p className="text-muted-foreground text-xs md:text-sm">
              获得全面的简历评估报告，包括技能匹配度和职业发展建议
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>Resume ZK. 基于Monad测试网构建</p>
        </div>
      </footer>
    </div>
  )
}