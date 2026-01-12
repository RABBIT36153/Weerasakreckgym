<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-white">จัดการครูมวย</h1>
      <button @click="openModal('add')" class="btn-primary">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        เพิ่มครูมวยใหม่
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาครูมวย..."
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-primary"
        />
        <select
          v-model="filterSkill"
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
        >
          <option value="">ทักษะทั้งหมด</option>
          <option value="พื้นฐาน">พื้นฐาน</option>
          <option value="ขั้นสูง">ขั้นสูง</option>
          <option value="แข่งขัน">แข่งขัน</option>
          <option value="ป้องกันตัว">ป้องกันตัว</option>
        </select>
        <button @click="resetFilters" class="btn-secondary">
          รีเซ็ต
        </button>
      </div>
    </div>

    <!-- Loading and Error Messages -->
    <div v-if="error" class="card mb-6 bg-red-900 bg-opacity-50 border border-red-500">
      <p class="text-red-300">{{ error }}</p>
    </div>
    
    <!-- Trainers Table -->
    <div class="card overflow-x-auto">
      <div v-if="loading && trainers.length === 0" class="p-8 text-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-dark-border">
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ID</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">รูปภาพ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ชื่อ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ตำแหน่ง</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">คะแนน</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ค่าเรียน</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trainer in filteredTrainers" :key="trainer.id" class="border-b border-dark-border hover:bg-dark-surface">
            <td class="py-3 px-4 text-gray-300">#{{ trainer.id }}</td>
            <td class="py-3 px-4">
              <img 
                :src="getImageUrl(trainer.image)" 
                :alt="trainer.name" 
                class="w-16 h-16 object-cover rounded-full"
                @error="handleImageError"
              />
            </td>
            <td class="py-3 px-4">
              <p class="text-white font-medium">{{ trainer.name }}</p>
              <p class="text-gray-400 text-sm">{{ trainer.experience }}</p>
            </td>
            <td class="py-3 px-4 text-gray-300">{{ trainer.title }}</td>
            <td class="py-3 px-4">
              <div class="flex items-center">
                <span class="text-yellow-400 mr-1">⭐</span>
                <span class="text-white">{{ trainer.rating }}</span>
                <span class="text-gray-400 ml-2">({{ trainer.reviews }})</span>
              </div>
            </td>
            <td class="py-3 px-4 text-red-primary font-bold">
              {{ typeof trainer.price === 'number' ? trainer.price.toLocaleString('th-TH') : trainer.price }} บาท/เดือน
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <button @click="openModal('edit', trainer)" class="text-gold hover:text-gold-light">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="deleteTrainer(trainer.id)" class="text-red-primary hover:text-red-hover">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-dark-card rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-white mb-6">
          {{ modalMode === 'add' ? 'เพิ่มครูมวยใหม่' : 'แก้ไขครูมวย' }}
        </h2>
        
        <form @submit.prevent="saveTrainer" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-300 mb-2">ชื่อ</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ตำแหน่ง</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">รูปภาพ</label>
            <div class="space-y-2">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                :disabled="uploadingImage"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div v-if="uploadingImage" class="text-yellow-400 text-sm">กำลังอัพโหลด...</div>
              <div v-if="form.image" class="mt-2">
                <img 
                  :src="getImageUrl(form.image)" 
                  alt="Preview" 
                  class="w-32 h-32 object-cover rounded-lg border border-dark-border"
                  @error="handlePreviewImageError"
                />
                <p class="text-gray-400 text-xs mt-1">{{ form.image }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">เอกสาร PDF</label>
            <div class="space-y-2">
              <input
                ref="pdfInput"
                type="file"
                accept=".pdf"
                @change="handlePdfUpload"
                :disabled="uploadingPdf"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div v-if="uploadingPdf" class="text-yellow-400 text-sm">กำลังอัพโหลด...</div>
              <div v-if="form.document" class="mt-2">
                <a :href="form.document" target="_blank" class="text-red-primary hover:text-red-hover flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  ดูเอกสาร PDF
                </a>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-gray-300 mb-2">คะแนน</label>
              <input
                v-model="form.rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">รีวิว</label>
              <input
                v-model="form.reviews"
                type="number"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ค่าเรียน/เดือน</label>
              <input
                v-model="form.price"
                type="number"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">ประสบการณ์</label>
            <input
              v-model="form.experience"
              type="text"
              required
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">ทักษะ (คั่นด้วยจุลภาค)</label>
            <input
              v-model="form.skillsText"
              type="text"
              placeholder="พื้นฐาน, เทคนิค, การแข่งขัน"
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">เกี่ยวกับ</label>
            <textarea
              v-model="form.bio"
              rows="3"
              required
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">ตารางเรียน</label>
            <div class="space-y-3 bg-dark-surface border border-dark-border rounded-lg p-4">
              <div v-for="(day, index) in weekDays" :key="index" class="flex items-center space-x-4">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="form.scheduleDays[index].enabled"
                    class="w-4 h-4 text-red-primary bg-dark-surface border-dark-border rounded focus:ring-red-primary"
                  />
                  <span class="text-white min-w-[80px]">{{ day }}</span>
                </label>
                <div v-if="form.scheduleDays[index].enabled" class="flex items-center space-x-2 flex-1">
                  <input
                    type="time"
                    v-model="form.scheduleDays[index].startTime"
                    class="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-primary"
                  />
                  <span class="text-gray-400">ถึง</span>
                  <input
                    type="time"
                    v-model="form.scheduleDays[index].endTime"
                    class="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-primary"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="closeModal" class="btn-secondary">
              ยกเลิก
            </button>
            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading">กำลังบันทึก...</span>
              <span v-else>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const searchQuery = ref('')
const filterSkill = ref('')
const showModal = ref(false)
const modalMode = ref('add')
const imageInput = ref(null)
const pdfInput = ref(null)
const uploadingImage = ref(false)
const uploadingPdf = ref(false)

const weekDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']

const form = ref({
  id: null,
  name: '',
  title: '',
  image: '',
  document: '',
  rating: 0,
  reviews: 0,
  price: '',
  experience: '',
  skillsText: '',
  bio: '',
  scheduleDays: weekDays.map(() => ({
    enabled: false,
    startTime: '',
    endTime: ''
  }))
})

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBaseUrl
const trainers = ref([])
const loading = ref(false)
const error = ref(null)

const filteredTrainers = computed(() => {
  let result = trainers.value
  
  if (searchQuery.value) {
    result = result.filter(t => 
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (filterSkill.value) {
    result = result.filter(t => 
      t.skills.some(skill => skill.includes(filterSkill.value))
    )
  }
  
  return result
})

const openModal = (mode, trainer = null) => {
  modalMode.value = mode
  if (mode === 'edit' && trainer) {
    // Parse scheduleDays from trainer data
    let scheduleDays = weekDays.map(() => ({
      enabled: false,
      startTime: '',
      endTime: ''
    }))
    
    if (trainer.scheduleDays && Array.isArray(trainer.scheduleDays)) {
      scheduleDays = trainer.scheduleDays
    }
    
    form.value = {
      id: trainer.id,
      name: trainer.name,
      title: trainer.title,
      image: trainer.image || '',
      document: trainer.document || '',
      rating: trainer.rating,
      reviews: trainer.reviews,
      price: typeof trainer.price === 'string' ? trainer.price.replace(/,/g, '') : trainer.price.toString(),
      experience: trainer.experience,
      skillsText: Array.isArray(trainer.skills) ? trainer.skills.join(', ') : '',
      bio: trainer.bio,
      scheduleDays: scheduleDays
    }
  } else {
    form.value = {
      id: null,
      name: '',
      title: '',
      image: '',
      document: '',
      rating: 0,
      reviews: 0,
      price: '',
      experience: '',
      skillsText: '',
      bio: '',
      scheduleDays: weekDays.map(() => ({
        enabled: false,
        startTime: '',
        endTime: ''
      }))
    }
  }
  
  // Reset file inputs
  if (imageInput.value) imageInput.value.value = ''
  if (pdfInput.value) pdfInput.value.value = ''
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadingImage.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    
    // Use Nuxt server API for file upload
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      // Store the URL as returned (should be relative path like /uploads/image/filename.jpg)
      // Nuxt will serve static files from public directory automatically
      form.value.image = response.url
      console.log('Image uploaded successfully:', response.url)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + (error.data?.statusMessage || error.message))
  } finally {
    uploadingImage.value = false
  }
}

const handlePdfUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  uploadingPdf.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'pdf')
    
    // Use Nuxt server API for file upload
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      // Get full URL - if it's a relative path, make it absolute
      const documentUrl = response.url.startsWith('http') 
        ? response.url 
        : `${window.location.origin}${response.url}`
      form.value.document = documentUrl
    }
  } catch (error) {
    console.error('Error uploading PDF:', error)
    alert('เกิดข้อผิดพลาดในการอัพโหลดเอกสาร PDF: ' + (error.data?.statusMessage || error.message))
  } finally {
    uploadingPdf.value = false
  }
}

const saveTrainer = async () => {
  loading.value = true
  error.value = null
  
  try {
    const skills = form.value.skillsText.split(',').map(s => s.trim()).filter(s => s)
    
    // Prepare data for API
    const trainerData = {
      name: form.value.name,
      title: form.value.title,
      image: form.value.image || '',
      document: form.value.document || '',
      rating: parseFloat(form.value.rating) || 0,
      reviews: parseInt(form.value.reviews) || 0,
      price: parseInt(form.value.price),
      experience: form.value.experience,
      skills: skills,
      bio: form.value.bio,
      scheduleDays: form.value.scheduleDays
    }
    
    if (modalMode.value === 'add') {
      // Create new trainer
      const response = await $fetch(`${API_BASE_URL}/trainers`, {
        method: 'POST',
        body: trainerData
      })
      
      if (response.success) {
        await fetchTrainers() // Refresh list
        closeModal()
        alert('เพิ่มครูมวยสำเร็จ')
      }
    } else {
      // Update existing trainer
      const response = await $fetch(`${API_BASE_URL}/trainers/${form.value.id}`, {
        method: 'PUT',
        body: trainerData
      })
      
      if (response.success) {
        await fetchTrainers() // Refresh list
        closeModal()
        alert('แก้ไขข้อมูลครูมวยสำเร็จ')
      }
    }
  } catch (err) {
    console.error('Error saving trainer:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const deleteTrainer = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบครูมวยคนนี้?')) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/trainers/${id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      await fetchTrainers() // Refresh list
      alert('ลบครูมวยสำเร็จ')
    }
  } catch (err) {
    console.error('Error deleting trainer:', err)
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล'
    alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterSkill.value = ''
}

const handleImageError = (event) => {
  // Use data URI placeholder instead of external URL
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}

const handlePreviewImageError = (event) => {
  // Use data URI placeholder instead of external URL
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD4KPC9zdmc+'
}

// Helper function to get full image URL
const getImageUrl = (url) => {
  if (!url) {
    // Return a data URI placeholder instead of external URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
  }
  
  // If it's already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If it's a relative path starting with /uploads/, use API endpoint
  if (url.startsWith('/uploads/')) {
    return `/api/uploads/${url.replace('/uploads/', '')}`
  }
  
  // If it doesn't start with /, prepend /uploads/ if it looks like an upload path
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url.slice(1) : url
    return `/api/uploads/${cleanPath.replace('uploads/', '')}`
  }
  
  // If it's a relative path starting with /, use API endpoint
  if (url.startsWith('/')) {
    return `/api/uploads/${url.slice(1)}`
  }
  
  // Otherwise, prepend /api/uploads/ to make it use the API endpoint
  return `/api/uploads/${url}`
}

// Fetch trainers from API
const fetchTrainers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/trainers`)
    trainers.value = Array.isArray(response) ? response : []
    
    // Format price for display
    trainers.value = trainers.value.map(trainer => ({
      ...trainer,
      price: typeof trainer.price === 'number' ? trainer.price.toLocaleString('th-TH') : trainer.price
    }))
  } catch (err) {
    console.error('Error fetching trainers:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลครูมวย'
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลครูมวย')
  } finally {
    loading.value = false
  }
}

// Load trainers on mount
onMounted(() => {
  fetchTrainers()
})
</script>

