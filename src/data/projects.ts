export interface Project {
  name: string
  description: string
  image: string
  githubUrl?: string
}

export const projects: Project[] = [
  {
    name: 'My Website',
    description: '个人品牌站，React 19 + TypeScript + Tailwind CSS v4 + Vite，科技粒子背景，支持亮/暗切换。',
    image: '',
    githubUrl: 'https://github.com/huangyangjun/my-website',
  },
  {
    name: 'TaskFlow',
    description: '看板式任务管理工具，支持拖拽排序、多列表管理、本地持久化，PWA 离线可用。',
    image: '',
    githubUrl: 'https://github.com/huangyangjun/taskflow',
  },
  {
    name: 'DevLog',
    description: '开发者技术博客，Markdown 渲染、标签分类、RSS 订阅、代码高亮。',
    image: '',
    githubUrl: 'https://github.com/huangyangjun/devlog',
  },
  {
    name: 'SnapMark',
    description: '截图 + 标注工具，支持箭头、文字、模糊区域，一键复制到剪贴板。',
    image: '',
    githubUrl: 'https://github.com/huangyangjun/snapmark',
  },
]
