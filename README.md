<div align="center">

# 🔮 LUXBIN Quantum Academy

**An interactive educational platform for learning photonic quantum computing**

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-luxbin--quantum--academy.vercel.app-00d4ff?style=for-the-badge&labelColor=000000)](https://luxbin-quantum-academy.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-nichechristie-181717?style=for-the-badge&logo=github)](https://github.com/nichechristie/luxbin-quantum-academy)

**[👉 Launch the Academy →](https://luxbin-quantum-academy.vercel.app)**

*Inspired by Quandela's Learning Hub*

</div>

---

## Features

### Virtual Quantum Lab
- **Circuit Composer**: Drag-and-drop quantum circuit builder with real-time simulation
- **Photon Simulator**: Visualize wave-particle duality, interference patterns, and entanglement
- **Bell Pair Generator**: Create and measure entangled photon pairs (EIP-002 protocol)
- **Teleportation Lab**: Quantum state teleportation experiments (EIP-004 protocol)

### Interactive Courses
- **Quantum Fundamentals**: Superposition, measurement, qubits
- **Photonic Computing**: Light as information, LUXBIN encoding
- **Entanglement Protocols**: Bell pairs, GHZ states
- **Advanced Topics**: Teleportation, NV-centers, quantum networks

### Certificates
- Blockchain-verified certificates on LUXBIN chain
- Progress tracking and achievements
- PDF export for credentials

### Dashboard
- Personal learning progress
- Weekly goals and streaks
- Recent activity feed
- Quick access to labs and courses

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: Zustand
- **Icons**: Lucide React

## Getting Started

```bash
# Navigate to the project
cd luxbin-quantum-academy

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── dashboard/            # User dashboard
│   ├── courses/              # Course catalog & lessons
│   ├── lab/                  # Virtual quantum lab
│   │   ├── circuit-composer/ # Circuit builder
│   │   ├── photon-simulator/ # Photon visualization
│   │   └── experiments/      # Bell pairs, teleportation
│   └── certificates/         # Certificate gallery
├── components/
│   ├── layout/               # Navigation, layout
│   ├── lab/                  # Lab components
│   ├── courses/              # Quiz, lesson components
│   ├── certificates/         # Certificate display
│   └── effects/              # Visual effects
└── lib/
    └── stores/               # Zustand state stores
```

## Based On

This platform builds upon the quantum computing work in:
- [Luxbin-Quantum-internet](https://github.com/nichechristie/Luxbin-Quantum-internet) - EIP protocols & quantum operations
- [luxbin-light-language](https://github.com/mermaidnicheboutique-code/Luxbin-light-language) - Photonic encoding
- [luxbin-chain](https://github.com/mermaidnicheboutique-code/luxbin-chain) - Blockchain verification

## License

MIT
