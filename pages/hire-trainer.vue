<template>
  <div class="py-12 px-4">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
        จ้างงานครูมวยไปต่างประเทศ
      </h1>
      <p class="text-center text-gray-400 mb-12 text-lg">
        กรุณากรอกข้อมูลติดต่อของคุณเพื่อเราจะได้ติดต่อกลับ
      </p>

      <!-- Error Message -->
      <div v-if="error" class="card mb-6 bg-red-900 bg-opacity-50 border border-red-500">
        <p class="text-red-300">{{ error }}</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Contact Information Section -->
          <div>
            <h2 class="text-2xl font-bold mb-6 text-white border-b border-dark-border pb-3">
              ข้อมูลติดต่อ
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-gray-300 mb-2 font-medium">
                  ชื่อ-นามสกุล <span class="text-red-primary">*</span>
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
                  อีเมล <span class="text-red-primary">*</span>
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
                  เบอร์โทรศัพท์ <span class="text-red-primary">*</span>
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
                  ประเทศที่ต้องการจ้าง <span class="text-red-primary">*</span>
                </label>
                <input
                  v-model="form.country"
                  type="text"
                  placeholder="ตัวอย่าง: สหรัฐอเมริกา"
                  class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div>
            <h2 class="text-2xl font-bold mb-6 text-white border-b border-dark-border pb-3">
              ที่อยู่
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-gray-300 mb-2 font-medium">
                  ที่อยู่ <span class="text-red-primary">*</span>
                </label>
                <textarea
                  v-model="form.address"
                  rows="3"
                  placeholder="บ้านเลขที่, ถนน, หมู่บ้าน, อาคาร..."
                  class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-gray-300 mb-2 font-medium">
                    จังหวัด/รัฐ <span class="text-red-primary">*</span>
                  </label>
                  <input
                    v-model="form.province"
                    type="text"
                    placeholder="กรุณากรอกจังหวัด/รัฐ"
                    class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label class="block text-gray-300 mb-2 font-medium">
                    อำเภอ/เมือง <span class="text-red-primary">*</span>
                  </label>
                  <input
                    v-model="form.district"
                    type="text"
                    placeholder="กรุณากรอกอำเภอ/เมือง"
                    class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label class="block text-gray-300 mb-2 font-medium">
                    รหัสไปรษณีย์ <span class="text-red-primary">*</span>
                  </label>
                  <input
                    v-model="form.postalCode"
                    type="text"
                    placeholder="กรุณากรอกรหัสไปรษณีย์"
                    class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div>
            <h2 class="text-2xl font-bold mb-6 text-white border-b border-dark-border pb-3">
              ข้อมูลเพิ่มเติม
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-gray-300 mb-2 font-medium">
                  ระยะเวลาที่ต้องการจ้าง (เดือน)
                </label>
                <input
                  v-model="form.duration"
                  type="text"
                  placeholder="ตัวอย่าง: 3 เดือน, 6 เดือน, 1 ปี"
                  class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                />
              </div>

              <div>
                <label class="block text-gray-300 mb-2 font-medium">
                  ข้อความเพิ่มเติม
                </label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="กรุณาระบุรายละเอียดเพิ่มเติม เช่น ประเภทของงาน, ความต้องการเฉพาะ, เงื่อนไขพิเศษ..."
                  class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-dark-border">
            <NuxtLink to="/trainers" class="btn-secondary">
              ยกเลิก
            </NuxtLink>
            <button
              type="submit"
              :disabled="submitting"
              class="btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูล' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const API_BASE_URL = 'http://localhost:4002/api'
const trainerId = ref(route.query.trainerId || null)
const submitting = ref(false)
const error = ref(null)

const form = ref({
  name: '',
  email: '',
  phone: '',
  country: '',
  address: '',
  province: '',
  district: '',
  postalCode: '',
  duration: '',
  message: ''
})

const handleSubmit = async () => {
  if (!trainerId.value) {
    alert('ไม่พบข้อมูลครูมวย กรุณากลับไปเลือกครูมวยก่อน')
    router.push('/trainers')
    return
  }

  submitting.value = true
  error.value = null
  
  try {
    const hireRequestData = {
      trainerId: trainerId.value,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      country: form.value.country,
      address: form.value.address,
      province: form.value.province,
      district: form.value.district,
      postalCode: form.value.postalCode,
      duration: form.value.duration,
      message: form.value.message
    }

    const response = await $fetch(`${API_BASE_URL}/hire-requests`, {
      method: 'POST',
      body: hireRequestData
    })
    
    if (response.success) {
      alert('ส่งข้อมูลสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด')
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        province: '',
        district: '',
        postalCode: '',
        duration: '',
        message: ''
      }
      
      // Redirect to trainers page
      router.push('/trainers')
    } else {
      throw new Error('การส่งข้อมูลไม่สำเร็จ')
    }
  } catch (err) {
    console.error('Error submitting form:', err)
    error.value = 'เกิดข้อผิดพลาดในการส่งข้อมูล: ' + (err.data?.error || err.message)
    alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    submitting.value = false
  }
}

// Check if trainerId exists on mount
onMounted(() => {
  if (!trainerId.value) {
    alert('ไม่พบข้อมูลครูมวย กรุณากลับไปเลือกครูมวยก่อน')
    router.push('/trainers')
  }
})
</script>

