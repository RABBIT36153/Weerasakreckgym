<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">จัดการหน้าแรก</h1>
      <p class="text-gray-400">จัดการเนื้อหาและรูปภาพในหน้าแรก</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <!-- Hero Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">Hero Section</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">ข้อความหลัก</label>
              <input 
                type="text" 
                v-model="homepageSettings.heroTitle"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="ยินดีต้อนรับสู่ Muay Thai Academy"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ข้อความย่อย</label>
              <textarea 
                v-model="homepageSettings.heroSubtitle"
                rows="2"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="โรงเรียนมวยไทยคุณภาพ..."
              ></textarea>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ปุ่มที่ 1 - ข้อความ</label>
              <input 
                type="text" 
                v-model="homepageSettings.heroButton1Text"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="ดูคอร์สเรียน"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ปุ่มที่ 1 - ลิงก์</label>
              <input 
                type="text" 
                v-model="homepageSettings.heroButton1Link"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="/courses"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ปุ่มที่ 2 - ข้อความ</label>
              <input 
                type="text" 
                v-model="homepageSettings.heroButton2Text"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="ดูครูมวย"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ปุ่มที่ 2 - ลิงก์</label>
              <input 
                type="text" 
                v-model="homepageSettings.heroButton2Link"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="/trainers"
              />
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">เกี่ยวกับเรา</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">หัวข้อ</label>
              <input 
                type="text" 
                v-model="homepageSettings.aboutTitle"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="เกี่ยวกับเรา"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">เนื้อหา</label>
              <textarea 
                v-model="homepageSettings.aboutContent"
                rows="5"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="เนื้อหาเกี่ยวกับเรา..."
              ></textarea>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">รูปภาพ</label>
              <div v-if="homepageSettings.aboutImage" class="mb-2">
                <img 
                  :src="getImageUrl(homepageSettings.aboutImage)" 
                  alt="About" 
                  class="h-32 object-cover rounded-lg border border-dark-border"
                />
                <button @click="removeAboutImage" class="mt-2 text-red-400 text-sm">ลบรูปภาพ</button>
              </div>
              <input
                ref="aboutImageInput"
                type="file"
                accept="image/*"
                @change="handleAboutImageUpload"
                class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-primary file:text-white hover:file:bg-red-hover"
              />
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">จุดเด่นของเรา</h2>
          <div class="space-y-4">
            <div v-for="(feature, index) in homepageSettings.features" :key="index" class="p-4 bg-dark-surface rounded-lg border border-dark-border">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-white font-semibold">จุดเด่น {{ index + 1 }}</h3>
                <button @click="removeFeature(index)" class="text-red-400 text-sm">ลบ</button>
              </div>
              <div class="space-y-2">
                <input 
                  type="text" 
                  v-model="feature.title"
                  placeholder="หัวข้อ"
                  class="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-white text-sm focus:outline-none focus:border-red-primary"
                />
                <textarea 
                  v-model="feature.description"
                  rows="2"
                  placeholder="คำอธิบาย"
                  class="w-full px-3 py-2 bg-dark-card border border-dark-border rounded text-white text-sm focus:outline-none focus:border-red-primary"
                ></textarea>
              </div>
            </div>
            <button @click="addFeature" class="btn-secondary w-full">เพิ่มจุดเด่น</button>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">บันทึกการตั้งค่า</h2>
          <button 
            @click="saveHomepageSettings"
            class="btn-primary w-full mb-3"
          >
            บันทึกการตั้งค่า
          </button>
          <button 
            @click="resetHomepageSettings"
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

const aboutImageInput = ref(null)

const homepageSettings = ref({
  heroTitle: 'ยินดีต้อนรับสู่ Muay Thai Academy',
  heroSubtitle: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน',
  heroButton1Text: 'ดูคอร์สเรียน',
  heroButton1Link: '/courses',
  heroButton2Text: 'ดูครูมวย',
  heroButton2Link: '/trainers',
  aboutTitle: 'เกี่ยวกับเรา',
  aboutContent: '',
  aboutImage: '',
  features: [
    { title: 'คอร์สเรียนมวยไทย', description: 'เรียนมวยไทยกับครูมวยมืออาชีพ' },
    { title: 'ครูมวยมืออาชีพ', description: 'เรียนแบบตัวต่อตัวหรือกลุ่มเล็ก' }
  ]
})

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/')) return `/api/uploads${url}`
  return `/api/uploads/${url}`
}

const handleAboutImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    const response = await $fetch('/api/upload', { method: 'POST', body: formData })
    if (response.success) homepageSettings.value.aboutImage = response.url
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ')
  }
}

const removeAboutImage = () => {
  homepageSettings.value.aboutImage = ''
  if (aboutImageInput.value) aboutImageInput.value.value = ''
}

const addFeature = () => {
  homepageSettings.value.features.push({ title: '', description: '' })
}

const removeFeature = (index) => {
  homepageSettings.value.features.splice(index, 1)
}

const saveHomepageSettings = () => {
  console.log('Saving homepage settings:', homepageSettings.value)
  alert('บันทึกการตั้งค่าหน้าแรกสำเร็จ')
}

const resetHomepageSettings = () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    homepageSettings.value = {
      heroTitle: 'ยินดีต้อนรับสู่ Muay Thai Academy',
      heroSubtitle: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน',
      heroButton1Text: 'ดูคอร์สเรียน',
      heroButton1Link: '/courses',
      heroButton2Text: 'ดูครูมวย',
      heroButton2Link: '/trainers',
      aboutTitle: 'เกี่ยวกับเรา',
      aboutContent: '',
      aboutImage: '',
      features: [
        { title: 'คอร์สเรียนมวยไทย', description: 'เรียนมวยไทยกับครูมวยมืออาชีพ' },
        { title: 'ครูมวยมืออาชีพ', description: 'เรียนแบบตัวต่อตัวหรือกลุ่มเล็ก' }
      ]
    }
  }
}
</script>

