import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar"
import { LayoutDashboard, Boxes, PlusCircle, Receipt, Users } from "lucide-react"

export default function AdminLayout() {
  const { can } = useAuth()

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, show: true },
    { to: "/admin/inventario", label: "Inventario", icon: Boxes, show: true },
    { to: "/admin/producto/nuevo", label: "Nuevo producto", icon: PlusCircle, show: can.createDeleteProduct },
    { to: "/admin/ventas", label: "Historial de ventas", icon: Receipt, show: true },
    { to: "/admin/usuarios", label: "Usuarios", icon: Users, show: can.manageUsers },
  ].filter((l) => l.show)

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-20 flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-brand-500 text-white" : "text-ink-700 hover:bg-neutral-100"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {/* Nav móvil */}
          <nav className="mb-4 flex gap-2 overflow-x-auto md:hidden">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
                    isActive ? "bg-brand-500 text-white" : "bg-white text-ink-700 border border-neutral-200"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
