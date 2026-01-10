<template>
  <div>
    <h1 class="text-3xl font-bold text-white mb-6">Dashboard</h1>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">คอร์สเรียนทั้งหมด</p>
            <p class="text-3xl font-bold text-white">{{ stats.totalCourses }}</p>
          </div>
          <div class="w-12 h-12 bg-red-primary/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">ครูมวยทั้งหมด</p>
            <p class="text-3xl font-bold text-white">{{ stats.totalTrainers }}</p>
          </div>
          <div class="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">ผู้ใช้ทั้งหมด</p>
            <p class="text-3xl font-bold text-white">{{ stats.totalUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm mb-1">การลงทะเบียน</p>
            <p class="text-3xl font-bold text-white">{{ stats.totalRegistrations }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-xl font-bold text-white mb-4">การลงทะเบียนล่าสุด</h2>
        <div class="space-y-3">
          <div v-for="reg in recentRegistrations" :key="reg.id" class="flex items-center justify-between p-3 bg-dark-surface rounded-lg">
            <div>
              <p class="text-white font-medium">{{ reg.userName }}</p>
              <p class="text-gray-400 text-sm">{{ reg.courseName }}</p>
            </div>
            <span class="text-gray-400 text-sm">{{ reg.date }}</span>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-xl font-bold text-white mb-4">คอร์สยอดนิยม</h2>
        <div class="space-y-3">
          <div v-for="course in popularCourses" :key="course.id" class="flex items-center justify-between p-3 bg-dark-surface rounded-lg">
            <div>
              <p class="text-white font-medium">{{ course.name }}</p>
              <p class="text-gray-400 text-sm">{{ course.students }} นักเรียน</p>
            </div>
            <span class="text-red-primary font-bold">{{ course.revenue }} บาท</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const stats = ref({
  totalCourses: 6,
  totalTrainers: 6,
  totalUsers: 45,
  totalRegistrations: 128
})

const recentRegistrations = ref([
  { id: 1, userName: 'สมชาย ใจดี', courseName: 'คอร์สพื้นฐาน', date: '26/12/2024' },
  { id: 2, userName: 'สมหญิง แข็งแรง', courseName: 'คอร์สผู้หญิง', date: '26/12/2024' },
  { id: 3, userName: 'วิชัย เร็วแรง', courseName: 'คอร์สขั้นสูง', date: '25/12/2024' },
  { id: 4, userName: 'ประยุทธ์ มั่นคง', courseName: 'คอร์สเด็ก', date: '25/12/2024' }
])

const popularCourses = ref([
  { id: 1, name: 'คอร์สพื้นฐาน', students: 32, revenue: '95,680' },
  { id: 2, name: 'คอร์สผู้หญิง', students: 28, revenue: '111,720' },
  { id: 3, name: 'คอร์สขั้นสูง', students: 15, revenue: '119,850' }
])
</script>

