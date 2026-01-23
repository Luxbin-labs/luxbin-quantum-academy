import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LUXBIN Quantum Academy',
  description: 'Learn photonic quantum computing through interactive experiments with quantum dots and photons',
  keywords: ['quantum computing', 'photonics', 'education', 'quantum dots', 'LUXBIN', 'certificates'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-quantum-darker`}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
