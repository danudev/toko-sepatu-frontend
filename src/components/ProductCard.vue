<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <router-link :to="`/products/${product.slug}`">
      <div class="aspect-w-4 aspect-h-3 bg-gray-200">
        <img
          :src="product.image_url"
          :alt="product.name"
          class="w-full h-48 object-cover"
        />
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {{ product.name }}
        </h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">
          {{ product.description }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-blue-600">
            {{ formatPrice(product.price) }}
          </span>
          <span class="text-sm text-gray-500">
            Stock: {{ product.stock }}
          </span>
        </div>
      </div>
    </router-link>
    <div class="p-4 pt-0">
      <button
        @click="handleAddToCart"
        :disabled="loading || product.stock === 0"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Adding...</span>
        <span v-else-if="product.stock === 0">Out of Stock</span>
        <span v-else>Add to Cart</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useProductStore } from '@/stores/productStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const productStore = useProductStore()
const loading = ref(false)

const formatPrice = (price) => {
  return productStore.formatPrice(price)
}

const handleAddToCart = async () => {
  loading.value = true
  const result = await cartStore.addToCart(props.product.id, 1)
  loading.value = false

  if (result.success) {
    alert('Product added to cart!')
  } else {
    alert(result.message || 'Failed to add product to cart')
  }
}
</script>
