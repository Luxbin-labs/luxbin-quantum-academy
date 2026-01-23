'use client'

import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useCircuitStore, Gate, GateType } from '@/lib/stores/circuitStore'
import { clsx } from 'clsx'

const QUBIT_LABELS = ['q₀', 'q₁', 'q₂', 'q₃']
const TIME_SLOTS = 8

const gateColors: Record<GateType, string> = {
  H: 'from-blue-500 to-cyan-500',
  X: 'from-red-500 to-pink-500',
  Y: 'from-green-500 to-emerald-500',
  Z: 'from-purple-500 to-violet-500',
  CNOT: 'from-amber-500 to-orange-500',
  CZ: 'from-indigo-500 to-blue-500',
  SWAP: 'from-teal-500 to-cyan-500',
  T: 'from-fuchsia-500 to-pink-500',
  S: 'from-lime-500 to-green-500',
  Rx: 'from-rose-500 to-red-500',
  Ry: 'from-sky-500 to-blue-500',
  Rz: 'from-violet-500 to-purple-500',
  M: 'from-gray-500 to-slate-500',
  BS: 'from-cyan-400 to-blue-400',
  PS: 'from-yellow-400 to-amber-400',
}

const gateLabels: Record<GateType, string> = {
  H: 'H',
  X: 'X',
  Y: 'Y',
  Z: 'Z',
  CNOT: '⊕',
  CZ: 'CZ',
  SWAP: '⤫',
  T: 'T',
  S: 'S',
  Rx: 'Rx',
  Ry: 'Ry',
  Rz: 'Rz',
  M: '📊',
  BS: 'BS',
  PS: 'PS',
}

export function CircuitCanvas() {
  const { circuit, addGate, removeGate, numQubits } = useCircuitStore()
  const [dragOver, setDragOver] = useState<{ qubit: number; time: number } | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent, qubit: number, time: number) => {
    e.preventDefault()
    setDragOver({ qubit, time })
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, qubit: number, time: number) => {
    e.preventDefault()
    const gateType = e.dataTransfer.getData('gateType') as GateType
    if (gateType) {
      addGate({
        type: gateType,
        qubit,
        time,
        params: gateType.startsWith('R') ? { angle: Math.PI / 4 } : undefined,
      })
    }
    setDragOver(null)
  }, [addGate])

  const getGateAtPosition = (qubit: number, time: number): Gate | undefined => {
    return circuit.gates.find(g => g.qubit === qubit && g.time === time)
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Time labels */}
        <div className="flex mb-2 ml-16">
          {Array.from({ length: TIME_SLOTS }).map((_, t) => (
            <div key={t} className="w-16 text-center text-xs text-white/40">
              t={t}
            </div>
          ))}
        </div>

        {/* Qubit wires */}
        {Array.from({ length: numQubits }).map((_, q) => (
          <div key={q} className="flex items-center mb-4">
            {/* Qubit label */}
            <div className="w-16 text-right pr-4 font-mono text-quantum-accent">
              {QUBIT_LABELS[q]}
            </div>

            {/* Wire with gate slots */}
            <div className="relative flex items-center">
              {/* Background wire */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-white/20" />
              </div>

              {/* Gate slots */}
              {Array.from({ length: TIME_SLOTS }).map((_, t) => {
                const gate = getGateAtPosition(q, t)
                const isDragOver = dragOver?.qubit === q && dragOver?.time === t

                return (
                  <div
                    key={t}
                    className={clsx(
                      'w-16 h-14 flex items-center justify-center relative z-10',
                      isDragOver && 'bg-quantum-primary/20 rounded-lg'
                    )}
                    onDragOver={(e) => handleDragOver(e, q, t)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, q, t)}
                  >
                    {gate ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={clsx(
                          'w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center cursor-pointer',
                          gateColors[gate.type]
                        )}
                        onClick={() => removeGate(gate.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-white font-bold text-lg">
                          {gateLabels[gate.type]}
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border-2 border-dashed border-white/10 hover:border-white/30 transition-colors" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Output state */}
            <div className="w-16 text-left pl-4 font-mono text-white/40">
              |ψ⟩
            </div>
          </div>
        ))}

        {/* Photon visualization hint */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-white/60">
              Photons flow left to right through the circuit. Each gate transforms the quantum state.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
