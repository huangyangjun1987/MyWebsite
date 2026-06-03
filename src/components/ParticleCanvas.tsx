import { useRef } from 'react'
import { useParticleCanvas } from '../hooks/useParticleCanvas'

interface ParticleCanvasProps {
  particleCount?: number
  reducedMotion?: boolean
  particleColor?: string
  lineColor?: string
}

function getThemeColors() {
  if (typeof document === 'undefined') return { particleColor: '#6366f1', lineColor: 'rgba(99,102,241,0.12)' }
  const isDark = document.documentElement.classList.contains('dark')
  return {
    particleColor: isDark ? '#22d3ee' : '#6366f1',
    lineColor: isDark ? 'rgba(34,211,238,0.10)' : 'rgba(99,102,241,0.12)',
  }
}

export function ParticleCanvas({
  particleCount,
  reducedMotion,
  particleColor,
  lineColor,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const prefersReducedMotion =
    reducedMotion ??
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  if (prefersReducedMotion) return null

  const colors = getThemeColors()

  useParticleCanvas(canvasRef, {
    particleCount,
    particleColor: particleColor ?? colors.particleColor,
    lineColor: lineColor ?? colors.lineColor,
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
