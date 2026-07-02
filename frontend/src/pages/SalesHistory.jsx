import { useEffect, useState } from "react"
import { getSales } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { formatPrice } from "../utils/formatters"
import { Receipt } from "lucide-react"

export default function SalesHistory() {
  const { role, can } = useAuth()
  const [sales, setSales] = useState([])

useEffect(() => {
    getSales()
        .then(setSales)
        .catch((error) => console.error("Error al obtener ventas:", error))
}, [])

  // Admin ve todo el historial; empleado/cliente solo sus propias ventas/compras.
  const visibleSales = can.viewAllSales ? sales : sales.filter((s) => s.customer === "client")

  const total = visibleSales.reduce((sum, s) => sum + s.total, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-800">
          {can.viewAllSales ? "Historial de ventas" : "Mi historial"}
        </h1>
        <p className="text-neutral-500">
          {can.viewAllSales
            ? "Todas las ventas registradas en el sistema."
            : role === "employee"
              ? "Solo se muestran las ventas asociadas a tu cuenta."
              : "Solo se muestran tus propias compras."}
        </p>
      </div>

      <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-600">
          <Receipt size={16} />
        </span>
        <div>
          <p className="text-xs text-neutral-500">Total acumulado</p>
          <p className="font-bold text-ink-900">{formatPrice(total)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 text-center font-medium">Cantidad</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {visibleSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-neutral-400">
                    No hay ventas registradas.
                  </td>
                </tr>
              ) : (
                visibleSales.map((s) => (
                  <tr key={s.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3 font-mono text-neutral-500">{s.id}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Date(s.created_at).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-4 py-3 text-ink-700">
                      {s.items.map(item => `${item.product_name} (${item.quantity})`).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-center text-ink-700">
                      {s.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800">{formatPrice(s.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
