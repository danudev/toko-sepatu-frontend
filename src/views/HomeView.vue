<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Shop Shoes</h1>
        <p class="text-gray-600">Find your perfect pair</p>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="productStore.loading" />

      <!-- Error State -->
      <div v-else-if="productStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ productStore.error }}
      </div>

      <!-- Products Grid -->
      <div
        v-else-if="productStore.products.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCard
          v-for="product in productStore.products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 text-lg">No products available</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import Navbar from '@/components/Navbar.vue'
import ProductCard from '@/components/ProductCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const productStore = useProductStore()
const cartStore = useCartStore()

onMounted(async () => {
  await productStore.fetchProducts()
  await cartStore.fetchCart()
})
</script>
