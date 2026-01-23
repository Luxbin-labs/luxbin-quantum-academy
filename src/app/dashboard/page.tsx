'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  BookOpen,
  Award,
  Beaker,
  TrendingUp,
  Clock,
  Target,
  Zap,
  ChevronRight,
  Play
} from 'lucide-react'
import { useCourseStore } from '@/lib/stores/courseStore'

const courses = [
  { id: 'quantum-fundamentals', title: 'Quantum Fundamentals', color: 'from-blue-500 to-cyan-500' },
  { id: 'photonic-computing', title: 'Photonic Quantum Computing', color: 'from-violet-500 to-purple-500' },
  { id: 'entanglement-protocols', title: 'Entanglement Protocols', color: 'from-pink-500 to-rose-500' },
]

const recentActivity = [
  { type: 'lesson', title: 'Completed "Introduction to Quantum Mechanics"', time: '2 hours ago' },
  { type: 'quiz', title: 'Passed "Superposition Quiz" with 90%', time: '1 day ago' },
  { type: 'lab', title: 'Ran Bell Pair experiment', time: '2 days ago' },
  { type: 'certificate', title: 'Earned "Quantum Fundamentals" certificate', time: '3 days ago' },
]

export default function DashboardPage() {
  const { getProgress, completedCourses, completedLessons } = useCourseStore()

  const totalLessonsCompleted = Object.values(completedLessons).flat().length
  const totalCertificates = completedCourses.length

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, Quantum Learner!</h1>
          <p className="text-xl text-white/70">Continue your journey into photonic quantum computing</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white/60">Lessons</span>
            </div>
            <div className="text-3xl font-bold">{totalLessonsCompleted}</div>
            <div className="text-sm text-white/40">completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-white/60">Certificates</span>
            </div>
            <div className="text-3xl font-bold">{totalCertificates}</div>
            <div className="text-sm text-white/40">earned</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white/60">Streak</span>
            </div>
            <div className="text-3xl font-bold">7</div>
            <div className="text-sm text-white/40">days</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Beaker className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white/60">Lab Time</span>
            </div>
            <div className="text-3xl font-bold">4.2h</div>
            <div className="text-sm text-white/40">this week</div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-quantum-accent" /> Continue Learning
              </h2>

              <div className="space-y-4">
                {courses.map((course, i) => {
                  const progress = getProgress(course.id)
                  if (progress >= 100) return null

                  return (
                    <Link key={course.id} href={`/courses/${course.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="glass-panel p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${course.color} flex items-center justify-center flex-shrink-0`}>
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{course.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex-1 progress-bar h-2">
                              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-sm text-white/60">{progress}%</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40" />
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-quantum-accent" /> Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/lab/circuit-composer">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-panel p-6 text-center cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-3">
                      <Beaker className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Circuit Composer</h3>
                    <p className="text-sm text-white/60 mt-1">Build quantum circuits</p>
                  </motion.div>
                </Link>

                <Link href="/lab/photon-simulator">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-panel p-6 text-center cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center mb-3">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Photon Simulator</h3>
                    <p className="text-sm text-white/60 mt-1">Visualize photon behavior</p>
                  </motion.div>
                </Link>

                <Link href="/lab/experiments/bell-pairs">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-panel p-6 text-center cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Bell Pairs</h3>
                    <p className="text-sm text-white/60 mt-1">Create entanglement</p>
                  </motion.div>
                </Link>

                <Link href="/certificates">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-panel p-6 text-center cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold">Certificates</h3>
                    <p className="text-sm text-white/60 mt-1">View achievements</p>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="glass-panel p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-quantum-accent" /> Recent Activity
              </h2>

              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'lesson' ? 'bg-blue-400' :
                      activity.type === 'quiz' ? 'bg-green-400' :
                      activity.type === 'lab' ? 'bg-purple-400' :
                      'bg-amber-400'
                    }`} />
                    <div>
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-white/40">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="glass-panel p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-quantum-accent" /> Weekly Goals
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Complete 5 lessons</span>
                    <span className="text-quantum-accent">3/5</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div className="progress-bar-fill" style={{ width: '60%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Spend 2h in lab</span>
                    <span className="text-quantum-accent">1.5/2h</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div className="progress-bar-fill" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pass 2 quizzes</span>
                    <span className="text-quantum-accent">1/2</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div className="progress-bar-fill" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
