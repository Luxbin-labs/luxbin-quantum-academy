'use client'

import { useEffect, useRef } from 'react'

interface Photon {
  x: number
  y: number
  vx: number
  vy: number
  wavelength: number
  size: number
  alpha: number
}

const wavelengthToColor = (wavelength: number): string => {
  // Convert wavelength (400-700nm) to RGB
  let r = 0, g = 0, b = 0

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380)
    g = 0
    b = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0
    g = (wavelength - 440) / (490 - 440)
    b = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0
    g = 1
    b = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510)
    g = 1
    b = 0
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1
    g = -(wavelength - 645) / (645 - 580)
    b = 0
  } else if (wavelength >= 645 && wavelength <= 700) {
    r = 1
    g = 0
    b = 0
  }

  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, `
}

export function PhotonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photonsRef = useRef<Photon[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize photons
    const numPhotons = 50
    photonsRef.current = Array.from({ length: numPhotons }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      wavelength: 400 + Math.random() * 300, // 400-700nm
      size: 2 + Math.random() * 4,
      alpha: 0.3 + Math.random() * 0.4,
    }))

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = 'rgba(10, 10, 26, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      photonsRef.current.forEach((photon, i) => {
        // Update position
        photon.x += photon.vx
        photon.y += photon.vy

        // Wrap around edges
        if (photon.x < 0) photon.x = canvas.width
        if (photon.x > canvas.width) photon.x = 0
        if (photon.y < 0) photon.y = canvas.height
        if (photon.y > canvas.height) photon.y = 0

        // Draw photon with glow
        const color = wavelengthToColor(photon.wavelength)

        // Outer glow
        const gradient = ctx.createRadialGradient(
          photon.x, photon.y, 0,
          photon.x, photon.y, photon.size * 4
        )
        gradient.addColorStop(0, color + `${photon.alpha})`)
        gradient.addColorStop(1, color + '0)')

        ctx.beginPath()
        ctx.arc(photon.x, photon.y, photon.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(photon.x, photon.y, photon.size, 0, Math.PI * 2)
        ctx.fillStyle = color + `${photon.alpha + 0.3})`
        ctx.fill()

        // Draw entanglement lines between nearby photons
        photonsRef.current.slice(i + 1).forEach((other) => {
          const dx = other.x - photon.x
          const dy = other.y - photon.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const alpha = (1 - distance / 150) * 0.2
            ctx.beginPath()
            ctx.moveTo(photon.x, photon.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f23 50%, #0a0a1a 100%)' }}
    />
  )
}
