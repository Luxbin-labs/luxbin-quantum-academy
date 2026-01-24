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
  'introduction-to-luxbin': {
    '1': {
      title: 'What is LUXBIN?',
      type: 'video',
      content: `
# What is LUXBIN?

**LUXBIN** (Light-based Universal eXchange for Blockchain Interconnected Networks) is a revolutionary protocol designed to enable quantum-secure communication and computing through photonic quantum technologies.

## The Quantum Physics Foundation

At its core, LUXBIN leverages fundamental quantum mechanical phenomena:

### Superposition
A photon can exist in multiple states simultaneously. In LUXBIN, we encode information in the polarization of light:

\`\`\`
|ψ⟩ = α|H⟩ + β|V⟩
\`\`\`

Where |H⟩ is horizontal polarization and |V⟩ is vertical. The photon is in BOTH states until measured!

### Entanglement
Two photons can be "entangled" - correlated in ways impossible classically. Measuring one instantly affects the other, regardless of distance. Einstein called this "spooky action at a distance."

\`\`\`
|Φ+⟩ = (|HH⟩ + |VV⟩)/√2
\`\`\`

This entangled state means: if Alice measures Horizontal, Bob ALWAYS measures Horizontal too.

### No-Cloning Theorem
Quantum states cannot be copied - attempting to copy destroys the original information. This is the foundation of quantum security!

## Why Light for Quantum Computing?

Photons are nature's ideal quantum information carriers:

1. **Speed**: Travel at 300,000 km/s
2. **Coherence**: Maintain quantum states over 100+ km in fiber
3. **Low Noise**: Minimal interaction with environment
4. **Room Temperature**: No cryogenic cooling needed
5. **Existing Infrastructure**: Compatible with optical fiber networks

## The LUXBIN Ecosystem

\`\`\`
┌─────────────────────────────────────────┐
│           LUXBIN Protocol Stack          │
├─────────────────────────────────────────┤
│  Applications (Academy, Wallets, dApps) │
├─────────────────────────────────────────┤
│     EIP Protocols (001, 002, 003, 004)  │
├─────────────────────────────────────────┤
│        Light Language Encoding          │
├─────────────────────────────────────────┤
│     Photonic Hardware Interface         │
└─────────────────────────────────────────┘
\`\`\`

## LUXBIN vs Classical Computing

| Feature | Classical | LUXBIN Quantum |
|---------|-----------|----------------|
| Information Unit | Bit (0 or 1) | Qubit (superposition) |
| Parallelism | Sequential | Exponential |
| Security | Mathematical | Physical Laws |
| Copying | Unlimited | Impossible |
      `,
      nextLesson: '2',
    },
    '2': {
      title: 'The Vision of Quantum Internet',
      type: 'reading',
      content: `
# The LUXBIN Quantum Internet

The **LUXBIN Internet** is a next-generation network that transmits quantum information using entangled photons, enabling fundamentally new capabilities impossible with classical networks.

## How Classical Internet Works (and Its Limits)

Your current internet works by:
1. Converting data to electrical/optical signals (bits: 0s and 1s)
2. Copying and amplifying signals at each router
3. Using mathematical encryption (like RSA) for security

**The Problem**: Quantum computers will break current encryption. A sufficiently powerful quantum computer could factor the large numbers that secure your bank transactions.

## How LUXBIN Internet Works

Instead of classical bits, LUXBIN transmits **quantum states of light**:

### Step 1: Entanglement Distribution
LUXBIN nodes continuously generate and share entangled photon pairs:

\`\`\`
Alice's Node ←──[Entangled Photons]──→ Bob's Node
     |Φ+⟩ = (|00⟩ + |11⟩)/√2
\`\`\`

### Step 2: Quantum Teleportation
To send quantum information, we use pre-shared entanglement:

\`\`\`
1. Alice has qubit |ψ⟩ to send
2. Alice performs Bell measurement on |ψ⟩ and her entangled photon
3. Alice sends 2 classical bits to Bob
4. Bob applies correction → receives |ψ⟩ perfectly!
\`\`\`

The quantum state is DESTROYED at Alice and RECREATED at Bob. No copying occurred!

### Step 3: Quantum Repeaters
For long distances, LUXBIN uses quantum repeaters based on:
- **NV-Centers**: Diamond defects that store quantum states
- **Entanglement Swapping**: Connect distant nodes via intermediate Bell measurements

## Why It's Unhackable

### The Eavesdropping Problem
If Eve tries to intercept:

\`\`\`
Alice ──[Photon]──> Eve ──[Photon]──> Bob
              ↓
         Eve measures
         (disturbs state!)
\`\`\`

Quantum mechanics GUARANTEES that measurement disturbs the state. Alice and Bob can detect Eve's presence!

### Quantum Key Distribution (QKD)
LUXBIN uses BB84 protocol:
1. Alice sends photons in random polarization bases
2. Bob measures in random bases
3. They compare bases publicly
4. Matching bases → shared secret key
5. Any eavesdropping → detectable errors

## LUXBIN Network Architecture

\`\`\`
┌─────────────────────────────────────────────────┐
│                 LUXBIN Internet                  │
├─────────────────────────────────────────────────┤
│   [Node A]←──Entanglement──→[Node B]           │
│      ↑                          ↑               │
│      └────Entanglement──────────┘               │
│              [Node C]                           │
│                 ↓                               │
│         [Quantum Repeater]                      │
│                 ↓                               │
│              [Node D]                           │
└─────────────────────────────────────────────────┘
\`\`\`

## Timeline

1. **Now (2024-2025)**: Point-to-point QKD, Education
2. **Near-term (2026-2028)**: Metropolitan quantum networks
3. **Medium-term (2029-2032)**: Quantum repeater deployment
4. **Long-term (2033+)**: Global quantum internet
      `,
      nextLesson: '3',
    },
    '3': {
      title: 'LUXBIN Light Language Protocol',
      type: 'video',
      content: `
# LUXBIN Light Language Protocol

The **Light Language** is LUXBIN's method for encoding quantum information into photonic states.

## Wavelength Spectrum

LUXBIN operates in the visible spectrum (400-700nm) with specific wavelengths assigned to different information types:

\`\`\`
Wavelength    Color      Purpose
──────────────────────────────────
400-450nm    Violet     Control signals
450-490nm    Blue       Quantum data
490-520nm    Cyan       Entanglement
520-565nm    Green      Classical sync
565-590nm    Yellow     Error correction
590-625nm    Orange     Authentication
625-700nm    Red        Measurement
\`\`\`

## Encoding Schemes

### Polarization Encoding
Quantum information is encoded in the polarization state of photons:

- **|H⟩** = Horizontal = |0⟩
- **|V⟩** = Vertical = |1⟩
- **|D⟩** = Diagonal = (|0⟩ + |1⟩)/√2
- **|A⟩** = Anti-diagonal = (|0⟩ - |1⟩)/√2

### Time-Bin Encoding
For long-distance transmission:

- **Early** time slot = |0⟩
- **Late** time slot = |1⟩
- Superposition of both = |+⟩

## Protocol Layers

### Physical Layer
Raw photon generation and detection using:
- Single-photon sources
- Parametric down-conversion
- NV-center emission

### Link Layer
Point-to-point quantum communication:
- Quantum error correction
- Entanglement distillation
- State verification

### Network Layer
Multi-node quantum routing:
- Entanglement swapping
- Quantum repeaters
- Bell state measurements

## Interoperability

LUXBIN Light Language is designed to work with existing quantum hardware from:
- IBM Quantum
- IonQ
- Quandela
- Amazon Braket
      `,
      nextLesson: '4',
    },
    '4': {
      title: 'Understanding EIP Protocols',
      type: 'reading',
      content: `
# Understanding EIP Protocols

**EIP (Entanglement Interface Protocol)** defines standardized methods for quantum operations in the LUXBIN network.

## EIP-001: NV-Center Quantum Memory

**Purpose**: Store quantum states in diamond nitrogen-vacancy centers

### Key Features
- Room temperature operation
- Long coherence times (milliseconds to seconds)
- Optical interface for photonic qubits
- Nuclear spin for extended storage

### Operations
1. **Initialize**: Optical pumping to |0⟩ state
2. **Manipulate**: Microwave pulses for gates
3. **Readout**: Fluorescence measurement
4. **Transfer**: Optical coupling to photon

---

## EIP-002: Bell Pair Generation

**Purpose**: Create maximally entangled photon pairs

### The Bell States
\`\`\`
|Φ+⟩ = (|00⟩ + |11⟩)/√2   "Both same"
|Φ-⟩ = (|00⟩ - |11⟩)/√2   "Both same, phase"
|Ψ+⟩ = (|01⟩ + |10⟩)/√2   "Both different"
|Ψ-⟩ = (|01⟩ - |10⟩)/√2   "Both different, phase"
\`\`\`

### Generation Method
Spontaneous Parametric Down-Conversion (SPDC) in BBO crystals

---

## EIP-003: GHZ State Networks

**Purpose**: Multi-party entanglement distribution

### The GHZ State
\`\`\`
|GHZ⟩ = (|000...0⟩ + |111...1⟩)/√2
\`\`\`

### Applications
- Multi-party secret sharing
- Quantum voting protocols
- Distributed sensing

---

## EIP-004: Quantum Teleportation

**Purpose**: Transfer quantum states between nodes

### The Protocol
1. Share entangled Bell pair
2. Bell measurement at sender
3. Classical communication of results
4. Correction at receiver

### Key Property
The original quantum state is destroyed at the sender and recreated at the receiver - information is **teleported**, not copied.
      `,
      nextLesson: '5',
    },
    '5': {
      title: 'LUXBIN Architecture & Components',
      type: 'video',
      content: `
# LUXBIN Architecture & Blockchain Integration

The LUXBIN system combines photonic quantum hardware with blockchain technology to create a trustless, quantum-secure ecosystem.

## The Quantum-Blockchain Synergy

### Why Blockchain + Quantum?

**Problem 1**: Quantum computers will break classical encryption
**Solution**: Quantum Key Distribution (QKD) provides physics-based security

**Problem 2**: How do we verify quantum operations occurred correctly?
**Solution**: Blockchain provides immutable, timestamped records

**Problem 3**: How do we trust remote quantum computers?
**Solution**: Cryptographic proofs on-chain + quantum verification

## Hardware Layer

### Photonic Qubits
Light-based quantum processing:

\`\`\`
Photon Source → Beam Splitter → Phase Shifter → Detector
     |              |               |              |
  Creates      Superposition    Rotation      Measurement
   |0⟩+|1⟩     (H gate)        (Rz gate)       Result
\`\`\`

### Quantum Gates with Light
| Gate | Optical Implementation |
|------|----------------------|
| Hadamard (H) | 50:50 Beam Splitter |
| Phase (S) | Glass plate (delays) |
| CNOT | Nonlinear crystal |
| Measurement | Single-photon detector |

### The NV-Center Memory
Diamond defects for quantum storage:
- Electron spin = fast qubit
- Nuclear spin = long-term memory
- Optical interface = photon coupling

## Blockchain Integration

### The LUXBIN Chain

Built on Substrate (Polkadot ecosystem):

\`\`\`
┌─────────────────────────────────────────┐
│            LUXBIN Blockchain             │
├─────────────────────────────────────────┤
│  [Quantum Oracle]  ←→  [Smart Contracts]│
│         ↑                     ↓          │
│  [QKD Key Escrow]     [Certificate NFTs]│
│         ↑                     ↓          │
│  [Entanglement Log]   [Credential Store]│
└─────────────────────────────────────────┘
\`\`\`

### On-Chain Quantum Proofs

Every quantum operation can be verified:

1. **Entanglement Generation**: Bell test results stored on-chain
2. **Teleportation**: Classical bits + outcome recorded
3. **QKD Sessions**: Key fingerprints (not keys!) timestamped
4. **State Preparation**: Tomography results for verification

### Quantum-Secured Transactions

\`\`\`
Traditional: Sign with private key (breakable by quantum)
LUXBIN: Sign with QKD-distributed one-time pad (unbreakable)
\`\`\`

### Certificate System

Your learning achievements are:
1. Hashed and stored on LUXBIN Chain
2. Minted as Soulbound NFTs (non-transferable)
3. Verifiable by anyone, forever
4. Portable across Web3 platforms

## The Complete Stack

\`\`\`
┌─────────────────────────────────────────┐
│     Applications (Academy, Wallets)     │
├─────────────────────────────────────────┤
│         LUXBIN Smart Contracts          │
├─────────────────────────────────────────┤
│      Substrate Blockchain Runtime       │
├─────────────────────────────────────────┤
│         EIP Protocol Layer              │
├─────────────────────────────────────────┤
│        Light Language Encoding          │
├─────────────────────────────────────────┤
│     Photonic Hardware Interface         │
├─────────────────────────────────────────┤
│  Physical: NV-Centers, Photon Sources   │
└─────────────────────────────────────────┘
\`\`\`

## Why This Matters

**Today**: You're learning quantum computing
**Tomorrow**: Your certificate is on-chain, quantum-verified
**Future**: You'll use LUXBIN to send unhackable messages, execute quantum smart contracts, and participate in a truly decentralized quantum internet
      `,
      nextLesson: '6',
    },
    '6': {
      title: 'Final Quiz: LUXBIN Fundamentals',
      type: 'quiz',
      content: 'Test your understanding of LUXBIN and its protocols!',
      quiz: [
        {
          question: 'What does LUXBIN stand for?',
          options: [
            'Light Universal eXchange Binary Network',
            'Light-based Universal eXchange for Blockchain Interconnected Networks',
            'Linked Unified eXtended Binary Integration Network',
            'Low-latency Universal eXchange for Blockchain Networks',
          ],
          correctIndex: 1,
          explanation: 'LUXBIN stands for Light-based Universal eXchange for Blockchain Interconnected Networks, emphasizing its focus on photonic quantum technology and blockchain integration.',
        },
        {
          question: 'Which EIP protocol handles quantum teleportation?',
          options: [
            'EIP-001',
            'EIP-002',
            'EIP-003',
            'EIP-004',
          ],
          correctIndex: 3,
          explanation: 'EIP-004 defines the Quantum Teleportation protocol for transferring quantum states between nodes using shared entanglement and classical communication.',
        },
        {
          question: 'What is the primary advantage of using photons for quantum computing?',
          options: [
            'They are heavier than electrons',
            'They interact strongly with the environment',
            'They maintain quantum coherence over long distances',
            'They require cryogenic cooling',
          ],
          correctIndex: 2,
          explanation: 'Photons interact weakly with the environment, allowing them to maintain quantum coherence over long distances, making them ideal for quantum communication.',
        },
        {
          question: 'What does EIP-002 specify?',
          options: [
            'Quantum Memory Protocol',
            'Bell Pair Generation',
            'GHZ State Networks',
            'Quantum Teleportation',
          ],
          correctIndex: 1,
          explanation: 'EIP-002 specifies the Bell Pair Generation protocol for creating maximally entangled photon pairs using SPDC in BBO crystals.',
        },
        {
          question: 'In the LUXBIN Light Language, what color range is used for quantum data?',
          options: [
            'Red (625-700nm)',
            'Green (520-565nm)',
            'Blue (450-490nm)',
            'Violet (400-450nm)',
          ],
          correctIndex: 2,
          explanation: 'In the LUXBIN Light Language protocol, the blue wavelength range (450-490nm) is designated for quantum data transmission.',
        },
      ],
    },
  },
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
