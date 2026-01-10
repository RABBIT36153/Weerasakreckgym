<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">ธีมและสี</h1>
      <p class="text-gray-400">ปรับแต่งธีมและสีของระบบ</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">ธีมสี</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-3">เลือกธีมสีหลัก</label>
              <div class="grid grid-cols-4 gap-4">
                <div 
                  v-for="theme in themes" 
                  :key="theme.name"
                  @click="selectedTheme = theme.name"
                  class="cursor-pointer p-4 rounded-lg border-2 transition-all"
                  :class="selectedTheme === theme.name ? 'border-red-primary bg-red-primary/10' : 'border-dark-border hover:border-gray-600'"
                >
                  <div class="w-full h-16 rounded mb-2" :style="{ backgroundColor: theme.color }"></div>
                  <p class="text-center text-sm text-gray-300">{{ theme.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">โหมดสี</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">โหมดมืด</label>
                <p class="text-sm text-gray-500">ใช้ธีมสีมืดสำหรับระบบ</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="themeSettings.darkMode" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">โหมดอัตโนมัติ</label>
                <p class="text-sm text-gray-500">เปลี่ยนธีมตามการตั้งค่าระบบ</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="themeSettings.autoMode" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">ขนาดตัวอักษร</h2>
          <div>
            <label class="block text-gray-300 mb-3">ขนาด</label>
            <div class="flex space-x-4">
              <button 
                v-for="size in fontSizes"
                :key="size"
                @click="themeSettings.fontSize = size"
                class="px-4 py-2 rounded-lg border transition-all"
                :class="themeSettings.fontSize === size ? 'border-red-primary bg-red-primary/10 text-white' : 'border-dark-border text-gray-400 hover:border-gray-600'"
              >
                {{ size }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">ตัวอย่าง</h2>
          <div class="p-4 bg-dark-card rounded-lg mb-4">
            <h3 class="text-white font-bold mb-2">ตัวอย่างการ์ด</h3>
            <p class="text-gray-400 text-sm">นี่คือตัวอย่างข้อความในธีมที่เลือก</p>
            <button class="mt-3 px-4 py-2 bg-red-primary text-white rounded hover:bg-red-600">
              ปุ่มตัวอย่าง
            </button>
          </div>
          <button 
            @click="saveTheme"
            class="btn-primary w-full mb-3"
          >
            บันทึกธีม
          </button>
          <button 
            @click="resetTheme"
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

const selectedTheme = ref('red')
const themeSettings = ref({
  darkMode: true,
  autoMode: false,
  fontSize: 'medium'
})

const themes = [
  { name: 'red', label: 'แดง', color: '#dc2626' },
  { name: 'blue', label: 'น้ำเงิน', color: '#2563eb' },
  { name: 'green', label: 'เขียว', color: '#16a34a' },
  { name: 'purple', label: 'ม่วง', color: '#9333ea' }
]

const fontSizes = ['small', 'medium', 'large']

const saveTheme = () => {
  // Add save logic here
  console.log('Saving theme:', { selectedTheme: selectedTheme.value, settings: themeSettings.value })
  alert('บันทึกธีมสำเร็จ')
}

const resetTheme = () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตธีม?')) {
    selectedTheme.value = 'red'
    themeSettings.value = {
      darkMode: true,
      autoMode: false,
      fontSize: 'medium'
    }
  }
}
</script>

