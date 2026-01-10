<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-white">จัดการการลงทะเบียน</h1>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <option value="confirmed">ยืนยันแล้ว</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
        <select
          v-model="filterType"
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
        >
          <option value="">ประเภททั้งหมด</option>
          <option value="course">คอร์สเรียน</option>
          <option value="trainer">ครูมวย</option>
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
    
    <!-- Registrations Table -->
    <div class="card overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)]">
      <div v-if="loading && registrations.length === 0" class="p-8 text-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
      <table v-else class="w-full min-w-[1000px]">
        <thead class="sticky top-0 bg-dark-card z-10">
          <tr class="border-b border-dark-border">
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ผู้ใช้</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold min-w-[120px]">ประเภท</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">รายละเอียด</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ราคา</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">วันที่ลงทะเบียน</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold min-w-[140px]">สถานะ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reg in filteredRegistrations" :key="reg._id || reg.id" class="border-b border-dark-border hover:bg-dark-surface">
            <td class="py-3 px-4">
              <p class="text-white font-medium">{{ reg.userName }}</p>
              <p class="text-gray-400 text-sm">{{ reg.userEmail }}</p>
            </td>
            <td class="py-3 px-4 min-w-[120px]">
              <span :class="reg.type === 'course' ? 'badge-info' : 'badge-warning'">
                {{ reg.type === 'course' ? 'คอร์สเรียน' : 'ครูมวย' }}
              </span>
            </td>
            <td class="py-3 px-4">
              <p class="text-white font-medium">{{ reg.itemName }}</p>
            </td>
            <td class="py-3 px-4 text-red-primary font-bold">{{ formatPrice(reg.price) }} บาท</td>
            <td class="py-3 px-4 text-gray-300">{{ formatDate(reg.createdAt || reg.date) }}</td>
            <td class="py-3 px-4 min-w-[140px]">
              <span :class="getStatusClass(reg.status)">
                {{ getStatusText(reg.status) }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <button 
                  v-if="reg.status === 'pending'"
                  @click="updateStatus(reg._id || reg.id, 'confirmed')" 
                  class="text-green-400 hover:text-green-300"
                  title="ยืนยัน"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </button>
                <button 
                  @click="updateStatus(reg._id || reg.id, 'cancelled')" 
                  class="text-red-primary hover:text-red-hover"
                  title="ยกเลิก"
                  :disabled="loading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <button @click="viewDetails(reg)" class="text-gold hover:text-gold-light">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
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
        <h2 class="text-2xl font-bold text-white mb-6">รายละเอียดการลงทะเบียน</h2>
        
        <div v-if="selectedRegistration" class="space-y-4">
          <div>
            <p class="text-gray-400 text-sm mb-1">สถานะ</p>
            <span :class="getStatusClass(selectedRegistration.status)">
              {{ getStatusText(selectedRegistration.status) }}
            </span>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">ผู้ใช้</p>
            <p class="text-white font-medium">{{ selectedRegistration.userName }}</p>
            <p class="text-gray-300 text-sm">{{ selectedRegistration.userEmail }}</p>
            <p class="text-gray-300 text-sm">{{ selectedRegistration.userPhone }}</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">ประเภท</p>
            <span :class="selectedRegistration.type === 'course' ? 'badge-info' : 'badge-warning'">
              {{ selectedRegistration.type === 'course' ? 'คอร์สเรียน' : 'ครูมวย' }}
            </span>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">รายละเอียด</p>
            <p class="text-white font-medium">{{ selectedRegistration.itemName }}</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">ราคา</p>
            <p class="text-red-primary font-bold text-xl">{{ formatPrice(selectedRegistration.price) }} บาท</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">วันที่ลงทะเบียน</p>
            <p class="text-white">{{ formatDate(selectedRegistration.createdAt || selectedRegistration.date) }}</p>
          </div>
          
          <div>
            <p class="text-gray-400 text-sm mb-1">สถานะการชำระเงิน</p>
            <span :class="getPaymentStatusClass(selectedRegistration.paymentStatus)">
              {{ getPaymentStatusText(selectedRegistration.paymentStatus) }}
            </span>
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
const filterType = ref('')
const showDetailsModal = ref(false)
const selectedRegistration = ref(null)
const registrations = ref([])
const loading = ref(false)
const error = ref(null)

const filteredRegistrations = computed(() => {
  let result = registrations.value
  
  if (searchQuery.value) {
    result = result.filter(r => 
      r.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.itemName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (filterStatus.value) {
    result = result.filter(r => r.status === filterStatus.value)
  }
  
  if (filterType.value) {
    result = result.filter(r => r.type === filterType.value)
  }
  
  return result
})

const getStatusClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    confirmed: 'badge-success',
    cancelled: 'badge-danger'
  }
  return classes[status] || 'badge-info'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'รอดำเนินการ',
    confirmed: 'ยืนยันแล้ว',
    cancelled: 'ยกเลิก',
    completed: 'เสร็จสมบูรณ์'
  }
  return texts[status] || status
}

const getPaymentStatusClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    completed: 'badge-success',
    failed: 'badge-danger',
    refunded: 'badge-info'
  }
  return classes[status] || 'badge-info'
}

const getPaymentStatusText = (status) => {
  const texts = {
    pending: 'รอชำระเงิน',
    completed: 'ชำระเงินแล้ว',
    failed: 'ชำระเงินไม่สำเร็จ',
    refunded: 'คืนเงินแล้ว'
  }
  return texts[status] || status || '-'
}

// Fetch registrations from API
const fetchRegistrations = async () => {
  loading.value = true
  error.value = null
  try {
    const queryParams = new URLSearchParams()
    if (filterStatus.value) queryParams.append('status', filterStatus.value)
    if (filterType.value) queryParams.append('type', filterType.value)
    
    const url = `${API_BASE_URL}/registrations${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await $fetch(url)
    registrations.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching registrations:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลการลงทะเบียน'
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการลงทะเบียน')
  } finally {
    loading.value = false
  }
}

// Format price with thousand separator
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('th-TH')
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

const updateStatus = async (id, status) => {
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะเป็น "${getStatusText(status)}"`)) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/registrations/${id}/status`, {
      method: 'PUT',
      body: { status }
    })
    
    if (response.success) {
      await fetchRegistrations() // Refresh list
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

const viewDetails = (registration) => {
  selectedRegistration.value = registration
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedRegistration.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
  fetchRegistrations() // Refresh with reset filters
}

// Watch filters and refetch data
watch([filterStatus, filterType], () => {
  fetchRegistrations()
})

// Load registrations on mount
onMounted(() => {
  fetchRegistrations()
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

