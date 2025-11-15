<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <LoadingSpinner v-if="orderStore.loading" />

      <!-- Order Details -->
      <div v-else-if="order" class="max-w-2xl mx-auto">
        <!-- Success Icon -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p class="text-gray-600">Thank you for your purchase</p>
        </div>

        <!-- Order Info Card -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Order Information</h2>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Order Number</span>
              <span class="font-semibold">{{ order.order_number }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Customer Name</span>
              <span class="font-semibold">{{ order.customer_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email</span>
              <span class="font-semibold">{{ order.customer_email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phone</span>
              <span class="font-semibold">{{ order.customer_phone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Payment Status</span>
              <span
                class="font-semibold px-3 py-1 rounded-full text-sm"
                :class="{
                  'bg-green-100 text-green-800': order.payment_status === 'paid',
                  'bg-yellow-100 text-yellow-800': order.payment_status === 'pending',
                  'bg-red-100 text-red-800': order.payment_status === 'failed'
                }"
              >
                {{ order.payment_status.toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="font-bold text-gray-800 mb-3">Order Items</h3>
            <div class="space-y-2">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex justify-between"
              >
                <span class="text-gray-600">
                  {{ item.product_name }} x{{ item.quantity }}
                </span>
                <span class="font-semibold">{{ formatPrice(item.subtotal) }}</span>
              </div>
            </div>
          </div>

          <div class="border-t mt-4 pt-4">
            <div class="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span class="text-blue-600">{{ formatPrice(order.total_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="text-center">
          <router-link
            to="/"
            class="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </router-link>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <p class="text-xl text-gray-600">Order not found</p>
        <router-link
          to="/"
          class="inline-block mt-6 text-blue-600 hover:text-blue-700"
        >
          Go to Home
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import Navbar from '@/components/Navbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)

const formatPrice = (price) => {
  return orderStore.formatPrice(price)
}

onMounted(async () => {
  const orderNumber = route.params.orderNumber
  await orderStore.fetchOrder(orderNumber)
})
</script>
