<template>
  <aside class="w-64 bg-dark-surface border-r border-dark-border min-h-screen sticky top-16">
    <nav class="p-4 space-y-2">
      <NuxtLink 
        to="/admin" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span>Dashboard</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/courses" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <span>คอร์สเรียน</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/trainers" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span>ครูมวย</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/users" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <span>ผู้ใช้</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/registrations" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>การลงทะเบียน</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/hire-requests" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        <span>คำขอจ้างงานครูมวย</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/memberships" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
        <span>แพ็คเกจสมาชิก</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/members" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <span>สมาชิก</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/admin/schedule" 
        class="admin-nav-link"
        active-class="bg-red-primary text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span>ตารางเรียน</span>
      </NuxtLink>

      <!-- Settings Menu with Submenu -->
      <div class="pt-2">
        <button 
          @click="toggleSettingsMenu"
          class="admin-nav-link w-full"
          :class="{ 'bg-red-primary/20 text-white': isSettingsOpen }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>จัดการ UI</span>
          <svg 
            class="w-4 h-4 ml-auto transition-transform duration-200"
            :class="{ 'rotate-180': isSettingsOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <!-- Submenu -->
        <div 
          v-show="isSettingsOpen"
          class="ml-4 mt-2 space-y-1 border-l-2 border-dark-border pl-4"
        >
          <NuxtLink 
            to="/admin/ui/header" 
            class="admin-submenu-link"
            active-class="text-red-primary border-red-primary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Header & Banner</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/admin/ui/logo" 
            class="admin-submenu-link"
            active-class="text-red-primary border-red-primary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Logo & Branding</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/admin/ui/contact" 
            class="admin-submenu-link"
            active-class="text-red-primary border-red-primary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>ข้อมูลติดต่อ</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/admin/ui/services" 
            class="admin-submenu-link"
            active-class="text-red-primary border-red-primary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span>บริการ</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/admin/ui/content" 
            class="admin-submenu-link"
            active-class="text-red-primary border-red-primary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>เนื้อหา</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'

const route = useRoute()
const isSettingsOpen = ref(false)

const toggleSettingsMenu = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

// Auto expand if current route is in UI settings
watch(() => route.path, (path) => {
  if (path.startsWith('/admin/ui')) {
    isSettingsOpen.value = true
  }
}, { immediate: true })
</script>

<style scoped>
.admin-nav-link {
  @apply flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-card hover:text-white transition-colors duration-200;
}

.admin-submenu-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-card transition-colors duration-200 border-l-2 border-transparent;
}
</style>

