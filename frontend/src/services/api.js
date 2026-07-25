
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

  // ----------VALIDACIÓN DE TOKEN----------

export async function validateToken() {
  const token = localStorage.getItem('token')
  if (!token) return null

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    headers: getAuthHeader()
  })

  if (!response.ok) {
    localStorage.removeItem('token')
    return null
  }

  const data = await response.json()
  return data.user
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
      headers: getAuthHeader()
    })
    
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

export async function uploadImage(file) {
  const { Authorization } = getAuthHeader()

  // Paso 1: preguntar al backend qué modo usar
  const initRes = await fetch(`${import.meta.env.VITE_API_URL}/upload/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization },
    body: JSON.stringify({ filename: file.name, contentType: file.type })
  })

  let initData
  try {
    initData = await initRes.json()
  } catch {
    throw new Error('Error al iniciar la subida de imagen.')
  }

  if (!initRes.ok) {
    throw new Error(initData.message || 'Error al iniciar la subida')
  }

  // Modo S3: subir directo al bucket con la URL prefirmada
  if (initData.mode === 's3') {
    const uploadRes = await fetch(initData.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    })

    if (!uploadRes.ok) {
      throw new Error('Error al subir la imagen a S3.')
    }

    return initData.publicUrl
  }

  // Modo local: flujo antiguo con FormData
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: 'POST',
    headers: { Authorization },
    body: formData
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Error al subir la imagen. Verifica el tamaño del archivo.')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Error al subir la imagen')
  }

  return data.url
}
export async function deleteImage(url) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ url })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar la imagen')
  }

  return data
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

export async function createCheckoutSession(items) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ items })
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Error al iniciar el pago.')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar el pago')
  }

  return data.url
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

export async function updateUser(id, { name, email, role }) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ name, email, role })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar usuario')
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

export async function createUser(userData) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(userData)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al crear usuario')
  }

  return data.data
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