export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  
  // SSR is enabled by default in Nuxt 3 (ssr: true)
  // This ensures Google Bot can see the content without waiting for JavaScript
  ssr: true,
  
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4002',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://weerasakreckgym.com' // ใส่ https และชื่อเว็บตรงนี้
    }
  },
  
  // หมายเหตุ: เราใช้ dynamic sitemap route (server/routes/sitemap.xml.ts) แทน module
  // เพราะ @nuxtjs/sitemap ไม่รองรับ Nuxt 3
  
  // CSS Optimization
  experimental: {
    payloadExtraction: false
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
    minify: true,
    routeRules: {
      '/sitemap.xml': { 
        headers: { 'Content-Type': 'application/xml' },
        prerender: false
      }
    }
  },
  
  devServer: {
    port: 4000
  },
  
  app: {
    head: {
      title: 'Weerasakreckgym - สอนมวยไทย ออกกำลังกายด้วยมวย | Muay Thai Academy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Weerasakreckgym โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย พัฒนาทักษะการต่อสู้และความแข็งแกร่ง คอร์สเรียนมวยไทย ครูมวยมืออาชีพ' },
        { name: 'keywords', content: 'weerasakreckgym, สอนมวยไทย, ออกกำลังกายด้วยมวย, เรียนมวยไทย, คอร์สมวยไทย, ครูมวย, มวยไทย, Muay Thai, Muay Thai Academy, โรงเรียนมวยไทย, ฟิตเนสมวยไทย' },
        { name: 'author', content: 'Weerasakreckgym' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Weerasakreckgym - สอนมวยไทย ออกกำลังกายด้วยมวย' },
        { property: 'og:description', content: 'โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย พัฒนาทักษะการต่อสู้และความแข็งแกร่ง' },
        { property: 'og:site_name', content: 'Weerasakreckgym' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Weerasakreckgym - สอนมวยไทย ออกกำลังกายด้วยมวย' },
        { name: 'twitter:description', content: 'โรงเรียนสอนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' }
      ]
    }
  }
})

