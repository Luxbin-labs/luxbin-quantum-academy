'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Beaker } from 'lucide-react'
import { useCourseStore } from '@/lib/stores/courseStore'
import { Quiz } from '@/components/courses/Quiz'

// Lesson content (would come from MDX/CMS in production)
const lessonContent: Record<string, Record<string, {
  title: string
  type: 'video' | 'reading' | 'quiz' | 'lab'
  content: string
  quiz?: {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }[]
  nextLesson?: string
}>> = {
  'quantum-fundamentals': {
    '1': {
      title: 'Introduction to Quantum Mechanics',
      type: 'video',
      content: `
# Introduction to Quantum Mechanics

Quantum mechanics is the fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles.

## Key Concepts

### 1. Wave-Particle Duality
Everything in the quantum world exhibits both wave-like and particle-like properties. This is beautifully demonstrated in the famous double-slit experiment.

### 2. The Quantum State
In quantum mechanics, the state of a system is described by a **wave function** (ψ), which contains all the information about the system.

### 3. Superposition
A quantum system can exist in multiple states simultaneously until it is measured. This is the principle behind quantum computing's power.

\`\`\`
|ψ⟩ = α|0⟩ + β|1⟩
\`\`\`

Where α and β are complex probability amplitudes.

### 4. Measurement
When we measure a quantum system, it "collapses" to one of its possible states. The probability of each outcome is given by |amplitude|².

## Why Quantum Computing?

Classical computers use bits (0 or 1). Quantum computers use **qubits** that can be in superposition of both states simultaneously, enabling:

- Exponential parallelism
- Solving certain problems faster
- Simulating quantum systems

## Interactive Exercise

Try the superposition visualizer in our Virtual Lab to see these concepts in action!
      `,
      nextLesson: '2',
    },
    '2': {
      title: 'Wave-Particle Duality',
      type: 'reading',
      content: `
# Wave-Particle Duality

One of the most fundamental and mind-bending concepts in quantum mechanics is **wave-particle duality**.

## The Double-Slit Experiment

When particles (like photons or electrons) pass through two slits:

1. **Classical expectation**: Two bands on the detector
2. **Quantum reality**: An interference pattern (like waves!)

Even when particles are sent one at a time, the interference pattern still emerges over many measurements.

## What Does This Mean?

Each particle seems to pass through **both slits simultaneously** and interfere with itself. This is only possible if it behaves like a wave.

But when we try to observe which slit the particle goes through, the interference pattern disappears! The act of measurement changes the outcome.

## de Broglie Wavelength

Every particle has an associated wavelength:

\`\`\`
λ = h / p
\`\`\`

Where:
- λ = wavelength
- h = Planck's constant
- p = momentum

## Implications for Photonic Quantum Computing

In LUXBIN's photonic approach, we use **single photons** as qubits:

- Photons naturally exhibit wave properties
- Interference is used for quantum gates
- Beam splitters create superposition
- Phase shifters control the quantum state

## Key Takeaway

Light is neither purely a wave nor purely a particle—it's something more fundamental that exhibits both behaviors depending on how we observe it.
      `,
      nextLesson: '3',
    },
    '8': {
      title: 'Final Quiz: Quantum Fundamentals',
      type: 'quiz',
      content: 'Test your knowledge of quantum fundamentals!',
      quiz: [
        {
          question: 'What is superposition in quantum mechanics?',
          options: [
            'A particle being in one definite state',
            'A particle existing in multiple states simultaneously',
            'Two particles being connected',
            'The collapse of a wave function',
          ],
          correctIndex: 1,
          explanation: 'Superposition is the quantum mechanical principle where a quantum system can exist in multiple states at the same time until measured.',
        },
        {
          question: 'In the double-slit experiment with single photons, what pattern emerges?',
          options: [
            'Two distinct bands',
            'A random distribution',
            'An interference pattern',
            'A single point',
          ],
          correctIndex: 2,
          explanation: 'Even with single photons, an interference pattern emerges over many measurements, demonstrating wave-particle duality.',
        },
        {
          question: 'What is the mathematical representation of a qubit in superposition?',
          options: [
            '|0⟩ + |1⟩',
            'α|0⟩ + β|1⟩ where |α|² + |β|² = 1',
            '|0⟩ × |1⟩',
            '0.5 × (|0⟩ + |1⟩)',
          ],
          correctIndex: 1,
          explanation: 'A qubit in superposition is represented as α|0⟩ + β|1⟩, where α and β are complex amplitudes that must satisfy the normalization condition |α|² + |β|² = 1.',
        },
        {
          question: 'What happens when you measure a qubit in superposition?',
          options: [
            'It remains in superposition',
            'It collapses to |0⟩ or |1⟩ with probabilities |α|² and |β|²',
            'It always becomes |0⟩',
            'It disappears',
          ],
          correctIndex: 1,
          explanation: 'Measurement causes the quantum state to collapse to one of the basis states, with probabilities determined by the squared magnitudes of the amplitudes.',
        },
        {
          question: 'Which gate creates superposition from the |0⟩ state?',
          options: [
            'Pauli-X gate',
            'Pauli-Z gate',
            'Hadamard gate',
            'CNOT gate',
          ],
          correctIndex: 2,
          explanation: 'The Hadamard gate transforms |0⟩ into (|0⟩ + |1⟩)/√2, creating an equal superposition of both basis states.',
        },
      ],
    },
  },
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  const lesson = lessonContent[courseId]?.[lessonId]
  const { completeLesson, completedLessons } = useCourseStore()
  const [showCompletion, setShowCompletion] = useState(false)
  const isCompleted = completedLessons[courseId]?.includes(lessonId)

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Lesson not found</p>
      </div>
    )
  }

  const handleComplete = () => {
    completeLesson(courseId, lessonId)
    setShowCompletion(true)
    setTimeout(() => setShowCompletion(false), 2000)
  }

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      completeLesson(courseId, lessonId)
      setShowCompletion(true)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>

        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-lg text-sm ${
              lesson.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
              lesson.type === 'reading' ? 'bg-green-500/20 text-green-400' :
              lesson.type === 'quiz' ? 'bg-amber-500/20 text-amber-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {lesson.type}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" /> Completed
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
        </motion.div>

        {/* Lesson Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8"
        >
          {lesson.type === 'quiz' && lesson.quiz ? (
            <Quiz
              questions={lesson.quiz}
              onComplete={handleQuizComplete}
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <div
                className="lesson-content"
                dangerouslySetInnerHTML={{
                  __html: lesson.content
                    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-6 mb-3 text-quantum-accent">$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
                    .replace(/```([\s\S]*?)```/g, '<pre class="bg-white/5 p-4 rounded-xl my-4 font-mono text-quantum-accent overflow-x-auto">$1</pre>')
                    .replace(/^- (.+)$/gm, '<li class="text-white/70 ml-4">$1</li>')
                    .replace(/^\d+\. (.+)$/gm, '<li class="text-white/70 ml-4">$1</li>')
                    .replace(/\n\n/g, '</p><p class="text-white/70 leading-relaxed my-4">')
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Actions */}
        {lesson.type !== 'quiz' && (
          <div className="flex justify-between items-center mt-8">
            {lesson.type === 'lab' && (
              <Link href="/lab">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 glass-panel rounded-xl font-semibold flex items-center gap-2"
                >
                  <Beaker className="w-5 h-5" /> Open Lab
                </motion.button>
              </Link>
            )}

            <div className="flex items-center gap-4 ml-auto">
              {!isCompleted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="px-6 py-3 bg-green-500 rounded-xl font-semibold text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Mark Complete
                </motion.button>
              )}

              {lesson.nextLesson && (
                <Link href={`/courses/${courseId}/${lesson.nextLesson}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white flex items-center gap-2"
                  >
                    Next Lesson <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Completion Toast */}
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 px-6 py-4 bg-green-500 rounded-xl text-white font-semibold flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" /> Lesson Completed!
          </motion.div>
        )}
      </div>
    </div>
  )
}
