'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Info, X, Send } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export default function TeleportationPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const phaseRef = useRef<string>('idle')
  const classicalBitsRef = useRef<string>('')
  const timeRef = useRef(0)

  const [phase, setPhase] = useState<string>('idle')
  const [showInfo, setShowInfo] = useState(false)
  const [teleportCount, setTeleportCount] = useState(0)
  const [inputState] = useState({ alpha: 0.707, beta: 0.707 })

  // Update refs when state changes
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const createParticles = useCallback((x: number, y: number, color: string, count: number = 20) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * (2 + Math.random() * 2),
        vy: Math.sin(angle) * (2 + Math.random() * 2),
        life: 1,
        color
      })
    }
    particlesRef.current = [...particlesRef.current, ...newParticles]
  }, [])

  const runTeleportation = useCallback(() => {
    setPhase('entangle')
    createParticles(400, 200, '#455DEC', 30)

    setTimeout(() => {
      setPhase('encode')
      createParticles(150, 200, '#F07362', 15)
    }, 1500)

    setTimeout(() => {
      const bits = ['00', '01', '10', '11'][Math.floor(Math.random() * 4)]
      classicalBitsRef.current = bits
      setPhase('measure')
      createParticles(250, 200, '#00D4FF', 25)
    }, 3000)

    setTimeout(() => {
      setPhase('send')
    }, 4500)

    setTimeout(() => {
      setPhase('reconstruct')
      createParticles(650, 200, '#00D4FF', 30)
    }, 6000)

    setTimeout(() => {
      setPhase('complete')
      createParticles(650, 200, '#4CAF50', 40)
      setTeleportCount(c => c + 1)
    }, 7500)
  }, [createParticles])

  const reset = useCallback(() => {
    setPhase('idle')
    particlesRef.current = []
    classicalBitsRef.current = ''
  }, [])

  // Animation loop - no dependencies that change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      timeRef.current += 0.02
      const time = timeRef.current
      const currentPhase = phaseRef.current
      const classicalBits = classicalBitsRef.current

      // Clear canvas
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw Alice's station
      const aliceGlow = ctx.createRadialGradient(150, 200, 0, 150, 200, 60)
      aliceGlow.addColorStop(0, 'rgba(240, 115, 98, 0.3)')
      aliceGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = aliceGlow
      ctx.beginPath()
      ctx.arc(150, 200, 60, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(240, 115, 98, 0.2)'
      ctx.fillRect(100, 150, 100, 100)
      ctx.strokeStyle = '#F07362'
      ctx.lineWidth = 2
      ctx.strokeRect(100, 150, 100, 100)

      ctx.fillStyle = 'white'
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('Alice', 150, 290)

      // Draw Bob's station
      const bobGlow = ctx.createRadialGradient(650, 200, 0, 650, 200, 60)
      bobGlow.addColorStop(0, 'rgba(0, 212, 255, 0.3)')
      bobGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = bobGlow
      ctx.beginPath()
      ctx.arc(650, 200, 60, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(0, 212, 255, 0.2)'
      ctx.fillRect(600, 150, 100, 100)
      ctx.strokeStyle = '#00D4FF'
      ctx.lineWidth = 2
      ctx.strokeRect(600, 150, 100, 100)

      ctx.fillStyle = 'white'
      ctx.fillText('Bob', 650, 290)

      // Draw entanglement source in center
      if (currentPhase !== 'idle') {
        const sourceGlow = ctx.createRadialGradient(400, 200, 0, 400, 200, 40 + Math.sin(time * 3) * 10)
        sourceGlow.addColorStop(0, 'rgba(69, 93, 236, 0.8)')
        sourceGlow.addColorStop(0.5, 'rgba(69, 93, 236, 0.3)')
        sourceGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = sourceGlow
        ctx.beginPath()
        ctx.arc(400, 200, 50, 0, Math.PI * 2)
        ctx.fill()

        // Entanglement lines
        if (['entangle', 'encode', 'measure'].includes(currentPhase)) {
          ctx.strokeStyle = `rgba(69, 93, 236, ${0.3 + Math.sin(time * 5) * 0.2})`
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.moveTo(200, 200)
          ctx.lineTo(400, 200)
          ctx.lineTo(600, 200)
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      // Draw classical channel (when sending bits)
      if (['send', 'reconstruct', 'complete'].includes(currentPhase)) {
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 3
        ctx.setLineDash([10, 5])

        const progress = currentPhase === 'send' ? (time % 1) : 1
        ctx.beginPath()
        ctx.moveTo(200, 100)
        ctx.lineTo(200 + (450 * progress), 100)
        ctx.stroke()
        ctx.setLineDash([])

        // Classical bits indicator
        if (classicalBits) {
          ctx.fillStyle = '#FFD700'
          ctx.font = '16px monospace'
          ctx.fillText(`Classical: ${classicalBits}`, 400, 80)
        }
      }

      // Draw qubits
      const drawQubit = (x: number, y: number, color: string, label: string, glowing: boolean) => {
        if (glowing) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 30 + Math.sin(time * 4) * 5)
          glow.addColorStop(0, color + 'ff')
          glow.addColorStop(0.5, color + '60')
          glow.addColorStop(1, 'transparent')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, 35, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'white'
        ctx.font = '10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(label, x, y + 4)
      }

      // Alice's input qubit (to teleport)
      if (!['complete'].includes(currentPhase)) {
        drawQubit(120, 200, '#F07362', '|ψ⟩', currentPhase === 'encode')
      }

      // Entangled pair
      if (currentPhase !== 'idle') {
        if (!['complete'].includes(currentPhase)) {
          drawQubit(180, 200, '#455DEC', 'A', ['entangle', 'encode', 'measure'].includes(currentPhase))
        }
        drawQubit(620, 200, '#455DEC', 'B', ['reconstruct', 'complete'].includes(currentPhase))
      }

      // Teleported state at Bob
      if (currentPhase === 'complete') {
        drawQubit(680, 200, '#4CAF50', '|ψ⟩', true)
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vx: p.vx * 0.98,
        vy: p.vy * 0.98,
        life: p.life - 0.02
      })).filter(p => p.life > 0)

      particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Phase indicator
      const phaseLabels: Record<string, string> = {
        idle: 'Ready to teleport',
        entangle: 'Creating entangled pair...',
        encode: 'Alice encodes qubit...',
        measure: 'Bell measurement...',
        send: 'Sending classical bits...',
        reconstruct: 'Bob reconstructs state...',
        complete: 'Teleportation complete!'
      }

      ctx.fillStyle = currentPhase === 'complete' ? '#4CAF50' : '#455DEC'
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(phaseLabels[currentPhase] || '', 400, 350)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-advanced">Advanced</span>
            <span className="text-xs text-white/40">EIP-004</span>
          </div>
          <h1 className="text-2xl font-bold">Quantum Teleportation</h1>
          <p className="text-white/50 text-sm">Transfer quantum states using entanglement and classical communication</p>
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
            onClick={runTeleportation}
            disabled={phase !== 'idle'}
            className="btn-primary flex items-center gap-2 py-2.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Teleport
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
            <h3 className="font-semibold">Quantum Teleportation Protocol</h3>
            <button onClick={() => setShowInfo(false)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
            <div>
              <p className="font-medium text-white mb-1">Step 1: Entangle</p>
              <p>Create an entangled Bell pair shared between Alice and Bob</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Step 2: Measure</p>
              <p>Alice performs a Bell measurement on her qubit and the state to teleport</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Step 3: Reconstruct</p>
              <p>Bob applies corrections based on Alice's classical bits to recover the state</p>
            </div>
          </div>
        </motion.div>
      )}

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
        <div className="card p-4">
          <div className="text-sm text-white/50 mb-1">Input State</div>
          <div className="font-mono text-lg">
            |ψ⟩ = {inputState.alpha.toFixed(2)}|0⟩ + {inputState.beta.toFixed(2)}|1⟩
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-[#455DEC]">{teleportCount}</div>
          <div className="text-sm text-white/50">Successful Teleports</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-white/50 mb-1">Fidelity</div>
          <div className="text-2xl font-bold text-[#4CAF50]">
            {phase === 'complete' ? '100%' : '--'}
          </div>
          <div className="text-xs text-white/30">Theoretical: Perfect</div>
        </div>
      </div>
    </div>
  )
}
