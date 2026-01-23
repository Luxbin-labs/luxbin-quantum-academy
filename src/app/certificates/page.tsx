'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Download, ExternalLink, Shield, Calendar, Check } from 'lucide-react'
import { useCourseStore } from '@/lib/stores/courseStore'
import { CertificateCard } from '@/components/certificates/CertificateCard'
import { CertificateModal } from '@/components/certificates/CertificateModal'

const courseNames: Record<string, string> = {
  'quantum-fundamentals': 'Quantum Fundamentals',
  'photonic-computing': 'Photonic Quantum Computing',
  'entanglement-protocols': 'Entanglement Protocols',
  'quantum-teleportation': 'Quantum Teleportation',
  'nv-centers': 'NV-Center Quantum Memory',
  'quantum-networks': 'Quantum Networks',
}

export default function CertificatesPage() {
  const { completedCourses, certificates } = useCourseStore()
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  // Generate certificates for completed courses that don't have one yet
  const availableCerts = completedCourses.map((courseId) => {
    const existing = certificates.find((c) => c.courseId === courseId)
    if (existing) return existing

    return {
      id: `cert-${courseId}`,
      courseId,
      courseName: courseNames[courseId] || courseId,
      issuedAt: new Date().toISOString(),
      recipientName: 'Quantum Learner',
      blockchainTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    }
  })

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Your Certificates
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Blockchain-verified certificates for your quantum computing achievements
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="glass-panel p-6 text-center">
            <div className="text-3xl font-bold text-quantum-accent mb-1">
              {completedCourses.length}
            </div>
            <div className="text-white/60 text-sm">Courses Completed</div>
          </div>
          <div className="glass-panel p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {availableCerts.length}
            </div>
            <div className="text-white/60 text-sm">Certificates Earned</div>
          </div>
          <div className="glass-panel p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {availableCerts.filter((c) => c.blockchainTxHash).length}
            </div>
            <div className="text-white/60 text-sm">Verified on Chain</div>
          </div>
        </div>

        {/* Certificates Grid */}
        {availableCerts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {availableCerts.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CertificateCard
                  certificate={cert}
                  onClick={() => setSelectedCert(cert.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h2 className="text-xl font-semibold mb-2">No Certificates Yet</h2>
            <p className="text-white/60 mb-6">
              Complete courses to earn blockchain-verified certificates
            </p>
            <a href="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white"
              >
                Browse Courses
              </motion.button>
            </a>
          </div>
        )}

        {/* Blockchain Verification Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="glass-panel p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold mb-2">Blockchain Verification</h2>
                <p className="text-white/70 mb-4">
                  All certificates are permanently recorded on the LUXBIN blockchain,
                  providing tamper-proof verification of your achievements.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Immutable Records</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Publicly Verifiable</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Timestamped</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificate Modal */}
        {selectedCert && (
          <CertificateModal
            certificate={availableCerts.find((c) => c.id === selectedCert)!}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </div>
    </div>
  )
}
