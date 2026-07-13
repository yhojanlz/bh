'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore, type PaymentMethod } from '@/lib/store'

interface PaymentFormProps {
  method?: PaymentMethod
  onDone: () => void
}

export function PaymentForm({ method, onDone }: PaymentFormProps) {
  const { addPaymentMethod, updatePaymentMethod } = useStore()
  const [label, setLabel] = useState(method?.label ?? '')
  const [description, setDescription] = useState(method?.description ?? '')
  const [accountLabel, setAccountLabel] = useState(method?.accountLabel ?? '')
  const [accountValue, setAccountValue] = useState(method?.accountValue ?? '')
  const [extraLabel, setExtraLabel] = useState(method?.extraLabel ?? '')
  const [extraValue, setExtraValue] = useState(method?.extraValue ?? '')
  const [active, setActive] = useState(method?.active ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      label: label.trim(),
      description: description.trim(),
      accountLabel: accountLabel.trim(),
      accountValue: accountValue.trim(),
      extraLabel: extraLabel.trim() || undefined,
      extraValue: extraValue.trim() || undefined,
      active,
    }
    if (method) {
      updatePaymentMethod(method.id, data)
    } else {
      addPaymentMethod(data)
    }
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="pm-label">Nombre</Label>
        <Input
          id="pm-label"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ej: Binance, Pago Móvil, Zelle"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pm-desc">Descripción</Label>
        <Input
          id="pm-desc"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Transfiere USDT por red BNB Smart Chain (BEP20)."
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-account-label">Etiqueta de la cuenta</Label>
          <Input
            id="pm-account-label"
            required
            value={accountLabel}
            onChange={(e) => setAccountLabel(e.target.value)}
            placeholder="Ej: Binance ID, Teléfono, Correo Zelle"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-account-value">Valor de la cuenta</Label>
          <Input
            id="pm-account-value"
            required
            value={accountValue}
            onChange={(e) => setAccountValue(e.target.value)}
            placeholder="Ej: 389123456"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-extra-label">Etiqueta adicional (opcional)</Label>
          <Input
            id="pm-extra-label"
            value={extraLabel}
            onChange={(e) => setExtraLabel(e.target.value)}
            placeholder="Ej: Red, Banco / Cédula"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="pm-extra-value">Valor adicional (opcional)</Label>
          <Input
            id="pm-extra-value"
            value={extraValue}
            onChange={(e) => setExtraValue(e.target.value)}
            placeholder="Ej: BNB Smart Chain (BEP20)"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="size-4 rounded border-border"
        />
        Activo (visible para los clientes)
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit">{method ? 'Guardar cambios' : 'Crear método'}</Button>
      </div>
    </form>
  )
}
