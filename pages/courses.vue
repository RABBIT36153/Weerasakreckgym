<template>
  <div class="py-12 px-4">
    <div class="container mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
        คอร์สเรียนมวยไทย
      </h1>
      <p class="text-center text-gray-400 mb-12 text-lg">
        เลือกคอร์สที่เหมาะกับคุณ
      </p>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400 text-lg">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 text-lg">{{ error }}</p>
        <button @click="fetchCourses" class="btn-primary mt-4">ลองอีกครั้ง</button>
      </div>

      <!-- Courses Grid -->
      <div v-else-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="course in courses" 
          :key="course._id || course.id" 
          class="card hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105"
        >
          <div class="mb-4">
            <img 
              :src="getImageUrl(course.image)" 
              :alt="course.name"
              class="w-full h-64 object-contain rounded-lg bg-dark-surface"
              loading="lazy"
              @error="handleImageError($event)"
            />
          </div>
          <h3 class="text-2xl font-bold mb-3 text-white">{{ course.name }}</h3>
          <p class="text-gray-400 mb-4">{{ course.description }}</p>
          
          <div v-if="course.benefits && course.benefits.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-300 mb-2">สิ่งที่คุณจะได้:</h4>
            <ul class="space-y-1 text-sm text-gray-400">
              <li v-for="benefit in course.benefits" :key="benefit" class="flex items-center">
                <span class="text-red-primary mr-2">✓</span>
                {{ benefit }}
              </li>
            </ul>
          </div>

          <div class="border-t border-dark-border pt-4 mt-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold text-red-primary">{{ formatPrice(course.price) }} บาท</span>
              <span v-if="course.originalPrice && course.originalPrice > course.price" class="text-gray-400 line-through">{{ formatPrice(course.originalPrice) }} บาท</span>
            </div>
            <button 
              @click="selectCourse(course)" 
              class="btn-primary w-full"
            >
              เลือกคอร์สนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { public: { apiBaseUrl } } = useRuntimeConfig()
const API_BASE_URL = `${apiBaseUrl}/api`
const courses = ref([])
const loading = ref(false)
const error = ref(null)

// SEO Meta Tags
useHead({
  title: 'คอร์สเรียนมวยไทย - Weerasakreckgym | สอนมวยไทย ออกกำลังกายด้วยมวย',
  meta: [
    { name: 'description', content: 'คอร์สเรียนมวยไทยคุณภาพจาก Weerasakreckgym สอนมวยไทยโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย พัฒนาทักษะการต่อสู้ คอร์สพื้นฐาน ขั้นกลาง ขั้นสูง' },
    { name: 'keywords', content: 'weerasakreckgym, สอนมวยไทย, ออกกำลังกายด้วยมวย, คอร์สเรียนมวยไทย, เรียนมวยไทย, คอร์สมวยไทย, Muay Thai Course' },
    { property: 'og:title', content: 'คอร์สเรียนมวยไทย - Weerasakreckgym' },
    { property: 'og:description', content: 'คอร์สเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย' },
    { property: 'og:type', content: 'website' }
  ]
})

// Structured Data for Courses
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': 'คอร์สเรียนมวยไทย - Weerasakreckgym',
        'description': 'คอร์สเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ ออกกำลังกายด้วยมวยไทย',
        'provider': {
          '@type': 'Organization',
          'name': 'Weerasakreckgym',
          'alternateName': 'Muay Thai Academy'
        },
        'keywords': 'weerasakreckgym, สอนมวยไทย, ออกกำลังกายด้วยมวย, คอร์สเรียนมวยไทย'
      })
    }
  ]
})

// Fetch courses from API
const fetchCourses = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/courses?status=active`)
    courses.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching courses:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์สเรียน'
  } finally {
    loading.value = false
  }
}

// Format price with thousand separator
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('th-TH')
}

// Get image URL - handle both local uploads and external URLs
const getImageUrl = (url) => {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // For local uploads, use API server to serve static files
  if (url.startsWith('/uploads/')) {
    return `${apiBaseUrl}${url}`
  }
  // Handle paths without leading slash
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `${apiBaseUrl}${cleanPath}`
  }
  return url
}

const handleImageError = (event) => {
  // Fallback to placeholder
  const courseName = event.target.alt || 'Course'
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

const selectCourse = (course) => {
  const courseId = course._id || course.id
  const courseName = course.name
  const price = course.price
  navigateTo(`/payment?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}&price=${price}`)
}

// Load courses on mount
onMounted(() => {
  fetchCourses()
})
</script>

