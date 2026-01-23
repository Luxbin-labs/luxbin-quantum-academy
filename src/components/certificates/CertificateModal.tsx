'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink, Share2, Atom } from 'lucide-react'

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
  onClose: () => void
}

export function CertificateModal({ certificate, onClose }: Props) {
  const certRef = useRef<HTMLDivElement>(null)

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleDownload = async () => {
    // In production, this would generate a PDF
    alert('Certificate download functionality would generate a PDF in production')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Certificate: ${certificate.courseName}`,
        text: `I completed ${certificate.courseName} on LUXBIN Quantum Academy!`,
        url: window.location.href,
      })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Actions */}
          <div className="flex justify-end gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-3 glass-panel rounded-xl"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-3 glass-panel rounded-xl"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-3 glass-panel rounded-xl"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Certificate */}
          <div
            ref={certRef}
            className="relative bg-gradient-to-br from-[#1a1a3e] to-[#0f0f23] rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 0 60px rgba(99, 102, 241, 0.3), 0 0 100px rgba(6, 182, 212, 0.2)',
            }}
          >
            {/* Border gradient */}
            <div className="absolute inset-0 p-[2px] bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary rounded-2xl">
              <div className="w-full h-full bg-gradient-to-br from-[#1a1a3e] to-[#0f0f23] rounded-2xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-12 text-center">
              {/* Header decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary" />

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-quantum-primary to-quantum-accent p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#1a1a3e] flex items-center justify-center">
                    <Atom className="w-10 h-10 text-quantum-accent" />
                  </div>
                </div>
              </div>

              <h2 className="text-sm uppercase tracking-[0.3em] text-white/40 mb-2">
                LUXBIN Quantum Academy
              </h2>

              <h1 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Certificate of Completion
                </span>
              </h1>

              <p className="text-white/60 mb-4">This certifies that</p>

              <p className="text-2xl font-bold text-white mb-4">
                {certificate.recipientName}
              </p>

              <p className="text-white/60 mb-4">has successfully completed the course</p>

              <p className="text-xl font-semibold text-quantum-accent mb-8">
                {certificate.courseName}
              </p>

              {/* Details */}
              <div className="flex justify-center gap-12 text-sm text-white/60 mb-8">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Date Issued</div>
                  <div>{formattedDate}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Certificate ID</div>
                  <div className="font-mono">{certificate.id}</div>
                </div>
              </div>

              {/* Blockchain verification */}
              {certificate.blockchainTxHash && (
                <div className="p-4 rounded-xl bg-white/5 text-left max-w-lg mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      Blockchain Verification
                    </span>
                    <span className="flex items-center gap-1 text-green-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      Verified
                    </span>
                  </div>
                  <div className="font-mono text-xs text-quantum-accent break-all">
                    {certificate.blockchainTxHash}
                  </div>
                  <a
                    href={`https://explorer.luxbin.io/tx/${certificate.blockchainTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white mt-2"
                  >
                    View on LUXBIN Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Footer decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-quantum-primary via-quantum-accent to-quantum-secondary" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
