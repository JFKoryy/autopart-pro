import { useEffect, useMemo, useState } from "react"
import { getProducts } from "../services/api"
import { brands, years } from "../services/mockData"
import { useCart } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"

export default function Catalog() {
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")

  useEffect(() => {
    // TODO: reemplazar por llamada real a la API
    getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const models = useMemo(() => {
    const list = products
      .filter((p) => !brand || p.brand === brand)
      .map((p) => p.model)
    return [...new Set(list)]
  }, [products, brand])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
      const matchBrand = !brand || p.brand === brand
      const matchModel = !model || p.model === model
      const matchYear = !year || p.year === Number(year)
      return matchQuery && matchBrand && matchModel && matchYear
    })
  }, [products, query, brand, model, year])

  function resetFilters() {
    setQuery("")
    setBrand("")
    setModel("")
    setYear("")
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-800">Catálogo de repuestos</h1>
        <p className="text-neutral-500">Encuentra la pieza compatible con tu vehículo.</p>
      </div>

      {/* Buscador y filtros */}
      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
            <SlidersHorizontal size={16} /> Filtros:
          </span>
          <select
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value)
              setModel("")
            }}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-ink-700 outline-none focus:border-brand-500"
          >
            <option value="">Marca</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-ink-700 outline-none focus:border-brand-500"
          >
            <option value="">Modelo</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-ink-700 outline-none focus:border-brand-500"
          >
            <option value="">Año</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {(query || brand || model || year) && (
            <button onClick={resetFilters} className="text-sm font-medium text-brand-600 hover:underline">
              Limpiar
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="animate-spin" /> <span className="ml-2">Cargando productos...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-neutral-500">
          No se encontraron productos con esos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} variant="catalog" onAddToCart={addItem} />
          ))}
        </div>
      )}
    </div>
  )
}
