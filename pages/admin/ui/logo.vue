<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">Logo & Branding</h1>
      <p class="text-gray-400">จัดการโลโก้ของเว็บไซต์</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <!-- Desktop Logo -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">โลโก้สำหรับ PC</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">รูปภาพโลโก้ (Desktop)</label>
              <div class="space-y-3">
                <div v-if="brandingSettings.mainLogo" class="flex items-center space-x-4">
                  <div class="p-4 bg-white rounded-lg">
                    <img 
                      :src="getImageUrl(brandingSettings.mainLogo)" 
                      alt="Main Logo" 
                      class="h-20 object-contain"
                      @error="handleImageError"
                    />
                  </div>
                  <button 
                    @click="removeMainLogo"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    ลบ
                  </button>
                </div>
                <input
                  ref="mainLogoInput"
                  type="file"
                  accept="image/*"
                  @change="handleMainLogoUpload"
                  :disabled="uploadingMainLogo"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p class="text-sm text-gray-500">แนะนำ: PNG with transparent background, ขนาด 200x60 px</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Logo -->
        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">โลโก้สำหรับมือถือ</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">รูปภาพโลโก้ (Mobile)</label>
              <div class="space-y-3">
                <div v-if="brandingSettings.mobileLogo" class="flex items-center space-x-4">
                  <div class="p-4 bg-white rounded-lg">
                    <img 
                      :src="getImageUrl(brandingSettings.mobileLogo)" 
                      alt="Mobile Logo" 
                      class="h-16 object-contain"
                      @error="handleImageError"
                    />
                  </div>
                  <button 
                    @click="removeMobileLogo"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    ลบ
                  </button>
                </div>
                <input
                  ref="mobileLogoInput"
                  type="file"
                  accept="image/*"
                  @change="handleMobileLogoUpload"
                  :disabled="uploadingMobileLogo"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p class="text-sm text-gray-500">แนะนำ: PNG with transparent background, ขนาด 120x40 px</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">ตัวอย่าง</h2>
          <div class="space-y-4 mb-4">
            <div class="bg-white rounded-lg p-6">
              <h3 class="text-sm text-gray-600 mb-2 text-center">Desktop Logo</h3>
              <div v-if="brandingSettings.mainLogo" class="mb-4">
                <img 
                  :src="getImageUrl(brandingSettings.mainLogo)" 
                  alt="Logo Preview" 
                  class="h-12 object-contain mx-auto"
                  @error="handleImageError"
                />
              </div>
              <p v-else class="text-sm text-gray-400 text-center">ไม่มีโลโก้</p>
            </div>
            <div class="bg-white rounded-lg p-4">
              <h3 class="text-sm text-gray-600 mb-2 text-center">Mobile Logo</h3>
              <div v-if="brandingSettings.mobileLogo" class="mb-2">
                <img 
                  :src="getImageUrl(brandingSettings.mobileLogo)" 
                  alt="Mobile Logo Preview" 
                  class="h-10 object-contain mx-auto"
                  @error="handleImageError"
                />
              </div>
              <p v-else class="text-sm text-gray-400 text-center">ไม่มีโลโก้</p>
            </div>
          </div>
          <div v-if="error" class="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {{ error }}
          </div>
          <button 
            @click="saveBrandingSettings"
            :disabled="saving"
            class="btn-primary w-full mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
          </button>
          <button 
            @click="resetBrandingSettings"
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

const API_BASE_URL = 'http://localhost:4002/api'

const mainLogoInput = ref(null)
const mobileLogoInput = ref(null)
const uploadingMainLogo = ref(false)
const uploadingMobileLogo = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const brandingSettings = ref({
  mainLogo: '',
  mobileLogo: ''
})

// Fetch branding settings from API
const fetchBrandingSettings = async () => {
  loading.value = true
  error.value = null
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
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const getImageUrl = (url) => {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBMb2dvPC90ZXh0Pgo8L3N2Zz4='
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  if (url.startsWith('/uploads/')) {
    return `/api/uploads/${url.replace('/uploads/', '')}`
  }
  return `/api/uploads/${url}`
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBMb2dvPC90ZXh0Pgo8L3N2Zz4='
}

const handleMainLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadingMainLogo.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      brandingSettings.value.mainLogo = response.url
      console.log('Main logo uploaded:', response.url)
    } else {
      throw new Error('การอัพโหลดไม่สำเร็จ')
    }
  } catch (error) {
    console.error('Error uploading logo:', error)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (error.data?.statusMessage || error.message || 'Unknown error'))
  } finally {
    uploadingMainLogo.value = false
  }
}

const handleMobileLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadingMobileLogo.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      brandingSettings.value.mobileLogo = response.url
      console.log('Mobile logo uploaded:', response.url)
    } else {
      throw new Error('การอัพโหลดไม่สำเร็จ')
    }
  } catch (error) {
    console.error('Error uploading mobile logo:', error)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (error.data?.statusMessage || error.message || 'Unknown error'))
  } finally {
    uploadingMobileLogo.value = false
  }
}

const removeMainLogo = () => {
  brandingSettings.value.mainLogo = ''
  if (mainLogoInput.value) mainLogoInput.value.value = ''
}

const removeMobileLogo = () => {
  brandingSettings.value.mobileLogo = ''
  if (mobileLogoInput.value) mobileLogoInput.value.value = ''
}

const saveBrandingSettings = async () => {
  saving.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings/branding`, {
      method: 'PUT',
      body: {
        mainLogo: brandingSettings.value.mainLogo,
        mobileLogo: brandingSettings.value.mobileLogo
      }
    })
    
    if (response) {
      alert('บันทึกการตั้งค่า Logo สำเร็จ')
      await fetchBrandingSettings()
    }
  } catch (err) {
    console.error('Error saving branding settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    saving.value = false
  }
}

const resetBrandingSettings = async () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    brandingSettings.value = {
      mainLogo: '',
      mobileLogo: ''
    }
    await saveBrandingSettings()
  }
}

// Load settings on mount
onMounted(() => {
  fetchBrandingSettings()
})
</script>
