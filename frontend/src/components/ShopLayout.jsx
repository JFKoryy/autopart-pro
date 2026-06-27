import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-500">
          AutoPart Pro — Demo de interfaz. Datos de prueba, sin conexión a un backend real.
        </div>
      </footer>
    </div>
  )
}
