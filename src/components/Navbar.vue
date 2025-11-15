<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span class="text-2xl font-bold text-gray-800">Shoe Store</span>
        </router-link>

        <div class="flex items-center space-x-4">
          <router-link
            to="/"
            class="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </router-link>
          <CartIcon />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import CartIcon from './CartIcon.vue'
</script>
