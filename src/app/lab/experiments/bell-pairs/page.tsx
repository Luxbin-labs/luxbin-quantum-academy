'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, GitBranch, Sparkles, Zap } from 'lucide-react'

interface EntangledPair {
  id: number
  photonA: { x: number; y: number; measured: boolean; result?: '0' | '1' }
  photonB: { x: number; y: number; measured: boolean; result?: '0' | '1' }
  wavelength: number
  created: number
}

interface Measurement {
  alice: '0' | '1'
  bob: '0' | '1'
  correlated: boolean
  timestamp: number
}

const wavelengthToColor = (wavelength: number, alpha: number = 1): string => {
  // Use a nice blue-cyan for entangled pairs
  return `rgba(69, 93, 236, ${alpha})`
}

export default function BellPairsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pairs, setPairs] = useState<EntangledPair[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [isAutoRunning, setIsAutoRunning] = useState(false)
  const [flash, setFlash] = useState<{ x: number; y: number } | null>(null)
  const pairsRef = useRef<EntangledPair[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    pairsRef.current = pairs
  }, [pairs])

  const createPair = useCallback(() => {
    const id = Date.now()
    const centerX = 400
    const centerY = 200

    // Flash effect
    setFlash({ x: centerX, y: centerY })
    setTimeout(() => setFlash(null), 400)

    const newPair: EntangledPair = {
      id,
      photonA: { x: centerX, y: centerY, measured: false },
      photonB: { x: centerX, y: centerY, measured: false },
      wavelength: 480,
      created: Date.now(),
    }

    setPairs(prev => [...prev, newPair])
  }, [])

  const reset = useCallback(() => {
    setPairs([])
    setMeasurements([])
    setIsAutoRunning(false)
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear with dark fade
      ctx.fillStyle = 'rgba(5, 5, 12, 0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = 400
      const centerY = 200

      // Draw center source with pulsing glow
      const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7
      const sourceGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80 * pulse)
      sourceGlow.addColorStop(0, `rgba(69, 93, 236, ${0.4 * pulse})`)
      sourceGlow.addColorStop(0.5, `rgba(0, 212, 255, ${0.2 * pulse})`)
      sourceGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = sourceGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
      ctx.fill()

      // Source crystal
      ctx.fillStyle = '#1a1a2e'
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - 25)
      ctx.lineTo(centerX + 20, centerY)
      ctx.lineTo(centerX, centerY + 25)
      ctx.lineTo(centerX - 20, centerY)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#455DEC'
      ctx.lineWidth = 2
      ctx.stroke()

      // Alice's detector (left)
      const aliceX = 80
      ctx.fillStyle = '#0d0d18'
      ctx.fillRect(aliceX - 30, centerY - 50, 60, 100)
      ctx.strokeStyle = '#F07362'
      ctx.lineWidth = 2
      ctx.strokeRect(aliceX - 30, centerY - 50, 60, 100)
      ctx.fillStyle = 'rgba(240, 115, 98, 0.1)'
      ctx.fillRect(aliceX - 30, centerY - 50, 60, 100)

      // Bob's detector (right)
      const bobX = 720
      ctx.fillStyle = '#0d0d18'
      ctx.fillRect(bobX - 30, centerY - 50, 60, 100)
      ctx.strokeStyle = '#00D4FF'
      ctx.lineWidth = 2
      ctx.strokeRect(bobX - 30, centerY - 50, 60, 100)
      ctx.fillStyle = 'rgba(0, 212, 255, 0.1)'
      ctx.fillRect(bobX - 30, centerY - 50, 60, 100)

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = 'bold 14px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Alice', aliceX, centerY + 80)
      ctx.fillText('Bob', bobX, centerY + 80)
      ctx.fillText('Entanglement Source', centerX, centerY + 80)

      // Update pairs
      const currentPairs = pairsRef.current
      const newPairs: EntangledPair[] = []

      currentPairs.forEach(pair => {
        const age = Date.now() - pair.created
        const speed = 4

        // Move photons apart
        let newPhotonA = { ...pair.photonA }
        let newPhotonB = { ...pair.photonB }

        if (!newPhotonA.measured) {
          newPhotonA.x -= speed
        }
        if (!newPhotonB.measured) {
          newPhotonB.x += speed
        }

        // Check for measurement at Alice
        if (newPhotonA.x <= aliceX + 30 && !newPhotonA.measured) {
          newPhotonA.measured = true
          newPhotonA.result = Math.random() < 0.5 ? '0' : '1'
          // Bob's result is correlated in |Φ+⟩ state
          newPhotonB.result = newPhotonA.result
        }

        // Check for measurement at Bob
        if (newPhotonB.x >= bobX - 30 && !newPhotonB.measured) {
          newPhotonB.measured = true
          if (!newPhotonB.result) {
            newPhotonB.result = newPhotonA.result || (Math.random() < 0.5 ? '0' : '1')
          }

          // Record measurement
          if (newPhotonA.result && newPhotonB.result) {
            setMeasurements(prev => [...prev.slice(-50), {
              alice: newPhotonA.result!,
              bob: newPhotonB.result!,
              correlated: newPhotonA.result === newPhotonB.result,
              timestamp: Date.now(),
            }])
          }
        }

        // Remove if both measured and faded
        if (newPhotonA.measured && newPhotonB.measured && age > 3000) {
          return
        }

        newPairs.push({
          ...pair,
          photonA: newPhotonA,
          photonB: newPhotonB,
        })
      })

      setPairs(newPairs)

      // Draw entanglement connections and photons
      newPairs.forEach(pair => {
        const { photonA, photonB } = pair

        // Draw entanglement line (quantum correlation visualization)
        if (!photonA.measured || !photonB.measured) {
          const gradient = ctx.createLinearGradient(photonA.x, photonA.y, photonB.x, photonB.y)
          gradient.addColorStop(0, 'rgba(240, 115, 98, 0.6)')
          gradient.addColorStop(0.5, 'rgba(69, 93, 236, 0.8)')
          gradient.addColorStop(1, 'rgba(0, 212, 255, 0.6)')

          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.setLineDash([10, 5])
          ctx.beginPath()
          ctx.moveTo(photonA.x, photonA.y)
          ctx.lineTo(photonB.x, photonB.y)
          ctx.stroke()
          ctx.setLineDash([])

          // Animated particles along the line
          const t = (Date.now() % 2000) / 2000
          const particleX = photonA.x + (photonB.x - photonA.x) * t
          const particleY = photonA.y + (photonB.y - photonA.y) * t
          ctx.fillStyle = 'rgba(69, 93, 236, 0.8)'
          ctx.beginPath()
          ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw Photon A (Alice's photon)
        if (!photonA.measured) {
          // Outer glow
          const glowA = ctx.createRadialGradient(photonA.x, photonA.y, 0, photonA.x, photonA.y, 30)
          glowA.addColorStop(0, 'rgba(240, 115, 98, 0.8)')
          glowA.addColorStop(0.4, 'rgba(240, 115, 98, 0.3)')
          glowA.addColorStop(1, 'transparent')
          ctx.fillStyle = glowA
          ctx.beginPath()
          ctx.arc(photonA.x, photonA.y, 30, 0, Math.PI * 2)
          ctx.fill()

          // Core
          ctx.shadowColor = '#F07362'
          ctx.shadowBlur = 20
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(photonA.x, photonA.y, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          // Show measurement result
          ctx.fillStyle = photonA.result === '0' ? '#4ade80' : '#f87171'
          ctx.font = 'bold 20px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`|${photonA.result}⟩`, aliceX, centerY)
        }

        // Draw Photon B (Bob's photon)
        if (!photonB.measured) {
          const glowB = ctx.createRadialGradient(photonB.x, photonB.y, 0, photonB.x, photonB.y, 30)
          glowB.addColorStop(0, 'rgba(0, 212, 255, 0.8)')
          glowB.addColorStop(0.4, 'rgba(0, 212, 255, 0.3)')
          glowB.addColorStop(1, 'transparent')
          ctx.fillStyle = glowB
          ctx.beginPath()
          ctx.arc(photonB.x, photonB.y, 30, 0, Math.PI * 2)
          ctx.fill()

          ctx.shadowColor = '#00D4FF'
          ctx.shadowBlur = 20
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(photonB.x, photonB.y, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = photonB.result === '0' ? '#4ade80' : '#f87171'
          ctx.font = 'bold 20px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`|${photonB.result}⟩`, bobX, centerY)
        }
      })

      // Draw creation flash
      if (flash) {
        const flashGrad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, 120)
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        flashGrad.addColorStop(0.2, 'rgba(69, 93, 236, 0.6)')
        flashGrad.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)')
        flashGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = flashGrad
        ctx.beginPath()
        ctx.arc(flash.x, flash.y, 120, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [flash])

  // Auto-run effect
  useEffect(() => {
    if (!isAutoRunning) return
    const interval = setInterval(createPair, 1500)
    return () => clearInterval(interval)
  }, [isAutoRunning, createPair])

  const correlationRate = measurements.length > 0
    ? (measurements.filter(m => m.correlated).length / measurements.length) * 100
    : 0

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-[#455DEC]" />
            Bell Pair Generator
          </h1>
          <p className="text-white/50 text-sm">EIP-002 Protocol - Create maximally entangled photon pairs</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Canvas */}
        <div className="lab-canvas p-4 relative" style={{ minHeight: '420px' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full rounded-lg"
            style={{ background: '#050510', display: 'block' }}
          />

          {/* Controls overlay */}
          <div className="absolute bottom-6 left-6 flex gap-3">
            <motion.button
              onClick={createPair}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary py-3 px-5 flex items-center gap-2 shadow-lg shadow-[#455DEC]/30"
            >
              <Sparkles className="w-5 h-5" />
              Create Bell Pair
            </motion.button>
            <motion.button
              onClick={() => setIsAutoRunning(!isAutoRunning)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-3 px-5 flex items-center gap-2 rounded-lg font-medium transition-all ${
                isAutoRunning
                  ? 'bg-[#F07362] text-white shadow-lg shadow-[#F07362]/30'
                  : 'btn-secondary'
              }`}
            >
              <Zap className="w-5 h-5" />
              {isAutoRunning ? 'Stop Auto' : 'Auto Run'}
            </motion.button>
          </div>

          {/* State indicator */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-xs text-white/50 mb-1">Bell State</div>
            <div className="font-mono text-lg text-[#455DEC]">|Φ+⟩ = (|00⟩ + |11⟩)/√2</div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="card p-5 space-y-6">
          <h2 className="font-semibold">Measurement Results</h2>

          {/* Correlation meter */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#455DEC]/10 to-transparent border border-[#455DEC]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/60">Correlation Rate</span>
              <span className="text-2xl font-bold text-[#455DEC]">{correlationRate.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #455DEC, #00D4FF)' }}
                initial={{ width: 0 }}
                animate={{ width: `${correlationRate}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-2">
              Expected: 100% for |Φ+⟩ state
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card p-3">
              <div className="text-xs text-white/40 mb-1">Total Pairs</div>
              <div className="text-xl font-bold">{measurements.length}</div>
            </div>
            <div className="stat-card p-3">
              <div className="text-xs text-white/40 mb-1">Correlated</div>
              <div className="text-xl font-bold text-green-400">
                {measurements.filter(m => m.correlated).length}
              </div>
            </div>
          </div>

          {/* Recent measurements */}
          <div>
            <h3 className="text-sm font-medium text-white/60 mb-3">Recent Measurements</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {measurements.slice(-10).reverse().map((m, i) => (
                <motion.div
                  key={m.timestamp}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-[#F07362]/20 text-[#F07362] font-mono text-sm">
                      A: |{m.alice}⟩
                    </span>
                    <span className="px-2 py-1 rounded bg-[#00D4FF]/20 text-[#00D4FF] font-mono text-sm">
                      B: |{m.bob}⟩
                    </span>
                  </div>
                  <span className={m.correlated ? 'text-green-400' : 'text-red-400'}>
                    {m.correlated ? '✓' : '✗'}
                  </span>
                </motion.div>
              ))}
              {measurements.length === 0 && (
                <p className="text-center text-white/30 py-4 text-sm">
                  No measurements yet
                </p>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-white/5 text-xs text-white/50 space-y-2">
            <p><strong className="text-[#F07362]">Alice:</strong> Measures first photon</p>
            <p><strong className="text-[#00D4FF]">Bob:</strong> Measures second photon</p>
            <p><strong className="text-white/70">Correlation:</strong> Results always match in |Φ+⟩</p>
          </div>
        </div>
      </div>
    </div>
  )
}
