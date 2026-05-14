import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

interface UseParticleCanvasOptions {
  particleCount?: number
  particleColor: string
  lineColor: string
  connectionDistance: number
}

function getEffectiveParticleCount(
  width: number,
  override?: number,
): number {
  if (override !== undefined) return override
  if (width > 2000) return 150
  if (width > 768) return 120
  return 50
}

function createParticles(
  count: number,
  width: number,
  height: number,
): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }))
}

export function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseParticleCanvasOptions,
) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []

    function getDpr() {
      return Math.min(window.devicePixelRatio || 1, 2)
    }

    function getSize() {
      if (!canvas) return { width: 0, height: 0 }
      const parent = canvas.parentElement
      if (!parent) return { width: 0, height: 0 }
      return { width: parent.clientWidth, height: parent.clientHeight }
    }

    function resize() {
      const dpr = getDpr()
      const { width, height } = getSize()
      if (width === 0 || height === 0) return

      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      particles = createParticles(
        getEffectiveParticleCount(width, optionsRef.current.particleCount),
        width,
        height,
      )
    }

    function draw() {
      const { particleColor, lineColor, connectionDistance } =
        optionsRef.current

      const dpr = getDpr()
      const w = canvas!.width / dpr
      const h = canvas!.height / dpr
      const connectParticles = w > 768

      ctx!.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = particleColor
        ctx!.globalAlpha = p.opacity
        ctx!.fill()
      }
      ctx!.globalAlpha = 1

      if (connectParticles) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < connectionDistance) {
              ctx!.beginPath()
              ctx!.moveTo(particles[i].x, particles[i].y)
              ctx!.lineTo(particles[j].x, particles[j].y)
              ctx!.strokeStyle = lineColor
              ctx!.globalAlpha = 1 - dist / connectionDistance
              ctx!.lineWidth = 0.5
              ctx!.stroke()
            }
          }
        }
        ctx!.globalAlpha = 1
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    let resizeTimer: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [canvasRef])
}
