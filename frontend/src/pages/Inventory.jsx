import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getProducts, deleteProduct, updateStock } from "../services/api"
import { useAuth } from "../context/AuthContext"
import Modal from "../components/Modal"
import { Pencil, Trash2, PlusCircle, AlertTriangle, Save, Search } from "lucide-react"

export default function Inventory() {
  const { can } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [toDelete, setToDelete] = useState(null)
  const [stockEdit, setStockEdit] = useState(null)
  const [stockValue, setStockValue] = useState(0)

  useEffect(() => {
    // TODO: reemplazar por llamada real a la API
    getProducts().then(setProducts)
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()),
  )

  async function confirmDelete() {
    // TODO: reemplazar por llamada real a la API
    await deleteProduct(toDelete.id)
    setProducts((prev) => prev.filter((p) => p.id !== toDelete.id))
    setToDelete(null)
  }

  function openStock(product) {
    setStockEdit(product)
    setStockValue(product.stock)
  }

  async function saveStock() {
    // TODO: reemplazar por llamada real a la API
    await updateStock(stockEdit.id, Number(stockValue))
    setProducts((prev) => prev.map((p) => (p.id === stockEdit.id ? { ...p, stock: Number(stockValue) } : p)))
    setStockEdit(null)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-800">Gestión de inventario</h1>
          <p className="text-neutral-500">Administra productos, stock y precios.</p>
        </div>
        {can.createDeleteProduct && (
          <button
            onClick={() => navigate("/admin/producto/nuevo")}
            className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600"
          >
            <PlusCircle size={18} /> Nuevo producto
          </button>
        )}
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto o SKU..."
          className="w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Compatibilidad</th>
                <th className="px-4 py-3 text-right font-medium">Precio</th>
                <th className="px-4 py-3 text-center font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const low = p.stock <= p.minStock
                return (
                  <tr key={p.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3 font-mono text-neutral-500">{p.sku}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-800">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.category}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {p.brand} {p.model} · {p.year}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => can.updateStock && openStock(p)}
                        disabled={!can.updateStock}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                          low ? "bg-red-100 text-red-700" : "bg-neutral-100 text-ink-700"
                        } ${can.updateStock ? "hover:ring-2 hover:ring-brand-200" : "cursor-default"}`}
                      >
                        {low && <AlertTriangle size={12} />}
                        {p.stock}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {can.editPriceSku && (
                          <button
                            onClick={() => navigate(`/admin/producto/${p.id}`)}
                            className="rounded-md border border-neutral-200 p-1.5 text-ink-700 hover:bg-neutral-100"
                            aria-label="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {can.createDeleteProduct && (
                          <button
                            onClick={() => setToDelete(p)}
                            className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                        {!can.editPriceSku && !can.createDeleteProduct && (
                          <span className="text-xs text-neutral-400">Sin acciones</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!can.createDeleteProduct && (
        <p className="mt-3 text-sm text-neutral-500">
          Como empleado puedes actualizar el stock, pero no crear ni eliminar productos.
        </p>
      )}

      {/* Modal eliminar */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Eliminar producto"
        footer={
          <>
            <button
              onClick={() => setToDelete(null)}
              className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-neutral-600">
          ¿Seguro que deseas eliminar <span className="font-semibold text-ink-800">{toDelete?.name}</span>? Esta
          acción no se puede deshacer.
        </p>
      </Modal>

      {/* Modal actualizar stock */}
      <Modal
        open={!!stockEdit}
        onClose={() => setStockEdit(null)}
        title="Actualizar stock"
        footer={
          <>
            <button
              onClick={() => setStockEdit(null)}
              className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button
              onClick={saveStock}
              className="flex items-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              <Save size={15} /> Guardar
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-neutral-600">
          {stockEdit?.name} <span className="text-neutral-400">({stockEdit?.sku})</span>
        </p>
        <label className="mb-1 block text-sm font-medium text-ink-700">Cantidad en stock</label>
        <input
          type="number"
          min={0}
          value={stockValue}
          onChange={(e) => setStockValue(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </Modal>
    </div>
  )
}
