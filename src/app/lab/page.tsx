'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Cpu, Zap, GitBranch, Radio, Atom, ArrowRight, Play } from 'lucide-react'

const tools = [
  {
    id: 'circuit-composer',
    title: 'Circuit Composer',
    description: 'Build and simulate quantum circuits with drag-and-drop gates',
    icon: Cpu,
    href: '/lab/circuit-composer',
    featured: true,
  },
  {
    id: 'photon-simulator',
    title: 'Photon Simulator',
    description: 'Visualize wave-particle duality and quantum interference',
    icon: Zap,
    href: '/lab/photon-simulator',
    featured: true,
  },
]

const experiments = [
  {
    id: 'bell-pairs',
    title: 'Bell Pair Generator',
    description: 'Create maximally entangled photon pairs',
    icon: GitBranch,
    href: '/lab/experiments/bell-pairs',
    difficulty: 'Intermediate',
    protocol: 'EIP-002',
  },
  {
    id: 'teleportation',
    title: 'Quantum Teleportation',
    description: 'Transfer quantum states across distances',
    icon: Radio,
    href: '/lab/experiments/teleportation',
    difficulty: 'Advanced',
    protocol: 'EIP-004',
  },
  {
    id: 'ghz-states',
    title: 'GHZ State Generator',
    description: 'Create multi-qubit entangled states',
    icon: GitBranch,
    href: '/lab/experiments/ghz-states',
    difficulty: 'Advanced',
    protocol: 'EIP-003',
  },
  {
    id: 'nv-center',
    title: 'NV-Center Simulation',
    description: 'Diamond nitrogen-vacancy center experiments',
    icon: Atom,
    href: '/lab/experiments/nv-center',
    difficulty: 'Expert',
    protocol: 'EIP-001',
  },
]

const difficultyBadge = (level: string) => {
  switch (level) {
    case 'Beginner': return 'badge-beginner'
    case 'Intermediate': return 'badge-intermediate'
    case 'Advanced': return 'badge-advanced'
    case 'Expert': return 'badge-expert'
    default: return 'badge-beginner'
  }
}

export default function LabPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Virtual Lab</h1>
        <p className="text-white/60">
          Explore photonic quantum computing through interactive simulations
        </p>
      </div>

      {/* Featured Tools */}
      <section className="mb-12">
        <h2 className="section-subheader">Tools</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={tool.href}>
                <div className="card p-6 h-full group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#455DEC] to-[#00D4FF] flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                  <p className="text-white/60 text-sm">{tool.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experiments */}
      <section>
        <h2 className="section-subheader">Experiments</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {experiments.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link href={exp.href}>
                <div className="experiment-card group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <exp.icon className="w-5 h-5 text-[#455DEC]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <span className="text-xs text-white/40">{exp.protocol}</span>
                      </div>
                    </div>
                    <span className={difficultyBadge(exp.difficulty)}>
                      {exp.difficulty}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-4">{exp.description}</p>
                  <div className="flex items-center text-[#455DEC] text-sm">
                    <span>Start experiment</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hardware Info */}
      <section className="mt-12">
        <div className="card p-6">
          <h3 className="font-semibold mb-3">Supported Quantum Hardware</h3>
          <p className="text-white/60 text-sm mb-4">
            Run experiments on real quantum computers from leading providers
          </p>
          <div className="flex flex-wrap gap-2">
            {['IBM Quantum', 'IonQ', 'Amazon Braket', 'Azure Quantum', 'Quandela'].map((provider) => (
              <span key={provider} className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-white/70">
                {provider}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
