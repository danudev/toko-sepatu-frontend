import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartAPI } from '@/services/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  })

  const fetchCart = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await cartAPI.get()
      items.value = response.data.items || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch cart'
      console.error('Error fetching cart:', err)
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await cartAPI.add(productId, quantity)
      await fetchCart() // Refresh cart
      return { success: true, message: response.message }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add to cart'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (id, quantity) => {
    loading.value = true
    error.value = null
    try {
      await cartAPI.update(id, quantity)
      await fetchCart() // Refresh cart
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update cart'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const removeItem = async (id) => {
    loading.value = true
    error.value = null
    try {
      await cartAPI.remove(id)
      await fetchCart() // Refresh cart
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove item'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return {
    items,
    loading,
    error,
    itemCount,
    totalAmount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    formatPrice
  }
})
