<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">ตั้งค่าทั่วไป</h1>
      <p class="text-gray-400">จัดการการตั้งค่าทั่วไปของระบบ</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">ข้อมูลโรงเรียน</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">ชื่อโรงเรียน</label>
              <input 
                type="text" 
                v-model="settings.schoolName"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="Muay Thai Academy"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">คำอธิบาย</label>
              <textarea 
                v-model="settings.description"
                rows="4"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="คำอธิบายเกี่ยวกับโรงเรียน..."
              ></textarea>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ที่อยู่</label>
              <input 
                type="text" 
                v-model="settings.address"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="ที่อยู่โรงเรียน"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">เบอร์โทรศัพท์</label>
                <input 
                  type="tel" 
                  v-model="settings.phone"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="02-xxx-xxxx"
                />
              </div>
              <div>
                <label class="block text-gray-300 mb-2">อีเมล</label>
                <input 
                  type="email" 
                  v-model="settings.email"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="info@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">การตั้งค่าอื่นๆ</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">เปิดใช้งานการลงทะเบียนออนไลน์</label>
                <p class="text-sm text-gray-500">อนุญาตให้ผู้ใช้ลงทะเบียนผ่านเว็บไซต์</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.enableOnlineRegistration" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">แสดงคอร์สยอดนิยม</label>
                <p class="text-sm text-gray-500">แสดงคอร์สยอดนิยมในหน้าแรก</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.showPopularCourses" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">บันทึกการตั้งค่า</h2>
          <button 
            @click="saveSettings"
            class="btn-primary w-full mb-3"
          >
            บันทึกการตั้งค่า
          </button>
          <button 
            @click="resetSettings"
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

const settings = ref({
  schoolName: 'Muay Thai Academy',
  description: '',
  address: '',
  phone: '',
  email: '',
  enableOnlineRegistration: true,
  showPopularCourses: true
})

const saveSettings = () => {
  // Add save logic here
  console.log('Saving settings:', settings.value)
  alert('บันทึกการตั้งค่าสำเร็จ')
}

const resetSettings = () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    // Add reset logic here
    console.log('Resetting settings')
  }
}
</script>

