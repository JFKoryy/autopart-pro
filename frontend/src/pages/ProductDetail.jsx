import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getProductById } from "../services/api"
import { useCart } from "../context/CartContext"
import { ShoppingCart, ChevronLeft, Loader2, Check } from "lucide-react"

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    // TODO: reemplazar por llamada real a la API
    getProductById(id).then((data) => {
      setProduct(data)
      setLoading(false)
    })
  }, [id])

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        <Loader2 className="animate-spin" /> <span className="ml-2">Cargando...</span>
      </div>
    )

  if (!product)
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500">Producto no encontrado.</p>
        <Link to="/catalogo" className="mt-2 inline-block font-medium text-brand-600 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    )

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-ink-700"
      >
        <ChevronLeft size={16} /> Volver
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div>
          <span className="text-sm font-mono text-neutral-400">{product.sku}</span>
          <h1 className="mt-1 text-2xl font-bold text-ink-800 text-balance">{product.name}</h1>
          <p className="mt-1 text-sm text-brand-600">{product.category}</p>

          <p className="mt-4 text-3xl font-bold text-ink-900">${product.price.toFixed(2)}</p>
          <p className={`mt-1 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock"}
          </p>

          <p className="mt-4 leading-relaxed text-neutral-600">{product.description}</p>

          <div className="mt-5 rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="mb-2 font-semibold text-ink-800">Compatibilidad</h3>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-neutral-400">Marca</dt>
                <dd className="font-medium text-ink-700">{product.brand}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">Modelo</dt>
                <dd className="font-medium text-ink-700">{product.model}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">Año</dt>
                <dd className="font-medium text-ink-700">{product.year}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-neutral-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg text-neutral-500 hover:bg-neutral-100"
              >
                -
              </button>
              <span className="w-10 text-center font-medium text-ink-800">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 text-lg text-neutral-500 hover:bg-neutral-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600"
            >
              {added ? (
                <>
                  <Check size={18} /> Agregado
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Agregar al carrito
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
