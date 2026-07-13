'use client'

import dynamic from 'next/dynamic'
import { useStore } from '@/lib/store'

const AdminDashboard = dynamic(
  () => import('@/components/admin/admin-dashboard').then((m) => m.AdminDashboard),
  { ssr: false },
)

const AdminLogin = dynamic(
  () => import('@/components/admin/admin-login').then((m) => m.AdminLogin),
  { ssr: false },
)

export default function AdminPage() {
  const { ready, isAdmin } = useStore()

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </main>
    )
  }

  return isAdmin ? <AdminDashboard /> : <AdminLogin />
}
