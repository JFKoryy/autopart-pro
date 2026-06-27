import { createContext, useContext, useState } from "react"
import * as api from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

async function signIn(email, password) {
    setLoading(true)
    const res = await api.login(email, password)
    console.log("Login response:", res) // Agregar un log para depuración
    setUser(res.user)
    localStorage.setItem("token", res.token) // Guardar el token en localStorage  
    setLoading(false)
    return res.user
}

  async function signUp(name, email, password) {
    setLoading(true)
    const res = await api.register(name, email, password)
    setUser(res.user)
    localStorage.setItem("token", res.token) 
    setLoading(false)
    return res.user
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem("token") // Eliminar el token del localStorage
  }

  // Helpers de permisos basados en el rol simulado.
  const role = user?.role || null
  const can = {
    viewLowStock: role === "admin" || role === "employee",
    updateStock: role === "admin" || role === "employee",
    createDeleteProduct: role === "admin",
    editPriceSku: role === "admin",
    viewAllSales: role === "admin",
    manageUsers: role === "admin",
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
