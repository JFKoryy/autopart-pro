import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProducts, getLowStockProducts, getSales } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { Package, AlertTriangle, DollarSign, Receipt, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const { user, role, can } = useAuth()
  const [products, setProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [sales, setSales] = useState([])

  useEffect(() => {
    // TODO: reemplazar por llamadas reales a la API
    getProducts().then(setProducts)
    getLowStockProducts().then(setLowStock)
    getSales().then(setSales)
  }, [])

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)

  const stats = [
    { label: "Productos", value: products.length, icon: Package, color: "bg-blue-50 text-blue-600" },
    {
      label: "Stock bajo",
      value: lowStock.length,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      show: can.viewLowStock,
    },
    { label: "Ventas", value: sales.length, icon: Receipt, color: "bg-amber-50 text-amber-600" },
    {
      label: "Ingresos",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
  ].filter((s) => s.show !== false)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-800">Dashboard</h1>
        <p className="text-neutral-500">
          Bienvenido, {user?.name}. Resumen general del {role === "admin" ? "negocio" : "inventario"}.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-4">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon size={18} />
            </span>
            <p className="mt-3 text-2xl font-bold text-ink-900">{s.value}</p>
            <p className="text-sm text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tarjeta destacada de stock bajo */}
      {can.viewLowStock && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-red-700">
              <AlertTriangle size={18} />
              Productos con stock bajo
            </h2>
            <Link
              to="/admin/inventario"
              className="flex items-center gap-1 text-sm font-medium text-red-600 hover:underline"
            >
              Ver inventario <ArrowRight size={14} />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-red-600">No hay productos con stock bajo.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {lowStock.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.sku}</p>
                  </div>
                  <span className="ml-2 shrink-0 rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                    {p.stock} / mín {p.minStock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ventas recientes */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-ink-800">Ventas recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400">
                <th className="pb-2 pr-4 font-medium">Orden</th>
                <th className="pb-2 pr-4 font-medium">Fecha</th>
                <th className="pb-2 pr-4 font-medium">Producto</th>
                <th className="pb-2 pr-4 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 5).map((s) => (
                <tr key={s.id} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2 pr-4 font-mono text-neutral-500">{s.id}</td>
                  <td className="py-2 pr-4 text-neutral-600">{s.date}</td>
                  <td className="py-2 pr-4 text-ink-700">{s.product}</td>
                  <td className="py-2 pr-4 text-right font-semibold text-ink-800">${s.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
