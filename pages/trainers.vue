<template>
  <div class="py-12 px-4">
    <div class="container mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
        ครูมวยของเรา
      </h1>
      <p class="text-center text-gray-400 mb-12 text-lg">
        เลือกครูมวยที่เหมาะกับสไตล์การเรียนของคุณ
      </p>

      <!-- Filter Section -->
      <div class="mb-8 flex flex-wrap gap-4 justify-center">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="selectedFilter = filter"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-all duration-300',
            selectedFilter === filter
              ? 'bg-red-primary text-white'
              : 'bg-dark-card text-gray-300 hover:bg-dark-border'
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400 text-lg">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 text-lg">{{ error }}</p>
        <button @click="fetchTrainers" class="btn-primary mt-4">ลองอีกครั้ง</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && trainers.length === 0" class="text-center py-12">
        <p class="text-gray-400 text-lg">ยังไม่มีข้อมูลครูมวย</p>
      </div>

      <!-- Trainers Grid -->
      <div v-else-if="filteredTrainers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="trainer in filteredTrainers"
          :key="trainer._id || trainer.id"
          class="card hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
          @click="selectTrainer(trainer)"
        >
          <div class="text-center mb-4">
            <div class="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-red-primary">
              <img 
                :src="getImageUrl(trainer.image)" 
                :alt="trainer.name"
                class="w-full h-full object-cover"
                @error="handleImageError($event, trainer.name)"
              />
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">{{ trainer.name }}</h3>
            <p class="text-red-primary font-semibold mb-2">{{ trainer.title }}</p>
            <div class="flex items-center justify-center mb-4">
              <span class="text-yellow-400 mr-1">⭐</span>
              <span class="text-gray-300">{{ trainer.rating }}</span>
              <span class="text-gray-500 ml-2">({{ trainer.reviews }} รีวิว)</span>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-300 mb-2">ความเชี่ยวชาญ:</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in trainer.skills"
                :key="skill"
                class="px-3 py-1 bg-dark-surface rounded-full text-xs text-gray-400 border border-dark-border"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-300 mb-2">ประสบการณ์:</h4>
            <p class="text-gray-400 text-sm">{{ trainer.experience }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-300 mb-2">ค่าเรียน:</h4>
            <p class="text-red-primary font-bold text-lg">
              {{ typeof trainer.price === 'number' ? trainer.price.toLocaleString('th-TH') : trainer.price }} บาท/เดือน
            </p>
          </div>

          <button class="btn-primary w-full">
            เลือกครูมวยนี้
          </button>
        </div>
      </div>

      <!-- Trainer Detail Modal -->
      <div
        v-if="selectedTrainer"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        @click.self="selectedTrainer = null"
      >
        <div class="bg-dark-card rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-red-primary flex-shrink-0">
                <img 
                  :src="getImageUrl(selectedTrainer.image)" 
                  :alt="selectedTrainer.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError($event, selectedTrainer.name)"
                />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-white">{{ selectedTrainer.name }}</h2>
                <p class="text-red-primary font-semibold">{{ selectedTrainer.title }}</p>
              </div>
            </div>
            <button
              @click="selectedTrainer = null"
              class="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-bold text-white mb-3">เกี่ยวกับครูมวย</h3>
              <p class="text-gray-300 leading-relaxed">{{ selectedTrainer.bio }}</p>
            </div>

            <div>
              <h3 class="text-xl font-bold text-white mb-3">ความเชี่ยวชาญ</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in selectedTrainer.skills"
                  :key="skill"
                  class="px-4 py-2 bg-dark-surface rounded-lg text-gray-300 border border-dark-border"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-bold text-white mb-3">ประสบการณ์</h3>
              <p class="text-gray-300">{{ selectedTrainer.experience }}</p>
            </div>

            <div>
              <h3 class="text-xl font-bold text-white mb-3">ตารางเรียน</h3>
              <div class="bg-dark-surface rounded-lg p-4">
                <p class="text-gray-300">{{ formatSchedule(selectedTrainer) }}</p>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <div class="flex gap-4">
                <NuxtLink 
                  :to="`/hire-trainer?trainerId=${selectedTrainer._id || selectedTrainer.id}`" 
                  class="btn-primary flex-1 text-center" 
                  @click="selectedTrainer = null"
                >
                  จ้างงานครูมวยไปต่างประเทศ
                </NuxtLink>
                <button class="btn-secondary flex-1" @click="bookTrainer(selectedTrainer)">
                  จองเรียนกับครูมวยนี้
                </button>
              </div>
              <button class="btn-secondary w-full" @click="selectedTrainer = null">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const API_BASE_URL = 'http://localhost:4002/api'
const trainers = ref([])
const loading = ref(false)
const error = ref(null)
const selectedTrainer = ref(null)

const filters = ['ทั้งหมด', 'พื้นฐาน', 'ขั้นสูง', 'แข่งขัน', 'ป้องกันตัว', 'ฟิตเนส', 'ผู้เริ่มต้น']
const selectedFilter = ref('ทั้งหมด')

const weekDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']

// Fetch trainers from API
const fetchTrainers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/trainers?status=active`)
    trainers.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching trainers:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลครูมวย'
  } finally {
    loading.value = false
  }
}

// Format schedule from scheduleDays or schedule field
const formatSchedule = (trainer) => {
  if (trainer.scheduleDays && Array.isArray(trainer.scheduleDays)) {
    const enabledDays = trainer.scheduleDays
      .map((day, index) => {
        if (day.enabled && day.startTime && day.endTime) {
          return `${weekDays[index]} ${day.startTime}-${day.endTime}`
        }
        return null
      })
      .filter(day => day !== null)
    
    if (enabledDays.length > 0) {
      return enabledDays.join(', ')
    }
  }
  
  if (trainer.schedule) {
    return trainer.schedule
  }
  
  return 'ยังไม่ได้กำหนดตารางเรียน'
}

// Get image URL - handle both local uploads and external URLs
const getImageUrl = (url) => {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
  }
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
  return url
}

const handleImageError = (event, name = '') => {
  // Fallback to placeholder
  const placeholderText = name || 'Trainer'
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

const filteredTrainers = computed(() => {
  let result = trainers.value
  
  if (selectedFilter.value === 'ทั้งหมด') {
    return result
  }
  
  return result.filter(trainer => {
    if (!trainer.skills || !Array.isArray(trainer.skills)) {
      return false
    }
    return trainer.skills.some(skill => 
      skill.toLowerCase().includes(selectedFilter.value.toLowerCase())
    )
  })
})

const selectTrainer = (trainer) => {
  selectedTrainer.value = trainer
}

const bookTrainer = (trainer) => {
  const trainerId = trainer._id || trainer.id
  const trainerName = trainer.name
  const price = typeof trainer.price === 'number' ? trainer.price : parseInt(trainer.price.toString().replace(/,/g, ''))
  navigateTo(`/payment?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName)}&price=${price}`)
}

// Load trainers on mount
onMounted(() => {
  fetchTrainers()
})
</script>

