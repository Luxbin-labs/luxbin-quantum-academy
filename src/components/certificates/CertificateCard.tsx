'use client'

import { motion } from 'framer-motion'
import { Award, Calendar, ExternalLink, Shield } from 'lucide-react'

interface Certificate {
  id: string
  courseId: string
  courseName: string
  issuedAt: string
  recipientName: string
  blockchainTxHash?: string
}

interface Props {
  certificate: Certificate
  onClick: () => void
}

export function CertificateCard({ certificate, onClick }: Props) {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-panel overflow-hidden cursor-pointer group"
    >
      {/* Certificate Header */}
      <div className="h-32 bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 relative border-b border-white/10">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id={`pattern-${certificate.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill={`url(#pattern-${certificate.id})`} />
          </svg>
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <Award className="w-10 h-10 text-amber-400 mb-2" />
            <h3 className="font-semibold text-lg">Certificate of Completion</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
            <Shield className="w-3 h-3" />
            Verified
          </div>
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-6">
        <h4 className="text-xl font-bold mb-2 group-hover:text-quantum-accent transition-colors">
          {certificate.courseName}
        </h4>

        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <Calendar className="w-4 h-4" />
          <span>Issued {formattedDate}</span>
        </div>

        {certificate.blockchainTxHash && (
          <div className="p-3 rounded-lg bg-white/5 mb-4">
            <div className="text-xs text-white/40 mb-1">Blockchain TX</div>
            <div className="font-mono text-xs text-quantum-accent truncate">
              {certificate.blockchainTxHash}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Click to view certificate</span>
          <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        </div>
      </div>
    </motion.div>
  )
}
