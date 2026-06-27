import { Link } from "react-router-dom"
import { ShoppingCart, Pencil, Trash2, AlertTriangle } from "lucide-react"

/**
 * ProductCard reutilizable para el catálogo (cliente) y el inventario (admin/empleado).
 * Las props controlan qué botones se muestran según el contexto y el rol.
 */
export default function ProductCard({
  product,
  variant = "catalog", // "catalog" | "inventory"
  onAddToCart,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}) {
  const lowStock = product.stock <= product.minStock

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded-md bg-ink-800/85 px-2 py-1 text-xs font-medium text-white">
          {product.category}
        </span>
        {variant === "inventory" && lowStock && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            <AlertTriangle size={12} />
            Stock bajo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-mono text-neutral-400">{product.sku}</span>
        <h3 className="mt-0.5 font-semibold text-ink-800 leading-snug text-pretty">{product.name}</h3>
        <p className="mt-1 text-sm text-neutral-500">
          {product.brand} · {product.model} · {product.year}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <span className="text-xl font-bold text-ink-900">${product.price.toFixed(2)}</span>
          <span className={`text-sm font-medium ${lowStock ? "text-red-600" : "text-neutral-500"}`}>
            Stock: {product.stock}
          </span>
        </div>

        <div className="mt-4 flex flex-1 items-end gap-2">
          {variant === "catalog" && (
            <>
              <Link
                to={`/producto/${product.id}`}
                className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-center text-sm font-medium text-ink-700 hover:bg-neutral-100"
              >
                Ver
              </Link>
              <button
                onClick={() => onAddToCart?.(product)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                <ShoppingCart size={16} />
                Agregar
              </button>
            </>
          )}

          {variant === "inventory" && (
            <>
              {canEdit && (
                <button
                  onClick={() => onEdit?.(product)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-neutral-100"
                >
                  <Pencil size={15} />
                  Editar
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete?.(product)}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Eliminar
                </button>
              )}
              {!canEdit && !canDelete && (
                <span className="text-sm text-neutral-400">Solo lectura</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
