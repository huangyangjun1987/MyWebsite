import { useState } from 'react'
import avatarSrc from '../assets/avatar-placeholder.svg'

const PARAGRAPHS = [
  '拥有多年全栈开发经验，专注于 React、TypeScript 和 Node.js 技术栈。擅长将复杂的业务需求转化为简洁、可维护的代码架构。',
  '热衷于探索前沿技术，在 Web 性能优化、响应式设计和无障碍访问方面有深入实践。相信优秀的软件应该对用户和开发者都友好。',
  '工作之余，喜欢撰写技术博客分享知识，参与开源项目回馈社区。持续学习中，对 Rust 和 WebAssembly 保持浓厚兴趣。',
]

function AvatarFallback() {
  return (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <svg
        className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500"
        fill="currentColor"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="35" r="25" />
        <ellipse cx="50" cy="85" rx="40" ry="25" />
      </svg>
    </div>
  )
}

export function AboutSection() {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <section
      id="about"
      className="py-20 px-4 bg-white dark:bg-gray-950"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
          关于我
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* 左侧：个人照片 */}
          <div className="flex justify-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              {!imgLoaded && !imgError && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}

              {imgError ? (
                <AvatarFallback />
              ) : (
                <img
                  src={avatarSrc}
                  alt="黄阳君"
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </div>
          </div>

          {/* 右侧：简介文字 + 品牌标签 */}
          <div className="flex flex-col gap-5 text-gray-700 dark:text-gray-200 leading-relaxed">
            {PARAGRAPHS.map((text, i) => (
              <p key={i} className="text-base sm:text-lg">
                {text}
              </p>
            ))}

            <span
              className="self-start mt-2 px-4 py-1.5 rounded-full text-sm font-medium
                         bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                         dark:from-cyan-400 dark:to-blue-500 dark:text-gray-950"
            >
              赋范空间
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
