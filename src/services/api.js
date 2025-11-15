import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Generate or get session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const sessionId = getSessionId()
    config.headers['X-Session-ID'] = sessionId
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API Methods
export const productAPI = {
  getAll: () => api.get('/products'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
}

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity) => api.post('/cart', { product_id: productId, quantity }),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
}

export const orderAPI = {
  create: (customerData) => api.post('/orders', customerData),
  getByNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
}

export default api
