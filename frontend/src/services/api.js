
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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/sales`, {
    headers: getAuthHeader()
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener ventas')
  }

  return data.data
}
// ---------- USUARIOS ----------

export async function getUsers() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    headers: getAuthHeader()
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener usuarios')
  }

  return data.data
}

export async function updateUserRole(id, role) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}/role`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify({ role })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar rol')
  }

  return data
}

export async function deleteUser(id) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar usuario')
  }

  return data
}

// ---------- CHECKOUT ----------

export async function checkout(cart) {
  const items = cart.map(item => ({
    product_id: item.id,
    quantity: item.qty,        
    unit_price: item.price
  }))

  const response = await fetch(`${import.meta.env.VITE_API_URL}/sales`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ items })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al procesar la compra')
  }

  return data
}