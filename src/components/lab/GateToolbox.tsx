'use client'

import { motion } from 'framer-motion'
import { GateType } from '@/lib/stores/circuitStore'

interface GateInfo {
  type: GateType
  name: string
  description: string
  color: string
  category: 'single' | 'multi' | 'measure' | 'photonic'
}

const gates: GateInfo[] = [
  // Single-qubit gates
  { type: 'H', name: 'Hadamard', description: 'Creates superposition', color: 'from-blue-500 to-cyan-500', category: 'single' },
  { type: 'X', name: 'Pauli-X', description: 'Bit flip (NOT)', color: 'from-red-500 to-pink-500', category: 'single' },
  { type: 'Y', name: 'Pauli-Y', description: 'Y rotation', color: 'from-green-500 to-emerald-500', category: 'single' },
  { type: 'Z', name: 'Pauli-Z', description: 'Phase flip', color: 'from-purple-500 to-violet-500', category: 'single' },
  { type: 'T', name: 'T Gate', description: 'π/4 phase', color: 'from-fuchsia-500 to-pink-500', category: 'single' },
  { type: 'S', name: 'S Gate', description: 'π/2 phase', color: 'from-lime-500 to-green-500', category: 'single' },

  // Rotation gates
  { type: 'Rx', name: 'Rx', description: 'X-axis rotation', color: 'from-rose-500 to-red-500', category: 'single' },
  { type: 'Ry', name: 'Ry', description: 'Y-axis rotation', color: 'from-sky-500 to-blue-500', category: 'single' },
  { type: 'Rz', name: 'Rz', description: 'Z-axis rotation', color: 'from-violet-500 to-purple-500', category: 'single' },

  // Multi-qubit gates
  { type: 'CNOT', name: 'CNOT', description: 'Controlled-NOT', color: 'from-amber-500 to-orange-500', category: 'multi' },
  { type: 'CZ', name: 'CZ', description: 'Controlled-Z', color: 'from-indigo-500 to-blue-500', category: 'multi' },
  { type: 'SWAP', name: 'SWAP', description: 'Swap qubits', color: 'from-teal-500 to-cyan-500', category: 'multi' },

  // Photonic gates
  { type: 'BS', name: 'Beam Splitter', description: 'Photonic 50/50 split', color: 'from-cyan-400 to-blue-400', category: 'photonic' },
  { type: 'PS', name: 'Phase Shifter', description: 'Optical phase shift', color: 'from-yellow-400 to-amber-400', category: 'photonic' },

  // Measurement
  { type: 'M', name: 'Measure', description: 'Measure qubit', color: 'from-gray-500 to-slate-500', category: 'measure' },
]

const categories = [
  { id: 'single', name: 'Single Qubit' },
  { id: 'multi', name: 'Multi Qubit' },
  { id: 'photonic', name: 'Photonic' },
  { id: 'measure', name: 'Measurement' },
]

export function GateToolbox() {
  const handleDragStart = (e: React.DragEvent, gateType: GateType) => {
    e.dataTransfer.setData('gateType', gateType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">
            {category.name}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {gates
              .filter((g) => g.category === category.id)
              .map((gate) => (
                <motion.div
                  key={gate.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, gate.type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-3 rounded-xl bg-gradient-to-r ${gate.color}
                    cursor-grab active:cursor-grabbing
                    flex flex-col items-center text-center
                  `}
                >
                  <span className="font-bold text-lg text-white">{gate.type}</span>
                  <span className="text-[10px] text-white/80 mt-1">{gate.name}</span>
                </motion.div>
              ))}
          </div>
        </div>
      ))}

      {/* Help text */}
      <div className="text-xs text-white/40 p-3 rounded-lg bg-white/5">
        <p className="mb-2">💡 <strong>Tip:</strong> Drag gates onto the circuit canvas</p>
        <p>Click a gate on the circuit to remove it</p>
      </div>
    </div>
  )
}
