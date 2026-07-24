import { useEffect, useState } from "react"
import { getUsers, createUser, updateUser, deleteUser } from "../services/api"
import { UserPlus, Shield, Briefcase, User, X, Pencil, Trash2 } from "lucide-react"

const roleBadge = {
  admin: { label: "Administrador", icon: Shield, color: "bg-brand-100 text-brand-700" },
  employee: { label: "Empleado", icon: Briefcase, color: "bg-blue-100 text-blue-700" },
  client: { label: "Cliente", icon: User, color: "bg-neutral-100 text-ink-700" },
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null) // null = creando, objeto = editando
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  function loadUsers() {
    getUsers()
      .then(setUsers)
      .catch((error) => console.error("Error al obtener usuarios:", error))
  }

  function openCreateModal() {
    setEditingUser(null)
    setForm({ name: "", email: "", password: "", role: "client" })
    setError("")
    setIsModalOpen(true)
  }

  function openEditModal(user) {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, password: "", role: user.role })
    setError("")
    setIsModalOpen(true)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { name: form.name, email: form.email, role: form.role })
      } else {
        await createUser(form)
      }
      setIsModalOpen(false)
      loadUsers()
    } catch (err) {
      setError(err.message || "Error al guardar usuario")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer.")) return
    setDeletingId(id)
    try {
      await deleteUser(id)
      loadUsers()
    } catch (err) {
      alert(err.message || "Error al eliminar usuario")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-800">Gestión de usuarios</h1>
          <p className="text-neutral-500">Administra empleados y clientes del sistema.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600"
        >
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
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-brand-600"
                          title="Editar usuario"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id}
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-800">
                {editingUser ? "Editar usuario" : "Nuevo usuario"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink-700">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-700">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-ink-700">Rol</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="client">Cliente</option>
                  <option value="employee">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {loading ? "Guardando..." : editingUser ? "Guardar cambios" : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}