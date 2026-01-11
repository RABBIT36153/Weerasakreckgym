<template>
  <div class="py-12 px-4">
    <div class="container mx-auto max-w-6xl">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
        ติดต่อเรา
      </h1>
      <p class="text-center text-gray-400 mb-12 text-lg">
        เรายินดีตอบคำถามและให้คำปรึกษา
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Contact Form -->
        <div class="card">
          <h2 class="text-2xl font-bold mb-6 text-white">ส่งข้อความถึงเรา</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-gray-300 mb-2 font-medium">
                ชื่อ-นามสกุล
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="กรุณากรอกชื่อ-นามสกุล"
                class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                required
              />
            </div>

            <div>
              <label class="block text-gray-300 mb-2 font-medium">
                อีเมล
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                required
              />
            </div>

            <div>
              <label class="block text-gray-300 mb-2 font-medium">
                เบอร์โทรศัพท์
              </label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="08X-XXX-XXXX"
                class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                required
              />
            </div>

            <div>
              <label class="block text-gray-300 mb-2 font-medium">
                หัวข้อ
              </label>
              <select
                v-model="form.subject"
                class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary transition-colors"
                required
              >
                <option value="">เลือกหัวข้อ</option>
                <option value="course">สอบถามเกี่ยวกับคอร์สเรียน</option>
                <option value="trainer">สอบถามเกี่ยวกับครูมวย</option>
                <option value="schedule">สอบถามเกี่ยวกับตารางเรียน</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-300 mb-2 font-medium">
                ข้อความ
              </label>
              <textarea
                v-model="form.message"
                rows="6"
                placeholder="กรุณากรอกข้อความของคุณ..."
                class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'กำลังส่ง...' : 'ส่งข้อความ' }}
            </button>
          </form>
        </div>

        <!-- Contact Information -->
        <div class="space-y-6">
          <!-- Address Card -->
          <div class="card">
            <div class="flex items-start space-x-4">
              <div class="text-4xl">📍</div>
              <div>
                <h3 class="text-xl font-bold text-white mb-2">ที่อยู่</h3>
                <p v-if="contactInfo.address && (contactInfo.address.line1 || contactInfo.address.line2 || contactInfo.address.line3)" class="text-gray-400">
                  <span v-if="contactInfo.address.line1">{{ contactInfo.address.line1 }}<br></span>
                  <span v-if="contactInfo.address.line2">{{ contactInfo.address.line2 }}<br></span>
                  <span v-if="contactInfo.address.line3">{{ contactInfo.address.line3 }}</span>
                  <span v-if="contactInfo.address.postalCode"> {{ contactInfo.address.postalCode }}</span>
                </p>
                <p v-else class="text-gray-500">ยังไม่ได้ตั้งค่าที่อยู่</p>
              </div>
            </div>
          </div>

          <!-- Phone Card -->
          <div class="card">
            <div class="flex items-start space-x-4">
              <div class="text-4xl">📞</div>
              <div>
                <h3 class="text-xl font-bold text-white mb-2">โทรศัพท์</h3>
                <p v-if="contactInfo.phones && contactInfo.phones.length > 0 && contactInfo.phones.some(p => p.number)" class="text-gray-400">
                  <a 
                    v-for="(phone, index) in contactInfo.phones.filter(p => p.number)" 
                    :key="index"
                    :href="`tel:${phone.number.replace(/-/g, '').replace(/\s/g, '')}`" 
                    class="hover:text-red-primary transition-colors block"
                  >
                    {{ phone.number }}
                  </a>
                </p>
                <p v-else class="text-gray-500">ยังไม่ได้ตั้งค่าเบอร์โทรศัพท์</p>
              </div>
            </div>
          </div>

          <!-- Email Card -->
          <div class="card">
            <div class="flex items-start space-x-4">
              <div class="text-4xl">📧</div>
              <div>
                <h3 class="text-xl font-bold text-white mb-2">อีเมล</h3>
                <p v-if="contactInfo.email" class="text-gray-400">
                  <a :href="`mailto:${contactInfo.email}`" class="hover:text-red-primary transition-colors">
                    {{ contactInfo.email }}
                  </a>
                </p>
                <p v-else class="text-gray-500">ยังไม่ได้ตั้งค่าอีเมล</p>
              </div>
            </div>
          </div>

          <!-- Hours Card -->
          <div class="card">
            <div class="flex items-start space-x-4">
              <div class="text-4xl">🕐</div>
              <div>
                <h3 class="text-xl font-bold text-white mb-2">เวลาทำการ</h3>
                <div v-if="contactInfo.operatingHours && (contactInfo.operatingHours.weekday || contactInfo.operatingHours.weekend)" class="text-gray-400 space-y-1">
                  <p v-if="contactInfo.operatingHours.weekday">จันทร์ - ศุกร์: {{ contactInfo.operatingHours.weekday }}</p>
                  <p v-if="contactInfo.operatingHours.weekend">เสาร์ - อาทิตย์: {{ contactInfo.operatingHours.weekend }}</p>
                  <p v-if="contactInfo.operatingHours.note" class="text-red-primary mt-2">{{ contactInfo.operatingHours.note }}</p>
                </div>
                <p v-else class="text-gray-500">ยังไม่ได้ตั้งค่าเวลาทำการ</p>
              </div>
            </div>
          </div>

          <!-- Social Media Card -->
          <div v-if="contactInfo.social && (contactInfo.social.facebook || contactInfo.social.instagram || contactInfo.social.line)" class="card">
            <h3 class="text-xl font-bold text-white mb-4">ติดตามเรา</h3>
            <div class="space-y-3">
              <!-- Facebook -->
              <a 
                v-if="contactInfo.social.facebook"
                :href="contactInfo.social.facebook" 
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 p-3 bg-dark-surface rounded-lg hover:bg-dark-border transition-colors group"
              >
                <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span class="text-gray-300 group-hover:text-white transition-colors">{{ getSocialDisplayText(contactInfo.social.facebook) }}</span>
              </a>

              <!-- Instagram -->
              <a 
                v-if="contactInfo.social.instagram"
                :href="contactInfo.social.instagram" 
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 p-3 bg-dark-surface rounded-lg hover:bg-dark-border transition-colors group"
              >
                <div class="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span class="text-gray-300 group-hover:text-white transition-colors">{{ getSocialDisplayText(contactInfo.social.instagram) }}</span>
              </a>

              <!-- Line -->
              <a 
                v-if="contactInfo.social.line"
                :href="getLineUrl(contactInfo.social.line)" 
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 p-3 bg-dark-surface rounded-lg hover:bg-dark-border transition-colors group"
              >
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062.917l-.164.975c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                </div>
                <span class="text-gray-300 group-hover:text-white transition-colors">{{ getSocialDisplayText(contactInfo.social.line) }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="mt-12 card">
        <h2 class="text-2xl font-bold mb-6 text-white">แผนที่</h2>
        <div class="bg-dark-surface rounded-lg h-96 flex items-center justify-center border border-dark-border">
          <div class="text-center text-gray-400">
            <div class="text-6xl mb-4">🗺️</div>
            <p>แผนที่ Google Maps</p>
            <p class="text-sm mt-2">(สามารถเชื่อมต่อ Google Maps API ได้)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { public: { apiBaseUrl } } = useRuntimeConfig()
const API_BASE_URL = `${apiBaseUrl}/api`

const submitting = ref(false)
const loading = ref(false)
const contactInfo = ref({
  address: {
    line1: '',
    line2: '',
    line3: '',
    postalCode: ''
  },
  phones: [],
  email: '',
  operatingHours: {
    weekday: '',
    weekend: '',
    note: ''
  },
  social: {
    facebook: '',
    instagram: '',
    line: ''
  }
})

// Fetch contact information from API
const fetchContactInfo = async () => {
  loading.value = true
  try {
    const response = await $fetch(`${API_BASE_URL}/ui-settings`)
    if (response && response.contact) {
      contactInfo.value = {
        address: {
          line1: response.contact.address?.line1 || '',
          line2: response.contact.address?.line2 || '',
          line3: response.contact.address?.line3 || '',
          postalCode: response.contact.address?.postalCode || ''
        },
        phones: response.contact.phones && Array.isArray(response.contact.phones) ? response.contact.phones : [],
        email: response.contact.email || '',
        operatingHours: {
          weekday: response.contact.operatingHours?.weekday || '',
          weekend: response.contact.operatingHours?.weekend || '',
          note: response.contact.operatingHours?.note || ''
        },
        social: {
          facebook: response.contact.social?.facebook || '',
          instagram: response.contact.social?.instagram || '',
          line: response.contact.social?.line || ''
        }
      }
    }
  } catch (err) {
    console.error('Error fetching contact info:', err)
  } finally {
    loading.value = false
  }
}

// Get display text for social media (extract username or show full URL)
const getSocialDisplayText = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) {
    // Extract username from URL
    const match = url.match(/(?:instagram\.com|facebook\.com)\/([^\/\?]+)/i)
    if (match && match[1]) {
      return match[1]
    }
    return url
  }
  return url
}

// Get Line URL
const getLineUrl = (lineId) => {
  if (!lineId) return ''
  if (lineId.startsWith('http')) {
    return lineId
  }
  // Remove @ if present
  const cleanId = lineId.replace('@', '')
  return `https://line.me/R/ti/p/${cleanId}`
}

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const handleSubmit = async () => {
  submitting.value = true
  
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  alert('ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด')
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }
  
  submitting.value = false
}

// Load contact info on mount
onMounted(() => {
  fetchContactInfo()
})
</script>

