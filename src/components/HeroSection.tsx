import type { ReactNode } from 'react'
import { ParticleCanvas } from './ParticleCanvas'

interface HeroSectionProps {
  name: string
  profession: string
  intro: string
  ctaText?: string
  projectsHref?: string
  id?: string
  children?: ReactNode
}

export function HeroSection({
  name,
  profession,
  intro,
  ctaText = '了解更多',
  projectsHref = '#projects',
  id,
  children,
}: HeroSectionProps) {
  function handleCtaClick() {
    document.querySelector(projectsHref)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id={id}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden
        bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100
        dark:from-gray-950 dark:via-slate-900 dark:to-blue-950"
    >
      {children ?? <ParticleCanvas />}

      <div className="relative z-10 text-center px-4 py-16">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
          {name}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
          {profession}
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
          {intro}
        </p>
        <button
          onClick={handleCtaClick}
          className="inline-block px-8 py-3 rounded-full
            bg-indigo-600 hover:bg-indigo-700
            dark:bg-cyan-500 dark:hover:bg-cyan-600
            text-white font-medium
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
            dark:focus-visible:ring-cyan-400"
        >
          {ctaText}
        </button>
      </div>

    </section>
  )
}
