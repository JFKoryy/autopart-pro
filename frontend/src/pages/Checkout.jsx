import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatPrice } from "../utils/formatters"
import { checkout } from "../services/api"
import { CreditCard, Loader2, CheckCircle2, Lock } from "lucide-react"
import { createCheckoutSession } from "../services/api"

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState("")

  const shipping = items.length > 0 ? 10000 : 0
  const grandTotal = total + shipping

async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
        const url = await createCheckoutSession(items)
        window.location.href = url // redirige al Checkout hospedado por Stripe
    } catch (error) {
        console.error('Error en checkout:', error)
        alert(error.message)
        setLoading(false)
    }
}

  if (done)
    return (
      <div className="py-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-ink-800">¡Compra realizada!</h1>
        <p className="mt-1 text-neutral-500">
          Tu orden <span className="font-mono font-medium text-ink-700">{orderId}</span> fue procesada (simulación).
        </p>
        <Link
          to="/catalogo"
          className="mt-5 inline-block rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600"
        >
          Seguir comprando
        </Link>
      </div>
    )

  if (items.length === 0)
    return (
      <div className="py-20 text-center text-neutral-500">
        No hay productos en el carrito.{" "}
        <Link to="/catalogo" className="font-medium text-brand-600 hover:underline">
          Ir al catálogo
        </Link>
      </div>
    )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-800">Finalizar compra</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-ink-800">Datos de envío</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nombre completo" placeholder="Juan Pérez" required />
              <Field label="Teléfono" placeholder="+51 999 999 999" required />
              <div className="sm:col-span-2">
                <Field label="Dirección" placeholder="Av. Siempre Viva 123" required />
              </div>
              <Field label="Ciudad" placeholder="Lima" required />
              <Field label="Código postal" placeholder="15001" required />
            </div>
          </div>

          {/* Placeholder visual de la pasarela de pago */}
{/* Método de pago */}
          <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-ink-800">Método de pago</h2>
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Lock size={13} /> Pago seguro
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <CreditCard size={32} className="text-brand-500" />
              <div>
                <p className="font-medium text-ink-700">Pago con tarjeta vía Stripe</p>
                <p className="text-sm text-neutral-500">
                  Serás redirigido a una página segura de Stripe para completar tu pago.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60 lg:hidden"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Pagar {formatPrice(grandTotal)}
          </button>
        </form>

        <div>
          <div className="sticky top-20 rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-ink-800">Resumen de compra</h2>
            <ul className="mb-4 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2 text-sm">
                  <span className="text-neutral-600">
                    {item.name} <span className="text-neutral-400">x{item.qty}</span>
                  </span>
                  <span className="font-medium text-ink-700">{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-neutral-600">
              <span>Envío</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-lg font-bold text-ink-900">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
            <button
              type="submit"
              form=""
              onClick={handleSubmit}
              disabled={loading}
              className="mt-5 hidden w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-60 lg:flex"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Pagar {formatPrice(grandTotal)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink-700">{label}</label>
      <input
        {...props}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
    </div>
  )
}
