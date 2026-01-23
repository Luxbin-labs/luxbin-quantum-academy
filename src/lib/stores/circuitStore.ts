import { create } from 'zustand'

export type GateType =
  | 'H' | 'X' | 'Y' | 'Z'  // Pauli gates
  | 'T' | 'S'              // Phase gates
  | 'Rx' | 'Ry' | 'Rz'     // Rotation gates
  | 'CNOT' | 'CZ' | 'SWAP' // Multi-qubit gates
  | 'M'                     // Measurement
  | 'BS' | 'PS'            // Photonic gates (Beam Splitter, Phase Shifter)

export interface Gate {
  id: string
  type: GateType
  qubit: number
  time: number
  controlQubit?: number  // For CNOT, CZ
  params?: {
    angle?: number
  }
}

export interface Circuit {
  gates: Gate[]
  numQubits: number
}

export interface SimulationResult {
  counts: Record<string, number>
  probabilities: Record<string, number>
  stateVector: string
  totalShots: number
}

interface CircuitStore {
  circuit: Circuit
  numQubits: number
  simulationResults: SimulationResult | null
  isSimulating: boolean

  addGate: (gate: Omit<Gate, 'id'>) => void
  removeGate: (gateId: string) => void
  resetCircuit: () => void
  setNumQubits: (n: number) => void
  runSimulation: () => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

// Simple quantum simulation (educational purposes)
const simulateCircuit = (circuit: Circuit): SimulationResult => {
  const numQubits = circuit.numQubits
  const numStates = Math.pow(2, numQubits)

  // Initialize state vector |00...0⟩
  let stateReal = new Array(numStates).fill(0)
  let stateImag = new Array(numStates).fill(0)
  stateReal[0] = 1 // |00...0⟩

  // Sort gates by time
  const sortedGates = [...circuit.gates].sort((a, b) => a.time - b.time)

  // Apply gates
  for (const gate of sortedGates) {
    const q = gate.qubit

    switch (gate.type) {
      case 'H': {
        // Hadamard: |0⟩ → (|0⟩ + |1⟩)/√2, |1⟩ → (|0⟩ - |1⟩)/√2
        const factor = 1 / Math.sqrt(2)
        const newReal = [...stateReal]
        const newImag = [...stateImag]

        for (let i = 0; i < numStates; i++) {
          const bit = (i >> q) & 1
          const partner = bit ? i - (1 << q) : i + (1 << q)

          if (bit === 0) {
            newReal[i] = factor * (stateReal[i] + stateReal[partner])
            newImag[i] = factor * (stateImag[i] + stateImag[partner])
          } else {
            newReal[i] = factor * (stateReal[partner] - stateReal[i])
            newImag[i] = factor * (stateImag[partner] - stateImag[i])
          }
        }
        stateReal = newReal
        stateImag = newImag
        break
      }

      case 'X': {
        // Pauli-X: |0⟩ ↔ |1⟩
        const newReal = [...stateReal]
        const newImag = [...stateImag]

        for (let i = 0; i < numStates; i++) {
          const partner = i ^ (1 << q)
          if (i < partner) {
            [newReal[i], newReal[partner]] = [stateReal[partner], stateReal[i]]
            ;[newImag[i], newImag[partner]] = [stateImag[partner], stateImag[i]]
          }
        }
        stateReal = newReal
        stateImag = newImag
        break
      }

      case 'Z': {
        // Pauli-Z: |0⟩ → |0⟩, |1⟩ → -|1⟩
        for (let i = 0; i < numStates; i++) {
          if ((i >> q) & 1) {
            stateReal[i] = -stateReal[i]
            stateImag[i] = -stateImag[i]
          }
        }
        break
      }

      case 'CNOT': {
        // CNOT with control at qubit above
        const control = Math.max(0, q - 1)
        const target = q
        const newReal = [...stateReal]
        const newImag = [...stateImag]

        for (let i = 0; i < numStates; i++) {
          if ((i >> control) & 1) {
            const partner = i ^ (1 << target)
            if (i < partner) {
              [newReal[i], newReal[partner]] = [stateReal[partner], stateReal[i]]
              ;[newImag[i], newImag[partner]] = [stateImag[partner], stateImag[i]]
            }
          }
        }
        stateReal = newReal
        stateImag = newImag
        break
      }

      // Add more gates as needed...
    }
  }

  // Calculate probabilities
  const probabilities: Record<string, number> = {}
  for (let i = 0; i < numStates; i++) {
    const prob = stateReal[i] * stateReal[i] + stateImag[i] * stateImag[i]
    if (prob > 1e-10) {
      const stateStr = i.toString(2).padStart(numQubits, '0')
      probabilities[stateStr] = prob
    }
  }

  // Simulate measurement (1024 shots)
  const totalShots = 1024
  const counts: Record<string, number> = {}

  for (let shot = 0; shot < totalShots; shot++) {
    let rand = Math.random()
    for (const [state, prob] of Object.entries(probabilities)) {
      rand -= prob
      if (rand <= 0) {
        counts[state] = (counts[state] || 0) + 1
        break
      }
    }
  }

  // Format state vector for display
  const stateTerms: string[] = []
  for (let i = 0; i < numStates; i++) {
    const prob = stateReal[i] * stateReal[i] + stateImag[i] * stateImag[i]
    if (prob > 1e-10) {
      const stateStr = i.toString(2).padStart(numQubits, '0')
      const amplitude = stateReal[i].toFixed(3)
      stateTerms.push(`${amplitude}|${stateStr}⟩`)
    }
  }

  return {
    counts,
    probabilities,
    stateVector: stateTerms.join(' + ') || '|00⟩',
    totalShots,
  }
}

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  circuit: { gates: [], numQubits: 4 },
  numQubits: 4,
  simulationResults: null,
  isSimulating: false,

  addGate: (gate) => {
    const newGate: Gate = { ...gate, id: generateId() }
    set((state) => ({
      circuit: {
        ...state.circuit,
        gates: [...state.circuit.gates, newGate],
      },
    }))
  },

  removeGate: (gateId) => {
    set((state) => ({
      circuit: {
        ...state.circuit,
        gates: state.circuit.gates.filter((g) => g.id !== gateId),
      },
    }))
  },

  resetCircuit: () => {
    set({
      circuit: { gates: [], numQubits: get().numQubits },
      simulationResults: null,
    })
  },

  setNumQubits: (n) => {
    set({
      numQubits: n,
      circuit: { gates: [], numQubits: n },
      simulationResults: null,
    })
  },

  runSimulation: () => {
    set({ isSimulating: true })

    // Simulate with a small delay for UX
    setTimeout(() => {
      const results = simulateCircuit(get().circuit)
      set({ simulationResults: results, isSimulating: false })
    }, 500)
  },
}))
