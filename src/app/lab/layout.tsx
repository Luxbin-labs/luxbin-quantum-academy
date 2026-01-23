import { Sidebar } from '@/components/layout/Sidebar'

export default function LabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
