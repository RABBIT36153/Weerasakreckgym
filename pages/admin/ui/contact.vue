<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการข้อมูลติดต่อ</h1>
      <p class="text-gray-400">จัดการข้อมูลติดต่อและข้อมูลการติดต่อของเว็บไซต์</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <!-- Address Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">ที่อยู่</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">ที่อยู่บรรทัดที่ 1</label>
              <input 
                type="text" 
                v-model="contactSettings.address.line1"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="123 ถนนมวยไทย"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ที่อยู่บรรทัดที่ 2</label>
              <input 
                type="text" 
                v-model="contactSettings.address.line2"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="แขวงมวยไทย เขตมวยไทย"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">ที่อยู่บรรทัดที่ 3</label>
                <input 
                  type="text" 
                  v-model="contactSettings.address.line3"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="กรุงเทพมหานคร"
                />
              </div>
              <div>
                <label class="block text-gray-300 mb-2">รหัสไปรษณีย์</label>
                <input 
                  type="text" 
                  v-model="contactSettings.address.postalCode"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="10110"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Phone Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">เบอร์โทรศัพท์</h2>
          <div class="space-y-4">
            <div v-for="(phone, index) in contactSettings.phones" :key="index" class="p-4 bg-dark-surface rounded-lg border border-dark-border">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-white font-semibold">เบอร์โทร {{ index + 1 }}</h3>
                <button 
                  v-if="contactSettings.phones.length > 1"
                  @click="removePhone(index)" 
                  class="text-red-400 text-sm hover:text-red-300"
                >
                  ลบ
                </button>
              </div>
              <div class="space-y-2">
                <input 
                  type="text" 
                  v-model="phone.number"
                  placeholder="เบอร์โทรศัพท์"
                  class="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-white text-sm focus:outline-none focus:border-red-primary"
                />
                <input 
                  type="text" 
                  v-model="phone.label"
                  placeholder="ป้ายกำกับ (เช่น ฝ่ายขาย, ฝ่ายบริการ)"
                  class="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-white text-sm focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>
            <button @click="addPhone" class="btn-secondary w-full">เพิ่มเบอร์โทรศัพท์</button>
          </div>
        </div>

        <!-- Email Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">อีเมล</h2>
          <div>
            <label class="block text-gray-300 mb-2">อีเมล</label>
            <input 
              type="email" 
              v-model="contactSettings.email"
              class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              placeholder="info@muaythai.academy"
            />
          </div>
        </div>

        <!-- Operating Hours Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">เวลาทำการ</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">วันจันทร์ - วันศุกร์</label>
              <input 
                type="text" 
                v-model="contactSettings.operatingHours.weekday"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="09:00 - 21:00"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">วันเสาร์ - วันอาทิตย์</label>
              <input 
                type="text" 
                v-model="contactSettings.operatingHours.weekend"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="08:00 - 18:00"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">หมายเหตุ</label>
              <input 
                type="text" 
                v-model="contactSettings.operatingHours.note"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="ปิดวันหยุดนักขัตฤกษ์"
              />
            </div>
          </div>
        </div>

        <!-- Social Media Section -->
        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">Social Media</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">Facebook</label>
              <input 
                type="url" 
                v-model="contactSettings.social.facebook"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">Instagram</label>
              <input 
                type="url" 
                v-model="contactSettings.social.instagram"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">Line</label>
              <input 
                type="text" 
                v-model="contactSettings.social.line"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="@linename หรือ URL"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">ตัวอย่าง</h2>
          <div class="bg-dark-bg rounded-lg p-4 border border-dark-border text-sm space-y-3">
            <!-- Address Preview -->
            <div>
              <p class="text-gray-400 text-xs mb-1">ที่อยู่</p>
              <p class="text-white">
                <span v-if="contactSettings.address.line1">{{ contactSettings.address.line1 }}<br></span>
                <span v-if="contactSettings.address.line2">{{ contactSettings.address.line2 }}<br></span>
                <span v-if="contactSettings.address.line3">{{ contactSettings.address.line3 }}</span>
                <span v-if="contactSettings.address.postalCode"> {{ contactSettings.address.postalCode }}</span>
                <span v-if="!contactSettings.address.line1 && !contactSettings.address.line2 && !contactSettings.address.line3" class="text-gray-500">-</span>
              </p>
            </div>

            <!-- Phone Preview -->
            <div>
              <p class="text-gray-400 text-xs mb-1">โทรศัพท์</p>
              <p class="text-white" v-if="contactSettings.phones.length > 0">
                <span v-for="(phone, index) in contactSettings.phones" :key="index">
                  {{ phone.number || '-' }}<br>
                </span>
              </p>
              <p v-else class="text-gray-500">-</p>
            </div>

            <!-- Email Preview -->
            <div>
              <p class="text-gray-400 text-xs mb-1">อีเมล</p>
              <p class="text-white">{{ contactSettings.email || '-' }}</p>
            </div>

            <!-- Hours Preview -->
            <div>
              <p class="text-gray-400 text-xs mb-1">เวลาทำการ</p>
              <p class="text-white text-xs">
                <span v-if="contactSettings.operatingHours.weekday">จันทร์ - ศุกร์: {{ contactSettings.operatingHours.weekday }}<br></span>
                <span v-if="contactSettings.operatingHours.weekend">เสาร์ - อาทิตย์: {{ contactSettings.operatingHours.weekend }}<br></span>
                <span v-if="contactSettings.operatingHours.note" class="text-red-400">{{ contactSettings.operatingHours.note }}</span>
                <span v-if="!contactSettings.operatingHours.weekday && !contactSettings.operatingHours.weekend" class="text-gray-500">-</span>
              </p>
            </div>
          </div>
          <div v-if="error" class="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {{ error }}
          </div>
          <button 
            @click="saveContactSettings"
            :disabled="saving"
            class="btn-primary w-full mb-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
          </button>
          <button 
            @click="resetContactSettings"
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

const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const contactSettings = ref({
  address: {
    line1: '',
    line2: '',
    line3: '',
    postalCode: ''
  },
  phones: [
    { number: '', label: '' }
  ],
  email: '',
  operatingHours: {
    weekday: '09:00 - 21:00',
    weekend: '08:00 - 18:00',
    note: 'ปิดวันหยุดนักขัตฤกษ์'
  },
  social: {
    facebook: '',
    instagram: '',
    line: ''
  }
})

// Fetch contact settings from API
const fetchContactSettings = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.contact) {
      contactSettings.value = {
        address: {
          line1: response.contact.address?.line1 || '',
          line2: response.contact.address?.line2 || '',
          line3: response.contact.address?.line3 || '',
          postalCode: response.contact.address?.postalCode || ''
        },
        phones: response.contact.phones && response.contact.phones.length > 0 
          ? response.contact.phones 
          : [{ number: '', label: '' }],
        email: response.contact.email || '',
        operatingHours: {
          weekday: response.contact.operatingHours?.weekday || '09:00 - 21:00',
          weekend: response.contact.operatingHours?.weekend || '08:00 - 18:00',
          note: response.contact.operatingHours?.note || 'ปิดวันหยุดนักขัตฤกษ์'
        },
        social: {
          facebook: response.contact.social?.facebook || '',
          instagram: response.contact.social?.instagram || '',
          line: response.contact.social?.line || ''
        }
      }
    }
  } catch (err) {
    console.error('Error fetching contact settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const addPhone = () => {
  contactSettings.value.phones.push({ number: '', label: '' })
}

const removePhone = (index) => {
  if (contactSettings.value.phones.length > 1) {
    contactSettings.value.phones.splice(index, 1)
  }
}

const saveContactSettings = async () => {
  saving.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings/contact`, {
      method: 'PUT',
      body: contactSettings.value
    })
    
    if (response) {
      alert('บันทึกการตั้งค่าข้อมูลติดต่อสำเร็จ')
      await fetchContactSettings()
    }
  } catch (err) {
    console.error('Error saving contact settings:', err)
    error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    saving.value = false
  }
}

const resetContactSettings = async () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    contactSettings.value = {
      address: {
        line1: '',
        line2: '',
        line3: '',
        postalCode: ''
      },
      phones: [
        { number: '', label: '' }
      ],
      email: '',
      operatingHours: {
        weekday: '09:00 - 21:00',
        weekend: '08:00 - 18:00',
        note: 'ปิดวันหยุดนักขัตฤกษ์'
      },
      social: {
        facebook: '',
        instagram: '',
        line: ''
      }
    }
    await saveContactSettings()
  }
}

// Load settings on mount
onMounted(() => {
  fetchContactSettings()
})
</script>

