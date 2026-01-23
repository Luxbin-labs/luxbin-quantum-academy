'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Atom, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/courses', label: 'Courses' },
  { href: '/lab', label: 'Virtual Lab' },
  { href: '/certificates', label: 'Certificates' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="h-full max-w-[1800px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#455DEC] to-[#00D4FF] flex items-center justify-center">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white leading-tight">LUXBIN</span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Quantum Academy</span>
          </div>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={clsx(
                    'nav-link relative',
                    isActive && 'active'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#455DEC]"
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-sm py-2"
            >
              Dashboard
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
