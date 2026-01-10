<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">แกลเลอรีรูปภาพ</h1>
      <p class="text-gray-400">จัดการรูปภาพในแกลเลอรี</p>
    </div>

    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white">รูปภาพทั้งหมด</h2>
        <button @click="showUploadModal = true" class="btn-primary">
          เพิ่มรูปภาพ
        </button>
      </div>

      <div v-if="galleryImages.length === 0" class="text-center py-12">
        <p class="text-gray-400">ยังไม่มีรูปภาพ</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="(image, index) in galleryImages" 
          :key="index"
          class="relative group"
        >
          <img 
            :src="getImageUrl(image.url)" 
            :alt="image.title || 'Gallery Image'"
            class="w-full h-48 object-cover rounded-lg border border-dark-border"
          />
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
            <button 
              @click="editImage(index)"
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button 
              @click="deleteImage(index)"
              class="p-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          <div class="mt-2">
            <p class="text-white text-sm truncate">{{ image.title || 'ไม่มีชื่อ' }}</p>
            <p class="text-gray-400 text-xs">{{ image.category || 'ทั่วไป' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-dark-card rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">เพิ่มรูปภาพ</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-300 mb-2">เลือกรูปภาพ</label>
            <input
              ref="uploadInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              :disabled="uploading"
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50"
            />
          </div>
          <div>
            <label class="block text-gray-300 mb-2">ชื่อรูปภาพ</label>
            <input 
              type="text" 
              v-model="newImage.title"
              class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              placeholder="ชื่อรูปภาพ"
            />
          </div>
          <div>
            <label class="block text-gray-300 mb-2">หมวดหมู่</label>
            <input 
              type="text" 
              v-model="newImage.category"
              class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              placeholder="เช่น กิจกรรม, คอร์สเรียน, ครูมวย"
            />
          </div>
          <div class="flex space-x-3">
            <button 
              @click="saveImage"
              :disabled="!newImage.url || uploading"
              class="btn-primary flex-1"
            >
              {{ uploading ? 'กำลังอัพโหลด...' : 'บันทึก' }}
            </button>
            <button 
              @click="closeUploadModal"
              class="btn-secondary flex-1"
            >
              ยกเลิก
            </button>
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

const showUploadModal = ref(false)
const uploadInput = ref(null)
const uploading = ref(false)

const newImage = ref({
  url: '',
  title: '',
  category: ''
})

const galleryImages = ref([
  // { url: '/uploads/image/example.jpg', title: 'ตัวอย่าง', category: 'กิจกรรม' }
])

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/')) return `/api/uploads${url}`
  return `/api/uploads/${url}`
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    const response = await $fetch('/api/upload', { method: 'POST', body: formData })
    if (response.success) {
      newImage.value.url = response.url
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ')
  } finally {
    uploading.value = false
  }
}

const saveImage = () => {
  if (!newImage.value.url) return
  galleryImages.value.push({ ...newImage.value })
  closeUploadModal()
}

const closeUploadModal = () => {
  showUploadModal.value = false
  newImage.value = { url: '', title: '', category: '' }
  if (uploadInput.value) uploadInput.value.value = ''
}

const editImage = (index) => {
  newImage.value = { ...galleryImages.value[index] }
  showUploadModal.value = true
}

const deleteImage = (index) => {
  if (confirm('คุณต้องการลบรูปภาพนี้หรือไม่?')) {
    galleryImages.value.splice(index, 1)
  }
}
</script>

