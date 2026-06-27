import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/**
 * Protege rutas internas. Si no hay usuario, redirige al login.
 * Si se pasan roles permitidos, valida que el rol esté incluido.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, role } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(role)) return <Navigate to="/catalogo" replace />

  return children
}
