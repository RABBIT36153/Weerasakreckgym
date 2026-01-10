<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">ความปลอดภัย</h1>
      <p class="text-gray-400">จัดการการตั้งค่าความปลอดภัยของบัญชี</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">เปลี่ยนรหัสผ่าน</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">รหัสผ่านปัจจุบัน</label>
              <input 
                type="password" 
                v-model="passwordForm.currentPassword"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">รหัสผ่านใหม่</label>
              <input 
                type="password" 
                v-model="passwordForm.newPassword"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">ยืนยันรหัสผ่านใหม่</label>
              <input 
                type="password" 
                v-model="passwordForm.confirmPassword"
                class="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-red-primary"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div class="card mb-6">
          <h2 class="text-xl font-bold text-white mb-4">การเข้าสู่ระบบ</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">ยืนยันตัวตนแบบสองขั้นตอน (2FA)</label>
                <p class="text-sm text-gray-500">เพิ่มความปลอดภัยให้บัญชีของคุณด้วย 2FA</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="security.twoFactor" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-gray-300 mb-1">แจ้งเตือนการเข้าสู่ระบบ</label>
                <p class="text-sm text-gray-500">รับการแจ้งเตือนเมื่อมีการเข้าสู่ระบบจากอุปกรณ์ใหม่</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="security.loginNotifications" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-bold text-white mb-4">เซสชันที่ใช้งานอยู่</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-dark-card rounded-lg">
              <div>
                <p class="text-white font-medium">เบราว์เซอร์ปัจจุบัน</p>
                <p class="text-sm text-gray-500">Chrome on Windows • 192.168.1.1</p>
                <p class="text-xs text-gray-600">เข้าสู่ระบบเมื่อ 2 ชั่วโมงที่แล้ว</p>
              </div>
              <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">ใช้งานอยู่</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-dark-card rounded-lg">
              <div>
                <p class="text-white font-medium">Mobile Safari</p>
                <p class="text-sm text-gray-500">iPhone • 192.168.1.2</p>
                <p class="text-xs text-gray-600">เข้าสู่ระบบเมื่อ 5 วันที่แล้ว</p>
              </div>
              <button class="text-red-400 hover:text-red-300 text-sm">ยกเลิก</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-24">
          <h2 class="text-xl font-bold text-white mb-4">บันทึกการตั้งค่า</h2>
          <button 
            @click="saveSecurity"
            class="btn-primary w-full mb-3"
          >
            บันทึกการตั้งค่า
          </button>
          <button 
            @click="changePassword"
            class="btn-secondary w-full"
            :disabled="!passwordForm.newPassword || !passwordForm.confirmPassword"
          >
            เปลี่ยนรหัสผ่าน
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

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const security = ref({
  twoFactor: false,
  loginNotifications: true
})

const saveSecurity = () => {
  // Add save logic here
  console.log('Saving security settings:', security.value)
  alert('บันทึกการตั้งค่าความปลอดภัยสำเร็จ')
}

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('รหัสผ่านใหม่ไม่ตรงกัน')
    return
  }
  // Add password change logic here
  console.log('Changing password')
  alert('เปลี่ยนรหัสผ่านสำเร็จ')
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}
</script>

