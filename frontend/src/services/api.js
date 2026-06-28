// Funciones de servicio SIMULADAS.
// Cada una imita una respuesta del backend con una promesa resuelta tras un pequeño delay.
// TODO: reemplazar cada función por la llamada real a la API.

import { mockProducts, mockSales, mockUsers } from "./mockData"

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
function getAuthHeader() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error en el registro')
  }

  return data
}


  // ---------- PRODUCTOS ----------

  export async function getProducts() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener productos')
    }

    return data.data
  }

  export async function getProductById(id) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener el producto')
    }

    return data.data
  }


  export async function createProduct(productData) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(productData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear producto')
    }

    return data.data
  }

  export async function updateProduct(id, data) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || 'Error al actualizar producto')
    }

    return responseData.data
  }

  export async function deleteProduct(id) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar producto')
    }
    return data
  }

  export async function getLowStockProducts() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/low-stock`, { 
  method: 'GET',
      headers: getAuthHeader()
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener productos con stock bajo')
    }
    return data.data
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
