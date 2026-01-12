<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">Header & Banner</h1>
      <p class="text-gray-400">จัดการรูปภาพ header และ banner ของเว็บไซต์</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <!-- Main Header Banner -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">Header Banner หลัก</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">รูปภาพ Header</label>
              <div class="space-y-3">
                <div v-if="headerSettings.bannerImage" class="relative">
                  <img 
                    :src="getImageUrl(headerSettings.bannerImage)" 
                    alt="Header Banner" 
                    class="w-full h-64 object-cover rounded-lg border border-dark-border"
                    @error="handleImageError"
                  />
                  <button 
                    @click="removeBannerImage"
                    class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <input
                  ref="bannerInput"
                  type="file"
                  accept="image/*"
                  @change="handleBannerUpload"
                  :disabled="uploadingBanner"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p class="text-sm text-gray-500">แนะนำ: ขนาด 1920x600 px, รูปแบบ JPG/PNG</p>
              </div>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ข้อความ Header</label>
              <input 
                type="text" 
                v-model="headerSettings.headerText"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="ยินดีต้อนรับสู่ Muay Thai Academy"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ข้อความย่อย</label>
              <textarea 
                v-model="headerSettings.subText"
                rows="3"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Mobile Header -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">Header สำหรับมือถือ</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">รูปภาพ Header (Mobile)</label>
              <div class="space-y-3">
                <div v-if="headerSettings.mobileBannerImage" class="relative">
                  <img 
                    :src="getImageUrl(headerSettings.mobileBannerImage)" 
                    alt="Mobile Header Banner" 
                    class="w-full h-48 object-cover rounded-lg border border-dark-border"
                    @error="handleImageError"
                  />
                  <button 
                    @click="removeMobileBannerImage"
                    class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <input
                  ref="mobileBannerInput"
                  type="file"
                  accept="image/*"
                  @change="handleMobileBannerUpload"
                  :disabled="uploadingMobileBanner"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p class="text-sm text-gray-500">แนะนำ: ขนาด 768x400 px, รูปแบบ JPG/PNG</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Background Settings -->
        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">การตั้งค่าเพิ่มเติม</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">สี Overlay</label>
              <div class="flex items-center space-x-4">
                <input 
                  type="color" 
                  v-model="headerSettings.overlayColor"
                  class="w-16 h-10 rounded border border-dark-border"
                />
                <input 
                  type="text" 
                  v-model="headerSettings.overlayColor"
                  class="flex-1 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ความโปร่งใส Overlay (%)</label>
              <input 
                type="range" 
                v-model="headerSettings.overlayOpacity"
                min="0"
                max="100"
                class="w-full"
              />
              <p class="text-sm text-gray-500 text-center">{{ headerSettings.overlayOpacity }}%</p>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">แสดง Overlay</label>
                <p class="text-sm text-gray-500">เพิ่มเลเยอร์สีทับบนรูปภาพ</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="headerSettings.showOverlay" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">ตัวอย่าง</h2>
          <div class="bg-dark-bg rounded-lg p-4 border border-dark-border mb-4">
            <div 
              class="relative h-48 rounded-lg overflow-hidden"
              :style="{
                backgroundImage: headerSettings.bannerImage ? `url(${getImageUrl(headerSettings.bannerImage)})` : 'none',
                backgroundColor: headerSettings.bannerImage ? 'transparent' : '#1a1a1a',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }"
            >
              <div 
                v-if="headerSettings.showOverlay"
                :style="{
                  backgroundColor: headerSettings.overlayColor,
                  opacity: headerSettings.overlayOpacity / 100
                }"
                class="absolute inset-0"
              ></div>
              <div class="relative z-10 p-4 h-full flex flex-col justify-center text-white text-center">
                <h3 class="text-2xl font-bold mb-2">{{ headerSettings.headerText || 'ข้อความ Header' }}</h3>
                <p class="text-sm">{{ headerSettings.subText || 'ข้อความย่อย' }}</p>
              </div>
            </div>
          </div>
          <div v-if="error" class="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {{ error }}
          </div>
          <button 
            @click="saveHeaderSettings"
            :disabled="saving"
            class="btn-primary w-full mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
          </button>
          <button 
            @click="resetHeaderSettings"
            class="btn-secondary w-full"
          >
            รีเซ็ต
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBaseUrl

const bannerInput = ref(null)
const mobileBannerInput = ref(null)
const uploadingBanner = ref(false)
const uploadingMobileBanner = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const headerSettings = ref({
  bannerImage: '',
  mobileBannerImage: '',
  headerText: 'ยินดีต้อนรับสู่ Muay Thai Academy',
  subText: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน',
  overlayColor: '#000000',
  overlayOpacity: 40,
  showOverlay: true
})

// Fetch header settings from API
const fetchHeaderSettings = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.header) {
      headerSettings.value = {
        bannerImage: response.header.bannerImage || '',
        mobileBannerImage: response.header.mobileBannerImage || '',
        headerText: response.header.headerText || 'ยินดีต้อนรับสู่ Muay Thai Academy',
        subText: response.header.subText || 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน',
        overlayColor: response.header.overlayColor || '#000000',
        overlayOpacity: response.header.overlayOpacity || 40,
        showOverlay: response.header.showOverlay !== undefined ? response.header.showOverlay : true
      }
    }
  } catch (err) {
    console.error('Error fetching header settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
    // Don't show alert on first load if settings don't exist yet
  } finally {
    loading.value = false
  }
}

const getImageUrl = (url) => {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
  }
  
  // If it's already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If it starts with /uploads/, remove the leading /uploads and prepend /api/uploads
  if (url.startsWith('/uploads/')) {
    const pathWithoutUploads = url.replace('/uploads/', '')
    return `/api/uploads/${pathWithoutUploads}`
  }
  
  // If it includes uploads/ but doesn't start with /uploads/, clean it up
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url.slice(1) : url
    const pathWithoutUploads = cleanPath.replace(/^uploads\//, '')
    return `/api/uploads/${pathWithoutUploads}`
  }
  
  // If it starts with /, use API endpoint
  if (url.startsWith('/')) {
    return `/api/uploads${url}`
  }
  
  // Otherwise, prepend /api/uploads/
  return `/api/uploads/${url}`
}

const handleBannerUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadingBanner.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      headerSettings.value.bannerImage = response.url
      console.log('Banner image uploaded:', response.url)
      console.log('Full image URL:', getImageUrl(response.url))
    } else {
      throw new Error('การอัพโหลดไม่สำเร็จ')
    }
  } catch (error) {
    console.error('Error uploading banner:', error)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (error.data?.statusMessage || error.message || 'Unknown error'))
  } finally {
    uploadingBanner.value = false
  }
}

const handleMobileBannerUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadingMobileBanner.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      headerSettings.value.mobileBannerImage = response.url
      console.log('Mobile banner image uploaded:', response.url)
      console.log('Full image URL:', getImageUrl(response.url))
    } else {
      throw new Error('การอัพโหลดไม่สำเร็จ')
    }
  } catch (error) {
    console.error('Error uploading mobile banner:', error)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (error.data?.statusMessage || error.message || 'Unknown error'))
  } finally {
    uploadingMobileBanner.value = false
  }
}

const removeBannerImage = () => {
  headerSettings.value.bannerImage = ''
  if (bannerInput.value) bannerInput.value.value = ''
}

const removeMobileBannerImage = () => {
  headerSettings.value.mobileBannerImage = ''
  if (mobileBannerInput.value) mobileBannerInput.value.value = ''
}

const handleImageError = (event) => {
  console.error('Image load error:', event.target.src)
  // Set placeholder image on error
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

const saveHeaderSettings = async () => {
  saving.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings/header`, {
      method: 'PUT',
      body: headerSettings.value
    })
    
    if (response) {
      alert('บันทึกการตั้งค่า Header สำเร็จ')
      // Optionally refresh the settings
      await fetchHeaderSettings()
    }
  } catch (err) {
    console.error('Error saving header settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    saving.value = false
  }
}

const resetHeaderSettings = async () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    headerSettings.value = {
      bannerImage: '',
      mobileBannerImage: '',
      headerText: 'ยินดีต้อนรับสู่ Muay Thai Academy',
      subText: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน',
      overlayColor: '#000000',
      overlayOpacity: 40,
      showOverlay: true
    }
    // Save reset values to API
    await saveHeaderSettings()
  }
}

// Load settings on mount
onMounted(() => {
  fetchHeaderSettings()
})
</script>

