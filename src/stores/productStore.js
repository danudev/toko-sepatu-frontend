import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productAPI } from '@/services/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const currentProduct = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await productAPI.getAll()
      products.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProductBySlug = async (slug) => {
    loading.value = true
    error.value = null
    try {
      const response = await productAPI.getBySlug(slug)
      currentProduct.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Product not found'
      console.error('Error fetching product:', err)
    } finally {
      loading.value = false
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return {
    products,
    currentProduct,
    loading,
    error,
    fetchProducts,
    fetchProductBySlug,
    formatPrice
  }
})
