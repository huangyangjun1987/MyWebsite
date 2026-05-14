import { useState } from 'react'
import type { Project } from '../data/projects'

function PlaceholderImage({ name }: { name: string }) {
  return (
    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-xl">
      <span className="text-4xl font-bold text-gray-400 dark:text-gray-500 select-none">
        {name.charAt(0)}
      </span>
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false)

  const hasImage = project.image && !imgError

  return (
    <div
      className="group rounded-xl border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800
                 hover:shadow-lg hover:shadow-indigo-500/10
                 hover:-translate-y-1
                 hover:border-indigo-300 dark:hover:border-cyan-700
                 transition-all duration-300
                 flex flex-col overflow-hidden"
    >
      {hasImage ? (
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-48 object-cover"
        />
      ) : (
        <PlaceholderImage name={project.name} />
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 leading-relaxed">
          {project.description}
        </p>

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium
                       text-indigo-600 dark:text-cyan-400
                       hover:text-indigo-800 dark:hover:text-cyan-300
                       transition-colors duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                       dark:focus-visible:ring-cyan-400 rounded"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        )}
      </div>
    </div>
  )
}
