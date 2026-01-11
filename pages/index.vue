<template>
  <div>
    <!-- Hero Section -->
    <section 
      class="relative py-20 px-4 min-h-[500px] flex items-center"
      :style="{
        backgroundImage: getCurrentBannerImage() ? `url(${getHeaderImageUrl(getCurrentBannerImage())})` : 'none',
        backgroundColor: getCurrentBannerImage() ? 'transparent' : '#1a1a1a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <!-- Overlay -->
      <div 
        v-if="headerSettings.showOverlay && getCurrentBannerImage()"
        class="absolute inset-0"
        :style="{
          backgroundColor: headerSettings.overlayColor || '#000000',
          opacity: (headerSettings.overlayOpacity || 40) / 100
        }"
      ></div>
      
      <!-- Content -->
      <div class="container mx-auto text-center relative z-10">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-white">
          {{ headerSettings.headerText || 'ยินดีต้อนรับสู่ Muay Thai Academy' }}
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {{ headerSettings.subText || 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน พัฒนาทักษะการต่อสู้และความแข็งแกร่งของคุณ' }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/courses" class="btn-primary text-lg">
            ดูคอร์สเรียน
          </NuxtLink>
          <NuxtLink to="/trainers" class="btn-secondary text-lg">
            ดูครูมวย
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-20 px-4 bg-dark-surface">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">
            {{ servicesSettings.title || 'บริการของเรา' }}
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            {{ servicesSettings.subtitle || 'เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท' }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="(service, index) in servicesSettings.items" 
            :key="index"
            class="card text-center hover:border-red-primary transition-all duration-300 hover:transform hover:scale-105 group"
          >
            <div class="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
              <div v-if="service.image" class="w-24 h-24 rounded-lg overflow-hidden bg-white p-2">
                <img
                  :src="getServiceImageUrl(service.image)"
                  :alt="service.title"
                  class="w-full h-full object-contain"
                  @error="handleServiceImageError"
                />
              </div>
              <div v-else class="text-6xl">📦</div>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-red-primary transition-colors">
              {{ service.title || 'บริการ' }}
            </h3>
            <p class="text-gray-400 leading-relaxed">
              {{ service.description || 'คำอธิบายบริการ' }}
            </p>
            <div v-if="service.link" class="mt-4">
              <NuxtLink 
                :to="service.link" 
                class="text-red-primary hover:text-red-hover font-medium transition-colors"
              >
                ดูเพิ่มเติม →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Courses Preview -->
    <section class="py-20 px-4">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-center mb-12 text-white">
          คอร์สยอดนิยม
        </h2>
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
        </div>
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-400">{{ error }}</p>
        </div>
        <div v-else-if="popularCourses.length === 0" class="text-center py-12">
          <p class="text-gray-400">ยังไม่มีคอร์สยอดนิยม</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="course in popularCourses" :key="course._id || course.id" class="card hover:border-red-primary transition-all duration-300">
            <div class="mb-4">
              <img 
                :src="getImageUrl(course.image)" 
                :alt="course.name"
                class="w-full h-40 object-cover rounded-lg"
                @error="handleImageError($event)"
              />
            </div>
            <h3 class="text-xl font-bold mb-2 text-white">{{ course.name }}</h3>
            <p class="text-gray-400 mb-4">{{ course.description }}</p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-red-primary">{{ formatPrice(course.price) }} บาท</span>
                <span v-if="course.originalPrice && course.originalPrice > course.price" class="text-gray-400 line-through ml-2 text-sm">{{ formatPrice(course.originalPrice) }} บาท</span>
              </div>
              <NuxtLink :to="`/courses`" class="btn-primary text-sm">
                ดูรายละเอียด
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section 
      v-if="contentSettings.enabled && (contentSettings.title || (contentSettings.items && contentSettings.items.length > 0))"
      class="py-20 bg-dark-surface"
    >
      <div class="container mx-auto">
        <div v-if="contentSettings.title" class="text-center mb-12 px-4">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">
            {{ contentSettings.title }}
          </h2>
        </div>
        <div v-if="contentSettings.items && contentSettings.items.length > 0" class="space-y-0">
          <div 
            v-for="(item, index) in sortedContentItems" 
            :key="index"
            class="content-item"
          >
            <!-- Text Content -->
            <div 
              v-if="item.type === 'text' && item.content"
              class="prose prose-invert max-w-none text-gray-300 px-4 max-w-4xl mx-auto py-8"
              v-html="item.content"
            ></div>
            
            <!-- Image Content -->
            <div 
              v-else-if="item.type === 'image' && item.content"
              class="w-full"
              style="padding: 20px 10%;"
            >
              <img
                :src="getContentImageUrl(item.content)"
                alt="Content Image"
                class="w-full h-auto object-cover rounded-lg border-4 border-dark-border shadow-2xl"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { public: { apiBaseUrl } } = useRuntimeConfig()
const API_BASE_URL = `${apiBaseUrl}/api`
const popularCourses = ref([])
const loading = ref(false)
const error = ref(null)
const headerSettings = ref({
  bannerImage: '',
  mobileBannerImage: '',
  headerText: 'ยินดีต้อนรับสู่ Muay Thai Academy',
  subText: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน พัฒนาทักษะการต่อสู้และความแข็งแกร่งของคุณ',
  overlayColor: '#000000',
  overlayOpacity: 40,
  showOverlay: true
})
const loadingHeader = ref(false)

const servicesSettings = ref({
  title: 'บริการของเรา',
  subtitle: 'เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท',
  items: [
    {
      image: '',
      title: 'คอร์สเรียนมวยไทย',
      description: 'เรียนมวยไทยกับครูมวยมืออาชีพ พัฒนาทักษะการต่อสู้ตั้งแต่พื้นฐานไปจนถึงขั้นสูง',
      link: '/courses'
    },
    {
      image: '',
      title: 'ครูมวยมืออาชีพ',
      description: 'เรียนแบบตัวต่อตัวหรือกลุ่มเล็กกับครูมวยที่ผ่านการฝึกอบรมและมีประสบการณ์',
      link: '/trainers'
    },
    {
      image: '',
      title: 'จ้างครูมวยไปต่างประเทศ',
      description: 'บริการจัดหาครูมวยมืออาชีพเพื่อไปสอนยังต่างประเทศ พร้อมดูแลเรื่องเอกสารและวีซ่า',
      link: '/hire-trainer'
    },
    {
      image: '',
      title: 'สมาชิกรายเดือน',
      description: 'แพ็คเกจสมาชิกรายเดือนที่คุ้มค่า เข้าคลาสได้ไม่จำกัด พร้อมสิทธิพิเศษต่างๆ',
      link: '/memberships'
    }
  ]
})

const contentSettings = ref({
  enabled: false,
  title: '',
  items: []
})

// Sort content items by order
const sortedContentItems = computed(() => {
  if (!contentSettings.value.items || !Array.isArray(contentSettings.value.items)) {
    return []
  }
  return [...contentSettings.value.items].sort((a, b) => (a.order || 0) - (b.order || 0))
})

// Fetch header settings from API
const fetchHeaderSettings = async () => {
  loadingHeader.value = true
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.header) {
      headerSettings.value = {
        bannerImage: response.header.bannerImage || '',
        mobileBannerImage: response.header.mobileBannerImage || '',
        headerText: response.header.headerText || 'ยินดีต้อนรับสู่ Muay Thai Academy',
        subText: response.header.subText || 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน พัฒนาทักษะการต่อสู้และความแข็งแกร่งของคุณ',
        overlayColor: response.header.overlayColor || '#000000',
        overlayOpacity: response.header.overlayOpacity || 40,
        showOverlay: response.header.showOverlay !== undefined ? response.header.showOverlay : true
      }
    }
    // Fetch services settings
    if (response && response.services) {
      servicesSettings.value = {
        title: response.services.title || 'บริการของเรา',
        subtitle: response.services.subtitle || 'เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท',
        items: response.services.items && response.services.items.length === 4 
          ? response.services.items.map(item => ({
              image: item.image || item.icon || '', // Support both image and icon for backward compatibility
              title: item.title || '',
              description: item.description || '',
              link: item.link || ''
            }))
          : servicesSettings.value.items // Keep default if not exactly 4
      }
    }
  } catch (err) {
    console.error('Error fetching header settings:', err)
    // Use default values if API fails
  } finally {
    loadingHeader.value = false
  }
}

// Get current banner image based on screen size
const getCurrentBannerImage = () => {
  if (process.client && window.innerWidth < 768 && headerSettings.value.mobileBannerImage) {
    return headerSettings.value.mobileBannerImage
  }
  return headerSettings.value.bannerImage
}

// Get header image URL
const getHeaderImageUrl = (url) => {
  if (!url) return ''
  return getImageUrl(url)
}

// Fetch popular courses from API
const fetchPopularCourses = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/courses/popular`)
    popularCourses.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching popular courses:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์สยอดนิยม'
    popularCourses.value = []
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
  // Fallback to placeholder if image not found
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

// Get service image URL
const getServiceImageUrl = (url) => {
  if (!url) return ''
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

const handleServiceImageError = (event) => {
  // Fallback to placeholder if image not found
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

// Get content image URL
const getContentImageUrl = (url) => {
  if (!url) return ''
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

// Fetch content settings from API
const fetchContentSettings = async () => {
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.content) {
      // Support both new format (items array) and legacy format (single content)
      if (response.content.items && Array.isArray(response.content.items) && response.content.items.length > 0) {
        contentSettings.value = {
          enabled: response.content.enabled !== undefined ? response.content.enabled : false,
          title: response.content.title || '',
          items: response.content.items
        }
      } else if (response.content.content) {
        // Legacy format - convert to new format
        contentSettings.value = {
          enabled: response.content.enabled !== undefined ? response.content.enabled : false,
          title: response.content.title || '',
          items: [{ type: 'text', content: response.content.content, order: 0 }]
        }
      } else {
        // Empty content
        contentSettings.value = {
          enabled: response.content.enabled !== undefined ? response.content.enabled : false,
          title: response.content.title || '',
          items: []
        }
      }
    }
  } catch (err) {
    console.error('Error fetching content settings:', err)
    // Use default values if API fails
  }
}

// Load data on mount
onMounted(() => {
  fetchHeaderSettings()
  fetchPopularCourses()
  fetchContentSettings()
})
</script>

<style scoped>
/* Prose styling for content section */
.prose {
  color: #d1d5db;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #ffffff;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose h1 {
  font-size: 2.25em;
}

.prose h2 {
  font-size: 1.875em;
}

.prose h3 {
  font-size: 1.5em;
}

.prose p {
  margin-bottom: 1.25em;
  line-height: 1.75;
}

.prose ul,
.prose ol {
  margin-left: 1.5em;
  margin-bottom: 1.25em;
}

.prose li {
  margin-bottom: 0.5em;
}

.prose strong {
  font-weight: 700;
  color: #ffffff;
}

.prose em {
  font-style: italic;
}

.prose u {
  text-decoration: underline;
}

.prose a {
  color: #dc2626;
  text-decoration: underline;
}

.prose a:hover {
  color: #ef4444;
}

.prose blockquote {
  border-left: 4px solid #dc2626;
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
  color: #9ca3af;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

/* Content section image full width */
.content-item img {
  width: 100%;
  height: auto;
  display: block;
  border: 4px solid #333333;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>

