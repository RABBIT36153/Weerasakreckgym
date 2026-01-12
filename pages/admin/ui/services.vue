<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการบริการ</h1>
      <p class="text-gray-400">จัดการข้อมูลบริการ 4 รายการในหน้าแรก</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <!-- Section Header -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">หัวข้อและคำอธิบายส่วน</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">หัวข้อ</label>
              <input 
                type="text" 
                v-model="servicesSettings.title"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="บริการของเรา"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">คำอธิบาย</label>
              <textarea 
                v-model="servicesSettings.subtitle"
                rows="2"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Services List -->
        <div class="space-y-6">
          <div 
            v-for="(service, index) in servicesSettings.items" 
            :key="index"
            class="card"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-white">บริการ {{ index + 1 }}</h2>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-gray-300 mb-2">รูปภาพไอคอน</label>
                <div class="space-y-3">
                  <div v-if="service.image" class="relative">
                    <div class="w-32 h-32 bg-white rounded-lg border border-dark-border p-2 flex items-center justify-center">
                      <img
                        :src="getImageUrl(service.image)"
                        alt="Service Icon"
                        class="w-full h-full object-contain"
                        @error="handleImageError"
                      />
                    </div>
                    <button
                      @click="removeServiceImage(index)"
                      class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <div v-else class="w-32 h-32 bg-dark-card rounded-lg border border-dark-border flex items-center justify-center text-gray-500">
                    <span class="text-sm">ไม่มีรูปภาพ</span>
                  </div>
                  <input
                    :ref="el => serviceImageInputs[index] = el"
                    type="file"
                    accept="image/*"
                    @change="handleServiceImageUpload($event, index)"
                    :disabled="uploadingImages[index]"
                    class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p class="text-sm text-gray-500">แนะนำ: ขนาด 200x200 px, รูปแบบ PNG/JPG</p>
                </div>
              </div>
              <div>
                <label class="block text-gray-300 mb-2">ชื่อบริการ</label>
                <input 
                  type="text" 
                  v-model="service.title"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="คอร์สเรียนมวยไทย"
                />
              </div>
              <div>
                <label class="block text-gray-300 mb-2">คำอธิบาย</label>
                <textarea 
                  v-model="service.description"
                  rows="3"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="คำอธิบายบริการ..."
                ></textarea>
              </div>
              <div>
                <label class="block text-gray-300 mb-2">ลิงก์</label>
                <input 
                  type="text" 
                  v-model="service.link"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="/courses"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">ตัวอย่าง</h2>
          <div class="bg-dark-bg rounded-lg p-4 border border-dark-border mb-4">
            <h3 class="text-lg font-bold text-white mb-2 text-center">{{ servicesSettings.title || 'บริการของเรา' }}</h3>
            <p class="text-sm text-gray-400 text-center mb-4">{{ servicesSettings.subtitle || 'คำอธิบาย' }}</p>
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="(service, index) in servicesSettings.items" 
                :key="index"
                class="bg-dark-surface rounded-lg p-3 border border-dark-border text-center"
              >
                <div v-if="service.image" class="mb-2 flex justify-center">
                  <div class="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
                    <img
                      :src="getImageUrl(service.image)"
                      alt="Service Icon"
                      class="w-full h-full object-contain"
                      @error="handleImageError"
                    />
                  </div>
                </div>
                <div v-else class="text-3xl mb-2">📦</div>
                <h4 class="text-xs font-bold text-white mb-1">{{ service.title || 'ชื่อบริการ' }}</h4>
                <p class="text-xs text-gray-400 line-clamp-2">{{ service.description || 'คำอธิบาย' }}</p>
              </div>
            </div>
          </div>
          <div v-if="error" class="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {{ error }}
          </div>
          <button 
            @click="saveServicesSettings"
            :disabled="saving"
            class="btn-primary w-full mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
          </button>
          <button 
            @click="resetServicesSettings"
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

const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const serviceImageInputs = ref([])
const uploadingImages = ref({})

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

// Get image URL
const getImageUrl = (url) => {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
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

const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src)
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

// Handle service image upload
const handleServiceImageUpload = async (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  uploadingImages.value[index] = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      console.log('Upload response:', response)
      console.log('Image URL:', response.url)
      servicesSettings.value.items[index].image = response.url
      console.log('Updated service image:', servicesSettings.value.items[index].image)
      console.log('Full image URL:', getImageUrl(response.url))
    }
  } catch (uploadError) {
    console.error('Error uploading service image:', uploadError)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (uploadError.data?.statusMessage || uploadError.message))
  } finally {
    uploadingImages.value[index] = false
  }
}

const removeServiceImage = (index) => {
  servicesSettings.value.items[index].image = ''
  if (serviceImageInputs.value[index]) {
    serviceImageInputs.value[index].value = ''
  }
}

// Fetch services settings from API
const fetchServicesSettings = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
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
    console.error('Error fetching services settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const saveServicesSettings = async () => {
  saving.value = true
  error.value = null
  
  try {
    // Ensure exactly 4 services
    if (servicesSettings.value.items.length !== 4) {
      error.value = 'ต้องมีบริการครบ 4 รายการ'
      saving.value = false
      return
    }
    
    const response = await $fetch(`${API_BASE_URL}/ui-settings/services`, {
      method: 'PUT',
      body: servicesSettings.value
    })
    
    if (response) {
      alert('บันทึกการตั้งค่าบริการสำเร็จ')
      await fetchServicesSettings()
    }
  } catch (err) {
    console.error('Error saving services settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    saving.value = false
  }
}

const resetServicesSettings = async () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    servicesSettings.value = {
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
    }
    await saveServicesSettings()
  }
}

// Load settings on mount
onMounted(() => {
  fetchServicesSettings()
})
</script>

