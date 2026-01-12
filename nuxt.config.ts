export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  
  // Runtime Config - Environment Variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4002/api'
    }
  },
  
  // CSS Optimization
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false
  },
  
  // Build optimization
  build: {
    extractCSS: true
  },
  
  vite: {
    css: {
      devSourcemap: false
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  },
  
  nitro: {
    compressPublicAssets: true,
    minify: true,
    devServer: {
      port: 4001
    }
  },
  
  devServer: {
    port: 4001
  },
  
  app: {
    head: {
      title: 'Admin Panel - Muay Thai Academy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})

