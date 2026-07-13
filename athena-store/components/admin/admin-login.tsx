'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ADMIN_CREDENTIALS, useStore } from '@/lib/store'

export function AdminLogin() {
  const { login } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = login(email, password)
    if (!ok) setError('Correo o contraseña incorrectos.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <p className="font-serif text-lg tracking-[0.25em]">ATHENEA</p>
          <CardTitle className="font-serif text-2xl font-normal">Panel de administración</CardTitle>
          <CardDescription>Inicia sesión para gestionar tu tienda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ADMIN_CREDENTIALS.email}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="rounded-none uppercase tracking-[0.2em]">
              Entrar
            </Button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Demo: {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}
            </p>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/">
                <ArrowLeft className="size-3.5" />
                Volver a la tienda
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
