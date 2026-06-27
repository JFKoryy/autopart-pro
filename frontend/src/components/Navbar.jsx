import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Wrench, ShoppingCart, LayoutDashboard, LogOut, LogIn } from "lucide-react"

const roleLabels = {
  admin: "Administrador",
  employee: "Empleado",
  client: "Cliente",
}

export default function Navbar() {
  const { user, role, signOut, can } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate("/login")
  }

  const isInternal = role === "admin" || role === "employee"

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Wrench size={20} />
          </span>
          <div className="leading-tight">
            <span className="block font-bold text-ink-800">AutoPart Pro</span>
            <span className="block text-xs text-neutral-500">Repuestos automotrices</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/catalogo"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-neutral-100"
          >
            Catálogo
          </Link>

          {isInternal && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-neutral-100"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Panel</span>
            </Link>
          )}

          <Link
            to="/carrito"
            className="relative rounded-md p-2 text-ink-700 hover:bg-neutral-100"
            aria-label="Carrito de compras"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-1 sm:pl-3">
              <div className="hidden text-right sm:block">
                <span className="block text-sm font-medium text-ink-800">{user.name}</span>
                <span className="block text-xs text-brand-600">{roleLabels[role]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-neutral-100"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              <LogIn size={16} />
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
