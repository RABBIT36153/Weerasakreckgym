<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-white">จัดการผู้ใช้</h1>
      <button @click="openModal('add')" class="btn-primary">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        เพิ่มผู้ใช้ใหม่
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาผู้ใช้..."
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-primary"
        />
        <select
          v-model="filterRole"
          class="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
        >
          <option value="">บทบาททั้งหมด</option>
          <option value="user">ผู้ใช้</option>
          <option value="admin">ผู้ดูแลระบบ</option>
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
    
    <!-- Users Table -->
    <div class="card overflow-x-auto">
      <div v-if="loading && users.length === 0" class="p-8 text-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-dark-border">
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ID</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">ชื่อ-นามสกุล</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">อีเมล</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">เบอร์โทร</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">บทบาท</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">สถานะ</th>
            <th class="text-left py-3 px-4 text-gray-300 font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id || user.id" class="border-b border-dark-border hover:bg-dark-surface">
            <td class="py-3 px-4 text-gray-300">#{{ user._id || user.id }}</td>
            <td class="py-3 px-4">
              <p class="text-white font-medium">{{ user.name }}</p>
            </td>
            <td class="py-3 px-4 text-gray-300">{{ user.email }}</td>
            <td class="py-3 px-4 text-gray-300">{{ user.phone }}</td>
            <td class="py-3 px-4">
              <span :class="user.role === 'admin' ? 'badge-warning' : 'badge-info'">
                {{ user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้' }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span :class="user.status === 'active' ? 'badge-success' : 'badge-danger'">
                {{ user.status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน' }}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <button @click="openModal('edit', user)" class="text-gold hover:text-gold-light">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="deleteUser(user.id)" class="text-red-primary hover:text-red-hover">
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
          {{ modalMode === 'add' ? 'เพิ่มผู้ใช้ใหม่' : 'แก้ไขผู้ใช้' }}
        </h2>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-gray-300 mb-2">ชื่อ-นามสกุล</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">อีเมล</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 mb-2">เบอร์โทรศัพท์</label>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div v-if="modalMode === 'add'">
            <label class="block text-gray-300 mb-2">รหัสผ่าน</label>
            <input
              v-model="form.password"
              type="password"
              :required="modalMode === 'add'"
              class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-300 mb-2">บทบาท</label>
              <select
                v-model="form.role"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              >
                <option value="user">ผู้ใช้</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">สถานะ</label>
              <select
                v-model="form.status"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              >
                <option value="active">ใช้งาน</option>
                <option value="inactive">ปิดใช้งาน</option>
              </select>
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
const filterRole = ref('')
const showModal = ref(false)
const modalMode = ref('add')

const form = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
  status: 'active'
})

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBaseUrl
const users = ref([])
const loading = ref(false)
const error = ref(null)

const filteredUsers = computed(() => {
  let result = users.value
  
  if (searchQuery.value) {
    result = result.filter(u => 
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.phone.includes(searchQuery.value)
    )
  }
  
  if (filterRole.value) {
    result = result.filter(u => u.role === filterRole.value)
  }
  
  return result
})

const openModal = (mode, user = null) => {
  modalMode.value = mode
  if (mode === 'edit' && user) {
    form.value = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role,
      status: user.status
    }
  } else {
    form.value = {
      id: null,
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      status: 'active'
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveUser = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Prepare data for API
    const userData = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      role: form.value.role,
      status: form.value.status
    }
    
    // Only include password if provided (for add mode, it's required)
    if (modalMode.value === 'add') {
      if (!form.value.password) {
        alert('กรุณากรอกรหัสผ่าน')
        loading.value = false
        return
      }
      userData.password = form.value.password
    } else if (form.value.password && form.value.password.trim() !== '') {
      // Only update password if provided in edit mode
      userData.password = form.value.password
    }
    
    if (modalMode.value === 'add') {
      // Create new user
      const response = await $fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: userData
      })
      
      if (response.success) {
        await fetchUsers() // Refresh list
        closeModal()
        alert('เพิ่มผู้ใช้สำเร็จ')
      }
    } else {
      // Update existing user
      const response = await $fetch(`${API_BASE_URL}/users/${form.value.id}`, {
        method: 'PUT',
        body: userData
      })
      
      if (response.success) {
        await fetchUsers() // Refresh list
        closeModal()
        alert('แก้ไขข้อมูลผู้ใช้สำเร็จ')
      }
    }
  } catch (err) {
    console.error('Error saving user:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      await fetchUsers() // Refresh list
      alert('ลบผู้ใช้สำเร็จ')
    }
  } catch (err) {
    console.error('Error deleting user:', err)
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล'
    alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterRole.value = ''
}

// Fetch users from API
const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/users`)
    users.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching users:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้'
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้')
  } finally {
    loading.value = false
  }
}

// Load users on mount
onMounted(() => {
  fetchUsers()
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

