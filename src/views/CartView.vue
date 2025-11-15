<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <!-- Loading State -->
      <LoadingSpinner v-if="cartStore.loading" />

      <!-- Empty Cart -->
      <div v-else-if="cartStore.items.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-xl text-gray-600 mb-6">Your cart is empty</p>
        <router-link
          to="/"
          class="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <div class="flex items-center gap-6">
              <!-- Product Image -->
              <img
                :src="item.product.image_url"
                :alt="item.product.name"
                class="w-24 h-24 object-cover rounded-lg"
              />

              <!-- Product Info -->
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                  {{ item.product.name }}
                </h3>
                <p class="text-blue-600 font-bold">
                  {{ formatPrice(item.product.price) }}
                </p>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center space-x-3">
                <button
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                  class="bg-gray-200 text-gray-700 w-8 h-8 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  -
                </button>
                <span class="font-semibold w-8 text-center">{{ item.quantity }}</span>
                <button
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  :disabled="item.quantity >= item.product.stock"
                  class="bg-gray-200 text-gray-700 w-8 h-8 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <!-- Subtotal -->
              <div class="text-right">
                <p class="text-lg font-bold text-gray-800">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </p>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeItem(item.id)"
                class="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold">{{ formatPrice(cartStore.totalAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Items</span>
                <span class="font-semibold">{{ cartStore.itemCount }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between">
                <span class="text-lg font-bold">Total</span>
                <span class="text-lg font-bold text-blue-600">
                  {{ formatPrice(cartStore.totalAmount) }}
                </span>
              </div>
            </div>

            <router-link
              to="/checkout"
              class="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </router-link>

            <router-link
              to="/"
              class="block w-full text-center text-gray-600 hover:text-gray-800 mt-4"
            >
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import Navbar from '@/components/Navbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return cartStore.formatPrice(price)
}

const updateQuantity = async (id, quantity) => {
  if (quantity < 1) return
  await cartStore.updateQuantity(id, quantity)
}

const removeItem = async (id) => {
  if (confirm('Remove this item from cart?')) {
    await cartStore.removeItem(id)
  }
}

onMounted(async () => {
  await cartStore.fetchCart()
})
</script>
