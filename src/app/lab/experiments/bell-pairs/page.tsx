'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Info, Zap, GitBranch } from 'lucide-react'

interface Measurement {
  alice: '0' | '1'
  bob: '0' | '1'
  correlated: boolean
}

export default function BellPairsPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [currentPair, setCurrentPair] = useState<{ alice: number; bob: number } | null>(null)
  const [showInfo, setShowInfo] = useState(true)

  const runExperiment = () => {
    setIsRunning(true)
    setMeasurements([])

    let count = 0
    const maxMeasurements = 20

    const interval = setInterval(() => {
      // Simulate Bell pair measurement
      // In a |Φ+⟩ state, measurements are always correlated
      const aliceResult = Math.random() < 0.5 ? '0' : '1'
      const bobResult = aliceResult as '0' | '1' // Perfect correlation in |Φ+⟩

      // Animate photon positions
      setCurrentPair({ alice: 0, bob: 0 })

      setTimeout(() => {
        setMeasurements((prev) => [
          ...prev,
          { alice: aliceResult, bob: bobResult, correlated: aliceResult === bobResult },
        ])
        setCurrentPair(null)
      }, 500)

      count++
      if (count >= maxMeasurements) {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  const reset = () => {
    setMeasurements([])
    setIsRunning(false)
    setCurrentPair(null)
  }

  const correlationRate = measurements.length > 0
    ? (measurements.filter((m) => m.correlated).length / measurements.length) * 100
    : 0

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-pink-400" />
              Bell Pair Generator
            </h1>
            <p className="text-white/60">EIP-002 Protocol - Create and measure entangled photon pairs</p>
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
              onClick={reset}
              className="p-3 glass-panel rounded-xl"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runExperiment}
              disabled={isRunning}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-semibold text-white flex items-center gap-2 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Run Experiment
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-panel p-6 mb-6"
            >
              <h3 className="font-semibold mb-3">About Bell Pairs (|Φ+⟩ State)</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
                <div>
                  <p className="mb-2">
                    A Bell pair is a pair of entangled qubits in a maximally entangled state:
                  </p>
                  <pre className="bg-white/5 p-3 rounded-lg font-mono text-quantum-accent">
                    |Φ+⟩ = (|00⟩ + |11⟩) / √2
                  </pre>
                </div>
                <div>
                  <p className="mb-2"><strong>Key Properties:</strong></p>
                  <ul className="space-y-1">
                    <li>• Measurements are perfectly correlated</li>
                    <li>• Correlation holds at any distance</li>
                    <li>• No classical communication needed</li>
                    <li>• Violates Bell inequalities</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experiment Visualization */}
        <div className="glass-panel p-8 mb-6">
          <div className="relative h-64 flex items-center justify-center">
            {/* Source */}
            <motion.div
              animate={isRunning ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center z-10"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>

            {/* Alice's side */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Alice</div>
                <div className="w-20 h-20 rounded-xl bg-white/10 border-2 border-blue-400 flex items-center justify-center">
                  {currentPair && (
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="w-8 h-8 rounded-full bg-blue-400"
                    />
                  )}
                </div>
                <div className="mt-2 text-sm text-white/60">Detector A</div>
              </div>
            </div>

            {/* Bob's side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Bob</div>
                <div className="w-20 h-20 rounded-xl bg-white/10 border-2 border-green-400 flex items-center justify-center">
                  {currentPair && (
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="w-8 h-8 rounded-full bg-green-400"
                    />
                  )}
                </div>
                <div className="mt-2 text-sm text-white/60">Detector B</div>
              </div>
            </div>

            {/* Entanglement line */}
            <svg className="absolute inset-0 w-full h-full">
              <line
                x1="15%"
                y1="50%"
                x2="85%"
                y2="50%"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Measurements Table */}
          <div className="glass-panel p-6">
            <h3 className="font-semibold mb-4">Measurement Results</h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-white/40 text-left">
                  <tr>
                    <th className="pb-2">#</th>
                    <th className="pb-2">Alice</th>
                    <th className="pb-2">Bob</th>
                    <th className="pb-2">Correlated</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-t border-white/5"
                    >
                      <td className="py-2 text-white/40">{i + 1}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded ${m.alice === '0' ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          |{m.alice}⟩
                        </span>
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded ${m.bob === '0' ? 'bg-green-500/20 text-green-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          |{m.bob}⟩
                        </span>
                      </td>
                      <td className="py-2">
                        {m.correlated ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {measurements.length === 0 && (
                <p className="text-center text-white/40 py-8">
                  Run the experiment to see results
                </p>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="glass-panel p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Correlation Rate</span>
                  <span className="font-semibold text-quantum-accent">
                    {correlationRate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${correlationRate}%` }}
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-2xl font-bold">{measurements.length}</div>
                  <div className="text-sm text-white/40">Total Measurements</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-2xl font-bold">
                    {measurements.filter((m) => m.correlated).length}
                  </div>
                  <div className="text-sm text-white/40">Correlated Pairs</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 text-sm">
                <p className="text-white/70 mb-2">
                  <strong>Expected Result:</strong> 100% correlation
                </p>
                <p className="text-white/50">
                  In an ideal Bell state |Φ+⟩, Alice and Bob's measurements are always
                  perfectly correlated, regardless of the distance between them.
                </p>
              </div>

              {measurements.length >= 10 && correlationRate > 95 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400"
                >
                  <p className="font-semibold">Experiment Successful!</p>
                  <p className="text-sm text-white/60">
                    High correlation confirms quantum entanglement
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
