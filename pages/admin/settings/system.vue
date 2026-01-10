<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">ระบบ</h1>
      <p class="text-gray-400">จัดการการตั้งค่าระบบและการบำรุงรักษา</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">ข้อมูลระบบ</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-dark-card rounded-lg">
                <p class="text-sm text-gray-500 mb-1">เวอร์ชัน</p>
                <p class="text-white font-bold">v1.0.0</p>
              </div>
              <div class="p-4 bg-dark-card rounded-lg">
                <p class="text-sm text-gray-500 mb-1">ฐานข้อมูล</p>
                <p class="text-white font-bold">MongoDB</p>
              </div>
              <div class="p-4 bg-dark-card rounded-lg">
                <p class="text-sm text-gray-500 mb-1">Node.js</p>
                <p class="text-white font-bold">v18.x</p>
              </div>
              <div class="p-4 bg-dark-card rounded-lg">
                <p class="text-sm text-gray-500 mb-1">สถานะ</p>
                <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">ทำงานปกติ</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">การสำรองข้อมูล</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-dark-card rounded-lg">
              <div>
                <p class="text-white font-medium mb-1">การสำรองข้อมูลล่าสุด</p>
                <p class="text-sm text-gray-500">2024-01-15 10:30 AM</p>
              </div>
              <button class="btn-primary">สำรองข้อมูลตอนนี้</button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">สำรองข้อมูลอัตโนมัติ</label>
                <p class="text-sm text-gray-500">สำรองข้อมูลทุกวันเวลา 02:00 AM</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="system.autoBackup" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="card mb-6">
          <h2 class="text-xl font-bold text-red-400 mb-4">โซนอันตราย</h2>
          <div class="space-y-4">
            <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h3 class="text-white font-bold mb-2">ล้างข้อมูลระบบ</h3>
              <p class="text-gray-400 text-sm mb-4">การดำเนินการนี้จะลบข้อมูลทั้งหมดและไม่สามารถย้อนกลับได้</p>
              <button 
                @click="handleClearCache"
                class="btn-secondary mr-2"
              >
                ล้างแคช
              </button>
              <button 
                @click="handleResetSystem"
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                รีเซ็ตระบบ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24 mb-6">
          <h2 class="text-xl font-bold text-white mb-4">การบำรุงรักษา</h2>
          <button 
            @click="handleOptimize"
            class="btn-primary w-full mb-3"
          >
            เพิ่มประสิทธิภาพฐานข้อมูล
          </button>
          <button 
            @click="handleClearLogs"
            class="btn-secondary w-full mb-3"
          >
            ล้างบันทึกระบบ
          </button>
          <button 
            @click="handleExportData"
            class="btn-secondary w-full"
          >
            ส่งออกข้อมูล
          </button>
        </div>

        <div class="card sticky top-96">
          <h2 class="text-xl font-bold text-white mb-4">บันทึกการตั้งค่า</h2>
          <button 
            @click="saveSystemSettings"
            class="btn-primary w-full"
          >
            บันทึกการตั้งค่า
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

const system = ref({
  autoBackup: true
})

const saveSystemSettings = () => {
  // Add save logic here
  console.log('Saving system settings:', system.value)
  alert('บันทึกการตั้งค่าระบบสำเร็จ')
}

const handleBackup = () => {
  // Add backup logic here
  alert('กำลังสำรองข้อมูล...')
}

const handleOptimize = () => {
  if (confirm('คุณต้องการเพิ่มประสิทธิภาพฐานข้อมูลหรือไม่?')) {
    // Add optimize logic here
    alert('กำลังเพิ่มประสิทธิภาพฐานข้อมูล...')
  }
}

const handleClearCache = () => {
  if (confirm('คุณต้องการล้างแคชหรือไม่?')) {
    // Add clear cache logic here
    alert('ล้างแคชสำเร็จ')
  }
}

const handleClearLogs = () => {
  if (confirm('คุณต้องการล้างบันทึกระบบหรือไม่?')) {
    // Add clear logs logic here
    alert('ล้างบันทึกระบบสำเร็จ')
  }
}

const handleExportData = () => {
  // Add export logic here
  alert('กำลังส่งออกข้อมูล...')
}

const handleResetSystem = () => {
  if (confirm('คุณแน่ใจหรือไม่? การดำเนินการนี้จะรีเซ็ตระบบทั้งหมดและไม่สามารถย้อนกลับได้!')) {
    // Add reset logic here
    alert('กำลังรีเซ็ตระบบ...')
  }
}
</script>

