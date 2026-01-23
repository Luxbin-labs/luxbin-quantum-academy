'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play, Lock, Award } from 'lucide-react'
import { useCourseStore } from '@/lib/stores/courseStore'

// Course data (would come from API/CMS in production)
const courseData: Record<string, {
  title: string
  description: string
  color: string
  lessons: {
    id: string
    title: string
    type: 'video' | 'reading' | 'quiz' | 'lab'
    duration: string
    completed?: boolean
  }[]
}> = {
  'quantum-fundamentals': {
    title: 'Quantum Fundamentals',
    description: 'Master the core concepts of quantum mechanics and quantum computing',
    color: 'from-blue-500 to-cyan-500',
    lessons: [
      { id: '1', title: 'Introduction to Quantum Mechanics', type: 'video', duration: '15 min' },
      { id: '2', title: 'Wave-Particle Duality', type: 'reading', duration: '20 min' },
      { id: '3', title: 'Superposition Explained', type: 'video', duration: '18 min' },
      { id: '4', title: 'Lab: Superposition Experiment', type: 'lab', duration: '25 min' },
      { id: '5', title: 'Quantum Measurement', type: 'reading', duration: '15 min' },
      { id: '6', title: 'Qubits and Quantum States', type: 'video', duration: '22 min' },
      { id: '7', title: 'Probability Amplitudes', type: 'reading', duration: '20 min' },
      { id: '8', title: 'Final Quiz: Quantum Fundamentals', type: 'quiz', duration: '30 min' },
    ],
  },
  'photonic-computing': {
    title: 'Photonic Quantum Computing',
    description: 'Learn how light is used for quantum information processing',
    color: 'from-violet-500 to-purple-500',
    lessons: [
      { id: '1', title: 'Introduction to Photonics', type: 'video', duration: '15 min' },
      { id: '2', title: 'Properties of Photons', type: 'reading', duration: '18 min' },
      { id: '3', title: 'Single-Photon Sources', type: 'video', duration: '20 min' },
      { id: '4', title: 'Lab: Photon Detection', type: 'lab', duration: '25 min' },
      { id: '5', title: 'Linear Optical Elements', type: 'reading', duration: '22 min' },
      { id: '6', title: 'Beam Splitters and Phase Shifters', type: 'video', duration: '18 min' },
      { id: '7', title: 'Lab: Build a Photonic Circuit', type: 'lab', duration: '30 min' },
      { id: '8', title: 'LUXBIN Light Encoding', type: 'reading', duration: '25 min' },
      { id: '9', title: 'Lab: LUXBIN Encoding', type: 'lab', duration: '20 min' },
      { id: '10', title: 'Final Quiz: Photonic Computing', type: 'quiz', duration: '30 min' },
    ],
  },
  'entanglement-protocols': {
    title: 'Entanglement Protocols',
    description: 'Deep dive into Bell pairs, GHZ states, and quantum correlations',
    color: 'from-pink-500 to-rose-500',
    lessons: [
      { id: '1', title: 'What is Entanglement?', type: 'video', duration: '18 min' },
      { id: '2', title: 'The EPR Paradox', type: 'reading', duration: '20 min' },
      { id: '3', title: 'Bell States Explained', type: 'video', duration: '22 min' },
      { id: '4', title: 'Lab: Create Bell Pairs', type: 'lab', duration: '25 min' },
      { id: '5', title: 'Bell Inequality and CHSH', type: 'reading', duration: '25 min' },
      { id: '6', title: 'Quiz: Bell States', type: 'quiz', duration: '15 min' },
      { id: '7', title: 'GHZ States Introduction', type: 'video', duration: '20 min' },
      { id: '8', title: 'Multi-Qubit Entanglement', type: 'reading', duration: '22 min' },
      { id: '9', title: 'Lab: Create GHZ States', type: 'lab', duration: '30 min' },
      { id: '10', title: 'EIP-002: Bell Pair Protocol', type: 'video', duration: '15 min' },
      { id: '11', title: 'EIP-003: GHZ State Protocol', type: 'reading', duration: '18 min' },
      { id: '12', title: 'Final Quiz: Entanglement', type: 'quiz', duration: '30 min' },
    ],
  },
}

const typeIcons: Record<string, typeof BookOpen> = {
  video: Play,
  reading: BookOpen,
  quiz: Award,
  lab: CheckCircle,
}

const typeColors: Record<string, string> = {
  video: 'bg-blue-500/20 text-blue-400',
  reading: 'bg-green-500/20 text-green-400',
  quiz: 'bg-amber-500/20 text-amber-400',
  lab: 'bg-purple-500/20 text-purple-400',
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const course = courseData[courseId]
  const { completedLessons, completeLesson, getProgress } = useCourseStore()

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Course not found</p>
      </div>
    )
  }

  const progress = getProgress(courseId)

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden mb-8"
        >
          <div className={`h-40 bg-gradient-to-r ${course.color} p-8 relative`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-white/80">{course.description}</p>
            </div>
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-white/60">
                <BookOpen className="w-5 h-5" />
                <span>{course.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-5 h-5" />
                <span>{course.lessons.reduce((acc, l) => acc + parseInt(l.duration), 0)} min total</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <CheckCircle className="w-5 h-5" />
                <span>{completedLessons[courseId]?.length || 0} completed</span>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Course Progress</span>
                <span className="text-quantum-accent font-semibold">{progress}%</span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {progress === 100 && (
              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                <Award className="w-6 h-6 text-green-400" />
                <div>
                  <p className="font-semibold text-green-400">Course Completed!</p>
                  <p className="text-sm text-white/60">Your certificate is ready</p>
                </div>
                <Link href={`/certificates?course=${courseId}`} className="ml-auto">
                  <button className="px-4 py-2 bg-green-500 rounded-lg text-white text-sm font-semibold">
                    View Certificate
                  </button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lessons List */}
        <div className="space-y-3">
          {course.lessons.map((lesson, i) => {
            const isCompleted = completedLessons[courseId]?.includes(lesson.id)
            const Icon = typeIcons[lesson.type]
            const isLocked = i > 0 && !completedLessons[courseId]?.includes(course.lessons[i - 1].id)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={isLocked ? '#' : `/courses/${courseId}/${lesson.id}`}>
                  <div className={`glass-panel p-4 flex items-center gap-4 ${isLocked ? 'opacity-50' : 'hover:bg-white/10'} transition-colors cursor-pointer`}>
                    {/* Lesson number */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500/20' : 'bg-white/10'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-white/40" />
                      ) : (
                        <span className="text-white/60">{i + 1}</span>
                      )}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${typeColors[lesson.type]}`}>
                          {lesson.type}
                        </span>
                        <span className="text-xs text-white/40">{lesson.duration}</span>
                      </div>
                    </div>

                    {/* Type icon */}
                    <Icon className="w-5 h-5 text-white/40" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
