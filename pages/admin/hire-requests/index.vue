<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-white">คำขอจ้างงานครูมวย</h1>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา..."
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-primary"
        />
        <select
          v-model="filterStatus"
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
        >
          <option value="">สถานะทั้งหมด</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="contacted">ติดต่อแล้ว</option>
          <option value="approved">อนุมัติ</option>
          <option value="rejected">ปฏิเสธ</option>
          <option value="completed">เสร็จสมบูรณ์</option>
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
    
    <!-- Hire Requests Table -->
    <div class="card overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)]">
      <div v-if="loading && hireRequests.length === 0" class="p-8 text-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
      <table v-else class="w-full min-w-[1200px]">
        <thead class="sticky top-0 bg-dark-card z-10">
          <tr class="border-b border-dark-border">
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ผู้ขอจ้าง</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold min-w-[150px]">ครูมวย</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ประเทศ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ที่อยู่</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">วันที่ส่งคำขอ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold min-w-[140px]">สถานะ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredHireRequests" :key="request._id || request.id" class="border-b border-dark-border hover:bg-dark-surface">
            <td class="py-3 px-4">
              <p class="text-white font-medium">{{ request.name }}</p>
              <p class="text-gray-400 text-sm">{{ request.email }}</p>
              <p class="text-gray-400 text-sm">{{ request.phone }}</p>
            </td>
            <td class="py-3 px-4 min-w-[150px]">
              <p class="text-white font-medium">{{ request.trainerId?.name || 'N/A' }}</p>
              <p class="text-gray-400 text-sm">{{ request.trainerId?.title || '' }}</p>
            </td>
            <td class="py-3 px-4 text-gray-300">{{ request.country }}</td>
            <td class="py-3 px-4 text-gray-300">
              <p class="text-sm">{{ request.address }}</p>
              <p class="text-sm">{{ request.district }}, {{ request.province }} {{ request.postalCode }}</p>
            </td>
            <td class="py-3 px-4 text-gray-300">{{ formatDate(request.createdAt || request.date) }}</td>
            <td class="py-3 px-4 min-w-[140px]">
              <span :class="getStatusClass(request.status)">
                {{ getStatusText(request.status) }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <button 
                  v-if="request.status === 'pending'"
                  @click="updateStatus(request._id || request.id, 'contacted')" 
                  class="text-blue-400 hover:text-blue-300"
                  title="ติดต่อแล้ว"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </button>
                <button 
                  v-if="request.status === 'pending' || request.status === 'contacted'"
                  @click="updateStatus(request._id || request.id, 'approved')" 
                  class="text-green-400 hover:text-green-300"
                  title="อนุมัติ"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </button>
                <button 
                  v-if="request.status === 'pending' || request.status === 'contacted'"
                  @click="updateStatus(request._id || request.id, 'rejected')" 
                  class="text-red-primary hover:text-red-hover"
                  title="ปฏิเสธ"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <button @click="viewDetails(request)" class="text-gold hover:text-gold-light">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button 
                  @click="deleteRequest(request._id || request.id)" 
                  class="text-red-primary hover:text-red-hover"
                  :disabled="loading"
                >
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

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" @click.self="closeDetailsModal">
      <div class="bg-dark-card rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-white mb-6">รายละเอียดคำขอจ้างงาน</h2>
        
        <div v-if="selectedRequest" class="space-y-4">
          <div>
            <p class="text-gray-400 text-sm mb-1">สถานะ</p>
            <span :class="getStatusClass(selectedRequest.status)">
              {{ getStatusText(selectedRequest.status) }}
            </span>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">ครูมวย</p>
            <p class="text-white font-medium">{{ selectedRequest.trainerId?.name || 'N/A' }}</p>
            <p class="text-gray-300 text-sm">{{ selectedRequest.trainerId?.title || '' }}</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">ผู้ขอจ้าง</p>
            <p class="text-white font-medium">{{ selectedRequest.name }}</p>
            <p class="text-gray-300 text-sm">{{ selectedRequest.email }}</p>
            <p class="text-gray-300 text-sm">{{ selectedRequest.phone }}</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">ประเทศที่ต้องการจ้าง</p>
            <p class="text-white">{{ selectedRequest.country }}</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">ที่อยู่</p>
            <p class="text-white">{{ selectedRequest.address }}</p>
            <p class="text-gray-300 text-sm">{{ selectedRequest.district }}, {{ selectedRequest.province }} {{ selectedRequest.postalCode }}</p>
          </div>
          
          <div v-if="selectedRequest.duration">
            <p class="text-gray-400 text-sm mb-1">ระยะเวลาที่ต้องการจ้าง</p>
            <p class="text-white">{{ selectedRequest.duration }}</p>
          </div>
          
          <div v-if="selectedRequest.message">
            <p class="text-gray-400 text-sm mb-1">ข้อความเพิ่มเติม</p>
            <p class="text-white whitespace-pre-wrap">{{ selectedRequest.message }}</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">วันที่ส่งคำขอ</p>
            <p class="text-white">{{ formatDate(selectedRequest.createdAt || selectedRequest.date) }}</p>
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button @click="closeDetailsModal" class="btn-secondary">
              ปิด
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

const API_BASE_URL = 'http://localhost:4002/api'
const searchQuery = ref('')
const filterStatus = ref('')
const showDetailsModal = ref(false)
const selectedRequest = ref(null)
const hireRequests = ref([])
const loading = ref(false)
const error = ref(null)

const filteredHireRequests = computed(() => {
  let result = hireRequests.value
  
  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      (r.name && r.name.toLowerCase().includes(searchTerm)) ||
      (r.email && r.email.toLowerCase().includes(searchTerm)) ||
      (r.phone && r.phone.includes(searchTerm)) ||
      (r.country && r.country.toLowerCase().includes(searchTerm)) ||
      (r.trainerId?.name && r.trainerId.name.toLowerCase().includes(searchTerm))
    )
  }
  
  if (filterStatus.value) {
    result = result.filter(r => r.status === filterStatus.value)
  }
  
  return result
})

// Fetch hire requests from API
const fetchHireRequests = async () => {
  loading.value = true
  error.value = null
  try {
    const queryParams = new URLSearchParams()
    if (filterStatus.value) queryParams.append('status', filterStatus.value)
    
    const url = `${API_BASE_URL}/hire-requests${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await $fetch(url)
    hireRequests.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching hire requests:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลคำขอจ้างงาน'
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลคำขอจ้างงาน')
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (e) {
    return dateString
  }
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    contacted: 'badge-info',
    approved: 'badge-success',
    rejected: 'badge-danger',
    completed: 'badge-success'
  }
  return classes[status] || 'badge-info'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'รอดำเนินการ',
    contacted: 'ติดต่อแล้ว',
    approved: 'อนุมัติ',
    rejected: 'ปฏิเสธ',
    completed: 'เสร็จสมบูรณ์'
  }
  return texts[status] || status
}

const updateStatus = async (id, status) => {
  const statusText = getStatusText(status)
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะเป็น "${statusText}"`)) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/hire-requests/${id}/status`, {
      method: 'PUT',
      body: { status }
    })
    
    if (response.success) {
      await fetchHireRequests() // Refresh list
      alert('อัปเดตสถานะสำเร็จ')
    }
  } catch (err) {
    console.error('Error updating status:', err)
    error.value = 'เกิดข้อผิดพลาดในการอัปเดตสถานะ'
    alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const deleteRequest = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคำขอจ้างงานนี้?')) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/hire-requests/${id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      await fetchHireRequests() // Refresh list
      alert('ลบคำขอจ้างงานสำเร็จ')
    }
  } catch (err) {
    console.error('Error deleting hire request:', err)
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล'
    alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const viewDetails = (request) => {
  selectedRequest.value = request
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedRequest.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  fetchHireRequests() // Refresh with reset filters
}

// Watch filters and refetch data
watch([filterStatus], () => {
  fetchHireRequests()
})

// Load hire requests on mount
onMounted(() => {
  fetchHireRequests()
})
</script>

<style scoped>
.badge-success {
  @apply px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm;
}

.badge-danger {
  @apply px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm;
}

.badge-warning {
  @apply px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm;
}

.badge-info {
  @apply px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm;
}
</style>

