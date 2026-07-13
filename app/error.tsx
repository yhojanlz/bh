'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-2xl">Algo salió mal</h1>
      <p className="text-sm text-muted-foreground">
        Ocurrió un error inesperado. Intenta de nuevo.
      </p>
      <Button onClick={reset} className="rounded-none uppercase tracking-[0.2em]">
        Reintentar
      </Button>
    </main>
  )
}
