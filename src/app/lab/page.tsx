'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Atom, Zap, GitBranch, Radio, Cpu, ArrowRight } from 'lucide-react'

const experiments = [
  {
    id: 'circuit-composer',
    title: 'Quantum Circuit Composer',
    description: 'Build and simulate photonic quantum circuits with drag-and-drop gates',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-500',
    href: '/lab/circuit-composer',
  },
  {
    id: 'photon-simulator',
    title: 'Photon Simulator',
    description: 'Visualize single photons, interference patterns, and wave-particle duality',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    href: '/lab/photon-simulator',
  },
  {
    id: 'bell-pairs',
    title: 'Bell Pair Generator',
    description: 'Create and measure entangled photon pairs using the EIP-002 protocol',
    icon: GitBranch,
    color: 'from-pink-500 to-rose-500',
    href: '/lab/experiments/bell-pairs',
  },
  {
    id: 'teleportation',
    title: 'Quantum Teleportation',
    description: 'Teleport quantum states using the EIP-004 protocol',
    icon: Radio,
    color: 'from-amber-500 to-orange-500',
    href: '/lab/experiments/teleportation',
  },
  {
    id: 'nv-center',
    title: 'NV-Center Simulation',
    description: 'Explore diamond nitrogen-vacancy centers for quantum memory',
    icon: Atom,
    color: 'from-green-500 to-emerald-500',
    href: '/lab/experiments/nv-center',
  },
  {
    id: 'ghz-states',
    title: 'GHZ State Generator',
    description: 'Create multi-qubit entanglement with Greenberger-Horne-Zeilinger states',
    icon: GitBranch,
    color: 'from-indigo-500 to-blue-500',
    href: '/lab/experiments/ghz-states',
  },
]

export default function LabPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-quantum-primary to-quantum-accent bg-clip-text text-transparent">
              Virtual Quantum Lab
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore photonic quantum computing through interactive experiments
          </p>
        </motion.div>

        {/* Quick Access */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/lab/circuit-composer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white flex items-center gap-2"
            >
              <Cpu className="w-5 h-5" /> Open Circuit Composer
            </motion.button>
          </Link>
          <Link href="/lab/photon-simulator">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass-panel font-semibold text-white flex items-center gap-2"
            >
              <Zap className="w-5 h-5" /> Photon Simulator
            </motion.button>
          </Link>
        </div>

        {/* Experiments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={exp.href}>
                <div className="glass-panel p-6 h-full hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${exp.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <exp.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                  <p className="text-white/60 mb-4">{exp.description}</p>
                  <div className="flex items-center text-quantum-accent">
                    <span className="text-sm">Start Experiment</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Real Hardware Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="glass-panel p-8 quantum-glow">
            <h2 className="text-2xl font-bold mb-4">Run on Real Quantum Hardware</h2>
            <p className="text-white/70 mb-6">
              Connect to IBM Quantum, IonQ, or other providers to run your experiments on actual quantum computers
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-lg bg-white/10 text-sm">IBM Quantum</div>
              <div className="px-4 py-2 rounded-lg bg-white/10 text-sm">IonQ</div>
              <div className="px-4 py-2 rounded-lg bg-white/10 text-sm">Amazon Braket</div>
              <div className="px-4 py-2 rounded-lg bg-white/10 text-sm">Azure Quantum</div>
              <div className="px-4 py-2 rounded-lg bg-white/10 text-sm">Quandela</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
