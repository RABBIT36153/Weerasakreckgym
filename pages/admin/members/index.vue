<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">จัดการสมาชิก</h1>
      <button @click="openModal('add')" class="btn-primary">
        + เพิ่มสมาชิกใหม่
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
        <option value="expired">หมดอายุ</option>
        <option value="cancelled">ยกเลิก</option>
        <option value="suspended">ระงับ</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-dark-card rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-dark-surface">
            <tr>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">ชื่อ-นามสกุล</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">อีเมล</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">เบอร์โทร</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">แพ็คเกจ</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">วันที่เริ่มต้น</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">วันที่สิ้นสุด</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">สถานะ</th>
              <th class="px-6 py-4 text-left text-gray-300 font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-t border-dark-border">
              <td colspan="8" class="px-6 py-8 text-center text-gray-400">กำลังโหลดข้อมูล...</td>
            </tr>
            <tr v-else-if="error" class="border-t border-dark-border">
              <td colspan="8" class="px-6 py-8 text-center text-red-400">{{ error }}</td>
            </tr>
            <tr v-else-if="filteredMembers.length === 0" class="border-t border-dark-border">
              <td colspan="8" class="px-6 py-8 text-center text-gray-400">ไม่พบข้อมูล</td>
            </tr>
            <tr
              v-else
              v-for="member in filteredMembers"
              :key="member._id || member.id"
              class="border-t border-dark-border hover:bg-dark-surface transition-colors"
            >
              <td class="px-6 py-4 text-white">{{ member.name }}</td>
              <td class="px-6 py-4 text-gray-400">{{ member.email }}</td>
              <td class="px-6 py-4 text-gray-400">{{ member.phone }}</td>
              <td class="px-6 py-4 text-white">
                {{ member.membershipId?.name || member.membershipType || '-' }}
              </td>
              <td class="px-6 py-4 text-gray-400">{{ formatDate(member.startDate) }}</td>
              <td class="px-6 py-4 text-gray-400">{{ formatDate(member.endDate) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(member.status)" class="px-3 py-1 rounded-full text-white text-sm">
                  {{ getStatusText(member.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    @click="openModal('edit', member)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    @click="deleteMember(member._id || member.id)"
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
          {{ modalMode === 'add' ? 'เพิ่มสมาชิกใหม่' : 'แก้ไขข้อมูลสมาชิก' }}
        </h2>

        <form @submit.prevent="saveMember">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">ชื่อ-นามสกุล *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>

              <div>
                <label class="block text-gray-300 mb-2">อีเมล *</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">เบอร์โทรศัพท์ *</label>
              <input
                v-model="form.phone"
                type="text"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>

            <div>
              <label class="block text-gray-300 mb-2">แพ็คเกจสมาชิก *</label>
              <select
                v-model="form.membershipId"
                required
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                @change="handleMembershipChange"
              >
                <option value="">เลือกแพ็คเกจ</option>
                <option 
                  v-for="membership in memberships" 
                  :key="membership._id || membership.id" 
                  :value="membership._id || membership.id"
                >
                  {{ membership.name }} - {{ formatPrice(membership.price) }} บาท/เดือน
                </option>
              </select>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">ประเภทสมาชิก *</label>
              <input
                v-model="form.membershipType"
                type="text"
                required
                placeholder="เช่น 1 เดือน, 3 เดือน, 6 เดือน"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">วันที่เริ่มต้น *</label>
                <input
                  v-model="form.startDate"
                  type="date"
                  required
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                  @change="calculateEndDate"
                />
              </div>

              <div>
                <label class="block text-gray-300 mb-2">วันที่สิ้นสุด *</label>
                <input
                  v-model="form.endDate"
                  type="date"
                  required
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">สถานะ</label>
                <select
                  v-model="form.status"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                >
                  <option value="active">ใช้งาน</option>
                  <option value="expired">หมดอายุ</option>
                  <option value="cancelled">ยกเลิก</option>
                  <option value="suspended">ระงับ</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-300 mb-2">วิธีชำระเงิน</label>
                <select
                  v-model="form.paymentMethod"
                  class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
                >
                  <option value="credit_card">บัตรเครดิต</option>
                  <option value="bank_transfer">โอนเงิน</option>
                  <option value="cash">เงินสด</option>
                </select>
              </div>
            </div>

            <div class="flex items-center">
              <input
                v-model="form.autoRenew"
                type="checkbox"
                class="w-4 h-4 text-red-primary bg-dark-surface border-dark-border rounded focus:ring-red-primary"
              />
              <label class="ml-2 text-gray-300">ต่ออายุอัตโนมัติ</label>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">หมายเหตุ</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary"
              ></textarea>
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

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBaseUrl
const members = ref([])
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
  email: '',
  phone: '',
  membershipId: '',
  membershipType: '',
  startDate: '',
  endDate: '',
  status: 'active',
  autoRenew: false,
  paymentMethod: 'credit_card',
  notes: ''
})

const filteredMembers = computed(() => {
  let result = members.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.phone.includes(query)
    )
  }

  if (filterStatus.value) {
    result = result.filter(m => m.status === filterStatus.value)
  }

  return result
})

const fetchMembers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/members`)
    members.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching members:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const fetchMemberships = async () => {
  try {
    const response = await $fetch(`${API_BASE_URL}/memberships?status=active`)
    memberships.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching memberships:', err)
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('th-TH')
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-500',
    expired: 'bg-gray-500',
    cancelled: 'bg-red-500',
    suspended: 'bg-yellow-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getStatusText = (status) => {
  const texts = {
    active: 'ใช้งาน',
    expired: 'หมดอายุ',
    cancelled: 'ยกเลิก',
    suspended: 'ระงับ'
  }
  return texts[status] || status
}

const handleMembershipChange = async () => {
  if (!form.value.membershipId) return

  try {
    const membership = await $fetch(`${API_BASE_URL}/memberships/${form.value.membershipId}`)
    if (membership && membership.duration && form.value.startDate) {
      const start = new Date(form.value.startDate)
      const end = new Date(start)
      end.setDate(end.getDate() + membership.duration)
      form.value.endDate = end.toISOString().split('T')[0]
      form.value.membershipType = membership.name
    }
  } catch (err) {
    console.error('Error fetching membership:', err)
  }
}

const calculateEndDate = async () => {
  if (form.value.startDate && form.value.membershipId) {
    await handleMembershipChange()
  }
}

const openModal = (mode, member = null) => {
  modalMode.value = mode
  if (mode === 'edit' && member) {
    form.value = {
      id: member._id || member.id,
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      membershipId: member.membershipId?._id || member.membershipId || '',
      membershipType: member.membershipType || '',
      startDate: member.startDate ? new Date(member.startDate).toISOString().split('T')[0] : '',
      endDate: member.endDate ? new Date(member.endDate).toISOString().split('T')[0] : '',
      status: member.status || 'active',
      autoRenew: member.autoRenew || false,
      paymentMethod: member.paymentMethod || 'credit_card',
      notes: member.notes || ''
    }
  } else {
    form.value = {
      id: null,
      name: '',
      email: '',
      phone: '',
      membershipId: '',
      membershipType: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active',
      autoRenew: false,
      paymentMethod: 'credit_card',
      notes: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveMember = async () => {
  loading.value = true
  error.value = null

  try {
    const memberData = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      membershipId: form.value.membershipId,
      membershipType: form.value.membershipType,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      status: form.value.status,
      autoRenew: form.value.autoRenew,
      paymentMethod: form.value.paymentMethod,
      notes: form.value.notes
    }

    if (modalMode.value === 'add') {
      const response = await $fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        body: memberData
      })

      if (response.success) {
        await fetchMembers()
        closeModal()
        alert('เพิ่มสมาชิกสำเร็จ')
      }
    } else {
      const response = await $fetch(`${API_BASE_URL}/members/${form.value.id}`, {
        method: 'PUT',
        body: memberData
      })

      if (response.success) {
        await fetchMembers()
        closeModal()
        alert('แก้ไขข้อมูลสมาชิกสำเร็จ')
      }
    }
  } catch (err) {
    console.error('Error saving member:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const deleteMember = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกนี้?')) {
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await $fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      await fetchMembers()
      alert('ลบสมาชิกสำเร็จ')
    }
  } catch (err) {
    console.error('Error deleting member:', err)
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล'
    alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMembers()
  fetchMemberships()
})
</script>

