<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">สไลด์โชว์</h1>
      <p class="text-gray-400">จัดการสไลด์โชว์ในหน้าแรก</p>
    </div>

    <div class="card mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white">สไลด์ทั้งหมด</h2>
        <button @click="showSlideModal = true" class="btn-primary">
          เพิ่มสไลด์
        </button>
      </div>

      <div v-if="slides.length === 0" class="text-center py-12">
        <p class="text-gray-400">ยังไม่มีสไลด์</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="flex items-center space-x-4 p-4 bg-dark-surface rounded-lg border border-dark-border"
        >
          <div class="flex-shrink-0">
            <img 
              :src="getImageUrl(slide.image)" 
              :alt="slide.title"
              class="w-32 h-20 object-cover rounded-lg border border-dark-border"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-white font-semibold mb-1">{{ slide.title || 'ไม่มีชื่อ' }}</h3>
            <p class="text-gray-400 text-sm mb-1">{{ slide.subtitle || '-' }}</p>
            <p class="text-gray-500 text-xs">ลำดับ: {{ slide.order }} | 
              <span :class="slide.active ? 'text-green-400' : 'text-gray-500'">
                {{ slide.active ? 'แสดง' : 'ซ่อน' }}
              </span>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="moveSlide(index, 'up')"
              :disabled="index === 0"
              class="p-2 bg-dark-card text-white rounded hover:bg-dark-border disabled:opacity-50"
            >
              ↑
            </button>
            <button 
              @click="moveSlide(index, 'down')"
              :disabled="index === slides.length - 1"
              class="p-2 bg-dark-card text-white rounded hover:bg-dark-border disabled:opacity-50"
            >
              ↓
            </button>
            <button 
              @click="editSlide(index)"
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              แก้ไข
            </button>
            <button 
              @click="deleteSlide(index)"
              class="p-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide Modal -->
    <div v-if="showSlideModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-dark-card rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white mb-4">{{ editingSlideIndex !== null ? 'แก้ไข' : 'เพิ่ม' }}สไลด์</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-300 mb-2">รูปภาพ</label>
            <div v-if="currentSlide.image" class="mb-2">
              <img 
                :src="getImageUrl(currentSlide.image)" 
                alt="Preview"
                class="w-full h-48 object-cover rounded-lg border border-dark-border"
              />
              <button @click="removeSlideImage" class="mt-2 text-red-400 text-sm">ลบรูปภาพ</button>
            </div>
            <input
              ref="slideImageInput"
              type="file"
              accept="image/*"
              @change="handleSlideImageUpload"
              :disabled="uploadingSlide"
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50"
            />
          </div>
          <div>
            <label class="block text-gray-300 mb-2">หัวข้อ</label>
            <input 
              type="text" 
              v-model="currentSlide.title"
              class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              placeholder="หัวข้อสไลด์"
            />
          </div>
          <div>
            <label class="block text-gray-300 mb-2">ข้อความย่อย</label>
            <textarea 
              v-model="currentSlide.subtitle"
              rows="2"
              class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              placeholder="ข้อความย่อย"
            ></textarea>
          </div>
          <div>
            <label class="block text-gray-300 mb-2">ลิงก์</label>
            <input 
              type="text" 
              v-model="currentSlide.link"
              class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              placeholder="/link หรือ URL"
            />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-gray-300 mb-2">ลำดับ</label>
              <input 
                type="number" 
                v-model.number="currentSlide.order"
                min="1"
                class="w-24 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              />
            </div>
            <div class="flex items-center space-x-2">
              <label class="flex items-center space-x-2 text-gray-300">
                <input 
                  type="checkbox" 
                  v-model="currentSlide.active"
                  class="w-4 h-4 rounded border-dark-border bg-dark-card text-red-primary focus:ring-red-primary"
                />
                <span>แสดงสไลด์</span>
              </label>
            </div>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="saveSlide"
              :disabled="!currentSlide.image || uploadingSlide"
              class="btn-primary flex-1"
            >
              {{ uploadingSlide ? 'กำลังอัพโหลด...' : 'บันทึก' }}
            </button>
            <button 
              @click="closeSlideModal"
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

const showSlideModal = ref(false)
const slideImageInput = ref(null)
const uploadingSlide = ref(false)
const editingSlideIndex = ref(null)

const currentSlide = ref({
  image: '',
  title: '',
  subtitle: '',
  link: '',
  order: 1,
  active: true
})

const slides = ref([
  // { image: '/uploads/image/slide1.jpg', title: 'สไลด์ 1', subtitle: 'ข้อความ', link: '/courses', order: 1, active: true }
])

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/')) return `/api/uploads${url}`
  return `/api/uploads/${url}`
}

const handleSlideImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadingSlide.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    const response = await $fetch('/api/upload', { method: 'POST', body: formData })
    if (response.success) {
      currentSlide.value.image = response.url
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ')
  } finally {
    uploadingSlide.value = false
  }
}

const removeSlideImage = () => {
  currentSlide.value.image = ''
  if (slideImageInput.value) slideImageInput.value.value = ''
}

const saveSlide = () => {
  if (!currentSlide.value.image) return
  
  if (editingSlideIndex.value !== null) {
    slides.value[editingSlideIndex.value] = { ...currentSlide.value }
  } else {
    slides.value.push({ ...currentSlide.value })
  }
  closeSlideModal()
}

const closeSlideModal = () => {
  showSlideModal.value = false
  editingSlideIndex.value = null
  currentSlide.value = {
    image: '',
    title: '',
    subtitle: '',
    link: '',
    order: slides.value.length + 1,
    active: true
  }
  if (slideImageInput.value) slideImageInput.value.value = ''
}

const editSlide = (index) => {
  editingSlideIndex.value = index
  currentSlide.value = { ...slides.value[index] }
  showSlideModal.value = true
}

const deleteSlide = (index) => {
  if (confirm('คุณต้องการลบสไลด์นี้หรือไม่?')) {
    slides.value.splice(index, 1)
  }
}

const moveSlide = (index, direction) => {
  if (direction === 'up' && index > 0) {
    [slides.value[index], slides.value[index - 1]] = [slides.value[index - 1], slides.value[index]]
    slides.value[index].order = index + 1
    slides.value[index - 1].order = index
  } else if (direction === 'down' && index < slides.value.length - 1) {
    [slides.value[index], slides.value[index + 1]] = [slides.value[index + 1], slides.value[index]]
    slides.value[index].order = index + 1
    slides.value[index + 1].order = index + 2
  }
}
</script>

