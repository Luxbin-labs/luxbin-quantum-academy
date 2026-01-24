'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Info, X, Zap, Radio } from 'lucide-react'

interface NVState {
  spin: number // 0, +1, or -1
  coherence: number // 0 to 1
  opticallyPumped: boolean
}

interface Photon {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  wavelength: number // 532nm green or 637nm red
  life: number
}

export default function NVCenterPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const [nvState, setNVState] = useState<NVState>({
    spin: 0,
    coherence: 1,
    opticallyPumped: false
  })
  const [photons, setPhotons] = useState<Photon[]>([])
  const [showInfo, setShowInfo] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [microwaveOn, setMicrowaveOn] = useState(false)
  const [laserOn, setLaserOn] = useState(false)
  const [stats, setStats] = useState({ reads: 0, spinUp: 0, spinDown: 0 })
  const idRef = useRef(0)

  const emitPhoton = useCallback((wavelength: number, fromCenter = true) => {
    const angle = Math.random() * Math.PI * 2
    const speed = 3 + Math.random() * 2
    const startX = fromCenter ? 400 : 400 + (Math.random() - 0.5) * 40
    const startY = fromCenter ? 200 : 200 + (Math.random() - 0.5) * 40

    setPhotons(prev => [...prev, {
      id: idRef.current++,
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      wavelength,
      life: 1
    }])
  }, [])

  const pumpLaser = useCallback(() => {
    setLaserOn(true)
    // Emit green photons toward center
    for (let i = 0; i < 5; i++) {
      setTimeout(() => emitPhoton(532, false), i * 100)
    }

    setTimeout(() => {
      setNVState(s => ({ ...s, opticallyPumped: true, spin: 0 }))
      setLaserOn(false)
    }, 500)
  }, [emitPhoton])

  const applyMicrowave = useCallback(() => {
    setMicrowaveOn(true)
    setTimeout(() => {
      setNVState(s => ({
        ...s,
        spin: Math.random() > 0.5 ? 1 : -1,
        coherence: Math.max(0, s.coherence - 0.1)
      }))
      setMicrowaveOn(false)
    }, 800)
  }, [])

  const readout = useCallback(() => {
    // Emit red fluorescence photons
    const numPhotons = nvState.spin === 0 ? 8 : 3 // More photons for spin-0 state
    for (let i = 0; i < numPhotons; i++) {
      setTimeout(() => emitPhoton(637, true), i * 50)
    }

    setStats(s => ({
      reads: s.reads + 1,
      spinUp: s.spinUp + (nvState.spin === 0 ? 1 : 0),
      spinDown: s.spinDown + (nvState.spin !== 0 ? 1 : 0)
    }))
  }, [nvState.spin, emitPhoton])

  const reset = () => {
    setNVState({ spin: 0, coherence: 1, opticallyPumped: false })
    setPhotons([])
    setLaserOn(false)
    setMicrowaveOn(false)
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const animate = () => {
      time += 0.02
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw diamond lattice background
      ctx.strokeStyle = 'rgba(69, 93, 236, 0.1)'
      ctx.lineWidth = 1
      for (let x = 300; x <= 500; x += 20) {
        for (let y = 100; y <= 300; y += 20) {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + 10, y + 10)
          ctx.lineTo(x, y + 20)
          ctx.lineTo(x - 10, y + 10)
          ctx.closePath()
          ctx.stroke()
        }
      }

      // Draw NV center
      const nvGlow = ctx.createRadialGradient(400, 200, 0, 400, 200, 60 + Math.sin(time * 3) * 10)

      // Color based on state
      let nvColor = 'rgba(69, 93, 236, 0.8)' // Default blue
      if (nvState.opticallyPumped) nvColor = 'rgba(0, 212, 255, 0.8)' // Cyan when pumped
      if (microwaveOn) nvColor = 'rgba(240, 115, 98, 0.8)' // Orange during microwave

      nvGlow.addColorStop(0, nvColor)
      nvGlow.addColorStop(0.5, nvColor.replace('0.8', '0.3'))
      nvGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = nvGlow
      ctx.beginPath()
      ctx.arc(400, 200, 70, 0, Math.PI * 2)
      ctx.fill()

      // Draw N and V atoms
      ctx.fillStyle = '#4CAF50' // Nitrogen - green
      ctx.beginPath()
      ctx.arc(390, 195, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('N', 390, 198)

      ctx.fillStyle = '#1a1a2e' // Vacancy - dark
      ctx.beginPath()
      ctx.arc(410, 205, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#455DEC'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = 'white'
      ctx.fillText('V', 410, 208)

      // Draw laser beam when on
      if (laserOn) {
        const laserGrad = ctx.createLinearGradient(50, 200, 400, 200)
        laserGrad.addColorStop(0, 'rgba(0, 255, 0, 0.8)')
        laserGrad.addColorStop(0.5, 'rgba(0, 255, 0, 0.4)')
        laserGrad.addColorStop(1, 'rgba(0, 255, 0, 0.1)')
        ctx.fillStyle = laserGrad
        ctx.fillRect(50, 195, 350, 10)

        // Laser source
        ctx.fillStyle = '#00FF00'
        ctx.fillRect(30, 180, 30, 40)
        ctx.fillStyle = 'black'
        ctx.font = '10px monospace'
        ctx.fillText('532nm', 45, 240)
      }

      // Draw microwave field when on
      if (microwaveOn) {
        ctx.strokeStyle = 'rgba(240, 115, 98, 0.5)'
        ctx.lineWidth = 2
        for (let i = 0; i < 3; i++) {
          const radius = 80 + i * 30 + Math.sin(time * 10) * 10
          ctx.beginPath()
          ctx.arc(400, 200, radius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Draw detector
      ctx.fillStyle = 'rgba(100, 100, 100, 0.3)'
      ctx.fillRect(700, 150, 60, 100)
      ctx.strokeStyle = '#637BF0'
      ctx.lineWidth = 2
      ctx.strokeRect(700, 150, 60, 100)
      ctx.fillStyle = 'white'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('Detector', 730, 270)

      // Update and draw photons
      setPhotons(prev => {
        return prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.015
        })).filter(p => p.life > 0 && p.x > 0 && p.x < 800 && p.y > 0 && p.y < 400)
      })

      photons.forEach(p => {
        const color = p.wavelength === 532 ? '#00FF00' : '#FF3366' // Green or red

        // Photon glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15)
        glow.addColorStop(0, color + 'cc')
        glow.addColorStop(0.5, color + '40')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2)
        ctx.fill()

        // Photon core
        ctx.globalAlpha = p.life
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw energy level diagram
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.fillStyle = 'white'
      ctx.font = '12px monospace'

      // Ground state triplet
      const levelX = 150
      ctx.beginPath()
      ctx.moveTo(levelX - 30, 320)
      ctx.lineTo(levelX + 30, 320)
      ctx.stroke()
      ctx.fillText('ms = 0', levelX, 340)

      ctx.beginPath()
      ctx.moveTo(levelX - 30, 280)
      ctx.lineTo(levelX + 30, 280)
      ctx.stroke()
      ctx.fillText('ms = ±1', levelX, 275)

      // Highlight current state
      const currentY = nvState.spin === 0 ? 320 : 280
      ctx.fillStyle = nvState.spin === 0 ? '#00D4FF' : '#F07362'
      ctx.beginPath()
      ctx.arc(levelX, currentY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '11px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('Energy Levels', 150, 250)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nvState, photons, laserOn, microwaveOn])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-expert">Expert</span>
            <span className="text-xs text-white/40">EIP-001</span>
          </div>
          <h1 className="text-2xl font-bold">NV-Center Simulation</h1>
          <p className="text-white/50 text-sm">Diamond nitrogen-vacancy center spin manipulation</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={reset}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card p-4 mb-6"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold">NV-Center Quantum Bits</h3>
            <button onClick={() => setShowInfo(false)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
            <div>
              <p className="font-medium text-white mb-1">What is an NV Center?</p>
              <p>A nitrogen atom next to a vacancy in a diamond crystal. Its electron spin can be used as a qubit that works at room temperature.</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Optical Pumping</p>
              <p>Green laser (532nm) initializes the spin to the ms=0 ground state through optical cycling.</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Spin Readout</p>
              <p>The ms=0 state fluoresces more brightly than ms=±1, allowing optical spin readout.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={pumpLaser}
            disabled={laserOn}
            className="btn-primary flex items-center gap-2 py-2.5 disabled:opacity-50"
            style={{ background: '#00AA00' }}
          >
            <Zap className="w-4 h-4" /> Pump (532nm)
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={applyMicrowave}
            disabled={microwaveOn || !nvState.opticallyPumped}
            className="px-4 py-2.5 rounded-lg bg-[#F07362] text-white font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Radio className="w-4 h-4" /> Microwave π
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={readout}
            disabled={!nvState.opticallyPumped}
            className="px-4 py-2.5 rounded-lg bg-[#FF3366] text-white font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> Readout (637nm)
          </motion.button>

          <div className="ml-auto text-sm">
            <span className="text-white/50">Spin State: </span>
            <span className={`font-mono ${nvState.spin === 0 ? 'text-[#00D4FF]' : 'text-[#F07362]'}`}>
              ms = {nvState.spin === 0 ? '0' : nvState.spin === 1 ? '+1' : '-1'}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="lab-canvas mb-6 p-4" style={{ minHeight: '420px' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full rounded-lg"
          style={{ background: '#0a0a0f', display: 'block' }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#455DEC]">{stats.reads}</div>
          <div className="text-sm text-white/50">Total Readouts</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#00D4FF]">{stats.spinUp}</div>
          <div className="text-sm text-white/50">ms = 0 (Bright)</div>
          <div className="text-xs text-white/30 mt-1">
            {stats.reads > 0 ? ((stats.spinUp / stats.reads) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#F07362]">{stats.spinDown}</div>
          <div className="text-sm text-white/50">ms = ±1 (Dark)</div>
          <div className="text-xs text-white/30 mt-1">
            {stats.reads > 0 ? ((stats.spinDown / stats.reads) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#4CAF50]">{(nvState.coherence * 100).toFixed(0)}%</div>
          <div className="text-sm text-white/50">Coherence</div>
        </div>
      </div>
    </div>
  )
}
