'use client'

import { motion } from 'framer-motion'
import { SimulationResult } from '@/lib/stores/circuitStore'

interface Props {
  results: SimulationResult | null
}

export function SimulationResults({ results }: Props) {
  if (!results) {
    return (
      <div className="text-center py-12 text-white/40">
        <p className="mb-2">No simulation yet</p>
        <p className="text-sm">Build a circuit and click Run to see results</p>
      </div>
    )
  }

  const maxCount = Math.max(...Object.values(results.counts))

  return (
    <div className="space-y-6">
      {/* State Vector */}
      <div>
        <h3 className="text-sm font-semibold text-white/60 mb-3">Quantum State</h3>
        <div className="font-mono text-lg bg-white/5 p-3 rounded-lg">
          {results.stateVector}
        </div>
      </div>

      {/* Measurement Histogram */}
      <div>
        <h3 className="text-sm font-semibold text-white/60 mb-3">Measurement Results</h3>
        <div className="space-y-2">
          {Object.entries(results.counts)
            .sort((a, b) => b[1] - a[1])
            .map(([state, count]) => {
              const percentage = (count / results.totalShots) * 100

              return (
                <div key={state} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono">|{state}⟩</span>
                    <span className="text-white/60">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-6 bg-white/10 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-lg"
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-xs text-white/40">Total Shots</div>
          <div className="text-lg font-semibold">{results.totalShots.toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-xs text-white/40">Unique States</div>
          <div className="text-lg font-semibold">{Object.keys(results.counts).length}</div>
        </div>
      </div>

      {/* Probabilities */}
      <div>
        <h3 className="text-sm font-semibold text-white/60 mb-3">State Probabilities</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(results.probabilities).map(([state, prob]) => (
            <div key={state} className="flex items-center justify-between p-2 rounded bg-white/5 text-sm">
              <span className="font-mono">|{state}⟩</span>
              <span className="text-quantum-accent">{(prob * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bloch sphere hint */}
      <div className="text-xs text-white/40 p-3 rounded-lg bg-white/5">
        <p>🔮 State vector shows the quantum amplitudes. Probabilities = |amplitude|²</p>
      </div>
    </div>
  )
}
