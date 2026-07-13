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
import { formatPrice, useStore } from '@/lib/store'

type PaymentMethod = 'binance' | 'pago-movil' | 'zelle'

interface PaymentInfo {
  id: PaymentMethod
  label: string
  description: string
  accountLabel: string
  accountValue: string
  extra?: { label: string; value: string }
}

const PAYMENT_METHODS: PaymentInfo[] = [
  {
    id: 'binance',
    label: 'Binance',
    description: 'Transfiere USDT por red BNB Smart Chain (BEP20).',
    accountLabel: 'Binance ID',
    accountValue: '389123456',
    extra: { label: 'Red', value: 'BNB Smart Chain (BEP20)' },
  },
  {
    id: 'pago-movil',
    label: 'Pago Móvil',
    description: 'Pago móvil bancario venezolano (C2P).',
    accountLabel: 'Teléfono',
    accountValue: '0414-1234567',
    extra: { label: 'Banco / Cédula', value: 'Banesco / V-12.345.678' },
  },
  {
    id: 'zelle',
    label: 'Zelle',
    description: 'Envía el monto en USD a través de Zelle.',
    accountLabel: 'Correo Zelle',
    accountValue: 'athenea@zellepay.com',
  },
]

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { cartTotal, cartCount, clearCart } = useStore()
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [reference, setReference] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const selected = PAYMENT_METHODS.find((m) => m.id === method)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!method || !reference.trim()) return
    setSubmitted(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    setMethod(null)
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
                  Hemos registrado tu referencia. Un administrador confirmará tu pago shortly.
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
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Método de pago</Label>
              <div className="grid gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col gap-0.5 rounded-lg border p-3 text-left transition-colors ${
                      method === m.id
                        ? 'border-foreground bg-muted'
                        : 'border-border hover:border-foreground'
                    }`}
                    aria-pressed={method === m.id}
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
                  {selected.extra && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{selected.extra.label}</span>
                      <span className="font-medium">{selected.extra.value}</span>
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
              <Button type="submit" disabled={!method || !reference.trim()}>
                Registrar pago
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
