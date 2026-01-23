'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Download, Save, Info, X } from 'lucide-react'
import { CircuitCanvas } from '@/components/lab/CircuitCanvas'
import { GateToolbox } from '@/components/lab/GateToolbox'
import { SimulationResults } from '@/components/lab/SimulationResults'
import { useCircuitStore } from '@/lib/stores/circuitStore'

export default function CircuitComposerPage() {
  const { resetCircuit, runSimulation, simulationResults, isSimulating } = useCircuitStore()
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="p-6 h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Circuit Composer</h1>
          <p className="text-white/50 text-sm">Drag gates onto the circuit to build quantum programs</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={resetCircuit}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Save className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runSimulation}
            disabled={isSimulating}
            className="btn-primary flex items-center gap-2 py-2.5 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Run
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
          className="card p-4 mb-6"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold">Quick Guide</h3>
            <button onClick={() => setShowInfo(false)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
            <div>
              <p className="font-medium text-white mb-1">Adding Gates</p>
              <p>Drag gates from the toolbox onto circuit slots</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Removing Gates</p>
              <p>Click on any gate in the circuit to remove it</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Running</p>
              <p>Click Run to simulate with 1024 measurement shots</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-[220px_1fr_320px] gap-4 h-[calc(100%-80px)]">
        {/* Gate Toolbox */}
        <div className="card p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Quantum Gates</h2>
          <GateToolbox />
        </div>

        {/* Circuit Canvas */}
        <div className="lab-canvas p-6 overflow-auto">
          <CircuitCanvas />
        </div>

        {/* Results Panel */}
        <div className="card p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Results</h2>
          <SimulationResults results={simulationResults} />
        </div>
      </div>
    </div>
  )
}
