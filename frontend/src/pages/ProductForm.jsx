import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById, createProduct, updateProduct } from "../services/api"
import { brands, years } from "../services/mockData"
import { ChevronLeft, Save, Loader2 } from "lucide-react"

const empty = {
  sku: "",
  name: "",
  brand: "",
  price: "",
  stock: "",
  min_stock: "",
  category: "",
  description: "",
  image_url: "",
  compatible_cars: "",
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      // TODO: reemplazar por llamada real a la API
      getProductById(id).then((p) => {
        if (p) setForm({ ...empty, ...p })
      })
    }
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // TODO: reemplazar por llamada real a la API
    if (isEdit) await updateProduct(id, form)
    else await createProduct(form)
    setLoading(false)
    navigate("/admin/inventario")
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-ink-700"
      >
        <ChevronLeft size={16} /> Volver
      </button>

      <h1 className="mb-6 text-2xl font-bold text-ink-800">
        {isEdit ? "Editar producto" : "Nuevo producto"}
      </h1>

      <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="SKU" name="sku" value={form.sku} onChange={handleChange} placeholder="BRK-1042" required />
          <Field label="Categoría" name="category" value={form.category} onChange={handleChange} placeholder="Frenos" required />

          <div className="sm:col-span-2">
            <Field label="Nombre" name="name" value={form.name} onChange={handleChange} placeholder="Pastillas de freno" required />
          </div>

          <Select label="Marca" name="brand" value={form.brand} onChange={handleChange} options={brands} required />

          <div className="sm:col-span-2">
            <Field
              label="Autos compatibles"
              name="compatible_cars"
              value={form.compatible_cars}
              onChange={handleChange}
              placeholder="Toyota Corolla, Mazda 3, Chevrolet Spark"
              required
            />
          </div>
          <Field label="Precio ($)" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="45.99" required />
          <Field label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="20" required />
          <Field label="Stock mínimo" name="min_stock" type="number" value={form.min_stock} onChange={handleChange} placeholder="10" required />

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-ink-700">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Detalles del producto..."
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </div>

                <div className="sm:col-span-2">
          <Field
            label="URL de la imagen"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://..."
          />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/inventario")}
            className="rounded-md border border-neutral-200 px-4 py-2 font-medium text-ink-700 hover:bg-neutral-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
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

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink-700">{label}</label>
      <select
        {...props}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      >
        <option value="">Selecciona...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
