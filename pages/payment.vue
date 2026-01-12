<template>
  <div class="py-12 px-4">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-8 text-white">
        ชำระเงิน
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="card sticky top-24">
            <h2 class="text-2xl font-bold mb-4 text-white">สรุปคำสั่งซื้อ</h2>
            
            <div v-if="loading" class="text-center py-8">
              <p class="text-gray-400">กำลังโหลดข้อมูล...</p>
            </div>
            
            <template v-else>
            <div class="mb-4 pb-4 border-b border-dark-border">
                <p class="text-gray-400 mb-2">{{ membershipId ? 'แพ็คเกจสมาชิก' : courseId ? 'คอร์สเรียน' : 'ครูมวย' }}</p>
                <p class="text-lg font-semibold text-white">{{ itemName || 'คอร์สพื้นฐาน' }}</p>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-gray-400">
                  <span>ราคา</span>
                  <span>{{ formatPrice(originalPrice) }} บาท</span>
              </div>
                <div v-if="!membershipId" class="flex justify-between text-gray-400">
                <span>ส่วนลด</span>
                <span class="text-red-primary">-500 บาท</span>
              </div>
            </div>

            <div class="border-t border-dark-border pt-4">
              <div class="flex justify-between items-center">
                <span class="text-xl font-bold text-white">รวมทั้งสิ้น</span>
                  <span class="text-2xl font-bold text-red-primary">{{ formatPrice(totalPrice) }} บาท</span>
              </div>
            </div>
            </template>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="lg:col-span-2">
          <div class="card">
            <h2 class="text-2xl font-bold mb-6 text-white">ข้อมูลการชำระเงิน</h2>

            <form @submit.prevent="handlePayment" class="space-y-6">
              <!-- Card Number -->
              <div>
                <label class="block text-gray-300 mb-2 font-medium">
                  หมายเลขบัตรเครดิต
                </label>
                <input
                  v-model="form.cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="formatCardNumber"
                  class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                  required
                />
              </div>

              <!-- Card Holder Name -->
              <div>
                <label class="block text-gray-300 mb-2 font-medium">
                  ชื่อผู้ถือบัตร
                </label>
                <input
                  v-model="form.cardHolder"
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                  required
                />
              </div>

              <!-- Expiry and CVV -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-300 mb-2 font-medium">
                    วันหมดอายุ
                  </label>
                  <input
                    v-model="form.expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxlength="5"
                    @input="formatExpiry"
                    class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label class="block text-gray-300 mb-2 font-medium">
                    CVV
                  </label>
                  <input
                    v-model="form.cvv"
                    type="text"
                    placeholder="123"
                    maxlength="4"
                    class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
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

              <!-- Phone -->
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

              <!-- Terms -->
              <div class="flex items-start">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="mt-1 mr-3 w-5 h-5 text-red-primary bg-dark-surface border-dark-border rounded focus:ring-red-primary"
                  required
                />
                <label class="text-gray-400 text-sm">
                  ฉันยอมรับ <a href="#" class="text-red-primary hover:underline">ข้อกำหนดและเงื่อนไข</a> 
                  และ <a href="#" class="text-red-primary hover:underline">นโยบายความเป็นส่วนตัว</a>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="processing"
                class="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ processing ? 'กำลังประมวลผล...' : `ชำระเงิน ${totalPrice} บาท` }}
              </button>
            </form>
          </div>

          <!-- Security Info -->
          <div class="mt-6 card bg-dark-surface">
            <div class="flex items-center justify-center space-x-4 text-gray-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <p class="text-sm">การชำระเงินของคุณปลอดภัยและเข้ารหัส</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const { public: { apiBaseUrl } } = useRuntimeConfig()
const API_BASE_URL = `${apiBaseUrl}/api`

const courseId = ref(route.query.courseId || null)
const trainerId = ref(route.query.trainerId || null)
const membershipId = ref(route.query.membershipId || null)
const itemName = ref('')
const originalPrice = ref(0)
const loading = ref(false)
const processing = ref(false)
const error = ref(null)

// SEO Meta Tags
useHead({
  title: 'ชำระเงิน - Weerasakreckgym | สอนมวยไทย ออกกำลังกายด้วยมวย',
  meta: [
    { name: 'description', content: 'ชำระเงินคอร์สเรียนมวยไทย Weerasakreckgym สอนมวยไทย ออกกำลังกายด้วยมวยไทย ชำระเงินด้วยบัตรเครดิต' },
    { name: 'keywords', content: 'weerasakreckgym, สอนมวยไทย, ออกกำลังกายด้วยมวย, ชำระเงิน, payment, Muay Thai Payment' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Total price (no discount for membership)
const totalPrice = computed(() => {
  // For membership, use the price directly without discount
  if (membershipId.value) {
    return originalPrice.value
  }
  // For course/trainer, apply discount
  return Math.max(0, originalPrice.value - 500)
})

// Format price with thousand separator
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('th-TH')
}

const form = ref({
  cardNumber: '',
  cardHolder: '',
  expiry: '',
  cvv: '',
  email: '',
  phone: '',
  acceptTerms: false
})

const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\s/g, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  form.value.cardNumber = formattedValue
}

const formatExpiry = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  form.value.expiry = value
}

// Fetch course, trainer, or membership data
const fetchItemData = async () => {
  if (!courseId.value && !trainerId.value && !membershipId.value) {
    error.value = 'ไม่พบข้อมูลคอร์ส, ครูมวย หรือแพ็คเกจสมาชิก'
    return
  }

  loading.value = true
  error.value = null

  try {
    if (courseId.value) {
      const course = await $fetch(`${API_BASE_URL}/courses/${courseId.value}`)
      itemName.value = course.name
      originalPrice.value = typeof course.price === 'number' ? course.price : parseInt(course.price.toString().replace(/,/g, ''))
    } else if (trainerId.value) {
      const trainer = await $fetch(`${API_BASE_URL}/trainers/${trainerId.value}`)
      itemName.value = trainer.name
      originalPrice.value = typeof trainer.price === 'number' ? trainer.price : parseInt(trainer.price.toString().replace(/,/g, ''))
    } else if (membershipId.value) {
      const membership = await $fetch(`${API_BASE_URL}/memberships/${membershipId.value}`)
      itemName.value = membership.name
      originalPrice.value = typeof membership.price === 'number' ? membership.price : parseInt(membership.price.toString().replace(/,/g, ''))
    }
  } catch (err) {
    console.error('Error fetching item data:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + (err.data?.error || err.message)
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + (err.data?.error || err.message))
  } finally {
    loading.value = false
  }
}

const handlePayment = async () => {
  processing.value = true
  error.value = null
  
  try {
    // If it's a membership, POST to members API
    if (membershipId.value) {
      // Fetch membership details to get duration
      const membership = await $fetch(`${API_BASE_URL}/memberships/${membershipId.value}`)
      
      // Prepare member data
      // Note: startDate and endDate will be calculated by API based on phone number
      // If phone exists, startDate will be set to the day after the latest endDate
      const memberData = {
        name: form.value.cardHolder,
        email: form.value.email,
        phone: form.value.phone,
        membershipId: membershipId.value,
        membershipType: itemName.value || membership.name,
        // Don't send startDate and endDate - let API calculate based on existing phone number
        status: 'active',
        autoRenew: false,
        paymentMethod: 'credit_card',
        notes: `ชำระเงินผ่านบัตรเครดิต - ราคา ${totalPrice.value} บาท`
      }

      // POST to members API
      const response = await $fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        body: memberData
      })

      if (response.success) {
        alert('สมัครสมาชิกสำเร็จ! ขอบคุณที่ใช้บริการ')
  router.push('/')
      } else {
        throw new Error('การสมัครสมาชิกไม่สำเร็จ')
      }
    } else {
      // For course/trainer, use registrations API
      const registrationData = {
        userEmail: form.value.email,
        userPhone: form.value.phone,
        userName: form.value.cardHolder, // Using card holder name as user name
        cardNumber: form.value.cardNumber,
        cardHolder: form.value.cardHolder,
        price: totalPrice.value, // Total price after discount
        paymentMethod: 'credit_card',
        paymentStatus: 'pending',
        status: 'pending'
      }

      // Add courseId or trainerId
      if (courseId.value) {
        registrationData.courseId = courseId.value
        registrationData.itemName = itemName.value
      } else if (trainerId.value) {
        registrationData.trainerId = trainerId.value
        registrationData.itemName = itemName.value
      } else {
        alert('ไม่พบข้อมูลคอร์สหรือครูมวย')
        processing.value = false
        return
      }

      // POST to registrations API
      const response = await $fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        body: registrationData
      })

      if (response.success) {
        alert('ลงทะเบียนสำเร็จ! ขอบคุณที่ใช้บริการ')
        router.push('/')
      } else {
        throw new Error('การลงทะเบียนไม่สำเร็จ')
      }
    }
  } catch (err) {
    console.error('Error processing payment:', err)
    error.value = 'เกิดข้อผิดพลาดในการชำระเงิน: ' + (err.data?.error || err.message)
    alert('เกิดข้อผิดพลาดในการชำระเงิน: ' + (err.data?.error || err.message))
  } finally {
  processing.value = false
}
}

// Load item data on mount
onMounted(() => {
  fetchItemData()
})
</script>

