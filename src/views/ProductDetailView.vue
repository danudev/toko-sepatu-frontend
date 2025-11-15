<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <!-- Loading State -->
      <LoadingSpinner v-if="productStore.loading" />

      <!-- Error State -->
      <div v-else-if="productStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ productStore.error }}
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="grid md:grid-cols-2 gap-8 p-8">
          <!-- Product Image -->
          <div>
            <img
              :src="product.image_url"
              :alt="product.name"
              class="w-full rounded-lg"
            />
          </div>

          <!-- Product Info -->
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.name }}</h1>

            <div class="mb-6">
              <span class="text-4xl font-bold text-blue-600">
                {{ formatPrice(product.price) }}
              </span>
            </div>

            <div class="mb-6">
              <span class="text-gray-600">Stock: </span>
              <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                {{ product.stock > 0 ? `${product.stock} available` : 'Out of stock' }}
              </span>
            </div>

            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Quantity Selector -->
            <div class="mb-6">
              <label class="block text-gray-700 font-semibold mb-2">Quantity</label>
              <div class="flex items-center space-x-4">
                <button
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  -
                </button>
                <span class="text-xl font-semibold">{{ quantity }}</span>
                <button
                  @click="incrementQuantity"
                  :disabled="quantity >= product.stock"
                  class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="handleAddToCart"
              :disabled="loading || product.stock === 0"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Adding to Cart...</span>
              <span v-else-if="product.stock === 0">Out of Stock</span>
              <span v-else>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import Navbar from '@/components/Navbar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const quantity = ref(1)
const loading = ref(false)

const product = computed(() => productStore.currentProduct)

const formatPrice = (price) => {
  return productStore.formatPrice(price)
}

const incrementQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = async () => {
  loading.value = true
  const result = await cartStore.addToCart(product.value.id, quantity.value)
  loading.value = false

  if (result.success) {
    alert(`${quantity.value} item(s) added to cart!`)
    router.push('/cart')
  } else {
    alert(result.message || 'Failed to add product to cart')
  }
}

onMounted(async () => {
  await productStore.fetchProductBySlug(route.params.slug)
})
</script>
