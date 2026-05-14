import { useRef } from 'react'
import { useParticleCanvas } from '../hooks/useParticleCanvas'

interface ParticleCanvasProps {
  particleCount?: number
  reducedMotion?: boolean
}

export function ParticleCanvas({
  particleCount,
  reducedMotion,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const prefersReducedMotion =
    reducedMotion ??
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  if (prefersReducedMotion) return null

  const isDark = document.documentElement.classList.contains('dark')
  const particleColor = isDark ? '#22d3ee' : '#6366f1'
  const lineColor = isDark
    ? 'rgba(34,211,238,0.10)'
    : 'rgba(99,102,241,0.12)'

  useParticleCanvas(canvasRef, {
    particleCount,
    particleColor,
    lineColor,
    connectionDistance: 120,
  })

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  )
}
