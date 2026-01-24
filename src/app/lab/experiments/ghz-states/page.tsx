'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Info, X, Atom } from 'lucide-react'

interface GHZParticle {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  angle: number
  spin: 'up' | 'down'
  measured: boolean
}

interface Flash {
  id: number
  x: number
  y: number
  radius: number
  opacity: number
  color: string
}

export default function GHZStatesPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const [particles, setParticles] = useState<GHZParticle[]>([])
  const [flashes, setFlashes] = useState<Flash[]>([])
  const [numQubits, setNumQubits] = useState(3)
  const [showInfo, setShowInfo] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [stats, setStats] = useState({ created: 0, allUp: 0, allDown: 0 })
  const idRef = useRef(0)

  const getDetectorPositions = useCallback((count: number) => {
    const positions: { x: number; y: number }[] = []
    const centerX = 400
    const centerY = 200
    const radius = 150

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      positions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      })
    }
    return positions
  }, [])

  const createGHZState = useCallback(() => {
    const positions = getDetectorPositions(numQubits)
    const spin = Math.random() > 0.5 ? 'up' : 'down' as const

    // Create center flash
    setFlashes(prev => [...prev, {
      id: idRef.current++,
      x: 400,
      y: 200,
      radius: 10,
      opacity: 1,
      color: '#455DEC'
    }])

    const newParticles: GHZParticle[] = positions.map((pos, i) => ({
      id: idRef.current++,
      x: 400,
      y: 200,
      targetX: pos.x,
      targetY: pos.y,
      angle: (Math.PI * 2 * i) / numQubits - Math.PI / 2,
      spin,
      measured: false
    }))

    setParticles(newParticles)
    setIsAnimating(true)
    setStats(s => ({ ...s, created: s.created + 1 }))
  }, [numQubits, getDetectorPositions])

  const measureAll = useCallback(() => {
    setParticles(prev => {
      const allSpin = prev[0]?.spin
      const allSame = prev.every(p => p.spin === allSpin)

      if (allSame) {
        if (allSpin === 'up') {
          setStats(s => ({ ...s, allUp: s.allUp + 1 }))
        } else {
          setStats(s => ({ ...s, allDown: s.allDown + 1 }))
        }
      }

      // Create measurement flashes at each detector
      prev.forEach(p => {
        setFlashes(f => [...f, {
          id: idRef.current++,
          x: p.targetX,
          y: p.targetY,
          radius: 10,
          opacity: 1,
          color: p.spin === 'up' ? '#00D4FF' : '#F07362'
        }])
      })

      return prev.map(p => ({ ...p, measured: true }))
    })
  }, [])

  const reset = () => {
    setParticles([])
    setFlashes([])
    setIsAnimating(false)
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

      const positions = getDetectorPositions(numQubits)

      // Draw center source
      const sourceGlow = ctx.createRadialGradient(400, 200, 0, 400, 200, 50 + Math.sin(time * 3) * 10)
      sourceGlow.addColorStop(0, 'rgba(69, 93, 236, 0.6)')
      sourceGlow.addColorStop(0.5, 'rgba(69, 93, 236, 0.2)')
      sourceGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = sourceGlow
      ctx.beginPath()
      ctx.arc(400, 200, 60, 0, Math.PI * 2)
      ctx.fill()

      // Source label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('GHZ Source', 400, 200)

      // Draw detectors
      positions.forEach((pos, i) => {
        // Detector glow
        const detGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 40)
        detGlow.addColorStop(0, `rgba(69, 93, 236, ${0.2 + Math.sin(time * 2 + i) * 0.1})`)
        detGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = detGlow
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2)
        ctx.fill()

        // Detector body
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#455DEC'
        ctx.lineWidth = 2
        ctx.stroke()

        // Detector label
        ctx.fillStyle = 'white'
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(`Q${i + 1}`, pos.x, pos.y + 45)
      })

      // Draw entanglement web when particles exist
      if (particles.length > 0 && !particles[0].measured) {
        ctx.strokeStyle = `rgba(69, 93, 236, ${0.3 + Math.sin(time * 4) * 0.2})`
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])

        // Draw lines between all particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
        ctx.setLineDash([])
      }

      // Update and draw particles
      setParticles(prev => {
        return prev.map(p => {
          if (p.measured) return p

          const dx = p.targetX - p.x
          const dy = p.targetY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 5) {
            return { ...p, x: p.targetX, y: p.targetY }
          }

          return {
            ...p,
            x: p.x + dx * 0.05,
            y: p.y + dy * 0.05
          }
        })
      })

      // Draw particles
      particles.forEach(p => {
        const color = p.measured
          ? (p.spin === 'up' ? '#00D4FF' : '#F07362')
          : '#455DEC'

        // Particle glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20 + Math.sin(time * 5 + p.id) * 5)
        glow.addColorStop(0, color + 'cc')
        glow.addColorStop(0.5, color + '40')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, 25, 0, Math.PI * 2)
        ctx.fill()

        // Particle core
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Spin indicator
        if (p.measured) {
          ctx.fillStyle = 'white'
          ctx.font = '12px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(p.spin === 'up' ? '↑' : '↓', p.x, p.y + 4)
        }
      })

      // Draw and update flashes
      setFlashes(prev => {
        return prev.map(f => ({
          ...f,
          radius: f.radius + 4,
          opacity: f.opacity - 0.03
        })).filter(f => f.opacity > 0)
      })

      flashes.forEach(f => {
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius)
        gradient.addColorStop(0, f.color + Math.floor(f.opacity * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // GHZ state notation
      ctx.fillStyle = 'white'
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      const stateNotation = `|GHZ₃⟩ = (|${'0'.repeat(numQubits)}⟩ + |${'1'.repeat(numQubits)}⟩) / √2`
      ctx.fillText(stateNotation, 400, 380)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [numQubits, particles, flashes, getDetectorPositions])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-advanced">Advanced</span>
            <span className="text-xs text-white/40">EIP-003</span>
          </div>
          <h1 className="text-2xl font-bold">GHZ State Generator</h1>
          <p className="text-white/50 text-sm">Create multi-qubit maximally entangled states</p>
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createGHZState}
            disabled={isAnimating && particles.length > 0 && !particles[0]?.measured}
            className="btn-primary flex items-center gap-2 py-2.5 disabled:opacity-50"
          >
            <Atom className="w-4 h-4" /> Create GHZ
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={measureAll}
            disabled={particles.length === 0 || particles[0]?.measured}
            className="px-4 py-2.5 rounded-lg bg-[#00D4FF] text-black font-medium disabled:opacity-50"
          >
            Measure All
          </motion.button>
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
            <h3 className="font-semibold">GHZ States Explained</h3>
            <button onClick={() => setShowInfo(false)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
            <div>
              <p className="font-medium text-white mb-1">What is a GHZ State?</p>
              <p>Named after Greenberger-Horne-Zeilinger, these are maximally entangled states of 3+ qubits. When measured, all qubits collapse to the same value (all 0s or all 1s).</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Quantum Correlations</p>
              <p>GHZ states demonstrate non-classical correlations that cannot be explained by local hidden variables, proving quantum mechanics.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Qubit selector */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">Number of Qubits:</span>
          {[3, 4, 5, 6].map(n => (
            <button
              key={n}
              onClick={() => { setNumQubits(n); reset() }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                numQubits === n ? 'bg-[#455DEC]' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {n}
            </button>
          ))}
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
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#455DEC]">{stats.created}</div>
          <div className="text-sm text-white/50">States Created</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#00D4FF]">{stats.allUp}</div>
          <div className="text-sm text-white/50">All |0⟩ Outcomes</div>
          <div className="text-xs text-white/30 mt-1">
            {stats.created > 0 ? ((stats.allUp / stats.created) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#F07362]">{stats.allDown}</div>
          <div className="text-sm text-white/50">All |1⟩ Outcomes</div>
          <div className="text-xs text-white/30 mt-1">
            {stats.created > 0 ? ((stats.allDown / stats.created) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
    </div>
  )
}
