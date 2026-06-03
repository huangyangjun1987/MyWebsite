import { Navbar } from '../components/Navbar'
import { HeroSection } from '../components/HeroSection'
import { AboutSection } from '../components/AboutSection'
import { ProjectSection } from '../components/ProjectSection'

export function BrandPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          id="hero"
          name="黄阳君"
          profession="全栈开发工程师"
          intro="热爱构建优雅的数字产品，专注于 React 与 TypeScript 技术栈"
          ctaText="查看我的作品"
        />

        <AboutSection />

        <ProjectSection />

        <section
          id="contact"
          className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
        >
          <p className="text-gray-400 dark:text-gray-600 text-lg">
            联系我（即将推出）
          </p>
        </section>
      </main>
    </>
  )
}
