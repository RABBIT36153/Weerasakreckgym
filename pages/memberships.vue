<template>
  <div class="py-12 px-4">
    <div class="container mx-auto max-w-5xl">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">
          สมัครสมาชิก
        </h1>
        <p class="text-gray-400 text-lg">
          เลือกแพ็คเกจสมาชิกที่เหมาะกับคุณ
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400 text-lg">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 text-lg">{{ error }}</p>
        <button @click="fetchMemberships" class="btn-primary mt-4">ลองอีกครั้ง</button>
      </div>

      <!-- Package Selection -->
      <div v-else-if="memberships.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div 
          v-for="membership in memberships" 
          :key="membership._id || membership.id"
          class="card cursor-pointer transition-all duration-300 hover:transform hover:scale-105 relative"
          :class="selectedPackage === (membership._id || membership.id) ? 'border-red-primary border-2' : 'hover:border-red-primary'"
          @click="selectPackage(membership)"
        >
          <div class="text-center">
            <div class="text-4xl mb-4">💳</div>
            <h3 class="text-2xl font-bold mb-2 text-white">{{ membership.name }}</h3>
            <div class="mb-4">
              <span class="text-3xl font-bold text-red-primary">{{ formatPrice(membership.price) }}</span>
              <span class="text-gray-400"> บาท/เดือน</span>
            </div>
            <p v-if="membership.description" class="text-gray-400 text-sm">{{ membership.description }}</p>
            <div v-if="membership.originalPrice && membership.originalPrice > membership.price" class="mt-2">
              <p class="text-gray-500 text-xs line-through">{{ formatPrice(membership.originalPrice) }} บาท/เดือน</p>
              <p class="text-green-400 text-sm font-semibold">
                ประหยัด {{ formatPrice(membership.originalPrice - membership.price) }} บาท/เดือน
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-400 text-lg">ยังไม่มีแพ็คเกจสมาชิก</p>
      </div>

      <!-- Package Details -->
      <div v-if="selectedMembership" class="card mb-8">
        <h2 class="text-2xl font-bold mb-6 text-white text-center">รายละเอียดแพ็คเกจ</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-xl font-bold mb-4 text-white">สิทธิประโยชน์</h3>
            <ul v-if="selectedMembership.benefits && selectedMembership.benefits.length > 0" class="space-y-3">
              <li 
                v-for="(benefit, index) in selectedMembership.benefits" 
                :key="index"
                class="flex items-start text-gray-300"
              >
                <svg class="w-5 h-5 text-red-primary mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{{ benefit }}</span>
              </li>
            </ul>
            <p v-else class="text-gray-400">ไม่มีสิทธิประโยชน์ที่ระบุ</p>
          </div>
          
          <div>
            <h3 class="text-xl font-bold mb-4 text-white">สรุปราคา</h3>
            <div class="bg-dark-surface rounded-lg p-4 space-y-3">
              <div class="flex justify-between text-gray-300">
                <span>{{ selectedMembership.name }}</span>
                <span>{{ formatPrice(selectedMembership.price) }} บาท/เดือน</span>
              </div>
              <div v-if="selectedMembership.originalPrice && selectedMembership.originalPrice > selectedMembership.price" class="flex justify-between text-gray-400 text-sm">
                <span>ราคาเดิม</span>
                <span class="line-through">{{ formatPrice(selectedMembership.originalPrice) }} บาท/เดือน</span>
              </div>
              <div class="flex justify-between text-gray-400 text-sm">
                <span>ระยะเวลา</span>
                <span>{{ selectedMembership.duration }} วัน</span>
              </div>
              <div v-if="selectedMembership.originalPrice && selectedMembership.originalPrice > selectedMembership.price" class="flex justify-between text-green-400 text-sm">
                <span>ประหยัดได้</span>
                <span>{{ formatPrice(selectedMembership.originalPrice - selectedMembership.price) }} บาท/เดือน</span>
              </div>
              <div class="border-t border-dark-border pt-3 mt-3">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-white">ราคารายเดือน</span>
                  <span class="text-2xl font-bold text-red-primary">{{ formatPrice(selectedMembership.price) }} บาท</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button 
            @click="proceedToPayment" 
            class="btn-primary text-lg px-8"
          >
            ดำเนินการชำระเงิน
          </button>
        </div>
      </div>

      <!-- Instruction if no package selected -->
      <div v-else-if="!loading && !error && memberships.length > 0" class="text-center py-8">
        <p class="text-gray-400 text-lg">กรุณาเลือกแพ็คเกจที่ต้องการ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const { public: { apiBaseUrl } } = useRuntimeConfig()
const API_BASE_URL = `${apiBaseUrl}/api`
const memberships = ref([])
const loading = ref(false)
const error = ref(null)
const selectedPackage = ref(null)
const selectedMembership = ref(null)

// SEO Meta Tags
useHead({
  title: 'แพ็คเกจสมาชิกรายเดือน - Weerasakreckgym | สอนมวยไทย ออกกำลังกายด้วยมวย',
  meta: [
    { name: 'description', content: 'แพ็คเกจสมาชิกรายเดือน Weerasakreckgym สอนมวยไทย ออกกำลังกายด้วยมวยไทย เข้าคลาสได้ไม่จำกัด พร้อมสิทธิพิเศษต่างๆ' },
    { name: 'keywords', content: 'weerasakreckgym, สอนมวยไทย, ออกกำลังกายด้วยมวย, สมาชิกรายเดือน, membership, Muay Thai Membership' },
    { property: 'og:title', content: 'แพ็คเกจสมาชิกรายเดือน - Weerasakreckgym' },
    { property: 'og:description', content: 'แพ็คเกจสมาชิกรายเดือน เข้าคลาสได้ไม่จำกัด' },
    { property: 'og:type', content: 'website' }
  ]
})

// Fetch memberships from API
const fetchMemberships = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE_URL}/memberships?status=active`)
    memberships.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error fetching memberships:', err)
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลแพ็คเกจสมาชิก'
  } finally {
    loading.value = false
  }
}

// Format price with thousand separator
const formatPrice = (price) => {
  if (!price) return '0'
  return Number(price).toLocaleString('th-TH')
}

const selectPackage = (membership) => {
  selectedPackage.value = membership._id || membership.id
  selectedMembership.value = membership
}

const proceedToPayment = () => {
  if (!selectedMembership.value) {
    alert('กรุณาเลือกแพ็คเกจ')
    return
  }

  const membershipId = selectedMembership.value._id || selectedMembership.value.id
  const membershipName = selectedMembership.value.name
  const price = selectedMembership.value.price
  
  // Navigate to payment page
  router.push({
    path: '/payment',
    query: {
      membershipId: membershipId,
      membershipName: membershipName,
      price: price
    }
  })
}

// Load memberships on mount
onMounted(() => {
  fetchMemberships()
})
</script>

