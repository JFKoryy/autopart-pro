import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { Trash2, ShoppingCart, ChevronLeft } from "lucide-react"

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0)
    return (
      <div className="py-20 text-center">
        <ShoppingCart size={48} className="mx-auto text-neutral-300" />
        <p className="mt-4 text-lg font-medium text-ink-700">Tu carrito está vacío</p>
        <p className="text-neutral-500">Agrega productos desde el catálogo.</p>
        <Link
          to="/catalogo"
          className="mt-4 inline-block rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600"
        >
          Ver catálogo
        </Link>
      </div>
    )

  return (
    <div>
      <Link to="/catalogo" className="mb-4 flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-ink-700">
        <ChevronLeft size={16} /> Seguir comprando
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-ink-800">Carrito de compras</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-neutral-100 p-4 last:border-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-20 w-20 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink-800 truncate">{item.name}</p>
                  <p className="text-sm text-neutral-400">{item.sku}</p>
                  <p className="text-sm font-semibold text-ink-700">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center rounded-md border border-neutral-300">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="px-2.5 py-1.5 text-neutral-500 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-ink-800">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-2.5 py-1.5 text-neutral-500 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
                <span className="w-20 text-right font-semibold text-ink-800">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-md p-2 text-red-500 hover:bg-red-50"
                  aria-label="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-ink-800">Resumen</h2>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-neutral-600">
              <span>Envío</span>
              <span>Calculado en checkout</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-lg font-bold text-ink-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-5 w-full rounded-md bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
