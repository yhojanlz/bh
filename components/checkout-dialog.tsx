'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { cartTotal, cartCount, clearCart, paymentMethods } = useStore()
  const [methodId, setMethodId] = useState<string | null>(null)
  const [reference, setReference] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const activeMethods = paymentMethods.filter((m) => m.active)
  const selected = activeMethods.find((m) => m.id === methodId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!methodId || !reference.trim()) return
    setSubmitted(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    setMethodId(null)
    setReference('')
    setSubmitted(false)
  }

  const handleConfirm = () => {
    clearCart()
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif font-normal">Finalizar compra</DialogTitle>
          <DialogDescription>
            {cartCount} artículo{cartCount === 1 ? '' : 's'} · Total:{' '}
            <span className="font-medium text-foreground">{formatPrice(cartTotal)}</span>
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pago registrado</CardTitle>
                <CardDescription>
                  Hemos registrado tu referencia. Un administrador confirmará tu pago en breve.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método</span>
                  <span className="font-medium">{selected?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Referencia</span>
                  <span className="font-medium">{reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleConfirm} className="rounded-none uppercase tracking-[0.2em]">
              Aceptar
            </Button>
          </div>
        ) : activeMethods.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No hay métodos de pago disponibles. Contacta a la tienda para finalizar tu compra.
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Método de pago</Label>
              <div className="grid gap-2">
                {activeMethods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethodId(m.id)}
                    className={`flex flex-col gap-0.5 rounded-lg border p-3 text-left transition-colors ${
                      methodId === m.id
                        ? 'border-foreground bg-muted'
                        : 'border-border hover:border-foreground'
                    }`}
                    aria-pressed={methodId === m.id}
                  >
                    <span className="text-sm font-medium">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {selected && (
              <Card className="bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-sm">Datos para transferir</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{selected.accountLabel}</span>
                    <span className="font-medium">{selected.accountValue}</span>
                  </div>
                  {selected.extraLabel && selected.extraValue && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{selected.extraLabel}</span>
                      <span className="font-medium">{selected.extraValue}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 border-t border-border pt-2">
                    <span className="text-muted-foreground">Monto</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="reference">Número de referencia / comprobante</Label>
              <Input
                id="reference"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ej: 0012345678901"
              />
              <p className="text-xs text-muted-foreground">
                Ingresa el número de referencia de tu transferencia.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!methodId || !reference.trim()}>
                Registrar pago
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
