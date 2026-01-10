<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">การแจ้งเตือน</h1>
      <p class="text-gray-400">จัดการการตั้งค่าการแจ้งเตือน</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">อีเมล</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">การลงทะเบียนใหม่</label>
                <p class="text-sm text-gray-500">รับการแจ้งเตือนเมื่อมีการลงทะเบียนใหม่</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.email.newRegistrations" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">คำขอจ้างงาน</label>
                <p class="text-sm text-gray-500">รับการแจ้งเตือนเมื่อมีการขอจ้างครูมวย</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.email.hireRequests" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">รายงานรายสัปดาห์</label>
                <p class="text-sm text-gray-500">รับสรุปข้อมูลรายสัปดาห์ทางอีเมล</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.email.weeklyReport" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">การแจ้งเตือนในระบบ</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">การแจ้งเตือนแบบป๊อปอัป</label>
                <p class="text-sm text-gray-500">แสดงการแจ้งเตือนแบบป๊อปอัปบนหน้าจอ</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.inApp.popup" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">เสียงแจ้งเตือน</label>
                <p class="text-sm text-gray-500">เล่นเสียงเมื่อมีการแจ้งเตือนใหม่</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifications.inApp.sound" class="sr-only peer">
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
            @click="saveNotifications"
            class="btn-primary w-full mb-3"
          >
            บันทึกการตั้งค่า
          </button>
          <button 
            @click="resetNotifications"
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

const notifications = ref({
  email: {
    newRegistrations: true,
    hireRequests: true,
    weeklyReport: false
  },
  inApp: {
    popup: true,
    sound: false
  }
})

const saveNotifications = () => {
  // Add save logic here
  console.log('Saving notifications:', notifications.value)
  alert('บันทึกการตั้งค่าการแจ้งเตือนสำเร็จ')
}

const resetNotifications = () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่า?')) {
    notifications.value = {
      email: {
        newRegistrations: true,
        hireRequests: true,
        weeklyReport: false
      },
      inApp: {
        popup: true,
        sound: false
      }
    }
  }
}
</script>

