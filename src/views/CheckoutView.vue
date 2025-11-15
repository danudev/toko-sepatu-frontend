<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Customer Information</h2>

            <form @submit.prevent="handleCheckout" class="space-y-4">
              <div>
                <label class="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="081234567890"
                />
              </div>

              <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {{ error }}
              </div>

              <button
                type="submit"
                :disabled="loading || cartStore.items.length === 0"
                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span v-if="loading">Processing...</span>
                <span v-else>Pay Now</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            <!-- Cart Items -->
            <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <span class="text-gray-600">
                  {{ item.product.name }} x{{ item.quantity }}
                </span>
                <span class="font-semibold">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </span>
              </div>
            </div>

            <div class="border-t pt-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Items</span>
                <span class="font-semibold">{{ cartStore.itemCount }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-blue-600">{{ formatPrice(cartStore.totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const form = ref({
  name: '',
  email: '',
  phone: ''
})

const loading = ref(false)
const error = ref(null)

const formatPrice = (price) => {
  return cartStore.formatPrice(price)
}

const loadMidtransScript = () => {
  return new Promise((resolve) => {
    if (window.snap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY)
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

const handleCheckout = async () => {
  loading.value = true
  error.value = null

  try {
    // Load Midtrans script
    await loadMidtransScript()

    // Create order
    const result = await orderStore.createOrder(form.value)

    if (!result.success) {
      error.value = result.message
      loading.value = false
      return
    }

    // Open Midtrans Snap
    window.snap.pay(result.data.snap_token, {
      onSuccess: (result) => {
        console.log('Payment success:', result)
        router.push(`/order-success/${result.order_id}`)
      },
      onPending: (result) => {
        console.log('Payment pending:', result)
        router.push(`/order-success/${result.order_id}`)
      },
      onError: (result) => {
        console.log('Payment error:', result)
        error.value = 'Payment failed. Please try again.'
        loading.value = false
      },
      onClose: () => {
        console.log('Payment popup closed')
        loading.value = false
      }
    })

  } catch (err) {
    console.error('Checkout error:', err)
    error.value = 'Something went wrong. Please try again.'
    loading.value = false
  }
}

onMounted(async () => {
  await cartStore.fetchCart()

  // Redirect if cart is empty
  if (cartStore.items.length === 0) {
    router.push('/cart')
  }
})
</script>
