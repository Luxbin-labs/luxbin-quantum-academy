'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Download, Save, Zap, Info } from 'lucide-react'
import { CircuitCanvas } from '@/components/lab/CircuitCanvas'
import { GateToolbox } from '@/components/lab/GateToolbox'
import { SimulationResults } from '@/components/lab/SimulationResults'
import { useCircuitStore } from '@/lib/stores/circuitStore'

export default function CircuitComposerPage() {
  const { circuit, resetCircuit, runSimulation, simulationResults, isSimulating } = useCircuitStore()
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quantum Circuit Composer</h1>
            <p className="text-white/60">Build photonic quantum circuits with drag-and-drop gates</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 glass-panel rounded-xl"
            >
              <Info className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetCircuit}
              className="p-3 glass-panel rounded-xl"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 glass-panel rounded-xl"
            >
              <Save className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 glass-panel rounded-xl"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-6 py-3 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white flex items-center gap-2 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Run
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 mb-6"
          >
            <h3 className="font-semibold mb-3">How to use the Circuit Composer</h3>
            <ul className="text-white/70 space-y-2 text-sm">
              <li>• <strong>Drag gates</strong> from the toolbox onto the circuit</li>
              <li>• <strong>Click a gate</strong> on the circuit to select/remove it</li>
              <li>• <strong>H (Hadamard)</strong>: Creates superposition |0⟩ + |1⟩</li>
              <li>• <strong>X (Pauli-X)</strong>: Bit flip gate, |0⟩ ↔ |1⟩</li>
              <li>• <strong>CNOT</strong>: Controlled-NOT, creates entanglement</li>
              <li>• <strong>Measure</strong>: Collapses quantum state to classical bit</li>
            </ul>
          </motion.div>
        )}

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[250px_1fr_350px] gap-6">
          {/* Gate Toolbox */}
          <div className="glass-panel p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-quantum-accent" /> Quantum Gates
            </h2>
            <GateToolbox />
          </div>

          {/* Circuit Canvas */}
          <div className="glass-panel p-6 min-h-[500px]">
            <CircuitCanvas />
          </div>

          {/* Results Panel */}
          <div className="glass-panel p-4">
            <h2 className="font-semibold mb-4">Simulation Results</h2>
            <SimulationResults results={simulationResults} />
          </div>
        </div>
      </div>
    </div>
  )
}
