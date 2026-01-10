<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">โปรไฟล์</h1>
      <p class="text-gray-400">จัดการข้อมูลโปรไฟล์ของคุณ</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">ข้อมูลส่วนตัว</h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-6">
              <div class="w-24 h-24 rounded-full bg-dark-card border-2 border-dark-border flex items-center justify-center">
                <span class="text-3xl text-gray-400">A</span>
              </div>
              <div>
                <button class="btn-secondary mb-2">เปลี่ยนรูปภาพ</button>
                <p class="text-sm text-gray-500">JPG, PNG หรือ GIF สูงสุด 2MB</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">ชื่อ</label>
                <input 
                  type="text" 
                  v-model="profile.firstName"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="ชื่อ"
                />
              </div>
              <div>
                <label class="block text-gray-300 mb-2">นามสกุล</label>
                <input 
                  type="text" 
                  v-model="profile.lastName"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="นามสกุล"
                />
              </div>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">อีเมล</label>
              <input 
                type="email" 
                v-model="profile.email"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">เบอร์โทรศัพท์</label>
              <input 
                type="tel" 
                v-model="profile.phone"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="081-xxx-xxxx"
              />
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">เกี่ยวกับ</h2>
          <div>
            <label class="block text-gray-300 mb-2">คำอธิบาย</label>
            <textarea 
              v-model="profile.bio"
              rows="4"
              class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
              placeholder="เกี่ยวกับคุณ..."
            ></textarea>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">บันทึกการตั้งค่า</h2>
          <button 
            @click="saveProfile"
            class="btn-primary w-full mb-3"
          >
            บันทึกโปรไฟล์
          </button>
          <button 
            @click="cancelEdit"
            class="btn-secondary w-full"
          >
            ยกเลิก
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

const profile = ref({
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  phone: '',
  bio: ''
})

const saveProfile = () => {
  // Add save logic here
  console.log('Saving profile:', profile.value)
  alert('บันทึกโปรไฟล์สำเร็จ')
}

const cancelEdit = () => {
  // Add cancel logic here
  console.log('Canceling edit')
}
</script>

