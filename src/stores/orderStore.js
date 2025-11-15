import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderAPI } from '@/services/api'
import { useCartStore } from './cartStore'

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const createOrder = async (customerData) => {
    loading.value = true
    error.value = null
    try {
      const response = await orderAPI.create(customerData)
      currentOrder.value = response.data

      // Clear cart after successful order
      const cartStore = useCartStore()
      cartStore.clearCart()

      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create order'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchOrder = async (orderNumber) => {
    loading.value = true
    error.value = null
    try {
      const response = await orderAPI.getByNumber(orderNumber)
      currentOrder.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Order not found'
      console.error('Error fetching order:', err)
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
    currentOrder,
    loading,
    error,
    createOrder,
    fetchOrder,
    formatPrice
  }
})
