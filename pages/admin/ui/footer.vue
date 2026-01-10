<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการ Footer</h1>
      <p class="text-gray-400">จัดการเนื้อหาและข้อมูลใน Footer</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <!-- Company Info -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">ข้อมูลบริษัท</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">ชื่อบริษัท</label>
              <input 
                type="text" 
                v-model="footerSettings.companyName"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="Muay Thai Academy"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">คำอธิบาย</label>
              <textarea 
                v-model="footerSettings.description"
                rows="3"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="คำอธิบายบริษัท..."
              ></textarea>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ที่อยู่</label>
              <textarea 
                v-model="footerSettings.address"
                rows="2"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="ที่อยู่บริษัท..."
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">เบอร์โทรศัพท์</label>
                <input 
                  type="tel" 
                  v-model="footerSettings.phone"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="02-xxx-xxxx"
                />
              </div>
              <div>
                <label class="block text-gray-300 mb-2">อีเมล</label>
                <input 
                  type="email" 
                  v-model="footerSettings.email"
                  class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                  placeholder="info@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">Social Media</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">Facebook</label>
              <input 
                type="url" 
                v-model="footerSettings.social.facebook"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">Instagram</label>
              <input 
                type="url" 
                v-model="footerSettings.social.instagram"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">YouTube</label>
              <input 
                type="url" 
                v-model="footerSettings.social.youtube"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">Line</label>
              <input 
                type="text" 
                v-model="footerSettings.social.line"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="@linename"
              />
            </div>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">ลิงก์ใน Footer</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">ลิงก์สำรอง 1</label>
              <div class="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  v-model="footerSettings.footerLinks[0].text"
                  placeholder="ข้อความ"
                  class="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                />
                <input 
                  type="text" 
                  v-model="footerSettings.footerLinks[0].url"
                  placeholder="/link"
                  class="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ลิงก์สำรอง 2</label>
              <div class="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  v-model="footerSettings.footerLinks[1].text"
                  placeholder="ข้อความ"
                  class="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                />
                <input 
                  type="text" 
                  v-model="footerSettings.footerLinks[1].url"
                  placeholder="/link"
                  class="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">ตัวอย่าง Footer</h2>
          <div class="bg-dark-bg rounded-lg p-4 border border-dark-border text-sm">
            <div class="mb-4">
              <h3 class="text-white font-bold mb-2">{{ footerSettings.companyName || 'Company Name' }}</h3>
              <p class="text-gray-400 text-xs mb-2">{{ footerSettings.description || 'Description' }}</p>
              <p class="text-gray-400 text-xs">{{ footerSettings.address || 'Address' }}</p>
              <p class="text-gray-400 text-xs mt-2">
                Tel: {{ footerSettings.phone || '-' }} | 
                Email: {{ footerSettings.email || '-' }}
              </p>
            </div>
            <div class="flex space-x-2 mb-4">
              <span v-if="footerSettings.social.facebook" class="text-gray-400">📘</span>
              <span v-if="footerSettings.social.instagram" class="text-gray-400">📷</span>
              <span v-if="footerSettings.social.youtube" class="text-gray-400">▶️</span>
              <span v-if="footerSettings.social.line" class="text-gray-400">💬</span>
            </div>
            <div class="text-xs text-gray-500">
              © {{ new Date().getFullYear() }} {{ footerSettings.companyName || 'Company' }}. All rights reserved.
            </div>
          </div>
          <button 
            @click="saveFooterSettings"
            class="btn-primary w-full mb-3 mt-4"
          >
            บันทึกการตั้งค่า
          </button>
          <button 
            @click="resetFooterSettings"
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

const footerSettings = ref({
  companyName: 'Muay Thai Academy',
  description: 'โรงเรียนมวยไทยคุณภาพ',
  address: '',
  phone: '',
  email: '',
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    line: ''
  },
  footerLinks: [
    { text: 'เกี่ยวกับเรา', url: '/about' },
    { text: 'ติดต่อเรา', url: '/contact' }
  ]
})

const saveFooterSettings = () => {
  console.log('Saving footer settings:', footerSettings.value)
  alert('บันทึกการตั้งค่า Footer สำเร็จ')
}

const resetFooterSettings = () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    footerSettings.value = {
      companyName: 'Muay Thai Academy',
      description: 'โรงเรียนมวยไทยคุณภาพ',
      address: '',
      phone: '',
      email: '',
      social: {
        facebook: '',
        instagram: '',
        youtube: '',
        line: ''
      },
      footerLinks: [
        { text: 'เกี่ยวกับเรา', url: '/about' },
        { text: 'ติดต่อเรา', url: '/contact' }
      ]
    }
  }
}
</script>

