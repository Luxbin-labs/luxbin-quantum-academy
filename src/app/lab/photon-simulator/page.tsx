'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Zap, Settings } from 'lucide-react'

interface Photon {
  id: number
  x: number
  y: number
  wavelength: number
  phase: number
  vx: number
  vy: number
  entangledWith?: number
}

const wavelengthToColor = (wavelength: number): string => {
  let r = 0, g = 0, b = 0

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380); g = 0; b = 1
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0; g = (wavelength - 440) / (490 - 440); b = 1
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0; g = 1; b = -(wavelength - 510) / (510 - 490)
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510); g = 1; b = 0
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1; g = -(wavelength - 645) / (645 - 580); b = 0
  } else if (wavelength >= 645 && wavelength <= 700) {
    r = 1; g = 0; b = 0
  }

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

export default function PhotonSimulatorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [photons, setPhotons] = useState<Photon[]>([])
  const [showInterference, setShowInterference] = useState(true)
  const [wavelength, setWavelength] = useState(500)
  const [slitWidth, setSlitWidth] = useState(50)
  const animationRef = useRef<number | null>(null)

  const addPhoton = () => {
    const newPhoton: Photon = {
      id: Date.now(),
      x: 50,
      y: 200 + (Math.random() - 0.5) * 20,
      wavelength,
      phase: Math.random() * Math.PI * 2,
      vx: 2,
      vy: 0,
    }
    setPhotons(prev => [...prev, newPhoton])
  }

  const createEntangledPair = () => {
    const baseY = 200
    const id1 = Date.now()
    const id2 = id1 + 1
    const newPhotons: Photon[] = [
      { id: id1, x: 400, y: baseY - 30, wavelength, phase: 0, vx: -2, vy: -0.5, entangledWith: id2 },
      { id: id2, x: 400, y: baseY + 30, wavelength, phase: Math.PI, vx: 2, vy: 0.5, entangledWith: id1 },
    ]
    setPhotons(prev => [...prev, ...newPhotons])
  }

  const reset = () => {
    setPhotons([])
    setIsRunning(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw double slit
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(300, 0, 20, 150)
      ctx.fillRect(300, 150 + slitWidth, 20, 100 - slitWidth)
      ctx.fillRect(300, 250, 20, 150)

      // Draw detector screen
      ctx.fillStyle = '#0f0f0f'
      ctx.fillRect(700, 0, 100, 400)

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '11px system-ui'
      ctx.fillText('Source', 30, 210)
      ctx.fillText('Double Slit', 285, 390)
      ctx.fillText('Detector', 720, 390)

      setPhotons(prev => {
        return prev.map(photon => {
          let { x, y, vx, vy, phase, wavelength: wl, entangledWith, id } = photon

          x += vx
          y += vy
          phase += 0.1

          if (x > 300 && x < 320) {
            const slit1Center = 150 + slitWidth / 2
            const slit2Center = 250 - slitWidth / 2
            const dist1 = Math.abs(y - slit1Center)
            const dist2 = Math.abs(y - slit2Center)

            if (dist1 < slitWidth / 2 || dist2 < slitWidth / 2) {
              if (showInterference) {
                const pathDiff = (dist1 - dist2) / 50
                vy += Math.sin(pathDiff * Math.PI) * 0.3
              }
            } else {
              return null
            }
          }

          if (x < 0 || x > 800 || y < 0 || y > 400) {
            return null
          }

          return { ...photon, x, y, phase }
        }).filter(Boolean) as Photon[]
      })

      photons.forEach(photon => {
        const color = wavelengthToColor(photon.wavelength)

        const gradient = ctx.createRadialGradient(photon.x, photon.y, 0, photon.x, photon.y, 20)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(photon.x, photon.y, 20, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(photon.x, photon.y, 3, 0, Math.PI * 2)
        ctx.fill()

        if (photon.entangledWith) {
          const partner = photons.find(p => p.id === photon.entangledWith)
          if (partner) {
            ctx.strokeStyle = 'rgba(69, 93, 236, 0.3)'
            ctx.setLineDash([5, 5])
            ctx.beginPath()
            ctx.moveTo(photon.x, photon.y)
            ctx.lineTo(partner.x, partner.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
      })

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (isRunning) {
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, photons, showInterference, slitWidth])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Photon Simulator</h1>
          <p className="text-white/50 text-sm">Double-slit experiment - wave-particle duality</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsRunning(!isRunning)}
            className="btn-primary flex items-center gap-2 py-2.5"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </motion.button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-[1fr_280px] gap-6">
        {/* Canvas */}
        <div className="lab-canvas p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full rounded-lg"
            style={{ background: '#0a0a0a' }}
          />

          {/* Quick actions */}
          <div className="flex gap-2 mt-4">
            <button onClick={addPhoton} className="btn-secondary py-2 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" /> Emit Photon
            </button>
            <button onClick={createEntangledPair} className="btn-secondary py-2 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" /> Entangled Pair
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="card p-5 space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Settings className="w-4 h-4" /> Settings
          </div>

          {/* Wavelength */}
          <div>
            <label className="text-sm text-white/50 mb-2 block">
              Wavelength: {wavelength}nm
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="400"
                max="700"
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                className="flex-1"
              />
              <div
                className="w-8 h-8 rounded-lg"
                style={{ background: wavelengthToColor(wavelength) }}
              />
            </div>
          </div>

          {/* Slit Width */}
          <div>
            <label className="text-sm text-white/50 mb-2 block">
              Slit Width: {slitWidth}px
            </label>
            <input
              type="range"
              min="10"
              max="80"
              value={slitWidth}
              onChange={(e) => setSlitWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Interference toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Show Interference</span>
            <button
              onClick={() => setShowInterference(!showInterference)}
              className={`w-11 h-6 rounded-full transition-colors ${
                showInterference ? 'bg-[#455DEC]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  showInterference ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-sm text-white/40 mb-1">Active Photons</div>
            <div className="text-2xl font-bold">{photons.length}</div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-white/5 text-xs text-white/50 space-y-1">
            <p><strong className="text-white/70">Wave-Particle Duality:</strong> Photons behave as both waves and particles</p>
            <p><strong className="text-white/70">Interference:</strong> Wave patterns emerge from quantum superposition</p>
          </div>
        </div>
      </div>
    </div>
  )
}
