import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import ProtectedRoute from "./components/ProtectedRoute"
import ShopLayout from "./components/ShopLayout"
import AdminLayout from "./components/AdminLayout"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Catalog from "./pages/Catalog"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import ProductForm from "./pages/ProductForm"
import SalesHistory from "./pages/SalesHistory"
import Users from "./pages/Users"

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Tienda (cliente) */}
          <Route element={<ShopLayout />}>
            <Route index element={<Navigate to="/catalogo" replace />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Internas (admin / empleado) */}
          <Route
            element={
              <ProtectedRoute roles={["admin", "employee"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/inventario" element={<Inventory />} />
            <Route path="/admin/ventas" element={<SalesHistory />} />
            {/* Crear/editar producto: solo admin */}
            <Route
              path="/admin/producto/nuevo"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/producto/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            {/* Gestión de usuarios: solo admin */}
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/catalogo" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
