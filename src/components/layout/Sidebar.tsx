'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  Cpu,
  Zap,
  GitBranch,
  Radio,
  Atom,
  FlaskConical,
  BookOpen,
  Award,
  LayoutDashboard,
  Settings
} from 'lucide-react'

const labLinks = [
  { href: '/lab', label: 'Overview', icon: FlaskConical, exact: true },
  { href: '/lab/circuit-composer', label: 'Circuit Composer', icon: Cpu },
  { href: '/lab/photon-simulator', label: 'Photon Simulator', icon: Zap },
]

const experiments = [
  { href: '/lab/experiments/bell-pairs', label: 'Bell Pairs', icon: GitBranch },
  { href: '/lab/experiments/teleportation', label: 'Teleportation', icon: Radio },
  { href: '/lab/experiments/ghz-states', label: 'GHZ States', icon: GitBranch },
  { href: '/lab/experiments/nv-center', label: 'NV-Center', icon: Atom },
]

const otherLinks = [
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/certificates', label: 'Certificates', icon: Award },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <aside className="sidebar">
      <div className="py-4">
        {/* Lab Tools */}
        <div className="sidebar-section">Virtual Lab</div>
        {labLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className={clsx('sidebar-link', isActive(link.href, link.exact) && 'active')}>
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </div>
          </Link>
        ))}

        {/* Experiments */}
        <div className="sidebar-section mt-6">Experiments</div>
        {experiments.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className={clsx('sidebar-link', isActive(link.href) && 'active')}>
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </div>
          </Link>
        ))}

        {/* Divider */}
        <div className="my-6 mx-4 border-t border-white/10" />

        {/* Other Links */}
        <div className="sidebar-section">Learning</div>
        {otherLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className={clsx('sidebar-link', isActive(link.href) && 'active')}>
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}
