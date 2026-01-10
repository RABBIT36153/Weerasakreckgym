<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">จัดการแพ็คเกจสมาชิก</h1>
      <button @click="openModal('add')" class="btn-primary">
        + เพิ่มแพ็คเกจใหม่
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหา..."
        class="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
      />
      <select
        v-model="filterStatus"
        class="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
      >
        <option value="">ทุกสถานะ</option>
        <option value="active">ใช้งาน</option>
        <option value="inactive">ไม่ใช้งาน</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-dark-card rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-dark-surface">
            <tr>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">ชื่อแพ็คเกจ</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">คำอธิบาย</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">ราคา/เดือน</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">ระยะเวลา (วัน)</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">สถานะ</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-t border-dark-border">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">กำลังโหลดข้อมูล...</td>
            </tr>
            <tr v-else-if="error" class="border-t border-dark-border">
              <td colspan="6" class="px-6 py-8 text-center text-red-400">{{ error }}</td>
            </tr>
            <tr v-else-if="filteredMemberships.length === 0" class="border-t border-dark-border">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">ไม่พบข้อมูล</td>
            </tr>
            <tr
              v-else
              v-for="membership in filteredMemberships"
              :key="membership._id || membership.id"
              class="border-t border-dark-border hover:bg-dark-surface transition-colors"
            >
              <td class="px-6 py-4 text-white">{{ membership.name }}</td>
              <td class="px-6 py-4 text-gray-400 w-64 truncate">{{ membership.description }}</td>
              <td class="px-6 py-4 text-white">{{ formatPrice(membership.price) }} บาท</td>
              <td class="px-6 py-4 text-gray-400">{{ membership.duration }} วัน</td>
              <td class="px-6 py-4">
                <span
                  :class="membership.status === 'active' ? 'bg-green-500' : 'bg-gray-500'"
                  class="px-3 py-1 rounded-full text-white text-sm"
                >
                  {{ membership.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    @click="openModal('edit', membership)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    @click="deleteMembership(membership._id || membership.id)"
                    class="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-dark-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-white mb-6">
          {{ modalMode === 'add' ? 'เพิ่มแพ็คเกจใหม่' : 'แก้ไขแพ็คเกจ' }}
        </h2>

        <form @submit.prevent="saveMembership">
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">ชื่อแพ็คเกจ *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>

            <div>
              <label class="block text-gray-300 mb-2">คำอธิบาย *</label>
              <textarea
                v-model="form.description"
                required
                rows="3"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">ราคา/เดือน (บาท) *</label>
                <input
                  v-model="form.price"
                  type="number"
                  required
                  min="0"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>

              <div>
                <label class="block text-gray-300 mb-2">ราคาเดิม (บาท)</label>
                <input
                  v-model="form.originalPrice"
                  type="number"
                  min="0"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">ระยะเวลา (วัน) *</label>
              <input
                v-model="form.duration"
                type="number"
                required
                min="1"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>

            <div>
              <label class="block text-gray-300 mb-2">สิทธิประโยชน์</label>
              <div class="space-y-2">
                <div
                  v-for="(benefit, index) in form.benefits"
                  :key="index"
                  class="flex gap-2"
                >
                  <input
                    v-model="form.benefits[index]"
                    type="text"
                    class="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                    placeholder="สิทธิประโยชน์"
                  />
                  <button
                    type="button"
                    @click="removeBenefit(index)"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    ลบ
                  </button>
                </div>
                <button
                  type="button"
                  @click="addBenefit"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  + เพิ่มสิทธิประโยชน์
                </button>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">สถานะ</label>
              <select
                v-model="form.status"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              >
                <option value="active">ใช้งาน</option>
                <option value="inactive">ไม่ใช้งาน</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-6 mt-6 border-t border-dark-border">
            <button
              type="button"
              @click="closeModal"
              class="btn-secondary"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
            >
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

const API_BASE_URL = 'http://localhost:4002/api'
const memberships = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const modalMode = ref('add')

const form = ref({
  id: null,
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  duration: 30,
  benefits: [''],
  status: 'active'
})

const filteredMemberships = computed(() => {
  let result = memberships.value

  if (searchQuery.value) {
    result = result.filter(m =>
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterStatus.value) {
    result = result.filter(m => m.status === filterStatus.value)
  }

  return result
})

const fetchMemberships = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/memberships`)
    memberships.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching memberships:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('th-TH')
}

const openModal = (mode, membership = null) => {
  modalMode.value = mode
  if (mode === 'edit' && membership) {
    form.value = {
      id: membership._id || membership.id,
      name: membership.name || '',
      description: membership.description || '',
      price: membership.price || '',
      originalPrice: membership.originalPrice || '',
      duration: membership.duration || 30,
      benefits: membership.benefits && membership.benefits.length > 0 ? [...membership.benefits] : [''],
      status: membership.status || 'active'
    }
  } else {
    form.value = {
      id: null,
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      duration: 30,
      benefits: [''],
      status: 'active'
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const addBenefit = () => {
  form.value.benefits.push('')
}

const removeBenefit = (index) => {
  form.value.benefits.splice(index, 1)
  if (form.value.benefits.length === 0) {
    form.value.benefits.push('')
  }
}

const saveMembership = async () => {
  loading.value = true
  error.value = null

  try {
    const membershipData = {
      name: form.value.name,
      description: form.value.description,
      price: parseInt(form.value.price),
      originalPrice: form.value.originalPrice ? parseInt(form.value.originalPrice) : undefined,
      duration: parseInt(form.value.duration),
      benefits: form.value.benefits.filter(b => b.trim()),
      status: form.value.status
    }

    if (modalMode.value === 'add') {
      const response = await $fetch(`${API_BASE_URL}/memberships`, {
        method: 'POST',
        body: membershipData
      })

      if (response.success) {
        await fetchMemberships()
        closeModal()
        alert('เพิ่มแพ็คเกจสำเร็จ')
      }
    } else {
      const response = await $fetch(`${API_BASE_URL}/memberships/${form.value.id}`, {
        method: 'PUT',
        body: membershipData
      })

      if (response.success) {
        await fetchMemberships()
        closeModal()
        alert('แก้ไขข้อมูลแพ็คเกจสำเร็จ')
      }
    }
  } catch (err) {
    console.error('Error saving membership:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const deleteMembership = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบแพ็คเกจนี้?')) {
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await $fetch(`${API_BASE_URL}/memberships/${id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      await fetchMemberships()
      alert('ลบแพ็คเกจสำเร็จ')
    }
  } catch (err) {
    console.error('Error deleting membership:', err)
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล'
    alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

watch([searchQuery, filterStatus], () => {
  // Filtering is handled by computed property
})

onMounted(() => {
  fetchMemberships()
})
</script>

