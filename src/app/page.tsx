'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Atom, BookOpen, Award, Beaker, Sparkles, ArrowRight } from 'lucide-react'
import { PhotonBackground } from '@/components/effects/PhotonBackground'

const features = [
  {
    icon: Beaker,
    title: 'Virtual Quantum Lab',
    description: 'Build and simulate photonic quantum circuits with interactive tools',
    href: '/lab',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Interactive Courses',
    description: 'Learn quantum computing from fundamentals to advanced protocols',
    href: '/courses',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Award,
    title: 'Earn Certificates',
    description: 'Get blockchain-verified certificates for completed courses',
    href: '/certificates',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Atom,
    title: 'Quantum Dots & Photons',
    description: 'Experiment with NV-centers, Bell pairs, and quantum teleportation',
    href: '/lab/experiments',
    color: 'from-pink-500 to-rose-500',
  },
]

const stats = [
  { value: '803+', label: 'Qubits Available' },
  { value: '12+', label: 'Quantum Computers' },
  { value: '4', label: 'AI Tutors' },
  { value: '∞', label: 'Possibilities' },
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PhotonBackground />

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-quantum-primary to-quantum-accent p-[2px]"
              >
                <div className="w-full h-full rounded-full bg-quantum-darker flex items-center justify-center">
                  <Atom className="w-12 h-12 text-quantum-accent" />
                </div>
              </motion.div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary bg-clip-text text-transparent">
              LUXBIN Quantum Academy
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8">
            Master photonic quantum computing through hands-on experiments with quantum dots,
            entangled photons, and real quantum hardware
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white flex items-center gap-2 quantum-glow"
              >
                Start Learning <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/lab">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass-panel font-semibold text-white flex items-center gap-2"
              >
                <Beaker className="w-5 h-5" /> Open Lab
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-quantum-primary to-quantum-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Your Quantum Learning Journey
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={feature.href}>
                <div className="glass-panel p-6 h-full hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="glass-panel p-12 quantum-glow">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore the Quantum Realm?</h2>
          <p className="text-white/70 mb-8">
            Join thousands of learners mastering photonic quantum computing with LUXBIN protocols
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white"
            >
              Get Started Free
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}
