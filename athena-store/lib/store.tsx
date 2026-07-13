'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Department = 'mujer' | 'hombre' | 'ninos'

export const DEPARTMENTS: { id: Department; label: string }[] = [
  { id: 'mujer', label: 'Mujer' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'ninos', label: 'Niños' },
]

export interface Category {
  id: string
  name: string
  department: Department
}

export interface Product {
  id: string
  name: string
  price: number
  categoryId: string
  image: string
  description: string
  sizes: string[]
}

export interface CartItem {
  productId: string
  size: string
  quantity: number
}

export interface PaymentMethod {
  id: string
  label: string
  description: string
  accountLabel: string
  accountValue: string
  extraLabel?: string
  extraValue?: string
  active: boolean
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'binance',
    label: 'Binance',
    description: 'Transfiere USDT por red BNB Smart Chain (BEP20).',
    accountLabel: 'Binance ID',
    accountValue: '389123456',
    extraLabel: 'Red',
    extraValue: 'BNB Smart Chain (BEP20)',
    active: true,
  },
  {
    id: 'pago-movil',
    label: 'Pago Móvil',
    description: 'Pago móvil bancario venezolano (C2P).',
    accountLabel: 'Teléfono',
    accountValue: '0414-1234567',
    extraLabel: 'Banco / Cédula',
    extraValue: 'Banesco / V-12.345.678',
    active: true,
  },
  {
    id: 'zelle',
    label: 'Zelle',
    description: 'Envía el monto en USD a través de Zelle.',
    accountLabel: 'Correo Zelle',
    accountValue: 'athenea@zellepay.com',
    active: true,
  },
]

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'vestidos', name: 'Vestidos', department: 'mujer' },
  { id: 'deportivo', name: 'Deportivo', department: 'mujer' },
  { id: 'corsets', name: 'Corsets', department: 'mujer' },
  { id: 'lenceria', name: 'Lencería', department: 'mujer' },
  { id: 'bikinis', name: 'Bikinis', department: 'mujer' },
  { id: 'camisas', name: 'Camisas', department: 'hombre' },
  { id: 'pantalones', name: 'Pantalones', department: 'hombre' },
  { id: 'deportivo-hombre', name: 'Deportivo', department: 'hombre' },
  { id: 'infantil', name: 'Infantil', department: 'ninos' },
]

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'vestido-marfil',
    name: 'Vestido Marfil',
    price: 45,
    categoryId: 'vestidos',
    image: '/images/vestido-marfil.png',
    description: 'Vestido largo de corte fluido en tono marfil, ideal para ocasiones especiales.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'vestido-noche',
    name: 'Vestido Noche',
    price: 38,
    categoryId: 'vestidos',
    image: '/images/vestido-noche.png',
    description: 'Vestido lencero negro de tirantes finos con caída elegante.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'conjunto-sage',
    name: 'Conjunto Sage',
    price: 30,
    categoryId: 'deportivo',
    image: '/images/conjunto-sage.png',
    description: 'Conjunto deportivo en verde salvia: top y leggings de alta compresión.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'chaqueta-onyx',
    name: 'Chaqueta Onyx',
    price: 22,
    categoryId: 'deportivo',
    image: '/images/chaqueta-onyx.png',
    description: 'Chaqueta deportiva negra entallada con cierre frontal.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'corset-negro',
    name: 'Corset Noir',
    price: 35,
    categoryId: 'corsets',
    image: '/images/corset-negro.png',
    description: 'Corset estructurado negro con silueta escultural.',
    sizes: ['XS', 'S', 'M'],
  },
  {
    id: 'conjunto-rosa',
    name: 'Conjunto Rosé',
    price: 28,
    categoryId: 'lenceria',
    image: '/images/conjunto-rosa.png',
    description: 'Conjunto de lencería en seda rosa con detalles de encaje.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'bikini-terracota',
    name: 'Bikini Terracota',
    price: 26,
    categoryId: 'bikinis',
    image: '/images/bikini-terracota.png',
    description: 'Bikini en tono terracota de tejido acanalado premium.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'camisa-lino',
    name: 'Camisa Lino',
    price: 32,
    categoryId: 'camisas',
    image: '/images/camisa-lino.png',
    description: 'Camisa de lino beige de corte relajado, fresca y atemporal.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'pantalon-sastre',
    name: 'Pantalón Sastre',
    price: 40,
    categoryId: 'pantalones',
    image: '/images/pantalon-sastre.png',
    description: 'Pantalón de sastrería gris carbón con caída impecable.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'conjunto-infantil',
    name: 'Conjunto Mini',
    price: 20,
    categoryId: 'infantil',
    image: '/images/conjunto-infantil.png',
    description: 'Conjunto infantil de punto crema con pantalón beige, suave y cómodo.',
    sizes: ['2', '4', '6', '8'],
  },
  {
    id: 'vestido-nina',
    name: 'Vestido Petit',
    price: 24,
    categoryId: 'infantil',
    image: '/images/vestido-nina.png',
    description: 'Vestido blanco de algodón con bordados delicados para niña.',
    sizes: ['2', '4', '6', '8'],
  },
]

const LS_KEYS = {
  products: 'athenea-products',
  categories: 'athenea-categories',
  cart: 'athenea-cart',
  session: 'athenea-admin-session',
  payments: 'athenea-payment-methods',
} as const

export const ADMIN_CREDENTIALS = {
  username: 'athenea123',
  password: 'athenea123',
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // ignore corrupted data
  }
  return fallback
}

interface StoreContextValue {
  ready: boolean
  products: Product[]
  categories: Category[]
  cart: CartItem[]
  // catalog (admin)
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, changes: Partial<Omit<Product, 'id'>>) => void
  deleteProduct: (id: string) => void
  addCategory: (name: string, department: Department) => void
  deleteCategory: (id: string) => void
  resetCatalog: () => void
  // payment methods (admin)
  paymentMethods: PaymentMethod[]
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  updatePaymentMethod: (id: string, changes: Partial<Omit<PaymentMethod, 'id'>>) => void
  deletePaymentMethod: (id: string) => void
  // cart
  addToCart: (productId: string, size: string) => void
  updateCartQuantity: (productId: string, size: string, quantity: number) => void
  removeFromCart: (productId: string, size: string) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  // admin session
  isAdmin: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS)
  const [isAdmin, setIsAdmin] = useState(false)

  // Cargar desde localStorage al montar
  useEffect(() => {
    setProducts(loadFromStorage(LS_KEYS.products, DEFAULT_PRODUCTS))
    setCategories(loadFromStorage(LS_KEYS.categories, DEFAULT_CATEGORIES))
    setCart(loadFromStorage(LS_KEYS.cart, []))
    setPaymentMethods(loadFromStorage(LS_KEYS.payments, DEFAULT_PAYMENT_METHODS))
    setIsAdmin(loadFromStorage(LS_KEYS.session, false))
    setReady(true)
  }, [])

  // Persistir cambios
  useEffect(() => {
    if (ready) window.localStorage.setItem(LS_KEYS.products, JSON.stringify(products))
  }, [products, ready])
  useEffect(() => {
    if (ready) window.localStorage.setItem(LS_KEYS.categories, JSON.stringify(categories))
  }, [categories, ready])
  useEffect(() => {
    if (ready) window.localStorage.setItem(LS_KEYS.cart, JSON.stringify(cart))
  }, [cart, ready])
  useEffect(() => {
    if (ready) window.localStorage.setItem(LS_KEYS.payments, JSON.stringify(paymentMethods))
  }, [paymentMethods, ready])
  useEffect(() => {
    if (ready) window.localStorage.setItem(LS_KEYS.session, JSON.stringify(isAdmin))
  }, [isAdmin, ready])

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const id = `p-${Date.now().toString(36)}`
    setProducts((prev) => [{ ...product, id }, ...prev])
  }, [])

  const updateProduct = useCallback((id: string, changes: Partial<Omit<Product, 'id'>>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setCart((prev) => prev.filter((item) => item.productId !== id))
  }, [])

  const addCategory = useCallback((name: string, department: Department) => {
    const id = `c-${Date.now().toString(36)}`
    setCategories((prev) => [...prev, { id, name: name.trim(), department }])
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setProducts((prev) => {
      const removedIds = prev.filter((p) => p.categoryId === id).map((p) => p.id)
      setCart((prevCart) => prevCart.filter((item) => !removedIds.includes(item.productId)))
      return prev.filter((p) => p.categoryId !== id)
    })
  }, [])

  const resetCatalog = useCallback(() => {
    setProducts(DEFAULT_PRODUCTS)
    setCategories(DEFAULT_CATEGORIES)
    setCart([])
  }, [])

  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, 'id'>) => {
    const id = `pm-${Date.now().toString(36)}`
    setPaymentMethods((prev) => [...prev, { ...method, id }])
  }, [])

  const updatePaymentMethod = useCallback((id: string, changes: Partial<Omit<PaymentMethod, 'id'>>) => {
    setPaymentMethods((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)))
  }, [])

  const deletePaymentMethod = useCallback((id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const addToCart = useCallback((productId: string, size: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.size === size)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.size === size ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { productId, size, quantity: 1 }]
    })
  }, [])

  const updateCartQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((i) => !(i.productId === productId && i.size === size))
      return prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i,
      )
    })
  }, [])

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const login = useCallback((username: string, password: string) => {
    const ok =
      username.trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
    if (ok) setIsAdmin(true)
    return ok
  }, [])

  const logout = useCallback(() => setIsAdmin(false), [])

  const cartCount = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart])

  const cartTotal = useMemo(
    () =>
      cart.reduce((acc, i) => {
        const product = products.find((p) => p.id === i.productId)
        return acc + (product ? product.price * i.quantity : 0)
      }, 0),
    [cart, products],
  )

  const value = useMemo<StoreContextValue>(
    () => ({
      ready,
      products,
      categories,
      cart,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      resetCatalog,
      paymentMethods,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      isAdmin,
      login,
      logout,
    }),
    [
      ready,
      products,
      categories,
      cart,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      resetCatalog,
      paymentMethods,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      isAdmin,
      login,
      logout,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}
