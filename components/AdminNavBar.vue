<template>
  <nav class="bg-dark-surface border-b border-dark-border sticky top-0 z-50">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-white">Admin Panel</h1>
          <span class="text-gray-400">|</span>
          <span class="text-gray-300">Muay Thai Academy</span>
        </div>
        
        <div class="flex items-center space-x-4">
          <button class="text-gray-300 hover:text-gold transition-colors relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-primary ring-2 ring-dark-surface"></span>
          </button>
          
          <!-- Settings Dropdown -->
          <div class="relative" ref="settingsDropdown">
            <button 
              @click="toggleSettingsDropdown"
              class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-dark-card"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <svg 
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isSettingsOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="isSettingsOpen"
              class="absolute right-0 mt-2 w-56 bg-dark-surface border border-dark-border rounded-lg shadow-xl py-2 z-50"
            >
              <NuxtLink 
                to="/admin/settings/general"
                @click="closeDropdown"
                class="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-card hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>ตั้งค่าทั่วไป</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/admin/settings/profile"
                @click="closeDropdown"
                class="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-card hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>โปรไฟล์</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/admin/settings/security"
                @click="closeDropdown"
                class="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-card hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>ความปลอดภัย</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/admin/settings/notifications"
                @click="closeDropdown"
                class="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-card hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span>การแจ้งเตือน</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/admin/settings/theme"
                @click="closeDropdown"
                class="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-card hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
                <span>ธีมและสี</span>
              </NuxtLink>
              
              <hr class="my-2 border-dark-border">
              
              <NuxtLink 
                to="/admin/settings/system"
                @click="closeDropdown"
                class="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-card hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
                <span>ระบบ</span>
              </NuxtLink>
              
              <button 
                @click="handleLogout"
                class="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-card hover:text-red-primary transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-red-primary flex items-center justify-center text-white font-bold">
              A
            </div>
            <span class="text-gray-300">Admin</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isSettingsOpen = ref(false)
const settingsDropdown = ref(null)

const toggleSettingsDropdown = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

const closeDropdown = () => {
  isSettingsOpen.value = false
}

const handleLogout = () => {
  closeDropdown()
  // Add logout logic here
  console.log('Logging out...')
  // navigateTo('/login')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (settingsDropdown.value && !settingsDropdown.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

