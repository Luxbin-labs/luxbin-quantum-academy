'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Clock, Award, Star, Lock, CheckCircle } from 'lucide-react'
import { useCourseStore } from '@/lib/stores/courseStore'

const courses = [
  {
    id: 'quantum-fundamentals',
    title: 'Quantum Fundamentals',
    description: 'Master the core concepts of quantum mechanics and quantum computing',
    level: 'Beginner',
    lessons: 8,
    duration: '4 hours',
    image: '/courses/fundamentals.jpg',
    color: 'from-blue-500 to-cyan-500',
    topics: ['Superposition', 'Measurement', 'Qubits', 'Probability Amplitudes'],
    unlocked: true,
  },
  {
    id: 'photonic-computing',
    title: 'Photonic Quantum Computing',
    description: 'Learn how light is used for quantum information processing',
    level: 'Beginner-Intermediate',
    lessons: 10,
    duration: '5 hours',
    image: '/courses/photonics.jpg',
    color: 'from-violet-500 to-purple-500',
    topics: ['Photon Properties', 'Linear Optics', 'LUXBIN Encoding', 'Beam Splitters'],
    unlocked: true,
  },
  {
    id: 'entanglement-protocols',
    title: 'Entanglement Protocols',
    description: 'Deep dive into Bell pairs, GHZ states, and quantum correlations',
    level: 'Intermediate',
    lessons: 12,
    duration: '6 hours',
    image: '/courses/entanglement.jpg',
    color: 'from-pink-500 to-rose-500',
    topics: ['Bell Pairs', 'GHZ States', 'CHSH Inequality', 'EIP-002 Protocol'],
    unlocked: true,
  },
  {
    id: 'quantum-teleportation',
    title: 'Quantum Teleportation',
    description: 'Master the art of teleporting quantum states across distances',
    level: 'Advanced',
    lessons: 8,
    duration: '4 hours',
    image: '/courses/teleportation.jpg',
    color: 'from-amber-500 to-orange-500',
    topics: ['State Transfer', 'Classical Communication', 'EIP-004 Protocol', 'Fidelity'],
    unlocked: false,
    prerequisite: 'entanglement-protocols',
  },
  {
    id: 'nv-centers',
    title: 'NV-Center Quantum Memory',
    description: 'Explore diamond nitrogen-vacancy centers for quantum storage',
    level: 'Advanced',
    lessons: 10,
    duration: '5 hours',
    image: '/courses/nv-centers.jpg',
    color: 'from-green-500 to-emerald-500',
    topics: ['Diamond Defects', 'Spin Qubits', 'EIP-001 Protocol', 'Quantum Memory'],
    unlocked: false,
    prerequisite: 'photonic-computing',
  },
  {
    id: 'quantum-networks',
    title: 'Quantum Networks',
    description: 'Build and understand multi-node quantum communication systems',
    level: 'Expert',
    lessons: 14,
    duration: '8 hours',
    image: '/courses/networks.jpg',
    color: 'from-indigo-500 to-blue-500',
    topics: ['Quantum Repeaters', 'QKD', 'Network Topology', 'LUXBIN Protocol'],
    unlocked: false,
    prerequisite: 'quantum-teleportation',
  },
]

const levelColors: Record<string, string> = {
  'Beginner': 'bg-green-500/20 text-green-400',
  'Beginner-Intermediate': 'bg-blue-500/20 text-blue-400',
  'Intermediate': 'bg-yellow-500/20 text-yellow-400',
  'Advanced': 'bg-orange-500/20 text-orange-400',
  'Expert': 'bg-red-500/20 text-red-400',
}

export default function CoursesPage() {
  const { getProgress } = useCourseStore()

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
              Learning Paths
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Master photonic quantum computing from fundamentals to advanced protocols
          </p>
        </motion.div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => {
            const progress = getProgress(course.id)

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={course.unlocked ? `/courses/${course.id}` : '#'}>
                  <div className={`glass-panel overflow-hidden group cursor-pointer h-full ${!course.unlocked && 'opacity-60'}`}>
                    {/* Course header */}
                    <div className={`h-32 bg-gradient-to-r ${course.color} p-6 relative`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${levelColors[course.level]}`}>
                          {course.level}
                        </span>
                      </div>
                      {!course.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Lock className="w-8 h-8 text-white/80" />
                        </div>
                      )}
                      {progress === 100 && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Course content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-quantum-accent transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-white/60 text-sm mb-4">
                        {course.description}
                      </p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.topics.slice(0, 3).map((topic) => (
                          <span key={topic} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                            {topic}
                          </span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-white/40">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {progress > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-white/40 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Prerequisite */}
                      {course.prerequisite && !course.unlocked && (
                        <div className="mt-4 text-xs text-white/40">
                          <Lock className="w-3 h-3 inline mr-1" />
                          Complete "{courses.find(c => c.id === course.prerequisite)?.title}" first
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Certificate CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="glass-panel p-8 quantum-glow text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-amber-400" />
            <h2 className="text-2xl font-bold mb-2">Earn Blockchain-Verified Certificates</h2>
            <p className="text-white/70 mb-6">
              Complete courses and quizzes to earn certificates verified on the LUXBIN blockchain
            </p>
            <Link href="/certificates">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold text-white"
              >
                View My Certificates
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
