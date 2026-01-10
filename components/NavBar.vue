<template>
  <nav class="bg-dark-bg sticky top-0 z-50">
    <!-- Top Header -->
    <div class="bg-dark-bg border-b border-dark-border">
      <div class="container mx-auto px-4 py-3">
        <div class="grid grid-cols-3 items-center">
          <!-- Left Side (Empty) -->
          <div></div>
          
          <!-- Logo Center -->
          <div class="flex justify-center">
            <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
              <!-- Desktop Logo -->
              <img 
                v-if="brandingSettings.mainLogo"
                :src="getLogoUrl(brandingSettings.mainLogo)"
                alt="Muay Thai Academy"
                class="hidden md:block h-12 object-contain"
                @error="handleLogoError"
              />
              <!-- Mobile Logo -->
              <img 
                v-if="brandingSettings.mobileLogo"
                :src="getLogoUrl(brandingSettings.mobileLogo)"
                alt="Muay Thai Academy"
                class="block md:hidden h-10 object-contain"
                @error="handleLogoError"
              />
              <!-- Mobile Fallback to Desktop Logo if mobile logo doesn't exist -->
              <img 
                v-else-if="brandingSettings.mainLogo"
                :src="getLogoUrl(brandingSettings.mainLogo)"
                alt="Muay Thai Academy"
                class="block md:hidden h-10 object-contain"
                @error="handleLogoError"
              />
              <!-- Fallback Text (when no logos) -->
              <div v-if="!brandingSettings.mainLogo && !brandingSettings.mobileLogo" class="flex flex-col items-center">
                <span class="text-3xl font-bold text-white tracking-wider uppercase">Muay Thai</span>
                <span class="text-sm font-semibold text-white tracking-widest">Academy</span>
              </div>
            </NuxtLink>
          </div>
          
          <!-- Right Side Icons -->
          <div class="flex items-center justify-end space-x-5">
            <!-- Shopping Cart -->
            <button class="relative text-gold hover:text-gold-light transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span class="absolute -top-2 -right-2 bg-red-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
            </button>
            
            <!-- User Icon -->
            <button class="text-gold hover:text-gold-light transition-colors">
              <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
            
            <!-- Log In -->
            <button class="text-gold hover:text-gold-light transition-colors font-medium text-sm">
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <div class="bg-dark-surface border-b border-dark-border">
      <div class="container mx-auto px-4 py-3">
        <div class="grid grid-cols-3 items-center gap-4">
          <!-- Search Bar (Left) -->
          <div class="flex items-center max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              class="flex-1 bg-dark-bg border border-gray-600 text-white placeholder-gray-400 px-4 py-2 rounded-l focus:outline-none focus:border-gold transition-colors"
              v-model="searchQuery"
            />
            <button class="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-r transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>

          <!-- Menu Items (Center) -->
          <div class="hidden lg:flex items-center justify-center space-x-8">
            <NuxtLink to="/" class="nav-link" active-class="text-gold">หน้าแรก</NuxtLink>
            <NuxtLink to="/memberships" class="nav-link" active-class="text-gold">สมัครสมาชิก</NuxtLink>
            <NuxtLink to="/courses" class="nav-link" active-class="text-gold">คอร์สเรียน</NuxtLink>
            <NuxtLink to="/trainers" class="nav-link" active-class="text-gold">ครูมวย</NuxtLink>
            <NuxtLink to="/contact" class="nav-link" active-class="text-gold">ติดต่อเรา</NuxtLink>
          </div>

          <!-- Book Now Button (Right) -->
          <div class="flex items-center justify-end gap-4">
            <NuxtLink to="/courses" class="bg-red-primary hover:bg-red-hover text-white font-semibold px-6 py-2 rounded transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
              จองเลย
            </NuxtLink>
            
            <!-- Mobile Menu Button -->
            <button @click="toggleMobileMenu" class="lg:hidden text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-dark-surface border-b border-dark-border">
      <div class="container mx-auto px-4 py-4 space-y-2">
        <NuxtLink to="/" class="block nav-link py-2" active-class="text-gold" @click="mobileMenuOpen = false">หน้าแรก</NuxtLink>
        <NuxtLink to="/memberships" class="block nav-link py-2" active-class="text-gold" @click="mobileMenuOpen = false">สมัครสมาชิก</NuxtLink>
        <NuxtLink to="/courses" class="block nav-link py-2" active-class="text-gold" @click="mobileMenuOpen = false">คอร์สเรียน</NuxtLink>
        <NuxtLink to="/trainers" class="block nav-link py-2" active-class="text-gold" @click="mobileMenuOpen = false">ครูมวย</NuxtLink>
        <NuxtLink to="/contact" class="block nav-link py-2" active-class="text-gold" @click="mobileMenuOpen = false">ติดต่อเรา</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
const API_BASE_URL = 'http://localhost:4002/api'

const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const brandingSettings = ref({
  mainLogo: '',
  mobileLogo: ''
})

// Fetch branding settings from API
const fetchBrandingSettings = async () => {
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.branding) {
      brandingSettings.value = {
        mainLogo: response.branding.mainLogo || '',
        mobileLogo: response.branding.mobileLogo || ''
      }
    }
  } catch (err) {
    console.error('Error fetching branding settings:', err)
  }
}

// Get logo URL
const getLogoUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // For local uploads, use API server to serve static files
  if (url.startsWith('/uploads/')) {
    return `http://localhost:4002${url}`
  }
  // Handle paths without leading slash
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `http://localhost:4002${cleanPath}`
  }
  return `http://localhost:4002/${url}`
}

const handleLogoError = (event) => {
  // If logo fails to load, show fallback text
  event.target.style.display = 'none'
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Load branding settings on mount
onMounted(() => {
  fetchBrandingSettings()
})
</script>

<style scoped>
.nav-link {
  @apply text-white transition-colors duration-300 font-medium;
}

.nav-link:hover {
  color: #facc15; /* gold */
}
</style>

