<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-white">จัดการคอร์สเรียน</h1>
      <button @click="openModal('add')" class="btn-primary">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        เพิ่มคอร์สใหม่
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาคอร์ส..."
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-primary"
        />
        <select
          v-model="filterStatus"
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
        >
          <option value="">ทั้งหมด</option>
          <option value="active">เปิดใช้งาน</option>
          <option value="inactive">ปิดใช้งาน</option>
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
    
    <!-- Courses Table -->
    <div class="card overflow-x-auto">
      <div v-if="loading && courses.length === 0" class="p-8 text-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-dark-border">
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ID</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">รูปภาพ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold w-64">ชื่อคอร์ส</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ราคา</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">สถานะ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in filteredCourses" :key="course._id || course.id" class="border-b border-dark-border hover:bg-dark-surface">
            <td class="py-3 px-4 text-gray-300">#{{ course._id || course.id }}</td>
            <td class="py-3 px-4">
              <img 
                :src="getImageUrl(course.image)" 
                :alt="course.name" 
                class="w-16 h-16 object-cover rounded"
                @error="handleImageError"
              />
            </td>
            <td class="py-3 px-4 w-64">
              <p class="text-white font-medium truncate">{{ course.name }}</p>
              <p class="text-gray-400 text-sm line-clamp-2">{{ course.description }}</p>
            </td>
            <td class="py-3 px-4 text-red-primary font-bold">
              {{ typeof course.price === 'number' ? course.price.toLocaleString('th-TH') : course.price }} บาท
            </td>
            <td class="py-3 px-4">
              <span :class="course.status === 'active' ? 'badge-success' : 'badge-danger'">
                {{ course.status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <button @click="openModal('edit', course)" class="text-gold hover:text-gold-light">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="deleteCourse(course.id)" class="text-red-primary hover:text-red-hover">
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
          {{ modalMode === 'add' ? 'เพิ่มคอร์สใหม่' : 'แก้ไขคอร์ส' }}
        </h2>
        
        <form @submit.prevent="saveCourse" class="space-y-4">
          <div>
            <label class="block text-gray-300 mb-2">ชื่อคอร์ส</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">คำอธิบาย</label>
            <textarea
              v-model="form.description"
              rows="3"
              required
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-300 mb-2">ราคา</label>
              <input
                v-model="form.price"
                type="number"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ราคาเดิม</label>
              <input
                v-model="form.originalPrice"
                type="number"
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
            <label class="block text-gray-300 mb-2">สิ่งที่ได้รับ</label>
            <div class="space-y-2">
              <div 
                v-for="(benefit, index) in form.benefits" 
                :key="index" 
                class="flex items-center space-x-2"
              >
                <input
                  v-model="form.benefits[index]"
                  type="text"
                  :placeholder="`รายการที่ ${index + 1}`"
                  class="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
                <button
                  type="button"
                  @click="removeBenefit(index)"
                  class="bg-red-primary hover:bg-red-hover text-white px-4 py-2 rounded-lg transition-colors"
                  :disabled="form.benefits.length === 1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              <button
                type="button"
                @click="addBenefit"
                class="w-full bg-dark-surface border border-dark-border hover:border-red-primary text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>เพิ่มรายการ</span>
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-300 mb-2">เวลาเริ่มต้น</label>
              <input
                v-model="form.startTime"
                type="time"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">เวลาสิ้นสุด</label>
              <input
                v-model="form.endTime"
                type="time"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">จำนวนครั้งการเรียน</label>
            <input
              v-model.number="form.numberOfSessions"
              type="number"
              min="1"
              @input="updateSessionDates"
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div v-if="form.numberOfSessions > 0">
            <label class="block text-gray-300 mb-2">วันเรียน</label>
            <div class="space-y-2">
              <div
                v-for="(date, index) in form.sessionDates"
                :key="index"
                class="flex items-center space-x-2"
              >
                <span class="text-gray-400 w-20">ครั้งที่ {{ index + 1 }}</span>
                <input
                  v-model="form.sessionDates[index]"
                  type="date"
                  class="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">สถานะ</label>
            <select
              v-model="form.status"
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            >
              <option value="active">เปิดใช้งาน</option>
              <option value="inactive">ปิดใช้งาน</option>
            </select>
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
const filterStatus = ref('')
const showModal = ref(false)
const modalMode = ref('add')
const imageInput = ref(null)
const uploadingImage = ref(false)

const form = ref({
  id: null,
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  image: '',
  benefits: [''],
  startTime: '09:00',
  endTime: '10:30',
  numberOfSessions: 1,
  sessionDates: [''],
  status: 'active'
})

const API_BASE_URL = 'http://localhost:4002/api'
const courses = ref([])
const loading = ref(false)
const error = ref(null)

const filteredCourses = computed(() => {
  let result = courses.value
  
  if (searchQuery.value) {
    result = result.filter(c => 
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (filterStatus.value) {
    result = result.filter(c => c.status === filterStatus.value)
  }
  
  return result
})

const addBenefit = () => {
  form.value.benefits.push('')
}

const removeBenefit = (index) => {
  if (form.value.benefits.length > 1) {
    form.value.benefits.splice(index, 1)
  }
}

const updateSessionDates = () => {
  const numberOfSessions = parseInt(form.value.numberOfSessions) || 0
  if (numberOfSessions > 0) {
    // Keep existing dates and add empty ones if needed
    const currentDates = form.value.sessionDates || ['']
    if (numberOfSessions > currentDates.length) {
      // Add more dates
      const newDates = Array(numberOfSessions - currentDates.length).fill('')
      form.value.sessionDates = [...currentDates, ...newDates]
    } else if (numberOfSessions < currentDates.length) {
      // Remove excess dates
      form.value.sessionDates = currentDates.slice(0, numberOfSessions)
    }
  } else {
    form.value.sessionDates = ['']
  }
}

const openModal = (mode, course = null) => {
  modalMode.value = mode
  if (mode === 'edit' && course) {
    const numberOfSessions = course.numberOfSessions || (course.sessionDates && course.sessionDates.length > 0 ? course.sessionDates.length : 1)
    const sessionDates = course.sessionDates && course.sessionDates.length > 0 ? [...course.sessionDates] : ['']
    
    form.value = {
      id: course._id || course.id,
      name: course.name,
      description: course.description,
      price: typeof course.price === 'string' ? course.price.replace(/,/g, '') : course.price.toString(),
      originalPrice: typeof course.originalPrice === 'string' ? course.originalPrice.replace(/,/g, '') : course.originalPrice.toString(),
      image: course.image || '',
      benefits: course.benefits && course.benefits.length > 0 ? [...course.benefits] : [''],
      startTime: course.startTime || '09:00',
      endTime: course.endTime || '10:30',
      numberOfSessions: numberOfSessions,
      sessionDates: sessionDates,
      status: course.status
    }
    
    // Ensure sessionDates array matches numberOfSessions
    if (numberOfSessions > sessionDates.length) {
      const additionalDates = Array(numberOfSessions - sessionDates.length).fill('')
      form.value.sessionDates = [...sessionDates, ...additionalDates]
    }
  } else {
    form.value = {
      id: null,
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      benefits: [''],
      startTime: '09:00',
      endTime: '10:30',
      numberOfSessions: 1,
      sessionDates: [''],
      status: 'active'
    }
  }
  
  // Reset file input
  if (imageInput.value) imageInput.value.value = ''
  
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
    
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
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

const getImageUrl = (url) => {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  if (url.startsWith('/uploads/')) {
    return `/api/uploads/${url.replace('/uploads/', '')}`
  }
  
  if (url.includes('uploads/')) {
    const cleanPath = url.startsWith('/') ? url.slice(1) : url
    return `/api/uploads/${cleanPath.replace('uploads/', '')}`
  }
  
  if (url.startsWith('/')) {
    return `/api/uploads/${url.slice(1)}`
  }
  
  return `/api/uploads/${url}`
}

const handlePreviewImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD4KPC9zdmc+'
}

const saveCourse = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Filter out empty benefits
    const benefits = form.value.benefits.filter(b => b.trim() !== '')
    
    // Filter out empty session dates
    const sessionDates = form.value.sessionDates ? form.value.sessionDates.filter(d => d.trim() !== '') : []
    
    // Prepare data for API
    const courseData = {
      name: form.value.name,
      description: form.value.description,
      price: parseInt(form.value.price),
      originalPrice: parseInt(form.value.originalPrice),
      image: form.value.image || '',
      benefits: benefits,
      startTime: form.value.startTime || '09:00',
      endTime: form.value.endTime || '10:30',
      numberOfSessions: parseInt(form.value.numberOfSessions) || 0,
      sessionDates: sessionDates,
      status: form.value.status
    }
    
    if (modalMode.value === 'add') {
      // Create new course
      const response = await $fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        body: courseData
      })
      
      if (response.success) {
        await fetchCourses() // Refresh list
        closeModal()
        alert('เพิ่มคอร์สเรียนสำเร็จ')
      }
    } else {
      // Update existing course
      const response = await $fetch(`${API_BASE_URL}/courses/${form.value.id}`, {
        method: 'PUT',
        body: courseData
      })
      
      if (response.success) {
        await fetchCourses() // Refresh list
        closeModal()
        alert('แก้ไขข้อมูลคอร์สเรียนสำเร็จ')
      }
    }
  } catch (err) {
    console.error('Error saving course:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const deleteCourse = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?')) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      await fetchCourses() // Refresh list
      alert('ลบคอร์สเรียนสำเร็จ')
    }
  } catch (err) {
    console.error('Error deleting course:', err)
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล'
    alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
}

// Fetch courses from API
const fetchCourses = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/courses`)
    courses.value = Array.isArray(response) ? response : []
    
    // Format price for display
    courses.value = courses.value.map(course => ({
      ...course,
      price: typeof course.price === 'number' ? course.price.toLocaleString('th-TH') : course.price,
      originalPrice: typeof course.originalPrice === 'number' ? course.originalPrice.toLocaleString('th-TH') : course.originalPrice
    }))
  } catch (err) {
    console.error('Error fetching courses:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์สเรียน'
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์สเรียน')
  } finally {
    loading.value = false
  }
}

// Load courses on mount
onMounted(() => {
  fetchCourses()
})

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}
</script>

<style scoped>
.badge-success {
  @apply px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm;
}

.badge-danger {
  @apply px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm;
}
</style>

