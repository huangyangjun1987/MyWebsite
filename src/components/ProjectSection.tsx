import { projects } from '../data/projects'
import { ProjectCard } from './ProjectCard'

export function ProjectSection() {
  return (
    <section
      id="projects"
      className="min-h-screen bg-white dark:bg-gray-950 py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
          我的项目
        </h2>

        {projects.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-600 text-lg">
            暂无项目展示
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
