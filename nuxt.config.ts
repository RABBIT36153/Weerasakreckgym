export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  
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
    server: {
      allowedHosts: [
        'manie-asyndetic-mila.ngrok-free.dev',
        '.ngrok-free.dev',
        '.ngrok.io'
      ],
      hmr: {
        clientPort: 443,
        protocol: 'wss'
      }
    },
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
    minify: true
  },
  
  devServer: {
    port: 4000
  },
  
  app: {
    head: {
      title: 'Muay Thai Academy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' }
      ]
    }
  }
})

