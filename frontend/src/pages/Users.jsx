import { useEffect, useState } from "react"
import { getUsers } from "../services/api"
import { UserPlus, Shield, Briefcase, User } from "lucide-react"

const roleBadge = {
  admin: { label: "Administrador", icon: Shield, color: "bg-brand-100 text-brand-700" },
  employee: { label: "Empleado", icon: Briefcase, color: "bg-blue-100 text-blue-700" },
  client: { label: "Cliente", icon: User, color: "bg-neutral-100 text-ink-700" },
}

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // TODO: reemplazar por llamada real a la API
    getUsers().then(setUsers)
  }, [])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-800">Gestión de usuarios</h1>
          <p className="text-neutral-500">Administra empleados y clientes del sistema.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600">
          <UserPlus size={18} /> Nuevo usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const badge = roleBadge[u.role]
                return (
                  <tr key={u.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3 font-medium text-ink-800">{u.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${badge.color}`}>
                        <badge.icon size={13} />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.status === "activo" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
