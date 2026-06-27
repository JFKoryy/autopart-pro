import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Wrench, Loader2 } from "lucide-react"

export default function Register() {
  const { signUp, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    // Registro simulado: crea un cliente y redirige al catálogo.
    await signUp(name, email, password)
    navigate("/catalogo")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Wrench size={26} />
          </span>
          <h1 className="mt-3 text-2xl font-bold text-ink-800">Crear cuenta</h1>
          <p className="text-sm text-neutral-500">Regístrate como cliente</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-ink-700">Nombre completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />

          <label className="mb-1 block text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />

          <label className="mb-1 block text-sm font-medium text-ink-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Crear cuenta
          </button>

          <p className="mt-4 text-center text-sm text-neutral-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
