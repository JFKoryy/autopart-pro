// Funciones de servicio SIMULADAS.
// Cada una imita una respuesta del backend con una promesa resuelta tras un pequeño delay.
// TODO: reemplazar cada función por la llamada real a la API.

import { mockProducts, mockSales, mockUsers } from "./mockData"

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

// ---------- AUTENTICACIÓN ----------

export async function login(email, password) {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error en la autenticación')
  }
  
  return data

}

export async function register(name, email, password) {
  // TODO: reemplazar por llamada real a la API (POST /auth/register)
  await delay()
  return {
    token: "fake-jwt-token",
    user: { id: Date.now(), name, email, role: "client" },
  }
}

// ---------- PRODUCTOS ----------

export async function getProducts() {
  // TODO: reemplazar por llamada real a la API (GET /products)
  await delay()
  return [...mockProducts]
}

export async function getProductById(id) {
  // TODO: reemplazar por llamada real a la API (GET /products/:id)
  await delay()
  return mockProducts.find((p) => p.id === Number(id)) || null
}

export async function createProduct(data) {
  // TODO: reemplazar por llamada real a la API (POST /products)
  await delay()
  return { id: Date.now(), ...data }
}

export async function updateProduct(id, data) {
  // TODO: reemplazar por llamada real a la API (PUT /products/:id)
  await delay()
  return { id, ...data }
}

export async function deleteProduct(id) {
  // TODO: reemplazar por llamada real a la API (DELETE /products/:id)
  await delay()
  return { success: true, id }
}

export async function updateStock(id, stock) {
  // TODO: reemplazar por llamada real a la API (PATCH /products/:id/stock)
  await delay()
  return { id, stock }
}

export async function getLowStockProducts() {
  // TODO: reemplazar por llamada real a la API (GET /products/low-stock)
  await delay()
  return mockProducts.filter((p) => p.stock <= p.minStock)
}

// ---------- VENTAS ----------

export async function getSales() {
  // TODO: reemplazar por llamada real a la API (GET /sales)
  await delay()
  return [...mockSales]
}

// ---------- USUARIOS ----------

export async function getUsers() {
  // TODO: reemplazar por llamada real a la API (GET /users)
  await delay()
  return [...mockUsers]
}

// ---------- CHECKOUT ----------

export async function checkout(cart, paymentInfo) {
  // TODO: reemplazar por llamada real a la API / pasarela de pago (POST /checkout)
  await delay(800)
  return { success: true, orderId: "ORD-" + Date.now() }
}
